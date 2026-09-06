/**
 * تایپ prop های سراسری (Shared Props) که از سمت سرور در
 * App\Http\Middleware\HandleInertiaRequests به کلاینت ارسال می‌شن.
 */

//==================================================| User |==================================================\\
export interface UserSharedPropInterface {
    mobile: string;
    first_name: string;
    last_name: string;
    balance: string;
}

//==================================================| Personnel |==================================================\\
export interface PersonnelSharedPropInterface {
    mobile: string;
    first_name: string;
    last_name: string;
    roles: string[];
}

//==================================================| Auth |==================================================\\
export interface AuthSharedPropInterface {
    user: UserSharedPropInterface | null;
    personnel: PersonnelSharedPropInterface | null;
}

//==================================================| Flush |==================================================\\
/**
 * prop های یکبارمصرف (flash)؛ مقدار notification از session سرور resolve می‌شه
 */
export interface FlushSharedPropInterface {
    notification: string | null;
}

//==================================================| App Shared Props |==================================================\\
export interface AppSharedPropsInterface {
    auth: AuthSharedPropInterface | null;
    flush: FlushSharedPropInterface;
}