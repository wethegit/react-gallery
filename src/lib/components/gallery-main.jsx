// packages
import PropTypes from "prop-types"
import { useCallback } from "react"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../utils/classnames"

export const GalleryMain = ({ renderGalleryItem, className, ...props }) => {
  const {
    activeIndex,
    galleryItems,
    next,
    previous,
    draggable,
    touchState,
    setTouchState,
    swipeThreshold,
  } = useGallery()

  const handlePointerDown = useCallback(() => {
    if (!draggable) return

    setTouchState((prevState) => ({ ...prevState, isDragging: true }))
  }, [draggable, setTouchState])

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggable) return

      /*
        first check if we haven't already determined if
        the user is scrolling vertically, then check we're
        actually in dragging mode, and finally if we have
        touch point data
      */
      if (!touchState.scrolling && touchState.isDragging === true && event.clientY) {
        if (!touchState.start) {
          /*
            this is the first move event after touch start
            we need to store the start x/y position
          */
          setTouchState((d) => ({
            ...d,
            start: { x: event.clientX, y: event.clientY },
          }))
        } else {
          const xOffset = event.clientX - touchState.start.x
          const yOffset = event.clientY - touchState.start.y
          if (!touchState.offsetting) {
            /*
              We're not yet in a scrolling mode. We want to determine which direction
              the user appears to want to scroll in (vertical or horizontal)
            */
            if (Math.abs(yOffset) > 20) {
              /*
                if the user appears to be scrolling down ignore touch inputs
              */
              setTouchState((d) => ({ ...d, scrolling: true }))
            }
            if (Math.abs(xOffset) > 10) {
              /*
                if the user appears to be scrolling sideways we'll set the
                offset position and put this in offseting mode (scrolling horizontally)
              */
              setTouchState((d) => ({ ...d, offsetting: true, xOffset }))
            }
          } else {
            /*
              we've already checked the scroll direction and we're srolling horizonatally
            */
            setTouchState((d) => ({ ...d, xOffset }))
          }
        }
      }
    },
    [
      draggable,
      touchState.scrolling,
      touchState.isDragging,
      touchState.start,
      touchState.offsetting,
      setTouchState,
    ]
  )

  const handlePointerUp = useCallback(() => {
    if (!draggable) return

    if (touchState.isDragging) {
      /*
          check if the offset value is more than the swipeThreshold.
          if it is then we'll move to the next or prev item in the gallery,
          otherwise it'll just spring back to the current position.
        */
      if (Math.abs(touchState.xOffset) > swipeThreshold) {
        if (touchState.xOffset < 0) next()
        else previous()
      }

      // reset all the touchState values.
      setTouchState((prevState) => ({
        ...prevState,
        isDragging: false,
        xOffset: 0,
        start: 0,
        offsetting: false,
        scrolling: false,
      }))
    }
  }, [
    draggable,
    touchState.isDragging,
    touchState.xOffset,
    swipeThreshold,
    setTouchState,
    next,
    previous,
  ])

  return (
    <ul
      className={classnames(["gallery__main", className])}
      onPointerDown={draggable ? handlePointerDown : null}
      onPointerMove={draggable ? handlePointerMove : null}
      onPointerUp={draggable ? handlePointerUp : null}
      style={{ "--selected": activeIndex, "--total": galleryItems.length }}
      {...props}
    >
      {galleryItems.map((item, index) => {
        const active = activeIndex === index
        return renderGalleryItem({ item, index, activeIndex, active })
      })}
    </ul>
  )
}

GalleryMain.propTypes = {
  renderGalleryItem: PropTypes.func.isRequired,
  className: PropTypes.string,
}
