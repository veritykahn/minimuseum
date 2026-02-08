'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ContentItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  position?: string;
  effect?: string;
  special?: string;
  items?: string[];
  artworkTitle?: string;
  artworkArtist?: string;
  artworkDate?: string;
  artworkDescription?: string;
};

// ============================================
// POSTER 1: The Great Migration & The Harlem Renaissance
// ============================================
const poster1Content: ContentItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster1-title1.jpg',
    alt: 'The Great Migration And',
    effect: 'kenburns-in',
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
    effect: 'split-reveal',
    special: 'train-journey'
  },
  {
    type: 'paragraph',
    text: 'Between 1916 and 1940, more than one million Black Americans fled the South. They boarded trains in Mississippi, Alabama, Georgia, and Louisiana — leaving behind sharecropping, Jim Crow, and white supremacist violence. They followed rumors of factory jobs and real wages to Chicago, Detroit, Cleveland, and Philadelphia. And they poured into a fifteen-block neighborhood at the northern tip of Manhattan called Harlem.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'train-journey'
  },
  {
    type: 'paragraph',
    text: 'By 1920, Harlem had 175,000 Black residents — the largest concentration of Black Americans in the United States. They came from Southern farms and Caribbean colonies, from African nations and Northern cities. They found desperate factory workers, immigrants from Jamaica deskside with migrants from Georgia. A self-contained Black world emerged: Black-owned businesses, churches, newspapers, and social clubs that catered to a community that lasted thousands.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'train-journey'
  },
  {
    type: 'paragraph',
    text: 'What happened next would reshape American culture forever.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'The Literary Renaissance',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'The writers came first — or at least, they got the credit. Langston Hughes arrived from Missouri and became the movement\'s poet laureate, capturing Harlem\'s rhythms in collections like The Weary Blues (1926) and Fine Clothes to the Jew (1927). Zora Neale Hurston came from Florida, trained as an anthropologist, and transformed Black Southern folk culture into novels like Their Eyes Were Watching God (1937). Claude McKay, born in Jamaica, wrote the defiant poem "If We Must Die" and the novel Home to Harlem (1928).',
    position: 'top-left',
    effect: 'fade-in',
    special: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'Countee Cullen crafted formal verse that proved Black poets could master European forms while exploring Black themes. Nella Larsen examined the painful complexities of racial identity in Quicksand (1928) and Passing (1929). Jean Toomer\'s experimental Cane (1923) blended poetry and prose into something entirely new.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'Behind them stood editors and organizers. W.E.B. Du Bois published The Crisis, the NAACP\'s magazine, showcasing new voices. Charles S. Johnson edited Opportunity for the Urban League and organized dinners that introduced Black writers to white publishers. Jessie Fauset, literary editor of The Crisis, discovered and nurtured Langston Hughes and many others. Alain Locke compiled the anthology The New Negro (1925), which became the movement\'s manifesto.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'ink-spread'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/aspiration.jpg',
    alt: 'Aspiration by Aaron Douglas, 1936',
    artworkTitle: 'Aspiration',
    artworkArtist: 'Aaron Douglas',
    artworkDate: '1936',
    artworkDescription: 'One of his most iconic murals, originally painted for the Texas Centennial Exposition. It depicts figures rising above broken chains, pointing toward a city on the horizon — symbolizing African American aspiration and progress.',
    special: 'art-deco-rays'
  },
  {
    type: 'section-title',
    text: 'Art, Theater, and Beyond',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'art-deco-rays'
  },
  {
    type: 'paragraph',
    text: 'Aaron Douglas painted bold geometric murals that fused African aesthetics with Art Deco modernism — his work appeared in books, magazines, and on the walls of Harlem\'s public buildings. Augusta Savage sculpted busts of Black leaders and mentored younger artists in her Harlem studio. James Van Der Zee photographed weddings, funerals, and everyday moments with dignity and artistry, creating a visual archive of Black life.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'art-deco-rays'
  },
  {
    type: 'paragraph',
    text: 'On stage, the Blackbirds revues brought Black performers to Broadway — Bill "Bojangles" Robinson, Adelaide Hall, Ethel Waters, the Nicholas Brothers. Shuffle Along (1921), with music by Eubie Blake and Noble Sissle, was the first major Broadway musical written and performed entirely by Black Americans. Paul Robeson brought Shakespeare to Harlem and spirituals to concert halls worldwide. Josephine Baker conquered Paris with her dancing and never really came back.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'art-deco-rays'
  },
  {
    type: 'section-title',
    text: 'The Sound of Harlem',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'jazz-swing'
  },
  {
    type: 'paragraph',
    text: 'The music was everywhere — in speakeasies and ballrooms, at rent parties and fancy clubs. Duke Ellington held court at the Cotton Club on Lenox Avenue, broadcasting his sophisticated compositions to radio audiences nationwide. His band included giants: Bubber Miley on trumpet, Johnny Hodges on saxophone, "Tricky Sam" Nanton on trombone. Louis Armstrong revolutionized jazz with recordings like "West End Blues" (1928), transforming the music from collective improvisation into a vehicle for individual genius.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'jazz-swing'
  },
  {
    type: 'paragraph',
    text: 'Bessie Smith — the Empress of the Blues — recorded over 150 songs for Columbia Records, her voice so powerful it barely fit on wax. Fletcher Henderson\'s orchestra pioneered big band swing. Cab Calloway brought theatrical flair and scat singing to the masses. Ethel Waters crossed from blues into Broadway and Hollywood.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'jazz-swing'
  },
  {
    type: 'paragraph',
    text: 'The Savoy Ballroom on Lenox Avenue — integrated, unlike the Cotton Club — held 4,000 dancers on its block-long floor. The Lindy Hop was born there. Small\'s Paradise on 135th Street featured waiters who danced the Charleston while carrying trays. Rent parties — informal gatherings where tenants charged admission to raise money for rent — featured stride pianists like Fats Waller and James P. Johnson playing until dawn.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'jazz-swing'
  },
  {
    type: 'section-title',
    text: 'The End and the Beginning',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'The stock market crashed in 1929. The Great Depression devastated Harlem — by 1935, unemployment reached 50 percent. White patrons stopped coming uptown. Publishers lost interest in Black writers. The Harlem Renaissance as a concentrated movement was over by the mid-1930s.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'But its impact endured. The writers, artists, and musicians of the Harlem Renaissance proved that Black Americans could produce work equal to anything in the world. They created institutions — magazines, publishing connections, artistic networks — that supported Black creativity for generations. The confidence they instilled, the pride they demonstrated, the excellence they demanded laid the foundation for the Civil Rights Movement that would transform America.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'quote',
    text: 'The trains that carried those migrants north carried more than people. They carried the seeds of a revolution.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'link',
    text: 'Explore More: A New African American Identity — National Museum of African American History and Culture',
    url: 'https://nmaahc.si.edu/explore/stories/new-african-american-identity-harlem-renaissance'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// POSTER 2: Walter White — The Civil Rights Hero You've Never Heard Of
// ============================================
const poster2Content: ContentItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster2-title1.jpg',
    alt: 'Walter White',
    effect: 'drift',
    special: 'width'
  },
  {
    type: 'title-image',
    src: '/exhibitions/harlem/poster2-title2.jpg',
    alt: 'The Civil Rights Hero You\'ve Never Heard Of',
    effect: 'drift',
    special: 'width'
  },
  {
    type: 'paragraph',
    text: 'He had blond hair, blue eyes, and skin so fair that strangers assumed he was white. He was also one of the most important Black leaders of the twentieth century.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'dual-identity'
  },
  {
    type: 'section-title',
    text: 'The Man No One Suspected',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'dual-identity'
  },
  {
    type: 'paragraph',
    text: 'Walter Francis White was born in Atlanta in 1893 into a middle-class Black family — his father was a mail carrier, his mother a former teacher. Both parents were light-skinned, descended from mixed-race unions that stretched back to slavery. In the rigid racial classifications of the American South, the White family was legally, socially, and culturally Black. But to anyone who didn\'t know the family, Walter looked like just another white boy.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'dual-identity'
  },
  {
    type: 'paragraph',
    text: 'He could have disappeared into whiteness as many light-skinned Black Americans did, "passing" into white society to escape Jim Crow, access better jobs and live without the constant weight of racism. "Passing" as white meant safety. But it also meant abandoning one\'s family, community, identity.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'dual-identity'
  },
  {
    type: 'paragraph',
    text: 'Walter White chose differently.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'The Night Everything Changed',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'harlem-night'
  },
  {
    type: 'paragraph',
    text: 'In September 1906, when Walter was thirteen, a white mob rampaged through Atlanta. Fueled by inflammatory newspaper headlines about alleged Black crimes, thousands of white men attacked Black neighborhoods, beating and killing Black residents and destroying Black businesses. At least twenty-five Black people died, although it was likely many more.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'harlem-night'
  },
  {
    type: 'paragraph',
    text: 'The mob approached the White family home. Walter\'s father armed himself and prepared to defend the house. The family waited in darkness, listening to the violence outside. The mob passed by — possibly because the house looked like it belonged to a white family. But White never forgot that night.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'harlem-night'
  },
  {
    type: 'paragraph',
    text: '"I knew then who I was," he wrote decades later. "I was a Negro, a human being with an invisible pigmentation which marked me a person to be hunted."',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'harlem-night'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/poster2-photograph.jpg',
    alt: 'Walter Francis White, photograph by Clara Sipprell',
    artworkTitle: 'Walter Francis White',
    artworkArtist: 'Clara Sipprell',
    artworkDate: 'c. 1940',
    artworkDescription: 'Gelatin silver print. Civil rights leader and executive secretary of the NAACP from 1931 to 1955. National Portrait Gallery, Washington D.C.',
  },
  {
    type: 'section-title',
    text: 'The NAACP\'s Secret Weapon',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'In 1918, the NAACP hired White as an investigator. His job: travel to Southern towns where Black Americans had been killed by mobs, gather evidence, and report back to the nation. His appearance made him the perfect spy.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'White would arrive in a town days after racial violence, posing as a white journalist or businessman. He interviewed sheriffs, politicians, and ordinary white citizens — people who spoke freely, even boasted, about what had been done to Black residents. They never suspected that the fair-skinned stranger was gathering evidence against them.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Over twelve years, White personally investigated forty-one killings and eight race riots. He traveled to Arkansas after the Elaine massacre of 1919, where white mobs murdered hundreds of Black sharecroppers. He investigated violence in Florida, Texas, Georgia, and throughout the South. The evidence he gathered helped expose the reality of racial terror to national and international audiences.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'But it was extraordinarily dangerous work. More than once, White\'s identity was discovered and he had to flee. In Arkansas, he escaped just ahead of a mob that had learned who he really was, boarding a departing train with only minutes to spare.',
    position: 'center',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'Witness Turned Author',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'White channeled what he witnessed into literature. His first novel, The Fire in the Flint (1924), tells the story of Kenneth Harper, a Black doctor educated in the North who returns to his Georgia hometown determined to help his community. The novel ends with Harper\'s death at the hands of a white mob. White wrote the entire manuscript in twelve days. Every detail came from his investigations.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'His second novel, Flight (1926), explored the agonizing choice of passing while his nonfiction book Rope and Faggot: A Biography of Judge Lynch (1929) analyzed the causes and psychology of mob violence. Beyond his own writing, White championed other Harlem Renaissance authors. He introduced Langston Hughes to publishers and promoted Claude McKay, Countee Cullen, and many others. His Harlem apartment became a gathering place for writers, artists, and intellectuals.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'ink-spread'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/harlem/creation.jpg',
    alt: 'The Creation by Aaron Douglas, 1927',
    artworkTitle: 'The Creation',
    artworkArtist: 'Aaron Douglas',
    artworkDate: '1927',
    artworkDescription: 'From his series of illustrations for James Weldon Johnson\'s book God\'s Trombones: Seven Negro Sermons in Verse. Douglas\'s signature style — silhouetted figures bathed in concentric circles of light — became the defining visual language of the Harlem Renaissance.',
  },
  {
    type: 'section-title',
    text: 'Twenty-Four Years at the Helm',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'In 1931, White became executive secretary of the NAACP — the organization\'s top position. He held it for twenty-four years, through the Great Depression, World War II, and the early Civil Rights era. Under his leadership, the NAACP pursued legal challenges to segregation. White lobbied presidents — Roosevelt, Truman, Eisenhower — for civil rights legislation, pushed for federal anti-lynching laws, though Southern senators blocked them repeatedly, and advocated for desegregation of the military, which Truman finally ordered in 1948.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'White was, for a quarter century, one of the most prominent Black leaders in America — a man who looked white but never wavered in his identity.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'Forgotten Hero',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'Walter F. White died in 1955, just months after the Supreme Court\'s Brown v. Board of Education decision began dismantling legal segregation. And then America forgot him.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'White\'s death came at the worst possible moment for his legacy. History remembers the marches, the speeches, the confrontations of the 1960s. It is not so good at remembering the people who laid the ground those moments stood on. White\'s decades of legal strategy, political lobbying, and undercover investigation didn\'t look like the activism that came next, and a younger generation of leaders viewed his incremental, institution-building approach as too cautious, too slow.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'His appearance made it worse. A Black leader who looked white unsettled people on all sides — too Black for white America, too white-looking for a movement increasingly defined by visible solidarity. A late-life personal scandal — his 1949 divorce and remarriage to a white South African woman — alienated colleagues and community members alike and by the time the civil rights story was being written, White had slipped out of it.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Despite this, Walter White is arguably one of the most influential leaders in American history, transforming the NAACP into a powerhouse for civil rights.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'link',
    text: 'Watch: Forgotten Hero — Walter White and the NAACP (PBS)',
    url: 'https://www.pbs.org/wgbh/americanexperience/features/forgotten-hero-walter-white-and-naacp-trailer/'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// HELPER COMPONENTS
// ============================================

const TypewriterText = ({ text, color }: { text: string; onComplete?: () => void; color: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [currentIndex, text]);

  return (
    <span style={{ color }}>
      {displayedText}
      <span className="hr-typewriter-cursor">|</span>
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function HarlemRenaissance() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'poster1' | 'poster2'>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const currentPosterContent = activeView === 'poster1' ? poster1Content : poster2Content;

  const handleBack = () => {
    router.push('/exhibitions/first-floor');
  };

  const openPoster = (poster: 'poster1' | 'poster2') => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView(poster);
      setPosterStep(0);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
    }, 300);
  };

  const nextStep = () => {
    if (posterStep < currentPosterContent.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep + 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  };

  const prevStep = () => {
    if (posterStep > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep - 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  };

  const returnToMain = () => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView('main');
      setPosterStep(0);
      setFadeIn(true);
    }, 300);
  };

  const currentItem = currentPosterContent[posterStep];
  const isPoster1 = activeView === 'poster1';

  // Colors — drawn from the poster palettes
  const poster1Cream = '#efd9b4';
  const poster1Purple = '#714985';
  const poster2Sage = '#ced5bc';
  const poster2Slate = '#696f7f';
  const lavender = '#b485d2';

  const bgColor = isPoster1 ? poster1Purple : poster2Slate;
  const textColor = isPoster1 ? poster1Cream : poster2Sage;

  // Per-section color palette
  const getSectionColors = (special?: string) => {
    if (isPoster1) {
      switch (special) {
        case 'train-journey': return { title: '#efd9b4', text: '#efd9b4' }; // cream/gold
        case 'ink-spread': return { title: '#d992ba', text: '#efd9b4' }; // pink titles
        case 'art-deco-rays': return { title: '#efd9b4', text: '#b195a4' }; // dusty mauve text
        case 'jazz-swing': return { title: '#d992ba', text: '#efd9b4' }; // pink titles, cream text
        default: return { title: '#efd9b4', text: '#efd9b4' };
      }
    } else {
      switch (special) {
        case 'dual-identity': return { title: '#b485d2', text: '#ced5bc' }; // lavender titles
        case 'harlem-night': return { title: '#b485d2', text: '#ced5bc' }; // lavender titles
        case 'ink-spread': return { title: '#ced5bc', text: '#9298a8' }; // blue-gray text
        default: return { title: '#ced5bc', text: '#ced5bc' };
      }
    }
  };

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'hr-pos-top-left';
      case 'top-right': return 'hr-pos-top-right';
      case 'bottom-left': return 'hr-pos-bottom-left';
      case 'bottom-right': return 'hr-pos-bottom-right';
      case 'bottom-center': return 'hr-pos-bottom-center';
      case 'full-width': return 'hr-pos-full-width';
      default: return 'hr-pos-center';
    }
  };

  // Effect classes
  const getEffectClass = (effect?: string) => {
    switch(effect) {
      case 'blur-to-sharp': return 'hr-effect-blur-sharp';
      case 'split-reveal': return 'hr-effect-split-reveal';
      case 'fade-in': return 'hr-effect-fade-in';
      case 'ink-spread': return 'hr-effect-ink-spread';
      default: return '';
    }
  };

  // Special classes
  const getSpecialClass = (special?: string) => {
    if (!special) return '';
    const classes: string[] = [];
    if (special === 'train-journey') classes.push('hr-train-journey');
    if (special === 'ink-spread') classes.push('hr-ink-spread-bg');
    if (special === 'art-deco-rays') classes.push('hr-art-deco-rays');
    if (special === 'jazz-swing') classes.push('hr-jazz-swing');
    if (special === 'dual-identity') classes.push('hr-dual-identity');
    if (special === 'harlem-night') classes.push('hr-harlem-night');
    return classes.join(' ');
  };

  return (
    <div style={{ background: activeView === 'main' ? '#0a0a0a' : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* ============================================
           NAVIGATION
           ============================================ */
        .hr-nav {
          position: fixed;
          top: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hr-nav-left { left: 32px; }
        .hr-nav-right { right: 32px; }
        .hr-nav:hover .hr-nav-label { opacity: 1; max-width: 150px; }
        .hr-nav:hover .hr-nav-arrow-left { transform: translateX(-4px); }
        .hr-nav:hover .hr-nav-arrow-right { transform: translateX(4px); }
        .hr-nav-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .hr-nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .hr-nav-label {
          font-size: 13px;
          font-style: italic;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* ============================================
           TYPEWRITER
           ============================================ */
        @keyframes hrBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .hr-typewriter-cursor {
          animation: hrBlink 0.8s infinite;
          margin-left: 2px;
        }

        /* ============================================
           BASE ANIMATIONS
           ============================================ */
        @keyframes hrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hr-effect-fade-in {
          animation: hrFadeIn 0.8s ease forwards;
        }

        @keyframes hrBlurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .hr-effect-blur-sharp {
          animation: hrBlurToSharp 1.2s ease forwards;
        }

        @keyframes hrSplitReveal {
          from { clip-path: inset(0 50% 0 50%); opacity: 0; }
          to { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .hr-effect-split-reveal {
          animation: hrSplitReveal 0.8s ease forwards;
        }

        @keyframes hrInkSpread {
          from { filter: blur(3px); opacity: 0; letter-spacing: 0.08em; }
          to { filter: blur(0); opacity: 1; letter-spacing: normal; }
        }
        .hr-effect-ink-spread {
          animation: hrInkSpread 1.4s ease forwards;
        }

        @keyframes hrKenburnIn {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .hr-effect-kenburns-in {
          animation: hrKenburnIn 8s ease forwards;
        }

        @keyframes hrDrift {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .hr-effect-drift {
          animation: hrDrift 6s ease-in-out infinite;
        }

        /* ============================================
           EFFECT 1: TRAIN JOURNEY — Migration sections
           Horizontal scrolling lines + gentle rocking
           ============================================ */
        .hr-train-journey {
          position: relative;
          overflow: hidden;
        }
        .hr-train-journey::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 60px,
            rgba(113, 73, 133, 0.06) 60px,
            rgba(113, 73, 133, 0.06) 62px
          );
          animation: hrTrainScroll 2s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        .hr-train-journey::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -100%;
          width: 300%;
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            rgba(239, 217, 180, 0.15) 0px,
            rgba(239, 217, 180, 0.15) 40px,
            transparent 40px,
            transparent 60px
          );
          animation: hrTrackScroll 1.5s linear infinite;
          z-index: 0;
        }
        @keyframes hrTrainScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(62px); }
        }
        @keyframes hrTrackScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
        .hr-train-journey .hr-section-title-text,
        .hr-train-journey .hr-paragraph-text {
          animation: hrTrainRock 3s ease-in-out infinite;
        }
        @keyframes hrTrainRock {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }

        /* ============================================
           EFFECT 2: ART DECO RAYS — Aaron Douglas inspired
           Geometric radiating sunburst pattern
           ============================================ */
        .hr-art-deco-rays {
          position: relative;
          overflow: hidden;
        }
        .hr-art-deco-rays::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(113, 73, 133, 0.08) 10deg,
            transparent 20deg,
            rgba(217, 146, 186, 0.06) 30deg,
            transparent 40deg,
            rgba(113, 73, 133, 0.08) 50deg,
            transparent 60deg,
            rgba(217, 146, 186, 0.06) 70deg,
            transparent 80deg,
            rgba(113, 73, 133, 0.08) 90deg,
            transparent 100deg,
            rgba(217, 146, 186, 0.06) 110deg,
            transparent 120deg
          );
          animation: hrRaysRotate 40s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        .hr-art-deco-rays::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(239, 217, 180, 0.08) 0%,
            rgba(239, 217, 180, 0.04) 30%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
          animation: hrRaysPulse 4s ease-in-out infinite;
        }
        @keyframes hrRaysRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes hrRaysPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }

        /* Concentric circle decorations */
        .hr-deco-circle {
          position: fixed;
          border-radius: 50%;
          border: 1px solid rgba(113, 73, 133, 0.12);
          pointer-events: none;
          z-index: 1;
        }
        .hr-deco-circle-1 {
          width: 200px; height: 200px;
          top: 20%; left: 8%;
          animation: hrCircleFloat 6s ease-in-out infinite;
        }
        .hr-deco-circle-2 {
          width: 120px; height: 120px;
          bottom: 25%; right: 12%;
          animation: hrCircleFloat 5s ease-in-out infinite reverse;
        }
        .hr-deco-circle-3 {
          width: 80px; height: 80px;
          top: 60%; left: 15%;
          border-color: rgba(217, 146, 186, 0.1);
          animation: hrCircleFloat 7s ease-in-out infinite;
          animation-delay: -2s;
        }
        @keyframes hrCircleFloat {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        /* ============================================
           EFFECT 3: JAZZ SWING — Music sections
           Warm amber glow with swaying rhythm
           ============================================ */
        .hr-jazz-swing {
          position: relative;
          overflow: hidden;
        }
        .hr-jazz-swing::before {
          content: '';
          position: absolute;
          inset: -20%;
          background: radial-gradient(
            ellipse at 40% 50%,
            rgba(239, 217, 180, 0.1) 0%,
            transparent 60%
          );
          animation: hrJazzGlow 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .hr-jazz-swing::after {
          content: '';
          position: absolute;
          inset: -20%;
          background: radial-gradient(
            ellipse at 70% 60%,
            rgba(180, 133, 210, 0.08) 0%,
            transparent 50%
          );
          animation: hrJazzGlow 5s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes hrJazzGlow {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          33% { transform: translate(15px, -10px); opacity: 1; }
          66% { transform: translate(-10px, 5px); opacity: 0.8; }
        }
        .hr-jazz-swing .hr-section-title-text {
          animation: hrSwingText 3s ease-in-out infinite;
        }
        .hr-jazz-swing .hr-paragraph-text {
          animation: hrSwingText 4s ease-in-out infinite;
          animation-delay: -1s;
        }
        @keyframes hrSwingText {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.3deg); }
          75% { transform: rotate(-0.3deg); }
        }

        /* Jazz note particles */
        .hr-jazz-note {
          position: fixed;
          font-size: 24px;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: hrNoteFloat 6s ease-in-out infinite;
        }
        .hr-jazz-note-1 { top: 15%; left: 8%; animation-delay: 0s; }
        .hr-jazz-note-2 { top: 70%; right: 10%; animation-delay: -2s; font-size: 18px; }
        .hr-jazz-note-3 { top: 40%; right: 5%; animation-delay: -4s; font-size: 20px; }
        @keyframes hrNoteFloat {
          0%, 100% { opacity: 0; transform: translateY(0) rotate(0deg); }
          20% { opacity: 0.3; }
          50% { opacity: 0.2; transform: translateY(-30px) rotate(15deg); }
          80% { opacity: 0.3; }
        }

        /* ============================================
           EFFECT 4: DUAL IDENTITY — Walter White's passing theme
           Split light/dark background
           ============================================ */
        .hr-dual-identity {
          position: relative;
          overflow: hidden;
        }
        .hr-dual-identity::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(240, 235, 225, 0.14) 46%,
            transparent 50%,
            rgba(15, 10, 30, 0.4) 54%,
            rgba(10, 5, 20, 0.45) 100%
          );
          animation: hrIdentityShift 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes hrIdentityShift {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.5; }
        }
        /* Text shadow that alternates between light and dark identity */
        .hr-dual-identity .hr-paragraph-text,
        .hr-dual-identity .hr-section-title-text {
          animation: hrIdentityText 6s ease-in-out infinite;
        }
        @keyframes hrIdentityText {
          0%, 100% { text-shadow: -2px 0 rgba(255, 255, 255, 0.25), 2px 0 rgba(10, 5, 20, 0.4); }
          50% { text-shadow: 2px 0 rgba(255, 255, 255, 0.25), -2px 0 rgba(10, 5, 20, 0.4); }
        }

        /* ============================================
           EFFECT 5: HARLEM NIGHT — Deep purple atmosphere
           Warm street-light glow against darkness
           ============================================ */
        .hr-harlem-night {
          position: relative;
          overflow: hidden;
        }
        .hr-harlem-night::before {
          content: '';
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(113, 73, 133, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(239, 217, 180, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(56, 26, 47, 0.15) 0%, transparent 70%);
          animation: hrNightPulse 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .hr-harlem-night::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(10, 5, 15, 0.4) 100%
          );
          pointer-events: none;
          z-index: 0;
        }
        @keyframes hrNightPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        /* ============================================
           EFFECT 6: INK SPREAD — Literary sections
           Calligraphic appearance with warm paper texture
           ============================================ */
        .hr-ink-spread-bg {
          position: relative;
        }
        .hr-ink-spread-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(239, 217, 180, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(239, 217, 180, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .hr-ink-spread-bg .hr-paragraph-text {
          text-shadow: 0 0 20px rgba(239, 217, 180, 0.1);
        }

        /* ============================================
           POSITIONS
           ============================================ */
        .hr-pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hr-pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .hr-pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .hr-pos-bottom-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .hr-pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .hr-pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hr-pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* ============================================
           MAIN EXHIBITION VIEW
           ============================================ */
        .hr-exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          gap: 60px;
        }

        .hr-exhibition-title { text-align: center; margin-bottom: 20px; }
        .hr-exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }
        .hr-exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: #b485d2;
        }

        .hr-exhibition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .hr-poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .hr-poster-frame:hover { transform: translateY(-8px); }
        .hr-poster-frame:hover .hr-poster-hint { opacity: 1; }
        .hr-poster-frame img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .hr-poster-hint {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7D8471;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hr-display-case {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          cursor: pointer;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .hr-display-case:hover {
          border-color: rgba(180, 133, 210, 0.3);
        }
        .hr-display-case:hover .hr-case-image {
          transform: scale(1.02);
        }

        .hr-case-image {
          width: 100%;
          max-width: 280px;
          height: auto;
          object-fit: contain;
          margin-bottom: 20px;
          transition: transform 0.4s ease;
        }
        .hr-case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 8px;
        }
        .hr-case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fafafa;
          margin-bottom: 8px;
        }
        .hr-case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: #b485d2;
        }

        /* ============================================
           WALKTHROUGH
           ============================================ */
        .hr-poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.4s ease;
          overflow: hidden;
        }
        .hr-poster-walkthrough.fade-out { opacity: 0; }

        .hr-walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        /* Full bleed images */
        .hr-full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Title shown full height (contain) — tall/vertical images */
        .hr-full-bleed-image.hr-title-height img {
          width: auto;
          height: 100%;
          max-height: 100vh;
          object-fit: contain;
        }
        /* Title shown full width (cover) — wide/horizontal images */
        .hr-full-bleed-image.hr-title-width img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        /* Full image (photographs etc) */
        .hr-full-bleed-image.hr-full-image img {
          max-width: 90%;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .hr-image-caption {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          opacity: 0.6;
          text-align: center;
          white-space: nowrap;
        }

        /* Text content wrapper */
        .hr-text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
        }

        /* Section title */
        .hr-section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          position: relative;
          z-index: 10;
        }

        /* Paragraph */
        .hr-paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
          position: relative;
          z-index: 10;
        }

        /* Quote */
        .hr-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          max-width: 700px;
          padding: 40px;
          border-left: 3px solid;
          position: relative;
          z-index: 10;
        }

        /* Link */
        .hr-content-link {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .hr-content-link:hover {
          background: #d992ba;
          color: #0a0a0a;
          border-color: #d992ba;
        }

        /* End button */
        .hr-content-end {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hr-content-end:hover {
          background: #b485d2;
          color: #0a0a0a;
          border-color: #b485d2;
        }

        /* ============================================
           ARTWORK DISPLAY — Full image + info alongside
           ============================================ */
        .hr-artwork-display {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 60px;
          position: relative;
        }
        .hr-artwork-image-side {
          flex: 1;
          max-width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hr-artwork-image-side img {
          max-height: 80vh;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: hrArtworkReveal 1.2s ease forwards;
        }
        @keyframes hrArtworkReveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .hr-artwork-info-side {
          flex: 1;
          max-width: 400px;
          position: relative;
          z-index: 10;
          animation: hrFadeIn 1s ease forwards 0.4s;
          opacity: 0;
        }
        .hr-artwork-info-side h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 300;
          font-style: italic;
          margin-bottom: 8px;
        }
        .hr-artwork-info-side .hr-artwork-meta {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0.7;
        }
        .hr-artwork-info-side .hr-artwork-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.8;
          opacity: 0.9;
        }

        /* ============================================
           WALKTHROUGH NAVIGATION
           ============================================ */
        .hr-walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .hr-nav-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        .hr-nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .hr-nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(180, 133, 210, 0.2);
        }

        .hr-step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          min-width: 50px;
          text-align: center;
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 900px) {
          .hr-exhibition-grid { grid-template-columns: 1fr; gap: 32px; }
          .hr-pos-top-left, .hr-pos-top-right { padding: 15vh 24px 15vh 24px; }
          .hr-pos-bottom-left, .hr-pos-bottom-right, .hr-pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
          .hr-artwork-display {
            flex-direction: column;
            padding: 60px 24px;
            gap: 32px;
          }
          .hr-artwork-image-side {
            max-width: 100%;
          }
          .hr-artwork-image-side img {
            max-height: 50vh;
          }
          .hr-artwork-info-side {
            max-width: 100%;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .hr-nav-left { left: 20px; top: 20px; }
          .hr-nav-right { right: 20px; top: 20px; }
          .hr-nav-text { font-size: 24px; }
          .hr-exhibition-main { padding: 100px 24px 60px; }
          .hr-walkthrough-nav { bottom: 20px; gap: 16px; }
          .hr-nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .hr-text-content-wrapper { padding: 100px 24px; }
        }
      `}</style>

      {/* ============================================
          NAVIGATION
          ============================================ */}
      <div
        className="hr-nav hr-nav-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
      >
        <span className="hr-nav-text" style={{ color: '#525252' }}>M</span>
        <span className="hr-nav-arrow hr-nav-arrow-left" style={{ color: '#7D8471' }}>&#8592;</span>
        <span className="hr-nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      {/* ============================================
          MAIN EXHIBITION VIEW
          ============================================ */}
      {activeView === 'main' && (
        <div className="hr-exhibition-main">
          <div className="hr-exhibition-title">
            <h1>The Harlem Renaissance</h1>
            <p>The Great Migration &amp; the Birth of a Cultural Revolution</p>
          </div>

          <div className="hr-exhibition-grid">
            <div className="hr-poster-frame" onClick={() => openPoster('poster1')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/harlem/poster1.jpg" alt="The Great Migration and The Harlem Renaissance" />
              <span className="hr-poster-hint">Click to explore</span>
            </div>

            <div className="hr-display-case">
              <p className="hr-case-label">Gallery I, Case 1</p>
              <p className="hr-case-title">Coming Soon</p>
              <p className="hr-case-subtitle">Display case in preparation</p>
            </div>

            <div className="hr-poster-frame" onClick={() => openPoster('poster2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/harlem/poster2.jpg" alt="Walter White: The Civil Rights Hero You've Never Heard Of" />
              <span className="hr-poster-hint">Click to explore</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          POSTER WALKTHROUGH VIEW
          ============================================ */}
      {(activeView === 'poster1' || activeView === 'poster2') && (
        <div className={`hr-poster-walkthrough ${fadeIn ? '' : 'fade-out'}`} key={animationKey}>
          <div className="hr-walkthrough-content">

            {/* Title Image — Full Bleed */}
            {currentItem.type === 'title-image' && (
              <div className={`hr-full-bleed-image ${currentItem.special === 'height' ? 'hr-title-height' : 'hr-title-width'} ${currentItem.effect === 'kenburns-in' ? 'hr-effect-kenburns-in' : ''} ${currentItem.effect === 'drift' ? 'hr-effect-drift' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt} />
              </div>
            )}

            {/* Full Image (photograph etc) */}
            {currentItem.type === 'full-image' && (
              <div className={`hr-full-bleed-image hr-full-image ${currentItem.effect === 'kenburns-in' ? 'hr-effect-kenburns-in' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt} />
                {currentItem.text && (
                  <span className="hr-image-caption" style={{ color: textColor }}>{currentItem.text}</span>
                )}
              </div>
            )}

            {/* Section Title */}
            {currentItem.type === 'section-title' && (
              <div className={`hr-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                {/* Art Deco decorative circles */}
                {currentItem.special === 'art-deco-rays' && (
                  <>
                    <div className="hr-deco-circle hr-deco-circle-1"></div>
                    <div className="hr-deco-circle hr-deco-circle-2"></div>
                    <div className="hr-deco-circle hr-deco-circle-3"></div>
                  </>
                )}
                {/* Jazz notes */}
                {currentItem.special === 'jazz-swing' && (
                  <>
                    <span className="hr-jazz-note hr-jazz-note-1">&#9835;</span>
                    <span className="hr-jazz-note hr-jazz-note-2">&#9834;</span>
                    <span className="hr-jazz-note hr-jazz-note-3">&#9833;</span>
                  </>
                )}
                <h2
                  className={`hr-section-title-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: getSectionColors(currentItem.special).title }}
                >
                  {currentItem.text}
                </h2>
              </div>
            )}

            {/* Paragraph */}
            {currentItem.type === 'paragraph' && currentItem.text && (
              <div className={`hr-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                {/* Art Deco decorative circles */}
                {currentItem.special === 'art-deco-rays' && (
                  <>
                    <div className="hr-deco-circle hr-deco-circle-1"></div>
                    <div className="hr-deco-circle hr-deco-circle-2"></div>
                    <div className="hr-deco-circle hr-deco-circle-3"></div>
                  </>
                )}
                {/* Jazz notes */}
                {currentItem.special === 'jazz-swing' && (
                  <>
                    <span className="hr-jazz-note hr-jazz-note-1">&#9835;</span>
                    <span className="hr-jazz-note hr-jazz-note-2">&#9834;</span>
                    <span className="hr-jazz-note hr-jazz-note-3">&#9833;</span>
                  </>
                )}
                <p
                  className={`hr-paragraph-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: getSectionColors(currentItem.special).text }}
                >
                  {currentItem.text}
                </p>
              </div>
            )}

            {/* Artwork Display — Full image with info alongside */}
            {currentItem.type === 'artwork-display' && (
              <div className={`hr-artwork-display ${getSpecialClass(currentItem.special)}`}>
                {/* Art Deco decorative circles for Aspiration */}
                {currentItem.special === 'art-deco-rays' && (
                  <>
                    <div className="hr-deco-circle hr-deco-circle-1"></div>
                    <div className="hr-deco-circle hr-deco-circle-2"></div>
                    <div className="hr-deco-circle hr-deco-circle-3"></div>
                  </>
                )}
                <div className="hr-artwork-image-side">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
                <div className="hr-artwork-info-side" style={{ color: textColor }}>
                  <h3>{currentItem.artworkTitle}</h3>
                  <p className="hr-artwork-meta">
                    {currentItem.artworkArtist}, {currentItem.artworkDate}
                  </p>
                  <p className="hr-artwork-desc">
                    {currentItem.artworkDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Quote */}
            {currentItem.type === 'quote' && currentItem.text && (
              <div className="hr-text-content-wrapper hr-pos-center">
                <blockquote
                  className={`hr-quote-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: isPoster1 ? '#d992ba' : '#b485d2', borderColor: isPoster1 ? '#885a99' : '#4e568f' }}
                >
                  {currentItem.text}
                </blockquote>
              </div>
            )}

            {/* Link */}
            {currentItem.type === 'link' && (
              <div className="hr-text-content-wrapper hr-pos-center">
                <a
                  href={currentItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hr-content-link"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </a>
              </div>
            )}

            {/* End */}
            {currentItem.type === 'end' && (
              <div className="hr-text-content-wrapper hr-pos-center">
                <button
                  className="hr-content-end"
                  onClick={returnToMain}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </button>
              </div>
            )}
          </div>

          {/* Walkthrough Navigation */}
          {currentItem.type !== 'end' && (
            <div className="hr-walkthrough-nav">
              <button
                className="hr-nav-arrow-btn"
                onClick={prevStep}
                disabled={posterStep === 0}
                style={{ color: textColor, borderColor: textColor }}
              >
                &#8592;
              </button>
              <span className="hr-step-indicator" style={{ color: textColor }}>
                {posterStep + 1} / {currentPosterContent.length}
              </span>
              <button
                className="hr-nav-arrow-btn"
                onClick={nextStep}
                disabled={posterStep === currentPosterContent.length - 1}
                style={{ color: textColor, borderColor: textColor }}
              >
                &#8594;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
