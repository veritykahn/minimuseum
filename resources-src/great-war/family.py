"""The Great War Family Resource Guide. Facts follow
app/exhibitions/great-war/greatWar.ts (the two posters, their talk
questions and the display case), silence/ and memorial/."""

import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _gw import *  # noqa: E402,F403

FAMILY = {
  "out": "parents/GW_Parent_Guide.pdf", "eyebrow": "Family resource", "title": "The Great War",
  "sub": "When the Guns Fell Silent · A guide for families of children PreK–8",
  "foot": "Family Resource Guide", "css": CASE_CSS + ".grow img { object-fit: contain; width: 110pt; height: 90pt; }",
  "hero": {"img": SILHOUETTE, "pos": "center 45%"},
  "blocks": [
    ("section", {"label": "Welcome", "body": [
      "At 11:00 AM on November 11, 1918, the guns of the Great War fell silent. This exhibition remembers the young Americans who served in that war, the doughboys, and the moment the fighting stopped, which is why Americans keep Veterans Day on November 11. This guide will help you talk about the exhibition at home, whether your child visited with their class or you explore it online together."]}),
    ("section", {"label": "What is The Great War?", "title": "Two posters, a display case and two rooms online", "body": [
      "**The Doughboys: America’s Sons in The Great War** tells of the farmers, factory workers and teenagers who crossed the Atlantic after America entered the war in April 1917. **When the Guns Fell Silent at the 11th Hour** tells of the armistice, the poppies, and how November 11 became Armistice Day and then Veterans Day.",
      "**The display case** holds an M1917 Brodie doughboy helmet with an American Legion decal, and a US Army issue shaving kit, beside a backlit silhouette display and soldier cards to take home. **Online,** *When the Guns Fell Silent* is a short film of the last minute of the war, and *The Memorial* lets you place a poppy, remember one American who died, and keep the two minutes’ silence."]}),
    ("gallery", [
      {"label": "In the exhibition", "items": [
        {"img": POPPIES, "cap": "Poppies · remembrance"},
        {"img": disk(HELMET), "cap": "The Brodie helmet · the display case"},
        {"img": disk(KIT), "cap": "A US Army shaving kit · the display case"}]}]),
    ("section", {"label": "A hard subject, gently", "body": [
      "The posters for older children speak honestly about the trenches and about how many people died. For the youngest, keep to what the exhibition’s youngest lessons keep to: remembering, peace, poppies, the quiet at eleven o’clock, and the people at home. Let your child’s questions lead, and it is fine to say *we don’t know*."]}),
    ("connection", ["Explore it together online at any time: the posters, the film and The Memorial all work on a phone or tablet."]),
    ("section", {"label": "Talking with your child", "title": "Questions to start with"}),
    ("cols", [
      [("section", {"label": "PreK–K", "list": [
          "What color are poppies? Why do people wear them in November?",
          "What happens at eleven o’clock on November 11?",
          "Who would you like to say thank you to?"]}),
       ("section", {"label": "Grades 1–2", "list": [
          "Soldiers wore a steel *tin hat*. What else did they carry?",
          "Why do you think soldiers kept their razors when they came home?",
          "How can we be quiet together to remember?"]})],
      [("section", {"label": "Grades 3–8", "list": [
          "They were farmers, factory workers and teenagers. What do you think it felt like to leave an ordinary life at home and go to war?",
          "Imagine the moment the guns stopped. What do you think the soldiers on both sides felt in that silence?",
          "Why do you think a small flower like the poppy became a way to remember so many people?",
          "The poster ends with a promise: *you will not be forgotten.* How could you keep that promise in your own way?"]})]]),
    ("section", {"label": "At home", "title": "Six things to try together"}),
    ("cards", [
      ("Keep the silence", "At 11:00 AM on November 11, stop together for two minutes, as Americans did in 1919. Afterward, talk about what you heard and thought."),
      ("Make a poppy", "Draw, paint or fold a red poppy. The poster says poppies were often the only living things that grew on the battlefields, and that people wear them in November to remember."),
      ("Remember one person", "In *The Memorial*, choose *Remember a soldier* and search by your own state. Read one card aloud together: a name, a home, a date, a resting place."),
      ("Ask who served", "Does anyone in your family or neighborhood have a story of serving? Veterans Day honors all American veterans. A thank-you note is a good place to start."),
      ("Listen together", "Each poster has its own music: Sousa’s marches in the room about the doughboys, and two slow pieces called Largo in the room about the end of the war. Which fits which, and why?"),
      ("Watch the last minute", "Older children can watch *When the Guns Fell Silent* together with you: six title cards, a 1918 record of the guns, and then the silence.")]),
    ("section", {"label": "Why November 11?", "title": "From Armistice Day to Veterans Day", "body": [
      "In 1919, President Woodrow Wilson proclaimed November 11 *Armistice Day*, and at 11:00 AM Americans paused their work for two minutes to honor the fallen. In 1954, after World War II and the Korean War, Congress changed the name to *Veterans Day*, to honor all American veterans. Canada, Britain and France still call it Remembrance Day. At Arlington National Cemetery, a wreath is placed at the Tomb of the Unknown Soldier, *honoring all those whose names we’ll never know but whose sacrifice we’ll never forget.*"]}),
    ("section", {"label": "About the Mini Museum", "body": [
      "The Mini Museum brings curated exhibitions of real artifacts, specimens and primary sources into schools, with lesson plans and a digital companion at minimuseumproject.org."]}),
  ]}

DOCS = [FAMILY]
