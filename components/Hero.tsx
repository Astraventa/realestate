'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, Clock, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Company Logo - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={120}
          height={40}
          className="h-auto w-auto max-h-12 object-contain"
          priority
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
          >
            <Clock className="w-4 h-4" />
            <span>24/7 Available</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your 24/7 AI Property
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Sales Assistant
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Capture leads even while you sleep
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 mb-12">
            <div className="flex items-center gap-2 text-gray-700">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Auto-Qualify Buyers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Instant Property Suggestions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">WhatsApp in 1 Second</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.a
            href="#demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book a Free Demo
          </motion.a>

          {/* Trust Indicators */}
          <p className="mt-8 text-sm text-gray-500">
            Get 10 Qualified Leads This Week
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

