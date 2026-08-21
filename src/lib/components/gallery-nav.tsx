"use client"

import { ComponentPropsWithRef, ReactNode } from "react"
import { useGallery } from "../hooks/use-gallery"
import { classnames } from "../utils/classnames"

import type { RenderNavItemArgs } from "../types/types"

import styles from "./gallery.module.css"

export interface GalleryNavProps extends ComponentPropsWithRef<"button"> {
  direction: 0 | 1
  renderNavItem?: ({ activeIndex, disabled }: RenderNavItemArgs) => ReactNode
}

/**
 * GalleryMain Component
 * ---
 * @example
 * <Gallery items={GALLERY_ITEMS}>
 *  <GalleryNav direction={0}>⬅️</GalleryNav>
 *  <GalleryNav direction={1}>➡️</GalleryNav>
 * </Gallery>
 */
export const GalleryNav = ({
  direction,
  renderNavItem,
  className,
  children,
  ...props
}: GalleryNavProps) => {
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
    disabled: shouldDisable ? true : undefined,
    "aria-disabled": shouldDisable ? ("true" as const) : undefined,
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
        : renderNavItem?.({ activeIndex, disabled: !loop && shouldDisable })}
    </button>
  )
}
