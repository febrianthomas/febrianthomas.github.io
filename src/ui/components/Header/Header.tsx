import Link from "next/link";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50 px-6 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:py-4">
        <Link href="/" className="font-sniglet text-lg text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4">
          febrianthomas<span className="text-zinc-400">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center justify-center gap-5 text-sm font-medium sm:gap-7">
            <li><MotionLink href="/" className="inline-flex min-h-11 items-center hover:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4">Home</MotionLink></li>
            <li><MotionLink href="/portfolio/" className="inline-flex min-h-11 items-center hover:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4">Portfolio</MotionLink></li>
            <li><MotionLink href="/post/" className="inline-flex min-h-11 items-center hover:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4">Post</MotionLink></li>
            <li><MotionLink href="/about/" className="inline-flex min-h-11 items-center hover:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4">About</MotionLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
