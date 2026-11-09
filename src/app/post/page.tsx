import type { Metadata } from "next";
import PostPage from "@/ui/pages/PostPage/PostPage";
import text from "@/content/en.json";

export const metadata: Metadata = {
  title: `${text.navigation.post} | ${text.site.name}`,
};

export default function Post() {
  return <PostPage />;
}
