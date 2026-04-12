import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';

// After deployment, set `site` to your real public URL (required for PWA scope and OG URLs).
export default defineConfig({
  site: 'https://your-site.example.com',
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'data/pokopia-dex.json',
        'images/pokemon-art/shellos-east.png',
        'images/pokemon-art/gastrodon-east.png',
      ],
      manifest: {
        name: 'Pokopia Guide',
        short_name: 'Pokopia',
        description: 'Fan-made Pokopia player guide — Pokémon, habitats, and progression tips.',
        theme_color: '#2a8f5c',
        background_color: '#b8e8f2',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,woff2,json,webmanifest}'],
        /**
         * Astro emits `404.html` at the site root; Workbox maps it to URL path `404` (no extension).
         * Static hosts often return 404 for that path → bad-precaching-response. Exclude the file and
         * strip any `404` entry from the manifest (some plugin versions still inject it).
         */
        globIgnores: ['**/404.html'],
        manifestTransforms: [
          (entries) => {
            const manifest = entries.filter((e) => {
              const raw = e.url.split('?')[0].replace(/^\.\//, '');
              if (raw === '404' || raw === '/404') return false;
              try {
                return new URL(raw, 'https://pwa.local').pathname !== '/404';
              } catch {
                return true;
              }
            });
            return { manifest, warnings: [] };
          },
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
