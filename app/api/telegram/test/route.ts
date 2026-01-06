import { NextRequest, NextResponse } from 'next/server'
import { testTelegramSetup, getTelegramBotInfo } from '@/lib/telegram'

/**
 * Test Telegram integration
 * Visit: /api/telegram/test to verify setup
 */
export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Telegram not configured',
          help: {
            step1: 'Open Telegram and search for @BotFather',
            step2: 'Send /newbot and follow instructions',
            step3: 'Copy the bot token',
            step4: 'Start chat with your bot',
            step5: 'Search for @userinfobot and get your chat ID',
            step6: 'Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to Vercel environment variables',
          },
        },
        { status: 400 }
      )
    }

    // Get bot info
    const botInfo = await getTelegramBotInfo()

    // Send test message
    const testSent = await testTelegramSetup()

    if (testSent) {
      return NextResponse.json(
        {
          success: true,
          message: 'Telegram setup is working! Check your Telegram for test message.',
          bot: botInfo?.result || null,
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test message. Check your bot token and chat ID.',
          bot: botInfo?.result || null,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Telegram test failed',
      },
      { status: 500 }
    )
  }
}
