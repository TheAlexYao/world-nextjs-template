import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PayBlock } from '@/components/Pay'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  currency: string
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative flex flex-col mt-auto pb-safe w-full bg-white dark:bg-gray-800 rounded-t-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white font-medium">Confirm Payment</h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 active:opacity-60"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Payment Details */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Pay for Split
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Your share: {currency} {amount.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700" />

              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Demo Payment Amount
                </p>
                <p className="text-xl font-medium text-gray-900 dark:text-white">
                  0.1 WLD
                </p>
              </div>

              <PayBlock onSuccess={onSuccess} />
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </AnimatePresence>
  )
} 