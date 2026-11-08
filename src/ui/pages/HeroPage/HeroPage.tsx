import { HeroIllustration } from "@/ui/components/HeroIllustration/HeroIllustration";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <section className="mx-auto flex min-h-[70svh] w-full max-w-6xl flex-col items-center justify-center gap-5 py-12 text-center sm:gap-7 sm:py-16">
        <HeroIllustration />
        <h1 className="font-bagel-fat-one text-[clamp(2rem,8vw,5rem)] leading-[0.95]">
          febrianthomas
        </h1>
      </section>
      <section className="mx-auto w-full max-w-6xl border-t border-zinc-200 py-16 sm:py-24 dark:border-zinc-800">
        <h2 className="font-bagel-fat-one text-4xl sm:text-5xl">Who Am I<span className="text-zinc-400">?</span></h2>
        <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300">A little more about me, coming soon.</p>
      </section>
      <section className="mx-auto w-full max-w-6xl border-t border-zinc-200 py-16 sm:py-24 dark:border-zinc-800">
        <h2 className="font-bagel-fat-one text-4xl sm:text-5xl">What I Do<span className="text-zinc-400">.</span></h2>
        <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300">More about my work, coming soon.</p>
      </section>
      <section className="mx-auto w-full max-w-6xl border-t border-zinc-200 py-16 sm:py-24 dark:border-zinc-800">
        <h2 className="font-bagel-fat-one text-4xl sm:text-5xl">What I Like<span className="text-zinc-400">.</span></h2>
        <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-300">More about my interests, coming soon.</p>
      </section>
    </main>
  );
}
