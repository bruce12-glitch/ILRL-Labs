import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Code2, Copy, FileText } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { PAPERS, bibtex, type Paper } from "../data/lab";
import { cn } from "../utils/cn";

const container = "mx-auto max-w-6xl px-5 sm:px-8";
const AREAS = ["All", "Prefill", "KV-Cache", "Serving", "Systems", "Survey"] as const;

function PaperRow({ p }: { p: Paper }) {
  const [copied, setCopied] = useState(false);

  const copyBib = async () => {
    try {
      await navigator.clipboard.writeText(bibtex(p));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — leave state unchanged */
    }
  };

  return (
    <article className="row-item group -mx-5 rounded-xl border-b border-line px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded-full bg-limewash px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
          {p.area}
        </span>
        <span className="font-mono text-[11px] text-fogmute">{p.date}</span>
        <span className="h-px w-5 bg-linedeep" aria-hidden="true" />
        <span className="font-mono text-[11px] tracking-[0.08em] text-fogsoft">{p.venue}</span>
      </div>

      <h3 className="mt-3.5 max-w-3xl font-serif text-[1.45rem] leading-snug font-medium text-fog">
        <a href={p.arxiv} target="_blank" rel="noreferrer" className="u-line transition-colors duration-200 group-hover:text-lime">
          {p.title}
          <ArrowUpRight size={16} className="mb-1 ml-1 inline text-fogmute" />
        </a>
      </h3>

      <p className="mt-2.5 text-[0.92rem] text-fogsoft italic">{p.authors.join(", ")}</p>

      <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-fogsoft">{p.abstract}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <a
          href={p.arxiv}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-linedeep px-4 py-1.5 font-mono text-[11.5px] text-fog transition-colors duration-200 hover:border-lime hover:text-lime"
        >
          <FileText size={13} />
          arXiv · open access
        </a>
        {p.code && (
          <a
            href={p.code}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-linedeep px-4 py-1.5 font-mono text-[11.5px] text-fog transition-colors duration-200 hover:border-lime hover:text-lime"
          >
            <Code2 size={13} />
            Code
          </a>
        )}
        <button
          onClick={copyBib}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11.5px] transition-colors duration-200",
            copied
              ? "border-limedim bg-limewash text-limedim"
              : "border-linedeep text-fog hover:border-lime hover:text-lime"
          )}
          aria-live="polite"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "BibTeX copied" : "Cite (BibTeX)"}
        </button>
      </div>
    </article>
  );
}

export default function Publications() {
  const [area, setArea] = useState<(typeof AREAS)[number]>("All");

  const filtered = useMemo(
    () => PAPERS.filter((p) => area === "All" || p.area === area).sort((a, b) => b.year - a.year),
    [area]
  );
  const years = useMemo(() => [...new Set(filtered.map((p) => p.year))].sort((a, b) => b - a), [filtered]);

  return (
    <>
      <section className="hairline-b">
        <div className={`${container} pt-14 pb-12 sm:pt-20 sm:pb-14`}>
          <Reveal>
            <p className="eyebrow">Publications</p>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-fog sm:text-6xl">
              Preprints &amp; papers
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-fogsoft">
              Everything is open access on arXiv with code and traces on GitHub, listed newest
              first. Authors, BibTeX and ScholarlyArticle JSON-LD are embedded so citations find
              their way home.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-8 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-200",
                  area === a
                    ? "border-lime bg-lime text-ink"
                    : "border-linedeep text-fogsoft hover:border-lime hover:text-fog"
                )}
                aria-pressed={area === a}
              >
                {a}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section>
        <div className={`${container} py-12 sm:py-14`}>
          {years.map((year) => (
            <div key={year} className="grid gap-x-10 gap-y-2 py-8 first:pt-0 lg:grid-cols-12">
              <Reveal className="lg:col-span-2">
                <div className="lg:sticky lg:top-24">
                  <span className="font-serif text-4xl font-medium text-fog/15">{year}</span>
                  <span className="mt-1 block font-mono text-[10px] tracking-[0.2em] text-fogmute uppercase">
                    {filtered.filter((p) => p.year === year).length} paper(s)
                  </span>
                </div>
              </Reveal>
              <div className="border-t border-line lg:col-span-10">
                {filtered
                  .filter((p) => p.year === year)
                  .map((p, i) => (
                    <Reveal key={p.id} delay={i * 70}>
                      <PaperRow p={p} />
                    </Reveal>
                  ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="py-16 text-center font-serif text-xl text-fogsoft italic">
              Nothing in this area yet — check back next loop.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
