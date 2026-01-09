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

export default function Chatbot() {
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
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

  // NO AUTO-SCROLL - User controls scrolling manually
  // Removed all automatic scrolling to prevent unwanted page movement

  // Extract data from user input and AI response
  const extractDataFromResponse = (userInput: string, aiResponse: string) => {
    const lowerInput = userInput.toLowerCase().trim()
    
    // Try to extract name - look for common name patterns (not greetings, not numbers, not locations)
    if (!leadData.name) {
      // Skip if it's a greeting, location, or number
      const isGreeting = /^(hi|hello|hey|salam|assalam)/i.test(lowerInput)
      const isLocation = lowerInput.includes('lahore') || lowerInput.includes('karachi') || lowerInput.includes('islamabad') || lowerInput.includes('dha') || lowerInput.includes('bahria') || lowerInput.includes('gulberg')
      const isNumber = /^\+?92\d{10}$/.test(userInput.replace(/\s/g, '')) || /^\d+$/.test(userInput.replace(/\s/g, ''))
      const isBudget = lowerInput.includes('crore') || lowerInput.includes('lac') || lowerInput.includes('lakh')
      
      // If it's a reasonable name (2-50 chars, not greeting/location/number/budget)
      if (!isGreeting && !isLocation && !isNumber && !isBudget && userInput.length >= 2 && userInput.length <= 50) {
        // Check if AI response asks for name (indicates this might be name)
        if (aiResponse.toLowerCase().includes('name') || messages.length <= 2) {
          setLeadData(prev => ({ ...prev, name: userInput.trim() }))
        }
      }
    }
    
    // Try to extract budget
    if (!leadData.budget && (lowerInput.includes('crore') || lowerInput.includes('lac') || lowerInput.includes('lakh') || /\d+\s*(crore|lac|lakh)/i.test(userInput))) {
      // Extract just the budget part
      const budgetMatch = userInput.match(/(\d+[\s.]*\d*)\s*(crore|lac|lakh|cr)/i)
      if (budgetMatch) {
        setLeadData(prev => ({ ...prev, budget: budgetMatch[0] }))
      } else {
        setLeadData(prev => ({ ...prev, budget: userInput }))
      }
    }
    
    // Try to extract area
    if (!leadData.area) {
      const areaKeywords = ['dha', 'bahria', 'gulberg', 'model town', 'johar', 'faisalabad', 'karachi', 'islamabad', 'lahore']
      if (areaKeywords.some(keyword => lowerInput.includes(keyword))) {
        setLeadData(prev => ({ ...prev, area: userInput.trim() }))
      }
    }
    
    // Try to extract property type
    if (!leadData.propertyType) {
      if (lowerInput.includes('commer')) {
        setLeadData(prev => ({ ...prev, propertyType: 'Commercial' }))
      } else if (lowerInput.includes('resid') || lowerInput.includes('home') || lowerInput.includes('house')) {
        setLeadData(prev => ({ ...prev, propertyType: 'Residential' }))
      }
    }
    
    // Try to extract status
    if (!leadData.status) {
      if (lowerInput.includes('ready') || lowerInput.includes('move') || lowerInput === 'yes') {
        setLeadData(prev => ({ ...prev, status: 'Ready to Move' }))
      } else if (lowerInput.includes('under') || lowerInput.includes('construct') || lowerInput === 'no') {
        setLeadData(prev => ({ ...prev, status: 'Under Construction' }))
      }
    }
    
    // Try to extract WhatsApp (must be a phone number)
    if (!leadData.whatsapp && (userInput.includes('+92') || userInput.includes('923') || /^\+?92\d{10}$/.test(userInput.replace(/\s/g, '')))) {
      // Clean the number
      const cleanNumber = userInput.replace(/\s/g, '').replace(/[^\d+]/g, '')
      if (cleanNumber.startsWith('+92') || cleanNumber.startsWith('92')) {
        setLeadData(prev => ({ ...prev, whatsapp: cleanNumber }))
      }
    }
  }

  // Normalize user input to standard format
  const normalizeInput = (key: string, value: string): string => {
    const lower = value.toLowerCase().trim()
    
    if (key === 'propertyType') {
      if (lower.includes('commer') || lower.includes('comerc')) return 'Commercial'
      if (lower.includes('resid') || lower.includes('home') || lower.includes('house')) return 'Residential'
      return value // Return original if can't determine
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

    // Normalize filters
    const normalizedType = leadData.propertyType 
      ? normalizeInput('propertyType', leadData.propertyType) 
      : null
    const normalizedStatus = leadData.status 
      ? normalizeInput('status', leadData.status) 
      : null
    const areaPreference = leadData.area?.toLowerCase() || ''

    return propertiesData
      .filter((prop) => {
        // Budget filter - within 20% (tighter than before)
        const priceDiff = Math.abs(prop.priceValue - budgetValue)
        const budgetMatch = priceDiff <= budgetValue * 0.2 && prop.priceValue <= budgetValue * 1.2
        
        if (!budgetMatch) return false

        // Property type filter
        if (normalizedType && prop.type !== normalizedType) return false

        // Status filter
        if (normalizedStatus && prop.status !== normalizedStatus) return false

        // Area preference (if specified, prioritize matching area)
        if (areaPreference) {
          const propArea = prop.location.toLowerCase()
          // Check if area preference matches (fuzzy match)
          if (propArea.includes(areaPreference) || areaPreference.includes(propArea.split(' ')[0])) {
            return true // Prioritize matching area
          }
        }

        return true
      })
      .sort((a, b) => {
        // Sort by: 1) Area match, 2) Budget proximity
        const aAreaMatch = areaPreference && a.location.toLowerCase().includes(areaPreference) ? 0 : 1
        const bAreaMatch = areaPreference && b.location.toLowerCase().includes(areaPreference) ? 0 : 1
        
        if (aAreaMatch !== bAreaMatch) return aAreaMatch - bAreaMatch
        
        // Then by budget proximity
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

  const getRuleBasedResponse = (userInput: string): string => {
    // Check if there are more questions to ask
    if (currentQuestion < questions.length - 1) {
      // Determine the next question
      const nextQuestionIndex = currentQuestion + 1
      const nextQuestion = questions[nextQuestionIndex]
      
      // Update the question after a brief delay to ensure response is processed
      setTimeout(() => {
        setCurrentQuestion(nextQuestionIndex)
      }, 100)
      
      return nextQuestion.text
    } else {
      // All questions answered - show property suggestions and lead capture
      const budget = leadData.budget || userInput
      const matchingProperties = findMatchingProperties(budget, leadData)

      if (matchingProperties.length > 0) {
        const filters = []
        if (leadData.area) filters.push(`area: ${leadData.area}`)
        if (leadData.propertyType) filters.push(`type: ${normalizeInput('propertyType', leadData.propertyType)}`)
        if (leadData.status) filters.push(`status: ${normalizeInput('status', leadData.status)}`)
        
        let response = `Great! Based on your preferences (${filters.join(', ')}), here are ${matchingProperties.length} best options:\n\n`
        matchingProperties.forEach((prop, idx) => {
          const propertyDetails = prop.type === 'Commercial' 
            ? `   📐 ${prop.area}`
            : `   🏠 ${prop.bedrooms} Bed, ${prop.bathrooms} Bath\n   📐 ${prop.area}`
          
          response += `${idx + 1}. ${prop.name}
   💰 ${prop.price}
   📍 ${prop.location}
${propertyDetails}
   ✅ ${prop.status}

`
        })
        response +=
          'I\'m sending your details to our agent. You\'ll receive a WhatsApp message shortly! 📱'
        
        // Simulate sending to WhatsApp
        setTimeout(() => {
          handleLeadSubmission()
        }, 2000)
        
        return response
      } else {
        // Simulate sending to WhatsApp
        setTimeout(() => {
          handleLeadSubmission()
        }, 2000)
        
        return 'Thank you! I found your preferences, but I don\'t have exact matches right now. I\'m sending your details to our agent who will find the perfect property for you. You\'ll receive a WhatsApp message shortly! 📱'
      }
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userInput = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Update lead data with normalized values
    const questionKey = questions[currentQuestion]?.key
    if (questionKey) {
      const normalizedValue = normalizeInput(questionKey, userInput)
      setLeadData((prev) => ({ ...prev, [questionKey]: normalizedValue }))
    }

    // Try AI first (if enabled), then fallback to rule-based
    let botResponse = ''
    // Check if AI is enabled (from environment variable or default to true if API key exists)
    const useAI = typeof window !== 'undefined' 
      ? (localStorage.getItem('useAI') !== 'false') // Default to true unless explicitly disabled
      : true

    if (useAI) {
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
          if (data.success && data.message) {
            botResponse = data.message
            
            // Extract data from AI response and update leadData
            extractDataFromResponse(userInput, botResponse)
            
            // If all data collected, trigger lead submission
            if (data.isComplete) {
              setTimeout(() => {
                handleLeadSubmission()
              }, 2000)
            }
          } else {
            throw new Error(data.error || 'Invalid response from AI')
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `API error: ${response.status}`)
        }
      } catch (error: any) {
        // Fallback to rule-based
        console.warn('AI unavailable, using rule-based:', error.message || error)
        botResponse = getRuleBasedResponse(userInput)
      }
    } else {
      // Rule-based flow
      botResponse = getRuleBasedResponse(userInput)
      // Extract data from user input for rule-based flow
      extractDataFromResponse(userInput, botResponse)
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

  const handleLeadSubmission = async () => {
    // Prevent duplicate submissions
    if (showActionButtons) {
      console.log('Lead already submitted, skipping duplicate')
      return
    }

    // Normalize all data before sending
    // If name is missing but WhatsApp exists, use a default or WhatsApp number
    let finalName = leadData.name || ''
    if (!finalName && leadData.whatsapp) {
      // If no name provided, use "Client" + last 4 digits of WhatsApp
      const lastDigits = leadData.whatsapp.slice(-4)
      finalName = `Client ${lastDigits}`
    } else if (!finalName) {
      finalName = 'Not Provided'
    }

    const finalLeadData = {
      name: finalName,
      budget: leadData.budget || '',
      area: leadData.area || '',
      propertyType: leadData.propertyType ? normalizeInput('propertyType', leadData.propertyType) : '',
      status: leadData.status ? normalizeInput('status', leadData.status) : '',
      whatsapp: leadData.whatsapp || '',
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
        
        // Store lead data and show action buttons (for agent testing)
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
            See how it auto-qualifies buyers and suggests properties instantly
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
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

          {/* Messages */}
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
            
            {/* Action Buttons (for agent testing) */}
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
                    if (agentWhatsApp) {
                      return (
                        <a
                          href={generateWhatsAppLinkForAgent(agentWhatsApp, submittedLeadData)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Get WhatsApp Notification
                        </a>
                      )
                    } else {
                      return (
                        <button
                          onClick={() => {
                            // Trigger agent setup modal
                            localStorage.removeItem('agent_whatsapp_number')
                            window.location.reload()
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm font-medium cursor-pointer"
                          title="Click to set up WhatsApp notifications"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Setup WhatsApp (Click)
                        </button>
                      )
                    }
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

          {/* Input */}
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

