"""Grades 5–8 · Social Studies · "Revolution for Everyone?"
The two posters read as a historical account: what changed in Victorian
Britain, what persisted, and for whom. Facts follow the posters and their
added panels in app/exhibitions/victorian/victorian.ts (with the 1842 coal
mines report and law, the Great Exhibition, the V&A, railway time and the
revival of Christmas). The 1842 report is taught as history, without
role-play, as the exhibition frames it."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-5-8/social-studies/"
TITLE = "Revolution for Everyone?"
SUB = "Grades 5–8 · Social Studies · Change, reform and who it reached"

HERO = {"img": ROOM, "pos": "center 55%", "credit": ROOM_CREDIT}

# poster 1's own words, as printed
LEDE = "Victorian Britain was a time of innovation, fashion, culture, and the birth of one of the most iconic museums in the world today!"
PERSISTED = "Social reform improved conditions for workers, while class divisions and urban challenges persisted."
HOOK_Q = "Whose Victorian Britain is this? Who might be missing from it?"

# the evidence, every line from the posters and their added panels: (date, evidence, source)
EVIDENCE = [
  ("1837–1901", "The Victorian era: the reign of Queen Victoria. Rapid industrial growth made Britain a global superpower with an expanding empire.", "Poster 1"),
  ("1840", "The first commercially successful use of Cooke and Wheatstone’s electric telegraph anywhere in the world, on a London railway.", "Poster 1"),
  ("1842", "A report on children working in coal mines shocked the public. A new law made it illegal for women and girls, or boys under ten, to work underground. With one inspector for the whole country it was hard to enforce: a first step.", "Poster 1"),
  ("1851", "The Great Exhibition in the Crystal Palace, Hyde Park: about six million visitors, a third of Britain’s population.", "Poster 1"),
  ("1852", "The V&A is founded, “a schoolroom for everyone” in the words of its first director, Henry Cole. Gas lighting let its galleries open on winter evenings, so working people could visit after a day’s work.", "Poster 1"),
  ("by 1855", "Nearly every town has switched from its own Sun time to “railway time.”", "Poster 1"),
  ("1800s", "At the start of the century Christmas was hardly celebrated: many businesses did not treat it as a holiday, and long hours left workers little time. The new railways let people who had moved to the cities travel home for Christmas.", "Poster 2"),
  ("by 1900", "Christmas had become the biggest celebration of the year in Britain.", "Poster 2"),
]

OBJECTIVES = objectives([
    ("read a museum poster as a historical account: what it celebrates, and what it passes over quickly",
     "read a poster as a historical account?", False),
    ("sort evidence of change and continuity in Victorian Britain",
     "sort evidence of change and continuity?", False),
    ("explain who gained from Victorian changes, and who did not, or not yet",
     "explain who gained, and who did not, or not yet?", False),
    ("judge how far a reform changed lives, using its limits as evidence",
     "judge how far a reform changed lives?", True)],
  "Every account of the past chooses what to put first. Asking *for whom?* is how historians test a story of progress, in Victorian Britain and today.")

THEMES = [
  {"label": "Industry and invention", "text": "Railways, the telegraph and photography; railway time.",
   "items": [{"img": PLATFORM, "caption": "The railway", "alt": "A painting of a Victorian railway platform under an iron-and-glass roof, steam drifting over the tracks", "aspect": 2400 / 1340}]},
  {"label": "A schoolroom for everyone", "text": "The Great Exhibition, 1851; the V&A, 1852, open on winter evenings.",
   "items": [{"img": ROOM, "caption": "The V&A’s Centre Refreshment Room, opened 1868", "alt": "A sepia photograph of a grand Victorian dining room beneath tall arched stained-glass windows", "aspect": 1510 / 1250}]},
  {"label": "Reform, slowly", "text": "The 1842 report on children in coal mines, and the law that followed.",
   "items": [{"img": POSTER1, "caption": "Poster 1: Revolutionary Victorian Britain", "alt": "The exhibition’s first poster: its title over a museum hall and a court dress, with a paragraph of text on green", "aspect": 1050 / 1400}]},
  {"label": "Time off", "text": "Christmas, hardly celebrated in 1800, the biggest celebration by 1900.",
   "items": [{"img": VILLAGE, "caption": "A snowy village, from poster 2", "alt": "A painting of a snowy Victorian village street at dusk, with lit windows and Christmas trees", "aspect": 750 / 306}]}]

CHART_SCREEN = {"caption": "The evidence, from the exhibition’s two posters",
                "columns": ["When", "Evidence", "Source"],
                "rows": [{"cells": [d, e, s]} for d, e, s in EVIDENCE]}

PLAN_CSS = """
.cards { grid-template-columns: repeat(4, 1fr); gap: 7pt; } .card { padding: 6pt 8pt 2pt; } .card .cn { display: none; }
.card h4 { margin-top: 0; } .card p { font-size: 8.6pt; line-height: 1.36; }
table.ev { width: 100%; border-collapse: collapse; font-size: 8.7pt; margin: 4pt 0 10pt; }
table.ev th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.ev td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 8pt 4pt 0; vertical-align: top; }
table.ev td:first-child { width: 58pt; font-weight: 500; white-space: nowrap; } table.ev td:last-child { width: 48pt; color: #5b5a55; }
"""

def ev_table():
    rows = "".join(f"<tr><td>{d}</td><td>{md(e)}</td><td>{s}</td></tr>" for d, e, s in EVIDENCE)
    return f'<table class="ev"><thead><tr><th>When</th><th>Evidence</th><th>Source</th></tr></thead><tbody>{rows}</tbody></table>'

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "revolution-for-everyone",
  "out": DIR + "VIC_LP_SocialStudies.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Social Studies", "hero": HERO, "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 13, TEACH), ("Activity", 20, WORK), ("Debrief", 7, CLOSE)]),
    ("objectives", OBJECTIVES),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read the exhibition’s two posters as a historical account of Victorian Britain (1837–1901). They will sort evidence of **change** — railways, the telegraph, the Great Exhibition, the V&A, the 1842 coal mines law, the revival of Christmas — from evidence of **continuity**: long working hours, class divisions and urban challenges. Asking *for whom?* of each change, they will judge how far the age was revolutionary for everyone."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Historical thinking** — change and continuity; chronology, 1837–1901; sourcing an account",
      "**Economics** — industrial growth; work and working hours; time off",
      "**Civics** — a law, and whether it can be enforced; museums as public education"]}),
    ("section", {"label": "Materials needed", "list": [
      "Both posters, on screen or in the exhibition; the evidence chart on page 3, projected or printed",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Whose Britain?",
      "screen": {"phase": "Hook", "show": "image", "img": screen_pic(COURT_DRESS, credit=COURT_DRESS_CREDIT),
                 "alt": "A Victorian court dress of ivory silk on a mannequin: a wide crinoline skirt and a long train edged with lace and embroidered with roses",
                 "caption": "“" + LEDE + "” Poster 1",
                 "purpose": "Meet the poster’s confident account, and start asking who it describes.",
                 "students": [HOOK_Q]},
      "body": ["Show the court dress from poster 1 and read the poster’s first sentence: *“" + LEDE + "”* Tell students the dress was made in the 1860s; its embroidered train is 11 feet long, and young women practiced for hours to curtsey and walk backward in a dress like it before being presented at court. Ask: *“" + HOOK_Q + "”*"]}),
    ("section", {"label": "Direct instruction · 13 minutes", "title": "Four kinds of change, and one sentence",
      "screen": [
        {"phase": "Teach", "minutes": 9, "script": [0], "title": "Four kinds of change", "show": "gallery", "groups": THEMES,
         "purpose": "Set out what the posters say changed in Victorian Britain.",
         "students": ["Name one change of each kind.", "Who gained from it?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "What persisted", "show": "words", "text": PERSISTED,
         "cite": "Poster 1, *Revolutionary Victorian Britain*",
         "purpose": "Find the sentence where the poster admits the limits of progress.",
         "students": ["What does *persisted* mean?", "Why might a poster give this only one sentence?"]}],
      "body": ["Walk through the four kinds of change on the cards below, asking of each: *who gained?*",
               "Then put up the one sentence in poster 1 about what did not change: *“" + PERSISTED + "”* Ask: *what does* persisted *mean? How much space does the poster give it, compared with the inventions and the museum?*"]}),
    ("cards", [
      ("Industry and invention", ["The age saw rapid industrial growth. Railways, the telegraph and photography spread in Victoria’s reign. Towns had kept their own time by the Sun; by 1855 nearly every town had switched to railway time."]),
      ("A schoolroom for everyone", ["About six million people, a third of Britain’s population, visited the Great Exhibition of 1851. Prince Albert urged that its profits build museums; the first was the V&A (1852), which gas lighting kept open on winter evenings."]),
      ("Reform, slowly", ["An 1842 report on children in coal mines shocked the public. The new law barred women and girls, and boys under ten, from working underground — but one inspector for the whole country made it hard to enforce."]),
      ("Time off", ["At the start of the century Christmas was hardly celebrated: long hours left workers little time. The railways let city workers travel home. By the end of the century it was Britain’s biggest celebration."])]),
    ("section", {"label": "Activity · 20 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Weigh the evidence of change and continuity at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three use the same evidence from the two posters."]},
      "body": ["Students choose a handout. All three levels work from the same evidence, taken from the two posters."]}),
    ("levels", {
      "green": "Sort eight pieces of evidence into *changed for working people* and *stayed hard*; place five events on a timeline; answer the question with a sentence frame.",
      "yellow": "Read poster 1 as a source: what it puts first and what it passes over. Chart change and continuity, with *for whom?*, then write a claim paragraph.",
      "red": "Judge the 1842 law by its limits; question what the poster leaves unsaid; write an argument on *revolutionary for whom?* that answers an objection."}),
    ("section", {"label": "Debrief · 7 minutes", "title": "Revolution for everyone?",
      "screen": [
        {"phase": "Debrief", "minutes": 4, "script": [0], "title": "The evidence", "show": "chart", **CHART_SCREEN,
         "purpose": "Pull the evidence together, and test the poster’s word *revolutionary*.",
         "students": ["Pick one piece of evidence: change or continuity?", "Revolutionary for whom?"]},
        review_step(OBJECTIVES, 3, [1], phase="Debrief")],
      "body": ["Project the evidence chart. Each group chooses one line, calls it *change* or *continuity*, and says for whom. Close on poster 1’s title: *was Victorian Britain revolutionary for everyone?* Let a Red Level student give the strongest objection.",
               "Put the objectives back up as questions, *“Can you now…?”*, for a thumb up, sideways or down."]}),
    ("section", {"label": "Answer notes and assessment", "list": [
      "**Green sort:** *changed* — railway travel home at Christmas, museum evenings, the 1842 law, Christmas as a holiday; *stayed hard* — long hours, one inspector, class divisions and urban challenges. Accept well-argued placements: the 1842 law is both.",
      "**Timeline:** 1837 Victoria’s reign begins; 1842 coal mines law; 1851 Great Exhibition; 1852 V&A founded; 1901 the era ends.",
      "**Exit ticket:** *name one change, who gained from it, and one thing it did not change.*"]}),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The evidence, from the two posters",
                 "body": ["Project or print this chart for the activity and the debrief. Every line is from the exhibition’s posters and the panels set beside them."]}),
    ("html", ev_table()),
    ("section", {"label": "Historical framework", "title": "Reading a poster as an account",
      "body": [
        "**What it puts first.** Poster 1 opens with innovation, fashion, culture and a museum, and gives the age’s difficulties one sentence: *“" + PERSISTED + "”* A historian notices proportion: what an account dwells on, and what it passes quickly.",
        "**A reform and its limits.** The 1842 law is real evidence of change, and its weakness — one inspector for the whole country — is evidence too. The exhibition calls it *a first step*. The report was the first Royal Commission report ever to include illustrations, so people could see the conditions for themselves.",
        "**What the posters do not say.** Poster 1 mentions *an expanding empire* in four words. Students may rightly ask what that meant for the people it ruled; the exhibition does not say, and the lesson should not guess. Treat it as a question for further research."]}),
    ("connection", ["**Visit the exhibition:** walk poster 1, then poster 2, and list every change each names. In the *Inventions Workshop,* the railway bench shows towns giving up their own time for London’s; in *Dickens’ Christmas Parlour,* poster 2’s account of Christmas opens part by part."]),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["The exhibition’s first poster is called *Revolutionary Victorian Britain*. Between 1837 and 1901, railways, the telegraph, museums and new laws changed the country fast. But did they change life for everyone, and at the same speed? Historians ask: *for whom?*"]

H_CSS = """
table.fill td:first-child { width: auto; }
.evc { display: grid; grid-template-columns: 1fr 1fr; gap: 5pt 8pt; margin: 4pt 0 8pt; font-size: 9pt; line-height: 1.35; }
.evc div { background: rgba(255,255,255,.72); border: .8pt solid #1d1c1a; border-radius: 3pt; padding: 4pt 7pt; }
.evc b { font: 600 13pt/1 'Cormorant Garamond', serif; color: var(--gold-big); margin-right: 4pt; }
table.tc { width: 100%; border-collapse: collapse; margin: 4pt 0 8pt; }
table.tc th { font: 500 7.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); text-align: left; border-bottom: 1pt solid var(--accent); padding: 0 0 4pt; width: 50%; }
table.tc td { height: 104pt; border-right: .6pt solid #9c9a90; }
table.tc td + td { border-right: 0; padding-left: 8pt; }
.tline { position: relative; height: 70pt; margin: 6pt 6pt 8pt; }
.tline::before { content: ""; position: absolute; left: 0; right: 0; top: 30pt; border-top: 2pt solid #1d1c1a; }
.tline span { position: absolute; top: 22pt; width: 60pt; margin-left: -30pt; text-align: center; font: 500 8.5pt 'Outfit'; }
.tline span::before { content: ""; display: block; width: 2pt; height: 16pt; background: #1d1c1a; margin: 0 auto 4pt; }
.tline span i { display: block; border-bottom: .8pt solid #6f6c62; height: 16pt; margin-top: 2pt; }
.frame { font-size: 10pt; line-height: 2.1; }
.frame u { display: inline-block; min-width: 160pt; border-bottom: 1pt solid #1d1c1a; text-decoration: none; }
.poster { display: grid; grid-template-columns: 100pt 1fr; gap: 12pt; align-items: start; margin: 4pt 0 8pt; }
.poster img { width: 100pt; border: 1pt solid #1d1c1a; border-radius: 3pt; }
.poster blockquote { margin: 0; font: italic 400 11.2pt/1.36 'Cormorant Garamond', serif; border-left: 1.2pt solid var(--accent); padding-left: 9pt; }
"""

handout = handout_maker(DIR, TITLE, "Grades 5–8 · Social Studies", "Grades 5–8 Social Studies", CONTEXT, HERO, H_CSS)

GREEN_EV = [
  "The new railways let people who had moved to the cities travel home for Christmas.",
  "Long working hours left workers little time for celebration.",
  "Gas lighting kept the V&A open on winter evenings, so working people could visit after work.",
  "An 1842 law said women and girls, and boys under ten, must not work underground in mines.",
  "There was only one inspector for the whole country to enforce the 1842 law.",
  "Class divisions and urban challenges persisted.",
  "By the end of the century, Christmas was the biggest celebration of the year.",
  "About six million people visited the Great Exhibition of 1851.",
]

def evcards(items):
    return '<div class="evc">' + "".join(f"<div><b>{chr(65 + i)}</b>{md(t)}</div>" for i, t in enumerate(items)) + "</div>"

def tline():
    marks = [(0, "1837"), (12, "1842"), (36, "1851"), (40, "1852"), (100, "1901")]
    return '<div class="tline">' + "".join(f'<span style="left:{x}%">{d}<i></i></span>' for x, d in marks) + "</div>"

GREEN = handout("green", "VIC_Handout_Green_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Read the evidence", "body": ["Every card is from the exhibition’s posters."],
            "blocks": [("html", evcards(GREEN_EV))]}),
  ("task", {"label": "Part 2", "title": "Sort it",
            "body": ["Write each card’s letter in a column. One card could go in both: choose, and be ready to say why."]}),
  ("html", '<table class="tc"><thead><tr><th>Changed for working people</th><th>Stayed hard</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>'),
  ("task", {"label": "Part 3", "title": "On the timeline",
            "blocks": [("html", "<p>Write each event under its year: <b>the V&amp;A is founded · Victoria’s reign begins · the Victorian era ends · the coal mines law · the Great Exhibition</b></p>" + tline())]}),
  ("task", {"label": "Part 4", "title": "Who gained?",
            "body": ["Choose one card from *Changed*. Who gained from that change? Who did it not reach?"], "lines": 4}),
  ("task", {"label": "Part 5", "title": "Revolution for everyone?",
            "blocks": [("html", '<p class="frame">I think Victorian Britain <u></u> a revolution for everyone, because <u></u><u></u>. One piece of evidence is card <u style="min-width:30pt"></u>.</p>')]}),
  ("connection", ["In the exhibition, poster 1 is called *Revolutionary Victorian Britain*. Find the one sentence on it about what did **not** change. Copy its last word here: __________"]),
])

YELLOW = handout("yellow", "VIC_Handout_Yellow_SocialStudies.pdf", [
  ("task", {"label": "Part 1", "title": "Read the poster as a source",
            "blocks": [("html", f'<div class="poster"><img src="{POSTER1}" alt=""><div><blockquote>{md(LEDE)}</blockquote>'
                        f'<p style="margin-top:6pt">Later, after paragraphs on industry, invention and the V&amp;A, the poster says:</p><blockquote>{md(PERSISTED)}</blockquote></div></div>')]}),
  ("table", {"head": ["Question", "Your answer"], "rows": [
      ["What does the poster put first?", ""], ["What does it pass over in one sentence?", ""],
      ["Why might a museum poster do that?", ""], ["What would you want to know that it does not say?", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "Change, continuity, and for whom",
            "body": ["Use the evidence your teacher shows you. Fill the chart: is it change or continuity, and who did it reach?"]}),
  ("table", {"head": ["Evidence", "Change or continuity?", "For whom?"], "rows": [
      ["Railway time, by 1855", "", ""], ["The V&A open on winter evenings", "", ""],
      ["The 1842 coal mines law", "", ""], ["Long hours; little time to celebrate", "", ""],
      ["Railways take city workers home for Christmas", "", ""], ["Class divisions and urban challenges", "", ""]]}),
  ("task", {"label": "Part 3", "title": "Your claim",
            "body": ["Was Victorian Britain revolutionary for everyone? Write a paragraph: a claim, two pieces of evidence, and what they show."], "lines": 9}),
  ("connection", ["At the exhibition, compare the two posters. Poster 1 tells of industry and museums; poster 2 of Christmas. Which one says more about the lives of ordinary workers?"]),
], "table.fill td:first-child { width: 36%; }")

RED = handout("red", "VIC_Handout_Red_SocialStudies.pdf", [
  ("section", {"label": "Historical method", "title": "Change, and how far it reached",
               "body": ["A change on paper is not always a change in people’s lives. Historians weigh a reform by what it did, who it reached, and how well it was enforced."]}),
  ("task", {"label": "Part 1", "title": "Judge a reform",
            "blocks": [("html", '<div class="evc" style="grid-template-columns:1fr"><div><b>1842</b>A report on children working in coal mines shocked the public. A new law made it illegal for women and girls, or boys under ten, to work underground in a mine. With only one inspector for the whole country it was hard to enforce, but it was a first step. The report was the first Royal Commission report ever to include illustrations, so people could see the conditions for themselves.</div></div>')]}),
  ("table", {"head": ["Question", "Your judgment"], "rows": [
      ["Who did the law protect? Who did it leave out?", ""], ["Why might one inspector matter so much?", ""],
      ["Why might pictures in a report change minds?", ""], ["A first step, or a revolution? Why?", ""]]}),
  ("pagebreak", None),
  ("task", {"label": "Part 2", "title": "What the account leaves unsaid",
            "body": ["Poster 1 says rapid industrial growth made Britain *a global superpower with an expanding empire*, and that *class divisions and urban challenges persisted*. Choose one of these phrases. Write two questions a historian would need answered before judging it, and say what kind of source might answer them."], "lines": 4}),
  ("task", {"label": "Part 3", "title": "Revolutionary for whom?",
            "body": ["Write an argument: **was Victorian Britain revolutionary for everyone?** Make a claim, use at least three pieces of evidence from the posters, and answer one objection."], "lines": 8}),
  ("connection", ["Poster 2 says that the railways let people travel home for Christmas, and that long hours had left workers little time to celebrate. In the exhibition, find one more piece of evidence that a change in technology changed ordinary lives."]),
], "table.fill td:first-child { width: 40%; }")

DOCS = [LESSON, GREEN, YELLOW, RED]
