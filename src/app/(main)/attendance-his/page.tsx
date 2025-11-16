'use client'
import DataTable from "@/app/components/DataTable"
import BackButton from "@/app/components/BackButton"
import MonthRangeSearch from "@/app/components/MonthRangeSearch"
import { useState, useEffect } from "react"
import Axios from "@/lib/axios"
import Swal from "sweetalert2"
import { useAppStore } from "@/store/appState"
import { thaiDate } from "@/gobalFunction/function"
import { Eye, Edit, Trash } from "lucide-react";

type TimeStatType = {
    index: number
    displayDate: string
    date: string
    id: number
}

type HeaderTableType = {
    label: string
    key: keyof TimeStatType
    width?: string
    align?: "left" | "center" | "right"
}

type TableActionType = {
    label?: string;
    icon?: (item: TimeStatType) => React.ReactNode;
    onClick?: (item: TimeStatType) => void;
    href?: (item: TimeStatType) => string;
    btnClass?: string;
    btnSmall?: boolean;
};

const AttendanceHis = () => {
    const isDark = useAppStore((state) => state.isDark);
    const [timeStat, setTimeStat] = useState<TimeStatType[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState<{
        startMonth?: string
        startYear?: string
        endMonth?: string
        endYear?: string
    } | null>(null);
    const headerTable: HeaderTableType[] = [
        { label: "ลำดับ", key: "index", width: "7%", align: "center" },
        { label: "วันที่", key: "displayDate", width: "auto", align: "left" },
    ];
    const fetchTimeStat = async () => {
        try {
            setLoading(true);

            const params: any = {
                page: page,
                limit: itemsPerPage,
            };
            if (searchParams) {
                params.page = 1;
                params.limit = 10;
                params.startMonth = searchParams.startMonth;
                params.startYear = searchParams.startYear;
                params.endMonth = searchParams.endMonth;
                params.endYear = searchParams.endYear;
            }
            const res = await Axios.get('/time-stat/time-stat-his', { params });
            const resTimeStat = res.data.data;
            const mapped = resTimeStat.timeStat.map((item: any, idx: number) => ({
                index: (resTimeStat.currentPage - 1) * resTimeStat.limit + (idx + 1),
                showDate: thaiDate(new Date(resTimeStat.timeStat.date_time_stat), 'full'),
                id: item.id,
                displayDate: thaiDate(new Date(item.date_time_stat), 'full'),
                date: item.date_time_stat.split('T')[0],
            }));
            setTimeStat(mapped);
            setTotalPages(resTimeStat.totalPages);
            // setPage(resTimeStat.currentPage);
            // setItemsPerPage(resTimeStat.limit);
        } catch (error) {
            console.error('Error fetching time stats:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถโหลดข้อมูลได้',
                icon: 'error',
                theme: isDark ? 'dark' : 'light',
            });
        } finally {
            setLoading(false);
        }
    };
    const deleteTimeStat = async (id: number, date: string) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: `คุณต้องการลบข้อมูล ${thaiDate(new Date(date))} หรือไม่!`,
            theme: isDark ? 'dark' : 'light',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await Axios.delete(`/time-stat/time-stat-delete/${id}`);
                Swal.fire({
                    title: 'ลบข้อมูลเรียบร้อย!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    theme: isDark ? 'dark' : 'light',
                });
                fetchTimeStat();
            } catch (error) {
                console.error('Error deleting time stat:', error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถลบข้อมูลได้',
                    icon: 'error',
                    theme: isDark ? 'dark' : 'light',
                });
            }
        }
    };
    const tableActions: TableActionType[] = [
        {
            href: (item) => `/attendance-his/${item.id}`,
            label: "ดู",
            icon: () => <Eye className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-info",
        },
        {
            href: (item) => `/attendance-his/${item.id}/edit`,
            label: "แก้ไข",
            icon: () => <Edit className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-warning",
        },
        {
            onClick: (item) => deleteTimeStat(item.id, item.date),
            label: "ลบ",
            icon: () => <Trash className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-error",
        },
    ];

    // Search handler
    const handleSearch = (data: {
        startMonth: string
        startYear: string
        endMonth: string
        endYear: string
    }) => {
        setSearchParams(data);
        setPage(1);
    };
    const handleClear = () => {
        setSearchParams(null);
        setPage(1);
    };
    useEffect(() => {
        setPage(1);
    }, [itemsPerPage]);
    useEffect(() => {
        fetchTimeStat();
    }, [page, itemsPerPage, searchParams]);

    return (
        <div className="container mx-auto px-4 py-18 min-h-screen">
            <div className="flex items-center gap-4 mb-4">
                <BackButton />
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">ประวัติข้อมูลการมาเรียน</h1>
            </div>


            <div className="flex flex-col gap-4 w-full">
                <MonthRangeSearch onSearch={handleSearch} onClear={handleClear} />

                <div className="flex flex-col gap-4 bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="ml-4 text-lg">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <DataTable
                            headers={headerTable}
                            items={timeStat}
                            actions={tableActions}
                            currentPage={page}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceHis;