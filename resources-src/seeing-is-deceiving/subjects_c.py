"""Seeing is Deceiving · Grades 5–8 · Religion, Spanish, Theater, Music.
Converted from the original 2025 resources, keeping their own words:
a lesson plan and Green / Yellow / Red handouts for each subject."""
import html as _html, re as _re

SEE = "/exhibitions/seeing/"
SITE = "minimuseumproject.org/exhibitions/seeing-is-deceiving"

# ── small helpers of this module's own ───────────────────────────────────

def _i(t):
    t = _html.escape(t, quote=False)
    t = _re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return _re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def _lines(n):
    return '<div class="write">' + "<i></i>" * n + "</div>" if n else ""

def P(*texts, cls=""):
    c = f' class="{cls}"' if cls else ""
    return ("html", "".join(f"<p{c}>{_i(t)}</p>" for t in texts))

def Q(text, n=2):
    """A prompt and its writing lines, kept together."""
    texts = [text] if isinstance(text, str) else text
    return ("html", '<div class="q">' + "".join(f"<p>{_i(t)}</p>" for t in texts) + _lines(n) + "</div>")

def field(*labels):
    """Label: ____________ on one line, one per label."""
    return ("html", "".join(f'<p class="field"><b>{_i(l)}</b><span></span></p>' for l in labels))

def circle(items, note=None):
    """Prompts with answers to circle."""
    rows = "".join(f'<div class="row"><p>{_i(p)}</p><p class="opts">'
                   + "".join(f"<span>{_i(o)}</span>" for o in opts) + "</p></div>" for p, opts in items)
    return ("html", (f"<p>{_i(note)}</p>" if note else "") + f'<div class="circ">{rows}</div>')

def match(left, right):
    """Two columns to join with a line."""
    cells = "".join(f'<div class="l">{_i(a)}</div><div class="r">{_i(b)}</div>' for a, b in zip(left, right))
    return ("html", f'<div class="match">{cells}</div>')

def conn(paras, q=None, n=0, label="Mini Museum connection", url=SITE, extra=""):
    """The connection box, with room to answer its question."""
    body = "".join(f"<p>{_i(p)}</p>" for p in paras)
    if q:
        body += f'<p>{_i(q)}</p>{_lines(n)}'
    body += extra
    return ("html", f'<aside class="conn"><p class="label">{_i(label)}</p>{body}<p class="url">{url}</p></aside>')

def fam(paras, label="Share with your family"):
    return ("html", f'<aside class="family"><p class="label">{_i(label)}</p>'
                    + "".join(f"<p>{_i(p)}</p>" for p in paras) + "</aside>")

def es(spanish, english):
    """A line of Spanish with its English beneath."""
    return f'<p class="es">{_i(spanish)}</p><p class="en">{_i(english)}</p>'

CSS = """
.q { break-inside: avoid; margin: 0 0 6pt; }
.q p { margin: 0 0 2pt; }
.field { display: flex; gap: 8pt; align-items: flex-end; margin: 0 0 4pt; }
.field b { white-space: nowrap; }
.field span { flex: 1; border-bottom: .8pt solid #a9a69b; height: var(--line); }
.circ { margin: 2pt 0 8pt; break-inside: avoid; }
.circ .row { display: grid; grid-template-columns: 1fr auto; gap: 12pt; align-items: center; padding: 6pt 0; border-bottom: .6pt solid #c8c5bb; }
.circ .row p { margin: 0; }
.circ .opts { white-space: nowrap; }
.circ .opts span { display: inline-block; font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase;
  border: .8pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 9pt 2pt; margin-left: 5pt; background: rgba(255,255,255,.55); }
.match { display: grid; grid-template-columns: 1fr 1fr; column-gap: 72pt; row-gap: 8pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match div { border: .8pt solid #a9a69b; border-radius: 4pt; padding: 6pt 9pt; position: relative; background: rgba(255,255,255,.55); }
.match .l::after, .match .r::before { content: ''; position: absolute; top: 50%; width: 6pt; height: 6pt; margin-top: -3pt; border-radius: 50%; background: #1d1c1a; }
.match .l::after { right: -15pt; } .match .r::before { left: -15pt; }
.fillin { display: flex; align-items: flex-end; gap: 4pt; white-space: nowrap; } .fillin .blank:last-child { flex: 1; }
.fillin .blank { display: inline-block; border-bottom: .8pt solid #a9a69b; height: 14pt; vertical-align: bottom; }
.es { font-weight: 400; margin: 0 0 1pt; }
.en { color: #4b4a45; font-style: italic; margin: 0 0 6pt; }
.vocab { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18pt; margin: 4pt 0 10pt; }
.vocab div { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; border-bottom: .6pt solid #c8c5bb; padding: 5pt 0 4pt; }
.vocab b { font: 600 13pt/1.1 'Cormorant Garamond', serif; }
.vocab.one { grid-template-columns: 1fr; }
.vocab.one div { grid-template-columns: 1.2fr 1fr; }
.timing .bar > div { min-width: 56pt; overflow: hidden; }
table.fill:has(th:nth-child(3)) td:first-child { width: 26%; }
table.fill.blankrows td { height: 34pt; }
table.fill td + td { border-left: .6pt solid #c8c5bb; padding-left: 8pt; }
table.fill th + th { padding-left: 8pt; }
.task.numbered ul { margin-bottom: 4pt; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4pt 16pt; align-items: end; }
.three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14pt; align-items: end; }
ul.two { columns: 2; column-gap: 16pt; } ul.two li { break-inside: avoid; }
.cols .conn { margin-top: 0; }
.cols .levels { grid-template-columns: 1fr; gap: 5pt; }
.cols .lv { display: grid; grid-template-columns: 78pt 1fr; gap: 8pt; padding-top: 4pt; border-top-width: 2pt; }
.cols .lv p { margin: 0; }
.cols .levels { margin-bottom: 0; }
body > :last-child, body > :last-child > div > :last-child, body > :last-child > div > :last-child > :last-child { margin-bottom: 0 !important; }
"""

def vocab(pairs, one=False):
    cells = "".join(f"<div><b>{_i(a)}</b><span>{_i(b)}</span></div>" for a, b in pairs)
    return ("html", f'<div class="vocab{" one" if one else ""}">{cells}</div>')

def refs_grid(pairs, per_row):
    """Term and gloss pairs, several to a row."""
    cells = "".join(f"<dt>{_i(a)}</dt><dd>{_i(b)}</dd>" for a, b in pairs)
    return ("html", f'<dl class="refs" style="grid-template-columns:repeat({per_row}, max-content 1fr); column-gap:12pt">{cells}</dl>')

def blank_table(head, n):
    th = "".join(f"<th>{_i(h)}</th>" for h in head)
    rows = ("<tr>" + "<td></td>" * len(head) + "</tr>") * n
    return ("html", f'<table class="fill blankrows"><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table>')

PAL = ["#5F6655", "#2F4A5A", "#2E6E85", "#86671A", "#4A7346", "#A8452F"]

def timing(*steps):
    return ("timing", [(n, m, PAL[k % len(PAL)]) for k, (n, m) in enumerate(steps)])

# a plan's sections may run across a page, but never leave a heading behind
LP_CSS = ".sec { break-inside: auto; } .sec h3, .sec .label { break-after: avoid; } .sec li, .sec p { break-inside: avoid; } body.adult .sec { margin-bottom: 8pt; } body.adult p { margin-bottom: 5pt; } body.adult li { margin-bottom: 1.5pt; }"

def lesson(subj, out, title, sub, hero, summary, blocks):
    return {"out": out, "eyebrow": "Teacher lesson plan", "title": title, "sub": sub,
            "foot": f"Teacher Lesson Plan · Grades 5–8 {subj}", "hero": hero,
            "context": [summary], "blocks": blocks, "css": CSS + LP_CSS}

def handout(subj, level, out, title, sub, hero, blocks, context=None, css=""):
    d = {"out": out, "eyebrow": "Student handout", "title": title, "sub": sub, "level": level,
         "foot": f"Student Handout · Grades 5–8 {subj} · {level.title()} Level",
         "hero": hero, "blocks": blocks, "css": CSS + css}
    if context:
        d["context"] = context
    return d

def T(n, title, *blocks, body=None, lines=0):
    t = {"label": f"Part {n}", "title": title, "blocks": list(blocks)}
    if body:
        t["body"] = body if isinstance(body, list) else [body]
    if lines:
        t["lines"] = lines
    return ("task", t)

# ═════════════════════════════════════════════════════════════════════════
# RELIGION · Bearing True Witness
# ═════════════════════════════════════════════════════════════════════════

R = "teachers/grades-5-8/religion/"
R_HERO = {"img": SEE + "rubins-vase.jpg", "pos": "center 58%"}
EX_20 = {"text": "You shall not bear false witness against your neighbor.", "ref": "Exodus 20:16"}
JN_8 = {"text": "You will know the truth, and the truth will set you free.", "ref": "John 8:32"}
JN_14 = {"text": "Jesus said to him, ‘I am the way, and the truth, and the life.’", "ref": "John 14:6"}

# Lesson mode (resources-src/export_lessons.py): "screen" on a section is for
# the site only; build.py ignores it, so the PDF is unchanged. What the plan
# prints and the screen shows is written once, here.
R_OPEN = "*“Lord, help us to be seekers and speakers of truth. Give us the wisdom to recognize falsehood, the courage to speak honestly, and the charity to do so with love. Through Christ our Lord. Amen.”*"
R_UNPACK = "**Unpack:** Originally about courtroom testimony, but the Church teaches it extends to all truth-telling. Read CCC 2464: “The eighth commandment forbids misrepresenting the truth in our relations with others.”"
R_DISCUSS = "**Discussion:** What are ways we can “bear false witness” without being in a courtroom? (Gossip, rumors, sharing unverified info, manipulating images.) Did the spirit photographer bear false witness even though he used images, not words? (Yes.)"
R_PLEDGE = ["I will verify before I share", "I will not spread gossip or rumors",
            "I will have courage to speak truth, even when difficult", "I will admit when I am wrong or uncertain",
            "I will treat others’ reputations as sacred"]
R_TWO = ["**1. Verification:** Seek truth before we speak or share. Check sources, be skeptical of sensational claims.",
         "**2. Moral courage:** Speaking up when difficult — correcting misinformation, admitting when wrong, refusing gossip."]
R_CLOSE = "*“Lord, you are the Way, the Truth, and the Life. Help us to be witnesses to your truth in our words, our actions, and what we share with others. Give us wisdom to recognize deception and courage to speak honestly. Through Christ our Lord, Amen.”*"
# a prayer as the screen sets it: the words alone, without the plan's italics and quotation marks
said = lambda t: t.strip("*“”")

R_LP = lesson("Religion", R + "Lesson Plan_ Bearing True Witness (Religion 5-8) - Teacher Guide.pdf",
  "Bearing True Witness", "Faith and Truth in a World of Deception · Grades 5–8 · Religion · 30 minutes", R_HERO,
  "Students connect the Eighth Commandment to modern challenges with deepfakes and misinformation, exploring how bearing true witness requires both verification and moral courage.",
  [
  timing(("Prayer", 2), ("Hook", 5), ("Scripture", 8), ("Deepfakes", 8), ("Pledge", 5), ("Close", 2)),
  ("section", {"label": "Learning objective", "body": [
    "Students will understand how the Eighth Commandment applies to modern challenges including deepfakes and misinformation, recognize that bearing true witness requires both careful verification *and* moral courage, and create a personal commitment to truth-telling."]}),
  ("cols", [
    [("section", {"label": "Catechism connection", "list": [
      "**CCC 2464:** The eighth commandment forbids misrepresenting the truth in our relations with others.",
      "**CCC 2477:** Respect for the reputation of persons forbids every attitude and word likely to cause them unjust injury.",
      "**CCC 2488–2489:** The right to communication of truth is not unconditional."]})],
    [("section", {"label": "Materials needed", "list": [
      "Bible (Exodus 20:16, John 8:32, John 14:6)",
      "Catechism of the Catholic Church (paragraphs 2464–2513, selections)",
      "Spirit photography examples (1860s–1900s)",
      "Modern misinformation example (age-appropriate)",
      "Chart paper for class pledge"]})]]),
  ("section", {"label": "Opening prayer · 2 minutes",
    "screen": {"phase": "Prayer", "script": [f"{JN_14['text']} ({JN_14['ref']})", R_OPEN], "show": "prayer",
               "prayer": said(R_OPEN),
               "purpose": "Begin by asking for the wisdom and courage the lesson is about.",
               "students": ["Pray together."]}}),
  ("cols", [[("verse", JN_14)],
            [P(R_OPEN)]]),
  ("section", {"label": "Hook · 5 minutes", "title": "The Spirit Photography Deception",
    "screen": {"phase": "Hook", "show": "question",
               "question": "He bore false witness through images.",
               "purpose": "A fake from history sets up the commandment and its meaning today.",
               "students": ["Look at the spirit photographs.", "What made them fake?"]},
    "body": [
    "Display spirit photography examples from the 1860s–1900s.",
    "*“During the Civil War, a photographer named William Mumler claimed he could photograph spirits of the dead. He charged grieving families large sums for these fake images — double exposures. He bore false witness through images. Today we’ll explore what the Eighth Commandment teaches about truth in a world of deepfakes and viral misinformation.”*"]}),
  ("section", {"label": "Scripture study · 8 minutes", "title": "The Eighth Commandment",
    "screen": [
      {"phase": "Scripture", "minutes": 3, "script": [R_UNPACK], "show": "verse", "verse": EX_20,
       "purpose": "Read the commandment, and how the Church extends it to all truth-telling.",
       "students": ["Read it together."]},
      {"phase": "Scripture", "minutes": 2, "script": [f"{JN_8['text']} ({JN_8['ref']})"], "title": "The truth will set you free",
       "show": "verse", "verse": JN_8,
       "purpose": "Truth as freedom, not only as a rule.",
       "students": ["Read it together."]},
      {"phase": "Scripture", "minutes": 3, "script": [R_DISCUSS], "title": "Bearing false witness", "show": "question",
       "question": "What are ways we can “bear false witness” without being in a courtroom? Did the spirit photographer bear false witness even though he used images, not words?",
       "purpose": "Widen the commandment from the courtroom to everyday words and images.",
       "students": ["Discuss with your class."]}]}),
  ("verses", [EX_20, JN_8]),
  P(R_UNPACK, R_DISCUSS),
  ("section", {"label": "Modern application · 8 minutes", "title": "Deepfakes and Our Responsibility",
    "screen": [
      {"phase": "Deepfakes", "minutes": 4, "script": [0, 1], "show": "question",
       "question": "Why is this a moral issue and not just a technology issue? What responsibilities do we have as Christians when we encounter information online?",
       "purpose": "From the 1860s to AI: the same moral question.",
       "students": ["Today, AI can create videos of people saying things they never said."]},
      {"phase": "Deepfakes", "minutes": 4, "script": [2, 3, 4], "title": "Two dimensions of bearing true witness", "show": "chart",
       "caption": "Two dimensions of bearing true witness today", "columns": ["Dimension", "What it asks of us"],
       "rows": [{"cells": [x.split(":** ")[0].strip("*"), x.split(":** ")[1]]} for x in R_TWO],
       "purpose": "Two things bearing true witness needs: careful checking and the courage to speak.",
       "students": ["Which is harder for you?"]}],
    "body": [
    "*“Spirit photography was the deepfake of the 1860s. Today, AI can create videos of people saying things they never said.”*",
    "**Discuss:** Why is this a moral issue and not just a technology issue? What responsibilities do we have as Christians when we encounter information online?",
    "Two dimensions of bearing true witness today:"], "list": R_TWO}),
  ("section", {"label": "Activity · 5 minutes", "title": "Our Commitment to Truth",
    "screen": {"phase": "Pledge", "script": [0] + R_PLEDGE, "show": "question",
               "question": "Create a “Commitment to Truth” pledge.",
               "purpose": "The class writes its own pledge together on chart paper.",
               "students": R_PLEDGE},
    "body": [
    "As a class, create a “Commitment to Truth” pledge on chart paper. Guide students toward including:"]}),
  ("html", '<ul class="two">' + "".join(f"<li>{x}</li>" for x in R_PLEDGE) + '</ul>'),
  ("section", {"label": "Closing prayer and reflection · 2 minutes",
    "screen": {"phase": "Close", "title": "Closing prayer", "show": "prayer", "prayer": said(R_CLOSE),
               "purpose": "Close by giving the pledge back to God in prayer.",
               "students": ["Pray together."]},
    "body": [R_CLOSE]}),
  ("cols", [[("connection", [
    "**Option 1 — Visit:** Spirit photography in the exhibition shows how visual deception exploited grief. William Mumler exploited people’s vulnerability for profit — bearing false witness through images rather than words.",
    "**Option 2 — Virtual:** Explore the exhibition online."])],
   [("section", {"label": "Assessment", "list": [
    "**Formative:** Listen for students connecting the commandment to modern applications.",
    "**Written reflection:** “Describe one situation where you might need moral courage to bear true witness.”",
    "**Exit question:** “How does the Eighth Commandment apply to what we share online?”"]}),
    ("section", {"label": "Differentiated student handouts"}),
    ("levels", {"green": "Key concepts, simple scenarios, personal pledge",
                "yellow": "Apply commandment to multiple scenarios, write commitment",
                "red": "Research Catholic figure, theological analysis, extended reflection"})]]),
  ])

R_LP["slug"] = "bearing-true-witness"

def r_handout(level, out, blocks, css=""):
    return handout("Religion", level, R + out, "Bearing True Witness", "Grades 5–8 · Religion",
                   R_HERO, blocks, css=css)

R_GREEN = r_handout("green", "Student Handout_ Bearing True Witness - Green Level (Religion 5-8).pdf", [
  T(1, "The Eighth Commandment", ("verse", EX_20),
    body="This commandment tells us to be truthful. “Bearing false witness” means lying or deceiving others. God calls us to be people of truth!"),
  T(2, "What Does This Mean Today?", ("cols", [
      [P("Bearing **FALSE** witness includes:"), ("html", "<ul><li>Lying about someone</li><li>Spreading gossip or rumors</li><li>Sharing things online that aren’t true</li><li>Creating or sharing fake images to deceive people</li></ul>")],
      [P("Bearing **TRUE** witness means:"), ("html", "<ul><li>Telling the truth, even when it’s hard</li><li>Checking if something is true before sharing it</li><li>Protecting other people’s reputations</li><li>Admitting when we’re wrong</li></ul>")]])),
  T(3, "True Witness or False Witness?", circle([
      ("1. Sharing a funny meme about a classmate without checking if it’s mean", ["True witness", "False witness"]),
      ("2. Telling a friend “I don’t know if that rumor is true” instead of spreading it", ["True witness", "False witness"]),
      ("3. Checking if a news story is real before telling your family about it", ["True witness", "False witness"])],
      "For each situation, circle TRUE WITNESS or FALSE WITNESS:")),
  T(4, "My Commitment to Truth",
    ("html", '<div class="pledge"><p class="fillin">I, <span class="blank" style="width:230pt"></span>, commit to being a person of truth.</p>'),
    Q("One way I will bear true witness this week:", 6), field("Signature:"), ("html", "</div>")),
  T(5, "Jesus and Truth", ("verse", JN_14),
    body="For Christians, Jesus IS truth. When we commit to truth-telling, we follow Jesus!"),
  conn(["Spirit photographers in the 1860s created fake “ghost” images and sold them to grieving families. They bore false witness through pictures — deceiving people for money. Today, fake photos and videos (“deepfakes”) can spread even faster online."]),
  ("family", ["Talk with your family about the Eighth Commandment. Ask: “Have you ever seen something online that turned out to be false? How did you find out the truth?”"]),
  ("prayer", ["Lord, help me to be a person of truth. Give me courage to speak honestly and wisdom to recognize falsehood. May my words and actions honor you. Amen."]),
  ], css=".pledge { border: 1pt solid #1d1c1a; border-radius: 6pt; padding: 12pt 16pt 8pt; background: rgba(255,255,255,.55); margin: 6pt 0 4pt; } .pledge .fillin { margin-bottom: 10pt; }")

R_YELLOW = r_handout("yellow", "Student Handout_ Bearing True Witness - Yellow Level (Religion 5-8).pdf", [
  T(1, "Truth in a World of Deception", ("verses", [EX_20, JN_8]),
    body="The Eighth Commandment calls us to more than just “not lying.” The Catechism teaches that we must not misrepresent truth in any of our relationships. This includes what we say, what we share, and even what we allow others to believe through our silence."),
  T(2, "Applying the Commandment",
    P("For each scenario, explain how the Eighth Commandment applies:"),
    Q(["**Scenario 1:** A friend shows you a video of a celebrity saying something shocking. It looks real, but something feels off.", "What should you do? Why?"], 2),
    Q(["**Scenario 2:** Someone in your class is spreading a rumor about another student. You don’t know if it’s true. Others ask you to share what you’ve heard.", "What should you do? Why?"], 2),
    Q(["**Scenario 3:** You shared something on social media that you later learn was false. You already got lots of likes.", "What should you do? Why?"], 2)),
  T(3, "Two Parts of Bearing True Witness",
    P("**1. Verification:** Seeking truth before speaking", "**2. Moral Courage:** Speaking truth even when difficult"),
    Q("Which is harder for you? Why?", 2)),
  T(4, "My Commitment to Truth", Q("Write your own commitment in your own words:", 3)),
  conn(["Spirit photographers exploited grief for profit. The Catechism (CCC 2477) specifically mentions “detraction” — disclosing another’s faults without valid reason."],
       "How does spreading unverified information online relate to this teaching?", 3),
  ("family", ["**Discussion:** Talk with your family about a time when telling the truth was difficult but important. What gave you (or them) the courage to do the right thing?"]),
  ])

R_RED = r_handout("red", "Student Handout_ Bearing True Witness - Red Level (Religion 5-8).pdf", [
  T(1, "The Moral Dimension of Truth", ("verse", JN_14),
    body="For Christians, truth is not merely factual accuracy — it is a Person. Jesus identifies himself AS truth. This means our commitment to truthfulness is inseparable from our commitment to Christ. Every act of deception distances us from the One who is Truth itself."),
  T(2, "Catechism Deep Dive",
    P("The Catechism addresses truth in paragraphs 2464–2513. Key teachings:"),
    ("html", "<ul><li><b>CCC 2477:</b> Respect for reputation forbids “rash judgment,” “detraction,” and “calumny”</li>"
             "<li><b>CCC 2489:</b> We must balance truth with charity — not all true things should be shared</li>"
             "<li><b>CCC 2494:</b> Information must serve the common good and respect justice and charity</li></ul>"),
    Q("**Reflection:** How does the teaching that “not all true things should be shared” balance with the call to bear true witness?", 2)),
  T(3, "Research: Witnesses to Truth",
    P("Throughout history, Catholics have shown moral courage by bearing witness to truth despite persecution. Research ONE:"),
    ("html", "<ul><li><b>St. Thomas More</b> — Executed for refusing to lie about the king’s marriage</li>"
             "<li><b>St. Maximilian Kolbe</b> — Journalist who used media to spread truth, died at Auschwitz</li>"
             "<li><b>Blessed Franz Jägerstätter</b> — Austrian who refused to swear a false oath to Hitler</li>"
             "<li><b>St. Oscar Romero</b> — Archbishop who spoke truth to power despite death threats</li></ul>"),
    field("Person researched:"),
    ("html", '<div class="three">'), Q("What truth did they witness to?", 2), Q("What did it cost them?", 2),
    Q("What can we learn from their example today?", 2), ("html", "</div>")),
  T(4, "Theological Question",
    P("Spirit photographers created false images; deepfake creators do the same with video. Both exploit trust in visual “evidence.”"),
    Q("**Question:** The Catechism speaks of sins against truth including “false witness, perjury, detraction, calumny, boasting, and irony meant to harm.” In our digital age, should “creating or sharing manipulated media” be understood as a distinct offense against truth? Why or why not?", 3)),
  conn(["William Mumler was put on trial for fraud in 1869 but was acquitted — not because he was innocent, but because the prosecution couldn’t prove HOW he faked the photos."],
       "**Reflect:** When technology makes deception undetectable, how does our moral responsibility change?", 2,
       label="Mini Museum deep dive"),
  T(5, "Modern Application",
    P("The Catechism (CCC 2494) states: “Information provided by the media is at the service of the common good. Society has a right to information based on truth, freedom, justice, and solidarity.”"),
    Q("**Question:** What responsibilities do we have as consumers AND sharers of information in the digital age?", 2)),
  ("family", ["**Discussion:** Share what you learned about a Catholic witness to truth. Discuss as a family: What truths might require courage to witness in our world today?"]),
  ], css="body.student { --line: 21pt; }")

# ═════════════════════════════════════════════════════════════════════════
# SPANISH · ¿Verdad o Mentira?
# ═════════════════════════════════════════════════════════════════════════

S = "teachers/grades-5-8/spanish/"
S_HERO = {"img": SEE + "face.jpg", "pos": "center 40%"}
ILL = SITE + "/illusions"
# the ticket and the connection box in Spanish
S_CSS = """
.tfields span { font-size: 0; } .tfields span::before { font-size: 7.5pt; }
.tfields span:nth-child(1)::before { content: 'Nombre'; }
.tfields span:nth-child(2)::before { content: 'Fecha'; }
.tfields span:nth-child(3)::before { content: 'Período'; }
"""

S_VOCAB = [("la verdad", "the truth"), ("la mentira", "the lie"), ("real", "real"), ("falso/falsa", "false/fake"),
           ("verdadero/a", "true"), ("creer", "to believe"), ("ver", "to see"), ("engañar", "to trick/deceive"),
           ("los ojos", "the eyes"), ("la foto(grafía)", "the photo")]
S_FRAMES = [("Creo que es…", "I believe it is…"), ("Pienso que es…", "I think it is…"),
            ("¿Es verdad o mentira?", "Is it truth or lie?"), ("Mis ojos ven…", "My eyes see…"),
            ("La foto es real/falsa.", "The photo is real/fake.")]
S_TPR = [("Verdad", "thumbs up, nod head"), ("Mentira", "thumbs down, shake head"), ("Real", "touch something solid"),
         ("Falso", "wave hand like “no”"), ("Creer", "hand on heart")]
S_PRACTICE = "**Quick practice:** Show images, students respond “¡Verdad!” or “¡Mentira!”"
# the hook's first words: ver, los ojos, engañar, la verdad, la mentira
S_FIRST = [S_VOCAB[i] for i in (6, 8, 7, 0, 1)]

S_LP = lesson("Spanish", S + "Spanish Lesson Plan_ ¿Verdad o Mentira_ (Grades 5-8) - Teacher Guide.pdf",
  "¿Verdad o Mentira?", "Truth or Lie? · Grades 5–8 · Spanish · 30 minutes", S_HERO,
  "Students learn vocabulary for truth, lies, and visual deception while exploring how optical illusions connect to the theme of appearances vs. reality. Designed for novice-low to novice-mid learners with heritage speaker support.",
  [
  timing(("Hook", 5), ("Vocabulary", 8), ("Spirit photos", 10), ("Game", 5), ("Close", 2)),
  ("section", {"label": "Learning objective", "body": [
    "Students will acquire vocabulary related to truth/deception (*verdad, mentira, real, falso, creer, ver*), practice expressing opinions using “Creo que…” and “Pienso que…”, and connect language learning to critical thinking about visual media."]}),
  ("cols", [
    [("section", {"label": "Standards alignment", "list": [
      "**ACTFL:** Interpersonal Communication (novice-mid), Presentational Communication (novice-mid)",
      "**TEKS §114.22:** Engage in conversations using simple phrases and sentences."]})],
    [("section", {"label": "Materials needed", "list": [
      "Spirit photography example from Mini Museum",
      "Vocabulary cards or projected word list",
      "Student handouts (three levels available)",
      "Mini Museum Perception Lab: " + ILL]})]]),
  ("section", {"label": "Key vocabulary"}),
  refs_grid(S_VOCAB, 3),
  ("section", {"label": "Sentence frames (for all levels)"}),
  refs_grid(S_FRAMES, 2),
  ("section", {"label": "Hook · 5 minutes", "title": "¿Qué ves? — What do you see?",
    "screen": [
      {"phase": "Hook", "minutes": 2, "script": [0, 1], "title": "¿Qué ven tus ojos?", "show": "image",
       "img": {"img": SEE + "checker-shadow.jpg"}, "caption": "¿Qué ven tus ojos?",
       "alt": "A checkerboard with a brown cylinder casting a shadow across it; square A sits outside the shadow, square B inside it",
       "purpose": "Students call out what they see before the reveal.",
       "students": ["What do your eyes see?"]},
      {"phase": "Hook", "minutes": 1, "script": [1], "title": "¡Tus ojos te engañan!", "show": "image",
       "img": {"img": SEE + "checker-reveal.jpg"}, "caption": "¡Tus ojos te engañan!",
       "alt": "The checkerboard taken away: squares A and B alone on black, the same gray",
       "purpose": "The reveal, said in Spanish.",
       "students": ["Your eyes trick you!"]},
      {"phase": "Hook", "minutes": 2, "script": [2], "title": "Key vocabulary", "show": "chart",
       "caption": "Key vocabulary", "columns": ["Español", "English"],
       "rows": [{"cells": [a, b]} for a, b in S_FIRST],
       "purpose": "The first five words, with gestures and visuals.",
       "students": ["Say each word with its gesture."]}],
    "body": [
    "Display an optical illusion. Point to your eyes.",
    "“¿Qué ven tus ojos?” (What do your eyes see?) — Have students call out what they see. Then reveal the illusion. “¡Tus ojos te engañan!” (Your eyes trick you!)",
    "Introduce key vocabulary: *ver, los ojos, engañar, la verdad, la mentira.* Use gestures and visuals."]}),
  ("section", {"label": "Vocabulary introduction · 8 minutes",
    "screen": [
      {"phase": "Vocabulary", "minutes": 3, "script": [0], "title": "La verdad y la mentira", "show": "chart",
       "caption": "Key vocabulary", "columns": ["Español", "English"],
       "rows": [{"cells": [a, b]} for a, b in S_VOCAB],
       "purpose": "All ten words, heard and seen.",
       "students": ["Listen, then repeat."]},
      {"phase": "Vocabulary", "minutes": 3, "script": [f"**{a}** — {b}" for a, b in S_TPR], "title": "Total Physical Response",
       "show": "chart", "caption": "A gesture for each word", "columns": ["Palabra", "Gesture"],
       "rows": [{"cells": [a, b]} for a, b in S_TPR],
       "purpose": "A gesture for each word, so the whole class answers at once.",
       "students": ["Do the gesture as you say the word."]},
      {"phase": "Vocabulary", "minutes": 2, "script": [S_PRACTICE], "title": "Quick practice", "show": "question",
       "question": "¿Es verdad o mentira?",
       "purpose": "A quick check before the Mini Museum connection.",
       "students": ["¡Verdad!", "¡Mentira!"]}],
    "body": [
    "Present vocabulary with Total Physical Response (TPR) and comprehensible input:"]}),
  ("html", '<ul class="two">' + "".join(f"<li><b>{a}</b> — {b}</li>" for a, b in S_TPR) + '</ul>'),
  P(S_PRACTICE),
  ("section", {"label": "Mini Museum connection · 10 minutes", "title": "La Fotografía de Espíritus",
    "screen": [
      {"phase": "Spirit photos", "minutes": 4, "script": [0, 1], "show": "question",
       "question": "En 1862, un fotógrafo dijo: ‘Puedo fotografiar fantasmas.’ Muchas personas creyeron. ¿Es verdad o mentira?",
       "purpose": "A real fake from history, in simple Spanish.",
       "students": ["Is it truth or lie?"]},
      {"phase": "Spirit photos", "minutes": 6, "script": [2], "title": "Partner practice", "show": "chart",
       "caption": "Sentence frames", "columns": ["Español", "English"],
       "rows": [{"cells": [a, b]} for a, b in S_FRAMES],
       "purpose": "Partners give their opinion with a sentence frame; heritage speakers help with vocabulary.",
       "students": ["“Creo que es mentira porque…”"]}],
    "body": [
    "Show spirit photography example.",
    "“En 1862, un fotógrafo dijo: ‘Puedo fotografiar fantasmas.’ Muchas personas creyeron. ¿Es verdad o mentira?” (In 1862, a photographer said: ‘I can photograph ghosts.’ Many people believed. Is it truth or lie?)",
    "**Partner practice:** Students discuss using sentence frames: “Creo que es mentira porque…” (I believe it’s a lie because…). Heritage speakers can help partners with vocabulary."]}),
  ("section", {"label": "Activity · 5 minutes", "title": "¿Verdad o Mentira? Game",
    "screen": {"phase": "Game", "show": "question", "question": "¿Por qué crees eso?",
               "purpose": "Students judge real and manipulated images, and say why.",
               "students": ["Hold up VERDAD or MENTIRA.", "Creo que es… / Pienso que es…"]},
    "body": [
    "Show 4–5 images (mix of real and manipulated). Students hold up VERDAD or MENTIRA cards. After each: “¿Por qué crees eso?” (Why do you believe that?) — Students respond using sentence frames."]}),
  ("section", {"label": "Closing · 2 minutes", "title": "Reflection",
    "screen": {"phase": "Close", "show": "question",
               "question": "No todo lo que vemos es verdad. Debemos pensar antes de creer.",
               "purpose": "One sentence to remember, then the exit ticket.",
               "students": ["Write one sentence using new vocabulary."]},
    "body": [
    "“No todo lo que vemos es verdad. Debemos pensar antes de creer.” (Not everything we see is truth. We should think before believing.)",
    "**Exit ticket:** Students write one sentence using new vocabulary."]}),
  ("connection", [
    "**Option 1 — Visit:** Students describe artifacts using Spanish: “Veo una foto. Creo que es falsa.”",
    "**Option 2 — Virtual:** Explore the exhibition online."]),
  ("cols", [
    [("section", {"label": "Differentiation notes", "list": [
      "**Novice learners:** Focus on single words and simple sentence frames; use visuals heavily",
      "**Heritage speakers:** Encourage expanded responses, help peers, write more complex sentences",
      "**All levels:** Accept code-switching; vocabulary is the goal, not perfect grammar"]})],
    [("section", {"label": "Assessment", "list": [
      "**Formative:** Observe vocabulary use during game and partner work.",
      "**Exit ticket:** Write one sentence: “Creo que _____ es verdad/mentira porque _____.”"]})]]),
  ])


S_LP["slug"] = "verdad-o-mentira"

def s_handout(level, out, blocks):
    return handout("Spanish", level, S + out, "¿Verdad o Mentira?", "Truth or Lie? · Grades 5–8 · Spanish",
                   S_HERO, blocks, css=S_CSS)

S_GREEN = s_handout("green", "Student Handout_ ¿Verdad o Mentira_ - Green Level (Spanish 5-8).pdf", [
  T(1, "Vocabulario — Vocabulary", vocab([
      ("la verdad", "the truth"), ("la mentira", "the lie"), ("real", "real"), ("falso / falsa", "false / fake"),
      ("creer", "to believe"), ("ver", "to see"), ("los ojos", "the eyes"), ("la foto", "the photo")], one=True)),
  ("pagebreak", None),
  T(2, "Frases Útiles — Useful Phrases", vocab([
      ("Creo que es…", "I believe it is…"), ("Pienso que es…", "I think it is…"),
      ("¿Es verdad o mentira?", "Is it truth or lie?")], one=True)),
  T(3, "Práctica — Practice", circle([
      ("Imagen 1:", ["Verdad", "o", "Mentira"]), ("Imagen 2:", ["Verdad", "o", "Mentira"]),
      ("Imagen 3:", ["Verdad", "o", "Mentira"])], "Look at the images your teacher shows. Circle your answer:")),
  T(4, "Escribe — Write",
    P("Complete the sentence about the spirit photograph:"),
    ("html", '<p class="fillin big">Creo que la foto es <span class="blank" style="width:190pt"></span> .</p>'),
    P("(verdad / mentira / real / falsa)", cls="en")),
  conn(["In 1862, a photographer said he could photograph ghosts. Many people believed him!"],
       None, label="Mini Museum", url=ILL,
       extra='<p class="fillin">¿Es verdad o mentira? <span class="blank" style="width:200pt"></span></p>'),
  fam(["Teach your family these words: *verdad, mentira, real, falso*",
       "Play “¿Verdad o Mentira?” with photos you find online!"], label="¡Comparte con tu familia!"),
  ])
# green's two pages are roomy: give the words and the circling room to breathe
S_GREEN["css"] += """
.vocab.one div { padding: 8pt 0 7pt; align-items: baseline; } .vocab b { font-size: 16pt; }
.task:first-of-type .vocab.one div { padding: 15pt 0 13pt; } .task:first-of-type .vocab b { font-size: 19pt; }
.task:first-of-type .vocab span { font-size: 12pt; }
.circ .row { padding: 14pt 0; } .circ .opts span { font-size: 9pt; padding: 5pt 14pt 4pt; }
.circ .opts span:nth-child(2) { border-color: transparent; background: none; }
.fillin.big { font-size: 13pt; margin: 14pt 0 4pt; } .fillin { margin: 6pt 0 10pt; }
"""

S_YELLOW = s_handout("yellow", "Student Handout_ ¿Verdad o Mentira_ - Yellow Level (Spanish 5-8).pdf", [
  T(1, "Vocabulario Clave — Key Vocabulary", vocab([
      ("la verdad", "truth"), ("la mentira", "lie"), ("real", "real"), ("falso/a", "fake"),
      ("creer", "to believe"), ("engañar", "to trick"), ("los ojos", "eyes"), ("la foto", "photo")])),
  T(2, "Frases para Expresar Opiniones", vocab([
      ("Creo que es verdad/mentira porque…", "I believe it’s true/a lie because…"),
      ("Pienso que la foto es real/falsa porque…", "I think the photo is real/fake because…"),
      ("Mis ojos ven _____, pero no es real.", "My eyes see _____, but it’s not real.")], one=True)),
  T(3, "Analiza — Analyze",
    P("Read each statement. Is it *verdad* or *mentira*? Write your opinion using the sentence frames."),
    ("html", '<div class="q">' + es("“¡Los científicos dicen que el chocolate es más saludable que las verduras!”", "(“Scientists say chocolate is healthier than vegetables!”)")
             + '<p class="fillin">Creo que es <span class="blank" style="width:120pt"></span> porque <span class="blank" style="width:220pt"></span></p>' + _lines(1) + "</div>"),
    ("html", '<div class="q">' + es("“En 1862, las personas no sabían que las fotos podían ser falsas.”", "(“In 1862, people didn’t know photos could be fake.”)")
             + '<p class="fillin">Pienso que es <span class="blank" style="width:115pt"></span> porque <span class="blank" style="width:220pt"></span></p>' + _lines(1) + "</div>"),
    ("html", '<div class="q">' + es("“Hoy es fácil crear videos falsos con inteligencia artificial.”", "(“Today it’s easy to create fake videos with artificial intelligence.”)")
             + '<p class="fillin">Creo que es <span class="blank" style="width:120pt"></span> porque <span class="blank" style="width:220pt"></span></p>' + _lines(1) + "</div>")),
  T(4, "La Fotografía de Espíritus — Spirit Photography",
    ("html", es("En 1862, un fotógrafo dijo: “Puedo fotografiar fantasmas.”", "(In 1862, a photographer said: “I can photograph ghosts.”)")
             + es("Muchas personas creyeron. Pagaron mucho dinero.", "(Many people believed. They paid a lot of money.)")),
    Q("¿Por qué creyeron las personas? (Why did people believe?)", 2),
    Q("¿La fotografía de espíritus es verdad o mentira?", 1)),
  T(5, "Conexión — Connection",
    ("html", es("Hoy tenemos “deepfakes” — videos falsos que parecen reales.", "(Today we have “deepfakes” — fake videos that look real.)")),
    Q("¿Cómo son similares los deepfakes y la fotografía de espíritus?", 3)),
  fam(["Juega “¿Verdad o Mentira?” con tu familia.",
       "Find images online and ask: “¿Crees que es verdad o mentira?”",
       "**Visit:** " + ILL], label="¡Comparte con tu familia!"),
  ])
S_YELLOW["css"] += "body.student { --line: 21pt; }"

S_RED = s_handout("red", "Student Handout_ ¿Verdad o Mentira_ - Red Level (Spanish 5-8).pdf", [
  T(1, "Vocabulario Extendido — Extended Vocabulary", vocab([
      ("la verdad", "truth"), ("la mentira", "lie"), ("engañar", "to deceive/trick"), ("confiar", "to trust"),
      ("verificar", "to verify"), ("la fuente", "the source"), ("dudar", "to doubt"), ("investigar", "to investigate")])),
  T(2, "Lee y Analiza — Read and Analyze",
    ("html", es("En 1862, William Mumler inventó la “fotografía de espíritus.” Él dijo que podía fotografiar a personas muertas. Muchas familias tristes pagaron mucho dinero para ver a sus familiares. Pero todo era mentira. Mumler usó un truco llamado “doble exposición.”",
                "(In 1862, William Mumler invented “spirit photography.” He said he could photograph dead people. Many sad families paid a lot of money to see their relatives. But it was all a lie. Mumler used a trick called “double exposure.”)")),
    Q("1. ¿Por qué las familias creyeron a Mumler? (Why did families believe Mumler?)", 2),
    Q("2. ¿Cómo podían verificar si las fotos eran reales? (How could they verify if the photos were real?)", 2),
    Q("3. ¿Qué significa “ver para creer”? ¿Es siempre verdad? (What does “seeing is believing” mean? Is it always true?)", 2)),
  T(3, "Conexión Moderna — Modern Connection",
    ("html", es("Hoy tenemos tecnología nueva: los “deepfakes.” Son videos falsos que parecen muy reales. Usan inteligencia artificial para crear mentiras visuales.",
                "(Today we have new technology: “deepfakes.” They are fake videos that look very real. They use artificial intelligence to create visual lies.)")),
    Q("¿Cómo son similares los deepfakes y la fotografía de espíritus?", 3),
    Q("¿Qué podemos hacer para no ser engañados? (What can we do to not be deceived?)", 2)),
  T(4, "Escribe en Español — Write in Spanish",
    P("Write 3–4 sentences in Spanish about what you learned. Use the vocabulary from this lesson.",
      "**Sentence starters:** *Aprendí que… / Creo que es importante… / Para verificar información, debemos…*"),
    ("lines", 6)),
  fam(["Explica a tu familia qué es un “deepfake” en español e inglés.",
       "**Discuss:** ¿Cómo podemos verificar si un video es real o falso?",
       "**Visit:** " + ILL], label="¡Comparte con tu familia!"),
  ])
S_RED["css"] += "body.student { --line: 21pt; }"

# ═════════════════════════════════════════════════════════════════════════
# THEATER · The Art of Illusion
# ═════════════════════════════════════════════════════════════════════════

TH = "teachers/grades-5-8/theater/"
TH_HERO = {"img": SEE + "balcony.jpg", "pos": "center 62%"}

TH_VIC = [("Pepper’s Ghost", "Using angled glass to make “ghosts” appear on stage"),
          ("Trap doors", "Actors appearing and disappearing"),
          ("Lighting effects", "Colored gels, limelight for dramatic effect"),
          ("Sound effects", "Thunder sheets, wind machines")]
TH_SAY = "*“The Victorians LOVED theatrical illusions. Stage ghosts used angled glass; spirit photographers used double exposure. Both made ghosts appear — the difference? Theater audiences knew it was fake. Spirit photography victims didn’t.”*"
TH_OPTIONS = [
  "**Option A — Performance:** In small groups, students create a 30-second scene using simple staging tricks: pretending to open a door that isn’t there, miming drinking from an invisible cup, or using a flashlight to create “moonlight.”",
  "**Option B — Analysis:** Watch a clip from a stage production. Students identify: What illusions are being used? What are we “agreeing” to believe? What theatrical elements help us suspend disbelief?"]

TH_LP = lesson("Theater", TH + "Theater Lesson Plan_ The Art of Illusion (Grades 5-8) - Teacher Guide.pdf",
  "The Art of Illusion", "Theater’s Willing Deception · Grades 5–8 · Theater · 30 minutes", TH_HERO,
  "Students explore how theater creates “willing suspension of disbelief” through acting, staging, and special effects — connecting performance illusion to the visual deceptions in the Mini Museum.",
  [
  timing(("Hook", 5), ("Concept", 5), ("Victorian", 8), ("Activity", 10), ("Close", 2)),
  ("section", {"label": "Learning objective", "body": [
    "Students will understand the concept of “suspension of disbelief,” analyze theatrical techniques that create believable illusions, and explore the ethical difference between theatrical illusion (consensual) and deception (non-consensual)."]}),
  ("cols", [
    [("section", {"label": "Standards alignment", "list": [
      "**NCAS TH:Re8.1:** Analyze how personal aesthetics, preferences, and beliefs influence a drama/theatre experience.",
      "**NCAS TH:Cn11.2:** Analyze the social, cultural, and historical context of a drama/theatre work.",
      "**TEKS §117.214:** Analyze and evaluate theatrical elements and production qualities."]})],
    [("section", {"label": "Materials needed", "list": [
      "Video clips: stage magic, theatrical special effects, or “behind the scenes” footage",
      "Simple props for demonstration (scarf, box, flashlight)",
      "Images of Victorian theater special effects (Pepper’s Ghost, trap doors)",
      "Mini Museum spirit photography examples for comparison"]})]]),
  ("section", {"label": "Hook · 5 minutes", "title": "The Magic Box",
    "screen": {"phase": "Hook", "show": "question", "question": "Did the scarf really disappear?",
               "purpose": "Students enjoy a trick they know is a trick: the start of suspension of disbelief.",
               "students": ["Watch the box."]},
    "body": [
    "Perform a simple “illusion” — make a scarf “disappear” into a box (with obvious false bottom or sleeve).",
    "*“Did the scarf really disappear? No! You all know it’s a trick. But here’s the interesting thing — even though you KNOW it’s fake, part of you still enjoyed watching it ‘disappear.’ That’s called the ‘suspension of disbelief,’ and it’s the foundation of ALL theater.”*"]}),
  ("section", {"label": "Concept · 5 minutes", "title": "Suspension of Disbelief",
    "screen": {"phase": "Concept", "show": "question",
               "question": "This is a contract between audience and performers.",
               "purpose": "The key distinction: illusion the audience agrees to, and deception it does not.",
               "students": ["Theater illusion is consensual.",
                            "This is different from deception, where someone is tricked WITHOUT their consent."]},
    "body": [
    "*“When you watch a play, you KNOW the actors aren’t really the characters. You KNOW the set isn’t a real castle. But you agree to pretend — to suspend your disbelief — so you can enjoy the story. This is a contract between audience and performers.”*",
    "**Key distinction:** Theater illusion is consensual. The audience KNOWS it’s not real and chooses to go along. This is different from deception, where someone is tricked WITHOUT their consent."]}),
  ("section", {"label": "Victorian theater technology · 8 minutes",
    "screen": [
      {"phase": "Victorian", "minutes": 5, "script": [0] + [f"**{a}:** {b}" for a, b in TH_VIC], "show": "chart",
       "caption": "Victorian theatrical illusions", "columns": ["Technique", "What it does"],
       "rows": [{"cells": [a, b]} for a, b in TH_VIC],
       "purpose": "Four tools of Victorian stage illusion.",
       "students": ["Which would fool you?"]},
      {"phase": "Victorian", "minutes": 3, "script": [TH_SAY], "title": "The difference", "show": "question",
       "question": "The difference? Theater audiences knew it was fake. Spirit photography victims didn’t.",
       "purpose": "Stage ghosts and spirit photographs: the difference is consent.",
       "students": ["The Victorians LOVED theatrical illusions."]}],
    "body": [
    "Show images or video of Victorian theatrical illusions:"]}),
  ("html", '<ul class="two">' + "".join(f"<li><b>{a}:</b> {b}</li>" for a, b in TH_VIC) + '</ul>'),
  P(TH_SAY),
  ("section", {"label": "Activity · 10 minutes", "title": "Creating Theatrical Illusion",
    "screen": {"phase": "Activity", "show": "chart",
               "caption": "Two options", "columns": ["Option", "What to do"],
               "rows": [{"cells": [x.split(":** ")[0].strip("*"), x.split(":** ")[1]]} for x in TH_OPTIONS],
               "purpose": "Students make an illusion on stage, or find the illusions in a production.",
               "students": ["What are we “agreeing” to believe?"]},
    "body": TH_OPTIONS}),
  ("section", {"label": "Closing · 2 minutes", "title": "The Ethics of Illusion",
    "screen": {"phase": "Close", "show": "question",
               "question": "But what happens when the same techniques are used to deceive people who DON’T know it’s fake?",
               "purpose": "Where entertainment crosses into manipulation.",
               "students": ["Entertainment or manipulation?"]},
    "body": [
    "*“Theater and magic shows create illusions that audiences enjoy and consent to. But what happens when the same techniques are used to deceive people who DON’T know it’s fake? That’s where we cross from entertainment into manipulation. The Mini Museum shows us examples of both — and helps us understand the difference.”*"]}),
  ("cols", [[("connection", [
    "**Option 1 — Visit:** The stereoscope and spirit photographs are illusions, like those on the stage. Pepper’s Ghost (theater, angled glass) and spirit photography (fraud, double exposure) used different tricks to make the same thing appear — a ghost. The difference was consent and intent.",
    "**Option 2 — Virtual:** Explore the exhibition online."])],
   [("section", {"label": "Assessment", "list": [
    "**Discussion:** Can students articulate the difference between theatrical illusion and deception?",
    "**Application:** Can students identify specific techniques that create suspension of disbelief?",
    "**Exit ticket:** “Explain one theatrical technique and why audiences are willing to ‘believe’ it.”"]})]]),
  ("section", {"label": "Differentiated student handouts"}),
  ("levels", {"green": "Identify theatrical elements, match techniques to effects",
              "yellow": "Analyze a scene for illusion techniques, compare theater vs. deception",
              "red": "Design theatrical illusion, write about ethics of illusion vs. deception"}),
  ("cols", [
    [("section", {"label": "Extension activities", "list": [
      "Research Pepper’s Ghost and create a simple version using a phone screen and glass",
      "Compare Victorian stage magic to modern CGI — what’s different? What’s the same?",
      "Write a short scene that relies heavily on audience suspension of disbelief"]})],
    [("section", {"label": "Key vocabulary", "list": [
      "**Suspension of disbelief:** Audience’s willingness to accept theatrical conventions as “real” for the duration of a performance.",
      "**Pepper’s Ghost:** Victorian stage illusion using angled glass to project ghostly images.",
      "**Theatrical convention:** Accepted practices that audiences understand (aside, spotlight, etc.)."]})]]),
  ])

TH_LP["slug"] = "the-art-of-illusion"

def th_handout(level, out, blocks, css=""):
    return handout("Theater", level, TH + out, "The Art of Illusion", "Grades 5–8 · Theater", TH_HERO, blocks, css=css)

TH_GREEN = th_handout("green", "Student Handout_ The Art of Illusion - Green Level (Theater 5-8).pdf", [
  T(1, "What is Suspension of Disbelief?", body=[
    "When you watch a play or movie, you KNOW it’s not real. The actors aren’t really the characters, and the set isn’t a real place. But you choose to pretend it’s real so you can enjoy the story!",
    "**Big Idea:** Theater illusion is like a game — the audience agrees to “believe” even though they know it’s fake. This is different from being tricked without your permission!"]),
  T(2, "Theatrical Tricks",
    P("Match each theatrical technique to what it creates:"),
    match(["Colored lights", "Trap doors", "Sound effects", "Painted backdrops"],
          ["Make actors appear and disappear", "Create mood (scary, happy, romantic)", "Make a simple set look real", "Thunder, rain, footsteps"])),
  ("pagebreak", None),
  T(3, "What Do You “Believe”?",
    P("Think about the last play, movie, or show you watched. What did you “pretend” was real?"),
    Q("I pretended that…", 7)),
  T(4, "Theater vs. Tricks",
    P("What’s the difference between theater illusions and being tricked?",
      "**Theater:** You KNOW it’s fake, and you CHOOSE to enjoy it.",
      "**Being Tricked:** You DON’T know it’s fake, and someone is fooling you."),
    circle([
      ("A magician at a show makes a rabbit “appear.” This is:", ["Theater", "Being tricked"]),
      ("Someone edits a photo to make you believe something false. This is:", ["Theater", "Being tricked"]),
      ("An actor pretends to cry in a play. This is:", ["Theater", "Being tricked"])], "Circle the right answer:")),
  conn(["The Victorians used the SAME techniques for theater AND for fake “ghost photos.” The difference? Theater audiences knew it was fake. People who bought spirit photographs didn’t!"]),
  ("family", ["Watch a movie or show with your family. Talk about what theatrical tricks help you “believe” the story!"]),
  ], css=".match { row-gap: 22pt; margin-top: 14pt; } .match div { padding: 10pt 12pt; } .circ .row { padding: 10pt 0; }")

TH_YELLOW = th_handout("yellow", "Student Handout_ The Art of Illusion - Yellow Level (Theater 5-8).pdf", [
  T(1, "Suspension of Disbelief", body=[
    "“Suspension of disbelief” is the audience’s willingness to accept theatrical conventions as “real” for the duration of a performance. It’s a contract between performers and audience.",
    "**Key Concept:** Theater illusion is consensual — audiences know it’s fake but choose to go along. Deception is non-consensual — victims don’t know they’re being fooled."]),
  T(2, "Analyze a Scene",
    P("Think about a play, movie, or show you’ve seen. Identify the theatrical illusions used:"),
    ("table", {"head": ["Theatrical element", "How did it help you “believe” the story?"], "rows": [
      ["Acting (emotions, voice)", ""], ["Set/Scenery", ""], ["Lighting", ""], ["Sound/Music", ""], ["Costumes/Makeup", ""]]})),
  T(3, "Victorian Theater Magic",
    Q(["Pepper’s Ghost was a Victorian stage illusion that used angled glass to make “ghosts” appear on stage. The audience knew it was a trick — but they loved it anyway!",
       "Why were audiences willing to “believe” a stage ghost but upset about fake spirit photographs?"], 3)),
  T(4, "Compare: Theater vs. Deception",
    blank_table(["Theater illusion", "Deception/Manipulation"], 4),
    Q("What makes one acceptable and the other harmful?", 3)),
  conn(["Spirit photographers used the same “double exposure” technique that stage magicians used. But stage audiences knew it was a trick, while grieving families thought they were seeing real ghosts of their loved ones."],
       "The technology was the same. What was different?", 2),
  ("family", ["Watch a movie with your family and identify moments where you “suspend disbelief.” Discuss: Why are we willing to go along with these illusions?"]),
  ], css="table.fill td { height: 46pt; } table.fill.blankrows td { height: 30pt; }")

TH_RED = th_handout("red", "Student Handout_ The Art of Illusion - Red Level (Theater 5-8).pdf", [
  T(1, "The Ethics of Illusion", body=[
    "Theater, magic shows, and movies all create illusions — but so do con artists, propagandists, and manipulators. The same techniques can be used for entertainment OR deception. What makes the difference?",
    "**Key Question:** Is it the technique that’s ethical or unethical, or is it the context and consent?"]),
  T(2, "Design a Theatrical Illusion",
    P("Create a plan for a theatrical illusion that could be performed on stage. Describe:"),
    Q("The illusion (what the audience sees):", 2),
    Q("The technique (how it actually works):", 2),
    P("Theatrical elements that enhance the illusion:"),
    field("Lighting:", "Sound:", "Staging:")),
  T(3, "The Consent Question",
    P("Analyze these scenarios. For each, explain whether the illusion is ethical or problematic:"),
    ("html", '<div class="grid2">'),
    Q("1. A stage magician makes an audience member “levitate.”", 2),
    Q("2. A photo editor removes a person from a historical photograph.", 2),
    Q("3. A movie uses CGI to show a city being destroyed.", 2),
    Q("4. A deepfake video shows a politician saying something they never said.", 2),
    ("html", "</div>"),
    Q("What criteria did you use to decide which were ethical vs. problematic?", 2)),
  T(4, "Critical Analysis",
    Q("Victorian spirit photographers and stage magicians used the SAME double-exposure technique. Why was one considered entertainment and the other fraud?", 2),
    Q("In modern media, where is the line between “theatrical storytelling” and “manipulation”?", 2)),
  conn(["The Mini Museum contains both entertainment illusions (stereoscopes, transformation cards) and deceptive illusions (spirit photographs). The technology overlaps significantly."],
       "**Research:** How did Victorian audiences distinguish between “acceptable” stage illusions and “unacceptable” spirit photography fraud?", 2,
       label="Mini Museum deep dive"),
  ("family", ["Present your theatrical illusion design to your family. Discuss: When do illusions become deception? What role does consent play?"]),
  ], css="body.student { --line: 21pt; }")

# ═════════════════════════════════════════════════════════════════════════
# MUSIC · Sound Illusions
# ═════════════════════════════════════════════════════════════════════════

M = "teachers/grades-5-8/music/"
M_HERO = {"img": SEE + "waves.jpg", "pos": "center 40%"}

M_VERSIONS = ["**Version 1:** Happy, upbeat music", "**Version 2:** Tense, minor-key music"]
M_SAY = "*“How did the music change what you felt about this scene? The visuals were identical — only the sound changed. Filmmakers, advertisers, and game designers use this technique constantly.”*"
M_DISCUSS = "**Discuss:** How do horror movies use sound? How do commercials use music? How do video games use audio cues?"
M_ELEMENTS = ["**Tempo:** Fast = excitement/anxiety; Slow = calm/sadness",
              "**Mode:** Major = happy/triumphant; Minor = sad/scary",
              "**Dynamics:** Sudden loud = surprise/fear; Quiet = tension/intimacy",
              "**Instrumentation:** Strings = emotion; Brass = power; Synth = futuristic/unsettling"]
M_KNOW = "*“Once you know these tricks, you can recognize when someone is trying to manipulate your emotions through sound — and you can make conscious choices about how to respond.”*"

M_LP = lesson("Music", M + "Music Lesson Plan_ Sound Illusions (Grades 5-8) - Teacher Guide.pdf",
  "Sound Illusions", "When Your Ears Deceive You · Grades 5–8 · Music · 30 minutes", M_HERO,
  "Students explore auditory illusions and how composers, advertisers, and media creators use sound to manipulate perception and emotion — connecting to the Mini Museum theme that our senses can be deceived.",
  [
  timing(("Hook", 5), ("Illusions", 8), ("Emotion", 10), ("Elements", 5), ("Close", 2)),
  ("section", {"label": "Learning objective", "body": [
    "Students will experience auditory illusions firsthand, analyze how music and sound manipulate emotions, and connect sound deception to visual deception explored in the Mini Museum exhibition."]}),
  ("cols", [
    [("section", {"label": "Standards alignment", "list": [
      "**NAfME MU:Re7.2:** Analyze how the structure and context of varied musical works inform the response.",
      "**NAfME MU:Re8.1:** Support interpretations of musical works citing evidence from the elements of music.",
      "**TEKS §117.211:** Evaluate music using critical listening skills."]})],
    [("section", {"label": "Materials needed", "list": [
      "Audio clips: Shepard Tone, McGurk Effect video, Yanny/Laurel clip",
      "Two versions of same scene with different music (happy vs. scary)",
      "Speakers or headphones for clear audio playback",
      "Optional: Mini Museum stereoscope for visual/audio comparison"]})]]),
  ("section", {"label": "Hook · 5 minutes", "title": "The Endless Staircase of Sound",
    "screen": {"phase": "Hook", "show": "question",
               "question": "Listen to this sound. What do you notice? Does it seem to go up… and up… and up?",
               "purpose": "Ears can be fooled just as eyes can.",
               "students": ["Listen."]},
    "body": [
    "Play the Shepard Tone (an auditory illusion that seems to rise forever).",
    "*“Listen to this sound. What do you notice? Does it seem to go up… and up… and up? But here’s the trick — it’s actually looping. Your ears are being fooled, just like your eyes can be fooled by optical illusions. Today we’re going to explore how sound can deceive us.”*"]}),
  ("section", {"label": "Auditory illusions · 8 minutes",
    "screen": [
      {"phase": "Illusions", "minutes": 4, "script": [0], "title": "Yanny or Laurel?", "show": "question",
       "question": "Yanny or Laurel?",
       "purpose": "One clip, two answers: the brain decides what it hears.",
       "students": ["Vote!"]},
      {"phase": "Illusions", "minutes": 4, "script": [1, 2], "title": "McGurk Effect", "show": "question",
       "question": "Your brain doesn’t just passively receive sound — it actively interprets it.",
       "purpose": "What we see changes what we hear.",
       "students": ["What do you hear?"]}],
    "body": [
    "**Illusion 1: Yanny or Laurel?** Play the famous clip. Have students vote. Reveal that the same sound can be heard differently based on which frequencies your brain focuses on.",
    "**Illusion 2: McGurk Effect** (if video available). Show how what we SEE changes what we HEAR — demonstrating that our senses work together and can be fooled together.",
    "*“Your brain doesn’t just passively receive sound — it actively interprets it. And that interpretation can be manipulated.”*"]}),
  ("section", {"label": "Music and emotion manipulation · 10 minutes",
    "screen": [
      {"phase": "Emotion", "minutes": 5, "script": [0, 1, 2, M_SAY], "title": "Same scene, different music", "show": "question",
       "question": "How did the music change what you felt about this scene?",
       "purpose": "The visuals stay the same; only the sound changes.",
       "students": M_VERSIONS},
      {"phase": "Emotion", "minutes": 5, "script": [M_DISCUSS], "title": "Discuss", "show": "question",
       "question": M_DISCUSS.split(":** ", 1)[1],
       "purpose": "Find the same technique in films, ads and games.",
       "students": ["Discuss with your class."]}],
    "body": [
    "Show the same neutral video clip twice with different background music:"], "list": M_VERSIONS}),
  P(M_SAY, M_DISCUSS),
  ("section", {"label": "Musical elements of manipulation · 5 minutes",
    "screen": {"phase": "Elements", "script": [0, 1, 2, 3, 4, M_KNOW], "show": "chart",
               "caption": "How music manipulates", "columns": ["Element", "Effect"],
               "rows": [{"cells": [x.split(":** ")[0].strip("*"), x.split(":** ")[1]]} for x in M_ELEMENTS],
               "purpose": "Four elements to listen for, so students can recognize them.",
               "students": ["Which did you hear in the clip?"]},
    "body": [
    "Quick analysis of HOW music manipulates:"], "list": M_ELEMENTS}),
  P(M_KNOW),
  ("section", {"label": "Closing · 2 minutes", "title": "The Aware Listener",
    "screen": {"phase": "Close", "show": "question",
               "question": "But now you know — and knowing is the first step to not being manipulated.",
               "purpose": "Ears, like eyes, can be tricked; knowing is the first defence.",
               "students": ["Name one way you’ll listen more critically to music in media this week."]},
    "body": [
    "*“Just like the Mini Museum shows us that our eyes can be tricked by photographs and illusions, today we learned that our ears can be tricked too. The Victorians were fooled by spirit photographs because the technology was new. We can be fooled by sound design because we don’t always notice it. But now you know — and knowing is the first step to not being manipulated.”*"]}),
  ("cols", [[("connection", [
    "**Option 1 — Visit:** The stereoscope creates a 3D illusion for the eyes, just as binaural audio creates spatial illusions for the ears. Spirit photography manipulated visual trust; film scores manipulate emotional trust.",
    "**Option 2 — Virtual:** Explore the exhibition online."])],
   [("section", {"label": "Assessment", "list": [
    "**Discussion:** Can students identify specific musical elements used to manipulate emotion?",
    "**Application:** Can students explain how the same technique (sensory manipulation) applies to both visual and auditory media?",
    "**Exit ticket:** “Name one way you’ll listen more critically to music in media this week.”"]})]]),
  ("section", {"label": "Differentiated student handouts"}),
  ("levels", {"green": "Guided listening with emotion identification, musical element matching",
              "yellow": "Analyze two contrasting pieces, explain manipulation techniques",
              "red": "Create a “sound manipulation guide,” analyze real advertisement audio"}),
  ("section", {"label": "Extension activities", "list": [
    "Students compose two versions of the same melody (happy vs. sad) using learned techniques",
    "Analyze the soundtrack of a movie trailer: what emotions are being manufactured?",
    "Research: How did Victorian music halls use sound effects to enhance magic shows?"]}),
  ])

M_LP["slug"] = "sound-illusions"

def m_handout(level, out, blocks):
    return handout("Music", level, M + out, "Sound Illusions", "Grades 5–8 · Music", M_HERO, blocks)

FEEL = ["Happy", "Sad", "Scared", "Excited", "Calm"]

M_GREEN = m_handout("green", "Student Handout_ Sound Illusions - Green Level (Music 5-8).pdf", [
  T(1, "Your Ears Can Be Tricked!", body=[
    "Just like optical illusions trick your eyes, auditory illusions trick your ears. Your brain interprets sounds — and sometimes it gets it wrong!",
    "**Big Idea:** Music and sound can be used to manipulate how we feel. Once we know the tricks, we can listen more carefully!"]),
  T(2, "Listening Activity", circle([("Clip 1:", FEEL), ("Clip 2:", FEEL), ("Clip 3:", FEEL)],
    "Listen to each clip your teacher plays. How does it make you feel? Circle your answer:")),
  T(3, "Musical Elements Match-Up",
    P("Draw a line to match the musical element to the feeling it usually creates:"),
    match(["Fast tempo", "Slow tempo", "Major key (happy chords)", "Minor key (sad chords)"],
          ["Sad, gloomy", "Excitement, energy", "Calm, peaceful", "Joy, triumph"])),
  T(4, "Same Scene, Different Music",
    P("Your teacher showed the same video with two different soundtracks."),
    Q("**Version 1 (happy music):** How did it make you feel?", 7),
    Q("**Version 2 (scary music):** How did it make you feel?", 7),
    circle([("What changed? (Circle one)", ["The video changed", "Only the music changed"])])),
  conn(["The Mini Museum shows how our EYES can be tricked by old photographs and illusions. Today we learned that our EARS can be tricked too! Both use the same idea: our brains can be fooled."]),
  ("family", ["Watch a movie trailer or commercial with your family. Pay attention to the music. Ask: “How is this music trying to make us feel?”"]),
  ])

M_YELLOW = m_handout("yellow", "Student Handout_ Sound Illusions - Yellow Level (Music 5-8).pdf", [
  T(1, "The Science of Sound Manipulation", body=[
    "Composers and media creators use specific musical elements to manipulate emotions. Understanding these techniques helps you become a critical listener.",
    "**Key Concept:** Music doesn’t just accompany media — it actively shapes how we interpret and feel about what we see and hear."]),
  T(2, "Musical Elements Analysis",
    P("For each element, explain how it affects the listener:"),
    ("table", {"head": ["Element", "When it’s high / fast / major", "When it’s low / slow / minor"], "rows": [
      ["Tempo", "", ""], ["Mode (Major/Minor)", "", ""], ["Dynamics (Volume)", "", ""], ["Pitch/Register", "", ""]]})),
  T(3, "Analyze Two Pieces",
    P("Listen to the two clips your teacher plays. Identify the techniques used:"),
    field("Clip A: What emotion does this create?"),
    Q("What musical elements create this feeling?", 2),
    field("Clip B: What emotion does this create?"),
    Q("What musical elements create this feeling?", 2)),
  T(4, "Same Scene, Different Music",
    P("How did the two different soundtracks change your perception of the same video?"),
    Q("**With happy/upbeat music:**", 2),
    Q("**With tense/scary music:**", 2),
    Q("What does this teach us about how media manipulates our emotions?", 3)),
  conn(["Spirit photographers manipulated visual trust by exploiting new technology. Film composers manipulate emotional trust using ancient musical principles. Both rely on the same thing: we don’t always notice HOW we’re being influenced."],
       "How is sound manipulation similar to visual manipulation?", 3),
  ("family", ["Watch a movie or show with your family. Identify ONE scene where the music strongly influences how you feel. Explain to your family what techniques are being used."]),
  ])

M_RED = m_handout("red", "Student Handout_ Sound Illusions - Red Level (Music 5-8).pdf", [
  T(1, "The Psychology of Sound Manipulation", body=[
    "Sound designers, composers, and advertisers use sophisticated techniques to bypass our rational thinking and directly influence our emotions. Understanding these techniques is essential media literacy."]),
  T(2, "Advertisement Analysis",
    P("Choose a TV commercial, movie trailer, or video game trailer to analyze. Answer:"),
    field("Media analyzed:"),
    Q("What product/content is being sold?", 1),
    Q("What emotions is the soundtrack trying to create?", 2),
    P("Identify specific musical techniques used:"),
    ("html", '<div class="grid2">'), field("Tempo:", "Mode (major/minor):"), field("Dynamics:", "Instrumentation:"), ("html", "</div>"),
    Q("How does the music support the persuasive goal of the advertisement?", 2)),
  T(3, "Create a Sound Manipulation Guide",
    P("Design a guide teaching others how to recognize emotional manipulation in media sound. Include:"),
    ("html", "<ul><li>At least 4 specific techniques and what emotions they create</li><li>Examples from real media (movies, games, commercials)</li><li>Tips for listening critically</li></ul>"),
    ("html", '<div class="grid2">'), Q("**Technique 1:**", 2), Q("**Technique 2:**", 2), Q("**Technique 3:**", 2), Q("**Technique 4:**", 2), ("html", "</div>"),
    Q("**Critical Listening Tips:**", 2)),
  T(4, "Critical Questions",
    Q("Is emotional manipulation through music ethical? When does it cross a line?", 2),
    Q("How is sound manipulation similar to the visual manipulation shown in the Mini Museum? How is it different?", 2)),
  conn(["Victorian magic shows used sound effects to enhance visual illusions — footsteps, thunder, ghostly moans. The manipulation of multiple senses made tricks more convincing."],
       "**Research:** How do modern films combine visual and audio manipulation to create emotional responses?", 2,
       label="Mini Museum deep dive"),
  ("family", ["Present your Sound Manipulation Guide to your family. Then watch something together and identify the techniques in real-time."]),
  ])
M_RED["css"] += "body.student { --line: 21pt; } .grid2 > .field { grid-column: span 1; }"

DOCS = [R_LP, R_GREEN, R_YELLOW, R_RED,
        S_LP, S_GREEN, S_YELLOW, S_RED,
        TH_LP, TH_GREEN, TH_YELLOW, TH_RED,
        M_LP, M_GREEN, M_YELLOW, M_RED]
