'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const BackButton = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 px-4 py-2 bg-base-300 hover:bg-gray-400 rounded-lg shadow transition-colors duration-200 cursor-pointer"
    >
      <ArrowLeft 
        size={20} 
        className="text-error transition-transform duration-200 group-hover:-translate-x-1" 
      />
      <span>ย้อนกลับ</span>
    </button>
  )
}

export default BackButton
