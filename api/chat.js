import { GoogleGenAI } from '@google/genai';
import { testsConfig } from '../src/config/testsConfig.js';

const generateSystemPrompt = () => {
  const availableTests = testsConfig.flatMap(c => c.tests.map(t => ({
    id: t.id,
    name: t.name,
    description: t.docs,
    required_arguments: t.args.map(a => `${a.name} (${a.label}, default: ${a.default})`)
  })));

  return `You are a statistical advisor helping a clinical researcher calculate a sample size using the pwrSS library.
You have access to the following tests and their parameters:
${JSON.stringify(availableTests, null, 2)}

YOUR BEHAVIOR:
1. Ask the user questions to deduce which test they need.
2. Ask the user for the parameters required by that test (like alpha, power, expected means, variance, etc.).
3. IMPORTANT: Once you have confidently identified the specific 'id' of the test AND you have all the required parameters to run it, stop chatting normally. You MUST output your final response STRICTLY as a raw JSON string block with NO markdown backticks or conversational text. The JSON format must be exactly:
{
  "status": "ready",
  "testId": "<id of test>",
  "calculation_mode": "<evaluate the conversation: if the user wants to calculate sample size, output 'sample_size'. If they want to calculate statistical power, output 'power'. If it is completely ambiguous, assume 'sample_size'.>",
  "reasoning": "<1 to 2 paragraphs explicitly explaining your reasoning for choosing this specific statistical test over the alternatives based on their study design. Write professionally.>",
  "source_link": "<the URL given in the 'resource' property of the test config you selected>",
  "parameters": {
     "<argName>": <value>
  }
}
Your JSON response will be intercepted by the UI and instantly calculate the result for the user. Do not wrap the JSON in \`\`\`. Just output raw JSON starting with {.`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Cross-Origin Authorization Lock
  if (process.env.NODE_ENV === 'production') {
    const origin = req.headers.origin;
    const allowed = 'https://sample-size-calculator-mauve.vercel.app';
    if (origin !== allowed) {
      return res.status(403).json({ error: 'Access Denied: Unrecognized Host Origin' });
    }
  }
  
  const { messages } = req.body;
  
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
        systemInstruction: generateSystemPrompt(),
        temperature: 0.1 // very low temperature to ensure reliable JSON emission for auto-population
      }
    });

    res.status(200).json({ text: response.text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message });
  }
}
