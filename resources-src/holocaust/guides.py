"""The two adult guides for International Holocaust Remembrance Day: the
Quick Teaching Guide and the teacher sheet on the Green / Yellow / Red
handouts. Every fact follows app/exhibitions/holocaust/ (holocaust.ts, the
Walk, Lay a Stone, A Minute's Stillness and the Timeline of the Holocaust).
The layouts and the handouts sheet's general text are In Their Hands'
(resources-src/in-their-hands/guides.py), which adapts the Mini Museum's
existing "Using Differentiated Student Handouts" teacher guide; its
example here is the Grades 5–8 Social Studies lesson, Step by Step."""

import os, sys, importlib.util
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import (BIRKENAU, BERLIN, CANDLES, EXH, TEACH_NOTE, SHOAH_LINE, STEP_LINE, PHOTO_CSS, FOOT_CSS, photo, printed)

# the In Their Hands guide's helpers and styles, so the two sets match
_spec = importlib.util.spec_from_file_location(
    "ith_guides", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "in-their-hands", "guides.py"))
ith = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ith)
md, bands, subjects, myths, steps, checks, say_avoid = ith.md, ith.bands, ith.subjects, ith.myths, ith.steps, ith.checks, ith.say_avoid

RESOURCES = "minimuseumproject.org/exhibitions/holocaust/resources"

def ital(s):
    return md(s)

PHOTOS = ('<div class="photos3">'
          + photo(CANDLES["img"], "<b>Candles</b> lit to remember.", ital(CANDLES["credit"]))
          + photo(BERLIN["img"], "<b>The Memorial to the Murdered Jews of Europe</b>, Berlin.", ital(BERLIN["credit"]))
          + photo(BIRKENAU["img"], "<b>The International Monument</b>, Auschwitz II-Birkenau.", ital(BIRKENAU["credit"]))
          + "</div>")

# Questions in front of each part, as the exhibition asks them (its talk
# questions, A Minute's Stillness, the Walk and the case).
PLACES = [
  ("The posters", [
    {"img": EXH + "commons-candles.jpg", "title": "International Holocaust Remembrance Day", "ref": "Poster 1",
     "q": ["The poster names hatred, discrimination, and indifference. What everyday choices can people make to help build a safer, more inclusive world?",
           "Why might it matter to remember those who helped, as well as those who were harmed?"]},
    {"img": EXH + "poster-stones.jpg", "title": "What Was the Holocaust?", "ref": "Poster 2 · five chapters",
     "q": ["The Holocaust did not begin with camps. What small steps, like the laws and the book burnings, came first?",
           "Whole villages and a whole country helped their neighbors. What helps people act together for others?"]},
  ]),
  ("The rooms", [
    {"img": EXH + "rooms/walk.webp", "title": "The Walk", "ref": "A film, then a walk",
     "q": ["The film says: *“It did not happen all at once. It happened step by step.”* Which step surprised you?",
           "Why remember children by name, one at a time?"]},
    {"img": EXH + "rooms/stones.webp", "title": "Lay a Stone", "ref": "The memorial stone",
     "q": ["Why does a stone last where flowers fade?",
           "How do people in your family remember those they have lost?"]},
    {"img": EXH + "rooms/stillness.webp", "title": "A Minute’s Stillness", "ref": "Niemöller’s words, and a minute",
     "q": ["Martin Niemöller’s poem is about people who did not speak out. When is it hard to speak up for someone else?",
           "Whose name will you carry with you today?"]},
    {"img": EXH + "rooms/timeline.webp", "title": "The Timeline of the Holocaust", "ref": "January 1933 to May 1945",
     "q": ["Open *Look closer* on one date. What does the photograph show today?",
           "Which date would you want everyone to know? Why?"]},
  ]),
]

def asks(groups):
    """Guided questions place by place; a WebP picture goes by its own file."""
    out = ""
    for label, items in groups:
        out += f'<p class="label askcase">{md(label)}</p><div class="asks">'
        for c in items:
            src = printed(c["img"]) if c["img"].endswith(".webp") else c["img"]
            out += (f'<div class="ask"><img src="{src}" alt=""><div><h4>{md(c["title"])}</h4>'
                    f'<p class="aref">{md(c["ref"])}</p><ul>' + "".join(f"<li>{md(q)}</li>" for q in c["q"]) + "</ul></div></div>")
        out += "</div>"
    return out

GUIDE_CSS = FOOT_CSS + PHOTO_CSS + ith.GUIDE_CSS + """
.photos3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 12pt; break-inside: avoid; }
.photos3 .photo img { height: 92pt; }
.ask { grid-template-columns: 62pt 1fr; }
.ask img { width: 62pt; height: 40pt; object-fit: cover; border-radius: 2pt; }
.bands { grid-template-columns: 1fr 1fr; }
"""

GUIDE = {
  "out": "HOL_Teaching_Guide.pdf", "eyebrow": "Quick teaching guide", "title": "Holocaust Remembrance Day",
  "sub": "Never Forget · Everything you need to plan a visit or a virtual visit, grades 5–8",
  "foot": "Quick Teaching Guide", "css": GUIDE_CSS,
  "hero": BIRKENAU,
  "blocks": [
    ("chips", ["Two posters", "Four rooms", "A display case", "Grades 6 and up"]),
    ("section", {"label": "Exhibition overview", "title": "Never Forget", "body": [
      "International Holocaust Remembrance Day is observed every year on **January 27**, the day Auschwitz-Birkenau was liberated in 1945. The exhibition remembers the six million Jewish people murdered by the Nazi regime, and the millions of other victims who were persecuted. " + SHOAH_LINE,
      "**The core message:** *" + STEP_LINE + "* People made choices at every step — those who persecuted, those who stood by, and those who helped. The exhibition remembers the victims as people, by name, and honors the rescuers."]}),
    ("html", PHOTOS),
    ("section", {"label": "Around the exhibition", "title": "Seven ways in", "list": [
      "**Poster 1, International Holocaust Remembrance Day** — why the day is kept, Auschwitz’s liberation, later genocides, and the candle in the window",
      "**Poster 2, What Was the Holocaust?** — in chapters: *Step by step*, *Children*, *Rescue* and *After*, with Martin Niemöller’s *First They Came*",
      "**The Walk** — a short film of the history, then a walk across a floor of iron faces and empty shoes, remembering children by name",
      "**Lay a Stone** — a stone on the memorial, and the days counted to January 27",
      "**A Minute’s Stillness** — a minute with a name, someone’s words and a question to sit with",
      "**The Timeline of the Holocaust** — January 1933 to May 1945, a date at a time, with *Look closer* on each photograph",
      "**The display case** — an original 1 Krone Theresienstadt ghetto scrip; a replica of a brass mezuzah recovered in Warsaw by a survivor; brass and pottery Shabbat candle holders"]}),
    ("section", {"label": "Suggested approaches by grade", "title": "Where to begin"}),
    ("html", bands([
      ("Grade 5, and younger", (["Jewish life before 1933, and people by name", "How small steps came before the camps", "The helpers: Miep Gies, the Danish fishermen, Le Chambon"],
                  "Poster 2’s *Children* and *Rescue* chapters, and *Lay a Stone*. Preview first, and stay with them.",
                  "*whose name will you carry with you today?*")),
      ("Grades 6–8", (["The steps from the boycott to the killing centers", "Diaries and testimony, quoted in context", "How memorials, sound and silence remember"],
                  "the Walk’s film, the timeline and *A Minute’s Stillness*.",
                  "*why might it matter to notice small steps?*")),
    ])),
    ("section", {"label": "How to teach it", "body": [
      f"**The exhibition’s guidance:** *{TEACH_NOTE}* The exhibition follows established practice for teaching the Holocaust, and so do these plans: nothing graphic; no simulation or role-play of victims or perpetrators; people before numbers, by name; precise words (*murdered*, not *lost*; the Nazis’ terms in quotation marks); and answers that say so when a question is hard."]}),
    ("cols", [
      [("section", {"label": "After the visit", "title": "Quick discussion", "list": [
        "What did you see or read that you keep thinking about?",
        "Whose name or words do you remember?",
        "What helps a person find the courage to speak up for others?"]})],
      [("section", {"label": "Simple extensions", "title": "Take it further", "list": [
        "Light a candle on January 27, and say one name",
        "Keep a minute’s stillness as a class",
        "Write a remembrance label for one person, in their own words"]})]]),

    ("pagebreak", None),
    ("section", {"label": "During the visit", "title": "Guided questions, place by place", "body": [
      "Ask one, wait, and let students look before anyone answers. The questions are the exhibition’s own, or close to them."]}),
    ("html", asks(PLACES)),
    ("cols", [
      [("section", {"label": "At the display case", "list": [
        "The 1 Krone note was made for Theresienstadt. Prisoners were not allowed real money. Why make scrip at all?",
        "A mezuzah and Shabbat candle holders: what do they tell us about Jewish life and faith?"]})],
      [("section", {"label": "At the end", "list": [
        "Elie Wiesel said survivors chose *“to work for humankind.”* What is one small thing you could do for someone else this week?",
        "What will you remember?"]})]]),

    ("pagebreak", None),
    ("section", {"label": "Subject connections", "title": "One exhibition, six subjects"}),
    ("html", subjects([
      ("Social Studies", "The steps from the April 1933 boycott to the killing centers; the Wannsee Conference; rescue in Denmark and Le Chambon; the Stockholm Declaration; later genocides."),
      ("ELA", "Anne and Margot Frank, Petr Ginz, Yitskhok Rudashevski and others who kept writing; testimony remembered later; quoting in context."),
      ("Art", "Memorials as works of art: Treblinka’s field of stones, Berlin’s concrete blocks, Babyn Yar’s menorah, the empty library under Bebelplatz; the Walk itself."),
      ("Music", "The posters’ three quiet sounds and no music; the film’s music that ends on the toll; the iron steps; a minute with no sound at all."),
      ("Civics", "Niemöller’s *First They Came*; upstanders and bystanders; the Righteous Among the Nations, more than 28,000 people."),
      ("Geography", "The timeline’s places on a map: Berlin, Vienna, Warsaw, Kyiv, Chełmno, Amsterdam, Denmark and Normandy — and where they are today.")])),
    ("section", {"label": "Common misconceptions", "title": "What students often think"}),
    ("html", myths([
      ("“It began with the camps.”", "It did not happen all at once. It began with laws, a boycott and book burnings, and went step by step."),
      ("“No one fought back or helped.”", "About 700 young fighters rose up in the Warsaw ghetto. Denmark’s fishermen ferried some 7,200 Jews to Sweden. Yad Vashem has honored more than 28,000 rescuers."),
      ("“Anne Frank thought people were good.”", "The Anne Frank House warns that line was *“plucked out of context.”* The exhibition always shows the sentence that follows it.")])),
    ("cols", [
      [("section", {"label": "Assessment ideas", "list": [
        "**Exit ticket:** *one step that came before the camps, and what it took away*",
        "**Think-pair-share:** *why remember people by name?*",
        "**Quick write:** *what does Niemöller’s poem ask of us today?*"]})],
      [("section", {"label": "Larger projects", "list": [
        "A remembrance label for one person, quoting them exactly",
        "A memorial design, with an artist’s statement",
        "A one-minute graphic score in which silence is part of the music"]})]]),
    ("section", {"label": "Planning your lessons", "title": "Lesson plans and differentiated handouts", "body": [
      "Because the exhibition is recommended for grades 6 and up, its **full lesson plans** are written for Grades 5–8 only, in four subjects: Social Studies (*Step by Step*), ELA (*In Their Own Words*), Art (*How Do We Remember?*) and Music (*Sound and Silence*). Each comes with three student handouts — **Green** (more support), **Yellow** (grade level) and **Red** (go deeper) — and students choose their own. *Using the Differentiated Student Handouts* explains the system in two pages; the *Family Resource Guide* goes home with ideas for parents.",
      f"**For a virtual visit,** the posters, the four rooms and the display case are online at minimuseumproject.org/exhibitions/holocaust, and every plan and handout is at {RESOURCES}. Even ten minutes and one name is a visit worth making."]}),
  ]}

# ── Using the Differentiated Student Handouts ──────────────────────────

LV = [("Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support.",
       "Simplified vocabulary, more scaffolding, visual aids.",
       "Read about Jewish life before 1933, sort ten events into four steps, read Steven Frank’s words closely, and finish *First… Then… Later…*"),
      ("Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge.",
       "Grade-level work, done independently.",
       "Read two timeline photographs as primary sources, chart what six events took away, and explain why the Holocaust did not begin with camps."),
      ("Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper.",
       "Extension activities, open-ended challenges.",
       "Compare three accounts of the Wannsee Conference, question a staged photograph, and argue whether the Holocaust was inevitable.")]

def level_cards():
    out = ""
    for name, sub, col, tint, says, what, ex in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{md(says)}”</p><p>{md(what)}</p>'
                f'<p class="ex"><span>In <i>Step by Step</i></span>{md(ex)}</p></div>')
    return f'<div class="lvcards">{out}</div>'

DIFF = {
  "out": "Using Differentiated Student Handouts.pdf", "eyebrow": "Teacher guide",
  "title": "Using the Differentiated Student Handouts",
  "sub": "A guide to self-selection and flexible differentiation · Holocaust Remembrance Day",
  "foot": "Teacher Guide · Differentiated Handouts", "css": FOOT_CSS + ith.DIFF_CSS,
  "hero": BERLIN,
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not on a permanent ability label. Here is how the three levels look in the Grades 5–8 Social Studies lesson, *Step by Step*."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print what you need", "All three levels, or just the ones you expect to use. Each prints on its own soft tint."),
      ("Label by color", "Set the stacks out under clear signs, or in color-coded folders."),
      ("Let students choose", "Say it plainly: *this is about the challenge you want today, not about how smart you are.*"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. It builds metacognition."),
      ("No justification", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts — the same people, the same events, the same words — but adjust the complexity of the vocabulary, the amount of scaffolding, the depth of analysis required and the independence expected. Every level connects to the exhibition, asks for reflection, and can be completed in class or at home. No level, at any challenge, asks a student to imagine being a victim or a perpetrator."]}),
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
      f"Every lesson plan for this exhibition — Social Studies, ELA, Art and Music for Grades 5–8 — has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}

DOCS = [GUIDE, DIFF]
