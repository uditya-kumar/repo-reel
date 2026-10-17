// Fixed CTA scene (DESIGN.md 6.1). Content comes from script/reel.json -> cta:
//   { "url": "github.com/owner/repo",
//     "trust": [ { "text": "No server", "kind": "x", "word": "server" },
//                { "text": "No account", "kind": "x", "word": "account" },
//                { "text": "Runs on your PC", "word": "PC" } ] }
// All trust items but the last stack on top, the last sits under the device. Each pops on its spoken word.
module.exports = (L, s, reel) => L.ctaScene(s, { url: reel.url, ...(reel.cta || {}) });
