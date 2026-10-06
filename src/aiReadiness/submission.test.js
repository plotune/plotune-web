const loadWithEndpoint = (endpoint) => {
  let mod;
  const original = process.env.REACT_APP_AI_READINESS_ENDPOINT;
  if (endpoint === undefined) delete process.env.REACT_APP_AI_READINESS_ENDPOINT;
  else process.env.REACT_APP_AI_READINESS_ENDPOINT = endpoint;
  jest.isolateModules(() => { mod = require('./submission'); });
  if (original === undefined) delete process.env.REACT_APP_AI_READINESS_ENDPOINT;
  else process.env.REACT_APP_AI_READINESS_ENDPOINT = original;
  return mod;
};

const answers = { interfaces: ['peak_pcan'], tools: [], bottlenecks: [], automation: 'partial', otherText: { interfaces: '', tools: '', bottlenecks: '' } };
const result = { score: 80, assessedAreas: 4, totalAreas: 4, confidence: 'high', band: 'strong', areas: {} };
const reply = (status, body) => ({ ok: status >= 200 && status < 300, json: async () => { if (body === undefined) throw new Error('not json'); return body; } });

afterEach(() => { delete global.fetch; });

test('without an endpoint nothing is sent and the status says so', async () => {
  global.fetch = jest.fn();
  const { submitAssessment, isSubmissionConfigured } = loadWithEndpoint(undefined);
  expect(isSubmissionConfigured()).toBe(false);
  expect(await submitAssessment({})).toEqual({ status: 'not_configured' });
  expect(global.fetch).not.toHaveBeenCalled();
});

describe('with an Apps Script endpoint', () => {
  const URL = 'https://script.google.com/macros/s/TEST/exec';

  test('posts the JSON as text/plain (no CORS preflight) and treats {ok:true} as sent', async () => {
    global.fetch = jest.fn().mockResolvedValue(reply(200, { ok: true }));
    const { submitAssessment, buildSubmissionPayload } = loadWithEndpoint(URL);
    const payload = buildSubmissionPayload({ email: ' Eng@Example.com ', answers, result });
    expect(await submitAssessment(payload)).toEqual({ status: 'sent' });

    const [calledUrl, init] = global.fetch.mock.calls[0];
    expect(calledUrl).toBe(URL);
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toMatch(/^text\/plain/);
    const body = JSON.parse(init.body);
    expect(body.email).toBe('Eng@Example.com');
    expect(body.result.score).toBe(80);
    expect(body.website).toBe('');
  });

  test('HTTP 200 with an error body, an HTML page, a non-2xx, or a network failure is NOT "sent"', async () => {
    const { submitAssessment } = loadWithEndpoint(URL);
    global.fetch = jest.fn().mockResolvedValue(reply(200, { ok: false, error: 'server_error' }));
    expect(await submitAssessment({})).toEqual({ status: 'error' });
    global.fetch = jest.fn().mockResolvedValue(reply(200)); // Apps Script error pages are HTML, not JSON
    expect(await submitAssessment({})).toEqual({ status: 'error' });
    global.fetch = jest.fn().mockResolvedValue(reply(500, { ok: true }));
    expect(await submitAssessment({})).toEqual({ status: 'error' });
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    expect(await submitAssessment({})).toEqual({ status: 'error' });
  });

  test('the honeypot value is carried in the payload', () => {
    const { buildSubmissionPayload } = loadWithEndpoint(URL);
    expect(buildSubmissionPayload({ email: 'a@b.co', answers, result, website: 'http://spam' }).website).toBe('http://spam');
  });
});

test('email validation catches typos but not valid addresses', () => {
  const { isValidEmail } = loadWithEndpoint(undefined);
  ['name@company.com', ' a.b+c@sub.example.org '].forEach((e) => expect(isValidEmail(e)).toBe(true));
  ['nope', 'a@b', 'a@b.c', '@x.com', 'a b@c.com'].forEach((e) => expect(isValidEmail(e)).toBe(false));
});

test('submission ids are unique and carried in the payload', () => {
  const { newSubmissionId, buildSubmissionPayload } = loadWithEndpoint(undefined);
  const a = newSubmissionId(); const b = newSubmissionId();
  expect(a).toBeTruthy(); expect(a).not.toBe(b);
  expect(buildSubmissionPayload({ email: 'a@b.co', answers, result, submissionId: a }).submissionId).toBe(a);
});

test('a lead carries the visit attribution even when submitted away from the landing page', () => {
  const { buildSubmissionPayload } = loadWithEndpoint(undefined);
  const attribution = require('../utils/attribution');
  attribution.resetAttributionCache();
  window.sessionStorage.clear();
  attribution.captureAttribution({ pathname: '/nexus/', search: '?gad_source=5&gad_campaignid=24328199458&gclid=abc' });
  window.history.pushState({}, '', '/contact');
  const { attribution: a } = buildSubmissionPayload({ email: 'a@b.co', answers, result });
  expect(a).toMatchObject({ platform: 'google_ads', gad_campaignid: '24328199458', gclid: 'abc', ad_landing_path: '/nexus/', landing_path: '/contact' });
});
