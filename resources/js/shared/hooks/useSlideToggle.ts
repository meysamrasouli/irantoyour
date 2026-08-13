export const useSlide = () => {
    const animate = (
        element: HTMLElement | null,
        duration: number = 400,
        callback?: () => void,
        isDown: boolean = false
    ) => {
        if (!element) return;

        // جلوگیری از اجرای همزمان انیمیشن
        if (element.hasAttribute('data-animating')) return;
        element.dataset.animating = '';

        element.style.overflow = "hidden";
        if (isDown) element.style.display = "block";

        const elStyles = window.getComputedStyle(element);

        const elHeight        = parseFloat(elStyles.getPropertyValue('height'));
        const elPaddingTop    = parseFloat(elStyles.getPropertyValue('padding-top'));
        const elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
        const elMarginTop     = parseFloat(elStyles.getPropertyValue('margin-top'));
        const elMarginBottom  = parseFloat(elStyles.getPropertyValue('margin-bottom'));

        const stepHeight        = elHeight / duration;
        const stepPaddingTop    = elPaddingTop / duration;
        const stepPaddingBottom = elPaddingBottom / duration;
        const stepMarginTop     = elMarginTop / duration;
        const stepMarginBottom  = elMarginBottom / duration;

        let start: number | undefined;

        const step = (timestamp: number) => {
            if (start === undefined) start = timestamp;
            const elapsed = timestamp - start;

            if (isDown) {
                element.style.height        = (stepHeight        * elapsed) + "px";
                element.style.paddingTop    = (stepPaddingTop    * elapsed) + "px";
                element.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
                element.style.marginTop     = (stepMarginTop     * elapsed) + "px";
                element.style.marginBottom  = (stepMarginBottom  * elapsed) + "px";
            } else {
                element.style.height        = elHeight        - (stepHeight        * elapsed) + "px";
                element.style.paddingTop    = elPaddingTop    - (stepPaddingTop    * elapsed) + "px";
                element.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
                element.style.marginTop     = elMarginTop     - (stepMarginTop     * elapsed) + "px";
                element.style.marginBottom  = elMarginBottom  - (stepMarginBottom  * elapsed) + "px";
            }

            if (elapsed >= duration) {
                element.style.height        = "";
                element.style.paddingTop    = "";
                element.style.paddingBottom = "";
                element.style.marginTop     = "";
                element.style.marginBottom  = "";
                element.style.overflow      = "";
                element.style.display       = (!isDown) ? "none" : "";

                delete element.dataset.animating;
                if (typeof callback === 'function') callback();
            } else {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    const slideToggle = (element: HTMLElement | null, duration: number = 400, callback?: () => void) => {
        if (!element) return;
        if (element.clientHeight === 0) {
            animate(element, duration, callback, true);
        } else {
            animate(element, duration, callback, false);
        }
    };

    const slideUp = (element: HTMLElement | null, duration: number = 400, callback?: () => void) => {
        animate(element, duration, callback, false);
    };

    const slideDown = (element: HTMLElement | null, duration: number = 400, callback?: () => void) => {
        animate(element, duration, callback, true);
    };

    return {
        slideToggle,
        slideUp,
        slideDown,
    };
};
