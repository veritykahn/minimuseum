"""What every Fear Lab resource shares: the posters' own sentences, the lab's
facts, the pictures and sounds, and the objectives block's look. build.py
skips files that begin with "_"; the lesson modules import this one.

Every fact here is the exhibition's own:
  app/exhibitions/fear-lab/fearLab.ts            the two posters, the case
  app/exhibitions/fear-lab/what-scares-you/      the lab: boxes.ts, surprises.ts,
      KnownOrUnknown.tsx (CHOICES), RustlingBushes.tsx (CLUE_TEXT), lab.ts
The poster wording follows fearLab.ts, which corrects three claims printed on
the poster pictures (the 50% shock, the imaginary faces, the 1959
experiment); quote fearLab.ts, never the poster image.

Pictures: the PDFs print PNG and JPEG through build.py's cache; the lab's
WebP pictures (boxes, creatures, the room) print from public/ by a file
address (pub), as seeing-is-deceiving/librarians.py prints its own. The
classroom screen always takes the site's own address."""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FL = "/exhibitions/fear-lab/"

def pub(path):
    """A picture in public/, by file address, for printing a WebP."""
    return "file://" + os.path.join(ROOT, "public") + path

# ── pictures ────────────────────────────────────────────────────────────
POSTER1 = FL + "poster1.jpg"
POSTER2 = FL + "poster2.jpg"
VAMPIRE_MOON = FL + "vampire-moon.jpg"
VAMPIRE = FL + "vampire.jpg"
HAND = FL + "hand.png"
SPIDER = FL + "spider.png"
ROOM = FL + "rooms/what-scares-you.webp"
BOXES = {k: FL + f"boxes/box-{k}.webp" for k in ("chest", "crate", "hatbox", "tin")}
CREATURE_IMG = {k: FL + f"creatures/{k}.webp" for k in ("cockroach", "tarantula", "bat", "snake", "rat", "centipede")}

POSTER1_ALT = "The Science of Being Scared: Fear Lab poster: the title in cream capitals on navy beside a black spider, above a box of text and a cream clawed hand reaching up"
POSTER2_ALT = "Page Turners & Spine Tinglers poster: the title in cream capitals above an illustration of a caped vampire before a Gothic tower under a full moon, a marigold starburst and two columns of text"
VAMPIRE_MOON_ALT = "Illustration of a caped vampire seen from behind, facing a Gothic tower with lit red windows in the rain, under a full moon"
VAMPIRE_ALT = "Illustration of a caped vampire in a red-lined cloak, seen from behind against a stormy, moonlit sky"
ROOM_ALT = "The What Scares You? room: five old boxes on a dark shelf, waiting to be picked, above a beating pulse line"

# ── poster 1, The Science of Being Scared: Fear Lab (fearLab.ts) ────────
BOX = "Put your hand in a box you can’t see into. Your heart races before you even touch anything. Why?"
UNKNOWN = "Because your brain’s #1 fear isn’t spiders or snakes—it’s the UNKNOWN. And your imagination is programmed to fill that unknown with the worst possible thing."
AMBIGUITY = "Scientists call it “ambiguity aversion”—we’d rather face a known danger than an unknown possibility. In experiments, a 50% chance of a small electric shock stressed people out more than knowing for certain they’d get one."
AMYGDALA = "Uncertainty itself sets off the amygdala (your brain’s alarm system). When you can’t see what’s in that box, your brain screams “THREAT!” louder than if you saw an actual spider."
DREAD = "Brain scans show that dread is real: in one study, some people chose a stronger shock right away rather than wait for a weaker one."
MYSTERY_BOX = "That’s why reaching into a mystery box feels scarier than touching what’s actually inside—your imagination creates horrors worse than reality."
PINECONE = "Your brain invents poisonous spiders, slimy worms or nibbling rodents when it’s really just a pinecone."
PATTERN = "Your brain is a pattern-seeking machine that sees faces and threats where none exist. In experiments, people saw imaginary faces as male about four times as often as female."
SHADOW = "Shadow people? Just your brain turning random darkness into human shapes."
BY_DESIGN = "This isn’t a flaw—it’s by design. Our brains know it is better to see 100 fake threats than miss one real predator."
TIGERS = "When faced with uncertainty, your brain doesn’t imagine neutral scenarios—it imagines disasters. This “negativity bias” kept ancestors alive. Those who assumed rustling bushes contained tigers lived longer than optimists."
WIRING = "Today, that same wiring makes you imagine the worst possible thing in a dark box. Your brain literally can’t help lying to you about danger—it’s trying to save your life."

# ── poster 2, Page Turners & Spine Tinglers (fearLab.ts) ────────────────
WHY_READ = "Why do we willingly read stories designed to scare us?"
REHEARSAL = "The answer lies in our brain’s irresistible urge to practice survival—without actual danger. When we read horror, we’re conducting risk-free rehearsals for dangerous situations, gaining a sense of mastery as we face monsters and survive."
GOTHIC = "It began with Mary Shelley’s “Frankenstein” (1818). Then came Robert Louis Stevenson’s “Jekyll and Hyde” (1886), Wilde’s “Picture of Dorian Gray” (1890), and Stoker’s “Dracula” (1897)."
GOLDEN_RULE = "These Gothic classics established horror’s golden rule: the real terror isn’t the creature, it’s what it represents—fear of new technology, anxiety about moral decay, losing your humanity."
PENNY = "While the educated read these novels, working-class Victorians devoured “penny dreadfuls”—cheap weekly serials like “Varney the Vampire” and “Spring-Heeled Jack”, proving that horror tapped into something innate to the human condition."
LATER = "Later writers like H.P. Lovecraft, Shirley Jackson and Stephen King bridged oceans and decades and proved that horror was not to be dismissed as peculiar to the Victorian era."
POINT_LAUNCH = "In 1991, Scholastic realized teenagers wanted their own horror, launching the Point Horror series with authors like R.L. Stine (whose “Blind Date” launched his career), Christopher Pike, Caroline B. Cooney, and Diane Hoh."
HALLWAYS = "With titles like “The Babysitter” and “The Boyfriend,” these books moved horror from Gothic castles to high school hallways."
RED_EYE = "Today’s Red Eye series (Stripes Publishing’s modern horror line) features books like “Frozen Charlotte” and “Sleepless”—updating classic fears for the Instagram age."
GOTHIC_DNA = "But these contemporary horrors retain their Gothic DNA: isolation, transformation, and the terrifying realization that you might BE the monster."
GENERATIONS = "From Gothic novels to Point Horror to Red Eye, each generation gets the monsters it needs to face its anxieties."
TOGETHER = "But perhaps the real reason we love these spine tinglers is that scary books bring us together. Psychologists have known since a famous 1959 experiment that frightened people seek each other’s company. We’re literally wired to bond over being scared together."

# ── the lab, What Scares You? ───────────────────────────────────────────
# the six Known or Unknown? choices (KnownOrUnknown.tsx, CHOICES), and what
# the poster or the lab's museum note says people did
CHOICES = [
  ("A shock for sure, or maybe a shock?", "A small electric shock, for certain.", "A 50% chance of a small electric shock.",
   "The 50% chance stressed people out more than the certain shock (poster 1)."),
  ("A strong shock now, or a weak one later?", "A stronger shock, right away.", "A weaker shock, but you have to wait for it.",
   "Some people chose the stronger shock right away rather than wait (poster 1)."),
  ("Which box would you reach into?", "A glass box with a spider you can see.", "A box you can’t see into.",
   "Not seeing sets off the brain’s alarm louder than seeing an actual spider (poster 1)."),
  ("Which jar would you bet on?", "50 red and 50 black marbles. Pull out a red one to win.", "100 red and black marbles, in a mix nobody will tell you.",
   "Most people pick the known mix, though nobody has said the mystery jar is worse: the Ellsberg paradox, 1961."),
  ("Fifteen minutes alone with your thoughts, or a button?", "Sit alone in a bare room for 15 minutes, with nothing to do but think.", "Sit there with a button that gives you a small electric shock, if you want one.",
   "In a 2014 study, 12 of 18 men and 6 of 24 women shocked themselves at least once rather than just sit and think."),
  ("Which haunted house would you go into?", "A haunted house that is only a little bit scary.", "The scariest haunted house in the world.",
   "In 2020, 110 visitors to a haunted house in Vejle, Denmark, wore heart-rate monitors. They enjoyed it most when scared a medium amount."),
]

# the Rustling Bushes (lab.ts, RustlingBushes.tsx): eight rounds, five bushes,
# a tiger in three rounds; ten seconds to decide, or none in Guess first
CLUES_TIGER = [("A striped tail tip", "poking out of the bush"), ("A tiger-shaped shadow", "on the ground"),
               ("Paw prints", "leading into the bush"), ("A low growl", "shown as words, too")]
CLUES_WIND = [("Leaves blowing loose", "in the wind"), ("No clue at all", "sometimes there isn’t one")]

# the silly surprises (surprises.ts): name and line, word for word
SURPRISES = [
  ("Just slime!", "Just slime! Your heart still jumped, didn’t it?"),
  ("Surprise! Confetti!", "Pop! Only a party popper. The waiting was the scary part."),
  ("A jack-in-the-box!", "Boing! Just a jack-in-the-box. Did you jump before you even saw it?"),
  ("A rubber chicken!", "Squawk! A rubber chicken. Not knowing was scarier than the chicken."),
  ("Just bubbles!", "Just bubbles! All that dread, for a few little pops."),
  ("Just a feather", "Just a feather, drifting down. In the dark, it could have been anything."),
]

# the lab's sounds, for a "listen" screen (sounds/credits.txt: all CC0, Freesound)
def clip(slot, label, title, author, sub="What Scares You?"):
    return {"src": FL + f"sounds/{slot}.mp3", "label": label, "sub": sub,
            "credit": f"“{title}” by {author}, CC0, via Freesound"}

# ── look ────────────────────────────────────────────────────────────────
HOOK_C, TEACH_C, ACT_C, ACT2_C, CLOSE_C = "#7D8471", "#2F4A5A", "#86671A", "#4A7346", "#A8452F"

LOOK_BACK = "Can you now…"
THUMBS = "Show me: thumb up, sideways or down."

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
.pb { break-after: auto; break-before: page; }
"""

# a poster sentence set apart in a plan or handout, as the posters set it
QUOTE_CSS = """
.pq { margin: 4pt 0 9pt; padding: 0 0 0 11pt; border-left: 1.2pt solid var(--accent); break-inside: avoid; }
.pq p { font: italic 400 11.5pt/1.35 'Cormorant Garamond', serif; margin: 0 0 2pt; }
.pq cite { font: 400 7.5pt 'Outfit'; letter-spacing: .18em; text-transform: uppercase; font-style: normal; color: #5F6655; }
"""

def quote(text, cite):
    """A poster's own sentence, with which poster it is on."""
    import html
    return ("html", f'<blockquote class="pq"><p>{html.escape(text, quote=False)}</p><cite>{html.escape(cite)}</cite></blockquote>')

P1 = "Poster 1 · The Science of Being Scared"
P2 = "Poster 2 · Page Turners & Spine Tinglers"

def objectives_screen(obj):
    """the Look back's questions, and which to mark as go deeper"""
    return ([q for _, q, _ in obj["items"]], [k for k, (_, _, deep) in enumerate(obj["items"]) if deep])
