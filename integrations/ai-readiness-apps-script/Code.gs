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
const MAX_CONFIRMATIONS_PER_HOUR = 20;  // global cap: the endpoint is public, so it must not be
                                        // usable to make us email arbitrary addresses at volume
const DEDUPE_SECONDS = 21600;           // CacheService maximum (6 h)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const HEADERS = [
  'Received at', 'Email', 'Score %', 'Areas assessed', 'Confidence', 'Band',
  'Interfaces', 'Tools', 'Bottlenecks', 'Automation',
  'Interfaces (other, typed)', 'Tools (other, typed)', 'Bottlenecks (other, typed)',
  'Entry source', 'UTM source', 'UTM medium', 'UTM campaign', 'Referrer',
  'Assessment version', 'Scoring version', 'Raw JSON',
  // Added after the first deployment -- new columns only ever go at the END so existing rows
  // keep lining up with their headers.
  'Submission ID', 'UTM content', 'UTM term', 'LinkedIn click id', 'Emails',
];
const EMAILS_COLUMN = HEADERS.length; // 1-based index of the 'Emails' status column

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
    const row = saveLead_(lead, raw);  // if this throws, the site shows an error (nothing was saved)
    if (row === 0) return json_({ ok: true }); // duplicate of a submission already saved (a retry)

    // These never fail the request; their outcome is written to the row's 'Emails' column.
    const owner = notifyOwner_(lead);
    const visitor = confirmVisitor_(lead);
    recordEmailStatus_(row, 'owner: ' + owner + ' / visitor: ' + visitor);

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
    submissionId: clean_(data.submissionId, 64),
    utmContent: clean_(attr.utm_content, 120),
    utmTerm: clean_(attr.utm_term, 120),
    liFatId: clean_(attr.li_fat_id, 300),
  };
}

/** Appends the lead and returns its row number, or 0 if this submission was already saved. */
function saveLead_(lead, raw) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // The site re-sends the same submissionId when a visitor retries after a slow reply, so a
    // retry of a lead that was in fact saved doesn't create a second row and second emails.
    const cache = CacheService.getScriptCache();
    const dedupeKey = lead.submissionId ? 'sub:' + hashKey_(lead.submissionId) : '';
    if (dedupeKey && cache.get(dedupeKey)) return 0;

    const sheet = getSheet_();
    const cells = [
      lead.receivedAt, lead.email, lead.score, lead.assessed + ' of ' + lead.total,
      lead.confidence, lead.band, lead.interfaces, lead.tools, lead.bottlenecks, lead.automation,
      lead.otherInterfaces, lead.otherTools, lead.otherBottlenecks,
      lead.entrySource, lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.referrer,
      lead.assessmentVersion, lead.scoringVersion, raw.slice(0, 5000),
      lead.submissionId, lead.utmContent, lead.utmTerm, lead.liFatId, 'sending…',
    ];
    // EVERY text cell is neutralised: all of it arrives from a public endpoint, and appendRow
    // would otherwise evaluate a value like =IMPORTXML(...) as a live formula in this sheet.
    sheet.appendRow(cells.map(function (v) { return typeof v === 'string' ? sheetSafe_(v) : v; }));
    const row = sheet.getLastRow();
    if (dedupeKey) cache.put(dedupeKey, '1', DEDUPE_SECONDS);
    return row;
  } finally {
    lock.releaseLock();
  }
}

function recordEmailStatus_(row, text) {
  try {
    getSheet_().getRange(row, EMAILS_COLUMN).setValue(text);
  } catch (err) {
    console.error('recordEmailStatus_ failed: ' + err);
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
  } else if (sheet.getLastColumn() < HEADERS.length) {
    // Sheet created by an earlier version of this script: add the newer column headers.
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  }
  return sheet;
}

// ---- Emails ----------------------------------------------------------------------------

/** Returns 'sent' or 'failed'. */
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
    return 'sent';
  } catch (err) {
    console.error('notifyOwner_ failed: ' + err);
    return 'failed';
  }
}

/** Returns 'sent', 'off', 'skipped (...)' or 'failed'. */
function confirmVisitor_(lead) {
  if (!SEND_CONFIRMATION_TO_VISITOR) return 'off';
  try {
    // Abuse limits (the endpoint is public, so anyone could script it to make us email others):
    //  - at most one confirmation per mailbox per 6 h; name+tag@x and name@x count as one mailbox,
    //  - at most MAX_CONFIRMATIONS_PER_HOUR confirmations in total per hour.
    // Your own notification is always sent, so a skipped confirmation never hides a lead.
    const cache = CacheService.getScriptCache();
    const mailboxKey = 'confirmed:' + hashKey_(lead.email.replace(/\+[^@]*@/, '@'));
    if (cache.get(mailboxKey)) return 'skipped (already confirmed recently)';
    const hourKey = 'confirmations:' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
    const sentThisHour = Number(cache.get(hourKey) || 0);
    if (sentThisHour >= MAX_CONFIRMATIONS_PER_HOUR) return 'skipped (hourly limit)';
    cache.put(hourKey, String(sentThisHour + 1), 3600);
    cache.put(mailboxKey, '1', DEDUPE_SECONDS);

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
    return 'sent';
  } catch (err) {
    console.error('confirmVisitor_ failed: ' + err);
    return 'failed';
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

/** Short, fixed-length cache key (CacheService keys are limited to 250 characters). */
function hashKey_(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value));
}

/** Stops text typed by a visitor from being treated as a spreadsheet formula (=, +, -, @). */
function sheetSafe_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

// ---- One-time test (run from the editor; see setup steps) ------------------------------

/**
 * Pretends to be a visitor submission. Running it once (a) makes Google ask you for the
 * permissions the script needs, and (b) proves the whole chain works: you should see a "Leads"
 * tab with one TEST row and receive two emails at NOTIFY_EMAIL (the visitor confirmation is
 * skipped if that address already got one in the last 6 hours -- see the row's 'Emails' column).
 * Delete the TEST row afterwards.
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
    submissionId: 'test-' + new Date().getTime(),
  };
  const out = doPost({ postData: { contents: JSON.stringify(sample) } });
  Logger.log(out.getContent());
}
