"""Grades 5–8 · ELA · "In Their Own Words"
Diaries written at the time and testimony remembered later: the young
writers and the survivors whose words the exhibition sets in A Minute's
Stillness (app/exhibitions/holocaust/stillness/stillnessPrompts.ts), on the
second poster (holocaust.ts) and in the Walk's film (walk/walkLines.ts).
Every quotation is word for word as the exhibition sets it, with the
exhibition's own citation; no fact is added about any writer's life or
death that the exhibition does not give."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import (CANDLES, WALK, OBJ_CSS, HANDOUT_CSS, STEVEN_FRANK, WIESEL_WITNESS,
                     LOOK_BACK_SAY, before_you_teach, look_back, timing)

DIR = "teachers/grades-5-8/ela/"
TITLE = "In Their Own Words"
SUB = "Grades 5–8 · ELA · Diaries, testimony and quotation in context"
HERO = CANDLES

# ── the words, as the exhibition sets them, with its citations ─────────
ANNE_WRITE = "“When I write I can shake off all my cares. My sorrow disappears, my spirits are revived!”"
ANNE_GOOD = "“I still believe, in spite of everything, that people are truly good at heart.”"
ANNE_SKY = "“And yet, when I look up at the sky, I somehow feel that everything will change for the better, that this cruelty, too, shall end, that peace and tranquility will return once more.”"
ELSA = "“Everything comes to an end. Spring will come.”"
MARGOT = "“We never feel safe, because we border directly on Germany and we are only a small country.”"
ANN_KIRK = "“We, however, pretended I was going on a marvellous adventure.”"
BEA = "“I said, you’ll see her again soon. I was really talking to myself.”"
OTTO = "“On the lots we were all just one big family. Everybody knew everybody.”"
NIEMOLLER = ("“First they came for the socialists, and I did not speak out—because I was not a socialist. Then they came for the trade unionists, "
             "and I did not speak out—because I was not a trade unionist. Then they came for the Jews, and I did not speak out—because I was not a Jew. "
             "Then they came for me—and there was no one left to speak for me.”")

CITE = {
  "anne": "Anne Frank, from her diary",
  "anne15": "Anne Frank, July 15, 1944",
  "elsa": "Elsa Binder, aged 22, writing in the Stanisławów ghetto",
  "margot": "Margot Frank, in a letter to a pen pal in America, 1940",
  "steven": "Steven Frank, five when the Nazis occupied the Netherlands, remembering",
  "annkirk": "Ann Kirk, who left Berlin on the Kindertransport aged 10",
  "bea": "Bea Green, 14, comforting a younger girl on the Kindertransport train",
  "otto": "Otto Rosenberg, remembering his Sinti community in Berlin",
  "wiesel": "Elie Wiesel, who survived Auschwitz and Buchenwald",
}

# The young writers A Minute's Stillness names, as it describes them.
WRITERS = [
  ("Anne Frank", "1929", "In hiding in Amsterdam", "She kept a diary, and dreamed of being a writer."),
  ("Margot Frank", "1926", "Amsterdam; a letter, 1940", "Anne’s older sister. She hoped to become a maternity nurse."),
  ("Petr Ginz", "1928, Prague", "Theresienstadt", "He kept a diary, and held on to his writing, art and studies."),
  ("Yitskhok Rudashevski", "1927", "The Vilna ghetto", "He wondered whether to follow his heart and study, or learn a trade."),
  ("Dawid Sierakowiak", "1924", "The Łódź ghetto", "He wrote his diary in five notebooks."),
  ("Moshe Flinker", "1926", "Belgium, hiding his identity", "An Orthodox boy, he wrote about his faith."),
]

# ── lesson mode ────────────────────────────────────────────────────────
OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("tell a diary written at the time from testimony remembered later, and say what each can show",
     "tell a diary from testimony, and say what each can show?", False),
    ("read a short passage closely: who wrote it, when and where, and what its words reveal",
     "read a passage closely: who, when, where, and what it reveals?", False),
    ("write a remembrance label that quotes a writer exactly and in context",
     "write a remembrance label that quotes exactly, in context?", False),
    ("explain how a quotation can change its meaning when it is taken out of context",
     "explain how a quotation changes out of context?", True)],
  "why": "The people of the Holocaust are remembered best in their own words. Reading those words closely, and quoting them honestly, is how we keep faith with the people who wrote them."}

WRITERS_SCREEN = {"caption": "Young writers in A Minute’s Stillness, as the exhibition describes them",
                  "columns": ["Writer", "Born", "Where they wrote", "What the exhibition tells us"],
                  "rows": [{"cells": list(w)} for w in WRITERS]}

THEN_LATER = {"caption": "Four voices: which were written at the time, and which remembered later?",
              "columns": ["Their words", "Who, and when"],
              "rows": [{"cells": [ELSA, CITE["elsa"]]}, {"cells": [ANN_KIRK, CITE["annkirk"]]},
                       {"cells": [MARGOT, CITE["margot"]]}, {"cells": [BEA, CITE["bea"]]}]}

# ── lesson plan ────────────────────────────────────────────────────────
PLAN_CSS = """
.hero { height: 1.95in; }
.sec { margin-bottom: 8pt; }
dl.words { display: grid; grid-template-columns: 1fr 34%; gap: 0 12pt; margin: 2pt 0 8pt; font-size: 8.8pt; }
dl.words dt { font: italic 400 10.4pt/1.25 'Cormorant Garamond', serif; border-bottom: .6pt solid #c8c5bb; padding: 2pt 0; }
dl.words dd { margin: 0; border-bottom: .6pt solid #c8c5bb; padding: 3pt 0; color: #3f3e3a; font-size: 8.2pt; line-height: 1.3; }
table.wr { width: 100%; border-collapse: collapse; font-size: 8.6pt; margin: 4pt 0 10pt; }
table.wr th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 8pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.wr td { border-bottom: .6pt solid #c8c5bb; padding: 3pt 8pt 3pt 0; vertical-align: top; }
table.wr td:first-child { font-weight: 500; white-space: nowrap; }
"""

ALL_WORDS = [
  (ANNE_WRITE, CITE["anne"]), (ANNE_GOOD + " " + ANNE_SKY, CITE["anne15"] + " · the exhibition never shows the first sentence alone"),
  (MARGOT, CITE["margot"]), (ELSA, CITE["elsa"]), (STEVEN_FRANK, CITE["steven"]), (ANN_KIRK, CITE["annkirk"]),
  (BEA, CITE["bea"]), (OTTO, CITE["otto"]), (WIESEL_WITNESS, CITE["wiesel"])]

def words_list():
    import html
    return '<dl class="words">' + "".join(f"<dt>{html.escape(w)}</dt><dd>{html.escape(c)}</dd>" for w, c in ALL_WORDS) + "</dl>"

def writers_table():
    head = "".join(f"<th>{h}</th>" for h in WRITERS_SCREEN["columns"])
    rows = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in w) + "</tr>" for w in WRITERS)
    return f'<table class="wr"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'

LESSON = {
  "slug": "in-their-own-words",
  "out": DIR + "HOL_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": OBJ_CSS + PLAN_CSS,
  "blocks": [
    timing(5, 13, 20, 7),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the words of young people who wrote during the Holocaust — Anne and Margot Frank, Elsa Binder — beside the testimony of people who remembered it later, as the exhibition sets them in *A Minute’s Stillness* and on its posters. They will tell a **diary** written at the time from **testimony** remembered later, read each passage closely for who, when, where and what it reveals, and write a **remembrance label** that quotes exactly and gives the words their context."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Reading informational text** — sourcing a passage; what a first-hand account can and cannot show",
      "**Reading closely** — word choice and tone; how one sentence changes the meaning of another",
      "**Writing** — a short explanatory text that quotes accurately and cites its source",
      "**Speaking and listening** — reading another person’s words aloud with care"]}),
    ("section", {"label": "Materials needed", "list": [
      "*The words in this lesson* on page 3, projected or printed",
      "Differentiated handouts, one per student; *A Minute’s Stillness* on a screen if you have one"]}),
    before_you_teach("Students write in their own voice, about the writers; never as them."),
    ("section", {"label": "Hook · 5 minutes", "title": "Who wrote this?",
      "screen": {"phase": "Hook", "show": "words", "text": ANNE_WRITE,
                 "purpose": "Meet the words before the name: let students wonder who wrote them, and why.",
                 "students": ["Read it twice. Who might have written this?", "What does writing do for the writer?"]},
      "body": ["Project the sentence without a name. *“Read it twice. Who might have written this, and where? What does writing do for the writer?”* Take guesses. Then: it was written by a girl in hiding with her family, in rooms behind a bookcase in her father’s office building in Amsterdam. Her name was Anne Frank, and she dreamed of being a writer."]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Written then, remembered later",
      "screen": [
        {"phase": "Teach", "minutes": 5, "script": [0], "title": "Young writers", "show": "chart", **WRITERS_SCREEN,
         "purpose": "See that Anne Frank was one of many young people who kept writing.",
         "students": ["Where was each person writing?", "What did each one hope for, or hold on to?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "Then, or later?", "show": "chart", **THEN_LATER,
         "purpose": "Tell a diary or letter written at the time from testimony remembered later.",
         "students": ["Which were written at the time?", "Which were remembered later? What gives it away?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "In context", "show": "words",
         "text": ANNE_GOOD + "\n" + ANNE_SKY, "cite": CITE["anne15"],
         "purpose": "See how the sentence around a quotation changes what it means.",
         "students": ["What does the second sentence add to the first?", "Why would a museum never show the first one alone?"]}],
      "body": [
        "Show the young writers *A Minute’s Stillness* names (page 3). Anne Frank was not alone: Petr Ginz kept a diary in Theresienstadt, Yitskhok Rudashevski in the Vilna ghetto, Dawid Sierakowiak in five notebooks in the Łódź ghetto, and Moshe Flinker wrote about his faith while hiding his identity in Belgium.",
        "Set out the two kinds of source. A **diary** or a letter is written at the time, without knowing what will happen next. **Testimony** is remembered later, by someone who survived and looks back. Read the four voices and sort them: Elsa Binder and Margot Frank wrote then; Ann Kirk and Bea Green remember the Kindertransport, which brought about 10,000 children to safety in Britain.",
        "Show Anne’s words of July 15, 1944. The Anne Frank House warns that the first sentence has been *“plucked out of context”*, so the exhibition never shows it alone: the sentence that follows it always comes too. Ask what the second sentence adds."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read and write about the writers’ words at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three levels read the same voices."]},
      "body": ["Students choose a handout. All three levels read the same voices and end in a remembrance label."]}),
    ("levels", {
      "green": "Read four short passages with a guide: who, when, and one word that shows a feeling. Sort them into *written then* and *remembered later*, then complete a remembrance card with sentence frames.",
      "yellow": "Close-read four voices in a chart, explain what a diary can show that testimony cannot (and the other way), then write a 60–80 word remembrance label that quotes exactly.",
      "red": "Weigh two quotations the exhibition handles with care — Anne Frank’s words of July 15, 1944, and Martin Niemöller’s *First They Came* — then argue what a writer owes the words they quote, and write a label."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Bearing witness",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Bear witness", "show": "words", "text": WIESEL_WITNESS, "cite": CITE["wiesel"],
         "purpose": "Hear the labels read aloud, as a way of bearing witness.",
         "students": ["Read your label aloud: the name, the words, the context.", "Listen for the exact words."]},
        look_back("Debrief", 3, [1], OBJECTIVES)],
      "body": ["Ask three students to read their labels aloud, one after another, without comment. Then read Elie Wiesel’s words: *“For the dead and the living, we must bear witness.”* Ask: *how did your label bear witness?*",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Then or later:** written at the time — Anne Frank, Margot Frank (a letter, 1940), Elsa Binder; remembered later — Steven Frank, Ann Kirk, Bea Green, Otto Rosenberg. A label is complete when it names the person, quotes exactly, says who and when, and is written in the student’s own voice.",
      "**Exit ticket:** *one thing a diary can show that a memory cannot, and one thing a memory can show that a diary cannot.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The words in this lesson",
      "body": ["Every quotation in the lesson, word for word as the exhibition sets it, with its citation. Project or print this page; quote only from it."]}),
    ("html", words_list()),
    ("html", writers_table()),
    ("section", {"label": "Literary framework", "title": "Quoting with care",
      "body": [
        "**Exact words, whole context.** Quote exactly, say who and when, and keep the sentence that changes the meaning. The exhibition pairs Anne Frank’s two sentences of July 15, 1944, and notes that Martin Niemöller spoke *First They Came* on a 1947 world tour, which led to *“several slightly different versions.”* **Their voice, then yours.** Students write *about* the writers, never as them: no task asks anyone to imagine being in hiding, in a ghetto or in a camp."]}),
    ("connection", ["**Visit the exhibition:** *A Minute’s Stillness* shows, one at a time, a name, a writer’s words, and a question to sit with; each minute is different. The second poster’s *Children* chapter tells Anne Frank’s story; *Lay a Stone* is a place to end."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT,
            "foot": f"Handout · ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HANDOUT_CSS + VOICE_CSS + css}

CONTEXT = ["During the Holocaust, many young people kept writing: diaries, letters, notebooks. Others who survived told their stories later. Their own words are one of the best ways we have to remember them as people, not as numbers."]

VOICE_CSS = """
.voices { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt 12pt; margin: 4pt 0 8pt; break-inside: avoid; }
.voice { background: rgba(255,255,255,.62); border-left: 2.5pt solid var(--accent); padding: 6pt 10pt 4pt; }
.voice q { quotes: none; display: block; font: italic 400 11.6pt/1.32 'Cormorant Garamond', serif; margin-bottom: 3pt; }
.voice span { display: block; font: 400 7.6pt/1.3 'Outfit'; color: #3f3e3a; }
.voice .k { font: 500 6.6pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #605A56; margin-bottom: 2pt; }
table.v { width: 100%; border-collapse: collapse; margin: 2pt 0 8pt; font-size: 8.8pt; }
table.v th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left;
  padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.v td { border-bottom: .6pt solid #9d978f; height: 27pt; padding: 3pt 6pt 3pt 0; vertical-align: top; }
table.v td:first-child { width: 22%; font-weight: 500; }
table.v.tall td { height: 46pt; }
table.card { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt; background: rgba(255,255,255,.55); border: 1pt solid var(--accent); }
table.card th { width: 30%; font: 500 7.4pt/1.3 'Outfit'; letter-spacing: .12em; text-transform: uppercase; color: #605A56; text-align: left; vertical-align: top; padding: 8pt 10pt; border-bottom: .6pt solid #c8c5bb; }
table.card td { height: 34pt; border-bottom: .6pt solid #c8c5bb; padding: 6pt 10pt; vertical-align: top; }
table.card td.q { height: 62pt; font: italic 400 20pt/1 'Cormorant Garamond', serif; color: #9d978f; }
table.card td.tall { height: 70pt; }
.rules { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; margin: 4pt 0 6pt; font-size: 8.4pt; line-height: 1.3; }
.rules p { margin: 0; background: rgba(255,255,255,.55); padding: 5pt 7pt; border-top: 2pt solid var(--accent); }
"""

def voices(items, letters=True):
    import html
    out = ""
    for k, (w, c) in enumerate(items):
        lab = f'<span class="k">Voice {"ABCD"[k]}</span>' if letters else ""
        out += f'<div class="voice">{lab}<q>{html.escape(w)}</q><span>{html.escape(c)}</span></div>'
    return f'<div class="voices">{out}</div>'

def vtable(head, rows):
    h = "".join(f"<th>{x}</th>" for x in head)
    return f'<table class="v"><thead><tr>{h}</tr></thead><tbody>' + "".join(
        "<tr>" + f"<td>{r}</td>" + "<td></td>" * (len(head) - 1) + "</tr>" for r in rows) + "</tbody></table>"

GREEN_VOICES = [(ANNE_WRITE, CITE["anne"]), (ELSA, CITE["elsa"]), (STEVEN_FRANK, "Steven Frank, remembering what changed when he was five"), (BEA, CITE["bea"])]

GREEN = handout("green", "HOL_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Four voices",
            "blocks": [("html", "<p>Read each voice twice. A <b>diary</b> is written at the time. <b>Testimony</b> is remembered later, by someone who survived.</p>" + voices(GREEN_VOICES)
                        + vtable(["Voice", "Written then, or remembered later?", "One word that shows a feeling"], ["A · Anne Frank", "B · Elsa Binder", "C · Steven Frank", "D · Bea Green"]))]}),
  ("task", {"label": "Part 2", "title": "Read one closely",
            "body": ["Look again at Voice A. Anne Frank kept her diary while her family was in hiding in Amsterdam. **a.** What does writing do for Anne? **b.** Copy the words that tell you."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "A remembrance card",
            "blocks": [("html", '<p>Choose one voice. Finish the card in your own words. Copy their words <b>exactly</b>, inside quotation marks.</p><table class="card"><tr><th>I will remember</th><td></td></tr><tr><th>Who they were, and where</th><td></td></tr>'
                                '<tr><th>In their own words</th><td class="q">“</td></tr><tr><th>Written then, or remembered later?</th><td></td></tr>'
                                '<tr><th>I will remember them because</th><td class="tall"></td></tr></table>')]}),
  ("connection", ["In the exhibition, *A Minute’s Stillness* shows a name, then someone’s words, then a question to think about. Sit with it for one minute. Whose words did you see?"]),
])

YELLOW_VOICES = [(MARGOT, CITE["margot"]), (ELSA, CITE["elsa"]), (ANN_KIRK, CITE["annkirk"]), (OTTO, CITE["otto"])]

YELLOW = handout("yellow", "HOL_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Then and later",
            "blocks": [("html", voices(YELLOW_VOICES) + vtable(["Voice", "Where and when", "Then or later? How can you tell?", "What it shows about the writer"],
                                                               ["A · Margot Frank", "B · Elsa Binder", "C · Ann Kirk", "D · Otto Rosenberg"]).replace('<table class="v">', '<table class="v tall">'))],
            "body": []}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "What each kind can show",
            "body": ["What can a diary or letter written at the time show that testimony remembered later cannot? What can testimony show that a diary cannot? Use one voice of each kind."], "lines": 6}),
  ("task", {"label": "Part 3", "title": "Write a remembrance label",
            "blocks": [("html", '<p>Write a label of 60–80 words for one writer from this lesson, as a museum would print it beside their words. Your label should:</p><div class="rules"><p><b>Name</b> the person, and say who they were.</p><p><b>Quote</b> a few of their words exactly.</p>'
                                '<p><b>Say</b> who wrote them, when and where.</p><p><b>Tell</b>, in your own voice, why they matter.</p></div>')],
            "lines": 9}),
  ("connection", ["In the exhibition, *A Minute’s Stillness* shows one person’s words at a time. Find two voices there that are not on this page. Were they written then, or remembered later?"]),
])

RED_CSS = """
.voices.pair2 { grid-template-columns: 1fr 1.7fr; align-items: start; }
.niem { font: 500 10.4pt/1.32 'Outfit'; letter-spacing: .02em; text-transform: uppercase; background: rgba(255,255,255,.55);
  padding: 8pt 11pt 6pt; margin: 4pt 0 6pt; border-left: 2.5pt solid var(--accent); break-inside: avoid; }
.niem span { display: block; text-transform: none; font: 400 7.6pt 'Outfit'; letter-spacing: .02em; margin-top: 4pt; }
"""

RED = handout("red", "HOL_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "One sentence, or two?",
            "blocks": [("html", '<div class="voices pair2">' + voices([(ANNE_GOOD, "As it is often quoted: " + CITE["anne15"])], False)[20:-6]
                                + voices([(ANNE_GOOD + " … " + ANNE_SKY, "As the exhibition shows it: " + CITE["anne15"])], False)[20:-6] + "</div>"
                                + "<p>The first sentence is often quoted alone. The Anne Frank House warns that it has been <i>“plucked out of context”</i>, so the exhibition never shows it without the words that follow.</p>")],
            "body": ["How does the meaning change when the second sentence is put back? Why might people prefer to quote the first one alone?"], "lines": 8}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "A poem with versions",
            "blocks": [("html", f'<div class="niem">{NIEMOLLER}<span>— Martin Niemöller</span></div>'
                                "<p>The exhibition calls Pastor Martin Niemöller <i>“a complicated figure.”</i> He first supported the Nazis, and changed his views after he was imprisoned in a concentration camp for speaking out against Nazi control of the churches. He spoke the poem on a 1947 world tour, which led to <i>“several slightly different versions.”</i></p>")],
            "body": ["If a poem exists in several versions, how should we quote it? Does knowing the writer’s past change how you read his words? Explain."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "What a writer owes the words they quote",
            "body": ["Argue in a paragraph: **what does a museum, or a student, owe the words it quotes?** Use both parts above. Then, below it, write a 60–80 word remembrance label for one writer from the lesson that keeps your own rule."], "lines": 7}),
  ("connection", ["In the exhibition, Niemöller’s words are on the second poster and in the *A Minute’s Stillness* room. What does the exhibition set beside them, and why?"]),
], RED_CSS)

DOCS = [LESSON, GREEN, YELLOW, RED]
