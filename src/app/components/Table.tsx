'use client'

import Link from "next/link";
import { useState } from "react";

type TableHeader<T> = {
    label: string;
    key: keyof T; // property ของ item
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

type TableProps<T extends Record<string, any>> = {
    headers: TableHeader<T>[];
    items: T[];
    actions?: TableAction<T>[];
    itemsPerPageOptions?: number[];
    defaultItemsPerPage?: number;
};

export default function Table<T extends Record<string, any>>({
    headers,
    items,
    actions = [],
    itemsPerPageOptions = [5, 10, 20],
    defaultItemsPerPage = 5,
}: TableProps<T>) {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(parseInt(e.target.value));
        setPage(1);
    };

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
            <div className="flex justify-end items-center gap-2">
                <label htmlFor="select-perpage">แสดง:</label>
                <select
                    id="select-perpage"
                    className="border border-gray-300 rounded px-2 py-1 cursor-pointer bg-base-200"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                >
                    {itemsPerPageOptions.map(opt => (
                        <option key={opt} value={opt}>
                            {opt} แถว
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full">
                    <thead className="bg-accent-content sticky top-0 z-30 text-white">
                        <tr>
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className="border border-gray-300 px-4 py-2 text-center"
                                    // className={`border border-gray-300 px-4 py-2 ${getAlignClass(header.align)}`}
                                    style={{ width: header.width }}
                                >
                                    {header.label}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="border border-gray-300 text-center px-4 py-2 w-[15%]"></th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map((item, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white/20" : "bg-base-100"}>
                                {headers.map((header, hIdx) => (
                                    <td key={hIdx} className={`border border-gray-300 px-4 py-2 ${getAlignClass(header.align)}`}>
                                        {String(item[header.key])}
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
                                                            {!btnSmall && <span>{action.label}</span>}
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
                                                        {!btnSmall && <span>{action.label}</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 mt-2">
                <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-base-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page === 1}
                >
                    ก่อนหน้า
                </button>
                <span>หน้า {page} / {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-base-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={page === totalPages}
                >
                    ถัดไป
                </button>
            </div>
        </div>
    );
}
