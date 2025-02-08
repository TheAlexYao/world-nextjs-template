'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ReceiptCard from './ReceiptCard'
import { type ReceiptData } from '@/types/receipt'

// Mock data (simplified from duck receipt)
export const MOCK_RECEIPT: ReceiptData = {
  restaurant: "YUMMY ROAST ENTERPRISE",
  items: [
    { name: "Duck(1/4Lower)", price: 21.00 },
    { name: "Canto Style Hor Fun", price: 11.90 },
    { name: "Wantan Noodle(D)", price: 8.90 },
    { name: "Soup Of The Day", price: 11.00 },
    { name: "Plain Water", price: 1.60 }
  ],
  subtotal: 54.40,
  total: 60.55,
  currency: "RM"
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onScanComplete: () => void
  connectedUsers: number
  participants: Array<{
    userId: string
    username: string
    verification: 'orb' | 'phone'
    hasPaid: boolean
  }>
}

export default function ScanModal({ 
  isOpen,
  onClose,
  onScanComplete,
  connectedUsers,
  participants
}: Props) {
  const [scanning, setScanning] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScanning(false)
      setShowReceipt(false)
    }
  }, [isOpen])

  // Start scanning animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanning(true)
      
      // After 2s, show receipt and post message
      const timer = setTimeout(async () => {
        setScanning(false)
        setShowReceipt(true)
        
        // Post message first
        await onScanComplete()
        
        // Don't auto-close modal, let user see receipt details
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, onScanComplete])

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
              {showReceipt ? 'Split Details' : scanning ? 'Scanning Receipt' : 'Position Receipt'}
            </h2>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
            {showReceipt ? (
              <ReceiptCard 
                receipt={MOCK_RECEIPT}
                onClose={onClose}
                connectedUsers={connectedUsers}
                splitAmount={MOCK_RECEIPT.total / connectedUsers}
                participants={participants}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 