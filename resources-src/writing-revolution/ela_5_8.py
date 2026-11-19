"""Grades 5–8 · ELA · "Chipping at the Gates"
Poster 1, "The Writing Revolution", read as an argument: its claim, its
evidence, the challenges it admits, its word choice and its metaphors; and
revision on the two machines of the Typing Station. Every quotation is the
poster's own sentence from app/exhibitions/writing-revolution/writingRevolution.ts;
the station's behavior is from typing-station/stationText.ts."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

DIR = "teachers/grades-5-8/ela/"
TITLE = "Chipping at the Gates"
SUB = "Grades 5–8 · ELA · Reading an argument, choosing words"

HERO = W.HERO_P1_URANIA
HERO_HANDOUT = W.HERO_P1_TITLE

HOOK_Q = "Which words describe breaking something?"
CLOSE_Q = "Which single word in the poster does the most work? Why that one?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("identify the claim, evidence and complications in a nonfiction argument",
     "find the claim, the evidence and the complications in the poster?", False),
    ("explain how a writer’s word choice, such as *shattered* and *obliterated*, shapes a reader’s view",
     "explain how words like shattered and obliterated shape what you think?", False),
    ("describe how the tools of writing change the way a writer revises",
     "describe how a typewriter and a computer change the way you revise?", False),
    ("write a short argument that answers the poster’s question about AI writing tools, with a counterclaim",
     "write your own argument about AI writing tools, with a counterclaim?", True)],
  "why": "Every argument you read was built from choices. Seeing those choices lets you agree, disagree, and build your own."}

# The poster's argument, move by move, in its own sentences.
MAP = [
  ("Claim", Q["privilege"] + " " + Q["shattered"]),
  ("Evidence", "The printing press around 1440; the typewriter in 1868; word processors in the 1970s; PageMaker in 1985; Blogger in 1999 and Wikipedia in 2001."),
  ("Complication", Q["challenges"]),
  ("Open question", Q["ai"]),
  ("Conclusion", Q["gates"]),
]
MAP_SCREEN = {"caption": "How The Writing Revolution builds its argument",
              "columns": ["Move", "What the poster says"],
              "rows": [{"cells": [m, t]} for m, t in MAP]}

BREAKING = ["shattered", "computer", "gates"]

CSS = W.QUOTE_CSS + """
table.am { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.am th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.am td { border-bottom: .6pt solid #b9b5aa; padding: 4.5pt 8pt 4.5pt 0; vertical-align: top; }
table.am td:first-child { width: 22%; font-weight: 500; }
table.am td.blank { height: 34pt; }
table.am td.circ { font: 500 9.5pt 'Outfit'; letter-spacing: .04em; color: #1d1c1a; padding-top: 10pt; padding-bottom: 14pt; white-space: nowrap; width: 30%; }
"""


def table(head, rows, blank=()):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join('<td class="blank"></td>' if i in blank else f"<td>{c}</td>" for i, c in enumerate(r)) + "</tr>" for r in rows)
    return ("html", f'<table class="am"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>')


# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "chipping-at-the-gates",
  "out": DIR + "WR_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": CSS + W.OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, W.SAGE), ("Teach", 13, W.SLATE), ("Activity", 20, W.GOLD), ("Debrief", 7, W.RUST)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the exhibition’s poster *The Writing Revolution* as an argument rather than a list of facts. They will trace its claim, its evidence, the challenges it admits and the question it leaves open; notice how strong verbs such as *shattered*, *obliterated* and *chipped away* and the metaphor of gates shape the reader’s view; and see, at the Typing Station, how a typewriter and a computer change the way a writer revises."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Reading informational text** — tracing an argument and its claims; how evidence supports a claim",
      "**Craft and structure** — word choice, connotation and figurative language",
      "**Writing** — argument with claim, evidence and counterclaim; planning, revising and editing",
      "**Theme** — who gets to write, and how tools change writing"]}),
    ("section", {"label": "Materials needed", "list": [
      "The argument map on page 3, projected or printed",
      "The poster *The Writing Revolution*, on screen at the exhibition or printed",
      "The Typing Station on the exhibition website, for the revision demonstration",
      "Differentiated handouts, one per student; pens"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Words that break",
      "screen": {"phase": "Hook", "show": "words", "title": "Words that break",
                 "text": Q["shattered"] + "\n" + Q["computer"] + "\n" + Q["gates"], "cite": "The Writing Revolution",
                 "purpose": "Notice the language before the facts: the poster’s verbs are verbs of breaking.",
                 "students": [HOOK_Q, "Why might a writer choose them?"]},
      "body": ["Put three sentences from the poster on the screen without comment: *“" + Q["shattered"] + "”* *“" + Q["computer"] + "”* *“" + Q["gates"] + "”* Ask: *“" + HOOK_Q + "”* Collect *shattered*, *obliterated*, *chipped away*. Ask what each one makes the reader feel about the old way of writing."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "An argument, move by move",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "The argument map", "show": "chart", **MAP_SCREEN,
         "purpose": "See the poster as an argument: a claim, evidence, a complication, an open question, a conclusion.",
         "students": ["Which sentence is the claim?", "Why would a writer admit problems with their own argument?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "Two ways to revise", "show": "image",
         "img": {"img": W.ROOM}, "alt": W.ROOM_ALT, "fit": "contain",
         "caption": "The Typing Station: the same line on a typewriter and on an iMac",
         "purpose": "Connect the poster’s claim about word processors to how students revise.",
         "students": ["On the typewriter, a mistake stays on the page. On the iMac, Back space takes it away.", "Which machine would make you a better reviser?"]}],
      "body": [
        "Show the argument map on page 3. Name each move: the **claim** (writing was a privilege, and that exclusivity *shattered*), the **evidence** (a technology at each step), the **complication** (*" + Q["challenges"] + "*), the **open question** about AI, and the **conclusion** about the gates.",
        "Ask why a writer would admit problems with their own argument. Introduce the term **concession**: granting a point that seems to work against you, which can make an argument more trustworthy.",
        "Open the Typing Station. On the typewriter there is no erasing: Back space strikes over. On the iMac, students can select, cut and paste, change the font and undo. Read: *“" + Q["wp"] + "”* Ask: *how does the tool change the way you revise?*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the poster’s argument and write back to it at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the same poster."]},
      "body": ["Students choose a handout. All three read the same poster; each ends with writing of their own."]}),
    ("levels", {
      "green": "Find the breaking words and say why a writer chose them, sort sentences by their job in the argument, and write a short answer to *what would you publish?*",
      "yellow": "Map the argument in their own words, weigh four strong words against plainer ones, and draft by typewriter rules before revising.",
      "red": "Judge whether the poster’s concessions strengthen it, examine its metaphors, and write an argument answering its question about AI, with a counterclaim."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "The word that does the most work",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "One word", "show": "question", "question": CLOSE_Q,
         "purpose": "Bring the lesson’s two strands together: a single choice of word carries an argument.",
         "students": ["Point to the sentence it is in.", "What would change if the writer had chosen a plainer word?"]},
        {**W.review(OBJECTIVES, 3, [1]), "phase": "Debrief"}],
      "body": ["Ask: *“" + CLOSE_Q + "”* Take several answers; have a Red Level student read the opening of their AI argument aloud.",
               W.LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Breaking words:** *shattered*, *obliterated*, *chipped away*; also *ended publishers’ monopoly* and *completed this revolution*.",
      "**Sentence jobs (Green):** the privilege sentence is the claim; the printing press sentence is evidence; the challenges sentence is a complication.",
      "**Exit ticket:** *write one sentence from the poster and name its job: claim, evidence, complication or conclusion.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The argument map",
      "body": ["Project or print this page. Every move but the evidence is the poster’s own sentence; the evidence row lists the technologies the poster names, with its dates."]}),
    table(["Move", "What the poster says"], MAP),
    ("section", {"label": "Background for teachers", "title": "Reading the poster closely",
      "body": [
        "**Two metaphors, two speeds.** The poster says exclusivity *shattered* with each leap and the computer age *obliterated* barriers, but its last sentence says each technology *chipped away at the gates*. Ask students which picture of change is truer to the evidence.",
        "**The poster argues with itself.** After the triumph comes the turn: *“" + Q["implications"] + "”* It names information overload, misinformation, and algorithms; then a finding about reading and memory: *“" + Q["brain"] + "”*",
        "**Its closing image.** *“" + Q["achievement"] + "”*"]}),
    ("connection", ["**Visit the exhibition:** read *The Writing Revolution* aloud, listening for its verbs. Then at the Typing Station, type the same line on the typewriter and on the iMac, and notice what you do differently when a mistake cannot be erased."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The poster *The Writing Revolution* argues that every new writing tool, from the printing press to the internet, opened writing to more people. A good reader notices not only what an argument says, but how it is built and which words it chooses."]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT, "css": CSS + css}


CIRCLE = "claim · evidence · problem"
GREEN = handout("green", "WR_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Words that break",
            "blocks": [W.quote(BREAKING, 1)],
            "body": ["Underline every word or phrase that describes **breaking** something. Then answer: why would a writer use breaking words to describe new writing tools?"], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Typewriter rules",
            "body": ["On a typewriter there is no erasing. Copy this sentence in pen, with no erasing. If you make a mistake, write over it."],
            "blocks": [("html", '<p class="tl1">' + W.STATION_LINE + "</p>")], "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "What job does each sentence do?",
            "body": ["An argument has a **claim** (what the writer wants you to believe), **evidence** (facts that support it) and sometimes a **problem** the writer admits. Circle the job of each sentence."]}),
  ("html", '<table class="am"><thead><tr><th>Sentence from the poster</th><th>Its job: circle one</th></tr></thead><tbody>'
           + "".join(f'<tr><td style="width:66%;font-weight:400">{s}</td><td class="circ">{CIRCLE}</td></tr>' for s in [
               Q["privilege"],
               "The printing press … was the first great equalizer—suddenly, books cost a fraction of their previous price.",
               Q["challenges"]]) + "</tbody></table>"),
  ("task", {"label": "Part 4", "title": "Your turn to publish",
            "body": ["*" + W.TALK["p1_computer"] + "* Start: *If I could publish anything, I would write about …*"], "lines": 9}),
  ("connection", ["Read *The Writing Revolution* in the exhibition. Find one more breaking word in the poster that is not on this sheet."]),
], ".tl1{font:11pt 'Courier Prime',monospace;border:1pt solid #1d1c1a;border-radius:4pt;padding:6pt 10pt;margin:2pt 0 4pt;background:rgba(255,255,255,.5)}")

YELLOW = handout("yellow", "WR_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Map the argument",
            "body": ["Read the poster. Write each move **in your own words**: what is the writer saying at that point?"]}),
  ("html", table(["Move", "In my own words"], [("Claim", ""), ("Evidence", ""), ("Complication", ""), ("Open question", ""), ("Conclusion", "")], blank=(1,))[1].replace('class="am"', 'class="am big"')),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Strong words, plain words",
            "body": ["For each word from the poster, write a plainer word that means nearly the same. What does the poster’s word do that the plain one does not?"]}),
  ("html", '<table class="am"><thead><tr><th>Poster’s word</th><th>Plainer word</th><th>What the poster’s word adds</th></tr></thead><tbody>'
           + "".join(f'<tr><td><i>{w}</i></td><td class="blank" style="width:22%"></td><td class="blank"></td></tr>' for w in
                     ["shattered", "obliterated", "flooding into offices", "chipped away"]) + "</tbody></table>"),
  ("task", {"label": "Part 3", "title": "Draft by typewriter rules, then revise",
            "body": ["Answer in two or three sentences, in pen, with **no erasing**: *" + W.TALK["p1_computer"] + "*"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Now revise",
            "body": ["Rewrite your answer as if you were on a computer: move words, cut, choose better ones. Then say in one sentence how revising felt different."], "lines": 5}),
  ("connection", ["At the Typing Station, type the same line on the typewriter and on the iMac. Which machine made you slow down and think before each word?"]),
], "table.am td.blank { height: 30pt; } table.am.big td.blank { height: 52pt; }")

RED = handout("red", "WR_Handout_Red_ELA.pdf", [
  ("section", {"label": "Craft", "title": "Concession and counterclaim",
               "body": ["A **concession** grants a point that seems to work against the writer’s argument. A **counterclaim** is the strongest case the other side could make. Strong arguments face both."]}),
  ("task", {"label": "Part 1", "title": "Does the poster weaken itself?",
            "blocks": [W.quote(["challenges", "brain"], 1)],
            "body": ["After praising every new tool, the poster names these problems. Do they weaken its argument, or make it more convincing? Quote one phrase to support your answer."], "lines": 5}),
  ("task", {"label": "Part 2", "title": "Shattered, or chipped away?",
            "body": ["The poster says exclusivity *shattered* and that the computer age *obliterated remaining barriers*, but its last sentence says technology *chipped away at the gates*. Which picture of change does the evidence support better? Then explain the phrase *ivory towers and newsrooms*: who does it describe?"], "lines": 6}),
  ("task", {"label": "Part 3", "title": "Write your own argument",
            "blocks": [W.quote(["ai"], 1)],
            "body": ["Answer the poster’s question in one paragraph. Include: a **claim**; **evidence** from the poster’s history; a **counterclaim**, and your reply to it; and a **closing image**, the way the poster ends with gates."], "lines": 8}),
  ("connection", ["The poster ends: *" + Q["achievement"] + "* Read it in the exhibition. Does your paragraph agree with it, or push back?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
