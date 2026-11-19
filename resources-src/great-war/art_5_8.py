"""Grades 5–8 · Art · "Silhouette and Poppy"
How the exhibition's two posters are designed to make people remember: a
held-back palette of black, gray and off-white with one red; the
silhouette, a figure with no face who can stand for many; and the symbols
of remembrance, the poppy, the cross and the steel helmet. Students then
design a remembrance panel of their own. The posters are read from the
pictures in public/exhibitions/great-war/ (their alt text in greatWar.ts);
the poppy, the crosses and the Tomb of the Unknown Soldier from poster 2;
the helmet from the display case's museum card; the backlit silhouette
display from the case's record of the installation."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-5-8/art/"
TITLE = "Silhouette and Poppy"
SUB = "Grades 5–8 · Art · Designing for remembrance"
HERO = {"img": POSTER2, "pos": "center 78%"}

ALT_POSTER1 = ("The Doughboys: America’s Sons in The Great War poster: a sepia photograph of four soldiers walking away down a ruined trench "
               "above the faded faces of soldiers in helmets, the title in off-white, three paragraphs of text, and the date 11.11.1918 and the time 11:00 in red")
ALT_POSTER2 = ("When the Guns Fell Silent at the 11th Hour poster: the date 11.11.1918 and the time 11:00 in red above four paragraphs of text, "
               "and the title over a photograph of a soldier silhouetted beside a wooden cross on a hill, with red poppies climbing the right edge")

HOOK_Q = "This soldier has no face. Why might an artist choose that?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe how the two posters use a held-back palette, and where they spend their one red",
     "describe the posters’ palette, and where they spend their red?", False),
    ("explain how a silhouette lets one figure stand for many",
     "explain how a silhouette lets one figure stand for many?", False),
    ("read the symbols of remembrance: the poppy, the cross and the steel helmet",
     "read the poppy, the cross and the steel helmet as symbols?", False),
    ("design a remembrance panel in which every choice of color, shape and symbol has a reason",
     "design a remembrance panel and give a reason for every choice?", True)],
  "why": "A poster has a few seconds to make a stranger stop and remember. Color, shape and symbol do that work before a single word is read."}

LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* Students show a thumb up, "
                 "sideways or down; for the last, ask a Red Level designer to explain one choice.")

PAIR = [{"img": POSTER1, "alt": ALT_POSTER1, "label": "The Doughboys", "fit": "contain"},
        {"img": POSTER2, "alt": ALT_POSTER2, "label": "When the Guns Fell Silent", "fit": "contain"}]

SYMBOLS = [
  {"label": "The poppy", "text": "Often the only living thing that could grow in the churned soil of the battlefields. People wear poppies in November to remember.",
   "items": [{"img": POPPIES, "caption": "Poppies", "sub": "From the When the Guns Fell Silent poster", "alt": ALT_POPPIES, "aspect": 1}]},
  {"label": "The cross", "text": "John McCrae’s poem “In Flanders Fields” tells of crosses, row on row, marking graves where poppies grew wild.",
   "items": [{"img": SILHOUETTE, "caption": "A soldier by a cross", "sub": "The When the Guns Fell Silent poster", "alt": ALT_SILHOUETTE}]},
  {"label": "The helmet", "text": "Wide-brimmed steel, painted with sand, sawdust or crushed cork so it would not catch the light. Soldiers called it their “tin hat.”",
   "items": [{"img": HELMET, "caption": "M1917 Brodie helmet", "sub": "The display case", "alt": ALT_HELMET, "aspect": 1}]}]

CSS = """
.pp { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 8pt; break-inside: avoid; }
.pp figure { margin: 0; text-align: center; }
.pp img { width: 100%; height: 250pt; object-fit: contain; }
.pp figcaption { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin-top: 3pt; }
.pal { display: flex; gap: 8pt; margin: 4pt 0 8pt; break-inside: avoid; }
.pal span { display: flex; align-items: center; gap: 5pt; font-size: 8.8pt; }
.pal i { display: inline-block; width: 22pt; height: 22pt; border-radius: 3pt; border: .8pt solid #1d1c1a; }
.syms { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; break-inside: avoid; }
.syms figure { margin: 0; background: rgba(255,255,255,.6); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 6pt; }
.syms img { width: 100%; height: 78pt; object-fit: contain; display: block; }
.syms img.cover { object-fit: cover; }
.syms figcaption { font-size: 8.4pt; line-height: 1.35; margin-top: 4pt; }
.syms figcaption b { display: block; font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; }
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; }
.thumbs .drawbox { height: 120pt; margin: 0; }
"""

PALETTE = [("#141414", "near-black ground"), ("#7a7a76", "gray photograph"), ("#efe8d8", "off-white type"), ("#E8372C", "one red")]

def chips():
    return '<div class="pal">' + "".join(f'<span><i style="background:{c}"></i>{t}</span>' for c, t in PALETTE) + "</div>"

def pp(h=250):
    return (f'<div class="pp"><figure><img src="{POSTER1}" alt="" style="height:{h}pt"><figcaption>The Doughboys</figcaption></figure>'
            f'<figure><img src="{POSTER2}" alt="" style="height:{h}pt"><figcaption>When the Guns Fell Silent</figcaption></figure></div>')

def syms():
    out = ""
    for s in SYMBOLS:
        it = s["items"][0]
        src = disk(it["img"]) if it["img"].endswith(".webp") else it["img"]
        cls = ' class="cover"' if it["img"] == SILHOUETTE else ""
        out += f'<figure><img src="{src}" alt=""{cls}><figcaption><b>{s["label"]}</b>{s["text"]}</figcaption></figure>'
    return f'<div class="syms">{out}</div>'

def write(n):
    return '<div class="write">' + "<i></i>" * n + "</div>"

LESSON = {
  "slug": "silhouette-and-poppy",
  "out": DIR + "GW_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": CSS + OBJ_CSS + CASE_CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will look closely at the exhibition’s two posters and see how few means they use: a **near-black ground**, **gray photographs**, **off-white type**, and **red** kept for the date, the hour and the poppies. They will study the **silhouette**, a figure without a face that can stand for every soldier, and three **symbols** of remembrance, then design a remembrance panel in which every choice has a reason."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Visual art: responding** — describe, analyze and interpret a work’s color, composition and symbol",
      "**Visual art: creating** — plan with thumbnails; make a design that carries a meaning",
      "**Design** — a limited palette; contrast and focal point; positive and negative space",
      "**History connection** — the poppy, the crosses of Flanders and the Brodie helmet"]}),
    ("section", {"label": "Materials needed", "list": [
      "The two posters and the symbols on page 3, projected or printed in color",
      "Pencils, black and gray markers or charcoal, and one red (crayon, pencil or paint)",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A soldier with no face",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": SILHOUETTE}, "alt": ALT_SILHOUETTE, "fit": "contain",
                 "purpose": "Look before explaining: what does a silhouette hide, and what does it give?",
                 "students": [HOOK_Q, "What can you still tell about him?"]},
      "body": [f"Show the picture from the When the Guns Fell Silent poster: a soldier, a cross on a hill, red poppies. Ask: *“{HOOK_Q}”* Students will notice the helmet, the rifle, the bowed head, and that we cannot tell who he is. *“Because he has no face, he could be anyone’s son. Today we look at how the posters make us remember, before we read a word.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Palette, silhouette, symbol",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Two posters, one palette", "show": "pair", "items": PAIR,
         "purpose": "See how little color the posters use, and where they put the red.",
         "students": ["List every color you can see.", "Where is the red? What does it mark?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "One figure for many", "show": "image",
         "img": {"img": ROOM_MEMORIAL}, "alt": ALT_MEMORIAL, "fit": "cover",
         "purpose": "See the silhouette used again: a figure who stands for every soldier.",
         "students": ["Why might the Memorial use the same figure, not a photograph of one man?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Three symbols", "show": "gallery", "groups": SYMBOLS,
         "purpose": "Read the poppy, the cross and the helmet as symbols.",
         "students": ["Which symbol would someone recognize without any words?", "Why does a living flower suit remembering?"]}],
      "body": [
        "**Palette.** Put the two posters side by side. Students list the colors: near-black, gray, off-white, and red. The red is spent carefully: on the date **11.11.1918** and the time **11:00** on both posters, and on the poppies climbing the second. The photographs are sepia and gray. Ask what the red does to the eye.",
        "**Silhouette.** The figure in the When the Guns Fell Silent poster is a silhouette, and the Memorial room uses one against the sunset. In the exhibition, a backlit silhouette display stood beside the case, with soldier cards to take away. A silhouette keeps the outline (helmet, rifle, posture) and leaves out the face, so one figure can stand for many.",
        "**Symbols.** The **poppy**: the poster says poppies were often the only living things that could grow in the churned soil of the battlefields, and that people wear them in November to remember. The **cross**: John McCrae’s poem *In Flanders Fields* tells of crosses, row on row, marking graves. The **helmet**: the Brodie’s wide brim and its outline, painted with sand or sawdust so it would not catch the light."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design for remembrance at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Every level ends with a design of your own: black, gray, white and one red."]},
      "body": ["Students choose a handout; every level ends with a design in black, gray, white and one red."]}),
    ("levels", {
      "green": "Find the red on the two posters and say what it marks. Match each symbol to its meaning. Then design a remembrance card: a silhouette, one symbol and one red.",
      "yellow": "Analyze the palette and the focal point of one poster. Make three thumbnail sketches for a remembrance panel, then draw the strongest one larger and explain your choices.",
      "red": "Compare the composition of the two posters. Design a panel for those whose names we’ll never know, using silhouette and negative space, and write a short artist’s statement."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Where does the eye go first?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Gallery walk", "show": "question",
         "question": "Where does your eye go first? Why?",
         "purpose": "Look at each other’s designs as a viewer would.",
         "students": ["Find the red in a classmate’s design. What does it mark?", "Which design would make you stop and remember?"]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Lay the designs out and walk the room in silence for two minutes. Then ask: *where did your eye go first, and why?* Ask two students to say what their red marks.",
               LOOK_BACK_SAY]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Green:** the red marks the date and time on both posters, and the poppies on the second.",
        "**Yellow:** in the second poster the eye goes to the figure and the cross, framed by red poppies; the red date pulls it to the top.",
        "**Red:** look for a reason for each choice, and negative space used on purpose."]})],
      [("section", {"label": "Assessment", "body": ["**Exit ticket:** *name one choice in your design, and the reason for it.* Look for a held-back palette and a clear focal point."]}),
       ("section", {"label": "For the teacher", "body": ["Keep the designs about remembering. Students draw symbols and silhouettes, not scenes of fighting or of wounds."]})]]),
    ("section", {"label": "Show your class", "title": "The posters and the symbols",
      "body": ["Project or print this page in color for the lesson."]}),
    ("html", pp(330)),
    ("html", syms()),
    ("connection", ["**Online,** open the two posters in the exhibition and watch the red date and time appear; then visit *The Memorial*. **In the exhibition,** stand in front of the backlit silhouette, and look at the Brodie helmet’s outline in the display case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Great War ended at 11:00 AM on November 11, 1918. The Mini Museum’s two posters remember it in black, gray, off-white, and one red. Today you look at how they were designed, then design for remembrance yourself."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT, "css": CSS + CASE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "GW_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Find the red",
            "blocks": [("html", pp(215) + "<p>Look at both posters. Circle every place you see <b>red</b>. What does the red mark?</p>" + write(3))]}),
  ("task", {"label": "Part 2", "title": "Three symbols",
            "blocks": [("html", syms() + "<p>Which symbol would you use to remember the soldiers? Why?</p>" + write(2))]}),
  ("task", {"label": "Part 3", "title": "Design a remembrance card",
            "blocks": [("html", "<p>Draw a soldier as a <b>silhouette</b>: an outline filled in dark, with no face. Add <b>one</b> symbol. Use only black, gray and <b>one red</b>.</p>"
                        + chips() + '<div class="drawbox" style="height:240pt"><span>My remembrance card</span></div>'
                        + "<p>Write a few words for your card:</p>" + write(2))]}),
])

YELLOW = handout("yellow", "GW_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Read a poster",
            "blocks": [("html", "<p>Look at both posters and their palette. Then choose one poster and answer the questions.</p>" + pp(165) + chips())]}),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["Where does your eye go first? Why?", ""], ["Where is the red, and what does it mark?", ""],
      ["Why are the photographs gray, not in color?", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Three thumbnails",
            "blocks": [("html", "<p>Sketch three small ideas for a remembrance panel. Each must use a <b>silhouette</b> and <b>one symbol</b>: a poppy, a cross or a helmet. Try a different composition each time.</p>"
                        + '<div class="thumbs">' + "".join(f'<div class="drawbox"><span>Idea {n}</span></div>' for n in (1, 2, 3)) + "</div>")]}),
  ("task", {"label": "Part 3", "title": "Your panel",
            "blocks": [("html", "<p>Draw your strongest idea larger. Use black, gray, white and <b>one red</b>.</p>"
                        + '<div class="drawbox" style="height:230pt"><span>My remembrance panel</span></div>'
                        + "<p>Why did you choose this idea? Where did you put the red, and why?</p>" + write(3))]}),
], "table.fill tbody td { height: 30pt; } table.fill td:first-child { width: 42%; }")

RED = handout("red", "GW_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Compare the compositions",
            "blocks": [("html", "<p>Compare the two posters: where the photograph sits, where the title sits, how the red is used, and where the eye travels. Which composition holds your attention longer? Explain, using art words: <b>focal point</b>, <b>contrast</b>, <b>balance</b>, <b>negative space</b>.</p>" + pp(140))], "lines": 5}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "For those whose names we’ll never know",
            "blocks": [("html", "<p>On Veterans Day, a wreath is placed at the Tomb of the Unknown Soldier, <i>“honoring all those whose names we’ll never know but whose sacrifice we’ll never forget.”</i> Design a panel for them. Use a <b>silhouette</b>, <b>negative space</b> (the empty space around a shape) and <b>one red</b>. Label two choices on your design.</p>"
                        + '<div class="drawbox" style="height:350pt"><span>My panel</span></div>')]}),
  ("task", {"label": "Part 3", "title": "Artist’s statement",
            "body": ["In four or five sentences, explain what your panel means and why you made each choice: the palette, the silhouette, the symbol and the space."], "lines": 6}),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
