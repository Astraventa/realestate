# 🚀 Deploy to Vercel - Step by Step

## 🎯 Why Deploy Now?

- ✅ Get live URL (can share with agents)
- ✅ Test in production
- ✅ FREE hosting
- ✅ Automatic deployments
- ✅ 10 minutes setup

---

## ✅ Step 1: Push to GitHub

### **1.1: Initialize Git (if not done)**
```bash
git init
git add .
git commit -m "Initial commit"
```

### **1.2: Create GitHub Repository**
1. Go to: https://github.com/new
2. Repository name: `astraventa-realestate`
3. Make it **Private** (recommended)
4. Click "Create repository"

### **1.3: Push Code**
```bash
git remote add origin https://github.com/YOUR_USERNAME/astraventa-realestate.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 2: Deploy to Vercel

### **2.1: Sign Up**
1. Go to: https://vercel.com
2. Sign up with GitHub (easiest)

### **2.2: Import Project**
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Click "Import"

### **2.3: Configure**
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

### **2.4: Add Environment Variables**
Click "Environment Variables" and add:

```
OPENROUTER_API_KEY=your_api_key_here
GOOGLE_SHEETS_CREDENTIALS=./google-credentials.json
GOOGLE_SHEET_ID=1_HXMfl-pTI8NXhw6Ev3w3d2lBYHZRbCWwNs7WJM8mak
AGENT_WHATSAPP=+923055255838
NEXT_PUBLIC_USE_AI=true
```

**Important:** For `GOOGLE_SHEETS_CREDENTIALS`, you need to:
- Copy content of `google-credentials.json`
- Paste as environment variable (Vercel supports multiline)
- OR use Vercel's file upload feature

### **2.5: Deploy**
Click "Deploy" and wait 2-3 minutes!

---

## ✅ Step 3: Update Google Credentials

### **Option A: Upload File (Easier)**
1. In Vercel dashboard → Your project → Settings → Environment Variables
2. Upload `google-credentials.json` file
3. Reference it in code

### **Option B: Use Environment Variable**
1. Copy entire content of `google-credentials.json`
2. Add as `GOOGLE_SHEETS_CREDENTIALS` (multiline)
3. Update code to read from env var instead of file

---

## ✅ Step 4: Test Live Site

1. Get your Vercel URL: `https://your-project.vercel.app`
2. Test chatbot
3. Test lead submission
4. Check Google Sheet

---

## 🔧 Troubleshooting

### **"Build Failed"**
- Check environment variables
- Check `package.json` scripts
- Check console for errors

### **"API Error"**
- Verify environment variables are set
- Check API keys are correct
- Check logs in Vercel dashboard

### **"Google Sheets Not Working"**
- Upload credentials file to Vercel
- Or use environment variable method
- Check service account has access

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables added
- [ ] Google credentials uploaded
- [ ] Deployed successfully
- [ ] Tested live site
- [ ] Shared URL with agents

---

## 🎯 After Deployment

1. **Share URL** with agents
2. **Test thoroughly** on live site
3. **Get feedback** from agents
4. **Add features** based on feedback

---

**Ready to deploy? Follow the steps above!** 🚀

