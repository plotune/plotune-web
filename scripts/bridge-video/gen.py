#!/usr/bin/env python3
"""Generate one short product clip with OpenRouter's video API, from a first-frame image.

  gen.py NAME FIRST_FRAME PROMPT_FILE [--model google/veo-3.1-lite] [--seconds 4] [--resolution 720p]
         [--aspect 16:9] [--audio] [--expect-usd 0.12] [--dry-run]

Writes $BRIDGE_VIDEO_WORK/clips/NAME.mp4. The API key comes from OPENROUTER_KEY in the environment (or from
the file named by OPENROUTER_ENV_FILE) and is never printed. --expect-usd stops before spending when the key's
remaining limit is lower than that. Prices are per second; see README.md.
"""
import argparse, base64, io, json, os, sys, time, urllib.error, urllib.request
from PIL import Image

API = 'https://openrouter.ai/api/v1'


def load_key():
    key = os.environ.get('OPENROUTER_KEY')
    path = os.environ.get('OPENROUTER_ENV_FILE')
    if not key and path and os.path.exists(path):
        for line in open(path):
            if line.startswith('OPENROUTER_KEY='):
                key = line.split('=', 1)[1].strip().strip('"\'')
    if not key:
        sys.exit('OPENROUTER_KEY is not set (export it, or point OPENROUTER_ENV_FILE at a file that defines it)')
    return key


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('name'); ap.add_argument('first_frame'); ap.add_argument('prompt_file')
    ap.add_argument('--model', default='google/veo-3.1-lite'); ap.add_argument('--seconds', type=int, default=4)
    ap.add_argument('--resolution', default='720p'); ap.add_argument('--aspect', default='16:9')
    ap.add_argument('--audio', action='store_true', help='keep the generated soundtrack (off by default: cheaper, web-ready)')
    ap.add_argument('--expect-usd', type=float, default=None, help='abort if the key has less than this left')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    key = load_key()
    headers = {'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

    def call(method, url, body=None, raw=False):
        req = urllib.request.Request(url, method=method, headers=headers, data=json.dumps(body).encode() if body is not None else None)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read(); return data if raw else json.loads(data)
        except urllib.error.HTTPError as e:
            sys.exit(f'HTTP {e.code}: {e.read()[:700].decode("utf-8", "replace")}')

    # first frame as a JPEG data URI
    im = Image.open(a.first_frame).convert('RGB'); w = 1440; im = im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=92)
    uri = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    body = {'model': a.model, 'prompt': open(a.prompt_file).read().strip(), 'duration': a.seconds, 'resolution': a.resolution,
            'aspect_ratio': a.aspect, 'frame_images': [{'type': 'image_url', 'image_url': {'url': uri}, 'frame_type': 'first_frame'}]}
    if not a.audio: body['generate_audio'] = False
    print(f'{a.name}: {a.model} {a.seconds}s {a.resolution} {a.aspect}, first frame {im.size}, audio {"on" if a.audio else "off"}')
    if a.dry_run: print('dry run: nothing submitted'); return

    info = call('GET', f'{API}/key')['data']
    left = info.get('limit_remaining')
    print('key usage so far: $%s (limit %s, remaining %s)' % (info.get('usage'), info.get('limit'), left))
    if a.expect_usd is not None and left is not None and left < a.expect_usd:
        sys.exit(f'stopping: expected cost ${a.expect_usd} exceeds the ${left} left on this key')

    job = call('POST', f'{API}/videos', body)
    print('submitted', job.get('id'))
    t0 = time.time()
    while True:
        time.sleep(8); st = call('GET', job['polling_url']); print(f'  {int(time.time() - t0):>3}s {st.get("status")}', flush=True)
        if st['status'] == 'completed': break
        if st['status'] == 'failed': sys.exit('FAILED: ' + json.dumps(st.get('error'))[:600])
        if time.time() - t0 > 540: sys.exit('timed out; job id ' + job['id'])
    work = os.environ.get('BRIDGE_VIDEO_WORK', os.path.join(os.getcwd(), 'work')); os.makedirs(work + '/clips', exist_ok=True)
    out = f'{work}/clips/{a.name}.mp4'; open(out, 'wb').write(call('GET', f'{API}/videos/{job["id"]}/content?index=0', raw=True))
    print('saved', out, '| cost', json.dumps(st.get('usage')))


if __name__ == '__main__':
    main()
