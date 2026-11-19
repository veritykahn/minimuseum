"""The two adult guides for The Great War: the Quick Teaching Guide and the
teacher sheet on the Green / Yellow / Red handouts. Facts follow
app/exhibitions/great-war/greatWar.ts (the posters, their talk questions and
the display case), silence/film.ts and memorial/. The handouts sheet adapts
the Mini Museum's existing "Using Differentiated Student Handouts" teacher
guide, as resources-src/in-their-hands/guides.py does."""

import html, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

SITE = "minimuseumproject.org/exhibitions/great-war"

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
    """Guided questions stop by stop, grouped by part of the exhibition."""
    out = ""
    for label, stops in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for c in stops:
            src = disk(c["img"]) if c["img"].endswith(".webp") else c["img"]
            out += (f'<div class="ask"><img src="{src}" alt=""><div><h4>{md(c["title"])}</h4>'
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
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 2pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.askcase { margin: 6pt 0 5pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 16pt; }
.ask { display: grid; grid-template-columns: 50pt 1fr; gap: 9pt; align-items: start; break-inside: avoid; }
.ask img { width: 50pt; height: 50pt; object-fit: cover; border-radius: 3pt; }
.ask img[src*="case/"] { object-fit: contain; }
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
.gallery .glab { margin: 4pt 0 5pt; }
.grow { gap: 8pt; margin-bottom: 7pt; }
.grow img { width: 100%; height: 92pt; object-fit: contain; }
.grow figcaption { font-size: 7.3pt; }
""" + CASE_CSS

GALLERY = [
  {"label": "The two posters", "items": [
    {"img": POSTER1, "cap": "The Doughboys: America’s Sons in The Great War"},
    {"img": POSTER2, "cap": "When the Guns Fell Silent at the 11th Hour"}]},
  {"label": "The display case", "items": [
    {"img": disk(HELMET), "cap": "M1917 Brodie doughboy helmet, American Legion decal"},
    {"img": disk(KIT), "cap": "US Army issue shaving kit"}]}]

QUESTIONS = [
  ("The posters", [
    {"img": POSTER1, "title": "The Doughboys", "ref": "Poster 1 · April 1917 onward",
     "q": ["They were farmers, factory workers and teenagers. What do you think it felt like to leave an ordinary life at home and go to war?",
           "What does courage look like to you? Why do you think the poster ends with *That’s why we remember them*?"]},
    {"img": POSTER2, "title": "When the Guns Fell Silent", "ref": "Poster 2 · 11:00 AM, November 11, 1918",
     "q": ["Imagine the moment the guns stopped. What do you think the soldiers on both sides felt in that silence?",
           "Why might people choose silence, rather than words, to honor those who died?"]}]),
  ("The display case", [
    {"img": HELMET, "title": "The Brodie helmet", "ref": "M1917 · American Legion decal",
     "q": ["Why a wide brim? Why paint it with sand or sawdust?",
           "The decal is the American Legion’s, founded by veterans in Paris in 1919. What does it tell you about the helmet’s life after the war?"]},
    {"img": KIT, "title": "The shaving kit", "ref": "US Army issue",
     "q": ["The soldiers kept their razors when they came home. What would you keep, and why?"]}]),
  ("Online", [
    {"img": RECORD_IMG, "title": "When the Guns Fell Silent", "ref": "The short film · the 1918 record",
     "q": ["The six title cards all begin *After…* until the last. Why?",
           "The record shows all guns firing, then all guns silent. What changed at 11:00?"]},
    {"img": ROOM_MEMORIAL, "title": "The Memorial", "ref": "A poppy · a soldier · the silence",
     "q": ["Read one card aloud. What can a card tell you, and what can it not?",
           "The poster ends with a promise: *you will not be forgotten.* How could you keep that promise in your own way?"]}])]

LESSONS = [("PreK–K", "Quiet at Eleven", "poppies, a clock and a quiet time"),
           ("Grades 1–2", "What Came Home", "a helmet, a razor and the doughboys"),
           ("Grades 3–4", "Remember a Soldier", "reading the Memorial’s cards"),
           ("Grades 5–8 · Social Studies", "The Last Minute of the War", "the 1918 sound-ranging record as a source"),
           ("Grades 5–8 · ELA", "The Language of Remembrance", "anaphora, careful words and an epitaph"),
           ("Grades 5–8 · Art", "Silhouette and Poppy", "palette, silhouette and symbol"),
           ("Grades 5–8 · Music", "Music for Remembering", "marches, a Largo and the silence")]

GUIDE = {
  "out": "GW_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "The Great War",
  "sub": "When the Guns Fell Silent · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS + OBJ_CSS,
  "hero": {"img": SILHOUETTE, "pos": "center 45%"},
  "blocks": [
    ("chips", ["Two posters", "A display case", "Two rooms online", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "The doughboys, and the eleventh hour", "body": [
      "The exhibition remembers the Americans who served in the Great War and the moment it ended. **The Doughboys: America’s Sons in The Great War** follows the farmers, factory workers and teenagers who crossed the Atlantic after April 1917. **When the Guns Fell Silent at the 11th Hour** tells of the armistice at 11:00 AM on November 11, 1918, of the poppies, and of how the day became Armistice Day in 1919 and Veterans Day in 1954. **The display case** holds an M1917 Brodie doughboy helmet with an American Legion decal and a US Army issue shaving kit, beside a backlit silhouette display, soldier cards to take home and an iPad Armistice audio station.",
      "**The core message** is the posters’ own: ordinary young men showed extraordinary courage, and we keep a promise to them. *You will not be forgotten.*"]}),
    ("gallery", GALLERY),
    ("section", {"label": "Online", "title": "Two rooms", "list": [
      "**When the Guns Fell Silent** — a short film: a countdown, six title cards, and the 1918 sound-ranging record of the last minute of the war, with the guns cut dead at 11:00 and then only the wind and a single bird",
      "**The Memorial** — *Place a poppy*; *Remember a soldier*, a card for one American who died, drawn from the records of the American Battle Monuments Commission and searchable by name or state; and *The silence at 11:00*, two minutes’ silence kept together",
      "**The posters online** — each read aloud, with its room’s music and questions to talk about"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–2", (["Remembering, and saying thank you", "Poppies and the quiet at eleven o’clock", "Things a soldier carried: a helmet, a razor"],
                  "*The Memorial*’s poppies, the display case and the two minutes’ silence.",
                  "ask *what does it mean to remember someone?*")),
      ("Grades 3–4", (["One person, one card: reading a memorial record", "From Armistice Day to Veterans Day", "Those whose names we’ll never know"],
                  "*Remember a soldier*, the date in red on the poster, and the Tomb of the Unknown Soldier.",
                  "ask *does anyone in our families have a story of serving?*")),
      ("Grades 5–6", (["Who the doughboys were, and why they went", "The last minute: a record made at the time", "Why November 11 became a national day"],
                  "both posters, the film and the display case.",
                  "*why might a whole country stop for two minutes?*")),
      ("Grades 7–8", (["Sourcing and corroborating: the record, the poster and the film", "Numbers in scale, and the people behind them", "How words, images and music are chosen to make us remember"],
                  "the When the Guns Fell Silent poster and the film.",
                  "*the war to end all wars: what did the poster mean, and was it true?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "Both posters describe the war honestly: the trenches, poison gas, and how many died, even on the last morning. For PreK–4, leave those parts and the trench photographs to the older grades. Keep to remembrance, peace, the poppies, the people at home and the quiet at eleven o’clock. The lessons for these grades do exactly that."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "What will you remember from the exhibition?",
        "Why do you think a small flower like the poppy became a way to remember so many people?",
        "Who would you like to thank on Veterans Day?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Keep the two minutes’ silence at 11:00 on November 11",
        "Make a poppy, or a remembrance card with a silhouette",
        "Write a thank-you to a veteran"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, stop by stop", "body": [
      "Ask one, wait, and let students look before anyone answers. Many of these are the exhibition’s own questions."]}),
    ("html", asks(QUESTIONS)),

    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "America’s entry into the war in April 1917; the armistice; Armistice Day (1919) and Veterans Day (1954); Remembrance Day in Canada, Britain and France; the sound-ranging record as a primary source."),
      ("ELA", "The six title cards and anaphora; *the eleventh hour, the eleventh day, the eleventh month*; careful words like *possibly* and *legend says*; the epitaph *known but to God*."),
      ("Art", "Two posters in black, gray, off-white and one red; the silhouette, a figure who stands for many; the poppy, the cross and the helmet as symbols."),
      ("Music", "Sousa’s *The Stars and Stripes Forever* and his funeral march *In Memoriam*; Dvořák’s and Handel’s Largos on records of 1912 and 1908; bells, and silence."),
      ("Math", "1,568 days; 116,000 as 53,000 and 63,000; around 20 million; 10:58, a minute later, 11:00; elapsed time from 1918 to today."),
      ("Science", "A helmet pressed from one piece of manganese steel, its paint mixed with sand so it would not catch the light; sound recorded as lines on film.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“The last morning of the war was peaceful.”", "Some commanders still ordered attacks that morning. Nearly 11,000 soldiers became casualties on November 11 alone; the last American died a minute after 10:58."),
      ("“Most soldiers who died were killed in battle.”", "Of over 116,000 American soldiers who died, 53,000 died in combat and another 63,000 from disease and accidents."),
      ("“Veterans Day is about World War I.”", "It began as Armistice Day in 1919. In 1954 Congress renamed it Veterans Day, to honor all American veterans.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one thing that happened at 11:00 AM on November 11, 1918, and one way we remember it today*",
        "**Think-pair-share:** *why might people choose silence, rather than words, to honor those who died?*",
        "**Quick write:** *what does a memorial card tell you, and what can it not?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A remembrance panel in black, gray, white and one red",
        "A timeline from April 1917 to Veterans Day today",
        "Two minutes of remembrance in sound, beginning at 11:00"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for every grade band: " + "; ".join(f"**{g}**, *{t}* ({d})" for g, t, d in LESSONS) + ". Each comes with three student handouts, **Green** (more support), **Yellow** (grade level) and **Red** (go deeper), and students choose their own. All three levels work from the same sources, so the class can talk together afterward. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** the posters, the film and *The Memorial* are online at {SITE}. Even ten minutes and two minutes’ silence is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

# The level colors and tints are build.py's LEVELS and TINTS.
LV = [("green", "Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Read the record’s words and lines, match each number to what it counts, and put five dates from 1917 to today in order."),
      ("yellow", "Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Source the record, compare it with the poster’s account of the last hour, and explain why Armistice Day became Veterans Day."),
      ("red", "Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Corroborate the record, the poster and the film, weigh what one source can prove, and argue why the war is still remembered.")]

def level_cards():
    out = ""
    for _, name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>The Last Minute of the War</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · The Great War",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": POSTER2, "pos": "center 80%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic, not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *The Last Minute of the War*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts, the same record and the same dates, but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home."]}),
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
      "Every Great War lesson plan (PreK–K, Grades 1–2, Grades 3–4, and Social Studies, ELA, Art and Music for Grades 5–8) has its Green, Yellow and Red handouts beside it."]}),
  ]}

DOCS = [GUIDE, DIFF]
