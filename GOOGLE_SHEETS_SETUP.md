# 📊 Google Sheets Integration - Step by Step

## 🎯 What We're Building

When a client submits their information through the chatbot or form, it will **automatically appear in a Google Sheet** that the real estate agent can check anytime.

**Result:** Agent opens Google Sheet → Sees new leads instantly!

---

## ✅ STEP 1: Create Google Cloud Project

### **What YOU Need to Do:**

1. **Go to Google Cloud Console:**
   - Open: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project:**
   - Click the **project dropdown** at the top (shows current project name)
   - Click **"New Project"** button
   - **Project Name:** `real-estate-leads` (or any name you like)
   - Click **"Create"**
   - Wait 10-20 seconds for it to be created

3. **Select Your Project:**
   - Make sure your new project is **selected** in the dropdown at the top

### **What I've Done:**
- ✅ Code is already ready in `lib/googleSheets.ts`
- ✅ API route is already set up in `app/api/leads/route.ts`
- ✅ Will automatically add headers to your sheet
- ✅ Just needs your credentials

### **✅ When You Finish Step 1:**
Reply with: **"Step 1 done"** and I'll give you Step 2!

---

## 📋 Progress Checklist

- [ ] **Step 1:** Create Google Cloud Project ← **YOU ARE HERE**
- [ ] **Step 2:** Enable Google Sheets API
- [ ] **Step 3:** Create Service Account
- [ ] **Step 4:** Download Credentials File
- [ ] **Step 5:** Create Google Sheet
- [ ] **Step 6:** Share Sheet with Service Account
- [ ] **Step 7:** Add Credentials to Project
- [ ] **Step 8:** Test It!

---

## 💡 Tips

- Use a Google account you can access easily
- Project name doesn't matter - just for organization
- This is FREE - Google gives free tier

---

**Ready? Start with Step 1 above!** 🚀

**When you're done, just reply "Step 1 done" and I'll give you the next step!**
