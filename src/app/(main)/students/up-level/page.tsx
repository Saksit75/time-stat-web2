'use client'
import BackButton from "@/app/components/BackButton"
import { CircleCheckBig, CircleX, CircleAlert } from "lucide-react"
import AutocompleteX from "@/app/components/AutoCompleteX";
import { useEffect, useState, useRef, use } from "react";
import Axios from "@/lib/axios";
import DataTable from "@/app/components/DataTable";
import { Eye, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useAppStore } from "@/store/appState";
import { useRouter } from "next/navigation";
type HeaderTable = {
    label: string;
    key: keyof StudentsType;
    width?: string;
    align?: "left" | "center" | "right";
}

type TableActionType = {
    label?: string;
    icon?: (item: StudentsType) => React.ReactNode;
    onClick?: (item: StudentsType) => void;
    href?: (item: StudentsType) => string;
    btnClass?: string;
    btnSmall?: boolean;
};

type StudentsType = {
    index: number;
    sId: number;
    title: string;
    firstName: string;
    lastName: string;
    classLevel: string;
    studentNumber: string;
}
type OptionType = { label: string; value: string };

const UpLevel = () => {
    const router = useRouter();
    const isDark = useAppStore((state) => state.isDark);
    const headers: HeaderTable[] = [
        { label: "ลำดับ", key: "index", width: "5%" },
        { label: "คำนำหน้า", key: "title", width: "10%" },
        { label: "ชื่อ", key: "firstName", width: "25%", align: "left" },
        { label: "สกุล", key: "lastName", width: "25%", align: "left" },
        { label: "ชั้น", key: "classLevel", width: "15%", align: "left" },
        { label: "เลขที่", key: "studentNumber", width: "10%" },
    ];
    const tableActions: TableActionType[] = [
        {
            onClick: (item) => deleteStudent(item.sId),
            label: "ลบ",
            icon: () => <Trash className="w-4 h-4" />,
            btnSmall: true,
            btnClass: "btn-error",
        },
    ];
    const [students, setStudents] = useState<StudentsType[]>([]);
    const [tempStudents, setTempStudents] = useState<StudentsType[]>([]);
    const [options, setOptions] = useState<OptionType[]>([]);
    const [query, setQuery] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const selectOption = (option: OptionType) => {
        const val = Number(option.value);

        setStudents((prev) => {
            // ถ้ามีอยู่แล้ว ไม่ต้องเพิ่ม
            if (prev.some((st) => st.sId === val)) return prev;

            // หา student ที่เลือก
            const selected = tempStudents.find((st) => st.sId === val);
            if (!selected) return prev;

            // เพิ่ม property index (ลำดับที่เลือก)
            const newStudent = { ...selected, index: prev.length + 1 };

            return [...prev, newStudent];
        });
    };
    const deleteStudent = async (sId: number) => {
        const result = await Swal.fire({
            icon: "question",
            title: "ยืนยันการลบ",
            showDenyButton: true,
            confirmButtonText: "ยืนยัน",
            denyButtonText: "ยกเลิก",
            theme: isDark ? "dark" : "light",
        });

        if (!result.isConfirmed) return;

        setStudents((prev) => {
            // ลบออกก่อน
            const filtered = prev.filter((st) => st.sId !== sId);
            // อัพเดต index ใหม่ให้เรียงต่อกัน
            return filtered.map((st, i) => ({ ...st, index: i + 1 }));
        });
    };
    const upClassLevel = async () => {
        const result = await Swal.fire({
            icon: "question",
            title: "เลื่อนชั้นนักเรียน",
            html: students.length > 0
                ? `<b><div>นักเรียนยกเว้นการเลื่อนชั้น ${students.length} คน</div></b>
       <div>${students.map((st) => `${st.title} ${st.firstName} ${st.lastName} - เลขที่ ${st.studentNumber} (${st.classLevel})`).join("<br/>")}</div>`
                : "ไม่มีนักเรียนยกเว้นการเลื่อนชั้น",
            showDenyButton: true,
            confirmButtonText: "ยืนยัน",
            denyButtonText: "ยกเลิก",
            theme: isDark ? "dark" : "light",
        });

        if (!result.isConfirmed) return
        if (result.isConfirmed) {
            const conf = await Swal.fire({
                icon: "warning",
                title: "ยืนยันการยืนยันเลื่อนชั้นนักเรียน",
                text: "เมื่อเลื่อนชั้นแล้วจะไม่สามารถย้อนกลับได้",
                showDenyButton: true,
                confirmButtonText: "ยืนยัน",
                denyButtonText: "ยกเลิก",
                theme: isDark ? "dark" : "light",
                didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
                    if (confirmButton) {
                        confirmButton.disabled = true; // ปิดปุ่มตอนเปิด
                        let countdown = 5;
                        confirmButton.textContent = `ยืนยัน (${countdown})`; // ใส่ countdown
                        const timer = setInterval(() => {
                            countdown--;
                            if (confirmButton) confirmButton.textContent = `ยืนยัน (${countdown})`;
                            if (countdown <= 0) {
                                if (confirmButton) {
                                    confirmButton.disabled = false; // เปิดใช้งานปุ่ม
                                    confirmButton.textContent = "ยืนยัน";
                                }
                                clearInterval(timer);
                            }
                        }, 1000);
                    }
                },
            });

            if (!conf.isConfirmed) return
            try {
                console.log("Payload:", students);
                console.log("Payload to send:", students.map(st => st.sId));
                await Axios.post('/students/up-level', { students: students.map(st => st.sId) });



                Swal.fire({
                    title: "เลื่อนชั้นเรียบร้อย!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    theme: isDark ? "dark" : "light",
                }).then(() => {
                    router.push("/students");
                });
                setStudents([]);
            } catch (err) {

                console.error("fetch error:", err);
                // Swal.fire({
                //     title: "เกิดข้อผิดพลาด",
                //     icon: "error",
                //     timer: 1500,
                //     showConfirmButton: false,
                //     theme: isDark ? "dark" : "light",
                // });
            }

        }

    }

    useEffect(() => {

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            // if (query.trim() === "") {
            //     setOptions([]);
            //     return;
            // }
            try {
                const res = await Axios.get("/students/some", { params: { q: query } });
                const data = Array.isArray(res.data?.data) ? res.data.data : [];
                setTempStudents(data.map((s: any, idx: number) => ({
                    index: idx + 1,
                    sId: s.id,
                    title: s.title || "",
                    firstName: s.first_name,
                    lastName: s.last_name,
                    classLevel: s.class_level || "",
                    studentNumber: s.student_number
                })))
                setOptions(
                    data.map((s: any) => ({
                        value: s.id,
                        label: `${s.title || ""}${s.first_name} ${s.last_name}  เลขที่ ${s.student_number} - ${s.class_level}`,
                    }))
                );
            } catch (err) {
                console.error("fetch error:", err);
            }
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
            <div className="flex items-center justify-between">
                <BackButton />
                <button type="button" className="btn btn-primary !rounded-box" onClick={() => upClassLevel()}><CircleCheckBig className="w-4 h-4" /> ยืนยันเลื่อนชั้นนักเรียน</button>
            </div>
            <div className="flex flex-col p-4 gap-4 w-full items-center">
                <AutocompleteX
                    label="ค้นหานักเรียน"
                    options={options}
                    onInputChange={setQuery} // ✅ รับ query จากลูก
                    onSelect={(opt) => selectOption(opt)}
                />
                <div className="flex flex-col items-center gap-2 w-full ">
                    <div className="w-full text-center"><h1 className="text-2xl font-bold">รายชื่อนักเรียนยกเว้นการเลื่อนชั้น</h1></div>

                    <DataTable headers={headers} items={students} actions={tableActions} showPagination={false} showLengthList={false} />
                </div>
            </div>
        </div>
    )
}
export default UpLevel