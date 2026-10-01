/**
 * Plotune AI Readiness: lead collector (Google Apps Script web app)
 *
 * What it does, for every submission from https://www.plotune.net/ai-readiness:
 *   1. Adds one row to the "Leads" tab of the Google Sheet this script is attached to.
 *   2. Emails NOTIFY_EMAIL a summary (Reply goes straight to the visitor).
 *   3. Optionally emails the visitor a short confirmation (SEND_CONFIRMATION_TO_VISITOR).
 *
 * The lead is saved FIRST. If an email fails (quota, typo), the row is still there and the
 * visitor still sees success. The only thing that makes the site show an error is not being
 * able to save the row.
 *
 * Setup steps are in the chat message that came with this file. To change settings later,
 * edit the three constants below, then Deploy > Manage deployments > pencil > Version: New
 * version > Deploy (editing the code alone does NOT update the live web app).
 */

// ---- Settings you may want to change ---------------------------------------------------
const NOTIFY_EMAIL = 'contact@plotune.net';       // who gets "new lead" emails
const SEND_CONFIRMATION_TO_VISITOR = true;        // false = only you are emailed
const SHEET_NAME = 'Leads';                       // tab name (created automatically)
// -----------------------------------------------------------------------------------------

const MAX_BODY_CHARS = 20000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const HEADERS = [
  'Received at', 'Email', 'Score %', 'Areas assessed', 'Confidence', 'Band',
  'Interfaces', 'Tools', 'Bottlenecks', 'Automation',
  'Interfaces (other, typed)', 'Tools (other, typed)', 'Bottlenecks (other, typed)',
  'Entry source', 'UTM source', 'UTM medium', 'UTM campaign', 'Referrer',
  'Assessment version', 'Scoring version', 'Raw JSON',
];

/** Opening the web app URL in a browser lands here: a quick "is it deployed?" check. */
function doGet() {
  return json_({ ok: true, service: 'plotune-ai-readiness-leads' });
}

/** The website posts here. */
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length === 0 || raw.length > MAX_BODY_CHARS) return json_({ ok: false, error: 'bad_size' });

    const data = JSON.parse(raw);

    // Hidden "website" field on the form: real people never fill it, bots do. Pretend success.
    if (data.website) return json_({ ok: true });

    const email = clean_(data.email, 254).toLowerCase();
    if (!EMAIL_RE.test(email)) return json_({ ok: false, error: 'invalid_email' });

    const lead = toLead_(data, email);
    saveLead_(lead, raw);          // if this throws, the site shows an error (nothing was saved)
    notifyOwner_(lead);            // these two never fail the request
    confirmVisitor_(lead);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

// ---- Building and saving the lead ------------------------------------------------------

function toLead_(data, email) {
  const answers = data.answers || {};
  const other = answers.otherText || {};
  const result = data.result || {};
  const attr = data.attribution || {};
  const versions = data.versions || {};
  return {
    receivedAt: new Date(),
    email: email,
    score: toInt_(result.score),
    assessed: toInt_(result.assessedAreas),
    total: toInt_(result.totalAreas) || 4,
    confidence: clean_(result.confidence, 20),
    band: clean_(result.band, 30),
    interfaces: list_(answers.interfaces),
    tools: list_(answers.tools),
    bottlenecks: list_(answers.bottlenecks),
    automation: clean_(answers.automation, 30),
    otherInterfaces: clean_(other.interfaces, 200),
    otherTools: clean_(other.tools, 200),
    otherBottlenecks: clean_(other.bottlenecks, 200),
    entrySource: clean_(attr.entry_source, 80),
    utmSource: clean_(attr.utm_source, 80),
    utmMedium: clean_(attr.utm_medium, 80),
    utmCampaign: clean_(attr.utm_campaign, 120),
    referrer: clean_(attr.referrer, 300),
    assessmentVersion: clean_(versions.assessment, 20),
    scoringVersion: clean_(versions.scoring, 20),
  };
}

function saveLead_(lead, raw) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    sheet.appendRow([
      lead.receivedAt, sheetSafe_(lead.email), lead.score, lead.assessed + ' of ' + lead.total,
      lead.confidence, lead.band, lead.interfaces, lead.tools, lead.bottlenecks, lead.automation,
      sheetSafe_(lead.otherInterfaces), sheetSafe_(lead.otherTools), sheetSafe_(lead.otherBottlenecks),
      sheetSafe_(lead.entrySource), sheetSafe_(lead.utmSource), sheetSafe_(lead.utmMedium),
      sheetSafe_(lead.utmCampaign), sheetSafe_(lead.referrer),
      lead.assessmentVersion, lead.scoringVersion, sheetSafe_(raw.slice(0, 5000)),
    ]);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// ---- Emails ----------------------------------------------------------------------------

function notifyOwner_(lead) {
  try {
    const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: lead.email,
      name: 'Plotune AI Readiness',
      subject: 'New AI readiness lead: ' + lead.email + ' (' + lead.score + '%)',
      body: [
        'New request for a detailed AI Test Readiness assessment.',
        '',
        'Email:            ' + lead.email,
        'Score:            ' + lead.score + '%  (' + lead.assessed + ' of ' + lead.total + ' areas assessed, confidence ' + lead.confidence + ')',
        '',
        'Interfaces:       ' + lead.interfaces + (lead.otherInterfaces ? '  | other: ' + lead.otherInterfaces : ''),
        'Tools:            ' + lead.tools + (lead.otherTools ? '  | other: ' + lead.otherTools : ''),
        'Bottlenecks:      ' + lead.bottlenecks + (lead.otherBottlenecks ? '  | other: ' + lead.otherBottlenecks : ''),
        'Automation:       ' + lead.automation,
        '',
        'Entry source:     ' + lead.entrySource,
        'UTM:              ' + [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(String).join(' / '),
        'Referrer:         ' + lead.referrer,
        '',
        'All leads: ' + sheetUrl,
        '',
        'Hit Reply to write to the visitor directly.',
      ].join('\n'),
    });
  } catch (err) {
    console.error('notifyOwner_ failed: ' + err);
  }
}

function confirmVisitor_(lead) {
  if (!SEND_CONFIRMATION_TO_VISITOR) return;
  try {
    // At most one confirmation per address per 6 hours (the longest CacheService allows), so
    // nobody can use the form to make us repeatedly email a third party.
    const cache = CacheService.getScriptCache();
    const key = 'confirmed:' + lead.email;
    if (cache.get(key)) return;
    cache.put(key, '1', 21600);

    MailApp.sendEmail({
      to: lead.email,
      replyTo: NOTIFY_EMAIL,
      name: 'Plotune',
      subject: 'Your AI Test Readiness result: ' + lead.score + '%',
      body: [
        'Hi,',
        '',
        'Thanks for taking the Plotune AI Test Readiness assessment.',
        '',
        'Your result: ' + lead.score + '% AI-ready (' + lead.assessed + ' of ' + lead.total + ' areas assessed).',
        '',
        'We received your request for the detailed assessment. Our team will review your answers and email it to you from this address. If you would like to add anything about your test setup, just reply to this email.',
        '',
        'The Plotune team',
        'https://www.plotune.net',
      ].join('\n'),
    });
  } catch (err) {
    console.error('confirmVisitor_ failed: ' + err);
  }
}

// ---- Small helpers ---------------------------------------------------------------------

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, max) {
  return (typeof value === 'string' ? value : value == null ? '' : String(value)).trim().slice(0, max);
}

function list_(value) {
  return Array.isArray(value) ? value.slice(0, 20).map(function (v) { return clean_(v, 40); }).join(', ') : '';
}

function toInt_(value) {
  const n = Number(value);
  return isFinite(n) ? Math.round(n) : '';
}

/** Stops text typed by a visitor from being treated as a spreadsheet formula (=, +, -, @). */
function sheetSafe_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

// ---- One-time test (run from the editor; see setup steps) ------------------------------

/**
 * Pretends to be a visitor submission. Running it once (a) makes Google ask you for the
 * permissions the script needs, and (b) proves the whole chain works: you should see a "Leads"
 * tab with one TEST row and receive two emails at NOTIFY_EMAIL. Delete the TEST row afterwards.
 */
function runTest() {
  const sample = {
    email: NOTIFY_EMAIL,
    answers: {
      interfaces: ['peak_pcan', 'other'], tools: ['python_scripts'], bottlenecks: ['setup'], automation: 'partial',
      otherText: { interfaces: 'TEST custom UART rig', tools: '', bottlenecks: '' },
    },
    result: { score: 77, assessedAreas: 4, totalAreas: 4, confidence: 'high', band: 'strong' },
    attribution: { entry_source: 'TEST', utm_source: 'test', referrer: '' },
    versions: { assessment: 'v1', scoring: 'v1' },
  };
  const out = doPost({ postData: { contents: JSON.stringify(sample) } });
  Logger.log(out.getContent());
}
