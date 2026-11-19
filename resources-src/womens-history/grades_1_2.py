"""Grades 1–2 · "Violet’s Keepsakes"
A life in order, told by the keepsakes of the Violet's Life room
(app/exhibitions/womens-history/violet/: violetLife.ts, Keepsake.tsx,
questions.ts) and poster 2's biography (womensHistory.ts BIO). Home, work and
family only: the war, the Blitz stop and the rabbit are left out for this age."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (PHOTOS, POSTER2, ROOM_VIOLET, SOUNDS, OBJ_CSS, PIC_CSS, THUMBS, TIMING, review, photos, md)
from _keepsakes import svg, row

DIR = "teachers/grades-1-2/"
TITLE = "Violet’s Keepsakes"
SUB = "Grades 1–2 · Violet’s Life · A life in order"
HERO = {"img": POSTER2, "pos": "center 47%"}

# each keepsake, its stop in Violet's Life, and what the poster says there, told simply
STOPS = {
  "house": ("Fulham, 1907", "Violet was born in London. She had three sisters and two brothers."),
  "certificate": ("Home and school", "At school, Violet won certificates every year. Her teachers hoped she would become a teacher."),
  "machine": ("The factory, at 14", "At 14, Violet left school to work at a sewing machine in a factory, to help her family."),
  "rings": ("Marriage, 1928", "Violet married Harold in 1928. She said she chose him because he made her laugh."),
  "coat": ("Family, 1929", "Violet had four children. She made grown-up coats small for them, so they were always warm."),
  "rose": ("Essex", "In her own garden, Violet grew flowers and vegetables. Roses were her favorite flowers."),
}
ORDER = ["house", "certificate", "machine", "rings", "coat", "rose"]

HOOK_Q = "A thread, with a little picture at each stop. Whose life could these pictures tell?"
SHARE = "Think of a woman in your family. What would you ask her about when she was little? Tell a partner."
CLOSE_SHARE = f"Then: *“{SHARE}”*"
ORDER_Q = "Which came first in Violet’s life: the rose, the house or the sewing machine? Which came last?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("tell three parts of Violet’s life in order, using *first*, *next* and *last*",
     "tell Violet’s life in order?", False),
    ("say what a keepsake or a photograph tells us about a person",
     "say what a keepsake tells about a person?", False),
    ("name one way Violet helped her family",
     "name a way Violet helped her family?", False),
    ("think of a good question to ask a woman in your own family about her life",
     "think of a good question to ask a woman in your family?", True)],
  "why": "Women’s History Month remembers famous women, and everyday women too. Every family has a woman whose story is worth keeping.",
  "screen": {"heading": "I can…", "items": [
    "tell Violet’s life in order",
    "say what a keepsake tells about a person",
    "name a way Violet helped her family",
    "ask a woman in my family a good question"]}}

CSS = PIC_CSS + """
.cardsx { display: grid; grid-template-columns: repeat(var(--c, 2), 1fr); gap: var(--g, 16pt) 16pt; margin: 10pt 0 10pt; }
.kc { display: grid; grid-template-columns: auto 1fr; gap: 6pt 10pt; align-items: center; border: 1pt solid #1d1c1a;
  border-radius: 6pt; background: rgba(255,255,255,.65); padding: var(--pd, 12pt) 11pt; break-inside: avoid; position: relative; }
.kc svg { background: #f6efe4; border-radius: 50%; border: 1pt solid #22335e; }
.kc p { margin: 0; font-size: 10.5pt; line-height: 1.35; }
.kc .nb { position: absolute; top: -8pt; left: -8pt; width: 26pt; height: 26pt; border: 1.4pt solid #1d1c1a; border-radius: 4pt;
  background: #fff; display: grid; place-items: center; font: 500 16pt/1 'Outfit'; }
body.young .kc p { font-size: var(--fs, 13pt); }
.bank { display: flex; gap: 14pt; justify-content: center; margin: 4pt 0 8pt; }
.bank span { border: 1.2pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 16pt; font: 500 13pt 'Outfit'; background: rgba(255,255,255,.6); }
.fill { font-size: 13pt; margin: 6pt 0 12pt; }
.fill i { display: inline-block; width: 140pt; border-bottom: 1pt solid #5b5a55; height: 16pt; vertical-align: -3pt; }
.starter { font: 500 12.5pt 'Outfit'; margin: 8pt 0 0; }
.thread { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8pt; margin: 4pt 0 10pt; position: relative; }
.thread::before { content: ""; position: absolute; left: 8%; right: 8%; top: 27pt; border-top: 2pt dashed #f2661f; }
.thread figure { margin: 0; text-align: center; position: relative; }
.thread svg { background: #f6efe4; border-radius: 50%; border: 1pt solid #22335e; display: block; margin: 0 auto; }
.thread figcaption { font: 400 7.8pt/1.3 'Outfit'; margin-top: 3pt; }
.thread figcaption b { display: block; font-weight: 500; }
"""

def cards(keys, cols=2, first=None, size=54, style=""):
    """Keepsake cards, shuffled, each with a box for its number; `first` is filled in."""
    out = ""
    for k in keys:
        n = "1" if k == first else ""
        out += f'<div class="kc"><span class="nb">{n}</span>{svg(k, size)}<p>{md(STOPS[k][1])}</p></div>'
    return f'<div class="cardsx" style="--c:{cols};{style}">{out}</div>'

def thread():
    figs = "".join(f'<figure>{svg(k, 48)}<figcaption><b>{md(STOPS[k][0])}</b>{md(STOPS[k][1])}</figcaption></figure>' for k in ORDER)
    return f'<div class="thread">{figs}</div>'

# ── lesson plan ────────────────────────────────────────────────────────

STORY = [
  "**A girl in London.** *“Violet was born in 1907 in London, a big city in England. She had three sisters and two brothers. She was the second eldest girl, so she helped look after her little sisters. At school she won certificates every year, and her teachers hoped she would become a teacher herself.”*",
  "**Work.** *“But when Violet was 14, one of her sisters needed to go to a special school, and the family needed money. So Violet left school and went to work in a factory, sewing at a machine. She was paid for every piece she finished.”* Play the sewing machine.",
  "**A family of her own.** *“Violet married Harold in 1928. She said she chose him because he made her laugh. They had two daughters and two sons. Money was often tight, but Violet was so good at sewing that she took grown-up coats apart and made them small for her children, so they were always warm.”*",
  "**Music and roses.** *“Violet always had a piano. She played it by ear, and family and friends came to sing and dance at lively parties called knees-ups. Later, she had a house with a big garden, where she grew vegetables and flowers. Her favorite flowers were roses.”* Play the piano.",
]

LESSON = {
  "slug": "violets-keepsakes", "large": True,
  "out": DIR + "WH_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": CSS + OBJ_CSS + "body { line-height: 1.44; }",
  "screen_hero": {"img": PHOTOS["violet"]["img"], "pos": "center 25%"},
  "blocks": [
    ("timing", [("Hook", 4, TIMING["hook"]), ("Story time", 10, TIMING["teach"]), ("Activity", 12, TIMING["activity"]), ("Close", 4, TIMING["close"])]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words for today", "list": [
      "**Keepsake** — a small thing kept to remember someone",
      "**Timeline** — a life or a story set out in order",
      "**First, next, last** — words for putting things in order"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will follow the life of Violet Dina Want, a working woman born in London in 1907, through the keepsakes of the *Violet’s Life* room: a house, a sewing machine, wedding rings, a coat and a rose. They will put her life in order, say what a keepsake or a photograph tells us about a person, and think of a question to ask a woman in their own family."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social studies** — family life long ago; how children and grown-ups helped their families; chronology",
      "**ELA** — retelling in order with *first, next, last*; asking questions",
      "**Women’s History Month** — remembering everyday women as well as famous ones"]}),
               ("section", {"label": "Materials needed", "list": [
      "*Violet’s Life* on a screen, or the *Show your class* page (page 3)",
      "Crayons or colored pencils",
      "Differentiated handouts, one per child"]})]]),
    ("section", {"label": "Hook · 4 minutes", "title": "A thread of keepsakes",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": ROOM_VIOLET}, "fit": "contain",
                 "alt": "The Violet’s Life room: her places and moments along a line, above the first page of her story",
                 "caption": "Violet’s Life", "purpose": "Wonder first: what can little pictures on a thread tell us?",
                 "students": ["What pictures can you see?", "Whose life could they tell?"]},
      "body": [f"Show *Violet’s Life* (or page 3) without saying anything about it. *“{HOOK_Q}”* Let children name the pictures: a house, a sewing machine, rings, a piano, a rose. *“Each picture is a keepsake: a small thing that helps us remember. Today they tell us about a real woman called Violet.”*"]}),
    ("section", {"label": "Story time · 10 minutes", "title": "Violet’s life, stop by stop",
      "screen": [
        {"phase": "Story time", "minutes": 3, "script": [0], "title": "A girl in London", "show": "image",
         "img": {"img": PHOTOS["violet"]["img"], "pos": "center 25%"}, "alt": PHOTOS["violet"]["alt"], "caption": "Violet as a young woman",
         "purpose": "Meet Violet as a girl: a big family, and a lot of helping.",
         "students": ["How did Violet help at home?"]},
        {"phase": "Story time", "minutes": 2, "script": [1], "title": "Work", "show": "listen", "clips": [SOUNDS["sewing-machine"]],
         "question": "This is the sound of Violet’s work. What do you think she made?",
         "purpose": "Hear Violet’s work, and why a 14-year-old went to work.",
         "students": ["Listen. What is this machine?", "Why did Violet go to work?"]},
        {"phase": "Story time", "minutes": 3, "script": [2], "title": "A family of her own", "show": "gallery",
         "groups": [{"label": "Family photographs", "items": [
           {**PHOTOS_ITEM, "aspect": 0.81} for PHOTOS_ITEM in [
             {"img": PHOTOS["promenade"]["img"], "caption": "Out for a walk", "alt": PHOTOS["promenade"]["alt"]},
             {"img": PHOTOS["family"]["img"], "caption": "A family group", "alt": PHOTOS["family"]["alt"]}]]}],
         "purpose": "See a family from long ago, and how Violet kept her children warm.",
         "students": ["What do the photographs tell us?", "How did Violet keep her children warm?"]},
        {"phase": "Story time", "minutes": 2, "script": [3], "title": "Music and roses", "show": "listen",
         "clips": [SOUNDS["knees-up"], SOUNDS["garden-birds"]],
         "question": "A piano party, and a garden. Which would you like to visit?",
         "purpose": "Hear the happy sounds of Violet’s home.",
         "students": ["Listen. Where are we?"]}],
      "body": STORY}),
    ("section", {"label": "Activity · 12 minutes", "title": "First, next, last",
      "screen": [
        {"phase": "Activity", "minutes": 4, "script": [0], "title": "First, next, last", "show": "question", "question": ORDER_Q,
         "purpose": "Order three moments together before children do it alone.",
         "students": ["First… next… last…"]},
        {"phase": "Activity", "minutes": 8, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Put Violet’s life in order, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three put Violet’s keepsakes in order."]}],
      "body": [f"Ask: *“{ORDER_Q}”* Children answer in a sentence: *“First, Violet lived in a house in London. Next, she worked at a sewing machine. Last, she grew roses.”*",
               "Then children choose a handout. All three put Violet’s keepsakes in order and end with a keepsake of their own."]}),
    ("levels", {
      "green": "Number four keepsakes in order (the first is done), finish two sentences from a word box, and draw a keepsake for a woman in their family.",
      "yellow": "Number five keepsakes in order, retell Violet’s life with *first, next, last*, then draw a keepsake for a woman in their family and say why.",
      "red": "Number all six keepsakes, explain what the coat tells us about Violet, and write two questions for a woman in their own family."}),
    ("section", {"label": "Look back and share · 4 minutes",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [CLOSE_SHARE], "title": "Ask her", "show": "question", "question": SHARE,
         "purpose": "Turn from Violet’s family to the children’s own.",
         "students": ["Tell a partner: what would you ask her?"]}],
      "body": ["Ask the objectives back from the screen: *“Can you now…?”* Children show a thumb up, sideways or down. " + CLOSE_SHARE]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Telling Violet’s life at this age",
      "body": [
        "**Leave out the war.** Poster 2 and the room’s Blitz stop tell how the war destroyed the family’s homes and killed people Violet loved. The garden stop tells what happened to her pet rabbit. None of this belongs in a Grades 1–2 lesson; if you open the room, skip those two stops.",
        "**Every family is different.** Say *a woman in your family, or a woman who is like family to you*, so every child has someone to think of."]})],
    [("section", {"label": "Answer notes and assessment", "list": [
      "**Order:** house (born in London, 1907) · certificate (school) · sewing machine (work at 14) · rings (married, 1928) · coat (her children, from 1929) · rose (her garden)",
      "**Green word box:** roses · piano · brothers",
      "**Exit question:** *tell me one keepsake and what it tells us about Violet.*"]}),
     ("connection", ["**In the exhibition:** find Violet’s photographs on poster 2, and the family letters in the display case. **Online:** *Violet’s Life* asks a question at each stop, and *Make your own* sets out a timeline for a woman in your family."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Violet’s life, in keepsakes", "body": ["The keepsakes of the *Violet’s Life* room, in the order of her life, with what the poster tells at each stop. Use it for story time and to check the order."]}),
    ("html", thread()),
    ("html", photos(["violet", "promenade", "family", "four"], 150)),
    ("section", {"label": "Questions for story time", "list": [
      "Violet was the second eldest girl in a big family. How did she help?",
      "Why did Violet go to work when she was only 14?",
      "What does a coat made small for a child tell us about Violet?",
      "What would you like to ask Violet, if you could?",
      "What keepsake would you choose for a woman in your family?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**Read this with a grown-up.** Violet was born in London in 1907. She worked hard, sewed, sang, played the piano and grew roses. A keepsake is a small thing that helps us remember someone. Violet’s keepsakes can tell her life in order."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · Violet’s Life", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Put Violet’s life in order",
            "blocks": [("html", "<p>Write <b>2, 3, 4</b> in the boxes. Number <b>1</b> is done for you.</p>" + cards(["rose", "house", "coat", "machine"], 2, "house", 70, "--g:22pt;--pd:18pt;--fs:14pt"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Finish the sentences",
            "blocks": [("html", '<p>Use a word from the box.</p><div class="bank"><span>piano</span><span>brothers</span><span>roses</span></div>'
                                '<p class="fill">Violet’s favorite flowers were <i></i>.</p><p class="fill">Violet played the <i></i> by ear.</p><p class="fill">Violet had three sisters and two <i></i>.</p>')]}),
  ("task", {"label": "Part 3", "title": "Draw a keepsake for a woman in your family",
            "body": ["What small thing would help you remember her?"], "blocks": [("draw", "My keepsake")]}),
  ("family", ["Ask your child to tell you Violet’s life in order. Then look together at something your family keeps to remember someone."]),
], "body.young .drawbox { height: 300pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Put Violet’s life in order",
            "blocks": [("html", "<p>Write <b>1 to 5</b> in the boxes, from the first to the last.</p>" + cards(["coat", "machine", "rose", "house", "rings"], 2, size=50, style="--g:13pt;--pd:8pt"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Tell it in order",
            "blocks": [("html", '<p class="starter">First, Violet</p>'), ("lines", 2), ("html", '<p class="starter">Next, she</p>'), ("lines", 2),
                       ("html", '<p class="starter">Last, she</p>'), ("lines", 2)]}),
  ("task", {"label": "Part 3", "title": "A keepsake for a woman in your family",
            "blocks": [("html", '<div class="drawbox"><span>My keepsake</span></div><p class="starter">I chose it because</p>'), ("lines", 2)]}),
  ("family", ["Ask your child which keepsake they chose, and for whom. Is there a real one in your home?"]),
], "body.young .drawbox { height: 165pt; }")

RED = handout("red", "WH_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Put all six in order",
            "blocks": [("html", "<p>Write <b>1 to 6</b> in the boxes, from the first to the last.</p>" + cards(["rings", "rose", "house", "coat", "certificate", "machine"], 2, size=54, style="--g:16pt;--pd:10pt"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "What does the coat tell us?",
            "blocks": [("html", row([("coat", "A coat, made small for a child")], 44))],
            "body": ["Violet took grown-up coats apart and made them small for her children. What does that tell you about her?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Be a history detective",
            "blocks": [("html", '<p>Write two questions to ask a woman in your family about her life. Start with <b>How</b>, <b>What</b> or <b>Why</b>.</p><p class="starter">1.</p>'), ("lines", 2), ("html", '<p class="starter">2.</p>'), ("lines", 2)]}),
  ("task", {"label": "Part 4", "title": "Draw her keepsake", "blocks": [("draw", "Her keepsake")]}),
  ("family", ["Help your child ask their two questions. Write down the answers together, so the story is kept."]),
], "body.young .drawbox { height: 112pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
