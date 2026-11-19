"""Grades 3–4 · "History at Home"
Who gets remembered, and why an ordinary woman's life is history too. Facts
follow app/exhibitions/womens-history/: poster 1 (womensHistory.ts), the Who
Gets Remembered? room (remembered/remembered.ts, threeWomen.ts,
weighEvidence.ts: Monument Lab's National Monument Audit, 2021) and poster 2's
biography of Violet Dina Want with its photographs. The war is named only as
a time ("after the war"); none of the Blitz is told at this age."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (PHOTOS, POSTER1, ROOM_REMEMBERED, OBJ_CSS, PIC_CSS, THUMBS, TIMING, OVERSHADOWED, DEEPER,
                     review, photos, ph, md)

DIR = "teachers/grades-3-4/"
TITLE = "History at Home"
SUB = "Grades 3–4 · Who Gets Remembered? · An everyday life as history"
HERO = {"img": POSTER1, "pos": "center 40%"}

HOOK_Q = "These are the 50 people with the most public monuments in the United States. How many do you think are women?"
REVEAL = "Only 3 of the 50 are women.\nJoan of Arc · Harriet Tubman · Sacagawea"
LEGACY = "The personal histories of women like her help us understand the past—not just in grand historical events, but through the everyday sacrifices and triumphs of ordinary people who shaped the world we live in today."
MONUMENT_Q = "If you could raise a monument to one woman in your life or your community, who would it be, and why?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say what Women’s History Month is, and how it began",
     "say how Women’s History Month began?", False),
    ("use numbers to show whose stories get remembered with a statue",
     "use numbers to show who gets a statue?", False),
    ("read a family photograph and a biography as evidence about everyday life long ago",
     "read a photograph and a biography as evidence?", False),
    ("explain why an ordinary woman’s life is part of history",
     "explain why an ordinary woman’s life is history too?", True)],
  "why": "History is not only the people with statues. Everyday lives, like Violet’s, show how people really lived, and every family has stories worth keeping."}

# Women's History Month, as poster 1 tells it
WHM = [("1978", "A week-long celebration begins in Santa Rosa, California."),
       ("1980", "President Jimmy Carter declares the first National Women’s History Week."),
       ("1987", "Congress expands it to the whole month of March."),
       ("Every March", "Women’s History Month honors the achievements and contributions of women.")]
WHM_SCREEN = {"caption": "How Women’s History Month began, as poster 1 tells it",
              "columns": ["When", "What happened"], "rows": [{"cells": [a, b]} for a, b in WHM]}

CSS = PIC_CSS + """
.fifty { display: grid; grid-template-columns: repeat(10, 1fr); gap: 9pt 4pt; margin: 4pt 0 8pt; break-inside: avoid; }
.fifty svg { display: block; margin: 0 auto; }
.whm { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 9.6pt; }
.whm td { border-bottom: .6pt solid #9a978c; padding: 6pt 8pt 6pt 0; vertical-align: middle; }
.whm td:first-child { width: 72pt; font: 500 12pt 'Outfit'; }
.whm td.blank { border-bottom: 1pt solid #1d1c1a; }
.bank { display: flex; gap: 10pt; margin: 2pt 0 6pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 1pt 12pt; font: 500 9.5pt 'Outfit'; background: rgba(255,255,255,.6); }
.check { list-style: none; padding: 0; columns: 2; margin: 4pt 0 6pt; }
.check li::before { content: ""; display: inline-block; width: 11pt; height: 11pt; border: 1pt solid #1d1c1a; background: #fff; margin-right: 6pt; vertical-align: -2pt; }
.pic { display: grid; grid-template-columns: 128pt 1fr; gap: 12pt; align-items: start; margin: 4pt 0 6pt; }
.pic img { width: 128pt; height: 162pt; object-fit: cover; border: 1pt solid #1d1c1a; border-radius: 3pt; }
.ev { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 4pt 0 6pt; }
.ev div { background: rgba(255,255,255,.7); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 7pt 9pt 5pt; font-size: 9.4pt; line-height: 1.38; break-inside: avoid; }
.ev .mark { font: 500 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; margin-top: 5pt; color: #3f3e3a; }
.ev .mark span { display: inline-block; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 0 7pt; margin-right: 4pt; }
.claim { font: italic 400 12.5pt/1.3 'Cormorant Garamond', serif; border-left: 2pt solid #1D3557; padding-left: 9pt; margin: 4pt 0 8pt; }
table.fill td:first-child { width: 46%; }
.three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 10pt; }
.three div { border-top: 3pt solid #f2661f; background: #f6f1e4; padding: 6pt 9pt 4pt; font-size: 9pt; }
.three b { display: block; font: 600 12.5pt 'Cormorant Garamond', serif; }
"""

FIGURE = ('<svg viewBox="0 0 20 30" width="21pt" height="31pt"><circle cx="10" cy="5" r="4" fill="#fff" stroke="#1d1c1a" stroke-width="1.2"/>'
          '<path d="M4 25V14a6 6 0 0 1 12 0v11z" fill="#fff" stroke="#1d1c1a" stroke-width="1.2"/>'
          '<rect x="2" y="25" width="16" height="4" fill="#c8c5bb"/></svg>')
FIFTY = '<div class="fifty">' + FIGURE * 50 + '</div>'

def whm_table(blanks):
    rows = "".join(f'<tr><td class="{"blank" if a in blanks else ""}">{"" if a in blanks else a}</td><td>{md(b)}</td></tr>' for a, b in WHM)
    return f'<table class="whm"><tbody>{rows}</tbody></table>'

def pic(key, inner):
    return f'<div class="pic"><img src="{PHOTOS[key]["img"]}" alt=""><div>{inner}</div></div>'

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "history-at-home", "large": True,
  "out": DIR + "WH_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "css": CSS + OBJ_CSS + "body { line-height: 1.45; }",
  "blocks": [
    ("timing", [("Hook", 5, TIMING["hook"]), ("Teach", 10, TIMING["teach"]), ("Activity", 20, TIMING["activity"]), ("Close", 5, TIMING["close"])]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words for historians"}),
               ("refs", [("Monument", "a statue or marker that honors someone"),
                         ("Evidence", "a clue that helps show what is true"),
                         ("Biography", "the story of a person’s life"),
                         ("Ordinary", "everyday; not famous")])],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn how Women’s History Month began and use numbers from the *Who Gets Remembered?* room to see that only three of the fifty people with the most monuments in the United States are women. They will then meet Violet Dina Want, a working woman born in London in 1907, and read her family photographs and biography as evidence of everyday life, to explain why an ordinary woman’s life is part of history."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social studies** — history of everyday life; photographs and biographies as evidence; chronology",
      "**Math** — parts of fifty; *3 out of 50* is *6 out of 100*, or 6%",
      "**ELA** — claim and evidence; asking good questions",
      "**Women’s History Month** — its origins, as poster 1 tells them"]}),
               ("section", {"label": "Materials needed", "list": [
      "*Who Gets Remembered?* and *Violet’s Life* on a screen, or page 3 of this plan",
      "Colored pencils",
      "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Who gets a statue?",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0], "title": "Who gets a statue?", "show": "image", "img": {"img": ROOM_REMEMBERED}, "fit": "contain",
         "alt": "The Who Gets Remembered? room: rows of statue figures, a few of them orange, beside a question and a guess",
         "caption": HOOK_Q,
         "purpose": "Guess before knowing: let the number surprise them.",
         "students": ["Make a guess: how many of the 50 are women?", "Write your guess down."]},
        {"phase": "Hook", "minutes": 2, "script": [1], "title": "Only three", "show": "words", "text": REVEAL,
         "cite": "Monument Lab, National Monument Audit (2021), in Who Gets Remembered?",
         "purpose": "Reveal the answer, and ask why.",
         "students": ["Why might so few women have monuments?"]}],
      "body": [f"Open *Who Gets Remembered?* on the screen (or read from page 3). *“{HOOK_Q}”* Every student writes a guess. Use the room’s slider for the class’s guess, then uncover the names.",
               "Only **three** are women: Joan of Arc, Harriet Tubman and Sacagawea. Ask the room’s own question: *“Why might so few women have monuments?”* Take answers; don’t settle it yet."]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "A month, and a life",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "How the month began", "show": "chart", **WHM_SCREEN,
         "purpose": "Give the month its history: a week in one town that grew into a national month.",
         "students": ["How many years from the first week to the whole month?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Meet Violet", "show": "gallery",
         "groups": [{"label": "Photographs from poster 2", "text": "Violet Dina Want, born in London in 1907",
                     "items": [ph("violet"), ph("promenade"), ph("family"), ph("four")]}],
         "purpose": "Read photographs as evidence before hearing the story.",
         "students": ["What can these photographs tell us?", "What can’t they tell us?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Everyday history", "show": "words", "text": LEGACY,
         "cite": "Poster 2 · Biography of a Working Class Woman",
         "purpose": "Name the big idea: ordinary lives are history too.",
         "students": ["What does Violet’s life tell us that a statue can’t?"]}],
      "body": [
        "**The month.** Poster 1 tells it: Women’s History Month began in **1978** as a week-long celebration in Santa Rosa, California. In **1980** President Jimmy Carter declared the first National Women’s History Week, and by **1987** Congress expanded it to the whole month of March. The poster gives the reason: *“" + OVERSHADOWED + "”*",
        "**A life.** Show the four photographs from poster 2 before telling anything. *“What can a photograph tell us? What can’t it?”* Then tell Violet’s life from the poster: born in London in 1907 into a big working-class family; her father a hotel doorman who sometimes brought home leftover food; top of her class, with teachers who hoped she would teach; leaving school at 14 to work as a machinist, paid for each piece she finished, because her family needed the money; married in 1928; four children, kept warm in coats she cut down and re-sewed; a piano she played by ear; after the war, a corner house in Essex with roses at the bottom of the garden; and later, work at the greengrocer’s.",
        "**The big idea.** Read the poster’s last lines, on screen. Poster 1 says the same: history is told *“not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.”*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the numbers and the evidence at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three look at who gets remembered, and at Violet’s life as evidence."]},
      "body": ["Students choose a handout. All three levels use the same statue numbers and the same story of Violet’s life."]}),
    ("levels", {
      "green": "Color the three women among fifty statues, read a family photograph with a checklist, number four moments of Violet’s life, and finish *Violet’s story is history too, because…*",
      "yellow": "Fill in how Women’s History Month began, work out the statue numbers, read four details of Violet’s life as evidence of everyday life, and explain poster 1’s big idea.",
      "red": "Weigh four facts as evidence for poster 1’s claim, compare what a statue and a family biography remember, and plan a monument to a woman in their own life."}),
    ("section", {"label": "Look back · 5 minutes", "title": "A monument of your own",
      "screen": [
        review(OBJECTIVES, 3, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "A monument of your own", "show": "question", "question": MONUMENT_Q,
         "purpose": "End with the students’ own communities: who would they remember?",
         "students": ["Tell a partner: who, and why?"]}],
      "body": ["Ask the objectives back: *“Can you now…?”* Students show a thumb up, sideways or down; ask one student to answer each aloud, and a Red Level student the last.",
               f"Close with the room’s last question: *“{MONUMENT_Q}”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Before you open the rooms.** The Top 50 in *Who Gets Remembered?* includes four Confederate leaders; the room sets a note of context beside them. In *Violet’s Life*, skip the Blitz stop and the garden stop’s last line: this lesson tells only her home and working life.",
        "**Every family is different.** In the close, *a woman who is like family to you* counts."]}),
      ],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Green:** 3 women, 47 men. In the photograph: five women, a baby, a house (no car). Order: born in London (1907), left school to work (at 14), married Harold (1928), first daughter Edna (1929).",
        "**Yellow:** 1978 · 1980 · 1987; 9 years from the first week to the month. 47 men; 6 of every 100; 22 − 2 = 20 more mermaids than congresswomen.",
        "**Red:** the Top 50 and the mermaids are evidence; Lincoln’s 193 and Joan of Arc at Orléans are true but do not show the claim (Joan of Arc is in the Top 50).",
        "**Exit ticket:** *name one thing Violet’s life shows about everyday life long ago.*"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Who gets remembered?", "body": ["The numbers from *Who Gets Remembered?* (Monument Lab’s National Monument Audit, 2021), the start of Women’s History Month, and Violet’s photographs."]}),
    ("html", '<div class="three">'
             '<div><b>Joan of Arc</b>26 monuments · 18th on the list. In 1429 she helped end the English siege of the city of Orléans.</div>'
             '<div><b>Harriet Tubman</b>21 monuments · 24th. A “conductor” on the Underground Railroad, she brought about 70 enslaved people to freedom.</div>'
             '<div><b>Sacagawea</b>20 monuments · 28th. She traveled west with Lewis and Clark, interpreting for the expedition.</div></div>'),
    ("html", '<p style="font-size:9.6pt">Of the 50 people with the most public monuments in the United States, <b>3</b> are women: 6%. Among the 48,178 monuments the audit studied, there are more monuments depicting mermaids (<b>22</b>) than monuments to US congresswomen (<b>2</b>).</p>'),
    ("html", whm_table([])),
    ("html", photos(["violet", "promenade", "family", "four"], 128)),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Whose statues, plaques or street names are there where you live? Who chose them?",
      "What can these photographs tell us about Violet’s life? What can’t they?",
      "Violet left school at 14 to help her family. What does that tell us about life for working families then?",
      "Whose stories are missing from the history you learn, and how could we find them?"]}),
("connection", ["**Online,** *Who Gets Remembered?* has the full list, *Tip the scale* (weighing evidence) and *Talk about it* (an interview for a woman in your family). **In the exhibition,** find Violet’s photographs on poster 2 and the family letters in the display case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Women’s History Month is every March. It remembers famous women, and everyday women too. Violet Dina Want was born in London in 1907, into a big working family. She left school at 14 to work in a factory, sewed coats for her four children, played the piano and grew roses. Her family wrote her story down so it would not be lost."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · Who Gets Remembered?", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Who gets a statue?",
            "blocks": [("html", "<p>These are the 50 people with the most public monuments in the United States. Only <b>3</b> of them are women. <b>Color 3 statues</b> to show the women.</p>" + FIFTY
                        + '<p>How many of the 50 are men? <span style="display:inline-block;width:60pt;border-bottom:1pt solid #1d1c1a"></span></p>')]}),
  ("task", {"label": "Part 2", "title": "Read a photograph",
            "blocks": [("html", pic("family", '<p>This photograph is from Violet’s family. Check every thing you can see.</p>'
                                    '<ul class="check"><li>a baby</li><li>a house</li><li>five women</li><li>a car</li></ul>'
                                    '<p>What is one thing this photograph <b>can’t</b> tell you?</p>'))], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Violet’s life in order",
            "blocks": [("html", "<p>Number the boxes <b>1 to 4</b>, from first to last. Use the years and ages to help you.</p>")]}),
  ("table", {"head": ["Order", "What happened"], "rows": [
      ["", "Violet married Harold, in 1928."], ["", "Violet was born in London, in 1907."],
      ["", "Violet’s first daughter, Edna, was born in 1929."], ["", "Violet left school to work, at 14."]]}),
  ("task", {"label": "Part 4", "title": "Why remember Violet?",
            "body": ["Finish the sentence: **Violet’s story is history too, because…**"], "lines": 4}),
  ("family", ["Look at an old family photograph together. What can it tell you? What would you need to ask to know more?"]),
], "table.fill td:first-child { width: 16%; } table.fill td { padding-top: 8pt; padding-bottom: 12pt; font-size: 9.6pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "How Women’s History Month began",
            "blocks": [("html", '<p>Write the right year in each blank box.</p><div class="bank"><span>1978</span><span>1980</span><span>1987</span></div>' + whm_table(["1978", "1980", "1987"]) + '<p class="q" style="margin-top:8pt">How many years passed from the first week in Santa Rosa to the whole month of March? <i></i></p>')]}),
  ("task", {"label": "Part 2", "title": "Who gets a statue? Do the math",
            "blocks": [("html", '<p class="q"><b>a.</b> Of the 50 people with the most public monuments in the United States, 3 are women. How many are men? <i></i></p>'
                                '<p class="q"><b>b.</b> 3 out of 50 is the same as <i></i> out of 100. That is why the room says <b>6%</b>.</p>'
                                '<p class="q"><b>c.</b> A study of 48,178 monuments found 22 monuments to mermaids, and 2 to US congresswomen. How many more mermaids are there? <i></i></p>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Read the evidence",
            "body": ["Each detail is from Violet’s biography. What does it tell you about **everyday life** for working families then?"]}),
  ("table", {"head": ["Detail from Violet’s life", "What it tells us about life then"], "rows": [
      ["Her father, a hotel doorman, sometimes brought home leftover food from the restaurant.", ""],
      ["As the second eldest daughter, she was expected to help at home and to earn money from a young age.", ""],
      ["Violet left school at 14 to work and help support the family.", ""],
      ["She took apart adult coats and resized them for her children.", ""]]}),
  ("task", {"label": "Part 4", "title": "The big idea",
            "body": ["Poster 1 says history is told through *“the everyday lives of ordinary women,”* not only famous ones. Use Violet’s life to explain what that means."], "lines": 5}),
  ("family", ["Ask an older person in your family: what did you have to do to help at home when you were my age?"]),
], "table.fill td:first-child { width: 48%; } table.fill td { padding-top: 7pt; padding-bottom: 30pt; } .q { margin: 0 0 7pt; } .q i { display: inline-block; width: 70pt; border-bottom: 1pt solid #1d1c1a; height: 12pt; vertical-align: -2pt; }")

RED = handout("red", "WH_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Weigh the evidence",
            "blocks": [("html", '<p>Poster 1 makes a claim:</p><p class="claim">' + md(OVERSHADOWED) + '</p>'
                        '<p>Every fact below is true. But is it <b>evidence</b> for the claim? Circle one, and say why.</p><div class="ev">'
                        + "".join(f'<div>{md(t)}<p class="mark"><span>Evidence</span><span>Not evidence</span></p></div>' for t in [
                            "Of the 50 people with the most public monuments in the United States, only 3 are women.",
                            "Abraham Lincoln has more recorded public monuments in the United States than anyone else: 193.",
                            "There are more monuments to mermaids (22) than to US congresswomen (2).",
                            "In 1429 Joan of Arc helped end the English siege of the city of Orléans."]) + "</div>")],
            "body": ["Which fact is the **heaviest** evidence? Why?"], "lines": 2}),
  ("task", {"label": "Part 2", "title": "Two ways to remember",
            "body": ["A statue and a family biography both remember people. Compare them."]}),
  ("table", {"head": ["", "A statue in a park", "Violet’s biography"], "rows": [
      ["Who is it usually about?", "", ""], ["What does it tell you?", "", ""], ["What does it leave out?", "", ""]]}),
  ("task", {"label": "Part 3", "title": "A monument of your own",
            "body": ["If you could raise a monument to one woman in your life or your community, who would it be? Write the words for its plaque: who she is, what she did, and why she should be remembered."], "lines": 8}),
  ("family", ["Tell your family about the three women in the Top 50. Then ask: which woman in our family should be remembered, and why?"]),
], "table.fill td:first-child { width: 26%; font-weight: 500; } table.fill td { padding-top: 7pt; padding-bottom: 38pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
