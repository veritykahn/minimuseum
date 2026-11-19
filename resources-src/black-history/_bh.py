"""Shared by the Black History Month resource set (resources-src/black-history/).
The file starts with "_", so build.py and export_lessons.py do not load it as a
document module; each lesson module imports it.

Every fact here is the exhibition's own:
  app/exhibitions/black-history/blackHistory.ts          the two posters, word for word,
                                                          the display case and the rooms
  app/exhibitions/black-history/timeline/timelineStops.ts the Black Barbie Timeline and its
                                                          three owner-approved museum notes
  app/exhibitions/black-history/representation/representationText.ts
                                                          the Doll Test's checked facts, the
                                                          book survey and the CCBC's 2025 figures
  app/exhibitions/black-history/representation/dollArt.ts the Design a doll choices

Pictures. The PDFs print only JPEG and PNG (resources-src/print-images.mjs), so
the printed pages use poster 1 (poster1.jpg) and drawings made here; the
classroom screens also use the rooms, the ring and the vignettes (WebP).
Poster 2's Mattel photograph is never cropped or printed (the owner's
decision in blackHistory.ts): poster 2 appears only whole, on screen, as the
exhibition's landing page shows it."""

import html, re

BH = "/exhibitions/black-history/"
POSTER1 = BH + "poster1.jpg"
POSTER2 = BH + "poster2.jpg"
RING = BH + "ring.webp"
ROOM_TIMELINE = BH + "rooms/timeline.webp"
ROOM_REP = BH + "rooms/representation.webp"
VIG = BH + "vignettes/"
HAIR = BH + "dolls/thumbs/hair/"

# Poster 1 is the exhibition's own design-tool artwork; the posters credit no artist.
HERO_RING = {"img": POSTER1, "pos": "center 3%"}
# The hero shows the top row of poster 1's ring of vignettes, set a little
# larger so the poster's own lettering and QR code stay out of the frame.
HERO_CSS = ".hero > img { transform: scale(1.42); transform-origin: 50% 0; }"

# ── the posters, word for word (blackHistory.ts) ───────────────────────
P1 = {
  "woodson": "Carter G. Woodson played a crucial role in bringing Black history to national attention by creating Negro History Week in 1926, which later became Black History Month.",
  "historian": "A Harvard-trained historian, Woodson believed that African American history should not be confined to academics but serve as a tool for racial uplift.",
  "association": "His organization, the Association for the Study of Negro Life and History, worked to make Black history widely accessible.",
  "february": "Inspired by the cultural awakening of the Harlem Renaissance, Woodson established this week to educate schoolchildren and highlight Black contributions to American society, choosing February to align with the birthdays of Abraham Lincoln and Frederick Douglass.",
  "claim": "Despite significant progress in race relations, Black History Month remains a vital tool for transformation.",
  "reminder": "It serves as a reminder of the struggles and achievements of African Americans, countering historical amnesia and ensuring that crucial aspects of history, like slavery and the fight for civil rights, are not forgotten.",
  "surveys": "Surveys reveal a concerning lack of awareness about slavery's impact, even among African Americans.",
  "bridge": "By fostering discussion and reflection, Black History Month can bridge these gaps, inspire a deeper connection to the past, and promote an understanding of the resilience and contributions of Black individuals throughout history.",
  "preserve": "Beyond education, Black History Month reinforces the importance of preserving African American culture and heritage.",
  "sites": "From safeguarding historical sites to encouraging donations of artifacts to museums, cultural preservation ensures that Black history is recognized and valued.",
  "honor": "Additionally, the celebration provides inspiration by honoring figures like Martin Luther King Jr., Harriet Tubman, and Langston Hughes.",
  "future": "As society evolves, Black History Month continues to be relevant, reminding all Americans that understanding the past is essential for shaping a more just and inclusive future.",
}
P2 = {
  "first": "The first Black Barbie doll, introduced by Mattel in 1980, marked a significant milestone in toy manufacturing and cultural representation.",
  "earlier": "While Mattel had previously created two Black dolls—Christie in 1968 and Francie in 1967—these earlier efforts were problematic.",
  "christie": "Christie was presented as part of Barbie's friend group, while Francie was essentially a white doll design with darker skin.",
  "perkins": "The first Black Barbie, however, was a groundbreaking creation designed by Kitty Black Perkins, a trailblazing Black fashion designer at Mattel.",
  "features": "This doll broke away from past missteps, featuring Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.",
  "criticism": "Its launch addressed decades of criticism about the lack of diversity in toys and the harmful effects of Eurocentric beauty standards perpetuated by the original Barbie.",
  "step": "The introduction of the first Black Barbie was a monumental step toward inclusivity, offering Black children a doll that reflected their identity and celebrated their cultural heritage.",
  "challenged": "It challenged conventional beauty standards empowering children to embrace their natural features.",
  "symbol": "Beyond its immediate impact, Black Barbie became a symbol of progress, inspiring further diversification in the toy industry.",
  "range": "Over the years, Mattel expanded its range to include dolls with diverse skin tones, facial features, hairstyles, and cultural identities.",
  "success": "The success of Black Barbie paved the way for initiatives like the AKA Centennial Barbie (2008) and the \"So In Style\" line (2009), which highlighted authentic Black features and realistic hair textures.",
  "legacy": "Each new iteration built on the legacy of Christie, Francie, and the first Black Barbie, pushing for greater authenticity and representation.",
  "today": "Today, Black Barbie is both a cherished collector's item and a symbol of the ongoing journey toward equality and representation in media and consumer products.",
}

def curly(t):
    """The posters' straight quotes and apostrophes, set as the plans set them."""
    t = re.sub(r'"([^"]+)"', "“\\1”", t)
    return t.replace("'", "’")

P1 = {k: curly(v) for k, v in P1.items()}
P2 = {k: curly(v) for k, v in P2.items()}

# The three museum notes on the timeline (owner-approved, each with its source there).
NOTE_WORLD = "Barbie’s Dolls of the World series included a Nigerian Barbie (about 1990) and a Ghanaian Barbie (1996). Boxed editions of both are in our display case."
NOTE_SHANI = "Shani, designed by Kitty Black Perkins, was Mattel’s first line of Black fashion dolls launched separately from the Barbie line."
NOTE_WOMEN = "Barbie’s Inspiring Women series honored Ida B. Wells (2022), Madam C. J. Walker (2022) and Bessie Coleman (2023). All three dolls are in our display case."

# The Black Barbie Timeline's stops: (year as set, name, what it was, source).
# "Poster" stops quote poster 2; "Museum note" stops are the room's added notes.
TIMELINE = [
  ("1967", "Francie", "One of Mattel’s two earlier Black dolls: “essentially a white doll design with darker skin”", "Poster"),
  ("1968", "Christie", "The other earlier Black doll: “presented as part of Barbie’s friend group”", "Poster"),
  ("1980", "The first Black Barbie", "Designed by Kitty Black Perkins: Afrocentric facial features, natural hairstyles, a glamorous design", "Poster"),
  ("c. 1990", "Dolls of the World", "A Nigerian Barbie (about 1990) and a Ghanaian Barbie (1996); boxed editions of both are in the display case", "Museum note"),
  ("1991", "Shani", "Designed by Kitty Black Perkins: Mattel’s first line of Black fashion dolls launched separately from the Barbie line", "Museum note"),
  ("2008–09", "AKA Centennial Barbie and “So In Style”", "Authentic Black features and realistic hair textures", "Poster"),
  ("2022–23", "Inspiring Women", "Dolls honoring Ida B. Wells, Madam C. J. Walker and Bessie Coleman; all three are in the display case", "Museum note"),
  ("Today", "Today", "“A cherished collector’s item and a symbol of the ongoing journey toward equality and representation”", "Poster"),
]

# The Doll Test, in the room's own checked wording (representationText.ts).
DT = {
  "segregation": "In each of the Brown cases, Black children had been denied admission to schools attended by white children, under laws “requiring or permitting segregation according to race.” The cases came from Kansas, South Carolina, Virginia and Delaware.",
  "clarks": "In the 1940s, psychologists Kenneth and Mamie Phipps Clark designed and conducted a series of experiments known as “the doll tests,” to study the psychological effects of segregation on African-American children.",
  "dolls": "They used four plastic, diaper-clad dolls, identical except for color, and showed them to Black children between the ages of three and seven.",
  "asked": "The Clarks asked the children questions such as which dolls were “nice” and which were “bad,” and which doll was most like them.",
  "answers": "Almost all of the children readily identified the race of the dolls. A majority of the children preferred the white doll and assigned positive characteristics to it.",
  "drawings": "The Clarks also gave the children outline drawings of a boy and girl and asked them to color the figures the same color as themselves. Many of the children with dark complexions colored the figures with a white or yellow crayon.",
  "conclusion": "The Clarks concluded that “prejudice, discrimination, and segregation” created a feeling of inferiority among African-American children and damaged their self-esteem.",
  "clarendon": "In preparation for one of the cases, Briggs v. Elliott, Thurgood Marshall asked Kenneth and Mamie Clark to repeat their experiments with school children from Clarendon County, South Carolina.",
  "court": "Kenneth Clark became the NAACP Legal Defense Fund’s principal expert witness, and testified in the Briggs, Davis and Delaware cases. The doll test was only one part of his testimony.",
  "decision": "The Supreme Court announced its unanimous decision in Brown v. Board of Education on May 17, 1954: school segregation violated the Fourteenth Amendment.",
  "unequal": "The Court wrote: “in the field of public education, the doctrine of ‘separate but equal’ has no place. Separate educational facilities are inherently unequal.”",
  "footnote": "The decision’s footnote 11 cites Kenneth Clark’s 1950 paper, “Effect of Prejudice and Discrimination on Personality Development,” written for the Midcentury White House Conference on Children and Youth.",
  "words": "The Court wrote that separating children “from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone.”",
  "symbol": "Because of their impact on the Court’s decision, the doll tests have become a symbol of the Brown case.",
}
COURT_LINE = "Separate educational facilities are inherently unequal."

# The Cooperative Children’s Book Center's 2025 figures, as the room gives them; no further arithmetic.
CCBC = "Of the 3,638 children’s and young adult books published in 2025 that the Cooperative Children’s Book Center received, 491 (13.5%) were about Black/African people, and 398 (10.9%) were by Black/African authors or illustrators."
SURVEY_BACKGROUNDS = ["Black/African", "Indigenous", "Asian", "Latine", "Pacific Islander", "Arab", "White",
                      "More than one", "Animal or not a person", "Can’t tell"]

# ── shared wording ──────────────────────────────────────────────────────
LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."
ROOM_DOLLTEST_CARE = ("Talk about the Doll Test, but don’t repeat it with your class, and don’t ask anyone to choose "
                      "between dolls or people by skin color. Let anyone pass; keep the talk on what the children had "
                      "been taught, never on the children themselves.")

def md(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def P(t, cls=""):
    c = f' class="{cls}"' if cls else ""
    return ("html", f"<p{c}>{md(t)}</p>")

def W(n):
    return '<div class="write">' + "<i></i>" * n + "</div>"

def item(img, caption, alt, sub=None, aspect=None):
    i = {"img": img, "caption": caption, "alt": alt}
    if sub:
        i["sub"] = sub
    if aspect:
        i["aspect"] = aspect
    return i

VIGNETTES = [
  item(VIG + "musician.webp", "A musician", "A circular vignette from poster 1: a musician, in red, orange and black"),
  item(VIG + "singer.webp", "A singer", "A circular vignette from poster 1: a singer’s hand and microphone stand, in black, white and red"),
  item(VIG + "worker.webp", "A worker", "A circular vignette from poster 1: a worker in a green cap and uniform"),
  item(VIG + "scientist.webp", "A scientist", "A circular vignette from poster 1: a scientist at a microscope"),
  item(VIG + "notes.webp", "Music", "A circular vignette from poster 1: a music note on red and orange"),
  item(VIG + "atom.webp", "Science", "A circular vignette from poster 1: an atom’s orbits on orange and green"),
]
POSTER1_ALT = ("Poster 1, Black History Month, on an acid lime ground: a ring of circular illustrated vignettes — a musician, "
               "a singer at a microphone, a worker in a cap and a scientist at a microscope, music notes and an atom — around "
               "a black shape lettered Black History Month, above three paragraphs of text")
POSTER2_ALT = ("Poster 2, The Importance of Black Barbie, on a bubblegum pink ground: a ring of circles over a photograph of "
               "Black Barbie dolls dressed in red, the title in a chunky dark brown 1970s script, and two paragraphs of text")
ROOM_TIMELINE_ALT = "The Black Barbie Timeline room: 1967 and Francie in a ringed circle on the lime ground, a right guess, and the years still to find along a road below"
ROOM_REP_ALT = "The Who Do You See? room: a doll being designed on a pink card, with choices of hair, face and skin tone"

# Natural hairstyles from the Design a doll tab, as its own thumbnails (dollArt.ts labels).
HAIRSTYLES = [
  item(HAIR + "W-hair-afro-black.webp", "Afro", "An Afro hairstyle from the Design a doll tab"),
  item(HAIR + "W-hair-puffs-black.webp", "Afro puffs", "Afro puffs from the Design a doll tab"),
  item(HAIR + "W-hair-bantu-black.webp", "Bantu knots", "Bantu knots from the Design a doll tab"),
  item(HAIR + "W-hair-braids-black.webp", "Box braids", "Box braids from the Design a doll tab"),
  item(HAIR + "M-hair-cornrows-black.webp", "Cornrows", "Cornrows from the Design a doll tab"),
  item(HAIR + "W-hair-locs-black.webp", "Locs", "Locs from the Design a doll tab"),
  item(HAIR + "W-hair-twists-black.webp", "Twists", "Twists from the Design a doll tab"),
]

# ── drawn dolls, for print (SVG: prints sharp, and needs no picture file) ──
# Skin and hair colors are the Design a doll tab's own swatches (dollArt.ts).
SKIN = {"t1": "#46322e", "t2": "#764838", "t3": "#bf7e5a", "t4": "#cd8f5f", "t5": "#c5855c",
        "t6": "#deb185", "t7": "#e7af8f", "t8": "#e8c4be"}
HAIRC = {"black": "#272524", "darkbrown": "#443326", "chestnut": "#4e2a1c", "auburn": "#713f28",
         "red": "#964a28", "blonde": "#a97d46", "grey": "#83827f"}
INK = "#1d1c1a"

def doll(skin=None, hair="afro", hair_color="black", dress="#E8372C", glasses=False, h=150, face=True, bald=False):
    """A simple standing doll. With skin=None it is an outline to color in."""
    line = f'stroke="{INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"'
    sk = SKIN.get(skin, "#ffffff") if skin else "#ffffff"
    hc = HAIRC.get(hair_color, hair_color) if skin else "#ffffff"
    dr = dress if skin else "#ffffff"
    back, front = "", ""
    if not bald:
        if hair == "afro":
            back = f'<circle cx="50" cy="29" r="23" fill="{hc}" {line}/>'
        elif hair == "puffs":
            back = (f'<circle cx="31" cy="16" r="10" fill="{hc}" {line}/><circle cx="69" cy="16" r="10" fill="{hc}" {line}/>')
            front = f'<path d="M34 30 Q34 14 50 14 Q66 14 66 30 Q58 22 50 22 Q42 22 34 30Z" fill="{hc}" {line}/>'
        elif hair == "long":
            back = f'<path d="M32 30 Q32 12 50 12 Q68 12 68 30 L70 66 L30 66 Z" fill="{hc}" {line}/>'
            front = f'<path d="M34 30 Q34 14 50 14 Q66 14 66 30 Q58 22 50 22 Q42 22 34 30Z" fill="{hc}" {line}/>'
        elif hair == "braids":
            back = (f'<rect x="29" y="28" width="7" height="58" rx="3.5" fill="{hc}" {line}/>'
                    f'<rect x="64" y="28" width="7" height="58" rx="3.5" fill="{hc}" {line}/>')
            front = f'<path d="M33 31 Q33 13 50 13 Q67 13 67 31 Q59 21 50 21 Q41 21 33 31Z" fill="{hc}" {line}/>'
        elif hair == "short":
            front = f'<path d="M34 28 Q35 14 50 14 Q65 14 66 28 Q58 21 50 21 Q42 21 34 28Z" fill="{hc}" {line}/>'
        elif hair == "bun":
            back = f'<circle cx="50" cy="11" r="8" fill="{hc}" {line}/>'
            front = f'<path d="M34 30 Q34 15 50 15 Q66 15 66 30 Q58 22 50 22 Q42 22 34 30Z" fill="{hc}" {line}/>'
    body = (f'<rect x="41" y="88" width="7" height="44" rx="3" fill="{sk}" {line}/>'
            f'<rect x="52" y="88" width="7" height="44" rx="3" fill="{sk}" {line}/>'
            f'<ellipse cx="43" cy="134" rx="6" ry="3" fill="{INK}"/><ellipse cx="57" cy="134" rx="6" ry="3" fill="{INK}"/>'
            f'<rect x="-3.6" y="0" width="7.2" height="36" rx="3.6" fill="{sk}" {line} transform="translate(37 53) rotate(18)"/>'
            f'<rect x="-3.6" y="0" width="7.2" height="36" rx="3.6" fill="{sk}" {line} transform="translate(63 53) rotate(-18)"/>'
            f'<rect x="46" y="44" width="8" height="9" fill="{sk}" {line}/>'
            f'<path d="M37 52 Q50 48 63 52 L72 96 Q50 101 28 96 Z" fill="{dr}" {line}/>')
    head = f'<circle cx="50" cy="31" r="15" fill="{sk}" {line}/>'
    fc = ""
    if face:
        fc = (f'<circle cx="44.5" cy="31" r="1.6" fill="{INK}"/><circle cx="55.5" cy="31" r="1.6" fill="{INK}"/>'
              f'<path d="M45 37 Q50 41 55 37" fill="none" {line}/>')
    gl = ""
    if glasses:
        gl = (f'<circle cx="44.5" cy="31" r="4.6" fill="none" {line}/><circle cx="55.5" cy="31" r="4.6" fill="none" {line}/>'
              f'<path d="M49 31 L51 31" {line}/>')
    return (f'<svg viewBox="0 0 100 140" style="height:{h}pt;width:auto" xmlns="http://www.w3.org/2000/svg">'
            f'{back}{body}{head}{front}{fc}{gl}</svg>')

def swatches(keys=None, size=22):
    """The Design a doll tab's skin-tone swatches, as printed circles."""
    keys = keys or list(SKIN)
    return ('<div class="sw">' + "".join(
        f'<span style="background:{SKIN[k]};width:{size}pt;height:{size}pt"></span>' for k in keys) + "</div>")

DOLL_CSS = """
.dolls { display: flex; justify-content: center; align-items: flex-end; gap: 26pt; margin: 4pt 0 8pt; break-inside: avoid; }
.dolls figure { margin: 0; text-align: center; }
.dolls figcaption { font: 500 10pt 'Outfit'; margin-top: 2pt; }
.sw { display: flex; gap: 6pt; justify-content: center; margin: 4pt 0 8pt; }
.sw span { border-radius: 50%; border: .8pt solid #1d1c1a; display: block; }
"""

def dolls(items, caps=None):
    caps = caps or [None] * len(items)
    return ("html", '<div class="dolls">' + "".join(
        f'<figure>{d}' + (f'<figcaption>{md(c)}</figcaption>' if c else "") + "</figure>"
        for d, c in zip(items, caps)) + "</div>")

# ── the objectives block's look (the plans only; handouts print unchanged) ──
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
# the plan's sections may run on across a page, so no page ends half empty;
# the "Show your class" page starts a page of its own
FLOW_CSS = """
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
.pb { break-after: auto; break-before: page; }
"""
# the plan's Show-your-class chart
CHART_CSS = """
table.chart { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 4pt 0 10pt; break-inside: avoid; }
table.chart th { font: 500 7pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-text);
  text-align: left; padding: 0 6pt 4pt 0; border-bottom: 1pt solid var(--accent); }
table.chart td { border-bottom: .6pt solid #c8c5bb; padding: 4.5pt 8pt 4.5pt 0; vertical-align: top; }
table.chart td:first-child { font: 600 12pt/1.1 'Cormorant Garamond', serif; white-space: nowrap; width: 54pt; }
table.chart td:nth-child(2) { font-weight: 500; }
table.chart td.src { font: 500 6.8pt 'Outfit'; letter-spacing: .14em; text-transform: uppercase; color: #5F6655; white-space: nowrap; }
"""

def chart(head, rows, src_col=None):
    th = "".join(f"<th>{md(h)}</th>" for h in head)
    body = ""
    for r in rows:
        body += "<tr>" + "".join(
            f'<td{" class=src" if src_col is not None and i == src_col else ""}>{md(c)}</td>' for i, c in enumerate(r)) + "</tr>"
    return ("html", f'<table class="chart"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>')

# the timing bar's colors, as the model plans use them
C_HOOK, C_TEACH, C_ACT, C_CLOSE, C_LOOK = "#7D8471", "#2F4A5A", "#86671A", "#A8452F", "#4A7346"

# ── Grades 5–8 ─────────────────────────────────────────────────────────
# the Look back, as the teacher says it; the screen sets the questions out
LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
                 "a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask a Red Level reader.")
# four cards in one row, as the model plans set them
CARDS4_CSS = """
.cards { grid-template-columns: repeat(4, 1fr); gap: 7pt; }
.card { padding: 6pt 8pt 2pt; }
.card .cn { display: none; }
.card h4 { margin-top: 0; }
.card p { font-size: 8.6pt; line-height: 1.36; }
"""
# boxes joined by arrows: a chain of evidence or of cause and effect
CHAIN_CSS = """
.chain { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 14pt; margin: 6pt 0 10pt; break-inside: avoid; }
.chain div { position: relative; border: 1pt solid #1d1c1a; border-radius: 4pt; background: rgba(255,255,255,.65);
  padding: 6pt 7pt; min-height: 92pt; font: 400 8.6pt/1.32 'Outfit'; }
.chain div b { display: block; font: 600 11pt/1.1 'Cormorant Garamond', serif; margin-bottom: 3pt; }
.chain div + div::before { content: "→"; position: absolute; left: -13pt; top: 40%; font: 500 12pt 'Outfit'; }
.chain .blank { background: rgba(255,255,255,.9); border-style: dashed; }
"""
def chain(items):
    """items: (heading, text); text None leaves the box to fill"""
    return ("html", '<div class="chain">' + "".join(
        f'<div class="{"blank" if t is None else ""}"><b>{md(h)}</b>{md(t) if t else ""}</div>' for h, t in items) + "</div>")
