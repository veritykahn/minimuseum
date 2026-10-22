"""Grades 5–8 · Social Studies · "Who Ruled Judaea?"
The coins of emperors, Herod's family, Roman governors and a neighboring
king, read as primary sources for how Roman power was layered in the New
Testament. Facts follow app/exhibitions/in-their-hands/artifacts/coin-data.ts
and timelineStops in app/exhibitions/in-their-hands/timeline/page.tsx."""

C = "/exhibitions/in-their-hands/artifacts/coins/"
DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Who Ruled Judaea?"
SUB = "Grades 5–8 · Social Studies · Coins as primary sources"

HERO = {"img": "/exhibitions/in-their-hands/timeline/festus-surikov.jpg", "pos": "center 35%",
        "credit": "Vasily Surikov (1848–1916)"}

# ── the coins, as museum labels ────────────────────────────────────────
HEROD = {"img": C + "herod-great-front.png", "label": "Case 6",
         "title": "Herod the Great",
         "facts": [("Coin", "Bronze prutah"), ("Date", "40–4 BC"), ("Scripture", "Matthew 2:13")],
         "body": ["Herod ruled Judaea as a client king of Rome from 37 BC until his death in 4 BC. His coins carry **no human image** — Jewish law forbade it — so their symbols show a constant compromise between Roman authority and Jewish practice."]}
PILATE = {"img": C + "pilate-front.png", "label": "Case 7",
          "title": "Pontius Pilate",
          "facts": [("Coin", "Bronze prutah"), ("Date", "29/30 AD"), ("Dated by", "Tiberius’ 16th year"), ("Scripture", "Matthew 27:24")],
          "body": ["Pilate was the Roman prefect of Judaea from 26 to 36 AD. One side shows a simpulum, a Roman ladle for pouring offerings; the other, three bound ears of grain. Both are pagan symbols, **deliberately provocative** on Jewish coinage."]}

ALL = [  # mixed on purpose, so the sorting is the students' work
  {"img": C + "herod-great-front.png", "cap": "**Herod the Great**<br>client king of Judaea for Rome, 37–4 BC"},
  {"img": C + "augustus-front.png", "cap": "**Augustus**<br>ruled the Roman Empire, 27 BC–14 AD"},
  {"img": C + "aretas-front.png", "cap": "**Aretas IV**<br>king of Nabataea, east of Judaea"},
  {"img": C + "pilate-front.png", "cap": "**Pontius Pilate**<br>prefect of Judaea, 26–36 AD"},
  {"img": C + "tribute-front.png", "cap": "**Tiberius**<br>the Caesar on the Tribute Penny (replica)"},
  {"img": C + "antipas-front.png", "cap": "**Herod Antipas**<br>son of Herod; tetrarch of Galilee (replica)"},
  {"img": C + "agrippa-front.png", "cap": "**Herod Agrippa I**<br>grandson of Herod; made king, 41 AD"},
  {"img": C + "claudius-front.png", "cap": "**Claudius**<br>reigned from Rome, 41–54 AD"},
  {"img": C + "festus-front.png", "cap": "**Porcius Festus**<br>procurator of Judaea, c. 59–62 AD"},
]

def coinrow(items, label=None):
    """A row of coins whose captions may break onto a second line."""
    lab = f'<p class="label rowlab">{label}</p>' if label else ""
    figs = "".join(f'<figure><img src="{c["img"]}" alt=""><figcaption>{_md(c["cap"])}</figcaption></figure>' for c in items)
    return lab + f'<div class="coinrow" style="--n:{len(items)}">{figs}</div>'

def _md(t):
    import re
    t = re.sub(r"((?:c\. )?\d+(?: BC)?–\d+ (?:BC|AD))", r'<span style="white-space:nowrap">\1</span>', t)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)

# ── the chart: who ruled when ──────────────────────────────────────────
CHART = [
  # ruler, title, where, years, coin, scripture
  ("Augustus", "Emperor", "Rome", "ruled 27 BC–14 AD", "Bronze as, 5–4 BC", "Luke 2:1 · the census"),
  ("Herod the Great", "Client king of Rome", "Judaea", "ruled 37–4 BC", "Bronze prutah, 40–4 BC", "Matthew 2:13 · the flight into Egypt"),
  ("Aretas IV", "King", "Nabataea, east of Judaea", "coin 9 BC–40 AD", "Bronze prutah", "Mark 6:17–18 · 2 Cor 11:32–33"),
  ("Tiberius", "Emperor", "Rome", "coin 14–37 AD", "Silver denarius · *replica*", "Matthew 22:21 · the tax question"),
  ("Pontius Pilate", "Roman prefect", "Judaea", "26–36 AD", "Bronze prutah, 29/30 AD", "Matthew 27:24 · the trial"),
  ("Herod Antipas", "Tetrarch; son of Herod", "Galilee", "coin 4 BC–39 AD", "Bronze prutah · *replica*", "Luke 23:9 · Jesus’ silence"),
  ("Herod Agrippa I", "King; grandson of Herod", "Judaea", "king from 41 AD; coin 41–44 AD", "Bronze prutah", "Acts 12:2–3 · James and Peter"),
  ("Claudius", "Emperor", "Rome", "reigned 41–54 AD", "Bronze as", "Acts 18:2 · Jews leave Rome"),
  ("Porcius Festus", "Roman procurator", "Judaea", "c. 59–c. 62 AD", "Bronze prutah", "Acts 25:12 · Paul appeals to Caesar"),
]

CHART_CSS = """
table.chart { width: 100%; border-collapse: collapse; font-size: 8.6pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text);
  text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.chart td { border-bottom: .6pt solid #c8c5bb; padding: 4.5pt 6pt 4.5pt 0; vertical-align: top; }
table.chart td:nth-child(2) { font-weight: 500; }
table.chart td.th { width: 36pt; padding: 2pt 6pt 2pt 0; }
table.chart td.th img { width: 30pt; height: 30pt; object-fit: contain; display: block; }
table.chart td { vertical-align: middle; }
table.chart tr.lvl td { background: #f6f1e4; font: 500 7pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #5F6655; padding: 3pt 6pt; }
"""

IMG = {"Augustus": "augustus", "Herod the Great": "herod-great", "Aretas IV": "aretas", "Herod Antipas": "antipas",
       "Tiberius": "tribute", "Pontius Pilate": "pilate", "Herod Agrippa I": "agrippa", "Claudius": "claudius",
       "Porcius Festus": "festus"}

def chart():
    head = "".join(f"<th>{h}</th>" for h in ["", "Ruler", "Title", "Where", "Years", "Coin in the exhibition", "Scripture"])
    rows = ""
    for r in CHART:
        cells = [f'<td class="th"><img src="{C}{IMG[r[0]]}-front.png" alt=""></td>']
        for c in r:
            if c.count("*") == 2:
                a, b, d = c.split("*")
                c = f"{a}<i>{b}</i>{d}"
            cells.append(f"<td>{c}</td>")
        rows += "<tr>" + "".join(cells) + "</tr>"
    return f'<table class="chart"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'

# ── lesson mode ────────────────────────────────────────────────────────
# What students will be able to do, set up front in the plan and on the
# cover screen, then asked back as questions in the Look back. Each is
# (objective, the same as a question, go deeper?).
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read a coin as a primary source: who made it, for whom, and what its design reveals",
     "read a coin as a primary source?", False),
    ("name the four kinds of ruler in New Testament Judaea, and say who answered to whom",
     "name the four kinds of ruler, and say who answered to whom?", False),
    ("use the trials of Jesus and Paul to show how power was layered",
     "show how the trials of Jesus and Paul reveal layered power?", False),
    ("corroborate a coin with independent evidence, and judge what coins cannot prove",
     "corroborate a coin, and judge what it cannot prove?", True)],
  "why": "No single person ruled Judaea in Jesus’ lifetime. Coins show us who held power, and checking one source against another is how historians decide what to trust."}
LOOK_BACK = "Can you now…"
# the Look back, as the teacher says it; the screen sets the questions out
LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
                 "a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask a Red Level reader.")

# the four cards in one row and the chart a little tighter, so the plan keeps
# to three pages with its objectives
FIT_CSS = """
.cards { grid-template-columns: repeat(4, 1fr); gap: 7pt; }
.card { padding: 6pt 8pt 2pt; }
.card .cn { display: none; }
.card h4 { margin-top: 0; }
.card p { font-size: 8.6pt; line-height: 1.36; }
.pb { break-after: auto; height: 0; } .pb + .sec { break-before: page; }
table.chart td { padding-top: 3.5pt; padding-bottom: 3.5pt; }
table.chart td.th img { width: 27pt; height: 27pt; }
"""

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

def coin(key, name, sub, alt, replica=False):
    c = {"img": f"{C}{key}-front.png", "name": name, "sub": sub, "alt": alt, "feature": False}
    if replica:
        c["replica"] = True
    return c

def item(key, caption, sub, alt, replica=False):
    i = {"img": f"{C}{key}-front.png", "caption": caption, "sub": sub, "alt": alt}
    if replica:
        i["replica"] = True
    return i

HOOK_COINS = [
  coin("tribute", "Tiberius", "The Tribute Penny",
       "The Tribute Penny, a silver denarius of Tiberius: the emperor’s head. A museum-quality replica", True),
  coin("pilate", "Pontius Pilate", "Bronze prutah",
       "Pontius Pilate’s bronze prutah: a simpulum, a Roman ladle for pouring offerings, and no face")]

# the four kinds of ruler, from the cards below, each with its coins
FOUR_KINDS = [
  {"label": "The emperor in Rome",
   "text": "Ruled the whole Roman Empire from Rome. Augustus never visited Judaea, yet his census sent Mary and Joseph to Bethlehem.",
   "items": [item("augustus", "Augustus", "27 BC–14 AD", "A bronze coin of Augustus: the emperor’s head"),
             item("tribute", "Tiberius", "The Tribute Penny", "The Tribute Penny of Tiberius: the emperor’s head. A museum-quality replica", True),
             item("claudius", "Claudius", "41–54 AD", "A bronze coin of the emperor Claudius: his head")]},
  {"label": "Herod’s family",
   "text": "Local rulers for Rome. Herod’s coins carry no human image: Jewish law forbade it.",
   "items": [item("herod-great", "Herod the Great", "37–4 BC", "Herod the Great’s bronze prutah: symbols and no human image"),
             item("antipas", "Herod Antipas", "Galilee", "The bronze prutah of Herod Antipas, tetrarch of Galilee. A museum-quality replica", True),
             item("agrippa", "Agrippa I", "From 41 AD", "The bronze prutah of Herod Agrippa I")]},
  {"label": "The Roman governors",
   "text": "Roman governors of Judaea. Pilate dated his coin by the sixteenth year of Tiberius.",
   "items": [item("pilate", "Pilate", "26–36 AD", "Pontius Pilate’s bronze prutah: a simpulum, a Roman ladle"),
             item("festus", "Festus", "c. 59–62 AD", "The bronze prutah of Porcius Festus")]},
  {"label": "Beyond the border",
   "text": "Aretas IV ruled the Nabataean Kingdom, east of Judaea. When Antipas divorced his daughter, Aretas went to war against him.",
   "items": [item("aretas", "Aretas IV", "Nabataea", "The bronze prutah of Aretas IV, king of Nabataea")]}]

# the passage, in the Gospel Timeline's own wording
VERSE_ACTS = {"text": "Paul answered: ‘I am now standing before Caesar’s court, where I ought to be tried. I have not done any wrong to the Jews, as you yourself know very well. I appeal to Caesar!’ After Festus had conferred with his advisers, he declared: ‘You have appealed to Caesar. To Caesar you will go!’",
              "ref": "Acts 25:10–12"}

# the chart on page 3, for the projector: ruler, title, where, years, scripture
CHART_SCREEN = {"caption": "Who ruled when: every ruler with a coin in the exhibition, in the order the exhibition shows them",
                "columns": ["Ruler", "Title", "Where", "Years", "Scripture"],
                "rows": [{"img": f"{C}{IMG[r[0]]}-front.png", "cells": [r[0], r[1], r[2], r[3], r[5]],
                          **({"replica": True} if "replica" in r[4] else {})} for r in CHART]}

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "who-ruled-judaea",
  "out": DIR + "ITH_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": CHART_CSS + OBJ_CSS + FIT_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 13, "#2F4A5A"), ("Activity", 20, "#86671A"), ("Debrief", 7, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will use coins as primary sources to describe how power was layered in New Testament Judaea: an **emperor** in Rome, **local rulers from Herod’s family**, and **Roman governors**, with an independent **neighboring king** across the border. They will read what a coin’s design reveals about its maker and its audience, and practice **corroboration** — checking one source against independent evidence — using the Pilate stone, Josephus and Suetonius."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Historical thinking** — sourcing a primary source; corroborating it with independent evidence; telling what a source can and cannot show",
      "**Civics and government** — empire, client king, tetrarch, prefect and procurator: who answered to whom",
      "**Chronology** — BC and AD; dating a coin by the year of an emperor’s reign",
      "**Geography** — Rome, Judaea, Galilee, Nabataea, Caesarea Maritima, Corinth and Damascus"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Who ruled when* chart on page 3, projected or printed",
      "Luke 23:6–12 and Acts 25:10–12, in Bibles or projected; the Gospel Timeline on a screen if you have one",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A face, and no face",
      "screen": {"phase": "Hook", "show": "coins", "coins": HOOK_COINS,
                 "purpose": "Start reading coins as messages from the people in charge.",
                 "students": ["One coin shows a face, one a ladle. Who made each one?",
                              "Why would they choose such different pictures?"]},
      "body": ["Show the Tribute Penny beside Pilate’s prutah. Both were in people’s hands in Judaea in Jesus’ lifetime. *“One shows a man’s face. The other shows a ladle and three ears of grain. Who made each one — and why would they choose such different pictures?”* Take guesses, then: *“Coins are messages from the people in charge. Today we use them to find out who was in charge.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Four kinds of power, one small land",
      "screen": [
        {"phase": "Teach", "minutes": 8, "script": [0], "title": "Four kinds of power", "show": "gallery", "groups": FOUR_KINDS,
         "purpose": "Set out the four layers of power the coins reveal, and who sat at the top.",
         "students": ["Name one ruler of each kind.", "Who did a Roman governor answer to?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Who answered to whom?", "show": "painting", "img": HERO,
         "verse": VERSE_ACTS,
         "alt": "Paul, standing in a gray robe, makes his case to three seated rulers in a Roman hall; painted by Vasily Surikov",
         "purpose": "See the layers of power at work in two trials.",
         "students": ["Pilate sent Jesus to Herod Antipas. Why him?", "Paul went over the governor’s head. To whom?"]}],
      "body": ["Walk through the four kinds of ruler on the chart (page 3), showing each coin.", "Then show the layers at work: Pilate sent Jesus to Antipas because Jesus was from Galilee, Antipas’s territory (Luke 23:6–12); Paul, a Roman citizen, went over the governor’s head — *“I appeal to Caesar!”* (Acts 25:10–12). Ask: *who answered to whom?*"]}),
    ("cards", [
      ("The emperor in Rome", ["Augustus (27 BC–14 AD) never visited Judaea, yet his census sent Mary and Joseph to Bethlehem. The Tribute Penny carries Tiberius’ face and the title PONTIF MAXIM — *High Priest*. Claudius (41–54 AD) expelled Jews from Rome."]),
      ("Herod’s family", ["Herod the Great was client king of Judaea for Rome, 37–4 BC. His son Antipas was tetrarch of Galilee; his grandson Agrippa I was made king by the emperor Caligula in 41 AD. Herod’s coins carry no human image: Jewish law forbade it."]),
      ("The Roman governors", ["Pilate was prefect, 26–36 AD; Festus succeeded Felix as procurator in about 59 AD. Pilate’s coin is dated by the sixteenth year of Tiberius — the governor counted time by the emperor — and its pagan symbols were deliberately provocative."]),
      ("Beyond the border", ["Aretas IV ruled the Nabataean Kingdom east of Judaea, on the caravan routes from Arabia to the Mediterranean. His daughter was Herod Antipas’s first wife; when Antipas divorced her, Aretas went to war against him."])]),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice reading coins as sources at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three levels work from the same rulers and the same coins."]},
      "body": ["Students choose a handout. All three levels work from the same rulers and the same coins."]}),
    ("levels", {
      "green": "Sort nine rulers by their coins into emperor, Herod’s family, Roman governor or neighboring king; complete a guided timeline; answer *who would you be sent to?*",
      "yellow": "Analyze Herod’s and Pilate’s prutahs as primary sources. Complete the ruler chart, then explain what the trials of Jesus and Paul show about layered power.",
      "red": "Test three New Testament claims against coins, the Pilate stone, Josephus and Suetonius. Then argue what coins can prove about the past, and what they cannot."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Who was really in charge?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Who ruled when", "show": "chart", **CHART_SCREEN,
         "purpose": "Pull the lesson together on one chart, then ask how a claim can be checked.",
         "students": ["Place one ruler: his kind of power, and his coin’s clue.",
                      "How could we check what the Gospels and Acts say about him?"]},
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Each group places one ruler on the chart and gives its clue. Then ask: *a coin shows who claimed power — how can we check what the Gospels and Acts say about these rulers?* Let Red-level students answer.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green sort:** emperors — Augustus, Tiberius, Claudius; Herod’s family — Herod the Great, Antipas, Agrippa I; governors — Pilate, Festus; neighboring king — Aretas IV. Timeline: Herod the Great (37 BC, 4 BC), Augustus, Pilate, Agrippa I, Festus. Pilate sent Jesus to **Herod Antipas**; Paul appealed to **Caesar**, the emperor.",
      "**Exit ticket:** *name one ruler, his level of power, and one piece of evidence that he was real.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Who ruled when",
      "body": ["Project or print this page for the lesson and the debrief. Every ruler here has a coin in the exhibition, listed in the order the exhibition shows them. Dates are as the exhibition gives them; where it gives only the coin’s dates, the chart says so."]}),
    ("html", chart()),
    ("section", {"label": "Historical framework", "title": "Reading a coin as a source",
      "body": [
        "**Who made it, and for whom?** A coin is an official message in metal. Herod’s prutah was made to be acceptable to Jewish users; Pilate’s was not. Design is evidence of what a ruler wanted, and of whom he was willing to offend.",
        "**Corroboration.** A coin shows that a ruler held power and issued money; it grows stronger when independent sources agree. For decades some scholars questioned whether Pilate was a historical figure, until a limestone block bearing his name and title was found at Caesarea Maritima in 1961 (now in the Israel Museum). His coins had been evidence all along. Josephus (*Antiquities* 19.8.2) describes the death of Agrippa I in terms almost identical to Acts 12:23; Suetonius (*Claudius* 25.4) confirms Claudius’s expulsion of Jews from Rome, about 49 AD.",
        "**Limits.** Coins circulate long after they are minted: the widow’s lepton, struck under the Hasmonaean king Alexander Jannaeus, was still in use a century later. Three coins here — the Tribute Penny, the Shekel of Tyre and Herod Antipas — are museum-quality replicas, because originals are exceptionally rare."]}),
    # after the chart, so the plan keeps to three pages with its objectives
    ("connection", ["**Visit the exhibition:** the cases run in order — the rulers of the Nativity in Case 6, of the trial in Case 7, of the apostles in Case 8. At each case, have students name each coin’s level of power. Online, the Gospel Timeline sets all eleven coins beside their passages."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": css}

CONTEXT = ["In Jesus’ lifetime, no single person ruled Judaea. An emperor in Rome, kings from Herod’s family and Roman governors all held power there — and each of them made coins. Two thousand years later, those coins are evidence you can hold of who was in charge."]

KEY = ("refs", [
  ("Emperor", "the Caesar who ruled the whole Roman Empire from Rome"),
  ("King, tetrarch", "a local ruler from Herod’s family"),
  ("Prefect, procurator", "a Roman governor of Judaea"),
  ("Neighboring king", "a king of a different land beside Judaea")])

TIMELINE_CSS = """
.tl { position: relative; height: 118pt; margin: 6pt 0 8pt; break-inside: avoid; }
.tl .axis { position: absolute; left: 0; right: 6pt; top: 57pt; height: 2pt; background: #1d1c1a; }
.tl .axis::after { content: ""; position: absolute; right: -6pt; top: -4pt; border: 5pt solid transparent; border-left: 7pt solid #1d1c1a; border-right: 0; }
.tl .zero { position: absolute; top: 49pt; height: 18pt; border-left: 1.4pt dashed #1d1c1a; }
.tl .zero span { position: absolute; top: 20pt; left: -15pt; font: 500 7pt 'Outfit'; letter-spacing: .12em; white-space: nowrap; }
.tl .m { position: absolute; width: 100pt; margin-left: -50pt; text-align: center; font: 400 7.8pt/1.25 'Outfit'; }
.tl .m::after { content: ""; position: absolute; left: 50%; border-left: 1pt solid #1d1c1a; }
.tl .m.up { bottom: 67pt; } .tl .m.up::after { top: 100%; height: 6pt; }
.tl .m.dn { top: 65pt; } .tl .m.dn::after { bottom: 100%; height: 6pt; }
.tl .m.left { margin-left: -10pt; text-align: left; } .tl .m.left::after { left: 10pt; }
.tl .m.right { margin-left: -90pt; text-align: right; } .tl .m.right::after { left: auto; right: 10pt; }
.tl .m b { font-weight: 500; }
.tl .m i { display: block; height: 17pt; border-bottom: .8pt solid #6f6c62; margin: 0 0 2pt; }
.tl .m.dn i { margin: 2pt 0 0; }
table.fill td:first-child { width: auto; }
table.sort th { width: 25%; }
table.sort td { height: 24pt; padding: 0; }
"""

def timeline():
    # 40 BC to 65 AD, 105 years across the width
    def x(y): return (y + 40) / 105 * 100
    marks = [(-37, "up left", "37 BC", "becomes client king"),
             (-27, "dn", "27 BC", "begins to rule the empire"),
             (-4, "up", "4 BC", "dies; his son rules Galilee"),
             (26, "dn", "26 AD", "becomes prefect"),
             (41, "up", "41 AD", "made king by Caligula"),
             (59, "dn right", "c. 59 AD", "becomes procurator")]
    m = ""
    for y, c, d, t in marks:
        txt = f"<b>{d}</b> · {t}"
        inner = f"<i></i>{txt}" if "up" in c else f"{txt}<i></i>"
        m += f'<div class="m {c}" style="left:{x(y):.1f}%">{inner}</div>'
    return (f'<div class="tl"><div class="axis"></div><div class="zero" style="left:{x(0):.1f}%"><span>BC | AD</span></div>'
            f'{m}</div>')

GREEN = handout("green", "ITH_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Meet the rulers",
            "blocks": [("html", "<p>Every ruler here made a coin that is in the exhibition. Read each clue.</p>" + coinrow(ALL[:5]) + coinrow(ALL[5:]))]}),
  ("task", {"label": "Part 2", "title": "Sort them by power",
            "blocks": [KEY],
            "body": ["Write each ruler’s name in the correct column. One column has only one name."]}),
  ("html", '<table class="fill sort"><thead><tr><th>Emperor in Rome</th><th>Herod’s family</th><th>Roman governor</th><th>Neighboring king</th></tr></thead><tbody>'
           + "<tr><td></td><td></td><td></td><td></td></tr>" * 3 + "</tbody></table>"),
  ("task", {"label": "Part 3", "title": "Put them on the timeline",
            "blocks": [("html", "<p>Write the ruler’s name on each line, using the clues in Part 1. Years BC count down toward the line marked BC | AD; years AD count up from it.</p>" + timeline())]}),
  ("task", {"label": "Part 4", "title": "Why no face?",
            "body": ["Look back at Part 1. The emperor’s coin shows his face. Herod’s coin shows no person at all. Herod ruled Jewish people, and Jewish law forbade human images on coins. Why would a king choose to follow that law on his money?"], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Who would you be sent to?",
            "body": ["**a.** Jesus was from Galilee. During his trial, Pilate sent him to the ruler of Galilee (Luke 23). Who was that?",
                     "**b.** Paul was a Roman citizen. When Festus held his trial, Paul said, *“I appeal to Caesar!”* (Acts 25). Which kind of ruler did Paul want to judge him?"], "lines": 2}),
  ("connection", ["In the exhibition the coins go in order, case by case: the rulers when Jesus was born, then the rulers at his trial, then the rulers the apostles stood before. Each case holds one emperor’s coin. Can you name all three?"]),
], TIMELINE_CSS)

YELLOW_CSS = """
table.fill td:first-child { width: 30%; font-weight: 500; }
table.analysis td { height: 29pt; padding: 3pt 6pt 3pt 0; }
table.analysis td:first-child { width: 25%; }
table.chartfill td { padding: 4pt 6pt 9pt 0; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 4pt 0 8pt; break-inside: avoid; }
.pc { background: rgba(255,255,255,.72); border: 1pt solid #1d1c1a; padding: 8pt 11pt 4pt; display: grid; grid-template-columns: 74pt 1fr; gap: 4pt 10pt; }
.pc img { width: 74pt; height: 74pt; object-fit: contain; filter: drop-shadow(0 3pt 5pt rgba(0,0,0,.25)); }
.pc h4 { margin: 2pt 0 3pt; }
.pc dl { display: grid; grid-template-columns: max-content 1fr; gap: 0 7pt; margin: 0; font-size: 8.3pt; }
.pc dt { font: 500 6.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #5F6655; padding-top: 2pt; }
.pc dd { margin: 0; }
.pc .pb2 { grid-column: 1 / -1; font-size: 9.4pt; line-height: 1.42; }
"""

def paircard(c):
    import html as h, re
    md = lambda t: re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", h.escape(t, quote=False))
    facts = "".join(f"<dt>{a}</dt><dd>{h.escape(b)}</dd>" for a, b in c["facts"])
    return (f'<div class="pc"><img src="{c["img"]}" alt=""><div><p class="label">{c["label"]}</p>'
            f'<h4>{c["title"]}</h4><dl>{facts}</dl></div><p class="pb2">{md(c["body"][0])}</p></div>')

YELLOW = handout("yellow", "ITH_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Two coins, one land",
            "body": ["One coin from a king, one from a Roman governor. Read them as **primary sources**."]}),
  ("html", '<div class="pair">' + paircard(HEROD) + paircard(PILATE) + '</div>'),
  ("html", '<table class="fill analysis"><thead><tr><th>Question</th><th>Herod the Great</th><th>Pontius Pilate</th></tr></thead><tbody>'
           + "".join(f"<tr><td>{q}</td><td></td><td></td></tr>" for q in [
               "Who made it, and what was his title?", "What is on it — and what is not?",
               "Who used it, and how might they have reacted?", "What can this coin <i>not</i> tell you?"]) + "</tbody></table>"),
  ("task", {"label": "Part 2", "title": "Complete the ruler chart",
            "body": ["Fill the blank boxes. Choose the level from: *emperor · Herod’s family · Roman governor · neighboring king*."]}),
  ("html", '<table class="fill chartfill"><thead><tr><th>Ruler</th><th>Title</th><th>Level of power</th><th>Years</th><th>New Testament moment</th></tr></thead><tbody>'
           + "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td></tr>" for a, b, c, d, e in [
               ("Augustus", "Emperor", "", "27 BC–14 AD", "Luke 2:1 · the census"),
               ("Herod the Great", "", "", "37–4 BC", ""),
               ("Herod Antipas", "Tetrarch of Galilee", "", "", "Luke 23:9 · Jesus is silent"),
               ("Aretas IV", "King of Nabataea", "", "coin 9 BC–40 AD", ""),
               ("Pontius Pilate", "", "Roman governor", "", ""),
               ("Herod Agrippa I", "King of Judaea", "", "from 41 AD", ""),
               ("Claudius", "", "", "41–54 AD", "Acts 18:2 · Jews leave Rome"),
               ("Porcius Festus", "", "", "c. 59–62 AD", "")]) + "</tbody></table>"),
  ("task", {"label": "Part 3", "title": "Layers of power",
            "body": ["During Jesus’ trial, Pilate sent him to Herod Antipas because Jesus was from Galilee, Antipas’s territory (Luke 23:6–12). Years later, Paul went over the governor Festus and appealed to the emperor (Acts 25:10–12). What do these two moments show about who answered to whom in Judaea? Use both."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Who counted the years?",
            "body": ["Pilate dated his coin by the 16th year of the emperor Tiberius. What does that tell you about who was really in charge of Judaea?"], "lines": 1}),
  ("connection", ["In Case 6, Herod the Great’s prutah shares a case with the coin of Augustus, the emperor of his day. In Case 7, find Pilate’s coin and the Tribute Penny. Which of the four would have troubled a faithful Jew most — and why?"]),
], YELLOW_CSS)

RED_CSS = """
table.corr { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 8.6pt; line-height: 1.38; }
table.corr th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left;
  padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); vertical-align: bottom; }
table.corr td { border-bottom: .6pt solid #b9a69d; padding: 5pt 8pt 5pt 0; vertical-align: top; }
table.corr tr { break-inside: avoid; }
table.corr td.who { width: 21%; }
table.corr td.who img { width: 30pt; height: 30pt; object-fit: contain; display: block; margin-bottom: 2pt; filter: drop-shadow(0 2pt 3pt rgba(0,0,0,.25)); }
table.corr td.who b { display: block; font-weight: 500; font-size: 9.2pt; }
table.corr td.who span { font-size: 7.8pt; color: #3f3e3a; }
table.corr td.nt, table.corr td.wit { width: 25%; }
table.corr td.you { width: 29%; background: rgba(255,255,255,.45); }
"""

CORR = [
  ("pilate", "Pontius Pilate", "Prefect, 26–36 AD<br>Coin: 29/30 AD",
   "Pilate tries Jesus and washes his hands before the crowd (Matthew 27:24).",
   "A limestone block inscribed with his name and title, found at Caesarea Maritima in 1961; now in the Israel Museum."),
  ("agrippa", "Herod Agrippa I", "King, 41 AD<br>Coin: 41–44 AD",
   "He executes James, seizes Peter, accepts divine honors from a crowd and is struck down, eaten by worms (Acts 12).",
   "The Jewish historian Josephus (*Antiquities* 19.8.2) describes his death in almost identical terms."),
  ("claudius", "Claudius", "Emperor, 41–54 AD<br>Coin: bronze as",
   "Aquila and Priscilla reach Corinth because Claudius had ordered all Jews to leave Rome (Acts 18:2).",
   "The Roman historian Suetonius (*Claudius* 25.4) confirms the edict, dated to about 49 AD."),
]

def corr_table():
    import re
    it = lambda t: re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    head = "".join(f"<th>{h}</th>" for h in ["Ruler and coin", "The New Testament says", "The second witness", "Your verdict: what does each source add?"])
    rows = "".join(
        f'<tr><td class="who"><img src="{C}{k}-front.png" alt=""><b>{n}</b><span>{c}</span></td>'
        f'<td class="nt">{it(nt)}</td><td class="wit">{it(w)}</td><td class="you"></td></tr>'
        for k, n, c, nt, w in CORR)
    return f'<table class="corr"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'

RED = handout("red", "ITH_Handout_Red_SocialStudies.pdf", [
  ("section", {"label": "Historical method", "title": "Corroboration",
               "body": ["One source can be mistaken. A historian trusts a claim more when **independent** sources — made by different people for different reasons — agree."]}),
  ("task", {"label": "Part 1", "title": "Test the claims",
            "body": ["Three rulers, their coins and a second witness. What does each source add, and how strong is the claim?"]}),
  ("html", corr_table()),
  ("task", {"label": "Part 2", "title": "A detail that fits",
            "body": ["When Festus reopened Paul’s case, Paul used his right as a Roman citizen to appeal to the emperor (Acts 25:10–12). Scholars often note that this detail reflects accurate knowledge of Roman legal practice, and Festus minted coins in the years Acts describes. Is getting the **system** right good evidence that a writer got the **events** right? Explain."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "What can a coin prove?",
            "blocks": [("html", "<p>Consider these facts from the exhibition:</p><ul>"
                "<li>Some scholars once doubted Pilate existed. His coins were there before the 1961 stone: <i>evidence all along</i>.</li>"
                "<li>Pilate’s coin shows pagan symbols, but it says nothing about the trial of Jesus.</li>"
                "<li>The widow’s lepton, minted under King Alexander Jannaeus in 103–76 BC, was still in use a century later.</li>"
                "<li>Three coins in the exhibition are replicas, because originals are exceptionally rare.</li></ul>")],
            "body": ["Write an argument: **what can coins prove about the rulers of the New Testament, and what can they not prove?** Make a claim, use at least two pieces of evidence, and answer one objection."], "lines": 7}),
  ("connection", ["Case 8 holds the coins of Agrippa I, Claudius and Festus: the rulers the apostles stood before. Which of the three has the strongest outside corroboration, and which depends most on Acts alone?"]),
], RED_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
