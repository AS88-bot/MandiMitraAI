# 👨‍🌾 MandiMitra AI – Farmer Market Translator & Agriculture Assistant

MandiMitra AI is an AI-powered agricultural assistant designed specifically for small-scale Indian farmers. It leverages Google Gemini AI to bridge the gap between complex agricultural technicalities and practical, local-language farming.

## 🌟 The Problem
Indian farmers often struggle with:
- **Language Barriers**: Pesticide and fertilizer labels are often in technical English.
- **Market Information**: Difficulty in accessing real-time mandi prices and identifying middleman risks.
- **Complex Policies**: Government schemes are often described in complex legal/technical language.
- **Expert Advice**: Immediate access to agricultural experts is limited.

## 🚀 Key Features
- **AI Label Scanner**: Take a photo of any agricultural product label. Gemini AI extracts the text, simplifies calculations (e.g., dilution rates), and translates them into Telugu, Hindi, or English.
- **Mandi Price Dashboard**: View real-time market prices across different regions. Includes a **Middleman Risk Detector** that highlights when a price offer is below fair market value.
- **Multilingual Voice Assistant**: Ask questions like "How do I cure tomato leaf curl?" or "What is the urea subsidy?" and receive immediate, actionable advice.
- **Simplified Schemes**: A curated list of government benefits (PM-Kisan, Fasal Bima) simplified for the common farmer.
- **Firebase Persistence**: Your scan history and assistant conversations are saved securely for future reference.

## Demo
https://mandimitra-ai-721769240731.us-west1.run.app/

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Backend**: Node.js (Express), Gemini AI SDK (@google/genai)
- **Database/Auth**: Firebase Firestore & Authentication (Google Sign-In)
- **AI Engine**: Gemini 3.5 Flash (OCR) & Gemini 3.1 Pro (Reasoning/Assistant)

## 📦 Setup & Installation
1. **Secrets**: Ensure `GEMINI_API_KEY` is set in your environment variables via the AI Studio Secrets panel.
2. **Firebase**:
   - Run `set_up_firebase` tool to provision the project.
   - Deploy rules using `firestore.rules`.
3. **Execution**:
   - `npm run dev`: Starts the Express server with Vite middleware on port 3000.
   - `npm run build`: Bundles the frontend and compiles the backend into `dist/server.cjs`.

## 🔮 Future Improvements
- **Regional Dialect Support**: Expanding beyond Hindi/Telugu to more local dialects.
- **Offline Mode**: Local storage of market prices for areas with poor connectivity.
- **WhatsApp Integration**: Sending summaries directly to farmers via familiar channels.
- **Soil Sensor Integration**: Real-time IoT data analysis for automated advice.

---
*Developed with ❤️ by **Aisha Sultana** (Final year BE Student, Aspiring Cloud Architect) to empower the backbone of India.*
