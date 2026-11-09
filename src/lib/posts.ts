import { getSupabase } from "@/lib/supabase";

export type PublishedPost = {
  id: string;
  title: string;
  description: string;
  body: string;
  created_at: string;
};

export type PostSummary = Pick<PublishedPost, "id" | "title" | "description">;

export async function listPosts() {
  const { data, error } = await getSupabase().from("posts")
    .select("id,title,description")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PostSummary[];
}

export async function getPost(id: string) {
  const { data, error } = await getSupabase().from("posts")
    .select("id,title,description,body,created_at").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as PublishedPost | null;
}

export async function createPost(post: Pick<PublishedPost, "title" | "description" | "body">) {
  const { data, error } = await getSupabase().from("posts")
    .insert(post).select("id").single();
  if (error) throw error;
  return data.id as string;
}
