import text from "@/content/text.json";
import type { PostKind } from "@/lib/posts";

// Portfolio items reuse the post features; only the wording and base path differ.
export const kindText = (kind: PostKind) => kind === "portfolio" ? { ...text.post, ...text.portfolio } : text.post;
export const kindPath = (kind: PostKind) => kind === "portfolio" ? "/portfolio/" : "/post/";
