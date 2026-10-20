// Executable scenarios are reviewed source, never generated from PR instructions.
module.exports = {
  'nexus-rental-selection': {
    kind:'ui', caption:'Choose a Nexus rental and adjust its length',
    transcript:'Open Nexus pricing, choose Rent Nexus, then increase the rental length. The displayed rental summary updates as the selection changes. No order or contact form is submitted.',
    async run(page, origin, checkpoint) {
      await page.goto(`${origin}/nexus/pricing`);
      const rent=page.getByRole('radio',{name:/Rent Nexus/});
      await rent.scrollIntoViewIfNeeded();
      await rent.evaluate(el=>el.scrollIntoView({block:'center'}));
      await checkpoint('Choose how you want to use Nexus');
      await rent.click();
      await page.getByRole('heading',{name:'How long do you need it?',exact:true}).waitFor();
      await checkpoint('Set the rental length for your project');
      await page.getByRole('button',{name:'One month more',exact:true}).click();
      await checkpoint('See the selection update before making a request');
    },
  },
  'stream-event-search': {
    kind:'ui', caption:'Find a matching event in the Stream demo',
    transcript:'Open the event explorer with demo data, search for motor, then clear the search to return to the full event list.',
    async run(page, origin, checkpoint) {
      await page.goto(`${origin}/stream/demo?project=battery`);
      const search=page.getByRole('textbox',{name:'Search events and properties',exact:true});
      await search.waitFor();
      await page.getByRole('combobox',{name:'Event time range',exact:true}).selectOption('all');
      await checkpoint('Search recent engineering events');
      await search.click();
      await search.pressSequentially('motor',{delay:90});
      await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length>0);
      await checkpoint('Narrow the list to matching events');
      await search.fill('');
      await checkpoint('Clear the search to explore again');
    },
  },
  'event-delivery-diagram': {
    kind:'diagram', caption:'How an event reaches a receiver',
    transcript:'An illustrative event moves from an HTTP-capable source into Plotune Stream, then to a configured receiver. The diagram explains a flow and is not a recording of a live delivery.',
    async run(page, origin, checkpoint) {
      await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Event delivery illustration</title><style>body{margin:0;background:#f7f6f2;color:#1c242b;font:24px system-ui;padding:70px}h1{font-size:44px;letter-spacing:-1px;margin:30px 0 80px}.flow{display:flex;align-items:center;gap:24px}.node{border:1px solid #a3b5ac;padding:38px 24px;min-width:220px;background:white;text-align:center}.active{border:3px solid #00796b;background:#e4f0e8}small{font-size:16px;color:#526067}footer{margin-top:110px;font-size:18px;color:#526067}</style><small>PLOTUNE / ILLUSTRATION</small><h1>From an event to a useful action.</h1><div class="flow"><div class="node">HTTP source</div><span>→</span><div class="node">Plotune Stream</div><span>→</span><div class="node">Your receiver</div></div><footer>Conceptual flow · no live system or customer data</footer></html>`);
      for(let index=0;index<3;index++) {
        await page.locator('.node').evaluateAll((nodes,i)=>nodes.forEach((n,j)=>n.classList.toggle('active',i===j)),index);
        await checkpoint(['Send an event','Select the relevant context','Deliver to a configured receiver'][index]);
      }
    },
  },
};
