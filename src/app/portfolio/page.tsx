import type { Metadata } from "next";
import PortfolioPage from "@/ui/pages/PortfolioPage/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio | Febrian Thomas",
};

export default function Portfolio() {
  return <PortfolioPage />;
}
