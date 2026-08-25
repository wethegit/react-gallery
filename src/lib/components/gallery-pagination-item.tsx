"use client"

import { useCallback } from "react"
import type { ComponentPropsWithoutRef, ElementType, MouseEvent } from "react"

import { useGallery } from "../hooks/use-gallery"
import { classnames } from "../utils/classnames"

import styles from "./gallery.module.css"

export interface GalleryPaginationItemClickArgs {
  event: MouseEvent<HTMLElement>
  index: number
}

export interface GalleryPaginationItemProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "onClick"
> {
  index: number
  active: boolean
  buttonClassName?: string
  buttonProps?: Record<string, unknown>
  onClick?: (args: GalleryPaginationItemClickArgs) => void
  itemTag?: ElementType
  decorativeOnly?: boolean
}

/**
 * GalleryPaginationItem Component
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
}: GalleryPaginationItemProps) => {
  const Tag = itemTag || "button"
  const { goToIndex, itemNodes } = useGallery()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      goToIndex(index)

      itemNodes.current[index]?.focus({ preventScroll: true })

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
