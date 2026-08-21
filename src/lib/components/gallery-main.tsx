"use client"

import { CSSProperties, ReactNode, useCallback } from "react"
import { ComponentPropsWithoutRef, PointerEvent } from "react"

import type { RenderGalleryItemArgs } from "../types/types"

import { useGallery } from "../hooks/use-gallery"
import { classnames } from "../utils/classnames"

import styles from "./gallery.module.css"

export interface GalleryMainProps<T = unknown> extends Omit<
  ComponentPropsWithoutRef<"ul">,
  "children"
> {
  renderGalleryItem: (args: RenderGalleryItemArgs<T>) => ReactNode
}

/**
 * GalleryMain Component
 * ---
 * @example
    <Gallery items={GALLERY_ITEMS}>
      <GalleryMain<GalleryItemDataType>
        renderGalleryItem={({ item, index, active }) => (
          <GalleryItem key={item.id} index={index} active={active}>
            <img src={item.image} alt={item.alt} />
          </GalleryItem>
        )}
      />
    </Gallery>
 */
export const GalleryMain = <T,>({
  renderGalleryItem,
  className,
  ...props
}: GalleryMainProps<T>) => {
  const {
    activeIndex,
    galleryItems,
    next,
    previous,
    draggable,
    touchState,
    setTouchState,
    swipeThreshold,
  } = useGallery<T>()

  const resetTouchState = useCallback(() => {
    setTouchState((prevState) => ({
      ...prevState,
      isDragging: false,
      xOffset: 0,
      start: { x: 0, y: 0 },
      offsetting: false,
      scrolling: false,
    }))
  }, [setTouchState])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      if (!draggable) return
      event.currentTarget.setPointerCapture?.(event.pointerId)
      setTouchState((prevState) => ({ ...prevState, isDragging: true }))
    },
    [draggable, setTouchState]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
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
          const start = touchState.start
          const xOffset = event.clientX - start.x
          const yOffset = event.clientY - start.y
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

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      if (!draggable) return

      event.currentTarget.releasePointerCapture?.(event.pointerId)
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

        resetTouchState()
      }
    },
    [
      draggable,
      touchState.isDragging,
      touchState.xOffset,
      swipeThreshold,
      next,
      previous,
      resetTouchState,
    ]
  )

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
      resetTouchState()
    },
    [resetTouchState]
  )

  return (
    <ul
      className={classnames([styles.gallery__main, className])}
      onPointerDown={draggable ? handlePointerDown : undefined}
      onPointerMove={draggable ? handlePointerMove : undefined}
      onPointerUp={draggable ? handlePointerUp : undefined}
      onPointerCancel={draggable ? handlePointerCancel : undefined}
      style={
        { "--selected": activeIndex, "--total": galleryItems.length } as CSSProperties
      }
      {...props}
    >
      {galleryItems.map((item, index) => {
        const active = activeIndex === index
        return renderGalleryItem({ item, index, activeIndex, active })
      })}
    </ul>
  )
}
