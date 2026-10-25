import assert from "node:assert/strict";
import test from "node:test";
import { resolveSection, SECTIONS } from "../src/utils/navigation.ts";

test("section links resolve with native and previous hash formats", () => {
  for (const section of SECTIONS) {
    assert.equal(resolveSection(`#${section}`), section);
    assert.equal(resolveSection(`#/${section}`), section);
  }
  assert.equal(resolveSection("#/people"), "members");
  assert.equal(resolveSection("#/publications"), "research");
  assert.equal(resolveSection("#/research/entroprefill"), "research");
});

test("unknown and retired routes return to About", () => {
  for (const hash of ["", "#/", "#unknown", "#/playground/cache", "#/home"]) {
    assert.equal(resolveSection(hash), "about");
  }
});
