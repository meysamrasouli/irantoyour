import * as React from "react";
import {useRef, useState, forwardRef, useImperativeHandle} from "react";
import ArcOtpInput from "@/components/ui/arc_input_otp";
import ArcCountdownTimer from "@/components/ui/arc_countDownTimer";
import {convertToEnglishDigits} from "@/shared/utils/convertUtils";
import {validate} from "@/shared/utils/validationUtils";
import {axiosClient} from "@/shared/utils/axiosUtils";

interface ArcOtpPropsInterface {
    page: "register" | "loginUser" | "loginPersonnel",
    mobile: string,
    setMessage: (value: MessageInterface) => void,
    onComplete?: () => void;// when all the inputs are filled, it is called
}
export interface MessageInterface {
    type: "" | "info" | "error";
    content: string;
}

export interface ArcOtpRefInterface {
    sendOtp: () => Promise<void>;
    getMobileValue: () => string;
    getOtpValue: () => string;
}


const ArcOtp = forwardRef<ArcOtpRefInterface, ArcOtpPropsInterface>(
    function ArcOtp({ page, mobile, setMessage, onComplete }, ref) {
        const [otp, setOtp] = useState<string>('')
        const [countdownTimer, setCountdownTimer] = useState(0);

        const [sendOtpDisabled, setSendOtpDisabled] = useState(false);
        const [loginDisabled, setLoginDisabled] = useState(true);
        const isSendingOtpRef = useRef(false);
        const isLoggingInRef = useRef(false);

        const sendOtp = async () => {
            if (isSendingOtpRef.current) return;// lock the function
            isSendingOtpRef.current = true;

            setMessage({ type: '', content: '' });// clear message

            //------------------------------| validate mobile
            const cleanMobile = convertToEnglishDigits(mobile);
            const error = validate(cleanMobile, ['notEmpty', 'mobile'], true);
            if (error) {
                setMessage({ type: 'error', content: error });
                isSendingOtpRef.current = false;// unlock function
                return;
            }
            setSendOtpDisabled(true);

            //------------------------------| send otp
            try {
                const loginUrl = {
                    register: '/register-auth/send-otp',
                    loginUser: '/login/send-otp',
                    loginPersonnel: '/dashboard/login/send-otp'
                }
                const response = await axiosClient.post(loginUrl[page], { mobile: cleanMobile })

                if (response.data === '') {
                    setMessage({type: 'info', content: `کد امنیتی به شماره ${cleanMobile} ارسال شد`});
                    setCountdownTimer(120);
                } else {
                    setMessage({type: 'error', content: 'برای ارسال مجدد منتظر بمانید'});
                    setCountdownTimer(Number(response.data));
                }
            } catch {
                setSendOtpDisabled(false);
                setMessage({type: 'error', content: 'اطلاعات وارد شده اشتباه است'});
            } finally {
                isSendingOtpRef.current = false;
            }
        };
        const onEndedCountdown = () => {
            setCountdownTimer(0);
            setSendOtpDisabled(false);
        };

        const checkOtp = async (otpOverride?: string) => {
            if (isLoggingInRef.current) return;// lock the function
            isLoggingInRef.current = true;

            setMessage({ type: '', content: '' });

            //------------------------------| validate mobile
            const cleanMobile = convertToEnglishDigits(mobile);
            const error = validate(cleanMobile, ['notEmpty', 'mobile'], true);
            if (error) {
                setMessage({ type: 'error', content: error });
                isLoggingInRef.current = false;// unlock function
                return;
            }
            //------------------------------| validate otp
            const cleanOtp = convertToEnglishDigits(otpOverride ?? otp);
            const otpError = validate(cleanOtp, ['notEmpty', 'integer', { length_fix: 5 }], true);
            if (otpError) {
                setMessage({ type: 'error', content: otpError });
                isLoggingInRef.current = false;
                return;
            }

            //------------------------------| check otp
            switch (page){
                case 'register':
                    try {
                        await axiosClient.post<{ token: string }>('/register-auth', { mobile: cleanMobile, otp: cleanOtp });
                        onComplete?.()// callback function
                    } catch (error: any) {
                        setMessage({ type: 'error', content: error?.response?.data?.message ?? 'ورود ناموفق بود' });
                    }finally {
                        isLoggingInRef.current = false;
                    }
                    break;
                case 'loginUser':
                case 'loginPersonnel':
                    setLoginDisabled(true);

                    try {
                        let intendedUrl: string|null = null
                        if(page === 'loginUser'){
                            const response = await axiosClient.post<{ token: string, intended:string|null }>('/login', { mobile: cleanMobile, otp: cleanOtp });
                            localStorage.setItem('tokenUser', response.data.token) // sanctum bearer token user
                            intendedUrl = response.data.intended
                        }
                        if(page === 'loginPersonnel'){
                            const response = await axiosClient.post<{ token: string, intended:string|null }>('/dashboard/login', { mobile: cleanMobile, otp: cleanOtp });
                            localStorage.setItem('tokenPersonnel', response.data.token) // sanctum bearer token personnel
                            intendedUrl = response.data.intended
                        }

                        //------------------------------| redirect after login
                        if(intendedUrl){
                            window.location.href = intendedUrl
                        }else{
                            location.reload()
                        }
                    } catch (error: any) {
                        setMessage({ type: 'error', content: error?.response?.data?.message ?? 'ورود ناموفق بود' });
                        setLoginDisabled(false);
                    }finally {
                        isLoggingInRef.current = false;
                    }
                    break;
            }
        };

        useImperativeHandle(ref, () => ({
            sendOtp: sendOtp,
            getMobileValue: () => mobile,
            getOtpValue: () => otp,
        }));

        return (
            <div className="arc-otp">
                <ArcOtpInput
                    inputCount={5}
                    value={otp}
                    setValue={setOtp}
                    onComplete={(value) => checkOtp(value)}
                />

                <button type="button" onClick={sendOtp} disabled={sendOtpDisabled} className="custom-button-trans-primary-text">
                    {countdownTimer > 0 ? (
                        <span>اعتبار کد یکبار مصرف تا: <ArcCountdownTimer until={countdownTimer} type="m:s" onEnded={onEndedCountdown} /></span>
                    ) : (
                        <span><i className="fa-regular fa-rotate-left icon-right" />ارسال مجدد</span>
                    )}
                </button>

                {page !== 'register' && (
                    <div className="button-container">
                        <button type="button" className="custom-button" onClick={() => checkOtp()} disabled={loginDisabled}>ورود به سایت</button>
                    </div>
                )}
            </div>
        )
    }
)
ArcOtp.displayName = 'ArcOtp';
export default ArcOtp;
