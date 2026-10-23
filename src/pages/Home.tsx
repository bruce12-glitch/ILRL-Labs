import { ArrowRight, ArrowUpRight, Mail, FileText, Code2, Workflow, Layers, BrainCircuit } from "lucide-react";
import { Link } from "../router";
import { Reveal } from "../components/Reveal";
import { HeroScene } from "../components/HeroScene";
import { AttentionMotif } from "../components/Diagrams";
import { GithubIcon } from "../components/icons";
import { SITE, PROJECTS, PAPERS, PEOPLE, NEWS, DIRECTIONS, stats, type Direction } from "../data/lab";

const container = "mx-auto max-w-6xl px-5 sm:px-8";

function SectionHead({
  index,
  title,
  linkTo,
  linkLabel,
}: {
  index: string;
  title: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{index}</p>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex items-center gap-1.5 pb-1 text-[0.9rem] font-medium text-navy u-line-out"
        >
          {linkLabel}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hairline-b relative overflow-hidden">
      {/* animated 3D field + legibility wash */}
      <HeroScene className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, var(--color-paper) 22%, color-mix(in srgb, var(--color-paper) 82%, transparent) 46%, transparent 75%)",
        }}
      />

      <div className={`${container} relative grid gap-12 pt-14 pb-12 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center`}>
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <p className="eyebrow">Efficient LLM inference · ML systems — est. {SITE.founded}</p>
          </div>

          <h1 className="mt-7 font-serif text-[2.9rem] leading-[1.02] font-medium tracking-tight text-ink sm:text-6xl lg:text-[4.35rem]">
            Inference-in-Loop
            <br />
            <span className="text-inksoft">&amp; </span>
            <em className="text-navy">Recurrence</em> Lab
          </h1>

          <p className="mt-7 max-w-xl text-[1.075rem] leading-relaxed text-inksoft">
            ILRL studies the loop between inference and memory. We build open systems that make
            large language models cheaper to run — sparse prefill that escapes quadratic latency,
            tiered KV-caches that break the memory wall, and schedulers that treat every decode
            step as recurrence to be optimized.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="research"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-paper transition-colors duration-300 hover:bg-navy"
            >
              Explore our research
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="publications"
              className="inline-flex items-center gap-2 rounded-full border border-linedeep bg-paper/70 px-6 py-3 text-[0.95rem] font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:border-ink"
            >
              Read the papers
            </Link>
          </div>

        </Reveal>

        <Reveal delay={140}>
          <figure className="card-3d rounded-2xl border border-line bg-paper/90 p-5 shadow-card backdrop-blur-sm sm:p-7">
            <AttentionMotif />
            <figcaption className="mt-4 border-t border-line pt-4 font-mono text-[10.5px] tracking-[0.14em] text-inkmute uppercase">
              Sparse attention × tiered KV pages — the loop, visualized
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* stat strip */}
      <div className={`${container} pb-14`}>
        <Reveal className="grid grid-cols-2 gap-y-6 border-t border-line pt-7 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-medium text-navy">{s.value}</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-inkmute uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Mission ──────────────────────────────────────────────────────────── */
function Mission() {
  return (
    <section className="hairline-b">
      <div className={`${container} grid gap-10 py-16 sm:py-20 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">01 / Mission</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight font-medium tracking-tight text-ink sm:text-4xl">
            A lab for the loop between inference and memory.
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
          <p className="text-[1.02rem] leading-relaxed text-inksoft">
            Every token a model serves is a step around the same loop: fetch the cache, attend,
            decode, schedule the next step. ILRL treats that recurrence — not any single step —
            as the unit of optimization, and attacks it end to end: from the quadratic cost of
            long-context prefill, to the KV-cache memory wall, to the scheduler that closes the
            loop thousands of times a second.
          </p>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-inksoft">
            We work remote-first and release everything open — papers on arXiv, systems, traces
            and calibration harnesses on GitHub — so other groups can measure against us, build
            on us, and find the bugs our benchmarks missed.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {["Open-source first", "Reproducible benchmarks", "Model × systems co-design"].map((v) => (
              <li
                key={v}
                className="rounded-full border border-linedeep bg-cream px-4 py-1.5 font-mono text-[11px] tracking-wider text-inksoft"
              >
                {v}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Current research directions ──────────────────────────────────────── */
const directionIcon: Record<Direction["icon"], typeof Workflow> = {
  prefill: Workflow,
  kv: Layers,
  agi: BrainCircuit,
};

function ResearchDirections() {
  return (
    <section className="hairline-b">
      <div className={`${container} py-16 sm:py-20`}>
        <Reveal className="mb-10">
          <p className="eyebrow">02 / Research</p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Current research directions
          </h2>
          <p className="mt-3 text-[1rem] text-inksoft">Some of the things we work on.</p>
          <Link
            to="publications"
            className="group mt-5 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-navy u-line-out"
          >
            View all publications
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {DIRECTIONS.map((d, i) => {
            const Icon = directionIcon[d.icon];
            const project = PROJECTS.find((p) => p.id === d.projectId);
            return (
              <Reveal
                key={d.id}
                delay={i * 90}
                className={`flex flex-col py-8 md:px-8 ${i > 0 ? "border-t border-line md:border-t-0" : ""} md:first:pl-0 md:last:pr-0`}
              >
                <h3 className="flex items-center gap-3 font-serif text-[1.45rem] leading-snug font-medium tracking-tight text-ink">
                  <Icon size={18} className="shrink-0 text-navy" aria-hidden="true" />
                  {d.title}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-inksoft">{d.blurb}</p>
                {project && (
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                    <Link
                      to="research"
                      anchor={project.id}
                      className="group inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-navy u-line-out"
                    >
                      {project.name}
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[12px] text-inksoft transition-colors hover:text-navy"
                    >
                      <Code2 size={14} /> Code
                    </a>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── News ─────────────────────────────────────────────────────────────── */
function News() {
  return (
    <section className="hairline-b">
      <div className={`${container} grid gap-10 py-16 sm:py-20 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">03 / News</p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Notes from the loop
          </h2>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-inksoft">
            Releases, preprints and measurement results — logged as they ship, newest first.
          </p>
        </Reveal>
        <div className="lg:col-span-8">
          {NEWS.map((n, i) => (
            <Reveal key={n.date + n.title} delay={i * 60}>
              <article className="row-item -mx-5 flex gap-6 rounded-xl border-b border-line px-5 py-6 sm:px-8">
                <time className="w-16 shrink-0 pt-1 font-mono text-[11px] tracking-[0.08em] text-inkmute uppercase">
                  {n.date}
                </time>
                <div>
                  <h3 className="text-[1.02rem] font-medium text-ink">{n.title}</h3>
                  {n.detail && <p className="mt-1.5 text-[0.92rem] leading-relaxed text-inksoft">{n.detail}</p>}
                  {n.link && (
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[12px] text-navy u-line-out"
                    >
                      {n.linkLabel ?? "Read more"}
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Selected publications ────────────────────────────────────────────── */
function SelectedPubs() {
  const selected = PAPERS.filter((p) => p.selected);
  if (selected.length === 0) return null;
  return (
    <section className="hairline-b">
      <div className={`${container} py-16 sm:py-20`}>
        <SectionHead index="04 / Publications" title="Selected preprints" linkTo="publications" linkLabel="All publications" />
        <div className="border-t border-line">
          {selected.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <article className="row-item group -mx-5 grid gap-x-8 gap-y-3 rounded-xl border-b border-line px-5 py-7 sm:grid-cols-12 sm:px-8">
                <div className="sm:col-span-9">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full bg-navywash px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-navy uppercase">
                      {p.area}
                    </span>
                    <span className="font-mono text-[11px] text-inkmute">{p.date}</span>
                  </div>
                  <h3 className="mt-3 max-w-3xl font-serif text-[1.35rem] leading-snug font-medium text-ink">
                    <a href={p.arxiv} target="_blank" rel="noreferrer" className="u-line transition-colors group-hover:text-navy">
                      {p.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-[0.9rem] text-inksoft italic">{p.authors.join(", ")}</p>
                </div>
                <div className="flex flex-row items-center gap-4 sm:col-span-3 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5">
                  <a
                    href={p.arxiv}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[12px] text-inksoft transition-colors hover:text-navy"
                  >
                    <FileText size={14} /> {p.arxivLabel}
                  </a>
                  {p.code && (
                    <a
                      href={p.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[12px] text-inksoft transition-colors hover:text-navy"
                    >
                      <Code2 size={14} /> Code
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── People preview ───────────────────────────────────────────────────── */
const tintBg: Record<string, string> = {
  navy: "bg-navywash text-navy",
  gold: "bg-goldwash text-gold",
  cream: "bg-cream text-inksoft",
};

const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function PeoplePreview() {
  const members = [...PEOPLE.faculty, ...PEOPLE.team];
  return (
    <section className="hairline-b">
      <div className={`${container} flex flex-wrap items-center justify-between gap-x-10 gap-y-8 py-14 sm:py-16`}>
        <Reveal className="max-w-sm">
          <p className="eyebrow">05 / People</p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink">
            Small team, deep loop.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-inksoft">
            A focused lab growing around LLM inference and ML systems.
          </p>
        </Reveal>
        <Reveal delay={120} className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {members.map((m) => (
              m.photo ? (
                <img
                  key={m.name}
                  src={m.photo}
                  alt={`Portrait of ${m.name}`}
                  title={m.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-full border-2 border-paper object-cover shadow-card"
                />
              ) : (
              <span
                key={m.name}
                title={m.name}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-paper font-serif text-[15px] font-semibold shadow-card ${tintBg[m.tint]}`}
              >
                {initials(m.name)}
              </span>
              )
            ))}
          </div>
          <Link
            to="people"
            className="group inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-navy u-line-out"
          >
            Meet everyone
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Join CTA ─────────────────────────────────────────────────────────── */
function JoinCta() {
  return (
    <section id="join" className="scroll-mt-24">
      <div className={`${container} py-16 sm:py-20`}>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-12 text-paper sm:px-14 sm:py-16">
            {/* faint motif dots */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #FCFBF7 1px, transparent 0)`,
                backgroundSize: "26px 26px",
                maskImage: "linear-gradient(120deg, transparent 30%, black 100%)",
              }}
            />
            <div className="relative max-w-2xl">
              <p className="font-mono text-[10px] tracking-[0.24em] text-gold uppercase">06 / Join</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
                Join the loop.
              </h2>
              <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-paper/70">
                We welcome motivated collaborators — from first-time open-source contributors to
                PhD researchers — anywhere kernels, schedulers and memory systems meet language
                models. Everything we build is open, so the fastest way in is a pull request or
                a reproducible benchmark.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:bg-gold hover:text-ink"
                >
                  <Mail size={16} />
                  {SITE.email}
                </a>
                <a
                  href={SITE.githubOrg}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-[0.95rem] font-medium text-paper transition-colors duration-300 hover:border-paper hover:text-paper"
                >
                  <GithubIcon size={16} />
                  Contribute on GitHub
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <ResearchDirections />
      <News />
      <SelectedPubs />
      <PeoplePreview />
      <JoinCta />
    </>
  );
}
