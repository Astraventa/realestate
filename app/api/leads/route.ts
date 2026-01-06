import { NextRequest, NextResponse } from 'next/server'
import { saveLeadToGoogleSheets } from '@/lib/googleSheets'
import { generateWhatsAppLinkForAgent } from '@/lib/whatsapp'
import { sendTelegramNotification, sendPriorityTelegramAlert } from '@/lib/telegram'
import { agentConfig } from '@/config/agent'

// Helper function to parse budget string to number
function parseBudget(budget?: string): number | null {
  if (!budget) return null
  
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

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    const timestamp = new Date().toISOString()
    const leadWithTimestamp = { ...leadData, timestamp }

    // Log the lead data
    console.log('New Lead Received:', leadWithTimestamp)

    // Save to Google Sheets (if configured)
    let sheetsSaved = false
    try {
      sheetsSaved = await saveLeadToGoogleSheets(leadWithTimestamp)
      if (sheetsSaved) {
        console.log('✅ Lead saved to Google Sheets')
      }
    } catch (sheetsError) {
      console.warn('⚠️ Google Sheets save failed (continuing anyway):', sheetsError)
    }

    // Send Telegram notification (INSTANT - NEW!)
    let telegramSent = false
    try {
      // Check if this is a high-value lead (budget > 1 Crore)
      const budgetValue = parseBudget(leadData.budget)
      const isHighValue = budgetValue && budgetValue >= 10000000 // 1 Crore

      if (isHighValue) {
        // Send priority alert for hot leads
        telegramSent = await sendPriorityTelegramAlert(leadWithTimestamp, 'HOT')
        console.log('🔥 Hot lead - Priority Telegram alert sent')
      } else {
        // Send normal notification
        telegramSent = await sendTelegramNotification(leadWithTimestamp)
        console.log('✅ Telegram notification sent')
      }
    } catch (telegramError) {
      console.warn('⚠️ Telegram notification failed (continuing anyway):', telegramError)
    }

    // Generate WhatsApp notification link (FREE - uses wa.me)
    const whatsappNotificationLink = generateWhatsAppLinkForAgent(
      agentConfig.whatsapp,
      leadWithTimestamp
    )

    // For demo purposes, we'll return success
    // In production, you would also:
    // 1. Send to Telegram using Telegram Bot API
    // 2. Send to WhatsApp using WhatsApp Business API (automatic)
    // 3. Save to database

    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        data: leadWithTimestamp,
        whatsappLink: whatsappNotificationLink,
        sheetUrl: agentConfig.sheetUrl,
        notifications: {
          googleSheets: sheetsSaved,
          telegram: telegramSent,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process lead' },
      { status: 500 }
    )
  }
}

