export const formatDateThaiCustom = (date: any) => {
  if (!date) return "";

  // ถ้า date เป็น string หรือ number ให้แปลงเป็น Date object
  const d = date instanceof Date ? date : new Date(date);

  // ถ้าแปลงแล้วยัง invalid (NaN) ให้ return ค่าว่าง
  if (isNaN(d.getTime())) return "";

  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  const dayName = days[d.getDay()];
  const dayNumber = d.getDate();
  const monthName = months[d.getMonth()];
  const yearBE = d.getFullYear() + 543;

  return `วัน${dayName} ที่ ${dayNumber} เดือน${monthName} พ.ศ. ${yearBE}`;
};


export const thaiDate = (date: Date, format: "full" | "short" = "full") => {
    if (!date) return "";

    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const shortMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                         'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    const dayNumber = date.getDate(); // วันที่
    const monthName = format === "short" ? shortMonths[date.getMonth()] : months[date.getMonth()];
    const yearBE = date.getFullYear() + 543; // ปี พ.ศ.

    return `${dayNumber} ${monthName} ${yearBE}`;
};
