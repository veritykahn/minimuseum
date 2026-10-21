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

LEVELS = {
    "green":  ("Green Level",  "More Support",  "#5E8B5A"),
    "yellow": ("Yellow Level", "Grade Level",   "#C9A84C"),
    "red":    ("Red Level",    "Go Deeper",     "#A8452F"),
}

def monogram():
    s = open(os.path.join(SRC, "assets", "mm-monogram.svg"), encoding="utf-8").read()
    s = re.sub(r"<metadata>.*?</metadata>", "", s, flags=re.S)
    return re.sub(r'\s(width|height)="[^"]*"', "", s, count=2)

def lockup():
    """The MM monogram over the address, as on the site."""
    return (f'<div class="lockup">{monogram()}'
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
        return (f'<section class="sec"><p class="label">{inline(d["label"])}</p>{t}'
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
        box = f'<div class="write" style="--n:{lines}"></div>' if lines else ""
        extra = "".join(block(k, v) for k, v in d.get("blocks", []) if k != "draw")
        box += "".join(block(k, v) for k, v in d.get("blocks", []) if k == "draw")
        return (f'<section class="task"><p class="label">{inline(d["label"])}</p>'
                f'<h3>{inline(d["title"])}</h3>{extra}{paras(d.get("body", []))}{box}</section>')
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
    if kind == "pagebreak":
        return '<div class="pb"></div>'
    if kind == "html":
        return d
    raise ValueError(kind)

def bullets(items):
    if not items:
        return ""
    return "<ul>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ul>"

# ── page ───────────────────────────────────────────────────────────────

CSS = """
@page { size: letter; margin: 0.6in 0.65in 0.75in;
  @bottom-left { font: 300 7pt 'Outfit'; color: #7D8471; letter-spacing: .03em; }
  @bottom-right { content: "Page " counter(page) " of " counter(pages); font: 300 7.5pt 'Outfit'; color: #7D8471; letter-spacing: .04em; }
}
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 300 9.6pt/1.5 'Outfit', sans-serif; color: #1d1c1a; }
b { font-weight: 500; } i { font-style: italic; }
p { margin: 0 0 6pt; }
.mast { display: grid; grid-template-columns: auto 1fr; gap: 18pt; align-items: end;
  padding-bottom: 12pt; border-bottom: 1.2pt solid var(--accent); margin-bottom: 14pt; }
.lockup { display: grid; justify-items: center; gap: 3pt; }
.lockup svg { width: 34pt; height: auto; display: block; }
.lockup .addr { font: 400 6pt 'Outfit'; letter-spacing: .32em; text-transform: lowercase; color: #1d1c1a; margin-right: -.32em; }
.eyebrow { font: 400 7.5pt 'Outfit'; letter-spacing: .3em; text-transform: uppercase; color: var(--accent); margin: 0 0 3pt; }
h1 { font: 500 27pt/1.05 'Cormorant Garamond', serif; margin: 0 0 4pt; letter-spacing: -.01em; }
.sub { font: 300 9pt 'Outfit'; color: #5b5a55; margin: 0; letter-spacing: .02em; }
.chips { display: flex; flex-wrap: wrap; gap: 5pt; margin: 0 0 12pt; }
.chips span { font: 400 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase;
  border: .8pt solid #1d1c1a; border-radius: 99pt; padding: 3pt 9pt; }
.label { font: 500 7pt 'Outfit'; letter-spacing: .26em; text-transform: uppercase; color: var(--accent); margin: 0 0 3pt; }
h3 { font: 600 13.5pt/1.15 'Cormorant Garamond', serif; margin: 0 0 4pt; }
h4 { font: 600 12pt/1.15 'Cormorant Garamond', serif; margin: 0 0 3pt; }
.sec, .task { margin: 0 0 11pt; break-inside: avoid; }
ul { margin: 2pt 0 6pt; padding-left: 13pt; } li { margin: 0 0 2.5pt; }
.levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 11pt; break-inside: avoid; }
.lv { border-top: 3pt solid var(--lv); padding: 6pt 0 0; font-size: 8.8pt; }
.lvname { font: 500 7.5pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--lv); margin: 0 0 4pt; }
.lvname span { display: block; color: #7D8471; font-weight: 300; letter-spacing: .1em; }
.conn { background: #f6f1e4; border-left: 3pt solid var(--accent); padding: 9pt 11pt 6pt; margin: 4pt 0 11pt; break-inside: avoid; }
.conn .url { font: 400 7.5pt 'Outfit'; letter-spacing: .1em; color: #7D8471; }
.verse { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.verse p { font: italic 400 11.5pt/1.35 'Cormorant Garamond', serif; margin: 0 0 2pt; }
.verse cite { font: 400 7pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; font-style: normal; color: #7D8471; }
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
.coinrow figcaption { font: 400 7.5pt/1.3 'Outfit'; color: #5b5a55; margin-top: 3pt; }
.write { height: calc(var(--n) * 19pt); margin: 4pt 0 2pt;
  background: repeating-linear-gradient(to bottom, transparent 0 18.2pt, #b9b6ab 18.2pt 19pt); }
.drawbox { border: .8pt dashed #a9a69b; border-radius: 4pt; height: 130pt; margin: 4pt 0 6pt; position: relative; }
.drawbox span { position: absolute; left: 8pt; top: 6pt; font: 400 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #a9a69b; }
table.fill { width: 100%; border-collapse: collapse; margin: 4pt 0 6pt; font-size: 8.8pt; break-inside: avoid; }
table.fill th { font: 500 7pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.fill td { border-bottom: .6pt solid #c8c5bb; padding: 6pt 6pt 14pt 0; vertical-align: top; }
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
"""

def render(doc, accent="#C9A84C"):
    level = doc.get("level")
    band = ""
    if level:
        name, sub, col = LEVELS[level]
        band = (f'<div class="levelband" style="--lv:{col}"><p class="lvname">{name}<span>{sub}</span></p></div>'
                '<div class="namebar"><span>Name</span><span>Date</span><span>Class</span></div>')
    context = f'<div class="context">{paras(doc["context"])}</div>' if doc.get("context") else ""
    body = "".join(block(k, v) for k, v in doc["blocks"])
    foot = f"The Mini Museum · In Their Hands · {doc['foot']}  ·  © {YEAR} The Mini Museum · Free for educational use"
    foot_css = "@page { @bottom-left { content: \"" + foot.replace("\\", "").replace('"', "'") + "\"; } }"
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(doc['title'])}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
<style>{CSS}{foot_css}</style></head><body style="--accent:{accent}">
<header class="mast">{lockup()}<div><p class="eyebrow">{inline(doc['eyebrow'])}</p>
<h1>{inline(doc['title'])}</h1><p class="sub">{inline(doc['sub'])}</p></div></header>
{band}{context}{body}</body></html>"""

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
