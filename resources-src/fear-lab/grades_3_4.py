"""Grades 3–4 · "Is It Really a Monster?"
Pareidolia and the brain that fills in the dark: poster 1's pattern-seeking
machine, shadow people, the hundred fake threats, and the tigers in the
rustling bushes. Students hunt for faces that aren't there, then learn to
talk back to a brain that imagines the worst. Facts follow
app/exhibitions/fear-lab/fearLab.ts (poster 1 and its "Talk about it"
questions)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403
import _draw as D          # noqa: E402

DIR = "teachers/grades-3-4/"
TITLE = "Is It Really a Monster?"
SUB = "Grades 3–4 · Pareidolia · How your brain fills in the dark"

HERO = {"img": HAND, "pos": "center 30%"}

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Look around the room. Can you find a face that isn’t really a face?"
# the poster's own "Talk about it" question for its last chapter (fearLab.ts)
TALK_Q = "When has your brain imagined the worst? What could you say to yourself when it does?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain that your brain is a pattern-seeking machine that sees faces and threats where none exist: pareidolia",
     "explain what pareidolia is?", False),
    ("find a face in an everyday object, and say what your brain is doing",
     "find a face that isn’t there, and say why you see it?", False),
    ("explain why a brain would rather see 100 fake threats than miss one real predator",
     "explain why your brain raises fake alarms?", False),
    ("use what you know about your brain to talk back to a fear of the dark",
     "talk back to your brain when it imagines the worst?", True)],
  "why": "Shapes in the dark can feel like monsters. Knowing why your brain makes them helps you check what is really there."}

CSS = """
.hero { background: #1F3A5F; }
.found { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; text-align: center; break-inside: avoid; }
.found > div { border: 1pt solid #1d1c1a; border-radius: 6pt; background: rgba(255,255,255,.65); padding: 8pt 4pt 5pt;
  display: grid; grid-template-rows: 96pt auto; place-items: center; }
.found p { margin: 0; font: 500 9.5pt 'Outfit'; }
.blobs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; margin: 4pt 0 8pt; justify-items: center; break-inside: avoid; }
.blobs > div { background: rgba(255,255,255,.65); border-radius: 6pt; padding: 6pt; }
table.fill td:first-child { width: 34%; }
"""

PLAN_CSS = OBJ_CSS + QUOTE_CSS + """
body { line-height: 1.45; }
.found > div { background: #f6f1e4; border-color: #c8c5bb; }
.posterrow { display: grid; grid-template-columns: 150pt 1fr; gap: 16pt; align-items: center; margin: 4pt 0 10pt; break-inside: avoid; }
.posterrow img { width: 150pt; height: 200pt; object-fit: cover; border-radius: 4pt; border: 1pt solid #1d1c1a; }
"""

FOUND = ('<div class="found">'
         f'<div>{D.outlet(70)}<p>A wall socket</p></div>'
         f'<div>{D.house(96)}<p>A house</p></div>'
         f'<div>{D.car(110)}<p>A car</p></div></div>')

def blobs(n=3, w=96):
    return '<div class="blobs">' + "".join(f"<div>{D.blob(i, w)}</div>" for i in range(n)) + "</div>"

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "is-it-really-a-monster", "large": True,
  "out": DIR + "FL_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "css": CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK_C), ("Teach", 10, TEACH_C), ("Activity", 20, ACT_C), ("Close", 5, CLOSE_C)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words for brain scientists"}),
               ("refs", [
        ("Pattern", "something that repeats, or that we expect to see"),
        ("Pareidolia", "seeing faces or shapes where none exist"),
        ("Amygdala", "your brain’s alarm system"),
        ("Negativity bias", "imagining the worst when you’re not sure"),
        ("Fake threat", "a danger that turns out not to be there")])],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn that the brain is a pattern-seeking machine that sees faces and threats where none exist, which poster 1 calls **pareidolia**. They will find faces in everyday objects, explain why a brain built to spot danger would rather raise 100 fake alarms than miss one real predator, and use that knowledge to check what is really there when the dark plays tricks."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Science** — the brain and the senses; how living things respond to danger",
      "**ELA** — explaining an idea in your own words; using new vocabulary",
      "**Health** — fears, feelings and calming strategies",
      "**Art** — seeing shapes; turning a shape into a face"]}),
               ("section", {"label": "Materials needed", "list": [
        "Poster 1 or the *Show your class* page (page 3), projected",
        "A flashlight, if you have one, for a shadow on the wall",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Faces everywhere",
      "screen": {"phase": "Hook", "show": "question", "question": HOOK_Q,
                 "purpose": "Discover pareidolia before naming it: everyone finds faces that aren’t there.",
                 "students": ["Find one in the room. Point to its eyes and mouth.", "Is it really a face?"]},
      "body": [f"Ask: *“{HOOK_Q}”* Give students a minute to look. They might find two screws and a handle, a wall socket, a clock, the front of a car in the parking lot. Ask each to point out the *eyes* and the *mouth*. Then: *“Nobody drew a face there. So who made it a face?”*"]}),
    ("section", {"label": "Direct instruction · 10 minutes", "title": "A pattern-seeking machine",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "A pattern-seeking machine", "show": "words", "text": PATTERN.split(". ")[0] + ".",
         "cite": "Poster 1 · Pareidolia: Seeing Monsters Everywhere",
         "purpose": "Name what students just did: pareidolia.",
         "students": ["Say it: pa-ri-DOH-lee-a.", "Where else have you seen a face that wasn’t there?"]},
        {"phase": "Teach", "minutes": 3, "script": [1], "title": "Shapes in the dark", "show": "image",
         "img": {"img": HAND}, "alt": "The poster’s clawed hand: a flat cream shape with long, curved fingers",
         "caption": SHADOW, "fit": "contain",
         "purpose": "See how a plain shape becomes a monster when the brain fills it in.",
         "students": ["What does your brain say this is?", "What is it really?"]},
        {"phase": "Teach", "minutes": 3, "script": [2], "title": "Better safe than sorry", "show": "words", "text": BY_DESIGN,
         "cite": "Poster 1 · The Science of Being Scared",
         "purpose": "Understand why the brain is built to raise fake alarms.",
         "students": ["Which costs more: a fake alarm, or missing a real predator?"]}],
      "body": [
        "Read the poster: *“" + PATTERN.split(". ")[0] + ".”* The poster calls this **pareidolia**. Your brain is so good at finding faces that it finds them in sockets, clouds and cars.",
        "In the dark there is less to see, so the brain fills in more. The poster says shadow people are *just your brain turning random darkness into human shapes.* Show the poster’s clawed hand: a flat cream shape. Your brain does the rest. If you have a flashlight, make a shadow on the wall with your hand, and ask what students see.",
        "Why would a brain work like this? *“" + BY_DESIGN + "”* Long ago, those who assumed rustling bushes held tigers lived longer. The poster calls this **negativity bias**: when it isn’t sure, your brain imagines disasters, because it is trying to keep you safe."]}),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice spotting and explaining pareidolia at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three hunt for faces and explain the brain’s fake alarms."]},
      "body": ["Students choose a handout. All three hunt for faces that aren’t there and explain why the brain raises fake alarms."]}),
    ("levels", {
      "green": "Circle the eyes and mouth in three everyday objects, turn three shapes into faces, match the new words to their meanings, and finish sentences about why the brain sees faces.",
      "yellow": "Record three faces found in the classroom, explain the poster’s sentence in their own words, decide whether a fake alarm or a missed predator costs more, and explain shadow people.",
      "red": "Ask questions about the poster’s experiment on imaginary faces, weigh the costs of two kinds of mistake, design a face test for the class, and write advice for a younger child afraid of the dark."}),
    ("section", {"label": "Talk and look back · 5 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Talk back to your brain", "show": "question", "question": TALK_Q,
         "purpose": "Turn what students know about the brain into something they can say to themselves.",
         "students": ["Tell a partner.", "Share one thing you could say."]},
        {"phase": "Close", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "hint": THUMBS,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": [f"Ask the poster’s own question: *“{TALK_Q}”* Pairs share; collect a few lines on the board, such as *it’s just my brain filling in the dark* or *let me look again.*",
               "Then ask the objectives back, from the screen or page 1: *“Can you now…?”* Students show a thumb up, sideways or down. Exit question: *“What is pareidolia, and why does your brain do it?”*"]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**What the poster says, and doesn’t.** Poster 1 says the brain sees faces and threats where none exist, and that in experiments people saw imaginary faces as male about four times as often as female. It does not say why; the Red handout asks students to wonder.",
        "Keep the tone curious, not spooky: the brain is trying to help."]}),
       ("connection", ["**Visit the exhibition:** on poster 1, find *Pareidolia: Seeing Monsters Everywhere*, then the spider and the clawed hand. Ask: *what shapes did the designer use to make you feel scared?*",
                       "**Online:** in *What Scares You?*, the Rustling Bushes counts fake alarms and missed tigers."])],
      [("section", {"label": "Answer notes", "list": [
        "**Green Part 3:** pattern, something you expect to see; pareidolia, seeing faces or shapes that aren’t there; fake threat, a danger that isn’t there.",
        "**Yellow Part 3 and Red Part 2:** a fake alarm costs a little (a run, a fright); missing a real predator could cost a life. That is why the brain leans toward fake alarms.",
        "**Shadow people:** random darkness that the brain turns into human shapes.",
        "**Talking back:** any line that names the trick (*it’s my brain filling in the dark*) and checks (*turn on the light, look again*)."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Faces that aren’t there", "body": ["Project or print this page for the hook and the lesson. Where are the eyes? Where is the mouth?"]}),
    ("html", FOUND),
    quote(PATTERN, "Poster 1 · Pareidolia: Seeing Monsters Everywhere"),
    ("html", f'<div class="posterrow"><img src="{POSTER1}" alt=""><div><p class="label">Poster 1</p><h3>The Science of Being Scared: Fear Lab</h3>'
             '<p>Look at how the poster is made: cream letters on navy, a black spider at the corner, a clawed hand reaching up. None of them is real. Each is a flat shape your brain fills in.</p>'
             f'<p><i>{SHADOW}</i></p></div></div>'),
    ("section", {"label": "Questions to ask in front of the poster", "list": [
      "Where have you seen a face in something that wasn’t a face?",
      "Why might it be safer to see a fake threat than to miss a real one?",
      "What does the clawed hand make you imagine? What is it really?",
      "What could you say to yourself when your brain imagines the worst?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["Your brain is a **pattern-seeking machine**. It is so good at finding faces that it sees them where none exist: in sockets, clouds and shadows. Scientists call this **pareidolia**. It isn’t a mistake. A brain that sees danger everywhere is trying to keep you safe."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 3–4 · Pareidolia", "level": level, "context": CONTEXT, "css": CSS + QUOTE_CSS + css,
            "foot": f"Student Handout · Grades 3–4 · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "FL_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Find the faces",
            "blocks": [("html", "<p>None of these is a face. Circle the <b>eyes</b> and the <b>mouth</b> your brain sees in each one.</p>" + FOUND)]}),
  ("task", {"label": "Part 2", "title": "Make a face",
            "blocks": [("html", "<p>Add two eyes and a mouth to turn each shape into a face. How little do you need to add?</p>" + blobs())]}),
  ("task", {"label": "Part 3", "title": "Match the words",
            "blocks": [("html", "<p>Draw a line from each word to what it means.</p>"),
                       ("table", {"head": ["Word", "What it means"], "rows": [
                         ["Pattern", "seeing faces or shapes that aren’t there"],
                         ["Pareidolia", "a danger that isn’t really there"],
                         ["Fake threat", "something you expect to see"]]})]}),
  ("task", {"label": "Part 4", "title": "Finish the sentences",
            "body": ["**a.** My brain sees faces in things because it is a…",
                     "**b.** In the dark, a coat on a chair can look like a person. To check, I could…"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "My own face hunt",
            "blocks": [("html", '<p>Draw something in your classroom or home that looks like a face. Label its eyes and mouth.</p><div class="drawbox" style="width:100%;height:190pt"></div>')]}),
  ("family", ["Go on a face hunt at home: the front of a car, a mug, a cupboard handle. Ask your family: *who made it a face?*"]),
], "table.fill { font-size: 12pt; } table.fill td { padding-bottom: 9pt; } .drawbox { background: rgba(255,255,255,.45); }")

YELLOW = handout("yellow", "FL_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Face hunt",
            "blocks": [("html", "<p>Find three things in the room that look like faces. Fill in the table. The first is done for you.</p>"),
                       ("table", {"head": ["What it is", "What makes its eyes?", "What makes its mouth?"], "rows": [
                         ["A wall socket", "the two slots", "the round hole"], ["", "", ""], ["", "", ""], ["", "", ""]]})]}),
  ("task", {"label": "Part 2", "title": "In your own words",
            "blocks": [quote(PATTERN.split(". ")[0] + ".", "Poster 1")],
            "body": ["Explain this sentence to someone who has never heard it. Use the word **pareidolia**."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Which costs more?",
            "blocks": [quote(BY_DESIGN, "Poster 1")],
            "body": ["Long ago, which mistake was worse: running from a tiger that wasn’t there, or missing one that was? Why?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Shadow people",
            "body": ["The poster says: *“" + SHADOW + "”* What is really happening when you see a person in a dark room?"], "lines": 3}),
  ("task", {"label": "Part 5", "title": "Make a face",
            "blocks": [("html", "<p>Add as little as you can to turn each shape into a face. Then ask a partner: what did your brain fill in?</p>" + blobs())]}),
  ("family", ["Look at clouds together and take turns finding faces and creatures. Explain to your family what pareidolia is, and why your brain does it."]),
], "table.fill td { height: 30pt; padding: 4pt 6pt 4pt 0; }")

RED = handout("red", "FL_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Think like a scientist",
            "blocks": [quote(PATTERN, "Poster 1")],
            "body": ["The poster reports this result, but not why. Write **two questions** you would want to ask the scientists, and **one guess** of your own you could test."], "lines": 4}),
  ("task", {"label": "Part 2", "title": "Two kinds of mistake",
            "blocks": [("html", "<p>A bush rustles. Fill in what each mistake might cost.</p>"),
                       ("table", {"head": ["The mistake", "What it might cost"], "rows": [
                         ["You guess **tiger**, but it was only the wind.", ""],
                         ["You guess **wind**, but it was a tiger.", ""]]})],
            "body": ["Use your table to explain why the poster says it is *“better to see 100 fake threats than miss one real predator.”*"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Design a face test",
            "body": ["My prediction, and what happened:"],
            "blocks": [("html", '<p>Draw a shape you think most of your class will see as a face, and one you think few will. Predict how many will see a face in each, then test it.</p><div class="blobs" style="grid-template-columns:1fr 1fr"><div class="drawbox" style="width:100%;height:130pt"><span>Most will see a face</span></div>'
                                '<div class="drawbox" style="width:100%;height:130pt"><span>Few will see a face</span></div></div>')], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Talk back to your brain",
            "body": ["A younger child is scared of shapes in their dark bedroom. Write what you would tell them, using what you know about pareidolia and the brain’s alarm."], "lines": 4}),
  ("family", ["Ask your family: *what shape in the dark has ever fooled you?* Explain why a brain that raises fake alarms is a brain trying to keep you safe."]),
], "table.fill td { height: 40pt; } table.fill td:first-child { width: 50%; } .blobs > div.drawbox { background: rgba(255,255,255,.4); }")

DOCS = [LESSON, GREEN, YELLOW, RED]
