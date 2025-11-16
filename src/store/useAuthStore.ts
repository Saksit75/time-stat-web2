// store/useAuthStore.ts
import { create } from 'zustand'
import axios from 'axios'

type Role = 'a' | 'g' | null

interface User {
  id: number
  name: string
}

interface AuthState {
  user: User | null
  role: Role
  setUser: (user: User | null) => void
  setRole: (role: Role) => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  // โหลดข้อมูล user + role จาก API /api/me
  fetchUser: async () => {
    try {
      const res = await axios.get('/api/me')
      const { userId, userName, userRole } = res.data

      if (userId) {
        set({
          user: { id: userId, name: userName },
          role: userRole as Role,
        })
      } else {
        set({ user: null, role: null })
      }
    } catch (err) {
      console.error('❌ Failed to fetch user:', err)
      set({ user: null, role: null })
    }
  },
}))
