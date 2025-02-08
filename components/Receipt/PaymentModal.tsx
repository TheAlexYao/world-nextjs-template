import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { PayBlock } from '@/components/Pay'

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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-white font-medium">Confirm Payment</h2>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[var(--color-text)]">
                  Pay for Split
                </h3>
                <p className="text-[var(--color-text-secondary)] mt-1">
                  Your share: {currency} {amount.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-[var(--color-border)] my-4" />

              <div>
                <p className="text-[var(--color-text-secondary)]">
                  Demo Payment Amount
                </p>
                <p className="text-xl font-medium text-[var(--color-text)]">
                  0.1 WLD
                </p>
              </div>

              <PayBlock />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 