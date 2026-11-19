"""The two adult guides for Victorian Britain: the Quick Teaching Guide and
the teacher sheet on the Green / Yellow / Red handouts. Facts follow the
two posters (app/exhibitions/victorian/victorian.ts) and the three rooms'
text files. The handouts sheet adapts the Mini Museum's existing "Using
Differentiated Student Handouts" teacher guide, as In Their Hands does."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403


ROOMS = [(V + "rooms/christmas-card.webp", "Christmas Card Maker", "Design and print a Victorian Christmas card"),
         (V + "rooms/inventions.webp", "Inventions Workshop", "The railway, the telegraph and photography, hands on"),
         (V + "rooms/christmas-parlour.webp", "Dickens’ Christmas Parlour", "Open the parts of a Victorian Christmas")]


def rooms_row():
    figs = "".join(f'<figure><img src="{pic(p)}" alt=""><figcaption><b>{n}</b>{s}</figcaption></figure>' for p, n, s in ROOMS)
    return f'<div class="row" style="--n:3">{figs}</div>'


def bands(items):
    out = ""
    for name, (focus, lead, before) in items:
        body = ('<ul>' + "".join(f"<li>{md(i)}</li>" for i in focus) + "</ul>"
                f'<p class="bp"><span>Lead with</span> {md(lead)}</p>'
                f'<p class="bp"><span>Before you go</span> {md(before)}</p>')
        out += f'<div class="band"><h4>{md(name)}</h4>{body}</div>'
    return f'<div class="bands">{out}</div>'


def asks(groups):
    out = ""
    for label, items in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for title, ref, qs in items:
            out += (f'<div class="ask"><div><h4>{md(title)}</h4><p class="aref">{md(ref)}</p><ul>'
                    + "".join(f"<li>{md(q)}</li>" for q in qs) + "</ul></div></div>")
        out += "</div>"
    return out


def subjects(items):
    return '<div class="subj">' + "".join(f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"


def myths(items):
    return '<div class="myths">' + "".join(
        f'<div><p class="m"><span>Misconception</span>{md(a)}</p><p class="r"><span>In the exhibition</span>{md(b)}</p></div>'
        for a, b in items) + "</div>"


GUIDE_CSS = CSS + """
.row img { aspect-ratio: 8 / 5; }
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; margin-bottom: 6pt; }
.ask { break-inside: avoid; }
.ask h4 { font-size: 12pt; margin: 0; }
.ask .aref { font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin: 0 0 2pt; }
.ask ul { margin: 0; font-size: 9pt; line-height: 1.38; } .ask li { margin-bottom: 1pt; }
.subj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt 14pt; margin: 4pt 0 12pt; }
.subj > div { border-top: 1.2pt solid var(--accent); padding-top: 5pt; font-size: 9pt; break-inside: avoid; }
.subj h4 { margin-bottom: 2pt; }
.myths { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt 14pt; margin: 4pt 0 12pt; }
.myths > div { font-size: 9pt; break-inside: avoid; }
.myths span { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 1pt; }
.myths .m { font: 500 12pt/1.2 'Cormorant Garamond', serif; border-bottom: .6pt solid #c8c5bb; padding-bottom: 5pt; margin-bottom: 5pt; }
.myths .m span { color: #A8452F; }
.myths .r span { color: #4A7346; }
.hero { height: 2.05in; margin-bottom: 11pt; }
"""

QUESTIONS = [
  ("The two posters", [
    ("Revolutionary Victorian Britain", "Poster 1 · the age, the inventions, the V&A",
     ["What does the poster celebrate first? What does it say in only one sentence?",
      "The court dress’s train is 11 feet long. What would it be like to walk backward in it?",
      "The V&A was meant to be *“a schoolroom for everyone.”* What could everyone learn there?"]),
    ("Charles Dickens and Christmas", "Poster 2 · the revival of Christmas",
     ["At the start of the century Christmas was hardly celebrated. What changed it?",
      "Which of these Victorian customs does your family still keep: the tree, the card, the cracker?",
      "Dickens may not have invented Christmas, the poster says, but he reinvented it. What is the difference?"])]),
  ("The three rooms", [
    ("Christmas Card Maker", "Henry Cole’s first card, 1843",
     ["Why did Cole want a card in the first place?",
      "Which picture, border and greeting would you choose, and why?"]),
    ("Inventions Workshop", "The railway, the telegraph, photography",
     ["Why did the trains need one time for every town?",
      "What did the telegraph change about how fast news could travel?",
      "Why does a negative have light and dark the wrong way round?"]),
    ("Dickens’ Christmas Parlour", "Open the parts of a Victorian Christmas",
     ["Which part would you open first? What does it tell you about a Victorian Christmas?",
      "Why might ghost stories round the fire belong to Christmas?"])]),
]

GUIDE = {
  "out": "VIC_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Victorian Britain",
  "sub": "Material and domestic life · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": ROOM, "pos": "center 45%", "credit": ROOM_CREDIT},
  "blocks": [
    ("chips", ["Two posters", "Three hands-on rooms", "1837–1901", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "An age that changed everyday life", "body": [
      "The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria. **Poster 1, Revolutionary Victorian Britain,** tells of rapid industrial growth; railways, the telegraph and photography; the Great Exhibition of 1851; and the founding of the Victoria and Albert Museum in 1852 to show decorative arts and design to everyone. **Poster 2, Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas,** tells how a holiday hardly celebrated at the start of the century became Britain’s biggest celebration by its end: the Christmas tree, the first Christmas card, the cracker, the railways that carried workers home, and *A Christmas Carol* (1843).",
      "**The core message:** the inventions and customs of one age still shape ordinary life — how we tell the time, send a message, take a picture and keep Christmas — and asking *who did this reach?* is part of understanding them."]}),
    ("html", rooms_row()),
    ("section", {"label": "In the rooms", "title": "Three ways in", "list": [
      "**Christmas Card Maker** — choose a picture, a border (gilt, lace, holly or plain), a paper and a greeting, then print and fold a card, after Henry Cole’s first card of 1843",
      "**Inventions Workshop** — three benches: the railway (noon moving west, a train to catch, the stationmaster’s clocks, Bristol’s two-handed clock); the telegraph (build the circuit, the five-needle dial, Morse code, a telegram at twelve words for sixpence); photography (Talbot’s negative and print, a daguerreotype sitting, three processes)",
      "**Dickens’ Christmas Parlour** — open the parlor part by part, from the clock to the fire, and tell a ghost story by the fire as the Victorians did",
      "**The display case** — a Victorian needle case with a lithograph of Queen Victoria, and an antique copy of *The Scott Birthday Book*"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Long ago and now: a Victorian parlor at Christmas", "Kindness and sharing, the message of *A Christmas Carol*", "Looking closely: symbols on a card"],
                  "Dickens’ Christmas Parlour and the Christmas Card Maker.",
                  "ask *what makes a room feel warm and welcoming?*")),
      ("Grades 3–4", (["Messages before the telephone", "Codes and circuits: the telegraph and Morse", "Inventions that changed daily life"],
                  "the telegraph and Morse code benches of the Inventions Workshop.",
                  "ask *how would you send a message to a town far away, without a phone?*")),
      ("Grades 5–6", (["Change and continuity: who gained from new inventions", "Railway time: elapsed time and offsets", "Light and the photograph"],
                  "the railway and photography benches, and poster 1.",
                  "ask *what would be hard if every town kept a different time?*")),
      ("Grades 7–8", (["A poster as a historical account: what it says first and least", "Reform and its limits: the 1842 coal mines law", "Design for everyone: the V&A’s purpose"],
                  "both posters, the court dress and the refreshment room.",
                  "ask *was the age revolutionary for everyone?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "Poster 1’s example of reform is an 1842 report on children working in coal mines. For PreK–4, leave it out or say only that laws began to protect children from dangerous work. With older students, teach it as history — the report, the law and its weak enforcement — with no simulations or role-play of the conditions."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "Which Victorian invention would you least like to live without?",
        "Which Christmas custom surprised you by being Victorian?",
        "Who might have been left out of the changes on poster 1?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Design and print a card in the Christmas Card Maker",
        "Write a twelve-word telegram, then cut it down further",
        "Tell a ghost story by the fire, one sentence each"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, poster by poster and room by room", "body": [
      "Ask one, wait, and let students look before anyone answers — in front of the poster or with the room on screen."]}),
    ("html", asks(QUESTIONS)),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "Change and continuity in 1837–1901; the Great Exhibition and the V&A; the 1842 coal mines law; railways and the revival of Christmas."),
      ("Science", "Light and the photograph: negative and print, exposure, three processes; the telegraph’s circuit — battery, key, wire, coil and needle."),
      ("Math", "Railway time: minutes behind London, elapsed time across the hour, signed offsets; a telegram’s cost at twelve words for sixpence."),
      ("Art", "Ornament and design: the court dress, the refreshment room, gilt and lace borders; motif, repetition and symmetry."),
      ("ELA", "*A Christmas Carol* (1843), first published as *A Ghost Story of Christmas*; writing a ghost story by the fire; a telegram as the shortest writing."),
      ("Character", "Kindness, charity and community through Scrooge’s transformation; Henry Cole’s card, with its scenes of giving to people in need.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“Christmas was always celebrated like this.”", "At the start of the 19th century Christmas was hardly celebrated; many businesses did not treat it as a holiday, and gifts had traditionally been given at New Year."),
      ("“People in old photographs never smiled because they were unhappy.”", "Early exposures took a minute or more; sitters had to keep still, sometimes in a head clamp, and one London photographer told his sitters to say “prunes.”"),
      ("“Every town has always had the same time.”", "Towns kept their own time by the Sun; Bristol’s was 11 minutes behind London’s. Railway time arrived town by town, and became Britain’s legal standard in 1880."),
      ("“Dickens invented Christmas.”", "The tree, the card and the cracker came from many hands. In the poster’s words, Dickens may not have invented Christmas, but he certainly reinvented it.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one Victorian invention or custom and one way it changed everyday life*",
        "**Think-pair-share:** *who gained from railway time, and who had to change?*",
        "**Quick write:** *what does Scrooge learn, and why might it matter at Christmas?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A museum label for one invention: what it did, when, and who it reached",
        "A timeline of the age from 1837 to 1901, from both posters",
        "A card, a telegram and a photograph’s caption for the same day in 1851"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*Light Up the Parlor*), Grades 1–2 (*A Card to Send*) and Grades 3–4 (*Messages Down the Wire*), and for Grades 5–8 in four subjects: Social Studies (*Revolution for Everyone?*), Science (*Drawing with Light*), Math (*Railway Time*) and Art (*Good Design for Everyone*). Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      "**For a virtual visit,** both posters and all three rooms are online at minimuseumproject.org/exhibitions/victorian, with every plan and handout beside them."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Shade a window’s negative and its print on a grid, match three processes to their clues, and finish a sentence on why sitters kept still."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Turn a scene into a negative and back, plan a fair test of exposure time, and choose the right process for three jobs."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Draw a labeled model from light to print, weigh exposure time against blur, design an experiment and argue for a process.")]


def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Drawing with Light</i></span>{md(ex)}</p></div>')
    return f'<div class="lvcards">{out}</div>'


def steps(items):
    return '<ol class="steps">' + "".join(
        f'<li><span class="sn">{i}</span><h4>{md(t)}</h4><p>{md(b)}</p></li>' for i, (t, b) in enumerate(items, 1)) + "</ol>"


def checks(items):
    return '<ul class="checks">' + "".join(f"<li><b>{md(t)}</b> {md(b)}</li>" for t, b in items) + "</ul>"


def say_avoid(say, avoid):
    col = lambda cls, lab, xs: (f'<div class="{cls}"><p class="sa">{lab}</p>' + "".join(f"<p>“{md(x)}”</p>" for x in xs) + "</div>")
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
  "sub": "A guide to self-selection and flexible differentiation · Victorian Britain",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": pic(STUDIO), "pos": "center 50%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Science lesson, *Drawing with Light*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same photographs, the same railway timetable, the same posters — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home."]}),
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
      "Every Victorian Britain lesson plan — PreK–K, Grades 1–2, Grades 3–4, and Social Studies, Science, Math and Art for Grades 5–8 — has its Green, Yellow and Red handouts beside it."]}),
  ]}

DOCS = [GUIDE, DIFF]
