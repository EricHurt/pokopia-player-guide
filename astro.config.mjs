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
         * Vercel does not serve that path → precache fails with bad-precaching-response and the new
         * service worker never activates, so users keep stale cached HTML (e.g. old Pokémon art).
         */
        globIgnores: ['**/404.html'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
