import { STOP_AT } from './routes';
import { project } from './usMap';

/**
 * The six stops of the Great Migration map, from New Orleans to Harlem: each
 * city's panel (photograph, words, record and quotation). Shared by the map
 * and by its "punch your ticket" questions (ticket.ts), which are answered
 * from these panels.
 *
 * REVIEW (Verity): the order is new. It was the Delta, then New Orleans,
 * then Memphis: south, then back north. Now the journey starts where jazz
 * began, in New Orleans, and goes only north (up the Mississippi through the
 * Delta to Memphis and St. Louis, then to Chicago) and then east to Harlem.
 * Each dot is placed by its real latitude and longitude (routes.ts), on a map
 * of the states (usMap.ts); sources are in routes.ts.
 */
export type CityData = {
  id: string;
  name: string;
  period: string;
  /** Where its dot sits on the map, from its latitude and longitude. */
  cx: number;
  cy: number;
  photo: string;
  /** What the photograph shows, for people who cannot see it. */
  photoAlt: string;
  /** What the photograph shows, under it. */
  photoCaption: string;
  /** Who made it and who holds it: in the Sources drawer, not on the page. */
  photoCredit?: string;
  text: string;
  music: { file: string; title: string; artist: string; year: string; note?: string };
  /**
   * A quotation, or, when `paraphrase` is set, a saying whose exact wording
   * cannot be traced to the person: shown without quotation marks.
   */
  quote: { text: string; author: string; paraphrase?: boolean };
};

/** A stop's place on the map. */
const dot = (id: keyof typeof STOP_AT) => {
  const [lon, lat] = STOP_AT[id];
  const { x, y } = project(lon, lat);
  return { cx: x, cy: y };
};

export const CITIES: CityData[] = [
  {
    id: 'new-orleans',
    name: 'New Orleans',
    period: '1890s\u20131920s',
    ...dot('new-orleans'),
    photo: 'new-orleans.jpg',
    photoAlt: 'Oscar \u201CPapa\u201D Celestin\u2019s Original Tuxedo Band, early 1900s',
    photoCaption: 'Oscar "Papa" Celestin\'s Original Tuxedo Band, early 1900s.',
    photoCredit: 'William Russell Jazz Collection, The Historic New Orleans Collection, acquisition made possible by the Clarisse Claiborne Grima Fund.',
    text: 'Where the Mississippi meets the Gulf, New Orleans was the most musical city in America. In Congo Square, enslaved people of African descent gathered on Sunday afternoons to drum, sing, and dance \u2014 something few other places in the South allowed. By the 1890s, brass bands, ragtime, blues, and Caribbean rhythms were all colliding in the streets. They called the new sound \u201Cjass.\u201D King Oliver, Louis Armstrong, and Sidney Bechet all grew up hearing it.',
    music: { file: 'new-orleans.mp3', title: '\u201CWay Down Yonder in New Orleans\u201D', artist: 'The Georgians, Frank Guarente', year: 'Columbia Records, 1922' },
    quote: { text: 'Jazz was born in New Orleans and grew up in Chicago.', author: 'A popular saying, sometimes credited to Louis Armstrong', paraphrase: true },
  },
  {
    id: 'delta',
    name: 'The Mississippi Delta',
    period: 'Before 1910',
    ...dot('delta'),
    photo: 'delta.jpg',
    photoAlt: 'Workers picking cotton in a wide field in Georgia, 1907',
    photoCaption: '\u201CA Georgia Cotton Field,\u201D 1907. This field is in Georgia, not the Delta: the same work was done in cotton fields across the South.',
    photoCredit: '\u201CA Georgia Cotton Field,\u201D 1907. Photograph by Marcus L. Brown, Decatur, Georgia. Library of Congress Prints and Photographs Division.',
    // REVIEW (Verity): the first sentence is new, now that the Delta is the second stop ("It began here \u2014 in the flat cotton fields along the Mississippi River, \u2026" before). The Delta lies up the Mississippi from New Orleans (the map; Mississippi Encyclopedia, "Delta": https://mississippiencyclopedia.org/entries/delta/).
    text: 'Upriver from New Orleans lie the flat cotton fields of the Mississippi Delta, where African Americans had been enslaved for generations. After emancipation, most stayed as sharecroppers, trapped in cycles of debt and poverty. But they carried something no one could take from them: their music. Work songs, field hollers, and spirituals echoed across the Delta \u2014 the raw material that would become the blues.',
    music: {
      file: 'delta.mp3', title: '\u201CSwing Low, Sweet Chariot\u201D', artist: 'Fisk University Jubilee Quartet', year: 'Victor Records, 1909',
      note: 'Sung by a quartet from Fisk University in Nashville, not in the Delta: one of the earliest recordings of a spiritual, the kind of song sung across the South.',
    },
    quote: { text: 'Before I\u2019d be a slave, I\u2019d be buried in my grave, and go home to my Lord and be saved.', author: 'Traditional spiritual, \u201CBefore I\u2019d Be a Slave\u201D' },
  },
  {
    id: 'memphis',
    name: 'Memphis',
    period: '1900s\u20131920s',
    ...dot('memphis'),
    photo: 'memphis.jpg',
    photoAlt: 'W.C. Handy and associates outside the Tri-State Bank of Memphis',
    photoCaption: 'W.C. Handy (far right) with associates outside the Tri-State Bank of Memphis, Tennessee. Handy published "Memphis Blues" in 1912 \u2014 among the first blues ever published as sheet music.',
    text: 'Memphis sat at the crossroads \u2014 halfway between the Delta and the North. Beale Street became the main street of Black America, lined with clubs, theaters, and juke joints. W.C. Handy heard the blues here and wrote them down, publishing \u201CMemphis Blues\u201D in 1912 \u2014 one of the first blues ever printed as sheet music. It was the bridge between rural folk music and the commercial recording industry.',
    music: { file: 'memphis.mp3', title: '\u201CMemphis Blues\u201D', artist: 'Morton Harvey, vocal \u2014 W.C. Handy, composer', year: 'Victor Records, 1914' },
    quote: { text: 'The blues came from nothingness, from want, from desire.', author: 'W.C. Handy' },
  },
  {
    id: 'st-louis',
    name: 'St. Louis',
    period: '1890s\u20131920s',
    ...dot('st-louis'),
    photo: 'st-louis.jpg',
    photoAlt: 'Fate Marable\u2019s Society Syncopators aboard a Mississippi riverboat, about 1919',
    photoCaption: 'Fate Marable\u2019s Society Syncopators aboard a Mississippi riverboat, c.\u20091919. Marable\u2019s band played the steamships between New Orleans and St. Louis. A young Louis Armstrong played cornet in this band before leaving for Chicago.',
    text: 'St. Louis was where the river met the railroad. Fate Marable\u2019s band played jazz on Mississippi riverboats, carrying the sound from New Orleans upriver to St. Louis and beyond. Scott Joplin had already made the city famous for ragtime \u2014 one of the first Black American styles to sweep the nation. When jazz came through on its way north, it picked up ragtime\u2019s sophistication and kept moving.',
    music: { file: 'st-louis.mp3', title: '\u201CSt. Louis Blues\u201D', artist: 'Original Dixieland Jazz Band with Al Bernard', year: 'Victor Records, 1921' },
    quote: { text: 'Syncopations are no indication of light or trashy music.', author: 'Scott Joplin' },
  },
  {
    id: 'chicago',
    name: 'Chicago',
    period: '1910s\u20131930s',
    ...dot('chicago'),
    photo: 'chicago.jpg',
    photoAlt: 'King Oliver\u2019s Creole Jazz Band posing with their instruments, Chicago, about 1923',
    photoCredit: 'King Oliver\u2019s Creole Jazz Band, Chicago, c.\u20091923. Photograph by Daguerre Studio.',
    photoCaption: 'King Oliver\u2019s Creole Jazz Band, Chicago, c.\u20091923. Left to right: Baby Dodds (drums), Honor\u00E9 Dutrey (trombone), King Oliver (cornet), Louis Armstrong (cornet), Lil Hardin (piano), Bill Johnson (banjo), Johnny Dodds (clarinet).',
    text: 'The trains from the South ended at Chicago\u2019s Illinois Central station. Most of the people who rode those trains came from Mississippi and its neighbors, straight up the Illinois Central line. Between 1910 and 1930, Chicago\u2019s Black population grew more than fivefold, from about 44,000 to about 234,000. They settled on the South Side, and the music followed. King Oliver moved from New Orleans to Chicago in 1918, then sent for young Louis Armstrong in 1922. The South Side became a laboratory where blues and jazz fused and evolved.',
    music: { file: 'chicago.mp3', title: '\u201CRiverside Blues\u201D', artist: 'King Oliver\u2019s Creole Jazz Band', year: 'Recorded 1923' },
    quote: { text: 'In the summer of 1922, Louis Armstrong took the train from New Orleans all the way to Chicago to join King Oliver\u2019s band.', author: 'Louis Armstrong\u2019s journey, in paraphrase', paraphrase: true },
  },
  {
    id: 'harlem',
    name: 'Harlem',
    period: '1920s\u20131930s',
    ...dot('harlem'),
    photo: 'harlem.jpg',
    photoAlt: 'A crowd lines a Harlem street as a parade passes; one sign reads \u201CThe New Negro has no fear\u201D',
    photoCaption: 'Harlem, New York, 1920s. A parade or rally passes through the neighborhood; a sign reads "THE NEW NEGRO HAS NO FEAR." By the 1920s, Harlem was the cultural capital of Black America.',
    text: 'Harlem was the destination \u2014 the Promised Land. Most of its newcomers had come up the Atlantic coast, from Virginia, the Carolinas, Georgia, and Florida; the music arrived from every direction, and in 1924 Louis Armstrong left Chicago for New York to join Fletcher Henderson\u2019s orchestra. By the 1920s Harlem was the cultural capital of Black America. The Cotton Club, the Apollo Theater, the Savoy Ballroom \u2014 music was everywhere. But the Harlem Renaissance was more than jazz. It was poetry, painting, philosophy, and pride. Langston Hughes, Zora Neale Hurston, and Duke Ellington all called Harlem home. A people who had been told they were nothing created an explosion of art that changed the world.',
    music: { file: 'harlem.mp3', title: '\u201CAny Woman\u2019s Blues\u201D', artist: 'Bessie Smith, vocal \u2014 Fletcher Henderson, piano', year: 'Columbia Records, 1923' },
    quote: { text: 'I, too, sing America.', author: 'Langston Hughes' },
  },
];
