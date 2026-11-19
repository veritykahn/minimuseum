"""Grades 5–8 · ELA · "Self-Evident"
The Declaration read as an argument: Franklin's edit of Jefferson's words,
the three moves of the text (beliefs, twenty-seven charges, conclusion and
pledge), the rhetoric that carries it, and a declaration of students' own,
signed in Put Your Name to It. Facts follow america250.ts (poster 1, "The
Wrong Author"; poster 2, Paine and Rush) and sign/declaration.ts (the text,
and the owner's class declaration, quoted in her own wording)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (TRUMBULL, pic, OBJ_CSS, FLOW_CSS, EV_CSS, TIMING_45, look_back_say, review, ev, quote)

DIR = "teachers/grades-5-8/ela/"
TITLE = "Self-Evident"
SUB = "Grades 5–8 · ELA · The Declaration as an argument"

HERO = pic("trumbull-committee.jpg", TRUMBULL, "center 16%")

# Jefferson's words and Franklin's, as the poster gives them
DRAFT = "We hold these truths to be sacred and undeniable"
FINAL = "We hold these truths to be self-evident"
HOOK_Q = "Which sounds stronger to you, and why?"

# the Declaration's own words (declaration.ts)
OPENING = "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another…"
EQUAL = "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness."
PROVE = "To prove this, let Facts be submitted to a candid world."
CONCLUDE = "That these United Colonies are, and of Right ought to be Free and Independent States"
PLEDGE = "we mutually pledge to each other our Lives, our Fortunes and our sacred Honor."
PETITION = "In every stage of these Oppressions We have Petitioned for Redress in the most humble terms: Our repeated Petitions have been answered only by repeated injury."

# the three moves, for the screen and the Show your class page
MOVES = [
  ("1 · The claim", "States what the signers hold true about people and government, and the right to throw off a government that destroys those rights.", "“We hold these truths to be self-evident…”"),
  ("2 · The evidence", "Twenty-seven charges against the King, the longest part. Most begin *He has* or *For*.", "“To prove this, let Facts be submitted to a candid world.”"),
  ("3 · The conclusion", "Declares the colonies free and independent, and ends with a pledge.", "“…our Lives, our Fortunes and our sacred Honor.”"),
]
MOVES_SCREEN = {"caption": "The Declaration as an argument: three moves",
                "columns": ["Move", "What it does", "In its own words"],
                "rows": [{"cells": [a, b, c]} for a, b, c in MOVES]}

# the class's declaration in the exhibition's room, in the owner's own wording (declaration.ts)
CLASS_DEC = [
  "We hold these truths to be self-evident: that every person in this classroom was made with dignity and purpose, and is worthy of kindness and respect.",
  "We therefore declare that we will come to school ready to learn, and give our best to every task set before us.",
  "And so we mutually pledge to one another our attention, our kindness, and our honour."]

DEVICES = [
  ("Repetition", "the same words opening line after line: *He has… He has… He has…*"),
  ("A list of three", "*Life, Liberty and the pursuit of Happiness*; *our Lives, our Fortunes and our sacred Honor*"),
  ("Word choice", "*self-evident* in place of *sacred and undeniable*: Franklin’s change to Jefferson’s draft"),
  ("Audience", "*a candid world*: the argument is addressed to readers outside the colonies")]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("trace the Declaration’s argument through its three moves: claim, evidence and conclusion",
     "trace the Declaration’s argument through its three moves?", False),
    ("explain how word choice and repetition give the argument its force, starting from Franklin’s edit",
     "explain how its word choice and repetition give it force?", False),
    ("write and sign a declaration of your own that makes a claim, gives reasons and ends in a pledge",
     "write a declaration that claims, gives reasons and pledges?", False),
    ("judge a writer’s choices against their audience, including whom the words *all men* named in 1776",
     "judge a writer’s choices against their audience?", True)],
  "why": "The Declaration is a piece of persuasive writing before it is anything else. Seeing how it works, word by word, is how a reader learns to make an argument, and to read one critically."}

FIT_CSS = """
table.moves { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.moves th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.moves td { border-bottom: .6pt solid #c8c5bb; padding: 6pt 8pt 6pt 0; vertical-align: top; line-height: 1.4; }
table.moves td:first-child { font-weight: 500; width: 20%; }
table.moves td:last-child { font: italic 400 11pt/1.3 'Cormorant Garamond', serif; width: 34%; }
.classdec { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 8pt 12pt 4pt; margin: 4pt 0 10pt; break-inside: avoid; }
.classdec p:not(.label) { font: italic 400 12pt/1.35 'Cormorant Garamond', serif; }
.refs { font-size: 9.2pt; }
"""

def moves_table():
    from _common import md
    head = "".join(f"<th>{h}</th>" for h in MOVES_SCREEN["columns"])
    rows = "".join(f"<tr><td>{md(a)}</td><td>{md(b)}</td><td>{md(c)}</td></tr>" for a, b, c in MOVES)
    return f'<table class="moves"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'

def class_dec():
    from _common import md
    return ('<div class="classdec"><p class="label">Our Class Declaration · from the room Put Your Name to It</p>'
            + "".join(f"<p>{md(t)}</p>" for t in CLASS_DEC) + "</div>")

LESSON = {
  "slug": "self-evident",
  "out": DIR + "A250_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + FIT_CSS,
  "blocks": [
    ("timing", TIMING_45),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the Declaration of Independence as persuasive writing. They will follow its three moves, a **claim**, twenty-seven charges as **evidence**, and a **conclusion** that ends in a pledge, and see how word choice and repetition give it force. Then they will write a declaration of their own in the same shape, and sign it in the exhibition’s room *Put Your Name to It*."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Reading informational text** — tracing an argument; how evidence supports a claim; the author’s purpose and audience",
      "**Language** — word choice and connotation (*sacred and undeniable*, *self-evident*); repetition and the list of three",
      "**Writing** — an argument with a claim, reasons and a conclusion; revising for force",
      "**Speaking and listening** — reading a declaration aloud to an audience"]}),
    ("section", {"label": "Materials needed", "list": [
      "*Put Your Name to It*, projected, open to the Declaration on the parchment",
      "The *Show your class* page (page 3), projected or printed; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Two versions of one line",
      "screen": {"phase": "Hook", "show": "words", "text": f"“{DRAFT}…”\n“{FINAL}…”",
                 "cite": "Jefferson’s draft, and the Declaration",
                 "purpose": "Start with a writer’s choice: two versions of the same line.",
                 "students": [HOOK_Q, "Which one asks the reader to argue back?"]},
      "body": [f"Write two lines on the board: *“{DRAFT}…”* and *“{FINAL}…”* Ask: *“{HOOK_Q}”* Take answers, then reveal: the first is Jefferson’s draft. Benjamin Franklin changed it to the second. The exhibition’s poster *Before it was Sacred* says Jefferson was the author but not the sole author: there were at least four. *“Today we read the Declaration the way its editors did: as a piece of writing meant to persuade.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "An argument in three moves",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "Three moves", "show": "chart", **MOVES_SCREEN,
         "purpose": "See the shape of the argument before looking at its words.",
         "students": ["Which move is the longest?", "Why would an argument need so much evidence?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "Words that work", "show": "words", "text": EQUAL,
         "cite": "The Declaration of Independence, 1776",
         "purpose": "Read the most famous sentence as a writer would, and ask whom its words name.",
         "students": ["Find a list of three.", "Who are “all men” in this sentence, and who signed it?"]}],
      "body": [
        "Scroll the parchment in *Put Your Name to It* and show the three moves (page 3). The claim comes first. Then the Declaration says what it will do: *“" + PROVE + "”* What follows is the longest part, twenty-seven charges against the King. The poster says those charges were the whole point in 1776. It ends by declaring the colonies free and independent, and with a pledge.",
        "Read the conclusion’s last words aloud: *“…" + PLEDGE + "”* Ask what the list of three does to the sound and the weight of the pledge.",
        "Now read the famous sentence. Point out the list of three, and the word *self-evident*: a truth that needs no proof. Then read closely: *who are “all men”?* Fifty-six men signed it. The exhibition notes that Congress cut Jefferson’s charge about the slave trade, and that the twenty-seventh charge calls Native peoples “the merciless Indian Savages.” A careful reader asks whom a writer’s words include, and whom they leave out."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the argument closely, then write one, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the same lines and end with a declaration of your own."]},
      "body": ["Students choose a handout. All three read the same lines of the Declaration and end with a declaration of their own."]}),
    ("levels", {
      "green": "Sort six lines into claim, evidence or conclusion, find the repetition and the list of three, then write a declaration with sentence starters.",
      "yellow": "Explain Franklin’s edit, name the device in four lines and say what each does, then write a declaration with a claim, three reasons and a pledge.",
      "red": "Weigh whether a truth that needs twenty-seven charges is *self-evident*, judge the words *all men* against their audience, and write a declaration that answers an objection."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Put your name to it",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Our declarations", "show": "words", "text": "\n".join(CLASS_DEC),
         "cite": "Our Class Declaration, in Put Your Name to It",
         "purpose": "Hear the students’ declarations, and see the same shape in the room’s own class declaration.",
         "students": ["Read your claim and your pledge aloud.", "Which word in it is doing the most work?"]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Ask three students to read their declarations aloud, one from each level if you can. For each, the class names the claim, one reason and the pledge. Then open *Put Your Name to It*, choose *Our Class Declaration* and read its opening lines: the same shape, written for a classroom. Students can sign it together, or sign their own in *My Declaration* and print it.",
               look_back_say()]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green sort:** claim — *“We hold these truths…”*, *“When in the Course of human events…”*; evidence — *“He has refused his Assent…”*, *“For imposing Taxes…”*; conclusion — *“…Free and Independent States”*, *“…our sacred Honor.”*",
      "**Devices:** repetition (*He has*), list of three (*Life, Liberty and the pursuit of Happiness*), word choice (*self-evident*), audience (*a candid world*). Credit any well-argued effect.",
      "**Exit ticket:** *quote one phrase from the Declaration and explain what one word in it does.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Declaration as an argument",
      "body": ["Project or print this page for the lesson. Scroll the parchment in *Put Your Name to It* beside it, so students see how long each move is."]}),
    ("html", moves_table()),
    ("section", {"label": "Show your class", "title": "Four tools of the writer"}),
    ("refs", DEVICES),
    ("html", class_dec()),
    ("section", {"label": "For the teacher", "title": "Reading it critically",
      "body": ["The exhibition’s posters do not treat the Declaration as untouchable. Adams called it *hackneyed*: there was not an idea in it, he said, that had not been discussed in Congress for two years. Congress made it a cooler, more measured document than Jefferson intended. Let students admire its craft and still ask whom it addressed and whom it left out; both are part of reading it well."]}),
    ("connection", ["**Visit the exhibition:** in *Put Your Name to It*, students read the whole Declaration on the parchment, dip the quill and sign. *Our Class Declaration* and *My Declaration* let them sign their own, and print it. Nothing they sign is saved or sent."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Declaration of Independence is an argument: it makes a claim, backs it with evidence and draws a conclusion. Jefferson wrote the draft, but Franklin and Congress changed its words. Today you read it the way its editors did, and then write a declaration of your own."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": EV_CSS + css}

H_CSS = """
table.fill td:first-child { width: 64%; }
table.fill td { padding: 5pt 6pt 8pt 0; }
.frame { font: 400 10.4pt/1 'Outfit'; margin: 9pt 0 0; }
"""

LINES6 = [
  OPENING, "He has refused his Assent to Laws, the most wholesome and necessary for the public good.",
  "…our Lives, our Fortunes and our sacred Honor.", "For imposing Taxes on us without our Consent:",
  "We hold these truths to be self-evident…", "That these United Colonies are, and of Right ought to be Free and Independent States"]

def frames(starts, n=2):
    from _common import md
    w = '<div class="write">' + "<i></i>" * n + "</div>"
    return "".join(f'<p class="frame">{md(s)}</p>{w}' for s in starts)

GREEN = handout("green", "A250_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Claim, evidence or conclusion?",
            "body": ["The Declaration makes its argument in three moves. Write **claim**, **evidence** or **conclusion** beside each line."]}),
  ("table", {"head": ["Line from the Declaration", "Which move?"], "rows": [[f"“{l}”", ""] for l in LINES6]}),
  ("task", {"label": "Part 2", "title": "Find the tools",
            "blocks": [("html", quote(EQUAL, "The Declaration of Independence, 1776"))],
            "body": ["**a.** Underline the **list of three** in the sentence above.",
                     "**b.** Many of the charges begin with the same two words. What are they? *He ______*",
                     "**c.** Jefferson wrote *sacred and undeniable*. Franklin changed it to *self-evident*, which means *needing no proof*. Why might that be stronger?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Your declaration",
            "blocks": [("html", frames(["We hold these truths to be self-evident: that",
                                        "We therefore declare that we will",
                                        "And so we pledge our"], 3))],
            "body": ["Finish each sentence to make a declaration for your class. Then sign it in *Put Your Name to It*."]}),
  ("connection", ["In *Put Your Name to It*, choose *Our Class Declaration*. Read its first lines. Which of your sentences does it sound most like?"]),
], H_CSS)

Y_CSS = H_CSS + """
table.fill td:first-child { width: 58%; font-style: italic; }
table.fill td { padding-bottom: 14pt; }
"""

YELLOW = handout("yellow", "A250_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Franklin’s edit",
            "blocks": [("html", ev([("Jefferson’s draft", f"“{DRAFT}…”"), ("The Declaration", f"“{FINAL}…”")]))],
            "body": ["*Sacred* belongs to religion; *undeniable* dares the reader to try. *Self-evident* means a truth that needs no proof. How does Franklin’s change alter the way a reader is asked to respond?"], "lines": 3}),
  ("task", {"label": "Part 2", "title": "Name the tool",
            "body": ["For each line, name the tool (**repetition**, **list of three**, **word choice** or **audience**) and say what it does."]}),
  ("table", {"head": ["Line from the Declaration", "Tool, and what it does"], "rows": [
      ["“He has refused his Assent to Laws… He has forbidden his Governors… He has refused to pass other Laws…”", ""],
      ["“…our Lives, our Fortunes and our sacred Honor.”", ""],
      [f"“{PROVE}”", ""],
      [f"“{PETITION}”", ""]]}),
  ("task", {"label": "Part 3", "title": "Your declaration",
            "body": ["Write a declaration for your class or your year in the Declaration’s three moves: a **claim** (*We hold these truths…*), **three reasons**, each a sentence of its own, and a **conclusion with a pledge**. Use one list of three. Then sign it in *Put Your Name to It*."], "lines": 9}),
  ("connection", ["In *Put Your Name to It*, compare your declaration with *Our Class Declaration*. Which tools does it use?"]),
], Y_CSS)

R_CSS = H_CSS + ".ev.two div { font-size: 9pt; }"

RED = handout("red", "A250_Handout_Red_ELA.pdf", [
  ("section", {"label": "The writer’s craft", "title": "Purpose and audience",
               "body": ["Every argument is written for someone. The Declaration says it is written out of *“a decent respect to the opinions of mankind”*, and submits its facts *“to a candid world.”* The exhibition’s poster adds that it was designed above all to persuade France to enter the war."]}),
  ("task", {"label": "Part 1", "title": "Self-evident?",
            "body": ["A self-evident truth needs no proof. Yet the Declaration follows its truths with twenty-seven charges, *“to prove this.”* Is that a contradiction, or a smart move for this audience? Explain, quoting the text."], "lines": 5}),
  ("task", {"label": "Part 2", "title": "Whom do the words name?",
            "blocks": [("html", quote(EQUAL, "The Declaration of Independence, 1776")
                        + ev([("Who signed", "Fifty-six men signed the Declaration."),
                              ("What Congress cut", "Jefferson’s charge against George III for the slave trade."),
                              ("What the text says", "The twenty-seventh charge calls the Native peoples on the frontier “the merciless Indian Savages.”"),
                              ("What it became", "Lincoln made “all men are created equal” the founding promise of the nation.")], "two"))],
            "body": ["A writer chooses words for an audience. In 1776, whom did *all men* include, and whom did it leave out? How could later readers use the same words to argue for people the writers left out?"], "lines": 5}),
  ("task", {"label": "Part 3", "title": "A declaration that answers back",
            "body": ["Write a declaration on something you believe should change in your school or community. Make a claim, give at least three reasons, **answer one objection** a fair reader might raise, and end with a pledge."], "lines": 8}),
  ("connection", ["Thomas Paine wrote *“These are the times that try men’s souls”* when the army was dissolving. Read the second poster. Why might a short line persuade more than a long one?"]),
], R_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
