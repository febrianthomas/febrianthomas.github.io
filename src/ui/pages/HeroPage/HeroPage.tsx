import { HeroIllustration } from "@/ui/components/HeroIllustration/HeroIllustration";
import { FadeSection } from "@/ui/components/FadeSection/FadeSection";
import Image from "next/image";
import hero from "../../../../public/images/hero-1.png";
import tempOne from "../../../../public/images/temp-1.png";
import tempTwo from "../../../../public/images/temp-2.png";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <FadeSection className="mx-auto flex min-h-[calc(100svh-124px)] w-full max-w-6xl flex-col items-center justify-center gap-5 py-12 text-center sm:min-h-[calc(100svh-76px)] sm:gap-7 sm:py-16">
        <HeroIllustration />
        <h1 className="font-bagel-fat-one text-[clamp(2rem,8vw,5rem)] leading-[0.95]">
          febrianthomas
        </h1>
      </FadeSection>
      <FadeSection className="mx-auto flex min-h-[110svh] w-full max-w-5xl items-center py-32 sm:py-40">
        <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="flex aspect-square w-full items-center justify-center">
            <Image src={hero} alt="Illustration of febrianthomas" className="h-full w-full object-contain" sizes="(min-width: 1024px) 492px, (min-width: 768px) 50vw, 100vw" />
          </div>
          <div>
            <h2 className="font-bagel-fat-one text-5xl sm:text-6xl">Who Am I<span className="text-zinc-400">?</span></h2>
            <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">A little more about me, coming soon.</p>
          </div>
        </div>
      </FadeSection>
      <FadeSection className="mx-auto flex min-h-[110svh] w-full max-w-5xl items-center py-32 sm:py-40">
        <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-10">
          <Image src={tempOne} alt="Illustration of a crying character" className="aspect-square w-full rounded-3xl object-cover" sizes="(min-width: 1024px) 492px, (min-width: 768px) 50vw, 100vw" />
          <div>
            <h2 className="font-bagel-fat-one text-5xl sm:text-6xl">What I Do<span className="text-zinc-400">.</span></h2>
            <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">More about my work, coming soon.</p>
          </div>
        </div>
      </FadeSection>
      <FadeSection className="mx-auto flex min-h-[110svh] w-full max-w-5xl items-center py-32 sm:py-40">
        <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-10">
          <Image src={tempTwo} alt="Illustration of a character with raised hands" className="aspect-square w-full rounded-3xl object-cover" sizes="(min-width: 1024px) 492px, (min-width: 768px) 50vw, 100vw" />
          <div>
            <h2 className="font-bagel-fat-one text-5xl sm:text-6xl">What I Like<span className="text-zinc-400">.</span></h2>
            <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">More about my interests, coming soon.</p>
          </div>
        </div>
      </FadeSection>
    </main>
  );
}
