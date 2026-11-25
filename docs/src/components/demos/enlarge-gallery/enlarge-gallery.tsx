import { useCallback, useState, PropsWithChildren, CSSProperties } from "react"
import { Gallery, useGallery, GalleryMain, GalleryItem } from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import styles from "./enlarge-gallery.module.scss"

import { SLIDES, type Slide } from "../../../data/shared-data"

interface Item extends Slide {
  number: number
}

const ITEMS: Item[] = SLIDES.map((slide, index) => ({ ...slide, number: index + 1 }))

export function EnlargeGallery() {
  // The thumbnail strip as a queue of item ids, left to right; the active
  // item is excluded. Every change removes the incoming item from the queue
  // and pushes the outgoing item onto the end.
  const [thumbOrder, setThumbOrder] = useState(() =>
    ITEMS.slice(1).map((item) => item.number)
  )

  const handleChange = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      setThumbOrder((order) => [
        ...order.filter((number) => number !== ITEMS[newIndex].number),
        ITEMS[oldIndex].number,
      ])
    },
    []
  )

  return (
    <div className={styles.root}>
      <Gallery
        items={ITEMS}
        draggable={false}
        className={styles.gallery}
        onChange={handleChange}
      >
        <SlidesLayout thumbOrder={thumbOrder} />
        <ActiveContent thumbOrder={thumbOrder} />
      </Gallery>
    </div>
  )
}

function ActiveContent({ thumbOrder }: { thumbOrder: number[] }) {
  const indexOfId = (id: number) => ITEMS.findIndex((item) => item.number === id)

  const { activeIndex, goToIndex } = useGallery()
  const item = SLIDES[activeIndex]

  return (
    <div className={styles.rail}>
      <div className={styles.content} key={item.id}>
        <p className={styles.kicker}>
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(SLIDES.length).padStart(2, "0")}
        </p>
        <h2 className={styles.title}>{item.title}</h2>
        <p className={styles.description}>{item.description}</p>
      </div>

      {/*
       * Deck-rotation nav: next pulls up the leftmost thumbnail, previous the
       * rightmost — which is the most recently viewed, since every change
       * pushes the outgoing item to the end of the strip. The queue never
       * empties, so neither direction ever disables.
       */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goToIndex(indexOfId(thumbOrder[thumbOrder.length - 1]))}
        >
          <SvgIcon>
            <polyline points="15 18 9 12 15 6" />
          </SvgIcon>
          <span className={styles.visuallyHidden}>Previous</span>
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => goToIndex(indexOfId(thumbOrder[0]))}
        >
          <SvgIcon>
            <polyline points="9 18 15 12 9 6" />
          </SvgIcon>
          <span className={styles.visuallyHidden}>Next</span>
        </button>
      </div>
    </div>
  )
}

function SlidesLayout({ thumbOrder }: { thumbOrder: number[] }) {
  const { goToIndex } = useGallery()

  return (
    <GalleryMain<Item>
      className={styles.track}
      renderGalleryItem={({ item, index, active }) => {
        // Strip slot comes from the queue, centered around the middle of the
        // screen. The active item isn't in the queue (indexOf -1), but its
        // offset is unused while the full-screen transform applies.
        const offset = thumbOrder.indexOf(item.number) - (thumbOrder.length - 1) / 2

        return (
          <GalleryItem
            key={item.id}
            index={index}
            active={active}
            className={styles.item}
            data-active={String(active)}
          >
            <div className={styles.slide} style={{ "--offset": offset } as CSSProperties}>
              <img src={item.image} alt={item.alt} className={styles.image} />
              {!active && (
                <button
                  type="button"
                  className={styles.thumbButton}
                  tabIndex={-1}
                  onClick={() => goToIndex(index)}
                >
                  <span className={styles.visuallyHidden}>Show {item.title}</span>
                </button>
              )}
            </div>
          </GalleryItem>
        )
      }}
    />
  )
}

function SvgIcon({ children }: PropsWithChildren) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}
