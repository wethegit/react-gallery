import { useVersions } from "../hooks/use-versions"

// The installed @wethegit/react-gallery version, e.g. "6.0.0-beta.0".
export function GalleryVersion() {
  return <>{useVersions().galleryVersion}</>
}
