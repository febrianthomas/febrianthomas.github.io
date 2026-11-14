"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AuthControl } from "@/ui/components/AuthControl/AuthControl";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { ThemeToggle } from "@/ui/components/ThemeToggle/ThemeToggle";
import { LanguageToggle } from "@/ui/components/LanguageToggle/LanguageToggle";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

const navLinkClass =
  "inline-flex min-h-11 items-center text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-400 dark:hover:text-zinc-50";
const navActiveClass =
  "font-semibold text-zinc-950 underline decoration-2 underline-offset-8 dark:text-zinc-50";

function normalizePath(path: string) {
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

export function Header() {
  const { text } = useLanguage();
  const pathname = normalizePath(usePathname() ?? "/");
  const links = [
    { href: "/", label: text.navigation.home, rotate: -4 },
    { href: "/portfolio/", label: text.navigation.portfolio, rotate: 4 },
    { href: "/post/", label: text.navigation.post, rotate: -4 },
    { href: "/about/", label: text.navigation.about, rotate: 4 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50 px-6 sm:px-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:py-4">
        <Link
          href="/"
          className="inline-flex min-h-11 max-w-full items-center gap-2 self-start pr-32 font-sniglet text-lg text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 md:pr-0 dark:text-zinc-50"
        >
          <Image src="/images/lick.gif" alt="" width={32} height={32} className="size-8 shrink-0 object-contain" unoptimized />
          <span className="truncate">{text.site.brand}</span>
        </Link>
        <nav aria-label={text.navigation.label}>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-base sm:gap-8">
            {links.map((item) => {
              const active = pathname === normalizePath(item.href);
              return (
                <li key={item.href}>
                  <MotionLink
                    href={item.href}
                    whileHover={{ y: -3, rotate: item.rotate, scale: 1.08 }}
                    aria-current={active ? "page" : undefined}
                    className={active ? `${navLinkClass} ${navActiveClass}` : navLinkClass}
                  >
                    {item.label}
                  </MotionLink>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute right-4 top-5 flex items-center gap-0 sm:gap-2 md:static md:justify-self-end">
          <LanguageToggle />
          <ThemeToggle />
          <AuthControl />
        </div>
      </div>
    </header>
  );
}
