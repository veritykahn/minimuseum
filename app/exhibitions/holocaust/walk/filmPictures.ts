import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The film's pictures that are not the owner's own. The owner's 32 pictures
 * (walk-01 to walk-32) need no credit; the slots added when the film was
 * rebuilt (walk-33 to walk-55) were filled on November 4, 2026, at her
 * request, with photographs from Wikimedia Commons: real places, objects
 * and documents where they fit, nothing graphic and no one's face, each
 * license checked on its own file page. Each is credited in the walk's
 * Sources drawer, under its line, as "Picture". REVIEW (Verity): each
 * choice, and the notes beside it.
 */

export type FilmPictureCredit = FactSource & { alt: string };

const commons = (author: string, title: string, license: string, href: string, alt: string): FilmPictureCredit => ({
  label: `${author}, *${title}*. ${license}, via Wikimedia Commons`,
  href,
  alt,
});

/** By slot. */
export const FILM_PICTURE_CREDITS: Readonly<Record<string, FilmPictureCredit>> = {
  // REVIEW (Verity): the Dachau memorial today; the gate seen from inside, so "Arbeit macht frei" reads backwards.
  "w33-camp-gate": commons("Lawrence W.K. Ho", "The shut iron gate of the Dachau camp, seen from inside", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Gates_to_Dachau_Concentration_Camp,_Munich_-_panoramio.jpg", "A tall iron gate with a diamond lattice stands shut inside a stone archway, with a misty, empty road visible through the passage beyond."),
  // REVIEW (Verity): a present-day shop front in Eisenach, not a Jewish shop and not a period photo.
  "w34-shop-door": commons("Metilsteiner", "An old shop front with its blinds pulled down, Eisenach", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:ESA_Marienstr17_Bild2.jpg", "An old brown-painted shop front with its window blinds rolled all the way down, beside two shut wooden doors in a recessed doorway."),
  // REVIEW (Verity): Micha Ullman's book-burning memorial on Bebelplatz (1995), under German freedom of panorama; the Heine plaque beside it is an alternative.
  "w36-embers": commons("חזרתי", "The empty library: the book-burning memorial on Bebelplatz, Berlin", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Denkmal_der_Buecherverbrennung_Bebelplatz_Berlin.jpg", "A square glass window set into grey cobblestones looks down into a white underground room lined with empty bookshelves."),
  // REVIEW (Verity): the surviving ghetto wall at 55 Sienna Street today (no wire now).
  "w38-ghetto-wall": commons("Adrian Grycuk", "A surviving piece of the Warsaw ghetto wall, 55 Sienna Street", "CC BY-SA 3.0 PL", "https://commons.wikimedia.org/wiki/File:Fragment_muru_getta_przy_ul._Siennej_55_w_Warszawie.jpg", "A long, old red-brick wall stands across a courtyard behind three stone planters, with modern office towers rising behind it."),
  // REVIEW (Verity): a present-day country road in the Lublin region, in May.
  "w39-empty-road": commons("Panek", "A dirt road through fields near Tereszpol, eastern Poland", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Droga_mi%C4%99dzy_panas%C3%B3wk%C4%85_a_tereszpolem_pola.jpg", "A sandy dirt road runs straight between green fields toward a line of trees under a pale, overcast sky."),
  // REVIEW (Verity): a museum object (HL-senteret, Oslo), lying on dark cloth rather than sewn on a coat.
  "w40-star": commons("Kjetil Ree", "A yellow star badge marked 'Jude'", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Jude,_Davidsstjerne_(HL-senteret,_2016-10-06).jpg", "A worn yellow cloth star printed with the word 'Jude' lies on dark fabric, soft and blurred toward the edges."),
  // REVIEW (Verity): the surviving Babyn Yar ravine today; much of it was filled in in the 1950s.
  "w43-ravine": commons("Педагог Світлана", "The Babyn Yar ravine, Kyiv, in late winter", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:%D0%91%D0%B0%D0%B1%D0%B8%D0%BD_%D0%AF%D1%80,_%D1%83%D1%80%D0%BE%D1%87%D0%B8%D1%89%D0%B5,_%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D1%82%D0%B0_%D0%9F%D0%BE%D0%B4%D1%96%D0%BB%D1%8C%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%D0%B8.jpg", "Bare grey trees stand on the steep sandy slopes of a wooded ravine, with a path winding along its floor."),
  // REVIEW (Verity): a compromise: the memorial no longer has the 1942 table; this is the exhibition room with a large period photograph of the villa's dining room mounted in the arch (whose own copyright is unknown), and the exhibition was redesigned in 2020.
  "w45-meeting-table": commons("Kjetil Ree", "The conference room at the House of the Wannsee Conference", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Wannsee_(Sept_2017).jpg", "Through a tall arch between two marble columns, a large old photograph shows the villa's dining room with a round table, chairs and a chandelier, next to a glass display case."),
  // REVIEW (Verity): page 6 of the Wannsee Protocol, section B of the list and the total, "über 11.000.000".
  "w46-typed-list": commons("German Reich, Reich Security Main Office (scan: House of the Wannsee Conference)", "The Wannsee Protocol, page 6: the list of countries and numbers", "Public domain", "https://commons.wikimedia.org/wiki/File:Wannsee_Protokoll_januar_1942.djvu", "A typed list on yellowed paper names countries such as Bulgaria, England, Italy, Romania, Hungary and the USSR, with numbers beside each, ending in a total of 11,000,000."),
  // REVIEW (Verity): the villa's garden side in the snow, January 2014.
  "w47-chairs-pushed-back": commons("Dguendel", "The Wannsee villa's garden terrace in the snow", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Berlin-Wannsee,_das_Haus_der_Wannseekonferenz-3.JPG", "Snow covers the terrace of a large grey stone villa with tall arched windows, where an empty white bench stands against the wall and two stone lions sit by the steps."),
  // REVIEW (Verity): the railway siding to Treblinka, 1945 (PD-Poland); no gate.
  "w48-sidings": commons("nieznany/unknown", "The railway siding to Treblinka, 1945", "Public domain", "https://commons.wikimedia.org/wiki/File:Treblinka_railway_siding_1945.jpg", "Two old railway tracks run through sandy grass toward a line of pine trees, beside a telegraph pole under a cloudy sky."),
  // REVIEW (Verity): the ruins of the Warsaw ghetto after the war (about 1946), St Augustine's spire behind.
  "w50-burned-street": commons("Unknown photographer", "Ruins of the Warsaw ghetto after the war", "Public domain", "https://commons.wikimedia.org/wiki/File:Ruiny_getta_warszawskiego_w_drugiej_po%C5%82owie_lat_40.jpg", "A lone street lamp stands in a sea of broken bricks and rubble where a street once ran, with a church spire rising in the distance."),
  // REVIEW (Verity): old semaphore signals at Kcynia station today; no link to the deportation trains.
  "w51-signal": commons("Jarosław Szczepaniak", "Old semaphore signals at Kcynia station, Poland", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Semaphore_-_Semafor_-_panoramio.jpg", "Old semaphore railway signals on tall posts stand over an overgrown station yard of dry summer grass, under a heavy grey sky, with a water tower in the distance."),
  // REVIEW (Verity): a present-day forest track in snow near Dülmen; the photographer asks for his credit line as given.
  "w52-snow-road": commons("Dietmar Rabich / Wikimedia Commons", "A forest track in snow, near Dülmen, Germany", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_Neustr%C3%A4%C3%9Fer_Bruch_--_2021_--_4413.jpg", "A straight forest track covered in thin, trampled snow runs between bare trees and pines into a grey, misty distance."),
  // REVIEW (Verity): the names in the Pinkas Synagogue, Prague (painted, not carved); inside a museum, where freedom of panorama may not apply.
  "w55-names-wall": commons("Richard Mortel from Riyadh, Saudi Arabia", "Names on the walls of the Pinkas Synagogue, Prague", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Pinkas_Synagogue,_Prague,_memorial_to_victims_of_Nazi_terror_(1)_(25580148434).jpg", "A wall is covered from edge to edge with tiny hand-lettered names and dates in black and red, far too many to read."),
};
