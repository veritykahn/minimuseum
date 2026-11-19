"""What every Victorian Britain lesson shares: the exhibition's pictures, the
plan's objectives block, the handout frame and a few small drawings.

Facts in the lessons follow the exhibition itself:
  app/exhibitions/victorian/victorian.ts            the two posters and the case
  app/exhibitions/victorian/inventions/inventionsText.ts   the Inventions Workshop
  app/exhibitions/victorian/christmas-card/cardText.ts     the Christmas Card Maker
  app/exhibitions/victorian/christmas-parlour/parlourText.ts, ghostText.ts
                                                     Dickens' Christmas Parlour

Pictures come from public/exhibitions/victorian/. build.py prints from
print-sized copies of .png and .jpg files only, so a .webp picture is given
to the printer by its full path on this machine (pic()); the classroom
screen always takes the public path (V)."""
import html, os, re

V = "/exhibitions/victorian/"
_PUBLIC = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "public")


def pic(path):
    """A picture for the PDF: .jpg and .png as build.py expects them; .webp by
    its file path, since build.py copies only .jpg and .png for printing."""
    if path.endswith(".webp"):
        return "file://" + _PUBLIC + path
    return path


def exists(path):
    return os.path.exists(_PUBLIC + path)


# ── the exhibition's pictures, with their credits as the exhibition gives them ──
COURT_DRESS = V + "va-court-dress.jpg"
COURT_DRESS_CREDIT = "Court dress, Great Britain, 1860–1865. V&A T.329 to B, AA-1977. © Victoria and Albert Museum, London"
ROOM = V + "va-refreshment-room.jpg"
ROOM_CREDIT = "*The Centre Refreshment Room, opened 1868.* Photograph, late 1860s. V&A E.655-2009. © Victoria and Albert Museum, London"
VILLAGE = V + "village.jpg"
POSTER1 = V + "poster1.jpg"
POSTER2 = V + "poster2.jpg"
PARLOUR_WARM = V + "parlour/parlour-warm.webp"
PARLOUR_COLD = V + "parlour/parlour-cold.webp"
PLATFORM = V + "inventions/railway-platform.webp"
TELEGRAPH_OFFICE = V + "inventions/telegraph-office.webp"
BENCH = V + "inventions/workshop-bench.webp"
STUDIO = V + "inventions/photography-studio.webp"
CARDS = {k: V + f"christmas-card/card-{k}.webp" for k in ("robin", "feast", "wreath", "church")}
CARD_NAMES = {"robin": "Robin", "feast": "Christmas feast", "wreath": "Holly wreath", "church": "Snowy church"}
CARD_ALTS = {
  "robin": "A robin on a snowy branch of holly with red berries",
  "feast": "A family at the Christmas table, the pudding alight, a fire in the grate and a tree lit with candles by the window",
  "wreath": "A wreath of holly and ivy with red berries, tied with a red ribbon",
  "church": "A village church in the snow at night, its windows lit and lamps along the path to its door"}
BORDER_GILT = V + "christmas-card/border-gilt.webp"
BORDER_LACE = V + "christmas-card/border-lace.webp"
PH = V + "photography/"
NEGATIVE = PH + "talbot-oriel-window-negative.webp"
POSITIVE = PH + "talbot-oriel-window-positive.webp"
OPEN_DOOR = PH + "talbot-open-door.webp"
DAGUERREOTYPE = PH + "claudet-daguerreotype.webp"
CAMERON = PH + "cameron-cassiopeia.webp"
MET = "The Metropolitan Museum of Art, public domain"
PHOTO_CREDITS = {
  NEGATIVE: "William Henry Fox Talbot, *The Oriel Window, South Gallery, Lacock Abbey*, probably 1835. Paper negative. " + MET,
  POSITIVE: "Made for the exhibition from Talbot’s negative, its light and dark turned back the way a print turns them",
  OPEN_DOOR: "William Henry Fox Talbot, *The Open Door*, before May 1844. Salted paper print from paper negative. " + MET,
  DAGUERREOTYPE: "Antoine-François-Jean Claudet, *Middle-aged Man with Glasses Holding Pocket Watch*, 1844–59. Daguerreotype with applied colour. " + MET,
  CAMERON: "Julia Margaret Cameron, *Cassiopeia*, June 1866. Albumen silver print from glass negative. " + MET}

# the classroom screen's picture: always the public path
def screen_pic(path, pos=None, credit=None):
    d = {"img": path}
    if pos:
        d["pos"] = pos
    if credit:
        d["credit"] = credit
    return d


# ── timing colors, as the model plans use them ──
HOOK, TEACH, WORK, CLOSE, EXTRA = "#7D8471", "#2F4A5A", "#86671A", "#A8452F", "#4A7346"

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

# the objectives block's look, as in the model plans; the handouts print unchanged
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

# small pieces of drawing shared by the plans and handouts
CSS = """
.shot { margin: 4pt 0 10pt; break-inside: avoid; }
.shot img, .shot .crop { width: 100%; border-radius: 5pt; border: 1pt solid #1d1c1a; display: block; object-fit: cover; }
.shot figcaption { font: 400 7.4pt/1.35 'Outfit'; color: #5b5a55; margin-top: 3pt; }
.duo { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 4pt 0 10pt; break-inside: avoid; }
.duo figure { margin: 0; }
.duo img { width: 100%; object-fit: cover; border-radius: 5pt; border: 1pt solid #1d1c1a; display: block; }
.duo figcaption { font: 500 8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; text-align: center; margin-top: 3pt; }
.duo figcaption small { display: block; font: 400 7.2pt/1.3 'Outfit'; letter-spacing: 0; text-transform: none; color: #5b5a55; }
.row { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
.row figure { margin: 0; text-align: center; }
.row img { width: 100%; object-fit: cover; border-radius: 4pt; border: 1pt solid #1d1c1a; display: block; }
.row figcaption { font: 400 8pt/1.3 'Outfit'; margin-top: 3pt; }
.row figcaption b { display: block; font-weight: 500; }
.tip { border-left: 3pt solid #1d1c1a; padding: 2pt 0 2pt 9pt; margin: 2pt 0 7pt; }
.bank { display: flex; flex-wrap: wrap; gap: 7pt; margin: 4pt 0 9pt; }
.bank span { border: 1pt solid #1d1c1a; border-radius: 99pt; padding: 2pt 12pt; background: rgba(255,255,255,.6); }
.blank { display: inline-block; min-width: 90pt; border-bottom: 1pt solid #1d1c1a; }
.trace { margin: 6pt 0 8pt; }
.trace div { position: relative; height: 58pt; border-top: 1pt solid #8d8a80; border-bottom: 1.4pt solid #5b5a55; margin-bottom: 14pt; }
.trace div::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; border-top: 1pt dashed #a9a69b; }
.trace span { position: absolute; left: 10pt; bottom: -9pt; font: 300 76pt/1 'Outfit'; letter-spacing: .32em; color: #a9a69b; }
.trace span.model { color: #1d1c1a; font-weight: 400; }
.trace span.lead { color: #1d1c1a; font: 400 34pt/1 'Outfit'; letter-spacing: .03em; bottom: -3pt; }
"""


def md(t):
    """**bold** and *italic*, as build.py writes them; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)


def crop(path, x0, y0, x1, y1, aspect, cls="crop", extra=""):
    """A part of a picture, as a box: the region (x0, y0)–(x1, y1), in
    fractions of the picture's width and height; aspect is the whole
    picture's width over its height. The box keeps the region's shape."""
    z = 1 / (x1 - x0)
    w_over_h_region = (x1 - x0) * aspect / (y1 - y0)
    # where the region's corner falls, as CSS background-position percentages
    px = 0 if z == 1 else x0 * z / (z - 1) * 100
    hz = (1 / (y1 - y0))
    py = 0 if hz == 1 else y0 * hz / (hz - 1) * 100
    url = "file://" + _PUBLIC + path
    return (f'<div class="{cls}" style="aspect-ratio:{w_over_h_region:.3f};background:url(\'{url}\') {px:.2f}% {py:.2f}% / {z * 100:.1f}% auto no-repeat;{extra}"></div>')


def objectives(items, why, screen=None):
    d = {"heading": "By the end of this lesson you will be able to:", "items": items, "why": why}
    if screen:
        d["screen"] = {"heading": "I can…", "items": screen}
    return d


def review_step(objs, minutes, script, title="Look back", hint=None, phase="Close"):
    s = {"phase": phase, "minutes": minutes, "script": script, "title": title, "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in objs["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(objs["items"]) if deep]}
    if hint:
        s["hint"] = hint
    return s


def handout_maker(dir_, title, sub, foot_grade, context, hero, css="", young=False):
    def handout(level, out, blocks, extra_css=""):
        d = {"out": dir_ + out, "eyebrow": "Student handout", "title": title, "sub": sub, "level": level,
             "context": context, "foot": f"Student Handout · {foot_grade} · {level.title()} Level",
             "blocks": blocks, "hero": hero, "css": CSS + css + extra_css}
        if young:
            d["young"] = True
        return d
    return handout
