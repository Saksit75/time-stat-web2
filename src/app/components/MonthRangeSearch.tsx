'use client'
import { useState } from "react"

interface DateRangeSelectorProps {
  onSearch?: (data: {
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
  }) => void
  onClear?: () => void
}

const MonthRangeSearch: React.FC<DateRangeSelectorProps> = ({ onSearch, onClear }) => {
  const monthList = [
    { id: 1, name: "มกราคม" },
    { id: 2, name: "กุมภาพันธ์" },
    { id: 3, name: "มีนาคม" },
    { id: 4, name: "เมษายน" },
    { id: 5, name: "พฤษภาคม" },
    { id: 6, name: "มิถุนายน" },
    { id: 7, name: "กรกฎาคม" },
    { id: 8, name: "สิงหาคม" },
    { id: 9, name: "กันยายน" },
    { id: 10, name: "ตุลาคม" },
    { id: 11, name: "พฤศจิกายน" },
    { id: 12, name: "ธันวาคม" },
  ]

  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endMonth, setEndMonth] = useState("")
  const [endYear, setEndYear] = useState("")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Number(startYear) > Number(endYear)) {
      setStartYear("");
      setEndYear("");
      return;
    }

    if (onSearch) {
      onSearch({ startMonth, startYear, endMonth, endYear })
    }
  }

  const handleClear = () => {
    setStartMonth("")
    setStartYear("")
    setEndMonth("")
    setEndYear("")
    if (onClear) {
      onClear()
    }
  }

  return (
    <form onSubmit={handleSearch} className="bg-base-200 rounded-lg shadow-md p-6 md:p-8 w-full">
      <h2 className="text-lg md:text-xl font-semibold  mb-6">เลือกช่วงเวลา</h2>

      {/* Form Layout */}
      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:items-end">
        {/* Start Month */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="start-month" className="text-sm font-medium ">
            เดือนเริ่มต้น <span className="text-error">*</span>
          </label>
          <select
            id="start-month"
            required
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="select w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          >
            <option value="" disabled>เลือกเดือน</option>
            {monthList.map((month) => (
              <option key={month.id} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Year */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="start-year" className="text-sm font-medium ">
            ปีเริ่มต้น  <span className="text-error">*</span>
          </label>
          <input
            required
            id="start-year"
            type="number"
            value={startYear}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,4}$/.test(val)) {
                setStartYear(val);
              }
            }}
            className="input w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center md:pb-2">
          <div className="flex items-center w-full md:w-auto">
            <div className="h-px bg-gray-300 flex-1 md:hidden"></div>
            <span className="px-4 font-medium">ถึง</span>
            <div className="h-px bg-gray-300 flex-1 md:hidden"></div>
          </div>
        </div>

        {/* End Month */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="end-month" className="text-sm font-medium ">
            เดือนสิ้นสุด  <span className="text-error">*</span>
          </label>
          <select
            id="end-month"
            required
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="select w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          >
            <option value="" disabled>เลือกเดือน</option>
            {monthList.map((month) => (
              <option key={month.id} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="end-year" className="text-sm font-medium ">
            ปีสิ้นสุด  <span className="text-error">*</span>
          </label>
          <input
            required
            id="end-year"
            type="number"
            value={endYear}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,4}$/.test(val)) {
                setEndYear(val);
              }
            }}
            className="input w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-end">
        <button
          className="btn btn-primary rounded-md font-medium"
        >
          ค้นหา
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-outline rounded-md  font-medium"
        >
          ล้างข้อมูล
        </button>
      </div>
    </form>
  )
}

export default MonthRangeSearch