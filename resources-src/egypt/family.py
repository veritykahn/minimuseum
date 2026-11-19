"""The Ancient Egypt Family Resource Guide. Facts follow egypt.ts (the
posters, the display case, the rooms), tomb/scenes.ts, the rooms' own data
(mummification/steps.ts, weighing-of-the-heart/judgement.ts,
amulet/amulets.ts, rosetta-stone/rosetta.ts) and the lessons built from
them. Pictures are the exhibition's own: the posters' gods (no credit) and
The Met's facsimiles of the tomb walls (credited)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _egy import GODS, WALLS, SITE_EX

FAMILY = {
  "out": "parents/EGY_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Ancient Egypt",
  "sub": "Guardians of the Afterlife · A guide for families of children PreK–8",
  "foot": "Family Resource Guide",
  "hero": {"img": WALLS["fields"]["img"], "pos": "center 40%", "credit": WALLS["fields"]["credit"]},
  "css": ".gallery .grow img { width: 92pt; height: 66pt; object-fit: contain; }",
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "The civilization of ancient Egypt lasted for over three thousand years, along the river Nile in northeastern Africa. It left behind pyramids and temples, painted tombs and a writing of its own, hieroglyphs, that we can read again thanks to the Rosetta Stone. This guide will help you talk about the exhibition at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is in the exhibition?", "title": "Two posters, a case and seven rooms", "body": [
      "**Poster 1, The Mysteries of Ancient Egypt,** tells of the Nile and its floods, who really built the pyramids, and the Rosetta Stone. **Poster 2, Gods and Goddesses,** introduces Anubis, Bastet, Horus and Isis. **The display case** holds replica statues of Bastet and Anubis, and a scarab beetle amulet. Online, **seven rooms** let children explore for themselves."]}),
    ("gallery", [
      {"label": "Poster 2 · Gods and Goddesses", "items": [
        {"img": GODS[k]["img"], "cap": cap} for k, cap in [
          ("anubis", "Anubis · god of mummification"), ("bastet", "Bastet · goddess of cats"),
          ("horus", "Horus · god of the sky"), ("isis", "Isis · goddess of protection")]]},
      {"label": "Tomb Explorer · facsimiles of tomb paintings, The Met (public domain)", "items": [
        {"img": WALLS[k]["img"], "cap": cap} for k, cap in [
          ("marshes", "Menna in the marshes"), ("cat", "The cat and the serpent"),
          ("harvest", "The harvest"), ("wine", "The vineyard")]]},
    ]),
    ("section", {"label": "Online, at home", "title": "Seven rooms to explore", "list": [
      "**Tomb Explorer** — turn on a torch and search five painted tomb walls in the dark",
      "**Your Name in Hieroglyphs** — write your name in a cartouche, and print it",
      "**The Rosetta Stone Decoder** — three scripts, and two royal names to crack",
      "**Mummification, Step by Step** — the seventy days, told plainly and gently",
      "**The Weighing of the Heart** — follow the scribe Ani’s judgement, and guess what the scales will do",
      "**Design an Amulet** — choose its symbols, learn their meanings, and print it",
      "**Build Your Own Tomb** — choose a painted wall, fill the chamber and carve your name"]}),
    ("connection", ["Every room works on a phone or tablet. Explore it together at any time."]),
    ("section", {"label": "A gentle note", "body": [
      "Much of what survives from ancient Egypt was made for the dead, so the exhibition talks about death, mummies and the afterlife. It does so plainly and gently, with nothing a young child needs to look away from. The gods and the afterlife are taught as history: what the ancient Egyptians believed. If your child has questions about death, follow their lead and answer as your family does."]}),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What did you find in the dark tomb? Which animal did you like best?",
          "Bastet had the head of a cat. Which animal’s head would you choose?",
          "What would you paint on a wall to show the people you love?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "Can you write your name in hieroglyphs? Which sign is your first letter?",
          "Why do you think a king’s name was written inside an oval?",
          "If you made an amulet, what would you want it to protect?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "How did one stone with three scripts help people read hieroglyphs again?",
          "Who really built the pyramids? What is the evidence?",
          "Why did the Egyptians leave the heart inside the body?",
          "If you wanted to leave a message people could still understand thousands of years from now, how would you do it?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("Your name in a cartouche", "Use *Your Name in Hieroglyphs* to find the signs for each sound in your names, then draw them inside an oval: a cartouche, like the ones that enclosed royal names."),
      ("One message, three ways", "The Rosetta Stone carries one decree in three scripts. Write one short family message three ways: in words, in pictures, and in a code you invent."),
      ("Design an amulet", "Choose a symbol for something you hope for: the ankh for life, the wedjat eye for protection, the lotus for a fresh start. Draw it, or shape it from clay."),
      ("A wall in two rows", "Tomb painters showed scenes like the harvest and the vineyard, often in rows. Draw a day your family loves, in two rows, from top to bottom."),
      ("Salt and an apple", "Natron, a natural salt, dried a body out over 40 days. Pack one apple slice in salt, leave another open, and compare them each day for a week. Don’t eat them."),
      ("The Nile’s three seasons", "The Egyptians’ year had three seasons: Akhet, the flood; Peret, the growing; and Shemu, the harvest. What are the seasons where you live, and what do they bring?")]),
    ("section", {"label": "Things children love to know", "list": [
      "The pyramids were not built by slaves. Archaeologists have found the town and tombs of the builders, a workforce of 20,000 to 30,000 Egyptians.",
      "The Great Pyramid of Khufu, 146 meters (about 480 feet) tall, was the tallest structure on Earth for nearly 4,000 years. The only complete statue of Khufu ever found is just 7.5 centimeters (3 inches) tall.",
      "Some pet cats were mummified and placed in their owners’ tombs, so that the pair could stay together in the afterlife.",
      "Egyptian children may have played with toys much like ours: the British Museum has a little wooden horse on wheels, made to be pulled along by a string."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
