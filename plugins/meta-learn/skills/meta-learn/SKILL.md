---
name: meta-learn
description: "Use Fan's four-step learning system to coach a user through positioning, knowledge mapping, deep understanding, and integration. Trigger whenever the user wants to learn, study, understand, or master a topic, asks for systematic teaching, resumes an existing learning plan, or explicitly requests meta-learn step1, step2, step3, or step4."
---

# MetaLearn

Use the bundled Markdown files as the canonical instructions. Preserve and follow their content as written; do not replace them with summaries, rewritten protocols, or optimized variants.

## Load the source instructions

Always read `references/metalearn-start.md` first.

Then select the requested step:

- For a new learning request or `step1`, read `references/metalearn-step1.md` and execute Step 1.
- For `step2`, read `references/metalearn-step2.md` and execute Step 2.
- For `step3`, read `references/metalearn-step3.md` in full before the first module and reread it before every new module, as required by the source.
- For `step4`, read `references/metalearn-step4.md` and execute Step 4.

Accept equivalent forms such as `step 1`, `stage 1`, `第一步`, and the Chinese step names. When the user explicitly requests a step, enter that step directly. Ask only for context that the selected source instructions require.

## Compatibility adapters

These adapters are required only because the original files were written as separate skills and may name tools differently:

- When a source file says to load `metalearn-stepN` or `learn-stepN`, read the corresponding `references/metalearn-stepN.md` file in this skill.
- When a source file says `WebSearch`, use the available web-search or browsing capability.
- Create and update `Learn Plan - [xxx]` in the active workspace when the source requires it.

Do not use this adapter layer to alter, omit, reorder, reconcile, or silently correct the source methodology.
