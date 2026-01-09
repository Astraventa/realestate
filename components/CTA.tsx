'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight, MessageCircle } from 'lucide-react'

export default function CTA() {
  // Your WhatsApp number
  const whatsappNumber = '+923267853405'
  
  // Pre-filled message for demo booking
  const demoMessage = `Hello! I'm interested in booking a free demo for the AI Property Sales Assistant.

I'd like to see:
- How the AI qualifies buyers automatically
- Instant property suggestions in action
- WhatsApp lead forwarding in real-time

Please let me know your available time slots.`

  // Generate WhatsApp link
  const cleanPhone = whatsappNumber.replace(/[+\s]/g, '')
  const encodedMessage = encodeURIComponent(demoMessage)
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-12 shadow-2xl"
        >
          <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book a Free Demo
          </h2>
          <p className="text-2xl text-gray-600 mb-8">
            Get 10 Qualified Leads This Week
          </p>

          <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                See how the AI qualifies buyers automatically
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                Watch instant property suggestions in action
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-gray-700">
                Experience WhatsApp lead forwarding in real-time
              </p>
            </div>
          </div>

          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            Book Demo on WhatsApp
            <ArrowRight className="w-5 h-5" />
          </motion.a>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Setup in 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  )
}

