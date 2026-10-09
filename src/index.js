import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { prepareInitialRoute } from './App';
import initializePostHog from './posthog';
import { initializeWebMCP } from './agents/webmcp';

initializePostHog();
initializeWebMCP();
const root = ReactDOM.createRoot(document.getElementById('root'));
// Keep the static route content visible while its code is fetched.
prepareInitialRoute(window.location.pathname).finally(() => root.render(<App />));
