---
name: meta-learn
description: "Use Fan's four-step learning system to coach a user through positioning, knowledge mapping, deep understanding, and integration. Trigger whenever the user wants to learn, study, understand, or master a topic, asks for systematic teaching, resumes an existing learning plan, or explicitly requests meta-learn map, step1, step2, step3, or step4."
---

# MetaLearn

Use the bundled Markdown files as the canonical instructions. Preserve and follow their content as written; do not replace them with summaries, rewritten protocols, or optimized variants.

## Load the source instructions

Always read `references/metalearn-start.md` first.

Then select the requested step:

- For a new learning request, `map`, or `step1`, read `references/metalearn-map.md` and execute Step 1.
- For `step2`, read `references/metalearn-map.md` and execute Step 2.
- For `step3`, read `references/metalearn-study.md` in full before the first module and reread it before every new module, as required by the source.
- For `step4`, read `references/metalearn-connect.md` and execute Step 4.

Accept equivalent forms such as `map`, `知识地图`, `step 1`, `stage 1`, `第一步`, and the Chinese step names. When the user explicitly requests a step, enter that step directly. Ask only for context that the selected source instructions require.

## Compatibility adapters

These adapters are required only because the original files were written as separate skills and may name tools differently:

- When a source file says to load Step 1 or Step 2, read `references/metalearn-map.md`. For Step 3, read `references/metalearn-study.md`. For Step 4, read `references/metalearn-connect.md`.
- When a source file says `WebSearch`, use the available web-search or browsing capability.
- Create and update `Learn Plan - [xxx]` in the active workspace when the source requires it.

Do not use this adapter layer to alter, omit, reorder, reconcile, or silently correct the source methodology.
