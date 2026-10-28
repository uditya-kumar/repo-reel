// Shared by 04-study and 05-build (a hold cut): the Claude Code session that logs what it reads, and replica/recon.md
// (README example: 18 screens, 7 flows, the data model, features.csv, the partner marketplace out of scope).
// Drawn in InterfaceDesignGuideline.md (scripts/lib/ui.cjs).
module.exports = (L, p) => {
  const { typed } = L;
  const U = require("../lib/ui.cjs")(L), C = U.C, P = require("./_plan.cjs");
  const ST = P.R.studyTerm, RC = P.R.recon;
  const logs = [["Read", "help center, pricing page"], ["Read", "store listing screenshots"], ["Map", "7 user flows"], ["Write", "replica/recon.md"]];
  const termInner = logs.map(([v, t], i) => U.ccLine(`${p}-lg${i}`, 24, 64 + i * 36, v, typed(`${p}-lt${i}`, t), { kind: i === 3 ? "run" : "done", w: ST[2] - 60 })).join("");
  const term = U.win(`${p}-st`, ...ST, "Claude Code", termInner);
  const flows = ["Guest books a meeting", "Host sets availability", "Guest reschedules"];
  const model = [["users", 520, 262, C.iris], ["event types", 650, 262, C.iris], ["availability", 520, 314, C.lav], ["bookings", 718, 314, C.lav]];
  const reconInner =
    U.tx(`${p}-rh`, 30, 66, "Recon map", { fs: 34, fw: 510, c: C.paper }) +
    U.box(`${p}-s0`, 30, 118, 260, 76, "", U.tx(`${p}-n0`, 0, 0, "18", { fs: 64, fw: 510, c: C.paper }) + U.tx("", 92, 34, "screens", { fs: 22, c: C.fog })) +
    U.box(`${p}-s1`, 300, 118, 200, 76, "", U.tx(`${p}-n1`, 0, 0, "7", { fs: 64, fw: 510, c: C.paper }) + U.tx("", 56, 34, "flows", { fs: 22, c: C.fog })) +
    flows.map((f, i) => U.box(`${p}-f${i}`, 30, 214 + i * 40, 440, 34, "", U.status("", 0, 5, "done", 24) + U.tx("", 36, 4, f, { fs: 22 }))).join("") +
    U.tx(`${p}-dm`, 520, 214, "Data model", { fs: 22, fw: 510, c: C.paper }) +
    model.map(([t, x, y, c], i) => U.pill(`${p}-c${i}`, x, y, t, { dot: c })).join("") +
    U.divider(30, 384, RC[2] - 60) +
    U.box(`${p}-fc`, 30, 404, RC[2] - 60, 48, "", U.pill("", 0, 5, "features.csv", { mono: true }) + U.tx("", 190, 12, "the feature matrix", { fs: 22, c: C.fog }) +
      U.badge(`${p}-fct`, RC[2] - 60 - U.badgeW("Ready", 19, true), 7, "Ready", "green")) +
    U.box(`${p}-os`, 30, 464, RC[2] - 60, 48, "", U.tx("", 0, 12, "The partner marketplace", { fs: 22 }) +
      U.badge(`${p}-ost`, RC[2] - 60 - U.badgeW("Out of scope", 19, true), 7, "Out of scope", "coral"));
  const recon = U.win(`${p}-rc`, ...RC, "replica/recon.md", reconInner);
  return { term, recon, reconInner, logs, flows, model, ST, RC, U };
};
