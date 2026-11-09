import type { SupabaseClient } from "@supabase/supabase-js";

type ImageNode = { type?: string; attrs?: { src?: string; storagePath?: string | null; [key: string]: unknown }; content?: ImageNode[] };
export class InlineImageLimitError extends Error {}
export class InlineImageCleanupError extends Error {}

export async function removeUnlinkedImages(client: SupabaseClient, paths: string[]) {
  if (!paths.length) return;
  const bucket = client.storage.from("post-images");
  const cleanup = await bucket.remove(paths);
  if (cleanup.error) throw cleanup.error;
  if ((cleanup.data?.length ?? 0) < paths.length) {
    for (const path of paths) {
      const listing = await bucket.list("", { search: path });
      if (listing.error || !listing.data || listing.data.some((item) => item.name === path)) throw new Error("Image cleanup failed");
    }
  }
}

export async function prepareInlineImages(client: SupabaseClient, body: string, files: Map<string, File>, existing: string[], optimize: (file: File) => Promise<File>) {
  const document: ImageNode = JSON.parse(body);
  const nodes: ImageNode[] = [];
  const visit = (node: ImageNode) => {
    if (node.type === "image") nodes.push(node);
    node.content?.forEach(visit);
  };
  visit(document);
  if (nodes.length > 20) throw new InlineImageLimitError();
  const paths = new Set<string>();
  const uploaded: string[] = [];
  const replacements = new Map<string, { src: string; path: string }>();
  try {
    for (const node of nodes) {
      const attrs = node.attrs;
      if (!attrs?.src) throw new Error("Invalid image");
      if (attrs.src.startsWith("blob:")) {
        let replacement = replacements.get(attrs.src);
        if (!replacement) {
          const file = files.get(attrs.src);
          if (!file) throw new Error("Missing image");
          const optimized = await optimize(file);
          const extension = optimized.type === "image/jpeg" ? "jpg" : optimized.type.split("/")[1];
          const path = `${crypto.randomUUID()}.${extension}`;
          uploaded.push(path);
          const result = await client.storage.from("post-images").upload(path, optimized, { contentType: optimized.type, upsert: false });
          if (result.error) throw result.error;
          replacement = { src: client.storage.from("post-images").getPublicUrl(path).data.publicUrl, path };
          replacements.set(attrs.src, replacement);
        }
        attrs.src = replacement.src;
        attrs.storagePath = replacement.path;
        paths.add(replacement.path);
      } else if (attrs.storagePath && existing.includes(attrs.storagePath)) {
        paths.add(attrs.storagePath);
      } else {
        throw new Error("Unsupported image");
      }
    }
  } catch (error) {
    if (uploaded.length) {
      try {
        await removeUnlinkedImages(client, uploaded);
      } catch { throw new InlineImageCleanupError(); }
    }
    throw error;
  }
  return { body: JSON.stringify(document), paths: [...paths], uploaded };
}
