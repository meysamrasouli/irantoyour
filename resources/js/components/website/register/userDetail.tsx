// interface ControllerPropsInterface {
//     list_plan: PlanInterface[],
//     pageDetail: object,
// }
//
// export default function Register(
//     controllerProps: ControllerPropsInterface,
// ) {
//
//     const progressStepList: string[] = ['اطلاعات کاربری', 'انتخاب پلن', 'تایید نهایی']// step progress
//     const [step, setStep] = useState<number>(0)// step form
//     const [membershipPlan, setMembershipPlan] = useState<number>(0);
//
//     //==============================| Event
//     const onclick_nextStep = () => {
//         setStep((step < progressStepList.length-1) ? step+1 : progressStepList.length-1)
//     }
//     const onclick_previousStep = () => {
//         setStep((step > 0) ? step-1 : 0)
//     }
//
//
//
//     return (
//         <>
//             <Head title="پلن های اشتراک" />
//             <Layout>
//                 <main className="register-plan">
//                     <section className="plan">
//                         <div className="middle">
//                             <div className="section-detail">
//                                 <h1>پلن های اشتراک</h1>
//                             </div>
//
//                             <div className="step-form">
//                                 <ArcProgressStep value={step} steps={progressStepList}/>
//
//                                 <ul className="step-container">
//                                     <li>
//                                         <ArcMembershipPlan value={membershipPlan} setValue={setMembershipPlan} plans={controllerProps.list_plan} />
//                                     </li>
//                                     <li>
//
//                                     </li>
//                                     <li>
//
//                                     </li>
//                                 </ul>
//
//                                 <div className="button-container">
//                                     <button type="button" className="custom-button-primary" onClick={()=>onclick_nextStep()}>بعدی</button>
//                                     <button type="button" className="custom-button-trans-text" onClick={()=>onclick_previousStep()}>قبلی</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                 </main>
//             </Layout>
//         </>
//     )
// }
