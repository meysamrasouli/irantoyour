import {router} from "@inertiajs/react";

type GetDateType = 'today'

export const config = {
    APP_URL: import.meta.env.VITE_APP_URL,
    APP_NAME: import.meta.env.VITE_APP_NAME,
    APP_NAME_FA: import.meta.env.VITE_APP_NAME_FA,
    APP_COMPANY_NAME_FA: import.meta.env.VITE_APP_COMPANY_NAME_FA,
    APP_PRODUCT_SKU: import.meta.env.VITE_APP_PRODUCT_SKU,
    APP_TELEPHONE: import.meta.env.VITE_APP_TELEPHONE,
    APP_EMAIL: import.meta.env.VITE_APP_EMAIL,
    APP_ADDRESS: import.meta.env.VITE_APP_ADDRESS,
};

export const logout = () => {
    // توکنی در مرورگر ذخیره نمی‌کنیم (session-based)؛ فقط پاکسازی احتمالی کلیدهای قدیمی
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('tokenPersonnel');

    router.post('/logout');
};

export const getFullName = (
    firstName: string = '',
    lastName: string = '',
    alternative: string = ''
): string | null => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return alternative;
};

//==============================| DateTime
export const getDate = (type: GetDateType): string => {
    const dateObj = new Date();
    let dd = String(dateObj.getDate()).padStart(2, '0');
    let mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    let yyyy = dateObj.getFullYear();

    switch (type) {
        case 'today':
            return `${yyyy}-${mm}-${dd}`;
    }
};

export const remainingTime = (date: string): string => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date).getTime();
    const secondDate = new Date().getTime();

    const diffDays = Math.round((firstDate - secondDate) / oneDay);

    if (diffDays > 0) return `${diffDays} روز مانده`;
    if (diffDays === 0) return 'امروز';
    if (diffDays < 0) return `${Math.abs(diffDays)} روز گذشته`;
    return ''
};
