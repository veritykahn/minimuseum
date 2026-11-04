import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { IWM, RECORD } from './film';

/*
 * Every picture credit and source the film uses, for the room's Sources
 * drawer (SourcesDrawer), grouped by where it comes in the film. The two IWM
 * photographs carry the attribution each record specifies and the licence
 * they are used under, in full. The film cites nothing inline; its
 * transcript, a text version of the film folded away under it, keeps its own.
 */
export const SILENCE_SOURCES: SourceGroup[] = [
  {
    title: 'The film: the trench',
    items: [{ label: IWM.trench.credit, href: IWM.trench.url, note: 'Photograph', licence: IWM.licence.label }],
  },
  {
    title: 'The film: the last minute',
    items: [{ label: RECORD.redrawnCredit, href: IWM.record.url, note: 'The record on screen' }],
  },
  {
    title: 'After the film',
    items: [
      { label: IWM.record.credit, href: IWM.record.url, note: 'Photograph of the record', licence: IWM.licence.label },
      { label: IWM.reconstruction.label, href: IWM.reconstruction.url },
    ],
  },
  {
    // The film's recordings, all Creative Commons 0 (public domain), credited anyway; trimmed and looped (public/exhibitions/great-war/sounds/credits.txt).
    title: 'The film’s sounds',
    items: [
      { label: '“Firefight” by TheBuilder15', href: 'https://freesound.org/s/404334/', note: 'The gunfire', licence: 'CC0, via Freesound' },
      { label: '“R12-31-Artillery Guns Firing” by craigsmith', href: 'https://freesound.org/s/486027/', note: 'The artillery', licence: 'CC0, via Freesound' },
      { label: '“Wind is blowing in the grass of a patagonian plain” by felix.blume', href: 'https://freesound.org/s/139337/', note: 'The breeze after 11:00', licence: 'CC0, via Freesound' },
      { label: '“skylark.wav” by squashy555', href: 'https://freesound.org/s/244357/', note: 'The bird at the end', licence: 'CC0, via Freesound' },
    ],
  },
  { title: 'The photographs’ licence', items: [{ label: IWM.licence.label, href: IWM.licence.url }] },
];
