# Febrian Thomas

Personal website for Febrian Thomas, an illustrator and 2D animator. It brings together portfolio projects, posts, and links to his work.

Visit [febrianthomas.github.io](https://febrianthomas.github.io/).

## Features

- Portfolio and posts with search, tags, featured items, and image previews.
- An editor for posts and projects with formatted text, images, and YouTube embeds.
- Owner sign-in for publishing, editing, deleting, and managing support link visibility.
- English and Indonesian interface text, with light and dark themes.
- An About page with social links, tools, software, and support links.

## Tech stack

The site uses Next.js App Router, React, TypeScript, and Tailwind CSS. It exports static files for GitHub Pages. Supabase provides authentication, database storage, and image storage; the browser fetches live content. Tiptap powers the editor, while Motion and Lenis handle animation and scrolling.

## Run locally

Node.js 22.18 or newer and npm are required.

```sh
npm install
```

Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

```sh
npm run dev
```

Open <http://localhost:3000>. The site can build without Supabase credentials, but live content and sign-in require a configured project. Restart the development server after changing environment variables.

`NEXT_PUBLIC_*` values are included in the built site. Never put a secret or service-role key in them.

## Content and configuration

- `src/content/en.json` and `src/content/id.json` contain editable interface text. Keep both languages in sync.
- `public/images` contains local site images.
- `src/app` contains routes; `src/ui/pages` and `src/ui/components` contain page layouts and reusable components.
- `src/lib` contains shared logic, including Supabase and post handling.
- `supabase/migrations` contains the database and Storage setup; `supabase/tests` contains SQL checks.

Posts and projects are stored in Supabase and remain in the language in which they were written. They can be updated without rebuilding the site.

## Supabase setup

Apply the migrations in `supabase/migrations` in order. Enable email/password authentication and create the owner account in Supabase Auth. The sign-in page is `/login/`.

The migrations configure public reads and owner-restricted writes using Row Level Security, including policies for posts, images, and support buttons. Owner policies contain a specific user ID; update them for the intended owner when setting up a different Supabase project. Keep RLS and Storage policies enabled.

Images are stored in the public `post-images` bucket. Cover images accept PNG, JPEG, WebP, and GIF files up to 5 MiB. Static images may be resized and converted to WebP; animated images retain their format. If image cleanup fails after editing or deleting a post, inspect the bucket.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The build creates the static export in `out/`. JavaScript tests use Node's built-in test runner and live in `tests`.

## Deploy

The GitHub Actions workflow builds and deploys the committed `main` branch when manually triggered. Push source changes first, set GitHub Pages to use **GitHub Actions**, and configure these repository Actions secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Run the workflow from GitHub or with:

```sh
gh workflow run deploy-pages.yml --ref main
gh run list --workflow deploy-pages.yml --limit 1
```

Alternatively, `npm run deploy` builds locally and publishes `out/` to the `gh-pages` branch. Configure Pages for the deployment method you use. Pushing source commits alone does not deploy the site.

GitHub Pages serves static files, so live features use browser-side Supabase calls. Runtime server routes and server-side rendering require a server host.
