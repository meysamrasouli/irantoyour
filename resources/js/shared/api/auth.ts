import { axiosClient } from '@/shared/utils/axiosUtils';

//==================================================| Types |==================================================\\
export interface SendOtpResultInterface {
    remainingSeconds: number;
}
export interface VerifyRegisterOtpResultInterface {
    error: string;
}
export interface LoginResultInterface {
    intended: string;
}

//==================================================| Helpers |==================================================\\
function extractRemainingSeconds(data: '' | string): number {
    return data === '' ? 0 : Number(data);
}

//==================================================| Send OTP |==================================================\\
export async function apiRegisterSendOtp(mobile: string): Promise<SendOtpResultInterface> {
    const response = await axiosClient.post<'' | string>('/register-auth/send-otp', { mobile });
    return { remainingSeconds: extractRemainingSeconds(response.data) };
}

export async function apiLoginUserSendOtp(mobile: string): Promise<SendOtpResultInterface> {
    const response = await axiosClient.post<'' | string>('/login/send-otp', { mobile });
    return { remainingSeconds: extractRemainingSeconds(response.data) };
}

export async function apiLoginPersonnelSendOtp(mobile: string): Promise<SendOtpResultInterface> {
    const response = await axiosClient.post<'' | string>('/dashboard/login/send-otp', { mobile });
    return { remainingSeconds: extractRemainingSeconds(response.data) };
}

//==================================================| Verify OTP |==================================================\\
export async function apiVerifyRegisterOtp(mobile: string, otp: string): Promise<VerifyRegisterOtpResultInterface> {
    return (await axiosClient.post<VerifyRegisterOtpResultInterface>('/register-auth', { mobile, otp })).data;
}

//==================================================| Login |==================================================\\
export async function apiLoginUser(mobile: string, otp: string): Promise<LoginResultInterface> {
    return (await axiosClient.post<LoginResultInterface>('/login', { mobile, otp })).data;
}

export async function apiLoginPersonnel(mobile: string, otp: string): Promise<LoginResultInterface> {
    return (await axiosClient.post<LoginResultInterface>('/dashboard/login', { mobile, otp })).data;
}

// ریدایرکت پس از لاگین — احراز هویت session-based است (cookie) و توکنی در مرورگر ذخیره نمی‌کنیم
export function handleLoginUserResult(result: LoginResultInterface): void {
    if (result.intended) {
        window.location.href = result.intended;
    } else {
        // اگر مقصدی ذخیره نشده بود، به پروفایل برو (کاربر الان لاگین است)
        window.location.href = '/profile';
    }
}

// ریدایرکت پس از لاگین پرسنل — session-based (cookie) بدون توکن در مرورگر
export function handleLoginPersonnelResult(result: LoginResultInterface): void {
    if (result.intended) {
        window.location.href = result.intended;
    } else {
        location.reload();
    }
}
