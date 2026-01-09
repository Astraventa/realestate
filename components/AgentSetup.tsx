'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, CheckCircle, Send, Bell, Zap } from 'lucide-react'

const STORAGE_KEY = 'agent_whatsapp_number'
const TELEGRAM_STORAGE_KEY = 'agent_telegram_chat_id'
const AGENT_NAME_KEY = 'agent_name'
const AGENT_EMAIL_KEY = 'agent_email'

export default function AgentSetup() {
  const [showModal, setShowModal] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [agentName, setAgentName] = useState('')
  const [agentEmail, setAgentEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [showTelegramGuide, setShowTelegramGuide] = useState(false)

  useEffect(() => {
    // Wait for page to fully load before checking configuration
    const timer = setTimeout(() => {
      // Check if agent has already configured
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setIsConfigured(true)
      } else {
        // Show modal after ensuring page is loaded
        const modalTimer = setTimeout(() => {
          setShowModal(true)
        }, 2000) // Increased delay to ensure smooth page load
        
        // Cleanup modal timer
        return () => clearTimeout(modalTimer)
      }
    }, 500) // Initial delay to let page load
    
    // Cleanup main timer
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatsapp.trim() || !agentName.trim()) return

    setIsSubmitting(true)
    
    // Save to localStorage
    const cleanNumber = whatsapp.replace(/[^\d+]/g, '')
    localStorage.setItem(STORAGE_KEY, cleanNumber)
    localStorage.setItem(AGENT_NAME_KEY, agentName.trim())
    localStorage.setItem(AGENT_EMAIL_KEY, agentEmail.trim())
    
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
    const savedEmail = localStorage.getItem(AGENT_EMAIL_KEY)
    
    setWhatsapp(savedWhatsapp || '')
    setTelegramChatId(savedTelegram || '')
    setAgentName(savedName || '')
    setAgentEmail(savedEmail || '')
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
                      htmlFor="agent-email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Email (Optional)
                    </label>
                    <input
                      type="email"
                      id="agent-email"
                      value={agentEmail}
                      onChange={(e) => setAgentEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      placeholder="+923267853405"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include country code (e.g., +92 for Pakistan)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="agent-telegram"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Telegram Chat ID (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTelegramGuide(!showTelegramGuide)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                      >
                        <Bell className="w-3 h-3" />
                        {showTelegramGuide ? 'Hide Guide' : 'How to get?'}
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Send className="w-5 h-5 text-blue-400" />
                      </div>
                      <input
                        type="text"
                        id="agent-telegram"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="123456789"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Benefits Banner */}
                    {!telegramChatId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-blue-900">
                              Get Instant Telegram Notifications!
                            </p>
                            <p className="text-xs text-blue-700 mt-0.5">
                              Receive lead alerts in 3 seconds • 100% FREE • Never miss a buyer!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step-by-Step Guide */}
                    <AnimatePresence>
                      {showTelegramGuide && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden"
                        >
                          <p className="text-sm font-semibold text-blue-900 mb-3">
                            📢 How to Get Your Telegram Chat ID:
                          </p>
                          <ol className="space-y-3">
                            <li className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                1
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-900">Open Telegram App</p>
                                <p className="text-xs text-blue-700 mt-0.5">On your phone or computer</p>
                              </div>
                            </li>
                            <li className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                2
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-900">Search for Bot</p>
                                <p className="text-xs text-blue-700 mt-0.5">
                                  Type: <code className="bg-blue-100 px-1.5 py-0.5 rounded">@userinfobot</code>
                                </p>
                              </div>
                            </li>
                            <li className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                3
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-900">Start the Bot</p>
                                <p className="text-xs text-blue-700 mt-0.5">
                                  Send: <code className="bg-blue-100 px-1.5 py-0.5 rounded">/start</code>
                                </p>
                              </div>
                            </li>
                            <li className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                4
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-900">Copy Your ID</p>
                                <p className="text-xs text-blue-700 mt-0.5">
                                  Bot will reply with your ID number (e.g., 123456789)
                                </p>
                              </div>
                            </li>
                            <li className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                ✓
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-900">Paste Above & Save!</p>
                                <p className="text-xs text-green-700 mt-0.5">
                                  You'll get instant notifications for every new lead
                                </p>
                              </div>
                            </li>
                          </ol>
                          <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
                            <p className="text-xs text-blue-800">
                              <strong>💡 Tip:</strong> Takes only 2 minutes! Don't have Telegram? 
                              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                                Download it free
                              </a>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
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

// Export function to get agent email
export function getAgentEmail(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AGENT_EMAIL_KEY)
}

