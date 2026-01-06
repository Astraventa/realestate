'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Send, Bot, User, Loader2, ExternalLink, MessageCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import propertiesData from '@/data/properties.json'
import { agentConfig } from '@/config/agent'
import { generateWhatsAppLinkForAgent, generateClientContactLink } from '@/lib/whatsapp'
import { getAgentWhatsAppNumber } from './AgentSetup'

interface LeadData {
  name?: string
  budget?: string
  area?: string
  propertyType?: string
  status?: string
  whatsapp?: string
}

export default function ChatbotAIVercel() {
  const [leadData, setLeadData] = useState<LeadData>({})
  const [showActionButtons, setShowActionButtons] = useState(false)
  const [submittedLeadData, setSubmittedLeadData] = useState<LeadData>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Vercel AI SDK hook - handles streaming, state, etc.
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat-vercel',
    body: {
      leadData,
    },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! 👋 I'm your AI property assistant powered by advanced AI. I can help you find the perfect property. Let's start - what's your name?",
      },
    ],
    onFinish: (message) => {
      // After AI responds, check if we need to extract lead data
      extractLeadDataFromConversation()
    },
  })

  const questions = [
    { key: 'name', text: "What's your name?", placeholder: 'Enter your name' },
    {
      key: 'budget',
      text: 'What is your budget? (e.g., 50 Lac, 1 Crore)',
      placeholder: 'Enter your budget',
    },
    {
      key: 'area',
      text: 'Which area are you interested in?',
      placeholder: 'e.g., DHA, Bahria Town, Gulberg',
    },
    {
      key: 'propertyType',
      text: 'Are you looking for Commercial or Residential property?',
      placeholder: 'Commercial or Residential',
    },
    {
      key: 'status',
      text: 'Do you prefer Ready to Move or Under Construction?',
      placeholder: 'Ready to Move or Under Construction',
    },
    {
      key: 'whatsapp',
      text: 'What is your WhatsApp number? (We will send you property details)',
      placeholder: '+92xxxxxxxxxx',
    },
  ]

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto') as HTMLElement
      if (messagesContainer) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        })
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [messages])

  const normalizeInput = (key: string, value: string): string => {
    const lower = value.toLowerCase().trim()
    
    if (key === 'propertyType') {
      if (lower.includes('commer') || lower.includes('comerc')) return 'Commercial'
      if (lower.includes('resid') || lower.includes('home') || lower.includes('house')) return 'Residential'
      return value
    }
    
    if (key === 'status') {
      if (lower === 'yes' || lower.includes('ready') || lower.includes('move') || lower.includes('available')) {
        return 'Ready to Move'
      }
      if (lower === 'no' || lower.includes('under') || lower.includes('construct') || lower.includes('building')) {
        return 'Under Construction'
      }
      return value
    }
    
    return value
  }

  // Extract lead data from conversation
  const extractLeadDataFromConversation = () => {
    const userMessages = messages.filter(m => m.role === 'user')
    const newLeadData: LeadData = { ...leadData }

    // Simple extraction logic (AI will handle better in production)
    userMessages.forEach((msg, idx) => {
      const text = msg.content.trim()
      
      if (idx === 0 && !newLeadData.name) {
        newLeadData.name = text
      } else if (idx === 1 && !newLeadData.budget && (text.includes('lac') || text.includes('crore'))) {
        newLeadData.budget = text
      } else if (idx === 2 && !newLeadData.area) {
        newLeadData.area = text
      } else if (idx === 3 && !newLeadData.propertyType) {
        newLeadData.propertyType = normalizeInput('propertyType', text)
      } else if (idx === 4 && !newLeadData.status) {
        newLeadData.status = normalizeInput('status', text)
      } else if (idx === 5 && !newLeadData.whatsapp && text.includes('92')) {
        newLeadData.whatsapp = text
      }
    })

    setLeadData(newLeadData)

    // Check if all data collected
    const requiredFields = ['name', 'budget', 'area', 'propertyType', 'status', 'whatsapp']
    const allCollected = requiredFields.every(field => newLeadData[field as keyof LeadData])

    if (allCollected && !showActionButtons) {
      handleLeadSubmission(newLeadData)
    }
  }

  const handleLeadSubmission = async (finalLeadData: LeadData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalLeadData),
      })

      if (response.ok) {
        setSubmittedLeadData(finalLeadData)
        setShowActionButtons(true)
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Vercel AI (FREE Tier)</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Try Our AI Assistant
          </h2>
          <p className="text-xl text-gray-600">
            Real AI-powered conversations • Streaming responses • Smart property matching
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Property Assistant</h3>
                <p className="text-blue-100 text-sm">
                  Online • Powered by GPT-4 & Claude
                </p>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            
            {showActionButtons && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 border-t border-blue-100"
              >
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                  ✅ Lead captured! Agent actions:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={agentConfig.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Google Sheet
                  </a>
                  {(() => {
                    const agentWhatsApp = getAgentWhatsAppNumber()
                    return agentWhatsApp ? (
                      <a
                        href={generateWhatsAppLinkForAgent(agentWhatsApp, submittedLeadData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Notification
                      </a>
                    ) : null
                  })()}
                  {submittedLeadData.whatsapp && (
                    <a
                      href={generateClientContactLink(submittedLeadData.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Client
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  questions[currentQuestion]?.placeholder || 'Type your message...'
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ⚡ Powered by Vercel AI • Streaming responses
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
