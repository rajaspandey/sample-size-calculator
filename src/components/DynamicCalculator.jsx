import React, { useState, useEffect } from 'react';
import { useWebR } from '../webr/WebRContext';

const DynamicCalculator = ({ testConfig, prefillParams }) => {
  const { webR } = useWebR();
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [calcMode, setCalcMode] = useState('sample_size');
  
  // Initialize form state with default values from config
  const [formState, setFormState] = useState({});

  useEffect(() => {
    // Reset state & result when a new test is loaded
    const initial = { ...prefillParams };
    if (testConfig && testConfig.args) {
      testConfig.args.forEach(arg => {
        if (initial[arg.name] === undefined) {
          initial[arg.name] = arg.default;
        }
      });
      const nParamName = testConfig.nParam || "n";
      if (initial[nParamName] === undefined) {
        initial[nParamName] = 100;
      }
    }
    setFormState(initial);
    if (prefillParams && prefillParams.calculation_mode) {
      setCalcMode(prefillParams.calculation_mode);
    }
    setResult(null);
    setError(null);
  }, [testConfig?.id, prefillParams]);

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
      // Build the R command string arguments based on the toggle!
      let renderArgs = testConfig ? [...testConfig.args] : [];
      const nParamName = testConfig?.nParam || "n";

      if (calcMode === 'power') {
        renderArgs = renderArgs.filter(a => a.name !== 'power');
        renderArgs.push({ name: nParamName, type: "number" });
      } else {
        renderArgs = renderArgs.filter(a => a.name !== nParamName);
      }

      const params = [];
      Object.keys(formState).forEach(key => {
        const val = formState[key];
        const argDef = renderArgs.find(a => a.name === key);
        if (argDef) {
          if (argDef.type === 'select' || argDef.type === 'string') {
            params.push(`${key} = "${val}"`);
          } else if (argDef.type === 'raw') {
            let v = String(val).trim();
            // Automatically patch R concatenation bounds if user just types comma-separated inputs
            if (v.includes(',') && !v.match(/^[a-zA-Z]/)) {
              v = `c(${v})`;
            }
            params.push(`${key} = ${v}`);
          } else {
            params.push(`${key} = ${val}`);
          }
        }
      });

      const pwrScript = `
        res <- ${testConfig.func}(
          ${testConfig.id === 'ttest-paired' ? 'paired = TRUE, ' : ''}${params.join(', ')}
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

  let renderArgs = testConfig ? [...testConfig.args] : [];
  const nParamName = testConfig?.nParam || "n";

  if (calcMode === 'power') {
    renderArgs = renderArgs.filter(a => a.name !== 'power');
    const powerIndex = testConfig.args.findIndex(a => a.name === 'power');
    if (powerIndex > -1) {
      renderArgs.splice(powerIndex, 0, { name: nParamName, label: "Total Sample Size (n)", type: "number", step: "1", default: 100 });
    }
  } else {
    renderArgs = renderArgs.filter(a => a.name !== nParamName);
  }

  return (
    <div className="card" key={testConfig.id}>
      <h2 style={{ marginBottom: '0.5rem' }}>{testConfig.name}</h2>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.875rem' }}>Calculate:</strong>
        <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
          <input type="radio" name="calcMode" value="sample_size" checked={calcMode === 'sample_size'} onChange={() => { setCalcMode('sample_size'); setResult(null); }} />
          Sample Size
        </label>
        <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
          <input type="radio" name="calcMode" value="power" checked={calcMode === 'power'} onChange={() => { setCalcMode('power'); setResult(null); }} />
          Statistical Power
        </label>
      </div>

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
        {renderArgs.map(arg => {
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
              ) : arg.type === 'raw' ? (
                <input 
                  type="text" 
                  value={formState[arg.name] || ''} 
                  onChange={e => handleChange(arg.name, e.target.value, arg.type)} 
                  placeholder={arg.default}
                />
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
        ) : calcMode === 'sample_size' ? 'Calculate Sample Size' : 'Calculate Power'}
      </button>

      {error && <div className="error-box">Error predicting outcome. Please verify your inputs.<br/><small>({error})</small></div>}

      {result && !error && (
        <div className="result-box">
          <div className="result-label">{calcMode === 'sample_size' ? 'Required Total Sample Size' : 'Achieved Statistical Power'}</div>
          <div className="result-number">{calcMode === 'sample_size' ? Math.ceil(result.totalN || 0) : (result.achievedPower || 0).toFixed(4)}</div>
          <div className="result-subtext">
            {calcMode === 'sample_size' ? `Achieved Power: ${(result.achievedPower || 0).toFixed(4)}` : `Provided Sample Size: ${Math.ceil(formState[nParamName] || 0)}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicCalculator;
