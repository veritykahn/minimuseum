"""Grades 5–8 · Art · "The Shape of Fear"
How the Fear Lab's posters make fear with very little: three colors (navy
ground, cream type, marigold subheads), flat silhouettes (the spider, the
clawed hand, the caped vampire seen from behind), and what they leave out,
so the viewer's brain fills it in (pareidolia; the mystery box). Students
design a three-color image whose monster the viewer has to finish. Facts
follow app/exhibitions/fear-lab/fearLab.ts: the posters' copy, their
pictures' own descriptions, and the palette it names."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

DIR = "teachers/grades-5-8/art/"
TITLE = "The Shape of Fear"
SUB = "Grades 5–8 · Art · Silhouette, a three-color palette and what you leave out"

HERO = {"img": VAMPIRE, "pos": "center 30%"}

# the posters' palette, as fearLab.ts names and sets it
PALETTE = [("Navy", "#1F3A5F", "the ground"), ("Cream", "#FBF6EC", "the type and the hand"), ("Marigold", "#F2B33D", "the subheads and the starburst")]

HOOK_Q = "Who is he? What does his face look like?"
LAST_Q = "Look at a classmate’s design. What did your brain fill in that isn’t on the page?"
HAND_ALT = "The poster’s clawed hand: a flat cream shape with long, curved fingers"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("name three choices that make the Fear Lab posters feel frightening: a limited palette, flat silhouettes and what is left out",
     "name three choices that make the posters feel frightening?", False),
    ("explain why a shape you can’t quite see can scare you more than one you can",
     "explain why a half-seen shape can be scarier than a clear one?", False),
    ("design a three-color image built on a silhouette",
     "design a three-color image built on a silhouette?", False),
    ("leave the monster for the viewer to finish, and explain every choice in an artist’s statement",
     "make the viewer finish the monster, and explain your choices?", True)],
  "why": "Posters, film titles and book covers all use these tricks on you. Seeing how little it takes to make a feeling lets you read them, and make your own."}

CSS = """
.hero { background: #1F3A5F; }
.swatches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 10pt; break-inside: avoid; }
.swatches > div { border: .8pt solid #1d1c1a; border-radius: 4pt; overflow: hidden; background: #fff; }
.swatches i { display: block; height: 34pt; }
.swatches p { margin: 0; padding: 4pt 6pt 5pt; font: 500 8.5pt/1.3 'Outfit'; }
.swatches p span { display: block; font-weight: 400; color: #5F6655; }
.blobs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; justify-items: center; break-inside: avoid; }
.blobs > div { background: rgba(255,255,255,.55); border-radius: 6pt; padding: 6pt; }
.drawbox { background: rgba(255,255,255,.4); break-inside: avoid; }
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; }
.thumbs .drawbox { height: 120pt; }
table.fill td { padding: 4pt 6pt 6pt 0; }
.task h3, .task .label { break-after: avoid; }
"""
PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
.wall { display: grid; grid-template-columns: 1.05fr 1.05fr .8fr .8fr; gap: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
.wall figure { margin: 0; }
.wall img { width: 100%; height: 150pt; object-fit: cover; border-radius: 3pt; border: .8pt solid #1d1c1a; display: block; }
.wall img.png { object-fit: contain; background: #1F3A5F; padding: 8pt; box-sizing: border-box; }
.wall figcaption { font: 400 8pt/1.3 'Outfit'; color: #5F6655; margin-top: 3pt; }
.wall figcaption b { color: #1d1c1a; font-weight: 500; display: block; }
"""

def swatches(fill=False):
    """the three colors, named; on a handout the chips are left blank to fill in"""
    return ('<div class="swatches">' + "".join(
        f'<div><i style="background:{"#fff" if fill else hexv}"></i><p>{"______________" if fill else name}'
        f'<span>{"what it is used for" if fill else used}</span></p></div>' for name, hexv, used in PALETTE) + "</div>")

def blobs(n=3, w=92):
    return '<div class="blobs">' + "".join(f"<div>{D.blob(i, w)}</div>" for i in range(n)) + "</div>"

WALL = ('<div class="wall">'
        f'<figure><img src="{POSTER1}" alt=""><figcaption><b>Poster 1</b>A black spider at the corner; a cream clawed hand reaching up</figcaption></figure>'
        f'<figure><img src="{POSTER2}" alt=""><figcaption><b>Poster 2</b>A caped vampire before a Gothic tower; a marigold starburst</figcaption></figure>'
        f'<figure><img class="png" src="{HAND}" alt=""><figcaption><b>The hand</b>A flat cream shape. Your brain does the rest.</figcaption></figure>'
        f'<figure><img src="{VAMPIRE}" alt=""><figcaption><b>The vampire</b>Seen from behind, in a red-lined cloak</figcaption></figure>'
        '</div>')

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "the-shape-of-fear",
  "out": DIR + "FL_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK_C), ("Look and teach", 12, TEACH_C), ("Make", 21, ACT_C), ("Share", 7, CLOSE_C)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the Fear Lab’s two posters as designs. With three colors (a navy ground, cream type and marigold subheads) and a few flat silhouettes (a spider, a clawed hand, a caped vampire seen from behind), they make fear without showing a single monster’s face. Students will connect that to the science on poster 1: the brain *“sees faces and threats where none exist”* and its imagination *“creates horrors worse than reality.”* Then they will design a three-color image whose monster the viewer has to finish."]}),
    ("section", {"label": "Skills and themes", "list": [
      "**Elements of art** — shape, value and color; positive and negative space",
      "**Design** — a limited palette; silhouette; emphasis by what is left out",
      "**Art and science** — pareidolia; why a half-seen shape grips the eye"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed; the posters online if you have a screen",
      "Dark, light and bright colors for each student (paper, paint or markers); black paper and scissors if you have them",
      "A flashlight, if you have one; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "The face we never see",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": VAMPIRE}, "alt": VAMPIRE_ALT, "caption": HOOK_Q, "fit": "contain",
                 "purpose": "Notice that the most frightening part of the picture is the part that isn’t there.",
                 "students": [HOOK_Q, "Why might the artist have hidden it?"]},
      "body": [f"Show poster 2’s vampire, seen from behind. Ask: *“{HOOK_Q}”* Let students describe it in detail. Then point out: *nobody here has seen it.* Every face they described came from their own imagination. Ask: *“Why might the artist have hidden it?”*"]}),
    ("section", {"label": "Look and teach · 12 minutes", "title": "Three colors, flat shapes, and a gap",
      "screen": [
        {"phase": "Look and teach", "minutes": 4, "script": [0], "title": "A limited palette", "show": "image", "img": {"img": POSTER1}, "alt": POSTER1_ALT, "fit": "contain",
         "caption": "Navy ground, cream type, marigold subheads",
         "purpose": "See how much mood three colors can make.",
         "students": ["Name the three colors.", "Which color does your eye go to first? Why?"]},
        {"phase": "Look and teach", "minutes": 4, "script": [1], "title": "A flat shape", "show": "image", "img": {"img": HAND}, "alt": HAND_ALT, "fit": "contain",
         "caption": SHADOW,
         "purpose": "See that a silhouette works because the brain fills it in.",
         "students": ["What does your brain say this is?", "What detail is missing? Do you miss it?"]},
        {"phase": "Look and teach", "minutes": 4, "script": [2], "title": "Leave it out", "show": "words", "text": MYSTERY_BOX,
         "cite": "Poster 1 · Anticipation Makes Everything Scarier",
         "purpose": "Turn the science into a design rule: show less, and let the viewer imagine more.",
         "students": ["What would you leave out of your design?"]}],
      "body": [
        "**A limited palette.** Show poster 1. Both posters use the same three colors: a navy ground, cream type and marigold subheads, with black for the spider. Ask what each color does: the navy is night, the cream glows like moonlight, the marigold pulls the eye to the headings.",
        f"**A flat shape.** Show the clawed hand: one cream shape, no shading, no detail. Poster 1 explains why it works: *“{PATTERN.split('. ')[0]}.”* *“{SHADOW}”* A silhouette gives the brain just enough to finish the rest.",
        f"**Leave it out.** Read: *“{MYSTERY_BOX}”* That is a design rule as much as a scientific one. Poster 2 adds horror’s golden rule: *the real terror isn’t the creature, it’s what it represents.*"]}),
    ("section", {"label": "Make · 21 minutes",
      "screen": {"phase": "Make", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design with a limited palette and a silhouette, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three end in a three-color design built on a silhouette."]},
      "body": ["Students choose a handout. All three look closely at the posters, then make a three-color design built on a silhouette."]}),
    ("levels", {
      "green": "Name the posters’ three colors, turn a blob into a silhouette creature with nothing but eyes, then make a three-color picture of something half-seen in the dark.",
      "yellow": "Take apart poster 2’s vampire as a design, sketch three thumbnails of an everyday thing made frightening by its silhouette, then make the best one in three colors.",
      "red": "Compare the two posters’ choices, design a shape that is two things at once, then make a three-color poster for a fear of their own generation and write an artist’s statement."}),
    ("section", {"label": "Share · 7 minutes",
      "screen": [
        {"phase": "Share", "minutes": 3, "script": [0], "title": "What did your brain fill in?", "show": "question", "question": LAST_Q,
         "purpose": "Test each design on a viewer: what did they imagine?",
         "students": ["Say what you see first.", "Then say what isn’t on the page at all."]},
        {"phase": "Share", "minutes": 4, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK, "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": objectives_screen(OBJECTIVES)[0], "deeper": objectives_screen(OBJECTIVES)[1]}],
      "body": [f"Lay the designs out as a gallery. Each student stands at a classmate’s work and answers: *“{LAST_Q}”* The artist listens and doesn’t explain.",
               "Then ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down. Exit ticket: *“Name one thing you left out on purpose, and why.”*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Made with three colors",
      "body": ["Project or print this page for *Look and teach*. Every picture is from the Fear Lab’s posters."]}),
    ("html", WALL),
    ("html", swatches()),
    quote(PATTERN.split(". ")[0] + ". " + SHADOW, "Poster 1 · Pareidolia: Seeing Monsters Everywhere"),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "What shapes did the designer use to make you feel scared? Is any of them actually a monster?",
      "Cover the marigold with your hand. What changes?",
      "Why show the vampire from behind?",
      "The poster says the real terror isn’t the creature, it’s what it represents. What might a spider or a hand stand for?"]}),
    # after the page to show the class, so the plan keeps to three pages
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**Keep it the right kind of scary.** A half-seen coat on a chair works as well as a monster. Let students choose how frightening their design is.",
        "**What the exhibition says.** It describes the posters’ pictures and palette but doesn’t name their illustrators; don’t guess one."]}),
       ("connection", ["**Visit the exhibition:** both posters, then the walkthroughs online, which set the spider dropping and the hand rising beside the text."])],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**The palette:** navy for the ground, cream for the type and the hand, marigold for the subheads and the starburst.",
        "**Silhouette:** a flat shape gives the brain just enough to fill in the rest: pareidolia.",
        "**Left out:** the vampire’s face; the creature behind the hand; the monster in the box.",
        "**Assess:** three colors only; one silhouette; one thing deliberately left for the viewer."]})]]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Fear Lab’s posters make fear with very little: **three colors**, a few **flat silhouettes**, and a lot left out. Poster 1 says your brain *“sees faces and threats where none exist”* and your imagination *“creates horrors worse than reality.”* Designers use that."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT, "css": CSS + QUOTE_CSS + css,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks, "hero": HERO}

FINAL_RULES = "<p><b>Rules:</b> one dark color for the ground, one light color for the shape, one bright color used once. No shading. Leave something out.</p>"

GREEN = handout("green", "FL_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "The posters’ three colors",
            "blocks": [("html", "<p>Look at the posters. Color each chip and name the color. Then say what the posters use it for.</p>" + swatches(fill=True))]}),
  ("task", {"label": "Part 2", "title": "A silhouette creature",
            "blocks": [("html", "<p>Fill one shape in solid with a dark color. Add only two eyes. Does it look alive?</p>" + blobs(w=112))]}),
  ("task", {"label": "Part 3", "title": "Half-seen in the dark",
            "blocks": [("html", "<p>Draw something in a dark room that your brain might turn into a monster: a coat on a chair, a plant, a pile of toys. Use three colors.</p>" + FINAL_RULES),
                       ("draw", "My three-color picture")]}),
  ("task", {"label": "Part 4", "title": "Why it works",
            "body": ["My picture is scary because the viewer can’t see…"], "lines": 3}),
  ("family", ["Turn off the lights and shine a flashlight on something ordinary. Ask your family: *what does the shadow look like?*"]),
], ".task:nth-of-type(3) { break-inside: avoid; } .drawbox { height: 300pt; } .swatches i { height: 52pt; }")

YELLOW = handout("yellow", "FL_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Take the vampire apart",
            "blocks": [("html", "<p>Look at poster 2’s vampire, seen from behind. For each choice, say what it does to you, the viewer.</p>"),
                       ("table", {"head": ["The artist’s choice", "What it does to the viewer"], "rows": [
                         ["Seen from behind: no face", ""], ["A dark shape against a bright moon", ""],
                         ["A few strong colors", ""], ["A Gothic tower behind him", ""]]})]}),
  ("task", {"label": "Part 2", "title": "Three thumbnails",
            "blocks": [("html", "<p>Pick an everyday thing. Draw it three ways as a solid silhouette, lit from behind, until it looks like something else.</p>"
                                '<div class="thumbs"><div class="drawbox"><span>1</span></div><div class="drawbox"><span>2</span></div><div class="drawbox"><span>3</span></div></div>')]}),
  ("task", {"label": "Part 3", "title": "Make the best one",
            "blocks": [("html", FINAL_RULES), ("draw", "My three-color design")]}),
  ("task", {"label": "Part 4", "title": "What did you leave out?",
            "body": ["Name one thing you left out on purpose. What do you hope the viewer’s brain will put there?"], "lines": 3}),
  ("family", ["Find a book cover or film poster at home that uses a silhouette. Show your family what it leaves out."]),
], "table.fill td { height: 30pt; } table.fill td:first-child { width: 42%; } .task:nth-of-type(3) .drawbox { height: 262pt; }")

RED = handout("red", "FL_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Two posters, one style",
            "blocks": [("table", {"head": ["", "Poster 1", "Poster 2"], "rows": [
                         ["Its main image", "", ""], ["How it uses the three colors", ""
                          , ""], ["What it leaves out", "", ""], ["Where your eye goes first", "", ""]]})]}),
  ("task", {"label": "Part 2", "title": "Two things at once",
            "blocks": [quote(PATTERN.split(". ")[0] + ".", "Poster 1"),
                       ("html", "<p>Design one silhouette that reads as an ordinary object <i>and</i> as a face or creature, depending on how you look.</p>"),
                       ("draw", "Ordinary object, and something else")]}),
  ("task", {"label": "Part 3", "title": "A poster for your generation",
            "blocks": [quote(GOLDEN_RULE, "Poster 2"),
                       ("html", "<p>Choose a fear your generation faces. Design a three-color poster whose monster stands for it, and never fully show the monster. Sketch it here; make it full size if you have time.</p>"),
                       ("draw", "Poster sketch")]}),
  ("task", {"label": "Part 4", "title": "Artist’s statement",
            "body": ["Explain your palette, your silhouette and what you left out, and what each choice should make the viewer feel."], "lines": 4}),
  ("family", ["Show your family your poster without explaining it. Ask what they think the monster stands for."]),
], "table.fill td { height: 30pt; } table.fill td:first-child { width: 30%; } .task:nth-of-type(2) .drawbox { height: 100pt; } .task:nth-of-type(3) .drawbox { height: 220pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
