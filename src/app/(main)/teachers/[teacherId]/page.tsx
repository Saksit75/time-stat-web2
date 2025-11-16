'use client';

import BackButton from "@/app/components/BackButton";
import { User, FileText } from "lucide-react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type TeacherApiType = {
  photo: string;
  first_name: string;
  last_name: string;
  title_relation: { title_th: string };
  class_level_relation: { class_level_th: string };
  gender: string;
  subject: string;
  phone: string;
  id_card: string;
  username: string;
  role: string;
  detail: string;
  status: string;
};

type TeacherType = {
  photo: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  classLevel: string;
  subject: string;
  phone: string;
  idCard: string;
  username: string;
  role: string;
  detail: string;
  status: string;
};

export default function TeacherView() {
  const params = useParams();
  const router = useRouter();
  const { teacherId } = params;

  const [teacher, setTeacher] = useState<TeacherType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTeacher = async () => {
      try {
        const res = await Axios.get(`/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const t: TeacherApiType = res.data.data;
        setTeacher({
          title: t.title_relation.title_th,
          firstName: t.first_name,
          lastName: t.last_name,
          classLevel: t.class_level_relation.class_level_th,
          subject: t.subject,
          phone: t.phone,
          idCard: t.id_card,
          username: t.username,
          detail: t.detail,
          status: t.status,
          photo: t.photo,
          gender: t.gender,
          role: t.role,
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

    fetchTeacher();
  }, [teacherId, router]);

  if (loading) return <div>Loading...</div>;
  if (!teacher) return <div>No teacher data</div>;

  const teacherPhoto = teacher.photo || null;

  const statusColor = (status: string) => {
    switch (status) {
      case "in":
        return "bg-green-500 text-white";
      case "out":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
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
              <User className="w-8 h-8" />
              ข้อมูลบุคลากร
            </h1>
            <p className="text-white/80">แสดงข้อมูลบุคลากร</p>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col gap-8 bg-base-300">
            {/* รูป */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-40 h-40 border rounded overflow-hidden bg-base-100 flex items-center justify-center">
                {teacherPhoto ? (
                  <img
                    src={teacherPhoto}
                    alt="รูปบุคลากร"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">เพิ่มรูป</span>
                )}
              </div>
            </div>

            {/* ข้อมูลส่วนตัว */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5" /> ข้อมูลส่วนตัว
                </h2>
                <p
                  className={`inline-block px-3 py-1 rounded-full font-medium ${statusColor(
                    teacher.status
                  )}`}
                >
                  {teacher.status === "in"
                    ? "อยู่"
                    : teacher.status === "out"
                    ? "ออก"
                    : "ไม่ระบุ"}
                </p>
              </div>

              {/* ข้อมูลติดต่อ */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">คำนำหน้า</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                      {teacher.title}
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">ชื่อ</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                      {teacher.firstName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">สกุล</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                      {teacher.lastName}
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="font-semibold">เพศ</span>
                    <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                      {teacher.gender === "m"
                        ? "ชาย"
                        : teacher.gender === "f"
                        ? "หญิง"
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ข้อมูลการศึกษา */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">ประจำชั้น</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                    {teacher.classLevel}
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">ประจำวิชา</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                    {teacher.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* ข้อมูลติดต่อเพิ่มเติม */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">เบอร์โทร</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                    {teacher.phone}
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">รหัสบัตรประชาชน</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                    {teacher.idCard}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">Username</span>
                  <p className="mt-1 bg-base-100 p-2 rounded border min-h-[42px]">
                    {teacher.username}
                  </p>
                </div>
              </div>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5" /> รายละเอียดเพิ่มเติม
              </h2>
              <p className="bg-base-100 p-4 rounded border min-h-[100px]">
                {teacher.detail || "-"}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <Link
                href={`/teachers/${teacherId}/edit`}
                className="btn btn-warning btn-soft !rounded-box w-full"
              >
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
