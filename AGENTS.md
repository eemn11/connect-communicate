<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the AAC home and its category/sentence interactions in the index route; this is one communication screen, not separate category pages.
- Use the shared Button variants and global semantic CSS tokens for AAC controls so word tiles and navigation remain consistent.
- Use browser speech synthesis only after user interaction; the home screen does not require a backend.
- Prebundle the Radix dialog and slot with React in Vite's initial dependency pass to avoid late optimization producing mixed React module identities in an open preview.

- Accounts use Lovable Cloud auth; signed-in pages live under the _authenticated layout and profile data in the profiles table with owner-only access. Why: keeps each user's info private.
- Profile photos go in a private avatars bucket shown via signed links. Why: workspace blocks public buckets.
- Use a shared bilingual completion helper with a server-only Lovable AI translation call; never translate credentials, phone numbers or numeric fields. Why: consistent translation without exposing secrets or altering identifiers.
- Store profile bilingual text as English and Korean lines in existing text fields; cards use label/ko and tasks use text/ko. Why: preserves existing storage and user edits without requiring a schema change.
- Use the shared SuggestionInput for content entry with local word completions, excluding credentials, numeric fields and search; never request predictions remotely. Why: consistent optional assistance without transmitting private keystrokes.
- Planning and Calendar share usePlanning and the same device-local schedule store; calendar date matching and ordering live in planning.ts. Why: task additions/removals remain consistent without duplicating schedules.
- Record daily opening rewards through the root DailyStreakProvider using device-local calendar dates and persisted progress; keep reward calculation in streak.ts. Why: every entry page counts once, while navigation and reloads do not duplicate rewards.
- Greet the signed-in user with their saved profile name, falling back to "friend"; the lookup lives in use-nickname.ts and nickname.ts. Why: a personal greeting without making the home screen depend on having an account.
