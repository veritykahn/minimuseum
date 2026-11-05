import { act, fireEvent, render, screen, within } from '@testing-library/react';
import HolocaustTimeline from '@/app/exhibitions/holocaust/timeline/page';
import OrderEvents from '@/app/exhibitions/holocaust/timeline/OrderEvents';
import {
  ORDER_COUNT,
  POSTER_INTRO,
  POSTER_LEARN_MORE,
  POSTER_QR_URL,
  TIMELINE_ENTRIES,
  YEARS,
  entryFromHash,
  italicRuns,
  pickEntries,
  placesRight,
  plainWords,
  shuffled,
  sortedIds,
  swapped,
} from '@/app/exhibitions/holocaust/timeline/timelineEntries';
import { POSTER_GROUP, TIMELINE_SOURCES } from '@/app/exhibitions/holocaust/timeline/sources';
import { STOP_SOUNDS, STOP_TEXT, TIMELINE_STOPS } from '@/app/exhibitions/holocaust/timeline/timelineStops';
import { setMuseumSound } from '@/lib/museumSound';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Timeline of the Holocaust: every entry exactly as the owner's poster
 * prints it, in the poster's order, each with its sources in the Sources
 * drawer (none inline) and the poster credited as her design; the years to
 * go straight to; and the quiet "Put them in order" exercise, which swaps
 * cards by tap and by key and never celebrates.
 */

/** The poster, entry by entry: [year, date as printed, words as printed]. */
const POSTER: [number, string, string][] = [
  [1933, 'JANUARY 30', 'Adolf Hitler is appointed Chancellor of Germany'],
  [1933, 'MARCH 22', 'Dachau, the first concentration camp, is established'],
  [1933, 'APRIL 1', 'Nationwide boycott of Jewish businesses in Germany'],
  [1935, 'SEPTEMBER 15', 'The Nuremberg Laws are enacted, stripping Jews of citizenship and banning marriage between Jews and non-Jews'],
  [1938, 'MARCH 12', 'Germany annexes Austria (Anschluss); persecution of Austrian Jews begins'],
  [1938, 'NOVEMBER 9 - 10', '*Kristallnacht* (Night of Broken Glass): Synagogues are burned, Jewish businesses are destroyed, and thousands of Jews are arrested'],
  [1939, 'SEPTEMBER 1', 'Germany invades Poland, starting World War II'],
  [1939, 'OCTOBER', 'Nazis begin *Aktion T4*, the euthanasia program targeting disabled individuals'],
  [1940, 'MAY', 'Auschwitz concentration camp is established'],
  [1940, 'OCTOBER', 'The Warsaw Ghetto is established, confining hundreds of thousands of Jews'],
  [1941, 'JUNE 22', 'Germany invades the Soviet Union; Einsatzgruppen begin mass shootings of Jews in occupied territories.'],
  [1941, 'SEPTEMBER 29-30', 'Over 33,000 Jews are murdered during the Babi Yar massacre near Kyiv'],
  [1941, 'DECEMBER 8', 'Chelmno, the first extermination camp, begins operations'],
  [1942, 'JANUARY 20, 1942', 'The Wannsee Conference formalizes the “Final Solution,” planning the extermination of Jews.'],
  [1942, 'MARCH', 'Mass extermination begins at Belzec, Sobibor, and Treblinka camps'],
  [1943, 'APRIL 19 - MAY 16', 'The Warsaw Ghetto Uprising, where Jews resist deportation to extermination camps, occurs'],
  [1944, 'JUNE 6', 'D-Day: Allied forces invade Normandy, opening a Western front.'],
  [1944, 'JULY 23', 'Soviet forces liberate Majdanek, the first major concentration camp to be freed'],
  [1945, 'JANUARY 27', 'Soviet troops liberate Auschwitz-Bikenau'],
  [1945, 'MAY 8', 'Germany surrenders, ending World War II in Europe and the Holocaust'],
];

const openSources = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  return screen.getByRole('dialog', { name: 'Sources and credits' });
};
const sourcesGroup = (drawer: HTMLElement, title: string) => within(drawer).getByRole('heading', { name: title }).closest('section') as HTMLElement;
const timeline = () => screen.getByRole('list', { name: 'The timeline, 1933 to 1945' });

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('the poster’s words', () => {
  it('are every entry, word for word, in the poster’s order', () => {
    expect(TIMELINE_ENTRIES.map((e) => [e.year, e.date, e.words])).toEqual(POSTER);
    expect(new Set(TIMELINE_ENTRIES.map((e) => e.id)).size).toBe(TIMELINE_ENTRIES.length);
    // The ids are the dates, so the poster's order is the order of time.
    expect(TIMELINE_ENTRIES.map((e) => e.id)).toEqual([...TIMELINE_ENTRIES.map((e) => e.id)].sort());
    for (const e of TIMELINE_ENTRIES) expect(e.id.startsWith(String(e.year))).toBe(true);
    expect(YEARS).toEqual([1933, 1935, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945]);
  });

  it('keep the poster’s opening line, and its italics', () => {
    expect(POSTER_INTRO).toBe('THE HOLOCAUST WAS THE SYSTEMATIC, STATE-SPONSORED PERSECUTION AND MURDER OF SIX MILLION JEWS BY THE NAZI REGIME AND ITS ALLIES AND COLLABORATORS WHICH BEGAN IN 1933.');
    const italic = TIMELINE_ENTRIES.flatMap((e) => italicRuns(e.words).filter((r) => r.italic).map((r) => r.text));
    expect(italic).toEqual(['Kristallnacht', 'Aktion T4']);
    expect(plainWords(TIMELINE_ENTRIES[5].words)).toMatch(/^Kristallnacht \(Night of Broken Glass\)/);
  });

  it('sit either side of the line, turn and turn about, as the poster sets them', () => {
    TIMELINE_ENTRIES.forEach((e, i) => expect(e.side).toBe(i % 2 === 0 ? 'right' : 'left'));
  });

  it('each have a source from the USHMM Holocaust Encyclopedia', () => {
    for (const e of TIMELINE_ENTRIES) {
      expect(e.sources.length).toBeGreaterThan(0);
      for (const s of e.sources) {
        expect(s.href).toMatch(/^https:\/\/encyclopedia\.ushmm\.org\/content\/en\//);
        expect(s.label).toMatch(/^USHMM Holocaust Encyclopedia, “.+”$/);
      }
    }
  });
});

describe('the room', () => {
  it('sets the title, the opening line and every entry, with its date for the screen reader', () => {
    render(<HolocaustTimeline />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('TIMELINE OF THE Holocaust');
    expect(screen.getByText(POSTER_INTRO)).toBeInTheDocument();
    const items = within(timeline()).getAllByRole('listitem');
    expect(items).toHaveLength(TIMELINE_ENTRIES.length);
    items.forEach((li, i) => {
      const e = TIMELINE_ENTRIES[i];
      expect(li).toHaveAttribute('id', e.id);
      expect(li).toHaveTextContent(plainWords(e.words));
      expect(li).toHaveTextContent(e.date);
      expect(li).toHaveTextContent(e.when);
    });
    // The poster's italics, in italics.
    expect(within(timeline()).getAllByText(/^(Kristallnacht|Aktion T4)$/).map((el) => el.tagName)).toEqual(['EM', 'EM']);
  });

  it('cites nothing inline: no links on the line, no "Source:" lines', () => {
    render(<HolocaustTimeline />);
    expect(within(timeline()).queryAllByRole('link')).toHaveLength(0);
    expect(screen.queryByText(/^Sources?:/)).toBeNull();
  });

  it('draws the barbed wire and the star as decoration only', () => {
    const { container } = render(<HolocaustTimeline />);
    const wires = container.querySelectorAll('svg.hot-wire');
    expect(wires).toHaveLength(2);
    for (const w of wires) expect(w).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('svg.hot-star')).toHaveAttribute('aria-hidden', 'true');
  });

  it('goes straight to a year: its first entry, focused, with its own address', () => {
    render(<HolocaustTimeline />);
    const years = within(screen.getByRole('navigation', { name: 'Go to a year' })).getAllByRole('link');
    expect(years.map((a) => a.textContent)).toEqual(YEARS.map(String));
    expect(years.map((a) => a.getAttribute('href'))).toEqual(YEARS.map((y) => `#${TIMELINE_ENTRIES.find((e) => e.year === y)!.id}`));
    fireEvent.click(screen.getByRole('link', { name: '1938' }));
    expect(document.activeElement).toBe(document.getElementById('1938-03-12'));
    expect(window.location.hash).toBe('#1938-03-12');
  });

  it('opens at the entry or the year an address names', async () => {
    expect(entryFromHash('#1941-12-08')).toBe('1941-12-08');
    expect(entryFromHash('#1942')).toBe('1942-01-20');
    expect(entryFromHash('#1950')).toBeNull();
    expect(entryFromHash('#order')).toBeNull();
    window.history.replaceState(null, '', '/#1944');
    render(<HolocaustTimeline />);
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(document.activeElement).toBe(document.getElementById('1944-06-06'));
  });

  it('closes on the poster’s "Learn more", a link to where its QR code leads', () => {
    render(<HolocaustTimeline />);
    const link = screen.getByRole('link', { name: new RegExp(`^${POSTER_LEARN_MORE}`) });
    expect(link).toHaveAttribute('href', POSTER_QR_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(POSTER_QR_URL).toBe('https://encyclopedia.ushmm.org/content/en/timeline/holocaust');
  });
});

describe('the Sources drawer', () => {
  it('credits the poster as the owner’s design, and where its QR code leads', () => {
    render(<HolocaustTimeline />);
    const group = sourcesGroup(openSources(), 'The poster');
    expect(group).toHaveTextContent('The Timeline of the Holocaust, designed by Verity Kahn');
    expect(within(group).getByText('The Timeline of the Holocaust').tagName).toBe('EM');
    expect(within(group).getByRole('link')).toHaveAttribute('href', POSTER_QR_URL);
    expect(group).not.toHaveTextContent(/Leonardo/i);
  });

  it('lists every entry’s sources under its date and words', () => {
    render(<HolocaustTimeline />);
    const drawer = openSources();
    expect(TIMELINE_SOURCES[0]).toBe(POSTER_GROUP);
    expect(within(drawer).getAllByRole('heading', { level: 3 })).toHaveLength(TIMELINE_ENTRIES.length + 1);
    for (const e of TIMELINE_STOPS) {
      const group = sourcesGroup(drawer, `${e.when}: ${plainWords(e.words)}`);
      // The entry's sources, then its photograph's credit.
      const hrefs = [...e.sources.map((s) => s.href), ...(e.picture ? [e.picture.credit.href] : [])];
      expect(within(group).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(hrefs);
    }
  });
});

describe('the stops', () => {
  const openStop = (id: string) => fireEvent.click(document.getElementById(`hot-open-${id}`)!);

  it('opens each date in a window, with its words as printed, and walks the timeline', () => {
    render(<HolocaustTimeline />);
    const first = TIMELINE_ENTRIES[0];
    openStop(first.id);
    const dialog = screen.getByRole('dialog', { name: first.when });
    expect(within(dialog).getByText(first.words)).toBeInTheDocument();
    expect(within(dialog).getByText(STOP_TEXT.of(1, TIMELINE_ENTRIES.length))).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /Before/ })).toBeDisabled();
    expect(within(dialog).getByRole('button', { name: STOP_TEXT.close })).toHaveFocus();

    fireEvent.click(within(dialog).getByRole('button', { name: /Next/ }));
    expect(screen.getByRole('dialog', { name: TIMELINE_ENTRIES[1].when })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' });
    expect(screen.getByRole('dialog', { name: TIMELINE_ENTRIES[2].when })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog', { name: TIMELINE_ENTRIES[1].when })).toBeInTheDocument();
  });

  it('closes with Esc, back on the date last open', async () => {
    render(<HolocaustTimeline />);
    openStop(TIMELINE_ENTRIES[0].id);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await act(() => new Promise((r) => requestAnimationFrame(() => r(undefined))));
    expect(document.getElementById(`hot-open-${TIMELINE_ENTRIES[1].id}`)).toHaveFocus();
  });

  it('the last stop has no Next', () => {
    render(<HolocaustTimeline />);
    openStop(TIMELINE_ENTRIES[TIMELINE_ENTRIES.length - 1].id);
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: /Next/ })).toBeDisabled();
  });

  it('every stop has its photograph', () => {
    expect(TIMELINE_STOPS.filter((s) => !s.picture).map((s) => s.id)).toEqual([]);
  });

  it('shows a photograph, credited in the Sources drawer, or a quiet "Picture to come"', () => {
    render(<HolocaustTimeline />);
    for (const stop of TIMELINE_STOPS) {
      openStop(stop.id);
      const dialog = screen.getByRole('dialog');
      if (stop.picture) {
        expect(within(dialog).getByRole('img', { name: stop.picture.alt })).toHaveAttribute('src', stop.picture.src);
        const group = TIMELINE_SOURCES.find((g) => g.title.startsWith(stop.when))!;
        expect(group.items).toContainEqual(expect.objectContaining({ note: 'Photograph', href: stop.picture.credit.href }));
      } else {
        expect(within(dialog).getByText(STOP_TEXT.pictureToCome)).toBeInTheDocument();
      }
      fireEvent.keyDown(dialog, { key: 'Escape' });
    }
  });

  it('a stop with a sound plays it once, only with the museum’s sound on', () => {
    jest.useFakeTimers();
    const play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    try {
      const [id] = Object.keys(STOP_SOUNDS);
      setMuseumSound(false);
      render(<HolocaustTimeline />);
      openStop(id);
      act(() => jest.advanceTimersByTime(1000));
      expect(play).not.toHaveBeenCalled();
      const speaker = within(screen.getByRole('dialog')).getByRole('button', { name: STOP_TEXT.sound });
      expect(speaker).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(speaker);
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      openStop(id);
      act(() => jest.advanceTimersByTime(1000));
      expect(play).toHaveBeenCalledTimes(1);
      // Most stops are silent, and show no speaker.
      const silent = TIMELINE_ENTRIES.find((e) => !STOP_SOUNDS[e.id])!;
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      openStop(silent.id);
      expect(within(screen.getByRole('dialog')).queryByRole('button', { name: STOP_TEXT.sound })).not.toBeInTheDocument();
      expect(Object.keys(STOP_SOUNDS).length).toBeLessThan(TIMELINE_ENTRIES.length / 2);
    } finally {
      setMuseumSound(false);
      play.mockRestore();
      jest.useRealTimers();
    }
  });
});

describe('put them in order', () => {
  const IDS = ['1933-01-30', '1938-11-09', '1941-06-22', '1943-04-19', '1945-05-08'];

  it('picks five entries from five different years, in order, and mixes them up', () => {
    for (let seed = 1; seed < 40; seed++) {
      let x = seed;
      const rand = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
      const ids = pickEntries(rand);
      expect(ids).toHaveLength(ORDER_COUNT);
      expect(new Set(ids.map((id) => id.slice(0, 4))).size).toBe(ORDER_COUNT);
      expect(ids).toEqual(sortedIds(ids));
      const mixed = shuffled(ids, rand);
      expect([...mixed].sort()).toEqual([...ids].sort());
      expect(mixed).not.toEqual(ids);
    }
    expect(shuffled(IDS, () => 0.999)).not.toEqual(IDS);
    expect(swapped(IDS, 0, 4)).toEqual(['1945-05-08', '1938-11-09', '1941-06-22', '1943-04-19', '1933-01-30']);
    expect(placesRight(swapped(IDS, 0, 4))).toEqual([false, true, true, true, false]);
  });

  it('opens from the end of the timeline, and goes back to it', () => {
    render(<HolocaustTimeline />);
    fireEvent.click(screen.getByRole('button', { name: 'Put them in order' }));
    expect(window.location.hash).toBe('#order');
    expect(screen.getByRole('heading', { name: 'Put them in order' })).toHaveFocus();
    expect(screen.queryByRole('list', { name: 'The timeline, 1933 to 1945' })).toBeNull();
    expect(screen.getAllByRole('button', { name: /^Card \d/ })).toHaveLength(ORDER_COUNT);
    fireEvent.click(screen.getByRole('button', { name: 'Back to the timeline' }));
    expect(timeline()).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('opens at its own address', () => {
    window.history.replaceState(null, '', '/#order');
    render(<HolocaustTimeline />);
    expect(screen.getByRole('heading', { name: 'Put them in order' })).toBeInTheDocument();
  });

  it('swaps two cards by tap, and moves a picked-up card with the arrow keys', () => {
    render(<OrderEvents onBack={() => {}} initialIds={IDS} initialOrder={swapped(IDS, 0, 4)} />);
    const card = (n: number) => screen.getByRole('button', { name: new RegExp(`^Card ${n}:`) });
    expect(card(1)).toHaveAccessibleName(/Germany surrenders/);
    fireEvent.click(card(1));
    expect(card(1)).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(card(5));
    expect(card(1)).toHaveAccessibleName(/Adolf Hitler/);
    expect(card(5)).toHaveAccessibleName(/Germany surrenders/);
    expect(card(5)).toHaveFocus();
    // Picked up, the arrow keys carry it.
    fireEvent.click(card(2));
    fireEvent.keyDown(card(2), { key: 'ArrowDown' });
    expect(card(3)).toHaveAccessibleName(/Kristallnacht/);
    expect(card(3)).toHaveAttribute('aria-pressed', 'true');
    expect(card(3)).toHaveFocus();
    fireEvent.keyDown(card(3), { key: 'ArrowUp' });
    fireEvent.keyDown(card(2), { key: 'Escape' });
    expect(card(2)).toHaveAttribute('aria-pressed', 'false');
  });

  it('checks the order quietly, with the dates, and says plainly when all are in place', () => {
    const { container } = render(<OrderEvents onBack={() => {}} initialIds={IDS} initialOrder={swapped(IDS, 0, 4)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check the order' }));
    expect(screen.getByRole('status')).toHaveTextContent('3 of 5 are in their place. Swap the others and check again.');
    expect(screen.getByRole('button', { name: /^Card 1:/ })).toHaveAccessibleName(/May 8, 1945, not in its place yet$/);
    expect(screen.getByRole('button', { name: /^Card 2:/ })).toHaveAccessibleName(/November 9–10, 1938, in its place$/);
    fireEvent.click(screen.getByRole('button', { name: /^Card 1:/ }));
    fireEvent.click(screen.getByRole('button', { name: /^Card 5:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Check the order' }));
    expect(screen.getByRole('status')).toHaveTextContent('All five are in order.');
    expect(screen.getByRole('button', { name: 'Five more events' })).toBeInTheDocument();
    // Nothing celebrates: no confetti, no bursts, no sound, no score.
    expect(container.querySelector('[class*="confetti"], [class*="burst"], audio')).toBeNull();
    expect(container).not.toHaveTextContent(/!|score|well done|great/i);
  });
});

describe('wiring', () => {
  it('puts the room on the museum map, beside Never Forget', () => {
    // The room's card on the landing page is for the owner to add (holocaust.ts is being restructured).
    const href = '/exhibitions/holocaust/timeline';
    expect(getRoomByPath(href)?.id).toBe('ho-timeline');
    expect(getLevelConfig(href).title).toBe('International Holocaust Remembrance Day');
    expect(getLevelConfig(href).floorPlan?.rooms.map((r) => r.id)).toEqual(expect.arrayContaining(['ho-stones', 'ho-timeline']));
  });
});
