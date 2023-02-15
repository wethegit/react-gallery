// packages
import PropTypes from "prop-types"
import { createContext, useRef, useState } from "react"

// utils
import classnames from "../lib/classnames"

// styles
import * as styles from "./gallery.module.scss"

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

  const next = () => {
    setPreviouslyActiveIndex(activeIndex)

    setActiveIndex((currentIndex) => {
      let newIndex = currentIndex + 1

      if (currentIndex === items.length - 1) {
        newIndex = loop ? 0 : currentIndex
      }

      if (onChange) onChange({ oldIndex: currentIndex, newIndex, direction: 1 })

      return newIndex
    })
  }

  const previous = () => {
    setPreviouslyActiveIndex(activeIndex)

    setActiveIndex((currentIndex) => {
      let newIndex = currentIndex - 1

      if (currentIndex === 0) {
        newIndex = loop ? items.length - 1 : currentIndex
      }

      if (onChange) onChange({ oldIndex: currentIndex, newIndex, direction: 0 })

      return newIndex
    })
  }

  const goToIndex = (index) => {
    setPreviouslyActiveIndex(activeIndex)

    setActiveIndex(index)
    const direction = index - activeIndex > 0 ? 1 : 0
    if (onChange) onChange({ oldIndex: activeIndex, newIndex: index, direction })
  }

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
        className={classnames([styles.gallery, "gallery", className])}
        style={{ "--touch-offset": touchState.xOffset }}
      >
        {children}

        {ariaLiveText && (
          <p aria-live="polite" className="visually-hidden">
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
