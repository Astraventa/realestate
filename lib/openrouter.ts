/**
 * OpenRouter AI Integration
 * 
 * OpenRouter provides access to multiple AI models including free ones
 * Best free models: Google Gemini, Meta Llama, Mistral
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
  }>
}

/**
 * Get AI response from OpenRouter
 * 
 * Recommended free models:
 * - google/gemini-flash-1.5 (Fast, free, good quality)
 * - meta-llama/llama-3.2-3b-instruct (Free, fast)
 * - mistralai/mistral-7b-instruct (Free, good quality)
 */
export async function getAIResponse(
  messages: ChatMessage[],
  model: string = 'google/gemini-flash-1.5'
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    console.error('OPENROUTER_API_KEY is missing or empty')
    throw new Error('OPENROUTER_API_KEY not configured. Please add it to .env.local')
  }

  // Validate API key format (should start with sk-)
  if (!apiKey.startsWith('sk-')) {
    console.warn('API key format might be incorrect. OpenRouter keys usually start with "sk-"')
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Property Assistant',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || 'Unknown error' }
      }
      
      // Log detailed error for debugging
      console.error('OpenRouter API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      
      throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || errorData.error || 'Unknown error'}`)
    }

    const data: OpenRouterResponse = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content
    }

    throw new Error('No response from AI')
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('OpenRouter API error:', error)
    }
    throw error
  }
}

/**
 * Get property context for AI
 * Formats properties data for AI to understand
 */
export function getPropertyContext(properties: any[]): string {
  if (properties.length === 0) return 'No properties available.'

  return `Available properties:
${properties.map((prop, idx) => 
  `${idx + 1}. ${prop.name} - ${prop.price} - ${prop.location} - ${prop.type} - ${prop.status}`
).join('\n')}`
}

/**
 * Create system prompt for property assistant
 */
export function createSystemPrompt(properties: any[], leadData: any = {}): string {
  const collectedData = Object.keys(leadData).filter(key => leadData[key]).length
  const totalQuestions = 6 // name, budget, area, type, status, whatsapp
  const isComplete = collectedData >= totalQuestions
  
  return `You are a helpful AI property assistant for a real estate agency. 

CRITICAL INSTRUCTIONS:
1. Ask questions ONE AT A TIME in this EXACT order:
   - First: "What's your name?"
   - Second: "What is your budget? (e.g., 50 Lac, 1 Crore)"
   - Third: "Which area are you interested in?"
   - Fourth: "Are you looking for Commercial or Residential property?"
   - Fifth: "Do you prefer Ready to Move or Under Construction?"
   - Sixth: "What is your WhatsApp number?"

2. CURRENT PROGRESS:
   - Questions answered: ${collectedData}/${totalQuestions}
   - Collected: ${Object.keys(leadData).filter(k => leadData[k]).map(k => k).join(', ') || 'none'}
   - Next question needed: ${!leadData.name ? 'name' : !leadData.budget ? 'budget' : !leadData.area ? 'area' : !leadData.propertyType ? 'property type' : !leadData.status ? 'status' : !leadData.whatsapp ? 'WhatsApp number' : 'ALL COMPLETE'}

3. WHEN ALL QUESTIONS ANSWERED (${isComplete ? 'NOW' : 'NOT YET'}):
   ${isComplete ? '✅ ALL DATA COLLECTED! Now suggest properties and end with: "I\'m sending your details to our agent. You\'ll receive a WhatsApp message shortly! 📱" Then the system will automatically store the lead.' : 'Continue asking the next question in sequence.'}

4. If user asks other questions, answer briefly but redirect back to the question sequence.

5. After collecting ALL information, suggest matching properties from this list:

Available properties:
${getPropertyContext(properties)}

When suggesting properties, format them nicely:
💰 for price
📍 for location  
🏠 for bedrooms/bathrooms
📐 for area
✅ for status

IMPORTANT: Only suggest properties AFTER you have collected: name, budget, area, property type, status, and WhatsApp number.`
}

