import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { CITIES } from './cities';

/*
 * The Great Migration map's Sources drawer: the map itself, the routes on it
 * (REVIEW: new, see routes.ts), and each stop's photograph credit.
 */

export const MIGRATION_SOURCES: SourceGroup[] = [
  {
    title: 'The map',
    items: [
      {
        note: 'The states',
        label: 'U.S. Census Bureau, cartographic boundary files (2017), via us-atlas',
        href: 'https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html',
        licence: 'Public domain',
      },
      {
        note: 'The Mississippi and Ohio rivers',
        label: 'Natural Earth, 1:50m rivers',
        href: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/50m-rivers-lake-centerlines/',
        licence: 'Public domain',
      },
    ],
  },
  {
    title: 'The routes',
    items: [
      {
        note: 'Musicians came to Chicago from New Orleans, St. Louis and other points south; the Illinois Central ran to Chicago',
        label: 'National Park Service, “Chicago’s Black Metropolis” (Teaching with Historic Places)',
        href: 'https://www.nps.gov/articles/chicago-s-black-metropolis-understanding-history-through-a-historic-place-teaching-with-historic-places.htm',
      },
      {
        note: 'The Illinois Central, from New Orleans to Chicago, the main way out of Mississippi',
        label: 'Mississippi Encyclopedia, “Railroads”',
        href: 'https://mississippiencyclopedia.org/entries/railroads/',
      },
      {
        note: 'The Illinois Central’s track across the Delta, to Chicago’s Central Station',
        label: 'Mississippi Blues Trail, “Mississippi to Chicago”',
        href: 'https://msbluestrail.org/blues-trail-markers/mississippi-to-chicago',
      },
      {
        note: 'Trains up the East Coast from Georgia, the Carolinas and Virginia',
        label: 'National Park Service, “From the Great Migration to Boston’s Charlestown Navy Yard”',
        href: 'https://www.nps.gov/articles/great-migration-to-charlestown-navy-yard.htm',
      },
      {
        note: 'The Delta: northwestern Mississippi, up the river from New Orleans',
        label: 'Mississippi Encyclopedia, “Delta”',
        href: 'https://mississippiencyclopedia.org/entries/delta/',
      },
    ],
  },
  ...CITIES.map((c, i) => ({
    title: `Stop ${i + 1}: ${c.name}`,
    items: c.photoCredit ? [{ note: 'Photograph', label: c.photoCredit }] : [],
  })),
];
