// ─── Jazz Studio Data ────────────────────────────────────────────────────────

const BASE = '/exhibitions/harlem/audio/jazz-studio';

function secs(prefix: string, nums: number[]): Record<number, string> {
  return Object.fromEntries(nums.map(n => [n, `${BASE}/${prefix}${n}.mp3`]));
}

export type StudioTrack = {
  id: string;
  name: string;
  emoji: string;
  sections: Record<number, string>; // section number → audio path
};

export type StudioKit = {
  id: string;
  name: string;
  bpm: number;
  musicalKey: string;
  tracks: StudioTrack[];
  allSections: number[];
  defaultArrangement: number[];
};

export const STUDIO_KITS: StudioKit[] = [
  {
    id: 'bu',
    name: 'Blues Underground',
    bpm: 118,
    musicalKey: 'F',
    tracks: [
      { id: 'drums', name: 'Drums', emoji: '\u{1F941}', sections: secs('118_bu_drums_', [1, 2, 3, 4, 5, 6, 7, 8, 9]) },
      { id: 'piano', name: 'Piano', emoji: '\u{1F3B9}', sections: secs('118_f_bu_piano_', [1, 6, 7]) },
      { id: 'horns', name: 'Horns', emoji: '\u{1F3B6}', sections: secs('118_f_bu_horns_', [2, 3, 4, 5, 8]) },
    ],
    allSections: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    defaultArrangement: [1, 3, 6, 8],
  },
  {
    id: 'sg',
    name: 'Swing Gate',
    bpm: 118,
    musicalKey: 'B\u266D',
    tracks: [
      { id: 'drums', name: 'Drums', emoji: '\u{1F941}', sections: secs('118_sg_drums_', [1, 2, 3, 4, 5, 6, 7, 8]) },
      { id: 'horns', name: 'Horns', emoji: '\u{1F3B6}', sections: secs('118_bb_sg_horns_', [1, 2, 3, 4, 5, 6, 7, 8]) },
      { id: 'bass', name: 'Bass Line', emoji: '\u{1F3B8}', sections: secs('118_bb_sg_drums-ac_bass_', [1, 2, 3, 8]) },
    ],
    allSections: [1, 2, 3, 4, 5, 6, 7, 8],
    defaultArrangement: [1, 3, 5, 8],
  },
  {
    id: 'egs',
    name: 'East Side Groove',
    bpm: 122,
    musicalKey: 'C',
    tracks: [
      { id: 'drums', name: 'Drums', emoji: '\u{1F941}', sections: secs('122_egs_drums_', [1, 2, 3, 4, 5, 6]) },
      { id: 'horns', name: 'Horns', emoji: '\u{1F3B6}', sections: secs('122_c_egs_horns_', [1, 2, 3, 4, 5]) },
    ],
    allSections: [1, 2, 3, 4, 5, 6],
    defaultArrangement: [1, 2, 4, 5],
  },
  {
    id: 'cd',
    name: 'Cotton Dance',
    bpm: 133,
    musicalKey: 'E',
    tracks: [
      { id: 'drums', name: 'Drums', emoji: '\u{1F941}', sections: secs('133_cd_drums_', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]) },
      { id: 'piano', name: 'Piano', emoji: '\u{1F3B9}', sections: secs('133_e_cd_piano_', [1, 2, 9, 10, 11, 12]) },
      { id: 'horns', name: 'Horns', emoji: '\u{1F3B6}', sections: secs('133_e_cd_horns_', [3, 4, 5, 6, 7, 8, 13, 14, 15, 16, 17, 18, 19]) },
    ],
    allSections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    defaultArrangement: [1, 5, 10, 18],
  },
  {
    id: 'scr',
    name: 'Savoy Club Rhythm',
    bpm: 136,
    musicalKey: 'B\u266D',
    tracks: [
      { id: 'drums', name: 'Drums', emoji: '\u{1F941}', sections: secs('136_scr_drums_', [1, 2, 3, 4, 5, 6, 7]) },
      { id: 'piano', name: 'Piano', emoji: '\u{1F3B9}', sections: secs('136_bb_scr_piano_', [1]) },
      { id: 'horns', name: 'Horns', emoji: '\u{1F3B6}', sections: secs('136_bb_scr_horns_', [2, 3, 4, 5, 6, 7]) },
    ],
    allSections: [1, 2, 3, 4, 5, 6, 7],
    defaultArrangement: [1, 3, 5, 7],
  },
];

export const STUDIO_KIT_MAP: Record<string, StudioKit> = Object.fromEntries(
  STUDIO_KITS.map(k => [k.id, k])
) as Record<string, StudioKit>;
