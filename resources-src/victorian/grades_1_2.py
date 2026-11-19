"""Grades 1–2 · "A Card to Send"
The first Christmas card and the Christmas Card Maker: why Henry Cole had a
card made, the symbols Victorian cards made famous, and a card of the
children's own. Facts follow poster 2 (app/exhibitions/victorian/victorian.ts)
and christmas-card/cardText.ts. The card fronts are the exhibition owner's
own illustrations, after the hand-colored cards of the 1840s–1870s; they
are not old cards, and the plan says so."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-1-2/"
TITLE = "A Card to Send"
SUB = "Grades 1–2 · Christmas Card Maker · The first Christmas card"

HERO = {"img": pic(CARDS["robin"]), "pos": "center 45%"}
SCREEN_HERO = screen_pic(CARDS["robin"], "center 45%")

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Why would someone put a robin on a Christmas card?"
MAIL_Q = "Henry Cole had too much Christmas mail. What could he do?"
GREETING = "A merry Christmas and a Happy New Year"
SHARE = "Hold up your card. Tell a partner who it is for, and why you chose your picture."

OBJECTIVES = objectives([
    ("tell how the first Christmas card came to be made, and who sent it",
     "tell the story of the first Christmas card?", False),
    ("find the symbols Victorian cards made famous: robins, holly and snowy scenes",
     "find a robin, holly and snow on a card?", False),
    ("design a card with a picture, a border and a greeting for someone you care about",
     "design your own card?", False),
    ("explain why one card, printed many times, saved Henry Cole time",
     "explain why a printed card saved time?", True)],
  "A card is a small picture with a big job: it tells someone far away that you are thinking of them. The Victorians sent the very first Christmas cards, and we still send them today.")

FRONTS = [{"img": CARDS[k], "caption": CARD_NAMES[k], "alt": CARD_ALTS[k], "aspect": 1000 / 1241}
          for k in ("robin", "wreath", "church", "feast")]

PLAN_CSS = """
body { line-height: 1.42; }
.row img { aspect-ratio: 1000 / 1241; }
.cards { grid-template-columns: repeat(3, 1fr); gap: 7pt; } .card { padding: 6pt 9pt 2pt; } .card p { font-size: 8.8pt; }
"""

ROW4 = ('<div class="row" style="--n:4">' + "".join(
    f'<figure><img src="{pic(CARDS[k])}" alt=""><figcaption><b>{CARD_NAMES[k]}</b></figcaption></figure>'
    for k in ("robin", "wreath", "church", "feast")) + "</div>")

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "a-card-to-send", "large": True,
  "out": DIR + "VIC_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 4, HOOK), ("Teach", 8, TEACH), ("Activity", 13, WORK), ("Close", 5, CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
      "The *Show your class* page (page 3), projected or printed",
      "The *Christmas Card Maker* on a screen, if you have one",
      "Crayons or colored pencils, and the differentiated handouts"]})],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will hear how Henry Cole, with too much Christmas mail to answer, had the first Christmas card made in 1843. They will find the symbols Victorian cards made famous — robins, holly and snowy scenes — and design a card of their own, with a picture, a border and a greeting, for someone they care about."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social Studies** — long ago and today; how a tradition begins",
      "**Art** — looking closely at a picture; symbols; designing a card front with a border",
      "**ELA** — retelling a true story in order; writing a greeting for a reader",
      "**Character** — thinking of others; the first card’s scenes of giving to people in need"]})]]),
    ("section", {"label": "Hook · 4 minutes", "title": "A robin in the snow",
      "screen": {"phase": "Hook", "show": "image", "img": screen_pic(CARDS["robin"]), "alt": CARD_ALTS["robin"],
                 "caption": "A card front in the Christmas Card Maker",
                 "purpose": "Look closely at a card front, and wonder about its picture, before any story.",
                 "students": ["What do you see?", HOOK_Q]},
      "body": ["Show the robin card front. Give the class a quiet minute to look. *“What do you see?”* A robin, a snowy branch, holly with red berries. Then: *“" + HOOK_Q + "”* Take ideas. *“Today you will find out who sent the very first Christmas card — and then you will make one.”*"]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "Too much mail",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Too much mail", "show": "question", "question": MAIL_Q,
         "purpose": "Hear the true story of the first Christmas card as a problem and its clever answer.",
         "students": ["What would you do with a pile of letters to answer?", "What did Henry Cole do?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Find the symbols", "show": "gallery",
         "groups": [{"label": "Card fronts in the Christmas Card Maker", "text": "Robins, holly and snowy scenes became the symbols of a Victorian Christmas.", "items": FRONTS}],
         "purpose": "Find the symbols Victorian cards made famous.",
         "students": ["Find a robin. Find holly. Find snow.", "Which card would you choose?"]}],
      "body": [
        "Tell the story. In 1843, a man named Henry Cole had so much Christmas mail piling up that he could not answer it all. He asked his friend, the artist John Callcott Horsley, to design a card he could send instead. The card showed three generations of the Cole family raising a toast, with scenes of giving to people in need around it, and the greeting *“" + GREETING + "”*. A thousand copies were printed. Ask: *“Why was one card, printed many times, a clever idea?”*",
        "Show the four card fronts from the *Christmas Card Maker*. Explain that they are new pictures, made for the exhibition in the style of Victorian cards. Victorian cards made robins, holly, snowy scenes and Father Christmas into the symbols of the season — one card even shows Father Christmas riding a bicycle! Let children come up and point to each symbol."]}),
    ("section", {"label": "Activity · 13 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Find the symbols, retell the story and design a card, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Every level ends with a card of your own."]},
      "body": ["Students choose a handout. All three find the symbols, tell Henry Cole’s story and end with a card of their own."]}),
    ("levels", {
      "green": "Circle the robin, the holly and the snowy church; finish Henry Cole’s story from a word bank; draw a card front; copy the first card’s greeting.",
      "yellow": "Name the symbol on each card; explain in a sentence why Henry Cole had a card made; design a front and write the inside, with *To* and *From*.",
      "red": "Choose a card to send and say why; explain why a printed card saved time; design a card that helps someone feel cared for."}),
    ("section", {"label": "Share and look back · 5 minutes",
      "screen": [
        {"phase": "Close", "minutes": 3, "script": [0], "title": "Share your card", "show": "question", "question": SHARE,
         "purpose": "Say who a card is for, as the first card’s greeting did.",
         "students": ["Who is your card for?", "Why did you choose your picture?"]},
        review_step(OBJECTIVES, 2, [1], hint=THUMBS)],
      "body": ["Students hold up their cards. Partners tell each other: *who is it for, and why that picture?* Ask two or three to share with the class.",
               "Then ask the objectives back from the screen: *“Can you now…?”* Students show a thumb up, sideways or down. For the last, ask a Red Level student to explain."]}),
    ("cols", [[("section", {"label": "For the teacher", "title": "The first Christmas card",
      "body": [
        "**Who sent it.** Henry Cole was the first director of the V&A, the Victoria and Albert Museum. His card, a hand-colored lithograph, carried the greeting *“" + GREETING + "”*, with spaces for the names of the sender and the person receiving it.",
        "**A flop, then a treasure.** Cole printed 1,000 cards and sold the spares for a shilling each, which was so expensive that the venture was judged a flop. When one of his cards was auctioned in 2013, it sold for £22,000. Today, around a billion Christmas cards are bought in the UK every year.",
        "**Every family.** The exhibition is about Christmas, the Victorians’ new card tradition. Children whose families do not celebrate Christmas can make a card for a day their own family celebrates, or simply for someone they care about."]})],
    [("section", {"label": "Assessment notes", "list": [
      "Can the student retell Henry Cole’s story in order: too much mail, an artist friend, one card for many people?",
      "Can the student find a robin, holly and a snowy scene?",
      "Does the student’s card have a picture, a border and a greeting?",
      "**Exit question:** *why did Henry Cole have a card made?*"]}),
     ("connection", ["**Visit the exhibition:** in the *Christmas Card Maker*, children choose a picture, a border and a paper, write their greeting inside, then print and fold their card. The first card’s greeting is one of the choices.",
                     "**In Dickens’ Christmas Parlour,** find the Christmas cards standing along the mantelpiece."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four card fronts, and the first card",
                 "body": ["The four fronts in the *Christmas Card Maker* are new pictures, made for the exhibition in the style of the hand-colored cards of the 1840s to 1870s. Use them for the hook and the symbol hunt."]}),
    ("html", ROW4),
    ("cards", [
      ("Who sent it", ["Henry Cole, in 1843. He had too much Christmas mail to answer."]),
      ("Who drew it", ["His friend, the artist John Callcott Horsley."]),
      ("What it showed", ["Three generations of the Cole family raising a toast, with scenes of giving to people in need."]),
      ("What it said", ["“" + GREETING + "”"]),
      ("How many", ["1,000 were printed. Spares sold for a shilling each: too expensive, so it was judged a flop."]),
      ("What it is worth now", ["In 2013, one of Cole’s cards sold at auction for £22,000."])]),
    ("section", {"label": "Questions for the symbol hunt", "list": [
      "Which symbols can you find on these cards?",
      "Why do you think robins, holly and snow became Christmas symbols?",
      "Henry Cole’s card showed people giving to others. Why might he choose that?",
      "Who would you send a card to, and what would you put on it?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In 1843, Henry Cole had so much Christmas mail that he could not answer it all. So he asked his friend, an artist, to make one card he could send to everyone. It was the very first Christmas card!"]

YOUNG_CSS = """
.row { grid-template-columns: repeat(4, 94pt); justify-content: center; gap: 16pt; }
.row img { aspect-ratio: 1000 / 1241; height: auto; }
.names { grid-template-columns: repeat(4, 94pt); justify-content: center; gap: 16pt; }
.cardbox { position: relative; border: 2pt solid #1d1c1a; border-radius: 6pt; height: 290pt; width: 234pt; margin: 6pt auto 8pt;
  background: rgba(255,255,255,.6); box-shadow: inset 0 0 0 9pt rgba(255,255,255,.6), inset 0 0 0 10.5pt #1d1c1a; }
.cardbox span { position: absolute; left: 0; right: 0; bottom: 14pt; text-align: center; font: 500 7.5pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #5b5a55; }
.duo2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; }
.duo2 .cardbox { width: 100%; height: 270pt; margin: 4pt 0; }
.fillin p { margin: 0 0 12pt; }
.fillin .blank { min-width: 100pt; }
.names { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9pt; margin: -2pt 0 8pt; }
.names i { display: block; border-bottom: 1pt solid #1d1c1a; height: 26pt; }
"""

handout = handout_maker(DIR, TITLE, "Grades 1–2 · Christmas Card Maker", "Grades 1–2", CONTEXT, HERO, YOUNG_CSS, young=True)

ROW4_PLAIN = ROW4.replace("<b>Robin</b>", "<b>1</b>").replace("<b>Holly wreath</b>", "<b>2</b>").replace(
    "<b>Snowy church</b>", "<b>3</b>").replace("<b>Christmas feast</b>", "<b>4</b>")
CARDFRONT = '<div class="cardbox"><span>The front of my card</span></div>'

GREEN = handout("green", "VIC_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Find the symbols. Circle the robin. Put a box around the holly. Put a star on the snowy church.",
            "blocks": [("html", ROW4_PLAIN)]}),
  ("task", {"label": "Part 2", "title": "Finish Henry Cole’s story. Use the words in the bank.",
            "blocks": [("html", '<div class="bank"><span>mail</span><span>card</span><span>friend</span></div>'
                        '<div class="fillin"><p>Henry Cole had too much Christmas <span class="blank"></span>.</p>'
                        '<p>He asked his <span class="blank"></span>, an artist, to help.</p>'
                        '<p>They made one <span class="blank"></span> to send to everyone.</p></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Draw a picture for the front of your card.", "blocks": [("html", CARDFRONT)]}),
  ("task", {"label": "Part 4", "title": "Copy the greeting from the first card.",
            "blocks": [("html", '<div class="trace"><div><span class="lead">A merry Christmas</span></div><div></div></div>')]}),
  ("family", ["Ask your child to tell you Henry Cole’s story. Then make a card together for someone you care about, for Christmas or for any day your family celebrates."]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "What is on each card? Write a word from the bank under each one.",
            "blocks": [("html", '<div class="bank"><span>robin</span><span>holly</span><span>snow</span><span>family</span></div>'
                        + ROW4_PLAIN + '<div class="names"><i></i><i></i><i></i><i></i></div>')]}),
  ("task", {"label": "Part 2", "title": "Why did Henry Cole have a card made?", "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Make your card. Draw the front, then write the inside.",
            "blocks": [("html", '<div class="duo2"><div class="cardbox"><span>The front</span></div>'
                        '<div class="cardbox" style="padding:16pt 18pt 0;font:400 13pt Outfit">To<i style="display:block;border-bottom:1pt solid #1d1c1a;height:26pt;margin-bottom:24pt"></i>'
                        '<i style="display:block;border-bottom:1pt solid #1d1c1a;height:26pt"></i><i style="display:block;border-bottom:1pt solid #1d1c1a;height:26pt;margin-bottom:12pt"></i>'
                        'From<i style="display:block;border-bottom:1pt solid #1d1c1a;height:22pt"></i><span>The inside</span></div></div>')]}),
  ("task", {"label": "Part 4", "title": "Which symbol did you choose? Why?", "lines": 2}),
  ("family", ["Look at the cards your family gets this year, or at any greeting card. Which symbols can your child find? Robins, holly and snow were made famous by Victorian cards."]),
])

RED = handout("red", "VIC_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Which card would you send? Circle it, then tell why.",
            "blocks": [("html", ROW4_PLAIN)], "lines": 2}),
  ("task", {"label": "Part 2", "title": "Henry Cole’s card was printed 1,000 times. Why was that quicker than writing 1,000 letters?", "lines": 2}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "The first card showed people giving to others in need. Design a card that helps someone feel cared for.",
            "blocks": [("html", '<div class="duo2"><div class="cardbox"><span>The front</span></div><div class="cardbox"><span>The inside</span></div></div>')]}),
  ("task", {"label": "Part 4", "title": "Who is your card for? How will they feel when it comes?", "lines": 2}),
  ("family", ["Henry Cole’s card sold for a shilling in 1843. In 2013, one sold for £22,000! Ask your child: *why might an old card become so precious?*"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
