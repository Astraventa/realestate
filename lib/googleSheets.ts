/**
 * Google Sheets Integration Utility
 * 
 * To use this:
 * 1. Create a Google Cloud Project
 * 2. Enable Google Sheets API
 * 3. Create a service account and download credentials JSON
 * 4. Share your Google Sheet with the service account email
 * 5. Set environment variables:
 *    - GOOGLE_SHEETS_CREDENTIALS (path to credentials.json)
 *    - GOOGLE_SHEET_ID (your sheet ID)
 */

import { google } from 'googleapis'

interface LeadData {
  name?: string
  budget?: string
  area?: string
  propertyType?: string
  status?: string
  whatsapp?: string
  email?: string
  timestamp?: string
}

export async function saveLeadToGoogleSheets(leadData: LeadData): Promise<boolean> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID

    if (!sheetId) {
      console.warn('Google Sheets ID not configured')
      return false
    }

    // Load credentials - support both file path and JSON string (for Vercel)
    let auth: any
    
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      // Vercel: credentials as JSON string in environment variable
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
        auth = new google.auth.GoogleAuth({
          credentials: credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
      } catch (error) {
        // If parsing fails, try as file path (local development)
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
      }
    } else {
      console.warn('Google Sheets credentials not configured')
      return false
    }

    const sheets = google.sheets({ version: 'v4', auth })

    // Prepare row data
    const timestamp = new Date().toISOString()
    const row = [
      timestamp,
      leadData.name || '',
      leadData.budget || '',
      leadData.area || '',
      leadData.propertyType || '',
      leadData.status || '',
      leadData.whatsapp || '',
      leadData.email || '',
    ]

    // Check if headers exist, if not add them
    const headerCheck = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:H1',
    })

    // If no headers, add them first
    if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              'Timestamp',
              'Name',
              'Budget',
              'Area',
              'Property Type',
              'Status',
              'WhatsApp',
              'Email',
            ],
          ],
        },
      })
    }

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    })

    console.log('Lead saved to Google Sheets successfully')
    return true
  } catch (error) {
    console.error('Error saving to Google Sheets:', error)
    return false
  }
}

/**
 * Initialize Google Sheet with headers
 * Run this once to set up your sheet
 */
export async function initializeGoogleSheet(): Promise<boolean> {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID

    if (!sheetId) {
      console.warn('Google Sheets ID not configured')
      return false
    }

    // Load credentials - support both file path and JSON string (for Vercel)
    let auth: any
    
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      // Vercel: credentials as JSON string in environment variable
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
        auth = new google.auth.GoogleAuth({
          credentials: credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
      } catch (error) {
        // If parsing fails, try as file path (local development)
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
      }
    } else {
      console.warn('Google Sheets credentials not configured')
      return false
    }

    const sheets = google.sheets({ version: 'v4', auth })

    // Set headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:H1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            'Timestamp',
            'Name',
            'Budget',
            'Area',
            'Property Type',
            'Status',
            'WhatsApp',
            'Email',
          ],
        ],
      },
    })

    console.log('Google Sheet initialized with headers')
    return true
  } catch (error) {
    console.error('Error initializing Google Sheet:', error)
    return false
  }
}