"""Grades 1–2 · "What Came Home"
The two objects in the display case, the M1917 Brodie helmet and the US
Army issue shaving kit, read as clues: who the doughboys were, what they
carried, and what came home with them. Told for this age: no battlefield
detail. Facts follow the case's museum cards and poster 1 in
app/exhibitions/great-war/greatWar.ts, and poster 2 for Veterans Day."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-1-2/"
TITLE = "What Came Home"
SUB = "Grades 1–2 · The display case · A helmet, a razor and the doughboys"
HERO = {"img": FACES, "pos": "center 40%"}

HOOK_Q = "What is it? Who do you think used it?"
WHO = ("They were farmers from Iowa, factory workers from Pittsburgh, teenagers from small Texas towns…")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe the helmet and the shaving kit in the display case, and say what each was for",
     "say what the helmet and the shaving kit were for?", False),
    ("say who the doughboys were, and one idea about where their nickname comes from",
     "say who the doughboys were?", False),
    ("name two ways we remember them: a red poppy and a quiet time on Veterans Day",
     "name two ways we remember them?", False),
    ("use a clue on an object to tell what happened to it after the war",
     "use a clue to tell an object’s story?", True)],
  "why": "Ordinary things tell big stories. A helmet and a razor show us real young men who went far from home, and what came home with them."}

# the two objects, for the plan's last page and the screen
HELMET_CARD = {"img": disk(HELMET), "label": "Display case", "title": "M1917 Brodie doughboy helmet",
  "facts": [("Made of", "Steel, pressed from one piece"), ("Nickname", "The “tin hat”"), ("On its side", "The American Legion emblem")],
  "body": ["The wide brim shielded a soldier’s head and shoulders. Sand, sawdust or crushed cork was mixed into the paint so the helmet would not catch the light. The emblem is the American Legion’s: soldiers who came home started the Legion in 1919, as veterans."]}
KIT_CARD = {"img": disk(KIT), "label": "Display case", "title": "US Army issue shaving kit",
  "facts": [("Given to", "American soldiers"), ("Inside", "A safety razor and blades"), ("Made by", "Gillette won the Army’s contract")],
  "body": ["The Army gave its soldiers shaving kits. Gillette delivered 3.5 million razors and 32 million blades. Soldiers were allowed to keep their razors when they came home, and they kept shaving with them."]}

GALLERY = [
  {"label": "The helmet", "text": "Steel, with a wide brim, to keep a soldier’s head safe. Soldiers called it their “tin hat.”",
   "items": [{"img": HELMET, "caption": "M1917 Brodie helmet", "sub": "With the American Legion emblem", "alt": ALT_HELMET, "aspect": 1}]},
  {"label": "The shaving kit", "text": "Every soldier was given one. When the war ended, they kept their razors.",
   "items": [{"img": KIT, "caption": "US Army issue shaving kit", "sub": "A safety razor and blades", "alt": ALT_KIT, "aspect": 1}]}]

CSS = """
.objs { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; margin: 4pt 0 8pt; break-inside: avoid; }
.objs figure { margin: 0; text-align: center; background: rgba(255,255,255,.72); border: 1pt solid #1d1c1a; border-radius: 6pt; padding: 4pt; }
.objs figcaption { font: 500 9pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; margin-top: 2pt; }
.matchup { display: grid; grid-template-columns: 120pt 1fr 210pt; gap: 8pt 10pt; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.matchup img { width: 120pt; height: 92pt; object-fit: contain; background: rgba(255,255,255,.72); border: 1pt solid #1d1c1a; border-radius: 6pt; }
.matchup .dot { justify-self: start; width: 12pt; height: 12pt; border-radius: 50%; background: #1d1c1a; }
.matchup .dot.r { justify-self: end; }
.matchup p { margin: 0; padding: 8pt 10pt; border: 1pt solid #1d1c1a; border-radius: 6pt; background: rgba(255,255,255,.6); font-size: 12pt; }
.choose { margin: 2pt 0 8pt; }
.choose p { margin: 0 0 7pt; }
.choose span { display: inline-block; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 1pt 11pt; margin: 0 3pt; background: rgba(255,255,255,.6); }
.bank { font: 500 10pt 'Outfit'; letter-spacing: .1em; border: 1pt dashed #1d1c1a; padding: 5pt 10pt; display: inline-block; margin: 0 0 6pt; background: rgba(255,255,255,.5); }
.bigpoppy { display: flex; justify-content: center; margin: 0 0 4pt; }
"""

def objs(names=True, h=130):
    cap = lambda t: f"<figcaption>{t}</figcaption>" if names else "<figcaption>&nbsp;</figcaption>"
    return ('<div class="objs">'
            f'<figure>{fig(disk(HELMET), 200, h)}{cap("The helmet") if names else cap("")}</figure>'
            f'<figure>{fig(disk(KIT), 200, h)}{cap("The shaving kit") if names else cap("")}</figure></div>')

def matchup():
    return ('<div class="matchup">'
            f'{fig(disk(KIT), 120, 92)}<span class="dot"></span><p>Kept a soldier’s head safe</p>'
            f'{fig(disk(HELMET), 120, 92)}<span class="dot"></span><p>Used for shaving every day</p></div>')

def choose(lines):
    return '<div class="choose">' + "".join(
        f"<p>{q} " + " or ".join(f"<span>{o}</span>" for o in opts) + "</p>" for q, opts in lines) + "</div>"

LESSON = {
  "slug": "what-came-home", "large": True,
  "out": DIR + "GW_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": CSS + CASE_CSS + OBJ_CSS + "body { line-height: 1.44; } .specimen { margin-bottom: 7pt; }",
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 9, C_TEACH), ("Activity", 12, C_ACT), ("Close", 4, C_CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES)],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will look closely at the two objects in the exhibition’s display case, a soldier’s steel helmet and his shaving kit, and use them as clues. They will learn that the *doughboys* were ordinary young Americans who crossed the ocean to France, that their razors and helmets came home with them, and that we remember them with a red poppy and a quiet time on Veterans Day."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**History** — objects as clues to the past; long ago and today",
      "**Civics** — Veterans Day, and why we thank people who served",
      "**Science** — materials: steel, paint and sand",
      "**Speaking and listening** — describing an object; asking questions"]}),
               ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed",
      "A modern razor or helmet to compare (optional)",
      "Red crayons; differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "A mystery object",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": KIT}, "alt": ALT_KIT, "fit": "contain",
                 "caption": "From the display case",
                 "purpose": "Wonder about an object before knowing anything about it.",
                 "students": [HOOK_Q, "What clues can you see?"]},
      "body": [f"Show the shaving kit on page 3 without naming it. *“{HOOK_Q}”* Let students describe what they see: the case, the handle, the little box. Take guesses. Then: *“It is a razor, for shaving. It belonged to a soldier more than a hundred years ago. Today we find out who he was, and what came home with him.”*"]}),
    ("section", {"label": "Direct instruction · 9 minutes", "title": "The doughboys, and what they carried",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Who were the doughboys?", "show": "image",
         "img": {"img": FACES, "pos": "center 40%"}, "alt": "Faces of American soldiers in helmets, in an old sepia photograph",
         "caption": WHO, "fit": "cover",
         "purpose": "Meet the doughboys: ordinary young Americans, far from home.",
         "students": ["Where did the doughboys come from?", "Why might they be called doughboys?"]},
        {"phase": "Teach", "minutes": 6, "script": [1, 2], "title": "A helmet and a razor", "show": "gallery", "groups": GALLERY,
         "purpose": "Read two objects as clues: what each was for, and what came home.",
         "students": ["What was the helmet for?", "What did soldiers do with their razors after the war?"]}],
      "body": [
        "**Who were the doughboys?** Show the faces on the poster. In April 1917 America joined a very big war, the Great War. Two million young Americans crossed the Atlantic Ocean to France. *“" + WHO + "”* They were called *doughboys*. Nobody knows for sure why: maybe because the big brass buttons on their uniforms looked like little fried-dough pastries, or maybe because marching soldiers got so dusty they looked rolled in flour.",
        "**The helmet.** Show it. It is made of steel, pressed from one piece, with a wide brim to keep a soldier’s head safe. Sand, sawdust or crushed cork was mixed into the paint so it would not shine in the light. Soldiers called it their *tin hat*. Point to the round emblem: *“This was put on after the war. Soldiers who came home started a club for veterans, the American Legion, in 1919.”*",
        "**The shaving kit.** Every soldier was given one. Soldiers were allowed to keep their razors when they came home, and they kept shaving with them. Ask: *“What do these two things tell us about the doughboys?”*"]}),
    ("section", {"label": "Activity · 12 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the objects as clues at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the helmet, the shaving kit and the poppy."]},
      "body": ["Students choose a handout. All three levels use the same two objects and end with how we remember."]}),
    ("levels", {
      "green": "Match each object to what it was for, circle the right words about the doughboys, color a poppy, and draw a thing from home that tells a story.",
      "yellow": "Name the objects from a word bank and write what each was for, pick the two ideas about the nickname, and draw and write one way we remember.",
      "red": "Find the clue that shows the helmet came home, explain what came home with the soldiers, then tell the story of an object from home."}),
    ("section", {"label": "Look back and remember · 4 minutes",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS, phase="Close"),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "A poppy in the field", "show": "image",
         "img": {"img": ROOM_MEMORIAL}, "alt": ALT_MEMORIAL, "fit": "cover",
         "purpose": "End by remembering together, as the exhibition invites.",
         "students": ["Each poppy here was placed by a visitor.", "Let’s place one together, to remember."]}],
      "body": ["Ask the objectives back from the screen: *“Can you now…?”* Students show a thumb up, sideways or down. For the last, ask a Red Level student to share their clue.",
               "Open *The Memorial* and place one poppy in the field together. *“Every November, people wear a red poppy. On Veterans Day, November 11, many people keep a quiet time at 11 o’clock. That is how we remember the doughboys, and everyone who has served.”*"]}),
    ("cols", [[("section", {"label": "Answer notes", "list": [
      "**Green:** helmet — kept a soldier’s head safe; shaving kit — used for shaving every day. Soldiers · ocean · so it would not shine.",
      "**Yellow:** the two ideas are the brass buttons like fried-dough pastries and the dust like flour.",
      "**Red:** the American Legion emblem; the Legion was started by veterans in 1919, after the war, so the helmet came home and was kept."]})],
     [("connection", ["**Visit the exhibition:** the helmet and the shaving kit stand in the display case. Look for the emblem on the helmet, and the little box of blades in the kit.",
                      "**Online:** each object has its own page, with a picture you can turn. Then place a poppy in *The Memorial*."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Two objects that came home",
      "body": ["Project or print this page for the hook and the lesson. Cover the names for the hook, so students can guess."]}),
    ("specimen", HELMET_CARD),
    ("specimen", KIT_CARD),
    ("html", '<div style="margin:2pt 0 10pt;break-inside:avoid">' + fig(FACES, 520, 150, fit="cover", pos="center 40%", border=True)
             + '<p class="label" style="margin-top:6pt">The Doughboys poster</p><p><i>“They were farmers from Iowa, factory workers from Pittsburgh, teenagers from small Texas towns…”</i> In April 1917, two million young Americans crossed the Atlantic to France.</p></div>'),
    ("section", {"label": "Questions to ask in front of the case", "list": [
      "What is each object made of? How can you tell?",
      "Why would a soldier need a razor so far from home?",
      "The helmet has an emblem. When was it put there, and by whom?",
      "If you went far away, what one thing would you take with you?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In 1917, two million young Americans crossed the ocean to France to fight in the Great War. They were called **doughboys**. Two things they carried are in the Mini Museum’s display case: a steel helmet and a shaving kit."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · The display case", "level": level, "young": True, "context": CONTEXT, "css": CSS + CASE_CSS + css,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "GW_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Draw a line from each object to what it was for.", "blocks": [("html", matchup())]}),
  ("task", {"label": "Part 2", "title": "Circle the right word.", "blocks": [("html", choose([
      ("The doughboys were American", ["soldiers", "bakers"]),
      ("They crossed the", ["ocean", "desert"]),
      ("Sand was mixed into the helmet’s paint so it would", ["not shine", "look pretty"])]))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "We remember them with a red poppy. Color it red.",
            "blocks": [("html", f'<div class="bigpoppy">{poppy_svg(150)}</div>')]}),
  ("task", {"label": "Part 4", "title": "Draw something from your home that tells a story.", "blocks": [("draw", "My object")]}),
  ("family", ["Find an old object at home: a tool, a photo, a watch. Ask: *who used it? What story does it tell?*"]),
], "body.young .drawbox { height: 330pt; }")

YELLOW = handout("yellow", "GW_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Write the name under each object.",
            "blocks": [("html", '<p class="bank">Word bank: &nbsp; helmet &nbsp;·&nbsp; shaving kit</p>' + objs(names=False, h=110))], "lines": 0}),
  ("task", {"label": "Part 2", "title": "What was each one for?",
            "blocks": [("html", '<p>The helmet was for…</p><div class="write"><i></i></div>'
                                '<p style="margin-top:6pt">The shaving kit was for…</p><div class="write"><i></i></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Why were they called doughboys? Circle the two ideas.", "blocks": [("html", choose([
      ("", ["Their brass buttons looked like fried-dough pastries", "They were all bakers"]),
      ("", ["They loved doughnuts", "Marching made them dusty, like flour"])]))]}),
  ("task", {"label": "Part 4", "title": "Draw one way we remember them. Then write about it.",
            "blocks": [("html", '<div class="drawbox"><span>How we remember</span></div><div class="write"><i></i><i></i></div>')]}),
  ("family", ["Ask your family: do we know anyone who has served? On Veterans Day, November 11, how could we say thank you?"]),
], "body.young .drawbox { height: 370pt; }")

RED = handout("red", "GW_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Be a detective: this helmet came home.",
            "blocks": [("html", '<div style="display:grid;grid-template-columns:150pt 1fr;gap:12pt;align-items:center">'
                                f'{fig(disk(HELMET), 150, 96, extra="background:rgba(255,255,255,.72);border:1pt solid #1d1c1a;border-radius:6pt")}'
                                '<p>Look at the round emblem on the side. It belongs to the <b>American Legion</b>, a club for veterans. Soldiers who came home from the war started it in 1919.</p></div>')],
            "body": ["How does the emblem show that this helmet came home?"], "lines": 2}),
  ("task", {"label": "Part 2", "title": "The razors came home too.",
            "body": ["Soldiers kept their razors when they came home, and kept shaving with them. Why might a soldier want to keep something from the war?"], "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw an object from your home that tells a story. Label it.", "blocks": [("draw", "My object")]}),
  ("task", {"label": "Part 4", "title": "Who used it? What story does it tell?", "lines": 2}),
  ("task", {"label": "Part 5", "title": "Finish the sentence.", "body": ["We remember the doughboys because…"], "lines": 2}),
  ("family", ["Look at the helmet and the shaving kit together on the Mini Museum website. Ask your child which clue shows that the helmet came home."]),
], "body.young .drawbox { height: 270pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
