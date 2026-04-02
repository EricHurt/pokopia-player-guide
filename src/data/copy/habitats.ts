import type { Article } from '../../types/article';

export const habitatBasicsArticle: Article = {
  title: 'Habitat basics',
  description: 'How habitats work and how to lay them out.',
  sections: [
    {
      heading: 'Building blocks',
      paragraphs: [
        'Explain the pieces players use: tiles, decor, limits. For screenshots later, put images in src/assets/ and add an image block type to src/types/article.ts when you need it.',
      ],
    },
    {
      heading: 'Good layouts',
      paragraphs: [
        'Describe two or three example layouts: compact, balanced, late-game. Sketch ideas in bullet lists below when you are ready.',
      ],
      bullets: [
        'Compact: (add your notes)',
        'Balanced: (add your notes)',
        'Late-game: (add your notes)',
      ],
    },
  ],
};

export const habitatUpgradesArticle: Article = {
  title: 'Upgrades and progression',
  description: 'How habitats improve over time.',
  sections: [
    {
      heading: 'Unlock order',
      paragraphs: [
        'List what unlocks when, as you learn it in-game. Compare optional upgrades versus must-have ones in separate paragraphs or bullets.',
      ],
    },
    {
      heading: 'Resource costs',
      paragraphs: [
        'Track costs in structured data later (e.g. extend HabitatBlueprint in src/types/game.ts with a costs field) so you can render tables from TypeScript.',
      ],
    },
  ],
};
