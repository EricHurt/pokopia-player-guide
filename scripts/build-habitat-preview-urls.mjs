/**
 * One-off / CI: fetch Serebii habitat dex pages and extract preview PNG URLs.
 * Writes src/data/habitat-preview-urls.json (+ mirrors to public/data for optional runtime fetch).
 *
 * Run: node scripts/build-habitat-preview-urls.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dexPath = path.join(root, 'src', 'data', 'pokopia-dex.json');
const outSrc = path.join(root, 'src', 'data', 'habitat-preview-urls.json');
const outPublic = path.join(root, 'public', 'data', 'habitat-preview-urls.json');

const DOCK_URL = 'https://www.serebii.net/pokemonpokopia/habitatdex/dock.shtml';

/**
 * Pokopia kebab slug → Serebii basename when Serebii naming does not follow the usual rules
 * (see `candidateSerebiiBasenames`).
 */
const SEREBII_PAGE_ALIASES = {
  'auspicious-knight-s-shrine': 'dojotraining',
  'malicious-knight-s-shrine': 'dojotraining',
  'caf-space': 'cafespace',
  'chef-s-kitchen': 'minikitchen',
  'fortune-teller-s-table': 'flowerytable',
  'gamer-s-paradise': 'minigamecorner',
  'lumberjack-s-workplace': 'crazyloghandicrafts',
  'nature-s-market': 'freshveggiefield',
  'nothin-but-poke-balls': 'allpackedup',
  'professor-s-apprentice-program': 'experimentspace',
  'professor-s-treasure-trove': 'minilibrary',
  'researcher-s-desk': 'workdesk',
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHyphens(slug) {
  return String(slug).replace(/-/g, '');
}

async function fetchSerebiiBasenameSet() {
  const res = await fetch(DOCK_URL, {
    headers: {
      'user-agent': 'PokopiaPlayerGuide/1.0 (+local build; habitat preview attribution)',
    },
  });
  if (!res.ok) throw new Error(`Failed to load habitat dex index: ${res.status} ${DOCK_URL}`);
  const html = await res.text();
  const all = [...html.matchAll(/habitatdex\/([a-z0-9\u00e9-]+)\.shtml/gi)].map((m) => m[1].toLowerCase());
  return new Set(all);
}

/**
 * Candidate basenames in try order. Serebii often uses one hyphen after the first word, then runs
 * the rest together (e.g. berry-feast-campsite → berry-feastcampsite), or merges the first two
 * words (e.g. good-old-fashioned-antiques → goodold-fashionedantiques).
 */
function candidateSerebiiBasenames(kebabSlug) {
  const parts = kebabSlug.split('-').filter(Boolean);
  const out = [];
  const push = (s) => {
    if (s && !out.includes(s)) out.push(s);
  };
  push(stripHyphens(kebabSlug));
  if (parts.length >= 2) push(`${parts[0]}-${parts.slice(1).join('')}`);
  if (parts.length >= 4) push(`${parts[0]}${parts[1]}-${parts.slice(2).join('')}`);
  return out;
}

/**
 * Map Pokopia kebab slug to the Serebii habitatdex page basename.
 */
function serebiiPageBasename(kebabSlug, knownBasenames) {
  const mapped = SEREBII_PAGE_ALIASES[kebabSlug];
  if (mapped && knownBasenames.has(mapped)) return mapped;

  for (const c of candidateSerebiiBasenames(kebabSlug)) {
    if (knownBasenames.has(c)) return c;
  }

  /** Legacy parallel layouts (elevated / hydrated) when no hyphenated tree-shaded* page exists. */
  if (kebabSlug.startsWith('tree-shaded-')) {
    const rest = stripHyphens(kebabSlug.slice('tree-shaded-'.length));
    const elevated = `elevated${rest}`;
    const hydrated = `hydrated${rest}`;
    if (knownBasenames.has(elevated)) return elevated;
    if (knownBasenames.has(hydrated)) return hydrated;
  }

  return stripHyphens(kebabSlug);
}

async function fetchPreviewForSlug(kebabSlug, knownBasenames) {
  const page = serebiiPageBasename(kebabSlug, knownBasenames);
  const pageUrl = `https://www.serebii.net/pokemonpokopia/habitatdex/${page}.shtml`;
  const res = await fetch(pageUrl, {
    headers: {
      'user-agent': 'PokopiaPlayerGuide/1.0 (+local build; habitat preview attribution)',
    },
  });
  if (!res.ok) return { kebabSlug, imageUrl: null, source: pageUrl };
  const html = await res.text();
  const m = html.match(/\/pokemonpokopia\/habitatdex\/([a-z0-9\u00e9-]+\.png)/i);
  if (!m) return { kebabSlug, imageUrl: null, source: pageUrl };
  const imageUrl = `https://www.serebii.net/pokemonpokopia/habitatdex/${m[1]}`;
  return { kebabSlug, imageUrl, source: pageUrl };
}

async function main() {
  const knownBasenames = await fetchSerebiiBasenameSet();
  const dex = JSON.parse(fs.readFileSync(dexPath, 'utf8'));
  const slugs = new Set();
  for (const s of dex.species) {
    for (const h of s.habitats ?? []) slugs.add(h.slug);
  }
  const list = [...slugs].sort((a, b) => a.localeCompare(b));
  const out = {};
  let ok = 0;
  let miss = 0;
  for (let i = 0; i < list.length; i++) {
    const slug = list[i];
    process.stderr.write(`\r[${i + 1}/${list.length}] ${slug}`.padEnd(72));
    const row = await fetchPreviewForSlug(slug, knownBasenames);
    out[slug] = row.imageUrl;
    if (row.imageUrl) ok++;
    else miss++;
    await delay(120);
  }
  process.stderr.write('\n');
  const json = JSON.stringify(out, null, 2) + '\n';
  fs.writeFileSync(outSrc, json);
  fs.writeFileSync(outPublic, json);
  console.log(`Wrote ${list.length} rows (${ok} with image, ${miss} missing) → habitat-preview-urls.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
