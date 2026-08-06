import { NOINDEX_ROUTES } from "../consts.ts";

const normalize = (path: string) => `/${path.replace(/^\/+|\/+$/g, "")}`;

const excluded = new Set(NOINDEX_ROUTES.map(normalize));

/** True when a pathname is listed in `NOINDEX_ROUTES`, ignoring surrounding slashes. */
export function isNoindexRoute(pathname: string): boolean {
  return excluded.has(normalize(pathname));
}
