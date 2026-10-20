// Reviewed demonstrations of selected weekly changes, never generated PR code.
module.exports={
  'stream-shared-export': {
    kind:'ui',path:'/stream/workspace',
    caption:'Apply a shared project Filter, then export every matching event.',
    transcript:'In the authenticated Stream workspace, open Filter and choose the project Saved Filter Real System. Explorer shows the shared selection. Open Export and choose JSON. The download contains all 24 matching events, including matches beyond the 20-row page. This local recording uses synthetic account authentication and intercepted API responses.',
    async setup(context,origin){return require('./workspace-fixture.cjs').workspaceFixture(context,origin);},
    async run(page,origin,checkpoint,fixture) {
      await page.goto(`${origin}/stream/workspace?project=robot-validation`);
      await page.locator('tbody tr').first().waitFor();
      await page.getByRole('button',{name:'Filter',exact:true}).click();
      const dialog=page.getByRole('dialog',{name:'Filter events'});
      await checkpoint('Select a project Saved Filter');
      await dialog.getByRole('combobox').selectOption('real');
      await page.getByText('Shared Saved Filter: Real System',{exact:true}).waitFor();
      await page.keyboard.press('Escape');
      await checkpoint('Apply the shared project selection');
      await page.getByRole('button',{name:'Export',exact:true}).click();
      await checkpoint('Export the matching selection');
      const download=page.waitForEvent('download');
      await page.getByRole('menuitem',{name:'JSON',exact:true}).click();
      const file=await download;
      const records=JSON.parse(require('node:fs').readFileSync(await file.path(),'utf8'));
      require('node:assert/strict').equal(records.length,fixture.matchingCount);
      require('node:assert/strict').equal(records.every(e=>e.properties.environment==='real'),true);
      require('node:assert/strict').equal(await page.locator('tbody tr').count(),20);
      await checkpoint('Download all matching events, beyond the visible page');
    },
  },
};
