import test from "node:test";
import assert from "node:assert/strict";
import { buildFilter } from "../src/lib/vehicleFilter.js";

function params(obj) {
  return new URLSearchParams(obj);
}

test("empty query params produce an empty filter", () => {
  assert.deepEqual(buildFilter(params({})), {});
});

test("plate filter is case-insensitive substring match", () => {
  const f = buildFilter(params({ plate: "ml05" }));
  assert.equal(f.plate_number.$regex, "ML05");
  assert.equal(f.plate_number.$options, "i");
});

test("status filter passes through exactly", () => {
  assert.deepEqual(buildFilter(params({ status: "exited" })), { status: "exited" });
});

test("date_from/date_to build a $gte/$lte range on entry_time", () => {
  const f = buildFilter(params({ date_from: "2026-01-01", date_to: "2026-01-31" }));
  assert.ok(f.entry_time.$gte instanceof Date);
  assert.ok(f.entry_time.$lte instanceof Date);
  assert.equal(f.entry_time.$gte.toISOString().slice(0, 10), "2026-01-01");
});
