import { getSupabase } from "@/lib/supabase";
import { optimizePostImage, postImageExtension } from "@/lib/post-image";

export type PublishedPost = {
  id: string;
  title: string;
  description: string;
  body: string;
  body_format: "plain" | "markdown" | "tiptap";
  created_at: string;
  image_path: string | null;
  image_alt: string | null;
};

export type PostSummary = Pick<PublishedPost, "id" | "title" | "description" | "image_path" | "image_alt">;

export class PostImageUncertainError extends Error {}

export function postImageUrl(path: string) {
  return getSupabase().storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

export async function listPosts() {
  const { data, error } = await getSupabase().from("posts")
    .select("id,title,description,image_path,image_alt")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PostSummary[];
}

export async function getPost(id: string) {
  const { data, error } = await getSupabase().from("posts")
    .select("id,title,description,body,body_format,created_at,image_path,image_alt").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as PublishedPost | null;
}

export async function createPost(post: Pick<PublishedPost, "title" | "description" | "body">, image?: File, imageAlt?: string) {
  const supabase = getSupabase();
  let imagePath: string | null = null;
  if (image && !postImageExtension(image)) throw new Error("Invalid image");

  if (image) {
    image = await optimizePostImage(image);
    const extension = postImageExtension(image);
    if (!extension) throw new Error("Invalid image");
    imagePath = `${crypto.randomUUID()}.${extension}`;
    try {
      const { error } = await supabase.storage.from("post-images").upload(imagePath, image, { contentType: image.type, upsert: false });
      if (error) throw error;
    } catch {
      // An interrupted upload can have succeeded even when no response arrived.
      throw new PostImageUncertainError();
    }
  }

  let result;
  try {
    result = await supabase.from("posts")
      .insert({ ...post, body_format: "tiptap", image_path: imagePath, image_alt: imagePath ? imageAlt?.trim() || null : null })
      .select("id").single();
  } catch (error) {
    if (imagePath) throw new PostImageUncertainError();
    throw error;
  }

  if (result.error) {
    if (imagePath && result.status >= 400 && result.status < 500) {
      try {
        const cleanup = await supabase.storage.from("post-images").remove([imagePath]);
        if (cleanup.error || !cleanup.data?.length) throw new PostImageUncertainError();
      } catch {
        throw new PostImageUncertainError();
      }
    } else if (imagePath) {
      throw new PostImageUncertainError();
    }
    throw result.error;
  }
  return result.data.id as string;
}
