'use client'

import { getMenu, iconMap } from "@/data/appMenu";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from "react";

type MenuItem = {
  id: string;
  label: string;
  link: string;
  icon: string;
  iconClass: string;
}

export default function Home() {
  const { userAuth, loading } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  
  
  useEffect(() => {
    const appMenu = getMenu(userAuth?.userId);
    setMenu(appMenu);
  }, [userAuth]);
  
  
    if (loading) return <div>Loading...</div>;
    if (!userAuth) return <div>Unauthorized</div>;
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {/* {JSON.stringify(userAuth)} */}
      {menu.map((menuItem) => {
        const Icon = iconMap[menuItem.icon];
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
        );
      })}
    </div>
  );
}
