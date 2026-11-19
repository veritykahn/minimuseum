"""PreK–Kindergarten · "Hidden in the Dark"
Tomb Explorer's first wall, Menna and Family Hunting in the Marshes: a torch
in the dark, and the little cat, the crocodile and the two big fish hidden
in it. Facts follow app/exhibitions/egypt/tomb/scenes.ts (the wall, its
details and their notes, The Met's records), tomb/page.tsx (the room's
intro) and egypt.ts (poster 2's Bastet, the display case).

Told gently for this age: a tomb is a special resting place, and the wall
shows a family's day by the river. Nothing about mummies or the dead."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (WALLS, GODS, OBJ_CSS, HOOK, TEACH, ACT, CLOSE, LOOK, LOOK_BACK, THUMBS,
                  wall_hero, wall_crop, review)

DIR = "teachers/prek-k/"
TITLE = "Hidden in the Dark"
SUB = "PreK–Kindergarten · Tomb Explorer · A painted wall from long ago"
M = WALLS["marshes"]
HERO = wall_hero("marshes", "center 40%")

# the room's own words (tomb/page.tsx INTRO)
DARK = "It is dark in the tomb. Its walls were painted more than three thousand years ago."
# said in the plan and shown on the classroom screen, so written once
SHARE = "If you painted your own wall, which animal would you hide in it?"
CLOSE_SHARE = f"Then ask: *“{SHARE}”* Let each child whisper an animal to a partner."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find the little cat, the crocodile and the two big fish hidden in a painted wall",
     "find what is hidden in the wall?", False),
    ("count the big fish on Menna’s spear, and say *two*",
     "count the big fish?", False),
    ("say one thing the painting shows about a family in Egypt long ago",
     "tell one thing the painting shows?", False)],
  "why": "Long ago, a painter filled this wall with a family, a river and its animals. Looking slowly, a little at a time, lets us find what is hidden there.",
  "screen": {"heading": "I can…", "items": [
    "find the hidden animals",
    "count the big fish",
    "tell what the painting shows"]}}

# ── pictures for small hands: pieces of the marsh wall ─────────────────
def cat(width=300):   return wall_crop("marshes", 760, 120, 480, 340, width)
def fish(width=220):  return wall_crop("marshes", 780, 580, 280, 220, width)
def croc(width=430):  return wall_crop("marshes", 560, 800, 540, 170, width)
def whole(width=470): return wall_crop("marshes", 0, 0, 1800, 991, width)

CSS = """
.pb { break-after: auto; break-before: page; height: 0; }
.pic { display: flex; justify-content: center; margin: 4pt 0 8pt; break-inside: avoid; }
.nums { display: flex; justify-content: center; gap: 22pt; margin: 2pt 0 6pt; }
.countrow { display: flex; align-items: center; justify-content: center; gap: 34pt; margin: 2pt 0 6pt; break-inside: avoid; }
.countrow .nums { margin: 0; }
.nums span { width: 54pt; height: 54pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 34pt/1 'Cormorant Garamond', serif; }
.fishrow { display: flex; align-items: center; justify-content: center; gap: 26pt; margin: 2pt 0 4pt; break-inside: avoid; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 40pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
.match { display: grid; grid-template-columns: 150pt 1fr 150pt; gap: 8pt; align-items: center; margin: 4pt 0 6pt; break-inside: avoid; }
.match .col { display: grid; gap: 10pt; justify-items: center; }
.match .home { width: 150pt; border: 1.4pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.65);
  display: grid; place-items: center; font: 500 13pt 'Outfit'; padding: 6pt; text-align: center; }
.match .home .crop { margin-bottom: 4pt; }
.match .l, .match .home { position: relative; }
.match .l::after, .match .home::before { content: ""; position: absolute; top: 50%; width: 13pt; height: 13pt; margin-top: -6.5pt;
  border-radius: 50%; background: #1d1c1a; }
.match .l::after { right: -22pt; } .match .home::before { left: -22pt; }
.dots { display: grid; gap: 64pt; justify-items: stretch; }
.dots i { display: block; height: 14pt; position: relative; }
.dots i::before, .dots i::after { content: ""; position: absolute; top: 0; width: 14pt; height: 14pt; border-radius: 50%; background: #1d1c1a; }
.dots i::before { left: 0; } .dots i::after { right: 0; }
"""

# the "Show your class" page: the wall, large, and the cat beside Bastet
SHOW_CSS = """
.big { display: flex; justify-content: center; margin: 2pt 0 8pt; }
.catgod { display: grid; grid-template-columns: auto auto 1fr; gap: 14pt; align-items: center; margin: 4pt 0 10pt; break-inside: avoid; }
.catgod img.god { width: 132pt; height: 115pt; object-fit: cover; border-radius: 5pt; border: 1pt solid #1d1c1a; }
"""

# ── lesson mode ────────────────────────────────────────────────────────
WALL_ART = {"work": "Menna and Family Hunting in the Marshes",
            "artist": "Nina de Garis Davies, a copy (1924) of a painting in the tomb of Menna, Thebes",
            "date": "about 1396–1347 BCE",
            "img": {"img": M["img"], "pos": "center 40%", "credit": M["credit"]},
            "alt": "A tomb painting: Menna stands twice in a papyrus boat among tall papyrus, on one side raising a throwstick at birds and on the other spearing fish, with his family beside him and water full of fish and birds below"}
CAT_AND_GODDESS = [
  {"img": M["img"], "label": "A cat on the wall", "fit": "cover", "pos": "55% 27%",
   "alt": "A small spotted cat at the top of the tall papyrus, among the birds"},
  {"img": GODS["bastet"]["img"], "label": "Bastet", "caption": "Goddess of cats", "fit": "contain",
   "alt": GODS["bastet"]["alt"]}]

LESSON = {
  "slug": "hidden-in-the-dark", "large": True,
  "out": DIR + "EGY_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": CSS + OBJ_CSS + SHOW_CSS,
  "blocks": [
    ("timing", [("Circle time", 4, HOOK), ("The painted wall", 6, TEACH), ("Look closely", 3, LOOK),
                ("Activity", 9, ACT), ("Close", 3, CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "A torch or flashlight, and a room you can darken",
      "The marsh wall on page 3, printed large or projected",
      "Crayons and pencils",
      "The differentiated handouts, one per child"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will look closely at a wall painted in Egypt more than three thousand years ago, in the tomb of a man named Menna. With a torch, as in the exhibition’s *Tomb Explorer*, they will find a little cat, a crocodile and two big fish hidden in it, count, and say what the painting shows: a family in a boat on the river, among tall papyrus, birds and fish."]}),
               ("section", {"label": "Themes", "list": [
      "**Social Studies** — long ago and today; families; life beside a river",
      "**Art** — looking slowly; finding details in a picture; color",
      "**Science** — animals and where they live: in the water, in the reeds, in the sky",
      "**Early learning** — counting to two; naming animals; words for where things are; tracing and drawing"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "A torch in the dark",
      "screen": {"phase": "Circle time", "show": "question", "question": "It is dark in the tomb. Shine a light. What can you find?",
                 "purpose": "Look before anyone explains: let the torch find the first details.",
                 "students": ["Watch the circle of light.", "Call out what you see!"]},
      "body": ["Darken the room. Switch on a torch and move its circle of light slowly over the wall on page 3. Say: *“Long ago in Egypt, people made a special resting place for a person when they died, called a tomb. " + DARK + "”* Ask: *“What can you see in the circle of light?”* Let the children call out what they find before you show the whole wall."]}),
    ("section", {"label": "The painted wall · 6 minutes", "title": "Menna and his family",
      "screen": {"phase": "The painted wall", "show": "artwork", **WALL_ART,
                 "purpose": "See the whole wall, and meet the family in it.",
                 "students": ["Find Menna. Can you find him twice?", "Who is in the boat with him?"]},
      "body": ["Turn the lights on and show the whole wall. *“This is Menna and his family, out on the river in a boat made of papyrus, a tall plant. On one side Menna throws a stick at the birds. On the other, he catches fish with a long spear.”* Menna is painted **twice** in one picture: let the children find him both times.",
               "Ask: *“Who is in the boat with him? What is the water full of?”* The marsh is full of birds and fish."]}),
    ("section", {"label": "Look closely · 3 minutes", "title": "What is hiding?",
      "screen": {"phase": "Look closely", "show": "image",
                 "img": {"img": M["img"], "credit": M["credit"]}, "fit": "contain",
                 "alt": WALL_ART["alt"], "caption": "A little cat, a crocodile and two big fish are hiding.",
                 "purpose": "Find the three details Tomb Explorer hides in this wall.",
                 "students": ["Point to the little cat at the top of the papyrus.", "Find the crocodile in the water.", "Count the big fish. Hold up your fingers."]},
      "body": ["Now be detectives. A small cat climbs to the top of the papyrus, hoping to catch a bird. A crocodile swims in the water under the boats. And on Menna’s spear are **two** big fish. Children point to each one and hold up two fingers for the fish."]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Find, count and draw on paper, at the right level for each child.",
                 "students": ["Find the hidden animals on your page."]},
      "body": ["Each child works on a handout. All three show pieces of the same wall, and the same hidden animals."]}),
    ("levels", {
      "green": "Picture-led. Circle the little cat, count the big fish and circle the number, find the crocodile in the water, then trace *CAT*.",
      "yellow": "Circle the cat, count the fish, find the crocodile, then copy *CAT* under a model and draw an animal to hide on their own wall.",
      "red": "Find all three in the whole wall, match each animal to where it lives, draw their own family in a boat, then tell a grown-up about it."}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        review(OBJECTIVES, 1, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "A cat and a goddess", "show": "pair", "items": CAT_AND_GODDESS,
         "purpose": "Meet Bastet, and end with the children’s own walls.",
         "students": ["People in Egypt loved cats.", SHARE]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you now ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               "Show the little cat beside Bastet. *“People in Egypt thought cats were very special. They told stories about a goddess of cats, called Bastet.”* " + CLOSE_SHARE]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "What the wall tells us",
      "body": [
        "**A family in the marshes.** Menna fishes and hunts birds in the papyrus marshes, with his family crowded into his boat. The water beneath teems with wildlife, even a crocodile. The Met explains that by defeating the wild creatures of the marsh, Menna was helping to keep the Egyptian world in order.",
        "**Little animals.** Painters liked to show small animals climbing the papyrus to steal birds’ eggs: there is more than one here. The two big fish are most likely tilapia, which carry their young in their mouths, so they were linked with new life.",
        "**A copy.** The wall in the exhibition is a copy, painted in 1924 by Nina de Garis Davies for The Metropolitan Museum of Art, of a painting in the tomb of Menna at Thebes, from about 1396–1347 BCE."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child point to the cat, the crocodile and the fish?",
      "Can the child count the big fish and say *two*?",
      "Can the child say one thing the painting shows: a family, a boat, the river, an animal?"]}),
     ("connection", ["**Virtual visit:** open *Tomb Explorer* and choose *The marshes*. Turn on the torch and search for the crocodile, the little cat and the two big fish: when all three are found, the whole wall lights up.",
                     "**In the display case,** find the hand-crafted replica statue of Bastet, goddess of cats."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The marsh wall", "body": ["Project or print this page for circle time. Darken the room and let a torch find the details one at a time."]}),
    ("html", '<div class="big">' + whole(470) + "</div>"),
    ("html", '<div class="catgod">' + cat(150) + f'<img class="god" src="{GODS["bastet"]["img"]}" alt="">'
             '<div><p class="label">Poster 2 · Gods and Goddesses</p><h3>A cat, and a goddess of cats</h3>'
             '<p>Bastet was the goddess of cats. Egyptians considered cats to be sacred animals, and her image was used as a symbol of good luck and protection.</p></div></div>'),
    ("section", {"label": "Questions to ask the children", "list": [
      "What can you see in the circle of light?",
      "Can you find Menna? Can you find him twice?",
      "How many big fish are on his spear? Let’s count.",
      "Which animal is hiding in the water? Which one is at the top of the papyrus?",
      "If you painted a wall about your family, what would you put on it?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["**A grown-up reads this aloud.** Long ago in Egypt, a painter covered a wall with pictures. Menna and his family are in a boat on the river. Birds fly and fish swim. Some animals are hiding. Look closely!"]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT, "hero": HERO,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks}

NUMS = '<div class="nums"><span>1</span><span>2</span><span>3</span></div>'

def trace(word="CAT", model=False, rows=2):
    first = f'<div><span class="{"model" if model else ""}">{word}</span></div>'
    rest = (f"<div><span>{word}</span></div>" if not model else "<div></div>") * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'

GREEN = handout("green", "EGY_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Find the little cat at the top of the papyrus. Circle it.",
            "blocks": [("html", '<div class="pic">' + cat(255) + "</div>")]}),
  ("task", {"label": "Part 2", "title": "Count the big fish. Circle the number.",
            "blocks": [("html", '<div class="countrow">' + fish(140) + NUMS + "</div>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Find the crocodile in the water. Circle it.",
            "blocks": [("html", '<div class="pic">' + croc(450) + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Trace the word.",
            "blocks": [("html", trace("CAT", rows=2))]}),
  ("family", ["Turn off the lights and look at a picture book together with a flashlight. What can your child find in the circle of light? Ask: *which animals live by a river?*"]),
])

YELLOW = handout("yellow", "EGY_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Find the little cat. Circle it.",
            "blocks": [("html", '<div class="pic">' + cat(255) + "</div>")]}),
  ("task", {"label": "Part 2", "title": "How many big fish? Circle the number.",
            "blocks": [("html", '<div class="countrow">' + fish(140) + NUMS + "</div>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Find the crocodile in the water. Circle it.",
            "blocks": [("html", '<div class="pic">' + croc(380) + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Copy the word.",
            "blocks": [("html", trace("CAT", model=True, rows=2))]}),
  ("task", {"label": "Part 5", "title": "Draw an animal you would hide on your own wall.",
            "blocks": [("draw", "My animal")]}),
  ("family", ["Look at the marsh wall together in the exhibition’s *Tomb Explorer*. Take turns being the torch: one of you hides an animal with a finger, the other finds it."]),
], "body.young .drawbox { height: 150pt; } .trace div { height: 52pt; margin-bottom: 10pt; } .trace span { font-size: 66pt; }")

def match():
    left = "".join(f'<div class="l">{c}</div>' for c in [cat(118), croc(150), fish(80)])
    homes = (f'<div class="home">{wall_crop("marshes", 800, 360, 160, 200, 80)}Up the papyrus</div>'
             f'<div class="home">{wall_crop("marshes", 1260, 860, 260, 100, 120)}In the water</div>')
    return (f'<div class="match"><div class="col">{left}</div><div></div>'
            f'<div class="col" style="gap:34pt">{homes}</div></div>')

RED = handout("red", "EGY_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Look at the whole wall. Circle the cat, the crocodile and the two big fish.",
            "blocks": [("html", '<div class="pic">' + whole(470) + "</div>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Where does each animal live? Draw a line to its home.",
            "blocks": [("html", match())]}),
  ("task", {"label": "Part 3", "title": "Draw your family in a boat, like Menna’s.",
            "blocks": [("draw", "My family")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">I found a</span></div><div></div></div>')]}),
  ("family", ["Ask your child to tell you about Menna’s day on the river. Then ask: *if we painted a wall about our family, what would we be doing?*"]),
], "body.young .drawbox { height: 140pt; } .trace div { height: 46pt; margin-bottom: 8pt; } .match { margin-bottom: 0; } .task { margin-bottom: 6pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
