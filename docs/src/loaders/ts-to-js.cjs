// Webpack loader: turns a .ts/.tsx file into the equivalent JavaScript source
// text, for the JS tab of <SourceTabs>. Used inline, like raw-loader:
//
//   import js from "!!ts-to-js!@site/src/components/demos/BasicGallery.tsx"
//
// TypeScript strips the types but reprints the code in its own style and
// drops blank lines, so blank lines are kept as marker comments and Prettier
// puts the formatting back to match the TS source.
//
// With `?codepen`, it prepares a demo for "Edit in CodePen", which can only
// load packages from a CDN, and exports `{ js, css }` instead of a string:
//
//   import pen from "!!ts-to-js?codepen!@site/src/components/demos/BasicGallery.tsx"
//
// - Imports of the site's own modules (`@site/...`, `./...`, `../...`) are
//   replaced by those modules' code, e.g. the slide data and the
//   classnames helper.
// - Imported CSS modules (`import styles from "./demos.module.scss"`) are
//   compiled to CSS here, so the pen gets exactly the site's CSS whatever
//   Sass version CodePen runs. References like `styles.card` become plain
//   class names. Classes from any module other than `styles` get the
//   module's name as a prefix (`coverflow.gallery` -> "coverflow-gallery")
//   so they can't clash with the shared demo styles.
const fs = require("fs")
const { pathToFileURL } = require("url")
const ts = require("typescript")
const prettier = require("prettier")
const sass = require("sass")

const BLANK = "//__ts-to-js-blank__"

function transpile(source, fileName) {
  const { outputText } = ts.transpileModule(source.replace(/^[ \t]*$/gm, BLANK), {
    fileName,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  })
  return outputText.replace(new RegExp(`^[ \\t]*${BLANK}$`, "gm"), "")
}

function resolve(loader, request) {
  return new Promise((done, fail) =>
    loader.resolve(loader.context, request, (error, result) =>
      error ? fail(error) : done(result)
    )
  )
}

// After the last import, so the file still starts with its imports.
function insertAfterImports(js, code) {
  const lastImport = [...js.matchAll(/^import .*\n/gm)].at(-1)
  const at = lastImport ? lastImport.index + lastImport[0].length : 0
  return `${js.slice(0, at)}\n${code}\n${js.slice(at)}`
}

// --- The site's own modules -------------------------------------------------

// `import x from "@site/..."`, `import { a, b as c } from "./..."`, or both.
// (TypeScript's output ends imports with a semicolon.)
const LOCAL_IMPORT =
  /^import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s+"((?:@site|\.{1,2})\/[^"]+)";?\n/gm

// Turns a module's code into plain declarations that can be pasted into
// another file, and returns the name of its default export, if any.
function stripExports(code, request) {
  let defaultName = null
  const body = code
    .replace(/^export default (?:async )?function\s+(\w+)/m, (match, name) => {
      defaultName = name
      return match.replace("export default ", "")
    })
    // `export default classnames;` after the function: just note the name.
    .replace(/^export default (\w+);?$/m, (match, name) => {
      defaultName = name
      return ""
    })
    .replace(/^export default (?!function)/m, () => {
      defaultName = "__default"
      return "const __default = "
    })
    .replace(/^export (?=(?:async )?function|const|let|class)/gm, "")

  if (/^export\b/m.test(body)) {
    throw new Error(
      `ts-to-js: can't inline ${request}: only \`export default\`, \`export function\`, \`export const\`, \`export let\`, and \`export class\` are supported`
    )
  }
  return { body: body.trim(), defaultName }
}

async function inlineLocalModules(loader, js) {
  const blocks = []
  const imports = [...js.matchAll(LOCAL_IMPORT)].filter(
    ([, , , request]) => !/\.s?css$/.test(request)
  )

  for (const [match, defaultImport, namedImports, request] of imports) {
    const file = await resolve(loader, request)
    loader.addDependency(file)

    const { body, defaultName } = stripExports(
      transpile(fs.readFileSync(file, "utf8"), file),
      request
    )
    const aliases = []
    if (defaultImport && defaultImport !== defaultName) {
      if (!defaultName) {
        throw new Error(`ts-to-js: ${request} has no default export`)
      }
      aliases.push(`const ${defaultImport} = ${defaultName}`)
    }
    for (const named of (namedImports ?? "").split(",")) {
      const [name, alias] = named.trim().split(/\s+as\s+/)
      if (alias) aliases.push(`const ${alias} = ${name}`)
    }

    blocks.push([`// From ${request}`, body, ...aliases].join("\n"))
    js = js.replace(match, "")
  }

  return blocks.length ? insertAfterImports(js, blocks.join("\n\n")) : js
}

// --- CSS modules --------------------------------------------------------------

const STYLESHEET_IMPORT = /^import\s+(\w+)\s+from\s+"([^"]+\.module\.scss)";?\n/gm

// Sass drops `//` comments, so turn full-line ones into `/* */` comments,
// which it keeps.
function keepLineComments(scss) {
  const out = []
  let block = null
  const flush = () => {
    if (!block) return
    const lines = block.lines.map((line) => line.replace(/\*\//g, "* /"))
    out.push(
      lines.length === 1
        ? `${block.indent}/* ${lines[0]} */`
        : [
            `${block.indent}/*`,
            ...lines.map((line) => `${block.indent} * ${line}`.trimEnd()),
            `${block.indent} */`,
          ].join("\n")
    )
    block = null
  }

  for (const line of scss.split("\n")) {
    const comment = line.match(/^(\s*)\/\/ ?(.*)$/)
    if (comment) {
      if (block) block.lines.push(comment[2])
      else block = { indent: comment[1], lines: [comment[2]] }
    } else {
      flush()
      out.push(line)
    }
  }
  flush()
  return out.join("\n")
}

// Adds `prefix` to every class selector, outside comments. Numbers like
// `0.5rem` aren't matched: the character after the dot is a digit.
function prefixClasses(css, prefix) {
  return css
    .split(/(\/\*[\s\S]*?\*\/)/)
    .map((part, i) =>
      i % 2 ? part : part.replace(/\.(-?[_a-zA-Z][\w-]*)/g, `.${prefix}$1`)
    )
    .join("")
}

async function inlineStylesheets(loader, js) {
  const sheets = []

  for (const [match, name, request] of [...js.matchAll(STYLESHEET_IMPORT)]) {
    const file = await resolve(loader, request)
    loader.addDependency(file)

    const prefix = name === "styles" ? "" : `${name}-`
    let { css } = sass.compileString(keepLineComments(fs.readFileSync(file, "utf8")), {
      url: pathToFileURL(file),
      style: "expanded",
    })
    if (prefix) css = prefixClasses(css, prefix)
    sheets.push(`/* From ${request.replace(/^.*\//, "")} */\n${css}`)

    js = js
      .replace(match, "")
      // className={styles.card} -> className="card", then any other styles.x
      .replace(new RegExp(`=\\{${name}\\.(\\w+)\\}`, "g"), `="${prefix}$1"`)
      .replace(new RegExp(`\\b${name}\\.(\\w+)`, "g"), `"${prefix}$1"`)
  }

  return { js, css: sheets.join("\n\n") }
}

// -----------------------------------------------------------------------------

async function toCodePenSource(loader, js) {
  const withModules = await inlineLocalModules(loader, js)
  return inlineStylesheets(loader, withModules)
}

const format = (js) =>
  prettier.format(js, { parser: "babel", semi: false, trailingComma: "es5" })

module.exports = function tsToJs(source) {
  const callback = this.async()
  // Inline loader options arrive as the query string: "?codepen".
  const codepen = /\bcodepen\b/.test(String(this.query ?? ""))
  const js = transpile(source, this.resourcePath)

  const result = codepen
    ? toCodePenSource(this, js).then(async (pen) => ({
        js: await format(pen.js),
        css: pen.css,
      }))
    : format(js)

  result.then(
    (output) => callback(null, `export default ${JSON.stringify(output)}`),
    callback
  )
}
