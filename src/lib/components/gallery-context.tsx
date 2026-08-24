"use client"

import {
  createContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  CSSProperties,
} from "react"
import type { GalleryContextValue, GalleryProps } from "../index"

import { classnames } from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryContext = createContext<GalleryContextValue<unknown> | null>(null)

export const INITIAL_TOUCH_STATE = {
  isDragging: false,
  start: { x: 0, y: 0 },
  xOffset: 0,
  offsetting: false,
  scrolling: true,
}

export const swipeThreshold = 50

/**
 * Gallery Component
 * ---
 * @example
    <Gallery items={GALLERY_ITEMS}>
      <GalleryMain<GalleryItemData>
        renderGalleryItem={({ item, index, active }) => (
          <GalleryItem key={item.id} index={index} active={active}>
            <img src={item.image} alt={item.alt} />
          </GalleryItem>
        )}
      />
    </Gallery>
 */
export const Gallery = <T,>({
  loop = false,
  draggable = true,
  startIndex = 0,
  visibleRange = -1,
  ariaLiveText = "Item $i of $t.",
  items,
  onChange,
  className,
  children,
}: GalleryProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(() => startIndex || 0)
  const [previouslyActiveIndex, setPreviouslyActiveIndex] = useState(
    () => startIndex || 0
  )
  const [touchState, setTouchState] = useState(() => INITIAL_TOUCH_STATE)
  const itemNodes = useRef([])

  if (!Array.isArray(items)) throw new Error("<Gallery> items prop must be an Array.")

  const next = useCallback(() => {
    setPreviouslyActiveIndex(activeIndex)

    setActiveIndex((currentIndex) => {
      let newIndex = currentIndex + 1

      if (currentIndex === items.length - 1) {
        newIndex = loop ? 0 : currentIndex
      }

      if (onChange) onChange({ oldIndex: currentIndex, newIndex, direction: 1 })

      return newIndex
    })
  }, [activeIndex, items.length, loop, onChange])

  const previous = useCallback(() => {
    setPreviouslyActiveIndex(activeIndex)

    setActiveIndex((currentIndex) => {
      let newIndex = currentIndex - 1

      if (currentIndex === 0) {
        newIndex = loop ? items.length - 1 : currentIndex
      }

      if (onChange) onChange({ oldIndex: currentIndex, newIndex, direction: 0 })

      return newIndex
    })
  }, [activeIndex, items.length, loop, onChange])

  const goToIndex = useCallback(
    (index?: number) => {
      const validatedIndex = index === undefined || !items[index] ? 0 : index

      setPreviouslyActiveIndex(activeIndex)

      setActiveIndex(validatedIndex)
      const direction = validatedIndex - activeIndex > 0 ? 1 : 0
      if (onChange)
        onChange({ oldIndex: activeIndex, newIndex: validatedIndex, direction })
    },
    [activeIndex, onChange, items]
  )

  // This useEffect checks to see if the gallery item (index) exists, and if it
  // doesn't it resets the gallery to the first slide (0). The edge case here
  // becomes apparent when or if the length of gallery items changes, for instance
  // separating/grouping items based on screen size.

  useEffect(() => {
    if (!items[activeIndex]) goToIndex(0)
  }, [activeIndex, items, goToIndex])

  const value: GalleryContextValue<T> = {
    galleryItems: items,
    itemNodes,
    startIndex,
    activeIndex,
    setActiveIndex,
    previouslyActiveIndex,
    setPreviouslyActiveIndex,
    goToIndex,
    next,
    previous,
    loop,
    draggable,
    touchState,
    setTouchState,
    swipeThreshold,
    onChange,
    visibleRange,
  }

  return (
    <GalleryContext.Provider value={value}>
      <div
        className={classnames([
          styles.gallery,
          draggable && styles["gallery--draggable"],
          className,
        ])}
        style={{ "--touch-offset": touchState.xOffset } as CSSProperties}
      >
        {children}

        {ariaLiveText && (
          <p aria-live="polite" className={styles["visually-hidden"]}>
            {ariaLiveText
              .replace("$i", String(activeIndex + 1))
              .replace("$t", String(items.length))}
          </p>
        )}
      </div>
    </GalleryContext.Provider>
  )
}
