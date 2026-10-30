import type { Atmosphere, PanelEffect } from '@/components/exhibition/types';

/*
 * The Harlem Renaissance's two posters, panel by panel, for the hand-built
 * walkthrough in page.tsx. The wording is the posters' own.
 *
 * Each panel arrives its own way (`effect`, from the engine's vocabulary in
 * components/exhibition/types.ts): copy is typed out, set line by line,
 * spread like ink, swung in; a panel with no effect of its own takes the
 * exhibition's reveal (the Deco doors at a chapter title, Douglas's irises
 * round a painting). The title cards keep their own motions (`special`
 * frames them: panned, Ken Burns, erased, risen).
 *
 * `special` also keeps the section looks the posters were built with: the
 * grounds and copy colours, the train's rocking, the jazz swing, the doubled
 * shadow of Walter White's two identities.
 */

export type HarlemItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  position?: string;
  /** How the panel arrives; left out, it takes the exhibition's reveal. */
  effect?: PanelEffect;
  special?: string;
  /** The setting it stands in (HARLEM_ATMOSPHERES), drawn behind the panel. */
  atmosphere?: string;
  items?: string[];
  artworkTitle?: string;
  artworkArtist?: string;
  artworkDate?: string;
  artworkDescription?: string;
};

/**
 * The walkthrough's atmospheres (harlem.css draws them), each a setting from
 * the story:
 *   trains-north    the Great Migration: the view from a northbound train,
 *                   telegraph poles and ties racing past
 *   ink-bloom       the writers: ink blooming on a page under a desk lamp
 *   douglas-rays    Aaron Douglas's paintings: concentric rings and Deco rays
 *   savoy-ballroom  the music: the Savoy's spotlights and notes in the air
 *   color-line      Walter White's two identities: the light and dark halves
 *                   of the colour line, and the seam between them
 *   atlanta-night   September 1906: a lamp in a window on a dark street
 */
export const HARLEM_ATMOSPHERES: Record<string, Atmosphere> = {
  'trains-north': { parts: 4 },
  'ink-bloom': { parts: 2, particles: 7 },
  'douglas-rays': { parts: 3 },
  'savoy-ballroom': { parts: 3, particles: 9 },
  // A panel with no section look of its own stands in its atmosphere's ground.
  // Its lavender is a shade paler than the others', so titles read on the split's light half too (4.3:1).
  'color-line': { bg: '#17142f', title: '#d4bce8', text: '#ced5bc', parts: 3 },
  'atlanta-night': { bg: '#262a4d', title: '#b485d2', text: '#ced5bc', parts: 3, particles: 5 },
};


// ============================================
// POSTER 1: The Great Migration & The Harlem Renaissance
// ============================================
export const poster1Content: HarlemItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster1-title1.jpg',
    alt: 'The Great Migration and',
    effect: 'pan-lr',
    special: 'height'
  },
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster1-title2.jpg',
    alt: 'The Harlem Renaissance',
    effect: 'kenburns-in',
    special: 'width'
  },
  {
    type: 'section-title',
    text: 'The Trains North',
    position: 'full-width',
    special: 'train-journey',
    atmosphere: 'trains-north'
  },
  {
    type: 'paragraph',
    text: 'Between 1916 and 1930, more than one million Black Americans fled the South. They boarded trains in Mississippi, Alabama, Georgia, and Louisiana — escaping Jim Crow laws, sharecropping debt, and the constant threat of racial violence. They followed rumors of factory jobs and real wages to Chicago, Detroit, Cleveland, and Philadelphia. And they poured into a three-square-mile neighborhood at the northern tip of Manhattan called Harlem.',
    position: 'top-left',
    special: 'train-journey',
    effect: 'line-by-line',
    atmosphere: 'trains-north'
  },
  {
    type: 'paragraph',
    text: 'By 1930, Harlem held 175,000 Black residents — the largest concentration of Black Americans in the United States. They came from Southern farms and Caribbean islands, from African nations and Northern cities. Doctors lived alongside factory workers. Immigrants from Jamaica debated with migrants from Georgia. A self-contained Black world emerged: Black-owned businesses on 125th Street, Black newspapers like the Amsterdam News, Black churches that seated thousands.',
    position: 'bottom-right',
    special: 'train-journey',
    effect: 'split-reveal',
    atmosphere: 'trains-north'
  },
  {
    type: 'paragraph',
    text: 'What happened next would reshape American culture forever.',
    position: 'center',
    effect: 'blur-to-sharp',
    atmosphere: 'trains-north'
  },
  {
    type: 'section-title',
    text: 'The Literary Renaissance',
    position: 'full-width',
    special: 'ink-spread',
    effect: 'ink-spread',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'paragraph',
    text: 'The writers came first — or at least, they got the credit. Langston Hughes arrived from Missouri and became the movement\'s poet laureate, capturing Harlem\'s rhythms in collections like The Weary Blues (1926). Zora Neale Hurston came from Florida, trained as an anthropologist, and transformed Black Southern folk culture into novels like Their Eyes Were Watching God (1937). Claude McKay, born in Jamaica, wrote the defiant poem "If We Must Die" and the novel Home to Harlem (1928).',
    position: 'top-left',
    special: 'ink-spread',
    effect: 'typewriter',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'paragraph',
    text: 'Countee Cullen crafted formal verse that proved Black poets could master European forms while exploring Black themes. Nella Larsen examined the painful complexities of racial identity in Quicksand (1928) and Passing (1929). Jean Toomer\'s experimental Cane (1923) blended poetry and prose into something entirely new.',
    position: 'bottom-right',
    special: 'ink-spread',
    effect: 'fade-in',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'paragraph',
    text: 'Behind them stood editors and organizers. W.E.B. Du Bois published The Crisis, the NAACP\'s magazine, showcasing new voices. Charles S. Johnson edited Opportunity for the Urban League and organized dinners that introduced Black writers to white publishers. Jessie Fauset, literary editor of The Crisis, discovered and nurtured Langston Hughes and many others. Alain Locke compiled the anthology The New Negro (1925), which became the movement\'s manifesto.',
    position: 'top-right',
    special: 'ink-spread',
    effect: 'ink-spread',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/aspiration.jpg',
    alt: 'Painting in purples of three silhouetted figures looking and pointing toward a city of towers on a hill, above rows of raised, shackled hands',
    artworkTitle: 'Aspiration',
    artworkArtist: 'Aaron Douglas',
    artworkDate: '1936',
    artworkDescription: 'One of his most iconic murals, originally painted for the Texas Centennial Exposition. It depicts figures rising above broken chains, pointing toward a city on the horizon — symbolizing African American aspiration and progress.',
    special: 'art-deco-rays',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'section-title',
    text: 'Art, Theater, and Beyond',
    position: 'full-width',
    special: 'art-deco-rays',
    effect: 'split-reveal',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'paragraph',
    text: 'Aaron Douglas painted bold geometric murals that fused African aesthetics with Art Deco modernism — his work appeared in books, magazines, and on the walls of Harlem\'s public buildings. Augusta Savage sculpted busts of Black leaders and mentored younger artists in her Harlem studio. James Van Der Zee photographed weddings, funerals, and everyday moments with dignity and artistry, creating a visual archive of Black life.',
    position: 'top-left',
    special: 'art-deco-rays',
    effect: 'rise-expand',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'paragraph',
    text: 'On stage, the Blackbirds revues brought Black performers to Broadway — Bill "Bojangles" Robinson, Adelaide Hall, Ethel Waters, the Nicholas Brothers. Shuffle Along (1921), with music by Eubie Blake and Noble Sissle, was the first major Broadway musical written and performed entirely by Black Americans. Paul Robeson brought Shakespeare to Harlem and spirituals to concert halls worldwide. Josephine Baker conquered Paris with her dancing and never really came back.',
    position: 'bottom-right',
    special: 'art-deco-rays',
    effect: 'film-credits',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'section-title',
    text: 'The Sound of Harlem',
    position: 'full-width',
    special: 'jazz-swing',
    atmosphere: 'savoy-ballroom'
  },
  {
    type: 'paragraph',
    text: 'The music was everywhere — in speakeasies and ballrooms, at rent parties and fancy clubs. Duke Ellington held court at the Cotton Club on Lenox Avenue, broadcasting his sophisticated compositions to radio audiences nationwide. His band included giants: Bubber Miley on trumpet, Johnny Hodges on saxophone, "Tricky Sam" Nanton on trombone. Louis Armstrong revolutionized jazz with recordings like "West End Blues" (1928), transforming the music from collective improvisation into a vehicle for individual genius.',
    position: 'top-right',
    special: 'jazz-swing',
    effect: 'drift',
    atmosphere: 'savoy-ballroom'
  },
  {
    type: 'paragraph',
    text: 'Bessie Smith — the Empress of the Blues — recorded over 150 songs for Columbia Records, her voice so powerful it barely fit on wax. Fletcher Henderson\'s orchestra pioneered big band swing. Cab Calloway brought theatrical flair and scat singing to the masses. Ethel Waters crossed from blues into Broadway and Hollywood.',
    position: 'bottom-left',
    special: 'jazz-swing',
    effect: 'breathe',
    atmosphere: 'savoy-ballroom'
  },
  {
    type: 'paragraph',
    text: 'The Savoy Ballroom on Lenox Avenue — integrated, unlike the Cotton Club — held 4,000 dancers on its block-long floor. The Lindy Hop was born there. Small\'s Paradise on 135th Street featured waiters who danced the Charleston while carrying trays. Rent parties — informal gatherings where tenants charged admission to raise money for rent — featured stride pianists like Fats Waller and James P. Johnson playing until dawn.',
    position: 'top-left',
    special: 'jazz-swing',
    effect: 'line-by-line',
    atmosphere: 'savoy-ballroom'
  },
  {
    type: 'section-title',
    text: 'The End and the Beginning',
    position: 'full-width',
    effect: 'blur-to-sharp',
    atmosphere: 'trains-north'
  },
  {
    type: 'paragraph',
    text: 'The stock market crashed in 1929. The Great Depression devastated Harlem — by 1935, unemployment reached 50 percent. White patrons stopped coming uptown. Publishers lost interest in Black writers. The Harlem Renaissance as a concentrated movement was over by the mid-1930s.',
    position: 'top-left',
    effect: 'shrink-back',
    atmosphere: 'trains-north'
  },
  {
    type: 'paragraph',
    text: 'But its impact endured. The writers, artists, and musicians of the Harlem Renaissance proved that Black Americans could produce work equal to anything in the world. They created institutions — magazines, publishing connections, artistic networks — that supported Black creativity for generations. The confidence they instilled, the pride they demonstrated, the excellence they demanded laid the foundation for the Civil Rights Movement that would transform America.',
    position: 'bottom-right',
    effect: 'fade-in',
    atmosphere: 'trains-north'
  },
  {
    type: 'quote',
    text: 'The trains that carried those migrants north carried more than people. They carried the seeds of a revolution.',
    position: 'center',
    effect: 'rise-expand',
    atmosphere: 'trains-north'
  },
  {
    type: 'link',
    text: 'Explore More: A New African American Identity — National Museum of African American History and Culture',
    url: 'https://nmaahc.si.edu/explore/stories/new-african-american-identity-harlem-renaissance',
    effect: 'film-credits',
    atmosphere: 'trains-north'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// POSTER 2: Walter White — The Civil Rights Hero You've Never Heard Of
// ============================================
export const poster2Content: HarlemItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster2-title1.jpg',
    alt: 'Walter White',
    effect: 'erase',
    special: 'width-top'
  },
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster2-title2.jpg',
    alt: 'The Civil Rights Hero You\'ve Never Heard Of',
    effect: 'rise-expand',
    special: 'width'
  },
  {
    type: 'paragraph',
    text: 'He had blond hair, blue eyes, and skin so fair that strangers assumed he was white. He was also one of the most important Black leaders of the twentieth century.',
    position: 'center',
    special: 'dual-identity',
    effect: 'blur-to-sharp',
    atmosphere: 'color-line'
  },
  {
    type: 'section-title',
    text: 'The Man No One Suspected',
    position: 'full-width',
    special: 'dual-identity',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'Walter Francis White was born in Atlanta in 1893 into a middle-class Black family — his father was a mail carrier, his mother a former teacher. Both parents were light-skinned, descended from mixed-race unions that stretched back to slavery. In the rigid racial classifications of the American South, the White family was legally, socially, and culturally Black. But to anyone who didn\'t know the family, Walter looked like just another white boy.',
    position: 'top-left',
    special: 'dual-identity',
    effect: 'line-by-line',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'He could have disappeared into whiteness as many light-skinned Black Americans did, "passing" into white society to escape Jim Crow, access better jobs and live without the constant weight of racism. "Passing" as white meant safety. But it also meant abandoning one\'s family, community, identity.',
    position: 'bottom-right',
    special: 'dual-identity',
    effect: 'fade-in',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'Walter White chose differently.',
    position: 'center',
    effect: 'mega-zoom-out',
    atmosphere: 'color-line'
  },
  {
    type: 'section-title',
    text: 'The Night Everything Changed',
    position: 'full-width',
    special: 'harlem-night',
    atmosphere: 'atlanta-night'
  },
  {
    type: 'paragraph',
    text: 'In September 1906, when Walter was twelve, a white mob rampaged through Atlanta. Fueled by inflammatory newspaper headlines about alleged Black crimes, thousands of white men attacked Black neighborhoods, beating and killing Black residents and destroying Black businesses. At least twenty-five Black people died, although it was likely many more.',
    position: 'top-left',
    special: 'harlem-night',
    effect: 'split-reveal',
    atmosphere: 'atlanta-night'
  },
  {
    type: 'paragraph',
    text: 'The mob approached the White family home. Walter\'s father armed himself and prepared to defend the house. The family waited in darkness, listening to the violence outside. The mob passed by — possibly because the house looked like it belonged to a white family. But White never forgot that night.',
    position: 'bottom-right',
    special: 'harlem-night',
    effect: 'blur-to-sharp',
    atmosphere: 'atlanta-night'
  },
  {
    type: 'paragraph',
    text: '"I knew then who I was," he wrote decades later. "I was a Negro, a human being with an invisible pigmentation which marked me a person to be hunted."',
    position: 'center',
    special: 'harlem-night',
    effect: 'typewriter',
    atmosphere: 'atlanta-night'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/poster2-photograph.jpg',
    alt: 'Sepia portrait photograph of Walter White, seated in a dark suit and tie, looking to one side',
    artworkTitle: 'Walter Francis White',
    artworkArtist: 'Clara Sipprell',
    artworkDate: 'c. 1940',
    artworkDescription: 'Gelatin silver print. Civil rights leader and executive secretary of the NAACP from 1931 to 1955. National Portrait Gallery, Washington D.C.',
    atmosphere: 'color-line'
  },
  {
    type: 'section-title',
    text: 'The NAACP\'s Secret Weapon',
    position: 'full-width',
    effect: 'split-reveal',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'In 1918, the NAACP hired White as an investigator. His job: travel to Southern towns where Black Americans had been killed by mobs, gather evidence, and report back to the nation. His appearance made him the perfect spy.',
    position: 'top-right',
    effect: 'typewriter',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'White would arrive in a town days after racial violence, posing as a white journalist or businessman. He interviewed sheriffs, politicians, and ordinary white citizens — people who spoke freely, even boasted, about what had been done to Black residents. They never suspected that the fair-skinned stranger was gathering evidence against them.',
    position: 'bottom-left',
    effect: 'fade-in',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'Over twelve years, White personally investigated forty-one lynchings and eight race riots. He traveled to Arkansas after the Elaine massacre of 1919, where white mobs murdered hundreds of Black sharecroppers. He investigated violence in Florida, Texas, Georgia, and throughout the South. The evidence he gathered helped expose the reality of racial terror to national and international audiences.',
    position: 'top-left',
    effect: 'line-by-line',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'But it was extraordinarily dangerous work. More than once, White\'s identity was discovered and he had to flee. In Arkansas, he escaped just ahead of a mob that had learned who he really was, boarding a departing train with only minutes to spare.',
    position: 'center',
    effect: 'film-credits',
    atmosphere: 'trains-north'
  },
  {
    type: 'section-title',
    text: 'Witness Turned Author',
    position: 'full-width',
    special: 'ink-spread',
    effect: 'ink-spread',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'paragraph',
    text: 'White channeled what he witnessed into literature. His first novel, The Fire in the Flint (1924), tells the story of Kenneth Harper, a Black doctor educated in the North who returns to his Georgia hometown determined to help his community. The novel ends with Harper\'s death at the hands of a white mob. White wrote the entire manuscript in twelve days. Every detail came from his investigations. The book received immediate critical acclaim while some Southern newspapers denounced it as slander. White considered that a success.',
    position: 'top-right',
    special: 'ink-spread',
    effect: 'typewriter',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'paragraph',
    text: 'His second novel, Flight (1926), explored the agonizing choice of passing while his nonfiction book Rope and Faggot: A Biography of Judge Lynch (1929) analyzed the causes and psychology of mob violence. Beyond his own writing, White championed other Harlem Renaissance authors. He introduced Langston Hughes to publishers and promoted Claude McKay, Countee Cullen, and many others. His Harlem apartment became a gathering place for writers, artists, and intellectuals.',
    position: 'bottom-left',
    special: 'ink-spread',
    effect: 'fade-in',
    atmosphere: 'ink-bloom'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/creation.jpg',
    alt: 'Painting of a lone silhouetted figure on a hill beneath concentric rainbow arcs, with a great hand reaching down from the sky',
    artworkTitle: 'The Creation',
    artworkArtist: 'Aaron Douglas',
    artworkDate: '1935',
    artworkDescription: 'Douglas first pictured this sermon in 1927, in his illustrations for James Weldon Johnson\'s book God\'s Trombones: Seven Negro Sermons in Verse, and returned to it in this painting. Douglas\'s signature style — silhouetted figures bathed in concentric circles of light — became the defining visual language of the Harlem Renaissance.',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'section-title',
    text: 'Twenty-Four Years at the Helm',
    position: 'full-width',
    effect: 'split-reveal',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'paragraph',
    text: 'In 1931, White became executive secretary of the NAACP — the organization\'s top position. He held it for twenty-four years, through the Great Depression, World War II, and the early Civil Rights era. Under his leadership, the NAACP pursued legal challenges to segregation. White lobbied presidents — Roosevelt, Truman, Eisenhower — for civil rights legislation, pushed for federal anti-lynching laws, though Southern senators blocked them repeatedly, and advocated for desegregation of the military, which Truman finally ordered in 1948. White also advised Eleanor Roosevelt on racial issues and testified before Congress on these same issues. While doing all this, he wrote a nationally syndicated newspaper column.',
    position: 'top-left',
    effect: 'line-by-line',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'paragraph',
    text: 'White was, for a quarter century, one of the most prominent Black leaders in America — a man who looked white but never wavered in his identity.',
    position: 'center',
    effect: 'blur-to-sharp',
    atmosphere: 'douglas-rays'
  },
  {
    type: 'section-title',
    text: 'Forgotten Hero',
    position: 'center',
    effect: 'shrink-back',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'Walter F. White died in 1955, just months after the Supreme Court\'s Brown v. Board of Education decision began dismantling legal segregation. And then America forgot him.',
    position: 'top-right',
    effect: 'fade-in',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'White\'s death came at the worst possible moment for his legacy. History remembers the marches, the speeches, the confrontations of the 1960s. It is not so good at remembering the people who laid the ground those moments stood on. White\'s decades of legal strategy, political lobbying, and undercover investigation didn\'t look like the activism that came next, and a younger generation of leaders viewed his incremental, institution-building approach as too cautious, too slow.',
    position: 'bottom-left',
    effect: 'split-reveal',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'His appearance made it worse. A Black leader who looked white unsettled people on all sides — too Black for white America, too white-looking for a movement increasingly defined by visible solidarity. A late-life personal scandal — his 1949 divorce and remarriage to a white South African woman — alienated colleagues and community members alike and by the time the civil rights story was being written, White had slipped out of it.',
    position: 'top-left',
    effect: 'ink-spread',
    atmosphere: 'color-line'
  },
  {
    type: 'paragraph',
    text: 'Despite this, Walter White is arguably one of the most influential leaders in American history, transforming the NAACP into a powerhouse for civil rights.',
    position: 'center',
    effect: 'rise-expand',
    atmosphere: 'color-line'
  },
  {
    type: 'link',
    text: 'Explore More: Walter White — Smithsonian Black History Month',
    url: 'https://www.si.edu/events/black-history-month?trumbaEmbed=view%3Devent%26eventid%3D180126734',
    effect: 'film-credits',
    atmosphere: 'color-line'
  },
  { type: 'end', text: 'Return to Exhibition' }
];
