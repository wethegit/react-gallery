"use client"

import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryPaginationItem = ({
  index,
  active,
  className,
  buttonClassName,
  buttonProps,
  children,
  ...props
}) => {
  const { goToIndex, itemNodes } = useGallery()

  const handleClick = (i) => {
    goToIndex(i)
    itemNodes.current[i].focus({ preventScroll: true })
  }

  return (
    <li
      className={classnames([styles["gallery__pagination-item"], className])}
      {...props}
    >
      <button
        className={buttonClassName}
        aria-current={active ? "true" : null}
        onClick={() => handleClick(index)}
        {...buttonProps}
      >
        {children}
      </button>
    </li>
  )
}
