"""What every Women's History Month lesson shares: the exhibition's pictures,
the facts set once (each word as the exhibition sets it, in
app/exhibitions/womens-history/womensHistory.ts, violet/ and remembered/),
and the objectives block's look. A leading underscore keeps build.py and
export_lessons.py from loading this file as a lesson."""
import html as _html, re as _re

WH = "/exhibitions/womens-history/"
POSTER1 = WH + "poster1.jpg"
POSTER2 = WH + "poster2.jpg"
AF_KLINT = WH + "af-klint-childhood.jpg"
LETTERING = WH + "violet-dina-want.png"
ROOM_VIOLET = WH + "rooms/violet.webp"          # screen only: print takes png and jpg
ROOM_REMEMBERED = WH + "rooms/remembered.webp"
MOMENTS = WH + "poster-sound/moments/"

# The four family photographs from poster 2, with the exhibition's own alt
# text (womensHistory.ts) and the Violet's Life room's captions (questions.ts).
# They are the owner's family's own and carry no credit.
PHOTOS = {
  "violet": {"img": WH + "photo-violet.jpg", "caption": "Violet as a young woman",
             "alt": "A sepia studio portrait of Violet as a young woman, standing beside a small pedestal table in a long belted coat with a strap across her chest, a brimmed hat and white gloves"},
  "promenade": {"img": WH + "photo-promenade.jpg", "caption": "Out for a walk on a promenade",
                "alt": "A sepia snapshot of three people walking arm in arm along a promenade: a woman holding a patterned parasol, a man in a straw hat and jacket, and a young woman in a pale blouse and dark trousers"},
  "family": {"img": WH + "photo-family.jpg", "caption": "A family group outside a house",
             "alt": "A faded photograph of a family group outside a house: five women, three standing and two seated, with a baby in a white dress sitting between them"},
  "four": {"img": WH + "photo-four-women.jpg", "caption": "Four women by a net-curtained window",
           "alt": "A black-and-white photograph of four women standing close together in front of a net-curtained window, two of them in white dresses"},
}

AF_KLINT_CREDIT = "Hilma af Klint, *The Ten Largest, No. 1, Childhood*, Group IV, 1907. Hilma af Klint Foundation. Public domain"
AF_KLINT_ALT = ("A painting by Hilma af Klint: on a deep blue ground, a ring of pale, petal-like flowers with orange and yellow centers "
                "and white ovals holding pink rose discs, above looping orange lines like handwriting around a pale violet circle ringed "
                "with yellow, and a row of yellow, blue and white circles along the foot")
POSTER1_ALT = "The Women’s History poster: the title in heavy navy capitals on a blush ground splashed with orange and royal-blue paint, above a painting by Hilma af Klint of pale flowers and pink rose discs on deep blue, and a paragraph about Women’s History Month"
POSTER2_ALT = "The Working Woman’s poster: Violet Dina Want’s name in decorative lettering, her dates, her biography in typewriter text and four family photographs set as strips of film negative"

# The display case's one object, in the Mini Museum record's own words.
LETTERS_RECORD = "Original Blitz bomb-damaged family letters from Violet Dina Want’s estate"
LETTERS_NAME = "Blitz bomb-damaged family letters"

# Poster 2, word for word (womensHistory.ts BIO).
BIO = {
  "childhood": "was born at the turn of the 20th century in Fulham, Hammersmith, London, into a large working-class family with three sisters and two brothers. As the second eldest daughter, she was expected to help both at home and financially from a young age. She took on a great deal of responsibility, caring for her younger sisters after school and as she aged, after work.",
  "father": "Her father worked as a commissionaire (now known as a doorman) at a hotel, occasionally bringing home leftover food from the restaurant to help feed the family. Despite their modest circumstances, Violet excelled in school, earning certificates for attendance and religious studies every year. Her teachers saw great potential in her and encouraged her to pursue a teaching career—a well-respected and middle-class profession at the time.",
  "factory": "However, when one of her sisters was believed to be going blind and needed to attend a specialized school, Violet had to leave school at 14 to work and help support the family. She became a piecework machinist in a factory, where machinists get paid for each ‘piece of work’ they complete.",
  "faith": "Violet was religious throughout her life and joined the Salvation Army, or “Sally Army,” as an adult. In 1928, at the age of 21, she married Harold Henry Robert Want, saying she had chosen him because he made her laugh.",
  "family": "Violet and Harold began their own family in 1929 with the birth of their eldest daughter, Edna, followed by Doris, in 1930. After a long gap, they had two sons in 1938 and 1942. Money was often tight—Harold worked as a barman and struggled with alcoholism—but Violet ensured her children were always warm and well-dressed.",
  "seamstress": "A skilled seamstress from her years as a machinist, she could take apart adult coats, resize them, and reassemble them perfectly for her children. Her resourcefulness meant they were often better off than others in their community.",
  "music": "Music played a significant role in their home. Violet always owned a piano, which she could play by ear, and it became the centerpiece of lively “knees-up” parties with family and friends.",
  "blitz": "Before World War II, Violet’s extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England.",
  "essex": "After the war, she was offered a home on a new council estate in Essex. It was a corner house with a large garden, where she cultivated beautiful flowers like begonias, chrysanthemums, and ice plants, along with vegetables such as string beans and peas. However, her favorite flowers were roses, which she planted at the bottom of the garden.",
  "greengrocer": "By the time her grandchildren knew her, Violet worked at the local greengrocer, passing on her knowledge about selecting the best produce—such as choosing cauliflowers with their inner leaves still curled over to keep the curds white. She also had a particular fondness for young turnips, eating them like apples.",
  "later": "Widowed in 1956, Violet remained strong and resilient. She continued to garden, even when rheumatoid arthritis made it difficult, and enjoyed sitting outside with her beloved dog, Shona. Music remained a constant in her life; she always kept a piano in her home and, in her seventies, developed a love for Strauss waltzes, which she listened to on the radio. She also had a surprising penchant for wrestling, tuning in every Saturday, and knew Tiny Carr personally, a famous referee of the time.",
  "legacy": "Violet Want’s life is a testament to resilience, humor, and hard work. As a family matriarch, her story offers a rich snapshot of working-class life in England, spanning the Edwardian era, two world wars, and the societal shifts of the 1970s and 80s. The personal histories of women like her help us understand the past—not just in grand historical events, but through the everyday sacrifices and triumphs of ordinary people who shaped the world we live in today.",
}

# Poster 1, word for word.
OVERSHADOWED = "Historically, women’s roles have often been overshadowed by those of men, who were traditionally credited with “shaping history.”"
DEEPER = "However, women’s lived experiences provide a deeper, more nuanced understanding of the past—not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women."
HOUSEHOLDS = "Their roles in households and communities offer invaluable insight into the way societies function, making it essential to recognize and celebrate their impact in shaping human history."
EVERYBODY = "everybody has a story to tell"

# the sounds the posters play as a panel arrives (poster-sound/moments/credits.txt)
def moment(name, label, sub, by):
    return {"src": MOMENTS + name + ".mp3", "label": label, "sub": sub,
            "credit": f"“{by[0]}” by {by[1]}, Pixabay Content License"}

SOUNDS = {
  "factory-whistle": moment("factory-whistle", "A factory whistle", "Women in wartime", ("Factory whistle, train whistle", "freesound_community")),
  "sewing-machine": moment("sewing-machine", "A sewing machine", "Violet, a piecework machinist", ("sewing machine", "freesound_community")),
  "garden-birds": moment("garden-birds", "Garden birds", "Gardening with her father", ("30 Seconds Bird Sounds from Garden", "KalsStockMedia")),
  "knees-up": moment("knees-up", "A piano at a party", "Her knees-up parties", ("Ragtime Piano - Honky-Tonk (Swipesy)", "Back_Drop")),
  "air-raid-siren": moment("air-raid-siren", "An air-raid siren", "The Blitz", ("air raid siren", "LazyChillZone")),
  "shop-bell": moment("shop-bell", "A shop door bell", "The greengrocer’s", ("Shop door bell", "freesound_community")),
}

# ── lesson mode ────────────────────────────────────────────────────────
LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."
TIMING = {"hook": "#7D8471", "teach": "#2F4A5A", "look": "#4A7346", "activity": "#86671A", "close": "#A8452F"}

def review(objectives, minutes, script, phase="Close", hint=None, purpose="Check what each student can now do against the objectives."):
    """The Look back step: the objectives asked back as questions."""
    s = {"phase": phase, "minutes": minutes, "script": script, "title": "Look back", "show": "review", "lead": LOOK_BACK,
         "purpose": purpose, "students": [q for _, q, _ in objectives["items"]],
         "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}
    if hint:
        s["hint"] = hint
    return s

# the objectives block, as in the In Their Hands plans; the handouts print unchanged
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
.pb { break-after: auto; break-before: auto; height: 0; margin: 0; } .pb + .sec { break-before: page; }
.cols > div > :last-child { margin-bottom: 0; }
"""

# pictures in the page: a photograph with its caption, a row of them
PIC_CSS = """
.photos { display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 9pt; margin: 4pt 0 10pt; break-inside: avoid; }
.photos figure { margin: 0; }
.photos img { width: 100%; height: var(--ph, 118pt); object-fit: cover; object-position: center 30%; border: 1pt solid #1d1c1a; border-radius: 3pt; display: block; filter: grayscale(.15); }
.photos figcaption { font: 400 7.8pt/1.3 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
.photos figcaption b { font-weight: 500; display: block; }
.ks { display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 8pt; margin: 4pt 0 10pt; break-inside: avoid; }
.ks figure { margin: 0; text-align: center; }
.ks svg { display: block; margin: 0 auto; background: #f6efe4; border-radius: 50%; border: 1pt solid #22335e; }
.ks figcaption { font: 400 8pt/1.3 'Outfit'; margin-top: 3pt; }
.ks figcaption b { display: block; font-weight: 500; }
.record { border: 1pt solid #1d1c1a; background: #f6f1e4; padding: 9pt 13pt 6pt; margin: 4pt 0 10pt; break-inside: avoid; }
.record .rq { font: italic 400 13pt/1.3 'Cormorant Garamond', serif; margin: 0 0 4pt; }
.quote { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.quote p { font: italic 400 11pt/1.38 'Cormorant Garamond', serif; margin: 0 0 3pt; }
.quote cite { font: 400 7.2pt 'Outfit'; letter-spacing: .16em; text-transform: uppercase; font-style: normal; color: #5F6655; }
"""

def md(t):
    t = _html.escape(t, quote=False)
    t = _re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return _re.sub(r"\*(.+?)\*", r"<i>\1</i>", t)

def photos(keys, h=118, caps=None):
    """A row of the family photographs, each with its caption."""
    figs = ""
    for i, k in enumerate(keys):
        cap = (caps[i] if caps else PHOTOS[k]["caption"])
        figs += f'<figure><img src="{PHOTOS[k]["img"]}" alt=""><figcaption>{md(cap)}</figcaption></figure>'
    return f'<div class="photos" style="--n:{len(keys)};--ph:{h}pt">{figs}</div>'

def quote(text, cite):
    return f'<blockquote class="quote"><p>{md(text)}</p><cite>{md(cite)}</cite></blockquote>'

def record():
    return (f'<div class="record"><p class="label">The display case · the one object in it</p>'
            f'<p class="rq">“{md(LETTERS_RECORD)}”</p>'
            '<p style="font-size:8.6pt;margin:0">Shown in an archival glass case with clear document mounts. The letters are not transcribed, so their words are not given anywhere in the exhibition.</p></div>')

def ph(key, caption=None, sub=None):
    """A family photograph as a screen gallery item."""
    p = PHOTOS[key]
    it = {"img": p["img"], "caption": caption or p["caption"], "alt": p["alt"], "aspect": 0.79}
    if sub:
        it["sub"] = sub
    return it
