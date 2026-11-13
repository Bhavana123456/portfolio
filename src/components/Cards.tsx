import { Home, FolderGit2, PenLine, User, Mail, Github, BookOpen, Linkedin, FileText, ArrowUpRight } from "lucide-react";
import { site } from "../config";
import { useState, type FormEvent } from "react";
import { useProjects, useMedium, fmtDate, asset, type Project } from "../services/data";
import { Card, ArrowLink, Muted } from "./Card";
import { TechIcon } from "./TechIcon";
import { ProjectPreview } from "./Previews";

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
        <h1 className="font-display font-semibold text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{site.name}</h1>
        <p className="mt-3 text-mute">{site.title}</p>
        <p className="mt-8 max-w-xl font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-ink/95 sm:text-3xl">{site.tagline}</p>
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
          src={asset("assets/character.gif")}
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

function ProjectBody({ p, label }: { p: Project; label: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-[#121212]">
        {p.preview
          ? <img src={asset(p.preview)} alt={`${p.title} preview`} className="h-full w-full object-cover object-top" loading="lazy" />
          : <ProjectPreview name={p.name} title={p.title} kind={p.kind} />}
      </div>
      <span className="label">{label}</span>
      <h3 className="mt-2 text-xl font-medium">{p.title}</h3>
      {p.description && <p className="mt-2 text-sm leading-relaxed text-mute">{p.description}</p>}
      {p.caseStudy && <CaseStudy cs={p.caseStudy} />}
      <div className="mt-4 flex flex-wrap gap-1.5">{p.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      <div className="mt-auto flex gap-5 pt-5">
        <ArrowLink href={p.url}>GitHub</ArrowLink>
        {p.demo && <ArrowLink href={p.demo}>Live demo</ArrowLink>}
      </div>
    </div>
  );
}

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
      {ai && <Card id="projects" delay={0.1} className="md:col-span-1 lg:col-span-3"><ProjectBody p={ai} label="Featured · AI application" /></Card>}
      {extension && <Card id={ai ? undefined : "projects"} delay={0.12} className="md:col-span-1 lg:col-span-3"><ProjectBody p={extension} label="Featured · Chrome extension" /></Card>}
      {s.data.more.length > 0 && <MoreProjects projects={s.data.more} />}
    </>
  );
}

function CaseStudy({ cs }: { cs: NonNullable<Project["caseStudy"]> }) {
  const rows = [["Problem", cs.problem], ["Key decision", cs.decision], ["Limitations", cs.limitations]].filter(([, v]) => v);
  if (!rows.length) return null;
  return (
    <dl className="mt-4 space-y-2.5 border-l border-line pl-4">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-mute">{k}</dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-ink/90">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// Ranked list of other qualifying repos: top 3 shown, the rest behind a toggle.
function MoreProjects({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const visible = open ? projects : projects.slice(0, 3);
  return (
    <Card className="md:col-span-2 lg:col-span-6">
      <div className="flex items-center justify-between">
        <span className="label">More projects</span>
        <ArrowLink href={`${site.links.github}?tab=repositories`}>All repositories</ArrowLink>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.name} className="flex gap-3 rounded-2xl border border-line p-3">
            {p.preview && <img src={asset(p.preview)} alt="" className="h-14 w-20 shrink-0 rounded-lg border border-line object-cover object-top" loading="lazy" />}
            <div className="min-w-0">
              <ArrowLink href={p.url}>{p.title}</ArrowLink>
              {p.description && <p className="mt-1 line-clamp-2 text-xs text-mute">{p.description}</p>}
              <p className="mt-1.5 truncate text-[11px] text-mute/80">{p.tech.slice(0, 3).join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>
      {projects.length > 3 && (
        <button onClick={() => setOpen(!open)} className="mt-4 text-sm text-mute transition-colors hover:text-ink">
          {open ? "Show less" : `Show ${projects.length - 3} more`}
        </button>
      )}
    </Card>
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

export function MediumArticlesCard() {
  const s = useMedium();
  return (
    <Card id="blogs" delay={0.2} className="md:col-span-2 lg:col-span-6">
      <span className="label flex items-center gap-2"><BookOpen size={13} /> Latest from Medium</span>
      <div className="mt-5">
        {s.status === "loading" && <Muted>Loading articles…</Muted>}
        {s.status === "error" && <Muted>Articles are unavailable right now.</Muted>}
        {s.status === "ready" && !s.data.configured && <Muted>Medium feed not connected yet.</Muted>}
        {s.status === "ready" && s.data.configured && s.data.articles.length === 0 && <Muted>No articles to show right now.</Muted>}
        {s.status === "ready" && s.data.articles.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.data.articles.map((a) => (
              <li key={a.url} className="rounded-2xl border border-line p-4 transition-colors hover:border-sage/50">
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
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col">
          <span className="label">Let's connect</span>
          <h2 className="mt-3 font-display font-semibold text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">Let's build something meaningful.</h2>
          <p className="mt-3 max-w-lg text-sm text-mute">Open to opportunities and collaborations in product engineering, software development and AI.</p>
        <ul className="mt-auto grid grid-cols-2 gap-2 pt-6">
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
        {site.contactFormEndpoint ? <ContactForm /> : email && (
          <a href={`mailto:${email}`} className="group flex flex-col justify-center rounded-2xl border border-line p-6 transition-colors hover:border-sage/60">
            <span className="label">Email me directly</span>
            <span className="mt-2 flex items-center gap-2 break-all text-xl font-medium sm:text-2xl">{email}
              <ArrowUpRight size={20} className="shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage" /></span>
            <span className="mt-2 text-sm text-mute">I usually reply within a day or two.</span>
          </a>
        )}
      </div>
    </Card>
  );
}

const field = "w-full rounded-xl border border-line bg-frame px-4 py-3 text-sm text-ink placeholder:text-mute/70 outline-none transition-colors focus:border-sage/70";

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!site.contactFormEndpoint) return setStatus("error");
    setStatus("sending");
    try {
      const res = await fetch(site.contactFormEndpoint, {
        method: "POST", headers: { Accept: "application/json" }, body: new FormData(e.currentTarget),
      });
      if (!res.ok) throw new Error();
      e.currentTarget.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5">
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="sr-only" htmlFor="c-name">Name</label>
        <input id="c-name" name="name" required placeholder="Name" className={field} autoComplete="name" />
        <label className="sr-only" htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" required placeholder="Email" className={field} autoComplete="email" />
      </div>
      <label className="sr-only" htmlFor="c-msg">Message</label>
      <textarea id="c-msg" name="message" required rows={4} placeholder="What are you building?" className={`${field} resize-none`} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-mute" role="status">
          {status === "sent" && <span className="text-sage">Thanks — I'll get back to you soon.</span>}
          {status === "error" && "Couldn't send right now. Please try again later."}
        </p>
        <button type="submit" disabled={status === "sending"}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-frame transition-opacity hover:opacity-90 disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send message"}
          <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
