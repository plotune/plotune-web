import { usd } from '../utils/nexusOffer';

// Plotune Bridge catalog: the one place the Bridge family's product facts, images and prices live.
// /bridge (landing), /bridge/<slug> (product pages), the request cart (/request) and the
// request payload all read from here.
//
// ADDING A MODEL LATER (for example a "Bridge DAQ - Industrial" with its own name): add another
// entry below with its own unique `id` and `slug`. The product page, the cards, the sitemap,
// the prerender list and the cart pick it up with no other change. The cart and the order
// payload carry `id`, so keep an id stable once it has been sold.
//
// IMAGES: three per product. `src: null` renders a neutral placeholder. Put the files in
// public/assets/bridge/<id>/ (for example /assets/bridge/can/1.webp) and set `src` here. Give each
// `alt` text that describes what the picture shows, since it is the only description screen readers
// get. Landing-page cards and the hero carousel use the FIRST image of each product, so make it the
// best product shot.
//
// PRICES: `price` is the retail price per unit in USD, excluding VAT / sales tax, shipping and
// import duties (those depend on the destination and are confirmed personally before payment).
// `null` shows "Price on request" and the order is recorded as "to be quoted". The Apps Script that records requests prices them from
// its OWN copy (BRIDGE_CATALOG in integrations/ai-readiness-apps-script/Code.gs), because amounts
// sent by a browser can't be trusted. Change both together and bump CATALOG_VERSION so the sheet
// shows which prices each visitor saw.
//
// NOTE for scripts/prerender.cjs and scripts/generate-static-routes.cjs: they read the product slugs
// from this file with a text pattern (the word slug, a colon, then a quoted value), so only product
// entries may be written that way.
export const CATALOG_VERSION = '2026-11-prices';

// POSITIONING: the Bridge family is sold on what connecting hardware lets you DO (remote access,
// browser workflows, Nexus automation), not on the electronics. Lead with `advantages`; `features`
// are the product data, written plainly. Do not state a development or commercial status, do not
// qualify prices or specs with "target" or "not final" wording, and do not add sampling rates, accuracy values,
// output current ratings, certifications or availability dates until they are established.

const imageSet = (name) => [
  { src: null, alt: `Plotune ${name}, front view` },
  { src: null, alt: `Plotune ${name} connected on a test bench` },
  { src: null, alt: `Plotune ${name}, rear view with its connectors` },
];

export const PRODUCTS = [
  {
    id: 'can',
    slug: 'can',
    name: 'Bridge CAN',
    short: 'Remote, isolated dual-channel CAN for ECU and BMS testing.',
    tag: 'CAN · 2 channels',
    diagram: { left: { nodes: ['CAN 1', 'CAN 2'], ports: 1, kind: 'db9', caption: 'Your CAN buses' }, right: null, caption: 'DB9 · Y-cable → CAN 1 + CAN 2' },
    tagline: 'Dual-Channel CAN Communication, Anywhere.',
    blurb: 'A connected CAN test interface that combines affordable hardware with remote access and test automation.',
    definition: 'A compact, dual-channel Classical CAN interface for connected automotive and embedded-system testing.',
    highlights: [
      { value: 'Remote', label: 'CAN access, not tied to one workstation' },
      { value: '2 × isolated', label: 'Classical CAN channels, up to 1 Mbit/s' },
      { value: 'AI-ready', label: 'Automated ECU and BMS testing with Nexus' },
    ],
    advantages: [
      ['Remote access, not workstation-bound', 'Reach your CAN bus from anywhere, instead of from the one PC it is plugged into.', 'remote'],
      ['Dual-channel isolated CAN, compact', 'Two galvanically isolated Classical CAN channels in a single compact device.', 'channels'],
      ['Browser-based engineering workflows', 'Monitor and transmit frames, record, and decode signals in the browser.', 'browser'],
      ['Automated ECU and BMS testing', 'Plotune Nexus makes the interface a step in AI-agent-ready test automation.', 'ai'],
    ],
    features: [
      '2 independent Classical CAN channels',
      'CAN bitrate up to 1 Mbit/s',
      'Galvanically isolated CAN channels',
      'Single DB9 connector with dual-channel Y-cable',
      'USB-C connectivity and integrated Wi-Fi',
      'DC IN power jack',
      'Remote CAN access',
      'Browser-based CAN monitoring and frame transmission',
      'CAN recording and ASC export',
      'DBC signal decoding',
      'Client-side ISO-TP, UDS and XCP-on-CAN workflows',
      'Plotune Nexus integration and AI-agent-ready test automation',
    ],
    applications: ['ECU validation', 'BMS testing', 'Automotive diagnostics', 'Robotics', 'Remote test benches'],
    boundary: null,
    images: [
      { src: '/assets/bridge/can/1.webp', alt: 'Plotune Bridge CAN, black enclosure with the D-SUB9 connector labelled CAN 1 and 2, a status LED and the Plotune logo on top' },
      { src: '/assets/bridge/can/2.webp', alt: 'Plotune Bridge CAN from the side, with the D-SUB9 connector at the end' },
      { src: '/assets/bridge/can/3.webp', alt: 'Rear of Plotune Bridge CAN with the USB-C port and the DC IN power jack' },
    ],
    price: 199,
  },
  {
    id: 'serial',
    slug: 'serial',
    name: 'Bridge Serial',
    short: 'Remote serial debugging with logging and automation.',
    tag: 'Serial · 2 channels',
    diagram: { left: { nodes: ['Serial 1', 'Serial 2'], ports: 2, kind: 'rj45', caption: 'RS-232 · RS-422 · RS-485' }, right: null, caption: '2 × RJ45' },
    tagline: 'Industrial Serial Communication Made Accessible.',
    blurb: 'An accessible serial interface combining connectivity, remote debugging and automated testing.',
    definition: 'A compact, dual-channel serial communication interface for connected debugging, diagnostics and automation.',
    highlights: [
      { value: 'Remote', label: 'Serial debugging from anywhere' },
      { value: '2', label: 'Independent serial channels' },
      { value: 'AI-ready', label: 'Automated serial testing with Nexus' },
    ],
    advantages: [
      ['Remote serial debugging', 'Debug and maintain equipment without standing next to it.', 'remote'],
      ['Two independent channels', 'Work with two serial links at once from a single device.', 'channels'],
      ['Monitoring, logging and commands in one place', 'Watch traffic, keep logs and run commands from the same workflow.', 'browser'],
      ['Test automation, not basic serial conversion', 'Plotune Nexus turns serial links into AI-agent-ready test steps.', 'ai'],
    ],
    features: [
      '2 independent serial channels',
      'RS-232, RS-422 and RS-485 support',
      '2 RJ45 serial connectors',
      'USB-C connectivity and integrated Wi-Fi',
      'DC IN power jack',
      'Remote serial access',
      'Browser-based serial monitoring',
      'Bidirectional serial communication',
      'Serial logging and command execution',
      'Plotune Nexus integration and AI-agent-ready serial testing',
    ],
    applications: ['Embedded firmware debugging', 'Industrial equipment diagnostics', 'Serial protocol validation', 'Remote maintenance'],
    boundary: null,
    images: imageSet('Bridge Serial'),
    price: 129,
  },
  {
    id: 'daq',
    slug: 'daq',
    name: 'Bridge DAQ',
    short: 'Remote analog measurement for automated validation.',
    tag: 'Analog · 7 inputs',
    diagram: { left: { nodes: ['AI 1', 'AI 2', 'AI 3', 'AI 4', 'AI 5', 'AI 6', 'AI 7'], ports: 7, kind: 'terminal', caption: '±10 V analog inputs' }, right: null, caption: '7 × removable terminals' },
    tagline: 'Capture Real-World Signals with Confidence.',
    blurb: 'An accessible, connected DAQ solution combining analog measurement with remote monitoring and test automation.',
    definition: 'A compact, seven-channel analog data acquisition device for connected engineering measurements and automated validation.',
    highlights: [
      { value: '7', label: 'Analog voltage channels in one compact device' },
      { value: 'Remote', label: 'Monitoring and measurement recording' },
      { value: 'AI-ready', label: 'Measurements inside automated test workflows' },
    ],
    advantages: [
      ['Seven analog channels, compact', 'Seven independent analog voltage inputs in a single bench-ready device.', 'signal'],
      ['Remote monitoring and recording', 'Watch and record measurements without being at the bench.', 'remote'],
      ['Measurements inside automated tests', 'Plotune Nexus brings physical measurements into automated test workflows.', 'ai'],
      ['Browser access, no desktop DAQ application', 'Open live measurements in the browser instead of installing a traditional DAQ application.', 'browser'],
    ],
    features: [
      '7 independent analog voltage input channels',
      '16-bit ADC resolution',
      '±10 V input range',
      '7 removable two-pole terminal connectors',
      'USB-C connectivity and integrated Wi-Fi',
      'DC IN power jack',
      'Browser-based live measurements',
      'Measurement recording and data export',
      'Remote measurement access',
      'Plotune Nexus integration and AI-agent-ready measurement automation',
    ],
    applications: ['Sensor monitoring', 'ECU signal validation', 'Voltage measurements', 'Laboratory experiments', 'Automated hardware testing'],
    boundary: 'Sampling rate, accuracy, noise performance and isolation are still to be determined. ADC resolution on its own does not establish measurement accuracy.',
    images: imageSet('Bridge DAQ'),
    price: 249,
  },
  {
    id: 'io',
    slug: 'io',
    name: 'Bridge I/O',
    short: 'Remote mixed-signal I/O for test fixtures and automation.',
    tag: 'Digital + analog · 12 I/O',
    diagram: { left: { nodes: ['DI 1', 'DI 2', 'DI 3', 'DI 4', 'AI 1', 'AI 2'], ports: 6, kind: 'terminal', caption: 'Sensors, switches' }, right: { nodes: ['DO 1', 'DO 2', 'DO 3', 'DO 4', 'AO 1', 'AO 2'], ports: 6, kind: 'terminal', caption: 'Actuators, fixtures' }, caption: '12 I/O points · removable terminals' },
    tagline: 'Control and Monitor the Physical World.',
    blurb: 'An accessible mixed-signal I/O interface designed to simplify connected hardware testing and automation.',
    definition: 'A compact mixed-signal input/output interface for connected test-bench control, signal monitoring and hardware automation.',
    highlights: [
      { value: '12', label: 'Digital and analog I/O points in one device' },
      { value: '2', label: 'Analog outputs for signal generation and simulation' },
      { value: 'Remote', label: 'Control of test fixtures from anywhere' },
    ],
    advantages: [
      ['Digital and analog I/O in one device', 'Four digital inputs, four digital outputs, two analog inputs and two analog outputs together.', 'sliders'],
      ['Two analog outputs', 'Generate and simulate signals as part of a test.', 'signal'],
      ['Remote control of test fixtures', 'Drive and monitor your fixture without being next to it.', 'fixture'],
      ['Automated hardware interaction', 'Plotune Nexus lets AI agents sequence tests that touch real hardware.', 'ai'],
      ['Fewer separate modules', 'May simplify setups that would otherwise need separate I/O modules or PLC-based control.', 'modules'],
    ],
    features: [
      '4 digital inputs (24 V)',
      '4 digital outputs',
      '2 analog inputs (0–10 V and 4–20 mA)',
      '2 analog outputs (0–10 V)',
      '12 I/O points in total',
      'Removable terminal connectors',
      'USB-C connectivity and integrated Wi-Fi',
      'DC IN power jack',
      'Remote digital and analog I/O access',
      'Browser-based signal monitoring and control',
      'Plotune Nexus integration and AI-agent-ready test sequencing',
    ],
    applications: ['ECU test fixtures', 'Sensor simulation', 'Automated functional testing', 'Industrial prototyping', 'Hardware-in-the-loop support'],
    boundary: 'Digital output current capacity, analog output accuracy, isolation and protection ratings are still to be determined.',
    images: imageSet('Bridge I/O'),
    price: 259,
  },
];

// What every Bridge shares: the family-level story on /bridge.
export const COMMON_FEATURES = [
  ['Remote Hardware Access', 'Reach your hardware from anywhere, not just from the workstation it is plugged into.', 'remote'],
  ['Browser-Based Workflows', 'Configure devices, monitor signals and control hardware in the browser.', 'browser'],
  ['AI-Ready Test Automation', 'Native Plotune Nexus integration lets AI agents run tests, interact with hardware and collect results.', 'ai'],
  ['USB-C, DC IN and Wi-Fi', 'Connect over USB-C or integrated Wi-Fi; power in over USB-C or the DC IN jack.', 'usb'],
  ['Compact, Bench-Ready', 'Compact hardware designed for engineering workbenches.', 'compact'],
  ['Entry-Level Pricing', 'Prices from $129, so every bench can be connected.', 'price'],
];

// Shown next to a price.
export const PRICE_NOTE = 'Per unit, excl. tax and shipping.';

export const getProduct = (slug) => PRODUCTS.find((product) => product.slug === slug) || null;
export const getProductById = (id) => PRODUCTS.find((product) => product.id === id) || null;

export const isPriced = (product) => typeof product.price === 'number' && product.price > 0;
export const priceLabel = (product) => (isPriced(product) ? usd(product.price) : 'Price on request');
