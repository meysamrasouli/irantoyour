import * as React from "react";
import { useFormHandler } from "@/shared/hooks/useFormSubmit";
import { FormDataInterface } from "@/pages/website/register";

type RegisterFormHandler = ReturnType<typeof useFormHandler<FormDataInterface>>;

interface UserDetailPropsInterface {
    form: RegisterFormHandler['form'];
    formError: RegisterFormHandler['formError'];
    validateField: RegisterFormHandler['validateField'];
}

export default function UserDetail({ form, formError, validateField }: UserDetailPropsInterface) {
    const onChangeField = (field: keyof FormDataInterface, value: string) => {
        form.setData(field, value);

        switch (field) {
            case 'mobile':
                validateField('mobile', ['notEmpty', 'mobile'], { value });
                break;
            case 'national_code':
                validateField('national_code', ['notEmpty', 'national_code'], { value });
                break;
            case 'first_name':
            case 'last_name':
                validateField(field, ['notEmpty', 'string_fa'], { value });
                break;
        }
    };

    return (
        <div className="step-user-detail">
            <div>
                <ul>
                    <li>مکان یابی دقیق آگهی ها</li>
                    <li>رصد منطقه‌ای قیمت‌ها</li>
                    <li>مدیریت هوشمند لجستیک</li>
                    <li>تحلیل و پیش بینی بازار</li>
                </ul>
            </div>
            <ul className="form-container">
                <li data-error={(formError['mobile'])??''} data-label="شماره موبایل">
                    <input
                        id="mobile"
                        type="text"
                        dir="ltr"
                        className={`custom-input ${formError.mobile ? 'has-error' : ''}`}
                        value={form.data.mobile}
                        onChange={(e) => onChangeField('mobile', e.target.value)}
                    />
                </li>
                <li data-error={(formError['national_code'])??''} data-label="کد ملی">
                    <input
                        id="national_code"
                        type="text"
                        dir="ltr"
                        className={`custom-input ${formError.national_code ? 'has-error' : ''}`}
                        value={form.data.national_code}
                        onChange={(e) => onChangeField('national_code', e.target.value)}
                    />
                </li>
                <li data-error={(formError['first_name'])??''} data-label="نام">
                    <input
                        id="first_name"
                        type="text"
                        className={`custom-input ${formError.first_name ? 'has-error' : ''}`}
                        value={form.data.first_name}
                        onChange={(e) => onChangeField('first_name', e.target.value)}
                    />
                </li>
                <li data-error={(formError['last_name'])??''} data-label="نام خانوادگی">
                    <input
                        id="last_name"
                        type="text"
                        className={`custom-input ${formError.last_name ? 'has-error' : ''}`}
                        value={form.data.last_name}
                        onChange={(e) => onChangeField('last_name', e.target.value)}
                    />
                </li>
            </ul>
        </div>
    );
}
