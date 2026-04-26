import React, { useState } from 'react';
import { useWebR } from '../webr/WebRContext';

const ZTest = () => {
  const { webR } = useWebR();
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [p1, setP1] = useState(0.50);
  const [p2, setP2] = useState(0.40);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.80);
  const [alternative, setAlternative] = useState("not equal");

  const calculate = async () => {
    setComputing(true);
    setError(null);
    setResult(null);

    try {
      const pwrScript = `
        res <- pwrss::pwrss.z.2props(
          p1 = ${p1},
          p2 = ${p2},
          alpha = ${alpha},
          power = ${power},
          alternative = "${alternative}"
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

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>Independent Proportions Z-Test</h2>
      
      <div className="grid-2">
        <div className="form-group">
          <label>Expected Proportion 1 (p1)</label>
          <input type="number" step="0.01" min="0" max="1" value={p1} onChange={e => setP1(parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Expected Proportion 2 (p2)</label>
          <input type="number" step="0.01" min="0" max="1" value={p2} onChange={e => setP2(parseFloat(e.target.value))} />
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

export default ZTest;
