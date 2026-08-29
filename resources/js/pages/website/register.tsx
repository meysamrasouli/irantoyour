import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import {useRef, useState} from "react";
import * as React from "react";
import ArcTariffMembershipPlan, {PlanInterface} from "@/components/ui/arc_tariff_membershipPlan";
import ArcProgressStep from "@/components/ui/arc_progressStep";
import {useFormHandler} from "@/shared/hooks/useFormSubmit";
import UserDetail from "@/components/website/register/userDetail";
import { PageDetailInterface } from "@/shared/types/pageDetailInterface";
import { CartInterface } from "@/shared/types/cartInterface";
import ArcOtp, {ArcOtpRefInterface, MessageInterface} from "@/components/ui/arc_otp";

interface ControllerPropsInterface {
    list_plan: PlanInterface[],
    pageDetail: PageDetailInterface,
}
export interface FormDataInterface {
    cart_item: Partial<CartInterface>;
    mobile: string;
    national_code: string;
    first_name: string;
    last_name: string;
    otp: string,
}

type RegisterFormHandler = ReturnType<typeof useFormHandler<FormDataInterface>>;

export function validateRegisterField(
    field: keyof FormDataInterface,
    value: unknown,
    validateField: RegisterFormHandler['validateField']
): string {
    switch (field) {
        case 'mobile':
            return validateField('mobile', ['notEmpty', 'mobile'], { value });
        case 'national_code':
            return validateField('national_code', ['notEmpty', 'national_code'], { value });
        case 'first_name':
            return validateField('first_name', ['notEmpty', 'string_fa'], { value });
        case 'last_name':
            return validateField('last_name', ['notEmpty', 'string_fa'], { value });
        case 'cart_item':
            return validateField('cart_item', ['notEmpty_object'], {
                value,
                customError: value ? undefined : 'لطفاً یک پلن انتخاب کنید',
            });
        case 'otp':
            return validateField('otp', ['notEmpty', 'integer', {length_fix: 5}], { value });
        default:
            return '';
    }
}

export default function Register(controllerProps: ControllerPropsInterface) {
    const progressStepList: string[] = ['انتخاب پلن', 'اطلاعات کاربری', 'تایید موبایل', 'تایید نهایی']// step progress
    const [progressStepIndex, setProgressStepIndex] = useState<number>(0)// step progress index
    const otpRef = useRef<ArcOtpRefInterface>(null)
    const otpDetail = useRef<{mobile: string, isValid: boolean}>({mobile: '', isValid: false}); // the last otp to user mobile
    const [otpMessage, setOtpMessage] = useState<MessageInterface>()
    const { form, formError, validateField, formSubmit } = useFormHandler<FormDataInterface>({
        cart_item: {type: 'membership', variety: 'one-month', price: 0},
        mobile: '09127979335',
        national_code: '0079544371',
        first_name: 'احمد',
        last_name: 'احمدی',
        otp: '',
    });

    //==============================| Event
    const validateStep = (stepIndex: number): boolean => {
        const fieldsInEveryStep: Record<number, (keyof FormDataInterface)[]> = {
            0: ['cart_item'],
            1: ['mobile', 'national_code', 'first_name', 'last_name'],
            2: ['otp']
        };
        const fields = fieldsInEveryStep[stepIndex];
        if (!fields) return true;

        let isValid = true;
        fields.forEach((field) => {
            const error = validateRegisterField(field, form.data[field], validateField);
            if (error) isValid = false;
        });
        return isValid;
    };

    const onClickNextStep = () => {
        if (!validateStep(progressStepIndex)) return;

        let nextIndex: number = (progressStepIndex < progressStepList.length-1) ? progressStepIndex+1 : progressStepList.length-1

        // skip the step 2 if otp is already valid
        if(nextIndex === 2){
            // check if the mobile number has changed, if so, send a new OTP
            if(otpDetail.current.mobile !== form.data.mobile) {
                setOtpMessage({ type: '', content: '' });
                otpDetail.current = {mobile: form.data.mobile, isValid: false};// reset the otp detail to the new mobile number

                void otpRef.current?.sendOtp()?.catch(() => {
                    setOtpMessage({type: 'error', content: 'خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.'});
                });
            }else if(otpDetail.current.isValid){
                nextIndex++; // skip to the next step if the OTP is already valid
            }
        }

        setProgressStepIndex(nextIndex)
    }
    const onOtpComplete = () => {
        otpDetail.current.isValid = true;
        form.setData('otp', otpRef.current?.getOtpValue() || '');
        onClickNextStep()
    }

    const onClickPreviousStep = () => {
        let previousStep: number = (progressStepIndex > 0) ? progressStepIndex-1 : 0

        // skip the step 2
        if(previousStep === 2){
            previousStep = 1
        }

        setProgressStepIndex(previousStep)
    }

    const onClickSubmit = () => {
        formSubmit({ method: 'post', action: '/register' }, (index) => {
            const field = index as keyof FormDataInterface;
            return validateRegisterField(field, form.data[field], validateField);
        });
    };

    const selectedPlan = controllerProps.list_plan.find((item) => item.variety === form.data.cart_item.variety);

    return (
        <>
            <Head title="ثبت نام" />
            <Layout>
                <main className="register">
                    <section className="user-register">
                        <div className="middle">
                            <div className="page-detail">
                                <h1><span className="accent-text">عضویت</span> در بازار تخصصی طیور</h1>
                                <p className="page-description">به خانواده بزرگ ایران طیور بپیوندید. ابتدا مدت اشتراک خود را انتخاب کنید، سپس اطلاعات شخصی را تکمیل و آگهی‌های خود را منتشر کنید.</p>
                            </div>

                            <div className="step-form">
                                <ArcProgressStep value={progressStepIndex} steps={progressStepList}/>

                                <ul className="step-container">
                                    {progressStepIndex === 0 && (
                                        <li>
                                            <ArcTariffMembershipPlan
                                                value={form.data.cart_item}
                                                setValue={(value) => {
                                                    form.setData('cart_item', value)
                                                    onClickNextStep()
                                                }}
                                                plans={controllerProps.list_plan}
                                            />
                                        </li>
                                    )}
                                    {progressStepIndex === 1 && (
                                        <li>
                                            <div className="split-section">
                                                <div className="guid-section">
                                                    <h2>اطلاعات شخصی</h2>
                                                    <p>مشخصات فردی خود را جهت احراز هویت و ثبت آگهی وارد نمایید.</p>
                                                    <p>مشخصات مالک شماره موبایل وارد شده باید با اطلاعات نام و کدملی همخوانی داشته باشد</p>

                                                    <button type="button" className="custom-button-trans-text" onClick={onClickPreviousStep}><i className="fa-regular fa-arrow-right icon-right"></i><span>بازگشت به مرحله قبل</span></button>
                                                </div>
                                                <div className="detail-section">
                                                    <div className="notification-info-container">
                                                        <i className="fa-regular fa-info-circle"></i>
                                                        <p>مشخصات مالک <b>شماره موبایل</b> وارد شده باید با اطلاعات <b>نام و کدملی</b> همخوانی داشته باشد</p>
                                                    </div>

                                                    <UserDetail form={form}
                                                                formError={formError}
                                                                validateField={validateField}
                                                    />

                                                    <div className="button-container-center">
                                                        <button type="button" className="custom-button-primary" onClick={()=>onClickNextStep()}>تایید و ادامه</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    {progressStepIndex === 2 && (
                                        <li>
                                            <div className="split-section">
                                                <div className="guid-section">
                                                    <h2>تأیید شماره موبایل</h2>
                                                    <p>{`کد 5 رقمی به شماره ${form.data.mobile} پیامک شد. کد را وارد کنید.`}</p>
                                                    <p>اعتبار کد ارسال شده به مدت 2 دقیقه می‌باشد.</p>

                                                    <button type="button" className="custom-button-trans-text" onClick={onClickPreviousStep}><i className="fa-regular fa-arrow-right icon-right"></i><span>بازگشت به مرحله قبل</span></button>
                                                </div>
                                                <div className="detail-section">

                                                    <div className="section-detail-info">
                                                        <i className="fa-solid fa-shield-check"></i>

                                                        {(otpMessage?.content) ? (
                                                            <div className={`${otpMessage?.type === 'error' ? 'notification-error-container' : 'notification-info-container'}`}>
                                                                <i className={`fa-regular ${otpMessage?.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                                                                <p>{ otpMessage?.content }</p>
                                                            </div>
                                                        ) : (
                                                            <p>کد تایید ارسال شد. تلفن همراه خود را بررسی نمایید.</p>
                                                        )}
                                                    </div>

                                                    <div className="otp-wrapper">
                                                        <ArcOtp page={'register'}
                                                                ref={otpRef}
                                                                mobile={form.data.mobile}
                                                                setMessage={setOtpMessage}
                                                                onComplete={onOtpComplete}
                                                        />
                                                    </div>

                                                    <div className="button-container-center">
                                                        <button type="button"
                                                                className="custom-button-primary"
                                                                onClick={()=>onClickNextStep()}
                                                                disabled={!otpDetail.current.isValid}
                                                        >تایید و ادامه</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                    {progressStepIndex === 3 && (
                                        <li>
                                            <div className="split-section">
                                                <div className="guid-section">
                                                    <h2>بررسی و تأیید اطلاعات</h2>
                                                    <p>اطلاعات وارد شده را بررسی و در صورت صحت، ثبت نهایی و پرداخت را انجام دهید.</p>

                                                    <button type="button" className="custom-button-trans-text" onClick={onClickPreviousStep}><i className="fa-regular fa-arrow-right icon-right"></i><span>بازگشت به مرحله قبل</span></button>
                                                </div>
                                                <div className="detail-section">
                                                    {formError['general'] && (
                                                        <div className="notification-error-container">
                                                            <i className="fa-regular fa-exclamation-triangle"></i>
                                                            <p>{formError['general']}</p>
                                                        </div>
                                                    )}

                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th>شماره موبایل</th><td>{ form.data.mobile }</td>
                                                            </tr>
                                                            <tr>
                                                                <th>نام</th><td>{ form.data.first_name }</td>
                                                            </tr>
                                                            <tr>
                                                                <th>نام خانوادگی</th><td>{ form.data.last_name }</td>
                                                            </tr>
                                                            <tr>
                                                                <th>کدملی</th><td>{ form.data.national_code }</td>
                                                            </tr>
                                                            <tr>
                                                                <th>پلن انتخابی</th>
                                                                <td>{selectedPlan ? `اشتراک ${selectedPlan.detail.duration_fa} ` : 'پلنی انتخاب نشده است'}</td>
                                                            </tr>
                                                            <tr>
                                                                <th></th>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    <div className="button-container-center">
                                                        <button type="button" className="custom-button-primary" onClick={onClickSubmit}>ثبت نهایی و پرداخت</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    )
}
