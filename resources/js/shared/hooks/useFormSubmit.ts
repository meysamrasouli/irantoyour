import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { zustandStore } from "@/shared/store/zustandStore";
import { validate, ValidationConditionType } from "@/shared/utils/validationUtils"

interface SubmitDetail {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    action: string;
    option?: {
        forceFormData?: boolean;
        preserveScroll?: boolean;
        queryStringArrayFormat?: 'brackets' | 'indices';
        [key: string]: any;
    };
}

export function useFormHandler<T extends Record<string, any>>(initialValues: T) {
    const form = useForm(initialValues);
    const [formError, setFormError] = useState<Record<string, string>>({});
    const updateNotification = zustandStore((state) => state.updateNotification);
    const updateOverlayLoading = zustandStore((state) => state.updateOverlayLoading);

    // handling server validation error
    useEffect(() => {
        const errors = form.errors;
        if (!errors || Object.keys(errors).length === 0) return;

        const newFormErrors: Record<string, string> = {};
        for (const [index, errorMsg] of Object.entries(errors)) {
            newFormErrors[index] = errorMsg as string;
        }

        setFormError(newFormErrors);
        updateNotification({ mode: 'error', text: 'لطفاً خطاهای فرم را بررسی کنید' });
    }, [form.errors]);

    /**
     * @function validateField
     * @param index
     * @param conditions
     * @param options.customError
     * @param options.value
     * @return string
     */
    const validateField = useCallback((
        index: string,
        conditions: ValidationConditionType[],
        options?: { customError?: string; value?: unknown }
    ): string => {
        const value = options && 'value' in options ? options.value : (form.data as Record<string, any>)[index];
        const errorMessage = validate(value, conditions, true, options?.customError);

        setFormError((prev) => {
            if (!errorMessage) {
                if (!(index in prev)) return prev; // nothing changed, prevert form re-rendering
                const next = { ...prev };
                delete next[index];
                return next;
            }
            return { ...prev, [index]: errorMessage };
        });

        return errorMessage;
    }, [form.data]);

    /**
     * @param submitDetail
     * @param inputValidatorFunction
     */
    const formSubmit = (
        submitDetail: SubmitDetail,
        inputValidatorFunction?: (index: string) => string | null | undefined
    ) => {
        let allowSubmit = true;

        if (typeof inputValidatorFunction === 'function') {
            const newFormErrors: Record<string, string> = {};

            for (const index in form.data) {
                const errorMessage = inputValidatorFunction(index);
                if (errorMessage) newFormErrors[index] = errorMessage;
            }

            setFormError(newFormErrors);

            if (validate(newFormErrors, ['notEmpty_object'])) {
                allowSubmit = false;
            }
        }

        if (allowSubmit) {
            const option = {
                forceFormData: false,
                preserveScroll: false,
                queryStringArrayFormat: 'indices' as const,
                ...(submitDetail.option || {}),
            };

            updateOverlayLoading(true);// show loading overlay
            form[submitDetail.method](submitDetail.action, {
                forceFormData: option.forceFormData,
                preserveScroll: option.preserveScroll,
                queryStringArrayFormat: option.queryStringArrayFormat,
                onSuccess: () => {},
                onError: (errors) => { console.log(errors) },
                onFinish: () => {
                    updateOverlayLoading(false);// hide loading overlay
                }
            });
        }
    };

    return {
        form,
        formError,
        validateField,
        formSubmit,
    };
}
