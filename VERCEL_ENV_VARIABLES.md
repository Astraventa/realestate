# 🔐 Vercel Environment Variables - Complete Guide

## ✅ Good News: No Separate Backend Needed!

**Next.js API routes work perfectly on Vercel!**
- Your `/api/leads` route → Works automatically
- Your `/api/chat` route → Works automatically
- Everything runs on Vercel (serverless functions)

---

## 📋 Environment Variables to Add

### **1. OpenRouter API Key** (Required)
```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```
- Get from: https://openrouter.ai/keys
- **Where to add:** Vercel → Project → Settings → Environment Variables

---

### **2. Google Sheets Credentials** (Required)

**Option A: Upload as File (Easier)**
1. In Vercel → Project → Settings → Environment Variables
2. Click "Upload File"
3. Upload `google-credentials.json`
4. Name it: `GOOGLE_SHEETS_CREDENTIALS_FILE`

**Option B: Environment Variable (More Secure)**
1. Open `google-credentials.json`
2. Copy entire content (it's JSON)
3. In Vercel → Add Environment Variable:
   - Key: `GOOGLE_SHEETS_CREDENTIALS`
   - Value: Paste entire JSON content
   - Type: Encrypted

---

### **3. Google Sheet ID** (Required)
```
GOOGLE_SHEET_ID=1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak
```
- Your sheet ID from the URL

---

### **4. Agent WhatsApp** (Optional but Recommended)
```
AGENT_WHATSAPP=+923055255838
```
- Your WhatsApp number for notifications

---

### **5. Agent Name** (Optional)
```
AGENT_NAME=Real Estate Agent
```
- Or your actual name

---

### **6. Agent Email** (Optional)
```
AGENT_EMAIL=your-email@example.com
```
- Your email (if you want email notifications later)

---

### **7. Google Sheet URL** (Optional)
```
GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak/edit?usp=sharing
```
- Public view URL for "View Sheet" button

---

### **8. Enable AI** (Optional)
```
NEXT_PUBLIC_USE_AI=true
```
- Set to `true` to enable AI, `false` for rule-based only

---

### **9. Site URL** (Optional)
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```
- Your Vercel deployment URL (auto-set by Vercel, but you can override)

---

## 🎯 Minimum Required Variables

**Must Have:**
1. ✅ `OPENROUTER_API_KEY`
2. ✅ `GOOGLE_SHEETS_CREDENTIALS` (or file upload)
3. ✅ `GOOGLE_SHEET_ID`

**Recommended:**
4. ✅ `AGENT_WHATSAPP`
5. ✅ `GOOGLE_SHEET_URL`

---

## 📝 Step-by-Step: Adding to Vercel

### **Step 1: Go to Environment Variables**
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables

### **Step 2: Add Each Variable**
Click "Add New" for each:

1. **OPENROUTER_API_KEY**
   - Key: `OPENROUTER_API_KEY`
   - Value: `sk-or-v1-...`
   - Environment: Production, Preview, Development (select all)

2. **GOOGLE_SHEETS_CREDENTIALS**
   - Key: `GOOGLE_SHEETS_CREDENTIALS`
   - Value: Paste entire JSON from `google-credentials.json`
   - Environment: Production, Preview, Development

3. **GOOGLE_SHEET_ID**
   - Key: `GOOGLE_SHEET_ID`
   - Value: `1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak`
   - Environment: Production, Preview, Development

4. **AGENT_WHATSAPP**
   - Key: `AGENT_WHATSAPP`
   - Value: `+923055255838`
   - Environment: Production, Preview, Development

5. **GOOGLE_SHEET_URL**
   - Key: `GOOGLE_SHEET_URL`
   - Value: `https://docs.google.com/spreadsheets/d/1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak/edit?usp=sharing`
   - Environment: Production, Preview, Development

6. **NEXT_PUBLIC_USE_AI**
   - Key: `NEXT_PUBLIC_USE_AI`
   - Value: `true`
   - Environment: Production, Preview, Development

---

## 🔧 Update Code for Vercel (If Needed)

If you used file path for Google credentials, update `lib/googleSheets.ts`:

```typescript
// Instead of reading from file, read from env var
const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
  : require(process.env.GOOGLE_SHEETS_CREDENTIALS_PATH || './google-credentials.json')
```

---

## ✅ Checklist Before Deploy

- [ ] All environment variables added
- [ ] Google credentials uploaded or added as env var
- [ ] API keys are correct
- [ ] Sheet ID is correct
- [ ] WhatsApp number is correct
- [ ] Ready to deploy!

---

## 🚀 After Deployment

1. **Test the site:**
   - Visit your Vercel URL
   - Test chatbot
   - Test lead submission
   - Check Google Sheet

2. **If errors:**
   - Check Vercel logs (Deployments → Click deployment → Logs)
   - Verify environment variables
   - Check API keys are correct

---

## 💡 Pro Tips

1. **Use Vercel's file upload** for Google credentials (easier)
2. **Add variables to all environments** (Production, Preview, Development)
3. **Test in Preview** before Production
4. **Check logs** if something doesn't work

---

**You're all set! No separate backend needed - everything runs on Vercel!** 🚀

