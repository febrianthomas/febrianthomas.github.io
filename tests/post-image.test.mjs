import assert from "node:assert/strict";
import { test } from "node:test";
import { maxPostImageSize, optimizePostImage, postImageExtension } from "../src/lib/post-image.ts";

test("post images accept supported formats up to 5 MiB", () => {
  for (const [type, extension] of [["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/gif", "gif"]]) {
    assert.equal(postImageExtension({ type, size: maxPostImageSize }), extension);
  }
});

test("post images reject unsupported, empty, and oversized files", () => {
  assert.equal(postImageExtension({ type: "image/svg+xml", size: 100 }), null);
  assert.equal(postImageExtension({ type: "image/png", size: 0 }), null);
  assert.equal(postImageExtension({ type: "image/png", size: maxPostImageSize + 1 }), null);
});

test("large static images are resized and uploaded as smaller WebP files", async (t) => {
  const originalImage = globalThis.Image;
  const originalDocument = globalThis.document;
  const canvas = {
    width: 0, height: 0,
    getContext: () => ({ drawImage: () => {} }),
    toBlob: (callback) => callback(new Blob([new Uint8Array(100)], { type: "image/webp" })),
  };
  globalThis.Image = class { naturalWidth = 3200; naturalHeight = 2400; set src(_value) { queueMicrotask(() => this.onload()); } };
  globalThis.document = { createElement: () => canvas };
  t.mock.method(URL, "createObjectURL", () => "blob:test");
  const revoke = t.mock.method(URL, "revokeObjectURL", () => {});
  try {
    const original = new File([new Uint8Array(1000)], "photo.jpg", { type: "image/jpeg" });
    const optimized = await optimizePostImage(original);
    assert.equal(optimized.type, "image/webp");
    assert.equal(optimized.size, 100);
    assert.equal(postImageExtension(optimized), "webp");
    assert.deepEqual([canvas.width, canvas.height], [1600, 1200]);
    assert.equal(revoke.mock.callCount(), 1);

    canvas.toBlob = (callback) => callback(new Blob([new Uint8Array(2000)], { type: "image/webp" }));
    assert.equal(await optimizePostImage(original), original);
  } finally {
    globalThis.Image = originalImage;
    globalThis.document = originalDocument;
  }
});

test("animated GIF, PNG, and WebP files keep their original frames", async () => {
  const gif = new File([new Uint8Array(30)], "animated.gif", { type: "image/gif" });
  const pngBytes = new Uint8Array(20);
  pngBytes.set([137, 80, 78, 71, 13, 10, 26, 10], 0);
  pngBytes.set([97, 99, 84, 76], 12); // acTL chunk
  const png = new File([pngBytes], "animated.png", { type: "image/png" });
  const webpBytes = new Uint8Array(21);
  webpBytes.set([82, 73, 70, 70], 0); // RIFF
  webpBytes.set([87, 69, 66, 80, 86, 80, 56, 88], 8); // WEBP VP8X
  webpBytes[20] = 2;
  const webp = new File([webpBytes], "animated.webp", { type: "image/webp" });
  for (const image of [gif, png, webp]) assert.equal(await optimizePostImage(image), image);
});
