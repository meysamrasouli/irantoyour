import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { zustandStore } from "@/shared/store/zustandStore";
import { AppSharedPropsInterface } from "@/shared/types/appSharedPropsInterface";

export function useFlushNotification() {
    const { flush } = usePage().props as unknown as AppSharedPropsInterface;
    const updateNotification = zustandStore((state) => state.updateNotification);

    useEffect(() => {
        if (flush?.notification) {
            updateNotification(flush.notification);
        }
    }, [flush?.notification]);
}
