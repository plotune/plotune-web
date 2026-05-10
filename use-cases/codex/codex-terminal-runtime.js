const term = () => document.getElementById('term');
let running = false;
let cur = 0;
let renderQueue = Promise.resolve();

const sleep = ms => new Promise(r => setTimeout(r, ms));

const DEMO_PACING = {
  minScenarioMs: 20000,
  minThinkMs: 1150,
  typingPatternMs: [24, 30, 27, 32],
  typingSpaceMs: 18,
  typingPunctuationMs: 96,
  typingSentenceMs: 118,
  spinnerFrameMs: 85,
  spinnerElapsedMs: 260,
  spinnerStopHoldMs: 130,
  toolResultRevealMs: 70,
  toolRowRevealMs: 48,
  commandOutputRevealMs: 90,
  commandRowRevealMs: 58,
};

function normalizeWait(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  if (ms < 400) return Math.max(220, Math.round(ms * 1.45));
  if (ms < 1000) return Math.round(ms * 1.16);
  return Math.round(ms * 1.08);
}

window.DEMO_PACING = DEMO_PACING;
window.rawWait = sleep;
window.flushRenders = function flushRenders() {
  return renderQueue;
};
window.wait = async function wait(ms = 0) {
  await renderQueue;
  return sleep(normalizeWait(Number(ms)));
};

function queueRender(task) {
  const runTask = () => Promise.resolve().then(task);
  renderQueue = renderQueue.then(runTask, runTask);
  return renderQueue;
}

function extractTimingSeconds(args) {
  const text = String(args || '');
  const match = text.match(/(?:duration_seconds|max_runtime_seconds|timeout_seconds|hold_time_seconds)"?\s*[:=]\s*([0-9.]+)/);
  return match ? Number(match[1]) : null;
}

function getToolResultDelayMs(name, args) {
  const toolName = String(name || '');
  const argText = String(args || '');
  const seconds = extractTimingSeconds(argText);
  const hasDurationHint = /duration_seconds|max_runtime_seconds|hold_time_seconds|timeout_seconds/.test(argText);
  const isWaitLike = /^wait_|wait_for_|wait_dbc_signal|wait_uart|wait_measurement/.test(toolName);

  if (isWaitLike) {
    if (seconds !== null && seconds >= 300) return 2800;
    if (seconds !== null && seconds >= 120) return 2400;
    if (seconds !== null && seconds >= 30) return 1900;
    return 1500;
  }

  if (hasDurationHint || /^record_|^run_test_sequence$/.test(toolName)) {
    if (seconds !== null && seconds >= 900) return 2400;
    if (seconds !== null && seconds >= 300) return 2000;
    if (seconds !== null && seconds >= 120) return 1700;
    return 1300;
  }

  return DEMO_PACING.toolResultRevealMs;
}

window.add = function add(cls, html = '') {
  const d = document.createElement('div');
  d.className = 'fd ' + cls;
  d.innerHTML = html;
  term().appendChild(d);
  term().scrollTop = term().scrollHeight;
  return d;
};

window.esc = function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};

window.pretty = function pretty(s) {
  return String(s)
    .replace(/\/var\/lib\/plotune-nexus\/data\/([A-Za-z0-9._-]+)/g, 'data:$1')
    .replace(/\/var\/lib\/plotune-nexus\/recordings\/([A-Za-z0-9._-]+)/g, 'recording:$1')
    .replace(/\/var\/lib\/plotune-nexus\/containers\/([A-Za-z0-9._-]+)/g, 'container:$1')
    .replace(/application\/vnd\.oci\.image\.layer\.v1\.tar/g, 'oci-tar')
    .replace(/\brelated_artifact_ids\b/g, 'evidence_ids')
    .replace(/\bartifact_path\b/g, 'evidence_path')
    .replace(/\bartifact_id\b/g, 'package_id')
    .replace(/\bsource_interface\b/g, 'source_can_interface')
    .replace(/\bdestination_interface\b/g, 'destination_can_interface')
    .replace(/\bcan_interfaces\b/g, 'can_device_access')
    .replace(/\bsocketcan\b/g, 'bench-can');
};

function plainText(value) {
  return window.pretty(String(value))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

window.pauseForRead = function pauseForRead(content, { baseMs = 260, perCharMs = 1.4, capMs = 980 } = {}) {
  const text = plainText(content || '');
  const delay = Math.min(capMs, baseMs + (text.length * perCharMs));
  return sleep(Math.round(delay));
};

window.short = function short(s, max = 160) {
  const text = pretty(s);
  return text.length > max ? text.slice(0, max - 4) + ' ...' : text;
};

window.typeUser = async function typeUser(text) {
  const u = add('lu', '');
  const message = document.createElement('span');
  message.className = 'lu-text';
  const caret = document.createElement('span');
  caret.className = 'cursor input-cursor';
  u.appendChild(message);
  u.appendChild(caret);
  let line = '';
  for (const [index, ch] of Array.from(String(text)).entries()) {
    line += ch;
    message.textContent = line;
    term().scrollTop = term().scrollHeight;
    if (/[.!?]/.test(ch)) {
      await sleep(DEMO_PACING.typingSentenceMs);
      continue;
    }
    if (/[,;:]/.test(ch)) {
      await sleep(DEMO_PACING.typingPunctuationMs);
      continue;
    }
    if (/\s/.test(ch)) {
      await sleep(DEMO_PACING.typingSpaceMs);
      continue;
    }
    await sleep(DEMO_PACING.typingPatternMs[index % DEMO_PACING.typingPatternMs.length]);
  }
  await sleep(80);
  caret.remove();
};

window.spin = function spin(label) {
  const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  let i = 0;
  const startedAt = performance.now();
  const d = add('lspin');
  const sp = document.createElement('span');
  const text = document.createElement('span');
  const meta = document.createElement('span');
  text.className = 'spin-label';
  text.textContent = label;
  meta.className = 'spin-meta';
  sp.textContent = frames[0];
  sp.style.color = '#f9e2af';
  d.appendChild(sp);
  d.appendChild(text);
  d.appendChild(meta);
  const updateMeta = (state = 'running') => {
    const elapsedSeconds = ((performance.now() - startedAt) / 1000).toFixed(1);
    meta.textContent = `${state} · ${elapsedSeconds}s`;
  };
  updateMeta();
  const metaIv = setInterval(() => updateMeta(), DEMO_PACING.spinnerElapsedMs);
  const iv = setInterval(() => sp.textContent = frames[i++ % frames.length], DEMO_PACING.spinnerFrameMs);
  return {
    async stop(state = 'completed') {
      clearInterval(iv);
      clearInterval(metaIv);
      d.classList.add('done');
      sp.textContent = '●';
      sp.style.color = 'var(--green)';
      updateMeta(state);
      await sleep(DEMO_PACING.spinnerStopHoldMs);
    },
  };
};

window.tool = function tool(name, args, res = true) {
  const isRes = res === 'resource';
  const bc = isRes ? 'tbullet res' : 'tbullet';
  const nc = isRes ? 'tname res' : 'tname';
  const blk = add('tb');
  const fullArgs = pretty(args);
  const displayArgs = short(args, 190);
  blk.innerHTML = `<div class="th"><span class="${bc}">●</span><span class="${nc}">${esc(name)}</span><span class="tparen">(</span><span class="targs">${esc(displayArgs)}</span><span class="tparen">)</span></div>`;
  if (displayArgs !== fullArgs) blk.querySelector('.th').title = fullArgs;
  return function addResult(rows) {
    return queueRender(async () => {
      await sleep(getToolResultDelayMs(name, args));
      const wrap = document.createElement('div');
      wrap.className = 'fd tresult';
      blk.appendChild(wrap);
      for (const [index, [g, v, cls = '']] of rows.entries()) {
        const row = document.createElement('div');
        row.className = 'trl';
        row.innerHTML = `<span class="trg">${esc(g)}</span><span class="trv ${esc(cls)}">${esc(short(v, 220))}</span>`;
        wrap.appendChild(row);
        term().scrollTop = term().scrollHeight;
        if (index < rows.length - 1) await sleep(DEMO_PACING.toolRowRevealMs);
      }
    });
  };
};

window.command = function command(text, rows = []) {
  const fullText = String(text);
  const displayText = short(fullText, 110);
  const line = add('cmd', esc(displayText));
  if (displayText !== pretty(fullText)) line.title = pretty(fullText);
  if (rows.length) {
    void queueRender(async () => {
      await sleep(DEMO_PACING.commandOutputRevealMs);
      const out = document.createElement('div');
      out.className = 'fd out';
      line.insertAdjacentElement('afterend', out);
      const renderedRows = [];
      for (const [index, row] of rows.entries()) {
        renderedRows.push(esc(short(row, 220)));
        out.innerHTML = renderedRows.join('<br>');
        term().scrollTop = term().scrollHeight;
        if (index < rows.length - 1) await sleep(DEMO_PACING.commandRowRevealMs);
      }
    });
  }
};

window.prose = function prose(html) {
  add('lc', html);
  return window.pauseForRead(html, { baseMs: 300, perCharMs: 1.2, capMs: 900 });
};

async function showBootBanner() {
  const activeTab = document.querySelectorAll('.stab')[cur];
  const directory = activeTab?.dataset.directory || '~/demo-project';
  const banner = [
    '╭─────────────────────────────────────────────╮',
    '│ >_ OpenAI Codex (v0.130.0)                  │',
    '│                                             │',
    '│ model:     gpt-5.4 xhigh   /model to change │',
    '│ directory: ' + directory.padEnd(33, ' ') + '│',
    '╰─────────────────────────────────────────────╯',
  ].join('\n');
  add('boot', `<pre>${esc(banner)}</pre>`);
  add('gap');
  await window.pauseForRead(banner, { baseMs: 900, perCharMs: 1.1, capMs: 1800 });
}

function syncSessionMeta(idx = cur) {
  const activeTab = document.querySelectorAll('.stab')[idx];
  if (!activeTab) return;
  const titlebarCenter = document.querySelector('.titlebar-center');
  if (titlebarCenter && activeTab.dataset.title) titlebarCenter.textContent = activeTab.dataset.title;
}

function applyInitialScenario() {
  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get('scenario'));
  if (Number.isInteger(requested) && requested >= 0 && requested < document.querySelectorAll('.stab').length) {
    cur = requested;
  }
}

function notifyParent(action) {
  if (!window.parent || window.parent === window) return;
  try {
    window.parent.postMessage({
      type: 'plotune-nexus-use-case',
      family: 'codex',
      action,
      scenario: cur,
      stamp: Date.now(),
    }, window.location.origin);
  } catch (error) {
    console.error(error);
  }
}

window.sel = function sel(idx) {
  if (running) return;
  cur = idx;
  document.querySelectorAll('.stab').forEach((t, i) => t.classList.toggle('active', i === idx));
  syncSessionMeta(idx);
  notifyParent('select');
  renderQueue = Promise.resolve();
  term().innerHTML = '';
  run();
};

async function run() {
  if (running) return;
  if (!Array.isArray(window.DEMO_SCENARIOS)) return;
  running = true;
  document.querySelectorAll('.stab, .breplay').forEach(b => b.style.opacity = '0.35');
  window.__demoPromptCount = 0;
  syncSessionMeta(cur);
  const startedAt = performance.now();
  try {
    await showBootBanner();
    await window.DEMO_SCENARIOS[cur]();
    await renderQueue;
    const remainingMs = DEMO_PACING.minScenarioMs - (performance.now() - startedAt);
    if (remainingMs > 0) await sleep(remainingMs);
    add('gap');
    await sleep(120);
    const c = add('', '');
    c.innerHTML = '<span class="cursor"></span>';
  } catch(e) {
    console.error(e);
  }
  running = false;
  document.querySelectorAll('.stab, .breplay').forEach(b => b.style.opacity = '');
}

window.replay = function replay() {
  if (running) return;
  notifyParent('replay');
  renderQueue = Promise.resolve();
  term().innerHTML = '';
  run();
};

window.addEventListener('DOMContentLoaded', () => {
  applyInitialScenario();
  document.querySelectorAll('.stab').forEach((t, i) => t.classList.toggle('active', i === cur));
  syncSessionMeta(cur);
  notifyParent('load');
  run();
});
