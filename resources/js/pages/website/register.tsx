import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import {useState} from "react";
import * as React from "react";
import ArcTariffMembershipPlan, {PlanInterface} from "@/components/ui/arc_tariff_membershipPlan";
import ArcProgressStep from "@/components/ui/arc_progressStep";
import {useFormHandler} from "@/shared/hooks/useFormSubmit";
import UserDetail from "@/components/website/register/userDetail";
import { PageDetailInterface } from "@/shared/types/pageDetailInterface";
import { CartInterface } from "@/shared/types/cartInterface";

interface ControllerPropsInterface {
    list_plan: PlanInterface[],
    pageDetail: PageDetailInterface,
}
export interface FormDataInterface {
    cart: CartInterface;
    mobile: string;
    national_code: string;
    first_name: string;
    last_name: string;
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
        case 'cart':
            return validateField('cart', ['notEmpty_object'], {
                value,
                customError: value ? undefined : 'لطفاً یک پلن انتخاب کنید',
            });
        default:
            return '';
    }
}

export default function Register(controllerProps: ControllerPropsInterface) {
    const progressStepList: string[] = ['انتخاب پلن', 'اطلاعات کاربری', 'تایید نهایی']// step progress
    const [progressStepIndex, setProgressStepIndex] = useState<number>(0)// step form
    const { form, formError, validateField, formSubmit } = useFormHandler<FormDataInterface>({
        cart: {
            type: 'membership',
            variety: '',
            price: 0,
        },
        mobile: '',
        national_code: '',
        first_name: '',
        last_name: '',
    });

    //==============================| Event
    const validateStep = (stepIndex: number): boolean => {
        const fieldsInEveryStep: Record<number, (keyof FormDataInterface)[]> = {
            0: ['cart'],
            1: ['mobile', 'national_code', 'first_name', 'last_name'],
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

    const onclick_nextStep = () => {
        if (!validateStep(progressStepIndex)) return;

        setProgressStepIndex((progressStepIndex < progressStepList.length-1) ? progressStepIndex+1 : progressStepList.length-1)
    }
    const onclick_previousStep = () => {
        setProgressStepIndex((progressStepIndex > 0) ? progressStepIndex-1 : 0)
    }
    const onClickSubmit = () => {
        // مرحله‌ی نهایی هم دوباره همه‌ی فیلدها رو چک می‌کنه (نه فقط مرحله فعلی) - محافظت نهایی قبل از ارسال به سرور
        formSubmit({ method: 'post', action: '/register' }, (index) => {
            const field = index as keyof FormDataInterface;
            return validateRegisterField(field, form.data[field], validateField);
        });
    };

    const selectedPlan = controllerProps.list_plan.find((item) => item.variety === form.data.cart.variety);

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
                                                value={form.data.cart}
                                                setValue={(value) => form.setData('cart', value)}
                                                plans={controllerProps.list_plan}
                                            />
                                        </li>
                                    )}
                                    {progressStepIndex === 1 && (
                                        <li>
                                            <UserDetail form={form} formError={formError} validateField={validateField} />
                                        </li>
                                    )}
                                    {progressStepIndex === 2 && (
                                        <li>
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
                                                    <th>پلن انتخابی</th><td>
                                                    {selectedPlan ? `اشتراک ${selectedPlan.detail.duration} ` : 'پلنی انتخاب نشده است'}</td>
                                                </tr>
                                                </tbody>
                                                <tfoot>
                                                <tr>
                                                    <td colSpan={3}>{formError['general']}</td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </li>
                                    )}
                                </ul>

                                <div className="button-container-center">
                                    {progressStepIndex < progressStepList.length - 1 ? (
                                        <button type="button" className="custom-button-primary" onClick={()=>onclick_nextStep()}>بعدی</button>
                                    ) : (
                                        <button type="button" className="custom-button-primary" onClick={onClickSubmit}>ثبت نهایی و پرداخت</button>
                                    )}
                                    {progressStepIndex > 0 && (
                                        <button type="button" className="custom-button-trans-text" onClick={onclick_previousStep}>قبلی</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    )
}
