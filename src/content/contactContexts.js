// What /contact says for each product a visitor can be asking about. The page picks one (see
// src/utils/contactContext.js): a link that names the product, else a Nexus solution page, else the
// product area the visitor was last in this session, else "neutral" (nothing known: ask about their setup).
//
// "nexus" keeps the page's original copy word for word. Every context has the same shape, so a new product
// is one more entry here. Starters and topic are functions of { solution, item }: `solution` is a Nexus
// solution page the visitor came from, `item` a specific Bridge model they looked at ("Bridge DAQ").

export const PRODUCT_CHOICES = [
  ['nexus', 'Nexus'],
  ['bridge', 'Bridge'],
  ['stream', 'Stream'],
];

export const CONTACT_CONTEXTS = {
  neutral: {
    id: 'neutral',
    seoDescription: "Tell us about your setup and we'll point you to the right Plotune product and walk you through the next steps.",
    heading: 'Tell us about your setup.',
    intro: 'We reply with the right next step for what you are building or testing.',
    steps: [
      ['You tell us about your setup', 'What you work on, what is already on your bench, and where the manual work is.'],
      ['We point you to the right product', 'Plotune Nexus for automated test workflows, Plotune Bridge for hardware interfaces, Plotune Stream for engineering event history.'],
      ['You get a straight answer', 'Whether it fits, and what getting started would actually take.'],
    ],
    starters: () => [
      { id: 'evaluate', label: 'Tell us about my setup', text: "We'd like to talk about our setup. What we work on: " },
      { id: 'demo', label: 'Book a demo', text: "We'd like a short demo. Good times for us: " },
      { id: 'pricing', label: 'Pricing', text: "We'd like to understand pricing. What we need: " },
    ],
    placeholder: () => 'What do you work on, and what would you like to talk about?',
    topic: () => null,
    mail: () => ({ subject: 'Inquiry: Plotune', body: 'Hi Plotune team,\n\nI wanted to talk through how Plotune would fit our setup.\n\n' }),
    assessment: true,
    next: { to: '/', label: 'Or see everything Plotune does', target: 'home' },
  },

  nexus: {
    id: 'nexus',
    seoDescription: "Tell us about your test environment and we'll walk you through how Plotune Nexus fits, including integration details, timeline, and next steps.",
    heading: 'Tell us about your test environment.',
    intro: 'We reply with integration details, a timeline, and clear next steps.',
    steps: [
      ['You tell us about your setup', 'What you’re testing, what’s already on your bench, and where the manual work is.'],
      ['We map it to Plotune Nexus', 'Which interfaces apply, what a first bounded workflow looks like on your equipment.'],
      ['You get a straight answer', 'Whether it fits, and what setting it up on your bench would actually take.'],
    ],
    starters: ({ solution }) => [
      {
        id: 'evaluate',
        label: 'Evaluate Nexus for our bench',
        text: solution
          ? `We'd like to evaluate Plotune Nexus for ${solution.label} on our bench. Our setup: `
          : "We'd like to evaluate Plotune Nexus on our test bench. Our setup: ",
      },
      { id: 'demo', label: 'Book a demo', text: "We'd like a short demo of Plotune Nexus. Good times for us: " },
      { id: 'pricing', label: 'Pricing', text: "We'd like to understand pricing for Plotune Nexus. Benches / team size: " },
    ],
    placeholder: ({ solution }) => (solution ? `e.g. We'd like to automate ${solution.label} on our bench…` : 'What do you test, and what would you like to automate?'),
    topic: ({ solution }) => (solution ? solution.label : 'Plotune Nexus'),
    mail: ({ solution }) => ({
      subject: solution ? `Inquiry: ${solution.label}` : 'Inquiry: Plotune Nexus',
      body: solution
        ? `Hi Plotune team,\n\nI was reading about ${solution.label} and wanted to talk through how it would fit our setup.\n\n`
        : 'Hi Plotune team,\n\nI wanted to talk through how Plotune Nexus would fit our setup.\n\n',
    }),
    assessment: true,
    next: { to: '/nexus', label: 'Or see how Plotune Nexus works', target: 'nexus' },
  },

  bridge: {
    id: 'bridge',
    seoDescription: "Tell us what you need to connect and we'll recommend the right Plotune Bridge, with availability, the exact price and shipping for your country.",
    heading: 'Tell us what you need to connect.',
    intro: 'We reply with the right Bridge for your bench, availability, and the exact price and shipping for your country.',
    steps: [
      ['You tell us what to connect', 'CAN buses, serial links, measurements or I/O, and how you work with them today.'],
      ['We recommend the right Bridge', 'Which interface fits, and whether to combine several for your bench.'],
      ['You get availability and a quote', 'Price, tax and shipping for your country, and how payment works.'],
    ],
    starters: ({ item }) => [
      { id: 'evaluate', label: 'Which Bridge fits us?', text: "We're looking for the right Plotune Bridge for our bench. What we need to connect: " },
      { id: 'pricing', label: item ? `Price for ${item}` : 'Price and availability', text: `We'd like the price and availability for ${item || 'Plotune Bridge'}. Quantity and delivery country: ` },
      { id: 'nexus', label: 'Use it with Nexus', text: "We'd like to use Plotune Bridge with Plotune Nexus for automated testing. Our setup: " },
    ],
    placeholder: ({ item }) => (item ? `e.g. We'd like ${item} for our bench, and we also need to connect…` : 'What do you need to connect, and how do you work with it today?'),
    topic: ({ item }) => (item ? `Bridge · ${item}` : 'Bridge'),
    mail: ({ item }) => ({
      subject: item ? `Inquiry: ${item}` : 'Inquiry: Plotune Bridge',
      body: `Hi Plotune team,\n\nI wanted to talk through ${item ? item : 'which Plotune Bridge'} for our setup.\n\n`,
    }),
    assessment: false,
    next: { to: '/bridge', label: 'Or see the Bridge family', target: 'bridge' },
  },

  stream: {
    id: 'stream',
    seoDescription: "Tell us what you want to understand and we'll show you how Plotune Stream turns events from your tools and benches into one explorable history.",
    heading: 'Tell us what you need to understand.',
    intro: 'We reply with how Plotune Stream fits your tools, what the first events would look like, and the next steps.',
    steps: [
      ['You tell us what you want to see', 'Which tools, benches or scripts produce the events, and what you need to find out.'],
      ['We map it to Plotune Stream', 'Which sources connect, and what the first history and dashboard look like.'],
      ['You get a straight answer', 'Whether it fits, and what getting started would take.'],
    ],
    starters: () => [
      { id: 'evaluate', label: 'Evaluate Stream for our team', text: "We'd like to evaluate Plotune Stream for our team. The tools and benches we'd connect: " },
      { id: 'demo', label: 'Book a demo', text: "We'd like a short demo of Plotune Stream. Good times for us: " },
      { id: 'pricing', label: 'Pricing', text: "We'd like to understand pricing for Plotune Stream. Team size: " },
    ],
    placeholder: () => 'Which tools or benches produce your events, and what do you need to find out?',
    topic: () => 'Stream',
    mail: () => ({ subject: 'Inquiry: Plotune Stream', body: 'Hi Plotune team,\n\nI wanted to talk through how Plotune Stream would fit our setup.\n\n' }),
    assessment: false,
    next: { to: '/stream', label: 'Or see how Plotune Stream works', target: 'stream' },
  },
};
