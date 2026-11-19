"""PreK–Kindergarten · "What’s in the Box?"
The Fear Boxes, told gently: a covered box, the lab's harmless surprises and
poster 1's pinecone. Children name how not knowing feels, notice their
heartbeat and practice one small brave step. Nothing frightening: no
spiders, no creatures, and the online Fear Boxes are left for older classes.
Facts follow app/exhibitions/fear-lab/fearLab.ts (poster 1, the case) and
what-scares-you/surprises.ts."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

DIR = "teachers/prek-k/"
TITLE = "What’s in the Box?"
SUB = "PreK–Kindergarten · The Fear Boxes · Naming feelings and being brave"

# the room's own picture: five old boxes on a shelf, above a pulse line
HERO = {"img": pub(ROOM), "pos": "center 100%"}
SCREEN_HERO = {"img": ROOM, "pos": "center 80%"}

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Something is in this box. What could it be?"
JUST = "It’s really\njust a pinecone."
FEEL_Q = "How did you feel before we opened the box?"
BRAVE = "Slow breath.\nHold a hand.\nHave a look."
BRAVE_SAY = "Brave doesn’t mean never feeling scared. Brave means feeling a little scared, and taking one small step anyway."
CLOSE_Q = "Let’s take one slow, brave breath together."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("name a feeling we can have when we don’t know what’s coming: curious, excited, nervous or scared",
     "name a feeling?", False),
    ("notice that a heart can beat fast before we even know what is in the box",
     "say what your heart does when you don’t know?", False),
    ("show one small brave step: a slow breath, holding a hand, or having a look",
     "show a brave step?", False)],
  "why": "Feeling nervous about what we can’t see is something every brain does. Naming the feeling, and taking one small step, helps it shrink.",
  "screen": {"heading": "I can…", "items": [
    "name my feeling",
    "feel my heart beat fast",
    "take a brave step"]}}

# the harmless sounds from the lab's fear boxes, to guess from
CLIPS = [clip("bubbles", "Sound 1", "Soap bubbles pop", "bojan_t95"),
         clip("boing", "Sound 2", "Boing 2", "magnuswaker"),
         clip("feather", "Sound 3", "cartoon_wink_magic_sparkle", "MLaudio")]

FACES = [("curious", "Curious"), ("happy", "Excited"), ("worried", "Nervous"), ("scared", "Scared")]

CSS = """
.boxes { display: flex; justify-content: center; align-items: flex-end; gap: 16pt; margin: 4pt 0 8pt; }
.boxes img { height: 70pt; width: auto; object-fit: contain; filter: drop-shadow(0 3pt 4pt rgba(0,0,0,.3)); }
.nums { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.nums span { width: 54pt; height: 54pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 34pt/1 'Cormorant Garamond', serif; }
.faces { display: grid; grid-template-columns: repeat(var(--n, 3), 1fr); gap: 10pt; margin: 4pt 0 8pt; text-align: center; break-inside: avoid; }
.faces figure { margin: 0; } .faces figcaption { font: 500 11pt 'Outfit'; margin-top: 3pt; }
.faces svg { background: rgba(255,255,255,.6); border-radius: 50%; }
.match { display: grid; grid-template-columns: 110pt 1fr 110pt; align-items: center; gap: 8pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match img { width: 110pt; height: 96pt; object-fit: contain; filter: drop-shadow(0 3pt 4pt rgba(0,0,0,.3)); }
.match .end { display: grid; place-items: center; }
.match .path { position: relative; height: 16pt; }
.match .path::before, .match .path::after { content: ""; position: absolute; top: 50%; width: 14pt; height: 14pt; margin-top: -7pt; border-radius: 50%; background: #1d1c1a; }
.match .path::before { left: 0; } .match .path::after { right: 0; }
.match .path.dotted i { position: absolute; left: 14pt; right: 14pt; top: 50%; border-top: 3pt dotted #7c796f; }
.things { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 6pt 0 10pt; text-align: center; break-inside: avoid; }
.things > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); height: 128pt;
  display: grid; grid-template-rows: 1fr auto; place-items: center; padding: 8pt; }
.things p { margin: 0; font: 500 11pt 'Outfit'; }
.bigheart { display: flex; justify-content: center; margin: 4pt 0 8pt; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .26em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 34pt/1 'Outfit'; letter-spacing: .02em; bottom: -3pt; }
"""

# the objectives block and the plan's own pictures; the handouts print unchanged
PLAN_CSS = OBJ_CSS + """
body { line-height: 1.44; }
.showrow { display: flex; justify-content: space-around; align-items: flex-end; background: #0E1A2C; border-radius: 6pt; padding: 12pt 10pt 10pt; margin: 4pt 0 10pt; }
.showrow img { height: 82pt; width: auto; filter: drop-shadow(0 4pt 6pt rgba(0,0,0,.5)); }
.feelrow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8pt; text-align: center; margin: 4pt 0 10pt; break-inside: avoid; }
.feelrow figure { margin: 0; } .feelrow figcaption { font: 500 10pt 'Outfit'; margin-top: 2pt; }
"""

def boxes(keys, h=None):
    st = f' style="--h:{h}pt"' if h else ""
    return '<div class="boxes"' + st + ">" + "".join(f'<img src="{pub(BOXES[k])}" alt="">' for k in keys) + "</div>"

def nums(*ns):
    return '<div class="nums">' + "".join(f"<span>{n}</span>" for n in ns) + "</div>"

def faces(kinds, w=78):
    return (f'<div class="faces" style="--n:{len(kinds)}">' + "".join(
        f"<figure>{D.face(k, w)}<figcaption>{name}</figcaption></figure>" for k, name in kinds) + "</div>")

def match(dotted):
    path = '<div class="path dotted"><i></i></div>' if dotted else '<div class="path"></div>'
    return (f'<div class="match"><img src="{pub(BOXES["hatbox"])}" alt="">{path}'
            f'<div class="end">{D.pinecone(84)}</div></div>')

THINGS = ('<div class="things">'
          f'<div>{D.pinecone(64)}<p>A pinecone</p></div>'
          f'<div>{D.feather(34)}<p>A feather</p></div>'
          f'<div>{D.bubbles(84)}<p>Bubbles</p></div></div>')

def trace(word, model=False, rows=1):
    first = f'<div><span class="{"model" if model else ""}">{word}</span></div>'
    rest = (f"<div><span>{word}</span></div>" if not model else "<div></div>") * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "whats-in-the-box", "large": True,
  "out": DIR + "FL_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + PLAN_CSS + QUOTE_CSS,
  "blocks": [
    ("timing", [("Circle time", 4, HOOK_C), ("Listen", 5, TEACH_C), ("Feelings", 5, ACT2_C),
                ("Activity", 8, ACT_C), ("Close", 3, CLOSE_C)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "A box with a lid, or a box under a cloth, with **a pinecone** inside (or another soft, harmless thing)",
      "The *Show your class* page (page 3), projected or printed",
      "A way to play three short sounds from the lab (the classroom screen plays them)",
      "Crayons, including red, and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will wonder what is inside a closed box, guess from sounds, and then find out that it was something harmless all along: *just a pinecone*, as the Fear Lab puts it. They will name how not knowing made them feel, notice that a heart can beat fast before anything happens, and practice a small brave step."]}),
               ("section", {"label": "Themes", "list": [
      "**Feelings** — naming curious, excited, nervous and scared; every feeling is allowed",
      "**The body** — a heart that beats fast; a slow breath that helps it settle",
      "**Science** — listening, guessing, then looking to find out",
      "**Early learning** — counting to five; matching; tracing a word; speaking in a circle"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "Something is in the box",
      "screen": {"phase": "Circle time", "show": "image", "title": "What’s in the box?",
                 "img": {"img": BOXES["hatbox"]}, "alt": "An old striped hatbox with a rope handle, its lid shut",
                 "caption": HOOK_Q, "fit": "contain",
                 "purpose": "Wonder first: a closed box, and no one knows yet what is inside.",
                 "students": ["Look at the box. Don’t touch yet!", "What could be inside? How do you feel?"]},
      "body": [f"Sit in a circle with the covered box in the middle. Lift it and set it down gently. *“{HOOK_Q}”* Take guesses. Then ask: *“How do you feel, not knowing?”* Accept every answer: curious, excited, a bit worried. Say that no one will have to touch anything today. Do not open the box yet."]}),
    ("section", {"label": "Listen and guess · 5 minutes", "title": "What made that sound?",
      "screen": [
        {"phase": "Listen", "minutes": 3, "script": [0], "title": "What made that sound?", "show": "listen", "clips": CLIPS,
         "question": "What could pop out of a box?",
         "purpose": "Guess from a clue, the way the brain fills in what it cannot see.",
         "students": ["Listen with your eyes closed.", "What do you think made each sound?"]},
        {"phase": "Listen", "minutes": 2, "script": [1], "title": "Just a pinecone", "show": "words", "text": JUST,
         "cite": "The Fear Lab",
         "purpose": "Find out: the thing we could not see was harmless.",
         "students": ["What was in our box?", "Was it scary after all?"]}],
      "body": [
        "In the Fear Lab, things pop out of the boxes. Play the three sounds one at a time and let the children guess each. Then tell them: *bubbles, a jack-in-the-box, and a feather drifting down.* All silly, and nothing scary at all.",
        "Now open your box slowly, and lift out the pinecone. Say what the Fear Lab says: our brains sometimes imagine scary things in the dark, *“when it’s really just a pinecone.”* Pass the pinecone round for anyone who wants to hold it."]}),
    ("section", {"label": "Feelings · 5 minutes", "title": "My heart goes fast",
      "screen": [
        {"phase": "Feelings", "minutes": 3, "script": [0], "title": "My heart goes fast", "show": "question", "question": FEEL_Q,
         "purpose": "Name the feeling, and notice the heartbeat that came with it.",
         "students": ["Hand on your heart. Is it fast or slow?", "Show me a curious face. A nervous face. A happy face."]},
        {"phase": "Feelings", "minutes": 2, "script": [1], "title": "Brave steps", "show": "words", "text": BRAVE,
         "purpose": "Give every child a small brave step to use when they feel nervous.",
         "students": ["Smell the flower. Blow out the candle.", "Do it three times, slowly."]}],
      "body": [
        f"Ask: *“{FEEL_Q}”* The Fear Lab says that when you put your hand in a box you can’t see into, *your heart races before you even touch anything.* Hands on chests. Show the feeling faces on page 3; let children point to theirs. Every feeling is allowed.",
        f"Then: *“{BRAVE_SAY}”* Practice the slowest step together: smell the flower (breathe in through the nose), blow out the candle (breathe out through the mouth), three times."]}),
    ("section", {"label": "Activity · 8 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Count, match and name feelings on paper, at the right level for each child.",
                 "students": ["What was in the box? Find it on your page."]},
      "body": ["Each child works on a handout. All three show the same boxes and the same pinecone, and ask how the box made them feel."]}),
    ("levels", {
      "green": "Picture-led. Count the boxes and circle the number, follow the dots from the box to the pinecone, circle the face that shows their feeling, color the heart, trace *BRAVE*.",
      "yellow": "A little writing. Count the boxes, draw a line from the box to the pinecone, circle a feeling, find the pinecone among harmless things, copy *BRAVE*, then draw a silly surprise.",
      "red": "Draw and tell. Circle a feeling and tell a grown-up why, draw what they hope is in a box, draw themselves being brave, then finish the sentence *I can be brave by…*"}),
    ("section", {"label": "Look back and a brave breath · 3 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]]},
        {"phase": "Close", "minutes": 1, "script": [1], "title": "A brave breath", "show": "question", "question": CLOSE_Q,
         "purpose": "End calm, with the brave step every child can use.",
         "students": ["Smell the flower.", "Blow out the candle."]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               f"Close together: *“{CLOSE_Q}”* Smell the flower, blow out the candle."]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Why the closed box feels scary",
      "body": [
        "**Not knowing is the scary part.** Poster 1 says the brain’s #1 fear isn’t spiders or snakes, but the unknown, and that imagination fills it with the worst possible thing. A pinecone in the dark can feel like a monster; in the light it is a pinecone.",
        "**It isn’t a flaw.** The poster says this is *by design*: a brain that would rather raise a fake alarm than miss a real danger is looking after us.",
        "**Keep it gentle.** No child has to touch the box. The lab’s online Fear Boxes can show spiders and real animals, even in its Gentle mode, so preview them first; for this age, a box in your own classroom does the job."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child name a feeling, with words or by pointing to a face?",
      "Can the child say or show that a heart can beat fast before we know what is coming?",
      "Can the child show a brave step: a slow breath, holding a hand or having a look?"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "What could be inside?", "body": ["Project or print this page for circle time, or take it to the display case. These are four of the old boxes in the Fear Lab’s room, *What Scares You?*"]}),
    ("html", '<div class="showrow">' + "".join(f'<img src="{pub(BOXES[k])}" alt="">' for k in ("crate", "hatbox", "chest", "tin")) + "</div>"),
    quote(BOX, P1),
    ("section", {"label": "How do you feel?"}),
    ("html", '<div class="feelrow">' + "".join(f"<figure>{D.face(k, 70)}<figcaption>{n}</figcaption></figure>" for k, n in FACES) + "</div>"),
    ("section", {"label": "Questions to ask the children", "list": [
      "What could be in the box? What else?",
      "How does it feel not to know?",
      "Put your hand on your heart. Is it fast or slow?",
      "What can you do when you feel nervous?"]}),
    ("connection", ["**Visit the exhibition:** the display case holds two tactile **Mystery Fear Boxes**, whose contents change every week. Let children choose: look, listen, or reach in.",
                    "**Online:** the room *What Scares You?* shows five old boxes waiting to be picked. Look at them together and guess, without opening."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["**A grown-up reads this aloud.** In the Fear Lab there are boxes you can’t see into. Not knowing what’s inside can make your heart beat fast. But when we look, it’s just a pinecone! Being brave means feeling a little scared, and taking a small step anyway."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + QUOTE_CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "FL_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the boxes. Circle the number.",
            "blocks": [("html", boxes(["crate", "hatbox", "tin"]) + nums(1, 2, 3))]}),
  ("task", {"label": "Part 2", "title": "Follow the dots from the box to the pinecone.",
            "blocks": [("html", match(True))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "How do you feel about a closed box? Circle a face.",
            "blocks": [("html", faces([("curious", "Curious"), ("happy", "Excited"), ("worried", "Nervous")], 82))]}),
  ("task", {"label": "Part 4", "title": "My heart beats fast! Color the heart red.",
            "blocks": [("html", f'<div class="bigheart">{D.heart(120)}</div>')]}),
  ("task", {"label": "Part 5", "title": "Trace the word.",
            "blocks": [("html", trace("BRAVE", rows=2))]}),
  ("family", ["Put a small, soft thing in a bag. Let your child feel or guess what it is. Ask: *how did it feel not to know? What helped?*"]),
])

YELLOW = handout("yellow", "FL_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the boxes. Circle the number.",
            "blocks": [("html", boxes(["crate", "hatbox", "chest", "tin"]) + nums(3, 4, 5))]}),
  ("task", {"label": "Part 2", "title": "Draw a line from the box to the pinecone.",
            "blocks": [("html", match(False))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Our box held a pinecone. Circle it.",
            "blocks": [("html", THINGS)]}),
  ("task", {"label": "Part 4", "title": "Copy the word.",
            "blocks": [("html", trace("BRAVE", model=True, rows=2))]}),
  ("task", {"label": "Part 5", "title": "Draw something silly that could pop out of a box.",
            "blocks": [("draw", "My silly surprise")]}),
  ("family", ["Play *what’s in the box?* at home with a towel over a toy. Take turns guessing, and talk about how it feels to wait before you look."]),
], "body.young .drawbox { height: 150pt; }")

RED = handout("red", "FL_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "How do you feel about a box you can’t see into? Circle a face. Tell a grown-up why.",
            "blocks": [("html", faces([("curious", "Curious"), ("happy", "Excited"), ("worried", "Nervous"), ("scared", "Scared")], 74))]}),
  ("task", {"label": "Part 2", "title": "Draw what you hope is inside the box.",
            "blocks": [("draw", "In the box")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw yourself being brave.",
            "blocks": [("draw", "Me, being brave")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">I can be brave by</span></div><div></div><div></div></div>')]}),
  ("family", ["Ask your child: *what makes you feel brave?* Share a time you felt nervous before something new, and the small step that helped you."]),
], "body.young .drawbox { height: 172pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
