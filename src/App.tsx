import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Mail, Menu, Pause, Play, X } from "lucide-react";
import { HeroScene } from "./components/HeroScene";
import { GOALS, INTERESTS, LAB, PAPERS, PEOPLE } from "./data/lab";
import { resolveSection, SECTIONS, type Section } from "./utils/navigation";
import "./styles/tokens.css";

const LABELS: Record<Section, string> = {
  about: "About",
  members: "Members",
  research: "Research",
  interests: "Interests",
  "future-goals": "Future Goals",
};

function Mark() {
  return <svg width="32" height="24" viewBox="0 0 42 30" fill="none" aria-hidden="true">
    <path d="M21 15C15 3 3 5 3 15s12 12 18 0S39 3 39 15 27 27 21 15Z" stroke="currentColor" strokeWidth="2.4" />
    <path d="m32 6 4 2-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function SectionTitle({ number, title, note, id }: { number: string; title: string; note: string; id: string }) {
  return <div className="section-intro">
    <span className="section-number">{number}</span>
    <h2 id={id}>{title}</h2>
    <p>{note}</p>
  </div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<Section>(() => resolveSection(window.location.hash));
  const [motionRequested, setMotionRequested] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const motion = motionRequested && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const navigate = () => {
      const section = resolveSection(window.location.hash);
      setActive(section);
      setMenuOpen(false);
      if (window.location.hash.startsWith("#/")) {
        window.history.replaceState(null, "", `#${section}`);
      }
      document.getElementById(section)?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    if (window.location.hash) navigate();
    window.addEventListener("hashchange", navigate);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id as Section);
      }
    }, { rootMargin: "-12% 0px -68% 0px" });
    SECTIONS.forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node); });
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("hashchange", navigate);
      window.removeEventListener("keydown", escape);
      observer.disconnect();
    };
  }, []);

  return <div className="site" data-motion={motion}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>Skip to content</a>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#about" className="brand" aria-label="ILRL Labs home"><Mark /><span>ILRL<span className="brand-labs"> Labs</span></span></a>
        <nav id="site-navigation" className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation">
          {SECTIONS.map(section => <a key={section} href={`#${section}`} aria-current={active === section ? "location" : undefined} onClick={() => setMenuOpen(false)}>{LABELS[section]}</a>)}
        </nav>
        <div className="header-controls">
          <button className="control-button" type="button" disabled={reducedMotion} onClick={() => setMotionRequested(value => !value)} aria-label={reducedMotion ? "Motion reduced by system setting" : motion ? "Pause animation" : "Resume animation"} title={reducedMotion ? "Following your reduced-motion setting" : motion ? "Pause animation" : "Resume animation"}>{motion ? <Pause size={13} /> : <Play size={13} />}</button>
          <a href={`mailto:${LAB.email}`} className="control-button email-control" aria-label="Email ILRL Labs"><Mail size={16} strokeWidth={1.5} /></a>
          <button className="control-button menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
    </header>

    <main id="main-content" tabIndex={-1}>
      <section id="about" className="about-section container" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="lab-fullname">{LAB.fullName}</p>
          <h1 id="about-title">LLM inference<br /><span>&amp; ML systems.</span></h1>
          <p className="about-description">{LAB.about}</p>
          <p className="about-interests">We are also interested in holographic model compression, looped transformers, and the future of inference in AGI.</p>
          <div className="about-links"><a className="inline-link" href="#research">Research <ArrowDown size={13} /></a><a className="inline-link" href="#members">Members <ArrowUpRight size={13} /></a></div>
        </div>
        <HeroScene motion={motion} />
      </section>

      <section id="members" className="content-section container" aria-labelledby="members-title">
        <SectionTitle id="members-title" number="01" title="Members" note="The people working on these questions." />
        <div className="member-list">
          {PEOPLE.map(person => <article className="member" key={person.name}>
            <img className="portrait" src={`${import.meta.env.BASE_URL}${person.photo}`} width="136" height="164" alt={person.name} loading="lazy" />
            <div className="member-information">
              <p className="member-role">{person.role}</p>
              <h3>{person.name}</h3>
              {person.education && <a className="member-education" href={person.educationSource} target="_blank" rel="noreferrer">{person.education}</a>}
              <p className="member-focus">{person.focus}</p>
              <div className="member-links">{person.links.map(link => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={11} /></a>)}</div>
            </div>
          </article>)}
        </div>
      </section>

      <section id="research" className="content-section container" aria-labelledby="research-title">
        <SectionTitle id="research-title" number="02" title="Research" note="Current papers on inference and memory." />
        <div className="paper-list">
          {PAPERS.map(paper => <article className="paper" key={paper.id} id={paper.id}>
            <div className="paper-meta"><span>Preprint · {paper.date}</span><span>{paper.topic}</span></div>
            <h3><a href={paper.arxiv} target="_blank" rel="noreferrer"><strong>{paper.name}</strong>: {paper.title}<ArrowUpRight size={17} /></a></h3>
            <p className="paper-author">{paper.author}</p>
            <p className="paper-summary">{paper.summary}</p>
            <div className="paper-links" aria-label={`${paper.name} resources`}>
              <a className="paper-primary" href={paper.arxiv} target="_blank" rel="noreferrer">arXiv<ArrowUpRight size={12} /></a>
              <a href={paper.pdf} target="_blank" rel="noreferrer">PDF<ArrowUpRight size={12} /></a>
              <a href={paper.code} target="_blank" rel="noreferrer">Code<ArrowUpRight size={12} /></a>
            </div>
          </article>)}
        </div>
      </section>

      <section id="interests" className="content-section container" aria-labelledby="interests-title">
        <SectionTitle id="interests-title" number="03" title="Interests" note="Directions we want to explore." />
        <div className="interest-list">
          {INTERESTS.map((interest, i) => <article className={`interest interest-${interest.id}`} key={interest.id}>
            <span className="interest-symbol" aria-hidden="true">{i === 0 ? "⊞" : i === 1 ? "↶" : "↗"}</span>
            <div><h3>{interest.title}</h3><p>{interest.description}</p><span className="interest-keywords">{interest.keywords}</span></div>
          </article>)}
        </div>
      </section>

      <section id="future-goals" className="content-section goals-section container" aria-labelledby="goals-title">
        <SectionTitle id="goals-title" number="04" title="Future Goals" note="What we want to do next." />
        <ol className="goal-list">{GOALS.map(goal => <li key={goal.title}><h3>{goal.title}</h3><p>{goal.text}</p></li>)}</ol>
      </section>
    </main>

    <footer className="site-footer"><div className="container footer-inner"><div><a href="#about" className="brand" aria-label="ILRL Labs home"><Mark /><span>ILRL Labs</span></a><p>{LAB.fullName}</p></div><a className="footer-email" href={`mailto:${LAB.email}`}>{LAB.email}<ArrowUpRight size={13} /></a><a className="back-top" href="#about">Back to top ↑</a></div></footer>
  </div>;
}
