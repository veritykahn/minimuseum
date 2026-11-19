import fs from 'node:fs';
import path from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import DollDesigner, { fileNameFor } from '@/app/exhibitions/black-history/representation/DollDesigner';
import DollArt from '@/app/exhibitions/black-history/representation/DollArt';
import { CANVAS, LEG_STANDING, armPath, legPaths, mix, scallop, shoePath, smoothShape, thighPath, torsoPath, tubePath } from '@/app/exhibitions/black-history/representation/dollShapes';
import {
  CLOTH_COLOURS,
  COVERINGS,
  FIRST_DOLL,
  HAIR_COLOURS,
  HAIR_STYLES,
  OUTFITS,
  TONES,
  describe as describeDoll,
  hidesHair,
  isValid,
  resolve,
  setCovering,
  setHair,
  skinPaint,
  surprise,
  type Doll,
} from '@/app/exhibitions/black-history/representation/dollRules';
import { DESIGN_TEXT } from '@/app/exhibitions/black-history/representation/representationText';

/*
 * Design a doll, rebuilt as our own doll drawn in SVG (Nov 19 2026): the
 * shapes are whole and smooth, every hairstyle has its own back and front,
 * the choices are the range the owner asked for, the rules hold whatever a
 * child does, a surprise is always a whole doll, every choice has a name a
 * screen reader can say, the doll ends on its question and sends the child
 * on, and the picture can be saved and printed.
 */

const DIR = path.join(process.cwd(), 'app/exhibitions/black-history/representation');

/** A small seeded random, so the surprises are the same every run. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** jsdom's Blob has no text(), so read it the old way. */
const readText = (b: Blob) =>
  new Promise<string>((ok) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result));
    r.readAsText(b);
  });

const drawn = (d: Doll) => {
  const { container, unmount } = render(<DollArt doll={d} title="doll" />);
  return { svg: container.querySelector('svg')!, unmount };
};

describe('the doll’s shapes', () => {
  it('are whole, smooth paths with no missing numbers', () => {
    const paths = [
      torsoPath(),
      armPath('left'),
      armPath('right', 4, 330),
      ...legPaths('standing', 'left'),
      ...legPaths('seated', 'right'),
      thighPath('left', 4),
      tubePath(LEG_STANDING, 'left', 4, 444, 700),
      shoePath('seated', 'right', 'trainer'),
      smoothShape([[0, 0], [10, 0], [10, 10]]),
      scallop([[0, 0], [10, 0], [10, 10]], 2),
    ];
    for (const d of paths) {
      expect(d).toMatch(/^M ?-?\d/);
      expect(d).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it('mixes colours', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toMatch(/^#(7f7f7f|808080)$/);
    expect(mix('#d6a755', '#d6a755', 0.3)).toBe('#d6a755');
  });

  it('draws every hairstyle in every colour, and every covering with every outfit, standing and seated, with nothing missing', () => {
    for (const hair of HAIR_STYLES) {
      for (const c of HAIR_COLOURS) {
        const { svg, unmount } = drawn({ ...FIRST_DOLL, hair: hair.id, hairColour: c.id });
        expect(svg.outerHTML).not.toMatch(/NaN|undefined/);
        unmount();
      }
    }
    for (const covering of COVERINGS) {
      for (const outfit of OUTFITS) {
        for (const seated of [false, true]) {
          const { svg, unmount } = drawn({ ...FIRST_DOLL, covering: covering.id, outfit: outfit.id, seated, prosthetic: true, glasses: 'round', hearing: true, freckles: true, vitiligo: true });
          expect(svg.outerHTML).not.toMatch(/NaN|undefined/);
          unmount();
        }
      }
    }
  });

  it('is a drawing on a 400 by 800 canvas, with no pictures loaded from anywhere', () => {
    const { svg } = drawn(FIRST_DOLL);
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${CANVAS.w} ${CANVAS.h}`);
    expect(svg.querySelectorAll('image, img')).toHaveLength(0);
    expect(svg.outerHTML).not.toMatch(/href="http/);
  });

  it('gives the blond its own shading: a deeper gold and a pale highlight, never one flat yellow', () => {
    const blond = HAIR_COLOURS.find((c) => c.id === 'blond')!;
    expect(new Set([blond.base, blond.shade, blond.deep, blond.light]).size).toBe(4);
    const html = drawn({ ...FIRST_DOLL, hair: 'straight', hairColour: 'blond' }).svg.outerHTML;
    for (const c of [blond.base, blond.shade, blond.light]) expect(html).toContain(c);
  });

  it('draws long hair behind the body and in front of it, so it sits round the head', () => {
    const { svg } = drawn({ ...FIRST_DOLL, hair: 'straight', hairColour: 'brown' });
    const brown = HAIR_COLOURS.find((c) => c.id === 'brown')!;
    const all = [...svg.querySelectorAll('path')];
    const torso = all.findIndex((p) => p.getAttribute('d') === torsoPath());
    expect(torso).toBeGreaterThan(-1);
    const hair = all.map((p, i) => ({ i, f: p.getAttribute('fill') })).filter((x) => x.f === brown.base || x.f === brown.shade);
    expect(hair.some((x) => x.i < torso)).toBe(true);
    expect(hair.some((x) => x.i > torso)).toBe(true);
  });

  it('has its own shading for each of twelve skin tones', () => {
    expect(TONES).toHaveLength(12);
    for (const t of TONES) {
      const p = skinPaint(t.id);
      expect(new Set([p.base, p.shade, p.line, p.patch]).size).toBe(4);
    }
  });
});

describe('the range of choices', () => {
  it('has the hairstyles, colours and coverings asked for', () => {
    expect(HAIR_STYLES.map((h) => h.id)).toEqual(['straight', 'wavy', 'curly', 'coily', 'afro', 'puffs', 'braids', 'locs', 'twists', 'bun', 'crop', 'bald']);
    expect(HAIR_COLOURS.filter((c) => !c.fun).map((c) => c.id)).toEqual(['black', 'darkbrown', 'brown', 'auburn', 'red', 'blond', 'lightblond', 'grey']);
    expect(HAIR_COLOURS.filter((c) => c.fun).length).toBeGreaterThanOrEqual(3);
    expect(COVERINGS.map((c) => c.id).sort()).toEqual(['hijab', 'kippah', 'kufi', 'scarf', 'turban', 'wrap']);
    expect(OUTFITS.length).toBeGreaterThanOrEqual(8);
  });

  it('uses no toy brand’s name in the designer', () => {
    for (const f of ['DollDesigner.tsx', 'DollArt.tsx', 'dollRules.ts', 'dollShapes.ts']) {
      expect(fs.readFileSync(path.join(DIR, f), 'utf8')).not.toMatch(/barbie|mattel|bratz/i);
    }
  });

  it('credits no illustration as made with Leonardo', () => {
    for (const f of fs.readdirSync(DIR)) expect(fs.readFileSync(path.join(DIR, f), 'utf8')).not.toMatch(/Leonardo/i);
  });

  it('has no two files whose names differ only in case', () => {
    const names = fs.readdirSync(DIR).map((f) => f.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('the rules', () => {
  it('a covering that hides the hair hides it, and the hair comes back when it comes off', () => {
    expect(COVERINGS.filter((c) => c.hidesHair).map((c) => c.id).sort()).toEqual(['hijab', 'scarf', 'turban', 'wrap']);
    expect(hidesHair('kippah')).toBe(false);
    const covered = setCovering(setHair(FIRST_DOLL, 'braids'), 'wrap');
    expect(covered.hair).toBe('braids');
    expect(describeDoll(covered)).toMatch(/head wrap/);
    expect(describeDoll(covered)).not.toMatch(/braids/);
    expect(describeDoll(setCovering(covered, null))).toMatch(/black hair \(braids\)/);
    // Choosing a hairstyle takes a hiding covering off, but not a kippah or a kufi.
    expect(setHair(covered, 'bun').covering).toBeNull();
    expect(setHair(setCovering(FIRST_DOLL, 'kufi'), 'afro').covering).toBe('kufi');
  });

  it('makes an impossible doll whole again', () => {
    const odd = resolve({ ...FIRST_DOLL, tone: 'purple', hair: 'mohawk', covering: 'crown', outfit: 'cape', glasses: 'monocle' as never, name: 'x'.repeat(40) });
    expect(isValid(odd)).toBe(true);
    expect(odd.covering).toBeNull();
    expect(odd.name).toHaveLength(24);
  });

  it('describes the doll in words, with what it uses', () => {
    const d: Doll = { ...FIRST_DOLL, name: 'Ada', seated: true, glasses: 'round', hearing: true, prosthetic: true, vitiligo: true };
    expect(describeDoll(d)).toBe('Ada: a doll in a wheelchair with dark brown skin, vitiligo, dark brown almond eyes, black hair (puffs), round glasses, hearing aids and a prosthetic leg, wearing an orange print dress.');
  });
});

describe('Surprise me', () => {
  it('always makes a whole, valid doll, and keeps the name', () => {
    for (let i = 0; i < 400; i++) {
      const d = surprise('Ada', seeded(i));
      expect(isValid(d)).toBe(true);
      expect(d.name).toBe('Ada');
    }
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
  it('names every skin swatch, in a radio group, and the doll changes', () => {
    render(<DollDesigner />);
    const skin = screen.getByRole('radiogroup', { name: 'Skin' });
    expect(within(skin).getAllByRole('radio')).toHaveLength(TONES.length);
    fireEvent.click(within(skin).getByRole('radio', { name: 'Very fair' }));
    expect(screen.getByRole('img', { name: /very fair skin/ })).toBeInTheDocument();
  });

  it('shows each hairstyle on the child’s own doll, and a covering hides the hair until a style is picked', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('radio', { name: 'Deepest brown' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    const styles = screen.getByRole('radiogroup', { name: 'Hairstyle' });
    expect(within(styles).getAllByRole('radio')).toHaveLength(HAIR_STYLES.length);
    // The tiles are drawings of this doll, not stock pictures.
    expect(styles.querySelectorAll('img')).toHaveLength(0);
    expect(styles.querySelectorAll('svg').length).toBeGreaterThanOrEqual(HAIR_STYLES.length);
    expect(styles.innerHTML).toContain(TONES[0].base);
    fireEvent.click(screen.getByRole('tab', { name: 'Head' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Hijab' }));
    expect(screen.getByRole('img', { name: /a teal hijab/ })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Hijab colour' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    expect(screen.getByText('The hair is under the hijab. Pick a style to take it off.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Locs' }));
    expect(screen.getByRole('img', { name: /black hair \(locs\)/ })).toBeInTheDocument();
  });

  it('adds glasses, hearing aids, a wheelchair and a prosthetic leg, and says when long clothes cover the leg', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('tab', { name: 'Extras' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Square glasses' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Hearing aids' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Wheelchair' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Prosthetic leg' }));
    expect(screen.getByRole('img', { name: /in a wheelchair .*square glasses, hearing aids and a prosthetic leg/ })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Wheelchair colour' })).toBeInTheDocument();
    expect(screen.queryByText(DESIGN_TEXT.prostheticHidden)).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: 'Clothes' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Suit' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Navy' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Extras' }));
    expect(screen.getByText(DESIGN_TEXT.prostheticHidden)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /wearing a navy suit/ })).toBeInTheDocument();
  });

  it('moves between the groups by arrow key', () => {
    render(<DollDesigner />);
    const tabs = screen.getByRole('tablist', { name: 'Choices' });
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Skin' }), { key: 'ArrowRight' });
    expect(within(tabs).getByRole('tab', { name: 'Face' })).toHaveFocus();
    expect(screen.getByRole('radiogroup', { name: 'Eyes' })).toBeInTheDocument();
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Face' }), { key: 'End' });
    expect(within(tabs).getByRole('tab', { name: 'Extras' })).toHaveFocus();
  });

  it('offers every cloth colour', () => {
    render(<DollDesigner />);
    fireEvent.click(screen.getByRole('tab', { name: 'Clothes' }));
    expect(within(screen.getByRole('radiogroup', { name: 'Colour' })).getAllByRole('radio')).toHaveLength(CLOTH_COLOURS.length);
  });
});

describe('meeting the doll', () => {
  it('asks who the doll is, then how easy it is to find someone like them, and sends the child on', async () => {
    const onGo = jest.fn();
    render(<DollDesigner onGo={onGo} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Someone I love' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), { target: { value: 'Gran' } });
    fireEvent.click(screen.getByRole('button', { name: DESIGN_TEXT.done }));
    const heading = screen.getByRole('heading', { level: 2, name: 'Meet Gran!' });
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(heading).toHaveFocus();
    expect(screen.getByText(DESIGN_TEXT.ask.love)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }));
    expect(screen.getByRole('button', { name: 'Hard' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(DESIGN_TEXT.reply.hard)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /The Doll Test/ }));
    expect(onGo).toHaveBeenCalledWith('doll-test');
    fireEvent.click(screen.getByRole('button', { name: /Who’s in your books/ }));
    expect(onGo).toHaveBeenCalledWith('books');
    fireEvent.click(screen.getByRole('button', { name: DESIGN_TEXT.back }));
    expect(screen.getByRole('tablist', { name: 'Choices' })).toBeInTheDocument();
  });

  it('marks its new words for the owner to check', () => {
    expect(fs.readFileSync(path.join(DIR, 'representationText.ts'), 'utf8')).toMatch(/REVIEW: new text \(the whole of DESIGN_TEXT/);
  });
});

describe('saving and printing', () => {
  it('saves the picture as a PNG drawn in the browser from the doll’s own drawing, named for the doll', async () => {
    expect(fileNameFor('Ada Lovelace!')).toBe('ada-lovelace.png');
    expect(fileNameFor('  ')).toBe('my-doll.png');
    const png = new Blob(['png'], { type: 'image/png' });
    const drawImage = jest.fn();
    const fillText = jest.fn();
    const ctx = { fillRect: jest.fn(), drawImage, fillText, fillStyle: '', font: '', textAlign: '', textBaseline: '' };
    const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never);
    const toBlob = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => cb(png));
    const src = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      set(this: HTMLImageElement, v: string) {
        src.set!.call(this, v);
        setTimeout(() => this.onload?.(new Event('load')), 0);
      },
      get(this: HTMLImageElement) {
        return src.get!.call(this);
      },
    });
    const made: Blob[] = [];
    const before = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = jest.fn((b: Blob) => {
      made.push(b);
      return `blob:doll-${made.length}`;
    });
    URL.revokeObjectURL = jest.fn();
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    try {
      render(<DollDesigner />);
      fireEvent.change(screen.getByRole('textbox', { name: /Name/ }), { target: { value: 'Ada' } });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Save picture' }));
        await new Promise((r) => setTimeout(r, 20));
      });
      expect(made[0].type).toBe('image/svg+xml');
      expect(await readText(made[0])).toMatch(/^<svg[^>]*xmlns="http:\/\/www.w3.org\/2000\/svg"/);
      expect(drawImage).toHaveBeenCalledTimes(1);
      expect(fillText).toHaveBeenCalledWith('Ada', expect.any(Number), expect.any(Number), expect.any(Number));
      expect(made[1]).toBe(png);
      expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('ada.png');
      expect(screen.getByText(/^Picture saved to your downloads\./)).toHaveAttribute('role', 'status');
    } finally {
      Object.defineProperty(HTMLImageElement.prototype, 'src', src);
      URL.createObjectURL = before.create;
      URL.revokeObjectURL = before.revoke;
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
    const css = fs.readFileSync(path.join(DIR, 'representation.css'), 'utf8');
    expect(css).toMatch(/\.bhr-doll \{[^}]*aspect-ratio: 400 \/ 800;/);
    const printCss = css.slice(css.indexOf('@media print'));
    expect(printCss).toMatch(/\.bhr-doll-stage/);
    expect(printCss).toMatch(/\.bhr-doll-name/);
  });
});
