import type { FactSource } from '@/components/exhibition/FactNote';
import { creditFor, type CommonsPicture } from '../holocaust';
import { TIMELINE_ENTRIES, type TimelineEntry } from './timelineEntries';

/*
 * The timeline's stops: each date opens, in a window of its own
 * (TimelineStop.tsx), with a photograph and, at a few, one very quiet sound.
 *
 * The photographs are from Wikimedia Commons, under free licenses, each
 * credited in the Sources drawer under its date (sources.ts), never on the
 * picture. Nothing graphic: places, buildings, documents and memorials, so
 * a child can look at every one. A stop whose photograph is not chosen yet
 * shows a quiet "Picture to come". The files are at
 * public/exhibitions/holocaust/timeline/<id>.webp, 1400px at most.
 *
 * The sounds are the posters' own moments (public/exhibitions/holocaust/
 * poster-sound/moments/), played once, as a panel's are (PanelMoment.ts),
 * and only with the museum's sound on. Most stops are silent.
 */

export type StopPicture = {
  /** Under public/. */
  src: string;
  alt: string;
  /** A few words under the picture: what and where, as the Commons page gives it. */
  caption: string;
  credit: FactSource;
};

export type TimelineStop = TimelineEntry & { picture?: StopPicture; sound?: string };

const MOMENTS = '/exhibitions/holocaust/poster-sound/moments';

/** The stops that sound, and what. REVIEW (Verity): each is a moment already heard on the posters. */
export const STOP_SOUNDS: Record<string, string> = {
  // The uprising began on the eve of Passover: a candle lit.
  '1943-04-19': `${MOMENTS}/candle.mp3`,
  // The Normandy beaches: the sea.
  '1944-06-06': `${MOMENTS}/water.mp3`,
  // The war in Europe over: a church bell, far off.
  '1945-05-08': `${MOMENTS}/church-clock.mp3`,
};

const DIR = '/exhibitions/holocaust/timeline';
const stop = (p: CommonsPicture, caption: string): StopPicture => ({ src: p.src, alt: p.alt, caption, credit: { label: creditFor(p), href: p.href } });

/**
 * Each stop's photograph, by the entry's id: chosen on November 4, 2026,
 * each file page's license checked, every picture looked at. Where no
 * suitable photograph of the time could be found, the place or its
 * memorial as it is now. The captions say only what the file page says.
 */
export const STOP_PICTURES: Record<string, StopPicture> = {
  // REVIEW (Verity): the Reich Chancellery building, taken in 1930, before Hitler became Chancellor (not the day itself).
  '1933-01-30': stop({ src: `${DIR}/1933-01-30.webp`, alt: 'A long, plain stone government building lines a quiet street in Berlin, with a statue of a soldier in a tricorn hat on a fenced pedestal in the foreground.', author: 'Bundesarchiv, B 145 Bild-P014779', title: 'Bundesarchiv B 145 Bild-P014779, Berlin, Erweiterungsbau der Alten Reichskanzlei', license: 'CC BY-SA 3.0 DE', href: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_B_145_Bild-P014779,_Berlin,_Erweiterungsbau_der_Alten_Reichskanzlei.jpg' }, 'The Reich Chancellery extension, Berlin, 1930'),
  '1933-03-22': stop({ src: `${DIR}/1933-03-22.webp`, alt: 'A pale two-story gatehouse with a red tile roof and a small wooden tower, reached by a concrete path between low walls and green bushes.', author: 'Guido Radig', title: 'KZ Dachau HDR', license: 'CC BY 3.0', href: 'https://commons.wikimedia.org/wiki/File:KZ_Dachau_HDR.jpg' }, 'The entrance building at the Dachau Memorial, 2011'),
  '1933-04-01': stop({ src: `${DIR}/1933-04-01.webp`, alt: 'Two men in Nazi uniforms put up a large sign reading "Germans! Defend yourselves! Do not buy from Jews!" on a clothing shop window while a woman stands watching nearby.', author: 'Bundesarchiv, Bild 102-14468 / Georg Pahl', title: 'Bundesarchiv Bild 102-14468, Berlin, NS-Boykott gegen jüdische Geschäfte', license: 'CC BY-SA 3.0 DE', href: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-14468,_Berlin,_NS-Boykott_gegen_j%C3%BCdische_Gesch%C3%A4fte.jpg' }, 'Boycott sign on a shop window, Berlin, April 1, 1933'),
  '1935-09-15': stop({ src: `${DIR}/1935-09-15.webp`, alt: 'A printed page of German government laws in old-style lettering, headed "Reichsbürgergesetz" and dated September 15, 1935, with a second law printed below it.', author: 'Reichsgesetzblatt (the German government)', title: 'Blutschutzgesetz v.15.9.1935 - RGBl I 1146gesamt', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Blutschutzgesetz_v.15.9.1935_-_RGBl_I_1146gesamt.jpg' }, 'The Nuremberg Laws as printed in the Reich Law Gazette, 1935'),
  // REVIEW (Verity): public domain in the United States only (PD-US-no-renewal); the site is US-hosted.
  '1938-03-12': stop({ src: `${DIR}/1938-03-12.webp`, alt: 'A perfume shop window and door in Vienna, with shelves of bottles and hand-lettered German signs saying it is an "Aryan firm" and refuses Jewish customers.', author: 'United States Holocaust Memorial Museum, courtesy of the National Archives and Records Administration', title: 'Vienna-aryan-perfume-shop', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Vienna-aryan-perfume-shop.jpg' }, 'Signs on a Vienna perfume shop, 1938'),
  // REVIEW (Verity): tagged PD-anon-50 (photographer unknown). A Bundesarchiv photo with a firm CC BY-SA license is the alternative.
  '1938-11-09': stop({ src: `${DIR}/1938-11-09.webp`, alt: 'A large brick synagogue with onion-shaped domes and a Star of David on its front stands on a street corner, its arched windows empty and dark after a fire.', author: 'Unknown photographer (Stadtarchiv Frankfurt am Main)', title: 'Synagoge Hoechst 19381110', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Synagoge_Hoechst_19381110.jpg' }, 'The burned-out synagogue in Frankfurt-Höchst, November 10, 1938'),
  // REVIEW (Verity): Commons says this was reenacted for the camera (its Polish text: on September 14, for propaganda), so the caption says so.
  '1939-09-01': stop({ src: `${DIR}/1939-09-01.webp`, alt: 'A row of German soldiers in helmets pull down a striped wooden border barrier in front of a small border post building.', author: 'Bundesarchiv, Bild 183-51909-0003 / Hans Sönnke', title: 'Bundesarchiv Bild 183-51909-0003, Polen, Schlagbaum, deutsche Soldaten', license: 'CC BY-SA 3.0 DE', href: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-51909-0003,_Polen,_Schlagbaum,_deutsche_Soldaten.jpg' }, 'German soldiers remove a Polish border barrier, 1939: a scene staged for the camera'),
  '1939-10': stop({ src: `${DIR}/1939-10.webp`, alt: 'A long wall of see-through blue glass stands on a paved plaza in front of a large gold-colored building, while two visitors read panels along a low information wall.', author: 'Drrcs15', title: 'T4 Memorial', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:T4_Memorial.JPG' }, 'The Aktion T4 memorial at Tiergartenstraße 4, Berlin, 2015'),
  '1940-05': stop({ src: `${DIR}/1940-05.webp`, alt: 'An open iron gate with the curved metal words "Arbeit macht frei" ("work makes free") above it leads onto an empty road between brick buildings and bare winter trees.', author: 'Bibi595', title: 'Auschwitz-Work Set Free-new', license: 'CC BY-SA 3.0', href: 'https://commons.wikimedia.org/wiki/File:Auschwitz-Work_Set_Free-new.JPG' }, 'The main gate of Auschwitz I, Oświęcim, Poland, 2012'),
  // REVIEW (Verity): Commons says this was an early, temporary wall, not the ghetto's final border.
  '1940-10': stop({ src: `${DIR}/1940-10.webp`, alt: 'Workmen with a wooden ladder and a bucket lay bricks for a tall wall that blocks a city street in front of a shop sign reading "Jan Tarnowski".', author: 'Unknown photographer', title: 'The Wall of ghetto in Warsaw - Building on Nazi-German order August 1940', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:The_Wall_of_ghetto_in_Warsaw_-_Building_on_Nazi-German_order_August_1940.jpg' }, 'Building a ghetto wall across Świętokrzyska Street, Warsaw, 1940'),
  // REVIEW (Verity): smoke far off on the horizon; no fighting, nothing of the shootings. Is it calm enough?
  '1941-06-22': stop({ src: `${DIR}/1941-06-22.webp`, alt: 'German soldiers, seen from behind, walk with horse-drawn carts past a striped Soviet border post into a wide grassy field, with a column of dark smoke rising far away on the horizon.', author: 'Johannes Hähle', title: 'German troops crossing the Soviet border', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:German_troops_crossing_the_Soviet_border.jpg' }, 'German troops cross the Soviet border, June 22, 1941'),
  // REVIEW (Verity): the photo is CC BY-SA, but the 1991 sculpture may still be under its artist's copyright (Ukraine has no freedom of panorama for artworks).
  '1941-09-29': stop({ src: `${DIR}/1941-09-29.webp`, alt: 'A large dark metal menorah stands on wide stone steps in a sunny park, with two inscribed stones and flower wreaths on either side of a cobbled path.', author: 'Бондар Володимир (Volodymyr Bondar)', title: 'Пам\'ятний знак «Менора» у Бабиному Яру', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B0%D0%BC%27%D1%8F%D1%82%D0%BD%D0%B8%D0%B9_%D0%B7%D0%BD%D0%B0%D0%BA_%C2%AB%D0%9C%D0%B5%D0%BD%D0%BE%D1%80%D0%B0%C2%BB_%D1%83_%D0%91%D0%B0%D0%B1%D0%B8%D0%BD%D0%BE%D0%BC%D1%83_%D0%AF%D1%80%D1%83.jpg' }, 'The Menorah memorial at Babyn Yar, Kyiv, 2018'),
  // REVIEW (Verity): the memorial's relief has one figure lying down; small at this size.
  '1941-12-08': stop({ src: `${DIR}/1941-12-08.webp`, alt: 'A long concrete memorial with a carved relief of people and the word "PAMIĘTAMY" rests on low supports at the end of a straight path, in a frosty clearing ringed by pine trees.', author: 'PaulinaŻabikowo', title: 'LasRzuchowski-pomnik', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:LasRzuchowski-pomnik.jpg' }, 'Memorial to the victims of Chełmno (Kulmhof), Rzuchów Forest, 2020'),
  '1942-01-20': stop({ src: `${DIR}/1942-01-20.webp`, alt: 'A large cream-colored villa with tall arched windows and a columned entrance stands behind a round flower bed and a cobbled drive, framed by leafy trees.', author: 'Clemensfranz', title: 'Berlin Wannseevilla', license: 'CC BY-SA 3.0', href: 'https://commons.wikimedia.org/wiki/File:Berlin_Wannseevilla.jpg' }, 'The Wannsee villa (Villa Marlier), Berlin, 2008'),
  // REVIEW (Verity): Treblinka only; the poster names Belzec and Sobibor too.
  '1942-03': stop({ src: `${DIR}/1942-03.webp`, alt: 'Hundreds of rough standing stones of different sizes fill a wide field under a clear blue sky, with a tall stone monument and pine forest in the distance.', author: 'Tajchman Maria', title: 'Treblinka. Morze kamieni', license: 'CC BY-SA 4.0', href: 'https://commons.wikimedia.org/wiki/File:Treblinka._Morze_kamieni.jpg' }, 'The field of memorial stones at Treblinka, 2014'),
  // REVIEW (Verity): the monument's relief has one figure lying at the foot of the group; small at this size.
  '1943-04-19': stop({ src: `${DIR}/1943-04-19.webp`, alt: 'A tall dark stone monument with a large dark relief sculpture of a group of people stands at the top of wide steps on a cobbled square, with a menorah sculpture on each side.', author: 'Cybularny', title: '2021 Warszawa Pomnik Bohaterów Getta, 1', license: 'CC0', href: 'https://commons.wikimedia.org/wiki/File:2021_Warszawa_Pomnik_Bohater%C3%B3w_Getta,_1.jpg' }, 'The Monument to the Ghetto Heroes, Warsaw, 2021'),
  // REVIEW (Verity): taken at least a day after June 6 (Commons), so captioned June 1944.
  '1944-06-06': stop({ src: `${DIR}/1944-06-06.webp`, alt: 'Large landing ships with "US 55" and "US 61" on their sides unload at low tide off a beach, with barrage balloons floating overhead and army trucks and jeeps parked on the grass in front.', author: 'Steck, U.S. Army Signal Corps', title: 'Normandy6', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Normandy6.jpg' }, 'U.S. landing ships unloading at Normandy, June 1944'),
  // REVIEW (Verity): dated only "after July 24, 1944"; the snow says months after liberation.
  '1944-07-23': stop({ src: `${DIR}/1944-07-23.webp`, alt: 'Rows of tall wooden posts strung with barbed wire run into the distance across snowy ground, with low wooden barracks behind them.', author: 'Unknown photographer (via the United States Holocaust Memorial Museum)', title: 'Fences around Majdanek', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Fences_around_Majdanek.jpg' }, 'Barbed-wire fences around Majdanek, after July 24, 1944'),
  // REVIEW (Verity): taken in February or March 1945, weeks after liberation; bowls and pots lie between the rails.
  '1945-01-27': stop({ src: `${DIR}/1945-01-27.webp`, alt: 'Snow-covered railway tracks lead toward a long brick gatehouse with a central tower and archway, with piles of abandoned metal bowls and pots lying between the rails.', author: 'Stanisław Mucha', title: 'Auschwitz swavesey', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Auschwitz_swavesey.jpg' }, 'The gatehouse of Auschwitz II-Birkenau, early 1945'),
  // REVIEW (Verity): VE Day crowds in London, rather than the surrender itself.
  '1945-05-08': stop({ src: `${DIR}/1945-05-08.webp`, alt: 'A huge, cheerful crowd fills a wide London street between grand stone government buildings hung with British, American and other flags, with a tall white memorial at the right.', author: 'British official photographer (Imperial War Museum, TR 2876)', title: 'Ve Day Celebrations in London, 8 May 1945 TR2876', license: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:Ve_Day_Celebrations_in_London,_8_May_1945_TR2876.jpg' }, 'VE Day crowds in Whitehall, London, May 8, 1945'),
};

export const TIMELINE_STOPS: TimelineStop[] = TIMELINE_ENTRIES.map((e) => ({
  ...e,
  ...(STOP_PICTURES[e.id] ? { picture: STOP_PICTURES[e.id] } : {}),
  ...(STOP_SOUNDS[e.id] ? { sound: STOP_SOUNDS[e.id] } : {}),
}));

/** The words around a stop, said to screen readers and on the buttons. REVIEW (Verity). */
export const STOP_TEXT = {
  open: 'Open this date',
  close: 'Close',
  previous: 'Before',
  next: 'Next',
  /** The speaker at a stop with a sound; pressed, the museum's sound is on. */
  sound: 'Sound',
  pictureToCome: 'Picture to come',
  of: (n: number, count: number) => `${n} of ${count}`,
};
