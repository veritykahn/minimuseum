"""Grades 5–8 · Music · "Music for Remembering"
The music the exhibition plays in its two poster rooms, heard as choices:
two Sousa marches, one triumphant and one a funeral march; two slow pieces
both called Largo, by Dvořák and by Handel, on records made in 1912 and
1908; the bells at the eleventh hour; and the silence after the guns, with
only wind and a single bird. Students compare tempo, dynamics and mood, and
plan a two-minute remembrance score that begins at 11:00. Every fact about
the music comes from public/exhibitions/great-war/poster-sound/credits.txt
and its moments/credits.txt; the silence from silence/ and the posters."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-5-8/music/"
TITLE = "Music for Remembering"
SUB = "Grades 5–8 · Music · Marches, a Largo and the silence"
HERO = {"img": FACES, "pos": "center 40%"}

HOOK_Q = "Two rooms, two kinds of music. Which would you march to, and which would make you stand still?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("describe music by its tempo, dynamics and mood, using music words",
     "describe music by its tempo, dynamics and mood?", False),
    ("compare a march with a funeral march by the same composer, and say what changes",
     "compare a march and a funeral march, and say what changes?", False),
    ("explain why the exhibition plays a slow Largo in the room about the end of the war",
     "explain why the exhibition plays a Largo in the room about the end of the war?", False),
    ("plan two minutes of remembrance in sound, and give a reason for every choice, silence included",
     "plan two minutes of remembrance in sound, silence included?", True)],
  "why": "Music tells us how to feel before anyone speaks. The exhibition chose its music, its bells and its silence with care, and listening closely shows us how."}

LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* Students show a thumb up, "
                 "sideways or down; for the last, ask a Red Level composer to explain one choice in their plan.")

HOOK_CLIPS = [{"src": CLIP_DOUGHBOYS["src"], "label": "Music A", "sub": "Heard in one room"},
              {"src": CLIP_SILENT["src"], "label": "Music B", "sub": "Heard in the other"}]

PIECES = [
  ("“The Stars and Stripes Forever”", "John Philip Sousa", "1896", "a march", "The Doughboys room"),
  ("“In Memoriam”", "John Philip Sousa", "1881", "his funeral march for President Garfield", "The Doughboys room"),
  ("Symphony no. 9 (“From the New World”): Largo", "Antonín Dvořák", "record of 1912", "the Victor Concert Orchestra", "The When the Guns Fell Silent room"),
  ("“Largo” (from <i>Xerxes</i>)", "George Frideric Handel", "record of 1908", "Victor Sorlin, cello", "The When the Guns Fell Silent room")]

PIECES_SCREEN = {"caption": "The music of the two poster rooms, as the exhibition’s credits give it",
                 "columns": ["Piece", "Composer", "Date", "Played by, or what it is", "Heard in"],
                 "rows": [{"cells": [p.replace("<i>", "").replace("</i>", ""), c, d, w, r]} for p, c, d, w, r in PIECES]}

WORDS = [("Tempo", "how fast or slow the music goes"), ("Dynamics", "how loud or soft it is"),
         ("March", "music with a strong, steady beat for walking in step"),
         ("Funeral march", "a march made slow and solemn, for mourning"),
         ("Largo", "an Italian word for a very slow, broad tempo"), ("Timbre", "the color of a sound: a cello, an orchestra, a bell")]

CSS = """
table.chart { width: 100%; border-collapse: collapse; font-size: 8.6pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.chart td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 6pt 4pt 0; vertical-align: top; }
table.chart td:first-child { font-weight: 500; }
table.listen { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 8pt; break-inside: avoid; }
table.listen th { font: 500 7pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 5pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.listen td { border-bottom: .6pt solid #c8c5bb; padding: 7pt 5pt 7pt 0; vertical-align: top; }
table.listen td:first-child { width: 28%; font-weight: 500; }
table.listen td.c { font-size: 8.4pt; color: #3f3e3a; }
.score { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; margin: 4pt 0 8pt; break-inside: avoid; }
.score div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.6); height: 128pt; padding: 5pt 7pt; }
.score b { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; display: block; }
"""

def chart(rows, head, cls="chart"):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

def write(n):
    return '<div class="write">' + "<i></i>" * n + "</div>"

LESSON = {
  "slug": "music-for-remembering",
  "out": DIR + "GW_LP_Music.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Music", "hero": HERO, "css": CSS + OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will listen to the music the exhibition plays in its two poster rooms and describe it by **tempo**, **dynamics** and **mood**. They will compare Sousa’s march *The Stars and Stripes Forever* with his funeral march *In Memoriam*, hear two pieces called **Largo**, by Dvořák and Handel, and think about bells and **silence** as sound. Then they will plan two minutes of remembrance in sound."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Responding** — describe and compare music using tempo, dynamics, timbre and mood",
      "**Connecting** — music’s purpose in a time and place: marching, mourning, remembering",
      "**Creating** — plan a short piece in sound, with silence used on purpose",
      "**History connection** — records made in 1908 and 1912; November 11 and the two minutes’ silence"]}),
    ("section", {"label": "Materials needed", "list": [
      "Speakers, and the four recordings on the classroom screen",
      "The listening guide on page 3, projected or printed",
      "*The Memorial* open on a screen, for the two minutes’ silence",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Music A, Music B",
      "screen": {"phase": "Hook", "show": "listen", "clips": HOOK_CLIPS, "question": HOOK_Q,
                 "purpose": "Hear two kinds of music before naming them.",
                 "students": ["What words describe Music A? Music B?", "Which would you put in a room about the end of a war?"]},
      "body": [f"Play about thirty seconds of each, without saying what they are. *“{HOOK_Q}”* Take words for each: fast, proud, bright; slow, quiet, sad. Then: *“The Mini Museum plays one of these in a room about the young soldiers, and the other in a room about the moment the war ended. Which is which, and why?”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "A march, a Largo, and the silence",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Two marches by Sousa", "show": "listen", "clips": [CLIP_DOUGHBOYS],
         "question": "Same composer, same kind of music. What changes when a march becomes a funeral march?",
         "purpose": "Compare a march and a funeral march by tempo, dynamics and mood.",
         "students": ["How does the tempo change?", "Why might the room play both, one after the other?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Two pieces called Largo", "show": "listen", "clips": [CLIP_SILENT],
         "question": "Both are called Largo. What do they share?",
         "purpose": "Hear a very slow tempo, and why it suits remembering.",
         "students": ["What do you notice about the old records’ sound?", "Why play slow music for the end of a war?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Bells, wind and a bird", "show": "listen", "clips": [CLIP_BELLS, CLIP_WIND, CLIP_BIRD],
         "question": "After the guns stop, what is left to hear?",
         "purpose": "Hear bells and near-silence as part of remembering.",
         "students": ["Why might the film keep only wind and a single bird?", "Is silence part of music?"]}],
      "body": [
        "**Two marches (page 3).** The Doughboys room plays two marches by John Philip Sousa, one after the other: *The Stars and Stripes Forever* (1896), then *In Memoriam* (1881), his funeral march for President Garfield. Play a little of each. Students compare tempo, dynamics and mood. It is the same composer and the same kind of music, a march; what changes is its purpose, from marching in step to mourning.",
        "**Two pieces called Largo.** The When the Guns Fell Silent room plays the Largo from Dvořák’s Symphony no. 9, *From the New World*, on a record made by the Victor Concert Orchestra in 1912, then Handel’s *Largo*, from *Xerxes*, played on the cello by Victor Sorlin on a record made in 1908. *Largo* means very slow. Point out the surface sound of the old records, which the exhibition kept.",
        "**Bells and silence.** As the poster reaches 11:00, bells strike. In the exhibition’s short film, the guns are cut dead at 11:00 and only the wind and a single bird remain. In 1919, Americans paused for two minutes at 11:00; Canada, Britain and France still keep the two-minute silence."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Listen closely and plan in sound, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the same four pieces, the bells and the silence."]},
      "body": ["Play the recordings again as students work. All three levels use the same pieces."]}),
    ("levels", {
      "green": "Fill in a listening chart for the four pieces: fast or slow, loud or soft, and a mood word. Choose the piece that best fits remembering, and say why.",
      "yellow": "Compare Sousa’s march and his funeral march in a table. Explain why the room plays them one after the other, and what the Largo adds in the next room.",
      "red": "Plan two minutes of remembrance in sound for 11:00 on November 11, in four thirty-second parts, using music, bells, natural sound or silence, and justify each choice."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Two minutes",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Two minutes’ silence", "show": "words",
         "text": "At 11:00 on November 11,\npeople pause in silence to remember.", "cite": "The Memorial",
         "purpose": "Keep the silence together, and listen to it.",
         "students": ["What did you hear in the silence?", "How was it different from the music?"]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Open *The Memorial*, choose *The silence at 11:00* and press *Keep two minutes’ silence now*. Afterward, ask: *what did you hear?* (The room, breathing, outside.) *Why might silence be the right sound for remembering?*",
               LOOK_BACK_SAY]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Green:** *Stars and Stripes*: fast, loud, proud. *In Memoriam*: slower, solemn. Both Largos: very slow, quiet, calm.",
        "**Yellow:** the tempo slows and the mood turns from proud to mourning; together they hold both pride and grief.",
        "**Red:** the plan begins at 11:00 with no battle sounds; look for silence used on purpose."]})],
      [("section", {"label": "Assessment", "body": ["**Exit ticket:** *describe one piece in three music words, and say why the exhibition chose it.*"]}),
       ("section", {"label": "For the teacher", "body": ["Every plan begins at 11:00, after the guns: students compose remembrance, not the sound of battle."]})]]),
    ("section", {"label": "Show your class", "title": "The listening guide",
      "body": ["Project or print this page for the lesson."]}),
    ("html", chart(PIECES, ["Piece", "Composer", "Date", "Played by, or what it is", "Heard in"])),
    ("refs", WORDS),
    ("section", {"label": "The other sounds", "list": [
      "**The bells** strike as the When the Guns Fell Silent poster reaches 11:00.",
      "**The film**, *When the Guns Fell Silent*, has a sound reconstruction, not a recording, timed to the 1918 sound-ranging record: the guns fire until 11:00, then stop, and the wind and a single bird are added.",
      "**The silence.** In 1919, Americans paused for two minutes at 11:00 AM. Canada, Britain and France still keep the two-minute silence on Remembrance Day."]}),
    ("connection", ["**Online,** open each poster and listen to its room’s music as you read; play *When the Guns Fell Silent*; and keep the two minutes’ silence in *The Memorial*. **In the exhibition,** listen at the iPad Armistice audio station beside the display case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Mini Museum plays music in its rooms about the Great War: marches in the room about the young soldiers, and slow music in the room about the moment the war ended at 11:00 AM on November 11, 1918. Today you listen closely and ask why each sound was chosen."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Music", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 5–8 Music · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "GW_Handout_Green_Music.pdf", [
  ("task", {"label": "Part 1", "title": "Listening chart",
            "blocks": [("html", "<p>Listen to each piece. Circle one word in each column, and write a mood word of your own.</p>"
                        + chart([(f"{p}<br><span style='font-weight:300'>{c}</span>", "fast · medium · slow", "loud · medium · soft", "") for p, c, d, w, r in PIECES],
                                ["Piece", "Tempo", "Dynamics", "Mood word"], "listen"))]}),
  ("refs", [w for w in WORDS if w[0] in ("Tempo", "Dynamics", "Largo")]),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Which room?",
            "body": ["The Mini Museum plays the two marches in the room about the young soldiers, the doughboys. It plays the two Largos in the room about the moment the war ended. Why do you think the slow music is in the room about the end of the war?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "The sound of the silence",
            "body": ["At 11:00 on November 11, people keep two minutes of silence. In the museum’s film, after the guns stop, you hear only the wind and a single bird. What did **you** hear when your class kept the silence?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Choose one",
            "body": ["Which of the four pieces would you play to help people remember? Use **two** music words to say why."], "lines": 4}),
], "table.listen tbody td { height: 46pt; } table.listen td:nth-child(2), table.listen td:nth-child(3) { font-size: 8.4pt; color: #3f3e3a; width: 18%; }")

YELLOW = handout("yellow", "GW_Handout_Yellow_Music.pdf", [
  ("task", {"label": "Part 1", "title": "Two marches by Sousa",
            "body": ["The Doughboys room plays two marches by John Philip Sousa, one after the other: **“The Stars and Stripes Forever”** (1896), then **“In Memoriam”** (1881), his funeral march for President Garfield. Listen to both, and fill in the table."]}),
  ("table", {"head": ["", "“The Stars and Stripes Forever”", "“In Memoriam”"], "rows": [
      ["Tempo", "", ""], ["Dynamics", "", ""], ["Mood", "", ""], ["What is it for?", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Why both?",
            "body": ["The room plays the proud march first, then the funeral march. Why do you think the exhibition chose to play both, one after the other, in a room about the young soldiers?"], "lines": 3}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "The Largo",
            "body": ["The next room, about the moment the war ended, plays two pieces called **Largo**: one by Dvořák, from his “New World” Symphony, recorded by an orchestra in 1912, and one by Handel, played on the cello and recorded in 1908. *Largo* means very slow. What does a slow tempo do to a listener? Why does it suit this room?"], "lines": 6}),
  ("task", {"label": "Part 4", "title": "Old records",
            "body": ["The exhibition kept the crackle and surface sound of the old records. Why might a museum keep that sound, rather than use a new, clean recording?"], "lines": 5}),
  ("task", {"label": "Part 5", "title": "Silence",
            "body": ["After 11:00, the museum’s film keeps only the wind and a single bird. Is silence part of music? Explain your answer."], "lines": 5}),
], "table.fill tbody td { height: 20pt; } table.fill td:first-child { width: 24%; }")

RED = handout("red", "GW_Handout_Red_Music.pdf", [
  ("task", {"label": "Part 1", "title": "What each sound is for",
            "blocks": [("html", "<p>For each sound in the exhibition, say what it makes a listener feel, and why the museum might have chosen it.</p>"
                        + chart([(a, "", "") for a in ["Sousa’s march, “The Stars and Stripes Forever”", "Sousa’s funeral march, “In Memoriam”",
                                                       "Dvořák’s and Handel’s Largos, on old records", "Bells as the poster reaches 11:00",
                                                       "Wind and a single bird after the guns stop"]], ["Sound", "What a listener feels", "Why choose it?"], "listen"))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Two minutes, from 11:00",
            "body": ["Plan two minutes of remembrance in sound for 11:00 on November 11. Your plan begins **after** the guns have stopped. Use music, bells, natural sound or silence, in four parts of thirty seconds. In each box, write what is heard, its tempo and dynamics."]}),
  ("html", '<div class="score">' + "".join(f"<div><b>{t}</b></div>" for t in ["11:00:00–11:00:30", "11:00:30–11:01:00", "11:01:00–11:01:30", "11:01:30–11:02:00"]) + "</div>"),
  ("task", {"label": "Part 3", "title": "Justify your plan",
            "body": ["Explain your choices. Where did you use silence, and why? How does your plan begin, and how does it end? Refer to at least **one** sound from the exhibition."], "lines": 8}),
  ("task", {"label": "Part 4", "title": "Words or silence?",
            "body": ["The exhibition asks: *“Why might people choose silence, rather than words, to honor those who died?”* Answer as a musician."], "lines": 4}),
], "table.listen tbody td { height: 52pt; } table.listen td:first-child { width: 30%; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
