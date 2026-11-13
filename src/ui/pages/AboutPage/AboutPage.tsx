"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { siInstagram, siYoutube, siX, siThreads, siTwitch, siTiktok } from "simple-icons";
import { MotionLink } from "@/ui/components/MotionLink/MotionLink";
import { SocialPlaceholder } from "@/ui/components/SocialPlaceholder/SocialPlaceholder";
import { SupportButtons } from "@/ui/components/SupportButtons/SupportButtons";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export default function AboutPage() {
  const { text } = useLanguage();
  const sections: { title: string; empty: string; items: { name: string; image: string; details?: string[] }[] }[] = [text.about.software, text.about.tools];
  const socials = [
    { ...text.about.socials.instagram, icon: siInstagram, color: "bg-pink-100 text-pink-700 dark:bg-pink-200 dark:text-pink-800" },
    { ...text.about.socials.threads, icon: siThreads, color: "bg-zinc-200 text-zinc-950 dark:bg-zinc-100 dark:text-zinc-950" },
    { ...text.about.socials.twitter, icon: siX, color: "bg-zinc-200 text-zinc-950 dark:bg-zinc-100 dark:text-zinc-950" },
    { ...text.about.socials.tiktok, icon: siTiktok, color: "bg-cyan-100 text-zinc-950 dark:bg-cyan-200 dark:text-zinc-950" },
    { ...text.about.socials.youtube, icon: siYoutube, color: "bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800" },
    { ...text.about.socials.twitch, icon: siTwitch, color: "bg-violet-100 text-violet-700 dark:bg-violet-200 dark:text-violet-800" },
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
              const icon = <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 fill-current"><path d={social.icon.path} /></svg>;
              return social.url ? (
                <MotionLink key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} whileHover={{ y: -4, rotate: index % 2 ? 8 : -8, scale: 1.12 }} className={`inline-flex size-12 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 ${social.color}`}>{icon}</MotionLink>
              ) : (
                <SocialPlaceholder key={social.name} label={`${social.name} — ${text.about.socialUnavailable}`} title={social.name} index={index} className={social.color}>{icon}</SocialPlaceholder>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-5xl pb-32 pt-8 sm:pb-40 sm:pt-12">
        <div className="flex flex-col gap-16 sm:gap-20">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-center text-4xl sm:text-5xl">{section.title}</h2>
              {section.items.length > 0 ? (
                <ul className="mt-8 flex flex-wrap justify-center gap-4">
                  {section.items.map((item) => (
                    <li key={item.name} className="flex min-h-44 w-44 max-w-full flex-col items-center justify-center gap-5 p-6 text-center text-lg text-zinc-900 sm:w-52 dark:text-zinc-100">
                      {item.image ? (
                        <Image src={item.image} alt="" width={88} height={88} className="about-item-image size-22 object-contain" />
                      ) : (
                        <span aria-hidden="true" className="flex size-22 items-center justify-center text-zinc-400 dark:text-zinc-500"><ImageIcon size={32} /></span>
                      )}
                      <span className="wrap-break-words font-medium">{item.name}</span>
                      {item.details && (
                        <ul className="-mt-2 space-y-1 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                          {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-center text-lg leading-8 text-zinc-600 dark:text-zinc-300">{section.empty}</p>
              )}
            </section>
          ))}
        </div>
        <SupportButtons />
      </div>
    </main>
  );
}
