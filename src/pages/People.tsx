import { ArrowUpRight, GraduationCap, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/icons";
import { Reveal } from "../components/Reveal";
import { Link } from "../router";
import { PEOPLE, SITE, type Person } from "../data/lab";
import { cn } from "../utils/cn";

const container = "mx-auto max-w-6xl px-5 sm:px-8";

const tintBg: Record<Person["tint"], string> = {
  lime: "bg-limewash text-lime",
  limedim: "bg-limewash text-limedim",
  inkraise: "bg-inkraise text-fogsoft",
};

export const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function GroupHead({ index, title, count, note }: { index: string; title: string; count: number; note: string }) {
  return (
    <Reveal className="mb-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="eyebrow">{index}</p>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-fog">
          {title}
          <span className="ml-3 font-mono text-sm font-normal text-fogmute">({count})</span>
        </h2>
      </div>
      <p className="mt-2 max-w-xl text-[0.93rem] text-fogsoft">{note}</p>
    </Reveal>
  );
}

function PersonCard({ person, big }: { person: Person; big?: boolean }) {
  return (
    <article
      className={cn(
        "group card-3d rounded-2xl border border-line bg-inkraise shadow-card",
        big ? "p-7" : "p-6"
      )}
    >
      <div className="flex items-start gap-4">
        {person.photo ? (
          <img
            src={person.photo}
            alt={`Portrait of ${person.name}`}
            loading="lazy"
            className={cn(
              "shrink-0 rounded-full object-cover",
              big ? "h-16 w-16" : "h-13 w-13"
            )}
          />
        ) : (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full font-serif font-semibold",
            tintBg[person.tint],
            big ? "h-16 w-16 text-xl" : "h-13 w-13 text-[17px]"
          )}
          aria-hidden="true"
        >
          {initialsOf(person.name)}
        </span>
        )}
        <div className="min-w-0">
          <h3 className={cn("font-serif leading-tight font-medium text-fog", big ? "text-[1.45rem]" : "text-[1.25rem]")}>
            {person.name}
          </h3>
          <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-limedim uppercase">{person.role}</p>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-fogsoft">{person.focus}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
        {person.github && (
        <a
          href={person.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on GitHub`}
          className="inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 font-mono text-[11px] text-fogsoft transition-colors duration-200 hover:border-linedeep hover:text-fog"
        >
          <GithubIcon size={14} />
          GitHub
        </a>
        )}
        {person.scholar && (
        <a
          href={person.scholar}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on Google Scholar`}
          className="inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 font-mono text-[11px] text-fogsoft transition-colors duration-200 hover:border-linedeep hover:text-fog"
        >
          <GraduationCap size={15} />
          Scholar
        </a>
        )}
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${person.name} on LinkedIn`}
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 font-mono text-[11px] text-fogsoft transition-colors duration-200 hover:border-linedeep hover:text-fog"
          >
            <LinkedinIcon size={14} />
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}

export default function People() {
  return (
    <>
      <section className="hairline-b">
        <div className={`${container} pt-14 pb-12 sm:pt-20 sm:pb-14`}>
          <Reveal>
            <p className="eyebrow">People</p>
            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-fog sm:text-6xl">
              The researchers in the loop
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-fogsoft">
              A remote-first group of mentors and students. Every name links out to GitHub and
              Google Scholar, because a lab is really a small graph of people with shared
              hardware access and stronger opinions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* faculty & mentors — hidden until real entries exist */}
      {PEOPLE.faculty.length > 0 && (
      <section className="hairline-b">
        <div className={`${container} py-14 sm:py-16`}>
          <GroupHead
            index="Fac / 01"
            title="Faculty & Mentors"
            count={PEOPLE.faculty.length}
            note="Advisors who review our entropy estimates and our prose with equal violence."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {PEOPLE.faculty.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <PersonCard person={p} big />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* team & students */}
      <section className="hairline-b">
        <div className={`${container} py-14 sm:py-16`}>
          <GroupHead
            index="Res / 02"
            title="Team & Students"
            count={PEOPLE.team.length}
            note="The people who ship the kernels, run the traces, and close the loop nightly."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE.team.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 90}>
                <PersonCard person={p} />
              </Reveal>
            ))}
            {/* open seat card */}
            <Reveal delay={3 * 90}>
              <Link
                to=""
                anchor="join"
                className="group flex h-full min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-linedeep bg-inkraise/40 p-6 text-center transition-colors duration-300 hover:border-limedim hover:bg-limewash/40"
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-full border border-dashed border-linedeep font-serif text-xl text-fogmute transition-colors group-hover:border-limedim group-hover:text-limedim">
                  +
                </span>
                <span className="font-serif text-lg text-fogsoft italic transition-colors group-hover:text-fog">
                  This seat is open
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-fogmute uppercase">
                  Join the lab <ArrowUpRight size={12} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* alumni — hidden until real entries exist */}
      {PEOPLE.alumni.length > 0 && (
      <section className="hairline-b">
        <div className={`${container} py-14 sm:py-16`}>
          <GroupHead
            index="Alum / 03"
            title="Alumni"
            count={PEOPLE.alumni.length}
            note="Former members, still trapped somewhere in the recurrence."
          />
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line bg-inkraise">
              {PEOPLE.alumni.map((p, i) => (
                <article
                  key={p.name}
                  className={cn(
                    "row-item grid items-center gap-x-6 gap-y-1 px-7 py-5 sm:grid-cols-12",
                    i > 0 && "border-t border-line"
                  )}
                >
                  <div className="sm:col-span-3">
                    <h3 className="font-serif text-lg font-medium text-fog">{p.name}</h3>
                  </div>
                  <p className="font-mono text-[11.5px] text-fogmute sm:col-span-4">
                    {p.role} · {p.years}
                  </p>
                  <p className="text-[0.9rem] text-fogsoft sm:col-span-5">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-limedim uppercase">Now · </span>
                    {p.now}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* join */}
      <section>
        <div className={`${container} py-14 sm:py-16`}>
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-inkraise/60 px-7 py-8 sm:px-10">
              <div className="max-w-xl">
                <h2 className="font-serif text-2xl font-medium text-fog sm:text-3xl">Want a seat in the loop?</h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fogsoft">
                  Email a short note with a link to something you built or measured. Kernels beat
                  résumés; reproducibility beats both.
                </p>
              </div>
              <a
                href={`mailto:${SITE.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-[0.92rem] font-medium text-ink transition-colors duration-300 hover:bg-limedeep"
              >
                <Mail size={15} />
                {SITE.email}
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
