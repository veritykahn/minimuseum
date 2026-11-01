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
  { title: 'The photographs’ licence', items: [{ label: IWM.licence.label, href: IWM.licence.url }] },
];
