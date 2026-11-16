import assert from "node:assert/strict";
import test from "node:test";
import { MAX_POST_BODY_LENGTH, MAX_POST_TAG_LENGTH, MAX_POST_TAGS } from "../src/constants/post.ts";
import { arePostTagsValid, isValidUuid, parsePostTags, validatePostInput } from "../src/lib/post-form.ts";

test("isValidUuid validates UUIDs and rejects malformed values", () => {
  assert.equal(isValidUuid("123e4567-e89b-12d3-a456-426614174000"), true);
  assert.equal(isValidUuid("123E4567-E89B-12D3-A456-426614174000"), true);
  assert.equal(isValidUuid(null), false);
  assert.equal(isValidUuid("not-a-uuid"), false);
});

test("parsePostTags trims, lowercases, deduplicates, and drops empty tags", () => {
  assert.deepEqual(parsePostTags(" Art, sketch , art, , 2D "), ["art", "sketch", "2d"]);
});

test("arePostTagsValid enforces tag count and length limits", () => {
  const validTags = Array.from({ length: MAX_POST_TAGS }, (_, i) => `t${i}`);
  assert.equal(arePostTagsValid(validTags), true);
  assert.equal(arePostTagsValid([...validTags, "extra"]), false);
  assert.equal(arePostTagsValid(["a".repeat(MAX_POST_TAG_LENGTH + 1)]), false);
});

test("validatePostInput validates tags, required text or YouTube embed, body length, and image", () => {
  const base = {
    title: "Title",
    description: "Description",
    body: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }] }),
    plainText: "Hello",
    tags: ["art"],
    checkBodyLength: true,
    image: null,
  };
  assert.equal(validatePostInput(base), null);
  assert.equal(validatePostInput({ ...base, tags: Array.from({ length: MAX_POST_TAGS + 1 }, (_, i) => `t${i}`) }), "tagsInvalid");
  assert.equal(validatePostInput({ ...base, plainText: "   " }), "requiredFields");
  assert.equal(
    validatePostInput({
      ...base,
      plainText: "",
      body: JSON.stringify({ type: "doc", content: [{ type: "youtube", attrs: { src: "https://youtu.be/dQw4w9WgXcQ" } }] }),
    }),
    null,
  );
  assert.equal(validatePostInput({ ...base, body: "a".repeat(MAX_POST_BODY_LENGTH + 1) }), "bodyTooLong");
  assert.equal(validatePostInput({ ...base, checkBodyLength: false, body: "a".repeat(MAX_POST_BODY_LENGTH + 1) }), null);
  assert.equal(validatePostInput({ ...base, image: new File(["bad"], "icon.svg", { type: "image/svg+xml" }) }), "imageInvalid");
});
