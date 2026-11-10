# febrianthomas.github.io

The personal website of Febrian Thomas, a self-taught illustrator and 2D animator. It brings together illustrations, animation, portfolio projects, and posts, along with links to his social profiles and ways to support his work.

Visit the site at [febrianthomas.github.io](https://febrianthomas.github.io/).

## Features

- Portfolio projects and posts with search, tags, featured items, and previous/next navigation.
- A rich-text editor for the site owner to publish, edit, and delete content with cover images, inline images, and YouTube embeds.
- English and Indonesian interface copy, plus light and dark themes.
- Social links and configurable support buttons on the About page.

## Built with

- Next.js, React, TypeScript, and Tailwind CSS
- Supabase for authentication, posts, and image storage
- Tiptap for the editor; Motion and Lenis for motion and scrolling
- GitHub Pages for hosting

Next.js exports a static site. The browser connects to Supabase for live content, so publishing a post does not require a site rebuild.

## Get started

Install Node.js 22.18 or newer, then run:

```sh
npm install
```

Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

```sh
npm run dev
```

Open <http://localhost:3000>. Restart the development server after changing environment variables. The static build works without credentials, but live content and sign-in need a configured Supabase project.

`NEXT_PUBLIC_*` values are visible in the built site. Never use a secret or service-role key.

## Supabase

Apply the migrations in `supabase/migrations` in order. Enable email/password authentication and create the owner account in Supabase Auth. Sign in at `/login/`.

The migrations set up posts, the public `post-images` bucket, support buttons, and Row Level Security policies. Owner policies reference a specific user ID: update them when using a different owner account. Keep database and Storage policies enabled.

Cover images accept PNG, JPEG, WebP, and GIF files up to 5 MiB. Static images may be resized and converted to WebP; animated images retain their format. If cleanup fails after editing or deleting content, inspect the Storage bucket.

## Project files

| Path | Purpose |
| --- | --- |
| `src/app` | Routes and global styles |
| `src/ui/pages` | Page layouts |
| `src/ui/components` | Reusable components |
| `src/content/en.json`, `src/content/id.json` | English and Indonesian interface copy |
| `src/lib` | Shared logic and Supabase client |
| `public/images` | Local images |
| `supabase/migrations`, `supabase/tests` | Database setup and SQL checks |
| `tests` | Node.js tests |

Keep both language files in sync. Posts and projects remain in the language in which they were written.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run JavaScript tests |
| `npm run build` | Export the site to `out/` |
| `npm run deploy` | Build and publish `out/` to the `gh-pages` branch |

## Deployment

The GitHub Actions workflow deploys the committed `main` branch when triggered manually. Push source changes, set the GitHub Pages source to **GitHub Actions**, and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as repository Actions secrets.

Trigger and check the workflow from GitHub or with:

```sh
gh workflow run deploy-pages.yml --ref main
gh run list --workflow deploy-pages.yml --limit 1
```

Alternatively, use `npm run deploy` and configure Pages to serve the `gh-pages` branch. Pushing source commits alone does not deploy the site. Runtime server routes and server-side rendering require a server host.
