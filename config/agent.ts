/**
 * Agent Configuration
 * Update this with your real estate agent's information
 */

export const agentConfig = {
  // Agent's WhatsApp number (for notifications)
  // Format: +923001234567 (with country code)
  whatsapp: process.env.AGENT_WHATSAPP || '+923001234567',
  
  // Google Sheet URL (for "View Sheet" button)
  // Use public sharing link format for better access
  sheetUrl: process.env.GOOGLE_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak/edit?usp=sharing',
  
  // Agent name (optional, for personalization)
  name: process.env.AGENT_NAME || 'Real Estate Agent',
  
  // Agent contact email (optional)
  email: process.env.AGENT_EMAIL || '',
}

