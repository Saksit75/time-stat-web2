"use client";
import { useState, useEffect } from "react";

type AttendanceStatus = "come" | "absent" | "leave" | "sick" | "late";

type StudentData = {
  id: number;
  student_id: string;
  student_number: string;
  title: string;
  first_name: string;
  last_name: string;
  gender: string;
  class_status?: AttendanceStatus;
};

type LeaveStudentProps = {
  classLevelName: string;
  students: StudentData[];
  disabled?: boolean;
  onSelectLeave: (
    studentId: number,
    status: AttendanceStatus,
  ) => void;
};

const LeaveStudent = ({ classLevelName, students, onSelectLeave, disabled = false }: LeaveStudentProps) => {
  // local state แยกจาก parent
  const [localAttendance, setLocalAttendance] = useState<Record<number, AttendanceStatus>>(() => {
    const initial: Record<number, AttendanceStatus> = {};
    students.forEach(s => {
      initial[s.id] = s.class_status || "come";
    });
    return initial;
  });

  // รีเซ็ต state ทุกครั้งที่ students prop เปลี่ยน
  useEffect(() => {
    const initial: Record<number, AttendanceStatus> = {};
    students.forEach(s => {
      initial[s.id] = s.class_status || "come";
    });
    setLocalAttendance(initial);
  }, [students]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "come": return "bg-green-100/10 border-green-300";
      case "absent": return "bg-red-100/10 border-red-300";
      case "leave": return "bg-yellow-100/10 border-yellow-300";
      case "sick": return "bg-orange-100/10 border-orange-300";
      case "late": return "bg-blue-100/10 border-blue-300";
      default: return "bg-white/10 border-gray-300";
    }
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    const newAttendance = { ...localAttendance, [studentId]: status };
    setLocalAttendance(newAttendance);

    const student = students.find(s => s.id === studentId);
    if (student) {
      onSelectLeave(student.id, status);
    }
  };

  if (!students || students.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 py-8">
        ไม่พบข้อมูลนักเรียน
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">{classLevelName}</h2>
      <div className="mb-4 text-sm text-gray-500">
        จำนวนนักเรียนทั้งหมด: {students.length} คน
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {students
          .slice()
          .sort((a, b) => Number(a.student_number) - Number(b.student_number))
          .map((student, index) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${localAttendance[student.id] ? getStatusColor(localAttendance[student.id]) : getStatusColor("come")
                }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-medium min-w-8 text-sm">{index + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {student.title}{student.first_name} {student.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    เลขที่ {student.student_number} • {student.gender === "m" ? "ชาย" : student.gender === "f" ? "หญิง" : "-"}
                  </div>
                </div>
              </div>

              <select
                disabled={disabled}
                value={localAttendance[student.id] || "come"}
                onChange={(e) => handleStatusChange(student.id, e.target.value as AttendanceStatus)}
                className={`select w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-base-200 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} `}
              >
                <option value="come">มาเรียน</option>
                <option value="absent">ขาด</option>
                <option value="leave">ลา</option>
                <option value="sick">ป่วย</option>
                <option value="late">มาสาย</option>
              </select>
            </div>
          ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100/10 border border-green-300 rounded"></div>
            <span>มา: {students.filter(s => !localAttendance[s.id] || localAttendance[s.id] === "come").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100/10 border border-red-300 rounded"></div>
            <span>ขาด: {students.filter(s => localAttendance[s.id] === "absent").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100/10 border border-yellow-300 rounded"></div>
            <span>ลา: {students.filter(s => localAttendance[s.id] === "leave").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100/10 border border-orange-300 rounded"></div>
            <span>ป่วย: {students.filter(s => localAttendance[s.id] === "sick").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100/10 border border-blue-300 rounded"></div>
            <span>สาย: {students.filter(s => localAttendance[s.id] === "late").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStudent;
