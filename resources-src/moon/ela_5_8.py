"""Grades 5–8 ELA · "Weighing the Evidence"
Poster 1, Our Incredible Moon: the Apollo 11 paragraph is a short argument,
with a claim, a counterclaim, evidence and a conclusion. Students take it
apart, weigh its evidence (with the panels added beside it: the samples, the
prisms and lasers, the orbiter's photographs) and write a claim, evidence
and reasoning paragraph. Red compares it with poster 2's "Dark Forest"
idea, which the exhibition's own note calls an untested hypothesis.
Facts: app/exhibitions/moon/moon.ts (poster 1, poster 2, MOON_NOTES)."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (POSTER1, MOONRISE, EAGLE, P2, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, quote, review)

DIR = "teachers/grades-5-8/ela/"
TITLE = "Weighing the Evidence"
SUB = "Grades 5–8 ELA · Our Incredible Moon · Claim, counterclaim and evidence"
HERO = {"img": MOONRISE, "pos": "center 65%"}

# poster 1, word for word
A1 = "In 1969, humans achieved the remarkable feat of landing on the Moon during NASA’s Apollo 11 mission. Some people have questioned whether the Moon landings were real, but there’s strong evidence proving this happened."
A2 = "For example, the astronauts brought back Moon rocks that are very different from any rocks found on Earth. These rocks have unique features that couldn’t be faked or created on our planet."
A3 = "Additionally, the missions were tracked by scientists around the world. All this evidence confirms that humans truly did land on the Moon in 1969."
SAMPLES = "Between 1969 and 1972, six Apollo missions brought back 842 pounds (382 kilograms) of Moon rocks, pebbles, sand, and dust: 2,200 separate samples in all. Twelve astronauts walked on the Moon."
LASER = "Apollo 11 left a panel of 100 small glass prisms on the Moon. Scientists still fire lasers at it today and time the light’s trip back, to measure the distance to the Moon to within a few millimeters. NASA’s Lunar Reconnaissance Orbiter has also photographed all six Apollo landing sites from above, where the landers and even the astronauts’ boot tracks can be seen."
TALK = "Some people have questioned whether the Moon landings were real. When you hear a surprising claim, what kinds of evidence would help you decide whether to believe it?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find the claim, the counterclaim, the evidence and the conclusion in a short argument",
     "find the claim, counterclaim, evidence and conclusion in an argument?", False),
    ("judge which evidence is strongest, and explain why",
     "judge which evidence is strongest, and say why?", False),
    ("write a paragraph that states a claim, gives evidence and explains the reasoning",
     "write a claim, evidence and reasoning paragraph?", False),
    ("tell a claim backed by evidence from an idea that has not been tested, and explain why the words matter",
     "tell a claim backed by evidence from an untested idea?", True)],
  "why": "Every day we meet surprising claims. Knowing how to weigh evidence, and how to answer someone who doubts, is how a careful reader decides what to believe."}

# ── on the classroom screen ────────────────────────────────────────────
CHART = {"caption": "The evidence on the poster, and beside it", "columns": ["Evidence", "Who could check it?", "Can it be checked today?"],
         "rows": [{"cells": ["Moon rocks unlike any on Earth", "Scientists who study rocks", "?"]},
                  {"cells": ["842 pounds, 2,200 samples", "Laboratories", "?"]},
                  {"cells": ["Tracked by scientists around the world", "Scientists in many countries", "?"]},
                  {"cells": ["Glass prisms that reflect lasers", "Scientists with lasers", "?"]},
                  {"cells": ["Photographs of the landing sites", "Anyone who sees them", "?"]}]}

CSS = BASE_CSS + """
table.fill td { height: 24pt; }
.sorter { width: 100%; border-collapse: collapse; font-size: 9.6pt; margin: 4pt 0 8pt; }
.sorter th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: center; border-bottom: 1pt solid var(--accent); padding: 3pt 4pt; }
.sorter th:first-child { text-align: left; }
.sorter td { border-bottom: .5pt solid #d8d0b8; padding: 5pt 4pt; vertical-align: middle; }
.sorter td.bx { width: 54pt; text-align: center; }
.sorter td.bx span { display: inline-block; width: 13pt; height: 13pt; border: 1pt solid #1d1c1a; border-radius: 2pt; background: rgba(255,255,255,.6); }
.frame { border: 1pt solid #1d1c1a; border-radius: 6pt; padding: 7pt 10pt 4pt; margin: 4pt 0 9pt; background: rgba(255,255,255,.5); }
.frame p { margin: 0 0 4pt; font-size: 10pt; }
.frame .ln { border-bottom: .8pt solid #a9a69b; height: 20pt; }
.frame b { font: 500 7.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); }
.para p { font-size: 10pt; line-height: 1.85; margin: 0 0 6pt; }
.para.box { border: 1pt solid #1d1c1a; border-radius: 6pt; padding: 6pt 10pt 2pt; background: rgba(255,255,255,.55); margin: 4pt 0 8pt; }
.para .src { font: 500 7pt Outfit; letter-spacing: .18em; text-transform: uppercase; color: #5F6655; line-height: 1.2; }
.crop { width: 230pt; height: 212pt; overflow: hidden; position: relative; border-radius: 6pt; border: 1pt solid #1d1c1a; }
.crop img { position: absolute; width: 543pt; left: -298pt; top: -371pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

def sorter(rows, cols=("Claim", "Counterclaim", "Evidence", "Conclusion")):
    head = "<th>Sentence from the poster</th>" + "".join(f"<th>{c}</th>" for c in cols)
    body = "".join(f"<tr><td>{r}</td>" + "".join('<td class="bx"><span></span></td>' for _ in cols) + "</tr>" for r in rows)
    return ("html", f'<table class="sorter"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')

def frame(parts):
    return ("html", '<div class="frame">' + "".join(
        f'<p><b>{k}</b> {v}</p>' + '<div class="ln"></div>' * n for k, v, n in parts) + "</div>")

SENTENCES = [
  "Some people have questioned whether the Moon landings were real…",
  "…but there’s strong evidence proving this happened.",
  "The astronauts brought back Moon rocks that are very different from any rocks found on Earth.",
  "The missions were tracked by scientists around the world.",
  "All this evidence confirms that humans truly did land on the Moon in 1969."]

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "weighing-the-evidence",
  "out": DIR + "MOON_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 13, "#2F4A5A"), ("Activity", 20, "#86671A"), ("Debrief", 7, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the poster’s paragraph about Apollo 11 as a short argument: a claim, a counterclaim it answers, evidence, and a conclusion. They will weigh each piece of evidence, including the panels the exhibition adds beside it, and write their own claim, evidence and reasoning paragraph. At Red, they will set the poster’s argument beside an idea it calls a *theory* that the exhibition’s own note calls an untested hypothesis."]}),
    ("section", {"label": "Standards", "list": [
      "**Reading informational text** — trace and evaluate the argument and claims in a text; judge whether the evidence is relevant and sufficient (RI.6.8, RI.7.8, RI.8.8)",
      "**Writing** — write arguments to support claims with clear reasons and relevant evidence; acknowledge and answer opposing claims (W.6.1, W.7.1, W.8.1)",
      "**Language** — the precise meaning of words such as *theory*, *hypothesis*, *evidence* and *confirm* (L.6.4, L.8.5)"]}),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the paragraph as it appears on the poster",
      "Highlighters in two colors (Yellow and Red levels); differentiated handouts, one per student"]}),
    ("section", {"label": "Cross-curricular and assessment notes", "body": [
      "**Science:** what makes evidence strong; samples, lasers and photographs. **Assessment:** the paragraph each student writes, scored for a clear claim, two pieces of evidence, reasoning that links them, and (Yellow and Red) a fair answer to the counterclaim."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "“The Eagle has landed.”",
      "screen": {"phase": "Hook", "show": "listen", "clips": [EAGLE],
                 "question": "July 20, 1969. How do we know this really happened?",
                 "purpose": "Hear the moment itself, then turn to the question of evidence.",
                 "students": ["Listen: this was sent back from the Moon.", "How do we know it really happened?"]},
      "body": ["Play the recording of July 20, 1969: Neil Armstrong and Buzz Aldrin landed in the Sea of Tranquility while Michael Collins circled the Moon. Then ask: *“How do we know this really happened?”* Take answers without judging. Some students may have heard people say it did not. *“Today we read how the poster answers them, and decide whether its answer is strong.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "An argument, taken apart",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Claim and counterclaim", "show": "words", "text": A1,
         "cite": "Our Incredible Moon",
         "purpose": "Find the claim, and the counterclaim it answers.",
         "students": ["What does the writer want us to believe?", "Whose view does the writer answer?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "The evidence", "show": "words", "text": A2 + " " + A3,
         "cite": "Our Incredible Moon",
         "purpose": "Find the evidence and the conclusion.",
         "students": ["What two pieces of evidence are given?", "Which words signal evidence? Which signal the conclusion?"]},
        {"phase": "Teach", "minutes": 5, "script": [2], "title": "Strong or weak?", "show": "chart", **CHART,
         "purpose": "Weigh the evidence, with the panels the exhibition adds beside the paragraph.",
         "students": ["Which evidence could you check today?", "Which is strongest? Why?"]}],
      "body": [
        "**Claim and counterclaim.** Read the paragraph’s opening. The **claim**: humans landed on the Moon in 1969, and there is strong evidence. The **counterclaim**, the view it answers: *“Some people have questioned whether the Moon landings were real.”* Notice *but*: it turns from the doubt to the answer.",
        "**Evidence and conclusion.** *For example* and *Additionally* signal two pieces of **evidence**: the Moon rocks, unlike any on Earth, and the tracking by scientists around the world. *All this evidence confirms* signals the **conclusion**.",
        "**Weigh it.** The exhibition adds panels beside the paragraph: *“" + SAMPLES + "”* And: *“" + LASER + "”* Fill in the chart together. Strong evidence can be checked by others, especially today, and does not depend on trusting one person. Ask: is the poster’s paragraph stronger with the panels, or without them?"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Take an argument apart and write one, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three end with a paragraph of your own."]},
      "body": ["Students choose a handout. All three take the poster’s argument apart and end with a paragraph of their own."]}),
    ("levels", {
      "green": "Sort five sentences from the poster into claim, counterclaim, evidence and conclusion. Pick the two strongest pieces of evidence. Write a paragraph with a sentence frame.",
      "yellow": "Rank five pieces of evidence and explain each choice. Write a paragraph that states a claim, uses two pieces of evidence and answers the counterclaim.",
      "red": "Judge which evidence could be checked today. Compare the Apollo argument with the *Dark Forest* idea and the note beside it. Write an argument that answers the doubters fairly."}),
    ("cols", [
      [("section", {"label": "Debrief · 7 minutes",
        "screen": [
          review(OBJECTIVES, 3, [0], hint=THUMBS, phase="Debrief"),
          {"phase": "Debrief", "minutes": 4, "script": [1], "title": "Surprising claims", "show": "question", "question": TALK,
           "purpose": "Carry the lesson beyond the Moon: how to weigh any surprising claim.",
           "students": ["Think of a surprising claim you have heard.", "What evidence would change your mind?"]}],
        "body": ["Ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down.",
                 "Close with the poster’s own question, on the screen. Two or three students share; listen for *checked by others* and *can be checked today*."]})],
      [("connection", ["**On the poster** *Our Incredible Moon*, find the paragraph beginning *In 1969* and the panels beside it: the samples, the prisms and the photographs of the landing sites. On *Another Earth*, find the Dark Forest paragraph and the note beneath it."])]]),
    ("pagebreak", None),
    ("cols", [
      [("section", {"label": "Show your class", "title": "The paragraph on the poster",
                    "body": ["The paragraph about Apollo 11 as it appears on the printed poster *Our Incredible Moon*. Ask students to find the claim, the counterclaim, the evidence and the conclusion."]}),
       ("html", f'<div class="crop"><img src="{POSTER1}" alt=""></div><p class="pcredit"><b>Poster</b> Our Incredible Moon, the Mini Museum</p>')],
      [("section", {"label": "Answer notes", "list": [
        "**Green, sorting:** 1 counterclaim; 2 claim; 3 and 4 evidence; 5 conclusion.",
        "**Strongest evidence:** any choice, with a reason. Strong answers prefer evidence that others can check today, such as the samples in laboratories, the prisms that still reflect lasers, and the photographs of the landing sites.",
        "**Weakest:** the tracking is real evidence, but a reader today has to trust the record of it.",
        "**Red, Dark Forest:** the poster calls it a *theory*; the note calls it *an untested hypothesis, not a scientific theory backed by evidence*. The Apollo claim is backed by evidence anyone can check; the Dark Forest idea is one proposed answer to a question, with no evidence yet."]})]]),
    quote(P2["dark"], "Another Earth"),
    quote(P2["dark_note"], "Another Earth · Did you know?"),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["On July 20, 1969, Neil Armstrong and Buzz Aldrin landed on the Moon. Some people have questioned whether it was real. The poster *Our Incredible Moon* answers them with evidence. Is its answer strong? Today you weigh the evidence."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 ELA · Our Incredible Moon", "level": level, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

GREEN = handout("green", "MOON_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Sort the sentences",
            "blocks": [P("Each sentence comes from the poster. Tick the box that says what each one does."),
                       sorter(SENTENCES)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "The strongest evidence",
            "blocks": [P("Here is all the evidence the exhibition gives. Circle the <b>two</b> pieces you think are strongest."),
                       ("html", '<ol style="font-size:10pt;margin:2pt 0 8pt 16pt;padding:0;line-height:1.6">'
                                '<li>Moon rocks that are very different from any rocks found on Earth</li>'
                                '<li>842 pounds of rocks, pebbles, sand and dust: 2,200 samples</li>'
                                '<li>The missions were tracked by scientists around the world</li>'
                                '<li>Glass prisms on the Moon that scientists still bounce lasers off today</li>'
                                '<li>Photographs from above of all six landing sites, with boot tracks</li></ol>')],
            "body": ["Why did you choose them? Finish the sentence: **These are strongest because…**"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Your paragraph",
            "blocks": [P("Use the frame to write your own paragraph."),
                       frame([("Claim", "Humans really did land on the Moon in 1969.", 0),
                              ("Evidence 1", "One piece of evidence is…", 2),
                              ("Evidence 2", "Another piece of evidence is…", 2),
                              ("Reasoning", "This evidence shows the landing was real because…", 2),
                              ("Conclusion", "So…", 1)])]}),
  ("family", ["Play your family a game: tell them a surprising fact, and ask what evidence would convince them. Then tell them the evidence that humans landed on the Moon."]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Take the argument apart",
            "blocks": [("html", f'<div class="para box"><p>{A1} {A2} {A3}</p><p class="src">Our Incredible Moon</p></div>')],
            "body": ["Underline the **claim**. Put brackets around the **counterclaim**. Number each piece of **evidence**. Circle the words that signal evidence and the conclusion."]}),
  ("task", {"label": "Part 2", "title": "Rank the evidence",
            "blocks": [P("Number the evidence from 1 (strongest) to 5 (weakest). Give a reason for each."),
                       ("table", {"head": ["Evidence", "Rank", "Why?"], "rows": [
                         ["Moon rocks unlike any on Earth", "", ""],
                         ["842 pounds, 2,200 samples", "", ""],
                         ["Tracked by scientists around the world", "", ""],
                         ["Glass prisms that still reflect lasers", "", ""],
                         ["Photographs of all six landing sites", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "Your paragraph",
            "body": ["Write a paragraph of five to seven sentences. State your claim, use your **two strongest** pieces of evidence, explain how they prove it, and answer the people who doubt it fairly and without insults. Begin: *Some people have questioned…*"], "lines": 14}),
  ("family", ["Ask your family: when you hear a surprising claim, what kind of evidence would make you believe it? Compare their answer with yours."]),
])

RED = handout("red", "MOON_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Then and today",
            "blocks": [P("Some evidence could be checked only in 1969. Some can still be checked today. Sort the five pieces of evidence."),
                       ("table", {"head": ["Evidence", "Then, today, or both?", "Who could check it?"], "rows": [
                         ["Moon rocks unlike any on Earth", "", ""],
                         ["842 pounds, 2,200 samples", "", ""],
                         ["Tracked by scientists around the world", "", ""],
                         ["Glass prisms that still reflect lasers", "", ""],
                         ["Photographs of all six landing sites", "", ""]]})],
            "body": ["Why is evidence that can be checked again stronger?"], "lines": 3}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Theory or hypothesis?",
            "blocks": [quote(P2["dark"], "Another Earth"), quote(P2["dark_note"], "Another Earth · Did you know?")],
            "body": ["The poster calls the Dark Forest idea a *theory*. The note calls it *an untested hypothesis*. What is the difference? Why might the exhibition have added the note? How is the Apollo claim different?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Answer the doubters",
            "body": ["Write an argument of two paragraphs. In the first, state your claim and give your strongest evidence, with reasoning. In the second, state the counterclaim fairly, as its believers would, and answer it. Choose your words with care: *proves*, *confirms*, *suggests*."], "lines": 11}),
  ("family", ["Ask your family about a claim they once believed and later changed their mind about. What evidence changed it?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
