import CodeBlock from "@theme/CodeBlock"
import TabItem from "@theme/TabItem"
import Tabs from "@theme/Tabs"

const hasExtension = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf(".")
  return lastDotIndex > 0 && lastDotIndex < filename.length - 1
}

interface SourceTabsProps {
  // File name without extension, e.g. "BasicGallery".
  file: string
  // Imported with `!!raw-loader!`.
  ts: string
  // The same file imported with `!!ts-to-js!`.
  js: string
  // The same file imported with `!!raw-loader!`.
  scss: string
}

// TypeScript / JavaScript toggle for a demo's source. The `groupId` keeps
// the choice in sync across every block and page, and Docusaurus remembers
// it between visits.
export function SourceTabs({ file, ts, js, scss }: SourceTabsProps) {
  const extensionExist = hasExtension(file)

  return (
    <Tabs groupId="code-language">
      {ts && (
        <TabItem value="ts" label="TypeScript" default>
          <CodeBlock language="tsx" title={extensionExist ? file : `${file}.tsx`}>
            {ts}
          </CodeBlock>
        </TabItem>
      )}

      {js && (
        <TabItem value="js" label="JavaScript">
          <CodeBlock language="jsx" title={extensionExist ? file : `${file}.jsx`}>
            {js}
          </CodeBlock>
        </TabItem>
      )}

      {scss && (
        <TabItem value="scss" label="SCSS">
          <CodeBlock
            language="scss"
            title={extensionExist ? file : `${file}.module.scss`}
          >
            {scss}
          </CodeBlock>
        </TabItem>
      )}
    </Tabs>
  )
}
