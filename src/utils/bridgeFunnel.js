import { posthog } from '../posthog';
import { getFunnelContext } from './funnel';

// Funnel analytics for Plotune Home -> Bridge -> Bridge product -> request -> sent. Choices and
// outcomes only: never the email address, the country text or anything the visitor typed.
export const trackBridge = (event, properties = {}) => {
  posthog.capture(event, { ...getFunnelContext(), ...properties });
};
