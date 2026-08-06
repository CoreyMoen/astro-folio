export const SITE_NAME = "Acme Co";
export const SITE_DESCRIPTION = "We build things.";
export const SITE_URL = "https://acme.com";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";

/**
 * Routes kept out of search results. Each one is excluded from the sitemap and
 * served with a `robots: noindex, nofollow` tag, so the two can't disagree.
 *
 * Leading and trailing slashes are optional: "/thanks", "thanks" and
 * "/thanks/" all match the same route.
 */
export const NOINDEX_ROUTES: string[] = [];
