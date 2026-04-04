/** Try candidate URL slugs for a few known-missing kebab slugs */
const candidates = {
  'chef-s-kitchen': ['chefskitchen', 'chefkitchen', 'kitchenchef'],
  'caf-space': ['cafspace', 'caféspace', 'cafeteria', 'ofekitchen'],
  'field-trip-friends': ['fieldtripfriends', 'fieldtrip', 'schooltrip'],
  'tree-shaded-tall-grass': ['treeshadedtallgrass', 'treeshaded'],
  'lumberjack-s-workplace': ['lumberjacksworkplace', 'lumberjack'],
};

async function probe(base) {
  const u = `https://www.serebii.net/pokemonpokopia/habitatdex/${base}.shtml`;
  const r = await fetch(u, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)' },
  });
  if (!r.ok) return null;
  const t = await r.text();
  const m = t.match(/\/pokemonpokopia\/habitatdex\/([a-z0-9]+\.png)/i);
  return m ? `https://www.serebii.net/pokemonpokopia/habitatdex/${m[1]}` : null;
}

for (const [kebab, tries] of Object.entries(candidates)) {
  for (const c of tries) {
    const img = await probe(c);
    if (img) {
      console.log(kebab, 'OK', c, img);
      break;
    }
  }
}
