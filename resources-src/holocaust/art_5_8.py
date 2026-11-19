"""Grades 5–8 · Art · "How Do We Remember?"
Memorials as works of art: the memorials whose photographs the exhibition
shows (the Timeline of the Holocaust's "Look closer" spots in
timeline/stopMore.ts, the Walk's film pictures in walk/filmPictures.ts, and
the three Commons photographs in holocaust.ts), the Walk's own design and
what it is inspired by (walk/Walk.tsx), and Lay a Stone. Every fact about a
memorial is the exhibition's; no artist is named whom the exhibition does
not name, and no date is given that it does not give."""

import os, sys, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import (BERLIN, BIRKENAU, TL, WALK, EXH, OBJ_CSS, HANDOUT_CSS, PHOTO_CSS, STONE_CUSTOM,
                     LOOK_BACK_SAY, before_you_teach, look_back, timing, item, photo)

DIR = "teachers/grades-5-8/art/"
TITLE = "How Do We Remember?"
SUB = "Grades 5–8 · Art · Memorials as works of art"
HERO = BERLIN

# ── the memorials, as the exhibition shows and credits them ────────────
def cc(author, title, lic):
    return f"{author}, *{title}*. {lic}, via Wikimedia Commons"

M = {
  "berlin": {"img": BERLIN["img"], "name": "Memorial to the Murdered Jews of Europe", "where": "Berlin",
             "says": "Rows of plain grey concrete blocks of different heights on a cobbled ground.",
             "alt": "Rows of plain grey concrete blocks of different heights on cobbles", "aspect": 1.48, "credit": BERLIN["credit"]},
  "birkenau": {"img": BIRKENAU["img"], "name": "International Monument", "where": "Auschwitz II-Birkenau",
               "says": "Dark carved stone blocks beneath a tall stone slab.",
               "alt": "Dark carved stone blocks beneath a tall stone slab", "aspect": 1.33, "credit": BIRKENAU["credit"]},
  "treblinka": {"img": TL + "1942-03.webp", "name": "The field of memorial stones", "where": "Treblinka",
                "says": "Hundreds of rough stones stand where the camp was. Many carry the name of a town or city that victims came from.",
                "alt": "Hundreds of rough standing stones in a wide field, pine forest beyond", "aspect": 1.5,
                "credit": cc("Tajchman Maria", "Treblinka. Morze kamieni", "CC BY-SA 4.0")},
  "chelmno": {"img": TL + "1941-12-08.webp", "name": "Memorial to the victims of Chełmno", "where": "Rzuchów Forest",
              "says": "Carved figures of people run along its side. The word on the right, PAMIĘTAMY, is Polish for “We remember.” It was put up in 1964.",
              "alt": "A long concrete memorial at the end of a straight path in a forest clearing", "aspect": 1.51,
              "credit": cc("PaulinaŻabikowo", "LasRzuchowski-pomnik", "CC BY-SA 4.0")},
  "warsaw": {"img": TL + "1943-04-19.webp", "name": "Monument to the Ghetto Heroes", "where": "Warsaw",
             "says": "By the sculptor Natan Rapoport, where the ghetto stood; unveiled April 19, 1948. It shows the ghetto’s fighters: men, women and children.",
             "alt": "A tall dark stone monument with a relief of a group of people, a menorah on each side", "aspect": 1.33,
             "credit": cc("Cybularny", "2021 Warszawa Pomnik Bohaterów Getta, 1", "CC0")},
  "babyn": {"img": TL + "1941-09-29.webp", "name": "The menorah memorial", "where": "Babyn Yar, Kyiv",
            "says": "Put up on September 29, 1991, 50 years after the massacre: the first official recognition of the Jewish victims.",
            "alt": "A large dark metal menorah on wide stone steps in a sunny park, with wreaths of flowers", "aspect": 1.5,
            "credit": cc("Бондар Володимир (Volodymyr Bondar)", "Пам'ятний знак «Менора» у Бабиному Яру", "CC BY-SA 4.0")},
  "t4": {"img": TL + "1939-10.webp", "name": "The blue glass wall", "where": "Tiergartenstraße 4, Berlin",
         "says": "Part of the memorial to the victims of the Nazis’ “euthanasia” killings, where the program’s office stood.",
         "alt": "A long wall of see-through blue glass on a paved plaza, two visitors reading panels", "aspect": 1.5,
         "credit": cc("Drrcs15", "T4 Memorial", "CC BY-SA 4.0")},
  "library": {"img": WALK + "walk-36.webp", "name": "The empty library", "where": "Bebelplatz, Berlin",
              "says": "The book-burning memorial: a glass window in the cobblestones looks down into a white room lined with empty bookshelves.",
              "alt": "A square glass window in grey cobblestones, looking down into a room of empty white shelves", "aspect": 1.5,
              "credit": cc("חזרתי", "The empty library: the book-burning memorial on Bebelplatz, Berlin", "CC BY-SA 3.0")},
  "pinkas": {"img": WALK + "walk-55.webp", "name": "Names on the walls", "where": "Pinkas Synagogue, Prague",
             "says": "A wall covered edge to edge with tiny hand-lettered names and dates, far too many to read.",
             "alt": "A wall covered with tiny hand-lettered names and dates in black and red", "aspect": 1.5,
             "credit": cc("Richard Mortel from Riyadh, Saudi Arabia", "Names on the walls of the Pinkas Synagogue, Prague", "CC BY 2.0")},
}
STONES_ROOM = EXH + "rooms/stones.webp"
HEINE = "“Where they burn books, in the end they will burn people too.”"
HEINE_CITE = "Heinrich Heine, a German Jewish poet, in his play *Almansor*, 1821, as the Walk’s film quotes him"
NAMES_LINE = "Yad Vashem has found the names of five million of the six million Jews. About one million still have no name."
WALK_NOTE = ("This walk is inspired by Menashe Kadishman’s *Fallen Leaves*, at the Jewish Museum Berlin, and by the *Shoes on the Danube Bank* in Budapest. "
             "The floor is covered with iron faces, each one different, too many to count. They stand for the people who died in the Holocaust. "
             "Among them lie empty iron shoes, for the men, women and children who never came home.")

def mi(k, sub=None):
    m = M[k]
    return item(m["img"], m["name"], sub or m["where"], m["alt"], m["aspect"])

# ── lesson mode ────────────────────────────────────────────────────────
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe a memorial by its material, shape, scale and words, and say what each choice makes a visitor feel or do",
     "describe a memorial by material, shape, scale and words?", False),
    ("compare two memorials that remember in different ways",
     "compare two memorials that remember in different ways?", False),
    ("design a memorial and explain its choices in an artist’s statement",
     "design a memorial and explain your choices?", False),
    ("explain how a memorial’s choices decide who is remembered, and how",
     "explain how a memorial decides who is remembered?", True)],
  "why": "A memorial is a work of art with a duty: to remember real people truthfully. Looking closely at how artists have met that duty shows us how remembering works."}

FOUR = {"caption": "Four questions to ask of any memorial",
        "columns": ["Ask", "For example, in the exhibition"],
        "rows": [{"cells": ["Material. What is it made of, and why?", "Rough stones at Treblinka; blue glass in Berlin; iron in the Walk"]},
                 {"cells": ["Shape and scale. How big? How many parts?", "Hundreds of stones; rows of concrete blocks of different heights"]},
                 {"cells": ["Words. Does it name, explain, or stay silent?", "PAMIĘTAMY, “We remember”; the walls of names in Prague"]},
                 {"cells": ["The visitor. What does it ask you to do?", "Walk among it; look down through glass; lay a stone"]}]}

# ── lesson plan ────────────────────────────────────────────────────────
PLAN_CSS = PHOTO_CSS + """
.hero { height: 1.95in; }
.sec { margin-bottom: 8pt; }
table.mem { width: 100%; border-collapse: collapse; font-size: 8.2pt; margin: 4pt 0 8pt; }
table.mem th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.mem td { border-bottom: .6pt solid #c8c5bb; padding: 3pt 8pt 3pt 0; vertical-align: top; line-height: 1.3; }
table.mem td:first-child { font-weight: 500; width: 25%; }
table.mem td.cr { font-size: 6.6pt; color: #5F6655; width: 27%; }
"""

ORDER = ["berlin", "birkenau", "treblinka", "chelmno", "warsaw", "babyn", "t4", "library", "pinkas"]

def mem_table():
    rows = "".join(f'<tr><td>{M[k]["name"]}<br><span style="font-weight:400;color:#5F6655">{M[k]["where"]}</span></td>'
                   f'<td>{html.escape(M[k]["says"])}</td><td class="cr">{ital(M[k]["credit"])}</td></tr>' for k in ORDER)
    return ('<table class="mem"><thead><tr><th>Memorial</th><th>What the exhibition tells us</th><th>Photograph</th></tr></thead>'
            f"<tbody>{rows}</tbody></table>")

def ital(s):
    import re
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", html.escape(s))

LESSON = {
  "slug": "how-do-we-remember",
  "out": DIR + "HOL_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": OBJ_CSS + PLAN_CSS,
  "blocks": [
    timing(5, 13, 20, 7),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will look closely at the memorials whose photographs the exhibition shows — in Berlin, Treblinka, the Rzuchów Forest, Warsaw, Kyiv and Prague — and at the exhibition’s own Walk and memorial stone. They will describe each by its **material, shape and scale, words** and what it asks of **the visitor**, compare two, and design a memorial of their own with a short **artist’s statement**."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Responding** — describing and interpreting works of art by their materials, forms and context",
      "**Creating** — planning a work from a concept, and explaining choices in an artist’s statement",
      "**Connecting** — how art carries a community’s memory; public art and its audience"]}),
    ("section", {"label": "Materials needed", "list": [
      "*The memorials in this lesson* on page 3, projected; drawing pencils",
      "Differentiated handouts, one per student"]}),
    before_you_teach("In students’ designs, no barbed wire, camp buildings, yellow stars or swastikas as decoration: a memorial remembers people, not their persecutors’ symbols."),
    ("section", {"label": "Hook · 5 minutes", "title": "What is this place?",
      "screen": {"phase": "Hook", "show": "image", "img": BERLIN, "alt": M["berlin"]["alt"],
                 "caption": "Berlin",
                 "purpose": "Look before knowing: let the form speak first.",
                 "students": ["What do you notice?", "How might it feel to walk between these blocks?", "What might this place be for?"]},
      "body": ["Project the photograph with no title. *“What do you notice? How might it feel to walk between these blocks? What might this place be for?”* Take ideas. Then name it: the **Memorial to the Murdered Jews of Europe**, in Berlin. Ask: *it has no names and no pictures — how does it remember?*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Many ways to remember",
      "screen": [
        {"phase": "Teach", "minutes": 6, "script": [0], "title": "Six memorials", "show": "gallery",
         "groups": [{"label": "Memorials in the exhibition’s photographs", "items": [mi(k) for k in ["treblinka", "chelmno", "warsaw", "babyn", "t4", "library"]]}],
         "purpose": "See that each memorial remembers in its own way.",
         "students": ["What is each one made of?", "Which uses words? Which uses none?", "Which would you most want to stand beside?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Four questions", "show": "chart", **FOUR,
         "purpose": "Learn four questions to ask of any memorial.",
         "students": ["Ask the four questions of one memorial."]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Names, and stones", "show": "gallery",
         "groups": [{"label": "Memorials that ask something of the visitor",
                     "items": [mi("pinkas"), item(STONES_ROOM, "Lay a Stone", "In the exhibition", "Stones laid along the ledge of a granite memorial in a dark room", 1.6)]}],
         "purpose": "See how a memorial can name, and can invite the visitor to take part.",
         "students": ["Why write every name you can?", "Why does a stone last where flowers fade?"]}],
      "body": [
        "Show six memorials (page 3), one at a time, and read what the exhibition tells us of each: the **field of stones** at Treblinka, many carrying a town’s name; the long memorial in the **Rzuchów Forest**, whose word PAMIĘTAMY means “We remember”; Natan Rapoport’s **Monument to the Ghetto Heroes**, unveiled in Warsaw on April 19, 1948; the **menorah** at Babyn Yar; the **blue glass wall** at Tiergartenstraße 4; and the **empty library** under the cobbles of Bebelplatz, which recalls the book burnings.",
        "Give the four questions: **material; shape and scale; words; the visitor.** Practice them together on one memorial.",
        "Close with two memorials that ask something of us. In Prague, the names of the murdered cover the synagogue’s walls; the exhibition notes that Yad Vashem has found five million of the six million names. And: *" + STONE_CUSTOM + "* The exhibition’s own **Walk** is inspired by Menashe Kadishman’s *Fallen Leaves* and the *Shoes on the Danube Bank*."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Look, compare and design at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Every level ends with a memorial of your own design."]},
      "body": ["Students choose a handout. Every level ends with a design sketch and a short statement."]}),
    ("levels", {
      "green": "Look closely at three memorials with *I see / I think / I wonder*, then design a remembrance stone for the classroom, choosing its material, shape and one word, with a sentence frame for the statement.",
      "yellow": "Compare two memorials with the four questions, then sketch a memorial and write a 50–70 word artist’s statement.",
      "red": "Weigh two hard choices — names or no names, and who a memorial includes (Babyn Yar, 1976 and 1991) — then propose a memorial with a statement that defends its choices."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "A gallery of designs",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Gallery walk", "show": "question",
         "question": "Walk the gallery in silence. Leave a note by one design: what does it ask the visitor to do?",
         "purpose": "Look at each other’s designs as visitors would.",
         "students": ["Walk in silence.", "Leave one note: what does this design ask the visitor to do?"]},
        look_back("Debrief", 3, [1], OBJECTIVES)],
      "body": ["Lay the designs out as a gallery. Students walk in silence and leave one note by a design: *what does it ask the visitor to do?* Read two notes aloud.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Babyn Yar (Red):** the first official monument, in 1976, honored “Soviet citizens and POWs” and did not mention Jews; the menorah of 1991 was the first official recognition of the Jewish victims. A memorial can leave people out.",
      "**A design is complete** when its statement names whom it remembers, and explains one choice each of material, shape and words. Check it uses none of the symbols named above."]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The memorials in this lesson",
      "body": ["Each memorial, with only what the exhibition tells us of it, and its photograph’s credit as the exhibition gives it."]}),
    ("html", mem_table()),
    ("section", {"label": "Art framework", "title": "Teaching memorials with care",
      "body": [
        "**Form carries meaning.** A memorial’s choices — rough stone or glass, one figure or many, a name or a silence — are how it remembers. Ask students to say what each choice does, not only what it looks like.",
        "**Respond, don’t re-enact.** Students design *for* the people remembered; no task asks them to picture themselves as victims. The Walk’s film quotes Heinrich Heine: *" + HEINE + "* — the memorial at Bebelplatz remembers the book burnings without showing a flame."]}),
    ("connection", ["**Visit the exhibition:** walk *The Walk*, where the iron faces and empty shoes sound under your feet, and *Lay a Stone* on the memorial stone. Open *Look closer* on the timeline to read more about each memorial here."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["A memorial is a work of art made to remember real people. Around the world, artists have made memorials to the six million Jews and the other victims of the Holocaust. Each one remembers in its own way."]

HCSS = PHOTO_CSS + """
.photos3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 6pt; break-inside: avoid; }
.photos3 .photo img { height: 86pt; }
.sketch { border: 1pt dashed #8a837c; border-radius: 4pt; background: rgba(255,255,255,.5); height: 200pt; margin: 4pt 0 8pt;
  font: 500 6.8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #8a837c; padding: 6pt 8pt; }
table.v { width: 100%; border-collapse: collapse; margin: 2pt 0 8pt; font-size: 8.6pt; }
table.v th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.v td { border-bottom: .6pt solid #9d978f; height: 36pt; padding: 3pt 6pt 3pt 0; vertical-align: top; }
table.v td:first-child { width: 24%; font-weight: 500; }
table.v.snug td { height: 25pt; }
.photos.short .photo img { height: 86pt; }
table.v.roomy td { height: 43pt; }
.sketch.mid { height: 140pt; }
.sketch.low { height: 120pt; }
.choose { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6pt; margin: 4pt 0 6pt; font-size: 8.4pt; line-height: 1.35; }
.choose p { margin: 0; background: rgba(255,255,255,.55); padding: 5pt 7pt; border-top: 2pt solid var(--accent); }
.choose b { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #605A56; margin-bottom: 2pt; }
"""

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Art", "level": level, "context": CONTEXT,
            "foot": f"Handout · Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HANDOUT_CSS + HCSS}

def ph(k, cls="photo", says=True):
    m = M[k]
    text = f' {html.escape(m["says"])}' if says else ""
    return photo(m["img"], f'<b>{m["name"]}</b>, {m["where"]}.{text}', ital(m["credit"]), cls)

def table(head, rows):
    h = "".join(f"<th>{x}</th>" for x in head)
    return f'<table class="v"><thead><tr>{h}</tr></thead><tbody>' + "".join(
        "<tr>" + f"<td>{r}</td>" + "<td></td>" * (len(head) - 1) + "</tr>" for r in rows) + "</tbody></table>"

SKETCH = '<div class="sketch">Sketch</div>'

GREEN = handout("green", "HOL_Handout_Green_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Look closely",
            "blocks": [("html", "<p>Look at each memorial for one minute before you write.</p>"
                        + '<div class="photos3">' + ph("treblinka") + ph("chelmno") + ph("library") + "</div>"
                        + table(["Memorial", "I see…", "I think…", "I wonder…"], ["Treblinka", "Rzuchów Forest", "Bebelplatz, Berlin"]).replace('class="v"', 'class="v roomy"'))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Design a remembrance stone",
            "blocks": [("html", "<p>Design a stone for a remembrance corner in your classroom. Circle one choice in each box, then sketch it.</p>"
                        '<div class="choose"><p><b>Material</b>rough stone · smooth stone · glass · wood</p>'
                        '<p><b>Shape</b>tall · low and wide · round · many small pieces</p>'
                        '<p><b>One word on it</b>Remember · Never forget · a word of your own</p></div>' + SKETCH)]}),
  ("task", {"label": "Part 3", "title": "Your artist’s statement",
            "body": ["Finish the sentences. **My stone remembers** … **I chose** (material) **because** … **I hope visitors will** …"], "lines": 6}),
  ("connection", ["In the exhibition, *Lay a Stone* lets you lay a stone on a memorial. Many Jewish visitors place a small stone on a grave or memorial. Why might a stone last better than flowers?"]),
])

YELLOW = handout("yellow", "HOL_Handout_Yellow_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Two ways to remember",
            "blocks": [("html", '<div class="photos">' + ph("berlin") + ph("pinkas") + "</div>"
                        + table(["Ask", "Berlin", "Prague"], ["Material", "Shape and scale", "Words", "The visitor: what does it ask you to do?"]).replace('class="v"', 'class="v roomy"'))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Compare",
            "body": ["One memorial has no names at all. The other is covered with names. What does each choice make a visitor feel or think?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Design a memorial",
            "blocks": [("html", "<p>Design a memorial to the people of the Holocaust, for a park in your town. Decide its material, shape and scale, any words, and what it asks a visitor to do. Label your sketch.</p>" + SKETCH.replace('"sketch"', '"sketch mid"'))]}),
  ("task", {"label": "Part 4", "title": "Artist’s statement",
            "body": ["In 50–70 words: whom does it remember, and why did you choose its material, its shape and its words?"], "lines": 6}),
  ("connection", ["In the exhibition, *The Walk* is inspired by two memorials: Menashe Kadishman’s *Fallen Leaves* and the *Shoes on the Danube Bank*. Walk it. What does it ask you to do?"]),
])

RED = handout("red", "HOL_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Names, or no names?",
            "blocks": [("html", '<div class="photos">' + ph("berlin") + ph("pinkas") + "</div>"
                        f"<p>The Walk’s film says: <i>“{NAMES_LINE}”</i></p>")],
            "body": ["Should a memorial name the people it remembers? What can a memorial with no names do that a wall of names cannot, and the other way round?"], "lines": 4}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Who is remembered?",
            "blocks": [("html", '<div class="photos short">' + ph("babyn", says=False) +
                        "<p style='font-size:9pt;line-height:1.45;margin:0'>At Babyn Yar, a ravine in Kyiv, German SS and police units and their helpers carried out one of the largest massacres of the war, in September 1941. "
                        "The first official monument there, in 1976, honored “Soviet citizens and POWs” and <b>did not mention Jews</b>. "
                        "The menorah went up on September 29, 1991, 50 years after the massacre: the first official recognition of the Jewish victims.</p></div>")],
            "body": ["What can a memorial’s words, or silence, do to the memory of the people it is for? Why might it take 50 years to put that right?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Propose and defend a memorial",
            "blocks": [("html", "<p>Propose a memorial to the people of the Holocaust. Decide <b>whom</b> it names or leaves unnamed, its material, shape and scale, its words, and what it asks of a visitor. Label your sketch.</p>" + SKETCH.replace('"sketch"', '"sketch low"')
                        + "<p>Then write an artist’s statement that <b>defends your two hardest choices</b>, using Parts 1 and 2.</p>")], "lines": 5}),
  ("connection", ["On the exhibition’s timeline, open *Look closer* on September 29, 1941. What does the memorial choose to show?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
