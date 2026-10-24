import type { Metric, Paper, Project } from "../data/lab";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStrings(value: Record<string, unknown>, fields: string[]): boolean {
  return fields.every((field) => typeof value[field] === "string");
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isWebUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isMetric(value: unknown): value is Metric {
  return isRecord(value) && hasStrings(value, ["label", "value", "detail"]);
}

export function isProjectList(value: unknown): value is Project[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) =>
    isRecord(item) && hasStrings(item, [
      "id", "index", "title", "subtitle", "status", "arxivId", "summary", "problemStatement",
    ]) && isWebUrl(item.arxivUrl) && isWebUrl(item.code) &&
    isStringList(item.contributions) && Array.isArray(item.metrics) && item.metrics.every(isMetric)
  );
}

export function isPaperList(value: unknown): value is Paper[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) =>
    isRecord(item) && hasStrings(item, [
      "id", "title", "venue", "date", "arxivId", "abstract", "bibtex",
    ]) && isStringList(item.authors) && isWebUrl(item.pdfUrl) && isWebUrl(item.codeUrl)
  );
}
