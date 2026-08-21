import * as React from "react";
import { Link, router } from "@inertiajs/react";

interface CategoryListItem {
    id: number;
    name: string;
    slug: string;
}
interface CategoryIndexProps {
    categories: CategoryListItem[]; // از کنترلر Laravel می‌آید
}

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const onDelete = (id: number, name: string) => {
        if (!window.confirm(`آیا از حذف «${name}» مطمئن هستید؟`)) return;

        router.delete(`/categories/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="page-category-index">
            <div className="page-header">
                <h1>دسته‌بندی‌ها</h1>
                <Link href="/categories/create" className="btn btn-primary">
                    + دسته‌بندی جدید
                </Link>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>نام</th>
                    <th>اسلاگ</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td dir="ltr">{category.slug}</td>
                        <td>
                            <Link href={`/categories/${category.id}/edit`}>ویرایش</Link>
                            <button type="button" onClick={() => onDelete(category.id, category.name)}>
                                حذف
                            </button>
                        </td>
                    </tr>
                ))}

                {categories.length === 0 && (
                    <tr>
                        <td colSpan={3}>دسته‌بندی‌ای ثبت نشده است</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
