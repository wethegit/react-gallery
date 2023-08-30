// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../utils/classnames"

export const GalleryPaginationItem = ({
  index,
  active,
  className,
  buttonClassName,
  buttonProps,
  children,
  onClick,
  ...props
}) => {
  const { goToIndex, itemNodes } = useGallery()

  const handleClick = (i) => (event) => {
    goToIndex(i)
    itemNodes.current[i].focus({ preventScroll: true })
    onClick && onClick({ event, index })
  }

  return (
    <li
      key={index}
      className={classnames(["gallery__pagination-item", className])}
      {...props}
    >
      <button
        className={buttonClassName}
        onClick={handleClick(index)}
        aria-current={active ? "true" : null}
        {...buttonProps}
      >
        {children}
      </button>
    </li>
  )
}

GalleryPaginationItem.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  onClick: PropTypes.func,
}
