"""Small line drawings for the Fear Lab handouts, drawn here so children can
color them: feeling faces, a heart, the harmless things from the fear boxes
(the pinecone, a feather, bubbles), the Rustling Bushes' clues and the
brave steps. The heart, the feather and the paw follow the lab's own
drawings (WhatScaresYouLab.tsx, Surprise.tsx, RustlingBushes.tsx). Outlines
only, in black, so they print on any tint."""

S = 'fill="none" stroke="#1d1c1a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'

def svg(view, body, w, h=None):
    h = h or w
    return f'<svg viewBox="{view}" width="{w}pt" height="{h}pt" xmlns="http://www.w3.org/2000/svg">{body}</svg>'

def face(kind, w=70):
    """happy, curious (surprised), worried, scared, calm"""
    eyes = '<circle cx="36" cy="42" r="4" fill="#1d1c1a"/><circle cx="64" cy="42" r="4" fill="#1d1c1a"/>'
    mouth = {
        "happy":   '<path d="M 32 60 Q 50 78 68 60" ' + S + '/>',
        "calm":    '<path d="M 36 63 Q 50 70 64 63" ' + S + '/>',
        "curious": '<ellipse cx="50" cy="66" rx="7" ry="9" ' + S + '/><path d="M 28 30 Q 36 24 44 30 M 56 30 Q 64 24 72 30" ' + S + '/>',
        "worried": '<path d="M 34 68 Q 42 60 50 66 Q 58 72 66 64" ' + S + '/><path d="M 28 32 L 44 28 M 56 28 L 72 32" ' + S + '/>',
        "scared":  '<ellipse cx="50" cy="68" rx="10" ry="12" ' + S + '/><path d="M 28 30 L 44 22 M 56 22 L 72 30" ' + S + '/>',
    }[kind]
    if kind == "scared":
        eyes = '<circle cx="36" cy="44" r="6" ' + S + '/><circle cx="64" cy="44" r="6" ' + S + '/><circle cx="36" cy="44" r="2" fill="#1d1c1a"/><circle cx="64" cy="44" r="2" fill="#1d1c1a"/>'
    return svg("0 0 100 100", f'<circle cx="50" cy="50" r="44" {S}/>' + eyes + mouth, w)

def heart(w=80):
    return svg("-1 -1 34 32", '<path d="M16 28 C 6 20 1 14 1 8.5 C 1 4.4 4.3 1 8.4 1 C 11.6 1 14.3 3 16 5.8 C 17.7 3 20.4 1 23.6 1 C 27.7 1 31 4.4 31 8.5 C 31 14 26 20 16 28 Z" '
               'fill="none" stroke="#1d1c1a" stroke-width="1.2" stroke-linejoin="round"/>', w, w * 32 / 34)

def pinecone(w=70):
    scales = ""
    for row, (y, n, half) in enumerate([(40, 3, 24), (58, 4, 30), (76, 4, 30), (94, 3, 26), (110, 2, 16)]):
        step = 2 * half / n
        for i in range(n):
            x = 50 - half + step * (i + .5)
            scales += f'<path d="M {x - step / 2:.1f} {y} Q {x:.1f} {y + 14} {x + step / 2:.1f} {y}" {S}/>'
    body = ('<path d="M 50 8 L 50 24" ' + S + '/>'
            '<path d="M 50 22 C 22 30 16 70 30 104 Q 50 128 70 104 C 84 70 78 30 50 22 Z" ' + S + '/>' + scales)
    return svg("0 0 100 130", body, w, w * 1.3)

def feather(w=40):
    barbs = "".join(f'<path d="M 0 {y} L -15 {y + 10} M 1 {y + 6} L 14 {y + 15}" {S} stroke-width="2"/>' for y in range(-72, 61, 16))
    body = ('<path d="M 1 82 C -22 50 -26 -30 -4 -96 C 2 -98 4 -96 6 -92 C 24 -40 22 40 1 82 Z" ' + S + '/>'
            '<path d="M 1 98 L 2 -90" ' + S + ' stroke-width="2"/>' + barbs)
    return svg("-40 -104 80 210", body, w, w * 210 / 80)

def bubbles(w=80):
    body = "".join(f'<circle cx="{x}" cy="{y}" r="{r}" {S}/><path d="M {x - r * .55:.1f} {y - r * .2:.1f} Q {x - r * .5:.1f} {y - r * .55:.1f} {x - r * .15:.1f} {y - r * .6:.1f}" {S} stroke-width="2"/>'
                   for x, y, r in [(34, 62, 24), (70, 36, 18), (76, 76, 12), (22, 22, 9)])
    return svg("0 0 100 100", body, w)

def paws(w=90):
    def paw(x, y, s=1):
        return (f'<g transform="translate({x} {y}) scale({s})"><ellipse rx="7" ry="5.6" fill="#1d1c1a"/>'
                '<circle cx="-7" cy="-7" r="2.5" fill="#1d1c1a"/><circle cx="-2.4" cy="-10" r="2.5" fill="#1d1c1a"/>'
                '<circle cx="2.8" cy="-10" r="2.5" fill="#1d1c1a"/><circle cx="7.3" cy="-6.8" r="2.5" fill="#1d1c1a"/></g>')
    return svg("0 0 100 60", paw(18, 46, 1.3) + paw(42, 30, 1.3) + paw(64, 48, 1.3) + paw(86, 30, 1.3), w, w * .6)

def tail(w=80):
    body = ('<path d="M 10 80 Q 60 80 70 40 Q 76 14 56 8" fill="none" stroke="#1d1c1a" stroke-width="16" stroke-linecap="round"/>'
            '<path d="M 10 80 Q 60 80 70 40 Q 76 14 56 8" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>'
            + "".join(f'<path d="M {x} {y} l {dx} {dy}" stroke="#1d1c1a" stroke-width="4" stroke-linecap="round"/>'
                      for x, y, dx, dy in [(26, 73, 4, 13), (44, 70, 6, 12), (59, 60, 9, 7), (66, 45, 10, 2), (66, 28, 10, -5)]))
    return svg("0 0 100 100", body, w)

def leaves(w=90):
    leaf = lambda x, y, r: (f'<g transform="translate({x} {y}) rotate({r})"><path d="M 0 0 Q 14 -14 28 0 Q 14 14 0 0 Z" {S}/>'
                            f'<path d="M 2 0 L 26 0" {S} stroke-width="2"/></g>')
    gust = f'<path d="M 4 30 Q 30 20 54 30 T 96 26 M 10 52 Q 36 44 60 52 T 92 50" {S} stroke-width="2.4"/>'
    return svg("0 0 100 80", gust + leaf(12, 68, -20) + leaf(46, 64, 15) + leaf(70, 14, -35), w, w * .8)

def growl(w=90):
    return svg("0 0 100 60", '<text x="50" y="40" text-anchor="middle" font-family="Outfit" font-weight="500" font-size="30" '
               'fill="none" stroke="#1d1c1a" stroke-width="1.4" letter-spacing="2">GRRR</text>', w, w * .6)

def shadow(w=110):
    return svg("-190 -24 150 48", '<path d="M -178 16 q 16 -12 44 -11 l 6 -10 l 7 9 q 13 -1 22 1 l 7 -9 l 4 10 q 22 4 34 10 q -56 10 -124 0 Z" '
               'fill="#1d1c1a" fill-opacity=".75" stroke="#1d1c1a" stroke-width="1.5"/>', w, w * 48 / 150)

def breath(w=70):
    return svg("0 0 100 100", f'<path d="M 10 34 Q 50 22 66 34 Q 80 46 66 54 Q 54 60 50 48" {S}/>'
               f'<path d="M 10 54 Q 46 48 70 62 Q 86 74 74 84 Q 62 90 58 78" {S}/><path d="M 10 74 L 44 74" {S}/>', w)

def magnifier(w=70):
    return svg("0 0 100 100", f'<circle cx="42" cy="42" r="26" {S}/><path d="M 61 61 L 88 88" fill="none" stroke="#1d1c1a" stroke-width="9" stroke-linecap="round"/>', w)

def speech(w=70):
    return svg("0 0 100 100", f'<path d="M 14 20 L 86 20 Q 92 20 92 26 L 92 60 Q 92 66 86 66 L 44 66 L 26 84 L 30 66 L 14 66 Q 8 66 8 60 L 8 26 Q 8 20 14 20 Z" {S}/>'
               '<circle cx="34" cy="43" r="4" fill="#1d1c1a"/><circle cx="50" cy="43" r="4" fill="#1d1c1a"/><circle cx="66" cy="43" r="4" fill="#1d1c1a"/>', w)

def bush(w=120):
    return svg("0 0 140 90", f'<path d="M 10 82 Q 0 58 22 50 Q 18 24 46 26 Q 56 6 80 16 Q 104 8 112 32 Q 138 36 128 62 Q 136 80 120 82 Z" {S}/>'
               f'<path d="M 40 58 q 8 -8 16 0 M 78 46 q 8 -8 16 0 M 96 66 q 6 -6 12 0" {S} stroke-width="2"/>', w, w * 90 / 140)

# everyday things that look like faces (for pareidolia)
def outlet(w=80):
    return svg("0 0 100 120", f'<rect x="10" y="6" width="80" height="108" rx="10" {S}/>'
               f'<rect x="31" y="34" width="8" height="22" rx="3" {S}/><rect x="61" y="34" width="8" height="22" rx="3" {S}/>'
               f'<path d="M 42 86 Q 42 74 50 74 Q 58 74 58 86 Z" {S}/>', w, w * 1.2)

def house(w=90):
    return svg("0 0 120 110", f'<path d="M 10 50 L 60 8 L 110 50" {S}/><rect x="20" y="46" width="80" height="58" {S}/>'
               f'<rect x="32" y="58" width="18" height="16" {S}/><rect x="70" y="58" width="18" height="16" {S}/>'
               f'<path d="M 50 104 L 50 86 Q 60 78 70 86 L 70 104" {S}/>', w, w * 110 / 120)

def car(w=100):
    return svg("0 0 140 90", f'<path d="M 30 40 L 42 14 L 98 14 L 110 40" {S}/><rect x="12" y="40" width="116" height="34" rx="8" {S}/>'
               f'<circle cx="34" cy="54" r="9" {S}/><circle cx="106" cy="54" r="9" {S}/>'
               f'<path d="M 52 62 Q 70 70 88 62" {S}/><path d="M 22 74 L 22 84 M 118 74 L 118 84" {S}/>', w, w * 90 / 140)

BLOBS = [
  "M 50 8 C 78 6 94 30 88 52 C 96 74 74 96 50 90 C 24 98 4 76 12 52 C 2 28 24 4 50 8 Z",
  "M 20 30 C 30 4 72 0 82 24 C 100 34 96 70 76 80 C 66 98 30 96 22 78 C 2 70 4 40 20 30 Z",
  "M 14 50 C 10 20 40 18 52 24 C 66 6 96 16 90 42 C 100 62 88 88 62 84 C 44 98 14 86 18 66 C 6 62 6 54 14 50 Z",
]
def blob(i, w=90):
    return svg("0 0 100 100", f'<path d="{BLOBS[i % len(BLOBS)]}" {S}/>', w)
