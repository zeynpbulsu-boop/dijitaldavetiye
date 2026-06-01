"""
FAZ 5 sync — Imagen4 ULTRA photoreal (sync endpoint, no queue).
"""

import time, json, urllib.request
from pathlib import Path

import os
KEY = os.environ.get("FAL_KEY", "").strip()  # secret from env (none in source)
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}
OUT = Path(__file__).resolve().parent.parent / "public"

PROMPTS = [
    ("aethel", "cover-v5",
     "Editorial wedding photograph of ancient Tuscan stone chapel at golden hour. "
     "Romanesque limestone walls weathered, single arched wooden doorway with warm sunlight "
     "spilling out, two white doves in graceful flight near bell tower with motion blur, "
     "gnarled olive trees framing foreground silver leaves catching warm low sun, deep "
     "cinematic shadows, atmospheric morning haze. Shot on Hasselblad H6D-100c medium format, "
     "50mm Zeiss f/1.4, natural color grading. Vogue Weddings editorial cover. 9:16 vertical."),
    ("nocturne", "cover-v5",
     "Editorial wedding photograph of opulent Ottoman palace exterior at midnight. Deep "
     "indigo Bosphorus reflecting hundreds of warm golden window lights, massive antique "
     "crystal chandelier through tall arched window casting prismatic beams, faint stars in "
     "deep navy sky, elegant couple silhouette on marble balcony. Anamorphic lens flare. "
     "Midnight blue and warm gold palette. Leica M11, 35mm Summilux f/1.4. Vogue Weddings "
     "luxury editorial. 9:16 vertical."),
    ("candela", "cover-v5",
     "Editorial wedding photograph of historic Ottoman waterfront mansion interior at dusk. "
     "Hundreds of real flickering candles on long antique dining table with deep burgundy "
     "velvet runner, brass candelabras with warm bokeh, fresh rose petals catching candlelight, "
     "calm Bosphorus through tall arched window in soft background. Burgundy and warm gold "
     "candlelit palette. Hasselblad medium format. Vogue Weddings intimate editorial. 9:16 vertical."),
    ("mistral", "cover-v5",
     "Editorial wedding photograph of pristine Aegean cove at golden sunset. Traditional "
     "white Bodrum gulet sailboat with billowing canvas sails on turquoise water, "
     "whitewashed limestone houses cascading down hillside with vibrant magenta bougainvillea, "
     "weathered wooden jetty extending into sea, warm sunset light raking. Cream and Aegean "
     "blue palette, salt-air haze. Sony A7R V, 35mm GM f/1.4. Vogue Weddings coastal editorial. "
     "9:16 vertical."),
    ("olea", "cover-v5",
     "Editorial wedding photograph of ancient Aegean olive grove at early dawn. Single "
     "600-year-old massive gnarled olive tree silhouetted against soft pastel sunrise sky, "
     "silver-green leaves shimmering with morning dew droplets, soft mist rolling between "
     "trees, whitewashed stone village house with terracotta roof in background, golden hour "
     "filtering through branches. Cream and sage green palette. Canon EOS R5, 85mm f/1.2. "
     "Vogue Weddings Mediterranean editorial. 9:16 vertical."),
    ("aurora", "cover-v5",
     "Editorial architectural wedding photograph of restored Ottoman konak interior. Beam "
     "of warm directional sunlight through tall arched window onto polished travertine floor "
     "with sharp geometric shadow patterns from stone colonnade, single ancient pomegranate "
     "tree in inner courtyard with red fruits, two minimalist figures in flowing ivory silk "
     "in background. Warm beige with rose-gold and Future Dusk twilight purple accent. "
     "Phase One XT medium format, 80mm Schneider. Vogue Weddings contemporary editorial. "
     "9:16 vertical."),
]


def render(prompt: str, dest: Path) -> bool:
    body = json.dumps({
        "prompt": prompt,
        "aspect_ratio": "9:16",
        "num_images": 1,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://fal.run/fal-ai/imagen4/preview",
        data=body, headers=HDR, method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.loads(r.read())
        img_url = data.get("images", [{}])[0].get("url")
        if not img_url:
            print(f"  ✗ no url in response: {data}")
            return False
        with urllib.request.urlopen(img_url, timeout=120) as r2:
            dest.write_bytes(r2.read())
        return True
    except Exception as e:
        print(f"  ✗ {e}")
        return False


def main():
    for i, (ed, fn, p) in enumerate(PROMPTS, 1):
        edition_dir = OUT / ed
        edition_dir.mkdir(exist_ok=True)
        dest = edition_dir / f"{fn}.jpg"
        if dest.exists() and dest.stat().st_size > 100_000:
            print(f"[{i}/{len(PROMPTS)}] {ed}/{fn}.jpg cached, skip")
            continue
        print(f"\n[{i}/{len(PROMPTS)}] {ed} (Imagen4 sync) → rendering…")
        t0 = time.time()
        ok = render(p, dest)
        if ok:
            kb = dest.stat().st_size // 1024
            print(f"  ✓ saved ({kb} kB) in {int(time.time()-t0)}s")


if __name__ == "__main__":
    main()
