/**
 * Fills each species `nationalDex` in pokopia-dex.json from PokéAPI `pokemon.id`
 * (used for official-artwork URLs). Pokopia `dexNumber` is regional — do not use for sprites.
 *
 * The value matches main-series national Pokédex for most species; alternate forms use
 * PokéAPI's per-form id (still the correct artwork index).
 *
 * Run: npm run sync:national-dex
 * Writes: src/data/pokopia-dex.json + public/data/pokopia-dex.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dexSrc = path.join(root, 'src', 'data', 'pokopia-dex.json');
const dexPublic = path.join(root, 'public', 'data', 'pokopia-dex.json');

/** Pokopia JSON slug → PokéAPI `pokemon` name (when they differ). */
const POKEAPI_SLUG_ALIASES = {
  'farfetch-d': 'farfetchd',
  'tatsugiri-stretchy-form': 'tatsugiri-stretchy',
  'tatsugiri-curly-form': 'tatsugiri-curly',
  'tatsugiri-droopy-form': 'tatsugiri-droopy',
  'toxtricity-amped-form': 'toxtricity-amped',
  'toxtricity-low-key-form': 'toxtricity-low-key',
  'paldean-wooper': 'wooper-paldea',
  'shellos-east-sea': 'shellos',
  'gastrodon-east-sea': 'gastrodon',
  mimikyu: 'mimikyu-disguised',
};

const ARTWORK_FALLBACK_API_SLUG = {
  peakychu: 'pikachu',
  mosslax: 'snorlax',
  'stereo-rotom': 'rotom',
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPokemonId(apiSlug) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(apiSlug)}`, {
    headers: { 'user-agent': 'PokopiaFanGuide/1.0 (+national dex sync)' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.id === 'number' ? data.id : null;
}

async function resolveId(pokopiaSlug) {
  const chain = [
    POKEAPI_SLUG_ALIASES[pokopiaSlug] ?? pokopiaSlug,
    ARTWORK_FALLBACK_API_SLUG[pokopiaSlug],
  ].filter(Boolean);
  const tried = new Set();
  for (const apiSlug of chain) {
    if (tried.has(apiSlug)) continue;
    tried.add(apiSlug);
    const id = await fetchPokemonId(apiSlug);
    if (id != null) return id;
    await delay(40);
  }
  return null;
}

function writeDex(dex) {
  const out = `${JSON.stringify(dex, null, 2)}\n`;
  fs.writeFileSync(dexSrc, out, 'utf8');
  fs.writeFileSync(dexPublic, out, 'utf8');
}

async function main() {
  const dex = JSON.parse(fs.readFileSync(dexSrc, 'utf8'));
  const failures = [];

  for (let i = 0; i < dex.species.length; i++) {
    const s = dex.species[i];
    process.stdout.write(`\r${i + 1}/${dex.species.length} ${s.slug}`.padEnd(72));
    const id = await resolveId(s.slug);
    if (id != null) s.nationalDex = id;
    else {
      delete s.nationalDex;
      failures.push(s.slug);
    }
    await delay(85);
  }

  dex.meta.nationalDexEnrichment = {
    completedAt: new Date().toISOString(),
    source: 'https://pokeapi.co/api/v2/pokemon',
    field: 'nationalDex',
    note: 'PokéAPI pokemon id for official-artwork sprites; equals national Pokédex index for typical species.',
    ok: dex.species.length - failures.length,
    fail: failures.length,
    failures,
  };

  writeDex(dex);
  console.log(
    `\nUpdated pokopia-dex.json (nationalDex on ${dex.species.length - failures.length} species; ${failures.length} failed: ${failures.join(', ') || 'none'})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
