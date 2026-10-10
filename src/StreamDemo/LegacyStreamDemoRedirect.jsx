import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Temporary client compatibility only, never a permanent HTTP redirect. Replace this
// route element when the real workspace ships; preserve existing bookmarked demo state.
export default function LegacyStreamDemoRedirect() {
  const { search, hash } = useLocation();
  return <Navigate replace to={{ pathname: '/stream/demo', search, hash }} />;
}
