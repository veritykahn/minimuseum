"""The two adult guides for Women's History Month: Letters From the Blitz:
the Quick Teaching Guide and the teacher sheet on the Green / Yellow / Red
handouts, modelled on In Their Hands' guides.py. Facts follow
app/exhibitions/womens-history/ (womensHistory.ts, violet/, remembered/)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import POSTER1, POSTER2, AF_KLINT, AF_KLINT_CREDIT, PIC_CSS, OVERSHADOWED, photos, md

EXHIBITION = "minimuseumproject.org/exhibitions/womens-history"

# ── the Quick Teaching Guide ───────────────────────────────────────────

def bands(items):
    out = ""
    for name, (lesson, focus, lead, before) in items:
        body = (f'<p class="bl">{md(lesson)}</p><ul>' + "".join(f"<li>{md(i)}</li>" for i in focus) + "</ul>"
                f'<p class="bp"><span>Lead with</span> {md(lead)}</p>'
                f'<p class="bp"><span>Before you go</span> {md(before)}</p>')
        out += f'<div class="band"><h4>{md(name)}</h4>{body}</div>'
    return f'<div class="bands">{out}</div>'

def asks(groups):
    out = '<div class="asks">'
    for title, sub, qs in groups:
        out += (f'<div class="ask"><h4>{md(title)}</h4><p class="aref">{md(sub)}</p><ul>'
                + "".join(f"<li>{md(q)}</li>" for q in qs) + "</ul></div>")
    return out + "</div>"

def subjects(items):
    return '<div class="subj">' + "".join(f'<div><h4>{md(t)}</h4><p>{md(b)}</p></div>' for t, b in items) + "</div>"

def myths(items):
    return '<div class="myths">' + "".join(
        f'<div><p class="m"><span>Misconception</span>{md(a)}</p><p class="r"><span>In the exhibition</span>{md(b)}</p></div>'
        for a, b in items) + "</div>"

GUIDE_CSS = PIC_CSS + """
.bands { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt 12pt; margin: 4pt 0 12pt; }
.band { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 7pt 10pt 3pt; break-inside: avoid; }
.band h4 { font-size: 14pt; margin-bottom: 1pt; }
.band .bl { font: italic 400 11pt 'Cormorant Garamond', serif; margin: 0 0 3pt; }
.band ul { margin: 0 0 4pt; font-size: 9pt; } .band li { margin-bottom: 1pt; }
.band .bp { font-size: 9pt; margin: 0 0 3pt; }
.band .bp span { font: 500 6.8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 3pt; }
.asks { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 16pt; margin: 4pt 0 10pt; }
.ask { break-inside: avoid; border-top: .6pt solid #d8d4c8; padding-top: 4pt; }
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
.three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin: 4pt 0 10pt; break-inside: avoid; }
.three figure { margin: 0; } .three img { width: 100%; height: 150pt; object-fit: contain; display: block; }
.three figcaption { font: 400 7.4pt/1.35 'Outfit'; color: #3f3e3a; margin-top: 3pt; text-align: center; }
"""

VISIT = [
  ("Poster 1", "Women’s History Month · the painting · women in wartime", [
    "The month began as one week in one town. How did it grow?",
    "Why might the Santa Rosa organizers have chosen the week of March 8?",
    "Hilma af Klint never showed her abstract paintings in an exhibition. What do we lose when an artist is overlooked?"]),
  ("Poster 2", "Biography of a Working Class Woman", [
    "What do the four photographs tell us? What can’t they?",
    "Violet left school at 14. What does that tell us about life for working families then?",
    "Who wrote this biography, and how might that shape it?"]),
  ("The display case", "Blitz bomb-damaged family letters", [
    "The letters are not transcribed. What could they tell a historian? What could they never tell?",
    "Why might a family keep letters a bomb had damaged?"]),
  ("Who Gets Remembered?", "The Top 50 · Tip the scale · Talk About It", [
    "Only 3 of the 50 people with the most monuments are women. Why might that be?",
    "Which facts are evidence that women have been overlooked, and which are only true?",
    "Whose story in your family would you collect?"]),
]

GUIDE = {
  "out": "WH_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Letters From the Blitz",
  "sub": "Women’s History Month · Everything you need to plan a visit or a virtual visit, PreK–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": AF_KLINT, "pos": "center 40%", "credit": AF_KLINT_CREDIT},
  "blocks": [
    ("chips", ["Two posters", "One display case", "Two rooms online", "PreK–8"]),
    ("section", {"label": "Exhibition overview", "title": "A month, and a life", "body": [
      "**Poster 1** tells how Women’s History Month began: a week-long celebration in Santa Rosa, California, in 1978; the first National Women’s History Week, declared by President Jimmy Carter in 1980; and the whole month of March by 1987. It carries Hilma af Klint’s *The Ten Largest, No. 1, Childhood* (1907), a panel on women’s work in the Second World War, and the Imperial War Museum’s Women’s Work Collection, begun in 1917.",
      "**Poster 2** is the biography of Violet Dina Want (1907–1988), a London machinist, mother of four and keeper of roses, written down by her family so it would not be lost, with four family photographs. **The display case** holds one object: *original Blitz bomb-damaged family letters from Violet Dina Want’s estate*, shown in an archival glass case and not transcribed.",
      "**The core message,** in poster 1’s words: *“" + OVERSHADOWED + "”* Women’s lives are understood not only through famous names, but through the everyday lives of ordinary women."]}),
    ("html", '<div class="three"><figure><img src="' + POSTER1 + '" alt=""><figcaption>Poster 1 · Women’s History Month</figcaption></figure>'
             '<figure><img src="' + AF_KLINT + '" alt=""><figcaption>Hilma af Klint, <i>Childhood</i>, 1907</figcaption></figure>'
             '<figure><img src="' + POSTER2 + '" alt=""><figcaption>Poster 2 · Violet Dina Want</figcaption></figure></div>'),
    ("section", {"label": "Online", "title": "Two rooms", "list": [
      "**Violet’s Life** — her story stop by stop, each with a small drawn keepsake, and a timeline students can make of their own",
      "**Who Gets Remembered?** — the Top 50 people with the most public monuments in the United States (Monument Lab, 2021), *Tip the scale* (which facts are evidence?) and *Talk About It* (an oral-history interview guide)"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin with each age"}),
    ("html", bands([
      ("PreK–K", ("Violet’s Big Family", ["A big family, a home, a piano and roses", "Counting the people in a photograph", "Letters as a way to keep in touch"],
                  "poster 2’s photographs and the knees-up piano.", "ask *who is in your family?*")),
      ("Grades 1–2", ("Violet’s Keepsakes", ["A life told in objects, in order", "First, next, last", "Choosing a keepsake for your own life"],
                  "the *Violet’s Life* room’s keepsakes.", "ask *what object tells a story about you?*")),
      ("Grades 3–4", ("History at Home", ["How Women’s History Month began", "3 of 50 statues: whose stories get remembered", "A photograph and a biography as evidence"],
                  "*Who Gets Remembered?* and poster 2’s photographs.", "ask *whose statues are near our school?*")),
      ("Grades 5–8", ("Four subject lessons", ["Social Studies: *The War at Home*", "ELA: *Everybody Has a Story*", "Math: *Who Counts?* · Art: *A Life in Shapes*"],
                  "the display case, *Who Gets Remembered?* and both posters.", "ask *what would a historian need to tell your family’s story?*")),
    ])),
    ("section", {"label": "A note for the youngest", "body": [
      "Poster 2 tells plainly how the bombing of the Blitz destroyed the family’s homes and how Violet’s mother was killed, and the *Violet’s Life* room’s garden stop tells what happened to her pet rabbit. For PreK–4, the lessons keep to Violet’s home, work and family: skip the Blitz stop and the garden stop’s last line. The Top 50 in *Who Gets Remembered?* includes four Confederate leaders, with a note of context; read it before you open the room."]}),
    ("section", {"label": "During the visit", "title": "Guided questions", "body": [
      "Ask one, wait, and let students look before anyone answers, in front of the posters or with the exhibition on screen."]}),
    ("html", asks(VISIT)),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "The home front in the Second World War; primary and secondary sources; how Women’s History Month grew from one week to a month; who chooses what is remembered."),
      ("ELA", "Poster 2 as a mentor biography: a claim proved by details; the oral-history interview; writing a life."),
      ("Math", "3 of 50 as 6%; 22 mermaids to 2 congresswomen; the median of the Top 50; years and ages on Violet’s timeline."),
      ("Art", "Hilma af Klint’s abstraction; poster 2’s lettering, typewriter text and film-negative photographs; a life in keepsakes."),
      ("Music", "Violet played the piano by ear at “knees-up” parties, and in her seventies came to love Strauss waltzes on the radio."),
      ("Science", "Violet’s garden and the greengrocer’s: roses, beans and peas, and cauliflowers chosen with their inner leaves curled over to keep the curds white.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“History is about famous people.”", "Poster 1 says women’s lives are understood through overlooked inventors, activists, artists and writers, and through the everyday lives of ordinary women."),
      ("“Women’s History Month has always been there.”", "It began as one week in Santa Rosa, California, in 1978, and became the month of March by 1987."),
      ("“A family story isn’t real history.”", "Violet’s biography and letters are sources, like any other. Historians ask who made them, when, and what they can and can’t show.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *name one thing Violet’s life shows about everyday life long ago*",
        "**Think-pair-share:** *why might so few women have monuments?*",
        "**Quick write:** *whose story in your family should be remembered, and why?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "An interview with a woman in your family, using *Talk About It*",
        "A keepsake timeline of a life, yours or a relative’s",
        "A count of the monuments and street names near your school"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "**Full lesson plans** are written for PreK–K, Grades 1–2 and Grades 3–4, and for Grades 5–8 in four subjects: Social Studies, ELA, Math and Art. Each comes with three student handouts, **Green** (more support), **Yellow** (grade level) and **Red** (go deeper), and students choose their own. *Using the Differentiated Student Handouts* explains the system; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** both posters and both rooms are online at {EXHIBITION}. Even ten minutes with one photograph and one good question is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Color three women among fifty statues, read a family photograph with a checklist, and put four moments of Violet’s life in order."),
      ("Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Fill in how Women’s History Month began, work out 3 of 50 as a percent, and read details of Violet’s life as evidence."),
      ("Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Weigh facts as evidence for poster 1’s claim, compare a statue with a family biography, and write the plaque for a monument of their own.")]

def level_cards():
    out = ""
    for name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>History at Home</i></span>{md(ex)}</p></div>')
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
  "sub": "A guide to self-selection and flexible differentiation · Women’s History Month",
  "foot": "Teacher Guide · Differentiated Handouts", "css": DIFF_CSS,
  "hero": {"img": POSTER1, "pos": "center 36%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic, not on a permanent ability label. Here is how the three levels look in the Grades 3–4 lesson, *History at Home*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts, the same posters and the same story of Violet’s life, but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and ends with something to share with family."]}),
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
      f"Every Women’s History Month lesson plan, for PreK–K, Grades 1–2, Grades 3–4, and Social Studies, ELA, Math and Art for Grades 5–8, has its Green, Yellow and Red handouts beside it."]}),
  ]}

DOCS = [GUIDE, DIFF]
