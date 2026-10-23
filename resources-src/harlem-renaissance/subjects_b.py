"""Grades 5–8 · Art, Math and PE · The Harlem Renaissance
Converted from the existing HR_LP_* and HR_Handout_* PDFs with their own
words: "Seeing in Silhouette" (Art), "Migration by Numbers" (Math) and
"Move Like Harlem" (PE). Aaron Douglas's paintings are still in copyright,
so the handouts name each work and the teacher projects it."""
import html, re
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import screen_links

G = "teachers/grades-5-8/"

# "screen" on a section is for the site's Lesson mode only (resources-src/
# export_lessons.py); build.py ignores it, so the PDF is unchanged. Anything
# printed in the plan and shown on screen is written once, as a constant.
CHOOSE = ["Choose Green, Yellow or Red. You can switch at any time."]
HARLEM = "/exhibitions/harlem/"

def P(t, cls=""):
    """A paragraph in the same **bold** / *italic* shorthand as build.py."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    c = f' class="{cls}"' if cls else ""
    return ("html", f"<p{c}>{t}</p>")

def W(n):
    return '<div class="write">' + "<i></i>" * n + "</div>"

def Q(n, text, lines):
    """A numbered question with its writing lines, kept together."""
    t = html.escape(text, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    num = f'<b class="qn">{n}.</b> ' if n else ""
    return ("html", f'<div class="q"><p>{num}{t}</p>{W(lines) if lines else ""}</div>')

CSS = """
.q { break-inside: avoid; margin: 0 0 7pt; } .q p { margin: 0 0 1pt; }
.q .qn { font-weight: 500; color: var(--gold-text); }
.drawbox span { right: 8pt; }
body.adult .lead { margin-bottom: 4pt; }
.say { font: italic 400 11.5pt/1.38 'Cormorant Garamond', serif; border-left: 1.2pt solid var(--accent); padding-left: 11pt; margin: 2pt 0 10pt; break-inside: avoid; }
table.fill td:first-child { width: auto; }
.ref table.fill td, body.adult table.fill td { padding: 4pt 6pt 5pt 0; }
"""

# A painting by Aaron Douglas, named but not reproduced: the teacher projects it.
WORK_CSS = """
.works { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
.work { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.72); padding: 8pt 10pt 6pt;
  display: grid; grid-template-columns: 22pt 1fr; gap: 9pt; align-items: center; }
.work .rings { width: 22pt; height: 22pt; border-radius: 50%; border: 1pt solid var(--gold-text);
  box-shadow: inset 0 0 0 3pt rgba(255,255,255,.72), inset 0 0 0 4pt var(--gold-text), inset 0 0 0 7pt rgba(255,255,255,.72), inset 0 0 0 8pt var(--gold-text); }
.work h4 { margin: 0 0 1pt; font-size: 11.5pt; }
.work p { margin: 0; font-size: 8.4pt; line-height: 1.35; color: #3f3e3a; }
.work .label { font-size: 6.5pt; margin-bottom: 2pt; }
"""

def works(items, label="On the screen"):
    cells = "".join(
        f'<div class="work"><div class="rings"></div><div><p class="label">{label}</p>'
        f'<h4>{html.escape(t)}</h4><p>{html.escape(c)}</p></div></div>' for t, c in items)
    return ("html", f'<div class="works" style="--n:{len(items)}">{cells}</div>')


# ═══════════════════════════════════════════════════════════════════════
#  ART · Seeing in Silhouette
# ═══════════════════════════════════════════════════════════════════════

ART = G + "art/"
ART_TITLE = "Seeing in Silhouette"
ART_HERO = {"img": HARLEM + "poster1.jpg", "pos": "center 62%"}

ART_LOOK = "Don’t tell me what it means yet. Tell me what you see. Be specific — shapes, colors, positions of figures, what’s in the background, what’s in the foreground."
# Douglas's five signature techniques: (name, what it does)
ART_TECHNIQUES = [
  ("Flat silhouettes", "figures rendered without facial features — universal, archetypal, collective rather than individual"),
  ("Concentric circles", "light radiating outward from a center — spiritual energy, sound waves, divine presence"),
  ("African geometric pattern", "influenced by Egyptian hieroglyphics and West African textile design — a deliberate reclamation of African visual heritage"),
  ("Limited, symbolic color palette", "each painting uses 3–5 colors with specific emotional associations"),
  ("Layered transparency", "figures overlap in semi-transparent layers — collective history, multiple times existing simultaneously")]
ART_SAY = "Douglas was trained in European art — he knew exactly what ‘mainstream’ painting looked like. He chose not to paint that way. Every choice he made was deliberate: the silhouettes say ‘this is everyone, not one person.’ The concentric circles say ‘there is spiritual power here.’ The African patterns say ‘we come from somewhere ancient and magnificent.’ His paintings were arguments made in color and shape."
ART_SONG = {"work": "Song of the Towers", "artist": "Aaron Douglas", "date": "1934", "links": screen_links("Song of the Towers")}

ART_LP = {
  "slug": "seeing-in-silhouette",
  "out": ART + "HR_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": ART_TITLE,
  "sub": "Grades 5–8 · Art · Aaron Douglas and the visual language of the Harlem Renaissance",
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": ART_HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Direct instruction", 12, "#2F4A5A"), ("Activity", 22, "#6A3F88")]),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will analyze Aaron Douglas’s distinctive visual style — flat geometric silhouettes, layered concentric circles, African design influences, and deliberate use of color to evoke emotion and narrative. They will understand how formal art choices carry meaning and argument, and respond through their own silhouette composition or analytical writing."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**National Arts VA:Re7.1** — Hypothesize ways in which art influences perception and understanding of human experiences",
      "**National Arts VA:Re8.1** — Interpret art by analyzing and using contextual information to develop an interpretation",
      "**National Arts VA:Cr2.1** — Demonstrate awareness of ethical implications of creating art and making design decisions",
      "**CCSS.ELA SL.5–8.4** — Present claims and findings using appropriate description, facts, and relevant details"]}),
    ("section", {"label": "Materials needed", "list": [
      "Printed or projected Aaron Douglas images — the handouts name each work; ideal to also display large-format",
      "For studio activity: black card or paper, scissors, colored backgrounds (construction paper or watercolor wash on white card); alternatively, pencil and colored pencils for composition sketches",
      "Differentiated handouts — one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "What do you see?",
      "screen": {"phase": "Hook", "show": "artwork", **ART_SONG,
                 "purpose": "Look before interpreting: observations first, meaning later.",
                 "students": ["Write three observations in 60 seconds — not interpretations, just observations.", ART_LOOK]},
      "body": ["Project *Song of the Towers* (1934) without any introduction. Ask students to write three observations in 60 seconds — not interpretations, just observations.",
               f"*“{ART_LOOK}”*",
               "Take 5–6 responses. Then: *“This painting was made in 1934 by Aaron Douglas. He was the leading visual artist of the Harlem Renaissance. Today we’re going to figure out how he made it work — and why.”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Douglas’s visual language",
      "screen": [
        {"phase": "Direct instruction", "minutes": 8, "script": [0] + [f"**{t}:** {d}" for t, d in ART_TECHNIQUES],
         "title": "Five signature techniques", "show": "chart", "caption": "Douglas’s five signature techniques",
         "columns": ["Technique", "What it does"], "rows": [{"cells": [t, d]} for t, d in ART_TECHNIQUES],
         "purpose": "Give students the vocabulary to read Douglas’s formal choices.",
         "students": ["Find each technique in *Song of the Towers*."]},
        {"phase": "Direct instruction", "minutes": 4, "script": [f"*“{ART_SAY}”*"],
         "title": "Every choice was deliberate", "show": "words", "text": ART_SAY,
         "purpose": "Read the formal choices as an argument.",
         "students": ["What does each choice say?"]}],
      "body": ["Walk through Douglas’s five signature techniques:"], "list": [f"**{t}:** {d}" for t, d in ART_TECHNIQUES]}),
    ("html", f'<p class="say">“{ART_SAY}”</p>'),
    ("section", {"label": "Activity · 22 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Analyze and make in Douglas’s visual language, at the right level of challenge.",
                 "students": CHOOSE},
      "body": ["Students choose a handout."]}),
    ("levels", {
      "green": "Complete a structured visual analysis of *Song of the Towers* using five guided questions. Then create a simple silhouette figure in the style of Douglas — black on colored background, one symbol added.",
      "yellow": "Analyze two Douglas works — compare how he uses the same techniques in different emotional contexts. Create a silhouette composition with at least three figures and a symbolic background. Write a 3-sentence artist statement.",
      "red": "Full formal analysis of three works across all five technique dimensions. Write a 2-paragraph critical interpretation arguing what Douglas’s visual choices communicate about Black identity and history. Optional studio: respond in your own silhouette composition with written rationale."}),
    ("connection", ["**Option 1 — Visit the exhibition:** bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more. Ask your librarian to arrange a visit.",
                    "**Option 2 — Virtual visit:** online at the address below."]),
    ("section", {"label": "Douglas’s biography", "title": "Key facts"}),
    ("refs", [
      ("Born", "1899, Topeka, Kansas"),
      ("Died", "1979, Nashville, Tennessee"),
      ("Education", "University of Nebraska (BA, 1922); studied with Winold Reiss in New York; later studied in Paris"),
      ("Harlem arrival", "1925 — immediately became the leading visual artist of the Renaissance"),
      ("Major works", "*Aspects of Negro Life* (1934, four-panel mural, Schomburg Center); *Song of the Towers* (1934); Fisk University murals (1930)"),
      ("Later career", "Founded the Art Department at Fisk University, Nashville (1944–1966) — trained generations of Black artists")]),
    ("section", {"label": "Teacher reference", "title": "The five techniques"}),
    ("cards", [
      ("Flat Silhouettes", ["By removing facial features, Douglas creates figures that are universal and archetypal rather than individual. This connects to African sculptural traditions and Egyptian hieroglyphic art — and implicitly argues that Black figures deserve the same archetypal status as figures in European classical art."]),
      ("Concentric Circles", ["The radiating circles that appear in almost every Douglas work suggest sound (jazz resonance), spiritual energy (divine light), and shared emotion. They give the paintings a sense of vibration and pulse — as if the image itself is making sound."]),
      ("African Geometric Design", ["Douglas was deeply influenced by his study of West African art and Egyptian imagery. The geometric patterns in his backgrounds deliberately evoke pre-colonial African visual culture — arguing that Black Americans have a rich aesthetic heritage predating slavery."]),
      ("Limited, Symbolic Color Palette", ["Each painting uses 3–5 colors with specific emotional associations."]),
      ("Layered Transparency", ["The semi-transparent overlapping figures suggest that multiple historical moments coexist — past, present, and future simultaneously visible. This is Douglas’s visual equivalent of what W.E.B. Du Bois called “double consciousness.”"])]),
    ("section", {"label": "Cross-curricular and assessment notes", "list": [
      "**ELA connection:** Douglas and Langston Hughes were close collaborators — Douglas illustrated Hughes’s books. Have students compare a Hughes poem to a Douglas image on a similar theme",
      "**Social Studies:** the four-panel *Aspects of Negro Life* mural tells a complete historical narrative from African roots to the Great Migration — a visual equivalent of a history textbook",
      "**Catholic context:** the spiritual imagery in Douglas’s concentric circles invites reflection on how art can express the sacred — connects to the Catholic tradition of sacred art using visual language to express transcendence",
      "**Assessment:** formal analysis writing; sketchbook studio response; artist statement; comparative analysis presentation"]}),
  ]}

def art_handout(level, out, blocks, context, css=""):
    return {"out": ART + out, "eyebrow": "Student handout", "title": ART_TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": context, "css": CSS + WORK_CSS + css,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks, "hero": ART_HERO}

ART_GREEN = art_handout("green", "HR_Handout_Green_Art.pdf", [
  works([("Song of the Towers", "Aaron Douglas, 1934. Oil on canvas.")], "Look carefully · on the screen"),
  ("section", {"label": "Guided analysis"}),
  Q(1, "What do you see in the foreground (front) of the painting?", 3),
  Q(2, "What shapes repeat in the background? What do you think they represent?", 3),
  Q(3, "The figures have no facial features. Why do you think Douglas made that choice?", 3),
  ("section", {"label": "More analysis"}),
  Q(4, "What colors does Douglas use? What mood do those colors create?", 2),
  Q(5, "This painting is about jazz music in Harlem. Where do you see the music in the image?", 2),
  ("task", {"label": "Your turn: make a silhouette", "title": "Create in the Style of Douglas",
            "body": ["In the box below, draw a silhouette figure doing something important — playing music, reading, leading, building. Add at least one circle of light behind the figure, and one pattern or symbol in the background."],
            "blocks": [("draw", "Your silhouette composition — use dark pencil or marker for figures, color lightly for background")]}),
  Q(0, "**What did you choose to show, and why?**", 2),
  ("connection", ["The Harlem Renaissance exhibition features large-format prints of Aaron Douglas’s work alongside interactive displays about his techniques. Look for the concentric circles — how many of his paintings use them?"]),
], ["**About Aaron Douglas:** Aaron Douglas (1899–1979) was the leading visual artist of the Harlem Renaissance. He created a completely new style: flat black silhouettes of figures, overlapping circles of light, and geometric patterns inspired by African art. His paintings told the story of Black history and culture — from Africa, through slavery, to freedom and the creativity of Harlem."],
   css=".drawbox { height: 268pt; }")

ART_YELLOW = art_handout("yellow", "HR_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Activity 1 · Compare two works", "title": "Same Artist, Different Story",
            "blocks": [works([("Song of the Towers", "Aaron Douglas, 1934"),
                              ("Aspects of Negro Life: From Slavery Through Reconstruction", "Aaron Douglas, 1934")])]}),
  ("table", {"head": ["Technique", "Song of the Towers", "Slavery Through Reconstruction"], "rows": [
      ["Mood / emotion", "", ""], ["Use of color", "", ""], ["Role of figures", "", ""],
      ["What the circles suggest", "", ""], ["The narrative / story told", "", ""]]}),
  Q(0, "What do both paintings share, despite their different subjects?", 3),
  Q(0, "Douglas removed facial features from all his figures. What argument does this make about Black identity?", 3),
  ("task", {"label": "Activity 2 · Studio — silhouette composition", "title": "Create Your Own in Douglas’s Style",
            "body": ["Create a silhouette composition with at least three figures. Include: a radiating circle or light source, a symbolic background element, and a deliberately chosen color palette (3–4 colors maximum). Use the box below to sketch your composition first."],
            "blocks": [("draw", "Sketch your composition here — plan figure placement, light source, and color")]}),
  ("section", {"label": "Artist statement"}),
  Q(0, "Write 3 sentences: what story are you telling, what techniques did you use, and what does the viewer need to understand about your choices?", 4),
  ("connection", ["In the exhibition, the Aaron Douglas prints show his full visual range — from spiritual to political to celebratory. Look at how the color palette shifts between works. What does each palette tell you about the mood before you read any label?"]),
], ["**Context:** Aaron Douglas trained in European art traditions but deliberately created a new visual language rooted in African design, Black experience, and the energy of Harlem. Every formal choice — silhouette, color, circle, geometry — carries meaning and argument."],
   css="table.fill td { padding: 5pt 6pt 16pt 0; } table.fill td:first-child { width: 30%; } .drawbox { height: 248pt; }")

ART_RED = art_handout("red", "HR_Handout_Red_Art.pdf", [
  ("task", {"label": "Activity 1", "title": "Three-work formal analysis",
            "blocks": [works([("Song of the Towers", "Aaron Douglas, 1934"), ("The Creation", "Aaron Douglas, 1935"), ("Harriet Tubman", "Aaron Douglas")])]}),
  ("table", {"head": ["Dimension", "Song of the Towers", "The Creation", "Harriet Tubman"], "rows": [
      ["Silhouette use", "", "", ""], ["Circle / light", "", "", ""], ["Color palette + meaning", "", "", ""],
      ["African influence", "", "", ""], ["Narrative / argument", "", "", ""]]}),
  ("task", {"label": "Activity 2 · Critical interpretation", "title": "What Does Douglas Argue?",
            "body": ["Write a two-paragraph critical interpretation. **Paragraph 1:** What visual argument does Douglas make about Black history and identity across all three works? **Paragraph 2:** How do his formal choices (silhouette, circle, color, geometry) make that argument more powerful than if he had painted realistically?"], "lines": 6}),
  ("task", {"label": "Activity 3", "title": "The collaboration",
            "blocks": [works([("Aspects of Negro Life: The Negro in an African Setting", "Aaron Douglas, 1934. Note the concentric circles, silhouettes, and African imagery.")])],
            "body": ["Douglas and Langston Hughes worked together closely — Douglas illustrated Hughes’s books and magazines. Look at this Douglas image and the Hughes poem “The Negro Speaks of Rivers” (1921). What visual and verbal techniques do they share? What does each medium do that the other cannot?"], "lines": 3}),
  ("section", {"label": "Critical question"}),
  Q(0, "Douglas removed facial features from his figures, making them archetypes rather than individuals. Some critics argued this dehumanized his subjects. How would you defend Douglas’s choice against this criticism?", 3),
  ("connection", ["**Deep dive:** Douglas trained in European techniques but deliberately departed from them. Research *Aspects of Negro Life* (1934) — the four-panel mural at the Schomburg Center in Harlem. How does the narrative across four panels function differently from a single painting? What does sequence add to the argument?"]),
], ["**Critical frame:** Art historian Amy Helene Kirschke argues that Aaron Douglas “created a visual language for a people.” Every formal choice Douglas made was both aesthetic and political. Analyze three works using the five technique dimensions, then write a critical interpretation of what his visual choices argue about Black identity and history."],
   css="table.fill td { padding: 5pt 6pt 27pt 0; } table.fill td:first-child { width: 22%; } table.fill + .task { break-before: page; }")


# ═══════════════════════════════════════════════════════════════════════
#  MATH · Migration by Numbers
# ═══════════════════════════════════════════════════════════════════════

MATH = G + "math/"
MATH_TITLE = "Migration by Numbers"
MATH_HERO = {"img": HARLEM + "images/migration/harlem.jpg", "pos": "center 45%"}

CHI = [("1910", 44103), ("1920", 109458), ("1930", 233903), ("1940", 277731), ("1950", 492265), ("1960", 812637)]

CHART_CSS = """
.chart { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.72); padding: 9pt 14pt 8pt 10pt; margin: 4pt 0 10pt; break-inside: avoid; }
.chart .ct { font: 500 7pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); text-align: center; margin: 0 0 6pt; }
.plot { position: relative; margin-left: 34pt; border-left: 1pt solid #1d1c1a; border-bottom: 1pt solid #1d1c1a; }
.plot .gl { position: absolute; left: 0; right: 0; border-top: .6pt solid #c8c5bb; }
.plot .yl { position: absolute; left: -34pt; width: 28pt; text-align: right; font: 400 7pt 'Outfit'; color: #3f3e3a; transform: translateY(-50%); }
.plot .bars { position: absolute; inset: 0; display: flex; justify-content: space-around; align-items: flex-end; }
.plot .bar { width: 11%; background: #4A7346; position: relative; }
.plot .bar span { position: absolute; top: -11pt; left: 0; right: 0; text-align: center; font: 500 7pt 'Outfit'; color: #4A7346; }
.plot .vl { position: absolute; top: 0; bottom: 0; border-left: .6pt solid #c8c5bb; }
.xl { display: flex; justify-content: space-around; margin-left: 34pt; font: 400 7.5pt 'Outfit'; color: #3f3e3a; padding-top: 3pt; }
.xl.grid { justify-content: space-between; }
.xl.grid span { width: 0; display: flex; justify-content: center; }
"""

def bar_chart():
    h, top = 140, 800000
    grid = "".join(f'<div class="gl" style="bottom:{v / top * 100}%"></div><div class="yl" style="top:{100 - v / top * 100}%">{v // 1000 if v else 0}{"K" if v else ""}</div>'
                   for v in range(0, top + 1, 200000))
    bars = "".join(f'<div class="bar" style="height:{n / top * 100:.1f}%"><span>{round(n / 1000)}K</span></div>' for _, n in CHI)
    xl = "".join(f"<span>{y}</span>" for y, _ in CHI)
    return ("html", f'<div class="chart"><p class="ct">Chicago’s Black Population, 1910–1960</p>'
                    f'<div class="plot" style="height:{h}pt">{grid}<div class="bars">{bars}</div></div>'
                    f'<div class="xl">{xl}</div></div>')

def graph_grid():
    h, top = 108, 900000
    grid = "".join(f'<div class="gl" style="bottom:{v / top * 100}%"></div><div class="yl" style="top:{100 - v / top * 100}%">{v // 1000 if v else 0}{"K" if v else ""}</div>'
                   for v in range(0, top + 1, 150000))
    # minor rules every 50K, and one vertical rule per year
    minor = "".join(f'<div class="gl" style="bottom:{v / top * 100}%;border-color:#e4e1d8"></div>'
                    for v in range(50000, top, 50000) if v % 150000)
    vl = "".join(f'<div class="vl" style="left:{i * 20}%"></div>' for i in range(1, 6))
    xl = "".join(f"<span>{y}</span>" for y, _ in CHI)
    return ("html", f'<div class="chart"><p class="ct">Plot the points and connect them →</p>'
                    f'<div class="plot" style="height:{h}pt;margin-right:8pt">{minor}{grid}{vl}</div>'
                    f'<div class="xl grid" style="margin-right:8pt">{xl}</div></div>')

MATH_Q = "How many schools that size would you need to fill to get 6 million students?"
MATH_LOOK = ["Before we calculate anything, what does this data tell us just by looking at it?", "What years show the fastest growth?"]
MATH_FORMULA = "(new − old) ÷ old × 100"
# the plan's two worked examples: (title, working, answer)
MATH_WORKED = [("Chicago 1910 → 1920", "(109,458 − 44,103) ÷ 44,103 × 100 = 65,355 ÷ 44,103 × 100", "148.2% increase"),
               ("Chicago 1950 → 1960", "(812,637 − 492,265) ÷ 492,265 × 100 = 320,372 ÷ 492,265 × 100", "65.1% increase")]
MATH_HUMAN = "These numbers represent human beings."

MATH_LP = {
  "slug": "migration-by-numbers",
  "out": MATH + "HR_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": MATH_TITLE,
  "sub": "Grades 5–8 · Mathematics · The Great Migration in data",
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": MATH_HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 8, "#2F4A5A"), ("Activity", 25, "#6A3F88"), ("Closing", 7, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will use real Great Migration population data to practice percentage change, data interpretation, ratio and proportion, and graphical representation. They will understand that mathematics can reveal the scale of historical events — and that the numbers behind the Harlem Renaissance represent millions of individual human decisions."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**CCSS.Math 6.RP.A.3** — Use ratio and rate reasoning to solve real-world problems; find percentage of a quantity",
      "**CCSS.Math 7.RP.A.3** — Use proportional relationships to solve multi-step percent problems including percentage change",
      "**CCSS.Math 6.SP.B.4/5** — Display and summarize numerical data; describe the nature of the attribute under investigation",
      "**CCSS.Math 8.SP.A.1** — Construct and interpret scatter plots for bivariate measurement data; describe patterns"]}),
    ("section", {"label": "Materials needed", "list": [
      "Differentiated handouts — one per student",
      "Calculators (optional — Green level may benefit; Red level should work without)",
      "Graph paper or handout graph grids (included on handouts)",
      "Optional: project the Great Migration Map to give geographic context before the data work"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "How big is a million?",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0], "show": "question", "question": MATH_Q,
         "purpose": "Make a number too big to picture into one you can.",
         "students": ["Imagine a school of about 650 students.", "Take 30 seconds and work it out."]},
        {"phase": "Hook", "minutes": 2, "script": [1], "title": "The answer", "show": "worked",
         "examples": [{"title": "Six million students", "steps": ["Imagine a school of about 650 students.", MATH_Q],
                       "answer": "~9,230 schools"}],
         "purpose": "Turn the scale back into people: every one made a decision.",
         "students": ["Each one of those 6 million people made a decision — pack up, leave everything, travel north."]}],
      "body": [f"*“Six million people moved north during the Great Migration. That’s a number that’s hard to visualize. Let’s try: imagine a school of about 650 students. {MATH_Q} Take 30 seconds and work it out.”*",
               "Answer: **~9,230 schools.** Then: *“Each one of those 6 million people made a decision — pack up, leave everything, travel north. Today we’re going to look at what those decisions look like in numbers.”*"]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "Reading the data",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "show": "chart", "caption": "Chicago’s Black population, 1910–1960",
         "columns": ["Year", "Chicago’s Black population"], "rows": [{"cells": [y, f"{n:,}"]} for y, n in CHI],
         "purpose": "Read the data before calculating anything.",
         "students": MATH_LOOK},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Percentage change", "show": "worked",
         "examples": [{"title": t, "steps": [MATH_FORMULA, w], "answer": a} for t, w, a in MATH_WORKED],
         "purpose": "Learn the fair way to compare growth.",
         "students": ["Which decade grew faster proportionally? Which added more people?"]}],
      "body": ["Walk through the core dataset on the board — Chicago’s Black population: "
               + ", ".join(f"{y} ({n:,})" for y, n in CHI) + ". Ask: " + MATH_LOOK[0][0].lower() + MATH_LOOK[0][1:] + " " + MATH_LOOK[1],
               f"*“Percentage change is the mathematician’s way of making fair comparisons. A city growing by 10,000 people means something very different if it started with 50,000 versus 5 million. We calculate: {MATH_FORMULA}.”*"]}),
    ("section", {"label": "Activity · 25 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with the census data at the right level of challenge.",
                 "students": CHOOSE},
      "body": ["Students choose a handout."]}),
    ("levels", {
      "green": "Read a pre-drawn bar chart of Chicago’s Black population growth. Identify the decade of fastest growth, calculate one percentage change with scaffolding, and answer interpretation questions in complete sentences.",
      "yellow": "Calculate percentage change for all six decades. Create a line graph from the data table. Identify and explain the pattern. Compare Chicago to one other Northern city using a ratio.",
      "red": "Full percentage change table for three cities (Chicago, New York, Detroit). Calculate rates of change. Analyze: which city’s Black population grew fastest proportionally vs absolutely? Write a statistical summary paragraph and evaluate what the data does not show."}),
    ("section", {"label": "Closing · 7 minutes",
      "screen": {"phase": "Closing", "show": "words", "title": "Closing", "text": MATH_HUMAN,
                 "purpose": "Return from the numbers to the people they count.",
                 "students": ["Numbers can tell us how many people moved. What can’t numbers tell us about the Great Migration?"]},
      "body": [f"*“{MATH_HUMAN} Every percentage point of growth is thousands of families who packed their belongings and moved north. Mathematics helps us understand the scale of history — but it can’t tell us what it felt like. That’s what the poets and painters were for.”*"]}),
    ("connection", ["**Option 1 — Visit the exhibition:** bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more. Ask your librarian to arrange a visit.",
                    "**Option 2 — Virtual visit:** online at the address below."]),
    ("pagebreak", None),
    ("section", {"label": "Data tables — teacher reference", "title": "Black population in Northern cities (US Census data)"}),
    ("table", {"head": ["City", "1910", "1920", "1930", "1940", "1950", "1960"], "rows": [
      ["**Chicago, IL**", "44,103", "109,458", "233,903", "277,731", "492,265", "812,637"],
      ["**New York, NY**", "91,709", "152,467", "327,706", "458,444", "747,608", "1,087,931"],
      ["**Detroit, MI**", "5,741", "40,838", "120,066", "149,119", "300,506", "482,223"],
      ["**Philadelphia, PA**", "84,459", "134,229", "219,599", "250,880", "376,041", "529,240"]]}),
    ("section", {"label": "Worked example", "title": "Percentage change",
      "body": [f"**{t}:** {w} = **{a}**" for t, w, a in MATH_WORKED] + [
               "**Note:** the 1910–1920 decade shows proportionally faster growth (148%) than the 1950–1960 decade (65%), even though the absolute increase was larger in 1950–1960. This is a key teaching moment for percentage change vs absolute change."]}),
    ("section", {"label": "Discussion questions", "list": [
      "Detroit grew by 611% between 1910 and 1920. What was happening in Detroit’s economy at that time that explains this? *(Ford Motor Company, WWI armaments production)*",
      "New York’s Black population in 1960 was over 1 million. Harlem is one neighborhood. What does this tell us about the limits of the “Harlem Renaissance” label?",
      "What does the data not show? *(Living conditions, discrimination, wages, segregation in Northern cities)*"]}),
    ("section", {"label": "Cross-curricular connections", "list": [
      "**Social Studies:** each spike in the data corresponds to a historical event — WWI, WWII, the Great Depression (note the slowdown in the 1930s), the post-war boom",
      "**Science:** exponential vs linear growth; graph shapes and what they indicate about rate of change",
      "**ELA:** writing a statistical summary paragraph requires the same claim-evidence-reasoning structure used in literary analysis"]}),
  ]}

def math_handout(level, out, blocks, context, css=""):
    return {"out": MATH + out, "eyebrow": "Student handout", "title": MATH_TITLE,
            "sub": "Grades 5–8 · Math", "level": level, "context": context, "css": CSS + CHART_CSS + css,
            "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level", "blocks": blocks, "hero": MATH_HERO}

B = "________"

MATH_GREEN = math_handout("green", "HR_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Read the bar chart",
            "blocks": [bar_chart(),
                       Q(1, "In which decade did the population grow the most? Circle:", 0),
                       ("html", '<div class="chips words">' + "".join(f"<span>{d}</span>" for d in ["1910–20", "1920–30", "1930–40", "1940–50", "1950–60"]) + "</div>"),
                       Q(2, "Approximately how many more people lived in Chicago in 1960 than in 1910?", 2)]}),
  ("task", {"label": "Part 2", "title": "Calculate one percentage change",
            "blocks": [P("Use the formula: **(New − Old) ÷ Old × 100**"),
                       P("Chicago’s Black population in 1910: **44,103**  In 1920: **109,458**"),
                       P(f"**Step 1 — Subtract:**   109,458 − 44,103 = {B}{B}", "step"),
                       P(f"**Step 2 — Divide:**   {B}{B} ÷ 44,103 = {B}{B}", "step"),
                       P(f"**Step 3 — Multiply by 100:**   {B}{B} × 100 = {B}{B} %", "step")]}),
  ("task", {"label": "Part 3", "title": "Interpret the data", "blocks": [
    Q(3, "Why do you think Chicago’s Black population grew so fast between 1910 and 1920?", 3),
    Q(4, "The population grew by over 148% in one decade. What does that mean in plain English?", 3),
    Q(5, "Numbers can tell us how many people moved. What can’t numbers tell us about the Great Migration?", 3)]}),
  ("cols", [[("connection", ["The Great Migration Map in the exhibition shows the route the music traveled from the Mississippi Delta to Harlem. Straight from the Delta to New York is more than 1,000 miles. Each dot on the map is a stop on that route."])],
            [("family", ["Tell someone at home: *“Chicago’s Black population grew by 148% in just 10 years.”* Ask them: what does that kind of growth do to a city?"])]]),
], ["**Big idea:** During the Great Migration, millions of Black Americans moved from the South to Northern cities. We can use **data** to see how quickly cities like Chicago changed. A **percentage change** tells us how much something grew compared to where it started.",
    "**Formula:** (New − Old) ÷ Old × 100"],
   css=".words { gap: 7pt; margin: 2pt 0 10pt; } .words span { font-size: 8.5pt; padding: 4pt 11pt; letter-spacing: .08em; }"
       " .cols .conn, .cols .family { margin-top: 0; height: 100%; } .cols .family { border-top: 0; border-left: .8pt solid #c8c5bb; padding: 7pt 0 0 12pt; }"
       " .step { margin: 0 0 12pt; font-size: 11pt; } .chart .plot .bar span { color: #2f4a2c; }")

MATH_YELLOW = math_handout("yellow", "HR_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Activity 1 · Complete the percentage change table", "title": "Chicago’s Black Population Growth by Decade",
            "blocks": [("table", {"head": ["Decade", "Start population", "End population", "Change (absolute)", "% Change (show working)"], "rows": [
              ["1910–1920", "44,103", "109,458", "", ""], ["1920–1930", "109,458", "233,903", "", ""],
              ["1930–1940", "233,903", "277,731", "", ""], ["1940–1950", "277,731", "492,265", "", ""],
              ["1950–1960", "492,265", "812,637", "", ""]]})]}),
  ("task", {"label": "Activity 2", "title": "Create a line graph",
            "blocks": [P("Plot Chicago’s Black population (y-axis: 0 to 900,000) against year (x-axis: 1910 to 1960). Connect the points and label each one."),
                       graph_grid()]}),
  ("task", {"label": "Activity 3", "title": "Interpret and compare", "blocks": [
    ("html", f'<div class="cols"><div>{Q(0, "Which decade shows the highest percentage change?", 1)[1]}</div><div>{Q(0, "Which shows the highest absolute change?", 1)[1]}</div></div>'),
    Q(0, "Why are these different? Explain in your own words:", 4),
    Q(0, "New York’s Black population in 1960 was **1,087,931**. Chicago’s was **812,637**. Calculate the ratio of New York to Chicago, rounded to the nearest tenth (__ : 1):", 3)]}),
  ("task", {"label": "Activity 4", "title": "What the data shows — and doesn’t",
            "blocks": [P("Census population data shows how many people moved. Write two things the data shows clearly, and two things it cannot tell us about the Great Migration:"),
                       ("table", {"head": ["The data SHOWS us…", "The data CANNOT tell us…"], "rows": [["1.", "1."], ["2.", "2."]]})]}),
  ("connection", ["The Great Migration Map in the exhibition follows the music north, to Chicago and to Harlem. Use your percentage change data: which destination city grew proportionally fastest? What might explain that pattern?",
                  "**Extension:** the 1930s shows the slowest growth in the data. Research: what was happening in America in the 1930s that might explain this? (Hint: think about employment and the economy.)"]),
], ["**Data:** Chicago’s Black population — 1910: 44,103  |  1920: 109,458  |  1930: 233,903  |  1940: 277,731  |  1950: 492,265  |  1960: 812,637",
    "**Formula:** Percentage change = (New − Old) ÷ Old × 100"],
   css="table.fill td { padding: 4pt 6pt 7pt 0; } .cols .q { margin-bottom: 4pt; } .chart { padding: 6pt 14pt 4pt 10pt; margin-bottom: 6pt; } .chart .ct { margin-bottom: 4pt; }"
       " .task table.fill td:first-child + td + td + td + td { width: 30%; }"
       " table.fill:has(th:nth-child(2):last-child) td { padding: 4pt 6pt 34pt 0; width: 50%; }")

MATH_RED = math_handout("red", "HR_Handout_Red_Math.pdf", [
  ("section", {"label": "Data", "title": "Black population in Northern cities (US Census)"}),
  ("table", {"head": ["City", "1910", "1920", "1930", "1940", "1950", "1960"], "rows": [
      ["**Chicago**", "44,103", "109,458", "233,903", "277,731", "492,265", "812,637"],
      ["**New York**", "91,709", "152,467", "327,706", "458,444", "747,608", "1,087,931"],
      ["**Detroit**", "5,741", "40,838", "120,066", "149,119", "300,506", "482,223"]]}),
  ("task", {"label": "Activity 1", "title": "Full percentage change analysis — three cities",
            "blocks": [("table", {"head": ["Decade", "Chicago % change", "New York % change", "Detroit % change"], "rows": [
              ["1910–1920", "", "", ""], ["1920–1930", "", "", ""], ["1930–1940", "", "", ""],
              ["1940–1950", "", "", ""], ["1950–1960", "", "", ""], ["**Total 1910–1960**", "", "", ""]]})]}),
  ("task", {"label": "Activity 2", "title": "Proportional vs absolute growth",
            "blocks": [P(f"Which city grew fastest proportionally (% change)?  {B}{B}{B}"),
                       P(f"Which city added the most people in absolute numbers?  {B}{B}{B}"),
                       P("Why do proportional and absolute growth tell different stories? When would each measure be more useful?")],
            "lines": 2}),
  ("task", {"label": "Activity 3", "title": "Statistical summary paragraph",
            "body": ["Write a paragraph (5–7 sentences) summarizing what the data reveals about the Great Migration. Include: the city with the greatest proportional growth, the decade with the greatest absolute growth across all three cities, any anomalies you notice (e.g. the 1930s slowdown), and one limitation of using this data alone to understand the migration."], "lines": 5}),
  ("task", {"label": "Activity 4", "title": "Rate of change — extension", "blocks": [("cols", [
      [P("If Chicago’s Black population grew from 44,103 in 1910 to 812,637 in 1960, calculate the average annual rate of change in people per year over the full 50-year period:"), ("lines", 3)],
      [P("Now calculate the average rate for just the 1910–1920 decade (per year). Compare the two rates — what does this tell you about when migration was most intense?"), ("lines", 3)]])]}),
  ("section", {"label": "Critical reflection"}),
  Q(0, "A statistician and a historian might look at this same data and draw very different conclusions. The statistician sees growth rates and patterns. The historian asks: what caused each spike? What does the 1930s slowdown reveal? Choose one decade and write: what would each perspective say about it?", 3),
  ("connection", ["The Great Migration Map follows the journey north, to Chicago and to Harlem. Using your data: if 6 million people migrated total, and New York received roughly 1 million by 1960, what percentage of total migrants went to New York? What assumptions are you making in that calculation?",
                  "**Research extension:** find data on the total US Black population in 1910 and 1960. What percentage of all Black Americans had moved north by 1960? How does this change your understanding of the scale of the migration?"]),
], [],
   css="table.fill td { padding: 3pt 6pt 4pt 0; } .task table.fill td { padding: 4pt 6pt 9pt 0; }")


# ═══════════════════════════════════════════════════════════════════════
#  PE · Move Like Harlem
# ═══════════════════════════════════════════════════════════════════════

PE = G + "pe/"
PE_TITLE = "Move Like Harlem"
PE_HERO = {"img": HARLEM + "images/migration/chicago.jpg", "pos": "center 30%"}

PE_CONTEXT = "The Savoy Ballroom opened in Harlem in 1926. It held 4,000 people. Black and white dancers danced together — which was illegal in many other places in America. The Lindy Hop was born there. It was named after Charles Lindbergh’s transatlantic flight in 1927 — people said the dancers looked like they were flying. Today we’re going to move the way Harlem moved."
# the warm-up's four calls: (call, what to do)
PE_CALLS = [("freeze", "hold pose"), ("slow motion", "half speed"), ("double time", "double speed"),
            ("mirror", "copy teacher’s arm movements while walking")]
PE_COOL_Q = "Where in your body did you feel the rhythm most? What did it feel like to move to music that was made about 100 years ago?"
# the core activity's three phases: (label, minutes, title, what to teach)
PE_PHASES = [
  (8, "Charleston Step", ["Teach the basic Charleston: step forward on right, kick left foot forward; step back on left, kick right foot back. Count 1-2-3-4.",
                          "Once secure: add arm swing.", "Once secure: try with partner in mirror."]),
  (10, "Lindy Hop Basics", ["Introduce the rock-step: rock back on left (count 1), replace weight onto right (count 2); then triple step left-right-left (counts 3-and-4) and triple step right-left-right (counts 5-and-6). This is the 6-count basic, the first step most Lindy Hop classes teach.",
                            "Practice solo, then in loose pairs (not holding hands — just facing)."]),
  (7, "Creative Response", ["Students in groups of 3–4. Give each group a card: **Joy / Protest / Journey / Arrival in Harlem**.",
                            "Groups create a 16-count movement sequence using the vocabulary they’ve learned that expresses their word.",
                            "Share with one other group."])]

def pe_phases_html():
    cells = "".join(f'<div><p class="label">Phase {i} · {m} min</p><h4>{t}</h4><p>'
                    + re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", " ".join(text)) + "</p></div>\n"
                    for i, (m, t, text) in enumerate(PE_PHASES, 1))
    return '<div class="phases">\n' + cells + "</div>"

PE_LP = {
  "slug": "move-like-harlem",
  "out": PE + "HR_LP_PE.pdf", "eyebrow": "Teacher lesson plan", "title": PE_TITLE,
  "sub": "Grades 5–8 · Physical Education · The Lindy Hop, the Charleston and the Savoy Ballroom",
  "foot": "Teacher Lesson Plan · Grades 5–8 PE", "hero": PE_HERO, "css": CSS,
  "blocks": [
    ("timing", [("Context", 3, "#7D8471"), ("Warm-up", 8, "#2F4A5A"), ("Movement vocabulary", 25, "#6A3F88"), ("Cool-down", 9, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will explore the physical vocabulary of Harlem Renaissance dance — the Lindy Hop, Charleston, and jazz movement — understanding these not as performance spectacle but as a form of cultural expression, community building, and joyful resistance. They will connect rhythmic movement to musical structure, develop coordination through partner and group patterns, and reflect on dance as embodied history."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**SHAPE Standard 1** — Demonstrate competency in a variety of motor skills and movement patterns in dance contexts",
      "**SHAPE Standard 2** — Apply knowledge of concepts, principles, strategies, and tactics related to movement and performance",
      "**SHAPE Standard 5** — Recognize the value of physical activity for health, enjoyment, challenge, and social interaction"]}),
    ("section", {"label": "Materials needed", "list": [
      "**Audio:** upbeat jazz — recommended: Chick Webb, “Stompin’ at the Savoy” (1934); Duke Ellington, “It Don’t Mean a Thing” (1932). Both free on YouTube.",
      "Open gym space or cleared classroom; no equipment needed",
      "Optional: short video clip of Lindy Hop dancers at the Savoy Ballroom (several authentic clips on YouTube)",
      "Differentiated reflection handouts — one per student (completed after activity)"]}),
    ("section", {"label": "Context · 3 minutes · before going to the gym",
      "screen": {"phase": "Context", "show": "words", "title": "The Savoy Ballroom", "text": PE_CONTEXT,
                 "purpose": "Set the dances in their place and time before anyone moves.",
                 "students": ["Today we’re going to move the way Harlem moved."]},
      "body": [f"*“{PE_CONTEXT}”*"]}),
    ("section", {"label": "Warm-up · 8 minutes", "title": "Jazz walk and rhythm",
      "screen": {"phase": "Warm-up", "show": "chart", "caption": "The teacher calls out", "columns": ["Call", "What to do"],
                 "rows": [{"cells": [c, w]} for c, w in PE_CALLS],
                 "purpose": "Establish rhythmic listening and body awareness before structured movement.",
                 "students": ["Walk to the beat of the music.", "Listen for the call."]},
      "body": ["Students walk to the beat of jazz music. Teacher calls out: "
               + ", ".join(f"**{c}** ({w})" for c, w in PE_CALLS)
               + ". Purpose: establishes rhythmic listening and body awareness before structured movement."]}),
    ("section", {"label": "Core activity · 25 minutes", "title": "Movement vocabulary",
      # the three phases are printed as one block below; each is a step on screen
      "screen": [{"phase": "Movement vocabulary", "minutes": m, "script": [" ".join(text)], "title": t, "show": "words",
                  "text": text[0], "purpose": p, "students": text[1:]}
                 for (m, t, text), p in zip(PE_PHASES, [
                   "Learn the basic Charleston step to a count of four.",
                   "Learn the 6-count Lindy Hop basic.",
                   "Use the new vocabulary to say something in movement."])]}),
    ("html", pe_phases_html()),
    ("section", {"label": "Cool-down and reflection · 9 minutes",
      "screen": {"phase": "Cool-down", "show": "question", "title": "Cool-down and reflection", "question": PE_COOL_Q,
                 "purpose": "Slow down, and reflect on dance as embodied history.",
                 "students": ["Slow walk to the music.", "Complete the reflection handout."]},
      "body": [f"Slow walk to music cooling down. Ask: *“{PE_COOL_Q}”* Students complete reflection handout."]}),
    ("connection", ["**Option 1 — Visit the exhibition:** bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more. Ask your librarian to arrange a visit.",
                    "**Option 2 — Virtual visit:** online at the address below."]),
    ("pagebreak", None),
    ("section", {"label": "The Savoy Ballroom", "title": "Historical notes"}),
    ("refs", [("Location", "596 Lenox Avenue, Harlem, New York"), ("Open", "1926–1958")]),
    ("html", "<p>The Savoy was the most famous dance hall in America during the Harlem Renaissance. Nicknamed “The Track” (for its long dance floor) and “The Home of Happy Feet,” it was one of the few integrated public spaces in New York — Black and white dancers were equally welcome. The Lindy Hop was developed and refined there by dancers like Frankie Manning and Norma Miller.</p>"
             "<p>The Lindy Hop was named after Charles Lindbergh’s solo transatlantic flight in 1927 — a dancer reportedly said the jumps looked like “hops” across the Atlantic. It became the defining American social dance of the 20th century, eventually evolving into swing, jitterbug, and rock-and-roll dancing.</p><div style=\"height:6pt\"></div>"),
    ("section", {"label": "Differentiation notes", "list": [
      "**Students with mobility limitations:** all movements can be adapted to seated or upper-body-only versions. The rhythm and arm patterns carry the learning objective independently of footwork.",
      "**Students uncomfortable with partner work:** all phases can be completed solo or in parallel with others — no physical contact is required at any point in this lesson.",
      "**Extension for confident movers:** teach the “air step” — one partner lifts the other. This requires significant trust and should only be introduced if safety permits and students request it."]}),
    ("section", {"label": "Cross-curricular connections", "list": [
      "**Music:** syncopation and swing are felt physically in Lindy Hop — dancers feel the accents swing music puts where you don’t expect them. PE makes the music theory visceral.",
      "**Social Studies:** the Savoy Ballroom was an integrated space in segregated New York — this is a history lesson about resistance expressed through joy",
      "**Science:** center of gravity, momentum, and rhythm as temporal pattern are all physically experienced in partner dance",
      "**Catholic Social Teaching:** the Savoy Ballroom’s integration was a practical expression of human dignity — people of different races choosing to celebrate together when the law said otherwise"]}),
    ("section", {"label": "Assessment", "list": [
      "Participation and rhythmic engagement during activity",
      "Quality of reflection response — depth of connection between movement and cultural context",
      "Group creative sequence — does the movement communicate the given concept?"]}),
  ]}
PE_LP["css"] += """
.phases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt; margin: 2pt 0 11pt; break-inside: avoid; }
.phases > div { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 9pt 3pt; font-size: 9pt; }
.phases h4 { margin: 0 0 3pt; }
"""

def pe_handout(level, out, blocks, context, css=""):
    return {"out": PE + out, "eyebrow": "Student handout · Reflection", "title": PE_TITLE,
            "sub": "Grades 5–8 · PE", "level": level, "context": context, "css": CSS + PE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 PE · {level.title()} Level", "blocks": blocks, "hero": PE_HERO}

PE_CSS = """
.cols .conn, .cols .family { margin-top: 0; height: 100%; } .cols .family { border-top: 0; border-left: .8pt solid #c8c5bb; padding: 7pt 0 0 12pt; }
"""

WORDS = ["Joyful", "Hard", "Energetic", "Embarrassing", "Fun", "Surprising", "Connected", "Free"]

PE_GREEN = pe_handout("green", "HR_Handout_Green_PE.pdf", [
  ("section", {"label": "Reflection", "title": "How Did It Feel?"}),
  Q(1, "Circle the words that describe how the movement felt:", 0),
  ("html", '<div class="chips words">' + "".join(f"<span>{w}</span>" for w in WORDS) + "</div>"),
  Q(2, "What part of your body felt the rhythm the most?", 6),
  Q(3, "The Savoy Ballroom was one of the only places in New York where Black and white people danced together. Why do you think dancing together mattered?", 10),
  Q(4, "Your group was given a concept word to express in movement. What word did you get, and how did your group show it?", 10),
  ("cols", [[("connection", ["The Jazz Lab lets you hear the same music you danced to today. Try listening again with your eyes closed — does it feel different now that you’ve moved to it?"])],
            [("family", ["Teach someone at home the Charleston step. Tell them where it came from."])]]),
], ["**What we did:** Today you learned the Charleston step and the basics of the Lindy Hop — dances born at the Savoy Ballroom in Harlem in the 1920s. These weren’t just dances. They were how people celebrated, connected, and expressed who they were."],
   css=".words { gap: 7pt; margin: 4pt 0 12pt 16pt; } .words span { font-size: 8.5pt; padding: 5pt 12pt; }")

PE_YELLOW = pe_handout("yellow", "HR_Handout_Yellow_PE.pdf", [
  ("section", {"label": "Reflection", "title": "Movement, Music, and Meaning"}),
  Q(1, "In the creative sequence activity, your group used movement to express a concept. Describe what you created and explain the connection between your movement choices and your concept word:", 7),
  Q(2, "Swing music accents the off-beat (the syncopated beat). How did feeling syncopation physically change your understanding of it as a musical concept?", 7),
  Q(3, "Lindy Hop dancers describe the dance as a conversation between partners — you have to listen and respond. How does this connect to the call-and-response structure in jazz?", 7),
  Q(4, "What does it mean for a physical activity — dancing — to be a form of cultural resistance?", 7),
  ("connection", ["**At the Jazz Lab:** listen to Chick Webb’s “Stompin’ at the Savoy.” Try clapping the off-beat (the “and” between counts) while you step the beat — the feel you danced to today."]),
], ["**Context:** The Lindy Hop and Charleston were not simply entertainment — they were cultural expression and, in the context of Jim Crow America, a form of resistance and celebration. The Savoy Ballroom was one of the few integrated public spaces in New York City. Dance was a language that crossed racial barriers that law and custom enforced everywhere else."])

PE_RED = pe_handout("red", "HR_Handout_Red_PE.pdf", [
  ("section", {"label": "Critical reflection"}),
  Q(1, "In your creative sequence, you translated an abstract concept into physical movement. What choices did you make about rhythm, energy, and space — and why did you make them? Were they conscious choices or instinctive?", 7),
  Q(2, "Gottschild argues that Black aesthetic contributions to American dance were systematically uncredited. How does this connect to patterns you’ve seen in the Harlem Renaissance more broadly — in music, art, and literature?", 7),
  Q(3, "The Lindy Hop is described as “conversation between partners.” You physically experienced this today. What did that teach you about the difference between performing and communicating?", 7),
  Q(4, "The Savoy Ballroom was demolished in 1958 to build public housing. What is lost when a cultural site is destroyed — and who decides what gets preserved?", 6),
  ("connection", ["**Deep dive:** research Frankie Manning (1914–2009), who helped create the Lindy Hop’s aerial moves at the Savoy. He danced and taught it for most of his long life, and led its revival in the 1980s. What does his story reveal about how cultural knowledge is transmitted — and what risks that transmission faces?"]),
], ["**Critical frame:** Dance scholar Brenda Dixon Gottschild argues that the Lindy Hop was the first time African American aesthetics — improvisation, polyrhythm, call-and-response, groundedness — were adopted wholesale by mainstream American culture, though rarely credited to their Black originators. The Savoy Ballroom was simultaneously a space of genuine integration and a site where Black cultural ownership was later erased."])

DOCS = [ART_LP, ART_GREEN, ART_YELLOW, ART_RED,
        MATH_LP, MATH_GREEN, MATH_YELLOW, MATH_RED,
        PE_LP, PE_GREEN, PE_YELLOW, PE_RED]

# links to the paintings this module names (see _links.py)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import add_links as _add_links
_add_links(DOCS)
