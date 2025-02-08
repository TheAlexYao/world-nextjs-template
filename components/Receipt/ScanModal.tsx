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
  const [showReceipt, setShowReceipt] = useState(false)
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScanning(false)
      setShowReceipt(false)
    }
  }, [isOpen])

  // Start scanning animation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Start scanning immediately
      setScanning(true)
      
      // After 2s, show receipt
      const timer = setTimeout(() => {
        setScanning(false)
        setShowReceipt(true)
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
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-white font-medium">
              {scanning ? 'Scanning Receipt' : showReceipt ? 'Receipt Details' : 'Position Receipt'}
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
              {scanning && (
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  transition={{
                    duration: 1,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                  className="absolute inset-x-0 h-1 bg-[#00A7B7]"
                  style={{
                    boxShadow: '0 0 12px #00A7B7'
                  }}
                />
              )}
              
              {showReceipt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white p-4"
                >
                  <h3 className="text-center font-medium">YUMMY ROAST ENTERPRISE</h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duck(1/4Lower)</span>
                      <span>RM 21.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Canto Style Hor Fun</span>
                      <span>RM 11.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wantan Noodle(D)</span>
                      <span>RM 8.90</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Soup Of The Day</span>
                      <span>RM 11.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plain Water</span>
                      <span>RM 1.60</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>RM 60.55</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Status text */}
            <p className="text-white/90 mt-6 text-center">
              {scanning ? 'Scanning receipt...' : showReceipt ? 'Receipt scanned!' : 'Position receipt in frame'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 