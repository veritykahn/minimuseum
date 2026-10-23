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
`question`, `coins` (`coins`: `img`, `name`, `alt`, optional `sub` and
`replica`), `painting` (`img`, `verse`), `coin` (`coin`, `back`, `alt`,
`backAlt`), `verse` (`verse`, `question`, `echo`), `levels`, `review`
(`lead`, `deeper`: indexes to mark, optional `hint`), `prayer` (`prayer`).
For reading and comparing: `chart` (`caption`, `columns`, `rows` of
`{cells, img?, replica?}`), `gallery` (`groups` of `{label, text?, items}`,
each item `{img, caption, sub?, alt, replica?, aspect?}`), `numberline`
(`line` `{alt, ticks, notes?, hops?}`, optional `worked` and `rule`; a `\n`
in the rule starts a new line) and `worked` (`examples`, each `{title, img?,
alt?, replica?, steps, answer?}`).
For picture-led steps: `pair` (two `items`, each `img`, `alt`, `label`,
optional `caption`, `fit`, `pos`, and a revealed `stamp`/`stampTone`; an
optional quoted `note`), `people` (a row of `people`: `img`, `alt`, `pos`,
`coin`, `coinAlt`, `name`, `label`; `letters` marks them A, B…) and
`person` (one `person`, `coinName`, `replica`, `story`, `ref`). A `painting`
can take `alt` and `pos` for a picture other than the Tribute painting.
`image` sets one picture large to look at closely (an illusion, an object):
`img` `{img, pos?, credit?}`, `alt`, optional `caption` and `fit`. To reveal
an answer, follow it with a second step showing the answer picture.
A timed section may sit inside `cols`.
For any exhibition: `words` (`text`, a line from the plan set large, `\n`
for new lines; optional `cite`), `artwork` (`work`, `artist`, `date`, and
either `img` — a picture `{img, pos, credit}` — or `links`, `{label, href}`
to a museum's page for a work still in copyright) and `listen` (`clips`,
each `{src, label, sub?, credit?}` from the exhibition's own audio, and an
optional `question`). A module holding several plans gives each its own
`"slug"`; a plan printed without a timing bar names its phases in
`"screen_timing"`.

A module may hold several plans (as `seeing-is-deceiving/subjects_a.py`
does): every document in `DOCS` with a `"slug"` is exported, and its
handouts are the leveled documents printed into the same folder. Where a
plan prints a part as html rather than as a section, its own lists can still
reach the screen: `"screen_materials"` and `"screen_connection"` on the plan
give the materials and the Mini Museum connection, and `"screen_sections"`
gives screens for a timed part printed as html — each `{label, after, body,
screen}`, set after the printed section named by `after`, never printed. A
`script` index counts through a section's paragraphs and then its bullets.

For the youngest classes, `"large": True` on the `LESSON` sets the task
lines larger, sets more than three coins in a row beneath the task and fewer
than three large, and the objectives block can carry `"screen": {"heading":
"I can…", "items": [...]}`, one child's line per objective, used on the
classroom cover only; the PDF and the notes keep the teacher's wording.
`"screen_hero"` gives the cover a picture other than the PDF's hero. A
step's `script` may name a string as well as an index, for a line the
screen needs that the plan says elsewhere.

Every screen should also say what the step is for and what students do:

    "purpose": "Make the turn from the coin to the person.",
    "students": ["What carries God’s image?", "Finish the sentence: …"]

`purpose` is the teacher's: the presenter view and the notes show it as
*Why this step*. `students` goes on the classroom screen, large, as *Your
task*; a `coins` or `review` screen sets the list as its main text.

Learning objectives go in the plan's blocks, near the top:

    ("objectives", {"heading": "By the end of this lesson you will be able to:",
                    "items": [(objective, the same as a question, go_deeper)],
                    "why": "Why this matters…"})

The PDF prints them under *By the end of this lesson*; the lesson's cover
screen sets them on a card, the go-deeper one in the Red level's color; a
`review` screen near the end asks them back (`students` = the questions).
The block's look comes from the document's own `css`, so plans without it,
and the handouts, print unchanged. A list of screens splits a section into several steps; each
then takes `minutes` (they must add up to the section's) and `script`, the
indexes of the paragraphs it uses. Write anything shown on screen and said
in the plan once, as a constant, as `HOOK_Q` and `PRAYER` are.

    python3 resources-src/export_lessons.py in-their-hands

writes `lib/lessons/<exhibition>/<slug>.json`; import it in
`lib/lessons/index.ts`. To offer it on the Resources page, add the
`'<grade>/<subject>'` key to `ON_SCREEN_LESSONS` in its `resource-data.ts`.
