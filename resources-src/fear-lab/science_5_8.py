"""Grades 5–8 · Science · "The Science of Not Knowing"
Ambiguity aversion, dread and the brain's alarm, tested on the class itself:
the lab's six Known or Unknown? choices become a class survey, compared with
the studies the exhibition reports (poster 1 and the lab's notes). Students
read those studies for their variables, measures and samples, then design a
kind, fair pulse experiment of their own. Facts follow
app/exhibitions/fear-lab/fearLab.ts and what-scares-you/KnownOrUnknown.tsx."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403

DIR = "teachers/grades-5-8/science/"
TITLE = "The Science of Not Knowing"
SUB = "Grades 5–8 · Science · Ambiguity, dread and the brain’s alarm"

HERO = {"img": POSTER1, "pos": "center 0%"}

# the poster's own "Talk about it" question for its first chapter (fearLab.ts)
HOOK_Q = BOX
VOTE_Q = "Would you rather know exactly what is in the box, or not know? Why might not knowing feel worse?"
LAST_Q = "A study says people chose the scary option. What would you want to know before you believed it?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain ambiguity aversion: why not knowing can feel worse than a danger you can see",
     "explain why not knowing can feel worse than a known danger?", False),
    ("compare your class’s choices with what the exhibition’s studies found",
     "compare your class’s choices with what the studies found?", False),
    ("name what was changed, what was measured and how many people took part in a study of fear",
     "name a study’s variable, its measure and its sample?", False),
    ("design a fair, kind experiment that tests whether not knowing raises a pulse",
     "design a fair, kind test of whether not knowing raises a pulse?", True)],
  "why": "Every day you are asked to trust a claim that begins “studies show.” Knowing what a study changed, measured and counted lets you judge it for yourself."}

CSS = """
table.fill td:first-child { width: 30%; }
table.fill td { padding: 4pt 6pt 6pt 0; }
"""
PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
table.fill { font-size: 8.8pt; }
table.fill td { padding: 3.5pt 6pt 4pt 0; }
table.fill td:first-child { width: 24%; font-weight: 500; }
"""

# the six choices, for the screen and the show-your-class page
CHART_SCREEN = {"caption": "Known or Unknown? The six choices in the lab, and what the exhibition reports",
                "columns": ["The choice", "Known", "Unknown", "What the exhibition reports"],
                "rows": [{"cells": list(c)} for c in CHOICES]}

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "the-science-of-not-knowing",
  "out": DIR + "FL_LP_Science.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Science", "hero": HERO, "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK_C), ("Teach", 12, TEACH_C), ("Activity", 21, ACT_C), ("Debrief", 7, CLOSE_C)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn that the brain’s first fear is the unknown. Poster 1 calls it **ambiguity aversion**: we would rather face a known danger than an unknown possibility, and uncertainty itself sets off the **amygdala**, the brain’s alarm system. Students will vote on the lab’s six *Known or Unknown?* choices, compare their class with the studies the exhibition reports, read those studies as scientists, and design a fair, kind experiment of their own."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Science practices** — asking questions, planning investigations, analyzing data, arguing from evidence",
      "**Life science** — the brain and the senses; how organisms respond to what they cannot see",
      "**Math** — fractions and percentages from a study’s own counts"
]}),
    ("section", {"label": "Materials needed", "list": [
      "A cardboard box with a hand-sized hole, and something harmless inside (a pinecone, as in the lab)",
      "The *Show your class* page (page 3), projected or printed; *What Scares You?* online if you have a screen",
      "A clock with a second hand; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A box you can’t see into",
      "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q,
                 "purpose": "Feel the effect before naming it: the heart races before the hand touches anything.",
                 "students": ["Find your pulse on your wrist or neck.", "What do you think is in the box?", "Did your heart speed up while you waited?"]},
      "body": [f"Hold up the box. Read the poster: *“{HOOK_Q}”* Before a volunteer reaches in, everyone finds their pulse on the wrist or neck, as the lab’s *Take your own pulse* asks. The volunteer says what it feels like, then pulls out the pinecone. Ask: *“What did you imagine was in there? Was the waiting worse than the pinecone?”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Known or unknown?",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Take the vote", "show": "question", "question": VOTE_Q,
         "purpose": "Collect the class’s own data before showing what the studies found.",
         "students": [c[0] for c in CHOICES]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "What the studies found", "show": "chart", **CHART_SCREEN,
         "purpose": "Compare the class’s choices with the exhibition’s findings, choice by choice.",
         "students": ["Did our class match the studies?", "Which result surprises you most?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "The brain’s alarm", "show": "words", "text": AMYGDALA,
         "cite": "Poster 1 · Fear of the Unknown: Your Brain’s Biggest Trick",
         "purpose": "Name the brain system behind what students felt in the hook.",
         "students": ["Why might the alarm ring louder for a box than for a spider you can see?"]}],
      "body": [
        "Read each of the six choices from the lab’s *Known or Unknown?* (page 3), but not the last column. Students vote with a hand for *known* or *unknown*; a student records the tally on the board.",
        "Now reveal what the exhibition reports, one row at a time. Read the poster: *“" + AMBIGUITY + "”* Where did the class match the studies?",
        "Read: *“" + AMYGDALA + "”* Link it to the hook: the alarm rang before anyone touched the pinecone. Name **dread**, the fear of waiting, and **negativity bias**, imagining disasters when unsure."]}),
    ("section", {"label": "Activity · 21 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read fear studies as a scientist, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the class’s votes and the exhibition’s studies."]},
      "body": ["Students choose a handout. All three work from the class’s votes and the studies the exhibition reports."]}),
    ("levels", {
      "green": "Record the class’s votes on three choices beside the studies’ results, match four new words to their meanings, read the 2014 study’s counts as fractions, and write a claim with evidence.",
      "yellow": "Tabulate all six votes as percentages, take apart the 2014 and 2020 studies (what changed, what was measured, how many took part), and explain why the marble jar choice shows ambiguity aversion.",
      "red": "Design an experiment to test whether not knowing raises a pulse, with a clear box and a covered box, then make it fair and kind, and judge what a poster leaves out when it says “some people.”"}),
    ("section", {"label": "Debrief · 7 minutes",
      "screen": [
        {"phase": "Debrief", "minutes": 3, "script": [0], "title": "Would you believe it?", "show": "question", "question": LAST_Q,
         "purpose": "Turn the lesson into a habit: ask what a study changed, measured and counted.",
         "students": ["How many people?", "What was changed, and what was measured?", "Would it work the same in our class?"]},
        {"phase": "Debrief", "minutes": 4, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK, "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": objectives_screen(OBJECTIVES)[0], "deeper": objectives_screen(OBJECTIVES)[1]}],
      "body": [f"Ask: *“{LAST_Q}”* Red-level students share a design and how they made it kind.",
               "Then ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down. Exit ticket: *“Why can a box you can’t see into feel scarier than a spider you can?”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Check the lab first.** The *Fear Boxes* show photos of real animals, even in Gentle mode. Use *Known or Unknown?*, and let anyone sit out the box.",
        "**No shocks, no scares.** The studies used electric shocks; your class uses votes and a pinecone."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**2014 study:** 12 of 18 men is 2/3 (about 67%); 6 of 24 women is 1/4 (25%); 18 of 42 people in all.",
        "**2020 study:** changed, how scary the haunted house was; measured, heart rate (by monitor); sample, 110 visitors in Vejle, Denmark.",
        "**Marble jar:** nobody says the mystery jar is worse, yet most choose the known mix. That is ambiguity aversion (the Ellsberg paradox, 1961).",
        "**Red design:** independent variable, clear or covered box; dependent, pulse; controls, same object, wait and count. **Assess:** Red designs name all three and an opt-out.",]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Known or unknown?",
      "body": ["Project or print this page for the vote. Cover the last column until the class has voted on each choice."]}),
    ("table", {"head": CHART_SCREEN["columns"], "rows": [list(c) for c in CHOICES]}),
    quote(AMBIGUITY, "Poster 1 · Fear of the Unknown: Your Brain’s Biggest Trick"),
    quote(MYSTERY_BOX, "Poster 1 · Anticipation Makes Everything Scarier"),
    ("section", {"label": "Questions to ask in front of the poster", "list": [
      "Would you rather know exactly what is in the box, or not know? Why might not knowing feel worse?",
      "Have you ever found that waiting for something was worse than the thing itself?",
      "Why might the brain’s alarm ring for something it cannot see?",
      "The haunted house visitors enjoyed a medium scare most. Why not the biggest?"]}),
    ("connection", ["**Visit the exhibition:** poster 1, *Fear of the Unknown*, and the two tactile Mystery Fear Boxes in the case, whose contents change each week. **Online:** *What Scares You?* has the six choices, and a pulse you can tap."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Poster 1 says your brain’s #1 fear isn’t spiders or snakes: it’s the **unknown**. Scientists call it **ambiguity aversion**: we’d rather face a known danger than an unknown possibility. Uncertainty sets off the **amygdala**, your brain’s alarm system."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Science", "level": level, "context": CONTEXT, "css": CSS + QUOTE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 Science · {level.title()} Level", "blocks": blocks, "hero": HERO}

STUDY_2014 = CHOICES[4][3]
STUDY_2020 = CHOICES[5][3]

GREEN = handout("green", "FL_Handout_Green_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Our class and the studies",
            "blocks": [("html", "<p>Fill in your class’s votes for three of the lab’s choices. Then read what the exhibition reports.</p>"),
                       ("table", {"head": ["The choice", "Known", "Unknown", "What the exhibition reports"], "rows": [
                         [CHOICES[0][0], "", "", CHOICES[0][3]],
                         [CHOICES[2][0], "", "", CHOICES[2][3]],
                         [CHOICES[3][0], "", "", CHOICES[3][3]]]})],
            "body": ["Did your class choose the way the studies say most people do? Which result surprised you most, and why?"], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Words scientists use",
            "blocks": [("html", "<p>Draw a line from each word to what it means.</p>"),
                       ("table", {"head": ["Word", "What it means"], "rows": [
                         ["Ambiguity aversion", "your brain’s alarm system"],
                         ["Amygdala", "the fear of waiting for something bad"],
                         ["Dread", "imagining disasters when you aren’t sure"],
                         ["Negativity bias", "choosing a known danger over an unknown one"]]})]}),
  ("task", {"label": "Part 3", "title": "Read the numbers",
            "blocks": [quote(STUDY_2014, "What Scares You? · Known or Unknown?")],
            "body": ["**a.** How many people took part in all? ________",
                     "**b.** What fraction of the men shocked themselves? ________ Of the women? ________",
                     "**c.** Were people choosing a shock over doing nothing? What does that tell you about sitting alone with your thoughts?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Claim and evidence",
            "body": ["Finish the claim, then give one piece of evidence from today: your class’s votes, the box in the hook, or a study.",
                     "**Claim:** Not knowing can feel worse than knowing, because…"], "lines": 4}),
  ("family", ["Ask your family the lab’s question: *“Would you rather know exactly what is in the box, or not know?”* Count how many choose each."]),
], ".task { break-inside: avoid; } table.fill td { height: 26pt; } .task:nth-of-type(1) table.fill td:nth-child(2), .task:nth-of-type(1) table.fill td:nth-child(3) { width: 12%; } .task:nth-of-type(1) table.fill td { height: 34pt; } .task:nth-of-type(2) table.fill td:first-child { width: 40%; } .task:nth-of-type(2) table.fill { font-size: 10pt; }")

YELLOW = handout("yellow", "FL_Handout_Yellow_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Our class’s data",
            "blocks": [("html", "<p>Record your class’s votes on all six choices. Work out what percent chose the <b>known</b> option.</p>"),
                       ("table", {"head": ["The choice", "Known", "Unknown", "% known"], "rows": [
                         [c[0], "", "", ""] for c in CHOICES]})],
            "body": ["Which choice split your class most evenly? Which did nearly everyone agree on?"], "lines": 2}),
  ("task", {"label": "Part 2", "title": "Take a study apart",
            "blocks": [("html", "<p>Every study changes one thing, measures another, and counts its people. Fill in the table from these two reports.</p>"),
                       quote(STUDY_2014, "Known or Unknown? · 2014"), quote(STUDY_2020, "Known or Unknown? · 2020"),
                       ("table", {"head": ["", "2014 study", "2020 study"], "rows": [
                         ["What was the choice or change?", "", ""],
                         ["What was measured?", "", ""],
                         ["How many people?", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "Do the math",
            "body": ["In the 2014 study, what percent of the men shocked themselves? What percent of the women? Show your working."], "lines": 3}),
  ("task", {"label": "Part 4", "title": "The marble jar",
            "blocks": [quote(CHOICES[3][3], "Known or Unknown?")],
            "body": ["Nobody said the mystery jar was worse. Explain why most people still choose the known one, using the words **ambiguity aversion**."], "lines": 4}),
  ("family", ["Try the marble jar question at home. Did your family choose the known mix? Explain the Ellsberg paradox to them."]),
], "table.fill td { height: 24pt; } .task:nth-of-type(1) table.fill td:not(:first-child) { width: 14%; } .task:nth-of-type(1) table.fill td:first-child { width: 50%; } .task:nth-of-type(2) table.fill td { height: 34pt; } .task:nth-of-type(2) table.fill td:first-child { width: 30%; }")

RED = handout("red", "FL_Handout_Red_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Design the experiment",
            "blocks": [("html", "<p><b>Question:</b> Does not knowing what is in a box raise your pulse? You have two boxes: one clear, one covered, with the same harmless object (a pinecone) in each. Plan the test.</p>"),
                       ("table", {"head": ["Part of the plan", "Your plan"], "rows": [
                         ["Hypothesis", ""], ["Independent variable (what you change)", ""],
                         ["Dependent variable (what you measure)", ""], ["Controls (keep these the same)", ""],
                         ["Sample (who, and how many)", ""]]})],
            "body": ["Write your steps in order, including when you take each pulse."], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Make it fair and kind",
            "body": ["The studies on poster 1 used electric shocks. Why should your experiment use a pinecone instead? Name two things you would do so that anyone could say no or stop at any time."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "What the poster leaves out",
            "blocks": [quote(DREAD, "Poster 1 · Anticipation Makes Everything Scarier")],
            "body": ["“Some people” could be two people or two thousand. List three things you would need to know before you trusted this result, and say why each matters."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Results and conclusion",
            "blocks": [("table", {"head": ["", "Pulse before", "Pulse after"], "rows": [
                         ["Clear box", "", ""], ["Covered box", "", ""]]})],
            "body": ["If you can run your test, record the class average. Does it support your hypothesis?"], "lines": 2}),
  ("family", ["Ask your family about a time when waiting was worse than the thing itself. Was the unknown the scary part?"]),
], ".task { break-inside: avoid; } table.fill td { height: 32pt; } table.fill td:first-child { width: 42%; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
