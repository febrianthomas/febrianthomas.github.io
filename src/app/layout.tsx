import type { Metadata } from "next";
import { Bagel_Fat_One, Cherry_Bomb_One, Sniglet } from "next/font/google";
import type { ReactNode } from "react";
import { BackgroundShapes } from "@/ui/components/BackgroundShapes/BackgroundShapes";
import { Footer } from "@/ui/components/Footer/Footer";
import { Header } from "@/ui/components/Header/Header";
import { PageMotion } from "@/ui/components/PageMotion/PageMotion";
import { SmoothScroll } from "@/ui/components/SmoothScroll/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const bagelFatOne = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel-fat-one",
  preload: false,
});

const cherryBombOne = Cherry_Bomb_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cherry-bomb-one",
  preload: false,
});

const sniglet = Sniglet({
  subsets: ["latin"],
  weight: ["400", "800"],
  variable: "--font-sniglet",
  preload: false,
});

export const metadata: Metadata = {
  title: "febrianthomas",
  description: "febrianthomas's official website.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bagelFatOne.variable} ${cherryBombOne.variable} ${sniglet.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { var theme = localStorage.getItem('theme'); if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark'); } catch (_) {}` }} />
        <script dangerouslySetInnerHTML={{ __html: `if (performance.getEntriesByType('navigation')[0]?.type === 'reload') { history.scrollRestoration = 'manual'; scrollTo(0, 0); addEventListener('pageshow', function () { scrollTo(0, 0); setTimeout(function () { history.scrollRestoration = 'auto'; }, 0); }, { once: true }); }` }} />
      </head>
      <body className="flex min-h-svh flex-col text-zinc-950 antialiased dark:text-zinc-50">
        <SmoothScroll />
        <BackgroundShapes />
        <Header />
        <PageMotion>{children}</PageMotion>
        <Footer />
      </body>
    </html>
  );
}
