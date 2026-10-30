import path from "path"
import fs from "fs"
import { themes as prismThemes } from "prism-react-renderer"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"
import packageJson from "react/package.json"

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The installed package is the single source of truth for the version the docs describe,
// so upgrading it updates every page. Its `exports` doesn't expose package.json,
// so reading it from next to dist/style.css.
const galleryDist = path.dirname(require.resolve("@wethegit/react-gallery/style.css"))
const GALLERY_VERSION: string = JSON.parse(
  fs.readFileSync(path.join(galleryDist, "..", "package.json"), "utf8")
).version
const REACT_VERSION: string = packageJson.version

const config: Config = {
  title: "React Gallery",
  tagline: "React Gallery Demos",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://wethegit.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "wethegit", // Usually your GitHub org/user name.
  projectName: "react-gallery", // Usually your repo name.

  onBrokenLinks: "throw",

  customFields: {
    galleryVersion: GALLERY_VERSION,
    reactVersion: REACT_VERSION,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    "docusaurus-plugin-sass",
    // This is becase using the latest gallery throwing me an error with usage of require()
    // Somthing we need to look into and see if this just here in doc build or everywhere
    () => ({
      name: "react-gallery-umd",
      configureWebpack: () => ({
        resolve: {
          alias: {
            "@wethegit/react-gallery$": path.join(
              path.dirname(require.resolve("@wethegit/react-gallery/style.css")),
              "react-gallery.umd.cjs"
            ),
          },
        },
      }),
    }),
    // `!!ts-to-js!./File.tsx` imports a TypeScript file as JavaScript source
    // text, for the JS tab of <SourceTabs>.
    () => ({
      name: "ts-to-js-loader",
      configureWebpack: () => ({
        resolveLoader: {
          alias: {
            "ts-to-js": path.resolve(__dirname, "src/loaders/ts-to-js.cjs"),
          },
        },
      }),
    }),
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/wethegit/react-gallery/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/wethegit/react-gallery/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/styles/custom.scss",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "React Gallery",
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "/docs/demos/basic", label: "Demos", position: "left" },
        {
          href: "https://www.npmjs.com/package/@wethegit/react-gallery",
          label: "npm",
          position: "right",
        },
        {
          href: "https://github.com/wethegit/react-gallery",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    sidebar: {
      autoCollapseCategories: true,
      breakcrumbs: true,
      hideable: true,
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
            {
              label: "Getting Started",
              to: "/docs/getting-started",
            },
          ],
        },
        {
          title: "we { the collective }",
          items: [
            {
              label: "CodePen",
              href: "https://codepen.io/team/wtc",
            },
            {
              label: "X",
              href: "https://twitter.com/wethetweet",
            },
            {
              label: "NPM",
              href: "https://www.npmjs.com/~wethecollective",
            },
          ],
        },
        {
          title: "Contribute",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/wethegit/react-gallery",
            },
          ],
        },
      ],
      copyright: `Copyright © @wethegit/react-gallery v${GALLERY_VERSION} | ${new Date().getFullYear()} We the Collective.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["scss"],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
