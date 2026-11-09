import Link from "next/link";
import { siInstagram, siThreads, siX, siTiktok, siYoutube, siTwitch } from "simple-icons";
import text from "@/content/text.json";

export function Footer() {
  const links = [
    { href: "/", label: text.navigation.home },
    { href: "/portfolio/", label: text.navigation.portfolio },
    { href: "/post/", label: text.navigation.post },
    { href: "/about/", label: text.navigation.about },
    { href: "/about/#support", label: text.about.donations.title },
  ];
  const socials = [
    { ...text.about.socials.instagram, icon: siInstagram },
    { ...text.about.socials.threads, icon: siThreads },
    { ...text.about.socials.twitter, icon: siX },
    { ...text.about.socials.tiktok, icon: siTiktok },
    { ...text.about.socials.youtube, icon: siYoutube },
    { ...text.about.socials.twitch, icon: siTwitch },
  ];

  return (
    <footer className="border-t border-zinc-200 px-6 sm:px-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 py-8 text-center sm:items-start sm:text-left">
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="font-bagel-fat-one text-2xl text-zinc-900 dark:text-zinc-100">{text.site.brand}</Link>
          <nav aria-label={text.navigation.label} className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            {links.map((link) => <Link key={link.href} href={link.href} className="rounded-sm hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 dark:hover:text-white">{link.label}</Link>)}
          </nav>
        </div>
        <div className="flex w-full flex-col items-center gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-between dark:border-zinc-800">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{text.site.copyright}</span>
          <nav aria-label={text.about.socialLabel} className="flex flex-wrap justify-center gap-2">
            {socials.filter((social) => social.url).map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} title={social.name} className="flex size-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current"><path d={social.icon.path} /></svg>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
