import type { APIRoute } from "astro";

/**
 * Serves /robots.txt with a Sitemap line derived from `site` in
 * astro.config.mjs, so the two never drift when the domain changes.
 */
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];

  if (site) {
    lines.push("", `Sitemap: ${new URL("sitemap-index.xml", site).href}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
