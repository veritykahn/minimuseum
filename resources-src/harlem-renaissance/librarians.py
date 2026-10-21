"""Harlem Renaissance · Librarian session plans and activity cards, PreK–8.
Converted from the original librarian resources, in their own words.

The original cards printed Aaron Douglas paintings (Song of the Towers, The
Creation, Aspects of Negro Life). Those works are still in copyright, so the
cards name the painting and point to the print the session plan puts on
display, instead of reproducing it."""

import html, re

def inline(t):
    """As build.inline: **bold** and *italic*, everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

DIR = "librarians/"
EYE_LP = "Library lesson plan"
EYE_CARD = "Library activity card"
TITLE_LP = "Harlem Renaissance Library Session"
TITLE_CARD = "Harlem Renaissance Library"

POSTER = "/exhibitions/harlem/poster1.jpg"
HARLEM = "/exhibitions/harlem/images/migration/harlem.jpg"
JAZZ = "/exhibitions/harlem/images/migration/chicago.jpg"

# timing colors, as in the models, with the exhibition's own purple
C1, C2, C3, C4, C5 = "#7D8471", "#2F4A5A", "#7A4B9A", "#86671A", "#A8452F"

CSS = """
body.adult .hero { height: 1.9in; margin-bottom: 11pt; }
body.student .hero { height: 1.25in; margin-bottom: 7pt; }
body.student .hero h1 { font-size: 26pt; margin-bottom: 2pt; }
body.student .hero .htop { top: 10pt; }
body.student .hero .htext { bottom: 9pt; left: 84pt; }
body.student .hero .lockup svg { width: 22pt; }
body.young { --line: 26pt; }
body.young .task h3 { margin-bottom: 2pt; }
body.student .ticket { margin-bottom: 8pt; }
body.student .ticket { grid-template-columns: 30pt 1fr; }
body.student .stub span { font-size: 5.5pt; letter-spacing: .2em; }
body.student .tfields { padding: 4pt 12pt 5pt; align-items: end; }
body.student .tfields span { padding: 9pt 0 1pt; }
body.student:not(.young) { --line: 21pt; }
.conn.mini { padding: 4pt 10pt 3pt; margin: 3pt 0 0; display: flex; gap: 12pt; align-items: baseline; }
.conn.mini p { margin: 0; font-size: 9pt; }
body.young .check { gap: 6pt 13pt; }
body.young .check span::after { width: 13pt; height: 13pt; }
.flow { display: grid; grid-template-columns: 84pt 1fr; gap: 0 14pt; margin: 2pt 0 8pt; }
.flow > div { padding: 5pt 0 4pt; border-top: .6pt solid #d8d4c8; break-inside: avoid; }
.flow .ft { font: 500 7.5pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin: 1pt 0 1pt; }
.flow .fn { font: 600 12pt/1.15 'Cormorant Garamond', serif; margin: 0; }
.flow p:last-child { margin-bottom: 0; }
.books { list-style: none; padding: 0; margin: 2pt 0 8pt; }
.books li { margin: 0 0 4pt; padding-left: 9pt; text-indent: -9pt; line-height: 1.38; }
.books li b { font-weight: 500; }
body.student .context { margin-bottom: 8pt; padding: 7pt 11pt 2pt; }
body.student .task .label { margin-bottom: 1pt; }
body.student .task h3 { margin-bottom: 2pt; }
body.student table.fill td { padding-bottom: 14pt; }
.task { margin-bottom: 4pt; }
body.student .write { margin: 2pt 0 0; }
.art { display: grid; grid-template-columns: 22pt 1fr; gap: 9pt; align-items: center; background: rgba(255,255,255,.72);
  border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 4pt 9pt; margin: 2pt 0 6pt; break-inside: avoid; }
.art .fr { width: 22pt; height: 28pt; border: 2.4pt solid #1d1c1a; box-shadow: inset 0 0 0 2pt #fff, inset 0 0 0 3pt #1d1c1a;
  background: radial-gradient(circle at 50% 40%, #fff 0 22%, transparent 23%), var(--accent); }
.art p { margin: 0; line-height: 1.3; }
.art .where { font: 500 6.5pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); }
.arts { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.fl { display: flex; align-items: flex-end; gap: 6pt; margin: 0; }
.fl > b { white-space: nowrap; padding-bottom: 2pt; }
.fl > span { flex: 1; height: var(--line); border-bottom: .8pt solid #a9a69b; }
.fl > em { font-style: normal; white-space: nowrap; padding-bottom: 2pt; }
.check { display: flex; flex-wrap: wrap; gap: 6pt 20pt; margin: 2pt 0 4pt; }
.check span { display: inline-flex; align-items: center; gap: 7pt; }
.check span::after { content: ""; width: 15pt; height: 15pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: rgba(255,255,255,.8); }
.match { display: grid; grid-template-columns: 1fr 70pt 1fr; align-items: center; margin: 2pt 0 6pt; }
.match .col { display: grid; gap: 6pt; }
.match .col span { display: flex; align-items: center; gap: 8pt; background: rgba(255,255,255,.72); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 2pt 9pt; }
.match .l span { justify-content: space-between; }
.match .l span::after, .match .r span::before { content: ""; width: 9pt; height: 9pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.poem { white-space: pre-line; font: italic 400 11.5pt/1.35 'Cormorant Garamond', serif; }
.qn { font-weight: 500; }
.pair2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16pt; margin-bottom: 4pt; }
.pair2 .write { margin-top: 0; }
"""

def art(*works, where="Look for it on the library display"):
    """A named painting, pointed to rather than reproduced."""
    cards = "".join(f'<div class="art"><div class="fr"></div><div><p class="where">{where}</p>'
                    f'<p>{w}</p></div></div>' for w in works)
    return ("html", f'<div class="arts">{cards}</div>' if len(works) > 1 else cards)

def fill(*parts):
    """A line to write on, with words before (and optionally between) it."""
    out = ""
    for i, p in enumerate(parts):
        out += (f"<b>{p}</b>" if i == 0 else f"<em>{p}</em>") + "<span></span>"
    return f'<p class="fl">{out}</p>'

def H(s):
    return ("html", s)

def P(s):
    """A prompt paragraph that must sit among the blocks (task bodies print after them)."""
    return ("html", f"<p>{s}</p>")

SONG = "<b>Aaron Douglas</b> — <i>Song of the Towers</i>, 1934"
CREATION = "<b>Aaron Douglas</b> — <i>The Creation</i>, c.1935"
ASPECTS = "<b>Aaron Douglas</b> — <i>Aspects of Negro Life: From Slavery Through Reconstruction</i>, 1934"

CONN = ["**Option 1 — Visit the Exhibition:** Bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more.",
        "**Option 2 — Virtual Visit:**"]
CARD_CONN = ("html", '<aside class="conn mini"><p class="label">Mini Museum</p>'
             '<p>Visit: <b>minimuseumproject.org/exhibitions/harlem-renaissance</b></p></aside>')

def plan(key, grade, chips, hero, blocks):
    return {"out": f"{DIR}{key[0]}/HR_Lib_LP_{key[1]}.pdf", "eyebrow": EYE_LP, "title": TITLE_LP,
            "sub": f"{grade} · {chips[1]} · {chips[2]}", "hero": hero, "css": CSS,
            "foot": f"Librarian Session Plan · {grade}", "blocks": blocks}

def card(key, grade, level, name, context, blocks, hero, young=False, css=""):
    d = {"out": f"{DIR}{key[0]}/HR_Lib_{level.title()}_{key[1]}.pdf", "eyebrow": EYE_CARD,
         "title": TITLE_CARD, "sub": f"{grade} · {name}", "level": level, "context": context,
         "foot": f"Library Activity Card · {grade} · {level.title()} Level", "hero": hero,
         "css": CSS + css, "blocks": blocks + [CARD_CONN]}
    if young:
        d["young"] = True
    return d

# ══ PreK–K ═════════════════════════════════════════════════════════════

PK = ("prek-k", "PreK_K")
HERO_PK = {"img": POSTER, "pos": "center 84%"}

LP_PK = plan(PK, "PreK–Kindergarten", ["PreK–K", "25 minutes", "Whole group + table activity"], HERO_PK, [
  ("timing", [("Gathering", 3, C1), ("Picture walk", 5, C2), ("Read or listen", 5, C3), ("Activity card", 9, C4), ("Share", 3, C5)]),
  ("section", {"label": "Session goals", "title": "What children will do",
    "body": ["Children will: meet Aaron Douglas’s art and hear its story; understand that music, painting, and stories are ways people share who they are; practice observing pictures carefully; and create a simple response drawing. **Language goals:** silhouette, music, story, color, Harlem."]}),
  ("section", {"label": "Preparation", "list": [
    "**Display:** large-format print of Aaron Douglas’s *Song of the Towers* (or project from exhibition link)",
    "**Tables set:** one Green Activity Card per child, crayons, black marker",
    "**Optional read-aloud:** *The Watcher* by Nikki Grimes or *Duke Ellington* by Andrea Davis Pinkney"]}),
  ("section", {"label": "0–3 min", "title": "Gathering",
    "body": ["Children sit on the rug. *“Today we’re going to look at a very special painting and listen to some music that was made a long, long time ago in a place called Harlem, New York. I’m going to play some music — I want you to close your eyes and tell me what color it sounds like.”* Play 20 seconds of jazz. Take 3–4 color responses."]}),
  ("section", {"label": "3–8 min", "title": "Picture walk",
    "body": ["Reveal the Douglas print. *“What do you see? Find the people. What are they doing? What shapes do you notice in the background? Why do you think the artist made the people dark like shadows?”* Accept all responses. Introduce: *“These shadow-shapes are called silhouettes. The artist chose not to show faces — because these people could be anyone. They could be you.”*"]}),
  ("section", {"label": "8–13 min", "title": "Read-aloud or music listen",
    "body": ["Read one picture book about the Harlem Renaissance (Ellington or Hughes titles work well) OR play a second piece of jazz and ask children to move their hands like the music. Connect: *“The people in the painting were listening to music just like this. They were making something beautiful.”*"]}),
  ("section", {"label": "13–22 min", "title": "Activity card",
    "body": ["Children move to tables. Each child has a Green Activity Card. They draw a silhouette person doing something they love — music, dancing, reading, building — and color the background in their “music color.” Circulate: *“Tell me about your person. What are they doing? Why that color?”*"]}),
  ("section", {"label": "22–25 min", "title": "Share and close",
    "body": ["Three children show their drawing to the group. *“You’ve just done what Aaron Douglas did — you made a picture that tells a story without showing a face. That makes your person everyone.”* Return to classrooms with drawings."]}),
  ("connection", CONN),
  ("pagebreak", None),
  ("section", {"label": "Book recommendations"}),
  ("cols", [
    [("section", {"label": "Primary picks"}),
     ("refs", [
       ("*Duke Ellington: The Piano Prince and His Orchestra*", "Andrea Davis Pinkney (1998) — Caldecott Honor; introduces jazz biography accessibly"),
       ("*The Watcher*", "Nikki Grimes — a poet’s picture book, illustrated by Bryan Collier"),
       ("*Ruth and the Green Book*", "Calvin Alexander Ramsey — Great Migration through a child’s eyes"),
       ("*Before She Was Harriet*", "Lesa Cline-Ransome, illustrated by James E. Ransome — a life told backward in verse")])],
    [("section", {"label": "Display and extension"}),
     ("refs", [
       ("Langston Hughes", "Any picture-book adaptations (several exist for young readers)"),
       ("*Harlem*", "Walter Dean Myers / Christopher Myers (1997)"),
       ("*Stompin’ at the Savoy*", "by the children — a class writing project you could initiate from this session"),
       ("Print", "Aaron Douglas postcards or posters from the Schomburg Center (free high-res downloads available)")])]]),
  ("section", {"label": "Vocabulary for early learners"}),
  ("refs", [
    ("Silhouette", "a shape that looks like a shadow; Aaron Douglas made people look like this in his paintings"),
    ("Jazz", "a kind of music born in America that uses many instruments at once and lets musicians make up parts as they play"),
    ("Harlem", "a neighborhood in New York City where many Black artists, musicians, and writers lived and worked in the 1920s"),
    ("Renaissance", "a time when lots of beautiful, important things are created all at once (tell children: *“like when a garden blooms all at once in spring”*)")]),
  ("section", {"label": "Cross-curricular integration notes", "list": [
    "**Classroom connection:** Share drawings with the classroom teacher as a provocation for discussion about “making something beautiful” and what stories images can tell",
    "**Music class:** Send the jazz clip recommendation to the music teacher — can be revisited in music with more structured listening",
    "**Catholic context:** *“Every person in Aaron Douglas’s paintings is a shadow — but every shadow also has a light behind it. That light is the light of God in every person.”*"]}),
])

GREEN_PK = card(PK, "PreK–K", "green", "Everybody Does This!",
  ["**Aaron Douglas** was a painter who lived in **Harlem, New York** in the 1920s. He painted people as silhouettes — dark shadow-shapes — with colorful backgrounds. He said the shadow people could be anyone. They could be you."],
  [("task", {"label": "Part 1", "title": "Look at the painting", "blocks": [art(SONG),
     H('<p class="check"><b>Point to:</b><span>A silhouette person</span><span>A circle shape</span><span>Something that looks like music</span></p>')]}),
   ("task", {"label": "Part 2", "title": "Your turn: draw a silhouette!",
     "body": ["Draw a **silhouette person** doing something you love. Color the background in your favorite color."],
     "blocks": [("draw", "Draw your silhouette here — dark person, colorful background!")]})],
  HERO_PK, young=True, css="body.young .drawbox { height: 232pt; }")

YELLOW_PK = card(PK, "PreK–K", "yellow", "Challenge!",
  ["Aaron Douglas painted people as shadow-shapes called **silhouettes**. He didn’t paint faces because he wanted the figures to represent all Black people, not just one person. He used **circles of light** to show music and spirit."],
  [("task", {"label": "Part 1", "title": "Look carefully", "blocks": [art(SONG), H(fill("I can see:"))]}),
   ("task", {"label": "Part 2", "title": "Draw and tell",
     "body": ["Draw your own silhouette picture with a **circle of light** behind the figure. Then write or tell: Who is your person and what are they doing?"],
     "blocks": [("draw", "Silhouette + circle of light")]}),
   H('<div style="margin-left:42pt">' + fill("My person is") + fill("and they are") + '</div>')],
  HERO_PK, young=True, css="body.young .drawbox { height: 200pt; }")

RED_PK = card(PK, "PreK–K", "red", "Go Further!",
  ["Aaron Douglas used **silhouettes** (shadow people) and **circles of light** in almost every painting. The circles show sound, spirit, and energy. He used only a few colors — each one for a feeling."],
  [("task", {"label": "Part 1", "title": "Look at two paintings", "blocks": [art(SONG, CREATION)],
     "body": ["What is the same in both? What is different?"], "lines": 2}),
   ("task", {"label": "Part 2", "title": "Make your own story",
     "body": ["Draw a silhouette picture that tells a story. Color the background to show how the story feels. On the back, write 2 sentences about your picture."],
     "blocks": [("draw", "Your story in silhouette")]})],
  HERO_PK, young=True, css="body.young .drawbox { height: 192pt; }")

# a little less room between lines than PreK, so each card stays one page
L24 = "body.young { --line: 24pt; }"

# ══ Grades 1–2 ═════════════════════════════════════════════════════════

G12 = ("grades-1-2", "Grades1_2")
HERO_12 = {"img": JAZZ, "pos": "center 40%"}

LP_12 = plan(G12, "Grades 1–2", ["Grades 1–2", "35 minutes", "Read-aloud + centers"], HERO_12, [
  ("timing", [("Hook", 5, C1), ("Read-aloud", 10, C2), ("Art look", 5, C3), ("Activity cards", 12, C4), ("Share", 3, C5)]),
  ("section", {"label": "Session goals", "title": "What students will do",
    "body": ["Students will: understand that the Harlem Renaissance was a time when Black artists, musicians, and writers created amazing work together; identify key vocabulary (jazz, poetry, silhouette, Great Migration); practice close observation of visual art; and make personal connections through writing and drawing."]}),
  ("section", {"label": "Preparation", "list": [
    "**Display:** *Song of the Towers* or *Aspects of Negro Life* print or projection",
    "**Tables set:** differentiated activity cards (Green / Yellow / Red), pencils, crayons",
    "**Read-aloud prepared:** *Harlem* by Walter Dean Myers (1997) — ideal anchor text; *Jazz* by Walter Dean Myers also excellent"]}),
  ("section", {"label": "0–5 min", "title": "Hook",
    "body": ["Play 20 seconds of Duke Ellington. Ask: *“What do you picture in your mind when you hear this music? What colors? What movements?”* Take 4 responses. *“This music comes from Harlem, New York, about 100 years ago. Today we’re going on a visit.”*"]}),
  ("section", {"label": "5–15 min", "title": "Read-aloud",
    "body": ["Read *Harlem* by Walter Dean Myers. Pause at 3–4 spreads to ask: *“What do you notice? What words sound like music? What feelings are here?”* After reading: *“The words in that book were written by a poet — someone whose job is to put the world into the most powerful words possible. Langston Hughes did the same thing in the 1920s.”*"]}),
  ("section", {"label": "15–20 min", "title": "Art look",
    "body": ["Display Aaron Douglas. Quick 5-question look: What do you see? What do the circles make you think of? Why no faces? What colors? If you could hear this painting, what would it sound like?"]}),
  ("section", {"label": "20–32 min", "title": "Activity cards",
    "body": ["Students work independently or in pairs on differentiated cards. Circulate and conference with at least 3–4 students. Encourage going beyond minimum responses."]}),
  ("section", {"label": "32–35 min", "title": "Share",
    "body": ["One student from each level shares. Close: *“You’ve just spent time with artists who lived 100 years ago. Their work was so good it still makes us feel something today. That’s what great art does.”*"]}),
  ("connection", CONN),
  ("pagebreak", None),
  ("section", {"label": "Book recommendations · Grades 1–2"}),
  ("cols", [
    [("section", {"label": "Anchor texts"}),
     ("refs", [
       ("*Harlem*", "Walter Dean Myers / Christopher Myers (1997) — Caldecott Honor; the essential Grades 1–2 Harlem text"),
       ("*Jazz*", "Walter Dean Myers (2006) — stunning visual poetry about jazz"),
       ("*A Sweet Smell of Roses*", "Angela Johnson — civil rights context, accessible")])],
    [("section", {"label": "Supporting reads"}),
     ("refs", [
       ("*Poetry for Young People: Langston Hughes*", "selected and illustrated edition; ideal for read-aloud"),
       ("*Let the Children March*", "Monica Clark-Robinson — civil rights, age-appropriate"),
       ("Aaron Douglas artist profile cards", "printable from museum education sites")])]]),
  ("section", {"label": "Differentiation notes",
    "body": ["At this level, the Green/Yellow/Red split primarily reflects reading scaffolding and writing expectation depth rather than topic difficulty. All students engage with the same art and same core ideas — the differentiation is in how much independent language production is expected. Red-level students at Grades 1–2 are ready for genuine critical thinking: asking *why*, not just *what*."]}),
  ("section", {"label": "Display suggestions", "list": [
    "**Feature display:** Harlem Renaissance portraits — use library display boards to show Douglas, Hughes, Ellington, Hurston, McKay with brief bios at 1–2 grade reading level",
    "**Student work wall:** post silhouette drawings from the session alongside the Douglas print",
    "**Book spine display:** all Harlem Renaissance-related books face-out for the duration of the unit"]}),
])

MATCH = ('<div class="match"><p class="label">Person</p><div></div><p class="label">What they made</p><div class="col l"><span><b>Aaron Douglas</b></span><span><b>Langston Hughes</b></span>'
         '<span><b>Duke Ellington</b></span></div><div></div><div class="col r"><span>jazz music</span>'
         '<span>poems</span><span>paintings</span></div></div>')

GREEN_12 = card(G12, "Grades 1–2", "green", "Green Level",
  ["The Harlem Renaissance was a time in the 1920s when lots of Black artists, musicians, and writers all lived in Harlem, New York and created amazing things together. **Aaron Douglas** painted bold, beautiful pictures. **Langston Hughes** wrote poems. **Duke Ellington** made jazz music."],
  [("task", {"label": "Part 1", "title": "Match it", "blocks": [H(MATCH)]}),
   ("task", {"label": "Part 2", "title": "Look and write", "blocks": [art(SONG), H(fill("I can see:") + fill("It makes me feel:"))]}),
   ("task", {"label": "Part 3", "title": "Your poem",
     "blocks": [P("Fill in:"), H(fill("Harlem sounds like") + fill("Harlem looks like") + fill("Harlem feels like"))]})],
  HERO_12, young=True, css=L24)

YELLOW_12 = card(G12, "Grades 1–2", "yellow", "Yellow Level",
  ["During the Harlem Renaissance (1920s–1930s), Black artists, poets, and musicians in Harlem, New York created a cultural explosion. Many had moved north from the South during the **Great Migration**. When they found each other in Harlem, something extraordinary happened."],
  [("task", {"label": "Part 1", "title": "Analyze the art", "blocks": [art(SONG),
     H('<p><span class="qn">1.</span> What three things do you notice first?</p>' + fill("1") + fill("2") + fill("3")
       + '<p style="margin-top:6pt"><span class="qn">2.</span> The figures have no faces. Why do you think Douglas made that choice?</p>')],
     "lines": 2}),
   ("task", {"label": "Part 2", "title": "Write a poem",
     "blocks": [P("Write a 4-line poem about Harlem or jazz. Each line starts with a different sense word: <i>I see… I hear… I feel… I know…</i>"), H(fill("I see…") + fill("I hear…") + fill("I feel…") + fill("I know…"))]})],
  HERO_12, young=True, css=L24)

RED_12 = card(G12, "Grades 1–2", "red", "Go Deeper",
  ["The Harlem Renaissance was a time of **cultural explosion** — when artists, musicians, and writers found each other in Harlem and created work that would change America. Aaron Douglas chose silhouettes so his figures could represent everyone, not just one person."],
  [("task", {"label": "Part 1", "title": "Compare two works", "blocks": [art(SONG, CREATION)],
     "body": ["**1.** Both use silhouettes and circles. What is different about the mood of each painting? Why?"], "lines": 2}),
   ("task", {"label": "Part 2", "title": "Write and think",
     "blocks": [P("<b>2.</b> Langston Hughes wrote: <i>“I, too, sing America.”</i> In your own words, what do you think he meant? How does that connect to Aaron Douglas’s paintings?"),
                H('<div class="write"><i></i><i></i></div><p style="margin-top:6pt"><b>3.</b> If you could add one thing to the Harlem Renaissance — a painting, a poem, a song, a story — what would it be, and why?</p>')],
     "lines": 2})],
  HERO_12, young=True, css=L24)

# ══ Grades 3–5 ═════════════════════════════════════════════════════════

G35 = ("grades-3-5", "Grades3_5")
HERO_35 = {"img": HARLEM, "pos": "center 45%"}

LP_35 = plan(G35, "Grades 3–5", ["Grades 3–5", "40 minutes", "Research skills + close reading"], HERO_35, [
  ("timing", [("Hook", 5, C1), ("Reading", 7, C2), ("Art look", 5, C3), ("Activity cards", 18, C4), ("Share", 5, C5)]),
  ("section", {"label": "Session goals", "title": "What students will do",
    "body": ["Students will: use the exhibition and library resources to practice research skills; connect primary sources (poems, art, music) to historical context; develop descriptive and analytical writing; and understand how the library is a portal to the past — the stories here are the same ones the Harlem Renaissance artists were creating."]}),
  ("section", {"label": "Preparation", "list": [
    "**Pull and display:** 8–10 relevant library books (see recommendations, page 2)",
    "**Tables set:** differentiated activity cards, pencils; optionally set up 2–3 research stations with books open to relevant sections",
    "**Project:** Great Migration Map and one Douglas image for whole-group opening"]}),
  ("section", {"label": "0–5 min", "title": "Opening hook",
    "body": ["Show the Great Migration Map. *“In 1915, a Black family in Georgia could be arrested for almost nothing, couldn’t vote, and would never own the land they farmed. A letter arrives from Chicago: ‘Come north. There are factory jobs. The schools are better.’ Over the next 50 years, 6 million people made that decision. The whole of Harlem changed because of it. Today we’re going to look at what they created when they got there.”*"]}),
  ("section", {"label": "5–12 min", "title": "Whole-group reading",
    "body": ["Read aloud one Langston Hughes poem (teacher choice — “I, Too” works well; “Mother to Son” also excellent). Ask: What do you notice about the language? Who is speaking? What is the argument? How is this poem like a letter, a protest, and a prayer all at once?"]}),
  ("section", {"label": "12–17 min", "title": "Art and source look",
    "body": ["Show Douglas, *Song of the Towers*. Quick pair-share: two observations + one question. Introduce the idea that the painting and the poem were made at the same time, in the same neighborhood — Douglas and Hughes knew each other."]}),
  ("section", {"label": "17–35 min", "title": "Activity cards",
    "body": ["Students work on differentiated cards. Encourage library book use for the Red-level research task. Circulate and ask probing questions: *“How do you know? Where’s your evidence? What else does this make you wonder?”*"]}),
  ("section", {"label": "35–40 min", "title": "Share and close",
    "body": ["One student each from Yellow and Red shares their most interesting finding. *“The books on these shelves are a direct line to the people we studied today. The library is where their voices are still alive.”*"]}),
  ("connection", CONN),
  ("pagebreak", None),
  ("section", {"label": "Book recommendations · Grades 3–5"}),
  ("cols", [
    [("section", {"label": "Biography and history"}),
     ("refs", [
       ("*Langston Hughes: A Biography*", "Milton Meltzer — comprehensive, accessible"),
       ("*Zora Hurston and the Chinaberry Tree*", "William Miller — picture-book biography"),
       ("*Duke Ellington: The Piano Prince*", "Andrea Davis Pinkney — excellent at this level"),
       ("*Stompin’ at the Savoy: The Story of Norma Miller*", "Norma Miller with Alan Govenar — Lindy Hop at the Savoy Ballroom")])],
    [("section", {"label": "Primary text access"}),
     ("refs", [
       ("*Poetry for Young People: Langston Hughes*", "selected with classroom notes"),
       ("*The Dream Keeper and Other Poems*", "Langston Hughes — designed for young readers"),
       ("*Soul Looks Back in Wonder*", "Tom Feelings — anthology with Harlem Renaissance figures"),
       ("*Harlem Renaissance: A Brief History with Documents*", "higher level, for Red extension"),
       ("Online", "The Poetry Foundation (poetryfoundation.org) and the Academy of American Poets (poets.org) both offer many Hughes poems free")])]]),
  ("section", {"label": "Research skills integration",
    "body": ["This session is an ideal opportunity to integrate research skills instruction:"],
    "list": [
      "**Finding a book:** Model using the catalog to find Harlem Renaissance books by subject heading",
      "**Using an index:** Show students how to use the index in a biography to find specific information quickly",
      "**Evaluating sources:** Ask: what’s the difference between reading a poem Langston Hughes wrote vs. reading a book about Langston Hughes? Which is a primary source?",
      "**Note-taking:** Red-level students should practice paraphrasing — not copying — from sources they find"]}),
])

HUGHES = {"text": "I, too, sing America.<br>I am the darker brother.<br>They send me to eat in the kitchen when company comes,<br>But I laugh, and eat well, and grow strong.<br>Tomorrow, I’ll be at the table…",
          "ref": "Langston Hughes, 1926"}
HUGHES_HTML = ('<blockquote class="verse" style="margin:3pt 0 7pt"><p>' + HUGHES["text"] + '</p><cite>— '
               + HUGHES["ref"] + '</cite></blockquote>')

GREEN_35 = card(G35, "Grades 3–5", "green", "Green Level",
  ["The Harlem Renaissance (1920s–1930s) was a cultural explosion in Harlem, New York. Millions of Black Americans had moved north from the South (the **Great Migration**). When they arrived in Harlem, artists, musicians, and writers found each other — and created some of the most powerful art, music, and writing in American history."],
  [("task", {"label": "Part 1", "title": "Key people",
     "blocks": [P("Use the library books or your knowledge to complete this chart:"), ("table", {"head": ["Person", "What they created", "One interesting fact"], "rows": [
       ["**Langston Hughes**", "", ""], ["**Aaron Douglas**", "", ""], ["**Duke Ellington**", "", ""], ["**Zora Neale Hurston**", "", ""]]})]}),
   ("task", {"label": "Part 2", "title": "The painting", "blocks": [art(SONG),
     H('<p><b>Three things I observe:</b></p>' + fill("1") + fill("2") + fill("3")
       + '<p style="margin-top:6pt"><b>What I think this painting is about:</b></p>')], "lines": 2})],
  HERO_35, css="table.fill td:first-child { width: 26%; }")

YELLOW_35 = card(G35, "Grades 3–5", "yellow", "Yellow Level",
  ["Aaron Douglas and Langston Hughes were friends who worked in the same neighborhood at the same time. Douglas painted the visual language of the Renaissance; Hughes wrote the verbal language. Both were making the same argument: Black culture is beautiful, powerful, and worthy of the finest art."],
  [("task", {"label": "Part 1", "title": "Compare art and poetry",
     "blocks": [("cols", [[art("<b>Douglas</b> — <i>Song of the Towers</i>")], [H(HUGHES_HTML)]])],
     "body": ["What argument do **both** the painting and the poem make? Write 2–3 sentences:"], "lines": 5}),
   ("task", {"label": "Part 2", "title": "Research",
     "blocks": [P("Find one library book about the Harlem Renaissance. Write the title and one fact you didn’t know before:"),
                H(fill("Book:") + fill("New fact:"))], "lines": 2})],
  HERO_35)

RED_35 = card(G35, "Grades 3–5", "red", "Go Deeper",
  ["**Research challenge:** The Harlem Renaissance produced extraordinary art, music, and writing — but it happened in a specific historical context of injustice. To understand why it matters, you need to understand both what the artists created and what they were responding to."],
  [("task", {"label": "Part 1", "title": "Find the evidence",
     "blocks": [P("Use library books to find evidence for <b>both</b> sides of this picture:"), ("table", {"head": ["What the Harlem Renaissance created", "What it was responding to"], "rows": [["", ""], ["", ""], ["", ""]]}),
                H(fill("Sources used:"))]}),
   ("task", {"label": "Part 2", "title": "Primary vs. secondary source",
     "blocks": [P("Langston Hughes’s poem “I, Too” is a <b>primary source</b>. A book about Hughes is a <b>secondary source</b>. Find one of each in the library today and record them:"), H(fill("Primary source:") + fill("Secondary source:")
                  + '<p style="margin-top:6pt">What can the primary source tell you that the secondary source cannot?</p>')], "lines": 2}),
   ("task", {"label": "Part 3", "title": "Your argument",
     "body": ["In 3 sentences: why does the Harlem Renaissance still matter today?"], "lines": 3})],
  HERO_35, css="table.fill td:first-child { width: 50%; border-right: .6pt solid #c8c5bb; } table.fill td + td, table.fill th + th { padding-left: 8pt; }")

# college-ruled lines for the oldest students
L20 = "body.student:not(.young) { --line: 20pt; }"

# ══ Grades 6–8 ═════════════════════════════════════════════════════════

G68 = ("grades-6-8", "Grades6_8")
HERO_68 = {"img": POSTER, "pos": "center 78%"}

LP_68 = plan(G68, "Grades 6–8", ["Grades 6–8", "45 minutes", "Research + critical analysis"], HERO_68, [
  ("timing", [("Provocation", 5, C1), ("Research frame", 5, C2), ("Research and activity cards", 28, C4), ("Share", 7, C5)]),
  ("section", {"label": "Session goals", "title": "What students will do",
    "body": ["Students will: conduct targeted research using library resources and the exhibition; evaluate and compare primary and secondary sources; develop and defend an interpretive claim about the Harlem Renaissance; and practice evidence-based writing. The librarian connects information literacy skills explicitly to the historical inquiry."]}),
  ("section", {"label": "Preparation", "list": [
    "**Pull and display:** 10–12 library books across biography, poetry collections, history, and critical essays (see page 2)",
    "Set up 3 research stations with specific books and a guiding question card at each (optional — see station suggestions, page 2)",
    "**Tables set:** differentiated activity cards, pencils; computers/iPads available for Red-level independent research",
    "**Project:** one Douglas image for reference during the session"]}),
  ("section", {"label": "0–5 min", "title": "Opening provocation",
    "body": ["Show two images side by side — Aaron Douglas’s *Song of the Towers* and the Obelisk/Reconstruction mural. No labels. Ask: *“What is different about these two paintings — and what does the difference tell you?”* Take 4–5 responses. Then: *“Both were made by the same man, in the same decade, in Harlem. Today you’re going to figure out why they look so different.”*"]}),
  ("section", {"label": "5–10 min", "title": "Research skills frame",
    "body": ["Briefly introduce the session structure. Model: how to use an index efficiently; what a primary source vs. secondary source looks like; how to take a note without copying word-for-word. Remind: *“Your job is not to collect facts. Your job is to build an argument.”*"]}),
  ("section", {"label": "10–38 min", "title": "Research and activity cards",
    "body": ["Students work on differentiated cards, using library resources. Red-level students have independent research tasks requiring catalog use. Circulate: challenge students to show you one piece of evidence and explain how it supports their argument. Push for analytical writing, not summary."]}),
  ("section", {"label": "38–45 min", "title": "Share and synthesis",
    "body": ["One Yellow student and one Red student share their argument/claim. Class responds: *“Do you agree? What evidence would you add or challenge?”* Close with: *“Everything you found today was already in this building. The library is the archive of human thought — and the Harlem Renaissance is part of that archive.”*"]}),
  ("connection", CONN),
  ("pagebreak", None),
  ("section", {"label": "Book recommendations · Grades 6–8"}),
  ("cols", [
    [("section", {"label": "History and biography"}),
     ("refs", [
       ("*The Warmth of Other Suns*", "Isabel Wilkerson — the definitive Great Migration account (National Book Critics Circle Award); excerpts suitable for Grades 7–8"),
       ("*Up From Slavery*", "Booker T. Washington — important context; free online"),
       ("*The Souls of Black Folk*", "W.E.B. Du Bois — foundational text; excerpts appropriate for advanced Grade 8"),
       ("*Harlem Stomp!*", "Laban Carrick Hill — age-appropriate history with primary source excerpts"),
       ("*Zora Neale Hurston: A Life in Letters*", "edited by Carla Kaplan — primary sources")])],
    [("section", {"label": "Poetry and literature"}),
     ("refs", [
       ("*The Collected Poems of Langston Hughes*", "complete; ideal for class copies"),
       ("*Their Eyes Were Watching God*", "Zora Neale Hurston — Grade 8+ excerpt-level; full novel for strong readers"),
       ("*The New Negro*", "ed. Alain Locke (1925) — the defining anthology of the Renaissance; free online via HathiTrust"),
       ("*If We Must Die: The Life of Claude McKay*", "Gary Edward Holcomb"),
       ("poetryfoundation.org and poets.org", "many Renaissance-era poems free, with teaching notes")])]]),
  ("section", {"label": "Optional research station cards"}),
  ("cards", [
    ("Station A — The Poets", ["Find two poems by different Harlem Renaissance poets. What do they have in common? What is different about their voices and arguments?"]),
    ("Station B — The Painters", ["Research Aaron Douglas and Jacob Lawrence. Both used bold, flat shapes. How are their styles different? What was each trying to say?"]),
    ("Station C — The Context", ["Find one fact about what life was like for Black Americans in the South before the Great Migration. Find one fact about what they found in the North. Does the data change your understanding of the Harlem Renaissance?"])]),
  ("section", {"label": "Information literacy connections", "list": [
    "**Database vs. book:** Show students how Britannica School or JSTOR Kids yields different results from a library book — different types of sources for different tasks",
    "**Citation:** Red-level students should cite at least one source in their response — introduce MLA or Chicago author-date as appropriate for grade level",
    "**Search strategy:** Teach subject heading searching in the catalog: “Harlem Renaissance,” “African American art — 20th century,” “Jazz — history and criticism”"]}),
])

GREEN_68 = card(G68, "Grades 6–8", "green", "Green Level",
  ["The Harlem Renaissance (1920s–1930s) was a cultural explosion in Harlem, New York — art, music, poetry, and writing that changed American culture. It happened because millions of Black Americans moved north during the **Great Migration** and found each other in the same neighborhood."],
  [("task", {"label": "Part 1", "title": "Research task",
     "blocks": [P("Use library books to find information on two people from the Harlem Renaissance. Write one paragraph about each:"),
                H(fill("Person 1:", "Source:"))], "lines": 4}),
   ("html", '<div style="margin:-2pt 0 8pt 42pt">' + fill("Person 2:", "Source:") + '<div class="write">' + "<i></i>" * 4 + "</div></div>"),
   ("task", {"label": "Part 2", "title": "Analyze one work", "blocks": [art(ASPECTS)],
     "body": ["What story is this painting telling? What details tell you that?"], "lines": 3})],
  HERO_68, css=L20)

YELLOW_68 = card(G68, "Grades 6–8", "yellow", "Yellow Level",
  ["The Harlem Renaissance produced extraordinary work — but it happened against a backdrop of systemic injustice. Understanding why the Renaissance matters requires understanding both what was created and what it was created in response to."],
  [("task", {"label": "Part 1", "title": "Source analysis",
     "blocks": [P("Find one <b>primary source</b> (a poem, story, or image by a Harlem Renaissance artist) and one <b>secondary source</b> (a book about the Harlem Renaissance) in the library:"), H('<div class="pair2"><div>' + fill("Primary:") + '</div><div>' + fill("Secondary:") + '</div></div>'
                  + '<p style="margin-top:6pt">What can each source tell you that the other cannot?</p>')], "lines": 2}),
   ("task", {"label": "Part 2", "title": "Build an argument",
     "body": ["Using evidence from your sources, write a 5-sentence paragraph arguing: Was the Harlem Renaissance primarily a **cultural achievement**, a **political act**, or **both**? Include a claim, at least two pieces of evidence, and a conclusion."], "lines": 5}),
   ("task", {"label": "Part 3", "title": "The library’s role",
     "body": ["Name one resource in this library that connects directly to the Harlem Renaissance. How would you help a younger student find it?"], "lines": 2})],
  HERO_68, css=L20)

RED_68 = card(G68, "Grades 6–8", "red", "Go Deeper",
  ["**Research question:** Alain Locke (*The New Negro*, 1925) saw a spiritual and cultural awakening. W.E.B. Du Bois (“Criteria of Negro Art,” 1926) insisted “all Art is propaganda.” Were they describing the same thing — or fundamentally different visions of what the Renaissance was for?"],
  [("task", {"label": "Part 1", "title": "Independent research",
     "blocks": [P("Use the library catalog and at least two sources to find evidence for both Locke’s and Du Bois’s positions. Record your sources using proper citation format:"), H('<div class="pair2"><div>' + fill("Source 1:") + fill("Evidence for Locke’s view:") + '<div class="write"><i></i><i></i></div></div>'
                  + '<div>' + fill("Source 2:") + fill("Evidence for Du Bois’s view:") + '<div class="write"><i></i><i></i></div></div></div>')]}),
   ("task", {"label": "Part 2", "title": "Your argument",
     "body": ["Write a 5–6 sentence analytical paragraph: were Locke and Du Bois describing the same Renaissance, or did they have fundamentally different visions? Who do you think was closer to the truth — and why? Cite your evidence."], "lines": 5}),
   ("task", {"label": "Part 3", "title": "Extend",
     "body": ["Find one Harlem Renaissance resource in the library that most students wouldn’t find easily — a less obvious entry point. What is it, and why is it valuable?"], "lines": 2})],
  HERO_68, css=L20)

# ── the plans' running order as one table, and book lists set as a list ──

def flow(rows):
    cells = "".join(f'<div><p class="ft">{inline(t)}</p><p class="fn">{inline(n)}</p></div>'
                    f'<div><p>{inline(b)}</p></div>' for t, n, b in rows)
    return ("html", f'<p class="label" style="margin-top:2pt">Session flow</p><div class="flow">{cells}</div>')

def books(pairs):
    return ("html", '<ul class="books">' + "".join(
        f"<li>{inline(a if a.startswith('*') else '**' + a + '**')} — {inline(b)}</li>" for a, b in pairs) + "</ul>")

def tidy(doc):
    out, run = [], []
    for k, v in doc["blocks"]:
        if k == "section" and re.match(r"\d+–\d+ min$", v.get("label", "")):
            run.append((v["label"], v["title"], v["body"][0])); continue
        if run:
            out.append(flow(run)); run = []
        if k == "pagebreak":
            continue
        if k == "cols":
            v = [[books(b) if kk == "refs" else (kk, b) for kk, b in col] for col in v]
        out.append((k, v))
    doc["blocks"] = out
    return doc

for _d in (LP_PK, LP_12, LP_35, LP_68):
    tidy(_d)
LP_68["css"] += ".cards { grid-template-columns: repeat(3, 1fr); }"

DOCS = [LP_PK, GREEN_PK, YELLOW_PK, RED_PK,
        LP_12, GREEN_12, YELLOW_12, RED_12,
        LP_35, GREEN_35, YELLOW_35, RED_35,
        LP_68, GREEN_68, YELLOW_68, RED_68]

# links to the paintings this module names (see _links.py)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import add_links as _add_links
_add_links(DOCS)
