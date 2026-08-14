# CoreyMoen.com on Lumos For Astro

The coreymoen.com portfolio, rebuilt in Astro on top of the Lumos framework.
The original Webflow site's design lives in `src/styles/site.css` (a `site`
cascade layer between `components` and `utilities`), the site-specific
components in `src/components/site/`, and the pages in `src/pages/`.

## Content

Content was migrated from the Webflow CMS via the Webflow MCP/API into plain
JSON under `src/data/` (`projects.json`, `news.json`, `words.json`), with
typed accessors in `src/utils/cms.ts`. All CMS images were downloaded to
`public/images/cms/` and rich-text URLs rewritten to the local copies, so the
site has no runtime dependency on Webflow. To refresh content, re-pull the
collections from the Webflow API and regenerate those JSON files (references
are resolved to names, `Projects.typee` → `type`, roles to
`{ title, active }`, and items are sorted newest-first).

The full HTML/CSS export of the original site is kept in `reference/` for
comparison and is not part of the build.

---

# Lumos For Astro

A component and styling framework for building Astro sites, designed around
efficiency, scalability and accessibility.

> **Beta.** `v0.0.1` is the first tagged release. The component API is still
> settling, so expect prop names to move before `v0.1.0`.

## Getting started

```sh
npm install
npm run dev
```

| Script            | What it does                      |
| ----------------- | --------------------------------- |
| `npm run dev`     | Starts the dev server             |
| `npm run build`   | Builds the site to `dist/`        |
| `npm run preview` | Serves the built site             |
| `npm run check`   | Type-checks every `.astro` file   |
| `npm run format`  | Formats the project with Prettier |

Node 22.12 or newer is required.

## How it is put together

### The cascade

Styles are split across four cascade layers, declared in
[`global.css`](src/styles/global.css) in this order:

| Layer        | File                                      | Holds                                               |
| ------------ | ----------------------------------------- | --------------------------------------------------- |
| `base`       | [base.css](src/styles/base.css)           | Design tokens, color themes, the reset, text styles |
| `patterns`   | [patterns.css](src/styles/patterns.css)   | Multi-property patterns shared across components    |
| `components` | Each component's own `<style>` block      | The component itself                                |
| `utilities`  | [utilities.css](src/styles/utilities.css) | Single-property classes                             |

A later layer beats an earlier one whatever the selectors say, so components
override patterns and utilities override components.

### Theming

Four theme classes — `theme-light`, `theme-dark`, `theme-brand` and
`theme-invert` — each redeclare the same set of custom properties, so anything
inside them picks up the right colors without knowing where it sits. `Section`,
`BaseLayout` and `Card` all take a `theme` prop that applies one.

### Components

Layout: `Section`, `ContentWrapper`, `Grid`, `ButtonWrapper`
Content: `Heading`, `Paragraph`, `RichText`, `Eyebrow`, `Card`, `Button`
Media: `Img`, `Video`, `Icon`, `Overlay`
Chrome: `Nav`, `Footer`, `SkipLink`, `BaseHead`, `FormattedDate`

Every component takes a `render` prop; pass `false` to skip it and its children.
Components that would render nothing skip themselves.

See [example-components](src/pages/example-components.astro) for each one in
context.

### Site configuration

Site name, description, canonical origin, locale and the routes kept out of
search live in [`src/consts.ts`](src/consts.ts).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first — a pull request needs the
[CLA](CLA.md) signed before it can be merged.

## License

[MIT](LICENSE)
