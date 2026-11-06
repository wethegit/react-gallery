import CodeBlock from "@theme/CodeBlock"

import { useVersions } from "../hooks/use-versions"

// Fenced code blocks can't interpolate, so install commands are rendered 0here.
// The version is pinned because a bare install picks the `latest` tag,
// which may not be the version these docs describe (e.g. a beta).

export function InstallCommand() {
  const pkg = `@wethegit/react-gallery@${useVersions().galleryVersion}`

  return (
    <CodeBlock language="bash">{`npm install ${pkg}\n# or\nyarn add ${pkg}`}</CodeBlock>
  )
}
