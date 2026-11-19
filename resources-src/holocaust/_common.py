"""What the International Holocaust Remembrance Day resources share: the
pictures, the objectives block's look, the Look back, and the exhibition's
own words that more than one plan quotes. Every fact and every quotation
follows app/exhibitions/holocaust/ (holocaust.ts, the Walk's film,
A Minute's Stillness, Lay a Stone and the Timeline of the Holocaust),
word for word where quoted.

The exhibition recommends the subject for grades 6 and up (its teachNote),
so this set has no PreK–4 lessons: four Grades 5–8 lessons, each of which
says so. The plans follow the USHMM's guidelines for teaching the
Holocaust, as the exhibition does: people before numbers, precise
language, nothing graphic, and no simulation or role-play of victims or
perpetrators. The file name starts with "_", so build.py does not print it."""

EXH = "/exhibitions/holocaust/"
TL = EXH + "timeline/"
WALK = EXH + "walk/"

# The three freely licensed photographs the exhibition uses, credited as
# holocaust.ts credits them (creditFor). Only these and the posters' small
# neutral pictures are JPEGs, and the print can only take JPEG and PNG.
CANDLES = {"img": EXH + "commons-candles.jpg", "pos": "center 45%",
           "credit": "Ted Eytan, *Holocaust Day*. CC BY-SA 2.0, via Wikimedia Commons"}
BERLIN = {"img": EXH + "commons-berlin-memorial.jpg", "pos": "center 55%",
          "credit": "Dietmar Rabich, *Berlin, Denkmal für die ermordeten Juden Europas -- 2011 -- 2415*. CC BY-SA 4.0, via Wikimedia Commons"}
BIRKENAU = {"img": EXH + "commons-birkenau-monument.jpg", "pos": "center 40%",
            "credit": "Danielle Jansen, *International Monument Auschwitz II-Birkenau 08*. CC BY-SA 4.0, via Wikimedia Commons"}
STONES_IMG = EXH + "poster-stones.jpg"

# The exhibition's own guidance, from its teachNote, said in every plan.
TEACH_NOTE = "Recommended for grades 6 and up; for younger students, preview first and stay with them."

def before_you_teach(extra):
    """The plan's note on age, preview and care: the teachNote, then the
    USHMM practice the exhibition follows, then the lesson's own word."""
    return ("section", {"label": "Before you teach", "body": [
        f"**The exhibition’s guidance:** *{TEACH_NOTE}* With fifth graders, do both. Nothing here is graphic, and no step asks students to imagine being a victim or a perpetrator. "
        "Say *murdered*, not *lost*; put the Nazis’ own terms in quotation marks, and explain them. When a question has no simple answer, say so. " + extra]})

# The exhibition's words, as holocaust.ts and the rooms set them.
STEP_LINE = "It did not happen all at once. It happened step by step."          # the Walk's film, opening words
GENOCIDE_LINE = "“Genocide never just happens. There is always a set of circumstances which occur or which are created to build the climate in which genocide can take place.”"
GENOCIDE_CITE = "Holocaust Memorial Day Trust, quoted on the first poster"
STEVEN_FRANK = "“I was suddenly different from all my other friends. I was no longer allowed to play in the park, my father could not take public transport to work; I couldn’t go into the swimming pool or the zoo.”"
WIESEL_WITNESS = "“For the dead and the living, we must bear witness.”"
WIESEL_HUMANKIND = "“The survivors had every reason to despair of society; they did not. They opted to work for humankind, not against it.”"
SHOAH_LINE = ("The Holocaust, also known as the *Shoah* (a Hebrew word meaning “catastrophe”), was the systematic persecution and murder of six million "
              "Jewish men, women, and children by Nazi Germany and its collaborators between 1933 and 1945.")
STONE_CUSTOM = "Many Jewish visitors place a small stone on a grave or memorial to show that someone has come and that the person is remembered. A stone lasts where flowers fade."

LOOK_BACK = "Can you now…"
LOOK_BACK_SAY = ("Put the objectives back on the screen, asked as questions: *“Can you now…?”* For each one, students show "
                 "a thumb up, sideways or down. Ask one student to answer each aloud; for the last, ask a Red Level reader.")

def look_back(phase, minutes, script, objectives):
    """The Look back screen: the objectives asked back as questions."""
    return {"phase": phase, "minutes": minutes, "script": script, "title": "Look back", "show": "review", "lead": LOOK_BACK,
            "purpose": "Check what each student can now do against the objectives.",
            "students": [q for _, q, _ in objectives["items"]],
            "deeper": [k for k, (_, _, deep) in enumerate(objectives["items"]) if deep]}

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

# The exhibition's name is long: the footer line is set a little smaller,
# so it keeps to one line.
FOOT_CSS = """
@page { @bottom-left { font-size: 6.3pt; } }
"""
OBJ_CSS = OBJ_CSS + FOOT_CSS

# The handouts' name strip, without the museum ticket's "Admit one": not a
# word for a page about deportation.
HANDOUT_CSS = FOOT_CSS + """
.stub span { display: none; }
"""

TIMING_COLORS = {"Hook": "#7D8471", "Teach": "#2F4A5A", "Activity": "#605A56", "Debrief": "#A8452F"}

def timing(hook, teach, activity, debrief):
    return ("timing", [("Hook", hook, TIMING_COLORS["Hook"]), ("Teach", teach, TIMING_COLORS["Teach"]),
                       ("Activity", activity, TIMING_COLORS["Activity"]), ("Debrief", debrief, TIMING_COLORS["Debrief"])])

def item(img, caption, sub, alt, aspect=1.5):
    """A gallery picture on the classroom screen."""
    return {"img": img, "caption": caption, "sub": sub, "alt": alt, "aspect": aspect}

import os as _os
_ROOT = _os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__))))

def printed(src):
    """A picture of the exhibition's for the print, by its own file. The
    print rewrites only JPEG and PNG pictures into right-sized copies; the
    timeline's and the walk's photographs are WebP, so the page names the
    exhibition's own file directly, wherever the repository is."""
    return "file://" + _os.path.join(_ROOT, "public") + src

def photo(src, caption, credit=None, cls="photo"):
    """A photograph with its caption, for the print."""
    cr = f'<span class="pcr">{credit}</span>' if credit else ""
    return (f'<figure class="{cls}"><img src="{printed(src)}" alt=""><figcaption>{caption}{cr}</figcaption></figure>')

PHOTO_CSS = """
.photo { margin: 0; break-inside: avoid; }
.photo img { width: 100%; height: 118pt; object-fit: cover; display: block; border-radius: 3pt; }
.photo figcaption { font: 400 7.8pt/1.3 'Outfit'; color: #3f3e3a; margin-top: 3pt; }
.photo .pcr { display: block; font-size: 6.6pt; color: #5F6655; margin-top: 1pt; }
.photos { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 4pt 0 8pt; break-inside: avoid; }
"""
