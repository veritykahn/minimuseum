"""Grades 3–4 · "Remember a Soldier"
Reading the Memorial's cards: four real records of the American Battle
Monuments Commission, as "Remember a soldier" draws them (a named grave, an
Army nurse, a name on the Tablets of the Missing and an unknown soldier),
and how November 11 became Armistice Day and then Veterans Day. No
battlefield detail. The cards are copied from the pool the Memorial draws
from (public/exhibitions/great-war/memorial/fallen.json), laid out as
memorial/MemorialCard.tsx lays them out; the days and the Tomb of the
Unknown Soldier follow poster 2 in app/exhibitions/great-war/greatWar.ts."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-3-4/"
TITLE = "Remember a Soldier"
SUB = "Grades 3–4 · The Memorial · Reading a memorial card"
HERO = {"img": SILHOUETTE, "pos": "center 45%"}

FROM_ABMC = "From the records of the American Battle Monuments Commission"
EPITAPH = "Here rests in honored glory an American soldier known but to God"

# four records from the Memorial's pool, each as its card prints it
CARDS = {
  "kehrli": {"name": "Adolph Kehrli", "rank": "Private", "unit": "148th Infantry Regiment, 37th Division",
             "from": "From New York", "death": "Died October 31, 1918",
             "lead": "Rests in", "place": "Flanders Field American Cemetery", "plot": "Plot C · Row 3 · Grave 15"},
  "ireland": {"name": "Alice A. Ireland", "rank": "Nurse", "unit": "34th Base Hospital, 34th Army Nurse Corps",
              "from": "From Pennsylvania", "death": "Died February 3, 1918",
              "lead": "Rests in", "place": "Oise-Aisne American Cemetery", "plot": "Plot A · Row 30 · Grave 23"},
  "klement": {"name": "Adolf F. Klement", "rank": "Private", "unit": "126th Field Artillery Regiment, 34th Division",
              "from": "From Texas", "death": "Missing in Action · October 6, 1918",
              "lead": "Named on the Tablets of the Missing", "place": "Suresnes American Cemetery", "plot": None},
  "unknown": {"name": "An Unknown Soldier", "epitaph": EPITAPH,
              "lead": "Rests in", "place": "Flanders Field American Cemetery", "plot": "Plot A · Row 4 · Grave 5"},
}

def card(k, small=False):
    c = CARDS[k]
    lines = ""
    if c.get("epitaph"):
        lines += f'<p class="mc-ep">{c["epitaph"]}</p>'
    else:
        lines += f'<p class="mc-sv">{c["rank"]}<br>{c["unit"]}</p><p>{c["from"]}</p><p>{c["death"]}</p>'
    rest = f'<p class="mc-rest"><span>{c["lead"]}</span><br>{c["place"]}' + (f'<br>{c["plot"]}' if c.get("plot") else "") + "</p>"
    return (f'<div class="mc{" sm" if small else ""}"><p class="mc-in">In Memory</p><h4>{c["name"]}</h4>{lines}{rest}'
            f'<p class="mc-foot">{FROM_ABMC}</p></div>')

CARD_CSS = """
.mc { background: #fbf8f0; border: 1pt solid #1d1c1a; border-top: 4pt solid #E8372C; border-radius: 4pt; padding: 8pt 12pt 6pt; text-align: center; break-inside: avoid; }
.mc p { margin: 0 0 3pt; font-size: 9pt; line-height: 1.35; }
.mc .mc-in { font: 500 7pt 'Outfit'; letter-spacing: .3em; text-transform: uppercase; color: #CC3027; margin-bottom: 2pt; }
.mc h4 { font: 600 16pt/1.1 'Cormorant Garamond', serif; margin: 0 0 4pt; }
.mc .mc-sv { color: #3f3e3a; }
.mc .mc-ep { font: italic 400 12pt/1.3 'Cormorant Garamond', serif; margin: 2pt 6pt 5pt; }
.mc .mc-rest { border-top: .6pt solid #c8c5bb; padding-top: 4pt; margin-top: 4pt; }
.mc .mc-rest span { font: 500 6.8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #5F6655; }
.mc .mc-foot { font: 400 6.5pt 'Outfit'; letter-spacing: .08em; color: #5F6655; margin: 4pt 0 0; }
.mc.sm h4 { font-size: 14pt; } .mc.sm p { font-size: 8.4pt; }
.cards2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 4pt 0 10pt; }
.cards3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 8pt; }
.onecard { display: grid; grid-template-columns: 210pt 1fr; gap: 14pt; align-items: start; margin: 4pt 0 6pt; }
.order { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 8pt; break-inside: avoid; }
.order div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); padding: 6pt 8pt; font-size: 9.6pt; }
.order b { display: block; width: 22pt; height: 22pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: #fff; margin-bottom: 4pt; }
table.fill td:first-child { width: 30%; font-weight: 500; }
"""

HOOK_Q = "What can you learn about this person from one small card?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read a memorial card: who the person was, where they came from, when they died and where they rest",
     "read a memorial card?", False),
    ("explain what *known but to God* and the *Tablets of the Missing* tell us",
     "explain an unknown soldier’s card, and a name on the Tablets of the Missing?", False),
    ("tell how November 11 became Armistice Day, and then Veterans Day",
     "tell how Armistice Day became Veterans Day?", False),
    ("explain why we remember people whose names we will never know",
     "explain why we remember people whose names we will never know?", True)],
  "why": "Every card is one real person. Reading it slowly, and keeping a silence, is how a whole country keeps a promise: you will not be forgotten."}

# ── on the classroom screen ────────────────────────────────────────────
def card_text(k):
    c = CARDS[k]
    mid = c["epitaph"] if c.get("epitaph") else f'{c["rank"]} · {c["unit"]}\n{c["from"]}\n{c["death"]}'
    return f'In Memory\n{c["name"]}\n{mid}\n{c["lead"]}: {c["place"]}'

FOUR = {"caption": "Four cards from The Memorial, from the records of the American Battle Monuments Commission",
        "columns": ["Name", "Served as", "From", "On the card", "Where remembered"],
        "rows": [{"cells": ["Adolph Kehrli", "Private, Army", "New York", "Died October 31, 1918", "Flanders Field American Cemetery"]},
                 {"cells": ["Alice A. Ireland", "Nurse, Army Nurse Corps", "Pennsylvania", "Died February 3, 1918", "Oise-Aisne American Cemetery"]},
                 {"cells": ["Adolf F. Klement", "Private, Field Artillery", "Texas", "Missing in Action, October 6, 1918", "Tablets of the Missing, Suresnes"]},
                 {"cells": ["An Unknown Soldier", "—", "—", "Known but to God", "Flanders Field American Cemetery"]}]}

DAYS = [("1918", "At 11:00 AM on November 11, the armistice, the peace agreement, takes effect. The guns stop."),
        ("1919", "President Woodrow Wilson proclaims November 11 *Armistice Day*. At 11:00 AM, Americans pause for two minutes to honor the fallen."),
        ("1954", "Congress changes the name to *Veterans Day*, to honor all American veterans, not just those from World War I."),
        ("Today", "Canada, Britain and France still call it *Remembrance Day*, and keep two minutes’ silence at the eleventh hour.")]
DAYS_SCREEN = {"caption": "From Armistice Day to Veterans Day, as the When the Guns Fell Silent poster tells it",
               "columns": ["When", "What happened"],
               "rows": [{"cells": [y, t.replace("*", "")]} for y, t in DAYS]}

SILENCE_P = ("Open *The Memorial* and choose *The silence at 11:00*. Say: *“Every year at 11 o’clock on November 11, people stop for two minutes to remember. "
             "Let’s keep the silence now, for Adolph, for Alice, for Adolf, and for the soldier known but to God.”* Press *Keep two minutes’ silence now*. "
             "Afterward, ask one student to read the poster’s promise: *“You will not be forgotten.”*")

LESSON = {
  "slug": "remember-a-soldier", "large": True,
  "out": DIR + "GW_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO,
  "css": CARD_CSS + OBJ_CSS + "body { line-height: 1.44; } .cols + .section, .cols + section { margin-top: 10pt; } table.fill td:first-child { width: 16%; }",
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 10, C_TEACH), ("Activity", 20, C_ACT), ("Close", 5, C_CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words to know"}),
               ("refs", [("Armistice", "the agreement that stopped the fighting"),
                         ("Veteran", "someone who has served in the armed forces"),
                         ("Memorial", "something made to help people remember"),
                         ("Missing in Action", "lost in the war, with no known grave")])],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read memorial cards from *The Memorial*, each drawn from a real record of the American Battle Monuments Commission, and learn what a card can tell: a name, a rank, a state, a date and a resting place. They will meet a soldier, an Army nurse, a name on the Tablets of the Missing and a soldier *known but to God*, and learn how November 11 became Armistice Day and then Veterans Day."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Social Studies** — primary sources (a record); chronology; national holidays and why we keep them",
      "**Civics** — Veterans Day and Remembrance Day; honoring those who served",
      "**ELA** — reading for detail; inference from a short text",
      "**Social and emotional** — respect, gratitude and quiet reflection"]}),
               ("section", {"label": "Materials needed", "list": [
      "The four cards on page 3, projected or printed",
      "*The Memorial* open on a screen, for the silence",
      "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "One small card",
      "screen": {"phase": "Hook", "show": "words", "text": card_text("kehrli"), "cite": "The Memorial · Remember a soldier",
                 "purpose": "Meet one real person through a card, before any explanation.",
                 "students": [HOOK_Q, "What questions do you have?"]},
      "body": [f"Show Adolph Kehrli’s card on page 3. Read it aloud slowly. *“{HOOK_Q}”* Take answers: his name, that he was a private, that he came from New York, the date. Then: *“What does the card not tell us?”* (His age, his family, what he was like.) *“At the Mini Museum, visitors took a card like this home, for one American who died in the Great War. Today we read them carefully.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "What a card can tell",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Four cards", "show": "chart", **FOUR,
         "purpose": "Compare four cards: who served, and the different ways they are remembered.",
         "students": ["Who on these cards was not a soldier?", "Which card has no name? Which has no grave?"]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "Known but to God", "show": "words",
         "text": "Here rests in honored glory\nan American soldier\nknown but to God", "cite": "The Memorial’s card for an unknown soldier",
         "purpose": "Understand the soldiers whose names we will never know.",
         "students": ["What does this card not have?", "Why might a soldier have no name on his grave?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "From Armistice Day to Veterans Day", "show": "chart", **DAYS_SCREEN,
         "purpose": "Follow November 11 from the end of the war to today.",
         "students": ["What happened at 11:00 on November 11, 1918?", "Why was the name changed in 1954?"]}],
      "body": [
        "**Four cards.** Show all four. Every card comes from the records of the American Battle Monuments Commission, which keeps the records of Americans who rest in its cemeteries overseas or are named on its Tablets of the Missing. Point out that Alice A. Ireland was a **nurse**: not everyone who served was a soldier. Adolf F. Klement, from Texas, was *Missing in Action*: he has no known grave, so his name is carved on the Tablets of the Missing.",
        "**Known but to God.** The fourth card has no name at all. Read its words. Some soldiers could never be identified. Their graves say they are *known but to God*. At Arlington National Cemetery, the Tomb of the Unknown Soldier honors all those whose names we’ll never know; on Veterans Day, by tradition, the President places a wreath there.",
        "**November 11.** Walk through the chart: the guns stopped at 11:00 AM on November 11, 1918. In 1919 President Woodrow Wilson proclaimed it *Armistice Day*, and Americans paused for two minutes at 11:00. In 1954 Congress renamed it *Veterans Day*, to honor all American veterans. Canada, Britain and France still call it *Remembrance Day*."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read real cards closely, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read cards from The Memorial and follow November 11 to Veterans Day."]},
      "body": ["Students choose a handout. All three levels read the Memorial’s cards and put the story of November 11 in order."]}),
    ("levels", {
      "green": "Read one card and fill in its facts. Find what the unknown soldier’s card does and does not say. Number the story of November 11 in order and finish a sentence.",
      "yellow": "Compare three cards: a soldier, a nurse and a name on the Tablets of the Missing. Explain what *Missing in Action* means for a grave. Explain why Armistice Day became Veterans Day.",
      "red": "Read the unknown soldier’s card beside the Tomb of the Unknown Soldier. Sort what a card can and cannot tell. Compare Veterans Day and Remembrance Day, then write an inscription."}),
    ("section", {"label": "Look back and the silence · 5 minutes",
      "screen": [
        review(OBJECTIVES, 2, [0], hint=THUMBS, phase="Close"),
        {"phase": "Close", "minutes": 3, "script": [1], "title": "The silence", "show": "words",
         "text": "You will not be forgotten.", "cite": "When the Guns Fell Silent at the 11th Hour",
         "purpose": "Keep the two minutes’ silence together, as people do on November 11.",
         "students": ["Sit still. Two minutes’ silence.", "Think of the four people on the cards."]}],
      "body": ["Ask the objectives back from the screen: *“Can you now…?”* Students show a thumb up, sideways or down. For the last, ask a Red Level student to read their inscription.",
               SILENCE_P]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Green:** Adolph Kehrli · Private · New York · October 31, 1918 · Flanders Field American Cemetery. The unknown soldier’s card does not say his name, his state or his date; it does say where he rests. Order: 1918, 1919, 1954.",
        "**Yellow:** Alice A. Ireland was a nurse, not a soldier. *Missing in Action* and *the Tablets of the Missing*: his grave is not known, so his name is carved there instead. Veterans Day honors all American veterans, not only those of World War I.",
        "**Red:** answers will vary; look for *those whose names we’ll never know* and a reason of their own."]})],
      [("section", {"label": "For the teacher", "body": [
        "Keep the focus on the people and on remembering, not on how they died. The cards give only what the record gives; some students will want to know more about a person, and that curiosity is the point."]}),
       ("connection", ["**Online,** *The Memorial*’s *Remember a soldier* draws a card for one of the fallen; search by name or by your own state, and print a card to keep. **In the exhibition,** take a soldier card from the display, and find the poppies and the date in red on the *When the Guns Fell Silent* poster."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Four cards from The Memorial",
      "body": ["Project or print this page for the hook and the lesson. Each card is a real record of the American Battle Monuments Commission, as *Remember a soldier* draws it."]}),
    ("html", '<div class="cards2">' + "".join(card(k) for k in ["kehrli", "ireland", "klement", "unknown"]) + "</div>"),
    ("section", {"label": "Questions to ask in front of the cards", "list": [
      "What is the same on every card? What is different?",
      "Who here was not a soldier? What else could someone do to serve?",
      "Why is one name on the Tablets of the Missing, not on a grave?",
      "Why do we remember people we never knew?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["At the Mini Museum, visitors take home a card for one American who died in the Great War. Each card comes from a real record, kept by the American Battle Monuments Commission. Today you read the cards closely, and find out why November 11 matters."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · The Memorial", "level": level, "context": CONTEXT, "css": CARD_CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

def order(items):
    return '<div class="order">' + "".join(f"<div><b></b>{t}</div>" for t in items) + "</div>"

GREEN = handout("green", "GW_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Read the card",
            "blocks": [("html", '<div class="onecard">' + card("kehrli", True) + '<div>'
                + '<table class="fill"><thead><tr><th>On the card</th><th>Write it here</th></tr></thead><tbody>'
                + "".join(f"<tr><td>{q}</td><td></td></tr>" for q in ["Name", "Rank", "From which state?", "When did he die?", "Where does he rest?"])
                + '</tbody></table></div></div>')]}),
  ("task", {"label": "Part 2", "title": "A card with no name",
            "blocks": [("html", '<div class="onecard">' + card("unknown", True)
                + '<div><p>Read this card. Circle <b>yes</b> or <b>no</b>.</p>'
                + "".join(f'<p style="margin:0 0 9pt">Does it tell his {t}? &nbsp; <b>yes</b> &nbsp; / &nbsp; <b>no</b></p>' for t in ["name", "state", "date", "resting place"])
                + '<p><i>Known but to God</i> means nobody knows his name, but he is still remembered.</p></div></div>')]}),
  ("task", {"label": "Part 3", "title": "Put November 11 in order",
            "blocks": [("html", "<p>Write <b>1, 2, 3</b> in the boxes, from first to last.</p>" + order([
                "The name changes to <strong>Veterans Day</strong>, to honor all American veterans. (1954)",
                "At 11:00 AM on November 11, the guns stop. The war is over. (1918)",
                "President Wilson names it <i>Armistice Day</i>. Americans pause for two minutes. (1919)"]))]}),
  ("task", {"label": "Part 4", "title": "Why do we keep a quiet time?",
            "body": ["Finish the sentence: **On November 11, people are quiet for two minutes because…**"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "A thank-you",
            "body": ["Who would you like to thank on Veterans Day? Write one sentence to them."], "lines": 3}),
  ("family", ["Look at *Remember a soldier* in the Mini Museum’s Memorial together. Search for your own state, and read one card aloud."]),
])

YELLOW = handout("yellow", "GW_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Three cards, three stories",
            "blocks": [("html", '<div class="cards3">' + "".join(card(k, True) for k in ["kehrli", "ireland", "klement"]) + "</div>")]}),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["What is the same on all three cards?", ""], ["Which person was not a soldier? What did she do?", ""],
      ["Which person came from Texas?", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Named on the Tablets of the Missing",
            "body": ["Adolf F. Klement’s card says **Missing in Action**, and *Named on the Tablets of the Missing*. The other two cards say *Rests in*, with a plot, a row and a grave. Why do you think his name is written on the Tablets, and not on a grave?"], "lines": 5}),
  ("task", {"label": "Part 3", "title": "From Armistice Day to Veterans Day",
            "body": ["In 1919 President Woodrow Wilson proclaimed November 11 *Armistice Day*. In 1954 Congress changed the name to *Veterans Day*. Why do you think the name was changed? Who does Veterans Day honor?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Your turn",
            "body": ["If you could ask one of these three people a question, who would you ask, and what would you ask?"], "lines": 3}),
  ("family", ["Ask your family: do we know anyone who has served? Tell them about the three cards, and about Alice A. Ireland, the Army nurse."]),
], "table.fill tbody td { height: 40pt; }")

RED = handout("red", "GW_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Known but to God",
            "blocks": [("html", '<div class="onecard">' + card("unknown", True)
                + "<div><p>The When the Guns Fell Silent poster says that at Arlington National Cemetery, a wreath is placed at the Tomb of the Unknown Soldier on Veterans Day, by tradition by the President, <i>“honoring all those whose names we’ll never know but whose sacrifice we’ll never forget.”</i></p>"
                + "<p>Why do you think a country honors a soldier whose name nobody knows?</p></div></div>")], "lines": 2}),
  ("task", {"label": "Part 2", "title": "What a card can tell, and what it can’t",
            "body": ["Look at the cards on your teacher’s screen. List three things a card tells you, and three things you would like to know that it cannot tell."]}),
  ("table", {"head": ["A card tells…", "A card cannot tell…"], "rows": [["", ""], ["", ""], ["", ""]]}),
  ("task", {"label": "Part 3", "title": "Two names for one day",
            "body": ["In America, November 11 is **Veterans Day**, honoring all American veterans. Canada, Britain and France call it **Remembrance Day**, and keep two minutes’ silence at the eleventh hour. How are the two days alike? How are they different?"], "lines": 6}),
  ("task", {"label": "Part 4", "title": "Write an inscription",
            "body": ["A memorial often carries a few words carved in stone, like *known but to God*. Write an inscription of two or three lines for a memorial to everyone who has served. Choose every word carefully."], "lines": 7}),
  ("family", ["Read your inscription to your family. Then look together at the Tomb of the Unknown Soldier, and talk about why it matters to remember people whose names we’ll never know."]),
], "table.fill tbody td { height: 22pt; } table.fill td:first-child { width: 50%; font-weight: 300; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
