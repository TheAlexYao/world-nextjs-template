'use client'

import { Camera } from 'lucide-react'

export default function ScanButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-500 hover:text-[#00A7B7] p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Scan Receipt"
    >
      <Camera className="w-5 h-5" />
    </button>
  )
} 