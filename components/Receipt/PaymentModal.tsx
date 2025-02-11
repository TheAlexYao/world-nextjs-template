import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PayBlock } from '@/components/Pay'
import { useState } from 'react'
import TravelFundPrompt from '@/components/TravelFund'

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
  const [showTravelPrompt, setShowTravelPrompt] = useState(false)

  const handleSuccess = () => {
    onSuccess()
    setTimeout(() => setShowTravelPrompt(true), 5000)
  }

  const handleContribute = () => {
    // TODO: Add actual contribution logic
    console.log('Contributing to travel fund')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0" style={{ zIndex: 99999 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col isolate"
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
                    Your share: MYR {amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-[#00A7B7] mt-1">
                    ≈ USD {(amount * 0.21).toFixed(2)}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700" />

                <div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Demo Payment Amount
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-medium text-gray-900 dark:text-white">
                      0.1 WLD
                    </p>
                    <p className="text-sm text-[#00A7B7]">
                      ≈ USD 0.10
                    </p>
                  </div>
                </div>

                <PayBlock onSuccess={handleSuccess} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
      {showTravelPrompt && (
        <TravelFundPrompt 
          onClose={() => setShowTravelPrompt(false)}
          onContribute={handleContribute}
        />
      )}
    </AnimatePresence>
  )
} 