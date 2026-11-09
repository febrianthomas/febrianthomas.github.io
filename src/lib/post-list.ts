export function postBodyText(body: string, format: string): string {
  if (format !== "tiptap") return body;
  try {
    const collect = (node: { text?: unknown; content?: unknown }): string => {
      const text = typeof node.text === "string" ? node.text : "";
      return text + (Array.isArray(node.content) ? node.content.map(collect).join(" ") : "");
    };
    return collect(JSON.parse(body));
  } catch { return ""; }
}

export function matchesPost(post: { title: string; description: string; tags: string[]; body: string; body_format: string }, query: string, tag: string) {
  const matchesTag = !tag || post.tags.includes(tag);
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const searchable = [post.title, post.description, ...post.tags, postBodyText(post.body, post.body_format)].join(" ").toLocaleLowerCase();
  return matchesTag && words.every((word) => searchable.includes(word));
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(date));
}

export function sortPosts<T extends { id: string; created_at: string; featured: boolean }>(posts: T[]) {
  return [...posts].sort((a, b) => Number(b.featured) - Number(a.featured) || b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
}

export function adjacentPosts<T extends { id: string; created_at: string }>(posts: T[], id: string | undefined) {
  const chronological = [...posts].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
  const position = chronological.findIndex((post) => post.id === id);
  return { previous: position > 0 ? chronological[position - 1] : null, next: position >= 0 && position < chronological.length - 1 ? chronological[position + 1] : null };
}
