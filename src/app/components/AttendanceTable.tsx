'use client'
import { useState, useEffect } from "react";
import { AttendanceRow } from "@/types/attendance";
interface AttendanceTableProps {
  formData: any;
  onDataChange?: (data: AttendanceRow[]) => void;
  onOpenModal: (classId?: number) => void;
}
const AttendanceTable = ({ formData, onOpenModal }: AttendanceTableProps) => {
  const [data, setData] = useState<AttendanceRow[]>([]);
  useEffect(() => {
    if (formData && formData.formData) {
      // deep clone เพื่อให้ React มองว่า state เปลี่ยน
      const convertedData: AttendanceRow[] = Object.values(formData.formData).map((item: any) => ({
        id: item.class_level,
        classLevel: item.class_level.toString(),
        classLevelTh: item.class_level_th,
        totalMale: item.amount_male,
        totalFemale: item.amount_female,
        totalCount: item.amount_count,
        comeMale: item.come_male ?? item.amount_male,      // fallback
        comeFemale: item.come_female ?? item.amount_female,
        comeCount: item.come_count ?? item.amount_count,
        notComeMale: item.not_come_male ?? 0,
        notComeFemale: item.not_come_female ?? 0,
        notComeCount: item.not_come_count ?? 0,
        absent: item.absent ?? 0,      // <-- เอาค่าจริงจาก formData
        leave: item.leave ?? 0,
        sick: item.sick ?? 0,
        late: item.late ?? 0,
        note: ''   // หรือเอาจาก item.remark ถ้ามี
      }));

      setData([...convertedData]); // spread เพื่อให้ array ใหม่ → React มองว่า state เปลี่ยน
    }
  }, [formData]);
  const shortClass: Record<string, string> = {
    1: "อ.1",
    2: "อ.2",
    3: "อ.3",
    4: "ป.1",
    5: "ป.2",
    6: "ป.3",
    7: "ป.4",
    8: "ป.5",
    9: "ป.6",
    10: "ม.1",
    11: "ม.2",
    12: "ม.3"
  };

  return (
    <div className="overflow-x-auto border border-base-content/5 bg-base-100">
      <table className="table table-lg border-collapse border border-gray-300 w-full">
        <thead className="border text-xl bg-accent-content text-white">
          <tr className="sticky top-0 z-20">
            <th
              rowSpan={2}
              className="border border-gray-300 text-center sticky left-0 z-40 bg-accent-content w-20"
            >
              ระดับชั้น
            </th>
            <th colSpan={3} className="border border-gray-300 text-center">จำนวนทั้งหมด</th>
            <th colSpan={3} className="border border-gray-300 text-center">มา</th>
            <th colSpan={3} className="border border-gray-300 text-center">ไม่มา</th>
            <th rowSpan={2} className="border border-gray-300 text-center">ขาด</th>
            <th rowSpan={2} className="border border-gray-300 text-center">ลา</th>
            <th rowSpan={2} className="border border-gray-300 text-center">ป่วย</th>
            <th rowSpan={2} className="border border-gray-300 text-center">มาสาย</th>
            <th rowSpan={2} className="border border-gray-300 text-center">หมายเหตุ</th>
          </tr>
          <tr className="sticky top-12">
            <th className="border border-gray-300 text-center">ชาย</th>
            <th className="border border-gray-300 text-center">หญิง</th>
            <th className="border border-gray-300 text-center">รวม</th>
            <th className="border border-gray-300 text-center">ชาย</th>
            <th className="border border-gray-300 text-center">หญิง</th>
            <th className="border border-gray-300 text-center">รวม</th>
            <th className="border border-gray-300 text-center">ชาย</th>
            <th className="border border-gray-300 text-center">หญิง</th>
            <th className="border border-gray-300 text-center">รวม</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((item, index) => (
            <tr key={index} className={` ${index % 2 === 0 ? "bg-gray-100 dark:bg-white/10" : "bg-base-100"}`}>
              {/* ชั้นเรียน */}
              <td
                className="bg-base-100 dark:bg-base-200 sticky left-0 z-10 whitespace-nowrap"
              >
                {shortClass[item.id.toString()]}
              </td>

              {/* จำนวนทั้งหมด */}
              <td className="text-center">
                {item.totalMale}
              </td>
              <td className="text-center">
                {item.totalFemale}
              </td>
              <td className="text-center">
                {item.totalCount}
              </td>

              {/* มา */}
              <td className="text-center">
                {item.comeMale}
              </td>
              <td className="text-center">
                {item.comeFemale}
              </td>
              <td className="text-center">
                {item.comeCount}
              </td>

              {/* ไม่มา */}
              <td className="text-center">
                {item.notComeMale}
              </td>
              <td className="text-center">
                {item.notComeFemale}
              </td>
              <td className="text-center">
                {item.notComeCount}
              </td>

              {/* ขาด / ลา / ป่วย / มาสาย */}
              <td className="text-center">
                {item.absent}
              </td>
              <td className="text-center">
                {item.leave}
              </td>
              <td className="text-center">
                {item.sick}
              </td>
              <td className="text-center">
                {item.late}
              </td>

              {/* หมายเหตุ */}
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-sm btn-primary btn-soft rounded-lg px-4 py-2 transition-colors font-semibold"
                  title={`คลิกเพื่อกรอกข้อมูล ${item.classLevelTh}`}
                  onClick={() => onOpenModal(item.id)}
                >
                  จัดการ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
