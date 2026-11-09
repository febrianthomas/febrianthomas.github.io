import type text from "@/content/en.json";
import type { PostKind } from "@/lib/posts";

// Portfolio items reuse the post features; only the table, wording, and base path differ.
export const kindTable = (kind: PostKind) => kind === "portfolio" ? "projects" : "posts";
export const kindText = (kind: PostKind, content: typeof text) => kind === "portfolio" ? { ...content.post, ...content.portfolio } : content.post;
export const kindPath = (kind: PostKind) => kind === "portfolio" ? "/portfolio/" : "/post/";
