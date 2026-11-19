"""The two adult guides for Ancient Egypt: the Quick Teaching Guide and the
teacher sheet on the Green / Yellow / Red handouts, modelled on In Their
Hands' guides.py. Facts follow egypt.ts (posters, display case, rooms) and
the rooms' own data, as the lessons do. The handouts sheet adapts the Mini
Museum's existing "Using Differentiated Student Handouts" teacher guide."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import GODS, WALLS, STONE, STONE_TOP, STONE_CREDIT, RESOURCES, SITE_EX, md

E = "/exhibitions/egypt/"

# ── the Quick Teaching Guide ───────────────────────────────────────────

def bands(items):
    out = ""
    for name, (focus, lead, before) in items:
        body = ('<ul>' + "".join(f"<li>{md(i)}</li>" for i in focus) + "</ul>"
                f'<p class="bp"><span>Lead with</span> {md(lead)}</p>'
                f'<p class="bp"><span>Before you go</span> {md(before)}</p>')
        out += f'<div class="band"><h4>{md(name)}</h4>{body}</div>'
    return f'<div class="bands">{out}</div>'

def asks(rooms):
    out = '<div class="asks">'
    for r in rooms:
        out += (f'<div class="ask"><img src="{r["img"]}" alt=""><div><h4>{md(r["title"])}</h4>'
                f'<p class="aref">{md(r["ref"])}</p><ul>' + "".join(f"<li>{md(q)}</li>" for q in r["q"]) + "</ul></div></div>")
    return out + "</div>"

def subjects(items):
    return '<div class="subj">' + "".join(f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"

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
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 16pt; margin: 4pt 0 10pt; }
.ask { display: grid; grid-template-columns: 54pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask img { width: 54pt; height: 54pt; object-fit: cover; border-radius: 3pt; }
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
.gallery { padding: 12pt 14pt 6pt; margin: 4pt 0 10pt; }
.grow img { width: 92pt; height: 66pt; object-fit: contain; }
.grow figcaption { font-size: 7.3pt; }
.pb { break-after: auto; break-before: page; height: 0; margin: 0; }
"""

ROOMS_Q = [
  {"img": WALLS["marshes"]["img"], "title": "Tomb Explorer", "ref": "Five walls · three hidden details each",
   "q": ["What did you find with the torch? What does that detail tell us?",
         "Menna appears twice on one wall. Why might a painter do that?"]},
  {"img": STONE_TOP, "title": "Your Name in Hieroglyphs", "ref": "Signs for sounds · a cartouche",
   "q": ["Which sign stands for the first sound of your name?",
         "Why might royal names have been ringed with an oval?"]},
  {"img": STONE, "title": "The Rosetta Stone Decoder", "ref": "One decree · three scripts",
   "q": ["Why carve the same message three times?",
         "Which names did Champollion compare, and what did he notice?"]},
  {"img": GODS["anubis"]["img"], "title": "Mummification, Step by Step", "ref": "Seventy days · forty in natron",
   "q": ["Which step took longest, and what was it for?",
         "Which organ was left inside, and why did it matter to the Egyptians?"]},
  {"img": GODS["horus"]["img"], "title": "The Weighing of the Heart", "ref": "The Papyrus of Ani · about 1250 BC",
   "q": ["What is weighed against what? Who watches?",
         "Which of Ani’s lines about a good life would still matter today?"]},
  {"img": GODS["bastet"]["img"], "title": "Design an Amulet", "ref": "Seven symbols and their meanings",
   "q": ["What would you want an amulet to protect, and which symbol fits?",
         "Why were amulets placed between the layers of a mummy’s wrappings?"]},
  {"img": WALLS["fields"]["img"], "title": "Build Your Own Tomb", "ref": "A wall, a chamber, your name",
   "q": ["Which wall did you choose, and why?",
         "What would you want people thousands of years from now to discover about you?"]},
  {"img": E + "poster1.jpg", "title": "The two posters", "ref": "Mysteries · Gods and Goddesses",
   "q": ["Who really built the pyramids? What is the evidence?",
         "Anubis was seen as gentle and caring. Why might that matter to people?"]},
]

GUIDE = {
  "out": "EGY_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Ancient Egypt",
  "sub": "Guardians of the Afterlife · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": WALLS["marshes"]["img"], "pos": "center 30%", "credit": WALLS["marshes"]["credit"]},
  "blocks": [
    ("chips", ["Two posters", "A display case", "Seven rooms", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "A civilization along the Nile", "body": [
      "The civilization of ancient Egypt lasted for over three thousand years, along the river Nile in northeastern Africa. **Poster 1, The Mysteries of Ancient Egypt,** tells of the Nile and its three seasons, who really built the pyramids, and the Rosetta Stone, which let us read hieroglyphs again. **Poster 2, Gods and Goddesses,** introduces Anubis, Bastet, Horus and Isis. **The display case** holds replica statues of Bastet and Anubis, and a scarab beetle amulet.",
      "**The core message:** much of what survives from ancient Egypt was made for the dead, and it tells us a great deal about how the Egyptians lived. Their gods and their afterlife are taught here as history and culture: what the ancient Egyptians believed."]}),
    ("gallery", [
      {"label": "Poster 2 · Gods and Goddesses", "items": [
        {"img": GODS[k]["img"], "cap": cap} for k, cap in [
          ("anubis", "Anubis · mummification"), ("bastet", "Bastet · cats and protection"),
          ("horus", "Horus · the sky"), ("isis", "Isis · protection and magic")]]},
      {"label": "Tomb Explorer · facsimiles of tomb paintings, The Met (public domain)", "items": [
        {"img": WALLS[k]["img"], "cap": cap} for k, cap in [
          ("marshes", "Menna in the marshes"), ("fields", "Sennedjem’s fields"),
          ("harvest", "The harvest"), ("wine", "Ipuy’s vineyard")]]}]),
    ("section", {"label": "The seven rooms", "title": "Ways in, online", "list": [
      "**Tomb Explorer** — search five painted walls in the dark with a torch; each hides three details",
      "**Your Name in Hieroglyphs** and **The Rosetta Stone Decoder** — signs for sounds, a cartouche, and the names Ptolemy and Cleopatra",
      "**Mummification, Step by Step** and **The Weighing of the Heart** — the seventy days, and the scribe Ani’s judgement, told plainly and gently",
      "**Design an Amulet** and **Build Your Own Tomb** — choose symbols for their meanings, then a wall, a chamber and a name to print"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Looking closely: animals and people on the walls", "Signs that stand for sounds", "Symbols that meant life and protection"],
                  "*Tomb Explorer*, *Your Name in Hieroglyphs* and Bastet on poster 2.",
                  "ask *what would you paint on a wall to show the people you love?*")),
      ("Grades 3–4", (["Decoding: one message in three scripts", "The Nile and its three seasons", "Gods as the Egyptians pictured them"],
                  "*The Rosetta Stone Decoder*, poster 1 and *Design an Amulet*.",
                  "write one short message in two different ways")),
      ("Grades 5–6", (["Testing a belief against evidence: who built the pyramids", "Preservation: the seventy days and natron", "How painters organized a wall"],
                  "poster 1, *Mummification, Step by Step* and *Tomb Explorer*.",
                  "*how would you find out whether something you have heard is true?*")),
      ("Grades 7–8", (["Close reading in translation: the Papyrus of Ani", "Kinds of evidence and their limits", "Copies, facsimiles and what they can tell us"],
                  "*The Weighing of the Heart*, poster 1 and the walls’ notes.",
                  "*what makes a source trustworthy?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "The exhibition talks about death, mummies and the afterlife, plainly and gently, with nothing drawn that a young visitor need look away from. For PreK–2, let the painted walls, the hieroglyphs, the amulets and the gods carry the visit; take mummification and the weighing of the heart with older students, and keep to what the rooms say. Ammit, who waits by the scales, is shown waiting, and nothing frightening happens."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "Which room or detail surprised you most, and why?",
        "What can a painted wall tell us that a written record cannot?",
        "What would you want people thousands of years from now to discover about us?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Write a classmate’s name in hieroglyphs inside a cartouche",
        "Design an amulet with a symbol chosen for its meaning",
        "Draw a day of your own in two rows, like a tomb wall"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, room by room", "body": [
      "Ask one, wait, and let students look before anyone answers, at the poster or with the room on screen."]}),
    ("html", asks(ROOMS_Q)),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "The Nile, Kemet and Deshret; the three seasons; who built the pyramids, from Merer’s diary to Hemiunu’s crews; scribes recording the harvest."),
      ("ELA", "The scribe Ani’s words to his heart, in translation; repetition and parallel structure; a translator’s choices."),
      ("Science", "Mummification as preservation: natron, a natural salt, drew out the moisture over 40 of the 70 days; designing a fair test with salt."),
      ("Art", "Tomb walls in rows and borders; one man shown twice; details with meaning; Ipuy’s yellow ground; facsimiles."),
      ("Math", "A rope knotted at regular spaces to measure fields; 40 of 70 days as a fraction; the Great Pyramid, 146 meters tall."),
      ("Languages", "Signs for sounds; reading direction; the Rosetta Stone’s three scripts; Champollion and the names Ptolemy and Cleopatra.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“Slaves built the pyramids.”", "Archaeologists have found the town and tombs of the builders: a workforce of 20,000 to 30,000 Egyptians, kept supplied by inspectors like Merer."),
      ("“Hieroglyphs are just pictures.”", "Many signs stand for sounds. That is how Champollion could read the names Ptolemy and Cleopatra, sign by sign."),
      ("“A mummy is a body wrapped in bandages.”", "Wrapping came near the end. Of the seventy days, forty were spent drying the body in natron, a natural salt.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *one thing the exhibition showed you, and how we know it*",
        "**Think-pair-share:** *why carve one message in three scripts?*",
        "**Quick write:** *which of Ani’s lines about a good life would still matter today?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A museum label for one tomb wall: what it shows, and one detail’s meaning",
        "A decoder card: five signs, their sounds, and a name to crack",
        "A fair test of drying with salt, written up as a scientist would"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K (*Hidden in the Dark*), Grades 1–2 (*Write Like a Scribe*) and Grades 3–4 (*Crack the Code*), and for Grades 5–8 in four subjects: Social Studies (*Who Really Built the Pyramids?*), ELA (*Weighed Against a Feather*), Science (*Seventy Days*) and Art (*Stories on the Wall*). Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** the posters and all seven rooms are online at {SITE_EX}, and every plan and handout is at {RESOURCES}. Even ten minutes with one wall and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Match each source to its kind, sort the Nile’s three seasons, look closely at two pieces of the harvest wall, and finish a claim from sentence starters."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Complete an evidence chart for four sources, explain what the harvest wall can and cannot show, and write a claim, evidence and reasoning paragraph."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Work out a rough date for the Great Pyramid from poster 1, rate each source’s reach, and write an argument that answers the slave myth and names a limit of the evidence.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Who Really Built the Pyramids?</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · Ancient Egypt",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": WALLS["harvest"]["img"], "pos": "center 30%", "credit": WALLS["harvest"]["credit"]},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *Who Really Built the Pyramids?*"]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same sources, the same wall, the same words — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home."]}),
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
      f"Every Ancient Egypt lesson plan — PreK–K, Grades 1–2, Grades 3–4, and Social Studies, ELA, Science and Art for Grades 5–8 — has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
