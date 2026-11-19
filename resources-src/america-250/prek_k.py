"""PreK–Kindergarten · "We Put Our Names to It"
Signing a promise: the Declaration's 56 signers, John Hancock's big
signature on Stone's engraving, the 13 stars of the first flag, and the
class's own promise. Facts follow app/exhibitions/america-250/america250.ts
(both posters), sign/signText.ts (the copies, Add a Star), sign/declaration.ts
(the closing pledge; the owner's Class Declaration, word for word) and
copies/missions.ts. No treason, war or punishment detail at this age."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import (A, CP, TRUMBULL, STONE_CR, pic, md, OBJ_CSS, FLOW_CSS, ZOOM_CSS, zoom,
                     STONE_SIZE, LOOK_BACK, THUMBS, review)

DIR = "teachers/prek-k/"
TITLE = "We Put Our Names to It"
SUB = "PreK–Kindergarten · Signing the Declaration"
STONE = CP + "stone.jpg"
HERO = pic("copies/stone.jpg", STONE_CR, "center 77%")

# the boxes of single signatures on Stone's engraving (fractions of the sheet)
SIGS = {"hancock": (.385, .742, .575, .79), "franklin": (.575, .783, .685, .818),
        "jefferson": (.42, .908, .54, .938), "adams": (.81, .793, .905, .82)}
FOOT = (0, .736, 1, .985)

# the owner's Class Declaration (classroom version), word for word
KIND = "That we will be kind — to our classmates, to our school, and to everyone we meet."
PROMISES = ["We will come to school ready to learn.", "We will listen to our teachers.", "We will be kind."]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say that long ago, leaders signed their names on the Declaration to make a promise",
     "say why the leaders signed their names?", False),
    ("find the biggest signature on the Declaration: John Hancock’s",
     "find the biggest signature?", False),
    ("count the 13 stars of the first flag, one for each of the first 13 states",
     "count the 13 stars?", False),
    ("make a class promise, and sign it with your name or your mark",
     "make a promise and sign it?", True)],
  "why": "When we put our name to something, we are saying: I mean it.",
  "screen": {"heading": "I can…", "items": [
    "say why the leaders signed their names", "find the biggest signature",
    "count 13 stars", "make a promise and sign it"]}}

T_ALT = "John Trumbull’s Declaration of Independence: in a high-ceilinged hall hung with red curtains and captured flags, five men stand at the center presenting the draft to John Hancock, seated at the right, while the delegates of the Congress look on"
S_ALT = "William J. Stone’s engraving of the Declaration: the whole text in a flowing hand, and below it the signatures, every one clear and dark, John Hancock’s largest"

CSS = """
.sigs { display: flex; justify-content: center; align-items: center; gap: 18pt; margin: 6pt 0 10pt; flex-wrap: wrap; }
.sigs .zoom { border-width: 1.2pt; }
.stars { display: grid; grid-template-columns: repeat(var(--c, 7), auto); justify-content: center; gap: 6pt 12pt; margin: 6pt 0 8pt; }
.stars svg { display: block; }
.nums { display: flex; justify-content: center; gap: 26pt; margin: 4pt 0 6pt; }
.nums span { width: 50pt; height: 50pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 30pt/1 'Cormorant Garamond', serif; }
.sign { border: 1.2pt solid #1d1c1a; border-radius: 6pt; background: #fbf6e6; padding: 12pt 16pt 22pt; margin: 6pt 0 10pt; break-inside: avoid; }
.sign p { font: italic 400 15pt/1.35 'Cormorant Garamond', serif; margin: 0 0 4pt; }
.sign .line { border-bottom: 1.6pt solid #1d1c1a; height: 62pt; margin-top: 4pt; position: relative; }
.sign .line span { position: absolute; left: 0; bottom: -14pt; font: 500 7.5pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #5b5a55; }
.ticks { list-style: none; padding: 0; margin: 4pt 0 6pt; }
.ticks li { font: 400 14pt/1.3 'Outfit'; margin: 0 0 7pt; }
.ticks li::before { content: ""; display: inline-block; width: 15pt; height: 15pt; border: 1.4pt solid #1d1c1a; border-radius: 3pt; margin-right: 10pt; vertical-align: -2pt; background: #fff; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.lead { color: #1d1c1a; font: 400 34pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
.flag { display: flex; justify-content: center; margin: 6pt 0 8pt; }
.showgrid { display: grid; grid-template-columns: 180pt 1fr; gap: 16pt; align-items: start; margin: 4pt 0 8pt; break-inside: avoid; }
.showgrid img.big { width: 180pt; display: block; border: 1pt solid #1d1c1a; border-radius: 4pt; }
.showgrid .cr { font: 400 6.6pt 'Outfit'; color: #5F6655; margin-top: 3pt; }
"""

def star(size, n=None, fill="none"):
    pts = []
    import math
    for k in range(10):
        r = size / 2 if k % 2 == 0 else size / 2 * .42
        a = -math.pi / 2 + k * math.pi / 5
        pts.append(f"{size / 2 + r * math.cos(a):.1f},{size / 2 + r * math.sin(a) + size * .04:.1f}")
    label = (f'<text x="{size / 2}" y="{size * .62}" text-anchor="middle" font-family="Outfit" font-size="{size * .22:.0f}" fill="#7c796f">{n}</text>'
             if n else "")
    return (f'<svg width="{size}pt" height="{size}pt" viewBox="0 0 {size} {size}"><polygon points="{" ".join(pts)}" '
            f'fill="{fill}" stroke="#1d1c1a" stroke-width="1.4" stroke-linejoin="round"/>{label}</svg>')

def stars(count=13, size=46, numbered=False, cols=7):
    return (f'<div class="stars" style="--c:{cols}">' + "".join(star(size, i + 1 if numbered else None) for i in range(count)) + "</div>")

def nums(*ns):
    return '<div class="nums">' + "".join(f"<span>{n}</span>" for n in ns) + "</div>"

def sigs(keys, dw=900):
    out = ""
    for k in keys:
        x0, y0, x1, y1 = SIGS[k]
        out += zoom(STONE, STONE_SIZE, SIGS[k], (x1 - x0) * dw)
    return f'<div class="sigs">{out}</div>'

def sign_box(text, label="My name or my mark"):
    return f'<div class="sign"><p>{md(text)}</p><div class="line"><span>{label}</span></div></div>'

def flag(w=300):
    h = w / 1.9
    s = h / 13
    stripes = "".join(f'<line x1="0" y1="{s * i:.1f}" x2="{w}" y2="{s * i:.1f}" stroke="#1d1c1a" stroke-width=".8"/>' for i in range(1, 13))
    uw, uh = w * .4, s * 7
    return (f'<div class="flag"><svg width="{w}pt" height="{h:.0f}pt" viewBox="0 0 {w} {h:.1f}">'
            f'<rect x="0" y="0" width="{w}" height="{h:.1f}" fill="#fff" stroke="#1d1c1a" stroke-width="1.6"/>{stripes}'
            f'<rect x="0" y="0" width="{uw:.1f}" height="{uh:.1f}" fill="#fff" stroke="#1d1c1a" stroke-width="1.6"/></svg></div>')

# ── lesson plan ────────────────────────────────────────────────────────

CLOSE_SAY = f"Say: *“The leaders made a promise and signed it. Let’s make a promise for our class.”* Read the promise slowly, and let children say it back. The words are from *Our Class Declaration*, in the exhibition’s *Put Your Name to It* room: *“{KIND}”* Put a big sheet with the promise by the door, and let every child sign it during the day, with a name or a mark."

LESSON = {
  "slug": "we-put-our-names-to-it", "large": True,
  "out": DIR + "A250_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": OBJ_CSS + FLOW_CSS + ZOOM_CSS + CSS,
  "blocks": [
    ("timing", [("Circle time", 4, "#7D8471"), ("The story", 6, "#2F4A5A"), ("Look closely", 3, "#4A7346"),
                ("Activity", 9, "#86671A"), ("Close", 3, "#A8452F")]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed",
      "A large sheet of paper with the class promise written at the top",
      "Crayons, including blue and red, and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will learn that long ago, in 1776, leaders from 13 places wrote a big paper, the **Declaration of Independence**, and signed their names at the bottom to show they meant it. They will find the biggest signature, count the 13 stars of the first flag, and make and sign a promise of their own."]}),
               ("section", {"label": "Themes", "list": [
      "**History** — the Declaration, signed by 56 men; the 13 first states and the 13 stars",
      "**Citizenship** — a promise made together, and keeping it: being kind, listening, coming ready to learn",
      "**Early learning** — writing a name or a mark; counting to 13; big and small; listening and retelling"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "Where do you write your name?",
      "screen": {"phase": "Circle time", "show": "question",
                 "question": "Where do you write your name? Why do you write it there?",
                 "purpose": "Start from what children know: a name says this is mine, or this is me.",
                 "students": ["Show me with your finger how you write your name.", "Where do you write it?"]},
      "body": ["Ask: *“Where do you write your name?”* Children may say on a picture, on a card, on their cubby. Ask why. Help them say it: *“Your name says: this is mine. This is me.”* Let each child write their name in the air with one finger."]}),
    ("section", {"label": "The story · 6 minutes", "title": "A big paper and a promise",
      "screen": [
        {"phase": "The story", "minutes": 3, "script": [0], "title": "A big paper", "show": "artwork",
         "work": "Declaration of Independence", "artist": "John Trumbull", "date": "1818",
         "img": pic("trumbull.jpg", TRUMBULL, "center 62%"), "alt": T_ALT,
         "purpose": "Meet the leaders, and the big paper they wrote.",
         "students": ["Find the man in the red chair.", "Find the paper on the table."]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "A promise", "show": "words",
         "text": "They made a promise to each other.\nThen they signed their names.",
         "purpose": "Hear what a signature means: I mean it.",
         "students": ["Say it with me: I mean it!"]}],
      "body": [
        "Show the painting on page 3. *“Long ago, in 1776, leaders from 13 places met in a big room. Those 13 places are now 13 of our states. They wrote a big paper called the **Declaration of Independence**. It said: the king far away should not rule us any more. We will be a new country.”* Children find the man in the red chair: John Hancock, the leader of the meeting. Five men are bringing him the paper.",
        "*“At the end of the paper, the leaders made a promise to each other. Then 56 men signed their names at the bottom. Signing your name means: I mean it.”* Add one surprise: George Washington, the most famous of them all, did not sign. He was not even in the room. He was away, leading the army."]}),
    ("section", {"label": "Look closely · 3 minutes", "title": "The biggest name",
      "screen": {"phase": "Look closely", "show": "image", "fit": "cover",
                 "img": pic("copies/stone.jpg", STONE_CR, "center 76%"), "alt": S_ALT,
                 "caption": "The names at the bottom of the Declaration. One is the biggest of all.",
                 "purpose": "Find the biggest signature, by looking.",
                 "students": ["Point to the biggest name.", "Is it big or small?"]},
      "body": ["Show the names at the bottom of the Declaration (page 3). Ask: *“Which name is the biggest?”* Let children point. It is **John Hancock’s**, the man in the red chair, the biggest of them all. Then point to some small ones. *“Big or small, every name says the same thing: I mean it.”*"]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Find, count and sign on paper, at the right level for each child.",
                 "students": ["Find the biggest name.", "Count the 13 stars.", "Sign your name."]},
      "body": ["Before handing out the pages, say: *“There were 13 states. The first flag had a star for each one: 13 stars.”* Count to 13 together on your fingers and toes. Each child then works on a handout. All three find the biggest name, count 13 stars and end with a signature."]}),
    ("levels", {
      "green": "Picture-led. Circle the biggest of three names, color the 13 numbered stars, then write a name or make a mark under a short promise.",
      "yellow": "Circle the biggest name, count the stars and circle 13, tick the class promises and sign under them, then draw keeping one.",
      "red": "Find the biggest name among them all, draw 13 stars on the flag, then finish *I will…* and sign it."}),
    ("section", {"label": "Look back and our promise · 3 minutes",
      "screen": [
        review(OBJECTIVES, 1, [0], hint=THUMBS, phase="Close"),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Our class promise", "show": "words",
         "text": "We will be kind —\nto our classmates, to our school,\nand to everyone we meet.",
         "purpose": "Make a promise together, and sign it, as the leaders did.",
         "students": ["Say the promise together.", "Sign it with your name or your mark."]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               CLOSE_SAY]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Keeping it simple, and true",
      "body": [
        "**Why sign?** A signature says *I mean it*. The signers knew signing was dangerous; at this age, *brave* is enough. Leave the danger and the war for older grades.",
        "**“All men are created equal.”** In 1776 not everyone was treated as equal, and some people were left out. If a child asks whether it was fair to everyone, answer honestly: *no, not then.* Much later, Abraham Lincoln called those words the promise of the whole nation."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Says, in their own words, why the leaders signed",
      "Points to the biggest signature",
      "Counts 13 stars, with or without help",
      "Says part of the class promise, and signs it"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The big paper and its names",
      "body": ["Project or print this page for circle time."]}),
    ("html", '<div class="showgrid"><div><img class="big" src="' + STONE + '" alt=""><p class="cr">' + md(STONE_CR) + '</p></div><div>'
             '<p class="label">The Declaration of Independence</p><h3>56 names at the bottom</h3>'
             '<p>This is a copy of the Declaration, made long ago so that everyone could see the names clearly. Point to the names at the bottom. Which is the biggest?</p>'
             + zoom(STONE, STONE_SIZE, SIGS["hancock"], 250, "margin:8pt 0 4pt")
             + '<p style="font-size:9pt">John Hancock’s name, the biggest of all.</p>'
             + "<img src=\"" + A + "trumbull.jpg\" alt=\"\" style=\"width:100%;height:120pt;object-fit:cover;object-position:center 62%;border:1pt solid #1d1c1a;border-radius:4pt;margin-top:6pt\">"
             + '<p class="cr" style="font:400 6.6pt Outfit;color:#5F6655">' + md(TRUMBULL) + "</p>"
             + '<p style="font-size:9pt">The leaders bring the big paper to John Hancock, in the red chair.</p></div></div>'),
    ("section", {"label": "Questions to ask the children", "list": [
      "Where do you write your name? Why?",
      "What did the leaders promise? Why did they sign their names?",
      "Which name is the biggest? Can you find a small one?",
      "What promise can our class make, and keep?"]}),
    ("connection", ["**Visit the exhibition:** in *Put Your Name to It*, choose *Our Class Declaration*, fill in your teacher and grade, and let everyone sign. Print it for the wall. Nothing you sign is saved or sent. In *Add a Star*, count the flag’s first 13 stars together."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** Long ago, in 1776, leaders from 13 places wrote a big paper called the Declaration of Independence. It said: we will be a new country. The leaders made a promise to each other, and 56 of them signed their names. Signing your name means: *I mean it.*"]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": ZOOM_CSS + CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

FAMILY = "Ask your child: *why did the leaders sign their names?* Then make a family promise together, and let everyone sign it."

GREEN = handout("green", "A250_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Which name is the biggest? Circle it.",
            "blocks": [("html", sigs(["franklin", "hancock", "jefferson"], 1000))]}),
  ("task", {"label": "Part 2", "title": "The first flag had 13 stars. Color them blue, and count.",
            "blocks": [("html", stars(13, 50, True))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Make a promise. Sign it with your name or your mark.",
            "blocks": [("html", sign_box("I will be kind."))]}),
  ("task", {"label": "Part 4", "title": "Trace the number of stars.",
            "blocks": [("html", '<div class="trace"><div><span>13 13 13</span></div></div>')]}),
  ("task", {"label": "Part 5", "title": "Draw yourself being kind.",
            "blocks": [("draw", "Being kind")]}),
  ("family", [FAMILY]),
], ".trace span { letter-spacing: .18em; } body.young .drawbox { height: 190pt; }")

YELLOW = handout("yellow", "A250_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Which name is the biggest? Circle it.",
            "blocks": [("html", sigs(["adams", "jefferson", "hancock", "franklin"], 770))]}),
  ("task", {"label": "Part 2", "title": "Count the stars. Circle the number.",
            "blocks": [("html", stars(13, 40) + nums(3, 10, 13))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Our class promise. Tick each one, then sign.",
            "blocks": [("html", '<ul class="ticks">' + "".join(f"<li>{p}</li>" for p in PROMISES) + "</ul>"
                        + sign_box("We mean it.", "My name"))]}),
  ("task", {"label": "Part 4", "title": "Draw yourself keeping a promise.",
            "blocks": [("draw", "Keeping my promise")]}),
  ("family", [FAMILY]),
], "body.young .drawbox { height: 215pt; }")

RED = handout("red", "A250_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Here are all 56 names. Find the biggest one and circle it.",
            "blocks": [("html", '<div style="display:flex;justify-content:center">' + zoom(STONE, STONE_SIZE, FOOT, 400) + "</div>")]}),
  ("task", {"label": "Part 2", "title": "Draw 13 stars in the box at the corner of the flag. Then color the flag.",
            "blocks": [("html", flag(250))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Finish the promise, or tell a grown-up what to write. Then sign it.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">I will</span></div><div></div></div>'
                        + sign_box("I mean it.", "My name"))]}),
  ("task", {"label": "Part 4", "title": "Why do you think one name is so big? Tell a grown-up.",
            "blocks": [("draw", "John Hancock in his red chair")]}),
  ("family", [FAMILY]),
], "body.young .drawbox { height: 235pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
