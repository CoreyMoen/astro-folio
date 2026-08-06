/**
 * Page metadata accepted by `BaseHead` and by every layout that renders it.
 *
 * Layouts should type their own props as `SeoProps` (or an interface extending
 * it) and spread them straight into `<BaseHead />`, so new fields added here
 * flow through without touching each layout.
 */
export interface SeoProps {
  /** Page title. Rendered as `{title} | {SITE_NAME}`; omit for `SITE_NAME` alone. */
  title?: string;
  /** Meta description, also used for `og:description` and `twitter:description`. Defaults to `SITE_DESCRIPTION`. */
  description?: string;
  /** Social share image. Relative paths resolve against `site` in `astro.config.mjs`. */
  image?: string;
  /** Open Graph type. Use `"article"` for posts and news pages. */
  type?: "website" | "article";
  /**
   * Force `robots: noindex, nofollow` on or off for this page.
   *
   * Leave it unset to inherit from `NOINDEX_ROUTES`, which also drives sitemap
   * exclusion. Setting it here only affects the robots tag — a page kept out of
   * search results should be listed in `NOINDEX_ROUTES` so it leaves the
   * sitemap too.
   */
  noindex?: boolean;
}
