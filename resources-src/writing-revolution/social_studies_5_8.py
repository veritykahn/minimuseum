"""Grades 5–8 · Social Studies · "Who Gets to Write?"
Poster 1, "The Writing Revolution", read as a history of who could write and
be read: each technology from the printing press to social media, the gates
it opened, and the new gates the poster itself names. Facts follow poster 1
in app/exhibitions/writing-revolution/writingRevolution.ts, quoted as the site
sets it, and its "Talk about it" questions."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Who Gets to Write?"
SUB = "Grades 5–8 · Social Studies · Technology, access and voice"

HERO = W.HERO_P1_TITLE
HERO_HANDOUT = W.HERO_P1_URANIA

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Who got to write, and who didn’t?"
MISSING_Q = W.TALK["p1_open"]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("trace how each writing technology, from the printing press to social media, opened writing to more people",
     "trace how each technology opened writing to more people?", False),
    ("explain what *democratization* means, using the typewriter and the women who became typists",
     "explain democratization, with the typewriter as an example?", False),
    ("name the new challenges the exhibition says came with the power to publish",
     "name the new challenges that came with the power to publish?", False),
    ("judge the poster’s claim that every new technology has chipped away at the gates, with evidence for and against",
     "judge whether every technology really chipped away at the gates?", True)],
  "why": "Who gets heard has always depended on who controls the tools of writing. Knowing how that changed helps you ask who controls them now."}

# ── the timeline: (when, technology, what the poster says opened up) ─────
TIMELINE = [
  ("For thousands of years", "Writing by hand", "Writing was a privilege reserved for scribes, monks, and the wealthy elite."),
  ("Around 1440", "Gutenberg’s printing press", "Books cost a fraction of their previous price, sparking mass literacy movements across Europe."),
  ("1868", "Sholes’ typewriter", "Ordinary citizens could create professional documents; women flooded into offices as typists."),
  ("1970s", "Word processors", "Anyone could edit and perfect their writing without costly reprints."),
  ("1985", "Desktop publishing (PageMaker)", "Anyone could design newsletters, magazines, or books from their home."),
  ("1999 · 2001", "Blogger · Wikipedia", "Millions published free; collective amateur writers rivaled encyclopedias."),
  ("Today", "Social media · self-publishing", "Every phone owner a publisher; authors reach readers without agents or publishing houses."),
]

CHART_SCREEN = {"caption": "The gates, one technology at a time, as the poster tells it",
                "columns": ["When", "Technology", "What opened up"],
                "rows": [{"cells": list(r)} for r in TIMELINE]}

CSS = W.QUOTE_CSS + """
table.tl { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.tl th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.tl td { border-bottom: .6pt solid #c8c5bb; padding: 4.5pt 8pt 4.5pt 0; vertical-align: top; }
table.tl td:first-child { width: 17%; font-weight: 500; white-space: nowrap; }
table.tl td:nth-child(2) { width: 27%; }
table.tl td.blank { height: 30pt; }
"""

FIT_CSS = """
.pb { break-after: auto; height: 0; } .pb + .sec { break-before: page; }
"""


def timeline_table(rows, blank_cols=()):
    head = "<th>When</th><th>Technology</th><th>What opened up, and for whom</th>"
    body = ""
    for r in rows:
        cells = "".join(f'<td class="blank"></td>' if i in blank_cols else f"<td>{c}</td>" for i, c in enumerate(r))
        body += f"<tr>{cells}</tr>"
    return ("html", f'<table class="tl"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')


# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "who-gets-to-write",
  "out": DIR + "WR_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": CSS + W.OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, W.SAGE), ("Teach", 13, W.SLATE), ("Activity", 20, W.GOLD), ("Debrief", 7, W.RUST)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the exhibition’s poster *The Writing Revolution* as a history of access: who could write and be read, and how each new technology — the printing press, the typewriter, the word processor, desktop publishing, the internet — opened the gates wider. They will use the typewriter and the women who became typists to define **democratization**, weigh the new challenges the poster names (information overload, misinformation, and algorithms that decide what writing gets seen), and judge the poster’s own closing claim."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Chronology** — change over time, from around 1440 to today; continuity and change",
      "**Economics** — cost as a barrier: books at a fraction of their price; costly reprints; economic independence",
      "**Civics** — access to information and a public voice; misinformation; who decides what is seen",
      "**Historical thinking** — evaluating a claim about the past with evidence for and against"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Who could write?* timeline on page 3, projected or printed",
      "The poster *The Writing Revolution*, on screen at the exhibition or printed",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A privilege",
      "screen": {"phase": "Hook", "show": "words", "title": "A privilege", "text": Q["privilege"], "cite": "The Writing Revolution",
                 "purpose": "Open with the poster’s first sentence: writing as a privilege, and the question of who was shut out.",
                 "students": [HOOK_Q, "Who decides who gets to write today?"]},
      "body": ["Put the poster’s first sentence on the screen and read it aloud: *“" + Q["privilege"] + "”* Ask: *“" + HOOK_Q + "”* List the excluded groups students name. Then: *“The poster says every new technology chipped away at that. Today you test whether it’s true.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "The gates, one technology at a time",
      "screen": [
        {"phase": "Teach", "minutes": 8, "script": [0, 1], "title": "The gates fall", "show": "chart", **CHART_SCREEN,
         "purpose": "Walk the timeline: each technology lowered a barrier of cost, skill or permission.",
         "students": ["For each row: what barrier fell?", "Who gained a voice?"]},
        {"phase": "Teach", "minutes": 5, "script": [2], "title": "New gates?", "show": "words",
         "text": Q["tweet"] + "\n" + Q["challenges"], "cite": "The Writing Revolution",
         "purpose": "Turn the story: the power to publish brought new problems, and new gatekeepers.",
         "students": ["Who were the gatekeepers in 1900?", "Who, or what, decides what writing gets seen today?"]}],
      "body": [
        "Walk through the timeline on page 3. For each row ask: *what was the barrier — cost, skill or permission — and who could now get past it?* Name the poster’s word: **democratization**, opening something once held by a few to everyone.",
        "Stop at the typewriter: *“" + Q["typewriter"] + " " + Q["women"] + "”* Ask why a writing machine could change who earned a living.",
        "Then read: *“" + Q["tweet"] + " " + Q["challenges"] + "”* Ask: *in 1900, who were the gatekeepers? Who, or what, are they now?*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with the timeline and the poster’s claims at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the same timeline and the same poster."]},
      "body": ["Students choose a handout. All three use the same timeline and the same poster sentences."]}),
    ("levels", {
      "green": "Complete the timeline from a word bank, explain what the typewriter meant for women, and put one of the new challenges in their own words.",
      "yellow": "Fill the timeline’s *what opened up* column, compare the gatekeepers of 1900 and today, and argue which technology was the biggest leap.",
      "red": "Weigh evidence for and against *every new technology has chipped away at the gates*, trace what stayed the same, and predict, as a historian, what AI writing tools will change."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Whose voices are still missing?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Still missing?", "show": "question", "question": MISSING_Q,
         "purpose": "Bring the history into the present, in the exhibition’s own question.",
         "students": ["Use one piece of evidence from the timeline.", "Name one barrier that still stands."]},
        {**W.review(OBJECTIVES, 3, [1]), "phase": "Debrief"}],
      "body": ["Ask the exhibition’s own question: *“" + MISSING_Q + "”* Take answers that use evidence from the timeline; ask Red Level students for their verdict on the poster’s claim.",
               W.LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green word bank:** printing press (around 1440), typewriter (1868), word processor (1970s), PageMaker (1985), Blogger (1999), Wikipedia (2001).",
      "**Gatekeepers:** in 1900, *only major newspapers and publishers could spread ideas widely*; today the poster names *algorithms that decide what writing gets seen*.",
      "**Exit ticket:** *name one technology, the barrier it lowered, and one new barrier the poster names.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Who could write?",
      "body": ["Project or print this page for the lesson and the debrief. Every row follows the poster *The Writing Revolution*, in its order, close to its words."]}),
    timeline_table(TIMELINE),
    ("section", {"label": "Historical framework", "title": "Reading a claim about the past",
      "body": [
        "**A poster makes an argument.** *The Writing Revolution* is not neutral: it calls the press *the first great equalizer*, says *true democratization* began with the typewriter, and that the computer age *obliterated* remaining barriers. Treat these as claims to test, not facts to copy.",
        "**Change and continuity.** The poster itself names what came with the change: information overload, misinformation, and algorithms that decide what writing gets seen. A gate can move as well as fall.",
        "**The question it leaves open.** *" + Q["ai"] + "* The poster ends: *" + Q["achievement"] + "*"]}),
    ("connection", ["**Visit the exhibition:** read *The Writing Revolution*, then find the display case, which holds a portable Smith-Corona Galaxie typewriter and an Apple iMac G3. At the Typing Station, type the same line on both. Which machine made it cheaper and easier to write, and why?"]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["For thousands of years, only a few people could write and be read. *The Writing Revolution* argues that every new technology — the printing press, the typewriter, the computer, the internet — opened the gates to more voices. Historians test arguments like this one against the evidence."]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT, "css": CSS + css}


BANK = ("html", '<p class="bank">' + " · ".join(["typewriter", "Wikipedia", "printing press", "PageMaker", "word processor", "Blogger"]) + "</p>")
BANK_CSS = ".bank { font: 500 9.5pt 'Outfit'; letter-spacing: .04em; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 12pt; display: inline-block; background: rgba(255,255,255,.6); margin: 0 0 4pt; } table.tl td.blank { height: 22pt; }"

GREEN = handout("green", "WR_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Complete the timeline",
            "blocks": [("html", "<p>Write the technology from the word bank in each empty box.</p>"), BANK]}),
  ("html", '<table class="tl"><thead><tr><th>When</th><th>Technology</th><th>What opened up</th></tr></thead><tbody>'
           + "".join(f'<tr><td>{w}</td><td class="blank"></td><td>{o}</td></tr>' for w, _, o in [
               ("Around 1440", "", "Books cost a fraction of their previous price."),
               ("1868", "", "Ordinary citizens could create professional documents."),
               ("1970s", "", "Anyone could edit and perfect their writing without costly reprints."),
               ("1985", "", "Anyone could design newsletters, magazines or books from home."),
               ("1999", "", "Millions could publish their thoughts free."),
               ("2001", "", "Amateur writers working together could rival encyclopedias.")]) + "</tbody></table>"),
  ("task", {"label": "Part 2", "title": "What is democratization?",
            "body": ["To **democratize** something means to open it up to everyone, not just a few. Which row of the timeline do you think opened writing up the most? Why?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Women at work",
            "blocks": [W.quote(["women"], 1)],
            "body": ["*Economic independence* means earning your own money. How could a writing machine help women earn their own money?"], "lines": 5}),
  ("task", {"label": "Part 4", "title": "New problems",
            "blocks": [W.quote(["challenges"], 1)],
            "body": ["Choose **one** of the three challenges. Explain it in your own words, with an example."], "lines": 5}),
  ("connection", ["Read *The Writing Revolution* in the exhibition. Find the sentence that says who could write *for thousands of years*. Who do you think was left out?"]),
], BANK_CSS)

YELLOW = handout("yellow", "WR_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "What opened up, and for whom?",
            "body": ["For each technology, write what barrier fell (cost, skill or permission) and who gained a voice."]}),
  timeline_table([(w, t, "") for w, t, _ in TIMELINE[1:]], blank_cols=(2,)),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "The gatekeepers",
            "blocks": [W.quote(["tweet", "challenges"], 1)],
            "body": ["Who decided whose ideas spread widely in 1900? Who, or what, decides what writing gets seen today? Is that a gate falling, or a gate moving? Explain."], "lines": 6}),
  ("task", {"label": "Part 3", "title": "The biggest leap",
            "body": ["The poster calls the printing press *the first great equalizer*, says *true democratization* began with the typewriter, and says the computer age *obliterated remaining barriers*. Which was the biggest leap? Make a claim and support it with two pieces of evidence from the timeline."], "lines": 7}),
  ("connection", ["In the exhibition, the display case holds a portable Smith-Corona Galaxie typewriter and an Apple iMac G3. Which of them belongs to the row on your timeline that you chose as the biggest leap?"]),
], "table.tl td.blank { height: 44pt; }")

RED_CSS = """
table.weigh { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 8.8pt; break-inside: avoid; }
table.weigh th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); width: 50%; }
table.weigh td { border-bottom: .6pt solid #b9a69d; height: 150pt; vertical-align: top; padding: 4pt 8pt 0 0; }
table.weigh td + td { border-left: .6pt solid #b9a69d; padding-left: 8pt; }
"""

RED = handout("red", "WR_Handout_Red_SocialStudies.pdf", [
  ("section", {"label": "Historical method", "title": "Testing a claim",
               "body": ["A historian treats a big claim about the past as something to test. Look for the evidence that supports it, the evidence that complicates it, and what stayed the same while things changed."]}),
  ("task", {"label": "Part 1", "title": "Weigh the claim",
            "blocks": [W.quote(["gates"], 1)],
            "body": ["Use the timeline and the poster’s own words. List evidence on each side."]}),
  ("html", '<table class="weigh"><thead><tr><th>Evidence for the claim</th><th>Evidence that complicates it</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'),
  ("task", {"label": "Part 2", "title": "Change and continuity",
            "blocks": [W.quote(["tweet", "challenges"], 1)],
            "body": ["In 1900 newspapers and publishers decided whose ideas spread widely. Today, the poster says, algorithms decide what writing gets seen. What changed, and what stayed the same? Is a gate that moves still a gate?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "A historian’s prediction",
            "blocks": [W.quote(["ai"], 1)],
            "body": ["Using the pattern of the timeline, predict one thing AI writing tools will open up, and one new gate they might create. Then give your verdict: is the poster’s closing claim true?"], "lines": 6}),
  ("connection", ["The poster ends: *" + Q["achievement"] + "* Find the sentence in the exhibition. Do you agree that this is the revolution’s greatest achievement?"]),
], RED_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
