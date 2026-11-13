/**
 * Data sync — runs in GitHub Actions (and locally via `npm run sync`).
 * Discovers + ranks public repos, collects GitHub stats and Medium posts,
 * and writes generated JSON into public/data/. Never edit those files by hand.
 *
 * Env: GITHUB_TOKEN (required for contributions), GITHUB_USERNAME, MEDIUM_USERNAME
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { site } from "../src/config";

const USER = process.env.GITHUB_USERNAME || site.githubUsername;
const MEDIUM = process.env.MEDIUM_USERNAME || site.mediumUsername;
const TOKEN = process.env.GITHUB_TOKEN;
const OUT = new URL("../public/data/", import.meta.url);

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-sync",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

async function ghRaw(repo: string, file: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/contents/${file}`, {
    headers: { ...headers, Accept: "application/vnd.github.raw" },
  });
  return res.ok ? res.text() : null;
}

interface Repo {
  name: string; description: string | null; html_url: string; homepage: string | null;
  fork: boolean; archived: boolean; size: number; stargazers_count: number;
  language: string | null; pushed_at: string; default_branch: string; topics: string[];
}

// ---------- repository discovery ----------

const PRACTICE = /(tutorial|practice|challenge|bootcamp|leetcode|solutions?|snippets?|quiz|exercise|course|learn|clone|frontendmentor|first-contrib|hello|test|demo-?app)/i;
const NOISE = /(^|\/)(\.|node_modules|dist|build|vendor)|\.(lock|png|jpe?g|gif|svg|ico|webp|mp4|woff2?|ttf|map)$|(^|\/)(package-lock\.json|yarn\.lock|license|\.gitignore)$/i;
const AI = /\b(ai|llm|gpt|openai|anthropic|claude|gemini|langchain|ml|machine learning|rag|embedding|prompt)\b/i;

type Kind = "ai" | "extension" | "fullstack" | "react" | "python" | "tool" | "web";

async function analyse(repo: Repo) {
  const tree = await gh<{ tree: { path: string; type: string }[] }>(
    `/repos/${USER}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`,
  ).catch(() => ({ tree: [] }));
  const files = tree.tree.filter((t) => t.type === "blob").map((t) => t.path);
  const meaningful = files.filter((f) => !NOISE.test(f));

  const readme = (await ghRaw(repo.name, "README.md")) ?? "";
  const languages = await gh<Record<string, number>>(`/repos/${USER}/${repo.name}/languages`).catch(() => ({}));

  // Browser extension: any manifest.json with manifest_version
  const manifestPath = files.find((f) => /(^|\/)manifest\.json$/.test(f));
  const manifest = manifestPath ? await ghRaw(repo.name, manifestPath) : null;
  const isExtension = !!manifest && /manifest_version/.test(manifest);

  const pkgPaths = files.filter((f) => /(^|\/)package\.json$/.test(f)).slice(0, 3);
  const pkgs = (await Promise.all(pkgPaths.map((p) => ghRaw(repo.name, p)))).join("\n");
  const reqs = files.some((f) => /requirements\.txt|pyproject\.toml/.test(f))
    ? (await ghRaw(repo.name, files.find((f) => /requirements\.txt|pyproject\.toml/.test(f))!)) ?? ""
    : "";
  // Tools called over HTTP (e.g. Ollama) only show up in env/config files or the README.
  const envFile = files.find((f) => /(^|\/)\.env\.(example|sample)$/.test(f));
  const deps = pkgs + "\n" + reqs + "\n" + (envFile ? (await ghRaw(repo.name, envFile)) ?? "" : "") + "\n" + readme;

  const hasReact = /"react"/.test(pkgs);
  const hasBackend = /fastapi|flask|django|express|"hono"|"fastify"|nestjs/i.test(deps);
  const hasPython = "Python" in languages;
  const aiSignal = AI.test(`${repo.name} ${repo.description ?? ""} ${readme.slice(0, 3000)}`) || /openai|anthropic|langchain|transformers|google-generativeai/i.test(deps);

  const kind: Kind = aiSignal ? "ai" : isExtension ? "extension" : hasReact && hasBackend ? "fullstack"
    : hasReact ? "react" : hasPython ? "python" : /cli|tool|devtool/i.test(repo.description ?? "") ? "tool" : "web";

  // Tech tags, detected from dependencies and languages
  const tech = new Set<string>();
  const detect: [RegExp, string][] = [
    [/"react"/, "React"], [/"typescript"/, "TypeScript"], [/"next"/, "Next.js"], [/"vite"/, "Vite"],
    [/tailwindcss/, "Tailwind"], [/fastapi/i, "FastAPI"], [/flask/i, "Flask"], [/django/i, "Django"],
    [/"express"/, "Express"], [/sqlalchemy/i, "SQLAlchemy"], [/openai/i, "OpenAI"], [/anthropic/i, "Anthropic"],
    [/langchain/i, "LangChain"], [/ollama/i, "Ollama"], [/langfuse/i, "Langfuse"], [/sqlite/i, "SQLite"],
    [/postgres/i, "PostgreSQL"], [/"recharts"/, "Recharts"],
  ];
  for (const [re, label] of detect) if (re.test(deps)) tech.add(label);
  if (isExtension) tech.add("Chrome Extension");
  if (files.some((f) => /dockerfile/i.test(f))) tech.add("Docker");
  for (const l of Object.keys(languages).slice(0, 3)) if (!["HTML", "CSS"].includes(l)) tech.add(l);

  const demoMatch = readme.match(/https?:\/\/[^\s)]+\.(vercel\.app|netlify\.app|github\.io|railway\.app|onrender\.com)[^\s)]*/i);
  const demo = repo.homepage || demoMatch?.[0] || null;

  // ---------- ranking ----------
  const ageDays = (Date.now() - new Date(repo.pushed_at).getTime()) / 864e5;
  let score = 0;
  score += Math.min(30, Math.log2(meaningful.length + 1) * 5);
  score += Math.min(20, readme.length / 150);
  score += repo.description ? 10 : 0;
  score += demo ? 10 : 0;
  score += Math.min(10, repo.stargazers_count * 2);
  score += Math.min(10, Object.keys(languages).length * 3);
  score += ageDays < 180 ? 10 : ageDays < 730 ? 5 : 0;
  score += { ai: 15, extension: 12, fullstack: 12, tool: 8, react: 6, python: 6, web: 0 }[kind];

  const excludedReason =
    meaningful.length <= 5 ? "too few meaningful files"
    : PRACTICE.test(repo.name) || PRACTICE.test(repo.description ?? "") ? "practice/tutorial"
    : score < 45 ? "below quality threshold"
    : null;

  const excerpt = readme.replace(/```[\s\S]*?```/g, "").replace(/[#>*_`!\[\]]|\(.*?\)/g, "")
    .split("\n").map((l) => l.trim()).filter((l) => l.length > 40)[0] ?? null;

  // Preview priority: screenshot in public/previews/<repo>.png here, then one committed in the repo itself.
  const localPreview = existsSync(new URL(`../public/previews/${repo.name}.png`, import.meta.url));
  // Case study: first paragraph under README headings like "Problem", "Key decision", "Limitations".
  const section = (re: RegExp) => {
    const m = readme.match(new RegExp(`^#{2,4}\\s*(?:the\\s+|my\\s+)?(?:${re.source})[^\\n]*\\n+([\\s\\S]*?)(?=\\n#{1,4}\\s|(?![\\s\\S]))`, "im"));
    if (!m) return null;
    const para = m[1].replace(/```[\s\S]*?```/g, "").split(/\n\s*\n/).map((x) => x.replace(/^[-*]\s+/gm, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim()).find(Boolean);
    return para ? (para.length > 240 ? para.slice(0, 237).trimEnd() + "…" : para) : null;
  };
  const caseStudy = {
    problem: section(/problem|why|motivation/),
    decision: section(/key (?:technical )?decision|approach|architecture|how it works/),
    limitations: section(/limitations?|trade-?offs?|known issues/),
  };

  const preview = files.find((f) => /(screenshot|preview|demo|cover)[^/]*\.(png|jpe?g|gif|webp)$/i.test(f));

  return {
    name: repo.name,
    title: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description ?? excerpt,
    url: repo.html_url,
    demo,
    preview: localPreview ? `previews/${repo.name}.png` : preview ? `https://raw.githubusercontent.com/${USER}/${repo.name}/${repo.default_branch}/${preview}` : null,
    kind,
    tech: [...tech].slice(0, 8),
    caseStudy,
    stars: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    meaningfulFiles: meaningful.length,
    score: Math.round(score),
    excludedReason,
  };
}

// ---------- stats ----------

async function contributions() {
  if (!TOKEN) return null; // contribution calendar needs an authenticated GraphQL call
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST", headers, body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: { user?: { contributionsCollection?: { contributionCalendar?: {
      totalContributions: number; weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
    } } } };
  };
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions as number,
    weeks: cal.weeks.map((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
  };
}

// ---------- medium ----------

async function medium() {
  if (!MEDIUM) return { configured: false, articles: [] };
  const res = await fetch(`https://medium.com/feed/@${MEDIUM}`, { headers: { "User-Agent": "portfolio-sync" } });
  if (!res.ok) throw new Error(`Medium ${res.status}`);
  const xml = await res.text();
  const pick = (s: string, tag: string) =>
    s.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1]?.trim() ?? "";
  const articles = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5).map(([, item]) => {
    const body = pick(item, "content:encoded");
    const text = body.replace(/<(figure|pre|h[1-4])[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      title: pick(item, "title"),
      url: pick(item, "link").split("?")[0],
      date: new Date(pick(item, "pubDate")).toISOString(),
      summary: text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text,
    };
  });
  return { configured: true, articles };
}

// ---------- main ----------

async function main() {
  await mkdir(OUT, { recursive: true });
  const now = new Date().toISOString();

  const [user, repos] = await Promise.all([
    gh<{ login: string; html_url: string; public_repos: number; followers: number; following: number }>(`/users/${USER}`),
    gh<Repo[]>(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`),
  ]);

  const candidates = repos.filter((r) => !r.fork && !r.archived && r.size > 0);
  const analysed = (await Promise.all(candidates.map(analyse))).sort((a, b) => b.score - a.score);
  const shown = analysed.filter((p) => !p.excludedReason);

  // Featured: best AI project + best browser extension; everything else qualifies as "more".
  const featuredAi = shown.find((p) => p.kind === "ai") ?? null;
  const featuredExt = shown.find((p) => p.kind === "extension") ?? null;
  const featuredNames = new Set([featuredAi?.name, featuredExt?.name]);

  await writeFile(new URL("projects.json", OUT), JSON.stringify({
    generatedAt: now,
    featured: { ai: featuredAi, extension: featuredExt },
    more: shown.filter((p) => !featuredNames.has(p.name)).slice(0, 12),
    hidden: analysed.filter((p) => p.excludedReason).map(({ name, score, excludedReason }) => ({ name, score, excludedReason })),
  }, null, 2));

  const langBytes: Record<string, number> = {};
  await Promise.all(candidates.map(async (r) => {
    const l = await gh<Record<string, number>>(`/repos/${USER}/${r.name}/languages`).catch(() => ({}));
    for (const [k, v] of Object.entries(l)) langBytes[k] = (langBytes[k] ?? 0) + v;
  }));
  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;

  await writeFile(new URL("github.json", OUT), JSON.stringify({
    generatedAt: now,
    profileUrl: user.html_url,
    login: user.login,
    publicRepos: user.public_repos,
    stars: repos.filter((r) => !r.fork).reduce((s, r) => s + r.stargazers_count, 0),
    followers: user.followers,
    following: user.following,
    languages: Object.entries(langBytes).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, bytes]) => ({ name, percent: Math.round((bytes / totalBytes) * 1000) / 10 })),
    recent: repos.filter((r) => !r.fork).slice(0, 4).map((r) => ({ name: r.name, url: r.html_url, pushedAt: r.pushed_at })),
    contributions: await contributions(),
  }, null, 2));

  const med = await medium().catch((e) => ({ configured: true, articles: [], error: String(e) }));
  await writeFile(new URL("medium.json", OUT), JSON.stringify({ generatedAt: now, ...med }, null, 2));

  console.log(`Featured: ${featuredAi?.name ?? "-"}, ${featuredExt?.name ?? "-"} | shown ${shown.length}/${analysed.length}`);
  for (const p of analysed) console.log(`  ${String(p.score).padStart(3)} ${p.kind.padEnd(9)} ${p.name}${p.excludedReason ? `  (hidden: ${p.excludedReason})` : ""}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
