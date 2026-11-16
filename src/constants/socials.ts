import { siInstagram, siThreads, siTiktok, siTwitch, siX, siYoutube } from "simple-icons";

export const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    icon: siInstagram,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-200 dark:text-pink-800",
  },
  {
    key: "threads",
    icon: siThreads,
    color: "bg-zinc-200 text-zinc-950 dark:bg-zinc-100 dark:text-zinc-950",
  },
  {
    key: "twitter",
    icon: siX,
    color: "bg-zinc-200 text-zinc-950 dark:bg-zinc-100 dark:text-zinc-950",
  },
  {
    key: "tiktok",
    icon: siTiktok,
    color: "bg-cyan-100 text-zinc-950 dark:bg-cyan-200 dark:text-zinc-950",
  },
  {
    key: "youtube",
    icon: siYoutube,
    color: "bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800",
  },
  {
    key: "twitch",
    icon: siTwitch,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-200 dark:text-violet-800",
  },
] as const;
