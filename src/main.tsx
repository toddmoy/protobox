import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@zapier/design-tokens/custom-properties.css'
import '@zapier/design-system/style.css'
import '@zapier/zinnia-icons/style.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
