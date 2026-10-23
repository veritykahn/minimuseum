#!/usr/bin/env python3
"""Exports lesson plans as JSON for the site's Lesson mode.

The lesson plans are written once, as data, in resources-src/<exhibition>/*.py.
build.py prints them to PDF; this script turns the same data into the JSON
the site reads to run a lesson on the classroom screen, so the PDF and the
screen can never disagree:

    python3 resources-src/export_lessons.py in-their-hands

A lesson plan takes part when it has a "slug" and at least one section
carries a "screen" (see religion_5_8.py). A module may hold several plans
(see seeing-is-deceiving/subjects_a.py): each plan in its DOCS with a "slug"
is exported, with the leveled handouts printed into the same folder. Each
screened section becomes one or more timed steps; its paragraphs (or its
bullets, if it has no paragraphs) become the teacher's script. Output goes
to lib/lessons/<exhibition>/<slug>.json. Copy keeps its **bold** / *italic*
markup; the site renders it.
"""
import importlib.util, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import build  # noqa: E402  (colors and levels, so the screen matches the print)


SHOWS = ("question", "coins", "painting", "coin", "verse", "levels", "review", "prayer",
         "chart", "gallery", "numberline", "worked", "pair", "people", "person", "image")


def load_module(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def flat(blocks):
    """The blocks in reading order, with any set side by side in "cols"
    taken out of their columns, so a timed section can sit in one."""
    for k, d in blocks:
        if k == "cols":
            for col in d:
                yield from flat(col)
        else:
            yield k, d


def section_minutes(label):
    m = re.search(r"(\d+)\s*minutes?", label)
    return int(m.group(1)) if m else None


def section_name(label):
    return re.split(r"\s*·\s*", label)[0]


def slugify(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def pdf_href(exhibition, out):
    return f"/resources/{exhibition}/{out}"


def with_screen_sections(lesson):
    """The plan's sections in reading order, with its "screen_sections" set
    in: the screens for a part of the plan that prints as html rather than
    as a section (a numbered list, a row of cards). Each names the printed
    section it follows ("after") and carries a label, paragraphs and a
    screen as a section would. It is never printed."""
    sections = [d for k, d in flat(lesson["blocks"]) if k == "section"]
    for extra in lesson.get("screen_sections", []):
        at = next((n for n, d in enumerate(sections) if d["label"] == extra["after"]), None)
        if at is None:
            raise ValueError(f"screen section {extra['label']!r}: no section {extra['after']!r} to follow")
        sections.insert(at + 1, extra)
    return sections


def export(exhibition, module, lesson=None):
    lesson = lesson or module.LESSON
    blocks = lesson["blocks"]
    timing = next((d for k, d in blocks if k == "timing"), [])
    colors = {name: color for name, _, color in timing}
    phases = [{"name": n, "minutes": mins, "color": c} for n, mins, c in timing]

    sections = with_screen_sections(lesson)
    by_label = {section_name(d["label"]).lower(): d for d in sections}

    steps = []
    for d in sections:
        screen = d.get("screen")
        if not screen:
            continue
        screens = screen if isinstance(screen, list) else [screen]
        body = d.get("body", [])
        # what the teacher reads: the paragraphs, then the bullets
        lines = list(body) + list(d.get("list", []))
        total = section_minutes(d["label"])
        split = sum(s.get("minutes", 0) for s in screens)
        if len(screens) > 1 and total is not None and split != total:
            raise ValueError(f"{d['label']}: screens add to {split} minutes, the section says {total}")
        for s in screens:
            s = dict(s)
            phase = s.pop("phase")
            if phase not in colors:
                raise ValueError(f"{d['label']}: phase {phase!r} is not in the timing bar")
            minutes = s.pop("minutes", total)
            picks = s.pop("script", None)
            # an index picks one of the section's paragraphs, counting on into
            # its bullets; a string is read as it stands (a card from the
            # plan's "Show your class" page, a line the plan sets in html)
            script = ([lines[i] if isinstance(i, int) else i for i in picks]
                      if picks is not None else list(body or lines))
            title = s.pop("title", None) or d.get("title") or section_name(d["label"])
            show = s.pop("show")
            if show not in SHOWS:
                raise ValueError(f"{d['label']}: show {show!r} is not one of {SHOWS}")
            # what the step is for (the teacher's) and what students do (the screen's)
            purpose = s.pop("purpose", None)
            students = s.pop("students", None)
            screen_data = {"kind": show, **s}
            if show == "levels":
                levels = next((v for k, v in flat(blocks) if k == "levels"), {})
                screen_data["levels"] = [
                    {"key": key, "name": build.LEVELS[key][0], "sub": build.LEVELS[key][1],
                     "color": build.LEVELS[key][2], "summary": text}
                    for key, text in levels.items()]
                if not students:
                    screen_data.setdefault("note", body[0] if body else "")
            if show in ("coins", "review", "pair", "people", "person") and not students:
                raise ValueError(f"{d['label']}: a {show!r} screen shows its students list, and has none")
            if show == "chart":
                bad = [r["cells"][0] for r in s["rows"] if len(r["cells"]) != len(s["columns"])]
                if bad:
                    raise ValueError(f"{d['label']}: chart rows {bad} do not match its {len(s['columns'])} columns")
            if show == "image" and not (s.get("img", {}).get("img") and s.get("alt")):
                raise ValueError(f"{d['label']}: an 'image' screen needs img {{img}} and alt")
            if show == "numberline":
                for a, b in s["line"].get("hops", []):
                    if not 0 <= a < b <= 100:
                        raise ValueError(f"{d['label']}: a hop must run left to right inside the line")
            step = {"id": slugify(title), "phase": phase, "color": colors[phase],
                    "section": section_name(d["label"]), "title": title,
                    "minutes": minutes, "script": script, "screen": screen_data}
            if purpose:
                step["purpose"] = purpose
            if students:
                step["students"] = list(students)
            steps.append(step)

    planned = sum(p["minutes"] for p in phases)
    stepped = sum(s["minutes"] for s in steps)
    if planned != stepped:
        raise ValueError(f"steps add to {stepped} minutes, the timing bar to {planned}")
    ids = [s["id"] for s in steps]
    if len(set(ids)) != len(ids):
        raise ValueError(f"step titles must be unique: {ids}")

    handouts = []
    folder = os.path.dirname(lesson["out"])
    for doc in module.DOCS:
        lv = doc.get("level")
        # a module may hold several plans: a plan's handouts print beside it
        if lv and os.path.dirname(doc["out"]) == folder:
            name, sub, color = build.LEVELS[lv]
            handouts.append({"key": lv, "name": name, "sub": sub, "color": color,
                             "href": pdf_href(exhibition, doc["out"])})

    def body_of(key):
        d = by_label.get(key)
        return d.get("body", []) if d else []

    def list_of(key):
        d = by_label.get(key)
        return d.get("list", []) if d else []

    obj = next((v for k, v in flat(blocks) if k == "objectives"), None)
    objectives = None
    if obj:
        # "screen": the same objectives in a young child's words, for the
        # classroom screen only; the plan and the notes keep the teacher's
        young = obj.get("screen") or {}
        said = young.get("items", [])
        if said and len(said) != len(obj["items"]):
            raise ValueError("objectives: the screen wording needs one line per objective")
        objectives = {"heading": obj["heading"], "why": obj.get("why", ""),
                      **({"screenHeading": young["heading"]} if young.get("heading") else {}),
                      "items": [{"text": t, "question": q, **({"deeper": True} if deep else {}),
                                 **({"screen": said[k]} if said else {})}
                                for k, (t, q, deep) in enumerate(obj["items"])]}

    # the plan's questions for the class: "in front of the case" by default,
    # or whatever the plan calls them ("Questions for story time")
    asked = next((d for d in sections if d["label"].lower().startswith("questions") and d.get("list")), None)
    questions = {"questions": asked["list"] if asked else []}
    if asked and asked["label"].lower() != "questions to ask in front of the case":
        questions["questionsLabel"] = asked["label"]

    ex = build.EXHIBITIONS[exhibition]
    connection = (lesson.get("screen_connection")
                  or next((v for k, v in flat(blocks) if k == "connection"), []))
    return {
        "_source": f"Generated by resources-src/export_lessons.py from resources-src/{exhibition}/"
                   f"{os.path.basename(module.__file__)}. Edit the Python, not this file.",
        "slug": lesson["slug"],
        **({"large": True} if lesson.get("large") else {}),
        "exhibition": {"slug": ex["slug"], "name": ex["name"], "accent": ex["accent"],
                       "text": ex["text"], "big": ex["big"]},
        "title": lesson["title"],
        "sub": lesson["sub"],
        # the cover's picture: the plan's own, unless the screen wants another
        "hero": lesson.get("screen_hero") or lesson.get("hero"),
        "objective": body_of("learning objective"),
        **({"objectives": objectives} if objectives else {}),
        # "screen_materials" and "screen_connection" carry the plan's own lists
        # when it prints them as html rather than as a section or block
        "materials": lesson.get("screen_materials") or list_of("materials needed"),
        **questions,
        "connection": connection,
        "totalMinutes": planned,
        "phases": phases,
        "steps": steps,
        "lessonPlan": pdf_href(exhibition, lesson["out"]),
        "handouts": handouts,
    }


def main(exhibition):
    folder = os.path.join(HERE, exhibition)
    out_dir = os.path.join(ROOT, "lib", "lessons", exhibition)
    os.makedirs(out_dir, exist_ok=True)
    for f in sorted(os.listdir(folder)):
        if not f.endswith(".py") or f.startswith("_"):
            continue
        m = load_module(os.path.join(folder, f))
        for lesson in m.DOCS:
            if "slug" not in lesson or not any(d.get("screen") for d in with_screen_sections(lesson)):
                continue
            data = export(exhibition, m, lesson)
            out = os.path.join(out_dir, data["slug"] + ".json")
            with open(out, "w", encoding="utf-8") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            print("exported", os.path.relpath(out, ROOT), f"({len(data['steps'])} steps)")


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in build.EXHIBITIONS:
        sys.exit(f"usage: export_lessons.py <{'|'.join(build.EXHIBITIONS)}>")
    main(sys.argv[1])
