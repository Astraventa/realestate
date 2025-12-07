# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Google Sheets Integration (Optional but Recommended)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Sheets API**

### Step 2: Create Service Account

1. Navigate to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Give it a name (e.g., "real-estate-leads")
4. Click **Create and Continue**
5. Skip role assignment (optional)
6. Click **Done**

### Step 3: Create and Download Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the file and save it as `credentials.json` in the project root

### Step 4: Create Google Sheet

1. Create a new Google Sheet
2. Add headers in row 1:
   - Timestamp | Name | Budget | Area | Property Type | Status | WhatsApp
3. Share the sheet with the service account email (found in credentials.json)
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### Step 5: Configure Environment Variables

Create a `.env.local` file:

```env
GOOGLE_SHEETS_CREDENTIALS=./credentials.json
GOOGLE_SHEET_ID=your_sheet_id_here
```

## Telegram Integration (Optional)

### Step 1: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the bot token

### Step 2: Get Your Chat ID

1. Start a chat with your bot
2. Send a message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your chat ID in the response

### Step 3: Configure Environment Variables

Add to `.env.local`:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Customization

### Update Property Listings

Edit `data/properties.json` to add your actual properties:

```json
{
  "id": 1,
  "name": "Your Property Name",
  "price": "1.2 Crore",
  "priceValue": 12000000,
  "location": "Your Location",
  "type": "Residential",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": "2400 sq ft",
  "status": "Ready to Move"
}
```

### Customize Chatbot Questions

Edit `components/Chatbot.tsx` and modify the `questions` array:

```typescript
const questions = [
  { key: 'name', text: "What's your name?", placeholder: 'Enter your name' },
  // Add your custom questions here
]
```

### Change Branding

1. **Colors**: Edit `tailwind.config.js`
2. **Logo**: Replace in `components/Hero.tsx`
3. **Text**: Update all component files

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

- **Netlify**: Similar to Vercel
- **Railway**: Great for full-stack apps
- **Render**: Good alternative

## Testing the Demo

1. **Test Chatbot Flow**:
   - Answer all questions
   - Check property suggestions
   - Verify lead submission

2. **Test Lead Form**:
   - Fill out the form
   - Check Google Sheets (if configured)
   - Verify API response

3. **Test Mobile View**:
   - Open on mobile device
   - Test responsive design
   - Verify all features work

## Troubleshooting

### Google Sheets Not Working?

- Check credentials file path
- Verify service account has access to sheet
- Check Sheet ID is correct
- Review console logs for errors

### Chatbot Not Responding?

- Check browser console for errors
- Verify API route is working
- Check network tab for failed requests

### Styling Issues?

- Clear browser cache
- Restart dev server
- Check Tailwind config

## Next Steps

1. ✅ Set up Google Sheets integration
2. ✅ Add your property listings
3. ✅ Customize branding
4. ✅ Test thoroughly
5. ✅ Deploy to production
6. ✅ Share with real estate agents!

---

**Need Help?** Check the README.md or contact support.

