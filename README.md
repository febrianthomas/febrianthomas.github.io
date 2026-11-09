# febrianthomas.github.io

A personal website for Febrian Thomas, a self-taught illustrator and 2D animator.
It brings together illustrations, projects, and posts in one place, with a little
animation and personality along the way. Visit [febrianthomas.github.io](https://febrianthomas.github.io/).

## Features

- A home page introducing Febrian, with previews of recent projects and posts.
- Portfolio and post pages with search, tags, featured items, and expandable images.
- An About page with social links, tools, software, and support links.
- English and Indonesian site text, plus light and dark themes.
- Owner sign-in to create, edit, and delete projects and posts, and manage support link visibility.
- A rich-text editor for images, formatting, and embedded YouTube videos.

## Tech stack

- **Next.js and React** with TypeScript for the website and static export.
- **Tailwind CSS** for styling, with **Motion** and **Lenis** for animation and smooth scrolling.
- **Supabase** for authentication, the PostgreSQL database, and image storage.
- **Tiptap** for rich-text editing and **Radix UI** for accessible dialogs.
- **Lucide** and **Simple Icons** for icons.
- **GitHub Actions and GitHub Pages** for building and hosting the site.

## App setup

Next.js App Router with TypeScript, Tailwind CSS, a browser Supabase client, and
static export for GitHub Pages. Requires Node.js 22.18 or newer and npm.

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. Edit `src/app/page.tsx` to change the home page.

### Languages

The header switches between English and Indonesian and remembers the selection
in the browser. Edit site text in `src/content/en.json` and `src/content/id.json`;
keep their keys, links, and image paths in sync. Posts and projects stored in
Supabase remain in the language in which they were written.

### Supabase

Copy `.env.example` to `.env.local` and fill in your Supabase project URL and
publishable key from your project's API settings. Restart the dev server after
changing these values. The starter builds without credentials; they are required
only when calling `getSupabase()` from `src/lib/supabase.ts` in client code.

```tsx
"use client";

import { getSupabase } from "@/lib/supabase";

// Inside an event handler or effect:
// const { data, error } = await getSupabase().from("your_table").select("*");
```

`NEXT_PUBLIC_*` values are included in the public JavaScript bundle at build time.
Use only a publishable key, never a secret or service-role key. Enable Row Level
Security and configure policies before exposing tables to browser clients.
Rebuild and redeploy after changing environment variables.

The sign-in page is at `/login/`. Enable email/password authentication in
Supabase Auth and create the user there before signing in. A successful sign-in
creates a browser session; access to Supabase data must still be protected with
Row Level Security policies.

Signed-in users can open the post form from the Post page. Published posts are
public and are loaded from Supabase by the browser. The `posts` table and its policies are
defined in `supabase/migrations/20261109000000_create_posts.sql`: everyone can
read posts, while only the configured site owner's Supabase user can publish.
If the owner account changes, update the insert policy before publishing from
the new account. Posts can include an optional PNG, JPEG, WebP, or GIF image up
to 5 MiB. Images use the public `post-images` Storage bucket; its setup and
owner-only upload policies are in `supabase/migrations/20261109000001_post_images.sql`.
Before upload, static images are resized to fit within 1600 pixels and converted
to WebP if the result is smaller; otherwise the original is uploaded. Animated
images keep their original format.
Posts support headings, bold, italic, underline, strikethrough, lists, quotes,
code, dividers, links, and images inside the content. Authors can add tags,
feature posts, and add captions to the cover image. Visitors can search and
filter posts, view images larger, and navigate between posts. Posts show their
publication date and the date of their most recent update. The format column is
added by `supabase/migrations/20261109000002_post_body_format.sql`; editor
documents are enabled by `20261109000003_post_tiptap_format.sql`. Apply the
migrations in order when setting up another project.
Paste a YouTube video URL into the post or project content editor to embed it.
Pasting a link onto selected text still creates a regular link.
Definitively rejected post inserts try to clean up their uploaded image; if the
outcome is uncertain, check the post list and Storage before retrying. Signed-in
owners can delete a post and its image from the post page. If image removal fails,
retry from the confirmation dialog or check Storage. Owners can also edit posts,
keeping, replacing, or removing the image. If an old image cannot be removed
after saving, check Storage. The delete and edit policies are in migrations
`20261109000004_delete_posts.sql` and `20261109000005_update_posts.sql`.
Post metadata and inline images use `20261109000006_post_features.sql` and
`20261109000007_inline_images.sql`. Inline images are uploaded on save; removing
an image or deleting its post attempts to remove the unused file from Storage.
If cleanup fails, inspect the bucket. Publishing and editing do not require a
GitHub Pages rebuild.

### Checks

```sh
npm run typecheck
npm test
npm run build
```

### GitHub Pages

```sh
gh workflow run deploy-pages.yml --ref main
gh run list --workflow deploy-pages.yml --limit 1
```

The manually triggered workflow builds the committed `main` branch on GitHub
and deploys the `out/` artifact through GitHub Pages. Push source commits before
running it. GitHub Pages must use the **GitHub Actions** source, and the
repository must have `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configured as Actions secrets. These
values are public in the built site; never use a secret or service-role key.
The site URL is <https://febrianthomas.github.io/>.

GitHub Pages serves static files. Use browser-side Supabase calls for live data;
Next.js server actions, runtime API routes, and server-side rendering require a
server host. Supabase Row Level Security policies control database access.
