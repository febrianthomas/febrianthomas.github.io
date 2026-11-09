export function youtubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean);
    let id: string | null = null;
    if (host === "youtu.be" && parts.length === 1) id = parts[0];
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com"].includes(host)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (parts.length === 2 && ["embed", "shorts", "live"].includes(parts[0])) id = parts[1];
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function hasYoutubeVideo(body: string): boolean {
  try {
    const visit = (node: { type?: string; attrs?: { src?: unknown }; content?: unknown }): boolean =>
      (node.type === "youtube" && typeof node.attrs?.src === "string" && Boolean(youtubeEmbedUrl(node.attrs.src))) ||
      (Array.isArray(node.content) && node.content.some(visit));
    return visit(JSON.parse(body));
  } catch {
    return false;
  }
}
