"""The Fear Lab Family Resource Guide. Facts follow
app/exhibitions/fear-lab/fearLab.ts (the posters, the display case) and
what-scares-you/ (the Fear Boxes, Known or Unknown? and the Rustling
Bushes)."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _fl import *          # noqa: E402,F403

FAMILY_CSS = OBJ_CSS + QUOTE_CSS + """
.hero { background: #1F3A5F; }
.grow img { width: 92pt; height: 110pt; object-fit: cover; border-radius: 3pt; }
.grow img.png { object-fit: contain; }
"""

FAMILY = {
  "out": "parents/FL_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "The Fear Lab",
  "sub": "The Science of Being Scared · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": FAMILY_CSS,
  "hero": {"img": pub(ROOM), "pos": "center 100%"},
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "Why does your heart race before you reach into a box you can’t see into? Why do shadows turn into people in the dark? And why do so many of us love a scary story? The Fear Lab explores the science of being scared, and its message is a reassuring one: fear is your brain trying to keep you safe. This guide will help you talk about it at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is the Fear Lab?", "title": "Two posters, a display case and a lab", "list": [
      "**The Science of Being Scared** — why the brain’s first fear is the unknown, why waiting makes everything scarier, and why we see faces and monsters where none exist",
      "**Page Turners & Spine Tinglers** — why we read stories designed to scare us, from Mary Shelley’s “Frankenstein” (1818) to the Point Horror and Red Eye series",
      "**The display case** — two tactile Mystery Fear Boxes whose contents change every week, and a vintage collection of original Point Horror paperbacks with their library cards",
      "**What Scares You?** — an online lab with three activities: the *Fear Boxes*, *Known or Unknown?* and the *Rustling Bushes*"]}),
    ("gallery", [
      {"label": "From the posters", "items": [
        {"img": POSTER1, "cap": "The Science of Being Scared"},
        {"img": POSTER2, "cap": "Page Turners & Spine Tinglers"},
        {"img": VAMPIRE_MOON, "cap": "A vampire, seen from behind"},
        {"img": HAND, "cap": "The clawed hand"}]}]),
    quote(BY_DESIGN, "Poster 1 · The Science of Being Scared"),
    ("section", {"label": "Before you open the lab together", "body": [
      "*What Scares You?* has three parts. **Known or Unknown?** asks six would-you-rather questions, and **the Rustling Bushes** is a game of *tiger or wind?* that can be played untimed (*Guess first*). Both suit any age. **The Fear Boxes** are different: about half the time a box releases a swarm of drawn spiders and a photograph of a real creature, such as a tarantula, a snake or a rat, with a scary sound. A gentle mode makes the scares fewer and softer, but they still come. For young or sensitive children, start with the other two, or open the boxes yourself first."]}),
    ("connection", ["Explore it together online at any time: both posters and the lab work on a phone or tablet."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What did you think was in the box? What was really in it?",
          "How does your body feel when you’re a little bit scared?",
          "What helps you feel brave?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "Was it a tiger or the wind? How did you decide?",
          "Why might your brain ring its alarm when there’s nothing there?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "Would you rather know exactly what is in the box, or not know? Why might not knowing feel worse?",
          "Where have you seen a face in something that wasn’t a face?",
          "Why do you think people choose to read stories that are designed to scare them? Do you?",
          "When has your brain imagined the worst? What could you say to yourself when it does?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("A mystery box", "Put something harmless in a bag or box: a pinecone, a feather, a sock. Take turns reaching in without looking. Was the guessing scarier than the thing?"),
      ("Take your pulse", "Find your pulse on the wrist or neck. Count it sitting still, then after a run, then after a slow, calm minute. What changed it most?"),
      ("Face hunt", "Look for faces in sockets, cars, clouds and cupboard handles. Your brain is a pattern-seeking machine, and it finds faces everywhere."),
      ("Tiger or wind?", "When a sound in the night makes someone jump, play detective: what clue would tell you it was only the wind?"),
      ("Shadow shapes", "With a flashlight in a dark room, make shapes on the wall with your hands. Watch how quickly they turn into creatures."),
      ("Scared together", "Read a spooky story aloud with the lights on, and stop at the scariest moment to ask: *what do you imagine happens next?*")]),
    ("section", {"label": "When fear feels big", "body": [
      "The exhibition’s message helps here too: a scared feeling is the brain’s alarm doing its job, sometimes ringing when there’s nothing there. Name the feeling, take a slow breath together, and check what’s really there. Being scared and being brave can happen at the same time."]}),
    ("section", {"label": "Words your child may bring home"}),
    ("refs", [
      ("Amygdala", "the brain’s alarm system, set off by uncertainty itself"),
      ("Ambiguity aversion", "preferring a known danger to an unknown possibility"),
      ("Dread", "the fear of waiting; in one study, some people chose a stronger shock right away rather than wait for a weaker one"),
      ("Negativity bias", "imagining disasters, not neutral outcomes, when unsure; it kept our ancestors alive"),
      ("Pareidolia", "seeing faces and shapes where none exist, like shadow people in a dark room"),
      ("Gothic", "the classic horror novels, whose golden rule is that the real terror is what the monster represents")]),
    ("section", {"label": "For older readers", "body": [
      "Poster 2 traces horror from the Gothic classics (“Frankenstein,” “Jekyll and Hyde,” “Picture of Dorian Gray” and “Dracula”) to the Point Horror series of 1991 and today’s Red Eye books. Horror for young readers varies widely, so look at a book together before your child reads it on their own."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}


DOCS = [FAMILY]
