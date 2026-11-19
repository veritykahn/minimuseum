"""Grades 5–8 · ELA · "Weighed Against a Feather"
The Weighing of the Heart, read closely: the scribe Ani's words to his own
heart and his list of wrongs not done and good deeds done, quoted exactly as
the room quotes them (Budge's translation), read for repetition, parallel
structure, direct address and a translator's choices, then imitated. Facts
follow app/exhibitions/egypt/weighing-of-the-heart/judgement.ts (the
intro, the papyri, the figures in the hall, the rule, the deeds, the heart
words and the notes) and tomb/scenes.ts (Sennedjem's fields, which the
room's last note names).

Taught as history and literature: what the Egyptians believed, in their own
words. The room says only that an unbalanced scale tips "out of balance",
and nothing frightening happens; the lesson keeps to that."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import (WALLS, ROOM, OBJ_CSS, HOOK, TEACH, ACT, CLOSE, wall_hero, wall_crop, review, look_back_say, md)

DIR = "teachers/grades-5-8/ela/"
TITLE = "Weighed Against a Feather"
SUB = "Grades 5–8 · ELA · Reading the scribe Ani’s words"
F = WALLS["fields"]
HERO = wall_hero("fields", "center 35%")

# judgement.ts, exactly
HEART = ("My heart of my mother! My heart of my mother! My heart of my being! Make no stand against me when testifying … "
         "utter no lie against me before the Great God, the Lord of Amentt.")
GAVE = "I have given bread to the hungry, water to the thirsty, raiment to the naked, and a boat to him that needed one."
LINES = ["I have not lied.", "I have made no one to weep.", "I have not stopped water [when it should flow].",
         "I have not taken milk from the mouths of children.", GAVE]
CITE = "The Papyrus of Ani, translated by E. A. Wallis Budge"
RULE = "A heart was weighed against the feather of Maat, the goddess of truth. The gods hoped the heart would balance the feather exactly, so the beam of the scales stayed level."
HALL = [("Ani and Tutu", "Ani comes into the hall with his wife, Tutu, his head bowed low."),
        ("Anubis", "Jackal-headed, he looks after the scales and watches the pointer."),
        ("Thoth", "Ibis-headed god of writing, ready with pen and palette to write down the result."),
        ("Maat", "Goddess of truth, shown as a feather, or as a seated goddess with a feather on her head."),
        ("Ammit", "She waits by the scales: the head of a crocodile, the front of a lion, the back of a hippopotamus.")]
VERDICT = "Thoth tells the gods that no wickedness has been found in Ani. Horus takes him by the hand and leads him to Osiris, and the gods give him a home in the fields of the afterlife, the Field of Reeds."

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain the weighing of the heart as Ani’s papyrus shows it: the scales, the feather of Maat and who stands in the hall",
     "explain what happens at the weighing of the heart?", False),
    ("identify repetition, parallel structure and direct address in Ani’s words, and explain their effect",
     "find repetition, parallel structure and direct address, and say what each does?", False),
    ("explain what a translator’s choices tell a reader: an old word, a bracket, an ellipsis",
     "explain what a translator’s choices tell you?", False),
    ("write a short text in Ani’s form, choosing its structure on purpose",
     "write in Ani’s form, and explain your choices?", True)],
  "why": "Some of the oldest writing people still read was written to be spoken at the most serious moment of a life. Reading it closely shows how repetition and pattern carry weight, and what one ancient people counted as a good life."}

CSS = OBJ_CSS + """
.pb { break-after: auto; break-before: page; height: 0; margin: 0; }
.quote { font: italic 400 13pt/1.45 'Cormorant Garamond', serif; border-left: 2.5pt solid var(--accent); padding: 4pt 0 4pt 12pt; margin: 4pt 0 6pt; break-inside: avoid; }
.quote.big { font-size: 16pt; }
.quote small { display: block; font: 400 7.5pt 'Outfit'; letter-spacing: .1em; text-transform: uppercase; color: #5b5a55; font-style: normal; margin-top: 3pt; }
.qlist { margin: 4pt 0 6pt; padding: 0; list-style: none; break-inside: avoid; }
.qlist li { display: grid; grid-template-columns: 18pt 1fr; font: italic 400 11.5pt/1.3 'Cormorant Garamond', serif; margin-bottom: 3pt; }
.qlist li b { font: 600 10pt 'Outfit'; font-style: normal; color: var(--gold-text); }
.hall { display: grid; grid-template-columns: 70pt 1fr; gap: 3pt 10pt; font-size: 9.5pt; margin: 4pt 0 8pt; }
.hall dt { font: 600 11pt 'Cormorant Garamond', serif; } .hall dd { margin: 0; }
.fields { display: flex; gap: 12pt; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.fields p { font-size: 9.5pt; }
.wm { display: grid; grid-template-columns: 1fr 30pt 1fr; gap: 7pt 6pt; align-items: center; font-size: 10pt; margin: 4pt 0 6pt; break-inside: avoid; }
.wm .a { font: italic 500 12pt 'Cormorant Garamond', serif; text-align: right; } .wm .d { display: flex; justify-content: space-between; }
.wm .d::before, .wm .d::after { content: ""; width: 8pt; height: 8pt; border-radius: 50%; background: #1d1c1a; }
table.fill td { height: 30pt; }
"""

def quote(text, big=False, cite=CITE):
    return ("html", f'<blockquote class="quote{" big" if big else ""}">{md(text)}<small>{cite}</small></blockquote>')

def qlist(lines=LINES, letters=True):
    return ("html", '<ol class="qlist">' + "".join(
        f'<li><b>{"ABCDEF"[i] if letters else ""}</b><span>{md(l)}</span></li>' for i, l in enumerate(lines)) + "</ol>")

def P(t):
    return ("html", f"<p>{md(t)}</p>")

def reapers(width): return wall_crop("fields", 190, 330, 560, 230, width)

# ── lesson mode ────────────────────────────────────────────────────────
ROOM_ALT = "The Weighing of the Heart room: a great golden pair of scales above a dark hall, with Ani and Tutu, Anubis, Maat, Thoth and Ammit standing below"
FIELDS_ART = {"work": F["title"], "artist": "Charles K. Wilkinson, a copy (1922) of a painting in the tomb of Sennedjem, Deir el-Medina",
              "date": "about 1300–1224 BCE", "img": {"img": F["img"], "pos": "center 35%", "credit": F["credit"]},
              "alt": "A tomb painting inside a blue border of water: Sennedjem and his wife reap grain, pull flax and plough with oxen, above rows of palms, fruit trees and flowers"}

LESSON = {
  "slug": "weighed-against-a-feather",
  "out": DIR + "EGY_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO, "css": CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Activity", 20, ACT), ("Debrief", 7, CLOSE)]),
    ("cols", [
      [("objectives", OBJECTIVES)],
      [("section", {"label": "Learning objective", "title": "What students will understand",
        "body": ["Students will meet the weighing of the heart as the exhibition tells it through the Papyrus of Ani, made for a scribe about 1250 BC. They will read his words closely, in E. A. Wallis Budge’s translation: an urgent address to his own heart, and a patterned list of wrongs he did not do and good he did. They will name the devices that give the words their force, notice the translator at work, and write in the same form."]}),
       ("section", {"label": "Standards and themes", "list": [
        "**Reading** — close reading; repetition, parallel structure, apostrophe; how structure shapes meaning",
        "**Language** — archaic words; brackets and ellipses in a quoted translation",
        "**Writing** — imitating a form; choosing structure on purpose",
        "**Social Studies link** — what ancient Egyptians believed a good life looked like"]})]]),
    ("section", {"label": "Materials needed", "list": [
      "Page 3 of this plan, projected or printed: Ani’s words, set large, and the hall",
      "Highlighters or colored pencils; differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "A heart and a feather",
      "screen": {"phase": "Hook", "show": "image", "img": {"img": ROOM["weighing-of-the-heart"]}, "alt": ROOM_ALT, "fit": "contain",
                 "caption": "The Weighing of the Heart",
                 "purpose": "Look and guess before anyone explains: what could scales like these be deciding?",
                 "students": ["What is being weighed against what?", "Who do you think is watching, and why?"]},
      "body": ["Show the room’s hall of judgement without explanation. Ask: *“A heart in one pan, a feather in the other. What could these scales be deciding?”* Take three or four guesses. Then read the room’s opening: *“Long ago in Egypt lived a scribe called Ani. When he died, his story was painted on a papyrus roll. It shows his heart being weighed on a great pair of scales.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "The scene, then the words",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Who is in the hall", "show": "chart",
         "caption": "The hall of judgement in Ani’s papyrus", "columns": ["Who", "What they do"],
         "rows": [{"cells": [n, t]} for n, t in HALL],
         "purpose": "Set the scene: the rule of the scales, and who stands in the hall.",
         "students": ["Which figure writes down the result?", "What do the gods hope the scales will do?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "Ani speaks to his heart", "show": "words", "text": HEART, "cite": CITE,
         "purpose": "Read Ani’s words to his heart aloud, twice, and notice what he repeats.",
         "students": ["Who is Ani talking to?", "What does he say twice? Why?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "I have not … I have …", "show": "words", "text": "\n".join(LINES), "cite": CITE,
         "purpose": "Hear the pattern of Ani’s list, and spot the translator’s marks.",
         "students": ["Which line breaks the pattern?", "Who added the words in brackets?"]}],
      "body": ["Ani was a scribe who lived about 1250 BC; his Book of the Dead is now in the British Museum. Read the rule: *“" + RULE + "”* Introduce the hall from page 3. The Egyptians thought the heart held a person’s will, feelings and thoughts: that is why it is the heart that is weighed.",
               "As his heart goes on the scales, Ani speaks to it. Read his words aloud twice, the second time slowly. Ask who he is addressing (his own heart, as if it were a person: **apostrophe**), what he repeats (**repetition**: *“My heart of my mother!”*), and what he asks (two commands: *make no stand*, *utter no lie*). The ellipsis marks words left out of the quotation.",
               "Then Ani’s list. The dead recited a long list of wrongs they had not done, the so-called **Negative Confession**, before forty-two judges. Students hear the **parallel structure** of *“I have not…”* and the one line that breaks it. The **brackets** are Budge’s words, added for sense; *raiment* is an old word for clothing."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Read closely, then write",
                 "purpose": "Read Ani’s words closely and write in his form, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red.", "All three read the same words and end with your own writing."]},
      "body": ["Students choose a handout. All three read the same words and end with writing of their own."]}),
    ("levels", {
      "green": "Sort Ani’s lines into *I have not…* and *I have…*, match old words to their meanings, circle the repetition in his words to his heart, and write one line of their own about a good choice.",
      "yellow": "Annotate Ani’s words to his heart, explain the effect of the list’s parallel structure and the line that breaks it, explain three translator’s choices, and write three lines in Ani’s form.",
      "red": "Analyze the address to the heart against what the Egyptians believed the heart held, argue why most of the list is negative, weigh Budge’s word choices, and write a list in Ani’s form for a character from a book they have read."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "The verdict",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "The Field of Reeds", "show": "artwork", **FIELDS_ART,
         "purpose": "Hear the end of Ani’s story, and ask which of his lines still speaks to us.",
         "students": ["What does this picture of the afterlife look like?", "Which of Ani’s lines would still matter today?"]},
        review(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Tell the end: in Ani’s papyrus, the beam of the scales stays perfectly level. *“" + VERDICT + "”* Show Sennedjem’s wall: the Field of Reeds looked like a good Egyptian farm. A few students read a line they wrote, and say which of Ani’s lines still matters.",
               look_back_say(OBJECTIVES, "a Red Level student, who reads a line and explains its structure")]}),
    ("cols", [[("section", {"label": "Answer notes and assessment", "list": [
      "**Sort:** *I have not…*: lied, made anyone weep, stopped water, taken milk from children. *I have…*: given bread, water, clothing and a boat.",
      "**Devices:** apostrophe (speaking to the heart), repetition (*My heart of my mother!*), commands (*make no stand*, *utter no lie*), parallel structure (*I have not…*).",
      "**Translator:** the brackets are added by Budge for sense; the ellipsis marks words left out; *raiment* means clothing.",
      "**Exit ticket:** *one device in Ani’s words, and what it does.*"]})],
              [("connection", ["**Virtual visit:** open *The Weighing of the Heart*. Unroll Ani’s papyrus, meet the hall, test the rule, sort Ani’s words onto his two scrolls, then guess what the scales will do.",
                               "**Poster 2**, *Gods and Goddesses*: Anubis, patron of embalmers, and the heart scarab, carved with a spell to stop the heart “betraying” its owner."])]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Ani’s words", "body": ["Project or print this page for the close reading."]}),
    quote(HEART, big=True),
    qlist(letters=False),
    ("html", '<dl class="hall">' + "".join(f"<dt>{n}</dt><dd>{md(t)}</dd>" for n, t in HALL) + "</dl>"),
    ("section", {"label": "For the teacher", "title": "Reading it as history",
      "body": [
        "**Two papyri.** The British Museum holds two famous papyri of this scene: the Papyrus of Ani (EA 10470), about 1250 BC, and the Book of the Dead of Hunefer (EA 9901), a royal scribe, about 1275 BC. The room follows Ani’s, which shows the judgement more completely than any other.",
        "**Belief, not faith.** Teach it as what ancient Egyptians believed: *“the Egyptians thought”*. The exhibition says only that an unbalanced scale tips *out of balance*; keep Ammit as she is shown, waiting, with nothing frightening said."]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In Egypt about 1250 BC, a papyrus roll was painted for a scribe called Ani. It shows his heart weighed against the feather of Maat, goddess of truth. The Egyptians thought the heart held a person’s will, feelings and thoughts; the gods hoped it would balance the feather exactly. These are Ani’s own words, in an English translation made by E. A. Wallis Budge."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": CSS + css}

GREEN = handout("green", "EGY_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Sort Ani’s lines", "blocks": [
            qlist(),
            P("Write each letter on the right scroll."),
            ("table", {"head": ["I have not …: wrongs Ani never did", "I have …: good things Ani did"], "rows": [["", ""]]})]}),
  ("task", {"label": "Part 2", "title": "Old words", "blocks": [
            P("Translations can use old words. Draw a line from each word to its meaning."),
            ("html", '<div class="wm">'
             '<span class="a">raiment</span><span class="d"></span><span>to cry</span>'
             '<span class="a">to weep</span><span class="d"></span><span>giving evidence, as a witness does</span>'
             '<span class="a">utter</span><span class="d"></span><span>clothing</span>'
             '<span class="a">testifying</span><span class="d"></span><span>to say</span></div>')]}),
  ("task", {"label": "Part 3", "title": "Ani speaks to his heart", "blocks": [
            quote(HEART),
            P("Circle the words Ani says more than once. Who is he talking to? Why do you think he says it again?")], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Your own line", "blocks": [
            P("Write one line in Ani’s pattern about a good choice you made this week. It can start *“I have…”* or *“I have not…”*."),
            P("*Ideas:* I helped someone · I told the truth when it was hard · I shared · I said sorry · I listened")], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Which of Ani’s lines do you think matters most today? Why?", "lines": 3}),
], "table.fill td { height: 50pt; } .wm { gap: 4pt 6pt; }")

YELLOW = handout("yellow", "EGY_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Ani speaks to his heart", "blocks": [
            quote(HEART),
            P("Underline the words Ani repeats. Who is he speaking to, and what two things does he ask? What is the effect of speaking to his heart as if it were a person?")], "lines": 4}),
  ("task", {"label": "Part 2", "title": "A pattern, and a break", "blocks": [
            P("Four lines share one pattern. Which line breaks it, and how? Why might Ani put the good things he did into one long sentence with a list of four?"), qlist()], "lines": 3}),
  ("task", {"label": "Part 3", "title": "The translator’s choices", "blocks": [
            ("table", {"head": ["What you see", "What it tells a reader"], "rows": [
              ["The brackets in *“[when it should flow]”*", ""], ["The ellipsis ( … ) in Ani’s words to his heart", ""], ["The word *raiment*", ""]]})]}),
  ("task", {"label": "Part 4", "title": "Write in Ani’s form", "blocks": [
            P("Write three lines in Ani’s pattern: two that begin *“I have not…”* and one that begins *“I have…”* with a list. Then say which line you think is strongest, and why.")], "lines": 6}),
], "table.fill td:first-child { width: 45%; } table.fill td { height: 40pt; }")

RED = handout("red", "EGY_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Speaking to a heart", "blocks": [
            quote(HEART),
            P("The Egyptians thought the heart held a person’s will, feelings and thoughts, and it was the heart that was weighed. Using that, explain why Ani speaks to his heart, and how the repetition and the commands make his words urgent.")], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Why say what you did not do?", "blocks": [
            P("Most of the list is negative. Argue why a list of wrongs *not* done might suit this moment better than a list of good deeds. What does the one positive sentence add?"), qlist()], "lines": 4}),
  ("task", {"label": "Part 3", "title": "The translator at work", "blocks": [
            P("Budge chose *raiment*, *weep* and *him that needed one*, and added *[when it should flow]*. Rewrite one line in plain modern English. What is gained, and what is lost?")], "lines": 4}),
  ("task", {"label": "Part 4", "title": "A list for a character", "blocks": [
            P("Choose a character from a book you have read. Write their list in Ani’s form: three or four *“I have not…”* lines and one *“I have…”* line with a list. Then explain one structural choice you made.")], "lines": 8}),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
