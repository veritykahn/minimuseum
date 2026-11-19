"""Grades 5–8 · Art · "Stories on the Wall"
How Egyptian tomb painters told a story on a wall: rows, a border, the
ground colour, one man shown twice, and small details that carry meaning,
seen in The Met's facsimiles of five walls at Thebes, then a studio task:
a two-row wall of the student's own, with one amulet symbol chosen for its
meaning. Facts follow app/exhibitions/egypt/tomb/scenes.ts (each wall's
note, details, alt text and credit; TOMB_NOTES.copies) and amulet/amulets.ts
(the symbols' meanings; faience).

The lesson names what students can see (two rows, a border of water, Menna
twice) and says why only where the exhibition does (the fish, the
crocodile, the cat, Ipuy's yellow ground). Belief is taught as belief."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (WALLS, ROOM, OBJ_CSS, HIERO_CSS, HOOK, TEACH, ACT, CLOSE, g, wall_hero, wall_crop, review, look_back_say, md)

DIR = "teachers/grades-5-8/art/"
TITLE = "Stories on the Wall"
SUB = "Grades 5–8 · Art · How Egyptian tomb painters told a story"
PLAN_HERO = wall_hero("wine", "center 40%")
HERO = wall_hero("marshes", "center 30%")

# the walls' own words (scenes.ts)
COPIES = "These walls are copies: paintings in tempera on paper, most of them full size, made in the 1900s by artists working for The Met, of paintings in tombs at Thebes."
GROUND = "Vineyards were usually painted on a grey background, until the time of the kings called Ramesses, when painters began to use yellow, like this."
MARSH_NOTE = "Menna fishes and hunts birds in the papyrus marshes, with his family crowded into his papyrus boat. The marsh teems with birds, fish, a crocodile and a small cat."
DETAILS = [
  ("Two big fish", "The marshes", "With a long spear, Menna catches two large fish, most likely tilapia. Tilapia carry their young in their mouths, so they were linked with new life."),
  ("The crocodile", "The marshes", "By defeating the wild creatures of the marsh, Menna was helping to keep the Egyptian world in order."),
  ("A cat with a knife", "Sennedjem’s tomb", "In chapter 17 of the Book of the Dead, the sun god Ra appears as a big tomcat who kills the snake of evil."),
  ("A couple reaping", "The fields", "Here in the next world, the reaping is done not by farm workers but by Sennedjem and his wife themselves."),
  ("A knotted rope", "The harvest", "Two surveyors measure the field of grain with a rope knotted at regular spaces. Menna was in charge of the government’s lands."),
]
# amulet/amulets.ts, shortened from the meanings (the heart is for the dead, and left out of the studio)
SYMBOLS = [("S34", "Ankh", "a symbol of life"),
           ("D10", "Wedjat eye", "the healed eye of Horus: renewal and protection"),
           ("R11", "Djed pillar", "permanence"),
           ("L1", "Scarab beetle", "linked with the sun crossing the sky; rebirth"),
           ("I12", "Uraeus cobra", "protection, worn on the forehead"),
           ("M9", "Lotus flower", "blooms by day and closes at night, like the sun: rebirth")]

def P(t):
    return ("html", f"<p>{md(t)}</p>")

def note(t, cite):
    return ("html", f'<blockquote class="note">{md(t)}<small>{cite}</small></blockquote>')

def mennas(width=150):
    return ("html", '<div class="pair">'
            f'<figure>{wall_crop("marshes", 230, 90, 520, 720, width)}<figcaption>Left side</figcaption></figure>'
            f'<figure>{wall_crop("marshes", 1100, 90, 520, 720, width)}<figcaption>Right side</figcaption></figure></div>')

def details_pics(width=120):
    return ("html", '<div class="pair">'
            f'<figure>{wall_crop("marshes", 770, 590, 240, 200, width)}<figcaption>A</figcaption></figure>'
            f'<figure>{wall_crop("marshes", 880, 170, 230, 200, width)}<figcaption>B</figcaption></figure>'
            f'<figure>{wall_crop("marshes", 640, 790, 360, 160, width * 1.8)}<figcaption>C</figcaption></figure></div>')

def symbols_html(meanings=True):
    return ("html", '<div class="syms">' + "".join(
        f'<div><span class="hg">{g(c)}</span><b>{n}</b>{"<span>" + md(m) + "</span>" if meanings else ""}</div>'
        for c, n, m in SYMBOLS) + "</div>")

def wall_template(h=230, label=""):
    return ("html", f'<div class="tw" style="height:{h}pt"><div class="row"><span>Row 1</span></div>'
                    f'<div class="row"><span>Row 2</span></div><i>{label or "Border: your symbol"}</i></div>')

def thumbs(keys=("harvest", "fields", "wine"), height=100, caps=None):
    caps = caps or {k: WALLS[k]["title"] for k in keys}
    return ("html", '<div class="thumbs">' + "".join(
        f'<figure style="width:{height * WALLS[k]["w"] / WALLS[k]["h"]:.1f}pt"><img src="{WALLS[k]["img"]}" alt="" style="height:{height}pt;width:100%">'
        f'<figcaption>{caps[k]}</figcaption></figure>' for k in keys) + "</div>")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe how Egyptian painters organized a wall: rows, a border and the background color",
     "describe how a painter organized an Egyptian wall?", False),
    ("explain how small details carried meaning, and how one man could be shown twice",
     "explain what a detail meant, and why Menna appears twice?", False),
    ("explain what a facsimile is and why museums make them",
     "explain what a facsimile is?", False),
    ("design a two-row wall of your own, choosing a symbol for its meaning",
     "design a two-row wall, and explain the symbol you chose?", True)],
  "why": "These paintings were made more than three thousand years ago, yet we can still read them. Looking at how a painter organized a wall, and why, helps students make choices on purpose in their own work."}

CSS = OBJ_CSS + HIERO_CSS + """
.rl { height: 21pt; border-bottom: .6pt solid #9a968a; }
.side { display: flex; gap: 12pt; align-items: flex-start; break-inside: avoid; } .side > div:last-child { flex: 1; }
.match { list-style: none; padding: 0; margin: 4pt 0 6pt; } .match li { display: grid; grid-template-columns: 26pt 1fr; align-items: center; font-size: 9.5pt; margin-bottom: 5pt; }
.match li::before { content: ""; width: 16pt; height: 16pt; border: .8pt solid #1d1c1a; border-radius: 2pt; }
.pair { display: flex; gap: 10pt; align-items: flex-end; margin: 4pt 0 6pt; break-inside: avoid; }
.pair figure, .thumbs figure { margin: 0; }
.pair figcaption, .thumbs figcaption { font: 500 7.5pt 'Outfit'; letter-spacing: .08em; color: #5b5a55; margin-top: 2pt; }
.thumbs { display: flex; gap: 10pt; align-items: flex-end; margin: 4pt 0 8pt; break-inside: avoid; }
.thumbs img { display: block; border-radius: 3pt; border: .8pt solid #1d1c1a; }
.note { font: italic 400 12pt/1.4 'Cormorant Garamond', serif; border-left: 2.5pt solid var(--accent); padding: 3pt 0 3pt 12pt; margin: 4pt 0 6pt; break-inside: avoid; }
.note small { display: block; font: 400 7.5pt 'Outfit'; letter-spacing: .1em; text-transform: uppercase; color: #5b5a55; font-style: normal; margin-top: 3pt; }
.syms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5pt 8pt; margin: 4pt 0 6pt; break-inside: avoid; }
.syms div { display: grid; grid-template-columns: 40pt 1fr; grid-template-rows: auto auto; align-items: center; border: .8pt solid #d8d0b8; border-radius: 3pt; padding: 3pt 6pt 3pt 2pt; font-size: 8.5pt; line-height: 1.25; }
.syms .hg { grid-row: span 2; font-size: 27pt; line-height: 1; text-align: center; }
.syms b { font: 600 10.5pt 'Cormorant Garamond', serif; }
table.det { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 4pt 0 8pt; }
table.det th { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: .8pt solid #1d1c1a; padding: 3pt 5pt; }
table.det td { border-bottom: .5pt solid #d8d0b8; padding: 3.5pt 5pt; vertical-align: top; }
table.det td:first-child { font: 600 11pt 'Cormorant Garamond', serif; white-space: nowrap; } table.det td:nth-child(2) { white-space: nowrap; color: #5b5a55; }
.tw { position: relative; display: flex; flex-direction: column; padding: 14pt; border: 1pt solid #1d1c1a; border-radius: 2pt; margin: 6pt 0 8pt; break-inside: avoid;
  background: repeating-linear-gradient(135deg, rgba(29,28,26,.13) 0 1pt, transparent 1pt 6pt); }
.tw .row { flex: 1; border: .8pt solid #1d1c1a; border-top: 0; position: relative; background: #fff; }
.tw .row:first-child { border-top: .8pt solid #1d1c1a; }
.tw .row span { position: absolute; left: 4pt; top: 3pt; font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #8a877e; }
.tw i { position: absolute; right: 16pt; bottom: 3pt; font: 500 7pt 'Outfit'; font-style: normal; letter-spacing: .1em; text-transform: uppercase; color: #8a877e; }
"""

# ── lesson mode ────────────────────────────────────────────────────────
M = WALLS["marshes"]
MARSH_ART = {"work": M["title"], "artist": "Nina de Garis Davies, a copy (1924) of a painting in the tomb of Menna, Thebes",
             "date": "about 1396–1347 BCE", "img": {"img": M["img"], "pos": "center", "credit": M["credit"]},
             "alt": "A tomb painting: Menna stands twice in a papyrus boat among tall papyrus, on one side raising a throwstick at birds and on the other spearing fish, with his family beside him and water full of fish and birds below"}
def item(k, cap, alt):
    w = WALLS[k]
    return {"img": w["img"], "caption": cap, "alt": alt, "aspect": round(w["w"] / w["h"], 2)}
WAYS = {"groups": [
  {"label": "Two rows", "text": "Harvest scenes, tomb of Menna, about 1396–1347 BCE. Above, surveyors in the grain; below, the chariot, the grain and the scribes.",
   "items": [item("harvest", "The harvest", "A tomb painting in two rows: above, men walk through a field of ripe grain holding a long rope; below, a horse and chariot wait while workers heap grain and scribes sit writing")]},
  {"label": "Rows inside a border", "text": "Sennedjem and Iineferti in the Fields of Iaru, tomb of Sennedjem, about 1300–1224 BCE. The fields of the next world, ringed by water.",
   "items": [item("fields", "The fields", "A tomb painting of fields bordered by blue water: a man and a woman cut grain, pull flax and plough with a pair of spotted cows, beneath a row of seated gods, with rows of date palms and flowers below")]},
  {"label": "One scene, a yellow ground", "text": "Winemaking, tomb of Ipuy, reign of Ramesses II, about 1290–1224 BCE. From picking the grapes to treading them.",
   "items": [item("wine", "The vineyard", "A tomb painting on a yellow ground: men pick bunches of dark grapes from a leafy vine into baskets, while others, holding ropes, tread grapes in a vat")]}]}
DET_CHART = {"caption": "Details that carry meaning", "columns": ["Detail", "Wall", "What it tells us"],
             "rows": [{"cells": [d, w, t]} for d, w, t in DETAILS]}

LESSON = {
  "slug": "stories-on-the-wall",
  "out": DIR + "EGY_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": PLAN_HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Studio", 20, ACT), ("Debrief", 7, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will look closely at copies of five tomb paintings from Thebes, made for The Met in the 1900s. They will find how the painters organized a wall (rows, a border, the background color), how one man is shown twice, and how small details carried meaning. Then they will design a two-row wall of their own, with one amulet symbol chosen for what it meant."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Responding** — describe, analyze and interpret a work of art",
        "**Creating** — plan and make a composition with a purpose",
        "**Connecting** — art as a record of a culture’s life and beliefs",
        "**Vocabulary** — composition, register (a row), ground, symbol, facsimile"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: three walls, and the symbols",
      "Pencils, colored pencils (yellow, ochre, red, blue, green, black); differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Who is in the boat?",
      "screen": {"phase": "Hook", "show": "artwork", **MARSH_ART,
                 "purpose": "Look for a full minute before anyone explains, and find the man who appears twice.",
                 "students": ["Count the people. Is anyone there twice?", "What is each of the two big men doing?"]},
      "body": ["Show the marshes wall and say nothing for a minute. Then ask students to count the people, and whether anyone appears twice. Someone will spot it: the tall man is there twice, raising a throwstick at birds on one side and spearing fish on the other. Only then name him: Menna. *“" + MARSH_NOTE + "”* Ask why a painter might show one man twice on one wall, and take ideas without settling it."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "How a wall is organized",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Three ways to fill a wall", "show": "gallery", **WAYS,
         "purpose": "Compare how three painters organized a wall: two rows, rows in a border, one scene.",
         "students": ["How many rows does each wall have?", "What color is behind the figures?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Details that carry meaning", "show": "chart", **DET_CHART,
         "purpose": "Learn what a few small details meant to the Egyptians.",
         "students": ["Which detail surprised you?", "Which detail is about the next world?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "These walls are copies", "show": "words",
         "text": COPIES + "\n" + GROUND, "cite": "Tomb Explorer, after The Met",
         "purpose": "Learn what a facsimile is, and see one choice painters changed over time.",
         "students": ["Why would a museum make a full-size copy?", "Why might a painter change the background color?"]}],
      "body": ["Show the three walls side by side. Students describe, then name: the harvest is in **two rows** (an art historian’s word is **register**); Sennedjem’s fields stack rows inside a **border of blue water**; Ipuy’s vineyard is one scene on a **yellow ground**. Ask what each choice does for a viewer.",
               "Then the details. A painting could carry meaning in small things: the tilapia Menna spears were linked with new life, because they carry their young in their mouths; by defeating the wild creatures of the marsh, Menna was helping to keep the Egyptian world in order. In Sennedjem’s tomb a cat holding a knife is not a pet but a god: the sun god Ra, as a big tomcat who kills the snake of evil.",
               "Last, the walls themselves. They are **facsimiles**: careful copies, in tempera on paper, most of them full size, made for The Met in the 1900s. Read Ipuy’s note: vineyards were usually painted on grey until the time of the kings called Ramesses, when painters began to use yellow."]}),
    ("section", {"label": "Studio · 20 minutes",
      "screen": {"phase": "Studio", "show": "levels", "title": "Design your own wall",
                 "purpose": "Look closely at Menna’s wall, then design a two-row wall of your own with one symbol, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red.", "All three end with your own two-row wall and one symbol."]},
      "body": ["Students choose a handout. All three look closely at Menna’s wall first, then design a two-row wall about a day of their own, with one amulet symbol worked in for what it meant."]}),
    ("levels", {
      "green": "Find what Menna does on each side, match three details to what they tell us, choose a symbol, and draw a two-row wall with a guide for each row.",
      "yellow": "Compare the harvest’s two rows with Ipuy’s one scene, explain the yellow ground, plan each row, the symbol and the ground color, then draw.",
      "red": "Analyze how Menna’s wall is balanced around the papyrus, weigh what a facsimile can and cannot tell us, and design a wall that shows one person twice, with annotations."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Read a classmate’s wall",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Read a classmate’s wall", "show": "question",
         "question": "Swap walls with a partner. Read their wall like an Egyptologist: what does each row show, and what does their symbol mean?",
         "purpose": "Read a classmate’s design the way students read Menna’s wall.",
         "students": ["What does each row show?", "What did your partner’s symbol mean, and why did they choose it?"]},
        review(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Partners swap walls and read each other’s, row by row, then name the symbol and guess why it was chosen before the artist explains. Two or three pairs share one choice that told them the most.",
               look_back_say(OBJECTIVES, "a Red Level student, who explains why their wall shows one person twice")]}),
    ("cols", [[("section", {"label": "Answer notes and assessment", "list": [
      "**Menna twice:** throwstick at the birds on the left, spear at the fish on the right.",
      "**Details:** tilapia, new life; the crocodile, keeping the world in order; the cat, the sun god Ra.",
      "**Yellow ground:** vineyards were usually grey until the time of the kings called Ramesses.",
      "**Facsimile:** a careful copy, here in tempera on paper, most of them full size.",
      "**Exit ticket:** *one choice on your wall, and what it does.*"]})],
              [("connection", ["**Virtual visit:** open *Tomb Explorer* and find each wall’s three hidden details with the torch. Then *Build Your Own Tomb*: choose a wall, carve your name and lay your amulet in its niche.",
                               "**Design an Amulet** shows the symbols in this lesson, each with its meaning. Faience, a type of ceramic, was commonly used to make amulets."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Three walls, and six symbols", "body": ["Project or print this page for the comparison and the studio."]}),
    thumbs(height=104, caps={"harvest": "Two rows · the harvest, tomb of Menna", "fields": "Rows in a border · Sennedjem’s fields", "wine": "One scene, yellow ground · Ipuy’s vineyard"}),
    ("html", '<table class="det"><thead><tr><th>Detail</th><th>Wall</th><th>What it tells us</th></tr></thead><tbody>'
             + "".join(f"<tr><td>{d}</td><td>{w}</td><td>{md(t)}</td></tr>" for d, w, t in DETAILS) + "</tbody></table>"),
    symbols_html(),
    ("html", f'<p class="credits" style="font-size:7.5pt;color:#5b5a55">{WALLS["harvest"]["credit"]}; {WALLS["fields"]["credit"]}; {WALLS["wine"]["credit"]}. Public domain.</p>'),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["About 3,400 years ago, painters covered the walls of Menna’s tomb at Thebes with scenes of his life. This is a copy of one wall, painted full size for The Met in 1924. Menna fishes and hunts birds in the papyrus marshes, with his family in his papyrus boat."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": CSS + css}

GREEN = handout("green", "EGY_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "One man, twice", "blocks": [
            ("html", '<div class="side">' + mennas(82)[1] + '<div><p>Menna appears twice on his wall, once on each side. What is he doing on the left side? What is he doing on the right?</p>' + '<div class="rl"></div>' * 4 + '</div></div>')]}),
  ("task", {"label": "Part 2", "title": "Small details, big meanings", "blocks": [
            details_pics(82),
            P("Write the letter of each detail, **A**, **B** or **C**, in the box beside what it tells us."),
            ("html", '<ul class="match"><li>By defeating the wild creatures of the marsh, Menna was helping to keep the Egyptian world in order.</li>'
                     '<li>Tilapia carry their young in their mouths, so they were linked with new life.</li>'
                     '<li>A small cat climbs a papyrus stalk, hoping to catch one of the birds flying above.</li></ul>')]}),
  ("task", {"label": "Part 3", "title": "Choose a symbol", "blocks": [
            symbols_html(), P("Which symbol will you put on your wall, and why?")], "lines": 1}),
  ("task", {"label": "Part 4", "title": "Your wall", "blocks": [
            P("Draw a day you love, in two rows. **Row 1:** something you do. **Row 2:** the people or animals who share it. Put your symbol in the border, and you can draw yourself twice, like Menna."),
            wall_template(370)]}),
], ".task { break-inside: avoid; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "One man, twice", "blocks": [
            ("html", '<div class="side">' + mennas(76)[1] + '<div><p>Menna appears twice, once on each side of his wall. What does he do on each side? How does showing him twice help tell the story of a day in the marshes?</p>' + '<div class="rl"></div>' * 4 + '</div></div>')]}),
  ("task", {"label": "Part 2", "title": "Rows, or one scene?", "blocks": [
            thumbs(("harvest", "wine"), 62, {"harvest": "The harvest, tomb of Menna: two rows", "wine": "Ipuy’s vineyard: one scene"}),
            P("Vineyards were usually painted on grey until the time of the kings called Ramesses, when painters began to use yellow, like Ipuy’s. What does each layout let a painter show? Why change to yellow?")], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Plan your wall", "blocks": [
            symbols_html(meanings=True),
            ("table", {"head": ["Your choice", "What and why"], "rows": [
              ["Row 1 shows …", ""], ["Row 2 shows …", ""], ["My symbol, and why", ""], ["My ground color, and why", ""]]})]}),
  ("task", {"label": "Part 4", "title": "Draw your wall", "blocks": [wall_template(350)]}),
], ".task { break-inside: avoid; } table td { height: 18pt; }")

RED = handout("red", "EGY_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "A balanced wall", "blocks": [
            ("html", f'<div class="pair">{wall_crop("marshes", 0, 0, 1800, 991, 300)}</div>'),
            P("Menna stands twice, one on each side of a tall thicket of papyrus. Describe how the wall is balanced. What is the same on each side, and what is different? What does showing him twice let the painter say that one figure could not?")], "lines": 5}),
  ("task", {"label": "Part 2", "title": "A copy of a painting", "blocks": [
            note(COPIES, "Tomb Explorer, after The Met"),
            P("This copy was painted by Nina de Garis Davies in 1924. What can a careful full-size copy tell us about the painting in the tomb? What can it not? Why might a museum make one?")], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Design with a reason", "blocks": [
            symbols_html(),
            P("Design a two-row wall about a day you would want to remember, showing yourself twice. Choose one symbol and one ground color on purpose. Around the frame, write **three annotations**: one on your layout, one on your symbol, one on your color.")]}),
  ("task", {"label": "Part 4", "title": "Your wall", "blocks": [wall_template(230)]}),
], ".task { break-inside: avoid; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
