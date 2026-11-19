"""Grades 5–8 · Social Studies · "Who Really Built the Pyramids?"
Poster 1's chapter on the pyramid builders, read as a historian reads it:
a common belief tested against kinds of evidence (a workers' town and tombs,
an inspector's diary on papyrus, what we know of the architect and his
crews), set in the Nile's year, with a tomb wall from a later age that shows
how Egyptian officials organized and recorded work. Facts follow
app/exhibitions/egypt/egypt.ts (poster 1's text, fun tidbits and talk
questions) and tomb/scenes.ts (the harvest wall in Menna's tomb: its
details, note and The Met's record).

Dates: the exhibition gives none for Khufu. It does say that the Great
Pyramid was the tallest structure on Earth for nearly 4,000 years, until
1311; the Red Level works out a rough date from that, and says it is rough."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (WALLS, OBJ_CSS, HOOK, TEACH, ACT, CLOSE, wall_hero, wall_crop, review, look_back_say, md)

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Who Really Built the Pyramids?"
SUB = "Grades 5–8 · Social Studies · Testing a belief against the evidence"
H = WALLS["harvest"]
HERO = wall_hero("harvest", "center 30%")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe how the Nile shaped Egypt: the black land and the red land, and a year of three seasons",
     "describe how the Nile shaped Egypt’s land and year?", False),
    ("use evidence from archaeology and written records to explain who built the pyramids",
     "explain who built the pyramids, with evidence?", False),
    ("tell apart kinds of sources, and say what each can and cannot show",
     "say what each kind of source can and cannot show?", False),
    ("judge how far a source from a later time can support a claim about an earlier one",
     "judge how far a later source can support a claim?", True)],
  "why": "Many people still repeat that slaves built the pyramids. Historians do not settle a question by repeating it: they look for evidence, ask what kind it is, and say how far it reaches. That habit protects us from easy answers about any past."}

# the sources students weigh (poster 1; tomb/scenes.ts)
SOURCES = [
  ("A town and tombs", "Archaeology",
   "Archaeologists have uncovered the town and tombs of the pyramid builders. They estimate that the workforce was made up of 20,000 to 30,000 Egyptians."),
  ("Merer’s diary", "A written record of the time",
   "Merer, an inspector, kept a diary on papyrus. It was found preserved in caves at Wadi el-Jarf, on the Red Sea coast, in 2013, and it tells how the pyramids of Giza were supplied with materials."),
  ("Hemiunu and his crews", "What historians have pieced together",
   "Khufu’s architect, Hemiunu, led an army of artisans, sculptors, masons and metalworkers. Many of them lived in a settlement built especially for them. Inspectors like Merer kept the project supplied with food and drink rations, tools, clothes, medical treatments and building materials."),
  ("The harvest wall", "A tomb painting from a later time",
   "In the tomb of Menna, painted about 1396–1347 BCE, surveyors measure a field of grain with a knotted rope and scribes write down the harvest. Menna was in charge of the government’s lands.")]

def rope(width):    return wall_crop("harvest", 100, 170, 560, 230, width)
def scribes(width): return wall_crop("harvest", 900, 380, 480, 360, width)
def whole(width):   return wall_crop("harvest", 0, 0, 1800, 757, width)

CSS = OBJ_CSS + """
.pb { break-after: auto; break-before: page; height: 0; margin: 0; }
.src { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 10pt; margin: 4pt 0 8pt; }
.src div { border: .8pt solid #8d8a80; border-radius: 4pt; padding: 5pt 8pt; background: rgba(255,255,255,.6); break-inside: avoid; }
.src b { display: block; font: 600 10.5pt 'Cormorant Garamond', serif; } .src i { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); font-style: normal; margin-bottom: 2pt; }
.src p { font-size: 8.5pt; line-height: 1.32; margin: 0; }
.pics { display: flex; gap: 10pt; justify-content: center; margin: 4pt 0 8pt; break-inside: avoid; }
.pics figure { margin: 0; } .pics figcaption { font-size: 8pt; text-align: center; margin-top: 2pt; }
.seasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 8pt; }
.seasons div { border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 5pt 7pt; background: rgba(255,255,255,.6); font-size: 9pt; }
.seasons b { font: 600 12pt 'Cormorant Garamond', serif; display: block; }
.kinds { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 14pt; margin: 2pt 0 4pt; font-size: 9.5pt; }
.kinds div { display: flex; align-items: center; gap: 8pt; }
.kinds span { flex: none; width: 22pt; height: 20pt; border: 1pt solid #1d1c1a; border-radius: 3pt; background: #fff; }
.frame p { margin: 0 0 9pt; font-size: 10pt; line-height: 2.1; }
table.fill td { height: 40pt; }
"""

def sources_html(which=range(4), kinds=True):
    out = ""
    for i in which:
        t, kind, text = SOURCES[i]
        out += f'<div><i>Source {"ABCD"[i]}{" · " + kind if kinds else ""}</i><b>{t}</b><p>{md(text)}</p></div>'
    return f'<div class="src">{out}</div>'

def P(t):
    return ("html", f"<p>{md(t)}</p>")

def pics(width=210):
    return ("html", f'<div class="pics"><figure>{rope(width)}<figcaption>Surveyors with a knotted rope</figcaption></figure>'
                    f'<figure>{scribes(width * 0.8)}<figcaption>Scribes write down the harvest</figcaption></figure></div>')

# ── lesson mode ────────────────────────────────────────────────────────
SEASONS = {"caption": "Kemet, the black land: a year of three seasons", "columns": ["Season", "What happened"],
           "rows": [{"cells": ["Akhet", "The Nile flooded"]}, {"cells": ["Peret", "The growing season"]},
                    {"cells": ["Shemu", "The harvest"]}]}
EVIDENCE = {"caption": "The evidence", "columns": ["Source", "Kind of source", "What it tells us"],
            "rows": [{"cells": ["A town and tombs", "Archaeology", "Where the builders lived and were buried"]},
                     {"cells": ["Merer’s diary", "A written record of the time", "How the pyramids of Giza were supplied"]},
                     {"cells": ["Hemiunu and his crews", "Historians’ account", "Who led the work, and how it was supplied"]},
                     {"cells": ["The harvest wall", "A later tomb painting", "How officials measured and recorded work"]}]}
WALL_ART = {"work": H["title"], "artist": "Charles K. Wilkinson, a copy of a painting in the tomb of Menna, Thebes",
            "date": "about 1396–1347 BCE", "img": {"img": H["img"], "pos": "center 30%", "credit": H["credit"]},
            "alt": "A tomb painting in two rows: above, men walk through a field of ripe grain holding a long rope; below, a horse and chariot wait while workers heap grain and scribes sit writing"}

LESSON = {
  "slug": "who-built-the-pyramids",
  "out": DIR + "EGY_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Activity", 20, ACT), ("Debrief", 7, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will test a common belief, that slaves built the pyramids, against the evidence in the exhibition’s first poster: the builders’ town and tombs, the diary of an inspector named Merer, and what is known of the architect Hemiunu and his crews. Setting it in the Nile’s year, they will sort sources by kind, say what each can and cannot show, and weigh a tomb painting from a later age."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Historical thinking** — classifying sources; their limits; building an argument from evidence",
        "**Geography** — the Nile, Kemet and Deshret; a year set by the flood",
        "**Economics and civics** — rations, supplies and records: how a state organized work",
        "**Chronology** — BCE and CE; a rough date from a given span"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the four sources and the harvest wall",
      "Sticky notes or scrap paper for the hook; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "What have you heard?",
      "screen": {"phase": "Hook", "show": "question", "question": "Who built the pyramids? Write what you have heard, and where you heard it.",
                 "purpose": "Surface what students already believe, and where the belief came from.",
                 "students": ["Write your answer on a note.", "Then write where you heard it: a film, a book, a person?"]},
      "body": ["Before showing anything, ask students to write on a note who built the pyramids, and **where they heard it**. Collect a few answers aloud. Many will say slaves. Do not correct anyone yet: *“Today we test that answer the way a historian would: what is the evidence, and what kind of evidence is it?”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "A river, a workforce and a wall",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "The black land and the red land", "show": "chart", **SEASONS,
         "purpose": "Set the scene: a land made by the Nile, and a year made by its flood.",
         "students": ["Why call your own country “the black land”?", "What would a farmer do in each season?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "The builders", "show": "chart", **EVIDENCE,
         "purpose": "Meet the evidence, and name what kind of source each one is.",
         "students": ["Which of these was written at the time?", "Which was dug out of the ground?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "A wall that keeps records", "show": "artwork", **WALL_ART,
         "purpose": "See Egyptian officials at work, and ask what a later painting can prove.",
         "students": ["Find the knotted rope. Find the scribe counting on his fingers.", "Can this wall tell us who built the pyramids?"]}],
      "body": ["The civilization of ancient Egypt lasted for over three thousand years, in northeastern Africa along the Nile. Egyptians called their country **Kemet**, “the black land”, after the dark, fertile soil left by the floods; the desert beyond was **Deshret**, “the red land”. Their year had three seasons: **Akhet**, when the Nile flooded; **Peret**, the growing season; and **Shemu**, the harvest. Nilometers measured how high the river rose each year.",
               "Now the evidence (page 3). Contrary to popular belief, the pyramids were not built by slaves. Archaeologists have uncovered the **town and tombs** of the builders and estimate a workforce of 20,000 to 30,000 Egyptians. Khufu’s architect, **Hemiunu**, led artisans, sculptors, masons and metalworkers, many living in a settlement built for them. Inspectors like **Merer** supplied rations, tools, clothes, medical treatments and materials, and Merer’s **diary** on papyrus, found at Wadi el-Jarf in 2013, tells how the pyramids of Giza were supplied.",
               "Show the harvest wall from Menna’s tomb, painted about 1396–1347 BCE. Menna was in charge of the government’s lands: surveyors measure the grain with a knotted rope, and scribes write down the harvest. Ask: *“This shows officials organizing and recording work. Can it tell us who built the pyramids?”* Leave the question open for the activity."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Weigh the evidence",
                 "purpose": "Sort and weigh the sources, then make a claim from them, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red.", "All three work from the same four sources and end with a claim."]},
      "body": ["Students choose a handout. All three work from the same four sources and end with a claim backed by evidence."]}),
    ("levels", {
      "green": "Match each source to its kind, sort the Nile’s three seasons, look closely at two pieces of the harvest wall, finish a claim from sentence starters, and ask one question the sources leave open.",
      "yellow": "Complete an evidence chart for the four sources, explain what the harvest wall can and cannot show, and write a claim, evidence and reasoning paragraph.",
      "red": "Work out a rough date for the Great Pyramid from poster 1, compare it with the harvest wall, rate each source’s reach, and write an argument that answers the slave myth and names a limit of the evidence."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What would you tell someone who believes the myth?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Teamwork", "show": "question",
         "question": "Building a pyramid took thousands of people working together. What is the biggest thing you have ever made or done with other people?",
         "purpose": "Return to the hook with evidence, then connect the builders’ teamwork to students’ own.",
         "students": ["Look at your note from the start. Would you change it? Why?", "What made the teamwork easy or hard?"]},
        review(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Students reread their notes from the hook. Ask two or three to say whether they would change their answer, and which source changed it. Red Level students give one limit of the evidence. Close with poster 1’s question: *“What is the biggest thing you have ever made or done with other people, and what made the teamwork easy or hard?”*",
               look_back_say(OBJECTIVES)]}),
    ("cols", [[("section", {"label": "Answer notes and assessment", "list": [
      "**Kinds:** A archaeology; B a written record of the time; C historians’ account; D a later painting.",
      "**The harvest wall** shows how officials measured and recorded work. It is not evidence about the pyramid builders themselves.",
      "**Red date:** nearly 4,000 years before 1311 points to roughly 2700 BCE, about 1,300 years before Menna’s wall. It is an estimate: the poster gives no exact year.",
      "**Exit ticket:** *who built the pyramids, and what is your strongest piece of evidence?*"]})],
              [("connection", ["**Poster 1**, *The Mysteries of Ancient Egypt*: read the chapter *Who really built the pyramids?* and its fun tidbits, from Merer’s diary to the tiny ivory statue of Khufu, just 7.5 centimetres (3 inches) tall.",
                               "**Virtual visit:** in *Tomb Explorer*, choose *The harvest* and find the chariot, the measuring rope and the scribes with the torch."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four sources", "body": ["Project or print this page for the teaching and the activity."]}),
    ("html", sources_html()),
    ("html", '<div class="pics">' + whole(470) + "</div>"),
    ("section", {"label": "Historical framework", "title": "Reading the evidence",
      "body": [
        "**Kinds of evidence.** A town and its tombs show where people lived, worked and were buried. A diary from the time shows what one person did and saw. An account like the poster’s draws many sources together. Each answers different questions.",
        "**Later evidence.** Menna’s wall was painted long after the pyramids of Giza. It shows how Egyptian officials organized land and labor in its own day. It can suggest how such work was run; it cannot prove who built the pyramids."]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Many people have heard that slaves built the pyramids. The exhibition’s first poster says otherwise. A historian does not take either answer on trust: they ask *what is the evidence, and what kind of evidence is it?* Here are four sources. Weigh them, then make your own claim."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": CSS + css}

GREEN = handout("green", "EGY_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Read the four sources", "blocks": [("html", sources_html(kinds=False))]}),
  ("task", {"label": "Part 2", "title": "What kind of source is each one?", "blocks": [
            P("Write the letter of the source (A, B, C or D) in the box beside its kind."),
            ("html", '<div class="kinds">' + "".join(f"<div><span></span>{k}</div>" for k in [
              "Something archaeologists dug up", "A diary written at the time",
              "What historians have pieced together from many sources", "A painting from a later time"]) + "</div>")]}),
  ("task", {"label": "Part 3", "title": "The Nile’s year", "blocks": [
            P("Egypt’s year had three seasons. Write each one under what happened: *Akhet, Peret, Shemu*."),
            ("html", '<div class="seasons"><div><b>&nbsp;</b>The Nile flooded</div><div><b>&nbsp;</b>The growing season</div><div><b>&nbsp;</b>The harvest</div></div>')]}),
  ("task", {"label": "Part 4", "title": "Look closely at the harvest wall", "blocks": [
            pics(200), P("What are these people doing? Why would officials want to measure and write things down?")], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Make your claim", "blocks": [("html", '<div class="frame">'
            "<p>The pyramids were built by ________________________________________________.</p>"
            "<p>One piece of evidence is ______________________________________________________.</p>"
            "<p>This shows that ______________________________________________________________.</p></div>")]}),
  ("task", {"label": "Part 6", "title": "What do the sources not tell you? Write one question you would still like to answer.", "lines": 2}),
], "table.fill td { height: 24pt; } table.fill td:first-child { width: 70%; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "The four sources", "blocks": [("html", sources_html(kinds=False))]}),
  ("task", {"label": "Part 2", "title": "Evidence chart", "blocks": [
            ("table", {"head": ["Source", "Kind of source", "What it tells us about the builders"], "rows": [
              ["A · Town and tombs", "", ""], ["B · Merer’s diary", "", ""], ["C · Hemiunu and his crews", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "A later wall", "blocks": [
            pics(190),
            P("Source D was painted about 1396–1347 BCE, in Menna’s tomb. What does it show about how Egyptian officials organized work? Why can it not prove who built the pyramids?")], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Claim, evidence, reasoning", "blocks": [
            P("Who built the pyramids? Write a paragraph: your **claim**, two pieces of **evidence** from different sources, and your **reasoning**: how the evidence supports the claim.")], "lines": 7}),
], "table.fill td:first-child { width: 28%; } table.fill td:nth-child(2) { width: 24%; } table.fill td { height: 34pt; }")

RED = handout("red", "EGY_Handout_Red_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "The four sources", "blocks": [("html", sources_html())]}),
  ("task", {"label": "Part 2", "title": "How far apart?", "blocks": [
            P("Poster 1: the Great Pyramid of Khufu *“was the tallest structure on Earth for nearly 4,000 years, until the spire of Lincoln Cathedral in England passed it in 1311.”* Roughly when was it built, and how many years before Source D? Why can your answer only be rough?")], "lines": 3}),
  ("task", {"label": "Part 3", "title": "How far does each source reach?", "blocks": [
            ("table", {"head": ["Source", "What it can show", "What it cannot show"], "rows": [
              ["A · Town and tombs", "", ""], ["B · Merer’s diary", "", ""], ["C · Hemiunu and his crews", "", ""], ["D · The harvest wall", "", ""]]})]}),
  ("task", {"label": "Part 4", "title": "Answer the myth", "blocks": [
            P("Someone tells you that slaves built the pyramids. Write a short argument in reply. Use at least three sources, and name one limit of the evidence honestly.")], "lines": 6}),
  ("task", {"label": "Part 5", "title": "What next?", "blocks": [
            P("If you could find one more piece of evidence about the pyramid builders, what would it be, and what question would it answer?")], "lines": 2}),
], "table.fill td:first-child { width: 24%; } table.fill td { height: 34pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
