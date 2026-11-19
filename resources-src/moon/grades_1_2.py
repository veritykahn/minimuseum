"""Grades 1–2 · "What Made This Sand?"
Under the Microscope: Moon dust beside Earth's soil. Earth's sand is shaped
by wind, water and living things; Moon dust was made by meteorite impacts,
so it is sharp, jagged and sticky. Facts follow poster 1's regolith paragraph
(REGOLITH in app/exhibitions/moon/moon.ts) and the six slides and their
captions in app/exhibitions/moon/microscope/slides.ts."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (SLIDES, ROOM, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, hero_slide, slide_pic,
                          photo_credits, slides, quote, review)

DIR = "teachers/grades-1-2/"
TITLE = "What Made This Sand?"
SUB = "Grades 1–2 · Under the Microscope · Moon dust and Earth’s sand"
HERO = hero_slide("earth-wind", "center 40%")

# poster 1, word for word: said in the plan and shown on the screen
UNLIKE = "Unlike Earth’s soil, which is shaped by wind, water, and living things, lunar dust is formed over billions of years through meteorite impacts."
JAGGED = "This makes the dust particles sharp and jagged, and they can stick to everything because of static electricity."
HOOK_Q = "What do you think this is?"
SHARE = "If you could put one thing under a microscope, what would it be? What do you think you would see?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe sand grains up close: their shape, color and size",
     "describe sand grains up close?", False),
    ("name three things that shape Earth’s sand: wind, water and living things",
     "name what shapes Earth’s sand?", False),
    ("say how Moon dust was made, and why its grains are sharp",
     "say how Moon dust was made?", False),
    ("match a sand to what shaped it, and give a clue you can see",
     "match a sand to what shaped it, and give a clue?", True)],
  "why": "Up close, every grain has a story. Looking carefully is how scientists find out where something came from."}

# ── on the classroom screen ────────────────────────────────────────────
def item(key, caption, sub=None):
    s = SLIDES[key]
    return {"img": s["img"], "caption": caption, **({"sub": sub} if sub else {}), "alt": s["alt"], "aspect": 1}

EARTH_SANDS = [
  {"label": "Wind", "text": "Rounded grains from the Gobi Desert, blown by the wind.",
   "items": [item("earth-wind", "Gobi Desert sand", "Mongolia")]},
  {"label": "Water", "text": "Smooth, glassy grains from a river.",
   "items": [item("earth-water", "Vistula River sand", "Warsaw, Poland")]},
  {"label": "Living things", "text": "Pieces of coral and shells, and tiny pink grains.",
   "items": [item("earth-life", "Bermuda coral sand", "Bermuda")]}]

MOON_EARTH = [
  {"img": SLIDES["moon-soil"]["img"], "label": "From the Moon", "caption": "Far-side Moon soil", "fit": "cover",
   "alt": SLIDES["moon-soil"]["alt"]},
  {"img": SLIDES["earth-wind"]["img"], "label": "From Earth", "caption": "Gobi Desert sand", "fit": "cover",
   "alt": SLIDES["earth-wind"]["alt"]}]

# ── drawings ───────────────────────────────────────────────────────────
WIND = ('<svg viewBox="0 0 80 60" width="46pt" height="34pt" aria-hidden="true"><g fill="none" stroke="#1d1c1a" stroke-width="3.4" stroke-linecap="round">'
        '<path d="M6 18H50C58 18 62 12 58 7C55 3 49 5 49 10"/><path d="M6 32H66C74 32 78 38 74 43C71 47 65 45 65 40"/>'
        '<path d="M14 46H44C51 46 54 51 51 55C48 58 43 56 43 52"/></g></svg>')
WATER = ('<svg viewBox="0 0 80 60" width="46pt" height="34pt" aria-hidden="true"><g fill="none" stroke="#1d1c1a" stroke-width="3.4" stroke-linecap="round">'
         '<path d="M4 18C14 8 22 8 32 18S50 28 60 18 76 12 78 14"/><path d="M4 34C14 24 22 24 32 34S50 44 60 34 76 28 78 30"/>'
         '<path d="M4 50C14 40 22 40 32 50S50 60 60 50 76 44 78 46"/></g></svg>')
SHELL = ('<svg viewBox="0 0 80 64" width="46pt" height="36pt" aria-hidden="true"><g fill="none" stroke="#1d1c1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'
         '<path d="M40 56C18 56 6 40 8 26C10 12 26 4 40 4S70 12 72 26C74 40 62 56 40 56Z"/>'
         '<path d="M40 56V6M40 56L22 10M40 56L58 10M40 56L12 22M40 56L68 22"/><path d="M32 56H48L46 62H34Z"/></g></svg>')
ICONS = {"wind": (WIND, "Wind"), "water": (WATER, "Water"), "life": (SHELL, "Living things")}

CSS = BASE_CSS + """
.mrow { display: grid; grid-template-columns: 86pt 1fr 60pt 1.2fr; align-items: center; row-gap: 8pt; margin: 4pt 0 6pt; break-inside: avoid; }
.mrow img { width: 66pt; height: 66pt; object-fit: cover; border-radius: 50%; border: 1.4pt solid #1d1c1a; }
.mrow .cap { font: 400 10.5pt/1.25 'Outfit'; padding-left: 6pt; }
.mrow .cap b { display: block; font-weight: 500; }
.mrow .dot { width: 12pt; height: 12pt; border-radius: 50%; background: #1d1c1a; justify-self: start; }
.mrow .rdot { width: 12pt; height: 12pt; border-radius: 50%; background: #1d1c1a; }
.mrow .word { display: flex; align-items: center; gap: 10pt; font: 500 13pt 'Outfit'; }
.mrow .box { width: 32pt; height: 32pt; border: 1.2pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); flex: none; }
.mrow .rdot { flex: none; }
.mrow .lt { display: block; font: 600 22pt/1 'Cormorant Garamond', serif; color: var(--gold-big); margin-bottom: 2pt; }
.mrow .clue { display: block; border-bottom: 1pt solid #1d1c1a; padding: 14pt 0 2pt; font-size: 9.5pt; margin-right: 10pt; }
.bank { display: flex; flex-wrap: wrap; gap: 8pt; margin: 4pt 0 10pt; justify-content: center; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 14pt; font: 400 12.5pt 'Outfit'; background: rgba(255,255,255,.6); }
.words3 { display: flex; justify-content: center; gap: 14pt; margin: 6pt 0 10pt; flex-wrap: wrap; }
.words3 span { border: 1.2pt solid #1d1c1a; border-radius: 99pt; padding: 5pt 16pt; font: 500 14pt 'Outfit'; background: rgba(255,255,255,.6); }
.fillin p { margin: 0 0 13pt; }
.fillin u { display: inline-block; min-width: 120pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.lenses { display: flex; justify-content: center; gap: 30pt; margin: 6pt 0 8pt; break-inside: avoid; }
.lens { display: grid; justify-items: center; gap: 5pt; }
.lens div { width: 168pt; height: 168pt; border-radius: 50%; border: 6pt solid #2A2245; background: rgba(255,255,255,.6); box-shadow: inset 0 0 0 1pt #1d1c1a; }
.lens span { font: 500 8pt 'Outfit'; letter-spacing: .22em; text-transform: uppercase; color: var(--gold-text); }
.lens.big div { width: 220pt; height: 220pt; }
.lens.small div { width: 132pt; height: 132pt; }
.mystery { display: grid; grid-template-columns: 120pt 1fr; gap: 14pt; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.mystery img { width: 120pt; height: 120pt; object-fit: cover; border-radius: 50%; border: 1.4pt solid #1d1c1a; }
.slides.plan img { border-radius: 6pt; }
"""

def match(keys, words, letters=False, clues=True):
    """sand photographs on the left, what shaped them on the right: a line
       to draw, dot to dot, or (letters) a box for each sand's letter"""
    rows = ""
    for i, (k, w) in enumerate(zip(keys, words)):
        s = SLIDES[k]
        icon, name = ICONS[w]
        cap = (f'<span class="lt">{"ABC"[i]}</span>' if letters else "") + (s["name"] if clues else '<span class="clue">Clue:</span>')
        mark = '<span></span>' if letters else '<span class="dot"></span>'
        lead = '<span class="box"></span>' if letters else '<span class="rdot"></span>'
        rows += (f'<img src="{s["img"]}" alt=""><span class="cap">{cap}</span>{mark}'
                 f'<div class="word">{lead}{icon}<span>{name}</span></div>')
    return ("html", f'<div class="mrow">{rows}</div>')

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "what-made-this-sand", "large": True,
  "out": DIR + "MOON_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS + "body { line-height: 1.42; }",
  "blocks": [
    ("timing", [("Hook", 4, "#7D8471"), ("Look closely", 10, "#2F4A5A"), ("Activity", 12, "#86671A"), ("Close", 4, "#A8452F")]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will look closely at sand, first with a magnifying glass and then in photographs taken down real microscopes. They will learn that Earth’s sand is shaped by **wind, water and living things**, and that Moon dust was made in a different way: by space rocks hitting the Moon over billions of years. That is why its grains are sharp and jagged, and why they stick to everything."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Earth science** — wind and water change the land; Earth’s materials",
        "**Science practices** — observing closely with a tool; describing what you see; comparing two things",
        "**Language** — describing words: rounded, smooth, sharp, jagged, sticky",
        "**Space** — the Moon is a real place, with its own ground"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "A cup of sand from a playground, a beach or a garden shop; magnifying glasses, one between two if you can",
      "A pinch of flour and a dark cloth or piece of felt",
      "Page 3 of this plan, projected or printed; *Under the Microscope* on a screen if you have one",
      "Differentiated handouts, one per child; crayons"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "A mystery picture",
      "screen": {"phase": "Hook", "show": "image", "img": slide_pic("earth-wind"), "alt": SLIDES["earth-wind"]["alt"],
                 "caption": HOOK_Q, "fit": "cover",
                 "purpose": "Wonder at something ordinary made strange, before anyone says what it is.",
                 "students": ["What do you think this is?", "What colors and shapes can you see?"]},
      "body": ["Show the picture on the screen or page 3 without saying what it is. *“" + HOOK_Q + "”* Take guesses: pebbles, beads, sweets. Then pass round the cup of sand and the magnifying glasses. *“It’s sand! Sand from the Gobi Desert, in Mongolia, seen down a microscope. The whole picture is only 10 millimeters wide: about as wide as a fingernail.”*"]}),
    ("section", {"label": "Look closely · 10 minutes", "title": "Three sands and the Moon",
      "screen": [
        {"phase": "Look closely", "minutes": 4, "script": [0], "title": "Shaped on Earth", "show": "gallery", "groups": EARTH_SANDS,
         "purpose": "See that Earth’s sand is shaped by wind, water and living things.",
         "students": ["Which grains are rounded?", "Which sand has pieces of shell in it?"]},
        {"phase": "Look closely", "minutes": 4, "script": [1], "title": "Made by space rocks", "show": "image",
         "img": slide_pic("moon-soil"), "alt": SLIDES["moon-soil"]["alt"], "fit": "cover",
         "caption": "Moon soil, brought back from the far side of the Moon in 2024",
         "purpose": "Meet real Moon soil, and hear how it was made.",
         "students": ["What do you notice about these grains?", "How is it different from Earth’s sand?"]},
        {"phase": "Look closely", "minutes": 2, "script": [2], "title": "Moon and Earth", "show": "pair", "items": MOON_EARTH,
         "note": {"text": JAGGED, "ref": "Our Incredible Moon"},
         "purpose": "Compare the two side by side, as the microscope room does.",
         "students": ["Which grains are sharp and jagged?", "Which grains are rounded?"]}],
      "body": [
        "Show the three Earth sands. Read the poster’s words: Earth’s soil *is shaped by wind, water, and living things.* The Gobi Desert sand was shaped by the **wind**: look how rounded its grains are. The Vistula River sand was shaped by **water**: its grains are smooth and glassy. The Bermuda sand was shaped by **living things**: it is full of pieces of coral and shells, and tiny pink grains that give Bermuda’s beaches their pink color.",
        "Now show the Moon soil. China’s *Chang’e 6* mission brought it back in 2024, from the far side of the Moon. The Moon has no wind, no rivers and no living things to shape it. Read: *“" + UNLIKE + "”* Meteorites are space rocks. Over billions of years, space rocks crashing into the Moon made its dust.",
        "Put the two side by side. Read: *“" + JAGGED + "”* Astronauts said Moon dust smelled like gunpowder and was hard to clean off their suits."]}),
    ("section", {"label": "Activity · 12 minutes", "title": "Sand detectives",
      "screen": [
        {"phase": "Activity", "minutes": 4, "script": [0], "title": "Does it stick?", "show": "image",
         "img": {"img": ROOM}, "alt": "The Under the Microscope room: orange glass beads from the Moon in the round microscope view, beside the focus knob, the lenses and their notes",
         "caption": "Under the Microscope: wipe a slide clean, place a sample, focus, magnify, explore", "fit": "contain",
         "purpose": "Feel the poster’s difference: fine dust clings, sand brushes off.",
         "students": ["Rub a pinch of flour on the cloth. Then a pinch of sand.", "Which one sticks?"]},
        {"phase": "Activity", "minutes": 8, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Match the sands on paper, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three use the same sands and the same Moon dust."]}],
      "body": ["Rub a pinch of flour onto the dark cloth, then a pinch of sand. Shake the cloth. The sand falls off; the flour clings. Flour is not Moon dust, but it is very fine, like Moon dust. In the exhibition’s *Under the Microscope* room, wiping Moon dust off a slide works the same way: it clings to the cloth, while Earth’s grains brush aside. If you have a screen, let a child try it.",
               "Then children choose a handout. All three levels match the same Earth sands to what shaped them, and compare them with Moon dust."]}),
    ("levels", {
      "green": "Draw a line from each sand to what shaped it: wind, water or living things. Circle the words for Moon dust, then draw what you saw through the magnifying glass.",
      "yellow": "Write the letter of each sand beside what shaped it. Finish three sentences from a word bank, then draw Moon dust and Earth’s sand side by side.",
      "red": "Match each sand and write the clue that gave it away. Write how Moon dust is different from Earth’s sand, then wonder about a mystery slide: round glass beads from the Moon."}),
    ("section", {"label": "Look back and share · 4 minutes",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS, purpose="Check what each child can now do against the objectives."),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Look back and share", "show": "question", "question": SHARE,
         "purpose": "Close with wonder: what else would they like to look at closely?",
         "students": ["Tell a partner.", "What do you think you would see?"]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* For each one, children show a thumb up, sideways or down. For the last, ask a Red Level child to name a clue.",
               f"Then ask: *“{SHARE}”*"]}),
    ("cols", [[("section", {"label": "Answer notes", "title": "For the handouts",
      "list": [
        "**Part 1, all levels:** A, the Bermuda coral sand, was shaped by living things; B, the Gobi Desert sand, by wind; C, the Vistula River sand, by water.",
        "**Clues (Red):** rounded grains for wind; smooth, glassy grains for water; pieces of coral and shell, and pink grains, for living things. Accept any clue a child can show you.",
        "**Green, Part 2:** sharp, sticky and jagged. **Yellow, Part 2:** wind, shells, space rocks, sticky."]})],
              [("connection", ["**Visit the exhibition:** in *Under the Microscope*, children wipe a slide, place a sample, focus, magnify and explore, then compare Moon dust with Earth’s soil side by side. The display case holds a real lunar meteorite and sand specimens from around the world.",
                               "**On the poster** *Our Incredible Moon*, find the paragraph about Moon dust at the bottom."]),
               ]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Moon dust and Earth’s sand",
                 "body": ["Project or print this page for the hook and for looking closely. Each circle is a photograph taken down a microscope."]}),
    slides(["earth-wind", "earth-water", "earth-life"],
           captions=["<b>Wind</b>Gobi Desert sand, Mongolia", "<b>Water</b>Vistula River sand, Poland", "<b>Living things</b>Bermuda coral sand"]),
    slides(["moon-soil", "moon-beads", "moon-glass"],
           captions=["<b>Moon soil</b>Far side, Chang’e 6, 2024", "<b>Glass beads</b>Apollo 17, magnified 31.5 times", "<b>Orange glass</b>Apollo 17, magnified 160 times"]),
    quote(UNLIKE + " " + JAGGED, "Our Incredible Moon"),
    ("section", {"label": "Questions for looking closely", "list": [
      "What shapes can you see? Are the grains round, smooth, sharp or flat?",
      "Are all the grains the same color?",
      "Which sand was shaped by water? How can you tell?",
      "Why is Moon dust sharp, when desert sand is rounded?"]}),
    photo_credits(["earth-wind", "earth-water", "earth-life", "moon-soil", "moon-beads", "moon-glass"]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Sand on Earth is shaped by wind, water and living things. Moon dust is different. It was made by space rocks hitting the Moon, so its grains are sharp and jagged, and they stick to everything."]

def P(t):
    return ("html", f"<p>{t}</p>")

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · Under the Microscope", "level": level, "young": True, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 1–2 · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

ORDER = ["earth-life", "earth-wind", "earth-water"]     # the sands, left
WORDS = ["wind", "water", "life"]                         # the words, right
CREDITS = photo_credits(["earth-wind", "earth-water", "earth-life"])
CREDITS_RED = photo_credits(["earth-wind", "earth-water", "earth-life", "moon-beads"])

GREEN = handout("green", "MOON_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "What shaped this sand?",
            "body": ["Look at each sand. Draw a line to what shaped it."]}),
  match(ORDER, WORDS),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Moon dust",
            "blocks": [P("Moon dust was made by space rocks hitting the Moon. Circle the words for Moon dust."), ("html", '<div class="words3"><span>sharp</span><span>rounded</span><span>sticky</span><span>jagged</span></div>')]}),
  ("task", {"label": "Part 3", "title": "What did you see?",
            "blocks": [P("Draw the sand you looked at through the magnifying glass. Then write one word about it."), ("html", '<div class="lenses"><div class="lens big"><div></div><span>My sand</span></div></div>')],
            "lines": 1}),
  ("family", ["Look at sand, soil or salt with a magnifying glass at home. Are the grains round or sharp? Then tell your family how Moon dust was made."]),
  CREDITS,
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "What shaped this sand?",
            "body": ["Write the letter of each sand in the box beside what shaped it."]}),
  match(ORDER, WORDS, letters=True),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Finish the sentences",
            "blocks": [P("Use a word from the box to finish each sentence."),
                       ("html", '<div class="bank"><span>space rocks</span><span>shells</span><span>sticky</span><span>wind</span></div>'
           '<div class="fillin">'
           '<p>1. Desert sand is blown about by the <u>&nbsp;</u>.</p>'
           '<p>2. Coral sand has pieces of <u>&nbsp;</u> in it.</p>'
           '<p>3. Moon dust was made by <u>&nbsp;</u> hitting the Moon.</p>'
           '<p>4. Moon dust is sharp, jagged and <u>&nbsp;</u>.</p></div>')]}),
  ("task", {"label": "Part 3", "title": "Moon and Earth",
            "blocks": [P("Draw Moon dust in one lens and Earth’s sand in the other. Write one word under each."), ("html", '<div class="lenses"><div class="lens"><div></div><span>Moon dust</span></div><div class="lens"><div></div><span>Earth’s sand</span></div></div>')],
            "lines": 1}),
  ("family", ["Rub a pinch of flour and a pinch of sand on a dark cloth together. Which one sticks? Tell your family why Moon dust was so hard to clean off the astronauts’ suits."]),
  CREDITS,
])

RED = handout("red", "MOON_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "What shaped this sand?",
            "body": ["Write each sand’s letter beside what shaped it. Then write the clue that told you."]}),
  match(ORDER, WORDS, letters=True, clues=False),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Moon and Earth",
            "body": ["How is Moon dust different from Earth’s sand? Write two sentences."], "lines": 2}),
  ("task", {"label": "Part 3", "title": "A mystery slide",
            "blocks": [("html", f'<div class="mystery"><img src="{SLIDES["moon-beads"]["img"]}" alt="">'
                                '<div><p>Most Moon dust is sharp and jagged. But these grains came from the Moon too, on Apollo 17. Many of them are tiny, round <b>glass beads</b>.</p>'
                                '<p>What would you like to ask a scientist about them?</p></div></div>')],
            "lines": 2}),
  ("task", {"label": "Part 4", "title": "Draw a bead",
            "blocks": [P("Draw one glass bead as if you were looking at it through a microscope."), ("html", '<div class="lenses"><div class="lens small"><div></div><span>Glass bead</span></div></div>')]}),
  ("family", ["Look at sugar, salt and sand with a magnifying glass at home. Which grains are round? Which are sharp? Tell your family what shapes Earth’s sand, and what made Moon dust."]),
  CREDITS_RED,
])

DOCS = [LESSON, GREEN, YELLOW, RED]
