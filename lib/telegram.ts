/**
 * Telegram Bot Integration - FREE Real-time Notifications
 * 
 * Setup:
 * 1. Open Telegram
 * 2. Search for @BotFather
 * 3. Send /newbot
 * 4. Follow instructions to get bot token
 * 5. Start chat with your bot
 * 6. Get your chat ID using @userinfobot
 * 7. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env.local
 */

interface LeadData {
  name?: string
  budget?: string
  area?: string
  propertyType?: string
  status?: string
  whatsapp?: string
  timestamp?: string
}

/**
 * Send lead notification to Telegram
 * Uses Telegram Bot API (100% FREE)
 */
export async function sendTelegramNotification(leadData: LeadData): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.warn('Telegram not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to environment variables.')
      return false
    }

    // Format message with emoji and professional layout
    const message = `
🔥 *NEW LEAD RECEIVED!*

👤 *Name:* ${leadData.name || 'N/A'}
💰 *Budget:* ${leadData.budget || 'N/A'}
📍 *Area:* ${leadData.area || 'N/A'}
🏢 *Type:* ${leadData.propertyType || 'N/A'}
✅ *Status:* ${leadData.status || 'N/A'}
📱 *WhatsApp:* ${leadData.whatsapp || 'N/A'}
⏰ *Time:* ${new Date(leadData.timestamp || Date.now()).toLocaleString('en-PK', { 
      timeZone: 'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short'
    })}

💬 *Action Required:* Contact this lead within 1 hour for best conversion!

🔗 Quick Actions:
• Contact: https://wa.me/${leadData.whatsapp?.replace(/[^0-9]/g, '')}
• View Sheet: ${process.env.GOOGLE_SHEET_URL || 'Not configured'}
    `.trim()

    // Send to Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Telegram API error:', error)
      return false
    }

    const result = await response.json()
    console.log('✅ Telegram notification sent successfully:', result.result.message_id)
    return true
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return false
  }
}

/**
 * Send test message to verify Telegram setup
 */
export async function testTelegramSetup(): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials')
      return false
    }

    const message = `
✅ *Telegram Setup Successful!*

Your Astraventa Real Estate AI is now connected to Telegram.

You'll receive instant notifications here when:
• New leads are captured
• Clients submit property inquiries
• High-priority leads arrive

Test completed at: ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}
    `.trim()

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Telegram test failed:', error)
    return false
  }
}

/**
 * Get Telegram bot info (for debugging)
 */
export async function getTelegramBotInfo(): Promise<any> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return null
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting bot info:', error)
    return null
  }
}

/**
 * Send high-priority lead alert (for hot leads)
 */
export async function sendPriorityTelegramAlert(leadData: LeadData, priority: 'HOT' | 'URGENT'): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return false
    }

    const emoji = priority === 'HOT' ? '🔥🔥🔥' : '⚡⚡⚡'
    const message = `
${emoji} *${priority} LEAD - IMMEDIATE ACTION REQUIRED!* ${emoji}

👤 *Name:* ${leadData.name || 'N/A'}
💰 *Budget:* ${leadData.budget || 'N/A'}
📍 *Area:* ${leadData.area || 'N/A'}
🏢 *Type:* ${leadData.propertyType || 'N/A'}
📱 *WhatsApp:* ${leadData.whatsapp || 'N/A'}

⚠️ *This lead matches your premium properties!*
📞 *Call NOW for best chance of conversion!*

🔗 Contact: https://wa.me/${leadData.whatsapp?.replace(/[^0-9]/g, '')}
    `.trim()

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_notification: false, // Make sure it makes sound!
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error sending priority alert:', error)
    return false
  }
}
