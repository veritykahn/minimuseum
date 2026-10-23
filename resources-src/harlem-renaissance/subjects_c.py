"""Harlem Renaissance · Grades 5–8 · Religion, Spanish, Theater and Music.

Converted from the earlier resources to the branded template with their own
words: see resources-src/CONVERTING.md. Aaron Douglas's paintings, which the
old handouts reproduced, are still in copyright, so they are named and not
shown; the teacher shows the work in class."""
import html as _h, re
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import screen_links

D = "teachers/grades-5-8/"
HX = "/exhibitions/harlem/"
MIG = HX + "images/migration/"

def il(t):
    """Same markup as build.inline, for copy set inside html blocks."""
    t = _h.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def P(t, cls=""):
    c = f' class="{cls}"' if cls else ""
    return ("html", f"<p{c}>{il(t)}</p>")

def aside(label, paras, url=True):
    """A connection box under a label of the original's own (Deep Dive)."""
    u = '<p class="url">minimuseumproject.org/exhibitions/harlem-renaissance</p>' if url else ""
    return ("html", f'<aside class="conn"><p class="label">{il(label)}</p>'
            + "".join(f"<p>{il(p)}</p>" for p in paras) + u + "</aside>")

def note(label, paras):
    """A labelled note under a rule, like the family box."""
    return ("html", f'<aside class="family"><p class="label">{il(label)}</p>'
            + "".join(f"<p>{il(p)}</p>" for p in paras) + "</aside>")

def fields(items):
    """Labelled write-on lines in a row: (label, width)."""
    cols = " ".join(f"{w}fr" for _, w in items)
    return ("html", f'<div class="fl" style="grid-template-columns:{cols}">'
            + "".join(f"<span>{il(l)}</span>" for l, _ in items) + "</div>")

CSS = """
.fl { display: grid; gap: 14pt; margin: 2pt 0 8pt; }
.fl span { border-bottom: .8pt solid #8d8a80; padding: 10pt 0 2pt; font-weight: 500; font-size: 9.4pt; }
.q { margin: 6pt 0 0; } .q + .write { margin-top: 0; } .qa { break-inside: avoid; }
.cap { font-size: 8.8pt; color: #3f3e3a; border-left: 1.2pt solid var(--accent); padding-left: 8pt; }
.bank { display: flex; flex-wrap: wrap; gap: 6pt; margin: 4pt 0 8pt; }
.bank span { border: .8pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 11pt; font-weight: 400; background: rgba(255,255,255,.6); }
.match { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; margin: 4pt 0 8pt; }
.match p { margin: 0 0 7pt; }
.bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4pt; margin: 4pt 0 8pt; }
.bars div { border: .8pt solid var(--accent); border-radius: 3pt; padding: 4pt; text-align: center; font-size: 9pt; background: rgba(255,255,255,.7); }
.bars div.iv { background: #E9DDF2; } .bars div.v { background: #D2BAE4; }
.bars b { display: block; }
.comp { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 4pt 0 8pt; }
.comp > div { border: .8pt solid var(--accent); border-radius: 4pt; padding: 5pt 6pt 0; background: rgba(255,255,255,.6); }
.comp b { display: block; font: 500 7.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 3pt; color: var(--gold-text); }
.beats { display: grid; grid-template-columns: repeat(8, 1fr); }
.beats span { height: 52pt; border-left: .6pt dotted #a9a69b; font-size: 7.5pt; color: #5b5a55; text-align: center; padding-top: 1pt; }
.beats span:first-child { border-left: 0; }
.ltr .label { margin-top: 2pt; }
.task h3:empty { display: none; }
"""

# the originals fit two dense pages; the plans run a touch tighter than the model
LP_CSS = """
.hero { height: 1.95in; } .levels { margin: 2pt 0 6pt; } .lv { padding-top: 4pt; } body { font-size: 9pt; line-height: 1.4; }
.sec { break-inside: auto; } .sec h3, .sec .label { break-after: avoid; } .sec p, .sec li { orphans: 2; widows: 2; }
.sec { margin-bottom: 7pt; } .refs { gap: 2pt 10pt; } ul { margin-bottom: 4pt; } li { margin-bottom: 1.5pt; } .levels { margin-bottom: 8pt; } .timing { margin-bottom: 10pt; }
.conn { padding-top: 6pt; } .conn p { margin-bottom: 3pt; }
"""

# writing lines a little closer than the model's, so the originals' prompts
# keep their space on two pages
HO_CSS = """
body.student { --line: 21pt; } .task { margin-bottom: 6pt; } .q { margin-top: 3pt; }
.cols .prayer, .cols .conn, .cols .family { margin-top: 0; } .cols .conn { margin-bottom: 0; } body > :last-child { margin-bottom: 0; }
"""

def chips(*c):
    return ("chips", list(c))

def conn_lp():
    return ("connection", [
        "**Option 1 — Visit the exhibition:** Bring your class to experience the phonograph, the Great Migration Map, the Jazz Lab, and more. Ask your librarian to arrange a visit. **Option 2 — Virtual visit:**"])

def lesson(subject, key, title, hero, blocks, css="", sub=None):
    return {"out": f"{D}{subject.lower()}/HR_LP_{key}.pdf", "eyebrow": "Teacher lesson plan",
            "title": title, "sub": sub or f"Grades 5–8 · {subject}", "hero": hero,
            "foot": f"Teacher Lesson Plan · Grades 5–8 {subject}", "blocks": blocks, "css": CSS + LP_CSS + css}

def handout(subject, key, title, level, hero, blocks, context=None, css=""):
    return {"out": f"{D}{subject.lower()}/HR_Handout_{level.title()}_{key}.pdf", "eyebrow": "Student handout",
            "title": title, "sub": f"Grades 5–8 · {subject}", "level": level, "hero": hero,
            "context": context, "blocks": blocks, "css": CSS + HO_CSS + css,
            "foot": f"Student Handout · {subject} 5–8 · {level.title()} Level"}

def q(text, lines):
    """A question with its writing lines, kept together across a page break."""
    w = '<div class="write">' + "<i></i>" * lines + "</div>" if lines else ""
    return [("html", f'<div class="qa"><p class="q">{il(text)}</p>{w}</div>')]

# ════════════════════════════════════════════════════════════════════
# RELIGION · Created in God's Image
# ════════════════════════════════════════════════════════════════════
R_T = "Created in God's Image"
R_HERO = {"img": HX + "poster2-photograph.jpg", "pos": "center 30%"}

GEN = {"text": "\"Then God said, 'Let us make humankind in our image, according to our likeness'... So God created humankind in his image, in the image of God he created them.\"", "ref": "Genesis 1:26–27"}

# "screen" on a section is for the site's Lesson mode only (resources-src/
# export_lessons.py); build.py ignores it, so the PDF is unchanged. Anything
# printed and shown on screen is written once, as a constant.
CHOOSE = ["Choose Green, Yellow or Red. You can switch at any time."]
R_Q1 = "what does it mean to be made in God's image?"
R_Q2 = "if every person is made in God's image — equally — what does it mean when a society treats some people as less than others?"
R_HUGHES = "Langston Hughes was saying: 'I, too, am America.'"
R_SOLIDARITY = "what happens to one member of the human family affects all of us."
R_PRAYER = "Creator God, you made every person in your image. Give us the courage of the Harlem Renaissance artists — to see beauty and dignity in every face, and to insist that the world see it too. Amen."
R_WORK = {"work": "Song of the Towers", "artist": "Aaron Douglas", "date": "1934",
          "links": screen_links("Song of the Towers")}

REL_LP = lesson("Religion", "Religion", R_T, R_HERO, [
  ("timing", [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 22, "#7A4B9A"), ("Prayer", 6, "#A8452F")]),
  ("section", {"label": "Learning objective", "title": "What students will understand",
    "body": ["Students will explore how the Harlem Renaissance was a profound affirmation of human dignity rooted in the theological conviction that every person is made *imago Dei* — in the image and likeness of God. They will connect Catholic Social Teaching Principle 1 (Life and Dignity of the Human Person) to the cultural and artistic work of the Renaissance, and reflect on their own responsibility to affirm the dignity of others."]}),
  ("section", {"label": "Standards and themes", "list": [
    "**CST Principle 1** — Life and Dignity of the Human Person: every human being is created in God's image and deserves respect regardless of race, status, or achievement",
    "**CST Principle 7** — Solidarity: we are one human family; our responsibilities to one another cross racial, cultural, and national boundaries",
    "**Genesis 1:26–27** — \"Let us make humankind in our image, according to our likeness\": the theological foundation of human dignity",
    "**Matthew 25:40** — \"Whatever you did for one of the least of these brothers and sisters of mine, you did for me\""]}),
  ("section", {"label": "Materials needed", "list": [
    "Bible (classroom set or projected)",
    "Projected or printed Aaron Douglas image — *Song of the Towers* or *Aspects of Negro Life*",
    "Differentiated handouts — one per student"]}),
  ("section", {"label": "Hook · 5 minutes", "title": "Two questions",
    "screen": {"phase": "Hook", "show": "question", "question": f"{R_Q1[0].upper()}{R_Q1[1:]} {R_Q2[0].upper()}{R_Q2[1:]}",
               "purpose": "Hold the tension between the theological claim and the historical reality. Don’t resolve it yet.",
               "students": ["Take 30 seconds and write one sentence for each."]},
    "body": [f"*\"I'm going to ask you two questions. First: {R_Q1} Take 30 seconds and write one sentence. Second: {R_Q2}\"*",
             "Take 4–5 responses to each. Hold the tension between the theological claim and the historical reality. Don't resolve it yet."]}),
  ("section", {"label": "Direct instruction · 12 minutes", "title": "Imago Dei and the Harlem Renaissance",
    "screen": [
      {"phase": "Teach", "minutes": 4, "script": [0], "title": "Imago Dei", "show": "verse", "verse": GEN,
       "purpose": "Establish the theological foundation: dignity is given, not earned.",
       "students": ["What does this passage say about every person’s value?"]},
      {"phase": "Teach", "minutes": 4, "script": [1], "title": "In paint and poetry and jazz", "show": "artwork", **R_WORK,
       "purpose": "See the claim of *imago Dei* made in art.",
       "students": [R_HUGHES, "How does this painting affirm the idea of *imago Dei*?"]},
      {"phase": "Teach", "minutes": 4, "script": [2], "title": "Solidarity", "show": "words",
       "text": R_SOLIDARITY[0].upper() + R_SOLIDARITY[1:], "cite": "CST Principle 7 — Solidarity",
       "purpose": "Connect the Renaissance’s response to injustice to the call to solidarity.",
       "students": ["What does solidarity ask of us today?"]}],
    "body": ["Establish the theological foundation: *imago Dei* (Genesis 1:26–27) means every human person possesses inherent, irreducible dignity — not earned by achievement, status, race, or talent. This is not a social convention; it is a theological claim about the nature of reality.",
             f"*\"The artists, writers, and musicians of the Harlem Renaissance were making exactly this claim — but in paint and poetry and jazz. {R_HUGHES} Aaron Douglas was painting figures without individual faces because the point was not one person's dignity — it was every Black person's dignity. That is a theological argument expressed in art.\"*",
             f"Introduce the historical context briefly: Jim Crow laws, segregation, and the cultural response of the Harlem Renaissance as an assertion that Black life, art, and culture were not only equal but magnificent. Connect to CST Principle 7 — Solidarity: {R_SOLIDARITY}"]}),
  ("section", {"label": "Activity · 22 minutes",
    "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
               "purpose": "Connect scripture and Catholic Social Teaching to the Renaissance at the right level of challenge.",
               "students": CHOOSE}}),
  ("levels", {
    "green": "Read Genesis 1:26–27 and a short summary of CST Principle 1. Answer four guided questions connecting the theological text to the Harlem Renaissance. Draw or describe one moment from the Renaissance that expressed human dignity.",
    "yellow": "Read two scripture passages and apply CST Principle 1 to two specific examples from the Harlem Renaissance. Write a reflective paragraph on what it means to affirm someone's *imago Dei* through creative work — and what students' responsibility is today.",
    "red": "Theological analysis: how does the Harlem Renaissance represent a response to the systematic violation of *imago Dei*? Write a structured theological reflection using scripture, CST, and specific Renaissance examples. Respond to: can art be a form of prayer or prophetic witness?"}),
  ("section", {"label": "Closing prayer · 6 minutes",
    "screen": {"phase": "Prayer", "show": "prayer", "title": "Closing prayer", "prayer": R_PRAYER,
               "purpose": "Give thanks for the artists who insisted on the dignity of every person, and ask for their courage.",
               "students": ["A student leads a brief prayer of gratitude — or pray the handout’s prayer together."]},
    "body": ["Invite a student to lead a brief prayer of gratitude for the artists, writers, and musicians who insisted on the dignity of every person — and a prayer for the courage to do the same in their own lives."]}),
  conn_lp(),
  ("section", {"label": "Theological framework", "body": [
    "**Imago Dei (Genesis 1:26–27):** The conviction that every human person is created in the image and likeness of God is the foundation of the Catholic understanding of human dignity. This dignity is not earned; it is given. It cannot be taken away by law, custom, poverty, or prejudice. It applies equally to every human person regardless of race, gender, age, ability, or status.",
    "**CST Principle 1 — Life and Dignity of the Human Person:** Catholic Social Teaching begins with the affirmation that human life is sacred. Society must be organized to protect and affirm this dignity — not undermine it. When laws, social structures, or cultural attitudes deny the dignity of any group of people, they are in direct contradiction to this foundational principle.",
    "**Prophetic witness:** The biblical prophets spoke out when society violated the dignity of the poor and marginalized. The Harlem Renaissance artists were engaging in a similar prophetic witness — insisting that the world see what it was refusing to acknowledge."]}),
  ("section", {"label": "Scripture connections"}),
  ("refs", [
    ("Genesis 1:26–27", "*Imago Dei* — foundational text on human dignity"),
    ("Psalm 139:13–14", "\"You knit me together in my mother's womb... I am fearfully and wonderfully made\" — personal affirmation of each person's sacred worth"),
    ("Matthew 25:31–46", "\"Whatever you did for one of the least of these\" — the practical expression of human dignity in action"),
    ("Galatians 3:28", "\"There is neither Jew nor Greek, slave nor free, male nor female, for you are all one in Christ Jesus\" — Paul's radical statement of human equality"),
    ("Amos 5:24", "\"Let justice roll down like waters, and righteousness like an ever-flowing stream\" — prophetic demand for social justice")]),
  ("section", {"label": "Cross-curricular and assessment notes", "list": [
    "**ELA:** Langston Hughes's \"I, Too\" is a direct assertion of *imago Dei* in poetic form — \"I, too, am America\" is a theological claim as well as a political one",
    "**Art:** Aaron Douglas's featureless silhouettes say: the individual face doesn't matter — what matters is the shared dignity of every figure. This is a visual argument for *imago Dei*.",
    "**Social Studies:** The contrast between CST's affirmation of human dignity and the legal reality of Jim Crow is a powerful case study in structural sin",
    "**Assessment:** Reflective journal entry; prayer or psalm written in the style of the biblical texts; presentation connecting one artist or writer to a specific CST principle"]}),
])
REL_LP["slug"] = "created-in-gods-image"

REL_G = handout("Religion", "Religion", R_T, "green", R_HERO, [
  ("task", {"label": "Part 1", "title": "The scripture", "blocks": [("verse", GEN)] + q(
      "**1. In your own words, what does this passage say about every person's value?**", 2) + q(
      "**2. If every person is made in God's image — what does it mean when someone is treated as less important or less valuable than others?**", 3)}),
  ("task", {"label": "Part 2", "title": "The Harlem Renaissance connection", "blocks": [
      P("During the Harlem Renaissance, Black artists, writers, and musicians were saying through their work: our lives matter, our culture is beautiful, our stories deserve to be told.")] + q(
      "**3. How is that the same as what Genesis 1:26–27 says?**", 3)}),
  ("task", {"label": "Part 3", "title": "Seeing dignity in art", "blocks": [
      P("*Aaron Douglas — Aspects of Negro Life: An Idyll of the Deep South, 1934.* Douglas painted Black figures as strong, hopeful, and worthy of great art.", "cap")] + q(
      "**4. Aaron Douglas painted Black figures as noble, powerful, and spiritually meaningful. How does this painting affirm the idea of *imago Dei*?**", 6)}),
  ("task", {"label": "Part 4", "title": "Your reflection", "blocks": q(
      "**5. Write one sentence about how you can affirm someone's dignity — in your school or family — this week:**", 4)}),
  ("connection", ["The Harlem Renaissance artists were doing in paint and poetry what the Church teaches about every person: that you are sacred, that your story matters, that your life has infinite worth. As you explore the exhibition, notice how each artwork asserts human dignity."]),
  ("prayer", ["Lord, help me to see your image in every person I meet — especially those who are treated as if they don't matter. Give me the courage to say, as the Harlem Renaissance artists did: every person is beautiful and worthy. Amen."]),
], ["**Key idea:** The Catholic Church teaches that every person is made in God's image — called *imago Dei* in Latin (Genesis 1:26–27). This means every human being has sacred worth and dignity, regardless of their race, background, or circumstances. Nobody can take that away."])

REL_Y = handout("Religion", "Religion", R_T, "yellow", R_HERO, [
  ("task", {"label": "Part 1", "title": "Two scripture texts", "blocks": [
      ("verses", [{"text": "\"Let us make humankind in our image, according to our likeness... So God created humankind in his image.\"", "ref": "Genesis 1:26–27"},
                  {"text": "\"You knit me together in my mother's womb... I am fearfully and wonderfully made.\"", "ref": "Psalm 139:13–14"}])] + q(
      "**What do both passages say about the source of human dignity?**", 10)}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Apply CST to two examples", "blocks": [
      P("For each example below, explain how it either affirms or violates CST Principle 1:"),
      ("table", {"head": ["Example", "Affirms or violates dignity?", "Explain using CST language"], "rows": [
          ["Langston Hughes writing \"I, Too\" — claiming Black Americans belong in the national story", "", ""],
          ["Jim Crow laws requiring Black Americans to use separate facilities and preventing them from voting", "", ""],
          ["Aaron Douglas painting Black figures as noble, powerful, and spiritually significant", "", ""]]})]}),
  ("task", {"label": "Part 3", "title": "Reflective paragraph", "blocks": q(
      "Write a paragraph (5–6 sentences) responding to this question: **How did the artists, writers, and musicians of the Harlem Renaissance affirm *imago Dei* through their creative work? And what does their example ask of you?**", 5)}),
  ("task", {"label": "Part 4", "title": "Solidarity", "blocks": [
      P("CST Principle 7 — Solidarity — says we are one human family, and what affects one member affects all of us. The Harlem Renaissance happened in Harlem — but its impact was felt by all Americans.")] + q(
      "**What does solidarity require of someone who witnessed injustice but was not directly affected by it? Use one specific example from the Harlem Renaissance to illustrate your answer:**", 3)}),
  ("cols", [[("connection", ["As you explore the exhibition, choose one artwork, poem, or piece of music and ask: what theological claim is this making? Write down your answer and bring it to class for discussion."])],
            [("prayer", [R_PRAYER])]]),
], ["**Catholic Social Teaching Principle 1 — Life and Dignity of the Human Person:** Every human being is created in the image and likeness of God (*imago Dei*). This sacred dignity is the foundation of all Catholic Social Teaching. Society must be structured to protect and affirm this dignity — and any law, system, or cultural attitude that denies it is a violation of God's order."],
  css="table.fill td:first-child { width: 48%; } table.fill td:nth-child(2) { width: 17%; } table.fill td { padding-bottom: 9pt; } table.fill th { font-size: 7pt; letter-spacing: .12em; } .task { margin-bottom: 4pt; }")

REL_R = handout("Religion", "Religion", R_T, "red", R_HERO, [
  ("task", {"label": "Part 1", "title": "Scripture and theological analysis: the prophetic voice", "blocks": [
      P("**Read:** Amos 5:21–24 (God rejects empty worship and demands justice) and Matthew 25:31–46 (what you do to the least, you do to God).")] + q(
      "**1. How do these passages together establish not just that dignity must be affirmed — but that failing to affirm it is a sin? What does this mean for bystanders, not just perpetrators?**", 3)}),
  ("task", {"label": "Part 2", "title": "The Harlem Renaissance as prophetic witness", "blocks": [
      P("The biblical prophets spoke out when society violated the dignity of the poor and marginalized. They did not simply describe injustice — they insisted on a different reality in God's name.")] + q(
      "**2. In what sense were the Harlem Renaissance artists, writers, and musicians acting as prophetic witnesses? Use at least two specific examples (a poem, a painting, a song) to support your argument:**", 4)}),
  ("task", {"label": "Part 3", "title": "Can art be prayer?", "blocks": [
      P("The Catholic tradition has always understood art as a form of prayer — Michelangelo's Sistine Chapel ceiling, Gregorian chant, the stained glass of Chartres. These are not mere decoration; they are theological statements made visible or audible.")] + q(
      "**3. Argue: is Aaron Douglas's *Song of the Towers* a form of prayer or prophetic witness? What theological claim does it make, and how does its formal language (silhouette, light, circle) carry that claim?**", 6)}),
  ("task", {"label": "Part 4", "title": "Your theological reflection", "blocks": [
      P("CST Principle 1 says human dignity is not earned — it is given by God and cannot be taken away. But structurally, it can be denied.")] + q(
      "Write a theological reflection (5–6 sentences): **what is the difference between dignity being present and dignity being acknowledged? And what does this distinction require of us?**", 7)}),
  ("cols", [[("connection", ["Choose one artwork in the exhibition and write a one-paragraph theological reflection: what does this work say about the nature of the human person? Does it affirm *imago Dei*? How? Would you call it sacred art? Why or why not?"])],
            [("html", '<aside class="prayer"><p class="label">Closing prayer</p><p>God of justice and beauty, you made us in your image — every one of us. May we have the courage of the prophets and the artists of Harlem: to insist on that truth, to make it visible, and to refuse the lie that any person is worth less than another. Amen.</p></aside>')]]),
], ["**Theological frame:** The Hebrew concept of *imago Dei* carries within it not only dignity but vocation — to be made in God's image is to be called to create, to love, and to seek justice. The Harlem Renaissance can be read as a prophetic movement: artists, writers, and musicians declaring what God had already declared about Black humanity, against a society that refused to listen."], css=".cols { grid-template-columns: 1.3fr 1fr; }")

# ════════════════════════════════════════════════════════════════════
# SPANISH · El Renacimiento de Harlem
# ════════════════════════════════════════════════════════════════════
S_T = "El Renacimiento de Harlem"
S_HERO = {"img": MIG + "harlem.jpg", "pos": "center 40%"}
# the handouts are in Spanish, so the name line is too
S_CSS = ".ticket { display: none; } .ticket.es { display: grid; }"
TICKET_ES = ("html", '<div class="ticket es"><div class="stub"><span>Admit one</span></div>'
             '<div class="tfields"><span>Nombre</span><span>Fecha</span><span>Clase</span></div></div>')

def ctx(t):
    return ("html", f'<div class="context">{"".join(f"<p>{il(p)}</p>" for p in t)}</div>')

S_HOOK_Q = "¿Reconocen algo?"
S_CLOSE = "Estas conversaciones cruzaron fronteras y océanos."
# the teacher's vocabulary table: Spanish, English, example sentence
S_VOCAB = [
    ["**el renacimiento**", "the renaissance / rebirth", "*El Renacimiento de Harlem fue un movimiento cultural.*"],
    ["**la silueta**", "the silhouette", "*Aaron Douglas pintaba siluetas sin rasgos individuales.*"],
    ["**la dignidad**", "dignity", "*Los artistas afirmaban la dignidad de la vida negra.*"],
    ["**la migración**", "migration", "*La Gran Migración transformó las ciudades del norte.*"],
    ["**la herencia**", "heritage / inheritance", "*El jazz celebraba la herencia africana.*"],
    ["**la identidad**", "identity", "*Los poetas exploraban su identidad cultural.*"],
    ["**la resistencia**", "resistance", "*El arte fue una forma de resistencia.*"],
    ["**la libertad**", "freedom / liberty", "*La música expresaba el deseo de libertad.*"],
    ["**el orgullo**", "pride", "*Había un nuevo orgullo en la cultura negra.*"],
    ["**afrocubano/a**", "Afro-Cuban", "*La música afrocubana tenía raíces africanas similares.*"]]

SPA_LP = lesson("Spanish", "Spanish", S_T, S_HERO, [
  ("timing", [("Hook", 5, "#7D8471"), ("Vocabulario", 10, "#2F4A5A"), ("Activity", 25, "#7A4B9A"), ("Closing", 5, "#A8452F")]),
  ("section", {"label": "Learning objective", "title": "What students will understand",
    "body": ["Students will build Spanish vocabulary related to the Harlem Renaissance — art, music, culture, history, and human rights — while exploring the shared experience of the African diaspora across the Americas. They will practice vocabulary in context, discuss themes of cultural identity and expression in Spanish, and make connections between the Harlem Renaissance and Spanish-speaking Caribbean cultures (Afro-Cuban music, the Negrismo movement in Puerto Rico and Cuba)."]}),
  ("section", {"label": "Standards alignment", "list": [
    "**ACTFL Interpretive** — Interpret written and oral language on familiar and some unfamiliar topics with developing comprehension",
    "**ACTFL Interpersonal** — Participate in conversations on familiar topics using a variety of strategies; express and support opinions",
    "**ACTFL Presentational** — Present information and ideas on familiar topics with accuracy and detail appropriate to proficiency level"]}),
  ("section", {"label": "Materials needed", "list": [
    "Differentiated handouts (Green / Yellow / Red) — one per student",
    "Optional: audio clip of Afro-Cuban jazz (Machito and his Afro-Cubans, Tito Puente) to open the connection between Harlem jazz and Latin music",
    "Optional: short reading in Spanish about Nicolás Guillén (Cuban poet influenced by the Harlem Renaissance) for Red-level extension"]}),
  ("section", {"label": "Hook · 5 minutes", "title": "La música conecta",
    "screen": {"phase": "Hook", "show": "question", "question": S_HOOK_Q,
               "purpose": "Open with the music, and the connection between Harlem and the Caribbean.",
               "students": ["Escuchen."]},
    "body": [f"*\"Antes de hablar del Renacimiento de Harlem, quiero que escuchen esto.\"* [Play 30 seconds of Afro-Cuban jazz or salsa.] *\"{S_HOOK_Q} Esta música tiene raíces cubanas — y comparte raíces africanas con el jazz de Harlem. Los músicos afrocubanos y los músicos afroamericanos de Harlem estaban creando algo nuevo al mismo tiempo, inspirados por las mismas tradiciones africanas. Hoy vamos a explorar estas conexiones.\"*"]}),
  ("section", {"label": "Direct instruction · 10 minutes", "title": "Vocabulario clave",
    "screen": {"phase": "Vocabulario", "show": "chart", "caption": "Vocabulario principal",
               "columns": ["Spanish", "English", "Example sentence"], "rows": [{"cells": r} for r in S_VOCAB],
               "purpose": "Practice the core vocabulary in the context of the Harlem Renaissance.",
               "students": ["Say each word.", "Use it in a sentence about the Harlem Renaissance."]},
    "body": ["Introduce and practice the core vocabulary set with visual and contextual support. Use the images on handouts: *la silueta, el renacimiento, la dignidad, la migración, el jazz, la pintura, el poeta / la poeta, la identidad, la libertad, la resistencia, la herencia.* For each word: model pronunciation, ask students to use it in a sentence, then use it in the context of the Harlem Renaissance."]}),
  ("section", {"label": "Activity · 25 minutes",
    "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
               "purpose": "Use the vocabulary in reading, writing and discussion at the right level of challenge.",
               "students": CHOOSE}}),
  ("levels", {
    "green": "Vocabulary matching and fill-in with word bank (all words with English glosses provided). Describe Aaron Douglas's *Song of the Towers* in 3 Spanish sentences using the vocabulary. Answer 3 comprehension questions in Spanish.",
    "yellow": "Vocabulary in context (sentences and short paragraph). Write a 5-sentence description of the Harlem Renaissance in Spanish. Respond in Spanish to: *¿Por qué era importante el Renacimiento de Harlem?* Connect to a Spanish-speaking cultural figure or movement.",
    "red": "Read a short paragraph in Spanish about Nicolás Guillén (Cuban Negrismo poet). Analyze: what connections can you find between Guillén's poetry and the Harlem Renaissance? Write a comparative paragraph in Spanish. Discussion question: *¿Puede el arte cambiar la sociedad?*"}),
  ("section", {"label": "Closing · 5 minutes",
    "screen": {"phase": "Closing", "show": "words", "title": "Closing", "text": S_CLOSE,
               "purpose": "Set the Harlem Renaissance within the African diaspora across the Americas.",
               "students": ["¿Puede el arte cambiar la sociedad?"]},
    "body": [f"*\"El Renacimiento de Harlem no fue sólo un movimiento americano — fue parte de un despertar cultural global de la diáspora africana. En Cuba, en Puerto Rico, en Brasil — artistas y poetas estaban haciendo lo mismo: afirmando la belleza y la dignidad de la cultura africana. {S_CLOSE}\"*"]}),
  conn_lp(),
  ("section", {"label": "Vocabulario principal — teacher reference"}),
  ("table", {"head": ["Spanish", "English", "Example sentence"], "rows": S_VOCAB}),
  ("section", {"label": "Caribbean connection — teacher notes", "body": [
    "**Negrismo (Cuba/Puerto Rico, 1920s–30s):** A literary movement parallel to the Harlem Renaissance, led by poets like Nicolás Guillén (Cuba) and Luis Palés Matos (Puerto Rico). Both movements celebrated African heritage, used African-influenced rhythms in poetry, and asserted the dignity of Afro-Caribbean identity. Guillén and Langston Hughes knew each other and corresponded — the movements were genuinely interconnected.",
    "**Afro-Cuban music:** Rooted in the same African traditions as jazz (call-and-response, polyrhythm, improvisation), Afro-Cuban music developed simultaneously with Harlem jazz. By the 1940s, musicians like Dizzy Gillespie were fusing both traditions into what became known as Afro-Cuban jazz or Cubop."]}),
  ("section", {"label": "Cross-curricular connections", "list": [
    "**Social Studies:** The African diaspora connects the Harlem Renaissance to Caribbean, Central American, and South American cultural movements — a global context for what students might think of as a \"local\" American story",
    "**Music:** The jazz/salsa/cumbia connection can be traced musically — same African rhythmic roots, different cultural expressions",
    "**Religion:** *La dignidad humana* is a key term in Catholic Social Teaching in Spanish — the vocabulary connects directly to CST Principle 1"]}),
], css="table.fill { font-size: 8.8pt; } table.fill td { padding: 2.5pt 6pt 2.5pt 0; } table.fill td:first-child { width: 22%; } table.fill td:nth-child(2) { width: 24%; }")
SPA_LP["slug"] = "el-renacimiento-de-harlem"

def blanks(items):
    return ("html", '<div class="blanks">' + "".join(f"<p>{il(t)}</p>" for t in items) + "</div>")

SPA_G = handout("Spanish", "Spanish", S_T, "green", S_HERO, [
  TICKET_ES,
  ctx(["**Vocabulario:** el renacimiento (renaissance/rebirth) | la silueta (silhouette) | la dignidad (dignity) | la migración (migration) | el jazz (jazz) | la pintura (painting) | el poeta / la poeta (poet) | la identidad (identity) | la libertad (freedom) | la herencia (heritage)"]),
  ("task", {"label": "Actividad 1", "title": "Emparejar — Match the words", "blocks": [
      ("html", '<div class="match"><div>' + "".join(f"<p>____ {i}. {w}</p>" for i, w in enumerate(
          ["el renacimiento", "la silueta", "la dignidad", "la migración", "la herencia"], 1)) + "</div><div>"
          + "".join(f"<p>{t}</p>" for t in ["A. moving from one place to another", "B. the worth and respect every person deserves",
                                            "C. a shadow-like image of a figure", "D. a cultural tradition passed down through generations",
                                            "E. a rebirth or flowering of culture and ideas"]) + "</div></div>")]}),
  ("task", {"label": "Actividad 2", "title": "Completa las frases — Fill in the blanks", "blocks": [
      P("Usa las palabras del vocabulario para completar las frases:"),
      blanks(["1. El Renacimiento de Harlem fue un __________________ cultural en los años 1920.",
              "2. Aaron Douglas pintaba __________________ de figuras sin rasgos individuales.",
              "3. Los artistas afirmaban la __________________ de la vida afroamericana.",
              "4. La Gran __________________ llevó millones de personas al norte.",
              "5. El jazz celebraba la __________________ africana."])]}),
  ("task", {"label": "Actividad 3", "title": "Describe la pintura", "blocks": [
      P("*Aaron Douglas — Song of the Towers (Canción de las Torres), 1934*", "cap")] + q(
      "Escribe 3 frases en español describiendo esta pintura. Usa el vocabulario:", 5)}),
  ("task", {"label": "Actividad 4", "title": "Preguntas de comprensión", "blocks": [
      P("Contesta en español (respuestas cortas están bien):")] + q(
      "**1. ¿Dónde ocurrió el Renacimiento de Harlem?**", 1) + q(
      "**2. ¿Quién fue Aaron Douglas?**", 2) + q(
      "**3. ¿Por qué era importante este movimiento cultural?**", 2)}),
  ("task", {"label": "Actividad 5", "title": "Tu turno", "blocks": [
      P("Completa esta oración en español:"),
      blanks(["Para mí, la dignidad significa _______________________________________________________________.",
              "Una persona que admiro porque afirma la dignidad de otros es ______________________________ porque",
              "______________________________________________________________________________________."])]}),
  ("connection", ["En la exhibición: busca una obra de arte o poema. Escribe dos palabras de vocabulario que describan lo que ves."]),
  note("¡Comparte con tu familia!", ["Enseña a alguien en tu casa tres palabras de vocabulario en español sobre el Renacimiento de Harlem."]),
], css=S_CSS + ".blanks p { margin: 0 0 11pt; } .blanks { margin: 4pt 0 4pt; }")

SPA_Y = handout("Spanish", "Spanish", S_T, "yellow", S_HERO, [
  TICKET_ES,
  ctx(["**Contexto:** El Renacimiento de Harlem (c. 1920–1935) fue un movimiento cultural extraordinario en Nueva York. Artistas, poetas y músicos afroamericanos crearon obras que afirmaban la belleza, la dignidad y la herencia de la cultura negra. Al mismo tiempo, en Cuba y Puerto Rico, poetas como Nicolás Guillén estaban haciendo algo muy similar: celebrando la herencia africana en el mundo hispanohablante."]),
  ("task", {"label": "Actividad 1", "title": "Vocabulario en contexto", "blocks": [
      P("Completa las frases con la forma correcta de la palabra:"),
      ("html", '<div class="bank">' + "".join(f"<span>{w}</span>" for w in ["la resistencia", "el orgullo", "afirmar", "la herencia", "la identidad", "migrar"]) + "</div>"),
      blanks(["1. Para los artistas de Harlem, crear arte era una forma de __________________ cultural.",
              "2. Langston Hughes exploraba __________________ afroamericana en su poesía.",
              "3. Millones de personas decidieron __________________ al norte durante la Gran Migración.",
              "4. El jazz celebraba __________________ africana que había sobrevivido la esclavitud.",
              "5. Había un nuevo __________________ en ser negro y ser americano al mismo tiempo."])]}),
  ("task", {"label": "Actividad 2", "title": "Descripción — 5 frases: el Renacimiento de Harlem en tus palabras", "blocks": q(
      "Escribe 5 frases en español describiendo el Renacimiento de Harlem. Incluye: ¿qué fue?, ¿cuándo ocurrió?, ¿quiénes participaron?, ¿por qué fue importante?", 5)}),
  ("task", {"label": "Actividad 3", "title": "Pregunta de discusión", "blocks": q(
      "Contesta en español (mínimo 4 frases): **¿Por qué era importante el Renacimiento de Harlem — no sólo para los afroamericanos, sino para toda la sociedad?**", 6)}),
  ("task", {"label": "Actividad 4", "title": "La conexión caribeña", "blocks": [
      P("El poeta cubano Nicolás Guillén (1902–1989) era contemporáneo de Langston Hughes. Los dos poetas se admiraban mutuamente. Guillén escribía sobre la herencia africana en Cuba; Hughes escribía sobre la herencia africana en América. Ambos usaban el ritmo musical en su poesía.")] + q(
      "**¿Qué tienen en común los dos movimientos (el Renacimiento de Harlem y el Negrismo cubano)? Escribe 3 semejanzas:**", 0) + [
      ("html", '<div class="blanks n">' + "".join(f'<p>{i}. </p>' for i in (1, 2, 3)) + "</div>")]}),
  ("task", {"label": "Actividad 5", "title": "Tu opinión", "blocks": q(
      "**¿Puede el arte cambiar la sociedad?** Responde en 2–3 frases en español con un ejemplo específico:", 4)}),
  ("connection", ["Elige una obra en la exhibición y escribe una descripción de 3 frases en español. Usa por lo menos 4 palabras del vocabulario de hoy."]),
], css=S_CSS + ".blanks p { margin: 0 0 8pt; } .blanks.n { margin-bottom: 8pt; } .blanks.n p { border-bottom: .8pt solid #a9a69b; height: 27pt; margin: 0; padding-top: 12pt; }")

SPA_R = handout("Spanish", "Spanish", S_T, "red", S_HERO, [
  TICKET_ES,
  ctx(["**Texto:** Lee el siguiente párrafo sobre Nicolás Guillén y el Negrismo:",
       "Nicolás Guillén (1902–1989) fue el poeta más importante de Cuba del siglo XX. En los años 1920 y 1930, Guillén desarrolló un estilo poético llamado Negrismo — una celebración de la herencia africana en la cultura cubana. Sus poemas incorporaban ritmos afrocubanos, vocabulario de origen africano, y temas de justicia social. Guillén conocía a Langston Hughes y los dos se admiraban profundamente. Mientras Hughes afirmaba \"I, too, am America,\" Guillén afirmaba la presencia africana en la identidad cubana. Los dos movimientos — el Renacimiento de Harlem y el Negrismo — nacieron del mismo impulso: el rechazo de la invisibilidad y la afirmación de la dignidad humana a través del arte."]),
  ("task", {"label": "Actividad 1", "title": "Análisis del texto", "blocks": q(
      "**1. Según el texto, ¿cuáles son las tres características principales de la poesía de Guillén?**", 5) + q(
      "**2. El texto dice que los dos movimientos \"nacieron del mismo impulso.\" ¿Qué impulso es ese?**", 4)}),
  ("task", {"label": "Actividad 2", "title": "Párrafo comparativo: Harlem y La Habana", "blocks": q(
      "Escribe un párrafo comparativo en español (6–8 frases) sobre las similitudes y diferencias entre el Renacimiento de Harlem y el Negrismo cubano. Usa: *mientras que, al mismo tiempo, por otro lado, ambos, sin embargo, en cambio.*", 6)}),
  ("task", {"label": "Actividad 3", "title": "Ensayo crítico", "blocks": q(
      "Responde a esta pregunta en español en 5–6 frases: **¿Puede el arte cambiar la sociedad, o sólo puede reflejarla?** Usa ejemplos del Renacimiento de Harlem y del Negrismo para apoyar tu argumento.", 5)}),
  ("task", {"label": "Actividad 4", "title": "Extensión creativa", "blocks": q(
      "Escribe un poema corto en español (6–8 líneas) sobre uno de estos temas: la identidad, la herencia, la libertad, la migración. Intenta usar el ritmo de manera deliberada — como lo hacía Guillén.", 6)}),
  ("cols", [[("connection", ["Mientras exploras la exhibición: elige una pieza de jazz de la sección de audio. ¿Cómo describirías el ritmo en español? ¿Puedes escuchar las raíces africanas? ¿Qué conexión encuentras con la música afrocubana que conoces?"])],
            [note("Investigación", ["Busca \"Nicolás Guillén Motivos de Son\" — uno de sus poemas más famosos. Lee el poema e identifica: ¿cuántas palabras del vocabulario de hoy puedes encontrar? ¿Qué ritmo musical sientes en el poema?"])]]),
], css=S_CSS + ".cols .family { margin-top: 0; } .cols { grid-template-columns: 1.2fr 1fr; } .task { margin-bottom: 3pt; }")

# ════════════════════════════════════════════════════════════════════
# THEATER · Voice, Body, Story
# ════════════════════════════════════════════════════════════════════
T_T = "Voice, Body, Story"
T_HERO = {"img": MIG + "harlem.jpg", "pos": "center 75%"}

T_BIG = "Stand up. Take up as much space as possible — arms wide, feet apart, chin up. Hold it for 10 seconds."
T_SMALL = "Now make yourself as small as possible — shoulders in, head down. Hold it."
T_NOTICE = "Now stand normally and notice:"
T_Q = "which posture felt more like you? Which felt like a choice?"
# the oral performance tradition: (form, who and what)
T_TRADITION = [("blues shouters", "(Bessie Smith, Ma Rainey) who used the voice as an instrument of testimony"),
               ("preacher rhetoric", "(Adam Clayton Powell Sr. at Abyssinian Baptist Church) using call-and-response with congregations; street-corner oratory (Marcus Garvey)"),
               ("spoken word and poetry readings", "in Harlem salons and speakeasies"),
               ("theatrical performance", "at venues like the Lafayette Theater")]
T_STEP_IN = "Today you're going to step into one of those stories."

THE_LP = lesson("Theater", "Theater", T_T, T_HERO, [
  chips("Grades 5–8", "45 minutes", "Theater arts"),
  ("section", {"label": "Learning objective", "title": "What students will understand",
    "body": ["Students will explore storytelling, voice, and embodied performance through the lens of the Harlem Renaissance oral tradition — the spoken word, the blues shout, the preacher's cadence. They will develop and perform a short monologue, scene, or spoken word piece rooted in a Harlem Renaissance character or theme, and reflect on how performance creates empathy and historical understanding that written text alone cannot."]}),
  ("section", {"label": "Standards alignment", "list": [
    "**National Arts TH:Cr1.1.5–8** — Identify physical, vocal, and emotional choices that heighten the impact of drama and theatre work",
    "**National Arts TH:Pr4.1.5–8** — Identify, analyze, and apply cultural and historical information to support a character interpretation",
    "**National Arts TH:Re9.1.5–8** — Examine how the context of a drama communicates the perspectives of a community or culture"]}),
  ("section", {"label": "Materials needed", "list": [
    "Character cards — one per student or pair (on handouts)",
    "Optional: audio of a Harlem Renaissance monologue or spoken word for model — recordings of Paul Robeson, Langston Hughes reading his own work, or a scene from a Zora Neale Hurston play",
    "Open space for performance — desks cleared if possible; alternatively, students remain seated for in-class reading performances"]}),
  ("section", {"label": "Hook · 5 minutes", "title": "The body remembers",
    "screen": {"phase": "Hook", "show": "question", "question": T_Q[0].upper() + T_Q[1:],
               "purpose": "Feel, in the body, what it means to choose to take up space.",
               "students": [T_BIG, T_SMALL, T_NOTICE.rstrip(":") + "."]},
    "body": [f"*\"Before we talk about the Harlem Renaissance, I want you to do something. {T_BIG} {T_SMALL} {T_NOTICE} {T_Q} The performers of the Harlem Renaissance made a choice to take up space — physically, artistically, politically. Today we're going to explore what that means through performance.\"*"]}),
  ("section", {"label": "Direct instruction · 10 minutes", "title": "The oral tradition",
    "screen": [
      {"phase": "Teach", "minutes": 5, "script": [0], "show": "chart", "caption": "The Harlem Renaissance oral performance tradition",
       "columns": ["Form", "Who and where"], "rows": [{"cells": [f[0].upper() + f[1:], w]} for f, w in T_TRADITION],
       "purpose": "Meet the voices of the oral tradition: testimony, call-and-response, the spoken word, the stage.",
       "students": ["Which of these have you heard?"]},
      {"phase": "Teach", "minutes": 5, "script": [1], "title": "Step into a story", "show": "words",
       "text": "How a community tells its stories is as important as the stories themselves.", "cite": "What Zora Neale Hurston believed",
       "purpose": "Move from the tradition to the students’ own performance.",
       "students": [T_STEP_IN]}],
    "body": ["The Harlem Renaissance had a rich oral performance tradition: " + "; ".join(f"**{f}** {w}" for f, w in T_TRADITION) + ".",
             f"*\"Zora Neale Hurston — folklorist, novelist, playwright — spent years collecting the stories, the sermons, the songs. She believed that how a community tells its stories is as important as the stories themselves. {T_STEP_IN}\"*"]}),
  ("section", {"label": "Activity: character work and performance · 25 minutes",
    "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
               "purpose": "Write and perform a Harlem Renaissance voice at the right level of challenge.",
               "students": CHOOSE}}),
  ("levels", {
    "green": "Receive a character card with background, situation, and sentence starters. Develop a 5–8 sentence first-person monologue. Practice with a partner, then share with the class (can be seated). Focus: speaking in first person and making one physical choice (gesture, posture).",
    "yellow": "Choose a character from the provided list or create your own within the historical context. Write and perform a 60–90 second monologue. Must include one moment of silence (held pause) and one moment of vocal variety (volume, pace, or pitch change). Written reflection required.",
    "red": "Write and perform a 90–120 second monologue, scene for two voices, or spoken word piece. Must demonstrate: status awareness (how does your character hold power or lack of it?), subtext (what is the character not saying?), and one specific historical detail woven into the performance. Written dramaturgical note required."}),
  conn_lp(),
  ("section", {"label": "Character suggestions", "body": [
    "**Historical figures (simplified for drama purposes):** Langston Hughes (poet, Harlem café, 1926); Bessie Smith (blues singer, backstage before a show); Aaron Douglas (painter, describing what he's working on); Zora Neale Hurston (folklorist, just returned from collecting stories in the South); Duke Ellington (musician, first night at the Cotton Club, 1927)",
    "**Fictional voices:** A teenager who just arrived in Harlem from Georgia on the train; a woman hearing jazz for the first time at the Savoy; a letter-writer drafting a letter home from Harlem; a Southern newspaper editor watching his workforce leave northward; a school teacher in Harlem in 1925 on the first day of term"]}),
  ("section", {"label": "Vocal technique notes", "list": [
    "**Pacing:** Slowing down = gravity, seriousness, emotional weight; speeding up = urgency, excitement, fear",
    "**Volume:** A whisper can be more powerful than a shout — it forces the audience to lean in",
    "**Pause:** The held pause is the most underused tool in student performance — silence after a significant line lets it land",
    "**Call-and-response:** The Harlem oral tradition is built on audience engagement — performers can look directly at the audience, ask rhetorical questions, pause for imagined response"]}),
  ("section", {"label": "Reflection questions", "list": [
    "What did you discover about your character that you didn't know before you performed them?",
    "How did your body affect your understanding of the historical context?",
    "What can performance communicate that written history cannot?"]}),
  ("section", {"label": "Cross-curricular connections", "list": [
    "**ELA:** Monologue writing is first-person narrative with compressed dramatic arc — same craft skills as memoir and personal essay",
    "**Social Studies:** Stepping into a historical character builds perspective-taking — essential for historical empathy and analysis",
    "**Religion:** The preacher's prophetic voice (Amos, Isaiah) is a direct connection between the Harlem oral tradition and the biblical prophetic tradition",
    "**Music:** The blues shout, the jazz vocal style, and theatrical performance share rhythmic and tonal vocabulary"]}),
])

THE_LP["slug"] = "voice-body-story"
# printed without a timing bar (its chips say 45 minutes); on screen, the
# timed sections' own minutes
THE_LP["screen_timing"] = [("Hook", 5, "#7D8471"), ("Teach", 10, "#2F4A5A"), ("Activity", 25, "#7A4B9A")]

THE_G = handout("Theater", "Theater", T_T, "green", T_HERO, [
  ("task", {"label": "Your monologue", "title": "Write your first-person speech", "blocks": [
      P("Use the sentence starters to help you write a 5–8 sentence monologue. You will speak as this character."),
      ("html", '<div class="starters">' + "".join(f"<p>{il(s)}</p>" for s in [
          "\"My name is ______________________________, and I just arrived in Harlem.\"",
          "\"Back home in Georgia, everything was ______________________________________________.\"",
          "\"When I stepped off the train, the first thing I noticed was ______________________________.\"",
          "\"I heard music — it sounded like ________________________________________________.\"",
          "\"My mother said ______________________________________________________________.\"",
          "\"What scares me is ____________________________________________________________.\"",
          "\"But what I'm hoping for is _____________________________________________________.\""]) + "</div>"),
      ("html", '<p class="label" style="margin-top:8pt">Add your own lines</p>'), ("lines", 6)]}),
  ("pagebreak", None),
  ("task", {"label": "Practice your performance", "title": "Two things to try", "blocks": [
      ("cards", [("Stand up straight", ["When you perform, your character is arriving somewhere new and hoping for something. Try standing tall — even if the character is nervous. What does that feel like?"]),
                 ("Make one gesture", ["At the most important moment in your monologue — pick one gesture: point somewhere, hold your arms wide, or press your hands together. Practice it until it feels natural."])])]}),
  ("task", {"label": "Reflection", "title": "", "blocks": q(
      "**1. What was the hardest part of writing or performing this monologue?**", 4) + q(
      "**2. What did you learn about what it felt like to arrive in Harlem that you couldn't learn just from reading about it?**", 4) + q(
      "**3. What does your character hope for? Is that the same as what real people who came to Harlem hoped for?**", 4)}),
  ("connection", ["The exhibition includes the sound of jazz playing in Harlem in the 1920s. Imagine you're your character — hearing that sound for the first time after arriving on the train. What do you feel?"]),
  ("family", ["Perform your monologue for someone at home. After, ask them: *\"Does this story remind you of anything in our family's history?\"*"]),
], ["**Your character:** You are a 14-year-old who has just arrived in Harlem, New York, after a long train ride from Georgia with your family. It is 1925. You have never seen a city this big. You can hear jazz music coming from somewhere down the street. You wrote a letter home last night."],
  css=".starters p { margin: 0 0 13pt; font-size: 10.4pt; } .starters { margin-top: 8pt; } .pb { break-after: page; }")

THE_Y = handout("Theater", "Theater", T_T, "yellow", T_HERO, [
  ("task", {"label": "Step 1", "title": "Choose your character: who are you?", "blocks": [
      P("Choose one character from the list or create your own within the historical context (1910–1935, Harlem or the journey north):"),
      ("html", '<div class="bank">' + "".join(f"<span>{w}</span>" for w in [
          "Langston Hughes, poet", "Bessie Smith, blues singer", "Aaron Douglas, painter", "Zora Neale Hurston, writer",
          "A teenager arriving from Georgia", "A letter-writer in Harlem", "A teacher on the first day of term", "My own character"]) + "</div>"),
      fields([("My character:", 3), ("Year:", 1)])] + q(
      "**What does my character want in this moment?**", 3) + q(
      "**What is my character afraid of?**", 3)}),
  ("pagebreak", None),
  ("task", {"label": "Step 2", "title": "Write your monologue (60–90 seconds)", "blocks": [
      ("html", "<p>Write your monologue below. Plan for one <b>held pause</b> (mark it *PAUSE*) and one moment of <b>vocal variety</b> — louder, quieter, faster, or slower (mark it *SLOW* or *LOUD* etc.).</p>"),
      ("lines", 11)]}),
  ("task", {"label": "Step 3", "title": "Performance reflection", "blocks": q(
      "**1. Where did you place your pause — and why? What does the silence do at that moment?**", 2) + q(
      "**2. When you performed, what did your body do that surprised you?**", 2) + q(
      "**3. Zora Neale Hurston spent years collecting Black folk stories so they would not be lost. What does your monologue add to the historical record that a textbook could not?**", 3)}),
  ("cols", [[("connection", ["The **Harlem in Words** section of the exhibition uses vocabulary from real Harlem Renaissance writing. Choose 3 words from the exhibit and work them into a revised version of your monologue. Does adding authentic language from the period change how it feels to perform?"])],
            [note("Extension", ["Find a recording of Langston Hughes reading \"The Negro Speaks of Rivers\" aloud. Listen for his pace, his pauses, his emphasis. What can you learn from how he performs his own poem?"])]]),
], ["**Context:** The Harlem Renaissance had a rich oral performance tradition. Zora Neale Hurston spent years collecting its folktales, sermons and songs. Blues singers, preachers, poets, and storytellers all used voice and body to claim space, express truth, and build community. Today you will step into that tradition."])

THE_R = handout("Theater", "Theater", T_T, "red", T_HERO, [
  ("task", {"label": "Step 1", "title": "Character development: build your character with historical precision", "blocks": [
      P("Choose a character: historical figure, fictional voice, or a scene for two voices:"),
      fields([("Character name and role:", 1)])] + q(
      "**Specific historical moment** (year, location, what is happening in the world that week):", 2) + q(
      "**Status:** What power does this character have — and what power are they denied? How does that show in their body?", 2) + q(
      "**Subtext:** What does this character want to say but cannot — or will not? Why?", 2)}),
  ("task", {"label": "Step 2", "title": "Write your performance (90–120 seconds)", "blocks": [
      P("Mark in the script: one moment of **STATUS** shift (character gains or loses power), one moment of **SUBTEXT** (what is said vs what is meant), and one **SPECIFIC HISTORICAL DETAIL** woven naturally into the speech."),
      ("html", '<div class="write" style="break-inside:auto">' + "<i></i>" * 3 + "</div>"),
      ("html", '<p class="label" style="margin-top:8pt">More performance space</p>'), ("lines", 7)]}),
  ("task", {"label": "Step 3", "title": "Dramaturgical note", "blocks": q(
      "A dramaturgical note explains the research and choices behind a performance. Write yours (5–7 sentences): what historical sources did you draw on? What choices did you make about status, subtext, and voice — and why? What does your performance argue about this character or this moment in history?", 4)}),
  ("task", {"label": "Critical reflection", "title": "", "blocks": q(
      "Anna Deavere Smith performs real people in their own words. **What did you discover about the Harlem Renaissance — or about yourself — through performing this character that you could not have found through reading? What are the limits of this kind of historical performance? What risks does it carry?**", 4)}),
  ("cols", [[aside("Mini Museum deep dive", ["The **Harlem in Words** section includes actual language from Harlem Renaissance texts. Use three words or phrases from the exhibition in your performance — not as quotation, but woven naturally into your character's speech. After performing, reflect: how did using authentic language change the quality of the performance?"])],
            [note("Research extension", ["Find and read one scene from a Zora Neale Hurston play (*Color Struck*, 1926, is freely available online). Analyze: how does Hurston use dialect, rhythm, and silence? How do those choices serve her characters?"])]]),
], ["**Dramaturgical frame:** The actor and playwright Anna Deavere Smith, builds her plays from interviews and testimony. When you step into a historical character with full commitment — their fears, their hopes, their specific historical context — you gain a form of knowledge that reading alone cannot provide. This is the unique power of theater."], css=".tfields span { padding-bottom: 10pt; }")

# ════════════════════════════════════════════════════════════════════
# MUSIC · The Sound of Harlem
# ════════════════════════════════════════════════════════════════════
M_T = "The Sound of Harlem"
M_HERO = {"img": MIG + "chicago.jpg", "pos": "center 40%"}

M_TASK = "In the next 30 seconds, write down three things that make the jazz sound different from the classical piece. Be specific — not just 'it's more fun.'"
M_CALL = "one voice calls, another answers."
M_SYNC = "Emphasis on the off-beat — the \"and\" between the beats rather than the beat itself."
M_FREEDOM = "The structure gave him the rules; improvisation gave him the freedom."
# the 12-bar blues in C, as the Green handout sets it out: (chord, numeral)
BARS = [("C", "I"), ("C", "I"), ("C", "I"), ("C", "I"), ("F", "IV"), ("F", "IV"), ("C", "I"), ("C", "I"),
        ("G", "V"), ("F", "IV"), ("C", "I"), ("G", "V")]

MUS_LP = lesson("Music", "Music", M_T, M_HERO, [
  chips("Grades 5–8", "45 minutes", "Music"),
  ("section", {"label": "Learning objective", "title": "What students will understand",
    "body": ["Students will analyze the musical structures of Harlem Renaissance jazz and blues — call-and-response, the 12-bar blues form, improvisation, syncopation, and the role of the rhythm section. They will connect these structures to their African musical roots and understand how jazz was simultaneously a new American art form and a continuation of African musical traditions. Students will respond through structured listening, notation analysis, or original composition."]}),
  ("section", {"label": "Standards alignment", "list": [
    "**National Arts MU:Re7.1.5–8** — Demonstrate and explain how responses to music are informed by the structure, the use of the elements of music, and context",
    "**National Arts MU:Re8.1.5–8** — Support an interpretive claim about the expressive intent of a musical selection with evidence from the elements of music",
    "**National Arts MU:Cn11.0.5–8** — Demonstrate understanding of relationships between music and the other arts, other disciplines, varied contexts, and daily life"]}),
  ("section", {"label": "Materials needed", "list": [
    "Audio clips — ideally one each of: 12-bar blues (Bessie Smith), jazz improvisation (Louis Armstrong), big band (Duke Ellington), and stride piano (Fats Waller). All available free via Smithsonian Folkways or YouTube",
    "Optional: piano or keyboard for demonstrating the 12-bar blues chord progression live",
    "Differentiated handouts — one per student; pencils for notation work"]}),
  ("section", {"label": "Hook · 5 minutes", "title": "What makes jazz sound like jazz?",
    "screen": {"phase": "Hook", "show": "question", "title": "Listen and compare", "question": "What makes jazz sound like jazz?",
               "purpose": "Hear the difference first; name it after.",
               "students": [M_TASK]},
    "body": ["Play 30 seconds of straight classical music, then 30 seconds of Louis Armstrong. No introduction.",
             f"*\"Same instruments — woodwinds, brass, strings in the classical piece, brass in the jazz. But they sound completely different. {M_TASK}\"*",
             "Take responses. Students will typically identify: rhythm (swung/syncopated vs straight), improvisation, call-and-response, the feel of the beat, expression. Affirm and build on these."]}),
  ("section", {"label": "Direct instruction · 12 minutes", "title": "Jazz structure",
    "screen": [
      {"phase": "Teach", "minutes": 3, "script": [0, 1], "title": "Call-and-response", "show": "words",
       "text": M_CALL[0].upper() + M_CALL[1:],
       "purpose": "Hear call-and-response, and where it comes from.",
       "students": ["Listen: which instrument calls? Which responds?"]},
      {"phase": "Teach", "minutes": 2, "script": [2], "title": "Syncopation", "show": "words", "text": M_SYNC,
       "purpose": "Feel the off-beat in the body before naming it.",
       "students": ["Clap a regular beat.", "Now clap the syncopated version."]},
      {"phase": "Teach", "minutes": 3, "script": [3], "title": "12-bar blues form", "show": "chart",
       "caption": "12-bar blues pattern (key of C)", "columns": ["", "1", "2", "3", "4"],
       "rows": [{"cells": [f"Bars {r * 4 + 1}–{r * 4 + 4}"] + [f"{c} ({n})" for c, n in BARS[r * 4:r * 4 + 4]]} for r in range(3)],
       "purpose": "See the framework that gives musicians something to improvise within.",
       "students": ["The same 12 bars repeat. What does that let musicians do?"]},
      {"phase": "Teach", "minutes": 4, "script": [4, 5], "title": "Structure and freedom", "show": "words", "text": M_FREEDOM,
       "purpose": "Put the pieces together: the defining idea of jazz.",
       "students": ["Where do you hear the structure? Where do you hear the freedom?"]}],
    "body": ["Build the structural vocabulary in layers:",
             f"**Call-and-response:** Rooted in West African music and work songs — {M_CALL} In jazz, the trumpet \"calls,\" the rhythm section \"responds.\" Play an example, ask students to identify it.",
             f"**Syncopation:** {M_SYNC} The defining rhythmic feel of jazz and blues. Clap a regular beat, then clap the syncopated version.",
             "**12-bar blues form:** The harmonic foundation of most early jazz. Play or demonstrate the I–IV–I–V–I progression. Point out: the same 12 bars repeating gives musicians a framework to improvise within.",
             "**Improvisation:** Creating melody spontaneously within the harmonic structure. Not random — constrained by key, chord changes, and musical conversation with other players.",
             f"*\"Louis Armstrong wasn't just playing notes — he was having a conversation with the other musicians in real time. {M_FREEDOM} That combination — structure and freedom — is the defining idea of jazz.\"*"]}),
  ("section", {"label": "Activity: structured listening and response · 22 minutes",
    "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
               "purpose": "Listen, analyze or compose at the right level of challenge.",
               "students": CHOOSE}}),
  ("levels", {
    "green": "Guided listening response to one jazz recording — identify instruments, describe mood, mark where they hear call-and-response, and answer five structured questions. No notation required.",
    "yellow": "Listen to two contrasting recordings (blues and big band jazz). Complete a comparison framework covering structure, instrumentation, improvisation, and emotional effect. Write a paragraph connecting jazz structure to African musical roots.",
    "red": "Full structural analysis of one jazz recording: identify 12-bar form, mark syncopation, annotate call-and-response, and evaluate the improvisation. Composition task: write an original 4-bar melodic phrase over a provided blues chord progression, with written rationale for note choices."}),
  conn_lp(),
  ("section", {"label": "Key recordings — teacher reference", "list": [
    "**Blues:** Bessie Smith — \"Downhearted Blues\" (1923); Ma Rainey — \"See See Rider Blues\" (1924) — 12-bar form very clear",
    "**Jazz improvisation:** Louis Armstrong and His Hot Five — \"Heebie Jeebies\" (1926); \"West End Blues\" (1928) — Armstrong's trumpet improvisation is definitive",
    "**Big band:** Duke Ellington — \"Take the A Train\" (1941); \"It Don't Mean a Thing (If It Ain't Got That Swing)\" (1932) — the title is a lesson in itself",
    "**Stride piano:** Fats Waller — \"Ain't Misbehavin'\" (1929) — demonstrates the stride piano style: left hand alternates bass note and chord, right hand improvises melody"],
    "body": []}),
  P("Recordings made before 1926 are now in the US public domain. All of these can be heard free on YouTube, Smithsonian Folkways, or the Internet Archive."),
  ("section", {"label": "African roots — teaching notes", "body": ["Jazz did not appear from nowhere. Its structural DNA is deeply African:"], "list": [
    "**Call-and-response:** Central to West African vocal and instrumental music, and to the work songs and spirituals of enslaved people in America",
    "**Polyrhythm:** Multiple simultaneous rhythmic patterns — the drum kit in jazz is essentially a polyrhythmic instrument",
    "**Improvisation:** The griot tradition in West African music involves improvised storytelling in song — direct ancestor of blues vocal improvisation",
    "**Blue notes:** The flattened 3rd, 5th, and 7th scale degrees that give blues its distinctive sound — not part of the European harmonic system; rooted in African tonal traditions"]}),
  ("cols", [
    [("section", {"label": "Cross-curricular connections", "list": [
      "**Science:** Physics of sound — frequency, resonance, the phonograph; how the electric microphone (1925) changed what could be recorded",
      "**Social Studies:** The Great Migration explains why so many musicians ended up in Harlem simultaneously — critical mass of talent created jazz as a distinct genre",
      "**ELA:** Langston Hughes wrote about jazz as the sound of the people; his poetry is directly influenced by blues and jazz rhythm and structure",
      "**Art:** Aaron Douglas's *Song of the Towers* is a visual representation of jazz — the concentric circles are often read as sound waves"]})],
    [("section", {"label": "Assessment ideas", "list": [
      "**Listening journal:** Students listen to three recordings at home and write one paragraph each describing structure, mood, and one musical choice they found interesting",
      "**Composition:** Compose and perform a 4-bar melody over the 12-bar blues progression — can be done with voice, any instrument, or body percussion",
      "**Critical essay:** \"Jazz is both African and American — explain how its structure reflects both traditions\""]})]]),
], css="body { font-size: 8.8pt; line-height: 1.37; } .chips { margin-bottom: 8pt; } li { margin-bottom: 1pt; } .cols { grid-template-columns: 1.15fr 1fr; gap: 14pt; } .conn { margin-bottom: 6pt; }")
MUS_LP["slug"] = "the-sound-of-harlem"
# printed without a timing bar (its chips say 45 minutes); on screen, the
# timed sections' own minutes
MUS_LP["screen_timing"] = [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 22, "#7A4B9A")]

MUS_G = handout("Music", "Music", M_T, "green", M_HERO, [
  ("task", {"label": "Part 1", "title": "Listening response: listen to one jazz recording", "blocks": [
      P("Your teacher will play a recording. As you listen, fill in this response:"),
      fields([("Title / Artist:", 1)])] + q(
      "**1. List at least three instruments you can hear:**", 2) + [
      P("**2. Circle the words that describe the mood of this music:**", "q"),
      ("html", '<div class="bank">' + "".join(f"<span>{w}</span>" for w in
          ["Joyful", "Sad", "Energetic", "Peaceful", "Powerful", "Playful", "Serious", "Mysterious"]) + "</div>")] + q(
      "**3. Does the music feel like it's talking to you — or like it's having a conversation with itself? Explain:**", 2)}),
  ("task", {"label": "Part 2", "title": "Call-and-response", "blocks": [
      P("Call-and-response is when one musical voice \"calls\" and another \"answers.\" It comes from African music and American work songs.")] + q(
      "**4. Can you hear call-and-response in the recording? Which instruments are \"calling\" and \"answering\"?**", 2) + q(
      "**5. Name one other place in your life where you hear call-and-response:**", 2)}),
  ("task", {"label": "Part 3", "title": "The 12-bar blues: the pattern behind the music", "blocks": [
      P("The 12-bar blues is a repeating 12-bar musical pattern. Almost every early jazz and blues song uses it. The pattern uses three chords (I, IV, V) — the Roman numerals just mean \"first,\" \"fourth,\" and \"fifth\" notes of the scale."),
      ("html", '<p class="label" style="margin-top:4pt">12-bar blues pattern (key of C)</p><div class="bars">' + "".join(
          f'<div class="{"iv" if r == "IV" else "v" if r == "V" else ""}"><b>Bar {i}</b>{c} ({r})</div>' for i, (c, r) in enumerate(BARS, 1)) + "</div>")] + q(
      "**6. Why do you think musicians liked this repeating pattern? What does it allow them to do?**", 3) + [
      P("*Aaron Douglas — Song of the Towers, 1934*", "cap")] + q(
      "**7. Aaron Douglas painted *Song of the Towers* about Harlem and its music. What do you think he was seeing or feeling?**", 4)}),
  ("connection", ["The **Jazz Lab** in the exhibition lets you layer different jazz instruments to build a full band sound. Try removing one instrument at a time — which one changes the feel of the music most?"]),
], ["**Big idea:** Jazz was born in the early 1900s and became the soundtrack of the Harlem Renaissance. It mixed African musical traditions (call-and-response, rhythm, improvisation) with American instruments and city energy. Listening carefully to jazz can tell you a lot about how it works — and what it means."])

MUS_Y = handout("Music", "Music", M_T, "yellow", M_HERO, [
  ("task", {"label": "Activity 1", "title": "Compare two recordings: blues vs big band jazz", "blocks": [
      P("Your teacher will play two recordings. Complete the comparison as you listen:"),
      ("table", {"head": ["Element", "Blues recording", "Big band jazz recording"], "rows": [
          ["Instruments heard", "", ""], ["Tempo (speed)", "", ""], ["Mood / emotion", "", ""],
          ["Solo or ensemble?", "", ""], ["Call-and-response present?", "", ""], ["Can you hear improvisation?", "", ""]]})] + q(
      "**What do these two recordings share — despite sounding so different?**", 3)}),
  ("task", {"label": "Activity 2", "title": "Structural analysis — 12-bar blues", "blocks": [
      P("The 12-bar blues uses three chords in a repeating sequence: **I** (4 bars) → **IV** (2 bars) → **I** (2 bars) → **V** (1 bar) → **IV** (1 bar) → **I** (1 bar) → **V** (1 bar)")] + q(
      "**Why does a repeating harmonic structure make improvisation easier, not harder?**", 3) + q(
      "**Syncopation** means accenting the off-beat — the \"and\" between beats. **Why do you think this rhythmic technique feels more energetic than playing exactly on the beat?**", 2)}),
  ("task", {"label": "Activity 3", "title": "African roots paragraph: where did jazz come from?", "blocks": q(
      "Jazz did not appear from nowhere. Write a paragraph (5–6 sentences) connecting the musical structures you've analyzed to their African roots. Use at least three of these terms: *call-and-response, polyrhythm, improvisation, griot tradition, blue notes, work songs.*", 5)}),
  ("task", {"label": "Activity 4", "title": "Art and music", "blocks": [
      P("Aaron Douglas painted *Song of the Towers* in 1934, a year after Duke Ellington recorded \"Sophisticated Lady.\" Both are about Harlem's creative energy."),
      P("*Aaron Douglas — Song of the Towers, 1934.* Note the concentric circles — often read as sound waves.", "cap")] + q(
      "**What specific musical element do you think the concentric circles represent? What about the figure with the saxophone?**", 3)}),
  ("connection", ["The **Jazz Lab** lets you build a jazz arrangement by layering instruments. Try building the same melody in both a blues style and a big band style. What changes — and what stays the same?"]),
], ["**Context:** Jazz emerged from the collision of African musical traditions (call-and-response, polyrhythm, improvisation, blue notes) with American instruments and urban energy. Understanding its structure reveals why it sounded so new — and why it was so powerful."],
  css="table.fill td:first-child { width: 30%; } table.fill td { padding-bottom: 18pt; } .cols .conn { margin: 0; }")

MUS_R = handout("Music", "Music", M_T, "red", M_HERO, [
  ("task", {"label": "Activity 1", "title": "Full structural analysis: analyze one recording in depth", "blocks": [
      fields([("Recording selected:", 1)]),
      ("table", {"head": ["Element", "What you hear", "What it does — function or effect"], "rows": [
          ["**Harmonic structure** (12-bar / other)", "", ""], ["**Syncopation** (where / how)", "", ""],
          ["**Call-and-response** (which instruments)", "", ""], ["**Improvisation** (who / when)", "", ""],
          ["**Rhythm section role**", "", ""], ["**Dynamics / expression**", "", ""]]})] + q(
      "**What is the single most striking musical choice in this recording? Why?**", 3)}),
  ("task", {"label": "Activity 2", "title": "Composition task: write a 4-bar melody over the blues", "blocks": [
      P("Using the 12-bar blues framework (bars 1–4 are chord I), write an original 4-bar melody. Use standard notation, solfège, or letter names for each beat. Your melody must include at least one **syncopated note** (off-beat accent) and one **\"blue note\"** (flattened 3rd or 7th)."),
      P("Key of C — Bars 1–4 all use chord C (I). Time signature: 4/4", "cap"),
      ("html", '<div class="comp">' + "".join(f'<div><b>Bar {i} — C</b><div class="beats">'
          + "".join(f"<span>{b}</span>" for b in ["Beat 1", "+", "Beat 2", "+", "Beat 3", "+", "Beat 4", "+"]) + "</div></div>" for i in range(1, 5)) + "</div>"),
      ("html", '<div class="fl" style="grid-template-columns:2.4fr .8fr .8fr"><span>Where did you place your syncopated note?</span><span>Bar</span><span>Beat</span></div>'),
      ("html", '<div class="fl" style="grid-template-columns:1fr 1fr"><span>What blue note did you use?</span><span>What effect does it create?</span></div>'),
      ("lines", 1)]}),
  ("task", {"label": "Activity 3", "title": "Critical essay", "blocks": q(
      "Duke Ellington's 1932 hit insisted: \"It don't mean a thing if it ain't got that swing.\" Using your structural analysis and what you know about the Harlem Renaissance, write 4–5 sentences arguing: **what did jazz make possible for Black Americans in the 1920s that other art forms could not?**", 7)}),
  aside("Mini Museum deep dive", ["In the **Jazz Lab**, isolate the rhythm section (bass, drums, piano). Listen to how the music changes without it. What does the rhythm section actually do — is it accompaniment, or something more fundamental? How does your answer connect to the African rhythmic traditions that gave jazz its foundation?"]),
], ["**Critical frame:** Duke Ellington's 1932 hit insisted: \"It don't mean a thing if it ain't got that swing.\" Analyze one recording's full structural architecture, then compose an original phrase within the blues framework, and write a critical essay connecting jazz structure to its cultural and historical context."],
  css="table.fill td:first-child { width: 30%; } table.fill td { padding-bottom: 16pt; }")

# ── typography: straight quotes to curly, outside markup ──
SKIP = {"out", "img", "pos", "css"}

def smart(s):
    out = []
    for part in re.split(r"(<[^>]+>)", s):
        if part.startswith("<"):
            out.append(part); continue
        part = re.sub(r'(^|[\s(\[—–/*])"', r"\1“", part)
        part = part.replace('"', "”")
        part = re.sub(r"(^|[\s(\[—–/*“])'", r"\1‘", part)
        out.append(part.replace("'", "’"))
    return "".join(out)

def walk(x, key=None):
    if isinstance(x, str):
        return x if key in SKIP else smart(x)
    if isinstance(x, dict):
        return {k: walk(v, k) for k, v in x.items()}
    if isinstance(x, (list, tuple)):
        r = [walk(v, key) for v in x]
        return tuple(r) if isinstance(x, tuple) else r
    return x

DOCS = [walk(d) for d in [REL_LP, REL_G, REL_Y, REL_R, SPA_LP, SPA_G, SPA_Y, SPA_R,
                          THE_LP, THE_G, THE_Y, THE_R, MUS_LP, MUS_G, MUS_Y, MUS_R]]

# links to the paintings this module names (see _links.py)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import add_links as _add_links
_add_links(DOCS)
