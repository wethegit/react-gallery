"use client"

import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryNav = ({
  direction,
  renderNavItem,
  className,
  children,
  ...props
}) => {
  const { next, previous, loop, activeIndex, galleryItems } = useGallery()

  const handleClick = () => {
    if (direction) next()
    else previous()
  }

  // We determine if it's disabled based on it being either
  // - the "next" button and at the end
  // - or the "previous" button and at the start:
  const shouldDisable =
    (direction && activeIndex === galleryItems.length - 1) ||
    (!direction && activeIndex === 0)

  const disabledProps = {
    disabled: shouldDisable ? true : null,
    "aria-disabled": shouldDisable ? "true" : null,
  }

  if (!children && !renderNavItem) return null

  return (
    <button
      className={classnames([
        styles.gallery__nav,
        styles[`gallery__nav--${direction ? "next" : "previous"}`],
        className,
      ])}
      onClick={handleClick}
      {...(!loop && disabledProps)}
      {...props}
    >
      {children
        ? children
        : renderNavItem({ activeIndex, disabled: !loop && shouldDisable })}
    </button>
  )
}
