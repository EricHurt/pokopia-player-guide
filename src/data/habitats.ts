import type { HabitatBlueprint } from '../types/game';

export const habitatBlueprints: readonly HabitatBlueprint[] = [
  {
    id: 'bp-starter-nook',
    name: 'Starter nook',
    goal: 'Cheap first home with room to grow.',
    tier: 1,
    layoutNotes: [
      'One rest zone, one food spot, minimal decor.',
      'Leave a 2×2 gap for the first habitat expansion quest.',
    ],
  },
  {
    id: 'bp-balanced-grove',
    name: 'Balanced grove',
    goal: 'Mix comfort and training for nature-types.',
    tier: 2,
    layoutNotes: [
      'Ring the path with small plants; central training pad.',
      'Add a water feature only if your team has storm or water tags.',
    ],
  },
];
