import React from 'react';

// A small line-icon set for the Bridge pages (24 x 24, stroke = currentColor). Icons replace
// sentences: a visitor who scans, not reads, should still get "remote", "browser", "AI".
export const ICONS = {
  remote: 'M2 9a15 15 0 0 1 20 0 M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M12 19.5h.01',
  browser: 'M3 5h18v14H3z M3 9h18 M6 7h.01 M9 7h.01',
  ai: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z',
  usb: 'M12 3v13 M9 6l3-3 3 3 M12 16m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M12 11l4-2v-2 M12 9l-4-2',
  compact: 'M4 8l8-4 8 4v8l-8 4-8-4z M4 8l8 4 8-4 M12 12v8',
  price: 'M3 12V4h8l10 10-8 8z M7.5 8.5h.01',
  channels: 'M3 8h18 M3 16h18 M6 8h.01 M6 16h.01',
  signal: 'M2 12h4l3-7 4 14 3-7h6',
  sliders: 'M3 6h18 M3 12h18 M3 18h18 M8 4v4 M15 10v4 M6 16v4',
  fixture: 'M9 3v5 M15 3v5 M6 8h12v4a6 6 0 0 1-12 0z M12 18v3',
  modules: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  choose: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  send: 'M3 11l18-8-8 18-2-8z',
  confirm: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6',
};

const BridgeIcon = ({ name, size = 28, className = '' }) => (
  <svg className={`bridge-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={ICONS[name] || ICONS.compact} />
  </svg>
);

export default BridgeIcon;
