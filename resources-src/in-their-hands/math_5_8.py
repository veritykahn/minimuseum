"""Grades 5–8 · Math · "The Numbers in the Coins"
Every figure follows app/exhibitions/in-their-hands/artifacts/coin-data.ts,
timelineStops (timeline/page.tsx) and handsCharacters (hands/page.tsx).
Any number not from those files is a pure-math choice (a scale, a ruler) or
an invented example, and says so on the page."""
import html, re

C = "/exhibitions/in-their-hands/artifacts/coins/"
DIR = "teachers/grades-5-8/math/"
TITLE = "The Numbers in the Coins"
SUB = "Grades 5–8 · Math · Timelines, ratios and the widow’s gift"

HERO = {"img": "/exhibitions/in-their-hands/timeline/widow-tissot.jpg", "pos": "center 40%",
        "credit": "James Tissot (1836–1902), Brooklyn Museum"}

VERSE_WIDOW = {"text": "They all gave out of their wealth; but she, out of her poverty, put in everything — all she had to live on.",
               "ref": "Mark 12:44"}

# ── a number line drawn in HTML ─────────────────────────────────────────
CSS = """
.nline { position: relative; height: 44pt; margin: 6pt 14pt 8pt; break-inside: avoid; }
.nline .axis { position: absolute; left: -10pt; right: -10pt; top: 16pt; border-top: 1.2pt solid #1d1c1a; }
.nline .axis::before, .nline .axis::after { content: ""; position: absolute; top: -4.6pt; border: 4pt solid transparent; }
.nline .axis::before { left: -6pt; border-right: 6pt solid #1d1c1a; border-left: 0; }
.nline .axis::after { right: -6pt; border-left: 6pt solid #1d1c1a; border-right: 0; }
.nline .t { position: absolute; top: 11pt; transform: translateX(-50%); text-align: center; }
.nline .t::before { content: ""; display: block; width: 1.2pt; height: 10pt; background: #1d1c1a; margin: 0 auto; }
.nline .t span { font: 400 7.8pt 'Outfit'; display: block; margin-top: 3pt; white-space: nowrap; }
.nline .t.edge::before { background: #A8452F; width: 2pt; height: 14pt; margin-top: -2pt; }
.nline .t.edge span { color: #A8452F; font-weight: 500; }
.nline .note { position: absolute; top: -1pt; transform: translateX(-50%); font: 500 6.8pt 'Outfit'; letter-spacing: .14em;
  text-transform: uppercase; color: #A8452F; white-space: nowrap; }
.nline .hop { position: absolute; top: 5pt; height: 10pt; border: 1pt solid #86671A; border-bottom: 0; border-radius: 10pt 10pt 0 0; }
.worked { background: rgba(255,255,255,.72); border-left: 3pt solid var(--accent); padding: 7pt 10pt 3pt; margin: 4pt 0 8pt; break-inside: avoid; }
.worked ol { margin: 2pt 0 5pt; padding-left: 15pt; } .worked li { margin: 0 0 2pt; }
body.adult .worked { background: #f6f1e4; }
table.fill td:first-child { width: auto; }
.key h4 { font-size: 11pt; margin: 6pt 0 2pt; }
.key ol { margin: 0 0 4pt; padding-left: 14pt; font-size: 8.4pt; line-height: 1.42; } .key li { margin: 0 0 1.5pt; }
.key .label { margin-top: 2pt; }
body.student table.fill td { padding: 4pt 6pt 8pt 0; }
body.student table.fill { break-inside: auto; } table.fill tr { break-inside: avoid; }
"""

def numberline(ticks, notes=(), hops=()):
    """ticks: (position 0–100, label, is_edge); notes: (position, text);
       hops: (from, to) arcs above the line."""
    t = "".join(f'<div class="t{" edge" if e else ""}" style="left:{p}%"><span>{l}</span></div>' for p, l, e in ticks)
    n = "".join(f'<div class="note" style="left:{p}%">{x}</div>' for p, x in notes)
    h = "".join(f'<div class="hop" style="left:{a}%;width:{b - a}%"></div>' for a, b in hops)
    return f'<div class="nline"><div class="axis"></div>{h}{t}{n}</div>'

# six single years either side of the join, evenly spaced: no zero between them
YEARS = numberline([(0, "3 BC", 0), (20, "2 BC", 0), (40, "1 BC", 1), (60, "AD 1", 1), (80, "AD 2", 0), (100, "AD 3", 0)],
                   notes=[(50, "no year zero")])
YEARS_HOPS = numberline([(0, "3 BC", 0), (20, "2 BC", 0), (40, "1 BC", 1), (60, "AD 1", 1), (80, "AD 2", 0), (100, "AD 3", 0)],
                        notes=[(50, "no year zero")], hops=[(20, 40), (40, 60), (60, 80)])
# 125 BC to AD 75 in 25-year steps; the join between 1 BC and AD 1 marked
CENTURIES = numberline([(0, "125 BC", 0), (12.5, "100 BC", 0), (25, "75 BC", 0), (37.5, "50 BC", 0), (50, "25 BC", 0),
                        (62.5, "1 BC | AD 1", 1), (75, "AD 25", 0), (87.5, "AD 50", 0), (100, "AD 75", 0)])

def worked(title, steps, after=""):
    return (f'<div class="worked"><p class="label">Worked example</p><h4>{title}</h4><ol>'
            + "".join(f"<li>{s}</li>" for s in steps) + f"</ol>{after}</div>")

AUGUSTUS = worked("How long did Augustus rule?",
  ["Augustus ruled from <b>27 BC</b> until his death in <b>AD 14</b>.",
   "Count back from 27 BC to the join: 27 years. Count on from the join to AD 14: 14 years. <b>27 + 14 = 41.</b>",
   "The dates cross from BC to AD, and there is no year zero to stand on, so take away one: <b>41 − 1 = 40 years.</b>"])

# ── the lesson plan ─────────────────────────────────────────────────────

LESSON = {
  "out": DIR + "ITH_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 22, "#86671A"), ("Close", 6, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will be able to do",
      "body": ["Students will use the numbers on the eleven coins of *In Their Hands* to find spans of years on a BC/AD timeline, using the rule that there is no year zero; place dates on a number line, using negative numbers as a model; compare measured coins in grams and millimeters; work with the ratio of a half-shekel to a shekel; and explain, as a fraction of all she had, why Jesus said the widow’s two small coins were more than all the others gave."]}),
    ("section", {"label": "Standards", "list": [
      "**The number system** — positive and negative numbers on a number line; ordering; distance between two numbers (6.NS.C.5–7, 7.NS.A.1)",
      "**Ratios and proportional reasoning** — ratio language; percent as a rate per 100 (6.RP.A.1, 6.RP.A.3c, 7.RP.A.3)",
      "**Expressions and equations** — writing and solving one-step equations; expressions with variables (6.EE.A.2, 6.EE.B.7, 7.EE.B.4)",
      "**Measurement** — decimals in grams and millimeters; scale on a timeline (6.NS.B.3, 7.G.A.1)"]}),
    ("section", {"label": "Materials needed", "list": [
      "A strip of tape on the board for a class timeline; centimeter rulers (Red level)",
      "The Pilate prutah card on the handouts, or the coin on the exhibition page",
      "Differentiated handouts, one per student; the answer key is page 3"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "What year came before AD 1?",
      "body": ["Ask: *“If this is AD 1, what year came just before it?”* Most students say *year zero*. Draw the line below and tell them there was none: the years are counted from one, so 1 BC is followed straight away by AD 1. Then ask how long the Shekel of Tyre’s dates, 1 BC to AD 1, really span. One year — not two."]}),
    ("html", YEARS),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Three kinds of span",
      "body": [
        "**Both dates AD.** Subtract as usual. Claudius reigned from AD 41 to 54: 54 − 41 = 13 years.",
        "**Both dates BC.** BC numbers count *down* toward the join, so the earlier date is the bigger number. Herod the Great ruled from 37 BC until his death in 4 BC: 37 − 4 = 33 years.",
        "**Across the join.** Add, then take away one, because there is no year zero: hop from 2 BC to AD 2 and count three hops, not four. Work Augustus together (below).",
        "**The model and its flaw.** Treat BC years as negative numbers: 27 BC sits at −27, AD 14 at +14. The distance from −27 to 14 is 41: one too many, because a number line has a zero and the calendar does not.",
        "**Two more strands.** Every Jewish man over twenty owed a half-shekel Temple tax each year: a ratio of 1 : 2, so in Matthew 17:27 one coin worth a shekel pays for Jesus and Peter. And the widow gave two lepta, *everything* she had: 2 out of 2 is 100%."]}),
    ("html", AUGUSTUS),
    ("section", {"label": "Activity · 22 minutes", "body": ["Students choose a handout. All three use the same coins and dates."]}),
    ("levels", {
      "green": "A worked example, then guided spans: AD dates, BC dates, and dates across the join. Place five coins on a number line. Find the widow’s gift as a fraction and a percent, and the Temple tax for a group of men.",
      "yellow": "Mixed problems: the no-year-zero rule, a table of six spans to rank, Pilate’s coin and the regnal year of Tiberius, the two measured coins, thirty shekels and the Temple tax, and three givers compared by amount and by percent.",
      "red": "Prove the no-year-zero rule with algebra, solve multi-step date problems, build a timeline to scale from 103 BC to AD 62, and use an equation to compare the widow’s gift with a large gift that is a small fraction of great wealth."}),
    ("section", {"label": "Close · 6 minutes", "title": "Exit ticket",
      "body": ["*1. How many years from 4 BC to AD 39, the dates on the coin of Herod Antipas?* (42.) *2. The widow gave the least money. In what mathematical sense did she give the most?* (The largest share of what she had: 100%.)"]}),
    ("connection", ["**Visit the exhibition:** the Gospel Timeline walks the eleven coins in date order, from the census under Augustus to Paul’s appeal before Festus; students can check each span as they go. In Case 7, find the widow’s two lepta and Pilate’s prutah, 1.79 g and 16 mm."]),
    ("section", {"label": "Cross-curricular and assessment notes", "body": [
      "**Religion:** Mark 12:41–44, giving from poverty rather than surplus. **Social Studies:** who governed Judaea when. **Assessment:** the handout, the exit ticket, and at Red the written explanation in Part 4."]}),
    ("pagebreak", None),
    ("section", {"label": "Answer key", "title": "Answers with working",
      "body": ["**The rule.** From *b* BC to *a* AD is *a* + *b* − 1 years; from 1 BC to AD 1 is one year. A number line measures from zero; the calendar counts from one, so the BC years model as negatives with a missing zero. **Approximate dates.** Claudius’ edict (about AD 49), Festus’ arrival (about AD 59) and the widow’s gift (about AD 30) are approximate, and so are answers built on them. Pilate’s coin is AD 29/30 because year 16 of Tiberius ran across two calendar years. **Invented numbers.** The exhibition gives no ancient prices, wealth or exchange rates. Every wealth figure in the widow problems is invented for the math, and the handouts say so."]}),
    ("html", """<div class="cols key"><div>
<p class="label">Green level</p>
<h4>Part 1 · No year zero</h4><ol>
<li>3 BC → 2 BC → 1 BC → AD 1 → AD 2 → AD 3: <b>5 hops, 5 years</b>. Check: 3 + 3 − 1 = 5.</li></ol>
<h4>Part 2 · Six spans of years</h4><ol>
<li>Tiberius, AD 14–37: 37 − 14 = <b>23</b></li>
<li>Pilate, AD 26–36: 36 − 26 = <b>10</b></li>
<li>Herod the Great, 37–4 BC: 37 − 4 = <b>33</b></li>
<li>Claudius, AD 41–54: 54 − 41 = <b>13</b></li>
<li>Aretas IV, 9 BC–AD 40: 9 + 40 = 49; 49 − 1 = <b>48</b></li>
<li>Herod Antipas, 4 BC–AD 39: 4 + 39 = 43; 43 − 1 = <b>42</b></li>
<li>Longest: <b>Aretas IV</b> (48 years)</li></ol>
<h4>Part 3 · Coins in order</h4><ol>
<li>Left to right: <b>A</b> 103 BC, <b>B</b> 37 BC, <b>C</b> 5 BC, <b>D</b> AD 29, <b>E</b> AD 59. Earliest: <b>A</b>, the widow’s mite.</li></ol>
<h4>Part 4 · Two small coins</h4><ol>
<li>Widow: 2/2 = <b>1</b>, <b>100%</b>. Invented giver: 10/100 = <b>1/10</b>, <b>10%</b>.</li>
<li>Larger share: <b>the widow</b></li></ol>
<h4>Part 5 · Half a shekel</h4><ol>
<li>4 × ½ = <b>2 shekels</b>; 10 × ½ = <b>5 shekels</b></li></ol>
<p class="label" style="margin-top:8pt">Yellow level</p>
<h4>Part 1 · The rule</h4><ol>
<li>1 BC to AD 1: 1 + 1 − 1 = <b>1 year</b>. Not 2, because there is no year zero between them.</li></ol>
<h4>Part 2 · Spans</h4><ol>
<li>Augustus 27 BC–AD 14: 27 + 14 − 1 = <b>40</b></li>
<li>Herod the Great 37–4 BC: 37 − 4 = <b>33</b></li>
<li>Aretas IV 9 BC–AD 40: 9 + 40 − 1 = <b>48</b></li>
<li>Herod Antipas 4 BC–AD 39: 4 + 39 − 1 = <b>42</b></li>
<li>Herod Agrippa I AD 41–44: 44 − 41 = <b>3</b></li>
<li>Claudius AD 41–54: 54 − 41 = <b>13</b></li>
<li>Longest to shortest: <b>Aretas, Antipas, Augustus, Herod the Great, Claudius, Agrippa</b></li></ol>
</div><div>
<h4>Part 3 · Pilate’s coin</h4><ol>
<li>Year 1 began in AD 14, so year 16 began 15 years later: 14 + 15 = <b>AD 29</b>, running into AD 30 — hence 29/30.</li>
<li>Pilate arrived AD 26; coin AD 29: 29 − 26 = <b>3 years</b>.</li></ol>
<h4>Part 4 · Grams and millimeters</h4><ol>
<li>Agrippa’s: 1.80 − 1.79 = <b>0.01 g</b> heavier (10 mg)</li>
<li>Together: 1.79 + 1.80 = <b>3.59 g</b></li>
<li>300 mm ÷ 16 mm = 18.75, so <b>18 whole coins</b></li>
<li>Claudius AE27 is 27 mm: 27 − 16 = <b>11 mm</b> wider</li></ol>
<h4>Part 5 · Shekels</h4><ol>
<li>Half-shekel : shekel = <b>1 : 2</b></li>
<li>30 ÷ ½ = 30 × 2 = <b>60 men</b> for one year</li></ol>
<h4>Part 6 · Three givers (invented numbers)</h4><ol>
<li>A: 40/400 = <b>10%</b>; B: 25/50 = <b>50%</b>; widow: 2/2 = <b>100%</b></li>
<li>By amount: A (40), B (25), widow (2). By percent: widow, B, A — the order reverses.</li></ol>
<p class="label" style="margin-top:8pt">Red level</p>
<h4>Part 1 · Prove the rule</h4><ol>
<li>Relabeled, <i>b</i> BC is 1 − <i>b</i>. Distance: <i>a</i> − (1 − <i>b</i>) = <b><i>a</i> + <i>b</i> − 1</b>. 1 BC → 0, AD 1 → 1: 1 year ✓</li>
<li>27 BC → 1 − 27 = <b>−26</b>; 14 − (−26) = <b>40</b> ✓</li></ol>
<h4>Part 2 · Multi-step</h4><ol>
<li>Herod dies 4 BC; Agrippa king AD 41: 4 + 41 − 1 = <b>44 years</b></li>
<li>Last lepton minted 76 BC; still in use about AD 30: 76 + 30 − 1 = <b>105 years</b> — over a century ✓. From 103 BC: 103 + 30 − 1 = <b>132</b>.</li>
<li>AD 30 to 1961: <b>1,931 years</b> (1,932 from AD 29)</li></ol>
<h4>Part 3 · Timeline to scale (1 cm = 10 years)</h4><ol>
<li>a. 103 BC to AD 62: 103 + 62 − 1 = 164 years → <b>16.4 cm</b></li>
<li>b. 1 BC to AD 1 is one year: <b>0.1 cm = 1 mm</b></li>
<li>c. From the start: 27 BC (76 years) <b>7.6 cm</b>; 1 BC (102) <b>10.2 cm</b>; AD 1 (103) <b>10.3 cm</b>; AD 29 (131) <b>13.1 cm</b>; AD 62 (164) <b>16.4 cm</b></li>
<li>d. 164 ÷ 15 ≈ 10.9, so <b>11 years per cm</b> (164 ÷ 11 ≈ 14.9 cm; 10 gives 16.4 cm, too long)</li></ol>
<h4>Part 4 · The widow’s gift (invented numbers)</h4><ol>
<li>0.05<i>W</i> = 600 → <i>W</i> = 600 ÷ 0.05 = <b>12,000 lepta</b></li>
<li>He keeps 12,000 − 600 = <b>11,400</b>; she keeps <b>0</b></li>
<li>Amount: 600 ÷ 2 = <b>300 times</b> hers. Fraction: 100% ÷ 5% = hers is <b>20 times</b> his.</li>
<li>Kept: <b><i>W</i> − <i>G</i></b>, or <b><i>W</i>(1 − <i>f</i>)</b>; widow <i>f</i> = 1 → 0</li></ol>
</div></div>"""),
  ]}

# ── the handouts ─────────────────────────────────────────────────────────

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Math", "level": level, "context": CONTEXT, "css": CSS + ".drawbox { height: 84pt; }",
            "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level", "blocks": blocks, "hero": HERO}

CONTEXT = ["Every coin in *In Their Hands* carries numbers: dates, reigns, weights, sizes, amounts. To work with the dates you need one rule that surprises most people: **there is no year zero.** The year 1 BC is followed straight away by AD 1."]

B = "________"

def P(t):
    """A paragraph inside a task's blocks, in the same **bold** / *italic*
       shorthand as build.py's copy (blocks render before a task's body)."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return ("html", "<p>" + re.sub(r"\*(.+?)\*", r"<i>\1</i>", t) + "</p>")

GREEN = handout("green", "ITH_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "No year zero", "blocks": [("html", YEARS_HOPS)],
            "body": ["From 2 BC to AD 2, hop along the line: 2 BC → 1 BC → AD 1 → AD 2. **3 hops, so 3 years** — not 4. There is no zero to land on.",
                     f"Now you try. How many years from **3 BC to AD 3**? Count the hops. {B} years"]}),
  ("html", AUGUSTUS),
  ("task", {"label": "Part 2", "title": "Six spans of years", "blocks": [
            P("**Both dates AD:** subtract. **Both dates BC:** subtract too — BC numbers count *down* toward the join. **Across the join:** add, then take away 1. The first of each kind is started for you."),
            ("table", {"head": ["Who", "Dates", "Working", "Years"], "rows": [
              ["Tiberius (the Tribute Penny, a replica)", "AD 14–37", "37 − 14 =", ""],
              ["Pilate, prefect of Judaea", "AD 26–36", "", ""],
              ["Herod the Great", "37 BC–4 BC", "37 − 4 =", ""],
              ["Emperor Claudius", "AD 41–54", "", ""],
              ["Aretas IV", "9 BC–AD 40", "9 + 40 = ____ − 1 =", ""],
              ["Herod Antipas (a replica)", "4 BC–AD 39", "", ""]]}),
            P(f"Which span is the longest? {B}")]}),
  ("task", {"label": "Part 3", "title": "Put the coins in order", "blocks": [
            P("Write each letter above the line where its year belongs. BC years fall left of the join, like negative numbers. **A** the widow’s mite first minted, 103 BC  ·  **B** Herod the Great begins to rule, 37 BC  ·  **C** the coin of Augustus, 5 BC  ·  **D** Pilate’s coin, AD 29  ·  **E** the coin of Festus, AD 59"),
            ("html", CENTURIES),
            P(f"Which coin was made earliest? {B}")]}),
  ("task", {"label": "Part 4", "title": "Two small coins", "blocks": [("verse", VERSE_WIDOW),
            P(f"The widow had 2 lepta and gave 2. Fraction given: 2/2 = {B}  Percent: {B} %"),
            P(f"*Invented example:* a rich man has 100 coins and gives 10. Fraction: {B}  Percent: {B} %"),
            P(f"Who gave the larger *share* of what they had? {B}")]}),
  ("task", {"label": "Part 5", "title": "Half a shekel", "blocks": [
            P("Every Jewish man over twenty owed a **half-shekel** Temple tax each year. In Matthew 17:27, one coin worth one shekel pays the tax for two people, Jesus and Peter."),
            P(f"How many shekels pay the tax for 4 men? {B}  For 10 men? {B}")]}),
  ("connection", ["In Case 7, find the widow’s two lepta, and Pilate’s prutah: 1.79 grams, 16 millimeters, made in the year of the Passion."]),
])

YELLOW = handout("yellow", "ITH_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "The rule", "blocks": [("html", YEARS),
            P("**Both dates AD, or both BC:** subtract. **From BC to AD:** add the two numbers, then take away 1."),
            P("The Shekel of Tyre in this exhibition (a replica) is dated **1 BC–AD 1**. How many years apart are those dates? Why is the answer not 2?")],
            "lines": 1}),
  ("task", {"label": "Part 2", "title": "Six spans", "blocks": [
            P("Find each span, then rank all six from longest to shortest."),
            ("table", {"head": ["Who", "Dates in the exhibition", "Working", "Years"], "rows": [
              ["Augustus rules", "27 BC–AD 14", "", ""],
              ["Herod the Great rules", "37 BC–4 BC", "", ""],
              ["Aretas IV (his coin)", "9 BC–AD 40", "", ""],
              ["Herod Antipas (his coin, a replica)", "4 BC–AD 39", "", ""],
              ["Herod Agrippa I (his coin)", "AD 41–44", "", ""],
              ["Claudius reigns", "AD 41–54", "", ""]]}),
            P(f"Longest to shortest: {B}{B}{B}{B}{B}{B}")]}),
  ("coin", {"img": C + "pilate-front.png", "label": "Case 7 · Pontius Pilate · bronze prutah · authentic",
            "title": "AD 29/30, year 16 of Tiberius · 1.79 g · 16 mm",
            "body": ["Pilate was prefect of Judaea from AD 26 to 36, and this coin was minted in the year of the Passion. It is dated by the emperor’s reign: Tiberius began to reign in AD 14, and that first year counts as year 1."]}),
  ("task", {"label": "Part 3", "title": "Year 16 of Tiberius", "blocks": [
            P(f"Year 16 of Tiberius began in AD {B}  Show how: {B}{B}{B}"),
            P(f"How many years after Pilate arrived was the coin made? {B}")]}),
  ("task", {"label": "Part 4", "title": "Grams and millimeters", "blocks": [
            P(f"a. Herod Agrippa I’s prutah weighs **1.80 g**. Which is heavier, his or Pilate’s, and by how much? {B}"),
            P(f"b. What do the two coins weigh together? {B}"),
            P(f"c. How many of Pilate’s coins fit edge to edge along a 30 cm ruler? {B}"),
            P(f"d. Claudius’ coin is an **AE27**: bronze, 27 mm across. How much wider is it than Pilate’s? {B}")]}),
  ("task", {"label": "Part 5", "title": "Thirty pieces of silver", "blocks": [
            P("Every Jewish man over twenty owed a **half-shekel** to the Temple each year. Judas was paid thirty pieces of silver, almost certainly Tyrian shekels."),
            P(f"Half-shekel : shekel = {B}   Thirty shekels pay one year’s tax for {B} men.")]}),
  ("task", {"label": "Part 6", "title": "Who gave more?", "blocks": [("verse", VERSE_WIDOW),
            P("*Invented numbers:* A has 400 coins and gives 40. B has 50 and gives 25. The widow has 2 lepta and gives 2. Find each percent; rank by amount, then by percent. What did Jesus mean?")],
            "lines": 2}),
  ("connection", ["Walk the Gospel Timeline online and check each span from Part 2 as you pass its coin."]),
])

RED = handout("red", "ITH_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Prove the rule", "blocks": [("html", YEARS),
            P("A number line has a zero; the calendar does not. Fix it by relabeling: call 1 BC year **0**, 2 BC year **−1**, and so on, so that *b* BC becomes **1 − b**. AD years keep their numbers."),
            P("a. Use the relabeling to write an expression for the number of years from *b* BC to *a* AD, and simplify it. Test it on 1 BC to AD 1."),
            P("b. What number does 27 BC become? Use it to find how long Augustus ruled (27 BC–AD 14).")],
            "lines": 2}),
  ("task", {"label": "Part 2", "title": "Multi-step dates", "blocks": [
            P("a. Herod the Great died in 4 BC. His grandson Herod Agrippa I was made king in AD 41. How many years apart?"),
            P("b. The lepton was first minted from 103 to 76 BC, and was still in use when the widow gave hers, about AD 30. The exhibition says it circulated *for over a century*. Check that claim."),
            P("c. Pilate’s coin was made in AD 29/30. The stone carved with his name was found in 1961. For how many years was the coin evidence before the stone?")],
            "lines": 3}),
  ("task", {"label": "Part 3", "title": "Build a timeline to scale", "blocks": [
            P("The coins span from 103 BC (the first leptons) to AD 62 (the last year of Festus’ coins). Use the scale **1 cm = 10 years.**"),
            P(f"a. How long must your line be? {B} cm   b. How far apart are 1 BC and AD 1 on it? {B} cm"),
            P("c. Draw the line below and mark 27 BC, 1 BC, AD 1, AD 29 and AD 62 at the right distances from the start."),
            P(f"d. What is the smallest whole number of years per centimeter that fits the line in 15 cm? {B}"),
            ("draw", "Your timeline · 1 cm = 10 years")]}),
  ("task", {"label": "Part 4", "title": "The widow’s gift, in algebra", "blocks": [("verse", VERSE_WIDOW),
            P("Let a giver’s wealth be *W*, the gift *G*, and the fraction given *f* = *G*/*W*. The widow gave two lepta, all she had, so for her *f* = 1."),
            P("*Invented numbers, not from history:* a rich giver puts in **600 lepta**, and that is **5%** of his wealth."),
            P("a. Write and solve an equation for *W*. b. How much does each giver keep? c. His gift is how many times hers in amount? Her fraction is how many times his? d. Write an expression for what any giver keeps, using *W* and *f*. e. In two sentences, use your answers to explain Mark 12:44.")],
            "lines": 4}),
  ("connection", ["The exhibition says of the widow’s mite: *the object is not the coin but the proportion.* Find her two lepta in Case 7, the same case as Pilate’s coin from the year of the Passion."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
