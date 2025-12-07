# AI Property Sales Assistant - Demo

A powerful AI-powered chatbot system designed for real estate agents to capture leads, auto-qualify buyers, and suggest properties instantly.

## 🚀 Features

### Core Features
- **24/7 AI Chatbot** - Automated property assistant that works around the clock
- **Auto-Qualification** - Smart questions to identify serious buyers
- **Instant Property Suggestions** - AI matches properties based on budget and preferences
- **WhatsApp Lead Forwarding** - Send qualified leads directly to WhatsApp in 1 second
- **Lead Capture Form** - Collect buyer information (Name, Budget, Area, WhatsApp)

### Key Benefits for Real Estate Agents
- ✅ More leads - Capture leads even while you sleep
- ✅ More calls - Auto-qualified buyers are more likely to convert
- ✅ Less time wasted - AI filters out non-serious buyers
- ✅ 24/7 availability - Never miss a lead opportunity

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Google Sheets Integration (Optional)

To integrate with Google Sheets:

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create service account credentials
4. Share your Google Sheet with the service account email
5. Add credentials to `.env.local`:

```env
GOOGLE_SHEETS_CREDENTIALS=path/to/credentials.json
GOOGLE_SHEET_ID=your_sheet_id
```

### WhatsApp API Integration (Future)

For production WhatsApp integration, you'll need:
- WhatsApp Business API account
- API credentials
- Webhook setup

## 📝 Project Structure

```
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts      # API endpoint for lead capture
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── Chatbot.tsx           # AI chatbot component
│   ├── CTA.tsx               # Call-to-action section
│   ├── Features.tsx          # Features showcase
│   ├── Hero.tsx              # Hero section
│   └── LeadForm.tsx          # Lead capture form
└── data/
    └── properties.json       # Property listings data
```

## 🎯 Demo Flow

1. **Hero Section** - Compelling value proposition
2. **Features** - Showcase 3 big features
3. **Chatbot** - Interactive demo of AI assistant
4. **Lead Form** - Direct lead capture
5. **CTA** - Book a demo call-to-action

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

- Netlify
- Railway
- Render

## 📊 Lead Integration Options

The system supports multiple integration options:

- ✅ Google Sheets (Easy setup)
- ✅ Notion (Database integration)
- ✅ Telegram Bot (Instant notifications)
- ✅ WhatsApp API (Direct messaging)

## 💡 Customization

### Update Property Listings

Edit `data/properties.json` to add your properties.

### Customize Questions

Modify the `questions` array in `components/Chatbot.tsx`.

### Change Colors

Update Tailwind colors in `tailwind.config.js`.

## 📞 Support

For questions or support, contact the development team.

---

**Built for Real Estate Agents Who Want More Leads, More Calls, and Less Time Wasted.**

