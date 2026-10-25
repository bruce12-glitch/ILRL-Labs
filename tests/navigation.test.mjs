import assert from "node:assert/strict";
import test from "node:test";
import { activeSection, resolveSection, SECTIONS } from "../src/utils/navigation.ts";

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

test("the final section stays active at the bottom, even when its top cannot reach the header", () => {
  assert.equal(activeSection([["future-goals", -150], ["members", 420]], true), "members");
  assert.equal(activeSection([["about", -800], ["research", 88], ["interests", 700], ["members", 1200]], false), "research");
  assert.equal(activeSection([["about", 72], ["research", 550]], false), "about");
});
