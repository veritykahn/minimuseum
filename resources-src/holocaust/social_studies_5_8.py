"""Grades 5–8 · Social Studies · "Step by Step"
How the Holocaust unfolded, from January 1933 to May 1945: exclusion by
law, violence and war, ghettos and mass shootings, killing centers.
Facts follow the Timeline of the Holocaust (app/exhibitions/holocaust/
timeline/timelineEntries.ts, its stops' "What happened" and "Look closer"
in stopMore.ts, and the photographs in timelineStops.ts), the Walk's film
(walk/walkLines.ts, walk/filmText.ts) and the two posters (holocaust.ts)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import (TL, BIRKENAU, OBJ_CSS, HANDOUT_CSS, PHOTO_CSS, STEP_LINE, STEVEN_FRANK, GENOCIDE_LINE,
                     LOOK_BACK_SAY, before_you_teach, look_back, timing, item, photo)

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Step by Step"
SUB = "Grades 5–8 · Social Studies · How the Holocaust unfolded, 1933–1945"
HERO = BIRKENAU

# The timeline, in the exhibition's words (timelineEntries.ts). Two entries
# are set as the room sets them: March 1942 as reworded at the owner's
# request, and Auschwitz-Birkenau spelled correctly.
TIMELINE = [
  ("January 30, 1933", "Adolf Hitler is appointed Chancellor of Germany"),
  ("March 22, 1933", "Dachau, the first concentration camp, is established"),
  ("April 1, 1933", "Nationwide boycott of Jewish businesses in Germany"),
  ("September 15, 1935", "The Nuremberg Laws are enacted, stripping Jews of citizenship and banning marriage between Jews and non-Jews"),
  ("March 12, 1938", "Germany annexes Austria (Anschluss); persecution of Austrian Jews begins"),
  ("November 9–10, 1938", "*Kristallnacht* (Night of Broken Glass): Synagogues are burned, Jewish businesses are destroyed, and thousands of Jews are arrested"),
  ("September 1, 1939", "Germany invades Poland, starting World War II"),
  ("October 1939", "Nazis begin *Aktion T4*, the euthanasia program targeting disabled individuals"),
  ("May 1940", "Auschwitz concentration camp is established"),
  ("October 1940", "The Warsaw Ghetto is established, confining hundreds of thousands of Jews"),
  ("June 22, 1941", "Germany invades the Soviet Union; Einsatzgruppen begin mass shootings of Jews in occupied territories"),
  ("September 29–30, 1941", "Over 33,000 Jews are murdered during the Babi Yar massacre near Kyiv"),
  ("December 8, 1941", "Chelmno, the first extermination camp, begins operations"),
  ("January 20, 1942", "The Wannsee Conference formalizes the “Final Solution,” planning the extermination of Jews"),
  ("March 1942", "Mass extermination begins at Belzec, followed by Sobibor and Treblinka that spring and summer"),
  ("April 19 – May 16, 1943", "The Warsaw Ghetto Uprising, where Jews resist deportation to extermination camps, occurs"),
  ("June 6, 1944", "D-Day: Allied forces invade Normandy, opening a Western front"),
  ("July 23, 1944", "Soviet forces liberate Majdanek, the first major concentration camp to be freed"),
  ("January 27, 1945", "Soviet troops liberate Auschwitz-Birkenau"),
  ("May 8, 1945", "Germany surrenders, ending World War II in Europe and the Holocaust"),
]

# ── lesson mode ────────────────────────────────────────────────────────
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("place key events of the Holocaust in order, from January 1933 to May 1945",
     "place key events of 1933–1945 in order?", False),
    ("explain how persecution grew step by step: from laws that shut Jews out, to ghettos, to killing centers",
     "explain how persecution grew step by step?", False),
    ("read a photograph from the timeline as a primary source: what it shows, who made it, and what it cannot tell us",
     "read a timeline photograph as a primary source?", False),
    ("use the choices people made to explain why historians say the Holocaust was not inevitable",
     "explain why the Holocaust was not inevitable?", True)],
  "why": "The Holocaust did not begin with camps. Seeing each step, and the choices people made at each one, helps us recognize hatred and exclusion early, and remember that people could act differently."}

HOOK_PHOTOS = [
  item(TL + "1933-04-01.webp", "A shop window", "Berlin",
       "Two men in Nazi uniforms put up a large sign on a clothing shop window while a woman stands watching nearby", 1.52),
  item(TL + "1935-09-15.webp", "A printed page", "Two new laws",
       "A printed page of German government laws in old-style lettering, with a second law printed below it", 0.65),
  item(TL + "1938-03-12.webp", "A shop door", "Vienna",
       "A perfume shop window and door in Vienna, with shelves of bottles and hand-lettered German signs", 1.4)]

STAGES = [
  {"label": "Shut out by law · 1933–1935",
   "text": "A boycott of Jewish shops, burned books, and laws that said Jews could not be citizens.",
   "items": [item(TL + "1933-04-01.webp", "The boycott", "April 1, 1933", "A boycott sign put up on a shop window in Berlin", 1.52),
             item(TL + "1935-09-15.webp", "The Nuremberg Laws", "September 15, 1935", "The Nuremberg Laws as printed in the Reich Law Gazette", 0.65)]},
  {"label": "Violence and war · 1938–1939",
   "text": "Synagogues burned on Kristallnacht; war on Poland; the secret murder of disabled people.",
   "items": [item(TL + "1938-11-09.webp", "Kristallnacht", "November 9–10, 1938", "A brick synagogue with a Star of David, its arched windows empty and dark after a fire", 1.03)]},
  {"label": "Walled in and shot · 1940–1941",
   "text": "More than 400,000 people shut in the Warsaw ghetto; mass shootings in the east.",
   "items": [item(TL + "1940-10.webp", "A ghetto wall", "Warsaw, 1940", "Workmen with a ladder and a bucket lay bricks for a tall wall across a city street", 1.27)]},
  {"label": "Killing centers · 1941–1945",
   "text": "Fifteen officials planned the “Final Solution.” Trains carried Jews from across Europe to killing centers.",
   "items": [item(TL + "1942-01-20.webp", "Wannsee", "January 20, 1942", "A large cream-colored villa with tall arched windows behind a round flower bed", 1.49)]}]

CHART_SCREEN = {"caption": "The Timeline of the Holocaust: twenty dates, in the exhibition’s words",
                "columns": ["Date", "What happened"],
                "rows": [{"cells": [d, w]} for d, w in TIMELINE]}

# ── lesson plan ────────────────────────────────────────────────────────
PLAN_CSS = """
table.tl { width: 100%; border-collapse: collapse; font-size: 8.6pt; margin: 4pt 0 10pt; }
table.tl th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text);
  text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.tl td { border-bottom: .6pt solid #c8c5bb; padding: 2.2pt 8pt 2.2pt 0; vertical-align: top; font-size: 8.3pt; line-height: 1.32; }
table.tl td:first-child { width: 24%; font-weight: 500; white-space: nowrap; }
table.tl tr.st td { background: #f1efec; font: 500 6.6pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: #5F6655; padding: 2pt 6pt; }
.pb { break-after: page; }
.hero { height: 1.95in; }
.sec { margin-bottom: 8pt; }
"""

def timeline_table():
    import re
    it = lambda t: re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)
    stages = {0: "Shut out by law", 4: "Violence and war", 9: "Walled in and shot", 12: "Killing centers", 18: "The end of the war"}
    rows = ""
    for k, (d, w) in enumerate(TIMELINE):
        if k in stages:
            rows += f'<tr class="st"><td colspan="2">{stages[k]}</td></tr>'
        rows += f"<tr><td>{d}</td><td>{it(w)}</td></tr>"
    return f'<table class="tl"><thead><tr><th>Date</th><th>On the timeline</th></tr></thead><tbody>{rows}</tbody></table>'

LESSON = {
  "slug": "step-by-step",
  "out": DIR + "HOL_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": OBJ_CSS + PLAN_CSS,
  "blocks": [
    timing(5, 13, 20, 7),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will trace the Holocaust from January 1933 to May 1945 on the exhibition’s *Timeline of the Holocaust*, define it precisely — the systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime and its allies and collaborators — and describe how it grew in stages: **laws** that shut Jews out, **violence** and war, **ghettos** and mass shootings, and **killing centers**. They will read the timeline’s photographs as primary sources, and weigh the choices people made."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Historical thinking** — chronology; continuity and change; sourcing a photograph, including one staged as propaganda",
      "**Civics** — citizenship and rights: what happens when a government takes them from a group of its own people",
      "**Geography** — Germany, Austria, Poland and the Soviet Union; Berlin, Warsaw and Kyiv; why January 27 is remembered"]}),
    ("section", {"label": "Materials needed", "list": [
      "The *Timeline of the Holocaust* on page 3, projected or printed; the exhibition’s timeline room on a screen if you have one",
      "Differentiated handouts, one per student"]}),
    before_you_teach(""),
    ("section", {"label": "Hook · 5 minutes", "title": "Who is shut out?",
      "screen": {"phase": "Hook", "show": "gallery", "title": "Who is shut out?",
                 "groups": [{"label": "Three photographs from the timeline", "items": HOOK_PHOTOS}],
                 "purpose": "Look before any explanation: notice exclusion in ordinary places.",
                 "students": ["What do you see in each one?", "Who is being shut out, and how?"]},
      "body": ["Show three photographs from the timeline without their dates: a sign on a shop window, a printed page of laws, the signs on a perfume shop door. *“What do you see? Who is being shut out, and how?”* Then translate: the shop sign reads *Germans! Defend yourselves! Do not buy from Jews!*; the laws said Jews could not be citizens; the Vienna shop refuses Jewish customers. *“All three come from before the war. The Holocaust did not begin with camps.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Four steps, twelve years",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Step by step", "show": "words", "text": STEP_LINE,
         "cite": "The Walk · the film’s opening words",
         "purpose": "Define the Holocaust precisely, and see the people before the number.",
         "students": ["What does *step by step* tell you about how it happened?"]},
        {"phase": "Teach", "minutes": 6, "script": [1], "title": "Four steps", "show": "gallery", "groups": STAGES,
         "purpose": "Set out the four stages the timeline shows, and how each made the next possible.",
         "students": ["Name one event from each step.", "How did each step make the next one possible?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "A child’s words", "show": "words", "text": STEVEN_FRANK,
         "cite": "Steven Frank, five when the Nazis occupied the Netherlands",
         "purpose": "Hear what the first steps meant to one child.",
         "students": ["What changed for Steven?", "Which change would a neighbor have noticed?"]}],
      "body": [
        "Read the exhibition’s definition: the Holocaust, also known as the *Shoah* (Hebrew for “catastrophe”), was the systematic persecution and murder of six million Jewish men, women, and children. Then the people before the number: Jews had lived in Europe for more than two thousand years; in 1933 about nine million lived there. In Leipzig in April 1929, Berta Rosenheim held a large paper school cone on her first day of school.",
        "Walk through the four steps (page 3). **Shut out by law:** Dachau, for people who opposed the Nazis, in March 1933; the boycott; the burned books; the Nuremberg Laws. **Violence and war:** Kristallnacht, when more than 1,400 synagogues were burned; the war from September 1939; the secret murder of disabled people. **Walled in and shot:** more than 400,000 Jews shut in the Warsaw ghetto; from June 1941, mass shootings — 33,771 Jews at Babi Yar in two days. **Killing centers:** at Wannsee in January 1942, fifteen officials met to plan the “Final Solution”; trains carried Jews from across Europe, which the Nazis called “resettlement to the east.” Explain both terms as words that hid murder.",
        "Read Steven Frank’s words. *“The first steps were laws and signs. What did they mean to a five-year-old?”*"]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice reading the timeline and its sources at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three levels work from the same timeline."]},
      "body": ["Students choose a handout. All three levels work from the same timeline and the same years."]}),
    ("levels", {
      "green": "Read about Jewish life before 1933; sort ten events into the four steps; read Steven Frank’s words closely; finish *First… Then… Later…* to show how one step led to the next.",
      "yellow": "Read two timeline photographs as primary sources, then chart what six events took away and how each prepared the next. Explain, with three events, why the Holocaust did not begin with camps.",
      "red": "Compare three descriptions of the Wannsee Conference, question a photograph staged as propaganda, then argue whether the Holocaust was inevitable, using the choices people made."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Where did it start?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "The timeline", "show": "chart", **CHART_SCREEN,
         "purpose": "Pull the lesson together on the timeline, and ask where it could have been stopped.",
         "students": ["Point to the first step you would call *persecution*.", "Where might people have acted differently?"]},
        look_back("Debrief", 3, [1], OBJECTIVES)],
      "body": ["Project the timeline. Ask each group to point to the first entry they would call persecution, and to one place where people made a choice. Let a Red Level reader give the *Genocide never just happens* quotation and say what circumstances the timeline shows being created.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green sort:** law — boycott, burned books, Nuremberg Laws; violence and war — Kristallnacht, Poland, *Aktion T4*; walled in and shot — Warsaw ghetto, Babi Yar; killing centers — Wannsee, Belzec. Steven Frank: no park, no swimming pool, no zoo; his word is *different*.",
      "**Exit ticket:** *name one early step and one later step, and say how the first made the second possible.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Timeline of the Holocaust",
      "body": ["Project or print this page. The entries are the exhibition’s, in its words; the four steps are this lesson’s. Where an entry says *euthanasia*, *Final Solution* or *extermination*, say plainly what it meant: murder."]}),
    ("html", timeline_table()),
    ("section", {"label": "Historical framework", "title": "Words and numbers to use with care",
      "body": [
        "**Precise words.** The five *killing centers* — Chełmno, Belzec, Sobibor, Treblinka and Auschwitz-Birkenau — were built for one purpose: to murder Jews with poison gas.",
        "**Other victims.** The Nazis also murdered at least 250,000 Roma and Sinti people and about 250,000 disabled people, and persecuted political prisoners. Anna Lehnkering, born in 1915, loved playing with children; because she had a disability, the Nazis took her life in 1940, when she was 24."]}),
    ("connection", ["**Visit the exhibition:** in *The Timeline of the Holocaust*, tap any date for what happened, where, and what to look closer at; try *Put them in order*. *The Walk* opens with a film of the same history, step by step."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Handout · Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HANDOUT_CSS + PHOTO_CSS + css}

CONTEXT = ["From 1933 to 1945, Nazi Germany and those who helped them persecuted the Jewish people of Europe, and murdered six million Jews. It did not happen all at once. It happened step by step — and at every step, people made choices."]

GREEN_CSS = """
table.sort { width: 100%; border-collapse: collapse; margin: 4pt 0 8pt; font-size: 9pt; }
table.sort th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left;
  padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); width: 25%; vertical-align: bottom; }
table.sort td { border-bottom: .6pt solid #9d978f; height: 26pt; }
.events { display: grid; grid-template-columns: 1fr 1fr; gap: 3pt 14pt; margin: 2pt 0 8pt; font-size: 9pt; line-height: 1.35; }
.events p { margin: 0; padding: 3pt 0; border-bottom: .5pt dashed #9d978f; }
.events b { font-weight: 500; }
blockquote.say { margin: 4pt 0 8pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); font: italic 400 12pt/1.35 'Cormorant Garamond', serif; }
"""

EVENTS = [  # mixed on purpose, so the sorting is the students' work
  ("November 1940", "More than 400,000 Jews are shut inside the Warsaw ghetto."),
  ("April 1, 1933", "The Nazis tell Germans not to buy from Jewish shops."),
  ("January 20, 1942", "Fifteen officials meet at Wannsee to plan the “Final Solution.”"),
  ("November 9–10, 1938", "Kristallnacht: more than 1,400 synagogues are burned."),
  ("May 1933", "Students throw tens of thousands of books into bonfires."),
  ("September 1941", "At Babi Yar, outside Kyiv, 33,771 Jews are shot in two days."),
  ("October 1939", "The Nazis begin secretly murdering disabled people."),
  ("September 15, 1935", "New laws say Jews cannot be citizens."),
  ("March 1942", "Killing begins at Belzec, a killing center."),
  ("September 1, 1939", "Germany invades Poland, home to about three million Jews."),
]

def events():
    return '<div class="events">' + "".join(f"<p><b>{d}</b> · {t}</p>" for d, t in EVENTS) + "</div>"

GREEN = handout("green", "HOL_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Before 1933",
            "body": ["Jews had lived in Europe for more than two thousand years. In 1933, about nine million Jewish people lived there, in big cities and small villages, with their own schools, music, languages and traditions. In Leipzig in April 1929, a girl named Berta Rosenheim held a large paper school cone on her first day of school.",
                     "Name **two** things that were part of Jewish life in Europe before 1933."], "lines": 2}),
  ("task", {"label": "Part 2", "title": "Sort the steps",
            "blocks": [("html", "<p>Read each event. Then write its date in the step where it belongs. Each step has two or three.</p>" + events())]}),
  ("html", '<table class="sort"><thead><tr><th>Shut out by law</th><th>Violence and war</th><th>Walled in and shot</th><th>Killing centers</th></tr></thead><tbody>'
           + "<tr><td></td><td></td><td></td><td></td></tr>" * 3 + "</tbody></table>"),
  ("task", {"label": "Part 3", "title": "A child’s words",
            "blocks": [("html", f'<blockquote class="say">{STEVEN_FRANK}</blockquote>')],
            "body": ["Steven Frank was five when the Nazis occupied the Netherlands. **a.** Name two things he was no longer allowed to do. **b.** Which word in his first sentence shows how the rules made him feel?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "One step led to the next",
            "body": ["Choose three events from Part 2, in order. Finish the sentences to show how each step made the next one easier.",
                     "**First,** … **Then,** … **Later,** …"], "lines": 4}),
  ("connection", ["In the exhibition, open *The Timeline of the Holocaust* and try *Put them in order*: five events, mixed up, to put back in order. Which step comes first?"]),
], GREEN_CSS)

YELLOW_CSS = """
table.src { width: 100%; border-collapse: collapse; margin: 2pt 0 8pt; font-size: 8.8pt; }
table.src th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left;
  padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.src td { border-bottom: .6pt solid #9d978f; height: 40pt; padding: 3pt 6pt 3pt 0; vertical-align: top; }
table.src td:first-child { width: 26%; font-weight: 500; }
table.esc td { height: 30pt; }
table.esc td:first-child { width: 32%; font-weight: 400; }
table.esc td:first-child b { font-weight: 500; }
"""

BOYCOTT_CAP = ("**Berlin, April 1, 1933.** The sign says, in German, *“Germans! Defend yourselves! Don’t buy from Jews!”* The archive says the two men are an SA man and an SS man, members of Nazi groups.")
VIENNA_CAP = ("**Vienna, 1938.** The signs say *“Fioris Perfume Shop, Aryan Firm”* and *“We refuse to serve Jewish customers.”* “Aryan” was the Nazis’ name for a race they wrongly believed was superior.")

def md(t):
    import re
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

YELLOW = handout("yellow", "HOL_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Two photographs, two signs",
            "body": ["Both photographs are from the exhibition’s timeline. Read them as **primary sources**."]}),
  ("html", '<div class="photos">'
           + photo(TL + "1933-04-01.webp", md(BOYCOTT_CAP), "Bundesarchiv, Bild 102-14468 / Georg Pahl. CC BY-SA 3.0 DE, via Wikimedia Commons")
           + photo(TL + "1938-03-12.webp", md(VIENNA_CAP), "USHMM, courtesy of NARA. Public domain, via Wikimedia Commons") + "</div>"),
  ("html", '<table class="src"><thead><tr><th>Question</th><th>Berlin, 1933</th><th>Vienna, 1938</th></tr></thead><tbody>'
           + "".join(f"<tr><td>{q}</td><td></td><td></td></tr>" for q in [
               "Who put up the sign?", "Who was it meant to stop?", "What can this photograph <i>not</i> tell us?"]) + "</tbody></table>"),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "What each step took away",
            "blocks": [("html", "<p>For each event, write what it took from Jewish people — rights, safety, homes or lives — and how it made the next step easier.</p>"
                                '<table class="src esc"><thead><tr><th>Event</th><th>What it took away</th><th>How it prepared the next step</th></tr></thead><tbody>'
                                + "".join(f"<tr><td>{md(e)}</td><td></td><td></td></tr>" for e in [
                                    "**1933** · the boycott of Jewish shops", "**1935** · the Nuremberg Laws", "**1938** · Kristallnacht",
                                    "**1940** · the Warsaw ghetto", "**1942** · the Wannsee Conference", "**1942** · the killing centers"]) + "</tbody></table>")]}),
  ("task", {"label": "Part 3", "title": "It did not begin with camps",
            "body": ["Explain this sentence from the exhibition’s poster in a paragraph. Use **three** events, in order, as evidence."], "lines": 8}),
  ("connection", ["At the 1933 boycott, the exhibition says, some Germans joined in or watched, some ignored it, and some shopped at Jewish-owned stores on purpose. Find the woman in the Berlin photograph in the timeline room. What does *Look closer* say about her?"]),
], YELLOW_CSS)

RED_CSS = """
.three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt; margin: 4pt 0 8pt; font-size: 8.8pt; line-height: 1.38; break-inside: avoid; }
.three > div { background: rgba(255,255,255,.6); border-top: 2.5pt solid var(--accent); padding: 6pt 8pt 3pt; }
.three .label { font-size: 6.8pt; }
.side { display: grid; grid-template-columns: 150pt 1fr; gap: 12pt; align-items: start; margin: 4pt 0 6pt; }
.side .photo img { height: 84pt; }
.cardsm { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6pt 10pt; margin: 4pt 0 8pt; font-size: 8.6pt; line-height: 1.35; }
.cardsm p { margin: 0; padding: 4pt 7pt; background: rgba(255,255,255,.55); border-left: 2pt solid var(--accent); }
"""

WANNSEE = [
  ("The timeline poster", "“The Wannsee Conference formalizes the ‘Final Solution,’ planning the extermination of Jews.”"),
  ("The Walk’s film", "“Fifteen officials met at a villa at Wannsee, near Berlin, to plan the ‘Final Solution.’ … They did not discuss whether to do it. Only how.”"),
  ("The timeline’s notes", "“Hitler had already decided that Europe’s Jews would be murdered. The men discussed how their offices would work together to do it … None of them objected.”")]

CHOICES = [
  "**1933:** at the boycott, some Germans shopped at Jewish-owned stores on purpose.",
  "**1938–40:** the Kindertransport brought about 10,000 children, without their parents, to safety in Britain.",
  "**1942:** at Wannsee, fifteen officials met. None of them objected.",
  "**1943:** about 700 young Jewish fighters rose up in the Warsaw ghetto.",
  "**1943:** fishermen ferried some 7,200 Danish Jews and 680 non-Jewish family members to Sweden.",
  "**1940–44:** the village of Le Chambon-sur-Lignon and its neighbors sheltered an estimated 5,000 people."]

RED = handout("red", "HOL_Handout_Red_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Three accounts of one meeting",
            "blocks": [("html", "<p>The exhibition describes the Wannsee Conference of January 20, 1942, in three places.</p>"
                                '<div class="three">' + "".join(f'<div><p class="label">{a}</p><p>{b}</p></div>' for a, b in WANNSEE) + "</div>")],
            "body": ["Which account would you trust most, and why? What difference does it make whether the decision to murder had **already been made** before the meeting?"],
            "lines": 3}),
  ("task", {"label": "Part 2", "title": "A photograph made to persuade",
            "blocks": [("html", '<div class="side">' + photo(TL + "1939-09-01.webp", "German soldiers remove a Polish border barrier, 1939.",
                                                              "Bundesarchiv, Bild 183-51909-0003 / Hans Sönnke. CC BY-SA 3.0 DE, via Wikimedia Commons")
                        + "<div><p>The timeline tells us this scene was <b>acted out for photographers, as German propaganda</b>. Its description says it was taken on September 14, two weeks after the invasion of Poland began.</p>"
                          "<p>What did its makers want people to believe? What can a staged photograph still tell a historian?</p></div></div>")],
            "lines": 2}),
  ("task", {"label": "Part 3", "title": "Was it inevitable?",
            "blocks": [("html", f'<p>The Holocaust Memorial Day Trust, quoted on the exhibition’s first poster: <i>{GENOCIDE_LINE}</i></p>'
                                '<div class="cardsm">' + "".join(f"<p>{md(c)}</p>" for c in CHOICES) + "</div>")],
            "body": ["Write an argument: **was the Holocaust inevitable?** Make a claim, use at least two of the choices above as evidence, and answer one objection."], "lines": 6}),
  ("connection", ["In the timeline room, open January 20, 1942. The villa where the men met is now a memorial and education center. Why might a country turn the place where a crime was planned into a place to learn?"]),
], YELLOW_CSS + RED_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
