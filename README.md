# febrianthomas.github.io

Personal portfolio and blog of Febrian Thomas, a self-taught illustrator and 2D animator. Built as a statically exported Next.js App Router site hosted on GitHub Pages, with browser-side Supabase queries for live posts, portfolio projects, authentication, support button visibility, and image storage so publishing or editing content requires no site rebuild.

## Features

- **Home (`/`)**: Interactive greeting illustration (`HeroIllustration`), scroll-revealed story sections, and live 3-item previews for Portfolio and Posts.
- **Portfolio & Posts (`/portfolio/`, `/post/`, `/portfolio/view/?id=<uuid>`, `/post/view/?id=<uuid>`)**: Query-based detail pages compatible with static export, multi-word search across titles, descriptions, tags (up to 10 tags, 40 chars each), and Tiptap document text, topic tag filtering, featured-first ordering, chronological previous/next navigation, and image lightbox previews.
- **Owner CMS & Authentication (`/login/`)**: Email/password sign-in via Supabase Auth unlocks create, edit, and delete dialogs for posts and projects, plus visibility toggles for support buttons on `/about/`.
- **Rich-Text & Media Pipeline**: Tiptap editor supporting headings, text formatting, lists, blockquotes, code blocks, safe external links, pasted YouTube embeds (`youtube-nocookie.com`), up to 20 inline images (20,000-character body limit), and cover images (PNG, JPEG, WebP, GIF up to 5 MiB) with client-side WebP/GIF optimization (`Canvas` and `gifsicle-wasm-browser`) and automatic orphaned-image cleanup.
- **About (`/about/`)**: Introduction, social links, hardware/software gear lists, and Supabase-backed support links (Streamlabs, Saweria, Ko-fi, Trakteer).
- **Bilingual & Accessible UX**: English (`en`) and Indonesian (`id`) copy, light/dark theme persistence, background music toggle and UI click sounds, Lenis smooth scrolling, and Motion transitions honoring `prefers-reduced-motion`.

## Tech Stack

| Category | Technology | Role |
| --- | --- | --- |
| Framework | Next.js (`16.4.5`), React (`19.3.1`) | App Router pages and static HTML export (`output: "export"`) |
| Language | TypeScript (`6.0.3`) | Strict static typing |
| Styling | Tailwind CSS (`4.3.5`) | Utility-first styling with dark mode (`@custom-variant dark`) |
| Backend & Storage | Supabase (`@supabase/supabase-js` `2.119.0`) | Auth, PostgreSQL with RLS, and `post-images` Storage bucket |
| Rich Text | Tiptap (`3.33.0`), `react-markdown` (`10.1.0`) | WYSIWYG editor, YouTube/image nodes, and legacy Markdown rendering |
| UI Primitives | Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`), Lucide, Simple Icons | Accessible dialogs, UI icons, and brand social icons |
| Motion & Audio | Motion (`14.10.1`), Lenis (`1.3.27`), `use-sound` (`5.0.0`) | Scroll/hover motion, smooth scrolling, and audio playback |
| Media Optimization | `gifsicle-wasm-browser` (`1.5.19`) | Client-side GIF compression alongside Canvas WebP conversion |
| Testing & Deploy | Node.js Test Runner (`node --test`), `gh-pages` (`6.3.0`) | Unit tests and GitHub Pages publishing |

## Getting Started

Install Node.js `22.18.0` or newer, then install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and set your Supabase project URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`. Restart the dev server after changing `.env.local`. Static builds succeed without credentials, while live content and owner sign-in require a configured Supabase project. `NEXT_PUBLIC_*` values are embedded in the static bundle; never use a secret or service-role key.

## Scripts

```bash
npm run dev        # Start the Next.js development server
npm run typecheck  # Run tsc --noEmit
npm test           # Run Node.js unit tests (tests/*.test.mjs)
npm run build      # Export the static site to out/
npm run deploy     # Run predeploy (npm run build) and publish out/ to gh-pages
```

## Supabase

Apply the SQL migrations in `supabase/migrations` in chronological order, enable email/password auth, and create the owner user in Supabase Auth (sign in at `/login/`).

The migrations provision `posts`, `projects`, `support_buttons`, the public `post-images` Storage bucket, and Row Level Security policies. Owner RLS policies reference a specific user ID across multiple migrations; update that user ID if deploying under a different Supabase Auth account. SQL policy checks live in `supabase/tests`.

## Deployment

The `.github/workflows/deploy-pages.yml` workflow builds `out/` and deploys to GitHub Pages when triggered manually (`workflow_dispatch`). Pushing source commits alone does not deploy the site.

1. Set the repository's GitHub Pages source to **GitHub Actions**.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as repository Actions secrets.
3. Trigger and monitor a deployment from GitHub or with GitHub CLI:

```bash
gh workflow run deploy-pages.yml --ref main
gh run list --workflow deploy-pages.yml --limit 1
```

Alternatively, publish `out/` to the `gh-pages` branch with `npm run deploy`.

## Project Structure

```text
.
├── .github/workflows/deploy-pages.yml   # Manual GitHub Pages build & deploy workflow
├── public/
│   ├── images/                          # Illustrations, animated GIFs, and gear icons
│   └── mp3/                             # Background music and click audio assets
├── src/
│   ├── app/                             # Next.js App Router routes and globals.css
│   ├── constants/                       # Shared post limits, social platforms, nav, and UI styles
│   ├── content/                         # Synced EN/ID localization JSON (en.json, id.json)
│   ├── hooks/                           # Client hooks (use-signed-in, use-post-dialog)
│   ├── lib/                             # Supabase client, post CRUD/image/YouTube/form helpers
│   └── ui/
│       ├── components/                  # Reusable PascalCase UI components
│       └── pages/                       # Page-level client layouts
├── supabase/
│   ├── migrations/                      # Database tables, storage bucket, and RLS policies
│   └── tests/                           # SQL RLS and schema verification checks
└── tests/                               # Node.js unit tests (*.test.mjs)
```

Keep `src/content/en.json` and `src/content/id.json` keys in sync; user-authored posts and portfolio projects remain in their original language.

## License

Licensed under the [MIT License](LICENSE).
