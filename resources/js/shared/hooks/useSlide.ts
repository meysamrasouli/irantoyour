import { useCallback, useEffect, useRef } from 'react';

interface SlideOptions {
    duration?: number;
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    onStart?: () => void;
    onComplete?: () => void;
}

interface UseSlideReturn {
    slideToggle: (element: HTMLElement | null, options?: SlideOptions) => void;
    slideUp: (element: HTMLElement | null, options?: SlideOptions) => void;
    slideDown: (element: HTMLElement | null, options?: SlideOptions) => void;
    isExpanded: (element: HTMLElement | null) => boolean;
    toggle: (element: HTMLElement | null, options?: SlideOptions) => void;
    open: (element: HTMLElement | null, options?: SlideOptions) => void;
    close: (element: HTMLElement | null, options?: SlideOptions) => void;
}

const EASING_MAP: Record<NonNullable<SlideOptions['easing']>, string> = {
    'linear': 'linear',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * در حین انیمیشن، علاوه بر height، padding و border عمودی هم انیمیت می‌شوند
 * تا انتهای انیمیشن (height = 0) واقعاً ارتفاع کلی به صفر برسد و جهش آخر رخ ندهد.
 */
const ANIMATED_PROPS = [
    'height',
    'padding-top',
    'padding-bottom',
    'border-top-width',
    'border-bottom-width',
    'opacity',
] as const;

interface SlideMetrics {
    height: number;
    paddingTop: number;
    paddingBottom: number;
    borderTop: number;
    borderBottom: number;
}

export default function useSlide(): UseSlideReturn {
    // تایمرهای فعال انیمیشن — برای پاک‌سازی در هنگام unmount
    const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    useEffect(() => {
        const timers = timersRef.current;

        return () => {
            timers.forEach(clearTimeout);
            timers.clear();
        };
    }, []);

    /**
     * اندازه‌ی کامل و طبیعی المنت را اندازه‌گیری می‌کند (بدون استایل‌های inline
     * که ممکن است از انیمیشن قبلی باقی مانده باشند) — با یک clone مخفی.
     */
    const getSlideMetrics = useCallback((element: HTMLElement): SlideMetrics => {
        const clone = element.cloneNode(true) as HTMLElement;

        // استایل‌های inline باقی‌مانده از انیمیشن قبلی را حذف کن تا اندازه از CSS خالص گرفته شود
        ANIMATED_PROPS.forEach((prop) => clone.style.removeProperty(prop));

        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.display = 'block';
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.pointerEvents = 'none';
        clone.style.boxSizing = 'border-box';

        const parent = element.parentElement ?? document.body;
        parent.appendChild(clone);

        const computedStyle = window.getComputedStyle(clone);
        const metrics: SlideMetrics = {
            height: clone.getBoundingClientRect().height,
            paddingTop: parseFloat(computedStyle.paddingTop) || 0,
            paddingBottom: parseFloat(computedStyle.paddingBottom) || 0,
            borderTop: parseFloat(computedStyle.borderTopWidth) || 0,
            borderBottom: parseFloat(computedStyle.borderBottomWidth) || 0,
        };

        parent.removeChild(clone);

        return metrics;
    }, []);

    const animate = useCallback((
        element: HTMLElement | null,
        duration: number = 400,
        callback?: () => void,
        isDown: boolean = false,
        easing: NonNullable<SlideOptions['easing']> = 'ease-out',
    ) => {
        if (!element) {
            callback?.();
            return;
        }

        if (element.dataset.animating === 'true') {
            callback?.();
            return;
        }

        element.dataset.animating = 'true';

        const metrics = getSlideMetrics(element);
        const easingFn = EASING_MAP[easing];

        const setCollapsed = () => {
            element.style.height = '0px';
            element.style.paddingTop = '0px';
            element.style.paddingBottom = '0px';
            element.style.borderTopWidth = '0px';
            element.style.borderBottomWidth = '0px';
            element.style.opacity = '0';
        };

        const setExpanded = () => {
            element.style.height = `${metrics.height}px`;
            element.style.paddingTop = `${metrics.paddingTop}px`;
            element.style.paddingBottom = `${metrics.paddingBottom}px`;
            element.style.borderTopWidth = `${metrics.borderTop}px`;
            element.style.borderBottomWidth = `${metrics.borderBottom}px`;
            element.style.opacity = '1';
        };

        // استایل پایه برای انیمیشن
        element.style.overflow = 'hidden';
        element.style.boxSizing = 'border-box';
        element.style.willChange = 'height, padding, opacity';
        element.style.transition = 'none';

        // فاز 1: state شروع را بدون transition commit کن
        if (isDown) {
            element.style.display = 'block';
            setCollapsed();
        } else {
            setExpanded();
        }

        void element.offsetHeight; // force reflow — state شروع commit شود

        // فاز 2: transition را فعال و state پایانی را اعمال کن تا انیمیشن اجرا شود
        element.style.transition = [
            `height ${duration}ms ${easingFn}`,
            `padding-top ${duration}ms ${easingFn}`,
            `padding-bottom ${duration}ms ${easingFn}`,
            `border-top-width ${duration}ms ${easingFn}`,
            `border-bottom-width ${duration}ms ${easingFn}`,
            `opacity ${Math.round(duration * 0.6)}ms ${easingFn}`,
        ].join(', ');

        if (isDown) {
            setExpanded();
        } else {
            setCollapsed();
        }

        const cleanup = (finalState: 'open' | 'closed') => {
            element.style.transition = '';
            element.style.willChange = '';
            element.style.overflow = '';
            element.style.boxSizing = '';

            if (finalState === 'open') {
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('border-top-width');
                element.style.removeProperty('border-bottom-width');
                element.style.opacity = '';
            } else {
                element.style.display = 'none';
                element.style.height = '0px';
                element.style.opacity = '0';
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('border-top-width');
                element.style.removeProperty('border-bottom-width');
            }

            delete element.dataset.animating;
            element.removeEventListener('transitionend', onTransitionEnd);
            clearTimeout(timeout);
            timersRef.current.delete(timeout);
            callback?.();
        };

        const onTransitionEnd = (e: TransitionEvent) => {
            if (e.target !== element) return;
            // height آخرین مقداری است که به پایان می‌رسد (بیشترین مدتtransition)
            if (e.propertyName === 'height') {
                cleanup(isDown ? 'open' : 'closed');
            }
        };

        element.addEventListener('transitionend', onTransitionEnd);

        // fallback: اگر transitionend به هر دلیلی اجرا نشد، بعد از پایان زمان انیمیشن پاک‌سازی کن
        const timeout = setTimeout(() => {
            cleanup(isDown ? 'open' : 'closed');
        }, duration + 120);

        timersRef.current.add(timeout);
    }, [getSlideMetrics]);

    const slideDown = useCallback((element: HTMLElement | null, options: SlideOptions = {}) => {
        if (!element) return;
        const { duration = 400, easing = 'ease-out', onStart, onComplete } = options;
        onStart?.();
        animate(element, duration, onComplete, true, easing);
    }, [animate]);

    const slideUp = useCallback((element: HTMLElement | null, options: SlideOptions = {}) => {
        if (!element) return;
        const { duration = 400, easing = 'ease-out', onStart, onComplete } = options;
        onStart?.();
        animate(element, duration, onComplete, false, easing);
    }, [animate]);

    const slideToggle = useCallback((element: HTMLElement | null, options: SlideOptions = {}) => {
        if (!element) return;
        const isClosed = element.clientHeight === 0 || element.style.display === 'none';
        if (isClosed) {
            slideDown(element, options);
        } else {
            slideUp(element, options);
        }
    }, [slideDown, slideUp]);

    const isExpanded = useCallback((element: HTMLElement | null): boolean => {
        if (!element) return false;
        return element.clientHeight > 0 && element.style.display !== 'none';
    }, []);

    return {
        slideToggle,
        slideUp,
        slideDown,
        isExpanded,
        toggle: slideToggle,
        open: slideDown,
        close: slideUp,
    };
};
