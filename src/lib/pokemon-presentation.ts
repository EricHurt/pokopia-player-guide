/**
 * Visual theme for habitat scenes (first types string segment, e.g. "Fire / Flying" → fire).
 * Official artwork uses `nationalDex` from pokopia-dex.json (PokéAPI `pokemon.id`).
 */

export type HabitatVisualTheme =
  | 'grass'
  | 'fire'
  | 'water'
  | 'electric'
  | 'ice'
  | 'psychic'
  | 'dark'
  | 'rock'
  | 'fairy'
  | 'bug'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'fighting'
  | 'steel'
  | 'dragon'
  | 'ghost'
  | 'normal';

const FIRST_TYPE_MAP: Record<string, HabitatVisualTheme> = {
  Grass: 'grass',
  Fire: 'fire',
  Water: 'water',
  Electric: 'electric',
  Ice: 'ice',
  Psychic: 'psychic',
  Dark: 'dark',
  Rock: 'rock',
  Fairy: 'fairy',
  Bug: 'bug',
  Flying: 'flying',
  Poison: 'poison',
  Ground: 'ground',
  Fighting: 'fighting',
  Steel: 'steel',
  Dragon: 'dragon',
  Ghost: 'ghost',
  Normal: 'normal',
};

export function habitatThemeFromTypes(element: string): HabitatVisualTheme {
  const first = element.split('/')[0]?.trim() ?? '';
  return FIRST_TYPE_MAP[first] ?? 'grass';
}

const OFFICIAL_ART =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const SEREBII_POKOPIA_ART = 'https://www.serebii.net/pokemonpokopia/pokemon';

const SPECIES_ARTWORK_URL_BY_SLUG: Record<string, string> = {
  'shellos-east-sea': '/images/pokemon-art/shellos-east.png',
  'gastrodon-east-sea': '/images/pokemon-art/gastrodon-east.png',
  /** In-game–style Pokopia forms (Serebii Pokopia dex); not represented as separate IDs in PokéAPI official-artwork. */
  peakychu: `${SEREBII_POKOPIA_ART}/025-peakychu.png`,
  mosslax: `${SEREBII_POKOPIA_ART}/143-mosslax.png`,
  tangrowth: `${SEREBII_POKOPIA_ART}/465-professortangrowth.png`,
  smeargle: `${SEREBII_POKOPIA_ART}/235-smearguru.png`,
  tinkaton: `${SEREBII_POKOPIA_ART}/959-tinkmeister.png`,
};

/**
 * Official-style artwork from PokéAPI sprites (`nationalDex` = PokéAPI `pokemon.id`, not regional `dexNumber`).
 */
export function officialArtworkUrl(nationalDex?: number): string | null {
  if (nationalDex == null || !Number.isFinite(nationalDex) || nationalDex < 1) return null;
  return `${OFFICIAL_ART}/${nationalDex}.png`;
}

/** Artwork URL for catalog / detail (repo override, then official-artwork from `nationalDex`). */
export function speciesArtworkUrl(slug: string, nationalDex?: number): string | null {
  const fixed = SPECIES_ARTWORK_URL_BY_SLUG[slug];
  if (fixed) return fixed;
  return officialArtworkUrl(nationalDex);
}

const TYPE_PILL: Record<string, string> = {
  grass: 'type-grass',
  fire: 'type-fire',
  water: 'type-water',
  electric: 'type-electric',
  ice: 'type-ice',
  psychic: 'type-psychic',
  dark: 'type-dark',
  rock: 'type-rock',
  fairy: 'type-fairy',
  bug: 'type-bug',
  flying: 'type-flying',
  poison: 'type-poison',
  ground: 'type-ground',
  fighting: 'type-fighting',
  steel: 'type-steel',
  dragon: 'type-dragon',
  ghost: 'type-ghost',
  normal: 'type-normal',
};

/** CSS class for catalog type pill (e.g. `Grass` → `type-grass`). */
export function typeLabelToPillClass(label: string): string {
  const key = label.trim().toLowerCase();
  return TYPE_PILL[key] ?? 'type-normal';
}
