'use client'

import { motion } from 'framer-motion'
import { Users, Phone, Clock, TrendingUp } from 'lucide-react'

const benefits = [
  {
    icon: Users,
    stat: '10+',
    label: 'Qualified Leads Per Week',
    description: 'Auto-qualified buyers ready to close',
  },
  {
    icon: Phone,
    stat: '24/7',
    label: 'Lead Capture',
    description: 'Never miss a lead, even while sleeping',
  },
  {
    icon: Clock,
    stat: '80%',
    label: 'Time Saved',
    description: 'No more wasting time on non-serious buyers',
  },
  {
    icon: TrendingUp,
    stat: '3x',
    label: 'More Deals Closed',
    description: 'Focus on qualified leads = more conversions',
  },
]

export default function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Real Estate Agents Say Yes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real results that matter to your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {benefit.stat}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-2">
                {benefit.label}
              </div>
              <div className="text-sm text-gray-600">{benefit.description}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

