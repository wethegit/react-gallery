// Converts a demo from src/components/demos/ into a CodePen pen. A pen has
// one JS pane and one CSS pane, so imports are pointed at esm.sh.
//
// The demo arrives already prepared by the `?codepen` mode of
// src/loaders/ts-to-js.cjs: types stripped, the site's own modules (the
// slide data, the classnames helper) pasted in, and its CSS modules
// compiled to plain CSS with plain class names.
//
// This relies on the demos following the same patterns (bare package
// imports, one exported component).
// Anything it doesn't recognise throws, which fails `npm run build` rather
// than shipping a broken pen.

// Fields accepted by CodePen's Prefill API:
// https://blog.codepen.io/documentation/prefill/
export interface Pen {
  title: string
  html: string
  css: string
  css_pre_processor: "none"
  css_external: string
  js: string
  js_pre_processor: "babel"
  editors: string
}

// The installed versions (see useVersions), so a pen runs what the page runs.
export interface Versions {
  galleryVersion: string
  reactVersion: string
}

function packageUrls({ galleryVersion, reactVersion }: Versions): Record<string, string> {
  return {
    react: `https://esm.sh/react@${reactVersion}`,
    "react-dom/client": `https://esm.sh/react-dom@${reactVersion}/client`,
    "@wethegit/react-gallery": `https://esm.sh/@wethegit/react-gallery@${galleryVersion}?deps=react@${reactVersion},react-dom@${reactVersion}`,
  }
}

function galleryCssUrl({ galleryVersion }: Versions): string {
  return `https://cdn.jsdelivr.net/npm/@wethegit/react-gallery@${galleryVersion}/dist/style.css`
}

// Stand-ins for the Docusaurus (Infima) theme variables the demo styles use.
const THEME_FALLBACKS = `/* Stand-ins for the Docusaurus theme variables used below. */
:root {
  --ifm-background-surface-color: #fff;
  --ifm-color-content: #1c1e21;
  --ifm-color-emphasis-100: #f5f6f7;
  --ifm-color-emphasis-200: #ebedf0;
  --ifm-color-emphasis-300: #dadde1;
  --ifm-color-emphasis-600: #606770;
  --ifm-color-primary: #6d28d9;
  --ifm-font-family-monospace: ui-monospace, monospace;
}

body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 1.5rem;
}

button {
  color: inherit;
  cursor: pointer;
}

`

// Finds the component to render, and removes the `export`s: a pen is a
// script, not a module anyone imports. Accepts `export default function X`,
// `export function X`, `export const X =`, `export default X`, and
// `export { X }`. Renders `component` if given, otherwise the default
// export, otherwise the only exported name starting with a capital letter.
function takeComponent(
  title: string,
  js: string,
  component?: string
): { js: string; component: string } {
  const defaultExport =
    js.match(/^export default function (\w+)/m)?.[1] ??
    js.match(/^export default (\w+);?$/m)?.[1]
  const named = [
    ...[...js.matchAll(/^export (?:async )?function (\w+)/gm)].map((m) => m[1]),
    ...[...js.matchAll(/^export (?:const|let) (\w+)\s*=/gm)].map((m) => m[1]),
    ...[...js.matchAll(/^export \{([^}]*)\}/gm)].flatMap((m) =>
      // `export { A, B as C }` exports A and C; C is a name for B.
      m[1].split(",").map((name) => name.trim().split(/\s+as\s+/)[0])
    ),
  ].filter(Boolean)
  const exported = [...new Set([defaultExport, ...named].filter(Boolean))]

  const components = exported.filter((name) => /^[A-Z]/.test(name!))
  const chosen =
    component ?? defaultExport ?? (components.length === 1 ? components[0] : null)

  if (!chosen || (component && !exported.includes(component))) {
    throw new Error(
      component
        ? `${title}: \`${component}\` isn't exported. Exports: ${exported.join(", ") || "none"}`
        : `${title}: can't tell which component to render (${components.join(", ") || "no exported components"}). Export one component, or pass \`component\` to <OpenInCodePen>.`
    )
  }

  return {
    component: chosen!,
    js: js
      .replace(/^export default function/m, "function")
      .replace(/^export default \w+;?\n/m, "")
      .replace(/^export (?=(?:async )?function |const |let )/gm, "")
      .replace(/^export \{[^}]*\};?\n/gm, ""),
  }
}

// Images at a path on this site ("/img/slides/1.svg") become full URLs, since
// the pen runs on codepen.io. Full URLs ("https://...") are left alone.
// A pen made from local dev only shows them while the dev server runs.
const SITE_ASSET =
  /(["'`(])(\/(?!\/)[^"'`()\s]+\.(?:avif|gif|jpe?g|png|svg|webp))(?=["'`)])/gi

function absoluteAssets(code: string, origin: string): string {
  return origin ? code.replace(SITE_ASSET, `$1${origin}$2`) : code
}

function convertJs(
  title: string,
  source: string,
  versions: Versions,
  componentName?: string
): string {
  const PACKAGES = packageUrls(versions)
  let js = source
    .replace(/^import "@wethegit\/react-gallery\/style\.css"\n/m, "")
    .replace(/(from |import )"([^".][^"]*)"/g, (match, keyword, pkg) => {
      if (!PACKAGES[pkg]) {
        throw new Error(`${title}: no CodePen URL for package "${pkg}"`)
      }
      return `${keyword}"${PACKAGES[pkg]}"`
    })
    // Removed imports leave stacked blank lines behind.
    .replace(/\n{3,}/g, "\n\n")

  const relative = js.match(/from "\.[^"]*"/)
  if (relative) {
    throw new Error(`${title}: CodePen can't load the local import ${relative[0]}`)
  }

  const taken = takeComponent(title, js, componentName)
  js = taken.js
  const { component } = taken

  // CodePen's Babel uses the classic JSX transform, which needs React in scope.
  const header = [
    /^import React\b/m.test(js) ? null : `import React from "${PACKAGES.react}"`,
    `import { createRoot } from "${PACKAGES["react-dom/client"]}"`,
  ]
    .filter(Boolean)
    .join("\n")

  return `${header}\n${js}\ncreateRoot(document.getElementById("root")).render(<${component} />)\n`
}

function convertCss(css: string): string {
  // `:global(.markdown) .card` only matters inside Docusaurus; as plain
  // selectors it's harmless.
  return THEME_FALLBACKS + css.replace(/:global\(([^)]*)\)/g, "$1")
}

// What `!!ts-to-js?codepen!` exports for a demo.
export interface PenSource {
  js: string
  css: string
}

export function toCodePen({
  title,
  source,
  component,
  assetOrigin,
  versions,
}: {
  title: string
  source: PenSource
  // The exported component to render, if the file exports more than one.
  component?: string
  // Where this site is served from, e.g. "http://localhost:3000", for
  // turning image paths into full URLs. Empty during the static build.
  assetOrigin: string
  versions: Versions
}): Pen {
  // An older ts-to-js loader ignores `?codepen` and returns a plain string.
  // That happens when the loader file is out of date, or the dev server was
  // started before it changed (loaders only load once, at startup).
  if (typeof source?.js !== "string" || typeof source.css !== "string") {
    throw new Error(
      `${title}: expected { js, css } from "!!ts-to-js?codepen!...", got ${typeof source}. Check that src/loaders/ts-to-js.cjs is up to date, then restart the dev server.`
    )
  }

  return {
    title: `@wethegit/react-gallery: ${title}`,
    html: `<div id="root"></div>`,
    css: absoluteAssets(convertCss(source.css), assetOrigin),
    css_pre_processor: "none",
    css_external: galleryCssUrl(versions),
    js: absoluteAssets(convertJs(title, source.js, versions, component), assetOrigin),
    js_pre_processor: "babel",
    // Panes in HTML, CSS, JS order: hide HTML, open CSS and JS.
    editors: "011",
  }
}
