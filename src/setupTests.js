// React only flushes effects synchronously inside act() when it recognizes the test
// environment as a "concurrent act environment" (globalThis.IS_REACT_ACT_ENVIRONMENT ===
// true). Without this, act() can return before a component's useEffect has actually run,
// so anything set up inside an effect (an event listener, a setTimeout) may not exist yet
// when the test proceeds -- an intermittent, order-dependent failure, not a real bug in the
// component under test. @testing-library/react sets this automatically; this project uses
// react-dom/test-utils directly, so it needs setting explicitly, once, for every test file.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom (CRA jest environment) lacks the Web Streams globals that react-router
// v7 references at module scope — polyfill them for all tests.
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
