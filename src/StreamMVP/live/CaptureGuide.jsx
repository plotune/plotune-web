import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { CAPTURE_LANGUAGES, EXAMPLE_NOTES, captureExample } from "./examples";

export default function CaptureGuide({ apiKey, origin = "https://stream.plotune.net", compact = false }) {
  const [language, setLanguage] = useState("curl");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const snippet = captureExample(language, apiKey || "YOUR_PROJECT_KEY", origin);
  return (
    <div className={`mvp-integration ${compact ? "compact" : ""}`}>
      <div className="mvp-example-heading">
        <strong>Send an event over HTTP</strong>
        <span>From your device, test bench, or simulation. Your own event names and properties.</span>
      </div>
      <div className="sw-tabs" role="group" aria-label="Integration language">
        {CAPTURE_LANGUAGES.map((item) => (
          <button key={item} aria-pressed={language === item} className={language === item ? "active" : ""}
            onClick={() => { setLanguage(item); setCopied(""); setError(""); }}>{item}</button>
        ))}
      </div>
      <p className="mvp-contract-note">{EXAMPLE_NOTES[language]}</p>
      <div className="mvp-snippet">
        <button className="sw-button mvp-copy-code" aria-label="Copy integration snippet" onClick={async () => {
          try { await navigator.clipboard.writeText(snippet); setCopied(snippet); setError(""); }
          catch { setError("Copy failed. Select the example to copy it manually."); }
        }}><FiCopy />{copied === snippet ? "Copied" : "Copy"}</button>
        <pre className="sw-code" tabIndex={0} aria-label={`${language} integration snippet`}>{snippet}</pre>
      </div>
      {error && <p role="alert">{error}</p>}
      {copied === snippet && <span className="live-sr-only" role="status">Example copied</span>}
      <p className="mvp-contract-note">
        {apiKey ? "This example uses your project key. Keep it private." : "Replace YOUR_PROJECT_KEY with your stored key."}
        {" "}A successful capture returns HTTP 201. Open Events and load the new events when they appear.
      </p>
    </div>
  );
}
