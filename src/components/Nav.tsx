import { useEffect, useId, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link, useRoute, type Page } from "../router";
import { SITE } from "../data/lab";
import { GithubIcon } from "./icons";
import { cn } from "../utils/cn";

const LINKS: { to: Page; label: string }[] = [
  { to: "", label: "Home" },
  { to: "research", label: "Research" },
  { to: "publications", label: "Publications" },
  { to: "people", label: "People" },
];

/**
 * ILRL mark — isometric infinity loop.
 * Each render gets unique SVG filter/gradient IDs via useId().
 */
export function LogoMark({ className, dark = false }: { className?: string; dark?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const accent = dark ? "var(--color-diagram-top)" : "var(--color-lime)";
  const accentMid = dark ? "var(--color-diagram-front)" : "var(--color-limedeep)";
  const accentDim = dark ? "var(--color-diagram-midside)" : "var(--color-limedim)";
  const accentBright = dark ? "var(--color-diagram-lighttop)" : "var(--color-diagram-midtop)";

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <filter id={`lg-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.6"
            floodColor="var(--color-fog)"
            floodOpacity="0.12"
          />
        </filter>
        <linearGradient id={`gn-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accentMid} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id={`gg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accentBright} />
          <stop offset="100%" stopColor={accentDim} />
        </linearGradient>
      </defs>
      <g filter={`url(#lg-${uid})`}>
        {/* back arc — semi-transparent to create crossover depth */}
        <path
          d="M20 15.5 C26 8, 36 10, 35 18 C34 26, 26 28, 20 24.5"
          fill="none"
          stroke={accent}
          strokeWidth="3.6"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* left loop */}
        <path
          d="M20 24.5 C14 32, 4 30, 5 22 C6 14, 14 12, 20 15.5"
          fill="none"
          stroke={`url(#gn-${uid})`}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* front arc — over the crossover */}
        <path
          d="M20 15.5 C26 8, 36 10, 35 18 C34 26, 26 28, 20 24.5"
          fill="none"
          stroke={`url(#gn-${uid})`}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* dimensional crossover diamond */}
        <path
          d="M17.5 20 L20 16 L22.5 20 L20 24 Z"
          fill={`url(#gg-${uid})`}
        />
        {/* directional tick */}
        <path
          d="M30 13 L32.5 15.5 L29.5 15"
          fill="none"
          stroke={accentDim}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function Nav() {
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [route.page, route.anchor]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 hairline-b bg-ink/90 backdrop-blur-lg transition-shadow duration-300",
        scrolled && !open && "shadow-card"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* wordmark */}
        <Link to="" className="group flex items-center gap-3" ariaLabel="ILRL home">
          <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-500 ease-out group-hover:scale-110" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.25rem] font-semibold tracking-tight text-fog">
              {SITE.short}
            </span>
            <span className="mt-1 hidden font-mono text-[9.5px] tracking-[0.18em] text-fogmute uppercase sm:block">
              Inference-in-Loop &amp; Recurrence
            </span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const active = route.page === l.to;
            return (
              <Link
                key={l.label}
                to={l.to}
                className={cn(
                  "relative px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-200",
                  active ? "text-fog" : "text-fogsoft hover:text-fog"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-[1.5px] rounded-full bg-limedim transition-transform duration-300 origin-left ease-out",
                    active ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            );
          })}
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="ILRL on GitHub"
            className="ml-2 rounded-full p-2 text-fogsoft transition-colors hover:bg-inkraise hover:text-fog"
          >
            <GithubIcon size={17} />
          </a>
          <Link
            to=""
            anchor="join"
            className="group ml-2 inline-flex items-center gap-1.5 rounded-full bg-lime px-4.5 py-2 text-[0.85rem] font-medium text-ink transition-all duration-300 hover:bg-limedeep hover:shadow-lg"
          >
            Join the lab
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        {/* mobile toggle */}
        <button
          className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-fog transition-colors hover:bg-inkraise md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={17} /> : <Menu size={17} />}
          <span className="text-[13px]">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* mobile panel */}
      <div
        className={cn(
          "overflow-hidden border-line bg-ink transition-[max-height] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:hidden",
          open ? "max-h-96 border-t" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={cn(
                "hairline-b flex items-center justify-between py-4 font-serif text-xl transition-colors duration-200",
                route.page === l.to ? "text-fog" : "text-fogsoft"
              )}
            >
              {l.label}
              <ArrowUpRight size={16} className="text-fogmute" />
            </Link>
          ))}
          <Link
            to=""
            anchor="join"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-ink"
          >
            Join the lab <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
