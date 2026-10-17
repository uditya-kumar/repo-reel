# Step 4. Local Kokoro TTS for the approved script, exactly as v3 (af_heart, 1.14x, trims, 0.3 s gaps, loudnorm).
# Usage: python tts.py <projectDir>
# Reads script/lines.json [{id,text}]. Writes assets/audio/narration-raw.wav, narration.wav (48 kHz mono, -16 LUFS)
# and narration.json {total, lines:[{id,text,start,duration}]}.
import json, os, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8"); sys.stderr.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
NL = "\n"

def fail(msg):
    print(NL + "✗ " + msg, file=sys.stderr); sys.exit(1)

# config.json + optional config.local.json (same merge as _common.mjs)
def merge(a, b):
    for k, v in b.items():
        a[k] = merge(a.get(k) or {}, v) if isinstance(v, dict) else v
    return a
CFG = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))
LOCAL = os.path.join(HERE, "config.local.json")
if os.path.exists(LOCAL): CFG = merge(CFG, json.load(open(LOCAL, encoding="utf-8")))
V = CFG["voice"]

# Kokoro files from <modelsDir>/kokoro, checked against models.json; never downloaded here
M = json.load(open(os.path.join(HERE, "models.json"), encoding="utf-8"))["kokoro"]
mdir = os.path.expanduser(CFG["modelsDir"])
mdir = os.path.join(mdir if os.path.isabs(mdir) else os.path.join(SKILL, mdir), "kokoro")
bad = []
for f in M["files"]:
    p = os.path.join(mdir, f["name"])
    if not os.path.exists(p): bad.append((f, "missing"))
    elif os.path.getsize(p) != f["bytes"]: bad.append((f, f"wrong size ({os.path.getsize(p)} bytes, expected {f['bytes']})"))
if bad:
    msg = [f"{M['name']}: file(s) needed in", "  " + mdir, ""]
    for f, why in bad: msg += [f"  ✗ {f['name']}  ({why})", f"    download: {f['url']}"]
    msg += ["", "  Put them in that folder with the exact names, then run: node " + os.path.join(HERE, "setup.mjs")]
    fail(NL.join(msg))
MODEL, VOICES = (os.path.join(mdir, f["name"]) for f in M["files"])

try:
    import numpy as np, soundfile as sf
    from kokoro_onnx import Kokoro
except ImportError as e:
    fail(f"Python package missing ({e.name}). Install with:{NL}  {sys.executable} -m pip install kokoro-onnx==0.6.1 soundfile numpy")

if len(sys.argv) < 2: fail("usage: python tts.py <projectDir>")
DIR = os.path.abspath(sys.argv[1])
LINES_F = os.path.join(DIR, "script", "lines.json")
if not os.path.exists(LINES_F): fail(f"missing {LINES_F} (write it after the script is approved)")
LINES = json.load(open(LINES_F, encoding="utf-8"))
OUT = os.path.join(DIR, "assets", "audio")
os.makedirs(OUT, exist_ok=True)

k = Kokoro(MODEL, VOICES)
meta, chunks, t, sr_out = [], [], 0.0, None
for i, ln in enumerate(LINES):
    samples, sr = k.create(ln["text"], voice=V["voice"], speed=V["speed"], lang=V["lang"])
    sr_out = sr
    a = np.abs(samples); idx = np.where(a > V["trimThreshold"])[0]
    samples = samples[max(0, idx[0] - int(V["trimPre"] * sr)): min(len(samples), idx[-1] + int(V["trimPost"] * sr))]
    d = len(samples) / sr
    meta.append({"id": ln["id"], "text": ln["text"], "start": round(t, 3), "duration": round(d, 3)})
    chunks.append(samples); t += d
    if i < len(LINES) - 1:
        chunks.append(np.zeros(int(V["gap"] * sr), dtype=samples.dtype)); t += V["gap"]
    print(f"  {ln['id']:<10} {d:6.2f}s  {ln['text'][:60]}")

raw = os.path.join(OUT, "narration-raw.wav")
sf.write(raw, np.concatenate(chunks), sr_out)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", V["loudnorm"], "-ar", "48000", "-ac", "1",
                os.path.join(OUT, "narration.wav")], check=True)
json.dump({"total": round(t, 3), "lines": meta}, open(os.path.join(OUT, "narration.json"), "w", encoding="utf-8"), indent=2)

print(f"{NL}voice length {t:.2f}s (target {V['minSeconds']}-{V['maxSeconds']}s incl. CTA)")
if t > V["maxSeconds"]: fail(f"voice is {t:.2f}s, over {V['maxSeconds']}s. Shorten the script and get it re-approved.")
if t < V["minSeconds"]: print(f"⚠ voice is under {V['minSeconds']}s; fine if the script was approved that way, but v3 sat at ~46.8s")
print("✓ narration.wav written")
