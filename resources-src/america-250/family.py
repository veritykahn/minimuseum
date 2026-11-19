"""The America 250 Family Resource Guide. Facts follow
app/exhibitions/america-250/america250.ts (both posters, the Many Faiths
note, the display case) and sign/signText.ts (the three rooms)."""
import os as _os, sys as _sys
_sys.path.insert(0, _os.path.dirname(__file__))
from _common import A, CP, TRUMBULL, pic

FAMILY = {
  "out": "parents/A250_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "America 250",
  "sub": "The Declaration of Independence at 250 · A guide for families of children PreK–8",
  "foot": "Family Resource Guide",
  "hero": pic("trumbull.jpg", TRUMBULL, "center 60%"),
  "css": ".grow img { width: 74pt; height: 76pt; object-fit: contain; }",
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "On July 4, 1776, the Continental Congress adopted the Declaration of Independence. Two hundred and fifty years on, this exhibition tells its story as it happened, before it became sacred: who wrote it, who signed it and what they risked, how it was copied, and who was left out of its most famous words. This guide will help you talk about it at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is America 250?", "title": "Two posters, three rooms and a case", "body": [
      "**Before it was Sacred** is built around John Trumbull’s painting of the Declaration presented to Congress. It sets out what the document was in 1776: a legal and diplomatic argument, edited by many hands, largely ignored for years before it became the nation’s founding promise. **We Shall All Hang Together** is built around Emanuel Leutze’s painting of Washington crossing the Delaware. It tells of the fifty-six men who signed knowing it could cost them their lives, a war that nearly was not won, and the many faiths of the founding era."]}),
    ("gallery", [
      {"label": "Four copies of the Declaration, in A Copy of a Copy", "items": [
        {"img": CP + "dunlap.jpg", "cap": "The first printing · July 4–5, 1776"},
        {"img": CP + "goddard.jpg", "cap": "Mary Katharine Goddard’s printing · 1777"},
        {"img": CP + "stone.jpg", "cap": "Stone’s engraving · 1823"},
        {"img": CP + "original.jpg", "cap": "The signed parchment today"}]}]),
    ("section", {"label": "At the exhibition", "title": "Ways in", "list": [
      "**Put Your Name to It** — read the Declaration, dip the quill and sign under the signers; or write and sign *Our Class Declaration* or *My Declaration*, and print it. Nothing you sign is saved or sent.",
      "**A Copy of a Copy** — a detective’s case: one clue to find with a lens on each of four copies, from the first printing to the faded parchment",
      "**Add a Star** — guess the decade each state joined, and grow the flag from 13 stars to 50",
      "**The display case** — a hand-forged iron bolt from Valley Forge, a leaf from Christoph Saur II’s Germantown Bible, and original editions of *The London Evening Post* and *The London Chronicle*"]}),
    ("connection", ["Explore it together online at any time: both posters and all three rooms work on a phone or tablet."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "Why did the leaders sign their names?",
          "Whose name was the biggest?",
          "What promise could our family make, and sign?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "How many stars did the first flag have? Why 13?",
          "When did our state get its star?",
          "What is a constellation?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "The most famous picture of the Declaration is a copy made in 1823. Does that change how you see it?",
          "George Washington never signed it. Why not?",
          "The Declaration says *all men are created equal.* Who was left out in 1776? Abraham Lincoln later called those words the nation’s founding promise. What does it take to keep a promise like that?",
          "Would you have signed, knowing the risk?"]})]]),
    ("section", {"label": "At home", "title": "Four things to try together"}),
    ("cards", [
      ("Make a family declaration", "Write three things your family holds to be true, and three things you promise one another. Then everyone signs. Use the exhibition’s *My Declaration* if you want a parchment to print."),
      ("Count the stars", "Find a flag and count its stars and stripes. Then look up the year your state joined in *Add a Star*: how many stars were on the flag before yours?"),
      ("A copy of a copy", "Have one person copy a short paragraph by hand, the next copy that copy, and so on. Compare the last with the first. What changed?"),
      ("Two paintings", "Look at Trumbull’s and Leutze’s paintings together. Both were painted long after 1776. What did each painter choose to show, and what did he leave out?")]),
    ("section", {"label": "History as it happened", "title": "What surprises people", "body": [
      "Independence was voted on **July 2, 1776**; the Declaration explained the decision two days later. Most delegates signed the parchment on **August 2**. Thomas Jefferson wrote the draft; Benjamin Franklin suggested changes, and the Congress cut Jefferson’s charge against the King over the slave trade. Only one Catholic signed, at a time when Catholics could not hold office in most of the colonies. And for its first years the Declaration was largely ignored. The exhibition tells it plainly: people who took a great risk, and wrote a promise larger than their own time."]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
