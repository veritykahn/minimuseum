"""Grades 3–4 · "Milestones"
Reading the Black Barbie Timeline: putting its stops in order, what made
the first Black Barbie (1980) new, and telling the poster's words from a
museum note. Facts follow app/exhibitions/black-history/blackHistory.ts
(poster 2, word for word) and timeline/timelineStops.ts (the stops, their
guess-the-year choices and the three owner-approved museum notes).

No dolls or packaging are pictured: the timeline itself draws none, and
poster 2's photograph is never cropped or printed. The elapsed years the
Red level asks for are the students' own subtraction from the stops' years."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-3-4/"
TITLE = "Milestones"
SUB = "Grades 3–4 · The Black Barbie Timeline"
HERO = HERO_RING

# Said in the plan and shown on the classroom screen, so written once.
GUESS_Q = "Mattel made the first Black Barbie. When was it?"
GUESS_CHOICES = ["1971", "1976", "1980", "1989"]          # the timeline's own choices for 1980
SOURCE_Q = "The poster’s words, or a museum note: why does a museum say where a fact comes from?"
NOTE_LINE = "A museum note, not the poster’s words"           # the timeline's own label

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read a timeline, and put its stops in order by year",
     "read a timeline and put its stops in order?", False),
    ("say what made the first Black Barbie new in 1980, and who designed it",
     "say what made the first Black Barbie new, and who designed it?", False),
    ("tell the poster’s words from a museum note, and say why a museum names its sources",
     "tell the poster’s words from a museum note?", False),
    ("explain how one doll on the timeline built on the dolls before it",
     "explain how one doll built on the dolls before it?", True)],
  "why": "A timeline shows how things change, and who changed them. This one shows toys changing to reflect more of the children who play with them, and a Black designer at the center of that change.",
  "screen": {"heading": "I can…", "items": [
    "read a timeline and put its stops in order",
    "say what made the first Black Barbie new, and who designed it",
    "tell the poster’s words from a museum note",
    "explain how one doll built on the dolls before it"]}}

# the eight stops, for the screen's chart and the plan's page 3
STOP_ROWS = [[y, n, w, s] for y, n, w, s in TIMELINE]

CSS = """
.road { position: relative; display: grid; grid-template-columns: repeat(8, 1fr); gap: 4pt; margin: 6pt 0 10pt; break-inside: avoid; }
.road::before { content: ""; position: absolute; left: 4%; right: 4%; top: 25pt; border-top: 2pt solid #1d1c1a; }
.road div { position: relative; text-align: center; }
.road b { display: block; font: 600 13pt/1 'Cormorant Garamond', serif; height: 16pt; }
.road i { display: block; width: 13pt; height: 13pt; border-radius: 50%; background: var(--accent); border: 1.4pt solid #1d1c1a; margin: 3pt auto 5pt; }
.road span { display: block; font: 400 7.6pt/1.25 'Outfit'; }
.match { display: grid; grid-template-columns: 1fr 60pt 1.7fr; gap: 5pt 0; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.match p { margin: 0; border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 4pt 8pt; background: rgba(255,255,255,.65); font-size: 9.2pt; line-height: 1.3; }
.match p.l { font-weight: 500; position: relative; }
.match p.l::after, .match p.r::before { content: ""; position: absolute; width: 6pt; height: 6pt; border-radius: 50%; background: #1d1c1a; top: 50%; margin-top: -3pt; }
.match p.l::after { right: -3pt; }
.match p.r { position: relative; }
.match p.r::before { left: -3pt; }
.bank { display: flex; flex-wrap: wrap; gap: 7pt; margin: 4pt 0 8pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 11pt; font: 400 10pt 'Outfit'; background: rgba(255,255,255,.65); }
.cardset { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7pt; margin: 4pt 0 8pt; break-inside: avoid; }
.cardset div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); padding: 6pt 7pt 7pt; min-height: 50pt; }
.cardset .obox { float: right; width: 20pt; height: 20pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: #fff; margin: 0 0 3pt 4pt; }
.cardset b { display: block; font: 600 12pt/1.1 'Cormorant Garamond', serif; }
.cardset span { display: block; font: 400 8.6pt/1.3 'Outfit'; margin-top: 2pt; }
.facts { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); padding: 7pt 10pt 4pt; margin: 4pt 0 8pt; font-size: 9.2pt; line-height: 1.38; break-inside: avoid; }
.facts .label { margin-bottom: 2pt; }
.facts p { margin: 0 0 5pt; }
.facts .note { border-top: .8pt dashed #1d1c1a; padding-top: 5pt; }
.sum { font-size: 10.5pt; margin: 2pt 0 7pt; }
.sum u { display: inline-block; min-width: 46pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.sorter { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7pt; margin: 4pt 0 8pt; break-inside: avoid; }
.sorter div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); padding: 6pt 7pt; }
.sorter b { display: block; font: 500 9.4pt/1.25 'Outfit'; min-height: 24pt; margin-bottom: 4pt; }
.sorter span { display: flex; align-items: center; gap: 5pt; font: 400 8.6pt 'Outfit'; margin-top: 3pt; }
.sorter i { width: 10pt; height: 10pt; border: 1pt solid #1d1c1a; background: #fff; display: inline-block; }
.cut { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin: 4pt 0 6pt; break-inside: avoid; }
.cut div { border: 1pt dashed #5b5a55; padding: 9pt 6pt; text-align: center; min-height: 52pt; }
.cut b { display: block; font: 600 20pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.cut span { display: block; font: 500 9pt/1.25 'Outfit'; margin-top: 4pt; }
"""

def road():
    return ("html", '<div class="road">' + "".join(
        f'<div><b>{md(y)}</b><i></i><span>{md(n)}</span></div>' for y, n, _, _ in TIMELINE) + "</div>")

def cards(keys, years=True, what=False):
    """stop cards, shuffled as given, each with a box for its place"""
    by = {n: (y, w) for y, n, w, _ in TIMELINE}
    out = ""
    for n in keys:
        y, w = by[n]
        out += ('<div><span class="obox"></span>' + (f"<b>{md(y)}</b>" if years else "")
                + f'<span>{md(n)}</span>' + (f'<span>{md(w)}</span>' if what else "") + "</div>")
    return ("html", f'<div class="cardset">{out}</div>')

def sorter(names):
    """each stop with two boxes to check: the poster's words, or a museum note"""
    return ("html", '<div class="sorter">' + "".join(
        f'<div><b>{md(n)}</b><span><i></i>Poster 2</span><span><i></i>Museum note</span></div>' for n in names) + "</div>")

def facts(keys=("christie", "perkins", "features", "success")):
    """a fact file: poster 2's sentences, then the timeline's three museum notes"""
    return ("html", '<div class="facts"><p class="label">Fact file · from poster 2, The Importance of Black Barbie</p>'
            + "".join(f"<p>{md(P2[k])}</p>" for k in keys)
            + '<div class="note"><p class="label">Museum notes · not the poster’s words, each with its own source</p>'
            + "".join(f"<p>{md(t)}</p>" for t in (NOTE_WORLD, NOTE_SHANI, NOTE_WOMEN)) + "</div></div>")

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "milestones", "large": True,
  "out": DIR + "BH_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO,
  "css": CSS + HERO_CSS + OBJ_CSS + FLOW_CSS + CHART_CSS + "body { line-height: 1.4; } .cols:has(.conn) { font-size: 9pt; }",
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 10, C_TEACH), ("Timeline work", 20, C_ACT), ("Close", 5, C_CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Materials needed", "list": [
                 "*The Black Barbie Timeline* (online), projected",
                 "Page 3 of this plan; its eight stop cards, cut apart",
                 "Differentiated handouts, one per student"]})],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the Black Barbie Timeline, from Francie (1967) to today, and put its stops in order. They will learn that the first Black Barbie, introduced by Mattel in 1980, was designed by Kitty Black Perkins, a Black fashion designer at Mattel, and say what made it new. They will tell the poster’s words from a museum note, and explain how one doll built on the dolls before it."]}),
               ("section", {"label": "Standards and themes", "list": [
                 "**Social Studies** — chronology and change over time; people who brought change; sources",
                 "**ELA** — reading informational text closely; finding the sentence that answers a question",
                 "**Math** — the years between two events, by subtraction"]}),
               ("section", {"label": "Words for timeline readers"}),
               ("refs", [
                 ("Timeline", "events set in order by when they happened"),
                 ("Milestone", "an important step that marks a change"),
                 ("Designer", "the person who plans how something will look"),
                 ("Representation", "being shown, so people can see themselves"),
                 ("Source", "where a fact comes from")])]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Guess the year",
      "screen": [
        {"phase": "Hook", "minutes": 2, "script": [0], "title": "A road through time", "show": "image",
         "img": {"img": ROOM_TIMELINE}, "alt": ROOM_TIMELINE_ALT, "fit": "contain",
         "caption": "*The Black Barbie Timeline*",
         "purpose": "Look first: what is a timeline for, and what might this one show?",
         "students": ["What do you notice?", "What do you think a timeline shows?"]},
        {"phase": "Hook", "minutes": 3, "script": [1], "title": "Guess the year", "show": "question", "question": GUESS_Q,
         "purpose": "Guess before being told, as the timeline itself asks.",
         "students": ["Vote: " + ", ".join(GUESS_CHOICES[:-1]) + " or " + GUESS_CHOICES[-1] + "?", "Why do you think so?"]}],
      "body": [
        "Show the Black Barbie Timeline and say nothing yet. Ask: *“What do you notice? What do you think a timeline shows?”* Draw out that a timeline puts events in order by when they happened.",
        "Then play the timeline’s own game: *“" + GUESS_Q + " " + ", ".join(GUESS_CHOICES[:-1]) + " or " + GUESS_CHOICES[-1] + "?”* Students vote with fingers, one to four, and give a reason. Leave the answer for a moment."]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "Eight stops",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Eight stops", "show": "chart",
         "caption": "The Black Barbie Timeline: eight stops", "columns": ["Year", "Stop", "What was new", "Source"],
         "rows": [{"cells": r} for r in STOP_ROWS],
         "purpose": "Read the timeline from start to end, and find 1980 on it.",
         "students": ["Was your guess right?", "Which two dolls came before 1980?"]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "Kitty Black Perkins", "show": "words", "text": P2["perkins"],
         "cite": "The Importance of Black Barbie",
         "purpose": "Meet the designer, and hear what made her doll new.",
         "students": ["Who designed the first Black Barbie?", "What three things were new about it?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Poster or museum note?", "show": "question", "question": SOURCE_Q,
         "purpose": "Tell the poster’s words from the museum’s added notes, and see why sources matter.",
         "students": ["Which three stops are museum notes?", "Why name a source?"]}],
      "body": [
        "Reveal the answer: **1980**, *“a significant milestone in toy manufacturing and cultural representation,”* as poster 2 says. Read the eight stops from the chart on page 3. Two Black dolls came first: Francie in 1967 and Christie in 1968. Read: *“" + P2["christie"] + "”* The poster calls these earlier efforts *problematic*: ask students why.",
        "Read: *“" + P2["perkins"] + " " + P2["features"] + "”* *Afrocentric* means centered on Africa and people of African descent. Ask: *“Why might it matter that a Black designer made this doll?”*",
        "Most stops quote poster 2. Three do not: Dolls of the World, Shani and Inspiring Women. On the timeline they are marked *“" + NOTE_LINE + "”*, and each names its source in the timeline’s Sources list. Ask: *“" + SOURCE_Q + "”* A source lets anyone check a fact."]}),
    ("section", {"label": "Timeline work · 20 minutes",
      "screen": {"phase": "Timeline work", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read the timeline independently, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three put the stops in order and find what made the first Black Barbie new."]},
      "body": ["Students choose a handout. All three levels put the stops in order and find what made the first Black Barbie new."]}),
    ("levels", {
      "green": "Read a printed timeline to answer questions, match four dolls to what was new about each, circle what made the first Black Barbie new, and draw a doll for a stop still to come.",
      "yellow": "Number eight shuffled stop cards in order, finish a timeline table from a fact file, sort the stops into the poster’s words and museum notes, and explain why the designer mattered.",
      "red": "Order the stops and work out the years between them, explain what the poster finds problematic about Francie, show how one doll built on another, and plan research on an Inspiring Women doll."}),
    ("section", {"label": "A human timeline and look back · 5 minutes", "title": "Line up in time",
      "screen": [
        {"phase": "Close", "minutes": 3, "script": [0], "title": "A human timeline", "show": "question",
         "question": "Eight stops, eight people: can the class put them in order?",
         "purpose": "Put the stops in order from memory, then check by the years.",
         "students": ["Hold your card with the year hidden.", "Earliest at one end, today at the other."]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": [
        "Give eight students the stop cards from page 3, each folded so only the name shows. The class puts them in order, earliest first; then the eight unfold their cards and check by the years.",
        "Ask the objectives back, from the screen or page 1: *“Can you now…?”* Students show a thumb up, sideways or down. Exit question: *“Name one milestone and say what changed.”*"]}),
    ("cols", [
      [("section", {"label": "Background · the poster and the notes", "body": [
        "Five stops quote poster 2; three are museum notes with sources (the Virtual Black Doll Museum; Mattel, NBC News and CNN). Like the timeline, this lesson shows no photographs of dolls. Ida B. Wells, Madam C. J. Walker and Bessie Coleman are named, not described: their stories are for students to find out."]}),
       ("connection", ["**Online,** the Black Barbie Timeline asks students to guess the year at each stop and ends with a final challenge: put them in order. **In the exhibition,** the display case holds the Nigerian and Ghanaian boxed editions and the three Inspiring Women dolls."])],
      [("section", {"label": "Answer key", "list": [
        "**Order:** Francie 1967, Christie 1968, the first Black Barbie 1980, Dolls of the World c. 1990, Shani 1991, AKA Centennial Barbie and “So In Style” 2008–09, Inspiring Women 2022–23, Today.",
        "**Green:** a. Francie; b. 1980; c. 4. The matches follow the chart on page 3. New in 1980: Afrocentric facial features, natural hairstyles, a glamorous design.",
        "**Yellow:** museum notes are Dolls of the World, Shani and Inspiring Women; the rest quote the poster.",
        "**Red:** 1967 to 1980 is **13** years; 1980 to 2008 is **28**; 1980 to 2023 is **43**; 1980 to 1991 is **11**."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Black Barbie Timeline, stop by stop",
                 "body": ["The eight stops, earliest first. *Poster* stops quote poster 2; *museum note* stops are the timeline’s added notes, each with its own source."]}),
    chart(["Year", "Stop", "What was new", "Source"], STOP_ROWS, src_col=3),
    ("section", {"label": "Stop cards for the human timeline", "body": ["Cut apart; fold each card so the year is hidden."]}),
    ("html", '<div class="cut">' + "".join(f'<div><b>{md(y)}</b>' + (f'<span>{md(n)}</span>' if n != y else "") + '</div>' for y, n, _, _ in TIMELINE) + "</div>"),
    ("section", {"label": "Questions to ask in front of the timeline", "list": [
      "Which stop do you think was the biggest change? Why?",
      "The poster calls Francie and Christie *problematic*. What do you think it means?",
      "Why do you think the first Black Barbie mattered to the children who played with it?",
      "If you could add a stop for next year, what doll would you want to see?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Mattel introduced the first Black Barbie in 1980. It was designed by **Kitty Black Perkins**, a Black fashion designer at Mattel. The Mini Museum’s *Black Barbie Timeline* follows Black dolls from Francie in 1967 to today. Most of its stops quote poster 2, *The Importance of Black Barbie*; three are museum notes, each with its own source."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · The Black Barbie Timeline", "level": level, "context": CONTEXT,
            "css": CSS + HERO_CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

def match():
    left = ["Francie (1967)", "Christie (1968)", "The first Black Barbie (1980)", "Shani (1991)"]
    right = ["Part of Barbie’s friend group",
             "Mattel’s first line of Black fashion dolls launched separately from the Barbie line",
             "Essentially a white doll design with darker skin",
             "Designed by Kitty Black Perkins, a Black fashion designer at Mattel"]
    cells = "".join(f'<p class="l">{md(a)}</p><span></span><p class="r">{md(b)}</p>' for a, b in zip(left, right))
    return ("html", f'<div class="match">{cells}</div>')

GREEN = handout("green", "BH_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Read the timeline", "blocks": [road()],
            "body": ["Use the timeline to answer.",
                     "**a.** Which doll came first, Francie or Christie? ______________________",
                     "**b.** In what year did the first Black Barbie arrive? ______________",
                     "**c.** How many stops come after 1980, not counting Today? ______"]}),
  ("task", {"label": "Part 2", "title": "Match each doll to what was new",
            "blocks": [P("Draw a line from each doll to the words that describe it."), match()]}),
  ("task", {"label": "Part 3", "title": "What made it new?",
            "blocks": [P("Read the poster’s words: *“" + P2["features"] + "”* Circle the **three** things that were new about the first Black Barbie."), ("html", '<div class="bank"><span>Afrocentric facial features</span><span>a white doll design</span>'
                        '<span>natural hairstyles</span><span>part of Barbie’s friend group</span><span>a glamorous design</span></div>')]}),
  ("task", {"label": "Part 4", "title": "Who designed it?",
            "body": ["Finish the sentence: **The first Black Barbie was designed by** __________________________, **a Black fashion designer at Mattel. It mattered that she designed it because…**"],
            "lines": 2}),
  ("task", {"label": "Part 5", "title": "A stop still to come",
            "body": ["Draw a doll you would add to the timeline one day. Give it a name and a year."],
            "blocks": [("draw", "My new stop")]}),
  ("family", ["Ask someone at home about a toy they loved as a child. When was it? Did it look like them? Tell them about Kitty Black Perkins and the first Black Barbie."]),
], "body .drawbox { height: 150pt; }")

YELLOW = handout("yellow", "BH_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Put the stops in order",
            "blocks": [P("Write **1 to 8** in the boxes, from the earliest stop to Today."),
                       cards(["Shani", "Francie", "Today", "The first Black Barbie", "Inspiring Women",
                              "Christie", "AKA Centennial Barbie and “So In Style”", "Dolls of the World"])]}),
  facts(),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Fill in the timeline",
            "blocks": [P("Use the fact file on page 1 to fill each empty box."),
                       ("table", {"head": ["Year", "Doll", "What was new"], "rows": [
              ["1967", "Francie", ""],
              ["1968", "", "Presented as part of Barbie’s friend group"],
              ["", "The first Black Barbie", "Designed by Kitty Black Perkins"],
              ["1991", "Shani", ""],
              ["2008", "", "Highlighted authentic Black features and realistic hair textures"]]})]}),
  ("task", {"label": "Part 3", "title": "Poster or museum note?",
            "blocks": [P("Use the fact file. Check where each stop’s facts come from."),
                       sorter(["Christie", "Dolls of the World", "The first Black Barbie", "Shani", "Inspiring Women"])]}),
  ("task", {"label": "Part 4", "title": "Why the designer mattered",
            "body": ["The first Black Barbie was designed by a Black fashion designer. Why do you think that made a difference? Use the fact file."],
            "lines": 4}),
  ("family", ["Show your family the timeline’s eight stops. Ask them which one surprises them most. Tell them the difference between the poster’s words and a museum note."]),
], ".facts { font-size: 8.5pt; line-height: 1.28; padding-top: 5pt; } .facts p { margin-bottom: 3pt; } .cardset div { min-height: 40pt; padding: 5pt 7pt; } table.fill td:first-child { width: 14%; } table.fill td:nth-child(2) { width: 30%; }")

RED = handout("red", "BH_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Order and measure",
            "blocks": [P("Write **1 to 8** in the boxes, from the earliest stop to Today. Then work out the years between the stops."),
                       cards(["Inspiring Women", "Dolls of the World", "Christie", "Today", "Shani",
                              "AKA Centennial Barbie and “So In Style”", "The first Black Barbie", "Francie"]),
                       ("html", '<p class="sum">From Francie (1967) to the first Black Barbie (1980): <u></u> years</p>'
                                '<p class="sum">From the first Black Barbie (1980) to the AKA Centennial Barbie (2008): <u></u> years</p>'
                                '<p class="sum">From the first Black Barbie (1980) to the Bessie Coleman doll (2023): <u></u> years</p>'
                                '<p class="sum">Kitty Black Perkins designed the first Black Barbie (1980) and Shani (1991). How many years apart? <u></u> years</p>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "The earlier dolls",
            "body": ["The poster says these earlier efforts were *problematic*: *“" + P2["christie"] + "”* In your own words, what was wrong with Francie’s design? What did the first Black Barbie do differently?"],
            "lines": 3}),
  ("task", {"label": "Part 3", "title": "Building on the past",
            "body": ["*“" + P2["legacy"] + "”* Choose a later stop. Explain how it built on a doll that came before it."],
            "lines": 4}),
  ("task", {"label": "Part 4", "title": "Plan your research",
            "blocks": [P("*“" + NOTE_WOMEN + "”* This is a museum note, not the poster’s words. Circle one of the three women. Write three questions you would research before you could write her stop on the timeline. Where would you look for a trustworthy source?"),
                       ("html", '<div class="bank"><span>Ida B. Wells</span><span>Madam C. J. Walker</span><span>Bessie Coleman</span></div>')],
            "lines": 4}),
  ("family", ["Ask your family to help you find a library book about Ida B. Wells, Madam C. J. Walker or Bessie Coleman. Why do you think a doll was made to honor her?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
