import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useWebR } from './webr/WebRContext';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import DynamicCalculator from './components/DynamicCalculator';
import { testsConfig } from './config/testsConfig';

function CalculatorWrapper() {
  const { testId } = useParams();
  const location = useLocation();

  const activeTestConfig = useMemo(() => {
    for (const group of testsConfig) {
      const found = group.tests.find(t => t.id === testId);
      if (found) return found;
    }
    return null;
  }, [testId]);

  if (!activeTestConfig) return <div className="card">Tests definition not found</div>;
  return <DynamicCalculator testConfig={activeTestConfig} prefillParams={location.state?.prefillParams} />;
}

function App() {
  const { isReady, isLoading, error, statusText } = useWebR();

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
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/ai-assistant" replace />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/test/:testId" element={<CalculatorWrapper />} />
            <Route path="*" element={<Navigate to="/ai-assistant" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
