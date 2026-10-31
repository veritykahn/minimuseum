import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * Good microscope practice: the room's tips, from outside the posters, each
 * set as a museum note with its source (a microscope maker's guide, a
 * university imaging centre, university science-education pages). Short, for
 * children, and no further than the source says.
 *
 *   wipe        Olympus, "Cleaning and Maintenance": dust and dirt "can
 *               sometimes be seen during observation and may affect image
 *               quality"; "clean each specimen slide both before and after
 *               observation"; for routine cleaning, "a soft cloth, gauze, or
 *               piece of lens tissue".
 *   lowFirst    Skyline College (LibreTexts), Human Anatomy Lab 1.5: "always
 *               start with the lowest objective"; University of Queensland
 *               IMB quick reference: bring the sample into focus, "Now you can
 *               switch to whichever objective you'd like to use."
 *   total       Science Learning Hub, University of Waikato, "How microscopes
 *               magnify": multiply the powers of the objective and the
 *               eyepiece, "10 x 40 = total magnification of 400x".
 *   parfocal    Nikon, glossary, "parfocality": swap in another lens of the
 *               set and the object "will remain largely in-focus".
 *   field       Nikon, glossary, "field of view": the field of view is the
 *               field number divided by the objective's magnification.
 */

const OLYMPUS_CLEANING = {
  label: 'Olympus, Cleaning and Maintenance',
  href: 'https://adobeassets.evidentscientific.com/content/dam/pdf/file/landing-directory/microscope-maintenance/MicroscopeMaintenance_Cleaning_Maintenance2020_04_12_Web.pdf',
};

export const PRACTICE = {
  wipe: {
    text: 'Dust and dirt on a slide can show up when you look down a microscope, and spoil the picture. Microscope makers say to wipe each slide clean with a soft cloth before you look.',
    sources: [OLYMPUS_CLEANING],
  },
  lowFirst: {
    text: 'Scientists focus with the lowest-power lens first. Then they turn to a stronger lens.',
    sources: [
      { label: 'Skyline College (LibreTexts)', href: 'https://bio.libretexts.org/Bookshelves/Human_Biology/Human_Anatomy_Lab/01%3A_Overview_and_the_Microscope/1.05%3A_The_Parts_of_a_Compound_Microscope_and_How_To_Handle_Them_Correctly' },
      { label: 'University of Queensland', href: 'https://imb.uq.edu.au/files/5285/BF-DFQuickReference.pdf' },
    ],
  },
  total: {
    text: 'To find how much a microscope magnifies, multiply the eyepiece by the objective lens: a 10× eyepiece and a 40× lens make 400×.',
    sources: [{ label: 'Science Learning Hub, University of Waikato', href: 'https://www.sciencelearn.org.nz/resources/496-light-microscopes' }],
  },
  parfocal: {
    text: 'A microscope’s lenses are made so the slide stays nearly in focus when you swap one for another. A small turn of the focus knob makes it sharp again.',
    sources: [{ label: 'Nikon', href: 'https://www.microscope.healthcare.nikon.com/resources/glossary/parfocality' }],
  },
  field: {
    text: 'The stronger the lens, the smaller the part of the slide you can see. Move the slide to look around it.',
    sources: [{ label: 'Nikon', href: 'https://www.microscope.healthcare.nikon.com/resources/glossary/field-of-view' }],
  },
} satisfies Record<string, ApprovedFact>;
