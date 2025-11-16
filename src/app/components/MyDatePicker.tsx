'use client'
import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react"

interface MyDatePickerProps {
  initialDate?: string;
  onDateChange?: (date: Date) => void;
  disabled?: boolean
}

const MyDatePicker = ({ initialDate, onDateChange, disabled = false }: MyDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : new Date()
  );

  const dateInputRef = useRef<HTMLInputElement>(null);

  // อัปเดต date เมื่อ initialDate เปลี่ยน
  useEffect(() => {
    if (initialDate) {
      const newDate = new Date(initialDate);
      setSelectedDate(newDate);
    }
  }, [initialDate]);

  // const formatDateThai = (date: Date) => {
  //   return date.toLocaleDateString('th-TH', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     weekday: 'long'
  //   });
  // };
  const formatDateThaiCustom = (date: Date) => {
    if (!date) return "";

    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const dayName = days[date.getDay()]; // วัน
    const dayNumber = date.getDate(); // วันที่
    const monthName = months[date.getMonth()]; // เดือน
    const yearBE = date.getFullYear() + 543; // ปี พ.ศ.

    return `วัน ${dayName} ที่ ${dayNumber} เดือน ${monthName} พ.ศ. ${yearBE}`;
  };


  const handleOpenCalendar = () => {
    dateInputRef.current?.showPicker?.();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center ">
      <h3 className="sm:text-3xl text-lg">
        {selectedDate ? formatDateThaiCustom(selectedDate) : "กรุณาเลือกวันที่"}
      </h3>
      {!disabled && (
        <button
          type="button"
          className="btn btn-soft !rounded-lg"
          onClick={handleOpenCalendar}
          title="เลือกวันที่"
        >
          <CalendarDays />
        </button>
      )}


      {/* ซ่อน input แต่ยัง interactive */}
      <input
        disabled={disabled}
        type="date"
        ref={dateInputRef}
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : null;
          setSelectedDate(newDate);
          if (onDateChange && newDate) {
            onDateChange(newDate);
          }
        }}
        className="absolute opacity-0 w-0 h-0"
      />
    </div>
  );
};

export default MyDatePicker;
