"""PreK–Kindergarten · "Footprints on the Moon"
Apollo 11, the twelve astronauts who walked on the Moon, and why their
footprints are still there: the Moon has no wind or rain. Facts follow
poster 1 in app/exhibitions/moon/moon.ts (the Apollo 11 panels, the
regolith paragraph and the footprints tidbit)."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (MOONRISE, EAGLE, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, LOOK_BACK,
                          quote, review)

DIR = "teachers/prek-k/"
TITLE = "Footprints on the Moon"
SUB = "PreK–Kindergarten · Apollo 11 and the Moon’s dust"
HERO = {"img": MOONRISE, "pos": "center 30%"}

# Said in the plan and shown on the classroom screen, so written once.
STEP = "That’s one small step for [a] man, one giant leap for mankind."
STEP_CITE = "Neil Armstrong · July 20, 1969"
STAY = "The Moon has no wind or rain, so the astronauts’ footprints will probably last for millions of years."
HOOK_Q = "Who made this footprint? How could we make it go away?"
TRY_Q = "Blow like the wind. Sprinkle like the rain. What happens to the footprint?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say that astronauts flew to the Moon and walked on it",
     "say who walked on the Moon?", False),
    ("say why footprints stay on the Moon: it has no wind and no rain to wipe them away",
     "say why footprints stay on the Moon?", False),
    ("use a describing word for Moon dust: sharp, sticky or smelly",
     "tell what Moon dust is like?", False)],
  "why": "The Moon is a real place, and people have walked there. Footprints show how different it is from home.",
  "screen": {"heading": "I can…", "items": [
    "say who walked on the Moon",
    "say why footprints stay on the Moon",
    "tell what Moon dust is like"]}}

# ── drawings built for small hands ────────────────────────────────────
def boot(w=34, fill="none"):
    """a boot print, drawn: a sole with ridges across it"""
    return (f'<svg class="boot" viewBox="0 0 40 92" width="{w}pt" height="{w * 92 / 40:.0f}pt" aria-hidden="true">'
            '<defs><clipPath id="sole"><path d="M20 2C33 2 38 14 37 30C36 44 31 51 31 60C31 73 30 90 20 90C10 90 9 73 9 60C9 51 4 44 3 30C2 14 7 2 20 2Z"/></clipPath></defs>'
            f'<path d="M20 2C33 2 38 14 37 30C36 44 31 51 31 60C31 73 30 90 20 90C10 90 9 73 9 60C9 51 4 44 3 30C2 14 7 2 20 2Z" fill="{fill}" stroke="#1d1c1a" stroke-width="2.2"/>'
            '<g clip-path="url(#sole)" stroke="#1d1c1a" stroke-width="2.6">'
            + "".join(f'<line x1="0" y1="{y}" x2="40" y2="{y}"/>' for y in (12, 19, 26, 33, 40, 66, 73, 80))
            + "</g></svg>")

WIND = ('<svg viewBox="0 0 80 60" width="70pt" height="52pt" aria-hidden="true"><g fill="none" stroke="#1d1c1a" stroke-width="3" stroke-linecap="round">'
        '<path d="M6 18H50C58 18 62 12 58 7C55 3 49 5 49 10"/><path d="M6 32H66C74 32 78 38 74 43C71 47 65 45 65 40"/>'
        '<path d="M14 46H44C51 46 54 51 51 55C48 58 43 56 43 52"/></g></svg>')
RAIN = ('<svg viewBox="0 0 80 70" width="70pt" height="60pt" aria-hidden="true"><g fill="none" stroke="#1d1c1a" stroke-width="3" stroke-linecap="round">'
        '<path d="M18 38C8 38 6 26 15 23C15 12 30 8 35 17C40 6 60 9 59 22C70 22 72 38 60 38Z"/>'
        '<path d="M22 47L18 57M38 47L34 57M54 47L50 57M30 59L27 66M46 59L43 66"/></g></svg>')

CSS = BASE_CSS + """
.row { display: flex; justify-content: center; align-items: flex-end; gap: 34pt; margin: 4pt 0 8pt; }
.walk { display: flex; justify-content: center; gap: 22pt; margin: 4pt 0 8pt; }
.walk svg:nth-child(odd) { margin-top: 26pt; }
.nums { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.nums span { width: 54pt; height: 54pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 34pt/1 'Cormorant Garamond', serif; }
.wx { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14pt; margin: 6pt 0 10pt; break-inside: avoid; }
.wx > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); height: 100pt;
  display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; padding: 8pt; }
.wx p { margin: 0; font: 500 13pt 'Outfit'; }
.wx img { width: 62pt; height: 62pt; object-fit: cover; border-radius: 50%; }
.moonbox { position: relative; height: 240pt; margin: 6pt 0 8pt; border: .8pt dashed #a9a69b; border-radius: 6pt; overflow: hidden; break-inside: avoid; }
.moonbox img { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 62%; object-fit: cover; object-position: center 20%; opacity: .55; }
.moonbox span { position: absolute; left: 8pt; top: 6pt; font: 400 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #7c796f; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 24pt/1 'Outfit'; letter-spacing: .02em; bottom: -3pt; }
.match2 { display: grid; grid-template-columns: 1fr 70pt 1fr; align-items: center; row-gap: 14pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match2 .l, .match2 .r { display: flex; align-items: center; gap: 10pt; font: 500 13pt 'Outfit'; }
.match2 .l { justify-content: flex-end; }
.match2 .dot { width: 12pt; height: 12pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.words3 { display: flex; justify-content: center; gap: 16pt; margin: 6pt 0 10pt; flex-wrap: wrap; }
.words3 span { border: 1.2pt solid #1d1c1a; border-radius: 99pt; padding: 5pt 16pt; font: 500 14pt 'Outfit'; background: rgba(255,255,255,.6); }
"""

NUMS = '<div class="nums"><span>1</span><span>2</span><span>3</span></div>'
TWO_PRINTS = '<div class="row">' + boot(38) + boot(38) + '</div>'
THREE_PRINTS = '<div class="row">' + boot(36) + boot(36) + boot(36) + '</div>'
WEATHER = ('<div class="wx"><div>' + WIND + '<p>Wind</p></div><div>' + RAIN + '<p>Rain</p></div>'
           '<div><img src="' + MOONRISE + '" alt=""><p>The Moon</p></div></div>')
def trace(model=False, rows=2):
    first = f'<div><span class="{"model" if model else ""}">MOON</span></div>'
    rest = "<div><span>MOON</span></div>" * (rows - 1) if not model else "<div></div>" * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'
def moonbox(label):
    return f'<div class="moonbox"><img src="{MOONRISE}" alt=""><span>{label}</span></div>'

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "footprints-on-the-moon", "large": True,
  "out": DIR + "MOON_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO,
  "css": CSS + OBJ_CSS + FLOW_CSS + "body { line-height: 1.44; }",
  "blocks": [
    ("timing", [("Circle time", 4, "#7D8471"), ("The story", 6, "#2F4A5A"), ("Try it", 5, "#4A7346"),
                ("Activity", 7, "#86671A"), ("Close", 3, "#A8452F")]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "A shallow tray of flour or fine sand, smoothed flat, and a shoe or boot to press into it",
      "A small spray bottle of water, or a cup to sprinkle from",
      "The *Show your class* page (page 3), projected or printed",
      "Crayons and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will hear that, in 1969, astronauts flew to the Moon and walked on it, and that twelve astronauts have walked there in all. They will see for themselves that wind and rain wipe a footprint away, and learn that the Moon has no wind or rain, so the astronauts’ footprints are still there. They will use describing words for Moon dust: sharp, sticky, and smelling like gunpowder."]}),
               ("section", {"label": "Themes", "list": [
      "**Science** — Earth and the Moon are different places; wind and rain change the ground on Earth",
      "**Early learning** — counting to three; *same* and *different*; describing words; fine motor skills (tracing, coloring, drawing)",
      "**Listening and speaking** — hearing a real recording from 1969; retelling a true story in order",
      "**Wonder** — the Moon in our own night sky is a place people have stood"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "A mystery in the tray",
      "screen": {"phase": "Circle time", "show": "question", "question": HOOK_Q,
                 "purpose": "Wonder about a footprint before hearing whose footprints are on the Moon.",
                 "students": ["Look at the footprint in the tray.", "Who made it?"]},
      "body": ["Before the children arrive, press a shoe firmly into the tray so it leaves a clear print. Sit in a circle around it. Ask: *“" + HOOK_Q + "”* Let them guess and point to the ridges of the sole. Then: *“Today we will hear about footprints in a very faraway place. They have been there for a long, long time.”*"]}),
    ("section", {"label": "The story · 6 minutes", "title": "The Eagle has landed",
      "screen": [
        {"phase": "The story", "minutes": 3, "script": [0], "title": "Our Moon", "show": "image",
         "img": {"img": MOONRISE, "pos": "center 30%"}, "caption": "Our Incredible Moon",
         "alt": "A huge lavender Moon rising, with gray patches and round craters on its face",
         "purpose": "Look at the Moon, and hear that people have been there.",
         "students": ["What can you see on the Moon?", "Have people ever been there?"]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "The Eagle has landed", "show": "listen",
         "clips": [EAGLE], "question": "This was really said on the Moon. What do you hear?",
         "purpose": "Hear a real recording from the day astronauts first landed on the Moon.",
         "students": ["Listen closely.", "How many astronauts went? How many walked on the Moon?"]}],
      "body": [
        "Show the Moon on the screen or page 3. *“This is our Moon, the one we see at night. A long time ago, in 1969, three astronauts flew all the way there in a rocket.”* Two of them, **Neil Armstrong** and **Buzz Aldrin**, landed their little spacecraft, called the *Eagle*, and walked on the Moon. The third, **Michael Collins**, flew round and round the Moon, waiting for them.",
        "Play the recording: these are the real words sent back to Earth when the *Eagle* landed. Count together: *three* astronauts went, *two* walked on the Moon. Since then, **twelve** astronauts have walked on the Moon. The Moon’s dust was very fine, sharp and sticky: it stuck to everything, and the astronauts said it smelled like gunpowder."]}),
    ("section", {"label": "Try it · 5 minutes", "title": "Wind, rain, and no wind or rain",
      "screen": [
        {"phase": "Try it", "minutes": 3, "script": [0], "title": "Try it", "show": "question", "question": TRY_Q,
         "purpose": "See for themselves what wind and rain do to a footprint on Earth.",
         "students": ["Blow gently on the footprint.", "Sprinkle a little rain."]},
        {"phase": "Try it", "minutes": 2, "script": [1], "title": "Still there", "show": "words", "text": STAY,
         "cite": "Our Incredible Moon",
         "purpose": "Learn why the astronauts’ footprints are still on the Moon.",
         "students": ["Does the Moon have wind?", "Does the Moon have rain?"]}],
      "body": [
        "Let two or three children blow gently across the tray, like the wind. Let another sprinkle a little water, like the rain. *“What is happening to our footprint?”* The edges soften and blur. On Earth, wind and rain wipe footprints away.",
        "*“But the Moon has no wind. The Moon has no rain.”* Read the words on the screen: " + STAY + " *“So the astronauts’ footprints are still there today.”*"]}),
    ("section", {"label": "Activity · 7 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Count, match and draw on paper, at the right level for each child.",
                 "students": ["Why do footprints stay on the Moon? Find it on your page."]},
      "body": ["Each child works on a handout. All three show the same footprints, the same wind and rain, and the same Moon."]}),
    ("levels", {
      "green": "Picture-led. Count the footprints and circle the number, color the wind and the rain, trace *MOON*, then draw a footprint on the Moon.",
      "yellow": "A little writing. Count the footprints, draw lines to show where a footprint stays and where it is wiped away, copy *MOON* under a model, then draw an astronaut’s footprints.",
      "red": "Draw and tell. Match Earth and the Moon to what happens to a footprint, circle the words for Moon dust and tell a grown-up why, then finish the sentence *On the Moon, my footprint would…*"}),
    ("section", {"label": "Look back and step · 3 minutes",
      "screen": [
        review(OBJECTIVES, 1, [0], hint=THUMBS, purpose="Check what each child can now do against the objectives."),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "One small step", "show": "words", "text": STEP, "cite": STEP_CITE,
         "purpose": "Close with Neil Armstrong’s words, and a step and a leap of their own.",
         "students": ["Take one small step.", "Now take one giant leap!"]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you now ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               f"Stand up together. Tell the children what Neil Armstrong said when he stepped onto the Moon: *“{STEP}”* Everyone takes one small step on the spot, then one giant leap."]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Telling it at this age",
      "body": [
        "**Real, and long ago.** The youngest children often mix the Moon with stories. Keep saying *“this really happened.”* The recording helps: these are the real voices of 1969.",
        "**Why the footprints stay.** The exhibition says the footprints will probably last for millions of years, unless a meteorite happens to strike them. *Millions* only needs to mean *a very, very long time.*",
        "**The dust.** Moon dust is not like the sand in a sandbox. It was made by space rocks hitting the Moon, so its grains are sharp and jagged, and it sticks to everything. It was hard to clean off the astronauts’ suits."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child say that astronauts walked on the Moon?",
      "Can the child say that the Moon has no wind or rain, so footprints stay?",
      "Can the child use one describing word for Moon dust?"]}),
     ("connection", ["**Visit the exhibition:** on the poster *Our Incredible Moon,* find the big Moon and the panel *“The Eagle has landed.”* Listen for the recording as the panel arrives.",
                     "**Virtual visit:** in *Under the Microscope,* wipe a slide and put real Moon dust on it. Watch how it clings to the cloth."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Footprints on the Moon",
                 "body": ["Project or print this page for circle time and the story."]}),
    ("html", f'<img src="{MOONRISE}" alt="" style="width:100%;height:150pt;object-fit:cover;object-position:center 30%;border-radius:6pt;display:block;margin:2pt 0 10pt">'),
    ("cards", [
      ("Three went, two walked", ["In 1969, on Apollo 11, Neil Armstrong and Buzz Aldrin landed in the Sea of Tranquility. Michael Collins circled the Moon, waiting for them."]),
      ("Twelve astronauts", ["Between 1969 and 1972, six Apollo missions landed on the Moon. Twelve astronauts walked there in all."]),
      ("No wind, no rain", ["The Moon has no wind or rain, so the astronauts’ footprints will probably last for millions of years."]),
      ("Sharp, sticky dust", ["Moon dust is sharp and jagged and sticks to everything. Astronauts said it smelled like gunpowder."])]),
    quote(STEP, STEP_CITE),
    ("section", {"label": "Questions to ask the children", "list": [
      "Who walked on the Moon? How many astronauts went, and how many walked?",
      "What happened to our footprint when the wind blew and the rain fell?",
      "Why are the astronauts’ footprints still on the Moon?",
      "If you walked on the Moon, what would you want to see?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** In 1969, astronauts flew to the Moon. Neil Armstrong and Buzz Aldrin walked on it. The Moon has no wind and no rain, so their footprints are still there today."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "MOON_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the footprints. Circle the number.",
            "blocks": [("html", TWO_PRINTS + NUMS)]}),
  ("task", {"label": "Part 2", "title": "Wind and rain wipe footprints away. Color the wind and the rain.",
            "blocks": [("html", WEATHER)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Trace the word.",
            "blocks": [("html", trace(rows=2))]}),
  ("task", {"label": "Part 4", "title": "The Moon has no wind or rain. Draw a footprint on the Moon.",
            "blocks": [("html", moonbox("My footprint"))]}),
  ("family", ["Make a footprint together in sand, soil or flour. Blow on it, then sprinkle it with water. Ask: *why are the astronauts’ footprints still on the Moon?*"]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "How many footprints? Circle the number.",
            "blocks": [("html", THREE_PRINTS + NUMS)]}),
  ("task", {"label": "Part 2", "title": "Where does a footprint stay? Draw a line.",
            "blocks": [("html", '<div class="match2">'
              '<div class="l">' + RAIN + '<span>Earth</span><span class="dot"></span></div><div></div>'
              '<div class="r"><span class="dot"></span>' + boot(26) + '<span>It is wiped away.</span></div>'
              '<div class="l"><img src="' + MOONRISE + '" alt="" style="width:60pt;height:60pt;object-fit:cover;border-radius:50%"><span>The Moon</span><span class="dot"></span></div><div></div>'
              '<div class="r"><span class="dot"></span>' + boot(26, "#1d1c1a") + '<span>It stays.</span></div></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Copy the word.",
            "blocks": [("html", trace(model=True, rows=2))]}),
  ("task", {"label": "Part 4", "title": "Draw an astronaut walking on the Moon. Draw their footprints too.",
            "blocks": [("html", moonbox("My astronaut"))]}),
  ("family", ["Look at the Moon together tonight, if you can see it. Tell your family: *two astronauts walked there in 1969, and their footprints are still there.*"]),
])

RED = handout("red", "MOON_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Where does a footprint stay? Draw a line, then tell a grown-up why.",
            "blocks": [("html", '<div class="match2">'
              '<div class="l">' + WIND + '<span>Earth</span><span class="dot"></span></div><div></div>'
              '<div class="r"><span class="dot"></span>' + boot(26, "#1d1c1a") + '<span>It stays.</span></div>'
              '<div class="l"><img src="' + MOONRISE + '" alt="" style="width:60pt;height:60pt;object-fit:cover;border-radius:50%"><span>The Moon</span><span class="dot"></span></div><div></div>'
              '<div class="r"><span class="dot"></span>' + boot(26) + '<span>It is wiped away.</span></div></div>')]}),
  ("task", {"label": "Part 2", "title": "Moon dust was hard to clean off the astronauts’ suits. Circle the words for Moon dust.",
            "blocks": [("html", '<div class="words3"><span>sharp</span><span>soft</span><span>sticky</span><span>wet</span><span>smelly</span></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw your own footprint on the Moon, with Moon dust sticking to your boot.",
            "blocks": [("html", moonbox("My footprint"))]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">On the Moon, my footprint would</span></div><div></div><div></div></div>')]}),
  ("family", ["Ask your child: *what would you see if you stood on the Moon?* Together, make a footprint in flour or sand, and talk about why it would last on the Moon but not in the garden."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
