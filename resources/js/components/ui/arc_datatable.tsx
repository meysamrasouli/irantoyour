import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, router } from "@inertiajs/react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import type DateObject from "react-date-object";
import { axiosClient } from "@/shared/utils/axiosUtils";
import ArcSelect from "./arc_select";
import ArcPagination from "./arc_pagination";
import ArcModal from "./arc_modal";

//==================================================| Types
interface DataTableSearchOptionInterface {
    type: 'input' | 'select' | 'date';
    option?: Record<string, string>;
}
interface DataTableColumnInterface {
    th?: string;
    th_fix?: string;
    th_flexible?: string;
    text?: { db: string; sort?: boolean };
    icon?: { type: string; db: string };
    button_link?: { url: string; icon: string };
    button_login?: { url: string };
    button_delete?: { url: string };
    search?: DataTableSearchOptionInterface;
}
interface DataTablePaginationInterface {
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
}
interface DataTableRowInterface {
    tr_class?: string;
    [key: string]: any;
}
interface DataTableResponseInterface {
    data: DataTableRowInterface[];
    detail: DataTableColumnInterface[];
    pagination?: DataTablePaginationInterface;
}
interface DataTableParametersInterface {
    paging: number;
    page: number;
    orderBy: string;
    orderType: 'asc' | 'desc';
    search: Record<string, string>;
}
interface DataTableFeaturesInterface {
    paging?: number;
    page?: number;
    orderBy?: string;
    orderType?: 'asc' | 'desc';
    search?: Record<string, string>;
}
interface ArcDataTableProps {
    namespace: string;
    condition?: Record<string, any> | null;
    features?: DataTableFeaturesInterface | null;
}

const listPaging = [
    { value: 5, text: '5 ردیف' },
    { value: 10, text: '10 ردیف' },
    { value: 20, text: '20 ردیف' },
    { value: 50, text: '50 ردیف' },
    { value: 100, text: '100 ردیف' },
];

/**
 * ArcDataTable - جدول داده‌ی سرور-محور با جستجوی پیشرفته، جستجوی محلی، مرتب‌سازی و صفحه‌بندی
 *
 * تفاوت‌های عمده نسبت به نسخه Vue:
 * - سه مودال (جستجوی پیشرفته، حذف، ورود موفق) هر کدوم state مستقل خودشون رو دارن،
 *   نه یک آبجکت "modal" مشترک که مثل نسخه Vue بین چند حالت مختلف بازنویسی می‌شد
 * - fetchData به‌جای خوندن state پس از تغییرش (که با توجه به آسنکرون بودن setState می‌تونست
 *   نسخه قدیمی رو بخونه)، پارامترهای بعدی رو صریح می‌گیره
 * - axios (axiosClient) به‌جای axios سراسری قدیمی، و router.delete اینرشیا به‌جای this.$inertia.delete
 * - TransitionGroup حذف شد (معادل مستقیم React نداره) - در صورت نیاز به انیمیشن ردیف‌ها بعداً با
 *   یه کتابخونه مثل framer-motion یا CSS transition قابل اضافه شدنه
 */
export default function ArcDataTable({ namespace, condition = null, features = null }: ArcDataTableProps) {
    const [tableDetail, setTableDetail] = useState<DataTableResponseInterface | null>(null);
    const [searchableColumns, setSearchableColumns] = useState<DataTableColumnInterface[]>([]);
    const [searchableColumnsInputs, setSearchableColumnsInputs] = useState<Record<string, string>>({});
    const [localSearchText, setLocalSearchText] = useState('');
    const [parameters, setParameters] = useState<DataTableParametersInterface>({
        paging: features?.paging ?? 10,
        page: features?.page ?? 1,
        orderBy: features?.orderBy ?? 'id',
        orderType: features?.orderType ?? 'desc',
        search: features?.search ?? {},
    });

    //------------------------------| مودال‌ها - هر کدوم مستقل
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });
    const [loginModal, setLoginModal] = useState<{ open: boolean; name: string; mobile: string }>({ open: false, name: '', mobile: '' });

    //==================================================| Fetch
    const fetchData = useCallback(async (nextParameters: DataTableParametersInterface, forcedPage?: number) => {
        const parameter: Record<string, any> = { ...nextParameters, condition };
        if (forcedPage) parameter.page = forcedPage;

        try {
            const response = await axiosClient.post<DataTableResponseInterface>('/dashboard/datatable', {
                namespace,
                parameter,
            });
            const data = response.data;

            // صفحه‌ای که قبلاً ذخیره شده دیگه معتبر نیست (مثلاً بعد از حذف چند ردیف) - برگرد به صفحه ۱
            if (forcedPage && forcedPage > 1 && data.data.length === 0) {
                localStorage.setItem(namespace, '1');
                await fetchData(nextParameters, 1);
                return;
            }

            setTableDetail(data);
            const newSearchableColumns = data.detail.filter((column) => column.search);
            setSearchableColumns(newSearchableColumns);

            if (forcedPage !== undefined && newSearchableColumns.length > 0) {
                const initialInputs: Record<string, string> = {};
                newSearchableColumns.forEach((column) => {
                    if (column.text) initialInputs[column.text.db] = '';
                });
                setSearchableColumnsInputs(initialInputs);
            }

            setParameters(nextParameters);
        } catch (error) {
            console.error(error);
        }
    }, [namespace, condition]);

    //------------------------------| بارگذاری اولیه (معادل mounted قبلی) - فقط یک‌بار
    useEffect(() => {
        const savedPage = localStorage.getItem(namespace);
        fetchData(parameters, savedPage ? Number(savedPage) : parameters.page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //==================================================| Derived (جستجوی محلی)
    const filteredRows = useMemo(() => {
        const rows = tableDetail?.data ?? [];
        if (!localSearchText) return rows;
        const lower = localSearchText.toLowerCase();
        return rows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(lower));
    }, [tableDetail, localSearchText]);

    //==================================================| Events
    const onClickPagination = (pageNumber: number) => {
        if (!pageNumber) return;
        localStorage.setItem(namespace, String(pageNumber));
        fetchData({ ...parameters, page: pageNumber });
    };

    const onChangePaging = (value: number) => {
        localStorage.setItem(namespace, '1');
        fetchData({ ...parameters, paging: value, page: 1 });
    };

    const onClickOrderBy = (column: string | false) => {
        if (!column) return;
        const orderType = parameters.orderBy === column ? (parameters.orderType === 'asc' ? 'desc' : 'asc') : 'desc';
        fetchData({ ...parameters, orderBy: column, orderType });
    };

    const onClickServerSearch = () => {
        const search: Record<string, string> = {};
        for (const key in searchableColumnsInputs) {
            if (searchableColumnsInputs[key] !== '') search[key] = searchableColumnsInputs[key];
        }
        localStorage.setItem(namespace, '1');
        fetchData({ ...parameters, search, page: 1 });
        setSearchModalOpen(false);
    };

    const onClickButtonDelete = (url: string) => {
        setDeleteModal({ open: true, url });
    };

    const onConfirmDelete = () => {
        if (!deleteModal.url) return;
        router.delete(deleteModal.url, {
            onSuccess: () => fetchData(parameters),
        });
        setDeleteModal({ open: false, url: null });
    };

    const onClickButtonLogin = async (url: string) => {
        try {
            const response = await axiosClient.post(url);

            if (namespace.includes('user')) localStorage.setItem('tokenUser', response.data.token);
            if (namespace.includes('personnel')) localStorage.setItem('tokenPersonnel', response.data.token);

            setLoginModal({ open: true, name: response.data.name, mobile: response.data.mobile });
        } catch (error) {
            console.error(error);
        }
    };

    if (!tableDetail) return null;

    return (
        <div className="arc-datatable">
            {/* جستجوی پیشرفته - دکمه‌ای که ArcModal رو باز می‌کنه، به‌جای چک‌باکس + بخش قدیمی */}
            {searchableColumns.length > 0 && (
                <div className="search-database">
                    <button type="button" className="custom-button-trans-primary" onClick={() => setSearchModalOpen(true)}>
                        <i className="fa-solid fa-magnifying-glass" /> جستجو پیشرفته
                    </button>
                </div>
            )}

            <ArcModal
                open={searchModalOpen}
                setOpen={setSearchModalOpen}
                header="جستجوی پیشرفته"
                buttonClose={false}
                buttons={[
                    { text: 'انصراف', className: 'custom-button-trans-primary', onClick: () => setSearchModalOpen(false) },
                    { text: 'جستجو', className: 'custom-button', onClick: onClickServerSearch },
                ]}
            >
                <ul className="form-container">
                    {searchableColumns.map((column) => {
                        if (!column.text || !column.search) return null;
                        const dbKey = column.text.db;

                        return (
                            <li key={dbKey}>
                                {column.search.type === 'input' && (
                                    <input
                                        type="text"
                                        placeholder={column.th}
                                        value={searchableColumnsInputs[dbKey] ?? ''}
                                        onChange={(e) => setSearchableColumnsInputs((prev) => ({ ...prev, [dbKey]: e.target.value }))}
                                    />
                                )}

                                {column.search.type === 'select' && (
                                    <select
                                        value={searchableColumnsInputs[dbKey] ?? ''}
                                        onChange={(e) => setSearchableColumnsInputs((prev) => ({ ...prev, [dbKey]: e.target.value }))}
                                    >
                                        <option value="">بدون فیلتر</option>
                                        {Object.entries(column.search.option ?? {}).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                )}

                                {column.search.type === 'date' && (
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={searchableColumnsInputs[dbKey] || ''}
                                        onChange={(dateObject: DateObject | null) => {
                                            const value = dateObject ? dateObject.convert(gregorian, gregorian_en).format('YYYY-MM-DD') : '';
                                            setSearchableColumnsInputs((prev) => ({ ...prev, [dbKey]: value }));
                                        }}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </ArcModal>

            {/* جستجوی محلی + تعداد رکورد */}
            <div className="table-local-search-container">
                <div className="search-table">
                    <input
                        className="custom-input"
                        placeholder="جستجو در نتایج ..."
                        type="text"
                        onChange={(e) => setLocalSearchText(e.target.value)}
                    />
                    <span>{filteredRows.length} نتیجه</span>
                </div>

                <div className="table-paging">
                    <ArcSelect
                        value={parameters.paging}
                        setValue={(value) => onChangePaging(Number(value))}
                        options={listPaging}
                        option_properties={{ type: 'array_object', value: 'value', text: 'text' }}
                    />
                </div>
            </div>

            {/* جدول */}
            <div className="table-container">
                {filteredRows.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            {tableDetail.detail.map((column, index) => {
                                const isSortable = !!(column.text && column.text.sort);
                                const dbKey = column.text?.db;
                                const isOrderedDesc = isSortable && parameters.orderBy === dbKey && parameters.orderType === 'desc';
                                const isOrderedAsc = isSortable && parameters.orderBy === dbKey && parameters.orderType === 'asc';

                                const className = [
                                    column.th_fix !== undefined ? 'fixed' : '',
                                    column.th_flexible !== undefined ? 'flexible' : '',
                                    isSortable ? 'sortable' : '',
                                    isOrderedDesc ? 'order-by-desc' : '',
                                    isOrderedAsc ? 'order-by-asc' : '',
                                ].filter(Boolean).join(' ');

                                return (
                                    <th key={index} className={className || undefined} onClick={() => onClickOrderBy(isSortable && dbKey ? dbKey : false)}>
                                        {column.th ?? column.th_fix ?? column.th_flexible ?? ''}
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={row.tr_class ?? undefined}>
                                {tableDetail.detail.map((column, colIndex) => {
                                    const dbKey = column.text?.db;
                                    const className = [
                                        column.th_fix !== undefined ? 'fixed' : '',
                                        column.th_flexible !== undefined ? 'flexible' : '',
                                        parameters.orderBy === dbKey ? 'order-by' : '',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <td key={colIndex} className={className || undefined}>
                                            {column.text ? row[column.text.db] : ''}

                                            {column.icon && (
                                                <i className={[
                                                    'fa-solid',
                                                    column.icon.type === 'status' && row[column.icon.db] ? 'fa-check' : '',
                                                    column.icon.type === 'status' && !row[column.icon.db] ? 'fa-times' : '',
                                                ].filter(Boolean).join(' ')} />
                                            )}

                                            {column.button_link && row[column.button_link.url] && (
                                                <Link href={row[column.button_link.url]} className="custom-icon">
                                                    <i className={`fa-regular ${column.button_link.icon}`} />
                                                </Link>
                                            )}

                                            {column.button_login && row[column.button_login.url] && (
                                                <a onClick={() => onClickButtonLogin(row[column.button_login!.url])} className="custom-icon-green">
                                                    <i className="fa-regular fa-right-from-bracket" />
                                                </a>
                                            )}

                                            {column.button_delete && row[column.button_delete.url] && (
                                                <a onClick={() => onClickButtonDelete(row[column.button_delete!.url])} className="custom-icon-red">
                                                    <i className="fa-regular fa-trash" />
                                                </a>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-result">نتیجه‌ای یافت نشد</div>
                )}
            </div>

            {/* صفحه‌بندی */}
            {tableDetail.pagination && (
                <div className="pagination-container">
                    <span className="table-result-detail">
                        نمایش {tableDetail.pagination.from} تا {tableDetail.pagination.to} از {tableDetail.pagination.total} نتیجه
                    </span>
                    {filteredRows.length > 0 && (
                        <ArcPagination
                            currentPage={tableDetail.pagination.currentPage}
                            lastPage={tableDetail.pagination.lastPage}
                            onChange={onClickPagination}
                        />
                    )}
                </div>
            )}

            {/* مودال حذف */}
            <ArcModal
                open={deleteModal.open}
                setOpen={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
                header="حذف داده"
                icon="warning"
                text="آیا قصد حذف این داده را دارید؟"
                buttonClose={false}
                buttons={[
                    { text: 'بله', className: 'custom-button', onClick: onConfirmDelete },
                    { text: 'بستن', className: 'custom-button-trans-primary', onClick: () => setDeleteModal({ open: false, url: null }) },
                ]}
            />

            {/* مودال موفقیت ورود به‌جای کاربر دیگر */}
            <ArcModal
                open={loginModal.open}
                setOpen={(open) => setLoginModal((prev) => ({ ...prev, open }))}
                header="ورود موفق"
                icon="success"
                text={`شما با موفقیت وارد حساب کاربری ${loginModal.name} با شماره تلفن ${loginModal.mobile} شدید.`}
                buttonClose={false}
                buttons={[
                    { text: 'بستن', className: 'custom-button', onClick: () => { window.location.href = '/'; } },
                ]}
            />
        </div>
    );
}
