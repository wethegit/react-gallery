import React from "react"
import { createRoot, Root } from "react-dom/client"

import {
  Gallery,
  GalleryMain,
  GalleryItem,
  GalleryNav,
  GalleryPagination,
  GalleryPaginationItem,
  useGallery,
} from "./lib"
import { GalleryPaginationItemClickArgs } from "./lib/components/gallery-pagination-item"

interface GalleryItemData {
  image: string
  alt: string
  id: number
}

// 1. Define a custom type extending the standard HTMLElement
interface RootHTMLElement extends HTMLElement {
  _reactRoot?: Root
}

export const GALLERY_ITEMS: GalleryItemData[] = [
  {
    image:
      "https://images.unsplash.com/photo-1680212703757-2565f02a653e?auto=format&fit=crop&w=1000&height=500&q=80",
    alt: "",
    id: 13178,
  },
  {
    image:
      "https://images.unsplash.com/photo-1663320858344-22507e90ab30?auto=format&fit=crop&w=1000&height=500&q=80",
    alt: "",
    id: 235233,
  },
  {
    image:
      "https://images.unsplash.com/photo-1656200088379-5b725a1bd4fe?auto=format&fit=crop&w=1000&height=500&q=80",
    alt: "",
    id: 987432,
  },
  {
    image:
      "https://images.unsplash.com/photo-1635372886251-5f0f23afe835?auto=format&fit=crop&w=1000&height=500&q=80",
    alt: "",
    id: 768324,
  },
]

function GalleryDescription() {
  const { activeIndex, previouslyActiveIndex, loop } = useGallery()

  return (
    <p>
      The gallery&apos;s current index is {activeIndex}, its last index was{" "}
      {previouslyActiveIndex}, and its <code>loop</code> prop is set to {String(loop)}!
    </p>
  )
}

function App() {
  // Example of custom onClick handler
  const handlePaginationItemClick = ({
    event,
    index,
  }: GalleryPaginationItemClickArgs) => {
    console.log(event, index)
  }

  return (
    <Gallery items={GALLERY_ITEMS}>
      <GalleryMain<GalleryItemData>
        renderGalleryItem={({ item, index, active }) => (
          <GalleryItem key={item.id} index={index} active={active}>
            <img src={item.image} alt={item.alt} />
          </GalleryItem>
        )}
      />

      <GalleryNav direction={0}>⬅️</GalleryNav>
      <GalleryNav direction={1}>➡️</GalleryNav>

      <GalleryPagination<GalleryItemData>
        renderPaginationItem={({ index, active, item }) => (
          <GalleryPaginationItem
            index={index}
            active={active}
            key={item.id}
            onClick={handlePaginationItemClick}
          >
            <span>{index + 1}</span>
          </GalleryPaginationItem>
        )}
      />
      <GalleryDescription />
    </Gallery>
  )
}

const rootElement = document.getElementById("root") as RootHTMLElement | null
if (!rootElement) throw new Error("Root element not found")

// Check if a root already exists on this rootElement to prevent re-intializing error on dev
if (!rootElement._reactRoot) {
  rootElement._reactRoot = createRoot(rootElement)
}

rootElement._reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
