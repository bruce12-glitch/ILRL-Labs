import { Mail, ArrowUpRight } from "lucide-react";
import { Link } from "../router";
import { SITE, PROJECTS } from "../data/lab";
import { LogoMark } from "./Nav";
import { GithubIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-ink text-paper/75">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8">
        {/* wordmark line */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-paper/12 pb-10">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <LogoMark className="h-9 w-9" dark />
              <span className="font-mono text-[10px] tracking-[0.24em] text-paper/45 uppercase">
                {SITE.longName}
              </span>
            </div>
            <p className="font-serif text-2xl leading-snug font-medium text-paper sm:text-3xl">
              Inference happens in loops.
              <br />
              We build systems <em className="text-gold">around the recurrence.</em>
            </p>
          </div>
          <a
            href={`mailto:${SITE.email}`}
            className="group inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            <Mail size={15} />
            {SITE.email}
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <h3 className="eyebrow !text-paper/45">Explore</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {(["", "research", "publications", "people"] as const).map((to) => (
                <li key={to}>
                  <Link to={to} className="u-line-out text-paper/75 hover:text-paper">
                    {to === "" ? "Home" : to[0].toUpperCase() + to.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-5">
            <h3 className="eyebrow !text-paper/45">Research</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <Link to="research" anchor={p.id} className="u-line-out text-paper/75 hover:text-paper">
                    {p.name}
                  </Link>
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-paper/35">{p.tag}</span>
                </li>
              ))}
              <li>
                <Link to="research" className="u-line-out text-paper/45 italic hover:text-paper/75">
                  all research areas →
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-3">
            <h3 className="eyebrow !text-paper/45">Connect</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a href={SITE.githubOrg} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-paper/75 hover:text-paper">
                  <GithubIcon size={15} className="text-paper/45 transition-colors group-hover:text-paper" />
                  Organization
                  <ArrowUpRight size={12} className="text-paper/35" />
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="group inline-flex items-center gap-2 text-paper/75 hover:text-paper">
                  <Mail size={15} className="text-paper/45 transition-colors group-hover:text-paper" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/12 pt-6 font-mono text-[10.5px] tracking-wider text-paper/40">
          <span>© 2026 {SITE.short} · INFERENCE-IN-LOOP &amp; RECURRENCE LAB</span>
          <span>REMOTE-FIRST · FAIR-USE CITATIONS WELCOME</span>
          <span>SET IN NEWSREADER &amp; INTER</span>
        </div>
      </div>
    </footer>
  );
}
