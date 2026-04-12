/**
 * @vite-pwa/astro only registers its HTML → clean-URL manifest transform when
 * `workbox.manifestTransforms` is unset. If we add our own array, we must replicate
 * that behavior and also drop `404.html`, which Astro rewrites to `404` — a path
 * many static hosts (e.g. Vercel) do not serve, causing bad-precaching-response.
 *
 * Keep `scope`, `trailingSlash`, and `useDirectoryFormat` aligned with `astro.config`.
 */
export function createPokopiaWorkboxManifestTransform({
  scope = '/',
  trailingSlash = 'ignore',
  useDirectoryFormat = true,
} = {}) {
  return async function pokopiaManifestTransform(entries) {
    const manifest = entries.filter((e) => {
      if (!e?.url) return false;
      const raw = e.url.split('?')[0].replace(/^\.\//, '');
      if (raw === '404' || raw === '/404') return false;
      if (raw === '404.html' || raw.endsWith('/404.html')) return false;
      return true;
    });

    manifest
      .filter((e) => e && e.url.endsWith('.html'))
      .forEach((e) => {
        const url = e.url.startsWith('/') ? e.url.slice(1) : e.url;
        if (url === 'index.html') {
          e.url = scope;
        } else {
          const parts = url.split('/');
          parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '');
          e.url = useDirectoryFormat
            ? parts.length > 1
              ? parts.slice(0, parts.length - 1).join('/')
              : parts[0]
            : parts.join('/');
          if (trailingSlash === 'always') e.url += '/';
        }
      });

    return { manifest, warnings: [] };
  };
}
