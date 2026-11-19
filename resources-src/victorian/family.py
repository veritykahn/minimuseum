"""The Victorian Britain Family Resource Guide. Facts follow the two posters
(app/exhibitions/victorian/victorian.ts) and the three rooms: the Christmas
Card Maker, the Inventions Workshop and Dickens' Christmas Parlour."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _vic import *  # noqa: F401,F403

ROOMS = [(V + "rooms/christmas-card.webp", "Christmas Card Maker", "Design and print a Victorian Christmas card"),
         (V + "rooms/inventions.webp", "Inventions Workshop", "The railway, the telegraph and photography, hands on"),
         (V + "rooms/christmas-parlour.webp", "Dickens’ Christmas Parlour", "Open the parts of a Victorian Christmas")]


def rooms_row():
    figs = "".join(f'<figure><img src="{pic(p)}" alt=""><figcaption><b>{n}</b>{s}</figcaption></figure>' for p, n, s in ROOMS)
    return f'<div class="row" style="--n:3">{figs}</div>'


FAMILY = {
  "out": "parents/VIC_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Victorian Britain",
  "sub": "Material and domestic life · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": CSS + ".row img { aspect-ratio: 8 / 5; }",
  "hero": {"img": VILLAGE, "pos": "center 60%"},
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "Queen Victoria reigned from 1837 to 1901, and in those years Britain changed fast: railways, the telegraph and photography spread, a great museum opened its doors to everyone, and Christmas grew from a day hardly celebrated into the biggest celebration of the year. This guide will help you talk about the exhibition at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is Victorian Britain?", "title": "Two posters, three rooms", "body": [
      "**Revolutionary Victorian Britain,** the first poster, tells of the age’s inventions, its fashion and the founding of the Victoria and Albert Museum (the V&A) in 1852 — *“a schoolroom for everyone,”* in the words of its first director, Henry Cole. The second, **Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas,** tells how the Christmas tree, the Christmas card and Charles Dickens’ *A Christmas Carol* (1843) made the season we know. Beside the posters, three rooms invite children to try things with their own hands."]}),
    ("html", rooms_row()),
    ("section", {"label": "At the exhibition", "title": "Things to try", "list": [
      "**Christmas Card Maker** — choose a picture, a border, a paper and a greeting, then print and fold a card. The first Christmas card was sent by Henry Cole in 1843.",
      "**Inventions Workshop** — steam down the line from London as towns give up their own time for railway time; build a telegraph and tap out Morse code; make a photographic negative and print from it.",
      "**Dickens’ Christmas Parlour** — open the parts of a Victorian parlor one by one, from the fire in the grate to the candles on the tree, and tell a ghost story by the fire, as the Victorians did."]}),
    ("connection", ["Explore it together online at any time: the posters and all three rooms work on a phone or tablet, and nothing your child writes is saved or sent."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What was in the Victorian parlor? What made it feel warm?",
          "What would you put on a Christmas card?",
          "How can we be kind to someone this Christmas?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "The first Christmas card was sent in 1843. Who would you send yours to, and what would it say?",
          "Robins, holly and snowy scenes became Christmas symbols. Which symbols does our family use?",
          "Why do you think people liked sending cards?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "Before the telegraph, how long might a message take? What changed when it could travel down a wire?",
          "Every town once kept its own time by the Sun. What would be hard about that?",
          "Why did people in early photographs have to keep so still?",
          "Poster 1 says the age was *revolutionary*. Was it revolutionary for everyone? Who was left out?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("Make a card", "Fold a sheet of paper and design a Victorian-style card: a robin, a wreath or a snowy church, a border, and a greeting such as *“A merry Christmas and a Happy New Year,”* the words on the very first card."),
      ("Tap a message", "Learn a few letters of Morse code together — E is one dot, T one dash, S three dots, O three dashes — and tap messages on the table."),
      ("Light and shadow", "Lay leaves or keys on dark paper in a sunny window for a few days and see what the sunlight leaves behind. In 1843 Anna Atkins made blue prints of seaweed by laying the plants on sun-sensitive paper."),
      ("Sun time", "Look up when the sun is highest in your town and in a town far to the east or west. Before railway time, each town set its clocks by its own noon."),
      ("Tell a ghost story", "Turn the lights down and take turns adding a sentence. Dickens wrote of *“telling Winter Stories — Ghost Stories”* round the Christmas fire."),
      ("Look at a pattern", "Find a border on a plate, a rug or a book cover. What shape repeats? Is it the same on both sides? The V&A was founded to teach everyone to look at design.")]),
    ("section", {"label": "Read together", "title": "Books and stories", "list": [
      "**PreK–2:** a picture-book retelling of *A Christmas Carol*; any book about robins, snow or winter traditions",
      "**Grades 3–5:** *A Christmas Carol* in an abridged edition; books about trains and the telegraph",
      "**Grades 6–8:** *A Christmas Carol* in full — first published in 1843 as *A Christmas Carol in Prose. A Ghost Story of Christmas*"]}),
    ("section", {"label": "A note on hard history", "body": [
      "The first poster is honest that the age’s progress did not reach everyone: *“Social reform improved conditions for workers, while class divisions and urban challenges persisted.”* For older children it gives one example: an 1842 report on children working in coal mines shocked the public, and a new law barred women, girls and boys under ten from working underground — a first step, hard to enforce with one inspector for the whole country. Younger children do not need the details; older ones may want to talk about who gained from change, and who did not."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
