import Link from "next/link";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { ThemeToggle } from "@/ui/components/ThemeToggle/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50 px-6 sm:px-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:py-4">
        <Link href="/" className="font-sniglet text-lg text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-zinc-50">
          febrianthomas<span className="text-zinc-400">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center justify-center gap-6 text-base font-medium sm:gap-8">
            <li><MotionLink href="/" whileHover={{ y: -3, rotate: -4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">Home</MotionLink></li>
            <li><MotionLink href="/portfolio/" whileHover={{ y: -3, rotate: 4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">Portfolio</MotionLink></li>
            <li><MotionLink href="/post/" whileHover={{ y: -3, rotate: -4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">Post</MotionLink></li>
            <li><MotionLink href="/about/" whileHover={{ y: -3, rotate: 4, scale: 1.08 }} className="inline-flex min-h-11 items-center hover:text-zinc-500 dark:hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4">About</MotionLink></li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
