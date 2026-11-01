# Converting an existing resource set to the new design

The Seeing is Deceiving and Harlem Renaissance resources were made before the
branded template. Converting them means re-setting each document in the new
design **with its own words** — this is a redesign, not a rewrite.

Read first: `WRITING.md`, `build.py`, and the approved In Their Hands models
`in-their-hands/religion_5_8.py` (a plan and its three handouts),
`in-their-hands/family.py` and `in-their-hands/guides.py`.

## Source text

The text of every existing PDF has been extracted to
`/private/tmp/claude-501/src-text/<exhibition>/<same path>.pdf.txt`, page by
page. You can also look at an original:
`osascript -l JavaScript /private/tmp/claude-501/pdfpages.js "<abs pdf path>" /tmp/orig`
writes `/tmp/orig-p1.png`… to Read.

## What stays

- **Every word of substance.** Objectives, standards, materials, each lesson
  step with its timing, teacher scripts, activities, questions, scripture
  references, notes, prayers. Keep the original's order and headings.
- **The output path and file name, exactly** — the Resources pages link to
  them. A document's `"out"` is its path relative to
  `public/resources/<exhibition>/`, e.g.
  `teachers/grades-5-8/religion/HR_LP_Religion.pdf` or
  `teachers/grades-5-8/math/Lesson Plan_ Geometry of Perspective (Math 5-8) - Teacher Guide.pdf`.
- The level of a handout (green, yellow, red), its grade and subject.

## What changes

- Layout: masthead or hero, timing bar, sections, `levels`, `task`s with
  numbered parts, `table`s with writing space, `connection`, `prayer`,
  `family` — use the blocks the way the models do.
- `minimuseumproject.com` becomes `minimuseumproject.org` everywhere.
- US spelling (organise → organize, colour → color, centre → center,
  marginalised → marginalized).
- Drop emoji (🟢🟡🔴🏛 and the like); the level colors and labels replace them.
- Fix text-extraction damage (split words, stray letters) and genuine typos.
- "© 2025" is not copied — the footer is generated.

## What you must not do

- Add new facts, activities, quotations, book titles or claims.
- Cut content to make a page count. If a handout overflows, trim blank
  writing lines or tighten spacing — never delete the original's prompts.
- Change scripture wording that the original quotes.

## Length

Match the original's page count where you can; one page more is acceptable
only if the original was dense. No near-empty last page. Student handouts
should end on a full page.

## Pictures

Every document gets a `"hero"` from the exhibition's own folder in
`public/exhibitions/`:

- **Seeing is Deceiving** (`/exhibitions/seeing/`): `poster1.jpg`,
  `poster2.jpg`, and the illusion images (`balcony.jpg`, `rubins-vase.jpg`,
  `fraser-spiral.jpg`, `rotating-snakes.jpg`,
  `ponzo-corridor.jpg`, `impossible-trident.jpg`, `waves.jpg`…). Choose one
  that suits the document (Ponzo for a math lesson on perspective, Rubin's
  vase for the parent guide, and so on). No credit line.
- **Harlem Renaissance** (`/exhibitions/harlem/`): `poster1.jpg`,
  `poster2.jpg`, `poster2-photograph.jpg`, and the Great Migration images in
  `/exhibitions/harlem/images/migration/`. Look at an image before you use
  it. **Do not use `aspiration.jpg` or `creation.jpg`** (Aaron Douglas works
  still in copyright). No credit line unless the image itself names one.

Use `"pos"` to choose which part of a tall poster shows (e.g.
`"center 30%"`). Check the title stays readable over it.

## Build and check

    python3 resources-src/build.py <exhibition> <part-of-filename>

Then count pages and look at every page:

    osascript -l JavaScript /private/tmp/claude-501/pdfpages.js "<abs pdf path>" /tmp/<name>

## Module files

Write your documents in `resources-src/<exhibition>/<your_module>.py`, with
`DOCS = [...]`. Only edit your own module.
