"""Grades 5–8 · Art · "Good Design for Everyone"
Ornament and everyday design, from poster 1's account of the V&A (founded
1852 to show decorative arts and design and to educate the public; Henry
Cole's "a schoolroom for everyone"; the Chamber of Horrors; the first
refreshment rooms) with the court dress and the Centre Refreshment Room
the exhibition shows, and the gilt and lace borders of the Christmas Card
Maker. What students say about the pictures is their own looking; the
lesson adds no facts about the objects beyond the exhibition's."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/art/"
TITLE = "Good Design for Everyone"
SUB = "Grades 5–8 · Art · Motif, pattern and the decorative arts"

HERO = {"img": COURT_DRESS, "pos": "center 30%", "credit": COURT_DRESS_CREDIT}

HOOK_Q = "A museum once opened a gallery of badly designed everyday objects. What would you put in it, and why?"
CRIT_Q = "Is it well designed? Which choices make you say so?"
COLE = "a schoolroom for everyone"

OBJECTIVES = objectives([
    ("identify motif, repetition, symmetry and border in Victorian decorative design",
     "find motif, repetition, symmetry and border in a design?", False),
    ("design a repeating border for an everyday object from a motif of your own",
     "design a repeating border from your own motif?", False),
    ("explain how a design’s ornament suits, or fights, the object’s use",
     "explain how ornament suits an object’s use?", False),
    ("argue whether good design can be taught, using the V&A’s Chamber of Horrors as evidence",
     "argue whether good design can be taught?", True)],
  "The V&A was founded so that everyone could learn from good design. Every object you use was designed by someone; learning to see those choices lets you make your own.")

LOOK = [
  {"label": "Court dress, 1860s", "text": "Ivory silk; an 11-foot train embroidered with roses and edged with lace.",
   "items": [{"img": COURT_DRESS, "caption": "V&A T.329 to B, AA-1977. © Victoria and Albert Museum, London", "aspect": 900 / 1257,
              "alt": "A Victorian court dress of ivory silk on a mannequin holding a fan: a wide crinoline skirt and a long train spreading across the floor, edged with lace and embroidered with roses"}]},
  {"label": "The Centre Refreshment Room, opened 1868", "text": "The museum’s refreshment rooms were the first of their kind in the world.",
   "items": [{"img": ROOM, "caption": "V&A E.655-2009. © Victoria and Albert Museum, London", "aspect": 1510 / 1250,
              "alt": "A sepia photograph of a grand Victorian dining room: tables laid with white cloths beneath tall arched stained-glass windows, patterned columns and a painted, vaulted ceiling"}]},
  {"label": "Two card borders", "text": "Gilt and paper lace, from the exhibition’s Christmas Card Maker.",
   "items": [{"img": BORDER_GILT, "caption": "Gilt", "aspect": 997 / 1250, "alt": "A gilt card border of scrolling golden leaves with sprigs of holly and red berries"},
             {"img": BORDER_LACE, "caption": "Lace", "aspect": 946 / 1250, "alt": "A cream paper-lace card border with a scalloped edge and openwork patterns"}]}]

VOCAB = [
  ("Motif", "One shape or picture that a design repeats: a rose, a leaf, a sprig of holly."),
  ("Repetition", "The motif used again and again, so the eye follows it like a rhythm."),
  ("Symmetry", "One half mirrors the other, across a line or around a center."),
  ("Border", "A band of pattern that runs along an edge and frames what is inside."),
  ("Ornament", "Decoration added to an object, beyond what it needs to work."),
  ("Function", "What the object is for: to wear, to sit at, to send, to hold."),
]

PLAN_CSS = """
.cards { grid-template-columns: repeat(3, 1fr); gap: 7pt; } .card { padding: 6pt 8pt 2pt; } .card .cn { display: none; }
.card h4 { margin-top: 0; } .card p { font-size: 8.6pt; line-height: 1.36; }
.look { display: grid; grid-template-columns: 0.72fr 1.2fr 0.8fr 0.76fr; gap: 9pt; align-items: end; margin: 4pt 0 8pt; }
.look figure { margin: 0; } .look img { width: 100%; display: block; border: 1pt solid #1d1c1a; border-radius: 3pt; }
.look img.bd { border: 0; } .look figcaption { font: 400 7pt/1.3 'Outfit'; color: #5b5a55; margin-top: 3pt; }
.look figcaption b { display: block; color: #1d1c1a; font-weight: 500; font-size: 8pt; }
"""


def look_row(credits=True):
    items = [(COURT_DRESS, "Court dress, 1860s", COURT_DRESS_CREDIT, ""), (ROOM, "The Centre Refreshment Room, opened 1868", ROOM_CREDIT, ""),
             (BORDER_GILT, "A gilt border", "From the Christmas Card Maker", "bd"), (BORDER_LACE, "A paper-lace border", "From the Christmas Card Maker", "bd")]
    figs = "".join(f'<figure><img class="{c}" src="{pic(p)}" alt=""><figcaption><b>{n}</b>{md(cr) if credits else ""}</figcaption></figure>' for p, n, cr, c in items)
    return '<div class="look">' + figs + "</div>"


LESSON = {
  "slug": "good-design-for-everyone",
  "out": DIR + "VIC_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 12, TEACH), ("Activity", 20, WORK), ("Debrief", 8, CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["The Victoria and Albert Museum was founded in 1852 to show decorative arts and design, to inspire creativity and educate the public: *“" + COLE + ",”* in the words of its first director, Henry Cole. Students will look closely at Victorian design the exhibition shows — a court dress, the museum’s own refreshment room, and two Christmas card borders — and name how each uses **motif**, **repetition**, **symmetry** and **border**. They will design a repeating border of their own for an everyday object, and weigh ornament against function."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Visual art** — elements and principles of design: pattern, repetition, symmetry, rhythm",
      "**Creating** — developing a motif and a design to fit a purpose",
      "**Responding** — critique against criteria; design in its historical setting"]}),
    ("section", {"label": "Materials needed", "list": [
      "The pictures on page 3, on screen or printed; the handouts, one per student",
      "Pencils, erasers, rulers; colored pencils and tracing paper if you have them"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A Chamber of Horrors",
      "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q,
                 "purpose": "Start with judgment: what makes a design good or bad?",
                 "students": ["Name one everyday object you think is badly designed.", "What would make it better?"]},
      "body": ["Ask: *“" + HOOK_Q + "”* Take a few answers and ask *why* each time. Then tell students it really happened: the young V&A once had a *“Chamber of Horrors,”* a gallery of badly designed everyday objects, meant to teach visitors good taste. The manufacturers were mortified and complained, and it closed after only two weeks."]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "How Victorian design repeats",
      "screen": [
        {"phase": "Teach", "minutes": 9, "script": [0, 1], "title": "Look closely", "show": "gallery", "groups": LOOK,
         "purpose": "Find motif, repetition, symmetry and border in three kinds of Victorian design.",
         "students": ["Find a motif. Where does it repeat?", "Where is there symmetry?", "What is each object for?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "A schoolroom for everyone", "show": "words",
         "text": "“" + COLE[0].upper() + COLE[1:] + ".”", "cite": "Henry Cole, the V&A’s first director",
         "purpose": "Connect design to the museum’s purpose: everyone can learn to see it.",
         "students": ["What could a museum of everyday objects teach?"]}],
      "body": [
        "**Look before naming.** Show the three groups and give students two minutes to point and describe before any words are taught. Then name what they found with the cards below: roses along the dress’s 11-foot train and lace at its edge; the room’s patterned columns, arched stained-glass windows and painted ceiling; the gilt scrolls and scalloped lace of the borders.",
        "**Ornament and function.** Ask what each object is *for*. The dress was worn to be presented at court, where young women practiced for hours to curtsey and walk backward in it; the refreshment room was where visitors ate; a card was sent. Does the ornament help the object do its job, or get in the way?",
        "**Why a museum?** Gas lighting let the V&A open on winter evenings, so working people could learn from good design too."]}),
    ("cards", [(a, [b]) for a, b in VOCAB]),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design a repeating border at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Sketch lightly first: designers try many versions."]},
      "body": ["Students choose a handout. Every level ends with a border of the student’s own design for an everyday object."]}),
    ("levels", {
      "green": "Finish a mirror-symmetric motif on a grid; continue a border’s repeat; design a border for a card with your own motif.",
      "yellow": "Find the design choices in two Victorian pieces; try one motif three ways (straight, flipped, mirrored); design a border for an object you choose and explain it.",
      "red": "Critique the four pieces for ornament and function; write design criteria; design a border to meet them; argue whether good design can be taught."}),
    ("section", {"label": "Debrief · 8 minutes", "title": "A gallery, not a chamber",
      "screen": [
        {"phase": "Debrief", "minutes": 5, "script": [0], "title": "Gallery walk", "show": "question", "question": CRIT_Q,
         "purpose": "Critique each other’s borders kindly, by the criteria.",
         "students": ["Name the motif.", "How does it repeat?", "Does it suit the object’s use?"]},
        review_step(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Lay the borders out as a gallery. Partners leave a note on one design: the motif, how it repeats, and whether it suits the object. Close with the hook’s question turned round: *the Chamber of Horrors closed after two weeks. Was it fair to call objects “bad”? Who decides?*",
               "Put the objectives back up as *“Can you now…?”* for a thumb up, sideways or down."]}),
    ("section", {"label": "Assessment", "list": [
      "Names a motif, a repetition and a symmetry in the Victorian examples; makes a border with a clear motif, a steady repeat and solved corners; explains how it suits the object’s use. **Exit ticket:** *name one choice in your design and why.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four Victorian designs",
                 "body": ["Two pieces from the V&A’s collection, as the exhibition credits them, and two borders from the exhibition’s Christmas Card Maker."]}),
    ("html", look_row()),
    ("section", {"label": "From the exhibition", "title": "Design, the museum and everyone",
      "list": ["The V&A was founded in **1852**, showcasing decorative arts and design to inspire creativity and educate the public. Its first director, **Henry Cole**, said it should be *“" + COLE + ".”*",
               "The museum once had a **Chamber of Horrors**: a gallery of badly designed everyday objects, meant to teach visitors good taste. The manufacturers complained, and it closed after only two weeks.",
               "Its **refreshment rooms** were the first of their kind in the world. **Gas lighting** let its galleries open on winter evenings, so working people could visit after a day’s work.",
               "The **court dress**, of ivory silk, was made in the 1860s. Its wide skirt sat over a crinoline, a light cage of spring-steel hoops; its embroidered train is 11 feet long.",
               "Henry Cole also sent the **first Christmas card**, in 1843, illustrated by his friend John Callcott Horsley."]}),
    ("connection", ["**Visit the exhibition:** in the *Christmas Card Maker,* try each border — gilt, lace, holly and plain — on the same picture, and decide which suits it best. On poster 1, find the court dress and the V&A’s story."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Victoria and Albert Museum was founded in 1852 to show decorative arts and design to everyone: *“" + COLE + ",”* said its first director, Henry Cole. Victorian designers loved ornament: a **motif**, repeated along a **border**, often in **symmetry**."]

H_CSS = """
.look { display: grid; grid-template-columns: 0.72fr 1.2fr 0.8fr 0.76fr; gap: 8pt; align-items: end; margin: 4pt 0 8pt; width: 74%; }
.look figure { margin: 0; } .look img { width: 100%; display: block; border: 1pt solid #1d1c1a; border-radius: 3pt; }
.look img.bd { border: 0; } .look figcaption { font: 400 7pt/1.3 'Outfit'; color: #5b5a55; margin-top: 3pt; }
.look figcaption b { display: block; color: #1d1c1a; font-weight: 500; font-size: 8pt; }
.vocab { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4pt 10pt; font-size: 8.6pt; line-height: 1.3; margin: 2pt 0 8pt; }
.vocab b { display: block; font: 600 11pt 'Cormorant Garamond', serif; }
.box { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); }
.strip { display: grid; grid-template-columns: 70pt 1fr; gap: 8pt; align-items: center; margin: 4pt 0 6pt; font: 500 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; }
.strip .box { height: 40pt; background-image: repeating-linear-gradient(90deg, transparent 0 45.5pt, #b9b5aa 45.5pt 46pt); }
.crit { font-size: 9pt; }
"""

handout = handout_maker(DIR, TITLE, "Grades 5–8 · Art", "Grades 5–8 Art", CONTEXT, HERO, H_CSS)


def dots(cols, rows, step, extra="", mirror=True, w=None):
    W, H = cols * step + 2 * step, rows * step + 2 * step
    g = [f'<circle cx="{step + i * step}" cy="{step + j * step}" r="1.1" fill="#8d8a80"/>' for i in range(cols + 1) for j in range(rows + 1)]
    if mirror:
        x = step + cols * step / 2
        g.append(f'<line x1="{x}" y1="{step * .4}" x2="{x}" y2="{H - step * .4}" stroke="#A8452F" stroke-width="1.1" stroke-dasharray="4 3"/>')
    return f'<svg viewBox="0 0 {W} {H}" style="width:{w or W}pt;display:block">' + "".join(g) + extra + "</svg>"


# half a leaf-and-bud motif on a 10 × 10 dot grid: the left half, to the mirror line at x = 5
def half_motif(step):
    pts = [(5, 1), (4, 2), (3, 2), (2, 3), (2, 4), (3, 5), (4, 5), (3, 6), (1, 6), (1, 8), (3, 8), (5, 9)]
    s = " ".join(f"{step + x * step},{step + y * step}" for x, y in pts)
    stem = f'<line x1="{step + 5 * step}" y1="{step + 5 * step}" x2="{step + 3 * step}" y2="{step + 7 * step}" stroke="#1d1c1a" stroke-width="2"/>'
    return f'<polyline points="{s}" fill="none" stroke="#1d1c1a" stroke-width="2.2" stroke-linejoin="round"/>' + stem


def border_frame(w, h, band, start=False):
    """An empty frame for a border: the band to fill, with an optional first motif drawn in the corner."""
    inner = f'<rect x="{band}" y="{band}" width="{w - 2 * band}" height="{h - 2 * band}" fill="none" stroke="#1d1c1a" stroke-width="1"/>'
    ticks = "".join(f'<line x1="{x}" y1="0" x2="{x}" y2="{band}" stroke="#b9b5aa" stroke-width=".6"/>' for x in range(band, w - band + 1, band))
    ticks += "".join(f'<line x1="{x}" y1="{h - band}" x2="{x}" y2="{h}" stroke="#b9b5aa" stroke-width=".6"/>' for x in range(band, w - band + 1, band))
    ticks += "".join(f'<line x1="0" y1="{y}" x2="{band}" y2="{y}" stroke="#b9b5aa" stroke-width=".6"/>' for y in range(band, h - band + 1, band))
    ticks += "".join(f'<line x1="{w - band}" y1="{y}" x2="{w}" y2="{y}" stroke="#b9b5aa" stroke-width=".6"/>' for y in range(band, h - band + 1, band))
    first = ""
    if start:
        c = band * 1.5
        first = (f'<g transform="translate({c} {band / 2})" stroke="#1d1c1a" stroke-width="1.6" fill="none">'
                 f'<path d="M-{band * .34} 0 Q0 -{band * .3} {band * .34} 0 Q0 {band * .3} -{band * .34} 0Z"/><path d="M0 -{band * .34} Q-{band * .3} 0 0 {band * .34} Q{band * .3} 0 0 -{band * .34}Z"/></g>'
                 f'<g transform="translate({c + band} {band / 2})" stroke="#1d1c1a" stroke-width="1.6" fill="none">'
                 f'<path d="M-{band * .34} 0 Q0 -{band * .3} {band * .34} 0 Q0 {band * .3} -{band * .34} 0Z"/><path d="M0 -{band * .34} Q-{band * .3} 0 0 {band * .34} Q{band * .3} 0 0 -{band * .34}Z"/></g>')
    return (f'<svg viewBox="0 0 {w} {h}" style="width:{w}pt;display:block;margin:4pt auto 6pt;background:rgba(255,255,255,.6)">'
            f'<rect x="0" y="0" width="{w}" height="{h}" fill="none" stroke="#1d1c1a" stroke-width="1.2"/>{inner}{ticks}{first}</svg>')


GREEN = handout("green", "VIC_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Look closely",
            "blocks": [("html", look_row(credits=False) + "<p>Circle one <b>motif</b> you can see. Where does it <b>repeat</b>?</p>")], "lines": 1}),
  ("task", {"label": "Part 2", "title": "Finish the motif",
            "blocks": [("html", '<div style="display:grid;grid-template-columns:auto 1fr;gap:16pt;align-items:center">'
                        + dots(10, 10, 14, half_motif(14), w=140)
                        + "<div><p>Victorian designers often used <b>mirror symmetry</b>: one half reflects the other across a line.</p><p>Draw the other half of this leaf on the right of the dotted line, dot for dot.</p></div></div>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Design a card border",
            "blocks": [("html", "<p>Choose your own motif: a leaf, a star, a holly sprig, a shape you invent. Two are drawn to start you; replace them if you like. Repeat your motif all the way round the card. Make the four corners match.</p>"
                        + border_frame(330, 300, 30, start=True))]}),
  ("task", {"label": "Part 4", "title": "Name your choices",
            "body": ["My motif is ______________________. It repeats ______________________. My border suits a card because ______________________________________________."]}),
  ("connection", ["In the exhibition’s *Christmas Card Maker,* try each border — gilt, lace, holly and plain — on the same picture. Which border suits it best? ____________"]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Find the choices",
            "blocks": [("html", look_row(credits=False))]}),
  ("table", {"head": ["", "The court dress", "The refreshment room"], "rows": [
      ["A motif", "", ""], ["Where it repeats", "", ""], ["Symmetry: where?", "", ""], ["What it is for", "", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "One motif, three ways",
            "blocks": [("html", "<p>Draw a simple motif of your own in the first square of each strip. Then repeat it three ways.</p>"
                        + "".join(f'<div class="strip"><span>{n}</span><div class="box"></div></div>' for n in ("Straight repeat", "Flip every other", "Mirrored pairs")))]}),
  ("task", {"label": "Part 3", "title": "Design a border for an everyday object",
            "blocks": [("html", "<p>Choose an object: a plate, a book cover, a tile, a card, a box lid. Write it here: ______________________. Design a border for it with your motif. Choose one of your three repeats, and solve the corners.</p>"
                        + border_frame(330, 180, 30))]}),
  ("task", {"label": "Part 4", "title": "Explain your design",
            "body": ["Which repeat did you choose, and why? How does your border suit the object’s use?"], "lines": 2}),
  ("connection", ["The V&A was meant to be *“" + COLE + ".”* In the exhibition, find the court dress on poster 1. What would a visitor in 1852 learn from looking at it closely?"]),
], "table.fill td:first-child { width: 26%; } table.fill td { height: 52pt; }")

RED = handout("red", "VIC_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Ornament and function",
            "blocks": [("html", look_row(credits=False))]}),
  ("table", {"head": ["", "What it is for", "Its ornament", "Does the ornament help or hinder?"], "rows": [
      ["Court dress", "", "", ""], ["Refreshment room", "", "", ""], ["Gilt border", "", "", ""], ["Lace border", "", "", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Write your criteria",
            "body": ["A designer works to criteria: what the design must do. Write three criteria for a good border on an everyday object. Use at least two of these words: *motif, repetition, symmetry, function.*"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Design to your criteria",
            "blocks": [("html", "<p>Choose an everyday object: ______________________. Design its border. Annotate the design: label the motif, the repeat and how you solved the corners.</p>"
                        + border_frame(330, 180, 30))]}),
  ("task", {"label": "Part 4", "title": "Can good design be taught?",
            "body": ["The young V&A once had a *“Chamber of Horrors”*: a gallery of badly designed everyday objects, meant to teach visitors good taste. The manufacturers were mortified and complained, and it closed after only two weeks.",
                     "Was it fair? Can good design be taught, or is it only taste? Make a claim, use the Chamber of Horrors and one of the four pieces as evidence, and answer one objection."], "lines": 3}),
  ("connection", ["In the exhibition’s *Christmas Card Maker,* test your criteria: try every border on one picture and judge each one by them."]),
], "table.fill td:first-child { width: 22%; } table.fill td { height: 52pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
