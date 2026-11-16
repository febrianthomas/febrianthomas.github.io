"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SOCIAL_PLATFORMS } from "@/constants/socials";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";
import { SocialIcon } from "@/ui/components/SocialIcon/SocialIcon";

export function Footer() {
  const { text } = useLanguage();
  const [year, setYear] = useState<number>();
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  const socials = SOCIAL_PLATFORMS.map((platform) => ({
    ...text.about.socials[platform.key],
    icon: platform.icon,
  }));

  return (
    <footer className="border-t border-zinc-200 px-6 sm:px-10 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl py-6 text-center sm:text-left">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{year ? text.site.copyright.replace(/\d{4}/, String(year)) : text.site.copyright}</span>
            <div className="flex items-end gap-1" aria-hidden="true">
              {["bulba", "ivy", "venu"].map((name) => (
                <Image key={name} src={`/images/${name}.gif`} alt="" width={32} height={32} className="size-8 object-contain" unoptimized />
              ))}
            </div>
          </div>
          <nav aria-label={text.about.socialLabel} className="flex flex-wrap justify-center gap-2">
            {socials.filter((social) => social.url).map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} className="flex size-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                <SocialIcon path={social.icon.path} className="size-5" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
