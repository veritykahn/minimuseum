"""The Women's History Month Family Resource Guide. Facts follow
app/exhibitions/womens-history/ (womensHistory.ts, violet/, remembered/),
modelled on the In Their Hands family guide."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import POSTER1, POSTER2, AF_KLINT_CREDIT, PIC_CSS, photos, md

CSS = PIC_CSS + """
.posters { display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; margin: 4pt 0 10pt; break-inside: avoid; }
.posters img { width: 100%; height: 150pt; object-fit: contain; display: block; }
.posters figcaption { font: 400 7.6pt/1.35 'Outfit'; color: #3f3e3a; margin-top: 3pt; text-align: center; }
"""

FAMILY = {
  "out": "parents/WH_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "Letters From the Blitz",
  "sub": "Women’s History Month · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": CSS,
  "hero": {"img": POSTER2, "pos": "center 62%"},
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "Women’s History Month, celebrated every March, honors the achievements and contributions of women throughout history. This exhibition celebrates it in two ways: with the story of the month itself, and with the life of one ordinary woman, Violet Dina Want, a London factory machinist and mother of four, born in 1907. This guide will help you talk about the exhibition at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is in the exhibition?", "title": "Two posters, a display case and two rooms", "body": [
      "**Poster 1** tells how Women’s History Month began: as a week-long celebration in Santa Rosa, California, in 1978, which grew into a national week in 1980 and the whole month of March by 1987. It carries a painting by the Swedish artist Hilma af Klint, and a panel on the work women did in the Second World War. **Poster 2** is Violet’s biography, written down by her family so it would not be lost, with four family photographs. **The display case** holds one object: *original Blitz bomb-damaged family letters from Violet Dina Want’s estate*."]}),
    ("html", '<div class="posters"><figure><img src="' + POSTER1 + '" alt=""><figcaption>Poster 1 · Women’s History Month</figcaption></figure>'
             '<figure><img src="' + POSTER2 + '" alt=""><figcaption>Poster 2 · Biography of a Working Class Woman</figcaption></figure></div>'),
    ("section", {"label": "Online", "title": "Two rooms to explore together", "list": [
      "**Violet’s Life** — her story stop by stop, each with a small keepsake: a house, a sewing machine, a coat, a piano, a rose",
      "**Who Gets Remembered?** — of the 50 people with the most public monuments in the United States, only three are women; *Tip the scale* asks which facts are evidence, and *Talk About It* is a guide to interviewing a woman in your own family"]}),
    ("section", {"label": "A note before you share it", "body": [
      "Poster 2 tells plainly how the bombing of the Blitz destroyed the family’s homes, and how Violet’s mother was killed. The classroom lessons for PreK to Grade 4 tell only Violet’s home and family life. With younger children, you may want to read the poster first and choose what to share."]}),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "How many people were in Violet’s big family?",
          "Violet played the piano at parties. What music do we play at ours?",
          "Who keeps our family’s photographs and letters?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "Which of Violet’s keepsakes would you choose for your own life?",
          "Violet made coats small for her children. What has someone made for you?",
          "What would you put in a letter to someone you love?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "Why might so few women have monuments?",
          "What can a family photograph tell us? What can’t it?",
          "Many women in wartime did jobs people had said only men could do. Are there jobs people still call “for boys” or “for girls”?",
          "Whose everyday story in our family deserves to be remembered, and why?"]})]]),
    ("section", {"label": "At home", "title": "Things to try together"}),
    ("cards", [
      ("Interview a grandmother", "Choose a woman who is family to you. Ask questions that begin with *How*, *What* or *Why*, and let quiet moments be. *Talk About It* has questions to start with."),
      ("A keepsake timeline", "Draw a line across a page. Choose a small object for each part of a life, yours or a relative’s, and draw it in its place, as the *Violet’s Life* room does."),
      ("Read an old photograph", "Find an old family photograph. What can you see? What would you need to ask someone to know more?"),
      ("Count your street", "On a walk, count the statues, plaques and street names that honor people. How many honor women?"),
      ("Grow something", "Violet grew roses at the bottom of her garden, and vegetables too. Plant a seed together, in a pot or a garden."),
      ("Write a letter", "Violet’s family kept their letters. Write one to someone in your family, and keep a copy for the future.")]),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org. Poster 1’s painting: " + AF_KLINT_CREDIT + "."]}),
  ]}

DOCS = [FAMILY]
