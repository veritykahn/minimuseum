"""Grades 1–2 · "Write Like a Scribe"
Your Name in Hieroglyphs, with a look at the top of the Rosetta Stone: signs
that are pictures but stand for sounds, a royal name in its oval cartouche,
the end line, the way to read, and a scribe's way of writing (consonants
only). Facts follow app/exhibitions/egypt/hieroglyph-name/alphabet.ts (the
Egypt Exploration Society's chart and the room's notes), hieroglyph-name/
page.tsx (the room's intro), rooms.ts (what each sign shows),
rosetta-stone/rosetta.ts (Ptolemy's cartouche, sign by sign) and egypt.ts
(poster 1: hieroglyphic writing, the way to read, the Rosetta Stone).

The chart is a modern sound-alike, and the lesson says so, as the room does.
The words children read are spelled with the chart, never King Ptolemy's
real cartouche (its m and i are other signs), which they only look at."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (STONE_TOP, STONE_CREDIT, ROOM, OBJ_CSS, SIGN_CSS, HOOK, TEACH, ACT, CLOSE, THUMBS,
                  g, spell, chart_html, cartouche, crop, review, md)

DIR = "teachers/grades-1-2/"
TITLE = "Write Like a Scribe"
SUB = "Grades 1–2 · Your Name in Hieroglyphs · Signs, sounds and a royal oval"
HERO = {"img": STONE_TOP, "pos": "center 40%", "credit": STONE_CREDIT}

# King Ptolemy's name as rosetta.ts sets it: P T O L M I S
PTOLEMY = "".join(g(c) for c in ["Q3", "X1", "V4", "E23", "Aa15", "M17A", "S29"])

# the room's words (hieroglyph-name/page.tsx INTRO; alphabet.ts NAME_NOTES)
INTRO = "In ancient Egypt, the names of kings and queens were written in hieroglyphs. Each royal name was ringed by an oval, called a cartouche."
SHARE = "Say your name the scribe’s way, with the vowels left out."
CLOSE_SHARE = ("Show the room again, with its second cartouche. *“An Egyptian scribe would have left the vowels out, writing only the consonants.”* "
               "Ask: *“" + SHARE + "”* Children try it with a partner.")

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say what some hieroglyph signs are pictures of, and the sound each one stands for",
     "say what a sign shows, and the sound it stands for?", False),
    ("read a short word written in hieroglyphs, using the chart",
     "read a word written in hieroglyphs?", False),
    ("write my name sign by sign inside a cartouche, with the line that marks its end",
     "write your name in a cartouche, with its end line?", False),
    ("explain that our chart is a modern sound-alike: an Egyptian scribe wrote only the consonants",
     "say what an Egyptian scribe would leave out?", True)],
  "why": "Hieroglyphs look like pictures, but most of the signs we use today stand for sounds. Knowing that turns a wall of birds, snakes and loaves into words we can read.",
  "screen": {"heading": "I can…", "items": [
    "say what a sign shows, and its sound",
    "read a word in hieroglyphs",
    "write my name in a cartouche",
    "say what a scribe would leave out"]}}

# the signs the class meets first, from the chart (rooms.ts names what each shows)
FIRST = [("an owl", "G17", "M"), ("a lion, lying down", "E23", "L"), ("a mouth", "D21", "R"),
         ("a ripple of water", "N35", "N"), ("a hand", "D46", "D"), ("a foot and lower leg", "D58", "B"),
         ("a half loaf of bread", "X1", "T"), ("an Egyptian vulture", "G1", "A")]

CSS = SIGN_CSS + """
.pb { break-after: auto; break-before: page; height: 0; }
.word { display: flex; gap: 8pt; justify-content: center; margin: 4pt 0 10pt; break-inside: avoid; }
.word div { display: grid; justify-items: center; gap: 4pt; }
.word .hg { font-size: 46pt; height: 50pt; display: flex; align-items: flex-end; }
.word i { width: 32pt; height: 30pt; border: 1.2pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.7);
  font: 500 17pt/30pt 'Outfit'; font-style: normal; text-align: center; }
.word.small .hg { font-size: 38pt; height: 42pt; } .word.small i { width: 26pt; height: 25pt; line-height: 25pt; font-size: 14pt; }
.word .eq { align-self: end; font: 400 18pt/30pt 'Outfit'; margin: 0 4pt; }
.words2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
.sm { display: grid; grid-template-columns: repeat(4, 1fr); row-gap: 46pt; margin: 6pt 0 8pt; break-inside: avoid; }
.sm div { display: grid; justify-items: center; gap: 5pt; }
.sm .hg { font-size: 46pt; height: 50pt; display: flex; align-items: center; }
.sm i { width: 11pt; height: 11pt; border-radius: 50%; background: #1d1c1a; }
.sm .w span { font: 500 13pt 'Outfit'; border: 1.2pt solid #1d1c1a; border-radius: 6pt; padding: 4pt 10pt; background: rgba(255,255,255,.65); }
.way { display: flex; gap: 18pt; justify-content: center; align-items: center; margin: 4pt 0 8pt; font: 500 12pt 'Outfit'; break-inside: avoid; }
.way span { border: 1.2pt solid #1d1c1a; border-radius: 99pt; padding: 4pt 12pt; background: rgba(255,255,255,.65); }
.namebox { margin: 2pt 0 4pt; }
.cart.empty { width: 380pt; height: 70pt; }
.cart.mid { width: 300pt; height: 56pt; }
.cart .hg { font-size: 44pt; }
.signchart .hg { font-size: 27pt; height: 29pt; } .signchart.small .hg { font-size: 22pt; height: 25pt; }
.signchart div { padding: 2pt 0 1pt; }
"""

SHOW_CSS = """
.stone { display: flex; gap: 14pt; align-items: center; margin: 4pt 0 10pt; break-inside: avoid; }
.stone p { font-size: 10pt; }
.first { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; margin: 4pt 0 10pt; }
.first div { border: .8pt solid #8d8a80; border-radius: 4pt; text-align: center; padding: 5pt 2pt 4pt; background: rgba(255,255,255,.6); }
.first .hg { display: block; font-size: 30pt; height: 34pt; }
.first b { font: 500 11pt 'Outfit'; } .first small { display: block; font-size: 8pt; color: #5b5a55; }
"""

def word(w, given=0, small=False, cls=""):
    """A word sign by sign, each above a box; the first `given` boxes filled in."""
    cells = "".join(f'<div><span class="hg">{gl}</span><i>{k if n < given else ""}</i></div>'
                    for n, (k, gl) in enumerate(spell(w)))
    return f'<div class="word{" small" if small else ""} {cls}">{cells}</div>'

def first_signs():
    return '<div class="first">' + "".join(
        f'<div><span class="hg">{g(c)}</span><b>{s}</b><small>{what}</small></div>' for what, c, s in FIRST) + "</div>"

# ── lesson mode ────────────────────────────────────────────────────────
STONE_SCREEN = {"img": STONE_TOP, "credit": STONE_CREDIT}
STONE_ALT = "The top of the Rosetta Stone: rows of tiny carved hieroglyphs, birds, people, snakes and loaves, on dark gray stone, with an oval ringing a few signs"
ROOM_ALT = "The Your Name in Hieroglyphs room: the name Cleopatra in gold signs inside a cartouche, each sign above its letter, and below it the same name written with consonants only"

LESSON = {
  "slug": "write-like-a-scribe", "large": True,
  "out": DIR + "EGY_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": CSS + OBJ_CSS + SHOW_CSS,
  "blocks": [
    ("timing", [("Hook", 4, HOOK), ("Signs and sounds", 10, TEACH), ("Activity", 12, ACT), ("Close", 4, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What children will understand",
        "body": ["Children will find that the little pictures carved on the Rosetta Stone are writing, called hieroglyphs, and that many signs stand for sounds: an owl for *m*, a lion for *l*. Using the chart from the exhibition’s *Your Name in Hieroglyphs* room, they will read short words, then write their own names inside a cartouche, the oval that ringed the names of Egypt’s kings and queens."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**ELA** — letters and sounds; reading left to right and right to left; writing my name",
        "**Social Studies** — writing long ago; kings and queens of ancient Egypt",
        "**Art** — signs drawn from animals, the body and everyday things",
        "**Thinking** — a code: a picture that stands for a sound"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the stone, the first eight signs and King Ptolemy’s cartouche",
      "The whole sign chart, on page 1 of every handout",
      "Differentiated handouts, one per child; pencils and crayons in gold, yellow or orange"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "A stone full of pictures",
      "screen": {"phase": "Hook", "show": "image", "img": STONE_SCREEN, "alt": STONE_ALT, "fit": "cover",
                 "caption": "The top of the Rosetta Stone",
                 "purpose": "Look before anyone explains: find the pictures, and the oval.",
                 "students": ["Find a bird. Find a person. Find a snake.", "Can you find an oval with signs inside it?"]},
      "body": ["Show the top of the stone on page 3. Ask: *“What pictures can you find carved here?”* Children call out birds, people, snakes, loaves. Then ask them to find an **oval** with signs inside it.",
               "*“These pictures are writing. They are called hieroglyphs. This stone was carved more than two thousand years ago, in Egypt.”*"]}),
    ("section", {"label": "Signs and sounds · 10 minutes",
      "screen": [
        {"phase": "Signs and sounds", "minutes": 4, "script": [0], "title": "A picture for a sound", "show": "chart",
         "caption": "Eight signs from the chart", "columns": ["The sign is a picture of", "Say"],
         "rows": [{"cells": [what, s]} for what, _, s in FIRST],
         "purpose": "Meet the first signs: each is a picture, and each stands for a sound.",
         "students": ["Which sign is a lion? What sound does it make?", "I say a sound. You point to its sign."]},
        {"phase": "Signs and sounds", "minutes": 4, "script": [1], "title": "A name in an oval", "show": "image",
         "img": {"img": ROOM["hieroglyph-name"]}, "alt": ROOM_ALT, "fit": "contain",
         "caption": "Your Name in Hieroglyphs: a name, sign by sign, inside a cartouche",
         "purpose": "See a name written sign by sign, inside a cartouche with its end line.",
         "students": ["Find the lion. What sound is it?", "Find the line at the end of the oval."]},
        {"phase": "Signs and sounds", "minutes": 2, "script": [2], "title": "Which way to read", "show": "words",
         "text": "Look at the people and animals.\nIf they face right, read from right to left.",
         "purpose": "Learn the way to read: follow the faces.",
         "students": ["Which way does the owl face?", "Which way do we read?"]}],
      "body": ["Show the first eight signs on page 3. *“Each sign is a picture of something, but it stands for a sound. The owl says* m*. The lion says* l*.”* Play a quick game: say a sound and children point to its sign; point to a sign and they say its sound.",
               "Read the room’s own words: *“" + INTRO + "”* Show the room on the screen and King Ptolemy’s name on page 3. Children find the lion and the loaf of bread. Point out the straight **line** at one end: it marks the end of the name.",
               "*“Which way do we read?”* Look at the people and animals: if they face right, read from right to left. (Signs could also run in columns, always top to bottom.) On our handouts the animals face left, so we read left to right."]}),
    ("section", {"label": "Activity · 12 minutes",
      "screen": [
        {"phase": "Activity", "minutes": 3, "script": [0], "title": "Read it together", "show": "question",
         "question": "A ripple of water, a reed, a lion, two reeds. What word is it?",
         "purpose": "Read one word together before working alone.",
         "students": ["Find each sign on the chart.", "Say its sound. Put the sounds together."]},
        {"phase": "Activity", "minutes": 9, "script": [1], "title": "Your handout", "show": "levels",
         "purpose": "Read and write hieroglyphs on paper, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red.", "All three end with your own name in a cartouche."]}],
      "body": ["Read one word together, sign by sign, from the chart: a ripple of water (*n*), a reed (*i*), a lion (*l*), two reeds (*e*). *“N, I, L, E: Nile,”* Egypt’s great river.",
               "Then children choose a handout."]}),
    ("levels", {
      "green": "Match four signs to the pictures they show, read *CAT* with the first letter given, then copy their name sign by sign into a cartouche and draw its end line.",
      "yellow": "Read two words with the chart, write their name in a cartouche with its end line, and circle which way to read.",
      "red": "Read three words, write their name in a cartouche, then write it again the scribe’s way with the vowels left out, and write a secret word for a partner."}),
    ("section", {"label": "Look back and share · 4 minutes",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "The scribe’s way", "show": "question", "question": SHARE,
         "purpose": "End with what a real scribe would do: write the consonants only.",
         "students": ["Say your name without its vowels.", "Does it still sound like you?"]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* For each one, children show a thumb up, sideways or down. For the last, ask a Red Level child.",
               CLOSE_SHARE]}),
    ("cols", [[("connection", ["**Virtual visit:** in *Your Name in Hieroglyphs*, type a name and watch it appear sign by sign in a cartouche, see how a scribe might write it with consonants only, and print it.",
                               "**Next:** in *The Rosetta Stone Decoder*, older children use the Greek to crack King Ptolemy’s name."])],
              [("section", {"label": "Assessment notes", "list": [
      "Can the child say what a sign is a picture of, and its sound?",
      "Can the child read *CAT* or *NILE* with the chart?",
      "Are the name’s signs in order, inside the oval, with its end line?",
      "Red Level: can the child say why a scribe’s version is shorter?"]})]]),
    ("section", {"label": "For the teacher", "title": "A sound-alike, not a code book",
      "body": [
        "**A modern chart.** The signs come from the Egypt Exploration Society’s chart for writing your name: one sign for each letter of the English alphabet, and one each for *ch* and *sh*. The exhibition says plainly that this is a modern sound-alike, not how the ancient Egyptians wrote names. Their hieroglyphs wrote consonants only, and they were not an alphabet: one sign could stand for two or more sounds, like the gaming-board sign for *mn*, which we can say “men”. Where a sound is spelled oddly, spell it by its sounds: *C* and *K* share the basket, *U* and *W* the quail chick.",
        "**King Ptolemy’s name** on page 3 is set sign by sign as it is carved on the Rosetta Stone. Children can find its stool (*p*), bread (*t*) and lion (*l*), but some of its signs are not the chart’s: it is for looking, not for reading with the chart."]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Pictures that are sounds", "body": ["Project or print this page for the hook and the teaching. The stone first, then the signs, then a king’s name."]}),
    ("html", '<div class="stone">' + crop(STONE_TOP, 1400, 637, 230, 60, 900, 480, 300)
             + '<div><p class="label">The Rosetta Stone · the top</p><h3>Writing in pictures</h3>'
               '<p>Hieroglyphs are the oldest form of ancient Egyptian writing. They were used on temples, tombs and other monuments. Can you find an oval with signs inside it?</p></div></div>'),
    ("section", {"label": "Eight signs from the chart", "body": []}),
    ("html", first_signs()),
    ("section", {"label": "King Ptolemy’s name, as it is carved on the Rosetta Stone", "body": []}),
    ("html", cartouche(PTOLEMY, cls="mid")),
    ("section", {"label": "Questions to ask", "list": [
      "Which sign is a lion? Which is an owl? What sound does each stand for?",
      "Where is the line that marks the end of the name?",
      "Which way is the lion facing? Which way do we read?",
      "Why do you think only kings and queens had their names ringed by an oval?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["**A grown-up reads this aloud.** In ancient Egypt, scribes wrote in hieroglyphs. Each sign is a picture, but many stand for a sound. The names of kings and queens were ringed by an oval called a cartouche. Use the chart to read, and to write your name."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2", "level": level, "young": True, "css": CSS + css,
            "context": CONTEXT, "hero": HERO,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks}

CHART_TASK = ("task", {"label": "The chart", "title": "Each sign and its sound. Our signs face left, so read from left to right.",
                       "blocks": [("html", chart_html(cols=14, small=True))]})

def sign_match():
    """Four signs in a row, and what they show in a row beneath, shuffled: draw lines down."""
    signs = ["G17", "E23", "D21", "N35"]
    words = ["a mouth", "water", "an owl", "a lion"]
    top = "".join(f'<div class="s"><span class="hg">{g(c)}</span><i></i></div>' for c in signs)
    low = "".join(f'<div class="w"><i></i><span>{w}</span></div>' for w in words)
    return f'<div class="sm">{top}{low}</div>'

def P(t):
    return ("html", f'<p class="hint">{md(t)}</p>')

NAME_HINT = "Find each letter of your name on the chart. Draw its sign, in order, inside the oval."

GREEN = handout("green", "EGY_Handout_Green_Grades1_2.pdf", [
  CHART_TASK,
  ("task", {"label": "Part 1", "title": "What is each sign a picture of? Draw a line.",
            "blocks": [("html", sign_match())]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Read the word. The first letter is done for you.",
            "blocks": [("html", word("CAT", given=1))]}),
  ("task", {"label": "Part 3", "title": "Write your name in the cartouche.",
            "blocks": [P(NAME_HINT), ("html", '<div class="namebox">' + cartouche(cls="empty") + "</div>"),
                       ("lines", 1)]}),
  ("task", {"label": "Part 4", "title": "Color the cartouche gold. Trace the line that marks the end of your name.",
            "blocks": []}),
  ("task", {"label": "Part 5", "title": "Which sign do you like best? Draw it big.",
            "blocks": [("draw", "My favorite sign")]}),
  ("family", ["Write a family name together with the chart. Who in the family has the most signs? Who has the fewest?"]),
], "body.young .drawbox { height: 130pt; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_Grades1_2.pdf", [
  CHART_TASK,
  ("task", {"label": "Part 1", "title": "Read the words. Write a letter in each box.",
            "blocks": [("html", '<div class="words2">' + word("CAT", small=True) + word("NILE", small=True) + "</div>")]}),
  ("task", {"label": "Part 2", "title": "Which way do we read these signs? Circle one.",
            "blocks": [P("Look at the owl and the lion. Which way do they face?"), ("html", '<div class="way"><span>left to right →</span><span>← right to left</span></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Write your name in the cartouche. Draw the line that marks its end.",
            "blocks": [P(NAME_HINT), ("html", '<div class="namebox">' + cartouche(cls="empty") + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Which sign in your name do you like best? Draw it big, and say what it is a picture of.",
            "blocks": [("draw", "My favorite sign")]}),
  ("family", ["Look for a sign at home that is a picture, like a road sign or a button. What does it mean? Then show your family your name in hieroglyphs."]),
], "body.young .drawbox { height: 210pt; }")

RED = handout("red", "EGY_Handout_Red_Grades1_2.pdf", [
  CHART_TASK,
  ("task", {"label": "Part 1", "title": "Read the words. Write a letter in each box.",
            "blocks": [("html", '<div class="words2">' + word("NILE", small=True) + word("SCRIBE", small=True) + "</div>"
                                + word("PAPYRUS", small=True))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Write your name in the cartouche, with its end line.",
            "blocks": [("html", '<div class="namebox">' + cartouche(cls="mid") + "</div>")]}),
  ("task", {"label": "Part 3", "title": "Now write it the scribe’s way.",
            "blocks": [P("An Egyptian scribe left out the vowels: A, E, I, O, U. Write your name again with the consonants only."), ("html", '<div class="namebox">' + cartouche(cls="mid") + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Write a secret word in hieroglyphs for a partner to read. Can they read it?",
            "blocks": [("draw", "My secret word")]}),
  ("family", ["Write a message to your family in hieroglyphs, with the chart beside it. Can they read it?"]),
], ".cart.mid { height: 56pt; } body.young .drawbox { height: 150pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
