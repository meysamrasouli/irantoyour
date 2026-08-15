import { useCallback, useEffect, useState } from "react";
import { zustandStore } from "@/shared/store/zustandStore";

interface UseFetchResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    refetch: () => void;
}

/**
 * @function useFetch - fetch داده از سرور با پشتیبانی از query params، AbortController و refetch
 * @param url - آدرس درخواست. اگر null باشد، درخواستی ارسال نمی‌شود (برای درخواست‌های شرطی)
 * @param params - query params که به صورت ?key=value به url اضافه می‌شود
 * @param options - سایر تنظیمات fetch (headers، method و ...)
 *
 * @example
 * const { data, error, loading, refetch } = useFetch<UserInterface[]>('/api/users', { role: 'admin' })
 */
export default function useFetch<T = unknown>(
    url: string | null,
    params?: Record<string, string | number | boolean>,
    options?: RequestInit
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [reloadIndex, setReloadIndex] = useState(0);
    const updateOverlayLoading = zustandStore((state) => state.updateOverlayLoading);

    const refetch = useCallback(() => setReloadIndex((i) => i + 1), []);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        let isMounted = true;

        const queryString = params && Object.keys(params).length > 0
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : '';

        setLoading(true);
        setError(null);
        updateOverlayLoading(true); // show overlay loading

        fetch(`${url}${queryString}`, { ...options, signal: controller.signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`درخواست با خطا مواجه شد (HTTP ${response.status})`);
                }
                return response.json();
            })
            .then((result: T) => {
                if (isMounted) setData(result);
            })
            .catch((err: Error) => {
                // درخواست abort شده (به‌خاطر تغییر url یا unmount) یک خطای واقعی نیست
                if (err.name !== 'AbortError' && isMounted) setError(err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
                updateOverlayLoading(false); // hide overlay loading
            });

        return () => {
            isMounted = false;
            controller.abort(); // لغو درخواست قبلی اگر هنوز کامل نشده
        };
    }, [url, JSON.stringify(params), reloadIndex]);

    return { data, error, loading, refetch };
}
