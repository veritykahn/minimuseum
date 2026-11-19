"""What the Great War lessons share: the exhibition's pictures, sounds and
the objectives block's look. Every fact the lessons use comes from
app/exhibitions/great-war/: greatWar.ts (the two posters, word for word,
and the display case's museum cards), silence/film.ts (the film's title
cards, the 1918 sound-ranging record and the two IWM photographs),
memorial/ (the Memorial's words and the American Battle Monuments
Commission records) and public/exhibitions/great-war/poster-sound/
credits.txt (the rooms' music). Not printed itself: build.py and
export_lessons.py skip files that start with an underscore."""

import os

GW = "/exhibitions/great-war/"

# the exhibition's own folder on disk, for the display case's photographs,
# which are WebP: build.py resizes only PNG and JPEG, so the print reads
# these straight from public/, and the classroom screen from the site
_PUBLIC = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public"))
def disk(path):
    """A picture in public/, as the printed page reads it."""
    return "file://" + _PUBLIC + path

HELMET = GW + "case/brodie-helmet.webp"
KIT = GW + "case/shaving-kit.webp"

# Pictures: the posters' own photographs carry no credit in the exhibition;
# the two Imperial War Museum photographs carry the credit their records give.
SILHOUETTE = GW + "silhouette.jpg"
TRENCH = GW + "trench.jpg"
FACES = GW + "faces.jpg"
POPPIES = GW + "poppies.png"
RECORD_IMG = GW + "iwm-q47886-sound-ranging.jpg"
RECORD_CREDIT = "© IWM (Q 47886)"
IWM_TRENCH = GW + "iwm-q1-trench.jpg"
IWM_TRENCH_CREDIT = "Image: IWM (Q 1)"
POSTER1 = GW + "poster1.jpg"
POSTER2 = GW + "poster2.jpg"
ROOM_MEMORIAL = GW + "rooms/memorial.webp"
ROOM_SILENCE = GW + "rooms/silence.webp"

# the rooms' alt text, as the exhibition gives it
ALT_SILHOUETTE = "A soldier in a helmet, a rifle on his back, silhouetted beside a wooden cross on a hill under a gray sky, with red poppies at the right"
ALT_TRENCH = "Sepia photograph of four soldiers in steel helmets walking away from the camera down a ruined trench"
ALT_RECORD = ("The 1918 sound-ranging record, “The End of the War. A Graphic Record.”: a strip of film with six white trace lines, "
              "jagged on the left under “One minute before the hour. All guns firing.”, then a blank gap, then flat on the right under "
              "“One minute after the hour. All guns silent.”, with time marks from 10.58-56 to 11.01-03 beneath")
ALT_MEMORIAL = "The Memorial room: a soldier’s silhouette by a cross against the sunset, poppies in the field"
ALT_SILENCE = "The When the Guns Fell Silent room: the film’s title over a dark screen, ready to begin"
ALT_HELMET = "The M1917 Brodie doughboy helmet: a wide-brimmed steel helmet, painted pale, with the round emblem of the American Legion on its side"
ALT_KIT = "The US Army issue shaving kit: an open black case lined in brown, holding a safety razor and a small box of blades"
ALT_POPPIES = "Red poppies on green stems, the flowers that climb the edge of the When the Guns Fell Silent poster"

# the film's six title cards (silence/film.ts), word for word
TITLE_CARDS = [
  "After 1,568 days of war.",
  "After 20 million dead.",
  "After boys lied about their age to fight.",
  "After trenches stretched 475 miles across Europe.",
  "After one final soldier fell at 10:59 AM.",
  "The guns finally went silent.",
]

# the rooms' sounds (public/exhibitions/great-war/poster-sound/credits.txt)
SOUND = GW + "poster-sound/"
CLIP_DOUGHBOYS = {"src": SOUND + "poster1.mp3", "label": "The Doughboys room",
                  "sub": "Sousa: “The Stars and Stripes Forever” (1896), then “In Memoriam” (1881)"}
CLIP_SILENT = {"src": SOUND + "poster2.mp3", "label": "The When the Guns Fell Silent room",
               "sub": "Dvořák: Largo, from the “New World” Symphony; then Handel: “Largo,” on the cello"}
CLIP_BELLS = {"src": SOUND + "moments/eleven-oclock.mp3", "label": "Bells at the eleventh hour",
              "sub": "Heard as the poster reaches 11:00"}
CLIP_BIRD = {"src": GW + "sounds/bird.mp3", "label": "A single bird",
             "sub": "The end of the film, after the guns have stopped"}
CLIP_WIND = {"src": GW + "sounds/breeze.mp3", "label": "The wind across the field",
             "sub": "All that is left in the film after 11:00"}

# the objectives block, the deeper objective, and plan sections that may run
# on across a page; the handouts print unchanged
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
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
.pb { break-after: auto; height: 0; margin: 0; padding: 0; } .pb + * { break-before: page; }
.cols > * > :last-child { margin-bottom: 0; padding-bottom: 0; }
"""

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

# timing colors, as in the model plans
C_HOOK, C_TEACH, C_LOOK, C_ACT, C_CLOSE = "#7D8471", "#2F4A5A", "#4A7346", "#86671A", "#A8452F"

def review(objectives, minutes, script, hint=None, purpose="Check what each student can now do against the objectives.", phase="Debrief"):
    """The Look back: the objectives asked back as questions."""
    s = {"phase": phase, "minutes": minutes, "script": script, "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": purpose, "students": [q for _, q, _ in objectives["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}
    if hint:
        s["hint"] = hint
    return s

# a figure set in a handout or plan from a picture in public/
def fig(src, w, h, fit="contain", pos="center", border=False, extra=""):
    b = "border:1pt solid #1d1c1a;border-radius:6pt;" if border else ""
    return (f'<img src="{src}" alt="" style="width:{w}pt;height:{h}pt;object-fit:{fit};object-position:{pos};{b}{extra}">')

# a poppy to color: drawn, so it prints as clean lines
def poppy_svg(size=150, stem=True):
    import math
    # five rounded petals as one scalloped outline, then the dark heart
    pts = []
    for i in range(361):
        t = math.radians(i)
        r = 30 + 12 * abs(math.cos(2.5 * t))
        pts.append(f"{50 + r * math.cos(t - math.pi / 2):.1f},{46 + r * math.sin(t - math.pi / 2):.1f}")
    outline = '<path d="M' + " L".join(pts) + ' Z" fill="#fdfcf8" stroke="#1d1c1a" stroke-width="2" />'
    folds = "".join(f'<path d="M{50 + 12 * math.cos(math.radians(a)):.1f},{46 + 12 * math.sin(math.radians(a)):.1f} '
                    f'L{50 + 24 * math.cos(math.radians(a)):.1f},{46 + 24 * math.sin(math.radians(a)):.1f}" stroke="#1d1c1a" stroke-width="1.2" />'
                    for a in range(-90 + 36, 270, 72))
    stalk = ('<path d="M50 80 C 48 100, 54 118, 50 142" fill="none" stroke="#1d1c1a" stroke-width="2" />'
             '<path d="M51 116 C 62 104, 76 104, 82 108 C 74 116, 62 118, 51 116 Z" fill="none" stroke="#1d1c1a" stroke-width="2" />') if stem else ""
    hgt = 145 if stem else 92
    return (f'<svg viewBox="0 0 100 {hgt}" width="{size}" height="{size * hgt / 100:.0f}" xmlns="http://www.w3.org/2000/svg">{stalk}'
            f'{outline}{folds}<circle cx="50" cy="46" r="9" fill="#1d1c1a" /></svg>')

# a clock face; hands at h:00 (or no hands, for drawing them in)
def clock_svg(hour=None, size=96, numbers=True):
    import math
    nums = ""
    if numbers:
        for n in range(1, 13):
            a = math.radians(n * 30 - 90)
            nums += f'<text x="{50 + 36 * math.cos(a):.1f}" y="{50 + 36 * math.sin(a) + 4:.1f}" text-anchor="middle" font-family="Outfit" font-size="11" font-weight="500">{n}</text>'
    hands = ""
    if hour is not None:
        a = math.radians(hour * 30 - 90)
        hands = (f'<line x1="50" y1="50" x2="{50 + 20 * math.cos(a):.1f}" y2="{50 + 20 * math.sin(a):.1f}" stroke="#1d1c1a" stroke-width="4" stroke-linecap="round" />'
                 '<line x1="50" y1="50" x2="50" y2="20" stroke="#1d1c1a" stroke-width="2.5" stroke-linecap="round" />')
    return (f'<svg viewBox="0 0 100 100" width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">'
            '<circle cx="50" cy="50" r="47" fill="rgba(255,255,255,.75)" stroke="#1d1c1a" stroke-width="2.5" />'
            f'{nums}{hands}<circle cx="50" cy="50" r="3" fill="#1d1c1a" /></svg>')

# the case photographs are square, with the object in the middle: print
# only the object, so it fills its frame
CASE_CSS = """
img[src*="brodie-helmet"] { object-view-box: inset(30% 16% 30% 16%); }
img[src*="shaving-kit"] { object-view-box: inset(28% 11% 28% 11%); }
"""
