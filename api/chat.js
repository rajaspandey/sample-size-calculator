import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { messages, systemInstruction } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the deployment server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Format messages for @google/genai (usually requires role and parts)
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1 // very low temperature to ensure reliable JSON emission for auto-population
      }
    });

    res.status(200).json({ text: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message });
  }
}
