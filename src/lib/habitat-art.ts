import raw from '../data/habitat-preview-urls.json';

const urls = raw as Record<string, string | null>;

/** In-game habitat form preview image (Serebii Pokopia habitat dex), when known. */
export function habitatPreviewImageUrl(slug: string): string | undefined {
  const u = urls[slug];
  return typeof u === 'string' && u.length > 0 ? u : undefined;
}
