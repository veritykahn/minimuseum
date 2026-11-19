"""PreK–Kindergarten · "Quiet at Eleven"
The end of the Great War at 11:00 on November 11, 1918, told for the
youngest: loud, then quiet; church bells; red poppies; and a quiet time to
remember. No battlefield detail: "the soldiers who did not come home" is
as far as it goes. Facts follow poster 2 in app/exhibitions/great-war/
greatWar.ts and the Memorial (memorial/memorialText.ts)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/prek-k/"
TITLE = "Quiet at Eleven"
SUB = "PreK–Kindergarten · Poppies, a clock and a quiet time"
HERO = {"img": SILHOUETTE, "pos": "center 62%"}

# Said in the plan and shown on the classroom screen, so written once.
STORY = ("Long ago, more than a hundred years ago, there was a very big war. It was loud, and it went on for a long, long time. "
         "Then one morning, on the eleventh day of the eleventh month, at **11 o’clock**, it stopped. Everything went quiet. "
         "Church bells rang. Some soldiers shook hands. Some cried. The war was over.")
POPPY_STORY = ("Red poppies grew in the fields where the soldiers had been. So now, every November, people wear a red poppy. "
               "It says: *we remember.* We remember the soldiers who did not come home, and we say thank you to everyone who served.")
QUIET = ("Every year, on November 11 at 11 o’clock, many people stop what they are doing and are quiet for two minutes, to remember. "
         "In America we call it Veterans Day.")
CLOSE_LINE = "That’s why we remember them."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("count to eleven, and find 11 on a clock",
     "count to eleven, and find 11 on the clock?", False),
    ("say that people wear a red poppy to remember the soldiers",
     "say why people wear a red poppy?", False),
    ("keep still and quiet for a short time, to remember, as people do at 11 o’clock",
     "keep a quiet time to remember?", False)],
  "why": "Long ago a very big war ended at 11 o’clock. Every year since, people have stopped and kept quiet at that time, to remember.",
  "screen": {"heading": "I can…", "items": [
    "count to eleven and find 11 on the clock",
    "say why we wear a red poppy",
    "keep a quiet time to remember"]}}

CSS = """
.clocks { display: flex; justify-content: center; gap: 28pt; margin: 4pt 0 8pt; break-inside: avoid; }
.clocks figure { margin: 0; text-align: center; }
.bigpoppy { display: flex; justify-content: center; margin: 0 0 4pt; }
.prow { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 2pt; margin: 4pt 0 10pt; break-inside: avoid; }
.prow figure { margin: 0; text-align: center; }
.prow figcaption { font: 500 15pt/1 'Outfit'; margin-top: 2pt; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 40pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
.modelclock { display: grid; grid-template-columns: auto auto; justify-content: center; align-items: center; gap: 34pt; margin: 4pt 0 8pt; }
.modelclock p { font: 500 8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; text-align: center; margin: 4pt 0 0; }
"""

def clocks(hours, size=118):
    return ('<div class="clocks">' + "".join(f'<figure>{clock_svg(h, size)}</figure>' for h in hours) + '</div>')

def prow(n, numbered=True, size=46, start=1, cols=None):
    cells = "".join(f'<figure>{poppy_svg(size, stem=False)}' + (f'<figcaption>{i}</figcaption>' if numbered else "") + '</figure>'
                    for i in range(start, start + n))
    return f'<div class="prow" style="--n:{cols or n}">{cells}</div>'

BIGPOPPY = f'<div class="bigpoppy">{poppy_svg(170)}</div>'

def trace(text, model=False, rows=2):
    first = f'<div><span class="{"model" if model else ""}">{text}</span></div>'
    rest = (f'<div><span>{text}</span></div>' if not model else "<div></div>") * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'

# ── on the classroom screen (Lesson mode; build.py ignores "screen") ─────
POPPY_PIC = {"img": POPPIES}
SILHOUETTE_PIC = {"img": SILHOUETTE, "pos": "right center"}

LESSON = {
  "slug": "quiet-at-eleven", "large": True,
  "out": DIR + "GW_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": CSS + OBJ_CSS + "body { line-height: 1.45; }",
  "blocks": [
    ("timing", [("Circle time", 4, C_HOOK), ("The story", 6, C_TEACH), ("Look closely", 3, C_LOOK),
                ("Activity", 9, C_ACT), ("Close", 3, C_CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "A clock, or the clock on the *Show your class* page (page 3)",
      "A bell, or something that rings",
      "The *Show your class* page, projected or printed",
      "Red crayons, and the differentiated handouts",
      "A paper poppy for each child (optional)"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will hear that, long ago, a very big war ended at 11 o’clock in the morning, and that everything went quiet. They will learn that people wear a red poppy to remember the soldiers, and that every year many people keep a quiet time at 11 o’clock. They will count to eleven, find 11 on a clock, and keep a short quiet time of their own."]}),
               ("section", {"label": "Themes", "list": [
      "**History** — long ago and today; a day we remember: November 11, Veterans Day",
      "**Early learning** — counting to eleven; finding 11 on a clock; loud and quiet; listening",
      "**Social and emotional** — being still together; saying thank you",
      "**Art** — color: the red of the poppy"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "Loud, then quiet",
      "screen": {"phase": "Circle time", "show": "question", "question": "Loud… then quiet!",
                 "purpose": "Feel how sudden a silence is, before hearing the story of one.",
                 "students": ["Clap and stamp, as loud as you can!", "When the clock goes up, stop. Shh."]},
      "body": ["Sit in a circle. *“Let’s be loud! Clap and stamp, as loud as you can.”* After a few seconds, hold up the clock and stop, very still. Wait for the room to go quiet. Ask: *“How did that feel, when the noise stopped all at once?”* Then: *“A long time ago, something very loud stopped all at once, just like that. Let me tell you about it.”*"]}),
    ("section", {"label": "The story · 6 minutes", "title": "The day it went quiet",
      "screen": [
        {"phase": "The story", "minutes": 3, "script": [0], "title": "The day it went quiet", "show": "words",
         "text": "11 o’clock\nNovember 11\nIt went quiet.",
         "purpose": "Hear the story: a very big war, and the morning it stopped.",
         "students": ["Listen to the story.", "What time did it stop? Show me 11 on your fingers."]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "Church bells rang", "show": "listen",
         "clips": [CLIP_BELLS], "question": "Listen. What do you hear?",
         "purpose": "Hear the bells that rang when the war was over.",
         "students": ["Listen to the bells.", "Were people happy, or sad, or both?"]}],
      "body": [
        STORY + " Hold up the clock: *“Look, here is 11. Let’s count to 11 together on our fingers.”*",
        "Ring the bell, or play the bells from the exhibition. *“The bells rang because the war was over. People were happy it had stopped. They were sad, too, because some soldiers did not come home.”*"]}),
    ("section", {"label": "Look closely · 3 minutes", "title": "A red poppy",
      "screen": {"phase": "Look closely", "show": "image", "img": POPPY_PIC, "alt": ALT_POPPIES,
                 "caption": "Red poppies, from the When the Guns Fell Silent poster",
                 "purpose": "See the flower people wear to remember.",
                 "students": ["What color are the flowers?", "Count the flowers with me.", "Why do people wear a poppy?"]},
      "body": [POPPY_STORY + " Show the poppies on page 3. *“What color are they? Let’s count them together.”*"]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Count, find 11 and color a poppy, at the right level for each child.",
                 "students": ["Find 11 o’clock on your page.", "Make your poppy red."]},
      "body": ["Each child works on a handout. All three have the clock, the number 11 and a red poppy."]}),
    ("levels", {
      "green": "Picture-led. Color a big poppy red, circle the clock that says 11 o’clock, color eleven numbered poppies, trace *11*.",
      "yellow": "A little more. Circle the 11 o’clock clock, count out eleven poppies from a row of twelve, copy *11* under a model, draw a poppy field.",
      "red": "Draw and tell. Draw the hands at 11 o’clock, color a poppy and tell a grown-up why we wear one, draw someone to thank, finish *Thank you…*"}),
    ("section", {"label": "Look back and quiet time · 3 minutes",
      "screen": [
        {"phase": "Close", "minutes": 1, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS, "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Our quiet time", "show": "words",
         "text": CLOSE_LINE, "cite": "The Doughboys poster",
         "purpose": "Keep a short quiet time together, as people do at 11 o’clock.",
         "students": ["Hold your poppy.", "Sit very still and quiet.", "Count to eleven in your head."]}],
      "body": ["Put the questions on the screen. For each one, children show a thumb up, sideways or down: *“Can you now "
               + " Can you now ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               QUIET + " *“Let’s have our own quiet time. Hold your poppy and sit very still. I will count to eleven, slowly, on my fingers.”* Count silently, finger by finger. Then, softly: *“" + CLOSE_LINE + "”*"]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Keeping it gentle",
      "body": [
        "**What to say, and what to leave out.** Young children need only three things: a very big war ended at 11 o’clock, people wear a red poppy to remember, and we keep a quiet time. *The soldiers who did not come home* is enough; how they died is not for this age.",
        "**Why a poppy?** The exhibition’s poster explains that poppies were often the only living things that could grow in the churned ground of the battlefields. Wearing one in November says *we will never forget.*",
        "**Veterans Day.** In America, November 11 was first called Armistice Day. In 1954 it became Veterans Day, to honor all American veterans. Some children will have a veteran in the family; let them say so."]})],
     [("section", {"label": "Assessment notes", "list": [
      "Can the child count to eleven, and point to 11 on a clock?",
      "Can the child say, in their own words, why people wear a red poppy?",
      "Can the child keep still and quiet for the count of eleven?"]}),
      ("connection", ["**Visit the exhibition:** look for the red poppies climbing the edge of the *When the Guns Fell Silent* poster, and the date and time in red: **11.11.1918, 11:00**.",
                      "**Virtual visit:** in *The Memorial*, place one poppy in the field together. Each poppy there is placed by a visitor to the Mini Museum."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Poppies, and 11 o’clock",
      "body": ["Project or print this page for the story and the poppy. Point to the clock as you tell the story; let children count the poppies."]}),
    ("html", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16pt;align-items:center;margin:4pt 0 10pt;break-inside:avoid">'
             f'<div style="text-align:center">{fig(POPPIES, 220, 260)}</div>'
             f'<div style="text-align:center">{clock_svg(11, 200)}<p class="label" style="margin-top:8pt">11 o’clock</p>'
             '<p style="font:500 30pt/1 \'Outfit\';color:#CC3027;margin:8pt 0 0">11.11.1918</p></div></div>'),
    ("html", '<div style="display:grid;grid-template-columns:230pt 1fr;gap:16pt;align-items:center;margin:4pt 0 10pt;break-inside:avoid">'
             + fig(SILHOUETTE, 230, 130, fit="cover", border=True) +
             '<div><p class="label">The When the Guns Fell Silent poster</p><h3>A soldier stands still</h3>'
             '<p>On the poster, a soldier stands quietly on a hill. Red poppies grow beside him. Ask: <i>“Is he loud, or quiet? What do you think he is doing?”</i></p></div></div>'),
    ("section", {"label": "Questions to ask the children", "list": [
      "What time did the war stop? Can you find 11 on the clock?",
      "What did people hear when the war was over?",
      "What color is the poppy? Why do people wear one?",
      "Who would you like to say thank you to?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** Long ago there was a very big war. On November 11, at 11 o’clock, it stopped, and everything went quiet. Church bells rang. Now, every year, people wear a red poppy and keep a quiet time, to remember."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "GW_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Color the poppy red.", "blocks": [("html", BIGPOPPY)]}),
  ("task", {"label": "Part 2", "title": "Which clock says 11 o’clock? Circle it.", "blocks": [("html", clocks([3, 11, 6]))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Count to 11. Color a poppy for each number.",
            "blocks": [("html", prow(6, size=62) + prow(5, size=62, start=7, cols=6))]}),
  ("task", {"label": "Part 4", "title": "Trace the number.", "blocks": [("html", trace("11", rows=2))]}),
  ("task", {"label": "Part 5", "title": "Draw a poppy of your own.", "blocks": [("draw", "My poppy")]}),
  ("family", ["On November 11, look at a clock together at 11 o’clock. Keep a quiet minute, and tell your child: *this is when people remember.*"]),
])

YELLOW = handout("yellow", "GW_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Which clock says 11 o’clock? Circle it.", "blocks": [("html", clocks([11, 2, 8]))]}),
  ("task", {"label": "Part 2", "title": "Count 11 poppies. Color them red. Leave one white.", "blocks": [("html", prow(12, numbered=False, size=44))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Copy the number.", "blocks": [("html", trace("11", model=True, rows=3))]}),
  ("task", {"label": "Part 4", "title": "Draw a field of red poppies.", "blocks": [("draw", "My poppy field")]}),
  ("family", ["Ask your child why people wear a red poppy in November. Count to eleven together, and find 11 on a clock at home."]),
], "body.young .drawbox { height: 300pt; }")

RED = handout("red", "GW_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Draw the hands so the clock says 11 o’clock.",
            "blocks": [("html", f'<div class="modelclock"><div>{clock_svg(None, 170)}<p>Your clock</p></div>'
                                f'<div>{clock_svg(11, 90)}<p>Look here</p></div></div>')]}),
  ("task", {"label": "Part 2", "title": "Color the poppy. Then tell a grown-up: why do people wear one?",
            "blocks": [("html", f'<div class="bigpoppy">{poppy_svg(120)}</div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw someone you would like to say thank you to.", "blocks": [("draw", "Thank you")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">Thank you</span></div><div></div><div></div></div>')]}),
  ("family", ["Talk together about someone in your family or neighborhood who has served. On Veterans Day, November 11, how could you say thank you?"]),
], "body.young .drawbox { height: 290pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
