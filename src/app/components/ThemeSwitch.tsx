'use client'
import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/appState";
import { useEffect } from "react";
const ThemeSwitch = () => {
  const { isDark, toggleTheme, setTheme } = useAppStore();
  useEffect(() => {
    // โหลด theme จาก localStorage หรือ document
    const themeStore = localStorage.getItem('isDark') === 'true';
    setTheme(themeStore)
  }, [setTheme]);
  return (
    <button
      onClick={toggleTheme}
      className={`cursor-pointer relative inline-flex h-7 w-12 items-center justify-center rounded-full p-1 transition-all duration-300 ease-in-out ${isDark
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25'
          : 'bg-gradient-to-r from-orange-400 to-yellow-400 shadow-lg shadow-orange-400/25'
        } hover:scale-105 focus:outline-none focus:ring-4 ${isDark ? 'focus:ring-purple-500/30' : 'focus:ring-orange-400/30'
        }`}
    >
      <div
        className={`absolute h-5 w-5 rounded-full shadow-md transition-all duration-300 ease-in-out flex items-center justify-center ${isDark ? 'translate-x-2.5' : '-translate-x-2.5'
          }`}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  );
};

export default ThemeSwitch;
