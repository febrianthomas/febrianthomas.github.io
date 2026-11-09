# febrianthomas.github.io
febrianthomas official website

The [HTML portfolio prototype](prototype/index.html) follows [the PRD](issues/prd.md).
Open it directly, or run `python -m http.server 8000 --directory prototype` from this repository and visit <http://localhost:8000> for the full motion preview.

See [prototype notes](prototype/README.md) for the demo studio, content assumptions, and checks.

## App setup

Next.js App Router with TypeScript, Tailwind CSS, a browser Supabase client, and
static export for GitHub Pages. Requires Node.js 22.18 or newer and npm.

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. Edit `src/app/page.tsx` to change the home page.

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
the new account. Posts currently support text only; image uploads, editing, and
deletion are not included.

### Checks

```sh
npm run typecheck
npm test
npm run build
```

### GitHub Pages

```sh
npm run deploy
```

This builds the site into `out/`, then publishes it to the `gh-pages` branch on
`origin` with a `.nojekyll` marker so GitHub serves Next.js's `_next` assets.
It requires Git credentials with push access and a configured Git name and email.
The deployed branch is generated output; keep source changes on the source branch.

After the first deployment, open the repository's **Settings → Pages**, select
**Deploy from a branch**, choose **gh-pages** and **/(root)**, and save. See
[GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
The site URL is <https://febrianthomas.github.io/>. No `basePath` is needed for
this user-site repository.

GitHub Pages serves static files. Use browser-side Supabase calls for live data;
Next.js server actions, runtime API routes, and server-side rendering require a
server host. Supabase Row Level Security policies control database access.
