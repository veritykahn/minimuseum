"""Grades 5–8 · Science · "Drawing with Light"
Early photography as a light-sensitive chemical change: the negative, the
print, exposure time, and three processes compared. Facts follow the
photography bench of the Inventions Workshop
(app/exhibitions/victorian/inventions/inventionsText.ts, NOTES, PHOTOS,
PROCESS_CLUES, EXPOSURE) and poster 1 (Talbot's negative of 1835, Anna
Atkins's cyanotypes of 1843). The workshop's exposure seconds are a game
rule, and the handouts say so wherever they use them."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/science/"
TITLE = "Drawing with Light"
SUB = "Grades 5–8 · Science · Light, the negative and the print"

HERO = {"img": pic(STUDIO), "pos": "center 50%"}
SCREEN_HERO = {"img": STUDIO, "pos": "center 50%"}

HOOK_Q = "What is strange about this picture of a window?"

OBJECTIVES = objectives([
    ("explain how light changes light-sensitive paper to make a negative",
     "explain how light makes a negative?", False),
    ("predict the tones of a negative and of the print made from it",
     "predict the tones of a negative and its print?", False),
    ("identify the variables in a test of exposure time, and how to keep it fair",
     "plan a fair test of exposure time?", False),
    ("compare three Victorian processes by their materials and what each could do",
     "compare three processes and choose one for a job?", True)],
  "A photograph is a chemical record of where light fell. The same reasoning — light in, a change out, one variable at a time — runs through every experiment you will design.")

# the three processes, from PROCESS_CLUES and NOTES
PROCESSES = [
  ("Daguerreotype", "1839, Louis Daguerre", "A silver-plated sheet", "No: each is a single picture", "Made on a shiny silver-plated sheet."),
  ("Calotype", "1841, William Henry Fox Talbot", "A paper negative", "Yes: many prints from one negative", "Writing paper made sensitive to light with chemicals."),
  ("Wet collodion", "1851, F. Scott Archer", "A glass negative", "Yes: prints from the glass", "Coated, exposed while still wet and developed at once; very fine detail."),
]

PAIR = [
  {"img": NEGATIVE, "label": "A", "caption": "Talbot’s paper negative, probably 1835", "fit": "contain",
   "alt": "A faded purple paper negative of a tall window: the panes come out dark and the stone bars between them light"},
  {"img": POSITIVE, "label": "B", "caption": "Turned back, as a print turns it (made for the exhibition)", "fit": "contain",
   "alt": "The same window the right way round: bright panes and dark stone bars, in brown tones"}]

THREE = [
  {"label": "Daguerreotype", "text": "A silver-plated sheet; a single picture that could not be copied.",
   "items": [{"img": DAGUERREOTYPE, "caption": "Antoine-François-Jean Claudet, 1844–59. The Met, public domain", "aspect": 900 / 1035,
              "alt": "A hand-colored portrait of a balding man in glasses and a dark coat, in a gilt frame with an arched top"}]},
  {"label": "Calotype", "text": "A paper negative; many prints could be made from it.",
   "items": [{"img": OPEN_DOOR, "caption": "Talbot, *The Open Door*, before May 1844. The Met, public domain", "aspect": 1400 / 1023,
              "alt": "A brown photograph of an open wooden door in a stone wall, a broom leaning against it and a lantern hanging beside it"}]},
  {"label": "Wet collodion", "text": "A glass negative, used while still wet; very fine detail.",
   "items": [{"img": CAMERON, "caption": "Julia Margaret Cameron, *Cassiopeia*, 1866. The Met, public domain", "aspect": 900 / 1182,
              "alt": "A brown portrait of a young woman with curly hair, looking straight at the camera"}]}]

CHART = {"caption": "Three ways to make a photograph, from the Inventions Workshop",
         "columns": ["Process", "Introduced", "The image is on…", "Copies?"],
         "rows": [{"cells": [p, w, m, c]} for p, w, m, c, _ in PROCESSES]}

PLAN_CSS = """
.cards { grid-template-columns: repeat(3, 1fr); gap: 7pt; } .card { padding: 6pt 8pt 2pt; } .card .cn { display: none; }
.card h4 { margin-top: 0; } .card p { font-size: 8.8pt; line-height: 1.36; }
.three { display: grid; grid-template-columns: 1fr 1.25fr 1fr; gap: 10pt; align-items: end; margin: 4pt 0 6pt; }
.three figure { margin: 0; } .three img { width: 100%; border: 1pt solid #1d1c1a; border-radius: 4pt; display: block; }
.three figcaption { font: 400 7.2pt/1.32 'Outfit'; color: #5b5a55; margin-top: 3pt; } .three figcaption b { display: block; color: #1d1c1a; font-weight: 500; font-size: 8.4pt; }
"""

def three_figs(credit=True):
    figs = []
    for (name, _, _, _, _), path in zip(PROCESSES, (DAGUERREOTYPE, OPEN_DOOR, CAMERON)):
        cap = f"<b>{name}</b>" + (md(PHOTO_CREDITS[path]) if credit else "")
        figs.append(f'<figure><img src="{pic(path)}" alt=""><figcaption>{cap}</figcaption></figure>')
    return '<div class="three">' + "".join(figs) + "</div>"

def pair_figs(h=150):
    out = []
    for p, cap in ((NEGATIVE, "A · " + PHOTO_CREDITS[NEGATIVE]), (POSITIVE, "B · " + PHOTO_CREDITS[POSITIVE])):
        out.append(f'<figure><img src="{pic(p)}" alt="" style="height:{h}pt;object-fit:contain;background:#f3efe6"><figcaption><small>{md(cap)}</small></figcaption></figure>')
    return '<div class="duo">' + "".join(out) + "</div>"

LESSON = {
  "slug": "drawing-with-light",
  "out": DIR + "VIC_LP_Science.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Science", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Activity", 20, WORK), ("Debrief", 7, CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will discover that early photographs were made by light changing a light-sensitive surface: where most light fell, the paper darkened, so a camera made a **negative**, with light and dark the wrong way round. Laying that negative on fresh sensitive paper in the sun turned the tones back into a **print**. Students will reason about **exposure time** as a variable, and compare three Victorian processes — the daguerreotype, the calotype and wet collodion — by their materials and what each could do."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Physical science** — light interacting with matter; a chemical change caused by light",
      "**Science practices** — modeling; planning a fair test; identifying variables",
      "**Engineering and technology** — comparing designs by their trade-offs; technology changing society"]}),
    ("section", {"label": "Materials needed", "list": [
      "The pictures on page 3, on screen or printed; the handouts, one per student; pencils"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A strange window",
      "screen": {"phase": "Hook", "show": "image", "img": screen_pic(NEGATIVE, credit=PHOTO_CREDITS[NEGATIVE]),
                 "alt": PAIR[0]["alt"], "fit": "contain",
                 "purpose": "Notice that the oldest surviving negative has its light and dark reversed, before anything is explained.",
                 "students": [HOOK_Q, "Where would the light have been brightest?"]},
      "body": ["Show Talbot’s window without naming it. Ask: *“" + HOOK_Q + "”* Students notice that the panes, where daylight came in, are dark, and the stone bars light. Then tell them: this is the oldest known surviving paper negative, made by William Henry Fox Talbot of a window at Lacock Abbey, in August 1835."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "From negative to print",
      "screen": [
        {"phase": "Teach", "minutes": 6, "script": [0], "title": "Negative and print", "show": "pair", "items": PAIR,
         "purpose": "Model how light makes a negative, and how a print turns it back.",
         "students": ["Which parts of A got the most light?", "Why does B look the right way round?"]},
        {"phase": "Teach", "minutes": 7, "script": [1, 2], "title": "Three ways", "show": "gallery", "groups": THREE,
         "purpose": "Compare three processes by what the image was made on.",
         "students": ["Which could be copied?", "Which one has no negative at all?"]}],
      "body": ["**The model.** Inside the camera was paper that darkens in the light. Where the bright window shone on it, the paper darkened; where the dark stone was, little changed. So the negative has light and dark the wrong way round. A print was made by laying the negative directly on sensitized paper and putting it out in the sunlight: now the light passes through the pale parts of the negative and darkens the paper beneath, and the tones turn back. Talbot’s positive-negative process meant many prints could be made of the same image.",
               "**Three ways.** Show the three photographs. The **daguerreotype** (announced by Louis Daguerre in 1839) was made on a silver-plated sheet; each was a single picture that could not be copied. Talbot’s **calotype** (patented 1841) used a sheet of good writing paper made sensitive to light with chemicals as its negative. In the **wet collodion** process (introduced in 1851 by F. Scott Archer) a glass plate was coated, exposed while still wet and developed at once; it gave very fine detail. Julia Margaret Cameron printed from such glass negatives.",
               "**Hold still.** In the earliest days of the portrait daguerreotype, a photograph took over 15 minutes. That soon fell to just over a minute, but sitters still had to keep still the whole time, or the picture blurred; neck braces and head clamps were often used. Ask: *what variable did photographers want to shrink, and why?*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Model the negative and the print, and reason about exposure time, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Shade lightly in pencil: you may change your mind."]},
      "body": ["Students choose a handout. Every level models a negative and a print on a grid; the Inventions Workshop’s exposure seconds appear as a game rule, never as real times."]}),
    ("levels", {
      "green": "Shade the negative of a simple window, then predict the print; match each process to its clue; finish a sentence on why sitters kept still.",
      "yellow": "Turn a scene into a negative and a negative back into a scene; plan a fair test of exposure time with its variables; choose a process for a job.",
      "red": "Explain the chain from light to print with a labeled model; reason from a single-print rule to a whole design; weigh exposure time against blur."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "What light did",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "The three compared", "show": "chart", **CHART,
         "purpose": "Pull the comparison together and connect it to the model.",
         "students": ["Which process would you choose for a portrait to send to five relatives?", "Which for the finest detail?"]},
        review_step(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Project the comparison chart. Ask: *which process would you choose for a portrait to send to five relatives? Which for the finest detail? Which could never be copied?* Expect reasons that use the material: a negative on paper or glass makes copies possible; a silver plate does not.",
               "Put the objectives back up as *“Can you now…?”* for a thumb up, sideways or down; one student explains the negative aloud with the words *light*, *darkens* and *reversed*."]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Grids:** every square that was bright in the scene is dark on the negative, and every dark square light. The print matches the scene. Worked backward, the given negative shows a dark doorway inside a pale arch.",
      "**Fair test:** the independent variable is the exposure time; the dependent variable is how dark the negative comes out; keep the same paper, scene, light and lens for every sheet.",
      "**Workshop rule (a game):** under 4 seconds too faint, over 9 too dark, 5 to 8 a good negative. Real exposures were far longer: say so whenever the numbers come up.",
      "**Exit ticket:** *why does a negative have light and dark the wrong way round?*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The window, and three ways to make a photograph",
                 "body": ["Talbot’s negative, A, beside the print turned back from it, B. Then the three processes, each from the Metropolitan Museum of Art’s open-access collection, as the exhibition credits them."]}),
    ("html", pair_figs(130)),
    ("html", three_figs()),
    ("cards", [
      ("Daguerreotype · 1839", ["Announced by Louis Daguerre. Made on a silver-plated sheet. Each one was a single picture that could not be copied."]),
      ("Calotype · 1841", ["Patented by Talbot. The negative was writing paper made sensitive to light with chemicals; many prints could be made from it."]),
      ("Wet collodion · 1851", ["Introduced by F. Scott Archer. A glass plate coated, exposed while still wet and developed at once. Very fine detail."])]),
    ("connection", ["**Visit the exhibition:** at the photography bench of the *Inventions Workshop,* make Talbot’s negative and print from it, sit for a daguerreotype in a head clamp, and match the three photographs to their processes. Poster 1 adds that in 1843 Anna Atkins began publishing the first book in Britain illustrated with photographs: blue “cyanotype” prints of seaweed, made by laying the plants on sun-sensitive paper."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In 1835, William Henry Fox Talbot put light-sensitive paper inside a camera and pointed it at a window. Where light fell, the paper darkened. What came out was a **negative**: a picture with light and dark the wrong way round. Lay it on fresh paper in the sun, and the light turns it back."]

H_CSS = """
.grids { break-inside: avoid; display: flex; gap: 18pt; align-items: flex-start; margin: 4pt 0 8pt; }
.grids figure { margin: 0; } .grids figcaption { font: 500 7.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; margin-top: 4pt; text-align: center; }
table.g { border-collapse: collapse; } table.g td { width: var(--c, 19pt); height: var(--c, 19pt); border: .8pt solid #1d1c1a; padding: 0; background: #fff; }
table.g td.d { background: #3b3a36; }
.match { break-inside: avoid; display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 20pt; font-size: 9.4pt; margin: 4pt 0 8pt; }
.match div { display: flex; align-items: center; gap: 7pt; } .match .r { justify-content: flex-start; }
.dot { width: 6pt; height: 6pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.rule { border: 1pt dashed #6f6c62; border-radius: 4pt; padding: 4pt 8pt; font-size: 8.8pt; background: rgba(255,255,255,.55); margin: 4pt 0 8pt; }
.rule b { font: 500 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; margin-right: 5pt; }
.frame { font-size: 10pt; line-height: 2.1; }
.frame u { display: inline-block; min-width: 150pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.side { display: grid; grid-template-columns: auto 1fr; gap: 14pt; align-items: start; break-inside: avoid; } .side .grids { margin: 0; gap: 8pt; }
.wl { height: 22pt; border-bottom: .8pt solid #6f6c62; }
.box { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); }
"""

handout = handout_maker(DIR, TITLE, "Grades 5–8 · Science", "Grades 5–8 Science", CONTEXT, HERO, H_CSS)

# 1 = bright in the scene (light falls there), 0 = dark
WINDOW = ["0000000", "0110110", "0110110", "0000000", "0110110", "0110110", "0000000"]
# an arched window with a sill, for Yellow and Red
ARCH = ["00011000", "00111100", "01111110", "01100110", "01100110", "01111110", "01100110", "00000000"]
# a negative given to Red (and to Yellow): what scene made it?
DOOR_NEG = ["11111111", "11000011", "10000001", "10011001", "10011001", "10011001", "10011001", "11111111"]


def grid(rows, cell=19, show=True, invert=False):
    out = []
    for r in rows:
        tds = []
        for ch in r:
            bright = ch == "1"
            if invert:
                bright = not bright
            tds.append('<td class="d"></td>' if show and not bright else "<td></td>")
        out.append("<tr>" + "".join(tds) + "</tr>")
    return f'<table class="g" style="--c:{cell}pt">' + "".join(out) + "</table>"


def grids(*figs):
    return '<div class="grids">' + "".join(f"<figure>{g}<figcaption>{c}</figcaption></figure>" for g, c in figs) + "</div>"


def P(t):
    return f"<p>{md(t)}</p>"


GAME_RULE = '<div class="rule"><b>Workshop rule, a game</b>In the exhibition’s game, a sheet exposed under 4 seconds comes out too faint, over 9 seconds too dark, and 5 to 8 seconds makes a good negative. Real exposures took far longer.</div>'

GREEN = handout("green", "VIC_Handout_Green_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Make the negative, then the print",
            "blocks": [("html", P("Here is a window. White squares are **bright**: daylight came through. Gray squares are **dark** stone. On the paper in the camera, light makes it **darker**.")
                        + P("**1.** Shade the negative: every bright square turns dark, every dark square stays light.")
                        + P("**2.** The negative is laid on fresh paper in the sun. Light shines through its **pale** squares and darkens the paper beneath. Shade the print.")
                        + grids((grid(WINDOW, 19), "The window"), (grid(WINDOW, 19, show=False), "1 · Negative"), (grid(WINDOW, 19, show=False), "2 · Print")))],
            "body": ["Does the print look like the window, or like the negative? ____________________"]}),
  ("task", {"label": "Part 2", "title": "Three ways to make a photograph",
            "body": ["Draw a line from each process to its clue."],
            "blocks": [("html", '<div class="match">'
                        + "".join(f'<div><b style="width:96pt">{p}</b><span class="dot"></span></div><div class="r"><span class="dot"></span>{c}</div>'
                                  for p, c in zip([p[0] for p in PROCESSES], ["The negative was a sheet of glass, used while still wet.", "Made on a shiny silver-plated sheet. Only one: it could not be copied.", "The negative was paper, so many prints could be made from it."]))
                        + "</div>")]}),
  ("task", {"label": "Part 3", "title": "Too faint, too dark",
            "blocks": [("html", GAME_RULE)],
            "body": ["A sheet came out too faint. Should you count **longer** or **shorter** next time? Why?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Hold still!",
            "blocks": [("html", '<p class="frame">The first portraits took over 15 minutes. Sitters had to keep still, because if they moved, the picture <u></u>. Photographers used <u></u> to hold their heads in place.</p>')]}),
  ("task", {"label": "Part 5", "title": "One negative, many prints",
            "body": ["Talbot’s negative was paper. Why could he make many prints from it, but a daguerreotype could not be copied?"], "lines": 3}),
  ("connection", ["At the photography bench of the *Inventions Workshop,* make Talbot’s negative and then print from it. How many prints can you make from one negative? __________"]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Scene to negative to print",
            "blocks": [("html", P("Light-sensitive paper darkens where light falls. Shade the negative of this arched window, then the print made from that negative.")
                        + grids((grid(ARCH, 12), "The scene"), (grid(ARCH, 12, show=False), "Negative"), (grid(ARCH, 12, show=False), "Print")))]}),
  ("task", {"label": "Part 2", "title": "Work backward",
            "blocks": [("html", P("This negative came out of a camera. Shade the scene it was taken of. ")
                        + grids((grid(DOOR_NEG, 12), "The negative"), (grid(DOOR_NEG, 12, show=False), "The scene"))
                        + P("What might the scene be? ______________________________"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Plan a fair test",
            "blocks": [("html", P("You want to find the best exposure time for a negative.") + GAME_RULE)]}),
  ("table", {"head": ["", "Your answer"], "rows": [
      ["What will you change? (independent variable)", ""],
      ["What will you observe? (dependent variable)", ""],
      ["What must stay the same? Name three things.", ""],
      ["Predict: what happens at 2 seconds? At 12?", ""]]}),
  ("task", {"label": "Part 4", "title": "Choose a process",
            "body": ["Use the chart your teacher shows you. Which process would you choose for each job, and why?"]}),
  ("table", {"head": ["Job", "Process", "Why"], "rows": [
      ["A portrait to send to five relatives", "", ""],
      ["A face in the finest detail", "", ""],
      ["One picture to keep, that no one can copy", "", ""]]}),
  ("connection", ["In the exhibition, sit for a daguerreotype at the photography bench. Why did the first portraits need a head clamp? Use the words *exposure* and *blur*."]),
], "table.fill td:first-child { width: 42%; }")

RED = handout("red", "VIC_Handout_Red_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Explain the chain",
            "blocks": [("html", P("A good model explains every step with one rule: **where light falls on sensitive paper, the paper darkens.** Draw a labeled model with three stages: the scene, the negative in the camera, and the print in the sun. Show with arrows where light travels at each stage, and use the rule to explain why the print comes out the right way round.")
                        + '<div class="box" style="height:100pt"></div>')]}),
  ("task", {"label": "Part 2", "title": "Test the model",
            "blocks": [("html", '<div class="side">' + grids((grid(DOOR_NEG, 11), "The negative"), (grid(DOOR_NEG, 11, show=False), "The scene"))
                        + '<div>' + P("Use the rule on this negative: shade the scene it came from. Then explain why a **gray** square on a negative would give a gray square on the print.")
                        + '<div class="wl"></div><div class="wl"></div><div class="wl"></div></div></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Time against stillness",
            "body": ["In the earliest days of the portrait daguerreotype, a photograph took over 15 minutes. That soon fell to just over a minute, but sitters still had to keep still the whole time, or the picture blurred. Neck braces and head clamps were often used. In London, the photographer Richard Beard told his sitters to say “prunes” for a small, tight mouth.",
                     "Explain the trade-off between exposure time and a sharp picture. What would an inventor have to change about the sensitive surface to shorten the time? Why might these facts help explain why so few people smile in early portraits?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Design a fair test",
            "blocks": [("html", GAME_RULE)],
            "body": ["Design an experiment to find the best exposure for a new kind of sensitive paper. Name the independent and dependent variables, three controls, how many sheets you would expose and at which times, and how you would judge “best.”"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "Argue for a process",
            "body": ["A family wants a portrait for each of five homes, in fine detail. Daguerreotype, calotype or wet collodion? Make a claim, give evidence about each process’s material, and explain your reasoning."], "lines": 3}),
  ("connection", ["Poster 1 says that in 1843 Anna Atkins made blue “cyanotype” prints of seaweed by laying the plants on sun-sensitive paper. Use your model: where would the print be pale, and why?"]),
], "table.fill td:first-child { width: 42%; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
