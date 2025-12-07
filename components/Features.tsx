'use client'

import { motion } from 'framer-motion'
import { Zap, MessageSquare, Send } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Auto-Qualification of Buyers',
    description:
      'Our AI asks smart questions to identify serious buyers, saving you hours of time on non-qualified leads.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: MessageSquare,
    title: 'Instant Property Suggestions',
    description:
      'Based on budget and preferences, instantly show 3 best matching properties. WOW your clients!',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Send,
    title: 'Sends Lead to WhatsApp in 1 Second',
    description:
      'Qualified leads are automatically forwarded to your WhatsApp. No manual work, no delays.',
    color: 'from-green-400 to-green-600',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            3 Big Features That Close Deals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything real estate agents need to generate more leads and close
            faster
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

