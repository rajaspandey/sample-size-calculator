import React, { useState, useMemo } from 'react';
import { useWebR } from './webr/WebRContext';
import Sidebar from './components/Sidebar';
import DynamicCalculator from './components/DynamicCalculator';
import { testsConfig } from './config/testsConfig';

function App() {
  const { isReady, isLoading, error, statusText } = useWebR();
  const [activeTestId, setActiveTestId] = useState('ttest-2means');

  const activeTestConfig = useMemo(() => {
    for (const group of testsConfig) {
      const found = group.tests.find(t => t.id === activeTestId);
      if (found) return found;
    }
    return null;
  }, [activeTestId]);

  if (isLoading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>{statusText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loader" style={{ color: '#ef4444' }}>
        <p>Error initializing WebR:</p>
        <pre>{error.message || error.toString()}</pre>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <div className="app-container">
      <Sidebar activeTestId={activeTestId} setActiveTestId={setActiveTestId} />
      <main className="main-content">
        {activeTestConfig ? (
          <DynamicCalculator testConfig={activeTestConfig} />
        ) : (
          <div className="card">Tests definition not found</div>
        )}
      </main>
    </div>
  );
}

export default App;
