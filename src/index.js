import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import initializePostHog from './posthog';
import { initializeWebMCP } from './agents/webmcp';

initializePostHog();
initializeWebMCP();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
