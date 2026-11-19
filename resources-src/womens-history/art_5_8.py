"""Grades 5–8 · Art · "A Life in Shapes"
Hilma af Klint's The Ten Largest, No. 1, Childhood (1907), the painting on
poster 1, read by its shapes, lines and colors; then poster 2's design, which
tells Violet Dina Want's life in lettering, typewriter text and photographs
set as strips of film negative; and the Violet's Life room's keepsakes, one
drawn object for each stop. Every fact about af Klint is poster 1's own
(womensHistory.ts): her birth in 1862, the series of 1907, her death in 1944
and that she never showed her abstract paintings in an exhibition. Nothing
else is claimed about her or the series; what the painting means is left
to students."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (AF_KLINT, AF_KLINT_ALT, AF_KLINT_CREDIT, POSTER1, POSTER2, POSTER1_ALT, POSTER2_ALT, DEEPER,
                     OBJ_CSS, PIC_CSS, THUMBS, TIMING, review, md, quote)
from _keepsakes import row

DIR = "teachers/grades-5-8/art/"
TITLE = "A Life in Shapes"
SUB = "Grades 5–8 · Art · Abstraction, design and a life"
HERO = {"img": AF_KLINT, "pos": "center 38%", "credit": AF_KLINT_CREDIT}

AF_KLINT_TEXT = ("The painting is by Hilma af Klint, a Swedish artist born in 1862. Between August and December 1907 she painted a series of huge works, "
                 "made of ovals, circles and curling lines in bright colors. By the time she died in 1944, she had never shown any of her abstract paintings in an exhibition.")
WORK = "The Ten Largest, No. 1, Childhood"
HOOK_Q = "What do you see? What could a painting like this be about?"
LAST_Q = "If one painting had to stand for your childhood, with no faces and no words, what would be in it?"

KEEPSAKES = [("house", "<b>House</b>Fulham, 1907"), ("certificate", "<b>Certificate</b>Home and school"),
             ("machine", "<b>Sewing machine</b>The factory"), ("rings", "<b>Rings</b>Marriage, 1928"),
             ("coat", "<b>Coat</b>Family"), ("piano", "<b>Piano</b>Music"), ("rose", "<b>Rose</b>Essex")]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe an abstract painting by its shapes, lines and colors",
     "describe an abstract painting by its shapes, lines and colors?", False),
    ("explain how a designer told a life in a poster, through lettering, text and photographs",
     "explain how a designer told a life in a poster?", False),
    ("plan and make an abstract work that stands for one part of a life",
     "make an abstract work that stands for one part of a life?", False),
    ("explain how an artist can be overlooked, and what we lose when one is",
     "explain how an artist can be overlooked, and what we lose?", True)],
  "why": "Art does not have to show a face to be about a person. Learning to read shapes and colors, and to use them on purpose, gives you a way to say what words and photographs can’t."}

ELEMENTS = {"caption": "Reading Childhood by its elements", "columns": ["Element", "Look for", "Ask"],
            "rows": [{"cells": ["Shape", "Ovals, circles, petal shapes, a ring", "Which shape repeats most? Where?"]},
                     {"cells": ["Line", "Curling, looping lines", "What do the lines remind you of?"]},
                     {"cells": ["Color", "Bright colors on a deep blue ground", "Which color pulls your eye first?"]},
                     {"cells": ["Title", WORK, "Does the title change what you see?"]}]}

CSS = PIC_CSS + """
.pb { break-after: auto; height: 0; margin: 0; } .pb + * { break-before: page; }
.art { display: grid; grid-template-columns: 150pt 1fr; gap: 14pt; align-items: start; margin: 4pt 0 8pt; break-inside: avoid; }
.art img { width: 150pt; height: 201pt; object-fit: cover; border: 1pt solid #1d1c1a; border-radius: 2pt; display: block; }
.art .cap { font: 400 7.4pt/1.35 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
.check { list-style: none; padding: 0; margin: 4pt 0 6pt; font-size: 9.4pt; }
.check li { margin: 0 0 6pt; }
.check li::before { content: ""; display: inline-block; width: 10pt; height: 10pt; border: 1pt solid #1d1c1a; background: #fff; margin-right: 8pt; vertical-align: -2pt; }
.panel { background: rgba(255,255,255,.62); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 8pt 11pt 4pt; margin: 4pt 0 9pt; font-size: 9.4pt; line-height: 1.42; break-inside: avoid; }
.panel p { margin: 0 0 5pt; }
.twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; align-items: start; }
.posters { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; margin: 4pt 0 10pt; break-inside: avoid; }
.posters img { width: 100%; height: 250pt; object-fit: contain; display: block; }
.posters figcaption { font: 400 7.6pt/1.35 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
.q { margin: 0 0 7pt; } .q i { display: inline-block; width: 150pt; border-bottom: 1pt solid #1d1c1a; height: 12pt; vertical-align: -2pt; }
"""

def art(inner, h=201):
    return (f'<div class="art"><div><img src="{AF_KLINT}" alt="" style="height:{h}pt"><p class="cap">{md(AF_KLINT_CREDIT)}</p></div><div>{inner}</div></div>')

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "a-life-in-shapes",
  "out": DIR + "WH_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO,
  "css": CSS + OBJ_CSS + "table.fill td { padding: 4pt 6pt 5pt 0; }",
  "blocks": [
    ("timing", [("Hook", 5, TIMING["hook"]), ("Look", 12, TIMING["look"]), ("Make", 23, TIMING["activity"]), ("Share", 5, TIMING["close"])]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students look closely at the painting on poster 1, Hilma af Klint’s *" + WORK + "* (1907), and describe it by its shapes, lines and colors before they learn its title. They learn that af Klint never showed her abstract paintings in an exhibition, and connect that to poster 1’s words about overlooked artists. They then read how poster 2’s designer told Violet Dina Want’s life, and make an abstract work of their own that stands for one part of a life."]}),
    ("cols", [
      [("section", {"label": "Skills and themes", "list": [
        "**Responding** — describing and interpreting abstract art by its elements",
        "**Creating** — using shape, line and color on purpose; an artist’s statement",
        "**Connecting** — art and memory; whose art gets seen"]})],
      [("section", {"label": "Materials needed", "list": [
        "The painting and both posters on a screen, or page 3 of this plan",
        "Colored pencils, crayons or paint; paper",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Look first",
      "screen": {"phase": "Hook", "show": "artwork", "work": WORK, "artist": "Hilma af Klint", "date": "1907",
                 "img": AF_KLINT, "alt": AF_KLINT_ALT,
                 "purpose": "Look before knowing: let the shapes and colors work before the title does.",
                 "students": [HOOK_Q, "Which shape or color do you notice first?"]},
      "body": [f"Project the painting for a full minute, with no title. Ask: *“{HOOK_Q}”* Take every answer. Then give the title: *{WORK}*. Ask whether it changes what they see. One more fact to hold on to: af Klint painted it in **1907**, the year Violet Dina Want, the woman on poster 2, was born."]}),
    ("section", {"label": "Look and teach · 12 minutes", "title": "Two ways to tell a life",
      "screen": [
        {"phase": "Look", "minutes": 4, "script": [0], "title": "Shape, line, color", "show": "chart", **ELEMENTS,
         "purpose": "Give students the words to describe what they saw.",
         "students": ["Name one shape, one line and one color, and where each is."]},
        {"phase": "Look", "minutes": 3, "script": [1], "title": "Hilma af Klint", "show": "words", "text": AF_KLINT_TEXT,
         "cite": "Poster 1",
         "purpose": "Meet the artist, and the fact that she never showed this kind of work.",
         "students": ["Why might an artist not show her work?", "What do we lose when an artist is overlooked?"]},
        {"phase": "Look", "minutes": 5, "script": [2], "title": "A life in a poster", "show": "image", "img": {"img": POSTER2}, "fit": "contain",
         "alt": POSTER2_ALT, "caption": "Poster 2 · Biography of a Working Class Woman",
         "purpose": "See how a designer told one woman’s life with lettering, text and photographs.",
         "students": ["Why set the photographs as strips of film negative?", "Why typewriter text?"]}],
      "body": [
        "**The elements.** Name what students found: ovals and circles, petal shapes in a ring, curling lines that loop like handwriting, bright colors on a deep blue ground, a row of small circles along the foot. None of it is a picture of a child. Ask how a painting with no child in it can still be called *Childhood*.",
        "**The artist.** Read poster 1’s words: *“" + AF_KLINT_TEXT + "”* Poster 1 also says women’s lives are understood *“not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.”* The exhibition does not say why she kept her work back; let students ask.",
        "**A life in a poster.** Show poster 2. Its designer tells Violet’s life in decorative lettering for her name, her biography in typewriter text, and four family photographs set as strips of film negative. The *Violet’s Life* room goes further: it gives each part of her life a small drawn keepsake, a house, a sewing machine, a coat, a piano, a rose. One woman’s life, told three ways: photographs, words and symbols."]}),
    ("section", {"label": "Make · 23 minutes",
      "screen": {"phase": "Make", "show": "levels", "title": "Choose a handout",
                 "purpose": "Look closely, then make an abstract work for a part of a life, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three look closely at af Klint’s painting, then make a work of your own."]},
      "body": ["Students choose a handout. All three look closely at the painting, then make an abstract work for one part of a life."]}),
    ("levels", {
      "green": "Find shapes, lines and colors in af Klint’s painting with a checklist, then choose three shapes and three colors for their own childhood and make a small abstract work with them.",
      "yellow": "Describe the painting element by element, compare it with poster 2’s photographs, then choose one of Violet’s keepsakes and make an abstract panel for that part of her life, with an artist’s statement.",
      "red": "Ask how an artist can be overlooked, analyze poster 2’s design choices, then design a poster panel for a woman in their own family or community: an abstract painting, her name in lettering of their own, and three keepsake symbols, with a rationale."}),
    ("section", {"label": "Share · 5 minutes", "title": "A gallery with no faces",
      "screen": [
        {"phase": "Share", "minutes": 2, "script": [0], "title": "A gallery with no faces", "show": "question", "question": LAST_Q,
         "purpose": "Read each other’s work by its elements before hearing its meaning.",
         "students": ["Guess a classmate’s meaning from their shapes and colors.", "Then let them tell you."]},
        review(OBJECTIVES, 3, [1], phase="Share", hint=THUMBS)],
      "body": [f"Lay the work out as a gallery. Each student guesses one classmate’s meaning from the shapes and colors alone, then hears it. Close with: *“{LAST_Q}”*",
               "Ask the objectives back: *“Can you now…?”* Thumbs up, sideways or down; ask a Red Level student to answer the last."]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Say only what is known.** Poster 1 gives af Klint’s dates, the months of 1907 and that she never showed her abstract paintings. It does not say why, or what the paintings mean. Let interpretation be the students’.",
        "**Every family is different.** For the Red panel, *a woman who is like family to you* counts."]})],
      [("section", {"label": "Assessment notes", "list": [
        "**Green:** shapes, lines and colors named and placed; three choices for their own childhood, used.",
        "**Yellow:** each element described with where it is; the keepsake panel uses shape and color for an idea, and the statement says how.",
        "**Red:** the panel joins abstraction, lettering and symbols, and the rationale explains each choice.",
        "**Exit ticket:** *name one choice in your work and what it stands for.*"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The painting and the posters",
      "body": ["Project or print this page for *Look and teach*. Look at the painting first, without its title."]}),
    ("html", '<div class="posters"><figure><img src="' + AF_KLINT + '" alt=""><figcaption>' + md(AF_KLINT_CREDIT) + '</figcaption></figure>'
             '<figure><img src="' + POSTER2 + '" alt=""><figcaption>Poster 2 · Biography of a Working Class Woman: decorative lettering, typewriter text and four photographs set as strips of film negative</figcaption></figure></div>'),
    ("html", '<p class="label">The keepsakes of the Violet’s Life room</p>' + row(KEEPSAKES, 40).replace("--n:7", "--n:7")),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Cover the title. What do you think the painting is about? Now read it: *Childhood*. What changes?",
      "Why might a museum put an abstract painting on a poster about women’s history?",
      "Poster 2 shows Violet in photographs. What could an abstract painting of her life show that a photograph can’t?",
      "Which artists, inventors or writers might be overlooked today?"]}),
    ("connection", ["**In the exhibition,** poster 1 carries af Klint’s painting; poster 2 tells Violet’s life. **Online,** the *Violet’s Life* room gives each part of her life a keepsake."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In 1907, a Swedish artist named Hilma af Klint painted a series of huge works of ovals, circles and curling lines in bright colors. She never showed her abstract paintings in an exhibition. In the same year, in London, Violet Dina Want was born. This exhibition puts them side by side: a painting called *Childhood*, and the story of an ordinary woman’s life."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Look closely",
            "blocks": [("html", art('<p>Check every thing you can find in the painting.</p><ul class="check">'
                        + "".join(f"<li>{t}</li>" for t in ["circles", "ovals", "curling lines", "petal shapes in a ring", "a row of small circles", "a deep blue background", "a person’s face"])
                        + "</ul>", 160))]}),
  ("task", {"label": "Part 2", "title": "The title",
            "body": ["The painting is called *" + WORK + "*. There is no child in it. Why might af Klint have called it *Childhood*? Write one idea."], "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Your childhood in shapes",
            "body": ["Choose three shapes and three colors that feel like your childhood. Write why."]}),
  ("table", {"head": ["My choice", "Why I chose it"], "rows": [["Shape:", ""], ["Shape:", ""], ["Shape:", ""], ["Color:", ""], ["Color:", ""], ["Color:", ""]]}),
  ("task", {"label": "Part 4", "title": "Make it",
            "blocks": [("draw", "My childhood, in shapes and colors")]}),
  ("family", ["Show your family your work. Ask: what shapes and colors would you choose for your childhood?"]),
], "table.fill td:first-child { width: 26%; font-weight: 500; } table.fill td { padding-top: 6pt; padding-bottom: 10pt; } .drawbox { height: 275pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Read the painting",
            "blocks": [("html", art('<p>Describe each element. Say <b>what</b> you see and <b>where</b>, then what it makes you think of.</p>'
                                    '<table class="fill"><thead><tr><th>Element</th><th>What and where</th><th>It makes me think of</th></tr></thead><tbody>'
                                    + "".join(f"<tr><td>{e}</td><td></td><td></td></tr>" for e in ["Shape", "Line", "Color"]) + "</tbody></table>", 150))]}),
  ("task", {"label": "Part 2", "title": "Two ways to show a life",
            "body": ["Poster 2 shows Violet’s life in **photographs**. Af Klint’s *Childhood* shows a part of life in **shapes and colors**. What can each do that the other can’t?"], "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "A panel for Violet",
            "blocks": [("html", "<p>The <i>Violet’s Life</i> room gives each part of her life a keepsake. Circle <b>one</b>. Make an abstract panel for that part of her life: no faces and no words, only shapes, lines and colors.</p>"
                        + row(KEEPSAKES, 36)),
                       ("draw", "My panel")]}),
  ("task", {"label": "Part 4", "title": "Artist’s statement",
            "body": ["Which part of Violet’s life did you choose? Name one shape and one color you used, and what each stands for."], "lines": 4}),
  ("family", ["Ask an older person in your family: what object would you choose to stand for your childhood?"]),
], "table.fill td:first-child { width: 16%; font-weight: 500; } table.fill td { padding-top: 6pt; padding-bottom: 24pt; } .drawbox { height: 240pt; } .ks { --n: 7 !important; gap: 4pt; }")

RED = handout("red", "WH_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "An overlooked artist",
            "blocks": [("html", art('<div class="panel"><p>' + md(AF_KLINT_TEXT) + '</p></div><p>Poster 1 says women’s lives help us understand the past <i>“not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.”</i></p>', 156))],
            "body": ["The exhibition does not say why af Klint never showed these paintings. Write **two** questions you would ask to find out, and what we might lose when an artist’s work goes unseen."], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Read the designer’s choices",
            "body": ["Poster 2 sets Violet’s name in decorative lettering, her biography in typewriter text, and her photographs as strips of film negative. Choose **two** of these. What does each choice make you feel or think about her life?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Design a panel for a woman you know",
            "blocks": [("html", "<p>Design a poster panel for a woman in your family or community. Join the three ways of telling a life: an <b>abstract painting</b> for one part of her life; her <b>name</b> in lettering you design; and <b>three keepsakes</b>, small drawn objects that stand for her.</p>"),
                       ("draw", "My panel")]}),
  ("task", {"label": "Part 4", "title": "Rationale",
            "body": ["Explain your choices: the shapes and colors, the lettering, and each keepsake. What does your panel say about her that a photograph couldn’t?"], "lines": 4}),
  ("family", ["Show the woman you chose your panel. Ask her which keepsake she would have chosen."]),
], ".drawbox { height: 175pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
