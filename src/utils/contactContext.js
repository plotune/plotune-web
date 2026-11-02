import { CONTACT_CONTEXTS, PRODUCT_CHOICES } from '../content/contactContexts';
import { getSolutionSegment } from '../content/solutions';

const KNOWN = PRODUCT_CHOICES.map(([id]) => id);

// Decides what the contact page should talk about. In order of trust:
//   1. a link that names the product (?product=bridge)            -> source 'link'
//   2. a Nexus solution page the visitor came from (?solution=)   -> source 'solution'
//   3. the product area they were last in this session            -> source 'session'
//   4. nothing known                                              -> 'neutral', source 'default'
// `funnel` is the session's funnel context ({ product, item, ... }, see utils/funnel.js).
export const resolveContactContext = (search = '', funnel = {}) => {
  const params = new URLSearchParams(search);
  const named = (params.get('product') || '').toLowerCase();
  const slug = params.get('solution') || params.get('segment');
  const solution = slug ? getSolutionSegment(slug) : null;

  let id = 'neutral';
  let source = 'default';
  if (KNOWN.includes(named)) { id = named; source = 'link'; }
  else if (solution) { id = 'nexus'; source = 'solution'; }
  else if (KNOWN.includes(funnel.product)) { id = funnel.product; source = 'session'; }

  // a specific Bridge model only counts when the visitor really looked at it in this session
  const item = id === 'bridge' && funnel.product === 'bridge' ? funnel.item || '' : '';
  const sol = id === 'nexus' ? solution || null : null;
  const config = CONTACT_CONTEXTS[id];
  const ctx = { solution: sol, item };
  return {
    id,
    source,
    config,
    topic: config.topic(ctx),
    starters: config.starters(ctx),
    placeholder: config.placeholder(ctx),
    mail: config.mail(ctx),
  };
};
