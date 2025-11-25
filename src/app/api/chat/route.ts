// src/app/api/chat/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

// IMPORTANT: Set your Gemini API Key in your .env.local file
// Create a .env.local file in the root of your project and add:
// GEMINI_API_KEY="YOUR_API_KEY"
const API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

async function runChat(prompt: string) {
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  return response.text();
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    if (!API_KEY) {
      return new Response("Gemini API key not configured. Please set the GEMINI_API_KEY environment variable.", {
        status: 500,
      });
    }

    // For this example, we're not using streaming for simplicity of setup.
    // In a real-world scenario, you would want to stream the response.
    const text = await runChat(prompt);

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
