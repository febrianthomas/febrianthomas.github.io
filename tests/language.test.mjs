import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const en = JSON.parse(readFileSync(new URL("../src/content/en.json", import.meta.url), "utf8"));
const id = JSON.parse(readFileSync(new URL("../src/content/id.json", import.meta.url), "utf8"));

function checkShape(english, indonesian, path = "text") {
  if (Array.isArray(english)) {
    assert.ok(Array.isArray(indonesian), path);
    assert.equal(indonesian.length, english.length, path);
    english.forEach((value, index) => checkShape(value, indonesian[index], `${path}[${index}]`));
  } else if (english && typeof english === "object") {
    assert.deepEqual(Object.keys(indonesian).sort(), Object.keys(english).sort(), path);
    for (const key of Object.keys(english)) checkShape(english[key], indonesian[key], `${path}.${key}`);
  } else {
    assert.equal(typeof indonesian, typeof english, path);
    if (typeof english === "string" && /\.(url|image|id|imagePosition|imageFit)$/.test(path)) assert.equal(indonesian, english, path);
    if (typeof english === "string" && english) assert.ok(indonesian, path);
  }
}

test("language files have matching keys and preserve links and assets", () => {
  checkShape(en, id);
});
