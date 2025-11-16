'use client'

import BackButton from "@/app/components/BackButton"
import { CircleCheckBig, ChevronsUpDown } from "lucide-react"
import { use, useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { useAppStore } from "@/store/appState"
import { useRouter } from "next/navigation"
import Axios from "@/lib/axios"
import Swal from "sweetalert2"
type StudentsType = {
    id: string
    title: string
    firstName: string
    lastName: string
    studentNumber: number
    studentId: string
    classLevel: string
}
type ClassLevelType = {
    id: number
    classLevel: string
}

const ClassRoom = () => {
    const router = useRouter()
    const isDark = useAppStore((state) => state.isDark)

    // 🧩 ตัวอย่างข้อมูลนักเรียน
    const [students, setStudents] = useState<StudentsType[]>([])
    const [classLevel, setClassLevel] = useState<ClassLevelType[]>([])
    const [selectedClassId, setSelectedClassId] = useState<number | "">("");

    // 🔁 เมื่อมีการลากแล้วปล่อย
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const items = Array.from(students)
        const [reordered] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reordered)
        const updateNumber: StudentsType[] = items.map((s, i) => ({
            ...s,
            studentNumber: i + 1,
        }))
        setStudents(updateNumber)
    }

    // ✅ ฟังก์ชันกดบันทึก (จำลองส่งข้อมูลเรียงใหม่ไป backend)
    const saveStudentNumber = async () => {
        console.log("ssss : ", students);

        const result = await Swal.fire({
            icon: "question",
            title: "ยืนยันการบันทึก?",
            text: "คุณต้องการบันทึกการเรียงลําดับเลขที่นักเรียนหรือไม่?",
            showDenyButton: true,
            confirmButtonText: "ยืนยัน",
            denyButtonText: "ยกเลิก",
            theme: isDark ? "dark" : "light",
        })
        if (!result.isConfirmed) return
        try {
            const updateData = students.map((s, i) => ({
                id: s.id,
                studentNumber: i + 1,
            }))
            if (updateData.length === 0) {
                throw new Error("ไม่พบข้อมูลนักเรียน")
            }
            const res = await Axios.post("/students/update-student-number", { data: updateData })
            if (res.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "บันทึกสําเร็จ",
                    text: "การเรียงลําดับเลขที่นักเรียนสําเร็จ",
                    theme: isDark ? "dark" : "light",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    router.push("/students")
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error instanceof Error ? error.message : "ไม่สามารถบันทึกข้อมูลได้",
                theme: isDark ? "dark" : "light",
                confirmButtonText: "ตกลง",
            })
        }
    }
    const getStudent = async (classLevel = 1) => {
        const resStudents = await Axios.get(`/students?status=in&classLevel=${classLevel}`);
        console.log("students : ", resStudents);

        setStudents(resStudents.data.data.students.map((s: any) => ({ id: s.id, title: s.title_relation.title_th, firstName: s.first_name, lastName: s.last_name, studentNumber: s.student_number,studentId: s.student_id, classLevel: s.class_level_relation.class_level_th })));
    }
    const getClassLevel = async () => {
        const resClassLevel = await Axios.get(`/class-level`);
        console.log("classLevel : ", resClassLevel.data.data);
        setClassLevel(resClassLevel.data.data.map((item: any) => ({
            id: Number(item.id),
            classLevel: item.class_level_th,
        }))
        )
    }

    useEffect(() => {
        getStudent()
    }, [classLevel])
    useEffect(() => {
        getClassLevel()
    }, [])
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col gap-2 min-h-screen">
            <div className="flex items-center justify-between">
                <BackButton />
                <button
                    type="button"
                    className="btn btn-primary !rounded-box"
                    onClick={saveStudentNumber}
                >
                    <CircleCheckBig className="w-4 h-4" /> บันทึก
                </button>
            </div>

            <div className="flex flex-col p-4 gap-4 w-full items-center">
                <div className="flex flex-col items-center gap-2 w-full max-w-5xl">
                    <div className="w-full text-center">
                        <h1 className="text-2xl font-bold">รายชื่อนักเรียน</h1>
                    </div>

                    <div className="flex flex-col gap-1  items-end justify-center w-full">
                        <select
                            className="select rounded-lg px-3"
                            value={selectedClassId}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setSelectedClassId(value);
                                getStudent(value);
                            }}
                        >
                            {classLevel.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.classLevel}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm px-2"><span className="text-error">*</span> ลากและวางเพื่อเรียงลําดับใหม่</div>
                    </div>

                    <div id="dragDropArea" className="w-full mx-auto mt-4">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="students">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex flex-col gap-2"
                                    >
                                        {students.length > 0 ? students.map((student, index) => (
                                            <Draggable
                                                key={student.id}
                                                draggableId={String(student.id)} // ควรเป็น string เสมอ
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-3 rounded-lg shadow-sm bg-base-300 cursor-grab flex items-center justify-between transition-all duration-200 
        ${snapshot.isDragging ? 'scale-105 bg-base-200 shadow-md' : 'hover:bg-base-200'}
      `}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            <div>{index + 1}. {student.title}{student.firstName} {student.lastName}</div>
                                                            <div className="text-red-500 whitespace-pre-wrap"> {"    "}รหัสนักเรียน : {student.studentId || "-"} เลขที่ : {student.studentNumber}</div>
                                                        </div>
                                                        <span className="opacity-50 text-sm hover:opacity-100">
                                                            <ChevronsUpDown />
                                                        </span>
                                                    </div>
                                                )}
                                            </Draggable>

                                        )) : (
                                            <div className="w-full text-center">ไม่พบข้อมูล</div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClassRoom
