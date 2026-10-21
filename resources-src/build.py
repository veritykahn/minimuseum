#!/usr/bin/env python3
"""Builds the Mini Museum classroom resources as branded PDFs.

Each document is described as data in an exhibition's content module
(resources-src/<exhibition>/*.py). This script lays it out as HTML in the
Mini Museum identity and prints it to PDF with headless Chrome, straight
into public/resources/<exhibition>/, so the whole set can be re-printed
after any edit:

    python3 resources-src/build.py in-their-hands          # everything
    python3 resources-src/build.py in-their-hands religion # names matching

Nothing here ships with the site: Next only serves public/.
"""
import html, importlib.util, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "resources-src")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SITE = "minimuseumproject.org"
YEAR = "2026"

# name, subtitle, color. Each passes 4.5:1 against white for small text,
# and white text on it passes too (the badges).
LEVELS = {
    "green":  ("Green Level",  "More Support",  "#4A7346"),
    "yellow": ("Yellow Level", "Grade Level",   "#86671A"),
    "red":    ("Red Level",    "Go Deeper",     "#A8452F"),
}
# the page ground for each level: a soft tint, like colored copy paper,
# light enough to write on and to print without flooding the page with ink
TINTS = {"green": "#E9F0E6", "yellow": "#F7EFD7", "red": "#F6E5DF"}

FONTS = open(os.path.join(SRC, "assets", "fonts", "fonts.css"), encoding="utf-8").read().replace(
    "url('fonts/", "url('file://" + os.path.join(SRC, "assets", "fonts") + "/")

def monogram(cream=False):
    f = "mm-monogram-cream.svg" if cream else "mm-monogram.svg"
    s = open(os.path.join(SRC, "assets", f), encoding="utf-8").read()
    s = re.sub(r"<metadata>.*?</metadata>", "", s, flags=re.S)
    return re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)

def lockup(cream=False):
    """The MM monogram over the address, as on the site."""
    return (f'<div class="lockup">{monogram(cream)}'
            f'<span class="addr">project.org</span></div>')

def inline(t):
    """Copy is written with **bold** and *italic*; everything else is escaped."""
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def paras(items):
    if isinstance(items, str):
        items = [items]
    return "".join(f"<p>{inline(p)}</p>" for p in items)

# ── blocks ─────────────────────────────────────────────────────────────
# A document is a list of blocks: (kind, data). Each kind renders here.

def block(kind, d):
    if kind == "section":           # label, title?, body paragraphs
        t = f'<h3>{inline(d["title"])}</h3>' if d.get("title") else ""
        lone = "" if (d.get("body") or d.get("list")) else " lone"
        return (f'<section class="sec{lone}"><p class="label">{inline(d["label"])}</p>{t}'
                f'{paras(d.get("body", []))}{bullets(d.get("list"))}</section>')
    if kind == "chips":
        return '<div class="chips">' + "".join(f"<span>{inline(c)}</span>" for c in d) + "</div>"
    if kind == "levels":            # green/yellow/red activity summaries
        cells = "".join(
            f'<div class="lv" style="--lv:{LEVELS[k][2]}"><p class="lvname">{LEVELS[k][0]}'
            f'<span>{LEVELS[k][1]}</span></p>{paras(v)}</div>' for k, v in d.items())
        return f'<div class="levels">{cells}</div>'
    if kind == "connection":        # the Mini Museum connection box
        return (f'<aside class="conn"><p class="label">Mini Museum connection</p>{paras(d)}'
                f'<p class="url">{SITE}/exhibitions/in-their-hands</p></aside>')
    if kind == "verse":             # a scripture passage set apart
        return (f'<blockquote class="verse"><p>{inline(d["text"])}</p>'
                f'<cite>{inline(d["ref"])}</cite></blockquote>')
    if kind == "verses":            # several side by side
        return '<div class="verses">' + "".join(block("verse", v) for v in d) + "</div>"
    if kind == "refs":              # reference list: (term, gloss)
        return '<dl class="refs">' + "".join(
            f"<dt>{inline(a)}</dt><dd>{inline(b)}</dd>" for a, b in d) + "</dl>"
    if kind == "coin":              # a coin image beside its facts
        img = f'<img src="{d["img"]}" alt="">' if d.get("img") else ""
        return (f'<figure class="coin">{img}<figcaption><p class="label">{inline(d["label"])}</p>'
                f'<h4>{inline(d["title"])}</h4>{paras(d.get("body", []))}</figcaption></figure>')
    if kind == "coins":             # a row of coins, small; optionally labelled
        lab = ""
        if isinstance(d, dict):
            lab = f'<p class="label rowlab">{inline(d["label"])}</p>'; d = d["items"]
        return lab + f'<div class="coinrow" style="--n:{len(d)}">' + "".join(
            f'<figure><img src="{c["img"]}" alt=""><figcaption>{inline(c["cap"])}</figcaption></figure>'
            for c in d) + "</div>"
    if kind == "task":              # a student activity: label, prompt, answer space
        lines = d.get("lines", 0)
        box = write(lines) if lines else ""
        late = ("draw", "coindraw")
        extra = "".join(block(k, v) for k, v in d.get("blocks", []) if k not in late)
        box += "".join(block(k, v) for k, v in d.get("blocks", []) if k in late)
        m = re.match(r"Part (\d+)", d["label"])
        num = f'<span class="pnum">{int(m.group(1)):02d}</span>' if m else ""
        return (f'<section class="task{" numbered" if m else ""}">{num}<div><p class="label">{inline(d["label"])}</p>'
                f'<h3>{inline(d["title"])}</h3>{extra}{paras(d.get("body", []))}{box}</div></section>')
    if kind == "table":             # rows to fill in: header, rows, blank columns
        head = "".join(f"<th>{inline(h)}</th>" for h in d["head"])
        rows = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in d["rows"])
        return f'<table class="fill"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'
    if kind == "draw":
        return f'<div class="drawbox"><span>{inline(d)}</span></div>'
    if kind == "prayer":
        return f'<aside class="prayer"><p class="label">Prayer</p>{paras(d)}</aside>'
    if kind == "family":
        return f'<aside class="family"><p class="label">Share with your family</p>{paras(d)}</aside>'
    if kind == "cols":              # two columns of blocks
        return '<div class="cols">' + "".join(
            "<div>" + "".join(block(k, v) for k, v in col) + "</div>" for col in d) + "</div>"
    if kind == "specimen":          # the coin as a museum label
        stamp = '<span class="stamp">Replica</span>' if d.get("replica") else ""
        facts = "".join(f"<dt>{inline(a)}</dt><dd>{inline(b)}</dd>" for a, b in d["facts"])
        return (f'<figure class="specimen"><div class="spimg"><img src="{d["img"]}" alt="">{stamp}</div>'
                f'<figcaption><p class="label">{inline(d["label"])}</p><h4>{inline(d["title"])}</h4>'
                f'<dl>{facts}</dl>{paras(d.get("body", []))}</figcaption></figure>')
    if kind == "coindraw":          # draw inside a coin
        return f'<div class="coindraw"><div><span>{inline(d)}</span></div></div>'
    if kind == "timing":            # the lesson's minutes as a bar
        tot = sum(m for _, m, _ in d)
        segs = "".join(f'<div style="flex:{m};--c:{c}"><b>{m} min</b><span>{inline(n)}</span></div>' for n, m, c in d)
        return f'<div class="timing"><p class="label">The {tot} minutes</p><div class="bar">{segs}</div></div>'
    if kind == "gallery":           # coins on a dark ground, by row
        rows = ""
        for r in d:
            rows += (f'<p class="glab">{inline(r["label"])}</p><div class="grow" style="--n:{len(r["items"])}">'
                     + "".join(f'<figure><img src="{c["img"]}" alt=""><figcaption>{inline(c["cap"])}</figcaption></figure>' for c in r["items"])
                     + "</div>")
        return f'<div class="gallery">{rows}</div>'
    if kind == "cards":             # numbered idea cards, two across
        return '<div class="cards">' + "".join(
            f'<div class="card"><span class="cn">{i:02d}</span><h4>{inline(t)}</h4>{paras(b)}</div>'
            for i, (t, b) in enumerate(d, 1)) + "</div>"
    if kind == "lines":
        return write(d)
    if kind == "pagebreak":
        return '<div class="pb"></div>'
    if kind == "html":
        return d
    raise ValueError(kind)

def write(n):
    """Writing lines as real rules: a background gradient drops out of
       print inside a grid column."""
    return '<div class="write">' + "<i></i>" * n + "</div>"

def bullets(items):
    if not items:
        return ""
    return "<ul>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ul>"

# ── page ───────────────────────────────────────────────────────────────

CSS = """
@page { size: letter; margin: 0.5in 0.6in 0.7in;
  @bottom-left { font: 300 7pt 'Outfit'; color: #5F6655; letter-spacing: .03em; }
  @bottom-right { content: "Page " counter(page) " of " counter(pages); font: 300 7.5pt 'Outfit'; color: #5F6655; letter-spacing: .04em; }
}
* { box-sizing: border-box; font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'calt' 0, 'clig' 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 300 9.8pt/1.5 'Outfit', sans-serif; color: #1d1c1a; --gold-text: #86671A; --gold-big: #A2802A; --line: 20pt; }
body.student { font-size: 10.6pt; --line: 23pt; }
body.student .label { font-size: 8pt; }
b { font-weight: 500; } i { font-style: italic; }
p { margin: 0 0 6pt; }
.mast { display: grid; grid-template-columns: auto 1fr; gap: 18pt; align-items: end;
  padding-bottom: 12pt; border-bottom: 1.2pt solid var(--accent); margin-bottom: 14pt; }
.lockup { display: grid; justify-items: center; gap: 3pt; }
.lockup svg { width: 34pt; height: auto; display: block; }
.hero .lockup svg { width: 26pt; }
.lockup .addr { font: 400 6pt 'Outfit'; letter-spacing: .32em; text-transform: lowercase; color: #1d1c1a; margin-right: -.32em; }
.eyebrow { font: 500 7.5pt 'Outfit'; letter-spacing: .3em; text-transform: uppercase; color: var(--gold-text); margin: 0 0 3pt; }
h1 { font: 500 27pt/1.05 'Cormorant Garamond', serif; margin: 0 0 4pt; letter-spacing: -.01em; }
.sub { font: 300 9pt 'Outfit'; color: #5b5a55; margin: 0; letter-spacing: .02em; }
.chips { display: flex; flex-wrap: wrap; gap: 5pt; margin: 0 0 12pt; }
.chips span { font: 400 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase;
  border: .8pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 9pt; }
.label { font: 500 7.5pt 'Outfit'; letter-spacing: .24em; text-transform: uppercase; color: var(--gold-text); margin: 0 0 3pt; }
h3 { font: 600 13.5pt/1.15 'Cormorant Garamond', serif; margin: 0 0 4pt; }
h4 { font: 600 12pt/1.15 'Cormorant Garamond', serif; margin: 0 0 3pt; }
.sec { margin: 0 0 10pt; break-inside: avoid; }
.sec.lone { break-after: avoid; margin-bottom: 4pt; }
.task { margin: 0 0 9pt; }
body.student .hero { height: 2.0in; }
body.student .ticket { margin-bottom: 10pt; }
body.student .context { margin-bottom: 10pt; }
.task h3, .task .label { break-after: avoid; }
.write, .verse, table.fill, .coindraw { break-inside: avoid; }
ul { margin: 2pt 0 6pt; padding-left: 13pt; } li { margin: 0 0 2.5pt; }
.levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 11pt; break-inside: avoid; }
.lv { border-top: 3pt solid var(--lv); padding: 6pt 0 0; font-size: 8.8pt; }
.lvname { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--lv); margin: 0 0 4pt; }
.lvname span { display: block; color: #5F6655; font-weight: 300; letter-spacing: .1em; }
.conn { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 7pt 10pt 4pt; margin: 4pt 0 9pt; break-inside: avoid; }
.conn .url { font: 400 7.5pt 'Outfit'; letter-spacing: .1em; color: #5F6655; }
.verse { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.verse p { font: italic 400 11.5pt/1.35 'Cormorant Garamond', serif; margin: 0 0 2pt; }
.verse cite { font: 400 7.5pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; font-style: normal; color: #5F6655; }
.verses { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
.refs { display: grid; grid-template-columns: max-content 1fr; gap: 3pt 11pt; margin: 2pt 0 6pt; }
.refs dt { font-weight: 500; } .refs dd { margin: 0; }
.coin { display: grid; grid-template-columns: 92pt 1fr; gap: 12pt; align-items: center; margin: 2pt 0 11pt; break-inside: avoid; }
.coin img { width: 92pt; height: 92pt; object-fit: contain; }
.coin figcaption p:last-child { margin-bottom: 0; }
.coinrow { display: grid; grid-template-columns: repeat(var(--n, 3), 1fr); gap: 10pt; margin: 4pt 0 10pt; break-inside: avoid; }
.coinrow figure { margin: 0; text-align: center; }
.coinrow img { width: 62pt; height: 62pt; object-fit: contain; }
.rowlab { margin-top: 6pt; border-bottom: .6pt solid #d8d4c8; padding-bottom: 3pt; }
.coinrow figcaption { font: 400 8pt/1.3 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
.write { margin: 4pt 0 2pt; }
.write i { display: block; height: var(--line); border-bottom: .8pt solid #a9a69b; }
.drawbox { border: .8pt dashed #a9a69b; border-radius: 4pt; height: 130pt; margin: 4pt 0 6pt; position: relative; }
.drawbox span { position: absolute; left: 8pt; top: 6pt; font: 400 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #7c796f; }
table.fill { width: 100%; border-collapse: collapse; margin: 4pt 0 6pt; font-size: 8.8pt; break-inside: avoid; }
table.fill th { font: 500 7.5pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-text); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.fill td { border-bottom: .6pt solid #c8c5bb; padding: 5pt 6pt 11pt 0; vertical-align: top; }
table.fill td:first-child { width: 42%; }
.levelband { display: flex; justify-content: space-between; align-items: baseline;
  border-top: 3pt solid var(--lv); padding-top: 6pt; margin: 0 0 10pt; }
.levelband .lvname { margin: 0; }
.namebar { display: grid; grid-template-columns: 2.2fr 1fr 1fr; gap: 14pt; margin: 0 0 12pt; font: 400 8pt 'Outfit'; color: #5b5a55; }
.namebar span { border-bottom: .8pt solid #8d8a80; padding-bottom: 12pt; }
.context { background: #f6f1e4; padding: 9pt 11pt 4pt; margin: 0 0 12pt; }
.prayer, .family { border-top: .8pt solid #c8c5bb; padding-top: 8pt; margin-top: 8pt; break-inside: avoid; }
.prayer p:not(.label) { font: italic 400 11pt/1.4 'Cormorant Garamond', serif; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; }
.pb { break-after: page; }
/* ── the livelier layer ── */
.hero { position: relative; height: 2.3in; margin: 0 0 13pt; overflow: hidden; color: #f6f1e4; border-radius: 6pt; }
.hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hshade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,12,10,.7) 0%, rgba(14,12,10,.15) 34%, rgba(14,12,10,.25) 50%, rgba(14,12,10,.92) 100%); }
.htop { position: absolute; top: 14pt; left: 18pt; right: 16pt; display: flex; justify-content: space-between; align-items: flex-start; }
.hero .lockup .addr { color: #fff8e8; font-size: 6.5pt; font-weight: 500; text-shadow: 0 0 4pt rgba(0,0,0,.9); }
.htext { position: absolute; left: 18pt; right: 18pt; bottom: 15pt; }
.hero .eyebrow { color: #f3dc9a; margin: 0; background: rgba(14,12,10,.78); padding: 4pt 8pt 3pt; border-radius: 3pt; }
.hbrand { display: flex; gap: 11pt; align-items: center; }
.hero h1 { font-size: 34pt; color: #fff8e8; margin-bottom: 5pt; text-shadow: 0 1pt 10pt rgba(0,0,0,.35); }
.hero .sub { color: #f4efe2; font-size: 9.5pt; font-weight: 400; }
.credit { position: absolute; right: 10pt; top: auto; bottom: 5pt; font: 400 6.5pt 'Outfit'; background: rgba(14,12,10,.7); padding: 2pt 5pt; border-radius: 2pt; letter-spacing: .08em; color: rgba(246,241,228,.7); margin: 0; }
.badge { font: 500 8pt 'Outfit'; letter-spacing: .2em; text-transform: uppercase; background: var(--lv); color: #fff;
  padding: 6pt 12pt 5pt; border-radius: 99pt; text-align: center; line-height: 1.2; }
.badge small { display: block; font-weight: 300; font-size: 6.5pt; letter-spacing: .16em; opacity: .9; }
.mast .badge { align-self: start; }
.mast { grid-template-columns: auto 1fr auto; }
.ticket { display: grid; grid-template-columns: 40pt 1fr; border: 1pt solid #1d1c1a; border-radius: 6pt; margin: 0 0 14pt; overflow: hidden; }
.stub { background: var(--accent); border-right: 1.2pt dashed #1d1c1a; display: grid; place-items: center; }
.stub span { writing-mode: vertical-rl; transform: rotate(180deg); font: 500 7pt 'Outfit'; letter-spacing: .3em; text-transform: uppercase; color: #1d1c1a; }
.tfields { display: grid; grid-template-columns: 2.2fr 1fr 1fr; gap: 14pt; padding: 9pt 12pt 6pt; font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #3f3e3a; }
.tfields span { border-bottom: .8pt solid #8d8a80; padding-bottom: 14pt; }
.task.numbered { display: grid; grid-template-columns: 34pt 1fr; gap: 8pt; }
.pnum { font: 500 26pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.specimen { display: grid; grid-template-columns: 118pt 1fr; gap: 14pt; align-items: center; background: #f6f1e4;
  border: 1pt solid #1d1c1a; padding: 9pt 14pt; margin: 4pt 0 9pt; break-inside: avoid; }
.spimg { position: relative; }
.spimg img { width: 118pt; height: 118pt; object-fit: contain; filter: drop-shadow(0 4pt 6pt rgba(0,0,0,.28)); }
.stamp { position: absolute; right: -6pt; bottom: 8pt; transform: rotate(-12deg); border: 1.6pt solid #A8452F; color: #A8452F;
  font: 500 9pt 'Outfit'; letter-spacing: .28em; text-transform: uppercase; padding: 3pt 7pt 2pt; border-radius: 3pt; background: rgba(246,241,228,.75); }
.specimen dl { display: grid; grid-template-columns: max-content 1fr; gap: 1pt 10pt; margin: 4pt 0 6pt; font-size: 8.5pt; }
.specimen dt { font: 500 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; color: #5F6655; padding-top: 2pt; }
.specimen dd { margin: 0; }
.coindraw { display: grid; place-items: center; margin: 6pt 0 8pt; }
.coindraw > div { width: 122pt; height: 122pt; border-radius: 50%; border: 2pt solid #b9a46a;
  box-shadow: inset 0 0 0 7pt #f6f1e4, inset 0 0 0 8pt #b9a46a; display: grid; place-items: end center; }
.coindraw span { font: 500 7pt 'Outfit'; letter-spacing: .22em; text-transform: uppercase; color: #86671A; padding-bottom: 16pt; }
.timing { margin: 0 0 13pt; }
.timing .bar { display: flex; gap: 2pt; }
.timing .bar > div { background: var(--c); color: #fff; padding: 6pt 7pt 5pt; border-radius: 3pt; }
.timing b { display: block; font: 500 10pt 'Outfit'; } .timing span { font: 400 7.5pt 'Outfit'; letter-spacing: .12em; text-transform: uppercase; }
.gallery { background: #14120f; color: #e9e2cf; margin: 6pt 0 14pt; padding: 12pt 16pt 8pt; border-radius: 6pt; break-inside: avoid; }
.glab { font: 500 6.5pt 'Outfit'; letter-spacing: .28em; text-transform: uppercase; color: #e3c46f; margin: 4pt 0 6pt; }
.grow { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 8pt; margin-bottom: 6pt; }
.grow figure { margin: 0; text-align: center; }
.grow img { width: 64pt; height: 64pt; object-fit: contain; filter: drop-shadow(0 3pt 8pt rgba(0,0,0,.6)); }
.grow figcaption { font: 400 7.5pt/1.3 'Outfit'; color: #e4dcc7; margin-top: 3pt; }
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 9pt; margin: 4pt 0 12pt; }
.card { background: #f6f1e4; border-top: 3pt solid var(--accent); padding: 8pt 10pt 4pt; break-inside: avoid; }
.cn { font: 500 20pt/1 'Cormorant Garamond', serif; color: var(--gold-big); }
.card h4 { margin-top: 2pt; }
"""

def render(doc, accent="#C9A84C"):
    level = doc.get("level")
    band, badge = "", ""
    if level:
        name, sub, col = LEVELS[level]
        badge = f'<span class="badge" style="--lv:{col}">{name}<small>{sub}</small></span>'
        band = ('<div class="ticket"><div class="stub"><span>Admit one</span></div>'
                '<div class="tfields"><span>Name</span><span>Date</span><span>Class</span></div></div>')
    tint_css = ""
    if level:
        tint_css = (f"@page {{ background: {TINTS[level]}; }} html {{ background: {TINTS[level]}; }} "
                    ".context, .conn, .specimen, .ticket, .card {{ background: rgba(255,255,255,.72); }} "
                    ".coindraw > div {{ background: rgba(255,255,255,.55); }}")
    hero = doc.get("hero")
    if hero:
        head = (f'<header class="hero"><img src="{hero["img"]}" style="object-position:{hero.get("pos", "center")}" alt="">'
                f'<div class="hshade"></div><div class="htop"><div class="hbrand">{lockup(cream=True)}'
                f'<p class="eyebrow">{inline(doc["eyebrow"])}</p></div>{badge}</div>'
                f'<div class="htext"><h1>{inline(doc["title"])}</h1>'
                f'<p class="sub">{inline(doc["sub"])}</p></div>'
                + (f'<p class="credit">{inline(hero["credit"])}</p>' if hero.get("credit") else "") + '</header>')
    else:
        head = (f'<header class="mast">{lockup()}<div><p class="eyebrow">{inline(doc["eyebrow"])}</p>'
                f'<h1>{inline(doc["title"])}</h1><p class="sub">{inline(doc["sub"])}</p></div>{badge}</header>')
    context = f'<div class="context">{paras(doc["context"])}</div>' if doc.get("context") else ""
    body = "".join(block(k, v) for k, v in doc["blocks"])
    foot = f"The Mini Museum · In Their Hands · {doc['foot']}  ·  © {YEAR} The Mini Museum · Free for educational use"
    foot_css = "@page { @bottom-left { content: \"" + foot.replace("\\", "").replace('"', "'") + "\"; } }"
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(doc['title'])}</title>
<style>{FONTS}{CSS}{foot_css}{tint_css}</style></head><body class="{'student' if level else 'adult'}" style="--accent:{accent}">
{head}{band}{context}{body}</body></html>"""

def load(exhibition):
    docs = []
    folder = os.path.join(SRC, exhibition)
    for f in sorted(os.listdir(folder)):
        if f.endswith(".py") and not f.startswith("_"):
            spec = importlib.util.spec_from_file_location(f[:-3], os.path.join(folder, f))
            m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
            docs.extend(m.DOCS)
    return docs

def build(exhibition, match=None):
    out_root = os.path.join(ROOT, "public", "resources", exhibition)
    tmp = tempfile.mkdtemp()
    for doc in load(exhibition):
        if match and match.lower() not in doc["out"].lower():
            continue
        page = os.path.join(tmp, re.sub(r"\W+", "_", doc["out"]) + ".html")
        # images are referenced from public/, so the HTML resolves them there
        h = render(doc).replace('src="/', f'src="file://{ROOT}/public/')
        open(page, "w", encoding="utf-8").write(h)
        out = os.path.join(out_root, doc["out"])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                        "--allow-file-access-from-files", "--virtual-time-budget=8000",
                        f"--print-to-pdf={out}", "file://" + page],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("built", os.path.relpath(out, ROOT))

if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
