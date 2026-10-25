export const TOKENS = ["The", "model", "keeps", "what", "it", "needs", "."] as const;
export const PAGE_SCORES = [0.92, 0.36, 0.81, 0.24, 0.69, 0.18, 0.57, 0.97, 0.31, 0.74, 0.49, 0.86, 0.12, 0.63, 0.43, 0.95, 0.21, 0.78, 0.53, 0.88];

/** A deterministic illustration, not the Page-EntroKV scoring algorithm. */
export function retainedPages(scores: readonly number[], budget: number): number[] {
  const count = Number.isFinite(budget) ? Math.max(0, Math.min(scores.length, Math.floor(budget))) : 0;
  return scores.map((score, index) => ({ score: Number.isFinite(score) ? score : -Infinity, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count).map(({ index }) => index).sort((a, b) => a - b);
}

/** Normalized toy weights with a causal mask; no model output is implied. */
export function attentionRow(query: number, count = TOKENS.length): number[] {
  const q = Math.max(0, Math.min(count - 1, Math.floor(query)));
  const raw = Array.from({ length: count }, (_, key) => key > q ? 0 : 1 / (1 + q - key) + ((key * 3 + q) % 5) / 12);
  const total = raw.reduce((sum, value) => sum + value, 0);
  return raw.map((value) => value / total);
}

export type Page = "overview" | "research" | "playground" | "people" | "publications";
export function parsePage(hash: string): { page: Page; tool: string } {
  const [slug, tool = ""] = hash.replace(/^#\/?/, "").split("/");
  const aliases: Record<string, Page> = { "": "overview", home: "overview", overview: "overview", research: "research", playground: "playground", people: "people", members: "people", publications: "publications", notes: "publications" };
  return { page: aliases[slug] ?? "overview", tool };
}
