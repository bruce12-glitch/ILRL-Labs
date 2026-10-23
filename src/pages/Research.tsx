import { ArrowRight, ArrowUpRight, FileText, Lightbulb } from "lucide-react";
import { Link } from "../router";
import { Reveal } from "../components/Reveal";
import { GithubIcon } from "../components/icons";
import { PROJECTS } from "../data/lab";

const container = "mx-auto max-w-6xl px-5 sm:px-8";

const OPEN_PROBLEMS = [
  "Can we compress trillion-parameter MoEs to commodity GPUs by isolating \"Super Experts\" and compressing the expert tail?",
  "Do anchor-based residual quantizations fundamentally prevent representation collapse in ultra-deep recurrent loops?",
  "Can a single runtime information-density metric dynamically route tokens across multi-precision KV caches and expert pathways?",
];

export default function Research() {
  return (
    <>
      {/* header */}
      <section className="hairline-b">
        <div className={`${container} pt-14 pb-12 sm:pt-20 sm:pb-14`}>
          <Reveal>
            <p className="eyebrow">Research</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] font-medium tracking-tight text-fog sm:text-6xl">
              Systems for the inference loop.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-fogsoft">
              Two open frameworks that share one thesis: efficient LLM inference comes from
              managing recurrence — across prefill and memory — rather than tuning
              any single kernel. Every system ships with papers, traces and a reproducible harness.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-wrap gap-2.5">
            {PROJECTS.map((p) => (
              <Link
                key={p.id}
                to="research"
                anchor={p.id}
                className="group inline-flex items-center gap-2 rounded-full border border-linedeep bg-inkraise px-4 py-2 text-[0.85rem] font-medium text-fogsoft transition-all duration-300 hover:border-lime hover:text-lime"
              >
                <span className="font-mono text-[10px] tracking-wider text-limedim">{p.tag}</span>
                {p.name}
                <ArrowRight size={13} className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* pillars */}
      {PROJECTS.map((p) => (
        <article key={p.id} id={p.id} className="hairline-b scroll-mt-24 last:border-b-0">
          <div className={`${container} py-14 sm:py-18`}>
            <Reveal>
              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
                {/* text column */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-limedim">{p.tag}</span>
                    <span className="h-px w-8 bg-linedeep" />
                    <span className="font-mono text-[10px] tracking-[0.18em] text-fogmute uppercase">{p.area}</span>
                  </div>

                  <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-fog sm:text-5xl">
                    {p.name}
                  </h2>
                  {/* semantic long-tail keyword header */}
                  <h3 className="mt-4 max-w-xl text-[1.13rem] leading-snug font-medium text-lime">
                    {p.headline}
                  </h3>

                  <p className="mt-6 text-[1.02rem] leading-relaxed text-fogsoft">{p.blurb}</p>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-fogsoft">{p.detail}</p>

                  <h4 className="eyebrow mt-9">Key results</h4>
                  <ul className="mt-4 space-y-3.5">
                    {p.contributions.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.95rem] leading-relaxed text-fogsoft">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-limedim" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <a
                      href={p.arxiv}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[0.88rem] font-medium text-ink transition-colors duration-300 hover:bg-limedeep"
                    >
                      <FileText size={15} />
                      Paper · {p.arxivLabel}
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={p.code}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-linedeep px-5 py-2.5 text-[0.88rem] font-medium text-fog transition-colors duration-300 hover:border-lime hover:text-lime"
                    >
                      <GithubIcon size={15} />
                      Source code
                    </a>
                  </div>
                </div>

                {/* meta column */}
                <aside className="lg:col-span-4 lg:col-start-9">
                  <div className="lg:sticky lg:top-24">
                    <dl className="card-3d rounded-2xl border border-line bg-inkraise p-6 shadow-card">
                      <div className="flex items-center justify-between border-b border-line pb-4">
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-fogmute uppercase">Status</dt>
                        <dd className="flex items-center gap-2 text-[0.85rem] font-medium text-fog">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-limedim opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-limedim" />
                          </span>
                          {p.status}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between border-b border-line py-4">
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-fogmute uppercase">Venue</dt>
                        <dd className="text-[0.85rem] font-medium text-fog">arXiv preprint</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="font-mono text-[10px] tracking-[0.18em] text-fogmute uppercase">Paper</dt>
                        <dd>
                          <a href={p.arxiv} target="_blank" rel="noreferrer" className="font-mono text-[12px] text-lime u-line-out">
                            {p.arxivLabel}
                          </a>
                        </dd>
                      </div>
                    </dl>

                    {/* metrics */}
                    <div className="mt-5 rounded-2xl border border-line bg-inkraise/60">
                      {p.metrics.map((m, i) => (
                        <div
                          key={m.label}
                          className={`flex items-baseline justify-between px-6 py-4 ${i > 0 ? "border-t border-line" : ""}`}
                        >
                          <span className="font-serif text-[1.7rem] leading-none font-medium text-lime">{m.value}</span>
                          <span className="max-w-[55%] text-right font-mono text-[9.5px] leading-snug tracking-[0.12em] text-fogsoft uppercase">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </Reveal>

          </div>
        </article>
      ))}

      {/* open problems */}
      <section className="hairline-t bg-inkraise/50">
        <div className={`${container} grid gap-10 py-14 sm:py-18 lg:grid-cols-12`}>
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Open problems</p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-fog">
              What keeps us in the loop
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fogsoft">
              Questions we would love company on — cite us, beat us, or email us a counterexample.
            </p>
          </Reveal>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-inkraise px-7">
              {OPEN_PROBLEMS.map((q, i) => (
                <Reveal key={q} delay={i * 80}>
                  <li className="flex items-baseline gap-5 py-5.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-limewash text-lime">
                      <Lightbulb size={15} />
                    </span>
                    <p className="text-[0.97rem] leading-relaxed text-fog">{q}</p>
                  </li>
                </Reveal>
              ))}
              <Reveal>
                <li className="py-5.5">
                  <Link to="publications" className="group inline-flex items-center gap-2 text-[0.92rem] font-medium text-lime u-line-out">
                    Read the papers behind these questions
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              </Reveal>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
