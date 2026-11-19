"""The two adult guides for Our Incredible Moon: the Quick Teaching Guide and
the teacher sheet on the Green / Yellow / Red handouts, on the pattern of
in-their-hands/guides.py (its layout helpers and styles are copied here, so
each exhibition prints on its own). Facts follow app/exhibitions/moon/moon.ts
(both posters, their added panels and notes, the display case) and
app/exhibitions/moon/microscope/ (slides.ts, practice.ts)."""

import html, re
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import SLIDES, MOONRISE, THREE_MOONS, RINGED, BASE_CSS, photo_credits

RESOURCES = "minimuseumproject.org/exhibitions/moon/resources"

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

# ── layout helpers and styles, as In Their Hands has them ──────────────

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

def asks(groups):
    """Guided questions, stop by stop: a picture (round for a slide), a name, a short list."""
    out = ""
    for label, stops in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for img, title, ref, qs in stops:
            pic = (f'<img src="{img[0]}" alt="" class="{img[1]}" style="object-position:{img[2]}">' if img
                   else '<span class="noimg"></span>')
            out += (f'<div class="ask">{pic}<div><h4>{md(title)}</h4>'
                    f'<p class="aref">{md(ref)}</p><ul>' + "".join(f"<li>{md(q)}</li>" for q in qs) + "</ul></div></div>")
        out += "</div>"
    return out

def subjects(items):
    return '<div class="subj">' + "".join(
        f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"

def myths(items):
    return '<div class="myths">' + "".join(
        f'<div><p class="m"><span>Misconception</span>{md(a)}</p><p class="r"><span>In the exhibition</span>{md(b)}</p></div>'
        for a, b in items) + "</div>"

GUIDE_CSS = BASE_CSS + """
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
.ask { display: grid; grid-template-columns: 44pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask img { width: 44pt; height: 44pt; object-fit: cover; border: .6pt solid #1d1c1a; border-radius: 3pt; }
.ask img.round { border-radius: 50%; }
.ask .noimg { width: 44pt; height: 44pt; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #d9cdf3, #8f7bc4 70%); border: .6pt solid #1d1c1a; }
.ask h4 { font-size: 12pt; margin: 0; }
.ask .aref { font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin: 0 0 2pt; }
.ask ul { margin: 0; font-size: 9pt; line-height: 1.38; } .ask li { margin-bottom: 1pt; }
.subj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt 14pt; margin: 4pt 0 12pt; }
.subj > div { border-top: 1.2pt solid var(--accent); padding-top: 5pt; font-size: 9pt; break-inside: avoid; }
.subj h4 { margin-bottom: 2pt; }
.myths { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin: 4pt 0 12pt; }
.myths > div { font-size: 9pt; break-inside: avoid; }
.myths span { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 1pt; }
.myths .m { font: 500 12pt/1.2 'Cormorant Garamond', serif; border-bottom: .6pt solid #c8c5bb; padding-bottom: 5pt; margin-bottom: 5pt; }
.myths .m span { color: #A8452F; }
.myths .r span { color: #4A7346; }
.hero { height: 2.05in; margin-bottom: 11pt; }
.gallery { padding: 12pt 14pt 6pt; margin: 4pt 0 4pt; }
.gallery .glab { margin: 4pt 0 5pt; }
.grow { gap: 6pt; margin-bottom: 7pt; }
.grow img { width: 66pt; height: 66pt; object-fit: cover; border-radius: 50%; border: 1pt solid #e4dcc7; }
.grow figcaption { font-size: 7.3pt; }
"""

ORDER = ["moon-soil", "moon-beads", "moon-glass", "earth-wind", "earth-water", "earth-life"]

def slide(k):
    return (SLIDES[k]["img"], "round", "center")

QUESTIONS = [
  ("Poster 1 · Our Incredible Moon", [
    ((MOONRISE, "", "center top"), "The Moon and the Earth", "Tides and tilt",
     ["The Moon’s gravity helps control our tides and steady Earth’s tilt. What might change on Earth without it?"]),
    ((MOONRISE, "", "30% 60%"), "A giant crash", "Theia · about 4.5 billion years ago",
     ["No one was there to watch the Moon form. How can scientists work out what probably happened billions of years ago?",
      "Why is the Moon’s cratered face called a *record*?"]),
    (None, "“The Eagle has landed.”", "Apollo 11 · July 20, 1969",
     ["Some people have questioned whether the Moon landings were real. Which evidence on the poster could you still check today?"]),
    (slide("moon-beads"), "Moon dust", "Lunar regolith",
     ["Earth’s soil is shaped by wind, water and living things. What shapes Moon dust, and how does that change its grains?",
      "Why will the astronauts’ footprints probably last for millions of years?"]),
  ]),
  ("Poster 2 · Another Earth", [
    ((THREE_MOONS, "", "center"), "A planet you can’t see", "Dips and wobbles",
     ["Astronomers often find planets from the clues they leave rather than by seeing them. What else do we know about only from its clues?"]),
    ((RINGED, "", "center"), "HD 20794 d", "A super-Earth, about 20 light-years away",
     ["It is roughly six times Earth’s mass, and temperatures there *could* allow liquid water. What would you want to know before calling it another Earth?"]),
    (None, "“Where is everybody?”", "The Fermi Paradox · 1950",
     ["The poster calls the Dark Forest idea a *theory*; its note calls it an untested hypothesis. What is the difference?"]),
    (None, "The long journey", "Hundreds of thousands of years",
     ["If scientists found a planet very like Earth, would you want people to try to travel there one day? What would you want to know before deciding?"]),
  ]),
  ("Under the Microscope and the display case", [
    (slide("moon-glass"), "Apollo 17 orange glass", "20 to 45 microns across",
     ["These are the finest particles ever brought back from the Moon. How could you show the class how small they are?"]),
    (slide("earth-wind"), "Three sands from Earth", "Wind, water and living things",
     ["Which force shaped each sand? Which clue gave it away: round grains, smooth glassy grains, or pieces of shell?"]),
    (slide("moon-soil"), "Far-side Moon soil", "Chang’e 6 · 2024",
     ["These are the first samples ever brought back from the far side, the side we never see from Earth. What would you look for first?"]),
    (None, "Lunar meteorite, Adrar 013", "The display case",
     ["The case holds a genuine piece of the Moon that reached Earth as a meteorite. What can you learn from holding the real thing that a photograph cannot give?"]),
  ]),
]

GUIDE = {
  "out": "MOON_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Our Incredible Moon",
  "sub": "And Beyond · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": THREE_MOONS, "pos": "center 40%"},
  "blocks": [
    ("chips", ["Two posters", "Under the Microscope", "A display case", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "From our Moon to another Earth", "body": [
      "**Our Incredible Moon** tells the Moon’s story: its gravity helps control our tides and steady Earth’s tilt; it was probably born in a giant crash, when an object about the size of Mars, nicknamed Theia, struck the young Earth about 4.5 billion years ago; its cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years. It sets out the evidence that Apollo 11 landed on July 20, 1969, and explains why Moon dust, formed by meteorite impacts, is so unlike Earth’s soil.",
      "**Another Earth** goes beyond the Moon. Astronomers find planets around other stars from the clues they leave: a dip in a star’s light, or a star’s wobble. More than 6,000 have been confirmed, among them HD 20794 d, a “super-Earth” about 20 light-years away. The poster then asks the Fermi Paradox, *where is everybody?*, and weighs how hard such a journey would be.",
      "**The core message:** much of what we know about the Moon and the stars comes from evidence we can test, and an honest scientist says which ideas have evidence and which do not yet."]}),
    ("gallery", [
      {"label": "Under the Microscope · from the Moon", "items": [{"img": SLIDES[k]["img"], "cap": SLIDES[k]["name"]} for k in ORDER[:3]]},
      {"label": "Under the Microscope · from Earth", "items": [{"img": SLIDES[k]["img"], "cap": SLIDES[k]["name"]} for k in ORDER[3:]]}]),
    photo_credits(ORDER),
    ("section", {"label": "Around the posters", "title": "A microscope and a case", "list": [
      "**Under the Microscope** — wipe a slide, place a sample, focus with the lowest-power lens first, then magnify. A 10× eyepiece with 4×, 10× and 40× lenses gives up to 400×. Moon soil and Moon glass sit beside sands shaped by wind, water and living things.",
      "**The display case** — a genuine lunar meteorite, Adrar 013, with global sand and geology specimens and laboratory microscopes",
      "**Sounds** — the posters play sounds from their moments: *“The Eagle has landed,”* a giant crash, Kepler’s launch, a beep for Voyager 1, static from space"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["The Moon in our sky, and people who walked on it", "Footprints that stay, because the Moon has no wind or rain", "Looking closely: sand from Earth, dust from the Moon"],
                  "the Apollo 11 landing, the footprints and *Under the Microscope*.",
                  "press a footprint into a tray of sand and ask *what would wipe it away?*")),
      ("Grades 3–4", (["The giant crash and the Moon’s record of craters", "Why Moon dust is sharp and jagged", "A real piece of the Moon: the lunar meteorite"],
                  "the Theia panel, the craters and the display case.",
                  "ask *no one was there; how could we know?*")),
      ("Grades 5–6", (["Finding planets from clues: dips and wobbles", "Evidence for the Moon landings", "Big numbers: distances, speeds, temperatures"],
                  "Apollo 11 and its evidence, then HD 20794 d.",
                  "ask *how do you find a planet you can’t see?*")),
      ("Grades 7–8", (["Claims, evidence and untested ideas: the Dark Forest note", "Habitable zones and a stretched orbit", "Scale: 20 light-years, and Voyager’s light-day"],
                  "HD 20794 d, the Fermi Paradox and the journey.",
                  "*what would it take to call a planet another Earth?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "*Another Earth* talks about civilizations that might destroy themselves through wars or disasters, and about germs from other planets. For PreK–4, let the Moon poster, *Under the Microscope* and the display case carry the visit. If alien germs come up, the exhibition’s own note helps: scientists have not yet found any life beyond Earth, germs included."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "What is one question you would most like to ask about the Moon, and how might you find the answer?",
        "Which piece of evidence for the Moon landings convinced you most?",
        "Would you want to travel to another Earth one day?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Keep a Moon diary for a week",
        "Look at sand from home under a magnifying glass: what shaped it?",
        "Model a transit with a lamp and a ball, and watch the light dip"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, stop by stop", "body": [
      "Ask one, wait, and let students look before anyone answers, in front of the poster or with it on screen."]}),
    ("html", asks(QUESTIONS)),
    ("cols", [
      [("section", {"label": "At the microscope", "list": [
        "Why do scientists focus with the lowest-power lens first?",
        "The stronger the lens, the smaller the part of the slide you see. How do you find your way around?"]})],
      [("section", {"label": "At the display case", "list": [
        "What is the difference between a lunar meteorite and an Apollo sample?",
        "Why might a scientist compare sands from all over the world?"]})]]),

    ("pagebreak", None),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Science", "Tides and tilt; the giant crash; craters as a record; regolith and Earth’s soil; transits and wobbles; habitable zones; Webb reading starlight."),
      ("Math", "238,855 miles to the Moon; 1.5 inches a year of drift; Voyager at nearly 38,000 mph; 7,300 light-days; 260°F to −280°F; 10× by 40× is 400×."),
      ("ELA", "The poster’s Apollo 11 paragraph as an argument: claim, counterclaim, evidence and conclusion. *Theory* or *hypothesis*: words that matter."),
      ("Art", "The posters’ palette, flat cartoon planets and tall blocky lettering; the artist’s impression of a world no one has seen."),
      ("Social Studies", "Apollo 11 and Armstrong’s words; China’s Chang’e 6 and the far side; Artemis II, with a Canadian astronaut, in April 2026."),
      ("Engineering", "Prisms on the Moon and lasers from Earth; Kepler and Webb; the dangers of radiation and space dust for travelers.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“The far side of the Moon is always dark.”", "It gets just as much sunlight. We always see the same side because the Moon spins exactly once each time it circles Earth."),
      ("“Astronomers see planets around other stars.”", "Planets are hidden in their stars’ glare, so astronomers usually hunt for clues: a dip in a star’s light, or a star’s wobble."),
      ("“Scientists have found alien germs.”", "Scientists have not yet found any life beyond Earth, germs included. To be safe, NASA practices *planetary protection*.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one fact from the exhibition and the evidence for it*",
        "**Think-pair-share:** *why does Moon dust look so different from beach sand?*",
        "**Quick write:** *is HD 20794 d another Earth? What do we know, and what is missing?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A museum label for one microscope slide: what it is, where it came from, what shaped it",
        "A scale model of the Earth and the Moon",
        "An artist’s impression of HD 20794 d, with an honest caption"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*Footprints on the Moon*), Grades 1–2 (*What Made This Sand?*) and Grades 3–4 (*The Moon’s Record Book*), and for Grades 5–8 in four subjects: Science (*Planet Hunters*), ELA (*Weighing the Evidence*), Math (*How Far Is Far?*) and Art (*An Artist’s Impression*). Each comes with three student handouts, **Green** (more support), **Yellow** (grade level) and **Red** (go deeper), and students choose their own. All three levels work from the same panels, so the class can talk together afterward whatever each student chose. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** both posters and *Under the Microscope* are online at minimuseumproject.org/exhibitions/moon, and every plan and handout is at {RESOURCES}. Even ten minutes with one panel and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Match each clue to what it tells us, circle the dips on a practice light curve and count the days between them, and fill in a card about HD 20794 d from a word bank."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Explain both methods, read a light curve to find a planet’s year, compare HD 20794 d’s year with Earth’s, and weigh the claim *HD 20794 d is another Earth*."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Untangle a light curve with two planets in it, use Kepler’s estimate, and judge the claim, naming the evidence for, against and still missing.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Planet Hunters</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · Our Incredible Moon",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": MOONRISE, "pos": "center 25%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic, not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Science lesson, *Planet Hunters*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts, the same panels and the same evidence, but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home."]}),
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
      f"Every Our Incredible Moon lesson plan (PreK–K, Grades 1–2, Grades 3–4, and Science, ELA, Math and Art for Grades 5–8) has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
