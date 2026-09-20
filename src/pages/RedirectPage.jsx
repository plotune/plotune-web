import React, { useEffect, useState } from 'react';

const RedirectPage = ({ url }) => {
  const [hostname, setHostname] = useState(null);

  useEffect(() => {
    try {
      setHostname(new URL(url).hostname);
    } catch (err) {
      console.error('Invalid redirect URL:', err);
    }

    const timer = setTimeout(() => {
      window.location.href = url;
    }, 1500);

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="min-h-screen bg-dark-bg text-light-text flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">
          {hostname ? `Taking you to ${hostname}…` : 'Taking you to your destination…'}
        </p>
        <a
          href={url}
          className="inline-flex items-center min-h-[44px] px-6 py-2.5 mt-4 text-primary hover:underline"
        >
          Go there now
        </a>
      </div>
    </div>
  );
};

export default RedirectPage;
