import { fireEvent, render, screen } from '@testing-library/react';
import PutInTomb from '@/app/exhibitions/egypt/PutInTomb';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { MY_TOMB_PATH, TOMB_KEY, TOMB_PLACES, emptyTomb, isKept, keepInTomb, keptCount, placeFor, readTomb, writeTomb } from '@/app/exhibitions/egypt/tombState';

/*
 * The Egypt journey (Nov 19): Build Your Own Tomb first, then every room
 * ends by putting what it made in the visitor's tomb. These tests cover the
 * tomb's places and the PutInTomb moment shared by every room.
 */

beforeEach(() => window.localStorage.clear());

describe('the tomb’s places', () => {
  it('has one place for each room, each a door to that room, in the landing’s own list', () => {
    expect(TOMB_PLACES.map((p) => p.activity).sort()).toEqual(['amulet', 'mummification', 'name', 'rosetta', 'walls', 'weighing']);
    const landing = (EGYPT.interactives ?? []).map((i) => i.href);
    expect(landing[0]).toBe(MY_TOMB_PATH);
    for (const p of TOMB_PLACES) expect(landing).toContain(p.href);
    expect(new Set(TOMB_PLACES.map((p) => p.place)).size).toBe(TOMB_PLACES.length);
    expect(placeFor('amulet').place).toBe('the niche');
  });

  it('keeps each room’s thing, counts them, and empties the tomb for a new one, keeping what the rooms saved', () => {
    expect(keptCount(readTomb())).toBe(0);
    keepInTomb('amulet', 'your amulet');
    keepInTomb('walls', 'the painting of the marshes');
    writeTomb((s) => ({ ...s, painting: 'menna-marshes', cartouche: 'Maya' }));
    let s = readTomb();
    expect(isKept(s, 'amulet')).toBe(true);
    expect(isKept(s, 'rosetta')).toBe(false);
    expect(keptCount(s)).toBe(2);
    expect(s.done.amulet).toBe(true);
    // Putting a room's thing in again replaces it.
    keepInTomb('amulet', 'your second amulet');
    expect(readTomb().kept?.amulet).toBe('your second amulet');
    emptyTomb();
    s = readTomb();
    expect(keptCount(s)).toBe(0);
    expect(s.painting).toBeUndefined();
    expect(s.cartouche).toBe('Maya');
    expect(s.done.amulet).toBe(true);
  });
});

describe('Put this in your burial tomb', () => {
  it('names the place waiting, puts the thing in, and takes the focus to the way to the tomb', () => {
    const onPut = jest.fn();
    render(<PutInTomb activity="rosetta" what="a papyrus with the royal name you cracked, Ptolemy" onPut={onPut} />);
    expect(screen.getByText(/the scroll stand/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Put this in your burial tomb' }));
    expect(onPut).toHaveBeenCalledTimes(1);
    expect(readTomb().kept?.rosetta).toBe('a papyrus with the royal name you cracked, Ptolemy');
    expect(screen.getByText('It is in your tomb!')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Go to your tomb/ });
    expect(link).toHaveAttribute('href', MY_TOMB_PATH);
    expect(link).toHaveFocus();
  });

  it('says so when the room’s thing is already in the tomb, and takes a label of the room’s own', () => {
    keepInTomb('walls', 'the painting of the marshes');
    render(<PutInTomb activity="walls" what="the painting of the garden" label="Paint this wall in your tomb" />);
    expect(screen.getByText('Already in your tomb')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Paint this wall in your tomb' }));
    expect(readTomb().kept?.walls).toBe('the painting of the garden');
  });

  it('still works with storage blocked, for the page that is open', () => {
    const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<PutInTomb activity="name" what="your name, carved in a cartouche" />);
    fireEvent.click(screen.getByRole('button', { name: 'Put this in your burial tomb' }));
    expect(screen.getByText('It is in your tomb!')).toBeInTheDocument();
    expect(window.localStorage.getItem(TOMB_KEY)).toBeNull();
    set.mockRestore();
  });
});
