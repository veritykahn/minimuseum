"""PreK–Kindergarten · "Light Up the Parlor"
Dickens' Christmas Parlour, cold and then warm: what a Victorian Christmas
brought into the room, and A Christmas Carol's message of kindness. Facts
follow poster 2 (app/exhibitions/victorian/victorian.ts) and the parlor's
own words (christmas-parlour/parlourText.ts)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/prek-k/"
TITLE = "Light Up the Parlor"
SUB = "PreK–Kindergarten · Dickens’ Christmas Parlour"

HERO = {"img": pic(PARLOUR_WARM), "pos": "center 55%"}
SCREEN_HERO = screen_pic(PARLOUR_WARM, "center 55%")
ASPECT = 2400 / 1340

# the parts of the parlor, as the room opens them (parlourText.ts)
PARTS = [
  ("The clock", "The clock on the mantelpiece ticks."),
  ("The Christmas tree", "The candles on the tree are lit."),
  ("The Christmas cards", "Christmas cards stand along the mantelpiece."),
  ("*A Christmas Carol*", "The book lies open on the table."),
  ("The window", "The curtains are drawn back on the village in the snow."),
  ("The fire", "The fire is blazing in the grate."),
]

# Said in the plan and shown on the classroom screen, so written once.
LOOK_Q = "Look at this room. Is it warm or cold? Light or dark?"
KIND_LINE = "A story about being kind,\nsharing, and being together"
SHARE = "A Christmas Carol is a story about kindness. Hold up your hands to a warm fire. Tell a partner one kind thing you could do for someone today."

OBJECTIVES = objectives([
    ("name three things in a Victorian Christmas parlor: the tree, the fire and the clock",
     "name three things in the parlor?", False),
    ("tell how the parlor changed from cold and dark to warm and bright",
     "tell how the room changed?", False),
    ("name one kind thing you could do for someone",
     "name a kind thing you could do?", False)],
  "Long ago, a story about kindness helped make Christmas a time to open our hearts to other people. Kindness is something every child can give.",
  ["name three things in the parlor", "tell how the room changed", "name a kind thing I could do"])

COLD_WARM = [
  {"img": PARLOUR_COLD, "label": "Cold and dark", "fit": "cover", "pos": "center 55%",
   "alt": "A dark, cold parlor at night: an empty grate, a Christmas tree with unlit candles by a snowy window"},
  {"img": PARLOUR_WARM, "label": "Warm and bright", "fit": "cover", "pos": "center 55%",
   "alt": "The same parlor glowing: a fire blazing in the grate and the candles lit on the Christmas tree"}]

PLAN_CSS = """
body { line-height: 1.44; }
.showpic { margin: 4pt 0 10pt; } .showpic .crop { border-radius: 6pt; border: 1pt solid #1d1c1a; }
.cards { grid-template-columns: repeat(3, 1fr); gap: 7pt; } .card { padding: 6pt 9pt 2pt; } .card p { font-size: 8.8pt; }
"""

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "light-up-the-parlor", "large": True,
  "out": DIR + "VIC_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Circle time", 4, HOOK), ("Look closely", 5, EXTRA), ("The story", 6, TEACH),
                ("Activity", 7, WORK), ("Close", 3, CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed",
      "A battery tea light or flashlight, to ‘light’ the room",
      "Crayons, including yellow and orange, and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will look closely at a Victorian parlor on Christmas Eve, first cold and dark, then warm and bright, and name what is in it. They will hear that long ago Christmas was hardly celebrated, and that a story by Charles Dickens, *A Christmas Carol*, helped make it a time for kindness, sharing and being together."]}),
               ("section", {"label": "Themes", "list": [
      "**History** — long ago and now; how people in Victorian Britain celebrated Christmas",
      "**Character** — kindness, sharing and community, the message of *A Christmas Carol*",
      "**Early learning** — looking closely and naming; same and different; counting; fine motor skills (circling, coloring, tracing)"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "A cold, dark room",
      "screen": {"phase": "Circle time", "show": "image", "img": screen_pic(PARLOUR_COLD, "center 55%"),
                 "alt": COLD_WARM[0]["alt"], "fit": "cover",
                 "purpose": "Wonder at a room before anything is explained.",
                 "students": [LOOK_Q, "What can you see in it?"]},
      "body": ["Dim the lights. Show the cold parlor. Say: *“This is a room in a house long ago, on the night before Christmas. "
               + LOOK_Q + "”* Let children name what they see: a chair, a window with snow, a little tree, a fireplace with no fire. *“It looks lonely. What would make it feel warm?”*"]}),
    ("section", {"label": "Look closely · 5 minutes", "title": "Warm and bright",
      "screen": {"phase": "Look closely", "show": "pair", "items": COLD_WARM,
                 "purpose": "See what a Victorian Christmas brought into the room by comparing the two pictures.",
                 "students": ["What changed? Point to it.", "Find the fire. Find the tree. Find the clock."]},
      "body": ["Switch on the tea light and show the warm parlor beside the cold one. *“What changed?”* The fire is blazing in the grate; the candles on the Christmas tree are lit; the whole room glows. Play *I spy*: children point to the fire, the tree with its candles, the clock on the mantelpiece, the snowy window and the holly over the fireplace. Count the things you find together."]}),
    ("section", {"label": "The story · 6 minutes", "title": "Christmas long ago",
      "screen": [
        {"phase": "The story", "minutes": 3, "script": [0], "title": "Long ago", "show": "image",
         "img": screen_pic(VILLAGE), "alt": "A painting of a snowy Victorian village street at dusk: snow-covered houses with lit windows, a church spire, two tall Christmas trees, and people walking in the snow",
         "caption": "The snowy village from the exhibition’s second poster",
         "purpose": "Hear that Christmas was once hardly celebrated, and how trees and cards arrived.",
         "students": ["Listen to the story.", "Can you see the Christmas trees?"]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "A story about kindness", "show": "words",
         "text": KIND_LINE, "cite": "*A Christmas Carol*, by Charles Dickens, 1843",
         "purpose": "Meet the message at the heart of the parlor: kindness, sharing and being together.",
         "students": ["How does it feel when someone is kind to you?"]}],
      "body": [
        "Show the snowy village. Tell it simply: long ago, in Victorian Britain, Christmas was hardly celebrated. Many people worked such long hours that there was little time to celebrate. Then Queen Victoria and her husband, Prince Albert, helped make the Christmas tree popular, and people began to send Christmas cards.",
        "A writer named Charles Dickens wrote a story called *A Christmas Carol*. In it, a man called Scrooge changes, and learns to be kind. People loved the story, and it helped make Christmas a time to open our hearts to others: *a story about being kind, sharing, and being together.*"]}),
    ("section", {"label": "Activity · 7 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Find, light and share on paper, at the right level for each child.",
                 "students": ["Which room is warm and bright? Find it on your page."]},
      "body": ["Each child works on a handout. All three show the cold room and the warm room, and ask which is warm and bright."]}),
    ("levels", {
      "green": "Picture-led. Circle the warm room, find the fire, the tree and the clock, draw a flame on each candle, trace *KIND*.",
      "yellow": "A little more. Circle the warm room, circle what changed, light and count the candles, copy *KIND* under a model.",
      "red": "Draw and tell. Tell a grown-up three things that changed, draw a kind thing to do, design a card front, finish *I can be kind by…*"}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        {"phase": "Close", "minutes": 1, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS, "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Share a kindness", "show": "question", "question": SHARE,
         "purpose": "Close with the story’s message: name something kind to do today.",
         "students": ["Hold up your hands to a warm fire.", "Tell a partner one kind thing you could do today."]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               f"Then say: *“{SHARE}”*"]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Why the parlor glows",
      "body": [
        "**Hardly celebrated.** The exhibition’s second poster says that at the start of the 1800s, Christmas was hardly celebrated: many businesses did not treat it as a holiday, and presents were given at New Year. By the end of the century it had become the biggest celebration of the year in Britain.",
        "**The story.** Dickens’ *A Christmas Carol* (1843) emphasized kindness, charity and community through Scrooge’s transformation. *Dickens may not have invented Christmas but he certainly reinvented it.*",
        "**Every family.** Not every family celebrates Christmas. This lesson is about how people in Victorian Britain celebrated it, and about kindness, which belongs to everyone. Invite children to tell about the celebrations their own families keep."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child point to and name three things in the parlor?",
      "Can the child say what changed, in their own words: the fire, the candles, the light?",
      "Can the child name one kind thing they could do for someone?"]}),
     ("connection", ["**Visit the exhibition:** in *Dickens’ Christmas Parlour*, children open each part of a Victorian Christmas — the clock, the tree, the cards, the book, the window and the fire — and watch the cold room come to life.",
                     "**Make a card:** in the *Christmas Card Maker*, choose a robin, a wreath or a snowy church for the front."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The parlor on Christmas Eve",
                 "body": ["Project or print this page for circle time. In the exhibition, each part of the parlor opens with its own line."]}),
    ("html", '<div class="showpic">' + crop(PARLOUR_WARM, 0.1, 0.0, 0.9, 1.0, ASPECT) + "</div>"),
    ("cards", [(n, [l]) for n, l in PARTS]),
    ("section", {"label": "Questions for circle time", "list": [
      "What do you see in the room? Let’s name everything we can find.",
      "Is the room warm or cold? How can you tell?",
      "What do people do to make a room feel welcoming?",
      "*A Christmas Carol* is a story about kindness. What kind thing could you do today?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["**A grown-up reads this aloud.** Long ago, in Victorian Britain, Christmas was hardly celebrated. Then families brought in Christmas trees, sent cards, and read a story by Charles Dickens about being kind. Here is a Victorian parlor on the night before Christmas."]

YOUNG_CSS = """
.duo img { height: 100pt; }
.finds { display: grid; grid-template-columns: repeat(3, 104pt); justify-content: center; gap: 30pt; margin: 4pt 0 6pt; }
.finds figure { margin: 0; text-align: center; }
.finds .crop { border-radius: 6pt; border: 1pt solid #1d1c1a; }
.finds figcaption { font: 500 12pt 'Outfit'; margin-top: 4pt; }
.big { width: 200pt; margin: 4pt auto 6pt; } .big .crop { border-radius: 6pt; border: 1pt solid #1d1c1a; }
.tree { display: flex; justify-content: center; align-items: center; gap: 30pt; margin: 2pt 0 4pt; }
.tree svg { width: 230pt; height: auto; }
.tree .num { width: 64pt; height: 64pt; border: 1.6pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); }
"""

handout = handout_maker(DIR, TITLE, "PreK–Kindergarten", "PreK–Kindergarten", CONTEXT, HERO, YOUNG_CSS, young=True)

DUO = ('<div class="duo"><figure><img src="' + pic(PARLOUR_COLD) + '" alt=""><figcaption>Room 1</figcaption></figure>'
       '<figure><img src="' + pic(PARLOUR_WARM) + '" alt=""><figcaption>Room 2</figcaption></figure></div>')
FINDS = ('<div class="finds">'
         + "".join(f"<figure>{crop(PARLOUR_WARM, *r, ASPECT)}<figcaption>{n}</figcaption></figure>"
                   for n, r in [("the fire", (0.19, 0.58, 0.35, 0.87)), ("the tree", (0.67, 0.30, 0.83, 0.59)),
                                ("the clock", (0.215, 0.235, 0.355, 0.485))])
         + "</div>")
BIG = '<div class="big">' + crop(PARLOUR_WARM, 0.12, 0.0, 0.86, 0.95, ASPECT) + "</div>"


def candle_tree(count=False):
    """A Christmas tree with seven unlit candles, each waiting for a flame."""
    candles = [(100, 52), (82, 92), (118, 92), (66, 134), (100, 128), (134, 134), (100, 172)]
    c = "".join(f'<rect x="{x - 4}" y="{y}" width="8" height="18" rx="1.5" fill="#fff" stroke="#1d1c1a" stroke-width="1.6"/>'
                f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y - 4}" stroke="#1d1c1a" stroke-width="1.4"/>' for x, y in candles)
    svg = ('<svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">'
           '<polygon points="100,18 30,200 170,200" fill="#dfe7d9" stroke="#1d1c1a" stroke-width="2"/>'
           '<polygon points="100,6 104,16 114,16 106,22 109,32 100,26 91,32 94,22 86,16 96,16" fill="#fff" stroke="#1d1c1a" stroke-width="1.6"/>'
           '<rect x="88" y="200" width="24" height="22" fill="#fff" stroke="#1d1c1a" stroke-width="2"/>' + c + "</svg>")
    return f'<div class="tree">{svg}' + ('<div class="num"></div>' if count else "") + "</div>"


def trace(model=False, rows=2):
    first = '<div><span class="model">KIND</span></div>' if model else '<div><span>KIND</span></div>'
    rest = "<div></div>" if model else "<div><span>KIND</span></div>"
    return f'<div class="trace">{first}{rest * (rows - 1)}</div>'


GREEN = handout("green", "VIC_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Which room is warm and bright? Circle it.", "blocks": [("html", DUO)]}),
  ("task", {"label": "Part 2", "title": "Find each one in Room 2. Color the dot when you find it.",
            "blocks": [("html", FINDS.replace("</figcaption>", ' <span style="display:inline-block;width:16pt;height:16pt;border:1.4pt solid #1d1c1a;border-radius:50%;vertical-align:-3pt;margin-left:4pt;background:#fff"></span></figcaption>'))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Light the candles. Draw a flame on every one.", "blocks": [("html", candle_tree())]}),
  ("task", {"label": "Part 4", "title": "Trace the word.", "blocks": [("html", trace())]}),
  ("family", ["Look at the two rooms together. Ask your child: *what makes a room feel warm and welcoming?* Then think of one kind thing your family could do for someone this week."]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Which room is warm and bright? Circle it.", "blocks": [("html", DUO)]}),
  ("task", {"label": "Part 2", "title": "What changed? Circle the fire and the candles.", "blocks": [("html", BIG)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw a flame on every candle. How many? Write the number in the box.",
            "blocks": [("html", candle_tree(count=True))]}),
  ("task", {"label": "Part 4", "title": "Copy the word.", "blocks": [("html", trace(model=True))]}),
  ("family", ["Ask your child to tell you the story of the cold room and the warm room. Then talk together: *what is one kind thing we could do for a neighbor?*"]),
])

RED = handout("red", "VIC_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Look at both rooms. Tell a grown-up three things that changed.", "blocks": [("html", DUO)]}),
  ("task", {"label": "Part 2", "title": "Draw a kind thing you could do for someone.", "blocks": [("draw", "My kind thing")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Long ago, people began to send Christmas cards. Draw the front of a card for someone you care about.",
            "blocks": [("html", '<div class="drawbox" style="height:220pt"><span>My card</span></div>')]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">I can be kind by</span></div><div></div></div>')]}),
  ("family", ["Make a card together for someone who would love to get one — a neighbor, a grandparent, a friend. Ask your child: *how will they feel when it arrives?*"]),
])

RED["css"] += "body.young .drawbox { height: 140pt; }"

DOCS = [LESSON, GREEN, YELLOW, RED]
