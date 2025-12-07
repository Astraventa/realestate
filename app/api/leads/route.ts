import { NextRequest, NextResponse } from 'next/server'
import { saveLeadToGoogleSheets } from '@/lib/googleSheets'
import { generateWhatsAppLinkForAgent } from '@/lib/whatsapp'
import { agentConfig } from '@/config/agent'

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    const timestamp = new Date().toISOString()
    const leadWithTimestamp = { ...leadData, timestamp }

    // Log the lead data
    console.log('New Lead Received:', leadWithTimestamp)

    // Try to save to Google Sheets (if configured)
    try {
      await saveLeadToGoogleSheets(leadWithTimestamp)
    } catch (sheetsError) {
      // Continue even if Google Sheets fails (for demo purposes)
      console.warn('Google Sheets save failed (continuing anyway):', sheetsError)
    }

    // Generate WhatsApp notification link (FREE - uses wa.me)
    const whatsappNotificationLink = generateWhatsAppLinkForAgent(
      agentConfig.whatsapp,
      leadWithTimestamp
    )

    // TODO: Integrate with Notion API
    // TODO: Integrate with Telegram Bot
    // TODO: Integrate with WhatsApp Business API (for automatic sending)

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
        whatsappLink: whatsappNotificationLink, // Agent can click this link
        sheetUrl: agentConfig.sheetUrl,
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

