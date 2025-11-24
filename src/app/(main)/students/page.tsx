'use client';
import BackButton from "@/app/components/BackButton";
import DataTable from "@/app/components/DataTable";
import { Eye, Edit, Plus, ArrowUp10, UsersRound } from "lucide-react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { s } from "framer-motion/client";

// ✅ Type ของ student
type Student = {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  idCard: string;
  studentId: string;
  classLevel: string;
  gender: string;
  detail: string;
  status: string;
  photo: string;
  index: number;
}

// Type สำหรับ table header
type HeaderTable = {
  label: string;
  key: keyof Student;
  width?: string;
  align?: "left" | "center" | "right";
}

type TableActionType = {
  label?: string | undefined;
  icon?: ((item: Student) => React.ReactNode) | undefined;
  onClick?: (item: Student) => void;
  href?: (item: Student) => string;
  btnClass?: string;
  btnSmall?: boolean;
}


// ✅ ฟังก์ชัน map ข้อมูล student จาก API
const mapStudent = (student: any, idx: number): Student => ({
  index: idx + 1,
  id: student.id,
  title: student.title_relation?.title_th || "-",   // ป้องกัน null
  firstName: student.first_name || "-",
  lastName: student.last_name || "-",
  studentNumber: student.student_number || "-",
  idCard: student.id_card || "-",
  studentId: student.student_id || "-",
  classLevel: student.class_level_relation?.class_level_th || "-",
  gender: student.gender || "-",
  detail: student.detail || "-",
  photo: student.photo || "",
  status: student.status === "in" ? "อยู่" : student.status === "out" ? "ออก" : "-",
});

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Table headers
  const headers: HeaderTable[] = [
    { label: "ลำดับ", key: "index", width: "5%" },
    { label: "เลขประชาชน", key: "idCard", width: "10%" },
    { label: "เลขประจำตัวนักเรียน", key: "studentId", width: "10%" },
    { label: "คำนำหน้า", key: "title", width: "10%" },
    { label: "ชื่อ", key: "firstName", align: "left" },
    { label: "สกุล", key: "lastName", align: "left" },
    { label: "ชั้น", key: "classLevel", width: "10%", align: "left" },
    { label: "เลขที่", key: "studentNumber", width: "7%" },
    { label: "สถานะ", key: "status", width: "7%" },
  ];

  // Map items สำหรับ table
  const items: Student[] = students
  const tableActions: TableActionType[] = [
    {
      href: (item) => `/students/${item.id}`,
      label: "ดู",
      icon: () => <Eye className="w-4 h-4" />,
      btnSmall: true,
      btnClass: "btn-info",
    },
    {
      href: (item) => `/students/${item.id}/edit`,
      label: "แก้ไข",
      icon: () => <Edit className="w-4 h-4" />,
      btnSmall: true,
      btnClass: "btn-warning",
    },
  ]
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page,
        limit: itemsPerPage,
      }
      const resStudents = await Axios.get("/students", { params });
      const studentData = resStudents.data?.data || [];
      const mapStudent = studentData.students.map((student: any, idx: number) => ({
        index: (Number(studentData.currentPage) - 1) * Number(studentData.limit) + (idx + 1),
        id: student.id,
        title: student.title_relation?.title_th || "-",
        firstName: student.first_name || "-",
        lastName: student.last_name || "-",
        studentNumber: student.student_number || "-",
        idCard: student.id_card || "-",
        studentId: student.student_id || "-",
        classLevel: student.class_level_relation?.class_level_th || "-",
        gender: student.gender || "-",
        detail: student.detail || "-",
        photo: student.photo || "",
        status: student.status === "in" ? "อยู่" : student.status === "out" ? "ออก" : "-",
      }));
      setStudents(mapStudent);
      setTotalPages(studentData.totalPages);
      // setPage(studentData.currentPage);
      // setItemsPerPage(studentData.limit);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    fetchStudents();
  }, [page, itemsPerPage]);


  return (
    <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
      <div>
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold text-center">รายชื่อนักเรียน</h1>
      <div className="flex items-center justify-end gap-2">
        <Link href="/students/class-room" className="btn btn-secondary !rounded-box gap-2">
          <UsersRound className="w-4 h-4" /> ห้องเรียน
        </Link>
        <Link href="/students/up-level" className="btn btn-accent !rounded-box gap-2">
          <ArrowUp10 className="w-4 h-4" /> เลื่อนชั้น
        </Link>
        <Link href="/students/new" className="btn btn-primary !rounded-box gap-2">
          <Plus className="w-4 h-4" /> เพิ่ม
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="ml-4 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <DataTable
          headers={headers}
          items={items}
          actions={tableActions}
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
          perPageOptions={[10, 20, 50, 100, 200, 300]}
        />
      )}


    </div>
  );
};

export default Students;
