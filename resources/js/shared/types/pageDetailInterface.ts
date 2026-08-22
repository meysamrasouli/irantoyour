export interface BreadcrumbItemInterface {
    name: string;
    url: string;
}

/**
 * PageDetailInterface - shape مشترک pageDetail که همه‌ی صفحات website از کنترلرهای Laravel دریافت می‌کنن
 */
export interface PageDetailInterface {
    url: string; // canonical
    description: string;
    breadcrumb: BreadcrumbItemInterface[];
}
