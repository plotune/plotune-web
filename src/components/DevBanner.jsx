import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const DevBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  // Define routes where DevBanner should be shown
  const showOnRoutes = [
    '/docs',
    '/dns',
    '/legal',
    "/partner-portal"
  ];

  // Don't show if not in the allowed routes
  if (!showOnRoutes.includes(location.pathname)) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <button
      type="button"
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        backgroundColor: "#ffcc00",
        color: "#000",
        padding: "6px 12px",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        zIndex: 1100,
        fontSize: "13px",
        cursor: "pointer",
      }}
      onClick={() => setIsVisible(false)}
      title="Click to dismiss"
      aria-label="Dismiss preview notice"
    >
      Preview build — some features may be incomplete
    </button>
  );
};

export default DevBanner;