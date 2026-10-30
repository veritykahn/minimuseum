"""The two adult guides for In Their Hands: the Quick Teaching Guide and the
teacher sheet on the Green / Yellow / Red handouts. Coin facts follow
app/exhibitions/in-their-hands/artifacts/coin-data.ts, with the Gospel
Timeline, Hands of History, Real or Replica? and poster data. The handouts
sheet adapts the Mini Museum's existing "Using Differentiated Student
Handouts" teacher guide."""

import html, re

C = "/exhibitions/in-their-hands/artifacts/coins/"
RESOURCES = "minimuseumproject.org/exhibitions/in-their-hands/resources"

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

# ── the Quick Teaching Guide ───────────────────────────────────────────

CASES = [
  ("Case 6 · The World of Jesus", [
    {"img": C + "augustus-front.png", "cap": "Augustus Caesar · Luke 2:1"},
    {"img": C + "herod-great-front.png", "cap": "Herod the Great · Matthew 2:13"},
    {"img": C + "aretas-front.png", "cap": "Aretas IV · Mark 6:17–18"}]),
  ("Case 7 · Ministry and Passion", [
    {"img": C + "widow-1-front.png", "cap": "The Widow’s Mite · Mark 12:41–44"},
    {"img": C + "tribute-front.png", "cap": "The Tribute Penny · Matthew 22:21 · *replica*"},
    {"img": C + "shekel.png", "cap": "Shekel of Tyre · Matthew 26:15 · *replica*"},
    {"img": C + "pilate-front.png", "cap": "Pontius Pilate · Matthew 27:24"},
    {"img": C + "antipas-front.png", "cap": "Herod Antipas · Luke 23:9 · *replica*"}]),
  ("Case 8 · The Early Church", [
    {"img": C + "agrippa-front.png", "cap": "Herod Agrippa I · Acts 12:2–3"},
    {"img": C + "claudius-front.png", "cap": "Emperor Claudius · Acts 18:2"},
    {"img": C + "festus-front.png", "cap": "Porcius Festus · Acts 25:12"}]),
]

def bands(items):
    """Four grade bands, two across: name, then labeled short lists."""
    out = ""
    for name, rows in items:
        focus, lead, before = rows
        body = ('<ul>' + "".join(f"<li>{md(i)}</li>" for i in focus) + "</ul>"
                f'<p class="bp"><span>Lead with</span> {md(lead)}</p>'
                f'<p class="bp"><span>Before you go</span> {md(before)}</p>')
        out += f'<div class="band"><h4>{md(name)}</h4>{body}</div>'
    return f'<div class="bands">{out}</div>'

def asks(cases):
    """Guided questions coin by coin, grouped by case."""
    out = ""
    for label, coins in cases:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for c in coins:
            tag = '<span class="rep">Replica</span>' if c.get("replica") else ""
            out += (f'<div class="ask"><img src="{c["img"]}" alt=""><div><h4>{md(c["title"])}{tag}</h4>'
                    f'<p class="aref">{md(c["ref"])}</p><ul>'
                    + "".join(f"<li>{md(q)}</li>" for q in c["q"]) + "</ul></div></div>")
        out += "</div>"
    return out

def subjects(items):
    return '<div class="subj">' + "".join(
        f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"

def myths(items):
    return '<div class="myths">' + "".join(
        f'<div><p class="m"><span>Misconception</span>{md(a)}</p><p class="r"><span>In the exhibition</span>{md(b)}</p></div>'
        for a, b in items) + "</div>"

GUIDE_CSS = """
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
.ask { display: grid; grid-template-columns: 44pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask img { width: 44pt; height: 44pt; object-fit: contain; }
.ask h4 { font-size: 12pt; margin: 0; }
.ask .aref { font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin: 0 0 2pt; }
.ask ul { margin: 0; font-size: 9pt; line-height: 1.38; } .ask li { margin-bottom: 1pt; }
.rep { font: 500 6.3pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #A8452F; border: .9pt solid #A8452F;
  border-radius: 2pt; padding: 1pt 4pt 0; margin-left: 6pt; vertical-align: 2pt; }
.subj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt 14pt; margin: 4pt 0 12pt; }
.subj > div { border-top: 1.2pt solid var(--accent); padding-top: 5pt; font-size: 9pt; break-inside: avoid; }
.subj h4 { margin-bottom: 2pt; }
.myths { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin: 4pt 0 12pt; }
.myths > div { font-size: 9pt; break-inside: avoid; }
.myths span { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 1pt; }
.myths .m { font: 500 12pt/1.2 'Cormorant Garamond', serif; border-bottom: .6pt solid #c8c5bb; padding-bottom: 5pt; margin-bottom: 5pt; }
.myths .m span { color: #A8452F; }
.myths .r span { color: #4A7346; }
.plans { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16pt; }
.hero { height: 2.05in; margin-bottom: 11pt; }
.gallery { padding: 12pt 14pt 6pt; margin: 4pt 0 10pt; }
.gallery .glab { margin: 4pt 0 5pt; }
.grow { gap: 6pt; margin-bottom: 7pt; }
.grow img { width: 74pt; height: 74pt; }
.grow figcaption { font-size: 7.3pt; }
.gallery figcaption i { color: #f0b9a6; font-style: normal; letter-spacing: .08em; text-transform: uppercase; font-size: 6.5pt; }
"""

QUESTIONS = [
  ("Case 6 · The World of Jesus", [
    {"img": C + "augustus-front.png", "title": "Augustus Caesar", "ref": "Bronze as · 5–4 BC · Luke 2:1",
     "q": ["Augustus never visited Judaea, yet his census sent Mary and Joseph to Bethlehem. How can an order given far away change ordinary lives?"]},
    {"img": C + "herod-great-front.png", "title": "Herod the Great", "ref": "Bronze prutah · 40–4 BC · Matthew 2:13",
     "q": ["This king’s coins carry no human face. Why not? What did he put on them instead?"]},
    {"img": C + "aretas-front.png", "title": "Aretas IV", "ref": "Bronze prutah · 9 BC–40 AD · Mark 6:17–18",
     "q": ["This king appears in the stories of John the Baptist and of Paul’s escape from Damascus. How can one coin connect three stories?"]},
  ]),
  ("Case 7 · Ministry and Passion", [
    {"img": C + "widow-1-front.png", "title": "The Widow’s Mite", "ref": "Bronze lepton · Mark 12:41–44",
     "q": ["Why are two of these coins displayed, not one?",
           "How can the smallest coin be the biggest gift?"]},
    {"img": C + "tribute-front.png", "title": "The Tribute Penny", "replica": True, "ref": "Silver denarius of Tiberius · Matthew 22:21",
     "q": ["Whose image is this? And whose inscription?",
           "The reverse reads PONTIF MAXIM, *High Priest*. Why would that offend a faithful Jew?"]},
    {"img": C + "shekel.png", "title": "Shekel of Tyre", "replica": True, "ref": "Silver shekel · 1 BC–1 AD · Matthew 26:15",
     "q": ["The only coin the Temple accepted carried the image of a pagan god. Why accept it? And what does it mean that it became the price of betrayal?"]},
    {"img": C + "pilate-front.png", "title": "Pontius Pilate", "ref": "Bronze prutah · 29/30 AD · Matthew 27:24",
     "q": ["Minted in the year of the Passion, by the man who sentenced Jesus. What changes when you know that?",
           "Some scholars doubted Pilate existed until 1961. What had this coin been all along?"]},
    {"img": C + "antipas-front.png", "title": "Herod Antipas", "replica": True, "ref": "Bronze prutah · 4 BC–39 AD · Luke 23:9",
     "q": ["Jesus spoke to Pilate, to the High Priest and to his accusers, but gave Antipas not one word. Why might silence be an answer?"]},
  ]),
  ("Case 8 · The Early Church", [
    {"img": C + "agrippa-front.png", "title": "Herod Agrippa I", "ref": "Bronze prutah · 41–44 AD · Acts 12:2–3",
     "q": ["Acts and the historian Josephus describe Agrippa’s death in almost identical terms. Why does an outside witness matter?"]},
    {"img": C + "claudius-front.png", "title": "Emperor Claudius", "ref": "Bronze as · 41–54 AD · Acts 18:2",
     "q": ["Claudius drove Aquila and Priscilla out of Rome, and they met Paul in Corinth. How did a hard decree end up helping the early Church?"]},
    {"img": C + "festus-front.png", "title": "Porcius Festus", "ref": "Bronze prutah · 59–62 AD · Acts 25:12",
     "q": ["Paul appealed to Caesar as a Roman citizen. What is a right, and why did this one matter?"]},
  ]),
]

GUIDE = {
  "out": "ITH_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "In Their Hands",
  "sub": "Coins of Roman Judaea · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": "/exhibitions/in-their-hands/timeline/widow-tissot.jpg", "pos": "center 30%",
           "credit": "James Tissot (1836–1902), Brooklyn Museum"},
  "blocks": [
    ("chips", ["Cases 6 · 7 · 8", "Eleven coins", "Eight authentic · three replicas", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "Eleven coins, three cases", "body": [
      "Every coin in this exhibition was spent and held during the years of the New Testament. They follow the story in three display cases. **Case 6, The World of Jesus,** holds the coins of the rulers at his birth. **Case 7, Ministry and Passion,** holds the coins of his teaching and his trial. **Case 8, The Early Church,** holds the coins of the rulers the apostles stood before. Eight of the coins are genuine. Three — the Tribute Penny, the Shekel of Tyre and the coin of Herod Antipas — are museum-quality replicas, because original examples are of exceptional rarity.",
      "**The core message:** the world the Gospels describe was a real world. The coins do not prove the faith — the exhibition says plainly that faith is not proved by archaeology — but its rulers, its taxes and its money can be held in the hand."]}),
    ("gallery", [{"label": l, "items": i} for l, i in CASES]),
    ("section", {"label": "Around the cases", "title": "Four more ways in", "list": [
      "**The Gospel Timeline** — the eleven coins in order, from the census at Christ’s birth to Paul’s appeal to Caesar, each beside its passage and a painting of the scene",
      "**Hands of History** — *whose hands held this?* Students see a coin and guess whose hands held it: a Roman soldier, a Temple priest, a widow, a merchant, a mother in Bethlehem, Paul of Tarsus or a Nabataean princess",
      "**Real or Replica?** — five rounds of genuine against fake (casting, die transfer, sand casting, false dies and a modern reproduction), with the clues experts use to tell them apart",
      "**Two posters** — *Faith and Reason* (Lemaître, Mendel, the Vatican Observatory and the Dead Sea Scrolls) and *The Weight of Thirty Pieces* (the Pilate Stone, the Tyrian shekel, the potter’s field and the Caiaphas ossuary)"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Real coins, held by real people, long ago", "Giving: the widow’s two small coins", "Looking closely — big or tiny, face or no face?"],
                  "the Widow’s Mite, Augustus (the journey to Bethlehem) and *Hands of History*.",
                  "pass around a coin from a pocket and ask *whose face is this?*")),
      ("Grades 3–4", (["Coins tell us who was in charge", "Matching each coin to its Bible story", "Real or fake: the clues of age and wear"],
                  "the Gospel Timeline, the Tribute Penny and *Real or Replica?*",
                  "read Matthew 22:15–22 and ask *how did Jesus escape the trap?*")),
      ("Grades 5–6", (["Roman rule in Judaea: emperors, client kings and prefects", "Image and inscription as claims of power", "How historians use coins as evidence"],
                  "Pilate, the Tribute Penny, the Shekel of Tyre and Aretas IV.",
                  "*if someone found one of our coins in two thousand years, what would it tell them?*")),
      ("Grades 7–8", (["Corroboration: Josephus, Suetonius and the Pilate Stone", "Authentication, and the habit of asking *is this authentic?*", "Faith and reason as partners in the search for truth"],
                  "Agrippa I, Claudius, Festus and both posters.",
                  "*what would it take to convince you an ancient coin is real?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "Several of these stories are violent: Herod the Great’s order in Bethlehem, John the Baptist’s death, the execution of James. For PreK–4, tell Herod the Great’s coin as the story of the flight into Egypt, and let the Widow’s Mite, the Tribute Penny and Augustus carry the visit."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "Which coin surprised you most, and why?",
        "Which person who held one of these coins would you most like to have met?",
        "Jesus said, give back to God what is God’s. What belongs to God?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Design a coin for your school: whose image, whose inscription?",
        "Write the journey of one coin from hand to hand",
        "Make a coin rubbing, and look for what makes each coin different"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, coin by coin", "body": [
      "Ask one, wait, and let students look before anyone answers — in front of the case or with the coin on screen."]}),
    ("html", asks(QUESTIONS)),
    ("cols", [
      [("section", {"label": "At Hands of History", "list": [
        "Whose hands held this coin? What did they buy with it?",
        "The coins survived and the hands did not. Who would you most like to have met?"]})],
      [("section", {"label": "At Real or Replica?", "list": [
        "Which one is genuine? What clue gave the fake away?",
        "A genuine widow’s mite is crude and off-center. Why should a *perfect* one make you suspicious?"]})]]),

    ("pagebreak", None),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Religion", "Render unto Caesar and the image of God; the widow’s gift; thirty pieces of silver; Jesus’ silence before Antipas; the *Faith and Reason* poster."),
      ("Social Studies", "How Rome ruled Judaea through emperors, client kings, prefects and procurators; Roman citizenship and Paul’s appeal; Josephus and Suetonius."),
      ("Math", "Timelines across BC and AD; the length of a reign; weight in grams (Pilate’s prutah, 1.79 g); a half-shekel Temple tax — what would thirty shekels pay?"),
      ("Art", "What rulers put on coins: Tiberius’ face, Melqart, Pilate’s ladle and ears of grain — and Herod’s coins, with no human image at all."),
      ("ELA", "Point of view in *Hands of History*: the story of a coin told by the hand that held it. The trap question, and Jesus’ answer with a question of his own."),
      ("Science", "Bronze and silver; why the Tyrian shekel’s pure silver mattered; struck and cast coins; patina, wear and the clues experts read in *Real or Replica?*")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“A replica is a fake.”", "Three coins here are museum-quality replicas, labeled as such. A fake is made to deceive; a replica is honest about what it is."),
      ("“A real ancient coin looks perfect.”", "A genuine lepton was struck crudely and off-center. If a lepton looks perfect, be suspicious: the imperfection is the proof."),
      ("“The coins prove the Gospel.”", "Faith is not proved by archaeology, as the exhibition says plainly. The coins prove that the world the Gospels describe was a real world.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one coin, the Bible story it belongs to and the person who held it*",
        "**Think-pair-share:** *why does it matter that a coin can be tested in a way a text cannot?*",
        "**Quick write:** *what does the Widow’s Mite teach about giving?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A museum label for one coin: date, ruler, verse and why it matters",
        "A timeline of all eleven coins, placed across BC and AD",
        "A *Real or Replica?* talk explaining one way fakes are made"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K, Grades 1–2 and Grades 3–4, and for Grades 5–8 in four subjects: Religion (*Whose Image Is This?*, on the Tribute Penny), Social Studies, Math and Art. Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. All three levels read the same coin and the same passage, so the class can talk together afterward whatever each student chose. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** the coins, the Gospel Timeline, *Hands of History*, *Real or Replica?* and both posters are online at minimuseumproject.org/exhibitions/in-their-hands, and every plan and handout is at {RESOURCES}. Even ten minutes with one coin and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

# The level colors and tints are build.py's LEVELS and TINTS.
LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Read the passage in short parts, label the coin’s image and inscription, finish the sentence *I carry God’s image, so…* and draw yourself as a coin."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Explain the trap and why Jesus’ answer escapes it, compare the coin with Genesis 1:27 in a chart, and write a paragraph of reflection."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Weigh three readings of Jesus’ answer, apply the Catechism to a modern case, and design a coin for the Kingdom of God.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Whose Image Is This?</i></span>{md(ex)}</p></div>')
    return f'<div class="lvcards">{out}</div>'

def steps(items):
    return '<ol class="steps">' + "".join(
        f'<li><span class="sn">{i}</span><h4>{md(t)}</h4><p>{md(b)}</p></li>' for i, (t, b) in enumerate(items, 1)) + "</ol>"

def checks(items):
    return '<ul class="checks">' + "".join(f"<li><b>{md(t)}</b> {md(b)}</li>" for t, b in items) + "</ul>"

def say_avoid(say, avoid):
    col = lambda cls, lab, xs: (f'<div class="{cls}"><p class="sa">{lab}</p>'
                                + "".join(f"<p>“{md(x)}”</p>" for x in xs) + "</div>")
    return '<div class="sayavoid">' + col("say", "Say this", say) + col("avoid", "Avoid", avoid) + "</div>"

DIFF_CSS = """
.hero { height: 2.05in; margin-bottom: 11pt; }
.hero h1 { font-size: 29pt; }
.lvcards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt; margin: 4pt 0 12pt; break-inside: avoid; }
.lvc { border-radius: 5pt; padding: 0 10pt 6pt; font-size: 9pt; }
.lvb { font: 500 8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; background: var(--lv); color: #fff;
  margin: 0 -10pt 7pt; padding: 7pt 10pt 6pt; border-radius: 5pt 5pt 0 0; }
.lvb small { display: block; font-weight: 300; font-size: 6.8pt; letter-spacing: .16em; opacity: .92; }
.says { font: italic 400 14pt/1.2 'Cormorant Garamond', serif; margin-bottom: 4pt; }
.ex { border-top: .8pt solid var(--lv); padding-top: 5pt; margin-top: 6pt; }
.ex span { display: block; font: 500 6.6pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: var(--lv); margin-bottom: 1pt; }
.ex span i { font-style: normal; }
.steps { list-style: none; padding: 0; margin: 4pt 0 12pt; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10pt; }
.steps li { margin: 0; font-size: 8.8pt; border-top: 1.2pt solid var(--accent); padding-top: 4pt; }
.steps .sn { font: 500 22pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.steps h4 { font-size: 11.5pt; margin: 2pt 0 3pt; }
.sayavoid { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 12pt; break-inside: avoid; }
.sayavoid > div { padding: 7pt 11pt 3pt; border-left: 3pt solid; }
.say { border-color: #4A7346 !important; background: #eef3ea; } .avoid { border-color: #A8452F !important; background: #f8ece7; }
.sayavoid p:not(.sa) { font: italic 400 11.5pt/1.3 'Cormorant Garamond', serif; margin-bottom: 4pt; }
.sa { font: 500 7.5pt 'Outfit'; letter-spacing: .24em; text-transform: uppercase; margin-bottom: 4pt; }
.say .sa { color: #4A7346; } .avoid .sa { color: #A8452F; }
.checks { list-style: none; padding: 0; margin: 4pt 0 10pt; display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
.checks li { position: relative; padding-left: 16pt; margin: 0; }
.checks li::before { content: "✓"; position: absolute; left: 0; top: -1pt; font: 500 11pt 'Outfit'; color: #4A7346; }
.goal { background: #14120f; color: #efe8d6; border-radius: 6pt; padding: 12pt 16pt 7pt; margin: 6pt 0 12pt; break-inside: avoid; }
.goal .label { color: #e3c46f; }
.goal p:not(.label) { font: 400 13pt/1.35 'Cormorant Garamond', serif; }
.refs { break-inside: avoid; }
.gstrip { display: flex; height: 5pt; margin: 2pt 0 8pt; border-radius: 3pt; overflow: hidden; }
.gstrip i { flex: 1; }
"""

DIFF = {
  "out": "Using Differentiated Student Handouts.pdf", "eyebrow": "Teacher guide",
  "title": "Using the Differentiated Student Handouts",
  "sub": "A guide to self-selection and flexible differentiation · In Their Hands",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg", "pos": "center 24%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Religion lesson, *Whose Image Is This?*"]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same coin, the same passage — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition’s coins, asks for reflection, and can be completed in class or at home."]}),
    ("section", {"label": "What the research says", "body": [
      "Student self-selection of challenge level (sometimes called *differentiation by choice*) has been shown to increase student motivation and engagement, develop metacognitive skills, reduce anxiety around differentiation, build a growth mindset, and allow teachers to differentiate without public tracking."]}),
    ("section", {"label": "Language matters"}),
    ("html", say_avoid(
      ["Choose the challenge level that feels right for you today.",
       "Green gives more support. Yellow is grade level. Red goes deeper. All three are good choices.",
       "You can switch levels anytime."],
      ["Green is for struggling students.",
       "Red is for advanced students.",
       "Why did you pick that level?"])),

    ("section", {"label": "Why self-selection works", "title": "Choice without labels"}),
    ("html", checks([
      ("Removes stigma.", "No public ability grouping. Students aren’t labeled “low” or “high.”"),
      ("Builds agency.", "Students learn to recognize when they need support and when they want a challenge."),
      ("Allows flexibility.", "A student might choose Green in a subject that feels unfamiliar and Red in one where they feel confident."),
      ("Differentiates without labeling.", "You meet diverse needs without fixed groups."),
      ("Respects daily variation.", "A student may choose differently on a tired Monday than on an energized Thursday.")])),
    ("section", {"label": "Adapting for your classroom"}),
    ("refs", [
      ("If you prefer to assign levels", "You can still use these handouts by giving specific levels to specific students, based on your knowledge of their needs. The materials work both ways."),
      ("If you want to modify them", "Treat each handout as a starting point: leave out a part, add a question, or shorten the writing to suit your class."),
      ("If you only want one level", "That’s fine too. Use whichever level best matches your class.")]),
    ("html", '<div class="goal"><div class="gstrip"><i style="background:#4A7346"></i><i style="background:#86671A"></i><i style="background:#A8452F"></i></div>'
             '<p class="label">The goal</p><p>Every student engages with the core content at a level that challenges them appropriately. Some need more support to reach the content. Some need extensions to stay engaged. Most are ready for grade-level work. All deserve choice and respect.</p></div>'),
    ("section", {"label": "Questions?", "body": [
      "These handouts are designed to make differentiation easier for you, not harder. If something isn’t working, adjust it. The structure is a tool, not a rule.",
      "**Most importantly: the handouts are optional.** The lesson plan itself provides everything you need. The handouts are an additional resource for extending learning, providing practice, or sending work home.",
      f"Every In Their Hands lesson plan — PreK–K, Grades 1–2, Grades 3–4, and Religion, Social Studies, Math and Art for Grades 5–8 — has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
