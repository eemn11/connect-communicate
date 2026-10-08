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
