export const SECTIONS = ["about", "research", "interests", "future-goals", "members"] as const;
export type Section = typeof SECTIONS[number];

export function activeSection(tops: ReadonlyArray<readonly [Section, number]>, atBottom: boolean): Section {
  if (atBottom) return SECTIONS[SECTIONS.length - 1];
  return [...tops].reverse().find(([, top]) => top <= 110)?.[0] ?? "about";
}

/** Keep previously shared page links useful after removing the separate pages. */
export function resolveSection(hash: string): Section {
  const slug = hash.replace(/^#\/?/, "").split("/")[0].toLowerCase();
  if ((SECTIONS as readonly string[]).includes(slug)) return slug as Section;
  const aliases: Record<string, Section> = { people: "members", publications: "research", notes: "research", interest: "interests", goals: "future-goals", future: "future-goals" };
  return aliases[slug] ?? "about";
}
