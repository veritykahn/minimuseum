"""The Writing Revolution Family Resource Guide. Facts follow the posters in
app/exhibitions/writing-revolution/writingRevolution.ts, the display case
records, and the Typing Station (typing-station/stationText.ts)."""

import importlib.util, os
_s = importlib.util.spec_from_file_location("_wr_common", os.path.join(os.path.dirname(os.path.abspath(__file__)), "_wr_common.py"))
W = importlib.util.module_from_spec(_s); _s.loader.exec_module(W)
Q = W.Q

GALLERY_CSS = """
.gallery { padding: 12pt 14pt 6pt; }
.grow img { width: 100%; height: 118pt; object-fit: contain; }
"""

FAMILY = {
  "out": "parents/WR_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "The Writing Revolution",
  "sub": "From Movable Type to the Digital Age · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": GALLERY_CSS,
  "hero": W.HERO_P1_TITLE,
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "For thousands of years, writing belonged to a few: scribes, monks and the wealthy. This exhibition tells how each new tool, from Gutenberg’s printing press to the typewriter, the computer and the phone in your pocket, opened writing to more people, and why the keys under our fingers are still in the order a newspaper editor chose in 1868. This guide will help you talk about it at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is The Writing Revolution?", "title": "Two posters, a display case and a Typing Station", "body": [
      "**The Writing Revolution** traces who got to write, from scribes to social media, and the new questions that came with the power to publish. **QWERTY’s Accidental Empire** tells the story of the keyboard: how Christopher Latham Sholes arranged the letters so the metal arms of his typewriter would not jam, and why the layout has survived ever since. The **display case** holds a portable Smith-Corona Galaxie typewriter with its original carrying case and a working Apple iMac G3 running AppleWorks."]}),
    ("gallery", [
      {"label": "In the exhibition", "items": [
        {"img": W.POSTER1, "cap": "The Writing Revolution"},
        {"img": W.POSTER2, "cap": "QWERTY’s Accidental Empire"},
        {"img": W.printable(W.ROOM), "cap": "The Typing Station"}]}]),
    ("section", {"label": "At the exhibition", "title": "Four ways in", "list": [
      "**The posters** — each opens on screen panel by panel, with the sounds of writing through the ages: a quill, a printing press, a typewriter, a keyboard",
      "**The Typing Station** — type the same line on a typewriter, where a mistake stays on the page, and on an iMac, where Back space takes it away. Then race the two machines",
      "**The top row** — how many words can you type with only Q W E R T Y U I O P? The poster says *typewriter* is one of the longest",
      "**The class board** — a shared page where a class can post its race times and its words"]}),
    ("connection", ["Explore it together online at any time: the posters and the Typing Station work on a computer, a tablet or a phone."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What sound does a typewriter make? Can you show me with your hands?",
          "Where are the T, the Y, the P and the E on a keyboard?",
          "Who would you write a message to?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "On a typewriter you can’t erase. How would that change how you write?",
          "Which was faster for you: the typewriter or the iMac?",
          "Long ago only a few people could write. Who can write now?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "Why are the letters on a keyboard not in ABC order?",
          W.TALK["p2_familiar"],
          W.TALK["p1_trust"],
          W.TALK["p1_computer"]]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("No erasing", "Write a note to each other in pen, by typewriter rules: no erasing, and a mistake gets written over. Then talk about how it felt to slow down."),
      ("Top-row words", "Find words you can type with only the top row of a keyboard. The poster says *typewriter* is one of the longest. Can you find another as long?"),
      ("By hand and on screen", "The poster says we remember more from printed pages, and that handwriting works the brain differently from typing. Try learning a short list both ways, and see which one you remember tomorrow."),
      ("Ask a grandparent", "Did anyone in your family learn to type on a typewriter, or write letters by hand? Ask them what it was like."),
      ("Hunt the keyboard", "Look at a computer, a phone and a tablet. Is QWERTY on all of them? Why do you think it stayed, even on a screen?"),
      ("Publish something", "Make a one-page newsletter together about your family, your street or your week, the kind of thing the poster says anyone could design at home after 1985.")]),
    ("section", {"label": "The big ideas", "title": "What your child is learning", "list": [
      "**PreK–2:** a typewriter has keys for letters; on a typewriter a mistake stays, on a computer it can be taken away; many more people can write today than long ago",
      "**Grades 3–4:** why the keyboard’s letters are where they are, and the myth that QWERTY was made to slow typists down",
      "**Grades 5–8:** how each technology opened writing to more people; how to read the posters as arguments; what makes a test fair; and how the posters themselves were designed"]}),
    ("section", {"label": "A question for the whole family", "title": "What happens next?", "body": [
      "The poster ends its history with a question: *“" + Q["ai"] + "”* There is no answer in the exhibition, and that is the point. Ask everyone at the table what they think, and why. Its answer is hopeful: *“" + Q["achievement"] + "”*"]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}


DOCS = [FAMILY]
