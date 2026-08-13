import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { zustandStore } from "@/shared/store/zustandStore";
import { validate } from "@/shared/utils/validationUtils"

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

        if (errors && Object.keys(errors).length > 0) {
            const newFormErrors: Record<string, string> = {};

            if (validate(errors, ['notEmpty_object'])) {
                for (const index in errors) {
                    const errorMsg = errors[index];
                    if (index.includes(".")) {// تبدیل خطاها مثلاً address.province
                        newFormErrors[index] = errorMsg.replace(index, 'قرمز رنگ');
                    } else {
                        newFormErrors[index] = errorMsg;
                    }

                    updateNotification({mode: 'error', text: newFormErrors[index]});
                }
            }
            setFormError(newFormErrors);
        }
    }, [form.errors]);


    const formSubmit = (
        submitDetail: SubmitDetail,
        inputValidatorFunction?: (index: string) => void
    ) => {
        let allowSubmit = true;

        if (typeof inputValidatorFunction === 'function') {
            for (const index in form.data) {
                inputValidatorFunction(index);
            }

            if (validate(formError, ['notEmpty_object'])) {
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
                    updateOverlayLoading(true);// hide loading overlay
                }
            });
        }
    };

    return {
        form,
        formError,
        formSubmit,
    };
}
