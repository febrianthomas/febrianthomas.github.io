# Handoff: febrianthomas.github.io

Snapshot: 2026-11-09. Recheck the working tree and current files before making changes; the user may edit them directly.

## Working preferences

- Make the requested change directly and keep solutions simple. Preserve the user's edits.
- Do not run a production build after every change. Use targeted checks; build when needed to verify static export or when asked.
- Commit and push to GitHub after every **10 requested changes**. This snapshot was prepared for the tenth change in the batch following `780e944`; once that batch is committed and pushed, start the next count at zero. Questions and explanations alone do not increment the count. Do not commit or push early unless asked.
- Refresh `handsoff.md` after every **five commits**, counting the commit containing this snapshot as the first. Record the current state and reset the five-commit count after each refresh.
- The user asked for Context7 documentation when working with a library, framework, API, CLI, or cloud service. Resolve the library first, then query its docs. Use the available equivalent if Context7 is unavailable.
- Keep visible copy editable in `src/content/text.json`. Preserve accessibility, keyboard access, responsive layouts, and reduced-motion support.

## Project and repository

- Personal website using Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase. `next.config.ts` uses `output: "export"` and `trailingSlash: true` for GitHub Pages.
- `src/app` contains routes. Reusable components and page components are under `src/ui/components` and `src/ui/pages`; `src/pages` is intentionally avoided because Next.js treats it as Pages Router routes.
- Run `npm.cmd run typecheck` and `npm.cmd test` in this PowerShell environment. `npm.cmd run build` verifies static export and may require network access for Google Fonts.
- GitHub remote: `https://github.com/febrianthomas/febrianthomas.github.io.git`, branch `main`. The active GitHub CLI account was switched to `febrianthomas`; repository-local Git identity was set to that account. Verify before a future push. The user requested commit and push, not automatic deployment: GitHub Pages deployment uses the separate `npm run deploy` workflow described in `README.md`.

## What has been built

- Home page: animated character with a click greeting; editable sections from `text.home.sections` in `src/content/text.json`. The background has colorful moving shapes, follows mouse movement, and respects reduced motion. Motion is used for UI animation; Lenis handles smooth scrolling.
- Shared header/footer, light/dark toggle, logo links, and About, Portfolio, Post, and Login pages. About has editable tool/software cards and social URLs. Social icons use `simple-icons`; empty URLs are non-link placeholders.
- Supabase email/password sign-in; the header switches to a sign-out control with a Radix confirmation dialog. Logged-in users are redirected from `/login/` to `/`. The login copy says only the owner can sign in, but sign-in itself accepts any valid user in the project; do not treat that copy as an authorization check.
- Posts: `/post/` shows published Supabase posts or a loading, empty, or error state. Signed-in users can open **Add post**, a modal accepting title, description, and text body. `/post/view/?id=<uuid>` reads a post client-side, allowing newly published posts to work on a static host without rebuilding. The former sample posts and their static detail routes were removed.

## Supabase and security

- Configured project reference: `tnxcutuipxqxcdcllhdn`. The local environment contains the public project URL and publishable key; do not copy keys or credentials into this file or commits.
- The `public.posts` table and RLS policies were **already applied to the connected remote project**. The corresponding migration is `supabase/migrations/20261109000000_create_posts.sql`; inspect before applying it elsewhere or attempting to reapply it.
- Posts are public immediately after creation. Anyone can read; only the specific confirmed owner account in the migration policy can insert. The owner check is enforced in the database, not by hiding the button. Update the policy deliberately if the owner account changes.
- Policy checks were run inside a rolled-back transaction: owner insert and public read succeeded; anonymous and another authenticated identity were denied. `supabase/tests/posts_rls.sql` records the checks. An anonymous Supabase client also verified public read and rejected insert. No test rows were left behind.
- Post creation is text-only. Image upload, post editing, and post deletion are not implemented. The user asked whether Supabase supports image uploads and whether deleting a post deletes its image; these were questions, not requests to implement either feature. Storage objects require separate Storage API deletion and careful failure handling if this is requested later.

## Working-tree snapshot

Run `git status --short` for the authoritative list. This snapshot was prepared immediately before committing the post list, empty state, creation modal, reader, Supabase client helpers, migration and policy test, plus social-icon styling and the related JSON/README changes. The Supabase posts table already exists remotely. A Git push does not itself deploy the site. Do not overwrite or discard uncommitted changes.

TypeScript typecheck and existing tests passed after the creation modal was added. A production build passed earlier with the Supabase post routes, before the sample and standalone creation routes were removed. The live sign-in, creation modal, and empty-state UI have not been verified end-to-end in a browser using the owner's credentials.

## Recent commit history

- `780e944` — About-page social links and related styling.
- `10f8849` — About page and tool cards.
- `7e951b9` — Centralized content and sign-in improvements.
- `7e1baf5` — Home sections and scrolling.
- `c66bd2b` — Home page and hero interaction.
