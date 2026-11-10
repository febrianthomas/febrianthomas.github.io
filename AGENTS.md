# Repository Guidelines

## Project Structure

This is a Next.js App Router site exported to GitHub Pages. Route files are in `src/app`; reusable components and page layouts are in `src/ui/components` and `src/ui/pages`. Shared logic lives in `src/lib`, editable English and Indonesian copy in `src/content/en.json` and `src/content/id.json`, and static images in `public/images`. Database migrations and SQL checks are in `supabase/migrations` and `supabase/tests`. JavaScript tests are in `tests`.

## Development and Checks

Use Node.js 22.18 or newer and run `npm install` to install dependencies.

- `npm run dev` starts the local development server.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm test` runs the Node.js test suite.
- `npm run build` creates the static export in `out/`; run it when static-export verification is needed, not after every change.
- `npm run deploy` builds and publishes `out/` to the `gh-pages` branch. Deployment is separate from pushing source commits.

## Style and Tests

Follow the existing TypeScript, React, and Tailwind style, including two-space indentation. Name component folders and files in PascalCase, such as `Button/Button.tsx`; use lowercase, hyphenated names for shared modules such as `post-image.ts`. Keep visitor-facing copy in both language files.

Use Node's built-in test runner and name tests `*.test.mjs`. Add focused tests for meaningful behavior changes, especially post and image handling. SQL policy checks belong in `supabase/tests`; avoid modifying real posts or images during testing. No coverage threshold is configured.

## Commits and Reviews

Use short conventional commit messages, for example `feat: add project previews` or `fix: preserve image animation`. Describe behavior changes and verification in pull requests, link relevant issues, and include screenshots for visible changes. Preserve unrelated working-tree edits.

## Configuration and Agent Notes

At the start of each project session, read and follow `C:/Users/febrianthomas/.codex/skills/init-project/SKILL.md`.

Copy `.env.example` to `.env.local` for local Supabase configuration. Browser-exposed `NEXT_PUBLIC_*` values must never contain secret or service-role keys. Keep database and Storage policies enforced by Supabase RLS. Use browser-side data fetching for live content: static GitHub Pages cannot run server routes.

Read `handsoff.md` for current project state and user preferences. Use Context7 documentation for library, framework, API, and cloud questions. Commit each requested change, push after ten commits, and update the handoff every five commits. Never include credentials in commits or handoffs.
