// Type definitions for API data
export interface FormDataItem {
  // class_level: number;
  // class_level_th: string;
  // amount_student_male: number;
  // amount_student_female: number;
  // amount_student_count: number;
  // // เพิ่มฟิลด์อื่นๆ ตามที่ API ส่งมา
  [key: string]: any;
}

export interface FormData {
  [key: string]: FormDataItem;
}

export interface FormApiResponse {
  date: string;
  formData: FormData;
  teacher: any;
}

// Type สำหรับตาราง attendance
export interface AttendanceRow {
  id: number;
  classLevel: string;
  classLevelTh: string;
  totalMale: number;
  totalFemale: number;
  totalCount: number;
  comeMale: number;
  comeFemale: number;
  comeCount: number;
  notComeMale: number;
  notComeFemale: number;
  notComeCount: number;
  absent: number;
  leave: number;
  sick: number;
  late: number;
  note: string;
}

// Type สำหรับการอัปเดตข้อมูล
export interface AttendanceUpdate {
  classLevel: number;
  field: string;
  value: number | string;
}
