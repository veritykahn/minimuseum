# Writing a Mini Museum resource set

How the classroom resources in `public/resources/<exhibition>/` are written
and built. The approved model is `in-their-hands/religion_5_8.py` (a lesson
plan and its Green / Yellow / Red handouts) and `in-their-hands/family.py`.
Read both, and read `build.py`, before writing anything.

## Build and check

    python3 resources-src/build.py in-their-hands <part-of-filename>

prints only the documents whose output path contains that text. Never edit
`build.py`; if a document needs a small style of its own, give the document a
`"css"` string. Count pages after every build:

    osascript -l JavaScript /private/tmp/claude-501/pdfpages.js "$PWD/public/resources/in-their-hands/<path>.pdf" /tmp/out

(prints the page count and writes `/tmp/out-p1.png`, `-p2.png`… to look at).
Look at every page of every document you make.

## Lengths

- Student handouts: **exactly 2 pages.** Trim writing lines, or tighten
  wording, until they fit; never shrink type. No near-empty last page.
- Lesson plans: 2–3 pages. If there is a third page it must be useful in its
  own right — the "Show your class" page in the religion plan is the model.

## Facts

Every fact comes from the exhibition, scripture, or the Catechism — nothing
else. The exhibition's facts are in the Mini Museum app:

- `app/exhibitions/in-their-hands/artifacts/coin-data.ts` — the eleven coins
  (title, date, material, reference, authentic or replica, verse, story)
- `app/exhibitions/in-their-hands/timeline/page.tsx` — `timelineStops`
- `app/exhibitions/in-their-hands/hands/page.tsx` — `handsCharacters`
- `app/exhibitions/in-their-hands/real-or-replica/page.tsx` — five rounds of
  genuine against fake, with how each fake was made and how to spot it
- `app/exhibitions/in-their-hands/page.tsx` — the two posters

Rules:
- Do not invent numbers, dates, weights, sizes, names, book titles, websites
  or quotations. If a figure is not in the data, do not use it.
- Quote scripture only in the wording the exhibition data uses
  (`verseText`, timeline `passage`). Otherwise cite the reference and
  paraphrase without quotation marks.
- Three coins are museum-quality REPLICAS: the Tribute Penny, the Shekel of
  Tyre and Herod Antipas. Say so wherever they appear; give their specimen
  cards `"replica": True`.
- No children's names anywhere. Student work is anonymous.
- US spelling (color, center, honor, theater).
- Pilate's coin: follow coin-data (simpulum and three bound ears of grain).

## Voice

Warm, clear and serious about the subject; never cute, never preachy. Short
sentences for children, real ideas for everyone. The exhibition is Catholic;
faith is welcome in every subject, but a Math or Art lesson is a Math or Art
lesson first.

## Pictures

Every document has a `"hero"`: a painting or portrait from
`/exhibitions/in-their-hands/timeline/` (Tissot and others, 19th century —
credit `"James Tissot (1836–1902), Brooklyn Museum"` for `*-tissot.jpg`;
for `agrippa-zurbaran.jpg` credit `"Francisco de Zurbarán (1598–1664)"`; for
`festus-surikov.jpg` credit `"Vasily Surikov (1848–1916)"`) or from
`/exhibitions/in-their-hands/Hands/` (`*-full-*.jpg` portraits, no credit).
Never use `herod-tissot.jpg` (the Massacre of the Innocents) for PreK–4.
Coins are in `/exhibitions/in-their-hands/artifacts/coins/` (`*-front.png`,
`*-back.png`; the shekel is `shekel.png`); Real or Replica pairs are in
`/exhibitions/in-their-hands/real-or-fake/`.

## Blocks you can use

`section`, `chips`, `timing`, `levels`, `connection`, `verse`, `verses`,
`refs`, `specimen`, `coin`, `coins`, `gallery`, `cards`, `task` (with
`lines`, `blocks`), `table`, `lines`, `draw`, `coindraw`, `prayer`,
`family`, `cols`, `pagebreak`, `html`. See how `religion_5_8.py` uses them.
For PreK–2 handouts set `"young": True` on the document: bigger type,
roomier lines, bigger drawing spaces.

## File names

Teacher plans and handouts go in `teachers/<grade-folder>/` (and
`teachers/grades-5-8/<subject>/` for 5–8):
`ITH_LP_<Key>.pdf`, `ITH_Handout_Green_<Key>.pdf`, `…_Yellow_…`, `…_Red_…`.
Keys: `PreK_K`, `Grades1_2`, `Grades3_4`, `Religion`, `SocialStudies`,
`Math`, `Art`.

## Lesson mode (teaching on screen)

A lesson plan can also run on the site, on the classroom projector, with a
presenter view for the teacher. The same Python is the source: give the
plan's `LESSON` a `"slug"`, and each timed section (`"Hook · 5 minutes"`…)
a `"screen"` naming what students see while the teacher reads that
section's paragraphs. `build.py` ignores `screen`, so the PDF is unchanged.

    "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q}

`phase` must be a name in the plan's `timing` bar. `show` is one of
`question`, `painting` (`img`, `verse`), `coin` (`coin`, `back`, `alt`,
`backAlt`), `verse` (`verse`, `question`, `echo`), `levels`, `prayer`
(`prayer`). A list of screens splits a section into several steps; each
then takes `minutes` (they must add up to the section's) and `script`, the
indexes of the paragraphs it uses. Write anything shown on screen and said
in the plan once, as a constant, as `HOOK_Q` and `PRAYER` are.

    python3 resources-src/export_lessons.py in-their-hands

writes `lib/lessons/<exhibition>/<slug>.json`; import it in
`lib/lessons/index.ts`. To offer it on the Resources page, add the
`'<grade>/<subject>'` key to `ON_SCREEN_LESSONS` in its `resource-data.ts`.
