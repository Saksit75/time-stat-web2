'use client';
import BackButton from "@/app/components/BackButton";
import DataTable from "@/app/components/DataTable";
import { Eye, Edit, Trash, Plus, User2 } from "lucide-react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { useEffect, useState } from "react";

type Teacher = {
  index: number;
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  status: string;
};

type HeaderTable = {
  label: string;
  key: keyof Teacher;
  width?: string;
  align?: "left" | "center" | "right";
}

type TableActionType = {
  label?: string | undefined;
  icon?: ((item: Teacher) => React.ReactNode) | undefined;
  onClick?: (item: Teacher) => void;
  href?: (item: Teacher) => string;
  btnClass?: string;
  btnSmall?: boolean;
}


const Teachers = () => {
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);



  const headers: HeaderTable[] = [
    { label: "ลำดับ", key: "index", width: "5%" },
    { label: "คำนำหน้า", key: "title", width: "10%", align: "center" },
    { label: "ชื่อ", key: "firstName", width: "auto", align: "left" },
    { label: "สกุล", key: "lastName", width: "auto", align: "left" },
    { label: "สถานะ", key: "status", width: "10%" },
  ];

  const items: Teacher[] = teacherList
  const tableActions: TableActionType[] = [
    {
      href: (item) => `/teachers/${item.id}`,

      label: "ดู",
      icon: () => <Eye className="w-4 h-4" />,
      btnSmall: true,
      btnClass: "btn-info",
    },
    {
      href: (item) => `/teachers/${item.id}/edit`,
      label: "แก้ไข",
      icon: () => <Edit className="w-4 h-4" />,
      btnSmall: true,
      btnClass: "btn-warning",
    },
  ]

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page,
        limit: itemsPerPage,
      };
      const resTeachers = await Axios.get("/teachers", { params });
      const teacherData = resTeachers.data?.data || [];
      const mapTeacher = teacherData.teachers.map((teacher: any, idx: number) => ({
        index: (Number(teacherData.currentPage) - 1) * Number(teacherData.limit) + (idx + 1),
        id: teacher.id,
        title: teacher.title_relation?.title_th || "-",
        firstName: teacher.first_name || "-",
        lastName: teacher.last_name || "-",
        status: teacher.status === "in" ? "อยู่" : teacher.status === "out" ? "ออก" : "-",
      }));
      setTeacherList(mapTeacher);
      setTotalPages(teacherData.totalPages);

    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeacherList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    fetchTeachers();
  }, [page, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
      <div>
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold text-center">รายชื่อบุคลากร</h1>
      <div className="text-end">
        <Link href="/teachers/new" className="btn btn-primary !rounded-box gap-2"> <Plus className="w-4 h-4" /> เพิ่ม</Link>
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

export default Teachers;