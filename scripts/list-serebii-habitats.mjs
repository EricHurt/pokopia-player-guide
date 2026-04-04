const pages = [
  'https://www.serebii.net/pokemonpokopia/heartgold.shtml',
  'https://www.serebii.net/pokemonpokopia/habitat.shtml',
  'https://www.serebii.net/pokemonpokopia/pokopia.shtml',
];
for (const u of pages) {
  const r = await fetch(u, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)' },
  });
  if (!r.ok) {
    console.log(u, r.status);
    continue;
  }
  const t = await r.text();
  const dex = [...t.matchAll(/pokemonpokopia\/habitatdex\/([a-z0-9]+)\.shtml/gi)].map((m) => m[1]);
  console.log(u, '->', [...new Set(dex)].length);
}
