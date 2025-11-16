'use client'
import AttendaceSum from "@/app/components/AttendaceSum"
import AttendanceInfo from "@/app/components/AttendanceInfo"
import AttendanceStudents from "@/app/components/AttendanceStudents"
import BackButton from "@/app/components/BackButton"
import MonthRangeSearch from "@/app/components/MonthRangeSearch"
import { useEffect, useState } from "react"
import Axios from "@/lib/axios"
import Swal from "sweetalert2"
import Modal from "@/app/components/Modal"
import { useAppStore } from "@/store/appState"
import { formatDateThaiCustom } from "@/gobalFunction/function"
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
  sick: number,
  attendanceDates: AttendaceDates[]
};
type StuItems = {
  data: StuProps[]
}
type AttendaceDates = {
  date: string,
  remark: string
}
type SumProps = {
  year: number;
  month: number;
  count: number;
};
type SumItems = {
  data: SumProps[];
  totalDays: number;
};

const thaiLeave: Record<string, string> = {
  "absent": "ขาด",
  "leave": "ลา",
  "sick": "ป่วย",
  "late": "มาสาย",
}

const AttendanceReport = () => {
  const isDark = useAppStore((state) => state.isDark)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleSearch = (data: {
    startMonth: string,
    startYear: string,
    endMonth: string,
    endYear: string
  }
  ) => {
    const { startMonth, startYear, endMonth, endYear } = data

    if ((Number(startYear) - 543) < 1 || (Number(endYear) - 543) < 1) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกปี พ.ศ. ให้ถูกต้อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
    getTimeStatReportSum(startMonth, startYear, endMonth, endYear);
    getTimeStatReportStu(startMonth, startYear, endMonth, endYear);
    setSearchParams(data)
  }

  const [reportSum, setReportSum] = useState<SumItems>({ data: [], totalDays: 0 })
  const [reportStu, setReportStu] = useState<StuItems>({ data: [] })
  const [indiStu, setIndiStu] = useState<StuProps | null>(null);
  const [searchParams, setSearchParams] = useState<Record<string, string> | null>(null);
  const handleClear = () => {
    setSearchParams(null)
    setReportSum({ data: [], totalDays: 0 })
    setReportStu({ data: [] })
  }
  const getTimeStatReportSum = async (startMonth: string, startYear: string, endMonth: string, endYear: string) => {
    try {
      const queryParams: any = {};
      if (startMonth && startYear && endMonth && endYear) {
        queryParams.startMonth = startMonth
        queryParams.startYear = startYear
        queryParams.endMonth = endMonth
        queryParams.endYear = endYear
      }
      const res = await Axios.get('/time-stat/time-stat-report-sum', { params: queryParams });

      const items = res.data.data.result.map((r: any) => ({
        year: Number(r.year),
        month: Number(r.month),
        count: r.count
      }))
      console.log("getTimeStatReportSum : ", items);

      setReportSum({ data: items, totalDays: res.data.data.totalDays })
    } catch (error) {
      console.error(error)
    }
  }
  const getTimeStatReportStu = async (startMonth: string, startYear: string, endMonth: string, endYear: string) => {
    try {
      const queryParams: any = {};
      if (startMonth && startYear && endMonth && endYear) {
        queryParams.startMonth = startMonth
        queryParams.startYear = startYear
        queryParams.endMonth = endMonth
        queryParams.endYear = endYear
      }
      const res = await Axios.get('/time-stat/time-stat-report-student', { params: queryParams });
      console.log(res);

      const items: StuProps[] = res.data.data.map((r: any) => ({
        s_id: Number(r.s_id),
        title: r.stu_title,
        firstname: r.stu_firstname,
        lastname: r.stu_lastname,
        number: r.stu_number,
        class_level: r.stu_class_level,
        absent: Number(r.absent),
        leave: Number(r.leave),
        sick: Number(r.sick),
        late: Number(r.late),
        attendanceDates: r.attendance_dates?.map((d: any) => ({
          date: d.date,
          remark: d.remark,
        })) || [],
      }));


      setReportStu({ data: items })
    } catch (error) {
      console.error(error)
    }
  }
  const studentDetail = (id: number) => {
    const newIndiStu = reportStu.data.find((s: StuProps) => s.s_id === id) || null
    setIndiStu(newIndiStu)
    setIsModalOpen(true)
  }
  // useEffect(() => {
  //   getTimeStatReportSum()
  //   getTimeStatReportStu()

  // }, [])

  const exportTimeStatSumExcel = () => {
    console.log("exportTimeStatSumExcel clicked");

    const { startMonth, startYear, endMonth, endYear } = searchParams || {};
    if (!startMonth || !startYear || !endMonth || !endYear) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return;
    }
    const queryParams: any = {};
    if (startMonth && startYear && endMonth && endYear) {
      queryParams.startMonth = startMonth
      queryParams.startYear = startYear
      queryParams.endMonth = endMonth
      queryParams.endYear = endYear
    }
    Axios.get('/time-stat-report/export-time-stat-sum-excel', { params: queryParams, responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report_sum.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error(error);
      })

  }
  const exportTimeStatSumPDF = () => {
    console.log("exportTimeStatSumPDF clicked");

    const { startMonth, startYear, endMonth, endYear } = searchParams || {};
    if (!startMonth || !startYear || !endMonth || !endYear) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const queryParams: any = { startMonth, startYear, endMonth, endYear };

    Axios.get('/time-stat-report/export-time-stat-sum-pdf', {
      params: queryParams,
      responseType: 'blob' // สำคัญมากสำหรับไฟล์ไบนารี่
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        // เปิดในแท็บใหม่
        window.open(url, '_blank');

        // ถ้าอยากให้ดาวน์โหลดอัตโนมัติด้วย ก็ตามนี้
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'TimeStat_Summary.pdf');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
      })
      .catch((error) => {
        console.error(error);
      });
  };


    const exportTimeStatStuExcel = () => {
    console.log("exportTimeStatStuExcel clicked");

    const { startMonth, startYear, endMonth, endYear } = searchParams || {};
    if (!startMonth || !startYear || !endMonth || !endYear) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return;
    }
    const queryParams: any = {};
    if (startMonth && startYear && endMonth && endYear) {
      queryParams.startMonth = startMonth
      queryParams.startYear = startYear
      queryParams.endMonth = endMonth
      queryParams.endYear = endYear
    }
    Axios.get('/time-stat-report/export-time-stat-stu-excel', { params: queryParams, responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report_students.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error(error);
      })

  }


  const exportTimeStatStuPDF = () => {
    console.log("exportTimeStatSumPDF clicked");

    const { startMonth, startYear, endMonth, endYear } = searchParams || {};

    if (!startMonth || !startYear || !endMonth || !endYear) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const queryParams: any = { startMonth, startYear, endMonth, endYear };

    Axios.get('/time-stat-report/export-time-stat-stu-pdf', {
      params: queryParams,
      responseType: 'blob' // สำคัญมากสำหรับไฟล์ไบนารี่
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        // เปิดในแท็บใหม่
        window.open(url, '_blank');

        // ถ้าอยากให้ดาวน์โหลดอัตโนมัติด้วย ก็ตามนี้
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'TimeStat_Summary.pdf');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-18 min-h-screen">
      <div className="flex items-center gap-4">
        <BackButton />
      </div>
      <div className="flex items-center justify-center w-full">
        <h1 className="text-2xl md:text-3xl font-bold">รายงานข้อมูลการมาเรียน</h1>
      </div>
      <div className="flex flex-col py-4 gap-4 w-full">
        <MonthRangeSearch onSearch={handleSearch} onClear={handleClear} />
        <div className="flex flex-col py-4 gap-4 bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
          {/* name of each tab group should be unique */}
          <div className="tabs tabs-box">
            <input type="radio" name="tabs_report" className="tab" aria-label="สรุปการมาเรียน" defaultChecked />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              {reportSum.data.length > 0 && reportSum.totalDays > 0 && (
                <div className="w-full flex items-center justify-end gap-2 p-2">
                  <button className="btn btn-error btn-soft rounded-lg" onClick={exportTimeStatSumPDF}>PDF</button>
                  <button className="btn btn-success btn-soft rounded-lg" onClick={exportTimeStatSumExcel}>EXCEL</button>
                </div>
              )}
              <AttendaceSum items={reportSum.data} totalDays={reportSum.totalDays} />
            </div>

            <input type="radio" name="tabs_report" className="tab" aria-label="เวลาเรียนของนักเรียน" />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              {reportStu.data.length > 0 && (
                <div className="w-full flex items-center justify-end gap-2 p-2">
                  <button type="button" className="btn btn-error btn-soft rounded-lg" onClick={exportTimeStatStuPDF}>PDF</button>
                  <button type="button" className="btn btn-success btn-soft rounded-lg" onClick={exportTimeStatStuExcel}>EXCEL</button>
                </div>
              )}
              <AttendanceStudents items={reportStu.data} studentDetail={studentDetail} />
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'บันทึกการมาเรียนรายบุคคล'} >
        <div className="flex flex-col w-full py-2 gap-1 text-center font-semibold">
          <div>{indiStu?.title}{indiStu?.firstname} {indiStu?.lastname}</div>
          <div>เลขที่ {indiStu?.number} ชั้น {indiStu?.class_level}</div>
        </div>
        <div className="flex flex-col w-full gap-2 p-2">
          <div className="overflow-auto max-h-[500px]">
            <table className="table-auto border-collapse w-full">
              <thead className="bg-accent-content text-white sticky top-0 z-30">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 w-[10%]">ลำดับ</th>
                  <th className="border border-gray-300 px-4 py-2 w-[65%]">วันที่</th>
                  <th className="border border-gray-300 px-4 py-2">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {
                  indiStu?.attendanceDates.length ? indiStu?.attendanceDates.map((item, idx) => (
                    <tr key={idx} className={` ${idx % 2 === 0 ? "bg-gray-200 dark:bg-white/20" : "bg-base-100"}`}>
                      <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 ">{formatDateThaiCustom(item.date)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{thaiLeave[item.remark]}</td>
                    </tr>
                  )) : <tr>
                    <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">ไม่พบข้อมูล</td>

                  </tr>


                }


              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AttendanceReport