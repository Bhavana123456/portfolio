import { Home, FolderGit2, PenLine, User, Mail, Github, Star, Users, BookOpen, Linkedin, FileText, ArrowUpRight } from "lucide-react";
import { site } from "../config";
import { useProjects, useGitHub, useMedium, fmtDate, type Project } from "../services/data";
import { Card, ArrowLink, Muted } from "./Card";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { TechIcon } from "./TechIcon";

export function HeroCard() {
  return (
    <Card id="home" className="flex min-h-[340px] flex-col justify-between p-7 sm:p-9 md:col-span-2 lg:col-span-4 lg:row-span-2">
      <div className="flex items-start justify-between">
        <span className="label flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Available for collaborations
        </span>
        <a href="#contact" aria-label="Contact" className="group rounded-full border border-line p-2 transition-colors hover:border-sage">
          <ArrowUpRight size={16} className="text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage" />
        </a>
      </div>
      <div className="mt-10">
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">{site.name}</h1>
        <p className="mt-3 text-mute">{site.title}</p>
        <p className="mt-8 max-w-xl font-display text-2xl italic leading-snug text-ink/95 sm:text-3xl">{site.tagline}</p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mute">{site.intro}</p>
      </div>
    </Card>
  );
}

export function CharacterCard() {
  return (
    <Card id="about" delay={0.05} className="flex flex-col p-0 md:col-span-1 lg:col-span-2 lg:row-span-2">
      <div className="flex flex-1 items-center justify-center bg-[#151515]">
        <img
          src="/assets/character.gif"
          alt="Pixel-art illustration of Bhavna at her laptop with headphones, a sleeping cat beside her"
          className="pixelated w-full object-cover"
          width={508} height={337}
        />
      </div>
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <span className="label">Currently at the desk</span>
        <span className="font-mono text-[11px] text-sage">● online</span>
      </div>
    </Card>
  );
}

const NAV = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Projects", href: "#projects", icon: FolderGit2 },
  { label: "Blogs", href: "#blogs", icon: PenLine },
  { label: "About", href: "#about", icon: User },
  { label: "Contact", href: "#contact", icon: Mail },
];

export function NavigationCard() {
  return (
    <Card delay={0.08} className="md:col-span-1 lg:col-span-2">
      <nav aria-label="Sections">
        <ul className="grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-1">
          {NAV.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} className="group flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-mute transition-colors hover:bg-white/[0.03] hover:text-ink lg:flex-row lg:gap-3">
                <Icon size={17} strokeWidth={1.5} className="transition-colors group-hover:text-sage" />
                <span className="text-[11px] lg:text-sm">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
}

function ProjectBody({ p, label, fallbackPreview }: { p: Project; label: string; fallbackPreview: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-[#121212]">
        {p.preview ? <img src={p.preview} alt={`${p.title} preview`} className="h-full w-full object-cover" loading="lazy" /> : fallbackPreview}
      </div>
      <span className="label">{label}</span>
      <h3 className="mt-2 text-xl font-medium">{p.title}</h3>
      {p.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">{p.description}</p>}
      <div className="mt-4 flex flex-wrap gap-1.5">{p.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      <div className="mt-auto flex gap-5 pt-5">
        <ArrowLink href={p.url}>GitHub</ArrowLink>
        {p.demo && <ArrowLink href={p.demo}>Live demo</ArrowLink>}
      </div>
    </div>
  );
}

// Abstract previews used only when a repo has no screenshot file.
const AiPreview = (
  <div className="flex h-full flex-col justify-center gap-2 p-5 font-mono text-[11px] text-mute">
    {["prompt → received", "retrieve → 4 sources", "reason → step 3 of 3", "audit → trace written"].map((l, i) => (
      <div key={l} className="flex items-center gap-2"><span className={i === 3 ? "text-sage" : ""}>›</span>{l}</div>
    ))}
  </div>
);
const ExtPreview = (
  <div className="flex h-full items-center justify-center">
    <div className="w-40 rounded-xl border border-line bg-card p-3 text-left font-mono text-[11px] text-mute">
      <div className="mb-2 flex gap-1"><span className="h-1.5 w-1.5 rounded-full bg-line" /><span className="h-1.5 w-1.5 rounded-full bg-line" /></div>
      <div className="text-ink">=^.^= meow</div>
      <div>focus mode on</div>
    </div>
  </div>
);

export function ProjectCards() {
  const s = useProjects();
  if (s.status !== "ready") {
    return (
      <Card id="projects" className="md:col-span-2 lg:col-span-6">
        <Muted>{s.status === "loading" ? "Loading projects…" : "Projects couldn't be loaded right now."}</Muted>
      </Card>
    );
  }
  const { ai, extension } = s.data.featured;
  return (
    <>
      {ai && <Card id="projects" delay={0.1} className="md:col-span-1 lg:col-span-3"><ProjectBody p={ai} label="Featured · AI application" fallbackPreview={AiPreview} /></Card>}
      {extension && <Card id={ai ? undefined : "projects"} delay={0.12} className="md:col-span-1 lg:col-span-3"><ProjectBody p={extension} label="Featured · Chrome extension" fallbackPreview={ExtPreview} /></Card>}
      {s.data.more.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-6">
          <span className="label">More projects</span>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.data.more.map((p) => (
              <li key={p.name} className="rounded-2xl border border-line p-4">
                <ArrowLink href={p.url}>{p.title}</ArrowLink>
                {p.description && <p className="mt-1 line-clamp-2 text-xs text-mute">{p.description}</p>}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

export function TechStackCard() {
  return (
    <Card delay={0.14} className="md:col-span-1 lg:col-span-2">
      <span className="label">Tech stack</span>
      <ul className="mt-5 grid grid-cols-4 gap-3">
        {site.techStack.map((t) => (
          <li key={t} className="group flex flex-col items-center gap-1.5" title={t}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-mute transition-colors group-hover:border-sage/60 group-hover:text-ink">
              <TechIcon name={t} />
            </span>
            <span className="text-[10px] text-mute">{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function LearningCard() {
  return (
    <Card delay={0.16} className="md:col-span-1 lg:col-span-2">
      <span className="label">Currently exploring</span>
      <ul className="mt-5 flex flex-wrap gap-2">
        {site.exploring.map((t) => <li key={t} className="tag">{t}</li>)}
      </ul>
    </Card>
  );
}

export function GitHubStatsCard() {
  const s = useGitHub();
  return (
    <Card delay={0.18} className="md:col-span-2 lg:col-span-4">
      <div className="flex items-center justify-between">
        <span className="label flex items-center gap-2"><Github size={13} /> GitHub</span>
        {s.status === "ready" && <ArrowLink href={s.data.profileUrl}>@{s.data.login}</ArrowLink>}
      </div>
      {s.status === "loading" && <div className="mt-6"><Muted>Loading GitHub activity…</Muted></div>}
      {s.status === "error" && <div className="mt-6"><Muted>GitHub stats are unavailable right now.</Muted></div>}
      {s.status === "ready" && (() => {
        const g = s.data;
        const stats = [
          { k: "Repositories", v: g.publicRepos, icon: FolderGit2 },
          { k: "Stars", v: g.stars, icon: Star },
          { k: "Followers", v: g.followers, icon: Users },
          { k: "Following", v: g.following, icon: User },
        ];
        return (
          <>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ k, v, icon: Icon }) => (
                <div key={k} className="rounded-2xl border border-line px-4 py-3">
                  <dt className="flex items-center gap-1.5 text-[11px] text-mute"><Icon size={12} />{k}</dt>
                  <dd className="mt-1 text-2xl font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            {g.contributions && (
              <div className="mt-5">
                <p className="mb-2 text-xs text-mute"><span className="text-ink">{g.contributions.total}</span> contributions in the last year</p>
                <ContributionHeatmap weeks={g.contributions.weeks} />
              </div>
            )}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-mute">Most used languages</p>
                <div className="flex h-1.5 overflow-hidden rounded-full bg-line">
                  {g.languages.map((l, i) => (
                    <span key={l.name} style={{ width: `${l.percent}%`, opacity: 1 - i * 0.18 }} className="bg-sage" />
                  ))}
                </div>
                <ul className="mt-2 space-y-1">
                  {g.languages.map((l) => (
                    <li key={l.name} className="flex justify-between text-xs"><span>{l.name}</span><span className="tabular-nums text-mute">{l.percent}%</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs text-mute">Recent activity</p>
                <ul className="space-y-1.5">
                  {g.recent.map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-2 text-xs">
                      <a href={r.url} target="_blank" rel="noreferrer" className="truncate hover:text-sage">{r.name}</a>
                      <span className="shrink-0 text-mute">{fmtDate(r.pushedAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        );
      })()}
    </Card>
  );
}

export function MediumArticlesCard() {
  const s = useMedium();
  return (
    <Card id="blogs" delay={0.2} className="md:col-span-2 lg:col-span-2">
      <span className="label flex items-center gap-2"><BookOpen size={13} /> Latest from Medium</span>
      <div className="mt-5">
        {s.status === "loading" && <Muted>Loading articles…</Muted>}
        {s.status === "error" && <Muted>Articles are unavailable right now.</Muted>}
        {s.status === "ready" && !s.data.configured && <Muted>Medium feed not connected yet.</Muted>}
        {s.status === "ready" && s.data.configured && s.data.articles.length === 0 && <Muted>No articles to show right now.</Muted>}
        {s.status === "ready" && s.data.articles.length > 0 && (
          <ul className="divide-y divide-line">
            {s.data.articles.map((a) => (
              <li key={a.url} className="py-3 first:pt-0 last:pb-0">
                <a href={a.url} target="_blank" rel="noreferrer" className="group block">
                  <p className="text-[11px] text-mute">{fmtDate(a.date)}</p>
                  <p className="mt-1 text-sm font-medium leading-snug transition-colors group-hover:text-sage">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-mute">{a.summary}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

export function ContactCard() {
  const { email, linkedin, github, resume } = site.links;
  const links = [
    email && { label: "Email", href: `mailto:${email}`, icon: Mail },
    linkedin && { label: "LinkedIn", href: linkedin, icon: Linkedin },
    github && { label: "GitHub", href: github, icon: Github },
    resume && { label: "Resume", href: resume, icon: FileText },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Mail }[];
  return (
    <Card id="contact" delay={0.22} className="flex flex-col justify-between md:col-span-2 lg:col-span-6">
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <span className="label">Let's connect</span>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Let's build something meaningful.</h2>
          <p className="mt-3 max-w-lg text-sm text-mute">Open to opportunities and collaborations in product engineering, software development and AI.</p>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {links.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm transition-colors hover:border-sage/60">
                <span className="flex items-center gap-2"><Icon size={15} strokeWidth={1.5} className="text-mute" />{label}</span>
                <ArrowUpRight size={15} className="text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
