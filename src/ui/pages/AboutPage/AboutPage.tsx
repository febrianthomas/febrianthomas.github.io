import Image from "next/image";
import { ImageIcon } from "lucide-react";
import text from "@/content/text.json";

export default function AboutPage() {
  return (
    <main className="flex-1 px-6 sm:px-10">
      <div className="mx-auto grid max-w-5xl items-center gap-10 py-20 sm:py-28 md:min-h-[70svh] md:grid-cols-2 md:gap-16">
        <Image src={text.about.image} alt={text.about.imageAlt} width={500} height={500} className="mx-auto aspect-square w-full max-w-md object-contain" sizes="(min-width: 768px) 448px, 100vw" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{text.about.eyebrow}</p>
          <h1 className="mt-5 font-bagel-fat-one text-6xl leading-none sm:text-8xl">{text.about.title}</h1>
          <p className="mt-6 text-xl leading-8 text-zinc-800 dark:text-zinc-200">{text.about.description}</p>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{text.about.details}</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-20 pb-24 sm:gap-28 sm:pb-32">
        {[text.about.tools, text.about.software].map((section) => (
          <section key={section.title}>
            <h2 className="text-center font-bagel-fat-one text-3xl sm:text-4xl">{section.title}</h2>
            {section.items.length > 0 ? (
              <ul className="mt-8 flex flex-wrap justify-center gap-4">
                {section.items.map((item) => (
                  <li key={item.name} className="flex min-h-36 w-36 max-w-full flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-center text-zinc-900 sm:w-44 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                    {item.image ? (
                      <Image src={item.image} alt="" width={56} height={56} className="h-14 w-14 object-contain" />
                    ) : (
                      <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"><ImageIcon size={24} /></span>
                    )}
                    <span className="break-words font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-center text-lg leading-8 text-zinc-600 dark:text-zinc-300">{section.empty}</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
