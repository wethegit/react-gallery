"use client"

import { useCallback, useRef } from "react"

import type { RenderGalleryItemArgs } from "../types/types"
import type {
  CSSProperties,
  ReactNode,
  ComponentPropsWithoutRef,
  PointerEvent,
} from "react"

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
  style,
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

  /*
    Only the primary pointer can drive the drag; any other pointers (e.g. a
    second finger) are ignored. A new primary pointer can only go down once
    every previous touch has lifted, so if one arrives while a drag is still
    recorded we've missed its up/cancel event and it simply takes over.
  */
  const activePointerId = useRef<number | null>(null)

  const resetTouchState = useCallback(() => {
    activePointerId.current = null

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
      if (!event.isPrimary) return

      activePointerId.current = event.pointerId

      /*
        We are storing the start positions on touch down instead on first move, so the the dragging works from the first interaction.
        Everything else is cleared too, discarding whatever a missed release left over.
      */
      setTouchState((prevState) => ({
        ...prevState,
        start: { x: event.clientX, y: event.clientY },
        isDragging: true,
        xOffset: 0,
        offsetting: false,
        scrolling: false,
      }))
    },
    [draggable, setTouchState]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      if (!draggable) return
      if (event.pointerId !== activePointerId.current) return

      /*
        first check if we haven't already determined if
        the user is scrolling vertically, then check we're
        actually in dragging mode, and finally if we have
        touch point data
      */
      if (!touchState.scrolling && touchState.isDragging === true && event.clientY) {
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
      if (event.pointerId !== activePointerId.current) return

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
      }

      // reset all the touchState values.
      resetTouchState()
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

  /*
    The browser can cancel the pointer (e.g. when it takes over for a vertical
    scroll) or capture can be lost; in that case reset without navigating.
    Capture is released implicitly in both cases, so there's nothing to release.
  */
  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      if (!draggable) return
      if (event.pointerId !== activePointerId.current) return

      resetTouchState()
    },
    [draggable, resetTouchState]
  )

  return (
    <ul
      className={classnames([styles.gallery__main, className])}
      onPointerDown={draggable ? handlePointerDown : undefined}
      onPointerMove={draggable ? handlePointerMove : undefined}
      onPointerUp={draggable ? handlePointerUp : undefined}
      onPointerCancel={draggable ? handlePointerCancel : undefined}
      onLostPointerCapture={draggable ? handlePointerCancel : undefined}
      style={
        {
          ...style,
          "--selected": activeIndex,
          "--total": galleryItems.length,
        } as CSSProperties
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
