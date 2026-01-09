import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
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

// Simple fallback question flow
function getNextQuestion(leadData: any): string {
  if (!leadData.name) return "What's your name?"
  if (!leadData.budget) return "What is your budget? (e.g., 50 Lac, 1 Crore)"
  if (!leadData.area) return "Which area are you interested in?"
  if (!leadData.propertyType) return "Are you looking for Commercial or Residential property?"
  if (!leadData.status) return "Do you prefer Ready to Move or Under Construction?"
  if (!leadData.whatsapp) return "What is your WhatsApp number?"
  return "Thank you! I'm processing your request and our agent will contact you soon."
}

export async function POST(req: Request) {
  try {
    const { messages, leadData } = await req.json()

    // Create system prompt with property context
    const systemPrompt = createSystemPrompt(propertiesData, leadData || {})

    // Try Vercel AI with OpenRouter fallback
    let result

    try {
      // First try: OpenAI GPT-4o-mini (uses Vercel's FREE credits)
      result = await streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: messages.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
        temperature: 0.7,
      })
    } catch (error) {
      console.warn('Vercel AI failed, trying OpenRouter fallback:', error)
      
      try {
        // Fallback: OpenRouter with FREE models (meta-llama/llama-3.2-3b-instruct:free)
        const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
            'HTTP-Referer': process.env.VERCEL_URL || 'https://astraventa.com',
            'X-Title': 'Astraventa Real Estate AI',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-3b-instruct:free', // FREE model!
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((msg: any) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
            ],
            temperature: 0.7,
          }),
        })

        if (!openrouterResponse.ok) {
          throw new Error(`OpenRouter failed: ${openrouterResponse.status}`)
        }

        const data = await openrouterResponse.json()
        const responseText = data.choices?.[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.'
        
        return new Response(responseText, {
          headers: { 'Content-Type': 'text/plain' },
        })
      } catch (openrouterError) {
        console.error('OpenRouter fallback also failed:', openrouterError)
        // Ultimate fallback: Simple question flow
        const nextQuestion = getNextQuestion(leadData)
        return new Response(nextQuestion, {
          headers: { 'Content-Type': 'text/plain' },
        })
      }
    }

    // Return streaming response (Vercel AI)
    return result.toTextStreamResponse()
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
