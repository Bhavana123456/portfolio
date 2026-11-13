import { ChevronDown } from "lucide-react";
import { site } from "../config";
import { asset } from "../services/data";
import { Card, ArrowLink } from "./Card";

export function ShippedCard() {
  return (
    <Card id="work" delay={0.16} className="md:col-span-2 lg:col-span-3">
      <span className="label">What I've shipped</span>
      <p className="mt-2 text-sm text-mute">6+ years of production frontend work with React and TypeScript.</p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {site.shipped.map((s) => {
          const rows = [["Problem", s.problem], ["My contribution", s.contribution], ["Key decision", s.decision]].filter(([, v]) => v);
          if (!rows.length) return <li key={s.title} className="py-3 text-[15px]">{s.title}</li>;
          return (
            <li key={s.title}>
              <details className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] marker:hidden">
                  {s.title}
                  <ChevronDown size={16} className="shrink-0 text-mute transition-transform group-open:rotate-180 group-hover:text-sage" />
                </summary>
                <dl className="mt-3 space-y-2.5 border-l border-line pl-4">
                  {rows.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] uppercase tracking-[0.14em] text-mute">{k}</dt>
                      <dd className="mt-0.5 text-sm leading-relaxed text-ink/90">{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function DemoCard() {
  return (
    <Card delay={0.18} className="md:col-span-2 lg:col-span-3">
      <div className="flex items-center justify-between">
        <span className="label">Working demo · Slacking Meow</span>
        <ArrowLink href="https://github.com/Bhavana123456/slacking-meow">Source</ArrowLink>
      </div>
      <video
        className="mt-4 w-full rounded-2xl border border-line"
        src={asset("demos/slacking-meow.webm")}
        poster={asset("demos/slacking-meow-poster.png")}
        autoPlay muted loop playsInline preload="metadata"
        aria-label="Screen recording: starting a focus session, then opening a video site where cats pop in and a 'Back to work' banner appears"
      />
      <p className="mt-3 text-sm leading-relaxed text-mute">
        Real recording of the extension: start a focus session, wander to a distracting site, and the cats show up —
        faster the longer you stay. Close the tab and they're gone.
      </p>
    </Card>
  );
}
