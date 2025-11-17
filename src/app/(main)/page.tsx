'use client'

import { getMenu, iconMap } from "@/data/appMenu";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appState";

type MenuItem = {
  id: string;
  label: string;
  link: string;
  icon: string;
  iconClass: string;
}

export default function Home() {
  const isDark = useAppStore((state) => state.isDark);
  const { userAuth, loading } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const appMenu = getMenu(userAuth?.userId);
    setMenu(appMenu);
  }, [userAuth]);

  const handleLogout = async () => {
    await Swal.fire({
      icon: 'question',
      title: 'ยืนยันการออกจากระบบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?',
      showCancelButton: true,
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      theme: isDark ? 'dark' : 'light',
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await Axios.post('/logout'); // เรียก API logout
          localStorage.removeItem('access_token');
          Swal.close();
          router.push('/login');
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถออกจากระบบได้',
            theme: isDark ? 'dark' : 'light',
          });
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบเรียบร้อย',
          theme: isDark ? 'dark' : 'light',
          showConfirmButton: false,
          timer: 1500

        }).then(() => {
          localStorage.removeItem('access_token');
          router.push('/login');
          router.refresh();
        })

      }
    })
  }

  if (loading) return <div className="flex flex-col items-center gap-2 justify-center h-screen text-xl">
    <div>Loading...</div>
    {/* <div><Link href="/login" className="link link-hover text-primary">Go to Login</Link></div> */}
  </div>
  if (!userAuth) return <div className="flex flex-col items-center gap-2 justify-center h-screen text-xl">
    <div>Unauthorized</div>
    <div><Link href="/login" className="link link-hover text-primary">Go to Login</Link></div>
  </div>

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {menu.map((menuItem) => {
        const Icon = iconMap[menuItem.icon];
        if (menuItem.link === "/logout") {
          return (
            <div
              key={menuItem.id}
              onClick={handleLogout}
              className="group flex flex-col items-center justify-center gap-4 border border-gray-200 p-6 rounded-2xl shadow cursor-pointer 
                         transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-base-300"
            >
              <Icon className={menuItem.iconClass} />
              <div className="font-semibold text-lg md:text-2xl text-center group-hover:text-primary">
                {menuItem.label}
              </div>
            </div>
          )
        }
        return (
          <Link
            href={menuItem.link}
            key={menuItem.id}
            className="group flex flex-col items-center justify-center gap-4 border border-gray-200 p-6 rounded-2xl shadow cursor-pointer 
                       transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-base-300"
          >
            <Icon className={menuItem.iconClass} />
            <div className="font-semibold text-lg md:text-2xl text-center group-hover:text-primary">
              {menuItem.label}
            </div>
          </Link>
        )
      })}
    </div>
  );
}
