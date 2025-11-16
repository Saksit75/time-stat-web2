'use client'

type SumProps = {
  year: number;
  month: number;
  count: number;
};

type AttendaceSumProps = {
  items?: SumProps[]; // ให้ optional ก็ได้
  totalDays?: number;
};

const AttendaceSum = ({ items = [], totalDays = 0 }: AttendaceSumProps) => {
  const textMonth: Record<number, string> = {
    1: "มกราคม",
    2: "กุมภาพันธ์",
    3: "มีนาคม",
    4: "เมษายน",
    5: "พฤษภาคม",
    6: "มิถุนายน",
    7: "กรกฎาคม",
    8: "สิงหาคม",
    9: "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม",
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead className="bg-accent-content text-white sticky top-0 z-30">
          <tr>
            <th className="border border-gray-300 px-4 py-2 w-[10%]">ลำดับ</th>
            <th className="border border-gray-300 px-4 py-2">ปี</th>
            <th className="border border-gray-300 px-4 py-2">เดือน</th>
            <th className="border border-gray-300 px-4 py-2">วันมาเรียน</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className={` ${idx % 2 === 0 ? "bg-gray-200 dark:bg-white/20" : "bg-base-100"}`}>
              <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.year + 543}</td>
              <td className="border border-gray-300 px-4 py-2">{textMonth[item.month]}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{item.count}</td>
            </tr>
          ))}
          {totalDays > 0 ?
            <tr className="font-bold bg-base-200">
              <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
                รวมวันมาเรียน
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {totalDays} วัน
              </td>
            </tr> :
            <tr className="font-bold bg-base-200">
              <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center">
                ไม่พบข้อมูล
              </td>
            </tr>

          }
        </tbody>
      </table>
    </div>
  );
};

export default AttendaceSum;
