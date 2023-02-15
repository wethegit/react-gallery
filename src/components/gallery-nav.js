// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../lib/classnames"

export const GalleryNav = ({
  direction,
  renderNavItem,
  className,
  children,
  ...props
}) => {
  const { next, previous, loop, activeIndex, galleryItems } = useGallery()

  const handleClick = (e) => {
    if (direction) next()
    else previous()
  }

  // We determine if it's disabled based on it being either
  // - the "next" button and at the end
  // - or the "previous" button and at the start:
  const shouldDisable =
    (direction && activeIndex === galleryItems.length - 1) ||
    (!direction && activeIndex === 0)

  const disabledProps = loop
    ? {}
    : {
        disabled: shouldDisable ? true : null,
        "aria-disabled": shouldDisable ? "true" : null,
      }

  if (!children && !renderNavItem) return null

  return (
    <button
      className={classnames([
        className,
        "gallery__nav",
        `gallery__nav--${direction ? "next" : "previous"}`,
      ])}
      onClick={handleClick}
      {...disabledProps}
      {...props}
    >
      {children ? children : renderNavItem({ activeIndex, disabled: shouldDisable })}
    </button>
  )
}

GalleryNav.propTypes = {
  direction: PropTypes.oneOf([0, 1]).isRequired,
  renderNavItem: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
}
