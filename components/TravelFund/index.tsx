import { motion } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useState } from 'react'
import confetti from 'canvas-confetti'

type Props = {
  onClose: () => void
  onContribute?: () => void
}

const TravelFundPrompt = ({ onClose, onContribute }: Props) => {
  const [progress, setProgress] = useState(52)
  const [isContributing, setIsContributing] = useState(false)

  const handleContribute = async () => {
    setIsContributing(true)
    
    // Simple confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Animate progress bar
    setProgress(prev => Math.min(prev + 5, 100))
    
    // Call parent handler
    onContribute?.()
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsContributing(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[99999]"
        onClick={onClose}
      />
      
      {/* Content */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="fixed inset-0 z-[99999] flex items-center justify-center px-4 pt-10 pb-6"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <Image 
                src="/images/vai.png" 
                alt="V" 
                fill
                className="rounded-full border-2 border-[#00A7B7] object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hey, V here! 👋</h3>
              <p className="mt-1 text-[#00A7B7] font-medium">Omg that duck looks incredible...</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                I know you&apos;re on your SEAsia & Asia tour with your friends, so I found these gems you&apos;ll absolutely love:
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 ml-16">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-[#00A7B7]/5 p-3 rounded-lg">
              <span>🇯🇵 You HAVE to try Tsuta in Tokyo - first ramen shop ever to get a Michelin star! Best time to visit is during cherry blossom season (March-April) 🌸</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-[#00A7B7]/5 p-3 rounded-lg">
              <span>🇮🇩 And in Bali, Warung Babi Guling Ibu Oka is a must - even Anthony Bourdain couldn&apos;t stop raving about it. Go early (around 11am) before they run out!</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <motion.div 
                className="bg-[#00A7B7] h-full rounded-full"
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ${Math.floor(1556 + (progress - 52) * 30)}/$3,000 saved
              </p>
              <p className="text-sm text-[#00A7B7]">
                {Math.floor((1556 + (progress - 52) * 30) / 3000 * 100)}% to goal
              </p>
            </div>
          </div>

          <button 
            onClick={handleContribute}
            disabled={isContributing}
            className="btn-primary w-full mt-6 py-3 disabled:opacity-50"
          >
            {isContributing ? 'Contributing...' : 'Add to Travel Fund'}
          </button>
        </motion.div>
      </motion.div>
    </>
  )
}

export default TravelFundPrompt 