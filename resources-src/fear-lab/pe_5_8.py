"""Grades 5–8 · PE · "Racing Hearts"
The heart that races before the hand touches anything (poster 1), measured:
students take their own pulse at rest, after waiting on a closed box, after a
gym version of the lab's Rustling Bushes, and after a calm minute. The game
keeps the lab's own shape (eight rounds, five bushes, three tigers, ten
seconds to decide; tigers always leave a clue, the wind mostly leaves) and
counts fake alarms and missed tigers. Facts follow fearLab.ts and
what-scares-you/ (lab.ts, RustlingBushes.tsx, FearBoxes.tsx). The exhibition
gives no normal heart rates, and neither does this lesson."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

DIR = "teachers/grades-5-8/pe/"
TITLE = "Racing Hearts"
SUB = "Grades 5–8 · PE · Your pulse, your alarm and the rustling bushes"

HERO = {"img": pub(ROOM), "pos": "center 100%"}
SCREEN_HERO = {"img": ROOM, "pos": "center 80%"}

PULSE_HOW = "Find your pulse on your wrist or neck. Count the beats for 30 seconds, then double it: beats a minute."
GAME_Q = "Tiger or wind? You have ten seconds to decide."
COOL_Q = "Take your pulse now. Then one slow, calm minute, and take it again."
HAUNTED = CHOICES[5][3]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find and count your own pulse, and record it at rest, after waiting, after exercise and after a calm minute",
     "find and count your pulse, and record it?", False),
    ("explain why your brain would rather raise a fake alarm than miss a real predator",
     "explain why your brain raises fake alarms?", False),
    ("compare how waiting and exercise each changed your heart rate",
     "compare how waiting and exercise changed your pulse?", False),
    ("weigh the cost of each kind of mistake, and test whether a calm minute brings your pulse back down",
     "weigh the cost of each mistake, and test a calm minute?", True)],
  "why": "Your heart answers fear and exercise alike. Knowing how to read it, and how to settle it, is a skill for every game, test and stage."}

CSS = """
table.fill td { padding: 4pt 6pt 6pt 0; }
"""
PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
table.fill { font-size: 9pt; }
table.fill td { padding: 3.5pt 6pt 4pt 0; }
table.fill td:first-child { width: 28%; font-weight: 500; }
.cluerow { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6pt; margin: 2pt 0 10pt; text-align: center; break-inside: avoid; }
.cluerow > div { border: .8pt solid #c8c5bb; border-radius: 5pt; background: #f6f1e4; padding: 6pt 3pt 4pt; display: grid; grid-template-rows: 46pt auto; place-items: center; }
.cluerow p { margin: 0; font: 500 8pt/1.25 'Outfit'; }
.cluerow p span { display: block; font-weight: 400; color: #5F6655; }
"""

# the lab's clues (RustlingBushes.tsx): which is a tiger's and which the wind's
CLUE_ROWS = [(n, m, "Tiger") for n, m in CLUES_TIGER] + [(n, m, "Wind") for n, m in CLUES_WIND]
CHART_SCREEN = {"caption": "The Rustling Bushes’ clues: every tiger leaves one; the wind mostly blows leaves loose, and sometimes leaves none",
                "columns": ["Clue card", "Where you see it", "What it was"],
                "rows": [{"cells": list(r)} for r in CLUE_ROWS]}

CLUE_ART = [D.tail(40), D.shadow(64), D.paws(56), D.growl(56), D.leaves(52), ""]
CLUEROW = ('<div class="cluerow">' + "".join(
    f'<div><div>{art}</div><p>{n}<span>{w}</span></p></div>' for art, (n, _, w) in zip(CLUE_ART, CLUE_ROWS)) + "</div>")

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "racing-hearts", "screen_hero": SCREEN_HERO,
  "out": DIR + "FL_LP_PE.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 PE", "hero": HERO, "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK_C), ("Teach", 8, TEACH_C), ("Activity", 25, ACT_C), ("Debrief", 7, CLOSE_C)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Poster 1 says that when you reach into a box you can’t see into, *“your heart races before you even touch anything.”* Students will measure that for themselves: their own pulse at rest, after waiting on a closed box, after a running game built on the lab’s *Rustling Bushes*, and after a calm minute. Through the game they will feel the poster’s trade-off, that it is *“better to see 100 fake threats than miss one real predator,”* and count what each kind of mistake costs."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Fitness** — measuring heart rate; how activity and recovery change it",
      "**Movement** — reaction and decision-making under time pressure",
      "**Health** — the body’s alarm; calming strategies; respecting one another’s data"]}),
    ("section", {"label": "Materials needed", "list": [
      "A closed box with a pinecone inside; five cones or hoops for the bushes; a start line and a safe line",
      "Eight clue cards (page 3): three tiger clues and five wind cards, mostly leaves",
      "A clock with a second hand; differentiated handouts and pencils"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Before you touch anything",
      "screen": {"phase": "Hook", "show": "question", "question": BOX,
                 "purpose": "Take a resting pulse, then feel what waiting does to it.",
                 "students": [PULSE_HOW, "Now watch the box. Count again."]},
      "body": [f"Seat the class. Teach the count: *“{PULSE_HOW}”* (the lab’s *Take your own pulse* asks for the wrist or neck). Everyone records a resting pulse. Then bring out the closed box. Read the poster: *“{BOX}”* Say that one volunteer may reach in. Everyone counts again while they wait. Then reveal it: a pinecone."]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "The alarm and the bushes",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Better safe than sorry", "show": "words", "text": TIGERS,
         "cite": "Poster 1 · Your Brain Catastrophizes on Purpose",
         "purpose": "Understand why the brain leans toward fake alarms.",
         "students": ["Which mistake was worse for our ancestors: running from the wind, or staying put for a tiger?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Read the clues", "show": "chart", **CHART_SCREEN,
         "purpose": "Learn the game’s clue cards before playing.",
         "students": ["Which clues mean tiger?", "What does it mean when there is no clue?"]}],
      "body": [
        f"Read: *“{TIGERS}”* and *“{BY_DESIGN}”* Ask which costs more: a fake alarm, or a missed tiger.",
        "Explain the game, as the lab plays it: eight rounds, five bushes, three tigers. A bush rustles, then a clue may appear. Every tiger leaves one; the wind mostly blows leaves loose, and sometimes leaves none. You have ten seconds to call it."]}),
    ("section", {"label": "Activity · 25 minutes",
      "screen": [
        {"phase": "Activity", "minutes": 3, "script": [0], "title": "Choose a data sheet", "show": "levels",
         "purpose": "Each student takes the data sheet that fits, before the game.",
         "students": ["Choose Green, Yellow or Red. All three record your pulse and your team’s calls."]},
        {"phase": "Activity", "minutes": 15, "script": [1, 2], "title": "Tiger or wind?", "show": "question", "question": GAME_Q,
         "purpose": "Play the Rustling Bushes with bodies: decide fast, and count the cost of each mistake.",
         "students": ["Tiger: run to the safe line.", "Wind: stay and hold your balance.", "Tally every fake alarm and every missed tiger."]},
        {"phase": "Activity", "minutes": 7, "script": [3], "title": "Cool down and record", "show": "question", "question": COOL_Q,
         "purpose": "Measure what the game did to the heart, and whether a calm minute brings it down.",
         "students": [PULSE_HOW, "Record both numbers on your sheet."]}],
      "body": [
        "Students choose a data sheet. All three record four pulses and the team’s calls; Yellow and Red go on to compare and explain.",
        "Teams line up at the start line facing five cones, the bushes. A caller stands behind one bush, rustles it, then holds up a clue card or none. Teams have ten seconds. **Tiger:** sprint to the safe line. **Wind:** stay and hold a balance. Shuffle three tiger cards and five wind cards for eight rounds.",
        "Score each round: a team that runs from the wind makes a **fake alarm** (one point and a run for nothing); a team that stays for a tiger makes a **missed tiger** (five points). Lowest score wins. Students who would rather not run can be callers and scorers.",
        f"Straight after round eight, everyone takes a pulse. Then one slow, calm minute: sit, breathe slowly, eyes on the floor. Take it again. *“{PULSE_HOW}”*"]}),
    ("levels", {
      "green": "Record four pulses and color a bar for each, tally the team’s calls, and finish sentences about when the heart beat fastest and what each mistake costs.",
      "yellow": "Record four pulses, work out each change, graph them, and explain which mistake their team made more often, using poster 1.",
      "red": "Compare the change from waiting with the change from running, design a fairer test of waiting alone, and argue whether the game’s points match the poster’s trade-off."}),
    ("section", {"label": "Debrief · 7 minutes",
      "screen": [
        {"phase": "Debrief", "minutes": 3, "script": [0], "title": "Scared a medium amount", "show": "words", "text": HAUNTED,
         "cite": "What Scares You? · Known or Unknown?",
         "purpose": "See how real scientists used heart rate to study fear.",
         "students": ["Why measure heart rate to study a haunted house?", "When did your own heart race today?"]},
        {"phase": "Debrief", "minutes": 4, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK, "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": objectives_screen(OBJECTIVES)[0], "deeper": objectives_screen(OBJECTIVES)[1]}],
      "body": [f"Read: *“{HAUNTED}”* Ask why scientists would measure heart rate to study a scare, and when the class’s own hearts raced today: waiting, running or both?",
               "Then ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down. Exit ticket: *“Which mistake did your team make more, and why?”*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Tiger or wind?",
      "body": ["Project or print this page, and copy the clue cards for the caller: three tiger cards (use any three of the four) and five wind cards, mostly leaves, one or two blank."]}),
    ("html", CLUEROW),
    ("table", {"head": ["The call", "If it was a tiger", "If it was the wind"], "rows": [
      ["**Run** to the safe line", "Tiger spotted. Well done.", "**Fake alarm:** 1 point, and a run for nothing"],
      ["**Stay** and hold your balance", "**Missed tiger:** 5 points", "Rightly calm. Well done."]]}),
    quote(BY_DESIGN, "Poster 1 · Pareidolia: Seeing Monsters Everywhere"),
    ("section", {"label": "Questions to ask in front of the poster", "list": [
      "Have you ever found that waiting for something was worse than the thing itself?",
      "Why might it be safer to see a fake threat than to miss a real one?",
      "When has your heart raced before a game, a test or a performance? What helped?"]}),
    ("connection", ["**Visit the exhibition:** poster 1 and the two tactile Mystery Fear Boxes in the case. **Online:** *What Scares You?* plays the Rustling Bushes on a screen (try *Guess first* to talk each round over), and has a pulse you can tap."]),
    # after the page to show the class, so the plan keeps to three pages
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**No scares.** Never startle students; the box holds a pinecone and everyone knows a volunteer may say no. Anyone may sit out the box or the running and still keep the data.",
        "**Pulses are private.** Don’t rank or compare students’ numbers; each compares only with their own. A student with a health plan follows it."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Tiger clues:** a striped tail, a tiger-shaped shadow, paw prints, a low growl. **Wind:** leaves blowing, or no clue at all.",
        "**Fake alarm:** you ran, and it was the wind. **Missed tiger:** you stayed, and it was a tiger.",
        "**The trade-off:** a fake alarm costs a run; a missed tiger could cost a life, so the brain leans toward alarms.",
        "**Assess:** four pulses recorded; the exit ticket names a mistake and links it to the alarm."]})]]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Poster 1 says that when you reach into a box you can’t see into, **your heart races before you even touch anything.** Your brain’s alarm is built to be careful: *better to see 100 fake threats than miss one real predator.* Today you measure your own heart."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student data sheet", "title": TITLE,
            "sub": "Grades 5–8 · PE", "level": level, "context": CONTEXT, "css": CSS + QUOTE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 PE · {level.title()} Level", "blocks": blocks, "hero": HERO}

PULSES = ["1. At rest", "2. Waiting for the box", "3. Straight after the game", "4. After a calm minute"]
HOW = ("html", f"<p><b>How:</b> {PULSE_HOW}</p>")
TALLY = ("table", {"head": ["Round", "1", "2", "3", "4", "5", "6", "7", "8"], "rows": [
  ["Our call (T or W)"] + [""] * 8, ["What it was (T or W)"] + [""] * 8]})

def bars():
    """four bars to color, one per pulse, with a scale left blank to fill in"""
    cols = "".join(f'<div><div class="bar"></div><p>{p.split(". ")[0]}</p></div>' for p in PULSES)
    return ('<div class="bars"><div class="scale"><span>high</span><span>low</span></div>' + cols + "</div>")

BAR_CSS = """
.bars { display: grid; grid-template-columns: 30pt repeat(4, 1fr); gap: 12pt; height: 132pt; margin: 4pt 0 8pt; break-inside: avoid; }
.bars .scale { display: flex; flex-direction: column; justify-content: space-between; font: 400 7.5pt 'Outfit'; color: #5F6655; padding-bottom: 16pt; }
.bars > div:not(.scale) { display: grid; grid-template-rows: 1fr auto; }
.bars .bar { border: .8pt solid #1d1c1a; border-radius: 3pt; background: rgba(255,255,255,.55); }
.bars p { margin: 3pt 0 0; text-align: center; font: 500 9pt 'Outfit'; }
"""
TALLY_CSS = ".task:has(.tally) { break-inside: avoid; } .task h3, .task .label { break-after: avoid; } .tally table.fill td, .tally table.fill th { text-align: center; } .tally table.fill td:first-child { text-align: left; width: 26%; } .tally table.fill td { height: 24pt; }"

def tally_task(n, extra_body=None, lines=0):
    return ("task", {"label": f"Part {n}", "title": "Our team’s calls",
            "blocks": [("html", '<p>Write T for tiger or W for wind each round. Then count.</p><div class="tally">'), TALLY, ("html", "</div>")],
            "body": ["**Fake alarms** (we called T, it was W): ______   **Missed tigers** (we called W, it was T): ______"] + (extra_body or []),
            "lines": lines})

GREEN = handout("green", "FL_Handout_Green_PE.pdf", [
  ("task", {"label": "Part 1", "title": "My pulse",
            "blocks": [HOW, ("table", {"head": ["When", "Beats a minute"], "rows": [[p, ""] for p in PULSES]})]}),
  ("task", {"label": "Part 2", "title": "Color my heart rate",
            "blocks": [("html", "<p>Color a bar for each pulse. Make the highest bar the tallest.</p>" + bars())]}),
  tally_task(3),
  ("task", {"label": "Part 4", "title": "Finish the sentences",
            "body": ["**a.** My heart beat fastest ______________________________ .",
                     "**b.** A fake alarm costs a run. A missed tiger costs __________________ .",
                     "**c.** My brain raises fake alarms because…"], "lines": 4}),
  ("task", {"label": "Part 5", "title": "Settle it",
            "body": ["Did your calm minute bring your pulse down? Write one thing you could do before a game or a test when your heart races."], "lines": 3}),
  ("family", ["Teach your family to find their pulse on the wrist or neck. Count yours together, before and after a quick run."]),
], "table.fill td { height: 26pt; } table.fill td:first-child { width: 45%; }" + BAR_CSS + TALLY_CSS)

YELLOW = handout("yellow", "FL_Handout_Yellow_PE.pdf", [
  ("task", {"label": "Part 1", "title": "My pulse, and how it changed",
            "blocks": [HOW, ("table", {"head": ["When", "Beats a minute", "Change from the one before"], "rows": [[PULSES[0], "", "—"]] + [[p, "", ""] for p in PULSES[1:]]})]}),
  ("task", {"label": "Part 2", "title": "Graph it",
            "blocks": [("html", "<p>Plot your four pulses as a line graph. Label both axes and choose your own scale.</p>"), ("draw", "Beats a minute, at each of the four times")]}),
  tally_task(3, ["Which mistake did your team make more often? Use poster 1’s words to explain why a brain might lean that way."], 3),
  ("task", {"label": "Part 4", "title": "Waiting and running",
            "body": ["Did waiting for the box change your pulse? Did the game? Which changed it more, and what might explain that?"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "Settle it",
            "body": ["How much did your calm minute bring your pulse down? Write one thing you could do before a game or a test when your heart races."], "lines": 3}),
  ("family", ["Ask your family when their heart races before something happens. Show them the lab’s Rustling Bushes and play a round."]),
], "table.fill td { height: 26pt; } table.fill td:first-child { width: 38%; } .drawbox { height: 132pt; background: rgba(255,255,255,.4); break-inside: avoid; }" + TALLY_CSS)

RED = handout("red", "FL_Handout_Red_PE.pdf", [
  ("task", {"label": "Part 1", "title": "My data",
            "blocks": [HOW, ("table", {"head": ["When", "Beats a minute", "Change"], "rows": [[PULSES[0], "", "—"]] + [[p, "", ""] for p in PULSES[1:]]})],
            "body": ["Compare the change from **waiting** (1 to 2) with the change from **running** (2 to 3). What does that tell you about the poster’s claim that your heart races *before you even touch anything*?"], "lines": 5}),
  tally_task(2),
  ("task", {"label": "Part 3", "title": "Is the scoring fair?",
            "body": ["A fake alarm cost 1 point; a missed tiger cost 5. Does that match poster 1’s trade-off, *better to see 100 fake threats than miss one real predator*? What would happen to your team’s calls if a missed tiger cost 100?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "A fairer test",
            "body": ["Today the waiting pulse came right after sitting still. Design a better test of whether **waiting alone** raises a pulse. What would you keep the same? What would you compare it with?"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "The haunted house",
            "blocks": [quote(HAUNTED, "What Scares You?")],
            "body": ["Why might scientists measure heart rate to study a scare that people chose? What else would you want to measure?"], "lines": 2}),
  ("family", ["Explain the fake-alarm trade-off to your family. Ask: *when is it worth being careful for nothing?*"]),
], "table.fill td { height: 24pt; } table.fill td:first-child { width: 42%; }" + TALLY_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
