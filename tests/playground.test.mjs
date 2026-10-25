import assert from "node:assert/strict";
import test from "node:test";
import { LAB_META, PEOPLE, PROJECTS } from "../src/data/lab.ts";
import { PAGE_SCORES, retainedPages, attentionRow, parsePage, TOKENS } from "../src/utils/playground.ts";

test("cache illustration conserves every integer page budget", () => {
  for (let budget = 0; budget <= PAGE_SCORES.length; budget++) {
    const kept = retainedPages(PAGE_SCORES, budget);
    assert.equal(kept.length, budget);
    assert.equal(new Set(kept).size, budget);
    assert.ok(kept.every(index => index >= 0 && index < PAGE_SCORES.length));
  }
});
test("cache selection clamps invalid budgets and resolves ties consistently", () => {
  assert.deepEqual(retainedPages([1, 1, 1], 2), [0, 1]);
  assert.deepEqual(retainedPages([1, 2], -3), []);
  assert.deepEqual(retainedPages([1, 2], 99), [0, 1]);
  assert.deepEqual(retainedPages([1, 2], NaN), []);
  assert.deepEqual(retainedPages([NaN, 2, 1], 1), [1]);
});
test("attention weights sum to one and never attend to future tokens", () => {
  for (let query = 0; query < TOKENS.length; query++) {
    const row = attentionRow(query);
    assert.ok(Math.abs(row.reduce((a,b) => a+b, 0) - 1) < 1e-12);
    assert.ok(row.slice(query + 1).every(weight => weight === 0));
  }
});
test("old links, new member links, and playground deep links resolve", () => {
  assert.equal(parsePage("#/").page, "overview");
  assert.equal(parsePage("#/members").page, "people");
  assert.equal(parsePage("#/people").page, "people");
  assert.deepEqual(parsePage("#/playground/cache"), {page:"playground",tool:"cache"});
  assert.equal(parsePage("#/unknown").page, "overview");
});
test("the exact lab name and both original member portraits are preserved", () => {
  assert.equal(LAB_META.fullName, "Inference in Loops and Recurrence Learning Labs");
  assert.deepEqual(PEOPLE.map(person => [person.name, person.photo]), [["Inbasekaran S", "people/inba.jpg"], ["Vinoth Nandakumar", "people/vinu.jpg"]]);
});
test("content exposes relevant project code, not website or backend repository links", () => {
  const content = JSON.stringify({ LAB_META, PEOPLE, PROJECTS });
  assert.ok(!content.includes("github.com/bruce12-glitch/ILRL-Labs"));
  assert.ok(!content.includes("github.com/bruce12-glitch/ILRL-Backend"));
  assert.equal(PROJECTS.length, 2);
});
