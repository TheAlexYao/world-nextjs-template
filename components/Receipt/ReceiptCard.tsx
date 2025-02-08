import { useState } from 'react'
import { type ReceiptData } from '@/types/receipt'
import PaymentModal from './PaymentModal'

type Props = {
  receipt: ReceiptData
  onClose?: () => void
  connectedUsers?: number
  splitAmount?: number
  participants?: Array<{
    userId: string
    username: string
    verification: 'orb' | 'phone'
    hasPaid: boolean
  }>
  isMessage?: boolean // Whether shown in chat or modal
  onJoin?: () => void
  onPay?: () => void
  currentUserId?: string
  initiatorId?: string
}

export default function ReceiptCard({ 
  receipt, 
  onClose,
  connectedUsers = 1,
  splitAmount,
  participants = [],
  isMessage,
  onJoin,
  onPay,
  currentUserId,
  initiatorId
}: Props) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // Get current user's status
  const currentParticipant = currentUserId ? participants.find(p => p.userId === currentUserId) : null
  const isInitiator = currentUserId === initiatorId
  const hasJoined = currentParticipant?.hasPaid !== undefined
  const hasPaid = currentParticipant?.hasPaid

  return (
    <>
      <div className={`bg-white rounded-2xl p-4 shadow-lg w-full ${isMessage ? 'max-w-full' : 'max-w-sm mx-auto'}`}>
        {/* Restaurant Name */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg text-[var(--color-text)]">{receipt.restaurant}</h3>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {receipt.items.map((item, i) => (
            <div key={i} className="flex justify-between text-[15px]">
              <span className="text-[var(--color-text)]">{item.name}</span>
              <span className="text-[var(--color-text-secondary)]">{receipt.currency} {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)] my-4" />

        {/* Totals */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[15px]">
            <span className="text-[var(--color-text-secondary)]">Subtotal</span>
            <span className="text-[var(--color-text)]">{receipt.currency} {receipt.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-[var(--color-text)]">Total</span>
            <span className="text-[var(--color-text)]">{receipt.currency} {receipt.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Split Details */}
        {connectedUsers > 1 && (
          <>
            <div className="border-t border-[var(--color-border)] my-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)]">Split {connectedUsers} ways</span>
                <span className="font-medium text-[var(--color-text)]">
                  {receipt.currency} {splitAmount?.toFixed(2)} each
                </span>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-[15px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--color-text)]">{p.username}</span>
                      {p.verification === 'orb' ? (
                        <span title="Orb Verified" className="text-[var(--color-primary)]">⦿</span>
                      ) : (
                        <span title="Phone Verified" className="text-[var(--color-primary)]">☎</span>
                      )}
                    </div>
                    <span className={p.hasPaid ? 'text-green-500' : 'text-[var(--color-text-secondary)]'}>
                      {p.hasPaid ? 'Paid ✓' : 'Pending...'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Join/Pay Buttons (only in message view for non-initiator) */}
              {isMessage && !isInitiator && (
                <button
                  onClick={() => {
                    if (!hasJoined) {
                      onJoin?.()
                    } else if (!hasPaid) {
                      setShowPaymentModal(true)
                    }
                  }}
                  disabled={hasPaid}
                  className="btn-primary w-full"
                >
                  {!hasJoined ? 'Join Split' : !hasPaid ? 'Pay 0.1 WLD' : 'Paid ✓'}
                </button>
              )}

              {/* Fixed Payment Amount */}
              <div className="text-center text-[var(--color-text-secondary)] text-sm">
                Demo: Fixed payment of 0.1 WLD
              </div>
            </div>
          </>
        )}

        {/* Close Button (only in modal view) */}
        {!isMessage && onClose && (
          <button 
            onClick={onClose}
            className="btn-secondary w-full text-center mt-4 py-2"
          >
            Close
          </button>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          onPay?.()
          setShowPaymentModal(false)
        }}
        amount={splitAmount || 0}
        currency={receipt.currency}
      />
    </>
  )
} 