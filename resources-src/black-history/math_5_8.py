"""Grades 5–8 · Math · "Who’s on Our Shelf?"
Data and percent from the exhibition's own numbers: the Black Barbie
Timeline's eight stops (which quote poster 2, which are museum notes, which
dolls Kitty Black Perkins designed), then the class's own count with the
Who's in your books? tab of the room Who Do You See?
(app/exhibitions/black-history/representation/representationText.ts:
its survey questions and choices, by their own labels).

The Cooperative Children's Book Center's 2025 figures are quoted whole and
set beside the class's count, never calculated with: the room gives them
"with no further arithmetic (the CCBC asks to review any analysis of its
data)". Every other number the students work with is their own class's
count, so no practice data is invented."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/math/"
TITLE = "Who’s on Our Shelf?"
SUB = "Grades 5–8 · Math · Surveying our books"
HERO = HERO_RING

HOOK_Q = "Guess: of every 100 children’s books published in 2025, how many were about Black/African people?"
SAMPLE_Q = "Does our shelf tell us about all children’s books?"
ADD_Q = "Which books would you add to make your shelf look more like the world?"
CCBC_CITE = "Cooperative Children’s Book Center, University of Wisconsin–Madison"

# The timeline's eight stops, by source and designer, as the room gives them (TIMELINE in _bh.py)
N_STOPS = len(TIMELINE)
N_POSTER = sum(1 for t in TIMELINE if t[3] == "Poster")
assert (N_STOPS, N_POSTER) == (8, 5)

WORKED = [
  {"title": "A fraction", "steps": ["The Black Barbie Timeline has 8 stops", "5 of them quote poster 2", "5 out of 8 = 5/8"],
   "answer": "5/8 of the stops quote the poster"},
  {"title": "A percent", "steps": ["5 ÷ 8 = 0.625", "0.625 × 100 = 62.5"],
   "answer": "62.5% of the stops quote the poster"},
  {"title": "Another part", "steps": ["Kitty Black Perkins designed the dolls at 2 of the 8 stops: 1980 and Shani, 1991",
                                      "2 ÷ 8 = 0.25", "0.25 × 100 = 25"],
   "answer": "25% of the stops"}]

# the survey's four questions, by the room's own labels (SURVEY_QUESTIONS)
SURVEY_ROWS = [
  ["Background", "Hands up if the main character in your book is…", ", ".join(SURVEY_BACKGROUNDS)],
  ["Gender", "Hands up if the main character in your book is…", "Girl or woman, Boy or man, Another gender, Can’t tell or not a person"],
  ["Disability", "Hands up if the main character in your book…", "Has a disability we can see or read about, No disability shown, Can’t tell"],
  ["Authors", "Hands up if the person who wrote or drew your book is…",
   ", ".join([b for b in SURVEY_BACKGROUNDS if b not in ("Animal or not a person", "Can’t tell")] + ["Don’t know"])]]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("turn a count into a fraction and a percent of the whole",
     "turn a count into a fraction and a percent?", False),
    ("show the class’s count in a table and a bar graph, and read them",
     "show a count in a table and a bar graph?", False),
    ("set the class’s percent beside the Cooperative Children’s Book Center’s, and say what each one counts",
     "say what our count and the CCBC’s each count?", False),
    ("judge whether a sample is fair, and how bias could change a result",
     "judge whether a sample is fair?", True)],
  "why": "Numbers can show who is in the books we read, and who is missing. Counting our own shelf, and asking whether it is a fair sample, is how a mathematician checks a claim before believing it."}

CSS = """
.ccbc { border-left: 3pt solid var(--accent); padding: 4pt 0 4pt 11pt; margin: 4pt 0 10pt; break-inside: avoid; }
.ccbc p { margin: 0; font: italic 400 10.4pt/1.42 'Cormorant Garamond', serif; font-size: 11.5pt; }
.ccbc small { display: block; margin-top: 4pt; font: 500 6.8pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; }
"""

def ccbc_box():
    return ("html", f'<div class="ccbc"><p>{md(CCBC)}</p><small>{md(CCBC_CITE)}</small></div>')

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "whos-on-our-shelf",
  "out": DIR + "BH_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO,
  "css": HERO_CSS + OBJ_CSS + FLOW_CSS + CARDS4_CSS + CHART_CSS + CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("cols", [[("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will count who is on their own class shelf, using the *Who’s in your books?* survey, and turn the count into fractions, percents and a bar graph. They will set their percent beside the Cooperative Children’s Book Center’s 2025 figures, and ask whether one shelf is a fair sample of all books."]})],
      [("section", {"label": "Standards and themes", "list": [
        "**Ratios and percent** — a percent as a rate per 100",
        "**Statistics** — summarize data in a table and a bar graph",
        "**Sampling** — when a sample represents a population",
        "**Connecting** — who is shown in the books we read"]}),
       ("section", {"label": "Materials needed", "list": [
        "*Who Do You See?*, *Who’s in your books?* tab (online), projected",
        "One book with a main character for each student; calculators",
        "Page 3 of this plan; differentiated handouts"]})]]),
    ("section", {"label": "Before you teach", "body": [
      "Have each student choose one book from the class library or from home. Count the characters in the books, never the students: don’t ask anyone about their own background. Accept *Can’t tell*: a guess from a cover is not data."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Guess, then check",
      "screen": [
        {"phase": "Hook", "minutes": 2, "script": [0], "title": "Make a guess", "show": "question", "question": HOOK_Q,
         "purpose": "Guess before being told, so the real figure means something.",
         "students": ["Write your guess.", "What is your guess based on?"]},
        {"phase": "Hook", "minutes": 3, "script": [1], "title": "Books published in 2025", "show": "words", "text": CCBC,
         "cite": CCBC_CITE,
         "purpose": "Read a real percent, and what it counts.",
         "students": ["Was your guess higher or lower?", "What is the difference between a book *about* and a book *by*?"]}],
      "body": [
        "Ask: *“" + HOOK_Q + "”* Students write a guess and say what it is based on.",
        "Show the Cooperative Children’s Book Center’s figures as the room gives them (page 3). A percent is a rate per hundred: 13.5% means 13.5 out of every 100. Ask whose guess was higher and whose was lower, then: *what is the difference between a book* about *Black/African people and one* by *a Black/African author or illustrator?* Read the figures, but don’t calculate with them: the CCBC asks to review any analysis of its data."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Count, fraction, percent",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Count, fraction, percent", "show": "worked", "examples": WORKED,
         "purpose": "Turn a count into a fraction and a percent, with the timeline’s own numbers.",
         "students": ["Check one calculation.", "How many of the 8 stops are museum notes? What percent is that?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Our survey", "show": "chart",
         "caption": "Who’s in your books? The survey’s four questions", "columns": ["Question", "The teacher asks", "Choices"],
         "rows": [{"cells": r} for r in SURVEY_ROWS],
         "purpose": "Count our own shelf, one question at a time.",
         "students": ["Hold your book. Put your hand up once, for one choice.", "Why does every question have a *Can’t tell*?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "A fair sample?", "show": "question", "question": SAMPLE_Q,
         "purpose": "Meet the ideas of a sample and of bias.",
         "students": ["Who chose the books on our shelf?", "What would make a sample fairer?"]}],
      "body": [
        "Work the timeline’s numbers (page 3). The *Black Barbie Timeline* has 8 stops, and 5 of them quote poster 2: 5/8, and 5 ÷ 8 × 100 = 62.5%. Kitty Black Perkins designed the dolls at 2 of the 8 stops, the first Black Barbie in 1980 and Shani in 1991: 2 ÷ 8 × 100 = 25%. Students check: 3 stops are museum notes, 3/8 = 37.5%.",
        "Open *Who’s in your books?* and run the **Background** question: read each choice, count the hands, and set the count. Run **Authors** too, and **Gender** or **Disability** if there is time. Students copy the Background and Authors counts onto their handouts. The total is the number of books.",
        "Ask: *“" + SAMPLE_Q + "”* Our shelf is a **sample**; all children’s books are the **population**. A sample is **biased** when the way it was chosen makes some results more likely. Who chose the books on our shelf? When were they published? Ask: *what would make a sample fairer?*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with our own count at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use our class’s own count."]},
      "body": ["Students choose a handout. All three use the class’s own count, so the answers are yours to check on the board."]}),
    ("levels", {
      "green": "Copy the class count into a table, write fractions and a percent, shade a bar graph, and set the shelf’s percent beside the CCBC’s.",
      "yellow": "Complete a frequency table with fractions and percents, graph it, compare characters and creators with the CCBC’s *about* and *by*, and say what a graph cannot show.",
      "red": "Decide what the whole should be when some books are *Can’t tell*, compare what each count measures, judge the sample for bias, design a fairer survey, and make a claim with evidence."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What our shelf shows",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Add to the shelf", "show": "question", "question": ADD_Q,
         "purpose": "Turn the numbers into a decision.",
         "students": ["What does our graph show?", "Who was hardest to find?"]},
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Show the tab’s chart. Ask: *who did you find the most of? Who was hardest to find?* Then: *“" + ADD_Q + "”* Ask a Red Level student whether the shelf is a fair sample, and why.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Timeline:** 5/8 = 62.5% quote the poster; 3/8 = 37.5% are museum notes; 2/8 = 25% are dolls Kitty Black Perkins designed.",
      "**Check:** each fraction is *count / total books*; the percents in a table add to 100%, give or take rounding.",
      "**Look for:** a comparison that says what each count measures; at Red, a named bias and a fairer plan.",
      "**Exit ticket:** *write one fraction and one percent from our shelf, and say what each one means.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Two sets of numbers, and our own",
      "body": ["The Cooperative Children’s Book Center’s figures, as the room gives them; the timeline’s eight stops; and the survey’s four questions, by their own labels."]}),
    ccbc_box(),
    chart(["When", "Stop", "Source", "Designed by Kitty Black Perkins"],
          [[t[0], t[1], t[3], "yes" if "Kitty Black Perkins" in t[2] else ""] for t in TIMELINE]),
    chart(["Question", "Choices"], [[r[0], r[2]] for r in SURVEY_ROWS]),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Who did you find the most of? Who was hardest to find?",
      ADD_Q,
      "The CCBC counted books published in 2025. Our shelf has books from many years. Does that matter?",
      "Poster 2 calls the first Black Barbie a milestone in representation. What would a milestone look like on our shelf?"]}),
    ("connection", ["**Online,** the *Who’s in your books?* tab counts the hands, draws the chart and prints it, and can count toys, shows and games as well as books. **In the exhibition,** count the dolls in the display case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["The Cooperative Children’s Book Center counts the children’s books it receives each year. Of the books published in 2025 that it received, 13.5% were about Black/African people, and 10.9% were by Black/African authors or illustrators. Today your class counts its own shelf."]

HO_CSS = """
table.data { width: 100%; border-collapse: collapse; font-size: 9.4pt; margin: 4pt 0 6pt; break-inside: avoid; }
table.data th { font: 500 6.8pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5b5a55; text-align: left;
  padding: 0 6pt 3pt 0; border-bottom: 1pt solid #1d1c1a; }
table.data td { border-bottom: .6pt solid #8d8a80; padding: 4.2pt 6pt 4.2pt 0; }
table.data td:first-child { width: 34%; }
table.data tr.total td { font-weight: 600; border-bottom: 1pt solid #1d1c1a; }
table.data.tight td { padding: 3.2pt 6pt 3.2pt 0; }
.graph { display: grid; grid-template-columns: 22pt repeat(10, 1fr); margin: 4pt 0 6pt; break-inside: avoid; font: 400 6.4pt/1.15 'Outfit'; }
.graph span { border-left: .5pt solid #8d8a80; border-bottom: .5pt solid #8d8a80; height: 13pt; }
.graph span.y { border: 0; border-bottom: .5pt dotted #8d8a80; }
.graph b { font-weight: 400; text-align: center; padding: 3pt 1pt 0; }
.side { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 8pt; break-inside: avoid; }
.side div { border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 7pt 10pt; font-size: 9.6pt; line-height: 1.5; }
.side b { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #5b5a55; margin-bottom: 3pt; }
.task { break-inside: avoid; }
"""

SHORT = {"Black/African": "Black/ African", "Pacific Islander": "Pacific Islander", "More than one": "More than one",
         "Animal or not a person": "Animal, not a person", "Can’t tell": "Can’t tell"}

def data_table(rows, cols, total=True, tight=False):
    head = "".join(f"<th>{md(c)}</th>" for c in ["Main character"] + cols)
    body = "".join("<tr><td>" + md(r) + "</td>" + "<td></td>" * len(cols) + "</tr>" for r in rows)
    if total:
        body += '<tr class="total"><td>Total books</td>' + "<td></td>" * len(cols) + "</tr>"
    cls = "data tight" if tight else "data"
    return ("html", f'<table class="{cls}"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')

def data_table2(rows):
    """the table in two halves side by side, to save height"""
    half = (len(rows) + 1) // 2
    head = ("<th>Main character</th><th>Count</th><th>Percent</th>") * 2
    body = ""
    for a, b in zip(rows[:half], rows[half:]):
        body += f"<tr><td>{md(a)}</td><td></td><td></td><td>{md(b)}</td><td></td><td></td></tr>"
    body += '<tr class="total"><td>Total books</td><td></td><td></td><td></td><td></td><td></td></tr>'
    return ("html", f'<table class="data two"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')

def graph(rows=12):
    cells = ""
    for _ in range(rows):
        cells += '<span class="y"></span>' + "<span></span>" * 10
    cells += "<b></b>" + "".join(f"<b>{md(SHORT.get(c, c))}</b>" for c in SURVEY_BACKGROUNDS)
    return ("html", f'<div class="graph">{cells}</div>')

def side(ours, theirs):
    j = lambda t: "<br>".join(md(x) for x in t.split("\n"))
    return ("html", '<div class="side">' + f"<div><b>Our shelf</b>{j(ours)}</div>"
            + f"<div><b>The CCBC, books published in 2025</b>{j(theirs)}</div></div>")

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Math", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HERO_CSS + CSS + HO_CSS + css}

GREEN = handout("green", "BH_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Our count", "blocks": [
            P("Copy your class’s count for the **Background** question from the board. Then add up the total."),
            data_table(SURVEY_BACKGROUNDS, ["Count"], tight=True)]}),
  ("task", {"label": "Part 2", "title": "Part of the whole",
            "body": ["A fraction is **count ÷ total**. Write each as a fraction of all our books.",
                     "**a.** Books with a Black/African main character: ______ / ______",
                     "**b.** Books with a main character who is an animal or not a person: ______ / ______",
                     "**c.** Choose another row: ____________________  ______ / ______",
                     "**d.** Turn **a** into a percent: ______ ÷ ______ = ______  × 100 = ______ %"]}),
  ("task", {"label": "Part 3", "title": "Draw the bar graph", "blocks": [
            P("Number the side of the graph: count by 1s, or by 2s for a big class. Shade one bar for each choice."),
            graph(12)]}),
  ("task", {"label": "Part 4", "title": "Side by side", "blocks": [
            side("Black/African main characters: ______ %",
                 "Books about Black/African people: 13.5%"),
            P("Circle one. Our shelf’s percent is **higher than** / **about the same as** / **lower than** the CCBC’s.")]}),
  ("task", {"label": "Part 5", "title": "What our shelf shows",
            "body": ["**One thing our graph shows is…**"], "lines": 2}),
  ("family", ["Count the main characters in the books at home with your family. Who did you find the most of? Who was hardest to find?"]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "A frequency table", "blocks": [
            P("Copy your class’s **Background** count. Write each as a fraction of the total, then as a percent to one decimal place, as the CCBC does."),
            data_table(SURVEY_BACKGROUNDS, ["Count", "Fraction", "Percent"], tight=True)]}),
  ("task", {"label": "Part 2", "title": "Check your table",
            "body": ["Add the percents. Why might the total be 99.9% or 100.1%, not exactly 100%?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Draw the bar graph", "blocks": [
            P("Number the side, then shade one bar for each choice. Give the graph a title."), graph(9)]}),
  ("task", {"label": "Part 4", "title": "Characters and creators", "blocks": [
            P("Copy the **Authors** count for Black/African authors and illustrators, and find the percent. Then set both of your percents beside the CCBC’s."),
            side("Black/African main characters: ______ %\nBlack/African authors or illustrators: ______ %",
                 "About Black/African people: 13.5%\nBy Black/African authors or illustrators: 10.9%")],
            "body": ["Is a book *about* someone the same as a book *by* someone? Explain, using our numbers."], "lines": 2}),
  ("task", {"label": "Part 5", "title": "What a graph can’t show",
            "body": ["Our graph counts main characters. Name one thing about a book that it cannot tell us."], "lines": 2}),
  ("family", ["Show your family the graph. Ask: *which books would you add to make our shelf look more like the world?*"]),
], ".side div { white-space: normal; }")

RED_CSS = """table.data.two td:first-child, table.data.two td:nth-child(4) { width: 27%; white-space: nowrap; }
table.data.two td:nth-child(4) { padding-left: 10pt; border-left: 1pt solid #1d1c1a; }
table.data.two th:nth-child(4) { padding-left: 10pt; }
table.data.two td { padding: 6pt 6pt 6pt 0; }"""

RED = handout("red", "BH_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Our data", "blocks": [
            P("Copy your class’s **Background** count, and find each percent to one decimal place."),
            data_table2(SURVEY_BACKGROUNDS)]}),
  ("task", {"label": "Part 2", "title": "Which whole?",
            "body": ["Some books are *Can’t tell* or *Animal or not a person*. Find the percent of Black/African main characters **out of only the books with a person whose background we could tell**. Show your working. Which whole is better for comparing with the CCBC? Why?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Counting the same thing?",
            "body": ["Read the CCBC’s figures in the box on page 1 again. Our count is not the same as the CCBC’s. Name **two** differences in what was counted, and say how each could change the percent."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Sample and bias",
            "body": ["Our shelf is a **sample**. Who chose the books on it, and when were they published? Name one way our sample could be **biased**. Then plan a fairer survey: which books, how many, and how you would count them."], "lines": 5}),
  ("task", {"label": "Part 5", "title": "Make a claim",
            "body": ["Write a claim about our shelf. Use two numbers from your table as evidence, and say how sure you are, given the sample. End with the books you would add."], "lines": 5}),
  ("family", ["Count the main characters in the books at home. Is your home shelf a fair sample of all books? Why, or why not?"]),
], RED_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
