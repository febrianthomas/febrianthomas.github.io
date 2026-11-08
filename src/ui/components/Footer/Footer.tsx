import text from "@/content/text.json";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 sm:px-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{text.site.copyright}</span>
      </div>
    </footer>
  );
}
