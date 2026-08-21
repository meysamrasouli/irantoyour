import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import ArcMembershipPlan, {PlanInterface} from "@/components/ui/arc_membershipPlan";
import {useEffect, useState} from "react";
import ArcProgressStep from "@/components/ui/arc_progressStep";
import {useFormHandler} from "@/shared/hooks/useFormSubmit";

interface ControllerPropsInterface {
    list_plan: PlanInterface[],
    pageDetail: object,
}
interface FormDataInterface {
    membershipPlan: number;
    mobile: string;
    national_code: string;
    first_name: string;
    last_name: string;
}

export default function Register(
    controllerProps: ControllerPropsInterface,
) {
    const { form, formError, validateField, formSubmit } = useFormHandler<FormDataInterface>({
        membershipPlan: 0,
        mobile: '',
        national_code: '',
        first_name: '',
        last_name: '',
    });
    const onChangeInput = (
        inputName: keyof FormDataInterface,
    ): string | null => {
        switch (inputName) {
            case 'mobile':
                return validateField('mobile', ['notEmpty', 'mobile']);
            case 'national_code':
                return validateField('mobile', ['notEmpty', 'national_code!']);
            case 'first_name':
            case 'last_name':
                return validateField('mobile', ['notEmpty', 'mobile']);
            default:
                return null;
        }
    };

    const progressStepList: string[] = ['اطلاعات کاربری', 'انتخاب پلن', 'تایید نهایی']// step progress
    const [step, setStep] = useState<number>(0)// step form
    const [membershipPlan, setMembershipPlan] = useState<number>(0);

    //==============================| Event
    const onclick_nextStep = () => {
        setStep((step < progressStepList.length-1) ? step+1 : progressStepList.length-1)
    }
    const onclick_previousStep = () => {
        setStep((step > 0) ? step-1 : 0)
    }



    return (
        <>
            <Head title="پلن های اشتراک" />
            <Layout>
                <main className="register-plan">
                    <section className="plan">
                        <div className="middle">
                            <div className="section-detail">
                                <h1>پلن های اشتراک</h1>
                            </div>

                            <div className="step-form">
                                <ArcProgressStep value={step} steps={progressStepList}/>

                                <ul className="step-container">
                                    {step === 0 && (
                                        <li>
                                            <ArcMembershipPlan value={membershipPlan} setValue={setMembershipPlan} plans={controllerProps.list_plan} />
                                        </li>
                                    )}
                                    {step === 1 && (
                                        <li>

                                        </li>
                                    )}
                                    {step === 2 && (
                                        <li>

                                        </li>
                                    )}
                                </ul>

                                <div className="button-container">
                                    <button type="button" className="custom-button-primary" onClick={()=>onclick_nextStep()}>بعدی</button>
                                    <button type="button" className="custom-button-trans-text" onClick={()=>onclick_previousStep()}>قبلی</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    )
}
