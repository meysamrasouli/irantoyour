import * as React from "react";
import { useRef, useState } from "react";
import ArcOtpInput from "@/components/ui/arc_input_otp";
import ArcCountdownTimer from "@/components/ui/arc_countDownTimer";
import { validate } from "@/shared/utils/validationUtils";
import { convertToEnglishDigits } from "@/shared/utils/convertUtils";
import { axiosClient } from "@/shared/utils/axiosUtils";

//==================================================| Types
type MessageClass = '' | 'error' | 'success';
interface MessageStateInterface {
    class: MessageClass;
    content: string;
}

export default function Login() {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const [countdownTimer, setCountdownTimer] = useState(0);
    const [message, setMessage] = useState<MessageStateInterface>({ class: '', content: '' });
    const [sendOtpDisabled, setSendOtpDisabled] = useState(false);
    const [loginDisabled, setLoginDisabled] = useState(true);

    // FIX: state (setSendOtpDisabled/setLoginDisabled) آسنکرونه، پس به‌تنهایی نمی‌تونه جلوی
    // فراخوانی هم‌زمان/سریع دوباره رو بگیره (مثلاً دو بار Enter خیلی سریع، یا OTP که دوبار کامل بشه).
    // این ref ها به‌عنوان یک قفل واقعی و فوری (سنکرون) عمل می‌کنن.
    const isSendingOtpRef = useRef(false);
    const isLoggingInRef = useRef(false);

    //==================================================| Events
    const onClickSendOtp = async () => {
        if (isSendingOtpRef.current) return;
        isSendingOtpRef.current = true;

        setMessage({ class: '', content: '' });

        const cleanMobile = convertToEnglishDigits(mobile);
        setMobile(cleanMobile);

        const error = validate(cleanMobile, ['notEmpty', 'mobile'], true);
        if (error) {
            setMessage({ class: 'error', content: error });
            isSendingOtpRef.current = false;
            return;
        }

        setSendOtpDisabled(true);

        try {
            const response = await axiosClient.post('/login/send_otp', { mobile: cleanMobile });

            if (response.data === '') {
                setMessage({ class: 'success', content: `کد امنیتی به شماره ${cleanMobile} ارسال شد` });
                setCountdownTimer(120);
            } else {
                // بک‌اند وقتی هنوز زمان کافی از ارسال قبلی نگذشته، ثانیه‌های باقی‌مانده رو برمی‌گردونه
                setMessage({ class: 'error', content: 'برای ارسال مجدد منتظر بمانید' });
                setCountdownTimer(Number(response.data));
            }

            setLoginDisabled(false);
            setStep(2);
        } catch {
            setSendOtpDisabled(false);
            setMessage({ class: 'error', content: 'اطلاعات وارد شده اشتباه است' });
        } finally {
            isSendingOtpRef.current = false;
        }
    };

    const onEndedCountdown = () => {
        setCountdownTimer(0);
        setSendOtpDisabled(false);
    };

    const onClickEditMobile = () => {
        setStep(1);
        setOtp('');
        setMessage({ class: '', content: '' });
        setCountdownTimer(0);
    };

    /**
     * @param otpOverride - مقدار تازه‌ی OTP که مستقیم از ArcOtpInput.onComplete میاد (نه از state خونده بشه،
     * چون setOtp هنوز commit نشده - همون درسی که قبلاً چندبار در این پروژه به‌کار بردیم)
     */
    const onClickLogin = async (otpOverride?: string) => {
        if (isLoggingInRef.current) return;
        isLoggingInRef.current = true;

        setMessage({ class: '', content: '' });

        const cleanMobile = convertToEnglishDigits(mobile);
        const mobileError = validate(cleanMobile, ['notEmpty', 'mobile'], true);
        if (mobileError) {
            setMessage({ class: 'error', content: mobileError });
            isLoggingInRef.current = false;
            return;
        }

        const cleanOtp = convertToEnglishDigits(otpOverride ?? otp);
        const otpError = validate(cleanOtp, ['notEmpty', 'integer', { length_fix: 5 }], true);
        if (otpError) {
            setMessage({ class: 'error', content: otpError });
            isLoggingInRef.current = false;
            return;
        }

        setLoginDisabled(true);

        try {
            const response = await axiosClient.post<{ token: string }>('/login', { mobile: cleanMobile, otp: cleanOtp });
            localStorage.setItem('tokenUser', response.data.token); // sanctum bearer token
            window.location.href = '/profile';
        } catch (error: any) {
            setMessage({ class: 'error', content: error?.response?.data?.message ?? 'ورود ناموفق بود' });
            setLoginDisabled(false);
            isLoggingInRef.current = false;
        }
    };

    return (
        <main className="login">
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-header">
                        <img src="/images/logo/logo.svg" alt="" />

                        {message.content !== '' && (
                            <div className={`login-message message-${message.class}`} role="alert" aria-live="polite">
                                {message.content}
                            </div>
                        )}
                    </div>

                    <div className="login-body">
                        {/*--------------------| step 1 |--------------------*/}
                        {step === 1 && (
                            <div className="login-steps">
                                <div>برای ورود شماره تلفن همراه خود را وارد کنید.</div>

                                <input
                                    type="text"
                                    className="form-control"
                                    inputMode="numeric"
                                    maxLength={11}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !sendOtpDisabled) onClickSendOtp(); }}
                                    placeholder="شماره موبایل"
                                />

                                <div className="button-container">
                                    <button type="button" className="custom-button" onClick={onClickSendOtp} disabled={sendOtpDisabled}>
                                        ادامه
                                    </button>
                                </div>
                            </div>
                        )}

                        {/*--------------------| step 2 |--------------------*/}
                        {step === 2 && (
                            <div className="login-steps">
                                <div className="otp-header">
                                    <span>{mobile}</span>
                                    <button type="button" className="link-button" onClick={onClickEditMobile}>ویرایش شماره</button>
                                </div>

                                <div className="otp-container">
                                    <ArcOtpInput
                                        inputCount={5}
                                        value={otp}
                                        setValue={setOtp}
                                        onComplete={(value) => onClickLogin(value)}
                                    />

                                    <button type="button" onClick={onClickSendOtp} disabled={sendOtpDisabled} className="custom-button-trans-primary">
                                        {countdownTimer > 0 ? (
                                            <span>اعتبار کد یکبار مصرف تا: <ArcCountdownTimer until={countdownTimer} type="m:s" onEnded={onEndedCountdown} /></span>
                                        ) : (
                                            <span><i className="fa-regular fa-rotate-left" /> ارسال مجدد</span>
                                        )}
                                    </button>
                                </div>

                                <div className="button-container">
                                    <button type="button" className="custom-button" onClick={() => onClickLogin()} disabled={loginDisabled}>
                                        ورود به سایت
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="login-image" />
        </main>
    );
}
