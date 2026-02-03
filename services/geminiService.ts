
import { GoogleGenAI } from "@google/genai";

export const getAIExplanation = async (
  calculatorName: string,
  inputs: Record<string, any>,
  outputs: Record<string, any>
): Promise<string> => {
  // Fix: Initialize GoogleGenAI inside the function to use the current process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use direct process.env check to verify key presence as per guidelines context
  if (!process.env.API_KEY) {
    return "AI insights are unavailable. Please configure the API Key in the environment.";
  }

  const prompt = `
    Context: A user is using the "${calculatorName}" on a web calculator app.
    Inputs Provided: ${JSON.stringify(inputs, null, 2)}
    Results Calculated: ${JSON.stringify(outputs, null, 2)}

    Task: Provide a concise, professional, and helpful explanation of these results. 
    1. Summarize what the results mean for the user.
    2. Provide 1-2 actionable tips or insights based on these specific numbers.
    3. Keep it under 150 words.
    4. Use markdown for bolding key figures.
  `;

  try {
    // Correct usage of ai.models.generateContent with model and string contents
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting text output directly from property text
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this moment. Please try again later.";
  }
};
