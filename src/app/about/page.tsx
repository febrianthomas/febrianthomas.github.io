import type { Metadata } from "next";
import AboutPage from "@/ui/pages/AboutPage/AboutPage";

export const metadata: Metadata = {
  title: "About | Febrian Thomas",
};

export default function About() {
  return <AboutPage />;
}
