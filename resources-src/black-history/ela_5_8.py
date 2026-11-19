"""Grades 5–8 · ELA · "Making the Case"
Poster 1, Black History Month, read as an argument: its claim and the
concession that opens it, its reasons, its evidence and examples, and the
weight of its words; then students write an argument of their own. The
poster's text is quoted from app/exhibitions/black-history/blackHistory.ts,
word for word; the readings are the poster's own recordings
(public/exhibitions/black-history/audio/).

The poster names its surveys without saying whose they are, and the lesson
says so: weighing that sentence is the Red level's work. Martin Luther King
Jr., Harriet Tubman and Langston Hughes are named, as the poster names them."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/ela/"
TITLE = "Making the Case"
SUB = "Grades 5–8 · ELA · Poster 1 as an argument"
HERO = HERO_RING
AUD = BH + "audio/"

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Three sentences open the poster’s three parts. Which one is arguing?"
DESPITE_Q = "Why might a writer begin a claim with “Despite”?"

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find the central claim of poster 1, and the concession that opens it",
     "find the poster’s claim, and the concession that opens it?", False),
    ("tell a reason from the evidence or example that supports it",
     "tell a reason from the evidence that supports it?", False),
    ("explain how the writer’s word choices give the argument weight",
     "explain how word choice gives an argument weight?", False),
    ("weigh the poster’s evidence, and write an argument of your own with a claim, reasons and evidence",
     "weigh the poster’s evidence, and write an argument of your own?", True)],
  "why": "Poster 1 does not only tell the story of Black History Month; it argues that the month still matters. Learning to find a claim, test its evidence and make a case of your own is how a reader becomes a citizen who can weigh what they are told."}

# the poster's argument, part by part (its own words)
ARG = [
  ("Background", "woodson"), ("Background", "february"),
  ("Claim", "claim"), ("Reason", "reminder"), ("Evidence", "surveys"), ("Reason", "bridge"),
  ("Second claim", "preserve"), ("Examples", "sites"), ("Reason", "honor"), ("Conclusion", "future")]
ARG_ROWS = [[job, P1[k]] for job, k in ARG]

WORDS = [("Historical amnesia", "a whole society forgetting parts of its past"),
         ("Racial uplift", "working to raise up the lives and chances of Black Americans"),
         ("Resilience", "the strength to recover and keep going through hardship"),
         ("Preservation", "keeping something safe so it lasts"),
         ("Transformation", "deep change")]

CSS = """
.posterpage { display: grid; grid-template-columns: 178pt 1fr; gap: 16pt; align-items: start; margin: 4pt 0 6pt; }
.posterpage img { width: 178pt; height: auto; border: .8pt solid #1d1c1a; border-radius: 3pt; }
.posterpage .txt p { font-size: 8.9pt; line-height: 1.42; margin: 0 0 5pt; }
.posterpage .txt p.st { font: 600 11.5pt/1.25 'Cormorant Garamond', serif; margin-top: 8pt; }
"""

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "making-the-case",
  "out": DIR + "BH_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO,
  "css": (HERO_CSS + OBJ_CSS + FLOW_CSS + CHART_CSS + CARDS4_CSS + CSS
          + "table.chart td:first-child { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; width: 74pt; white-space: normal; padding-top: 6pt; }"
          + " table.chart td:nth-child(2) { font-weight: 400; } table.chart { font-size: 8.6pt; }"),
  "blocks": [
    ("timing", [("Hook", 5, C_HOOK), ("Teach", 13, C_TEACH), ("Activity", 20, C_ACT), ("Debrief", 7, C_CLOSE)]),
    ("objectives", OBJECTIVES),
    ("cols", [[("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read poster 1, *Black History Month*, as an argument. They will find its central claim (*“" + P1["claim"] + "”*) and the concession that opens it, tell its reasons from its evidence and examples, and explain how words such as *historical amnesia* and *resilience* give it weight. Then they will weigh its evidence and write an argument of their own."]})],
      [("section", {"label": "Standards and themes", "list": [
        "**Reading informational text** — a central claim; reasons, evidence and examples",
        "**Writing** — an argument with a claim, reasons, evidence and a concession",
        "**Language** — word choice and connotation",
        "**Speaking and listening** — a text read aloud"]}),
       ("section", {"label": "Materials needed", "list": [
        "Poster 1: page 3 of this plan, or the poster online, with its readings",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Which sentence argues?",
      "screen": {"phase": "Hook", "show": "listen", "question": HOOK_Q,
                 "clips": [{"src": AUD + "poster1-01.mp3", "label": "Part one", "sub": "Black History Month, read aloud"},
                           {"src": AUD + "poster1-04.mp3", "label": "Part two", "sub": "Black History Month, read aloud"},
                           {"src": AUD + "poster1-08.mp3", "label": "Part three", "sub": "Black History Month, read aloud"}],
                 "purpose": "Hear the poster before reading it, and tell telling from arguing.",
                 "students": ["Listen to the three sentences.", "Which one tells? Which ones argue?"]},
      "body": ["Play the three sentences that open the poster’s three parts, without showing the text. Ask: *“" + HOOK_Q + "”* The first tells a story (Woodson created Negro History Week in 1926). The second and third make claims someone could disagree with. *“Today we read this poster the way a debater would.”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Claim, reasons, evidence",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "The claim", "show": "words", "text": P1["claim"],
         "cite": "Black History Month",
         "purpose": "Find the claim, and see how the concession prepares for it.",
         "students": [DESPITE_Q, "What would someone who disagreed say?"]},
        {"phase": "Teach", "minutes": 5, "script": [1], "title": "How the case is built", "show": "chart",
         "caption": "Poster 1, part by part", "columns": ["Job", "The poster’s words"],
         "rows": [{"cells": r} for r in ARG_ROWS[2:]],
         "purpose": "Tell each sentence’s job: reason, evidence, example or conclusion.",
         "students": ["Which sentence gives evidence?", "Which sentences give examples?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Words with weight", "show": "words",
         "text": "\n".join(w for w, _ in WORDS),
         "purpose": "Notice how chosen words make an argument stronger.",
         "students": ["What does each word mean?", "Why might the writer have chosen it?"]}],
      "body": [
        "Show the claim: *“" + P1["claim"] + "”* Ask: *“" + DESPITE_Q + "”* The writer admits a point first (*significant progress*), then argues that the month is still needed. That move is a **concession**: it answers a reader who disagrees before they speak.",
        "Read the rest of the poster on page 3 and give each sentence a job. Two reasons follow the claim: the month is *a reminder* that counters *historical amnesia*, and it can *bridge these gaps*. One sentence offers evidence: *“" + P1["surveys"] + "”* Ask: *whose surveys?* The poster does not say. A second claim (preservation) is backed by examples: historical sites and artifacts given to museums.",
        "Put up five words: *historical amnesia, racial uplift, resilience, preservation, transformation.* Ask what each means, and why a writer would choose *amnesia*, a word for an illness of memory, over *forgetting*."]}),
    ("cards", [
      ("Claim", ["What the writer wants you to accept. Here: Black History Month *remains a vital tool for transformation*."]),
      ("Concession", ["A point the writer grants first, to answer a reader who disagrees: *Despite significant progress in race relations…*"]),
      ("Reason", ["Why the claim is true. Here: the month counters *historical amnesia*, and can *bridge these gaps*."]),
      ("Evidence", ["What supports a reason: a fact, a finding, an example. Test it: *Surveys reveal…* Whose surveys?"])]),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read and make arguments at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read the poster’s argument, then make one of their own."]},
      "body": ["Students choose a handout. All three read the poster’s argument, then make one of their own."]}),
    ("levels", {
      "green": "Give five of the poster’s sentences their jobs, match five strong words to their meanings, and write a three-sentence argument from a frame.",
      "yellow": "Map the poster’s argument in a table, explain its concession, say what they would need to know to trust its survey sentence, and write a paragraph arguing why the month matters at their school.",
      "red": "Rank the poster’s reasons, weigh the effect of its word choices, test its unsupported evidence, and write a two-paragraph argument that answers a reader who disagrees."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Read it back",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "Read it back", "show": "question",
         "question": "Which reason in the poster is strongest? Which would you add?",
         "purpose": "Share arguments, and weigh the poster’s reasons against the class’s own.",
         "students": ["Read your claim aloud.", "Name the reason you think is strongest."]},
        {"phase": "Debrief", "minutes": 3, "script": [1], "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in OBJECTIVES["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(OBJECTIVES["items"]) if deep]}],
      "body": ["Three students, one from each level, read their claim and best reason aloud. Ask: *“Which reason in the poster is strongest? Which would you add?”*",
               LOOK_BACK_SAY]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green, Part 1:** claim — *Despite significant progress…*; reason — *It serves as a reminder…*; evidence — *Surveys reveal…*; example — *From safeguarding historical sites…*; conclusion — *As society evolves…* **Yellow, Part 1:** sentences 2, 3, 4, 5, 6, 7, 8 in table order.",
      "**Exit ticket:** *write one claim about why history matters, and one reason for it.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Poster 1, Black History Month, word for word",
      "body": ["The poster’s text in its three parts, each opening with a large sentence. Project or print it for the lesson."]}),
    ("html", '<div class="posterpage"><img src="' + POSTER1 + '" alt=""><div class="txt">'
             + f'<p>{md(P1["woodson"])} {md(P1["historian"])} {md(P1["association"])} {md(P1["february"])}</p>'
             + f'<p class="st">{md(P1["claim"])}</p><p>{md(P1["reminder"])} {md(P1["surveys"])} {md(P1["bridge"])}</p>'
             + f'<p class="st">{md(P1["preserve"])}</p><p>{md(P1["sites"])} {md(P1["honor"])} {md(P1["future"])}</p>'
             + "</div></div>"),
    ("section", {"label": "Questions to ask about the poster", "list": [
      "Who is the poster talking to? How can you tell?",
      "What does the writer want readers to think, and to do?",
      "Which sentence would you underline if you only had one? Why?",
      "What question would you ask the writer about the surveys?"]}),
    ("connection", ["**Online,** the poster walks through its text panel by panel, with each part read aloud and a *Talk about it* question for each part. **In the exhibition,** read poster 1 beside poster 2: both make a case."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Poster 1, *Black History Month*, tells how Carter G. Woodson created Negro History Week in 1926. Then it makes a case: *“" + P1["claim"] + "”* Today you read the poster as an argument, and make an argument of your own."]

HO_CSS = """
.quote { border-left: 3pt solid var(--accent); padding: 3pt 0 3pt 10pt; margin: 4pt 0 8pt; font-style: italic; font-size: 9.8pt; line-height: 1.42; }
.jobs { display: grid; grid-template-columns: 1fr 74pt; gap: 5pt 10pt; margin: 4pt 0 8pt; align-items: center; break-inside: avoid; }
.jobs p { margin: 0; font-size: 9.2pt; line-height: 1.34; font-style: italic; border-left: 2pt solid #1d1c1a; padding-left: 7pt; }
.jobs span { border-bottom: 1pt solid #1d1c1a; height: 18pt; }
.bank { display: flex; flex-wrap: wrap; gap: 7pt; margin: 4pt 0 8pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 11pt; font: 400 10pt 'Outfit'; background: rgba(255,255,255,.65); }
.words { display: grid; grid-template-columns: 1fr 40pt 1.8fr; gap: 5pt 0; align-items: center; margin: 4pt 0 8pt; break-inside: avoid; }
.words p { margin: 0; border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 4pt 8pt; background: rgba(255,255,255,.65); font-size: 9.2pt; line-height: 1.3; }
.words p.l { font-weight: 500; }
.frame { font-size: 10pt; margin: 6pt 0 2pt; font-weight: 500; }
.task { break-inside: avoid; }
"""

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT,
            "foot": f"Student Handout · Grades 5–8 ELA · {level.title()} Level",
            "blocks": blocks, "hero": HERO, "css": HERO_CSS + HO_CSS + css}

def quote(t):
    return ("html", f'<p class="quote">{md(t)}</p>')

def jobs(keys):
    return ("html", '<div class="jobs">' + "".join(f"<p>“{md(P1[k])}”</p><span></span>" for k in keys) + "</div>")

GREEN = handout("green", "BH_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Give each sentence its job", "blocks": [
            P("Every sentence in an argument has a job. Write one job from the bank beside each sentence from the poster."),
            ("html", '<div class="bank"><span>Claim</span><span>Reason</span><span>Evidence</span><span>Example</span><span>Conclusion</span></div>'),
            jobs(["reminder", "future", "claim", "sites", "surveys"])]}),
  ("task", {"label": "Part 2", "title": "Words with weight", "blocks": [
            P("Draw a line from each word to its meaning."),
            ("html", '<div class="words">' + "".join(f'<p class="l">{a}</p><span></span><p>{b}</p>' for a, b in [
              (WORDS[0][0], WORDS[3][1]), (WORDS[1][0], WORDS[4][1]), (WORDS[2][0], WORDS[0][1]),
              (WORDS[3][0], WORDS[2][1]), (WORDS[4][0], WORDS[1][1])]) + "</div>")]}),
  ("task", {"label": "Part 3", "title": "Make your own case", "blocks": [
            P("Write a three-sentence argument. Finish each frame."),
            ("html", '<p class="frame">Claim: Black History Month matters because…</p>' + W(2)
                     + '<p class="frame">Reason: One reason is that…</p>' + W(2)
                     + '<p class="frame">Example: For example, the poster says…</p>' + W(2))]}),
  ("family", ["Read your three sentences to your family. Ask them: *what part of history do you think people should never forget?*"]),
])

YELLOW = handout("yellow", "BH_Handout_Yellow_ELA.pdf", [
  ("html", '<p class="label" style="margin-top:2pt">The poster’s argument</p><div class="quote numbered">' + " ".join(f"<b>{n}</b> {md(P1[k])}" for n, k in enumerate(
        ("claim", "reminder", "surveys", "bridge", "preserve", "sites", "honor", "future"), 1)) + "</div>"),
  ("task", {"label": "Part 1", "title": "Map the argument", "blocks": [
    P("Find the sentence that does each job: write its number and the key words that show it."),
    ("table", {"head": ["Job", "Sentence", "Key words"], "rows": [
      ["Claim", "1", "a vital tool for transformation"], ["Reason", "", ""], ["Evidence", "", ""], ["Reason", "", ""],
      ["Second claim", "", ""], ["Examples", "", ""], ["Reason", "", ""], ["Conclusion", "", ""]]})]}),
  ("task", {"label": "Part 2", "title": "The concession",
            "body": ["The claim begins with *“Despite significant progress in race relations.”* What does the writer admit here? Why would admitting it make the argument stronger?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Test the evidence",
            "body": ["Sentence 3 is the poster’s evidence, but it does not say whose surveys these are. What would you need to know before you trusted it?"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Your paragraph",
            "body": ["Write a paragraph arguing why Black History Month matters at **your** school. Include a claim, two reasons and one piece of evidence or an example."], "lines": 8}),
  ("family", ["Ask your family which reason in your paragraph convinces them most, and why."]),
], ".quote.numbered { font-size: 8.9pt; line-height: 1.45; } .quote.numbered b { font: 600 8pt 'Outfit'; font-style: normal; color: var(--accent); margin: 0 1pt 0 3pt; }"
   " table.fill td { height: 17pt; padding-top: 3pt; padding-bottom: 3pt; } table.fill td:first-child { width: 22%; font-weight: 500; } table.fill td:nth-child(2) { width: 14%; }")

RED = handout("red", "BH_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Rank the reasons", "blocks": [
            P("These four sentences from the poster support its case. Rank them **1** (strongest) to **4**, and explain your first choice."),
            jobs(["reminder", "bridge", "sites", "honor"])], "lines": 3}),
  ("task", {"label": "Part 2", "title": "The weight of words",
            "body": ["The poster could have said *forgetting*; it says *historical amnesia*. It could have said *important*; it says *a vital tool for transformation*. Choose one pair. What does the poster’s word make a reader feel or think that the plain word would not?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Unsupported evidence",
            "blocks": [quote("“" + P1["surveys"] + "”")],
            "body": ["This is the poster’s only evidence of its kind, and it names no source. Does that weaken the argument? How would you make this sentence stronger, without changing what it claims?"], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Answer a reader who disagrees",
            "body": ["A reader says: *“There has been so much progress. We do not need a whole month any more.”* Write two paragraphs. In the first, grant what is true in their view. In the second, answer them with reasons and evidence of your own, and one from the poster."], "lines": 6}),
  ("family", ["Read your two paragraphs to someone at home. Ask them to argue back, then decide together which reason is strongest."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
