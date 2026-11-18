import CodeBlock from "@theme/CodeBlock"
import TabItem from "@theme/TabItem"
import Tabs from "@theme/Tabs"

interface SourceTabsProps {
  // File name without extension, e.g. "BasicGallery".
  file: string
  // Imported with `!!raw-loader!`.
  ts: string
  // The same file imported with `!!ts-to-js!`.
  js: string
}

// TypeScript / JavaScript toggle for a demo's source. The `groupId` keeps
// the choice in sync across every block and page, and Docusaurus remembers
// it between visits.
export function SourceTabs({ file, ts, js }: SourceTabsProps) {
  return (
    <Tabs groupId="code-language">
      <TabItem value="ts" label="TypeScript" default>
        <CodeBlock language="tsx" title={`${file}.tsx`}>
          {ts}
        </CodeBlock>
      </TabItem>
      <TabItem value="js" label="JavaScript">
        <CodeBlock language="jsx" title={`${file}.jsx`}>
          {js}
        </CodeBlock>
      </TabItem>
    </Tabs>
  )
}
