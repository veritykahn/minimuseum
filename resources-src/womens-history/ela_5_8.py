"""Grades 5–8 · ELA · "Everybody Has a Story"
Poster 2's biography of Violet Dina Want as a mentor text (a claim about a
person, shown through specific details), then the Talk About It room's
interview guide (remembered/oralHistoryText.ts: the Smithsonian's and the
Library of Congress's advice, its questions and its reflection questions).
Every quotation is the exhibition's, word for word; the sample yes-or-no
questions students rewrite are the lesson's own and make no claims."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import (POSTER2, BIO, EVERYBODY, OBJ_CSS, PIC_CSS, THUMBS, TIMING, SOUNDS,
                     review, photos, ph, md, quote)

DIR = "teachers/grades-5-8/ela/"
TITLE = "Everybody Has a Story"
SUB = "Grades 5–8 · ELA · Biography and the oral-history interview"
HERO = {"img": POSTER2, "pos": "center 30%"}

CLAIM = "Violet Want’s life is a testament to resilience, humor, and hard work."
TELL = "Widowed in 1956, Violet remained strong and resilient."
SHOW = "She continued to garden, even when rheumatoid arthritis made it difficult."
SMITHSONIAN = "The Smithsonian’s guide to collecting oral history puts it simply: “everybody has a story to tell.”"
# the Talk About It room's reflection questions, word for word
REFLECT = ["How does your tradition-bearer’s story relate to your community in both the present and the past? How does it relate to you?",
           "If the roles were reversed and you became the tradition-bearer, what stories would you like to tell?"]

# details from poster 2, word for word, each with the trait it best shows
DETAILS = [
  ("Violet had to leave school at 14 to work and help support the family.", "Hard work"),
  ("She married Harold … saying she had chosen him because he made her laugh.", "Humor"),
  ("She could take apart adult coats, resize them, and reassemble them perfectly for her children.", "Hard work"),
  ("She continued to garden, even when rheumatoid arthritis made it difficult.", "Resilience"),
  ("Violet always owned a piano, which she could play by ear, and it became the centerpiece of lively “knees-up” parties with family and friends.", "Humor"),
  ("She also had a particular fondness for young turnips, eating them like apples.", "Humor"),
]
DETAILS_SCREEN = {"caption": "Poster 2’s claim, and three of its details",
                  "columns": ["Trait", "A detail from the biography"],
                  "rows": [{"cells": ["Resilience", DETAILS[3][0]]}, {"cells": ["Humor", DETAILS[1][0]]}, {"cells": ["Hard work", DETAILS[2][0]]}]}

# closed questions against the room's open ones (INTERVIEW, word for word)
BETTER = [("Did you like school?", "What was school like for you? What is one thing a teacher said that you still remember?"),
          ("Did you have a job?", "What jobs have you done, inside or outside the home? How did you learn to do them?"),
          ("Do you know how to cook?", "What is something you know how to make, mend, grow or cook? Who taught you?")]
BETTER_SCREEN = {"caption": "Questions that begin with How, What or Why get better answers than “Did you…?”",
                 "columns": ["Instead of…", "Try…"], "rows": [{"cells": [a, b]} for a, b in BETTER]}

INTERVIEW = [
  "Where were you born, and where did you grow up?",
  "What was your home like when you were my age? What could you see from the window?",
  "What did you do for fun? What games, songs or books did you love?",
  "What is something you know how to make, mend, grow or cook? Who taught you?",
  "What stories did the older women in our family tell you? Which one do you remember best?",
  "What has changed most for girls and women since you were my age? What has stayed the same?",
]

OBJECTIVES = {
  "heading": "By the end of this lesson you will be able to:",
  "items": [
    ("find the specific details a biographer uses to show what a person was like",
     "find the details a biographer uses to show a person?", False),
    ("back a claim about a person with evidence from a text, and explain it",
     "back a claim about a person with evidence, and explain it?", False),
    ("write open interview questions that begin with How, What or Why, with follow-ups",
     "write open interview questions, with follow-ups?", False),
    ("write a short biographical paragraph whose details show, not tell",
     "write a paragraph whose details show, not tell?", True)],
  "why": "Most lives are never written down. Asking good questions, listening, and choosing the details that make a person real is how an ordinary life becomes a story others can keep."}

CSS = PIC_CSS + """
.pb { break-after: auto; height: 0; margin: 0; } .pb + * { break-before: page; }
.panel { background: rgba(255,255,255,.62); border: 1pt solid #1d1c1a; border-radius: 4pt; padding: 8pt 11pt 4pt; margin: 4pt 0 9pt; font-size: 9.6pt; line-height: 1.42; break-inside: avoid; }
.panel p { margin: 0 0 5pt; }
.claim { font: italic 400 13pt/1.3 'Cormorant Garamond', serif; border-left: 2pt solid #1D3557; padding-left: 9pt; margin: 4pt 0 8pt; }
.check { list-style: none; padding: 0; margin: 4pt 0 6pt; font-size: 9.4pt; }
.check li { margin: 0 0 5pt; padding-left: 18pt; text-indent: -18pt; }
.check li::before { content: ""; display: inline-block; width: 10pt; height: 10pt; border: 1pt solid #1d1c1a; background: #fff; margin-right: 8pt; vertical-align: -2pt; }
.bank { display: flex; gap: 10pt; margin: 2pt 0 6pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 1pt 12pt; font: 500 9.5pt 'Outfit'; background: rgba(255,255,255,.6); }
"""

# ── lesson plan ────────────────────────────────────────────────────────

LESSON = {
  "slug": "everybody-has-a-story",
  "out": DIR + "WH_LP_ELA.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 ELA", "hero": HERO,
  "css": CSS + OBJ_CSS + "table.fill td { padding: 4pt 6pt 5pt 0; }",
  "blocks": [
    ("timing", [("Hook", 5, TIMING["hook"]), ("Read", 12, TIMING["teach"]), ("Write", 23, TIMING["activity"]), ("Close", 5, TIMING["close"])]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students read poster 2’s biography of Violet Dina Want as a mentor text: a claim about a person, made believable by specific details. They tell showing from telling, back a claim with evidence, then turn to the exhibition’s *Talk About It* guide to write open interview questions for a woman in their own family or community, and begin to write her story."]}),
    ("cols", [
      [("section", {"label": "Standards and themes", "list": [
        "**Reading** — a claim and its evidence; a writer’s choice of detail",
        "**Writing** — biographical narrative; showing, not telling",
        "**Speaking and listening** — open questions, follow-ups, listening well"]})],
      [("section", {"label": "Materials needed", "list": [
        "Poster 2 on a screen, or page 3 of this plan",
        "*Talk About It* (in the *Who Gets Remembered?* room), if you have a screen",
        "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "Prove it",
      "screen": [
        {"phase": "Hook", "minutes": 3, "script": [0], "title": "A claim about a life", "show": "words", "text": CLAIM,
         "cite": "Poster 2 · Biography of a Working Class Woman",
         "purpose": "Meet the biography’s claim before its evidence, and ask what would make it believable.",
         "students": ["Would you believe this about a stranger?", "What would a writer have to show you?"]},
        {"phase": "Hook", "minutes": 2, "script": [1], "title": "Everybody", "show": "words", "text": "“everybody has a story to tell.”",
         "cite": "The Smithsonian’s guide to collecting oral history",
         "purpose": "Set the lesson’s turn: from Violet’s story to the stories students can collect.",
         "students": ["Whose story would you tell?"]}],
      "body": [f"Show poster 2’s last line without the rest: *“{CLAIM}”* Ask: *“Would you believe this about a stranger? What would a writer have to show you?”* Take answers; they are the lesson’s checklist.",
               f"Then: {SMITHSONIAN} *“Today we read how one family told one woman’s story, and get ready to collect one of our own.”*"]}),
    ("section", {"label": "Read and model · 12 minutes", "title": "Details that prove, questions that open",
      "screen": [
        {"phase": "Read", "minutes": 5, "script": [0], "title": "Claim and evidence", "show": "chart", **DETAILS_SCREEN,
         "purpose": "See how a biographer backs each word of a claim with a specific detail.",
         "students": ["Which detail convinces you most?", "Find another detail on the poster for one of the traits."]},
        {"phase": "Read", "minutes": 3, "script": [1], "title": "Telling or showing?", "show": "chart",
         "caption": "Two sentences from poster 2", "columns": ["Telling", "Showing"], "rows": [{"cells": [TELL, SHOW]}],
         "purpose": "Tell a statement from a detail that lets the reader see for themselves.",
         "students": ["Which one makes you see her?", "Why might a writer need both?"]},
        {"phase": "Read", "minutes": 4, "script": [2], "title": "Questions that open", "show": "chart", **BETTER_SCREEN,
         "purpose": "Learn the first rule of a good interview from the exhibition’s guide.",
         "students": ["What answer would each question get?", "Write a follow-up for one of the questions on the right."]}],
      "body": [
        f"**Claim and evidence.** Read poster 2 together (page 3), and ask students to underline one detail for each word of the claim: *resilience, humor, hard work*. Three that work: she left school at 14 to help support her family; she said she chose Harold *“because he made her laugh”*; she could *“take apart adult coats, resize them, and reassemble them perfectly for her children.”*",
        f"**Telling or showing?** Put two sentences side by side: *“{TELL}”* and *“{SHOW}”* The first tells; the second lets us see. A good biography needs both, but the details do the proving.",
        "**Questions that open.** The exhibition’s *Talk About It* guide, drawn from the Smithsonian and the Library of Congress, says questions that begin with *How*, *What* or *Why* get better answers than *“Did you…?”*; ask one thing at a time; don’t be afraid of quiet moments; ask a follow-up, such as *“Can you give me an example?”* Model one closed question and its open version."]}),
    ("section", {"label": "Write · 23 minutes",
      "screen": {"phase": "Write", "show": "levels", "title": "Choose a handout",
                 "purpose": "Read for evidence, plan an interview and write, at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three read Violet’s biography for evidence, then plan an interview of your own."]},
      "body": ["Students choose a handout. All three read the same biography for evidence and plan an interview with a woman in their family or community."]}),
    ("levels", {
      "green": "Match six details from the biography to the trait each shows, turn three yes-or-no questions into open ones, choose interview questions, and write one sentence that shows instead of tells.",
      "yellow": "Build a claim, evidence and reasoning table for the biography, sort telling from showing and rewrite a telling sentence, and plan an interview of five questions, each with a follow-up.",
      "red": "Ask why a biographer includes small, surprising details and whose voice the poster leaves out, answer one of the exhibition’s reflection questions, and draft a biographical paragraph that opens with a claim and proves it."}),
    ("section", {"label": "Share and look back · 5 minutes", "title": "Your turn to tell",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Your turn to tell", "show": "question", "question": REFLECT[1],
         "purpose": "Turn the lesson around: students are the keepers of stories too.",
         "students": ["Read your best question, or your best showing sentence, to a partner."]},
        review(OBJECTIVES, 3, [1], hint=THUMBS)],
      "body": [f"Pairs read aloud their best interview question or their best showing sentence. Close with the exhibition’s own question: *“{REFLECT[1]}”*",
               "Ask the objectives back: *“Can you now…?”* Thumbs up, sideways or down; ask a Red Level writer to read a sentence for the last."]}),
    ("cols", [
      [("section", {"label": "For the teacher", "body": [
        "**The interview is homework.** *Talk About It* says to ask a parent or guardian first, and to choose a woman who is family to you; a woman in the community who has known the student a long time is a good choice too. Not every student can interview family; welcome any trusted adult.",
        "**Poster 2 is honest about hard things,** including the Blitz and Harold’s drinking. This lesson reads its details of home and work; preview the poster before projecting all of it."]})],
      [("section", {"label": "Answer notes and assessment", "list": [
        "**Green:** hard work — school at 14, the coats; humor — Harold, the piano, the turnips; resilience — the garden.",
        "**Yellow:** the first sentence tells; showing sentences give an action or object the reader can see.",
        "**Red:** small details make a person real and particular; the poster is told by her family, and Violet’s own words appear only as reported speech.",
        "**Assessment:** a paragraph with a claim, three details and no word of the claim repeated as proof."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "Biography of a working class woman",
      "body": ["From poster 2, word for word. Read it as a mentor text: underline one detail for each word of its claim."]}),
    ("html", '<div style="columns:2;column-gap:18pt;font-size:9.2pt;line-height:1.42">'
             + "".join(f"<p style='margin:0 0 6pt'>{md(BIO[k])}</p>" for k in ["father", "factory", "faith", "family", "seamstress", "music", "essex", "greengrocer", "later"])
             + "</div>"),
    ("html", quote(BIO["legacy"], "Poster 2 · the last paragraph")),
    ("section", {"label": "Questions to ask in front of the posters", "list": [
      "Which single detail on poster 2 tells you most about Violet? Why that one?",
      "What would you want to ask Violet, if you could?",
      "Who wrote this biography, and how might that shape what it says?",
      "What is one thing a woman in your family knows how to do that you would like to learn before it is forgotten?"]}),
    ("connection", ["**Online,** *Talk About It* in the *Who Gets Remembered?* room has the full interview guide: what to do before, while listening and after, and fourteen questions to start with. **In the exhibition,** poster 2 and the *Violet’s Life* room."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────

CONTEXT = ["Violet Dina Want was born in London in 1907 into a big working family. She left school at 14 to work as a machinist, raised four children, played the piano by ear and grew roses. Her family wrote her story down so it would not be lost. Their biography ends: *“" + CLAIM + "”*"]

def handout(level, out, blocks, css=""):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · ELA", "level": level, "context": CONTEXT, "css": CSS + css,
            "foot": f"Handout · Grades 5–8 ELA · {level.title()} Level", "blocks": blocks, "hero": HERO}

GREEN = handout("green", "WH_Handout_Green_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Find the evidence",
            "blocks": [("html", '<p>Each detail is from Violet’s biography. Which trait does it show best? Write one word from the bank.</p>'
                        '<div class="bank"><span>Resilience</span><span>Humor</span><span>Hard work</span></div>')]}),
  ("table", {"head": ["Detail from the biography", "Trait"], "rows": [[md(d), ""] for d, _ in DETAILS]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Open the question",
            "body": ["Questions that begin with **How**, **What** or **Why** get better answers than *“Did you…?”* Rewrite each one."]}),
  ("table", {"head": ["Yes-or-no question", "My open question"], "rows": [[a, ""] for a, _ in BETTER]}),
  ("task", {"label": "Part 3", "title": "Choose your questions",
            "blocks": [("html", '<p>Who could you interview: a grandmother, aunt, mother, or another woman who is family to you? Check <b>three</b> questions to ask her.</p><ul class="check">'
                        + "".join(f"<li>{md(q)}</li>" for q in INTERVIEW) + "</ul>")],
            "body": ["Write one question of your own:"], "lines": 1}),
  ("task", {"label": "Part 4", "title": "Show, don’t tell",
            "body": ["*“Violet remained strong and resilient”* **tells**. *“She continued to garden, even when rheumatoid arthritis made it difficult”* **shows**. Write one sentence that **shows** a woman you know is hardworking, without using the word *hardworking*."], "lines": 3}),
  ("family", ["Ask a parent or guardian which woman in your family you could interview. Then ask her: may I?"]),
], "table.fill td:first-child { width: 66%; } table.fill td { padding-top: 8pt; padding-bottom: 16pt; font-size: 9.6pt; } .pb ~ table.fill td:first-child { width: 36%; } .pb ~ table.fill td { padding-bottom: 20pt; }")

YELLOW = handout("yellow", "WH_Handout_Yellow_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "Claim, evidence, reasoning",
            "blocks": [("html", f'<p class="claim">“{md(CLAIM)}”</p>'
                        "<p>Find one detail in the biography for each trait. Quote it, then explain how it proves the trait.</p>")]}),
  ("table", {"head": ["Claim", "Evidence: a detail, quoted", "Reasoning: how it proves the trait"], "rows": [
      ["Resilience", "", ""], ["Humor", "", ""], ["Hard work", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Telling or showing?",
            "blocks": [("html", "<p>Each sentence is from the biography. Write <b>T</b> for telling or <b>S</b> for showing in the box.</p>"
                        + "".join(f'<p class="ts"><span></span>{md(t)}</p>' for t in [
                            "Widowed in 1956, Violet remained strong and resilient.",
                            "She could take apart adult coats, resize them, and reassemble them perfectly for her children.",
                            "She also had a particular fondness for young turnips, eating them like apples."]))]}),
  ("pagebreak", None),
  ("task", {"label": "Part 3", "title": "Show it",
            "body": ["Rewrite this telling sentence about someone you know so that it **shows**: *“She is very kind.”*"], "lines": 3}),
  ("task", {"label": "Part 4", "title": "Plan an interview",
            "body": ["Plan five open questions for a woman in your family or community, one for each part of her life. For each, write a follow-up, such as *“Can you give me an example?”*"]}),
  ("table", {"head": ["Part of her life", "My question", "My follow-up"], "rows": [
      ["Getting started", "", ""], ["Growing up", "", ""], ["Work and everyday life", "", ""], ["Family stories and keepsakes", "", ""], ["Looking back", "", ""]]}),
  ("family", ["Ask her to bring an old photo, letter or keepsake to the interview. The guide says objects bring back memories."]),
], "table.fill td:first-child { width: 22%; font-weight: 500; } table.fill td { padding-top: 6pt; padding-bottom: 22pt; font-size: 9.4pt; } .pb ~ table.fill td { padding-bottom: 40pt; } .ts { display: grid; grid-template-columns: 22pt 1fr; gap: 8pt; align-items: center; margin: 0 0 6pt; font-size: 9.6pt; } .ts span { width: 18pt; height: 18pt; border: 1pt solid #1d1c1a; background: #fff; display: block; }")

RED = handout("red", "WH_Handout_Red_ELA.pdf", [
  ("task", {"label": "Part 1", "title": "The biographer’s choices",
            "blocks": [("html", '<div class="panel"><p>She also had a particular fondness for young turnips, eating them like apples.</p><p>She also had a surprising penchant for wrestling, tuning in every Saturday, and knew Tiny Carr personally, a famous referee of the time.</p></div>')],
            "body": ["Turnips eaten like apples; a famous wrestling referee. Why might a biographer include small, surprising details like these? What would the story lose without them?"], "lines": 3}),
  ("task", {"label": "Part 2", "title": "Whose voice?",
            "body": ["The biography was written down by Violet’s family. Her own words appear only once, reported: she said she chose Harold *“because he made her laugh.”* How might her story change if Violet had told it herself? What might she have chosen to include, or leave out?"], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Reflect",
            "body": ["Answer one of the exhibition’s reflection questions. Circle the one you choose.",
                     "**A.** " + REFLECT[0], "**B.** " + REFLECT[1]], "lines": 4}),
  ("task", {"label": "Part 4", "title": "Draft a biographical paragraph",
            "body": ["Write about a woman in your family or community. Open with a **claim** about her, like poster 2’s last line. Then **prove** it with three specific details, each one something a reader could see or hear. Don’t repeat the words of your claim as proof."], "lines": 9}),
  ("family", ["Read your paragraph to her, and ask what you got right, what you missed, and what she would add."]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
