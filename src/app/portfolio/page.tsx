import type { Metadata } from "next";
import PortfolioPage from "@/ui/pages/PortfolioPage/PortfolioPage";
import text from "@/content/text.json";

export const metadata: Metadata = {
  title: `${text.navigation.portfolio} | ${text.site.name}`,
};

export default function Portfolio() {
  return <PortfolioPage />;
}
