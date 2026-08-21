import * as React from "react";
import { useFormHandler } from "@/shared/hooks/useFormSubmit";

//==================================================| Types
type CodeType = 'random' | 'selective' | 'prefix' | 'suffix';
type DiscountType = 'percent' | 'fixed';

interface DiscountFormData {
    code_type: CodeType;
    code: string;
    discount_type: DiscountType;
    discount: string;
    count: string;
    count_max: string;
    started_at: string;
    expired_at: string;
}

export default function DiscountCreate() {
    const { form, formError, validateField, formSubmit } = useFormHandler<DiscountFormData>({
        code_type: 'random',
        code: '',
        discount_type: 'percent',
        discount: '',
        count: '',
        count_max: '',
        started_at: '',
        expired_at: '',
    });

    /**
     * @function onChangeInput - پورت‌شده از mixin قدیمی Vue
     * @param inputName - نام فیلدی که تغییر کرده
     * @param newValue - مقدار تازه‌ی همون فیلد (اختیاری). وقتی از onChange صدا زده می‌شه حتماً پاس داده می‌شه
     *   چون بلافاصله بعد از form.setData صدا زده می‌شه و form.data هنوز مقدار قبلی رو داره (state آسنکرونه).
     *   وقتی قبل از submit (بدون newValue) صدا زده می‌شه، از form.data فعلی (که قبلاً commit شده) استفاده می‌کنه.
     * @return پیام خطا برای این فیلد (اگه فیلد validation نداشت یا معتبر بود، null/'' برمی‌گرده)
     */
    const onChangeInput = (
        inputName: keyof DiscountFormData,
        newValue?: DiscountFormData[keyof DiscountFormData]
    ): string | null => {
        switch (inputName) {
            //------------------------------| این فیلد فقط side effect داره، خودش validation نداره
            case 'code_type': {
                const value = newValue ?? form.data.code_type;
                switch (value) {
                    case 'random':
                        form.setData('code', '');
                        break;
                    case 'selective':
                        form.setData('count', '1');
                        break;
                }
                return null;
            }

            //------------------------------| قوانین code بسته به code_type فرق می‌کنه
            case 'code':
                switch (form.data.code_type) { // خوندن یک فیلد دیگه (sibling) - مشکلی نداره چون الان تغییر نکرده
                    case 'prefix':
                    case 'suffix':
                        return validateField('code', ['notEmpty', { length_fix: 4 }], { value: newValue ?? form.data.code });
                    case 'selective':
                        return validateField('code', ['notEmpty', { length_fix: 8 }], { value: newValue ?? form.data.code });
                    default:
                        return null;
                }

            //------------------------------| قوانین discount بسته به discount_type فرق می‌کنه
            case 'discount':
                return form.data.discount_type === 'percent'
                    ? validateField('discount', ['notEmpty', 'integer', { integer_limit: { min: 1, max: 100 } }], { value: newValue ?? form.data.discount })
                    : validateField('discount', ['notEmpty', 'integer'], { value: newValue ?? form.data.discount });

            case 'count':
                return validateField('count', ['notEmpty', 'integer'], { value: newValue ?? form.data.count });

            case 'count_max':
                return validateField('count_max', ['notEmpty', 'integer'], { value: newValue ?? form.data.count_max });

            case 'started_at':
            case 'expired_at':
                return validateField(inputName, ['notEmpty'], { value: newValue ?? form.data[inputName] });

            //------------------------------| discount_type خودش هم فقط trigger کننده re-validate روی discount هست
            case 'discount_type':
                // وقتی discount_type عوض می‌شه، discount که قبلاً واردشده رو با قانون جدید دوباره چک می‌کنیم
                if (form.data.discount !== '') onChangeInput('discount');
                return null;

            default:
                return null;
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        formSubmit({ method: 'post', action: '/discounts' }, (index) => {
            return onChangeInput(index as keyof DiscountFormData);
        });
    };

    return (
        <div className="page-discount-create">
            <h1>ثبت کد تخفیف</h1>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="code_type">نوع کد</label>
                    <select
                        id="code_type"
                        className="custom-input"
                        value={form.data.code_type}
                        onChange={(e) => {
                            const value = e.target.value as CodeType;
                            form.setData('code_type', value);
                            onChangeInput('code_type', value); // مقدار تازه صریح پاس داده می‌شه
                        }}
                    >
                        <option value="random">تصادفی</option>
                        <option value="selective">انتخابی</option>
                        <option value="prefix">پیشوند</option>
                        <option value="suffix">پسوند</option>
                    </select>
                </div>

                {/* فقط وقتی prefix/suffix/selective انتخاب شده کد رو نشون بده - random خودش تولید می‌شه */}
                {form.data.code_type !== 'random' && (
                    <div className="form-group">
                        <label htmlFor="code">کد</label>
                        <input
                            id="code"
                            type="text"
                            dir="ltr"
                            className={`custom-input ${formError.code ? 'has-error' : ''}`}
                            value={form.data.code}
                            onChange={(e) => {
                                const value = e.target.value;
                                form.setData('code', value);
                                onChangeInput('code', value);
                            }}
                        />
                        {formError.code && <span className="error-text">{formError.code}</span>}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="discount_type">نوع تخفیف</label>
                    <select
                        id="discount_type"
                        className="custom-input"
                        value={form.data.discount_type}
                        onChange={(e) => {
                            const value = e.target.value as DiscountType;
                            form.setData('discount_type', value);
                            onChangeInput('discount_type', value);
                        }}
                    >
                        <option value="percent">درصدی</option>
                        <option value="fixed">مبلغ ثابت</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="discount">
                        مقدار تخفیف {form.data.discount_type === 'percent' ? '(درصد)' : '(تومان)'}
                    </label>
                    <input
                        id="discount"
                        type="text"
                        className={`custom-input ${formError.discount ? 'has-error' : ''}`}
                        value={form.data.discount}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setData('discount', value);
                            onChangeInput('discount', value);
                        }}
                    />
                    {formError.discount && <span className="error-text">{formError.discount}</span>}
                </div>

                {/* فقط وقتی selective نیست، تعداد قابل تغییره - چون selective خودش count رو با تعداد کدهای دستی ست می‌کنه */}
                {form.data.code_type !== 'selective' && (
                    <div className="form-group">
                        <label htmlFor="count">تعداد کد قابل استفاده</label>
                        <input
                            id="count"
                            type="text"
                            className={`custom-input ${formError.count ? 'has-error' : ''}`}
                            value={form.data.count}
                            onChange={(e) => {
                                const value = e.target.value;
                                form.setData('count', value);
                                onChangeInput('count', value);
                            }}
                        />
                        {formError.count && <span className="error-text">{formError.count}</span>}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="count_max">سقف استفاده هر کاربر</label>
                    <input
                        id="count_max"
                        type="text"
                        className={`custom-input ${formError.count_max ? 'has-error' : ''}`}
                        value={form.data.count_max}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setData('count_max', value);
                            onChangeInput('count_max', value);
                        }}
                    />
                    {formError.count_max && <span className="error-text">{formError.count_max}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="started_at">تاریخ شروع</label>
                    <input
                        id="started_at"
                        type="date"
                        className={`custom-input ${formError.started_at ? 'has-error' : ''}`}
                        value={form.data.started_at}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setData('started_at', value);
                            onChangeInput('started_at', value);
                        }}
                    />
                    {formError.started_at && <span className="error-text">{formError.started_at}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="expired_at">تاریخ پایان</label>
                    <input
                        id="expired_at"
                        type="date"
                        className={`custom-input ${formError.expired_at ? 'has-error' : ''}`}
                        value={form.data.expired_at}
                        onChange={(e) => {
                            const value = e.target.value;
                            form.setData('expired_at', value);
                            onChangeInput('expired_at', value);
                        }}
                    />
                    {formError.expired_at && <span className="error-text">{formError.expired_at}</span>}
                </div>

                <button type="submit" disabled={form.processing}>ثبت کد تخفیف</button>
            </form>
        </div>
    );
}
