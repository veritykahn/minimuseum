"""The Harlem Renaissance · the general resources and the PreK–4 lessons.
Re-set in the branded design from the original PDFs, in their own words:
the Teaching Guide, Using Differentiated Student Handouts, the Family
Resource Guide, and the PreK–K, Grades 1–2 and Grades 3–4 lesson plans with
their Green / Yellow / Red handouts."""

import html, re
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import screen_links, WHOLE_MURAL
from _screen import photo, BESSIE

M = "/exhibitions/harlem/images/migration/"
P = "/exhibitions/harlem/"
RESOURCES = "minimuseumproject.org/exhibitions/harlem-renaissance/resources"

# ── small pieces for the handouts ──────────────────────────────────────

CSS = """
.fr { display: flex; align-items: flex-end; gap: 7pt; margin: 2pt 0 4pt; break-inside: avoid; }
.fr span { white-space: nowrap; font-weight: 400; padding-bottom: 2pt; }
.fr i { flex: 1; height: var(--line); border-bottom: .8pt solid #a9a69b; }
.write + .fr, .drawbox + .fr { margin-top: 6pt; }
.opts { display: flex; flex-wrap: wrap; gap: 8pt; margin: 4pt 0 8pt; }
.opts span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 13pt 2pt; background: rgba(255,255,255,.6); font-weight: 400; }
.opts.circle::after { content: "(circle one)"; align-self: center; font: 400 8pt 'Outfit'; color: #5b5a55; }
.matchup { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt 96pt; margin: 8pt 0 10pt; break-inside: avoid; }
.matchup div { display: flex; align-items: center; gap: 8pt; border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 6pt 10pt;
  background: rgba(255,255,255,.6); position: relative; }
.matchup div.l { justify-content: space-between; font-weight: 500; }
.matchup b { width: 9pt; height: 9pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.matchup div.l b { margin-right: -15pt; } .matchup div.r b { margin-left: -15pt; }
.creator { background: rgba(255,255,255,.72); border-top: 3pt solid var(--accent); padding: 7pt 10pt 4pt; break-inside: avoid; }
.creator h4 { margin-bottom: 2pt; }
.creator p { margin: 6pt 0 0; }
.qa p { margin: 6pt 0 0; font-weight: 400; }
"""

def fr(*labels):
    """Sentence frames: the words, then a line to finish on."""
    return ("html", "".join(f'<div class="fr"><span>{l}</span><i></i></div>' for l in labels))

def box(label, h=None):
    """A drawing box that stays where it is put (the build moves "draw" blocks to the end of a task)."""
    st = f' style="height:{h}pt"' if h else ""
    return ("html", f'<div class="drawbox"{st}><span>{label}</span></div>')

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def in_order(blocks):
    """The build sets a task's blocks above its body; where a task has both,
    move the body (and any writing lines) into the blocks so the prompt
    comes first, then the frames, then the lines."""
    for kind, d in blocks:
        if kind == "cols":
            for col in d:
                in_order(col)
        elif kind == "task" and d.get("blocks"):
            head = [("html", "".join(f"<p>{md(x)}</p>" for x in d.pop("body", [])))]
            tail = [("html", lines(d.pop("lines")))] if d.get("lines") else []
            d["blocks"] = head + d["blocks"] + tail
    return blocks

def lines(n):
    return '<div class="write">' + "<i></i>" * n + "</div>"

def fr2(*labels):
    """Sentence frames two across."""
    return ("html", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16pt">'
            + "".join(f'<div class="fr"><span>{l}</span><i></i></div>' for l in labels) + "</div>")

def opts(items, circle=True):
    return ("html", f'<div class="opts{" circle" if circle else ""}">' + "".join(f"<span>{i}</span>" for i in items) + "</div>")

def std(items):
    """Standards as a list, to sit in a column beside the materials."""
    return ("section", {"label": "Standards alignment", "list": [f"**{a}** — {b}" for a, b in items]})

LP_CSS = ".hero { height: 2.0in; }"

def connection_lp():
    return ("connection", [
        "**Option 1 — Visit the exhibition:** If the Harlem Renaissance exhibition is available at your school, bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more firsthand. Ask your librarian to arrange a visit.",
        "**Option 2 — Virtual visit:** Explore the full exhibition online."])


# ── the Teaching Guide ─────────────────────────────────────────────────

GUIDE_CSS = """
.hero { height: 2.1in; }
.cards .card { padding-bottom: 6pt; }
.note { border-left: 3pt solid var(--accent); padding: 4pt 0 2pt 11pt; margin: 4pt 0 12pt; break-inside: avoid; }
.goal { background: #14120f; color: #efe8d6; border-radius: 6pt; padding: 12pt 16pt 7pt; margin: 8pt 0 6pt; break-inside: avoid; }
.goal .label { color: #d8bdf0; }
.goal p:not(.label) { font: 400 13pt/1.38 'Cormorant Garamond', serif; }
.refs { break-inside: avoid; }
.exh { list-style: none; padding: 0; margin: 4pt 0 10pt; display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 16pt; }
.exh li { display: grid; grid-template-columns: 22pt 1fr; gap: 6pt; margin: 0; border-top: 1.2pt solid var(--accent); padding-top: 5pt; font-size: 9pt; break-inside: avoid; }
.exh .cn { font: 500 20pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.exh h4 { margin: 1pt 0 2pt; } .exh p { margin: 0; }
"""

def exhibits(items):
    """The five exhibits, numbered, two across."""
    return '<ol class="exh">' + "".join(
        f'<li><span class="cn">{i:02d}</span><div><h4>{t}</h4><p>{b}</p></div></li>' for i, (t, b) in enumerate(items, 1)) + "</ol>"

GUIDE = {
  "out": "HR_Teaching_Guide.pdf", "eyebrow": "Teaching guide", "title": "The Harlem Renaissance",
  "sub": "A Comprehensive Educator’s Guide", "foot": "Teaching Guide", "css": GUIDE_CSS,
  "hero": {"img": M + "harlem.jpg", "pos": "center 40%"},
  "context": ["**Why this matters:** The Harlem Renaissance was one of the most significant cultural explosions in American history — a flowering of Black art, literature, music, and intellectual life that changed what it meant to be American. For Catholic school students, it is also a story of human dignity, perseverance, and the God-given creativity that flourishes even in the face of injustice. This exhibition brings that story to life through primary sources, interactive exhibits, and rich cross-curricular connections."],
  "blocks": [
    ("section", {"label": "Overview", "title": "About this exhibition", "body": [
      "The Harlem Renaissance (approximately 1920–1935) emerged from the Great Migration, when over one million Black Americans moved north from the Jim Crow South seeking better lives. In Harlem, New York, they built a remarkable world of culture, intellect, and art that would reshape American identity forever.",
      "The Mini Museum’s Harlem Renaissance exhibition features five interactive exhibits that students can explore in person and online:"]}),
    ("html", exhibits([
      ("The Electric Phonograph & Bessie Smith", "A 3D interactive phonograph with authentic 78 RPM recordings of Bessie Smith — the Empress of the Blues — plus historical context on the birth of the recording industry."),
      ("The Fire in the Flint — Walter F. White (1924)", "An interactive first edition of Walter White’s landmark novel, with his biography as one of the NAACP’s most influential — and least known — leaders."),
      ("The Jazz Lab", "Three activities: Build a Band (assemble a jazz ensemble), Jazz Studio (arrange real audio loops), and Name That Instrument (12-round quiz). Over 150 audio loops drawn from period styles."),
      ("The Great Migration Map", "An animated SVG journey from the Mississippi Delta through New Orleans, Memphis, St. Louis, and Chicago to Harlem — with historical photos and period music at each stop."),
      ("Harlem in Words", "An interactive poetry workshop using word banks drawn from six thematic categories — Dreams, Nature, Music, Emotion, Action, and Harlem itself — to create original poetry in the Renaissance tradition.")])),
    ("connection", [
      "**Option 1 — Visit the exhibition:** If the Harlem Renaissance exhibition is available at your school, visit the Mini Museum to experience the physical artifacts and interactive exhibits firsthand. Contact your school librarian to arrange a class visit.",
      "**Option 2 — Virtual visit:** Explore the full exhibition online."]),

    ("section", {"label": "Learning objectives", "title": "What students will learn",
      "body": ["Across all grade levels and subjects, this exhibition develops the following core understandings:"],
      "list": [
        "The Great Migration transformed American demographics, culture, and history between 1910 and 1970",
        "The Harlem Renaissance produced enduring literature, art, and music that shaped American identity",
        "Jazz and blues were original American art forms born from the African American experience",
        "Human dignity and creative expression flourish even under — and in response to — injustice",
        "Individuals can change history: writers, artists, musicians, and activists each played a vital role",
        "Primary sources — novels, music, photographs, maps — are windows into lived historical experience"]}),
    ("section", {"label": "Standards alignment", "title": "Cross-curricular standards"}),
    ("refs", [
      ("CCSS.ELA-LITERACY RI.6-8.1, W.7.3", "Cite textual evidence, analyze primary sources, write narratives drawing on historical context"),
      ("NCSS Standard I (Culture)", "Understand how culture influences behavior, beliefs, and practices; analyze cultural contributions"),
      ("NCSS Standard II (Time, Continuity)", "Understand historical causation; connect the Great Migration to present-day demographics and culture"),
      ("National Arts Standards MU:Re7.1, VA:Re7.1", "Perceive and analyze artistic work; connect music and visual art to historical and cultural context"),
      ("AASL I.B.1 / I.D.2", "Use evidence to investigate questions; evaluate information for accuracy, validity, and context"),
      ("Catholic Identity · CST — Human Dignity", "Recognize the inherent dignity of every person made in God’s image; understand justice as a Gospel value")]),
    ("section", {"label": "Historical background", "title": "Context for educators"}),
    ("cols", [
      [("section", {"label": "The Great Migration (1910–1970)", "body": [
        "Over six million Black Americans left the South in two waves, escaping Jim Crow laws, sharecropping debt, and racial violence. The first wave (1910–1940) brought over a million north, with Harlem becoming the destination of choice for those heading to New York.",
        "By 1930, Harlem held 175,000 Black residents — a self-contained world of Black-owned businesses, newspapers, churches, and cultural institutions."]})],
      [("section", {"label": "The Renaissance (c. 1920–1935)", "body": [
        "What emerged was extraordinary: Langston Hughes and Zora Neale Hurston transformed American literature. Duke Ellington and Bessie Smith defined American music. Aaron Douglas fused African aesthetics with Art Deco modernism.",
        "The movement ended with the Depression, but its impact — on literature, music, civil rights, and American identity — proved permanent."]})]]),

    ("pagebreak", None),
    ("section", {"label": "Pre-visit activities", "title": "Preparing your students"}),
    ("cards", [
      ("The Sound of History (5–10 minutes)", "Play a short clip of Bessie Smith or Duke Ellington — many recordings are freely available on YouTube or Smithsonian Folkways. Ask students: *“What do you notice about this music? How does it make you feel? What do you think was happening in the world when this was recorded?”* Don’t give answers yet — let them wonder."),
      ("Map the Journey (10 minutes)", "Show students a blank map of the United States. Ask them to mark where they think large numbers of Black Americans lived in 1910. Then show the actual migration patterns — north to Chicago, Detroit, New York. Discuss: *“Why might people leave their homes? What would make the risk worth it?”*"),
      ("The Name on the Spine (5 minutes)", "Show students the cover of *The Fire in the Flint* (1924) by Walter F. White. Ask: *“What do you know about this book? Have you heard of Walter White?”* Almost no one will have. Then reveal: this man was one of the most important civil rights leaders of the 20th century — and he looked completely white. Let the paradox sit."),
      ("What Is Jazz? (5 minutes)", "Write on the board: *“Jazz is America’s classical music.”* Ask students to agree or disagree and explain why. After discussion, add: it was also the first music created entirely in America, by Americans — and it changed music worldwide forever.")]),
    ("section", {"label": "Guided questions", "title": "During the exhibition"}),
    ("cols", [
      [("section", {"label": "At the Phonograph", "list": [
        "What was it like to hear recorded music for the first time?",
        "Why might Bessie Smith’s voice have been called “the Empress of the Blues”?",
        "What emotion do you hear in the music?"]}),
       ("section", {"label": "At the Migration Map", "list": [
        "How far is the Mississippi Delta from Harlem?",
        "What changed at each city along the route?",
        "What would you bring if you were making this journey?"]})],
      [("section", {"label": "At the Jazz Lab", "list": [
        "How many instruments make up a jazz ensemble?",
        "What happens when you remove one layer?",
        "Can you identify each instrument by sound alone?"]}),
       ("section", {"label": "At Harlem in Words", "list": [
        "Which word category feels most powerful to you?",
        "How do poets use line breaks to create meaning?",
        "What would Langston Hughes write about today?"]})]]),
    ("html", '<aside class="note"><p class="label">A note on physical artifacts</p><p>If students are visiting the physical exhibition, encourage them to handle artifacts carefully and respectfully. The phonograph, first edition books, and period photographs are primary sources — they connect us directly to the people who made this history. Treat them as you would any sacred object: with attention and gratitude.</p></aside>'),

    ("section", {"label": "Post-visit activities", "title": "Extending the learning"}),
    ("cols", [
      [("section", {"label": "Elementary (PreK–4)", "body": [
        "**My Migration Story:** Discuss that many families have moved — from another country, state, or city. Students draw their family’s journey on a simple map and share one thing that changed and one thing that stayed the same.",
        "**Listen & Draw:** Play a short jazz piece. Students draw what they hear — shapes, colors, feelings. No right answers. Discuss how music can paint pictures."]})],
      [("section", {"label": "Middle School (Grades 5–8)", "body": [
        "**Primary Source Analysis:** Using the SOAPSTONE method (Speaker, Occasion, Audience, Purpose, Subject, Tone), analyze an excerpt from *The Fire in the Flint* or a poem by Langston Hughes.",
        "**Parallel Timelines:** Students create a timeline comparing world events (1920–1935) with Harlem Renaissance milestones. What was happening elsewhere while this flourishing occurred?"]})]]),
    ("section", {"label": "Assessment ideas", "title": "Checking for understanding", "list": [
      "**Exit Ticket:** *“Name one person from the Harlem Renaissance and explain what they contributed.”* (Simple recall, any grade)",
      "**Think-Pair-Share:** *“Why do you think this period is called a ‘Renaissance’? What does that word mean, and does it fit?”* (Grades 3+)",
      "**Quick Write:** *“If you had been living in Harlem in 1925, what would you most want to create — a poem, a song, a painting, or a speech? Why?”* (Grades 4+)",
      "**Research Project:** Choose one figure from the Harlem Renaissance, research their life and work, and present to the class in role as that person. (Grades 5+)"]}),
    ("section", {"label": "Recommended reading", "title": "Resources for educators"}),
    ("cols", [
      [("section", {"label": "For teachers", "list": [
        "*The Harlem Renaissance* — Steven Watson (overview)",
        "*When Harlem Was in Vogue* — David Levering Lewis",
        "*The New Negro* — Alain Locke (primary source anthology)",
        "Smithsonian National Museum of African American History and Culture: nmaahc.si.edu"]})],
      [("section", {"label": "For students", "list": [
        "*The Weary Blues* — Langston Hughes (poetry)",
        "*Harlem’s Little Blackbird* — Renée Watson (PreK–2)",
        "*Voice of Freedom* — Carole Boston Weatherford (Grades 3–6)",
        "*Josephine* — Patricia Hruby Powell (Grades 3–7)",
        "PBS LearningMedia: Harlem Renaissance unit resources"]})]]),
    ("html", '<div class="goal"><p class="label">Key takeaway for students</p><p>The Harlem Renaissance happened because people refused to let injustice silence them. Writers wrote. Musicians played. Artists painted. Poets spoke. In a world that tried to tell them they were less than human, they responded with extraordinary beauty and truth. That is the power of the human spirit — made, as we believe, in the image of God.</p></div>'),
  ]}


# ── Using the Differentiated Student Handouts ──────────────────────────
# The In Their Hands sheet's layout, with this exhibition's own wording.

LV = [("Green Level", "More Support", "#4A7346", "#D6E5D0", "I want more support",
       "Simplified vocabulary, more scaffolding, visual aids"),
      ("Yellow Level", "Grade Level", "#86671A", "#F1DFA8", "I’m ready for a challenge",
       "Grade-level appropriate, independent work"),
      ("Red Level", "Go Deeper", "#A8452F", "#EFCEC2", "I want to go deeper",
       "Extension activities, open-ended challenges")]

def level_cards():
    out = ""
    for name, sub, col, tint, says, what in LV:
        out += (f'<div class="lvc" style="--lv:{col};background:{tint}"><p class="lvb">{name}<small>{sub}</small></p>'
                f'<p class="says">“{says}”</p><p>{what}</p></div>')
    return f'<div class="lvcards">{out}</div>'

def steps(items):
    return '<ol class="steps">' + "".join(
        f'<li><span class="sn">{i}</span><h4>{t}</h4><p>{b}</p></li>' for i, (t, b) in enumerate(items, 1)) + "</ol>"

def checks(items):
    return '<ul class="checks">' + "".join(f"<li><b>{t}</b> {b}</li>" for t, b in items) + "</ul>"

def say_avoid(say, avoid):
    col = lambda cls, lab, xs: (f'<div class="{cls}"><p class="sa">{lab}</p>'
                                + "".join(f"<p>“{x}”</p>" for x in xs) + "</div>")
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
.goal .label { color: #d8bdf0; }
.goal p:not(.label) { font: 400 13pt/1.35 'Cormorant Garamond', serif; }
.refs { break-inside: avoid; }
.gstrip { display: flex; height: 5pt; margin: 2pt 0 8pt; border-radius: 3pt; overflow: hidden; }
.gstrip i { flex: 1; }
"""

DIFF = {
  "out": "Using Differentiated Student Handouts.pdf", "eyebrow": "Teacher guide",
  "title": "Using the Differentiated Student Handouts",
  "sub": "A guide to self-selection and flexible differentiation · The Harlem Renaissance",
  "foot": "Teacher Guide · Differentiated Student Handouts", "css": DIFF_CSS,
  "hero": {"img": M + "st-louis.jpg", "pos": "center 30%"},
  "blocks": [
    ("section", {"label": "What’s included", "body": [
      "Each Mini Museum lesson plan includes three color-coded student handouts at different challenge levels. Students choose which level they want to work on based on how they feel about the topic — not based on a permanent ability label."]}),
    ("html", level_cards()),
    ("section", {"label": "How to use these handouts", "title": "Five steps"}),
    ("html", steps([
      ("Print the levels you need", "You can print all three or just the ones you anticipate using."),
      ("Display with color-coded labels", "Set out stacks with clear signs or place in color-coded folders."),
      ("Let students choose", "Emphasize: <i>“This is about challenge preference TODAY, not about how smart you are.”</i>"),
      ("Normalize switching", "If a student wants a different challenge, let them switch. This builds metacognition."),
      ("No justification required", "Students don’t have to explain why they chose their level.")])),
    ("section", {"label": "What each handout includes", "body": [
      "All three levels cover the same core concepts but adjust complexity of vocabulary, amount of scaffolding, depth of analysis required, and independence expected.",
      "**All three levels include:** connection to exhibition artifacts, a take-home element for parent engagement, and reflection questions — and can be completed in class OR at home."]}),
    ("section", {"label": "Language matters"}),
    ("html", say_avoid(
      ["Choose the challenge level that feels right for you today.",
       "Green gives more support. Yellow is grade-level. Red goes deeper. All three are good choices.",
       "You can switch levels anytime."],
      ["Green is for struggling students.",
       "Red is for advanced students.",
       "Why did you pick that level?"])),

    ("section", {"label": "Why self-selection works", "title": "Choice without labels"}),
    ("html", checks([
      ("Removes stigma:", "No public ability grouping. Students aren’t labeled “low” or “high.”"),
      ("Builds agency:", "Students develop self-awareness about when they need support vs. challenge."),
      ("Allows flexibility:", "A student might choose Green for science (unfamiliar) and Red for ELA (confident)."),
      ("Differentiates without labeling:", "You’re meeting diverse needs without fixed groups."),
      ("Respects daily variation:", "Students might choose differently on Monday (tired) vs. Thursday (energized).")])),
    ("section", {"label": "Adapting for your classroom"}),
    ("refs", [
      ("If you prefer teacher assignment", "You can still use these handouts by assigning specific levels to specific students based on your knowledge of their needs. The materials work both ways."),
      ("If you want to modify", "Treat each handout as a starting point: leave out a part, add a question, or shorten the writing to suit your class."),
      ("If you only want one level", "That’s fine too! Use whichever level best matches your class.")]),
    ("section", {"label": "What the research says", "body": [
      "Student self-selection of challenge level (sometimes called *“differentiation by choice”*) has been shown to increase student motivation and engagement, develop metacognitive skills, reduce anxiety around differentiation, build growth mindset, and allow teachers to differentiate without public tracking."]}),
    ("html", '<div class="goal"><div class="gstrip"><i style="background:#4A7346"></i><i style="background:#86671A"></i><i style="background:#A8452F"></i></div>'
             '<p class="label">The goal</p><p>Every student engages with the core content at a level that challenges them appropriately. Some need more support to access the content. Some need extensions to stay engaged. Most are ready for grade-level work. All deserve choice and respect.</p></div>'),
    ("section", {"label": "Questions?", "body": [
      "These handouts are designed to make differentiation easier for you, not harder. If something isn’t working, adjust it. The structure is a tool, not a rule.",
      "**Most importantly: the handouts are optional.** The lesson plan itself provides everything you need. The handouts are an additional resource for extending learning, providing practice, or sending work home.",
      f"Every Harlem Renaissance lesson plan has its Green, Yellow and Red handouts beside it at {RESOURCES}."]}),
  ]}


# ── the Family Resource Guide ──────────────────────────────────────────

FAMILY_CSS = """
.hero { height: 2.15in; }
.refs dt { font-weight: 500; font-style: italic; }
.books .label { margin-top: 6pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; break-after: avoid; }
.books .refs { grid-template-columns: 170pt 1fr; gap: 4pt 12pt; font-size: 9.3pt; }
.books .refs dt { font-style: normal; }
.talk { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 8pt 12pt 3pt; margin: 4pt 0 12pt; break-inside: avoid; }
.talk p:not(.label) { font: italic 400 12.5pt/1.38 'Cormorant Garamond', serif; }
.goal { background: #14120f; color: #efe8d6; border-radius: 6pt; padding: 12pt 16pt 7pt; margin: 8pt 0 6pt; break-inside: avoid; }
.goal .label { color: #d8bdf0; }
.goal p:not(.label) { font: 400 13pt/1.38 'Cormorant Garamond', serif; }
.ages .sec li { font: italic 400 11.5pt/1.32 'Cormorant Garamond', serif; margin-bottom: 4pt; }
"""

def books(groups):
    out = ""
    for label, rows in groups:
        out += f'<p class="label">{label}</p><dl class="refs">' + "".join(
            f"<dt><i>{t}</i></dt><dd>{d}</dd>" for t, d in rows) + "</dl>"
    return f'<div class="books">{out}</div>'

FAMILY = {
  "out": "parents/HR_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Family Resource Guide",
  "sub": "The Harlem Renaissance Exhibition", "foot": "Family Resource Guide", "css": FAMILY_CSS,
  "hero": {"img": P + "poster1.jpg", "pos": "center 58%"},
  "context": ["Welcome to the Harlem Renaissance at The Mini Museum. This guide gives your family everything you need to explore the exhibition together — conversation starters, recommended books and recordings, activity ideas for home, and context to help the exhibition make sense. No background knowledge needed. Curiosity is enough."],
  "blocks": [
    ("section", {"label": "What is the Harlem Renaissance?", "title": "A cultural explosion, 100 years ago", "body": [
      "Between roughly 1920 and the mid-1930s, the neighborhood of Harlem in New York City became one of the most creative places in the world. Hundreds of Black artists, writers, musicians, and thinkers had moved north from the South during what historians call the Great Migration — escaping the injustice of Jim Crow laws to find better lives in Northern cities. When they found each other in Harlem, something extraordinary happened.",
      "Poets like Langston Hughes wrote about what it meant to be Black and American at the same time. Painters like Aaron Douglas invented a bold new visual language rooted in African art. Musicians like Duke Ellington and Bessie Smith created jazz and blues that would change music forever. Writers like Zora Neale Hurston collected and celebrated the folk traditions that had survived slavery. Together, they created a Renaissance — a rebirth — that insisted, loudly and beautifully, on the dignity and worth of Black life."]}),
    ("section", {"label": "Key people to know"}),
    ("cols", [
      [("section", {"label": "The artists", "list": [
        "**Aaron Douglas (1899–1979)** — The leading visual artist of the Renaissance. Known for bold geometric silhouettes, concentric circles of light, and paintings that celebrated African heritage.",
        "**Zora Neale Hurston (1891–1960)** — Folklorist, novelist, and playwright who collected African American oral traditions across the South."]})],
      [("section", {"label": "The writers and musicians", "list": [
        "**Langston Hughes (1902–1967)** — America’s most beloved Black poet. His poems sounded like jazz and spoke for working people.",
        "**Duke Ellington (1899–1974)** — Jazz composer and bandleader whose music defined the Harlem sound.",
        "**Bessie Smith (1894–1937)** — “The Empress of the Blues” — one of the most powerful voices in American music."]})]]),
    ("section", {"label": "At the exhibition", "body": [
      "Your child’s class visited (or is visiting) the Harlem Renaissance exhibition at The Mini Museum. The exhibition includes interactive displays, an electric phonograph from the 1920s, jazz listening stations, Aaron Douglas reproductions, a Great Migration map, and the Harlem in Words poetry workshop."]}),
    ("connection", ["You can explore the full digital exhibition online."]),

    ("section", {"label": "Talking with your child", "title": "Conversation starters by age"}),
    ("html", '<div class="ages">'),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
        "“We’re going to look at some paintings made a long time ago. The people in the pictures look like shadows — called silhouettes. Can you see them? What do you think they’re doing?”",
        "“The artist used circles that look like they’re glowing. What do you think the light means?”"]}),
       ("section", {"label": "Grades 1–2", "list": [
        "“Lots of people moved from the South to Harlem, New York — kind of like moving to a completely new place for a better life. Have you ever moved somewhere new, or do you know someone who has?”",
        "“Langston Hughes wrote poems about what it’s like to dream of something better. What’s something you dream about?”"]})],
      [("section", {"label": "Grades 3–8", "list": [
        "“The Harlem Renaissance artists were saying through their art: ‘We are here. Our culture is beautiful. We matter.’ Why do you think it was important to say that through art, specifically — not through a speech or a law?”",
        "“If you were going to create something — a painting, a poem, a song — that showed who you are and where you come from, what would it look like?”",
        "“Is there something happening in the world today that reminds you of what was happening during the Harlem Renaissance? What would Langston Hughes write about right now?”"]})]]),
    ("html", '</div>'),
    ("section", {"label": "At home: simple activities", "title": "Extend the learning together"}),
    ("cards", [
      ("Listen Together", "Find Louis Armstrong’s “West End Blues” (1928), Bessie Smith’s “Downhearted Blues” (1923), or Duke Ellington’s “It Don’t Mean a Thing” (1932) on YouTube or Spotify. As you listen, ask: what instrument do you hear? What does the music make you picture? What year do you think this was made?"),
      ("Silhouette Art", "Tape black paper over a light source and trace your child’s shadow-profile as a silhouette. Let them add a colorful background inspired by Aaron Douglas — concentric circles, geometric patterns, bold colors. Display it alongside a printout of a Douglas painting."),
      ("Family Poetry", "Take turns completing these lines: *“I, too, [describe yourself]… They [something that happened]… But I [how you responded]… Tomorrow, [what you believe will happen].”* This is the structure of Langston Hughes’s “I, Too” — one of the most powerful poems in American history."),
      ("Map the Migration", "Find a US map online. Show your child: Mississippi Delta, Memphis, St. Louis, Chicago, New York City. Trace the route. Ask: *“If you had to leave everything and walk this far — what would you take? What would you leave behind?”*")]),

    ("pagebreak", None),
    ("section", {"label": "Books for every age", "title": "Recommended reading for families"}),
    ("html", books([
      ("Picture books — PreK through Grade 2", [
        ("Duke Ellington: The Piano Prince", "Andrea Davis Pinkney — Caldecott Honor; a warm, musical introduction to Ellington’s life and music"),
        ("Harlem", "Walter Dean Myers / Christopher Myers — a love letter to Harlem in poetry and vibrant illustration; Caldecott Honor"),
        ("Before She Was Harriet", "Lesa Cline-Ransome, illustrated by James E. Ransome — a life told backward in verse"),
        ("Jazz", "Walter Dean Myers — poetry and illustration that captures the sound of jazz for young readers"),
        ("Ruth and the Green Book", "Calvin Alexander Ramsey — the Great Migration and the reality of traveling while Black, told accessibly")]),
      ("Middle grade — Grades 3 through 6", [
        ("The Dream Keeper and Other Poems", "Langston Hughes — selected poems designed for young readers; the ideal introduction to Hughes"),
        ("Harlem Stomp!", "Laban Carrick Hill — comprehensive, readable history of the Harlem Renaissance with photographs"),
        ("Stompin’ at the Savoy: The Story of Norma Miller", "Norma Miller with Alan Govenar — the Lindy Hop and the Savoy Ballroom, told by a dancer who was there"),
        ("Zora and Me", "Victoria Bond / T.R. Simon — fiction inspired by Zora Neale Hurston’s childhood; mystery format, excellent"),
        ("Poetry for Young People: Langston Hughes", "Selected and illustrated edition with teaching notes; ideal for reading poems aloud together")]),
      ("Older readers — Grades 7 and up", [
        ("Their Eyes Were Watching God", "Zora Neale Hurston — the defining novel of the Harlem Renaissance; one of the great American novels"),
        ("The Collected Poems of Langston Hughes", "The complete poems — dip in anywhere; every poem is accessible and worth re-reading"),
        ("The Warmth of Other Suns", "Isabel Wilkerson — the definitive account of the Great Migration; National Book Critics Circle Award; adult read, excerpts for Gr 8+"),
        ("The New Negro (1925)", "Edited by Alain Locke — the anthology that launched the Renaissance; free via HathiTrust online")]),
    ])),
    ("html", books([
      ("Online resources — free", [
        ("poets.org / poetryfoundation.org", "Many Harlem Renaissance poems free, with biographical context and teaching notes"),
        ("Smithsonian Folkways", "Free streaming of Bessie Smith, Louis Armstrong, Duke Ellington, Langston Hughes reading his own poetry"),
        ("Schomburg Center", "schomburgcenter.org — the world’s greatest archive of African American culture; free digital resources")])]).replace("<i>", "").replace("</i>", "")),

    ("section", {"label": "Faith and the Harlem Renaissance", "title": "A Catholic perspective for families", "body": [
      "The Catholic Church teaches that every human person is made in the image and likeness of God — *imago Dei* — and therefore possesses inherent, irreducible dignity. This is not a social convention; it is a theological claim about the nature of reality. Every person, regardless of race, status, or achievement, is sacred.",
      "The Harlem Renaissance was, at its heart, a sustained affirmation of this truth against a society that refused to acknowledge it. When Langston Hughes wrote “I, too, am America” — he was making a claim that Catholic Social Teaching Principle 1 would affirm unreservedly. When Aaron Douglas painted Black figures as noble, powerful, and spiritually radiant — he was making visible what God had already declared about every human person."]}),
    ("html", '<aside class="talk"><p class="label">A conversation for Catholic families</p><p>“The Church teaches that every person is made in God’s image. The artists of the Harlem Renaissance were saying the same thing through their art — insisting that the world see what it was refusing to acknowledge. What do you think it takes to keep believing in your own dignity when the world is telling you otherwise? Where did the Harlem Renaissance artists find that strength?”</p></aside>'),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings museum-quality experiences directly into student learning. The Harlem Renaissance exhibition includes an original 1920s electric phonograph, interactive jazz and poetry stations, authentic artifacts, Aaron Douglas reproductions, and the digital exhibition portal at minimuseumproject.org/exhibitions/harlem-renaissance.",
      "To arrange a family visit, speak with your child’s teacher or contact the library directly. Saturday family sessions are available by appointment."]}),
    ("html", '<div class="goal"><p class="label">Thank you for exploring with us</p><p>The Harlem Renaissance lasted about 20 years. The art it produced has lasted 100. Some of the people who made it are still alive in their work — in the poems your child reads, the music still playing on streaming platforms, the paintings in museum collections around the world. When you explore this with your family, you’re joining a conversation that has been going on for a century — and that still has things to say.</p></div>'),
  ]}


# ── PreK–K · Music, Stories & Movement ─────────────────────────────────

PK = "teachers/prek-k/"
PK_TITLE = "Music, Stories & Movement"
PK_HERO = {"img": M + "chicago.jpg", "pos": "center 30%"}

# "screen" on a section is for the site's Lesson mode only (resources-src/
# export_lessons.py); build.py ignores it, so the PDF is unchanged. It names
# what the class sees while the teacher reads that section. Anything said in
# the plan and shown on screen is written once, as a constant.
PK_HOOK_Q = "When you heard that music, what did you feel in your body?"
PK_BIG = "They made music. They made paintings. They made poems. They made stories. All to say: we are here, and we are wonderful."

PK_LP = {
  "slug": "music-stories-and-movement", "large": True,
  "out": PK + "HR_LP_PreK_K.pdf", "eyebrow": "Teacher lesson plan", "title": PK_TITLE,
  "sub": "PreK–K · Homeroom / General", "foot": "Teacher Lesson Plan · PreK–Kindergarten", "hero": PK_HERO, "css": LP_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Big idea", 8, "#2F4A5A"), ("Activity", 10, "#86671A"), ("Closing", 2, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What children will understand", "body": [
      "Children will discover that people can express their feelings and tell their stories through music, art, and movement. Through sound and guided imaginative play, they will be introduced to the idea that a group of Black artists and musicians in Harlem, New York, made something beautiful together a long time ago — and that their music still makes us want to move today."]}),
    ("cols", [[std([
      ("CCSS.ELA-LITERACY SL.K.1 / SL.K.4", "Participate in collaborative conversations; describe familiar people, places, things, and events"),
      ("NCSS Standard I (Culture)", "Explore similarities and differences in ways groups meet human needs; music and art as cultural expression"),
      ("National Arts MU:Re7.1 (PreK)", "With guidance, identify and describe how a specific music selection makes them feel"),
      ("Head Start Early Learning Outcomes", "Creative Arts Expression: child explores and expresses ideas through music, movement, and visual arts")])],
              [("section", {"label": "Materials needed", "list": [
      "Device to play 60 seconds of jazz — Louis Armstrong’s “What a Wonderful World” or Cab Calloway’s “Minnie the Moocher” work beautifully",
      "Optional: scarves or ribbons for movement activity (one per child)",
      "Differentiated handouts (Green / Yellow / Red) — one per child, printed before class",
      "Large crayons or thick markers"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Can you feel the music?",
      "screen": {"phase": "Hook", "show": "question", "question": PK_HOOK_Q,
                 "purpose": "Let the music come first: children feel it before they hear about it.",
                 "students": ["Listen to the music.", "Stand up and move!"]},
      "body": [
      "Play the music clip. Let children respond however they want — nodding, swaying, smiling.",
      "*“This music was made a long, long time ago — before your parents were born, before your grandparents were born! A group of really special musicians lived in a place called Harlem in New York City, and they made music that was so joyful and so new that the whole world stopped to listen.”*",
      f"*“{PK_HOOK_Q}”*",
      "Take responses — there are no wrong answers. Then stand up together and move to 30 more seconds of music."]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "A big move and a big idea",
      "screen": [
        {"phase": "Big idea", "minutes": 5, "script": [0, 1, 2], "title": "A big move and a big idea", "show": "words", "text": PK_BIG,
         "purpose": "Tell the story of the big move, and what the people of Harlem made.",
         "students": ["What would you make?"]},
        {"phase": "Big idea", "minutes": 3, "script": [3], "title": "Look at Harlem", "show": "gallery",
         "groups": [{"label": "Harlem", "items": [photo("harlem", "A Harlem street scene")]},
                    {"label": "Music", "items": [photo("chicago", "A jazz band")]}],
         "purpose": "Put pictures to the story: the place and the music.",
         "students": ["What do you see?"]}],
      "body": [
      "Sit children in a circle or on the carpet.",
      "*“A long time ago, many families moved from one part of America to another — a very long journey, like if you packed all your favorite things in a suitcase and moved to a whole new place. When they arrived in Harlem, something magical happened: musicians, storytellers, and painters all found each other and started making beautiful things together. We call that the Harlem Renaissance — that means ‘Harlem Reborn’.”*",
      f"*“{PK_BIG}”*",
      "Show two or three images if available — a Harlem street scene, a jazz band, or Aaron Douglas artwork."]}),
    ("section", {"label": "Activity · 10 minutes", "title": "Making something beautiful",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Children make something of their own while the music plays.",
                 "students": ["Choose Green, Yellow or Red. Draw while the music plays."]},
      "body": [
      "Distribute handouts. Play gentle jazz quietly in the background while children work."]}),
    ("levels", {
      "green": "Children draw how the music makes them feel using colors and shapes. A single sentence frame (*“The music makes me feel ___”*) with a very large drawing box. Designed for pre-writers — drawing IS the response.",
      "yellow": "Children draw a picture of what they would make if they lived in Harlem — music, a painting, a dance, a story — and write or dictate one sentence about it.",
      "red": "Children draw two things: what Harlem music looked like to them, and something they would contribute. They complete a simple sentence about why they would make it. A full writing line for children ready to write independently."}),
    ("html", '<div class="sec"><p><b>Note:</b> All three levels use the same large type and large drawing boxes — differentiation is in task complexity, not presentation.</p>'
             '<p>Circulate and talk to children about what they’re drawing. With 2 minutes remaining, invite two or three children to share.</p></div>'),
    ("section", {"label": "Closing · 2 minutes", "title": "We made something too",
      "screen": {"phase": "Closing", "show": "words", "text": "You drew your feelings, your ideas. That’s what artists do.",
                 "purpose": "Join the children’s work to the artists of Harlem.",
                 "students": ["Show what you made."]},
      "body": [
      "*“Just like the people in Harlem made music and paintings to share how they felt — today you made something too! You drew your feelings, your ideas. That’s what artists do. The Harlem Renaissance was made by people just like you, who had something beautiful inside them and decided to share it.”*"]}),
    ("cols", [[("section", {"label": "Teacher notes", "list": [
      "**Pacing:** With younger PreK children, cut the direct instruction to 5 minutes and extend the movement to 2 minutes. The music itself does the work at this age.",
      "**For ESL/ELL students:** The music is completely language-independent. Pair with images. Accept drawing as a full response — sentence frames are scaffolds, not requirements.",
      "**Follow-up:** Display children’s drawings as a class “Harlem Gallery” before or after the Mini Museum visit."]})], [connection_lp()]]),
  ]}

def pk_handout(level, out, blocks, context, css=""):
    return {"out": PK + out, "eyebrow": "Student handout", "title": PK_TITLE, "sub": "PreK–K",
            "level": level, "young": True, "context": context, "css": CSS + css,
            "foot": f"Student Handout · PreK–K · {level.title()} Level", "blocks": blocks, "hero": PK_HERO}

PK_GREEN = pk_handout("green", "HR_Handout_Green_PreK_K.pdf", [
  ("task", {"label": "Draw how the music feels", "title": "Use colors and shapes to show how the music makes you feel.",
            "blocks": [box("My drawing"), fr("The music makes me feel")]}),
  ("connection", ["You can hear real Harlem music at the Mini Museum!"]),
], ["Listen to the music. What do you feel? What colors do you see?"],
   "body.young .drawbox { height: 262pt; }")

PK_YELLOW = pk_handout("yellow", "HR_Handout_Yellow_PreK_K.pdf", [
  ("task", {"label": "If I lived in Harlem, I would make…", "title": "Draw yourself making something in Harlem — add colors and detail!",
            "blocks": [box("My picture"), fr("I would make a", "I would make it because")]}),
  ("connection", ["At the Mini Museum, you can hear real music from Harlem on an old phonograph!"]),
], ["The people of Harlem made music, paintings, dances, and stories. What would you make?"],
   "body.young .drawbox { height: 205pt; }")

PK_RED = pk_handout("red", "HR_Handout_Red_PreK_K.pdf", [
  ("cols", [
    [("task", {"label": "What did Harlem sound like?", "title": "Draw the music as colors or shapes.",
               "blocks": [box("The music"), fr("The music sounds like")]})],
    [("task", {"label": "What would you make?", "title": "Draw your creation.",
               "blocks": [box("My creation"), fr("I would make it to show")]})]]),
  ("html", '<div class="fr"><span>I think the people of Harlem made art because</span><i></i></div>' + lines(1)),
  ("connection", ["At the Mini Museum, hear Harlem music on a real phonograph and trace the Great Migration journey on an animated map."]),
], ["Long ago, people moved from far away to a place called **Harlem**. They made music, paintings, and poems to share their stories. Their art was so beautiful that people still remember it today!"],
   "body.student .hero { height: 1.9in; } body.young .drawbox { height: 150pt; } .cols .fr span { white-space: normal; }")


# ── Grades 1–2 · Stories of a Great Journey ────────────────────────────

G12 = "teachers/grades-1-2/"
G12_TITLE = "Stories of a Great Journey"
G12_HERO = {"img": M + "harlem.jpg", "pos": "center 45%"}

G12_HOOK_Q = "Close your eyes and just listen. What do you feel? What pictures do you see in your mind?"
G12_CLOSE = "But they brought their music, their stories, their faith, and their creativity."

G12_LP = {
  "slug": "stories-of-a-great-journey", "large": True,
  "out": G12 + "HR_LP_Grades1_2.pdf", "eyebrow": "Teacher lesson plan", "title": G12_TITLE,
  "sub": "Grades 1–2 · Homeroom / General", "foot": "Teacher Lesson Plan · Grades 1–2", "hero": G12_HERO, "css": LP_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("The big move", 8, "#2F4A5A"), ("Activity", 12, "#86671A"), ("Closing", 5, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will understand", "body": [
      "Students will learn that the Harlem Renaissance grew from the Great Migration — a great journey of Black families moving north — and that the people who made that journey created music, stories, and art that changed America. They will connect this to their own experiences of change and discover that ordinary people can do extraordinary things."]}),
    ("cols", [[std([
      ("CCSS.ELA-LITERACY RL.1.3 / RL.2.3", "Describe the connection between events; understand how characters respond to challenges"),
      ("NCSS Standard II (Time & Continuity)", "Understand that things change over time; people make choices that affect their lives and communities"),
      ("National Arts MU:Re7.1a", "With guidance, identify and describe how music connects to feelings and personal experiences")])],
              [("section", {"label": "Materials needed", "list": [
      "Device to play a short audio clip of Bessie Smith or Louis Armstrong (freely available on YouTube or Smithsonian Folkways)",
      "Simple projected or printed US map showing Southern states and New York",
      "Differentiated student handouts (Green / Yellow / Red) — print one per student before class",
      "Crayons or colored pencils for drawing activities"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "A song from far away",
      "screen": {"phase": "Hook", "show": "listen", "clips": [BESSIE], "question": G12_HOOK_Q,
                 "purpose": "Listen before learning anything: let the music raise the questions.",
                 "students": ["Close your eyes and listen.", "What do you feel?"]},
      "body": [
      "Play 60 seconds of Bessie Smith or a Harlem-era jazz recording. Let students simply listen with eyes closed.",
      f"*“{G12_HOOK_Q}”*",
      "Take two or three responses, then:",
      "*“This music is almost 100 years old! It was made by people who had just finished one of the longest, bravest journeys in American history. Today we are going to find out who they were — and what they made.”*"]}),
    ("section", {"label": "Direct instruction · 8 minutes", "title": "The big move",
      "screen": {"phase": "The big move", "show": "gallery",
                 "groups": [{"label": "The South", "items": [photo("delta", "A cotton field in Georgia")]},
                            {"label": "Harlem, New York", "items": [photo("harlem", "A neighborhood called Harlem")]}],
                 "purpose": "Trace the Great Migration from the South to Harlem.",
                 "students": ["Where did the families start?", "Where did they go?"]},
      "body": [
      "Show the US map. Point to the Deep South, then trace a path north to New York.",
      "*“A long time ago, many Black families lived in the South of America — places like Mississippi and Georgia. Life was very hard and unfair there. So families packed everything they owned and moved north — to cities like Chicago and New York. We call this the Great Migration. When they arrived in a neighborhood called Harlem, something amazing happened: musicians, writers, poets, and painters all found each other. They started making something the world had never seen before — a Renaissance. That means a great burst of new ideas and beauty.”*"]}),
    ("section", {"label": "Activity · 12 minutes", "title": "Our great journey",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Connect the great journey to each child’s own story of change.",
                 "students": ["Choose Green, Yellow or Red. You can switch at any time."]},
      "body": [
      "Distribute differentiated handouts. Let students self-select their level, or assign based on your knowledge of their needs."]}),
    ("levels", {
      "green": "Students draw their family’s journey on a map outline, label where they came from and where they live now, and draw one thing their family brought with them. Sentence frames support emerging writers.",
      "yellow": "Students write about a personal experience of change, connect it to the Great Migration, and write about what they would create if they lived in Harlem in 1925.",
      "red": ["Students write a first-person “interview” with an imaginary Great Migration traveler, then independently research one real Harlem Renaissance figure and write three facts.",
              "Suggest: Langston Hughes, Bessie Smith, Duke Ellington, Zora Neale Hurston, Aaron Douglas, or Walter F. White."]}),
    ("html", '<div class="sec"><p>Circulate and prompt with open questions. With 3 minutes remaining, invite two or three students to share.</p></div>'),
    ("section", {"label": "Closing · 5 minutes", "title": "What they carried",
      "screen": {"phase": "Closing", "show": "words", "text": G12_CLOSE,
                 "purpose": "Close on what the travelers carried with them, and what it became.",
                 "students": ["What would you bring with you?"]},
      "body": [
      f"*“The people who made the Great Migration left behind their homes and sometimes their families. {G12_CLOSE} And in Harlem, they used all of that to make something so beautiful it still lives today — in every jazz song, every poem, every painting.”*"]}),
    ("cols", [[("section", {"label": "Differentiation notes", "body": [
      "Green uses sentence frames and large drawing boxes — ideal for younger students or emerging writers. Yellow is independent, grade-level writing with a personal connection. Red adds historical research and first-person creative writing. Students may self-select or switch levels at any time."]})], [connection_lp()]]),
  ]}

def g12_handout(level, out, blocks, context, css=""):
    return {"out": G12 + out, "eyebrow": "Student handout", "title": G12_TITLE, "sub": "Grades 1–2",
            "level": level, "young": True, "context": context, "css": CSS + css,
            "foot": f"Student Handout · Grades 1–2 · {level.title()} Level", "blocks": blocks, "hero": G12_HERO}

G12_GREEN = g12_handout("green", "HR_Handout_Green_Grades1_2.pdf", [
  ("task", {"label": "My journey map", "title": "Where did your family come from?",
            "body": ["In the box below, draw a map showing where your family came from and where you live now. Add an arrow to show the journey. (It can be from another country, state, or city — or imagine a journey!)"],
            "blocks": [box("Draw your map here — mark your starting place ★ and your home today ●", 168),
                       fr("We came from:", "We live now in:", "One special thing we brought with us:")]}),
  ("pagebreak", None),
  ("task", {"label": "What did they make?", "title": "The Harlem Renaissance",
            "body": ["The people who moved to Harlem made music, poems, paintings, and stories. In the box below, draw yourself making something in Harlem in 1925. What are you creating?"],
            "blocks": [box("Draw what you are making — add yourself in the picture!"),
                       fr("I am making:", "I am making it because:")]}),
  ("connection", ["**Mini Museum fun!** At the Mini Museum Harlem Renaissance exhibition, you can listen to real music from 100 years ago on an interactive phonograph and trace the Great Migration journey on an animated map!"]),
  ("family", ["Tell someone at home: *“The Great Migration was when Black families moved north to find a better life. In Harlem, they made amazing music and art called the Harlem Renaissance!”*"]),
], ["**Big Idea:** A long time ago, many Black families moved from the South to cities in the North. This is called the **Great Migration**. In Harlem, New York, they made amazing music, stories, and art. We call this the **Harlem Renaissance**!"],
   "body.young .drawbox { height: 250pt; }")

G12_YELLOW = g12_handout("yellow", "HR_Handout_Yellow_Grades1_2.pdf", [
  ("task", {"label": "Activity 1 · My story of change", "title": "A time things changed for me",
            "body": ["Think about a time you or your family moved, changed schools, or started something new. Describe what it felt like in 3–4 sentences:"],
            "blocks": [("html", lines(5)), ("html", '<p style="margin-top:8pt">The most important thing I brought with me (an object, a memory, or a person) was:</p>' + lines(2))]}),
  ("pagebreak", None),
  ("task", {"label": "Activity 2 · Connection to history", "title": "Your journey and the Great Migration",
            "body": ["How is your experience of change similar to what the Great Migration families went through? How is it different?"],
            "blocks": [("html", '<p style="margin:6pt 0 0"><b>Similar:</b></p>' + lines(3) + '<p style="margin:8pt 0 0"><b>Different:</b></p>' + lines(3)),
                       box("Draw one scene from your experience of change", 365)]}),
  ("pagebreak", None),
  ("task", {"label": "Activity 3 · If you lived in Harlem", "title": "A Renaissance moment",
            "body": ["Imagine it is 1925 and you live in Harlem, New York. The streets are alive with jazz music, poetry readings, and art galleries. What would you create? Write 3–5 sentences describing your creation and why it matters to you:"],
            "blocks": [("html", lines(5)), ("html", '<p style="margin-top:8pt">My creation would show the world:</p>' + lines(2)),
                       box("Sketch or write your creation here", 150)]}),
  ("connection", ["In the Harlem Renaissance exhibition, try the Harlem in Words poetry workshop — build your own poem from six word categories: Dreams, Nature, Music, Emotion, Action, and Harlem."]),
  ("family", ["Ask someone at home: *“Has anyone in our family ever moved to find a better life? What did they hope to find? What did they bring with them?”*"]),
], ["**Key Idea:** Between 1910 and 1940, over one million Black Americans left the South to escape unfair laws and find better opportunities in Northern cities. When they arrived in Harlem, New York, they created an explosion of music, writing, and art called the **Harlem Renaissance** — a new beginning for Black culture in America."],
   "body.young .drawbox { height: 230pt; } .task .write + p { margin-top: 8pt; }")

G12_RED = g12_handout("red", "HR_Handout_Red_Grades1_2.pdf", [
  ("task", {"label": "Activity 1 · The interview", "title": "A voice from the journey",
            "body": ["You are a journalist in 1920. You are interviewing a family boarding a train heading north. Write their answers in full sentences:"],
            "blocks": [("html", '<div class="qa"><p><b>Q:</b> Where are you from, and why are you leaving?</p>' + lines(2)
                        + '<p><b>Q:</b> What do you hope to find in the North?</p>' + lines(2)
                        + '<p><b>Q:</b> What one thing could you never leave behind — and why?</p>' + lines(2) + '</div>')]}),
  ("html", '<div class="qa" style="break-inside:avoid"><p><b>Think Deeper:</b> What is the difference between leaving a place and escaping a place? Does that difference change how we should think about the Great Migration?</p>' + lines(2) + '</div>'),
  ("task", {"label": "Activity 2 · Research a real voice", "title": "One person from the Harlem Renaissance",
            "body": ["Choose one person below. Use the exhibition, books, or online resources to find three facts about them:"],
            "blocks": [opts(["Langston Hughes", "Zora Neale Hurston", "Bessie Smith", "Duke Ellington", "Aaron Douglas", "Walter F. White"], circle=False),
                       ("html", '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16pt"><div class="fr"><span>I chose:</span><i></i></div><div class="fr"><span>They were a:</span><i></i></div></div>'),
                       fr("Fact 1:", "Fact 2:", "Fact 3:"),
                       ("html", '<p style="margin:8pt 0 0">Why does this person’s work still matter today?</p>' + lines(2))]}),
  ("connection", ["**Deep dive:** Explore *The Fire in the Flint* exhibit — Walter F. White looked white but fought for Black civil rights his entire life. Visit the Great Migration Map and trace the journey city by city."]),
  ("family", ["**Family research project:** Together, search for 2–3 songs from the era (try “Bessie Smith” or “Duke Ellington 1920s”). Listen and discuss: What do you hear? What might life have been like when this was recorded?"]),
], ["**Challenge Context:** Between 1910 and 1940, over one million Black Americans fled the Jim Crow South — escaping segregation, economic exploitation, and racial violence — to build new lives in Northern cities. In Harlem, this became the most concentrated explosion of Black creative talent in history. The people who made the Harlem Renaissance weren’t just escaping something. They were building something."],
   "body.young { --line: 27pt; } .task.numbered, .task { margin-bottom: 6pt; }")


# ── Grades 3–4 · Making Something New ──────────────────────────────────

G34 = "teachers/grades-3-4/"
G34_TITLE = "Making Something New"
G34_HERO = {"img": P + "poster1.jpg", "pos": "center 62%"}

G34_HOOK_Q = "What do you think he felt when he arrived in Harlem for the first time?"
G34_LOOK_Q = "What do you notice? What do the shapes and silhouettes tell you about the mood?"
G34_CLOSE_Q = "When you write a story, or draw something, or make music — what are you saying about yourself?"
# who was making what, in the plan's own words
G34_NEIGHBORS = [["Langston Hughes", "writing poetry"], ["Louis Armstrong", "rehearsing jazz"],
                 ["Zora Neale Hurston", "collecting folk stories"],
                 ["Aaron Douglas", "painting murals in geometric shapes and bold silhouettes"]]

G34_LP = {
  "slug": "making-something-new", "large": True,
  "out": G34 + "HR_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": G34_TITLE,
  "sub": "Grades 3–4 · Homeroom / General", "foot": "Teacher Lesson Plan · Grades 3–4", "hero": G34_HERO, "css": LP_CSS + " .hero { height: 1.6in; } .sec { margin-bottom: 7pt; } p { margin-bottom: 4.5pt; } .cols:last-child, .cols:last-child .conn, .cols:last-child .sec { margin-bottom: 0; } .levels { margin: 2pt 0 7pt; } h3 { margin-bottom: 2pt; }",
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 10, "#2F4A5A"), ("Activity", 15, "#86671A"), ("Closing", 5, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will understand", "body": [
      "Students will understand that the Harlem Renaissance was a deliberate creative movement — that artists, writers, and musicians made a conscious choice to create something new and powerful in response to injustice. They will connect this to the idea of creative voice: that what you make can change how the world sees you. They will explore at least one Harlem Renaissance creative form through hands-on activity."]}),
    ("cols", [[std([
      ("CCSS.ELA-LITERACY RI.3.3 / RI.4.3", "Describe the relationship between events, ideas, or concepts in a historical text; explain connections between events"),
      ("CCSS.ELA-LITERACY W.3.3 / W.4.3", "Write narratives to develop real or imagined experiences; use descriptive detail and sequence"),
      ("NCSS Standards I & II", "Culture: understand art as cultural expression; Time & Continuity: historical causes and effects of the Great Migration"),
      ("National Arts VA:Cr1.1 / MU:Re7", "Generate and conceptualize artistic ideas; analyze how music connects to personal and cultural identity")])],
              [("section", {"label": "Materials needed", "list": [
      "Device to play 60 seconds of Duke Ellington (“Take the A Train”)",
      "Optional: printed or projected image of Aaron Douglas artwork (e.g. *Aspects of Negro Life*, 1934)",
      "Differentiated handouts (Green / Yellow / Red) — one per student; pencils and optional colored pencils"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "What does injustice sound like?",
      "screen": {"phase": "Hook", "show": "question", "question": G34_HOOK_Q,
                 "purpose": "Start with one newcomer to Harlem, and the music he made there.",
                 "students": ["Listen to “Take the A Train.”"]},
      "body": [
      "Play 60–90 seconds of “Take the A Train.” No introduction — just let it play.",
      f"*“That piece of music was written in 1939 by a man named Billy Strayhorn, who had just moved to New York City from Pittsburgh. Duke Ellington told him: take the A train — that’s the subway line to Harlem. And he did. And he wrote that. {G34_HOOK_Q}”*",
      "Take 3–4 responses. Then:",
      "*“Today we’re going to look at what happens when a whole community of people — all at the same time — decide to make something new and powerful. What happens when artists, musicians, and writers all gather in one place and say: we have something to say, and we’re going to say it beautifully.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "The Harlem Renaissance",
      "screen": [
        {"phase": "Teach", "minutes": 6, "script": [0, 1], "title": "Every building was full of talent", "show": "chart",
         "caption": "Every building was full of talent", "columns": ["Who", "Making"],
         "rows": [{"cells": r} for r in G34_NEIGHBORS],
         "purpose": "Meet the neighbors: four makers, four forms, one statement.",
         "students": ["What were they all saying? *Black life is rich, complex, beautiful, and important.*"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Aaron Douglas", "show": "artwork",
         "work": "Aspects of Negro Life", "artist": "Aaron Douglas", "date": "1934",
         "links": screen_links(WHOLE_MURAL),
         "purpose": "Look closely at the Renaissance’s visual language.",
         "students": [G34_LOOK_Q]}],
      "body": [
      "*“From around 1910, hundreds of thousands of Black families left the South — escaping laws designed to keep them poor and afraid. They moved to Chicago, Detroit, Philadelphia, and especially Harlem in New York City. And in Harlem, something happened that no one had quite planned: every building was full of talent. Your neighbor might be Langston Hughes writing poetry. Across the street, Louis Armstrong was rehearsing jazz. Down the road, Zora Neale Hurston was collecting folk stories. Aaron Douglas was painting murals in geometric shapes and bold silhouettes.”*",
      "*“They weren’t just making art. They were making a statement: Black life is rich, complex, beautiful, and important. This movement — this burst of creativity — we call the Harlem Renaissance.”*",
      f"Show the Aaron Douglas image if available. Ask: *“{G34_LOOK_Q}”*"]}),
    ("section", {"label": "Activity · 15 minutes", "title": "Your creative voice",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Each student finds a creative voice of their own.",
                 "students": ["Choose Green, Yellow or Red. You can switch at any time."]},
      "body": [
      "Distribute differentiated handouts. Students may self-select or be assigned."]}),
    ("levels", {
      "green": "Students choose a creative form (music, painting, story, poem) and fill in a planning frame: What will I make? Who am I making it for? What do I want them to feel? Then they sketch or draft a small sample.",
      "yellow": "Students write a short poem or paragraph in the voice of a Harlem Renaissance artist — first person, present tense, set in 1925. They then explain what their imagined creation says about Black life at that time.",
      "red": ["Students analyze how two different creative forms — one visual, one musical or literary — made the same kind of argument in different ways. They choose two real figures and compare their approach, then write a critical response.",
              "Suggested pairings: Aaron Douglas + Langston Hughes / Duke Ellington + Zora Neale Hurston"]}),
    ("html", '<div class="sec"><p>Circulate and engage students with their choices. In the final 3 minutes, invite sharing — particularly Red level students doing comparative analysis.</p></div>'),
    ("section", {"label": "Closing · 5 minutes", "title": "Art as argument",
      "screen": {"phase": "Closing", "show": "words",
                 "text": "Art can be an argument. It can be a protest. It can be a declaration of who you are.",
                 "purpose": "Name what the Renaissance shows: what you make says who you are.",
                 "students": [G34_CLOSE_Q]},
      "body": [
      f"*“In the 1920s, some people said that Black people were not capable of great art or deep thinking. The Harlem Renaissance was, in a way, a very long answer to that. Every painting, every jazz record, every poem said: look at what we made. Art can be an argument. It can be a protest. It can be a declaration of who you are. {G34_CLOSE_Q}”*"]}),
    ("cols", [[("section", {"label": "Differentiation & Catholic context", "body": [
      "Green uses planning frames to reduce the blank-page problem. Yellow requires first-person perspective-taking and historical context. Red requires analysis and comparison across creative forms. Allow students to move between levels; Red extension works well as homework.",
      "**Catholic school connection:** The Harlem Renaissance connects naturally to CST Principle 1 (Human Dignity). The movement’s central claim — that every human life is rich with worth and beauty — is deeply consonant with the Church’s teaching on the inherent dignity of every person."]})], [connection_lp()]]),
  ]}

def g34_handout(level, out, blocks, context, css=""):
    return {"out": G34 + out, "eyebrow": "Student handout", "title": G34_TITLE, "sub": "Grades 3–4",
            "level": level, "context": context, "css": CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": G34_HERO}

MATCH = ('<div class="matchup">'
         + "".join(f'<div class="l">{a}<b></b></div><div class="r"><b></b>{b}</div>' for a, b in [
             ("Langston Hughes", "Painted bold silhouette murals"),
             ("Duke Ellington", "Wrote poems about Black life"),
             ("Zora Neale Hurston", "Played and composed jazz"),
             ("Aaron Douglas", "Collected and wrote folk stories")]) + "</div>")

G34_GREEN = g34_handout("green", "HR_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1 · Choosing your creative form", "title": "What would you make?",
            "body": ["The Harlem Renaissance artists chose different ways to express themselves. What would you choose?"],
            "blocks": [opts(["Music", "Painting", "Poem", "Story", "Dance"]), fr("I would make:")]}),
  ("task", {"label": "Part 2", "title": "Planning your creation", "body": ["Use this frame to plan what you would make:"],
            "blocks": [fr2("My creation is called:", "It is about:", "I am making it for:", "I want them to feel:")]}),
  ("task", {"label": "Part 3", "title": "Make a start", "body": ["In the box below, sketch, write the opening lines, or plan the first part of your creation:"],
            "blocks": [box("Sketch, write, or plan here — this is just a start!")]}),
  ("pagebreak", None),
  ("task", {"label": "Part 4 · Harlem Renaissance artists", "title": "People who made something new",
            "body": ["Match each artist to what they created. Draw a line from the name to the description:"],
            "blocks": [("html", MATCH)]}),
  ("task", {"label": "Part 5", "title": "Reflection", "body": ["Complete these sentences:"],
            "blocks": [("html", '<div class="fr"><span>The Harlem Renaissance artists used their creativity to</span><i></i></div>' + lines(1)
                        + '<div class="fr"><span>I think art can be powerful because</span><i></i></div>' + lines(1)
                        + '<div class="fr"><span>When I make something, I want people to feel</span><i></i></div>' + lines(1))]}),
  ("connection", ["In the Harlem Renaissance exhibition, the Harlem in Words poetry workshop lets you build a poem from word categories used by real Harlem Renaissance poets. Try it!"]),
  ("family", ["Show someone at home what you planned to create. Ask them: *“If you lived in Harlem in 1925, what would you make — music, a painting, a poem, or a story?”*"]),
], ["**Big Idea:** During the Harlem Renaissance (around 1920–1935), Black artists, musicians, and writers in Harlem, New York used their creativity to show the world how rich and beautiful Black life was. They made music, paintings, poems, and stories that changed America."],
   "body.student .hero { height: 1.7in; } .drawbox { height: 108pt; }")

G34_YELLOW = g34_handout("yellow", "HR_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Activity 1 · Planning frame", "title": "Your Harlem voice",
            "body": ["Imagine you are a young artist in Harlem in 1925. Before you write, plan:"],
            "blocks": [fr("I am (name, creative form):", "What I create:", "What I want the world to understand:", "One word that describes my style:")]}),
  ("task", {"label": "Activity 2 · Write in first person", "title": "A voice from Harlem, 1925",
            "body": ["Write a poem, the opening of a story, or a monologue in the voice of your Harlem artist. Write in first person (I / me / my). Use vivid, specific detail — what do you see, hear, feel on the streets of Harlem?"],
            "lines": 6}),
  ("pagebreak", None),
  box("Optional: sketch your artist, your creation, or a scene from Harlem"),
  ("task", {"label": "Activity 3 · What does your creation argue?", "title": "Art as a statement",
            "body": ["The Harlem Renaissance artists weren’t just making beautiful things — they were making an argument. What does your imagined creation say about Black life in 1925?"],
            "lines": 5}),
  ("task", {"label": "Activity 4", "title": "Then and now",
            "body": ["Think about a modern musician, artist, or writer whose work makes a statement about identity or justice. How is what they do similar to what the Harlem Renaissance artists were doing?"],
            "blocks": [fr("Modern artist I’m thinking of:")], "lines": 5}),
  ("connection", ["The Harlem in Words poetry workshop in the exhibition uses the same word categories that Harlem poets drew from: Dreams, Nature, Music, Emotion, Action, and Harlem. Build a poem and compare it to your writing here."]),
  ("family", ["Read your poem or monologue aloud at home. Ask: *“Can you tell what argument I’m making — what I’m saying about who I am and what matters?”*"]),
], ["**Context:** The Harlem Renaissance (c. 1920–1935) was a golden age of Black art, music, literature, and thought centered in Harlem, New York. Artists like Langston Hughes, Duke Ellington, Zora Neale Hurston, and Aaron Douglas weren’t just creating beauty — they were arguing, through art, that Black life was worthy of celebration and respect."],
   "body.student .hero { height: 1.7in; } .drawbox { height: 88pt; }")

def creator(n):
    return ("html", f'<div class="creator"><p class="label">Artist / Creator {n}</p>'
            '<div class="fr"><span>Name:</span><i></i></div>'
            '<div class="fr"><span>Creative form:</span><i></i></div>'
            + '<p>Central argument or theme:</p>' + lines(2)
            + '<p>Key technique or style choice:</p>' + lines(1) + '</div>')

G34_RED = g34_handout("red", "HR_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Activity 1 · Comparative analysis", "title": "Two voices, one argument",
            "body": ["Choose one pairing below. Research both figures using books, the exhibition, or reliable online sources."],
            "blocks": [opts(["Aaron Douglas + Langston Hughes", "Duke Ellington + Zora Neale Hurston", "Bessie Smith + Jacob Lawrence"], circle=False),
                       fr("Pairing I chose:"),
                       ("cols", [[creator(1)], [creator(2)]]),
                       ("html", '<p style="margin:8pt 0 0"><b>What do both have in common, despite their different forms?</b></p>' + lines(2))]}),
  ("pagebreak", None),
  ("task", {"label": "Activity 2 · Critical response", "title": "Which voice is more powerful — and why?",
            "body": ["This is a question without a right answer. Write your genuine opinion, backed by specific evidence from your research. Aim for 5–7 sentences."],
            "lines": 9}),
  ("task", {"label": "Activity 3", "title": "The bigger claim",
            "body": ["W.E.B. Du Bois believed that art could do what politics alone could not — change how people feel about each other, not just what laws said. Do you agree? Use an example from the Harlem Renaissance and one from today to support your view."],
            "lines": 7}),
  ("connection", ["**Deep dive:** In the exhibition, compare the electric phonograph (sound) with the Harlem in Words poetry workshop (language). Both communicate — but how differently? What can music do that words can’t, and vice versa?"]),
  ("family", ["**Family research project:** Together, look up one piece of Harlem Renaissance art online — a painting, a poem, or a song. Discuss: What is this saying? Who was it made for? Does it still speak to you today?"]),
], ["**Critical Frame:** The Harlem Renaissance was not just a cultural flourishing — it was a deliberate intellectual and political project. W.E.B. Du Bois argued that Black artists should use their work to advance civil rights. Alain Locke called for a “New Negro” — defined not by oppression but by creative achievement. The art was an argument."],
   "body.student .hero { height: 1.55in; } .creator p { margin-top: 3pt; } .opts { gap: 6pt; } .opts span { padding: 3pt 9pt 2pt; font-size: 9.6pt; }")


DOCS = [GUIDE, DIFF, FAMILY,
        PK_LP, PK_GREEN, PK_YELLOW, PK_RED,
        G12_LP, G12_GREEN, G12_YELLOW, G12_RED,
        G34_LP, G34_GREEN, G34_YELLOW, G34_RED]
for _d in DOCS:
    in_order(_d["blocks"])

# links to the paintings this module names (see _links.py)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import add_links as _add_links
_add_links(DOCS)
