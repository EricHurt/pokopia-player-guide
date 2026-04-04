const r = await fetch('https://www.serebii.net/pokemonpokopia/habitatdex/dock.shtml', {
  headers: { 'user-agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)' },
});
const t = await r.text();
const all = [...t.matchAll(/habitatdex\/([a-z0-9\u00e9]+)\.shtml/gi)].map((m) => m[1]);
console.log([...new Set(all)].sort().join('\n'));
console.log('count', new Set(all).size);
