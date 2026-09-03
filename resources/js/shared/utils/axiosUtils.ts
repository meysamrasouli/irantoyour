import axios from "axios";

// کلاینت اصلی — احراز هویت session-based (First-party SPA)
// CSRF به‌صورت خودکار از کوکی XSRF-TOKEN در هدر X-XSRF-TOKEN ارسال می‌شود (با withCredentials)
export const axiosClient = axios.create({
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});
