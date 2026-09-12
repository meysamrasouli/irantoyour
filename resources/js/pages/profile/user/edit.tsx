import * as React from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/pages/profile/_layout";
import { useFormHandler } from "@/shared/hooks/useFormSubmit";
import { ValidationConditionType } from "@/shared/utils/validationUtils";

interface UserEditPropsInterface {
    user: {
        mobile: string;
        first_name: string;
        last_name: string;
        national_code: string;
        email: string | null;
    };
}
interface FormDataInterface {
    first_name: string;
    last_name: string;
    national_code: string;
    email: string;
}

const validationRules: Record<keyof FormDataInterface, ValidationConditionType[]> = {
    first_name: ['notEmpty', 'string_fa', { length_limit: { min: 2, max: 50 } }],
    last_name: ['notEmpty', 'string_fa', { length_limit: { min: 2, max: 50 } }],
    national_code: ['notEmpty', 'national_code'],
    email: ['email'],
};

export default function UserEdit({ user }: UserEditPropsInterface) {
    const { form, formError, validateField, formSubmit } = useFormHandler<FormDataInterface>({
        first_name: user.first_name,
        last_name: user.last_name,
        national_code: user.national_code,
        email: user.email ?? '',
    });
    // نوتیفیکیشن موفقیت از _layout.tsx (useFlushNotification) خونده می‌شه — چون
    // UserController@update با redirect()->with('notification', ...) از session flash میاد

    const onChangeField = (field: keyof FormDataInterface, value: string) => {
        form.setData(field, value);
        validateField(field, validationRules[field], { value });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formSubmit({ method: 'put', action: '/profile/user' }, (index) => {
            const field = index as keyof FormDataInterface;
            return validationRules[field] ? validateField(field, validationRules[field]) : null;
        });
    };

    return (
        <>
            <Head title="اطلاعات کاربری" />
            <Layout>
                <main className="user-edit">
                    <h1>اطلاعات کاربری</h1>

                    <form onSubmit={onSubmit}>
                        <ul className="form-container" data-legend="اطلاعات هویتی">
                            <li data-label="شماره موبایل">
                                <input type="text" value={user.mobile} disabled />
                            </li>
                            <li data-error={formError['first_name'] ?? ''} data-label="نام">
                                <input type="text"
                                       value={form.data.first_name}
                                       onChange={(e) => onChangeField('first_name', e.target.value)}
                                />
                            </li>
                            <li data-error={formError['last_name'] ?? ''} data-label="نام خانوادگی">
                                <input type="text"
                                       value={form.data.last_name}
                                       onChange={(e) => onChangeField('last_name', e.target.value)}
                                />
                            </li>
                            <li data-error={formError['national_code'] ?? ''} data-label="کد ملی">
                                <input type="text"
                                       value={form.data.national_code}
                                       onChange={(e) => onChangeField('national_code', e.target.value)}
                                />
                            </li>
                            <li data-error={formError['email'] ?? ''} data-label="ایمیل (اختیاری)">
                                <input type="text"
                                       value={form.data.email}
                                       onChange={(e) => onChangeField('email', e.target.value)}
                                />
                            </li>
                        </ul>

                        <div className="button-container">
                            <button type="submit" className="custom-button-primary" disabled={form.processing}>ذخیره تغییرات</button>
                        </div>
                    </form>
                </main>
            </Layout>
        </>
    );
}
