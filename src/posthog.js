const posthogModule = require('posthog-js');
const posthog = posthogModule.default || posthogModule;

function initializePostHog() {
  posthog.init('phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
  });
}

module.exports = initializePostHog;
