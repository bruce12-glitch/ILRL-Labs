import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { useRoute } from "./router";
import Home from "./pages/Home";
import Research from "./pages/Research";
import Publications from "./pages/Publications";
import People from "./pages/People";

const TITLES: Record<string, string> = {
  "": "ILRL — Inference-in-Loop & Recurrence Lab | Efficient LLM Inference & ML Systems",
  research:
    "Research — ILRL | Mitigating Long-Context Prefill Latency & Breaking KV-Cache Memory Walls",
  publications: "Publications — ILRL | Preprints on Efficient LLM Inference & ML Systems",
  people: "People — ILRL | Faculty, Researchers & Alumni",
};

export default function App() {
  const route = useRoute();
  const [pageKey, setPageKey] = useState(0);

  // Update document title
  useEffect(() => {
    document.title = TITLES[route.page] ?? TITLES[""];
  }, [route.page]);

  // Trigger re-mount animation on page change
  useEffect(() => {
    setPageKey((k) => k + 1);
  }, [route.page]);

  // Scroll handling
  useEffect(() => {
    if (route.anchor) {
      const t = window.setTimeout(() => {
        document.getElementById(route.anchor!)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route.page, route.anchor]);

  const Page =
    route.page === "research"
      ? Research
      : route.page === "publications"
        ? Publications
        : route.page === "people"
          ? People
          : Home;

  return (
    <div className="grain flex min-h-screen flex-col bg-ink text-fog">
      <Nav />
      <main className="flex-1 page-enter" key={pageKey}>
        <Page />
      </main>
      <Footer />
    </div>
  );
}
