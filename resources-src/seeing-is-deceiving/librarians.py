"""Seeing is Deceiving · Library lesson plans and their handouts.

A conversion of the existing librarian resources to the branded design,
in their own words: PreK–K "My Eyes Can Play Tricks!", Grades 1–2
"Look Again!", Grades 3–5 "Don't Be Fooled!" / "Information Detective!" and
Grades 6–8 "Seeing Through Deception". Output paths are the originals'.

The pictures the handouts work on (the two hidden-picture scenes, the
duck–rabbit, the faces–vase and the young–old woman) are not in the
exhibition's folder; they were lifted from the original PDFs into
librarians-img/ beside this file and are printed straight from there."""

import os

IMG = "file://" + os.path.join(os.path.dirname(os.path.abspath(__file__)), "librarians-img") + "/"
S = "/exhibitions/seeing/"
SITE = "minimuseumproject.org/exhibitions/seeing-is-deceiving"
LAB = SITE + "/illusions"

HERO_PK = {"img": S + "rotating-snakes.jpg", "pos": "center 40%"}
HERO_12 = {"img": S + "balcony.jpg", "pos": "center 62%"}
HERO_35 = {"img": S + "checker-shadow.jpg", "pos": "center 40%"}
HERO_68 = {"img": S + "waves.jpg", "pos": "center 45%"}

# the snakes and the waves are busy patterns: a deeper shade keeps the title clear
BUSY = (HERO_PK, HERO_68)
DEEP = ".hshade { background: linear-gradient(180deg, rgba(14,12,10,.8) 0%, rgba(14,12,10,.5) 40%, rgba(14,12,10,.62) 60%, rgba(14,12,10,.94) 100%); }"

# timing colors, as the models use them
C1, C2, C3, C4, C5, C6 = "#7D8471", "#2F4A5A", "#4A7346", "#86671A", "#A8452F", "#5F6655"

# ── shared pieces ───────────────────────────────────────────────────────

CSS = """
.lede { font-size: 10.6pt; line-height: 1.5; margin: 0 0 12pt; color: #3f3e3a; }
.steps { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 8pt; margin: 4pt 0 11pt; break-inside: avoid; }
.step { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 9pt 3pt; }
.step h4 { margin: 0 0 3pt; letter-spacing: .02em; display: flex; align-items: baseline; gap: 6pt; }
.step .sl { font: 500 22pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.step p { font-size: 9pt; line-height: 1.4; }
.pills { display: flex; flex-wrap: wrap; gap: 8pt; margin: 3pt 0 8pt; }
.pills span { font: 500 9pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase;
  border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 12pt 2pt; background: rgba(255,255,255,.6); }
.pills.center { justify-content: center; }
.pills em { font: 400 9pt 'Outfit'; font-style: normal; align-self: center; color: #3f3e3a; }
.head { margin: 4pt 0 2pt; font-weight: 500; }
.blank { margin: 6pt 0 8pt; }
.blank span { display: inline-block; border-bottom: .9pt solid #5b5a55; width: 120pt; height: 1.1em; vertical-align: baseline; }
.blank span.s { width: 60pt; } .blank span.l { width: 200pt; }
.circles { list-style: none; padding: 0; margin: 2pt 0 8pt; }
.circles li { margin: 0 0 4pt; padding-left: 22pt; position: relative; }
.circles li::before { content: ""; position: absolute; left: 0; top: .2em; width: 11pt; height: 11pt; border: 1pt solid #1d1c1a; border-radius: 50%; background: rgba(255,255,255,.6); }
.circles.box li::before { border-radius: 2pt; }
.pic { margin: 4pt 0 8pt; text-align: center; break-inside: avoid; }
.pic img { max-width: 100%; border: 1pt solid #1d1c1a; border-radius: 5pt; display: block; margin: 0 auto; }
.sources td:first-child { width: 30%; }
.qa { margin: 0 0 6pt; break-inside: avoid; }
.qa p { margin: 0; font-weight: 400; }
body.adult .levels .lv { font-size: 9pt; }
.conn.withimg { display: grid; grid-template-columns: 112pt 1fr; gap: 14pt; align-items: center; padding: 8pt 12pt 6pt 8pt; }
.conn.withimg img { width: 112pt; height: 138pt; object-fit: cover; border-radius: 4pt; display: block; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

CARD = S + "artifacts/victorian-cards-thumb.jpg"

def conn(paras, url=SITE, lines=0, img=None):
    """The Mini Museum connection box, with the address the original gives;
       img sets an exhibition artifact beside the text."""
    body = "".join(f"<p>{p}</p>" for p in paras)
    if lines:
        body += '<div class="write">' + "<i></i>" * lines + "</div>"
    inner = f'<p class="label">Mini Museum connection</p>{body}<p class="url">{url}</p>'
    if img:
        return ("html", f'<aside class="conn withimg"><img src="{img}" alt=""><div>{inner}</div></aside>')
    return ("html", f'<aside class="conn">{inner}</aside>')

def books(label, paras):
    body = "".join(f"<p>{p}</p>" for p in paras)
    return ("html", f'<aside class="family"><p class="label">{label}</p>{body}</aside>')

def steps(items):
    cells = "".join(f'<div class="step"><h4><span class="sl">{a}</span><span>{b}</span></h4><p>{c}</p></div>' for a, b, c in items)
    return ("html", f'<div class="steps" style="--n:{len(items)}">{cells}</div>')

def pills(words, center=False, sep=None):
    inner = (f"<em>{sep}</em>").join(f"<span>{w}</span>" for w in words) if sep else "".join(f"<span>{w}</span>" for w in words)
    return f'<div class="pills{" center" if center else ""}">{inner}</div>'

def qa(q, lines):
    return ("html", f'<div class="qa"><p class="head">{q}</p><div class="write">' + "<i></i>" * lines + "</div></div>")

def verdict(label="Your verdict:"):
    return ("html", pills(["Reliable", "Unreliable", "Need more info"], sep="/").replace('<div class="pills">', f'<div class="pills"><em><b>{label}</b></em>', 1))

PLAN_CSS = ".sec { break-inside: auto; margin-bottom: 8pt; } .lede { margin-bottom: 10pt; } .sec .label, .sec h3 { break-after: avoid; }"

def plan(out, title, sub, foot, hero, chips, lede, blocks, css=""):
    return {"out": out, "eyebrow": "Library lesson plan", "title": title, "sub": sub,
            "foot": foot, "hero": hero, "css": CSS + PLAN_CSS + (DEEP if hero in BUSY else "") + css,
            "blocks": [("html", f'<p class="lede">{lede}</p>')] + blocks}

def handout(out, title, sub, foot, level, hero, blocks, context=None, young=False, css=""):
    d = {"out": out, "eyebrow": "Student handout", "title": title, "sub": sub, "level": level,
         "foot": f"Student Handout · {foot} · {level.title()} Level", "hero": hero,
         "css": CSS + (DEEP if hero in BUSY else "") + css, "blocks": blocks}
    if context:
        d["context"] = context
    if young:
        d["young"] = True
    return d

# a timing bar whose label does not claim a total: in three of the plans the
# steps add up to a little more or less than the session length stated
RELABEL = ""   # every plan now states the length its steps add up to

# ════════════════════════════════════════════════════════════════════════
# PreK–K · My Eyes Can Play Tricks!
# ════════════════════════════════════════════════════════════════════════

PK = "librarians/prek-k/"
PK_TITLE = "My Eyes Can Play Tricks!"

PK_PLAN = plan(
  PK + "Lesson Plan_ My Eyes Can Play Tricks! (PreK-K Library) - Teacher Guide.pdf",
  PK_TITLE, "PreK–Kindergarten · Library · 18 minutes", "Library Lesson Plan · PreK–K", HERO_PK,
  ["PreK–K", "18 minutes", "Library"],
  "A read-aloud and exploration session where our youngest learners discover that what they see isn’t always what’s really there — building early foundations for critical thinking.",
  [
    ("timing", [("Gathering & hook", 3, C1), ("Read-aloud", 8, C2), ("Mini Museum", 5, C4), ("Closing", 2, C5)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will understand that our eyes can sometimes be “tricked,” practice looking carefully before deciding, and connect this to books in the library."]}),
    ("cols", [
      [("section", {"label": "Standards alignment", "list": [
        "**AASL I.A.2:** Recall prior knowledge as context for new meaning",
        "**TEKS §110.2 (K) 1A:** Listen actively and ask questions"]}),
       ("section", {"label": "Materials needed", "list": [
        "Picture book: *Duck! Rabbit!* by Amy Krouse Rosenthal (or similar)",
        "Large printed optical illusions (age-appropriate, 3–4 examples)",
        "Mini Museum artifacts OR virtual exhibition access",
        "Optional: student handouts"]})],
      [("section", {"label": "Recommended read-aloud books"}),
       ("refs", [
        ("*Duck! Rabbit!*", "by Amy Krouse Rosenthal & Tom Lichtenheld — Two narrators argue about what they see. Perfect for multiple perspectives."),
        ("*Round Trip*", "by Ann Jonas — Black-and-white book tells one story, flip upside-down for a different picture!")])]]),
    ("section", {"label": "Lesson plan · Gathering & hook · 3 minutes",
      "body": ["As students settle, hold up a large ambiguous image (duck/rabbit or vase/faces).",
               "*“Good morning, friends! I have a mystery picture. Look carefully… what do you see?”*",
               "Let children call out — they will disagree!",
               "*“Wow! Some see a duck, some see a rabbit. You’re ALL right! This is an optical illusion — it tricks your eyes into seeing TWO different things!”*"]}),
    ("section", {"label": "Read-aloud: Duck! Rabbit! · 8 minutes",
      "body": ["*“I have a book about two friends looking at the SAME picture. But they can’t agree! Let’s find out what happens.”*",
               "**During reading:** Pause to let children point out duck vs. rabbit features. Ask: *“What do YOU see? Did it change?”*",
               "**After reading:** *“The friends kept arguing, but we learned: one picture can look different to different people. Neither is wrong!”*"]}),
    ("section", {"label": "Mini Museum exploration · 5 minutes",
      "body": ["*“Now I’ll show you something VERY special from long ago — before your grandparents were born! People back then LOVED eye tricks too.”*",
               "**Option 1 — Physical visit:** Bring students to view Mini Museum artifacts.",
               "**Option 2 — Virtual visit:** Show " + SITE,
               "**Victorian illusion cards:** *“Does it look like it’s moving? It’s not — your eyes are playing a trick!”*",
               "**Stereoscope:** *“This old machine makes flat pictures look like they pop out!”*"]}),
    ("section", {"label": "Closing · 2 minutes",
      "body": ["*“Today we learned our eyes can be tricked! That’s why it’s SO important to look carefully, ask questions, and listen when someone sees differently. You might BOTH be right!”*",
               "**Exit question:** *“If your friend sees something different than you, what should you do?”*"]}),
    ("section", {"label": "Optional extension",
      "body": ["Students draw their own “trick picture” that could be two things. Example: a circle = sun OR ball OR pizza!"]}),
    ("section", {"label": "Differentiated student handouts"}),
    ("levels", {
      "green": "Look at three trick pictures and circle what you see first.",
      "yellow": "Draw something that could be TWO things.",
      "red": "Create a trick picture, then test it on three people."}),
    ("connection", ["This lesson introduces the exhibition’s core concept: our eyes and brains work together to see, and sometimes they can be fooled. Victorian artifacts provide a tangible, historical connection."]),
    ("cols", [
      [("section", {"label": "Assessment",
        "body": ["**Observation:** Can students identify that an ambiguous image shows two things? Do they engage with seeing differently?"]})],
      [("section", {"label": "Book display",
        "body": ["**“Look Again!” display:** *Duck! Rabbit!*, *Round Trip*, *Look! Look! Look!*, *It Looked Like Spilt Milk*, *I Spy*, *Where’s Waldo?*"]})]]),
  ], css=RELABEL)

PK_CSS = """

.trick { display: grid; grid-template-columns: 150pt 1fr; gap: 18pt; align-items: center; margin: 0 0 9pt;
  background: rgba(255,255,255,.6); border-radius: 6pt; padding: 7pt; break-inside: avoid; }
.trick img { width: 150pt; height: 158pt; object-fit: contain; background: #fff; border: 1.2pt solid #1d1c1a; border-radius: 5pt; display: block; }
.trick p { font: 400 15pt 'Outfit'; margin: 0 0 10pt; text-align: center; }
.trick .pills span { font-size: 12pt; padding: 6pt 18pt 5pt; }
.trick .pills em { font-size: 12pt; }
.blank { font-size: 14pt; text-align: center; }
body.young .task h3 { font-size: 16pt; }
"""

def trick(img, a, b):
    return (f'<div class="trick"><img src="{IMG}{img}" alt=""><div><p>I see a…</p>'
            + pills([a, b], center=True, sep="or") + "</div></div>")

PK_GREEN = handout(PK + "My Eyes Can Play Tricks! - Green Level (PreK-K).pdf", PK_TITLE,
  "PreK–Kindergarten · Library", "Library · PreK–K", "green", HERO_PK, [
    ("task", {"label": "Look closely", "title": "Look at each picture. Circle what YOU see first!", "blocks": [
      ("html", trick("duck-rabbit.jpg", "Rabbit", "Duck") + trick("vase-faces.jpg", "Vase", "Two faces")
               + trick("young-old-woman.jpg", "Young woman", "Old woman"))]}),
    ("family", ["Show your family! Do they see the same things you see?"]),
  ], young=True, css=PK_CSS + ".trick { grid-template-columns: 116pt 1fr; padding: 5pt 7pt; margin-bottom: 6pt; } .trick img { width: 116pt; height: 116pt; } body.student .ticket { margin-bottom: 8pt; } .family { margin-top: 2pt; padding-top: 5pt; }")

PK_YELLOW = handout(PK + "My Eyes Can Play Tricks! - Yellow Level (PreK-K).pdf", PK_TITLE,
  "PreK–Kindergarten · Library", "Library · PreK–K", "yellow", HERO_PK, [
    ("task", {"label": "Draw", "title": "Draw something that could be TWO things!",
              "body": ["**Ideas:** A circle could be a sun, a ball, or a pizza!"],
              "blocks": [("draw", "Draw here!")]}),
    ("html", '<p class="blank">My drawing is a <span></span> AND a <span></span>!</p>'),
    ("family", ["Show your family! Do they see the same thing you see?"]),
  ], young=True, css=PK_CSS + "body.young .drawbox { height: 332pt; }")

PK_RED = handout(PK + "My Eyes Can Play Tricks! - Red Level (PreK-K).pdf", PK_TITLE,
  "PreK–Kindergarten · Library", "Library · PreK–K", "red", HERO_PK, [
    ("task", {"label": "Illusion artist", "title": "You are an Illusion Artist! Create a trick picture that can be TWO things.",
              "blocks": [("draw", "Draw here!")]}),
    ("html", '<p class="blank">My picture is a <span></span> AND a <span></span>!</p>'),
    ("task", {"label": "Test it", "title": "Test Your Illusion! Show 3 people. What do they see FIRST?",
              "blocks": [("html", '<p class="blank" style="text-align:left;font-size:12pt">Person 1: <span style="width:96pt"></span> &nbsp; Person 2: <span style="width:96pt"></span> &nbsp; Person 3: <span style="width:96pt"></span></p>')]}),
    ("family", ["Make another trick picture at home to surprise your family!"]),
  ], young=True, css=PK_CSS + "body.young .drawbox { height: 300pt; }")

# ════════════════════════════════════════════════════════════════════════
# Grades 1–2 · Look Again! Finding Hidden Pictures
# ════════════════════════════════════════════════════════════════════════

G12 = "librarians/grades-1-2/"
G12_TITLE = "Look Again!"

G12_PLAN = plan(
  G12 + "Library Lesson Plan_ Look Again! Finding Hidden Pictures (Grades 1-2) - Teacher Guide.pdf",
  "Look Again! Finding Hidden Pictures", "Grades 1–2 · Library · 27 minutes", "Library Lesson Plan · Grades 1–2", HERO_12,
  ["Grades 1–2", "27 minutes", "Library"],
  "Students develop observation skills through “I Spy” and hidden picture books, connecting careful looking to the library skill of finding information and the life skill of looking carefully before believing what we see.",
  [
    ("timing", [("Gathering & hook", 3, C1), ("Interactive search", 10, C2), ("Mini Museum", 7, C4), ("Partner hunt", 5, C3), ("Closing", 2, C5)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will practice careful observation through hidden picture activities, understand that finding information requires patience and attention, and connect the skill of “looking again” to both library research and real-world critical thinking."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**AASL I.B.1:** Learners engage with information through following a process.",
      "**AASL I.D.4:** Learners select information by seeking a variety of sources.",
      "**TEKS §110.3 (1) 1A:** Listen actively, ask relevant questions to clarify information."]}),
    ("cols", [
      [("section", {"label": "Materials needed", "list": [
        "*I Spy* or *Look-Alikes* book by Walter Wick / Jean Marzollo",
        "*Where’s Waldo?* book or large poster",
        "Hidden picture printouts (one per student or pair)",
        "Mini Museum exhibition artifacts for exploration"]})],
      [("section", {"label": "Recommended books", "list": [
        "*I Spy* series by Jean Marzollo & Walter Wick",
        "*Look-Alikes Jr.* by Joan Steiner",
        "*Can You See What I See?* by Walter Wick",
        "*Where’s Waldo?* by Martin Handford"]})]]),
    ("section", {"label": "Lesson plan · Gathering & hook · 3 minutes",
      "body": ["Display a large *I Spy* or hidden picture image on screen or hold up the book.",
               "*“I have a challenge for you today. I’m going to show you a picture, and I bet you can’t find EVERYTHING that’s hidden in it — at least not on your first try! Our eyes sometimes miss things.”*",
               "Show an *I Spy* spread. Ask students to find one easy object, then one harder object.",
               "*“Did anyone find the second one right away? Sometimes we have to LOOK AGAIN — more carefully — to find what we’re looking for. That’s what we’re going to practice today!”*"]}),
    ("section", {"label": "Read-aloud / interactive search · 10 minutes",
      "body": ["**Round 1: Group search** — Read the riddle/clue aloud. Give students 30 seconds to scan silently. Ask: *“Who found it? Can you describe WHERE it is without pointing?”* This builds descriptive vocabulary.",
               "**Round 2: Challenge search** — Choose a harder page with more objects. *“See if you can find THREE things before I count to 20!”* Discuss strategies: look systematically, start at corners, look for colors.",
               "*“Finding hidden pictures is a LOT like finding information in the library. You have to: 1) Know what you’re looking for, 2) Look carefully in the right places, and 3) Look AGAIN if you don’t find it the first time!”*"]}),
    ("section", {"label": "Mini Museum connection · 7 minutes",
      "body": ["Transition to the exhibition area or bring artifacts to the group.",
               "*“Now I want to show you how people over 100 years ago played ‘look again’ games — but with a twist! They made pictures that TRICK your eyes.”*",
               "**Show Victorian illusion cards:** *“Look at this card. What do you see? Now keep looking… do you see something ELSE?”* Let students discover hidden images. *“These cards taught people an important lesson: sometimes you have to look MORE than once to see the truth!”*",
               "**Demonstrate stereoscope:** *“This machine makes flat pictures look 3D — like they’re popping out! It tricks your eyes into seeing something that isn’t really there.”*"]}),
    ("section", {"label": "Activity: Partner hidden picture hunt · 5 minutes",
      "body": ["Distribute hidden picture sheets (one per pair or student). Students work to find all hidden objects. When finished, they can trade with another pair. Circulate and ask: *“What strategy are you using?”*"]}),
    ("section", {"label": "Closing: The “Look Again” rule · 2 minutes",
      "body": ["*“Today we practiced a super important skill: LOOKING AGAIN. This helps us in the library when we’re searching for books. And it helps us in life too! If something looks strange or too good to be true, what should we do?”* (Students: *“Look again!”*) *“Right! Always remember to LOOK AGAIN before you decide what’s true!”*"]}),
    ("connection", ["**Option 1 — Visit:** Victorian transformation cards required careful observation to reveal hidden images — just like *I Spy* books. This builds the foundational skill of looking carefully before accepting what we see.",
                    "**Option 2 — Virtual:** Explore the exhibition online."]),
    ("section", {"label": "Differentiated student handouts"}),
    ("levels", {
      "green": "Find 5 hidden objects with picture clues.",
      "yellow": "Find 8 objects with word clues only.",
      "red": "Create your own hidden picture for others to solve."}),
    ("cols", [
      [("section", {"label": "Assessment", "list": [
        "**Observation:** Can students use systematic strategies to find hidden objects?",
        "**Discussion:** Can students articulate why “looking again” is important?",
        "**Exit question:** *“What’s one strategy you use to find hidden pictures?”*"]})],
      [("section", {"label": "Book display suggestions",
        "body": ["Create a **“Look Again!”** display: *I Spy* series, *Where’s Waldo?*, *Can You See What I See?*, *Look-Alikes*, *Highlights Hidden Pictures* magazines, optical illusion books."]})]]),
  ], css=RELABEL)

G12_CSS = """
.pic img { width: 100%; }
.circles li { font-size: 13pt; margin-bottom: 7pt; }
.circles li::before { width: 15pt; height: 15pt; top: .15em; }
.pills span { font-size: 11pt; padding: 5pt 14pt 4pt; }
.checks { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20pt; }
"""

G12_GREEN = handout(G12 + "Student Handout_ Look Again! - Green Level (Library 1-2).pdf", G12_TITLE,
  "Grades 1–2 · Library", "Library 1–2", "green", HERO_12, [
    ("task", {"label": "Part 1", "title": "Find these objects!", "blocks": [
      P("Circle each object when you find it:"),
      ("html", pills(["Star", "Heart", "Moon", "Bell", "Apple"], center=True)),
      ("html", f'<figure class="pic"><img src="{IMG}hidden-night.jpg" alt=""></figure>'),
      ("html", '<p class="blank"><b>How many did you find?</b> <span class="s"></span> out of 5</p>')]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "My best strategy", "blocks": [
      P("How do you find hidden pictures? Circle what works for you:"),
      ("html", '<ul class="circles"><li>I start at the top and look down</li><li>I look for colors first</li>'
               '<li>I look in the corners</li><li>I look EVERYWHERE slowly</li></ul>')]}),
    books("Try these library books!", ["Ask for <i>I Spy</i> books to practice finding hidden things!",
                                       "Also try: <i>Where’s Waldo?</i>, <i>Can You See What I See?</i>"]),
    conn(["Long ago, people made special cards with hidden pictures. You had to look VERY carefully to find the secret image!"], img=CARD),
    ("family", ["Play “I Spy” at home! Take turns saying “I spy something…” and let others guess what you see."]),
  ], context=["**Finding hidden things.** Good detectives look carefully! Find the hidden objects in the picture below."],
  young=True, css=G12_CSS + ".pic img { width: 80%; } .pic { margin-bottom: 4pt; } .pb + .task .circles li { font-size: 15pt; margin-bottom: 22pt; } .pb + .task p { margin-bottom: 16pt; } .conn.withimg img { width: 130pt; height: 165pt; } .conn.withimg { grid-template-columns: 130pt 1fr; } .pb + .task .circles li::before { width: 18pt; height: 18pt; } .pb + .task .circles li { padding-left: 28pt; } .pb + .task { margin-bottom: 16pt; } .family, .conn { margin-top: 22pt; }")

G12_YELLOW = handout(G12 + "Student Handout_ Look Again! - Yellow Level (Library 1-2).pdf", G12_TITLE,
  "Grades 1–2 · Library", "Library 1–2", "yellow", HERO_12, [
    ("task", {"label": "Part 1", "title": "Find ALL 8 objects!", "blocks": [
      P("Check off each one when you find it:"),
      ("html", '<ul class="circles box checks"><li>Pencil</li><li>Fish</li><li>Banana</li><li>Sock</li>'
               '<li>Butterfly</li><li>Key</li><li>Spoon</li><li>Mushroom</li></ul>')]}),
    ("html", f'<figure class="pic"><img src="{IMG}hidden-day.jpg" alt=""></figure>'),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "Think like a detective!", "blocks": [
      qa("Which object was HARDEST to find?", 2),
      qa("WHY was it hard to find?", 2),
      qa("What strategy helped you the most?", 2)]}),
    conn(["Old Victorian cards had hidden pictures too! Sometimes you had to turn them upside down to see the secret image.",
          "<b>Why do you think people liked these tricky pictures?</b>"], lines=2, img=CARD),
    books("Library book ideas", ["Try these books to practice your “look again” skills: <i>I Spy</i> books · <i>Where’s Waldo?</i> · <i>Can You See What I See?</i>"]),
    ("family", ["Borrow an *I Spy* or *Where’s Waldo?* book from the library. Race your family to find the objects!"]),
  ], context=["**Hidden picture challenge!** Good searchers use strategies! Find all 8 hidden objects and think about HOW you found them."],
  young=True, css=G12_CSS + ".pic img { width: 390pt; } .checks { grid-template-columns: repeat(4, 1fr); } .circles li { margin-bottom: 6pt; } .conn .write { margin-bottom: 8pt; }")

G12_RED = handout(G12 + "Student Handout_ Look Again! - Red Level (Library 1-2).pdf", G12_TITLE,
  "Grades 1–2 · Library", "Library 1–2", "red", HERO_12, [
    ("task", {"label": "Step 1", "title": "Plan your hidden objects", "blocks": [
      P("List 6 things you will hide in your picture:"),
      ("html", '<div class="checks">' + "".join(f'<p class="blank">{i}. <span class="l"></span></p>' for i in range(1, 7)) + "</div>")]}),
    ("task", {"label": "Step 2", "title": "Draw your scene",
              "body": ["Draw a busy scene and HIDE your 6 objects inside it. Make some easy and some hard!"],
              "blocks": [("draw", "Draw here")]}),
    ("pagebreak", None),
    ("task", {"label": "Step 3", "title": "Test it!", "blocks": [
      P("Give your puzzle to a friend. Time how long it takes them to find everything!"),
      ("html", '<p class="blank">Tester’s name: <span class="l"></span></p>'
               '<p class="blank">Time to find all objects: <span class="s"></span> minutes</p>'
               '<p class="blank">Which was hardest for them? <span class="l"></span></p>')]}),
    ("task", {"label": "Reflect", "title": "What tricks did you use to hide objects well?", "lines": 3}),
    ("task", {"label": "Reflect", "title": "How is hiding things in a picture like hiding the truth in real life?", "lines": 3}),
    conn(["Artists who made Victorian trick cards were really good at hiding things! They used colors, shapes, and patterns to fool your eyes."], img=CARD),
    ("family", ["Make hidden picture puzzles for your family! See who can create the hardest one to solve."]),
  ], context=["**Create your own hidden picture!** Now YOU get to be the artist! Make a hidden picture puzzle for someone else to solve."],
  young=True, css=G12_CSS + ".checks .blank { margin: 2pt 0 6pt; } .checks .blank span.l { width: 190pt; } body.young .drawbox { height: 182pt; }")

# ════════════════════════════════════════════════════════════════════════
# Grades 3–5 · Don't Be Fooled! Information Detective Skills
# ════════════════════════════════════════════════════════════════════════

G35 = "librarians/grades-3-5/"
G35_TITLE = "Information Detective!"

STOP_CHECK_ASK = steps([
  ("1", "STOP", "Before you believe it or share it, PAUSE! Don’t let excitement push you to act fast."),
  ("2", "CHECK", "Who wrote this? When? Is it from a reliable place? Can you find the same info elsewhere?"),
  ("3", "ASK", "Ask a trusted adult (librarian, teacher, parent) if you’re not sure.")])

G35_PLAN = plan(
  G35 + "Library Lesson Plan_ Don't Be Fooled! Information Detective Skills (Grades 3-5) - Teacher Guide.pdf",
  "Don’t Be Fooled! Information Detective Skills", "Grades 3–5 · Library · 31 minutes", "Library Lesson Plan · Grades 3–5", HERO_35,
  ["Grades 3–5", "31 minutes", "Library"],
  "Students connect optical illusions to information literacy, learning that just as our eyes can be tricked, we can be fooled by unreliable information — and developing the detective skills to tell the difference.",
  [
    ("timing", [("Hook", 5, C1), ("Spirit photography", 5, C6), ("Stop-Check-Ask", 8, C2), ("Real or fake?", 8, C4), ("Museum", 3, C3), ("Close", 2, C5)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will understand that just as optical illusions trick our eyes, misleading information can trick our brains; learn the STOP-CHECK-ASK framework for evaluating information; and practice applying these skills to real examples."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**AASL I.B.3:** Learners generate new knowledge by generating products that illustrate learning.",
      "**AASL I.D.1:** Learners demonstrate mastery by selecting information in a variety of formats.",
      "**TEKS §110.5 (3) 13B:** Identify credibility of sources."]}),
    ("cols", [
      [("section", {"label": "Materials needed", "list": [
        "Spirit photography examples from Mini Museum",
        "Sample “fake news” headlines (age-appropriate)",
        "STOP-CHECK-ASK poster or visual",
        "Mini Museum Perception Lab: " + LAB]})],
      [("section", {"label": "Recommended books", "list": [
        "*Fake News: Separating Truth from Fiction* by Danielle Smith-Llera",
        "*True or False? A CIA Analyst’s Guide* by Cindy L. Otis"]})]]),
    ("section", {"label": "Lesson plan · Hook: Tricking your eyes · 5 minutes",
      "body": ["Display 2–3 classic optical illusions. Let students vote on which line is longer, then reveal they’re the same.",
               "*“Your eyes just got TRICKED. These are optical illusions — pictures that fool your brain. Now here’s my question: If your eyes can be tricked by a simple picture… can your BRAIN be tricked by information?”*"]}),
    ("section", {"label": "Historical connection: Spirit photography · 5 minutes",
      "body": ["Show spirit photography examples from the exhibition.",
               "*“Over 150 years ago, William Mumler claimed he could photograph ghosts. He charged grieving families lots of money to see images of their dead loved ones. Thousands believed it was real. Was it? No — he used ‘double exposure’ to fake it. This teaches us: just because something LOOKS real doesn’t mean it IS real.”*"]}),
    ("section", {"label": "Direct instruction: STOP-CHECK-ASK · 8 minutes"}),
    STOP_CHECK_ASK,
    ("section", {"label": "Activity: Real or fake? · 8 minutes",
      "body": ["Present 3–4 examples and have students apply STOP-CHECK-ASK:"],
      "list": ["*“Scientists discover chocolate is healthier than vegetables!”* — **Fake** (too good to be true)",
               "News article from known newspaper about local event — **Reliable** (known source, verifiable)",
               "Social media post with “facts” but no source — **Suspicious** (needs checking)",
               "Spirit photograph from 1870 — **Fake** (historical hoax)"]}),
    P("For each: <i>“What step helps you here? STOP, CHECK, or ASK?”</i>"),
    ("section", {"label": "Mini Museum exploration · 3 minutes",
      "body": ["*“When you visit the Mini Museum, look at the artifacts with your Information Detective skills. The Victorian illusion cards show how artists played with your eyes. The spirit photographs show how people can be fooled when they don’t check sources. The lesson is the same across 150 years: LOOK CAREFULLY before you believe!”*"]}),
    ("section", {"label": "Closing · 2 minutes",
      "body": ["*“Today you became Information Detectives. You learned that just like optical illusions trick your eyes, misleading information can trick your brain. But now you have a tool: STOP-CHECK-ASK. Use it whenever something seems surprising, exciting, or scary!”*"]}),
    ("connection", ["**Option 1 — Visit:** Spirit photography provides a powerful historical example of visual misinformation. Students see the challenge of distinguishing real from fake isn’t new.",
                    "**Option 2 — Virtual:** Explore the exhibition online."]),
    ("section", {"label": "Differentiated student handouts"}),
    ("levels", {
      "green": "STOP-CHECK-ASK visual guide with simple scenarios.",
      "yellow": "Evaluate multiple sources, explain reasoning.",
      "red": "Research historical hoax, create misinformation awareness guide."}),
    ("section", {"label": "Assessment", "list": [
      "**Application:** Can students correctly apply STOP-CHECK-ASK to sample scenarios?",
      "**Understanding:** Can students explain why spirit photography fooled people?",
      "**Exit ticket:** *“Name one question you should ask before believing something online.”*"]}),
  ], css=RELABEL + " .timing span { letter-spacing: .06em; }")

G35_GREEN = handout(G35 + "Student Handout_ Information Detective! - Green Level (Library 3-5).pdf", G35_TITLE,
  "Grades 3–5 · Library", "Library 3–5", "green", HERO_35, [
    ("task", {"label": "Part 1", "title": "STOP — CHECK — ASK", "blocks": [steps([
      ("1", "STOP", "Before you believe it or share it, PAUSE! Don’t let excitement make you rush."),
      ("2", "CHECK", "Look for clues: Who wrote it? Where did it come from? Can you find it somewhere else?"),
      ("3", "ASK", "If you’re not sure, ask a librarian, teacher, or parent!")])]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "Practice!", "blocks": [
      P("Read each headline. Circle <b>TRUST</b> or <b>CHECK MORE</b>:"),
      ("html", '<p class="head">“Scientists Say Kids Should Eat Ice Cream for Every Meal!”</p>' + pills(["Trust", "Check more"], sep="or")
               + '<p class="head">“Local Library Hosting Summer Reading Program” — from your school newsletter</p>' + pills(["Trust", "Check more"], sep="or")
               + '<p class="head">“You Won’t BELIEVE What This Dog Can Do!!!” — no author, random website</p>' + pills(["Trust", "Check more"], sep="or"))]}),
    conn(["In the 1860s, fake “ghost photographs” tricked thousands of people! They didn’t know pictures could be faked.",
          "Now YOU know better — always STOP-CHECK-ASK!"], LAB),
    ("task", {"label": "Part 3", "title": "My Information Detective Pledge", "blocks": [
      P("I promise to:"),
      ("html", '<ul class="circles box"><li><b>STOP</b> before I believe or share something surprising</li>'
               '<li><b>CHECK</b> who wrote it and where it came from</li>'
               '<li><b>ASK</b> a trusted adult if I’m not sure</li></ul>'
               '<p class="blank">Signed: <span class="l"></span></p>')]}),
    ("family", ["Teach your family the STOP-CHECK-ASK steps! Next time someone shares surprising news, practice together."]),
  ], context=["**Don’t be fooled!** Just like optical illusions trick your eyes, fake information can trick your brain. Use these three steps to protect yourself!"],
  css=""".steps { grid-template-columns: 1fr; gap: 12pt; } .step { display: grid; grid-template-columns: 120pt 1fr; align-items: center; gap: 14pt; padding: 26pt 18pt 24pt; border-top: 0; border-left: 5pt solid var(--accent); }
.step h4 { font-size: 24pt; margin: 0; } .step .sl { font-size: 46pt; } .step p { font-size: 13pt; line-height: 1.45; margin: 0; }
.task .head { margin-top: 12pt; } .task .pills { margin-bottom: 8pt; } .task .pills span { font-size: 10pt; padding: 4pt 14pt 3pt; }
.task ~ .task ~ .task { border: 1.2pt solid #1d1c1a; border-radius: 6pt; background: rgba(255,255,255,.6); padding: 14pt 16pt 10pt; margin: 16pt 0 16pt; }
.task ~ .task ~ .task h3 { font-size: 20pt; } .task ~ .task ~ .task .circles li { font-size: 12.5pt; margin-bottom: 12pt; padding-left: 28pt; }
.task ~ .task ~ .task .circles li::before { width: 16pt; height: 16pt; top: 0; } .task ~ .task ~ .task .blank { margin-top: 22pt; font-size: 12pt; }""")

G35_YELLOW = handout(G35 + "Student Handout_ Information Detective! - Yellow Level (Library 3-5).pdf", G35_TITLE,
  "Grades 3–5 · Library", "Library 3–5", "yellow", HERO_35, [
    ("task", {"label": "Part 1", "title": "Source analysis", "blocks": [
      P("For each source, answer the CHECK questions:"),
      P("<b>Source 1:</b> “Dogs Can Read Minds, Scientists Confirm!” — Posted on social media, no author listed, no date"),
      P("<b>Source 2:</b> Article from National Geographic Kids website about animal communication, published last month"),
      ("table", {"head": ["CHECK question", "Source 1", "Source 2"], "rows": [
        ["Who created it?", "", ""], ["When was it made?", "", ""], ["Can you verify it elsewhere?", "", ""],
        ["**Verdict** (circle one)", "Reliable / Unreliable / Need More Info", "Reliable / Unreliable / Need More Info"]]})]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "History lesson: Spirit photography", "blocks": [
      P("In the 1860s–1900s, “spirit photographers” charged people money to photograph their dead relatives’ “ghosts.” Thousands believed it was real."),
      qa("Why did people believe the fake photographs?", 3),
      qa("What could they have done to CHECK the photos?", 3),
      qa("What’s the modern version of this trick?", 3)]}),
    ("task", {"label": "Part 3", "title": "My information rules", "blocks": [
      P("Write 3 rules you will follow before believing or sharing information:"),
      ("html", "".join(f'<p class="blank">{i}. <span style="width:93%"></span></p>' for i in (1, 2, 3)))]}),
    conn(["The Victorian artifacts in the Mini Museum show that people have been fooled by images for over 150 years. The technology changes, but the tricks stay the same!"], LAB),
    ("family", ["Find a news story online with your family. Practice evaluating it together: Who wrote it? When? Can you find the same information from another source?"]),
  ], context=["**Evaluating information.** Optical illusions trick your eyes; misleading information tricks your brain. Good detectives know how to spot the difference between reliable and unreliable sources."],
  css="table.fill td { padding-bottom: 40pt; } table.fill td:first-child { width: 26%; } table.fill tr:last-child td { padding-bottom: 6pt; font-size: 8.4pt; } .blank { margin: 12pt 0 14pt; }")

G35_RED = handout(G35 + "Student Handout_ Information Detective! - Red Level (Library 3-5).pdf", G35_TITLE,
  "Grades 3–5 · Library", "Library 3–5", "red", HERO_35, [
    ("task", {"label": "Part 1", "title": "Research a historical hoax", "blocks": [
      P("Choose one famous hoax to research:"),
      ("html", '<ul class="circles"><li>Spirit Photography (William Mumler, 1860s)</li>'
               '<li>The Cottingley Fairies (1917 — fake fairy photos)</li>'
               '<li>The Cardiff Giant (1869 — fake giant fossil)</li>'
               '<li>The Loch Ness Monster “Surgeon’s Photo” (1934)</li></ul>'
               '<p class="blank"><b>Hoax I’m researching:</b> <span class="l" style="width:300pt"></span></p>'),
      qa("What was the hoax? How did it fool people?", 2),
      qa("How was it eventually exposed as fake?", 2),
      qa("What lesson does this teach us today?", 2)]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "Create a misinformation awareness guide",
              "body": ["Design a mini-poster for younger students (Grades 1–2) teaching them ONE important rule about not being fooled. Include: a catchy title, simple language, a picture or example, one action they can take."],
              "blocks": [("draw", "Design your guide here")]}),
    ("task", {"label": "Part 3", "title": "Critical question",
              "body": ["Technology keeps making it easier to create convincing fakes. What skills will ALWAYS be useful, no matter what new technology appears?"], "lines": 4}),
    ("family", ["Share what you learned about your historical hoax with your family. Ask them: *“What hoaxes or fake information have YOU encountered?”*",
                "**Visit:** " + LAB]),
  ], context=["**The history of hoaxes.** From spirit photography to deepfakes, people have always found ways to fool others with fake images and information. Understanding history helps us recognize modern tricks."],
  css=".drawbox { height: 340pt; }")

# ════════════════════════════════════════════════════════════════════════
# Grades 6–8 · Seeing Through Deception
# ════════════════════════════════════════════════════════════════════════

G68 = "librarians/grades-6-8/"
G68_TITLE = "Seeing Through Deception"

G68_PLAN = plan(
  G68 + "Library Lesson Plan_ Seeing Through Deception (Grades 6-8) - Teacher Guide.pdf",
  "Seeing Through Deception", "Grades 6–8 · Library · Advanced Information Literacy", "Library Lesson Plan · Grades 6–8", HERO_68,
  ["Grades 6–8", "35 minutes", "Library"],
  "Students develop sophisticated source evaluation skills by connecting the history of visual deception — from spirit photography to deepfakes — to contemporary information literacy challenges.",
  [
    ("timing", [("Hook", 5, C1), ("The SIFT method", 10, C2), ("Psychology of belief", 5, C6), ("SIFT in action", 12, C4), ("Closing", 3, C5)]),
    ("section", {"label": "Learning objective",
      "body": ["Students will trace the evolution of visual misinformation from 1860s spirit photography to modern deepfakes, master the SIFT method for lateral reading and source verification, and apply these skills to evaluate real-world examples."]}),
    ("section", {"label": "Standards alignment", "list": [
      "**AASL I.B.1:** Using evidence to investigate questions.",
      "**AASL I.D.2:** Evaluating information for accuracy, validity, context.",
      "**CCSS.ELA-LITERACY.RI.7.8:** Trace and evaluate the argument and specific claims in a text."]}),
    ("cols", [
      [("section", {"label": "Materials needed", "body": [
        "Spirit photography examples from Mini Museum · Modern manipulated images · Brief deepfake video clip · SIFT method poster/handout · Sample sources for lateral reading practice",
        "**Mini Museum Perception Lab:** " + LAB]})],
      [("section", {"label": "Recommended resources", "list": [
        "*True or False? A CIA Analyst’s Guide* by Cindy L. Otis",
        "*Verified: How to Think Straight* by Caulfield & Wineburg"]})]]),
    ("section", {"label": "Lesson plan · Hook: A 160-year timeline of deception · 5 minutes",
      "body": ["Display timeline: Spirit Photography (1860s) → Photo Retouching (1900s) → Photoshop (1990s) → Deepfakes (2010s–present).",
               "*“Every generation faces a new form of visual deception — and every generation thinks THEY can spot the fakes. In the 1860s, thousands paid money for photographs of ghosts they believed were real. They weren’t stupid — they were trusting. Photography was new technology, and they didn’t know it could be manipulated. WE are in exactly the same position today with AI-generated content.”*"]}),
    ("section", {"label": "The SIFT method: Professional verification · 10 minutes",
      "body": ["Introduce the SIFT method, developed by digital literacy expert Mike Caulfield:"]}),
    steps([
      ("S", "STOP", "Before you share, react, or use the information — pause. Don’t let emotion drive action."),
      ("I", "INVESTIGATE the source", "What do you know about this website, author, or organization? Take 30 seconds to find out WHO is behind the content."),
      ("F", "FIND better coverage", "Can you find the same claim elsewhere? Check if reputable sources cover this story."),
      ("T", "TRACE to the original", "Where did this information ACTUALLY come from? Follow the chain to the primary source.")]),
    P("<i>“This is what professional fact-checkers do. The key insight is LATERAL READING — instead of reading deeply on a suspicious site, you leave it immediately and search for information ABOUT that source.”</i>"),
    ("section", {"label": "Mini Museum connection: The psychology of belief · 5 minutes",
      "body": ["Reference the exhibition. William Mumler was put on trial for fraud in 1869 but acquitted — not because innocent, but because prosecution couldn’t prove HOW he faked photos."],
      "list": ["**Why were grieving families especially vulnerable?** (Emotional state, motivated reasoning)",
               "**How does this connect to modern misinformation?** (We believe what we WANT to believe)",
               "**What would have helped Victorians verify?** (Consulting experts, comparing work — lateral reading)"]}),
    ("section", {"label": "Activity: SIFT in action · 12 minutes",
      "body": ["Present 3–4 examples of varying reliability:"],
      "list": ["A viral social media post claiming a celebrity said something shocking (no source link)",
               "A Wikipedia article on a scientific topic",
               "A news story from an unfamiliar website",
               "A spirit photograph from 1870 (historical application)"]}),
    P("For each: <b>S</b> (What’s your emotional reaction?), <b>I</b> (What can you find about this source?), <b>F</b> (Who else covers this?), <b>T</b> (Can you trace to primary source?)"),
    ("section", {"label": "Closing: Your responsibility · 3 minutes",
      "body": ["*“You are growing up in the first generation where anyone can create convincing fake video and audio. These skills work across ALL media. Lateral reading, source checking, and emotional awareness will never become obsolete.”*"]}),
    ("connection", ["**Option 1 — Visit:** The exhibition provides a perfect case study for visual deception exploiting psychological vulnerabilities. Spirit photography targeted grief; deepfakes target political division.",
                    "**Option 2 — Virtual:** Explore the exhibition online."]),
    ("section", {"label": "Differentiated student handouts"}),
    ("levels", {
      "green": "SIFT reference guide with scaffolded source evaluation.",
      "yellow": "Independent SIFT analysis of multiple sources with explanation.",
      "red": "Research project on deepfakes; create verification guide for peers."}),
    ("section", {"label": "Assessment", "list": [
      "**Application:** Can students correctly apply all four SIFT steps to a novel source?",
      "**Analysis:** Can students explain WHY lateral reading works better than reading deeply on a suspicious site?",
      "**Exit ticket:** *“Explain the connection between spirit photography and modern misinformation.”*"]}),
  ], css=" .timing span { letter-spacing: .06em; } .hero { height: 2.05in; } .step { padding: 6pt 9pt 2pt; } .step h4 { font-size: 10.5pt; } .step .sl { font-size: 18pt; } .step p { font-size: 8.7pt; line-height: 1.35; } .sec { margin-bottom: 6pt; } li { margin-bottom: 1.5pt; } .levels { margin-bottom: 6pt; } .conn { margin-bottom: 6pt; }")

SIFT_SHORT = steps([
  ("S", "STOP", "Pause before you react or share"),
  ("I", "INVESTIGATE", "Who created this? What’s their reputation?"),
  ("F", "FIND", "Can you find this claim covered elsewhere?"),
  ("T", "TRACE", "Where did this information originally come from?")])

def sift_table(rows):
    return ("table", {"head": ["SIFT step", "Your answer"], "rows": [[r, ""] for r in rows]})

G68_GREEN = handout(G68 + "Student Handout_ Seeing Through Deception - Green Level (Library 6-8).pdf", G68_TITLE,
  "Grades 6–8 · Library", "Library 6–8", "green", HERO_68, [
    SIFT_SHORT,
    ("task", {"label": "Practice 1", "title": "Evaluate this source", "blocks": [
      P("<b>Source:</b> A social media post says “Scientists announce chocolate cures all diseases!” with a link to a website called “HealthNewsToday.net” you’ve never heard of."),
      sift_table(["**S – STOP:** What’s your first reaction? Write it, then pause.",
                  "**I – INVESTIGATE:** What would you search to learn about this source?",
                  "**F – FIND:** Where could you look for other coverage of this claim?",
                  "**T – TRACE:** What original source would need to exist for this to be true?"]),
      verdict()]}),
    ("pagebreak", None),
    ("task", {"label": "Practice 2", "title": "Evaluate another source", "blocks": [
      P("<b>Source:</b> An article from your local newspaper’s website about a new school policy, with the reporter’s name and contact information included."),
      sift_table(["**S – STOP:** What’s your first reaction?",
                  "**I – INVESTIGATE:** What do you know about this source?",
                  "**F – FIND:** Could you verify this elsewhere?"]),
      verdict()]}),
    conn(["Spirit photographers in the 1860s exploited people who didn’t know photos could be faked. Today, many don’t know videos can be faked (deepfakes). The lesson: always verify before you trust!"], LAB),
    ("family", ["Teach someone in your family the SIFT method. Practice it together on something you see online."]),
  ], context=["**The SIFT method.** Professional fact-checkers use these four steps to verify information. You can too!"],
  css="table.fill td { padding-bottom: 26pt; } table.fill td:first-child { width: 46%; } .pb ~ .task table.fill td { padding-bottom: 110pt; } .pills em { margin-right: 4pt; }")

G68_YELLOW = handout(G68 + "Student Handout_ Seeing Through Deception - Yellow Level (Library 6-8).pdf", G68_TITLE,
  "Grades 6–8 · Library", "Library 6–8", "yellow", HERO_68, [
    ("task", {"label": "Part 1", "title": "Evaluate three sources", "blocks": [
      P("Apply the SIFT method to each source:"),
      ("table", {"head": ["Source", "I: What did you find about this source?", "F: Who else covers this?", "Verdict"], "rows": [
        ["A viral tweet with “breaking news” but no link", "", "", ""],
        ["A Wikipedia article about a historical event", "", "", ""],
        ["A blog post with strong opinions and no citations", "", "", ""]]})]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "Historical analysis", "blocks": [
      qa("How could Victorians have used “lateral reading” to verify spirit photographs?", 3),
      qa("Why didn’t they? What psychological factors made them want to believe?", 3),
      qa("What modern misinformation exploits similar psychological vulnerabilities?", 3)]}),
    ("task", {"label": "Part 3", "title": "Key insight", "blocks": [
      qa("Why does lateral reading work better than reading deeply on a suspicious site?", 3)]}),
    conn(["Spirit photography targeted grief; deepfakes target political division and sensationalism. The TECHNOLOGY changes but the HUMAN responses remain constant — making critical evaluation skills timeless."], LAB),
    ("family", ["Find something online that seems suspicious. Walk your family through the SIFT process to evaluate it together."]),
  ], context=["**Lateral reading in practice.** Professional fact-checkers don’t read suspicious sources deeply — they leave the site immediately and search for information ABOUT that source. This is called lateral reading."],
  css="table.fill td { padding-bottom: 66pt; } table.fill td:first-child { width: 25%; } table.fill td:nth-child(4) { width: 14%; }")

G68_RED = handout(G68 + "Student Handout_ Seeing Through Deception - Red Level (Library 6-8).pdf", G68_TITLE,
  "Grades 6–8 · Library", "Library 6–8", "red", HERO_68, [
    ("task", {"label": "Part 1", "title": "Research: Understanding deepfakes", "blocks": [
      P("Research deepfake technology and answer:"),
      qa("What is a deepfake and how is it created?", 4),
      qa("What are current methods for detecting deepfakes?", 4),
      qa("Why might detection become harder over time?", 4)]}),
    ("pagebreak", None),
    ("task", {"label": "Part 2", "title": "Create a verification guide", "blocks": [
      P("Design a guide for your peers on how to evaluate visual media. Include:"),
      ("html", '<ul class="circles box"><li>At least 3 red flags that suggest an image/video might be fake</li>'
               '<li>3 steps they should take before believing visual content</li>'
               '<li>2–3 resources for verification (reverse image search, fact-checking sites)</li>'
               '<li>One historical example showing this isn’t a new problem</li></ul>'),
      ("draw", "Outline your guide here")]}),
    ("task", {"label": "Part 3", "title": "Critical question",
              "body": ["If deepfake technology becomes perfect — completely undetectable — what skills will still protect people from being deceived? In other words, what verification methods are technology-proof?"], "lines": 3}),
    ("html", '<aside class="conn"><p class="label">Mini Museum deep dive</p>'
             '<p>William Mumler was acquitted in 1869 because prosecutors couldn’t prove HOW he faked photos. As AI improves, we may face the same problem.</p>'
             '<p><b>How should society handle deception that can’t be technically proven?</b></p>'
             '<div class="write">' + "<i></i>" * 2 + f'</div><p class="url">{LAB}</p></aside>'),
    ("family", ["Present your verification guide to your family. Discuss: What online content has fooled you or them? How could these methods have helped?"]),
  ], context=["**The evolution of visual deception.** From daguerreotypes to deepfakes, each generation faces new forms of visual manipulation — and each generation believes they’re too smart to be fooled."],
  css=".drawbox { height: 150pt; }")

DOCS = [PK_PLAN, PK_GREEN, PK_YELLOW, PK_RED,
        G12_PLAN, G12_GREEN, G12_YELLOW, G12_RED,
        G35_PLAN, G35_GREEN, G35_YELLOW, G35_RED,
        G68_PLAN, G68_GREEN, G68_YELLOW, G68_RED]
