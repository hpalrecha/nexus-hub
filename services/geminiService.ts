import { GoogleGenAI, Type } from "@google/genai";
import { ToolSuggestion } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const analyzeToolInfo = async (name: string, url: string): Promise<ToolSuggestion | null> => {
  const ai = getGenAI();
  if (!ai) {
    console.warn("API Key not found, skipping AI analysis");
    return null;
  }

  try {
    const prompt = `I am adding a new tool to my organization's dashboard. 
    The tool name is "${name}" and the URL is "${url}". 
    Please provide a brief, professional description (max 15 words), a suitable category, and 3-4 relevant short tags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["category", "description", "tags"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ToolSuggestion;
    }
    return null;

  } catch (error) {
    console.error("Error analyzing tool with Gemini:", error);
    return null;
  }
};