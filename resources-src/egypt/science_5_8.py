"""Grades 5–8 · Science · "Seventy Days"
Mummification as a process of preservation: the eight steps of the
Mummification room, in order, read as a sequence and as data (the room's own
timeline, where natron takes 40 of the 70 days), then a cause-and-effect
question (why take out the moisture?) and a fair test students design for
themselves, with salt and apple slices standing in for natron and a body.

Facts follow app/exhibitions/egypt/mummification/steps.ts (the steps, their
notes and their timeline spans, Herodotus, the jars, the heart, the check)
and egypt.ts (poster 2's Anubis: the patron of embalmers, about 70 days,
natron; mummified cats; Deshret, the hot dry desert). The general science
the activity rests on (decay slows without water; salt draws water out) is
not from the exhibition and the plan says so where it uses it.

Told as the room tells it: plainly and gently. Belief is taught as belief:
"the Egyptians thought"."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (ROOM, GODS, OBJ_CSS, HOOK, TEACH, ACT, CLOSE, wall_hero, review, look_back_say, md)

DIR = "teachers/grades-5-8/science/"
TITLE = "Seventy Days"
SUB = "Grades 5–8 · Science · How the Egyptians preserved a body"
HERO = wall_hero("cat", "center 30%")

# steps.ts, in the room's order: (step name, when, what it did)
STEPS = [
  ("Washing", "Day 1", "The body was washed, to make it pure."),
  ("The brain", "The first days", "The brain was removed through the nose with a long bronze hook, and it was not kept."),
  ("Four jar gods", "The first days", "Each canopic jar had a protective god, one of the four Sons of Horus."),
  ("Canopic jars", "The first days", "The organs came out through a cut in the left side. They were dried, wrapped and put in canopic jars."),
  ("Natron", "40 days", "Bags of natron, a natural salt, were packed inside and outside the body and left for 40 days, until all the moisture had gone."),
  ("Oils", "After the natron", "The body was coated in resin and sweet-smelling oils, to help preserve it."),
  ("Wrapping", "The last weeks", "The linen was wrapped very carefully, with amulets between the layers to protect the body and spirit."),
  ("Into the coffin", "About day 70", "The mummy was ready to be placed in its coffin, or coffins, for the burial ceremony."),
]
JARS = [("Imset", "human", "liver"), ("Hapi", "baboon", "lungs"), ("Duamutef", "jackal", "stomach"), ("Qebehsenuef", "falcon", "intestines")]
HEART = "The heart was left inside the body. The Egyptians thought the heart held a person’s will, feelings and thoughts, and in the afterlife it would be weighed against the feather of truth."
HERODOTUS = "The clearest written account of mummification comes from Herodotus, a Greek historian who visited Egypt in about 450 BC. In the most elaborate and expensive mummifications, he records, the whole process took 70 days."
NATRON = STEPS[4][2]
ROOM_CITE = "Mummification, Step by Step, after the British Museum"

# the room's own timeline (steps.ts spans), as shares of the seventy days
SEGS = [("1–4", 0, .06, "first"), ("Natron", .06, .63, "natron"), ("Oils", .63, .70, "oils"),
        ("Wrapping", .70, .97, "wrap"), ("8", .97, 1, "coffin")]

def timeline(hide=False, big=False):
    segs = "".join(
        f'<div class="seg {k}" style="width:{(b - a) * 100:.1f}%"><span>{"?" if hide and k == "natron" else n}</span></div>'
        for n, a, b, k in SEGS)
    return ("html", f'<div class="tl{" big" if big else ""}"><div class="bar">{segs}</div>'
                    '<div class="ax"><span>Day 1</span><span>Day 70</span></div></div>')

def steps_table(cols=("Step", "When", "What it did"), which=range(8)):
    rows = "".join(f"<tr><td><b>{i + 1}</b> {STEPS[i][0]}</td><td>{STEPS[i][1]}</td><td>{md(STEPS[i][2])}</td></tr>" for i in which)
    return ("html", f'<table class="steps"><thead><tr>{"".join(f"<th>{c}</th>" for c in cols)}</tr></thead><tbody>{rows}</tbody></table>')

def jars_html():
    return ("html", '<table class="steps jars"><thead><tr><th>Jar god</th><th>Head</th><th>Organ it protected</th></tr></thead><tbody>'
            + "".join(f"<tr><td><b>{g}</b></td><td>{h}</td><td>{o}</td></tr>" for g, h, o in JARS) + "</tbody></table>")

def P(t):
    return ("html", f"<p>{md(t)}</p>")

def note(t, cite=ROOM_CITE):
    return ("html", f'<blockquote class="note">{md(t)}<small>{cite}</small></blockquote>')

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("put the eight steps of mummification in order and say what each step was for",
     "put the steps in order and say what each was for?", False),
    ("read the seventy days as data: what share of the time the natron took",
     "say what share of the seventy days the natron took?", False),
    ("explain, with evidence, why taking out the moisture helped preserve the body",
     "explain why taking out the moisture helped preserve the body?", False),
    ("design a fair test of drying with salt, naming what to change, measure and keep the same",
     "design a fair test of drying with salt?", True)],
  "why": "People have kept things from rotting for thousands of years. The Egyptians’ seventy days are a careful process with a reason behind most steps, and asking why each step works is how a scientist thinks."}

CSS = OBJ_CSS + """
.tl { margin: 6pt 0 10pt; break-inside: avoid; }
.tl .bar { display: flex; height: 26pt; border: .8pt solid #1d1c1a; border-radius: 3pt; overflow: hidden; }
.tl .seg { display: flex; align-items: center; justify-content: center; border-right: .8pt solid #1d1c1a; font: 500 7.5pt 'Outfit'; letter-spacing: .04em; overflow: hidden; white-space: nowrap; }
.tl .seg:last-child { border-right: 0; }
.tl .first { background: #e9dfc6; } .tl .natron { background: #f6f1e4; font-size: 10pt; }
.tl .oils { background: #d9c08a; } .tl .wrap { background: #ece6d6; } .tl .coffin { background: #b58a3c; color: #fff; }
.tl .ax { display: flex; justify-content: space-between; font: 500 7.5pt 'Outfit'; color: #5b5a55; margin-top: 2pt; }
.tl.big .bar { height: 40pt; } .tl.big .seg { font-size: 9pt; } .tl.big .natron { font-size: 13pt; }
table.steps { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin: 4pt 0 8pt; break-inside: avoid; }
table.steps th { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: .8pt solid #1d1c1a; padding: 3pt 5pt; }
table.steps td { border-bottom: .5pt solid #d8d0b8; padding: 3.5pt 5pt; vertical-align: top; }
table.steps td:first-child { white-space: nowrap; } table.steps td:nth-child(2) { white-space: nowrap; color: #5b5a55; }
table.steps td b { font: 600 11pt 'Cormorant Garamond', serif; color: var(--gold-text); margin-right: 3pt; }
table.jars td b { color: #1d1c1a; }
.note { font: italic 400 12pt/1.4 'Cormorant Garamond', serif; border-left: 2.5pt solid var(--accent); padding: 3pt 0 3pt 12pt; margin: 4pt 0 6pt; break-inside: avoid; }
.note small { display: block; font: 400 7.5pt 'Outfit'; letter-spacing: .1em; text-transform: uppercase; color: #5b5a55; font-style: normal; margin-top: 3pt; }
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 5pt 8pt; margin: 4pt 0 6pt; break-inside: avoid; }
.cards div { display: grid; grid-template-columns: 24pt 1fr; align-items: center; border: .8pt solid #1d1c1a; border-radius: 3pt; padding: 4pt 6pt 4pt 0; font-size: 9.5pt; }
.cards div::before { content: ""; width: 14pt; height: 14pt; border: .8pt solid #1d1c1a; border-radius: 50%; justify-self: center; }
.cards b { font: 600 10.5pt 'Cormorant Garamond', serif; margin-right: 3pt; }
.wm { display: grid; grid-template-columns: 1fr 30pt 1.4fr; gap: 6pt 6pt; align-items: center; font-size: 10pt; margin: 4pt 0 6pt; break-inside: avoid; }
.wm .a { font: 600 11.5pt 'Cormorant Garamond', serif; text-align: right; } .wm .d { display: flex; justify-content: space-between; }
.wm .d::before, .wm .d::after { content: ""; width: 7pt; height: 7pt; border-radius: 50%; background: #1d1c1a; }
.slices { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 4pt 0 4pt; break-inside: avoid; }
.slices div { border: .8pt solid #1d1c1a; border-radius: 3pt; height: 92pt; padding: 4pt 6pt; font: 500 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; color: #5b5a55; }
.anubis { display: flex; gap: 12pt; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.anubis img { width: 120pt; border-radius: 3pt; } .anubis p { font-size: 9.5pt; }
"""

# ── lesson mode ────────────────────────────────────────────────────────
ROOM_ALT = "The Mummification room: a simple figure lies on a wooden table above four canopic jars, beside a timeline of the seventy days and the step’s notes"
STEPS_CHART = {"caption": "The seventy days, step by step", "columns": ["Step", "When", "What it did"],
               "rows": [{"cells": [f"{i + 1}. {n}", w, t]} for i, (n, w, t) in enumerate(STEPS)]}

LESSON = {
  "slug": "seventy-days",
  "out": DIR + "EGY_LP_Science.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Science", "hero": HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Activity", 20, ACT), ("Debrief", 7, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will follow the seventy days of mummification as the exhibition tells them, after the British Museum: eight steps, from washing to the coffin. They will read the room’s timeline as data, find that drying in natron took 40 of the 70 days, explain why taking out the moisture mattered, and design a fair test of drying with salt."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Science practices** — using a model; analyzing data; planning a fair test",
        "**Crosscutting concepts** — cause and effect; stability and change",
        "**Math link** — fractions and percentages of a whole",
        "**Social Studies link** — what the Egyptians believed, and why they cared for the dead"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the timeline and the eight steps",
      "Differentiated handouts, one per student. *Optional, to run the test:* an apple, table salt, small cups, a kitchen scale"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Which step took longest?",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": ROOM["mummification"]}, "alt": ROOM_ALT, "fit": "contain",
                 "caption": "Mummification, Step by Step",
                 "purpose": "Guess before anyone explains: which part of the seventy days took longest, and why?",
                 "students": ["The finest mummies took about seventy days. Which step do you think took longest?", "Why would any step need weeks?"]},
      "body": ["Show the room and read its first line: *“The finest mummies took about seventy days to make.”* Ask students to guess, on their own, which step took longest, and to write one reason. Take a few guesses. Do not give the answer yet: *“Today we find out from the evidence, and then ask why.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "The steps, then the data",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Eight steps", "show": "chart", **STEPS_CHART,
         "purpose": "Walk through the eight steps in order, plainly and gently.",
         "students": ["Which steps were about cleaning or drying?", "Which organ was left inside?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Forty days out of seventy", "show": "worked",
         "examples": [{"title": "What share of the seventy days was natron?",
                       "steps": ["Natron took 40 of the 70 days.", "40 ÷ 70 = 4 ÷ 7, which is about 0.57.",
                                 "Everything else together took the other 30 days."],
                       "answer": "A little more than half: about 57%"}],
         "purpose": "Read the room’s timeline as data, and check the hook guesses.",
         "students": ["Was your guess right?", "What fraction of the time was left for everything else?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "What was the natron doing?", "show": "words", "text": NATRON, "cite": ROOM_CITE,
         "purpose": "Name the cause and effect: natron took out the moisture.",
         "students": ["What did the natron take away?", "Why might a body that is dry last longer?"]}],
      "body": ["Take the steps in order from page 3, plainly. Herodotus, a Greek historian who visited Egypt about 450 BC, gives the clearest written account; he says the most elaborate mummifications took 70 days. The brain was drawn out through the nose with a long bronze hook (the British Museum has one, made after 664 BC). The organs came out through a cut in the left side, were dried and wrapped, and went into four canopic jars, each protected by a god. **The heart was left inside:** the Egyptians thought it held a person’s will, feelings and thoughts.",
               "Now the timeline. Students check their guesses: natron took **40 of the 70 days**, about 57%, a little more than half.",
               "Read the natron note and underline *until all the moisture had gone*. Ask why drying might stop a body from decaying. Then give the general science, which is not from the exhibition: decay is mostly the work of tiny living things, and they need water. Take the water away and decay slows, which is why people have long salted and dried food."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Steps, data and a fair test",
                 "purpose": "Work with the steps and the timeline, then plan a test of drying with salt, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red.", "All three end by planning or predicting a test with salt."]},
      "body": ["Students choose a handout. All three use the same steps and timeline and end with a salt test, predicted or planned. If you run it, slice one apple, pack some slices in table salt (standing in for natron) and leave others open, and compare them over a week. Nobody eats the slices."]}),
    ("levels", {
      "green": "Put the steps in order, find the longest step on the timeline, match each step to its job, and predict what salt will do to an apple slice.",
      "yellow": "Work out natron’s share of the seventy days, sort each material’s job as preserving or protecting by belief, and plan a fair test with one change, one measurement and what stays the same.",
      "red": "Argue a claim with evidence that drying did most to preserve the body, design a full fair test with a measurement and repeat trials, name its limits, and ask what evidence besides Herodotus could show how mummies were made."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Science and belief",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Testable, or belief?", "show": "question",
         "question": "Which steps could a scientist test today? Which were about what the Egyptians believed?",
         "purpose": "Separate what an experiment can check from what was a matter of belief, with respect for both.",
         "students": ["Name one step you could test with an experiment.", "Name one step that was about protection by the gods."]},
        review(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Ask which steps a scientist could test today (washing, drying in natron, the resin and oils) and which were about belief (the jar gods, the amulets between the layers, the heart kept for the weighing). Both mattered to the embalmers: poster 2 calls Anubis, their patron god, gentle and caring, a god who made sure the dead were treated with respect.",
               look_back_say(OBJECTIVES, "a Red Level student, who explains one variable in their fair test")]}),
    ("cols", [[("section", {"label": "Answer notes and assessment", "list": [
      "**Order:** washing, the brain, the jar gods, canopic jars, natron, oils, wrapping, the coffin.",
      "**Data:** 40 of 70 days = 4/7, about 57%; 30 days left.",
      "**Cause and effect:** natron took out the moisture; resin and oils helped preserve; washing made the body pure.",
      "**Fair test:** change salt or no salt; measure mass or look; keep the same apple, slice size, place and time.",
      "**Exit ticket:** *why the natron step took longest.*"]})],
              [("connection", ["**Virtual visit:** open *Mummification, Step by Step*. Do each of the eight steps by hand, then take the room’s three-question check.",
                               "**Poster 2**, *Gods and Goddesses*: Anubis, patron god of embalmers. Some pet cats were even mummified, to stay with their owners in the afterlife."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The seventy days", "body": ["Project or print this page. Cover the timeline’s labels for the hook if you like."]}),
    timeline(big=True),
    steps_table(),
    jars_html(),
    ("html", f'<div class="anubis"><img src="{GODS["anubis"]["img"]}" alt="{GODS["anubis"]["alt"]}"><p>{md("**Anubis**, as poster 2 shows him: the patron god of embalmers, the people who prepared mummies. *“The body was dried out with a natural salt called natron, but the heart was usually left inside.”*")}</p></div>'),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In ancient Egypt, the finest mummies took about seventy days to make. Embalmers worked through the steps by hand, in order. The Egyptians believed in an afterlife, and took great care of the dead. Use the room’s steps and its timeline as your evidence."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Science", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Science · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": CSS + css}

SCRAMBLE = [5, 0, 7, 3, 6, 1, 4, 2]   # natron, washing, coffin, canopic jars, wrapping, brain, oils, jar gods
def cards():
    return ("html", '<div class="cards">' + "".join(
        f"<div><span><b>{STEPS[i][0]}</b> {md(STEPS[i][2])}</span></div>" for i in SCRAMBLE) + "</div>")

GREEN = handout("green", "EGY_Handout_Green_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Put the steps in order", "blocks": [
            P("The eight steps are mixed up. Write **1** to **8** in the circles, from the first step to the last. *Hint:* washing came first, and the coffin came last."),
            cards()]}),
  ("task", {"label": "Part 2", "title": "Read the timeline", "blocks": [
            P("This bar is the seventy days. Each box is a step, and a longer box means a longer step. One label is hidden."),
            timeline(hide=True),
            P("Which step is the **?** box? How many days did it take?")], "lines": 2}),
  ("task", {"label": "Part 3", "title": "What was each step for?", "blocks": [
            P("Draw a line from each thing the embalmers used to its job."),
            ("html", '<div class="wm">'
             '<span class="a">washing</span><span class="d"></span><span>to protect the body and spirit</span>'
             '<span class="a">natron, a natural salt</span><span class="d"></span><span>to make the body pure</span>'
             '<span class="a">resin and oils</span><span class="d"></span><span>to take out all the moisture</span>'
             '<span class="a">amulets in the linen</span><span class="d"></span><span>to help preserve it</span></div>')]}),
  ("task", {"label": "Part 4", "title": "Predict: salt and an apple", "blocks": [
            P("Two slices of apple sit for one week. One is packed in salt. One is left open. Draw what you think each will look like."),
            ("html", '<div class="slices"><div>Packed in salt</div><div>Left open</div></div>'),
            P("Why do you think so?")], "lines": 2}),
  ("task", {"label": "Part 5", "title": "One organ was left inside the body. Which one, and why did the Egyptians think it mattered?", "lines": 2}),
], ".task:has(.tl) { break-inside: avoid; } .slices div { height: 80pt; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_Science.pdf", [
  ("task", {"label": "Part 1", "title": "The seventy days as data", "blocks": [
            timeline(),
            P("Natron took **40** of the **70** days. Write that as a fraction in simplest form, then as a percentage. How many days were left for every other step together? Why might drying take the longest?")], "lines": 6}),
  ("task", {"label": "Part 2", "title": "What did each thing do?", "blocks": [
            P("Use the steps. Write each thing’s job, then write **P** if it helped preserve the body, or **B** if it was about protection by belief."),
            ("table", {"head": ["Thing the embalmers used", "Its job", "P or B"], "rows": [
              ["Natron", "", ""], ["Resin and oils", "", ""], ["Canopic jars, each with a god", "", ""], ["Amulets between the linen", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "Plan a fair test", "blocks": [
            P("Question: *Does packing an apple slice in salt dry it out more than leaving it open?*"),
            ("table", {"head": ["", "Your plan"], "rows": [
              ["What I will **change**", ""], ["What I will **measure** or look for", ""], ["Three things I will keep **the same**", ""]]}),
            P("I predict … because …")], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Why take out the moisture?", "blocks": [
            note(NATRON),
            P("Explain why the embalmers spent so long taking out the moisture. Use the note and your own science knowledge.")], "lines": 3}),
], ".task { break-inside: avoid; } table td { height: 28pt; } table td:first-child { width: 40%; }")

RED = handout("red", "EGY_Handout_Red_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Claim, evidence, reasoning", "blocks": [
            timeline(),
            P("**Claim:** *drying in natron did more than any other step to preserve the body.* Give two pieces of evidence from the steps and the timeline (include natron’s share of the seventy days as a percentage), then the reasoning that links them to the claim. Name one step that also helped preserve the body, and say how it adds to or weakens the claim.")], "lines": 8}),
  ("task", {"label": "Part 2", "title": "Design a fair test", "blocks": [
            P("Design an investigation into whether salt dries an apple slice faster. Name the **independent variable**, the **dependent variable** and how you will measure it (a number, not just a look), at least three **controlled variables**, and how many trials you will run and why.")], "lines": 7}),
  ("task", {"label": "Part 3", "title": "The limits of a model", "blocks": [
            P("An apple slice in table salt is a model of a body in natron. Give two ways the model is different from the real thing, and say how each might change what you could conclude.")], "lines": 4}),
  ("task", {"label": "Part 4", "title": "How do we know?", "blocks": [
            note(HERODOTUS),
            P("Herodotus was a visitor writing about 450 BC. Which steps could a scientist test today, and which were about belief? Besides his account, what other kinds of evidence could show how mummies were made? (Hint: the British Museum holds one of the embalmers’ long bronze hooks.)")], "lines": 5}),
], ".task { break-inside: avoid; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
