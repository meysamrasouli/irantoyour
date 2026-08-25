import { FormatNumber } from "@/shared/utils/convertUtils";
import {CartInterface} from "@/shared/types/cartInterface";
export interface PlanInterface {
    variety: string;
    price: number;
    detail: {
        duration: number;
        duration_fa: string;
        description: string;
        bonusBalance: number
    };
}
interface ArcMembershipPlanPropsInterface {
    value: CartInterface;
    setValue: (value: CartInterface) => void;
    plans: PlanInterface[];
}

export default function ArcTariffMembershipPlan({ value, setValue, plans }: ArcMembershipPlanPropsInterface) {
    const onclickPlan = (index: number): void => {
        setValue({
            type: 'membership',
            variety: plans[index]['variety'],
            price: plans[index]['price'],
        })
    }

    return (
        <ul className="arc-membership-plan">
            {plans.map((item, index) => (
                <li
                    key={index}
                    className={item.variety === value.variety ? 'active' : ''}
                    onClick={()=>onclickPlan(index)}
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
