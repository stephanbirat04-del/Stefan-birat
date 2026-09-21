import test from "node:test";
import assert from "node:assert/strict";
import { calcFee, normalizePlate } from "../src/lib/fee.js";

test("5 min stay bills the minimum charge, not a full hour", () => {
  const entry = new Date("2026-01-01T10:00:00Z");
  const exit = new Date("2026-01-01T10:05:00Z");
  const { durationMin, fee } = calcFee(entry, exit, 30, 20, 10);
  assert.equal(durationMin, 5);
  assert.equal(fee, 20);
});

test("65 min stay within grace period stays at 1 hour", () => {
  const entry = new Date("2026-01-01T10:00:00Z");
  const exit = new Date("2026-01-01T11:05:00Z");
  const { durationMin, fee } = calcFee(entry, exit, 30, 20, 10);
  assert.equal(durationMin, 65);
  assert.equal(fee, 30);
});

test("75 min stay past grace period rounds up to 2 hours", () => {
  const entry = new Date("2026-01-01T10:00:00Z");
  const exit = new Date("2026-01-01T11:15:00Z");
  const { durationMin, fee } = calcFee(entry, exit, 30, 20, 10);
  assert.equal(durationMin, 75);
  assert.equal(fee, 60);
});

test("130 min stay with 10 min remainder exactly at grace boundary stays at 2 hours", () => {
  const entry = new Date("2026-01-01T10:00:00Z");
  const exit = new Date("2026-01-01T12:10:00Z");
  const { durationMin, fee } = calcFee(entry, exit, 30, 20, 10);
  assert.equal(durationMin, 130);
  assert.equal(fee, 60);
});

test("normalizePlate uppercases and strips whitespace", () => {
  assert.equal(normalizePlate(" ml05 ab 1234 "), "ML05AB1234");
});
