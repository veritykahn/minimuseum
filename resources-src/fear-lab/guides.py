"""The two adult guides for the Fear Lab: the Quick Teaching Guide and the
teacher sheet on the Green / Yellow / Red handouts, after the In Their
Hands guides. Facts follow app/exhibitions/fear-lab/fearLab.ts (the posters,
their "Talk about it" questions, the display case) and what-scares-you/
(the Fear Boxes, Known or Unknown? and the Rustling Bushes). The handouts
sheet adapts the Mini Museum's existing "Using Differentiated Student
Handouts" teacher guide."""

import html, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

RESOURCES = "minimuseumproject.org/exhibitions/fear-lab/resources"

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

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
    """Guided questions stop by stop, grouped by where they are asked."""
    out = ""
    for label, stops in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for c in stops:
            pic = c["art"] if c.get("art") else f'<img src="{c["img"]}" alt="">'
            out += (f'<div class="ask"><div class="pic">{pic}</div><div><h4>{md(c["title"])}</h4>'
                    f'<p class="aref">{md(c["ref"])}</p><ul>'
                    + "".join(f"<li>{md(q)}</li>" for q in c["q"]) + "</ul></div></div>")
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
.hero { background: #1F3A5F; }
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 16pt; margin-bottom: 4pt; }
.ask { display: grid; grid-template-columns: 50pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask .pic { width: 50pt; height: 50pt; display: grid; place-items: center; background: #1F3A5F; border-radius: 3pt; overflow: hidden; }
.ask .pic.plain { background: none; }
.ask img { width: 50pt; height: 50pt; object-fit: cover; }
.ask svg { background: #f6f1e4; border-radius: 3pt; }
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
.plans { list-style: none; padding: 0; margin: 4pt 0 10pt; display: grid; grid-template-columns: 1fr 1fr; gap: 4pt 16pt; font-size: 9pt; }
.plans li { margin: 0; border-left: 2pt solid var(--accent); padding-left: 7pt; }
.plans b { font-weight: 500; }
.hero { height: 2.05in; margin-bottom: 11pt; }
.gallery { padding: 12pt 14pt 6pt; margin: 4pt 0 10pt; }
.gallery .glab { margin: 4pt 0 5pt; }
.grow { gap: 8pt; margin-bottom: 7pt; }
.grow img { width: 96pt; height: 96pt; object-fit: cover; border-radius: 3pt; }
.grow figcaption { font-size: 7.3pt; }
"""

# the poster's own "Talk about it" questions, one per chapter (fearLab.ts)
QUESTIONS = [
  ("The posters", [
    {"img": POSTER1, "title": "The Science of Being Scared", "ref": "Poster 1 · the brain and the unknown",
     "q": ["Think of a time you were scared of something you couldn’t see. What did your imagination fill the gap with?",
           "Would you rather know exactly what is in the box, or not know? Why might not knowing feel worse?",
           "Have you ever found that waiting for something was worse than the thing itself?",
           "Where have you seen a face in something that wasn’t a face?"]},
    {"img": POSTER2, "title": "Page Turners & Spine Tinglers", "ref": "Poster 2 · why we read horror",
     "q": ["Why do you think people choose to read stories that are designed to scare them? Do you?",
           "The real terror isn’t the creature, it’s what it represents. Pick a monster you know. What might it stand for?",
           "If you wrote a scary story set in your own school’s hallways, what would it be about?",
           "Why might being scared together bring people closer?"]},
  ]),
  ("What Scares You?", [
    {"img": pub(BOXES["chest"]), "title": "The Fear Boxes", "ref": "Five boxes · pick one",
     "q": ["Take your pulse before you open a box, and after. What changed it: the box, or the waiting?",
           "The box held a pinecone. What did your brain invent first?"]},
    {"img": pub(FL + "mystery-box.svg"), "title": "Known or Unknown?", "ref": "Six choices · what people did",
     "q": ["Which would you choose: a shock for sure, or maybe a shock? Most people find the maybe worse. Why?",
           "Fifteen minutes alone with your thoughts, or a button? What surprised you about the answer?"]},
    {"art": D.bush(46), "title": "The Rustling Bushes", "ref": "Eight rounds · three tigers",
     "q": ["Did you make more fake alarms or miss more tigers? Which mistake costs more?",
           "Why might your brain be built to raise fake alarms?"]},
    {"img": pub(BOXES["hatbox"]), "title": "The display case", "ref": "Mystery Fear Boxes · Point Horror",
     "q": ["The Fear Boxes change every week. Would you rather reach in this week, or wait to hear what’s inside?",
           "These Point Horror paperbacks have library cards. Who might have borrowed them?"]},
  ]),
]

GUIDE = {
  "out": "FL_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "The Fear Lab",
  "sub": "The Science of Being Scared · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": VAMPIRE_MOON, "pos": "center 40%"},
  "blocks": [
    ("chips", ["Two posters", "A display case", "The What Scares You? lab", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "Why we get scared, and why we like it", "body": [
      "**The Science of Being Scared** (poster 1) explains that the brain’s first fear is the unknown: uncertainty sets off the amygdala, the brain’s alarm, louder than an actual spider; waiting makes everything scarier; and a pattern-seeking brain sees faces and threats where none exist. **Page Turners & Spine Tinglers** (poster 2) asks why we read stories designed to scare us, and traces horror from Mary Shelley’s “Frankenstein” (1818) through the penny dreadfuls and the Point Horror series (1991) to today’s Red Eye books. The display case holds two tactile Mystery Fear Boxes, whose contents change every week, and a vintage collection of original Point Horror paperbacks with their library cards.",
      "**The core message:** fear isn’t a flaw. *“Our brains know it is better to see 100 fake threats than miss one real predator.”* Knowing why your brain raises the alarm is the first step to being brave."]}),
    ("gallery", [{"label": "The posters and their pictures", "items": [
      {"img": POSTER1, "cap": "Poster 1 · The Science of Being Scared"},
      {"img": POSTER2, "cap": "Poster 2 · Page Turners & Spine Tinglers"},
      {"img": VAMPIRE, "cap": "The vampire, seen from behind"},
      {"img": HAND, "cap": "The clawed hand"}]}]),
    ("section", {"label": "The online lab", "title": "What Scares You?", "list": [
      "**The Fear Boxes** — five closed boxes; what is inside is drawn by chance: a swarm of spiders and a real creature with one checked fact, a silly surprise, the poster’s pinecone, or nothing at all. A pulse students take themselves, before and after",
      "**Known or Unknown?** — six would-you-rather choices, each followed by what people did: the 50% shock, the marble jar (the Ellsberg paradox, 1961), the 2014 thinking study, the 2020 haunted house",
      "**The Rustling Bushes** — eight rounds, five bushes, three tigers: tiger or wind? Ten seconds to decide, or *Guess first* to talk each round over. It counts fake alarms and missed tigers"]}),
    ("section", {"label": "A note for the youngest", "body": [
      "About half the time, a Fear Box releases a swarm of spiders and a photograph of a real creature (a cockroach, a tarantula, a bat, a snake, a rat or a centipede) with a scary sound. Gentle mode, a teacher’s switch at the top, makes scares rarer and softer, but a few cartoon spiders and a real animal still appear. For PreK–2, use *Known or Unknown?*, the Rustling Bushes and your own box with a pinecone in it, and keep the message on naming feelings and being brave."]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Feelings have names: curious, worried, scared, calm", "Brave means doing it even when you’re a little scared", "Tiger or wind? Clues and the brain’s alarm"],
                  "a closed box with a pinecone in it, and the Rustling Bushes in *Guess first*.",
                  "*how does your body feel when you’re a little bit scared?*")),
      ("Grades 3–4", (["Pareidolia: faces where none exist", "Why the brain raises fake alarms", "Talking back to a fear of the dark"],
                  "poster 1’s *Pareidolia* chapter, the clawed hand and a face hunt round the room.",
                  "*where have you seen a face in something that wasn’t a face?*")),
      ("Grades 5–6", (["Ambiguity aversion and the amygdala", "Reading a study: what changed, what was measured, how many", "Heart rate, waiting and exercise"],
                  "*Known or Unknown?* as a class vote, then the findings.",
                  "*would you rather know exactly what is in the box, or not know?*")),
      ("Grades 7–8", (["Horror as a risk-free rehearsal", "The golden rule: what a monster represents", "Design: silhouette, palette and what is left out"],
                  "poster 2, the timeline from “Frankenstein” to Red Eye, and the vampire seen from behind.",
                  "*why do people choose stories designed to scare them?*")),
    ])),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "What was really in the box? What did your brain invent first?",
        "Which mistake did you make more: fake alarms or missed tigers?",
        "When has your brain imagined the worst? What could you say to yourself?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Make a class mystery box, and take pulses before and after",
        "Hunt for faces in the school, and photograph them",
        "Write a scary scene in which the monster is never seen"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, stop by stop", "body": [
      "The poster questions are the exhibition’s own. Ask one, wait, and let students think before anyone answers."]}),
    ("html", asks(QUESTIONS)),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Science", "The amygdala; ambiguity aversion and dread; the studies in *Known or Unknown?* as models of variables, measures and samples."),
      ("ELA", "Poster 2’s line from the Gothic classics to Red Eye; horror’s golden rule; suspense built by withholding."),
      ("PE and Health", "Taking a pulse at rest, after waiting and after exercise; the calm minute; naming feelings."),
      ("Art", "Silhouette; the posters’ three colors (navy, cream and marigold); what a designer leaves out."),
      ("Math", "Percentages from the studies’ own counts: 12 of 18 men and 6 of 24 women; 110 haunted house visitors."),
      ("Social and emotional learning", "Fear as the brain trying to help; talking back to a brain that imagines the worst; being scared together.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“Being scared means something’s wrong with me.”", "Poster 1: *“This isn’t a flaw—it’s by design.”* The brain raises fake alarms because missing a real danger costs more."),
      ("“The scariest thing is whatever’s in the box.”", "Poster 1: the brain’s #1 fear is the unknown. Reaching into the box is scarier than touching what’s inside."),
      ("“Scary stories are a waste of time.”", "Poster 2: horror is a *risk-free rehearsal* for danger, and scary books bring us together.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *why can a box you can’t see into feel scarier than a spider you can?*",
        "**Think-pair-share:** *which costs more: a fake alarm or a missed tiger?*",
        "**Quick write:** *name one way to make a reader afraid of something they never see*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A class experiment on waiting and pulse, designed to be fair and kind",
        "A horror timeline from poster 2, with one book students choose to add",
        "A three-color poster whose monster the viewer has to finish"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts"}),
    ("html", '<ul class="plans">' + "".join(f"<li><b>{md(a)}</b> · {md(b)}</li>" for a, b in [
      ("PreK–K", "*What’s in the Box?* Naming feelings and being brave"),
      ("Grades 1–2", "*Tiger or Wind?* The Rustling Bushes and the brain’s alarm"),
      ("Grades 3–4", "*Is It Really a Monster?* Pareidolia in the dark"),
      ("Grades 5–8 Science", "*The Science of Not Knowing* Ambiguity and dread"),
      ("Grades 5–8 ELA", "*Page Turners* Suspense and the Gothic"),
      ("Grades 5–8 PE", "*Racing Hearts* Pulse, alarm and recovery"),
      ("Grades 5–8 Art", "*The Shape of Fear* Silhouette and palette")]) + "</ul>"),
    ("section", {"body": [
      "Each plan comes with three student handouts: **Green** (more support), **Yellow** (grade level) and **Red** (go deeper), and students choose their own. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      "**If you read from the printed posters,** a few sentences differ from the exhibition’s website, which updates three of the poster’s claims; the plans quote the website.",
      f"**For a virtual visit,** both posters and *What Scares You?* are online at minimuseumproject.org/exhibitions/fear-lab, and every plan and handout is at {RESOURCES}."], "label": "How they work"}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

# The level colors and tints are build.py's LEVELS and TINTS.
LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Record the class’s votes beside three of the studies’ results, match four new words to their meanings, read a study’s counts as fractions and write a claim with evidence."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Turn all six votes into percentages, take two studies apart (what changed, what was measured, how many took part) and explain the marble jar."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Design a fair, kind experiment on waiting and pulse, and judge what a poster leaves out when it says *some people*.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>The Science of Not Knowing</i></span>{md(ex)}</p></div>')
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
.hero { height: 2.05in; margin-bottom: 11pt; background: #1F3A5F; }
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
  "sub": "A guide to self-selection and flexible differentiation · The Fear Lab",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": HAND, "pos": "center 30%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic, not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Science lesson, *The Science of Not Knowing*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core ideas (the same poster, the same studies, the same game) but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home. In the PreK–2 handouts, the levels are mostly drawing, coloring and tracing."]}),
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
      f"Every Fear Lab lesson plan (PreK–K, Grades 1–2, Grades 3–4, and Science, ELA, PE and Art for Grades 5–8) has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
