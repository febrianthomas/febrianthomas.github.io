# Handoff: febrianthomas.github.io

Snapshot: 2026-11-09. Recheck the working tree and live state before making changes. The user may edit files directly; preserve those edits.

## User preferences

- Complete requested work directly and keep changes simple. Keep user-facing text in `src/content/en.json` and `src/content/id.json`.
- Do not run a production build after every change. Use focused checks; build when needed for a significant release or static-export verification.
- Commit after every requested change (not questions). Push to the active branch after every **10 commits**. Check `git status -sb` for the count since the last push.
- Update this handoff every 5 commits. If the model limit is below 5%, stop all work and write all progress and pending tasks here. The assistant cannot see the quota; if the user reports a limit, stop and update this document.
- Use the `init-project-conversation` skill (`.agents/skills/`) at session start; it applies ponytail and caveman.
- Use Context7 for library, framework, API, and cloud documentation. Do not expose credentials in files or logs.
- Keep GitHub Pages and do not require a redeployment each time a post is created or edited. The user explicitly cancelled custom post URLs. Retain `/post/view/?id=<uuid>`.

## Project

- Next.js App Router, React, Tailwind CSS, Supabase, Tiptap, Motion, Lenis, and Radix dialogs. `next.config.ts` uses static export for GitHub Pages. UI components and page components live in `src/ui`.
- GitHub: `https://github.com/febrianthomas/febrianthomas.github.io.git`, branch `main`. A push updates source, not the GitHub Pages site; deployment is a separate process. Use the authenticated `febrianthomas` GitHub CLI account; if Git's default credential helper hangs, `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin main` worked previously.
- Supabase project reference: `tnxcutuipxqxcdcllhdn`. `.env` contains a public URL and publishable key; never copy credentials into this document. Public post reads are allowed. Database write and Storage policies enforce the owner account.
- Existing features include post creation, editing, deleting, images in a public `post-images` bucket, owner-only Storage access, image cleanup, and Tiptap rich text. All ordinary posts and uploaded images are public.

## Recent progress

- Added `AGENTS.md`, homepage previews for live posts and projects, and an About page donation section. Hero descriptions reflect the user's profile and use four committed GIFs. Tools and software stack vertically with horizontal item rows; donations follow them. The footer shows copyright and social links.
- The header has an EN/ID language switch. Site copy is in `src/content/en.json` and `src/content/id.json`; the language is saved in local storage. Supabase post and project content stays in its original language. Keep keys and asset paths aligned across both files.
- As of `4cbe096`, portfolio and post empty states have no outer card; the portfolio description and search text were refreshed. Check `git status -sb` for commits since the last push.
- About page links include four donation providers with configurable GIFs. The outer support card was removed. Signed-in owner controls show or hide each provider using `public.support_buttons`; disabled buttons remain visible to signed-in users. Migration `20261109000009_support_buttons.sql` is applied remotely. RLS was tested in a rolled-back transaction with `supabase/tests/support_buttons_rls.sql`.
- The user supplied six social links and four donation links, stored in the language JSON files. Type checking passed after these changes. No production build was run.
- The working tree also contains user-edited copy, deleted temporary assets, and new GIFs under `public/images`. Preserve these unrelated uncommitted edits. Check `git status` before further work.
- The following post and portfolio features are committed. The live GitHub Pages deployment remains separate from source pushes.

The user requested published and updated dates, better social previews, inline images, search, tags, image captions, featured posts, previous/next navigation, and an image lightbox. They cancelled custom URLs because static GitHub Pages cannot create new routes at runtime. They specifically approved a public unauthenticated Supabase Edge Function for social previews.

- Portfolio feature: uses a separate `public.projects` table in Supabase with the same schema, grants, RLS policies, and Storage image-deletion protection as `public.posts`. `src/lib/post-kind.ts` (`kindTable`, `kindText`, `kindPath`) routes `"portfolio"` to `"projects"` and `"post"` to `"posts"`. `PostSectionPage`, `LivePosts`, `LivePostPage`, `NewPostDialog` and `DeletePostButton` take a `kind` prop. Routes: `/portfolio/` and `/portfolio/view/?id=<uuid>`.
- Refactored UI and CSS: extracted `PostSectionPage`, removed modal outer borders, tuned card/image shadow & warm glow, updated Tailwind v4 classes (`@theme inline`, `size-*`, `z-60..90`), and removed unused `Cherry_Bomb_One` font.
- Applied to the connected Supabase project: `20261109000006_post_features.sql` (tags, featured, caption, updated timestamp) and `20261109000007_inline_images.sql` (inline paths and Storage deletion policy). These are backward-compatible for the currently deployed site. Both were tested inside rolled-back transactions before application. Do not reapply remotely.
- The `share-post` Edge Function was deleted from Supabase (verified: function list is empty). Its local source and tests were removed. The copy-share feature is gone. The old GitHub Pages URL cannot serve dynamic post metadata.
- Implemented locally: metadata fields and form controls, featured ordering, searchable post content, tag filtering, publish/update dates, cover captions, chronological previous/next links, a cover and inline-image lightbox, and inline image selection. The inline image flow uses temporary local blob URLs while editing, uploads on save, records `inline_image_paths`, and cleans up unreferenced images after an update/delete. Existing database posts and image paths must not be damaged.
- Tiptap's `@tiptap/extension-image` was installed. Inline images use `storagePath` attributes to track Storage files; captions are added as editable paragraphs. The editor inserts images using a nested Radix dialog.
- Tests added or updated: `tests/post-list.test.mjs`, `tests/post-inline-images.test.mjs`, `tests/post-update.test.mjs`, `tests/post-delete.test.mjs`, `tests/post-format.test.mjs`; SQL checks in `supabase/tests/post_features.sql` and `inline_images.sql`. TypeScript and the tests passed. Database policy checks ran in rolled-back transactions.
- Headless Edge verified the public Posts page and existing post, search filtering, cover lightbox open/close, inline-image lightbox keyboard access, and previous/next navigation. The user later changed previous/next links to icons and removed the copy-share button. A simulated owner session with all writes blocked verified that the edit form inserts a local image and caption without uploading or submitting. No real post was changed. A portal submit bubbling bug found by this check was fixed with `stopPropagation`.
- Real owner-credential end-to-end saving and Storage cleanup were not tested in a browser. Unit tests exercise upload, update, failure, and cleanup decisions using mocks. Do not modify or delete the user's real posts for testing. Confirm the GitHub Pages deployment separately from source commits.

## Supabase and deployment cautions

- Migrations through `20261109000008_portfolio_kind.sql` (`create_projects` and `protect_project_images`) have been applied remotely (do not reapply). Use the Storage API to remove files, not SQL deletes on `storage.objects`.
- Updates save the database before deleting replaced files; if cleanup fails, the user sees a warning and should inspect Storage. Retain conservative handling of uncertain network responses so files still referenced by posts are not removed.
- Earlier handoffs that claimed posts were text-only are obsolete. Check current code and migrations for the authoritative behavior.
