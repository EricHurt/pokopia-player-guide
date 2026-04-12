import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import { createPokopiaWorkboxManifestTransform } from './scripts/pwa-workbox-manifest-transform.mjs';

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
        /** @vite-pwa/astro skips its own manifest transform when this is set — use scripts/pwa-workbox-manifest-transform.mjs */
        globIgnores: ['**/404.html'],
        manifestTransforms: [
          createPokopiaWorkboxManifestTransform({
            scope: '/',
            trailingSlash: 'ignore',
            useDirectoryFormat: true,
          }),
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
