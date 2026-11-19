"""The two adult guides for The Writing Revolution: the Quick Teaching Guide
and the teacher sheet on the Green / Yellow / Red handouts. Facts follow the
posters in app/exhibitions/writing-revolution/writingRevolution.ts, the
display case records and the Typing Station (typing-station/stationText.ts).
The handouts sheet adapts the Mini Museum's existing "Using Differentiated
Student Handouts" teacher guide, as In Their Hands does."""

import html, re
import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

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




def asks(groups):
    """Guided questions, topic by topic, grouped by poster or room."""
    out = ""
    for label, items in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for c in items:
            out += (f'<div class="ask"><div><h4>{md(c["title"])}</h4>'
                    f'<p class="aref">{md(c["ref"])}</p><ul>'
                    + "".join(f"<li>{md(q)}</li>" for q in c["q"]) + "</ul></div></div>")
        out += "</div>"
    return out

WR_CSS = """
.ask { grid-template-columns: 1fr; }
.grow img { width: 100%; height: 112pt; object-fit: contain; }
.gallery { padding: 12pt 14pt 4pt; }
.note { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 6pt 11pt 2pt; margin: 4pt 0 10pt; font-size: 9pt; break-inside: avoid; }
"""

QUESTIONS = [
  ("Poster · The Writing Revolution", [
    {"title": "A privilege", "ref": "Scribes, monks and the wealthy elite",
     "q": ["For thousands of years, only a few could write. Who was left out, and what did that mean for them?"]},
    {"title": "The typewriter", "ref": "Sholes, 1868 · women in offices",
     "q": ["The poster says women gained *economic independence previously denied to them*. How could a writing machine do that?"]},
    {"title": "Anyone can publish", "ref": "PageMaker 1985 · Blogger 1999 · Wikipedia 2001",
     "q": ["In 1900 only major newspapers and publishers could spread ideas widely. Who can now? Is that all good?"]},
    {"title": "New challenges", "ref": "Overload · misinformation · algorithms",
     "q": [W.TALK["p1_trust"]]},
    {"title": "What comes next", "ref": "AI writing tools",
     "q": ["What happens when anyone can generate professional-quality text instantly? What would you want people to keep doing for themselves?"]},
    {"title": "The gates", "ref": "The poster’s last sentence",
     "q": [W.TALK["p1_open"]]},
  ]),
  ("Poster · QWERTY’s Accidental Empire", [
    {"title": "The jam", "ref": "Sholes · Milwaukee · the metal arms",
     "q": ["Look at the keys. Why might letters often used together, like T and H, be set apart?"]},
    {"title": "The myth", "ref": "Slow typists down?",
     "q": ["Many people think QWERTY was made to slow typists down. What does the poster say instead?"]},
    {"title": "Dvorak’s challenge", "ref": "1936 · the Navy test · 1956",
     "q": ["The Navy test was overseen by Dvorak himself. Why does it matter who runs a test?"]},
    {"title": "Lock-in", "ref": "“Economic, not ergonomic”",
     "q": [W.TALK["p2_familiar"], "Why do touchscreens still use QWERTY, with no keys to jam?"]},
  ]),
  ("The display case and the Typing Station", [
    {"title": "Two machines", "ref": "Smith-Corona Galaxie · iMac G3",
     "q": ["On the typewriter a mistake stays on the page; on the iMac, Back space takes it away. How does that change the way you write?"]},
    {"title": "The race", "ref": "The same line on both machines",
     "q": ["Which machine was faster for you? Is one race enough to know which machine is faster?"]},
  ]),
]

GUIDE = {
  "out": "WR_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "The Writing Revolution",
  "sub": "From Movable Type to the Digital Age · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS + WR_CSS,
  "hero": W.HERO_P2_KEYS,
  "blocks": [
    ("chips", ["Two posters", "Typewriter and iMac", "The Typing Station", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "Who gets to write, and the keys we write with", "body": [
      "**The Writing Revolution** traces how writing passed from scribes, monks and the wealthy elite to everyone: Gutenberg’s printing press around 1440, Sholes’ typewriter in 1868, word processors in the 1970s, PageMaker in 1985, Blogger in 1999, Wikipedia in 2001 and social media. It also names what came with that power: information overload, misinformation, and algorithms that decide what writing gets seen. **QWERTY’s Accidental Empire** tells how Sholes arranged the keys so the metal arms of his typewriter would not jam, why the myth that QWERTY was meant to slow typists down is wrong, and why the layout survived Dvorak’s challenge.",
      "The **display case** holds a portable Smith-Corona Galaxie typewriter with its original carrying case and a working Apple iMac G3 running AppleWorks. At the **Typing Station**, students type the same line on a typewriter and on an iMac. **The core message:** " + Q["gates"].lower().rstrip(".") + ", and the tools we write with shape how we write."]}),
    ("gallery", [{"label": "The exhibition", "items": [
      {"img": W.POSTER1, "cap": "The Writing Revolution"},
      {"img": W.POSTER2, "cap": "QWERTY’s Accidental Empire"},
      {"img": W.printable(W.ROOM), "cap": "The Typing Station"}]}]),
    ("section", {"label": "Around the posters", "title": "The Typing Station", "list": [
      "**The typewriter** — no erasing: Back space strikes over. A bell rings near the end of the line, and the carriage returns",
      "**The iMac** — select, cut and paste; fonts (" + " · ".join(W.IMAC_FONTS) + "), sizes, bold, italic and underline; undo",
      "**Race the machines** — the line *" + W.STATION_LINE + "* typed on the typewriter, then on the iMac, against the clock",
      "**The top row** — words typed with only Q W E R T Y U I O P, and *Beat ten*: *typewriter* has ten letters",
      "**The class board** — race times and words, shared by the class"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Machines that help us write", "A mistake stays on a typewriter; Back space takes it away on a computer", "Long ago only a few people could write"],
                  "the sounds of the posters and the typewriter at the Typing Station.",
                  "*how many ways can you think of to write a message?*")),
      ("Grades 3–4", (["Why the letters are where they are", "Busting the myth with the poster’s words", "Top-row words"],
                  "*QWERTY’s Accidental Empire* and the top row.",
                  "look at a keyboard together: *why isn’t it in ABC order?*")),
      ("Grades 5–6", (["Technology and access: who could write, when", "Women typists and economic independence", "Fair tests: Dvorak and the Navy"],
                  "the timeline of *The Writing Revolution* and the race.",
                  "*who gets to share their ideas today?*")),
      ("Grades 7–8", (["The posters as arguments: claim, evidence, concession", "Misinformation and algorithms", "Lock-in: why the best design doesn’t always win"],
                  "both posters, and the question about AI.",
                  "*what happens when anyone can generate professional-quality text instantly?*")),
    ])),
    ("html", '<div class="note"><p><b>A note on the typewriter in the posters.</b> The Urania typewriter in both posters has a German keyboard: its top row reads Q W E R T Z, not Q W E R T Y. The exhibition doesn’t explain it, so use it for looking, and use a real keyboard or the Typing Station to find letters. Older students may enjoy noticing it.</p></div>'),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "Which did you like better, the typewriter or the iMac? Why?",
        W.TALK["p2_invent"],
        W.TALK["p1_computer"]]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Write a page by typewriter rules: pen, and no erasing",
        "Find the longest top-row word you can",
        "Design a one-page newsletter, the way the poster says anyone could after 1985"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, poster by poster", "body": [
      "Ask one, wait, and let students look before anyone answers, in front of the poster or with it on screen."]}),
    ("html", asks(QUESTIONS)),

    ("pagebreak", None),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("ELA", "The posters as arguments: claim, evidence and concession; word choice (*shattered*, *obliterated*, *chipped away*); revising on a typewriter and on a computer."),
      ("Social Studies", "Who could write, from scribes to social media; women typists and economic independence; 1900 newspapers and today’s algorithms."),
      ("Science", "Fair tests: Dvorak’s 74% claim, the Navy test he oversaw, the 1956 study; the race as an experiment; reading and memory."),
      ("Art", "The posters’ design: color blocks, a frame line that breaks at a corner, tall condensed capitals, typewriter type; desktop publishing."),
      ("Math", "Counting letters on each keyboard row; percent (74%); comparing race times; dates on a timeline from around 1440 to 2001."),
      ("Technology", "Mechanical and digital writing; why the metal arms jammed; electric typewriters; touchscreens that keep a layout made for keys.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“QWERTY was made to slow typists down.”", "The poster calls this a myth: Sholes designed it to let typists type as fast as possible without breaking the machine."),
      ("“The best technology always wins.”", "Dvorak’s keyboard claimed to be faster, yet QWERTY survived. The poster: sometimes, being first and “good enough” conquers all."),
      ("“Typing is better than writing by hand.”", "The poster says we read faster on screens but remember more from printed pages, and that handwriting aids memory and creativity.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one technology from the poster, and who it let write*",
        "**Think-pair-share:** *why did QWERTY survive, even after the jamming problem was gone?*",
        "**Quick write:** *the typewriter or the iMac: which made you a better writer, and why?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A timeline of writing tools, from the poster’s dates",
        "A fair test of handwriting and typing, planned and run by the class",
        "A third poster for the series, in the posters’ own design"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*Clack, Clack, Ding!*), Grades 1–2 (*No Erasing!*) and Grades 3–4 (*QWERTY’s Secret*), and for Grades 5–8 in four subjects: ELA (*Chipping at the Gates*), Social Studies (*Who Gets to Write?*), Science (*Is It a Fair Test?*) and Art (*Designed to Be Read*). Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. All three levels read the same poster, so the class can talk together afterward whatever each student chose. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** both posters and the Typing Station are online at {W.EXHIBITION_URL}, and every plan and handout is at {W.RESOURCES}. Even ten minutes with one poster and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

# The level colors and tints are build.py's LEVELS and TINTS.
EXAMPLE = "Who Gets to Write?"
LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Complete the timeline from a word bank, explain what the typewriter meant for women, and put one of the new challenges in your own words."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Write what each technology opened up and for whom, compare the gatekeepers of 1900 and today, and argue which was the biggest leap."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Weigh evidence for and against the poster’s claim, trace what changed and what stayed the same, and predict what AI writing tools will bring.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>{EXAMPLE}</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · The Writing Revolution",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": W.HERO_P1_URANIA,
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *Who Gets to Write?*"]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same poster, the same timeline — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition’s posters, asks for reflection, and can be completed in class or at home."]}),
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
      f"Every Writing Revolution lesson plan — PreK–K, Grades 1–2, Grades 3–4, and ELA, Social Studies, Science and Art for Grades 5–8 — has its Green, Yellow and Red handouts beside it at {W.RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
