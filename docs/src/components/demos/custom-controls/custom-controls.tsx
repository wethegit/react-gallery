import { useState } from "react"
import { Gallery, GalleryItem, GalleryMain, useGallery } from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import { classnames } from "@site/src/utils/classnames"

import { SLIDES, type Slide } from "../../../data/shared-data"
import styles from "../../../styles/shared.module.scss"

// Needs gallery context, so it lives inside <Gallery>.
function Controls() {
  const { activeIndex, galleryItems, next, previous, goToIndex } = useGallery<Slide>()

  return (
    <>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={previous}>
          <span aria-hidden="true">&larr;</span>
          <span className={styles.visuallyHidden}>Previous item</span>
        </button>

        <span className={styles.counter} aria-hidden="true">
          {activeIndex + 1} / {galleryItems.length}
        </span>

        <button type="button" className={styles.arrow} onClick={next}>
          <span aria-hidden="true">&rarr;</span>
          <span className={styles.visuallyHidden}>Next item</span>
        </button>
      </div>

      <ul className={styles.jumpList}>
        {galleryItems.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={classnames([
                "button button--sm button--primary",
                index !== activeIndex && "button--outline",
              ])}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goToIndex(index)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export function CustomControlsGallery() {
  const [events, setEvents] = useState<string[]>([])

  return (
    <div className={styles.card}>
      <Gallery
        items={SLIDES}
        loop
        className={styles.gallery}
        onChange={({ oldIndex, newIndex, direction }) => {
          // The gallery invokes onChange from inside its own state updater,
          // so updating our state synchronously here would trigger React's
          // "cannot update while rendering" error. So defering with timeout one tick.
          setTimeout(() => {
            setEvents((log) => [
              `onChange: oldIndex=${oldIndex} newIndex=${newIndex} direction=${direction}`,
              ...log.slice(0, 19),
            ])
          }, 0)
        }}
      >
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

        <Controls />
      </Gallery>

      <div className={styles.log} role="log" aria-label="onChange events">
        {events.length === 0 ? (
          <p>Navigate the gallery to see onChange events here.</p>
        ) : (
          events.map((entry, i) => <p key={`${entry}-${i}`}>{entry}</p>)
        )}
      </div>
    </div>
  )
}
