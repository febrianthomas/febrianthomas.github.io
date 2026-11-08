import Link from "next/link";

export default function PortfolioPage() {
  return (
    <main className="flex-1 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Selected work</p>
        <h1 className="mt-5 font-bagel-fat-one text-6xl leading-none sm:text-8xl">Portfolio<span className="text-zinc-400">.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-7 text-zinc-600">A collection of projects, coming soon.</p>
      </div>
    </main>
  );
}
