import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import ArcMembershipPlan, {PlanInterface} from "@/components/ui/arc_membershipPlan";
import {useEffect, useState} from "react";
import ArcProgressStep from "@/components/ui/arc_progressStep";
import {useFormHandler} from "@/shared/hooks/useFormSubmit";
import UserDetail from "@/components/website/register/userDetail";
import * as React from "react";

interface ControllerPropsInterface {
    list_plan: PlanInterface[],
    pageDetail: object,
}
export interface FormDataInterface {
    membershipPlan: number;
    mobile: string;
    national_code: string;
    first_name: string;
    last_name: string;
}

export default function Register(controllerProps: ControllerPropsInterface) {
    const progressStepList: string[] = ['انتخاب پلن', 'اطلاعات کاربری', 'تایید نهایی']// step progress
    const [progressStepIndex, setProgressStepIndex] = useState<number>(0)// step form
    const { form, formError, validateField, formSubmit } = useFormHandler<FormDataInterface>({
        membershipPlan: 0,
        mobile: '',
        national_code: '',
        first_name: '',
        last_name: '',
    });
    // const onSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     formSubmit({ method: 'put', action: `/categories/${category.id}` }, (index) => {
    //         const rules = validationRules[index as keyof CategoryFormData];
    //         return rules ? validateField(index, rules) : null;
    //     });
    // };

    //==============================| Event
    const onclick_nextStep = () => {
        setProgressStepIndex((progressStepIndex < progressStepList.length-1) ? progressStepIndex+1 : progressStepList.length-1)
    }
    const onclick_previousStep = () => {
        setProgressStepIndex((progressStepIndex > 0) ? progressStepIndex-1 : 0)
    }

    const selectedPlan = controllerProps.list_plan.find(
        (item) => item.id === form.data.membershipPlan
    );

    return (
        <>
            <Head title="ثبت نام" />
            <Layout>
                <main className="register">
                    <section className="user-register">
                        <div className="middle">
                            <div className="page-detail">
                                <h1>ثبت نام</h1>
                                <p className="page-description">به خانواده بزرگ ایران طیور بپیوندید</p>
                            </div>

                            <div className="step-form">
                                <ArcProgressStep value={progressStepIndex} steps={progressStepList}/>

                                <ul className="step-container">
                                    {progressStepIndex === 0 && (
                                        <li>
                                            <div className="section-detail">
                                                <h2>انتخاب <span className="accent-text">طرح اشتراک</span></h2>
                                                <p className="section-description">برای دسترسی به امکانات سامانه، یکی از  طرح های اشتراک زیر را انتخاب کنید.</p>
                                            </div>
                                            <ArcMembershipPlan
                                                value={form.data.membershipPlan}
                                                setValue={(value) => form.setData('membershipPlan', value)}
                                                plans={controllerProps.list_plan}
                                            />
                                        </li>
                                    )}
                                    {progressStepIndex === 1 && (
                                        <li>
                                            <div className="section-detail">
                                                <h2>ثبت <span className="accent-text">اطلاعات کاربری</span></h2>
                                                <p className="section-description">اطلاعات کاربری را برای استفاده از در سامانه به دقت وارد کنید.</p>
                                            </div>
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
                                            </table>
                                        </li>
                                    )}
                                </ul>

                                <div className="button-container">
                                    {progressStepIndex < progressStepList.length - 1 ? (
                                        <button type="button" className="custom-button-primary" onClick={()=>onclick_nextStep()}>بعدی</button>
                                    ) : (
                                        <button type="button" className="custom-button-primary" onClick={() => formSubmit}>ثبت نهایی و پرداخت</button>
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
