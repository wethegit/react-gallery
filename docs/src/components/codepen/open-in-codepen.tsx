import { useEffect, useState } from "react"

import { useVersions } from "../hooks/use-versions"

import { toCodePen, type PenSource } from "./to-code-pen"

interface OpenInCodePenProps {
  title: string
  // The demo prepared for CodePen, imported with `!!ts-to-js?codepen!`:
  // JavaScript with the site's own modules pasted in, plus its compiled CSS.
  source: PenSource
  // The exported component to render. Only needed when the demo file
  // exports more than one component.
  component?: string
}

// Posts the demo to CodePen in a new tab. Nothing is saved on CodePen until
// the visitor saves it themselves.
export function OpenInCodePen({ title, source, component }: OpenInCodePenProps) {
  const versions = useVersions()
  // Known only in the browser; the static build has no address to use.
  const [origin, setOrigin] = useState("")
  useEffect(() => setOrigin(window.location.origin), [])

  // Converting on every render (including the static build) means a demo
  // that can't be converted fails the build.
  const pen = toCodePen({
    title,
    source,
    component,
    assetOrigin: origin,
    versions,
  })

  return (
    <form
      action="https://codepen.io/pen/define"
      method="POST"
      target="_blank"
      style={{ marginBottom: "1.5rem" }}
    >
      <input type="hidden" name="data" value={JSON.stringify(pen)} />
      <button
        type="submit"
        className="button button--secondary button--sm"
        disabled={!origin}
      >
        Edit in CodePen
      </button>
    </form>
  )
}
