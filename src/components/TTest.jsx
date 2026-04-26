import React, { useState } from 'react';
import { useWebR } from '../webr/WebRContext';

const TTest = () => {
  const { webR } = useWebR();
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [mu1, setMu1] = useState(0.5); // equivalent to d
  const [mu2, setMu2] = useState(0);
  const [sd1, setSd1] = useState(1);
  const [sd2, setSd2] = useState(1);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.80);
  const [alternative, setAlternative] = useState("not equal");

  const calculate = async () => {
    setComputing(true);
    setError(null);
    setResult(null);

    try {
      // Build the R command string
      const pwrScript = `
        res <- pwrss::pwrss.t.2means(
          mu1 = ${mu1},
          mu2 = ${mu2},
          sd1 = ${sd1},
          sd2 = ${sd2},
          alpha = ${alpha},
          power = ${power},
          alternative = "${alternative}"
        )
        # Returns an array with [Total N, Achieved Power]
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

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>Independent Samples T-Test</h2>
      
      <div className="grid-2">
        <div className="form-group">
          <label>Expected Mean 1 (or Cohen's d)</label>
          <input type="number" step="0.01" value={mu1} onChange={e => setMu1(parseFloat(e.target.value))} />
          <div className="helper-text">Set Mean 2 = 0 and SDs = 1 to use this as Cohen's d.</div>
        </div>
        <div className="form-group">
          <label>Expected Mean 2</label>
          <input type="number" step="0.01" value={mu2} onChange={e => setMu2(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Standard Deviation 1</label>
          <input type="number" step="0.01" min="0.01" value={sd1} onChange={e => setSd1(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Standard Deviation 2</label>
          <input type="number" step="0.01" min="0.01" value={sd2} onChange={e => setSd2(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Alpha (Type I Error)</label>
          <input type="number" step="0.01" min="0" max="1" value={alpha} onChange={e => setAlpha(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Target Power (1 - Beta)</label>
          <input type="number" step="0.01" min="0" max="1" value={power} onChange={e => setPower(parseFloat(e.target.value))} />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1'}}>
          <label>Alternative Hypothesis</label>
          <select value={alternative} onChange={e => setAlternative(e.target.value)}>
            <option value="not equal">Not Equal (Two-Sided)</option>
            <option value="greater">Greater (One-Sided)</option>
            <option value="less">Less (One-Sided)</option>
          </select>
        </div>
      </div>

      <button className="btn" onClick={calculate} disabled={computing} style={{ marginTop: '1rem' }}>
        {computing ? (
          <><div className="spinner spinner-small"></div> Calculating...</>
        ) : 'Calculate Sample Size'}
      </button>

      {error && <div className="error-box">Error predicting sample size. Please verify your inputs. ({error})</div>}

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

export default TTest;
