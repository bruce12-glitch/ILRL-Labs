import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Pause, Play, X, Plus, Layers, ScanLine } from "lucide-react";
import { HeroCircuit, LoopMark, Playground } from "./components/Experiments";
import { LAB_META, NOTES, PEOPLE, PROJECTS } from "./data/lab";
import { parsePage, type Page } from "./utils/playground";
import "./styles/tokens.css";

const NAV: { page: Page; label: string }[] = [
  { page: "research", label: "Research" },
  { page: "playground", label: "Playground" },
  { page: "people", label: "Members" },
  { page: "publications", label: "Notes" },
];

function ProjectCards({ expanded = false }: { expanded?: boolean }) {
  return <div className="project-grid">{PROJECTS.map((project, index) => <article className="project-card" key={project.id}>
    <div className="project-card-top"><span className="micro">0{index + 1} / {project.area}</span><span className={`project-glyph project-glyph--${index}`} aria-hidden="true">{index === 0 ? <Layers size={26} strokeWidth={1.4} /> : <ScanLine size={26} strokeWidth={1.4} />}</span></div>
    <span className="project-name">{project.name}</span><h3>{project.question}</h3><p>{project.summary}</p>
    {expanded && <details className="project-details"><summary>What we are looking at <Plus size={16} /></summary><p>{project.detail}</p></details>}
    <div className="project-links"><a href={`#/playground/${project.demo}`}>Explore the idea <ArrowRight size={16} /></a><a href={project.code} target="_blank" rel="noreferrer">Project code <ArrowUpRight size={15} /></a></div>
  </article>)}</div>;
}

function Members() {
  return <div className="member-grid">{PEOPLE.map(person => <article className="member-card" key={person.name}>
    <div className="portrait-wrap"><img src={`${import.meta.env.BASE_URL}${person.photo}`} alt={person.name} width="256" height="256" /></div>
    <div className="member-info"><span className="micro">{person.role}</span><h2>{person.name}</h2><p>{person.focus}</p><div className="member-links">{person.links.map(link => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={14} /></a>)}</div></div>
  </article>)}</div>;
}

function PageIntro({ index, label, title, children }: { index: string; label: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><div className="eyebrow"><span className="index-label">{index}</span>{label}</div><h1>{title}</h1><p>{children}</p></div>;
}

function Home({ motion }: { motion: boolean }) {
  return <>
    <section className="hero container" aria-labelledby="home-title"><div className="hero-copy"><div className="lab-fullname">{LAB_META.fullName}</div><h1 id="home-title">One token.<br />Then the next<span className="accent-stop">.</span></h1><p>We work on the parts of language models that get expensive: long prompts, growing memory, and repeated computation.</p><div className="hero-actions"><a className="button primary" href="#/research">Our research <ArrowUpRight size={17} /></a><a className="text-link" href="#/playground">Try a sketch <ArrowRight size={16} /></a></div><div className="hero-footnote"><span className="tiny-loop" aria-hidden="true">↶</span><span className="micro">INFERENCE · MEMORY · RECURRENCE</span></div></div><HeroCircuit motion={motion} /></section>
    <section className="section container" aria-labelledby="research-title"><div className="section-heading"><div><div className="eyebrow"><span className="index-label">01</span>Research</div><h2 id="research-title">The work on our desk.</h2></div><a className="text-link" href="#/research">All research <ArrowUpRight size={16} /></a></div><ProjectCards /></section>
    <section className="playground-invitation container"><div className="invitation-graphic" aria-hidden="true"><span /><span /><span /><span /><i>↶</i></div><div><div className="eyebrow"><span className="index-label">02</span>Playground</div><h2>Pull on a thread.</h2><p>Follow a token. Change a memory budget. Look inside an attention mask.</p></div><a className="button primary" href="#/playground">Open the playground <ArrowUpRight size={17} /></a></section>
    <section className="section container home-people"><div><div className="eyebrow"><span className="index-label">03</span>Members</div><h2>People behind the work.</h2><a className="text-link" href="#/people">Meet the lab <ArrowRight size={16} /></a></div><div className="people-preview">{PEOPLE.map(person => <a href="#/people" key={person.name}><img src={`${import.meta.env.BASE_URL}${person.photo}`} alt="" width="80" height="80" loading="lazy" /><span><strong>{person.name}</strong><small>{person.role}</small></span><ArrowUpRight size={17} /></a>)}</div></section>
  </>;
}

export default function App() {
  const [route, setRoute] = useState(() => parsePage(window.location.hash));
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionRequested, setMotionRequested] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const motion = motionRequested && !reducedMotion;
  useEffect(() => {
    const onHash = () => { setRoute(parsePage(window.location.hash)); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { document.title = route.page === "overview" ? `ILRL — ${LAB_META.fullName}` : `${NAV.find(item => item.page === route.page)?.label ?? "ILRL"} · ILRL`; }, [route.page]);
  return <div className="site-shell" data-motion={motion}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>Skip to content</a>
    <header className="site-header"><div className="header-inner container"><a href="#/" className="brand" aria-label="ILRL home"><LoopMark /><span>ILRL</span></a><nav className={menuOpen ? "main-nav is-open" : "main-nav"} id="main-navigation" aria-label="Main navigation">{NAV.map(item => <a key={item.page} href={`#/${item.page}`} aria-current={route.page === item.page ? "page" : undefined}>{item.label}</a>)}</nav><div className="header-controls"><button className="motion-toggle icon-button" type="button" aria-label={reducedMotion ? "Motion reduced by your system setting" : motion ? "Pause motion" : "Enable motion"} title={reducedMotion ? "Following your reduced-motion setting" : motion ? "Pause motion" : "Enable motion"} disabled={reducedMotion} onClick={() => setMotionRequested(value => !value)}>{motion ? <Pause size={15} /> : <Play size={15} />}</button><a className="contact-link" href={`mailto:${LAB_META.email}`}>Say hello <ArrowUpRight size={15} /></a><button className="mobile-menu icon-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></div></header>
    <main id="main-content" tabIndex={-1}>
      {route.page === "overview" && <Home motion={motion} />}
      {route.page === "research" && <div className="container page-content"><PageIntro index="01" label="Research" title="Less memory. Less waiting.">Our current work is on KV-cache selection and the cost of processing long prompts.</PageIntro><ProjectCards expanded /><div className="research-afterword"><LoopMark /><p>Recurrence is another question we are working toward: what changes when a model reuses its layers?</p><a className="text-link" href="#/publications">Read our notes <ArrowRight size={16} /></a></div></div>}
      {route.page === "playground" && <div className="container page-content"><PageIntro index="02" label="Playground" title="A few things to try.">Small, interactive sketches of the systems we think about. Choose one and change something.</PageIntro><Playground motion={motion} initialTool={route.tool} /><div className="playground-bottom"><span className="micro">MADE TO BE EXAMINED</span><p>These are explanations of ideas, not research results.</p><a className="text-link" href="#/research">Back to the work <ArrowRight size={16} /></a></div></div>}
      {route.page === "people" && <div className="container page-content"><PageIntro index="03" label="Members" title="The people in the loop.">A small lab working on inference, memory, and recurrence.</PageIntro><Members /><div className="member-contact"><Mail size={22} strokeWidth={1.5} /><div><h3>Have a question about the work?</h3><a href={`mailto:${LAB_META.email}`}>{LAB_META.email} <ArrowUpRight size={15} /></a></div></div></div>}
      {route.page === "publications" && <div className="container page-content notes-page"><PageIntro index="04" label="Notes" title="Questions, written down.">A few short notes on why we are working on these problems.</PageIntro><div className="notes-list">{NOTES.map((note, i) => <details className="note" key={note.title} open={i === 0}><summary><span className="micro">0{i + 1} / {note.topic}</span><h2>{note.title}</h2><span className="note-toggle"><Plus size={20} /></span></summary><div className="note-body"><p>{note.text}</p><a className="text-link" href={`#/playground/${i === 0 ? "cache" : "loop"}`}>Explore the idea <ArrowRight size={16} /></a></div></details>)}</div><a className="notes-email text-link" href={`mailto:${LAB_META.email}`}>Something we should think about? Write to us <ArrowUpRight size={16} /></a></div>}
    </main>
    <footer className="site-footer"><div className="container footer-main"><div><a className="brand" href="#/" aria-label="ILRL home"><LoopMark /><span>ILRL</span></a><p>{LAB_META.fullName}</p></div><a className="footer-email" href={`mailto:${LAB_META.email}`}>Let’s talk about the work.<ArrowUpRight size={24} strokeWidth={1.5} /><span>{LAB_META.email}</span></a></div><div className="container footer-bottom"><span>ILRL Labs</span><span>Inference. Memory. Recurrence.</span><a href="#/people">Members <ArrowUpRight size={13} /></a></div></footer>
  </div>;
}
