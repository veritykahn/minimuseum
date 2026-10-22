"""Grades 5–8 · Art · "Small Works of Power"
A coin as a tiny work of art and a message: portrait, symbol and inscription,
and how a struck coin is made (and faked). Facts follow
app/exhibitions/in-their-hands/artifacts/coin-data.ts, the Gospel Timeline,
the posters and Real or Replica?"""

import re

C = "/exhibitions/in-their-hands/artifacts/coins/"
RF = "/exhibitions/in-their-hands/real-or-fake/"
DIR = "teachers/grades-5-8/art/"
TITLE = "Small Works of Power"
SUB = "Grades 5–8 · Art · Portrait, symbol and inscription"

HERO = {"img": "/exhibitions/in-their-hands/timeline/judas-tissot.jpg", "pos": "center 30%",
        "credit": "James Tissot (1836–1902), Brooklyn Museum"}

# pilate-front.png shows the simpulum (the obverse), pilate-back.png the
# three bound ears of grain; captions name what is pictured.
TRIBUTE = {"img": C + "tribute-front.png", "label": "Case 7 · Replica", "title": "The Tribute Penny",
           "body": ["Silver denarius, 14–37 AD. A museum-quality replica. One side carries the face of the emperor Tiberius; the other the inscription PONTIF MAXIM — *High Priest*."]}
TRIBUTE_BACK = {"img": C + "tribute-back.png", "label": "Case 7 · Replica · the reverse", "title": "PONTIF MAXIM",
                "body": ["The Tribute Penny’s reverse. The words are part of the design: they run around the edge and frame the seated figure."]}
PILATE = {"img": C + "pilate-front.png", "label": "Case 7 · Genuine", "title": "Pontius Pilate’s prutah",
          "body": ["Bronze, minted in 29/30 AD. One side carries a simpulum, a Roman libation ladle; the other, three bound ears of grain. No face at all."]}
HEROD = {"img": C + "herod-great-front.png", "label": "Case 6 · Genuine", "title": "Herod the Great’s prutah",
         "body": ["Bronze, 40–4 BC. It carries no human image, because Jewish law forbade it. Symbols take the place of a face."]}
SHEKEL = {"img": C + "shekel.png", "label": "Case 7 · Replica", "title": "The Shekel of Tyre",
          "body": ["Silver, 1 BC–1 AD. A museum-quality replica. Its face bears the pagan god Melqart, chief deity of Tyre — yet it was the only coin accepted for the Temple tax."]}

# ── lesson mode ─────────────────────────────────────────────────────────
# What students will be able to do, set up front in the plan and on the
# cover screen, then asked back as questions in the Look back. Each is
# (objective, the same as a question, go deeper?).
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("name the three things a coin designer works with: portrait, symbol and inscription",
     "find the portrait, symbol and inscription on a coin?", False),
    ("explain how the coins of the New Testament used them to declare power and belief",
     "explain how a coin’s design declares power and belief?", False),
    ("design a coin, front and back, that says something on purpose",
     "design a coin that says something on purpose?", False),
    ("read the clues that give a fake coin away, and explain what causes them",
     "read the clues that give a fake away, and explain what causes them?", True)],
  "why": "Coins, flags and logos all speak before anyone reads a word. Seeing how a design makes its claim lets you read every image that asks for your attention, and make your own say what you mean."}
LOOK_BACK = "Can you now…"
# the Look back, as the teacher says it; the screen sets the questions out
LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
                 "a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask a Red Level reader.")

# the objectives block's look, as in the Religion plan; the handouts print unchanged
OBJ_CSS = """
.objectives { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 8pt 12pt 3pt; margin-bottom: 12pt; }
.objectives h3 { font-size: 12.5pt; margin-bottom: 5pt; }
.objectives ol { margin: 0 0 7pt; padding: 0; list-style: none; counter-reset: obj; }
.objectives li { counter-increment: obj; display: grid; grid-template-columns: 16pt 1fr; margin: 0 0 3.5pt; font-size: 10pt; line-height: 1.4; }
.objectives li::before { content: counter(obj); font: 600 12.5pt/1.1 'Cormorant Garamond', serif; color: var(--gold-big); }
.objectives li.deep::before { color: #A8452F; }
.deeptag { font: 500 6.8pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #fff; background: #A8452F;
  padding: 1.5pt 5pt 1pt; border-radius: 99pt; margin-right: 3pt; vertical-align: 1pt; }
.why { border-top: .6pt solid #d8d0b8; padding-top: 5pt; }
.why b { font: 500 7pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 5pt; }
"""

# a little tighter on the page, so the plan keeps to three pages with its objectives
FIT_CSS = """
table.fill td { padding: 3pt 6pt 3.5pt 0; }
.gallery { display: grid; grid-auto-flow: column; grid-template-rows: auto 1fr; grid-template-columns: 1fr 1fr; column-gap: 20pt; }
.grow img { width: 56pt; height: 56pt; }
"""

# Said in the plan and shown on the classroom screen, so written once.
HOOK_QS = ["Who designed this?", "What did they choose to put on it, and what did they leave off?", "Who is it trying to impress?"]
LAST_Q = "What is the smallest thing you could make that would still say who you are?"

HOOK_COINS = [
  {"img": C + "tribute-front.png", "name": "The Tribute Penny", "sub": "Silver", "replica": True, "feature": False,
   "alt": "The Tribute Penny, a silver denarius of Tiberius: the emperor’s head. A museum-quality replica"},
  {"img": C + "shekel.png", "name": "The Shekel of Tyre", "sub": "Silver", "replica": True, "feature": False,
   "alt": "The Shekel of Tyre, a silver coin: the head of the god Melqart. A museum-quality replica"},
  {"img": C + "herod-great-front.png", "name": "Herod’s prutah", "sub": "Bronze", "feature": False,
   "alt": "Herod the Great’s bronze prutah: symbols and no human image"},
  {"img": C + "pilate-front.png", "name": "Pilate’s prutah", "sub": "Bronze", "feature": False,
   "alt": "Pontius Pilate’s bronze prutah: a simpulum, a Roman libation ladle"}]

TRIBUTE_SCREEN = {"img": C + "tribute-front.png", "label": "Case 7 · Ministry and Passion", "replica": True,
                  "title": "The Tribute Penny",
                  "facts": [("Coin", "Silver denarius"), ("Date", "14–37 AD"), ("Portrait", "The emperor Tiberius"),
                            ("Inscription", "PONTIF MAXIM")],
                  "body": ["The portrait says *this man rules*. The inscription, PONTIF MAXIM, means *High Priest*: it claims religious authority too. The letters run around the rim and frame the image."]}

# portrait, symbol and inscription, side by side: the three words of Part 1
ELEMENTS = [
  {"label": "Portrait", "text": "a picture of a person’s face",
   "items": [{"img": C + "tribute-front.png", "caption": "Tiberius", "sub": "Tribute Penny", "replica": True,
              "alt": "The Tribute Penny: the face of the emperor Tiberius. A museum-quality replica"},
             {"img": C + "shekel.png", "caption": "The god Melqart", "sub": "Shekel of Tyre", "replica": True,
              "alt": "The Shekel of Tyre: the face of the pagan god Melqart. A museum-quality replica"}]},
  {"label": "Symbol", "text": "an object that stands for an idea",
   "items": [{"img": C + "herod-great-front.png", "caption": "No human image", "sub": "Herod the Great",
              "alt": "Herod the Great’s prutah: symbols in place of a face"},
             {"img": C + "pilate-front.png", "caption": "A simpulum", "sub": "Pilate",
              "alt": "Pilate’s prutah: a simpulum, a Roman libation ladle"},
             {"img": C + "pilate-back.png", "caption": "Three ears of grain", "sub": "Pilate",
              "alt": "Pilate’s prutah, the other side: three bound ears of grain"}]},
  {"label": "Inscription", "text": "words written on the coin",
   "items": [{"img": C + "tribute-back.png", "caption": "PONTIF MAXIM", "sub": "“High Priest”", "replica": True,
              "alt": "The Tribute Penny’s reverse: a seated figure framed by the words PONTIF MAXIM. A museum-quality replica"}]}]

FAKE_PAIR = [
  {"label": "Lysimachus tetradrachm, from *Real or Replica?*",
   "text": "Both sides of each. A genuine coin was struck between two dies; a sand-cast fake was poured into a mold made in sand.",
   "items": [{"img": RF + "Lysimachus-real.png", "caption": "Genuine", "sub": "Struck", "aspect": 2.15,
              "alt": "The genuine coin, both sides: a portrait with sharp, individually defined curls of hair, and a seated figure"},
             {"img": RF + "Lysimachus-fake.png", "caption": "Sand-cast fake", "sub": "Cast", "aspect": 2.15,
              "alt": "The sand-cast fake, both sides: the same design, with a grainy surface and mushy, indistinct hair"}]}]

LESSON = {
  "slug": "small-works-of-power",
  "out": DIR + "ITH_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO,
  "css": "table.fill td { padding: 4pt 6pt 6pt 0; }" + OBJ_CSS + FIT_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Look and teach", 12, "#2F4A5A"), ("Design", 23, "#86671A"), ("Share", 5, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read a coin as a work of art that carries a message. They will identify the three elements a coin designer works with — **portrait**, **symbol** and **inscription** — and explain how the coins of the New Testament used them to declare power and belief: an emperor’s face, a pagan god, symbols chosen because a face was forbidden, and symbols chosen to provoke. They will learn how a coin was struck, read the clues that expose a fake, and design a coin of their own that says something on purpose."]}),
    ("section", {"label": "Skills and themes", "list": [
      "**Visual literacy** — reading image, symbol and text together as one message",
      "**Design** — composing inside a circle; letters as part of the design; front and back as a pair",
      "**Materials and process** — relief, the struck coin, and how casting and false dies betray themselves",
      "**Art and faith** — why Jewish law forbade human images on coins, and how sacred art tells a story"]}),
    ("section", {"label": "Materials needed", "list": [
      "The coin images on page 3, projected or printed; the exhibition online if you have a screen",
      "Any coin from a student’s pocket or purse, and a magnifying glass if you have one",
      "Pencils and fine black pens; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "The smallest public artwork",
      "screen": {"phase": "Hook", "show": "coins", "coins": HOOK_COINS,
                 "purpose": "Get students looking at a coin as a designed object with a message.",
                 "students": HOOK_QS},
      "body": [f"Hand a coin to a student and ask the class: *“{' '.join(HOOK_QS)}”* Then: *“Two thousand years ago, people in Jerusalem carried coins that made claims about gods and emperors. Some designs were chosen to cause offense. Today we read them as artists.”*"]}),
    ("section", {"label": "Look and teach · 12 minutes", "title": "Four design choices",
      "screen": [
        {"phase": "Look and teach", "minutes": 3, "script": [0], "title": "A ruler’s face", "show": "coin", "coin": TRIBUTE_SCREEN,
         "back": C + "tribute-back.png", "alt": "The Tribute Penny, a silver denarius of Tiberius: the emperor’s head",
         "backAlt": "The reverse of the Tribute Penny: a seated figure framed by the words PONTIF MAXIM",
         "purpose": "Read a portrait and an inscription working together on one coin.",
         "students": ["Find the **portrait**. Whose face is it?", "Find the **inscription**. What does it claim?",
                      "How do the letters frame the picture?"]},
        {"phase": "Look and teach", "minutes": 5, "script": [1, 2, 3], "title": "Portrait, symbol, inscription",
         "show": "gallery", "groups": ELEMENTS,
         "purpose": "Compare the three elements across four coins, and see that a symbol can say as much as a face.",
         "students": ["Why do Herod’s coins carry no face?", "Which speaks loudest: a ruler’s face, a god’s face, or a symbol?"]},
        {"phase": "Look and teach", "minutes": 4, "script": [4], "title": "Real or replica?", "show": "gallery", "groups": FAKE_PAIR,
         "purpose": "See how the way a coin is made shows in its surface, and how experts catch a fake.",
         "students": ["Compare the hair, the surface and the edge.", "Name one clue that gives the fake away."]}],
      "body": [
        "**A ruler’s face.** Show the Tribute Penny (a museum-quality replica). One side carries the face of the emperor Tiberius; the other reads PONTIF MAXIM — *High Priest*. The portrait says *this man rules*; the inscription claims religious authority too. Point out how the letters run around the rim and frame the image.",
        "**A god’s face.** Show the Shekel of Tyre (also a replica). Its face is the pagan god Melqart. The Temple accepted only this coin for its tax because its silver was so pure: the purity of the metal overrode the offensiveness of the image.",
        "**No face at all.** Show Herod the Great’s prutah. Herod’s coins carry no human image, because Jewish law forbade it. His designers had to say *king* with symbols alone.",
        "**Symbols that provoke.** Show Pontius Pilate’s prutah, minted in 29/30 AD. A simpulum, a Roman libation ladle, on one side; three bound ears of grain on the other. The exhibition calls both deliberately provocative pagan symbols on Jewish coinage. A symbol can be as loud as a face.",
        "**How a coin is made.** A genuine ancient coin was struck between two dies, one for each side. Striking leaves crisp detail and die-stress lines; two thousand years of handling soften the high points evenly. Forgers struggle to fake those marks — which is how experts catch them (page 3)."]}),
    ("section", {"label": "Design · 23 minutes",
      "screen": {"phase": "Design", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design a coin of their own at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Look closely at real coins, then design your own, front and back."]},
      "body": ["Students choose a handout. All three levels look at real coins, then design a coin of their own, front and back."]}),
    ("levels", {
      "green": "Label the portrait, symbol and inscription on the Tribute Penny and on Pilate’s prutah, match three words to their meanings, then design a coin with a picture on the front and words on the back.",
      "yellow": "Compare Herod the Great’s coin, which has no face, with the Tribute Penny, which does. Explain what each design says about its ruler, then design a coin with **no face** whose symbols carry a message.",
      "red": "Analyze how three coins communicate power and belief, critique a sand-cast fake from *Real or Replica?* by its visual clues, then design a coin and write an artist’s rationale for every choice."}),
    ("section", {"label": "Share · 5 minutes",
      "screen": [
        {"phase": "Share", "minutes": 2, "script": [0], "title": "Gallery walk", "show": "question", "question": LAST_Q,
         "purpose": "Hear what each design says, in a classmate’s words.",
         "students": ["Point to one choice on a classmate’s coin.", "Say what message it sends."]},
        {"phase": "Share", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": [f"Lay the designs out as a gallery. Each student points to one choice on a classmate’s coin and says what message it sends. Close with the question the coins keep asking: *{LAST_Q[0].lower() + LAST_Q[1:]}*",
               LOOK_BACK_SAY]}),
    ("connection", ["**Visit the exhibition:** the four coins of this lesson sit in Cases 6 and 7, each with a magnified view of both sides. Then play *Real or Replica?* — five pairs of ancient coins, one genuine and one fake. All of it is online too."]),
    ("section", {"label": "Show your class", "title": "Design elements, up close", "body": ["Project or print this page for *Look and teach*, or take it to Cases 6 and 7. The Tribute Penny and the Shekel of Tyre are museum-quality replicas; Herod’s and Pilate’s coins are genuine."]}),
    ("gallery", [
      {"label": "Portrait and inscription · a face and words that claim power", "items": [
        {"img": C + "tribute-front.png", "cap": "Tribute Penny · Tiberius · replica"},
        {"img": C + "tribute-back.png", "cap": "Tribute Penny reverse · PONTIF MAXIM"},
        {"img": C + "shekel.png", "cap": "Shekel of Tyre · Melqart · replica"}]},
      {"label": "Symbol · an object that stands for an idea", "items": [
        {"img": C + "herod-great-front.png", "cap": "Herod the Great · no human image"},
        {"img": C + "pilate-front.png", "cap": "Pilate · the simpulum"},
        {"img": C + "pilate-back.png", "cap": "Pilate · three bound ears of grain"}]},
    ]),
    ("section", {"label": "From Real or Replica?", "title": "How a fake gives itself away"}),
    ("table", {"head": ["How the fake was made", "The visual clue"], "rows": [
      ["**Casting** — molten metal poured into a mold of a real coin", "An unnaturally uniform surface; no die-stress lines; small bubbles; softer detail, like the blurred feathers on the fake owl"],
      ["**Sand casting** — a real coin pressed into fine sand to make the mold", "A grainy, soft surface; mushy hair on the portrait; a different edge; patina sitting on the surface"],
      ["**Die transfer** — a mold from a genuine die, struck on a new blank", "Flatter and grayer; details lack the sharpness of the original strike"],
      ["**False dies** — hand-engraved copies of the original dies", "Artificial wear from a tumbler or sandpaper instead of high points softened evenly"],
      ["**Modern reproduction** — a widow’s mite made new", "Too clean, too symmetrical; a genuine lepton is crude and off-center"]]}),
    ("section", {"label": "Questions to ask in front of the case", "list": [
      "Cover the inscription on the Tribute Penny with your thumb. What does the coin still say? What does it lose?",
      "Herod’s designers could not use a face. If you had to say *king* without a face, what would you draw?",
      "Why might a ladle or three ears of grain offend more than an emperor’s portrait?",
      "The Temple accepted a coin with a pagan god on it because its silver was pure. What does that tell you about how people valued the image and the metal?"]}),
    # after the page to show the class, so the plan keeps to three pages with its objectives
    ("cols", [
      [("section", {"label": "Visual storytelling", "body": [
        "The Gospel Timeline sets each of the eleven coins beside its scripture passage and a painting. Nine of the paintings are by James Tissot (1836–1902). Ask students how a painting tells a story over a whole wall while a coin must say everything inside one small circle — and which one they would trust more as evidence."]})],
      [("section", {"label": "Cross-curricular and assessment notes", "list": [
        "**Religion:** Matthew 22:15–22 — *“Whose image is this? And whose inscription?”*; Exodus 20:4, the commandment against carved images",
        "**Social Studies:** the coins show who governed — emperor, client king, prefect",
        "**Science:** patina, alloy and wear as evidence of age",
        "**Assessment:** the coin design and its explanation; an exit ticket — *“Name one choice on your coin and the message it sends.”*"]})]]),
  ]}


def handout(level, out, blocks, context, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": context, "css": css,
            "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level", "blocks": blocks, "hero": HERO}

CONTEXT = ["Every coin is a tiny work of art. Before anyone could read it, they could see it: a face, a symbol, a ring of letters. Two thousand years ago, rulers in Jerusalem and Rome chose those designs carefully, because a coin passed through every hand in the land."]

FRONT_BACK = ("cols", [[("coindraw", "Front")], [("coindraw", "Back")]])

def P(t):
    """A paragraph set before a task's own blocks (a task's body follows them)."""
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return ("html", "<p>" + re.sub(r"\*(.+?)\*", r"<i>\1</i>", t) + "</p>")

COIN_CSS = (".coin { grid-template-columns: 70pt 1fr; gap: 9pt; } .coin img { width: 70pt; height: 70pt; } "
            ".coin h4 { font-size: 11pt; } .coin figcaption p { font-size: 9pt; line-height: 1.35; } ")

GREEN = handout("green", "ITH_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Three words for reading a coin",
            "blocks": [P("Coin designers work with three things. Learn the words, then find them."),
                       ("refs", [("Portrait", "a picture of a person’s face"),
                                 ("Symbol", "an object that stands for an idea"),
                                 ("Inscription", "words written on the coin")])]}),
  ("task", {"label": "Part 2", "title": "Look closely at two coins",
            "blocks": [("cols", [[("coin", TRIBUTE)], [("coin", PILATE)]])],
            "body": ["Fill in the table. Write **yes** or **no**, then say what you see."]}),
  ("table", {"head": ["Does it have…", "The Tribute Penny", "Pilate’s prutah"], "rows": [
      ["A **portrait**? Whose?", "", ""], ["A **symbol**? What?", "", ""], ["An **inscription**?", "", ""]]}),
  ("task", {"label": "Part 3", "title": "What does each coin say?",
            "blocks": [P("The Tribute Penny shows the emperor’s face. Pilate’s coin shows a ladle used in pagan worship and three ears of grain. Finish each sentence."),
                       P("**The Tribute Penny says:** the emperor is…"), ("lines", 1),
                       P("**Pilate’s coin says:** Rome is…"), ("lines", 1)]}),
  ("task", {"label": "Part 4", "title": "Design your own coin",
            "blocks": [P("Draw a **portrait** or a **symbol** on the front. On the back, write an **inscription** around the edge and add one small symbol in the middle."),
                       FRONT_BACK]}),
  ("task", {"label": "Part 5", "title": "Tell us about it",
            "body": ["My coin shows ____________ because…"], "lines": 3}),
  ("connection", ["At the exhibition, look at each coin in Cases 6 and 7. Count how many have a face and how many have only symbols."]),
], CONTEXT, css=COIN_CSS + ".coindraw > div { width: 140pt; height: 140pt; }")

YELLOW = handout("yellow", "ITH_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Two ways to show a ruler",
            "blocks": [P("Herod the Great ruled Judaea as a client king of Rome. Tiberius was the Roman emperor. Compare their coins."),
                       ("cols", [[("coin", HEROD)], [("coin", TRIBUTE)]])]}),
  ("table", {"head": ["", "Herod the Great", "The Tribute Penny"], "rows": [
      ["What is in the center?", "", ""], ["Is there a human face?", "", ""], ["What does the design say about the ruler?", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Why no face?",
            "body": ["Jewish law forbade human images on coins, following the commandment against carved images (Exodus 20:4). Herod was king of a Jewish land, so his designers spoke with symbols. How is a coin with no face a message in itself? What does it tell you about the people who would carry it?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "A symbol can shout",
            "body": ["Pontius Pilate’s coins carried no face either. Instead he chose a simpulum, a ladle used in pagan worship, and three bound ears of grain — symbols the exhibition calls *deliberately provocative*. Why can a symbol make people as angry as a face?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Design a coin with no face",
            "blocks": [P("Design like Herod’s mint: **no human face allowed.** Choose an idea you want to stand for — courage, peace, home, faith, welcome. Use symbols and an inscription to say it."),
                       FRONT_BACK]}),
  ("task", {"label": "Part 5", "title": "Explain your symbols",
            "body": ["What idea does your coin carry? Name each symbol and what it stands for. Why does your inscription fit the design?"], "lines": 3}),
  ("connection", ["In Case 7, find the Shekel of Tyre. It carries the face of the god Melqart, yet it was the only coin accepted for the Temple tax. Was the Temple valuing the image or the silver?"]),
], CONTEXT, css=COIN_CSS + "table.fill td:first-child { width: 34%; }")

RED = handout("red", "ITH_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Power and belief in three designs",
            "blocks": [P("For each coin, note what the image and inscription show, and what message the design sends about who holds power and what they believe."),
                       ("coins", [
                {"img": C + "tribute-front.png", "cap": "**Tribute Penny** (replica). Tiberius’ face; the reverse reads PONTIF MAXIM, *High Priest*"},
                {"img": C + "shekel.png", "cap": "**Shekel of Tyre** (replica). The pagan god Melqart; the only coin accepted for the Temple tax"},
                {"img": C + "pilate-back.png", "cap": "**Pilate’s prutah**, 29/30 AD. A simpulum and three bound ears of grain; no face"}])]}),
  ("table", {"head": ["Coin", "Image and inscription", "Message about power or belief"], "rows": [
      ["The Tribute Penny", "", ""], ["The Shekel of Tyre", "", ""], ["Pilate’s prutah", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Which design speaks loudest?",
            "body": ["For the Temple, the purity of the Shekel’s silver overrode the offensiveness of its image. Pilate’s symbols were chosen to provoke. Which design communicates power most forcefully — a ruler’s face, a god’s face, or a symbol? Use what you see on the coins."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Critique a fake",
            "blocks": [("html", '<div class="rf"><figure><img src="' + RF + 'Lysimachus-real.png" alt=""><figcaption>Genuine</figcaption></figure>'
                                '<figure><img src="' + RF + 'Lysimachus-fake.png" alt=""><figcaption>Sand-cast fake</figcaption></figure></div>')],
            "body": ["A genuine coin was struck between two dies. A sand-cast fake is made by pressing a real coin into fine sand and pouring molten metal into the mold. Name **three** visual clues that give this fake away — surface, portrait, edge or patina — and explain how the way it was made causes each one."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Design a coin, with a rationale",
            "blocks": [P("Design a coin for a ruler, a cause or a community: portrait or symbol? Which words, and where? Then write your rationale: what message does each choice send, and whom might it offend or welcome?"),
                       ("cols", [[("cols", [[("coindraw", "Front")], [("coindraw", "Back")]])], [("lines", 6)]])]}),
  ("connection", ["Play *Real or Replica?* at the exhibition or online: five pairs, five ways to fake a coin. Can you spot every one by its visual clues?"]),
], CONTEXT, css=".rf { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 2pt 0 8pt; break-inside: avoid; } .rf figure { margin: 0; text-align: center; } .rf img { width: 100%; height: 80pt; object-fit: contain; } .rf figcaption { font: 500 7.5pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #3f3e3a; margin-top: 3pt; } .coinrow figcaption { text-align: left; } .cols .cols { gap: 8pt; } .coindraw > div { width: 116pt; height: 116pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
