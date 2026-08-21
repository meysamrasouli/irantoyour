import {FormatNumber} from "@/shared/utils/convertUtils";
import {useEffect, useState} from "react";

export interface  PlanInterface {
    id: number,
    price: number,
    detail: {
        duration: number,
        description: string,
    }
}
interface PropsInterface {
    value: number,
    setValue: (value: number) => void,
    plans: PlanInterface[],
}
export default function ArcMembershipPlan({
                                             value,
                                             setValue,
                                             plans,
                                        }: PropsInterface) {
    const [selectedPlan, setSelectedPlan] = useState(0)

    const onClickPlan = (id: number) => {
        setSelectedPlan(id)
        setValue(id)
    }

    // watch value
    useEffect(() => {
        if(!value) return;
        setSelectedPlan(value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <ul className="arc-membership-plan">
                {plans.map((item) => (
                    <li key={item.id}
                        className={(item.id === selectedPlan) ? 'active' : ''}
                        onClick={() => onClickPlan(item.id)}
                    >
                        <div className="plan-title">{`اشتراک ${item.detail.duration}`}</div>
                        <div className="plan-price price-toman">{ FormatNumber(item.price) }</div>
                        <button type="button" className="custom-button">انتخاب</button>
                        <div className="plan-description">{item.detail.description}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}
