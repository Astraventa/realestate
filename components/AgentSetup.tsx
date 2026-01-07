'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, CheckCircle } from 'lucide-react'

const STORAGE_KEY = 'agent_whatsapp_number'
const TELEGRAM_STORAGE_KEY = 'agent_telegram_chat_id'
const AGENT_NAME_KEY = 'agent_name'

export default function AgentSetup() {
  const [showModal, setShowModal] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [agentName, setAgentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if agent has already configured
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setIsConfigured(true)
    } else {
      // Show modal after 1 second (gives page time to load)
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatsapp.trim() || !agentName.trim()) return

    setIsSubmitting(true)
    
    // Save to localStorage
    const cleanNumber = whatsapp.replace(/[^\d+]/g, '')
    localStorage.setItem(STORAGE_KEY, cleanNumber)
    localStorage.setItem(AGENT_NAME_KEY, agentName.trim())
    
    // Save Telegram if provided
    if (telegramChatId.trim()) {
      const cleanTelegramId = telegramChatId.trim()
      localStorage.setItem(TELEGRAM_STORAGE_KEY, cleanTelegramId)
    }
    
    // Update state
    setIsConfigured(true)
    setIsSubmitting(false)
    setShowModal(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    // Don't save anything - WhatsApp notifications won't work
  }

  const handleChange = () => {
    // Allow agent to change info
    const savedWhatsapp = localStorage.getItem(STORAGE_KEY)
    const savedTelegram = localStorage.getItem(TELEGRAM_STORAGE_KEY)
    const savedName = localStorage.getItem(AGENT_NAME_KEY)
    
    setWhatsapp(savedWhatsapp || '')
    setTelegramChatId(savedTelegram || '')
    setAgentName(savedName || '')
    setIsConfigured(false)
    setShowModal(true)
  }

  // Get agent WhatsApp number
  const getAgentWhatsApp = (): string | null => {
    return localStorage.getItem(STORAGE_KEY)
  }

  // Export function for other components
  if (typeof window !== 'undefined') {
    ;(window as any).getAgentWhatsApp = getAgentWhatsApp
  }

  return (
    <>
      {/* Configure Button (if already configured) */}
      {isConfigured && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleChange}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          Change Agent Settings
        </motion.button>
      )}

      {/* Setup Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Agent Setup
                      </h3>
                      <p className="text-sm text-gray-600">
                        Configure WhatsApp notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="agent-name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name / Business Name *
                    </label>
                    <input
                      type="text"
                      id="agent-name"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Ahmed Properties"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="agent-whatsapp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      id="agent-whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+923001234567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include country code (e.g., +92 for Pakistan)
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="agent-telegram"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Telegram Chat ID (Optional - for instant notifications)
                    </label>
                    <input
                      type="text"
                      id="agent-telegram"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>How to get your Chat ID:</strong>
                      </p>
                      <ol className="mt-1 text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                        <li>Open Telegram and search: <code className="bg-blue-100 px-1 rounded">@userinfobot</code></li>
                        <li>Send: <code className="bg-blue-100 px-1 rounded">/start</code></li>
                        <li>Copy your ID number and paste above</li>
                      </ol>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Skip (No WhatsApp)
                    </button>
                    <button
                      type="submit"
                      disabled={!whatsapp.trim() || isSubmitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        'Saving...'
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong> If you skip, you can still view leads
                    in Google Sheets. WhatsApp notifications require your number.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Export function to get agent WhatsApp
export function getAgentWhatsAppNumber(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

// Export function to get agent Telegram Chat ID
export function getAgentTelegramChatId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TELEGRAM_STORAGE_KEY)
}

// Export function to get agent name
export function getAgentName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AGENT_NAME_KEY)
}

