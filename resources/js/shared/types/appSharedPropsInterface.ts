import { NotificationInputInterface } from "@/components/ui/arc_notification";

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
export interface FlushSharedPropInterface {
    notification: NotificationInputInterface | null;
}

//==================================================| App Shared Props |==================================================\\
export interface AppSharedPropsInterface {
    auth: AuthSharedPropInterface | null;
    flush: FlushSharedPropInterface;
}
