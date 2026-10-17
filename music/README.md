# music/

Put one background track here (mp3, wav, m4a, aac, ogg or flac). The first audio file in this folder is used,
or set `"music": {"file": "..."}` in `scripts/config.local.json` to point at a track anywhere.

- 40 to 90 seconds long (a reel longer than the track restarts it in a speech pause, as often as needed; reels are at most 90 s)
- licensed for use on Instagram/TikTok/YouTube. Royalty-free is not always "free for social"; check the licence
- any loudness: the skill measures it and sets the volume so the bed sits about 24 LUFS under the voice
- its tempo, for beat-synced cuts: set `"music": {"bpm": 120, "beatPhase": 0.25}` in `scripts/config.local.json` (beatPhase = the time in seconds of any beat in the file). Without it, cuts land on words only

No track ships with the skill.
