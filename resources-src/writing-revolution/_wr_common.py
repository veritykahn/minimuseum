"""Shared pieces for The Writing Revolution's classroom resources.

Every fact here is the exhibition's own, from
app/exhibitions/writing-revolution/writingRevolution.ts (the two posters, set
as the site sets them, and the display case's record) and
app/exhibitions/writing-revolution/typing-station/ (stationText.ts,
challenges.ts, typewriterPage.ts, IMac.tsx). The poster sentences are quoted
exactly as the site sets them; the clips are the posters' own sounds, credited
as public/exhibitions/writing-revolution/poster-sound/moments/credits.txt
credits them.

build.py and export_lessons.py skip files that start with "_"; each module
loads this one with load_common()."""

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))

P = "/exhibitions/writing-revolution/"
POSTER1 = P + "poster1.jpg"
POSTER2 = P + "poster2.jpg"
URANIA = P + "urania.webp"                 # the owner's own photograph, cut out of poster 2
ROOM = P + "rooms/typing-station.webp"     # the Typing Station room, a screenshot
EXHIBITION_URL = "minimuseumproject.org/exhibitions/writing-revolution"
STATION_URL = EXHIBITION_URL + "/typing-station"
RESOURCES = "minimuseumproject.org/exhibitions/writing-revolution/resources"


def printable(web):
    """A picture for print. build.py copies only PNG and JPEG pictures into
    its print cache, so a WebP picture is printed straight from public/."""
    return "file://" + os.path.join(ROOT, "public", web.lstrip("/"))


# ── covers: the two posters, cropped ─────────────────────────────────────
# Posters are the Mini Museum's own; the Urania on them is the owner's own
# photograph, so no credit line.
HERO_P1_TITLE = {"img": POSTER1, "pos": "center 33%"}       # THE WRITING REVOLUTION, white on charcoal and coral
HERO_P1_URANIA = {"img": POSTER1, "pos": "center 72%"}      # the typewritten text and the Urania running off the edge
HERO_P2_KEYS = {"img": POSTER2, "pos": "center 27%"}        # the Urania's keys on cyan
HERO_P2_TITLE = {"img": POSTER2, "pos": "center 68%"}       # QWERTY'S ACCIDENTAL EMPIRE

URANIA_ALT = ("A black Urania portable typewriter seen from the front: four rows of round silver-rimmed keys, "
              "the name Urania in gold above them and Clemens Müller A.G. Dresden in gold along the base")
ROOM_ALT = ("The Typing Station room: a typewriter on the coral wall, its first line typed on the sheet of paper, "
            "with the tabs Typewriter, iMac, Top row and Class Board")
POSTER1_ALT = ("The Writing Revolution poster: a charcoal block above a coral-red one inside a thin white frame line, "
               "the title in tall white capitals across both, a gold admission ticket at the top right, three paragraphs "
               "of typewritten text, and a black Urania typewriter running off the right edge")
POSTER2_ALT = ("QWERTY’s Accidental Empire poster: a black Urania typewriter on a bright cyan block above a charcoal one, "
               "inside a thin white frame line, the title in tall white capitals across both blocks, and three columns "
               "of typewritten text")

# ── the poster sentences, exactly as the site sets them ──────────────────
Q = {
  "privilege": "For thousands of years, writing was a privilege reserved for scribes, monks, and the wealthy elite.",
  "shattered": "This exclusivity shattered with each technological leap.",
  "press": "The printing press, invented by Johannes Gutenberg around 1440, was the first great equalizer—suddenly, books cost a fraction of their previous price, sparking mass literacy movements across Europe.",
  "typewriter": "But true democratization began with the typewriter.",
  "sholes1": "In 1868, Christopher Latham Sholes patented the first practical typewriter, giving ordinary citizens the power to create professional documents.",
  "women": "Women especially embraced this technology, flooding into offices as typists and gaining economic independence previously denied to them.",
  "computer": "The computer age obliterated remaining barriers.",
  "wp": "Early word processors in the 1970s meant anyone could edit and perfect their writing without costly reprints.",
  "pagemaker": "Desktop publishing software like PageMaker (1985) ended publishers' monopoly—suddenly, anyone could design newsletters, magazines, or books from their home.",
  "internet": "The internet completed this revolution: Blogger (1999) let millions publish their thoughts free, Wikipedia (2001) proved that collective amateur writers could rival encyclopedias, and social media transformed every phone owner into a publisher with potential global reach.",
  "selfpub": "Self-publishing platforms like Amazon's CreateSpace meant authors no longer needed agents or publishing houses to reach readers.",
  "implications": "This democratization has profound implications.",
  "tweet": "In 1900, only major newspapers and publishers could spread ideas widely; today, a tweet from a teenager can influence millions.",
  "challenges": "Yet this power brings new challenges: information overload, the spread of misinformation, and algorithms that decide what writing gets seen.",
  "brain": "At the same time we are also discovering surprising truths: while we read faster on screens, we remember more from printed pages, and handwriting activates different parts of our brain than typing, aiding memory and creativity.",
  "ai": "As AI writing tools emerge, we face the ultimate democratization—what happens when anyone can generate professional-quality text instantly?",
  "achievement": "The writing revolution's greatest achievement isn't just making everyone a potential writer, but proving that important ideas can come from anywhere, not just ivory towers and newsrooms.",
  "gates": "Every new technology has chipped away at the gates that once kept most voices silent.",
  # poster 2
  "secret": "The keyboard beneath your fingers holds a 150-year-old secret.",
  "sholes2": "In 1868, Christopher Latham Sholes, a Milwaukee newspaper editor, was perfecting his \"Type-Writer\" machine when he encountered a frustrating problem: when typists worked too quickly, the metal arms carrying the letters would jam together.",
  "solution": "His solution, in the best-known account, was ingenious—he analyzed letter frequency in the English language and separated commonly paired letters like \"TH\" and \"HE\" across the keyboard.",
  "random": "This seemingly random arrangement, which placed \"QWERTY\" across the top row, actually prevented mechanical collisions.",
  "myth": "Contrary to popular myth, Sholes didn't design QWERTY to slow typists down—he designed it to let them type as fast as possible without breaking the machine.",
  "electric": "By the time electric typewriters eliminated the jamming problem, QWERTY had already conquered the world.",
  "muscle": "Millions had trained their muscle memory on this layout, and entire industries depended on it.",
  "dvorak": "Challengers emerged: August Dvorak created a scientifically \"superior\" keyboard in 1936 that placed the most common letters on the home row, claiming it could increase typing speed by 74%.",
  "navy": "The U.S. Navy tested it during World War II and reported dramatic improvements, though the study was overseen by Dvorak himself and a 1956 government study found no real advantage.",
  "survived": "Yet QWERTY survived every assault.",
  "lockin": "The reason was economic, not ergonomic—businesses couldn't afford to retrain workers and replace equipment, creating a \"lock-in\" effect economists now study as a prime example of how inferior technologies can dominate markets through sheer momentum.",
  "persist": "Today, QWERTY's persistence reveals profound truths about human behavior and technology adoption.",
  "touch": "In our age of touchscreens and voice recognition, we still arrange virtual keyboards in Sholes' pattern—even though there are no physical keys to jam.",
  "studies": "Studies suggest that while QWERTY makes our fingers travel farther than necessary, the cost of change outweighs the benefits.",
  "toprow": "This layout has literally shaped our language: \"typewriter\" remains one of the longest words you can type using only the top row, while the bottom row can barely form any words at all.",
  "good_enough": "As we enter the era of gesture typing and predictive text, QWERTY endures as a reminder that the best technology doesn't always win—sometimes, being first and \"good enough\" conquers all.",
}

# the posters' "Talk about it" questions, as the projector's teacher strip sets them
TALK = {
  "p1_open": "Writing was once only for a few people. Who do you think gets to share their ideas today, and whose voices might still be missing?",
  "p1_computer": "If you could publish anything for the whole world to read, what would you write, and who would you hope reads it?",
  "p1_trust": "How do you decide whether something you read is worth trusting? Does writing by hand feel different to you from typing?",
  "p2_open": "Have you ever kept doing something one way just because that is how everyone does it? Why do you think habits can be so hard to change?",
  "p2_familiar": "Why might people stick with something familiar, even when there might be a better choice?",
  "p2_invent": "If you could invent a brand-new way to write or type, what would it be like? What would make people want to switch to it?",
}

# the display case, as the Mini Museum record names its objects
TYPEWRITER = "Portable Smith-Corona Galaxie typewriter"
TYPEWRITER_RECORD = "Portable Smith-Corona Galaxie typewriter with original carrying case"
IMAC = "Apple iMac G3"
IMAC_RECORD = "Functional Apple iMac G3 running AppleWorks software"
STATION_RECORD = "Interactive dual-typing station comparing mechanical and digital writing workflows"
STATION_LINE = Q["secret"]                 # the line the station gives to type on both machines
IMAC_FONTS = ["Times", "Helvetica", "Courier", "Palatino", "Antonio"]

# ── the posters' sounds (poster-sound/moments), for "listen" screens ───────
M = P + "poster-sound/moments/"
CLIPS = {
  "quill": {"src": M + "quill.mp3", "label": "A quill pen", "sub": "Writing by hand",
            "credit": "“Quill pen writing on hard paper various speed” by freesound_community (Pixabay)"},
  "press": {"src": M + "printing-press.mp3", "label": "A printing press", "sub": "Gutenberg, around 1440",
            "credit": "“Printing Press” by PWLPL (Pixabay)"},
  "typewriter": {"src": M + "typewriter.mp3", "label": "A typewriter", "sub": "Keys and the bell",
                 "credit": "“TYPEWRITER CLICK WITH BELL #1” by MIGHTUSER (Pixabay)"},
  "typing_pool": {"src": M + "typing-pool.mp3", "label": "An office of typists", "sub": "Three typewriters at once",
                  "credit": "“Loading Paper and Typewriter Typing” and “oldfashioned typewriter” by freesound_community (Pixabay)"},
  "bell": {"src": M + "bell.mp3", "label": "The typewriter’s bell", "sub": "Near the end of the line",
           "credit": "“typewriter bell” by freesound_community (Pixabay)"},
  "electric": {"src": M + "electric-typewriter.mp3", "label": "An electric typewriter",
               "credit": "“Electric Typewriter” by freesound_community (Pixabay)"},
  "dot_matrix": {"src": M + "dot-matrix.mp3", "label": "A dot matrix printer", "sub": "The age of the word processor",
                 "credit": "“dot matrix printer” by freesound_community (Pixabay)"},
  "keyboard": {"src": M + "keyboard.mp3", "label": "A computer keyboard",
               "credit": "“Computer keyboard typing” by MatthewVakaliuk73627 (Pixabay)"},
  "dial_up": {"src": M + "dial-up.mp3", "label": "Dial-up internet", "sub": "The internet arrives",
              "credit": "“The Sound of dial-up Internet” by freesound_community (Pixabay)"},
  "phone": {"src": M + "phone-typing.mp3", "label": "Typing on a phone", "sub": "A touchscreen",
            "credit": "“Phone Keyboard” by Rubyland1 (Pixabay)"},
  "notification": {"src": M + "notification.mp3", "label": "A message arrives",
                   "credit": "“sms notification” by digitalstore07 (Pixabay)"},
}

# ── the keyboard's letter rows ───────────────────────────────────────────
# The station's own rows (stationText.ts ROWS: top qwertyuiop, bottom
# zxcvbnm), with the home row between them, as on the station's typewriter.
TOP, HOME, BOTTOM = "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"


def keys(rows=(TOP, HOME, BOTTOM), blank=False, size=None, labels=False, mark=""):
    """Round keys like the Urania's, in rows, each row set in a little as on
    a typewriter. blank=True leaves the keys empty to write or color in;
    mark is letters to ring in bold; labels names the rows."""
    names = {TOP: "Top row", HOME: "Home row", BOTTOM: "Bottom row"}
    st = f' style="--k:{size}pt"' if size else ""
    out = ""
    for i, r in enumerate(rows):
        cells = "".join(f'<span class="k{" on" if ch in mark else ""}">{"" if blank else ch}</span>' for ch in r)
        lab = f'<b class="klab">{names.get(r, "")}</b>' if labels else ""
        out += f'<div class="krow" style="margin-left:calc(var(--k) * {i * 0.45:.2f})">{cells}{lab}</div>'
    return f'<div class="keys"{st}>{out}</div>'


KEYS_CSS = """
.keys { --k: 30pt; margin: 4pt 0 10pt; break-inside: avoid; }
.krow { display: flex; gap: calc(var(--k) * .2); align-items: center; margin-bottom: calc(var(--k) * .18); }
.k { width: var(--k); height: var(--k); border-radius: 50%; border: 1.4pt solid #1d1c1a; background: #fff;
  box-shadow: inset 0 0 0 calc(var(--k) * .08) #e7e5df, inset 0 0 0 calc(var(--k) * .1) #8d8a80;
  display: grid; place-items: center; font: 500 calc(var(--k) * .42)/1 'Outfit'; flex: none; }
.k.on { border-width: 2.4pt; }
.klab { font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #5b5a55; margin-left: 8pt; }
"""

# the objectives block's look, as in In Their Hands; the handouts print unchanged
OBJ_CSS = """
.objectives { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 8pt 12pt 3pt; margin-bottom: 12pt; }
.objectives h3 { font-size: 12.5pt; margin-bottom: 5pt; }
.objectives ol { margin: 0 0 7pt; padding: 0; list-style: none; counter-reset: obj; }
.objectives li { counter-increment: obj; display: grid; grid-template-columns: 16pt 1fr; margin: 0 0 3.5pt; font-size: 10pt; line-height: 1.4; }
.objectives li::before { content: counter(obj); font: 600 12.5pt/1.1 'Cormorant Garamond', serif; color: var(--gold-big); }
.objectives li.deep::before { color: #A8452F; }
.deeptag { font: 500 6.8pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #fff; background: #A8452F;
  padding: 1.5pt 5pt 1pt; border-radius: 99pt; margin-right: 3pt; vertical-align: 1pt; }
.why { border-top: .6pt solid #d8d0b8; padding-top: 5pt; }
.why b { font: 500 7pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-text); margin-right: 5pt; }
/* the plan's sections may run on across a page, so no page ends half empty */
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
/* the "Show your class" page starts a page, even when the plan fills the one before to the foot */
.pb { break-after: auto; break-before: page; }
"""

# a poster sentence set apart, as the plans quote them
QUOTE_CSS = """
.pq { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.pq p { font: 400 9.6pt/1.45 'Courier Prime', 'Courier New', monospace; margin: 0 0 2pt; }
.pq cite { font: 400 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; font-style: normal; color: #5F6655; }
.figrow { display: grid; grid-template-columns: var(--fc, 1fr 1fr); gap: 12pt; align-items: center; margin: 4pt 0 10pt; break-inside: avoid; }
.figrow img { width: 100%; border-radius: 4pt; display: block; }
.figrow figure { margin: 0; }
.figrow figcaption { font: 400 7.8pt/1.35 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
"""

POSTER_NAMES = {1: "Poster 1 · The Writing Revolution", 2: "Poster 2 · QWERTY’s Accidental Empire"}


def quote(keys_, poster):
    """Poster sentences set apart, in the posters' typewriter face."""
    import html as h
    text = " ".join(Q[k] for k in keys_)
    return ("html", f'<blockquote class="pq"><p>{h.escape(text, quote=False)}</p><cite>{POSTER_NAMES[poster]}</cite></blockquote>')


LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."
LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
                 "a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask a Red Level reader.")

# the lesson's colors, as In Their Hands uses them
SAGE, SLATE, GOLD, GREEN, RUST = "#7D8471", "#2F4A5A", "#86671A", "#4A7346", "#A8452F"


def review(objectives, minutes, script, hint=None):
    """The Look back step: the objectives asked back as questions."""
    return {"phase": None, "minutes": minutes, "script": script, "title": "Look back", "show": "review", "lead": LOOK_BACK,
            **({"hint": hint} if hint else {}),
            "purpose": "Check what each student can now do against the objectives.",
            "students": [q for _, q, _ in objectives["items"]],
            "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}
