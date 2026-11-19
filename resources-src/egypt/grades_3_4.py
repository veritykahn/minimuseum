"""Grades 3–4 · "Crack the Code"
The Rosetta Stone Decoder: one decree carved in three scripts, the Greek that
scholars could still read, and King Ptolemy's name cracked sign by sign, then
checked against Queen Cleopatra's, as Champollion did. Facts follow
app/exhibitions/egypt/rosetta-stone/rosetta.ts (the scripts and their notes,
the stone's story, PTOLEMY, PTOLEMY_GREEK, CLEOPATRA and their notes),
rosetta-stone/page.tsx (the room's intro and steps) and egypt.ts (poster 1:
the Rosetta Stone, Young and Champollion, the way to read).

Only what the room gives: the sounds of Ptolemy's seven signs, the three
Greek letters with no sign of their own, Cleopatra's three shared signs, her
two signs for t, and the bread and egg that close a royal woman's name."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (STONE, STONE_TOP, STONE_MID, STONE_LOW, STONE_CREDIT, ROOM, OBJ_CSS, SIGN_CSS,
                  HOOK, TEACH, ACT, CLOSE, THUMBS, g, cartouche, review, look_back_say, md)

DIR = "teachers/grades-3-4/"
TITLE = "Crack the Code"
SUB = "Grades 3–4 · The Rosetta Stone Decoder · One message, three scripts"
HERO = {"img": STONE, "pos": "center 30%", "credit": STONE_CREDIT}

# rosetta.ts: Ptolemy's cartouche, the Greek name, Cleopatra's cartouche
PTOLEMY = [("Q3", "P"), ("X1", "T"), ("V4", "O"), ("E23", "L"), ("Aa15", "M"), ("M17A", "I"), ("S29", "S")]
GREEK = [("Π", "P"), ("Τ", "T"), ("Ο", "O"), ("Λ", "L"), ("Ε", "E"), ("Μ", "M"), ("Α", "A"), ("Ι", "I"), ("Ο", "O"), ("Σ", "S")]
CLEO = [("N29", "K"), ("E23", "L"), ("M17", "E"), ("V4", "O"), ("Q3", "P"), ("G1", "A"), ("D46", "T"), ("D21", "R"), ("G1", "A"), ("X1", "T"), ("H8", "")]
# what the signs show (rooms.ts SIGN_NAMES; the egg as rosetta.ts names it)
NAMES = {"Q3": "a stool", "X1": "a loaf of bread", "V4": "a lasso", "E23": "a lion", "S29": "a folded cloth",
         "M17A": "two reeds", "Aa15": "", "D46": "a hand", "H8": "an egg"}

# the room's own words (rosetta-stone/page.tsx INTRO)
INTRO = ("In 1799, soldiers in Egypt found a broken stone. One message was carved on it three times, in three kinds of writing. "
         "By then, nobody could read hieroglyphs. But people could still read Greek.")
EUREKA = "Look, I’ve got it!"
SHARE = "If you wanted to leave a message that people could still understand thousands of years from now, how would you do it?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain why the Rosetta Stone became the key to hieroglyphs: one message, three scripts, and one of them Greek",
     "explain why the Rosetta Stone became the key?", False),
    ("name the stone’s three scripts and say what each was used for",
     "name the three scripts, and what each was for?", False),
    ("use the Greek to read King Ptolemy’s name in hieroglyphs, sign by sign",
     "read King Ptolemy’s name in hieroglyphs?", False),
    ("test a code against a second name, as Champollion did with Cleopatra’s",
     "test your code against a second name?", True)],
  "why": "For centuries nobody could read hieroglyphs. The Rosetta Stone let people do it again, because one thing on it could still be read. Cracking a name the way the code breakers did shows how a careful guess becomes proof."}

CSS = SIGN_CSS + """
.dec { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 4pt; margin: 4pt 0 8pt; break-inside: avoid; }
.dec div { border: .8pt solid #8d8a80; border-radius: 4pt; background: rgba(255,255,255,.7); text-align: center; padding: 3pt 1pt 4pt; }
.dec .gk { display: block; font: 500 22pt/1.1 'Cormorant Garamond', serif; }
.dec .hg { display: flex; align-items: center; justify-content: center; font-size: 29pt; line-height: 1; height: 40pt; overflow: visible; }
.dec small { display: block; margin-top: 4pt; font-size: 7.2pt; line-height: 1.15; color: #5b5a55; min-height: 8pt; }
.dec i { display: block; margin: 3pt auto 0; width: 24pt; height: 22pt; border: 1pt solid #1d1c1a; border-radius: 3pt; background: #fff;
  font: 500 13pt/22pt 'Outfit'; font-style: normal; }
.dec .skip { opacity: .45; }
.dec.cleo .hg { font-size: 25pt; height: 36pt; }
.bands { display: grid; grid-template-columns: 150pt 1fr; gap: 6pt 12pt; align-items: center; margin: 4pt 0 8pt; }
.bands img { width: 150pt; height: 40pt; object-fit: cover; border-radius: 4pt; border: 1pt solid #1d1c1a; }
.bands .ans { border-bottom: 1pt solid #5b5a55; height: 16pt; }
.bands p { margin: 0; font-size: 9.5pt; }
.bank { display: flex; flex-wrap: wrap; gap: 5pt; margin: 2pt 0 6pt; }
.bank span { border: .8pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 9pt; font-size: 9pt; background: rgba(255,255,255,.6); }
.tip { font-size: 9.5pt; border-left: 2pt solid var(--accent); padding: 3pt 0 3pt 8pt; margin: 4pt 0 6pt; }
.cart.ptol { width: 280pt; height: 58pt; } .cart.ptol .hg { font-size: 40pt; }
.cart.cleo { width: 430pt; height: 58pt; } .cart.cleo .hg { font-size: 32pt; letter-spacing: 1pt; }
"""

SHOW_CSS = """
.show3 { display: grid; grid-template-columns: 150pt 1fr; gap: 14pt; align-items: start; margin: 4pt 0 8pt; }
.show3 > img { width: 150pt; border-radius: 5pt; border: 1pt solid #1d1c1a; }
.show3 .bands { grid-template-columns: 130pt 1fr; margin: 0; }
.show3 .bands img { width: 130pt; height: 52pt; }
"""

def dec(pairs, show_sound=True, names=False, cls="", greek=False, skip=()):
    """A row of signs (or Greek letters), each with a box for its sound."""
    cells = ""
    for n, (c, s) in enumerate(pairs):
        top = f'<span class="gk">{c}</span>' if greek else f'<span class="hg">{g(c)}</span>'
        name = f'<small>{NAMES.get(c, "")}</small>' if names else ""
        cells += f'<div class="{"skip" if n in skip else ""}">{top}{name}<i>{s if show_sound else ""}</i></div>'
    return f'<div class="dec {cls}" style="--n:{len(pairs)}">{cells}</div>'

def bands(with_answers=False, sizes=None):
    rows = [(STONE_TOP, "Top", "Hieroglyphic: the oldest form of Egyptian writing, used on temples, tombs and other monuments."),
            (STONE_MID, "Middle", "Demotic: a quicker, handwritten script for daily letters and literature, mostly read from right to left."),
            (STONE_LOW, "Bottom", "Greek: widespread in Egypt after Alexander the Great conquered it in 332 BC.")]
    out = ""
    for img, where, text in rows:
        out += f'<img src="{img}" alt=""><div>{"<p>" + md(text) + "</p>" if with_answers else f"<p><b>{where}:</b></p><div class=ans></div>"}</div>'
    return f'<div class="bands">{out}</div>'

def P(t):
    return ("html", f"<p>{md(t)}</p>")

# ── lesson mode ────────────────────────────────────────────────────────
STONE_ALT = "The Rosetta Stone: a broken slab of dark gray stone, carved from top to bottom with three bands of writing"
SCRIPTS = {"groups": [
  {"label": "Hieroglyphic", "text": "The oldest. Used on temples, tombs and other monuments.",
   "items": [{"img": STONE_TOP, "caption": "Top", "alt": "The hieroglyphic band: rows of small pictures, with an oval around a few signs", "aspect": round(1400 / 637, 2)}]},
  {"label": "Demotic", "text": "Handwritten, for daily letters and literature.",
   "items": [{"img": STONE_MID, "caption": "Middle", "alt": "The demotic band: dense rows of flowing, joined-up marks", "aspect": round(1400 / 671, 2)}]},
  {"label": "Greek", "text": "Widespread in Egypt after 332 BC.",
   "items": [{"img": STONE_LOW, "caption": "Bottom", "alt": "The Greek band: rows of capital letters", "aspect": round(1400 / 581, 2)}]}]}

LESSON = {
  "slug": "crack-the-code",
  "out": DIR + "EGY_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "css": CSS + OBJ_CSS + SHOW_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Three scripts", 12, TEACH), ("Activity", 18, ACT), ("Close", 5, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will discover why the Rosetta Stone unlocked hieroglyphs: it carries one priestly decree three times, in hieroglyphic, demotic and Greek, and scholars could still read the Greek. Following the exhibition’s *Rosetta Stone Decoder*, they will use the Greek to read King Ptolemy’s name sign by sign, then test their code on Queen Cleopatra’s name, the way Jean-François Champollion did."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Social Studies** — ancient Egypt; how historians recover a lost language",
        "**ELA** — letters and sounds; comparing the same text in different forms",
        "**Math** — patterns, matching and checking a solution",
        "**Science** — evidence: a guess, a test, and proof"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the stone, its three scripts and the two names",
      "Differentiated handouts, one per student; optional devices for *The Rosetta Stone Decoder*"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Which writing can you read?",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": STONE, "credit": STONE_CREDIT}, "alt": STONE_ALT, "fit": "contain",
                 "caption": "The Rosetta Stone",
                 "purpose": "Look before anyone explains: three bands of writing, and one you might know.",
                 "students": ["How many kinds of writing can you see?", "Is any of it writing you could read?"]},
      "body": ["Show the whole stone without explanation. Ask: *“How many kinds of writing can you see? Could you read any of it?”* Pairs talk for a minute; someone may spot letters like ours at the bottom. Then read the room’s opening: *“" + INTRO + "”*"]}),
    ("section", {"label": "Three scripts · 12 minutes",
      "screen": [
        {"phase": "Three scripts", "minutes": 4, "script": [0], "title": "One message, three scripts", "show": "gallery", **SCRIPTS,
         "purpose": "Meet the three scripts, and what each was used for.",
         "students": ["Which script looks most like pictures?", "Which one looks like joined-up handwriting?"]},
        {"phase": "Three scripts", "minutes": 4, "script": [1], "title": "Found in 1799", "show": "image",
         "img": {"img": ROOM["rosetta-stone"]}, "fit": "contain",
         "alt": "The Rosetta Stone Decoder room: the dark stone carved with its three scripts, beside the story of the one decree",
         "caption": "The Rosetta Stone Decoder: one decree, three scripts",
         "purpose": "Hear the stone’s story: where it was found, and what it says.",
         "students": ["Why carve the same message three times?"]},
        {"phase": "Three scripts", "minutes": 4, "script": [2], "title": "Find the king’s name", "show": "words",
         "text": "Scholars could still read Greek.\nThe Greek text names the king: Ptolemy.",
         "purpose": "See where the code breakers started: a name, in an oval.",
         "students": ["In the hieroglyphs, find an oval with signs inside.", "Why start with a name?"]}],
      "body": ["Show the three bands on page 3. **Hieroglyphs** are the oldest Egyptian writing, used on temples, tombs and monuments. **Demotic**, a quicker handwritten script, was used for daily letters and literature. **Greek** became widespread after Alexander the Great conquered Egypt in 332 BC.",
               "In July 1799, French soldiers rebuilding an old fort at Rashid found the stone; Europeans called Rashid “Rosette”. It carries one priestly decree in each script, drawn up on 27 March 196 BC by a council of priests in Memphis, under Ptolemy V.",
               "Scholars could still read Greek, and the Greek names the king: **Ptolemy**. Code breakers focused on the oval **cartouches** enclosing royal names: if the Greek says *Ptolemy*, the hieroglyphs should too."]}),
    ("section", {"label": "Activity · 18 minutes",
      "screen": [
        {"phase": "Activity", "minutes": 6, "script": [0], "title": "Crack the code", "show": "worked",
         "examples": [{"title": "Ptolemy in Greek, and in hieroglyphs",
                       "steps": ["The Greek letters say P, T, O, L, E, M, A, I, O, S.",
                                 "The cartouche has seven signs, in the same order.",
                                 "Match them: P, T, O, L, M, I, S.",
                                 "Three Greek letters have no sign: E, A and the second O."],
                       "answer": "Seven signs, seven sounds: P T O L M I S"}],
         "purpose": "Crack the first name together: match sounds to signs, in order.",
         "students": ["Count the Greek letters. Count the signs.", "Which Greek letters have no sign?"]},
        {"phase": "Activity", "minutes": 12, "script": [1], "title": "Your handout", "show": "levels",
         "purpose": "Crack Ptolemy’s name on paper, then test the code, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red.", "Everyone cracks Ptolemy. Then test your code on a queen."]}],
      "body": ["Show the Greek name and the cartouche on page 3. Students count: ten Greek letters, seven signs. Work the first signs together: the stool is *p*, the loaf of bread *t*, the lasso *o*, the lion *l*. Let students finish: *m*, *i* (two reeds), *s* (a folded cloth). Ask: *“Which Greek letters have no sign?”* The vowels *E*, *A* and the second *O*.",
               "Hieroglyphs were not an alphabet, though: one sign could stand for two or more sounds. Then students work on a handout."]}),
    ("levels", {
      "green": "Match the three scripts to their descriptions from a word bank, then crack Ptolemy’s name with the signs named and the Greek sounds given, and finish the stone’s story from a word bank.",
      "yellow": "Name the three scripts and what each was for, crack Ptolemy’s name and find the Greek letters with no sign, read three of Cleopatra’s signs with their new code, and explain why the Greek mattered.",
      "red": "Crack Ptolemy’s name, then test it on Cleopatra’s whole cartouche: fill in every sign they can, find the two different signs for *t*, explain the bread and egg that close her name, and say why a second name proves the code."}),
    ("section", {"label": "Look back and share · 5 minutes",
      "screen": [
        review(OBJECTIVES, 3, [0]),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Look, I’ve got it!", "show": "words",
         "text": EUREKA, "cite": "Jean-François Champollion, 14 September 1822",
         "purpose": "End where the code breakers ended, and with a message for the future.",
         "students": [SHARE]}],
      "body": [look_back_say(OBJECTIVES, "a Red Level student, who explains Cleopatra’s test"),
               "Tell the ending. Thomas Young had read Ptolemy’s name, though not every sign correctly, and his work helped Champollion. On 14 September 1822, Champollion hurried to his brother, waving his notes: *“" + EUREKA + "”* Close with poster 1’s question: *“" + SHARE + "”*"]}),
    ("cols", [[("connection", ["**Virtual visit:** open *The Rosetta Stone Decoder* and follow its five steps: which writing can you read, find the king’s name, crack the code, check it with a queen, cracked!",
                               "**Poster 1** tells the stone’s story, and where it spent the First World War."])],
              [("section", {"label": "Answer notes", "list": [
      "Ptolemy: stool *P*, bread *T*, lasso *O*, lion *L*, *M*, two reeds *I*, folded cloth *S*. Greek letters with no sign: *E*, *A*, the second *O*.",
      "Cleopatra’s signs shared with Ptolemy’s: the lion (*l*), the lasso (*o*) and the stool (*p*). Her *t* is a hand; Ptolemy’s is a loaf.",
      "The bread and the egg close her name: Thomas Young noticed this pair always followed the name of a goddess, a queen or a princess.",
      "Her name is not on the Rosetta Stone: it comes from an obelisk from Philae."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "One message, three scripts", "body": ["Project or print this page. The stone and its scripts for the teaching; the two names for cracking the code together."]}),
    ("html", f'<div class="show3"><img src="{STONE}" alt="">{bands(with_answers=True)}</div>'),
    ("section", {"label": "The Greek: Ptolemy", "body": []}),
    ("html", dec(GREEK, greek=True)),
    ("section", {"label": "The cartouche, sign by sign", "body": []}),
    ("html", cartouche("".join(g(c) for c, _ in PTOLEMY), cls="ptol")),
    ("section", {"label": "To check the code: Queen Cleopatra’s cartouche, from an obelisk from Philae", "body": []}),
    ("html", cartouche("".join(g(c) for c, _ in CLEO), cls="cleo")),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In July 1799, French soldiers in Egypt found a broken stone carved with one message in three scripts: hieroglyphic, demotic and Greek. Nobody could read hieroglyphs any more, but scholars could still read Greek, and the Greek names the king: **Ptolemy**. Royal names in hieroglyphs sit inside an oval called a **cartouche**. Your job: crack the code."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · The Rosetta Stone Decoder", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

def bank(words):
    return ("html", '<div class="bank">' + "".join(f"<span>{w}</span>" for w in words) + "</div>")

GREEK_ROW = dec(GREEK, greek=True)

GREEN = handout("green", "EGY_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Three scripts", "blocks": [
            P("Write the name of each script next to its band of the stone."),
            bank(["Greek", "Hieroglyphic", "Demotic"]),
            ("html", bands())]}),
  ("task", {"label": "Part 2", "title": "Finish the story", "blocks": [
            bank(["1799", "Greek", "cartouche", "three", "Ptolemy"]),
            P("1. The stone was found in ______________."),
            P("2. The same message is carved ______________ times."),
            P("3. Scholars could still read the ______________."),
            P("4. A king’s name sits inside an oval called a ______________."),
            P("5. The Greek names the king: ______________.")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Crack King Ptolemy’s name", "blocks": [
            P("Here are the Greek letters of his name, with the sound of each."),
            ("html", GREEK_ROW),
            P("Here are the seven signs in his cartouche, in the same order. Under each sign, write its sound. The first two are done for you."),
            ("html", dec([(c, s if n < 2 else "") for n, (c, s) in enumerate(PTOLEMY)], names=True)),
            ("html", '<p class="tip"><b>Clue:</b> there are more Greek letters than signs. Some of the vowels have no sign in this name, so skip them.</p>')]}),
  ("task", {"label": "Part 4", "title": "Look back at the Greek letters in Part 3. Circle the three that have no sign.", "blocks": []}),
  ("task", {"label": "Part 5", "title": "Why do you think the code breakers started with a name?", "lines": 3}),
  ("task", {"label": "Part 6", "title": "Which script on the stone could the scholars read? Why did that matter so much?", "lines": 3}),
], ".dec .gk { font-size: 20pt; } .task p { margin-bottom: 4pt; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Crack King Ptolemy’s name", "blocks": [
            P("The Greek letters of his name, and their sounds:"),
            ("html", GREEK_ROW),
            P("The seven signs of his cartouche, in the same order. Write the sound under each sign."),
            ("html", dec([(c, "") for c, _ in PTOLEMY]))]}),
  ("task", {"label": "Part 2", "title": "Which three Greek letters have no sign? What kind of letters are they?", "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Test your code on a queen", "blocks": [
            P("This is Queen Cleopatra’s cartouche, from an obelisk from Philae. Three of its signs are in Ptolemy’s name too. Find them, and write their sounds in the boxes."),
            ("html", dec([(c, "") for c, _ in CLEO], cls="cleo"))]}),
  ("task", {"label": "Part 4", "title": "Three scripts", "blocks": [
            P("Name each script, and write one thing it was used for."),
            ("html", bands())]}),
  ("task", {"label": "Part 5", "title": "Why could nobody have read the hieroglyphs on the stone without the Greek?", "lines": 3}),
  ("task", {"label": "Part 6", "title": "If you wanted to leave a message that people could still understand thousands of years from now, how would you do it?", "lines": 3}),
], ".dec.cleo i { width: 20pt; }")

RED = handout("red", "EGY_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Crack King Ptolemy’s name", "blocks": [
            P("The Greek letters of his name, and their sounds:"),
            ("html", GREEK_ROW),
            P("Write the sound under each of the seven signs of his cartouche."),
            ("html", dec([(c, "") for c, _ in PTOLEMY]))]}),
  ("task", {"label": "Part 2", "title": "Three Greek letters have no sign. Which are they, and what do they have in common?", "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Check it with a queen", "blocks": [
            P("Champollion tested his code on a second royal name: Cleopatra’s, from an obelisk from Philae. Her name is K L E O P A T R A. Fill in every sound you can, using your Ptolemy code and the order of her name."),
            ("html", dec([(c, "") for c, _ in CLEO], cls="cleo"))]}),
  ("task", {"label": "Part 4", "title": "Two signs, one sound", "blocks": [
            P("Find *t* in both names. What is strange about it? Why might it have puzzled the code breakers?")], "lines": 2}),
  ("task", {"label": "Part 5", "title": "The last two signs", "blocks": [
            P("Cleopatra’s cartouche ends with two more signs, a loaf of bread and an egg, after her name is spelled out. Thomas Young noticed that this pair always followed the name of a goddess, a queen or a princess. What job do you think the pair does?")], "lines": 2}),
  ("task", {"label": "Part 6", "title": "Proof", "blocks": [
            P("One name could be a lucky guess. Explain how Cleopatra’s name turned the Ptolemy code from a guess into proof.")], "lines": 3}),
], ".dec.cleo i { width: 20pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
