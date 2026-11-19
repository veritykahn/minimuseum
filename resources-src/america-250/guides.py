"""The two adult guides for America 250: the Quick Teaching Guide and the
teacher sheet on the Green / Yellow / Red handouts, on the pattern of
in-their-hands/guides.py (its layout helpers and styles are copied here, so
each exhibition prints on its own). Facts follow
app/exhibitions/america-250/america250.ts (both posters, the Many Faiths
note, the display case) and sign/signText.ts (the three rooms)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import A, CP, TRUMBULL, LEUTZE, pic, md

RESOURCES = "minimuseumproject.org/exhibitions/america-250/resources"

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


# ── the Quick Teaching Guide ───────────────────────────────────────────

def asks(groups):
    """Guided questions, stop by stop: a picture, a name, a short list."""
    out = ""
    for label, stops in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for img, title, ref, qs in stops:
            out += (f'<div class="ask"><img src="{img}" alt=""><div><h4>{md(title)}</h4>'
                    f'<p class="aref">{md(ref)}</p><ul>' + "".join(f"<li>{md(q)}</li>" for q in qs) + "</ul></div></div>")
        out += "</div>"
    return out

A250_CSS = """
.grow img { width: 82pt; height: 100pt; object-fit: contain; }
.ask img { width: 44pt; height: 54pt; object-fit: cover; border: .6pt solid #1d1c1a; border-radius: 2pt; }
.hard { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 8pt 12pt 3pt; margin: 4pt 0 12pt; break-inside: avoid; }
.hard p { font-size: 9.4pt; }
"""

QUESTIONS = [
  ("Poster 1 · Before it was Sacred", [
    (A + "trumbull-committee.jpg", "The draft presented", "Trumbull, 1818",
     ["Washington is not in this room. Where was he?", "Independence was voted on July 2. Why do we celebrate July 4?"]),
    (A + "trumbull-draft.jpg", "At least four authors", "Jefferson, Franklin and the Congress",
     ["Franklin changed *sacred and undeniable* to *self-evident*. What does the change do?", "Congress cut the charge about the slave trade. What do we learn from what was cut?"]),
    (CP + "stone.jpg", "A copy of a copy", "Stone’s engraving, 1823",
     ["Why does the picture everyone knows come from 1823?", "Why might a document be ignored for fifteen years, then become sacred?"]),
  ]),
  ("Poster 2 · We Shall All Hang Together", [
    (A + "leutze-washington.jpg", "The war that nearly was not won", "Leutze, 1851",
     ["About 19,000 against 32,000. Would you have expected the Americans to win?", "What does *nothing but the first act of the drama is closed* mean?"]),
    (A + "trumbull-hancock.jpg", "The signers", "Fifty-six names",
     ["Why did signing take courage?", "Charles Carroll was the only Catholic signer, when Catholics could not hold office in most colonies. What does his signature say?"]),
    (A + "poster2.jpg", "Many faiths", "Washington’s letter to Newport, 1790",
     ["What does *gives to bigotry no sanction, to persecution no assistance* promise?", "Why might a young country promise that?"]),
  ]),
]

GUIDE = {
  "out": "A250_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "America 250",
  "sub": "The Declaration of Independence at 250 · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS + A250_CSS,
  "hero": pic("leutze.jpg", LEUTZE, "center 40%"),
  "blocks": [
    ("chips", ["Two posters", "Three rooms", "A display case", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "The Declaration, before it was sacred", "body": [
      "America 250 tells the story of the Declaration of Independence as it happened. **Before it was Sacred**, built around John Trumbull’s painting, sets out what the document was in 1776: independence voted on July 2, a text edited by at least four hands, twenty-seven charges against the King written to persuade France, a parchment signed mostly on August 2, and a document largely ignored until Lincoln made *all men are created equal* the nation’s founding promise. **We Shall All Hang Together**, built around Emanuel Leutze’s painting, tells of the fifty-six men who signed an act of treason, a war that nearly was not won, and the many faiths of the founding era.",
      "**The core message:** the Declaration was made by people, under pressure, and it became more than they knew. The exhibition neither debunks it nor worships it; it lets students see how a document becomes a promise, and who was not yet included in it."]}),
    ("gallery", [
      {"label": "The two posters", "items": [
        {"img": A + "poster1.jpg", "cap": "Before it was Sacred"}, {"img": A + "poster2.jpg", "cap": "We Shall All Hang Together"}]},
      {"label": "A Copy of a Copy", "items": [
        {"img": CP + "dunlap.jpg", "cap": "Dunlap · 1776"}, {"img": CP + "goddard.jpg", "cap": "Goddard · 1777"},
        {"img": CP + "stone.jpg", "cap": "Stone · 1823"}, {"img": CP + "original.jpg", "cap": "The parchment today"}]}]),
    ("section", {"label": "Around the posters", "title": "Three rooms and a case", "list": [
      "**Put Your Name to It** — read the Declaration on parchment, dip the quill and sign under the signers; or sign *Our Class Declaration* (classroom and middle-school versions) or *My Declaration*, and print it. Nothing signed is saved or sent.",
      "**A Copy of a Copy** — a detective’s case: one clue to find with a lens on each of four copies, then how each was made",
      "**Add a Star** — guess the decade each of 37 states joined, and grow the flag from 13 stars to 50 (3 points for the right decade, 1 for a decade out)",
      "**The display case** — a hand-forged iron bolt from Valley Forge, a leaf from Christoph Saur II’s Germantown Bible, and original editions of *The London Evening Post* (carrying Howe’s Declaration) and *The London Chronicle*"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["A signature means *I mean it*", "13 stars for 13 states, and a star for each that joined", "Big and small, first and last"],
                  "*Put Your Name to It*, Hancock’s signature and *Add a Star*.",
                  "ask *where do you write your name, and why?*")),
      ("Grades 3–4", (["Copies, dates and the order of events", "Looking closely before deciding", "Washington did not sign; most signed on August 2"],
                  "*A Copy of a Copy* and the first chapter of *Before it was Sacred*.",
                  "show Stone’s engraving and ask *is this the real thing?*")),
      ("Grades 5–6", (["The Declaration as an argument: claim, evidence, conclusion", "Who signed, and the risk", "How the flag grew, as data"],
                  "both posters, *Put Your Name to It* and *Add a Star*.",
                  "read the second paragraph aloud and ask *who is “all men”?*")),
      ("Grades 7–8", (["Primary sources and what was cut", "Who was left out in 1776, and how the words were later used", "History paintings as myth-making"],
                  "both posters in full, the four copies, and the Many Faiths note.",
                  "*why might a document be ignored for fifteen years, then become sacred?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "The second poster is frank about danger. It names the sentence for treason under British law (hanging, drawing and quartering) and tells how Richard Stockton was captured, imprisoned and tortured until he recanted. For PreK–4, say only that signing was **dangerous**, and that the signers were **brave**; leave the sentence, Stockton’s story and the war’s losses for Grades 5–8, and preview them before older students read the poster. None of the lessons asks students to act out the signers, the soldiers or anyone who suffered."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "What surprised you most about the Declaration?",
        "Would you have signed, knowing the risk?",
        "Who was left out of *all men are created equal* in 1776?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Write and sign a class declaration",
        "Copy a paragraph by hand down a chain of five people, and compare",
        "Find your state’s star, and the year it joined"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, chapter by chapter", "body": [
      "Ask one, wait, and let students look before anyone answers, in front of the poster or with it on screen."]}),
    ("html", asks(QUESTIONS)),
    ("section", {"label": "Teaching the hard parts", "title": "“All men are created equal”"}),
    ("html", '<div class="hard">' + "".join(f"<p>{md(t)}</p>" for t in [
      "The exhibition is honest about who was left out, and the lessons follow it. In 1776, Catholics could not hold office in most of the colonies; Charles Carroll signed anyway. Congress cut Jefferson’s charge against the King over the slave trade, and the word *slave* does not appear in the adopted text. The twenty-seventh charge calls the Native peoples of the frontier “the merciless Indian Savages.” And the fifty-six signers were all men: Mary Katharine Goddard, who printed the first copy with their names, set her own name only at its foot.",
      "**Keep it nonpartisan.** Let the documents speak, in their own words. Ask what the words meant to their writers, whom they reached, and how later Americans used them: Lincoln at Gettysburg made *all men are created equal* the nation’s founding promise. Students can hold two things at once: that the promise was not kept for everyone in 1776, and that later Americans, Lincoln among them, held the nation to it."]) + "</div>"),
    ("cols", [
      [("section", {"label": "At Put Your Name to It", "list": [
        "Read the last sentence before you sign. What are you pledging?",
        "Is a class declaration a promise, a list of rules, or both?"]})],
      [("section", {"label": "At A Copy of a Copy and Add a Star", "list": [
        "Which copy would you trust most as evidence, and why?",
        "Which decade added the most stars? Which added none?"]})]]),

    ("pagebreak", None),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "The Declaration as a primary source; July 2 and July 4; the war of 1776; who signed and who was left out; Lincoln and the founding promise."),
      ("ELA", "The Declaration as an argument: a claim, twenty-seven charges and a pledge; Franklin’s edit to *self-evident*; writing and signing a declaration."),
      ("Math", "Thirty-seven states by decade, from 1791 to 1959; ratio and percent from 19,000 and 32,000, and from about 200 copies printed and 26 surviving."),
      ("Art", "Trumbull and Leutze as history paintings: focal point, composition and light, and what each painting, made decades later, leaves out."),
      ("Civics", "Consent of the governed; a pledge made together; no religious test for federal office (1787); Washington’s letter to Newport."),
      ("Science", "Why parchment and ink fade; how a copperplate engraving prints many copies; how the parchment is kept today.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“Everyone signed on July 4.”", "Independence was voted on July 2 and the Declaration adopted on July 4. The parchment was ordered on July 19, and most delegates signed it on August 2."),
      ("“Washington signed it.”", "George Washington never signed. He was not in the room: he was commanding the army."),
      ("“The famous picture is the original.”", "It is Stone’s engraving of 1823, a copy of the parchment. The parchment itself has faded almost away.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one thing the Declaration was in 1776, and one thing it became*",
        "**Think-pair-share:** *why did signing take courage?*",
        "**Quick write:** *who was left out of “all men” in 1776?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A museum label for one of the four copies",
        "A timeline from July 2, 1776, to the 50th star",
        "A class declaration, argued and signed"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*We Put Our Names to It*), Grades 1–2 (*A Star for Every State*) and Grades 3–4 (*Declaration Detectives*), and for Grades 5–8 in four subjects: Social Studies (*What It Was, What It Became*), ELA (*Self-Evident*), Math (*Counting a Nation*) and Art (*Painting the Moment*). Each comes with three student handouts, **Green** (more support), **Yellow** (grade level) and **Red** (go deeper), and students choose their own. All three levels work on the same content, so the class can talk together afterward. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** both posters and all three rooms are online at minimuseumproject.org/exhibitions/america-250, and every plan and handout is at {RESOURCES}. Even ten minutes with one copy and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Sort six statements into myth or evidence, match the Declaration’s three parts to what each does, and answer *who signed, and who was left out?* from four evidence cards."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Complete a myth-and-evidence chart for the poster’s four chapters, explain why a list of charges would persuade France, and write a paragraph on whom *all men* left out."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Trace what the Declaration meant from 1776 to Lincoln, ask what historians would need to know about the cut charge, and argue for or against the poster’s closing claim.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>What It Was, What It Became</i></span>{md(ex)}</p></div>')
    return f'<div class="lvcards">{out}</div>'

DIFF = {
  "out": "Using Differentiated Student Handouts.pdf", "eyebrow": "Teacher guide",
  "title": "Using the Differentiated Student Handouts",
  "sub": "A guide to self-selection and flexible differentiation · America 250",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": pic("trumbull-delegates.jpg", TRUMBULL, "center 40%"),
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic, not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *What It Was, What It Became*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts (the same poster, the same copies, the same words of 1776) but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home."]}),
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
      f"Every America 250 lesson plan (PreK–K, Grades 1–2, Grades 3–4, and Social Studies, ELA, Math and Art for Grades 5–8) has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
