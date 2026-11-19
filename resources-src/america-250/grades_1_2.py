"""Grades 1–2 · "A Star for Every State"
Built on the exhibition's Add a Star room: the flag that began with 13 stars
for the 13 states, the resolution of June 14, 1777, the 37 states that
followed with the year each joined, and the four milestones. Facts follow
app/exhibitions/america-250/sign/signText.ts (FLAG_TEXT, FLAG_STATES,
FLAG_MILESTONES); the flags are drawn as the room draws them
(sign/flagLayout.ts: generic arrangements, claiming no historical flag,
except the 50)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (A, CP, STONE_CR, pic, md, OBJ_CSS, FLOW_CSS, LOOK_BACK, THUMBS, review,
                     ORIGINALS, LATER, FLAG_RES, FLAG_MILESTONES, flag_svg)

DIR = "teachers/grades-1-2/"
TITLE = "A Star for Every State"
SUB = "Grades 1–2 · Add a Star"
HERO = pic("leutze-washington.jpg", "Emanuel Leutze, *Washington Crossing the Delaware*, 1851. The Metropolitan Museum of Art. Public domain.", "center 30%")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say that each star on the flag stands for a state", "say what each star on the flag stands for?", False),
    ("count the 13 stars of the first flag, and tell why there were 13", "count the first flag’s stars, and say why there were 13?", False),
    ("put flags in order from fewest stars to most, and read a year for each", "put the flags in order, from 13 stars to 50?", False),
    ("find your own state’s star, and the year it joined", "find your state’s star?", True)],
  "why": "The flag has changed as the country grew. Every star has a story, and one of them is yours.",
  "screen": {"heading": "I can…", "items": [
    "say what each star stands for", "count the 13 stars of the first flag",
    "put the flags in order", "find my state’s star"]}}

MILESTONE_SCREEN = {
  "caption": "How the flag grew (Add a Star)",
  "columns": ["Year", "Stars", "Stripes", "What changed"],
  "rows": [{"cells": [str(y), str(s), str(st), t]} for y, s, st, t in FLAG_MILESTONES]}

CSS = """
.flags { display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 10pt; margin: 4pt 0 10pt; justify-items: center; text-align: center; break-inside: avoid; }
.flags p { margin: 4pt 0 0; font: 500 10pt 'Outfit'; }
.flags small { display: block; font: 400 8pt/1.3 'Outfit'; color: #3f3e3a; }
.flags .box { display: inline-block; width: 64pt; height: 26pt; border: 1.2pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.7); margin-top: 4pt; }
.matchf { display: grid; grid-template-columns: auto 1fr auto; gap: 18pt 10pt; align-items: center; margin: 6pt 20pt 10pt; break-inside: avoid; }
.matchf .yr { font: 500 26pt/1 'Cormorant Garamond', serif; border: 1.4pt solid #1d1c1a; border-radius: 6pt; padding: 6pt 12pt; background: rgba(255,255,255,.6); }
.matchf .dot { height: 12pt; position: relative; }
.matchf .dot::before, .matchf .dot::after { content: ""; position: absolute; top: 0; width: 12pt; height: 12pt; border-radius: 50%; background: #1d1c1a; }
.matchf .dot::before { left: 0; } .matchf .dot::after { right: 0; }
.nums { display: flex; justify-content: center; gap: 26pt; margin: 4pt 0 6pt; }
.nums span { width: 48pt; height: 48pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 28pt/1 'Cormorant Garamond', serif; }
.center { display: flex; justify-content: center; margin: 4pt 0 8pt; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .18em; color: #a9a69b; }
table.st { width: 100%; border-collapse: collapse; font-size: 11pt; margin: 4pt 0 8pt; break-inside: avoid; }
table.st th { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: 1pt solid var(--accent); padding: 0 8pt 3pt 0; }
table.st td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 8pt 4pt 0; }
table.st td.blank { height: 20pt; }
.all { columns: 3; column-gap: 14pt; font-size: 8.4pt; line-height: 1.42; margin: 4pt 0 8pt; }
.all b { font-weight: 500; }
.all p { margin: 0; break-inside: avoid; }
.numline { margin: 8pt 0 10pt; }
"""

def flags(items, w=105, color=True, show=True):
    out = ""
    for stars, cap, sub in items:
        sub_html = f"<small>{md(sub)}</small>" if sub else ""
        out += f'<div>{flag_svg(stars, w, color=color, show_stars=show)}<p>{md(cap)}</p>{sub_html}</div>'
    return f'<div class="flags" style="--n:{len(items)}">{out}</div>'

def nums(*ns):
    return '<div class="nums">' + "".join(f"<span>{n}</span>" for n in ns) + "</div>"

def all_states():
    rows = [f"<p><b>The first 13:</b> {', '.join(ORIGINALS)}</p>"]
    rows += [f"<p><b>{n}</b> {s}, {y}</p>" for n, s, y in LATER]
    return '<div class="all">' + "".join(rows) + "</div>"

def numline():
    """A line from 10 to 50, ticks at every number, labels at tens and at 13."""
    W, x0, x1 = 470, 14, 456
    sx = lambda v: x0 + (v - 10) * (x1 - x0) / 40
    ticks = "".join(f'<line x1="{sx(v):.1f}" y1="{30 if v % 10 else 24}" x2="{sx(v):.1f}" y2="42" stroke="#1d1c1a" stroke-width="{1.4 if v % 10 == 0 else .7}"/>' for v in range(10, 51))
    labels = "".join(f'<text x="{sx(v):.1f}" y="58" text-anchor="middle" font-family="Outfit" font-size="11">{v}</text>' for v in (10, 20, 30, 40, 50))
    mark = f'<circle cx="{sx(13):.1f}" cy="36" r="4.5" fill="#a8343b"/><text x="{sx(13):.1f}" y="16" text-anchor="middle" font-family="Outfit" font-size="10" fill="#a8343b">start: 13</text>'
    return (f'<div class="numline"><svg width="{W}pt" height="62pt" viewBox="0 0 {W} 62"><line x1="{x0}" y1="36" x2="{x1}" y2="36" stroke="#1d1c1a" stroke-width="1.4"/>'
            f'{ticks}{labels}{mark}</svg></div>')

SHORT = [(14, "Vermont", 1791), (17, "Ohio", 1803), (28, "Texas", 1845), (31, "California", 1850), (50, "Hawaii", 1959)]

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "a-star-for-every-state", "large": True,
  "out": DIR + "A250_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + CSS,
  "blocks": [
    ("timing", [("Hook", 4, "#7D8471"), ("Story time", 8, "#2F4A5A"), ("Activity", 14, "#86671A"), ("Close", 4, "#A8452F")]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed",
      "Crayons, including blue; the differentiated handouts",
      "If you can, the exhibition’s *Add a Star* room on the screen"]})],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn that the flag began with **13 stars** for the 13 states that had been the Thirteen Colonies, and that a star was added for each state that joined, until there were **50**. They will count stars, put flags in order, read a list of states and years, and find their own state’s star."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social studies** — symbols of the nation; the 13 first states; how the country grew",
      "**Math** — counting to 50; comparing numbers; ordering; reading a simple table; counting on",
      "**Reading** — finding facts in a list; *constellation*, *stripe*, *resolution*"]})]]),
    ("section", {"label": "Hook · 4 minutes", "title": "How many stars?",
      "screen": {"phase": "Hook", "show": "question",
                 "question": "How many stars are on our flag? What do you think each star stands for?",
                 "purpose": "Start from the flag students know, and guess before they are told.",
                 "students": ["Guess the number first.", "What could a star stand for?"]},
      "body": ["Ask: *“How many stars are on our flag?”* Take guesses and write them on the board. Then ask what each star might stand for. Collect ideas before you tell: **each star stands for a state, and there are 50.** *“But the flag did not always have 50 stars. Today we will find out how it grew.”*"]}),
    ("section", {"label": "Story time · 8 minutes", "title": "Thirteen stars to fifty",
      "screen": [
        {"phase": "Story time", "minutes": 4, "script": [0], "title": "A new constellation", "show": "words",
         "text": "June 14, 1777:\n“thirteen stars, white in a blue field\nrepresenting a new constellation”",
         "purpose": "Hear how the flag began, and why it had 13 stars.",
         "students": ["Why 13 stars?", "What is a constellation?"]},
        {"phase": "Story time", "minutes": 4, "script": [1], "title": "How the flag grew", "show": "chart", **MILESTONE_SCREEN,
         "purpose": "Read four flags in order, from 13 stars to 50.",
         "students": ["Which flag had the most stripes?", "When did the flag reach 50 stars?"]}],
      "body": [
        f"Tell the beginning. *“In 1776, the Thirteen Colonies declared they were free: 13 new states. A year later, on June 14, 1777, the leaders decided what the flag would look like.”* Read their words slowly: {FLAG_RES}. Ask what a constellation is: a group of stars that makes a picture in the sky. *“The 13 stars were a new picture: a new country.”*",
        "Show the four flags on page 3, one at a time, and read the chart. As states joined, stars were added. In **1795** there were 15 stars, and 15 stripes too: that is the flag of *The Star-Spangled Banner*. By **1818** there were 20 states, and the flag went back to 13 stripes, with a star for every state, added on the July 4 after the state joined. Hawaii was the 50th state; the 50-star flag became official on **July 4, 1960**."]}),
    ("section", {"label": "Activity · 14 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Count, order and find stars, at the right level for each student.",
                 "students": ["Choose Green, Yellow or Red.", "Every handout ends with a flag for you to finish."]},
      "body": ["Students work on a handout. All three count the first flag’s stars, put flags in order and finish a flag of their own. Circulate and ask: *“How do you know which flag is older?”* More stars means later."]}),
    ("levels", {
      "green": "Count the first flag’s 13 stars, match two flags to their years, color the first flag, and trace 13 and 50.",
      "yellow": "Count stars and stripes on two flags, write the year under four flags in order, read a list of states and their stars, then draw a new constellation of 13.",
      "red": "Count on from 13 to 50 on a number line, fill in a table of the four flags, find their own state’s star in the full list, and say why a constellation is a good name."}),
    ("section", {"label": "Look back · 4 minutes", "title": "Our state’s star",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS, phase="Close"),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Our state’s star", "show": "question",
         "question": "Which star is our state? Was it one of the first 13?",
         "purpose": "End with the star that belongs to the class: their own state.",
         "students": ["Find our state in the list.", "Was it one of the first 13, or did it join later?"]}],
      "body": ["Put the questions on the screen. For each one, students show a thumb up, sideways or down: *“Can you now "
               + " Can you now ".join(q for _, q, _ in OBJECTIVES["items"]) + "”* Ask a Red Level student to answer the last.",
               "Then find your state together in the list on page 3. If it was one of the first 13, say so: it was there from the start. If it joined later, read its star and year, and count how many stars were already on the flag before it."]}),
    ("cols", [[("section", {"label": "Answer notes", "list": [
      "**Green:** 13 stars; the 13-star flag goes with 1777, the 50-star flag with 1960.",
      "**Yellow:** 13 stars and 13 stripes; 15 stars and 15 stripes; in order 1777, 1795, 1818, 1960; Vermont was the 14th star, Texas the 28th, Hawaii the last.",
      "**Red:** 37 stars were added from 13 to 50 (13, 23, 33, 43, then 7 more). Table: 1777, 13 and 13; 1795, 15 and 15; 1818, 20 and 13; 1960, 50 and 13."]})],
              [("section", {"label": "Assessment", "list": [
      "Says that each star stands for a state",
      "Explains why the first flag had 13 stars",
      "Orders flags by number of stars, and reads a year in a list"]}),
               ("connection", ["**Visit the exhibition:** in *Add a Star*, start with 13 stars and guess the decade each state joined before its star goes on. A bullseye scores 3 points; one decade out scores 1. Play it as a class, and cheer when your state’s star appears."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "How the flag grew",
      "body": ["The flags as the exhibition’s *Add a Star* room draws them. Only the 50-star flag shows the stars as they are set today; the others show how many stars there were, not where they stood."]}),
    ("html", flags([(s, str(y), f"{s} stars, {st} stripes") for y, s, st, _ in FLAG_MILESTONES], 112)),
    ("section", {"label": "Show your class", "title": "Every state, and its star"}),
    ("html", all_states()),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Each star on the flag stands for a state. The first flag, in 1777, had 13 stars for the 13 states that had been the Thirteen Colonies. As each new state joined, a star was added. Today there are 50."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · Add a Star", "level": level, "young": True, "context": CONTEXT,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": HERO, "css": CSS + css}

FAMILY = "Look for a flag together this week. Ask your child: *what does each star stand for? How many stars did the first flag have?*"

GREEN = handout("green", "A250_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Count the stars on the first flag. Circle the number.",
            "blocks": [("html", '<div class="center">' + flag_svg(13, 165) + "</div>" + nums(10, 13, 50))]}),
  ("task", {"label": "Part 2", "title": "Draw a line from each flag to its year.",
            "blocks": [("html", '<div class="matchf">' + flag_svg(13, 100) + '<div class="dot"></div><span class="yr">1960</span>'
                        + flag_svg(50, 100) + '<div class="dot"></div><span class="yr">1777</span></div>')]}),
  ("task", {"label": "Part 3", "title": "Color the first flag. Make the box blue, and leave the 13 stars white.",
            "blocks": [("html", '<div class="center">' + flag_svg(13, 420, color=False) + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Trace the numbers: the first flag, and the flag today.",
            "blocks": [("html", '<div class="trace"><div><span>13 13 13</span></div><div><span>50 50 50</span></div></div>')]}),
  ("family", [FAMILY]),
])

YELLOW = handout("yellow", "A250_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Count the stars and the stripes. Write the numbers.",
            "blocks": [("html", '<div class="flags" style="--n:2">'
                        + f'<div>{flag_svg(13, 170)}<p>Stars <span class="box"></span> Stripes <span class="box"></span></p></div>'
                        + f'<div>{flag_svg(15, 170)}<p>Stars <span class="box"></span> Stripes <span class="box"></span></p></div></div>')]}),
  ("task", {"label": "Part 2", "title": "Put the flags in order. Write the year under each one.",
            "body": ["The years are **1777**, **1795**, **1818** and **1960**. More stars means a later year."],
            "blocks": [("html", flags([(50, "", ""), (13, "", ""), (20, "", ""), (15, "", "")], 100).replace("<p></p>", '<span class="box"></span>'))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Read the list. Answer the questions.",
            "blocks": [("table", {"head": ["Star", "State", "Joined"], "rows": [[str(n), s, str(y)] for n, s, y in SHORT]})],
            "body": ["**a.** Which state was the 14th star? ____________________",
                     "**b.** Which star is Texas? ________",
                     "**c.** Which state was the last star? ____________________"]}),
  ("task", {"label": "Part 4", "title": "The first flag was “a new constellation.” Draw 13 stars in the blue box.",
            "blocks": [("html", '<div class="center">' + flag_svg(13, 270, color=False, show_stars=False) + "</div>")]}),
  ("family", [FAMILY]),
])

RED = handout("red", "A250_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "From 13 stars to 50",
            "blocks": [("html", '<p>The flag began with 13 stars. Today it has 50. Count on by tens from 13 on the number line, then count the rest. How many stars were added?</p>' + numline() + '<p style="font-size:12pt">13 → 23 → ____ → ____ → 50.   Stars added: ________</p>')]}),
  ("task", {"label": "Part 2", "title": "Four flags. Fill in the table.",
            "blocks": [("html", '<p>' + md("**1777:** 13 stripes and 13 stars, for the 13 states. **1795:** 15 stars and 15 stripes. **1818:** back to 13 stripes, with 20 stars. **1960:** 50 stars, after Hawaii joined.") + '</p><table class="st"><tr><th>Year</th><th>Stars</th><th>Stripes</th></tr>'
                        + "".join(f"<tr><td>{y}</td><td class='blank'></td><td class='blank'></td></tr>" for y, *_ in FLAG_MILESTONES) + "</table>")]}),
  ("task", {"label": "Part 3", "title": "Find your state’s star",
            "blocks": [("html", all_states())],
            "body": ["My state is ____________________. It was one of the first 13: yes / no.",
                     "If it joined later, its star is number ______, and it joined in ______."]}),
  ("task", {"label": "Part 4", "title": "A new constellation",
            "body": ["The leaders in 1777 called the 13 stars “a new constellation.” A constellation is a group of stars that makes a picture. Why is that a good name for the first flag?"], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Make your own constellation",
            "blocks": [("draw", "My constellation")],
            "body": ["Draw stars that make a picture. What does your constellation stand for?"]}),
  ("family", [FAMILY]),
], "body.young .drawbox { height: 110pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
