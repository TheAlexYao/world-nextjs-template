import { motion } from 'framer-motion'
import Image from 'next/image'

const TravelFundPrompt = () => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      className="fixed bottom-0 w-full bg-white dark:bg-gray-800 p-6 rounded-t-2xl shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12">
          <Image 
            src="/images/vai.png" 
            alt="V" 
            fill
            className="rounded-full border-2 border-[#00A7B7] object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hey, V here! 👋</h3>
          <p className="mt-1 text-[#00A7B7] font-medium">Omg that KL duck was incredible...</p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            I know you&apos;re into Asian food, so I found these gems you&apos;ll absolutely love:
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2 ml-16">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>🇯🇵 You HAVE to try Tsuta in Tokyo - first ramen shop ever to get a Michelin star!</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span>🇮🇩 And in Bali, Warung Babi Guling Ibu Oka is a must - even Anthony Bourdain couldn&apos;t stop raving about it</span>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-[#00A7B7] h-full w-[52%] rounded-full"/>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">$1,556/$3,000 saved for your Bali/Tokyo food adventure</p>
      </div>
      <button className="btn-primary w-full mt-4">
        Add to Travel Fund
      </button>
    </motion.div>
  )
}

export default TravelFundPrompt 