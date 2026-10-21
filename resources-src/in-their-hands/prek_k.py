"""PreK–Kindergarten · "Two Tiny Coins"
Built on the Widow's Mite (Case 7) and Mark 12:41–44. Facts follow
app/exhibitions/in-their-hands/artifacts/coin-data.ts, the Gospel Timeline
stop and the Hands of History widow."""

C = "/exhibitions/in-their-hands/artifacts/coins/"
H = "/exhibitions/in-their-hands/Hands/"
DIR = "teachers/prek-k/"
TITLE = "Two Tiny Coins"
SUB = "PreK–Kindergarten · The Widow’s Mite"

# the timeline's passage, word for word
PASSAGE = {"text": "Jesus sat down opposite the place where the offerings were put and watched the crowd putting their money into the temple treasury. Many rich people threw in large amounts. But a poor widow came and put in two very small copper coins, worth only a few pence. Calling his disciples to him, Jesus said, ‘Truly I tell you, this poor widow has put more into the treasury than all the others. They all gave out of their wealth; but she, out of her poverty, put in everything — all she had to live on.’",
           "ref": "Mark 12:41–44"}
# coin-data verseText, word for word
VERSE = {"text": "A poor widow came and put in two very small copper coins, worth only a few cents. Jesus said: she gave more than all the others.",
         "ref": "Mark 12:41–44"}

COIN = {"img": C + "widow-2-front.png", "label": "Case 7 · Ministry and Passion",
        "title": "The Widow’s Mite",
        "facts": [("Coin", "Bronze lepton"), ("Date", "103–76 BC, circulating 1st c. AD"),
                  ("Reference", "Hendin 1150"), ("Scripture", "Mark 12:41–44")],
        "body": ["The lepton was the smallest coin in use in Judaea in Jesus’ time. These are genuine coins of the same kind the widow gave. The exhibition shows **two** because the Gospel says two."]}
HERO = {"img": H + "widow-full-v4.jpg", "pos": "center 30%"}

TWO = [{"img": C + "widow-1-front.png", "cap": "Coin 1"}, {"img": C + "widow-2-front.png", "cap": "Coin 2"}]

# ── pictures and spaces built for small hands ─────────────────────────
CSS = """
.pair { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.pair img { width: 78pt; height: 78pt; object-fit: contain; filter: drop-shadow(0 3pt 5pt rgba(0,0,0,.25)); }
.nums { display: flex; justify-content: center; gap: 30pt; margin: 2pt 0 6pt; }
.nums span { width: 54pt; height: 54pt; border-radius: 50%; border: 1.6pt solid #1d1c1a; background: rgba(255,255,255,.6);
  display: grid; place-items: center; font: 500 34pt/1 'Cormorant Garamond', serif; }
.match { display: grid; grid-template-columns: 120pt 1fr 120pt; align-items: center; gap: 8pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match .coins { display: grid; gap: 6pt; justify-items: center; }
.match .coins img { width: 54pt; height: 54pt; object-fit: contain; filter: drop-shadow(0 3pt 5pt rgba(0,0,0,.25)); }
.match .hands { width: 120pt; height: 128pt; object-fit: cover; object-position: center 58%; border-radius: 6pt; border: 1pt solid #1d1c1a; }
.match .path { position: relative; height: 16pt; }
.match .path::before, .match .path::after { content: ""; position: absolute; top: 50%; width: 14pt; height: 14pt; margin-top: -7pt; border-radius: 50%; background: #1d1c1a; }
.match .path::before { left: 0; } .match .path::after { right: 0; }
.match .path.dotted i { position: absolute; left: 14pt; right: 14pt; top: 50%; border-top: 3pt dotted #7c796f; }
.gift { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; margin: 6pt 0 10pt; break-inside: avoid; }
.gift > div { border: 1pt solid #1d1c1a; border-radius: 8pt; background: rgba(255,255,255,.6); height: 118pt;
  display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; padding: 8pt; }
.gift p { margin: 0; font: 500 13pt 'Outfit'; }
.heap { display: flex; flex-wrap: wrap; justify-content: center; gap: 3pt; width: 170pt; }
.heap i { width: 24pt; height: 24pt; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f0dc96, #c9a84c 60%, #8a6d22); border: .8pt solid #6b5212; }
.tiny { display: flex; gap: 6pt; }
.tiny img { width: 30pt; height: 30pt; object-fit: contain; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.coins2 { display: flex; justify-content: center; gap: 36pt; }
.coins2 .coindraw { margin: 2pt 0 4pt; }
body.young .coins2 .coindraw > div { width: 140pt; height: 140pt; }
.trace span.lead { color: #1d1c1a; font: 400 40pt/1 'Outfit'; letter-spacing: .04em; bottom: -3pt; }
body.young .prayer p:not(.label) { font-size: 15pt; }
"""

PAIR = ('<div class="pair"><img src="' + C + 'widow-1-front.png" alt=""><img src="'
        + C + 'widow-2-front.png" alt=""></div>')
NUMS = '<div class="nums"><span>1</span><span>2</span><span>3</span></div>'
def match(dotted):
    path = '<div class="path dotted"><i></i></div>' if dotted else '<div class="path"></div>'
    return ('<div class="match"><div class="coins"><img src="' + C + 'widow-1-front.png" alt="">'
            '<img src="' + C + 'widow-2-front.png" alt=""></div>' + path
            + '<img class="hands" src="' + H + 'widow-hands-v2.jpg" alt=""></div>')
GIFT = ('<div class="gift"><div><div class="heap">' + "<i></i>" * 12 + '</div><p>Many coins</p></div>'
        '<div><div class="tiny"><img src="' + C + 'widow-1-front.png" alt=""><img src="' + C
        + 'widow-2-front.png" alt=""></div><p>Two tiny coins</p></div></div>')
def trace(model=False, rows=1):
    first = f'<div><span class="model">GIVE</span></div>' if model else '<div><span>GIVE</span></div>'
    rest = "<div></div>" * (rows - 1)
    return f'<div class="trace">{first}{rest}</div>'
HANDS = ('<div style="display:flex;justify-content:center;margin:4pt 0 8pt"><img src="' + H
         + 'widow-hands-v2.jpg" alt="" style="width:300pt;height:100pt;object-fit:cover;object-position:center 62%;border-radius:6pt;border:1pt solid #1d1c1a"></div>')
COLOR = ('<div class="coins2"><div class="coindraw"><div><span>Coin 1</span></div></div>'
         '<div class="coindraw"><div><span>Coin 2</span></div></div></div>')

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "out": DIR + "ITH_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": HERO, "css": CSS,
  "blocks": [
    ("timing", [("Circle time", 4, "#7D8471"), ("The story", 6, "#2F4A5A"), ("Look closely", 3, "#4A7346"),
                ("Activity", 10, "#86671A"), ("Prayer", 2, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will hear the story of the poor widow who put two tiny coins into the Temple treasury, and learn that Jesus called her gift the biggest of all because she gave everything she had. They will count to two, compare *many* and *two*, and think of something they could give to God and to others."]}),
    ("cols", [[("section", {"label": "Themes", "list": [
      "**Scripture** — Mark 12:41–44, the widow’s offering",
      "**Catechism** — CCC 2544: shortly before his Passion, Jesus held up the poor widow, who gave all she had to live on, as an example for his disciples",
      "**Virtue** — generosity: giving with the whole heart, not only from what is left over",
      "**Early learning** — counting to two; comparing *many* and *few*; fine motor skills (tracing, coloring, drawing a line); listening and retelling"]})],
    [("section", {"label": "Materials needed", "list": [
      "A big handful of coins and **two** pennies, kept apart",
      "A bowl or basket to be the Temple treasury",
      "The *Show your class* page (page 3), projected or printed",
      "Crayons, including brown, and the differentiated handouts"]})]]),
    ("section", {"label": "Circle time · 4 minutes", "title": "Many coins, two coins",
      "body": ["Sit in a circle with the bowl in the middle. Drop the big handful of coins in, one noisy handful at a time. Then, quietly, drop in the two pennies. Ask: *“Who gave more?”* Most children will point to the big handful. Say: *“Jesus watched people doing just this. And he said something surprising.”*"]}),
    ("section", {"label": "The story · 6 minutes", "title": "The poor widow",
      "body": [
        "Explain that a widow is a woman whose husband has died. In Jesus’ time a widow often had very little. Tell the story simply: Jesus sat near the place in the Temple where people put their money for God. Many rich people put in lots of coins. Then a poor widow came. She put in two tiny coins. That was all she had.",
        "Jesus called his friends over. He told them that the widow had given more than everyone else. The others gave what they had left over; she gave everything. Read the passage aloud:"]}),
    ("verse", PASSAGE),
    ("section", {"label": "Look closely · 3 minutes", "title": "Real coins from Jesus’ time",
      "body": ["Show the two coins on page 3. These are real coins, very old, the same kind the widow gave. The exhibition shows **two** because the Gospel says two. Let children hold up two fingers, then cup their hands like the widow’s hands in the picture. Ask: *“Are they big or tiny? What color are they?”*"]}),
    ("section", {"label": "Activity · 10 minutes", "body": ["Each child works on a handout. All three show the same two coins and the same question: which was the biggest gift?"]}),
    ("levels", {
      "green": "Picture-led. Count the coins and circle the number, follow the dotted line from the coins to the widow’s hands, circle the biggest gift, color the two coins, trace *GIVE*.",
      "yellow": "A little writing. Circle the number, draw a line from the coins to the hands, circle the biggest gift, copy *GIVE* under a model, then draw a gift of their own.",
      "red": "Draw and tell. Circle the biggest gift and say why, draw something they could give that matters to them, then tell a grown-up about it or write a few words."}),
    ("section", {"label": "Closing prayer · 2 minutes",
      "body": ["Ask the children to hold out their cupped hands, like the widow. Pray together, a line at a time: *“Dear Jesus, the widow gave you all she had. Help me to give you my heart, and to share with others. Amen.”*"]}),
    ("connection", ["**Visit the exhibition:** find the Widow’s Mite in Case 7, *Ministry and Passion*. Count the coins together — there are two.",
                    "**Virtual visit:** in *Hands of History*, the children can meet the widow and see her hands holding the coins."]),
    ("cols", [[("section", {"label": "For the teacher", "title": "Why two tiny coins were the biggest gift",
      "body": [
        "**The amount is not the point.** The lepton was the smallest coin in use in Judaea. What Jesus measures is the proportion: the rich gave from what they had to spare, the widow gave everything she had to live on.",
        "**A gift that costs something.** Young children understand this when it is made concrete. Sharing a favorite toy is a bigger gift than giving away one we no longer want. Help them name gifts of time and kindness as well as things.",
        "**The last teaching.** In the exhibition, this is the last public teaching of Jesus before the events of the Passion began. A few days later he would give everything too."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child hold up or circle **two** for the widow’s coins?",
      "Can the child say, in their own words, why Jesus called hers the biggest gift?",
      "Can the child name one thing they could give — a thing, some time or a kindness?"]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The widow’s two coins", "body": ["Project or print this page for circle time, or take it to Case 7."]}),
    ("specimen", COIN),
    ("coins", {"label": "The two coins in Case 7", "items": TWO}),
    ("html", '<div style="display:grid;grid-template-columns:150pt 1fr;gap:16pt;align-items:center;margin:4pt 0 10pt;break-inside:avoid">'
             '<img src="' + H + 'widow-hands-v2.jpg" alt="" style="width:150pt;height:210pt;object-fit:cover;object-position:center 58%;border-radius:6pt;border:1pt solid #1d1c1a">'
             '<div><p class="label">Hands of History</p><h3>Whose hands held this lepton?</h3>'
             '<p>The exhibition imagines the widow’s hands, holding her two coins at the Temple. Being a widow, she would have had very little. She put in two leptons — everything she had.</p></div></div>'),
    ("section", {"label": "Questions to ask the children", "list": [
      "How many coins can you see? Let’s count them together.",
      "Are these coins big or tiny?",
      "The rich people gave lots of coins. Why did Jesus say the widow gave the most?",
      "What could *you* give to God, or to someone who needs it?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "PreK–Kindergarten", "level": level, "young": True, "css": CSS,
            "context": CONTEXT,
            "foot": f"Student Handout · PreK–Kindergarten · {level.title()} Level", "blocks": blocks, "hero": HERO}

CONTEXT = ["**A grown-up reads this aloud.** Jesus watched people giving money to God at the Temple. Rich people put in many coins. Then a poor widow put in two tiny coins. It was all she had. Jesus said she gave more than all the others."]

GREEN = handout("green", "ITH_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Count the coins. Circle the number.",
            "blocks": [("html", PAIR + NUMS)]}),
  ("task", {"label": "Part 2", "title": "Follow the dots from the coins to her hands.",
            "blocks": [("html", match(True))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Jesus said one gift was the biggest. Circle it.",
            "blocks": [("html", GIFT)]}),
  ("task", {"label": "Part 4", "title": "Color the two coins brown.",
            "blocks": [("html", COLOR)]}),
  ("task", {"label": "Part 5", "title": "Trace the word.",
            "blocks": [("html", trace(rows=2).replace("<div></div>", "<div><span>GIVE</span></div>"))]}),
  ("prayer", ["Dear Jesus, help me to give with all my heart. Amen."]),
  ("family", ["Read Mark 12:41–44 together. Put two coins in your child’s hand and ask: *how many coins did the widow give? Why was hers the biggest gift?*"]),
])

YELLOW = handout("yellow", "ITH_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "How many coins did the widow give? Circle the number.",
            "blocks": [("html", PAIR + NUMS)]}),
  ("task", {"label": "Part 2", "title": "Draw a line from the coins to her hands.",
            "blocks": [("html", match(False))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Jesus said one gift was the biggest. Circle it.",
            "blocks": [("html", GIFT)]}),
  ("task", {"label": "Part 4", "title": "Copy the word.",
            "blocks": [("html", trace(model=True, rows=2))]}),
  ("task", {"label": "Part 5", "title": "Draw something you could give.",
            "blocks": [("draw", "My gift")]}),
  ("family", ["Read Mark 12:41–44 together. Keep a jar for giving, and decide together what you could put in it — coins, or a kindness written on a slip of paper."]),
])

RED = handout("red", "ITH_Handout_Red_PreK_K.pdf", [
  ("task", {"label": "Part 1", "title": "Look at the widow’s hands. How many coins? Circle the number.",
            "blocks": [("html", HANDS + NUMS)]}),
  ("task", {"label": "Part 2", "title": "Jesus said one gift was the biggest. Circle it, then tell a grown-up why.",
            "blocks": [("html", GIFT)]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw a gift you could give that really matters to you.",
            "blocks": [("draw", "My gift")]}),
  ("task", {"label": "Part 4", "title": "Finish the sentence, or tell a grown-up what to write.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">I can give</span></div><div></div><div></div></div>')]}),
  ("prayer", ["Dear Jesus, the widow gave you all she had. Help me to give you my heart. Amen."]),
  ("family", ["Read Mark 12:41–44 together. Ask your child: *what could we give that really costs us something?* Not only money — time, help, or a favorite thing."]),
])

RED["css"] = CSS + "body.young .drawbox { height: 236pt; }"

DOCS = [LESSON, GREEN, YELLOW, RED]
