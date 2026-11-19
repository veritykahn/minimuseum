"""Grades 5–8 Science · "Planet Hunters"
Poster 2, Another Earth: how astronomers find planets they cannot see (dips in
a star's light; a star's wobble), Kepler, HD 20794 d and the habitable zone,
and Webb reading starlight through an atmosphere. Students model a transit
with a lamp and a ball, then read light curves. Every light curve on the
handouts is practice data, invented for the worksheet, and says so. Facts:
app/exhibitions/moon/moon.ts (poster 2 and MOON_NOTES.orbit)."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import (THREE_MOONS, RINGED, KEPLER, WEBB, P2, OBJ_CSS, FLOW_CSS, BASE_CSS, THUMBS,
                          quote, review, light_curve)

DIR = "teachers/grades-5-8/science/"
TITLE = "Planet Hunters"
SUB = "Grades 5–8 Science · Another Earth · Finding planets we cannot see"
HERO = {"img": THREE_MOONS, "pos": "center 40%"}

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain the two clues astronomers use to find planets they cannot see: a dip in a star’s light, and a star’s wobble",
     "explain the two clues astronomers use to find hidden planets?", False),
    ("read a light curve to find when a planet passes its star, and how long its year is",
     "read a light curve to find a planet’s year?", False),
    ("describe a habitable zone, and use the facts about HD 20794 d to say what we know and do not know about it",
     "say what we know, and do not know, about HD 20794 d?", False),
    ("judge a claim about another Earth, weighing evidence for it, against it, and still missing",
     "judge a claim about another Earth, using evidence for, against and missing?", True)],
  "why": "Most of what astronomers know about other worlds comes from clues in starlight, not from pictures. Reading indirect evidence well is one of the most useful skills in science."}

# ── drawings ───────────────────────────────────────────────────────────
INK = "#1d1c1a"
ZONE = ('<svg viewBox="0 0 300 200" width="100%" aria-hidden="true" style="max-width:250pt;display:block;margin:2pt auto 6pt">'
        '<defs><radialGradient id="st"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#f2b84b"/></radialGradient></defs>'
        '<ellipse cx="150" cy="100" rx="122" ry="86" fill="#cdeee6" stroke="#4a8f80" stroke-width="1.2"/>'
        '<ellipse cx="150" cy="100" rx="70" ry="49" fill="#f6f1e4" stroke="#4a8f80" stroke-width="1.2"/>'
        '<ellipse cx="160" cy="100" rx="98" ry="60" fill="none" stroke="#5b2a91" stroke-width="2" stroke-dasharray="6 4"/>'
        '<circle cx="150" cy="100" r="13" fill="url(#st)" stroke="#c48a1c"/>'
        '<circle cx="258" cy="100" r="6" fill="#5b2a91"/>'
        '<g font-family="Outfit" font-size="9.5" fill="#1d1c1a"><text x="150" y="80" text-anchor="middle">star</text>'
        '<text x="150" y="28" text-anchor="middle">habitable zone</text>'
        '<text x="268" y="96">planet</text></g></svg>')

def labels(items):
    return ("html", '<div class="circ">' + "".join(f"<span>{i}</span>" for i in items) + "</div>")

CSS = BASE_CSS + """
.circ { display: flex; gap: 10pt; flex-wrap: wrap; margin: 4pt 0 8pt; }
.circ span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 11pt; font-size: 10pt; background: rgba(255,255,255,.6); }
.fillin p { margin: 0 0 11pt; line-height: 1.5; }
.fillin u { display: inline-block; min-width: 86pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.matchq { display: grid; grid-template-columns: 1fr 14pt 40pt 14pt 1fr; gap: 8pt 10pt; align-items: center; margin: 4pt 0 8pt; font-size: 10pt; }
.matchq .b { border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 5pt 8pt; background: rgba(255,255,255,.55); }
.matchq .d { width: 9pt; height: 9pt; border-radius: 50%; background: #1d1c1a; justify-self: center; }
table.fill td { height: 24pt; }
.key h4 { font: 600 11pt 'Cormorant Garamond', serif; margin: 5pt 0 1pt; }
.key ol { margin: 0 0 3pt 14pt; padding: 0; font-size: 8.9pt; line-height: 1.4; }
.key .label { margin-top: 4pt; }
"""

def P(t):
    return ("html", f"<p>{t}</p>")

# the practice light curves (made up)
LC_GREEN = [(4, 1.0, .6), (14, 1.0, .6), (24, 1.0, .6)]
LC_YELLOW = [(3, 1.2, .5), (11, 1.2, .5), (19, 1.2, .5), (27, 1.2, .5)]
LC_RED = [(2, .6, .4), (8, .6, .4), (14, .6, .4), (20, .6, .4), (26, .6, .4), (11, 2.0, .7)]

# ── the lesson plan ────────────────────────────────────────────────────

LESSON = {
  "slug": "planet-hunters",
  "out": DIR + "MOON_LP_Science.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Science", "hero": HERO, "css": CSS + OBJ_CSS + FLOW_CSS,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 13, "#2F4A5A"), ("Activity", 20, "#86671A"), ("Debrief", 7, "#A8452F")]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn how astronomers find planets around other stars without seeing them: by the tiny dip in a star’s light as a planet passes in front of it, or by the star’s wobble as the planet tugs on it. They will model a transit, read light curves, and weigh what the evidence about HD 20794 d shows, and what it cannot yet tell us."]}),
    ("section", {"label": "Standards", "list": [
      "**Earth and space science** — the solar system and beyond; gravity holds planets in orbit (MS-ESS1-2, MS-ESS1-3)",
      "**Science practices** — developing and using models; analyzing and interpreting data; engaging in argument from evidence",
      "**Crosscutting concepts and math** — patterns; reading a graph; finding a period from repeated events"]}),
    ("section", {"label": "Materials needed", "list": [
      "A lamp with a bare bulb or a strong flashlight (the star); a small ball on a stick or string (the planet)",
      "Optional: a phone with a light-meter app, held facing the lamp, to show the dip as a number",
      "Page 3 of this plan, projected or printed; differentiated handouts, one per student"]}),
    ("section", {"label": "Cross-curricular and assessment notes", "body": [
      "**Assessment:** the handout, the Look back, and at Red the written verdict. **Math and ELA:** periods and percents; a short argument."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A planet you can’t see",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": THREE_MOONS, "pos": "center 45%"},
                 "alt": "The poster’s alien world: purple cliffs and three moons in a violet sky",
                 "caption": P2["find_title"], "fit": "cover",
                 "purpose": "Pose the puzzle before giving the answer.",
                 "students": ["Planets around other stars are hidden in their star’s glare.", "How could you know a planet is there?"]},
      "body": ["Show the poster’s alien world. Ask its own question: *“" + P2["find_title"] + "”* A star is so bright, and its planets so small and far, that the planet is lost in the glare. Then turn on the lamp and darken the room: *“This is a star. Somewhere near it is a planet. Watch the light.”* Pass the ball between the lamp and the class, slowly."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Clues in starlight",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Two clues", "show": "words", "text": P2["find"],
         "cite": "Another Earth · How do you find a planet you can’t see?",
         "purpose": "Name the transit and the wobble, and see each in the model.",
         "students": ["What happened to the light when the ball passed?", "Why would a planet make its star wobble?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Thousands of planets", "show": "listen", "clips": [KEPLER],
         "question": "Kepler watched for dips in starlight. What did it find?",
         "purpose": "See how far the search has come, from the first finds to over 6,000.",
         "students": ["The first exoplanets were found in 1992.", "Kepler found more than 2,600. How many are confirmed today?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "A super-Earth", "show": "words", "text": P2["hd"] + " " + P2["orbit"],
         "cite": "Another Earth",
         "purpose": "Meet HD 20794 d, and the habitable zone.",
         "students": ["What is a habitable zone?", "Does HD 20794 d stay inside it all year?"]}],
      "body": [
        "**Two clues.** Read the poster: *“" + P2["find"] + "”* The ball made the lamp dim a little: that is a **transit**, and a graph of a star’s brightness over time is a **light curve**. A planet and its star tug on each other, so the star moves in a small circle: its **wobble**.",
        "**The search.** In 1992 the first exoplanets were found; in 1995, the first around a star like our Sun. Play the launch: NASA’s Kepler telescope, launched in 2009, found more than 2,600 planets by watching for dips. Today over 6,000 are confirmed.",
        "**A super-Earth.** HD 20794 d is about 20 light-years away, roughly six times Earth’s mass, in its star’s **habitable zone**: where temperatures could allow liquid water. Its year lasts about 647 days, on a stretched oval orbit that swings between the zone’s inner and outer edges. It took more than 20 years of measurements to confirm it, in 2025. Webb can now read starlight that filters through a planet’s air."]}),
    ("section", {"label": "Activity · 20 minutes", "title": "Transit lab, then the handouts",
      "screen": [
        {"phase": "Activity", "minutes": 7, "script": [0], "title": "Transit lab", "show": "question",
         "question": "Does a bigger planet make a bigger dip? What if its orbit doesn’t pass in front of the star?",
         "purpose": "Test the model: what changes the dip, and when there is no dip at all.",
         "students": ["Try a small ball, then a large one.", "Now pass the ball above the lamp, not in front. What do you see?"]},
        {"phase": "Activity", "minutes": 13, "script": [1], "title": "Choose a handout", "show": "levels",
         "purpose": "Read light curves and weigh the evidence, at the right level of challenge.",
         "students": ["Choose Green, Yellow or Red. All three read a light curve and HD 20794 d."]}],
      "body": [
        "In groups or as a class, test two questions with the lamp. A larger ball blocks more light: a deeper dip. A ball that passes above or below the lamp, from where the class sits, makes no dip at all, so a transit is seen only when a planet’s orbit lines up with our view.",
        "Students then choose a handout. Every light curve on them is **practice data, made up for the worksheet**, and labeled so."]}),
    ("levels", {
      "green": "Match each clue to what it tells us. Read a practice light curve: circle the dips and count the days between them. Fill in a card about HD 20794 d from a word bank.",
      "yellow": "Explain both methods. Read a light curve to find a planet’s year. Compare HD 20794 d’s year with Earth’s. Weigh the claim *HD 20794 d is another Earth.*",
      "red": "Untangle a light curve with two planets in it. Explain why most planets never transit from our view. Use Kepler’s estimate. Judge the claim, naming evidence for, against and still missing."}),
    ("cols", [[("section", {"label": "Debrief · 7 minutes",
      "screen": [
        review(OBJECTIVES, 3, [0], hint=THUMBS, phase="Debrief"),
        {"phase": "Debrief", "minutes": 4, "script": [1], "title": "Clues left behind", "show": "question", "question": P2["talk_clues"],
         "purpose": "Carry the idea of indirect evidence beyond astronomy.",
         "students": ["Think of one thing we know only from its clues.", "How sure can we be?"]}],
      "body": ["Ask the objectives back as questions, from the screen or page 1: *“Can you now…?”* Students show a thumb up, sideways or down.",
               "Close with the poster’s question about clues, on the screen. Take three answers."]})],
              [("connection", ["**On the poster** *Another Earth*, find *How do you find a planet you can’t see?* and the paragraphs about Kepler, HD 20794 d and Webb. Next, the poster asks why we have not found aliens yet."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Reading a light curve",
                 "body": ["When a planet passes in front of its star, the star’s light dips a little. The time from one dip to the next is the planet’s year. This curve is **practice data, made up for teaching**."]}),
    ("cols", [[("html", light_curve(LC_GREEN, note="Practice data, made up for teaching.", maxw="300pt"))],
              [("html", ZONE), ("html", '<p class="pcredit" style="text-align:center">The habitable zone, and a stretched oval orbit like that of HD 20794 d. Not to scale.</p>')]]),
    ("section", {"label": "Answer key"}),
    ("html", """<div class="cols key"><div>
<p class="label">Green level</p>
<h4>Part 1 · Two clues</h4><ol><li>A dip in light → a planet passing in front of its star. A wobble → a planet tugging on its star.</li></ol>
<h4>Part 2 · The light curve</h4><ol><li>Dips on days 4, 14 and 24: <b>3 dips</b>, <b>10 days</b> apart. The planet’s year is about 10 days.</li></ol>
<h4>Part 3 · HD 20794 d</h4><ol><li>20 light-years; six times; 647 days; liquid water.</li></ol>
<p class="label">Yellow level</p>
<h4>Part 2 · The light curve</h4><ol><li>Dips on days 3, 11, 19, 27: <b>8 days</b> apart. Brightness falls by a little over 1%.</li></ol>
<h4>Part 3 · Two years</h4><ol><li>647 ÷ 365 ≈ <b>1.8</b> Earth years; 647 − 365 = <b>282</b> days longer.</li></ol>
</div><div>
<h4>Part 4 · The claim (Yellow and Red)</h4><ol><li>For: it orbits in the habitable zone, where liquid water could exist; it is called a super-Earth. Against or uncertain: six times Earth’s mass; its oval orbit swings between the zone’s edges; we do not know its atmosphere or temperatures. A good answer says <i>possibly</i>, not <i>yes</i>.</li></ol>
<p class="label">Red level</p>
<h4>Part 1 · Two planets</h4><ol><li>Small dips on days 2, 8, 14, 20, 26: a <b>6-day</b> year. One deep dip on day 11: a second planet, larger (it blocks more light). We cannot read its year exactly: it must be longer than 19 days, or a second deep dip would appear within the 30.</li></ol>
<h4>Part 2 · Lined up</h4><ol><li>A transit shows only when the orbit passes between the star and us; most orbits are tilted, so most planets never dim their star from here.</li></ol>
<h4>Part 3 · Kepler’s estimate</h4><ol><li>Of 40 stars: 20% is <b>8</b>, 50% is <b>20</b>: between 8 and 20.</li></ol>
</div></div>"""),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Planets around other stars are hidden in their stars’ glare, so astronomers hunt for clues: a tiny dip in a star’s light when a planet passes in front of it, or a star’s wobble as a planet tugs on it. Over 6,000 exoplanets have been confirmed."]

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 Science · Another Earth", "level": level, "css": CSS,
            "context": CONTEXT, "foot": f"Student Handout · Grades 5–8 Science · {level.title()} Level",
            "blocks": blocks, "hero": HERO}

GREEN = handout("green", "MOON_Handout_Green_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Two clues",
            "blocks": [P("Draw a line from each clue to what it tells an astronomer."),
                       ("html", '<div class="matchq"><div class="b">The star’s light dips a tiny bit, again and again.</div><span class="d"></span><span></span><span class="d"></span><div class="b">A planet is tugging on its star.</div>'
                                '<div class="b">The star moves back and forth a little.</div><span class="d"></span><span></span><span class="d"></span><div class="b">A planet is passing in front of its star.</div></div>')]}),
  ("task", {"label": "Part 2", "title": "Read a light curve",
            "blocks": [P("This graph shows a star’s brightness over 30 days. Circle each dip. Each dip is the planet passing in front of the star."),
                       ("html", light_curve(LC_GREEN, maxw="270pt")),
                       ("html", '<div class="fillin"><p>1. How many dips can you see? <u style="min-width:50pt"></u> On which days? <u style="min-width:50pt"></u> <u style="min-width:50pt"></u> <u style="min-width:50pt"></u></p>'
           '<p>2. How many days from one dip to the next? <u></u> That is the planet’s year.</p></div>')]}),
  ("task", {"label": "Part 3", "title": "Fact card: HD 20794 d",
            "blocks": [P("Use the words in the box to finish the card."),
                       labels(["20 light-years", "six times", "647 days", "liquid water"]),
                       ("html", '<div class="fillin"><p>HD 20794 d is a super-Earth about <u></u> away.</p>'
                                '<p>It is roughly <u></u> the mass of Earth.</p>'
                                '<p>Its year lasts about <u></u>.</p>'
                                '<p>It orbits in its star’s habitable zone, where temperatures could allow <u></u> to exist.</p></div>')]}),
  ("task", {"label": "Part 4", "title": "The habitable zone",
            "blocks": [("html", ZONE)],
            "body": ["The dotted line is the planet’s oval orbit. Is the planet always in the middle of the zone? Write one sentence."], "lines": 2}),
  ("family", ["Look up at the night sky with your family. Every star you see may have planets of its own. Show them how a planet makes its star’s light dip, with a lamp and a ball."]),
])

YELLOW = handout("yellow", "MOON_Handout_Yellow_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Two clues",
            "body": ["In your own words, explain the two clues astronomers use to find a planet they cannot see. Say what causes each one."], "lines": 3}),
  ("task", {"label": "Part 2", "title": "Read a light curve",
            "blocks": [P("This graph shows a star’s brightness over 30 days."), ("html", light_curve(LC_YELLOW, maxw="300pt"))],
            "body": ["On which days does the light dip? How long is this planet’s year? By about what percent does the star dim?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Two years",
            "body": ["HD 20794 d takes about **647 days** to circle its star. Earth takes about 365. How many Earth years is one year on HD 20794 d, to one decimal place? How many days longer is it?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Another Earth?",
            "blocks": [P("A headline says: <b>“Scientists find another Earth.”</b> Use the facts to fill in the table, then decide.")]}),
  ("table", {"head": ["Evidence for the headline", "Evidence against, or still unknown"], "rows": [["", ""], ["", ""], ["", ""]]}),
  ("task", {"label": "Part 5", "title": "Your verdict",
            "body": ["Is the headline fair? Rewrite it so that it says only what the evidence shows."], "lines": 3}),
  ("family", ["Tell your family how astronomers find planets they cannot see. Ask them: if a planet like Earth were found, would they want people to travel there one day?"]),
])

RED = handout("red", "MOON_Handout_Red_Science.pdf", [
  ("task", {"label": "Part 1", "title": "Two planets, one star",
            "blocks": [P("This light curve shows one star over 30 days. Two planets orbit it."), ("html", light_curve(LC_RED, bottom=97.5, maxw="300pt"))],
            "body": ["Find each planet’s dips. What is the first planet’s year? Which planet is larger, and how do you know? What can you say, and not say, about the second planet’s year?"], "lines": 5}),
  ("task", {"label": "Part 2", "title": "Lined up",
            "body": ["In the transit lab, the ball made no dip when it passed above the lamp. Use this to explain why most planets never make their star dip, as seen from Earth. Why does that make the wobble a useful second method?"], "lines": 2}),
  ("task", {"label": "Part 3", "title": "Kepler’s estimate",
            "body": ["Kepler’s results suggest that **20 to 50 percent** of the stars we can see may have small, possibly rocky planets in their habitable zones. If you can see 40 stars from your yard, between how many might have one? Why is the estimate a range, not one number?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Judge the claim",
            "blocks": [P("Claim: <b>“HD 20794 d is another Earth.”</b>")]}),
  ("table", {"head": ["For", "Against", "Still missing"], "rows": [["", "", ""], ["", "", ""], ["", "", ""]]}),
  ("task", {"label": "Part 5", "title": "Your verdict",
            "body": ["Astronomers needed more than 20 years of measurements to confirm HD 20794 d. Write your verdict on the claim, and say what measurement you would most want next, and why. (Hint: what can Webb read in starlight?)"], "lines": 3}),
  ("family", ["Ask your family: if scientists found a planet very like Earth, would they want people to travel there one day? What would they want to know first?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
