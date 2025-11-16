'use client'
import { Eye } from "lucide-react";
type StuProps = {
  s_id: number,
  title: string,
  firstname: string,
  lastname: string,
  number: string,
  class_level: string,
  absent: number,
  late: number,
  leave: number,
  sick: number
};

type AttendaceSumProps = {
  items?: StuProps[];
  studentDetail?: (id:number) => void
};

const AttendaceStudents = ({ items = [], studentDetail }: AttendaceSumProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead className="bg-accent-content text-white sticky top-0 z-30">
          <tr>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2 w-[7%]">ลำดับ</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">ชื่อ-สกุล</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">เลขที่</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">ชั้น</th>
            <th colSpan={4} className="border border-gray-300 px-4 py-2">จำนวนวันมาเรียน</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2"></th>
          </tr>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ขาด</th>
            <th className="border border-gray-300 px-4 py-2">ลา</th>
            <th className="border border-gray-300 px-4 py-2">ป่วย</th>
            <th className="border border-gray-300 px-4 py-2">มาสาย</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? items.map((item, idx) => (
            <tr key={idx} className={` ${idx % 2 === 0 ? "bg-gray-200 dark:bg-white/20" : "bg-base-100"}`}>
              <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 px-4 py-2 ">{item.title}{item.firstname} {item.lastname}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.number}</td>
              <td className="border border-gray-300 px-4 py-">{item.class_level}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.absent}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.leave}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.sick}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.late}</td>
              <td className="border border-gray-300 px-4 py-2 text-center"><button type="button" className="btn btn-info btn-sm rounded-lg" title="ดู" onClick={() => studentDetail?.(item.s_id)}><Eye className="w-4 h-4" /></button></td>
            </tr>
          )) : <tr className="font-bold bg-base-200">
            <td colSpan={9} className="border border-gray-300 px-4 py-2 text-center">
              ไม่พบข้อมูล
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default AttendaceStudents;
