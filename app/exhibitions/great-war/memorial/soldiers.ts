/*
 * The memorial's soldier cards: eleven American servicemen of the Great War.
 *
 * Every word below comes from the research notes the owner approved
 * (great-war-soldiers.md), and each card carries that file's sources. Nothing
 * is added. Where the sources disagree (an age, a name, a birthplace, a birth
 * date) the card says so rather than choosing. Ages the notes worked out from
 * a sourced birth date are given as plain ages; where no age is documented,
 * none is given.
 *
 * Grave plots are shown as the notes give them. They must be checked by hand
 * against the ABMC burial search (abmc.gov) before this goes live.
 */

export type Source = { label: string; url: string };

export type Soldier = {
  id: string;
  name: string;
  /** Another spelling or name the records use, shown under the name. */
  alsoKnownAs?: string;
  /** Left out where the record gives none (Olson). */
  rank?: string;
  /** A short note on the rank, e.g. a reduction or a restoration. */
  rankNote?: string;
  unit: string;
  hometown: string;
  born?: string;
  died: string;
  /** As the sources give it, with any conflict in words. Left out when not documented. */
  age?: string;
  cause: string;
  /** Where he lies, with the plot as the notes give it. Left out when not known. */
  burial?: { place: string; plot?: string; note?: string };
  /** Where he is named, when there is a memorial as well as (or instead of) a grave. */
  memorial?: string;
  story: string[];
  honours?: string;
  /** Where the sources disagree, said plainly. */
  notes?: string[];
  sources: Source[];
};

export const SOLDIERS: Soldier[] = [
  {
    id: 'gunther',
    name: 'Henry Nicholas Gunther',
    rank: 'Private',
    rankNote: 'He had been a supply sergeant and was reduced to private. The Army restored his rank of sergeant after his death.',
    unit: 'Company A, 313th Infantry Regiment (“Baltimore’s Own”), 157th Brigade, 79th Division',
    hometown: 'Baltimore (Highlandtown, east Baltimore), Maryland',
    born: '6 June 1895, Baltimore',
    died: '11 November 1918, 10:59 a.m., near Chaumont-devant-Damvillers (Meuse), France',
    age: '23',
    cause: 'Killed in action',
    burial: { place: 'Most Holy Redeemer Cemetery, Baltimore', note: 'His remains were brought home from France in 1923.' },
    story: [
      'Henry Gunther was the son of children of German immigrants. He worked as a bookkeeper and clerk at the National Bank of Baltimore, and he was drafted in September 1917.',
      'Army censors read a letter he wrote home that criticised conditions at the front, and he was reduced from sergeant to private.',
      'On the morning of 11 November 1918 he charged a German machine-gun position and was killed at 10:59, one minute before the Armistice took effect. General Pershing’s order of the next day named him as the last American killed in the war.',
    ],
    honours: 'Distinguished Service Cross and a divisional citation, both after his death',
    notes: ['His middle name is spelled “Nicholas” in some sources and “Nicolas” in others.'],
    sources: [
      { label: 'Wikipedia, “Henry Gunther”', url: 'https://en.wikipedia.org/wiki/Henry_Gunther' },
      { label: 'Western Front Association, “On this day: 11 November 1918”', url: 'https://www.westernfrontassociation.com/on-this-day/11-november-1918-pvt-ex-sgt-henry-nicolas-gunther' },
      { label: 'BBC News, “The last soldiers to die in World War I” (2008)', url: 'https://news.bbc.co.uk/2/hi/uk_news/magazine/7696021.stm' },
      { label: 'NBC News, “Sgt. Henry Gunther: Was last American death of WWI hero or victim?”', url: 'https://www.nbcnews.com/news/world/sgt-henry-gunther-was-last-american-death-wwi-hero-or-n245056' },
    ],
  },
  {
    id: 'stowers',
    name: 'Freddie Stowers',
    rank: 'Corporal',
    rankNote: 'Squad leader',
    unit: 'Company C, 1st Battalion, 371st Infantry Regiment, 93rd Division, serving with the French 157th “Red Hand” Division',
    hometown: 'Sandy Springs, Anderson County, South Carolina',
    born: '12 January 1896',
    died: '28 September 1918, in the attack on Hill 188, near Ardeuil-et-Montfauxelles (Ardennes), France',
    age: '22',
    cause: 'Killed in action (mortally wounded while leading the attack)',
    burial: { place: 'Meuse-Argonne American Cemetery, Romagne-sous-Montfaucon, France', plot: 'Plot F, Row 36, Grave 40' },
    story: [
      'Freddie Stowers grew up on his family’s farm near Sandy Springs and worked there before he was drafted in 1917. He served in an all-Black regiment organised at Camp Jackson, South Carolina.',
      'In the attack on Hill 188, about half his company was killed or wounded. He took charge, helped capture the first German trench, and was mortally wounded leading the advance on the second trench, still urging his men forward.',
    ],
    honours:
      'He was recommended for the Medal of Honor in 1918, but the recommendation was lost. President George H. W. Bush presented the Medal on 24 April 1991, after an Army review that began in 1988. He was the first Black recipient of the Medal of Honor for First World War service.',
    sources: [
      { label: 'National Park Service, “Freddie Stowers”', url: 'https://www.nps.gov/people/freddie-stowers.htm' },
      { label: 'ABMC, Black History Month', url: 'https://www.abmc.gov/news-events/news/american-battle-monuments-commission-proud-commemorate-black-history-month/' },
      { label: 'ABMC, “5 things you may not know about Meuse-Argonne American Cemetery”', url: 'https://www.abmc.gov/news-events/news/5-things-you-may-not-know-about-meuse-argonne-american-cemetery/' },
      { label: 'South Carolina Encyclopedia, “Stowers, Freddie”', url: 'https://www.scencyclopedia.org/sce/entries/stowers-freddie/' },
      { label: 'Wikipedia, “Freddie Stowers”', url: 'https://en.wikipedia.org/wiki/Freddie_Stowers' },
    ],
  },
  {
    id: 'stout',
    name: 'Eben M. Stout',
    rank: 'Private',
    unit: 'Company M, 369th Infantry Regiment (the “Harlem Hellfighters”), 93rd Division, formerly the 15th New York National Guard Infantry',
    hometown: 'Camden, New Jersey. His family came from East Dover, Kent County, Delaware.',
    died: '26 September 1918, the first day of the French Fourth Army’s offensive in Champagne, France',
    cause: 'Killed in action',
    burial: { place: 'Meuse-Argonne American Cemetery, Romagne, France', plot: 'Plot C, Row 41, Grave 14' },
    story: [
      'In 1910 Eben Stout was working as a laborer at a chemical plant. When he enlisted he was living with his brother at 1140 South 10th Street, Camden.',
      'He enlisted on 28 November 1917 at Camp Merritt and joined Company M of the 15th New York, which became the 369th Infantry. He was killed on the first day of the Champagne offensive, in which the 369th took the village of Ripont.',
    ],
    notes: ['One account gives his date of death as 28 September; the Camden County records give 26 September.'],
    sources: [
      { label: 'Camden County history (DVRBS), “Eben M. Stout”', url: 'https://dvrbs.camdenhistory.com/ccwd-ww1/ww1-ebenmstout.htm' },
      { label: 'Camden County history (DVRBS), “Eben M. Stout” (people)', url: 'https://dvrbs.camdenhistory.com/people/eben-m-stout/' },
      { label: 'ABMC, “The Harlem Hellfighters”', url: 'https://www.abmc.gov/news-events/news/harlem-hellfighters-most-storied-african-american-combat-unit-world-war-i/' },
    ],
  },
  {
    id: 'juan',
    name: 'Matthew B. Juan',
    alsoKnownAs: 'Also spelled Mathew. He was later known as Matthew Rivers, and his army records may be under that name.',
    rank: 'Private',
    unit: 'Company K, 28th Infantry Regiment, 2nd Brigade, 1st Division',
    hometown: 'Sacaton, Gila River Indian Community, Arizona (Pima / Akimel O’odham). He was born at San Tan, Pinal County.',
    born: '22 April 1892',
    died: '28 May 1918, Battle of Cantigny, France',
    age: '26',
    cause: 'Killed in action (by machine-gun fire while advancing)',
    burial: {
      place: 'The churchyard of the C. H. Cook Memorial Church, Sacaton, Arizona',
      note: 'He was first buried in France. In 1921 his remains were returned to Arizona at his mother’s request, and he was buried with honours on 9 April 1921.',
    },
    memorial: 'The Matthew B. Juan–Ira H. Hayes Veterans Memorial Park, Sacaton',
    story: [
      'Matthew Juan grew up in Sacaton and went to the Sherman Institute, an Indian boarding school in Riverside, California. He registered for the draft in Wichita Falls, Texas, in June 1917 and was drafted that December.',
      'In February 1918 he was aboard the troopship SS Tuscania when a German U-boat torpedoed it. He survived and rejoined the army, and he was killed at Cantigny, the first major American offensive of the war, a week after joining the 28th Infantry.',
      'He is remembered as the first Arizonan killed in the First World War.',
    ],
    sources: [
      { label: 'Wikipedia, “Matthew B. Juan”', url: 'https://en.wikipedia.org/wiki/Matthew_B._Juan' },
      { label: 'Arizona Daily Star, “May 28: Today in Arizona history”', url: 'https://tucson.com/news/local/article_3f6634f8-a6c6-11e1-a5eb-0019bb2963f4.html' },
      { label: 'Associated Press / Washington Times, “Today in Arizona History” (2017)', url: 'https://www.washingtontimes.com/news/2017/may/24/today-in-arizona-history/' },
      { label: 'Gila River Indian Community memorial (archived)', url: 'http://www.gilariver.org/index.php/news/28-may-2008-grin/66-mathew-b-juan-world-war-i-warrior' },
    ],
  },
  {
    id: 'hay',
    name: 'Merle David Hay',
    rank: 'Private',
    unit: 'Company F, 16th Infantry Regiment, 1st Division',
    hometown: 'Glidden, Carroll County, Iowa',
    born: '20 July 1896, on a farm in Carroll County, Iowa',
    died: '3 November 1917, near Bathelémont (Lorraine), France, in a German trench raid before dawn',
    age: '21',
    cause: 'Killed in action',
    burial: {
      place: 'Merle Hay Memorial Cemetery (formerly West Lawn Cemetery), Glidden, Iowa',
      note: 'He was first buried near the battlefield on 5 November 1917, and reburied at Glidden in July 1921.',
    },
    story: [
      'Merle Hay grew up on a farm near Glidden and worked as a farm implement mechanic. He volunteered on 9 May 1917, one of eight Glidden men who enlisted that day.',
      'He, Corporal James Gresham of Evansville, Indiana, and Private Thomas Enright of Pittsburgh were the first three soldiers of the American Expeditionary Forces killed in combat. Newspapers at home reported their deaths on 5 November 1917.',
    ],
    sources: [
      { label: 'Iowa PBS, Iowa Pathways, “Private Merle D. Hay gives his life”', url: 'https://www.iowapbs.org/iowapathways/mypath/2444/private-merle-d-hay-gives-his-life' },
      { label: 'Wikipedia, “Merle Hay”', url: 'https://en.wikipedia.org/wiki/Merle_Hay' },
      { label: 'Evening Public Ledger, 5 November 1917 (Library of Congress)', url: 'https://chroniclingamerica.loc.gov/lccn/sn83045211/1917-11-05/ed-1/seq-1/' },
      { label: 'IAGenWeb, Great War casualties, 5 November 1917', url: 'https://iagenweb.org/greatwar/casualties/1917/5Nov1917.htm' },
      { label: 'Senator Chuck Grassley, honoring Merle Hay', url: 'https://www.grassley.senate.gov/news/news-releases/grassley-honoring-iowan-merle-hay' },
    ],
  },
  {
    id: 'healey',
    name: 'John B. Healey',
    rank: 'Private',
    unit: '102nd Infantry Regiment, 26th “Yankee” Division (Connecticut National Guard, New Haven)',
    hometown: 'East Haven, Connecticut',
    born: '27 July 1902, the date his mother gave after the war',
    died: '21 July 1918, Second Battle of the Marne, France',
    age: '15 (his service record says 18)',
    cause: 'Killed in action',
    memorial: 'The East Haven First World War monument, one of five East Haven men who died. His burial place has not been found.',
    story: [
      'In a military questionnaire filed after the war, his mother wrote that John enlisted in New Haven’s 102nd Regiment at 14. She agreed to it only after he threatened to run away to New York and claim he was old enough.',
      'A local newspaper said his “great size and robust appearance” got him through the physical, and called him the youngest soldier in the regiment. He was killed less than a week before his 16th birthday.',
    ],
    notes: ['By his mother’s account he was 14 when he enlisted and 15 when he died. His service record gave his age as 18.'],
    sources: [
      { label: 'Connecticut in World War I, “East Haven teen 1 of 5 from town who died in WWI”', url: 'https://ctinworldwar1.org/east-haven-teen-1-of-5-from-town-who-died-in-wwi/' },
      { label: 'ABMC, “Hometown boys from Connecticut”', url: 'https://www.abmc.gov/news-events/news/hometown-boys-connecticut-information-and-statistics-about-wwi-service-members/' },
    ],
  },
  {
    id: 'olson',
    name: 'Fred Harold Olson',
    unit: 'Machine Gun Training Center, Camp Hancock, Georgia. Earlier, the 161st Depot Brigade at Camp Grant, Illinois, until 27 September 1918.',
    hometown: 'Eddy County, North Dakota (inducted at New Rockford)',
    born: '1 April 1894, Malmö, Sweden',
    died: '4 October 1918, Camp Hancock, Georgia',
    age: '24',
    cause: 'Disease (influenza)',
    memorial: 'The All Veterans Memorial at the North Dakota State Capitol, Bismarck',
    story: [
      'Fred Olson was born in Sweden, became an American citizen, and farmed in Eddy County, North Dakota.',
      'He was inducted on 4 September 1918. He died of influenza at Camp Hancock on 4 October 1918, without ever reaching France.',
    ],
    notes: ['The state roster gives him no rank.'],
    sources: [
      { label: 'North Dakota Department of Veterans Affairs, “North Dakota’s Heroes: Fred Harold Olson”', url: 'https://www.veterans.nd.gov/heroes/fred-harold-olson' },
      { label: 'North Dakota’s Heroes listing', url: 'https://veterans.nd.gov/north-dakotas-heroes?page=87' },
    ],
  },
  {
    id: 'kocak',
    name: 'Matej Kocak',
    rank: 'Sergeant, U.S. Marine Corps',
    unit: '66th Company, 5th Marines, 2nd Division',
    hometown: 'Binghamton, New York. He enlisted in Pittsburgh, Pennsylvania, in 1907.',
    born: '1882, Egbell, Austria-Hungary (now Gbely, Slovakia)',
    died: '4 October 1918, Blanc Mont Ridge (Champagne), France',
    age: '35',
    cause: 'Killed in action',
    burial: { place: 'Meuse-Argonne American Cemetery, Romagne, France' },
    story: [
      'Matej Kocak emigrated from what is now Slovakia in 1906. In Binghamton he belonged to a Slovak Catholic Sokol, a gymnastics society. He joined the Marines in 1907 and served at Vera Cruz and in the Dominican Republic before the war.',
      'On 18 July 1918, near Soissons, he went forward alone with his bayonet against a hidden machine-gun nest that had stopped his battalion. He then led a group of French colonial soldiers against a second one. He was killed less than three months later at Blanc Mont Ridge.',
    ],
    honours: 'The Medal of Honor from both the Army and the Navy, after his death. He was one of 13 immigrants awarded the Medal of Honor in the First World War.',
    notes: ['His biography gives his birth date as 3 December 1882; his Medal of Honor citations give 31 December 1882.'],
    sources: [
      { label: 'USCIS History Office, “The Immigrant Army”', url: 'https://uscis.gov/about-us/our-history/stories-from-the-archives/the-immigrant-army-immigrant-service-members-in-world-war-i' },
      { label: 'Wikipedia, “Matej Kocak”', url: 'https://en.wikipedia.org/wiki/Matej_Kocak' },
      { label: 'USMC History Division, “Sergeant Matej Kocak” (archived)', url: 'https://web.archive.org/web/20110516221907/http://www.tecom.usmc.mil/HD/Whos_Who/Kocak_M.htm' },
      { label: 'ABMC burial record', url: 'https://abmc.gov/node/501368' },
    ],
  },
  {
    id: 'stockham',
    name: 'Fred W. Stockham',
    rank: 'Gunnery Sergeant, U.S. Marine Corps',
    unit: '96th Company, 2nd Battalion, 6th Marine Regiment, 2nd Division',
    hometown: 'Belleville and Newark, New Jersey',
    born: '16 March 1881, Detroit, Michigan (his Silver Star citation says New York City)',
    died: '22 June 1918, in France, from gas suffered at Belleau Wood on the night of 13–14 June 1918',
    age: '37',
    cause: 'Died of wounds (mustard gas)',
    burial: {
      place: 'Hollywood Cemetery, Union, New Jersey',
      plot: 'Section C, Block 9, Lot 13, Grave 4',
      note: 'He was first buried in France, and his remains were returned in December 1920.',
    },
    story: [
      'Fred Stockham’s mother died when he was small, and he was raised by a foster mother in Newark. He was a career Marine; between his enlistments he worked as a fireman in Belleville, New Jersey.',
      'During a heavy gas bombardment at Belleau Wood he saw that a wounded Marine’s gas mask had been shot away. He gave the man his own mask and kept helping to evacuate the wounded until the gas overcame him. He died a week later.',
    ],
    honours: 'The Medal of Honor, awarded after his death in 1939 under a special Act of Congress (the original recommendation had never been acted on), and the Silver Star',
    sources: [
      { label: 'USMC History Division, “GySgt Fred W. Stockham”', url: 'https://www.usmcu.edu/Research/Marine-Corps-History-Division/People/Medal-of-Honor-Recipients-By-Unit/GySgt-Fred-W-Stockham/' },
      { label: 'Wikipedia, “Fred W. Stockham”', url: 'https://en.wikipedia.org/wiki/Fred_W._Stockham' },
      { label: 'Naval History and Heritage Command, “Stockham (DD-683)”', url: 'https://history.navy.mil/research/histories/ship-histories/danfs/s/stockham.html' },
      { label: 'The Observer, “‘Bravest man I knew’” (2018)', url: 'https://theobserver.com/2018/04/25/bravest-man-i-knew' },
    ],
  },
  {
    id: 'miner',
    name: 'Wayne Miner',
    alsoKnownAs: 'Born Wayman Minor',
    rank: 'Private',
    unit: 'Company A, 366th Infantry Regiment, 92nd Division (“Buffalo Soldiers”)',
    hometown: 'Kansas City, Missouri, where he enlisted. He was born in Henry County, Missouri.',
    born: 'About 1890',
    died: '11 November 1918, Meuse-Argonne, France, on the morning of the Armistice, before it took effect',
    cause: 'Killed in action (reportedly by shellfire while carrying ammunition)',
    burial: { place: 'St. Mihiel American Cemetery, Thiaucourt, France' },
    story: [
      'Wayne Miner was the son of Ned and Emily Minor, who had both been enslaved. Before the war he was a coal miner in Iowa. He enlisted in Kansas City in October 1917 and trained at Camp Dodge, Iowa.',
      'On the last morning of the war he volunteered, with three other soldiers, to carry ammunition to a machine-gun position under fire, and he was killed doing it.',
      'Kansas City’s Black American Legion post, Wayne Miner Post 149, founded in 1919, is named for him.',
    ],
    sources: [
      { label: 'Wikipedia, “Wayne Miner”', url: 'https://en.wikipedia.org/wiki/Wayne_Miner' },
      { label: 'Kansas City Black History, “Wayne Miner”', url: 'https://kcblackhistory.org/articles/wayne-miner' },
      { label: 'JoeLouis Mattox, “Raising Private Miner” (PDF)', url: 'https://static1.squarespace.com/static/51181e81e4b04512ec820440/t/58da666559cc68c4bc17bba5/1490708071527/privateminer.pdf' },
      { label: 'Kansas City Star, “Wayne Miner, son of slaves, ‘died a hero’”', url: 'https://www.kansascity.com/news/local/article107823992.html' },
    ],
  },
  {
    id: 'henry',
    name: 'Castillia Henry',
    rank: 'Private',
    unit: 'Company A, 365th Infantry Regiment, 92nd Division',
    hometown: 'New Bern, Craven County, North Carolina',
    born: 'December 1896, New Bern',
    died: '10 November 1918, in the attack on the heights near Champey (Lorraine), France, the day before the Armistice',
    age: '21',
    cause: 'Killed in action',
    burial: {
      place: 'New Bern National Cemetery, North Carolina',
      plot: 'Section 12, Grave 3434',
      note: 'He was first buried at St. Mihiel American Cemetery, France, and brought home in 1921.',
    },
    memorial: 'The First World War monument at the Craven County Courthouse',
    story: [
      'Castillia Henry grew up at 90½ Queen Street in New Bern. His father worked as a drayman, porter and stevedore, and Castillia worked as a barber alongside his brother Amos.',
      'He was inducted at New Bern on 1 April 1918, trained at Camp Grant, Illinois, and sailed for France on the Agamemnon. He was killed in action one day before the war ended.',
    ],
    sources: [
      { label: 'New Bern Historical Society, “This Month in New Bern, November 2019”', url: 'https://newbernhistorical.org/?p=12981' },
      { label: 'New Bern Magazine, “This Month in New Bern History”', url: 'https://www.newbernmagazine.com/this-month-in-new-bern-history-17/' },
    ],
  },
];

/** The memorial's words that are not about one soldier. */
export const MEMORIAL_TEXT = {
  title: 'The Memorial',
  intro: 'Eleven American servicemen of the Great War, on cards like the take-away cards at the installation. Turn a card to read his story.',
  cardsHeading: 'Soldier cards',
  poppyHeading: 'Place a poppy',
  poppyIntro: 'Place a poppy in the field. Each one is placed by a visitor to the Mini Museum.',
  silenceHeading: 'The silence at 11:00',
  silenceLine: 'At 11:00 on November 11, people pause in silence to remember.',
};
