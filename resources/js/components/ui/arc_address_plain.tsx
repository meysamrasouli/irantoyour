import * as React from "react";
import { useState } from "react";
import ArcModal from "@/components/ui/arc_modal";
import { validate } from "@/shared/utils/validationUtils";

interface AddressValue {
    province: string;
    city: string;
    plate: string;
}
interface AddressPickerModalProps {
    open: boolean;
    onClose: () => void;
    /** وقتی کاربر تأیید کرد، مقدار نهایی اینجا برمی‌گرده تا مثلاً توی فرم اصلی (address) ست بشه */
    onConfirm: (address: AddressValue) => void;
    initialValue?: Partial<AddressValue>;
}

/**
 * نکته: این مودال به سرور submit نمی‌کنه - فقط یه تیکه داده (آدرس) جمع می‌کنه و از طریق
 * onConfirm به caller برمی‌گردونه، دقیقاً همون الگوی callback(inputs) که در Vue داشتید.
 * برای همین از useFormHandler استفاده نکردیم (اون برای فرم‌هایی که مستقیم submit می‌شن هست)،
 * فقط از useState محلی + همون تابع validate برای اعتبارسنجی هر فیلد.
 */
export default function AddressPickerModal({ open, onClose, onConfirm, initialValue }: AddressPickerModalProps) {
    const [address, setAddress] = useState<AddressValue>({
        province: initialValue?.province ?? '',
        city: initialValue?.city ?? '',
        plate: initialValue?.plate ?? '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AddressValue, string>>>({});

    const validateField = (key: keyof AddressValue, value: string): string => {
        const errorMessage = validate(value, ['notEmpty'], true);
        setErrors((prev) => ({ ...prev, [key]: errorMessage || undefined }));
        return errorMessage;
    };

    const onChangeField = (key: keyof AddressValue, value: string) => {
        setAddress((prev) => ({ ...prev, [key]: value }));
        validateField(key, value); // مقدار تازه مستقیم پاس داده می‌شه، نه از state خونده می‌شه (همون باگ stale که قبلاً دیدیم)
    };

    const onClickConfirm = () => {
        const provinceError = validateField('province', address.province);
        const cityError = validateField('city', address.city);
        const plateError = validateField('plate', address.plate);

        if (provinceError || cityError || plateError) return; // نامعتبره، مودال بسته نمی‌شه

        onConfirm(address);
        onClose();
    };

    return (
        <ArcModal
            open={open}
            onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}
            header="انتخاب آدرس"
            buttons={[
                { text: 'انصراف', style: 'close', onClick: onClose },
                { text: 'تأیید', style: 'button', onClick: onClickConfirm },
            ]}
        >
            <div className="form-group">
                <label htmlFor="province">استان</label>
                <input
                    id="province"
                    className={`custom-input ${errors.province ? 'has-error' : ''}`}
                    value={address.province}
                    onChange={(e) => onChangeField('province', e.target.value)}
                />
                {errors.province && <span className="error-text">{errors.province}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="city">شهر</label>
                <input
                    id="city"
                    className={`custom-input ${errors.city ? 'has-error' : ''}`}
                    value={address.city}
                    onChange={(e) => onChangeField('city', e.target.value)}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="plate">پلاک</label>
                <input
                    id="plate"
                    dir="ltr"
                    className={`custom-input ${errors.plate ? 'has-error' : ''}`}
                    value={address.plate}
                    onChange={(e) => onChangeField('plate', e.target.value)}
                />
                {errors.plate && <span className="error-text">{errors.plate}</span>}
            </div>
        </ArcModal>
    );
}
