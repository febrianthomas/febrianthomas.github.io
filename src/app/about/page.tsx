import type { Metadata } from "next";
import AboutPage from "@/ui/pages/AboutPage/AboutPage";
import text from "@/content/en.json";

export const metadata: Metadata = {
  title: `${text.navigation.about} | ${text.site.name}`,
};

export default function About() {
  return <AboutPage />;
}
