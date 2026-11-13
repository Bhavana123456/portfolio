// Monochrome glyphs for the tech stack, drawn with currentColor.
import { Github, Container, Zap } from "lucide-react";

const Txt = ({ t }: { t: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <text x="12" y="16" textAnchor="middle" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="currentColor">{t}</text>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d="M12 3c-4 0-4 1.6-4 3v2h4.5v1H5.5C3.8 9 3 10.4 3 12.5S3.8 16 5.5 16H7v-2.2C7 12.3 8.2 11 9.8 11h4.4c1.3 0 2.3-1 2.3-2.3V6c0-1.6-1.4-3-4.5-3Z" />
    <path d="M12 21c4 0 4-1.6 4-3v-2h-4.5v-1h7c1.7 0 2.5-1.4 2.5-3.5S20.2 8 18.5 8H17v2.2c0 1.5-1.2 2.8-2.8 2.8H9.8c-1.3 0-2.3 1-2.3 2.3V18c0 1.6 1.4 3 4.5 3Z" />
  </svg>
);

export function TechIcon({ name }: { name: string }) {
  switch (name) {
    case "React": return <ReactIcon />;
    case "TypeScript": return <Txt t="TS" />;
    case "JavaScript": return <Txt t="JS" />;
    case "Python": return <PythonIcon />;
    case "FastAPI": return <Zap size={19} strokeWidth={1.4} />;
    case "Docker": return <Container size={19} strokeWidth={1.4} />;
    case "GitHub": return <Github size={19} strokeWidth={1.4} />;
    default: return <Txt t={name.slice(0, 2)} />;
  }
}
