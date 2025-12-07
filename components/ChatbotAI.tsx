'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, ExternalLink, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import propertiesData from '@/data/properties.json'
import { agentConfig } from '@/config/agent'
import { generateWhatsAppLinkForAgent, generateClientContactLink } from '@/lib/whatsapp'
import { getAgentWhatsAppNumber } from './AgentSetup'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: Date
}

interface LeadData {
  name?: string
  budget?: string
  area?: string
  propertyType?: string
  status?: string
  whatsapp?: string
}

export default function ChatbotAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your AI property assistant. I can help you find the perfect property. Let's start with a few quick questions!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({})
  const [useAI, setUseAI] = useState(true) // Enable AI by default
  const [showActionButtons, setShowActionButtons] = useState(false)
  const [submittedLeadData, setSubmittedLeadData] = useState<LeadData>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        const scrollTop = messagesContainer.scrollTop
        const scrollHeight = messagesContainer.scrollHeight
        const clientHeight = messagesContainer.clientHeight
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight
        
        if (distanceFromBottom < 200 || scrollTop < 50) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        }
      }
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'bot') {
        setTimeout(() => {
          scrollToBottom()
        }, 200)
      }
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

  const findMatchingProperties = (budget: string, leadData: LeadData) => {
    const budgetValue = parseBudget(budget)
    if (!budgetValue) return []

    const normalizedType = leadData.propertyType 
      ? normalizeInput('propertyType', leadData.propertyType) 
      : null
    const normalizedStatus = leadData.status 
      ? normalizeInput('status', leadData.status) 
      : null
    const areaPreference = leadData.area?.toLowerCase() || ''

    return propertiesData
      .filter((prop) => {
        const priceDiff = Math.abs(prop.priceValue - budgetValue)
        const budgetMatch = priceDiff <= budgetValue * 0.2 && prop.priceValue <= budgetValue * 1.2
        
        if (!budgetMatch) return false
        if (normalizedType && prop.type !== normalizedType) return false
        if (normalizedStatus && prop.status !== normalizedStatus) return false

        if (areaPreference) {
          const propArea = prop.location.toLowerCase()
          if (propArea.includes(areaPreference) || areaPreference.includes(propArea.split(' ')[0])) {
            return true
          }
        }

        return true
      })
      .sort((a, b) => {
        const aAreaMatch = areaPreference && a.location.toLowerCase().includes(areaPreference) ? 0 : 1
        const bAreaMatch = areaPreference && b.location.toLowerCase().includes(areaPreference) ? 0 : 1
        
        if (aAreaMatch !== bAreaMatch) return aAreaMatch - bAreaMatch
        
        const aDiff = Math.abs(a.priceValue - budgetValue)
        const bDiff = Math.abs(b.priceValue - budgetValue)
        return aDiff - bDiff
      })
      .slice(0, 3)
  }

  const parseBudget = (budget: string): number | null => {
    const clean = budget.toLowerCase().replace(/[^\d.]/g, '')
    const num = parseFloat(clean)
    if (isNaN(num)) return null

    if (budget.toLowerCase().includes('crore') || budget.toLowerCase().includes('cr')) {
      return num * 10000000
    }
    if (budget.toLowerCase().includes('lac') || budget.toLowerCase().includes('lakh')) {
      return num * 100000
    }
    return num
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    // Update lead data
    const questionKey = questions[currentQuestion]?.key
    if (questionKey) {
      const normalizedValue = normalizeInput(questionKey, currentInput)
      setLeadData((prev) => ({ ...prev, [questionKey]: normalizedValue }))
    }

    let botResponse = ''

    try {
      if (useAI) {
        // Try AI first
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [...messages, userMessage],
              leadData: leadData,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            botResponse = data.message
          } else {
            throw new Error('AI unavailable')
          }
        } catch (aiError) {
          // Fallback to rule-based
          console.warn('AI unavailable, using rule-based:', aiError)
          setUseAI(false)
          botResponse = getRuleBasedResponse()
        }
      } else {
        botResponse = getRuleBasedResponse()
      }
    } catch (error) {
      botResponse = getRuleBasedResponse()
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  const getRuleBasedResponse = (): string => {
    // Rule-based fallback (same as before)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      return questions[currentQuestion + 1].text
    } else {
      const budget = leadData.budget || input
      const matchingProperties = findMatchingProperties(budget, leadData)

      if (matchingProperties.length > 0) {
        let response = `Great! Based on your preferences, here are ${matchingProperties.length} best options:\n\n`
        matchingProperties.forEach((prop, idx) => {
          const propertyDetails = prop.type === 'Commercial' 
            ? `   📐 ${prop.area}`
            : `   🏠 ${prop.bedrooms} Bed, ${prop.bathrooms} Bath\n   📐 ${prop.area}`
          
          response += `${idx + 1}. ${prop.name}\n   💰 ${prop.price}\n   📍 ${prop.location}\n${propertyDetails}\n   ✅ ${prop.status}\n\n`
        })
        response += 'I\'m sending your details to our agent. You\'ll receive a WhatsApp message shortly! 📱'
        
        setTimeout(() => {
          handleLeadSubmission()
        }, 2000)
        
        return response
      } else {
        setTimeout(() => {
          handleLeadSubmission()
        }, 2000)
        return 'Thank you! I\'m sending your details to our agent. You\'ll receive a WhatsApp message with property options shortly! 📱'
      }
    }
  }

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleLeadSubmission = async () => {
    const finalLeadData = {
      name: leadData.name || '',
      budget: leadData.budget || '',
      area: leadData.area || '',
      propertyType: leadData.propertyType ? normalizeInput('propertyType', leadData.propertyType) : '',
      status: leadData.status ? normalizeInput('status', leadData.status) : '',
      whatsapp: leadData.whatsapp || input,
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalLeadData),
      })

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: '✅ Lead sent successfully! Our agent will contact you within 24 hours.',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        
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
      handleSend()
    }
  }

  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Try Our AI Assistant
          </h2>
          <p className="text-xl text-gray-600">
            {useAI ? 'Powered by AI - Natural conversations' : 'See how it auto-qualifies buyers and suggests properties instantly'}
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
                <p className="text-blue-100 text-sm">Online • Ready to help</p>
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
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
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
                  🔗 Agent Actions (For Testing):
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
                        Get WhatsApp Notification
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

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  questions[currentQuestion]?.placeholder || 'Type your message...'
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

