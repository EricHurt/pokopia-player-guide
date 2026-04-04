const slug = process.argv[2] || 'chef-s-kitchen';
const strip = slug.replace(/-/g, '');
const list = [
  strip,
  strip.replace(/^caf/, 'café'),
  strip.replace(/s(?=[a-z])/g, 's-'), // no
  'chef' + 'kitchen',
  'chefakitchen',
  'kitchen',
];

async function p(s) {
  const path = encodeURI(s);
  const u = `https://www.serebii.net/pokemonpokopia/habitatdex/${path}.shtml`;
  const r = await fetch(u, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)' },
  });
  return { u, ok: r.ok, status: r.status };
}

for (const s of new Set([strip, ...list])) {
  const { ok, status, u } = await p(s);
  if (ok) {
    const t = await (await fetch(u)).text();
    const m = t.match(/\/pokemonpokopia\/habitatdex\/([a-z0-9]+\.png)/i);
    console.log('HIT', s, m?.[1]);
  } else console.log('miss', s, status);
}
