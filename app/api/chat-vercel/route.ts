import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import propertiesData from '@/data/properties.json'

// Runtime edge for better performance
export const runtime = 'edge'

// System prompt for property assistant
function createSystemPrompt(properties: any[], leadData: any = {}) {
  const collectedData = Object.keys(leadData).filter(key => leadData[key]).length
  const totalQuestions = 6
  
  return `You are a professional real estate AI assistant helping buyers find their dream property.

CURRENT CONVERSATION STATE:
- Questions answered: ${collectedData}/6
- Collected data: ${Object.keys(leadData).filter(k => leadData[k]).map(k => `${k}: ${leadData[k]}`).join(', ') || 'none yet'}

YOUR TASK - ASK QUESTIONS IN THIS EXACT ORDER:
1. Name: "What's your name?" ${leadData.name ? '✅' : '⬜'}
2. Budget: "What is your budget? (e.g., 50 Lac, 1 Crore)" ${leadData.budget ? '✅' : '⬜'}
3. Area: "Which area interests you? (e.g., DHA, Bahria Town, Gulberg)" ${leadData.area ? '✅' : '⬜'}
4. Type: "Commercial or Residential property?" ${leadData.propertyType ? '✅' : '⬜'}
5. Status: "Ready to Move or Under Construction?" ${leadData.status ? '✅' : '⬜'}
6. WhatsApp: "What's your WhatsApp number for property updates?" ${leadData.whatsapp ? '✅' : '⬜'}

RULES:
- Ask ONE question at a time
- Be friendly and professional
- If user asks other questions, answer briefly then continue with the sequence
- After collecting ALL 6 answers, suggest 2-3 matching properties

AVAILABLE PROPERTIES:
${properties.map(p => `- ${p.name}: ${p.price} in ${p.location} (${p.type}, ${p.status})`).join('\n')}

When all data collected, format property suggestions like:
🏡 **Property Name**
💰 Price
📍 Location
🏢 Type & Status

Keep responses concise and conversational.`
}

export async function POST(req: Request) {
  try {
    const { messages, leadData } = await req.json()

    // Create system prompt with property context
    const systemPrompt = createSystemPrompt(propertiesData, leadData || {})

    // Try Vercel AI with multiple model fallback
    // Priority: GPT-4o-mini (cheapest) → GPT-3.5 → Claude Haiku
    let result

    try {
      // First try: OpenAI GPT-4o-mini (most cost-effective, uses Vercel free credits)
      result = await streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
        temperature: 0.7,
        maxTokens: 500,
      })
    } catch (error) {
      console.warn('GPT-4o-mini failed, trying Claude Haiku:', error)
      
      try {
        // Fallback: Anthropic Claude Haiku (also uses free credits)
        result = await streamText({
          model: anthropic('claude-3-haiku-20240307'),
          system: systemPrompt,
          messages: messages.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          temperature: 0.7,
          maxTokens: 500,
        })
      } catch (claudeError) {
        console.error('All AI models failed:', claudeError)
        throw new Error('AI service temporarily unavailable')
      }
    }

    // Return streaming response
    return result.toAIStreamResponse()
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to get AI response',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
