"""Grades 5–8 · Religion · "Whose Image Is This?"
Built on the Tribute Penny (Case 7) and Matthew 22:15–22. Facts follow
app/exhibitions/in-their-hands/artifacts/coin-data.ts."""

C = "/exhibitions/in-their-hands/artifacts/coins/"
DIR = "teachers/grades-5-8/religion/"
TITLE = "Whose Image Is This?"
SUB = "Grades 5–8 · Religion · The Tribute Penny"

VERSE_MATT = {"text": "“Show me the coin used for paying the tax.” They brought him a denarius, and he asked them, “Whose image is this? And whose inscription?” “Caesar’s,” they replied. Then he said to them, “So give back to Caesar what is Caesar’s, and to God what is God’s.”",
              "ref": "Matthew 22:19–21"}
VERSE_GEN = {"text": "So God created mankind in his own image, in the image of God he created them; male and female he created them.",
             "ref": "Genesis 1:27"}

COIN = {"img": C + "tribute-front.png", "label": "Case 7 · Ministry and Passion", "replica": True,
        "title": "The Tribute Penny",
        "facts": [("Coin", "Silver denarius of Tiberius"), ("Date", "14–37 AD"), ("Reference", "RIC I 30"), ("Scripture", "Matthew 22:21")],
        "body": ["The face is the emperor Tiberius. The inscription calls him *son of the divine Augustus*, and the reverse reads PONTIF MAXIM — *High Priest*. To a faithful Jew, the coin itself was a provocation."]}
HERO = {"img": "/exhibitions/in-their-hands/timeline/tribute-tissot.jpg", "pos": "center 35%",
        "credit": "James Tissot (1836–1902), Brooklyn Museum"}

LESSON = {
  "out": DIR + "ITH_LP_Religion.pdf", "eyebrow": "Teacher lesson plan", "title": TITLE, "sub": SUB,
  "foot": "Teacher Lesson Plan · Grades 5–8 Religion", "hero": HERO,
  "blocks": [
    ("timing", [("Hook", 5, "#7D8471"), ("Teach", 12, "#2F4A5A"), ("Activity", 22, "#86671A"), ("Prayer", 6, "#A8452F")]),
    ("section", {"label": "Learning objective", "title": "What students will understand",
      "body": ["Students will read Jesus’ answer about the Tribute Penny as more than a ruling on taxes. The coin bears Caesar’s image, so it belongs to Caesar; every human person bears God’s image, so every person belongs to God. Students will connect Matthew 22:15–22 to Genesis 1:27 and to the Church’s teaching on the duties of citizens, and reflect on what it means to *give back to God* the life that carries his image."]}),
    ("section", {"label": "Standards and themes", "list": [
      "**Scripture** — Matthew 22:15–22; Genesis 1:26–27",
      "**Catechism** — CCC 2240 (the duties of citizens, including paying taxes) and CCC 2242 (when conscience must refuse an unjust command)",
      "**Catholic Social Teaching** — Life and Dignity of the Human Person; Rights and Responsibilities",
      "**Virtue** — prudence: answering a hard question wisely, without being trapped by it"]}),
    ("section", {"label": "Materials needed", "list": [
      "Bibles, or Matthew 22:15–22 projected",
      "An image of the Tribute Penny (the exhibition page, or the coin on the student handout)",
      "Any coin from a student’s pocket or purse",
      "Differentiated handouts, one per student"]}),
    ("section", {"label": "Hook · 5 minutes", "title": "Read a coin",
      "body": ["Hold up an ordinary coin. *“Whose face is on this? What words are written on it? What is the coin claiming?”* Take answers: a president, a motto, a date, a country. Then: *“Every coin tells you who is in charge. Two thousand years ago, someone handed Jesus a coin and tried to trap him with it.”*"]}),
    ("section", {"label": "Direct instruction · 12 minutes", "title": "The trap and the answer",
      "body": [
        "Read Matthew 22:15–22 aloud. Set out the trap: if Jesus says *pay the tax*, he sides with the occupying power and loses the crowd; if he says *don’t*, he can be reported to Rome as a rebel.",
        "Show the Tribute Penny. The face is Tiberius; the inscription calls him the son of a god; the reverse names him High Priest. For a faithful Jew this was not neutral money — it was an image claiming divine and religious authority.",
        "Jesus asks his questioners to produce the coin — and they can. *“Whose image is this? And whose inscription?”* The coin carries Caesar’s image, so give it back to Caesar. Then the turn: what carries *God’s* image? Read Genesis 1:27. St. Augustine and other early Christian writers drew exactly this line: Caesar looks for his image on his coin; God looks for his image in us."]}),
    ("section", {"label": "Activity · 22 minutes", "body": ["Students choose a handout. All three levels read the same passage and the same coin."]}),
    ("levels", {
      "green": "Read the passage in short parts. Label the coin’s image and inscription, match each to Caesar or to God, and finish the sentence: *I carry God’s image, so…* Draw yourself as a coin stamped with God’s image.",
      "yellow": "Explain the trap and why Jesus’ answer escapes it. Compare the coin with Genesis 1:27 in a two-column chart, then write a paragraph on what *giving back to God* asks of a twelve-year-old today.",
      "red": "Write a structured reflection: is Jesus’ answer about taxes, about idolatry, or about the human person? Use the coin’s inscription, Genesis 1:27 and CCC 2242, and judge a modern case where obeying the state and obeying God might conflict."}),
    ("section", {"label": "Closing prayer · 6 minutes",
      "body": ["Ask students to hold a coin in an open hand. Pray together: *“Lord, the coin carries the image of the one who made it. We carry yours. Help us to give back to you what is yours — our time, our gifts, and our whole selves. Amen.”*"]}),
    ("connection", ["**Visit the exhibition:** find the Tribute Penny in Case 7, *Ministry and Passion*, and look for the inscription. Then walk to the Shekel of Tyre beside it — the coin that paid for the betrayal.",
                    "**Virtual visit:** the coin, its reverse and the full Gospel Timeline are online."]),
    ("section", {"label": "Theological framework", "title": "Image and belonging",
      "body": [
        "**Image means ownership.** In the ancient world, a ruler’s image and name on a coin declared whose authority it served. Jesus does not deny that Caesar has a legitimate claim to what is stamped with his image.",
        "**Image means dignity.** Genesis 1:27 says every human being is made in the image of God. If the coin belongs to Caesar because it bears his image, the person belongs to God for the same reason. Nothing stamped by the state can make that claim on a human life.",
        "**The order of loyalties.** The Church teaches that citizens owe the state real duties, including paying taxes (CCC 2240). But the claim of God comes first: when a command contradicts the moral order, conscience must refuse it (CCC 2242). Jesus’ answer holds both truths at once.",
        "**The coin itself.** Tiberius’ denarius called the emperor divine and named him High Priest. Jesus answers by asking whose image it bears. The question still works on any coin, any flag, any screen that asks for our allegiance."]}),
    ("cols", [
      [("section", {"label": "Scripture connections"}),
       ("refs", [
      ("Matthew 22:15–22", "The question of the tax and Jesus’ answer"),
      ("Genesis 1:26–27", "Humankind made in the image and likeness of God"),
      ("Mark 12:41–44", "The widow’s two small coins, in the same week: giving God everything"),
      ("Romans 13:7", "“Give to everyone what you owe them: if you owe taxes, pay taxes”"),
      ("Acts 5:29", "“We must obey God rather than human beings”")])],
      [("section", {"label": "Cross-curricular and assessment notes", "list": [
      "**Social Studies:** Roman rule in Judaea, client kings and prefects — the coins of Herod, Pilate and Antipas in Cases 6 and 7 show who governed",
      "**Art:** what a ruler chooses to put on a coin, and what Herod’s coins left off because Jewish law forbade human images",
      "**ELA:** the structure of a trap question, and how Jesus answers with a question of his own",
      "**Assessment:** the handout reflection; an exit ticket — *“What carries God’s image, and what do I owe him?”*"]})]]),
    ("section", {"label": "Show your class", "title": "The coin, up close", "body": ["Project or print this page for the hook, or take it to Case 7."]}),
    ("specimen", COIN),
    ("section", {"label": "Questions to ask in front of the case", "list": [
      "What is the first thing you notice about the face on this coin?",
      "If you were a faithful Jew in Jerusalem, how would it feel to carry a coin that called the emperor the son of a god?",
      "The Tribute Penny sits beside the Shekel of Tyre, the coin that paid Judas. What do these two coins, side by side, say about money and loyalty?",
      "Jesus asked his questioners to show him the coin. Why might it matter that they were the ones carrying it?"]}),
  ]}

def handout(level, out, blocks, context):
    return {"out": DIR + out, "eyebrow": "Student handout", "title": TITLE,
            "sub": "Grades 5–8 · Religion", "level": level, "context": context,
            "foot": f"Student Handout · Grades 5–8 Religion · {level.title()} Level", "blocks": blocks, "hero": HERO}

CONTEXT = ["In Jerusalem, a few days before he died, Jesus was handed a silver coin and asked whether God’s people should pay taxes to Rome. His answer is one of the most famous sentences ever spoken about money, power and God."]

GREEN = handout("green", "ITH_Handout_Green_Religion.pdf", [
  ("task", {"label": "Part 1", "title": "Read the story", "blocks": [("verse", VERSE_MATT)],
            "body": ["Some people wanted to trap Jesus. If he said *pay the tax*, the crowd would be angry. If he said *don’t pay*, the Romans could arrest him."],
            }),
  ("task", {"label": "Part 2", "title": "Look closely at the coin", "blocks": [("specimen", COIN), ("table", {"head": ["On the coin", "Whose is it?"], "rows": [
      ["The face on the front", ""], ["The words around the edge", ""], ["The title *High Priest* on the back", ""]]})],
            "body": ["Fill in the table above: does each part of the coin belong to Caesar or to God?"]}),
  ("task", {"label": "Part 3", "title": "Whose image do I carry?",
            "blocks": [("verse", VERSE_GEN)],
            "body": ["The coin belongs to Caesar because it carries Caesar’s image. Genesis says you carry God’s image.",
                     "Finish the sentence: **I carry God’s image, so I belong to…**"], "lines": 2}),
  ("task", {"label": "Part 4", "title": "Give back to God", "body": ["Name **two** things you could give back to God this week. One can be time, one can be a gift or a kindness."], "lines": 2}),
  ("task", {"label": "Part 5", "title": "Draw your coin", "body": ["Draw yourself as a coin. What image is stamped on you? What words go around the edge?"],
            "blocks": [("coindraw", "Your coin")]}),
  ("family", ["Find a coin at home together. Whose face is on it? What do the words say? Then ask: *what does it mean that we carry God’s image?*"]),
], CONTEXT)

YELLOW = handout("yellow", "ITH_Handout_Yellow_Religion.pdf", [
  ("task", {"label": "Part 1", "title": "The trap", "blocks": [("verse", VERSE_MATT)],
            "body": ["Explain the trap. What would happen to Jesus if he answered *yes*? What would happen if he answered *no*?"], "lines": 3}),
  ("specimen", COIN),
  ("task", {"label": "Part 2", "title": "Why the answer works",
            "body": ["Jesus asks for the coin and asks whose image is on it. How does his answer escape the trap without taking either side the questioners wanted?"], "lines": 3}),
  ("task", {"label": "Part 3", "title": "Two images", "blocks": [("verse", VERSE_GEN)],
            "body": ["Compare the coin with the human person."]}),
  ("table", {"head": ["The coin", "The human person"], "rows": [
      ["Whose image does it carry?", ""], ["Who made it?", ""], ["So who does it belong to?", ""], ["What is owed back?", ""]]}),
  ("task", {"label": "Part 4", "title": "Reflect",
            "body": ["Write a paragraph (5–6 sentences): if you carry God’s image, what does *give back to God what is God’s* ask of you this year — at home, at school and online?"], "lines": 5}),
  ("cols", [[("connection", ["In Case 7, the Tribute Penny sits beside the Shekel of Tyre, the coin that paid Judas. Which coin served Caesar, and which betrayed God?"])],
            [("prayer", ["Lord, the coin carries the image of the one who made it. We carry yours. Help us give back to you our time, our gifts and our whole selves. Amen."])]]),
], CONTEXT)

RED = handout("red", "ITH_Handout_Red_Religion.pdf", [
  ("verses", [VERSE_MATT, VERSE_GEN]),
  ("specimen", COIN),
  ("task", {"label": "Part 1", "title": "What is the answer really about?",
            "body": ["Some readers think Jesus’ answer is about taxes. Others think it is about idolatry, because the coin called the emperor divine. Others think it is about the human person, who carries God’s image. Which reading is strongest? Use evidence from the coin and from both passages."], "lines": 5}),
  ("task", {"label": "Part 2", "title": "Two duties",
            "body": ["The Catechism teaches that citizens should pay taxes and share responsibility for the common good (CCC 2240), but that conscience must refuse a command that goes against the moral order (CCC 2242). Peter puts it simply in Acts 5:29: *“We must obey God rather than human beings.”*",
                     "Describe a real or realistic modern situation where a law or an authority asks for something that belongs to God. What should a Christian give to Caesar, and what must be kept for God? Defend your answer."], "lines": 5}),
  ("task", {"label": "Part 3", "title": "Design a coin", "blocks": [
            ("html", "<p>If a coin declares who is in charge, what would a coin for the Kingdom of God look like? Sketch it, then explain the image and inscription you chose.</p>"),
            ("cols", [[("coindraw", "Your coin")], [("lines", 6)]])]}),
  ("connection", ["Compare the Tribute Penny with Herod the Great’s prutah in Case 6, which carries no face because Jewish law forbade it. What does each design say about its ruler?"]),
], CONTEXT)

DOCS = [LESSON, GREEN, YELLOW, RED]
