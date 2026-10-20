// Executable scenarios are reviewed source, never generated from PR instructions.
module.exports = {
  'stream-property-filter': {
    kind:'ui', caption:'Filter robot events where motor.temperature is greater than 70.',
    transcript:'Open the robot project, select All time, and add a numeric motor.temperature greater than 70 condition. Apply it and inspect the active condition and matching events.',
    async run(page, origin, checkpoint) {
      await page.goto(`${origin}/stream/demo?project=robot`);
      await page.getByRole('combobox',{name:'Event time range',exact:true}).selectOption('all');
      await checkpoint('Inspect the robot event dataset');
      await page.getByRole('button',{name:'Filter',exact:true}).click();
      const dialog=page.getByRole('dialog',{name:'Filter events'});
      await dialog.getByPlaceholder('Search properties…').fill('motor.temperature');
      await dialog.getByRole('option').filter({hasText:'motor.temperature'}).click();
      if(await dialog.getByLabel('Value type').count())await dialog.getByLabel('Value type').selectOption('number');
      await dialog.getByLabel('Operator',{exact:true}).selectOption('greater_than');
      await dialog.getByLabel('Value',{exact:true}).fill('70');
      await dialog.evaluate(el=>el.scrollIntoView({block:'center'}));
      await checkpoint('Select a numeric property condition');
      await dialog.getByRole('button',{name:'Apply',exact:true}).click();
      await page.getByLabel('Active property filters').waitFor();
      await checkpoint('Inspect the filtered result');
    },
  },
  'shared-filter-flow': {
    kind:'diagram', caption:'One Saved Filter supplies event-selection conditions to Explorer, widgets and export.',
    transcript:'A Saved Filter stores conditions and an identifier. Explorer applies its conditions, widgets reference its identifier, and export retrieves matching events before browser conversion. Chart settings remain separate.',
    async run(page, origin, checkpoint) {
      await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Shared filter selection</title><style>*{box-sizing:border-box}body{margin:0;background:#f7f6f2;color:#1c242b;font:22px system-ui;padding:58px 64px}h1{font-size:38px;margin:0 0 16px;letter-spacing:-1px}p{color:#526067;margin:0 0 42px}.flow{display:grid;grid-template-columns:350px 70px 1fr;align-items:center;gap:20px}.source,.target{border:1px solid #a3b5ac;background:#fff;padding:24px}.source{border-top:4px solid #00796b}.source code{display:block;margin-top:24px;color:#00695c;font-size:18px}.arrow{font-size:38px;text-align:center}.targets{display:grid;gap:16px}.target strong{display:block;font-size:23px;margin-bottom:6px}.target span{font-size:18px;color:#526067}.active{background:#e4f0e8;border-color:#00796b}footer{margin-top:36px;font-size:18px;color:#526067}</style><h1>One selection. Three places to use it.</h1><p>Saved Filter conditions stay separate from visualization settings.</p><div class="flow"><div class="source"><strong>Saved Filter</strong><code>id: real-system<br>environment equals real<br>motor.temperature &gt; 70</code></div><div class="arrow">→</div><div class="targets"><div class="target"><strong>Event Explorer</strong><span>Inspect matching events and their JSON</span></div><div class="target"><strong>Dashboard widget</strong><span>Filter ID + measure + chart + breakdown</span></div><div class="target"><strong>Export</strong><span>All matching events → JSON / CSV / TSV</span></div></div></div><footer>Editing the Saved Filter changes the selection of widgets referencing its ID.</footer></html>`);
      for(let index=0;index<3;index++) {
        await page.locator('.target').evaluateAll((nodes,i)=>nodes.forEach((n,j)=>n.classList.toggle('active',i===j)),index);
        await checkpoint(['Investigate events','Observe a saved visualization','Retrieve and convert matching events'][index]);
      }
    },
  },
};
