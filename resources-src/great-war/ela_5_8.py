"""Grades 5–8 · ELA · "The Language of Remembrance"
How the exhibition's words are built to make a reader remember: the
film's six title cards ("After…"), the eleventh hour, day and month, the
careful words a writer uses when the facts are uncertain ("possibly",
"perhaps", "legend says", "whatever the origin"), and the formal language of
a memorial: an epitaph, a proclamation and a promise. Every quotation is
the exhibition's own: app/exhibitions/great-war/greatWar.ts (the posters
and their talk questions), silence/film.ts (the title cards) and
memorial/MemorialCard.tsx (the epitaph)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

DIR = "teachers/grades-5-8/ela/"
TITLE = "The Language of Remembrance"
SUB = "Grades 5–8 · ELA · How words are built to be remembered"
HERO = {"img": TRENCH, "pos": "center 40%"}

ELEVENTH = "At the eleventh hour, on the eleventh day, of the eleventh month, the guns fell silent—but our gratitude never will."
PROMISE = "You will not be forgotten. Your sacrifice mattered. And because of you, we live in freedom."
WILSON = "filled with solemn pride in the heroism of those who died in the country’s service"
EPITAPH = "Here rests in honored glory an American soldier known but to God"
DOUGH = ("They were called “doughboys,” **possibly** because the large brass buttons on their uniforms resembled small fried-dough pastries, "
         "or **perhaps** from the dust that coated infantry on the march in the Mexican-American War, as if they’d been rolled in flour. "
         "**Whatever the origin,** the nickname stuck.")
DEVIL = "They fought in decisive battles like Belleau Wood, where U.S. Marines fought so fiercely that **legend says** German soldiers called them “Devil Dogs.”"
SILENCE_Q = "Why might people choose silence, rather than words, to honor those who died?"

HOOK_Q = "Read the six cards aloud. What do you notice about how they are built?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("identify anaphora and the rule of three, and explain their effect on a listener",
     "identify anaphora and the rule of three, and explain their effect?", False),
    ("explain how careful words (*possibly*, *perhaps*, *legend says*) keep a writer honest",
     "explain how careful words keep a writer honest?", False),
    ("analyze word choice in an epitaph, a proclamation and a promise",
     "analyze word choice in an epitaph, a proclamation and a promise?", False),
    ("write words of remembrance that use these devices, and only true facts",
     "write words of remembrance that use these devices, and only true facts?", True)],
  "why": "People remember the end of the Great War in a handful of words: eleven, silence, never forgotten. Those words were chosen and built with care, and a careful writer can learn how."}

def md(t):
    import re
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

CARDS_TEXT = "\n".join(TITLE_CARDS)

HEDGES = [("possibly", "They were called “doughboys,” possibly because the brass buttons resembled small fried-dough pastries"),
          ("or perhaps", "or perhaps from the dust that coated infantry on the march, as if they’d been rolled in flour"),
          ("whatever the origin", "Whatever the origin, the nickname stuck"),
          ("legend says", "legend says German soldiers called them “Devil Dogs”")]
HEDGE_SCREEN = {"caption": "Careful words on The Doughboys poster: the writer marks what is not certain",
                "columns": ["The careful word", "Where it is used"],
                "rows": [{"cells": [a, b]} for a, b in HEDGES]}

THREE_TEXTS = (f"“{EPITAPH}”\n— a grave in The Memorial\n\n"
               f"A day “{WILSON}”\n— President Woodrow Wilson, 1919\n\n"
               f"“{PROMISE}”\n— When the Guns Fell Silent")

CSS = """
.cards6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6pt; margin: 4pt 0 10pt; break-inside: avoid; }
.cards6 div { background: #1d1c1a; color: #f6f1e4; border-radius: 4pt; padding: 10pt 10pt; font: 500 11pt/1.3 'Cormorant Garamond', serif; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 34pt; }
.quote { border-left: 3pt solid var(--accent); background: rgba(255,255,255,.6); padding: 7pt 11pt; margin: 4pt 0 8pt; font: italic 400 12pt/1.38 'Cormorant Garamond', serif; break-inside: avoid; }
.quote b { font-weight: 700; }
.quote small { display: block; font: 400 7.6pt 'Outfit'; letter-spacing: .06em; font-style: normal; color: #5F6655; margin-top: 3pt; }
.bank { display: flex; flex-wrap: wrap; gap: 5pt; margin: 4pt 0 8pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 9pt; font-size: 8.8pt; background: rgba(255,255,255,.65); }
table.chart { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.chart td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 6pt 4pt 0; vertical-align: top; }
table.chart td:first-child { font-weight: 500; width: 24%; }
"""

def cards6():
    return '<div class="cards6">' + "".join(f"<div>{c}</div>" for c in TITLE_CARDS) + "</div>"

def quote(text, cite):
    return f'<div class="quote">{md(text)}<small>{cite}</small></div>'

def chart(rows, head):
    h = "".join(f"<th>{x}</th>" for x in head)
    b = "".join("<tr>" + "".join(f"<td>{md(c)}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="chart"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* Students show a thumb up, "
                 "sideways or down; for the last, ask two Red Level writers to read a line of their speeches.")

LESSON = {
  "slug": "the-language-of-remembrance",
  "out": DIR + "GW_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": CSS + OBJ_CSS,
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will study how the exhibition’s words are built to be remembered: the **anaphora** of the film’s six title cards, the **rule of three** in *the eleventh hour, the eleventh day, the eleventh month*, the **careful words** a writer uses when a fact is uncertain, and the **formal register** of an epitaph, a proclamation and a promise. They will then write their own words of remembrance, using the devices and only true facts."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Reading informational text** — word choice, tone and the author’s purpose; distinguishing fact from legend",
      "**Language** — figurative and rhetorical devices: anaphora, the rule of three, contrast; formal and informal register",
      "**Writing** — a short speech or inscription for an audience and purpose, supported by evidence",
      "**Speaking and listening** — reading aloud with care; listening for pattern"]}),
    ("section", {"label": "Materials needed", "list": [
      "The title cards and quotations on page 3, projected or printed",
      "*When the Guns Fell Silent*, the exhibition’s short film, if you can play it",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Six cards",
      "screen": {"phase": "Hook", "show": "words", "text": CARDS_TEXT, "cite": "The title cards of When the Guns Fell Silent",
                 "purpose": "Hear a pattern before naming it.",
                 "students": [HOOK_Q, "Why does the last card not begin with “After”?"]},
      "body": [f"Show the six title cards from the exhibition’s short film, one line at a time, and have the class read them aloud together. *“{HOOK_Q}”* Students will hear the repeated *After*, the numbers growing, and the last card breaking the pattern. *“Writers build words like this on purpose. Today we find out how.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "How remembering words are built",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "The eleventh hour", "show": "words", "text": ELEVENTH,
         "cite": "When the Guns Fell Silent at the 11th Hour",
         "purpose": "See repetition and the rule of three at work, and the turn on “but.”",
         "students": ["What is said three times?", "What does “but” turn the sentence toward?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Careful words", "show": "chart", **HEDGE_SCREEN,
         "purpose": "Notice how an honest writer marks what is uncertain.",
         "students": ["Why not just say where the name came from?", "Which statements on the posters have no careful word? Why?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "An epitaph, a proclamation, a promise", "show": "words", "text": THREE_TEXTS,
         "cite": "The Memorial and When the Guns Fell Silent",
         "purpose": "Hear the formal words people choose when they remember.",
         "students": ["Pick one word that sounds solemn. Why that word?", "Who is spoken to in the promise?"]}],
      "body": [
        "**Repetition and the rule of three.** Name the hook’s device: **anaphora**, the same word opening each line. Then read the poster’s last sentence. *Eleventh* comes three times, each time a bigger unit, hour, day, month, and then the sentence turns on **but**: the guns fell silent, *but our gratitude never will*. Ask what the contrast does.",
        f"**Careful words.** Read the poster’s two passages about nicknames: *“{DOUGH.replace("**", "")}”* and *“{DEVIL.replace("**", "")}”* The writer does not know for sure, and says so. Compare these with the poster’s numbers, which are stated plainly. Careful writing tells the reader how sure to be.",
        "**Formal words.** Read the three short texts. The epitaph uses old, formal words: *rests*, *honored glory*, *known but to God*. Wilson’s proclamation asks for *solemn pride*. The poster’s promise speaks straight to the dead, as *you*, in three short sentences."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Study the devices and use them, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the exhibition’s words, then write your own."]},
      "body": ["Students choose a handout; every level ends with writing of their own."]}),
    ("levels", {
      "green": "Find the pattern in the six title cards. Write an *After…* sequence from a bank of facts. Find the careful words in the doughboys passage, and say which line you would keep.",
      "yellow": "Name the device and its effect in four lines. Analyze word choice in the epitaph, the proclamation and the promise. Then write a memorial inscription that uses one device.",
      "red": "Judge when careful words are needed and when they are not. Compare the two posters’ closing lines for audience and purpose. Then plan and write a short Veterans Day speech."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Words, and silence",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Words, or silence?", "show": "question", "question": SILENCE_Q,
         "purpose": "Close by weighing what words can do, and what silence does.",
         "students": ["Read one line you wrote today.", "Is there something silence says that words cannot?"]},
        review(OBJECTIVES, 3, [1])],
      "body": [f"Ask three students to read one line of their writing aloud, without comment. Then put the exhibition’s own question: *“{SILENCE_Q}”* Let the room think before anyone answers.",
               LOOK_BACK_SAY]}),
    ("cols", [
      [("section", {"label": "Answer notes", "list": [
        "**Green:** *After* opens five cards; the sixth gives the result. Careful words: *possibly*, *perhaps*, *whatever the origin*.",
        "**Yellow:** anaphora (the cards); rule of three (eleventh; the promise’s three sentences); contrast (*silent… but… never will*).",
        "**Red:** careful words belong where a story is uncertain; the numbers are given as facts."]})],
      [("section", {"label": "Assessment", "body": ["**Exit ticket:** *write one sentence about November 11 that uses a device from today, and name the device.*"]}),
       ("section", {"label": "For the teacher", "body": [
        "Writing about the dead asks for care: students write to honor, never in the voice of a soldier or as if they were there."]})]]),
    ("section", {"label": "Show your class", "title": "The words to study",
      "body": ["Project or print this page for the lesson."]}),
    ("html", cards6()),
    ("html", quote(ELEVENTH, "When the Guns Fell Silent at the 11th Hour, its last line")),
    ("html", quote(DOUGH, "The Doughboys: America’s Sons in The Great War")),
    ("html", quote(DEVIL, "The Doughboys: America’s Sons in The Great War")),
    ("html", quote(f"“{EPITAPH}”", "The Memorial, the card for an unknown soldier")),
    ("html", quote(f"A day “{WILSON}.”", "President Woodrow Wilson’s Armistice Day proclamation, 1919, as the poster quotes it")),
    ("html", quote(PROMISE, "When the Guns Fell Silent at the 11th Hour")),
    ("connection", ["**Online,** watch *When the Guns Fell Silent* and see the six cards appear one at a time, before the record and the silence. **In the exhibition,** hear the posters read aloud, and find the last line of each."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The Great War ended at 11:00 AM on November 11, 1918. Ever since, people have remembered it in a few chosen words: on posters, on graves, in speeches. Today you study how those words are built, then write your own."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level", "blocks": blocks, "hero": HERO}

BANK = ["farmers from Iowa and factory workers from Pittsburgh left home", "two million young Americans crossed the Atlantic",
        "weeks of mud, rats and lice", "church bells rang across Europe", "soldiers on both sides shook hands",
        "poppies grew wild in Flanders", "Americans paused for two minutes at 11:00"]

GREEN = handout("green", "GW_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Six cards",
            "blocks": [("html", "<p>These six cards appear in the exhibition’s short film, one at a time.</p>" + cards6())],
            "body": ["**a.** Which word begins five of the cards?", "**b.** How is the last card different? Why do you think the writer ended that way?"], "lines": 5}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Write your own After… lines",
            "blocks": [("html", "<p>Choose <b>three</b> facts from the bank. Write each as a line that begins with <i>After</i>. Then write a last line that does not begin with <i>After</i>.</p>"
                        + '<div class="bank">' + "".join(f"<span>{b}</span>" for b in BANK) + "</div>")], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Careful words",
            "blocks": [("html", quote(DOUGH.replace("**", ""), "The Doughboys poster"))],
            "body": ["Underline the words that show the writer is **not sure**. Why would a careful writer use them?"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "A line to keep",
            "blocks": [("html", quote(ELEVENTH, "When the Guns Fell Silent") + quote(PROMISE, "When the Guns Fell Silent"))],
            "body": ["Which line would you choose for a memorial? Copy one word from it that you think is important, and say why."], "lines": 2}),
], ".quote { font-size: 11.5pt; }")

YELLOW = handout("yellow", "GW_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Name the device",
            "body": ["For each line, name the device: **anaphora** (the same opening word), **rule of three**, or **contrast**. Then say what it does for the listener."]}),
  ("html", '<table class="fill dev"><thead><tr><th>The line</th><th>Device</th><th>What it does</th></tr></thead><tbody>' + "".join(
      f"<tr><td>{md(t)}</td><td></td><td></td></tr>" for t in [
        "“After 1,568 days of war. After 20 million dead. After boys lied about their age to fight…”",
        "“At the eleventh hour, on the eleventh day, of the eleventh month…”",
        "“…the guns fell silent—but our gratitude never will.”",
        "“You will not be forgotten. Your sacrifice mattered. And because of you, we live in freedom.”"]) + "</tbody></table>"),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Formal words",
            "blocks": [("html", quote(f"“{EPITAPH}”", "The Memorial, the card for an unknown soldier") + quote(f"A day “{WILSON}.”", "President Woodrow Wilson, 1919"))],
            "body": ["Choose **two** words from these lines that sound solemn or formal. For each, write a plainer word that means nearly the same. What is lost when you use the plain word?"]}),
  ("table", {"head": ["Formal word", "Plainer word", "What is lost"], "rows": [["", "", ""], ["", "", ""]]}),
  ("task", {"label": "Part 3", "title": "Careful words",
            "body": [f"The poster says that **legend says** German soldiers called the Marines “Devil Dogs.” Rewrite the sentence without *legend says*. Is your sentence still honest? Explain."], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Write an inscription",
            "body": ["Write a memorial inscription of two to four lines for the soldiers of the Great War. Use at least **one** device from Part 1, and name it."], "lines": 6}),
], "table.fill.dev tbody td { height: 50pt; } table.dev td:first-child { width: 46%; font-weight: 400; font-size: 8.8pt; } table.fill tbody td { height: 26pt; } table.fill td:first-child { width: 30%; }")

RED = handout("red", "GW_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "When does a writer need careful words?",
            "blocks": [("html", quote(DOUGH, "The Doughboys poster") + quote("In all, over 116,000 American soldiers died—53,000 in combat, and another 63,000 from disease and accidents.", "The Doughboys poster"))],
            "body": ["The first passage is full of careful words; the second has none. Why? What would happen to a reader’s trust if the writer had used careful words for the numbers, or none for the nickname?"], "lines": 8}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Two endings",
            "blocks": [("html", quote("That’s why we remember them.", "The last line of The Doughboys poster") + quote(ELEVENTH, "The last line of When the Guns Fell Silent"))],
            "body": ["Compare the two endings. Think about length, sound and what each asks of the reader. Which is the stronger ending for its poster? Use evidence."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "A Veterans Day speech",
            "body": ["Write a speech of about **120 words** to open a Veterans Day assembly. Use **anaphora**, a **rule of three**, and one **contrast**. Use only facts from the exhibition, and a careful word if a fact is uncertain. Plan first:"]}),
  ("table", {"head": ["Device", "Your line"], "rows": [["Anaphora", ""], ["Rule of three", ""], ["Contrast", ""]]}),
  ("task", {"label": "Part 4", "title": "Write your speech", "body": ["Begin with your strongest line. End with the line you most want your listeners to remember."], "lines": 6}),
], "table.fill tbody td { height: 22pt; } table.fill td:first-child { width: 22%; } .quote { font-size: 11pt; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
