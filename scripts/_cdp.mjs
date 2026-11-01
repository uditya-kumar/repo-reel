// A tiny headless-Chrome driver over the DevTools protocol (Node's built-in fetch + WebSocket, no npm packages), for
// capture.mjs and peek.mjs. Chrome is found from config ("chrome" in config.local.json), CHROME_PATH, the usual install
// paths, or puppeteer's cache (HyperFrames installs one there). Each run uses its own temp profile, so it never touches
// your browser or the Chrome DevTools MCP's profile.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { CFG, home, fail } from "./_common.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function findChrome() {
  const c = [CFG.chrome && home(CFG.chrome), process.env.CHROME_PATH];
  if (process.platform === "win32") {
    for (const b of [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(Boolean))
      c.push(path.join(b, "Google/Chrome/Application/chrome.exe"), path.join(b, "Microsoft/Edge/Application/msedge.exe"));
  } else if (process.platform === "darwin") {
    c.push("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium");
  } else c.push("/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser");
  const pc = path.join(os.homedir(), ".cache/puppeteer/chrome");
  if (fs.existsSync(pc)) for (const v of fs.readdirSync(pc).sort().reverse()) {
    const d = path.join(pc, v), exe = fs.readdirSync(d).map((s) => path.join(d, s, process.platform === "win32" ? "chrome.exe" : "chrome")).find((f) => fs.existsSync(f));
    if (exe) c.push(exe);
  }
  return c.filter(Boolean).find((f) => fs.existsSync(f)) || null;
}

export async function browser() {
  const exe = findChrome();
  if (!exe) fail('no Chrome found. Install Google Chrome, or set "chrome": "<path to chrome>" in scripts/config.local.json');
  const ud = fs.mkdtempSync(path.join(os.tmpdir(), "reel-cdp-"));
  const proc = spawn(exe, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${ud}`, "--no-first-run",
    "--no-default-browser-check", "--hide-scrollbars", "--allow-file-access-from-files", "--disable-gpu", "about:blank"], { stdio: "ignore" });
  let port = null;
  for (let i = 0; i < 150 && !port; i++) {
    const f = path.join(ud, "DevToolsActivePort");
    if (fs.existsSync(f)) port = fs.readFileSync(f, "utf8").split("\n")[0].trim() || null;
    if (!port) await sleep(100);
  }
  if (!port) { proc.kill(); fail(`Chrome didn't start its DevTools port (${exe})`); }
  let target = null;
  for (let i = 0; i < 50 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* not up yet */ }
    if (!target) await sleep(100);
  }
  if (!target) { proc.kill(); fail("Chrome has no page target"); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("DevTools socket failed")); });
  let id = 0;
  const pending = new Map(), listeners = new Set();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else listeners.forEach((fn) => fn(m));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable");
  return {
    // viewport w x h CSS px at dpr; dark = prefers-color-scheme: dark
    async emulate({ w, h, dpr = 1, dark = true }) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: dpr, mobile: false });
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: dark ? "dark" : "light" }] });
    },
    async goto(url, settle = 1500) {
      const loaded = new Promise((r) => { const fn = (m) => { if (m.method === "Page.loadEventFired") { listeners.delete(fn); r(); } }; listeners.add(fn); });
      await send("Page.navigate", { url });
      await Promise.race([loaded, sleep(30000)]);
      await sleep(settle);
    },
    // run a function source (string) in the page; returns its JSON value (async functions are awaited)
    async eval(fn) {
      const r = await send("Runtime.evaluate", { expression: `(${fn})()`, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(`page script failed: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
      return r.result.value;
    },
    // the viewport, or clip = { x, y, width, height } in CSS px (output px = CSS px x dpr)
    async shot(file, o = {}) {
      const r = await send("Page.captureScreenshot", { format: o.format || "png", ...(o.quality ? { quality: o.quality } : {}),
        ...(o.clip ? { clip: { ...o.clip, scale: 1 }, captureBeyondViewport: true } : {}) });
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(r.data, "base64"));
      return file;
    },
    async close() {
      try { ws.close(); } catch { /* gone */ }
      proc.kill();
      for (let i = 0; i < 20; i++) { try { fs.rmSync(ud, { recursive: true, force: true }); break; } catch { await sleep(150); } }
    },
  };
}
