import { getSupabase } from "@/lib/supabase";
import { optimizePostImage, postImageExtension } from "@/lib/post-image";
import { updatePostRecord } from "@/lib/post-update";

export type PostKind = "post" | "portfolio";

export type PublishedPost = {
  id: string;
  kind: PostKind;
  title: string;
  description: string;
  body: string;
  body_format: "plain" | "markdown" | "tiptap";
  created_at: string;
  image_path: string | null;
  image_alt: string | null;
  image_caption: string | null;
  tags: string[];
  featured: boolean;
  updated_at: string | null;
  inline_image_paths: string[];
};

export type PostSummary = Pick<PublishedPost, "id" | "title" | "description" | "image_path" | "image_alt" | "created_at" | "tags" | "featured" | "body" | "body_format" | "inline_image_paths">;
export type PostDetails = Pick<PublishedPost, "title" | "description" | "body" | "body_format" | "image_alt" | "image_caption" | "tags" | "featured" | "inline_image_paths">;

export class PostImageUncertainError extends Error {}

export function postImageUrl(path: string) {
  return getSupabase().storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

export async function listPosts(kind: PostKind = "post") {
  const { data, error } = await getSupabase().from("posts")
    .select("id,title,description,image_path,image_alt,created_at,tags,featured,body,body_format,inline_image_paths")
    .eq("kind", kind)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw error;
  return data as PostSummary[];
}

export async function getPost(id: string, kind: PostKind = "post") {
  const { data, error } = await getSupabase().from("posts")
    .select("id,kind,title,description,body,body_format,created_at,updated_at,image_path,image_alt,image_caption,tags,featured,inline_image_paths").eq("id", id).eq("kind", kind).maybeSingle();
  if (error) throw error;
  return data as PublishedPost | null;
}

export async function updatePost(original: PublishedPost, values: PostDetails, image: File | null, removeImage: boolean) {
  if (image && !postImageExtension(image)) throw new Error("Invalid image");
  const optimized = image ? await optimizePostImage(image) : null;
  const result = await updatePostRecord(getSupabase(), original, values, optimized, removeImage);
  return { post: result.post as PublishedPost, cleanupFailed: result.cleanupFailed };
}

export async function createPost(post: Pick<PublishedPost, "kind" | "title" | "description" | "body" | "tags" | "featured" | "image_caption" | "inline_image_paths">, image?: File, imageAlt?: string) {
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
      .insert({ ...post, image_caption: imagePath ? post.image_caption : null, body_format: "tiptap", image_path: imagePath, image_alt: imagePath ? imageAlt?.trim() || null : null })
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
