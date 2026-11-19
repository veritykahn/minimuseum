"""Grades 5–8 · Art · "Designed to Be Read"
The exhibition's two posters as graphic design: their shared system of color
blocks, a frame line that breaks off at a corner, tall condensed capitals,
typewriter type and a typewriter photograph that bleeds off the edge (as the
exhibition's own stylesheet, writing-revolution.css, describes them); poster
1's sentence on desktop publishing; and the iMac's fonts at the Typing
Station. Students design a third poster in the series."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

DIR = "teachers/grades-5-8/art/"
TITLE = "Designed to Be Read"
SUB = "Grades 5–8 · Art · Graphic design and type"

HERO = W.HERO_P2_TITLE
HERO_HANDOUT = W.HERO_P1_TITLE

HOOK_Q = "Where does your eye go first? Second? Third?"
SAME_Q = "What do the two posters share? What makes them a pair?"
CLOSE_Q = "Which design choice from the posters would you borrow for your own work, and why?"
FONTS = " · ".join(W.IMAC_FONTS)

# The posters' design, in the exhibition's own description (writing-revolution.css).
SYSTEM = [
  ("Color blocks", "Two bold blocks: charcoal over coral-red on one poster, bright cyan over charcoal on the other."),
  ("Frame line", "A thin white frame line that breaks off at a corner."),
  ("Title", "Tall, condensed white capitals, with dotted capital letters."),
  ("Text", "Set in a typewriter-style monospace face."),
  ("Image", "A black Urania typewriter, running off the edge on one poster."),
  ("Small details", "A gold admission ticket; the Mini Museum’s name in a corner."),
]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe the design choices in the exhibition’s posters: color blocks, frame, type and image",
     "describe the color, frame, type and image choices in the posters?", False),
    ("explain how a designer uses size, color and contrast to lead the eye (visual hierarchy)",
     "explain how size, color and contrast lead the eye?", False),
    ("compare serif, sans-serif and monospace type, and the mood each sets",
     "tell serif, sans-serif and monospace type apart, and say what each feels like?", False),
    ("design a third poster in the same series, and explain each choice",
     "design a poster that belongs to the series, and explain your choices?", True)],
  "why": "Everything you read was designed by someone. Seeing their choices helps you read more closely and make work of your own that people want to read."}

CSS = W.QUOTE_CSS + """
.fig2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 10pt; break-inside: avoid; }
.fig2 img { width: 100%; border-radius: 3pt; display: block; }
.fig2 figure { margin: 0; } .fig2 figcaption { font: 400 7.6pt 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
table.ds { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.ds th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.ds td { border-bottom: .6pt solid #b9b5aa; padding: 4.5pt 8pt 4.5pt 0; vertical-align: top; }
table.ds td:first-child { width: 22%; font-weight: 500; }
table.ds td.blank { height: 34pt; }
.faces { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 10pt; break-inside: avoid; }
.faces div { border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 8pt 8pt 30pt; background: rgba(255,255,255,.5); position: relative; }
.faces .s { font-size: 21pt; line-height: 1.1; margin: 0; }
.faces .n { position: absolute; left: 8pt; bottom: 7pt; font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; }
.f1 { font-family: 'Cormorant Garamond', serif; font-weight: 600; }
.f2 { font-family: 'Outfit', sans-serif; font-weight: 400; }
.f3 { font-family: 'Courier Prime', 'Courier New', monospace; }
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 10pt; }
.thumbs div { border: .8pt dashed #a9a69b; border-radius: 3pt; aspect-ratio: 3 / 4; }
"""

P1_IMG = W.printable(W.POSTER1)
P2_IMG = W.printable(W.POSTER2)


def figs(w="100%"):
    return ("html", f'<div class="fig2" style="width:{w}"><figure><img src="{P1_IMG}" alt="{W.POSTER1_ALT}"><figcaption>A · The Writing Revolution</figcaption></figure>'
                    f'<figure><img src="{P2_IMG}" alt="{W.POSTER2_ALT}"><figcaption>B · QWERTY’s Accidental Empire</figcaption></figure></div>')


def table(head, rows, blank=(), cls="ds"):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join('<td class="blank"></td>' if (i in blank or c == "") else f"<td>{c}</td>" for i, c in enumerate(r)) + "</tr>" for r in rows)
    return ("html", f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>')


# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "designed-to-be-read",
  "out": DIR + "WR_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": CSS + W.OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, W.SAGE), ("Teach", 13, W.SLATE), ("Activity", 20, W.GOLD), ("Debrief", 7, W.RUST)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will look at the exhibition’s two posters, *The Writing Revolution* and *QWERTY’s Accidental Empire*, as graphic design. They will name the choices the posters share (bold color blocks, a thin white frame line that breaks off at a corner, tall condensed capitals, typewriter type and a black typewriter photograph), see how size, color and contrast lead the eye, compare kinds of type, and design a third poster for the series."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Creating** — planning a design with thumbnails; making choices with a purpose",
      "**Elements and principles** — color, contrast, emphasis, hierarchy, balance",
      "**Typography** — serif, sans-serif and monospace; how type sets a mood",
      "**Connecting** — desktop publishing, and who gets to design what we read"]}),
    ("section", {"label": "Materials needed", "list": [
      "The two posters on page 3, projected or printed in color",
      "The Typing Station on the exhibition website, to try the iMac’s fonts",
      "Differentiated handouts, one per student; colored pencils or markers"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Where does your eye go?",
      "screen": {"phase": "Hook", "show": "image", "title": "Where does your eye go?",
                 "img": {"img": W.POSTER1}, "alt": W.POSTER1_ALT, "fit": "contain",
                 "caption": "The Writing Revolution, one of the exhibition’s two posters",
                 "purpose": "Look before naming anything: notice how the poster leads the eye.",
                 "students": [HOOK_Q, "What made you look there?"]},
      "body": ["Show *The Writing Revolution* poster and give students thirty seconds of silence. Ask: *“" + HOOK_Q + "”* Most will say the title, then the typewriter, then the text. Ask what made them look there: size, color, contrast. Name the idea: **visual hierarchy**."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "A design system",
      "screen": [
        {"phase": "Teach", "minutes": 7, "script": [0, 1], "title": "A pair", "show": "pair",
         "items": [{"img": W.POSTER1, "alt": W.POSTER1_ALT, "label": "A", "caption": "The Writing Revolution", "fit": "contain"},
                   {"img": W.POSTER2, "alt": W.POSTER2_ALT, "label": "B", "caption": "QWERTY’s Accidental Empire", "fit": "contain"}],
         "purpose": "Find the rules both posters follow: a design system.",
         "students": [SAME_Q, "What is different, and why might the designer have changed it?"]},
        {"phase": "Teach", "minutes": 6, "script": [2], "title": "Anyone can design", "show": "words",
         "text": Q["pagemaker"] + "\nFonts on the iMac: " + FONTS, "cite": "The Writing Revolution · the Typing Station",
         "purpose": "Connect design to the poster’s history: software put type in everyone’s hands.",
         "students": ["Try each font on the iMac at the Typing Station.", "Which one looks most like the posters’ titles?"]}],
      "body": [
        "Show the two posters side by side. Ask: *“" + SAME_Q + "”* Build the list on page 3 together: two color blocks, a white frame line that breaks off at a corner, tall condensed capitals, typewriter text, the Urania typewriter. Name it: a **design system**, a set of rules that makes separate pieces look like a family.",
        "Point out the differences: the colors change, and on *The Writing Revolution* the typewriter runs off the edge (a **bleed**) while on *QWERTY’s Accidental Empire* it sits whole on the cyan. Ask what each choice does.",
        "Read: *“" + Q["pagemaker"] + "”* Open the iMac at the Typing Station and set the same line in its fonts: " + FONTS + ". Name the three kinds: **serif** (small strokes at the ends of letters), **sans-serif** (without them), **monospace** (every letter the same width, like a typewriter). Ask which font looks most like the posters’ titles."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the posters’ design, then design in the same system.",
                 "students": ["Choose Green, Yellow or Red. All three end with a poster design of your own."]},
      "body": ["Students choose a handout. All three end with a poster design for the series."]}),
    ("levels", {
      "green": "Number what they see first, second and third, match three kinds of type to their descriptions, and sketch a poster using a checklist of the series’ rules.",
      "yellow": "Compare the two posters in a table, explain the poster’s hierarchy, and plan a poster in three thumbnail sketches.",
      "red": "Write the rules of the design system, explain the bleed and the broken frame, and design a third poster with a designer’s note."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Borrow a choice",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Borrow a choice", "show": "question", "question": CLOSE_Q,
         "purpose": "Have students name one design decision as a tool they now own.",
         "students": ["Hold up your design.", "Name the choice you borrowed."]},
        {**W.review(OBJECTIVES, 3, [1]), "phase": "Debrief"}],
      "body": ["Students hold up their designs. Ask: *“" + CLOSE_Q + "”* Ask a Red Level student to read their designer’s note.",
               W.LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Kinds of type (Green):** small strokes at the ends of the letters, *serif*; plain letters without them, *sans-serif*; every letter the same width, *monospace*.",
      "**The posters’ titles:** the exhibition’s website sets its titles in Antonio, one of the iMac’s fonts; the posters’ own lettering has dotted capitals.",
      "**Exit ticket:** *name one rule of the posters’ design system and say what it does for the viewer.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Two posters, one system",
      "body": ["Project or print this page in color. The design notes follow the exhibition’s own description of its posters."]}),
    figs("74%"),
    table(["Design rule", "What the posters do"], SYSTEM),
    ("section", {"label": "Background for teachers", "title": "Design and the writing revolution",
      "body": ["The posters’ own argument is about who gets to make what others read. *“" + Q["pagemaker"] + "”* Their typewriter type and typewriter photograph make the subject part of the design."]}),
    ("connection", ["**Visit the exhibition:** look at both posters on screen, then open the Typing Station and set the line *" + W.STATION_LINE + "* in each of the iMac’s fonts. Which font would you choose for a poster, and why?"]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The exhibition’s two posters were designed as a pair. A designer chose every color, every letter and where the typewriter sits. Designers call this set of choices a **design system**."]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT, "css": CSS + css}


FACES = ('<div class="faces">'
         '<div><p class="s f1">Writing</p><span class="n">Box 1</span></div>'
         '<div><p class="s f2">Writing</p><span class="n">Box 2</span></div>'
         '<div><p class="s f3">Writing</p><span class="n">Box 3</span></div></div>')

GREEN = handout("green", "WR_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Look closely",
            "blocks": [("html", f'<div class="figrow" style="--fc: 40% 1fr"><figure><img src="{P1_IMG}" alt="{W.POSTER1_ALT}"></figure>'
                                '<div><p>Look at the poster for ten seconds. What did you see <b>first</b>, <b>second</b> and <b>third</b>?</p>'
                                '<p>1. ______________________________</p><p>2. ______________________________</p><p>3. ______________________________</p>'
                                '<p>Name two colors the designer used:</p><p>______________________________</p></div></div>')],
            "body": ["Why do you think your eye went to the first thing first?"], "lines": 3}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Three kinds of letters",
            "blocks": [("html", FACES)],
            "body": ["Write the box number next to each description. **Serif:** letters with small strokes at their ends ____  **Sans-serif:** plain letters without them ____  **Monospace:** every letter the same width, like a typewriter ____"]}),
  ("task", {"label": "Part 3", "title": "Your poster",
            "body": ["Design a poster about a writing tool: a pencil, a typewriter, a computer or a phone. Tick each rule as you use it: ☐ two color blocks ☐ a thin frame line ☐ a title in tall capitals ☐ one picture ☐ a few lines of typewriter-style text"],
            "blocks": [("draw", "My poster")]}),
  ("connection", ["At the Typing Station, set the same line in each of the iMac’s fonts. Which kind is Courier: serif, sans-serif or monospace?"]),
], ".drawbox { height: 340pt; }")

YELLOW = handout("yellow", "WR_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Same and different",
            "blocks": [figs("52%")],
            "body": ["Compare the two posters."]}),
  table(["", "The same on both", "Different"], [("Color", "", ""), ("Title", "", ""), ("Picture", "", ""), ("Text", "", "")]),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Leading the eye",
            "body": ["On poster A, put these in the order your eye meets them: the title, the typewriter, the text, the admission ticket. Then explain how the designer used **size**, **color** and **contrast** to lead you."], "lines": 5}),
  ("task", {"label": "Part 3", "title": "Thumbnails",
            "blocks": [("html", "<p>Designers plan with small, quick sketches called <b>thumbnails</b>. Sketch three ways to lay out a third poster for the series, about a writing tool of your choice.</p>"),
                       ("html", '<div class="thumbs"><div></div><div></div><div></div></div>')],
            "body": ["Circle the strongest sketch. Why is it the strongest?"], "lines": 2}),
  ("connection", ["Open the Typing Station and try the iMac’s fonts: " + FONTS + ". Which would you use for your poster’s title, and which for its text?"]),
], "table.ds td.blank { height: 33pt; } .thumbs div { aspect-ratio: 3 / 3.6; }")

RED = handout("red", "WR_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Write the rules",
            "blocks": [figs("50%")],
            "body": ["Another designer has to make the third poster in this series. Write the five rules they must follow so it looks like part of the family."], "lines": 6}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Bleed and break",
            "body": ["On poster A the typewriter runs off the edge of the page (a **bleed**). On both, the white frame line breaks off at a corner. What does each choice do for the viewer? Would the posters be stronger or weaker without them?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Poster three",
            "body": ["Design the third poster in the series, about a writing tool from the poster’s history: the printing press, the word processor, desktop publishing or the internet."],
            "blocks": [("draw", "Poster three")]}),
  ("task", {"label": "Part 4", "title": "Designer’s note",
            "body": ["Explain your color blocks, your type and your image, and what the viewer should see first."], "lines": 3}),
  ("connection", ["The poster says desktop publishing meant *anyone could design newsletters, magazines, or books from their home*. Find the sentence in *The Writing Revolution*. What would you design, if you could design anything?"]),
], ".drawbox { height: 215pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
