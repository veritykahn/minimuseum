"""Grades 5–8 Math · "How Far Is Far?"
Rates, unit conversion, very large numbers and scale, from the exhibition's
own numbers: Voyager 1 (launched 1977, nearly 38,000 mph, almost 50 years to
travel one light-day, about 16 billion miles); HD 20794 d (20 light-years,
about 7,300 light-days, a 647-day year); the poster's claim that the journey
would take hundreds of thousands of years; the Moon (238,855 miles, drifting
1.5 inches a year; from about 260°F to about −280°F); the Apollo samples
(842 pounds, 2,200 samples); the microscope (10× eyepiece, 4×/10×/40×
objectives; Apollo 17 beads 150 to 250 microns, magnified 31.5 times).
Facts: app/exhibitions/moon/moon.ts, microscope/slides.ts and stage.ts."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (SLIDES, VOYAGER, P2, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS, hero_slide, quote, review)

DIR = "teachers/grades-5-8/math/"
TITLE = "How Far Is Far?"
SUB = "Grades 5–8 Math · Our Incredible Moon and Another Earth · Rates, scale and very large numbers"
HERO = hero_slide("moon-glass", "center 45%")

CLAIM = P2["travel"]
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("use a rate to find a distance: miles per hour, to miles per day, to miles per year",
     "use a rate to find a distance traveled?", False),
    ("convert between units of time and distance: light-years to light-days",
     "convert light-years to light-days?", False),
    ("estimate with very large numbers, and check a claim made with them",
     "estimate with very large numbers, and check a claim?", False),
    ("write very large numbers in scientific notation and use a scale to make them imaginable",
     "use scientific notation and a scale to make a huge distance imaginable?", True)],
  "why": "Numbers this large stop meaning anything unless we can check them and picture them. A careful estimate is how a scientist, or a reader, knows whether to believe a claim."}

# ── on the classroom screen ────────────────────────────────────────────
WORKED_VOYAGER = [
  {"title": "One day", "steps": ["Voyager 1 cruises at nearly **38,000 miles per hour**.", "A day has 24 hours: **38,000 × 24**."],
   "answer": "912,000 miles a day"},
  {"title": "One year", "steps": ["A year has 365 days: **912,000 × 365**."], "answer": "about 333 million miles"},
  {"title": "Since 1977", "steps": ["From 1977 to 2026 is **49 years**: 333 million × 49."],
   "answer": "about 16 billion miles: one light-day"}]
WORKED_CLAIM = [
  {"title": "Light-years to light-days", "steps": ["HD 20794 d is about **20 light-years** away.", "Each year has 365 days: **20 × 365**."],
   "answer": "7,300 light-days"},
  {"title": "At Voyager’s speed", "steps": ["Voyager takes almost **50 years** for each light-day.", "**7,300 × 50**."],
   "answer": "about 365,000 years"},
  {"title": "Check the claim", "steps": ["The poster says *hundreds of thousands of years*.", "Is 365,000 hundreds of thousands?"],
   "answer": "Yes: the claim holds"}]
CHART = {"caption": "How far, in light-days? (one light-day is about 16 billion miles)", "columns": ["Destination", "Distance", "In light-days"],
         "rows": [{"cells": ["The Moon", "238,855 miles", "a tiny fraction of one"]},
                  {"cells": ["Voyager 1, in November 2026", "about 16 billion miles", "1"]},
                  {"cells": ["Proxima Centauri b", "4.2 light-years", "4.2 × 365 = ?"]},
                  {"cells": ["HD 20794 d", "about 20 light-years", "about 7,300"]}]}
EXIT_Q = ["Proxima Centauri b, the closest known exoplanet, is 4.2 light-years away. About how many light-days is that?",
          "At Voyager’s speed, about how many years would the trip take?"]

INK = "#1d1c1a"
CSS = BASE_CSS + """
table.fill td { height: 24pt; }
.work { border: .8pt dashed #a9a69b; border-radius: 4pt; height: 64pt; margin: 4pt 0 8pt; }
.fillin p { margin: 0 0 10pt; line-height: 1.55; }
.fillin u { display: inline-block; min-width: 80pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.steps { border-left: 2pt solid var(--accent); padding: 2pt 0 2pt 10pt; margin: 2pt 0 8pt; font-size: 10pt; }
.steps p { margin: 0 0 4pt; }
.key h4 { font: 600 11pt 'Cormorant Garamond', serif; margin: 5pt 0 1pt; }
.key ol { margin: 0 0 3pt 14pt; padding: 0; font-size: 8.9pt; line-height: 1.4; }
.key .label { margin-top: 4pt; }
table.chart { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 4pt 0 10pt; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: 1pt solid var(--accent); padding: 3pt 6pt; }
table.chart td { border-bottom: .5pt solid #d8d0b8; padding: 4pt 6pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

def work(h=64):
    return ("html", f'<div class="work" style="height:{h}pt"></div>')

def chart_html():
    head = "".join(f"<th>{c}</th>" for c in CHART["columns"])
    rows = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r["cells"]) + "</tr>" for r in CHART["rows"])
    return ("html", f'<table class="chart"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>')

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "how-far-is-far",
  "out": DIR + "MOON_LP_Math.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Math", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 22, "#86671A"), ("Close", 6, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will be able to do",
      "body": ["Students will take the exhibition’s numbers, from the speed of Voyager 1 to the distance of the super-Earth HD 20794 d, and use rates, unit conversion and estimation to check the poster’s claim that the journey would take *hundreds of thousands of years*. At higher levels they will write the distances in scientific notation and shrink them to a scale they can picture."]}),
    ("section", {"label": "Standards", "list": [
      "**Ratios and proportional reasoning** — unit rates; converting units (6.RP.A.3b, 6.RP.A.3d)",
      "**The number system and expressions** — multi-digit operations; estimation; positive and negative numbers (6.NS.B.3, 6.NS.C.5, 7.EE.B.3)",
      "**Expressions and equations** — scientific notation for very large quantities (8.EE.A.3, 8.EE.A.4)",
      "**Mathematical practice** — construct viable arguments and critique the reasoning of others (MP3)"]}),
    ("section", {"label": "Materials needed", "list": [
      "Calculators for the Red level; paper for working",
      "Page 3 of this plan (the answer key); differentiated handouts, one per student"]}),
    ("section", {"label": "Cross-curricular and assessment notes", "body": [
      "**Science:** light-years, the habitable zone and the microscope. **ELA:** checking a claim. **Assessment:** the handout, the exit ticket, and at Red the scale model in Part 3. All numbers come from the exhibition; rounded answers are marked *about*."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Is it true?",
      "screen": [
        {"phase": "Hook", "minutes": 2, "script": [0], "title": "Still traveling", "show": "listen", "clips": [VOYAGER],
         "question": "Voyager 1 left Earth in 1977. How far do you think it has gone?",
         "purpose": "Wonder at the speed and the distance before any numbers are worked.",
         "students": ["Guess: how far has Voyager 1 traveled since 1977?"]},
        {"phase": "Hook", "minutes": 3, "script": [1], "title": "The claim", "show": "words", "text": CLAIM, "cite": "Another Earth",
         "purpose": "Meet the claim the lesson will check.",
         "students": ["Thousands? Hundreds of thousands? Millions?", "Write your guess before we work it out."]}],
      "body": ["Play the Voyager sound. *“This spacecraft left Earth in 1977. It is still traveling, at nearly 38,000 miles an hour. How far do you think it has gone?”* Take guesses.",
               "Then read the poster: *“" + CLAIM + "”* Students write a guess: thousands of years, hundreds of thousands, or millions? *“By the end of the lesson, you will check it.”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "Rate, convert, estimate",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Voyager’s light-day", "show": "worked", "examples": WORKED_VOYAGER,
         "purpose": "Use a rate, step by step, to reach one light-day.",
         "students": ["Why multiply by 24, then by 365?", "Why is the answer marked *about*?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Check the claim", "show": "worked", "examples": WORKED_CLAIM,
         "purpose": "Convert units, estimate, and judge the poster’s claim.",
         "students": ["Was your guess close?", "Why multiply light-days by 50?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "How far, in light-days?", "show": "chart", **CHART,
         "purpose": "Compare four distances in one unit.",
         "students": ["Which is nearest? Which is farthest?", "Work out Proxima Centauri b in light-days."]}],
      "body": [
        "**A rate, step by step.** Voyager 1 cruises at nearly 38,000 miles per hour. Per day: 38,000 × 24 = 912,000 miles. Per year: 912,000 × 365 ≈ 333 million miles. From 1977 to 2026 is 49 years: 333 million × 49 ≈ 16 billion miles. The poster says Voyager takes almost 50 years, until November 2026, to travel one **light-day**, about 16 billion miles: the distance light travels in a day. Our working agrees.",
        "**Convert, then estimate.** HD 20794 d is about 20 light-years away: 20 × 365 = 7,300 light-days, the number the poster gives. At almost 50 years for each light-day: 7,300 × 50 = 365,000 years. The claim, *hundreds of thousands of years*, holds.",
        "**One unit.** Put four distances in light-days on the chart: the Moon (238,855 miles, a tiny fraction of one), Voyager 1, Proxima Centauri b (4.2 light-years) and HD 20794 d."]}),
    ("section", {"label": "Activity · 22 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice rates, conversions and estimates at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the exhibition’s own numbers."]},
      "body": ["Students choose a handout. All three use the exhibition’s own numbers; the answer key is page 3."]}),
    ("levels", {
      "green": "Guided steps: Voyager’s miles in a day, light-years to light-days, the Moon’s drift over 10 and 100 years, and the Moon’s temperature swing on a number line.",
      "yellow": "Voyager per year and since 1977, check the poster’s claim, the Moon’s drift in centimeters, the Apollo samples per sample, and the temperature swing in °F and °C.",
      "red": "Scientific notation for the distance to HD 20794 d, the speed needed to arrive in 100 years, a scale model with the Moon at 1 cm, and the microscope’s magnification."}),
    ("cols", [
      [("section", {"label": "Close · 6 minutes", "title": "Exit ticket",
        "screen": [
          {"phase": "Close", "minutes": 3, "script": [0], "title": "Exit ticket", "show": "question", "question": EXIT_Q[0],
           "purpose": "Check that each student can convert and estimate alone.",
           "students": EXIT_Q},
          review(OBJECTIVES, 3, [1], hint=THUMBS)],
        "body": [f"*1. {EXIT_Q[0]}* (4.2 × 365 ≈ 1,533.) *2. {EXIT_Q[1]}* (1,533 × 50 ≈ 77,000 years.)",
                 "Then ask the objectives back as questions: *“Can you now…?”*"]})],
      [("connection", ["**On the posters:** *Our Incredible Moon* gives the Moon’s distance and drift, the Apollo samples and the temperatures; *Another Earth* gives Voyager 1 and HD 20794 d. In **Under the Microscope**, the lens buttons multiply: a 10× eyepiece over a 40× objective makes 400×."])]]),
    ("pagebreak", None),
    ("section", {"label": "Answer key", "title": "Answers with working",
      "body": ["**Rounding.** The exhibition’s numbers are themselves rounded: *nearly* 38,000 mph, *about* 16 billion miles, *almost* 50 years. Accept answers that round sensibly, and reward students who say *about*. **Years since 1977.** Voyager launched in 1977; by November 2026 it has traveled for about 49 years."]}),
    ("html", """<div class="cols key"><div>
<p class="label">Green level</p>
<h4>Part 1 · Voyager’s day</h4><ol><li>38,000 × 24 = <b>912,000 miles</b> a day</li></ol>
<h4>Part 2 · Light-days</h4><ol><li>2 light-years = <b>730</b>; 10 light-years = <b>3,650</b>; 20 light-years = <b>7,300</b> light-days</li></ol>
<h4>Part 3 · The drifting Moon</h4><ol><li>10 years: <b>15 inches</b>; 100 years: <b>150 inches</b> (12½ feet)</li></ol>
<h4>Part 4 · Hot and cold</h4><ol><li>From 260°F to 0°F is 260; from 0°F to −280°F is 280; <b>540°F</b> in all</li></ol>
<h4>Part 5 · To the Moon</h4><ol><li>240,000 ÷ 40,000 = <b>6 hours</b>: yes, well under a day</li></ol>
<p class="label">Yellow level</p>
<h4>Part 1 · Voyager</h4><ol><li>912,000 × 365 = <b>332,880,000</b>, about 333 million miles a year; × 49 ≈ <b>16.3 billion</b> miles: about one light-day</li></ol>
<h4>Part 2 · The claim</h4><ol><li>20 × 365 = <b>7,300</b>; 7,300 × 50 = <b>365,000 years</b>: hundreds of thousands. The claim holds.</li></ol>
<h4>Part 3 · The drifting Moon</h4><ol><li>3.8 × 1,000 = 3,800 cm = <b>38 m</b>; in a million years, 3,800,000 cm = <b>38 km</b></li></ol>
</div><div>
<h4>Part 4 · Moon samples</h4><ol><li>842 ÷ 2,200 ≈ <b>0.38 lb</b>; 382 kg ÷ 2,200 ≈ 0.174 kg ≈ <b>174 g</b> per sample, on average</li></ol>
<h4>Part 5 · Hot and cold</h4><ol><li><b>540°F</b> and 127 − (−173) = <b>300°C</b>; 540 ÷ 300 = <b>1.8</b>: a change of 1°C is a change of 1.8°F</li></ol>
<p class="label">Red level</p>
<h4>Part 1 · Scientific notation</h4><ol><li>16 billion = <b>1.6 × 10¹⁰</b> miles; 7,300 × 1.6 × 10¹⁰ = 11,680 × 10¹⁰ ≈ <b>1.17 × 10¹⁴</b> miles</li></ol>
<h4>Part 2 · In 100 years?</h4><ol><li>100 years = 876,000 hours; 1.17 × 10¹⁴ ÷ 876,000 ≈ <b>1.3 × 10⁸ mph</b>, about 130 million mph: roughly <b>3,500 times</b> Voyager’s speed</li></ol>
<h4>Part 3 · A scale model</h4><ol><li>1.17 × 10¹⁴ ÷ 238,855 ≈ 4.9 × 10⁸, so <b>about 490 million cm</b>, or about <b>4,900 km</b>, if the Moon is 1 cm away</li></ol>
<h4>Part 4 · Under the microscope</h4><ol><li>10 × 4 = <b>40×</b>, 10 × 10 = <b>100×</b>, 10 × 40 = <b>400×</b>. Beads 150–250 microns × 31.5 ≈ <b>4,700–7,900 microns</b>: about <b>5 to 8 mm</b> on the screen</li></ol>
<h4>Part 5 · Two scales</h4><ol><li>°F = 1.8 × °C + 32: 1.8 × 127 + 32 = 260.6 ≈ <b>260°F</b>; 1.8 × (−173) + 32 = −279.4 ≈ <b>−280°F</b>. The poster agrees.</li></ol>
</div></div>"""),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["NASA’s Voyager 1, launched in 1977 and cruising at nearly 38,000 miles per hour, takes almost 50 years to travel one light-day: about 16 billion miles. The super-Earth HD 20794 d is about 20 light-years away. How far is far? Today you check the numbers."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 Math · Our Incredible Moon and Another Earth", "level": level, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 5–8 Math · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

GREEN = handout("green", "MOON_Handout_Green_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Voyager’s day",
            "blocks": [("html", '<div class="steps"><p><b>Worked example.</b> In one hour, Voyager travels nearly 38,000 miles.</p>'
                                '<p>In 2 hours: 38,000 × 2 = 76,000 miles.</p></div>')],
            "body": ["A day has 24 hours. How far does Voyager travel in one day? Show your working."]}),
  work(54),
  ("task", {"label": "Part 2", "title": "Light-years to light-days",
            "blocks": [P("A light-year is the distance light travels in a year. A year has 365 days, so <b>1 light-year = 365 light-days</b>."),
                       ("html", '<div class="fillin"><p>2 light-years = 2 × 365 = <u></u> light-days</p>'
                                '<p>10 light-years = <u></u> light-days</p>'
                                '<p>HD 20794 d is 20 light-years away = <u></u> light-days</p></div>')]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "The drifting Moon",
            "blocks": [P("The Moon is slowly drifting away from Earth, by about <b>1.5 inches</b> every year."),
                       ("html", '<div class="fillin"><p>In 10 years: 1.5 × 10 = <u></u> inches</p>'
                                '<p>In 100 years: <u></u> inches</p></div>')]}),
  ("task", {"label": "Part 4", "title": "Hot and cold",
            "blocks": [P("The Moon’s surface swings from about <b>260°F</b> in full sunlight to about <b>−280°F</b> in the dark. Mark both on the number line."),
                       ("html", '<svg viewBox="0 0 440 50" width="100%" style="max-width:380pt;display:block;margin:4pt auto 6pt" aria-hidden="true">'
                                f'<line x1="10" y1="22" x2="430" y2="22" stroke="{INK}" stroke-width="1.5"/>'
                                + "".join(f'<line x1="{10 + i * 42}" y1="16" x2="{10 + i * 42}" y2="28" stroke="{INK}" stroke-width="1"/>'
                                          f'<text x="{10 + i * 42}" y="44" font-family="Outfit" font-size="9.5" text-anchor="middle">{-300 + i * 60}</text>' for i in range(11))
                                + '</svg>'),
                       ("html", '<div class="fillin"><p>From 260°F down to 0°F is <u></u> degrees. From 0°F down to −280°F is <u></u> degrees.</p>'
                                '<p>So the surface swings by <u></u> degrees in all.</p></div>')]}),
  ("task", {"label": "Part 5", "title": "To the Moon at Voyager’s speed",
            "blocks": [P("The Moon is about <b>238,855 miles</b> away. Round it to 240,000, and round Voyager’s speed to 40,000 miles per hour."),
                       ("html", '<div class="fillin"><p>240,000 ÷ 40,000 = <u></u> hours</p>'
                                '<p>Would Voyager reach the Moon in less than one day? <u></u></p></div>')]}),
  ("family", ["Tell your family how far Voyager 1 travels in one day. Then work out together how far you travel in a day, and how many days you would need to reach the Moon, about 238,855 miles away."]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Voyager 1",
            "body": ["Voyager 1 travels nearly 38,000 miles per hour. How far does it travel in a day? In a year? From 1977 to 2026 is 49 years: about how far is that? Does your answer match the poster’s *about 16 billion miles*?"]}),
  work(80),
  ("task", {"label": "Part 2", "title": "Check the claim",
            "blocks": [quote(CLAIM, "Another Earth")],
            "body": ["HD 20794 d is 20 light-years away. How many light-days is that? If each light-day takes Voyager almost 50 years, about how many years would the trip take? Is the poster right?"]}),
  work(70),
  ("task", {"label": "Part 3", "title": "The drifting Moon",
            "body": ["The Moon drifts about **3.8 centimeters** farther from Earth each year. How far is that in 1,000 years, in meters? In a million years, in kilometers?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Moon samples",
            "body": ["Between 1969 and 1972, six Apollo missions brought back **842 pounds (382 kilograms)** of Moon rocks, pebbles, sand and dust: **2,200** samples in all. On average, about how much did one sample weigh, in pounds and in grams?"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "Hot and cold",
            "body": ["The surface swings from about **260°F (127°C)** in sunlight to about **−280°F (−173°C)** in the dark. Find the size of the swing in °F and in °C. Divide one by the other: what does your answer tell you?"], "lines": 3}),
  ("family", ["Ask your family to guess how long it would take to reach HD 20794 d at Voyager’s speed. Then show them how you checked."]),
])

RED = handout("red", "MOON_Handout_Red_Math.pdf", [
  ("task", {"label": "Part 1", "title": "Scientific notation",
            "body": ["One light-day is about 16 billion miles. Write that in scientific notation. HD 20794 d is about 7,300 light-days away: how many miles is that, in scientific notation, to two decimal places?"]}),
  work(80),
  ("task", {"label": "Part 2", "title": "In a lifetime?",
            "body": ["With current technology, the trip would take hundreds of thousands of years. How fast, in miles per hour, would a spacecraft need to travel to arrive in **100 years**? How many times Voyager’s 38,000 mph is that?"]}),
  work(100),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "A scale model",
            "body": ["The Moon is about **238,855 miles** away. In a model, the Moon is **1 cm** from Earth. How far away would HD 20794 d be in the model? Give your answer in a unit that makes sense, then name a place about that far from you."]}),
  work(96),
  ("task", {"label": "Part 4", "title": "Under the microscope",
            "body": ["The microscope room has a **10×** eyepiece and objectives of **4×, 10× and 40×**. What are the three total magnifications? A photograph shows Apollo 17 beads **150 to 250 microns** across, magnified **31.5** times. How big do they appear, in millimeters? (1 mm = 1,000 microns)"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "Two scales",
            "body": ["The poster gives about 127°C as 260°F, and about −173°C as −280°F. Use °F = 1.8 × °C + 32 to check both. Are the poster’s numbers fair roundings?"], "lines": 3}),
  ("family", ["Show your family your scale model: if the Moon were 1 cm away, how far would HD 20794 d be? Ask them to guess first."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
