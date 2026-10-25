import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight, Play, Pause, RotateCcw, Layers, Network, Route } from "lucide-react";
import { attentionRow, PAGE_SCORES, retainedPages, TOKENS } from "../utils/playground";

export function LoopMark({ className = "" }: { className?: string }) {
  return <svg className={className} width="38" height="28" viewBox="0 0 42 30" fill="none" aria-hidden="true">
    <path d="M21 15C15 3 3 5 3 15s12 12 18 0S39 3 39 15 27 27 21 15Z" stroke="currentColor" strokeWidth="2.6" />
    <path d="m32 6 4 2-3 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function HeroCircuit({ motion }: { motion: boolean }) {
  const [phase, setPhase] = useState<"prefill" | "decode">("decode");
  const frame = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (!motion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-y", `${(event.clientX - rect.left - rect.width / 2) / rect.width * 10}deg`);
    event.currentTarget.style.setProperty("--tilt-x", `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 8}deg`);
  };
  const reset = () => {
    frame.current?.style.setProperty("--tilt-x", "0deg");
    frame.current?.style.setProperty("--tilt-y", "0deg");
  };
  return <div ref={frame} className="circuit-frame" data-active={motion && inView} data-phase={phase} onPointerMove={tilt} onPointerLeave={reset}>
    <div className="instrument-top"><span className="micro">01 / INSIDE THE LOOP</span><span className="sketch-tag">Concept sketch</span></div>
    <div className="circuit-world" aria-label="A three-dimensional sketch of tokens moving through compute and a KV cache" role="img">
      <svg className="circuit-floor" viewBox="0 0 640 420" fill="none" aria-hidden="true">
        <defs><pattern id="circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.8" fill="#c9c6bd" /></pattern></defs>
        <rect x="12" y="25" width="616" height="360" fill="url(#circuit-grid)" />
        <path d="M48 208H315V330H530V208H315" stroke="#d4d0c6" strokeWidth="3" strokeLinejoin="round" />
        <path d="M315 208H555" stroke="#c7c0d9" strokeWidth="2" strokeDasharray="4 6" />
        <path className="signal-route" d={phase === "decode" ? "M315 208V330H530V208H315" : "M48 208H315V330H530"} stroke="#786ba3" strokeWidth="2" />
        <circle className={`flow-dot flow-dot--${phase}`} r="5" fill="#a65b3f" stroke="#faf9f5" strokeWidth="3" />
        <text x="46" y="247" className="scene-label">input tokens</text><text x="214" y="298" className="scene-label">transformer layers</text>
        <text x="485" y="190" className="scene-label">KV memory</text><text x="355" y="365" className="scene-label">one more token ↶</text>
      </svg>
      <div className="prompt-tokens" aria-hidden="true">{["a", "b", "c", "d"].map((token, i) => <span key={token} style={{ "--i": i } as CSSProperties}>{token}</span>)}</div>
      <div className="compute-stack" aria-hidden="true">{[0, 1, 2, 3].map(layer => <div key={layer} className="layer-plate" style={{ "--layer": layer } as CSSProperties}>
        {layer === 3 && <><div className="layer-heading"><span>ATTENTION</span><span>↗</span></div><div className="mini-matrix">{Array.from({ length: 36 }, (_, i) => <span key={i} className={i % 6 <= Math.floor(i / 6) ? "filled" : "masked"} style={{ opacity: i % 6 === Math.floor(i / 6) ? 1 : 0.45 }} />)}</div></>}
      </div>)}</div>
      <div className="cache-stack" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--page": i } as CSSProperties}><i /><b>k</b><b>v</b><small>{String(i + 1).padStart(2, "0")}</small></span>)}</div>
    </div>
    <div className="circuit-controls"><div className="segmented" role="group" aria-label="Inference phase">
      <button type="button" aria-pressed={phase === "prefill"} onClick={() => setPhase("prefill")}>Prefill</button>
      <button type="button" aria-pressed={phase === "decode"} onClick={() => setPhase("decode")}>Decode</button>
    </div><span className="micro pointer-hint">Move your pointer to explore ↗</span></div>
    <p className="scene-caption" aria-live="polite">{phase === "prefill" ? "Read the prompt. Build the memory." : "Use the memory. Write a token. Repeat."}</p>
  </div>;
}

const STAGES = ["Prompt", "Tokenize", "Embed", "Prefill", "Decode", "Response"];
const EXPLANATIONS = ["Start with a short prompt.", "Split the text into tokens.", "Turn the tokens into vectors.", "Process the prompt and build its KV cache.", "Generate a token, update memory, and repeat.", "Turn the generated tokens back into text."];
const POINTS = [[65, 80], [215, 80], [365, 80], [535, 80], [435, 240], [605, 345]];

function InferenceWalk({ motion }: { motion: boolean }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const stage = step < 4 ? step : step < 8 ? 4 : 5;
  useEffect(() => {
    if (!running || !motion) return;
    const timer = window.setInterval(() => setStep(value => {
      if (value >= 8) { setRunning(false); return value; }
      return value + 1;
    }), 1300);
    return () => window.clearInterval(timer);
  }, [running, motion]);
  useEffect(() => { if (!motion) setRunning(false); }, [motion]);
  return <div className="walkthrough" data-step={step}>
    <div className="walk-diagram">
      <svg viewBox="0 0 680 420" role="img" aria-label={`Inference diagram. Current stage: ${STAGES[stage]}`}>
        <path d="M65 80H535V240H350V345H535V240M535 345H605" fill="none" stroke="#ded9ce" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path className="walk-loop" data-current={stage === 4} d="M435 240H350V345H535V240H435" fill="none" stroke="#a65b3f" strokeWidth="5" strokeDasharray="6 8" strokeLinecap="round" />
        <path d="M425 180V225M290 120V165H355M570 260H625" fill="none" stroke="#aaa1c0" strokeWidth="2" />
        <text x="379" y="170" className="diagram-label">KV cache</text><text x="240" y="186" className="diagram-label">context</text><text x="560" y="285" className="diagram-label">memory</text>
        {POINTS.map(([x,y], i) => <g key={STAGES[i]} className={i === stage ? "station is-current" : "station"}>
          <circle cx={x} cy={y} r={i === stage ? 14 : 10} /><text x={x} y={y - 27} textAnchor="middle">{STAGES[i]}</text>
          {i === stage && <circle cx={x} cy={y} r="4" className="station-core" />}
        </g>)}
        <text x="442" y="299" textAnchor="middle" className="loop-label">token by token</text>
        <text x="66" y="122" className="sample-prompt">“Why does memory matter?”</text>
      </svg>
      <div className="generated-text"><span className="micro">EXAMPLE OUTPUT</span><p>{step < 4 ? "Waiting for the prompt…" : ["", "Memory", "Memory matters", "Memory matters.", "Memory matters."][step - 4] || "…"}<span className="text-caret" /></p></div>
    </div>
    <div className="walk-detail"><span className="micro">{String(stage + 1).padStart(2, "0")} / {STAGES.length.toString().padStart(2, "0")}</span><h3>{STAGES[stage]}</h3><p aria-live={running ? "off" : "polite"}>{EXPLANATIONS[stage]}</p>
      <div className="stage-dots" role="group" aria-label="Choose a stage">{STAGES.map((label, i) => <button key={label} type="button" aria-label={`Go to ${label}`} aria-pressed={stage === i} onClick={() => { setRunning(false); setStep(i === 5 ? 8 : i); }}><span /></button>)}</div>
      <div className="tool-actions"><button className="button primary" type="button" onClick={() => { setRunning(false); setStep(value => (value + 1) % 9); }}>Next step <ArrowRight size={16} /></button>
        <button className="icon-button" aria-label={running ? "Pause walkthrough" : "Play walkthrough"} disabled={!motion} type="button" onClick={() => { if (step === 8) setStep(0); setRunning(value => !value); }}>{running ? <Pause size={17} /> : <Play size={17} />}</button>
        <button className="icon-button" aria-label="Reset walkthrough" type="button" onClick={() => { setStep(0); setRunning(false); }}><RotateCcw size={16} /></button>
      </div><p className="fine-print">A walkthrough, not a running language model.</p>
    </div>
  </div>;
}

function CacheBudget() {
  const [budget, setBudget] = useState(8);
  const [selected, setSelected] = useState(7);
  const kept = retainedPages(PAGE_SCORES, budget);
  const id = useId();
  return <div className="cache-experiment">
    <div className="cache-space"><div className="page-grid">{PAGE_SCORES.map((score, i) => <button key={i} type="button" className={`cache-page ${kept.includes(i) ? "is-kept" : "is-evicted"} ${selected === i ? "is-selected" : ""}`} aria-pressed={selected === i} aria-label={`Inspect page ${i + 1}, ${kept.includes(i) ? "retained" : "evicted"}`} onClick={() => setSelected(i)}>
      <span className="page-ruling" /><span className="micro">P{String(i + 1).padStart(2,"0")}</span><span className="page-score">{Math.round(score * 100)}</span>
    </button>)}</div><div className="cache-legend"><span><i />Retained</span><span><i />Evicted</span></div></div>
    <div className="cache-detail"><span className="micro">A FIXED BUDGET</span><h3>Make room.<br />Keep what matters.</h3><p>Move the budget. Watch which pages stay.</p>
      <label htmlFor={id}>Pages to keep <output>{budget} / 20</output></label><input id={id} type="range" min="1" max="20" value={budget} onChange={event => setBudget(Number(event.target.value))} />
      <div className="page-readout" aria-live="polite"><span>Page {String(selected + 1).padStart(2,"0")}</span><strong>{kept.includes(selected) ? "Retained" : "Evicted"}</strong><small>Illustrative score: {PAGE_SCORES[selected].toFixed(2)}</small></div>
      <p className="fine-print">Toy scores show the trade-off. They are not model measurements or a reproduction of Page-EntroKV.</p>
    </div>
  </div>;
}

function AttentionMap() {
  const [query, setQuery] = useState(4);
  const weights = attentionRow(query);
  return <div className="attention-experiment"><div className="attention-table-wrap"><span className="axis-label micro">KEYS →</span><table className="attention-table" aria-label="Illustrative causal attention weights"><thead><tr><th><span className="sr-only">Query token</span></th>{TOKENS.map((token,i) => <th key={i} scope="col">{token}</th>)}</tr></thead><tbody>{TOKENS.map((token,row) => <tr key={row} className={query === row ? "selected-row" : ""}><th scope="row"><button type="button" aria-pressed={query === row} aria-label={`Inspect attention for token ${row + 1}: ${token}`} onClick={() => setQuery(row)}>{token}<span>↗</span></button></th>{attentionRow(row).map((weight,col) => <td key={col}><span className={col > row ? "attention-cell is-masked" : "attention-cell"} style={{ "--weight": weight, "--selected": query === row ? 1 : 0.38 } as CSSProperties} title={col > row ? "Future token: masked" : `${token} → ${TOKENS[col]}: ${(weight*100).toFixed(1)}%`} /></td>)}</tr>)}</tbody></table><p className="fine-print">Choose a word on the left to inspect its row.</p></div>
    <div className="attention-detail"><span className="micro">CAUSAL ATTENTION</span><h3>The past is visible.<br />The future is not.</h3><p>“{TOKENS[query]}” can attend to itself and the words before it.</p><div className="weight-list">{weights.map((weight,i) => weight > 0 && <div key={i}><span>{TOKENS[i]}</span><i style={{ width: `${weight * 100}%` }} /><small>{(weight*100).toFixed(0)}%</small></div>)}</div><p className="fine-print">Illustrative weights. The mask is causal; the numbers are not from a model.</p></div>
  </div>;
}

const TOOLS = [{ id: "loop", label: "Follow a token", icon: Route }, { id: "cache", label: "KV pages", icon: Layers }, { id: "attention", label: "Attention", icon: Network }] as const;
export function Playground({ motion, initialTool = "loop" }: { motion: boolean; initialTool?: string }) {
  const [tool, setTool] = useState(initialTool);
  useEffect(() => setTool(TOOLS.some(item => item.id === initialTool) ? initialTool : "loop"), [initialTool]);
  return <section className="playground" aria-label="Interactive inference sketches"><div className="tool-tabs" role="tablist" aria-label="Choose a sketch">{TOOLS.map(({id,label,icon:Icon}, index) => <button id={`tab-${id}`} type="button" key={id} role="tab" aria-selected={tool === id} aria-controls={`panel-${id}`} tabIndex={tool === id ? 0 : -1} onClick={() => setTool(id)} onKeyDown={event => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault(); const next = (index + (event.key === "ArrowRight" ? 1 : -1) + TOOLS.length) % TOOLS.length;
    setTool(TOOLS[next].id); document.getElementById(`tab-${TOOLS[next].id}`)?.focus();
  }}><span className="icon-badge"><Icon size={18} /></span>{label}</button>)}</div>
    <div id={`panel-${tool}`} role="tabpanel" aria-labelledby={`tab-${tool}`} className="tool-panel" key={tool}>{tool === "cache" ? <CacheBudget /> : tool === "attention" ? <AttentionMap /> : <InferenceWalk motion={motion} />}</div>
  </section>;
}
