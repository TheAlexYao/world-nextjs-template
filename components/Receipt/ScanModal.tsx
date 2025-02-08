'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ScanModal({ 
  isOpen,
  onClose
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const [scanning, setScanning] = useState(false)
  
  // Start scanning animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanning(true)
      // Simulate scan completion after 2s
      const timer = setTimeout(() => {
        setScanning(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-white font-medium">Scan Receipt</h2>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scan Area */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
            {/* Scanning frame */}
            <div className="w-full max-w-sm aspect-[3/4] rounded-lg border-2 border-[#00A7B7] relative overflow-hidden">
              {/* Scanning line */}
              <motion.div
                initial={{ y: '-100%' }}
                animate={scanning ? {
                  y: '100%',
                  transition: {
                    duration: 2,
                    ease: 'linear',
                    repeat: Infinity
                  }
                } : {}}
                className="absolute inset-x-0 h-1 bg-[#00A7B7]/50"
                style={{
                  boxShadow: '0 0 12px #00A7B7'
                }}
              />
            </div>

            {/* Status text */}
            <p className="text-white/90 mt-6 text-center">
              {scanning ? 'Scanning receipt...' : 'Position receipt in frame'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 