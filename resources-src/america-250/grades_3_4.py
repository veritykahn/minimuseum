"""Grades 3–4 · "Declaration Detectives"
Built on the exhibition's A Copy of a Copy room: four copies of the
Declaration, from the first printing to the faded parchment, each with one
thing to find, then how it was made. Facts follow
app/exhibitions/america-250/sign/signText.ts (COPIES), copies/missions.ts
(the four missions and their choices, word for word) and poster 1 (the chain
of copies; July 2 and July 4; Washington never signed)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (A, CP, DUNLAP_CR, GODDARD_CR, STONE_CR, ORIGINAL_CR, pic, md, OBJ_CSS, FLOW_CSS,
                     ZOOM_CSS, zoom, EV_CSS, LOOK_BACK, look_back_say, review, ev)

DIR = "teachers/grades-3-4/"
TITLE = "Declaration Detectives"
SUB = "Grades 3–4 · A Copy of a Copy"
HERO = pic("copies/dunlap.jpg", DUNLAP_CR, "center 14%")
TIMING = [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 18, "#86671A"), ("Debrief", 5, "#A8452F")]

SIZE = {"dunlap": (1600, 1971), "goddard": (1600, 1958), "stone": (1600, 1893), "original": (1600, 1949)}
FOOT = {"dunlap": (.08, .855, .92, .98), "goddard": (.2, .952, .8, .988),
        "stone": (0, .736, 1, .985), "original": (0, .80, 1, .985)}
# the handouts' close-ups: tighter, so the clue reads at print size
LENS = {"dunlap": (.08, .855, .92, .98), "goddard": (.33, .944, .67, .966),
        "stone": (.15, .735, .85, .83), "original": (.25, .80, 1, .93)}

# the four copies, as the room has them: name, date, credit, the note (signText.ts)
COPIES = [
  ("dunlap", "The Dunlap broadside", "July 4–5, 1776", DUNLAP_CR,
   "The first printing. John Dunlap, the official printer of the Congress, printed about 200 copies in Philadelphia on the evening of July 4 and the early morning of July 5, 1776, and Congress sent them to governments, military commanders and the British Crown in London. It carries only two names: John Hancock’s, as President, and Charles Thomson’s, as Secretary. 26 copies are known to survive."),
  ("goddard", "The Goddard broadside", "1777", GODDARD_CR,
   "The first printing with the signers’ names. On January 18, 1777, Congress ordered a copy with the names of the members who signed it sent to each of the states. Mary Katharine Goddard printed it in Baltimore, with every name but Thomas McKean’s, and her own name at its foot."),
  ("stone", "Stone’s engraving", "1823", STONE_CR,
   "By 1820 the parchment was already showing signs of age. Secretary of State John Quincy Adams had the printer William J. Stone make a full-size copperplate engraving, and copies were printed from the plate. It is the most often reproduced version of the Declaration."),
  ("original", "The signed parchment today", "Signed 1776", ORIGINAL_CR,
   "Years of public display have faded and worn the parchment. Today it is kept with the greatest care, on display in the Rotunda of the National Archives in Washington, D.C.")]
C = {k: (name, date, cr, note) for k, name, date, cr, note in COPIES}

# the room's missions (copies/missions.ts), word for word
MISSIONS = {
  "dunlap": ("This is the first printing. Look at the foot of the sheet: how many names are printed there?",
             ["Just two", "All fifty-six signers", "None at all"], "Just two: John Hancock’s and Charles Thomson’s."),
  "goddard": ("This printing has the signers’ names. Who printed it? Find the printer’s name at the very foot.",
              ["John Dunlap", "Mary Katharine Goddard", "Thomas Jefferson"], "Mary Katharine Goddard: she set her own name at its foot."),
  "stone": ("Stone’s engraving shows every signature clear and dark. Whose signature is the largest?",
            ["Benjamin Franklin", "Thomas Jefferson", "John Hancock"], "John Hancock’s, the largest of them all."),
  "original": ("This is the signed parchment itself, as it is today. Look at its foot: can you read the signatures?",
               ["Yes, clear and dark", "Hardly: they have faded almost away", "It was never signed"], "Hardly: nearly every signature has faded almost away.")}
ORDER = ["dunlap", "goddard", "stone", "original"]

ALT = {
  "dunlap": "The Dunlap broadside: a single printed sheet headed “In Congress, July 4, 1776. A Declaration by the Representatives of the United States of America, in General Congress assembled,” with only John Hancock’s and Charles Thomson’s names printed at its foot",
  "goddard": "The Goddard broadside: a printed sheet headed “In Congress, July 4, 1776. The Unanimous Declaration of the Thirteen United States of America,” the text in two columns, and below it the signers’ names in print, grouped by state",
  "stone": "William J. Stone’s engraving: the Declaration in crisp black lines on white, the whole text in a flowing hand, and every signature clear and dark at the foot, John Hancock’s largest",
  "original": "The signed parchment of the Declaration as it is today: a pale, worn sheet, its heading still dark, but most of its handwriting and nearly all the signatures faded almost away"}

# the chain of copies, from poster 1
CHAIN = [("Jefferson’s Rough Draft", "Jefferson wrote it; Franklin and others changed it."),
         ("The July 4 Fair Copy", "An edited version of the Rough Draft, adopted on July 4, 1776."),
         ("The Engrossed parchment", "A reproduction of the Fair Copy. Ordered on July 19; most delegates signed it on August 2."),
         ("Stone’s engraving, 1823", "A copy of the parchment, made when the parchment was already showing its age.")]

CHAIN_SCREEN = {"caption": "A copy of a copy (the poster Before it was Sacred)",
                "columns": ["Copy", "What it was"], "rows": [{"cells": [a, b]} for a, b in CHAIN]}
GALLERY = [{"label": "Four copies in the exhibition",
            "items": [{"img": CP + k + ".jpg", "caption": C[k][0], "sub": C[k][1], "alt": ALT[k], "aspect": SIZE[k][0] / SIZE[k][1]} for k in ORDER]}]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find a clue on each of four copies of the Declaration by looking closely", "find a clue on each copy by looking closely?", False),
    ("put the copies, and the days of July and August 1776, in order", "put the copies and the dates in order?", False),
    ("explain why the most famous picture of the Declaration is a copy of a copy", "explain why the famous picture is a copy of a copy?", False),
    ("judge which copy is the best evidence, and give a reason", "judge which copy is the best evidence, and say why?", True)],
  "why": "Historians, like detectives, ask of every document: who made this, when, and how close is it to the real thing?"}

CSS = """
.case { display: grid; grid-template-columns: 58pt 1fr; gap: 10pt; align-items: start; margin: 4pt 0 9pt; break-inside: avoid; }
.case > img { width: 58pt; border: .8pt solid #1d1c1a; border-radius: 3pt; background: #fff; display: block; }
.case h4 { margin: 0 0 1pt; font-size: 10.5pt; } .case .dt { font: 400 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-text); }
.case p { font-size: 9.4pt; margin: 2pt 0 4pt; line-height: 1.35; }
.case .zoom { margin: 3pt 0 4pt; }
.choices { display: flex; gap: 14pt; flex-wrap: wrap; font-size: 9.4pt; margin: 2pt 0; }
.choices span::before { content: ""; display: inline-block; width: 9pt; height: 9pt; border: 1pt solid #1d1c1a; border-radius: 50%; margin-right: 5pt; vertical-align: -1pt; background: #fff; }
.wline { border-bottom: .8pt solid #8d8a80; height: 16pt; }
.four { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10pt; margin: 4pt 0 8pt; break-inside: avoid; }
.four figure { margin: 0; text-align: center; }
.four img { width: 100%; border: .8pt solid #1d1c1a; border-radius: 3pt; background: #fff; display: block; }
.four figcaption { font: 400 8pt/1.3 'Outfit'; margin-top: 3pt; }
.four figcaption b { font-weight: 500; display: block; }
.four .cr { font-size: 6.4pt; color: #5F6655; margin-top: 2pt; }
table.tl { width: 100%; border-collapse: collapse; font-size: 9.4pt; margin: 4pt 0 8pt; break-inside: avoid; }
table.tl td { border-bottom: .6pt solid #c8c5bb; padding: 2.5pt 6pt 2.5pt 0; vertical-align: top; }
table.tl td:first-child { width: 34pt; } table.tl td.box span { display: inline-block; width: 22pt; height: 15pt; border: 1pt solid #1d1c1a; border-radius: 3pt; background: #fff; }
table.tl th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: 1pt solid var(--accent); padding: 0 6pt 3pt 0; }
"""

def case(k, w=300, choices=True, lines=0, ask=True):
    name, date, cr, note = C[k]
    task, opts, _ = MISSIONS[k]
    body = f'<h4>{md(name)}</h4><span class="dt">{date}</span>'
    if ask:
        body += f"<p>{md(task)}</p>"
    body += zoom(CP + k + ".jpg", SIZE[k], LENS[k], w)
    if choices:
        body += '<div class="choices">' + "".join(f"<span>{md(o)}</span>" for o in opts) + "</div>"
    body += '<div class="wline"></div>' * lines
    return f'<div class="case"><img src="{CP}{k}.jpg" alt="">{f"<div>{body}</div>"}</div>'

def four(dates=True, credits=False):
    out = ""
    for k in ORDER:
        name, date, cr, _ = C[k]
        d = f" · {date}" if dates else ""
        c = f'<div class="cr">{md(cr)}</div>' if credits else ""
        out += f'<figure><img src="{CP}{k}.jpg" alt=""><figcaption><b>{md(name)}</b>{d}{c}</figcaption></figure>'
    return f'<div class="four">{out}</div>'

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "declaration-detectives", "large": True,
  "out": DIR + "A250_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + ZOOM_CSS + CSS,
  "blocks": [
    ("timing", TIMING),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will examine four copies of the Declaration of Independence as the exhibition’s *A Copy of a Copy* room shows them: the first printing of July 1776, the first printing with the signers’ names, Stone’s engraving of 1823 and the faded parchment today. They will find a clue on each, put the copies and the dates in order, and learn that the picture most people know is a copy of a copy."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**History** — primary sources; sequence and chronology; the Declaration, July 2 and July 4, 1776",
      "**Reading** — close reading of a document; finding evidence; explaining with reasons",
      "**Detective skills** — observing before concluding; asking who made a source, when and how"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected; differentiated handouts, one per student",
      "A magnifying glass or a paper “lens” for each group, if you have them"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Is this the real thing?",
      "screen": {"phase": "Hook", "show": "image", "fit": "contain", "img": pic("copies/stone.jpg", STONE_CR), "alt": ALT["stone"],
                 "caption": "Is this the Declaration of Independence?",
                 "purpose": "Look before knowing: is the most famous picture of the Declaration the real thing?",
                 "students": ["Is this the real Declaration?", "What clues could tell you?"]},
      "body": ["Project Stone’s engraving with no caption. Ask: *“Is this the Declaration of Independence? What clues could tell you?”* Take ideas: the date at the top, the signatures, how clean and dark it looks. Then reveal: it is an **engraving made in 1823**, almost fifty years later. *“The picture almost everyone knows is a copy. Today you are detectives: which copy is which, and how close is each one to the real thing?”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Four copies, and a chain",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0], "title": "Four copies", "show": "gallery", "groups": GALLERY,
         "purpose": "Meet the four copies, in the order they were made.",
         "students": ["Which looks oldest?", "Which is easiest to read?", "Which is the hardest?"]},
        {"phase": "Teach", "minutes": 5, "script": [1, 2], "title": "A copy of a copy", "show": "chart", **CHAIN_SCREEN,
         "purpose": "Follow the chain from Jefferson’s draft to the engraving.",
         "students": ["Which copy did the delegates sign?", "Why might a copy differ from the one before?"]}],
      "body": [
        "Show the four copies on page 3 in order. The **Dunlap broadside** was printed on the night of July 4 and the morning of July 5, 1776: about 200 copies, sent to governments, army commanders and the British Crown in London, and 26 survive. The **Goddard broadside** of 1777 was the first printing with the signers’ names, printed by Mary Katharine Goddard in Baltimore. **Stone’s engraving** was made in 1823 because the parchment was already showing its age. And the **signed parchment** itself is in the National Archives, faded almost away.",
        "Then follow the chain on the screen. Jefferson wrote a Rough Draft; others changed it, Franklin among them. The edited Fair Copy was adopted on **July 4, 1776**. The parchment with the signatures was not ordered until July 19, and most delegates signed it on **August 2**. Stone’s engraving copied the parchment.",
        "Two surprises to finish: independence itself was decided on **July 2**; the Declaration, adopted two days later, explained a decision already made. And George Washington never signed: he was commanding the army."]}),
    ("section", {"label": "Activity · 18 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Open the case",
                 "purpose": "Solve the four missions, then put the case in order, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red.", "Every handout has the same four missions."]},
      "body": ["Students choose a handout. All three levels solve the room’s four missions, using a close-up of each copy’s foot, then go on to the order of events."]}),
    ("levels", {
      "green": "Solve the four missions by circling an answer, match each copy to its date, and finish a sentence about the oldest copy.",
      "yellow": "Solve the four missions, put eight events of 1776 to 1823 in order on a timeline, and mark three statements true or false.",
      "red": "Record each clue and what it tells, follow the chain of copies, and write a detective’s report on which copy is the best evidence."}),
    ("section", {"label": "Debrief · 5 minutes", "title": "The detectives report",
      "screen": [
        review(OBJECTIVES, 2, [0]),
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Which copy would you trust?", "show": "question",
         "question": "Which copy is the best evidence of what Congress agreed in 1776? Why?",
         "purpose": "Weigh the copies as evidence, with a reason.",
         "students": ["Choose one copy.", "Give one reason, from a clue you found."]}],
      "body": [look_back_say(),
               "Ask the last question to the class: *“Which copy is the best evidence of what Congress agreed?”* There is no single right answer. The parchment is the signed original, but it is hard to read; the Dunlap broadside was printed the same night, but carries only two names; Stone’s is the clearest, but it was made forty-seven years later. Praise the reason more than the choice."]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Missions:** Dunlap, *just two* (Hancock and Thomson); Goddard, *Mary Katharine Goddard*; Stone, *John Hancock*; the parchment, *hardly: they have faded almost away*.",
      "**Order of events (Yellow):** July 2, independence decided; July 4, the Declaration adopted; July 4–5, Dunlap prints about 200 copies; July 19, the parchment ordered; August 2, most delegates sign; January 18, 1777, Congress orders the copy Goddard prints; 1820, the parchment showing its age; 1823, Stone’s engraving.",
      "**True or false (Yellow):** Washington signed, *false*; all signed on July 4, *false*; the famous picture is an 1823 copy, *true*.",
      "**Assess:** can students name a clue from each copy, order the events, and give a reason for the copy they trust?"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four copies of the Declaration",
      "body": ["Project this page. The exhibition’s *A Copy of a Copy* room lets students move a lens over each copy; here, the close-ups show the foot of each sheet, where the clues are."]}),
    ("html", four(True, True)),
    ("html", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10pt 14pt">'
             + "".join(f'<div><p class="label" style="margin:0">{md(C[k][0])}</p>{zoom(CP + k + ".jpg", SIZE[k], FOOT[k], 232)}</div>' for k in ORDER) + "</div>"),
    ("connection", ["**Visit the exhibition:** in *A Copy of a Copy*, open the case and solve each mission with the lens. When a clue is found, the room tells how that copy was made. Then try *Put Your Name to It*, and sign the Declaration under the signers."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["The Declaration of Independence was adopted on July 4, 1776. Since then it has been copied again and again. The exhibition’s *A Copy of a Copy* room shows four copies. Each one hides a clue at its foot. Be a detective: look closely before you decide."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · A Copy of a Copy", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO,
            "css": ZOOM_CSS + EV_CSS + CSS + css}

EVENTS = [("Most delegates sign the parchment", "August 2, 1776"),
          ("William J. Stone makes his engraving", "1823"),
          ("Congress decides on independence", "July 2, 1776"),
          ("Congress orders the parchment copy to be written out", "July 19, 1776"),
          ("John Dunlap prints about 200 copies", "July 4–5, 1776"),
          ("Congress orders copies with the signers’ names for each state", "January 18, 1777"),
          ("The Declaration is adopted", "July 4, 1776"),
          ("The parchment is already showing signs of age", "By 1820")]

GREEN = handout("green", "A250_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Four missions",
            "blocks": [("html", "<p>Look at the close-up of each copy’s foot. Circle the answer.</p>" + "".join(case(k) for k in ORDER))]}),
  ("task", {"label": "Part 2", "title": "Which came first?",
            "blocks": [("html", "<p>Number the copies from 1 (made first) to 4 (made last). Use the dates in Part 1.</p>"
                        + '<table class="tl"><tr><th>No.</th><th>Copy</th><th>Made</th></tr>'
                        + "".join(f"<tr><td class='box'><span></span></td><td>{md(C[k][0])}</td><td>{d}</td></tr>" for k, d in
                                  [("stone", "1823"), ("goddard", "1777"), ("original", "signed on August 2, 1776"), ("dunlap", "July 4–5, 1776")]) + "</table>")]}),
  ("task", {"label": "Part 3", "title": "Easy to read, hard to read",
            "body": ["The easiest copy to read is ______________________.",
                     "The hardest copy to read is ______________________, because ______________________________________"]}),
  ("task", {"label": "Part 4", "title": "The copy I trust",
            "body": ["Circle one: **Dunlap** · **Goddard** · **Stone** · **the parchment**",
                     "I trust this copy most because ______________________________________________________"], "lines": 1}),
  ("connection", ["In *A Copy of a Copy*, solve the missions with the lens. Did you find the same clues?"]),
], ".case .zoom { max-width: 100%; }")

YELLOW = handout("yellow", "A250_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Four missions",
            "blocks": [("html", "<p>Look at the close-up of each copy’s foot. Circle the answer, then write the copy’s date.</p>"
                        + "".join(case(k).replace(f'<span class="dt">{C[k][1]}</span>', '<span class="dt">Date: ____________</span>') for k in ORDER))]}),
  ("task", {"label": "Part 2", "title": "Put the case in order",
            "blocks": [("html", "<p>Number the events from 1 (first) to 8 (last).</p>"
                        + '<table class="tl"><tr><th>No.</th><th>What happened</th><th>When</th></tr>'
                        + "".join(f"<tr><td class='box'><span></span></td><td>{md(e)}</td><td>{d}</td></tr>" for e, d in EVENTS) + "</table>")]}),
  ("task", {"label": "Part 3", "title": "True or false?",
            "body": ["**a.** George Washington signed the Declaration.  T / F",
                     "**b.** All the delegates signed on July 4, 1776.  T / F",
                     "**c.** The most famous picture of the Declaration is a copy made in 1823.  T / F",
                     "Choose one that is false. Write the true version: ________________________________________________"]}),
  ("connection", ["In *A Copy of a Copy*, which copy was hardest to read with the lens? Why?"]),
], ".case .dt { letter-spacing: .04em; }")

RED = handout("red", "A250_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Clues and what they tell",
            "blocks": [("html", "<p>Solve each mission from the close-up. Then write what the clue tells you about that copy.</p>"
                        + "".join(case(k, choices=False, lines=1).replace(f'<p>{md(MISSIONS[k][0])}</p>', f'<p>{md(MISSIONS[k][0])} <i>What does this tell you?</i></p>') for k in ORDER))]}),
  ("task", {"label": "Part 2", "title": "A copy of a copy",
            "blocks": [("html", ev([("1", "Jefferson’s Rough Draft"), ("2", "The July 4 Fair Copy: an edited version"),
                                    ("3", "The Engrossed parchment: signed by most on August 2"), ("4", "Stone’s engraving, 1823")], "four"))],
            "body": ["Each copy was made from the one before. The poster calls the famous picture “a copy of a copy.” What could change each time a document is copied?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Detective’s report",
            "body": ["Which copy is the best evidence of what Congress agreed in 1776? Give two reasons, using clues you found. Then name one weakness of your copy."], "lines": 3}),
  ("connection", ["Goddard printed every signer’s name but Thomas McKean’s. What would a detective ask next?"]),
], ".ev.four { grid-template-columns: repeat(4, 1fr); } .ev.four div { font-size: 8.6pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
