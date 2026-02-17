# Engineering Calculator - Setup & Running Instructions

## ✅ Issue Fixed

The "NetworkError when attempting to fetch resource" error has been resolved by implementing a **backend proxy server**. This solves the CORS (Cross-Origin Resource Sharing) security issue that was blocking direct browser fetch requests to AI APIs.

---

## 🚀 How to Run

### Prerequisites
- **Node.js** installed (download from https://nodejs.org/). Version 14+ required.
- Valid API key for at least one of: OpenAI, Anthropic, or Groq

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs Express.js and CORS support needed for the server.

2. **Start the Server**
   ```bash
   npm start
   ```
   Or directly:
   ```bash
   node server.js
   ```

   You should see:
   ```
   🚀 Engineering Calculator server running on http://localhost:3000
   ```

3. **Open in Browser**
   - Visit **http://localhost:3000** in your web browser
   - The app will now work with AI integration

---

## 🔧 How It Works

### Before (Broken):
```
Browser → fetch() → Anthropic/OpenAI/Groq API
           ❌ CORS blocked by browser security
```

### After (Fixed):
```
Browser → fetch() → Local Express Server (localhost:3000) → Anthropic/OpenAI/Groq API
           ✅ Allowed (same origin)                        ✅ Server-to-server (no CORS block)
```

### Benefits:
- ✅ **CORS fixed**: Browser allows localhost requests
- ✅ **API keys secure**: Never exposed to the client; kept on server
- ✅ **Better error handling**: Server provides detailed error messages
- ✅ **Scalable**: Can add more features to the backend easily

---

## 🔌 API Endpoints

### `/api/ai-call` (POST)
Sends a prompt to the configured AI provider.

**Request:**
```json
{
  "mode": "openai",      // "openai", "anthropic", or "groq"
  "prompt": "Your engineering question here",
  "apiKey": "your-api-key-here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "result": "AI response text"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## 🐛 Troubleshooting

### "Cannot reach local server" error
- Make sure you ran `npm start` in this directory
- Check that the server is running on http://localhost:3000
- Verify port 3000 is not blocked by a firewall

### "API key is missing or invalid"
- Double-check your API key in the Connect AI modal
- Ensure you're not using special characters (they're stripped automatically)
- Try disconnecting and reconnecting

### "HTTP 401/403" errors
- Invalid or expired API key
- Verify your key is correct in the provider's dashboard
- Check whether your account has API access enabled

### Server crashes with "PORT is already in use"
- Another app is using port 3000
- Run on a different port: `PORT=3001 npm start`
- Or kill the process using port 3000

---

## 📁 Project Structure

```
engineering-calculator-project/
├── index.html        # Main UI application
├── server.js         # Express proxy server (NEW)
├── package.json      # Node.js dependencies (NEW)
└── README.md         # This file (NEW)
```

---

## 💡 Connection Status

When you start the app (with server running):
- **AI Badge** in header shows connection status:
  - 🔴 **Offline** = No AI connected or server unreachable
  - 🟢 **Online** = Cloud AI (OpenAI/Anthropic/Groq) ready
  - 🟣 **Local** = Local WebLLM model running on your device

---

## ⚙ Environment Variables (Optional)

You can customize the server port:
```bash
PORT=5000 npm start
```

Then visit: http://localhost:5000

---

## 📝 Notes

- API keys are never logged or stored permanently
- Each prompt sends your API key to the proxy, which forwards it securely to the AI provider
- Local mode (WebLLM) does not require internet and doesn't need this server for the AI part
- The server is required for cloud API modes only

---

**Enjoy using the Engineering Calculator with AI! 🚀**
