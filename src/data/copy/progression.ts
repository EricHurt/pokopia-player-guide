import type { Article } from '../../types/article';

export const gettingStartedArticle: Article = {
  title: 'Getting started',
  description: 'First steps in Pokopia — replace with your own notes.',
  sections: [
    {
      heading: 'Goal of this page',
      paragraphs: [
        'Explain what brand-new players should do first. Edit src/data/copy/progression.ts after you play and write what actually worked.',
      ],
    },
    {
      heading: 'Suggested outline (delete and rewrite)',
      ordered: [
        'What to do in the first session',
        'Common mistakes to avoid',
        'Where to go next — see Early game tips',
      ],
      tip: 'Add new fields to TextSection in src/types/article.ts when you need tables, images, or other blocks.',
    },
  ],
};

export const earlyGameArticle: Article = {
  title: 'Early game tips',
  description: 'Ideas for the first hours — customize for real Pokopia strategies.',
  sections: [
    {
      heading: 'Resources and goals',
      paragraphs: [
        'List the resources players earn early and what to spend them on. Name important items or currencies in this paragraph so readers can search for them.',
      ],
    },
    {
      heading: 'Checklist',
      checklist: [
        { done: false, text: 'Unlock or build your first …' },
        { done: false, text: 'Meet your first …' },
        { done: false, text: 'Upgrade …' },
      ],
      paragraphs: ['Update the checklist in progression.ts as the game changes. Set done: true when you want a box pre-checked.'],
    },
  ],
};
