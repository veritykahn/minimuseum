"""The Our Incredible Moon Family Resource Guide. Facts follow
app/exhibitions/moon/moon.ts (the two posters, their added panels and notes,
the display case and its notes) and app/exhibitions/moon/microscope/
(slides.ts, the six photographs and their captions)."""

import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
from _moon_common import SLIDES, MOONRISE, BASE_CSS, photo_credits

ORDER = ["moon-soil", "moon-beads", "moon-glass", "earth-wind", "earth-water", "earth-life"]

CSS = BASE_CSS + """
.grow img { width: 66pt; height: 66pt; object-fit: cover; border-radius: 50%; border: 1pt solid #e4dcc7; }
.cards { break-inside: auto; display: grid; }
.card { break-inside: avoid; }
"""

FAMILY = {
  "out": "parents/MOON_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Our Incredible Moon",
  "sub": "And Beyond · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": CSS,
  "hero": {"img": MOONRISE, "pos": "center 20%"},
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "The Moon is in our sky almost every night. This exhibition asks how it was made, how we know people walked on it, what its dust can tell us, and whether there might be another Earth out among the stars. This guide will help you talk about it at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is Our Incredible Moon?", "title": "Two posters, a microscope and a display case", "body": [
      "**Our Incredible Moon** tells the Moon’s story: how its gravity helps control our tides and steady Earth’s tilt; how it was probably born in a giant crash, when an object about the size of Mars, nicknamed Theia, struck the young Earth about 4.5 billion years ago; how Apollo 11 landed on July 20, 1969, and the evidence that it really happened; and why Moon dust is so different from Earth’s soil.",
      "**Another Earth** goes beyond the Moon, to planets around other stars. More than 6,000 have been confirmed, among them HD 20794 d, a “super-Earth” about 20 light-years away. The poster asks why we have not found aliens yet, and how hard it would be to travel so far.",
      "In **Under the Microscope**, children look at Moon soil and Moon glass beside sand from Earth. The **display case** holds a genuine lunar meteorite, Adrar 013, with sand and geology specimens and laboratory microscopes."]}),
    ("gallery", [
      {"label": "Under the Microscope · from the Moon", "items": [
        {"img": SLIDES[k]["img"], "cap": SLIDES[k]["name"]} for k in ORDER[:3]]},
      {"label": "Under the Microscope · from Earth, shaped by wind, water and living things", "items": [
        {"img": SLIDES[k]["img"], "cap": SLIDES[k]["name"]} for k in ORDER[3:]]},
    ]),
    photo_credits(ORDER),
    ("section", {"label": "At the exhibition", "title": "Four ways in", "list": [
      "**The poster Our Incredible Moon** — tides, the giant crash, Apollo 11 and Moon dust, with sounds from the moments themselves, among them *“The Eagle has landed”*",
      "**The poster Another Earth** — how astronomers find planets they cannot see, HD 20794 d, the Fermi Paradox and the long journey to the stars",
      "**Under the Microscope** — wipe a slide, focus and magnify, then compare Moon dust with sand shaped by wind, water and living things",
      "**The display case** — a real piece of the Moon: the lunar meteorite Adrar 013"]}),
    ("connection", ["Explore it together online at any time: both posters and the microscope work on a phone or tablet."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What did the astronauts leave on the Moon? Why will their footprints stay?",
          "What did the Moon look like on the poster? What color was it?",
          "If you could visit the Moon, what would you take?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "What made the sand you saw under the microscope? Wind, water or living things?",
          "How is Moon dust different from the sand at a beach or a park?",
          "The astronauts said Moon dust smelled like gunpowder. What would you want to smell, touch or see there?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "No one was there to watch the Moon form. How can scientists work out what probably happened billions of years ago?",
          "Some people have questioned whether the Moon landings were real. What kinds of evidence would help you decide?",
          "Astronomers often find planets from the clues they leave rather than by seeing them. What else do we know about only from its clues?",
          "If scientists found a planet very like Earth, would you want people to try to travel there one day? What would you want to know first?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("Moon watch", "Look for the Moon together each evening for a week, and draw what you see. When can you find it? Does it look the same each night? The Moon always shows us the same face."),
      ("Footprints that stay", "Press a footprint into sand, soil or a tray of flour. Then blow on it, or sprinkle water. On Earth, wind and rain wipe footprints away. The Moon has no wind or rain, so the astronauts’ footprints will probably last for millions of years."),
      ("Sand detective", "Look at sand or soil with a magnifying glass. Are the grains round or sharp? Earth’s sand is shaped by wind, water and living things; Moon dust, by meteorites, so its grains are sharp and jagged."),
      ("A planet you can’t see", "In a dark room, shine a flashlight at a wall and pass a ball slowly in front of it. Watch the light dip. That is a model of one way astronomers find planets around other stars."),
      ("How far?", "The Moon is about 238,855 miles away. Find a distance you know well, from home to school or to a relative, and work out together how many times it would fit."),
      ("Weigh a claim", "Share a surprising fact at dinner, and ask: what evidence would convince you? Then look at the evidence for the Moon landings: 842 pounds of Moon samples, and glass prisms that scientists still bounce lasers off today.")]),
    ("section", {"label": "What your child may do in class", "title": "Seven lessons", "list": [
      "**PreK–K, Footprints on the Moon** — why the astronauts’ footprints stay, and how Moon dust is different",
      "**Grades 1–2, What Made This Sand?** — matching sands to wind, water and living things, then meeting Moon dust",
      "**Grades 3–4, The Moon’s Record Book** — craters as a record of space rocks, with a crater model",
      "**Grades 5–8 Science, Planet Hunters** — finding planets from the dips in a star’s light",
      "**Grades 5–8 ELA, Weighing the Evidence** — the poster’s argument about Apollo 11, taken apart and weighed",
      "**Grades 5–8 Math, How Far Is Far?** — speeds, scale and very large numbers, from the Moon to HD 20794 d",
      "**Grades 5–8 Art, An Artist’s Impression** — the posters’ colors and shapes, and an imagined picture of a far planet"]}),
    ("section", {"label": "Science and wonder", "title": "How do we know?", "body": [
      "Much of this exhibition is about evidence. The Moon’s cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years. Between 1969 and 1972, six Apollo missions brought back 2,200 separate samples, and NASA’s Lunar Reconnaissance Orbiter has photographed all six landing sites, boot tracks and all. Some ideas on the poster have no evidence yet: its note says the “Dark Forest” idea is an untested hypothesis, and scientists have not yet found any life beyond Earth. Telling the two apart is a skill children can use every day."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}


DOCS = [FAMILY]
