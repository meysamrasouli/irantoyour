import * as React from "react";
import { useMemo } from "react";

//==================================================| Types
interface ArcPaginationPropsInterface {
    currentPage: number;
    lastPage: number;
    range?: number;
    onChange: (page: number) => void;
}

type PaginationItemType = number | 'dots';

/**
 * @example
 * <ArcPagination currentPage={page} lastPage={10} onChange={setPage} />
 */
export default function ArcPagination({ currentPage, lastPage, range = 1, onChange }: ArcPaginationPropsInterface) {
    if (!Number.isInteger(range) || range <= 0) {
        console.error(`arc-pagination: invalid range: ${range} (باید عدد صحیح مثبت باشد)`);
        range = 1;
    }

    const paginationPages = useMemo<PaginationItemType[]>(() => {
        const pages: PaginationItemType[] = [1]; // صفحه اول همیشه نشون داده می‌شه
        const start = Math.max(2, currentPage - range);
        const end = Math.min(lastPage - 1, currentPage + range);

        // start
        if (currentPage > range + 2) pages.push('dots');
        // middle
        for (let i = start; i <= end; i++) pages.push(i);
        // end
        if (currentPage < lastPage - (range + 1)) pages.push('dots');
        // last page
        if (lastPage > 1) pages.push(lastPage);

        return pages;
    }, [currentPage, lastPage, range]);

    if (lastPage <= 1) return null;

    const onClickPage = (page: number) => {
        if (page >= 1 && page <= lastPage) onChange(page);
    };

    return (
        <nav className="arc-pagination" aria-label="صفحه‌بندی">
            <button type="button" onClick={() => onClickPage(currentPage - 1)} disabled={currentPage === 1}>قبلی</button>

            {paginationPages.map((item, index) =>
                item === 'dots' ? (
                    <span key={`dots-${index}`}>...</span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        className={item === currentPage ? 'active' : undefined}
                        aria-current={item === currentPage ? 'page' : undefined}
                        onClick={() => onClickPage(item)}
                    >
                        {item}
                    </button>
                )
            )}

            <button type="button" onClick={() => onClickPage(currentPage + 1)} disabled={currentPage === lastPage}>بعدی</button>
        </nav>
    );
}
