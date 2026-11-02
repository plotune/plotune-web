# Plotune Bridge film

Builds the Bridge family film shown on `/bridge` (`public/assets/bridge/video/`): four AI-animated product shots
cut together with real typography, and an animated brand end card built from the product renders. There are two
cuts, a wide one (1280x720) and a separate vertical one (720x1280) with its own framing and timing.

The shots are image-to-video: your real render is the first frame, so the product in the film is the real
product. Everything that must be exact (names, tagline, URL, the family line-up) is drawn here, never by the model.

## Steps

```sh
export BRIDGE_VIDEO_WORK=$PWD/work            # clips/ fonts/ cut/ final/ live here (keep it out of git)
pip install -r scripts/bridge-video/requirements.txt     # plus an ffmpeg (system, FFMPEG=..., or imageio-ffmpeg)
sh scripts/bridge-video/fetch-fonts.sh        # the site's Inter + Roboto Mono

# 1. a 16:9 first frame per product (models offer 16:9 / 9:16, not 4:3): extends the plain studio backdrop
python scripts/bridge-video/firstframe.py render-can.png   work/can.jpg
python scripts/bridge-video/firstframe.py collage.png      work/serial.jpg 0 0 764 506     # optional crop box

# 2. one clip per product (spends credits, see Cost); the key is read from the environment
set -a; . ./.env; set +a                                                              # defines OPENROUTER_KEY
python scripts/bridge-video/gen.py can work/can.jpg scripts/bridge-video/prompts/can.txt --expect-usd 0.12
python scripts/bridge-video/gen.py serial ... && ... daq ... && ... io ...            # same, one per product

# 3. cut-outs of the four products for the end card, then the animated end card (wide + vertical)
python scripts/bridge-video/cutout.py can render-can.png
python scripts/bridge-video/endcard_anim.py wide && python scripts/bridge-video/endcard_anim.py tall

# 4. edit both cuts, then encode WebM + MP4 + posters into public/assets/bridge/video/
python scripts/bridge-video/assemble.py both
python scripts/bridge-video/assemble.py publish
```

`assemble.py` holds the edit: shot order and captions (`SHOTS`), where each clip starts (`START`), shot length,
cross-fade, and the vertical layout. The vertical cut crops each shot to the product's measured width, so a wide
product such as the DAQ is not cut off.

## Cost (OpenRouter, 720p, no audio)

`google/veo-3.1-lite` is $0.03 per second and only offers 4, 6 or 8 s, so a clip is **$0.12**; the whole film
(four clips) is **$0.48**. Re-roll one clip for another $0.12. The generated soundtrack is switched off (it costs
more and the site plays muted). `gen.py --expect-usd` refuses to start a job the key cannot afford.

## What we learned

- **Hallucinated text is the main risk.** Models invent captions and engraving. The DAQ clip drew a misspelled
  "USBB-C" in a corner for its first two seconds, so `START['daq']` skips them. Always watch every clip, and keep
  "no text, plain surfaces, keep the label exactly" in the prompts. Skim frames, do not trust one.
- **Veo 3.1 Lite kept logos, connectors and port labels intact.** Grok Imagine Video 1.5 Lite did not (it invented
  engraved text on the enclosure); it is the only family that allows a 1 s test, but not worth using.
- **A workspace guardrail can hide models.** A zero-data-retention guardrail made OpenRouter answer 404 ("ZDR
  violation") for Kling 3.0 and not for Veo. That is the workspace's privacy setting, not a bug.
- Models keep warping geometry over a long clip (a corner bends in the last second), so shots are cut to ~1.5-1.8 s.
- Per-model prices and allowed durations are listed by `GET /api/v1/videos/models` (the pricing SKUs are there, the
  normal `/models` list shows 0).

## Credentials

The key lives only in an untracked `.env` (`OPENROUTER_KEY=`). Nothing here prints or stores it. Make sure the
`.env` is gitignored before committing from the folder that holds it.
