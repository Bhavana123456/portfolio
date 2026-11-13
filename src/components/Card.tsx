import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Card({ children, className = "", id, delay = 0 }: {
  children: ReactNode; className?: string; id?: string; delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -3 }}
      className={`relative scroll-mt-6 overflow-hidden rounded-card border border-line bg-card p-6 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_12px_30px_-18px_rgba(0,0,0,0.8)] transition-colors hover:border-[#3a3a3a] ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group inline-flex items-center gap-1.5 text-sm text-ink/90 transition-colors hover:text-ink ${className}`}
    >
      {children}
      <ArrowUpRight size={15} className="text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sage" />
    </a>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <p className="text-sm text-mute">{children}</p>;
}
