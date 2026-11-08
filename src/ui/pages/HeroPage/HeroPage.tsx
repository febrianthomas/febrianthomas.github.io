import { HeroIllustration } from "@/ui/components/HeroIllustration/HeroIllustration";
import { FadeSection } from "@/ui/components/FadeSection/FadeSection";
import Image from "next/image";
import text from "@/content/text.json";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 sm:px-10">
      <FadeSection className="mx-auto flex min-h-[calc(100svh-124px)] w-full max-w-6xl flex-col items-center justify-center gap-5 py-12 text-center sm:min-h-[calc(100svh-76px)] sm:gap-7 sm:py-16">
        <HeroIllustration />
        <h1 className="font-bagel-fat-one text-[clamp(2rem,8vw,5rem)] leading-[0.95]">
          {text.site.name}
        </h1>
      </FadeSection>
      {text.home.sections.map((section) => (
        <FadeSection key={section.id} className="mx-auto flex min-h-[130svh] w-full max-w-5xl items-center py-32 sm:py-40">
          <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-10">
            <Image
              src={section.image}
              alt={section.imageAlt}
              width={500}
              height={500}
              className={`aspect-square w-full ${section.imagePosition === "right" ? "order-2" : ""} ${section.imageFit === "contain" ? "object-contain" : "rounded-3xl object-cover"}`}
              sizes="(min-width: 1024px) 492px, (min-width: 768px) 50vw, 100vw"
            />
            <div className={section.imagePosition === "right" ? "order-1" : ""}>
              <h2 className="font-bagel-fat-one text-5xl sm:text-6xl">{section.title}</h2>
              <p className="mt-5 text-xl leading-8 text-zinc-600 dark:text-zinc-300">{section.description}</p>
            </div>
          </div>
        </FadeSection>
      ))}
    </main>
  );
}
