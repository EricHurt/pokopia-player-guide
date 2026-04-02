/**
 * Domain types for the guide. Keeping shapes explicit makes it safe to add
 * API or database loaders later without changing page components much.
 */

/** Stable id used for relations (abilities, analytics, future CMS rows). */
export type EntityId = string;

/** URL segment for detail pages, e.g. `/pokemon/spark-tadpole`. */
export type Slug = string;

/** Linked habitat template from pokopia-dex.json (rendered as internal guide URL in `game-data`). */
export interface HabitatTemplateRef {
  readonly slug: string;
  readonly name: string;
  /** Resolved at load time, e.g. `/habitats/template/tall-grass`. */
  readonly href: string;
}

/** One habitat recipe name + species that can spawn when it is built (from compiled dex). */
export interface HabitatTemplateDetail {
  readonly slug: string;
  readonly name: string;
  readonly species: readonly { readonly slug: Slug; readonly name: string }[];
}

export interface Ability {
  id: EntityId;
  name: string;
  /** One or two sentences; what the ability does in combat or exploration. */
  description: string;
}

export interface PokemonSpecies {
  id: EntityId;
  slug: Slug;
  name: string;
  /** In-game type / element label — kept as string so you can align with the real game. */
  element: string;
  /** Short intro for list cards and SEO. */
  summary: string;
  /** Fallback note when structured habitat fields are missing (e.g. guide 404). */
  habitatNotes: string;
  /** Maps to Pokopia specialties via `specialtyToId` (same as `Ability.id`). */
  abilityIds: readonly EntityId[];
  /** Pokopia regional dex number from reference data. */
  dexNumber?: string;
  /**
   * National / PokéAPI-style index for artwork (`official-artwork/{nationalDex}.png`).
   * Filled by `npm run sync:national-dex`; differs from regional `dexNumber`.
   */
  nationalDex?: number;
  readonly preferredEnvironment?: string | readonly string[];
  readonly timeOfDay?: readonly string[];
  readonly weather?: readonly string[];
  readonly habitatTemplates?: readonly HabitatTemplateRef[];
}

export interface HabitatBlueprint {
  id: EntityId;
  name: string;
  /** What this layout is trying to achieve. */
  goal: string;
  /** Rough difficulty or unlock order (1 = early). */
  tier: number;
  /** Bullet ideas players can copy or adapt. */
  layoutNotes: readonly string[];
}
