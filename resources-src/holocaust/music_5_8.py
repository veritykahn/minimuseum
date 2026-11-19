"""Grades 5–8 · Music · "Sound and Silence"
How the exhibition uses sound, and the absence of it: the posters' three
quiet moments and no music (poster-sound/moments/credits.txt), the
timeline's three sounding stops (timeline/timelineStops.ts), the Walk's
film music that ends on the toll and the iron steps after it
(walk/walkLines.ts, walk/Walk.tsx, walk/sound/credits.txt), and A Minute's
Stillness, which has no sound (stillness/Stillness.tsx). The film's music
is not played in class: the exhibition's file is a stand-in until the
owner's own recording is in place, so the plan describes only where it
ends. No sound of violence, of trains or of the camps is played or asked
for."""

import os, sys, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import (CANDLES, EXH, WALK, OBJ_CSS, HANDOUT_CSS, LOOK_BACK_SAY, before_you_teach, look_back, timing)

DIR = "teachers/grades-5-8/music/"
TITLE = "Sound and Silence"
SUB = "Grades 5–8 · Music · How the exhibition remembers with sound, and without it"
HERO = CANDLES

MOM = EXH + "poster-sound/moments/"
PIX = "Pixabay Content License"
CLIPS = {
  "candle": {"src": MOM + "candle.mp3", "label": "Sound A", "sub": "About 5 seconds",
             "credit": f"“StrikeMatchLightCandle” by freesound_community. {PIX}"},
  "bell": {"src": MOM + "church-clock.mp3", "label": "Sound B", "sub": "About 6 seconds",
           "credit": f"“Church Bell Distant” by u_xg7ssi08yr, softened. {PIX}"},
  "water": {"src": MOM + "water.mp3", "label": "Sound C", "sub": "About 7 seconds",
            "credit": f"“Gentle lapping lake water waves cottage” by freesound_community. {PIX}"},
  "clank": {"src": WALK + "sound/clank-01.mp3", "label": "One step", "sub": "The Walk",
            "credit": "Cut from “Japan_Matsudo_Stepping_on_Small_Manhole_Cover.wav” by RutgerMuller. CC0"},
  "rattle": {"src": WALK + "sound/rattle.mp3", "label": "The rattle", "sub": "The Walk, about one step in three",
             "credit": "“METLImpt_Metal Resonant Impact With Rattle” by SoundDesignForYou. CC0"},
}
MOMENTS = [  # what each moment goes with, as the exhibition's credits give it
  ("Sound A", "A match struck, a candle lit", "Poster 1: people light a candle in their window"),
  ("Sound B", "A church bell, far off", "Poster 2: Anne Frank in hiding, who wrote of the Westerkerk’s bells"),
  ("Sound C", "Water lapping", "Poster 2: Denmark, October 1943, the fishing boats to Sweden"),
]
CANDLE_LINE = "Every year on Holocaust Memorial Day, people across the UK light a candle in their window “to remember those murdered and to stand against hatred today.”"
DENMARK_LINE = "In October 1943, people across Denmark hid their Jewish neighbors in homes, hospitals and churches. Fishermen ferried some 7,200 Danish Jews and 680 non-Jewish family members across the water to safety in Sweden."
TOLL = "Six million Jews had been murdered."
WALK_SOUND = "As you walk, the iron sounds under your feet. It is the sound of those who died, crying up from below."
WALK_FLOOR = "The floor is covered with iron faces, each one different, too many to count. They stand for the people who died in the Holocaust."

# ── lesson mode ────────────────────────────────────────────────────────
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe a short sound by its dynamics, duration and timbre, and say what it brings to mind",
     "describe a sound by its dynamics, duration and timbre?", False),
    ("explain where the exhibition uses sound, and where it chooses silence",
     "explain where the exhibition uses sound, and where silence?", False),
    ("compose a short graphic score in which silence is part of the music",
     "compose a graphic score where silence is part of the music?", False),
    ("argue when music helps us remember, and when silence does more",
     "argue when music helps us remember, and when silence does more?", True)],
  "why": "Silence is not empty. Keeping silence together is one of the oldest ways people remember, and composers use it as carefully as any note."}

SOUND_MAP = {"caption": "Where the exhibition sounds, and where it is silent",
             "columns": ["Place", "What you hear"],
             "rows": [{"cells": ["The two posters", "No music. Three quiet moments, each played once: a candle lit, a far-off church bell, water"]},
                      {"cells": ["The timeline", "Most stops silent. Three sound: a candle (Warsaw, 1943), the sea (Normandy, 1944), a bell (May 8, 1945)"]},
                      {"cells": ["The Walk’s film", "Music, which ends on the words “Six million Jews had been murdered.” The lines after are in silence"]},
                      {"cells": ["The Walk", "Nothing but your steps on iron, and a long rattle"]},
                      {"cells": ["A Minute’s Stillness", "No sound at all, for one minute"]}]}

# ── lesson plan ────────────────────────────────────────────────────────
PLAN_CSS = """
.hero { height: 1.95in; }
.sec { margin-bottom: 8pt; }
table.sm { width: 100%; border-collapse: collapse; font-size: 8.4pt; margin: 4pt 0 10pt; }
table.sm th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.sm td { border-bottom: .6pt solid #c8c5bb; padding: 3pt 8pt 3pt 0; vertical-align: top; line-height: 1.3; }
table.sm td:first-child { font-weight: 500; width: 22%; }
table.sm td.cr { font-size: 6.8pt; color: #5F6655; width: 36%; }
"""

def sm(head, rows, cls="sm"):
    h = "".join(f"<th>{x}</th>" for x in head)
    body = "".join("<tr>" + "".join(f'<td{" class=cr" if i == 3 else ""}>{c}</td>' for i, c in enumerate(r)) + "</tr>" for r in rows)
    return f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{body}</tbody></table>'

def clip_rows():
    rows = []
    for (lab, what, goes), k in zip(MOMENTS, ["candle", "bell", "water"]):
        rows.append([f"{lab}<br><span style='font-weight:400'>{CLIPS[k]['src'].split('/')[-1]}</span>", what, goes, html.escape(CLIPS[k]["credit"])])
    rows.append(["The Walk<br><span style='font-weight:400'>clank-01 … clank-14, rattle</span>", "Single steps on iron; a long, resonant rattle over about one step in three",
                 "The walk over the iron faces and empty shoes", html.escape(CLIPS["clank"]["credit"] + "; " + CLIPS["rattle"]["credit"])])
    return rows

LESSON = {
  "slug": "sound-and-silence",
  "out": DIR + "HOL_LP_Music.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Music", "hero": HERO, "css": OBJ_CSS + PLAN_CSS,
  "blocks": [
    timing(5, 13, 20, 7),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will listen to the few quiet sounds the exhibition uses — a candle lit, a far-off bell, water, steps on iron — and map where it chooses **silence** instead: no music under the posters, a film whose music stops on the words *“Six million Jews had been murdered.”*, and a minute’s stillness with no sound at all. They will describe sounds by **dynamics, duration and timbre**, and compose a one-minute **graphic score** in which silence is part of the music."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Responding** — describing sounds by their elements; how sound and silence carry meaning",
      "**Creating** — composing and notating a short piece with a graphic score",
      "**Performing** — a quiet ensemble piece, played and held with care",
      "**Connecting** — music and silence in how communities remember"]}),
    ("section", {"label": "Materials needed", "list": [
      "Speakers; the clips on the classroom screen; *The sounds in this lesson* on page 3",
      "Quiet classroom instruments (optional); differentiated handouts"]}),
    before_you_teach("In students’ pieces, only quiet, everyday sounds — a voice, a breath, a single note, a bell, a hand on a desk. No sounds of trains, sirens, shouting or gunfire, and nothing meant to sound like a camp."),
    ("section", {"label": "Hook · 5 minutes", "title": "What do you hear?",
      "screen": {"phase": "Hook", "show": "listen", "clips": [CLIPS["candle"], CLIPS["bell"], CLIPS["water"]],
                 "question": "Listen to each sound twice, with your eyes closed. What do you hear? Where might you be?",
                 "purpose": "Listen before knowing: let each sound suggest its own picture.",
                 "students": ["What do you hear in each?", "Is it loud or soft? Long or short?", "Where might you be?"]},
      "body": ["Play the three sounds without naming them. *“Listen twice, eyes closed. What do you hear? Where might you be?”* Take answers. Then: these are the only sounds on the exhibition’s two posters — a match lighting a candle, a church bell far off, water lapping. Each is played once, very quietly, as its panel arrives. **There is no music under the posters.**"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Where it sounds, and where it does not",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "A sound map", "show": "chart", **SOUND_MAP,
         "purpose": "See that the exhibition chooses sound rarely, and silence often.",
         "students": ["Where is there sound?", "Where is there none? Why there?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Steps on iron", "show": "listen",
         "clips": [CLIPS["clank"], CLIPS["rattle"]],
         "question": WALK_FLOOR + " " + WALK_SOUND,
         "purpose": "Hear how a single, repeated sound can carry meaning.",
         "students": ["Describe the step, and the rattle.", "Why iron? Why only steps?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Where the music stops", "show": "words", "text": TOLL,
         "cite": "The Walk’s film: its music ends on these words; the lines after them are in silence",
         "purpose": "Think about what a silence says that music cannot.",
         "students": ["Why might the music stop here?", "What does the silence after it do?"]}],
      "body": [
        "Build the sound map together (page 3). On the timeline, most stops are silent; three sound, each a moment already heard on the posters — a candle for the Warsaw ghetto uprising, which began on the eve of Passover; the sea for the Normandy beaches; a bell for the end of the war in Europe. In *A Minute’s Stillness* there is no sound at all.",
        "Play one step and the rattle. Read the exhibition’s words about its Walk: *“" + WALK_SOUND + "”* Ask what a single, repeated, unaccompanied sound does.",
        "Explain that the Walk’s film has music, and that it **ends on the words** *“" + TOLL + "”* The lines after are in silence. Ask: *why stop there?*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Listen, explain and compose at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. Every level ends with a one-minute score."]},
      "body": ["Students choose a handout. Every level ends with a one-minute graphic score that is at least half silence."]}),
    ("levels", {
      "green": "Describe the three moments (loud or soft, long or short, what they bring to mind), match each to its place on the posters, then fill in a six-box score with a symbol key.",
      "yellow": "Map where the exhibition uses sound and silence and explain one choice, then compose a three-layer score and write a 40–60 word program note.",
      "red": "Weigh the exhibition’s choices — steps without music, music that stops, a minute without sound — argue when silence remembers better than music, then compose and defend a score."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "A minute together",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "A minute’s stillness", "show": "question",
         "question": "Listen to two scores. Then keep one minute of stillness together.",
         "purpose": "Hear silence as part of the music, then keep it together.",
         "students": ["Listen to two scores.", "Then keep one minute of stillness together."]},
        look_back("Debrief", 3, [1], OBJECTIVES)],
      "body": ["Two groups perform their scores. Then, with no comment, keep **one minute of stillness** together, as the exhibition’s last room invites. Afterward ask: *was the minute empty?*",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Matching (Green):** Sound A, a candle — poster 1, people lighting a candle in their window; Sound B, a far-off bell — poster 2, Anne Frank, who wrote of the Westerkerk’s bells; Sound C, water — poster 2, the Danish fishing boats to Sweden.",
      "**A score is complete** when it is one minute long, at least half of it is silence, every symbol is in its key, and every sound is quiet and everyday."]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The sounds in this lesson",
      "body": ["Every clip the lesson plays, what it goes with in the exhibition, and its credit as the exhibition gives it. The clips play from the classroom screen."]}),
    ("html", sm(["Clip", "What you hear", "Where the exhibition uses it", "Credit"], clip_rows())),
    ("html", sm(["Place", "What you hear"], [r["cells"] for r in SOUND_MAP["rows"]])),
    ("section", {"label": "Music framework", "title": "Silence as music",
      "body": [
        "**Rests are written.** In notation a rest is measured as carefully as a note. Ask students to *write* their silences, and to count them in performance. In the exhibition, silence is a choice: the film’s music ends on its toll of six million, and the lines after it are left in silence.",
        "**Restraint.** The exhibition plays nothing of violence, and the lesson asks for nothing of it: no sounds of trains, sirens or camps, and no piece that imitates suffering. Students compose *for* remembrance, never as a re-enactment."]}),
    ("connection", ["**Visit the exhibition:** turn the sound on and read the two posters; watch the film and walk the iron with your steps; then keep *A Minute’s Stillness*, which has no sound at all."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The exhibition remembers the Holocaust with very few sounds. There is no music under its posters, only three quiet moments; its last room asks for a minute of silence. Composers know that silence can say as much as sound."]

HCSS = """
table.v { width: 100%; border-collapse: collapse; margin: 2pt 0 8pt; font-size: 8.6pt; }
table.v th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.v td { border-bottom: .6pt solid #9d978f; height: 34pt; padding: 3pt 6pt 3pt 0; vertical-align: top; }
table.v td:first-child { width: 22%; font-weight: 500; }
table.v.tall td { height: 44pt; }
.score { width: 100%; border-collapse: collapse; margin: 4pt 0 6pt; table-layout: fixed; background: rgba(255,255,255,.5); }
.score th { font: 500 6.6pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #605A56; padding: 3pt 4pt; text-align: left; border: .6pt solid #9d978f; }
.score td { border: .6pt solid #9d978f; height: 58pt; }
.score th.row { width: 15%; }
.score.layers td { height: 40pt; }
.score.big td { height: 110pt; }
table.v.taller td { height: 64pt; }
.key { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; margin: 4pt 0 6pt; font-size: 8.2pt; line-height: 1.3; }
.key p { margin: 0; background: rgba(255,255,255,.55); padding: 5pt 7pt; border-top: 2pt solid var(--accent); }
.key b { display: block; font: 500 6.6pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: #605A56; margin-bottom: 2pt; }
.quote { font: italic 400 12pt/1.35 'Cormorant Garamond', serif; background: rgba(255,255,255,.55); border-left: 2.5pt solid var(--accent); padding: 6pt 10pt; margin: 4pt 0 6pt; }
.quote span { display: block; font: 400 7.6pt 'Outfit'; font-style: normal; margin-top: 3pt; color: #3f3e3a; }
"""

def handout(level, out, blocks):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Music", "level": level, "context": CONTEXT,
            "foot": f"Handout · Music · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HANDOUT_CSS + HCSS}

def table(head, rows, cls="v"):
    h = "".join(f"<th>{x}</th>" for x in head)
    return f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>' + "".join(
        "<tr>" + f"<td>{r}</td>" + "<td></td>" * (len(head) - 1) + "</tr>" for r in rows) + "</tbody></table>"

def score(rows, cols=6, cls="score"):
    secs = 60 // cols
    head = '<th class="row"></th>' + "".join(f"<th>{i*secs}–{(i+1)*secs} s</th>" for i in range(cols))
    body = "".join(f'<tr><th class="row">{r}</th>' + "<td></td>" * cols + "</tr>" for r in rows)
    return f'<table class="{cls}"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'

KEY = ('<div class="key"><p><b>Silence</b>leave the box empty</p><p><b>A short sound</b>a dot ●</p>'
       '<p><b>A long sound</b>a line ——</p><p><b>Soft, getting softer</b>a line that thins ▷</p></div>')
QUIET = "Use only quiet, everyday sounds: a voice, a breath, one note, a bell, a hand on a desk."

GREEN = handout("green", "HOL_Handout_Green_Music.pdf", [
  ("task", {"label": "Part 1", "title": "Three quiet sounds",
            "blocks": [("html", "<p>Your teacher will play three sounds from the exhibition’s posters. Listen to each twice.</p>"
                        + table(["Sound", "Loud or soft? Long or short?", "What do you hear?", "Which place? (A, B or C below)"], ["Sound A", "Sound B", "Sound C"], "v tall")
                        + "<p><b>Places:</b> <b>A</b> · people light a candle in their window to remember &nbsp; <b>B</b> · Anne Frank in hiding, who wrote of a church’s bells &nbsp; <b>C</b> · Danish fishermen ferry Jewish families across the water to safety in Sweden</p>")]}),
  ("task", {"label": "Part 2", "title": "Where is the silence?",
            "body": ["There is **no music** under the exhibition’s posters, and its last room asks for **a minute with no sound at all**. Why might a museum about the Holocaust choose silence?"], "lines": 3}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "A one-minute score",
            "blocks": [("html", f"<p>Compose a one-minute piece of remembrance. Leave <b>at least three boxes silent</b>. {QUIET}</p>" + KEY + score(["Sound"], cls="score big"))]}),
  ("task", {"label": "Part 4", "title": "About my piece",
            "body": ["Finish the sentences. **My piece remembers** … **The silence comes** … **because** …"], "lines": 7}),
  ("connection", ["In the exhibition, keep *A Minute’s Stillness*. It has no sound at all. What did you hear in the minute?"]),
])

YELLOW = handout("yellow", "HOL_Handout_Yellow_Music.pdf", [
  ("task", {"label": "Part 1", "title": "A sound map",
            "blocks": [("html", "<p>Use the sound map your teacher showed. For each place, say what you hear, and what you think the choice does.</p>"
                        + table(["Place", "What you hear", "What the choice does"], ["The two posters", "The Walk’s film", "The Walk", "A Minute’s Stillness"], "v taller"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Where the music stops",
            "blocks": [("html", f'<div class="quote">“{TOLL}”<span>The Walk’s film: its music ends on these words. The lines after them are in silence.</span></div>')],
            "body": ["Why do you think the music stops here, and not at the end of the film? Use the words *dynamics* or *silence*."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "A three-layer score",
            "blocks": [("html", f"<p>Compose one minute of remembrance for three players. At least half of each line is silence. {QUIET}</p>" + KEY + score(["Player 1", "Player 2", "Player 3"], cls="score layers"))]}),
  ("task", {"label": "Part 4", "title": "Program note",
            "body": ["In 40–60 words, tell a listener what your piece remembers, and why its silences fall where they do."], "lines": 4}),
  ("connection", ["In the exhibition, turn on the sound and find the timeline’s three stops that sound. Which sounds do they share with the posters?"]),
])

RED = handout("red", "HOL_Handout_Red_Music.pdf", [
  ("task", {"label": "Part 1", "title": "Steps without music",
            "blocks": [("html", f'<div class="quote">“{WALK_FLOOR} … {WALK_SOUND}”<span>The exhibition, on its Walk. On the Walk there is nothing but the steps: a clank of iron at each footfall, and a long rattle over about one step in three.</span></div>')],
            "body": ["Why build a memorial from one repeated sound rather than music? Describe the step and the rattle by their timbre and duration."], "lines": 9}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "When does silence remember better?",
            "body": ["The exhibition plays **no music** under its posters. Its film’s music **ends** on the words *“" + TOLL + "”* Its last room is **a minute with no sound at all**. Argue: when does music help us remember, and when does silence do more? Use two of these choices."], "lines": 5}),
  ("task", {"label": "Part 3", "title": "Compose and defend",
            "blocks": [("html", f"<p>Compose one minute of remembrance for up to three players. Decide where the silences fall, and why. {QUIET}</p>" + KEY + score(["Player 1", "Player 2", "Player 3"], cls="score layers")
                        + "<p>Then <b>defend your two most important silences</b>, using your argument from Part 2.</p>")], "lines": 5}),
  ("connection", ["In the exhibition, watch the Walk’s film to its end. Notice the moment the music stops, and what you feel in the silence after."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
