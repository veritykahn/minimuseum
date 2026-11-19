"""Grades 5–8 · Social Studies · "The Last Minute of the War"
The 1918 sound-ranging record read as a primary source, the war's numbers
put in scale, and November 11 followed from the armistice to Veterans Day.
Students corroborate three accounts of the last minutes: the record, the
When the Guns Fell Silent poster and the film's title cards. Facts follow
app/exhibitions/great-war/greatWar.ts (the two posters) and silence/film.ts
(the record, its description and credit, and the title cards)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "The Last Minute of the War"
SUB = "Grades 5–8 · Social Studies · Reading the record of November 11, 1918"
HERO = {"img": RECORD_IMG, "pos": "center 40%", "credit": RECORD_CREDIT}

RECORD_SAYS = ("The Imperial War Museum describes it as a photograph of the record by sound ranging of artillery activity "
               "on the American front near the River Moselle, for one minute before and one minute after the Armistice "
               "at 11 AM on November 11, 1918.")

HOOK_Q = "Something changed in the middle of this strip. What, and when?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("read the 1918 sound-ranging record as a primary source: what it records, where and when",
     "read the sound-ranging record as a primary source?", False),
    ("put the war’s numbers in scale, and say what each one counts",
     "put the war’s numbers in scale, and say what each counts?", False),
    ("trace how November 11 became Armistice Day, then Veterans Day",
     "trace how November 11 became Armistice Day, then Veterans Day?", False),
    ("corroborate three accounts of the last minutes, and judge what each can and cannot show",
     "corroborate three accounts, and judge what each can show?", True)],
  "why": "A strip of film, a poster and a film’s title card all tell of the same minute. Checking one against another is how historians decide what happened, and why a whole country still stops at 11 o’clock."}

LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* Students show a thumb up, "
                 "sideways or down; for the last, ask a Red Level reader.")

# ── the numbers, as the exhibition gives them ──────────────────────────
NUMBERS = [
  ("1,568", "days the battlefields had thundered with artillery, until 11:00 AM on November 11, 1918", "Poster 2"),
  ("475 miles", "the trenches stretched across Europe", "The film"),
  ("2 million", "young American men who crossed the Atlantic after America entered the war in April 1917", "Poster 1"),
  ("over 116,000", "American soldiers who died: 53,000 in combat, and another 63,000 from disease and accidents", "Poster 1"),
  ("around 20 million", "people who died in the war, soldiers and civilians alike", "Poster 2"),
  ("880,000 · 1.4 million · 2 million", "men lost by Britain, France and Germany", "Poster 2"),
  ("nearly 11,000", "soldiers who became casualties on November 11 alone", "Poster 2")]
NUMBERS_SCREEN = {"caption": "The Great War in numbers, as the exhibition gives them",
                  "columns": ["Number", "What it counts", "Where it is told"],
                  "rows": [{"cells": list(r)} for r in NUMBERS]}

LAST_HOUR = ("10:58 AM · Private George Lawrence Price, of Canada,\nthe last Commonwealth soldier killed\n"
             "A minute later · Private Henry Gunther,\nthe last American to die\n11:00 AM · the armistice takes effect")

DAYS = [("November 11, 1918", "At 11:00 AM the armistice, the peace agreement, takes effect. Church bells ring across Europe."),
        ("1919", "President Woodrow Wilson proclaims *Armistice Day*, “filled with solemn pride in the heroism of those who died in the country’s service.” At 11:00 AM Americans pause their work for two minutes."),
        ("1954", "After World War II and the Korean War, Congress changes the name to *Veterans Day*, to honor all American veterans, not just those from World War I."),
        ("Today", "Canada, Britain and France still call it *Remembrance Day*, and keep the two-minute silence at the eleventh hour. At Arlington, a wreath is placed at the Tomb of the Unknown Soldier.")]
DAYS_SCREEN = {"caption": "From the armistice to Veterans Day, as the When the Guns Fell Silent poster tells it",
               "columns": ["When", "What happened"],
               "rows": [{"cells": [w, t.replace("*", "")]} for w, t in DAYS]}

THREE = ("The record · “One minute after the hour. All guns silent.”\n"
         "The poster · Price at 10:58 AM; “a minute later,” Gunther\n"
         "The film · “After one final soldier fell at 10:59 AM.”")

CSS = """
table.chart { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.chart td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 6pt 4pt 0; vertical-align: top; }
table.chart td:first-child { font-weight: 500; white-space: nowrap; }
table.chart.nums td:last-child { color: #5F6655; white-space: nowrap; }
.rec { margin: 4pt 0 8pt; break-inside: avoid; }
.rec img { width: auto; max-width: 100%; max-height: 150pt; display: block; border: 1pt solid #1d1c1a; }
.rec p { font-size: 7.6pt; color: #5F6655; margin: 3pt 0 0; }
"""

def record(note=True):
    cap = f"The 1918 sound-ranging record. {RECORD_CREDIT}" + (f" · {RECORD_SAYS}" if note else "")
    return f'<div class="rec"><img src="{RECORD_IMG}" alt=""><p>{cap}</p></div>'

def chart(rows, head, cls=""):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="chart {cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

def md(t):
    import re
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

LESSON = {
  "slug": "the-last-minute",
  "out": DIR + "GW_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": CSS + OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the 1918 sound-ranging record, which shows the guns on one front firing until 11:00 AM on November 11, 1918, and silent after it, as a primary source. They will put the war’s numbers in scale, follow November 11 to **Armistice Day** (1919) and **Veterans Day** (1954), and practice **corroboration**: checking the record against the poster and the film, and judging what each can and cannot show."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Historical thinking** — sourcing a primary source; corroborating accounts; the limits of a single source",
      "**Chronology** — April 1917 to November 11, 1918; 1919; 1954",
      "**Civics** — a presidential proclamation and an act of Congress; why a nation keeps a day of remembrance",
      "**Geography** — France and Belgium; the River Moselle; Flanders; Canada and Britain"]}),
    ("section", {"label": "Materials needed", "list": [
      "The record, the numbers and the days on page 3, projected or printed",
      "*When the Guns Fell Silent*, the exhibition’s short film, on a screen if you have one",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A strip of film",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": RECORD_IMG, "credit": RECORD_CREDIT}, "alt": ALT_RECORD, "fit": "contain",
                 "caption": "“The End of the War. A Graphic Record.”",
                 "purpose": "Look closely at a primary source before anyone explains it.",
                 "students": [HOOK_Q, "What do the words on it tell you?"]},
      "body": [f"Show the record without explaining it. *“{HOOK_Q}”* Let students find the six lines, jagged then flat, the words *All guns firing* and *All guns silent*, and the time marks. Then tell them what it is: {RECORD_SAYS}"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "The war, the last morning, and the day after",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "The war in numbers", "show": "chart", **NUMBERS_SCREEN,
         "purpose": "Put the war in scale, and see what each number counts.",
         "students": ["Which number surprises you most?", "Why might a museum give both 116,000 and 20 million?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "The last morning", "show": "words", "text": LAST_HOUR,
         "cite": "When the Guns Fell Silent at the 11th Hour",
         "purpose": "See that the war went on until the very last minute.",
         "students": ["The war would end at 11:00. Why did the fighting not stop sooner?", "What does the record show at 10:59?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "From Armistice Day to Veterans Day", "show": "chart", **DAYS_SCREEN,
         "purpose": "Follow November 11 from the end of the war to today.",
         "students": ["Who made Armistice Day, and who renamed it?", "Why change the name in 1954?"]}],
      "body": [
        "**The numbers (page 3).** Read them together and ask what each counts. America entered the war in April 1917 and two million young men crossed the Atlantic; over 116,000 American soldiers died, 53,000 in combat and another 63,000 from disease and accidents. Around 20 million people died in all, soldiers and civilians alike: *“the war to end all wars”* became one of the deadliest in history.",
        "**The last morning.** The armistice was known to take effect at 11:00 AM, yet some commanders still ordered attacks that morning. Nearly 11,000 soldiers became casualties on November 11 alone. Canadian Private George Lawrence Price was shot at 10:58 AM; a minute later, Private Henry Gunther became the last American to die. Then point to the record: until 11:00, *all guns firing*.",
        "**The day after.** In 1919 President Woodrow Wilson proclaimed *Armistice Day*, and Americans paused for two minutes at 11:00 AM. In 1954, after World War II and the Korean War, Congress renamed it *Veterans Day*, to honor all American veterans. Canada, Britain and France still call it *Remembrance Day*."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work from the same sources at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the record, the numbers and the story of November 11."]},
      "body": ["Students choose a handout; all three work from the same sources."]}),
    ("levels", {
      "green": "Read the record closely and say what it shows. Match each number to what it counts. Put five dates from 1917 to 1954 in order.",
      "yellow": "Source the record: who, what, when, where, and what it cannot tell. Compare it with the poster’s account of the last hour, and explain why Armistice Day became Veterans Day.",
      "red": "Corroborate three accounts of the last minutes: the record, the poster and the film. Weigh what one strip of film from one front can prove, then argue why the war is still remembered."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Three sources, one minute",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Three sources, one minute", "show": "words", "text": THREE,
         "cite": "The record, the poster and the film",
         "purpose": "Set the three accounts side by side and ask whether they agree.",
         "students": ["Do the three sources agree? Where?", "What can the record show that the poster cannot, and the other way round?"]},
        review(OBJECTIVES, 3, [1])],
      "body": ["Set the three accounts side by side. They agree: the guns fired until 11:00, and the last soldiers fell in the minutes before. The record shows the moment on one front; the poster names the last men.",
               LOOK_BACK_SAY]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Green:** jagged = all guns firing; flat = all guns silent; Nov. 11, 1918, 11 A.M. Order: 1917, 1918, 1919, 1954, today.",
        "**Yellow:** the record shows one front for two minutes, not who fell. Veterans Day honors all American veterans.",
        "**Red:** all three agree on the minutes before 11:00; only the record was made at the time, and it covers one front."]})],
      [("section", {"label": "Assessment", "body": ["**Exit ticket:** *name one thing the record proves, and one thing it cannot.*"]}),
       ("section", {"label": "For the teacher", "body": [
        "These are real people and real losses: keep to what the sources give, leave room for quiet, and never act out the last minutes. Why attacks went on that morning is a fair question to leave open."]})]]),
    ("section", {"label": "Show your class", "title": "The record, the numbers and the days",
      "body": ["Project or print this page for the hook, the lesson and the debrief."]}),
    ("html", record()),
    ("html", chart([(n, md(t), s) for n, t, s in NUMBERS], ["Number", "What it counts", "Told in"], "nums")),
    ("html", chart([(w, md(t)) for w, t in DAYS], ["When", "What happened"])),
    ("connection", ["**Online,** play *When the Guns Fell Silent*: a countdown, six title cards and the record scrolling past, with the guns cut dead at 11:00. Then open *The Memorial* and keep the two minutes’ silence. **In the exhibition,** read the date and time in red on the poster, and take a soldier card from the display."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["At 11:00 AM on November 11, 1918, the armistice, the peace agreement that ended the Great War, took effect. On one stretch of the front, instruments were recording the sound of the guns that minute. Today you read that record, and check it against two other accounts."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level", "blocks": blocks, "hero": HERO}

ORDER_CSS = """
.order { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7pt; margin: 4pt 0 8pt; break-inside: avoid; }
.order div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); padding: 6pt 7pt; font-size: 8.8pt; line-height: 1.35; }
.order span { display: block; width: 20pt; height: 20pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: #fff; margin-bottom: 4pt; }
table.fill td:first-child { width: 34%; font-weight: 500; }
table.fill tbody td { height: 16pt; }
.rec img { width: auto; max-width: 100%; max-height: 112pt; }
"""

GREEN = handout("green", "GW_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Read the record",
            "blocks": [("html", "<p>This strip of film was made on November 11, 1918. Look closely at the lines and the words on it.</p>" + record(False))]}),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["Left side: what do the words say, and what do the lines look like?", ""],
      ["Right side: what do the words say, and what do the lines look like?", ""],
      ["What date and time are written in the middle?", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "What does each number count?",
            "blocks": [("html", '<p>Draw a line from each number to what it counts.</p><table class="chart match"><tbody>' + "".join(
                f'<tr><td>{a}</td><td style="width:40pt;text-align:center">●&nbsp;&nbsp;&nbsp;&nbsp;●</td><td>{b}</td></tr>' for a, b in [
                  ("1,568", "Americans who crossed the Atlantic to fight"),
                  ("2 million", "miles the trenches stretched across Europe"),
                  ("475", "American soldiers who died in the war"),
                  ("over 116,000", "days of war, until 11:00 AM on November 11, 1918"),
                  ("around 20 million", "people who died in the war, soldiers and civilians")]) + "</tbody></table>")]}),
  ("task", {"label": "Part 3", "title": "Put November 11 in order",
            "body": ["Number the boxes from **1** (first) to **5** (last)."],
            "blocks": [("html", '<div class="order">' + "".join(f"<div><span></span>{t}</div>" for t in [
                "Congress renames the day <b>Veterans Day</b>, for all American veterans.",
                "America enters the Great War, in <b>April 1917</b>.",
                "Canada, Britain and France keep two minutes’ silence on <b>Remembrance Day</b>.",
                "At <b>11:00 AM</b> on November 11, 1918, the guns stop.",
                "President Wilson proclaims <b>Armistice Day</b>, in 1919."]) + "</div>")]}),
  ("task", {"label": "Part 4", "title": "Why silence?",
            "body": ["Every year at 11:00 AM on November 11, people in many countries stop for two minutes of silence. Look back at the record. Why do you think people chose **silence** to remember the end of the war?"], "lines": 4}),
], ORDER_CSS + "table.match td { padding: 7pt 6pt 7pt 0; font-size: 9.6pt; } table.match td:first-child { width: 26%; }")

YELLOW = handout("yellow", "GW_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Source the record",
            "blocks": [("html", record(True))],
            "body": ["A historian asks questions of every source. Answer them for the record."]}),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["What is it?", ""], ["When was it made?", ""], ["Where was it made?", ""],
      ["What does it show happening at 11:00?", ""], ["Name one thing it cannot tell us.", ""]]}),
  ("task", {"label": "Part 2", "title": "The poster’s account of the last hour",
            "body": ["*“Knowing the war would end at 11:00 AM, some commanders still ordered attacks that morning. Nearly 11,000 soldiers became casualties on November 11th alone… The last Commonwealth soldier killed was Canadian Private George Lawrence Price, shot at 10:58 AM. A minute later, Private Henry Gunther became the last American to die.”* — *When the Guns Fell Silent at the 11th Hour*",
                     "**a.** What does the poster tell you that the record cannot?",
                     "**b.** What does the record show that the poster does not?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "From Armistice Day to Veterans Day",
            "body": ["In 1919 President Woodrow Wilson proclaimed *Armistice Day*, a day *“filled with solemn pride in the heroism of those who died in the country’s service.”* In 1954, after World War II and the Korean War, Congress changed the name to *Veterans Day*. Who does each name honor? Why do you think the name was changed?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "A number to think about",
            "body": ["Over 116,000 American soldiers died: 53,000 in combat, and another 63,000 from disease and accidents. What does this tell you about the dangers soldiers faced?"], "lines": 4}),
], ORDER_CSS)

RED = handout("red", "GW_Handout_Red_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Three accounts of the last minutes",
            "blocks": [("html", record(True))],
            "body": ["Read the three accounts. Fill in the table."]}),
  ("html", chart([
      ("The record", "Made at the time, on film", "“One minute before the hour. All guns firing.” · “One minute after the hour. All guns silent.”"),
      ("The poster", "A museum poster, written long after", "Price shot at 10:58 AM; Gunther “a minute later”; nearly 11,000 casualties on November 11"),
      ("The film", "A title card in the museum’s film", "“After one final soldier fell at 10:59 AM.”")],
      ["Source", "What kind?", "What it says"])),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["Where do the three agree?", ""], ["Which source was made at the time? Why does that matter?", ""],
      ["What can only the poster tell us?", ""]]}),
  ("task", {"label": "Part 2", "title": "The limits of one source",
            "body": ["The record covers **one front**, near the River Moselle, for **two minutes**. The poster says the battlefields had thundered with artillery for 1,568 days, and the film’s title cards say trenches stretched 475 miles. What can this one strip of film prove about the end of the war? What can it not prove?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Two kinds of number",
            "body": ["The exhibition gives both *over 116,000 American soldiers* and *around 20 million people, soldiers and civilians alike*. Why might a museum give both numbers? What would be lost if it gave only one?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Make the argument",
            "body": ["The poster asks: *“Why do we still remember a war that ended over a century ago?”* Answer in a short paragraph, using at least **two** pieces of evidence from this lesson."], "lines": 5}),
], ORDER_CSS + "table.chart td:first-child { width: 16%; } table.chart td:nth-child(2) { width: 26%; color: #3f3e3a; } table.chart td:last-child { white-space: normal; color: #1d1c1a; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
