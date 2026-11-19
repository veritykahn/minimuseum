"""Grades 5–8 · Math · "Railway Time"
Elapsed time, signed offsets and rate, from the railway bench of the
Inventions Workshop (app/exhibitions/victorian/inventions/inventionsText.ts:
NOTES, STATIONS, PLYMOUTH, TRAIN_PUZZLES, STATION_JOB, BRISTOL_CLOCK,
BRISTOL_TRAIN) and poster 1. The minutes each town was behind London are
the 1841 Great Western Railway timetable's, as the workshop gives them;
the stationmaster's 12:10 and the train times are the workshop's game.
Degrees west are the workshop map's own positions for the towns."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/math/"
TITLE = "Railway Time"
SUB = "Grades 5–8 · Math · Elapsed time, offsets and rate"

HERO = {"img": pic(PLATFORM), "pos": "center 55%"}
SCREEN_HERO = {"img": PLATFORM, "pos": "center 55%"}

# (town, minutes behind London, degrees west of Greenwich on the workshop's map)
STATIONS = [("London", 0, 0.13), ("Reading", 4, 0.97), ("Steventon", 5.5, 1.32), ("Chippenham", 8, 2.12),
            ("Bath", 11, 2.36), ("Bristol", 11, 2.59), ("Bridgewater", 14, 3.0)]
PLYMOUTH = ("Plymouth", 16.5, 4.14)   # behind Greenwich, not on the 1841 line
BEHIND = {t: b for t, b, _ in STATIONS}

# the workshop's "Will you catch the train?": (town, train by London time, the town's own clock)
PUZZLES = [("Bath", 12 * 60, 11 * 60 + 52), ("Reading", 15 * 60, 14 * 60 + 50),
           ("Bridgewater", 16 * 60, 15 * 60 + 50), ("Bristol", 12 * 60 + 30, 12 * 60 + 15)]
JOB_LONDON = 12 * 60 + 10
JOB_TOWNS = ["Reading", "Chippenham", "Bath", "Bridgewater"]


def t(m, ampm=True):
    h, mm = divmod(int(m), 60)
    if not ampm:
        return f"{h}:{mm:02d}"
    if h == 12 and mm == 0:
        return "12:00 noon"
    suf = "a.m." if h < 12 else "p.m."
    h12 = h if h <= 12 else h - 12
    return f"{h12}:{mm:02d} {suf}"


def verdict(town, train, clock):
    london = clock + BEHIND[town]
    d = train - london
    return london, ("caught, " + f"{d} minutes to spare") if d >= 0 else ("missed, by " + f"{-d} minutes")


HOOK_Q = "A traveler’s watch says 12:00 noon. Bristol’s clock says 11:49. Can they both be right?"

OBJECTIVES = objectives([
    ("convert a town’s own time to London time, and back, by adding or subtracting minutes",
     "convert a town’s time to London time, and back?", False),
    ("solve elapsed-time problems that cross the hour",
     "solve a time problem that crosses the hour?", False),
    ("represent each town’s time as a signed offset from London, and find the difference between two towns",
     "use signed offsets to compare two towns?", False),
    ("find a rate from data — minutes per degree west — and use it to test the timetable",
     "find a rate from data and use it to test a claim?", True)],
  "Every clock in the world is still set by the same reasoning: a time, an offset, and a rule for turning one into the other. Time zones are railway time on a bigger map.")

LINE = {"alt": "A number line of minutes behind London time, from 0 to 18: London at 0, Reading 4, Chippenham 8, Bath and Bristol 11, Bridgewater 14, and Plymouth 16 and a half, behind Greenwich.",
        "ticks": [{"at": 0, "label": "London 0", "edge": True}, {"at": 22.2, "label": "Reading 4"},
                  {"at": 44.4, "label": "Chippenham 8"}, {"at": 61.1, "label": "Bath, Bristol 11"},
                  {"at": 77.8, "label": "Bridgewater 14"}, {"at": 91.7, "label": "Plymouth 16½"},
                  {"at": 100, "label": "18", "edge": True}],
        "notes": [{"at": 50, "text": "further west, later clocks"}]}

WORKED_BATH = {"title": "Will you catch the train at Bath?",
  "steps": ["The train leaves at **12:00 noon, London time**.",
            "Bath’s own clock says **11:52**. Bath is **11 minutes behind** London.",
            "Count on 11 minutes to find London time: **11:52 + 0:11 = 12:03**."],
  "answer": "Missed, by 3 minutes"}
RULE = "London time = town time + minutes behind\nTown time = London time − minutes behind"

WORKED_JOB = [
  {"title": "You’re the stationmaster",
   "steps": ["The telegraph brings London time: **12:10**.", "Reading’s clock still shows Reading’s own time, 4 minutes behind: **12:06**.",
             "Wind it on **4 minutes**, to 12:10."], "answer": "Wind on 4 minutes"},
  {"title": "Bristol’s clock with two minute hands",
   "steps": ["The red hand shows London time: **12:10**.", "The black hand shows Bristol’s own time, 11 minutes behind: **11:59**.",
             "The train leaves at **12:30 London time**. What will the black hand show?"], "answer": "12:19"}]

CHART = {"caption": "Will you catch the train? The workshop’s four puzzles",
         "columns": ["Town", "Town clock", "+ minutes behind", "= London time", "Train (London time)", "Result"],
         "rows": []}
for town, train, clock in PUZZLES:
    lon, v = verdict(town, train, clock)
    CHART["rows"].append({"cells": [town, t(clock, False), f"+ {BEHIND[town]}", t(lon, False), t(train, False), v.capitalize()]})

PLAN_CSS = """
.cards { grid-template-columns: repeat(3, 1fr); gap: 7pt; } .card { padding: 6pt 8pt 2pt; } .card .cn { display: none; }
.card h4 { margin-top: 0; } .card p { font-size: 8.6pt; line-height: 1.36; }
table.tt { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 4pt 0 10pt; }
table.tt th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.tt td { border-bottom: .6pt solid #c8c5bb; padding: 3.5pt 8pt 3.5pt 0; }
"""


def timetable(with_noon=True, with_degrees=False, plymouth=False):
    head = "<th>Town</th><th>Minutes behind London</th>" + ("<th>Town clock when London says 12:00 noon</th>" if with_noon else "") + ("<th>Degrees west of Greenwich</th>" if with_degrees else "")
    rows = []
    for town, b, lon in STATIONS + ([PLYMOUTH] if plymouth else []):
        bb = "16½ (behind Greenwich)" if town == "Plymouth" else ("5½" if b == 5.5 else str(int(b)))
        cells = f"<td>{town}</td><td>{bb}</td>"
        if with_noon:
            cells += f"<td>{t(12 * 60 - b, False) if b != 5.5 else '11:54½'}</td>"
        if with_degrees:
            cells += f"<td>{lon:.2f}</td>"
        rows.append(f"<tr>{cells}</tr>")
    return f'<table class="tt"><thead><tr>{head}</tr></thead><tbody>{"".join(rows)}</tbody></table>'


def puzzle_key():
    rows = "".join(f"<tr><td>{c[0]}</td><td>{c[1]}</td><td>{c[2]}</td><td>{c[3]}</td><td>{c[4]}</td><td>{c[5]}</td></tr>" for c in (r["cells"] for r in CHART["rows"]))
    head = "".join(f"<th>{h}</th>" for h in CHART["columns"])
    return f'<table class="tt"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'


LESSON = {
  "slug": "railway-time",
  "out": DIR + "VIC_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 12, TEACH), ("Activity", 20, WORK), ("Debrief", 8, CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Before the railways, every town in Britain set its clocks by the Sun, so the further west, the later its clocks. Students will use the 1841 Great Western Railway timetable’s minutes — how far each town’s time was behind London’s — to convert between a town’s own time and the London time the trains ran by, solve elapsed-time problems that cross the hour, and treat each town as a signed offset. Red Level students will find a rate, minutes per degree west, and use it to test the timetable."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Measurement** — elapsed time; adding and subtracting minutes across the hour",
      "**Number** — signed numbers as offsets; distance between two numbers on a line",
      "**Ratios and rates** — unit rate from data; testing a model against data"]}),
    ("section", {"label": "Materials needed", "list": [
      "The timetable and answer key on page 3, projected or printed; the handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Two right times",
      "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q,
                 "purpose": "Meet the puzzle of two correct times before the rule is given.",
                 "students": ["How could two clocks both be right?"]},
      "body": ["Ask: *“" + HOOK_Q + "”* Take ideas. Then tell students that in Victorian Britain both could be right: towns kept their own time by the Sun, and noon came later the further west you went. Bristol’s time was 11 minutes behind London’s."]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Town time and London time",
      "screen": [
        {"phase": "Teach", "minutes": 6, "script": [0, 1], "title": "Minutes behind London", "show": "numberline", "line": LINE,
         "worked": WORKED_BATH, "rule": RULE,
         "purpose": "Learn the rule for turning a town’s time into London time, and back.",
         "students": ["When London says 12:00 noon, what does Reading’s clock say?", "Why do the clocks get later going west?"]},
        {"phase": "Teach", "minutes": 6, "script": [2, 3], "title": "Wind the clocks on", "show": "worked", "examples": WORKED_JOB,
         "purpose": "Practice both directions of the rule: a clock to wind on, and a clock with two hands.",
         "students": ["How far must Bath’s clock be wound on?", "Why did Bristol need two minute hands?"]}],
      "body": [
        "**The timetable.** In 1841 the Great Western Railway’s timetable read *“LONDON TIME is kept at all the Stations on the Railway,”* and gave how many minutes each town’s time was behind it: Reading 4, Steventon 5½, Chippenham 8, Bath 11, Bristol 11, Bridgewater 14. Show the number line.",
        "**The rule.** A town’s clock is *behind*, so to find London time, count on: **London time = town time + minutes behind.** Work Bath together: its clock says 11:52, plus 11 minutes is 12:03 London time, and the 12:00 train has gone. A traveler who forgot that London time was ahead risked missing the train.",
        "**The other way.** The stationmaster’s clock must say London time. If the telegraph brings 12:10 and Reading’s clock shows 12:06, wind it on 4 minutes. Bristol’s Exchange clock solved the problem with two minute hands: a red one for London time and a black one for Bristol’s own.",
        "**Offsets.** Write each town as a signed number: London 0, Reading −4, Bath −11. The difference between two towns is the distance between their numbers: from Reading to Bath is 11 − 4 = 7 minutes."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Convert, compare and test railway time at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Show the minutes you add or take away."]},
      "body": ["Students choose a handout. All three use the timetable’s minutes; the train times and the 12:10 telegraph are the workshop’s game."]}),
    ("levels", {
      "green": "Read the timetable; convert London noon to town time; decide two train puzzles with a frame; wind on two station clocks.",
      "yellow": "Solve all four train puzzles; do the stationmaster’s job for four towns; use Bristol’s two-handed clock; compare towns with signed offsets.",
      "red": "Plot minutes behind against degrees west, find the rate, check it against Earth’s turning, and judge which timetable figures fit; find the angle between two minute hands."}),
    ("section", {"label": "Debrief · 8 minutes", "title": "Who caught the train?",
      "screen": [
        {"phase": "Debrief", "minutes": 5, "script": [0], "title": "The four trains", "show": "chart", **CHART,
         "purpose": "Check the four puzzles and the rule behind them.",
         "students": ["Which travelers missed their trains?", "What one rule solves every puzzle?"]},
        review_step(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Project the chart and reveal the four trains one by one. Ask a Red Level student: *what pattern did the data show, and which figures did not fit it?* Then ask why one standard time for the whole country made railway timetables easier.",
               "Put the objectives back up as *“Can you now…?”* for a thumb up, sideways or down."]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Trains:** see the chart on page 3. **Stationmaster** (London 12:10): Reading 12:06, wind on 4; Chippenham 12:02, 8; Bath 11:59, 11; Bridgewater 11:56, 14.",
      "**Bristol:** when the red hand shows 12:30, the black hand shows 12:19.",
      "**Red:** the Plymouth figure gives 16.5 ÷ 4.14 ≈ 4 minutes per degree, which matches 24 × 60 ÷ 360 = 4. Reading and Chippenham sit close to the line; Bath, Bristol and Bridgewater sit above it. The exhibition does not say why: accept reasoned suggestions. Predict: about 6 minutes, so 2:54 p.m. Angle between minute hands: 6° per minute, so Bridgewater 84°, Bath 66°.",
      "**Yellow journey:** 9:04 to 10:41 London time, 1 hour 37 minutes; Bath is 7 minutes further behind than Reading.",
      "**Exit ticket:** *(an invented time) Bridgewater’s clock says 9:50. What time is it in London?* (10:04)"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The 1841 timetable, and the four trains",
                 "body": ["Each town’s minutes behind London, from the Great Western Railway’s 1841 timetable as the Inventions Workshop gives them, with what its clock said when London’s said noon."]}),
    ("html", timetable()),
    ("html", puzzle_key()),
    ("cards", [
      ("1847", ["The Railway Clearing House adopted Greenwich Mean Time across Great Britain: “Railway Time.” The clockmaker Benjamin Lewis Vulliamy made a gold watch with two minute hands, one for Greenwich time and one for the town visited."]),
      ("1852–1855", ["Accurate time signals from Greenwich went out over the electric telegraph. By 1855 nearly all public authorities, such as churches and town halls, set their clocks to railway time."]),
      ("1880", ["Greenwich Mean Time became Britain’s legal standard time. Bristol’s Exchange clock, first installed in 1822, still shows two minute hands: red for Greenwich, black for Bristol."])]),
    ("connection", ["**Visit the exhibition:** at the railway bench of the *Inventions Workshop,* drag the Sun west across the map, steam down the line comparing your watch with each town clock, catch the train, wind on the station clocks, and set Bristol’s two-handed clock."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Before the railways, every town in Britain set its clocks by the Sun, so the further west, the later its clocks. But the trains ran by **London time**. In 1841 the Great Western Railway’s timetable told travelers how many minutes each town’s time was behind London’s."]

H_CSS = PLAN_CSS + """
.tg { display: grid; grid-template-columns: 0.78fr 1.22fr; gap: 10pt; align-items: start; break-inside: avoid; }
.tg table.tt { font-size: 8.4pt; } .tg table.tt th { font-size: 6.4pt; letter-spacing: .08em; } .tg table.tt td { padding: 2.6pt 5pt 2.6pt 0; }
.frame { font-size: 10pt; line-height: 2.3; margin: 2pt 0 6pt; }
.frame u { display: inline-block; min-width: 54pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.pz { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); padding: 5pt 9pt 3pt; margin: 4pt 0 8pt; break-inside: avoid; }
.pz b.tw { font: 600 13pt 'Cormorant Garamond', serif; margin-right: 6pt; }
.rule2 { border-left: 3pt solid #1d1c1a; padding: 3pt 0 3pt 9pt; margin: 4pt 0 8pt; font-size: 9.6pt; }
.rule { border: 1pt dashed #6f6c62; border-radius: 4pt; padding: 4pt 8pt; font-size: 8.8pt; background: rgba(255,255,255,.55); margin: 4pt 0 8pt; }
table.tt td.blank { border-bottom: .8pt solid #6f6c62; }
"""

handout = handout_maker(DIR, TITLE, "Grades 5–8 · Math", "Grades 5–8 Math", CONTEXT, HERO, H_CSS)

RULE_BOX = '<div class="rule2"><b>London time = town time + minutes behind</b><br>Town time = London time − minutes behind</div>'
GAME = '<div class="rule">The train times and the 12:10 telegraph are the Inventions Workshop’s game; the minutes behind London are the 1841 timetable’s.</div>'


def pz_frame(town, train, clock):
    return (f'<div class="pz"><b class="tw">{town}</b> The train leaves at <b>{t(train)}, London time</b>. {town}’s own clock says <b>{t(clock)}</b>.'
            f'<p class="frame">Town clock <u></u> + minutes behind <u></u> = London time <u></u>. &nbsp;Caught or missed? <u style="min-width:70pt"></u></p></div>')


def pz_open(town, train, clock):
    return (f'<div class="pz"><b class="tw">{town}</b> The train leaves at <b>{t(train)}, London time</b>. {town}’s own clock says <b>{t(clock)}</b>. '
            f'Caught or missed, and by how many minutes?<p class="frame">London time <u></u> &nbsp; Result <u style="min-width:150pt"></u></p></div>')


def blank_table(head, first_col, extra_cols):
    h = "".join(f"<th>{x}</th>" for x in head)
    rows = "".join("<tr><td>" + c + "</td>" + "".join('<td class="blank"></td>' for _ in range(extra_cols)) + "</tr>" for c in first_col)
    return f'<table class="tt"><thead><tr>{h}</tr></thead><tbody>{rows}</tbody></table>'


GREEN = handout("green", "VIC_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Read the timetable",
            "blocks": [("html", "<p>Each number tells how many minutes the town’s clock was <b>behind</b> London’s. When London’s clock said 12:00 noon, the town’s clock said an earlier time. Fill in the last column.</p>"
                        + blank_table(["Town", "Minutes behind London", "Town clock when London says 12:00"],
                                      ["London · 0", "Reading · 4", "Chippenham · 8", "Bath · 11", "Bridgewater · 14"], 1)
                        .replace("<td>London · 0</td><td class=\"blank\"></td>", "<td>London · 0</td><td>12:00</td>")
                        .replace("<th>Minutes behind London</th>", "")
                        .replace("<th>Town</th>", "<th>Town · minutes behind London</th>"))],
            "body": ["Which town’s clock was furthest behind? ______________ Is it east or west of London? ________"]}),
  ("task", {"label": "Part 2", "title": "Will you catch the train?",
            "blocks": [("html", RULE_BOX + pz_frame("Reading", 15 * 60, 14 * 60 + 50) + pz_frame("Bath", 12 * 60, 11 * 60 + 52))]}),
  ("task", {"label": "Part 3", "title": "You’re the stationmaster",
            "blocks": [("html", "<p>The telegraph brings London time: <b>12:10</b>. Every station clock must say London time. Each clock still shows its town’s own time. How far must you wind it on?</p>"
                        + blank_table(["Station", "Its clock shows", "Wind on (minutes)"], ["Reading (4 behind)", "Chippenham (8 behind)"], 2))]}),
  ("task", {"label": "Part 4", "title": "Why one time?",
            "body": ["A traveler who forgot that London time was ahead of the town’s own time risked missing the train. Why would one time for every town make train travel easier?"], "lines": 3}),
  ("connection", ["At the railway bench of the *Inventions Workshop,* drag the Sun west across the map. Which town does noon reach last? ____________"]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Four trains",
            "blocks": [("html", RULE_BOX + "".join(pz_open(*p) for p in PUZZLES))]}),
  ("task", {"label": "Part 2", "title": "You’re the stationmaster",
            "blocks": [("html", "<p>The telegraph brings London time: <b>12:10</b>. Use the timetable (Reading 4, Chippenham 8, Bath 11, Bridgewater 14 minutes behind).</p>"
                        + blank_table(["Station", "Its clock shows", "Wind on (minutes)"], JOB_TOWNS, 2))]}),
  ("task", {"label": "Part 3", "title": "Bristol’s two minute hands",
            "body": ["Bristol’s Exchange clock has a red minute hand for London time and a black one for Bristol’s own time, 11 minutes behind. The red hand says **12:10**. What does the black hand say? ________ Your train leaves at **12:30 London time**. What will the black hand say then? ________"]}),
  ("task", {"label": "Part 4", "title": "Signed offsets",
            "body": ["Write each town as a signed number of minutes from London: London 0, Reading −4. Then: Bath ____ Chippenham ____ Bridgewater ____",
                     "How many minutes is Bath’s clock behind Reading’s? Show it as a distance between two numbers."], "lines": 2}),
  ("task", {"label": "Part 5", "title": "A day’s journey",
            "body": ["*An invented journey:* a traveler leaves Reading when Reading’s clock says 9:00 a.m. and arrives in Bath when Bath’s clock says 10:30 a.m. How long did the journey really take? Explain why it is not 1 hour 30 minutes."], "lines": 3}),
  ("html", GAME),
])


def plot_grid():
    # degrees west 0–4.5 across, minutes behind 0–18 up
    W, H, L, B = 330, 190, 30, 22
    sx, sy = (W - L - 8) / 4.5, (H - B - 8) / 18
    g = []
    for i in range(10):
        x = L + i * 0.5 * sx
        g.append(f'<line x1="{x:.1f}" y1="8" x2="{x:.1f}" y2="{H - B}" stroke="#b9b5aa" stroke-width="{0.9 if i % 2 == 0 else 0.4}"/>')
        if i % 2 == 0:
            g.append(f'<text x="{x:.1f}" y="{H - B + 11}" font-size="7.5" text-anchor="middle">{i // 2}</text>')
    for j in range(0, 19):
        y = H - B - j * sy
        g.append(f'<line x1="{L}" y1="{y:.1f}" x2="{W - 8}" y2="{y:.1f}" stroke="#b9b5aa" stroke-width="{0.9 if j % 2 == 0 else 0.4}"/>')
        if j % 2 == 0:
            g.append(f'<text x="{L - 4}" y="{y + 2.5:.1f}" font-size="7.5" text-anchor="end">{j}</text>')
    g.append(f'<text x="{(L + W) / 2:.0f}" y="{H - 1}" font-size="7.5" text-anchor="middle" letter-spacing=".08em">DEGREES WEST OF GREENWICH</text>')
    g.append(f'<text x="9" y="{(H - B) / 2:.0f}" font-size="7.5" text-anchor="middle" transform="rotate(-90 9 {(H - B) / 2:.0f})" letter-spacing=".08em">MINUTES BEHIND</text>')
    return f'<svg viewBox="0 0 {W} {H}" style="width:100%;max-width:{W * 1.25:.0f}pt;display:block;margin:4pt 0 6pt;font-family:Outfit">' + "".join(g) + "</svg>"


RED = handout("red", "VIC_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Plot the timetable",
            "blocks": [("html", "<p>The table gives each town’s minutes behind (the 1841 timetable’s, and Plymouth’s behind Greenwich) and how far west of Greenwich the town lies, in degrees, from the exhibition’s map. Plot every town.</p>"
                        + '<div class="tg"><div>' + timetable(with_noon=False, with_degrees=True, plymouth=True) + '</div>' + plot_grid() + '</div>')]}),
  ("task", {"label": "Part 2", "title": "Find the rate",
            "body": ["Use Plymouth: about how many minutes behind for each degree west? Show your division. ________",
                     "Check it another way. The Earth turns once, 360 degrees, in 24 hours. How many minutes does it take to turn one degree? ________ Do your two answers agree?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Test the timetable",
            "body": ["Draw the line through (0, 0) with your rate. Which towns sit close to it? Which sit above it? The exhibition does not say why. Suggest two reasons a timetable of 1841 might give a different figure from your calculation."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Predict",
            "body": ["*An invented town:* it lies 1.5 degrees west of Greenwich. Use your rate: about how many minutes behind would its clock be? When Greenwich says 3:00 p.m., what would its clock say?"], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Two minute hands",
            "body": ["In 1847 the clockmaker Benjamin Lewis Vulliamy made a gold watch with two minute hands: one for Greenwich time, one set to the town the traveler visited. A minute hand turns 360 degrees in 60 minutes. In Bridgewater, 14 minutes behind, what angle lies between the two hands? In Bath? Show your working."], "lines": 3}),
  ("html", GAME),
  ("connection", ["At the railway bench of the *Inventions Workshop,* drag the Sun west across the map and watch noon reach each town. Does the order match your graph?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
