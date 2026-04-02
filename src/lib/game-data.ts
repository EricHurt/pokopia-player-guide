import dex from '../data/pokopia-dex.json';
import { habitatBlueprints } from '../data/habitats';
import type { Ability, HabitatBlueprint, HabitatTemplateDetail, PokemonSpecies, Slug } from '../types/game';

/** Stable id for each Pokopia specialty (kebab-case). */
export function specialtyToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const abilities: Ability[] = Object.entries(dex.specialtiesGlossary).map(([name, description]) => ({
  id: specialtyToId(name),
  name,
  description,
}));

const pokemonSpecies: PokemonSpecies[] = dex.species.map((s) => {
  const habitatTemplates =
    Array.isArray(s.habitats) && s.habitats.length > 0
      ? s.habitats.map((h) => ({
          slug: h.slug,
          name: h.name,
          href: `/habitats/template/${h.slug}`,
        }))
      : undefined;

  return {
    id: s.slug,
    slug: s.slug,
    name: s.name,
    element: s.types.join(' / '),
    summary:
      s.specialties.length > 0
        ? `Specialties: ${s.specialties.join(', ')}`
        : 'No specialties listed in Pokédex data.',
    habitatNotes: s.habitatBuildNotes,
    abilityIds: s.specialties.map((sp) => specialtyToId(sp)),
    dexNumber: s.dexNumber,
    nationalDex: typeof s.nationalDex === 'number' ? s.nationalDex : undefined,
    preferredEnvironment: s.preferredEnvironment as PokemonSpecies['preferredEnvironment'],
    timeOfDay: s.timeOfDay as PokemonSpecies['timeOfDay'],
    weather: s.weather as PokemonSpecies['weather'],
    habitatTemplates,
  };
});

const abilityById = new Map(abilities.map((a) => [a.id, a] as const));
const pokemonBySlug = new Map(pokemonSpecies.map((p) => [p.slug, p] as const));

/** Unique habitat template slugs appearing anywhere in the dex (sorted). */
export function getAllHabitatTemplateSlugs(): readonly string[] {
  const seen = new Set<string>();
  for (const p of pokemonSpecies) {
    for (const h of p.habitatTemplates ?? []) seen.add(h.slug);
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export function getHabitatTemplateDetail(slug: string): HabitatTemplateDetail | undefined {
  let name: string | undefined;
  const speciesList: { slug: Slug; name: string }[] = [];
  for (const p of pokemonSpecies) {
    for (const h of p.habitatTemplates ?? []) {
      if (h.slug !== slug) continue;
      if (name === undefined) name = h.name;
      speciesList.push({ slug: p.slug, name: p.name });
    }
  }
  if (speciesList.length === 0) return undefined;
  speciesList.sort((a, b) => a.name.localeCompare(b.name));
  return { slug, name: name ?? slug, species: speciesList };
}

export function getAllHabitatTemplateSummaries(): readonly { slug: string; name: string; speciesCount: number }[] {
  const slugs = getAllHabitatTemplateSlugs();
  return slugs.map((slug) => {
    const d = getHabitatTemplateDetail(slug);
    return {
      slug,
      name: d?.name ?? slug,
      speciesCount: d?.species.length ?? 0,
    };
  });
}

export function getPokopiaDex() {
  return dex;
}

export function getAllPokemon(): readonly PokemonSpecies[] {
  return pokemonSpecies;
}

export function getPokemonBySlug(slug: Slug): PokemonSpecies | undefined {
  return pokemonBySlug.get(slug);
}

export function getAllAbilities(): readonly Ability[] {
  return abilities;
}

export function getAbilityById(id: string): Ability | undefined {
  return abilityById.get(id);
}

export function getAbilitiesForSpecies(species: PokemonSpecies): Ability[] {
  const out: Ability[] = [];
  for (const id of species.abilityIds) {
    const row = abilityById.get(id);
    if (row) out.push(row);
  }
  return out;
}

export function getAllHabitatBlueprints(): readonly HabitatBlueprint[] {
  return habitatBlueprints;
}

export function getHabitatById(id: string): HabitatBlueprint | undefined {
  return habitatBlueprints.find((h) => h.id === id);
}

export function getSpeciesUsingAbility(abilityId: string): PokemonSpecies[] {
  return pokemonSpecies.filter((p) => p.abilityIds.includes(abilityId));
}
