"use client"

import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryItem = ({ index, active, className, children, ...props }) => {
  const { itemNodes, activeIndex, draggable, touchState, visibleRange } = useGallery()

  const a11yProps = {
    "aria-hidden": active ? null : "true",
    tabIndex: -1,
  }

  return (
    <li
      ref={(node) => (itemNodes.current[index] = node)}
      {...a11yProps}
      {...props}
      className={classnames([
        styles.gallery__item,
        draggable && styles["gallery__item--draggable"],
        draggable && touchState.offsetting && styles["gallery__item--dragging"],
        className,
      ])}
      data-item-visible={
        visibleRange === -1 || Math.abs(index - activeIndex) <= visibleRange
      }
      style={{
        "--i": index,
        "--center-offset": Math.abs(index - activeIndex),
        "--index-offset": index - activeIndex,
        "--side": index < activeIndex ? -1 : index > activeIndex ? 1 : 0,
        "--active": active ? 1 : 0,
      }}
    >
      {children}
    </li>
  )
}
