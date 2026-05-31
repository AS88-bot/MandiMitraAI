import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/gemini/analyze-label", async (req, res) => {
  try {
    const { image, language = "English" } = req.body;
    if (!image) return res.status(400).json({ error: "Image is required" });

    const prompt = `You are MandiMitra AI, an agriculture expert assistant for Indian farmers. 
    Analyze this pesticide/fertilizer label image.
    1. Extract the product name and key active ingredients.
    2. Provide a simple, clear explanation of how to use it (dosage, timing).
    3. List important safety warnings.
    4. Translate the entire explanation into ${language} using simple, non-technical language that a small-scale farmer can understand.
    
    Structure the response in JSON:
    {
      "productName": "...",
      "ingredients": "...",
      "usageInstructions": "...",
      "safetyWarnings": "...",
      "explanation": "..."
    }`;

    const model = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image.split(",")[1],
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = await model;
    res.json(JSON.parse(result.text));
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gemini/query", async (req, res) => {
  try {
    const { query, language = "English", history = [] } = req.body;
    
    const systemPrompt = `You are MandiMitra AI, a friendly and wise agriculture assistant for Indian farmers. 
    Your goal is to help them with crop management, weather advice, mandi prices, and government schemes.
    - Always provide advice that is practical and cost-effective for small-scale farmers.
    - Use simple, encouraging language.
    - If asked in ${language}, respond primarily in ${language}.
    - Keep responses concise and actionable.
    - If the user asks about prices, mention that they can check the 'Market Prices' tab for latest trends.`;

    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview", // Complex reasoning
      config: {
        systemInstruction: systemPrompt,
      },
      history: history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }],
      })),
    });

    const result = await chat.sendMessage({ message: query });
    res.json({ text: result.text });
  } catch (error: any) {
    console.error("Gemini Query Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/market-prices", (req, res) => {
  // Mock data for Mandi Prices
  const mockPrices = [
    { id: 1, crop: "Tomato", mandi: "Kurnool", price: 1200, unit: "Quintal", trend: "up", referencePrice: 1350 },
    { id: 2, crop: "Tomato", mandi: "Guntur", price: 1450, unit: "Quintal", trend: "up", referencePrice: 1350 },
    { id: 3, crop: "Paddy", mandi: "Nizamabad", price: 2100, unit: "Quintal", trend: "stable", referencePrice: 2040 },
    { id: 4, crop: "Cotton", mandi: "Warangal", price: 7200, unit: "Quintal", trend: "down", referencePrice: 7500 },
    { id: 5, crop: "Onion", mandi: "Lasalgaon", price: 1800, unit: "Quintal", trend: "up", referencePrice: 1700 },
  ];
  res.json(mockPrices);
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MandiMitra AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
