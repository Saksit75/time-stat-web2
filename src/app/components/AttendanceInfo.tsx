import Table from "./Table"
import atInfo from "@/data/atInfo.json"
import { Eye, Edit, Trash } from "lucide-react";
const AttendanceInfo = () => {
    type AtInfo = {
        index: number;
        date: string;
    };
    type HeaderTable = {
        label: string;
        key: keyof AtInfo;
        width?: string;
        align?: "left" | "center" | "right";
    };

    type Actions = {
        label?: string;
        icon?: (item: any) => React.ReactNode;
        onClick?: (item: any) => void;
        href?: (item: any) => string;
        btnClass?: string;
        btnSmall?: boolean;
    };

    const handleEdit = (item: AtInfo) => {
        alert(`แก้ไขข้อมูลวันที่ ${item.date}`);
    };

    const handleDelete = (item: AtInfo) => {
        const confirmDelete = confirm(`ต้องการลบข้อมูลวันที่ ${item.date} ใช่หรือไม่?`);
        if (confirmDelete) {
            alert(`ลบข้อมูลวันที่ ${item.date} แล้ว`);
        }
    };



    const headers: HeaderTable[] = [
        { label: "ลำดับ", key: "index", width: "5%", align: "center" },
        { label: "วันที่", key: "date", width: "auto", align: "left" },
    ];

    const actions: Actions[] = [
        {
            href: (item) => `/teachers/${item.index}`,
            label: "ดู",
            icon: () => <Eye className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-info",
        },
        {
            label: "แก้ไข",
            icon: () => <Edit className="w-4 h-4" />,
            onClick: handleEdit,
            btnSmall: true,
            btnClass: "btn-warning",
        },
        {
            label: "ลบ",
            icon: () => <Trash className="w-4 h-4" />,
            onClick: handleDelete,
            btnSmall: true,
            btnClass: "btn-error",
        },
    ];

    const items: AtInfo[] = atInfo.map((atIn, idx) => ({ ...atIn, index: idx + 1 }));

    return (
        <div>
            {/* ✅ แก้ type error ตรงนี้ */}
            <Table headers={headers} items={items} actions={actions} itemsPerPageOptions={[5, 10, 20,50,100]} />
        </div>
    );
};

export default AttendanceInfo;
