// jsdom (CRA jest environment) lacks the Web Streams globals that react-router
// v7 references at module scope — polyfill them for all tests.
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
