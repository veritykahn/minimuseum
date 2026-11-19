"""Grades 1–2 · "Tiger or Wind?"
The Rustling Bushes, played as a clue hunt: the brain's alarm (poster 1's
amygdala), the bushes that might hide a tiger, and three calm steps for
when the alarm rings. Told gently: the game in its untimed Guess first
mode, with a warning, and the wind as often as the tiger. Facts follow
app/exhibitions/fear-lab/fearLab.ts (poster 1) and
what-scares-you/RustlingBushes.tsx and lab.ts (eight rounds, five bushes,
three tigers, the clues)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

DIR = "teachers/grades-1-2/"
TITLE = "Tiger or Wind?"
SUB = "Grades 1–2 · The Rustling Bushes · Your brain’s alarm"

HERO = {"img": pub(ROOM), "pos": "center 100%"}
SCREEN_HERO = {"img": ROOM, "pos": "center 80%"}

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Something is moving in the bushes. What could it be?"
ALARM = "When your brain isn’t sure,\nits alarm rings."
CALM = "Stop and breathe.\nLook for clues.\nAsk a grown-up."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say that a part of your brain works like an alarm, and rings when you can’t be sure what’s there",
     "say what your brain’s alarm does?", False),
    ("sort clues into tiger clues and wind clues",
     "sort a tiger clue from a wind clue?", False),
    ("use three calm steps when your alarm rings: stop and breathe, look for clues, ask a grown-up",
     "use the three calm steps?", False),
    ("explain why a fake alarm is safer than a missed tiger",
     "explain why a fake alarm is safer than a missed tiger?", True)],
  "why": "Everyone’s alarm rings sometimes. Knowing why it rings, and how to calm it, helps us be brave.",
  "screen": {"heading": "I can…", "items": [
    "say what my brain’s alarm does",
    "sort tiger clues from wind clues",
    "use the three calm steps",
    "say why a fake alarm is safer"]}}

CLIPS = [clip("rustle", "Sound 1", "Leaves_Rustling_Edited", "AmberdeMeillon", "The Rustling Bushes"),
         clip("gust", "Sound 2", "Wind5", "vandale", "The Rustling Bushes")]

# the clues, as the game names them (CLUE_TEXT), and what each means
CLUE_CHART = {
  "caption": "The Rustling Bushes: what each clue means",
  "columns": ["Clue", "What it means"],
  "rows": [{"cells": ["A striped tail tip, poking out of the bush", "A tiger!"]},
           {"cells": ["A tiger-shaped shadow on the ground", "A tiger!"]},
           {"cells": ["Paw prints leading into the bush", "A tiger!"]},
           {"cells": ["A low growl", "A tiger!"]},
           {"cells": ["Leaves blowing loose in the wind", "Just the wind"]},
           {"cells": ["No clue at all", "Sometimes there isn’t one: talk it over"]}]}

CSS = """
.clues { display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 8pt; margin: 4pt 0 8pt; text-align: center; break-inside: avoid; }
.clues > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); padding: 8pt 4pt 6pt;
  display: grid; grid-template-rows: 70pt auto; place-items: center; }
.clues p { margin: 0; font: 500 10.5pt/1.2 'Outfit'; }
.sort { display: grid; grid-template-columns: 1fr 90pt 150pt; align-items: center; gap: 4pt 10pt; margin: 6pt 0 8pt; break-inside: avoid; }
.sort .pic { display: flex; align-items: center; gap: 10pt; border-bottom: .6pt solid #b9b39f; padding: 4pt 0; min-height: 58pt; }
.sort .pic p { margin: 0; font: 400 11.5pt/1.2 'Outfit'; }
.sort .dot { width: 13pt; height: 13pt; border-radius: 50%; background: #1d1c1a; justify-self: end; }
.sort .word { grid-row: span 2; border: 1.6pt solid #1d1c1a; border-radius: 10pt; background: rgba(255,255,255,.7);
  font: 500 22pt 'Outfit'; letter-spacing: .14em; text-align: center; padding: 14pt 0; position: relative; }
.sort .word::before { content: ""; position: absolute; left: -7pt; top: 50%; width: 13pt; height: 13pt; margin-top: -6.5pt; border-radius: 50%; background: #1d1c1a; }
.steps3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; text-align: center; break-inside: avoid; }
.steps3 > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); padding: 8pt 4pt 6pt; }
.steps3 p { margin: 4pt 0 0; font: 500 11pt/1.2 'Outfit'; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .3em; color: #a9a69b; }
table.fill td:first-child { width: 56%; }
body.young table.fill { font-size: 12.5pt; }
body.young table.fill th { font-size: 8pt; }
"""

PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
body { line-height: 1.44; }
.clues > div { background: #f6f1e4; border-color: #c8c5bb; grid-template-rows: 56pt auto; }
.clues p { font-size: 8.6pt; }
.clues p b { display: block; color: var(--gold-text); font-weight: 500; letter-spacing: .1em; text-transform: uppercase; font-size: 7pt; margin-top: 2pt; }
"""

PICS = {"tail": (D.tail(62), "A striped tail tip"), "shadow": (D.shadow(92), "A tiger-shaped shadow"),
        "paws": (D.paws(82), "Paw prints"), "growl": (D.growl(82), "A low growl"),
        "leaves": (D.leaves(82), "Leaves blowing loose")}

def clues(keys, means=None):
    out = ""
    for k in keys:
        pic, name = PICS[k]
        m = f"<b>{means[k]}</b>" if means else ""
        out += f"<div>{pic}<p>{name}{m}</p></div>"
    return f'<div class="clues" style="--n:{len(keys)}">{out}</div>'

def sort_tiger_wind():
    rows = ""
    keys = ["tail", "leaves", "paws", "growl"]
    for i, k in enumerate(keys):
        pic, name = PICS[k]
        word = ""
        if i == 0:
            word = '<div class="word">TIGER</div>'
        elif i == 2:
            word = '<div class="word">WIND</div>'
        rows += f'<div class="pic">{pic}<p>{name}</p></div><span class="dot"></span>{word}'
    return f'<div class="sort">{rows}</div>'

STEPS3 = ('<div class="steps3">'
          f'<div>{D.breath(64)}<p>Stop and breathe</p></div>'
          f'<div>{D.magnifier(64)}<p>Look for clues</p></div>'
          f'<div>{D.speech(64)}<p>Ask a grown-up</p></div></div>')

def trace(word, rows=2):
    return '<div class="trace">' + f"<div><span>{word}</span></div>" * rows + "</div>"

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "tiger-or-wind", "large": True,
  "out": DIR + "FL_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 4, HOOK_C), ("Teach", 8, TEACH_C), ("Activity", 13, ACT_C), ("Close", 5, CLOSE_C)]),
    ("cols", [[("objectives", OBJECTIVES)],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will learn that a part of the brain works like an alarm system, and that it rings loudest when we can’t be sure what is there. Through the Rustling Bushes, they will look for clues to decide *tiger or wind?*, hear why the brain would rather raise a fake alarm than miss a real tiger, and practice three calm steps for when their own alarm rings."]}),
               ("section", {"label": "Themes", "list": [
      "**Science** — the brain and the body: an alarm, a racing heart",
      "**Feelings** — noticing worry and calming it",
      "**Thinking skills** — clues and evidence; *how do you know?*",
      "**Speaking and listening** — talking it over before deciding"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "The classroom screen, with sound; *What Scares You?* open on **The Rustling Bushes**, with *Guess first* on",
      "The clue chart on page 3, projected or printed",
      "Crayons and pencils; the differentiated handouts"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "Something in the bushes",
      "screen": {"phase": "Hook", "show": "listen", "clips": CLIPS, "question": HOOK_Q,
                 "purpose": "Wonder first: a sound, and no way to see what made it.",
                 "students": ["Close your eyes and listen.", "What could be in the bushes?"]},
      "body": [f"Ask children to close their eyes. Play the first sound, the rustle, and ask: *“{HOOK_Q}”* Take guesses: a cat, a bird, a monster, the wind. Play the second sound. *“That one is the wind blowing through the leaves.”* Ask: *“When you couldn’t see, what did your mind guess first?”*"]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "Your brain’s alarm",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Your brain’s alarm", "show": "words", "text": ALARM,
         "cite": "Poster 1 · The Science of Being Scared",
         "purpose": "Give the feeling a name: an alarm in the brain that rings when we are not sure.",
         "students": ["Put a hand on your heart.", "What does your body do when the alarm rings?"]},
        {"phase": "Teach", "minutes": 5, "script": [1, 2], "title": "Tiger or wind?", "show": "chart", **CLUE_CHART,
         "purpose": "Use clues, as a detective does, to tell a real danger from a fake alarm.",
         "students": ["Look for a clue in the bush.", "Talk it over. Then call it: tiger, or just the wind?"]}],
      "body": [
        "The Fear Lab says a part of your brain called the **amygdala** is your brain’s *alarm system*, and that not being sure sets it off. When the alarm rings, your heart races. Long ago, people who heard a bush rustle and thought *maybe a tiger!* ran away, and stayed safe. The poster says brains are built this way: *it is better to see 100 fake threats than miss one real predator.*",
        "Show the clue chart. In the Rustling Bushes, a bush rustles in the dark. Sometimes there is a clue: a striped tail tip, a shadow, paw prints or a low growl mean a tiger; leaves blowing loose mean the wind. Sometimes there is no clue at all.",
        "Play two or three rounds together with *Guess first* on, so there is no timer: look, talk it over, then the class calls *“Tiger! Run!”* or *“Just the wind.”* Warn children first that eyes appear suddenly in the dark when it is a tiger; nothing flashes. Turn the sound low or the motion off if you wish."]}),
    ("section", {"label": "Activity · 13 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Sort clues and practice the calm steps, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the same clues and the same calm steps."]},
      "body": ["Children choose a handout. All three use the same clues from the Rustling Bushes and the same three calm steps."]}),
    ("levels", {
      "green": "Draw a line from each clue to *TIGER* or *WIND*, color the three calm steps, draw a bush with a clue, trace *WIND*.",
      "yellow": "Sort the clues into a tiger column and a wind column, finish a sentence on why the alarm rings, draw a clue for a partner to guess, write what they can do when the alarm rings.",
      "red": "Name each result: fake alarm, missed tiger or tiger spotted. Explain which is worse and why, draw a clue that could trick you, write a tip for a friend whose alarm is ringing."}),
    ("section", {"label": "Calm steps and look back · 5 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Three calm steps", "show": "words", "text": CALM,
         "purpose": "Leave every child with steps they can use when their own alarm rings.",
         "students": ["Show me: a slow breath.", "Show me: looking for clues.", "Who could you ask?"]},
        {"phase": "Close", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Practice the three calm steps together: a slow breath in and out, eyes looking round for clues, and naming a grown-up each child could ask. Remind them: *it’s fine for your alarm to ring. It’s trying to keep you safe.*",
               "Then ask the objectives back, from the screen or page 1: *“Can you now…?”* Children show a thumb up, sideways or down. Ask a Red Level child the last one."]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Why the brain raises fake alarms",
      "body": [
        "**Negativity bias.** Poster 1 says that when the brain is unsure, it imagines disasters, not neutral scenes: this *negativity bias* kept our ancestors alive, because those who assumed rustling bushes held tigers lived longer than the optimists.",
        "**A good alarm, not a broken one.** A fake alarm costs a short run; a missed tiger costs far more. Children can hear that their alarm is doing its job, and that clues and calm steps help them check it.",
        "**About the game.** Eight rounds, five bushes, a tiger in three rounds. With *Guess first* on there is no timer; with it off, ten seconds to decide."]})],
    [("section", {"label": "Answer notes", "list": [
      "**Tiger clues:** the striped tail tip, the shadow, paw prints, the low growl. **Wind clue:** leaves blowing loose.",
      "**Red Part 1:** ran and it was the wind, a *fake alarm*; stayed and it was a tiger, a *missed tiger*; ran and it was a tiger, *tiger spotted*.",
      "**Exit question:** *what is one calm step you can use when your alarm rings?*"]}),
     ("connection", ["**Online:** in *What Scares You?*, play **The Rustling Bushes** with *Guess first* on. At the end the game counts your fake alarms and missed tigers.",
                     "**Visit the exhibition:** poster 1, *The Science of Being Scared*, tells the tiger story under *Your Brain Catastrophizes on Purpose*."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Tiger or wind?", "body": ["Project or print this page for the lesson. A bush rustles in the dark. Look for a clue, then decide."]}),
    ("html", clues(["tail", "shadow", "paws", "growl", "leaves"],
                   {"tail": "Tiger", "shadow": "Tiger", "paws": "Tiger", "growl": "Tiger", "leaves": "Just the wind"})),
    quote(BY_DESIGN, P1),
    ("section", {"label": "Three calm steps"}),
    ("html", STEPS3),
    ("section", {"label": "Questions to ask the children", "list": [
      "What did your mind guess first, when you couldn’t see?",
      "What clue told you it was a tiger? What told you it was the wind?",
      "Why would your brain rather ring a fake alarm than miss a tiger?",
      "When has your alarm rung for something that turned out fine?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["A part of your brain works like an **alarm**. When you can’t be sure what’s there, it rings, and your heart beats fast. Long ago, people who thought a rustling bush might hide a tiger ran away and stayed safe. But often it’s just the wind! Look for clues."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · The Rustling Bushes", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "FL_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Draw a line from each clue to TIGER or WIND.",
            "blocks": [("html", sort_tiger_wind())]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Your alarm rings! Color the three calm steps.",
            "blocks": [("html", STEPS3)]}),
  ("task", {"label": "Part 3", "title": "Draw a bush. Put a clue in it.",
            "blocks": [("draw", "My bush")]}),
  ("task", {"label": "Part 4", "title": "It was just the wind! Trace the word.",
            "blocks": [("html", trace("WIND"))]}),
  ("family", ["Go outside and listen together. What can you hear but not see? Ask: *what did your mind guess first?*"]),
], "body.young .drawbox { height: 190pt; }")

YELLOW = handout("yellow", "FL_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Look at the clues.",
            "blocks": [("html", clues(["tail", "paws", "leaves", "growl"]))]}),
  ("task", {"label": "Part 2", "title": "Write each clue in the right column.",
            "blocks": [("table", {"head": ["Tiger clues", "Wind clues"], "rows": [["", ""], ["", ""], ["", ""]]})]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Finish the sentence.",
            "body": ["My brain’s alarm rings, even for the wind, to keep me…"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Draw a bush with a clue. Can a partner guess: tiger or wind?",
            "blocks": [("draw", "My clue")]}),
  ("task", {"label": "Part 5", "title": "When my alarm rings, I can…",
            "lines": 3}),
  ("family", ["Ask your child to teach you the three calm steps: stop and breathe, look for clues, ask a grown-up. Try them together next time something feels scary."]),
], "body.young .drawbox { height: 200pt; } table.fill td { height: 40pt; }")

RED = handout("red", "FL_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Fake alarm, missed tiger, or tiger spotted?",
            "blocks": [("html", "<p>Read what happened. Write the right name.</p>"), ("table", {"head": ["What happened", "Its name"], "rows": [
              ["You ran. It was just the wind.", ""], ["You stayed. It was a tiger.", ""], ["You ran. It was a tiger.", ""]]})]}),
  ("task", {"label": "Part 2", "title": "Which is worse: a fake alarm or a missed tiger? Why?",
            "lines": 3}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw something that could trick you into thinking it’s a tiger.",
            "blocks": [("draw", "A tricky clue")]}),
  ("task", {"label": "Part 4", "title": "Write a tip for a friend whose alarm is ringing.",
            "lines": 5}),
  ("family", ["Talk about a time your alarm rang and it turned out fine. What helped you calm down? Ask your child the same question."]),
], "body.young .drawbox { height: 230pt; } table.fill td { height: 40pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
