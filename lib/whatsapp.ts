/**
 * WhatsApp Integration - FREE Method
 * 
 * Uses WhatsApp link (wa.me) to generate clickable links
 * This is 100% FREE - no API needed!
 */

interface LeadData {
  name?: string
  budget?: string
  area?: string
  propertyType?: string
  status?: string
  whatsapp?: string
}

/**
 * Generate WhatsApp link for agent notification
 * Agent clicks link → Opens WhatsApp with pre-filled message
 */
export function generateWhatsAppLinkForAgent(
  agentWhatsApp: string,
  leadData: LeadData
): string {
  const message = `🔥 NEW LEAD RECEIVED!

👤 Name: ${leadData.name || 'N/A'}
💰 Budget: ${leadData.budget || 'N/A'}
📍 Area: ${leadData.area || 'N/A'}
🏢 Type: ${leadData.propertyType || 'N/A'}
✅ Status: ${leadData.status || 'N/A'}
📱 Client WhatsApp: ${leadData.whatsapp || 'N/A'}

Contact this lead now!`

  // Remove + and spaces from phone number
  const cleanPhone = agentWhatsApp.replace(/[+\s]/g, '')
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Generate WhatsApp link
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Generate WhatsApp link to contact client
 * Agent clicks to contact the client directly
 */
export function generateClientContactLink(clientWhatsApp: string): string {
  const cleanPhone = clientWhatsApp.replace(/[+\s]/g, '')
  return `https://wa.me/${cleanPhone}`
}

/**
 * Send WhatsApp notification (opens WhatsApp with pre-filled message)
 * This is FREE - just opens WhatsApp app/browser
 */
export function sendWhatsAppNotification(
  agentWhatsApp: string,
  leadData: LeadData
): string {
  return generateWhatsAppLinkForAgent(agentWhatsApp, leadData)
}

