import { useState } from "react"
import { classnames } from "@site/src/utils/classnames"
import {
  Gallery,
  GalleryItem,
  GalleryMain,
  GalleryNav,
  useGallery,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import { SLIDES, type Slide } from "../../../data/shared-data"

import styles from "../../../styles/shared.module.scss"

// Needs gallery context, so it lives inside <Gallery>.
function Counter() {
  const { activeIndex, galleryItems } = useGallery()
  return (
    <span className={styles.counter} aria-hidden="true">
      {activeIndex + 1} / {galleryItems.length}
    </span>
  )
}

export function LoopingGallery() {
  const [loop, setLoop] = useState(true)

  return (
    <div className={styles.card}>
      <div className={styles.rangeControls}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={loop}
            onChange={(event) => setLoop(event.target.checked)}
          />
          <code>loop</code>
        </label>
        <span className={styles.hint}>
          Go to the last slide, then press next. With loop off, the arrows disable at the
          ends instead.
        </span>
      </div>

      <Gallery items={SLIDES} loop={loop} className={styles.gallery}>
        <GalleryMain<Slide>
          renderGalleryItem={({ item, index, active }) => (
            <GalleryItem
              key={item.id}
              index={index}
              active={active}
              className={classnames([styles.slide, active && styles.isActive])}
            >
              <img src={item.image} alt={item.alt} />
            </GalleryItem>
          )}
        />

        <div className={styles.controls}>
          <GalleryNav direction={0} className={styles.arrow}>
            <span aria-hidden="true">&larr;</span>
            <span className={styles.visuallyHidden}>Previous item</span>
          </GalleryNav>

          <Counter />

          <GalleryNav direction={1} className={styles.arrow}>
            <span aria-hidden="true">&rarr;</span>
            <span className={styles.visuallyHidden}>Next item</span>
          </GalleryNav>
        </div>
      </Gallery>
    </div>
  )
}
