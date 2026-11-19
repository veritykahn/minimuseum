"""Grades 5–8 · Social Studies · "The War at Home"
The Second World War on the British home front, read through one family:
poster 1's "Women in wartime" panel and its note on the Imperial War Museum's
Women's Work Collection, poster 2's biography of Violet Dina Want, the Violet's
Life room's museum note on the first V-1, and the display case's one object,
the family's bomb-damaged letters. Every fact is the exhibition's
(womensHistory.ts, violet/violetLife.ts). The letters are not transcribed,
so no words of theirs appear. The plan names her mother's death plainly, in
the poster's words, and leaves out the details that follow it."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (PHOTOS, POSTER2, BIO, LETTERS_RECORD, OBJ_CSS, PIC_CSS, THUMBS, TIMING, SOUNDS,
                     review, photos, ph, md, quote, record)

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "The War at Home"
SUB = "Grades 5–8 · Social Studies · One family on the home front"
HERO = {"img": POSTER2, "pos": "center 62%"}

# poster 1's "Women in wartime" panel and its note, word for word
WARTIME = ("In the Second World War, British men aged 18 to 41 were needed in the navy and army, which took them away from their jobs. "
           "To fill the shortage, women were recruited for jobs previously done by men. Women worked in the factories, constructing weapons, "
           "and many others joined the Land Army to work on farms.")
IWM = ("The Imperial War Museum began collecting the story of women’s war work in 1917, the same year the museum itself was founded. "
       "Volunteers gathered most of the Women’s Work Collection between 1917 and 1920.")
# poster 2, the Blitz paragraph's first sentence; and the room's museum note
SCATTERED = ("Before World War II, Violet’s extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz "
             "destroyed their homes, scattering them across the South of England.")
DOODLEBUG = ("When a V-1 ‘doodlebug’ bomb, a bomb designed by the Nazis to terrorize the British civilian population and lower morale, "
             "exploded nearby, it shattered all the windows in Violet’s home and collapsed her mother’s house, killing her instantly along with a family dog.")
V1_NOTE = "The first V-1 to hit London fell on June 13, 1944."
TALK = "Many women in wartime did jobs that people had said only men could do. What jobs or roles do people still sometimes say are “for boys” or “for girls,” and what do you think about that?"
HOOK_Q = "This is the one object in the exhibition’s display case. What could these letters tell a historian? What could they never tell?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe how the Second World War changed the work women did in Britain",
     "describe how the war changed women’s work in Britain?", False),
    ("tell a primary source from a secondary source, and say what each can show",
     "tell a primary source from a secondary one, and say what each can show?", False),
    ("use one family’s story to explain how the war reached ordinary homes",
     "use Violet’s story to explain how the war reached ordinary homes?", False),
    ("judge what a museum or archive chooses to keep, and whose history that saves",
     "judge what an archive chooses to keep, and whose history that saves?", True)],
  "why": "Much of a war happens to people who never appear in a textbook. Reading their letters, photographs and family stories, and asking what is missing, is how historians find them."}

SOURCES = [("The bomb-damaged family letters", "Kept in Violet’s estate; damaged in the Blitz bombing", "Primary"),
           ("The four family photographs", "Taken in Violet’s lifetime", "Primary"),
           ("Poster 2’s biography of Violet", "Written down by her family later, “so it would not be lost”", "Secondary"),
           ("Poster 1’s “Women in wartime” panel", "The museum’s summary, drawn from The National Archives (UK)", "Secondary")]
SOURCES_SCREEN = {"caption": "Four sources in this exhibition", "columns": ["Source", "Where it comes from", "Kind"],
                  "rows": [{"cells": list(r)} for r in SOURCES]}

CSS = PIC_CSS + """
.src { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 9.4pt; }
.src th { font: 500 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; text-align: left; border-bottom: 1pt solid #1d1c1a; padding: 0 6pt 3pt 0; }
.src td { border-bottom: .6pt solid #9a978c; padding: 5pt 6pt 5pt 0; vertical-align: top; }
.panel { background: rgba(255,255,255,.62); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 8pt 11pt 4pt; margin: 4pt 0 9pt; font-size: 9.6pt; line-height: 1.42; break-inside: avoid; }
.panel .label { margin-bottom: 3pt; }
.panel p { margin: 0 0 5pt; }
.q { margin: 0 0 6pt; } .q i { display: inline-block; width: 80pt; border-bottom: 1pt solid #1d1c1a; height: 12pt; vertical-align: -2pt; }
"""

def panel(label, paras):
    return ('<div class="panel"><p class="label">' + md(label) + '</p>' + "".join(f"<p>{md(p)}</p>" for p in paras) + '</div>')

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "the-war-at-home",
  "out": DIR + "WH_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO,
  "css": CSS + OBJ_CSS + "table.fill td { padding: 4pt 6pt 5pt 0; }",
  "blocks": [
    ("timing", [("Hook", 5, TIMING["hook"]), ("Teach", 12, TIMING["teach"]), ("Activity", 23, TIMING["activity"]), ("Close", 5, TIMING["close"])]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students learn how the Second World War changed women’s work in Britain, then follow the war into the home of Violet Dina Want, a London machinist and mother of four. They sort the exhibition’s sources into primary and secondary, reason from a museum note to the earliest date an event could have happened, and ask what a museum chooses to keep."]}),
    ("cols", [
      [("section", {"label": "Standards and themes", "list": [
        "**History** — the home front in the Second World War; continuity and change in women’s work",
        "**Sources** — primary and secondary; what a source can and cannot show; corroboration",
        "**Chronology** — reasoning from a dated fact to an earliest possible date"
        ]})],
      [("section", {"label": "Materials needed", "list": [
        "Poster 1’s *Women in wartime* panel and poster 2, on a screen, or page 3 of this plan",
        "Speakers for two short sounds (optional)",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Letters nobody can read",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0], "title": "One object", "show": "words", "text": LETTERS_RECORD,
         "cite": "The Mini Museum record · the display case",
         "purpose": "Begin with an object, not an explanation: let students wonder what a damaged letter can tell.",
         "students": ["What could these letters tell a historian?", "What could they never tell?"]},
        {"phase": "Hook", "minutes": 2, "script": [1], "title": "Two sounds", "show": "listen",
         "clips": [SOUNDS["factory-whistle"], SOUNDS["air-raid-siren"]],
         "question": "Two sounds from the posters. Where might you have heard each one, in wartime Britain?",
         "purpose": "Set the two halves of the lesson: women’s work, and the war reaching home.",
         "students": ["Listen to each. Where are we?"]}],
      "body": [f"Show the record of the display case’s one object: *“{LETTERS_RECORD}.”* The letters are not transcribed, so nobody visiting the exhibition can read them. Ask: *“{HOOK_Q}”* Keep the answers on the board.",
               "Play the posters’ factory whistle and air-raid siren (optional). *“Today we follow the war into factories, farms and one family’s home.”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "The work, the home, the sources",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Women in wartime", "show": "words", "text": WARTIME,
         "cite": "Poster 1 · Women in wartime",
         "purpose": "Learn what changed for women’s work, and why.",
         "students": ["Why were women recruited?", "Which two kinds of work does the panel name?"]},
        {"phase": "Teach", "minutes": 5, "script": [1, 2], "title": "The war reaches home", "show": "words", "text": SCATTERED,
         "cite": "Poster 2 · Biography of a Working Class Woman",
         "purpose": "See the war as one family lived it.",
         "students": ["What did the bombing do to Violet’s family?", "What else would you want to know?"]},
        {"phase": "Teach", "minutes": 3, "script": [3], "title": "Primary or secondary?", "show": "chart", **SOURCES_SCREEN,
         "purpose": "Sort the exhibition’s own sources, and see that each kind shows something different.",
         "students": ["Which of these was made at the time?", "Which tells the most? Which can we trust most?"]}],
      "body": [
        "**The work.** Read poster 1’s *Women in wartime* panel aloud (page 3): men aged 18 to 41 went to the navy and army, and women took their jobs, in weapons factories and in the Land Army on farms. Add its note: the Imperial War Museum began collecting women’s war work in 1917, the year it was founded.",
        "**The home.** Turn to poster 2. Violet, born in London in 1907, left school at 14 to work as a piecework machinist, married in 1928, and had four children, born between 1929 and 1942. Read its lines on the Blitz: the bombing destroyed the family’s homes and scattered them across the South of England.",
        "Then tell the next sentence of the poster plainly: a V-1 “doodlebug” bomb exploded nearby, shattering every window in Violet’s home, and her mother was killed when her house collapsed. Give the room’s museum note: *" + V1_NOTE + "* Ask what that lets us work out. Note what the poster does **not** say: what work, if any, Violet did in the war.",
        "**The sources.** A **primary** source was made at the time, by people who were there; a **secondary** source tells about the past afterwards. Violet’s biography was written down by her family later. Ask: which kind shows what people *felt*, and which what *happened next*?"]}),
    ("section", {"label": "Activity · 23 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the panel, the biography and the sources at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the war through women’s work and Violet’s home."]},
      "body": ["Students choose a handout. All three read the same panel, the same lines of Violet’s biography and the same four sources."]}),
    ("levels", {
      "green": "Read the *Women in wartime* panel and fill in what changed, sort four sources as primary or secondary, and explain one way the war reached Violet’s home.",
      "yellow": "Compare what the panel shows about all women with what Violet’s story shows about one, reason from the V-1 note to the earliest date her home could have been hit, and read the letters’ record as a historian.",
      "red": "Ask why a museum collected women’s war work so soon, decide which claims in Violet’s biography could be checked and how, and write a museum label for the letters using only what is known."}),
    ("section", {"label": "Look back · 5 minutes", "title": "For boys, for girls",
      "screen": [
        review(OBJECTIVES, 3, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "For boys, for girls", "show": "question", "question": TALK,
         "purpose": "Carry the panel’s change into students’ own time.",
         "students": ["Tell a partner one example, and what you think."]}],
      "body": ["Ask the objectives back: *“Can you now…?”* Students show a thumb up, sideways or down; ask one student to answer each aloud, and a Red Level student the last.",
               f"Close with poster 1’s own question: *“{TALK}”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Before class.** Poster 2 and the *Violet’s Life* Blitz stop go on to tell how Violet’s mother was identified, and what happened to a family puppy. This plan stops at the sentence about her mother’s death. Read the stop before you show it; some students may have lost family to war. The exhibition gives no dates for the Blitz and no words from the letters: let the gaps be part of the lesson."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Green:** men 18 to 41 went to the navy and army; women took their jobs in factories (making weapons) and on farms (the Land Army). Letters and photographs are primary; the biography and the panel are secondary.",
        "**Yellow:** not before June 13, 1944, the first V-1 on London; Violet (born January 27, 1907) was at least 37.",
        "**Red:** collecting soon keeps what later memory loses; a strong label says only what is known."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Women in wartime, and one home",
      "body": ["Poster 1’s panel, poster 2’s lines on the Blitz, and the family photographs. The letters in the display case are shown in an archival glass case and are not transcribed."]}),
    ("html", quote(WARTIME + " " + IWM, "Poster 1 · Women in wartime")),
    ("html", quote(SCATTERED, "Poster 2 · Biography of a Working Class Woman")),
    ("html", quote(V1_NOTE, "Violet’s Life · a museum note (Imperial War Museums)")),
    ("html", record()),
    ("html", photos(["violet", "promenade", "family", "four"], 104)),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Poster 1 says women did jobs “previously done by men.” Which jobs? What might have happened to those jobs after the war?",
      "Why might a family keep letters that a bomb had damaged?",
      "The biography was written down by Violet’s family. What might a family remember that an archive would not, and the other way round?",
      "Whose wartime stories would be missing if nobody had collected them at the time?"]}),
    ("connection", ["**In the exhibition,** poster 1’s *Women in wartime* panel links to the Imperial War Museum’s Women’s Work Collection; the *Violet’s Life* room tells her story stop by stop. **In the display case,** the family’s bomb-damaged letters."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In the Second World War, many British men went to fight, and women took on their jobs. The war also came to people’s homes. Violet Dina Want, born in London in 1907, was a factory machinist and a mother of four. Her family wrote her story down so it would not be lost, and kept letters that were damaged in the bombing."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Handout · Grades 5–8 Social Studies · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Women in wartime",
            "blocks": [("html", panel("From poster 1", [WARTIME]) + "<p>Fill in the table from the panel.</p>")]}),
  ("table", {"head": ["Question", "Answer"], "rows": [
      ["Which men were needed in the navy and army?", ""],
      ["What did that leave behind?", ""],
      ["Name two kinds of work women did.", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Primary or secondary?",
            "blocks": [("html", "<p>A <b>primary source</b> was made at the time, by people who were there. A <b>secondary source</b> tells about the past later. Write <b>P</b> or <b>S</b> for each.</p>")]}),
  ("table", {"head": ["Source", "P or S"], "rows": [
      ["Family letters, damaged in the bombing of the Blitz", ""],
      ["A photograph of Violet’s family outside a house", ""],
      ["A biography of Violet, written down by her family later", ""],
      ["A museum’s poster about women’s work in the war", ""]]}),
  ("task", {"label": "Part 3", "title": "The war reaches home",
            "blocks": [("html", panel("From poster 2", [SCATTERED]))],
            "body": ["Explain **one** way the war changed life for Violet’s family. Use words from the poster."], "lines": 3}),
  ("task", {"label": "Part 4", "title": "A question for the letters",
            "body": ["The letters in the display case have not been typed out, so we can’t read them. If you could read one, what would you most want to find out?"], "lines": 3}),
  ("family", ["Does anyone in your family keep old letters, cards or photographs? Ask who made them, and when."]),
], "table.fill td:first-child { width: 44%; } table.fill td { padding-top: 7pt; padding-bottom: 38pt; } .pb + .task table.fill td, .pb ~ table.fill td { padding-bottom: 12pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "All women, and one woman",
            "blocks": [("html", panel("Poster 1 · Women in wartime", [WARTIME]) + panel("Poster 2 · Violet’s family", [SCATTERED]))],
            "body": ["The first source tells about **many** women; the second about **one** family. What does each show that the other can’t?"]}),
  ("table", {"head": ["", "The panel (many women)", "Violet’s biography (one family)"], "rows": [
      ["What does it show?", "", ""], ["What does it leave out?", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Work out the date",
            "blocks": [("html", "<p>Poster 2 says a V-1 “doodlebug” bomb exploded near Violet’s home, shattering its windows. It gives no date. The <i>Violet’s Life</i> room adds a museum note:</p>"
                        + quote(V1_NOTE, "Imperial War Museums, in Violet’s Life")
                        + '<p class="q"><b>a.</b> What is the earliest date the doodlebug near Violet’s home could have fallen? <i></i></p>'
                        + '<p class="q"><b>b.</b> Violet was born on January 27, 1907. How old was she, at least, when it fell? <i></i></p>'
                        + "<p><b>c.</b> Why can’t we give the exact date from these two sources?</p>")], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Read the record",
            "blocks": [("html", record())]}),
  ("table", {"head": ["What we know from the record", "What we can’t know yet", "A question I would ask"], "rows": [["", "", ""]]}),
  ("task", {"label": "Part 4", "title": "Explain",
            "body": ["Using Violet’s story, explain how the war reached ordinary homes, not only battlefields."], "lines": 4}),
  ("family", ["Ask an older person in your family: what is the oldest letter, card or photograph our family has? Who made it?"]),
], "table.fill td:first-child { width: 26%; font-weight: 500; } table.fill td { padding-top: 6pt; padding-bottom: 34pt; }")

RED = handout("red", "WH_Handout_Red_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Collecting it soon",
            "blocks": [("html", panel("Poster 1 · Women in wartime", [WARTIME, IWM]))],
            "body": ["The museum began collecting women’s war work in 1917, the year it was founded, and volunteers gathered most of it within three years. Why might it matter to collect ordinary people’s stories **soon after** they happen, rather than many years later? Whose history might be lost if nobody did?"], "lines": 6}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Could we check it?",
            "body": ["Each claim is from poster 2, written down by Violet’s family. For each, say what **kind of source** could confirm it, and whether that source could exist."]}),
  ("table", {"head": ["Claim in the biography", "A source that could confirm it"], "rows": [
      ["In 1928, at the age of 21, she married Harold Henry Robert Want.", ""],
      ["The heavy bombing during the Blitz destroyed their homes, scattering them across the South of England.", ""],
      ["She had chosen him because he made her laugh.", ""]]}),
  ("task", {"label": "Part 3", "title": "Write the label",
            "blocks": [("html", record() + "<p>Museums write a short label beside every object. Write the label for these letters in 60 words or fewer. Use <b>only</b> what the record and poster 2 tell us, and say honestly what is not known.</p>")],
            "lines": 4}),
  ("task", {"label": "Part 4", "title": "The historian’s judgment",
            "body": ["A history book about the Second World War and Violet’s family letters tell the past in different ways. Which would you trust more to show what the war **felt like** at home? Explain."], "lines": 2}),
  ("family", ["Ask an older person in your family: what happened to our family in a time of war or hardship? Who kept the story?"]),
], "table.fill td:first-child { width: 50%; } table.fill td { padding-top: 6pt; padding-bottom: 18pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
