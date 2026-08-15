#!/usr/bin/env node
/**
 * Re-pull site content from the Webflow CMS into src/data/*.json and
 * localize every referenced image into public/images/cms/.
 *
 * Usage:
 *   WEBFLOW_API_TOKEN=... npm run sync
 *
 * The token is a Webflow "site token" (Site settings → Apps & integrations →
 * API access) with read access to the CoreyMoen.com site's CMS.
 *
 * Output shapes match src/utils/cms.ts: references are resolved to names,
 * option ids to labels, roles to { title, active }, rich-text image URLs to
 * local /images/cms/ paths, and every list is sorted newest-first.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "src/data");
const IMG_DIR = path.join(ROOT, "public/images/cms");

const TOKEN = process.env.WEBFLOW_API_TOKEN;
if (!TOKEN) {
  console.error(
    "Set WEBFLOW_API_TOKEN to a Webflow site token with CMS read access.",
  );
  process.exit(1);
}

const COLLECTIONS = {
  projects: "63d29345f6637a64f8efdb9b",
  news: "63d29294cb868b2fe980cdc3",
  words: "63d295f68423e0382b3b723e",
  wordCategories: "63d296046e3d7930f2c6f4d1",
  roles: "63d293e308d5ba0030552a71",
  types: "63d2945dbc6c3f3109077081",
};

const NEWS_ACTION = {
  dbde986c9008a6f767d6e4330f8fc068: "Video",
  aeac18ff68529998659c3d3fdf399ea1: "Article",
  "11e79c1ae61cc6deefe591d6400e68bc": "Podcast",
};

const BG_TYPE = {
  af48d1d34a5597a6ff098c013f394a67: "Light",
  "741321cffcc008dcdb40fd9184aca8c2": "Dark",
};

const ROLE_ACTIVE_STATUS = "446d3f7e0b0339fee574794819692c5b";

async function fetchItems(collectionId) {
  const items = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=100&offset=${offset}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } },
    );
    if (!res.ok) {
      throw new Error(
        `Webflow API ${res.status} for collection ${collectionId}: ${await res.text()}`,
      );
    }
    const page = await res.json();
    items.push(...page.items);
    if (items.length >= (page.pagination?.total ?? items.length)) break;
  }
  return items.filter((item) => !item.isDraft && !item.isArchived);
}

/* ---- image localization -------------------------------------------------- */

const urlMap = new Map(); // remote URL -> local public path
const downloads = []; // [url, absolute file path]

function localize(url, prefix) {
  if (!url || !url.startsWith("http")) return url ?? null;
  if (urlMap.has(url)) return urlMap.get(url);
  let name = decodeURIComponent(path.basename(new URL(url).pathname))
    .replace(/^[0-9a-f]{24}_/, "")
    .replace(/[^A-Za-z0-9._-]/g, "-");
  let local = `/images/cms/${prefix}-${name}`;
  if ([...urlMap.values()].includes(local)) {
    const hash = [...url]
      .reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0)
      .toString(16);
    const ext = path.extname(name);
    local = `/images/cms/${prefix}-${name.slice(0, name.length - ext.length)}-${hash}${ext}`;
  }
  urlMap.set(url, local);
  downloads.push([url, path.join(ROOT, "public", local)]);
  return local;
}

const RICH_URL =
  /https:\/\/(?:uploads-ssl\.webflow\.com|cdn\.prod\.website-files\.com)\/[^\s"')]+/g;

const localizeRich = (html, prefix) =>
  html ? html.replace(RICH_URL, (url) => localize(url, prefix)) : null;

/* ---- transforms ---------------------------------------------------------- */

const byDateDesc = (a, b) => (b.date ?? "").localeCompare(a.date ?? "");

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(IMG_DIR, { recursive: true });

  const [projects, news, words, wordCategories, roles, types] =
    await Promise.all(Object.values(COLLECTIONS).map(fetchItems));

  const typeById = new Map(types.map((t) => [t.id, t.fieldData.name]));
  const categoryById = new Map(
    wordCategories.map((c) => [c.id, c.fieldData.name]),
  );
  const roleById = new Map(roles.map((r) => [r.id, r.fieldData]));

  const outProjects = projects
    .map(({ fieldData: f }) => ({
      slug: f.slug,
      name: f.name,
      altCardTitle: f["alt-card-title"] ?? null,
      featured: Boolean(f.featured),
      date: f.date ?? null,
      type: typeById.get(f.typee) ?? null,
      link: f["link-to-project"] ?? null,
      linkExplainer: localizeRich(f["link-explainer"], f.slug),
      ogImage: f["og-image"] ? localize(f["og-image"].url, f.slug) : null,
      mainImage: f["main-image"] ? localize(f["main-image"].url, f.slug) : null,
      mainImageAlt: f["main-image"]?.alt ?? null,
      bgColor: f["bg-color"] ?? null,
      bgType: BG_TYPE[f["bg-type-color"]] ?? null,
      metaDescription: f["meta-description"] ?? null,
      summary: localizeRich(f.summary, f.slug),
      roles: (f.roles ?? [])
        .filter((id) => roleById.has(id))
        .map((id) => ({
          title: roleById.get(id).title,
          active: roleById.get(id).status === ROLE_ACTIVE_STATUS,
        })),
      problem: localizeRich(f.problem, f.slug),
      solution: localizeRich(f.solution, f.slug),
      body: localizeRich(f.body, f.slug),
    }))
    .sort(byDateDesc);

  const outNews = news
    .map(({ fieldData: f }) => ({
      slug: f.slug,
      name: f.name,
      date: f.date ?? null,
      action: NEWS_ACTION[f.action] ?? null,
      link: f.link ?? null,
      image: f.image
        ? localize(f.image.url, `news-${f.slug.slice(0, 32)}`)
        : null,
    }))
    .sort(byDateDesc);

  const outWords = words
    .map(({ fieldData: f }) => {
      const body = localizeRich(f.body, `words-${f.slug}`);
      const text = (body ?? "").replace(/<[^>]+>/g, " ");
      const readTime = Math.max(
        1,
        Math.round(text.split(/\s+/).filter(Boolean).length / 225),
      );
      return {
        slug: f.slug,
        name: f.name,
        date: f.date ?? null,
        category: categoryById.get(f.category) ?? null,
        shortDescription: f["short-description"] ?? null,
        body,
        readTime,
      };
    })
    .sort(byDateDesc);

  const write = (file, data) =>
    writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2) + "\n");
  await write("projects.json", outProjects);
  await write("news.json", outNews);
  await write("words.json", outWords);
  console.log(
    `projects=${outProjects.length} news=${outNews.length} words=${outWords.length}`,
  );

  let fetched = 0;
  let failed = 0;
  for (const [url, file] of downloads) {
    const exists = await access(file).then(
      () => true,
      () => false,
    );
    if (exists) continue;
    try {
      const res = await fetch(url);
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
      fetched += 1;
    } catch (error) {
      failed += 1;
      console.error(`FAILED ${url}: ${error.message}`);
    }
  }
  console.log(
    `images: ${downloads.length} referenced, ${fetched} downloaded, ${failed} failed`,
  );
  if (failed > 0) process.exitCode = 1;
}

await main();
