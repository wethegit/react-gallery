import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

interface Versions {
  galleryVersion: string
  reactVersion: string
}

// Installed package versions, read from node_modules in docusaurus.config.ts.
export function useVersions(): Versions {
  const { galleryVersion, reactVersion } = useDocusaurusContext().siteConfig
    .customFields as unknown as Versions
  return { galleryVersion, reactVersion }
}
