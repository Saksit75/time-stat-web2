// src/store/themeStore.ts
import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (value: boolean) => void
}

export const useAppStore = create<ThemeState>((set) => ({
  isDark: false, // default
  toggleTheme: () =>
    set((state) => {
      const newTheme = !state.isDark
      if (typeof document !== 'undefined') {
        if (newTheme) {
          document.documentElement.classList.add('dark')
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.setAttribute('data-theme', 'light')
        }
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
        localStorage.setItem('isDark', newTheme ? 'true' : 'false')
      }
      return { isDark: newTheme }
    }),
  setTheme: (value: boolean) => {
    if (typeof document !== 'undefined') {
      if (value) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
      localStorage.setItem('theme', value ? 'dark' : 'light')
      
    }
    set({ isDark: value })
  },
}))
