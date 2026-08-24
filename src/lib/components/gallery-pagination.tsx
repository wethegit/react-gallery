"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { RenderPaginationItemArgs } from "../types/types"

import { useGallery } from "../hooks/use-gallery"
import { classnames } from "../utils/classnames"

import styles from "./gallery.module.css"

export interface GalleryPaginationProps<T> extends Omit<
  ComponentPropsWithoutRef<"ul">,
  "children"
> {
  renderPaginationItem: (args: RenderPaginationItemArgs<T>) => ReactNode
}

/**
 * Pagination Component
 * ---
 * @example
 *  <GalleryPagination
 *    renderPaginationItem={({ index, active }) => (
 *      <GalleryPaginationItem index={index} active={active} key={index}>
 *        <span>{index + 1}</span>
 *      </GalleryPaginationItem>
 *    )}
 *  />
 */
export const GalleryPagination = <T,>({
  renderPaginationItem,
  className,
  ...props
}: GalleryPaginationProps<T>) => {
  const { activeIndex, galleryItems } = useGallery<T>()

  return (
    <ul className={classnames([styles.gallery__pagination, className])} {...props}>
      {galleryItems.map((item, index) => {
        const active = activeIndex === index
        return renderPaginationItem({ index, active, activeIndex, item })
      })}
    </ul>
  )
}
