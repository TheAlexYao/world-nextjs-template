'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type Props = {
  isOpen: boolean
  onClose: () => void
  onScanComplete: () => void
}

export default function ScanModal({ 
  isOpen,
  onClose,
  onScanComplete
}: Props) {
  const [scanning, setScanning] = useState(false)
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScanning(false)
    }
  }, [isOpen])

  // Start scanning animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanning(true)
      
      // After 2s, complete scan
      const timer = setTimeout(() => {
        setScanning(false)
        onScanComplete()
        onClose()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, onScanComplete, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-white font-medium">
              {scanning ? 'Scanning Receipt' : 'Position Receipt'}
            </h2>
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
              {/* Duck receipt image */}
              <Image
                src="/images/duckreceipt.JPG"
                alt="Receipt"
                fill
                className="object-cover"
              />
              
              {scanning && (
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '200%' }}
                  transition={{
                    duration: 2,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                  className="absolute inset-x-0 h-0.5 bg-[#00A7B7]"
                  style={{
                    boxShadow: '0 0 8px #00A7B7, 0 0 12px #00A7B7'
                  }}
                />
              )}
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