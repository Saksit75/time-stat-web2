'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Eraser } from 'lucide-react';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import Axios from '@/lib/axios';
import { useAppStore } from '@/store/appState';
import { AttendanceRow, FormApiResponse } from '@/types/attendance';

// 🧩 Components
import AttendanceTable from '@/app/components/AttendanceTable';
import MyDatePicker from '@/app/components/MyDatePicker';
import Selecter from '@/app/components/Selecter';
import BackButton from '@/app/components/BackButton';
import Modal from '@/app/components/Modal';
import LeaveStudent from '@/app/components/LeaveStudent';
import { useParams,useRouter } from 'next/navigation';

export default function AttendanceEdit() {
  const params = useParams();
  const router = useRouter();
  const { attendanceId } = params;
  // ---------- 🧩 TYPES ----------
  type AttendanceStatus = 'come' | 'absent' | 'leave' | 'sick' | 'late';

  type StudentData = {
    id: number;
    student_id: string;
    student_number: string;
    title: string;
    first_name: string;
    last_name: string;
    gender: 'm' | 'f' | string;
    detail?: string;
    class_status?: AttendanceStatus;
  };

  type StudentsByClassType = {
    class_id: number;
    class_level_th: string;
    data: StudentData[];
    remark: StudentData[];
    absent?: number;
    leave?: number;
    sick?: number;
    late?: number;
    come_male?: number;
    come_female?: number;
    come_count?: number;
    not_come_male?: number;
    not_come_female?: number;
    not_come_count?: number;
    amount_male?: number;
    amount_female?: number;
    amount_count?: number;
  };

  type TempDataFormType = FormApiResponse | null;

  type TeacherType = {
    id: number | null;
    title: string;
    firstName: string;
    lastName: string;
  }
  const isDark = useAppStore((state) => state.isDark);

  const [teacherList, setTeacherList] = useState<TeacherType[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<StudentsByClassType | null>(null);
  const [dataForm, setDataForm] = useState<FormApiResponse | null>(null);
  const [tempDataForm, setTempDataForm] = useState<TempDataFormType>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectClass, setSelectClass] = useState<number | null>(null);

  const onOpenModal = (classId?: number) => {
    setIsModalOpen(true);

    if (classId !== undefined && dataForm) {
      setSelectClass(classId);
      setTempDataForm(dataForm);

      const classData: any = dataForm.formData[classId.toString()];
      if (classData) setStudentsByClass(classData);
    }
  };

  const onCloseModal = (saveChanges: boolean) => {
    if (saveChanges && tempDataForm && selectClass !== null) {
      const classKey = selectClass.toString();
      const updatedClassData: any = tempDataForm.formData[classKey];

      if (updatedClassData) {
        setDataForm((prev) => {
          if (!prev) return { ...tempDataForm };
          const newFormData = { ...prev.formData, [classKey]: updatedClassData };
          return { ...prev, formData: newFormData };
        });

        setStudentsByClass(updatedClassData);
      }
    }

    setIsModalOpen(false);
    setTempDataForm(null);
  };

  const onSelectLeave = (
    studentId: number,
    status: AttendanceStatus,
  ) => {
    if (!tempDataForm || selectClass === null) return;

    const classId = selectClass;
    setTempDataForm((prev) => {
      if (!prev) return null;

      const newFormData = { ...prev.formData };
      const classKey = classId.toString();
      const classData = { ...newFormData[classKey] };

      classData.remark = (classData.remark || []).map((s: StudentData) =>
        s.id === studentId ? { ...s, class_status: status } : s
      );

      let absentMale = 0,
        absentFemale = 0,
        leaveMale = 0,
        leaveFemale = 0,
        sickMale = 0,
        sickFemale = 0,
        lateMale = 0,
        lateFemale = 0;

      classData.remark.forEach((s: StudentData) => {
        switch (s.class_status) {
          case 'absent':
            s.gender === 'm' ? absentMale++ : absentFemale++;
            break;
          case 'leave':
            s.gender === 'm' ? leaveMale++ : leaveFemale++;
            break;
          case 'sick':
            s.gender === 'm' ? sickMale++ : sickFemale++;
            break;
          case 'late':
            s.gender === 'm' ? lateMale++ : lateFemale++;
            break;
        }
      });

      classData.absent = absentMale + absentFemale;
      classData.leave = leaveMale + leaveFemale;
      classData.sick = sickMale + sickFemale;
      classData.late = lateMale + lateFemale;

      const totalMale = classData.amount_male || 0;
      const totalFemale = classData.amount_female || 0;
      const totalCount = classData.amount_count || 0;

      const notComeMale = absentMale + leaveMale + sickMale;
      const notComeFemale = absentFemale + leaveFemale + sickFemale;
      const notComeCount = notComeMale + notComeFemale;

      classData.not_come_male = notComeMale;
      classData.not_come_female = notComeFemale;
      classData.not_come_count = notComeCount;

      classData.come_male = totalMale - notComeMale;
      classData.come_female = totalFemale - notComeFemale;
      classData.come_count = totalCount - notComeCount;

      newFormData[classKey] = classData;
      return { ...prev, formData: newFormData };
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedTeacher) {
    await Swal.fire({
      icon: 'warning',
      title: 'ข้อมูลไม่ครบถ้วน',
      text: 'กรุณาเลือกคุณครู',
      theme: isDark ? 'dark' : 'light',
    });
    return;
  }

  const result = await Swal.fire({
    icon: 'question',
    title: 'ยืนยันการบันทึกข้อมูล',
    text: 'คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้ไขข้อมูลทั้งหมด?',
    showCancelButton: true,
    confirmButtonText: 'บันทึกข้อมูล',
    cancelButtonText: 'ยกเลิก',
    theme: isDark ? 'dark' : 'light',
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      Swal.showLoading(); // แสดง loading ของ Swal
      try {
        const submitData = { ...dataForm, teacher: selectedTeacher };
        const res = await Axios.put(`/time-stat/update-time-stat/${attendanceId}`, submitData);

        if (res.data.status === 'error') {
          throw new Error(res.data.message);
        }

        return res.data;
      } catch (error: any) {
        const msg = error.response?.data?.error || error.message || 'ไม่สามารถบันทึกข้อมูลได้';
        Swal.showValidationMessage(msg);
      }
    }
  });

  if (result.isConfirmed) {
    Swal.fire({
      icon: 'success',
      title: 'บันทึกข้อมูลเรียบร้อย',
      timer: 1500,
      showConfirmButton: false,
      theme: isDark ? 'dark' : 'light',
    }).then(() => {
      router.push(`/attendance-his/${attendanceId}`);
    });
  }
};

  const getFormTimeStat = async () => {
    try {
      const res = await Axios.get(`/time-stat/time-stat-his-detail/${attendanceId}`);
      setDataForm(res.data.data);

      return res.data.data.teacher;
    } catch {
      setDataForm(null);
      return null;
    }
  };

  const getTeacherList = async (teacherId: number) => {
    try {
      const res: AxiosResponse<any> = await Axios.get(`/teachers`);

      const teacher = res.data.data.teachers;

      setTeacherList(
        teacher.map((t: any) => ({
          id: t.id,
          title: t.title_relation?.title_th || '',
          firstName: t.first_name,
          lastName: t.last_name,
        }))
      );

      setSelectedTeacher(String(teacherId) || "");
    } catch {
      setTeacherList([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = await getFormTimeStat();
      if (teacherId) {
        await getTeacherList(teacherId);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-18 min-h-screen">
      <BackButton />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-4xl font-black text-center text-primary">
          แก้ไขข้อมูลการมาเรียน
        </h1>

        <MyDatePicker
          initialDate={dataForm?.date}
          onDateChange={(date) =>
            setDataForm((prev: any) => (prev ? { ...prev, date } : { date }))
          }
          disabled={true}
        />

        <AttendanceTable
          formData={dataForm}
          onOpenModal={onOpenModal}
        />

        {/* 🧑‍🏫 เลือกคุณครู */}
        <div className="flex items-center justify-center gap-3 w-full">
          <label htmlFor="teacher-select" className="whitespace-nowrap text-lg">
            คุณครู : <span className="text-red-500">*</span>
          </label>

          <Selecter
            id="teacher-select"
            value={selectedTeacher}
            onChange={setSelectedTeacher}
            options={teacherList.map((t: any) => ({
              value: t.id.toString(),
              label: `${t.title} ${t.firstName} ${t.lastName}`,
            }))}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="submit" className="btn btn-primary !rounded-box">
           <Save className='w-4 h-4' /> บันทึก 
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => onCloseModal(true)}
        title={studentsByClass?.class_level_th || 'บันทึกการมาเรียนรายบุคคล'}
      >
        {studentsByClass && tempDataForm && (
          <LeaveStudent
            classLevelName={studentsByClass.class_level_th}
            students={studentsByClass.remark}
            onSelectLeave={onSelectLeave}
          />
        )}
      </Modal>
    </div>
  );
}