import { NextRequest, NextResponse } from 'next/server'
import { getAIResponse, createSystemPrompt } from '@/lib/openrouter'
import propertiesData from '@/data/properties.json'

export async function POST(request: NextRequest) {
  try {
    const { messages, leadData } = await request.json()

    // Check if API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found in environment variables')
      return NextResponse.json(
        {
          success: false,
          message: 'AI service not configured. Please add OPENROUTER_API_KEY to .env.local',
          error: 'API key missing',
        },
        { status: 500 }
      )
    }

    // Create system prompt with property context and current lead data
    const systemPrompt = createSystemPrompt(propertiesData, leadData || {})
    
    // Check if all data is collected
    const requiredFields = ['name', 'budget', 'area', 'propertyType', 'status', 'whatsapp']
    const collectedFields = requiredFields.filter(field => leadData?.[field])
    const isComplete = collectedFields.length >= requiredFields.length
    
    console.log('Lead data progress:', {
      collected: collectedFields.length,
      total: requiredFields.length,
      fields: collectedFields,
      isComplete: isComplete,
    })

    // Prepare messages for AI
    const aiMessages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      })),
    ]

    // Get AI response
    // Try multiple free models (fallback if one doesn't work)
    const models = [
      'google/gemini-flash-1.5-8b', // Try this first
      'google/gemini-flash-1.5',    // Fallback
      'meta-llama/llama-3.2-3b-instruct', // Another free option
      'mistralai/mistral-7b-instruct',    // Another free option
    ]
    
    const modelToUse = process.env.OPENROUTER_MODEL || models[0]
    console.log('Using model:', modelToUse)
    
    let aiResponse = ''
    let lastError: any = null
    
    // Try each model until one works
    for (const model of [modelToUse, ...models.filter(m => m !== modelToUse)]) {
      try {
        console.log('Trying model:', model)
        aiResponse = await getAIResponse(aiMessages, model)
        console.log('Success with model:', model)
        break // Success, exit loop
      } catch (error: any) {
        console.warn(`Model ${model} failed:`, error.message)
        lastError = error
        continue // Try next model
      }
    }
    
    if (!aiResponse) {
      throw lastError || new Error('All models failed')
    }

    // If all data collected, also save to sheet
    if (isComplete && leadData) {
      try {
        const { saveLeadToGoogleSheets } = await import('@/lib/googleSheets')
        await saveLeadToGoogleSheets({
          ...leadData,
          timestamp: new Date().toISOString(),
        })
        console.log('✅ Lead automatically saved to Google Sheets')
      } catch (sheetsError) {
        console.warn('Failed to save to Google Sheets:', sheetsError)
        // Continue anyway
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: aiResponse,
        isComplete: isComplete,
        collectedFields: collectedFields.length,
        totalFields: requiredFields.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    // Log detailed error for debugging
    console.error('Chat API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get AI response',
        error: 'AI service unavailable. Please try again.',
      },
      { status: 500 }
    )
  }
}

