import type { SupabaseClient } from "@supabase/supabase-js";

export class PostImageDeleteError extends Error {}

export async function deletePost(client: SupabaseClient, post: { id: string; image_path: string | null; inline_image_paths: string[] }, table: "posts" | "projects" = "posts") {
  const { data, error } = await client.from(table).delete().eq("id", post.id).select("image_path,inline_image_paths");
  if (error || !data?.length) {
    // A lost response can mean the deletion succeeded; check before retrying cleanup.
    const result = await client.from(table).select("id").eq("id", post.id).maybeSingle();
    if (result.error || result.data) throw error ?? result.error ?? new Error("Post was not deleted");
  }

  const deleted = data?.length ? data[0] : post;
  const paths: string[] = [...new Set<string>([...(deleted.inline_image_paths ?? []), ...(deleted.image_path ? [deleted.image_path] : [])])];
  if (!paths.length) return;
  try {
    const bucket = client.storage.from("post-images");
    const result = await bucket.remove(paths);
    if (result.error) throw result.error;
    if ((result.data?.length ?? 0) < paths.length) {
      for (const imagePath of paths) {
        const listing = await bucket.list("", { search: imagePath });
        if (listing.error || !listing.data || listing.data.some((item) => item.name === imagePath)) throw listing.error ?? new Error("Image was not deleted");
      }
    }
  } catch {
    throw new PostImageDeleteError();
  }
}
