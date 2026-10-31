import { MOON } from '@/app/exhibitions/moon/moon';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import type { ExhibitionConfig } from '@/components/exhibition/types';

/*
 * "Teach with this" and the projector's "For the classroom" list an
 * exhibition's rooms from its projector links. Every room in the display
 * case's Interactives must be there, or a teacher never finds it (Egypt's six
 * rooms were missing).
 */
const CONFIGS: [string, ExhibitionConfig<string>][] = [
  ['moon', MOON as ExhibitionConfig<string>],
  ['egypt', EGYPT as ExhibitionConfig<string>],
  ['victorian', VICTORIAN as ExhibitionConfig<string>],
  ['america-250', AMERICA_250 as ExhibitionConfig<string>],
];

describe.each(CONFIGS)('%s: projector links', (_slug, config) => {
  it('lists every interactive room', () => {
    const links = config.projector.links.map((l) => l.href);
    for (const room of config.interactives ?? []) expect(links).toContain(room.href);
  });
});
