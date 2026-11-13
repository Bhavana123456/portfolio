// Designed, animated project previews in the portfolio palette.
// Used when a repo has no screenshot/preview image of its own.

/** chain-of-thought — what the model saw, how it reasoned, and why it decided. */
export function AuditTracePreview() {
  const evidence = [
    { id: "E1", src: "policy.pdf §4.2", text: "Water damage covered if sudden", score: 0.94 },
    { id: "E2", src: "claim_2041.json", text: "Pipe burst · reported same day", score: 0.88 },
    { id: "E3", src: "policy.pdf §7.1", text: "Excludes gradual leaks", score: 0.61 },
  ];
  const steps = [
    { k: "Prompt", v: "Approve claim #2041?", cites: [] as string[] },
    { k: "Reason", v: "Sudden burst, not gradual leak", cites: ["E2", "E3"] },
    { k: "Check", v: "Matches covered event", cites: ["E1"] },
    { k: "Decision", v: "Approve · 0.92 confidence", cites: ["E1", "E2"] },
  ];
  const t = (i: number) => ({ animationDelay: `${i * 0.7}s` });
  return (
    <div className="pv relative flex h-full gap-3 p-4 text-[10.5px] leading-snug">
      {/* reasoning chain */}
      <ol className="relative flex flex-1 flex-col justify-between">
        <span className="absolute bottom-2 left-[4px] top-2 w-px bg-line" aria-hidden />
        <span className="pv-trace absolute left-[4px] top-2 w-px bg-sage" aria-hidden />
        {steps.map((s, i) => (
          <li key={s.k} className="pv-step relative flex items-start gap-2.5" style={t(i + 1)}>
            <span className="pv-dot relative z-10 mt-0.5 h-[9px] w-[9px] shrink-0 rounded-full border border-line bg-card" style={t(i + 1)} />
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-[0.14em] text-mute">{s.k}</span>
              <span className="block truncate text-ink/90">{s.v}</span>
              {s.cites.length > 0 && (
                <span className="mt-0.5 flex gap-1">
                  {s.cites.map((c) => <span key={c} className="rounded border border-sage/40 px-1 text-[9px] text-sage">{c}</span>)}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
      {/* evidence + why */}
      <div className="hidden w-[46%] flex-col gap-2 sm:flex">
        <div className="rounded-lg border border-line bg-card/80 p-2.5">
          <span className="text-[9px] uppercase tracking-[0.14em] text-mute">Evidence retrieved</span>
          <ul className="mt-1.5 space-y-1.5">
            {evidence.map((e, i) => (
              <li key={e.id} className="pv-step" style={t(i * 0.6 + 0.5)}>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate"><span className="text-sage">{e.id}</span> <span className="text-mute">{e.src}</span></span>
                  <span className="tabular-nums text-mute">{e.score.toFixed(2)}</span>
                </div>
                <div className="truncate text-ink/85">{e.text}</div>
                <span className="mt-0.5 block h-[3px] rounded-full bg-line">
                  <span className="pv-line block h-full rounded-full bg-sage/70" style={{ width: `${e.score * 100}%`, ...t(i * 0.6 + 0.5) }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pv-badge rounded-lg border border-sage/40 bg-card/80 p-2.5">
          <span className="text-[9px] uppercase tracking-[0.14em] text-sage">Why approved</span>
          <p className="mt-1 text-ink/90">Burst was sudden (E2), which §4.2 covers (E1); the §7.1 exclusion doesn't apply.</p>
        </div>
      </div>
    </div>
  );
}

/** slacking-meow — focus timer; a pixel cat pops up when you drift off. */
export function FocusCatPreview() {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="pv flex h-full items-center justify-center p-4">
      <div className="relative w-[78%] max-w-[300px] overflow-hidden rounded-xl border border-line bg-card">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line" /><span className="h-1.5 w-1.5 rounded-full bg-line" /><span className="h-1.5 w-1.5 rounded-full bg-line" />
          <span className="ml-2 h-3.5 flex-1 rounded bg-frame px-2 text-[9px] leading-[14px] text-mute">
            <span className="pv-url-a">docs.project.dev</span><span className="pv-url-b">youtube.com</span>
          </span>
        </div>
        <div className="relative flex items-center gap-4 px-4 py-4">
          <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90" aria-hidden>
            <circle cx="42" cy="42" r={r} fill="none" stroke="#303030" strokeWidth="4" />
            <circle className="pv-ring" cx="42" cy="42" r={r} fill="none" stroke="#8DA58A" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={c} style={{ ["--c" as string]: c }} />
          </svg>
          <div>
            <p className="text-xl font-semibold tabular-nums tracking-tight text-ink">24:12</p>
            <p className="text-[10px] text-mute">focus session</p>
          </div>
          {/* the cat */}
          <div className="pv-cat absolute -bottom-1 right-3 flex flex-col items-end">
            <span className="pv-meow mb-1 rounded-md border border-line bg-frame px-1.5 py-0.5 text-[10px] text-ink">meow!</span>
            <PixelCat />
          </div>
        </div>
      </div>
    </div>
  );
}

function PixelCat() {
  // 12×9 pixel cat, drawn as rects for crisp scaling
  const rows = [
    "..X......X..",
    ".XXX....XXX.",
    ".XXXXXXXXXX.",
    "XXOXXXXXXOXX",
    "XXXXXPPXXXXX",
    "XXXXXXXXXXXX",
    ".XXXXXXXXXX.",
    "..XXXXXXXX..",
  ];
  const fill: Record<string, string> = { X: "#E9DCC6", O: "#171717", P: "#C9A28E" };
  return (
    <svg width="48" height="32" viewBox="0 0 12 8" shapeRendering="crispEdges" aria-hidden>
      {rows.flatMap((row, y) => [...row].map((ch, x) => ch !== "." && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill[ch]} />))}
    </svg>
  );
}

/** Fallback for future projects without an image: an abstract composition keyed to project kind. */
export function GenericPreview({ title, kind }: { title: string; kind: string }) {
  return (
    <div className="pv relative flex h-full flex-col justify-end overflow-hidden p-5">
      <div className="absolute inset-0 grid grid-cols-8 gap-1.5 p-5 opacity-60" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="pv-cell rounded-md bg-line/60" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
        ))}
      </div>
      <span className="relative text-[10px] uppercase tracking-[0.14em] text-mute">{kind}</span>
      <span className="relative mt-1 text-lg font-semibold tracking-tight text-ink">{title}</span>
    </div>
  );
}

export function ProjectPreview({ name, title, kind }: { name: string; title: string; kind: string }) {
  if (name === "chain-of-thought") return <AuditTracePreview />;
  if (name === "slacking-meow") return <FocusCatPreview />;
  if (kind === "ai") return <AuditTracePreview />;
  return <GenericPreview title={title} kind={kind} />;
}
