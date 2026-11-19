"""Grades 5–8 · Art · "Designed to Be Seen"
Toy design as a set of choices: poster 2's contrast between Francie
("essentially a white doll design with darker skin") and Kitty Black
Perkins's first Black Barbie (Afrocentric facial features, natural
hairstyles, a glamorous design), the choices the Design a doll tab offers
(app/exhibitions/black-history/representation/dollArt.ts: its skin tones,
hairstyles, head coverings, extras and clothes, by their own labels), and
poster 1's own design. Students design a doll and write a designer's
statement.

No doll or packaging is pictured: the dolls here are drawn for the lesson,
in the Design a doll tab's own skin-tone swatches."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/art/"
TITLE = "Designed to Be Seen"
SUB = "Grades 5–8 · Art · Designing for representation"
HERO = HERO_RING

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Why would a toy designer offer all of these?"
TWO_DESIGNS = ("Francie, 1967:\n“essentially a white doll design with darker skin”\n\n"
               "The first Black Barbie, 1980:\n“Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty”")
SKIN_LABELS = ["deepest", "deep brown", "warm brown", "light golden brown", "olive", "light ivory", "fair", "very fair with freckles"]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("compare a doll made as “a white doll design with darker skin” with one designed with Afrocentric facial features and natural hairstyles",
     "compare Francie’s design with the first Black Barbie’s?", False),
    ("name the design choices that shape who can see themselves in a toy",
     "name the choices that shape who sees themselves in a toy?", False),
    ("design a doll with deliberate choices, and explain them in a designer’s statement",
     "design a doll, and explain your choices?", False),
    ("judge how a design can challenge conventional beauty standards",
     "judge how a design can challenge beauty standards?", True)],
  "why": "Every toy, book and poster is designed by someone, and every choice decides who is shown. In 1980 a Black designer, Kitty Black Perkins, made different choices, and her doll inspired further diversification in the toy industry."}

# the Design a doll tab's choices, by its own labels (dollArt.ts)
CHOICES = [
  ("Skin tone", "eight tones, from " + SKIN_LABELS[0] + " to " + SKIN_LABELS[-1]),
  ("Hair", "Afro, Afro puffs, Bantu knots, box braids, cornrows, locs, twists and more, in seven hair colors"),
  ("Head", "hijab, head wrap, headscarf (tichel), kippah, turban, kufi"),
  ("Extras", "glasses, a hearing aid, a prosthetic leg; standing, or in a wheelchair"),
  ("Clothes", "from a wax-print dress or a kurta to a suit, a track jacket or a red blazer")]

CSS = DOLL_CSS + """
.anat { display: grid; grid-template-columns: 170pt 1fr; gap: 18pt; align-items: center; margin: 6pt 0 8pt; break-inside: avoid; }
.anat .fig { text-align: center; }
.anat dl { margin: 0; display: grid; grid-template-columns: 70pt 1fr; gap: 7pt 10pt; font-size: 9.6pt; line-height: 1.38; }
.anat dt { font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-text); padding-top: 2.5pt; }
.anat dd { margin: 0; }
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 10pt; break-inside: avoid; }
.compare div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); padding: 8pt 11pt; }
.compare b { display: block; font: 600 12.5pt/1.15 'Cormorant Garamond', serif; margin-bottom: 3pt; }
.compare i { font-size: 9.6pt; line-height: 1.4; }
"""

def anatomy(h=210):
    d = doll("t2", "puffs", "black", "#D9541E", glasses=True, h=h)
    dl = "".join(f"<dt>{md(a)}</dt><dd>{md(b)}</dd>" for a, b in CHOICES)
    return ("html", f'<div class="anat"><div class="fig">{d}{swatches(size=15)}</div><dl>{dl}</dl></div>')

def compare():
    return ("html", '<div class="compare">'
            '<div><b>Francie, 1967</b><i>“Francie was essentially a white doll design with darker skin.”</i></div>'
            '<div><b>The first Black Barbie, 1980</b><i>“' + md(P2["features"]) + '”</i></div></div>')

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "designed-to-be-seen",
  "out": DIR + "BH_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO,
  "css": HERO_CSS + OBJ_CSS + FLOW_CSS + CARDS4_CSS + CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Studio", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("cols", [[("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will see toy design as a set of choices about who is shown. They will compare Francie, *“essentially a white doll design with darker skin,”* with the first Black Barbie, designed by Kitty Black Perkins with *“Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.”* Then they will design a doll of their own and explain each choice."]})],
      [("section", {"label": "Standards and themes", "list": [
        "**Creating** — plan and make a design with a purpose",
        "**Responding** — how design choices carry meaning",
        "**Connecting** — art, design and who is represented",
        "**Writing** — a designer’s statement"]}),
       ("section", {"label": "Materials needed", "list": [
        "*Who Do You See?*, *Design a doll* tab (online), projected",
        "Colored pencils, with a range of skin tones",
        "Page 3 of this plan; differentiated handouts"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Seven ways to wear it",
      "screen": {"phase": "Hook", "show": "gallery",
                 "groups": [{"label": "Hair · Design a doll", "items": HAIRSTYLES}],
                 "purpose": "Look before being told: a design choice decides who is shown.",
                 "students": ["What do you notice?", HOOK_Q]},
      "body": ["Show seven of the natural hairstyles from the *Design a doll* tab: Afro, Afro puffs, Bantu knots, box braids, cornrows, locs and twists. Ask: *“What do you notice? " + HOOK_Q + "”* Draw out that every option is a decision someone made, and that a missing option is a decision too."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "A designer’s choices",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Two designs", "show": "words", "text": TWO_DESIGNS,
         "cite": "The Importance of Black Barbie",
         "purpose": "See the difference between changing one color and designing from the start.",
         "students": ["What did Francie’s designers change? What did they keep?", "What did Kitty Black Perkins design differently?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "The choices", "show": "image",
         "img": {"img": ROOM_REP}, "alt": ROOM_REP_ALT, "fit": "contain", "caption": "*Who Do You See?* · Design a doll",
         "purpose": "List the choices a designer can make, and who each one includes.",
         "students": ["Name five choices a doll designer makes.", "Who does each choice include?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Designed to be seen", "show": "image",
         "img": {"img": POSTER1}, "alt": POSTER1_ALT, "fit": "contain", "caption": "Poster 1 · *Black History Month*",
         "purpose": "Read a poster’s design choices the way we read a doll’s.",
         "students": ["Who is in the ring of circles?", "What do the colors and lettering say?"]}],
      "body": [
        "Read poster 2’s two sentences side by side (page 3). Francie was *“essentially a white doll design with darker skin.”* The first Black Barbie, designed by Kitty Black Perkins, *“a trailblazing Black fashion designer at Mattel,”* featured *“Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.”* Ask: *what is the difference between changing one color and designing from the start?*",
        "Open the *Design a doll* tab and try a few choices together: skin tone, hair, head covering, extras such as glasses, a hearing aid or a prosthetic leg, a wheelchair, and clothes. Ask: *who does each choice include?*",
        "Show poster 1. Its designer made choices too: a ring of circular vignettes of a musician, a singer, a worker and a scientist; an acid lime ground; heavy, wide capitals. Ask: *what do these choices say about who and what is celebrated?*"]}),
    ("cards", [
      ("Skin tone", ["Eight tones in the *Design a doll* tab, from *deepest* to *very fair with freckles*: color is one choice among many."]),
      ("Features", ["Poster 2 credits the first Black Barbie with *Afrocentric facial features*: a face designed, not recolored."]),
      ("Hair", ["*Natural hairstyles* (1980); *realistic hair textures* (2008–09): hair is part of who we are."]),
      ("Who is shown", ["Head coverings, glasses, a hearing aid, a prosthetic leg, a wheelchair: each choice widens who can see themselves."])]),
    ("section", {"label": "Studio · 20 minutes",
      "screen": {"phase": "Studio", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design with purpose, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three design a doll and explain the choices."]},
      "body": ["Students choose a handout. All three design a doll and explain the choices."]}),
    ("levels", {
      "green": "Label the design choices on a drawn doll, then design one: a natural hairstyle, a skin tone from the swatches, clothes and one more choice; finish *I chose… because…*",
      "yellow": "Compare Francie’s design with the first Black Barbie’s, plan a doll on a design sheet (skin tone, hair, clothes, one extra), draw it, and write a designer’s statement.",
      "red": "Explain what “conventional beauty standards” are and how a design can challenge them, design a doll and its box front in a poster’s style, and write an artist’s statement that cites the poster."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Gallery walk",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Gallery walk", "show": "question",
         "question": "Which design choice in our gallery widens who can see themselves?",
         "purpose": "See each other’s designs, and name the choices that matter.",
         "students": ["Walk, look, and leave one note on a design.", "Name a choice that widens who is shown."]},
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Lay the designs out. Students walk, look and leave one sticky note on a design naming a choice that widens who can see themselves. Ask two designers to read their statements.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Look for:** a design whose choices are deliberate and explained; a statement that names who the doll is for; at Red, a link to the poster’s words on beauty standards.",
      "**Exit ticket:** *name one design choice, and who it includes.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Two designs, and a designer’s choices",
      "body": ["Poster 2’s words on two dolls, then the choices the *Design a doll* tab offers, by its own labels. The doll is drawn for this lesson, in the tab’s own skin-tone swatches."]}),
    compare(),
    anatomy(),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "What is the difference between recoloring a design and designing from the start?",
      "Whose idea of beauty did the original Barbie carry? How do you know?",
      "Which choice in the *Design a doll* tab surprised you? Who does it include?",
      "Poster 1 puts a musician, a singer, a worker and a scientist in its ring. Who would you put in yours?"]}),
    ("connection", ["**Online,** the *Design a doll* tab lets students build a doll, name it, and save or print it. **In the exhibition,** compare the dolls in the display case: the Nigerian and Ghanaian boxed editions and the three Inspiring Women dolls."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In 1967 Mattel made Francie, *“essentially a white doll design with darker skin.”* In 1980 the first Black Barbie, designed by Kitty Black Perkins, featured *“Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.”* Today you are the designer."]

HO_CSS = """
.bank { display: flex; flex-wrap: wrap; gap: 7pt; margin: 4pt 0 8pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 11pt; font: 400 10pt 'Outfit'; background: rgba(255,255,255,.65); }
.lab { display: grid; grid-template-columns: 1fr 120pt 1fr; gap: 0 10pt; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.lab .col { display: grid; gap: 26pt; }
.lab .col span { border-bottom: 1pt solid #1d1c1a; height: 18pt; position: relative; }
.lab .col.l span::after, .lab .col.r span::before { content: ""; position: absolute; top: 17pt; width: 14pt; border-top: 1pt dashed #1d1c1a; }
.lab .col.l span::after { right: -14pt; } .lab .col.r span::before { left: -14pt; }
.sheet { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 14pt; margin: 4pt 0 8pt; font-size: 9.6pt; }
.sheet p { margin: 0; border-bottom: 1pt solid #1d1c1a; padding: 8pt 0 2pt; }
.sheet b { font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #5b5a55; margin-right: 6pt; }
.task { break-inside: avoid; }
"""

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HERO_CSS + CSS + HO_CSS + css}

def labelled(d):
    return ("html", '<div class="lab"><div class="col l"><span></span><span></span><span></span></div>'
            f'<div style="text-align:center">{d}</div><div class="col r"><span></span><span></span></div></div>')

def sheet(rows):
    return ("html", '<div class="sheet">' + "".join(f"<p><b>{md(r)}</b></p>" for r in rows) + "</div>")

GREEN = handout("green", "BH_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "A designer’s choices", "blocks": [
            P("A doll designer makes choices. Label five of them on this doll. Use the bank."),
            ("html", '<div class="bank"><span>Skin tone</span><span>Hair</span><span>Face</span><span>Clothes</span><span>Glasses</span></div>'),
            labelled(doll("t3", "afro", "black", "#2F7D5B", glasses=True, h=230))]}),
  ("task", {"label": "Part 2", "title": "Your design", "blocks": [
            P("The first Black Barbie had *natural hairstyles*. Circle one, then draw it on the doll."),
            ("html", '<div class="bank">' + "".join(f"<span>{h}</span>" for h in
                     ["Afro", "Afro puffs", "Bantu knots", "Box braids", "Cornrows", "Locs", "Twists"]) + "</div>"),
            P("Color the doll with a skin tone from the swatches. Add clothes, and one more choice: glasses, a hearing aid, or something else."),
            ("html", swatches(size=20)), dolls([doll(None, h=250, bald=True)])]}),
  ("task", {"label": "Part 3", "title": "Why?",
            "body": ["**I chose ____________________ because…**"], "lines": 3}),
  ("family", ["Show your design at home. Ask your family: *did you have a toy that looked like you when you were young?*"]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Two designs", "blocks": [compare()],
            "body": ["What did Francie’s designers change, and what did they keep? What did Kitty Black Perkins design differently?"], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Plan your doll", "blocks": [
            P("Fill in your design sheet. Use the skin-tone swatches from the *Design a doll* tab."),
            ("html", swatches(size=18)),
            sheet(["Name", "Skin tone", "Face", "Hair (style and color)", "Clothes", "One more choice"])]}),
  ("task", {"label": "Part 3", "title": "Draw it", "blocks": [("draw", "My doll, front view")]}),
  ("task", {"label": "Part 4", "title": "Designer’s statement",
            "body": ["Who is your doll for? Explain two of your choices, and who they include."], "lines": 4}),
  ("family", ["Ask your family to guess who your doll is for. Then read them your statement."]),
], "body .drawbox { height: 255pt; }")

RED = handout("red", "BH_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Beauty standards",
            "blocks": [("html", '<p class="quote" style="border-left:3pt solid var(--accent);padding:3pt 0 3pt 10pt;font-style:italic;font-size:9.6pt;line-height:1.42">“'
                        + md(P2["criticism"]) + " … " + md(P2["challenged"]) + '”</p>')],
            "body": ["What are “conventional beauty standards”? Name two design choices that could challenge them, and say how."], "lines": 4}),
  ("task", {"label": "Part 2", "title": "More than color",
            "body": ["Francie had darker skin, yet poster 2 calls the earlier dolls *problematic*. Explain why representation needs more than a change of color. Give an example of a choice that goes further."], "lines": 4}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Doll and box",
            "blocks": [P("Design a doll and the front of its box. Borrow from the posters: a ring of circles, bold lettering, a strong ground color. Give the doll a name and put it on the box."),
                       ("html", '<div style="display:grid;grid-template-columns:1fr 1.2fr;gap:12pt">'
                                '<div class="drawbox" style="height:280pt"><span>The doll</span></div>'
                                '<div class="drawbox" style="height:280pt"><span>The box front</span></div></div>')]}),
  ("task", {"label": "Part 4", "title": "Artist’s statement",
            "body": ["Who is your design for? Which choices were deliberate, and why? Quote one sentence from poster 2 as part of your reasoning."], "lines": 6}),
  ("family", ["Look at a toy aisle or a book display with your family. Whose idea of beauty do you see? Who is missing?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
