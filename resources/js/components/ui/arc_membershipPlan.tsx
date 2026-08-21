import { FormatNumber } from "@/shared/utils/convertUtils";

export interface PlanInterface {
    id: number;
    price: number;
    detail: {
        duration: number;
        description: string;
        bonusBalance: number
    };
}
interface ArcMembershipPlanPropsInterface {
    value: number;
    setValue: (value: number) => void;
    plans: PlanInterface[];
}

export default function ArcMembershipPlan({ value, setValue, plans }: ArcMembershipPlanPropsInterface) {
    return (
        <ul className="arc-membership-plan">
            {plans.map((item) => (
                <li
                    key={item.id}
                    className={item.id === value ? 'active' : ''}
                    onClick={() => setValue(item.id)}
                >
                    <div className="plan-title">{`اشتراک ${item.detail.duration}`}</div>
                    <div className="plan-price price-toman">{FormatNumber(item.price)}</div>
                    <ul className="plan-description">
                        <li>{item.detail.description}</li>
                        <li>شارژ <span className="price-toman">{FormatNumber(item.detail.bonusBalance)}</span> اعتبار</li>
                    </ul>
                    <button type="button" className="custom-button">انتخاب</button>
                </li>
            ))}
        </ul>
    );
}
