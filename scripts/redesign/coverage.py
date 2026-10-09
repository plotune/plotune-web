"""Build docs/redesign/coverage.md: per route x viewport, whether a screenshot was captured
(from the capture harness results) and whether it was visually inspected (from the inspection log).
Usage: python3 scripts/redesign/coverage.py <phase> <inspection.tsv>
The inspection log is tab-separated: route_id, viewports ("all" or comma list), inspector, note."""
import json, sys, os
phase, log = sys.argv[1], sys.argv[2]
routes = json.load(open('docs/redesign/routes.json'))
ev = f'docs/redesign/evidence/{phase}'
results = []
for name in os.listdir(ev):
    if name.startswith('results') and name.endswith('.json'):
        results += json.load(open(os.path.join(ev, name)))
captured = {(r['route'], r['device']): r for r in results}
inspected = {}
for line in open(log):
    if not line.strip():
        continue
    rid, views, who, note = (line.rstrip('\n').split('\t') + ['', '', ''])[:4]
    for v in (['mobile', 'tablet', 'desktop'] if views == 'all' else views.split(',')):
        inspected[(int(rid), v)] = (who, note)
devices = ['mobile', 'tablet', 'desktop']
out = [f'# Screenshot coverage matrix ({phase})', '',
       'Viewports: mobile 390x844, tablet 768x1024, desktop 1440x900. "Captured" means the harness saved a full-page PNG with no capture error. '
       '"Inspected" means the image was opened and examined by the named reviewer: `claude` is the implementing agent, `haiku` is a delegated first-pass sweep whose findings were re-verified before fixing. '
       'A route marked inspected but not re-captured after a fix was re-rendered and re-inspected through the quick-capture script during the fix.', '',
       '| ID | Route | Captured (M/T/D) | Inspected (M/T/D) | Reviewer | Outcome |', '|---:|---|---|---|---|---|']
tot_c = tot_i = 0
for i, route in enumerate(routes):
    cap = ''.join('✓' if (route, d) in captured and not captured[(route, d)].get('error') else '✗' for d in devices)
    ins = ''.join('✓' if (i, d) in inspected else '·' for d in devices)
    tot_c += cap.count('✓'); tot_i += ins.count('✓')
    who = sorted({inspected[(i, d)][0] for d in devices if (i, d) in inspected})
    note = next((inspected[(i, d)][1] for d in devices if (i, d) in inspected), '')
    out.append(f'| {i} | `{route}` | {cap} | {ins} | {", ".join(who)} | {note.replace("|", "/")} |')
out[2:2] = [f'**Totals:** {tot_c} of {len(routes) * 3} captured, {tot_i} of {len(routes) * 3} inspected.', '']
open('docs/redesign/coverage.md', 'w').write('\n'.join(out) + '\n')
print(f'captured {tot_c}, inspected {tot_i}, of {len(routes) * 3}')
