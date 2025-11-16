'use client'

import Link from "next/link";

type TableHeader<T> = {
    label: string;
    key: keyof T;
    align?: "left" | "center" | "right";
    width?: string;
};

type TableAction<T> = {
    label?: string;
    icon?: (item: T) => React.ReactNode;
    onClick?: (item: T) => void;
    href?: (item: T) => string;
    btnClass?: string;
    btnSmall?: boolean;
};

type TableProps<T> = {
    headers: TableHeader<T>[];
    items: T[];
    actions?: TableAction<T>[];
    currentPage?: number;
    totalPages?: number;
    itemsPerPage?: number;
    onPageChange?: (newPage: number) => void;
    onItemsPerPageChange?: (newCount: number) => void;
    showPagination?: boolean;
    showLengthList?: boolean;
    perPageOptions?: number[]; 
};

export default function DataTable<T>({
    headers,
    items,
    actions = [],
    currentPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    showPagination = true,
    showLengthList = true,
    perPageOptions = [10, 20, 50, 100]
}: TableProps<T>) {

    const getAlignClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "left": return "text-left";
            case "right": return "text-right";
            default: return "text-center";
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Top bar */}
            {showLengthList && (
                <div className="flex justify-end items-center gap-2">
                    <label htmlFor="select-perpage">แสดง:</label>
                    <select
                        id="select-perpage"
                        className="border border-gray-300 rounded px-2 py-1 cursor-pointer bg-base-200"
                        defaultValue={itemsPerPage}
                        onChange={e => onItemsPerPageChange?.(parseInt(e.target.value))}
                    >
                        {perPageOptions.map(opt => (
                            <option key={opt} value={opt} >{opt} แถว</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full">
                    <thead className="bg-accent-content sticky top-0 z-30 text-white">
                        <tr>
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`border border-gray-300 px-4 py-2 text-center}`}
                                    style={{ width: header.width }}
                                >
                                    {header.label}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="border border-gray-300 text-center px-4 py-2 w-[15%]">
                                    จัดการ
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <tr key={idx} className={` ${idx % 2 === 0 ? "bg-gray-200 dark:bg-white/20" : "bg-base-100"}`}>
                                    {headers.map((header, hIdx) => (
                                        <td key={hIdx} className={`border border-gray-300 px-4 py-2 ${getAlignClass(header.align)}`}>
                                            {String(item[header.key] ?? '')}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="flex justify-center gap-2">
                                                {actions.map((action, aIdx) => {
                                                    const btnClass = action.btnClass || "btn-info";
                                                    const btnSmall = action.btnSmall ?? false;
                                                    const baseClass = `${btnClass} btn btn-sm !rounded-box gap-1`;

                                                    if (action.href) {
                                                        return (
                                                            <Link
                                                                key={aIdx}
                                                                href={action.href(item)}
                                                                className={baseClass}
                                                                title={action.label}
                                                            >
                                                                {action.icon && action.icon(item)}
                                                                {!btnSmall && action.label && <span>{action.label}</span>}
                                                            </Link>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            key={aIdx}
                                                            className={baseClass}
                                                            onClick={() => action.onClick?.(item)}
                                                            title={action.label}
                                                        >
                                                            {action.icon && action.icon(item)}
                                                            {!btnSmall && action.label && <span>{action.label}</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td 
                                    colSpan={headers.length + (actions.length > 0 ? 1 : 0)} 
                                    className="border border-gray-300 text-center text-gray-500 px-4 py-2"
                                >
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                 <div className="flex justify-end items-center gap-2 mt-2">
                    <button
                        onClick={() => onPageChange?.(Number(currentPage) - 1)}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-base-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        disabled={Number(currentPage) <= 1}
                    >
                        ก่อนหน้า
                    </button>
                    <span className="px-2">
                        หน้า {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange?.(Number(currentPage) + 1)}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-base-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        disabled={Number(currentPage) >= Number(totalPages)}
                    >
                        ถัดไป
                    </button>
                </div>
            )}
        </div>
    );
}