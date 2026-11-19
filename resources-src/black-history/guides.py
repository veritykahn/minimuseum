"""The two adult guides for Black History Month: the Quick Teaching Guide and
the teacher sheet on the Green / Yellow / Red handouts. Facts follow the two
posters (blackHistory.ts), the Black Barbie Timeline (timeline/timelineStops.ts),
Who Do You See? (representation/representationText.ts) and the display
case's record lines (BLACK_HISTORY_CASE). The layout follows the In Their
Hands guides; the handouts sheet adapts the Mini Museum's existing "Using
Differentiated Student Handouts" teacher guide."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

RESOURCES = "minimuseumproject.org/exhibitions/black-history/resources"

# ── the Quick Teaching Guide ───────────────────────────────────────────

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
    """Guided questions, stop by stop, grouped by poster or room (no pictures)."""
    out = ""
    for label, stops in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for title, ref, qs in stops:
            out += (f'<div class="ask"><div><h4>{md(title)}</h4><p class="aref">{md(ref)}</p><ul>'
                    + "".join(f"<li>{md(q)}</li>" for q in qs) + "</ul></div></div>")
        out += "</div>"
    return out

def subjects(items):
    return '<div class="subj">' + "".join(
        f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"

def myths(items):
    return '<div class="myths">' + "".join(
        f'<div><p class="m"><span>Misconception</span>{md(a)}</p><p class="r"><span>In the exhibition</span>{md(b)}</p></div>'
        for a, b in items) + "</div>"


GUIDE_CSS = """
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 16pt; }
.ask { display: grid; grid-template-columns: 44pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask img { width: 44pt; height: 44pt; object-fit: contain; }
.ask h4 { font-size: 12pt; margin: 0; }
.ask .aref { font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; margin: 0 0 2pt; }
.ask ul { margin: 0; font-size: 9pt; line-height: 1.38; } .ask li { margin-bottom: 1pt; }
.rep { font: 500 6.3pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #A8452F; border: .9pt solid #A8452F;
  border-radius: 2pt; padding: 1pt 4pt 0; margin-left: 6pt; vertical-align: 2pt; }
.subj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt 14pt; margin: 4pt 0 12pt; }
.subj > div { border-top: 1.2pt solid var(--accent); padding-top: 5pt; font-size: 9pt; break-inside: avoid; }
.subj h4 { margin-bottom: 2pt; }
.myths { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin: 4pt 0 12pt; }
.myths > div { font-size: 9pt; break-inside: avoid; }
.myths span { display: block; font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; margin-bottom: 1pt; }
.myths .m { font: 500 12pt/1.2 'Cormorant Garamond', serif; border-bottom: .6pt solid #c8c5bb; padding-bottom: 5pt; margin-bottom: 5pt; }
.myths .m span { color: #A8452F; }
.myths .r span { color: #4A7346; }
.plans { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16pt; }
.hero { height: 2.05in; margin-bottom: 11pt; }
.gallery { padding: 12pt 14pt 6pt; margin: 4pt 0 10pt; }
.gallery .glab { margin: 4pt 0 5pt; }
.grow { gap: 6pt; margin-bottom: 7pt; }
.grow img { width: 74pt; height: 74pt; }
.grow figcaption { font-size: 7.3pt; }
.gallery figcaption i { color: #f0b9a6; font-style: normal; letter-spacing: .08em; text-transform: uppercase; font-size: 6.5pt; }
"""


GUIDE_CSS += """
.ask { grid-template-columns: 1fr; border-left: 2pt solid var(--accent); padding-left: 9pt; }
.asks { margin-bottom: 12pt; }
.subj { grid-template-columns: repeat(2, 1fr); }
.myths { grid-template-columns: repeat(2, 1fr); gap: 10pt 16pt; }
""" + HERO_CSS + DOLL_CSS

QUESTIONS = [
  ("Poster 1 · Black History Month", [
    ("Carter G. Woodson", "Negro History Week, 1926",
     ["Woodson wanted history to *“educate schoolchildren.”* Why start with children?",
      "Why do you think a week grew into a month?"]),
    ("February", "Lincoln and Douglass",
     ["Woodson chose February for the birthdays of Abraham Lincoln and Frederick Douglass. Why choose a month for its birthdays?"]),
    ("A vital tool", "The poster’s claim",
     ["Why might it be important to remember the hard parts of history as well as the achievements?"]),
    ("Preserving heritage", "Historical sites and artifacts",
     ["If you could help keep one story, place or object safe for people in the future, what would it be, and why?"]),
  ]),
  ("Poster 2 · The Importance of Black Barbie", [
    ("Francie and Christie", "1967 and 1968",
     ["The poster calls Mattel’s earlier Black dolls *problematic*. What does it say was wrong with each?"]),
    ("Kitty Black Perkins", "The first Black Barbie, 1980",
     ["What did the designer do differently?", "Why might it matter who designs a toy?"]),
    ("Who belongs?", "The poster’s talk question",
     ["What can toys, books and pictures tell children about who belongs? What would you want them to show?"]),
    ("A milestone", "Today",
     ["Why is Black Barbie now both *“a cherished collector’s item”* and a symbol? Can an object be both?"]),
  ]),
  ("The rooms", [
    ("The Black Barbie Timeline", "From Francie to *So In Style*",
     ["Guess the year before you place each stop. What helped you guess?",
      "Which stops quote the poster, and which are museum notes? Why name a source?"]),
    ("Who Do You See?", "Design a doll · The Doll Test · Who’s in your books?",
     ["Which choice in *Design a doll* widens who can see themselves?",
      "Who did you find the most of on our shelf? Who was hardest to find?"]),
  ]),
]

GUIDE = {
  "out": "BH_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Black History Month",
  "sub": "Black Barbie & Representation · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS, "hero": HERO_RING,
  "blocks": [
    ("chips", ["Two posters", "Two rooms", "A display case", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "A month of its own, and a doll of their own", "body": [
      "**Poster 1, *Black History Month*,** tells how the historian Carter G. Woodson created Negro History Week in 1926, which later became Black History Month, choosing February to align with the birthdays of Abraham Lincoln and Frederick Douglass. It argues that the month *“remains a vital tool for transformation”* and that preserving African American culture and heritage matters.",
      "**Poster 2, *The Importance of Black Barbie*,** tells how the first Black Barbie, introduced by Mattel in 1980 and designed by Kitty Black Perkins, broke from Mattel’s earlier Black dolls, Francie (1967) and Christie (1968), with *“Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.”*",
      "**The core message:** history is kept by people who choose to teach it and preserve it, and children notice who is shown in their toys, books and pictures."]}),
    dolls([doll("t1", "afro", "black", "#E8372C", h=64), doll("t3", "puffs", "darkbrown", "#2F7D5B", glasses=True, h=64),
           doll("t5", "braids", "black", "#D9541E", h=64), doll("t2", "bun", "black", "#7B4FA0", h=64),
           doll("t4", "short", "chestnut", "#1F5FA8", h=64)]),
    ("section", {"label": "Around the posters", "title": "Three more ways in", "list": [
      "**The Black Barbie Timeline** — eight stops from Francie (1967) to today. Students guess each year before it is placed. Five stops quote poster 2; three are museum notes, each with its source: Dolls of the World, Shani and the Inspiring Women series",
      "**Who Do You See?** — three tabs: *Design a doll*; *The Doll Test*, Kenneth and Mamie Phipps Clark’s doll tests and *Brown v. Board of Education*, told in checked facts with their sources and led by the teacher; and *Who’s in your books?*, a whole-class survey",
      "**The display case** — boxed Nigerian and Ghanaian editions; the Inspiring Women dolls of Ida B. Wells, Madam C. J. Walker and Bessie Coleman; and an illustrated visual timeline of Black representation in toy design"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Toys and pictures that look like us", "Many ways to be beautiful: hair, faces, skin tones", "A week that grew into a month"],
                  "poster 2, *Design a doll* and the display case.",
                  "ask *why does it matter for children to see toys that look like them?*")),
      ("Grades 3–4", (["Putting milestones in order", "What made the first Black Barbie new", "The poster’s words and the museum’s notes"],
                  "the Black Barbie Timeline and poster 2.",
                  "ask *what is a milestone?*")),
      ("Grades 5–6", (["Design as a set of choices", "Counting who is on our shelf", "Woodson and the start of Black History Month"],
                  "*Design a doll*, *Who’s in your books?* and poster 1.",
                  "ask *who chose the books on our shelf?*")),
      ("Grades 7–8", (["Evidence: the Clarks’ doll tests and *Brown v. Board*", "Poster 1 as an argument: claim, reasons, evidence", "Samples, bias and what a number can show"],
                  "*The Doll Test* tab and poster 1.",
                  "project *“Separate educational facilities are inherently unequal”* and ask what evidence could support it.")),
    ])),
    ("section", {"label": "Teaching the Doll Test with care", "body": [
      ROOM_DOLLTEST_CARE + " The tab is written for Grades 5–8; for younger children, let poster 2 and *Design a doll* carry the visit."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "Which stop on the timeline surprised you most, and why?",
        "What did Kitty Black Perkins design differently?",
        "Why did Carter G. Woodson want schoolchildren to learn Black history?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Design a doll, and write why you made each choice",
        "Count who is on your class shelf, and graph it",
        "Ask your family which story, photo or object they would keep safe"]})]]),

    ("section", {"label": "During the visit", "title": "Guided questions, poster by poster", "body": [
      "Ask one, wait, and let students look before anyone answers: in front of the poster or with it on screen."]}),
    ("html", asks(QUESTIONS)),
    ("section", {"label": "Subject connections", "title": "One exhibition, four subjects"}),
    ("html", subjects([
      ("Social Studies", "Carter G. Woodson and the start of Black History Month; the Clarks’ doll tests as evidence in *Brown v. Board of Education*; the Court’s unanimous decision of May 17, 1954."),
      ("ELA", "Poster 1 as an argument: its claim, its concession, its reasons and its evidence. Reading a source, and asking what it can and cannot show."),
      ("Art", "Design as a set of choices: Francie, *“essentially a white doll design with darker skin,”* beside Kitty Black Perkins’s design; the posters’ own rings, colors and lettering."),
      ("Math", "Fractions and percents from the timeline’s stops; the class’s own count in *Who’s in your books?*, set beside the Cooperative Children’s Book Center’s 2025 figures; samples and bias.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“Black History Month was always a month.”", "It began in 1926 as Negro History Week, created by Carter G. Woodson, and later became Black History Month."),
      ("“The first Black Barbie was Mattel’s first Black doll.”", "Francie (1967) and Christie (1968) came first. Poster 2 calls those earlier efforts *problematic*."),
      ("“A new skin color makes a new doll.”", "Poster 2 says Francie was *“essentially a white doll design with darker skin.”* The first Black Barbie was designed differently, from its face to its hair."),
      ("“The doll tests decided the case on their own.”", "Kenneth Clark testified as an expert witness, and *“the doll test was only one part of his testimony.”*")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one milestone, its year, and why it mattered*",
        "**Think-pair-share:** *why does it matter who designs a toy?*",
        "**Quick write:** *why did Woodson want schoolchildren to learn Black history?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A designer’s statement for a doll of the student’s own design",
        "A class survey of who is in our books, with a graph",
        "An argument: why Black History Month matters at our school"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*A Doll Like Me*), Grades 1–2 (*From a Week to a Month*) and Grades 3–4 (*Milestones*), and for Grades 5–8 in four subjects: Social Studies (*Evidence for the Court*), ELA (*Making the Case*), Art (*Designed to Be Seen*) and Math (*Who’s on Our Shelf?*). Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. All three levels work from the same poster and the same facts, so the class can talk together afterward whatever each student chose. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** both posters, the Black Barbie Timeline and *Who Do You See?* are online at minimuseumproject.org/exhibitions/black-history, and every plan and handout is at {RESOURCES}. Even ten minutes with one poster and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

# The level colors and tints are build.py's LEVELS and TINTS.
LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Put six events in order, match key words to their meanings, explain why the dolls were identical except for color, and finish two sentences about the decision."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Read the Court’s own words as a primary source, complete a chain of evidence from the study to the decision, and explain why the doll test was only one part of the testimony."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Weigh what each part of the study can and cannot show, explain why the Court cited Clark in a footnote, and argue why the exhibition sets the Doll Test beside poster 2.")]


def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Evidence for the Court</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · Black History Month",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS + HERO_CSS,
  "hero": HERO_RING,
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *Evidence for the Court*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same poster, the same facts — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition’s posters and rooms, asks for reflection, and can be completed in class or at home."]}),
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
      f"Every Black History Month lesson plan — PreK–K, Grades 1–2, Grades 3–4, and Social Studies, ELA, Art and Math for Grades 5–8 — has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]

