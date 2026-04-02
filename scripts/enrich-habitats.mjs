/**
 * Fetches habitat + environment fields from pokopiaguide.com and updates pokopia-dex.json.
 * Run: node scripts/enrich-habitats.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dexPath = path.join(root, 'src', 'data', 'pokopia-dex.json');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const HABITAT_DENY = new Set(['materials', 'construction-kits', 'furniture', 'kits', 'shop']);

function sectionAlts(html, heading) {
  const parts = html.split(heading + '</h3>');
  if (parts.length < 2) return [];
  let chunk = parts[1];
  const nextH3 = chunk.search(/<h3\b/);
  if (nextH3 > 0) chunk = chunk.slice(0, nextH3);
  else chunk = chunk.slice(0, 2000);
  return [...chunk.matchAll(/alt="([^"]+)"/g)].map((m) => m[1]).filter(Boolean);
}

function parseHabitatCards(html) {
  const re = /href="\/habitat\/([a-z0-9-]+)"[^>]*>[\s\S]{0,1200}?alt="([^"]+)"/g;
  const out = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const slug = m[1];
    if (HABITAT_DENY.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      name: m[2].replaceAll('&amp;', '&'),
      href: `https://pokopiaguide.com/habitat/${slug}`,
    });
  }
  return out;
}

function parsePokedexHtml(html) {
  const preferredAlts = sectionAlts(html, 'Preferred Environment');
  const timeOfDay = sectionAlts(html, 'Time of Day');
  const weather = sectionAlts(html, 'Weather');
  const habitats = parseHabitatCards(html);

  const preferredEnvironment =
    preferredAlts.length === 0 ? undefined : preferredAlts.length === 1 ? preferredAlts[0] : preferredAlts;

  return {
    habitats,
    preferredEnvironment,
    timeOfDay: timeOfDay.length ? timeOfDay : undefined,
    weather: weather.length ? weather : undefined,
  };
}

function buildHabitatSummary(f) {
  const parts = [];
  if (f.preferredEnvironment) {
    const pe = Array.isArray(f.preferredEnvironment)
      ? f.preferredEnvironment.join(', ')
      : f.preferredEnvironment;
    parts.push(`Preferred environment: ${pe}`);
  }
  if (f.timeOfDay?.length) parts.push(`Time of day: ${f.timeOfDay.join(', ')}`);
  if (f.weather?.length) parts.push(`Weather: ${f.weather.join(', ')}`);
  if (f.habitats.length) {
    parts.push(
      `Habitat templates: ${f.habitats.map((h) => h.name).join('; ')}`,
    );
  }
  return parts.join('\n\n');
}

async function main() {
  const dex = JSON.parse(fs.readFileSync(dexPath, 'utf8'));
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < dex.species.length; i++) {
    const s = dex.species[i];
    const url = `https://pokopiaguide.com/pokedex/${s.slug}`;
    process.stdout.write(`\r${i + 1}/${dex.species.length} ${s.slug}`.padEnd(65));

    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'PokopiaFanGuide/1.0 (local educational mirror; +README)' },
      });
      if (!res.ok) throw new Error(String(res.status));
      const html = await res.text();
      const parsed = parsePokedexHtml(html);

      s.habitats = parsed.habitats;
      if (parsed.preferredEnvironment !== undefined) s.preferredEnvironment = parsed.preferredEnvironment;
      else delete s.preferredEnvironment;
      if (parsed.timeOfDay) s.timeOfDay = parsed.timeOfDay;
      else delete s.timeOfDay;
      if (parsed.weather) s.weather = parsed.weather;
      else delete s.weather;

      const summary = buildHabitatSummary(parsed);
      s.habitatBuildNotes =
        summary ||
        'No habitat section parsed for this species — open the Pokopiaguide link in meta.sources or check in-game.';

      ok++;
    } catch (e) {
      fail++;
      s.habitatBuildNotes = `Live guide unavailable for "${s.slug}" (${e.message}). Try https://pokopiaguide.com/pokedex/${s.slug}`;
      s.habitats = s.habitats || [];
    }

    await delay(120);
  }

  dex.meta.habitatEnrichment = {
    completedAt: new Date().toISOString(),
    source: 'https://pokopiaguide.com/pokedex',
    ok,
    fail,
    note: 'Unofficial mirror — verify recipes and materials in Pokémon Pokopia.',
  };

  const out = JSON.stringify(dex, null, 2);
  fs.writeFileSync(dexPath, out, 'utf8');
  fs.writeFileSync(path.join(root, 'public', 'data', 'pokopia-dex.json'), out, 'utf8');

  console.log(`\nDone. ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
