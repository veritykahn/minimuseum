"""Grades 1–2 · "No Erasing!"
The typewriter and the computer side by side, as the display case and the
Typing Station set them, and the story of the writing tools that let more
and more people write. Facts follow app/exhibitions/writing-revolution/
writingRevolution.ts (poster 1 and the display case) and the Typing Station
(stationText.ts: "No erasing: Back space lets you strike over"; "Type,
select, cut and paste, and change the font"; the race's question)."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)

DIR = "teachers/grades-1-2/"
TITLE = "No Erasing!"
SUB = "Grades 1–2 · The typewriter and the computer"

HERO = W.HERO_P1_TITLE
HERO_HANDOUT = W.HERO_P2_KEYS

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Where did the mistake go?"
TRY_LINE = "Now everyone can write."
LAST_Q = "On the typewriter, a mistake stays on the page. On the computer, Back space takes it away. Which did you like better? Why?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say what happens to a mistake on a typewriter, and on a computer",
     "say what happens to a mistake on each machine?", False),
    ("put four ways of writing in story order: by hand, the printing press, the typewriter, the computer",
     "put the four ways of writing in order?", False),
    ("explain that each new tool let more people write and share their words",
     "say how new tools helped more people write?", False),
    ("write by typewriter rules, then say which way of writing you like better, and why",
     "write by typewriter rules, and say which you like better?", True)],
  "why": "Long ago, only a few people could write. Every new writing tool opened the door a little wider, and now it is open to you."}

# ── the story of the tools: (title, date, story, Green clue) ─────────────
TOOLS = [
  ("Writing by hand", "Long, long ago",
   "For thousands of years, writing was for only a few people: scribes, monks and the very rich.",
   "A scribe writes by hand."),
  ("The printing press", "Around 1440",
   "Johannes Gutenberg’s printing press made books cost much less. Many more people across Europe learned to read.",
   "A press prints many books."),
  ("The typewriter", "1868",
   "Christopher Latham Sholes made the first practical typewriter. Ordinary people could make neat papers, and many women went to work in offices as typists, earning their own money.",
   "A typist works in an office."),
  ("The computer", "1970s and after",
   "On a computer, anyone could fix their writing. Then the internet let anyone share it with the world.",
   "A child types on a computer."),
]

# typewriter or computer? (statement, answer)
SORT = [
  ("A mistake stays on the page.", "T"),
  ("Back space takes a mistake away.", "C"),
  ("A bell rings near the end of the line.", "T"),
  ("You can change the font.", "C"),
  ("You push the carriage back for a new line.", "T"),
  ("You can cut and paste words.", "C"),
]

CHART = {"caption": "The two machines in the Typing Station",
         "columns": ["", "Typewriter", "iMac"],
         "rows": [{"cells": ["A mistake", "Stays on the page: you strike over it", "Back space takes it away"]},
                  {"cells": ["Changing the look", "What you strike stays", "Change the font, size and style"]},
                  {"cells": ["Moving words", "Type the page again", "Select, cut and paste"]}]}

CSS = W.KEYS_CSS + """
.sort { display: grid; grid-template-columns: 1fr 78pt 78pt; row-gap: 11pt; align-items: center; margin: 4pt 0 10pt; break-inside: avoid; }
.sort .h { font: 500 7pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; color: #5b5a55; text-align: center; }
.sort p { margin: 0; }
.sort span.c { width: 34pt; height: 34pt; border-radius: 50%; border: 1.2pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 15pt 'Outfit'; justify-self: center; }
.ord { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
.ord > div { border: 1pt solid #1d1c1a; border-radius: 7pt; background: rgba(255,255,255,.62); padding: 7pt 8pt 9pt;
  display: grid; grid-template-rows: auto 1fr auto; justify-items: center; text-align: center; gap: 5pt; }
.ord .box { width: 32pt; height: 32pt; border: 1.3pt solid #1d1c1a; border-radius: 4pt; background: #fff; }
.ord b { font: 600 14pt/1.1 'Cormorant Garamond', serif; }
.ord p { margin: 0; font-size: 10.5pt; line-height: 1.3; }
.ord em { font-style: normal; font: 500 9pt 'Outfit'; letter-spacing: .08em; color: #3f3e3a; }
.copy { font: 400 16pt/1.3 'Courier Prime', 'Courier New', monospace; background: rgba(255,255,255,.6); border: 1pt solid #1d1c1a;
  border-radius: 4pt; padding: 7pt 11pt; margin: 2pt 0 6pt; }
.rules { display: flex; gap: 8pt; flex-wrap: wrap; margin: 0 0 4pt; }
.rules span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 11pt; font: 400 10.5pt 'Outfit'; background: rgba(255,255,255,.6); }
table.cmp { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; break-inside: avoid; }
table.cmp th { font: 500 8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.cmp td { border-bottom: .8pt solid #a9a69b; padding: 6pt 6pt 6pt 0; vertical-align: top; height: 46pt; }
table.cmp td:first-child { width: 30%; font-weight: 500; }
"""


def sort_rows(items, with_head=True):
    head = '<span></span><span class="h">Typewriter</span><span class="h">Computer</span>' if with_head else ""
    rows = "".join(f'<p>{t}</p><span class="c">T</span><span class="c">C</span>' for t, _ in items)
    return ("html", f'<div class="sort">{head}{rows}</div>')


def order(keys, show="clue"):
    """the four tools, shuffled: a box to number each."""
    out = ""
    for k in keys:
        title, date, story, clue = TOOLS[k]
        body = {"clue": f"<p>{clue}</p>", "date": f"<p>{title}</p><em>{date}</em>"}[show]
        head = "" if show == "clue" else ""
        out += f'<div><span class="box"></span>{body}{head}</div>'
    return ("html", f'<div class="ord">{out}</div>')


# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "no-erasing", "large": True,
  "out": DIR + "WR_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO,
  "css": CSS + W.OBJ_CSS + "body { line-height: 1.44; } table.chart2 td { padding: 4pt 6pt 5pt 0; }",
  "blocks": [
    ("timing", [("Hook", 4, W.SAGE), ("Story time", 8, W.SLATE), ("Try it", 5, W.GREEN),
                ("Activity", 10, W.GOLD), ("Close", 3, W.RUST)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What children will understand",
        "body": ["Children will compare the two machines in the exhibition’s display case, a typewriter and a computer, and find out what each does with a mistake. They will hear the story of writing tools, from scribes to the internet, and learn the exhibition’s big idea: each new tool let more people write and share their words."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Writing** — writing a sentence; checking and fixing our own mistakes",
        "**Social Studies** — then and now: how tools changed people’s lives and work",
        "**Speaking and listening** — giving a reason: *I liked it better because…*"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "The Typing Station on a screen, with the sound on",
      "Page 3 of this plan, projected or printed",
      "A pen and a strip of paper for every child (no pencils for *Try it*)",
      "Differentiated handouts, one per child"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "Oops!",
      "screen": {"phase": "Hook", "show": "image", "title": "Oops!", "img": {"img": W.ROOM}, "alt": W.ROOM_ALT, "fit": "contain",
                 "caption": "The Typing Station: the same line on a typewriter and an iMac",
                 "purpose": "Discover the difference by watching a mistake happen on both machines.",
                 "students": ["Watch the mistake.", HOOK_Q]},
      "body": ["Open the Typing Station. On its typewriter, type *CAT* but make a mistake: *CAR*. Press Back space and type *T*: the T lands right on top of the R. Ask: *“" + HOOK_Q + "”* It is still there! On a typewriter there is no erasing; you can only strike over. Now do the same on the iMac tab: Back space takes the mistake away. *“Today we find out why people were so excited about machines for writing.”*"]}),
    ("section", {"label": "Story time · 8 minutes", "title": "Who could write?",
      "screen": [
        {"phase": "Story time", "minutes": 4, "script": [0], "title": "Who could write?", "show": "listen",
         "clips": [W.CLIPS["quill"], W.CLIPS["press"], W.CLIPS["typewriter"], W.CLIPS["keyboard"]],
         "question": "Which tool came first? Which came last?",
         "purpose": "Hear the story of writing tools, one sound at a time, in order.",
         "students": ["Listen to each tool.", "Who could write with it?"]},
        {"phase": "Story time", "minutes": 4, "script": [1], "title": "Two machines", "show": "chart", **CHART,
         "purpose": "Compare the two machines in the display case, and name the big difference.",
         "students": ["What happens to a mistake on each machine?", "Which one can change the font?"]}],
      "body": ["Play the four sounds in order and tell the story on page 3 as you go. *A quill pen:* for thousands of years, only a few people could write. *A printing press:* around 1440, books began to cost much less, and many more people learned to read. *A typewriter:* from 1868, ordinary people could make neat papers, and many women went to work as typists, earning their own money. *A computer keyboard:* now anyone can fix their writing, and share it with the world.",
               "Show the chart on page 3. Read it together. The display case holds both machines: a portable Smith-Corona Galaxie typewriter and an Apple iMac G3."]}),
    ("section", {"label": "Try it · 5 minutes", "title": "Typewriter rules",
      "screen": {"phase": "Try it", "show": "words", "title": "Typewriter rules", "text": TRY_LINE,
                 "purpose": "Feel what a typist felt: every letter counts, and a mistake stays.",
                 "students": ["Copy the line in pen.", "No erasing! A mistake? Write right over it."]},
      "body": [f"Give every child a pen and a strip of paper. *“Typewriter rules: pen only, no erasing. If you make a mistake, write right over it, like a strike-over.”* Children copy the line from the screen: *{TRY_LINE}* Then ask: *“How did it feel, writing when you couldn’t erase?”*"]}),
    ("section", {"label": "Activity · 10 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Sort, order and write at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three compare the typewriter and the computer, and put the tools in order."]},
      "body": ["Children choose a handout. All three compare the typewriter and the computer, and put the four ways of writing in order."]}),
    ("levels", {
      "green": "Circle *typewriter* or *computer* for four sentences, number four picture-clue cards in story order, copy a line by typewriter rules and draw their favorite writing tool.",
      "yellow": "Sort six sentences, order the four tools by their dates, copy the Typing Station’s own line by typewriter rules, then say which machine they like better, and why.",
      "red": "Write their own chart of the two machines, order the tools and say who could write with each, then write a note by typewriter rules and plan what they would share with the world."}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        {**W.review(OBJECTIVES, 2, [0], W.THUMBS), "phase": "Close"},
        {"phase": "Close", "minutes": 1, "script": [1], "title": "Which did you like better?", "show": "question", "question": LAST_Q,
         "purpose": "Give a reason, as the Typing Station asks every visitor.",
         "students": ["Finish the sentence: *I liked … better because …*"]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* Children show a thumb up, sideways or down. Ask one child to answer each aloud.",
               f"Then ask the Typing Station’s own question: *“{LAST_Q}”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**The big idea.** The exhibition says that every new technology has chipped away at the gates that once kept most voices silent. Children this age can hold it simply: more and more people got to write.",
        "**Mistakes.** The exhibition’s poster says that early word processors in the 1970s meant anyone could edit and perfect their writing without costly reprints. Typewriter rules let children feel why that mattered."]})],
      [("section", {"label": "Answer notes", "list": [
        "**Typewriter:** a mistake stays; the bell rings; push the carriage back. **Computer:** Back space; change the font; cut and paste.",
        "**Story order:** by hand, the printing press, the typewriter, the computer."]}),
       ("connection", ["**Visit the exhibition:** the display case holds the typewriter and the iMac side by side. At the Typing Station, *Race the machines*: type the same line on both."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Who could write?", "body": ["Project or print this page for story time. The four ways of writing, in order."]}),
    ("cards", [(f"{t} · {d}", [s]) for t, d, s, _ in TOOLS]),
    ("section", {"label": "The two machines in the Typing Station"}),
    ("html", '<table class="fill chart2"><thead><tr><th></th><th>Typewriter</th><th>iMac</th></tr></thead><tbody>'
             + "".join(f"<tr><td><b>{r['cells'][0]}</b></td><td>{r['cells'][1]}</td><td>{r['cells'][2]}</td></tr>" for r in CHART["rows"])
             + "</tbody></table>"),
    ("section", {"label": "Questions for story time", "list": [
      "Long ago, only a few people could write. Who can write now?",
      "Why might a typist type very carefully?",
      "What would you write if the whole world could read it?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Long ago, only a few people could write. Then new tools came: the printing press, the typewriter, the computer. Each one helped more people write. On a typewriter there is no erasing: a mistake stays on the page. On a computer, Back space takes it away."]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · The typewriter and the computer", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT, "foot": f"Student Handout · Grades 1–2 · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT}


RULES = ("html", '<div class="rules"><span>Pen only</span><span>No erasing</span><span>A mistake? Write over it.</span></div>')

GREEN = handout("green", "WR_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Typewriter or computer?",
            "body": ["Read each sentence. Circle **T** for typewriter or **C** for computer."]}),
  sort_rows(SORT[:4]),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Put them in order",
            "body": ["Write **1, 2, 3, 4** in the boxes, from long ago to now."]}),
  order([2, 0, 3, 1]),
  ("task", {"label": "Part 3", "title": "Typewriter rules",
            "blocks": [RULES, ("html", f'<p class="copy">{TRY_LINE}</p>')], "body": ["Copy the line."], "lines": 2}),
  ("task", {"label": "Part 4", "title": "My favorite way to write",
            "body": ["Draw yourself writing. Will you use a pencil, a typewriter or a computer?"],
            "blocks": [("draw", "Me, writing")]}),
  ("family", ["Write a note to your child in pen, by typewriter rules: no erasing. Then ask your child to write one back. Talk about how it felt."]),
], "body.young .drawbox { height: 195pt; } .sort { row-gap: 17pt; margin-top: 8pt; }")

YELLOW = handout("yellow", "WR_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Typewriter or computer?",
            "body": ["Circle **T** for typewriter or **C** for computer."]}),
  sort_rows(SORT),
  ("task", {"label": "Part 2", "title": "Put them in order",
            "body": ["Write **1, 2, 3, 4** in the boxes, from long ago to now. Use the dates."]}),
  order([1, 3, 0, 2], show="date"),
  ("task", {"label": "Part 3", "title": "Typewriter rules",
            "blocks": [RULES, ("html", f'<p class="copy">{W.STATION_LINE}</p>')],
            "body": ["This is the line the Typing Station gives everyone to type. Copy it in pen. How many times did you write over a mistake?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Which did you like better?",
            "body": ["Would you rather write on a typewriter or a computer? Finish the sentence: **I would choose the … because …**"], "lines": 3}),
  ("family", ["Ask your child to tell you the story of writing tools, from scribes to computers. Who could write long ago? Who can write now?"]),
])

RED = handout("red", "WR_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Two machines",
            "body": ["Write what each machine does."]}),
  ("html", '<table class="cmp"><thead><tr><th></th><th>Typewriter</th><th>Computer</th></tr></thead><tbody>'
           "<tr><td>A mistake</td><td></td><td></td></tr><tr><td>Moving words</td><td></td><td></td></tr>"
           "<tr><td>Changing how it looks</td><td></td><td></td></tr></tbody></table>"),
  ("task", {"label": "Part 2", "title": "Put them in order",
            "body": ["Write **1, 2, 3, 4** in the boxes, from long ago to now."]}),
  order([3, 0, 2, 1], show="date"),
  ("task", {"label": "Part 3", "title": "Long ago and now",
            "body": ["Long ago, only scribes, monks and the very rich could write. Who can write now? Why?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "A note by typewriter rules",
            "blocks": [RULES], "body": ["Write a note to someone in pen. Then circle any place where you wrote over a mistake."], "lines": 4}),
  ("task", {"label": "Part 5", "title": "Share it with the world",
            "body": ["If the whole world could read something you wrote, what would you write? Who would you hope reads it?"], "lines": 3}),
  ("family", ["Ask your child: *if the whole world could read something you wrote, what would it be?* Write it down together."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
