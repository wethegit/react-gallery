import { useContext } from "react"

import { GalleryContext } from "../components/gallery-context"
import { GalleryContextValue } from "../types/types"

export const useGallery = <T,>(): GalleryContextValue<T> => {
  const context = useContext(GalleryContext)

  if (!context) {
    throw new Error("useGallery must be called from within a <Gallery>.")
  }

  return context as GalleryContextValue<T>
}
