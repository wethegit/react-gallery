// `import x from "!!raw-loader!./file"` gives the file's contents as a string.
declare module "!!raw-loader!*" {
  const content: string
  export default content
}

// `import x from "!!ts-to-js!./file.tsx"` gives the file as JavaScript source
// text. See src/loaders/ts-to-js.cjs.
declare module "!!ts-to-js!*" {
  const content: string
  export default content
}

// A demo prepared for "Edit in CodePen": JavaScript with the site's own
// modules pasted in, plus its CSS modules compiled to CSS.
declare module "!!ts-to-js?codepen!*" {
  const content: { js: string; css: string }
  export default content
}
