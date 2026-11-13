// Designed, animated project previews in the portfolio palette.
// Used when a repo has no screenshot/preview image of its own.

/** chain-of-thought — a prompt flowing through an audited reasoning chain. */
export function AuditTracePreview() {
  const steps = [
    { k: "Prompt", v: "Should this claim be approved?" },
    { k: "Retrieve", v: "policy.pdf · claim_2041.json" },
    { k: "Reason", v: "Coverage matches clause 4.2" },
    { k: "Decision", v: "Approve · confidence 0.92" },
  ];
  return (
    <div className="pv relative flex h-full gap-4 p-5 text-[11px]">
      <ol className="relative flex flex-1 flex-col justify-between">
        <span className="absolute bottom-3 left-[5px] top-3 w-px bg-line" aria-hidden />
        <span className="pv-trace absolute left-[5px] top-3 w-px bg-sage" aria-hidden />
        {steps.map((s, i) => (
          <li key={s.k} className="pv-step relative flex items-start gap-3" style={{ animationDelay: `${i * 0.9}s` }}>
            <span className="pv-dot relative z-10 mt-0.5 h-[11px] w-[11px] shrink-0 rounded-full border border-line bg-card" style={{ animationDelay: `${i * 0.9}s` }} />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-mute">{s.k}</span>
              <span className="block truncate text-ink/90">{s.v}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="hidden w-[38%] flex-col rounded-xl border border-line bg-card/80 p-3 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.14em] text-mute">Audit record</span>
        <div className="mt-3 space-y-2">
          {[78, 92, 64, 85, 56].map((w, i) => (
            <span key={i} className="pv-line block h-1.5 rounded-full bg-mute/30" style={{ width: `${w}%`, animationDelay: `${0.4 + i * 0.6}s` }} />
          ))}
        </div>
        <span className="pv-badge mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-sage/40 px-2 py-0.5 text-[10px] text-sage">
          <span className="h-1 w-1 rounded-full bg-sage" /> traceable
        </span>
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
