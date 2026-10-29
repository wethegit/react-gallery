// Webpack loader: turns a .ts/.tsx file into the equivalent JavaScript source
// text, for the JS tab of <SourceTabs>. Used inline, like raw-loader:
//
//   import js from "!!ts-to-js!@site/src/components/demos/BasicGallery.tsx"
//
// TypeScript strips the types but reprints the code in its own style and
// drops blank lines, so blank lines are kept as marker comments and Prettier
// puts the formatting back to match the TS source.
const ts = require("typescript")
const prettier = require("prettier")

const BLANK = "//__ts-to-js-blank__"

module.exports = function tsToJs(source) {
  const callback = this.async()

  const { outputText } = ts.transpileModule(source.replace(/^[ \t]*$/gm, BLANK), {
    fileName: this.resourcePath,
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  })

  const restored = outputText.replace(new RegExp(`^[ \\t]*${BLANK}$`, "gm"), "")

  prettier
    .format(restored, {
      parser: "babel",
      semi: false,
      trailingComma: "es5",
    })
    .then((js) => callback(null, `export default ${JSON.stringify(js)}`), callback)
}
