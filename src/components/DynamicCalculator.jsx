import React, { useState, useEffect } from 'react';
import { useWebR } from '../webr/WebRContext';

const DynamicCalculator = ({ testConfig }) => {
  const { webR } = useWebR();
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Initialize form state with default values from config
  const [formState, setFormState] = useState({});

  useEffect(() => {
    // Reset state & result when a new test is loaded
    const initial = {};
    if (testConfig && testConfig.args) {
      testConfig.args.forEach(arg => {
        initial[arg.name] = arg.default;
      });
    }
    setFormState(initial);
    setResult(null);
    setError(null);
  }, [testConfig]);

  const handleChange = (name, value, type) => {
    setFormState(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const calculate = async () => {
    setComputing(true);
    setError(null);
    setResult(null);

    try {
      // Build the R command string arguments
      const params = [];
      Object.keys(formState).forEach(key => {
        const val = formState[key];
        const argDef = testConfig.args.find(a => a.name === key);
        if (argDef) {
          if (argDef.type === 'select' || argDef.type === 'string') {
            params.push(`${key} = "${val}"`);
          } else {
            params.push(`${key} = ${val}`);
          }
        }
      });

      const pwrScript = `
        res <- ${testConfig.func}(
          ${params.join(', ')}
        )
        c(sum(res$n), as.numeric(res$power))
      `;

      const evalResponse = await webR.evalR(pwrScript);
      const output = await evalResponse.toArray();
      
      setResult({
        totalN: output[0],
        achievedPower: output[1]
      });
      
    } catch (err) {
      setError(err.toString());
      console.error(err);
    } finally {
      setComputing(false);
    }
  };

  if (!testConfig) return null;

  return (
    <div className="card" key={testConfig.id}>
      <h2 style={{ marginBottom: '0.5rem' }}>{testConfig.name}</h2>
      
      {testConfig.docs && <p style={{ marginBottom: testConfig.resource ? '0.75rem' : '1.5rem', color: 'var(--text-secondary)' }}>{testConfig.docs}</p>}
      
      {testConfig.resource && (
        <a 
          href={testConfig.resource} 
          target="_blank" 
          rel="noreferrer" 
          style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}
        >
          Learn more about this statistical test →
        </a>
      )}
      
      <div className="grid-2">
        {testConfig.args.map(arg => {
          // power parameter can optionally be full width or default UI
          const isSelect = arg.type === 'select';
          const isFullWidth = isSelect || arg.name === 'alternative';

          return (
            <div className="form-group" style={isFullWidth ? { gridColumn: '1 / -1' } : {}} key={arg.name}>
              <label>{arg.label}</label>
              {isSelect ? (
                <select 
                  value={formState[arg.name] || ''} 
                  onChange={e => handleChange(arg.name, e.target.value, arg.type)}
                >
                  {arg.options.map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="number" 
                  step={arg.step || "any"} 
                  value={formState[arg.name] ?? ''} 
                  onChange={e => handleChange(arg.name, e.target.value, arg.type)} 
                />
              )}
            </div>
          );
        })}
      </div>

      <button className="btn" onClick={calculate} disabled={computing} style={{ marginTop: '1rem' }}>
        {computing ? (
          <><div className="spinner spinner-small"></div> Calculating...</>
        ) : 'Calculate Sample Size'}
      </button>

      {error && <div className="error-box">Error predicting sample size. Please verify your inputs.<br/><small>({error})</small></div>}

      {result && !error && (
        <div className="result-box">
          <div className="result-label">Required Total Sample Size</div>
          <div className="result-number">{Math.ceil(result.totalN || 0)}</div>
          <div className="result-subtext">Achieved Power: {(result.achievedPower || 0).toFixed(4)}</div>
        </div>
      )}
    </div>
  );
};

export default DynamicCalculator;
