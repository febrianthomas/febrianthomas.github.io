"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthControl } from "@/ui/components/AuthControl/AuthControl";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { ThemeToggle } from "@/ui/components/ThemeToggle/ThemeToggle";
import { LanguageToggle } from "@/ui/components/LanguageToggle/LanguageToggle";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export function Header() {
  const { text } = useLanguage();
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50 px-6 sm:px-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:py-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 self-start font-sniglet text-lg text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-50">
          <Image src="/images/lick.gif" alt="" width={32} height={32} className="size-8 object-contain" unoptimized />
          {text.site.brand}
        </Link>
        <nav aria-label={text.navigation.label}>
          <ul className="flex items-center justify-center gap-6 text-base sm:gap-8">
            <li><MotionLink href="/" whileHover={{ y: -3, rotate: -4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">{text.navigation.home}</MotionLink></li>
            <li><MotionLink href="/portfolio/" whileHover={{ y: -3, rotate: 4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">{text.navigation.portfolio}</MotionLink></li>
            <li><MotionLink href="/post/" whileHover={{ y: -3, rotate: -4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">{text.navigation.post}</MotionLink></li>
            <li><MotionLink href="/about/" whileHover={{ y: -3, rotate: 4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">{text.navigation.about}</MotionLink></li>
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
