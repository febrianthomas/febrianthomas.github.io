import type { Metadata } from "next";
import { Bagel_Fat_One, Sniglet } from "next/font/google";
import type { ReactNode } from "react";
import { BackgroundMusic } from "@/ui/components/BackgroundMusic/BackgroundMusic";
import { BackgroundShapes } from "@/ui/components/BackgroundShapes/BackgroundShapes";
import { ClickSound } from "@/ui/components/ClickSound/ClickSound";
import { Footer } from "@/ui/components/Footer/Footer";
import { Header } from "@/ui/components/Header/Header";
import { PageMotion } from "@/ui/components/PageMotion/PageMotion";
import { SmoothScroll } from "@/ui/components/SmoothScroll/SmoothScroll";
import { LanguageProvider } from "@/ui/components/LanguageProvider/LanguageProvider";
import text from "@/content/en.json";
import "lenis/dist/lenis.css";
import "./globals.css";

const bagelFatOne = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel-fat-one",
  preload: false,
});

const sniglet = Sniglet({
  subsets: ["latin"],
  weight: ["400", "800"],
  variable: "--font-sniglet",
  preload: false,
});

const SITE_URL = "https://febrianthomas.github.io";
const PREVIEW_IMAGE_URL = `${SITE_URL}/preview.webp`;
const PREVIEW_IMAGE_ALT = `${text.site.name} — ${text.site.description}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: text.site.name,
  description: text.site.description,
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: text.site.name,
    title: text.site.name,
    description: text.site.description,
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: PREVIEW_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: text.site.name,
    description: text.site.description,
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        alt: PREVIEW_IMAGE_ALT,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bagelFatOne.variable} ${sniglet.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark'); } catch (_) {}` }} />
        <script dangerouslySetInnerHTML={{ __html: `if (performance.getEntriesByType('navigation')[0]?.type === 'reload') { history.scrollRestoration = 'manual'; scrollTo(0, 0); addEventListener('pageshow', function () { scrollTo(0, 0); setTimeout(function () { history.scrollRestoration = 'auto'; }, 0); }, { once: true }); }` }} />
      </head>
      <body className="flex min-h-svh flex-col text-zinc-950 antialiased dark:text-zinc-50">
        <SmoothScroll />
        <BackgroundShapes />
        <LanguageProvider>
          <Header />
          <PageMotion>{children}</PageMotion>
          <Footer />
          <BackgroundMusic />
          <ClickSound />
        </LanguageProvider>
      </body>
    </html>
  );
}
