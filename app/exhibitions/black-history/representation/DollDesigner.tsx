'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { srOnly } from '@/lib/a11y';
import { DOLL_ART, type HairColour, type Sex, type Tone } from './dollArt';
import {
  FIRST_DOLL,
  KIPPAH,
  NAME_MAX,
  SEX_LABEL,
  SEXES,
  colourName,
  coverings,
  describe,
  hairColours,
  hairStyles,
  hidesHair,
  layersOf,
  nextLikely,
  outfitsFor,
  poseOf,
  setCovering,
  setHair,
  setOutfit,
  setProsthetic,
  setSeated,
  setSex,
  skinTones,
  src,
  surprise,
  thumb,
  type Doll,
  type Layer,
} from './dollRules';

/*
 * Design a doll, with the owner's doll artwork: the doll large on poster 2's
 * pink, and beside it the choices a group at a time (the doll, hair, head,
 * extras, clothes). Every layer is the whole canvas, already in place, so the
 * doll is a stack of pictures in one box, in the manifest's order. Only the
 * layers that show are fetched, plus small thumbnails for the open group,
 * and the next likely layers ahead of time.
 *
 * Each choice is a radio group (arrow keys move through it) or a checkbox,
 * with a picture and a name; a live region says what changed. "Save
 * picture" draws the layers to a PNG in the browser and downloads it;
 * "Print" prints the doll and its name on one page. Nothing is stored or sent.
 */

const [CANVAS_W, CANVAS_H] = DOLL_ART.canvas;

const GROUPS = [
  { id: 'doll', label: 'Doll' },
  { id: 'hair', label: 'Hair' },
  { id: 'head', label: 'Head' },
  { id: 'extras', label: 'Extras' },
  { id: 'clothes', label: 'Clothes' },
] as const;
type GroupId = (typeof GROUPS)[number]['id'];

/* ───────── Fetching ahead ───────── */
const fetched = new Set<string>();
function preload(urls: string[]) {
  for (const u of urls) {
    if (fetched.has(u) || typeof Image === 'undefined') continue;
    fetched.add(u);
    const img = new Image();
    img.decoding = 'async';
    img.src = u;
  }
}
const idle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn);
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 300);
  return () => window.clearTimeout(id);
};

/* ───────── Saving ───────── */
const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((ok, no) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => no(new Error(url));
    img.src = url;
  });

/** The doll on poster 2's pink, with its name under it, as a PNG drawn in the browser. */
export async function dollPng(layers: Layer[], name: string): Promise<Blob | null> {
  try {
    const pad = 60;
    const nameBand = name ? 150 : 40;
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W + pad * 2;
    canvas.height = CANVAS_H + pad + nameBand;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ee8dbf';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imgs = await Promise.all(layers.map((l) => loadImage(l.src)));
    imgs.forEach((img, i) => ctx.drawImage(img, pad, pad - layers[i].lift, CANVAS_W, CANVAS_H));
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
      ctx.fillText(name, canvas.width / 2, CANVAS_H + pad + nameBand / 2, canvas.width - pad * 2);
    }
    return await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  } catch {
    return null;
  }
}

export const fileNameFor = (name: string) => `${(name.trim() || 'my-doll').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'my-doll'}.png`;

/* ───────── The doll ───────── */
export function DollPicture({ doll, className = '' }: { doll: Doll; className?: string }) {
  const layers = layersOf(doll);
  return (
    <div className={`bhr-doll ${className}`} role="img" aria-label={describe(doll)}>
      {layers.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element -- full-canvas layers stacked in one box; next/image would add wrappers and resize them apart
        <img
          key={l.slot}
          className="bhr-doll-layer"
          data-slot={l.slot}
          src={l.src}
          alt=""
          decoding="async"
          draggable={false}
          width={CANVAS_W}
          height={CANVAS_H}
          style={l.lift ? { transform: `translateY(${(-l.lift / CANVAS_H) * 100}%)` } : undefined}
        />
      ))}
    </div>
  );
}

/* ───────── A picture choice ───────── */
type Pick = { id: string; label: string; picture?: string; color?: string };

function Choices({ legend, name, picks, value, onPick, swatches = false, onLook, note }: { legend: string; name: string; picks: Pick[]; value: string; onPick: (id: string) => void; swatches?: boolean; onLook?: (id: string) => void; note?: ReactNode }) {
  const id = useId();
  return (
    <div className={`bhr-field ${swatches ? 'bhr-field-swatches' : 'bhr-field-pictures'}`} role="radiogroup" aria-labelledby={`${id}-l`}>
      <span className="bhr-field-label" id={`${id}-l`}>
        {legend}
      </span>
      {note}
      <div className="bhr-options">
        {picks.map((p) => (
          <label key={p.id} className={`bhr-option ${swatches ? 'bhr-swatch' : 'bhr-tile'}`} title={swatches ? p.label : undefined} onPointerEnter={() => onLook?.(p.id)}>
            <input type="radio" name={name} value={p.id} checked={value === p.id} onChange={() => onPick(p.id)} onFocus={() => onLook?.(p.id)} />
            {swatches ? (
              <>
                <span className="bhr-swatch-dot" style={{ background: p.color }} aria-hidden="true" />
                <span style={srOnly}>{p.label}</span>
              </>
            ) : (
              <span className="bhr-tile-face">
                {p.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small pre-made thumbnails
                  <img src={p.picture} alt="" width={160} height={160} loading="lazy" decoding="async" draggable={false} />
                ) : (
                  <span className="bhr-tile-none" aria-hidden="true" />
                )}
                <span className="bhr-tile-label">{p.label}</span>
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, picture, checked, onChange, onLook }: { label: string; picture: string; checked: boolean; onChange: (on: boolean) => void; onLook?: () => void }) {
  return (
    <label className="bhr-option bhr-tile bhr-toggle" onPointerEnter={onLook}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} onFocus={onLook} />
      <span className="bhr-tile-face">
        {/* eslint-disable-next-line @next/next/no-img-element -- small pre-made thumbnails */}
        <img src={picture} alt="" width={160} height={160} loading="lazy" decoding="async" draggable={false} />
        <span className="bhr-tile-label">{label}</span>
      </span>
    </label>
  );
}

/* ───────── The designer ───────── */
export default function DollDesigner() {
  const [doll, setDoll] = useState<Doll>(FIRST_DOLL);
  const [group, setGroup] = useState<GroupId>('doll');
  const [said, setSaid] = useState('');
  const groupRefs = useRef<Partial<Record<GroupId, HTMLButtonElement | null>>>({});
  const ids = useId();

  const sex = doll.sex;
  const pose = poseOf(doll);
  const covering = doll.covering[sex];
  const style = doll.hair[sex];

  const change = (next: Doll, what: string) => {
    setDoll(next);
    setSaid(what);
  };

  // Fetch the layers a child is likely to want next, when the browser is idle.
  useEffect(() => idle(() => preload(nextLikely(doll, group))), [doll, group]);

  const onGroupKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = GROUPS.findIndex((g) => g.id === group);
    const to = e.key === 'ArrowRight' ? (i + 1) % GROUPS.length : e.key === 'ArrowLeft' ? (i - 1 + GROUPS.length) % GROUPS.length : e.key === 'Home' ? 0 : e.key === 'End' ? GROUPS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setGroup(GROUPS[to].id);
    groupRefs.current[GROUPS[to].id]?.focus();
  };

  const save = async () => {
    const png = await dollPng(layersOf(doll), doll.name.trim());
    if (!png) return setSaid('The picture could not be made in this browser. Try Print instead.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = fileNameFor(doll.name);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaid('Picture saved to your downloads.');
  };

  const tone = doll.tone;
  const bodyThumb = (p: 'W' | 'M' | 'WS' | 'MS', t: Tone = tone) => thumb(DOLL_ART.bodies[p][t]);
  const hairThumb = (s: string, c: HairColour = doll.hairColour) => thumb(DOLL_ART.hair[sex][s].files[c]);
  const coverName = covering ? DOLL_ART.head[sex][covering].label.toLowerCase() : '';

  let panel: ReactNode = null;
  if (group === 'doll') {
    panel = (
      <>
        <div className="bhr-pair">
          <Choices
            legend="Doll"
            name={`${ids}-sex`}
            value={sex}
            picks={SEXES.map((s) => ({ id: s, label: SEX_LABEL[s], picture: bodyThumb(doll.seated ? (`${s}S` as 'WS' | 'MS') : s) }))}
            onPick={(s) => change(setSex(doll, s as Sex), `Doll: ${SEX_LABEL[s as Sex]}.`)}
          />
          <Choices
            legend="Standing or sitting"
            name={`${ids}-seated`}
            value={doll.seated ? 'seated' : 'standing'}
            picks={[
              { id: 'standing', label: 'Standing', picture: bodyThumb(sex) },
              { id: 'seated', label: 'Wheelchair', picture: bodyThumb(`${sex}S` as 'WS' | 'MS') },
            ]}
            onPick={(v) => change(setSeated(doll, v === 'seated'), v === 'seated' ? 'Sitting in a wheelchair.' : 'Standing.')}
            onLook={(v) => preload([src(DOLL_ART.bodies[v === 'seated' ? (`${sex}S` as 'WS' | 'MS') : sex][tone])])}
          />
        </div>
        <Choices
          legend="Skin"
          name={`${ids}-tone`}
          value={tone}
          swatches
          picks={skinTones().map((t) => ({ ...t, color: DOLL_ART.skinSwatch[t.id as Tone] }))}
          onPick={(t) => change({ ...doll, tone: t as Tone }, `Skin: ${DOLL_ART.skinToneLabels[t as Tone]}.`)}
          onLook={(t) => preload([src(DOLL_ART.bodies[pose][t as Tone])])}
        />
      </>
    );
  } else if (group === 'hair') {
    const hidden = hidesHair(covering);
    panel = (
      <>
        {/* The colour (and the man's beard) first, in view: the thumbnails below follow the colour. */}
        <div className="bhr-pair">
          <Choices
            legend={sex === 'M' ? 'Hair and beard colour' : 'Hair colour'}
            name={`${ids}-colour`}
            value={doll.hairColour}
            swatches
            picks={hairColours().map((c) => ({ ...c, color: DOLL_ART.hairSwatch[c.id as HairColour] }))}
            onPick={(c) => change({ ...doll, hairColour: c as HairColour }, `Hair colour: ${colourName(c as HairColour)}.`)}
            onLook={(c) => preload([src(DOLL_ART.hair[sex][style].files[c as HairColour])])}
          />
          {sex === 'M' && (
            <div className="bhr-field bhr-field-pictures" role="group" aria-label="Beard">
              <span className="bhr-field-label" aria-hidden="true">
                Beard
              </span>
              <div className="bhr-options">
                <Toggle label="Beard" picture={thumb(DOLL_ART.extras.M.beard.files[doll.hairColour])} checked={doll.beard} onChange={(on) => change({ ...doll, beard: on }, on ? 'A beard.' : 'No beard.')} onLook={() => preload([src(DOLL_ART.extras.M.beard.files[doll.hairColour])])} />
              </div>
            </div>
          )}
        </div>
        <Choices
          legend="Hairstyle"
          name={`${ids}-hair`}
          value={hidden ? '' : style}
          picks={hairStyles(sex).map((h) => ({ ...h, picture: hairThumb(h.id) }))}
          onPick={(s) => change(setHair(doll, s), `Hair: ${DOLL_ART.hair[sex][s].label}.${hidden ? ` The ${coverName} is off.` : ''}`)}
          onLook={(s) => preload([src(DOLL_ART.hair[sex][s].files[doll.hairColour])])}
          note={hidden ? <p className="bhr-note">The hair is under the {coverName}. Pick a style to take it off.</p> : undefined}
        />
      </>
    );
  } else if (group === 'head') {
    panel = (
      <Choices
        legend="Head covering"
        name={`${ids}-head`}
        value={covering ?? 'none'}
        picks={[{ id: 'none', label: 'None', picture: hairThumb(style) }, ...coverings(sex).map((c) => ({ ...c, picture: thumb(DOLL_ART.head[sex][c.id].file) }))]}
        onPick={(c) => {
          const next = setCovering(doll, c === 'none' ? null : c);
          const label = c === 'none' ? '' : DOLL_ART.head[sex][c].label;
          change(next, c === 'none' ? 'No head covering.' : `${label}.${hidesHair(c) ? ' It covers the hair.' : ''}${c === KIPPAH ? ' It sits on top of the hair.' : ''}`);
        }}
        onLook={(c) => c !== 'none' && preload([src(DOLL_ART.head[sex][c].file)])}
      />
    );
  } else if (group === 'extras') {
    panel = (
      <div className="bhr-field bhr-field-pictures" role="group" aria-label="Extras">
        <span className="bhr-field-label" aria-hidden="true">
          Extras
        </span>
        <div className="bhr-options">
          <Toggle label="Glasses" picture={thumb(DOLL_ART.extras[sex].glasses.file)} checked={doll.glasses} onChange={(on) => change({ ...doll, glasses: on }, on ? 'Glasses.' : 'No glasses.')} onLook={() => preload([src(DOLL_ART.extras[sex].glasses.file)])} />
          <Toggle label="Hearing aid" picture={thumb(DOLL_ART.extras[sex].hearing.file)} checked={doll.hearing} onChange={(on) => change({ ...doll, hearing: on }, on ? 'A hearing aid.' : 'No hearing aid.')} onLook={() => preload([src(DOLL_ART.extras[sex].hearing.file)])} />
          {!doll.seated && (
            <Toggle label="Prosthetic leg" picture={thumb(DOLL_ART.prosthetic[sex][tone])} checked={doll.prosthetic} onChange={(on) => change(setProsthetic(doll, on), on ? 'A prosthetic leg.' : 'No prosthetic leg.')} onLook={() => preload([src(DOLL_ART.prosthetic[sex][tone])])} />
          )}
        </div>
        {doll.seated && <p className="bhr-note">The prosthetic leg is for a standing doll.</p>}
      </div>
    );
  } else {
    panel = (
      <Choices
        legend={doll.seated ? 'Clothes for sitting' : 'Clothes'}
        name={`${ids}-outfit`}
        value={doll.outfit[pose]}
        picks={outfitsFor(pose).map((o) => ({ ...o, picture: thumb(DOLL_ART.outfits[pose][o.id].file) }))}
        onPick={(o) => change(setOutfit(doll, o), `Clothes: ${DOLL_ART.outfits[pose][o].label}.`)}
        onLook={(o) => preload([src(DOLL_ART.outfits[pose][o].file)])}
      />
    );
  }

  const name = doll.name.trim();

  return (
    <div className="bhr-design">
      <figure className="bhr-doll-stage">
        <DollPicture doll={doll} />
        <figcaption className="bhr-doll-name" aria-hidden="true">
          {name}
        </figcaption>
      </figure>

      <div className="bhr-maker">
        <label className="bhr-name">
          <span className="bhr-field-label">Name (you don’t have to)</span>
          <input value={doll.name} maxLength={NAME_MAX} onChange={(e) => setDoll((d) => ({ ...d, name: e.target.value }))} autoComplete="off" spellCheck={false} placeholder="My doll" />
        </label>

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
          <button type="button" className="bhr-button bhr-button-ghost" onClick={() => change(surprise(doll.name), 'A surprise doll.')}>
            Surprise me
          </button>
          <button type="button" className="bhr-button" onClick={() => void save()}>
            Save picture
          </button>
          <button type="button" className="bhr-button" onClick={() => window.print()}>
            Print
          </button>
        </div>
        <p className="bhr-small">Nothing you make here is stored or sent anywhere.</p>
      </div>

      <p role="status" style={srOnly}>
        {said ? `${said} ${describe(doll)}` : ''}
      </p>
    </div>
  );
}
