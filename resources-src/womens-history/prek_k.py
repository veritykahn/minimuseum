"""PreK–Kindergarten · "Violet’s Big Family"
Home and family life, and the letters and photographs a family keeps, from
poster 2 (Violet Dina Want's biography, womensHistory.ts BIO), its four family
photographs, the display case (the family letters) and the Violet's Life room
(violet/). Nothing of the war: for the youngest, Violet's home, her family,
her garden and her piano carry the visit."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (PHOTOS, POSTER2, SOUNDS, OBJ_CSS, PIC_CSS, THUMBS, TIMING, review, photos)
from _keepsakes import svg, outline, row

DIR = "teachers/prek-k/"
TITLE = "Violet’s Big Family"
SUB = "PreK–Kindergarten · Home, family and the letters we keep"
HERO = {"img": POSTER2, "pos": "center 47%"}

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "This is Violet. She lived a long time ago. What do you notice about her?"
SHARE = "Violet’s family kept her letters and photographs to remember her. Who in your family would you send a letter to? Tell a partner."
CLOSE_SHARE = f"Then say: *“{SHARE}”*"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("count the people in a family photograph, to six",
     "count the people in a family photo?", False),
    ("name two things Violet did at home: helping, growing food, sewing or playing the piano",
     "name something Violet did at home?", False),
    ("say why families keep letters and photographs",
     "say why families keep letters and photos?", False)],
  "why": "Every family has stories worth keeping. Letters and photographs help us remember the people we love.",
  "screen": {"heading": "I can…", "items": [
    "count the people in a photo",
    "tell you something Violet did at home",
    "say why families keep letters and photos"]}}

COUNT = {"img": PHOTOS["family"]["img"], "alt": PHOTOS["family"]["alt"]}

CSS = PIC_CSS + """
.nums { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.nums span { width: 54pt; height: 54pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 34pt/1 'Cormorant Garamond', serif; }
.bigphoto { display: flex; justify-content: center; margin: 4pt 0 8pt; }
.bigphoto img { height: var(--bh, 190pt); width: auto; border: 1pt solid #1d1c1a; border-radius: 4pt; filter: grayscale(.1); }
.match { display: grid; grid-template-columns: 110pt 1fr 120pt; align-items: center; gap: 8pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match img { width: 110pt; height: 140pt; object-fit: cover; object-position: center 25%; border-radius: 6pt; border: 1pt solid #1d1c1a; }
.match .path { position: relative; height: 16pt; }
.match .path::before, .match .path::after { content: ""; position: absolute; top: 50%; width: 14pt; height: 14pt; margin-top: -7pt; border-radius: 50%; background: #1d1c1a; }
.match .path::before { left: 0; } .match .path::after { right: 0; }
.match .path.dotted i { position: absolute; left: 14pt; right: 14pt; top: 50%; border-top: 3pt dotted #7c796f; }
.match svg { justify-self: center; background: #fff; border-radius: 50%; border: 1pt solid #22335e; }
.color { display: flex; justify-content: center; gap: 30pt; margin: 4pt 0 8pt; }
.color figure { margin: 0; text-align: center; }
.color svg { display: block; background: #fff; border-radius: 8pt; border: 1pt solid #1d1c1a; }
.color figcaption { font: 500 12pt 'Outfit'; margin-top: 3pt; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 40pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
body.young .ks svg { width: 64pt; height: 64pt; }
body.young .ks figcaption { font-size: 11pt; }
"""

NUMS = '<div class="nums"><span>4</span><span>5</span><span>6</span></div>'
def bigphoto(key, h=190):
    return f'<div class="bigphoto" style="--bh:{h}pt"><img src="{PHOTOS[key]["img"]}" alt=""></div>'
def match(dotted):
    path = '<div class="path dotted"><i></i></div>' if dotted else '<div class="path"></div>'
    return (f'<div class="match"><img src="{PHOTOS["violet"]["img"]}" alt="">{path}{svg("piano", 92)}</div>')
def color(keys, size=150):
    return '<div class="color">' + "".join(f'<figure>{outline(k, size)}</figure>' for k in keys) + '</div>'
def trace(first, rows=2):
    return '<div class="trace">' + first + "<div></div>" * (rows - 1) + '</div>'
DEAR = '<div><span>DEAR</span></div>'
DEAR_MODEL = '<div><span class="model">DEAR</span></div>'

# ── lesson plan ────────────────────────────────────────────────────────

STORY_1 = ("Tell the story simply. *“Violet was born in 1907, more than a hundred years ago, in London, a big city in England. "
           "She had three sisters and two brothers. That is a big family! Violet helped look after her little sisters after school. "
           "Her father taught her to grow vegetables in the garden, because a garden gave the family food to eat.”*")
STORY_2 = ("*“When Violet grew up, she married Harold. She said she chose him because he made her laugh. They had children of their own, "
           "and Violet was very good at sewing: she could take a grown-up’s coat apart and make it small enough for a child, so her children were always warm. "
           "Violet always had a piano. She played it by ear, without any music written down, and her family and friends came to sing and dance at lively parties. "
           "And when she had a garden of her own, she grew flowers. Her favorite flowers were roses.”*")
STORY_3 = ("*“Every March is Women’s History Month. We remember women who did great things, and women like Violet, too. "
           "Violet’s family wrote her story down, and they kept her old letters and photographs. Now they are in the Mini Museum, so we can remember her.”*")

LESSON = {
  "slug": "violets-big-family", "large": True,
  "out": DIR + "WH_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": CSS + OBJ_CSS + "body { line-height: 1.44; }",
  "screen_hero": {"img": PHOTOS["violet"]["img"], "pos": "center 25%"},
  "blocks": [
    ("timing", [("Circle time", 4, TIMING["hook"]), ("The story", 6, TIMING["teach"]), ("Look closely", 3, TIMING["look"]),
                ("Activity", 9, TIMING["activity"]), ("Close", 3, TIMING["close"])]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "A letter or a card in an envelope, and a family photograph of your own if you like",
      "The *Show your class* page (page 3), projected or printed",
      "Crayons, including red or orange for the rose",
      "The differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will meet Violet Dina Want, a real woman born in London in 1907, through her family’s photographs and the story her family wrote down. They will hear how she helped at home, grew food, sewed, played the piano and loved roses; count the people in a family photograph; and learn that families keep letters and photographs to remember the people they love."]}),
               ("section", {"label": "Themes", "list": [
      "**Social studies** — families long ago and now; how people helped at home",
      "**Women’s History Month** — every March we remember women, the famous and the everyday",
      "**Early math** — counting to six; one-to-one correspondence",
      "**Early literacy** — what a letter is; tracing *DEAR*; listening and retelling",
      "**Art and fine motor** — coloring, tracing, drawing a line"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "A letter, and a photograph",
      "screen": {"phase": "Circle time", "show": "image", "img": {"img": PHOTOS["violet"]["img"], "pos": "center 25%"},
                 "alt": PHOTOS["violet"]["alt"], "caption": "Violet as a young woman",
                 "purpose": "Look before any story: wonder who she was.",
                 "students": ["What do you notice about her?", "Look at her hat and her gloves."]},
      "body": ["Hold up the envelope and take out the letter. *“Has anyone ever had a letter, or a card? Families keep letters and photographs for a long, long time.”* "
               f"Then show the photograph of Violet, and wait before you say anything about her. *“{HOOK_Q}”* Take answers: her hat, her gloves, her long coat."]}),
    ("section", {"label": "The story · 6 minutes", "title": "Violet’s home",
      "screen": [
        {"phase": "The story", "minutes": 2, "script": [0], "title": "A big family", "show": "gallery",
         "groups": [{"label": "Violet’s family", "text": "Three sisters and two brothers", "items": [
           {"img": PHOTOS["violet"]["img"], "caption": "Violet", "sub": "Born in London, 1907", "alt": PHOTOS["violet"]["alt"], "aspect": 0.79},
           {"img": PHOTOS["promenade"]["img"], "caption": "Out for a walk", "sub": "Family photograph", "alt": PHOTOS["promenade"]["alt"], "aspect": 0.81}]}],
         "purpose": "Meet Violet: a big family in a big city, and a little girl who helped.",
         "students": ["How did Violet help at home?"]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "Music, sewing and roses", "show": "listen",
         "clips": [SOUNDS["knees-up"], SOUNDS["sewing-machine"]],
         "question": "Violet’s piano, and her sewing machine. Can you play the piano in the air?",
         "purpose": "Hear what Violet’s home sounded like: the piano at a party, the sewing machine.",
         "students": ["Listen. What can you hear?", "Play the piano in the air, like Violet."]},
        {"phase": "The story", "minutes": 1, "script": [2], "title": "Letters to keep", "show": "words",
         "text": "Violet’s family wrote her story down.\nThey kept her letters and photographs.",
         "purpose": "Say why the letters and photographs are in the museum.",
         "students": ["Why did her family keep them?"]}],
      "body": [STORY_1, STORY_2, STORY_3]}),
    ("section", {"label": "Look closely · 3 minutes", "title": "Count the family",
      "screen": {"phase": "Look closely", "show": "image", "img": {"img": COUNT["img"]}, "alt": COUNT["alt"],
                 "caption": "A family group outside a house", "fit": "contain",
                 "purpose": "Count the people in a real family photograph from long ago.",
                 "students": ["Count the people. Touch each one in the air.", "Can you find the baby?"]},
      "body": ["Show the family photograph on page 3. Count the people together, pointing to each one: five women and a baby, **six** in all. Let children find the baby in the white dress. *“This photograph is very old. Violet’s family kept it safe for a long time.”*"]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Count, trace and draw, at the right level for each child.",
                 "students": ["Count the family. Then make something for a letter."]},
      "body": ["Each child works on a handout. All three count the same family photograph and end with something for a letter of their own."]}),
    ("levels", {
      "green": "Picture-led. Count the people and circle the number, color Violet’s rose, follow the dots from Violet to her piano, trace *DEAR*.",
      "yellow": "A little writing. Count and circle, draw a line from Violet to her piano, copy *DEAR* under a model, then draw a picture for a letter.",
      "red": "Draw and tell. Count, find the baby, choose one of Violet’s things and tell why, then draw a letter to someone they love and start it *Dear…*"}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        {**review(OBJECTIVES, 2, [0], hint=THUMBS, purpose="Check what each child can now do against the objectives.")},
        {"phase": "Close", "minutes": 1, "script": [CLOSE_SHARE], "title": "Who would you write to?", "show": "question", "question": SHARE,
         "purpose": "Close with the children’s own families: who would they write to?",
         "students": ["Tell a partner: who would you send a letter to?"]}],
      "body": ["Put the three questions on the screen. For each, children show a thumb up, sideways or down. " + CLOSE_SHARE]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Telling Violet’s story at this age",
      "body": [
        "**Keep it at home.** Poster 2 also tells of hard times, including the war. None of that belongs in this lesson: if you show the poster, read it first and tell only the parts above.",
        "**Every family is different.** Talk about *the people who look after you* and *someone you love*, so every child has someone to draw."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child count the six people in the photograph, touching each one?",
      "Can the child name one thing Violet did at home: helping, growing food, sewing, playing the piano?",
      "Can the child say why a family keeps letters and photographs?"]}),
     ("connection", ["**Visit the exhibition:** look at the family letters in the display case, from Violet’s estate. Count her photographs on poster 2: there are four.",
                     "**Virtual visit:** in *Violet’s Life*, open the little house, the piano and the rose, and look at the photograph at each stop."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Violet’s family photographs", "body": ["Project or print this page for circle time and for counting."]}),
    ("html", '<div style="display:grid;grid-template-columns:1fr 1.25fr;gap:14pt;align-items:start;margin:2pt 0 10pt">'
             f'<figure style="margin:0"><img src="{PHOTOS["violet"]["img"]}" alt="" style="width:100%;height:250pt;object-fit:cover;object-position:center 20%;border:1pt solid #1d1c1a;border-radius:4pt">'
             '<figcaption style="font:400 8pt Outfit;margin-top:3pt">Violet as a young woman</figcaption></figure>'
             f'<figure style="margin:0"><img src="{PHOTOS["family"]["img"]}" alt="" style="width:100%;height:250pt;object-fit:cover;border:1pt solid #1d1c1a;border-radius:4pt">'
             '<figcaption style="font:400 8pt Outfit;margin-top:3pt">A family group outside a house. Count the people: there are six.</figcaption></figure></div>'),
    ("html", '<p class="label rowlab">Keepsakes from <i>Violet’s Life</i></p>'
             + row([("house", "<b>A house</b>London, where she grew up"), ("coat", "<b>A coat</b>made small for a child"),
                    ("piano", "<b>A piano</b>she played by ear"), ("rose", "<b>A rose</b>her favorite flower")], 52)),
    ("section", {"label": "Questions to ask the children", "list": [
      "How many people can you count in this photograph? Can you find the baby?",
      "How did Violet help her family when she was a girl?",
      "What would you like to hear Violet play on her piano?",
      "Why do families keep old letters and photographs?",
      "Who would you write a letter to?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** Violet lived in London long ago. She had three sisters and two brothers. She grew vegetables, sewed coats for her children and played the piano. Her favorite flowers were roses. Her family kept her letters and photographs to remember her."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the people. Circle the number.",
            "blocks": [("html", bigphoto("family", 248) + NUMS)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Violet loved roses. Color the rose.",
            "blocks": [("html", color(["rose"], 150))]}),
  ("task", {"label": "Part 3", "title": "Follow the dots from Violet to her piano.",
            "blocks": [("html", match(True))]}),
  ("task", {"label": "Part 4", "title": "Trace the word. We start a letter with it.",
            "blocks": [("html", trace(DEAR, 2).replace("<div></div>", DEAR))]}),
  ("family", ["Look at a family photograph together. Count the people in it, and tell your child who each one is."]),
])

YELLOW = handout("yellow", "WH_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "How many people? Circle the number.",
            "blocks": [("html", bigphoto("family", 248) + NUMS)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Draw a line from Violet to her piano.",
            "blocks": [("html", match(False))]}),
  ("task", {"label": "Part 3", "title": "Copy the word. We start a letter with it.",
            "blocks": [("html", trace(DEAR_MODEL, 2))]}),
  ("task", {"label": "Part 4", "title": "Draw a picture to send in a letter.",
            "blocks": [("draw", "My picture")]}),
  ("family", ["Help your child send their picture to someone in your family, in an envelope, or keep it in a box of family treasures."]),
])

RED = handout("red", "WH_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the people. Circle the number. Then put an X on the baby.",
            "blocks": [("html", bigphoto("family", 248) + NUMS)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Circle the one of Violet’s things you like best. Tell a grown-up why.",
            "blocks": [("html", row([("house", "House"), ("coat", "Coat"), ("piano", "Piano"), ("rose", "Rose")], 60))]}),
  ("task", {"label": "Part 3", "title": "Draw a letter to someone you love.",
            "blocks": [("draw", "My letter")]}),
  ("task", {"label": "Part 4", "title": "Finish it, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">Dear</span></div><div></div></div>')]}),
  ("family", ["Ask your child to tell you about Violet. Then share a story from when you, or a grandparent, were small."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
