import type { SupabaseClient } from "@supabase/supabase-js";

export class PostImageDeleteError extends Error {}

export async function deletePost(client: SupabaseClient, post: { id: string; image_path: string | null }) {
  const { data, error } = await client.from("posts").delete().eq("id", post.id).select("image_path");
  if (error || !data?.length) {
    // A lost response can mean the deletion succeeded; check before retrying cleanup.
    const result = await client.from("posts").select("id").eq("id", post.id).maybeSingle();
    if (result.error || result.data) throw error ?? result.error ?? new Error("Post was not deleted");
  }

  const imagePath = data?.length ? data[0].image_path : post.image_path;
  if (!imagePath) return;
  try {
    const bucket = client.storage.from("post-images");
    const result = await bucket.remove([imagePath]);
    if (result.error) throw result.error;
    if (!result.data?.length) {
      const listing = await bucket.list("", { search: imagePath });
      if (listing.error || !listing.data || listing.data.some((item) => item.name === imagePath)) throw listing.error ?? new Error("Image was not deleted");
    }
  } catch {
    throw new PostImageDeleteError();
  }
}
