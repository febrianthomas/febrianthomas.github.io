import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { siInstagram, siYoutube, siX, siThreads, siTwitch, siTiktok } from "simple-icons";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { SocialPlaceholder } from "@/ui/components/SocialPlaceholder/SocialPlaceholder";
import text from "@/content/text.json";

export default function AboutPage() {
  const socials = [
    { ...text.about.socials.instagram, icon: siInstagram },
    { ...text.about.socials.threads, icon: siThreads },
    { ...text.about.socials.twitter, icon: siX },
    { ...text.about.socials.tiktok, icon: siTiktok },
    { ...text.about.socials.youtube, icon: siYoutube },
    { ...text.about.socials.twitch, icon: siTwitch },
  ];

  return (
    <main className="flex-1 px-6 sm:px-10">
      <div className="mx-auto grid min-h-[calc(100svh-140px)] max-w-5xl content-center items-center gap-10 py-12 md:min-h-[calc(100svh-76px)] md:grid-cols-2 md:gap-16 md:py-16">
        <Image src={text.about.image} alt={text.about.imageAlt} width={500} height={500} className="mx-auto aspect-square w-full max-w-md object-contain" sizes="(min-width: 768px) 448px, 100vw" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{text.about.eyebrow}</p>
          <h1 className="mt-5 font-bagel-fat-one text-6xl leading-none sm:text-8xl">{text.about.title}</h1>
          <p className="mt-6 text-xl leading-8 text-zinc-800 dark:text-zinc-200">{text.about.description}</p>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{text.about.details}</p>
          <nav aria-label={text.about.socialLabel} className="mt-8 flex flex-wrap gap-3">
            {socials.map((social, index) => {
              const icon = <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d={social.icon.path} /></svg>;
              return social.url ? (
                <MotionLink key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} whileHover={{ y: -4, rotate: index % 2 ? 8 : -8, scale: 1.12 }} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">{icon}</MotionLink>
              ) : (
                <SocialPlaceholder key={social.name} label={`${social.name} — ${text.about.socialUnavailable}`} title={social.name} index={index}>{icon}</SocialPlaceholder>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-16 pb-32 pt-6 sm:gap-20 sm:pb-40 sm:pt-10">
        {[text.about.tools, text.about.software].map((section) => (
          <section key={section.title}>
            <h2 className="text-center font-bagel-fat-one text-4xl sm:text-5xl">{section.title}</h2>
            {section.items.length > 0 ? (
              <ul className="mt-8 flex flex-wrap justify-center gap-4">
                {section.items.map((item) => (
                  <li key={item.name} className="flex min-h-44 w-44 max-w-full flex-col items-center justify-center gap-5 rounded-2xl bg-white p-6 text-center text-lg text-zinc-900 sm:w-52 dark:bg-zinc-900 dark:text-zinc-100">
                    {item.image ? (
                      <Image src={item.image} alt="" width={88} height={88} className="h-22 w-22 object-contain" />
                    ) : (
                      <span aria-hidden="true" className="flex h-22 w-22 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"><ImageIcon size={32} /></span>
                    )}
                    <span className="wrap-break-words font-medium">{item.name}</span>
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
