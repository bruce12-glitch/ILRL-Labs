import React, { useEffect, useState } from "react";
import "./styles/tokens.css";
import {
  LAB_META,
  STATS,
  PROJECTS,
  RESEARCH_DIRECTIONS,
  PAPERS,
  PEOPLE,
  NEWS,
  Project,
  Paper,
} from "./data/lab";

type RouteTab = "overview" | "research" | "publications" | "people";

export function App() {
  const [activeTab, setActiveTab] = useState<RouteTab>("overview");
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [papers, setPapers] = useState<Paper[]>(PAPERS);
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"local-monograph" | "synced-api">("local-monograph");

  // Sync hash route on load and popstate
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "") as RouteTab;
      if (["overview", "research", "publications", "people"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // Fault-tolerant API hydration (Fixes BUG-03)
  useEffect(() => {
    const apiBase = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL;
    if (!apiBase) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);

    Promise.all([
      fetch(`${apiBase.replace(/\/$/, "")}/api/projects`, { signal: controller.signal }),
      fetch(`${apiBase.replace(/\/$/, "")}/api/papers`, { signal: controller.signal }),
    ])
      .then(async ([projRes, paperRes]) => {
        if (projRes.ok) {
          const projData = await projRes.json();
          if (Array.isArray(projData) && projData.length > 0) setProjects(projData);
        }
        if (paperRes.ok) {
          const paperData = await paperRes.json();
          if (Array.isArray(paperData) && paperData.length > 0) setPapers(paperData);
        }
        setApiStatus("synced-api");
      })
      .catch(() => {
        // Deterministic fallback to local monograph data without console noise
        setApiStatus("local-monograph");
      })
      .finally(() => window.clearTimeout(timer));

    return () => controller.abort();
  }, []);

  const navigate = (tab: RouteTab) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyBibtex = (id: string, bibtex: string) => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtexId(id);
    window.setTimeout(() => setCopiedBibtexId(null), 1800);
  };

  return (
    <div>
      {/* Top Institutional Navigation Bar */}
      <header className="ilrl-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-16)" }}>
          <a
            href="#/overview"
            onClick={(e) => {
              e.preventDefault();
              navigate("overview");
            }}
            style={{
              color: "var(--color-text)",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "var(--font-size-mono)",
              letterSpacing: "-0.32px",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            ILRL LABS
          </a>
          <span
            className="type-dense"
            style={{
              color: "var(--color-text-muted-on-light)",
              borderLeft: "1px solid var(--color-border-hairline-light)",
              paddingLeft: "var(--space-12)",
            }}
          >
            LLM Inference & ML Systems
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-22)", flexWrap: "wrap" }}>
          {(["overview", "research", "publications", "people"] as RouteTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => navigate(tab)}
              className="link-editorial"
              style={{
                fontWeight: activeTab === tab ? 700 : 400,
                textDecorationColor: activeTab === tab ? "var(--color-text)" : "transparent",
                textTransform: "uppercase",
              }}
            >
              {tab}
            </button>
          ))}
          <a
            href={LAB_META.frontendRepo}
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
          >
            GitHub
          </a>
          <a href={`mailto:${LAB_META.contactEmail}`} className="button-primary">
            Correspondence →
          </a>
        </nav>
      </header>

      <main className="ilrl-container">
        {/* HERO SECTION */}
        {activeTab === "overview" && (
          <section className="ilrl-section">
            <div className="ilrl-grid-12">
              <div className="ilrl-col-4">
                <p className="type-mono" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-12)" }}>
                  00 / THESIS & TELEMETRY
                </p>
                <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-8)" }}>
                  LOC: {LAB_META.location.toUpperCase()}
                </p>
                <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                  DATA SOURCE: {apiStatus === "synced-api" ? "LIVE API" : "STATIC MONOGRAPH"}
                </p>
              </div>

              <div className="ilrl-col-8">
                <h1 className="type-display" style={{ marginBottom: "var(--space-22)" }}>
                  Exact-budget memory systems and Rényi pruning for long-context inference.
                </h1>
                <p className="type-editorial" style={{ marginBottom: "var(--space-58)" }}>
                  {LAB_META.thesis}
                </p>

                {/* Quantitative Telemetry Grid */}
                <div className="ilrl-subgrid-2">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="card-editorial-light">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "var(--space-16)",
                          }}
                        >
                          <span className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                            {stat.label.toUpperCase()}
                          </span>
                          <span className="type-mono" style={{ fontWeight: 700 }}>
                            {stat.value}
                          </span>
                        </div>
                        <p className="type-dense" style={{ color: "var(--color-text-secondary-on-light)" }}>
                          {stat.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CORE SYSTEMS RESEARCH */}
        {(activeTab === "overview" || activeTab === "research") && (
          <section className="ilrl-section">
            <div className="ilrl-grid-12">
              <div className="ilrl-col-4">
                <p className="type-mono" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-12)" }}>
                  01 / SYSTEMS & ALGORITHMS
                </p>
                <h2 className="type-heading-md" style={{ marginBottom: "var(--space-16)" }}>
                  Active Inference Engines
                </h2>
                <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                  Every algorithm in the lab is benchmarked against physical GPU page constraints, Grouped-Query Attention (GQA) head sharing, and LongBench multi-document tasks.
                </p>
              </div>

              <div className="ilrl-col-8" style={{ display: "flex", flexDirection: "column", gap: "var(--space-22)" }}>
                {projects.map((project) => (
                  <article key={project.id} className="card-editorial-light">
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "var(--space-16)",
                        }}
                      >
                        <span className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                          {project.status.toUpperCase()}
                        </span>
                        <span className="type-mono">{project.index}</span>
                      </div>

                      <h3 className="type-heading-sm" style={{ marginBottom: "var(--space-8)" }}>
                        {project.title}: {project.subtitle}
                      </h3>

                      <p className="type-editorial" style={{ marginBottom: "var(--space-16)" }}>
                        {project.summary}
                      </p>

                      <div
                        style={{
                          borderTop: "1px solid var(--color-border-hairline-light)",
                          paddingTop: "var(--space-16)",
                          marginBottom: "var(--space-16)",
                        }}
                      >
                        <p className="type-dense" style={{ fontWeight: 700, marginBottom: "var(--space-8)" }}>
                          SYSTEM BOTTLENECK ADDRESSED
                        </p>
                        <p className="type-dense" style={{ color: "var(--color-text-secondary-on-light)", marginBottom: "var(--space-16)" }}>
                          {project.problemStatement}
                        </p>

                        <p className="type-dense" style={{ fontWeight: 700, marginBottom: "var(--space-8)" }}>
                          KEY TECHNICAL MECHANISMS
                        </p>
                        <ul style={{ paddingLeft: "var(--space-16)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                          {project.contributions.map((item, idx) => (
                            <li key={idx} className="type-dense" style={{ color: "var(--color-text-secondary-on-light)" }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Inverse Dark Benchmark Strip */}
                    <div
                      className="card-surface-dark"
                      style={{
                        padding: "var(--space-22)",
                        borderRadius: "var(--radius-md)",
                        marginTop: "var(--space-16)",
                      }}
                    >
                      <table className="benchmark-table">
                        <thead>
                          <tr>
                            <th>METRIC</th>
                            <th>MEASURED VALUE</th>
                            <th>EXPERIMENTAL CONDITION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.metrics.map((m) => (
                            <tr key={m.label}>
                              <td style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)" }}>{m.label}</td>
                              <td style={{ color: "var(--color-on-primary)", fontWeight: 700 }}>{m.value}</td>
                              <td style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", color: "var(--color-text-muted-on-dark)" }}>
                                {m.detail}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ display: "flex", gap: "var(--space-12)", marginTop: "var(--space-22)", flexWrap: "wrap" }}>
                        <a href={project.code} target="_blank" rel="noreferrer" className="button-inverse">
                          Source Repository ({project.title}) →
                        </a>
                        <a
                          href={project.arxivUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button-secondary"
                          style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border-hairline-dark)" }}
                        >
                          arXiv:{project.arxivId}
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* OPEN PROBLEMS & CURRENT RESEARCH DIRECTIONS */}
        {(activeTab === "overview" || activeTab === "research") && (
          <section className="ilrl-section">
            <div className="ilrl-grid-12">
              <div className="ilrl-col-4">
                <p className="type-mono" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-12)" }}>
                  02 / OPEN PROBLEMS
                </p>
                <h2 className="type-heading-md" style={{ marginBottom: "var(--space-16)" }}>
                  Current Research Directions
                </h2>
                <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                  Ongoing theoretical derivations and kernel implementations under active investigation across reinforcement learning and hardware-aligned serving.
                </p>
              </div>

              <div className="ilrl-col-8">
                <div className="ilrl-subgrid-2">
                  {RESEARCH_DIRECTIONS.map((dir) => (
                    <div key={dir.id} className="card-editorial-light">
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-16)" }}>
                          <span className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                            {dir.domain.toUpperCase()}
                          </span>
                          <span className="type-mono">{dir.index}</span>
                        </div>
                        <h3 className="type-heading-sm" style={{ marginBottom: "var(--space-12)" }}>
                          {dir.title}
                        </h3>
                        <p className="type-dense" style={{ color: "var(--color-text-secondary-on-light"), marginBottom: "var(--space-16)" }}>
                          {dir.hypothesis}
                        </p>
                        <ul style={{ paddingLeft: "var(--space-16)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                          {dir.mechanisms.map((mech, i) => (
                            <li key={i} className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                              {mech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PUBLICATIONS & BIBTEX MONOGRAPHS */}
        {(activeTab === "overview" || activeTab === "publications") && (
          <section className="ilrl-section">
            <div className="ilrl-grid-12">
              <div className="ilrl-col-4">
                <p className="type-mono" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-12)" }}>
                  03 / PUBLICATIONS
                </p>
                <h2 className="type-heading-md" style={{ marginBottom: "var(--space-16)" }}>
                  Manuscripts & Preprints
                </h2>
                <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                  Direct links to arXiv manuscripts, open-source reproduction scripts, and BibTeX records.
                </p>
              </div>

              <div className="ilrl-col-8" style={{ display: "flex", flexDirection: "column", gap: "var(--space-22)" }}>
                {papers.map((paper, idx) => (
                  <article key={paper.id} className="card-editorial-light">
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-16)" }}>
                        <span className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
                          {paper.venue.toUpperCase()} · {paper.date.toUpperCase()}
                        </span>
                        <span className="type-mono">P0{idx + 1} · arXiv:{paper.arxivId}</span>
                      </div>

                      <h3 className="type-heading-sm" style={{ marginBottom: "var(--space-8)" }}>
                        {paper.title}
                      </h3>
                      <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-16)" }}>
                        Authors: {paper.authors.join(", ")}
                      </p>
                      <p className="type-editorial" style={{ marginBottom: "var(--space-22)" }}>
                        {paper.abstract}
                      </p>

                      <pre
                        className="type-mono"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text-muted)",
                          padding: "var(--space-16)",
                          borderRadius: "var(--radius-sm)",
                          overflowX: "auto",
                          fontSize: "12px",
                          marginBottom: "var(--space-22)",
                        }}
                      >
                        <code>{paper.bibtex}</code>
                      </pre>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-12)", flexWrap: "wrap" }}>
                      <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="button-primary">
                        Read Manuscript (PDF) →
                      </a>
                      <a href={paper.codeUrl} target="_blank" rel="noreferrer" className="button-secondary">
                        Benchmark Code
                      </a>
                      <button
                        type="button"
                        onClick={() => copyBibtex(paper.id, paper.bibtex)}
                        className="button-secondary"
                      >
                        {copiedBibtexId === paper.id ? "Copied BibTeX" : "Copy BibTeX"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PEOPLE & LAB LOG */}
        {(activeTab === "overview" || activeTab === "people") && (
          <section className="ilrl-section">
            <div className="ilrl-grid-12">
              <div className="ilrl-col-4">
                <p className="type-mono" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-12)" }}>
                  04 / PEOPLE & CHANGELOG
                </p>
                <h2 className="type-heading-md" style={{ marginBottom: "var(--space-16)" }}>
                  Researchers & Lab Log
                </h2>
              </div>

              <div className="ilrl-col-8">
                <div className="ilrl-subgrid-2" style={{ marginBottom: "var(--space-58)" }}>
                  {PEOPLE.map((person) => (
                    <div key={person.id} className="card-editorial-light">
                      <div>
                        <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-8)" }}>
                          {person.role.toUpperCase()}
                        </p>
                        <h3 className="type-heading-sm" style={{ marginBottom: "var(--space-8)" }}>
                          {person.name}
                        </h3>
                        <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)", marginBottom: "var(--space-16)" }}>
                          {person.affiliation}
                        </p>
                        <p className="type-dense" style={{ color: "var(--color-text-secondary-on-light)", marginBottom: "var(--space-22)" }}>
                          {person.focus}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "var(--space-16)" }}>
                        {person.github && (
                          <a href={person.github} target="_blank" rel="noreferrer" className="link-editorial">
                            GitHub →
                          </a>
                        )}
                        {person.email && (
                          <a href={`mailto:${person.email}`} className="link-editorial">
                            Email →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chronological Lab Dispatches */}
                <div className="card-editorial-light">
                  <p className="type-dense" style={{ fontWeight: 700, marginBottom: "var(--space-16)" }}>
                    RECENT LAB DISPATCHES
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
                    {NEWS.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: "var(--space-16)",
                          borderBottom: i < NEWS.length - 1 ? "1px solid var(--color-border-hairline-light)" : "none",
                          paddingBottom: i < NEWS.length - 1 ? "var(--space-16)" : "0",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "flex", gap: "var(--space-12)", alignItems: "baseline" }}>
                          <span className="type-mono" style={{ fontSize: "12px", color: "var(--color-text-muted-on-light)" }}>
                            {item.date}
                          </span>
                          <span className="type-dense" style={{ fontWeight: 700 }}>
                            [{item.tag}]
                          </span>
                          <span className="type-dense" style={{ color: "var(--color-text-secondary-on-light)" }}>
                            {item.text}
                          </span>
                        </div>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="link-editorial">
                            Inspect →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="ilrl-container" style={{ paddingBlock: "var(--space-58)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-22)",
          }}
        >
          <div>
            <p className="type-mono" style={{ fontWeight: 700, marginBottom: "var(--space-4)" }}>
              {LAB_META.name} — {LAB_META.fullName}
            </p>
            <p className="type-dense" style={{ color: "var(--color-text-muted-on-light)" }}>
              Contact: {LAB_META.contactEmail}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-22)", flexWrap: "wrap" }}>
            <a href={LAB_META.liveSite} target="_blank" rel="noreferrer" className="link-editorial">
              Live Site
            </a>
            <a href={LAB_META.frontendRepo} target="_blank" rel="noreferrer" className="link-editorial">
              Frontend Repo (ILRL-Labs)
            </a>
            <a href={LAB_META.backendRepo} target="_blank" rel="noreferrer" className="link-editorial">
              Backend API (ILRL-Backend)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;