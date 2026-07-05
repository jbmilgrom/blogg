# Blog Writing & Repo Guide

Eleventy static site (softwarefordays.com). Posts live in `src/post/*.md`.

## Writing rules (apply to every draft, every section — no narrative exemption)

1. **Topic sentence first.** Every section and nearly every paragraph opens with its claim; support follows. If a paragraph's point arrives in its last sentence, restructure.
2. **Reasoning on the surface.** Connect claims with explicit connectives (because, even though, so, in order to). Never argue by juxtaposition — a punchy short sentence or staccato fragment standing in for an inference asks the reader to do the writer's work.
3. **Contrasts only when the contrast is the information.** "A, not B" is allowed only to refute a live alternative (e.g., "the storage medium, not any lack of effort"). Never as cadence or emphasis. If A and B are both true (e.g., two effects of the same cause), state both and relate them; do not deny one to sharpen the other.
4. **No devices that substitute for argument.** No suspense hooks ("There is a catch…"), reveal lines ("…all along."), lecture-hall imperatives ("Notice that…", "Step back…"), or fragments standing in for an inference. Cold opens argue too — narrative gets no exemption. Personality is a different matter: a wry aside ("if I may say so myself") is the author's call, because it costs the argument nothing. The test is whether removing the flourish removes reasoning the reader needed.
5. **Don't get far upfield of the current point.** A theme that deserves development later in the essay must not appear earlier as a passing flourish; the flourish detracts from the point currently being made and cheapens the later treatment. Every sentence serves the paragraph's current point.
6. **Facts are verified, not recalled.** Commit subjects, quotes, numbers, and dates are checked against the source (git log, the cited paper) before they enter a draft. Quote verbatim; note redactions in a footnote.
7. **Anonymization.** Customer and portal names are anonymized ("a legacy portal," "a DME provider"). Docflow Labs may be named. Technology names (Telerik, ASP.NET) are fine.

## Mechanics

- Frontmatter: `title`, optional `subtitle`, `description`, `date`, `tags: post`, `layout: layouts/post.liquid`, `hasTOC: yes` for long posts; `[toc]` after the intro.
- Footnotes: markdown-it-footnote (`[^name]`), definitions at the bottom with markdown links.
- Math: `$$…$$` renders via the layout's math support.
- Dev server: `npm run dev` (port 8787).
- A file with `tags: post` publishes on deploy — drafts must stay untracked or untagged.
- Long posts end with the Docflow Labs sign-off line and a hello link.
