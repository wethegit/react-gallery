import { useGallery } from "../hooks/use-gallery"
import classnames from "../utils/classnames"

import styles from "./gallery.module.css"

export const GalleryItem = ({ index, active, className, children, ...props }) => {
  const {
    itemNodes,
    activeIndex,
    previouslyActiveIndex,
    draggable,
    touchState,
    visibleRange,
  } = useGallery()

  const a11yProps = {
    "aria-hidden": active ? null : "true",
    tabIndex: active ? 0 : -1,
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
        active && styles["gallery__item--active"],
        index === previouslyActiveIndex && styles["gallery__item--was-active"],
        index < activeIndex && styles["gallery__item--left"],
        index > activeIndex && styles["gallery__item--right"],
        (visibleRange === -1 || Math.abs(index - activeIndex) <= visibleRange) &&
          styles["gallery__item--visible"],
        className,
      ])}
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
