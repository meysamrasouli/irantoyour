import { useEffect, RefObject } from 'react';

/**
 * Hook - وقتی خارج از المان مشخص‌شده کلیک بشه، callback رو اجرا می‌کنه
 * @param ref - رفرنس المانی که می‌خواید بیرونش رو تشخیص بدید
 * @param callback - تابعی که موقع کلیک بیرون اجرا می‌شه
 * @param enabled - اختیاری: فعال/غیرفعال کردن listener (پیش‌فرض: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    callback: (event: MouseEvent) => void,
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return;

        const handleClick = (event: MouseEvent) => {
            const el = ref.current;
            if (!el || el === event.target || el.contains(event.target as Node))
                return

            callback(event)
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [ref, callback, enabled]);
}
