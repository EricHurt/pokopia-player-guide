import type { HomeContent } from '../../types/article';

export const homePage: HomeContent = {
  title: 'Pokopia Player Guide',
  description: 'Fan-made guides for players who want to progress and master habitats.',
  intro: [
    'Welcome! This site is a fan project to help Pokopia players learn the game. It is not official — you and your family can replace this text with real tips as you play.',
    'Everything you read here is defined in TypeScript files under src/data/. Change the words there, save, and refresh the site.',
  ],
  sectionsHeading: 'What you will find here',
  featureLinks: [
    {
      href: '/progression/getting-started',
      label: 'Progression',
      blurb: 'How to move forward early and mid-game (fill in from your experience).',
    },
    {
      href: '/pokemon',
      label: 'Pokémon',
      blurb: 'Catalog and detail pages powered by TypeScript data modules.',
    },
    {
      href: '/habitats/basics',
      label: 'Habitats',
      blurb:
        'How you build and improve homes for your team — plus the blueprint catalog for layout ideas.',
    },
  ],
  forBuildersHeading: 'For young builders',
  forBuildersParagraphs: [
    'Open src/data/copy/ and src/data/*.ts in the editor. Those files are plain TypeScript objects: strings, lists, and types you can extend.',
    'When you are ready, a parent can help put the site on the internet for free using the steps in README.md.',
  ],
};
