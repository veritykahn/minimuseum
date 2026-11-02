import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { CREATURES } from './boxes';
import { CHOICES } from './KnownOrUnknown';

/*
 * Every source and picture credit in What Scares You?, by experiment, for
 * its Sources drawer: nothing is cited on the screen itself. The creatures'
 * photographs are credited in full, title, author and licence, which is
 * what their licences ask. The words on the posters need no source; the
 * boxes are the owner's own pictures, and are not credited, at her request.
 */

const name = (n: string) => n.replace('!', '');

/** The lab's recordings: slot, title, author, page. All Creative Commons 0, credited anyway (public/exhibitions/fear-lab/sounds/credits.txt). */
const SOUNDS: readonly [string, string, string, string][] = [
  ['creak', 'Heavy Door Creaking_05', 'rambler52', 'https://freesound.org/s/455324/'],
  ['lid-close', 'Kitchen Drawer Close 3', 'RutgerMuller', 'https://freesound.org/s/50735/'],
  ['harmless', 'Small Bell #2', 'steffcaffrey', 'https://freesound.org/s/452379/'],
  ['empty', 'Little Whoosh 3', 'ch_ase', 'https://freesound.org/s/423798/'],
  ['scary', 'Stingers and Stabs 001', 'OverlookHotelRecords', 'https://freesound.org/s/271945/'],
  ['spiders', 'creatures-scuttle-01', 'MinigunFiend', 'https://freesound.org/s/175228/'],
  ['creature-cockroach', 'Skittering bugs', 'Mendenhall02', 'https://freesound.org/s/521869/'],
  ['creature-tarantula', 'creatures-scratchy', 'MinigunFiend', 'https://freesound.org/s/175216/'],
  ['creature-bat', 'short pigeon wing flap', 'zouzmusic', 'https://freesound.org/s/414671/'],
  ['creature-snake', 'Snake Hiss', 'xoiziox', 'https://freesound.org/s/553374/'],
  ['creature-rat', 'rat-squeak', 'toefur', 'https://freesound.org/s/288941/'],
  ['creature-centipede', 'Spider_Scuttle', 'KL_Falcon', 'https://freesound.org/s/580511/'],
  ['slime', 'slime noise 10_1', 'jtap97', 'https://freesound.org/s/448886/'],
  ['confetti', 'partypopper', 'Streety', 'https://freesound.org/s/26349/'],
  ['boing', 'Boing 2', 'magnuswaker', 'https://freesound.org/s/540790/'],
  ['squeak', 'Rubber chicken', 'mixmasterdylan', 'https://freesound.org/s/521706/'],
  ['bubbles', 'Soap bubbles pop', 'bojan_t95', 'https://freesound.org/s/507006/'],
  ['feather', 'cartoon_wink_magic_sparkle', 'MLaudio', 'https://freesound.org/s/511485/'],
  ['zap', 'Zap', 'jnr hacksaw', 'https://freesound.org/s/11221/'],
  ['big-zap', 'Long Crackle 04', 'ironcross32', 'https://freesound.org/s/582631/'],
  ['clock', 'Clock Ticks (Loopable!)', 'se2001', 'https://freesound.org/s/511967/'],
  ['dread', 'Riser Suspense', '9voltplasma', 'https://freesound.org/s/721435/'],
  ['skitter', 'Tapping on glass', 'EugeneEverett', 'https://freesound.org/s/596517/'],
  ['marbles', 'Bottle of Marbles', 'andresrojashere', 'https://freesound.org/s/560063/'],
  ['ghost', 'Woooooo_TreasureIsland', 'sierra721', 'https://freesound.org/s/718952/'],
  ['haunt', 'Organ Sting', 'nomiqbomi', 'https://freesound.org/s/578805/'],
  ['tick', 'Soft UI Button Click', 'Jummit', 'https://freesound.org/s/528561/'],
  ['rustle', 'Leaves_Rustling_Edited', 'AmberdeMeillon', 'https://freesound.org/s/443065/'],
  ['growl', 'growl6', 'lendrick', 'https://freesound.org/s/77637/'],
  ['gust', 'Wind5', 'vandale', 'https://freesound.org/s/379472/'],
  ['startle', 'Thump', 'DigestContent', 'https://freesound.org/s/458877/'],
];

export const LAB_SOURCES: readonly SourceGroup[] = [
  {
    title: 'The Fear Boxes: the creatures’ facts',
    items: CREATURES.flatMap((c) => c.fact.sources.map((s) => ({ ...s, note: name(c.name) }))),
  },
  {
    title: 'The Fear Boxes: the photographs (cut out from their backgrounds)',
    items: CREATURES.map((c) => ({
      label: `${c.credit.title}, ${c.credit.author}`,
      href: c.credit.href,
      note: name(c.name),
      licence: c.credit.licenceHref ? `${c.credit.licence}, ${c.credit.licenceHref}` : c.credit.licence,
    })),
  },
  {
    title: 'Known or Unknown?',
    items: CHOICES.flatMap((c) => (c.fact ? c.fact.sources.map((s) => ({ ...s, note: c.question })) : [])),
  },
  {
    title: 'The lab’s sounds',
    items: SOUNDS.map(([slot, title, author, href]) => ({ label: `“${title}” by ${author}`, href, note: `The ${slot.replace('creature-', '').replace('-', ' ')}`, licence: 'CC0, via Freesound' })),
  },
];
