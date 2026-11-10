# Repository Guidelines

## Project

This is Febrian Thomas's portfolio and blog, built with the Next.js App Router and exported to GitHub Pages. Supabase provides live posts, portfolio projects, authentication, and image storage. Tiptap powers the content editor.

- `src/app`: routes and global styles.
- `src/ui/pages` and `src/ui/components`: page layouts and reusable components.
- `src/lib`: shared logic and Supabase client.
- `src/content/en.json` and `src/content/id.json`: English and Indonesian interface copy.
- `public/images`: local images.
- `supabase/migrations` and `supabase/tests`: database migrations and SQL checks.
- `tests`: Node.js tests.

## Development and checks

Use Node.js 22.18 or newer and install dependencies with `npm install`.

- `npm run dev`: start the development server.
- `npm run typecheck`: check TypeScript.
- `npm test`: run the Node.js test suite.
- `npm run build`: export the site to `out/`. Run it when static-export verification is needed, not after every change.
- `npm run deploy`: build and publish `out/` to the `gh-pages` branch.

The GitHub Actions Pages workflow deploys the selected ref when manually triggered. Pushing source commits does not deploy the site.

## Implementation and tests

Follow the existing TypeScript, React, and Tailwind style, including two-space indentation. Name component files and folders in PascalCase, such as `Button/Button.tsx`, and shared modules in lowercase with hyphens, such as `post-image.ts`. Keep visitor-facing interface copy in both language files; posts and projects remain in their original language.

Use browser-side data fetching for live content: static GitHub Pages cannot run server routes. Preserve the query-based detail routes `/post/view/?id=<uuid>` and `/portfolio/view/?id=<uuid>` so new content does not require a rebuild.

Use Node's built-in test runner and name tests `*.test.mjs`. Add focused tests for meaningful behavior changes, especially post and image handling. SQL policy checks belong in `supabase/tests`. Avoid modifying real posts or images during testing.

## Configuration and security

Copy `.env.example` to `.env.local` for local Supabase configuration. Browser-exposed `NEXT_PUBLIC_*` values must never contain secret or service-role keys. Keep database and Storage policies enforced by Supabase RLS. Owner policies contain a specific user ID across multiple migrations. Never include credentials in commits or handoffs.

Use Context7 documentation for library, framework, API, and cloud questions. If `handsoff.md` exists, read it for current project state and user preferences and update it every five commits. Preserve its deletion if it is absent from the working tree.

## Session and Git workflow

At the start of each project session, read and follow `C:/Users/febrianthomas/.agents/skills/_febrianthomas-skill/init-project/SKILL.md`. Preserve unrelated working-tree edits. Commit each requested change and push after ten commits. Use short conventional commit messages, such as `feat: add project previews` or `fix: preserve image animation`.

In pull requests, describe behavior changes and verification, link relevant issues, and include screenshots for visible changes.
