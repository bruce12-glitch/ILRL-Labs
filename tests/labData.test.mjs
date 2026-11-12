import assert from "node:assert/strict";
import test from "node:test";
import {
  GOALS,
  HERO_PILLARS,
  INTERESTS,
  LAB,
  PAPERS,
  PEOPLE,
  RESEARCH_METHODOLOGY,
} from "../src/data/lab.ts";

test("hero overview includes complete thesis and 4 architectural research pillars", () => {
  assert.ok(LAB.about.length > 40);
  assert.ok(LAB.thesis.length > 80);
  assert.equal(HERO_PILLARS.length, 4);
  for (const pillar of HERO_PILLARS) {
    assert.ok(pillar.title.length > 0);
    assert.ok(pillar.description.length > 30);
    assert.ok(pillar.href.startsWith("#"));
  }
});

test("research papers include detailed technical scope, contributions, and arXiv IDs", () => {
  assert.equal(PAPERS.length, 2);
  for (const paper of PAPERS) {
    assert.ok(paper.arxivId.startsWith("arXiv:"));
    assert.ok(paper.detail.length > 80);
    assert.equal(paper.contributions.length, 3);
  }
  assert.equal(RESEARCH_METHODOLOGY.length, 3);
});

test("interests and future goals contain expanded questions and milestones", () => {
  assert.equal(INTERESTS.length, 6);
  for (const interest of INTERESTS) {
    assert.ok(interest.description.length > 60);
    assert.ok(interest.question.endsWith("?"));
  }
  assert.equal(GOALS.length, 3);
  for (const goal of GOALS) {
    assert.ok(goal.detail.length > 60);
    assert.equal(goal.milestones.length, 3);
  }
  assert.equal(PEOPLE.length, 2);
  for (const person of PEOPLE) {
    assert.ok(person.bio.length > 60);
    assert.equal(person.areas.length, 3);
  }
});
