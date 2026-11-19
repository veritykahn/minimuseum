"""Grades 3–4 · "Messages Down the Wire"
The Inventions Workshop's telegraph bench, Morse code bench and telegraph
office: how a telegraph works, part by part; Cooke and Wheatstone's dial;
Morse code; and the short, paid-by-the-word telegram. Facts follow
app/exhibitions/victorian/inventions/inventionsText.ts (WIRE_PARTS, NOTES,
MORSE_LEARN, MORSE_MESSAGES, TELEGRAM_DRAFTS) and poster 1."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

DIR = "teachers/grades-3-4/"
TITLE = "Messages Down the Wire"
SUB = "Grades 3–4 · Inventions Workshop · The telegraph and Morse code"

HERO = {"img": pic(TELEGRAPH_OFFICE), "pos": "center 50%"}
SCREEN_HERO = screen_pic(TELEGRAPH_OFFICE, "center 50%")

# the workshop's five parts: name, job (WIRE_PARTS)
PARTS = [("Battery", "Makes the electric current"), ("Key", "A switch: press it to send"),
         ("Wire", "Carries the current miles away"), ("Coil", "Wire wound round: pushes on a magnet"),
         ("Needle", "Swings to show the message")]
# the Morse bench's eight letters to learn first, in International Morse code
MORSE = {"E": ".", "T": "-", "I": "..", "M": "--", "A": ".-", "N": "-.", "S": "...", "O": "---"}
def mk(code):
    return code.replace(".", "•").replace("-", "—")
def morse(msg, sep="  ", word=" / "):
    return word.join(sep.join(mk(MORSE[c]) for c in w) for w in msg.split())
# a letter from the workshop's telegraph office, written far too long (TELEGRAM_DRAFTS)
DRAFT = "DEAR MOTHER I HAVE ARRIVED SAFELY IN BATH AND THE TRAIN WAS VERY FAST PLEASE SEND MY WARM COAT AND SOME CAKE LOVE FROM ADA"
SHORT = "I HAVE ARRIVED SAFELY IN BATH AND THE TRAIN WAS VERY FAST PLEASE SEND MY WARM COAT"

# Said in the plan and shown on the classroom screen, so written once.
HOOK_Q = "Long ago, before telephones, how could you send a message to a town miles away, fast?"
DIAL_Q = "The dial had 20 letters. C, J, Q, U, X and Z were left off. Why?"
CLOSE_MSG = "TEA AT TEN"

OBJECTIVES = objectives([
    ("name the five parts of a telegraph and say what each one does",
     "name the parts of a telegraph, and their jobs?", False),
    ("explain how pressing a key makes a needle swing at a station miles away",
     "explain how a key moves a needle miles away?", False),
    ("send and decode a short message in Morse code",
     "send and decode a message in Morse code?", False),
    ("write a telegram that says the most in the fewest words, and explain why telegrams were short",
     "write a short telegram, and explain why telegrams were short?", True)],
  "The telegraph sent words along a wire as fast as electricity, and changed how people kept in touch. Its codes are the great-grandparents of every text message.")

CHART = {"caption": "Build a telegraph: the five parts, in the order the current reaches them",
         "columns": ["Part", "Its job"], "rows": [{"cells": [p, j]} for p, j in PARTS]}
MORSE_CHART = {"caption": "Eight letters to learn first, from the Morse code bench (• dot, — dash)",
               "columns": ["Letter", "Code", "Letter", "Code"],
               "rows": [{"cells": [a, mk(MORSE[a]), b, mk(MORSE[b])]} for a, b in [("E", "T"), ("I", "M"), ("A", "N"), ("S", "O")]]}

PLAN_CSS = """
body { line-height: 1.42; }
table.key { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; font-size: 9.4pt; break-inside: avoid; }
table.key th { font: 500 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.key td { border-bottom: .6pt solid #c8c5bb; padding: 4pt 6pt 4pt 0; vertical-align: top; }
table.key td.big { font: 500 16pt/1 'Outfit'; letter-spacing: .12em; }
.cols:has(.conn) { font-size: 9pt; }
"""

def morse_table(cls="key"):
    rows = "".join(f'<tr><td class="big">{a}</td><td class="big">{mk(MORSE[a])}</td><td class="big">{b}</td><td class="big">{mk(MORSE[b])}</td></tr>'
                   for a, b in [("E", "T"), ("I", "M"), ("A", "N"), ("S", "O")])
    return f'<table class="{cls}"><thead><tr><th>Letter</th><th>Code</th><th>Letter</th><th>Code</th></tr></thead><tbody>{rows}</tbody></table>'

PARTS_TABLE = ('<table class="key"><thead><tr><th>Part</th><th>Its job</th><th>What the workshop says once it is in place</th></tr></thead><tbody>'
  + "".join(f"<tr><td><b>{p}</b></td><td>{j}</td><td>{l}</td></tr>" for (p, j), l in zip(PARTS, [
    "The battery makes an electric current.",
    "The key is a switch. Press it and the current flows; let go and it stops.",
    "The wire carries the current to a station miles away. The first telegraph wires ran beside the railway.",
    "At the far end the wire is wound into a coil. When the current flows through it, it pushes on a magnet.",
    "The magnet is a needle, like a compass needle. When the current flows, it swings, and a clerk at the far station reads it."]))
  + "</tbody></table>")

# ── lesson plan ────────────────────────────────────────────────────────
LESSON = {
  "slug": "messages-down-the-wire", "large": True,
  "out": DIR + "VIC_LP_Grades3_4.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 3–4", "hero": HERO, "screen_hero": SCREEN_HERO,
  "css": CSS + OBJ_CSS + PLAN_CSS,
  "blocks": [
    ("timing", [("Hook", 5, HOOK), ("Teach", 12, TEACH), ("Activity", 18, WORK), ("Close", 5, CLOSE)]),
    ("cols", [[("objectives", OBJECTIVES),
               ("section", {"label": "Words for operators"}),
               ("refs", [("Circuit", "a loop the electric current flows round"), ("Switch", "opens and closes the loop"),
                         ("Coil", "wire wound round and round"), ("Code", "a set of signals that stands for letters"),
                         ("Telegram", "a short message sent by telegraph")])],
              [("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will learn how the electric telegraph worked, part by part: a battery, a key, a wire, a coil and a needle. They will see how Cooke and Wheatstone’s dial and Samuel Morse’s dots and dashes turned letters into signals, send and decode messages in Morse code, and cut a letter down to a telegram — short, because every word cost money."]}),
               ("section", {"label": "Standards and themes", "list": [
      "**Science** — a simple circuit; a switch; electricity can move a magnetized needle",
      "**Social Studies** — inventions that changed everyday life in Victorian Britain",
      "**ELA** — concise writing: keeping the meaning in fewer words",
      "**Math** — counting words; a price for so many words"]}),
               ("section", {"label": "Materials needed", "list": [
      "The *Inventions Workshop* on a screen, if you have one (the telegraph and Morse code benches)",
      "Page 3 of this plan, projected or printed",
      "Optional: a compass, to show how a needle swings to a magnet",
      "Differentiated handouts, one per student"]})]]),
    ("section", {"label": "Hook · 5 minutes", "title": "A message, fast",
      "screen": {"phase": "Hook", "show": "image", "img": screen_pic(TELEGRAPH_OFFICE), "fit": "cover",
                 "alt": "A painting of a Victorian telegraph office: a long wooden counter with telegraph instruments, pigeonholes of forms on the wall and lamps lit at dusk",
                 "purpose": "Wonder how a message could travel faster than a person, before any explanation.",
                 "students": [HOOK_Q, "Listen. Your teacher is sending you a message."]},
      "body": ["Show the telegraph office. Ask: *“" + HOOK_Q + "”* Take ideas: a rider, a train, a letter. Then, without a word, tap on the desk: short, short, short. *“I just sent you a letter of the alphabet. By the end of today you will be able to read it.”* (It is **S**.)"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "From battery to needle",
      "screen": [
        {"phase": "Teach", "minutes": 4, "script": [0], "title": "Build a telegraph", "show": "chart", **CHART,
         "purpose": "Know the five parts of a telegraph, and follow the current from one to the next.",
         "students": ["Follow the current: battery, key, wire, coil, needle.", "What happens when the key is let go?"]},
        {"phase": "Teach", "minutes": 4, "script": [1], "title": "The needle dial", "show": "question", "question": DIAL_Q,
         "purpose": "See how Cooke and Wheatstone made two needles point to a letter, and why some letters were missing.",
         "students": ["Two needles lean. Where their lines cross is the letter.", "What words could you NOT send?"]},
        {"phase": "Teach", "minutes": 4, "script": [2], "title": "Dots and dashes", "show": "chart", **MORSE_CHART,
         "purpose": "Learn a few letters of Morse code, and tap them out together.",
         "students": ["Tap S: • • •", "Tap O: — — —", "Now tap SOS together."]}],
      "body": [
        "**The circuit.** Go through the five parts on the screen. The **battery** makes an electric current. The **key** is a switch: press it and the current flows; let go and it stops. The **wire** carries the current to a station miles away. There it is wound into a **coil**, and when the current flows through the coil it pushes on a magnet: a **needle**, like a compass needle, which swings for the clerk to read. In 1820 Hans Christian Oersted found that a magnetized needle moved near a wire carrying a current — and moved more if the wire was wound into a coil. If you have a compass, show how its needle swings to a magnet.",
        "**The dial.** William Cooke and Charles Wheatstone made their five-needle telegraph in 1837. Any two of the five needles swung to point to a letter on a diamond-shaped dial. Ask: *“" + DIAL_Q + "”* Answer: to save the expense of another needle and its wire. In 1839, the world’s first public telegraph service began, running 13 miles beside the Great Western Railway from London Paddington to West Drayton.",
        "**Morse code.** Samuel Morse’s telegraph used dots and dashes. On 24 May 1844 he sent the message *“What hath God wrought?”* from Washington to Baltimore. Later, needle telegraphs in Britain used Morse code too: the needle leaned left for a dot and right for a dash. Teach the eight letters on the screen; tap them on desks together."]}),
    ("section", {"label": "Activity · 18 minutes",
      "screen": {"phase": "Activity", "show": "levels", "title": "Choose a handout",
                 "purpose": "Practice the operator’s skills at the right level of challenge.",
                 "students": ["Choose Green, Yellow or Red. All three build the circuit, decode Morse and write a telegram."]},
      "body": ["Students choose a handout. All three levels build the circuit, decode Morse code and cut a letter down to a telegram."]}),
    ("levels", {
      "green": "Match each part to its job; decode a message from a Morse chart; write a word in Morse; cross out words until a telegram fits twelve words.",
      "yellow": "Put the current’s journey in order; decode two messages and write one; cut a long letter to twelve words; explain why the dial left letters off.",
      "red": "Predict what happens when a part fails; test which words the dial could not send; buy a telegram with a purse of money; explain why the wires ran beside the railway."}),
    ("section", {"label": "Decode and look back · 5 minutes",
      "screen": [
        {"phase": "Close", "minutes": 2, "script": [0], "title": "Decode it together", "show": "words",
         "text": morse(CLOSE_MSG), "cite": "A message from the Morse code bench",
         "purpose": "Read a whole message in Morse together, as a clerk would.",
         "students": ["Decode the message, letter by letter.", "Each / is a space between words."]},
        review_step(OBJECTIVES, 3, [1], hint=THUMBS)],
      "body": ["Put the message on the screen and decode it as a class, one letter at a time: **" + CLOSE_MSG + "**. Then reveal the hook: short, short, short was **S**.",
               "Ask the objectives back from the screen: *“Can you now…?”* Students show a thumb up, sideways or down. Exit question: *“Why did people write telegrams in so few words?”*"]}),
    ("cols", [[("section", {"label": "Background · the telegram", "body": [
        "At the telegraph office, people filled out a form with their message. It was sent along the wires, then carried to the address by a messenger boy. The Post Office changed the price from 20 words for a shilling to **12 words for sixpence**, so people wrote shorter, more direct messages, and these were called telegrams. In the workshop’s office, each word over twelve costs a halfpenny more: that is the room’s own game rule, not a price from the records."]}),
       ("connection", ["**Online,** the *Inventions Workshop* lets students build a telegraph, press letters on the five-needle dial, tap Morse code and send a telegram from the telegraph office. **On poster 1,** find the railway, the telegraph and photography among the age’s *iconic innovations*."])],
      [("section", {"label": "Answer key", "list": [
        "**Green match:** battery — makes the current; key — a switch; wire — carries the current miles away; coil — pushes on a magnet; needle — swings to show the message. Message: **TEA AT TEN**.",
        "**Yellow order:** press the key; the current flows from the battery; it runs along the wire; it flows through the coil and pushes on the magnet; the needle swings and the clerk reads it. Messages: **MEET ME AT NOON**, **SEE ME SOON**. STONE = • • • / — / — — — / — • / •",
        "**Red dial test:** SNOW and STEAM can be sent; COAT, CAKE and QUICK cannot (no C, Q or U). A purse of 7d buys 14 words under the game rule. The draft letter has 25 words."]})]]),
    ("pagebreak", None),
    ("section", {"label": "Show your class", "title": "The telegraph, part by part",
                 "body": ["Project or print this page for the teaching and the decoding. The words in the last column are the workshop’s own, said as each part is put in place."]}),
    ("html", PARTS_TABLE),
    ("section", {"label": "The Morse code bench", "title": "Eight letters to learn first"}),
    ("html", morse_table()),
    ("section", {"label": "Messages to decode together", "list": [morse(m) + "  →  **" + m + "**" for m in ["MEN AT SEA", "TIME TO EAT", "NO TOAST"]]}),
    ("section", {"label": "Questions to ask at the workshop", "list": [
      "What does the key do to the current?",
      "Why did the first telegraph wires run beside the railway?",
      "Which letters could the five-needle dial not show? What words would be hard to send?",
      "If every word cost money, what would you leave out of your message?"]}),
  ]}

# ── handouts ───────────────────────────────────────────────────────────
CONTEXT = ["In Victorian Britain, the electric telegraph sent messages along a wire, mile after mile, as fast as electricity. In 1839 the world’s first public telegraph service began, beside the Great Western Railway. Today you are a telegraph operator."]

H_CSS = """
table.key { width: 100%; border-collapse: collapse; margin: 4pt 0 8pt; font-size: 9.6pt; break-inside: avoid; }
table.key th { font: 500 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 3pt 0; border-bottom: 1pt solid var(--accent); }
table.key td { border-bottom: .6pt solid #9c9a90; padding: 3pt 6pt 3pt 0; }
table.key td.big { font: 500 14pt/1 'Outfit'; letter-spacing: .1em; }
.match2 { display: grid; grid-template-columns: 1fr 60pt 1.6fr; row-gap: 8pt; align-items: center; margin: 4pt 0 8pt; }
.match2 .l { text-align: right; font-weight: 500; } .match2 .l::after, .match2 .r::before { content: ""; display: inline-block; width: 9pt; height: 9pt; border-radius: 50%; background: #1d1c1a; margin: 0 6pt; vertical-align: 0; }
.code { font: 500 14pt/1.2 'Outfit'; letter-spacing: .06em; margin: 2pt 0 2pt; }
.boxes { display: flex; gap: 6pt; flex-wrap: wrap; margin: 2pt 0 8pt; }
.boxes i { width: 26pt; height: 30pt; border: 1pt solid #1d1c1a; background: rgba(255,255,255,.6); border-radius: 3pt; }
.boxes i.sp { border: 0; background: none; width: 14pt; }
.draft { font: 500 10.4pt/2.05 'Outfit'; letter-spacing: .06em; background: rgba(255,255,255,.72); border: 1pt dashed #1d1c1a; padding: 4pt 10pt; margin: 4pt 0 6pt; }
.order { display: grid; grid-template-columns: 30pt 1fr; gap: 6pt 8pt; align-items: center; margin: 4pt 0 8pt; }
.order i { width: 26pt; height: 24pt; border: 1pt solid #1d1c1a; background: rgba(255,255,255,.6); border-radius: 3pt; }
"""

handout = handout_maker(DIR, TITLE, "Grades 3–4 · Inventions Workshop", "Grades 3–4", CONTEXT, HERO, H_CSS)

def boxes(msg):
    return '<div class="boxes">' + "".join('<i class="sp"></i>' if c == " " else "<i></i>" for c in msg) + "</div>"

MATCH = ('<div class="match2">' + "".join(
    f'<div class="l">{p}</div><div></div><div class="r">{j}</div>'
    for p, j in zip([p for p, _ in PARTS], [PARTS[i][1] for i in (2, 4, 0, 3, 1)])) + "</div>")

GREEN = handout("green", "VIC_Handout_Green_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Build the telegraph",
            "body": ["Draw a line from each part to its job."], "blocks": [("html", MATCH)]}),
  ("task", {"label": "Part 2", "title": "Decode a message",
            "blocks": [("html", morse_table() + '<p>Each group of dots and dashes is one letter. Each / is a space. Write one letter in each box.</p>'
                        f'<p class="code">{morse("TEA AT TEN")}</p>' + boxes("TEA AT TEN"))]}),
  ("task", {"label": "Part 3", "title": "Send a word",
            "body": ["Write the word **NEST** in Morse code. Use the chart. Then tap it on your desk for a partner."], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Twelve words for sixpence",
            "blocks": [("html", f'<p>A telegram cost sixpence for 12 words, so people kept them short. Cross out words until only <b>12</b> are left. Keep what matters most.</p><div class="draft">{SHORT}</div>')],
            "body": ["Write your telegram here. Which words did you keep, and why?"], "lines": 5}),
  ("family", ["Tap a letter in Morse code on the table for your family: **S** is • • • and **O** is — — —. Can they decode a word you send? Ask them: *how do we send a quick message today?*"]),
])

ORDER = ('<div class="order">' + "".join(f"<i></i><span>{t}</span>" for t in [
  "The current flows through the coil and pushes on the magnet.",
  "You press the key.",
  "The needle swings, and the clerk at the far station reads it.",
  "The battery’s current flows into the wire.",
  "The current runs along the wire, miles away."]) + "</div>")

YELLOW = handout("yellow", "VIC_Handout_Yellow_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "The current’s journey",
            "body": ["Number the steps **1 to 5**, from pressing the key to reading the message."], "blocks": [("html", ORDER)]}),
  ("task", {"label": "Part 2", "title": "Decode and send",
            "blocks": [("html", morse_table() + f'<p class="code">{morse("MEET ME AT NOON")}</p>' + boxes("MEET ME AT NOON")
                        + f'<p class="code">{morse("SEE ME SOON")}</p>' + boxes("SEE ME SOON"))],
            "body": ["Now write **STONE** in Morse code."], "lines": 1}),
  ("task", {"label": "Part 3", "title": "Cut it to a telegram",
            "blocks": [("html", f'<p>This letter is far too long. Telegrams cost sixpence for 12 words. Cross out words until <b>12</b> are left, and the message still makes sense.</p><div class="draft">{DRAFT}</div>')],
            "body": ["Write your telegram:"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Missing letters",
            "body": ["Cooke and Wheatstone’s dial had only 20 letters. C, J, Q, U, X and Z were left off, to save the expense of another needle and its wire. Write one word you could **not** send on their dial, and one you could."], "lines": 2}),
  ("family", ["Send your family a message in Morse code: tap it, or write it in dots and dashes. Then try writing a telegram together: how short can you make *we will be home late for dinner*?"]),
])

RED = handout("red", "VIC_Handout_Red_Grades3_4.pdf", [
  ("task", {"label": "Part 1", "title": "Trouble on the line",
            "blocks": [("html", '<p>The telegraph has five parts: <b>battery, key, wire, coil and needle</b>. A clerk at the far station is waiting. What happens to the needle in each case? Explain using the word <i>current</i>.</p>')]}),
  ("table", {"head": ["What goes wrong", "What the needle does", "Why"], "rows": [
      ["The key is not pressed", "", ""], ["A storm breaks the wire", "", ""], ["The wire at the far end is not wound into a coil", "", ""]]}),
  ("task", {"label": "Part 2", "title": "Dial or dots?",
            "blocks": [("html", morse_table() + '<p>Cooke and Wheatstone’s five-needle dial showed 20 letters; C, J, Q, U, X and Z were left off. Morse code has a code for every letter, but the clerk must learn them all. Circle the words the dial <b>could</b> send: <b>COAT · SNOW · CAKE · STEAM · QUICK</b></p>')],
            "body": ["Which would you rather use, the dial or Morse code? Give one reason for each side."], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Pay for your telegram",
            "blocks": [("html", f'<p>Sixpence pays for <b>12 words</b>. In the workshop’s game, each word more costs a halfpenny. There are two halfpennies in a penny. Your purse holds <b>7d</b> (sevenpence). How many words can you send? Cut this letter to fit.</p><div class="draft">{DRAFT}</div>')],
            "body": ["Words I can afford: ____   My telegram:"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Beside the railway",
            "body": ["The first telegraph wires ran beside the railway. Give two reasons why a railway might want a telegraph."], "lines": 3}),
  ("family", ["Ask your family: *if every word in a message cost money, what would you leave out?* Then compare a telegram with a text message: what is the same, and what has changed?"]),
])

DOCS = [LESSON, GREEN, YELLOW, RED]
