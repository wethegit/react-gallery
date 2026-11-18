import {
  Gallery,
  GalleryItem,
  GalleryMain,
  GalleryNav,
  useGallery,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import { SLIDES, type Slide } from "@site/src/data/shared-data"

import styles from "../../../styles/shared.module.scss"
import stack from "./card-stack.module.scss"

function StackControls() {
  const { activeIndex, galleryItems, goToIndex } = useGallery<Slide>()

  return (
    <div className={styles.controls}>
      <GalleryNav direction={0} className={styles.arrow}>
        <span aria-hidden="true">&larr;</span>
        <span className={styles.visuallyHidden}>Previous card</span>
      </GalleryNav>

      <span className={styles.counter}>
        {activeIndex + 1} / {galleryItems.length}
      </span>

      <GalleryNav direction={1} className={styles.arrow}>
        <span aria-hidden="true">&rarr;</span>
        <span className={styles.visuallyHidden}>Next card</span>
      </GalleryNav>

      <button
        type="button"
        className={stack.restart}
        onClick={() => goToIndex(0)}
        disabled={activeIndex === 0}
      >
        Start over
      </button>
    </div>
  )
}

export function CardStackGallery() {
  return (
    <div className={styles.card}>
      <Gallery items={SLIDES} visibleRange={3} className={stack.gallery}>
        <GalleryMain<Slide>
          className={stack.stack}
          renderGalleryItem={({ item, index, active }) => (
            <GalleryItem
              key={item.id}
              index={index}
              active={active}
              className={stack.stackCard}
            >
              <img src={item.image} alt={item.alt} />
              <div className={stack.body}>
                <p className={stack.title}>{item.title}</p>
                <p className={stack.description}>{item.description}</p>
              </div>
            </GalleryItem>
          )}
        />

        <StackControls />
      </Gallery>
    </div>
  )
}
