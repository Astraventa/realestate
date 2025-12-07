'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Loader2, ExternalLink, MessageCircle } from 'lucide-react'
import { agentConfig } from '@/config/agent'
import { generateWhatsAppLinkForAgent, generateClientContactLink } from '@/lib/whatsapp'
import { getAgentWhatsAppNumber } from './AgentSetup'

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    area: '',
    whatsapp: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setSubmittedData({ ...formData })
        setFormData({ name: '', budget: '', area: '', whatsapp: '' })
        setTimeout(() => {
          setIsSubmitted(false)
          setSubmittedData(null)
        }, 10000) // Show buttons for 10 seconds
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Get Started Today
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Fill out this form and we'll send you qualified leads this week
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                We've received your information. Our team will contact you
                shortly.
              </p>
              
              {/* Action Buttons (for agent testing) */}
              {submittedData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-semibold text-gray-700 text-center">
                    🔗 Agent Actions (For Testing):
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={agentConfig.sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      View Google Sheet
                    </a>
                    {(() => {
                      const agentWhatsApp = getAgentWhatsAppNumber()
                      return agentWhatsApp ? (
                        <a
                          href={generateWhatsAppLinkForAgent(agentWhatsApp, submittedData)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Get WhatsApp Notification
                        </a>
                      ) : null
                    })()}
                    {submittedData.whatsapp && (
                      <a
                        href={generateClientContactLink(submittedData.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Contact Client via WhatsApp
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Budget
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50 Lac, 1 Crore"
                />
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Preferred Area
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DHA, Bahria Town, Gulberg"
                />
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+92xxxxxxxxxx"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Lead to WhatsApp
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

