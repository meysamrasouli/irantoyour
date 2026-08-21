import * as React from "react";
import { useFormHandler } from "@/shared/hooks/useFormSubmit";
import { ValidationConditionType } from "@/shared/utils/validationUtils";

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
}
interface CategoryEditProps {
    category: {
        id: number;
        name: string;
        slug: string;
        description: string;
    };
}

const validationRules: Record<keyof CategoryFormData, ValidationConditionType[]> = {
    name: ['notEmpty', 'string_fa', { length_limit: { min: 3, max: 50 } }],
    slug: ['notEmpty', { length_limit: { min: 3, max: 60 } }],
    description: [{ length_max: 500 }],
};

export default function CategoryEdit({ category }: CategoryEditProps) {
    const { form, formError, validateField, formSubmit } = useFormHandler<CategoryFormData>({
        name: category.name,
        slug: category.slug,
        description: category.description,
    });

    const onChangeInput = (index: keyof CategoryFormData, value: string) => {
        form.setData(index, value);
        validateField(index, validationRules[index], { value });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formSubmit({ method: 'put', action: `/categories/${category.id}` }, (index) => {
            const rules = validationRules[index as keyof CategoryFormData];
            return rules ? validateField(index, rules) : null;
        });
    };

    return (
        <div className="page-category-edit">
            <h1>ویرایش دسته‌بندی</h1>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">نام دسته‌بندی</label>
                    <input
                        id="name"
                        type="text"
                        className={`custom-input ${formError.name ? 'has-error' : ''}`}
                        value={form.data.name}
                        onChange={(e) => onChangeInput('name', e.target.value)}
                    />
                    {formError.name && <span className="error-text">{formError.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="slug">اسلاگ (آدرس)</label>
                    <input
                        id="slug"
                        type="text"
                        dir="ltr"
                        className={`custom-input ${formError.slug ? 'has-error' : ''}`}
                        value={form.data.slug}
                        onChange={(e) => onChangeInput('slug', e.target.value)}
                    />
                    {formError.slug && <span className="error-text">{formError.slug}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">توضیحات</label>
                    <textarea
                        id="description"
                        className={`custom-textarea ${formError.description ? 'has-error' : ''}`}
                        value={form.data.description}
                        onChange={(e) => onChangeInput('description', e.target.value)}
                    />
                    {formError.description && <span className="error-text">{formError.description}</span>}
                </div>

                <button type="submit" disabled={form.processing}>ذخیره تغییرات</button>
            </form>
        </div>
    );
}
