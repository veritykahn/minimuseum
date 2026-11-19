"""Grades 5–8 · ELA · "Page Turners"
Why we read stories designed to scare us, horror's line from the Gothic
classics to Point Horror and Red Eye, horror's golden rule (the monster is
what it represents), and suspense: the writer's mystery box, which hides the
monster so the reader's imagination does the work. Facts follow poster 2 in
app/exhibitions/fear-lab/fearLab.ts, word for word, and its "Talk about it"
questions. No book is given a theme the poster doesn't give it."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403

DIR = "teachers/grades-5-8/ela/"
TITLE = "Page Turners"
SUB = "Grades 5–8 · ELA · Suspense, the Gothic and what a monster stands for"

HERO = {"img": VAMPIRE_MOON, "pos": "center 45%"}

# the poster's own "Talk about it" questions (fearLab.ts)
MONSTER_Q = "The poster says the real terror isn’t the creature, it’s what it represents. Pick a monster you know. What might it stand for?"
HALL_Q = "If you wrote a scary story set in your own school’s hallways, what would it be about?"
LAST_Q = "What fears might a new scary story explore for your generation? And why might being scared together bring people closer?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain the two reasons poster 2 gives for reading stories designed to scare us",
     "explain why people read stories designed to scare them?", False),
    ("trace horror from the Gothic classics to Point Horror and Red Eye",
     "trace horror from the Gothic classics to today?", False),
    ("use horror’s golden rule to say what a monster might stand for",
     "say what a monster might stand for?", False),
    ("build suspense by keeping the monster hidden, so the reader’s imagination does the work",
     "build suspense by keeping the monster hidden?", True)],
  "why": "Every writer has to decide what to show and what to hold back. Horror makes that choice easy to see, and the same craft keeps any reader turning pages."}

# horror's line, as poster 2 tells it: (when, writers and books, what the poster says)
TIMELINE = [
  ("1818", "Mary Shelley, “Frankenstein”", "“It began with” this book."),
  ("1886", "Robert Louis Stevenson, “Jekyll and Hyde”", "One of the Gothic classics."),
  ("1890", "Wilde, “Picture of Dorian Gray”", "One of the Gothic classics."),
  ("1897", "Stoker, “Dracula”", "One of the Gothic classics."),
  ("Victorian", "Penny dreadfuls: “Varney the Vampire”, “Spring-Heeled Jack”", "Cheap weekly serials that working-class Victorians devoured."),
  ("Later", "H.P. Lovecraft, Shirley Jackson, Stephen King", "They “bridged oceans and decades.”"),
  ("1991", "Scholastic’s Point Horror: R.L. Stine, Christopher Pike, Caroline B. Cooney, Diane Hoh", "Moved horror “from Gothic castles to high school hallways.”"),
  ("Today", "Stripes Publishing’s Red Eye: “Frozen Charlotte”, “Sleepless”", "“Updating classic fears for the Instagram age.”"),
]
CHART_SCREEN = {"caption": "Horror’s line, as poster 2 tells it",
                "columns": ["When", "Writers and books", "What the poster says"],
                "rows": [{"cells": list(r)} for r in TIMELINE]}

CSS = """
table.fill td { padding: 4pt 6pt 6pt 0; }
"""
PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
table.fill { font-size: 9pt; }
table.fill td { padding: 3.5pt 6pt 4pt 0; }
table.fill td:first-child { width: 13%; font-weight: 500; }
table.fill td:nth-child(2) { width: 47%; }
"""

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "page-turners",
  "out": DIR + "FL_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK_C), ("Teach", 12, TEACH_C), ("Activity", 21, ACT_C), ("Debrief", 7, CLOSE_C)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn poster 2’s answer to *why do we willingly read stories designed to scare us?*: horror is a **risk-free rehearsal** for danger, and scary books bring us together. They will trace horror from Mary Shelley’s “Frankenstein” (1818) to today’s Red Eye series, apply horror’s **golden rule** (the real terror is what the monster represents), and practice the writer’s version of the mystery box: keeping the monster hidden so the reader’s imagination does the work."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Reading** — determining a central idea; tracing how a genre develops over time",
      "**Writing** — narrative technique: pacing, sensory detail, withholding information to build suspense",
      "**Speaking and listening** — discussing claims and supporting them with evidence"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed; poster 2 online if you have a screen",
      "Any scary story your class knows, or none: the lesson works from the poster alone",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Why would anyone?",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": VAMPIRE_MOON}, "alt": VAMPIRE_MOON_ALT, "caption": WHY_READ, "fit": "contain",
                 "purpose": "Wonder first: why choose to be scared? And notice what the picture keeps hidden.",
                 "students": ["Why do people read stories designed to scare them? Do you?", "What can’t you see in this picture?"]},
      "body": [f"Show poster 2’s vampire under the moon. Ask the poster’s question: *“{WHY_READ}”* Collect reasons on the board. Then ask: *“What can’t you see in this picture?”* (His face.) *“Is he scarier for it?”* Keep that answer for later."]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Rehearsals, a family tree and a golden rule",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "A risk-free rehearsal", "show": "words", "text": REHEARSAL,
         "cite": P2, "purpose": "Hear the poster’s first answer and test it against the class’s list.",
         "students": ["Which of our reasons does the poster agree with?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Horror’s line", "show": "chart", **CHART_SCREEN,
         "purpose": "Trace horror from the Gothic classics to the books students’ own age group reads.",
         "students": ["Which of these have you heard of?", "What changed when horror moved to the hallways?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Horror’s golden rule", "show": "words", "text": GOLDEN_RULE,
         "cite": P2, "purpose": "Read a monster as a symbol, and see why a hidden monster can be scarier.",
         "students": ["Pick a monster you know. What might it stand for?"]}],
      "body": [
        f"Read: *“{REHEARSAL}”* Which of the class’s reasons match?",
        "Walk down the timeline (page 3), from the Gothic classics to Point Horror in 1991, which *“moved horror from Gothic castles to high school hallways,”* and Red Eye today. Why would teenagers want horror of their own?",
        f"Read the golden rule: *“{GOLDEN_RULE}”* Ask the poster’s question: *pick a monster you know; what might it stand for?* Then return to the hook. Poster 1 says *“{MYSTERY_BOX}”* Writers use the same trick: show a sound, a shadow, a clue, and let the reader’s imagination supply the monster."]}),
    ("section", {"label": "Activity · 21 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read horror as a genre and write suspense, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the poster closely and write a scene that keeps the monster hidden."]},
      "body": ["Students choose a handout. All three read the poster closely and finish by writing a scene that keeps the monster hidden."]}),
    ("levels", {
      "green": "Put horror’s timeline in order, explain a risk-free rehearsal in their own words, say what two monsters might stand for, and rewrite a plain sentence so the monster stays hidden.",
      "yellow": "Weigh the poster’s two reasons for reading horror, explain why the hallway scares more than the castle, and write a suspense opening set in their own school.",
      "red": "Define horror’s Gothic DNA, invent a monster for their generation’s fears, test whether the penny dreadfuls’ popularity proves the poster’s claim, and write an opening that never shows the monster."}),
    ("section", {"label": "Debrief · 7 minutes",
      "screen": [
        {"phase": "Debrief", "minutes": 3, "script": [0], "title": "Scared together", "show": "question", "question": LAST_Q,
         "purpose": "Hear the poster’s second reason, and read a few hidden monsters aloud.",
         "students": ["Read your opening to a partner.", "What did your partner imagine?"]},
        {"phase": "Debrief", "minutes": 4, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK, "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": objectives_screen(OBJECTIVES)[0], "deeper": objectives_screen(OBJECTIVES)[1]}],
      "body": [f"Read the poster’s second reason: scary books *“bring us together.”* Pairs read their openings aloud; the listener says what they imagined the monster was.",
               "Then ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down. Exit ticket: *“Name one way to make a reader afraid of something they never see.”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**What the poster says, and doesn’t.** It names the books and their years but not their stories, and gives no book a theme. Let students who know a book say what its monster stands for; don’t assign one.",
        "**Choosing books.** Horror for teens varies widely. Preview any book before sharing it."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Timeline:** Frankenstein 1818, Jekyll and Hyde 1886, Dorian Gray 1890, Dracula 1897, Point Horror 1991, Red Eye today.",
        "**Two reasons:** a risk-free rehearsal for danger; scary books bring us together.",
        "**Gothic DNA:** isolation, transformation, and that you might *be* the monster.",
        "**Assess:** the monster stays unseen; there is one sensory clue."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Horror’s line",
      "body": ["Project or print this page for the timeline. Every book, writer and year is as poster 2 gives it."]}),
    ("table", {"head": CHART_SCREEN["columns"], "rows": [list(r) for r in TIMELINE]}),
    quote(GOLDEN_RULE, "Poster 2 · The Gothic Originals"),
    quote(GOTHIC_DNA, "Poster 2 · Red Eye: Horror for the Digital Generation"),
    ("section", {"label": "Questions to ask in front of the poster", "list": [
      "Why do you think people choose to read stories that are designed to scare them? Do you?",
      MONSTER_Q,
      HALL_Q,
      "What fears might a new scary story explore for your generation?"]}),
    ("connection", ["**Visit the exhibition:** poster 2, *Page Turners & Spine Tinglers*, and the case’s vintage collection of original Point Horror paperback editions, with their library cards. **Online:** poster 2’s walkthrough is on the exhibition site."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Poster 2 asks: *why do we willingly read stories designed to scare us?* Its answer: horror is a **risk-free rehearsal** for danger, and scary books bring us together. Its golden rule: **the real terror isn’t the creature, it’s what it represents.**"]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT, "css": CSS + QUOTE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "FL_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Put horror in order",
            "blocks": [("html", "<p>Number these from 1 (first) to 6 (newest).</p>"),
                       ("table", {"head": ["Order", "Book or series", "When"], "rows": [
                         ["", "“Dracula”, by Stoker", "1897"], ["", "“Frankenstein”, by Mary Shelley", "1818"],
                         ["", "The Point Horror series", "1991"], ["", "“Jekyll and Hyde”, by Robert Louis Stevenson", "1886"],
                         ["", "The Red Eye series", "today"], ["", "“Picture of Dorian Gray”, by Wilde", "1890"]]})]}),
  ("task", {"label": "Part 2", "title": "A risk-free rehearsal",
            "blocks": [quote(REHEARSAL, P2)],
            "body": ["What is a *risk-free rehearsal*? Explain it in your own words, as if to a younger reader."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "What does it stand for?",
            "blocks": [quote(GOLDEN_RULE, P2),
                       ("html", "<p>Pick two monsters you know from books, films or stories. What might each one stand for? The poster’s ideas may help.</p>"),
                       ("table", {"head": ["Monster", "What it might stand for"], "rows": [["", ""], ["", ""]]})]}),
  ("task", {"label": "Part 4", "title": "Hide the monster",
            "body": ["This sentence shows the monster straight away: *“A huge spider crawled out from under the bed.”*",
                     "Rewrite it so the reader only **hears**, **feels** or **glimpses** something. Don’t say what it is."], "lines": 7}),
  ("family", ["Ask your family: *what was the first scary story you remember?* Was the monster ever shown?"]),
], ".task h3, .task .label, .pq { break-after: avoid; } table.fill td { height: 26pt; } table.fill td:first-child { width: 14%; } .task:nth-of-type(3) table.fill td { height: 34pt; } .task:nth-of-type(3) table.fill td:first-child { width: 35%; }")

YELLOW = handout("yellow", "FL_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Two reasons",
            "blocks": [("html", "<p>Poster 2 gives two reasons we read horror. Find each one in the poster’s words, then test it against your own reading.</p>"),
                       quote(REHEARSAL, P2), quote(TOGETHER, P2),
                       ("table", {"head": ["The reason, in your words", "An example from your own reading or life"], "rows": [["", ""], ["", ""]]})],
            "body": ["Which reason convinces you more? Why?"], "lines": 3}),
  ("task", {"label": "Part 2", "title": "From castles to hallways",
            "blocks": [quote(HALLWAYS, P2)],
            "body": ["Why might a story set in a school hallway frighten teenage readers more than one set in a Gothic castle?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Your hallway opening",
            "body": [f"The poster asks: *“{HALL_Q}”* Write the opening paragraph of that story. Keep the monster hidden: use a sound, a shadow or a clue, and let your reader imagine the rest.",
                     "**Check:** ☐ one sense other than sight   ☐ one clue   ☐ the monster is never fully seen"], "lines": 9}),
  ("family", ["Read your opening to someone at home. Ask what they imagined the monster was."]),
], "table.fill td { height: 40pt; } table.fill td:first-child { width: 50%; }")

RED = handout("red", "FL_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Gothic DNA",
            "blocks": [quote(GOTHIC_DNA, P2),
                       ("table", {"head": ["Element", "What it means", "A story you know that uses it"], "rows": [
                         ["Isolation", "", ""], ["Transformation", "", ""], ["You might BE the monster", "", ""]]})]}),
  ("task", {"label": "Part 2", "title": "A monster for your generation",
            "blocks": [quote(GENERATIONS, P2)],
            "body": ["What fear does your generation face? Invent a monster that stands for it. Describe it, and explain the link, without saying it outright in the story."], "lines": 5}),
  ("task", {"label": "Part 3", "title": "Test the claim",
            "blocks": [quote(PENNY, P2)],
            "body": ["Does the penny dreadfuls’ popularity *prove* that horror taps into something innate? Give one reason it might, and one other reason cheap weekly serials might have sold well."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "The hidden monster",
            "body": ["Write an opening paragraph that uses one element of Gothic DNA and **never shows the monster**. Underline the sentence where your reader’s imagination has to do the work."], "lines": 7}),
  ("family", ["Ask your family which monster scared their generation. What do you think it stood for?"]),
], ".task h3, .task .label, .pq { break-after: avoid; } table.fill td { height: 46pt; } table.fill td:first-child { width: 26%; } table.fill td:nth-child(2) { width: 34%; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
