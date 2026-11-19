"""Grades 5–8 · Social Studies · "What It Was, What It Became"
The Declaration as a primary source: the four myths the first poster takes
apart (date, document, author, significance), what the document was for in
1776, and who "all men are created equal" left out, in the exhibition's own
framing. Facts follow app/exhibitions/america-250/america250.ts (both
posters and the Many Faiths note), sign/declaration.ts (the text) and
sign/signText.ts (the copies)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import md, A, CP, TRUMBULL, STONE_CR, pic, OBJ_CSS, FIG_CSS, FLOW_CSS, TIMING_45, look_back_say, review, fig

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "What It Was, What It Became"
SUB = "Grades 5–8 · Social Studies · The Declaration as a primary source"

HERO = pic("trumbull.jpg", TRUMBULL, "center 62%")

# the sentence, as the National Archives transcription sets it (declaration.ts)
EQUAL = "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness."
CLOSE = "Before it was sacred, the Declaration was a formality. Understanding what it actually was makes what it became considerably more remarkable."
HOOK_Q = "This is the most famous painting of the Declaration. Who is the most important person in the room?"

# the four chapters of the first poster: what most people believe, and what the exhibition shows
MYTHS = [
  ("The Wrong Date", "Independence was declared on July 4, 1776.",
   "Independence was resolved on **July 2**. John Adams expected the Second of July to be the great anniversary. The Declaration, adopted two days later, explained a decision already made."),
  ("The Wrong Document", "The famous handwritten page is the Declaration Congress saw.",
   "That picture is an **1823 engraving** by William J. Stone, a copy of the Engrossed parchment. Congress did not order the Engrossed Copy until July 19; most delegates signed it on August 2."),
  ("The Wrong Author", "Thomas Jefferson wrote it alone.",
   "There were **at least four** authors. Franklin changed Jefferson’s “sacred and undeniable” to “self-evident.” Congress made further changes, most significantly removing Jefferson’s charge against George III for the slave trade."),
  ("The Wrong Significance", "It was treasured from the start, above all for its ideas.",
   "For **fifteen years** it was largely ignored. The **twenty-seven charges** against the King were the whole point: an argument meant above all to persuade France to enter the war."),
]

# who "all men are created equal" left out in 1776, in the exhibition's own words and the Declaration's
LEFT_OUT = [
  ("Who signed", "Fifty-six men signed the Declaration. No woman’s name is among the signers. A woman’s name is at the foot of a famous copy: Mary Katharine Goddard printed the first copy with the signers’ names in 1777."),
  ("Who could hold office", "In 1776, Catholics could still not hold public office in most of the American colonies. In 1787 the Constitution declared that no religious test would ever be required to hold federal office."),
  ("What Congress cut", "Congress removed Jefferson’s charge against George III for the slave trade, the buying and selling of enslaved people. The word *slave* does not appear in the Declaration as adopted."),
  ("What the text says", "The twenty-seventh charge calls the Native peoples on the frontier “the merciless Indian Savages.”"),
  ("What it became", "Abraham Lincoln, at Gettysburg, made “all men are created equal” the founding promise of the nation. The philosophy, which had been secondary, became everything."),
]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("separate the story most Americans tell about the Declaration from what the evidence shows: its date, its document, its authors and its purpose",
     "separate the myth of the Declaration from the evidence?", False),
    ("explain what the Declaration was for in 1776: a legal and diplomatic argument whose twenty-seven charges were the whole point",
     "explain what the Declaration was for in 1776?", False),
    ("use evidence from the exhibition to say who “all men are created equal” left out in 1776",
     "say, with evidence, who “all men are created equal” left out in 1776?", False),
    ("explain how the Declaration’s meaning changed after 1776, and judge why that matters",
     "explain how its meaning changed, and why that matters?", True)],
  "why": "A document can mean one thing to the people who wrote it and another to the people who inherit it. Knowing both is how we read the past honestly, and how we understand what we are celebrating at 250."}

FIT_CSS = """
.cards { grid-template-columns: repeat(2, 1fr); gap: 7pt; margin-bottom: 9pt; }
.card { padding: 6pt 9pt 2pt; }
.card .cn { font-size: 16pt; }
.card h4 { margin-top: 0; font-size: 11.5pt; }
.card p { font-size: 8.7pt; line-height: 1.36; }
.myth { font-style: italic; color: #5b5a55; }
.refs { font-size: 9pt; }
"""

MYTH_SCREEN = {"caption": "Four myths, and what the exhibition shows: the four chapters of the poster *Before it was Sacred*",
               "columns": ["Chapter", "What most people believe", "What the exhibition shows"],
               "rows": [{"cells": [t, m, e]} for t, m, e in MYTHS]}

def myth_cards():
    return [(t, [f"*Myth:* {m}", e]) for t, m, e in MYTHS]

LESSON = {
  "slug": "what-it-was-what-it-became",
  "out": DIR + "A250_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + FIT_CSS + FIG_CSS,
  "blocks": [
    ("timing", TIMING_45),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the Declaration as a primary source, not a birth certificate. They will test four common beliefs against the exhibition’s evidence, explain that in 1776 it was a **legal and diplomatic argument** whose twenty-seven charges were its point, and use evidence to say **who “all men are created equal” left out**, and how Lincoln made those words the nation’s founding promise."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Historical thinking** — sourcing a document; telling myth from evidence; change and continuity in what a document means",
      "**Civics** — consent of the governed; who could sign, vote and hold office; the Constitution’s ban on religious tests (1787)",
      "**Chronology** — July 2, July 4, July 19 and August 2, 1776; 1823; 1826",
      "**Perspective** — who wrote the document, who was named in it, and who was left out"]}),
    ("section", {"label": "Materials needed", "list": [
      "The exhibition’s two posters, projected: *Before it was Sacred* and *We Shall All Hang Together*",
      "*Put Your Name to It*, open to the Declaration’s text, and *A Copy of a Copy*",
      "The *Show your class* page (page 3), projected or printed; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Who is missing?",
      "screen": {"phase": "Hook", "show": "artwork", "work": "Declaration of Independence", "artist": "John Trumbull", "date": "1818",
                 "img": HERO, "alt": "John Trumbull’s Declaration of Independence: five men present the draft to John Hancock, seated at the right, as the delegates of the Congress look on",
                 "purpose": "Start from the picture students already carry in their heads, then find what is wrong with it.",
                 "students": ["Who is the most important person in this room?", "Is anyone you expected missing?"]},
      "body": [f"Project Trumbull’s painting. *“{HOOK_Q}”* Take answers, then ask who is missing. Most expect George Washington. Read the poster: *“Washington never signed the Declaration of Independence. He was not even in the room: he was commanding the army.”* Today students test what else the familiar story gets wrong."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "What it was, and who it left out",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "Four myths", "show": "chart", **MYTH_SCREEN,
         "purpose": "Test four common beliefs against the exhibition’s evidence.",
         "students": ["Which belief surprises you most?", "What was the Declaration for in 1776?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "All men are created equal", "show": "words",
         "text": EQUAL, "cite": "The Declaration of Independence, 1776",
         "purpose": "Read the most famous sentence closely, and ask whom it reached in 1776.",
         "students": ["Who signed these words?", "Whom did the words not yet reach in 1776?"]}],
      "body": [
        "Walk through the four chapters of *Before it was Sacred* on page 3: the belief, then the evidence. Stress the poster’s strongest claim: in 1776 the preamble was the **least important section**. The twenty-seven charges against the King were the whole point, an argument designed above all to persuade France to enter the war.",
        "Open *Put Your Name to It* and scroll the parchment so students see the shape of the text: an opening, a long list of charges beginning *“He has…”* and *“For…”*, and a closing pledge.",
        "Read the famous sentence aloud. *Who signed these words?* Fifty-six men. Set out the evidence on page 3 one line at a time: Catholics barred from office in most colonies; the slave-trade charge Congress removed; the Declaration’s own words about the Native peoples of the frontier. Ask: *in 1776, whom did “all men are created equal” not yet reach?* Let students answer from the evidence, then finish with Lincoln."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with the evidence at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three test the same myths and read the same sentence."]},
      "body": ["Students choose a handout. All three levels test the same myths against the same evidence and read the same sentence."]}),
    ("levels", {
      "green": "Sort six statements into myth or evidence, match the Declaration’s three parts to what each does, and use four evidence cards to answer *who signed, and who was left out?*",
      "yellow": "Complete a myth-and-evidence chart for the poster’s four chapters, explain why a list of charges would persuade France, and write a paragraph on who “all men” left out in 1776.",
      "red": "Trace what the Declaration meant from 1776 to Lincoln, ask what historians would need to know about the cut charge, and argue for or against the poster’s closing claim."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What it became",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "What it became", "show": "words", "text": CLOSE,
         "cite": "Before it was Sacred, the exhibition’s first poster",
         "purpose": "Hold the two halves together: what it was, and what it became.",
         "students": ["Do you agree? Use one piece of evidence."]},
        review(OBJECTIVES, 3, [1])],
      "body": [f"Read the poster’s closing line aloud: *“{CLOSE}”* Ask two or three students whether they agree, and push for evidence: the charges, the forgotten years, Lincoln, who was left out.",
               look_back_say()]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green:** evidence — the July 2 vote, the August 2 signing, the 1823 engraving; myth — the other three. The opening states beliefs, the charges give reasons, the conclusion declares independence. The country: **France**.",
      "**Left out:** women (no woman signed), Catholics (barred from office in most colonies), enslaved people (the slave-trade charge was cut) and Native peoples (named in the charges as enemies). Credit any answer built on the exhibition’s evidence.",
      "**Exit ticket:** *one thing the Declaration was in 1776, and one thing it became.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four myths, and the evidence",
      "body": ["Project or print this page for the lesson and the debrief. Each card is one chapter of the poster *Before it was Sacred*: the common belief, then what the exhibition shows."]}),
    ("cards", myth_cards()),
    ("section", {"label": "Show your class", "title": "“All men are created equal”: the evidence from 1776"}),
    ("refs", [(a, b) for a, b in LEFT_OUT]),
    ("section", {"label": "For the teacher", "title": "Teaching it honestly",
      "body": ["Follow the exhibition’s own framing: it does not present the Declaration as a finished promise, but as a document whose meaning grew. Let students reach *who was left out* from the evidence rather than from a lecture, and keep the conversation on 1776 and on the document. The exhibition does not say why Congress removed the slave-trade charge; say so, and treat it as an open question for historians."]}),
    ("connection", ["**Visit the exhibition:** read both posters in order, then open *A Copy of a Copy* to see the engraving most people picture beside the faded parchment. In *Put Your Name to It*, students can read the whole Declaration, count its charges, and find the twenty-seventh."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Most Americans picture the Declaration of Independence as the moment the nation began. The exhibition’s first poster, *Before it was Sacred*, argues that almost none of that story is accurate, and that what the document actually was makes what it became more remarkable. Today you are the historian."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": css}

H_CSS = """
table.fill td:first-child { width: 52%; }
table.fill td { padding: 5pt 6pt 9pt 0; }
.ev { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0 8pt; }
.ev div { background: rgba(255,255,255,.72); border-top: 2.5pt solid var(--accent); padding: 6pt 9pt 3pt; font-size: 9.2pt; line-height: 1.38; break-inside: avoid; }
.ev b { display: block; font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-text); margin-bottom: 2pt; }
.quote { font: italic 400 12pt/1.35 'Cormorant Garamond', serif; border-left: 1.2pt solid var(--accent); padding-left: 10pt; margin: 4pt 0 8pt; }
.quote cite { display: block; font: 400 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; font-style: normal; color: #454B3D; margin-top: 2pt; }
"""

def ev(cards, cls=""):
    return f'<div class="ev {cls}">' + "".join(f"<div><b>{a}</b>{md(b)}</div>" for a, b in cards) + "</div>"

def quote(text, cite):
    return f'<div class="quote">{text}<cite>{cite}</cite></div>'

GREEN = handout("green", "A250_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Myth or evidence?",
            "body": ["Read each statement. Write **M** for myth or **E** for evidence. The posters *Before it was Sacred* and *We Shall All Hang Together* will help."]}),
  ("table", {"head": ["Statement", "M or E", "How do you know?"], "rows": [
      ["Independence was voted on July 2, 1776.", "", ""],
      ["George Washington signed the Declaration.", "", ""],
      ["Thomas Jefferson wrote every word by himself.", "", ""],
      ["Most delegates signed the parchment on August 2, 1776.", "", ""],
      ["The famous picture of the Declaration is an engraving made in 1823.", "", ""],
      ["Americans treasured the Declaration from the very start.", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Three parts, three jobs",
            "body": ["Draw a line from each part of the Declaration to its job.",
                     "**The opening** (*“We hold these truths…”*) · · · · · gives the reasons: what the King has done",
                     "**The twenty-seven charges** (*“He has…”*) · · · · · declares the colonies free and independent states",
                     "**The conclusion** (*“We, therefore…”*) · · · · · states what the signers believe about people and government",
                     "The poster says the Declaration was written above all to persuade one country to join the war. Which country? ______________________"]}),
  ("task", {"label": "Part 3", "title": "All men are created equal?",
            "blocks": [("html", quote("“We hold these truths to be self-evident, that all men are created equal…”", "The Declaration of Independence, 1776")
                        + ev([(a, b) for a, b in LEFT_OUT[:4]]))],
            "body": ["Use the four evidence cards to answer.",
                     "**a.** How many people signed the Declaration? Were any of them women? __________________________",
                     "**b.** Which group could not hold public office in most colonies in 1776? __________________________",
                     "**c.** What charge did Congress cut from Jefferson’s draft? __________________________",
                     "**d.** Name one group the words *all men are created equal* left out in 1776, and the card that shows it."], "lines": 2}),
  ("task", {"label": "Part 4", "title": "What it became",
            "body": ["Abraham Lincoln made *“all men are created equal”* the founding promise of the nation. Why might people who were left out in 1776 hold the country to those words?"], "lines": 3}),
  ("connection", ["In *Put Your Name to It*, scroll the Declaration on the parchment. Count the lines that begin *“He has…”*. Which part of the Declaration is the longest?"]),
], H_CSS)

THREE = ".ev.three { grid-template-columns: repeat(3, 1fr); } .ev.three div { font-size: 8.7pt; }"
Y_CSS = H_CSS + THREE + "table.fill td:first-child { width: 24%; font-weight: 500; } table.fill td { padding-bottom: 18pt; }"

YELLOW = handout("yellow", "A250_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Myth and evidence",
            "body": ["The poster *Before it was Sacred* has four chapters. For each, write what most people believe and what the exhibition shows. The first is done for you."]}),
  ("table", {"head": ["Chapter", "What most people believe", "What the exhibition shows"], "rows": [
      ["**The Wrong Date**", "Independence was declared on July 4.", "Independence was resolved on July 2; the Declaration explained it two days later."],
      ["**The Wrong Document**", "", ""],
      ["**The Wrong Author**", "", ""],
      ["**The Wrong Significance**", "", ""]]}),
  ("task", {"label": "Part 2", "title": "An argument for France",
            "blocks": [("html", ev([("Charge", "“For imposing Taxes on us without our Consent:”"),
                                    ("Charge", "“For cutting off our Trade with all parts of the world:”"),
                                    ("Charge", "“He has kept among us, in times of peace, Standing Armies without the Consent of our legislatures.”"),
                                    ("Charge", "“For depriving us in many cases, of the benefits of Trial by Jury:”")]))],
            "body": ["The poster says the twenty-seven charges were *the whole point*, and that the Declaration was designed above all to persuade France to enter the war. Why would a list of charges like these persuade a foreign government better than a statement of beliefs alone?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Who did “all men” leave out?",
            "blocks": [("html", quote("“We hold these truths to be self-evident, that all men are created equal…”", "The Declaration of Independence, 1776")
                        + ev([(a, b) for a, b in LEFT_OUT], "three"))],
            "body": ["Write a paragraph. **In 1776, whom did the words “all men are created equal” leave out, and how did their meaning change later?** Use at least three of the evidence cards, and name them."], "lines": 7}),
  ("connection", ["In *A Copy of a Copy*, find the printer’s name at the foot of the Goddard broadside. What does it add to Part 3?"]),
], Y_CSS)

R_CSS = H_CSS + THREE + """
table.fill td:first-child { width: 22%; font-weight: 500; }
table.fill td { padding: 5pt 6pt 13pt 0; }
"""

RED = handout("red", "A250_Handout_Red_SocialStudies.pdf", [
  ("section", {"label": "Historical method", "title": "Then, and later",
               "body": ["A document has a meaning for the people who made it, and it gains new meanings from the people who inherit it. A historian keeps both in view, and asks who made each meaning."]}),
  ("task", {"label": "Part 1", "title": "What did it mean, and to whom?",
            "body": ["Use the poster *Before it was Sacred* to fill the chart."]}),
  ("table", {"head": ["When", "What the Declaration meant", "Evidence from the exhibition"], "rows": [
      ["**July 1776**", "", ""],
      ["**The first fifteen years**", "", ""],
      ["**July 4, 1826**", "", ""],
      ["**Lincoln, at Gettysburg**", "", ""]]}),
  ("task", {"label": "Part 2", "title": "The charge that was cut",
            "body": ["Congress removed Jefferson’s charge against George III for the slave trade, and the word *slave* does not appear in the Declaration as adopted. The exhibition does not say why the charge was cut. What would a historian need to find out before answering, and what kinds of sources might hold the answer? What does the cut itself tell you about whose voices shaped the document?"], "lines": 5}),
  ("task", {"label": "Part 3", "title": "Argue the poster’s claim",
            "blocks": [("html", quote("“" + CLOSE + "”", "Before it was Sacred") + ev([(a, b) for a, b in LEFT_OUT], "three"))],
            "body": ["Do you agree? Write an argument. Make a claim, use at least **three** pieces of evidence, including who “all men are created equal” left out in 1776, and answer one objection."], "lines": 7}),
  ("connection", ["Benjamin Rush wrote in 1786 that “nothing but the first act of the drama is closed.” Read *The Long Wager* on the second poster. How does it fit your argument?"]),
], R_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
