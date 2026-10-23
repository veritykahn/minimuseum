// ─── Jazz Studio Data ────────────────────────────────────────────────────────
// Complete loop definitions for the drag-and-drop timeline arranger.
// Each loop has an estimated bar count; actual duration comes from the decoded buffer.

const BASE = '/exhibitions/harlem/audio/jazz-studio';

export type InstrumentCategory = 'drums' | 'piano' | 'horns' | 'bass' | 'combo';

export const INST_COLORS: Record<InstrumentCategory, string> = {
  drums: '#6B8E9B',
  piano: '#7BA05B',
  horns: '#C9A94E',
  bass: '#B87333',
  combo: '#8B6BAE',
};

export const INST_EMOJI: Record<InstrumentCategory, string> = {
  drums: '\u{1F941}',
  piano: '\u{1F3B9}',
  horns: '\u{1F3B6}',
  bass: '\u{1F3B8}',
  combo: '\u{1F3B5}',
};

export const INST_NAMES: Record<InstrumentCategory, string> = {
  drums: 'Drums',
  piano: 'Piano',
  horns: 'Horns',
  bass: 'Bass',
  combo: 'Combos',
};

export type LoopDef = {
  id: string;
  file: string;
  instrument: InstrumentCategory;
  /** The original short code from the sample pack (D1, P6, BD9...). */
  code: string;
  /** A descriptive name for students, from listening to the loop. */
  label: string;
  bars: number;
};

export type SessionDef = {
  id: string;
  name: string;
  bpm: number;
  key: string;
  instruments: InstrumentCategory[];
  loops: LoopDef[];
};

export const TIMELINE_DURATION = 180; // 3 minutes

export function loopDuration(bpm: number, bars: number): number {
  return bars * (240 / bpm);
}

export function snapToBar(time: number, bpm: number): number {
  const bar = 240 / bpm;
  return Math.max(0, Math.round(time / bar) * bar);
}

function L(inst: InstrumentCategory, file: string, code: string, label: string, bars: number): LoopDef {
  return { id: file, file: `${BASE}/${file}.mp3`, instrument: inst, code, label, bars };
}

export const SESSIONS: SessionDef[] = [
  // ── Blues Underground ─────────────────────────────────────────────
  {
    id: 'bu',
    name: 'Blues Underground',
    bpm: 118,
    key: 'F',
    instruments: ['drums', 'piano', 'horns', 'bass', 'combo'],
    loops: [
      L('drums', '118_bu_drums_1', 'D1', 'Full-kit groove', 4),
      L('drums', '118_bu_drums_2', 'D2', 'Full-kit groove 2', 4),
      L('drums', '118_bu_drums_2_v', 'D2v', 'Light groove, kick comes in', 4),
      L('drums', '118_bu_drums_3', 'D3', 'Pickup into groove', 4),
      L('drums', '118_bu_drums_3_v', 'D3v', 'Cymbals, late kick', 4),
      L('drums', '118_bu_drums_4', 'D4', 'Sparse kick and cymbal', 4),
      L('drums', '118_bu_drums_5', 'D5', 'Light groove that builds', 4),
      L('drums', '118_bu_drums_6', 'D6', 'Full-kit groove 3', 4),
      L('drums', '118_bu_drums_6_v', 'D6v', 'Quiet hi-hat and snare', 4),
      L('drums', '118_bu_drums_7', 'D7', 'Full-kit groove 4', 4),
      L('drums', '118_bu_drums_7_v', 'D7v', 'Light groove, big last bar', 4),
      L('drums', '118_bu_drums_8', 'D8', 'Hi-hats only', 4),
      L('drums', '118_bu_drums_8_v', 'D8v', 'Light start, heavy finish', 4),
      L('drums', '118_bu_drums_9', 'D9', 'Busy full-kit groove', 4),
      L('piano', '118_f_bu_piano_1', 'P1', 'Bluesy piano chords', 4),
      L('piano', '118_f_bu_piano_6', 'P6', 'Blues piano solo', 8),
      L('piano', '118_f_bu_piano_7', 'P7', 'Two-handed blues piano', 8),
      L('horns', '118_f_bu_horns_2', 'H2', 'Horn section riff', 8),
      L('horns', '118_f_bu_horns_3', 'H3', 'Horn section riff 2', 8),
      L('horns', '118_f_bu_horns_4', 'H4', 'High horn chords', 4),
      L('horns', '118_f_bu_horns_5', 'H5', 'Short horn phrase', 4),
      L('horns', '118_f_bu_horns_8', 'H8', 'Horn melody', 8),
      L('bass', '118_f_bu_ac_bass_9', 'B9', 'Walking bass in F', 4),
      L('combo', '118_f_bu_piano-ac_bass_1', 'PB1', 'Piano chords and bass', 4),
      L('combo', '118_f_bu_piano-ac_bass_7', 'PB7', 'Walking bass with piano', 8),
      L('combo', '118_f_bu_ac_bass_drums_9', 'BD9', 'Walking bass with drums', 4),
    ],
  },
  // ── Cotton Dance ──────────────────────────────────────────────────
  {
    id: 'cd',
    name: 'Cotton Dance',
    bpm: 133,
    key: 'E',
    instruments: ['drums', 'piano', 'horns', 'combo'],
    loops: [
      L('drums', '133_cd_drums_1', 'D1', 'One-bar drum break', 1),
      L('drums', '133_cd_drums_2', 'D2', 'Swing groove', 4),
      L('drums', '133_cd_drums_3', 'D3', 'Swing groove 2', 4),
      L('drums', '133_cd_drums_4', 'D4', 'Swing groove 3', 4),
      L('drums', '133_cd_drums_5', 'D5', 'Swing groove 4', 4),
      L('drums', '133_cd_drums_6', 'D6', 'Swing groove 5', 4),
      L('drums', '133_cd_drums_7', 'D7', 'Tom-tom groove, fill at end', 8),
      L('drums', '133_cd_drums_8', 'D8', 'Swing groove, fill at end', 4),
      L('drums', '133_cd_drums_9', 'D9', 'Long swing groove', 8),
      L('drums', '133_cd_drums_10', 'D10', 'Snare backbeat', 8),
      L('drums', '133_cd_drums_11', 'D11', 'Tom-tom groove 2, fill at end', 8),
      L('drums', '133_cd_drums_12', 'D12', 'Snare groove, fill at end', 4),
      L('drums', '133_cd_drums_13', 'D13', 'Snare backbeat 2', 8),
      L('drums', '133_cd_drums_14', 'D14', 'Busy snare groove', 8),
      L('drums', '133_cd_drums_15', 'D15', 'Tom-tom groove 3, fill at end', 8),
      L('drums', '133_cd_drums_16', 'D16', 'Snare groove 2, fill at end', 4),
      L('drums', '133_cd_drums_17', 'D17', 'Snare backbeat 3', 8),
      L('drums', '133_cd_drums_18', 'D18', 'Snare backbeat 4', 8),
      L('drums', '133_cd_drums_19', 'D19', 'Long snare groove', 16),
      L('piano', '133_e_cd_piano_1', 'P1', 'Stride piano', 4),
      L('piano', '133_e_cd_piano_2', 'P2', 'Stride piano 2', 4),
      L('piano', '133_e_cd_piano_9', 'P9', 'Piano melody with chords', 8),
      L('piano', '133_e_cd_piano_10', 'P10', 'Piano runs', 8),
      L('piano', '133_e_cd_piano_11', 'P11', 'Piano solo line', 8),
      L('piano', '133_e_cd_piano_12', 'P12', 'Sparse stride piano', 4),
      L('horns', '133_e_cd_horns_3', 'H3', 'Low horn phrase and hold', 4),
      L('horns', '133_e_cd_horns_4', 'H4', 'Rising horn phrase', 4),
      L('horns', '133_e_cd_horns_5', 'H5', 'Horn phrase and hold', 4),
      L('horns', '133_e_cd_horns_6', 'H6', 'Low brass phrase', 4),
      L('horns', '133_e_cd_horns_7', 'H7', 'Two horn phrases', 8),
      L('horns', '133_e_cd_horns_8', 'H8', 'Horn phrase to high hold', 4),
      L('horns', '133_e_cd_horns_13', 'H13', 'Held chord into riff', 8),
      L('horns', '133_e_cd_horns_14', 'H14', 'Busy horn riff', 8),
      L('horns', '133_e_cd_horns_15', 'H15', 'Fast horn stabs', 8),
      L('horns', '133_e_cd_horns_16', 'H16', 'Short horn shout', 4),
      L('horns', '133_e_cd_horns_17', 'H17', 'Horn hits and hold', 8),
      L('horns', '133_e_cd_horns_18', 'H18', 'Long horn chords', 8),
      L('horns', '133_e_cd_horns_19', 'H19', 'Horn melody', 16),
      L('combo', '133_e_cd_ac_bass_piano', 'BP', 'Two-beat bass and piano', 4),
      L('combo', '133_e_cd_drums_ac_bass_1', 'DB1', 'Walking bass and drums', 4),
      L('combo', '133_e_cd_drums_ac_bass_2', 'DB2', 'Walking bass and drums 2', 8),
    ],
  },
  // ── East Side Groove ──────────────────────────────────────────────
  {
    id: 'egs',
    name: 'East Side Groove',
    bpm: 122,
    key: 'C',
    instruments: ['drums', 'horns'],
    loops: [
      L('drums', '122_egs_drums_1', 'D1', 'Four-on-the-floor', 8),
      L('drums', '122_egs_drums_1_v', 'D1v', 'Four-on-the-floor, more snare', 8),
      L('drums', '122_egs_drums_1_v2', 'D1v2', 'Four-on-the-floor, short', 4),
      L('drums', '122_egs_drums_2', 'D2', 'Tom-tom groove', 4),
      L('drums', '122_egs_drums_2_v', 'D2v', 'Rolling tom-toms', 4),
      L('drums', '122_egs_drums_3', 'D3', 'Cymbal crashes', 8),
      L('drums', '122_egs_drums_3_v', 'D3v', 'Sparse cymbal crashes', 8),
      L('drums', '122_egs_drums_4', 'D4', 'Four-on-the-floor 2', 8),
      L('drums', '122_egs_drums_4_v', 'D4v', 'Four-on-the-floor 2, busier', 8),
      L('drums', '122_egs_drums_5', 'D5', 'Long four-on-the-floor', 16),
      L('drums', '122_egs_drums_6', 'D6', 'Four-on-the-floor 3', 8),
      L('drums', '122_egs_drums_6_v', 'D6v', 'Four-on-the-floor 3, swung', 8),
      L('horns', '122_c_egs_horns_1', 'H1', 'Call-and-response riff', 8),
      L('horns', '122_c_egs_horns_1_v', 'H1v', 'Call-and-response riff 2', 8),
      L('horns', '122_c_egs_horns_2', 'H2', 'Long horn chords', 8),
      L('horns', '122_c_egs_horns_3', 'H3', 'Syncopated horn riff', 8),
      L('horns', '122_c_egs_horns_4', 'H4', 'Busy horn chorus', 16),
      L('horns', '122_c_egs_horns_5', 'H5', 'High horn melody', 16),
    ],
  },
  // ── Savoy Club Rhythm ─────────────────────────────────────────────
  {
    id: 'scr',
    name: 'Savoy Club Rhythm',
    bpm: 136,
    key: 'B\u266D',
    instruments: ['drums', 'piano', 'horns', 'combo'],
    loops: [
      L('drums', '136_scr_drums_1', 'D1', 'Short swing groove', 4),
      L('drums', '136_scr_drums_2', 'D2', 'Swing groove', 8),
      L('drums', '136_scr_drums_2_v2', 'D2v', 'Swing groove, variation', 8),
      L('drums', '136_scr_drums_3', 'D3', 'Swing groove 2', 8),
      L('drums', '136_scr_drums_3_v', 'D3v', 'Swing groove 2, variation', 8),
      L('drums', '136_scr_drums_4', 'D4', '12-bar groove with a stop', 12),
      L('drums', '136_scr_drums_5', 'D5', 'Busy swing groove', 8),
      L('drums', '136_scr_drums_5_v', 'D5v', 'Busy swing groove, variation', 8),
      L('drums', '136_scr_drums_6', 'D6', 'Swing groove 3', 8),
      L('drums', '136_scr_drums_6_v', 'D6v', 'Swing groove 3, variation', 8),
      L('drums', '136_scr_drums_7', 'D7', 'Long groove, fill at end', 16),
      L('piano', '136_bb_scr_piano_1', 'P1', 'Stride left hand', 4),
      L('horns', '136_bb_scr_horns_2', 'H2', 'Horn riff with breaks', 8),
      L('horns', '136_bb_scr_horns_2_v', 'H2v', 'Horn riff, held chords', 8),
      L('horns', '136_bb_scr_horns_3', 'H3', 'Low horn riff with breaks', 8),
      L('horns', '136_bb_scr_horns_3_v', 'H3v', 'Horn riff, held chords 2', 8),
      L('horns', '136_bb_scr_horns_4', 'H4', '12-bar horn chorus', 12),
      L('horns', '136_bb_scr_horns_5', 'H5', 'Horn melody', 16),
      L('horns', '136_bb_scr_horns_6', 'H6', 'Rising horn melody', 16),
      L('horns', '136_bb_scr_horns_7', 'H7', 'Horn melody with a break', 16),
      L('combo', '136_bb_scr_piano-ac_bass_1', 'PB1', 'Two-beat bass and piano', 4),
    ],
  },
  // ── Swing Gate ────────────────────────────────────────────────────
  {
    id: 'sg',
    name: 'Swing Gate',
    bpm: 118,
    key: 'B\u266D',
    instruments: ['drums', 'horns', 'combo'],
    loops: [
      L('drums', '118_sg_drums_1', 'D1', 'Two-bar hits', 2),
      L('drums', '118_sg_drums_2', 'D2', 'One-bar hits', 1),
      L('drums', '118_sg_drums_3', 'D3', 'Stop-time hits into swing', 4),
      L('drums', '118_sg_drums_4', 'D4', 'Swing groove', 4),
      L('drums', '118_sg_drums_5', 'D5', 'Two-bar swing groove', 2),
      L('drums', '118_sg_drums_6', 'D6', 'One-bar swing groove', 1),
      L('drums', '118_sg_drums_7', 'D7', 'Three-bar hits', 3),
      L('drums', '118_sg_drums_8', 'D8', 'Swing groove, fill at end', 4),
      L('horns', '118_bb_sg_horns_1', 'H1', 'Two-bar horn chords', 2),
      L('horns', '118_bb_sg_horns_2', 'H2', 'One-bar horn chord', 1),
      L('horns', '118_bb_sg_horns_3', 'H3', 'Horn stabs into long chord', 4),
      L('horns', '118_bb_sg_horns_4', 'H4', 'Long horn chord', 4),
      L('horns', '118_bb_sg_horns_5', 'H5', 'Horn chord with pickup', 2),
      L('horns', '118_bb_sg_horns_6', 'H6', 'One-bar horn chord 2', 1),
      L('horns', '118_bb_sg_horns_7', 'H7', 'Three-bar horn chords', 3),
      L('horns', '118_bb_sg_horns_8', 'H8', 'Horn chords with a run', 4),
      L('combo', '118_bb_sg_drums-ac_bass_1', 'DB1', 'Two-bar bass hits', 2),
      L('combo', '118_bb_sg_drums-ac_bass_2', 'DB2', 'One-bar bass hits', 1),
      L('combo', '118_bb_sg_drums-ac_bass_3', 'DB3', 'Stop-time into walking bass', 4),
      L('combo', '118_bb_sg_drums-ac_bass_8', 'DB8', 'Walking bass and drums', 4),
    ],
  },
];

export const SESSION_MAP: Record<string, SessionDef> = Object.fromEntries(
  SESSIONS.map(s => [s.id, s])
);

// ─── Starter template: Head → Solo → Head ──────────────────────────────────
// The commonest shape of a jazz performance: play the tune (the head), take
// a solo over the same groove, then play the tune again.

export type TemplateSection = { label: string; startBar: number; bars: number };
export type StudioTemplate = {
  name: string;
  sections: TemplateSection[];
  /** Loops by id, placed at a bar (0-based). */
  placements: { loopId: string; bar: number }[];
};

const HSH: TemplateSection[] = [
  { label: 'Head', startBar: 0, bars: 8 },
  { label: 'Solo', startBar: 8, bars: 8 },
  { label: 'Head', startBar: 16, bars: 8 },
];

/** Place `id` at each bar in `bars`. */
const at = (id: string, ...bars: number[]) => bars.map(bar => ({ loopId: id, bar }));

export const TEMPLATES: Record<string, StudioTemplate> = {
  bu: {
    name: 'Head → Solo → Head',
    sections: HSH,
    placements: [
      ...at('118_f_bu_horns_8', 0, 16),
      ...at('118_f_bu_piano_1', 0, 4, 16, 20),
      ...at('118_f_bu_piano_6', 8),
      ...at('118_bu_drums_1', 0, 4, 16, 20),
      ...at('118_bu_drums_9', 8, 12),
      ...at('118_f_bu_ac_bass_9', 0, 4, 8, 12, 16, 20),
    ],
  },
  cd: {
    name: 'Head → Solo → Head',
    sections: HSH,
    placements: [
      ...at('133_e_cd_horns_7', 0, 16),
      ...at('133_e_cd_piano_2', 0, 4, 16, 20),
      ...at('133_e_cd_piano_11', 8),
      ...at('133_cd_drums_9', 0, 8, 16),
    ],
  },
  egs: {
    name: 'Head → Solo → Head',
    sections: HSH,
    placements: [
      ...at('122_c_egs_horns_1', 0, 16),
      ...at('122_c_egs_horns_3', 8),
      ...at('122_egs_drums_1', 0, 16),
      ...at('122_egs_drums_4', 8),
    ],
  },
  scr: {
    name: 'Head → Solo → Head',
    sections: HSH,
    placements: [
      ...at('136_bb_scr_horns_2', 0, 16),
      ...at('136_bb_scr_horns_2_v', 8),
      ...at('136_scr_drums_2', 0, 16),
      ...at('136_scr_drums_5', 8),
      ...at('136_bb_scr_piano_1', 0, 4, 8, 12, 16, 20),
    ],
  },
  sg: {
    name: 'Head → Solo → Head',
    sections: HSH,
    placements: [
      ...at('118_bb_sg_horns_3', 0, 16),
      ...at('118_bb_sg_horns_8', 4, 20),
      ...at('118_sg_drums_3', 0, 16),
      ...at('118_sg_drums_8', 4, 20),
      ...at('118_sg_drums_4', 8, 12),
      ...at('118_bb_sg_drums-ac_bass_3', 0, 16),
      ...at('118_bb_sg_drums-ac_bass_8', 4, 8, 12, 20),
    ],
  },
};

// ─── Challenge: a 32-bar AABA tune ─────────────────────────────────────────
// AABA: a theme (A) played twice, a contrasting bridge (B), then the theme
// once more. Four 8-bar sections, 32 bars in all.

export const AABA_SECTION_BARS = 8;
export const LEAD_LANES: InstrumentCategory[] = ['horns', 'piano'];

export type PlacedLoop = { loopId: string; lane: InstrumentCategory; startTime: number };

export type AabaCheck = {
  /** Lead loop ids starting in each 8-bar section, sorted. */
  sections: [string[], string[], string[], string[]];
  firstA: boolean;
  secondA: boolean;
  bridge: boolean;
  lastA: boolean;
  rhythm: boolean;
  done: boolean;
};

export function checkAABA(blocks: PlacedLoop[], session: SessionDef): AabaCheck {
  const bar = 240 / session.bpm;
  const sectionOf = (t: number) => Math.floor(Math.round(t / bar) / AABA_SECTION_BARS);
  const sections: AabaCheck['sections'] = [[], [], [], []];
  const rhythmIn = [false, false, false, false];
  for (const b of blocks) {
    if (LEAD_LANES.includes(b.lane)) {
      const s = sectionOf(b.startTime);
      if (s >= 0 && s <= 3) sections[s].push(b.loopId);
      continue;
    }
    // Rhythm counts for every section the loop sounds in, not just where it starts.
    const loop = session.loops.find(l => l.id === b.loopId);
    if (!loop) continue;
    const startBar = Math.round(b.startTime / bar);
    for (let s = 0; s < 4; s++) {
      const lo = s * AABA_SECTION_BARS, hi = lo + AABA_SECTION_BARS;
      if (startBar < hi && startBar + loop.bars > lo) rhythmIn[s] = true;
    }
  }
  sections.forEach(s => s.sort());
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
  const [a1, a2, b1, a3] = sections;
  const firstA = a1.length > 0;
  const secondA = firstA && same(a1, a2);
  const bridge = b1.length > 0 && !same(a1, b1);
  const lastA = firstA && same(a1, a3);
  const rhythm = rhythmIn.every(Boolean);
  return { sections, firstA, secondA, bridge, lastA, rhythm, done: firstA && secondA && bridge && lastA && rhythm };
}
