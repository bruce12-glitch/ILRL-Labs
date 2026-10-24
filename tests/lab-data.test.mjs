import assert from "node:assert/strict";
import test from "node:test";
import { PAPERS, PROJECTS } from "../src/data/lab.ts";
import { isPaperList, isProjectList } from "../src/utils/lab-data.ts";

test("bundled projects and publications satisfy the current frontend contract", () => {
  assert.equal(isProjectList(PROJECTS), true);
  assert.equal(isPaperList(PAPERS), true);
});

test("empty or error responses preserve bundled fallback content", () => {
  for (const value of [null, undefined, [], {}, { error: "unavailable" }, "<html>error</html>"]) {
    assert.equal(isProjectList(value), false);
    assert.equal(isPaperList(value), false);
  }
});

test("legacy API records cannot replace the new data and crash rendering", () => {
  assert.equal(isProjectList([{ id: "legacy", name: "Old project", tag: "SYS-01" }]), false);
  assert.equal(isPaperList([{ id: "legacy", title: "Old paper", arxiv: "https://arxiv.org" }]), false);
});

test("nested malformed metrics, contributions, and authors are rejected", () => {
  assert.equal(isProjectList([{ ...PROJECTS[0], metrics: [{ label: "x", value: 1 }] }]), false);
  assert.equal(isProjectList([{ ...PROJECTS[0], contributions: [null] }]), false);
  assert.equal(isPaperList([{ ...PAPERS[0], authors: [42] }]), false);
  assert.equal(isPaperList([{ ...PAPERS[0], bibtex: null }]), false);
});

test("a mixed valid and invalid response is rejected as a whole", () => {
  assert.equal(isProjectList([PROJECTS[0], {}]), false);
  assert.equal(isPaperList([PAPERS[0], null]), false);
});

test("only HTTP(S) publication and source URLs are accepted", () => {
  assert.equal(isProjectList([{ ...PROJECTS[0], code: "javascript:alert(1)" }]), false);
  assert.equal(isPaperList([{ ...PAPERS[0], pdfUrl: "not-a-url" }]), false);
  assert.equal(isPaperList([{ ...PAPERS[0], codeUrl: "data:text/html,invalid" }]), false);
});
