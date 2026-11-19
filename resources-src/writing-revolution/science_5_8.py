"""Grades 5–8 · Science · "Is It a Fair Test?"
Poster 2, "QWERTY's Accidental Empire", read for its tests: Dvorak's claim,
the Navy study he oversaw, the 1956 government study; poster 1's "surprising
truths" about reading and handwriting; and the Typing Station's race, which
always runs the typewriter first (typing-station/stationText.ts). Students
learn variables, controls and bias, then design a fair test of their own."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

DIR = "teachers/grades-5-8/science/"
TITLE = "Is It a Fair Test?"
SUB = "Grades 5–8 · Science · Claims, variables and bias"

HERO = W.HERO_P2_KEYS
HERO_HANDOUT = W.HERO_P2_TITLE

HOOK_Q = "Would you switch keyboards? What would you need to know first?"
CLOSE_Q = "What would it take to convince you that one keyboard is faster than another?"
RACE_FIRST = "Type the line on the typewriter first: the clock starts at your first key."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain why a claim, like Dvorak’s 74%, needs a fair test before we believe it",
     "explain why Dvorak’s claim needed a fair test?", False),
    ("identify bias and a variable that could spoil a test, such as who runs it or the order of turns",
     "spot bias, or a variable that could spoil a test?", False),
    ("design a fair test that changes one variable, keeps the others the same, and measures a result",
     "design a fair test with one variable changed and the rest kept the same?", False),
    ("evaluate a claim that says only *studies suggest*, and say what evidence would settle it",
     "say what evidence would settle a claim that only says studies suggest?", True)],
  "why": "Every day you hear claims that something is faster, better or proven. Knowing what makes a test fair lets you decide for yourself."}

TESTS = [
  ("1936", "August Dvorak’s keyboard could increase typing speed by 74%.", "Dvorak, who made the keyboard", "A claim: 74% faster"),
  ("World War II", "The U.S. Navy tested it.", "Overseen by Dvorak himself", "Dramatic improvements reported"),
  ("1956", "A government study tested it.", "A government study", "No real advantage"),
]
CHART_SCREEN = {"caption": "One claim, two tests, as QWERTY’s Accidental Empire tells it",
                "columns": ["When", "What happened", "Who ran it", "Result"],
                "rows": [{"cells": list(r)} for r in TESTS]}

CSS = W.QUOTE_CSS + W.KEYS_CSS + """
table.ft { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.ft th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.ft td { border-bottom: .6pt solid #b9b5aa; padding: 4.5pt 8pt 4.5pt 0; vertical-align: top; }
table.ft td:first-child { width: 24%; font-weight: 500; }
table.ft td.blank { height: 30pt; }
table.ft.wide td:first-child { width: 64%; font-weight: 400; }
"""


def table(head, rows, blank=(), cls="ft"):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join('<td class="blank"></td>' if (i in blank or c == "") else f"<td>{c}</td>" for i, c in enumerate(r)) + "</tr>" for r in rows)
    return ("html", f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>')


# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "is-it-a-fair-test",
  "out": DIR + "WR_LP_Science.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Science", "hero": HERO, "css": CSS + W.OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, W.SAGE), ("Teach", 13, W.SLATE), ("Activity", 20, W.GOLD), ("Debrief", 7, W.RUST)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will use the story the exhibition tells in *QWERTY’s Accidental Empire* to learn what makes a test fair. August Dvorak claimed his keyboard could raise typing speed by 74%; a Navy test overseen by Dvorak himself reported dramatic improvements; a 1956 government study found no real advantage. Students will name the **variables**, the **controls** and the **bias** in tests like these, find a problem in the Typing Station’s own race, and design a fair test of their own."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Scientific practices** — asking testable questions; planning and carrying out investigations",
      "**Variables** — independent, dependent and controlled; one change at a time",
      "**Evaluating evidence** — bias, conflict of interest, independent replication",
      "**Engineering and society** — why a design that tests well may still not be adopted"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Claims and tests* page on page 3, projected or printed",
      "The Typing Station on the exhibition website, and a clock or timer",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Seventy-four percent faster",
      "screen": {"phase": "Hook", "show": "words", "title": "74% faster?", "text": Q["dvorak"], "cite": "QWERTY’s Accidental Empire",
                 "purpose": "Start with a striking claim and the instinct to believe it.",
                 "students": [HOOK_Q]},
      "body": ["Read Dvorak’s claim from the poster: *“" + Q["dvorak"] + "”* Ask: *“" + HOOK_Q + "”* Collect what students would want to know: who tested it, on whom, how. Keep the list for the debrief."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Who ran the test?",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "Two tests", "show": "chart", **CHART_SCREEN,
         "purpose": "Compare two tests of one claim, and notice who ran each.",
         "students": ["Who oversaw the Navy test?", "Why might that matter?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "Is the race fair?", "show": "image",
         "img": {"img": W.ROOM}, "alt": W.ROOM_ALT, "fit": "contain",
         "caption": "The Typing Station: a race on the typewriter, then on the iMac",
         "purpose": "Find a flaw in a test students can run themselves: the order of the turns.",
         "students": ["The typewriter always goes first. Does that help or hurt the iMac?", "How could you make the race fair?"]}],
      "body": [
        "Read: *“" + Q["navy"] + "”* Show the *Claims and tests* table. Ask: *who oversaw the Navy test?* Name **bias**: when the person running a test wants a certain answer, the result can lean toward it, even without anyone meaning to cheat. Name **replication**: an independent test of the same claim.",
        "Define the parts of a fair test: the **independent variable** (the one thing you change, here the keyboard), the **dependent variable** (what you measure, here typing speed) and the **controlled variables** (everything you keep the same: the text, the typists, the time).",
        "Open the Typing Station’s race. It says: *“" + RACE_FIRST + "”* then the iMac. Ask: *if you type the same line twice, will the second try be easier?* That is an **order effect**: practice could make the second machine look faster. Ask how to fix it."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Judge the tests in the exhibition, then design a fair one.",
                 "students": ["Choose Green, Yellow or Red. All three end with a test you could run."]},
      "body": ["Students choose a handout. All three judge the same tests; each ends with a test students could run."]}),
    ("levels", {
      "green": "Answer who claimed and who tested, match three science words to their meanings, and plan a fair handwriting-or-typing race with a guided frame.",
      "yellow": "Compare the two studies, fix the order effect in the Typing Station race, and design a fair test of the poster’s claim about printed pages and memory.",
      "red": "Find the confounding variable of muscle memory, count the letters on each keyboard row as data, and question a claim that only says *studies suggest*."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What would convince you?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Convince me", "show": "question", "question": CLOSE_Q,
         "purpose": "Return to the hook’s list, now in the language of fair tests.",
         "students": ["Name the variable you would change.", "Name two things you would keep the same."]},
        {**W.review(OBJECTIVES, 3, [1]), "phase": "Debrief"}],
      "body": ["Return to the hook’s list. Ask: *“" + CLOSE_Q + "”* Expect: tested by someone with no stake in the result, typists who start equal, the same text, many people, the order of turns mixed.",
               W.LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green matching:** *bias*, leaning toward the answer you want; *variable*, something that can change in a test; *fair test*, only one thing changes.",
      "**Station line (Red):** *" + W.STATION_LINE + "* has 48 letters: 25 on the top row, 18 on the home row, 5 on the bottom row. One sentence is too small a sample to settle a claim about English.",
      "**Exit ticket:** *name one reason the Navy test may not have been fair, and one way to fix it.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Claims and tests",
      "body": ["Project or print this page. The first table follows *QWERTY’s Accidental Empire*; the second, two claims from *The Writing Revolution* that name no test at all."]}),
    table(["When", "What happened", "Who ran it", "Result"], TESTS),
    table(["Claim from the posters", "Which test?"], [
      (Q["studies"], "The poster says only “studies suggest.”"),
      ("While we read faster on screens, we remember more from printed pages, and handwriting activates different parts of our brain than typing.", "The poster names no study.")], cls="ft wide"),
    ("section", {"label": "Background for teachers", "title": "What the exhibition does and doesn’t say",
      "body": [
        "**The Navy result has no number.** The poster says only *dramatic improvements*, and that the study was overseen by Dvorak. It gives no figure for the 1956 study beyond *no real advantage*. Keep students to what the source says.",
        "**Why QWERTY stayed is not a science result.** *“" + Q["lockin"] + "”* A design can win or lose a test and still be chosen for other reasons, which is worth naming with students.",
        "**The race in the Typing Station times each machine** and counts strike-overs and letters off the line; classes can post their times to the class board."]}),
    ("connection", ["**Visit the exhibition:** at the Typing Station, race the machines, then race again. Did your second time improve? Post your class’s times to the class board, and ask: is that enough evidence to call one machine faster?"]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In 1936, August Dvorak said his keyboard could make typing 74% faster than QWERTY. Tests disagreed. Scientists ask: who ran the test, what was changed, and what was kept the same?"]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Science", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Science · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT, "css": CSS + css}


MATCH_CSS = """
table.mt { width: 100%; border-collapse: separate; border-spacing: 0 6pt; font-size: 9.5pt; break-inside: avoid; }
table.mt td { vertical-align: middle; padding: 4pt 8pt; }
table.mt td.w { font: 500 10.5pt 'Outfit'; width: 22%; border: 1pt solid #1d1c1a; border-radius: 99pt; text-align: center; background: rgba(255,255,255,.55); }
table.mt td.l { width: 12%; text-align: center; color: #1d1c1a; font-size: 12pt; }
table.mt td.d { border-bottom: .6pt solid #b9b5aa; }
.box { display: inline-block; width: 15pt; height: 15pt; border: 1pt solid #1d1c1a; border-radius: 3pt; vertical-align: middle; margin-right: 6pt; background: rgba(255,255,255,.55); }
.ck p { margin: 0 0 7pt; font-size: 9.6pt; }
"""

GREEN = handout("green", "WR_Handout_Green_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Who said it? Who tested it?",
            "blocks": [W.quote(["dvorak", "navy"], 2)],
            "body": ["Answer each question in a few words. **1.** What did Dvorak claim his keyboard could do? **2.** Who oversaw the Navy’s test? **3.** What did the 1956 government study find?"], "lines": 3}),
  ("task", {"label": "Part 2", "title": "Science words",
            "blocks": [("html", "<p>Draw a line from each word to its meaning.</p>"), ("html", '<table class="mt"><tbody>'
                        '<tr><td class="w">bias</td><td class="l">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•</td><td class="d">A test where only one thing changes.</td></tr>'
                        '<tr><td class="w">variable</td><td class="l">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•</td><td class="d">Leaning toward the answer you want.</td></tr>'
                        '<tr><td class="w">fair test</td><td class="l">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•</td><td class="d">Something that can change in a test.</td></tr>'
                        "</tbody></table>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Plan a fair race",
            "blocks": [("html", "<p>Which is faster for you: writing a sentence by hand, or typing it? Plan a fair race.</p>"), ("html", '<div class="ck">'
                        '<p><b>The one thing I change:</b> handwriting or typing.</p>'
                        '<p><b>What I measure:</b> ________________________________________________</p>'
                        '<p><b>What I keep the same.</b> Tick each one you will keep the same:</p>'
                        '<p><span class="box"></span>the same sentence&nbsp;&nbsp;&nbsp;&nbsp;<span class="box"></span>the same person&nbsp;&nbsp;&nbsp;&nbsp;<span class="box"></span>the same timer</p>'
                        '<p><b>One more thing I would keep the same:</b> _____________________________</p>'
                        '<p><b>My prediction:</b> I think ______________________ will be faster, because</p></div>')], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Was it fair?",
            "body": ["Why might the Navy’s test not have been fair? What would you change?"], "lines": 4}),
  ("connection", ["At the Typing Station, race the machines. Then race again. Was your second time faster? Why might that be?"]),
], MATCH_CSS)

YELLOW = handout("yellow", "WR_Handout_Yellow_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Two studies, one claim",
            "blocks": [W.quote(["navy"], 2)],
            "body": ["Fill in the table. Then decide which study you trust more, and why."]}),
  table(["", "Navy study, World War II", "Government study, 1956"],
        [("Who ran it?", "", ""), ("What did it find?", "", ""), ("How much do I trust it? Why?", "", "")], cls="ft big"),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Fix the race",
            "body": ["The Typing Station races the same line on two machines. It says: *“" + RACE_FIRST + "”* Then the iMac. What problem does always going in the same order cause? How would you fix it?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Design a test",
            "blocks": [W.quote(["brain"], 1)],
            "body": ["Design a fair test of one part of this claim: *we remember more from printed pages* than from screens."]}),
  table(["Part of the test", "My plan"], [
      ("Question", ""), ("Independent variable (what I change)", ""), ("Dependent variable (what I measure)", ""),
      ("Controlled variables (what I keep the same)", ""), ("How many people, and how I choose them", ""), ("My prediction", "")]),
  ("connection", ["Race the machines at the Typing Station twice. Compare your two typewriter times. How much did practice change your result?"]),
], "table.ft td.blank { height: 30pt; } table.ft.big td.blank { height: 62pt; }")

ROWS = table(["Row", "Letters of the line on this row", "Out of 48"],
             [("Top row", "", ""), ("Home row", "", ""), ("Bottom row", "", "")])

RED = handout("red", "WR_Handout_Red_Science.pdf", [
  ("task", {"label": "Part 1", "title": "The hidden variable",
            "blocks": [W.quote(["muscle", "navy"], 2)],
            "body": ["A **confounding variable** is a hidden difference that could explain a result. If the typists in a test had already trained their muscle memory on QWERTY, why would any comparison with a new keyboard be hard? Design a test that removes this problem."], "lines": 9}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Count the evidence",
            "blocks": [("html", "<p>Dvorak put the most common letters on the <b>home row</b>, where the fingers rest. Count how many letters of this line sit on each row of a QWERTY keyboard.</p>"),
                       ("html", '<p class="tl1">' + W.STATION_LINE + "</p>"), ("html", W.keys(size=21, labels=True)), ROWS],
            "body": ["What does your count tell you about the poster’s sentence *QWERTY makes our fingers travel farther than necessary*? What can one sentence **not** tell you?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "“Studies suggest”",
            "blocks": [W.quote(["studies"], 2)],
            "body": ["Write three questions you would ask about these studies before believing them. Then explain why the 1956 government study might be stronger evidence than the Navy study."], "lines": 3}),
  ("connection", ["The Typing Station’s race counts time, strike-overs and letters off the line. Which would be your dependent variable?"]),
], ".tl1{font:11pt 'Courier Prime',monospace;border:1pt solid #1d1c1a;border-radius:4pt;padding:6pt 10pt;margin:2pt 0 8pt;background:rgba(255,255,255,.5)} table.ft td.blank { height: 26pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
