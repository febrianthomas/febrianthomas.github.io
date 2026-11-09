import text from "@/content/text.json";
import { SignedInOnly } from "@/ui/components/SignedInOnly/SignedInOnly";
import { LivePosts } from "@/ui/components/LivePosts/LivePosts";
import { NewPostDialog } from "@/ui/components/NewPostDialog/NewPostDialog";

export default function PortfolioPage() {
  return (
    <main className="flex-1 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{text.portfolio.eyebrow}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
          <h1 className="font-bagel-fat-one text-6xl leading-none sm:text-8xl">{text.portfolio.title}</h1>
          <SignedInOnly>
            <NewPostDialog kind="portfolio" />
          </SignedInOnly>
        </div>
        <p className="mt-6 max-w-lg text-lg leading-7 text-zinc-600 dark:text-zinc-300">{text.portfolio.description}</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-16">
          <LivePosts kind="portfolio" />
        </div>
      </div>
    </main>
  );
}
