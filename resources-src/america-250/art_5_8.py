"""Grades 5–8 · Art · "Painting the Moment"
The two paintings the exhibition's posters are built around, read as history
paintings: John Trumbull's Declaration of Independence (1818) and Emanuel
Leutze's Washington Crossing the Delaware (1851). Students read how a
painter makes a moment, and what each painting leaves out, then compose a
scene of their own from the posters. Facts and credits follow
app/exhibitions/america-250/america250.ts (both posters, the pictures' alt
text and credits) and sign/signText.ts (the flag resolution, Add a Star)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (A, TRUMBULL, LEUTZE, pic, md, OBJ_CSS, FLOW_CSS, EV_CSS, FIG_CSS, TIMING_45,
                     look_back_say, review, ev, quote, fig)

DIR = "teachers/grades-5-8/art/"
TITLE = "Painting the Moment"
SUB = "Grades 5–8 · Art · How history paintings make a myth"

HERO = pic("leutze-washington.jpg", LEUTZE, "center 36%")
T_PIC = pic("trumbull.jpg", TRUMBULL)
L_PIC = pic("leutze.jpg", LEUTZE)

HOOK_Q = "Where does your eye go first? How did the painter make it go there?"

T_ALT = "John Trumbull’s Declaration of Independence: in a high-ceilinged hall hung with red curtains and captured flags, five men stand at the center presenting the draft to John Hancock, seated at the right, while the delegates of the Congress look on"
L_ALT = "Emanuel Leutze’s Washington Crossing the Delaware: George Washington stands in a crowded rowboat as soldiers push it through ice floes on a gray winter river, an officer behind him raising a flag of stars and stripes, and more boats following under a stormy sky"

# what each painting shows, and what the exhibition says beside it
PAINTINGS = [
  ("Declaration of Independence", "John Trumbull · 1818 · U.S. Capitol",
   "Five men, the drafting committee of John Adams, Roger Sherman, Robert Livingston, Thomas Jefferson and Benjamin Franklin, present the draft to John Hancock, seated at the right. The delegates look on from both sides of a high hall.",
   "Painted forty-two years after 1776. It shows the draft being presented, not signed: most delegates signed the parchment on August 2. The poster *Before it was Sacred* is built around it."),
  ("Washington Crossing the Delaware", "Emanuel Leutze · 1851 · The Metropolitan Museum of Art",
   "Washington stands in a crowded rowboat as soldiers push through ice floes. Behind him an officer raises a flag of stars and stripes; more boats follow under a stormy sky.",
   "Painted seventy-five years after 1776. The poster *We Shall All Hang Together* sets it beside the war that nearly was not won: by November 1776, Washington retreating across New Jersey with perhaps 3,000 effective troops."),
]

# five questions for any history painting
FIVE = [
  ("Focal point", "Where does the eye go first, and what makes it go there: light, color, size, the lines that point?"),
  ("Composition", "How are the figures arranged: a calm row, a triangle, a strong diagonal?"),
  ("Light and color", "Where is the brightest light, and the strongest color? What mood do they make?"),
  ("When it was made", "How many years after the event? What could the painter have seen, and what did he imagine?"),
  ("What is left out", "Who and what is not in the picture? What happened before and after this moment?")]

# moments from the posters and rooms, to paint
MOMENTS = [
  "John Adams writes to Abigail on July 3, 1776, certain the Second of July will be celebrated with parades and illuminations",
  "John Dunlap prints about 200 copies on the evening of July 4 and the early morning of July 5, 1776",
  "Charles Carroll adds “of Carrollton” to his signature: the story goes, so there could be no mistaking which Charles Carroll had signed",
  "Mary Katharine Goddard sets her own name at the foot of the first printing with the signers’ names, 1777",
  "Washington voluntarily gives up power and returns to his farm",
  "The faded parchment today, in the Rotunda of the National Archives"]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read a history painting for its focal point, composition, light and color",
     "read a history painting for its focal point, composition, light and color?", False),
    ("compare how Trumbull and Leutze each turn a moment of 1776 into a scene",
     "compare how Trumbull and Leutze each make a moment into a scene?", False),
    ("plan and sketch a scene from the exhibition, using composition and light on purpose",
     "plan and sketch a scene, using composition and light on purpose?", False),
    ("judge how a painting made decades later can shape the story people remember",
     "judge how a painting can shape the story people remember?", True)],
  "why": "Most people’s picture of 1776 comes from paintings made long afterward. An artist who can read those choices can see the myth, and make images of their own on purpose."}

FIT_CSS = """
.pt { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 10pt; }
.pt > div { break-inside: avoid; }
.pt img { width: 100%; height: 128pt; object-fit: cover; border-radius: 4pt; border: .8pt solid #1d1c1a; display: block; }
.pt h4 { margin: 5pt 0 0; } .pt .by { font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin: 0 0 3pt; }
.pt p { font-size: 9pt; line-height: 1.4; margin-bottom: 4pt; }
.pt .cr { font: 400 6.6pt 'Outfit'; color: #5F6655; }
.refs { font-size: 9.2pt; }
"""

def paintings(credit=True):
    imgs = [A + "trumbull.jpg", A + "leutze.jpg"]
    crs = [TRUMBULL, LEUTZE]
    out = ""
    for (t, by, shows, says), img, cr in zip(PAINTINGS, imgs, crs):
        c = f'<p class="cr">{md(cr)}</p>' if credit else ""
        out += f'<div><img src="{img}" alt=""><h4>{md(t)}</h4><p class="by">{md(by)}</p><p>{md(shows)}</p><p>{md(says)}</p>{c}</div>'
    return f'<div class="pt">{out}</div>'

PAIR = [
  {"img": A + "trumbull.jpg", "alt": T_ALT, "label": "Trumbull, 1818", "fit": "cover", "pos": "center 60%"},
  {"img": A + "leutze.jpg", "alt": L_ALT, "label": "Leutze, 1851", "fit": "cover", "pos": "center 45%"}]

LESSON = {
  "slug": "painting-the-moment",
  "out": DIR + "A250_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + FIT_CSS,
  "blocks": [
    ("timing", TIMING_45),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the two paintings the exhibition’s posters are built around, Trumbull’s *Declaration of Independence* and Leutze’s *Washington Crossing the Delaware*, as **history paintings**: scenes composed long after the event, with a focal point, a structure and a mood chosen by the painter. They will see how those choices help make the story people remember, then plan and sketch a scene of their own from the exhibition."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Responding** — describing, analyzing and interpreting a work of art; the elements and principles of design",
      "**Creating** — planning a composition with a focal point, light and a structure; thumbnail sketches",
      "**Connecting** — art in its time: how images shape memory, and history in art",
      "**History** — Washington was not in the room; the Declaration was signed later than it was presented"]}),
    ("section", {"label": "Materials needed", "list": [
      "Both paintings projected, from the two posters; the *Show your class* page (page 3)",
      "Pencils, paper for thumbnails, colored pencils if you have them; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Where does your eye go?",
      "screen": {"phase": "Hook", "show": "artwork", "work": "Washington Crossing the Delaware", "artist": "Emanuel Leutze", "date": "1851",
                 "img": L_PIC, "alt": L_ALT,
                 "purpose": "Look before knowing: let the painting work on students, then ask how.",
                 "students": [HOOK_Q, "What mood does the painter want you to feel?"]},
      "body": [f"Project Leutze’s painting for a full minute in silence. Then ask: *“{HOOK_Q}”* Most eyes land on Washington, standing against the brightest part of the sky, or on the flag. Ask about the mood. Then give one fact: Leutze painted it in **1851**, seventy-five years after 1776. *“He never saw this moment. Everything here is a choice.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Two paintings, two moments",
      "screen": [
        {"phase": "Teach", "minutes": 8, "script": [0, 1], "title": "Two history paintings", "show": "pair", "items": PAIR,
         "purpose": "Read both paintings with the same questions, side by side.",
         "students": ["Find the focal point of each.", "One is calm, one is in motion. How does each painter do it?"]},
        {"phase": "Teach", "minutes": 5, "script": [2], "title": "What is left out", "show": "image",
         "img": pic("trumbull-committee.jpg", TRUMBULL), "alt": "A detail of Trumbull’s painting: the five-man drafting committee standing at the table as Jefferson lays down the draft",
         "caption": "Trumbull, *Declaration of Independence*, detail: the drafting committee presents the draft",
         "purpose": "See that a history painting is a choice of moment, and that some things are left out.",
         "students": ["Who is not in this room?", "What happened before and after this moment?"]}],
      "body": [
        "Show both paintings (page 3) and read them with the five questions. **Trumbull** builds a calm, wide room: the delegates in rows on both sides, the light falling on the floor and on the five men at the center, the strongest red in the curtains and in Hancock’s armchair. **Leutze** builds a strong diagonal: the boat runs across the canvas, oars and poles cut against it, and Washington stands highest, against the brightest sky.",
        "Compare the moods: order and ceremony against danger and effort. Ask which painting feels more like the beginning of a nation, and why.",
        "Then read what the exhibition says beside them. Trumbull’s painting shows the draft being presented; most delegates signed the parchment on August 2, and George Washington never signed at all: he was commanding the army. Ask: *who is not in this room, and what happened before and after?* A history painting chooses one moment and makes it the story."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the paintings closely, then compose a scene, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the same two paintings and end with a scene of your own."]},
      "body": ["Students choose a handout. All three levels read the same two paintings and end with a thumbnail sketch of a moment from the exhibition."]}),
    ("levels", {
      "green": "Find the focal point, the brightest light and the diagonal in Leutze’s painting with a checklist, then sketch a moment from the posters with one focal point and one light source.",
      "yellow": "Compare Trumbull and Leutze in a chart of five questions, then plan a scene in two thumbnails and write a short artist’s statement.",
      "red": "Judge how each painting helps make the myth the poster describes, including the flag in Leutze’s boat, then design a scene that tells the story more truly and defend your choices."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "A gallery of moments",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "A gallery of moments", "show": "words",
         "text": "Most people picture the Declaration from paintings made decades later.\nWhat will your picture make people remember?",
         "purpose": "Share the sketches and name the choices in them.",
         "students": ["Point to your focal point.", "What did you leave out, and why?"]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Lay the sketches out as a quick gallery. Three students, one from each level if you can, point to their focal point and name one thing they left out on purpose. Ask the class: *which sketch would change how people picture 1776?*",
               look_back_say()]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Leutze:** focal point Washington, standing highest against the brightest sky; the boat makes the main diagonal; the flag is a second focal point. **Trumbull:** focal point the five men at the center, lit and framed by the seated rows; Hancock in his red chair closes the scene on the right.",
      "**Red, the flag:** *Add a Star* gives June 14, 1777, as the date Congress first called for thirteen stars in a blue field, and the poster sets the painting beside the months after the Declaration in 1776. Credit students who ask whether that flag yet existed, and who see it as the painter’s choice, made in 1851 for viewers who knew the flag.",
      "**Assess the sketch:** one clear focal point; light used on purpose; a structure (row, triangle or diagonal); a stated choice of what to leave out."]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The two paintings of the posters",
      "body": ["Project or print this page for the lesson. Both paintings are in the public domain, and the exhibition shows details of each beside its posters."]}),
    ("html", paintings()),
    ("section", {"label": "Show your class", "title": "Five questions for any history painting"}),
    ("refs", FIVE),
    ("section", {"label": "Moments to paint", "list": MOMENTS}),
    ("connection", ["**Visit the exhibition:** on each poster, the painting rises in details beside the text: Trumbull’s delegates, the draft on the table and Hancock in his red chair; Leutze’s rowers, the ice, and Washington with the flag behind him. Have students find each detail and say what it adds to the paragraph beside it."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The exhibition’s two posters are built around two famous paintings: John Trumbull’s *Declaration of Independence* (1818) and Emanuel Leutze’s *Washington Crossing the Delaware* (1851). Both were painted decades after 1776. Today you read the painters’ choices, then make your own."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": EV_CSS + FIG_CSS + FIT_CSS + css}

H_CSS = """
.checks { list-style: none; padding: 0; margin: 2pt 0 6pt; display: grid; grid-template-columns: 1fr 1fr; gap: 3pt 14pt; font-size: 9.6pt; }
.checks li::before { content: "☐  "; font-size: 11pt; }
table.fill td:first-child { width: 22%; font-weight: 500; }
table.fill td { padding: 4pt 6pt 15pt 0; }
.thumbs { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
.thumbs .drawbox { height: 120pt; }
"""

def checks(items):
    return '<ul class="checks">' + "".join(f"<li>{md(i)}</li>" for i in items) + "</ul>"

def moments(n=None):
    items = MOMENTS if n is None else MOMENTS[:n]
    return "<ol style='margin:2pt 0 6pt;padding-left:14pt;font-size:9.2pt'>" + "".join(f"<li>{md(m)}</li>" for m in items) + "</ol>"

GREEN = handout("green", "A250_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Look closely at Leutze’s painting",
            "blocks": [("html", fig(A + "leutze.jpg", LEUTZE, h=150, pos="center 45%"))],
            "body": ["Tick each one when you find it in the picture. Then circle it on the picture."]}),
  ("html", checks(["Washington, standing highest in the boat", "The brightest part of the sky",
                   "The flag of stars and stripes", "A pole or oar that makes a slanting line",
                   "Ice floes in the river", "Another boat behind"])),
  ("task", {"label": "Part 2", "title": "The painter’s choices",
            "body": ["**a.** Where does your eye go first? ______________________________________",
                     "**b.** Leutze put Washington against the brightest sky. Why? ________________________________",
                     "**c.** Leutze painted this in 1851. How many years after 1776 is that? ______  Could he have seen it? ______"]}),
  ("task", {"label": "Part 3", "title": "Sketch a moment",
            "blocks": [("html", moments(4)), ("draw", "My moment")],
            "body": ["Choose one moment from the exhibition. Sketch it with **one focal point** and **one light source**. Put the most important person where the light is brightest."]}),
  ("connection", ["On the poster *Before it was Sacred*, find Trumbull’s painting. Where does the light fall in that room?"]),
], H_CSS + ".drawbox { height: 250pt; }")

YELLOW = handout("yellow", "A250_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Two paintings, five questions",
            "blocks": [("html", '<div class="thumbs">' + fig(A + "trumbull.jpg", "Trumbull, *Declaration of Independence*, 1818", h=105, pos="center 60%")
                        + fig(A + "leutze.jpg", "Leutze, *Washington Crossing the Delaware*, 1851", h=105, pos="center 45%") + "</div>")],
            "body": ["Compare the two paintings. Write a few words in each box."]}),
  ("table", {"head": ["Question", "Trumbull, 1818", "Leutze, 1851"], "rows": [
      ["Focal point", "", ""], ["Composition", "", ""], ["Light and color", "", ""],
      ["Mood", "", ""], ["What is left out", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Plan your scene",
            "blocks": [("html", moments()), ("html", '<div class="thumbs"><div class="drawbox"><span>Thumbnail 1</span></div><div class="drawbox"><span>Thumbnail 2</span></div></div>')],
            "body": ["Choose a moment. Sketch two quick thumbnails: one with a calm structure like Trumbull’s, one with a strong diagonal like Leutze’s."]}),
  ("task", {"label": "Part 3", "title": "Artist’s statement",
            "body": ["Which thumbnail tells the moment better? Name your focal point, where the light falls, and one thing you left out on purpose."], "lines": 4}),
  ("connection", ["Trumbull painted his scene forty-two years after 1776, Leutze seventy-five. What could each painter not know about the moment?"]),
], H_CSS + ".thumbs .drawbox { height: 165pt; }")

RED = handout("red", "A250_Handout_Red_Art.pdf", [
  ("section", {"label": "The artist’s question", "title": "Painting a myth",
               "body": ["The poster *Before it was Sacred* argues that the story most Americans tell about 1776 is a myth: one sudden moment, with the Founders signing a nation into being. A history painting can make a moment feel like the whole story."]}),
  ("task", {"label": "Part 1", "title": "How does each painting make the myth?",
            "blocks": [("html", ev([("Trumbull’s room", "The draft is presented to Hancock before the delegates, in one calm, ceremonial hall. Most delegates signed the parchment weeks later, on August 2. Washington never signed."),
                                    ("Leutze’s boat", "Washington stands highest against the brightest sky, as the boat drives through the ice. The poster says that by November 1776 he was retreating across New Jersey with perhaps 3,000 effective troops.")]))],
            "body": ["For each painting, name one choice of **composition or light** that makes the moment feel certain or heroic, and say what it hides."], "lines": 4}),
  ("task", {"label": "Part 2", "title": "The flag in the boat",
            "body": ["*Add a Star* gives the date Congress first called for a flag of “thirteen stars, white in a blue field”: **June 14, 1777**. The poster sets Leutze’s painting beside the hard months after the Declaration, in 1776. What question does that raise about the flag in the boat? Why might a painter in 1851 put it there?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "A truer picture",
            "blocks": [("html", moments()), ("draw", "My design")],
            "body": ["Design a history painting that tells a moment from the exhibition **more truly** than either painting. Then, under your sketch, write two sentences defending one choice of composition and one choice of light."]}),
  ("connection", ["On the posters, find the details the exhibition cuts from each painting. Which detail tells the truest story on its own?"]),
], H_CSS + ".drawbox { height: 215pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
