import assert from "node:assert/strict";
import test from "node:test";
import { prepareInlineImages } from "../src/lib/post-inline-images.ts";

function client(fail = false) {
  const calls = [];
  return { calls, storage: { from: () => ({
    upload: async (path) => { calls.push(["upload", path]); return { error: fail ? new Error("failed") : null }; },
    remove: async (paths) => { calls.push(["remove", ...paths]); return { data: paths.map((name) => ({ name })), error: null }; },
    getPublicUrl: (path) => ({ data: { publicUrl: `https://example.test/${path}` } }),
  }) } };
}
const optimize = async (file) => file;

test("uploads a pending image only once and saves its path in the document", async () => {
  const api = client();
  const file = new File(["image"], "image.png", { type: "image/png" });
  const body = JSON.stringify({ type: "doc", content: [{ type: "image", attrs: { src: "blob:one", alt: "photo" } }, { type: "image", attrs: { src: "blob:one", alt: "photo" } }] });
  const result = await prepareInlineImages(api, body, new Map([["blob:one", file]]), [], optimize);
  assert.equal(api.calls.length, 1);
  assert.equal(result.paths.length, 1);
  assert.equal(result.uploaded.length, 1);
  assert.equal(JSON.parse(result.body).content[0].attrs.storagePath, result.paths[0]);
});

test("retains only previously attached images and rejects unknown paths", async () => {
  const api = client();
  const body = JSON.stringify({ type: "doc", content: [{ type: "image", attrs: { src: "https://example.test/a.png", storagePath: "a.png" } }] });
  assert.deepEqual((await prepareInlineImages(api, body, new Map(), ["a.png", "old.png"], optimize)).paths, ["a.png"]);
  await assert.rejects(prepareInlineImages(api, body, new Map(), [], optimize));
});

test("cleans up attempted uploads if an inline upload fails", async () => {
  const api = client(true);
  const file = new File(["image"], "image.png", { type: "image/png" });
  const body = JSON.stringify({ type: "doc", content: [{ type: "image", attrs: { src: "blob:one" } }] });
  await assert.rejects(prepareInlineImages(api, body, new Map([["blob:one", file]]), [], optimize));
  assert.deepEqual(api.calls.map((call) => call[0]), ["upload", "remove"]);
});
