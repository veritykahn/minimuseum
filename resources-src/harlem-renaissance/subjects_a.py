"""Harlem Renaissance · Grades 5–8 · Science, ELA and Social Studies.
The existing lesson plans and Green / Yellow / Red handouts, re-set in the
branded design with their own words (see CONVERTING.md)."""
import html as _html, re as _re
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _screen import photo, instrument

D = "teachers/grades-5-8/"

# "screen" on a section is for the site's Lesson mode only (resources-src/
# export_lessons.py); build.py ignores it, so the PDF is unchanged.
def screened(block, screen):
    """A shared section (the work time, the closing) with this plan's screen."""
    kind, d = block
    return (kind, {**d, "screen": screen})

CHOOSE = ["Choose Green, Yellow or Red. You can switch at any time."]
LV = {"green": "#4A7346", "yellow": "#86671A", "red": "#A8452F"}

# ── small helpers (the build's own blocks do the rest) ─────────────────
def md(t):
    t = _html.escape(t, quote=False).replace("\n", "<br>")
    t = _re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = _re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    return t.replace("minimuseumproject.org/exhibitions/harlem-renaissance",
                     '<span style="white-space:nowrap">minimuseumproject.org/exhibitions/harlem-renaissance</span>')

def conn(ps):
    """The Mini Museum connection box; the address is written in the copy."""
    return ("html", '<aside class="conn"><p class="label">Mini Museum connection</p>'
                    + "".join(f"<p>{md(p)}</p>" for p in ps) + "</aside>")

def family(ps):
    return ("html", '<aside class="family"><p class="label">Share with your family</p>'
                    + "".join(f"<p>{md(p)}</p>" for p in ps) + "</aside>")

def P(*ps):
    return ("html", "".join(f"<p>{md(p)}</p>" for p in ps))

def lines(n):
    return ("html", '<div class="write">' + "<i></i>" * n + "</div>")

def field(label, n):
    """A bold prompt over its own writing lines."""
    return ("html", f'<p class="fld">{md(label)}</p><div class="write">' + "<i></i>" * n + "</div>")

def fillin(*items):
    """Sentences with a blank: '___' marks where the blank goes."""
    out = ""
    for t in items:
        a, _, b = t.partition("___")
        out += f'<p class="fillin">{md(a)}<span class="blank"></span>{md(b)}</p>'
    return ("html", out)

def act(n, label, title, *items, keep=False):
    """An activity, numbered as the build numbers a task, keeping the
       original's 'Activity' wording. Items are blocks or paragraphs."""
    k = " keep" if keep else ""
    out = [("html", f'<section class="task numbered{k}"><span class="pnum">{n:02d}</span><div>'
                    f'<p class="label">Activity {n} · {md(label)}</p><h3>{md(title)}</h3>')]
    for it in items:
        out.append(P(it) if isinstance(it, str) else it)
    out.append(("html", "</div></section>"))
    return out

def table(head, rows, cls="", h=None):
    th = "".join(f"<th>{md(x)}</th>" for x in head)
    st = f' style="height:{h}pt"' if h else ""
    tr = "".join("<tr>" + "".join(f"<td{st}>{md(c)}</td>" for c in r) + "</tr>" for r in rows)
    return ("html", f'<table class="fill {cls}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>')

def match(left, right, box=False):
    """Two columns to join: a dot after each left item, before each right one."""
    b = '<span class="mbox"></span>' if box else ""
    L = "".join(f'<p>{b}<span class="mt">{md(x)}</span><span class="dot"></span></p>' for x in left)
    R = "".join(f'<p><span class="dot"></span><span>{md(x)}</span></p>' for x in right)
    return ("html", f'<div class="match"><div class="ml">{L}</div><div class="mr">{R}</div></div>')

def fields2(*cells):
    """Prompts with writing lines, two across: (label, lines) pairs."""
    h = "".join(f'<div><p class="fld">{md(l)}</p><div class="write">' + "<i></i>" * n + "</div></div>" for l, n in cells)
    return ("html", f'<div class="grid2">{h}</div>')

def callout(label, text, level, n=0):
    w = '<div class="write">' + "<i></i>" * n + "</div>" if n else ""
    return ("html", f'<aside class="callout" style="--lv:{LV[level]}"><p>{md("**" + label + "** " + text)}</p>{w}</aside>')

CSS = """
.conn .url { display: none; }
.task.numbered + .task.numbered { margin-top: 2pt; }
.fld { font-weight: 500; margin: 7pt 0 0; break-after: avoid; }
.fillin { margin: 7pt 0 4pt; }
.blank { display: inline-block; width: 120pt; border-bottom: .8pt solid #8d8a80; margin: 0 5pt; height: 1.1em; vertical-align: baseline; }
.match { display: grid; grid-template-columns: 1fr 1fr; gap: 0 70pt; margin: 6pt 0 10pt; break-inside: avoid; }
.match p { display: flex; align-items: center; gap: 8pt; margin: 0; min-height: 27pt; }
.ml p { justify-content: space-between; }
.ml .mt { flex: 1; font: 600 12pt 'Cormorant Garamond', serif; }
.dot { width: 6pt; height: 6pt; border-radius: 50%; background: #1d1c1a; flex: none; }
.mbox { width: 20pt; height: 18pt; border: .8pt solid #8d8a80; border-radius: 3pt; background: rgba(255,255,255,.6); flex: none; }
.callout { border-left: 3pt solid var(--lv); background: rgba(255,255,255,.62); padding: 7pt 11pt 4pt; margin: 6pt 0 9pt; break-inside: avoid; }
.callout b { font-weight: 500; }
.adult .callout { background: #f6f1e4; }
.chain { margin: 6pt 0 10pt; break-inside: avoid; }
.chain .cb { border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 7pt 11pt; background: rgba(255,255,255,.62); }
.chain .cb.fixed { font-weight: 500; background: rgba(255,255,255,.85); }
.chain .cb .write { margin-top: 0; }
.chain .ar { text-align: center; font: 400 12pt/1 'Outfit'; margin: 2pt 0; }
.chain .cb { padding: 5pt 11pt; }
.chain .ef { display: flex; align-items: flex-end; gap: 8pt; padding-top: 18pt; }
.chain .ef span { flex: 1; border-bottom: .8pt solid #a9a69b; }
table.fill td:first-child { width: auto; }
table.fill.first td:first-child { width: 26%; font-weight: 400; }
.drawpair { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
.drawpair .drawbox { height: 105pt; }
.conn { margin-top: 10pt; }
table.fill td + td, table.fill th + th { border-left: .6pt solid #c8c5bb; padding-left: 7pt; }
.note { font-size: 9pt; color: #3f3e3a; }
.task.keep { break-inside: avoid; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16pt; break-inside: avoid; }
.adult .sec { break-inside: auto; orphans: 3; widows: 3; }
.sec .label, .sec h3 { break-after: avoid; }
.hero h1 { font-size: 30pt; }
"""

CONN_FULL = ["**Option 1 — Visit the exhibition:** If the Harlem Renaissance exhibition is available at your school, visit the Mini Museum to experience the phonograph, Jazz Lab, Great Migration Map, and more. Ask your librarian to arrange a class visit.",
             "**Option 2 — Virtual visit:** Explore the full exhibition at **minimuseumproject.org/exhibitions/harlem-renaissance**"]
CONN_SHORT = [CONN_FULL[0], "**Option 2 — Virtual visit:** **minimuseumproject.org/exhibitions/harlem-renaissance**"]

CTX_GREEN = ["The Harlem Renaissance (c. 1920–1935) was an extraordinary flowering of Black music, literature, and art in Harlem, New York. It grew from the Great Migration — when over one million Black Americans moved north to escape Jim Crow laws and find better lives. The artists, musicians, and writers who gathered in Harlem changed American culture forever."]
CTX_YELLOW = ["The Harlem Renaissance (c. 1920–1935) produced extraordinary work in music, literature, and visual art. It grew from the Great Migration, when over one million Black Americans moved north, concentrating artistic talent in Harlem in a way that had never existed before — and creating the conditions for a cultural explosion that permanently changed American identity."]
CTX_RED = ["**Challenge context:** The Harlem Renaissance was one of the most significant cultural events in American history — and one of the least understood. It was not simply a celebration of Black talent; it was a deliberate, sophisticated, and sometimes contested attempt to use cultural achievement as a tool for social and political change. The figures who made it were artists AND activists, creators AND strategists."]

LEVELS_GENERIC = ("levels", {
    "green": "Scaffolded activities with vocabulary support and structured response frames. Students engage with core content with guidance.",
    "yellow": "Independent grade-level analysis. Students apply concepts, make connections, and express their own thinking without heavy scaffolding.",
    "red": "Extended critical thinking and research. Students synthesize across sources, evaluate arguments, and produce original analysis or creative work."})
NOTE_RED = P("**Note:** Red level activities may extend beyond the lesson period — they are designed to continue at home.")
CLOSE_LINE = "ordinary people — with talent, community, and courage — can create something that changes the world."
CLOSING_GENERIC = ("section", {"label": "Closing · 5 minutes", "body": [
    "Bring the class back together. Ask 2–3 students from different levels to share one thing they discovered or created. Close with:",
    f"*“The Harlem Renaissance wasn’t just a historical event. It was a demonstration that {CLOSE_LINE} The work you’ve done today connects you to that tradition.”*"]})

def closing(subject):
    """The shared closing, with the plan's own exit ticket as the task."""
    return screened(CLOSING_GENERIC, {
        "phase": "Closing", "show": "words", "title": "Closing", "text": CLOSE_LINE[0].upper() + CLOSE_LINE[1:],
        "purpose": "Share across the levels, and connect today’s work to the tradition.",
        "students": ["Share one thing you discovered or created.",
                     f"Exit ticket: *What is one connection between the Harlem Renaissance and {subject}?*"]})

def worktime(purpose):
    return screened(WORKTIME, {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                               "purpose": purpose, "students": CHOOSE})
WORKTIME = ("section", {"label": "Activity · 15 minutes", "title": "Differentiated work time",
    "body": ["Distribute student handouts. Students self-select their challenge level. Circulate with targeted questions to push thinking at each level."]})

def timing(closing=5):
    return ("timing", [("Hook", 5, "#7D8471"), ("Teach", 10, "#2F4A5A"), ("Activity", 15, "#6A3F88"), ("Closing", closing, "#A8452F")])

def lesson(subj, key, folder, title, hero, blocks, name=None):
    name = name or subj
    return {"out": f"{D}{folder}/HR_LP_{key}_5_8.pdf", "eyebrow": "Teacher lesson plan", "title": title,
            "sub": f"Grades 5–8 · {name}", "foot": f"Lesson Plan · {name} 5–8",
            "hero": hero, "css": CSS, "blocks": blocks}

def handout(level, subj, key, folder, title, hero, context, blocks, css="", name=None):
    name = name or subj
    return {"out": f"{D}{folder}/HR_Handout_{level.title()}_{key}_5_8.pdf", "eyebrow": "Student handout",
            "title": title, "sub": f"Grades 5–8 · {name}", "level": level, "context": context,
            "foot": f"{name} 5–8 · {level.title()} Level Handout",
            "hero": hero, "css": CSS + css, "blocks": blocks}

def flat(*parts):
    out = []
    for p in parts:
        out.extend(p if isinstance(p, list) else [p])
    return out

# ══ SCIENCE ═════════════════════════════════════════════════════════════
SCI_HERO = {"img": "/exhibitions/harlem/images/migration/chicago.jpg", "pos": "center 30%"}
SCI_T = "The Science of Sound"

SCI_HOOK_Q = "What is sound, actually? What’s physically happening when you hear music?"
# the plan's waves, as a table to read from
SCI_WAVES = [["High notes", "vibrate faster (high frequency)"], ["Low notes", "vibrate slower (low frequency)"],
             ["Loud sounds", "have bigger waves (high amplitude)"], ["Soft sounds", "have smaller waves"]]
SCI_TIMBRE = "The timbre — the unique color of each instrument — comes from its overtones."

SCI_LP = lesson("Science", "SCIENCE", "science", "Rhythm, Sound & the Science of Music", SCI_HERO, [
    timing(),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will understand the physics of sound — frequency, amplitude, and resonance — through the lens of jazz and blues instruments. They will connect the science of how instruments produce sound to why different instruments have distinct timbres, and explore how the human ear and brain process music."]}),
    ("section", {"label": "Standards alignment"}),
    ("refs", [("NGSS MS-PS4-1", "Use mathematical representations to describe waves — including wave frequency, amplitude, and wavelength"),
              ("NGSS MS-PS4-2", "Develop and use a model to describe how waves transfer energy"),
              ("CCSS.ELA-LITERACY RI.6.7", "Integrate information presented in different media formats including visual, quantitative, and oral")]),
    ("section", {"label": "Materials needed", "list": [
      "Device to play audio clips of individual instruments (trumpet, saxophone, double bass, piano, drums)",
      "Rulers or string for simple wave demonstrations",
      "Differentiated student handouts",
      "Optional: tuning fork to demonstrate vibration"]}),
    ("section", {"label": "Hook · 5 minutes",
      "screen": {"phase": "Hook", "show": "listen", "title": "What is sound?", "question": SCI_HOOK_Q,
                 "clips": [instrument("Trumpet", "trumpet-1.mp3"), instrument("Double bass", "double-bass-1.mp3"),
                           instrument("Piano", "piano-1.mp3")],
                 "purpose": "Turn listening into a physics question.",
                 "students": ["Listen to each instrument for 10 seconds.", "What’s physically different between them?"]},
      "body": [f"Hold up a tuning fork (or tap a glass). Ask: *“{SCI_HOOK_Q}”* Take responses. Then play 10 seconds each of a trumpet, a bass, and a piano from the Jazz Lab — ask students what’s physically different between them."]}),
    ("section", {"label": "Direct instruction · 10 minutes",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Every sound is a wave", "show": "chart",
         "caption": "Every sound you hear is a wave — a vibration moving through air", "columns": ["Sound", "Wave"],
         "rows": [{"cells": r} for r in SCI_WAVES],
         "purpose": "Name the two properties of a wave: frequency and amplitude.",
         "students": ["Every sound you hear is a wave — a vibration moving through air.", "Which is high frequency? Which is high amplitude?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Timbre", "show": "words", "text": SCI_TIMBRE,
         "purpose": "Explain why two instruments on the same note sound different.",
         "students": ["Why do a trumpet and a piano playing middle C sound different?"]}],
      "body": ["*“Every sound you hear is a wave — a vibration moving through air. "
               + " ".join(f"{a} {b}." for a, b in SCI_WAVES)
               + " When Duke Ellington’s band played in Harlem in 1927, every instrument in that room was creating its own unique wave pattern — and your ears were doing the extraordinary work of separating them all out.”*",
               f"*“{SCI_TIMBRE} A trumpet playing middle C and a piano playing middle C produce the same fundamental frequency. But the trumpet has different overtone patterns from the piano, which is why they sound completely different. Jazz composers like Ellington understood this intuitively — he wrote specific parts for specific instruments because he knew exactly what wave patterns each one produced.”*"]}),
    worktime("Apply the physics of sound to jazz instruments at the right level of challenge."),
    LEVELS_GENERIC, NOTE_RED, closing("Science"),
    ("section", {"label": "Assessment", "body": [
      "**Formative:** Circulate during work time and check for understanding of the core concepts. Use targeted questions to assess depth of thinking.",
      "**Exit ticket:** *“What is one connection between the Harlem Renaissance and Science?”*"]}),
    conn(CONN_FULL),
])

SCI_G = handout("green", "Science", "SCIENCE", "science", SCI_T, SCI_HERO, CTX_GREEN, flat(
    act(1, "Label the sound wave", "Parts of a Wave",
        "Draw and label a sound wave in the box below. Use the word bank to label the parts:",
        ("chips", ["Crest", "Trough", "Wavelength", "Amplitude"]),
        ("draw", "Draw your labeled sound wave here"),
        fillin("A **high note** has a ___ frequency (high / low).", "A **loud sound** has a ___ amplitude (high / low).")),
    act(2, "Instrument match", "High, Low, or In Between?", keep=True, *[
        "Draw a line from each instrument to its typical range:",
        match(["Double Bass", "Trumpet", "Saxophone", "Piano"],
              ["Plays all ranges", "Low frequencies", "Mid-high frequencies", "High frequencies"])]),
    act(3, "The Jazz Lab", "Listen and Identify",
        "In the Jazz Lab’s **Name That Instrument** quiz, you will hear isolated instrument sounds. For each one, record:",
        table(["Instrument heard", "High / Mid / Low", "Loud / Soft"], [["", "", ""]] * 7, h=30)),
    conn(CONN_FULL),
    family(["Tap a glass of water and then slowly add more water. What happens to the sound? Explain to your family why, using what you know about sound waves."]),
), ".drawbox { height: 210pt; }")

SCI_Y = handout("yellow", "Science", "SCIENCE", "science", SCI_T, SCI_HERO, CTX_YELLOW, flat(
    act(1, "The physics of jazz instruments", "How Do They Make Sound?",
        "Complete the table explaining the physics of each jazz instrument:",
        table(["Instrument", "How sound is produced", "How pitch is changed", "Frequency range"],
              [["**Trumpet**", "", "", ""], ["**Saxophone**", "", "", ""], ["**Double Bass**", "", "", ""],
               ["**Piano**", "", "", ""], ["**Drums**", "", "", ""]], "first", h=58)),
    act(2, "Analyze the sound wave", "Drawing Waves", keep=True, *[
        "In the boxes below, draw what a sound wave would look like for each scenario:",
        ("html", '<div class="drawpair"><div><p class="fld">A HIGH, LOUD note (trumpet)</p><div class="drawbox"><span>Draw wave</span></div></div>'
                 '<div><p class="fld">A LOW, SOFT note (bass)</p><div class="drawbox"><span>Draw wave</span></div></div></div>')]),
    act(3, "Timbre and overtones", "Why Does a Trumpet Sound Like a Trumpet?",
        "Two instruments playing the same note produce the same fundamental frequency — but sound completely different. This is called **timbre**, and it comes from **overtones** (higher frequency vibrations produced alongside the main note).",
        field("Explain in your own words why a trumpet and a piano playing middle C sound different:", 3),
        P("If you were Ellington choosing instruments for a new composition, which instrument would you choose for each role below, and why?"),
        fields2(("The “voice” of the piece (melodic lead):", 3), ("The heartbeat (rhythm foundation):", 3))),
    conn(CONN_FULL),
    family(["Find two versions of the same song — one on piano and one on trumpet or saxophone. Play them for your family and explain why they sound different using the concept of timbre and overtones."]),
))

SCI_R = handout("red", "Science", "SCIENCE", "science", SCI_T, SCI_HERO, CTX_RED, flat(
    act(1, "The physics of improvisation", "Jazz as Applied Wave Science",
        "Jazz improvisation — playing spontaneously within a harmonic structure — requires instant, intuitive understanding of frequency relationships. Musicians work within keys (sets of related frequencies) and chord progressions (sequences of simultaneous frequencies that create consonance or dissonance).",
        "**Research and explain:** What is the relationship between musical consonance and the frequency ratios of notes? Why do some combinations of frequencies sound “good” together while others create tension?",
        lines(5)),
    act(2, "Design an experiment", "Testing Frequency Perception",
        "Design a scientific experiment to test one of the following questions. Include hypothesis, method, variables, and how you would measure results:",
        ("chips", ["Does tempo affect emotional response to music?", "Can people identify instruments by frequency range alone?",
                   "How does amplitude affect perceived distance of a sound?"]),
        fields2(("Question I chose:", 2), ("Hypothesis:", 2), ("Method (brief):", 3),
                ("Variables (independent / dependent / controlled):", 3))),
    act(3, "The neuroscience of music", "Why Does Music Move Us?",
        "Music activates multiple brain regions simultaneously — auditory cortex, limbic system (emotion), motor cortex (movement), and prefrontal cortex (expectation and prediction). Jazz improvisation, in particular, deactivates the dorsolateral prefrontal cortex (associated with self-monitoring) and activates the medial prefrontal cortex (associated with self-expression).",
        "What does this neuroscience suggest about why jazz improvisation feels different from reading from sheet music? What might this tell us about creativity more broadly?",
        lines(3)),
    callout("Critical question:", "The Harlem Renaissance musicians were working intuitively with principles of physics and neuroscience they had no formal training in. What does this suggest about the relationship between scientific knowledge and artistic mastery?", "red", 2),
    ("cols", [[conn(CONN_FULL)], [callout("Research extension:", "Investigate “absolute pitch” (perfect pitch) — the ability to identify a musical note without a reference tone. What percentage of people have it? Is it genetic? Is it more common in people who learned music before age 7? Present your findings.", "red")]]),
), ".chips span { text-transform: none; letter-spacing: 0; font-size: 8pt; padding: 3pt 7pt; } .cols .callout { margin-top: 4pt; } .cols .conn { margin-top: 4pt; } .cols .conn span { white-space: normal !important; }")

# ══ ELA ═════════════════════════════════════════════════════════════════
ELA_HERO = {"img": "/exhibitions/harlem/images/migration/harlem.jpg", "pos": "center 40%"}
ELA_T = "Reading the Renaissance"

ELA_HOOK_Q = "What does your voice sound like on paper?"
ELA_HOOK_ASK = "Does your writing sound like YOU, or does it sound like how you think you’re supposed to write?"
# who wrote in their own voice, and how, in the plan's own words
ELA_VOICES = [["Langston Hughes", "wrote poetry that used the rhythms of jazz and blues"],
              ["Zora Neale Hurston", "captured the dialect of Black Southern speech in her novels"]]
ELA_EVIDENCE = "Every poem published, every novel reviewed in major newspapers, every prize won was evidence that the dominant narrative was wrong."

ELA_LP = lesson("ELA", "ELA", "ela", "Voice & Verse", ELA_HERO, [
    timing(),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will analyze the literary techniques of Harlem Renaissance writers, understand how writers used their craft as both art and activism, evaluate primary source texts as historical evidence, and develop their own voice in response to Renaissance themes."]}),
    ("section", {"label": "Standards alignment"}),
    ("refs", [("CCSS.ELA-LITERACY RI.6.8 / RI.7.8", "Trace and evaluate arguments; assess credibility and relevance of evidence"),
              ("CCSS.ELA-LITERACY RL.6.4 / RL.7.4", "Determine the meaning of words and phrases including figurative language"),
              ("CCSS.ELA-LITERACY W.7.3", "Write narratives that draw on real or imagined experiences using effective literary technique")]),
    ("section", {"label": "Materials needed", "list": [
      "Student handouts",
      "Access to exhibition’s Harlem in Words poetry workshop",
      "Optional: printed or projected excerpts from public domain Harlem Renaissance texts"]}),
    ("section", {"label": "Hook · 5 minutes",
      "screen": {"phase": "Hook", "show": "question", "title": "Your voice on paper", "question": ELA_HOOK_Q,
                 "purpose": "Ask the question the Harlem Renaissance writers were asking.",
                 "students": ["Write for 90 seconds — anything, no rules.", ELA_HOOK_ASK]},
      "body": [f"Write on the board: *“{ELA_HOOK_Q}”* Ask students to write for 90 seconds — anything, no rules. Then ask: *“{ELA_HOOK_ASK}”* This is exactly the question Harlem Renaissance writers were asking."]}),
    ("section", {"label": "Direct instruction · 10 minutes",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Their own voices", "show": "chart",
         "caption": "The writers of the Harlem Renaissance would write in their own voices", "columns": ["Writer", "Their own voice"],
         "rows": [{"cells": r} for r in ELA_VOICES],
         "purpose": "See the choice to write in one’s own voice as a literary technique.",
         "students": ["*Our way of speaking is not a deficiency. It is literature.*", "What does each writer bring from speech or music into writing?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Art and activism", "show": "words", "text": ELA_EVIDENCE,
         "purpose": "Read the writing as an argument, as well as art.",
         "students": ["Why was writing beautiful, powerful, innovative literature an act of resistance?"]}],
      "body": ["*“The writers of the Harlem Renaissance made a radical decision: they would write in their own voices. Not the formal English of white academic tradition. Their own rhythms, their own vernacular, their own truth. "
               + " ".join(f"{a} {b}." for a, b in ELA_VOICES)
               + " They were saying: our way of speaking is not a deficiency. It is literature.”*",
               f"*“This was a political act as much as an artistic one. In a country that told Black Americans their culture was inferior, writing beautiful, powerful, innovative literature was an act of resistance. {ELA_EVIDENCE}”*"]}),
    worktime("Analyze the writers’ craft, and find a voice of your own, at the right level of challenge."),
    LEVELS_GENERIC, NOTE_RED, closing("ELA"),
    ("section", {"label": "Assessment", "body": [
      "**Formative:** Circulate during work time and check for understanding of the core concepts. Use targeted questions to assess depth of thinking.",
      "**Exit ticket:** *“What is one connection between the Harlem Renaissance and ELA?”*"]}),
    conn(CONN_FULL),
])
ELA_LP["sub"] = "The Literature of the Harlem Renaissance · Grades 5–8 · ELA"
SCI_LP["slug"] = "rhythm-sound-and-the-science-of-music"
ELA_LP["slug"] = "voice-and-verse"

ELA_G = handout("green", "ELA", "ELA", "ela", ELA_T, ELA_HERO, CTX_GREEN, flat(
    act(1, "Literary terms warm-up", "Tools of the Writer",
        "Match each literary term to its definition:",
        match(["Imagery", "Metaphor", "Onomatopoeia", "Repetition"],
              ["**A** — words that imitate sounds (buzz, crash, whisper)",
               "**B** — language that appeals to the senses (sight, sound, touch)",
               "**C** — saying one thing IS another (life is a jazz song)",
               "**D** — repeating words or phrases for emphasis or rhythm"], box=True)),
    act(2, "Harlem in Words workshop", "Write Your Own Poem",
        "Using the **Harlem in Words** word bank (in the exhibition), choose **6–8 words** from at least 3 different categories and arrange them into a short poem. Your poem does not need to rhyme. Focus on image and feeling.",
        ("chips", ["Dreams", "Nature", "Music", "Emotion", "Action", "Harlem"]),
        fillin("Categories I used: ___")),
    ("section", {"label": "My poem"}),
    ("html", '<p class="fld" style="font-weight:300;font-style:italic">Write your poem here — each line on a new line</p>'),
    lines(14),
    fillin("One literary technique I used: ___", "The feeling I wanted to create: ___"),
    conn(CONN_FULL),
    family(["Read your poem aloud to someone at home. Ask them: *“What feeling did you get from it? What image stayed with you?”*"]),
), ".match { gap: 0 40pt; grid-template-columns: 1fr 1.9fr; } .blank { width: 200pt; }")

ELA_Y = handout("yellow", "ELA", "ELA", "ela", ELA_T, ELA_HERO, CTX_YELLOW, flat(
    act(1, "Literary analysis", "How Writers Build Meaning",
        "Harlem Renaissance writers used specific techniques to make their work both beautiful and politically powerful. Analyze each technique:",
        table(["Technique", "How it creates meaning or effect", "Why it was important in the Harlem Renaissance context"],
              [["**Vernacular dialect**\n*(writing in everyday speech patterns)*", "", ""],
               ["**Jazz/blues rhythms in poetry**\n*(irregular meter, repetition)*", "", ""],
               ["**Specific place names**\n*(125th Street, the Savoy)*", "", ""]], "first", h=86)),
    act(2, "Your own voice", "Write in YOUR Vernacular", keep=True, *[
        "The Harlem Renaissance writers made a radical choice: they wrote in their own voices, not the “correct” formal English they were taught. Write a short paragraph (4–6 sentences) about something that matters to you, deliberately written in your own natural voice — the way you actually think and speak:",
        lines(5)]),
    act(3, "The Harlem in Words workshop", "Craft a Renaissance Poem",
        "Using the exhibition’s word bank, write a poem of at least 8 lines that uses: at least one metaphor, at least one image appealing to a sense other than sight, and deliberate line breaks to create rhythm or emphasis.",
        fields2(("Write your poem here", 8),
                ("Brief artist statement (2–3 sentences): What is your poem about, and what technique choices did you make?", 4))),
    conn(CONN_FULL),
    family(["Share your poem and your artist statement. Ask: *“Can you tell what choices I made and why? Does the poem sound like me?”*"]),
))

ELA_R = handout("red", "ELA", "ELA", "ela", ELA_T, ELA_HERO, CTX_RED, flat(
    act(1, "Literature as activism", "The Political Art of Writing",
        "In the Harlem Renaissance, writing was not merely art — it was argument. W.E.B. Du Bois wrote in *The Crisis* (“Criteria of Negro Art,” 1926): “We want to be Americans, full-fledged Americans, with all the rights of other American citizens.” Alain Locke argued that cultural achievement by Black Americans would force white America to reconsider its racial assumptions.",
        "**Evaluate this strategy:** Was using cultural achievement as a civil rights argument effective? What were its strengths? What were its limitations?",
        lines(5)),
    act(2, "Close reading", "Analyzing the New Negro",
        "Alain Locke’s anthology *The New Negro* (1925) is considered the manifesto of the Harlem Renaissance. Its central argument was that a “New Negro” had emerged — one who would no longer accept the racial stereotypes of the past but would define Black identity through cultural achievement.",
        fields2(("What are the strengths of this argument as a strategy for social change?", 3),
                ("What are its limitations? Who might it have excluded?", 3))),
    act(3, "Your manifesto", "Write What You Believe",
        "The Harlem Renaissance writers wrote manifestos — statements of belief about what their art was for and why it mattered. Write your own short manifesto (8–12 sentences) about your own creative voice: What do you want to say? Who are you writing for? What do you refuse to do in your writing?",
        field("Write your manifesto here", 8)),
    callout("Critical question:", "Du Bois famously wrote about the “double consciousness” of Black Americans — the sense of always seeing oneself through the eyes of others. Do you experience any form of double consciousness in your own writing — a tension between your natural voice and the voice you think you should use?", "red", 2),
    ("cols", [[conn(CONN_FULL)], [callout("Research extension:", "Find and read Countee Cullen’s poem “Heritage” and Langston Hughes’s essay “The Negro Artist and the Racial Mountain.” These two writers disagreed fundamentally about what Black writing should do. Write a paragraph explaining their disagreement and which position you find more compelling.", "red")]]),
), ".cols .conn span { white-space: normal !important; } .cols .callout { margin-top: 4pt; } .cols .conn { margin-top: 4pt; } .cols { grid-template-columns: 1.35fr 1fr; } body.student { --line: 21pt; } body.student .hero { height: 1.85in; }")

# ══ SOCIAL STUDIES ══════════════════════════════════════════════════════
SS_HERO = {"img": "/exhibitions/harlem/poster1.jpg", "pos": "center 72%"}
SS_T = "Why People Move: The Great Migration"
URL = "minimuseumproject.org/exhibitions/harlem-renaissance"
SS_FAMILY = family([f"Explore the Great Migration Map at **{URL}** with your family. Trace the journey together and discuss: where did your own family come from? What did they carry?"])

SS_HOOK_Q = "what reasons might cause people to leave their homes?"
SS_PUSH = ["Jim Crow laws enforced racial segregation in every area of life.",
           "The sharecropping system trapped Black families in debt they could never escape.",
           "Lynching was used as a tool of terror.", "The Ku Klux Klan was resurging.",
           "Black veterans returned from WWI to find the country they fought for still treated them as less than citizens."]
SS_PULL = ["Northern factories needed workers — World War I had cut off European immigration while demand for labor surged.",
           "Black newspapers like the Chicago Defender actively recruited Southern readers, publishing stories of higher wages, better schools, and relative freedom.",
           "Word spread through churches and community networks: go north."]
SS_FOUND = "What they also found was each other."
SS_CLOSE = "we are here, we are extraordinary, and we will not be erased."
SS_TICKET = "Name two push factors and two pull factors of the Great Migration. Then name one thing that was different about the North from what migrants expected."
# the six stops on the exhibition's Great Migration Map, with its photographs
SS_CITIES = [("delta", "Mississippi Delta"), ("new-orleans", "New Orleans"), ("memphis", "Memphis"),
             ("st-louis", "St. Louis"), ("chicago", "Chicago"), ("harlem", "Harlem")]

SS_LP = lesson("Social Studies", "SS", "social-studies", SS_T, SS_HERO, [
    timing(),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will analyze the causes and consequences of the Great Migration (1910–1940), evaluate primary source evidence including maps, photographs, and personal testimonies, understand how demographic shifts shape culture and politics, and connect historical migration to present-day patterns of movement."]}),
    ("section", {"label": "Standards alignment"}),
    ("refs", [("NCSS Standard II (Time & Continuity)", "Analyze cause-and-effect relationships in historical events; evaluate the significance of historical turning points"),
              ("NCSS Standard III (People, Places, Env.)", "Understand how physical and human geographic factors influence migration and settlement patterns"),
              ("CCSS.ELA-LITERACY RH.6-8.1", "Cite specific textual evidence to support analysis of primary and secondary sources")]),
    ("section", {"label": "Materials", "list": [
      f"Exhibition’s Great Migration Map (physical or virtual — {URL})",
      "Optional: Jacob Lawrence’s *Migration Series* images (free to view on the Phillips Collection and MoMA websites)",
      "Differentiated student handouts"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Why do people move?",
      "screen": {"phase": "Hook", "show": "question", "title": "Brainstorm", "question": "Why do people move?",
                 "purpose": "Draw out push and pull from students’ own ideas before naming them.",
                 "students": [f"Brainstorm: {SS_HOOK_Q}"]},
      "body": [f"Ask students to brainstorm: {SS_HOOK_Q} Collect responses on the board without comment. Then reveal: between 1910 and 1940, over one million Black Americans left the South — the largest internal migration in American history at that time.",
               "*“Every migration in history has push factors — reasons people leave — and pull factors — reasons they’re drawn somewhere new. The Great Migration had both. Today we’re going to investigate what those were, trace the routes people took, and understand what happened when they arrived.”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Push factors", "show": "words", "text": "\n".join(SS_PUSH),
         "purpose": "Name the reasons people left the South.",
         "students": ["A push factor: a reason people leave."]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "Pull factors", "show": "words", "text": "\n".join(SS_PULL),
         "purpose": "Name the reasons people were drawn north.",
         "students": ["A pull factor: a reason people are drawn somewhere new."]},
        {"phase": "Teach", "minutes": 2, "script": [2], "title": "Arriving in Harlem", "show": "words", "text": SS_FOUND,
         "purpose": "Set what migrants found in the North against what they hoped for.",
         "students": ["What did migrants find when they arrived in Harlem?"]},
        {"phase": "Teach", "minutes": 2, "script": [3], "title": "The six cities", "show": "gallery",
         "groups": [{"label": "The Great Migration Map", "items": [photo(k, c) for k, c in SS_CITIES]}],
         "purpose": "Trace the route on the exhibition’s map, city by city.",
         "students": ["What changed at each stop?"]}],
      "body": ["*“The push factors were brutal. " + " ".join(SS_PUSH) + "”*",
               "*“The pull factors were powerful. " + " ".join(SS_PULL) + "”*",
               f"*“When migrants arrived in Harlem, they didn’t find paradise — they found overcrowded housing, discrimination in employment, and a Northern racism that was less explicit but no less real. {SS_FOUND} A community dense enough to support Black-owned newspapers, theaters, churches, restaurants, and eventually — the Harlem Renaissance.”*",
               "Show the Great Migration Map from the exhibition. Walk through the six cities — " + ", ".join(c for _, c in SS_CITIES) + " — and the changes at each stop."]}),
    ("section", {"label": "Activity · 15 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with the evidence of the migration at the right level of challenge.",
                 "students": CHOOSE}}),
    ("levels", {
      "green": "Students complete a push/pull factors chart, label cities on the migration map, and write three sentences explaining why families made the journey.",
      "yellow": "Students analyze a primary source document (a letter, newspaper excerpt, or photograph from the exhibition) using the SOAPS method, then write a paragraph evaluating it as historical evidence.",
      "red": "Students research and compare two waves of the Great Migration (1910–1940 and 1940–1970), analyze why the second wave occurred even after the Harlem Renaissance, and evaluate what “success” meant for the movement as a whole."}),
    ("section", {"label": "Closing",
      "screen": {"phase": "Closing", "minutes": 5, "show": "words", "title": "Closing",
                 "text": SS_CLOSE[0].upper() + SS_CLOSE[1:],
                 "purpose": "Close on the courage behind the movement, then check understanding.",
                 "students": [f"Exit ticket: *{SS_TICKET}*"]},
      "body": [
      f"*“The Harlem Renaissance happened because people refused to let injustice silence them. They used every form of expression available to them — music, poetry, painting, movement, story — to say: {SS_CLOSE} That courage lives in every lesson you take from this work.”*",
      f"**Exit ticket:** *“{SS_TICKET}”*"]}),
    conn(CONN_SHORT),
])
SS_LP["slug"] = "why-people-move"

SS_G = handout("green", "Social Studies", "SS", "social-studies", SS_T, SS_HERO,
    ["The Harlem Renaissance (c. 1920–1935) was an explosion of Black music, art, and literature in Harlem, New York, growing from the Great Migration of over one million Black Americans who moved north seeking better lives and opportunities."], flat(
    act(1, "Push and pull factors", "Why Did People Leave — and Where Did They Go?",
        "A **push factor** makes people want to leave a place. A **pull factor** draws people toward a new place. Sort each item below into the correct column:",
        ("chips", ["Jim Crow segregation laws", "Higher factory wages in the North", "Racial violence and lynching",
                   "Better schools for children", "Sharecropping debt traps", "Black communities already established in Northern cities"]),
        table(["PUSH — Reasons to leave the South", "PULL — Reasons to move North"], [["", ""]] * 3, h=80)),
    act(2, "The migration route", "Trace the Journey", keep=True, *[
        "The Great Migration Map in the exhibition shows the journey from the Mississippi Delta to Harlem. Using the map, label the six cities on the route and draw an arrow showing the direction of travel:",
        ("chips", ["Mississippi Delta", "New Orleans", "Memphis", "St. Louis", "Chicago", "Harlem, New York"]),
        ("draw", "Sketch a simple map of the USA — label cities and draw the route with an arrow")]),
    act(3, "In their own words", "What Would You Write?",
        "Imagine you are a 12-year-old in Mississippi in 1920. Your family has just decided to move north. Write a short letter to your best friend explaining why you are leaving and what you hope to find. Use at least two push factors and one pull factor from Activity 1.",
        fillin("*Dear* ___,"), lines(5),
        fillin("*Your friend,* ___")),
    conn(CONN_SHORT),
    SS_FAMILY,
), ".chips span { text-transform: none; letter-spacing: .02em; font-size: 8.5pt; } .drawbox { height: 132pt; } .blank { width: 110pt; }")

SS_Y = handout("yellow", "Social Studies", "SS", "social-studies", SS_T, SS_HERO,
    ["The Harlem Renaissance (c. 1920–1935) produced extraordinary work across every art form. It grew from the Great Migration and created a permanent shift in American culture — its influence is still felt in music, visual art, literature, and civil rights today."], flat(
    act(1, "Primary source analysis — SOAPS method", "Reading History Through Documents",
        "Choose one primary source from the exhibition (a letter, photograph caption, or map annotation). Apply the SOAPS method:",
        table(["Element", "What I found / my analysis"],
              [["**S — Speaker**\nWho created this?", ""], ["**O — Occasion**\nWhen and why?", ""], ["**A — Audience**\nWho was it for?", ""],
               ["**P — Purpose**\nWhat was it trying to do?", ""], ["**S — Subject**\nWhat is it about?", ""]], "first", h=40),
        fields2(("As historical evidence, this source is valuable because:", 2), ("Its limitations as evidence are:", 2))),
    act(2, "Cause and effect chain", "How the Migration Led to the Renaissance",
        "Complete the chain of causation below — each box should follow logically from the one before:",
        ("html", '<div class="chain"><div class="cb fixed">Jim Crow laws + racial violence in the South</div><p class="ar">↓</p>'
                 '<div class="cb ef">Effect 1:<span></span></div><p class="ar">↓</p>'
                 '<div class="cb ef">Effect 2:<span></span></div><p class="ar">↓</p>'
                 '<div class="cb fixed">The Harlem Renaissance</div></div>')),
    act(3, "Parallel migrations", "Then and Now",
        "Migration has always been part of human history. Choose one current or recent migration pattern and compare it to the Great Migration using the table:",
        table(["", "The Great Migration (1910–1940)", "Migration I chose: ______________"],
              [["**Push factors**", "", ""], ["**Pull factors**", "", ""], ["**Challenges faced**", "", ""], ["**Cultural impact**", "", ""]], "first", h=28),
        field("The most important similarity between these two migrations is:", 2)),
    conn(CONN_SHORT),
    SS_FAMILY,
), "table.fill.first td:first-child { width: 22%; } table.fill td { padding: 4pt 6pt 3pt 0; } table.fill td + td { padding-left: 7pt; }")

SS_R = handout("red", "Social Studies", "SS", "social-studies", SS_T, SS_HERO,
    ["**Challenge context:** The Harlem Renaissance was not merely an artistic movement — it was a political strategy, a cultural assertion, and a community-building project. Understanding it requires grappling with questions of power, identity, authenticity, and what art is ultimately for."], flat(
    act(1, "Two waves — one movement?", "The Great Migration Was Not One Event",
        "Historians distinguish between the First Great Migration (1910–1940) and the Second Great Migration (1940–1970). Research both and complete the comparison:",
        table(["", "First Migration (1910–1940)", "Second Migration (1940–1970)"],
              [["**Scale**", "", ""], ["**Primary destinations**", "", ""], ["**Key push factors**", "", ""],
               ["**Key pull factors**", "", ""], ["**Cultural impact**", "", ""]], "first", h=30),
        "The Second Migration occurred after the Harlem Renaissance had already demonstrated Black cultural achievement.",
        field("Why did Black Americans still feel the need to leave the South in even larger numbers after 1940?", 3)),
    act(2, "What did “success” look like?", "Evaluating the Movement",
        "The Great Migration is sometimes described as a success — migrants found better wages, more freedom, and the opportunity for cultural flourishing. It is also described as a partial failure — Northern racism persisted, housing discrimination was widespread, and many migrants found themselves trapped in poor urban neighborhoods.",
        field("Write a structured argument: on balance, was the Great Migration successful for the people who made it?", 4)),
    act(3, "The geography of power", "Why Did the Renaissance Happen in Harlem Specifically?",
        "By 1930, Harlem had become the largest Black urban community in America — 175,000 people in a few square miles. Analyze the geographic, economic, and social factors that made Harlem — rather than Chicago’s South Side, or Detroit’s Paradise Valley — the epicenter of the Renaissance:",
        lines(3)),
    ("cols", [[callout("Critical question:", "Jacob Lawrence’s *Migration Series* (1941) depicted the Great Migration in 60 paintings. In 1942 the Museum of Modern Art and the Phillips Collection each acquired half of the series — splitting a single work between two institutions. What does it mean that a work about the Black experience entered two of America’s leading museums so early in Lawrence’s career?", "red", 4)], [callout("Research extension:", "The Reverse Migration began in the 1970s and continues today — Black Americans moving back to the South. Research this movement. What does it tell us about how the push/pull dynamics of the original Great Migration have changed? What does it mean for cities like Atlanta, Charlotte, and Houston?", "red"), conn(CONN_SHORT)]]),
), "table.fill.first td:first-child { width: 22%; } table.fill td { padding: 4pt 6pt 3pt 0; } table.fill td + td { padding-left: 7pt; }"
   " body.student { --line: 21pt; } .cols .callout { margin-top: 2pt; } .cols .conn { margin: 5pt 0 0; } .cols .conn span { white-space: normal !important; } .task { margin-bottom: 5pt; } .cols { margin-top: 2pt; }")

DOCS = [SCI_LP, SCI_G, SCI_Y, SCI_R, ELA_LP, ELA_G, ELA_Y, ELA_R, SS_LP, SS_G, SS_Y, SS_R]

# links to the paintings this module names (see _links.py)
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _links import add_links as _add_links
_add_links(DOCS)
