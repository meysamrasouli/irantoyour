import * as React from "react";
import {useRef, useState} from "react";
import {Head} from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import ArcTariffMembershipPlan, {PlanInterface} from "@/components/ui/arc_tariff_membershipPlan";
import ArcProgressStep from "@/components/ui/arc_progressStep";
import {useFormHandler} from "@/shared/hooks/useFormSubmit";
import UserDetail from "@/components/website/register/userDetail";
import { PageDetailInterface } from "@/shared/types/pageDetailInterface";
import { CartInterface } from "@/shared/types/cartInterface";
import ArcOtp, {ArcOtpRefInterface, MessageInterface} from "@/components/ui/arc_otp";
import {apiRegisterSendOtp, apiVerifyRegisterOtp} from "@/shared/api/auth";
import ArcFaq from "@/components/ui/arc_faq";

interface ControllerPropsInterface {
    list_plan: PlanInterface[],
    list_faq: [string, string][],
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

export function validateRegisterField(
    field: keyof FormDataInterface,
    value: unknown,
    validateField: ReturnType<typeof useFormHandler<FormDataInterface>>['validateField']
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
        let fields: (keyof FormDataInterface)[] = []
        switch (stepIndex){
            case 0:
                fields = ['cart_item']
                break
            case 1:
                fields = ['mobile', 'national_code', 'first_name', 'last_name']
                break
            case 2:
                return otpDetail.current.isValid;
            default:
                return true
        }

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
                // ArcOtp در mount کد جدید را به صورت خودکار ارسال می‌کند
            }else if(otpDetail.current.isValid){
                nextIndex++; // skip to the next step if the OTP is already valid
            }
        }

        setProgressStepIndex(nextIndex)
    }
    const onOtpComplete = async (otp: string) => {
        try {
            const result = await apiVerifyRegisterOtp(form.data.mobile, otp);

            if(result.error){
                setOtpMessage({ type: 'error', content: result.error });
                return;
            }

            otpDetail.current = {mobile: form.data.mobile, isValid: true};
            form.setData('otp', otp);
            onClickNextStep()
        } catch (error: any) {
            setOtpMessage({ type: 'error', content: error?.response?.data?.message ?? 'خطا در بررسی کد تایید' });
        }
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
                                                            <div className={`notification-container ${otpMessage?.type === 'error' ? 'message-error' : 'message-info'}`}>
                                                                <i className={`fa-regular ${otpMessage?.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                                                                <p>{ otpMessage?.content }</p>
                                                            </div>
                                                        ) : (
                                                            <p>کد تایید ارسال شد. تلفن همراه خود را بررسی نمایید.</p>
                                                        )}
                                                    </div>

                                                    <div className="otp-wrapper">
                                                        <ArcOtp ref={otpRef}
                                                                mobile={form.data.mobile}
                                                                sendOtp={() => apiRegisterSendOtp(form.data.mobile)}
                                                                setMessage={setOtpMessage}
                                                                onComplete={onOtpComplete}
                                                                onBack={onClickPreviousStep}
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
                                                        <div className="notification-container message-error">
                                                            <i className="fa-regular fa-exclamation-triangle"></i>
                                                            <p>{formError['general']}</p>
                                                        </div>
                                                    )}

                                                    <table className="user-detail">
                                                        <tbody>
                                                            <tr>
                                                                <td>شماره موبایل</td><th>{ form.data.mobile }</th>
                                                            </tr>
                                                            <tr>
                                                                <td>نام</td><th>{ form.data.first_name }</th>
                                                            </tr>
                                                            <tr>
                                                                <td>نام خانوادگی</td><th>{ form.data.last_name }</th>
                                                            </tr>
                                                            <tr>
                                                                <td>کدملی</td><th>{ form.data.national_code }</th>
                                                            </tr>
                                                            <tr>
                                                                <td>پلن انتخابی</td>
                                                                <th>{selectedPlan ? `اشتراک ${selectedPlan.detail.duration_fa} ` : 'پلنی انتخاب نشده است'}</th>
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
                    <section className="section-block membership-detail">
                        <div className="middle">
                            <div className="section-detail">
                                <h2>امکانات <span className="accent-text">پلن های اشتراک</span></h2>
                                <div className="section-description">یافتن شرکای تجاری، رصد قیمت‌ها در مناطق مختلف و مسیریابی بهینه لجستیک، همه در یک پلتفرم جامع.</div>
                            </div>

                            <ul className="feature-card">
                                <li>
                                    <i className="fa-solid fa-mobile label-primary"></i>
                                    <h3>احراز هویت</h3>
                                    <p>همه اعضا قبل از عضویت، احراز هویت می‌شوند تا معامله‌ای امن داشته باشید.</p>
                                </li>
                                <li>
                                    <i className="fa-solid fa-location-dot label-primary"></i>
                                    <h3>نمایش روی نقشه</h3>
                                    <p>پرداخت از طریق درگاه رسمی بانکی انجام می‌شود و اشتراک بلافاصله فعال است.</p>
                                </li>
                                <li>
                                    <i className="fa-solid fa-shield-check label-primary"></i>
                                    <h3>پرداخت امن</h3>
                                    <p>آگهی شما با موقعیت دقیق روی نقشه برای خریداران سرتاسر ایران نمایش داده می‌شود.</p>
                                </li>
                                <li>
                                    <i className="fa-solid fa-headphones label-primary"></i>
                                    <h3>پشتیبانی اختصاصی</h3>
                                    <p>تیم پشتیبانی همواره پاسخگوی نیازهای شماست.</p>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className="section-block faq">
                        <div className="middle">
                            <div className="section-detail">
                                <h2><span className="accent-text">سوالات</span> متداول</h2>
                                <div className="section-description">اگر سوال شما یکی از گزینه های زیر نبود با تیم پشتیبانی ما تماس بگیرید</div>
                            </div>

                            <ArcFaq list_faq={controllerProps.list_faq} />
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    )
}
