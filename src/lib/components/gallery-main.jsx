"use client"

import { useCallback, useRef } from "react"

import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

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

  /*
    Only the primary pointer can drive the drag; any other pointers (e.g. a
    second finger) are ignored. A new primary pointer can only go down once
    every previous touch has lifted, so if one arrives while a drag is still
    recorded we've missed its up/cancel event and it simply takes over.
  */
  const activePointerId = useRef(null)

  const resetDrag = useCallback(() => {
    activePointerId.current = null

    setTouchState((prevState) => ({
      ...prevState,
      isDragging: false,
      xOffset: 0,
      start: 0,
      offsetting: false,
      scrolling: false,
    }))
  }, [setTouchState])

  const handlePointerDown = useCallback(
    (event) => {
      if (!draggable) return
      if (!event.isPrimary) return

      const isStale = activePointerId.current !== null
      activePointerId.current = event.pointerId

      setTouchState((prevState) =>
        isStale
          ? // discard whatever was left over from the missed release
            {
              ...prevState,
              isDragging: true,
              xOffset: 0,
              start: 0,
              offsetting: false,
              scrolling: false,
            }
          : { ...prevState, isDragging: true }
      )
    },
    [draggable, setTouchState]
  )

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggable) return
      if (event.pointerId !== activePointerId.current) return

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

                Capture the pointer only now that it's a real drag, so it keeps
                tracking outside the gallery. Capturing on pointerdown would
                retarget the click from a plain tap away from links/buttons
                inside the slides.
              */
              event.currentTarget.setPointerCapture?.(event.pointerId)
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

  const handlePointerUp = useCallback(
    (event) => {
      if (!draggable) return
      if (event.pointerId !== activePointerId.current) return

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
      }

      // reset all the touchState values.
      resetDrag()
    },
    [
      draggable,
      touchState.isDragging,
      touchState.xOffset,
      swipeThreshold,
      resetDrag,
      next,
      previous,
    ]
  )

  /*
    The browser can cancel the pointer (e.g. when it takes over for a vertical
    scroll) or capture can be lost; in that case reset without navigating.
  */
  const handlePointerCancel = useCallback(
    (event) => {
      if (!draggable) return
      if (event.pointerId !== activePointerId.current) return

      resetDrag()
    },
    [draggable, resetDrag]
  )

  return (
    <ul
      className={classnames([styles.gallery__main, className])}
      onPointerDown={draggable ? handlePointerDown : null}
      onPointerMove={draggable ? handlePointerMove : null}
      onPointerUp={draggable ? handlePointerUp : null}
      onPointerCancel={draggable ? handlePointerCancel : null}
      onLostPointerCapture={draggable ? handlePointerCancel : null}
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
