'use client';

import BackButton from "@/app/components/BackButton";
import { User, FileText } from "lucide-react";
import Axios from "@/lib/axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type StudentApiType = {
  photo: string | null;
  title_relation: { title_th: string } | null;
  first_name: string;
  last_name: string;
  gender: string;
  class_level_relation: { class_level_th: string } | null;
  student_number: number | string;
  student_id: string;
  detail: string | null;
  status: string;
  id_card: string | null;
};

type StudentType = {
  photo: string | null;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  classLevel: string;
  studentNumber: string;
  studentId: string;
  detail: string;
  status: string;
  idCard: string;
};

export default function StudentView() {
  const params = useParams();
  const router = useRouter();
  const { studentId } = params;

  const [student, setStudent] = useState<StudentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await Axios.get(`/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const s: StudentApiType = res.data.data;

        setStudent({
          photo: s.photo || null,
          title: s.title_relation?.title_th || "-",
          firstName: s.first_name,
          lastName: s.last_name,
          gender: s.gender === 'm' ? 'ชาย' : s.gender === 'f' ? 'หญิง' : '-',
          classLevel: s.class_level_relation?.class_level_th || "-",
          studentNumber: String(s.student_number),
          studentId: s.student_id,
          detail: s.detail || "-",
          status: s.status,
          idCard: s.id_card || "-",
        });
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, router]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>No student data</div>;

  const statusColor = (status: string) => {
    switch (status) {
      case "in": return "bg-green-500 text-white";
      case "out": return "bg-red-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="container mx-auto px-4 py-18 min-h-screen flex flex-col gap-6">
      <div className="flex">
        <BackButton />
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
        <div className="flex flex-col w-full bg-base-100 rounded-lg shadow-xl overflow-hidden">

          {/* Title Bar */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8" /> ข้อมูลนักเรียน
            </h1>
            <p className="text-white/80">แสดงข้อมูลนักเรียน</p>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col gap-8 bg-base-300">

            {/* รูปนักเรียน */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 border rounded overflow-hidden bg-base-100 flex items-center justify-center">
                {student.photo ? (
                  <img src={student.photo} alt="รูปนักเรียน" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">เพิ่มรูป</span>
                )}
              </div>
            </div>

            {/* ข้อมูลส่วนตัว */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5" /> ข้อมูลนักเรียน
                </h2>
                <p className={`inline-block px-3 py-1 rounded-full font-medium ${statusColor(student.status)}`}>
                  {student.status === "in" ? "อยู่" : student.status === "out" ? "ออก" : "-"}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">คำนำหน้า</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.title}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">ชื่อ</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.firstName}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">สกุล</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.lastName}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">เพศ</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.gender}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">เลขประชาชน</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.idCard}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">เลขประจำตัวนักเรียน</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.studentId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ข้อมูลการศึกษา */}
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-semibold">ชั้นเรียน</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.classLevel}</p>
                </div>
                <div>
                  <span className="font-semibold">เลขที่</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">{student.studentNumber}</p>
                </div>
              </div>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="flex flex-col gap-2 w-full">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5" /> รายละเอียดเพิ่มเติม
              </h2>
              <p className="bg-base-100 p-4 rounded border min-h-[100px]">{student.detail}</p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <Link href={`/students/${studentId}/edit`} className="btn btn-warning btn-soft !rounded-box w-full">
                แก้ไข
              </Link>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex justify-center text-sm text-gray-500 mt-4">
          <span className="text-red-500">*</span> ระบุข้อมูลที่จำเป็นต้องกรอก
        </div>
      </div>
    </div>
  );
}
