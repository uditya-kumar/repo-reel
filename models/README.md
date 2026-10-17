# models/

Local model files, downloaded by you once. Nothing here is committed (see `.gitignore`).

- `kokoro/`: Kokoro v1.0 text-to-speech (voice), about 340 MB
- `parakeet/`: NVIDIA Parakeet TDT 0.6B v3 int8 speech recognition (word timings for captions), about 640 MB

Each folder has a README with the exact files and links. After downloading, run:

    node scripts/setup.mjs

To keep the models somewhere else, set `"modelsDir"` in `scripts/config.local.json` to a folder that contains `kokoro/` and `parakeet/`.
