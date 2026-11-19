"""Grades 5–8 · Math · "Who Counts?"
Fractions, percents, ratios and the median, from the Who Gets Remembered?
room (remembered/remembered.ts and weighEvidence.ts: Monument Lab's National
Monument Audit, 2021). The room prints the Top 50's counts for ranks 1–38
and 49–50 only, so no task asks for a total of all fifty; the median needs
only ranks 25 and 26, which it prints (21 and 20)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (POSTER1, ROOM_REMEMBERED, OBJ_CSS, PIC_CSS, THUMBS, TIMING, OVERSHADOWED, review, md)

DIR = "teachers/grades-5-8/math/"
TITLE = "Who Counts?"
SUB = "Grades 5–8 · Math · Percent, ratio and the median of a monument count"
HERO = {"img": POSTER1, "pos": "center 36%"}

AUDIT = "Monument Lab, National Monument Audit (2021), in Who Gets Remembered?"
HOOK_Q = "These are the 50 people with the most public monuments in the United States. How many do you think are women?"
LAST_Q = "Whose statues, plaques or street names are there where you live? Who chose them?"

# the Top 10 and the three women, as the room prints them
TOP = [(1, "Abraham Lincoln", 193), (2, "George Washington", 171), (3, "Christopher Columbus", 149),
       (4, "Martin Luther King Jr.", 86), (5, "Saint Francis of Assisi", 73), (6, "Robert E. Lee", 59),
       (7, "Casimir Pulaski", 51), (8, "Benjamin Franklin", 48), (9, "John F. Kennedy", 44), (10, "Thomas Jefferson", 36)]
WOMEN = [(18, "Joan of Arc", 26), (24, "Harriet Tubman", 21), (28, "Sacagawea", 20)]
MIDDLE = [(25, "Tecumseh", 21), (26, "Alexander Hamilton", 20)]
CHART = {"caption": "Monuments to the Top 10, and to the three women in the Top 50",
         "columns": ["Rank", "Person", "Monuments"],
         "rows": [{"cells": [str(r), n, str(m)]} for r, n, m in TOP + WOMEN]}

WORKED = [
  {"title": "Three in fifty", "steps": ["3 of the Top 50 are women.", "3/50 = 6/100 = 0.06"], "answer": "6%"},
  {"title": "Mermaids and congresswomen", "steps": ["22 monuments to mermaids; 2 to US congresswomen.", "22 : 2 = 11 : 1"], "answer": "11 times as many"},
  {"title": "The middle of the Top 50", "steps": ["Fifty counts in order: the middle falls between rank 25 (21) and rank 26 (20).", "(21 + 20) ÷ 2"], "answer": "20.5"},
]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("write a part of a whole as a fraction, a decimal and a percent",
     "write a part of a whole as a fraction, a decimal and a percent?", False),
    ("compare two amounts with a ratio, and say how many times as many",
     "compare two amounts with a ratio?", False),
    ("find the median of a data set and use it to compare",
     "find a median, and use it to compare?", False),
    ("judge which numbers are fair evidence for a claim, and what a count can’t show",
     "judge which numbers are fair evidence, and what a count can’t show?", True)],
  "why": "Numbers are how a claim that women have been overlooked stops being an opinion and becomes something we can check. Knowing which numbers count as evidence, and which only sound impressive, is a skill for every news story you will read."}

CSS = PIC_CSS + """
.pb { break-after: auto; height: 0; margin: 0; } .pb + * { break-before: page; }
.grid100 { display: grid; grid-template-columns: repeat(10, 15pt); gap: 2pt; margin: 4pt 0 8pt; break-inside: avoid; }
.grid100 i { width: 15pt; height: 15pt; border: .8pt solid #1d1c1a; background: #fff; display: block; }
.grid50 { display: grid; grid-template-columns: repeat(10, 22pt); gap: 3pt; margin: 4pt 0 8pt; break-inside: avoid; }
.grid50 i { width: 22pt; height: 22pt; border: .8pt solid #1d1c1a; background: #fff; display: block; border-radius: 50%; }
.data { border-collapse: collapse; font-size: 9pt; margin: 2pt 0 8pt; break-inside: avoid; }
.data th { font: 500 6.8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; text-align: left; border-bottom: 1pt solid #1d1c1a; padding: 0 12pt 2pt 0; }
.data td { border-bottom: .5pt solid #b5b1a6; padding: 2.5pt 12pt 2.5pt 0; }
.data td:last-child, .data th:last-child { text-align: right; padding-right: 2pt; }
.data tr.w td { font-weight: 600; }
.twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; align-items: start; }
.q { margin: 0 0 7pt; } .q i { display: inline-block; width: 64pt; border-bottom: 1pt solid #1d1c1a; height: 12pt; vertical-align: -2pt; }
.bars { margin: 4pt 0 8pt; break-inside: avoid; }
.bars .row { display: grid; grid-template-columns: 92pt 1fr; align-items: center; height: 24pt; font-size: 9pt; }
.bars .axis { display: grid; grid-template-columns: 92pt 1fr; font: 400 7.5pt 'Outfit'; color: #3f3e3a; }
.bars .scale { display: flex; justify-content: space-between; border-top: 1pt solid #1d1c1a; padding-top: 2pt; }
.bars .track { height: 16pt; border-left: 1pt solid #1d1c1a; display: grid; grid-template-columns: repeat(10, 1fr); }
.bars .track i { border-right: .6pt solid #b5b1a6; }
.claim { font: italic 400 12.5pt/1.3 'Cormorant Garamond', serif; border-left: 2pt solid #1D3557; padding-left: 9pt; margin: 4pt 0 8pt; }
.ev { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 4pt 0 6pt; }
.ev div { background: rgba(255,255,255,.7); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 7pt 9pt 5pt; font-size: 9.2pt; line-height: 1.38; break-inside: avoid; }
.ev .mark { font: 500 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; margin-top: 5pt; color: #3f3e3a; }
.ev .mark span { display: inline-block; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 0 7pt; margin-right: 4pt; }
"""

def data_table(rows, women=()):
    body = "".join(f'<tr class="{"w" if n in women else ""}"><td>{r}</td><td>{md(n)}</td><td>{m}</td></tr>' for r, n, m in rows)
    return f'<table class="data"><thead><tr><th>Rank</th><th>Person</th><th>Monuments</th></tr></thead><tbody>{body}</tbody></table>'

def bars(names, top=200):
    rows = "".join(f'<div class="row"><span>{md(n)}</span><div class="track">{"<i></i>" * 10}</div></div>' for n in names)
    ticks = "".join(f"<span>{v}</span>" for v in range(0, top + 1, top // 5))
    return f'<div class="bars">{rows}<div class="axis"><span></span><div class="scale">{ticks}</div></div></div>'

def q(text):
    return f'<p class="q">{md(text)} <i></i></p>'

GRID100 = '<div class="grid100">' + "<i></i>" * 100 + "</div>"
GRID50 = '<div class="grid50">' + "<i></i>" * 50 + "</div>"

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "who-counts",
  "out": DIR + "WH_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO,
  "css": CSS + OBJ_CSS + "table.fill td { padding: 4pt 6pt 5pt 0; }",
  "blocks": [
    ("timing", [("Hook", 5, TIMING["hook"]), ("Teach", 12, TIMING["teach"]), ("Activity", 23, TIMING["activity"]), ("Close", 5, TIMING["close"])]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students use the numbers in the exhibition’s *Who Gets Remembered?* room, from Monument Lab’s National Monument Audit (2021), to test poster 1’s claim that women’s roles have often been overshadowed. They write 3 of 50 as a fraction, decimal and percent, compare with ratios, find the median of the Top 50, and decide which numbers are evidence for the claim and which only sound impressive."]}),
    ("cols", [
      [("section", {"label": "Standards and themes", "list": [
        "**Ratios and proportional reasoning** — percent as a rate per 100; ratio; “times as many”",
        "**Statistics** — median; comparing a value with the center",
        "**Mathematical practice** — constructing an argument from data"]})],
      [("section", {"label": "Materials needed", "list": [
        "*Who Gets Remembered?* on a screen, or page 3 of this plan",
        "Calculators (optional); colored pencils",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Guess first",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0], "title": "How many?", "show": "image", "img": {"img": ROOM_REMEMBERED}, "fit": "contain",
         "alt": "The Who Gets Remembered? room: rows of statue figures, a few of them orange, beside a question and a guess",
         "caption": HOOK_Q,
         "purpose": "Commit to a guess before seeing the data.",
         "students": ["Write your guess.", "What percent of 50 is your guess?"]},
        {"phase": "Hook", "minutes": 2, "script": [1], "title": "Three", "show": "words",
         "text": "Only 3 of the 50 are women.\nJoan of Arc · Harriet Tubman · Sacagawea", "cite": AUDIT,
         "purpose": "Reveal the answer, and turn it into a question for mathematicians.",
         "students": ["How far off was your guess?", "Is 3 out of 50 a lot or a little? Compared with what?"]}],
      "body": [f"Open *Who Gets Remembered?* (or read from page 3): *“{HOOK_Q}”* Every student writes a guess and turns it into a percent of 50.",
               "Reveal: only **three**, Joan of Arc, Harriet Tubman and Sacagawea. Ask: *“Is 3 out of 50 a lot or a little? Compared with what?”* That question is the lesson."]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Three tools for a fair comparison",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1, 2], "title": "Percent, ratio, median", "show": "worked", "examples": WORKED,
         "purpose": "Meet the three tools of the handouts, each on one of the room’s numbers.",
         "students": ["Check one calculation.", "Which comparison surprises you most?"]},
        {"phase": "Teach", "minutes": 5, "script": [3], "title": "The data", "show": "chart", **CHART,
         "purpose": "See the counts themselves, and where the three women sit.",
         "students": ["Lincoln has 193. How many do the three women have together?", "Is each woman above or below the median of 20.5?"]}],
      "body": [
        "**Percent.** 3 of 50 is 3/50. Scale it to a hundred: 3/50 = 6/100 = 0.06 = **6%**, the figure the room gives. So **47** of the 50, or 94%, are men.",
        "**Ratio.** Among the 48,178 monuments the audit studied, **22** depict mermaids and **2** honor US congresswomen (Barbara Jordan of Texas and Millicent Fenwick of New Jersey). 22 : 2 = 11 : 1: **eleven times as many** monuments to imaginary women as to real women who served in Congress.",
        "**Median.** Fifty counts in order have no single middle; the median is halfway between the 25th and 26th: Tecumseh (21) and Alexander Hamilton (20), so **20.5**. Joan of Arc (26) and Harriet Tubman (21) sit above it; Sacagawea (20), just below.",
        "**The data.** Put up the Top 10 and the three women (page 3). Lincoln alone has **193**; the three women together have 26 + 21 + 20 = **67**. Ask what that comparison does and does not show."]}),
    ("section", {"label": "Activity · 23 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work the monument numbers at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the room’s own numbers to test a claim."]},
      "body": ["Students choose a handout. All three use the same numbers from the room."]}),
    ("levels", {
      "green": "Shade 3 of 50 and 6 of 100 to see they are equal, write the men as a fraction and a percent, compare the mermaids with the congresswomen, and draw bars for Lincoln and the three women.",
      "yellow": "Fill a fraction, decimal and percent table from the room’s numbers, compare with ratios, find the median of the Top 50 and place each woman against it, and say what the numbers show.",
      "red": "Work out how many women a Top 50 of half women would hold, decide which numbers are evidence for poster 1’s claim and which are not, compare two ways of graphing the same counts, and write what a count can never show."}),
    ("section", {"label": "Look back · 5 minutes", "title": "Where you live",
      "screen": [
        review(OBJECTIVES, 3, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Where you live", "show": "question", "question": LAST_Q,
         "purpose": "Take the count home: students can collect data of their own.",
         "students": ["How could you count them? What would you compare?"]}],
      "body": ["Ask the objectives back: *“Can you now…?”* Students show a thumb up, sideways or down; ask a Red Level student to answer the last.",
               f"Close with the room’s question: *“{LAST_Q}”* How could the class count them, and compare?"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Before you open the room.** The Top 50 includes four Confederate leaders; the room sets a note of context beside them. Read it first.",
        "**About the data.** The room prints the counts for ranks 1 to 38 and 49 to 50 only. The handouts never ask for a total of all fifty; the median needs only ranks 25 and 26."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Green:** 3/50 = 6/100 = 6%; 47 men, 47/50 = 94%; 20 more mermaids; 11 times as many.",
        "**Yellow:** 3/50 = 0.06 = 6%; 47/50 = 0.94 = 94%; 5/50 = 0.1 = 10%; median 20.5; Lincoln 193 is about 2.9 times 67.",
        "**Red:** 25 women, 22 more; 22 ÷ 48,178 ≈ 0.046%; the Top 50 and mermaid facts are evidence, Lincoln’s 193 and the five are not.",
        "**Exit ticket:** *write 3 of 50 three ways.*"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Who gets a monument?",
      "body": ["From *Who Gets Remembered?*: Monument Lab’s National Monument Audit (2021), which studied 48,178 monuments across the United States."]}),
    ("html", '<div class="twocol"><div>' + data_table(TOP + WOMEN, women=[n for _, n, _ in WOMEN]) + '</div><div>'
             + '<p class="claim">' + md(OVERSHADOWED) + '</p><p style="font-size:7.5pt;letter-spacing:.14em;text-transform:uppercase;margin:-4pt 0 10pt">Poster 1</p>'
             + '<p style="font-size:9.6pt">Of the 50 people with the most recorded public monuments, <b>3</b> are women: <b>6%</b>.</p>'
             + '<p style="font-size:9.6pt">There are more monuments depicting mermaids (<b>22</b>) than monuments to US congresswomen (<b>2</b>: Barbara Jordan of Texas and Millicent Fenwick of New Jersey).</p>'
             + '<p style="font-size:9.6pt">Only five of the Top 50 were Black or Indigenous, and there are no US-born Latinx, Asian, Pacific Islander or self-identified LGBTQ+ people among them.</p>'
             + '<p style="font-size:9.6pt">Middle of the Top 50: rank 25, Tecumseh, <b>21</b>; rank 26, Alexander Hamilton, <b>20</b>.</p></div></div>'),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Is 3 out of 50 a lot or a little? Compared with what?",
      "Why might so few women have monuments?",
      "What could a count of monuments never tell you about a person?",
      "Whose stories are missing from the history you learn, and how could we find them?"]}),
    ("connection", ["**Online,** *Who Gets Remembered?* shows the list with its counts, and *Tip the scale* asks which facts are evidence. **In the exhibition,** poster 1 makes the claim this lesson tests."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In its National Monument Audit (2021), Monument Lab studied 48,178 monuments across the United States and listed the 50 people with the most. Poster 1 in this exhibition makes a claim: *“" + OVERSHADOWED + "”* Numbers can test it."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Math", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Handout · Grades 5–8 Math · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Three in fifty",
            "blocks": [("html", "<p>Of the 50 people with the most monuments, <b>3</b> are women. Shade 3 circles. Then shade 6 squares of the hundred.</p>"
                        + '<div class="twocol"><div>' + GRID50 + '</div><div>' + GRID100 + '</div></div>'
                        + q("Fill in: 3/50 = ___/100 =") + q("So what percent of the Top 50 are women?"))]}),
  ("task", {"label": "Part 2", "title": "The men",
            "blocks": [("html", q("How many of the 50 are men?") + q("Write it as a fraction of 50:") + q("Write it as a percent:")
                        + "<p>Check: the women’s percent and the men’s percent should add up to ___%.</p>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Mermaids and congresswomen",
            "blocks": [("html", "<p>Among the 48,178 monuments studied, <b>22</b> are monuments to mermaids. Only <b>2</b> are monuments to US congresswomen.</p>"
                        + q("How many more mermaid monuments are there?") + q("How many times as many? (22 ÷ 2)")
                        + "<p>Finish the sentence: <i>For every 1 monument to a congresswoman, there are ___ monuments to mermaids.</i></p>")]}),
  ("task", {"label": "Part 4", "title": "Draw the bars",
            "blocks": [("html", "<p>Color a bar for each person. Each gray line is 20 monuments.</p>"
                        + data_table([TOP[0]] + WOMEN, women=[n for _, n, _ in WOMEN])
                        + bars(["Abraham Lincoln", "Joan of Arc", "Harriet Tubman", "Sacagawea"]))],
            "body": ["What does your graph show? Write one sentence."], "lines": 3}),
  ("family", ["Count the statues, plaques or street names near your home or school. How many honor women?"]),
], ".grid50 { grid-template-columns: repeat(10, 15pt); gap: 3pt; } .grid50 i { width: 15pt; height: 15pt; } .grid100 { grid-template-columns: repeat(10, 10pt); gap: 1.5pt; } .grid100 i { width: 10pt; height: 10pt; } .q i { width: 80pt; } .q { margin-bottom: 5pt; } .bars .row { height: 40pt; } .bars .track { height: 26pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Three ways to write it",
            "blocks": [("html", "<p>Each fact is from the audit’s Top 50. Fill in the table.</p>")]}),
  ("table", {"head": ["Part of the Top 50", "Fraction", "Decimal", "Percent"], "rows": [
      ["3 are women", "3/50", "", ""], ["47 are men", "", "", ""], ["5 were Black or Indigenous", "", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Compare with ratios",
            "blocks": [("html", q("a. 22 monuments to mermaids, 2 to US congresswomen. Write the ratio in simplest form:")
                        + q("b. Lincoln has 193 monuments. Joan of Arc, Harriet Tubman and Sacagawea have 26, 21 and 20. How many do the three women have together?")
                        + q("c. About how many times as many does Lincoln have as all three women together? (Round to one decimal place.)"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "The middle of the Top 50",
            "blocks": [("html", '<div class="twocol"><div>' + data_table(MIDDLE + WOMEN, women=[n for _, n, _ in WOMEN]) + "</div><div>"
                        "<p>The Top 50’s counts are listed from most to fewest. With 50 values, the <b>median</b> is halfway between the 25th and the 26th.</p></div></div>"
                        + q("The median of the Top 50 is") + "<p>Is each woman above or below the median? By how much?</p>")]}),
  ("table", {"head": ["Woman", "Monuments", "Above or below?", "By how much?"], "rows": [
      ["Joan of Arc", "26", "", ""], ["Harriet Tubman", "21", "", ""], ["Sacagawea", "20", "", ""]]}),
  ("task", {"label": "Part 4", "title": "What do the numbers show?",
            "body": ["Use **two** of your answers to explain whether the numbers support poster 1’s claim."], "lines": 5}),
  ("family", ["Ask at home: who has a statue or a street named for them near us? Count how many are women."]),
], "table.fill td:first-child { width: 34%; font-weight: 500; } table.fill td { padding-top: 8pt; padding-bottom: 14pt; } .q { margin-bottom: 10pt; }")

RED = handout("red", "WH_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "What would fair look like?",
            "blocks": [("html", q("a. If half of the Top 50 were women, how many women would there be?")
                        + q("b. How many more women is that than the 3 there are now?")
                        + q("c. Of the 48,178 monuments studied, 22 depict mermaids. What percent is that? (Round to three decimal places.)")
                        + "<p><b>d.</b> Your answer to <b>c</b> is tiny. So why is the mermaid fact still striking? What is it really comparing?</p>")], "lines": 1}),
  ("task", {"label": "Part 2", "title": "Two graphs, one data set",
            "blocks": [("html", "<p>Lincoln has <b>193</b> monuments. The three women together have <b>67</b>.</p>"
                        "<p>Graph A draws both bars with the axis starting at <b>0</b>. Graph B starts its axis at <b>60</b>. Sketch both. Under each, write what it makes a reader believe. Which one is honest?</p>"
                        '<div class="twocol"><div class="drawbox" style="height:96pt"><span>Graph A · axis from 0</span></div>'
                        '<div class="drawbox" style="height:96pt"><span>Graph B · axis from 60</span></div></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Evidence, or not?",
            "blocks": [("html", '<p>Poster 1’s claim:</p><p class="claim">' + md(OVERSHADOWED) + '</p>'
                        '<p>Every fact below is true. Circle whether it is evidence <b>for this claim</b>.</p><div class="ev">'
                        + "".join(f'<div>{md(t)}<p class="mark"><span>Evidence</span><span>Not evidence</span></p></div>' for t in [
                            "Of the 50 people with the most recorded public monuments in the United States, 3 are women: 6%.",
                            "Abraham Lincoln has more recorded public monuments in the United States than anyone else: 193.",
                            "There are more monuments depicting mermaids (22) than monuments to US congresswomen (2).",
                            "Only five of the Top 50 were Black or Indigenous."]) + "</div>")],
            "body": ["Choose one card you marked **Not evidence**. It is true, so why doesn’t it support the claim?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "What a count can’t show",
            "body": ["Violet Dina Want, a factory machinist and mother of four, is remembered in this exhibition by her family’s biography and letters. Poster 1 says ordinary women’s lives matter to history too. What can a count of monuments **never** tell us about whose lives mattered? What other kind of evidence would you look for?"], "lines": 6}),
  ("family", ["Look for a monument, plaque or street sign near you. Who chose it, and when? Who is missing?"]),
], ".drawbox { margin: 4pt 0 6pt; } .q i { width: 56pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
