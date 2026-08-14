"use client"

import { useCallback } from "react"
import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryPaginationItem = ({
  index,
  active,
  className,
  buttonClassName,
  buttonProps,
  onClick,
  itemTag,
  decorativeOnly,
  children,
  ...props
}) => {
  const Tag = itemTag || "button"
  const { goToIndex, itemNodes } = useGallery()

  const handleClick = useCallback(
    (event) => {
      goToIndex(index)
      itemNodes.current[index].focus({ preventScroll: true })

      if (onClick) onClick({ event, index })
    },
    [goToIndex, index, itemNodes, onClick]
  )

  const onClickCallback = decorativeOnly ? {} : { onClick: handleClick }

  return (
    <li
      className={classnames([styles["gallery__pagination-item"], className])}
      {...props}
    >
      <Tag
        className={buttonClassName}
        aria-current={active ? "true" : null}
        {...onClickCallback}
        {...buttonProps}
      >
        {children}
      </Tag>
    </li>
  )
}
