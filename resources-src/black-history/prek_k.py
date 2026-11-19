"""PreK–Kindergarten · "A Doll Like Me"
Poster 2, The Importance of Black Barbie, and the Design a doll tab of the
Who Do You See? room. Facts follow app/exhibitions/black-history/
blackHistory.ts (poster 2) and representation/dollArt.ts (the choices).

For this age the story is told as a celebration: every child should be able
to find a doll that looks like them. Skin color is talked about only as one of
the many ways people look different, never as better or worse. The Doll
Test is for older students and is not mentioned here."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/prek-k/"
TITLE = "A Doll Like Me"
SUB = "PreK–Kindergarten · The Importance of Black Barbie"
HERO = HERO_RING

# Said in the plan and shown on the classroom screen, so written once.
TALK = "Why do you think it matters for children to see toys that look like them?"   # poster 2's own talk question
STORY_WORDS = "The first Black Barbie\n1980\nDesigned by Kitty Black Perkins"
SHARE = "Hold up your doll. Tell a partner one thing about it: its hair, its clothes, or something special."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("name ways that people, and dolls, can look different: skin, hair, clothes, glasses",
     "name ways that people and dolls can look different?", False),
    ("say why every child should be able to find a doll that looks like them",
     "say why every child needs a doll like them?", False),
    ("design a doll and tell a friend about it",
     "design a doll and tell us about it?", False)],
  "why": "A doll that looks like you says: you are beautiful just as you are. In 1980 the first Black Barbie said that to many Black children.",
  "screen": {"heading": "I can…", "items": [
    "name ways people look different",
    "say why every child needs a doll like them",
    "design a doll and tell about it"]}}

# drawn dolls in the Design a doll tab's own skin and hair colors
def kit(h):
    return {"afro": doll("t2", "afro", "black", "#E8372C", h=h),
            "puffs": doll("t1", "puffs", "black", "#F28C28", h=h),
            "braids": doll("t3", "braids", "darkbrown", "#2E8B57", h=h),
            "glasses": doll("t4", "short", "darkbrown", "#EE8DBF", glasses=True, h=h),
            "long": doll("t7", "long", "auburn", "#5B8DB8", h=h),
            "bun": doll("t5", "bun", "black", "#C9A84C", h=h)}
K96, K104, K120 = kit(96), kit(104), kit(120)
D_AFRO, D_PUFFS, D_BRAIDS, D_GLASSES = K104["afro"], K104["puffs"], K104["braids"], K104["glasses"]

CSS = DOLL_CSS + """
.nums { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.nums span { width: 46pt; height: 46pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 30pt/1 'Cormorant Garamond', serif; }
.bigdoll { display: flex; justify-content: center; margin: 2pt 0 6pt; }
.bigdoll svg { background: rgba(255,255,255,.55); border-radius: 8pt; padding: 6pt 30pt; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 34pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
.blank3 { display: flex; justify-content: center; gap: 22pt; }
"""

NUMS = '<div class="nums"><span>2</span><span>3</span><span>4</span></div>'
def big_outline(h=250, bald=False):
    return f'<div class="bigdoll">{doll(None, "short", h=h, bald=bald)}</div>'
def trace(word, model=False, rows=1):
    first = f'<div><span class="{"model" if model else ""}">{word}</span></div>'
    return '<div class="trace">' + first + "<div></div>" * (rows - 1) + "</div>"

# ── on the classroom screen ────────────────────────────────────────────
HAIR_GALLERY = [{"label": "Natural hairstyles", "text": "From the Design a doll tab of *Who Do You See?*",
                 "items": [dict(h, aspect=1) for h in HAIRSTYLES]}]

LESSON = {
  "slug": "a-doll-like-me", "large": True,
  "out": DIR + "BH_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO,
  "css": CSS + HERO_CSS + OBJ_CSS + FLOW_CSS + CHART_CSS + "body { line-height: 1.46; } .cards { margin-bottom: 8pt; }",
  "blocks": [
    ("timing", [("Circle time", 4, C_HOOK), ("The story", 6, C_TEACH), ("Look closely", 3, C_LOOK),
                ("Activity", 9, C_ACT), ("Close", 3, C_CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "Three or four dolls or toy figures from your classroom, as different from one another as you have",
      "The *Who Do You See?* room on a screen, open at **Design a doll**",
      "The *Show your class* page (page 3), projected or printed",
      "Crayons in many skin and hair colors, and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will notice that people, and dolls, look different in many ways, and that every child should be able to find a doll that looks like them. They will hear that the first Black Barbie, made in 1980, was designed by Kitty Black Perkins, a Black fashion designer, with natural hairstyles, Afrocentric facial features and a glamorous design that celebrated Black beauty. Then they will design a doll of their own."]}),
               ("section", {"label": "Themes", "list": [
      "**Social Studies** — Black History Month; people who made a difference; ways we are alike and different",
      "**Social-emotional learning** — belonging; seeing yourself, and others, with pride",
      "**Early learning** — counting to four; describing with color and shape words; fine motor skills (coloring, drawing, tracing); listening and retelling",
      "**The exhibition** — poster 2, *The Importance of Black Barbie*, and *Who Do You See?*"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "Who do our dolls look like?",
      "screen": {"phase": "Circle time", "show": "question", "question": "Who do our dolls look like?",
                 "purpose": "Look at real dolls before any story, and notice how they are alike and different.",
                 "students": ["Look at our dolls.", "How are they the same? How are they different?"]},
      "body": ["Sit in a circle and set the classroom dolls in the middle. Let the children look, then ask: *“How are these dolls the same? How are they different?”* Collect their words: hair, skin, eyes, clothes, size. Then wonder aloud: *“What if every doll in the toy shop looked exactly the same? Who would be left out?”*"]}),
    ("section", {"label": "The story · 6 minutes", "title": "The first Black Barbie",
      "screen": [
        {"phase": "The story", "minutes": 3, "script": [0], "title": "The first Black Barbie", "show": "words",
         "text": STORY_WORDS, "cite": "The Importance of Black Barbie",
         "purpose": "Hear the true story: a designer made a doll so Black children could see themselves.",
         "students": ["Listen to the story.", "Who designed the doll?"]},
        {"phase": "The story", "minutes": 3, "script": [1], "title": "A doll like me", "show": "question", "question": TALK,
         "purpose": "Turn the story into the big idea: every child deserves a doll that looks like them.",
         "students": ["Turn to a partner.", "Why does it matter?"]}],
      "body": [
        "Tell the story simply. *“A long time ago, in 1980, a toy company called Mattel made a new doll: the very first Black Barbie. A woman named Kitty Black Perkins designed her. A designer is the person who decides how something will look. Kitty Black Perkins was a Black fashion designer. She gave the doll natural hairstyles, and a glamorous design that celebrated Black beauty.”*",
        "Then ask the poster’s own question: *“" + TALK + "”* Let children answer with a partner, then share. Help them to the idea: *every child should be able to find a doll that looks like them, and dolls that look like everyone help us all feel we belong.*"]}),
    ("section", {"label": "Look closely · 3 minutes", "title": "So many kinds of hair",
      "screen": {"phase": "Look closely", "show": "gallery", "groups": HAIR_GALLERY,
                 "purpose": "Look closely at natural hairstyles: the first Black Barbie was made with natural hair.",
                 "students": ["Which hairstyles have you seen?", "Which would you give your doll?"]},
      "body": ["Show the hairstyles from the *Design a doll* tab: an Afro, Afro puffs, Bantu knots, box braids, cornrows, locs and twists. *“The first Black Barbie had natural hair. Which of these have you seen? Which would you choose for a doll?”* If you have time, choose one or two things together in **Design a doll** (skin, hair, glasses, clothes) and watch the doll change."]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Notice differences and design a doll on paper, at the right level for each child.",
                 "students": ["Find the dolls on your page. Then make a doll of your own."]},
      "body": ["Each child works on a handout. All three show the same dolls, and all three end with a doll the child designs."]}),
    ("levels", {
      "green": "Picture-led. Count the dolls and circle the number, circle the doll who wears glasses, color a doll to look like you or someone you love, and trace *ME*.",
      "yellow": "A little more. Count the dolls, draw a different hairstyle on each of three dolls, color a doll of their own, and copy *ME* under a model.",
      "red": "Draw and tell. Tell a grown-up how the dolls are different, design a doll of their own from head to toe, and finish *My doll has…* aloud or in writing."}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        {"phase": "Close", "minutes": 1, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Share your doll", "show": "question", "question": SHARE,
         "purpose": "Celebrate every doll: each one looks like someone.",
         "students": ["Hold up your doll.", "Tell a partner one thing about it."]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               "Then say: *“" + SHARE + "”* Finish with a celebration: *every doll here looks like someone, and every one of you belongs.*"]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Talking about looking different",
      "body": [
        "**Name differences with pride.** Young children notice skin color, hair and glasses, and they often say so. Answer plainly and warmly: *“Yes, her skin is dark brown. Isn’t it beautiful?”* Treat every difference as something to enjoy, never as better or worse.",
        "**Let every child choose.** Some children will make a doll that looks like them; some will make one like a parent, a friend or someone they imagine. All are good choices.",
        "**Why this story.** Poster 2 says the first Black Barbie offered Black children *a doll that reflected their identity and celebrated their cultural heritage*. That is the whole lesson in one line."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child name two ways the dolls are different?",
      "Can the child say, in their own words, why every child should find a doll that looks like them?",
      "Can the child tell a partner one thing about the doll they designed?"]}),
     ("connection", ["**Visit the exhibition:** look at poster 2, *The Importance of Black Barbie*, together. Count the circles. What colors can you find?",
                     "**Virtual visit:** in *Who Do You See?*, the **Design a doll** tab lets children choose skin, hair, clothes, glasses, a hearing aid or a wheelchair."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The first Black Barbie, 1980",
                 "body": ["Project or print this page for the story, or take it to poster 2. Every fact here comes from the poster *The Importance of Black Barbie*."]}),
    ("cards", [
      ("In 1980", ["Mattel introduced the first Black Barbie doll."]),
      ("Kitty Black Perkins", ["A Black fashion designer at Mattel, she designed the first Black Barbie."]),
      ("Natural hairstyles", ["The doll had natural hairstyles, Afrocentric facial features and a glamorous design that celebrated Black beauty."]),
      ("A doll like me", ["The doll offered Black children a doll that reflected their identity and celebrated their cultural heritage."])]),
    ("html", '<div class="dolls" style="gap:16pt">' + "".join(
        f'<figure>{K120[k]}<figcaption>{c}</figcaption></figure>' for k, c in [
          ("afro", "Afro"), ("puffs", "Afro puffs"), ("braids", "Braids"), ("glasses", "Glasses"), ("long", "Long hair"), ("bun", "A bun")]) + "</div>"),
    ("section", {"label": "Words to use", "list": [
      "**Designer** — the person who decides how something will look",
      "**Natural hair** — hair worn as it grows, in styles like an Afro, puffs, braids, twists or locs",
      "**Celebrate** — to show that something is special and wonderful"]}),
    ("section", {"label": "Questions to ask the children", "list": [
      "How many dolls can you see? Let’s count them together.",
      "How are these dolls different from each other? How are they the same?",
      "Who designed the first Black Barbie?",
      "If you designed a doll, what would it look like?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** Long ago, in 1980, a designer named Kitty Black Perkins made the first Black Barbie. She gave the doll natural hair and a design that celebrated Black beauty. Every child should be able to find a doll that looks like them."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + HERO_CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

THREE = dolls([K96["afro"], K96["puffs"], K96["glasses"]])
FOUR = dolls([K96["braids"], K96["glasses"], K96["afro"], K96["long"]])

GREEN = handout("green", "BH_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the dolls. Circle the number.",
            "blocks": [FOUR, ("html", NUMS)]}),
  ("task", {"label": "Part 2", "title": "Circle the doll who wears glasses.",
            "blocks": [THREE]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Color the doll to look like you, or like someone you love.",
            "blocks": [("html", big_outline(290))]}),
  ("task", {"label": "Part 4", "title": "Trace the word.",
            "blocks": [("html", trace("ME", rows=2).replace("<div></div>", "<div><span>ME</span></div>"))]}),
  ("family", ["Look at the toys at home together. Ask your child: *who do these toys look like? Is there a toy that looks like you?*"]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "How many dolls? Circle the number.",
            "blocks": [FOUR, ("html", NUMS)]}),
  ("task", {"label": "Part 2", "title": "Draw hair on each doll. Make each one different.",
            "blocks": [("html", '<div class="dolls">' + "".join(doll(None, h=128, bald=True) for _ in range(3)) + "</div>")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Color a doll of your own.",
            "blocks": [("html", big_outline(270))]}),
  ("task", {"label": "Part 4", "title": "Copy the word.",
            "blocks": [("html", trace("ME", model=True, rows=2))]}),
  ("family", ["Look at the toys at home together. Ask: *who do our toys look like? Who is missing?* Draw a toy you wish you had."]),
])

RED = handout("red", "BH_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Look at the dolls. Tell a grown-up two ways they are different.",
            "blocks": [dolls([K96["afro"], K96["puffs"], K96["braids"], K96["glasses"]])]}),
  ("task", {"label": "Part 2", "title": "The first Black Barbie had natural hair. Draw natural hair on this doll.",
            "blocks": [("html", big_outline(150, bald=True))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Kitty Black Perkins designed a doll. Now you are the designer! Draw your doll from head to toe: hair, face, clothes, and something special.",
            "blocks": [("draw", "My doll")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">My doll has</span></div><div></div></div>')]}),
  ("family", ["Ask your child about the doll they designed. Then talk together: *why does it matter that every child can find a doll that looks like them?*"]),
], "body.young .drawbox { height: 250pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
