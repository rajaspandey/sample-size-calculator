import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testsConfig } from '../config/testsConfig';

export default function AIAssistant() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([
    { role: 'model', text: 'Hello! I am your AI sample size calculator assistant. Tell me about the study you are planning, and I will figure out exactly which statistical test you need, collect the parameters, and automatically calculate your results!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const generateSystemPrompt = () => {
    // Stringify the test schemas to give Gemini the full database of capabilities
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
}
Your JSON format must be exactly:
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

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const newMsg = { role: 'user', text: inputText };
    const chatArray = [...history, newMsg];
    setHistory(chatArray);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatArray,
          systemInstruction: generateSystemPrompt()
        })
      });
      const data = await res.json();
      
      if (data.error) {
        setHistory([...chatArray, { role: 'model', text: `❌ Setup Error: ${data.error} Please ensure you added GEMINI_API_KEY to your Vercel Environment variables!` }]);
        return;
      }

      const modelReply = data.text.trim();
      
      // Try to parse if it is the structured JSON output signalling automation
      try {
        let cleanedReply = modelReply.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstBrace = cleanedReply.indexOf('{');
        const lastBrace = cleanedReply.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanedReply = cleanedReply.substring(firstBrace, lastBrace + 1);
        }

        const payload = JSON.parse(cleanedReply);
        if (payload.status === 'ready' && payload.testId && payload.parameters) {
          const testName = testsConfig.flatMap(c => c.tests).find(t => t.id === payload.testId)?.name || payload.testId;
          const paramString = Object.entries(payload.parameters).map(([k, v]) => `• ${k}: ${v}`).join('\n');
          const calcGoal = payload.calculation_mode === 'power' ? 'Statistical Power' : 'Required Sample Size';
          
          setHistory([...chatArray, { 
            role: 'model', 
            text: `### Test Selected: **${testName}**\n\n**Calculation Goal:** ${calcGoal}\n\n**Reasoning:**\n${payload.reasoning}\n\n[📖 Official pwrSS Vignette Source](${payload.source_link})\n\n**Calculated Parameters:**\n${paramString}\n\nWould you like me to auto-populate the calculator and run the analysis?`,
            payload: payload
          }]);
          return;
        }
      } catch (e) {
        // It's normal conversational text
      }

      setHistory([...chatArray, { role: 'model', text: modelReply }]);
    } catch (err) {
      setHistory([...chatArray, { role: 'model', text: `❌ Network Error: Could not reach the AI Server. Make sure Vercel dev is running.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '650px', padding: '0', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary-color), #d83d95)', color: 'white', padding: '1.5rem', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
        <h2 style={{ margin: 0, color: 'white' }}>✨ AI Study Designer</h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem' }}>Describe your endpoint to automatically populate the exact calculator.</p>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {history.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'var(--surface-color)',
            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
            maxWidth: '85%',
            boxShadow: 'var(--shadow-sm)',
            border: msg.role === 'model' ? '1px solid var(--border-color)' : 'none'
          }}>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.text}</div>
            
            {msg.payload && (
              <button 
                className="btn" 
                onClick={() => navigate(`/test/${msg.payload.testId}`, { state: { prefillParams: { ...msg.payload.parameters, calculation_mode: msg.payload.calculation_mode } } })}
                style={{ marginTop: '1rem', width: 'auto', display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Yes, populate calculator →
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontWeight: '600' }}>Dev Quick Tests:</span>
        {[
          "I'm planning an A/B test for an ecommerce site. Control conversion is 0.05 and the variant is expected to be 0.07. Alpha is 0.05, and I want 80% power.",
          "I need a Two Independent Means T-Test. Our treatment group mean is likely 120 and control is 100. Both standard deviations roughly 25.",
          "Doing a logistic regression. Probability of success at baseline is 0.2 and 0.35 with the predictor. Other predictors explain about 0.1 of variance."
        ].map((prompt, i) => (
          <button 
            key={i} 
            onClick={() => setInputText(prompt)}
            style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--primary-color)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Scenario {i + 1}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            placeholder="E.g., I'm designing an A/B test with conversion rates of 0.4 vs 0.5..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            style={{ flex: 1, padding: '0.875rem 1rem' }}
          />
          <button className="btn" onClick={handleSend} disabled={isLoading || !inputText.trim()} style={{ width: 'auto', padding: '0.875rem 1.5rem' }}>
            Send
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </div>
  );
}
