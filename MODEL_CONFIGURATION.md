# 🤖 AI Model Configuration

## 🎯 Current Setup

The system tries multiple free models automatically:
1. `google/gemini-flash-1.5-8b` (first try)
2. `google/gemini-flash-1.5` (fallback)
3. `meta-llama/llama-3.2-3b-instruct` (fallback)
4. `mistralai/mistral-7b-instruct` (fallback)

---

## 🔧 Use Your Specific Model

### **Option 1: Add to `.env.local`**

If you have a specific free model code, add it:

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=your-model-code-here
```

### **Option 2: Tell Me the Model Code**

Just tell me the model code and I'll update it for you!

**Example model codes:**
- `google/gemini-flash-1.5-8b`
- `meta-llama/llama-3.2-3b-instruct`
- `mistralai/mistral-7b-instruct`
- Or any other free model from OpenRouter

---

## 📋 What to Check

### **In Server Logs (Node/Terminal):**
Look for:
- `Using model: ...` - Shows which model is being tried
- `Trying model: ...` - Shows each attempt
- `Success with model: ...` - Shows which one worked
- `Model ... failed: ...` - Shows why it failed

### **Common Errors:**
- `401` - Invalid API key
- `404` - Model not found (wrong model name)
- `429` - Rate limit
- `400` - Bad request

---

## 🚀 Quick Fix

**Share your model code and I'll update it!**

Or add to `.env.local`:
```env
OPENROUTER_MODEL=your-model-code-here
```

Then restart server.

