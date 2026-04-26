import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebR } from 'webr';

const WebRContext = createContext(null);

export const WebRProvider = ({ children }) => {
  const [webR, setWebR] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusText, setStatusText] = useState('Initializing WebR...');

  useEffect(() => {
    let active = true;

    const initWebR = async () => {
      try {
        const _webR = new WebR();
        await _webR.init();
        
        if (active) {
          setStatusText('Downloading pwrss package...');
          // webr::install downloads packages from webr repo
          await _webR.evalRVoid(`webr::install("pwrss")`);
          setStatusText('Loading pwrss package...');
          await _webR.evalRVoid(`library(pwrss)`);
          
          console.log("WebR and pwrss initialized successfully!");
          
          setWebR(_webR);
          setIsReady(true);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to initialize WebR:", err);
          setError(err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    initWebR();

    return () => {
      active = false;
    };
  }, []);

  return (
    <WebRContext.Provider value={{ webR, isReady, isLoading, error, statusText }}>
      {children}
    </WebRContext.Provider>
  );
};

export const useWebR = () => useContext(WebRContext);
