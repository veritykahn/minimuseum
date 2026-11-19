'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { srOnly } from '@/lib/a11y';
import DollArt, { type DollView } from './DollArt';
import { CANVAS } from './dollShapes';
import {
  CLOTH_COLOURS,
  COVERINGS,
  EYE_COLOURS,
  EYE_SHAPES,
  FIRST_DOLL,
  GLASSES,
  HAIR_COLOURS,
  HAIR_STYLES,
  LIPS,
  NAME_MAX,
  NOSES,
  OUTFITS,
  TONES,
  coversShins,
  describe,
  hairColourOf,
  hidesHair,
  labelOf,
  setCovering,
  setHair,
  surprise,
  type Doll,
  type GlassesId,
} from './dollRules';
import { DESIGN_TEXT, type DollAnswer, type DollWho } from './representationText';

/*
 * Design a doll: a doll that looks like you, or like someone you love.
 *
 * The point: after it, a child has made a doll that looks like them or
 * someone they love, and has stopped to ask how easy it is to find toys and
 * characters who look like that person: the question the Doll Test and the
 * book count (the room's other tabs) then take up. The poster tells them a
 * doll mattered; here they find out why it matters to them.
 *
 * The doll is our own, drawn in SVG in clean layers (DollArt.tsx): one body,
 * one face, one line style; twelve skin tones; hairstyles drawn for their
 * own texture, front and back, so nothing is cut off; eye shapes, noses and
 * lips; freckles and vitiligo; glasses, hearing aids, a wheelchair and a
 * prosthetic leg; clothes in any colour. Every picker tile is the child's own
 * doll with that one choice changed, so they see it on their doll before
 * they pick it.
 *
 * It opens by asking who the doll is (me, someone I love, someone new) and
 * ends with "I'm done": "Meet Ada!", the question, three answers, and a way
 * on to the Doll Test or the book count (`onGo`). Light, not a lecture.
 *
 * Each choice is a radio group (arrow keys move through it) or a checkbox,
 * with a picture and a name; a live region says what changed. "Save picture"
 * draws the SVG to a PNG in the browser and downloads it; "Print" prints the
 * doll and its name on one page. Nothing is stored or sent.
 */

const GROUPS = [
  { id: 'skin', label: 'Skin' },
  { id: 'face', label: 'Face' },
  { id: 'hair', label: 'Hair' },
  { id: 'head', label: 'Head' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'extras', label: 'Extras' },
] as const;
type GroupId = (typeof GROUPS)[number]['id'];

/* ───────── Saving ───────── */

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((ok, no) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => no(new Error('The doll could not be drawn.'));
    img.src = url;
  });

/** The doll on poster 2's pink, with its name under it, as a PNG drawn in the browser from the doll's own SVG. */
export async function dollPng(svg: SVGSVGElement, name: string): Promise<Blob | null> {
  let url = '';
  try {
    const scale = 2;
    const pad = 40;
    const nameBand = name ? 150 : 30;
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute('width', String(CANVAS.w * scale));
    copy.setAttribute('height', String(CANVAS.h * scale));
    copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' }));
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS.w * scale + pad * 2;
    canvas.height = CANVAS.h * scale + pad + nameBand;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ee8dbf';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, pad, pad, CANVAS.w * scale, CANVAS.h * scale);
    if (name) {
      try {
        await document.fonts?.load('84px Shrikhand');
      } catch {
        /* the fallback face will do */
      }
      ctx.fillStyle = '#141414';
      ctx.font = "84px Shrikhand, 'Cooper Black', Georgia, serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, CANVAS.h * scale + pad + nameBand / 2, canvas.width - pad * 2);
    }
    return await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  } catch {
    return null;
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}

export const fileNameFor = (name: string) => `${(name.trim() || 'my-doll').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'my-doll'}.png`;

/* ───────── A picture choice ───────── */

type Pick = { id: string; label: string; doll?: Doll; view?: DollView; color?: string };

/** A radio group of pictures (each the child's own doll, with this one choice) or of colour swatches. */
function Choices({ legend, name, picks, value, onPick, swatches = false, note, tall = false }: { legend: string; name: string; picks: Pick[]; value: string; onPick: (id: string) => void; swatches?: boolean; note?: ReactNode; tall?: boolean }) {
  const id = useId();
  return (
    <div className={`bhr-field ${swatches ? 'bhr-field-swatches' : 'bhr-field-pictures'}`} role="radiogroup" aria-labelledby={`${id}-l`}>
      <span className="bhr-field-label" id={`${id}-l`}>
        {legend}
      </span>
      {note}
      <div className="bhr-options">
        {picks.map((p) => (
          <label key={p.id} className={`bhr-option ${swatches ? 'bhr-swatch' : 'bhr-tile'}${tall ? ' bhr-tile-tall' : ''}`} title={swatches ? p.label : undefined}>
            <input type="radio" name={name} value={p.id} checked={value === p.id} onChange={() => onPick(p.id)} />
            {swatches ? (
              <>
                <span className="bhr-swatch-dot" style={{ background: p.color }} aria-hidden="true" />
                <span style={srOnly}>{p.label}</span>
              </>
            ) : (
              <span className="bhr-tile-face">
                {p.doll ? <DollArt doll={p.doll} view={p.view ?? 'head'} className="bhr-tile-art" /> : <span className="bhr-tile-none" aria-hidden="true" />}
                <span className="bhr-tile-label">{p.label}</span>
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, doll, view, checked, onChange }: { label: string; doll: Doll; view: DollView; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className={`bhr-option bhr-tile bhr-toggle${view === 'body' || view === 'legs' ? ' bhr-tile-tall' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="bhr-tile-face">
        <DollArt doll={doll} view={view} className="bhr-tile-art" />
        <span className="bhr-tile-label">{label}</span>
      </span>
    </label>
  );
}

/* ───────── The designer ───────── */

export default function DollDesigner({ onGo }: { onGo?: (tab: 'doll-test' | 'books') => void }) {
  const [doll, setDoll] = useState<Doll>(FIRST_DOLL);
  const [group, setGroup] = useState<GroupId>('skin');
  const [who, setWho] = useState<DollWho>('me');
  const [stage, setStage] = useState<'make' | 'meet'>('make');
  const [answer, setAnswer] = useState<DollAnswer | null>(null);
  const [said, setSaid] = useState('');
  const groupRefs = useRef<Partial<Record<GroupId, HTMLButtonElement | null>>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const meetRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const ids = useId();

  const change = (next: Doll, what: string) => {
    setDoll(next);
    setSaid(what);
  };
  /** The doll with one choice changed: what each picker tile shows. */
  const as = (patch: Partial<Doll>): Doll => ({ ...doll, ...patch });

  const onGroupKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = GROUPS.findIndex((g) => g.id === group);
    const to = e.key === 'ArrowRight' ? (i + 1) % GROUPS.length : e.key === 'ArrowLeft' ? (i - 1 + GROUPS.length) % GROUPS.length : e.key === 'Home' ? 0 : e.key === 'End' ? GROUPS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setGroup(GROUPS[to].id);
    groupRefs.current[GROUPS[to].id]?.focus();
  };

  const save = async () => {
    const svg = stageRef.current?.querySelector('svg');
    const png = svg ? await dollPng(svg, doll.name.trim()) : null;
    if (!png) return setSaid('The picture could not be made in this browser. Try Print instead.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = fileNameFor(doll.name);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaid('Picture saved to your downloads.');
  };

  const finish = () => {
    setStage('meet');
    setAnswer(null);
    requestAnimationFrame(() => meetRef.current?.focus());
  };
  const keepGoing = () => {
    setStage('make');
    requestAnimationFrame(() => doneRef.current?.focus());
  };

  const hidden = hidesHair(doll.covering);
  let panel: ReactNode = null;
  if (group === 'skin') {
    panel = (
      <>
        <Choices
          legend="Skin"
          name={`${ids}-tone`}
          value={doll.tone}
          swatches
          picks={TONES.map((t) => ({ id: t.id, label: t.label, color: t.base }))}
          onPick={(t) => change({ ...doll, tone: t }, `Skin: ${labelOf(TONES, t)}.`)}
        />
        <div className="bhr-field bhr-field-pictures" role="group" aria-label="Freckles and vitiligo">
          <span className="bhr-field-label" aria-hidden="true">
            Freckles and vitiligo
          </span>
          <div className="bhr-options">
            <Toggle label="Freckles" doll={as({ freckles: true })} view="face" checked={doll.freckles} onChange={(on) => change({ ...doll, freckles: on }, on ? 'Freckles.' : 'No freckles.')} />
            <Toggle label="Vitiligo" doll={as({ vitiligo: true })} view="face" checked={doll.vitiligo} onChange={(on) => change({ ...doll, vitiligo: on }, on ? 'Vitiligo: paler patches of skin.' : 'No vitiligo.')} />
          </div>
        </div>
      </>
    );
  } else if (group === 'face') {
    panel = (
      <>
        <Choices legend="Eyes" name={`${ids}-eyes`} value={doll.eyes} picks={EYE_SHAPES.map((e) => ({ ...e, doll: as({ eyes: e.id }), view: 'face' }))} onPick={(e) => change({ ...doll, eyes: e }, `Eyes: ${labelOf(EYE_SHAPES, e)}.`)} />
        <Choices
          legend="Eye colour"
          name={`${ids}-iris`}
          value={doll.eyeColour}
          swatches
          picks={EYE_COLOURS.map((e) => ({ id: e.id, label: e.label, color: e.color }))}
          onPick={(e) => change({ ...doll, eyeColour: e }, `Eye colour: ${labelOf(EYE_COLOURS, e)}.`)}
        />
        <div className="bhr-pair">
          <Choices legend="Nose" name={`${ids}-nose`} value={doll.nose} picks={NOSES.map((n) => ({ ...n, doll: as({ nose: n.id }), view: 'face' }))} onPick={(n) => change({ ...doll, nose: n }, `${labelOf(NOSES, n)}.`)} />
          <Choices legend="Lips" name={`${ids}-lips`} value={doll.lips} picks={LIPS.map((l) => ({ ...l, doll: as({ lips: l.id }), view: 'face' }))} onPick={(l) => change({ ...doll, lips: l }, `${labelOf(LIPS, l)}.`)} />
        </div>
      </>
    );
  } else if (group === 'hair') {
    const coverName = doll.covering ? labelOf(COVERINGS, doll.covering).toLowerCase() : '';
    panel = (
      <>
        <Choices
          legend="Hairstyle"
          name={`${ids}-hair`}
          value={hidden ? '' : doll.hair}
          picks={HAIR_STYLES.map((h) => ({ ...h, doll: setHair(doll, h.id) }))}
          onPick={(h) => change(setHair(doll, h), `Hair: ${labelOf(HAIR_STYLES, h)}.${hidden ? ` The ${coverName} is off.` : ''}`)}
          note={hidden ? <p className="bhr-note">The hair is under the {coverName}. Pick a style to take it off.</p> : undefined}
        />
        <Choices
          legend="Hair colour"
          name={`${ids}-colour`}
          value={doll.hairColour}
          swatches
          picks={HAIR_COLOURS.map((c) => ({ id: c.id, label: c.label, color: `linear-gradient(135deg, ${c.light} 0 22%, ${c.base} 48%, ${c.shade} 100%)` }))}
          onPick={(c) => change({ ...doll, hairColour: c }, `Hair colour: ${hairColourOf(c).label}.`)}
        />
      </>
    );
  } else if (group === 'head') {
    panel = (
      <>
        <Choices
          legend="Head covering"
          name={`${ids}-head`}
          value={doll.covering ?? 'none'}
          picks={[{ id: 'none', label: 'None', doll: setCovering(doll, null) }, ...COVERINGS.map((c) => ({ id: c.id, label: c.label, doll: setCovering(doll, c.id) }))]}
          onPick={(c) => {
            const covering = c === 'none' ? null : c;
            change(setCovering(doll, covering), covering ? `${labelOf(COVERINGS, covering)}.${hidesHair(covering) ? ' It covers the hair.' : ' It sits on the hair.'}` : 'No head covering.');
          }}
        />
        {doll.covering && (
          <Choices
            legend={`${labelOf(COVERINGS, doll.covering)} colour`}
            name={`${ids}-headcolour`}
            value={doll.coveringColour}
            swatches
            picks={CLOTH_COLOURS.map((c) => ({ id: c.id, label: c.label, color: c.color }))}
            onPick={(c) => change({ ...doll, coveringColour: c }, `${labelOf(COVERINGS, doll.covering!)}: ${labelOf(CLOTH_COLOURS, c).toLowerCase()}.`)}
          />
        )}
      </>
    );
  } else if (group === 'clothes') {
    panel = (
      <>
        <Choices legend="Clothes" name={`${ids}-outfit`} value={doll.outfit} tall picks={OUTFITS.map((o) => ({ ...o, doll: as({ outfit: o.id }), view: 'body' }))} onPick={(o) => change({ ...doll, outfit: o }, `Clothes: ${labelOf(OUTFITS, o)}.`)} />
        <Choices
          legend="Colour"
          name={`${ids}-cloth`}
          value={doll.outfitColour}
          swatches
          picks={CLOTH_COLOURS.map((c) => ({ id: c.id, label: c.label, color: c.color }))}
          onPick={(c) => change({ ...doll, outfitColour: c }, `Clothes colour: ${labelOf(CLOTH_COLOURS, c).toLowerCase()}.`)}
        />
      </>
    );
  } else {
    panel = (
      <>
        <Choices
          legend="Glasses"
          name={`${ids}-glasses`}
          value={doll.glasses}
          picks={GLASSES.map((g) => ({ id: g.id, label: g.label, doll: as({ glasses: g.id as GlassesId }), view: 'face' }))}
          onPick={(g) => change({ ...doll, glasses: g as GlassesId }, `${labelOf(GLASSES, g)}.`)}
        />
        <div className="bhr-field bhr-field-pictures" role="group" aria-label="More extras">
          <span className="bhr-field-label" aria-hidden="true">
            More
          </span>
          <div className="bhr-options">
            <Toggle label="Hearing aids" doll={as({ hearing: true })} view="head" checked={doll.hearing} onChange={(on) => change({ ...doll, hearing: on }, on ? 'Hearing aids.' : 'No hearing aids.')} />
            <Toggle label="Wheelchair" doll={as({ seated: true })} view="body" checked={doll.seated} onChange={(on) => change({ ...doll, seated: on }, on ? 'Sitting in a wheelchair.' : 'Standing.')} />
            <Toggle label="Prosthetic leg" doll={as({ prosthetic: true })} view="legs" checked={doll.prosthetic} onChange={(on) => change({ ...doll, prosthetic: on }, on ? 'A prosthetic leg.' : 'No prosthetic leg.')} />
          </div>
          {doll.prosthetic && coversShins(doll.outfit) && <p className="bhr-note">{DESIGN_TEXT.prostheticHidden}</p>}
        </div>
        {(doll.seated || doll.prosthetic) && (
          <Choices
            legend={doll.seated ? 'Wheelchair colour' : 'Prosthetic colour'}
            name={`${ids}-chair`}
            value={doll.chairColour}
            swatches
            picks={CLOTH_COLOURS.map((c) => ({ id: c.id, label: c.label, color: c.color }))}
            onPick={(c) => change({ ...doll, chairColour: c }, `${doll.seated ? 'Wheelchair' : 'Prosthetic'} colour: ${labelOf(CLOTH_COLOURS, c).toLowerCase()}.`)}
          />
        )}
      </>
    );
  }

  const name = doll.name.trim();

  return (
    <div className="bhr-design" data-stage={stage}>
      <figure className="bhr-doll-stage">
        <div className="bhr-doll" ref={stageRef}>
          <DollArt doll={doll} title={describe(doll)} />
        </div>
        <figcaption className="bhr-doll-name" aria-hidden="true">
          {name}
        </figcaption>
      </figure>

      {stage === 'make' ? (
        <div className="bhr-maker">
          <p className="bhr-design-intro">{DESIGN_TEXT.intro}</p>
          <div className="bhr-who-row">
            <div className="bhr-who" role="radiogroup" aria-label={DESIGN_TEXT.whoLegend}>
              <span className="bhr-field-label" aria-hidden="true">
                {DESIGN_TEXT.whoLegend}
              </span>
              {DESIGN_TEXT.who.map((w) => (
                <label key={w.id} className="bhr-kind">
                  <input type="radio" name={`${ids}-who`} checked={who === w.id} onChange={() => setWho(w.id)} />
                  <span>{w.label}</span>
                </label>
              ))}
            </div>
            <label className="bhr-name">
              <span style={srOnly}>{DESIGN_TEXT.name}</span>
              <input value={doll.name} maxLength={NAME_MAX} onChange={(e) => setDoll((d) => ({ ...d, name: e.target.value }))} autoComplete="off" spellCheck={false} placeholder={DESIGN_TEXT.namePlaceholder} aria-label={DESIGN_TEXT.name} />
            </label>
          </div>

          <div className="bhr-groups" role="tablist" aria-label="Choices">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                ref={(el) => {
                  groupRefs.current[g.id] = el;
                }}
                type="button"
                role="tab"
                id={`${ids}-g-${g.id}`}
                aria-controls={`${ids}-p`}
                aria-selected={group === g.id}
                tabIndex={group === g.id ? 0 : -1}
                className="bhr-group"
                onClick={() => setGroup(g.id)}
                onKeyDown={onGroupKey}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="bhr-choices" id={`${ids}-p`} role="tabpanel" aria-labelledby={`${ids}-g-${group}`} data-group={group}>
            {panel}
          </div>

          <div className="bhr-actions">
            <button ref={doneRef} type="button" className="bhr-button bhr-button-done" onClick={finish}>
              {DESIGN_TEXT.done}
            </button>
            <button type="button" className="bhr-button bhr-button-ghost" onClick={() => change(surprise(doll.name), 'A surprise doll.')}>
              {DESIGN_TEXT.surprise}
            </button>
            <button type="button" className="bhr-button bhr-button-ghost" onClick={() => void save()}>
              {DESIGN_TEXT.save}
            </button>
            <button type="button" className="bhr-button bhr-button-ghost" onClick={() => window.print()}>
              {DESIGN_TEXT.print}
            </button>
          </div>
          <p className="bhr-small">{DESIGN_TEXT.stored}</p>
        </div>
      ) : (
        <section className="bhr-meet" aria-labelledby={`${ids}-meet`}>
          <h2 id={`${ids}-meet`} ref={meetRef} tabIndex={-1} className="bhr-meet-heading">
            {DESIGN_TEXT.meet(name)}
          </h2>
          <p className="bhr-meet-ask" id={`${ids}-ask`}>
            {DESIGN_TEXT.ask[who]}
          </p>
          <div className="bhr-meet-answers" role="group" aria-labelledby={`${ids}-ask`}>
            {DESIGN_TEXT.answers.map((a) => (
              <button key={a.id} type="button" className="bhr-meet-answer" aria-pressed={answer === a.id} onClick={() => setAnswer(a.id)}>
                {a.label}
              </button>
            ))}
          </div>
          {answer && (
            <div className="bhr-meet-reply">
              <p role="status">{DESIGN_TEXT.reply[answer]}</p>
              <div className="bhr-meet-go">
                <button type="button" className="bhr-go" onClick={() => onGo?.('doll-test')}>
                  <strong>{DESIGN_TEXT.toDollTest}</strong>
                  <span>{DESIGN_TEXT.toDollTestWhy}</span>
                </button>
                <button type="button" className="bhr-go" onClick={() => onGo?.('books')}>
                  <strong>{DESIGN_TEXT.toBooks}</strong>
                  <span>{DESIGN_TEXT.toBooksWhy}</span>
                </button>
              </div>
            </div>
          )}
          <div className="bhr-actions">
            <button type="button" className="bhr-button bhr-button-ghost" onClick={keepGoing}>
              {DESIGN_TEXT.back}
            </button>
            <button type="button" className="bhr-button bhr-button-ghost" onClick={() => void save()}>
              {DESIGN_TEXT.save}
            </button>
            <button type="button" className="bhr-button bhr-button-ghost" onClick={() => window.print()}>
              {DESIGN_TEXT.print}
            </button>
          </div>
        </section>
      )}

      <p role="status" style={srOnly}>
        {said ? `${said} ${describe(doll)}` : ''}
      </p>
    </div>
  );
}
