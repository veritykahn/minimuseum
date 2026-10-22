"""Grades 1–2 · Hands of History · "Whose Hands Held This?"
Four of the people in Hands of History, each with the coin they held.
Facts follow app/exhibitions/in-their-hands/hands/page.tsx (handsCharacters)
and app/exhibitions/in-their-hands/artifacts/coin-data.ts.

The Bethlehem story is told gently for this age: the Holy Family's escape
to Egypt (Matthew 2:13–15), never Herod's order in Matthew 2:16. The Shekel
of Tyre's later part in the betrayal is left for older grades."""

C = "/exhibitions/in-their-hands/artifacts/coins/"
H = "/exhibitions/in-their-hands/Hands/"
DIR = "teachers/grades-1-2/"
TITLE = "Whose Hands Held This?"
SUB = "Grades 1–2 · Hands of History · Coins and the people who held them"

HERO = {"img": H + "widow-full-v4.jpg", "pos": "center 30%"}

# the four people, each with the coin they held. "crop" places the face
# in a square or short portrait frame.
PEOPLE = {
  "widow":    {"name": "The Widow", "img": H + "widow-full-v4.jpg", "crop": "center 26%",
               "coin": C + "widow-1-front.png", "coinname": "The Widow’s Mite",
               "clue": "The smallest coin of all", "place": "At the Temple"},
  "merchant": {"name": "The Merchant", "img": H + "merchant-full-v1.jpg", "crop": "center 20%",
               "coin": C + "augustus-front.png", "coinname": "Coin of Augustus Caesar",
               "clue": "It shows the emperor’s face", "place": "In the market"},
  "mother":   {"name": "The Mother in Bethlehem", "img": H + "mother-full-v1.jpg", "crop": "center 32%",
               "coin": C + "herod-great-front.png", "coinname": "Coin of King Herod",
               "clue": "It has no face on it", "place": "At home"},
  "priest":   {"name": "The Temple Priest", "img": H + "temple-priest-full-v1.jpg", "crop": "center 16%",
               "coin": C + "shekel.png", "coinname": "Shekel of Tyre (replica)",
               "clue": "Pure silver, for the Temple", "place": "At the Temple"},
}
ORDER = ["widow", "merchant", "mother", "priest"]

# Each person's story, as printed on the plan's "Show your class" page and
# read aloud from the classroom screen: (name, scripture, story).
CARDS = {
  "widow": ("The Widow", "Mark 12:41–44", "At the Temple, rich people put in large gifts. A poor widow came and put in two tiny coins — all she had. Jesus told his friends she had given more than all the others. Her coin, the lepton, was the smallest coin people used. The exhibition shows **two**, because the Gospel says two."),
  "merchant": ("The Merchant", "Luke 2:1", "In a busy market, a merchant counts the day’s coins. Many show the face of Augustus Caesar, the emperor in faraway Rome. Augustus ordered a census, a counting of all the people — and that is why Mary and Joseph traveled to Bethlehem, where Jesus was born."),
  "mother": ("The Mother in Bethlehem", "Matthew 2:13–15", "A mother uses small coins to buy bread and oil for her family. King Herod made these coins, and they have no face on them, because Jewish law did not allow it. When Jesus was born, an angel told Joseph in a dream to take Mary and the baby to Egypt, where they would be safe."),
  "priest": ("The Temple Priest", None, "A priest works at the Temple, where people paid a Temple tax each year. The Temple accepted only one coin for it, the shekel of Tyre, because its silver was the purest. The priest held hundreds every day. Ours is a **replica** — a careful copy — because real ones are very rare."),
}

# Said in the plan and shown on the classroom screen, so written once.
PRAYER = "Jesus, the widow gave you everything in her hands. Here are my hands. Help me to give with a happy heart — my time, my kindness and my love. Amen."

# What children will be able to do, set up front in the plan and on the
# cover screen, then asked back in the Look back: (objective, the same as
# a question, go deeper?).
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("match each coin to the person who held it, using picture clues",
     "match each coin to the hands that held it?", False),
    ("tell the story of the widow’s two tiny coins, and why Jesus called her gift the biggest",
     "tell why the widow’s two tiny coins were the biggest gift?", False),
    ("say how the emperor’s census brought Mary and Joseph to Bethlehem",
     "say why Mary and Joseph went to Bethlehem?", False),
    ("speak or write as one of the people, telling what is in your hands",
     "be one of the people, and tell their story?", True)],
  "why": "Every coin here was held by someone, two thousand years ago, in the land where Jesus lived. Their stories reach us through hands just like yours."}
LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

# ── on the classroom screen (Lesson mode; build.py ignores "screen") ─────
# The screen shows each person by their hands, as the Hands of History game
# does; the full portraits stay on the printed page.
HANDS = {
  "widow": (H + "widow-hands-v2.jpg", "center 50%", "Old, cupped hands holding two tiny coins"),
  "merchant": (H + "merchant-hands-v2.jpg", "center 60%", "Hands counting coins on a market table"),
  "mother": (H + "mother-hands-v1.jpg", "center 50%", "Open hands holding one small bronze coin"),
  "priest": (H + "temple-priest-hands-v2.jpg", "center 35%", "Hands lifting a silver coin up to a lamp"),
}
COIN_ALT = {
  "widow": "The Widow’s Mite, a tiny bronze coin",
  "merchant": "A bronze coin of Augustus Caesar, showing the emperor’s face",
  "mother": "A small bronze coin of King Herod, with no face on it",
  "priest": "The Shekel of Tyre, a silver coin; a museum-quality replica",
}

def screen_person(k, named=True):
    img, pos, alt = HANDS[k]
    p = PEOPLE[k]
    return {"img": img, "pos": pos, "alt": alt, "coin": p["coin"], "coinAlt": COIN_ALT[k],
            **({"name": p["name"], "label": p["place"]} if named else {})}

PERSON_TASKS = {
  "widow": ["Look at her hands. What is she doing?", "How many coins did she give?"],
  "merchant": ["What are his hands doing?", "Whose face is on his coins?"],
  "mother": ["What will she buy with her coins?", "King Herod’s coin has no face. Why not?"],
  "priest": ["Where does the priest work?", "Is his coin real, or a careful copy?"],
}
PERSON_WHY = {
  "widow": "Hear the widow’s story: the smallest gift, and the biggest to Jesus.",
  "merchant": "Connect an emperor’s coin to the census that brought Mary and Joseph to Bethlehem.",
  "mother": "Meet an everyday coin with no face, and hear how God kept the Holy Family safe.",
  "priest": "See the Temple’s own coin, and tell a real coin from a careful copy.",
}

def person_step(k):
    name, ref, story = CARDS[k]
    p = PEOPLE[k]
    return {"phase": "Story time", "minutes": 2, "title": name, "show": "person",
            "script": ["**Read the card aloud.** " + story],
            "person": screen_person(k), "coinName": p["coinname"].replace(" (replica)", ""),
            **({"replica": True} if "(replica)" in p["coinname"] else {}),
            "story": story, **({"ref": ref} if ref else {}),
            "purpose": PERSON_WHY[k], "students": PERSON_TASKS[k]}

# the corner game: each coin by its clue, in the handouts' order
CLUE_COINS = [{"img": PEOPLE[k]["coin"], "name": PEOPLE[k]["clue"], "alt": COIN_ALT[k],
               **({"replica": True, "feature": False} if "(replica)" in PEOPLE[k]["coinname"] else {})}
              for k in ["merchant", "widow", "priest", "mother"]]

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
/* the "Show your class" page starts a page, even when the plan fills the one before to the foot */
.pb { break-after: auto; break-before: page; }
"""

# ── custom blocks: portraits and the matching exercise ───────────────────

CSS = """
.people { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10pt; margin: 4pt 0 12pt; break-inside: avoid; }
.person { margin: 0; position: relative; }
.person .ph { width: 100%; height: 150pt; object-fit: cover; border-radius: 5pt; display: block; }
.person .pc { position: absolute; right: -4pt; top: 112pt; width: 52pt; height: 52pt; object-fit: contain;
  filter: drop-shadow(0 3pt 5pt rgba(0,0,0,.45)); }
.person figcaption { margin-top: 18pt; }
.person h4 { margin: 0 0 1pt; }
.person p { font-size: 8.6pt; line-height: 1.35; margin: 0 0 3pt; }
.person .label { font-size: 6.8pt; letter-spacing: .18em; }
.big .person .ph { height: 190pt; }
.big .person .pc { top: 145pt; width: 64pt; height: 64pt; }
.big .person figcaption { margin-top: 22pt; }
/* matching: coins on the left, people on the right, dots to join */
.match { display: grid; grid-template-columns: 1.3fr 44pt 1fr; row-gap: 9pt; margin: 6pt 0 4pt; break-inside: avoid; }
.match .l, .match .r { display: flex; align-items: center; gap: 10pt; position: relative; }
.match .r { justify-content: flex-start; }
.match .l { justify-content: flex-end; text-align: right; }
.match .l img { width: 64pt; height: 64pt; object-fit: contain; flex: none; }
.match .r img { width: 64pt; height: 64pt; object-fit: cover; border-radius: 50%; flex: none; border: 1.5pt solid #1d1c1a; }
.match .cap { font: 400 10.5pt/1.25 'Outfit'; }
.match .cap b { display: block; }
.match .dot { width: 11pt; height: 11pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.match .lt { font: 600 20pt/1 'Cormorant Garamond', serif; color: var(--gold-big); width: 16pt; flex: none; }
.match .box { width: 30pt; height: 30pt; border: 1.2pt solid #1d1c1a; border-radius: 4pt; flex: none; background: rgba(255,255,255,.6); }
.bank { display: flex; flex-wrap: wrap; gap: 8pt; margin: 4pt 0 12pt 42pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 14pt; font: 400 12pt 'Outfit'; background: rgba(255,255,255,.6); }
.fill { margin-left: 42pt; } .fill p { margin: 0 0 14pt; }
.steps .st { display: grid; grid-template-columns: 72pt 1fr; gap: 8pt; align-items: start; margin-bottom: 4pt; }
.steps .st b { padding-top: 14pt; }
.steps .write { margin: 0; }
body.young .small .coindraw > div { width: 130pt; height: 130pt; }
.indent { margin-left: 42pt; margin-bottom: 9pt; }
.iam { margin: 0; }
.iam u { display: inline-block; min-width: 230pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.fill u { display: inline-block; min-width: 110pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.circle { display: flex; gap: 22pt; justify-content: center; margin: 6pt 0 10pt; }
.circle span { width: 46pt; height: 46pt; border-radius: 50%; border: 1pt solid #8d8a80; display: grid; place-items: center;
  font: 400 18pt 'Outfit'; background: rgba(255,255,255,.55); }
.cols.mid { align-items: center; }
"""

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def people(keys, stories=None, big=False):
    out = []
    for k in keys:
        p = PEOPLE[k]
        body = f"<p>{stories[k]}</p>" if stories else ""
        out.append(f'<figure class="person"><img class="ph" src="{p["img"]}" style="object-position:{p["crop"]}" alt="">'
                   f'<img class="pc" src="{p["coin"]}" alt=""><figcaption><p class="label">{esc(p["place"])}</p>'
                   f'<h4>{esc(p["name"])}</h4><p><i>{esc(p["coinname"])}</i></p>{body}</figcaption></figure>')
    return ("html", f'<div class="people{" big" if big else ""}">' + "".join(out) + "</div>")

def match(coins, persons, clues=True, letters=False):
    """coins and persons in two (shuffled) orders. letters=True: write the
       person's letter in the box under each coin instead of drawing a line."""
    rows = ""
    for i, (c, q) in enumerate(zip(coins, persons)):
        pc, pq = PEOPLE[c], PEOPLE[q]
        cap = f'<b>{esc(pc["coinname"])}</b>' + (esc(pc["clue"]) if clues else "")
        mark = '<span class="box"></span>' if letters else '<span class="dot"></span>'
        lt = f'<span class="lt">{"ABCD"[i]}</span>' if letters else '<span class="dot"></span>'
        rows += (f'<div class="l"><span class="cap">{cap}</span><img src="{pc["coin"]}" alt="">{mark}</div><div></div>'
                 f'<div class="r">{lt}<img src="{pq["img"]}" style="object-position:{pq["crop"]}" alt="">'
                 f'<span class="cap"><b>{esc(pq["name"])}</b></span></div>')
    return ("html", f'<div class="match">{rows}</div>')

# ── the lesson plan ──────────────────────────────────────────────────────

LESSON = {
  "slug": "whose-hands-held-this", "large": True,
  "out": DIR + "ITH_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "css": CSS + OBJ_CSS,
  "screen_hero": {"img": "/exhibitions/in-their-hands/hands.jpg", "pos": "center 40%"},
  "blocks": [
    ("timing", [("Hook", 4, "#7D8471"), ("Story time", 10, "#2F4A5A"), ("Activity", 12, "#86671A"), ("Close", 4, "#A8452F")]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will learn that the coins in the exhibition were really used, two thousand years ago, by people in the land where Jesus lived. They will meet four of those people, match each coin to the hands that held it, and hear how two of the coins belong to stories in the Gospels: the widow who gave everything, and the census that brought Mary and Joseph to Bethlehem."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Scripture** — Mark 12:41–44; Luke 2:1–7; Matthew 2:13–15",
        "**Catechism** — CCC 2544: the poor widow who gave all she had to live on",
        "**Social Studies** — people long ago: work, home, market and worship",
        "**Virtue** — generosity: giving what truly costs us something"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the four people and their coins",
      "A few coins from a pocket or purse",
      "Four signs for the corners of the room: *Widow, Merchant, Mother, Priest*",
      "Differentiated handouts, one per child; crayons"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "Who held this before you?",
      "screen": {"phase": "Hook", "show": "people", "people": [screen_person(k, named=False) for k in ORDER],
                 "purpose": "Wonder who held a coin before us: coins pass from hand to hand.",
                 "students": ["Pass the coin around the circle.", "Whose hands held it before you?"]},
      "body": ["Pass a coin from your pocket around the circle. *“Before this coin came to me, whose hands held it? A shopkeeper? A bus driver? Someone’s grandma?”* Let children guess. Then: *“Some coins are very, very old. Today we will meet people who held coins two thousand years ago, in the land where Jesus lived.”*"]}),
    ("section", {"label": "Story time · 10 minutes", "title": "Four people, four coins",
      "screen": [{"phase": "Story time", "minutes": 2, "script": [0], "title": "Four people, four coins", "show": "people",
                  "people": [screen_person(k) for k in ORDER],
                  "purpose": "Meet all four people, and guess before hearing each story.",
                  "students": ["Who do you think this is?", "What is in their hands?"]}]
                + [person_step(k) for k in ORDER],
      "body": ["Show page 3. Point to each person and ask *“Who do you think this is? What is in their hands?”* Then read their story from the card beneath."]}),
    ("section", {"label": "Activity · 12 minutes", "title": "Find the hands",
      "screen": [
        {"phase": "Activity", "minutes": 6, "script": [0], "title": "Find the hands", "show": "coins", "coins": CLUE_COINS,
         "purpose": "Match each coin to its person by moving, then step into the story.",
         "students": ["Listen to the clue.", "Walk to the person who held that coin.", "Speak as them: *“I am the widow…”*"]},
        {"phase": "Activity", "minutes": 6, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Match the coins on paper, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three match the same four coins to the same four people."]}],
      "body": ["Put a sign in each corner. Show one coin at a time from page 3 and say its clue (*“the smallest coin of all”*). Children walk to the person who held it. In each corner, invite one or two children to step into the story and speak as that person: *“I am the widow. I am giving my two little coins to God.”*",
               "Then children choose a handout. All three levels match the same four coins to the same four people."]}),
    ("levels", {
      "green": "Draw a line from each coin to the person who held it, using picture clues. Circle how many coins the widow gave, and draw a gift you could give to God.",
      "yellow": "Write the right letter under each coin. Finish four short sentences from a word bank, then say which person you would like to meet, and why.",
      "red": "Match the coins, then choose one person and write two or three sentences as if you were them. Invent the journey of a coin from hand to hand."}),
    ("section", {"label": "Look back and pray · 4 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Closing prayer", "show": "prayer", "prayer": PRAYER,
         "purpose": "Give the lesson back to God with open hands.",
         "students": ["Hold out your open hands, and pray a line at a time."]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* For each one, children show a thumb up, sideways or down. Ask one child to answer each aloud; for the last, ask a Red Level child to speak as their person.",
               f"Ask the children to hold out their open hands. Pray together, a line at a time: *“{PRAYER}”*"]}),
    ("cols", [[("connection", ["**Visit the exhibition:** the Widow’s Mite, the Shekel of Tyre and Herod’s coin are all in the cases. Play **Hands of History** together: look at the hands and guess whose they are.",
                               "**Virtual visit:** the game, the coins and their stories are all online."])],
              [("section", {"label": "Questions for story time", "list": [
      "Look at each person’s hands. What are they doing — giving, counting, holding, working?",
      "Which coin is the smallest? Why do you think the widow’s tiny gift was the biggest to Jesus?",
      "Herod’s coin has no face on it. Whose face is on our coins? Why did Herod leave the face off?",
      "If you could ask one of these people a question, what would you ask?"]})]]),
    ("section", {"label": "For the teacher", "title": "Telling the stories at this age",
      "body": [
        "**Bethlehem, gently.** The exhibition sets the mother’s story beside Herod’s order in Matthew 2:16. For six- to eight-year-olds, tell only Matthew 2:13–15: the angel’s warning and the Holy Family’s safe journey to Egypt. If a child already knows that Herod was cruel, it is enough to say that he was a bad king and that God kept Jesus safe.",
        "**The priest’s coin.** The Shekel of Tyre is also the coin that, almost certainly, paid Judas (Matthew 26:15). That story belongs to older grades; here the priest is simply at work in God’s house.",
        "**Real or copy?** The widow’s, the merchant’s and the mother’s coins are genuine. The shekel is a museum-quality replica, because original examples are exceptionally rare. Children like being told which is which.",
        "**The widow and the priest** both stand at the Temple treasury in the exhibition’s stories. Children may notice that the priest could have seen the widow give; let them imagine it, as long as they know it is imagining."]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Whose hands held this?", "body": ["Project or print this page for story time and the corner game. Each coin sits beside the person who held it."]}),
    people(ORDER, big=True),
    ("cards", [(name + (f" · {ref}" if ref else ""), story) for name, ref, story in (CARDS[k] for k in ORDER)]),
  ]}

# ── the handouts ─────────────────────────────────────────────────────────

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2 · Hands of History", "level": level, "young": True, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 1–2 · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

CONTEXT = ["Long ago, in the land where Jesus lived, people used coins every day. They bought bread with them, paid with them and gave them to God. Every coin in our museum was once in someone’s hands."]

COINS_ORDER = ["merchant", "widow", "priest", "mother"]     # left column
PEOPLE_ORDER = ["widow", "mother", "merchant", "priest"]     # right column

block_task_coin = (
  '<section class="task numbered"><span class="pnum">03</span><div><p class="label">Part 3</p>'
  '<h3>Make a coin</h3><p>The merchant’s coin shows the emperor’s face. King Herod’s coin has no face at all.</p>'
  '<p>Draw your own coin. Will you put a face on it, or a picture of something else?</p></div></section>'
  '<div class="coindraw"><div><span>My coin</span></div></div>')

GREEN = handout("green", "ITH_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Who held this coin?",
            "body": ["Read the clue beside each coin. Draw a line from the coin to the person who held it."]}),
  match(COINS_ORDER, PEOPLE_ORDER),
  ("task", {"label": "Part 2", "title": "The widow’s gift",
            "body": ["A poor widow gave her coins to God at the Temple. Jesus said she gave more than everyone. How many coins did she give? Circle the number."],
            "blocks": []}),
  ("html", '<div class="circle"><span>1</span><span>2</span><span>3</span><span>10</span></div>'),
  ("html", '<div class="cols mid">' + block_task_coin + '</div>'),
  ("task", {"label": "Part 4", "title": "My gift to God",
            "body": ["The widow gave everything she had. Draw a gift you could give to God. It can be a kind thing you do."],
            "blocks": [("draw", "My gift")]}),
  ("family", ["Look at a coin at home together. Whose face is on it? Who do you think held it before you?"]),
])

YELLOW = handout("yellow", "ITH_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Who held this coin?",
            "body": ["Look at each coin. Write the letter of the person who held it in the box."]}),
  match(COINS_ORDER, PEOPLE_ORDER, letters=True),
  ("task", {"label": "Part 2", "title": "Finish the sentences",
            "body": ["Use a word from the box to finish each sentence."]}),
  ("html", '<div class="bank"><span>two</span><span>face</span><span>Temple</span><span>Bethlehem</span></div>'
           '<div class="fill">'
           '<p>1. The widow gave <u>&nbsp;</u> tiny coins to God.</p>'
           '<p>2. King Herod’s coin has no <u>&nbsp;</u> on it.</p>'
           '<p>3. The priest took silver coins at the <u>&nbsp;</u>.</p>'
           '<p>4. The emperor’s census sent Mary and Joseph to <u>&nbsp;</u>.</p></div>'),
  ("task", {"label": "Part 3", "title": "Who would you like to meet?",
            "body": ["Which person would you most like to meet? Write why. Then draw them holding their coin."],
            "blocks": [("draw", "The person I would meet")], "lines": 2}),
  ("family", ["Tell your family the story of the widow’s two tiny coins. Then ask: *what could our family give to God this week?*"]),
])

RED = handout("red", "ITH_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Who held this coin?",
            "body": ["Write the letter of the person who held each coin in the box."]}),
  match(COINS_ORDER, PEOPLE_ORDER, clues=False, letters=True),
  ("task", {"label": "Part 2", "title": "Be one of the people",
            "body": ["Choose one person. Write two or three sentences as if you were them. What is in your hands? What will you do with your coin?"],
            }),
  ("html", '<div class="indent"><p class="iam"><b>I am</b> <u>&nbsp;</u></p>'
           '<div class="write"><i></i><i></i><i></i></div></div>'),
  ("task", {"label": "Part 3", "title": "The coin’s journey",
            "body": ["Pick a coin. Make up its journey from hand to hand, all the way to our museum."],
            }),
  ("html", ('<div class="indent steps">'
                        '<div class="st"><b>First</b><div class="write"><i></i><i></i></div></div>'
                        '<div class="st"><b>Next</b><div class="write"><i></i><i></i></div></div>'
                        '<div class="st"><b>At last</b><div class="write"><i></i><i></i></div></div></div>')),
  ("html", '<div class="cols mid small"><section class="task numbered"><span class="pnum">04</span><div><p class="label">Part 4</p>'
           '<h3>Draw your coin</h3><p>Draw the coin you chose. Is there a face on it, or no face at all?</p></div></section>'
           '<div class="coindraw"><div><span>My coin</span></div></div></div>'),
  ("family", ["Choose any coin at home and make up its journey together. Who has held it? Where has it been?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
