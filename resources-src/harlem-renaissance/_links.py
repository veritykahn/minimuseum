"""Where teachers can show the paintings the Harlem Renaissance resources
name. The works are still in copyright, so the PDFs do not reproduce them;
each plan that mentions one gets a box of links to the museums' own pages.
Every link was checked when it was added (October 2026)."""

NYPL = "https://digitalcollections.nypl.org/items/"
WORKS = [
    # (what to look for in the plan, title shown, where, url)
    ("African Setting", "Aspects of Negro Life: The Negro in an African Setting (1934)",
     "Schomburg Center, NYPL", NYPL + "634c59a4-6f99-3618-e040-e00a180633b0"),
    ("Slavery Through Reconstruction", "Aspects of Negro Life: From Slavery Through Reconstruction (1934)",
     "Schomburg Center, NYPL", NYPL + "634ad849-7832-309e-e040-e00a180639bb"),
    ("Idyll of the Deep South", "Aspects of Negro Life: An Idyll of the Deep South (1934)",
     "Schomburg Center, NYPL", NYPL + "634c04bc-fed3-b0e8-e040-e00a18063c1a"),
    ("Song of the Towers", "Aspects of Negro Life: Song of the Towers (1934)",
     "Schomburg Center, NYPL", NYPL + "6ca557ed-9597-5dcd-e040-e00a18065af4"),
    ("The Creation", "The Creation (1935)",
     "Smithsonian American Art Museum", "https://americanart.si.edu/exhibitions/aaron-douglas"),
    ("Harriet Tubman", "Harriet Tubman (1931)",
     "North Carolina Museum of Art", "https://learn.ncartmuseum.org/artwork/harriet-tubman/"),
    ("Migration Series", "Jacob Lawrence, The Migration Series (1940–41)",
     "The Phillips Collection and MoMA", "https://lawrencemigration.phillipscollection.org/"),
]
# "Aspects of Negro Life" named on its own means the whole mural
WHOLE_MURAL = "Aspects of Negro Life"

def _found(doc):
    text = repr(doc["blocks"]) + doc.get("title", "") + doc.get("sub", "")
    hits = [w for w in WORKS if w[0] in text]
    if WHOLE_MURAL in text and not any(w[1].startswith(WHOLE_MURAL) for w in hits):
        hits = [w for w in WORKS if w[1].startswith(WHOLE_MURAL)] + hits
    return hits

def links_block(hits):
    items = " · ".join(f'<a href="{u}">{t}</a>' for _, t, where, u in hits)
    return ("html", '<p class="plinks"><b>Paintings to project</b> (in copyright, so not printed; '
            f'each title links to the museum’s page): {items}</p>')

CSS = (".plinks { font-size: 8.3pt; line-height: 1.4; margin: 4pt 0 0; padding: 4pt 0 0; border-top: .8pt solid var(--accent); max-width: none; }"
       " .plinks a { color: inherit; text-decoration: underline; text-decoration-thickness: .5pt; text-underline-offset: 2pt; }")

# two plans that the links line pushed onto a near-empty page: spacing only
TIGHT = {
    "teachers/grades-3-4/HR_LP_Grades3_4.pdf": ".sec, .task { margin-bottom: 6pt; } p { margin-bottom: 3.5pt; } .hero { height: 1.6in !important; } body { font-size: 9.4pt; }",
    "teachers/grades-5-8/art/HR_LP_Art.pdf": ".sec, .task { margin-bottom: 6pt; } p { margin-bottom: 3.5pt; } .card { padding-bottom: 2pt; } .cards { gap: 7pt; } body { line-height: 1.42; }",
}

def add_links(docs):
    """Each teacher or library plan (no level) gets the box at the end,
    listing the paintings named in the plan or in any handout beside it."""
    import os
    for d in docs:
        if d.get("level"):
            continue
        folder = os.path.dirname(d["out"])
        hits = []
        for e in docs:
            if os.path.dirname(e["out"]) == folder and (e is d or e.get("level")):
                hits += [w for w in _found(e) if w not in hits]
        hits.sort(key=WORKS.index)
        if hits:
            blocks = list(d["blocks"])
            # put the links where the plan says to show a painting, if it does
            at = next((i + 1 for i, b in enumerate(blocks) if "Aaron Douglas image" in repr(b)), len(blocks))
            blocks.insert(at, links_block(hits))
            d["blocks"] = blocks
            d["css"] = d.get("css", "") + CSS + TIGHT.get(d["out"], "")
    return docs
