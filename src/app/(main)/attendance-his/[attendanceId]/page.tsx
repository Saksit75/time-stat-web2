'use client';

import { useState, useEffect, } from 'react';
import { AxiosResponse } from 'axios';
import Axios from '@/lib/axios';
import { FormApiResponse } from '@/types/attendance';

import AttendanceTable from '@/app/components/AttendanceTable';
import MyDatePicker from '@/app/components/MyDatePicker';
import Selecter from '@/app/components/Selecter';
import BackButton from '@/app/components/BackButton';
import Modal from '@/app/components/Modal';
import LeaveStudent from '@/app/components/LeaveStudent';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';
export default function AttendanceView() {
    const params = useParams();
    const attendanceId = params.attendanceId;
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
    type TeacherType = {
        id: number | null;
        title: string;
        firstName: string;
        lastName: string;
    };

    type TempDataFormType = FormApiResponse | null;

    const [teacherList, setTeacherList] = useState<TeacherType | null>(null);
    const [studentsByClass, setStudentsByClass] = useState<StudentsByClassType | null>(null);
    const [dataForm, setDataForm] = useState<FormApiResponse | null>(null);
    const [tempDataForm, setTempDataForm] = useState<TempDataFormType>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectClass, setSelectClass] = useState<number | null>(null);

    // ---------- 🧠 FUNCTIONS ----------
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

    useEffect(() => {
        if (selectClass !== null && dataForm?.formData) {
            const classData: any = dataForm.formData[selectClass.toString()];
            if (classData) setStudentsByClass(classData);
        }
    }, [dataForm, selectClass]);



    const getTimeStatHisDetail = async () => {
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
            const res: AxiosResponse<any> = await Axios.get(`/teachers/${teacherId}`);
            const teacher = res.data.data;

            setTeacherList({
                id: teacher.id,
                title: teacher.title_relation?.title_th || '',
                firstName: teacher.first_name,
                lastName: teacher.last_name,
            });

            // ✅ setSelectedTeacher หลังจากได้ข้อมูลเรียบร้อย
            setSelectedTeacher(teacher.id);
        } catch {
            setTeacherList(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const teacherId = await getTimeStatHisDetail();
            if (teacherId) {
                // โหลดข้อมูลครู แล้วค่อย setSelectedTeacher ทีหลัง
                await getTeacherList(teacherId);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-18 min-h-screen">
            <BackButton />

            <form className="flex flex-col gap-4">
                <h1 className="text-4xl font-black text-center text-primary">
                    ข้อมูลการมาเรียน
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

                <div className="flex items-center justify-center gap-3 w-full">
                    <label htmlFor="teacher-select" className="whitespace-nowrap text-lg">
                        คุณครู : <span className="text-red-500">*</span>
                    </label>

                    <Selecter
                        id="teacher-select"
                        value={selectedTeacher}
                        disabled={true}
                        options={
                            teacherList
                                ? [{
                                    value: teacherList.id?.toString() || "",
                                    label: `${teacherList.title}${teacherList.firstName} ${teacherList.lastName}`,
                                }]
                                : []
                        }
                    />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Link href={`/attendance-his/${attendanceId}/edit`} className="btn btn-warning !rounded-box"><Edit className="w-4 h-4" /> แก้ไข</Link>
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
                        onSelectLeave={() => { }}
                        disabled={true}
                    />
                )}
            </Modal>
        </div>
    );
}