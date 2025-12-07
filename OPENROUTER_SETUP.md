# 🤖 OpenRouter AI Integration Setup

## 🎯 What is OpenRouter?

OpenRouter provides access to multiple AI models including **FREE** ones. Perfect for your chatbot!

## ✅ Best FREE Models (Recommended)

### **1. Google Gemini Flash 1.5** ⭐ **RECOMMENDED**
- **Model:** `google/gemini-flash-1.5`
- **Cost:** FREE
- **Speed:** Very Fast
- **Quality:** Excellent
- **Best for:** General conversations, property assistance

### **2. Meta Llama 3.2 3B**
- **Model:** `meta-llama/llama-3.2-3b-instruct`
- **Cost:** FREE
- **Speed:** Fast
- **Quality:** Good
- **Best for:** Simple conversations

### **3. Mistral 7B**
- **Model:** `mistralai/mistral-7b-instruct`
- **Cost:** FREE
- **Speed:** Fast
- **Quality:** Very Good
- **Best for:** Professional conversations

---

## 🚀 Setup Steps

### **Step 1: Get OpenRouter API Key**

1. **Go to OpenRouter:**
   - Visit: https://openrouter.ai/
   - Sign up (free account)

2. **Get API Key:**
   - Go to: https://openrouter.ai/keys
   - Click "Create Key"
   - Copy your API key

### **Step 2: Add to Environment Variables**

Add to your `.env.local` file:

```env
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Step 3: Install Dependencies**

No extra packages needed! Uses built-in `fetch`.

### **Step 4: Test It**

Restart your dev server and test the chatbot!

---

## 💰 Pricing

### **Free Models:**
- Google Gemini Flash 1.5: **FREE**
- Meta Llama 3.2 3B: **FREE**
- Mistral 7B: **FREE**

### **Paid Models (Optional):**
- GPT-4: ~$0.03 per 1K tokens
- Claude: ~$0.015 per 1K tokens

**For your use case, FREE models are perfect!**

---

## 🎯 How It Works

### **Hybrid Approach:**
1. **AI handles conversations** - Natural, intelligent responses
2. **Structured flow for lead capture** - Still asks all questions
3. **Property matching** - AI suggests properties from your data
4. **Lead submission** - Same as before

### **Benefits:**
- ✅ Natural conversations
- ✅ Can answer any question
- ✅ Still captures all lead data
- ✅ Property matching works
- ✅ FREE to use

---

## 🔧 Configuration

### **Change Model:**

Edit `app/api/chat/route.ts`:

```typescript
// Change this line:
const aiResponse = await getAIResponse(aiMessages, 'google/gemini-flash-1.5')

// To any model:
const aiResponse = await getAIResponse(aiMessages, 'meta-llama/llama-3.2-3b-instruct')
```

### **Adjust Temperature:**

Edit `lib/openrouter.ts`:

```typescript
temperature: 0.7, // Lower = more focused, Higher = more creative
```

---

## 📋 Checklist

- [ ] Sign up at OpenRouter
- [ ] Get API key
- [ ] Add to `.env.local`
- [ ] Restart dev server
- [ ] Test chatbot

---

## 🆘 Troubleshooting

### **"OPENROUTER_API_KEY not configured"**
- Check `.env.local` file
- Make sure key is correct
- Restart dev server

### **"API error"**
- Check API key is valid
- Check you have credits (free models don't need credits)
- Check internet connection

### **"No response from AI"**
- Try different model
- Check API status
- Check console for errors

---

## 🎯 Recommended Setup

1. **Start with:** `google/gemini-flash-1.5` (FREE, best quality)
2. **If issues:** Try `meta-llama/llama-3.2-3b-instruct` (FREE, fast)
3. **For production:** Can upgrade to paid models if needed

---

**Ready to set up? Follow the steps above!** 🚀

