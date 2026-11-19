"""Grades 1–2 · "From a Week to a Month"
Carter G. Woodson, Negro History Week (1926) and why Black History Month is
in February, from poster 1, Black History Month. Facts follow
app/exhibitions/black-history/blackHistory.ts (poster 1), word for word.

The poster honors Martin Luther King Jr., Harriet Tubman and Langston Hughes
by name and tells no more about them, so neither does the lesson: the
children wonder what they would like to find out, and the teacher can find
out with them."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-1-2/"
TITLE = "From a Week to a Month"
SUB = "Grades 1–2 · Carter G. Woodson and Black History Month"
HERO = HERO_RING

# Said in the plan and shown on the classroom screen, so written once.
WOODSON_WORDS = "Carter G. Woodson\nA historian\n1926: Negro History Week"
FEB_Q = "Why do you think Woodson chose February?"
HONOR_WORDS = "Martin Luther King Jr.\nHarriet Tubman\nLangston Hughes"
KEEP_Q = "What would you give to a museum, so people remember?"
PASS_ON = "Woodson wanted every child to learn Black history. Tell a partner one thing you learned today. Now you are passing it on!"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("say who Carter G. Woodson was, and what he started in 1926",
     "say who Carter G. Woodson was, and what he started?", False),
    ("tell why Black History Month is in February",
     "tell why Black History Month is in February?", False),
    ("show how one week of seven days grew into a whole month",
     "show how a week grew into a month?", False),
    ("say how museums help keep history safe, and choose something you would keep",
     "say how museums keep history safe?", True)],
  "why": "Carter G. Woodson wanted every schoolchild to learn Black history. Every February, when we learn it, we do what he hoped.",
  "screen": {"heading": "I can…", "items": [
    "say who Carter G. Woodson was",
    "tell why Black History Month is in February",
    "show how a week grew into a month",
    "say how museums keep history safe"]}}

POSTER_SCREEN = {"img": POSTER1}

CSS = DOLL_CSS + """
.months { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7pt; margin: 4pt 0 8pt; break-inside: avoid; }
.months span { border: 1.2pt solid #1d1c1a; border-radius: 99pt; background: rgba(255,255,255,.6); text-align: center;
  padding: 6pt 0 5pt; font: 400 12.5pt 'Outfit'; }
.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5pt; margin: 4pt 0 6pt; break-inside: avoid; }
.days span { aspect-ratio: 1; border: 1.2pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); }
.days.ten { grid-template-columns: repeat(10, 1fr); }
.daylab { font: 500 8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #5b5a55; margin: 0 0 2pt; }
.bank { display: flex; flex-wrap: wrap; gap: 8pt; margin: 4pt 0 10pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 14pt; font: 400 13pt 'Outfit'; background: rgba(255,255,255,.6); }
.fillin p { margin: 0 0 13pt; }
.fillin u { display: inline-block; min-width: 130pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 50pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 12pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -7pt; font: 300 60pt/1 'Outfit'; letter-spacing: .18em; color: #a9a69b; }
.rings { display: flex; justify-content: center; gap: 14pt; margin: 6pt 0 8pt; }
.rings span { width: 104pt; height: 104pt; border-radius: 50%; border: 1.4pt solid #1d1c1a; background: rgba(255,255,255,.55); }
.storycard { display: grid; grid-template-columns: 230pt 1fr; gap: 18pt; align-items: start; margin: 4pt 0 10pt; break-inside: avoid; }
.storycard img { width: 230pt; height: auto; border-radius: 4pt; border: .8pt solid #1d1c1a; }
.storycard ol { margin: 0; padding-left: 16pt; font-size: 12pt; line-height: 1.5; }
.storycard li { margin-bottom: 9pt; }
"""

MONTHS = ('<div class="months">' + "".join(f"<span>{m}</span>" for m in [
  "January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December"]) + "</div>")
def days(n, cls=""):
    return f'<div class="days {cls}">' + "<span></span>" * n + "</div>"
FOUR_WEEKS = "".join(f'<p class="daylab">Week {i}</p>' + days(7) for i in range(1, 5))
def trace(word, rows=1):
    return '<div class="trace">' + f'<div><span>{word}</span></div>' * rows + "</div>"
RINGS = '<div class="rings">' + "<span></span>" * 4 + "</div>"

STORY = [
  "Carter G. Woodson was a **historian**, a person who studies the past. He trained at Harvard.",
  "He wanted Black history to reach everyone, not only scholars. His week was made to teach schoolchildren.",
  "In **1926** he started **Negro History Week**, a week for learning Black history.",
  "He chose **February**, the month of the birthdays of **Abraham Lincoln** and **Frederick Douglass**.",
  "The week later became **Black History Month**.",
]

LESSON = {
  "slug": "from-a-week-to-a-month", "large": True,
  "out": DIR + "BH_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 1–2", "hero": HERO,
  "css": CSS + HERO_CSS + OBJ_CSS + FLOW_CSS + "body { line-height: 1.4; }",
  "blocks": [
    ("timing", [("Hook", 4, C_HOOK), ("Story time", 10, C_TEACH), ("Activity", 12, C_ACT), ("Close", 4, C_CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What children will understand",
      "body": ["Children will learn that Black History Month began as a single week. In 1926 the historian Carter G. Woodson started Negro History Week so that schoolchildren would learn Black history, and he chose February for the birthdays of Abraham Lincoln and Frederick Douglass. The week later became a month. Children will count a week into a month, hear the names the poster honors, and think about how museums keep history safe."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Social Studies** — people who made a difference; why we celebrate; museums and artifacts",
        "**Math** — the months of the year; a week of seven days; counting by sevens",
        "**ELA** — listening to and retelling a true story; asking questions"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Poster 1, *Black History Month*: page 3 of this plan, projected or printed, or the poster in the exhibition",
      "A wall calendar, open at February",
      "Differentiated handouts, one per child; crayons"]}),
    ("section", {"label": "Hook · 4 minutes", "title": "What do you see?",
      "screen": {"phase": "Hook", "show": "image", "img": POSTER_SCREEN, "alt": POSTER1_ALT,
                 "caption": "Poster 1 · *Black History Month*",
                 "purpose": "Look at the poster’s pictures before any words: who is in them, and what are they doing?",
                 "students": ["Look at the circles. Who do you see?", "What are they doing?"]},
      "body": ["Show poster 1 and say nothing yet. Ask: *“Look at the circles. Who do you see? What are they doing?”* Children may find a musician, a singer at a microphone, a worker in a cap, a scientist at a microscope, music notes and an atom. Then point to the big words: *“This says Black History Month. Every February, we learn about Black history. But it did not start as a month. It started as one week.”*"]}),
    ("section", {"label": "Story time · 10 minutes", "title": "Carter G. Woodson’s week",
      "screen": [
        {"phase": "Story time", "minutes": 3, "script": [0], "title": "A historian", "show": "words", "text": WOODSON_WORDS,
         "cite": "Black History Month",
         "purpose": "Meet Carter G. Woodson, the historian who wanted schoolchildren to learn Black history.",
         "students": ["Listen to the story.", "What is a historian?"]},
        {"phase": "Story time", "minutes": 3, "script": [1], "title": "Why February?", "show": "question", "question": FEB_Q,
         "purpose": "Wonder first, then hear the poster’s answer: two birthdays.",
         "students": ["Guess first!", "Then listen for two birthdays."]},
        {"phase": "Story time", "minutes": 2, "script": [2], "title": "A week grew into a month", "show": "words",
         "text": "1926: one week\nToday: a whole month",
         "purpose": "See the week grow: seven days became a month.",
         "students": ["How many days are in a week?", "Is a month longer or shorter?"]},
        {"phase": "Story time", "minutes": 2, "script": [3], "title": "People we honor", "show": "words", "text": HONOR_WORDS,
         "cite": "Black History Month",
         "purpose": "Hear three names the poster honors, and wonder what we would like to find out.",
         "students": ["Have you heard these names?", "What would you like to find out?"]}],
      "body": [
        "Tell the story: *“A long time ago there was a man called Carter G. Woodson. He was a **historian**, a person who studies the past. He believed Black history should not stay with scholars in universities. He wanted everyone to learn it. So in 1926 he started a special week to teach schoolchildren Black history. He called it Negro History Week.”* (*Negro* is an old word people used then for Black Americans. Today we say Black or African American.)",
        "Ask: *“" + FEB_Q + "”* Take guesses. Then: *“He chose February because two famous Americans had their birthdays in February: Abraham Lincoln and Frederick Douglass.”* Find February on the calendar.",
        "*“Woodson’s week later became Black History Month.”* Count seven days on the calendar for one week, then show the whole month. *“One week grew into a whole month!”*",
        "Read the three names the poster honors: Martin Luther King Jr., Harriet Tubman and Langston Hughes. Ask who has heard of them, and what the children would like to find out. Write their questions down to explore later in the month."]}),
    ("section", {"label": "Activity · 12 minutes", "title": "History keepers",
      "screen": [
        {"phase": "Activity", "minutes": 4, "script": [0], "title": "History keepers", "show": "question", "question": KEEP_Q,
         "purpose": "Connect the poster’s idea of preserving history to the children’s own lives.",
         "students": ["Think of something special from your family.", "Why should people remember it?"]},
        {"phase": "Activity", "minutes": 8, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Practice the story on paper, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three find February, count a week, and keep history safe."]}],
      "body": [
        "The poster says that museums help keep Black history safe: people give **artifacts**, special objects, to museums so that everyone can remember. Ask: *“" + KEEP_Q + "”* Children tell a partner about something special from their family: a photograph, a recipe, a song.",
        "Then children choose a handout; all three levels find February and count a week."]}),
    ("levels", {
      "green": "Circle February, color seven boxes for a week, draw something to give a museum, and trace the word *history*.",
      "yellow": "Circle February, finish the story with a word bank, count the days in four weeks, and draw and label something to keep safe.",
      "red": "Write why Woodson chose February and why he wanted children to learn Black history, write a question about a person the poster honors, and design a circle picture like the poster’s."}),
    ("section", {"label": "Look back and pass it on · 4 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each child can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]},
        {"phase": "Close", "minutes": 2, "script": [1], "title": "Pass it on", "show": "question", "question": PASS_ON,
         "purpose": "Do what Woodson hoped: pass Black history on.",
         "students": ["Tell a partner one thing you learned today."]}],
      "body": ["Put the questions on the screen. For each one, children show a thumb up, sideways or down: *“Can you now "
               + " Can you ".join(q for _, q, _ in OBJECTIVES["items"]) + "”*",
               "Then say: *“" + PASS_ON + "”*"]}),
    ("cols", [[("section", {"label": "For the teacher", "body": [
        "Every fact here is from poster 1. It honors Martin Luther King Jr., Harriet Tubman and Langston Hughes by name and tells no more about them: let the children’s questions lead you to good books in your library through the month."]}),
     ("connection", ["**Visit the exhibition:** stand in front of poster 1 and find the musician, the singer, the worker and the scientist in its ring. **Online,** the poster’s walkthrough reads each paragraph aloud."])],
    [("section", {"label": "Assessment notes", "list": [
      "Can the child say that Carter G. Woodson was a historian who started a week for Black history?",
      "Can the child find February, and say it holds two birthdays?",
      "Can the child count seven days for one week?",
      "**Answers:** Yellow — 4 weeks of 7 days make **28** days. Red — Woodson chose February for the birthdays of **Abraham Lincoln and Frederick Douglass**."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The story of a week that grew",
                 "body": ["Project or print this page for story time, or take it to poster 1. Every fact here comes from the poster."]}),
    ("html", '<div class="storycard"><img src="' + POSTER1 + '" alt=""><div><p class="label">Poster 1 · Black History Month</p><ol>'
             + "".join(f"<li>{md(s)}</li>" for s in STORY) + "</ol></div></div>"),
    ("section", {"label": "Questions to ask the children", "list": [
      "What is a historian? What would you like to study about the past?",
      "Why did Carter G. Woodson want schoolchildren to learn Black history?",
      "Why is Black History Month in February?",
      "If you could keep one story, place or object safe for people in the future, what would it be, and why?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["**A grown-up reads this aloud.** Carter G. Woodson was a historian. In 1926 he started Negro History Week, so that schoolchildren would learn Black history. He chose February, the month of the birthdays of Abraham Lincoln and Frederick Douglass. His week later became Black History Month."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 1–2", "level": level, "young": True, "css": CSS + HERO_CSS + css,
            "context": CONTEXT,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "BH_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Black History Month is in February. Circle February.",
            "blocks": [("html", MONTHS)]}),
  ("task", {"label": "Part 2", "title": "Negro History Week was one week. A week has 7 days. Color 7 boxes.",
            "blocks": [("html", days(10, "ten"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Museums keep history safe. Draw something special you would give to a museum.",
            "blocks": [("draw", "For the museum")]}),
  ("task", {"label": "Part 4", "title": "Trace the word.",
            "blocks": [("html", trace("history", 2))]}),
  ("family", ["Ask your child: *who was Carter G. Woodson? Why is Black History Month in February?* Then share one special object from your family and tell its story."]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Circle the month of Black History Month.",
            "blocks": [("html", MONTHS)]}),
  ("task", {"label": "Part 2", "title": "Finish the story. Use the words in the bank.",
            "blocks": [("html", '<div class="bank"><span>historian</span><span>week</span><span>February</span><span>month</span></div>'
                        '<div class="fillin"><p>Carter G. Woodson was a <u></u>.</p>'
                        '<p>In 1926 he started Negro History <u></u>.</p>'
                        '<p>He chose <u></u> for two birthdays.</p>'
                        '<p>His week grew into a whole <u></u>.</p></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "A week grew into a month. Count the days in four weeks. How many?",
            "blocks": [("html", FOUR_WEEKS + '<p style="font-size:14pt;margin-top:6pt">4 weeks = <u style="display:inline-block;min-width:60pt;border-bottom:1pt solid #1d1c1a;text-decoration:none"></u> days</p>')]}),
  ("task", {"label": "Part 4", "title": "Draw something you would keep safe in a museum. Write its name.",
            "blocks": [("draw", "To keep safe")]}),
  ("family", ["Ask your child to tell you the story of Negro History Week. Then look at a family photograph together: what story does it keep safe?"]),
], "body.young .drawbox { height: 150pt; }")

RED = handout("red", "BH_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Part 1", "title": "Why did Carter G. Woodson choose February?",
            "lines": 2}),
  ("task", {"label": "Part 2", "title": "Why do you think it matters for children to learn Black history?",
            "lines": 2}),
  ("task", {"label": "Part 3", "title": "The poster honors these three people. Circle one. Write a question about that person.",
            "blocks": [("html", '<div class="bank"><span>Martin Luther King Jr.</span><span>Harriet Tubman</span><span>Langston Hughes</span></div>')],
            "lines": 2}),
  ("task", {"label": "Part 4", "title": "The poster has a ring of circle pictures. Design your own for Black History Month: draw a person, or a thing, in each circle.",
            "blocks": [("html", RINGS)]}),
  ("task", {"label": "Part 5", "title": "If you could keep one story, place or object safe for people in the future, what would it be? Why?",
            "lines": 3}),
  ("family", ["Choose one of the three names on this page and find a book about that person at the library together. What did your child find out?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
