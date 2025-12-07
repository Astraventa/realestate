'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Mail, 
  Settings, 
  Smartphone,
  Zap,
  Shield,
  Clock
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '5-Minute Setup',
    description: 'Get started in 5 minutes. Just connect your Google Sheet and WhatsApp number.',
    status: 'included',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: '24/7 AI assistant that qualifies buyers, asks smart questions, and suggests properties instantly.',
    status: 'included',
  },
  {
    icon: Database,
    title: 'Google Sheets Integration',
    description: 'All leads automatically saved to your Google Sheet. View, organize, and track everything.',
    status: 'included',
  },
  {
    icon: Smartphone,
    title: 'WhatsApp Notifications',
    description: 'Get instant WhatsApp notifications when new leads arrive. Contact clients with one click.',
    status: 'included',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track leads, conversion rates, and performance metrics. See what\'s working.',
    status: 'coming-soon',
  },
  {
    icon: Mail,
    title: 'Email Notifications',
    description: 'Receive email alerts when new leads arrive. Never miss an opportunity.',
    status: 'coming-soon',
  },
  {
    icon: Settings,
    title: 'Easy Configuration',
    description: 'Update your WhatsApp number, Google Sheet, and preferences anytime.',
    status: 'included',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is secure. All leads stored safely in your Google Sheet.',
    status: 'included',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Capture leads even while you sleep. Never miss a potential buyer.',
    status: 'included',
  },
]

export default function WhatYouGet() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Get
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete solution for real estate agents. All features included, no hidden costs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isIncluded = feature.status === 'included'
            const isComingSoon = feature.status === 'coming-soon'

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isIncluded
                    ? 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {isIncluded ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Included
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isIncluded
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isIncluded ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm ${
                    isIncluded ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What's Included Right Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">AI Chatbot (24/7 Lead Capture)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Google Sheets Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">WhatsApp Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">5-Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Property Matching Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Secure & Private</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              <span className="font-semibold">Coming Soon:</span> Analytics Dashboard, Email Notifications
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

