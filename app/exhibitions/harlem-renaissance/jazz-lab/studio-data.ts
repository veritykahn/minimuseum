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

function L(inst: InstrumentCategory, file: string, label: string, bars: number): LoopDef {
  return { id: file, file: `${BASE}/${file}.mp3`, instrument: inst, label, bars };
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
      L('drums', '118_bu_drums_1', 'D1', 4),
      L('drums', '118_bu_drums_2', 'D2', 4),
      L('drums', '118_bu_drums_2_v', 'D2v', 4),
      L('drums', '118_bu_drums_3', 'D3', 4),
      L('drums', '118_bu_drums_3_v', 'D3v', 4),
      L('drums', '118_bu_drums_4', 'D4', 4),
      L('drums', '118_bu_drums_5', 'D5', 4),
      L('drums', '118_bu_drums_6', 'D6', 4),
      L('drums', '118_bu_drums_6_v', 'D6v', 4),
      L('drums', '118_bu_drums_7', 'D7', 4),
      L('drums', '118_bu_drums_7_v', 'D7v', 4),
      L('drums', '118_bu_drums_8', 'D8', 4),
      L('drums', '118_bu_drums_8_v', 'D8v', 4),
      L('drums', '118_bu_drums_9', 'D9', 4),
      L('piano', '118_f_bu_piano_1', 'P1', 4),
      L('piano', '118_f_bu_piano_6', 'P6', 8),
      L('piano', '118_f_bu_piano_7', 'P7', 8),
      L('horns', '118_f_bu_horns_2', 'H2', 8),
      L('horns', '118_f_bu_horns_3', 'H3', 8),
      L('horns', '118_f_bu_horns_4', 'H4', 4),
      L('horns', '118_f_bu_horns_5', 'H5', 4),
      L('horns', '118_f_bu_horns_8', 'H8', 8),
      L('bass', '118_f_bu_ac_bass_9', 'B9', 4),
      L('combo', '118_f_bu_piano-ac_bass_1', 'PB1', 4),
      L('combo', '118_f_bu_piano-ac_bass_7', 'PB7', 8),
      L('combo', '118_f_bu_ac_bass_drums_9', 'BD9', 4),
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
      L('drums', '133_cd_drums_1', 'D1', 1),
      L('drums', '133_cd_drums_2', 'D2', 4),
      L('drums', '133_cd_drums_3', 'D3', 4),
      L('drums', '133_cd_drums_4', 'D4', 4),
      L('drums', '133_cd_drums_5', 'D5', 4),
      L('drums', '133_cd_drums_6', 'D6', 4),
      L('drums', '133_cd_drums_7', 'D7', 8),
      L('drums', '133_cd_drums_8', 'D8', 4),
      L('drums', '133_cd_drums_9', 'D9', 8),
      L('drums', '133_cd_drums_10', 'D10', 8),
      L('drums', '133_cd_drums_11', 'D11', 8),
      L('drums', '133_cd_drums_12', 'D12', 4),
      L('drums', '133_cd_drums_13', 'D13', 8),
      L('drums', '133_cd_drums_14', 'D14', 8),
      L('drums', '133_cd_drums_15', 'D15', 8),
      L('drums', '133_cd_drums_16', 'D16', 4),
      L('drums', '133_cd_drums_17', 'D17', 8),
      L('drums', '133_cd_drums_18', 'D18', 8),
      L('drums', '133_cd_drums_19', 'D19', 16),
      L('piano', '133_e_cd_piano_1', 'P1', 4),
      L('piano', '133_e_cd_piano_2', 'P2', 4),
      L('piano', '133_e_cd_piano_9', 'P9', 8),
      L('piano', '133_e_cd_piano_10', 'P10', 8),
      L('piano', '133_e_cd_piano_11', 'P11', 8),
      L('piano', '133_e_cd_piano_12', 'P12', 4),
      L('horns', '133_e_cd_horns_3', 'H3', 4),
      L('horns', '133_e_cd_horns_4', 'H4', 4),
      L('horns', '133_e_cd_horns_5', 'H5', 4),
      L('horns', '133_e_cd_horns_6', 'H6', 4),
      L('horns', '133_e_cd_horns_7', 'H7', 8),
      L('horns', '133_e_cd_horns_8', 'H8', 4),
      L('horns', '133_e_cd_horns_13', 'H13', 8),
      L('horns', '133_e_cd_horns_14', 'H14', 8),
      L('horns', '133_e_cd_horns_15', 'H15', 8),
      L('horns', '133_e_cd_horns_16', 'H16', 4),
      L('horns', '133_e_cd_horns_17', 'H17', 8),
      L('horns', '133_e_cd_horns_18', 'H18', 8),
      L('horns', '133_e_cd_horns_19', 'H19', 16),
      L('combo', '133_e_cd_ac_bass_piano', 'BP', 4),
      L('combo', '133_e_cd_drums_ac_bass_1', 'DB1', 4),
      L('combo', '133_e_cd_drums_ac_bass_2', 'DB2', 8),
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
      L('drums', '122_egs_drums_1', 'D1', 8),
      L('drums', '122_egs_drums_1_v', 'D1v', 8),
      L('drums', '122_egs_drums_1_v2', 'D1v2', 4),
      L('drums', '122_egs_drums_2', 'D2', 4),
      L('drums', '122_egs_drums_2_v', 'D2v', 4),
      L('drums', '122_egs_drums_3', 'D3', 8),
      L('drums', '122_egs_drums_3_v', 'D3v', 8),
      L('drums', '122_egs_drums_4', 'D4', 8),
      L('drums', '122_egs_drums_4_v', 'D4v', 8),
      L('drums', '122_egs_drums_5', 'D5', 16),
      L('drums', '122_egs_drums_6', 'D6', 8),
      L('drums', '122_egs_drums_6_v', 'D6v', 8),
      L('horns', '122_c_egs_horns_1', 'H1', 8),
      L('horns', '122_c_egs_horns_1_v', 'H1v', 8),
      L('horns', '122_c_egs_horns_2', 'H2', 8),
      L('horns', '122_c_egs_horns_3', 'H3', 8),
      L('horns', '122_c_egs_horns_4', 'H4', 16),
      L('horns', '122_c_egs_horns_5', 'H5', 16),
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
      L('drums', '136_scr_drums_1', 'D1', 4),
      L('drums', '136_scr_drums_2', 'D2', 8),
      L('drums', '136_scr_drums_2_v2', 'D2v', 8),
      L('drums', '136_scr_drums_3', 'D3', 8),
      L('drums', '136_scr_drums_3_v', 'D3v', 8),
      L('drums', '136_scr_drums_4', 'D4', 12),
      L('drums', '136_scr_drums_5', 'D5', 8),
      L('drums', '136_scr_drums_5_v', 'D5v', 8),
      L('drums', '136_scr_drums_6', 'D6', 8),
      L('drums', '136_scr_drums_6_v', 'D6v', 8),
      L('drums', '136_scr_drums_7', 'D7', 16),
      L('piano', '136_bb_scr_piano_1', 'P1', 4),
      L('horns', '136_bb_scr_horns_2', 'H2', 8),
      L('horns', '136_bb_scr_horns_2_v', 'H2v', 8),
      L('horns', '136_bb_scr_horns_3', 'H3', 8),
      L('horns', '136_bb_scr_horns_3_v', 'H3v', 8),
      L('horns', '136_bb_scr_horns_4', 'H4', 12),
      L('horns', '136_bb_scr_horns_5', 'H5', 16),
      L('horns', '136_bb_scr_horns_6', 'H6', 16),
      L('horns', '136_bb_scr_horns_7', 'H7', 16),
      L('combo', '136_bb_scr_piano-ac_bass_1', 'PB1', 4),
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
      L('drums', '118_sg_drums_1', 'D1', 2),
      L('drums', '118_sg_drums_2', 'D2', 1),
      L('drums', '118_sg_drums_3', 'D3', 4),
      L('drums', '118_sg_drums_4', 'D4', 4),
      L('drums', '118_sg_drums_5', 'D5', 2),
      L('drums', '118_sg_drums_6', 'D6', 1),
      L('drums', '118_sg_drums_7', 'D7', 3),
      L('drums', '118_sg_drums_8', 'D8', 4),
      L('horns', '118_bb_sg_horns_1', 'H1', 2),
      L('horns', '118_bb_sg_horns_2', 'H2', 1),
      L('horns', '118_bb_sg_horns_3', 'H3', 4),
      L('horns', '118_bb_sg_horns_4', 'H4', 4),
      L('horns', '118_bb_sg_horns_5', 'H5', 2),
      L('horns', '118_bb_sg_horns_6', 'H6', 1),
      L('horns', '118_bb_sg_horns_7', 'H7', 3),
      L('horns', '118_bb_sg_horns_8', 'H8', 4),
      L('combo', '118_bb_sg_drums-ac_bass_1', 'DB1', 2),
      L('combo', '118_bb_sg_drums-ac_bass_2', 'DB2', 1),
      L('combo', '118_bb_sg_drums-ac_bass_3', 'DB3', 4),
      L('combo', '118_bb_sg_drums-ac_bass_8', 'DB8', 4),
    ],
  },
];

export const SESSION_MAP: Record<string, SessionDef> = Object.fromEntries(
  SESSIONS.map(s => [s.id, s])
);
