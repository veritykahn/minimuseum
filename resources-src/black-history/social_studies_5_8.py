"""Grades 5–8 · Social Studies · "Evidence for the Court"
The Doll Test and Brown v. Board of Education, read as a chain of evidence:
from separate schools, through Kenneth and Mamie Phipps Clark's studies,
to the Supreme Court's unanimous decision and its footnote 11. Facts follow
the room's checked facts in
app/exhibitions/black-history/representation/representationText.ts
(DOLL_TEST_FACTS, word for word, with the sources it names) and poster 2.

The room's own rule holds here: the class talks about the Doll Test and never
repeats it, and nobody is asked to choose between dolls or people by skin
color. The lesson centers the Clarks, Thurgood Marshall and the Court."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Evidence for the Court"
SUB = "Grades 5–8 · Social Studies · The Doll Test and Brown v. Board"
HERO = HERO_RING

# the sources the room names for each fact, shortened for a chart
SRC = {
  "segregation": "National Archives", "clarks": "NAACP LDF · Library of Congress", "dolls": "Library of Congress",
  "asked": "National Park Service · Library of Congress", "answers": "Library of Congress · NAACP LDF",
  "drawings": "Library of Congress", "conclusion": "NAACP LDF", "clarendon": "National Park Service",
  "court": "Library of Congress · NAACP LDF", "decision": "Library of Congress", "unequal": "National Archives",
  "footnote": "The decision · Library of Congress", "words": "National Archives", "symbol": "National Park Service"}

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "What would a court need, to be sure of that?"
FAIR_Q = "Why do you think the dolls were the same in every way except their color?"
WITNESS_Q = "Why would lawyers ask a psychologist, and not only teachers and parents, to speak in court?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("explain what the Brown cases were about, and where they came from",
     "explain what the Brown cases were about?", False),
    ("describe what Kenneth and Mamie Phipps Clark’s doll tests set out to study, and what they found",
     "describe what the doll tests studied, and what they found?", False),
    ("trace how the doll tests became evidence: in Clarendon County, in court and in footnote 11",
     "trace how the doll tests reached the Supreme Court?", False),
    ("evaluate the doll tests as evidence: what they could show, and why they became a symbol of the Brown case",
     "evaluate the doll tests as evidence?", True)],
  "why": "In 1954 the Supreme Court decided that separate schools are inherently unequal. Part of the evidence came from two psychologists who listened to young children."}

# the study, step by step, for the screen
STUDY_ROWS = [
  ["Who", "Kenneth and Mamie Phipps Clark, psychologists, in the 1940s", SRC["clarks"]],
  ["The dolls", "Four plastic dolls, identical except for color, shown to Black children aged three to seven", SRC["dolls"]],
  ["The questions", "Which dolls were “nice” and which were “bad,” and which doll was most like them", SRC["asked"]],
  ["The answers", "Almost all knew the race of the dolls; a majority preferred the white doll", SRC["answers"]],
  ["The crayons", "Many children with dark complexions colored a drawing of themselves white or yellow", SRC["drawings"]],
  ["The conclusion", "“Prejudice, discrimination, and segregation” created a feeling of inferiority and damaged self-esteem", SRC["conclusion"]]]
# from the study to the decision, for the debrief
COURT_ROWS = [
  ["1940s", "The Clarks design and conduct the doll tests", SRC["clarks"]],
  ["Briggs v. Elliott", "Thurgood Marshall asks the Clarks to repeat their experiments in Clarendon County, South Carolina", SRC["clarendon"]],
  ["Briggs, Davis, Delaware", "Kenneth Clark testifies as the NAACP Legal Defense Fund’s principal expert witness; the doll test is one part of his testimony", SRC["court"]],
  ["May 17, 1954", "A unanimous Court: school segregation violated the Fourteenth Amendment", SRC["decision"]],
  ["Footnote 11", "The decision cites Kenneth Clark’s 1950 paper", SRC["footnote"]],
  ["Since", "The doll tests have become a symbol of the Brown case", SRC["symbol"]]]

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "evidence-for-the-court",
  "out": DIR + "BH_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO,
  "css": (HERO_CSS + OBJ_CSS + FLOW_CSS + CHART_CSS + CARDS4_CSS
          + "table.chart { font-size: 8.4pt; } table.chart td { padding-top: 3.5pt; padding-bottom: 3.5pt; } table.chart td:first-child { font-size: 10.5pt; white-space: normal; width: 76pt; }"
          + " table.chart td:nth-child(2) { font-weight: 400; } table.chart td.src { white-space: normal; width: 96pt; line-height: 1.4; }"),
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("cols", [[("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will follow one strand of evidence in *Brown v. Board of Education*, from the separate schools of the Brown cases, through the Clarks’ doll tests and Kenneth Clark’s testimony, to the unanimous decision of May 17, 1954 and its footnote 11. They will weigh what the doll tests could show."]})],
      [("section", {"label": "Standards and themes", "list": [
        "**Historical thinking** — sourcing; evidence and argument; cause and consequence",
        "**Civics** — the Supreme Court; a unanimous decision; the Fourteenth Amendment",
        "**ELA** — reading a primary source closely: the Court’s own words"]}),
       ("section", {"label": "Materials needed", "list": [
        "*Who Do You See?*, *The Doll Test* tab (online), projected",
        "Page 3 of this plan; differentiated handouts"]})]]),
    ("section", {"label": "Before you teach", "body": [ROOM_DOLLTEST_CARE + " The children in the study were not to blame."]}),
    ("section", {"label": "Hook · 5 minutes", "title": "One sentence from the Court",
      "screen": {"phase": "Hook", "show": "words", "text": COURT_LINE, "cite": "Brown v. Board of Education, May 17, 1954",
                 "purpose": "Start from the Court’s conclusion, and ask what evidence could support it.",
                 "students": ["What does this sentence claim?", HOOK_Q]},
      "body": ["Project the Court’s sentence and read it slowly: *“" + COURT_LINE + "”* Ask: *“What does it claim? " + HOOK_Q + "”* *“Today we follow one piece of the evidence: it came from two psychologists, and some dolls.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "From the schools to the study",
      "screen": [
        {"phase": "Teach", "minutes": 3, "script": [0], "title": "Separate schools", "show": "question",
         "question": "What does “separate” mean here?",
         "purpose": "Set out what the Brown cases were about.",
         "students": ["Who was allowed to go to which school?", "Where did the cases come from?"]},
        {"phase": "Teach", "minutes": 6, "script": [1], "title": "The doll tests", "show": "chart",
         "caption": "Kenneth and Mamie Phipps Clark’s doll tests", "columns": ["Step", "What happened", "Source"],
         "rows": [{"cells": r} for r in STUDY_ROWS],
         "purpose": "Read what the Clarks did, and found, from the room’s checked facts.",
         "students": [FAIR_Q, "Where might young children have learned which doll was “nice”?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Into court", "show": "question", "question": WITNESS_Q,
         "purpose": "See how a study became evidence in a case.",
         "students": ["What is an expert witness?", "Why might a court need one?"]}],
      "body": [
        "Read: *“" + DT["segregation"] + "”* Ask who was allowed to go to which school: a true story that ends with the Court changing the law.",
        "Walk through the doll tests on the screen, row by row. A psychologist studies how people think and feel. Ask: *“" + FAIR_Q + "”* (Color is the only difference: a fair test.) After the crayons, give a moment of quiet, then ask where a child of three might have learned that. The Clarks named it: *prejudice, discrimination and segregation.*",
        "Then the study went to court: Thurgood Marshall asked the Clarks to repeat their experiments in Clarendon County, and Kenneth Clark became the NAACP Legal Defense Fund’s principal expert witness. Ask: *“" + WITNESS_Q + "”*"]}),
    ("cards", [
      ("Separate schools", ["Cases from Kansas, South Carolina, Virginia and Delaware: Black children denied admission to schools attended by white children."]),
      ("The doll tests", ["The 1940s: the Clarks study the psychological effects of segregation, with four dolls identical except for color."]),
      ("In court", ["Clarendon County, then the Briggs, Davis and Delaware cases: Kenneth Clark testifies as an expert witness."]),
      ("The decision", ["May 17, 1954: a unanimous Court. Footnote 11 cites Kenneth Clark’s 1950 paper."])]),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Work with the evidence at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three follow the doll tests from the study to the Court."]},
      "body": ["Students choose a handout. All three follow the doll tests from the study to the Court."]}),
    ("levels", {
      "green": "Put six events in order, match six key words to their meanings, explain why the dolls were identical except for color, and finish two sentences about the decision.",
      "yellow": "Read the Court’s own words as a primary source, complete a chain of evidence from the study to the decision, and explain why the doll test was only one part of Clark’s testimony.",
      "red": "Weigh each part of the study for what it can and cannot show, explain why the Court cited Clark in a footnote, and argue why the exhibition sets the Doll Test beside the Black Barbie poster."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "From study to decision",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "From study to decision", "show": "chart",
         "caption": "From the study to the decision", "columns": ["When", "What happened", "Source"],
         "rows": [{"cells": r} for r in COURT_ROWS],
         "purpose": "Pull the chain of evidence together, and weigh it.",
         "students": ["Which link in the chain matters most? Why?", "Why have the doll tests become a symbol of the case?"]},
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Groups name the link in the chain that matters most, and why. Read: *“" + DT["symbol"] + "”* Ask a Red Level reader why.",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green:** the boxes read 4, 1, 6, 2, 5, 3 as printed. **Yellow chain:** Clarendon County; footnote 11; the unanimous decision.",
      "**Exit ticket:** *name one link from the doll tests to the decision, and its source.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The Doll Test, in the room’s checked facts",
      "body": ["Every fact here is set in the exhibition as a museum note with its source, in the sources’ own words. Project or print it for the lesson."]}),
    chart(["Step", "What happened", "Source"], [
      ["Separate schools", DT["segregation"], SRC["segregation"]],
      ["Two psychologists", DT["clarks"], SRC["clarks"]],
      ["Four dolls", DT["dolls"], SRC["dolls"]],
      ["The questions", DT["asked"], SRC["asked"]],
      ["The answers", DT["answers"], SRC["answers"]],
      ["The crayons", DT["drawings"], SRC["drawings"]],
      ["What the Clarks found", DT["conclusion"], SRC["conclusion"]],
      ["In court", DT["clarendon"] + " " + DT["court"], SRC["clarendon"] + " · " + SRC["court"]],
      ["The decision", DT["decision"] + " " + DT["unequal"], SRC["decision"] + " · " + SRC["unequal"]],
      ["Footnote 11", DT["footnote"], SRC["footnote"]],
      ["What it teaches", DT["symbol"], SRC["symbol"]]], src_col=2),
    ("connection", ["**Online,** *Who Do You See?* tells the Doll Test step by step for the projector, with a question and teacher’s notes at each step, and ends on poster 2: *“" + P2["step"] + "”* **In the exhibition,** stand with the class at poster 2 and the display case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["In 1954 the Supreme Court decided *Brown v. Board of Education*: *“" + COURT_LINE + "”* Part of the evidence came from two psychologists, Kenneth and Mamie Phipps Clark, and their studies of young children, known as the doll tests. Today you follow that evidence from the study to the Court."]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Social Studies", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 Social Studies · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HERO_CSS + CHAIN_CSS + HO_CSS + css}

HO_CSS = """
.cardset { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7pt; margin: 4pt 0 8pt; break-inside: avoid; }
.cardset div { border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65); padding: 6pt 8pt; min-height: 46pt; font: 400 9pt/1.32 'Outfit'; }
.cardset .obox { float: right; width: 20pt; height: 20pt; border: 1.2pt solid #1d1c1a; border-radius: 3pt; background: #fff; margin: 0 0 3pt 6pt; }
.words { display: grid; grid-template-columns: 1fr 40pt 1.8fr; gap: 5pt 0; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.words p { margin: 0; border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 4pt 8pt; background: rgba(255,255,255,.65); font-size: 9.2pt; line-height: 1.3; }
.words p.l { font-weight: 500; }
.quote { border-left: 3pt solid var(--accent); padding: 3pt 0 3pt 10pt; margin: 4pt 0 8pt; font-style: italic; font-size: 9.8pt; line-height: 1.42; }
.frame { font-size: 10pt; margin: 6pt 0 2pt; font-weight: 500; }
.task:has(.words) { break-inside: avoid; }
"""

def ordercards(texts):
    return ("html", '<div class="cardset">' + "".join(f'<div><span class="obox"></span>{md(t)}</div>' for t in texts) + "</div>")

def quote(t):
    return ("html", f'<p class="quote">{md(t)}</p>')

GREEN = handout("green", "BH_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Put the story in order", "blocks": [
            P("Write **1 to 6** in the boxes, from the first event to the last."),
            ordercards([
              "Kenneth Clark testifies in court as an expert witness.",
              "Black children are denied admission to schools attended by white children.",
              "The doll tests become a symbol of the Brown case.",
              "In the 1940s, Kenneth and Mamie Phipps Clark design the doll tests.",
              "On May 17, 1954, the Supreme Court announces its unanimous decision.",
              "Thurgood Marshall asks the Clarks to repeat their experiments in Clarendon County, South Carolina."])]}),
  ("task", {"label": "Part 2", "title": "A fair test",
            "body": ["The Clarks used four plastic dolls, **identical except for color**. Why would they make the dolls the same in every way but one?"],
            "lines": 3}),
  ("task", {"label": "Part 3", "title": "Words for the case", "blocks": [
            P("Draw a line from each word to its meaning."),
            ("html", '<div class="words">' + "".join(f'<p class="l">{a}</p><span></span><p>{b}</p>' for a, b in [
              ("Segregation", "every justice agreed"),
              ("Psychologist", "where a writer shows their sources"),
              ("Expert witness", "keeping people apart by race"),
              ("Unanimous", "by its very nature; in itself"),
              ("Footnote", "a scientist who studies how people think and feel"),
              ("Inherently", "a person who tells a court what they know from their expert work")]) + "</div>")]}),
  ("task", {"label": "Part 4", "title": "What the Court decided",
            "blocks": [quote("“" + COURT_LINE + "”"), P("Finish each sentence in your own words."),
                       ("html", '<p class="frame">The Supreme Court decided that…</p>' + W(2)
                                + '<p class="frame">The doll tests were part of the evidence because…</p>' + W(2))]}),
  ("task", {"label": "Part 5", "title": "A question for the Clarks",
            "body": ["Kenneth and Mamie Phipps Clark were psychologists who listened to young children. If you could ask them one question, what would it be? Why?"],
            "lines": 3}),
  ("family", ["Tell your family about Kenneth and Mamie Phipps Clark. Ask: *what does “separate is not equal” mean to you?*"]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Read the Court’s words", "blocks": [
            P("These are the Supreme Court’s own words, from its decision of May 17, 1954."),
            quote("“In the field of public education, the doctrine of ‘separate but equal’ has no place. Separate educational facilities are inherently unequal.”"),
            quote("Separating children “from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone.”")],
            "body": ["**a.** What does the Court claim in the first passage? Put it in your own words.",
                     "**b.** In the second passage, which words describe harm to children?"], "lines": 4}),
  ("task", {"label": "Part 2", "title": "The chain of evidence", "blocks": [
            P("Fill the three empty boxes, using what you learned."),
            chain([("1940s", "The Clarks design and conduct the doll tests."),
                   ("Clarendon County", None),
                   ("In court", "Kenneth Clark testifies in the Briggs, Davis and Delaware cases."),
                   ("Footnote 11", None),
                   ("May 17, 1954", None)])]}),
  ("task", {"label": "Part 3", "title": "One part of the evidence",
            "blocks": [quote("“" + DT["court"] + "”")],
            "body": ["Why might a historian take care to say that the doll test was **only one part** of Clark’s testimony? What else might a court weigh?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Why it is remembered",
            "body": ["*“" + DT["symbol"] + "”* Why do you think a study of young children became the part of the case that people remember?"], "lines": 3}),
  ("family", ["Read the Court’s sentence aloud at home: *“" + COURT_LINE + "”* Ask your family what *inherently* means, and talk about it."]),
], ".chain div { min-height: 84pt; } .task:has(.chain) { break-inside: avoid; }")

RED = handout("red", "BH_Handout_Red_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Weigh the evidence", "blocks": [
            P("For each part of the Clarks’ study, say what it could show, and one thing it could **not** show on its own.")],
            "body": []}),
  ("table", {"head": ["Part of the study", "What it could show", "What it could not show on its own"], "rows": [
      ["Four dolls, identical except for color", "", ""],
      ["Black children between the ages of three and seven", "", ""],
      ["Questions: which doll is “nice,” “bad,” most like you", "", ""],
      ["Outline drawings colored “the same color as themselves”", "", ""],
      ["Repeated with children from Clarendon County", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Footnote 11",
            "blocks": [quote("“" + DT["footnote"] + "”")],
            "body": ["A footnote is where a writer shows their sources. Why might the Court show its sources at all? What does citing a scientist’s paper add to a legal decision?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "The doll and the poster",
            "blocks": [quote("“" + P2["step"] + " " + P2["challenged"] + "”"), P("The exhibition sets the Doll Test beside its poster on the first Black Barbie, introduced in 1980.")],
            "body": ["Argue why the two belong together. Use one fact about the doll tests and one sentence from the poster as evidence."], "lines": 6}),
  ("family", ["Ask an older family member what they remember learning about *Brown v. Board of Education*. Then share what you found out about the Clarks and footnote 11."]),
], "table.fill td:first-child { width: 34%; } table.fill td { height: 34pt; } .task { break-inside: avoid; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
