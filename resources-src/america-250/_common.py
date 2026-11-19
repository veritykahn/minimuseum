"""Shared pieces for the America 250 resources: picture paths and their
credits exactly as app/exhibitions/america-250/america250.ts and
sign/signText.ts credit them, and the objectives block's look.
Files starting with "_" are not printed or exported themselves."""
import os as _os
import html, re

A = "/exhibitions/america-250/"
CP = A + "copies/"

# credits, as the exhibition's data gives them (TRUMBULL_CREDIT, LEUTZE_CREDIT, COPIES[].credit)
TRUMBULL = "John Trumbull, *Declaration of Independence*, 1818. U.S. Capitol. Public domain."
LEUTZE = "Emanuel Leutze, *Washington Crossing the Delaware*, 1851. The Metropolitan Museum of Art. Public domain."
DUNLAP_CR = "John Dunlap, printer, Philadelphia, 1776. Library of Congress, Rare Book and Special Collections Division. Public domain."
GODDARD_CR = "Mary Katharine Goddard, printer, Baltimore, 1777. Library of Congress, Rare Book and Special Collections Division. Public domain."
STONE_CR = "William J. Stone, engraving of the Declaration of Independence, 1823. National Archives. Public domain."
ORIGINAL_CR = "The Engrossed Declaration of Independence, signed August 2, 1776. National Archives. Public domain."

def pic(img, credit, pos="center"):
    return {"img": A + img, "pos": pos, "credit": credit}

URL = "minimuseumproject.org/exhibitions/america-250"

def md(t):
    """**bold** and *italic*, as in the block copy; everything else escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

# the objectives block's look, as in the In Their Hands plans; the handouts print unchanged
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
"""

# the plan's sections may run on across a page, so no page ends half empty
FLOW_CSS = """
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
.pb { break-after: auto; break-before: page; }
"""

TIMING_45 = [("Hook", 5, "#7D8471"), ("Teach", 13, "#2F4A5A"), ("Activity", 20, "#86671A"), ("Debrief", 7, "#A8452F")]

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

def look_back_say(red="a Red Level reader"):
    return ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
            f"a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask {red}.")

def review(objectives, minutes, script, hint=None, phase="Debrief"):
    s = {"phase": phase, "minutes": minutes, "script": script, "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": "Check what each student can now do against the objectives.",
         "students": [q for _, q, _ in objectives["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}
    if hint:
        s["hint"] = hint
    return s

# a picture set into a handout or plan: a framed figure with a caption
FIG_CSS = """
.fig { margin: 4pt 0 8pt; break-inside: avoid; }
.fig img { display: block; width: 100%; object-fit: cover; border-radius: 4pt; border: .8pt solid #1d1c1a; }
.fig figcaption { font: 400 7pt/1.3 'Outfit'; color: #5b5a55; margin-top: 2pt; letter-spacing: .02em; }
.copies { display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 9pt; margin: 4pt 0 9pt; break-inside: avoid; }
.copies figure { margin: 0; text-align: center; }
.copies img { width: 100%; height: var(--h, 120pt); object-fit: cover; object-position: center top; border: .8pt solid #1d1c1a; border-radius: 3pt; background: #fff; }
.copies .lt { position: relative; }
.copies .lt b { position: absolute; left: 4pt; top: 4pt; background: #1d1c1a; color: #fff; font: 500 9pt 'Outfit'; width: 16pt; height: 16pt; border-radius: 50%; display: grid; place-items: center; }
.copies figcaption { font: 400 7.8pt/1.3 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
"""

def fig(img, cap="", h=120, pos="center", style=""):
    c = f"<figcaption>{md(cap)}</figcaption>" if cap else ""
    return (f'<figure class="fig" style="{style}"><img src="{img}" alt="" style="height:{h}pt;object-position:{pos}">{c}</figure>')

def copies_row(items, h=120, letters=False):
    """items: (img, caption). Four copies of the Declaration in a row."""
    figs = ""
    for i, (img, cap) in enumerate(items):
        tag = f"<b>{'ABCD'[i]}</b>" if letters else ""
        figs += f'<figure><div class="lt"><img src="{img}" alt="">{tag}</div><figcaption>{md(cap)}</figcaption></figure>'
    return f'<div class="copies" style="--n:{len(items)};--h:{h}pt">{figs}</div>'

# evidence cards and a quotation, for the handouts (tinted ground)
EV_CSS = """
.ev { display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin: 4pt 0 8pt; }
.ev.three { grid-template-columns: repeat(3, 1fr); } .ev.three div { font-size: 8.7pt; }
.ev div { background: rgba(255,255,255,.72); border-top: 2.5pt solid var(--accent); padding: 6pt 9pt 3pt; font-size: 9.2pt; line-height: 1.38; break-inside: avoid; }
.ev b { display: block; font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-text); margin-bottom: 2pt; }
.quote { font: italic 400 12pt/1.35 'Cormorant Garamond', serif; border-left: 1.2pt solid var(--accent); padding-left: 10pt; margin: 4pt 0 8pt; break-inside: avoid; }
.quote cite { display: block; font: 400 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; font-style: normal; color: #454B3D; margin-top: 2pt; }
"""

def ev(cards, cls=""):
    return f'<div class="ev {cls}">' + "".join(f"<div><b>{md(a)}</b>{md(b)}</div>" for a, b in cards) + "</div>"

def quote(text, cite):
    return f'<div class="quote">{md(text)}<cite>{md(cite)}</cite></div>'

# a close-up cut from a picture: the part from (x0, y0) to (x1, y1), as
# fractions of its width and height, w points wide
# A close-up must print from the full-size picture: build.py prints from
# 450px copies of every "/..." src, too coarse to read a signature. So a
# close-up points at the original in public/ by its file path.
PUBLIC = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), "..", "..", "public"))

def zoom(img, size, box, w, style=""):
    iw, ih = size; x0, y0, x1, y1 = box
    if img.startswith("/"):
        img = "file://" + PUBLIC + img
    dw = w / (x1 - x0); dh = dw * ih / iw
    return (f'<div class="zoom" style="width:{w:.0f}pt;height:{(y1 - y0) * dh:.0f}pt;{style}">'
            f'<img src="{img}" alt="" style="width:{dw:.0f}pt;height:{dh:.0f}pt;left:{-x0 * dw:.0f}pt;top:{-y0 * dh:.0f}pt"></div>')
ZOOM_CSS = """
.zoom { position: relative; overflow: hidden; border: 1pt solid #1d1c1a; border-radius: 6pt; background: #fff; break-inside: avoid; }
.zoom img { position: absolute; max-width: none; }
"""
STONE_SIZE = (1600, 1893)
HANCOCK_BOX = (.37, .745, .62, .80)

# ── Add a Star: the states, and the flag drawn as the room draws it ─────
ORIGINALS = ['New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania',
             'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia']
LATER = [
  (14, "Vermont", 1791), (15, "Kentucky", 1792), (16, "Tennessee", 1796), (17, "Ohio", 1803),
  (18, "Louisiana", 1812), (19, "Indiana", 1816), (20, "Mississippi", 1817), (21, "Illinois", 1818),
  (22, "Alabama", 1819), (23, "Maine", 1820), (24, "Missouri", 1821), (25, "Arkansas", 1836),
  (26, "Michigan", 1837), (27, "Florida", 1845), (28, "Texas", 1845), (29, "Iowa", 1846),
  (30, "Wisconsin", 1848), (31, "California", 1850), (32, "Minnesota", 1858), (33, "Oregon", 1859),
  (34, "Kansas", 1861), (35, "West Virginia", 1863), (36, "Nevada", 1864), (37, "Nebraska", 1867),
  (38, "Colorado", 1876), (39, "North Dakota", 1889), (40, "South Dakota", 1889), (41, "Montana", 1889),
  (42, "Washington", 1889), (43, "Idaho", 1890), (44, "Wyoming", 1890), (45, "Utah", 1896),
  (46, "Oklahoma", 1907), (47, "New Mexico", 1912), (48, "Arizona", 1912), (49, "Alaska", 1959),
  (50, "Hawaii", 1959)]
FLAG_RES = "“thirteen stars, white in a blue field representing a new constellation”"
FLAG_MILESTONES = [(1777, 13, 13, "13 stripes and 13 stars, for the 13 states."),
                   (1795, 15, 15, "15 stars and 15 stripes, after Vermont and Kentucky joined; the flag of the Star-Spangled Banner."),
                   (1818, 20, 13, "Back to 13 stripes, with a star for every state, added on the July 4 after a state joins."),
                   (1960, 50, 13, "50 stars, after Hawaii joined, official on July 4, 1960.")]

def _stars_at(n, uw, uh):
    import math
    if n == 50:
        return [(63 + (2 * j if r % 2 == 0 else 2 * j + 1) * 63, 54 + r * 54, 30.8)
                for r in range(9) for j in range(6 if r % 2 == 0 else 5)]
    rows = max(1, round(math.sqrt(n * uh / uw)))
    base, extra = divmod(n, rows)
    order = [i for i in range(rows) if i % 2 == 0] + [i for i in range(rows) if i % 2 == 1]
    sizes = [base] * rows
    for k in range(extra):
        sizes[order[k]] += 1
    dx, dy = uw / max(sizes), uh / rows
    r = min(dx, dy) * .36
    out = []
    for row, c in enumerate(sizes):
        left = (uw - c * dx) / 2 + dx / 2
        out += [(left + j * dx, dy * (row + .5), r) for j in range(c)]
    return out

def _star_path(x, y, r):
    import math
    d = ""
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * .382
        d += f"{'M' if i == 0 else 'L'}{x + math.cos(a) * rr:.1f} {y + math.sin(a) * rr:.1f}"
    return d + "Z"

def flag_svg(stars, w=150, stripes=None, color=True, show_stars=True):
    """The flag as the Add a Star room draws it (flagLayout.ts): 1900 by 1000,
    the union 760 wide and down to the foot of the seventh stripe of 13."""
    if stripes is None:
        stripes = 15 if 15 <= stars < 20 else 13
    W, H, UW = 1900, 1000, 760
    sh = H / stripes
    uh = H * -(-stripes // 2) / stripes
    red, white, blue = ("#a8343b", "#f6f0e2", "#2f3561") if color else ("#fff", "#fff", "#fff")
    body = f'<rect width="{W}" height="{H}" fill="{white}"/>'
    for i in range(stripes):
        if color and i % 2 == 0:
            body += f'<rect x="0" y="{i * sh:.1f}" width="{W}" height="{sh + .5:.1f}" fill="{red}"/>'
        elif not color and i:
            body += f'<line x1="0" y1="{i * sh:.1f}" x2="{W}" y2="{i * sh:.1f}" stroke="#1d1c1a" stroke-width="5"/>'
    body += f'<rect x="0" y="0" width="{UW}" height="{uh:.1f}" fill="{blue}" stroke="{"none" if color else "#1d1c1a"}" stroke-width="8"/>'
    if show_stars and stars:
        fill = white if color else "none"
        stroke = "none" if color else 'stroke="#1d1c1a" stroke-width="6"'
        body += f'<g fill="{fill}" {stroke}>' + "".join(f'<path d="{_star_path(*p)}"/>' for p in _stars_at(stars, UW, uh)) + "</g>"
    body += f'<rect width="{W}" height="{H}" fill="none" stroke="#1d1c1a" stroke-width="10"/>'
    return f'<svg width="{w}pt" height="{w * H / W:.1f}pt" viewBox="0 0 {W} {H}">{body}</svg>'
