# NVIDIA Parakeet TDT 0.6B v3 int8 (sherpa-onnx) - word timings

Put these files in this folder with exactly these names. The skill never downloads them for you;
`node scripts/setup.mjs` checks them (size + sha256) and prints these links if anything is missing.

| File | Size | Link | sha256 |
|---|---|---|---|
| `encoder.int8.onnx` | 622.0 MB | [download](https://huggingface.co/csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/resolve/2bda32ec70b097a55adaa07d9a7173915b43cc78/encoder.int8.onnx) | `acfc2b4456377e15d04f0243af540b7fe7c992f8d898d751cf134c3a55fd2247` |
| `decoder.int8.onnx` | 11.3 MB | [download](https://huggingface.co/csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/resolve/2bda32ec70b097a55adaa07d9a7173915b43cc78/decoder.int8.onnx) | `179e50c43d1a9de79c8a24149a2f9bac6eb5981823f2a2ed88d655b24248db4e` |
| `joiner.int8.onnx` | 6.1 MB | [download](https://huggingface.co/csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/resolve/2bda32ec70b097a55adaa07d9a7173915b43cc78/joiner.int8.onnx) | `3164c13fc2821009440d20fcb5fdc78bff28b4db2f8d0f0b329101719c0948b3` |
| `tokens.txt` | 0.1 MB | [download](https://huggingface.co/csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/resolve/2bda32ec70b097a55adaa07d9a7173915b43cc78/tokens.txt) | `d58544679ea4bc6ac563d1f545eb7d474bd6cfa467f0a6e2c1dc1c7d37e3c35d` |

Source: https://huggingface.co/csukuangfj/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8/tree/2bda32ec70b097a55adaa07d9a7173915b43cc78

Same revision, sizes and sha256 that hyperframes@0.8.156 pins. tokens.txt is checked after CRLF -> LF (browsers on Windows often save it with CRLF).
