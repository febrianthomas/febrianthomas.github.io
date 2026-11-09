import assert from "node:assert/strict";
import test from "node:test";
import { deletePost, PostImageDeleteError } from "../src/lib/post-delete.ts";

function mockClient({ deleted = [{ image_path: "image.webp" }], deleteError = null, existing = null, removeError = null, removed = [{ name: "image.webp" }], listed = [] } = {}) {
  const calls = [];
  return {
    calls,
    from: () => ({
      delete: () => ({ eq: () => ({ select: async () => ({ data: deleted, error: deleteError }) }) }),
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: existing, error: null }) }) }),
    }),
    storage: { from: () => ({
      remove: async (paths) => { calls.push(paths); return { data: removed, error: removeError }; },
      list: async () => ({ data: listed, error: null }),
    }) },
  };
}

test("deletes the post before removing its actual image", async () => {
  const client = mockClient();
  await deletePost(client, { id: "post", image_path: "stale.webp" });
  assert.deepEqual(client.calls, [["image.webp"]]);
});

test("does not remove the image if the post could not be deleted", async () => {
  const client = mockClient({ deleted: [], existing: { id: "post" } });
  await assert.rejects(deletePost(client, { id: "post", image_path: "image.webp" }));
  assert.deepEqual(client.calls, []);
});

test("image cleanup can be retried after a post has already been deleted", async () => {
  const post = { id: "post", image_path: "image.webp" };
  const failed = mockClient({ removed: null, removeError: new Error("Storage unavailable") });
  await assert.rejects(deletePost(failed, post), PostImageDeleteError);
  const retry = mockClient({ deleted: [], removed: [] });
  await deletePost(retry, post);
  assert.deepEqual(retry.calls, [["image.webp"]]);
});

test("reports cleanup failure if the image still exists", async () => {
  const client = mockClient({ removed: [], listed: [{ name: "image.webp" }] });
  await assert.rejects(deletePost(client, { id: "post", image_path: "image.webp" }), PostImageDeleteError);
});
