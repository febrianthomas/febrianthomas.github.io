import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { House, UserRound } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 py-6 text-sm text-zinc-500">
        <span>© febrianthomas - 2026</span>
        <div className="flex items-center">
          <MotionLink href="/login/" aria-label="Sign in" className="inline-flex min-h-11 min-w-11 items-center justify-center text-zinc-400 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4">
            <UserRound aria-hidden="true" size={16} strokeWidth={1.75} />
          </MotionLink>
        </div>
      </div>
    </footer>
  );
}
