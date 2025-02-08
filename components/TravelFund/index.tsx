import { motion } from 'framer-motion'
import Image from 'next/image'
import { X, Sparkles } from 'lucide-react'
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
    
    // Multiple confetti bursts
    const duration = 2000
    const end = Date.now() + duration
    
    const frame = () => {
      confetti({
        particleCount: 25,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#00A7B7', '#008999', '#FFD700', '#FFA500']
      })
      
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

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
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center px-4 pt-10 pb-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <motion.div 
              className="relative w-12 h-12 shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image 
                src="/images/vai.png" 
                alt="V" 
                fill
                className="rounded-full border-2 border-[#00A7B7] object-cover"
              />
            </motion.div>
            <div className="min-w-0">
              <motion.h3 
                className="text-lg font-medium text-gray-900 dark:text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Hey, V here! 👋
              </motion.h3>
              <motion.p 
                className="mt-1 text-[#00A7B7] font-medium"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Omg that duck looks incredible...
              </motion.p>
              <motion.p 
                className="mt-2 text-gray-600 dark:text-gray-300"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                I know you&apos;re on your SEAsia & Asia tour with your friends, so I found these gems you&apos;ll absolutely love:
              </motion.p>
            </div>
          </div>

          <motion.div 
            className="mt-4 space-y-2 ml-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-[#00A7B7]/5 p-3 rounded-lg">
              <span>🇯🇵 You HAVE to try Tsuta in Tokyo - first ramen shop ever to get a Michelin star! Best time to visit is during cherry blossom season (March-April) 🌸</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-[#00A7B7]/5 p-3 rounded-lg">
              <span>🇮🇩 And in Bali, Warung Babi Guling Ibu Oka is a must - even Anthony Bourdain couldn&apos;t stop raving about it. Go early (around 11am) before they run out!</span>
            </div>
          </motion.div>

          <motion.div 
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-[#00A7B7] to-[#008999] h-full rounded-full relative overflow-hidden"
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shine_1s_linear_infinite]" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ${Math.floor(1556 + (progress - 52) * 30)}/$3,000 saved
              </p>
              <p className="text-sm text-[#00A7B7]">
                {Math.floor((1556 + (progress - 52) * 30) / 3000 * 100)}% to goal
              </p>
            </div>
          </motion.div>

          <motion.button 
            onClick={handleContribute}
            disabled={isContributing}
            className="relative btn-primary w-full mt-6 py-3 disabled:opacity-50 transition-all duration-200 active:scale-95 group overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isContributing ? (
                <>Contributing <span className="animate-pulse">...</span></>
              ) : (
                <>Add to Travel Fund <Sparkles className="w-4 h-4" /></>
              )}
            </span>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shine_1s_linear_infinite]" />
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default TravelFundPrompt 