import { useContext } from "react"

import { GalleryContext } from "../components/gallery-context"

export const useGallery = () => {
  const context = useContext(GalleryContext)

  if (!context) {
    throw new Error("useGallery must be called from within a <Gallery>.")
  }

  return context
}
