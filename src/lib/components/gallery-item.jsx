// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../utils/classnames"

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
        "gallery__item",
        draggable && "gallery__item--draggable",
        draggable && touchState.offsetting && "gallery__item--dragging",
        active && "gallery__item--active",
        index === previouslyActiveIndex && "gallery__item--was-active",
        index < activeIndex && "gallery__item--left",
        index > activeIndex && "gallery__item--right",
        (visibleRange === -1 || Math.abs(index - activeIndex) <= visibleRange) &&
          "gallery__item--visible",
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

GalleryItem.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
}
