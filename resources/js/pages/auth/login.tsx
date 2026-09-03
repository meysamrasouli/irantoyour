import * as React from "react";
import { useRef, useState } from "react";
import { validate } from "@/shared/utils/validationUtils";
import { convertToEnglishDigits } from "@/shared/utils/convertUtils";
import ArcOtp, {ArcOtpRefInterface, MessageInterface} from "@/components/ui/arc_otp";
import { apiLoginUser, apiLoginUserSendOtp, handleLoginUserResult } from "@/shared/api/auth";
import { config } from "@/shared/utils/generalUtils";
import {Link} from "@inertiajs/react";

export default function Login() {
    const [mobile, setMobile] = useState('');
    const [step, setStep] = useState<1 | 2>(1);
    const otpRef = useRef<ArcOtpRefInterface>(null)
    const [message, setMessage] = useState<MessageInterface>()

    const isLoggingInRef = useRef(false);

    //==================================================| Events
    const onClickSendOtp = () => {
        // clean mobile
        const cleanMobile = convertToEnglishDigits(mobile);
        setMobile(cleanMobile);

        // validate mobile
        const error = validate(cleanMobile, ['notEmpty', 'mobile'], true);
        if (error) {
            setMessage({ type: 'error', content: error });
            return;
        }
        // on-mount arc_otp send otp message
        setStep(2);
    }

    const onClickEditMobile = () => {
        setStep(1)
        setMessage({ type: '', content: '' });
    }

    const onSubmitOtp = async (otp: string) => {
        if (isLoggingInRef.current) return;// lock function
        isLoggingInRef.current = true;

        setMessage({ type: '', content: '' })

        try {
            const result = await apiLoginUser(mobile, otp);
            handleLoginUserResult(result);
        } catch (error: any) {
            const errorData = error?.response?.data;
            const errorMessage = errorData?.errors?.error?.[0] ?? errorData?.message ?? 'ورود ناموفق بود';
            setMessage({ type: 'error', content: errorMessage });
        } finally {
            isLoggingInRef.current = false;
        }
    };

    return (
        <main className="login">
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-header">
                        <img src="/images/logo/logo.png" alt="" />

                        <h1>ورود به <span className="accent-text">{config.APP_NAME_FA}</span></h1>

                        {(message?.content) && (
                            <div className={`notification-container ${message?.type === 'error' ? 'message-error' : 'message-info'}`}>
                                <i className={`fa-regular ${message?.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                                <p>{ message?.content }</p>
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={11}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') onClickSendOtp(); }}
                                    placeholder="شماره موبایل"
                                />

                                <div className="button-container">
                                    <button type="button" className="custom-button-primary" onClick={onClickSendOtp}>ادامه</button>
                                </div>

                                <div>حساب کاربری ندارید؟ <Link href="/register" className="accent-text">ثبت‌نام کنید</Link></div>
                            </div>
                        )}

                        {/*--------------------| step 2 |--------------------*/}
                        {step === 2 && (
                            <div className="login-steps">
                                <p>کد تایید به شماره {mobile} ارسال شد.</p>
                                <ArcOtp ref={otpRef}
                                        mobile={mobile}
                                        sendOtp={() => apiLoginUserSendOtp(mobile)}
                                        setMessage={setMessage}
                                        onComplete={onSubmitOtp}
                                        onBack={onClickEditMobile}
                                        showSubmit
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <img className="login-image" src="/images/pages/auth/login.png" alt=""/>
        </main>
    );
}
