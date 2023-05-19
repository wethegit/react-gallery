import React from "react"
import ReactDOM from "react-dom"
import { Gallery, GalleryMain, GalleryNav, GalleryPagination, useGallery } from "./lib"

export const GALLERY_ITEMS = [
  {
    image:
      "https://images.unsplash.com/photo-1680212703757-2565f02a653e?auto=format&fit=crop&w=1000&height=500&q=80",
    alt: "",
    id: 131789,
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
  return (
    <Gallery items={GALLERY_ITEMS}>
      <GalleryMain
        renderGalleryItem={({ item }) => <img src={item.image} alt={item.alt} />}
      />

      <GalleryNav direction={0}>⬅️</GalleryNav>
      <GalleryNav direction={1}>➡️</GalleryNav>

      <GalleryPagination renderPaginationItem={({ i }) => <span>{i + 1}</span>} />
      <GalleryDescription />
    </Gallery>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
