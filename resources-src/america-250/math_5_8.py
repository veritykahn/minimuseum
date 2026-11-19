"""Grades 5–8 · Math · "Counting a Nation"
Data and proportional reasoning from the exhibition: the flag's growth from
13 stars to 50 in Add a Star (FLAG_STATES and FLAG_MILESTONES in
sign/signText.ts, as "Our Flag" gives each year), and the numbers the
posters and A Copy of a Copy give (america250.ts, poster 2; COPIES)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (LEUTZE, pic, md, OBJ_CSS, FLOW_CSS, EV_CSS, TIMING_45, look_back_say, review, ev, quote)

DIR = "teachers/grades-5-8/math/"
TITLE = "Counting a Nation"
SUB = "Grades 5–8 · Math · Data and proportion from 1776 to 50 stars"

HERO = pic("leutze.jpg", LEUTZE, "center 42%")

# FLAG_STATES, as Add a Star has them: the star, the state, the year it joined
STATES = [
  (14, "Vermont", 1791), (15, "Kentucky", 1792), (16, "Tennessee", 1796), (17, "Ohio", 1803),
  (18, "Louisiana", 1812), (19, "Indiana", 1816), (20, "Mississippi", 1817), (21, "Illinois", 1818),
  (22, "Alabama", 1819), (23, "Maine", 1820), (24, "Missouri", 1821), (25, "Arkansas", 1836),
  (26, "Michigan", 1837), (27, "Florida", 1845), (28, "Texas", 1845), (29, "Iowa", 1846),
  (30, "Wisconsin", 1848), (31, "California", 1850), (32, "Minnesota", 1858), (33, "Oregon", 1859),
  (34, "Kansas", 1861), (35, "West Virginia", 1863), (36, "Nevada", 1864), (37, "Nebraska", 1867),
  (38, "Colorado", 1876), (39, "North Dakota", 1889), (40, "South Dakota", 1889), (41, "Montana", 1889),
  (42, "Washington", 1889), (43, "Idaho", 1890), (44, "Wyoming", 1890), (45, "Utah", 1896),
  (46, "Oklahoma", 1907), (47, "New Mexico", 1912), (48, "Arizona", 1912), (49, "Alaska", 1959),
  (50, "Hawaii", 1959)]
DECADES = list(range(1790, 1960, 10))
BY_DECADE = {d: [s for _, s, y in STATES if y // 10 * 10 == d] for d in DECADES}
assert sum(len(v) for v in BY_DECADE.values()) == 37

MILESTONES = [(1777, "13 stars", "13 stripes and 13 stars, for the 13 states."),
              (1795, "15 stars", "15 stars and 15 stripes, after Vermont and Kentucky joined."),
              (1818, "20 stars", "Back to 13 stripes, with a star for every state, added on the July 4 after a state joins."),
              (1960, "50 stars", "50 stars, after Hawaii joined, official on July 4, 1960.")]

# the posters' numbers (poster 2) and the copies' (A Copy of a Copy)
NUMBERS = [
  ("Washington’s army, summer 1776", "approximately 19,000 men, many sick, poorly equipped, serving on enlistments already expiring"),
  ("The British on Staten Island", "32,000 troops, the largest expeditionary force the Empire had ever assembled"),
  ("Washington’s army, November 1776", "perhaps 3,000 effective troops, retreating across New Jersey"),
  ("The Dunlap broadside", "about 200 copies printed on July 4–5, 1776; 26 copies are known to survive")]

HOOK_Q = "The flag began with 13 stars. Now it has 50. In which decade do you think the most states joined?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("organize the years the states joined the Union into a frequency table and a bar graph by decade",
     "organize the states’ years into a table and a graph by decade?", False),
    ("describe the data: the decade with the most states, the decades with none, the range and the longest gap",
     "describe the data: most, none, range and longest gap?", False),
    ("use percents and ratios to compare the numbers of 1776: the two armies, and the copies that survive",
     "use percents and ratios to compare the numbers of 1776?", False),
    ("judge what an approximate number can and cannot show, and what a graph leaves out",
     "judge what an estimate can show, and what a graph leaves out?", True)],
  "why": "The story of a nation is also a story told in numbers. Reading them carefully, and knowing when a number is only an estimate, is how we keep from being fooled by them."}

WORKED = [
  {"title": "Two armies", "steps": ["Washington: approximately 19,000", "The British: 32,000", "32,000 ÷ 19,000 ≈ 1.7"],
   "answer": "About 1.7 British troops for every American soldier"},
  {"title": "An army dwindling", "steps": ["From about 19,000 to perhaps 3,000", "19,000 − 3,000 = 16,000 fewer", "16,000 ÷ 19,000 ≈ 0.84"],
   "answer": "A decrease of about 84%"},
  {"title": "Copies that survive", "steps": ["About 200 Dunlap copies printed", "26 known to survive", "26 ÷ 200 = 0.13"],
   "answer": "About 13% survive"}]

DECADE_SCREEN = {"caption": "When each new star joined the flag: the 37 states after the first 13, by decade (Add a Star)",
                 "columns": ["Decade", "States that joined", "Count"],
                 "rows": [{"cells": [f"{d}s", ", ".join(BY_DECADE[d]) or "none", str(len(BY_DECADE[d]))]} for d in DECADES]}

FIT_CSS = """
table.dec { width: 100%; border-collapse: collapse; font-size: 8.4pt; margin: 4pt 0 9pt; break-inside: avoid; }
table.dec th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 3pt 0; border-bottom: 1pt solid var(--accent); }
table.dec td { border-bottom: .6pt solid #c8c5bb; padding: 2.6pt 6pt 2.6pt 0; vertical-align: top; }
table.dec td:first-child { width: 13%; font-weight: 500; }
table.dec td:last-child { width: 9%; text-align: center; }
table.dec td.blank { height: 14pt; }
.refs { font-size: 9pt; }
"""

def decade_table(counts=True, years=False, blank_counts=False, head=("Decade", "States that joined", "Count")):
    def names(d):
        if years:
            return ", ".join(f"{s} ({y})" for _, s, y in STATES if y // 10 * 10 == d) or "—"
        return ", ".join(BY_DECADE[d]) or "—"
    h = "".join(f"<th>{x}</th>" for x in head)
    rows = ""
    for d in DECADES:
        c = "" if blank_counts else str(len(BY_DECADE[d]))
        rows += f'<tr><td>{d}s</td><td>{names(d)}</td><td class="{"blank" if blank_counts else ""}">{c}</td></tr>'
    return f'<table class="dec"><thead><tr>{h}</tr></thead><tbody>{rows}</tbody></table>'

LESSON = {
  "slug": "counting-a-nation",
  "out": DIR + "A250_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + FIT_CSS,
  "blocks": [
    ("timing", TIMING_45),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will turn the exhibition’s record of the flag, a new star for each state in the year it joined the Union, into a **frequency table and bar graph by decade**, and describe what the graph shows and hides. Then they will use **percents and ratios** with the numbers the posters give for 1776, and ask what an approximate number such as *perhaps 3,000* can and cannot tell us."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Statistics and data** — frequency tables; bar graphs and histograms by interval; mode, range and gaps",
      "**Ratios and proportional reasoning** — ratio, percent, percent decrease",
      "**Number** — elapsed time in years; estimating and rounding; the language of approximation",
      "**History** — the growth of the Union; the odds against the army of 1776"]}),
    ("section", {"label": "Materials needed", "list": [
      "*Add a Star*, projected; *A Copy of a Copy* and the poster *We Shall All Hang Together*",
      "The *Show your class* page (page 3); calculators; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Guess the decade",
      "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q,
                 "purpose": "Make a prediction the data can test.",
                 "students": ["Write your guess.", "Play three rounds of Add a Star: a bullseye scores 3, one decade out scores 1."]},
      "body": [f"Open *Add a Star*. *“{HOOK_Q}”* Students write a guess. Play the first three rounds as a class (Vermont, Kentucky, Tennessee), voting on the decade before each star goes on. A bullseye scores 3 points; one decade out scores 1. *“Today we stop guessing and let the data answer.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Fifty stars, and the numbers of 1776",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "The stars by decade", "show": "chart", **DECADE_SCREEN,
         "purpose": "Organize the flag’s growth into a frequency table, then read it.",
         "students": ["Which decade has the most?", "Which decades have none?", "What is the longest gap?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "The numbers of 1776", "show": "worked", "examples": WORKED,
         "purpose": "Use ratio and percent to see the odds the signers faced, and how few first printings survive.",
         "students": ["Check one calculation.", "Why does the poster say *approximately* and *perhaps*?"]}],
      "body": [
        "The flag began with 13 stars for the 13 states that had been the Thirteen Colonies. Thirty-seven more states joined. Show the table on page 3: each state’s star, grouped by the decade it joined. Model one row as a tally and one bar on a graph.",
        "Read the data together. The **mode** is the 1810s, with five states. Three decades, the 1920s, 1930s and 1940s, have **none**. The **range** of years runs from 1791 to 1959, which is 168 years, and the **longest gap** is from 1912 to 1959, 47 years. Ask: *what does a bar graph by decade hide?* Two states in 1959 look the same as two states ten years apart.",
        "Now the numbers on the poster *We Shall All Hang Together*: Washington’s army of approximately 19,000 against 32,000 British troops on Staten Island; by November, perhaps 3,000 effective troops. Work the ratio and the percent decrease, then the copies: about 200 Dunlap broadsides, 26 known to survive. Stress the words *approximately*, *perhaps* and *about*: an answer cannot be more exact than the numbers it starts from."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice with the same data at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the same stars and the same numbers from 1776."]},
      "body": ["Students choose a handout. All three levels use the same stars and the same numbers from 1776."]}),
    ("levels", {
      "green": "Count the states in each decade and draw a bar graph. Find the decade with the most and the decades with none, and work out how many years passed between pairs of dates.",
      "yellow": "Build the frequency table and bar graph, find the mode, range and longest gap, then work out a ratio and two percents from the numbers of 1776.",
      "red": "Compare the first and second halves of the data, find percents and rates, and judge what *approximately* and *perhaps* do to an answer, and what a graph by decade hides."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What the numbers say",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Back to the guess", "show": "question", "question": HOOK_Q,
         "purpose": "Test the hook’s guesses against the data, and name one thing the numbers cannot say.",
         "students": ["Was your guess right?", "Name one thing these numbers cannot tell us."]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Return to the guesses from the hook. Who chose the 1810s? Ask one student from each level to share one finding. Then ask: *what can these numbers not tell us?* The data shows when states joined; it says nothing about how or why.",
               look_back_say()]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Counts by decade, 1790s to 1950s:** 3, 1, 5, 2, 2, 4, 3, 4, 1, 4, 3, 1, 2, 0, 0, 0, 2 (total 37). Mode: the 1810s. Range: 1791 to 1959, 168 years. Longest gap: 1912 to 1959, 47 years.",
      "**1776:** 32,000 ÷ 19,000 ≈ 1.7; 19,000 to 3,000 is a decrease of about 84%; 26 of 200 is 13%. The original 13 are 26% of today’s 50 stars.",
      "**Elapsed time:** 1776 to 1823 (Stone’s engraving), 47 years; to 1826, 50; to 2026, 250.",
      "**Exit ticket:** *one fact the graph shows, and one it hides.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "A star for every state, by decade",
      "body": ["Project or print this page for the lesson. The 37 states that joined after the first 13, each in the year *Add a Star* gives, from “Our Flag” (U.S. House of Representatives)."]}),
    ("html", decade_table(years=True, head=("Decade", "States that joined, and the year", "Count"))),
    ("section", {"label": "Show your class", "title": "The flag’s milestones"}),
    ("refs", [(str(y), t) for y, _, t in MILESTONES]),
    ("section", {"label": "Show your class", "title": "The numbers of 1776"}),
    ("refs", NUMBERS),
    ("connection", ["**Visit the exhibition:** play *Add a Star* to the end, and compare the class score with the bar graph. On the poster *We Shall All Hang Together*, find each number of the army in its chapter, *The War That Nearly Was Not Won*."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The flag began in 1777 with 13 stars, one for each state that had been a colony. A new star went on for each state that joined, until there were 50. The exhibition’s room *Add a Star* gives the year each state joined. Today you turn those years, and the numbers of 1776, into mathematics."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Math", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": EV_CSS + FIT_CSS + css}

GRID_CSS = """
.graph { display: grid; grid-template-columns: 18pt repeat(17, 1fr); margin: 4pt 0 6pt; break-inside: avoid; font: 400 6.6pt 'Outfit'; }
.graph span { border-left: .5pt solid #8d8a80; border-bottom: .5pt solid #8d8a80; height: 15pt; }
.graph span.y { border: 0; text-align: right; padding-right: 3pt; line-height: 26pt; height: 15pt; }
.graph b { font-weight: 400; text-align: center; padding-top: 2pt; }
table.fill td { padding: 4pt 6pt 6pt 0; }
"""

def graph(rows=5):
    cells = ""
    for r in range(rows, 0, -1):
        cells += f'<span class="y">{r}</span>' + "<span></span>" * 17
    cells += "<b></b>" + "".join(f"<b>{d}s</b>" for d in DECADES)
    return f'<div class="graph">{cells}</div>'

GREEN = handout("green", "A250_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Count the stars by decade",
            "body": ["Each state got a star in the year it joined. Count the states in each decade and write the number in the last column. The first is done for you."]}),
  ("html", decade_table(years=True, blank_counts=True).replace('<tr><td>1790s</td>', '<tr><td>1790s</td>', 1)
           .replace('<td class="blank"></td></tr>', '<td>3</td></tr>', 1)),
  ("task", {"label": "Part 2", "title": "Draw the bar graph",
            "blocks": [("html", graph(5))],
            "body": ["Shade one square for each state, in its decade. The 1790s are 3 squares high."]}),
  ("task", {"label": "Part 3", "title": "Read your graph",
            "body": ["**a.** Which decade has the most states? ______________  How many? ______",
                     "**b.** Name the three decades in a row when **no** state joined. ________________________________",
                     "**c.** How many years from the Declaration in 1776 to Hawaii in 1959? Show your subtraction."], "lines": 1}),
  ("task", {"label": "Part 4", "title": "How many years?",
            "body": ["**a.** The Declaration was adopted in 1776. Stone made his famous engraving of it in 1823. How many years later? ______",
                     "**b.** Jefferson and Adams both died on July 4, 1826. How many years after 1776? ______",
                     "**c.** How many years from 1776 to 2026? ______  What is this year’s anniversary called? ______________"]}),
  ("connection", ["Play *Add a Star*. Before each star goes on, use your bar graph to guess the decade. Did your score go up?"]),
], GRID_CSS + "table.dec td { padding: 2.3pt 6pt 2.3pt 0; } .graph span { height: 19pt; } .graph span.y { line-height: 34pt; height: 19pt; }")

YELLOW = handout("yellow", "A250_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Count by decade",
            "body": ["Count the states in each decade and write each count in the last column."]}),
  ("html", decade_table(years=True, blank_counts=True)),
  ("task", {"label": "Part 2", "title": "Draw the bar graph",
            "blocks": [("html", graph(5))]}),
  ("task", {"label": "Part 3", "title": "Describe the data",
            "body": ["**a.** Mode (the decade with the most states): ____________   **b.** Range of years (first to last): ____________",
                     "**c.** Longest gap between two joining years: from ______ to ______, which is ______ years.",
                     "**d.** The first 13 states are what percent of today’s 50 stars? ______"]}),
  ("task", {"label": "Part 4", "title": "The numbers of 1776",
            "blocks": [("html", ev(NUMBERS[:3], "three"))],
            "body": ["**a.** Write the ratio of British troops to Washington’s men, then simplify it to about *? : 1*.",
                     "**b.** By what percent did Washington’s effective army shrink from summer to November? Show your work."], "lines": 3}),
  ("connection", ["In *A Copy of a Copy*, about 200 Dunlap broadsides were printed and 26 are known to survive. What percent survive?"]),
], GRID_CSS + "table.dec td { padding: 2.1pt 6pt 2.1pt 0; } table.dec td.blank { height: 12pt; } .graph span { height: 12pt; } .graph span.y { line-height: 20pt; height: 12pt; }")

RED = handout("red", "A250_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Two halves of a century and a half",
            "blocks": [("html", decade_table(years=False))],
            "body": ["**a.** How many states joined from 1791 to 1875, and how many from 1876 to 1959? Compare the two as a ratio.",
                     "**b.** Find the mean number of states per decade, 1790s to 1950s. Is the mean a good summary of this data? Why?"], "lines": 2}),
  ("task", {"label": "Part 2", "title": "What a graph hides",
            "body": ["A bar graph by decade puts Florida and Texas (both 1845) beside Iowa (1846) and Wisconsin (1848), but counts 1912 and 1959 as far apart as 1912 and 1919. Choose a better interval or graph for showing the **gaps**, and say what it would show."], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Approximately, perhaps, about",
            "blocks": [("html", ev(NUMBERS, "two"))],
            "body": ["**a.** Find the percent decrease in Washington’s effective army, and the percent of Dunlap broadsides that survive.",
                     "**b.** The poster says *approximately* 19,000 and *perhaps* 3,000. If the true numbers were 18,500 and 3,500, how much would your percent change? Should you report your answer as *84.2%*? Explain."], "lines": 4}),
  ("connection", ["The flag had 15 stars and 15 stripes in 1795, then went back to 13 stripes in 1818. Use the data to explain why adding a stripe for every state could not last."]),
], GRID_CSS + "table.dec td { padding: 1.8pt 6pt 1.8pt 0; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
