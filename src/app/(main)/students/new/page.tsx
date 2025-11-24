'use client';
import BackButton from "@/app/components/BackButton";
import { useState, useEffect } from "react";
import { User, GraduationCap, FileText } from "lucide-react";
import Axios from "@/lib/axios";
import Swal from "sweetalert2";
import { useAppStore } from "@/store/appState";
import { useRouter } from "next/navigation";

const StudentNew = () => {
  const router = useRouter();
  const isDark = useAppStore((state) => state.isDark);
  type TitleType = {
    id: number,
    title_th: string
    title_en: string
  }
  type ClassLevelType = {
    id: number,
    class_level_th: string
    class_level_en: string
  }
  type StudentTypeApi = {
    id: number;
    title: string;
    first_name: string;
    last_name: string;
    class_level: string;
    gender: string;
    student_id: string;
    id_card: string;
    student_number: string;
    detail: string;
    status: string;
    photo: string;
  }
  const [titleList, setTitleList] = useState<TitleType[]>([]);//array ของ obj
  const [classLevelList, setClassLevelList] = useState<ClassLevelType[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    classLevel: "",
    studentId: "",
    idCard: "",
    studentNumber: "",
    detail: "",
    status: "in",
    photo: null as File | null,
    gender: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        theme: isDark ? "dark" : "light",
        text: "กรุณาเลือกไฟล์รูปภาพที่เป็น JPEG, JPG, PNG หรือ GIF เท่านั้น",
      });
      e.target.value = ""; // reset input
      return;
    }

    // ถ้าไฟล์ถูกต้อง → เก็บไว้ใน state
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ยืนยันการบันทึกข้อมูล",
      text: "คุณแน่ใจหรือไม่ว่าต้องการบันทึกข้อมูลนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      theme: isDark ? "dark" : "light",
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        Swal.showLoading();

        const data = new FormData();
        data.append("status", formData.status || "");
        data.append("title", String(formData.title));
        data.append("first_name", formData.firstName || "");
        data.append("last_name", formData.lastName || "");
        data.append("gender", formData.gender?.toLowerCase() === "m" ? "m" : "f");
        data.append("id_card", formData.idCard || "");
        data.append("student_id", formData.studentId || "");
        data.append("class_level", formData.classLevel ? String(formData.classLevel) : "");
        data.append("student_number", formData.studentNumber || "");
        data.append("detail", formData.detail || "");

        if (formData.photo instanceof File) {
          data.append("photo", formData.photo);
        }

        try {
          const res = await Axios.post("/students", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return res.data;
        } catch (err: any) {
          let errorText = err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้";

          const errors = err.response?.data?.errors;
          if (errors) {
            // ตรวจสอบทั้ง array และ object
            if (Array.isArray(errors)) {
              errorText += "\n" + errors.map((e: any) => `• ${e.message}`).join("\n");
            } else if (typeof errors === "object") {
              errorText += "\n" + Object.values(errors).map((msg: any) => `• ${msg}`).join("\n");
            }
          }

          // แสดง validation message
          Swal.showValidationMessage(errorText);

          // return false เพื่อบอก Swal ว่าเกิด error
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "ข้อมูลนักเรียนถูกบันทึกเรียบร้อยแล้ว",
        theme: isDark ? "dark" : "light",
      }).then(() => router.push("/students"));
    }
  };



  const statusColor = (status: string) => {
    switch (status) {
      case "in": return "bg-green-500 text-white";
      case "out": return "bg-red-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await Axios.get("/name-title");
        setTitleList(res.data.data);
      } catch {
        setTitleList([]);
      }
    };
    const fetchClassLevels = async () => {
      try {
        const res = await Axios.get("/class-level");
        setClassLevelList(res.data.data);
      } catch {
        setClassLevelList([]);
      }
    }
    fetchTitles();
    fetchClassLevels()
  }, [])

  return (
    <div className="container mx-auto px-4 py-18 min-h-screen flex flex-col gap-6">
      <div className="flex">
        <BackButton />
      </div>

      <div className="flex flex-col items-center gap-2 justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-base-100 rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
        >
          {/* Title Bar */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8" />
              เพิ่มข้อมูลนักเรียน
            </h1>
            <p className="text-white/80">กรอกข้อมูลนักเรียนใหม่</p>
          </div>

          {/* Form Section */}
          <div className="p-8 flex flex-col gap-8 bg-base-300">

            {/* รูปนักเรียน */}
            <div className="flex flex-col items-center gap-2">
              {/* label ครอบรูป */}
              <label htmlFor="studentPhoto" title="คลิกเพื่อเลือกรูปภาพ" className="w-40 h-40 border rounded overflow-hidden bg-base-100 flex items-center justify-center cursor-pointer">
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="รูปนักเรียน"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">เลือกรูป</span>
                )}
              </label>

              {/* input file ซ่อน */}
              <input
                type="file"
                id="studentPhoto"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* ข้อมูลส่วนตัว */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5" /> ข้อมูลส่วนตัว
                </h2>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`inline-block px-3 py-1 rounded-full font-medium ${statusColor(formData.status)}`}
                >
                  <option value="in" className="bg-base-100 text-black dark:text-white">อยู่</option>
                  <option value="out" className="bg-base-100 text-black dark:text-white">ออก</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">คำนำหน้า <span className="text-red-500">*</span></span>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    required
                  >
                    <option value="">เลือก</option>
                    {titleList &&
                      titleList.map((title) => (
                        <option key={title.id} value={title.id}>{title.title_th}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">ชื่อ <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">นามสกุล <span className="text-red-500">*</span></span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">เพศ <span className="text-red-500">*</span></span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    required
                  >
                    <option value="">เลือก</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">เลขประชาชน</span>
                  <input
                    type="text"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">เลขประจำตัวนักเรียน</span>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลการศึกษา */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">ชั้นเรียน <span className="text-red-500">*</span></span>
                  <select
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    required
                  >
                    <option value="">เลือก</option>
                    {
                      classLevelList &&
                      classLevelList.map((classLevel) => (
                        <option key={classLevel.id} value={classLevel.id}>{classLevel.class_level_th}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-semibold">เลขที่ <span className="text-red-500">*</span></span>
                  <input
                    type="number"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    className="bg-base-100 p-2 rounded border w-full"
                    min={1}
                    required
                  />
                </div>
              </div>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5" /> รายละเอียดเพิ่มเติม
              </h2>
              <textarea
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                className="bg-base-100 p-4 rounded border w-full resize-none min-h-[100px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                className="btn flex-1 !rounded-box"
                onClick={() => window.history.back()}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 !rounded-box"
              >
                บันทึกข้อมูล
              </button>
            </div>

          </div>
        </form>

        {/* Helper Text */}
        <div className="flex justify-center text-sm text-gray-500">
          <span className="text-red-500">*</span> ระบุข้อมูลที่จำเป็นต้องกรอก
        </div>
      </div>
    </div>
  );
};

export default StudentNew;
