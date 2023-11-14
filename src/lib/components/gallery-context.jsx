// packages
import PropTypes from "prop-types"
import { createContext, useCallback, useRef, useState, useEffect } from "react"

// utils
import classnames from "../utils/classnames"

// styles
import "./gallery.css"

export const GalleryContext = createContext()

export const INITIAL_TOUCH_STATE = {
  isDragging: false,
  start: 0,
  xOffset: 0,
  offsetting: false,
  scrolling: true,
}

export const swipeThreshold = 50

export const Gallery = ({
  items,
  loop,
  draggable,
  onChange,
  startIndex,
  visibleRange,
  ariaLiveText,
  className,
  children,
}) => {
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
    (index) => {
      const validatedIndex = !items[index] ? 0 : index

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
    if (!items[activeIndex]) goToIndex()
  }, [activeIndex, items, goToIndex])

  const value = {
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
        className={classnames(["gallery", draggable && "gallery--draggable", className])}
        style={{ "--touch-offset": touchState.xOffset }}
      >
        {children}

        {ariaLiveText && (
          <p aria-live="polite" className="gallery-util-visually-hidden">
            {ariaLiveText.replace("$i", activeIndex + 1).replace("$t", items.length)}
          </p>
        )}
      </div>
    </GalleryContext.Provider>
  )
}

Gallery.propTypes = {
  items: PropTypes.array.isRequired,
  loop: PropTypes.bool,
  draggable: PropTypes.bool,
  onChange: PropTypes.func,
  startIndex: PropTypes.number,
  visibleRange: PropTypes.number,
  ariaLiveText: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

Gallery.defaultProps = {
  loop: false,
  draggable: true,
  startIndex: 0,
  visibleRange: -1,
  ariaLiveText: "Item $i of $t.",
}
