"use client"

import { useGallery } from "../hooks/use-gallery"
import { classnames } from "../utils/classnames"

import type { ComponentPropsWithoutRef, CSSProperties } from "react"

import styles from "./gallery.module.css"

export interface GalleryItemProps extends ComponentPropsWithoutRef<"li"> {
  index: number
  active: boolean
}

export const GalleryItem = ({
  index,
  active,
  className,
  children,
  ...props
}: GalleryItemProps) => {
  const {
    itemNodes,
    activeIndex,
    draggable,
    touchState,
    visibleRange,
    previouslyActiveIndex,
  } = useGallery()

  const a11yProps = {
    "aria-hidden": active ? undefined : ("true" as const),
    tabIndex: -1,
  }

  return (
    <li
      ref={(node) => {
        itemNodes.current[index] = node
      }}
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
      data-was-active={index === previouslyActiveIndex}
      style={
        {
          "--i": index,
          "--center-offset": Math.abs(index - activeIndex),
          "--index-offset": index - activeIndex,
          "--side": index < activeIndex ? -1 : index > activeIndex ? 1 : 0,
          "--active": active ? 1 : 0,
        } as CSSProperties
      }
    >
      {children}
    </li>
  )
}
