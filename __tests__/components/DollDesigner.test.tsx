import fs from 'node:fs';
import path from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import DollDesigner, { fileNameFor } from '@/app/exhibitions/black-history/representation/DollDesigner';
import { DOLL_ART, DOLL_BASE, DOLL_BYTES, thumbOf } from '@/app/exhibitions/black-history/representation/dollArt';
import {
  FIRST_DOLL,
  SLOT_ORDER,
  coverings,
  describe as describeDoll,
  hidesHair,
  isValid,
  layersOf,
  nextLikely,
  outfitsFor,
  resolve,
  setCovering,
  setHair,
  setOutfit,
  setProsthetic,
  setSeated,
  setSex,
  surprise,
  type Doll,
} from '@/app/exhibitions/black-history/representation/dollRules';

/*
 * Design a doll, rebuilt round the owner's artwork: every file the manifest
 * names is in the site with its thumbnail, the layers stack in the
 * manifest's order, the manifest's rules hold whatever a child does, a
 * surprise is always a whole doll, every choice has a name a screen reader
 * can say, and the picture can be saved and printed.
 */

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const SRC_MANIFEST = path.join(process.env.HOME ?? '', 'Documents/Mini Museum assets/Black History/design-a-doll/manifest.json');

function filesIn(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string' && v.endsWith('.webp')) out.push(v);
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => filesIn(x, out));
  return out;
}
const ALL_FILES = [...new Set(filesIn([DOLL_ART.bodies, DOLL_ART.prosthetic, DOLL_ART.hair, DOLL_ART.outfits, DOLL_ART.head, DOLL_ART.extras]))];
const onDisk = (file: string) => path.join(PUBLIC, DOLL_BASE, file);
const slots = (d: Doll) => layersOf(d).map((l) => l.slot);
const files = (d: Doll) => layersOf(d).map((l) => l.file);

describe('the doll’s artwork', () => {
  it('has every layer the manifest names, and a thumbnail for each', () => {
    expect(ALL_FILES).toHaveLength(258);
    for (const f of ALL_FILES) {
      expect(fs.existsSync(onDisk(f))).toBe(true);
      expect(fs.existsSync(onDisk(thumbOf(f)))).toBe(true);
      expect(DOLL_BYTES[f]).toBe(fs.statSync(onDisk(f)).size);
    }
  });

  it('matches the owner’s manifest, where her folder is on this machine', () => {
    if (!fs.existsSync(SRC_MANIFEST)) return;
    const m = JSON.parse(fs.readFileSync(SRC_MANIFEST, 'utf8'));
    for (const k of ['canvas', 'order', 'skinTones', 'skinToneLabels', 'bodies', 'prosthetic', 'hairColours', 'hair', 'outfits', 'head', 'extras', 'rules', 'kippahLift'] as const) {
      expect(DOLL_ART[k]).toEqual(m[k]);
    }
  });

  it('has the range the owner made: 4 poses, 8 tones with names, 24 hairstyles in 7 colours, 6 coverings, 17 outfits and 8 for sitting', () => {
    expect(Object.keys(DOLL_ART.bodies)).toEqual(['W', 'M', 'WS', 'MS']);
    expect(DOLL_ART.skinTones).toHaveLength(8);
    expect(DOLL_ART.skinToneLabels.t1).toBe('deepest');
    expect(Object.keys(DOLL_ART.hair.W).length + Object.keys(DOLL_ART.hair.M).length).toBe(24);
    expect(DOLL_ART.hairColours).toHaveLength(7);
    expect([...coverings('W'), ...coverings('M')].map((c) => c.id).sort()).toEqual(['hijab', 'kippah', 'kufi', 'tichel', 'turban', 'wrap']);
    expect(outfitsFor('W').length + outfitsFor('M').length).toBe(17);
    expect(outfitsFor('WS').length + outfitsFor('MS').length).toBe(8);
  });

  it('keeps the doll light: only the layers shown, a few hundred kilobytes a doll', () => {
    const total = (d: Doll) => files(d).reduce((n, f) => n + DOLL_BYTES[f], 0);
    expect(total(FIRST_DOLL)).toBeLessThan(400_000);
    for (let i = 0; i < 50; i++) expect(total(surprise('', mulberry(i)))).toBeLessThan(500_000);
  });

  it('credits no illustration as made with Leonardo', () => {
    const dir = path.join(ROOT, 'app/exhibitions/black-history/representation');
    for (const f of fs.readdirSync(dir)) expect(fs.readFileSync(path.join(dir, f), 'utf8')).not.toMatch(/Leonardo/i);
  });
});

describe('the stack', () => {
  it('follows the manifest’s order: body, outfit, hair, beard, head, then glasses and hearing aid', () => {
    expect(DOLL_ART.order).toEqual(['body', 'outfit', 'hair', 'extra (beard)', 'head', 'extra (glasses, hearing aid)']);
    expect(SLOT_ORDER).toEqual(['body', 'outfit', 'hair', 'beard', 'head', 'glasses', 'hearing']);
    const man: Doll = { ...FIRST_DOLL, sex: 'M', beard: true, glasses: true, hearing: true, covering: { W: null, M: 'kufi' } };
    expect(slots(man)).toEqual(['body', 'outfit', 'hair', 'beard', 'head', 'glasses', 'hearing']);
    expect(files(man)).toEqual([
      'body/M-t2.webp',
      'outfit/M-out-denim.webp',
      'hair/M-hair-fade-black.webp',
      'extra/M-beard-black.webp',
      'head/M-kufi.webp',
      'extra/M-glasses.webp',
      'extra/M-hearing.webp',
    ]);
  });

  it('gives the seated dolls the standing doll’s hair, head and extras', () => {
    const d = setSeated({ ...FIRST_DOLL, glasses: true, covering: { W: 'hijab', M: null } }, true);
    expect(files(d)).toEqual(['body/WS-t2.webp', 'outfit/WS-out-sundress.webp', 'head/W-hijab.webp', 'extra/W-glasses.webp']);
  });

  it('draws the layers as full-canvas pictures in one box, in order', () => {
    const { container } = render(<DollDesigner />);
    const box = container.querySelector('.bhr-doll') as HTMLElement;
    const css = fs.readFileSync(path.join(ROOT, 'app/exhibitions/black-history/representation/representation.css'), 'utf8');
    expect(css).toMatch(new RegExp(`\\.bhr-doll \\{[^}]*aspect-ratio: ${DOLL_ART.canvas[0]} / ${DOLL_ART.canvas[1]};`));
    expect(css).toMatch(/\.bhr-doll-layer \{ position: absolute; inset: 0; width: 100%; height: 100%;/);
    const imgs = [...box.querySelectorAll('img')];
    expect(imgs.map((i) => i.dataset.slot)).toEqual(slots(FIRST_DOLL));
    for (const i of imgs) {
      expect(i).toHaveAttribute('alt', '');
      expect(i).toHaveAttribute('decoding', 'async');
    }
  });
});

describe('the manifest’s rules', () => {
  it('a covering that hides the hair hides it, and the hair comes back when it comes off', () => {
    expect(DOLL_ART.coversHair.sort()).toEqual(['hijab', 'tichel', 'turban', 'wrap']);
    expect(hidesHair('kippah')).toBe(false);
    expect(hidesHair('kufi')).toBe(false);
    const braids = setHair(FIRST_DOLL, 'braids');
    const covered = setCovering(braids, 'wrap');
    expect(slots(covered)).not.toContain('hair');
    expect(covered.hair.W).toBe('braids');
    expect(files(setCovering(covered, null))).toContain('hair/W-hair-braids-black.webp');
    // Choosing a hairstyle takes a hiding covering off.
    expect(setHair(covered, 'bob').covering.W).toBeNull();
    // ...but not a kufi, which sits on the hair.
    const kufi = setCovering({ ...FIRST_DOLL, sex: 'M' }, 'kufi');
    expect(setHair(kufi, 'afro').covering.M).toBe('kufi');
  });

  it('the kippah is the man’s only, and is lifted to sit on his hairstyle', () => {
    expect(coverings('W').map((c) => c.id)).not.toContain('kippah');
    expect(coverings('M').map((c) => c.id)).toContain('kippah');
    // A kippah can't be put on the woman doll, even by hand.
    expect(resolve({ ...FIRST_DOLL, covering: { W: 'kippah', M: null } }).covering.W).toBeNull();
    for (const [style, lift] of Object.entries(DOLL_ART.kippahLift)) {
      const d = setCovering(setHair({ ...FIRST_DOLL, sex: 'M' }, style), 'kippah');
      const head = layersOf(d).find((l) => l.slot === 'head')!;
      expect(head.file).toBe('head/M-kippah.webp');
      expect(head.lift).toBe(lift);
      expect(slots(d)).toContain('hair');
    }
    expect(DOLL_ART.kippahLift.locs).toBe(21);
  });

  it('a seated doll wears only seated outfits', () => {
    const blue = setOutfit(FIRST_DOLL, 'blue');
    const seated = setSeated(blue, true);
    expect(files(seated)[1]).toMatch(/^outfit\/WS-out-/);
    // An outfit the seated doll also has carries over; the standing choice is remembered for standing up.
    const sundress = setSeated(setOutfit(FIRST_DOLL, 'sundress'), true);
    expect(sundress.outfit.WS).toBe('sundress');
    expect(setSeated(seated, false).outfit.W).toBe('blue');
    // A standing outfit can't be forced on.
    expect(resolve({ ...seated, outfit: { ...seated.outfit, WS: 'blue' } }).outfit.WS).toBe('sundress');
  });

  it('the prosthetic leg is for standing dolls, and sitting down takes it off', () => {
    const standing = setProsthetic(FIRST_DOLL, true);
    expect(files(standing)[0]).toBe('body/W-t2-prosthetic.webp');
    const seated = setSeated(standing, true);
    expect(seated.prosthetic).toBe(false);
    expect(files(seated)[0]).toBe('body/WS-t2.webp');
    expect(setProsthetic(seated, true).prosthetic).toBe(false);
  });

  it('switching dolls keeps each doll’s own choices, and a beard is only ever the man’s', () => {
    const w = setHair(FIRST_DOLL, 'bob');
    const m = setHair(setSex(w, 'M'), 'locs');
    const bearded = { ...m, beard: true };
    expect(slots(bearded)).toContain('beard');
    const back = setSex(bearded, 'W');
    expect(back.hair.W).toBe('bob');
    expect(slots(back)).not.toContain('beard');
    expect(setSex(back, 'M').hair.M).toBe('locs');
  });
});

/** A small seeded random, so the surprises are the same every run. */
function mulberry(seed: number) {
  let a = seed + 0x6d2b79f5;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('Surprise me', () => {
  it('always makes a whole, valid doll, whose layers all exist, and keeps the name', () => {
    for (let i = 0; i < 400; i++) {
      const d = surprise('Ada', mulberry(i));
      expect(isValid(d)).toBe(true);
      expect(d.name).toBe('Ada');
      for (const f of files(d)) expect(fs.existsSync(onDisk(f))).toBe(true);
    }
    // At the ends of the random range too.
    for (const r of [() => 0, () => 0.999999]) expect(isValid(surprise('', r))).toBe(true);
  });

  it('is a button that changes the doll and says so', () => {
    render(<DollDesigner />);
    const doll = screen.getByRole('img', { name: describeDoll(FIRST_DOLL) });
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.999);
    fireEvent.click(screen.getByRole('button', { name: 'Surprise me' }));
    spy.mockRestore();
    expect(doll).not.toHaveAccessibleName(describeDoll(FIRST_DOLL));
    expect(screen.getByText(/^A surprise doll\./)).toHaveAttribute('role', 'status');
  });
});

describe('choosing, by touch and by key', () => {
  it('names every skin swatch with its label, in a radio group', () => {
    render(<DollDesigner />);
    const skin = screen.getByRole('radiogroup', { name: 'Skin' });
    const radios = within(skin).getAllByRole('radio');
    expect(radios.map((r) => (r.closest('label') as HTMLElement).textContent)).toEqual(DOLL_ART.skinTones.map((t) => DOLL_ART.skinToneLabels[t]));
    for (const t of DOLL_ART.skinTones) expect(within(skin).getByRole('radio', { name: DOLL_ART.skinToneLabels[t] })).toBeInTheDocument();
    fireEvent.click(within(skin).getByRole('radio', { name: 'very fair with freckles' }));
    expect(screen.getByRole('img', { name: /very fair with freckles skin/ })).toBeInTheDocument();
  });

  it('builds a doll in a wheelchair with a hijab: the hair hidden, a seated outfit, no prosthetic offered', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('radio', { name: 'Wheelchair' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Head' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Hijab' }));
    const doll = screen.getByRole('img', { name: /in a wheelchair with deep brown skin and a hijab, wearing/ });
    const layers = [...doll.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(layers).toContain(`${DOLL_BASE}head/W-hijab.webp`);
    expect(layers.some((s) => s!.includes('/hair/'))).toBe(false);
    expect(layers.some((s) => /\/outfit\/WS-out-/.test(s!))).toBe(true);
    fireEvent.click(screen.getByRole('tab', { name: 'Extras' }));
    expect(screen.queryByRole('checkbox', { name: 'Prosthetic leg' })).toBeNull();
    expect(screen.getByText('The prosthetic leg is for a standing doll.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    expect(screen.getByText('The hair is under the hijab. Pick a style to take it off.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Clothes' }));
    expect(within(screen.getByRole('radiogroup', { name: 'Clothes for sitting' })).getAllByRole('radio')).toHaveLength(outfitsFor('WS').length);
  });

  it('offers the kippah only for the man, and lifts it on locs', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('tab', { name: 'Head' }));
    expect(screen.queryByRole('radio', { name: 'Kippah' })).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: 'Doll' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Man' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Locs' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Head' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Kippah' }));
    const kippah = document.querySelector('.bhr-doll img[data-slot="head"]') as HTMLImageElement;
    expect(kippah.getAttribute('src')).toBe(`${DOLL_BASE}head/M-kippah.webp`);
    expect(kippah.style.transform).toBe(`translateY(${(-21 / 1376) * 100}%)`);
    expect(screen.getByRole('img', { name: /black hair \(locs\) and a kippah/ })).toBeInTheDocument();
  });

  it('shows small thumbnails in the pickers, never the full layers', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('tab', { name: 'Clothes' }));
    const pics = [...document.querySelectorAll('.bhr-choices img')].map((i) => i.getAttribute('src')!);
    expect(pics.length).toBe(outfitsFor('W').length);
    for (const p of pics) expect(p.startsWith(`${DOLL_BASE}thumbs/`)).toBe(true);
  });

  it('moves between the groups by arrow key', () => {
    render(<DollDesigner />);
    const tabs = screen.getByRole('tablist', { name: 'Choices' });
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Doll' }), { key: 'ArrowRight' });
    expect(within(tabs).getByRole('tab', { name: 'Hair' })).toHaveFocus();
    expect(screen.getByRole('radiogroup', { name: 'Hairstyle' })).toBeInTheDocument();
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Hair' }), { key: 'End' });
    expect(within(tabs).getByRole('tab', { name: 'Clothes' })).toHaveFocus();
  });

  it('fetches the next likely layers, not the whole set', () => {
    const next = nextLikely(FIRST_DOLL, 'hair');
    expect(next.length).toBeLessThanOrEqual(4);
    for (const n of next) expect(n.startsWith(`${DOLL_BASE}hair/W-hair-`)).toBe(true);
  });
});

describe('saving and printing', () => {
  it('saves the picture as a PNG drawn in the browser, named for the doll', async () => {
    expect(fileNameFor('Ada Lovelace!')).toBe('ada-lovelace.png');
    expect(fileNameFor('  ')).toBe('my-doll.png');
    const blob = new Blob(['png'], { type: 'image/png' });
    const draws: unknown[][] = [];
    const ctx = { fillRect: jest.fn(), drawImage: (...a: unknown[]) => draws.push(a), fillText: jest.fn(), set fillStyle(_: string) {}, set font(_: string) {}, set textAlign(_: string) {}, set textBaseline(_: string) {} };
    const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never);
    const toBlob = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => cb(blob));
    // Images "load" at once.
    const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      set(v: string) {
        desc.set!.call(this, v);
        setTimeout(() => this.onload?.(new Event('load')), 0);
      },
      get() {
        return desc.get!.call(this);
      },
    });
    const url = jest.fn(() => 'blob:doll');
    Object.assign(URL, { createObjectURL: url, revokeObjectURL: jest.fn() });
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      render(<DollDesigner />);
      fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), { target: { value: 'Ada' } });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Save picture' }));
        await new Promise((r) => setTimeout(r, 20));
      });
      expect(draws).toHaveLength(layersOf(FIRST_DOLL).length);
      expect(ctx.fillText).toHaveBeenCalledWith('Ada', expect.any(Number), expect.any(Number), expect.any(Number));
      expect(url).toHaveBeenCalledWith(blob);
      expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('ada.png');
      expect(screen.getByText(/^Picture saved to your downloads\./)).toHaveAttribute('role', 'status');
    } finally {
      Object.defineProperty(HTMLImageElement.prototype, 'src', desc);
      getContext.mockRestore();
      toBlob.mockRestore();
      click.mockRestore();
    }
  });

  it('prints the doll and its name on one page', () => {
    const print = jest.fn();
    window.print = print;
    render(<DollDesigner />);
    fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), { target: { value: 'Sam' } });
    expect(document.querySelector('.bhr-doll-stage .bhr-doll-name')).toHaveTextContent('Sam');
    fireEvent.click(screen.getByRole('button', { name: 'Print' }));
    expect(print).toHaveBeenCalled();
    const css = fs.readFileSync(path.join(ROOT, 'app/exhibitions/black-history/representation/representation.css'), 'utf8');
    const printCss = css.slice(css.indexOf('@media print'));
    expect(printCss).toMatch(/\.bhr-room\[data-tab='design'\] \.bhr-doll-stage \{[^}]*position: fixed;/);
    expect(printCss).toMatch(/\.bhr-room\[data-tab='design'\] \.bhr-doll-name \{/);
  });
});
