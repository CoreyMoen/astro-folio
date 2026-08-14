/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Corey Moen";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "A genuine web wizard with over 15 years of experience creating high-quality digital experiences for brands of all sizes.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://www.coreymoen.com";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/**
 * Routes kept out of search results. Each is excluded from the sitemap and
 * served with a `robots: noindex, nofollow` tag, so the two can't disagree.
 *
 * Surrounding slashes are optional: `"/thanks"`, `"thanks"` and `"/thanks/"`
 * all match the same route.
 */
export const NOINDEX_ROUTES: string[] = ["/404"];

/** Social profiles shown in the footer and on the info page. */
export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com/CoreyGMoen" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/coreymoen/" },
  { label: "Dribbble", href: "https://dribbble.com/coreymoen" },
  { label: "Webflow", href: "https://webflow.com/@coreymoen" },
];

/**
 * Webflow form endpoint the chat + subscribe forms post to. The original site
 * ran on Webflow; exported/rebuilt sites can keep submitting to the same
 * endpoint so entries land in the same Webflow form inbox.
 */
export const WEBFLOW_FORM_ENDPOINT =
  "https://webflow.com/api/v1/form/63d09b43d8622e432b8696a8";
