"""Grades 3–4 · "Coin Detectives"
Reading an ancient coin as evidence, and telling real from fake with the
Real or Replica? rounds. Facts follow app/exhibitions/in-their-hands/:
artifacts/coin-data.ts, timeline/page.tsx (timelineStops) and
real-or-replica/page.tsx (the five rounds)."""

C = "/exhibitions/in-their-hands/artifacts/coins/"
RF = "/exhibitions/in-their-hands/real-or-fake/"
DIR = "teachers/grades-3-4/"
TITLE = "Coin Detectives"
SUB = "Grades 3–4 · Real or Replica? · Coins as evidence"

HERO_LP = {"img": "/exhibitions/in-their-hands/timeline/pilate-tissot.jpg", "pos": "center 45%",
           "credit": "James Tissot (1836–1902), Brooklyn Museum"}
HERO = {"img": "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg", "pos": "center 62%"}

# A Real or Replica? pair, labeled A and B so students decide which is fake.
# Answer key (also printed in the lesson plan):
#   widow       A real · B fake        Dekadrachm  A fake · B real
#   Lysimachus  A real · B fake        die-transfer A real · B fake
PAIRS = {
  "widow":   ("Widow’s Mite · Lepton", RF + "widow-real.png", RF + "widow-fake.png"),
  "deka":    ("Dekadrachm of Athens", RF + "Dekadrachm-fake.png", RF + "Dekadrachm-real.png"),
  "lysi":    ("Lysimachus Tetradrachm", RF + "Lysimachus-real.png", RF + "Lysimachus-fake.png"),
  "die":     ("Greek Drachm", RF + "die-transfer-real.png", RF + "die-transfer-fake.png"),
}

def pair(key, h=None):
    name, a, b = PAIRS[key]
    st = f' style="--ph:{h}pt"' if h else ""
    return ("html", f'<div class="pair"{st}><p class="label">Real or Replica? · {name}</p><div class="pp">'
            f'<figure><img src="{a}" alt=""><figcaption>Coin A</figcaption></figure>'
            f'<figure><img src="{b}" alt=""><figcaption>Coin B</figcaption></figure></div></div>')

# coins for the timeline tasks: (image, name, date, story line)
TL = {
  "augustus": (C + "augustus-front.png", "Augustus Caesar", "5–4 BC", "Jesus is born in Bethlehem · Luke 2:1"),
  "shekel":   (C + "shekel.png", "Shekel of Tyre (replica)", "1 BC–1 AD", "Thirty pieces of silver · Matthew 26:15"),
  "widow":    (C + "widow-1-front.png", "Widow’s Mite", "103–76 BC", "The widow’s gift · Mark 12:41–44"),
  "pilate":   (C + "pilate-front.png", "Pontius Pilate", "29/30 AD", "Jesus is put on trial · Matthew 27:24"),
  "agrippa":  (C + "agrippa-front.png", "Herod Agrippa I", "41–44 AD", "Peter is seized · Acts 12:3"),
  "festus":   (C + "festus-front.png", "Porcius Festus", "59–62 AD", "Paul appeals to Caesar · Acts 25:12"),
}

def order(keys, dates=True, story=True):
    cells = ""
    for k in keys:
        img, name, date, line = TL[k]
        sub = (f"<em>{date}</em>" if dates else "") + (f"<small>{line.replace(' · ', '<br>')}</small>" if story else "")
        cells += (f'<figure><span class="obox"></span><img src="{img}" alt="">'
                  f'<figcaption><b>{name}</b>{sub}</figcaption></figure>')
    return ("html", f'<div class="order" style="--n:{len(keys)}">{cells}</div>')

CSS = """
.pair { margin: 2pt 0 8pt; break-inside: avoid; }
.pp { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.pp figure { margin: 0; text-align: center; background: rgba(255,255,255,.72); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 7pt 6pt 4pt; }
.pp img { width: 100%; height: var(--ph, 78pt); object-fit: contain; }
.pp figcaption { font: 500 8pt 'Outfit'; letter-spacing: .24em; text-transform: uppercase; margin-top: 3pt; }
.order { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 8pt; margin: 4pt 0 8pt; break-inside: avoid; }
.order figure { margin: 0; text-align: center; position: relative; }
.order img { width: 56pt; height: 56pt; object-fit: contain; display: block; margin: 0 auto; }
.order .obox { display: block; width: 22pt; height: 22pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: rgba(255,255,255,.8); margin: 0 auto 4pt; }
.order figcaption { font: 400 8pt/1.3 'Outfit'; margin-top: 3pt; }
.order figcaption b { display: block; font-weight: 500; }
.order figcaption em { display: block; font-style: normal; letter-spacing: .06em; }
.order figcaption small { display: block; font-size: 7.5pt; color: #3f3e3a; }
.tip { border-left: 3pt solid #1d1c1a; padding: 2pt 0 2pt 9pt; margin: 2pt 0 7pt; font-size: 9.6pt; }
.verdict { font: 500 9pt 'Outfit'; letter-spacing: .08em; margin: 2pt 0 4pt; }
.verdict span { display: inline-block; border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 1pt 10pt; margin: 0 4pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

def verdict(q="The fake is"):
    return ("html", f'<p class="verdict">{q} &nbsp; Coin <span>A</span> or Coin <span>B</span> &nbsp;(circle one)</p>')

PILATE = {"img": C + "pilate-front.png", "label": "Case 7 · Ministry and Passion",
          "title": "The coin of Pontius Pilate",
          "facts": [("Coin", "Bronze prutah, genuine"), ("Date", "29/30 AD"), ("Reference", "Hendin 6370"), ("Scripture", "Matthew 27:24")],
          "body": ["Pilate was the Roman prefect of Judaea from 26 to 36 AD. This coin was minted in the year of the Passion. One side shows a simpulum, a Roman ladle used in pagan worship; the other shows three ears of grain tied together. For decades some scholars questioned whether Pilate was real. In 1961 a stone carved with his name and title was found at Caesarea Maritima. This coin existed before that discovery. It was evidence all along."]}

# Said in the plan and shown on the classroom screen, so written once.
CLUE = "If a lepton looks perfect, be suspicious. The imperfection is the proof of authenticity."
ANSWER_WIDOW = "**Coin B.** A real lepton is crude, off-center and irregular; the fake is too clean and symmetrical, its patina applied by chemicals."

# What students will be able to do, set up front in the plan and on the
# cover screen, then asked back in the Look back: (objective, the same as
# a question, go deeper?).
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read an ancient coin as evidence: who made it, when, and what it helps show",
     "read a coin as evidence?", False),
    ("use the clues experts use to tell a genuine coin from a fake",
     "use an expert’s clues to spot a fake?", False),
    ("put the coins of the New Testament in time order",
     "put the coins in story order?", False),
    ("explain why a genuine coin is stronger evidence than a replica",
     "explain why a genuine coin is stronger evidence than a replica?", True)],
  "why": "A coin made by a real ruler, in a real year, is a witness. It helps show that the world the Gospels describe was a real world, with real rulers, in real years."}
LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."
# the plan's last section, one paragraph in print, two steps on screen
LINE_UP_P = "Give five students the coins on page 3: Augustus, the Widow’s Mite, Pilate, Agrippa and Festus. The class arranges them in story order, from the census at Jesus’ birth to Paul’s appeal to Caesar."
LOOK_BACK_P = "Then ask the objectives back, from the screen or page 1: *“Can you now…?”* Students show a thumb up, sideways or down. Exit question: *“Name one coin and tell me what it is evidence for.”*"

# ── on the classroom screen (Lesson mode; build.py ignores "screen") ─────

def screen_pair(key, stamps=False):
    """the Real or Replica? pair as the handouts set it: A and B, no answer
       until stamps=True."""
    name, a, b = PAIRS[key]
    fake_b = key != "deka"
    def item(img, label, fake):
        return {"img": img, "label": label,
                "alt": f"{label}: a {name.split(' · ')[0].lower()}, both sides" if not stamps else
                       f"{label}: {'the fake' if fake else 'the genuine coin'}, both sides",
                **({"stamp": "Fake" if fake else "Genuine", "stampTone": "red" if fake else "gold"} if stamps else {})}
    return [item(a, "Coin A", not fake_b), item(b, "Coin B", fake_b)]

def screen_coin(k, name=None, sub=None, alt=None, **kw):
    img = TL[k][0] if k in TL else C + f"{k}-front.png"
    return {"img": img, "name": name or TL[k][1], **({"sub": sub} if sub else {}), "alt": alt or name or TL[k][1], **kw}

STRUCK = [screen_coin("widow", "Widow’s Mite", "Genuine", "The Widow’s Mite, a small, worn bronze coin"),
          screen_coin("pilate", "Pontius Pilate", "Genuine", "The coin of Pontius Pilate: a ladle, the simpulum", feature=True),
          screen_coin("agrippa", "Herod Agrippa I", "Genuine", "A bronze coin of Herod Agrippa I")]
WITNESSES = [screen_coin("tribute", "Tiberius", "The Tribute Penny", "The Tribute Penny, a silver denarius of the emperor Tiberius; a replica",
                         replica=True, feature=False),
             screen_coin("pilate", "Pontius Pilate", "Genuine", "The coin of Pontius Pilate: a ladle, the simpulum", feature=True),
             screen_coin("antipas", "Herod Antipas", "Tetrarch of Galilee", "A coin of Herod Antipas; a replica",
                         replica=True, feature=False)]
# the human timeline, shuffled: the class puts them in story order
LINE_UP = [screen_coin(k, sub=TL[k][3].split(" · ")[0], alt=f"The coin of {TL[k][1]}" if k != "widow" else "The Widow’s Mite")
           for k in ["festus", "widow", "augustus", "agrippa", "pilate"]]
GOSPEL_ORDER = ", ".join(TL[k][1] for k in ["augustus", "widow", "pilate", "agrippa", "festus"])

# the objectives block; styled here, so the handouts print unchanged
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
/* the plan's sections may run on across a page, so no page ends half empty */
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
/* the background and answer keys, for reference, set a size smaller */
.cols:has(.conn) { font-size: 9pt; }
/* the "Show your class" page starts a page, even when the plan fills the one before to the foot */
.pb { break-after: auto; break-before: page; }
"""

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "coin-detectives", "large": True,
  "out": DIR + "ITH_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO_LP,
  "css": CSS + OBJ_CSS + ".grow img { width: 54pt; height: 54pt; } .gallery { padding-top: 9pt; margin-bottom: 10pt; } .specimen { margin-bottom: 6pt; } body { line-height: 1.46; }",
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 10, "#2F4A5A"), ("Detective work", 20, "#86671A"), ("Close", 5, "#A8452F")]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words for detectives"}),
       ("refs", [
        ("Genuine", "really made in ancient times"),
        ("Replica", "an honest copy, labeled as a copy"),
        ("Fake", "a copy made to fool people"),
        ("Struck", "stamped between two dies"),
        ("Patina", "the color old metal gains over time"),
        ("Evidence", "a clue that helps show what is true")])],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read an ancient coin as a piece of evidence. They will use the clues experts use to tell a genuine coin from a fake, put the coins of the New Testament in time order, and explain how a coin made by a real ruler, in a real year, helps show that the world the Gospels describe was a real world, with real rulers, in real years."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social Studies** — artifacts as primary sources; chronology and BC/AD dates",
      "**Science and ELA** — close observation with a hand lens; stating a claim and backing it with evidence",
      "**Religion** — Luke 2:1 and Luke 3:1, where the Gospel names the rulers of its day",
      "**For Catholic schools** — CCC 423 (Jesus born in Bethlehem in the time of Herod the Great and Caesar Augustus) and CCC 126 (the Church affirms that the Gospels are historical)"]}),
               ("section", {"label": "Materials needed", "list": [
        "*Real or Replica?* projected",
        "Magnifying glasses, if you have them",
        "A modern coin; page 3 of this plan",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "How do you know it’s real?",
      "screen": {"phase": "Hook", "show": "coin", "coin": PILATE, "back": C + "pilate-back.png",
                 "alt": "The coin of Pontius Pilate, a bronze prutah: a ladle, the simpulum",
                 "backAlt": "The other side of Pilate’s coin: three ears of grain tied together",
                 "purpose": "Start from what students already know about telling a real coin from a toy, then hand them the expert’s job.",
                 "students": ["How do you know a coin is real, and not a toy?", "Pilate had this coin made. What clues can you see?"]},
      "body": ["Hold up a modern coin. *“How do you know this coin is real and not a toy?”* Take answers: the weight, the shine, the words, where it came from. Then show the coin of Pontius Pilate on page 3. *“The man who put Jesus on trial had this coin made. An expert says it is real. Today you are the expert.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "Struck, cast and copied",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Struck by hand", "show": "coins", "coins": STRUCK,
         "purpose": "Know what a genuine ancient coin looks like, so a fake can stand out.",
         "students": ["Look for crisp, sharp detail.", "Is each design in the middle of its coin?"]},
        {"phase": "Teach", "minutes": 2, "script": [1], "title": "Real or fake?", "show": "pair", "items": screen_pair("widow"),
         "purpose": "Use the clues as a detective would, before the answer is given.",
         "students": ["One is a real widow’s mite. One is a modern fake.", "Which is the fake? Vote: Coin A or Coin B."]},
        {"phase": "Teach", "minutes": 2, "script": ["**The answer:** " + ANSWER_WIDOW], "title": "The proof", "show": "pair",
         "items": screen_pair("widow", stamps=True), "note": {"text": CLUE, "ref": "Real or Replica? · The widow’s mite"},
         "purpose": "Name the clue that proves it: the real coin is crude; the fake is too perfect.",
         "students": ["Which clue gave the fake away?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Witnesses", "show": "coins", "coins": WITNESSES,
         "purpose": "See why a genuine coin matters: a witness from the same years as the Gospel.",
         "students": ["Luke 3:1 names three rulers. Here are their coins.", "Only one is genuine. Why does that matter?"]}],
      "body": [
        "**How ancient coins were made.** A blank of metal was struck between two engraved dies, by hand, one at a time. Striking leaves crisp, sharp detail — and everyday coins were often struck crude and off-center.",
        "**How fakes are made.** Some are *cast*: molten metal is poured into a mold made from a real coin, which leaves soft detail, tiny bubbles or a grainy surface. Some are struck from *false dies*, copied by hand. Some are given fake age with a tumbler or sandpaper, or a patina painted on chemically. Play the widow’s mite round of *Real or Replica?* together and read its clue aloud: *“" + CLUE + "”*",
        "**Why it matters.** Read Luke 3:1 aloud: Luke dates the start of John the Baptist’s preaching by naming Tiberius, Pontius Pilate and Herod, tetrarch of Galilee. The exhibition holds coins of all three: Pilate’s is genuine, and the coins of Tiberius and Herod Antipas are museum-quality replicas. A genuine coin is a witness from the same years as the Gospel."]}),
    ("section", {"label": "Detective work · 20 minutes",
      "screen": {"phase": "Detective work", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice the detective’s skills independently, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three compare real and fake coins, and put coins of the Gospel in order."]},
      "body": ["Students choose a handout. All three levels compare real and fake coins and put coins of the Gospel in order."]}),
    ("levels", {
      "green": "Spot the difference between a real and a fake widow’s mite using a checklist of clues. Read Pilate’s coin as evidence. Number four coins in story order, with pictures and dates.",
      "yellow": "Find the fake in two pairs and explain the clues in a table. Tell struck from cast. Order five coins by date, then explain what Pilate’s coin is evidence for.",
      "red": "Weigh strong and weak evidence on the hardest kind of fake. Explain why it matters that three exhibition coins are replicas. Order five coins and explain the one that breaks the pattern."}),
    ("section", {"label": "Line up and look back · 5 minutes", "title": "A human timeline",
      "screen": [
        {"phase": "Close", "minutes": 3, "script": [LINE_UP_P, f"**Story order:** {GOSPEL_ORDER}."], "title": "A human timeline",
         "show": "coins", "coins": LINE_UP,
         "purpose": "Put the coins in time order by putting the stories in order.",
         "students": ["Put the five coins in story order, from Jesus’ birth to Paul’s appeal to Caesar."]},
        {"phase": "Close", "minutes": 2, "script": [LOOK_BACK_P], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": [LINE_UP_P + " " + LOOK_BACK_P]}),
    ("cols", [
      [("section", {"label": "Background · replicas in the exhibition", "body": [
        "Eight coins are genuine. Three — the Tribute Penny, the Shekel of Tyre and the coin of Herod Antipas — are museum-quality replicas, because originals are exceptionally rare. Each is labeled as a replica. A replica tells the truth about itself; a fake is made to fool. The Festus coin has been independently authenticated by NGC, a professional coin grading service."]}),
       ("connection", ["**Online,** *Real or Replica?* gives five rounds, each with how the fake was made, and the **Gospel Timeline** sets the eleven coins in order. **In the exhibition,** find Pilate’s coin in Case 7 and look for the ladle and the grain."])],
      [("section", {"label": "Answer key · the fakes and their clues", "list": [
        "**Widow’s mite** (Green): " + ANSWER_WIDOW,
        "**Dekadrachm** (Yellow): **Coin A**, a cast fake. Its owl’s feathers are softer and blurred; its surface is unnaturally uniform.",
        "**Lysimachus** (Yellow): **Coin B**, sand cast. Grainy surface, mushy curls, a different edge.",
        "**Greek drachm** (Red): **Coin B**, a die transfer. Flatter, grayer, less sharp, the wrong metal. Experts compare known genuine coins, and sometimes use X-rays."]}),
       ("section", {"label": "Answer key · the orders", "list": [
        "**Green:** Augustus, Pilate, Agrippa, Festus",
        "**Yellow:** Augustus, Shekel of Tyre, Pilate, Agrippa, Festus",
        "**Red, by date made:** Widow’s Mite, Augustus, Pilate, Agrippa, Festus. The mite was made long before, but was still being spent in Jesus’ day."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Gospel in coins, in order", "body": ["The eleven coins of the Gospel Timeline, from Jesus’ birth to Paul’s journey to Rome. Use it for the hook and the line-up."]}),
    ("gallery", [
      {"label": "Case 6 · The World of Jesus", "items": [
        {"img": C + "augustus-front.png", "cap": "Augustus Caesar · 5–4 BC"},
        {"img": C + "herod-great-front.png", "cap": "Herod the Great · 40–4 BC"},
        {"img": C + "aretas-front.png", "cap": "Aretas IV · 9 BC–40 AD"}]},
      {"label": "Case 7 · Ministry and Passion", "items": [
        {"img": C + "widow-1-front.png", "cap": "Widow’s Mite · 103–76 BC"},
        {"img": C + "tribute-front.png", "cap": "Tribute Penny · 14–37 AD · replica"},
        {"img": C + "shekel.png", "cap": "Shekel of Tyre · 1 BC–1 AD · replica"},
        {"img": C + "pilate-front.png", "cap": "Pontius Pilate · 29/30 AD"},
        {"img": C + "antipas-front.png", "cap": "Herod Antipas · 4 BC–39 AD · replica"}]},
      {"label": "Case 8 · The Early Church", "items": [
        {"img": C + "agrippa-front.png", "cap": "Herod Agrippa I · 41–44 AD"},
        {"img": C + "claudius-front.png", "cap": "Emperor Claudius · 41–54 AD"},
        {"img": C + "festus-front.png", "cap": "Porcius Festus · 59–62 AD"}]},
    ]),
    ("specimen", PILATE),
    ("section", {"label": "Questions to ask in front of the case", "list": [
      "What clues on this coin tell you it was struck by hand?",
      "Why would a Roman governor put a ladle used in pagan worship on a coin for Jewish people to spend?",
      "Some people once doubted Pilate was real. What does this coin say to them?",
      "Luke 3:1 names Pilate. How does it change the way you hear the Gospel to know his coins still exist?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["The coins in *In Their Hands* were spent and held in the years of the Gospels. Eight are genuine. Three are museum-quality replicas, honest copies labeled as copies. But how does an expert know an ancient coin is real? Today you are a coin detective."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · Real or Replica?", "level": level, "context": CONTEXT, "css": CSS,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "ITH_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Spot the difference", "blocks": [
            P("One of these is a real widow’s mite, the tiny coin of Mark 12:41–44. The other is a modern fake. Look at both, then check every clue you can see."),
            pair("widow", 92)]}),
  ("table", {"head": ["Clue", "Coin A", "Coin B"], "rows": [
      ["Rough, uneven and off-center", "", ""], ["Clean, neat and perfect", "", ""],
      ["Worn and old-looking", "", ""], ["Sharp, even letters and shapes", "", ""]]}),
  verdict(),
  ("html", '<p class="tip"><b>Expert clue:</b> a real lepton was a cheap, everyday coin, made fast and crude. The fake is <i>too</i> good. “If a lepton looks perfect, be suspicious.”</p>'),
  ("task", {"label": "Part 2", "title": "Which clue helped you most?", "body": ["Finish the sentence: **I know the fake is a fake because…**"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "A coin that is evidence",
            "blocks": [("coin", {"img": C + "pilate-front.png", "label": "Case 7 · Genuine",
              "title": "The coin of Pontius Pilate",
              "body": ["Pilate was the Roman governor who put Jesus on trial. He had this coin made in 29/30 AD, within a few years of the Passion. Some people once wondered if Pilate was real. In 1961 a stone with his name was found — but his coins had been evidence all along."]})],
            "body": ["Who had this coin made? In what year? What does it help show about the world the Gospels describe?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Put the coins in order", "blocks": [
            P("These four coins go with four Gospel stories. Write <b>1, 2, 3, 4</b> in the boxes, from the first story to the last."),
            order(["festus", "augustus", "agrippa", "pilate"])]}),
  ("family", ["Look at a coin from home with a magnifying glass. Is it worn on its highest points? Then tell your family about Pilate’s coin, and why it is evidence that the world the Gospels describe was a real world."]),
])

YELLOW = handout("yellow", "ITH_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Two cases to crack", "blocks": [
            P("In each pair one coin is genuine and one is a fake. Look closely at the owl’s feathers on the first pair and the curls of the hair on the second."),
            pair("deka", 84), verdict(), pair("lysi", 84), verdict()]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Explain the clues", "blocks": [
            P("For each clue, describe what you see on the real coin and on the fake."),
            ("table", {"head": ["Clue", "On the real coin", "On the fake"], "rows": [
      ["The owl’s feathers", "", ""], ["The curls of the hair", "", ""], ["The surface of the metal", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "Struck or cast?",
            "body": ["A real ancient coin was *struck*: stamped between two dies. Many fakes are *cast*: hot metal is poured into a mold made from a real coin. Why do you think a cast coin has softer, blurrier details?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Put five coins in order", "blocks": [
            P("Write <b>1 to 5</b> in the boxes, from the oldest coin to the newest. <b>Tip:</b> BC years count <i>down</i> toward the birth of Christ, so 5 BC comes before 1 BC. AD years count <i>up</i>."),
            order(["pilate", "festus", "augustus", "agrippa", "shekel"], story=False)]}),
  ("task", {"label": "Part 5", "title": "A real world",
            "body": ["Luke 3:1 names the rulers of the time, including the emperor Tiberius and Pontius Pilate. Explain how a real coin made by Pilate helps show that the world the Gospels describe was real."], "lines": 3}),
  ("family", ["Show your family the two pairs. Can they find the fakes? Tell them one clue an expert uses, and which coin in the exhibition was made by the man who put Jesus on trial."]),
])

RED = handout("red", "ITH_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Detective report: the hardest fake", "blocks": [
            P("One of these drachms is genuine. The other is a <i>die transfer</i> fake: the faker made a mold from a real coin’s die and struck a new coin with it. The design looks right at first glance. Weigh the evidence below: is each clue <b>strong</b> or <b>weak</b>?"),
            pair("die", 72)]}),
  ("table", {"head": ["Evidence", "Strong or weak?", "Why?"], "rows": [
      ["The design looks correct", "", ""], ["One coin looks flatter and grayer", "", ""],
      ["One coin has sharper details", "", ""], ["Tests show one coin’s metal is the wrong mix", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Your verdict", "blocks": [verdict("The fake is")],
            "body": ["Give your two strongest pieces of evidence. Then explain what an expert could do to be completely sure."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Why does it matter?",
            "body": ["The Tribute Penny, the Shekel of Tyre and the coin of Herod Antipas are replicas, because real ones are so rare. Each is labeled as a replica. How is a replica different from a fake? Why is Pilate’s genuine coin stronger evidence than a replica?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Order and explain", "blocks": [
            P("Write <b>1 to 5</b> in the boxes, from the coin made first to the coin made last."),
            order(["agrippa", "widow", "festus", "augustus", "pilate"], story=False)],
            "body": ["The widow’s mite was made long before the others. But the widow gave her two coins in Jesus’ last week in Jerusalem, long after Augustus. How can both be true? What does this teach a detective about the date on a coin?"], "lines": 3}),
  ("family", ["Ask your family: what makes a museum trustworthy? Tell them how the exhibition labels its replicas, and how Pilate’s coin was evidence before anyone found his stone."]),
])

# the evidence table: a narrow strong/weak column leaves room for the reason
RED["css"] = CSS + "table.fill td:first-child { width: 36%; } table.fill td:nth-child(2) { width: 20%; }"

DOCS = [LESSON, GREEN, YELLOW, RED]
