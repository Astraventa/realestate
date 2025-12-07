# ✅ Vercel Deployment Checklist

## 🎯 Quick Answer: No Separate Backend Needed!

**✅ Everything runs on Vercel:**
- Next.js API routes (`/api/leads`, `/api/chat`) → Serverless functions
- No separate backend server needed
- Everything in one deployment

---

## 📋 Environment Variables to Add

### **Required (Must Have):**

1. **OPENROUTER_API_KEY**
   ```
   sk-or-v1-your-actual-key-here
   ```

2. **GOOGLE_SHEETS_CREDENTIALS**
   - Open `google-credentials.json`
   - Copy entire JSON content
   - Paste as environment variable

3. **GOOGLE_SHEET_ID**
   ```
   1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak
   ```

### **Recommended:**

4. **AGENT_WHATSAPP**
   ```
   +923055255838
   ```

5. **GOOGLE_SHEET_URL**
   ```
   https://docs.google.com/spreadsheets/d/1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak/edit?usp=sharing
   ```

6. **NEXT_PUBLIC_USE_AI**
   ```
   true
   ```

---

## 🚀 Step-by-Step Deployment

### **Step 1: Import to Vercel**
1. Go to: https://vercel.com
2. Click "Add New" → "Project"
3. Import from GitHub
4. Select: `Astraventa/realestate`
5. Click "Import"

### **Step 2: Configure Project**
- Framework: Next.js (auto-detected)
- Root Directory: `./` (default)
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)

### **Step 3: Add Environment Variables**
Click "Environment Variables" and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | All |
| `GOOGLE_SHEETS_CREDENTIALS` | `{paste entire JSON}` | All |
| `GOOGLE_SHEET_ID` | `1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak` | All |
| `AGENT_WHATSAPP` | `+923055255838` | All |
| `GOOGLE_SHEET_URL` | `https://docs.google.com/...` | All |
| `NEXT_PUBLIC_USE_AI` | `true` | All |

**Important:** Select "Production", "Preview", and "Development" for all variables.

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your live URL!

---

## 🔧 How to Get Google Credentials JSON

1. Open `google-credentials.json` file
2. Copy entire content (it's a JSON object)
3. Paste into Vercel environment variable

**Example format:**
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  ...
}
```

---

## ✅ After Deployment

### **Test Everything:**
1. Visit your Vercel URL
2. Test chatbot
3. Submit a test lead
4. Check Google Sheet (should see the lead)
5. Check WhatsApp link (should work)

### **If Errors:**
1. Check Vercel logs:
   - Deployments → Click deployment → Logs
2. Verify environment variables are set
3. Check API keys are correct
4. Verify Google Sheet is shared with service account

---

## 📝 Code Updated

✅ **Updated `lib/googleSheets.ts`** to work with Vercel:
- Now reads credentials from environment variable (JSON string)
- Still works with file path (for local development)
- Works on both local and Vercel

---

## 🎯 Summary

**What You Need:**
- ✅ 6 environment variables
- ✅ Google credentials JSON (paste as env var)
- ✅ 10 minutes

**What You Get:**
- ✅ Live URL
- ✅ No separate backend needed
- ✅ Everything works automatically
- ✅ FREE hosting

---

## 🚨 Important Notes

1. **Google Credentials:**
   - Paste entire JSON as environment variable
   - Don't use file path on Vercel
   - Code updated to handle this automatically

2. **API Routes:**
   - Work automatically on Vercel
   - No configuration needed
   - Serverless functions

3. **Environment Variables:**
   - Add to all environments (Production, Preview, Development)
   - Redeploy after adding variables

---

**You're ready to deploy! Follow the steps above.** 🚀

