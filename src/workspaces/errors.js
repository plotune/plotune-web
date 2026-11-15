// Plain-language messages for failures from the workspace API. Raw codes and server strings
// never reach a card; a form may show the API's own validation message (422) next to its field.
const BY_CODE = {
  revision_conflict: 'This workspace changed while you were working. We loaded the latest version; review it and try again.',
  workspace_limit: 'You have reached the limit for workspaces on this account.',
  project_limit: 'This workspace has reached its limit of projects.',
  member_limit: 'This workspace has reached its limit of people.',
  invite_limit: 'This workspace has too many pending invitations.',
  workspace_not_empty: 'Delete every project in this workspace first.',
  service_not_enabled: 'That service is not turned on for this project.',
  unknown_service: 'That service is not available.',
  csrf: 'This page expired. Reload it and try again.',
};

export function failureMessage(failure, { fallback = 'Something went wrong. Try again.' } = {}) {
  if (!failure) return fallback;
  const { status, code } = failure;
  if (status === 0) return 'Plotune could not be reached. Check your connection and try again.';
  if (BY_CODE[code]) return BY_CODE[code];
  if (status === 403) return 'You do not have permission to do that. Your role may have changed.';
  if (status === 404) return 'We could not find that. It may have been removed, or you may not have access.';
  if (status === 409) return 'That conflicts with the current state. Reload and try again.';
  if (status === 413 || status === 415) return 'That request was not accepted. Check the details and try again.';
  if (status === 422) return failure.serverMessage || 'Check the details and try again.';
  if (status === 429) {
    return failure.retryAfter
      ? `Too many requests. Try again in ${failure.retryAfter} seconds.`
      : 'Too many requests. Wait a moment and try again.';
  }
  if (status === 503 || status === 502 || status === 504) return 'Plotune is temporarily unavailable. Try again in a moment.';
  return fallback;
}

// Failures worth offering a retry for (the request itself may be fine).
export const isRetryable = (failure) => !failure || [0, 429, 502, 503, 504].includes(failure.status);
