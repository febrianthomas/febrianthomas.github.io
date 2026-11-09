import assert from "node:assert/strict";
import test from "node:test";
import { updatePostRecord, PostUpdateUncertainError } from "../src/lib/post-update.ts";

const original = { id: "post", image_path: "old.webp", inline_image_paths: [] };
const values = { title: "Title", description: "Description", body: "Body", body_format: "plain", image_alt: "Alt", image_caption: null, tags: [], featured: false, inline_image_paths: [] };

function mockClient({ updateError = null, status = 200, noMatch = false, removeError = false } = {}) {
  const calls = [];
  const client = {
    calls,
    storage: { from: () => ({
      upload: async (path) => { calls.push(["upload", path]); return { error: null }; },
      remove: async (paths) => { calls.push(["remove", ...paths]); return { data: removeError ? null : [{ name: paths[0] }], error: removeError ? new Error("Storage failed") : null }; },
      list: async () => ({ data: [], error: null }),
    }) },
    from: () => ({ update: (input) => {
      calls.push(["update", input]);
      const query = { eq: () => query, is: () => query, select: () => ({ maybeSingle: async () => ({ data: updateError || noMatch ? null : { id: "post", ...input }, error: updateError, status }) }) };
      return query;
    } }),
  };
  return client;
}

test("keeps the existing image when no new image is selected", async () => {
  const client = mockClient();
  const result = await updatePostRecord(client, original, values, null, false);
  assert.equal(result.post.image_path, "old.webp");
  assert.deepEqual(client.calls.map((call) => call[0]), ["update"]);
});

test("replaces the image only after the database update succeeds", async () => {
  const client = mockClient();
  const image = new File(["image"], "new.webp", { type: "image/webp" });
  const result = await updatePostRecord(client, original, values, image, false);
  assert.match(result.post.image_path, /\.webp$/);
  assert.deepEqual(client.calls.map((call) => call[0]), ["upload", "update", "remove"]);
  assert.deepEqual(client.calls[2], ["remove", "old.webp"]);
});

test("removes the old image when explicitly removed", async () => {
  const client = mockClient();
  const result = await updatePostRecord(client, original, values, null, true);
  assert.equal(result.post.image_path, null);
  assert.equal(result.post.image_alt, null);
  assert.deepEqual(client.calls[1], ["remove", "old.webp"]);
});

test("failed updates never remove the existing image", async () => {
  const image = new File(["image"], "new.webp", { type: "image/webp" });
  const client = mockClient({ noMatch: true });
  await assert.rejects(updatePostRecord(client, original, values, image, false));
  assert.equal(client.calls[2][0], "remove");
  assert.notEqual(client.calls[2][1], "old.webp");
});

test("uncertain updates keep both images and cleanup failures are reported", async () => {
  const image = new File(["image"], "new.webp", { type: "image/webp" });
  const uncertain = mockClient({ updateError: new Error("Network"), status: 500 });
  await assert.rejects(updatePostRecord(uncertain, original, values, image, false), PostUpdateUncertainError);
  assert.deepEqual(uncertain.calls.map((call) => call[0]), ["upload", "update"]);
  const client = mockClient({ removeError: true });
  assert.equal((await updatePostRecord(client, original, values, image, false)).cleanupFailed, true);
});

test("removing an inline image cleans it up after saving", async () => {
  const client = mockClient();
  await updatePostRecord(client, { ...original, inline_image_paths: ["old-inline.png", "keep.png"] }, { ...values, inline_image_paths: ["keep.png"] }, null, false);
  assert.deepEqual(client.calls.map((call) => call[0]), ["update", "remove"]);
  assert.deepEqual(client.calls[1], ["remove", "old-inline.png"]);
});
