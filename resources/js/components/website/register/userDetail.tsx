import * as React from "react";
import { useFormHandler } from "@/shared/hooks/useFormSubmit";
import { FormDataInterface, validateRegisterField } from "@/pages/website/register";

type RegisterFormHandler = ReturnType<typeof useFormHandler<FormDataInterface>>;

interface UserDetailPropsInterface {
    form: RegisterFormHandler['form'];
    formError: RegisterFormHandler['formError'];
    validateField: RegisterFormHandler['validateField'];
}

export default function UserDetail({ form, formError, validateField }: UserDetailPropsInterface) {
    const onChangeField = (field: keyof FormDataInterface, value: string) => {
        form.setData(field, value);
        validateRegisterField(field, value, validateField);
    };

    return (
        <ul className="form-container">
            <li data-error={(formError['first_name']) ?? ''} data-label="نام">
                <input type="text"
                       value={form.data.first_name}
                       onChange={(e) => onChangeField('first_name', e.target.value)}
                />
            </li>
            <li data-error={(formError['last_name']) ?? ''} data-label="نام خانوادگی">
                <input type="text"
                       value={form.data.last_name}
                       onChange={(e) => onChangeField('last_name', e.target.value)}
                />
            </li>
            <li data-error={(formError['mobile']) ?? ''} data-label="شماره موبایل">
                <input type="text"
                       value={form.data.mobile}
                       onChange={(e) => onChangeField('mobile', e.target.value)}
                />
            </li>
            <li data-error={(formError['national_code']) ?? ''} data-label="کد ملی">
                <input type="text"
                       value={form.data.national_code}
                       onChange={(e) => onChangeField('national_code', e.target.value)}
                />
            </li>
        </ul>
    );
}
