"""Shared by the Our Incredible Moon resources: the exhibition's pictures and
sounds (public/exhibitions/moon/), their credits as the exhibition gives them
(app/exhibitions/moon/microscope/slides.ts, poster-sound/*/credits.txt), and
the styles every lesson plan shares. Not a document itself: build.py and
export_lessons.py skip files that start with "_".

Every fact in these resources comes from the exhibition:
  app/exhibitions/moon/moon.ts          the two posters, their added panels and notes, the display case
  app/exhibitions/moon/microscope/      Under the Microscope: slides.ts (the six photographs and their
                                        captions), practice.ts (the microscope tips), stage.ts (4×, 10×,
                                        40× objectives under a 10× eyepiece)
"""

P = "/exhibitions/moon/"
M = P + "microscope/"

POSTER1 = P + "poster1.jpg"          # Our Incredible Moon
POSTER2 = P + "poster2.jpg"          # Another Earth
MOONRISE = P + "moonrise.jpg"        # the lavender moon, cut from poster 1
THREE_MOONS = P + "three-moons.jpg"  # the alien landscape, cut from poster 2
RINGED = P + "ringed-planet.jpg"     # the ringed planet, cut from poster 2
ROOM = P + "rooms/microscope.webp"   # the Under the Microscope room (screen only: the PDFs print png/jpg)

# the six slides of Under the Microscope, with the exhibition's own captions
# (slides.ts) and credits (photograph, author, licence)
SLIDES = {
  "moon-soil": {"img": M + "moon-soil.jpg", "name": "Far-side Moon soil",
                "caption": "Lunar soil from the far side of the Moon, enlarged under a microscope. China’s Chang’e 6 mission collected it in 2024: the first samples ever brought back from the far side.",
                "credit": "Li et al., National Science Review (2024) · CC BY 4.0",
                "alt": "Lunar soil from Chang’e 6 under a microscope: gray and brown broken grains of many sizes, some clear, some dark and clumped"},
  "moon-beads": {"img": M + "moon-beads.jpg", "name": "Apollo 17 glass beads",
                 "caption": "Spheres and fragments in the “orange” soil from Apollo 17, magnified 31.5 times. These grains are 150 to 250 microns across: fine sand.",
                 "credit": "NASA, photo S73-15083 · public domain",
                 "alt": "Apollo 17 soil under a microscope: dark glassy beads and broken fragments on a pale slide"},
  "moon-glass": {"img": M + "moon-orange-glass.jpg", "name": "Apollo 17 orange glass",
                 "caption": "Orange glass spheres and fragments from Apollo 17, magnified 160 times: the finest particles ever brought back from the Moon, 20 to 45 microns across.",
                 "credit": "NASA, photo S73-15171 · public domain",
                 "alt": "Apollo 17 orange soil under a microscope: orange glass spheres and fragments mixed with black grains"},
  "earth-wind": {"img": M + "earth-wind.jpg", "name": "Gobi Desert sand", "word": "wind",
                 "caption": "Rounded, fine-grained wind-blown sand from the Gobi Desert in Mongolia. The view is 10 mm wide.",
                 "credit": "Siim Sepp, Wikimedia Commons · CC BY-SA 3.0",
                 "alt": "Desert sand under a microscope: small, rounded grains, clear, cream, orange and dark"},
  "earth-water": {"img": M + "earth-water.jpg", "name": "Vistula River sand", "word": "water",
                  "caption": "Grains of sand from the Vistula River in Warsaw, Poland.",
                  "credit": "Krzem Anonim, Wikimedia Commons · CC BY-SA 4.0",
                  "alt": "River sand close up: clear, glassy, smooth-edged grains with a few dark and pink ones"},
  "earth-life": {"img": M + "earth-life.jpg", "name": "Bermuda coral sand", "word": "living things",
                 "caption": "Coral sand from Bermuda, with pieces of coral and mollusc shells, and pink foraminifera, which give Bermuda’s beaches their pink color.",
                 "credit": "Siim Sepp (Sandatlas), Wikimedia Commons · CC BY-SA 3.0",
                 "alt": "Coral sand under a microscope: cream and white pieces of coral and shell with pink speckled grains"},
}

def slide_pic(key, pos="center"):
    """a slide as a screen picture {img, pos, credit}"""
    s = SLIDES[key]
    return {"img": s["img"], "pos": pos, "credit": s["credit"]}

def photo_credits(keys):
    """one small line crediting the photographs a document prints"""
    return ("html", '<p class="pcredit"><b>Photographs</b> ' + " · ".join(
        f'{SLIDES[k]["name"]}: {SLIDES[k]["credit"].replace(" · ", ", ")}' for k in keys) + "</p>")

# the exhibition's own sounds (poster-sound/moments/credits.txt)
EAGLE = {"src": P + "poster-sound/moments/eagle-landed.mp3", "label": "“The Eagle has landed”",
         "sub": "Apollo 11 · July 20, 1969",
         "credit": "Apollo 11 air-to-ground audio, NASA · “The Eagle Has Landed,” freesound_community, Pixabay"}
IMPACT = {"src": P + "poster-sound/moments/impact.mp3", "label": "A giant crash", "sub": "Theia strikes the young Earth",
          "credit": "“Trailer Big Powerful Impact,” Tomasz_Redman, Pixabay"}
SPACE_STATIC = {"src": P + "poster-sound/moments/space-static.mp3", "label": "“Where is everybody?”", "sub": "Static from space",
                "credit": "“Space Static,” freesound_community, Pixabay"}
VOYAGER = {"src": P + "poster-sound/moments/voyager-beep.mp3", "label": "Voyager 1", "sub": "Launched 1977",
           "credit": "“beep...beep...beep..,” freesound_community, Pixabay"}
WAVES = {"src": P + "poster-sound/moments/waves.mp3", "label": "Ocean waves", "sub": "The Moon’s pull on the tides",
         "credit": "“Gentle Ocean Waves,” DRAGON-STUDIO, Pixabay"}

# the heroes: the posters' own pictures, and the microscope's photographs
HERO_POSTER1 = {"img": POSTER1, "pos": "center 31%"}
HERO_MOONRISE = {"img": MOONRISE, "pos": "center 40%"}
HERO_LANDSCAPE = {"img": THREE_MOONS, "pos": "center 50%"}

def hero_slide(key, pos="center"):
    s = SLIDES[key]
    return {"img": s["img"], "pos": pos, "credit": s["credit"]}

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

# the objectives block's look, as in the In Their Hands plans; handouts print unchanged
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
# the "Show your class" page always starts a page
FLOW_CSS = """
.sec { break-inside: auto; }
.sec .label, .sec h3 { break-after: avoid; }
.sec p { orphans: 2; widows: 2; }
.pb { break-after: auto; break-before: page; }
"""

# small pieces every document may use
BASE_CSS = """
.pcredit { font: 400 6.8pt/1.35 'Outfit'; color: #5F6655; margin: 2pt 0 6pt; }
.pcredit b { font-weight: 500; letter-spacing: .16em; text-transform: uppercase; margin-right: 3pt; }
.quote { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.quote p { font: italic 400 11.5pt/1.35 'Cormorant Garamond', serif; margin: 0 0 2pt; }
.quote cite { font: 400 7.5pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; font-style: normal; color: #5F6655; }
.slides { display: grid; grid-template-columns: repeat(var(--n, 3), 1fr); gap: 9pt; margin: 4pt 0 9pt; break-inside: avoid; }
.slides figure { margin: 0; }
.slides img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 50%; border: 1.2pt solid #1d1c1a; display: block; }
.slides figcaption { font: 400 8pt/1.3 'Outfit'; margin-top: 4pt; text-align: center; }
.slides figcaption b { display: block; font-weight: 500; }
.slides .lt { display: block; font: 600 16pt/1 'Cormorant Garamond', serif; color: var(--gold-big); margin-bottom: 2pt; }
"""

def quote(text, cite):
    """a line from the posters, set apart (the verse block's look, for any exhibition)"""
    import html as h
    return ("html", f'<blockquote class="quote"><p>{h.escape(text, quote=False)}</p><cite>{h.escape(cite, quote=False)}</cite></blockquote>')

def slides(keys, captions=None, letters=False, n=None):
    """the microscope's photographs as round views down the eyepiece"""
    figs = ""
    for i, k in enumerate(keys):
        cap = captions[i] if captions else f"<b>{SLIDES[k]['name']}</b>"
        lt = f'<span class="lt">{"ABCDEF"[i]}</span>' if letters else ""
        figs += f'<figure><img src="{SLIDES[k]["img"]}" alt="">{"" if not cap and not lt else f"<figcaption>{lt}{cap}</figcaption>"}</figure>'
    return ("html", f'<div class="slides" style="--n:{n or len(keys)}">{figs}</div>')

def review(objectives, minutes, script, hint=None, purpose="Check what each student can now do against the objectives.", phase="Close"):
    """the Look back step: the objectives asked back as questions"""
    return {"phase": phase, "minutes": minutes, "script": script, "title": "Look back", "show": "review",
            "lead": LOOK_BACK, **({"hint": hint} if hint else {}), "purpose": purpose,
            "students": [q for _, q, _ in objectives["items"]],
            "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}

# poster 2, Another Earth, word for word (app/exhibitions/moon/moon.ts)
P2 = {
  "wonder": "For centuries, humans have wondered if there are other planets like Earth in the universe. This curiosity led to the discovery of exoplanets—planets outside our solar system.",
  "find_title": "How do you find a planet you can’t see?",
  "find": "Planets are hidden in the glare of their stars, so astronomers usually hunt for clues instead. They watch for tiny dips in a star’s light when a planet passes in front of it, or for a star’s wobble as an orbiting planet tugs on it.",
  "first": "In 1992, astronomers found the first exoplanets orbiting a pulsar, a type of neutron star. Then, in 1995, scientists discovered 51 Pegasi b, the first exoplanet orbiting a star similar to our Sun.",
  "kepler": "NASA’s Kepler space telescope, launched in 2009, discovered more than 2,600 planets. Its results suggest that 20 to 50 percent of the stars we can see in the night sky may have small, possibly rocky planets in their habitable zones.",
  "hd": "Since then, over 6,000 exoplanets have been confirmed, including HD 20794 d, a “super-Earth” located about 20 light-years away in the constellation Eridanus. This planet is roughly six times the mass of Earth and orbits within its star’s habitable zone, where temperatures could allow liquid water to exist.",
  "orbit": "HD 20794 d takes about 647 days to circle its star. Its orbit is a stretched oval, so over its year it swings between the inner and outer edges of the habitable zone. Astronomers confirmed it in 2025, using more than 20 years of measurements.",
  "proxima": "The closest known exoplanet, Proxima Centauri b, is only 4.2 light-years from Earth. NASA scientists say there are more planets than stars in our galaxy.",
  "hopes": "The discovery of HD 20794 d raises hopes of finding alien life, as scientists continue to explore exoplanets that might host life forms.",
  "webb": "In 2022, NASA’s James Webb Space Telescope found the first clear evidence of carbon dioxide in the air of a planet outside our solar system: WASP-39 b, a hot gas giant 700 light-years away. Webb reads the starlight that filters through a planet’s atmosphere, because different gases absorb different colors of light.",
  "fermi": "But if the universe is so vast and full of stars, why haven’t we found aliens yet? This question is known as the Fermi Paradox.",
  "fermi1950": "The question goes back to 1950, when physicist Enrico Fermi asked it over lunch with fellow physicists: “Where is everybody?”",
  "dark": "One idea, called the “Dark Forest” theory, suggests that intelligent civilizations stay silent to avoid attracting attention, fearing that other civilizations might be dangerous. Another possibility is that life is rare or doesn’t last long, making it hard for civilizations to find each other before disappearing.",
  "dark_note": "The “Dark Forest” idea takes its name from a science-fiction novel, The Dark Forest, by the Chinese writer Liu Cixin. It is one proposed answer to the Fermi Paradox: an untested hypothesis, not a scientific theory backed by evidence.",
  "filter": "There’s also the “Great Filter” theory, which suggests that advanced civilizations might destroy themselves before they can develop the technology needed for interstellar travel or communication. This could happen through wars, environmental disasters, or other self-inflicted problems.",
  "travel": "Even once we find a planet like HD 20794 d, traveling there would be extremely difficult. The planet is 20 light-years away, and with current technology, it would take hundreds of thousands of years to reach it.",
  "voyager": "NASA’s Voyager 1, launched in 1977 and cruising at nearly 38,000 miles per hour, takes almost 50 years, until November 2026, to travel one “light-day” (about 16 billion miles) from Earth. HD 20794 d is about 7,300 light-days away.",
  "dangers": "Space travelers would face dangers like harmful radiation and collisions with space dust. Making such a planet habitable would also be challenging, as it might lack the right atmosphere or have extreme temperatures.",
  "germs": "Another concern is the possibility of encountering alien microbes. Scientists warn that our immune systems might struggle to detect and respond to germs originating from other planets, posing significant health risks to humans and other mammals.",
  "germs_note": "Scientists have not yet found any life beyond Earth, germs included. To be safe, NASA practices “planetary protection”: keeping Earth’s microbes off other worlds, and protecting Earth “from possible life forms that may be returned” from them.",
  "special": "While the search for alien life is thrilling, it reminds us how special and unique our own Earth is.",
  "talk": "If scientists found a planet very like Earth, would you want people to try to travel there one day? What would you want to know before deciding?",
  "talk_clues": "Astronomers often find planets from the clues they leave rather than by seeing them. What else do we know about only from the clues it leaves behind?",
}
KEPLER = {"src": P + "poster-sound/moments/kepler-launch.mp3", "label": "Kepler launches", "sub": "2009",
          "credit": "“Space Rocket Launch Rumble,” Jerryblessed, Pixabay"}
WEBB = {"src": P + "poster-sound/moments/webb-sparkle.mp3", "label": "Webb reads starlight", "sub": "2022",
        "credit": "“Sound Effect: Twinkle/Sparkle,” ShidenBeatsMusic, Pixabay"}

def light_curve(dips, days=30, note="Practice data, made up for this worksheet", w="100%", maxw="360pt", bottom=97.0):
    """a star's brightness against time; dips = [(day, depth %, half-width days)]"""
    W, H, L, R, T, B = 420, 190, 44, 12, 14, 34
    pw, ph = W - L - R, H - T - B
    lo = bottom
    def x(t): return L + pw * t / days
    def y(v): return T + ph * (100 - v) / (100 - lo)
    pts = []
    n = days * 8
    for i in range(n + 1):
        t = days * i / n
        v = 100.0
        for d, depth, hw in dips:
            if abs(t - d) < hw:
                v -= depth
            elif abs(t - d) < hw + .35:
                v -= depth * (1 - (abs(t - d) - hw) / .35)
        pts.append(f"{x(t):.1f},{y(v):.1f}")
    grid = "".join(f'<line x1="{x(t):.1f}" y1="{T}" x2="{x(t):.1f}" y2="{T + ph}" stroke="#bdb6a6" stroke-width=".6"/>'
                   f'<text x="{x(t):.1f}" y="{T + ph + 13}" text-anchor="middle">{t}</text>' for t in range(0, days + 1, 5))
    minor = "".join(f'<line x1="{x(t):.1f}" y1="{T}" x2="{x(t):.1f}" y2="{T + ph}" stroke="#d9d3c4" stroke-width=".4"/>' for t in range(days + 1) if t % 5)
    yl = "".join(f'<line x1="{L}" y1="{y(v):.1f}" x2="{L + pw}" y2="{y(v):.1f}" stroke="#bdb6a6" stroke-width=".6"/>'
                 f'<text x="{L - 5}" y="{y(v) + 3:.1f}" text-anchor="end">{v:g}%</text>' for v in [100, 99, 98, 97] if v >= lo)
    return (f'<figure class="lc" style="margin:4pt auto 8pt;max-width:{maxw}"><svg viewBox="0 0 {W} {H}" width="{w}" aria-hidden="true" style="display:block">'
            f'<g font-family="Outfit" font-size="9" fill="#1d1c1a">{minor}{grid}{yl}'
            f'<polyline points="{" ".join(pts)}" fill="none" stroke="#5b2a91" stroke-width="2"/>'
            f'<rect x="{L}" y="{T}" width="{pw}" height="{ph}" fill="none" stroke="#1d1c1a" stroke-width="1"/>'
            f'<text x="{L + pw / 2}" y="{H - 4}" text-anchor="middle" font-size="10">Day</text>'
            f'<text x="10" y="{T + ph / 2}" text-anchor="middle" font-size="10" transform="rotate(-90 10 {T + ph / 2})">Brightness of the star</text></g></svg>'
            f'<figcaption style="font:400 7.5pt Outfit;color:#5F6655;text-align:center;margin-top:2pt">{note}</figcaption></figure>')
