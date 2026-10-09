"""Publish uncropped, lossless screenshot evidence and the complete coverage index."""
import json, shutil
from pathlib import Path
from PIL import Image
root=Path('docs/redesign');base=root/'evidence'
before=json.loads((base/'before/results.json').read_text());after=json.loads((base/'after/results.json').read_text())
for record in json.loads((base/'after-final/results.json').read_text()):
    shutil.copyfile(base/'after-final'/record['file'],base/'after'/record['file'])
    record['finalCorrectionCapture']=True
    after=[r for r in after if (r['route'],r['device'])!=(record['route'],record['device'])]+[record]
(base/'after/results.json').write_text(json.dumps(after,indent=2))
for phase in ['before','after','interactions','account-interactions','states','before-motion','after-motion']:
    folder=base/phase
    for p in folder.glob('*.png'):
        target=p.with_suffix('.webp')
        if target.exists() and target.stat().st_mtime>=p.stat().st_mtime:continue
        with Image.open(p) as source:
            source.save(target,'WEBP',lossless=True,method=3)
            with Image.open(target) as saved:
                assert saved.size==source.size and saved.convert('RGB').tobytes()==source.convert('RGB').tobytes(),str(p)
    manifest=folder/'results.json'
    if manifest.exists():
        data=json.loads(manifest.read_text())
        if isinstance(data,list):
            for r in data:
                if 'file' in r:r['artifact']=r['file'].replace('.png','.webp')
            manifest.write_text(json.dumps(data,indent=2))
routes=json.loads((root/'routes.json').read_text());rows=[];gallery=[]
for idx,route in enumerate(routes):
    owner='account' if 1<=idx<=29 else 'editorial/docs' if idx in list(range(36,40))+list(range(42,82))+[102,103] else 'workspace' if 82<=idx<=101 else 'product/funnel'
    shots={}
    for phase,records in [('before',before),('after',after)]:
        shots[phase]={r['device']:f"evidence/{phase}/{r['file'].replace('.png','.webp')}" for r in records if r['route']==route}
    cells=[' · '.join(f'[{device}]({uri})' for device,uri in shots[phase].items()) or 'New route' for phase in ['before','after']]
    rows.append(f'| {idx:03d} | `{route}` | {owner} | {cells[0]} | {cells[1]} |')
    if idx in [104,105]:
        shots={phase:{device:f'evidence/{phase}-motion/{idx:03d}-{device}.webp' for device in ['mobile','tablet','desktop']} for phase in ['before','after']}
    gallery.append({'route':route,'shots':shots})
(root/'coverage.md').write_text('# Complete route coverage\n\nEach linked image is full-page, uncropped and lossless at its recorded viewport. Review logs document the opened PNG originals and subsequent corrections; WebP copies have identical pixels. External redirects are captured during their transition; authenticated views use safe fixtures, and error URLs deliberately exercise fallback pages.\n\n| ID | Route/state | Review group | Before: opened | Final: opened |\n|---|---|---|---|---|\n'+'\n'.join(rows)+'\n')
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plotune — redesign evidence</title><style>body{margin:0;background:#f7f6f2;color:#1c242b;font:16px system-ui}header{padding:24px;border-bottom:1px solid #d2d5ce}h1{font-size:26px;margin:0 0 12px}select{padding:12px;max-width:100%;margin:8px 8px 0 0}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px}section{min-width:0}img{display:block;width:100%;height:auto;border:1px solid #d2d5ce}a{color:#00796b}h2{font-size:18px}@media(max-width:700px){main{grid-template-columns:1fr}}</style><header><h1>Plotune / before &amp; after</h1><p>Full-page captures. Safe local fixtures. Choose a route and matching viewport; open an image for original dimensions.</p><select aria-label="Route" id="route"></select><select aria-label="Viewport" id="device"><option value="desktop">Desktop · 1440 × 900</option><option value="tablet">Tablet · 768 × 1024</option><option value="mobile">Mobile · 390 × 844</option></select><p><a href="README.md">Report and limitations</a> · <a href="coverage.md">Every route</a></p></header><main id="images"></main><script>const data=DATA;const r=document.getElementById('route'),d=document.getElementById('device');for(const [i,row] of data.entries()){const o=document.createElement('option');o.value=i;o.textContent=row.route;r.append(o)}function render(){const row=data[r.value],main=document.getElementById('images');main.replaceChildren();for(const phase of ['before','after']){const s=document.createElement('section'),h=document.createElement('h2');h.textContent=phase==='before'?'Origin master':'Redesign';s.append(h);const uri=row.shots[phase][d.value];if(uri){const a=document.createElement('a'),im=document.createElement('img');a.href=uri;im.src=uri;im.alt=phase+' '+row.route+' '+d.value;a.append(im);s.append(a)}else{s.append('Additive route: no baseline page.')}main.append(s)}}r.onchange=d.onchange=render;render();</script></html>'''
(root/'gallery.html').write_text(html.replace('DATA',json.dumps(gallery)))
print('Published lossless evidence and coverage for',len(routes),'routes')
