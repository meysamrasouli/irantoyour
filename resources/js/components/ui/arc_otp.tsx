import * as React from "react";
import {useRef, useState, useEffect, forwardRef, useImperativeHandle} from "react";
import ArcOtpInput from "@/components/ui/arc_input_otp";
import ArcCountdownTimer from "@/components/ui/arc_countDownTimer";
import type { SendOtpResultInterface } from "@/shared/api/auth";

interface ArcOtpPropsInterface {
    mobile: string,
    sendOtp: () => Promise<SendOtpResultInterface>,// ارسال کد (پیاده‌سازی در صفحه)
    setMessage: (value: MessageInterface) => void,
    onComplete: (otp: string) => void,// when all the inputs are filled, it is called
    onBack?: () => void,// رفتن به مرحله قبلی (ویرایش شماره در صفحه لاگین / بازگشت در ثبت‌نام)
    showSubmit?: boolean,// login pages: show the "ورود به سایت" button
}
export interface MessageInterface {
    type: "" | "info" | "error";
    content: string;
}

export interface ArcOtpRefInterface {
    sendOtp: () => Promise<void>;
    getOtpValue: () => string;
}

/**
 * todo: everytime this component created a request send to server - although only one SMS send to user
 * but still there is no limit to user's request. i should keep the remaining time with the related mobile number
 * in somewhere like localstorage
 * */

const ArcOtp = forwardRef<ArcOtpRefInterface, ArcOtpPropsInterface>(
    function ArcOtp({ mobile, sendOtp, setMessage, onComplete, onBack, showSubmit = false }, ref) {
        const [otp, setOtp] = useState<string>('')
        const [countdownTimer, setCountdownTimer] = useState(0);

        const [sendOtpDisabled, setSendOtpDisabled] = useState(false);
        const isSendingOtpRef = useRef(false);

        const handleSendOtp = async () => {
            if (isSendingOtpRef.current) return;// lock the function
            isSendingOtpRef.current = true;

            setMessage({ type: '', content: '' });// clear message
            setSendOtpDisabled(true);

            //------------------------------| send otp (پیاده‌سازی در صفحه از طریق auth.ts)
            try {
                const result = await sendOtp();

                if (result.remainingSeconds === 0) {
                    //setMessage({type: 'info', content: `کد امنیتی به شماره ${mobile} ارسال شد`});
                    setCountdownTimer(120);
                } else {
                    setMessage({type: 'info', content: 'برای ارسال مجدد منتظر بمانید'});
                    setCountdownTimer(result.remainingSeconds);
                }
            } catch {
                setSendOtpDisabled(false);
                setMessage({type: 'error', content: 'اطلاعات وارد شده اشتباه است'});
            } finally {
                isSendingOtpRef.current = false;
            }
        };
        // send the otp as soon as mobile changed
        useEffect(() => {
            void handleSendOtp();
        }, [mobile]);

        const onEndedCountdown = () => {
            setCountdownTimer(0);
            setSendOtpDisabled(false);
        };

        const submitOtp = () => {
            if (otp.length !== 5) return;
            onComplete(otp);
        };

        useImperativeHandle(ref, () => ({
            sendOtp: handleSendOtp,
            getOtpValue: () => otp,
        }));

        return (
            <div className="arc-otp">

                <a className="hyper-link" onClick={(e) => { e.preventDefault(); onBack?.(); }}>ویرایش شماره همراه</a>

                <ArcOtpInput
                    inputCount={5}
                    value={otp}
                    setValue={setOtp}
                    onComplete={onComplete}
                />

                <button type="button" onClick={handleSendOtp} disabled={sendOtpDisabled} className="custom-button-trans-text">
                    {countdownTimer > 0 ? (
                        <span>ارسال مجدد کد تا <ArcCountdownTimer until={countdownTimer} type="m:s" onEnded={onEndedCountdown} /> دیگر</span>
                    ) : (
                        <span><i className="fa-regular fa-rotate-left icon-right" />ارسال مجدد</span>
                    )}
                </button>

                {showSubmit && (
                    <div className="button-container">
                        <button type="button" className="custom-button-primary" onClick={submitOtp} disabled={otp.length !== 5}>ورود به سایت</button>
                    </div>
                )}
            </div>
        )
    }
)
ArcOtp.displayName = 'ArcOtp';
export default ArcOtp;
