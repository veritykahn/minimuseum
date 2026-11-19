"""The Black History Month Family Resource Guide. Facts follow the two
posters (blackHistory.ts), the Black Barbie Timeline (timeline/timelineStops.ts),
Who Do You See? (representation/representationText.ts, dollArt.ts) and the
display case's record lines (BLACK_HISTORY_CASE). The dolls are drawn for
the guide, in the Design a doll tab's own skin-tone swatches."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _bh import *  # noqa: F401,F403

FAMILY_DOLLS = dolls([
  doll("t1", "afro", "black", "#E8372C", h=72),
  doll("t3", "puffs", "darkbrown", "#2F7D5B", glasses=True, h=72),
  doll("t5", "braids", "black", "#D9541E", h=72),
  doll("t2", "bun", "black", "#7B4FA0", h=72),
  doll("t4", "short", "chestnut", "#1F5FA8", h=72)])

FAMILY = {
  "out": "parents/BH_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Black History Month",
  "sub": "Black Barbie & Representation · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "hero": HERO_RING, "css": HERO_CSS + DOLL_CSS + """
.dolls { gap: 22pt; margin: 2pt 0 10pt; }
""",
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "This exhibition asks two questions: how did Black history come to have a month of its own, and why does it matter for children to see toys, books and pictures that look like them? This guide will help you talk about it at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is in the exhibition?", "title": "Two posters, two rooms and a display case", "list": [
      "**Poster 1, *Black History Month*** — how the historian Carter G. Woodson created Negro History Week in 1926, which later became Black History Month, and chose February for the birthdays of Abraham Lincoln and Frederick Douglass",
      "**Poster 2, *The Importance of Black Barbie*** — the first Black Barbie, introduced by Mattel in 1980 and designed by Kitty Black Perkins, *“a trailblazing Black fashion designer at Mattel”*",
      "**The Black Barbie Timeline** — from Francie (1967) and Christie (1968) to the AKA Centennial Barbie (2008) and the *So In Style* line (2009): children guess the year of each stop",
      "**Who Do You See?** — design a doll; learn about Kenneth and Mamie Phipps Clark’s doll tests and *Brown v. Board of Education*; and count who is in your books",
      "**The display case** — boxed Nigerian and Ghanaian editions, the Inspiring Women dolls of Ida B. Wells, Madam C. J. Walker and Bessie Coleman, and an illustrated timeline of Black representation in toy design"]}),
    FAMILY_DOLLS,
    ("connection", ["Explore it together online at any time: the posters, the timeline and *Who Do You See?* all work on a phone or tablet, and the posters can be read aloud to you."]),
    ("section", {"label": "A note on the Doll Test", "body": [
      "The *Doll Test* tab tells how the psychologists Kenneth and Mamie Phipps Clark studied the effects of segregation on Black children, and how their work became part of the evidence in *Brown v. Board of Education*: on May 17, 1954, the Supreme Court decided unanimously that school segregation violated the Fourteenth Amendment. It is written for older students, with a teacher leading. If your child talks about it, keep the talk on what the children in the study had been taught, never on the children themselves, and don’t repeat the test."]}),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "Which doll did you like best? What did it look like?",
          "Why do you think it matters for children to see toys that look like them?",
          "If you designed a doll, what would it look like?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "Negro History Week became a whole month. Why do you think it grew?",
          "Why did Carter G. Woodson want schoolchildren to learn Black history?",
          "What would you give a museum to keep safe?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "Mattel made Black dolls before 1980. Why does the poster call them *problematic*?",
          "What did Kitty Black Perkins design differently?",
          "Why might it be important to remember the hard parts of history as well as the achievements?",
          "What can toys, books and pictures tell children about who belongs? What would you want them to show?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("Who’s on your shelf?", "Pick the books at home with a main character. Who did you find the most of? Who was hardest to find? Which books would you add to make your shelf look more like the world?"),
      ("Design a doll", "Draw a doll together and decide everything: skin tone, face, hair, clothes, and something extra such as glasses. Then explain each choice."),
      ("A week becomes a month", "Find February on a calendar. Color one week, as Negro History Week was, and then the whole month."),
      ("Keep it safe", "Poster 1 says that preserving culture and heritage helps history be recognized and valued. Choose one story, photo or object your family keeps, and tell your child why it matters."),
      ("Ask about toys", "Ask a grandparent or older relative: what toys did you have as a child? Did any of them look like you?"),
      ("Make a timeline", "Put a few of your family’s own milestones in order on a strip of paper, the way the Black Barbie Timeline does.")]),
    ("section", {"label": "Find out more", "body": [
      "Poster 1 points visitors to the *Cultural Expressions* exhibition at the National Museum of African American History & Culture."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
