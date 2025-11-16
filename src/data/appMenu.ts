// appMenu.ts
import { BookCheck, BookOpenCheck, User, Users, UserCircle2, LogOut, ClipboardClock } from "lucide-react"

// กำหนด type
export type MenuItem = {
  id: string
  label: string
  link: string
  icon: string
  iconClass: string
}

// ดาต้า base
const baseMenu: MenuItem[] = [
  { id: "1", label: "ข้อมูลการมาเรียน", link: "/attendance", iconClass: "text-red-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "BookCheck" },
  { id: "2", label: "ประวัติข้อมูลการมาเรียน", link: "/attendance-his", iconClass: "text-orange-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "ClipboardClock" },
  { id: "3", label: "รายงานข้อมูลการมาเรียน", link: "/attendance-report", iconClass: "text-blue-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "BookOpenCheck" },
  { id: "4", label: "ข้อมูลนักเรียน", link: "/students", iconClass: "text-green-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "User" },
  { id: "5", label: "ข้อมูลบุคลากร", link: "/teachers", iconClass: "text-purple-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "Users" },
  { id: "6", label: "โปรไฟล์", link: "/teachers/teacherId", iconClass: "text-yellow-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "UserCircle2" },
  { id: "7", label: "ออกจากระบบ", link: "/attendance", iconClass: "text-pink-500 w-16 h-16 sm:w-20 sm:h-20 md:w-36 md:h-36", icon: "LogOut" }
]

// ฟังก์ชันสำหรับประมวลผล link ของ menu
export function getMenu(userId?: number): MenuItem[] {
  return baseMenu.map(menu => {
    let link = menu.link
    if (userId && link.includes("teacherId")) {
      link = link.replace("teacherId", String(userId))
    }
    return { ...menu, link }
  })
}

// สำหรับ icon mapping
export const iconMap: { [key: string]: any } = {
  BookCheck, BookOpenCheck, User, Users, UserCircle2, LogOut, ClipboardClock
}
