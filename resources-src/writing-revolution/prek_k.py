"""PreK–Kindergarten · "Clack, Clack, Ding!"
The sounds of writing, the typewriter's round keys and how a typewriter
works, in a child's words. Facts follow app/exhibitions/writing-revolution/
writingRevolution.ts (the posters and the display case) and the Typing
Station (typing-station/stationText.ts, typewriterPage.ts): a key strikes a
letter, the bell rings near the end of the line, the carriage is returned.

The keyboard drawn here is QWERTY, as the Typing Station's is. The Urania on
the posters is a different keyboard (its letter rows read QWERTZ…): it is
shown only to look at round keys, never to find T, Y, P and E."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)

DIR = "teachers/prek-k/"
TITLE = "Clack, Clack, Ding!"
SUB = "PreK–Kindergarten · The typewriter and its keys"

HERO = W.HERO_P2_KEYS
HERO_HANDOUT = W.HERO_P1_URANIA

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "What is making that sound?"
SHARE = "Long ago, only a few people could write. Now you can! Tell a partner: if you could send a message to anyone, who would it be for?"
GAME = ("Now everyone is a typewriter. Tap your fingers on your knees: *clack, clack, clack.* Lean as the line runs out, "
        "call *“Ding!”* together, and push the carriage back with one big sweep of the arm: *swoosh!* Play it two or three times.")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("listen to the sounds of writing tools and pick out the typewriter",
     "pick out the typewriter’s sound?", False),
    ("find letters on a typewriter’s keys, and the four letters of *TYPE* on the top row",
     "find T, Y, P and E on the keys?", False),
    ("say how a typewriter works: press a key, hear the bell, push the carriage back",
     "say how a typewriter works?", False)],
  "why": "Long ago, only a few people could write. Machines like the typewriter helped many more people write and share their ideas.",
  "screen": {"heading": "I can…", "items": [
    "hear the typewriter’s clack and ding",
    "find T, Y, P and E on the keys",
    "tell how a typewriter works"]}}

# ── on the classroom screen (Lesson mode; build.py ignores "screen") ─────
TOP_ROW = "  ".join(W.TOP)

CSS = W.KEYS_CSS + """
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 34pt/1 'Outfit'; letter-spacing: .02em; bottom: -3pt; }
.uran { display: flex; justify-content: center; margin: 2pt 0 8pt; }
.uran img { width: 300pt; height: auto; }
.four { display: flex; justify-content: center; gap: 22pt; margin: 4pt 0 10pt; break-inside: avoid; }
.four > div { display: grid; justify-items: center; gap: 8pt; }
.four .k { --k: 56pt; width: 56pt; height: 56pt; font-size: 26pt; }
.four .box { width: 34pt; height: 34pt; border: 1.4pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); }
.steps3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin: 4pt 0 10pt; break-inside: avoid; }
.steps3 > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.65); padding: 8pt 8pt 10pt;
  display: grid; justify-items: center; gap: 6pt; text-align: center; }
.steps3 b { font: 600 22pt/1 'Cormorant Garamond', serif; }
.steps3 p { margin: 0; font-size: 11pt; line-height: 1.3; }
.steps3 .box { width: 34pt; height: 34pt; border: 1.4pt solid #1d1c1a; border-radius: 4pt; background: #fff; }
"""

URANIA_PRINT = f'<div class="uran"><img src="{W.printable(W.URANIA)}" alt=""></div>'


def trace(model=False, rows=1, word="TYPE"):
    first = f'<div><span class="{"model" if model else ""}">{word}</span></div>'
    rest = "<div></div>" * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'


FOUR = ('<div class="four">' + "".join(f'<div><span class="k">{c}</span><span class="box"></span></div>' for c in "PTEY") + "</div>")
STEPS3 = ('<div class="steps3">'
          '<div><b>Ding!</b><p>The bell rings near the end of the line.</p><span class="box"></span></div>'
          '<div><b>Clack!</b><p>Press a key. A letter goes on the paper.</p><span class="box"></span></div>'
          '<div><b>Swoosh!</b><p>Push the carriage back for a new line.</p><span class="box"></span></div></div>')

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "clack-clack-ding", "large": True,
  "out": DIR + "WR_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": CSS + W.OBJ_CSS + "body { line-height: 1.46; }",
  "blocks": [
    ("timing", [("Circle time", 4, W.SAGE), ("Look closely", 5, W.SLATE), ("Try it", 4, W.GREEN),
                ("Activity", 9, W.GOLD), ("Close", 3, W.RUST)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "The Typing Station on a screen, with the sound on",
      "The *Show your class* page (page 3), projected or printed",
      "A pencil and a sheet of paper",
      "Crayons and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will listen to the sounds of writing tools, look closely at a typewriter’s round keys and find letters on them, and act out how a typewriter works. They will meet the exhibition’s big idea in a child’s words: long ago only a few people could write, and new tools helped many more people write and share their ideas."]}),
               ("section", {"label": "Themes", "list": [
      "**Early literacy** — letter names; the word *TYPE*; writing carries a message to someone",
      "**Listening** — telling sounds apart and naming what makes them",
      "**History** — long ago and today: writing by hand, the typewriter, the computer",
      "**Motor skills** — tracing and coloring; tapping, leaning and sweeping in the typewriter game"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "What is making that sound?",
      "screen": {"phase": "Circle time", "show": "listen", "title": "What is making that sound?",
                 "clips": [W.CLIPS["quill"], W.CLIPS["typewriter"], W.CLIPS["keyboard"]], "question": HOOK_Q,
                 "purpose": "Wonder at the sounds before naming the tools: writing can scratch, clack and tap.",
                 "students": ["Close your eyes and listen.", "What is making that sound?"]},
      "body": ["Write a word with a pencil while the children watch. *“People write with other tools too. Close your eyes and listen.”* Play the three sounds one at a time: a quill pen, a typewriter, a computer keyboard. After each, ask: *“" + HOOK_Q + "”* Then tell them. *“Long, long ago, only a few people could write. Then people made machines to help many more people write. Today we meet one of them: the typewriter.”*"]}),
    ("section", {"label": "Look closely · 5 minutes", "title": "Round keys",
      "screen": [
        {"phase": "Look closely", "minutes": 3, "script": [0], "title": "Round keys", "show": "image",
         "img": {"img": W.URANIA}, "alt": W.URANIA_ALT, "fit": "contain",
         "caption": "The Urania typewriter, from the exhibition’s posters",
         "purpose": "Look before being told: a typewriter is rows of keys, and every key is a letter.",
         "students": ["What can you see?", "Point to a key. What letter is on it?"]},
        {"phase": "Look closely", "minutes": 2, "script": [1], "title": "Find T, Y, P, E", "show": "words", "text": TOP_ROW,
         "purpose": "Find four letters in one row, and read the word they make.",
         "students": ["Find T, Y, P and E.", "What word do they make?"]}],
      "body": ["Show the typewriter on page 3, the Urania from the exhibition’s posters. Let the children look first, then ask: *“What can you see?”* Point to the round keys, each with a silver rim and a letter on top: each key makes one letter. Invite children to name a letter they know.",
               "Then show the top row of the keyboard on page 3, the row that starts Q, W, E, R, T, Y. Find **T**, **Y**, **P** and **E** together. *“All four live in the same row. Put them together and they spell TYPE!”*"]}),
    ("section", {"label": "Try it · 4 minutes", "title": "Be a typewriter",
      "screen": {"phase": "Try it", "show": "image", "title": "Be a typewriter",
                 "img": {"img": W.ROOM}, "alt": W.ROOM_ALT, "fit": "contain",
                 "caption": "The Typing Station: a typewriter and an iMac",
                 "purpose": "See and hear a typewriter at work, then act it out with the whole body.",
                 "students": ["Tap, tap, tap: *clack!*", "The bell: *Ding!*", "Push the carriage back: *swoosh!*"]},
      "body": ["Open the Typing Station with the sound on and type *TYPE* on its typewriter, slowly, so the children see each letter land on the paper. Keep typing until the bell rings near the end of the line: *ding!* Then press the carriage return, and the paper moves up to a new line.",
               GAME]}),
    ("section", {"label": "Activity · 9 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Your handout",
                 "purpose": "Find, color and trace the letters at the right level for each child.",
                 "students": ["Find T, Y, P and E on your page."]},
      "body": ["Each child works on a handout. All three have the same keys and the same word: TYPE."]}),
    ("levels", {
      "green": "Picture-led. Look at the typewriter’s round keys, find and color T, Y, P and E on the top row, trace *TYPE*, and draw a picture message.",
      "yellow": "A little writing. Find and color T, Y, P and E, copy *TYPE* under a model, circle the letter their name begins with, and draw who they would write to.",
      "red": "Draw and tell. Number the letters of TYPE in order, put the typewriter’s clack, ding and swoosh in order, then draw a message and say who would read it."}),
    ("section", {"label": "Look back and share · 3 minutes",
      "screen": [
        {**W.review(OBJECTIVES, 1, [0], W.THUMBS), "phase": "Close",
         "purpose": "Check what each child can now do against the objectives."},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Look back and share", "show": "question", "question": SHARE,
         "purpose": "End with the big idea: everyone can write now, and writing is for someone.",
         "students": ["Tell a partner: who would your message be for?"]}],
      "body": ["Put the questions on the screen. For each one, the children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               f"Then say: *“{SHARE}”*"]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "Why the typewriter mattered",
      "body": [
        "**Writing was once for a few.** The exhibition begins: *For thousands of years, writing was a privilege reserved for scribes, monks, and the wealthy elite.* Each new tool let more people write and be read.",
        "**The typewriter.** In 1868, Christopher Latham Sholes patented the first practical typewriter. Each key works a metal arm carrying its letter; for this age it is enough that each key makes one letter.",
        "**The Urania** in the pictures is the typewriter on the posters. A few of its letters sit in different places from ours. If a child notices that its top row has no Y, say *well spotted!* and find TYPE on page 3."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child tell the typewriter’s sound from the others?",
      "Can the child point to T, Y, P and E, and name one more letter?",
      "Can the child show, or say, the three steps: press a key, the bell rings, push the carriage back?"]}),
     ("connection", ["**Visit the exhibition:** the display case holds a portable Smith-Corona Galaxie typewriter and an Apple iMac G3, side by side. Which one is the typewriter? Which one has a screen?",
                     "**Virtual visit:** at the Typing Station, children can type on the typewriter, hear the bell and push the carriage back."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "A typewriter’s keys", "body": ["Project or print this page for circle time and the activity."]}),
    ("html", f'<div class="uran" style="margin-bottom:4pt"><img src="{W.printable(W.URANIA)}" alt="" style="width:340pt"></div>'
             '<p style="text-align:center;font-size:8.5pt;color:#5b5a55;margin-bottom:12pt">The Urania typewriter, from the exhibition’s posters</p>'),
    ("section", {"label": "The top row", "body": ["Find T, Y, P and E. They spell TYPE."]}),
    ("html", W.keys([W.TOP], size=38, mark="TYPE")),
    ("section", {"label": "The sounds of writing", "list": [
      "**A quill pen** — writing by hand, as scribes did long ago",
      "**A typewriter** — the clack of the keys and the ding of the bell",
      "**A computer keyboard** — tap, tap, tap"]}),
    ("section", {"label": "Questions to ask the children", "list": [
      "Which sound was the typewriter? How did you know?",
      "What letter is on this key? Can you find a letter from your name?",
      "When does the typewriter’s bell ring? What do you do then?",
      "Who would you write a message to? What would it say?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["**A grown-up reads this aloud.** Long ago, only a few people could write. Then people made machines to help many more people write. One of them is the typewriter. Press a key, and a letter goes onto the paper: *clack!* Near the end of the line, a bell rings: *ding!*"]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT, "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level",
            "blocks": blocks, "hero": HERO_HANDOUT}


GREEN = handout("green", "WR_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "This is a typewriter. Point to its round keys.",
            "blocks": [("html", URANIA_PRINT)]}),
  ("task", {"label": "Part 2", "title": "Find T, Y, P and E. Color them.",
            "blocks": [("html", W.keys([W.TOP], size=40))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Trace the word.",
            "blocks": [("html", trace(rows=2).replace("<div></div>", "<div><span>TYPE</span></div>"))]}),
  ("task", {"label": "Part 4", "title": "Draw a picture message for someone you love.",
            "blocks": [("draw", "My message")]}),
  ("family", ["Look for letters together on a keyboard, a phone or a remote. Can your child find T, Y, P and E? Then write a short note by hand for someone in your family."]),
], "body.young .drawbox { height: 315pt; }")

YELLOW = handout("yellow", "WR_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Find T, Y, P and E. Color them.",
            "blocks": [("html", W.keys([W.TOP], size=40))]}),
  ("task", {"label": "Part 2", "title": "Copy the word.",
            "blocks": [("html", trace(model=True, rows=3))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Find the first letter of your name. Circle it.",
            "blocks": [("html", W.keys(size=36))]}),
  ("task", {"label": "Part 4", "title": "Who would you write to? Draw them.",
            "blocks": [("draw", "My message is for")]}),
  ("family", ["Ask your child to show you how a typewriter works: tap the keys, say *ding!*, then push the carriage back. Then write a message together, and send it to someone."]),
], "body.young .drawbox { height: 275pt; }")

RED = handout("red", "WR_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "These keys spell TYPE. Write 1, 2, 3, 4 in the boxes, in the order of the word.",
            "blocks": [("html", FOUR)]}),
  ("task", {"label": "Part 2", "title": "How does a typewriter work? Write 1, 2, 3 in the boxes.",
            "blocks": [("html", STEPS3)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw a message. Who will read it?",
            "blocks": [("draw", "My message")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">My message is for</span></div><div></div></div>')]}),
  ("family", ["Ask your child: *long ago, only a few people could write. Who can write now?* Then let your child dictate a message while you write it down, and read it back together."]),
], "body.young .drawbox { height: 290pt; } .steps3 > div { padding: 12pt 8pt 14pt; } .four { margin: 10pt 0 16pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
