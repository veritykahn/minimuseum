"""Seeing is Deceiving · Grades 5–8 · Art, Math and PE.
The existing lesson plans and Green / Yellow / Red handouts, re-set in the
new design with their own words (see resources-src/CONVERTING.md). Output
paths and file names are the originals', which the Resources pages link to."""

import html, re

SITE = "minimuseumproject.org/exhibitions/seeing-is-deceiving"
IMG = "/exhibitions/seeing/"
B = "________"
S = "______"
BL = "__________________"

# timing-bar colors, as in the In Their Hands models
HOOK, TEACH, ACT, CLOSE = "#7D8471", "#2E6E85", "#86671A", "#A8452F"

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def P(t):
    return ("html", f"<p>{md(t)}</p>")

def ul(items):
    return "<ul>" + "".join(f"<li>{md(i)}</li>" for i in items) + "</ul>"

def ol(items):
    return '<ol class="steps">' + "".join(f"<li>{md(i)}</li>" for i in items) + "</ol>"

def UL(items):
    return ("html", ul(items))

def OL(items):
    return ("html", ol(items))

def DRAW(label, h):
    return ("html", f'<div class="drawbox" style="height:{h}pt"><span>{md(label)}</span></div>')

def Q(t, n):
    """A question and its writing lines, kept together on one page."""
    return [("html", f'<div class="q"><p>{md(t)}</p><div class="write">' + "<i></i>" * n + "</div></div>")]

def sec(label, title=None, body=(), extra=""):
    """A lesson section that can carry a numbered list."""
    t = f"<h3>{md(title)}</h3>" if title else ""
    return ("html", f'<section class="sec"><p class="label">{md(label)}</p>{t}'
                    + "".join(f"<p>{md(p)}</p>" for p in body) + extra + "</section>")

LEVELS = {"green": ("Green Level", "More Support", "#4A7346"),
          "yellow": ("Yellow Level", "Grade Level", "#86671A"),
          "red": ("Red Level", "Go Deeper", "#A8452F")}

def handouts(intro, d, subs=True):
    """The differentiated-handouts section and its three levels, kept together."""
    head = f'<p class="label">Differentiated student handouts</p>' + (f"<p>{md(intro)}</p>" if intro else "")
    cells = "".join(f'<div class="lv" style="--lv:{LEVELS[k][2]}"><p class="lvname">{LEVELS[k][0]}'
                    + (f'<span>{LEVELS[k][1]}</span>' if subs else "") + f'</p><p>{md(v)}</p></div>' for k, v in d.items())
    return ("html", f'<div class="keep">{head}<div class="levels">{cells}</div></div>')

def cards(items, cols=3, prefix=""):
    """Numbered idea cards: (title, [paragraphs], [bullets]). A prefix
       ("Station ") is set small before the number."""
    out = ""
    for i, it in enumerate(items, 1):
        title, paras = it[0], it[1]
        bul = it[2] if len(it) > 2 else None
        after = it[3] if len(it) > 3 else []
        pre = f'<span class="cpre">{prefix}{i}</span>' if prefix else f'<span class="cn">{i:02d}</span>'
        out += (f'<div class="card">{pre}<h4>{md(title)}</h4>'
                + "".join(f"<p>{md(p)}</p>" for p in paras) + (ul(bul) if bul else "")
                + "".join(f"<p>{md(p)}</p>" for p in after) + "</div>")
    return ("html", f'<div class="cards" style="grid-template-columns:repeat({cols},1fr)">{out}</div>')

CSS = """
.conn .url { display: none; }
.card ul { margin: 0 0 5pt; }
.cpre { display: block; font: 500 7.5pt 'Outfit'; letter-spacing: .24em; text-transform: uppercase; color: var(--gold-text); margin: 1pt 0 1pt; } .card p { margin-bottom: 4pt; }
ol.steps { margin: 2pt 0 6pt; padding-left: 16pt; } ol.steps li { margin: 0 0 2.5pt; }
.lede { font-size: 10.5pt; }
.why { background: rgba(255,255,255,.72); border-left: 3pt solid var(--accent); padding: 6pt 10pt 1pt; margin: 4pt 0 8pt; }
body.adult .why { background: #f6f1e4; }
.task .refs { margin-bottom: 8pt; }
.q { break-inside: avoid; }
.keep { break-inside: avoid; }
"""

# ═══════════════════════════════════════════════════════════════════════
# ART · Creating Optical Illusions
# ═══════════════════════════════════════════════════════════════════════

ART = "teachers/grades-5-8/art/"
ART_HERO = {"img": IMG + "impossible-trident.jpg", "pos": "center 82%"}

# Lesson mode (resources-src/export_lessons.py): "screen" on a section, and
# "screen_sections", are for the site only; build.py ignores them, so the PDF
# is unchanged. What the plan prints and the screen shows is written once.
ART_TECH = [
  ("Impossible objects", ["**What:** Shapes that look 3D but violate geometry",
                          "**How:** Local parts look correct, but whole is impossible",
                          "**Artists:** M.C. Escher, Oscar Reutersvärd (invented impossible triangle, 1934)"]),
  ("Op Art patterns", ["**What:** Geometric patterns creating movement, depth, vibration",
                       "**How:** High-contrast repetitive patterns overwhelm visual processing",
                       "**Artists:** Bridget Riley, Victor Vasarely, Jesús Rafael Soto"]),
  ("Ambiguous figures", ["**What:** Images interpreted two or more ways",
                         "**How:** Brain can only hold one interpretation, so it “flips”",
                         "**Artists:** Salvador Dalí, Octavio Ocampo, Sandro del Prete",
                         "**Examples:** Young/old woman, vase/faces, duck/rabbit"])]
# a card's line without its bold lead-in ("**What:** …" → "…")
after_lead = lambda line: line.split(":** ", 1)[1]
TRIDENT = {"img": IMG + "impossible-trident.jpg"}
TRIDENT_ALT = "The impossible trident: three round prongs at one end that become two square prongs at the other"
VASE_OR_FACES = [
  {"img": IMG + "rubins-vase-vase.jpg", "label": "A vase", "alt": "Rubin’s Vase with the vase picked out"},
  {"img": IMG + "rubins-vase-face.jpg", "label": "Two faces", "alt": "Rubin’s Vase with the two faces picked out"}]

ART_LP = {
  "slug": "creating-optical-illusions",
  "out": ART + "Lesson Plan_ Creating Optical Illusions (Art, Grades 5-8) - Teacher Guide.pdf",
  "eyebrow": "Teacher lesson plan", "title": "Creating Optical Illusions",
  "sub": "Art Meets Science · Grades 5–8 · Art · 30 minutes",
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": ART_HERO, "css": CSS,
  "context": ["Students explore the intersection of art and neuroscience by studying famous optical illusion artists and creating their own illusion artwork using perspective, color theory, and pattern techniques."],
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Direct instruction", 10, TEACH), ("Activity", 12, ACT), ("Closing", 3, CLOSE)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will analyze how artists use perspective, color theory, and pattern to create optical illusions, study examples from the Op Art movement and M.C. Escher, and create their own optical illusion artwork."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**National Core Arts Standards:** VA:Cr1.1 (Generate and conceptualize artistic ideas), VA:Re7.1 (Perceive and analyze artistic work), VA:Cn11.1 (Relate artistic ideas with societal, cultural, and historical context)"]}),
    ("section", {"label": "Materials needed", "list": [
      "White drawing paper, rulers, compasses, pencils, erasers",
      "Colored pencils, markers, or fine-tip pens",
      "Examples: M.C. Escher works (*Waterfall*, *Ascending and Descending*, *Relativity*)",
      "Examples: Op Art (Bridget Riley, Victor Vasarely)",
      f"Mini Museum Perception Lab: {SITE}/illusions",
      "Recommended from Perception Lab: Impossible Trident (#15), Café Wall (#6), Fraser Spiral (#5), Bulging Grid (#7)"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "The art that tricks your brain",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0, 1], "title": "Trace the water", "show": "question",
         "question": "Trace the path of the water with your finger. Where does it go?",
         "purpose": "Let students discover the impossibility for themselves.",
         "students": ["At first glance, this looks normal."]},
        {"phase": "Hook", "minutes": 2, "script": [2, 3], "title": "Is it moving?", "show": "question",
         "question": "This painting isn’t moving—but your brain thinks it is!",
         "purpose": "A second kind of trick: Op Art, short for ‘optical art.’",
         "students": ["This is Op Art, short for ‘optical art.’"]}],
      "body": [
        "Display M.C. Escher’s *Waterfall* (water appears to flow uphill in an impossible loop).",
        "*“At first glance, this looks normal. But trace the path of the water with your finger. Where does it go?”* Let students discover the impossibility. *“This is an ‘impossible object’—something that can exist in 2D but never in real life. Dutch artist M.C. Escher was a master at these.”*",
        "Show a Bridget Riley Op Art piece (black and white patterns that appear to move).",
        "*“This painting isn’t moving—but your brain thinks it is! This is Op Art, short for ‘optical art.’ Artists in the 1960s deliberately created works that trick your visual system.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "Three illusion techniques",
      "screen": [
        {"phase": "Direct instruction", "minutes": 4, "script": [f"**{t}** — " + " ".join(ls) for t, ls in ART_TECH],
         "show": "chart", "caption": "Three illusion techniques", "columns": ["Technique", "What", "How", "Artists"],
         "rows": [{"cells": [t] + [after_lead(x) for x in ls[:3]], **({"img": im} if im else {})}
                  for (t, ls), im in zip(ART_TECH, [TRIDENT["img"], None, IMG + "rubins-vase.jpg"])],
         "purpose": "Three ways artists trick the eye, and the artists who used them.",
         "students": ["Which technique will you try?"]},
        {"phase": "Direct instruction", "minutes": 3, "script": ART_TECH[0][1], "title": "Impossible objects", "show": "image",
         "img": TRIDENT, "alt": TRIDENT_ALT, "caption": "Impossible Trident",
         "purpose": "Look closely at one impossible object: every part makes sense, the whole does not.",
         "students": ART_TECH[0][1][:2]},
        {"phase": "Direct instruction", "minutes": 3, "script": ART_TECH[2][1], "title": "Ambiguous figures", "show": "pair",
         "items": VASE_OR_FACES,
         "purpose": "One picture, two readings: the brain can hold only one at a time.",
         "students": ART_TECH[2][1][:2]}]}),
    cards(ART_TECH),
    ("section", {"label": "Activity · 12 minutes", "title": "Create your own optical illusion",
      "screen": {"phase": "Activity", "show": "gallery",
                 "groups": [{"label": "Recommended from Perception Lab", "items": [
                   {"img": TRIDENT["img"], "caption": "Impossible Trident", "alt": TRIDENT_ALT},
                   {"img": IMG + "fraser-spiral.jpg", "caption": "Fraser Spiral",
                    "alt": "The Fraser spiral: rings of black shapes on lavender that seem to spiral in to the center"},
                   {"img": IMG + "bulging-grid.jpg", "caption": "Bulging Grid",
                    "alt": "A dark and pale blue checkerboard, small squares set near its center, that seems to bulge out"}]}],
                 "purpose": "Students pick a technique and make an illusion, then test it on a classmate.",
                 "students": ["**Option A: Impossible Triangle** (Recommended for beginners)",
                              "**Option B: Op Art Pattern**",
                              "**Option C: Ambiguous Figure** (advanced)",
                              "Test it on a classmate: *“Does it trick their eyes?”*"]},
      "body": [
        "**Option A: Impossible Triangle** (Recommended for beginners) — Walk through step-by-step on board.",
        "**Option B: Op Art Pattern** — Draw grid, systematically distort, fill alternating sections black.",
        "**Option C: Ambiguous Figure** — Design image that can be seen two ways (advanced).",
        "Circulate and assist. Encourage students to test illusions on classmates: *“Does it trick their eyes?”*"]}),
    ("section", {"label": "Closing · 3 minutes", "title": "The science behind the art",
      "screen": {"phase": "Closing", "show": "question",
                 "question": "Which technique was most challenging? Why? What did you learn about how your brain sees? How might you use these techniques in other artwork?",
                 "purpose": "Reflect on what making an illusion taught about how the brain sees."},
      "body": [
        "*“Every optical illusion you created today works because you understand something about how the brain processes visual information. Artists like Escher and Riley weren’t just making pretty pictures—they were exploring the limits of human perception.”*",
        "**Reflection questions:** *“Which technique was most challenging? Why?”* / *“What did you learn about how your brain sees?”* / *“How might you use these techniques in other artwork?”*"]}),
    ("connection", [
      "**Option 1 — Visit the Mini Museum:** The Victorian optical illusion cards use similar techniques—transformation cards revealing hidden images, patterns that seem to move. The stereoscope creates depth from flat images.",
      f"**Option 2 — Virtual Visit:** Show the exhibition online at *{SITE}* or view artifacts at *{SITE}/artifacts*"]),
    ("section", {"label": "Assessment", "list": [
      "**Formative:** During creation, check that students can explain which technique they’re using and how it tricks the eye.",
      "**Completed artwork:** Assess: (1) Correct application of technique, (2) Neatness and precision, (3) Effectiveness—does it work?",
      "**Exit ticket:** *“Name one technique we learned today and explain how it tricks the brain.”*"]}),
    handouts("Three levels of student handouts are provided as separate files. Students self-select their challenge level:", {
      "green": "*“I want more support”* — Guided impossible-figure drawing, following the step-by-step board demonstration",
      "yellow": "*“I’m ready for a challenge”* — Create original illusion using one technique",
      "red": "*“I want to go deeper”* — Combine multiple techniques, write artist statement"}),
    ("section", {"label": "Artist background (for teacher reference)"}),
    ("refs", [
      ("M.C. Escher (1898–1972)", "Dutch graphic artist known for mathematically-inspired woodcuts, lithographs, and mezzotints featuring impossible constructions and explorations of infinity."),
      ("Bridget Riley (b. 1931)", "British painter, one of the foremost Op Art practitioners, known for black-and-white paintings that produce sensations of movement."),
      ("Victor Vasarely (1906–1997)", "Hungarian-French artist, widely accepted as the “grandfather of Op Art,” pioneered geometric abstract art."),
      ("Oscar Reutersvärd (1915–2002)", "Swedish graphic artist, “father of impossible figures,” created first impossible triangle in 1934.")]),
    ("section", {"label": "Extension ideas", "list": [
      "Research Roger Penrose and his collaboration with Escher on impossible figures",
      "Explore anamorphic art (distorted images that appear correct from one viewpoint)",
      "Create a class gallery of student optical illusions",
      "Compare historical optical toys (thaumatropes, zoetropes) to modern VR/3D technology"]}),
  ]}

def art_handout(level, blocks, context, css=""):
    return {"out": ART + f"Student Handout_ Seeing Is Deceiving - {level.title()} Level (Art 5-8).pdf",
            "eyebrow": "Student handout", "title": "Seeing is Deceiving", "sub": "Grades 5–8 · Art",
            "level": level, "context": context, "css": CSS + css, "hero": ART_HERO,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks}

ART_GREEN = art_handout("green", [
  ("task", {"label": "Part 1", "title": "Observe an illusion", "blocks": [
    P("Look at the optical illusion your teacher shows you. Draw what you see below:"),
    DRAW("Draw the illusion here", 118),
    P("**Answer these questions:**"),
    *Q("What did you see at first?", 1),
    *Q("Did you see something different when you looked again?", 1),
    *Q("Why do you think your brain saw it that way?", 2)]}),
  ("task", {"label": "Part 2", "title": "Create your own simple illusion", "blocks": [
    P("Try making your own optical illusion! Here are some easy ideas:"),
    UL(["Draw a picture that looks like two different things (like the duck/rabbit)",
        "Draw lines that look bent but are actually straight",
        "Draw two shapes that look different sizes but are actually the same"]),
    DRAW("Create your illusion here", 420),
    *Q("**Explain your illusion:** What trick does it play on the eyes?", 3)]}),
  ("family", ["Show your family an optical illusion from class or one you find online. Ask them: *“What do you see?”* See if they see it differently than you do!"]),
], ["**What I learned.** Our eyes and brain work together to see the world. Sometimes they make mistakes! When your brain guesses wrong about what you’re seeing, that’s called an **optical illusion**.",
    "**Key idea:** Your brain doesn’t just see—it interprets. It fills in gaps, makes assumptions, and sometimes gets tricked!"])

ART_YELLOW = art_handout("yellow", [
  ("task", {"label": "Part 1", "title": "Analyze an illusion", "blocks": [
    P("Examine the optical illusion shown in class. Sketch it below and analyze how it works:"),
    DRAW("Sketch the illusion", 98),
    P("**Analysis questions:**"),
    *Q("What visual trick is being used? (contrast, perspective, pattern, context, etc.)", 1),
    *Q("What assumption is your brain making that causes the illusion?", 2),
    *Q("How might an artist use this technique intentionally?", 2)]}),
  ("task", {"label": "Part 2", "title": "Design your own optical illusion", "blocks": [
    P("Create an original optical illusion using one of these techniques:"),
    ("refs", [("Ambiguous figures", "Images that can be seen as two different things"),
              ("Size/perspective illusions", "Objects that appear different sizes due to context"),
              ("Motion illusions", "Static patterns that appear to move"),
              ("Impossible objects", "Shapes that couldn’t exist in 3D space")]),
    DRAW("Design your optical illusion here", 320),
    P("**Explain your design:**"),
    *Q("What technique did you use?", 1),
    *Q("What assumption does your illusion exploit?", 2)]}),
  ("connection", [f"The Victorian era (1837–1901) saw an explosion of optical toys and illusions. Visit *{SITE}/illusions* to see how 19th-century inventors used these same principles!"]),
], ["**The science of seeing.** Your eyes collect light, but your brain decides what you’re seeing. Your brain uses shortcuts to process information quickly—but these shortcuts can be fooled. That’s why optical illusions work!",
    "**Key concept:** Perception isn’t passive—your brain actively constructs reality based on patterns, expectations, and context. Artists have used this for centuries to create depth, movement, and impossible images."])

ART_RED = art_handout("red", [
  ("task", {"label": "Part 1", "title": "Deconstruct a master illusion", "blocks": [
    P("Study the complex illusion provided. Create a diagram showing HOW it works:"),
    DRAW("Diagram the illusion’s mechanics", 120),
    P("**Deep analysis:**"),
    *Q("What specific brain shortcut or assumption does this exploit?", 1),
    *Q("Why would our brains evolve to work this way? What’s the advantage?", 2)]}),
  ("task", {"label": "Part 2", "title": "Historical context", "blocks": [
    P("Research one artist known for optical illusions (M.C. Escher, Bridget Riley, Victor Vasarely, or another). How did they use visual perception in their work?"),
    P(f"Artist: {BL}   Era: {BL}"),
    *Q("Key technique they pioneered or mastered:", 1)]}),
  ("task", {"label": "Part 3", "title": "Create an intentional illusion", "blocks": [
    P("Design an original optical illusion with a **purpose**. Consider: What message or feeling do you want to create? How can visual manipulation serve that goal?"),
    DRAW("Create your purposeful illusion", 105),
    P("**Artist statement:**"),
    *Q("What is your illusion’s purpose or message?", 1),
    *Q("What perceptual principle does it use, and why did you choose it?", 2)]}),
  ("cols", [
    [("section", {"label": "Critical thinking extension", "body": [
      "**Modern application:** Deepfakes use AI to create convincing fake videos. Photo manipulation is everywhere on social media. “Seeing is believing” is no longer reliable.",
      "**Reflection:** How should understanding optical illusions change how we evaluate visual “evidence” in news, social media, or courtrooms?"]}), ("lines", 3)],
    [("connection", [f"**Explore further:** Visit *{SITE}/illusions* to see how Victorians grappled with these same questions when photography was new!"])]]),
], ["**Beyond entertainment: visual manipulation.** Optical illusions reveal something profound: perception is not reality. Your brain constructs your visual experience based on assumptions, patterns, and expectations. Understanding this has implications far beyond art class.",
    "**Critical question:** If our brains can be fooled by simple lines and colors, how might this vulnerability be exploited—in advertising, propaganda, social media, or AI-generated content?"])

# ═══════════════════════════════════════════════════════════════════════
# MATH · Geometry of Perspective / Math vs. Your Eyes
# ═══════════════════════════════════════════════════════════════════════

MATH = "teachers/grades-5-8/math/"
MATH_HERO = {"img": IMG + "line-comparison.jpg", "pos": "center 52%"}

MATH_TECH = [
  ("Müller-Lyer (angles)",
   ["*“The arrows at the ends create angles. Your brain interprets these as depth cues:”*"],
   ["Outward fins (>—<) look like the inside corner of a room — farther away",
    "Inward arrowheads (<—>) look like the outside corner of a building — closer",
    "Brain “adjusts” length based on perceived distance: the line that seems farther away looks longer"],
   ["**Math:** Arrow angles (45° or 30°) determine illusion strength."]),
  ("Ponzo (converging lines)",
   ["Display the Ponzo illusion (two identical horizontal lines between converging “tracks”)."],
   ["Converging lines signal “distance” to your brain",
    "Objects “farther away” must be larger",
    "Brain scales up the top line"],
   ["**Math:** Ratio of line to track width changes."]),
  ("One-point perspective (vanishing points)",
   ["Artists use mathematical perspective: all parallel lines converge to a single vanishing point, objects get proportionally smaller, and the rate of shrinking follows mathematical ratios."])]
MATH_P1 = ["Predict which line/shape is larger", "Measure with ruler/protractor to find actual values",
           "Calculate the difference between perception and reality", "Record findings in a data table"]
MATH_P2 = ["Draw a horizon line across the middle of the page", "Mark a vanishing point on the horizon",
           "Draw a rectangle (front of a box or building) below the horizon",
           "Connect corners to the vanishing point with light lines",
           "Draw back edge of box parallel to front edge; erase construction lines"]
MATH_P2_SAY = "*“You’ve just used geometry to trick someone’s eye into seeing depth on a flat page!”*"

def math_card(n, minutes, **screen):
    """One of the three cards, read aloud, its points set as the task."""
    t, paras = MATH_TECH[n][0], MATH_TECH[n][1]
    rest = (MATH_TECH[n][2] if len(MATH_TECH[n]) > 2 else []) + (MATH_TECH[n][3] if len(MATH_TECH[n]) > 3 else [])
    return {"phase": "Direct instruction", "minutes": minutes, "title": t, "script": paras + rest,
            "students": rest or None, **screen}

MATH_LP = {
  "slug": "geometry-of-perspective",
  "screen_sections": [
    {"label": "Activity · 12 minutes", "after": "Direct instruction · 10 minutes", "title": "Prove it with math",
     "body": ["**Part 1: Measurement challenge (5 minutes)** — Distribute printed illusions. Students work in pairs to:"] + MATH_P1
             + ["**Part 2: Create a one-point perspective drawing (7 minutes)** — Using graph paper:"] + MATH_P2 + [MATH_P2_SAY],
     "screen": [
       {"phase": "Activity", "minutes": 5, "script": [0, 1, 2, 3, 4], "title": "Measurement challenge", "show": "image",
        "img": {"img": IMG + "ponzo-corridor.jpg"}, "caption": "Ponzo Corridor",
        "alt": "Two identical yellow checkered balls in a corridor that runs into the distance; the far one looks bigger",
        "purpose": "Students test perception against measurement, in pairs.",
        "students": MATH_P1},
       {"phase": "Activity", "minutes": 7, "script": [5, 6, 7, 8, 9, 10, 11], "title": "One-point perspective drawing",
        "show": "question", "question": "You’ve just used geometry to trick someone’s eye into seeing depth on a flat page!",
        "purpose": "Students use the vanishing point to make depth on a flat page.",
        "students": MATH_P2}]}],
  "out": MATH + "Lesson Plan_ Geometry of Perspective (Math 5-8) - Teacher Guide.pdf",
  "eyebrow": "Teacher lesson plan", "title": "Geometry of Perspective",
  "sub": "Math Behind Optical Illusions · Grades 5–8 · Math · 30 minutes",
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": MATH_HERO,
  "css": CSS,
  "context": ["Students discover how mathematical principles—angles, ratios, and perspective—create optical illusions, and use measurement to prove that their eyes can deceive them."],
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Direct instruction", 10, TEACH), ("Activity", 12, ACT), ("Closing", 3, CLOSE)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will understand how mathematical principles including angles, ratios, and linear perspective create optical illusions, use measurement tools to prove visual deceptions, and apply one-point perspective to create their own mathematically-based illusion."]}),
    ("cols", [
      [("section", {"label": "Standards alignment", "list": [
        "**CCSS.MATH.CONTENT.7.G.A.1:** Solve problems involving scale drawings of geometric figures.",
        "**CCSS.MATH.CONTENT.7.G.B.5:** Use facts about supplementary, complementary, vertical, and adjacent angles.",
        "**CCSS.MATH.PRACTICE.MP3:** Construct viable arguments and critique the reasoning of others."]})],
      [("section", {"label": "Materials needed", "list": [
        "Rulers (one per student) and protractors (one per pair)",
        "Graph paper for perspective drawing; pencils and erasers",
        f"Mini Museum Perception Lab: {SITE}/illusions",
        "Recommended from Perception Lab: Müller-Lyer (#12), Ponzo Corridor (#10), Ponzo Railroad (#11), Sander Parallelogram (#17), Ebbinghaus Circles (#14)"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Your eyes vs. math",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0, 1], "show": "question",
         "question": "Which line is longer—the top one or the bottom one?",
         "purpose": "A class vote first, then a ruler: perception against measurement.",
         "students": ["Take a class vote.", "Now let’s check with math."]},
        {"phase": "Hook", "minutes": 2, "script": [2], "title": "They’re exactly the same length!", "show": "question",
         "question": "Your eyes told you one thing, but mathematics tells you another.",
         "purpose": "The reveal, and the question for the lesson: why do these illusions work?",
         "students": ["Today we’re going to explore WHY these illusions work—and the answer is geometry."]}],
      "body": [
        "Display the Müller-Lyer illusion (two horizontal lines of equal length—one with arrows pointing outward, one with arrows pointing inward).",
        "*“Which line is longer—the top one or the bottom one?”* Take a class vote. Most students will say the one with outward-pointing arrows looks longer. *“Now let’s check with math.”* Have a student measure both lines with a ruler.",
        "**Reveal:** *“They’re exactly the same length! Your eyes told you one thing, but mathematics tells you another. Today we’re going to explore WHY these illusions work—and the answer is geometry.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "The math behind illusions",
      "screen": [
        math_card(0, 4, show="question", question="The arrows at the ends create angles. Your brain interprets these as depth cues:",
                  purpose="Angles read as depth: why one line looks longer."),
        math_card(1, 3, show="image", img={"img": IMG + "ponzo-corridor.jpg"}, caption="Ponzo Corridor",
                  alt="Two identical yellow checkered balls in a corridor that runs into the distance; the far one looks bigger",
                  purpose="Converging lines read as distance, so the brain scales up what looks farther away."),
        math_card(2, 3, show="question", question=MATH_TECH[2][1][0],
                  purpose="The same rule artists use on purpose, ready for the drawing in the activity.",
                  students=["Find the vanishing point."])]}),
    cards(MATH_TECH),
    sec("Activity · 12 minutes", "Prove it with math", extra=
        '<div class="cols"><div><h4>Part 1: Measurement challenge (5 minutes)</h4>'
        "<p>Distribute printed illusions. Students work in pairs to:</p>"
        + ol(MATH_P1)
 + '</div><div><h4>Part 2: Create a one-point perspective drawing (7 minutes)</h4>'
        "<p>Using graph paper:</p>"
        + ol(MATH_P2)
        + f"<p>{md(MATH_P2_SAY)}</p></div></div>"),
    ("section", {"label": "Closing · 3 minutes", "title": "Math as a tool for truth",
      "screen": {"phase": "Closing", "show": "question",
                 "question": "Can you think of real-world situations where measuring is more reliable than just looking?",
                 "purpose": "When perception and measurement disagree, measurement wins.",
                 "students": ["When perception and measurement disagree, measurement wins."]},
      "body": [
        "*“Today you learned that your eyes can be fooled, but math doesn’t lie. When perception and measurement disagree, measurement wins. This is why scientists, engineers, and artists all rely on mathematical tools.”*",
        "**Discussion:** *“Can you think of real-world situations where measuring is more reliable than just looking?”* (Construction, medicine, sports photo finishes, cooking, etc.)"]}),
    ("connection", [
      "**Option 1 — Visit the Mini Museum:** The stereoscope creates 3D illusions using geometry—each eye sees a slightly different angle (about 6 cm apart), and your brain calculates depth from the difference.",
      f"**Option 2 — Virtual Visit:** Explore at *{SITE}* or view artifacts at *{SITE}/artifacts*"]),
    ("section", {"label": "Assessment", "list": [
      "**Formative:** Check measurement accuracy and ability to explain why the illusion works mathematically.",
      "**Completed work:** Assess one-point perspective drawing for correct use of vanishing point and converging lines.",
      "**Exit ticket:** *“Explain in one sentence why the Müller-Lyer illusion works, using the word ‘angles’ in your answer.”*"]}),
    handouts("Three levels of student handouts are provided as separate files:", {
      "green": "*“More support”* — Guided measurement with templates, simple perspective exercise",
      "yellow": "*“Ready for a challenge”* — Independent measurement, calculate differences, perspective drawing",
      "red": "*“Go deeper”* — Design forced perspective illusion, explain mathematical principles"}),
  ]}

MATH_CSS = CSS + """
.task p { white-space: pre-wrap; }
table.fill td:first-child { width: auto; }
table.fill td { padding: 5pt 6pt 9pt 0; }
"""

# The Müller-Lyer figure: two shafts exactly 8 cm long, drawn in real
# centimeters so a ruler on the printed page measures them.
ML = """<svg class="ml" width="12cm" height="2.8cm" viewBox="0 0 120 28" fill="none" stroke="#1d1c1a" stroke-width=".7" stroke-linecap="round">
<line x1="20" y1="7" x2="100" y2="7"/><path d="M20 7 L13 2.5 M20 7 L13 11.5 M100 7 L107 2.5 M100 7 L107 11.5"/>
<line x1="20" y1="21" x2="100" y2="21"/><path d="M20 21 L27 16.5 M20 21 L27 25.5 M100 21 L93 16.5 M100 21 L93 25.5"/>
</svg>"""

def math_handout(level, blocks, context, css=""):
    names = {"green": "Green", "yellow": "Yellow", "red": "Red"}
    return {"out": MATH + f"Student Handout_ Math vs. Your Eyes - {names[level]} Level (Math 5-8).pdf",
            "eyebrow": "Student handout", "title": "Math vs. Your Eyes", "sub": "Grades 5–8 · Math",
            "level": level, "context": context, "css": MATH_CSS + css, "hero": MATH_HERO,
            "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level", "blocks": blocks}

MATH_GREEN = math_handout("green", [
  ("task", {"label": "Part 1", "title": "The Müller-Lyer illusion", "blocks": [
    P("Look at these two lines. Which one looks LONGER?"),
    ("html", f'<div class="mlbox">{ML}</div>'),
    P("**My prediction:** (circle one)    Top line is longer   |   Bottom line is longer   |   Same length"),
    P(f"**Now measure with your ruler!**    Top line: {B} cm     Bottom line: {B} cm"),
    P("**Was your prediction correct?**   Yes  /  No"),
    ("html", f'<div class="why"><p>{md("**Why does this illusion work?** The arrows create *angles* that trick your brain into thinking one line is farther away — so it looks longer than the other!")}</p></div>')]}),
  ("task", {"label": "Part 2", "title": "Simple perspective drawing", "blocks": [
    P("Follow these steps to draw a 3D box using math:"),
    OL(["Put a dot in the center of the box below (this is your **vanishing point**)",
        "Draw a square in the bottom-left corner",
        "Draw lines from each corner of the square to the vanishing point",
        "Draw a smaller square where those lines would end"]),
    P("You just created the illusion of depth using geometry!"),
    DRAW("Draw your perspective box here", 105)]}),
  ("task", {"label": "Part 3", "title": "What did you learn?", "blocks": [
    P("Fill in the blanks:"),
    P(f"The two lines in the Müller-Lyer illusion are actually {BL} (the same / different)."),
    P(f"The arrows create {BL} that trick your brain."),
    P(f"When I used a ruler, I found out that math is more {BL} than my eyes.")]}),
  ("task", {"label": "Part 4", "title": "Why does math matter?", "blocks": [
    *Q("Think of times when measuring is more reliable than just looking:", 3)]}),
  ("connection", ["The stereoscope in the Mini Museum uses math too! Your eyes are about 6 cm apart, so each eye sees a slightly different angle. The stereoscope shows each eye a different picture, and your brain calculates depth from the difference!",
                  f"**Visit:** *{SITE}/illusions*"]),
  ("task", {"label": "Part 5", "title": "Try this math problem!", "blocks": [
    P("The stereoscope cards were photographed with cameras 6.5 cm apart (the average distance between human eyes)."),
    P(f"If YOUR eyes are 6 cm apart, what is the difference? {B} cm"),
    P(f"What percentage is that? (Hint: divide the difference by 6.5, then multiply by 100)    Answer: {B} %")]}),
  ("family", ["Show your family the Müller-Lyer illusion. Ask them which line is longer, then measure to prove the truth! See whose eyes are tricked the most."]),
], ["**Can math prove your eyes wrong?** Your eyes can be tricked by optical illusions—but a ruler never lies! Today you’ll use math to prove that what you SEE isn’t always what’s REAL."],
   css=".mlbox { display: grid; place-items: center; border: 1pt solid var(--accent); border-radius: 4pt; padding: 8pt 0; margin: 4pt 0 8pt; background: rgba(255,255,255,.55); }")

def mtable(rows):
    """The Yellow measurement table: the Difference cell spans each pair."""
    head = "".join(f"<th>{h}</th>" for h in ["Illusion", "Your prediction", "Actual measurement", "Difference"])
    body = ""
    for a, b in rows:
        body += (f"<tr><td>{md(a)}</td><td>Longer / Shorter</td><td>{B} cm</td>"
                 f'<td rowspan="2" style="vertical-align:middle">{B} cm</td></tr>'
                 f"<tr><td>{md(b)}</td><td>Longer / Shorter</td><td>{B} cm</td></tr>")
    return ("html", f'<table class="fill mt"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')

MATH_YELLOW = math_handout("yellow", [
  ("task", {"label": "Part 1", "title": "Measurement challenge", "blocks": [
    P("For each illusion, predict which element is larger, then measure to find the truth."),
    mtable([("Müller-Lyer Line A", "Müller-Lyer Line B"), ("Ponzo Top Line", "Ponzo Bottom Line")]),
    P(f"**Analysis:** In both illusions, the lines were {BL} (equal/different)."),
    P(f"My perception was off by approximately {B} cm in the Müller-Lyer illusion.")]}),
  ("task", {"label": "Part 2", "title": "Angle investigation", "blocks": [
    P("The strength of the Müller-Lyer illusion depends on the angle of the arrows."),
    P(f"Use a protractor to measure the angle of the arrows in your illusion: {B}°"),
    *Q("**Hypothesis:** Would the illusion be stronger or weaker with sharper (smaller) angles? Explain:", 1)]}),
  ("task", {"label": "Part 3", "title": "One-point perspective", "blocks": [
    P("On graph paper (or below), create a one-point perspective drawing of a hallway or road. Include:"),
    UL(["Horizon line", "Vanishing point", "At least 4 lines converging to the vanishing point",
        "Objects that get smaller toward the vanishing point"]),
    DRAW("Draw your perspective scene here", 96)]}),
  ("cols", [
   [("task", {"label": "Part 4", "title": "Check your drawing", "blocks": [
    P("**Math check:** Use a ruler to verify that your converging lines actually meet at the vanishing point."),
    P("Do all lines converge correctly?   Yes  /  No"),
    P("If not, which line(s) need adjustment?"), ("lines", 1)]})],
   [("task", {"label": "Part 5", "title": "Mathematical analysis", "blocks": [
    P("In your perspective drawing, measure the width of an object (like a doorway) at two points:"),
    P(f"Width near the bottom of the drawing: {S}\u00a0cm"),
    P(f"Width near the vanishing point: {S}\u00a0cm"),
    P(f"Calculate the ratio: {S} ÷ {S} = {S}"),
    P("This ratio represents how much objects “shrink” as they appear farther away!")]})]]),
  ("connection", ["The stereoscope cards were photographed from two positions exactly 6.5 cm apart (average human eye spacing).",
                  f"**Calculate:** If your eyes are 6 cm apart, what percentage difference is that from the standard cards?\nShow your work: (6.5 − 6) ÷ 6.5 × 100 = {B} %",
                  f"**Visit:** *{SITE}/illusions*"]),
  ("cols", [
   [("task", {"label": "Part 6", "title": "Real-world connections", "blocks": [
    P("List three professions where understanding perspective and measurement is essential:"),
    P(f"1. {BL}{S}"), P(f"2. {BL}{S}"), P(f"3. {BL}{S}")]})],
   [("family", ["**Challenge:** Find examples of one-point perspective in your home or neighborhood (hallways, roads, fences). Take photos and identify the vanishing point!"])]]),
], ["**Measuring illusions.** Optical illusions exploit how your brain interprets geometric relationships. By measuring carefully, you can quantify exactly how much your perception differs from reality."],
   css="table.mt td { padding: 6pt 6pt 6pt 0; } table.mt td:first-child { width: 30%; } .conn p { white-space: pre-line; }")

MATH_RED = math_handout("red", [
  ("task", {"label": "Part 1", "title": "Quantifying the illusion", "blocks": [
    P("The Müller-Lyer illusion’s strength varies with arrow angle. Test this mathematically:"),
    P("Draw 3 versions of the illusion with arrows at 30°, 45°, and 60°. Survey 3 people: *“How much longer does line A appear than line B?”*"),
    ("table", {"head": ["Arrow angle", "Person 1 estimate", "Person 2 estimate", "Person 3 estimate", "Average"],
               "rows": [["30°", "", "", "", ""], ["45°", "", "", "", ""], ["60°", "", "", "", ""]]}),
    P(f"**Conclusion:** At what angle is the illusion strongest? {B}°"),
    *Q("Why might this be? (Think about room corners and depth perception)", 2)]}),
  ("task", {"label": "Part 2", "title": "Design a forced perspective illusion", "blocks": [
    P("Forced perspective uses mathematical scaling to make objects appear larger or smaller than they are. Famous examples: The Leaning Tower of Pisa tourist photos, movie sets (hobbits in *The Lord of the Rings*)."),
    P("Design your own forced perspective scene. Include:"),
    UL(["A sketch showing the camera position and object placement", "Calculations showing the scale ratios needed",
        "The mathematical relationship between distance and apparent size"]),
    P("**Key formula:** Apparent size is inversely proportional to distance."),
    P(f"If object A is 2× farther than object B, it appears {B} the size."),
    P(f"If object A is 3× farther than object B, it appears {B} the size.")]}),
  ("task", {"label": "Part 3", "title": "Mathematical explanation", "blocks": [
    *Q("Write a mathematical explanation of why the Ponzo illusion works. Use these terms: *converging lines, ratio, proportion, perceived distance*", 4)]}),
  ("task", {"label": "Part 4", "title": "Forced perspective design", "blocks": [
    P("Sketch your forced perspective scene below. Label distances and show your calculations:"),
    DRAW("Draw your scene here", 230),
    P("**My calculations:**"),
    P(f"Distance from camera to near object: {B} m      Distance from camera to far object: {B} m"),
    P(f"Ratio: {B} : {B}"),
    P(f"To make the far object appear the SAME size as the near object, it needs to actually be {B} times larger.")]}),
  ("connection", ["**Mini Museum deep dive:** The stereoscope creates depth through **parallax**—the angular difference between two views.",
                  "**Research question:** How do surveyors use parallax to calculate distances? What’s the mathematical relationship between baseline distance, parallax angle, and perceived depth?",
                  f"**Visit:** *{SITE}/illusions*"]),
  ("lines", 4),
  ("task", {"label": "Part 5", "title": "Advanced analysis", "blocks": [
    P("The human eye has a field of view of approximately 120°. A standard camera has about 45°."),
    *Q("**Question:** How might this difference affect how optical illusions appear in photographs versus real life?", 4)]}),
  ("task", {"label": "Part 6", "title": "Extension: anamorphic art", "blocks": [
    P("Anamorphic art uses extreme perspective distortion—images that only look correct from one specific angle. Research one example (like Julian Beever’s pavement art or Hans Holbein’s *The Ambassadors*)."),
    *Q("What mathematical transformation is being applied?", 5)]}),
  ("family", ["**Project:** Create a forced perspective photo with family members. Calculate the exact positioning needed to make someone appear to be “holding” a distant building or “stepping on” a family member. Show your math!"]),
], ["**The geometry of deception.** Mathematicians and artists have studied optical illusions for centuries. The principles behind these illusions—perspective, proportion, and angular relationships—are the same ones used in architecture, engineering, and computer graphics."])

# ═══════════════════════════════════════════════════════════════════════
# PE · Vision and Athletics / Vision Training for Athletes
# ═══════════════════════════════════════════════════════════════════════

PE = "teachers/grades-5-8/pe/"
PE_HERO = {"img": IMG + "ponzo-corridor.jpg", "pos": "center 62%"}

PE_SKILLS = [
  ("Depth perception", [], ["Both eyes judge distance", "**Critical for:** catching, hitting, shooting",
                            "A 90 mph baseball gives you <0.5 sec to judge position"]),
  ("Peripheral vision", [], ["“Corner of your eye” vision", "**Critical for:** soccer, basketball, hockey",
                             "Elite athletes see almost 180°"]),
  ("Reaction time", [], ["Speed of visual processing", "**Critical for:** goalkeeping, batting",
                         "Pros vs amateurs = milliseconds"])]
PE_DRILLS = "*“Professional athletes train these visual skills just like they train their muscles. Let’s try some of their drills!”*"
PE_STATIONS = [
  ("Depth perception challenge",
   ["**Setup:** Partners 10–15 feet apart. Toss ball with both eyes (count catches out of 5), then one eye covered (repeat). Switch roles.",
    "**Discussion:** *“How much harder with one eye? This is why depth perception matters!”*"]),
  ("Peripheral vision drill",
   ["**Setup:** Student faces forward, partner to the side. Partner slowly moves ball from behind toward field of vision. Student says “NOW” when they first see it (without moving eyes). Repeat on other side, switch.",
    "**Challenge:** Can you detect the ball earlier with practice?"]),
  ("Reaction time challenge",
   ["**Setup:** Partners face each other with colored objects. Partner A holds up color; Partner B calls color AND performs action (Red = clap, Blue = jump, Yellow = touch ground). Count correct out of 10, switch."])]

def pe_station(n, **screen):
    """A station: its card read aloud, its setup one sentence a line."""
    title, paras = PE_STATIONS[n]
    setup = after_lead(paras[0])
    return {"phase": "Activity stations", "minutes": 5, "title": f"Station {n + 1}: {title}", "show": "question",
            "script": [0, f"**Station {n + 1} · {title}**"] + paras,
            "purpose": "Students rotate to this station and run the drill in pairs.",
            "students": re.split(r"(?<=\.)\s+(?=[A-Z])", setup), **screen}

PE_LP = {
  "slug": "vision-and-athletics",
  "out": PE + "Lesson Plan_ Vision and Athletics (PE 5-8) - Teacher Guide.pdf",
  "eyebrow": "Teacher lesson plan", "title": "Vision and Athletics",
  "sub": "How Your Eyes Affect Performance · Grades 5–8 · PE · 25 minutes",
  "foot": "Teacher Lesson Plan · Grades 5–8 PE", "hero": PE_HERO, "css": CSS,
  "context": ["Students discover how visual perception affects athletic performance through hands-on drills testing depth perception, peripheral vision, and hand-eye coordination."],
  "blocks": [
    ("timing", [("Hook", 3, HOOK), ("Instruction", 4, TEACH), ("Activity stations", 15, ACT), ("Closing", 3, CLOSE)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will understand how visual perception directly affects athletic performance, experience how depth perception and peripheral vision impact sports skills, and practice drills that improve hand-eye coordination and visual reaction time."]}),
    ("cols", [
      [("section", {"label": "Standards alignment", "list": [
        "**SHAPE America Standard 2:** Applies knowledge of concepts, principles, strategies and tactics related to movement and performance.",
        "**SHAPE America Standard 4:** Exhibits responsible personal and social behavior that respects self and others."]})],
      [("section", {"label": "Materials needed", "list": [
        "Tennis balls or similar soft balls (one per pair)",
        "Cones for marking stations (8–12)",
        "Stopwatch or timer",
        "Eye patches or paper/tape to cover one eye (optional)",
        "Different colored balls or objects (for color recognition drill)",
        "Optional: Student handouts (three levels available)"]})]]),
    ("section", {"label": "Hook · 3 minutes", "title": "The one-eye challenge",
      "screen": {"phase": "Hook", "show": "question",
                 "question": "Why was that so much harder with one eye?",
                 "purpose": "Feel depth perception at work before naming it.",
                 "students": ["First with both eyes open.", "Then with one eye covered."]},
      "body": [
        "**Quick demonstration:** Ask for a volunteer. Have them stand 10 feet away and toss them a ball to catch—first with both eyes open (easy catch), then with one eye covered (much harder).",
        "*“Why was that so much harder with one eye? Your two eyes work together to create depth perception—the ability to judge how far away things are. When you lose one eye’s input, catching becomes really difficult because you can’t tell exactly where the ball is in space. Today we’re going to explore how your vision affects your athletic performance!”*"]}),
    ("section", {"label": "Brief instruction · 4 minutes", "title": "Three visual skills in sports",
      "screen": {"phase": "Instruction", "show": "chart",
                 "script": [f"**{t}:** " + "; ".join(ls) for t, _, ls in PE_SKILLS] + [PE_DRILLS],
                 "caption": "Three visual skills in sports", "columns": ["Skill", "What it is", "Critical for", "In sport"],
                 "rows": [{"cells": [t, ls[0], after_lead(ls[1]), ls[2]]} for t, _, ls in PE_SKILLS],
                 "purpose": "Name the three skills the stations will train.",
                 "students": ["Let’s try some of their drills!"]}}),
    cards(PE_SKILLS),
    P(PE_DRILLS),
    ("section", {"label": "Activity stations · 15 minutes",
      "screen": [pe_station(0, question="How much harder with one eye?"),
                 pe_station(1, question="Can you detect the ball earlier with practice?"),
                 pe_station(2, question="Red = clap, Blue = jump, Yellow = touch ground")],
      "body": ["Set up three stations. Students rotate through each (4–5 minutes per station)."]}),
    cards(prefix="Station ", items=PE_STATIONS),
    ("section", {"label": "Closing · 3 minutes", "title": "Connect to the exhibition",
      "screen": {"phase": "Closing", "show": "question",
                 "question": "The more you train your visual system, the better your predictions become.",
                 "purpose": "Tie the drills back to the exhibition: the brain predicts, sometimes wrong, sometimes right.",
                 "students": ["Sometimes wrong (illusions), sometimes right (catching)."]},
      "body": ["*“Your brain constantly processes visual info and makes predictions—sometimes wrong (illusions), sometimes right (catching). The more you train your visual system, the better your predictions become.”*"]}),
    ("cols", [
      [("connection", ["**Option 1 — Visit:** The stereoscope shows how two slightly different images create depth perception.",
                       f"**Option 2 — Virtual:** *{SITE}*"])],
      [("section", {"label": "Assessment", "list": [
        "**Participation:** Observe engagement and willingness to challenge themselves.",
        "**Understanding:** Can students explain WHY each drill improves performance?",
        "**Exit question:** *“Name one visual skill and one sport where it’s important.”*"]})]]),
    handouts("", {"green": "Record basic results, simple reflection",
                "yellow": "Track performance data, analyze patterns",
                "red": "Design custom drill, research athlete training"}, subs=False),
  ]}

def pe_handout(level, blocks, context, css=""):
    return {"out": PE + f"Student Handout_ Vision Training for Athletes - {level.title()} Level (PE 5-8).pdf",
            "eyebrow": "Student handout", "title": "Vision Training for Athletes", "sub": "Grades 5–8 · PE",
            "level": level, "context": context, "css": CSS + PE_CSS + css, "hero": PE_HERO,
            "foot": f"Student Handout · Grades 5–8 PE · {level.title()} Level", "blocks": blocks}

PE_CSS = """
.two ul { columns: 2; column-gap: 16pt; } .two li { break-inside: avoid; }
.task h4 { font-size: 11.5pt; margin: 6pt 0 2pt; }
table.fill td:first-child { width: auto; }
table.fill td { padding: 5pt 6pt 7pt 0; }
.card h4 { font-size: 11pt; }
"""

PE_GREEN = pe_handout("green", [
  ("task", {"label": "Part 1", "title": "Three visual skills", "blocks": [
    cards([("Depth perception", ["Using both eyes to judge how far away things are", "**Used in:** Catching, hitting, shooting"]),
           ("Peripheral vision", ["Seeing things “out of the corner of your eye”", "**Used in:** Soccer, basketball, hockey"]),
           ("Reaction time", ["How fast your brain responds to what you see", "**Used in:** Goalkeeping, batting, tennis"])])]}),
  ("task", {"label": "Part 2", "title": "My drill results", "blocks": [
    ("html", "<h4>Station 1: Depth perception</h4>"),
    P(f"Catches with BOTH eyes: {B} out of 5      Catches with ONE eye: {B} out of 5"),
    P("Was it harder with one eye?     Yes  /  No"),
    ("html", "<h4>Station 2: Peripheral vision</h4>"),
    P("Could you see the ball without moving your eyes?     Yes  /  No"),
    P(f"Which side was easier (left or right)? {BL}"),
    ("html", "<h4>Station 3: Reaction time</h4>"),
    P(f"Correct responses: {B} out of 10"),
    P(f"Which color/action was hardest? {BL}")]}),
  ("task", {"label": "Part 3", "title": "What did you learn?", "blocks": [
    P("Circle the best answer:"),
    P("**1. Which skill helps you catch a ball?**"),
    P("Depth Perception     /     Peripheral Vision     /     Reaction Time"),
    P("**2. Which skill helps a soccer player see teammates without looking?**"),
    P("Depth Perception     /     Peripheral Vision     /     Reaction Time"),
    P("**3. Which skill helps a goalie block a fast shot?**"),
    P("Depth Perception     /     Peripheral Vision     /     Reaction Time")]}),
  ("task", {"label": "Part 4", "title": "My reflection", "blocks": [
    *Q("Which visual skill do you think is YOUR strongest?", 3),
    *Q("Which skill would you like to improve?", 3),
    *Q("Name a sport where this skill would help you:", 2)]}),
  ("connection", ["The stereoscope in the Mini Museum shows how your two eyes create depth perception. Each eye sees a slightly different picture, and your brain combines them to judge distance. That’s why catching is so hard with one eye covered!",
                  f"**Visit:** *{SITE}*"]),
  ("family", ["Try the one-eye catching challenge with your family. Who does best with one eye covered? Some people adapt faster than others!"]),
], ["**Your eyes are part of your game!** Did you know professional athletes train their eyes just like they train their muscles? Today you’ll try drills that improve three visual skills used in sports."],
   css=".task p { white-space: pre-wrap; }")

PE_YELLOW = pe_handout("yellow", [
  ("task", {"label": "Part 1", "title": "Performance data", "blocks": [
    ("html", "<h4>Station 1: Depth perception test</h4>"),
    ("table", {"head": ["Condition", "Trial 1", "Trial 2", "Average"], "rows": [
      ["Both eyes open", "___/5", "___/5", "___/5"], ["Right eye only", "___/5", "___/5", "___/5"],
      ["Left eye only", "___/5", "___/5", "___/5"]]}),
    *Q("**Analysis:** Which eye performed better alone? Why might that be?", 2),
    ("html", "<h4>Station 2: Peripheral vision map</h4>"),
    P("How far back could you detect the ball (estimate in degrees from center)?"),
    P(f"Left side: {B}°       Right side: {B}°"),
    P(f"Total peripheral range: approximately {B}°     (Elite athletes reach nearly 180°!)"),
    ("html", "<h4>Station 3: Reaction time</h4>"),
    P(f"Score: {B} / 10 correct      Which response was slowest (clap/jump/touch ground)? {B}"),
    *Q("Why do you think that one was harder?", 1)]}),
  ("task", {"label": "Part 2", "title": "Sport application", "blocks": [
    P(f"Choose a sport you play or enjoy watching:     Sport: {BL}{B}"),
    *Q("Depth perception matters because:", 1),
    *Q("Peripheral vision matters because:", 1),
    *Q("Reaction time matters because:", 1)]}),
  ("cols", [
   [("task", {"label": "Part 3", "title": "Compare your results", "blocks": [
    P("How did your performance change between conditions?"),
    P(f"Depth perception drop (both eyes vs. one eye): {B} catches lost"),
    P(f"Peripheral vision difference (left vs. right): {B}° difference"),
    *Q("What does this tell you about your visual strengths and weaknesses?", 1)]})],
   [("task", {"label": "Part 4", "title": "Training plan", "blocks": [
    *Q("Based on your results, which visual skill would benefit you most to train?", 1),
    *Q("How could you practice this skill at home?", 2)]})]]),
  ("connection", ["The stereoscope exploits **binocular disparity**—the difference between what each eye sees. Calculate: If your eyes are 6 cm apart and a ball is 10 meters away, each eye sees it from a slightly different angle. Your brain uses this difference to calculate distance in milliseconds!",
                  f"**Visit:** *{SITE}*"]),
  ("cols", [
   [("section", {"label": "Real athletes, real training",
    "body": ["Many professional teams now include vision training. For example:"],
    "list": ["Baseball players use light board training to improve reaction time",
             "Hockey goalies practice peripheral awareness drills daily",
             "Tennis players train eye tracking to follow fast serves"]})],
   [("family", ["**Home training:** Practice the reaction time drill with family members using TV remote buttons (mute = clap, volume up = jump, etc.). Track improvement over a week!"])]]),
], ["**Training your visual system.** Elite athletes don’t just train muscles—they train their visual processing systems. The difference between good and great often comes down to milliseconds of visual reaction time or inches of depth perception accuracy."],
   css=".task p { white-space: pre-wrap; }")

PE_RED = pe_handout("red", [
  ("task", {"label": "Part 1", "title": "Data analysis", "blocks": [
    P("Record your complete performance data and identify patterns:"),
    ("table", {"head": ["Skill", "Your score", "Class avg (est.)", "Your relative performance"], "rows": [
      ["Depth (both eyes)", "___/5", "___/5", "Above / Average / Below"],
      ["Depth (one eye)", "___/5", "___/5", "Above / Average / Below"],
      ["Peripheral range", "___°", "___°", "Above / Average / Below"],
      ["Reaction accuracy", "___/10", "___/10", "Above / Average / Below"]]}),
    *Q("**Analysis:** Which visual skill is your strongest? Which needs the most improvement?", 2)]}),
  ("task", {"label": "Part 2", "title": "Design your own vision drill", "blocks": [
    P("Create an original drill that trains ONE specific visual skill for a specific sport:"),
    P(f"Target sport: {BL}      Visual skill being trained: {BL}"),
    *Q("Equipment needed:", 1),
    *Q("Drill instructions (step by step):", 3),
    ("cols", [Q("How would you measure improvement?", 2), Q("Why does this drill mimic real game situations?", 2)])]}),
  ("task", {"label": "Part 3", "title": "Research connection", "blocks": [
    P("Many pro athletes have unusual visual abilities. Research ONE of these topics:"),
    ("html", '<div class="two">' + ul(["How do elite baseball hitters track a 95 mph fastball?", "What visual training do Formula 1 drivers do?",
        "How do hockey goalies use peripheral vision?", "Can video games improve visual reaction time?"]) + "</div>"),
    P(f"Your topic: {BL}{BL}"),
    ("cols", [Q("Key finding:", 2), Q("How does this connect to what we learned today?", 2)])]}),
  ("cols", [[
  ("task", {"label": "Part 4", "title": "The science of milliseconds", "blocks": [
    P("Consider these facts:"),
    UL(["A 95 mph fastball reaches home plate in 400 milliseconds",
        "The batter must decide whether to swing within 150 milliseconds",
        "Elite batters can identify pitch type within 100 milliseconds of release"]),
    *Q("What does this tell you about the importance of visual training?", 2)]})],
  [("connection", ["**Mini Museum deep dive:** The stereoscope demonstrates binocular disparity—but some athletes have better stereo acuity than others.",
                  "**Research question:** How do sports vision specialists measure stereo acuity? Can it be improved with training?",
                  f"**Visit:** *{SITE}*"]),
   ("lines", 1),
   ("family", ["**Project:** Test your family’s visual reaction time using an online reaction test (search “human benchmark reaction time”). Record everyone’s results. Does age correlate with reaction time? Create a graph of your findings!"])]]),
], ["**Sports vision science.** Professional sports teams employ “sports vision specialists” who design training programs to improve athletes’ visual processing. Research shows that visual training can improve batting averages, save percentages, and reaction times by measurable margins."],
   css=".task p { white-space: pre-wrap; } table.fill td { padding: 4pt 6pt 5pt 0; }")

DOCS = [ART_LP, ART_GREEN, ART_YELLOW, ART_RED,
        MATH_LP, MATH_GREEN, MATH_YELLOW, MATH_RED,
        PE_LP, PE_GREEN, PE_YELLOW, PE_RED]
