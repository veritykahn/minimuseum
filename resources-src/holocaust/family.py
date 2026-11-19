"""The International Holocaust Remembrance Day Family Resource Guide.
Every fact follows holocaust.ts (the two posters, the display case and the
rooms), the Walk, A Minute's Stillness, Lay a Stone and the Timeline of the
Holocaust. The exhibition is recommended for grades 6 and up, so this guide
is for families of children in grades 5–8, and says what the exhibition
says about younger children."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import CANDLES, BERLIN, BIRKENAU, TEACH_NOTE, STONE_CUSTOM, SHOAH_LINE, WIESEL_HUMANKIND, PHOTO_CSS, FOOT_CSS, photo

CSS = FOOT_CSS + PHOTO_CSS + """
.photos3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 12pt; break-inside: avoid; }
.photos3 .photo img { height: 96pt; }
.hero { height: 2.1in; }
"""

def ital(s):
    import re, html
    return re.sub(r"\*(.+?)\*", r"<i>\1</i>", html.escape(s))

PHOTOS = ('<div class="photos3">'
          + photo(CANDLES["img"], "<b>Candles</b> lit to remember.", ital(CANDLES["credit"]))
          + photo(BERLIN["img"], "<b>The Memorial to the Murdered Jews of Europe</b>, Berlin.", ital(BERLIN["credit"]))
          + photo(BIRKENAU["img"], "<b>The International Monument</b> at Auschwitz II-Birkenau.", ital(BIRKENAU["credit"]))
          + "</div>")

FAMILY = {
  "out": "parents/HOL_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Holocaust Remembrance Day",
  "sub": "Never Forget · A guide for families of children in grades 5–8",
  "foot": "Family Resource Guide", "css": CSS,
  "hero": CANDLES,
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "International Holocaust Remembrance Day is observed every year on **January 27**, the day Auschwitz-Birkenau was liberated in 1945. It remembers the six million Jewish people murdered by the Nazi regime, and the millions of other victims who were persecuted. This guide will help you talk about the exhibition at home, whether your child visited with their class or you explore it online together.",
      f"**A note on age.** The exhibition says: *{TEACH_NOTE}* Nothing in it is graphic. If your child is younger than sixth grade, look at it yourself first, and then explore it side by side."]}),
    ("section", {"label": "What was the Holocaust?", "body": [SHOAH_LINE + " The Nazis also persecuted and murdered Roma, people with disabilities, political prisoners and others."]}),
    ("section", {"label": "At the exhibition", "title": "Two posters, four rooms and a display case", "list": [
      "**Two posters** — *International Holocaust Remembrance Day*, on why the day is kept, and *What Was the Holocaust?*, from what it was, step by step, to children, rescue and what came after",
      "**The Walk** — a short film of the history, then a walk across a floor of iron faces and empty shoes, remembering children by name",
      "**Lay a Stone** — a stone laid on the memorial, and the days counted to January 27",
      "**A Minute’s Stillness** — the words of Pastor Martin Niemöller, and one quiet minute with a name, someone’s words and a question",
      "**The Timeline of the Holocaust** — from January 1933 to May 1945, a date at a time, with photographs of places and memorials",
      "**The display case** — an original 1 Krone note made for the Theresienstadt ghetto; a replica of a brass mezuzah recovered in Warsaw by a survivor; and brass and pottery Shabbat candle holders"]}),
    ("connection", ["Explore it together online at any time. Turn the sound on: the posters have no music, only three quiet sounds."]),
    ("html", PHOTOS),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "To begin", "list": [
          "What did you see or read that you keep thinking about?",
          "Whose name or story do you remember? What do you remember about them?",
          "The Holocaust *did not happen all at once*. What came first?"]})],
      [("section", {"label": "To go further", "list": [
          "Anne Frank kept writing while she was in hiding. Why do you think writing mattered so much to young people then?",
          "Whole villages, and a whole country, helped their neighbors. What helps people act together for others?",
          "Martin Niemöller’s words are about people who did not speak out. When is it hard to speak up for someone else?"]})]]),
    ("section", {"label": "Talking about hard history", "title": "A few things that help", "list": [
      "**Let questions lead.** Ask what your child noticed before you explain. It is fine to say *“I don’t know — let’s find out together.”*",
      "**People, not numbers.** The exhibition remembers people by name: Anne and Margot Frank, Anna Lehnkering, Otto Rosenberg, Martha Blend. Start with one person.",
      "**Precise words.** The people were *murdered*, not *lost*. The Holocaust was carried out by people, step by step, and others chose to help.",
      "**End with something hopeful and true.** The rescuers, the survivors who chose *“to work for humankind”*, and the ways we remember today."]}),
    ("section", {"label": "At home", "title": "Things to try together"}),
    ("cards", [
      ("Light a candle", "Every year on Holocaust Memorial Day, people across the UK light a candle in their window “to remember those murdered and to stand against hatred today.” Light one together on January 27, and say a name."),
      ("Lay a stone", STONE_CUSTOM + " Talk about how your family remembers people you have lost."),
      ("Keep a minute", "Keep one quiet minute together, as the exhibition’s last room invites. Afterward, share one thing you thought about."),
      ("Write it down", "Anne Frank wrote: “When I write I can shake off all my cares.” What would you want to write down, so that it is remembered?"),
      ("Notice small steps", "Steven Frank remembered being no longer allowed in the park, the swimming pool or the zoo. Talk about how to notice, and speak up, when someone is shut out."),
      ("Help someone", "Miep Gies brought food and library books to the eight people hiding in the Annex. She said: “We did our human duty: helping people in need.” Choose one small thing to do for someone else this week.")]),
    ("section", {"label": "After the war", "title": "Remembering", "body": [
      f"Elie Wiesel survived Auschwitz and Buchenwald as a boy and spent his life helping the world remember. He wrote: *{WIESEL_HUMANKIND}* International Holocaust Remembrance Day also honors those affected by later genocides, in Cambodia, Rwanda, Bosnia and Darfur."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
