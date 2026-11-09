import type { SupabaseClient } from "@supabase/supabase-js";

export class PostUpdateUncertainError extends Error {}

export async function updatePostRecord(client: SupabaseClient, original: { id: string; image_path: string | null }, values: { title: string; description: string; body: string; body_format: string; image_alt: string | null }, image: File | null, removeImage: boolean) {
  let newPath: string | null = null;
  if (image) {
    const extension = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1];
    newPath = `${crypto.randomUUID()}.${extension}`;
    try {
      const result = await client.storage.from("post-images").upload(newPath, image, { contentType: image.type, upsert: false });
      if (result.error) throw result.error;
    } catch {
      throw new PostUpdateUncertainError();
    }
  }
  const imagePath = newPath ?? (removeImage ? null : original.image_path);
  let query = client.from("posts").update({ ...values, image_path: imagePath, image_alt: imagePath ? values.image_alt : null }).eq("id", original.id);
  query = original.image_path ? query.eq("image_path", original.image_path) : query.is("image_path", null);
  let result;
  try {
    result = await query.select("id,title,description,body,body_format,created_at,image_path,image_alt").maybeSingle();
  } catch {
    throw new PostUpdateUncertainError();
  }
  if (result.error || !result.data) {
    if (result.error && (result.status < 400 || result.status >= 500 || result.status === 408)) throw new PostUpdateUncertainError();
    if (newPath) {
      try {
        const cleanup = await client.storage.from("post-images").remove([newPath]);
        if (cleanup.error || !cleanup.data?.length) throw new Error();
      } catch { throw new PostUpdateUncertainError(); }
    }
    throw result.error ?? new Error("Post was changed or is unavailable");
  }
  let cleanupFailed = false;
  if (original.image_path && original.image_path !== imagePath) {
    try {
      const cleanup = await client.storage.from("post-images").remove([original.image_path]);
      if (cleanup.error) throw cleanup.error;
      if (!cleanup.data?.length) {
        const listing = await client.storage.from("post-images").list("", { search: original.image_path });
        if (listing.error || !listing.data || listing.data.some((item) => item.name === original.image_path)) throw new Error();
      }
    } catch { cleanupFailed = true; }
  }
  return { post: result.data, cleanupFailed };
}
