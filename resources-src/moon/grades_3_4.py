"""Grades 3–4 · "The Moon's Record Book"
Poster 1, Our Incredible Moon: the Moon was probably born in a giant crash
(Theia, about the size of Mars, about 4.5 billion years ago); its cratered face
is a record of the space rocks that have struck our corner of the solar system
for billions of years; with no wind or rain, marks on the Moon last (the
footprints will probably last for millions of years, unless a meteorite
strikes). The display case holds a genuine lunar meteorite, Adrar 013
(MICROSCOPE_NOTES.adrar). The crater lab is a classroom model, not a claim
of the exhibition. Facts: app/exhibitions/moon/moon.ts."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (MOONRISE, IMPACT, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, quote, review)

DIR = "teachers/grades-3-4/"
TITLE = "The Moon’s Record Book"
SUB = "Grades 3–4 · Our Incredible Moon · Craters, a giant crash and a piece of the Moon"
HERO = {"img": MOONRISE, "pos": "center 45%"}

# poster 1, word for word
THEIA = "Scientists think an object about the size of Mars, nicknamed Theia, slammed into the young Earth about 4.5 billion years ago. The debris from that collision came together to form our Moon."
RECORD = "Additionally, the Moon’s cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years."
STAY = "The Moon has no wind or rain, so unless a meteorite happens to strike them, the astronauts’ footprints will probably last for millions of years."
ADRAR = "Adrar 013 is a lunar meteorite weighing 3,150 grams in all, purchased in Adrar, Algeria, in 2023."
TALK = "No one was there to watch the Moon form. How can scientists work out what probably happened billions of years ago?"
HOOK_Q = "What made all the round marks on the Moon’s face?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("tell how scientists think the Moon was born: in a giant crash, about 4.5 billion years ago",
     "tell how scientists think the Moon was born?", False),
    ("explain why the Moon’s cratered face is a record of space rocks",
     "explain why the Moon’s face is a record?", False),
    ("explain why marks on the Moon last so long, when marks on Earth wear away",
     "explain why marks on the Moon last so long?", False),
    ("use a model to test an idea about craters, and say one thing the model cannot show",
     "use a model to test an idea, and say what it cannot show?", True)],
  "why": "No one was there to watch the Moon form, or to see most of its craters made. Scientists read the clues that are left, the way a detective reads a scene."}

WORDS = [("Crater", "a bowl-shaped hole made when something strikes a surface"),
         ("Meteorite", "a space rock that reaches the surface of a planet or moon"),
         ("Debris", "broken pieces left after a crash"),
         ("Record", "something that keeps a trace of what happened"),
         ("Model", "a small, safe copy we use to test an idea")]

# ── drawings ───────────────────────────────────────────────────────────
INK = "#1d1c1a"
LAB = ('<svg viewBox="0 0 360 150" width="100%" aria-hidden="true" style="max-width:320pt;display:block;margin:4pt auto 8pt">'
       f'<g fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
       '<path d="M60 96H300L288 136H72Z" fill="#fff"/><path d="M64 104H296" stroke="#7A5230" stroke-width="5"/>'
       '<path d="M150 104C158 116 182 116 190 104" fill="#f3ecdd"/>'
       '<circle cx="170" cy="20" r="8" fill="#9a9a9a"/><path d="M170 32V84" stroke-dasharray="4 5"/><path d="M164 78L170 86L176 78"/>'
       '<path d="M232 20V96" stroke-width="1.4"/><path d="M226 20H238M226 96H238" stroke-width="1.4"/></g>'
       '<g font-family="Outfit" font-size="11" fill="#1d1c1a">'
       '<text x="244" y="62">drop height</text><text x="12" y="104">cocoa</text><text x="12" y="124">flour</text>'
       '<text x="158" y="24" text-anchor="end">pebble or marble</text></g>'
       f'<g stroke="{INK}" stroke-width="1"><path d="M46 101H62M46 121H76"/></g></svg>')

def craters_svg(letters=True, w="100%"):
    """four overlapping craters: the one on top was made last"""
    c = [(110, 96, 60, "A"), (70, 50, 24, "C"), (176, 80, 34, "B"), (204, 112, 17, "D")]   # drawn oldest first
    g = ""
    for x, y, r, l in c:
        g += (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#efe9f6" stroke="{INK}" stroke-width="2"/>'
              f'<circle cx="{x}" cy="{y + r * .12}" r="{r * .78}" fill="#ddd2ec" stroke="none"/>')
        if letters:
            g += f'<text x="{x}" y="{y + 6}" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="{20 if r > 20 else 15}" fill="#1d1c1a">{l}</text>'
    return (f'<svg viewBox="0 0 260 170" width="{w}" aria-hidden="true" style="max-width:230pt;display:block;margin:2pt auto 6pt">'
            f'<rect x="2" y="2" width="256" height="166" rx="10" fill="#cfc4e0" stroke="{INK}" stroke-width="1.5"/>{g}</svg>')

CSS = BASE_CSS + """
.refs { display: grid; grid-template-columns: auto 1fr; gap: 3pt 10pt; margin: 2pt 0 10pt; font-size: 9.6pt; }
.refs dt { font-weight: 500; }
.refs dd { margin: 0; }
table.fill td { height: 26pt; }
table.fill td:first-child { width: 30%; }
.bank { display: flex; flex-wrap: wrap; gap: 7pt; margin: 4pt 0 10pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 12pt; font: 400 10.5pt 'Outfit'; background: rgba(255,255,255,.6); }
.fillin p { margin: 0 0 12pt; line-height: 1.5; }
.fillin u { display: inline-block; min-width: 96pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.story { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 10pt; }
.story div { border: 1pt solid #1d1c1a; border-radius: 6pt; padding: 8pt 9pt; background: rgba(255,255,255,.55); font-size: 10pt; line-height: 1.35; }
.story b { display: block; width: 24pt; height: 24pt; border: 1.2pt solid #1d1c1a; border-radius: 50%; margin-bottom: 6pt; background: #fff; }
.twobox { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 4pt 0 8pt; }
.twobox div { border: 1pt solid #1d1c1a; border-radius: 6pt; height: 118pt; padding: 5pt 8pt; background: rgba(255,255,255,.55);
  font: 500 7.5pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-text); }
.circ { display: flex; gap: 14pt; flex-wrap: wrap; margin: 4pt 0 6pt; }
.circ span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 12pt; font-size: 10.5pt; background: rgba(255,255,255,.6); }
.lab { margin: 0 0 8pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "the-moons-record-book", "large": True,
  "out": DIR + "MOON_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS + "body { line-height: 1.44; }",
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 10, "#2F4A5A"), ("Crater lab", 20, "#86671A"), ("Close", 5, "#A8452F")]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will learn that scientists think the Moon was born in a giant crash, and that its cratered face is a **record** of the space rocks that have struck it for billions of years. They will make craters in a model, find out why the Moon keeps its marks when Earth wears them away, and think about how scientists work out a story no one was there to see."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Earth and space science** — the Moon; weathering and erosion by wind and water",
        "**Science practices** — using a model; planning a fair test; recording and explaining results",
        "**ELA** — explaining with evidence; vocabulary in context",
        "**Math** — measuring in centimeters; grams and kilograms"]}),
       ("section", {"label": "Materials needed", "list": [
        "A deep tray or baking pan of flour, smoothed flat, with a thin dusting of cocoa powder on top",
        "Pebbles or marbles of two sizes; a ruler; newspaper under the tray",
        "Page 3 of this plan, projected or printed",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "A face full of marks",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": MOONRISE, "pos": "center 35%"},
                 "alt": "The Moon rising on the poster: a huge lavender Moon, its face covered in gray patches and round marks",
                 "caption": HOOK_Q, "fit": "cover",
                 "purpose": "Wonder at the Moon’s marks before anyone names them.",
                 "students": ["What do you notice about the Moon’s face?", "What could have made the round marks?"]},
      "body": ["Show the Moon from the poster on the screen or page 3. Ask: *“" + HOOK_Q + "”* Take every idea without judging: volcanoes, holes, rocks, aliens. Write a few on the board. *“Today you are Moon scientists. By the end, you will test one of these ideas yourselves.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "Three chapters of the Moon’s story",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "A giant crash", "show": "listen", "clips": [IMPACT],
         "question": "Scientists think the Moon was born in a giant crash. Listen.",
         "purpose": "Hear the poster’s first chapter: how the Moon was probably born.",
         "students": ["What crashed into the young Earth?", "What did the debris do?"]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "A record of space rocks", "show": "words", "text": RECORD,
         "cite": "Our Incredible Moon",
         "purpose": "Name the craters, and hear why the poster calls them a record.",
         "students": ["What is a record?", "What does the Moon’s face record?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "No wind, no rain", "show": "words", "text": STAY,
         "cite": "Our Incredible Moon",
         "purpose": "Understand why marks on the Moon last so long.",
         "students": ["What wears marks away on Earth?", "Why do marks on the Moon last?"]}],
      "body": [
        "**A giant crash.** Play the sound and read the poster: *“" + THEIA + "”* No one saw it happen. *Probably* is an honest scientist’s word.",
        "**A record.** Read: *“" + RECORD + "”* A record keeps a trace of what happened, like a diary. The display case holds a genuine **lunar meteorite**, Adrar 013: a rock from the Moon that reached Earth.",
        "**No wind, no rain.** On Earth, wind and rain wear marks away. Read: *“" + STAY + "”* If footprints can last for millions of years, ask what that means for craters."]}),
    ("section", {"label": "Crater lab · 20 minutes", "title": "Make a crater",
      "screen": [
        {"phase": "Crater lab", "minutes": 8, "script": [0], "title": "Drop, look, measure", "show": "question",
         "question": "Does a rock dropped from higher up make a bigger crater?",
         "purpose": "Test an idea with a model, fairly: change one thing at a time.",
         "students": ["Drop from 20 cm, then from 60 cm. Same pebble.", "Measure each crater across. Look at the cocoa."]},
        {"phase": "Crater lab", "minutes": 12, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Record the lab and explain the Moon’s record, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three record the crater lab."]}],
      "body": [
        "Gather round the tray. A volunteer drops a pebble from 20 cm, measured with a ruler; another drops the same pebble from 60 cm, in a fresh spot. Measure each crater across. Look at the cocoa: the flour underneath is thrown out around the crater. Then gently blow across one crater, and sweep a finger over another. *“That is what wind and rain do on Earth. On the Moon, nothing smooths them away.”*",
        "Students then choose a handout and record the lab. All three ask why the Moon keeps its record."]}),
    ("levels", {
      "green": "Number the Moon’s story in order. Draw the two craters and circle which is bigger. Finish sentences about wind and rain from a word bank.",
      "yellow": "Fill in the Moon’s story from a word bank. Record three drops in a table and state the pattern. Explain why Earth wipes its record clean and the Moon does not.",
      "red": "Read four overlapping craters and order them, oldest first. Plan and record a fair test. Explain how the model is like the Moon and how it is not."}),
    ("section", {"label": "Look back · 5 minutes",
      "screen": [
        review(OBJECTIVES, 3, [0], hint=THUMBS),
        {"phase": "Close", "minutes": 2, "script": [1], "title": "How do we know?", "show": "question", "question": TALK,
         "purpose": "Close with the poster’s own question about evidence.",
         "students": ["Turn to a partner.", "What clues are left for scientists to read?"]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* For each one, students show a thumb up, sideways or down; for the last, ask a Red Level student to name what the flour model cannot show.",
               "End with the poster’s question: *“" + TALK + "”* Craters, debris and Moon rocks are clues: evidence left behind."]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Story order (Green):** 1 a giant crash; 2 the debris forms the Moon; 3 space rocks make craters.",
        "**Word bank (Yellow):** Mars, 4.5 billion, debris, craters, wind, rain.",
        "**Overlapping craters (Red):** a crater that cuts into another was made later. A is oldest; B cuts into A, and D into B: A, B, D. C cuts into A, so it is younger than A, but it touches neither B nor D, so we cannot tell where it fits.",
        "**The pattern:** accept honest results. A lab is about evidence, not the expected answer."]})],
      [("section", {"label": "Assessment", "list": [
        "Can the student give a reason, not only a fact: *craters last because…*? Did they change only one thing at a time?",
        "Red: a real limit of the model, such as: flour is not Moon rock, and a pebble dropped by hand is not a space rock."]}),
       ("connection", ["**On the poster** *Our Incredible Moon*, find the giant crash. **In the display case**, look for the lunar meteorite Adrar 013."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Moon’s record book",
                 "body": ["Project or print this page for the hook and the lesson."]}),
    ("html", f'<img src="{MOONRISE}" alt="" style="width:100%;height:150pt;object-fit:cover;object-position:center 35%;border-radius:6pt;display:block;margin:0 0 4pt">'
             '<p class="pcredit"><b>Picture</b> The Moon from the poster <i>Our Incredible Moon</i></p>'),
    quote(THEIA, "Our Incredible Moon · The Moon was probably born in a giant crash"),
    quote(RECORD, "Our Incredible Moon"), quote(STAY, "Our Incredible Moon"),
    ("section", {"label": "The crater lab"}),
    ("html", LAB),
    ("cols", [[("section", {"label": "Words for Moon scientists"}), ("refs", WORDS)],
              [("section", {"label": "In the display case", "body": [ADRAR]})]]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Scientists think the Moon was born when an object the size of Mars crashed into the young Earth, about 4.5 billion years ago. Since then, space rocks have struck the Moon again and again. With no wind or rain to wipe them away, their craters stay: the Moon’s face is a record of its history."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · Our Incredible Moon", "level": level, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 3–4 · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

GREEN = handout("green", "MOON_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "The Moon’s story",
            "blocks": [P("Number the boxes 1, 2 and 3 to put the Moon’s story in order."),
                       ("html", '<div class="story"><div><b></b>Space rocks strike the Moon and make craters.</div>'
                                '<div><b></b>An object about the size of Mars crashes into the young Earth.</div>'
                                '<div><b></b>The debris from the crash comes together to make the Moon.</div></div>')]}),
  ("task", {"label": "Part 2", "title": "Crater lab",
            "blocks": [P("Draw each crater from above. Then circle the one that is bigger."),
                       ("html", '<div class="twobox"><div>Dropped from low</div><div>Dropped from high</div></div>'
                                '<div class="circ"><span>The low drop</span><span>The high drop</span><span>They are the same</span></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Why do marks last on the Moon?",
            "blocks": [P("Use the words in the box to finish the sentences."),
                       ("html", '<div class="bank"><span>wind</span><span>rain</span><span>millions</span><span>record</span></div>'
                                '<div class="fillin"><p>1. On Earth, <u></u> and <u></u> wear marks away.</p>'
                                '<p>2. The Moon has no wind or rain, so footprints may last for <u></u> of years.</p>'
                                '<p>3. The Moon’s craters are a <u></u> of the space rocks that struck it.</p></div>')]}),
  ("task", {"label": "Part 4", "title": "Your turn",
            "body": ["In the crater lab, what happened when you blew on a crater? Write one sentence."], "lines": 2}),
  ("task", {"label": "Part 5", "title": "The Moon’s record book",
            "body": ["Draw the Moon’s face, covered in craters big and small. Draw one crater that a space rock made on top of another."],
            "blocks": [("draw", "My Moon")]}),
  ("family", ["Look at the Moon tonight with your family. Can you see dark patches and bright spots? Tell them how scientists think the Moon was born."]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "The Moon’s story",
            "blocks": [P("Use the words in the box to fill in the Moon’s story."),
                       ("html", '<div class="bank"><span>Mars</span><span>4.5 billion</span><span>debris</span><span>craters</span><span>wind</span><span>rain</span></div>'
                                '<div class="fillin"><p>Scientists think an object about the size of <u></u> crashed into the young Earth about <u></u> years ago.</p>'
                                '<p>The <u></u> from the crash came together to form our Moon.</p>'
                                '<p>Ever since, space rocks have struck the Moon and made <u></u>.</p>'
                                '<p>The Moon has no <u></u> or <u></u>, so its marks last.</p></div>')]}),
  ("task", {"label": "Part 2", "title": "Crater lab",
            "blocks": [P("Use the same pebble each time. Measure each crater across, in centimeters.")]}),
  ("table", {"head": ["Drop height", "Crater across (cm)", "What I noticed"], "rows": [
    ["20 cm", "", ""], ["40 cm", "", ""], ["60 cm", "", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "The pattern",
            "body": ["Finish the sentence: **When I dropped the pebble from higher up, the crater…**"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Two record books",
            "body": ["Earth has been struck by space rocks too, but you cannot see many craters. Use what you saw when you blew on a crater to explain why the Moon keeps its record and Earth does not."], "lines": 4}),
  ("task", {"label": "Part 5", "title": "A piece of the Moon",
            "body": ["The display case holds Adrar 013, a lunar meteorite weighing **3,150 grams** in all. There are 1,000 grams in a kilogram. Is that more or less than 3 kilograms? By how many grams?"], "lines": 1}),
  ("family", ["Look at the Moon tonight with your family. Tell them how scientists think it was born, and why its craters are still there."]),
])

RED = handout("red", "MOON_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Read the record",
            "blocks": [P("Scientists read craters like pages of a book. When one crater cuts into another, the one on top was made later. Look at the four craters."),
                       ("html", craters_svg())],
            "body": ["Write them in order, **oldest first**. Explain how you decided. Is there any pair you cannot order? Why?"], "lines": 4}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "A fair test",
            "blocks": [P("Question: <i>Does a pebble dropped from higher up make a bigger crater?</i> Test it, and record what you find."),
                       ("table", {"head": ["Drop height", "Crater across (cm)", "Did the cocoa spread farther?"], "rows": [
                         ["20 cm", "", ""], ["40 cm", "", ""], ["60 cm", "", ""]]})],
            "body": ["Name the one thing you changed and two things you kept the same. Then say what your measurements show."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Good model, real Moon",
            "body": ["Give one way the flour tray is like the Moon, and one way it is not. What can the model **not** show us?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "No one was there",
            "body": ["No one was there to watch the Moon form. How can scientists work out what probably happened billions of years ago? Why does the poster say *probably*?"], "lines": 3}),
  ("family", ["Look at the Moon tonight with your family. Explain why its craters are a record, and ask what record your own home keeps: marks on a door frame, a scratched table, worn steps."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
