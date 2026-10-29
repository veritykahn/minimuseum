'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { srOnly } from '@/lib/a11y';
import DollPicture from './Doll';
import { FIRST_DOLL, GROUPS, describe, labelOf, surprise, type Choice, type Doll, type GroupId, type Swatch } from './dollOptions';

/*
 * Design a doll like me: the doll on poster 2's pink, and beside it the
 * choices, a group at a time (skin, hair, face, extras, clothes). Each
 * choice is a radio group, so the arrow keys move through it; the doll
 * changes as you go and a live region says what changed. "Save picture"
 * draws the doll to a PNG in the browser and downloads it; "Print" prints
 * the doll alone. Nothing is stored or sent.
 */

const NAME_MAX = 24;

/** The doll's SVG as a PNG, drawn in the browser, at twice its size. */
async function toPng(svg: SVGSVGElement): Promise<Blob | null> {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((ok, no) => {
      img.onload = () => ok();
      img.onerror = () => no(new Error('draw'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 1080;
    canvas.getContext('2d')!.drawImage(img, 0, 0, 640, 1080);
    return await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function DollDesigner() {
  const [doll, setDoll] = useState<Doll>(FIRST_DOLL);
  const [group, setGroup] = useState<GroupId>('skin');
  const [said, setSaid] = useState('');
  const svg = useRef<SVGSVGElement>(null);
  const groupRefs = useRef<Partial<Record<GroupId, HTMLButtonElement | null>>>({});
  const ids = useId();

  const set = (key: keyof Doll, value: string, label: string, choices: readonly Choice[]) => {
    setDoll((d) => ({ ...d, [key]: value }));
    setSaid(`${label}: ${labelOf(choices, value)}.`);
  };

  const onGroupKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = GROUPS.findIndex((g) => g.id === group);
    const to = e.key === 'ArrowRight' ? (i + 1) % GROUPS.length : e.key === 'ArrowLeft' ? (i - 1 + GROUPS.length) % GROUPS.length : e.key === 'Home' ? 0 : e.key === 'End' ? GROUPS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setGroup(GROUPS[to].id);
    groupRefs.current[GROUPS[to].id]?.focus();
  };

  const save = async () => {
    if (!svg.current) return;
    const png = await toPng(svg.current);
    if (!png) return setSaid('The picture could not be made in this browser. Try Print instead.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = `${(doll.name.trim() || 'my-doll').replace(/[^\w-]+/g, '-').toLowerCase()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaid('Picture saved to your downloads.');
  };

  const current = GROUPS.find((g) => g.id === group)!;

  return (
    <div className="bhr-design">
      <div className="bhr-doll-stage">
        <DollPicture ref={svg} doll={doll} className="bhr-doll" />
      </div>

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
          {current.fields
            .filter((f) => !('onlyIf' in f) || f.onlyIf(doll))
            .map((f) => {
              const swatches = 'color' in f.options[0];
              return (
                <fieldset key={f.key} className={`bhr-field ${swatches ? 'bhr-field-swatches' : ''}`}>
                  <legend className="bhr-field-label">{f.label}</legend>
                  <div className="bhr-options">
                    {f.options.map((o: Choice) => (
                      <label key={o.id} className={`bhr-option ${swatches ? 'bhr-swatch' : 'bhr-chip'}`} title={swatches ? o.label : undefined}>
                        <input type="radio" name={`${ids}-${f.key}`} value={o.id} checked={doll[f.key] === o.id} onChange={() => set(f.key, o.id, f.label, f.options)} />
                        {swatches ? (
                          <>
                            <span className="bhr-swatch-dot" style={{ background: (o as Swatch).color }} aria-hidden="true" />
                            <span style={srOnly}>{o.label}</span>
                          </>
                        ) : (
                          <span>{o.label}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
        </div>

        <div className="bhr-actions">
          <button type="button" className="bhr-button bhr-button-ghost" onClick={() => {
            setDoll(surprise(doll.name));
            setSaid('A surprise doll.');
          }}>
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

      <p role="status" style={srOnly}>{said ? `${said} ${describe(doll)}` : ''}</p>
    </div>
  );
}
