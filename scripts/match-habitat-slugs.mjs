import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const previewPath = path.join(root, 'src', 'data', 'habitat-preview-urls.json');
const previews = JSON.parse(fs.readFileSync(previewPath, 'utf8'));

const r = await fetch('https://www.serebii.net/pokemonpokopia/habitatdex/dock.shtml', {
  headers: { 'user-agent': 'Mozilla/5.0 (compatible; PokopiaGuide/1.0)' },
});
const t = await r.text();
const serebii = [...new Set([...t.matchAll(/habitatdex\/([a-z0-9\u00e9]+)\.shtml/gi)].map((m) => m[1]))];

function lev(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + c);
    }
  }
  return dp[m][n];
}

const missing = Object.entries(previews)
  .filter(([, v]) => v == null)
  .map(([k]) => k);

for (const kebab of missing) {
  const flat = kebab.replace(/-/g, '');
  let best = null;
  let bestD = 99;
  for (const s of serebii) {
    const d = lev(flat, s);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  console.log(kebab, 'flat=' + flat, '->', best, 'd=' + bestD);
}
