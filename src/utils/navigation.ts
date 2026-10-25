export const SECTIONS = ["about", "members", "research", "interests", "future-goals"] as const;
export type Section = typeof SECTIONS[number];

/** Keep previously shared page links useful after removing the separate pages. */
export function resolveSection(hash: string): Section {
  const slug = hash.replace(/^#\/?/, "").split("/")[0].toLowerCase();
  if ((SECTIONS as readonly string[]).includes(slug)) return slug as Section;
  const aliases: Record<string, Section> = { people: "members", publications: "research", notes: "research", interest: "interests", goals: "future-goals", future: "future-goals" };
  return aliases[slug] ?? "about";
}
