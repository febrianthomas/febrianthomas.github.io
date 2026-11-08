import type { Metadata } from "next";
import PostPage from "@/ui/pages/PostPage/PostPage";

export const metadata: Metadata = {
  title: "Post | Febrian Thomas",
};

export default function Post() {
  return <PostPage />;
}
