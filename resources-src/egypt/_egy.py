"""What the Ancient Egypt lessons share: the exhibition's pictures with their
credits, the hieroglyphs (and the font the rooms set them in), and the look
of the objectives block. build.py and export_lessons.py skip this file (its
name starts with "_"); each lesson module imports it.

Every picture is from public/exhibitions/egypt/, credited as the exhibition
credits it: the tomb walls as tomb/scenes.ts does (The Met's facsimiles,
public domain), the Rosetta Stone as rosetta-stone/rosetta.ts does, the
Younger Memnon as egypt.ts does. The gods are the posters' own
illustrations, with no credit. The room pictures in rooms/ are .webp and so
are shown only on the classroom screen, never printed."""
import html as _html, os as _os, re as _re

E = "/exhibitions/egypt/"
ROOT = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))

# ── the tomb walls (tomb/scenes.ts): picture, natural size, credit ──────
WALLS = {
  "marshes": {"img": E + "tomb/menna-marshes.jpg", "w": 1800, "h": 991,
              "title": "Menna and Family Hunting in the Marshes, Tomb of Menna",
              "credit": "Facsimile by Nina de Garis Davies, 1924 · The Met"},
  "harvest": {"img": E + "tomb/menna-harvest.jpg", "w": 1800, "h": 757,
              "title": "Harvest Scenes, Tomb of Menna",
              "credit": "Facsimile by Charles K. Wilkinson · The Met"},
  "fields":  {"img": E + "tomb/sennedjem-fields.jpg", "w": 1800, "h": 1169,
              "title": "Sennedjem and Iineferti in the Fields of Iaru",
              "credit": "Facsimile by Charles K. Wilkinson, 1922 · The Met"},
  "cat":     {"img": E + "tomb/sennedjem-cat.jpg", "w": 1800, "h": 1054,
              "title": "Wall painting of a cat killing a serpent",
              "credit": "Facsimile by Charles K. Wilkinson, 1920–21 · The Met"},
  "wine":    {"img": E + "tomb/ipuy-wine.jpg", "w": 1800, "h": 1265,
              "title": "Winemaking, Tomb of Ipuy",
              "credit": "Facsimile by Charles K. Wilkinson · The Met"},
}

def wall_hero(key, pos="center 45%"):
    w = WALLS[key]
    return {"img": w["img"], "pos": pos, "credit": w["credit"]}

STONE = E + "rosetta/rosetta-stone.jpg"
STONE_TOP = E + "rosetta/hieroglyphic.jpg"
STONE_MID = E + "rosetta/demotic.jpg"
STONE_LOW = E + "rosetta/greek.jpg"
STONE_CREDIT = "Hans Hillewaert, CC BY-SA 4.0, Wikimedia Commons"
MEMNON = E + "bm-ea19-younger-memnon.jpg"
MEMNON_CREDIT = "© The Trustees of the British Museum, CC BY-NC-SA 4.0"

# the posters' four gods (egypt.ts), each with the poster's alt text
GODS = {
  "anubis": {"img": E + "anubis.jpg", "name": "Anubis",
             "alt": "Anubis in the Egyptian style: a man with the black head of a jackal, holding a staff and an ankh"},
  "bastet": {"img": E + "bastet.jpg", "name": "Bastet",
             "alt": "Bastet in the Egyptian style: a woman with the black head of a cat, in a long white dress, holding a sistrum and an ankh"},
  "horus":  {"img": E + "horus.jpg", "name": "Horus",
             "alt": "Horus in the Egyptian style: a man with the head of a falcon and a tall crown, holding a staff and an ankh"},
  "isis":   {"img": E + "isis.jpg", "name": "Isis",
             "alt": "Isis in the Egyptian style: a woman in a long red dress with a crown on her head, holding a staff and an ankh"},
}
GOD_ASPECT = round(408 / 356, 3)

# the rooms' own pictures (.webp): for the classroom screen only
ROOM = {k: E + f"rooms/{k}.webp" for k in
        ("tomb", "hieroglyph-name", "rosetta-stone", "mummification", "weighing-of-the-heart", "amulet")}

# ── hieroglyphs (rooms.ts), set in the rooms' own font ─────────────────
FONT = _os.path.join(ROOT, "public", "exhibitions", "egypt", "fonts", "NotoSansEgyptianHieroglyphs-subset.woff2")
HIERO_CSS = ("@font-face { font-family: 'EgHiero'; src: url('file://" + FONT + "') format('woff2'); } "
             ".hg { font-family: 'EgHiero'; font-weight: 400; line-height: 1; } ")

CP = {"G1": 0x1313f, "D58": 0x130c0, "V31": 0x133a1, "D46": 0x130a7, "M17": 0x131cb, "M17A": 0x131cc,
      "I9": 0x13191, "W11": 0x133bc, "V28": 0x1339b, "I10": 0x13193, "E23": 0x130ed, "G17": 0x13153,
      "N35": 0x13216, "V4": 0x1336f, "Q3": 0x132aa, "N29": 0x1320e, "D21": 0x1308b, "S29": 0x132f4,
      "X1": 0x133cf, "G43": 0x13171, "Z4": 0x133ed, "O34": 0x13283, "V13": 0x1337f, "N37": 0x13219,
      "Aa15": 0x1341d, "H8": 0x13187, "S34": 0x132f9, "D10": 0x13080, "R11": 0x132bd, "L1": 0x131a3,
      "I12": 0x13197, "M9": 0x131b8, "F34": 0x13123, "H6": 0x13184}

def g(code):
    return chr(CP[code])

# the Egypt Exploration Society's chart, as hieroglyph-name/alphabet.ts sets it
SIGNS = {"A": ["G1"], "B": ["D58"], "C": ["V31"], "D": ["D46"], "E": ["M17A"], "F": ["I9"], "G": ["W11"],
         "H": ["V28"], "I": ["M17"], "J": ["I10"], "K": ["V31"], "L": ["E23"], "M": ["G17"], "N": ["N35"],
         "O": ["V4"], "P": ["Q3"], "Q": ["N29"], "R": ["D21"], "S": ["S29"], "T": ["X1"], "U": ["G43"],
         "V": ["I9"], "W": ["G43"], "X": ["V31", "S29"], "Y": ["M17A"], "Z": ["O34"], "CH": ["V13"], "SH": ["N37"]}
CHART = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") + ["CH", "SH"]

# what each sign shows (rooms.ts SIGN_NAMES, after Unicode's descriptions)
SIGN_NAMES = {"G1": "an Egyptian vulture", "D58": "a foot and lower leg", "V31": "a basket with a handle",
  "D46": "a hand", "M17": "a flowering reed", "M17A": "two flowering reeds", "I9": "a horned viper",
  "W11": "a stand for jars", "V28": "a wick of twisted flax", "I10": "a cobra, resting", "E23": "a lion, lying down",
  "G17": "an owl", "N35": "a ripple of water", "V4": "a lasso", "Q3": "a stool made of reed matting",
  "N29": "a sandy hill slope", "D21": "a mouth", "S29": "a folded cloth", "X1": "a half loaf of bread",
  "G43": "a quail chick", "O34": "a door bolt", "V13": "a rope for tethering animals", "N37": "a pool"}

def spell(word):
    """A word sign by sign, as the room spells it ("ch" and "sh" take their own sign)."""
    w = _re.sub(r"[^A-Z]", "", word.upper())
    out, i = [], 0
    while i < len(w):
        two = w[i:i + 2]
        key = two if two in ("CH", "SH") else w[i]
        out.append((key, "".join(g(c) for c in SIGNS[key])))
        i += len(key)
    return out

def chart_html(cols=7, small=False):
    """The sign chart: each letter with its sign."""
    cells = "".join(f'<div><span class="hg">{"".join(g(c) for c in SIGNS[k])}</span><b>{k}</b></div>' for k in CHART)
    return f'<div class="signchart{" small" if small else ""}" style="--c:{cols}">{cells}</div>'

def cartouche(signs="", w=None, h=None, cls=""):
    """An oval cartouche with its end line, holding signs (or empty, to write in)."""
    st = (f' style="width:{w}pt;height:{h}pt"' if w else "")
    return f'<div class="cart {cls}"{st}><span class="hg">{signs}</span></div>'

SIGN_CSS = HIERO_CSS + """
.pb { break-after: auto; break-before: page; height: 0; margin: 0; }
.signchart { display: grid; grid-template-columns: repeat(var(--c), 1fr); gap: 3pt; margin: 4pt 0 8pt; break-inside: avoid; }
.signchart div { border: .7pt solid #8d8a80; border-radius: 3pt; background: rgba(255,255,255,.7); text-align: center; padding: 3pt 0 2pt; }
.signchart .hg { display: block; font-size: 19pt; height: 21pt; }
.signchart b { display: block; font: 500 8.5pt 'Outfit'; letter-spacing: .08em; }
.signchart.small .hg { font-size: 15pt; height: 17pt; } .signchart.small b { font-size: 7.5pt; }
.cart { position: relative; display: flex; align-items: center; justify-content: center; margin: 6pt auto 8pt;
  border: 2pt solid #1d1c1a; border-radius: 999pt; background: rgba(255,255,255,.6); width: 360pt; height: 64pt; break-inside: avoid; }
.cart::after { content: ""; position: absolute; right: -9pt; top: 10%; height: 80%; border-right: 3pt solid #1d1c1a; }
.cart .hg { font-size: 34pt; letter-spacing: 4pt; }
"""

# ── a piece of a picture, cut out by its own pixels ─────────────────────
def crop(src, natw, nath, x, y, cw, ch, width, cls="crop", border=True):
    """Shows the box (x, y, cw, ch) of a picture of natural size natw × nath,
       `width` points wide. The picture itself is set larger and moved, so the
       printed copy keeps the picture's full resolution."""
    s = width / cw
    hpt = ch * s
    bd = "border:1pt solid #1d1c1a;" if border else ""
    return (f'<div class="{cls}" style="position:relative;overflow:hidden;width:{width:.1f}pt;height:{hpt:.1f}pt;'
            f'border-radius:5pt;{bd}flex:none"><img src="{src}" alt="" style="position:absolute;max-width:none;'
            f'width:{natw * s:.1f}pt;height:{nath * s:.1f}pt;left:{-x * s:.1f}pt;top:{-y * s:.1f}pt"></div>')

def wall_crop(key, x, y, cw, ch, width, **kw):
    w = WALLS[key]
    return crop(w["img"], w["w"], w["h"], x, y, cw, ch, width, **kw)

def md(t):
    t = _html.escape(t, quote=False)
    t = _re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return _re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

# ── the plan's objectives block, and its page rules (as the model's) ────
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
/* the "Show your class" page starts a page */
.pb { break-after: auto; break-before: page; height: 0; margin: 0; }
"""

# the phases' colors, as the model's
HOOK, TEACH, ACT, CLOSE, LOOK = "#7D8471", "#2F4A5A", "#86671A", "#A8452F", "#4A7346"

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

def look_back_say(objectives, who="a Red Level reader"):
    return ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
            f"a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask {who}.")

def review(objectives, minutes, script, title="Look back", hint=None, phase="Close"):
    s = {"phase": phase, "minutes": minutes, "script": script, "title": title, "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in objectives["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}
    if hint:
        s["hint"] = hint
    return s

SITE_EX = "minimuseumproject.org/exhibitions/egypt"
RESOURCES = "minimuseumproject.org/exhibitions/egypt/resources"
