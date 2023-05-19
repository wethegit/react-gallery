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
  children,
  ...props
}) => {
  const { goToIndex, itemNodes } = useGallery()

  const handleClick = (i) => {
    goToIndex(i)
    itemNodes.current[i].focus({ preventScroll: true })
  }

  return (
    <li className={classnames(["gallery__pagination-item", className])} {...props}>
      <button onClick={() => handleClick(index)} aria-current={active ? "true" : null}>
        {children}
      </button>
    </li>
  )
}

GalleryPaginationItem.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
}
