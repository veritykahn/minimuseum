"""Grades 5–8 · Art · "An Artist's Impression"
Poster 2, Another Earth: its art (a violet-to-indigo night, lavender, pink
and aqua; flat cartoon planets; an alien landscape of purple cliffs and three
moons; the title in tall blocky letters) and its facts about HD 20794 d.
Students read how color, shape and lettering make a mood, sort what is known
of the planet from what an artist must imagine, and design an impression of
it with every choice labeled evidence or imagination.
Facts: app/exhibitions/moon/moon.ts (poster 2, its alt text and palette,
MOON_NOTES). The poster does not say its landscape shows HD 20794 d, and
this lesson never says so."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (MOONRISE, THREE_MOONS, RINGED, P2, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, review)

DIR = "teachers/grades-5-8/art/"
TITLE = "An Artist’s Impression"
SUB = "Grades 5–8 Art · Our Incredible Moon · Evidence and imagination"
HERO = {"img": THREE_MOONS, "pos": "center 30%"}

LANDSCAPE_ALT = "From the poster Another Earth: purple cliffs on either side, a large glowing aqua moon in the middle and two small moons in a violet sky"
RINGED_ALT = "From the poster Another Earth: a cartoon planet in aqua, blue and pink, wrapped in a band of pink"
MOONRISE_ALT = "From the poster Our Incredible Moon: the curve of a large lavender moon, its craters in soft shades of purple, against a violet night"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe how the poster’s artist uses color, shape and lettering to make a mood",
     "describe how the poster uses color, shape and lettering to make a mood?", False),
    ("tell what is known about HD 20794 d from evidence, and what an artist has to imagine",
     "tell what is known about HD 20794 d, and what an artist must imagine?", False),
    ("design an impression of a far planet with color, shape and composition chosen on purpose",
     "design an impression of a far planet, with every choice on purpose?", False),
    ("label every choice in a picture as evidence or imagination, and write a caption that does not mislead",
     "label your choices as evidence or imagination, in an honest caption?", True)],
  "why": "Many pictures of other worlds are imagined. Knowing how an artist builds one, and where the facts stop, lets you enjoy the picture and still know what is real."}

TALK = "If you could ask a scientist one question before you painted HD 20794 d, what would you ask?"

# the posters' palette, as the exhibition names it (moon.ts): the first four
# are the exhibition's own colors, the aqua is taken from the poster's moon
PALETTE = [("#2A2245", "Violet night"), ("#3B2C68", "Indigo"), ("#B9A6E6", "Lavender"),
           ("#F28BE8", "Pink"), ("#A4ECE8", "Aqua"), ("#FFFFFF", "White")]

# what the exhibition tells us about HD 20794 d
FACTS = [
  "a “super-Earth,” roughly **six times the mass** of Earth",
  "about **20 light-years** away, in the constellation **Eridanus**",
  "inside its star’s **habitable zone**, where temperatures **could** allow liquid water",
  "a year of about **647 days**, on a **stretched oval** orbit",
  "the orbit swings between the **inner and outer edges** of the habitable zone",
  "confirmed in **2025**, from more than **20 years of measurements**"]

# on the screen: the class decides; the answer notes give the key
CHART = {"caption": "A picture of HD 20794 d: which choices rest on evidence?",
         "columns": ["A choice in the picture", "Evidence or imagination?"],
         "rows": [{"cells": ["A planet heavier than Earth", "?"]},
                  {"cells": ["A pink sky", "?"]},
                  {"cells": ["A river of liquid water", "?"]},
                  {"cells": ["Purple cliffs", "?"]},
                  {"cells": ["The planet near the outer edge of the habitable zone", "?"]},
                  {"cells": ["Three moons in the sky", "?"]}]}

PAIR = [
  {"img": MOONRISE, "alt": MOONRISE_ALT, "label": "Our Incredible Moon", "fit": "cover", "pos": "center top"},
  {"img": RINGED, "alt": RINGED_ALT, "label": "Another Earth", "fit": "contain", "pos": "center"}]

CSS = BASE_CSS + """
.palette { display: flex; gap: 8pt; margin: 4pt 0 8pt; flex-wrap: wrap; }
.palette figure { margin: 0; text-align: center; width: 48pt; }
.palette span { display: block; width: 34pt; height: 34pt; margin: 0 auto 3pt; border-radius: 50%; border: .8pt solid #1d1c1a; }
.palette figcaption { font: 400 7.5pt/1.2 'Outfit'; }
.pics { display: grid; grid-template-columns: 1fr 3fr; gap: 8pt; margin: 4pt 0 2pt; break-inside: avoid; }
.pics img { width: 100%; height: 74pt; object-fit: cover; border-radius: 4pt; border: .8pt solid #1d1c1a; display: block; }
.pics.solo { grid-template-columns: 1fr; }
.facts { margin: 3pt 0 8pt 14pt; padding: 0; font-size: 9.6pt; line-height: 1.5; break-inside: avoid; }
.facts.two { columns: 2; column-gap: 22pt; font-size: 9.2pt; }
.facts.two li { break-inside: avoid; }
.sorter { width: 100%; border-collapse: collapse; font-size: 9.6pt; margin: 4pt 0 8pt; }
.sorter th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: center; border-bottom: 1pt solid var(--accent); padding: 3pt 4pt; }
.sorter th:first-child { text-align: left; }
.sorter td { border-bottom: .5pt solid #d8d0b8; padding: 5pt 4pt; vertical-align: middle; }
.sorter td.bx { width: 70pt; text-align: center; }
.sorter td.bx span { display: inline-block; width: 13pt; height: 13pt; border: 1pt solid #1d1c1a; border-radius: 2pt; background: rgba(255,255,255,.6); }
.blank { display: flex; gap: 10pt; margin: 4pt 0 8pt; }
.blank figure { margin: 0; text-align: center; width: 56pt; }
.blank span { display: block; width: 36pt; height: 36pt; margin: 0 auto 3pt; border-radius: 50%; border: .8pt dashed #7c796f; }
.blank figcaption { border-bottom: .8pt solid #a9a69b; height: 12pt; }
.circle { font: 500 9.5pt 'Outfit'; letter-spacing: .04em; margin: 2pt 0 6pt; }
.circle span { display: inline-block; margin-right: 12pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

def palette(swatches=PALETTE):
    return ("html", '<div class="palette">' + "".join(
        f'<figure><span style="background:{c}"></span><figcaption>{n}</figcaption></figure>' for c, n in swatches) + "</div>")

def facts_list(two=False):
    import re
    items = "".join("<li>" + re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", f) + "</li>" for f in FACTS)
    return ("html", f'<ul class="facts{" two" if two else ""}">{items}</ul>')

def pics(*imgs, solo=False):
    return ("html", f'<div class="pics{" solo" if solo else ""}">' + "".join(f'<img src="{i}" alt="">' for i in imgs) + "</div>"
            '<p class="pcredit"><b>Pictures</b> from the poster <i>Another Earth</i>, the Mini Museum</p>')

def sorter(rows, cols=("Evidence", "Imagination")):
    head = "<th>In a picture of HD 20794 d</th>" + "".join(f"<th>{c}</th>" for c in cols)
    body = "".join(f"<tr><td>{r}</td>" + "".join('<td class="bx"><span></span></td>' for _ in cols) + "</tr>" for r in rows)
    return ("html", f'<table class="sorter"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>')

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "an-artists-impression",
  "out": DIR + "MOON_LP_Art.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Art", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Look and teach", 12, "#2F4A5A"), ("Design", 23, "#86671A"), ("Share", 5, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the art of the poster *Another Earth*: a violet-to-indigo night, lavender, pink and aqua; flat cartoon planets; an alien landscape of purple cliffs and three moons; a title in tall blocky letters. They will see how color, shape and lettering make a mood. Then they will set the art beside the poster’s facts about the planet HD 20794 d, which give its mass, its distance, its year and the shape of its orbit, but not its color. A picture of such a world is an **artist’s impression**: part evidence, part imagination. Students design one, and say which part is which."]}),
    ("section", {"label": "Standards", "list": [
      "**Responding** — perceive and analyze an artwork; interpret its mood and meaning from color, shape and composition (VA:Re7, VA:Re8)",
      "**Creating** — generate an idea and develop it into a design, with choices made on purpose (VA:Cr1, VA:Cr2)",
      "**Connecting** — relate art to what we know: how pictures of science can inform or mislead (VA:Cn11)"]}),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: the poster’s pictures, its palette, and the facts",
      "Colored pencils or markers, with violet, pink and aqua if you have them; differentiated handouts, one per student"]}),
    ("section", {"label": "Cross-curricular and assessment notes", "body": [
      "**Science:** the Science lesson *Planet Hunters* shows how such planets are found. **Assessment:** the design and its labels, scored for choices made on purpose, at least one fact used correctly, and a caption that says what was imagined."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Where is this?",
      "screen": {"phase": "Hook", "show": "artwork", "work": "Another Earth",
                 "img": {"img": THREE_MOONS, "pos": "center 40%"}, "alt": LANDSCAPE_ALT,
                 "purpose": "Look before knowing: let the picture work, then ask where it came from.",
                 "students": ["What do you notice first?", "Where is this place? How could anyone know what it looks like?"]},
      "body": ["Show the landscape from the poster *Another Earth* for a full minute in silence. Ask: *“What do you notice first? Where is this?”* Take answers. Then: *“No one has ever been to a planet around another star. The poster says that with today’s technology, a trip to the planet HD 20794 d would take hundreds of thousands of years. So someone imagined this place. Today we ask how, and what an honest picture of another world would look like.”*"]}),
    ("section", {"label": "Look and teach · 12 minutes", "title": "Evidence and imagination",
      "screen": [
        {"phase": "Look and teach", "minutes": 4, "script": [0], "title": "Color, shape, lettering", "show": "pair", "items": PAIR,
         "purpose": "Name the artist’s choices and the mood they make.",
         "students": ["Name the colors. Which do both posters share?", "Are the shapes soft or sharp, simple or detailed?", "What mood do they make?"]},
        {"phase": "Look and teach", "minutes": 4, "script": [1], "title": "What we know", "show": "words",
         "text": P2["hd"] + " " + P2["orbit"], "cite": "Another Earth",
         "purpose": "Collect the evidence: what the poster says about HD 20794 d.",
         "students": ["List every fact about the planet.", "Which fact tells you its color?"]},
        {"phase": "Look and teach", "minutes": 4, "script": [2], "title": "Evidence or imagination?", "show": "chart", **CHART,
         "purpose": "Sort the choices in a picture of HD 20794 d.",
         "students": ["Which choices could a scientist back up?", "Which did the artist imagine?"]}],
      "body": [
        "**The look of the posters.** Show the moon from *Our Incredible Moon* and the ringed planet from *Another Earth*. The posters share a palette: a violet-to-indigo night, a lavender moon, white type, and on *Another Earth*, pink and aqua. The shapes are flat and simple, with smooth edges and soft shading. The title is set in tall blocky letters, pink above and white below. Ask what mood these choices make, and why an artist might choose a dreamy, cartoon style for worlds nobody has seen, rather than something that looks like a photograph.",
        "**What we know.** Read the poster’s facts about HD 20794 d and list them on the board (page 3). Then ask: *what color is it?* None of the facts says. The poster adds that such a planet *might lack the right atmosphere or have extreme temperatures*.",
        "**Evidence or imagination?** Name the term: an **artist’s impression** is a picture of something no one has seen, built from what is known and filled in with imagination. Fill in the chart together. Then show how scientists learn colors: the James Webb Space Telescope *reads the starlight that filters through a planet’s atmosphere, because different gases absorb different colors of light*. Colors read in starlight are evidence; colors in a painting, without such evidence, are imagination."]}),
    ("section", {"label": "Design · 23 minutes",
      "screen": {"phase": "Design", "show": "levels", "title": "Choose a handout",
                 "purpose": "Design an impression of HD 20794 d at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three end with a picture of your own, labeled evidence or imagination."]},
      "body": ["Students choose a handout. All three read the poster’s art, sort evidence from imagination, and design an impression of HD 20794 d with a caption."]}),
    ("levels", {
      "green": "Find the poster’s colors and name its mood. Sort six choices into evidence and imagination. Draw HD 20794 d with one fact and one imagined idea, labeled, and finish a caption.",
      "yellow": "Read the artist’s choices in a chart. Choose a palette for a mood. Design a landscape on HD 20794 d with three choices from evidence and three from imagination, and write the caption.",
      "red": "Judge whether the poster’s art makes the planet look more like home than the evidence allows. Show the planet at two points on its stretched orbit, and write an artist’s statement and an honest caption."}),
    ("cols", [
      [("section", {"label": "Share · 5 minutes",
        "screen": [
          {"phase": "Share", "minutes": 2, "script": [0], "title": "Gallery walk", "show": "question", "question": TALK,
           "purpose": "Read a classmate’s design: which choices are evidence, which imagination?",
           "students": ["Read a classmate’s caption.", "Point to one choice: evidence or imagination?"]},
          review(OBJECTIVES, 3, [1], hint=THUMBS, phase="Share")],
        "body": ["Lay the designs out as a gallery. Each student reads a classmate’s caption and points to one choice: evidence or imagination? Close with the question on the screen.",
                 "Ask the objectives back as questions: *“Can you now…?”* Students show a thumb up, sideways or down."]})],
      [("connection", ["**On the poster** *Another Earth*, find the ringed planet, the nebula and the landscape with three moons, then read the paragraph about HD 20794 d. Which parts of the poster are facts, and which are art?"])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The poster’s art, and the facts",
                 "body": ["Project or print this page for *Look and teach*. The pictures are cut from the posters themselves. The poster does not say which planet its landscape shows: read it as an imagined world."]}),
    ("html", f'<div class="pics"><img src="{RINGED}" alt="" style="height:96pt;object-fit:contain;background:#3B2C68"><img src="{THREE_MOONS}" alt="" style="height:96pt"></div>'
             f'<div class="pics solo" style="margin-top:8pt"><img src="{MOONRISE}" alt="" style="height:70pt;object-position:center top"></div>'
             '<p class="pcredit"><b>Pictures</b> from the posters <i>Another Earth</i> (top) and <i>Our Incredible Moon</i> (below), the Mini Museum</p>'),
    ("cols", [
      [("section", {"label": "The posters’ palette", "body": ["The exhibition names it: a violet-to-indigo night, a lavender moon, white type, and poster 2’s pink and aqua."]}),
       palette(),
       ("section", {"label": "What the poster says about HD 20794 d"}),
       facts_list()],
      [("section", {"label": "Answer notes", "list": [
        "**Heavier than Earth:** evidence; roughly six times Earth’s mass. How big it looks is still the artist’s choice.",
        "**A pink sky; purple cliffs; three moons:** imagination. The poster gives no colors, ground or moons for the planet.",
        "**A river of liquid water:** imagination, built on evidence. Temperatures *could* allow liquid water; no one knows that there is any.",
        "**Near the outer edge of the habitable zone:** evidence, for part of its year. The orbit swings between the inner and outer edges.",
        "**Red, the poster’s art:** any reasoned answer. Strong answers notice the soft colors and calm scene, and set them beside *might lack the right atmosphere or have extreme temperatures*."]})]]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["HD 20794 d is a “super-Earth” about 20 light-years away. The poster *Another Earth* tells us its mass, its year and the shape of its orbit. It does not tell us what the planet looks like. A picture of it is an **artist’s impression**: part evidence, part imagination. Today you make one."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 Art · Our Incredible Moon", "level": level, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 5–8 Art · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

CHOICES = ["It is about six times the mass of Earth.", "It has pink clouds.", "It takes about 647 days to circle its star.",
           "Its temperatures could allow liquid water.", "It has three moons.", "Its ground is purple rock."]

GREEN = handout("green", "MOON_Handout_Green_Art.pdf", [
  ("html", "<style>.drawbox { height: 200pt; }</style>"),
  ("task", {"label": "Part 1", "title": "Look at the artist’s choices",
            "blocks": [pics(RINGED, THREE_MOONS),
                       P("These pictures come from the poster. Circle every color you can find in them."),
                       ("html", '<p class="circle"><span>violet</span><span>pink</span><span>aqua</span><span>lavender</span><span>green</span><span>orange</span><span>white</span></p>'),
                       P("How does the picture make you feel? Circle one, or write your own word."),
                       ("html", '<p class="circle"><span>calm</span><span>strange</span><span>dreamy</span><span>scary</span><span>cheerful</span><span>______</span></p>')],
            "body": ["Which color or shape makes you feel that way?"], "lines": 1}),
  ("task", {"label": "Part 2", "title": "Evidence or imagination?",
            "blocks": [P("The poster tells us these facts about HD 20794 d:"), facts_list(True),
                       P("Now tick a box for each sentence. Is it from the <b>evidence</b>, or would an artist <b>imagine</b> it?"),
                       sorter(CHOICES)]}),
  ("task", {"label": "Part 3", "title": "Draw HD 20794 d",
            "blocks": [P("Draw a place on HD 20794 d. Use <b>one fact</b> from the poster and <b>one idea</b> you imagine. Write <b>E</b> beside the fact and <b>I</b> beside the idea."),
                       ("draw", "HD 20794 d")]}),
  ("task", {"label": "Part 4", "title": "Your caption",
            "blocks": [P("<b>My picture shows</b> ____________________. <b>The part from evidence is</b> ____________________."),
                       P("<b>The part I imagined is</b> ____________________, <b>because</b> ____________________.")]}),
  ("family", ["Show your family your picture. Ask them to guess which part is a fact and which part you imagined."]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_Art.pdf", [
  ("html", "<style>.drawbox { height: 180pt; }</style>"),
  ("task", {"label": "Part 1", "title": "Read the artist’s choices",
            "blocks": [pics(RINGED, THREE_MOONS),
                       ("table", {"head": ["Element", "What the artist chose", "The mood it makes"], "rows": [
                         ["**Color**", "", ""], ["**Shape**", "", ""], ["**Composition** (where things are placed)", "", ""]]})]}),
  ("task", {"label": "Part 2", "title": "The evidence bank",
            "blocks": [P("The poster tells us these facts about HD 20794 d. It also says such a planet <i>might lack the right atmosphere or have extreme temperatures</i>."), facts_list(True)],
            "body": ["Which two facts could you **show** in a picture? How?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Choose a palette",
            "blocks": [P("Choose a mood for your planet. Color four circles with your palette and name each color."),
                       ("html", '<div class="blank">' + '<figure><span></span><figcaption></figcaption></figure>' * 4 + "</div>")],
            "body": ["My mood is ______________. These colors make it because…"], "lines": 1}),
  ("task", {"label": "Part 4", "title": "Design a landscape on HD 20794 d",
            "blocks": [P("Include at least <b>three</b> choices from the evidence and <b>three</b> from imagination. Label each <b>E</b> or <b>I</b>."),
                       ("draw", "HD 20794 d")]}),
  ("task", {"label": "Part 5", "title": "Write the caption",
            "body": ["Write a caption a museum could print beside your picture. Say what it shows and which parts are imagined."], "lines": 3}),
  ("family", ["Find a picture of space with your family, in a book or online. Ask: is it a photograph, or an artist’s impression? How can you tell?"]),
])

RED = handout("red", "MOON_Handout_Red_Art.pdf", [
  ("task", {"label": "Part 1", "title": "Does the art go too far?",
            "blocks": [pics(THREE_MOONS, solo=True),
                       P("The poster says the discovery of HD 20794 d <i>“raises hopes of finding alien life.”</i> It also says such a planet <i>“might lack the right atmosphere or have extreme temperatures.”</i>")],
            "body": ["The poster pairs these words with a calm, colorful landscape. Does the art make another world look more like home than the evidence allows? Point to colors, shapes and composition."], "lines": 6}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Colors as evidence",
            "blocks": [P("<i>“" + P2["webb"] + "”</i>")],
            "body": ["What would scientists need to find before an artist could paint the sky of HD 20794 d truthfully?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Two places on a stretched orbit",
            "blocks": [P("HD 20794 d’s orbit is a stretched oval: over its 647-day year it swings between the inner and outer edges of its star’s habitable zone. Show the same place at both. Label every choice <b>E</b> (evidence) or <b>I</b> (imagination)."),
                       ("cols", [[("draw", "Near the inner edge")], [("draw", "Near the outer edge")]])]}),
  ("task", {"label": "Part 4", "title": "Artist’s statement and caption",
            "body": ["In your statement, explain your palette, your shapes and your composition, and the mood you wanted. Then write a museum caption that a viewer could not mistake for a photograph."], "lines": 6}),
  ("family", ["Ask your family: when a picture shows something no one has seen, should it say so? Why?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
