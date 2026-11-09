import assert from "node:assert/strict";
import test from "node:test";
import { adjacentPosts, matchesPost, postBodyText, formatPostDate, sortPosts } from "../src/lib/post-list.ts";

const post = { title: "My Artwork", description: "A sketch", tags: ["drawing"], body_format: "tiptap", body: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "A colorful dragon" }] }] }) };

test("search matches title, description, tags and rich post content", () => {
  for (const term of ["ARTWORK", "sketch", "drawing", "colorful dragon"]) assert.equal(matchesPost(post, term, ""), true);
  assert.equal(matchesPost(post, "missing", ""), false);
  assert.equal(matchesPost(post, "dragon", "drawing"), true);
  assert.equal(matchesPost(post, "dragon", "other"), false);
});

test("previous and next follow publication order independently of featured order", () => {
  const posts = [{ id: "c", created_at: "2026-01-03" }, { id: "a", created_at: "2026-01-01" }, { id: "b", created_at: "2026-01-02" }];
  assert.deepEqual(adjacentPosts(posts, "b"), { previous: posts[1], next: posts[0] });
  assert.deepEqual(adjacentPosts(posts, "missing"), { previous: null, next: null });
});

test("featured posts appear first even after editing", () => {
  const posts = [{ id: "a", created_at: "2026-01-01", featured: true }, { id: "b", created_at: "2026-01-02", featured: false }];
  assert.deepEqual(sortPosts(posts).map((post) => post.id), ["a", "b"]);
  assert.deepEqual(sortPosts([{ ...posts[0], featured: false }, posts[1]]).map((post) => post.id), ["b", "a"]);
});

test("malformed rich content and UTC dates are handled predictably", () => {
  assert.equal(postBodyText("not json", "tiptap"), "");
  assert.equal(formatPostDate("2026-11-09T01:00:00Z"), "November 9, 2026");
});
