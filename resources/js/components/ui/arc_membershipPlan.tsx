import { FormatNumber } from "@/shared/utils/convertUtils";

export interface PlanInterface {
    id: number;
    price: number;
    detail: {
        duration: number;
        duration_fa: string;
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
                    <div className="plan-title">{`اشتراک ${item.detail.duration_fa}`}</div>
                    <div className="plan-price">
                        <div className="price-toman">{FormatNumber(item.price)}</div>
                        <div className="plan-duration">{`${item.detail.duration} روز دسترسی کامل`}</div>
                    </div>
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
