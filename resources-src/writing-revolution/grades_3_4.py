"""Grades 3–4 · "QWERTY's Secret"
Why the letters on a keyboard are in the order they are: Sholes's jamming
typebars, the letter pairs split apart, the myth, and why QWERTY stayed.
Facts follow poster 2, "QWERTY's Accidental Empire", in
app/exhibitions/writing-revolution/writingRevolution.ts (quoted as the site
sets it, keeping "in the best-known account"), and the Typing Station's Top
row tab and its "beat ten" challenge (typing-station/challenges.ts,
stationText.ts).

The Urania on the posters is a German machine whose letter rows read QWERTZ…
(look at its keys): the Red handout asks students to notice it, and the
exhibition does not explain it, so neither does this lesson."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

DIR = "teachers/grades-3-4/"
TITLE = "QWERTY’s Secret"
SUB = "Grades 3–4 · Why the letters on a keyboard are where they are"

HERO = W.HERO_P2_TITLE
HERO_HANDOUT = W.HERO_P2_KEYS

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Why aren’t the letters in ABC order?"
TOP_ROW = "  ".join(W.TOP)
PAIRS = "T  H     H  E"
MYTH = "Sholes designed QWERTY to slow typists down."
TEN = "TYPEWRITER"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain the problem Sholes had: metal arms that jammed when typists went too fast",
     "explain why Sholes’ typewriter jammed?", False),
    ("describe how, in the best-known account, his keyboard split up letter pairs like TH and HE",
     "say how the keyboard split up letter pairs?", False),
    ("tell the myth about QWERTY from the fact",
     "tell the myth from the fact?", False),
    ("explain why we still type on QWERTY, long after the jamming was solved",
     "explain why we still use QWERTY today?", True)],
  "why": "The keyboard you use every day was shaped by a problem with a machine 150 years old. Things are often the way they are for a reason, and finding the reason is what historians and inventors do."}

# myth or fact? (statement, answer)
MF = [
  ("Sholes’ typewriter jammed when typists worked too quickly.", "Fact"),
  (MYTH, "Myth"),
  ("In the best-known account, QWERTY split up letters that often go together, like TH and HE.", "Fact"),
  ("Touchscreen keyboards still use Sholes’ pattern.", "Fact"),
]
# top row or not? the letters are the check, as on the station's Top row tab
WORDS_GREEN = ["TOY", "WATER", "PRETTY", "KITE", "QUIET", "PUPPET"]
WORDS_TOP = {w: set(w) <= set(W.TOP) for w in WORDS_GREEN}

CSS = W.KEYS_CSS + W.QUOTE_CSS + """
.mf { display: grid; grid-template-columns: 1fr auto; gap: 7pt 14pt; align-items: center; margin: 4pt 0 9pt; break-inside: avoid; }
.mf p { margin: 0; }
.mf .pick { font: 500 8.5pt 'Outfit'; letter-spacing: .08em; white-space: nowrap; }
.mf .pick span { display: inline-block; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 1pt 9pt; margin-left: 5pt; background: rgba(255,255,255,.6); }
.wordcheck { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7pt 14pt; margin: 4pt 0 9pt; break-inside: avoid; }
.wordcheck div { display: flex; justify-content: space-between; align-items: center; border-bottom: .8pt solid #a9a69b; padding: 3pt 0 5pt; }
.wordcheck b { font: 500 12pt 'Courier Prime', 'Courier New', monospace; letter-spacing: .12em; }
.wordcheck span { font: 500 8pt 'Outfit'; letter-spacing: .08em; }
.chain { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin: 4pt 0 10pt; break-inside: avoid; }
.chain > div { border: 1pt solid #1d1c1a; background: rgba(255,255,255,.62); padding: 6pt 9pt 4pt; min-height: 92pt; position: relative; }
.chain > div + div { border-left: none; }

.chain .label { margin-bottom: 2pt; }
.chain p { font-size: 8.8pt; line-height: 1.35; margin: 0; }
.uranrow { display: grid; grid-template-columns: 200pt 1fr; gap: 14pt; align-items: center; margin: 4pt 0 6pt; break-inside: avoid; }
.uranrow img { width: 200pt; }
"""


def mf(items):
    rows = "".join(f'<p>{t}</p><p class="pick"><span>Myth</span><span>Fact</span></p>' for t, _ in items)
    return ("html", f'<div class="mf">{rows}</div>')


def wordcheck(words):
    cells = "".join(f'<div><b>{w}</b><span>Yes &nbsp;·&nbsp; No</span></div>' for w in words)
    return ("html", f'<div class="wordcheck">{cells}</div>')


def chain(cells):
    return ("html", '<div class="chain">' + "".join(
        f'<div><p class="label">{a}</p><p>{b}</p></div>' for a, b in cells) + "</div>")


URANIA_PRINT = W.printable(W.URANIA)

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "qwertys-secret", "large": True,
  "out": DIR + "WR_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO,
  "css": CSS + W.OBJ_CSS + "body { line-height: 1.45; } .cols:has(.conn) { font-size: 9pt; }",
  "blocks": [
    ("timing", [("Hook", 5, W.SAGE), ("Teach", 10, W.SLATE), ("Activity", 20, W.GOLD), ("Close", 5, W.RUST)]),
    ("cols", [[("objectives", OBJECTIVES)],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will discover why the letters on a keyboard are where they are: in 1868 Sholes’ typewriter jammed when typists went too fast, and in the best-known account he split up letters that often go together. They will separate the myth from the fact, and explain why we still type on his pattern."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Science and engineering** — a design problem, a solution, and the trade-off it left behind",
      "**Social Studies** — inventions and change over time; why habits last",
      "**ELA** — cause and effect; telling a myth from a fact using a source"]}),
               ("section", {"label": "Materials needed", "list": [
      "The Typing Station on a screen, open at its *Top row* tab",
      "Page 3 of this plan, projected or printed",
      "A keyboard or a phone, if you have one to pass around",
      "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Not in ABC order",
      "screen": {"phase": "Hook", "show": "words", "title": "Not in ABC order", "text": TOP_ROW,
                 "purpose": "Start from something students use every day and have never questioned.",
                 "students": ["Read the top row of a keyboard.", HOOK_Q]},
      "body": ["Show the top row of the keyboard on page 3, or pass round a keyboard. Read the letters aloud together: Q, W, E, R, T, Y… *“" + HOOK_Q + " Wouldn’t ABC be easier to learn?”* Write a few guesses on the board. Then: *“The answer is a secret 150 years old. It starts with a problem.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "The problem, the solution, the myth",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Jammed!", "show": "image",
         "img": {"img": W.URANIA}, "alt": W.URANIA_ALT, "fit": "contain",
         "caption": "The Urania typewriter from the posters: behind the keys, the curve of metal typebars",
         "purpose": "See the machine and understand its problem: fast fingers made the typebars jam.",
         "students": ["Find the curve of metal arms behind the keys.", "What would happen if two swung up at once?"]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "Split up the pairs", "show": "words", "text": PAIRS,
         "purpose": "Find the solution on the keyboard itself: common pairs set apart.",
         "students": ["Find T and H on the keyboard. Are they side by side?", "Now find H and E."]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Myth or fact?", "show": "words", "text": MYTH,
         "purpose": "Use the source to bust a myth, then ask why the pattern stayed.",
         "students": ["Myth or fact? Vote with a thumb.", "If the jamming was solved, why do we still use QWERTY?"]}],
      "body": [
        "**The problem.** Read the poster aloud: *“" + Q["sholes2"] + "”* Show the Urania on page 3: each key works a metal arm, a typebar, that swings up to the paper.",
        "**The solution.** *“" + Q["solution"] + "”* Find T, H and E on the keyboard together. The poster adds: *“" + Q["random"] + "”* Point out *in the best-known account*: the exhibition is careful to say this is the story most often told.",
        "**The myth.** Put the statement on the screen and vote. Then read: *“" + Q["myth"] + "”* Finally: *“" + Q["electric"] + "”* " + Q["muscle"] + " " + Q["touch"]]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Investigate the keyboard independently, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three find the letter pairs, bust the myth and hunt for top-row words."]},
      "body": ["Students choose a handout. All three find the split pairs, bust the myth and hunt for words that use only the top row."]}),
    ("levels", {
      "green": "Color the top row and find T, H and E. Sort four statements into myth and fact, check six words for top-row letters, and say why we still use QWERTY.",
      "yellow": "Put the story in a cause-and-effect chain, count TH and HE in a poster sentence, bust the myth with evidence, and hunt for the longest top-row word.",
      "red": "Solve the bottom-row puzzle, judge the Dvorak keyboard’s test, explain why QWERTY survived, and look closely at the Urania’s own keys."}),
    ("section", {"label": "Beat ten and look back · 5 minutes", "title": "Beat ten",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Beat ten", "show": "words", "text": TEN,
         "purpose": "Share the top-row hunt: the poster’s own word has ten letters. Can anyone beat it?",
         "students": ["Share your longest top-row word.", "Check every letter: is it on the top row?"]},
        {**W.review(OBJECTIVES, 3, [1], W.THUMBS), "phase": "Close"}],
      "body": ["The poster says *“typewriter”* remains one of the longest words you can type using only the top row. It has ten letters. Ask for the longest top-row words students found, and check each letter together. On the Typing Station’s *Top row* tab, type them in and *Post the list to the board*.",
               "Then ask the objectives back, from the screen or page 1: *“Can you now…?”* Students show a thumb up, sideways or down. Ask a Red Level reader to answer the last one."]}),
    ("cols", [
      [("section", {"label": "Background · the rest of the story", "body": [
        "In 1936 August Dvorak’s keyboard put the most common letters on the home row, claiming 74% more speed. A Navy test overseen by Dvorak himself reported dramatic gains; a 1956 government study found no real advantage. QWERTY survived because businesses couldn’t afford to retrain workers and replace equipment (the Red handout)."]}),
       ("connection", ["**Online,** the Typing Station’s *Top row* tab checks the letters of any word; try the bottom row too. **In the exhibition,** read *QWERTY’s Accidental Empire* and look at the Urania’s keys."])],
      [("section", {"label": "Answer notes", "list": [
        "**Myth or fact:** all four are facts except *" + MYTH + "* (a myth).",
        "**Green top-row words:** " + ", ".join(w for w in WORDS_GREEN if WORDS_TOP[w]) + " use only the top row; WATER (A) and KITE (K) do not.",
        "**Yellow pairs:** the sentence has TH four times (myth, them, without, the) and HE three times (he, them, the).",
        "**Top-row words students may find:** pretty, pottery, territory; ten-letter words such as *proprietor* and *repertoire* tie with *typewriter*.",
        "**Red bottom row:** Z X C V B N M has no vowels, so it can barely form any words.",
        "**Red Urania:** its rows read QWERTZ…, not QWERTY. The exhibition does not explain it: accept careful observations."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The keyboard, row by row", "body": ["Project or print this page for the hook and the lesson. The keyboard’s letter rows, as on the Typing Station."]}),
    ("html", W.keys(size=32, labels=True)),
    ("section", {"label": "Words for keyboard detectives"}),
    ("refs", [
                 ("Typebar", "the metal arm that carries a letter up to the paper"),
                 ("Jam", "when two typebars crash and stick together"),
                 ("QWERTY", "the keyboard named for the first six letters of its top row"),
                 ("Home row", "the middle row of letters on a keyboard"),
                 ("Myth", "something many people believe that is not true")]),
    ("html", f'<div class="uranrow"><img src="{URANIA_PRINT}" alt=""><div><p class="label">The Urania, from the posters</p>'
             '<h3>Where the jams happened</h3><p>Behind the round keys, a curve of metal typebars waits. Press a key and its bar swings up to strike the paper. When typists went too quickly, two bars could meet and jam together.</p></div></div>'),
    ("cards", [
      ("The problem · 1868", ["Christopher Latham Sholes, a Milwaukee newspaper editor, was perfecting his “Type-Writer.” When typists worked too quickly, the metal arms carrying the letters jammed together."]),
      ("The solution", ["In the best-known account, Sholes split up letters that often go together, like TH and HE. The pattern put QWERTY across the top row, and it stopped the crashes."]),
      ("The myth", ["Sholes did not design QWERTY to slow typists down. He designed it to let them type as fast as possible without breaking the machine."]),
      ("Still here", ["Electric typewriters ended the jamming, but millions had learned QWERTY by then. Today’s touchscreens still use Sholes’ pattern, with no keys to jam."])]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Look at any keyboard: the top row starts Q, W, E, R, T, Y. In 1868 Christopher Latham Sholes was building a typewriter. When typists went too fast, the metal arms carrying the letters jammed together. His keyboard was his answer, and 150 years later it is still under your fingers."]


def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · QWERTY’s Accidental Empire", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO_HANDOUT}


def P(t):
    return ("html", f"<p>{t}</p>")


GREEN = handout("green", "WR_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Find the pairs",
            "blocks": [P("Color the <b>top row</b>. Then circle <b>T</b>, <b>H</b> and <b>E</b>."), ("html", W.keys(size=34, labels=True))],
            "body": ["*TH* and *HE* are letters that often go together. Are T and H side by side? Are H and E? Why would Sholes put them apart?"], "lines": 4}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Myth or fact?",
            "blocks": [P("Circle <b>Myth</b> or <b>Fact</b> for each sentence."), mf(MF)]}),
  ("task", {"label": "Part 3", "title": "Top-row words",
            "blocks": [P("<i>Typewriter</i> uses only letters from the top row. Check each word below. Does it use <b>only</b> top-row letters? Circle Yes or No."), wordcheck(WORDS_GREEN)]}),
  ("task", {"label": "Part 4", "title": "Why do we still use it?",
            "body": ["Electric typewriters stopped the jamming long ago. But millions of people had already learned QWERTY. Why do you think we still use it today?"], "lines": 3}),
  ("family", ["Find a keyboard at home, on a computer or a phone. Show your family the top row, and explain why T and H are not side by side."]),
], ".wordcheck { gap: 12pt 18pt; } .mf { gap: 10pt 14pt; }")

YELLOW = handout("yellow", "WR_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Cause and effect",
            "blocks": [P("Fill in the chain, in your own words. The first box is done for you."),
                       chain([("The problem", "Typists worked too quickly, and the metal arms jammed together."),
                              ("Sholes’ solution", ""), ("The result", ""), ("Today", "")])]}),
  ("task", {"label": "Part 2", "title": "Count the pairs",
            "blocks": [P("Here is a sentence from the poster. Underline every <b>TH</b>. Circle every <b>HE</b>. A word can have both."),
                       W.quote(["myth"], 2)],
            "body": ["**TH:** ______ times. **HE:** ______ times. Why did Sholes want letters like these apart?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Bust the myth",
            "body": ["Some people say: *“" + MYTH + "”* Use the poster sentence in Part 2 to explain why that is a myth."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Beat ten",
            "body": ["*Typewriter* has ten letters, all from the top row: Q W E R T Y U I O P. Find the longest top-row words you can. Check every letter."], "lines": 4}),
  ("task", {"label": "Part 5", "title": "Why QWERTY stayed",
            "body": ["*" + Q["muscle"] + "* What does *muscle memory* mean? Why would it make people keep QWERTY?"], "lines": 5}),
  ("family", ["Time your family typing the same sentence on a phone and on a keyboard. Then tell them QWERTY’s secret."]),
])

RED = handout("red", "WR_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "The bottom-row puzzle",
            "blocks": [P("The poster says the bottom row <i>“can barely form any words at all.”</i> Here it is:"), ("html", W.keys([W.BOTTOM], size=30))],
            "body": ["Look closely at its seven letters. Why is it so hard to make a word from them?"], "lines": 1}),
  ("task", {"label": "Part 2", "title": "A fair test?",
            "blocks": [W.quote(["dvorak", "navy"], 2)],
            "body": ["Two tests gave different answers. Why might a test **overseen by the inventor himself** be less trustworthy? How would you make a test of two keyboards fair?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Why QWERTY survived",
            "body": ["Electric typewriters had already stopped the jams. Businesses could not afford to retrain workers and buy new machines. Explain, in your own words, why the *first* keyboard beat a keyboard that claimed to be *better*."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Look closely",
            "blocks": [("html", f'<div class="uranrow"><img src="{URANIA_PRINT}" alt=""><div><p>This is the Urania on the exhibition’s posters. Its name, <b>Clemens Müller A.G. Dresden</b>, is on the base. Read the letters on its rows of keys.</p><p>What do you notice? What is different from the keyboard you use?</p></div></div>')],
            "lines": 3}),
  ("task", {"label": "Part 5", "title": "Invent a new way to type",
            "body": ["If you could invent a brand-new way to write or type, what would it be like? What would make people want to switch to it?"], "lines": 3}),
  ("family", ["Ask your family: *have you ever kept doing something one way just because everyone does it?* Then tell them how QWERTY became the world’s keyboard by being first."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
