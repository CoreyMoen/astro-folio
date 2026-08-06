import { NOINDEX_ROUTES } from "../consts.ts";

/** Strip surrounding slashes so "/thanks", "thanks" and "/thanks/" all match. */
const normalize = (path: string) => `/${path.replace(/^\/+|\/+$/g, "")}`;

const excluded = new Set(NOINDEX_ROUTES.map(normalize));

/**
 * True when a route is listed in `NOINDEX_ROUTES`.
 *
 * Read in two places that must agree: the sitemap filter in astro.config.mjs,
 * and BaseHead, which emits the matching robots tag.
 */
export function isNoindexRoute(pathname: string): boolean {
  return excluded.has(normalize(pathname));
}
