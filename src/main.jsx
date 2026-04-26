import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WebRProvider } from './webr/WebRContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebRProvider>
      <App />
    </WebRProvider>
  </StrictMode>,
)
