// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// components
import { GalleryPaginationItem } from "./gallery-pagination-item"

// utils
import classnames from "../utils/classnames"

/***
 *
 * Pagination Item
 * ---
 * Children Render Props example
 * @returns {index, active, activeIndex, item}
 * @deprecated renderPaginationItem
 *
 * @param {number} index - The index of the current pagination item being iterated over.
 * @param {boolean} active - Whether the current pagination item being iterated over corresponds to the active gallery item.
 * @param {number} activeIndex - The index of the currently active gallery item.
 * @param {object} item - The current pagination item being iterated over, as defined by the Array fed to the `<Gallery>` component's `items` prop.
 *
 */

export const GalleryPagination = ({
  renderPaginationItem,
  className,
  children = renderPaginationItem,
  ...props
}) => {
  const { activeIndex, galleryItems } = useGallery()

  return (
    <ul className={classnames(["gallery__pagination", className])} {...props}>
      {galleryItems.map((item, index) => {
        const active = activeIndex === index

        // This conditional is to support legacy implimentations of this library.
        return renderPaginationItem ? (
          <GalleryPaginationItem index={index} active={active} key={index}>
            {renderPaginationItem({ item, i: index, activeIndex, active })}
          </GalleryPaginationItem>
        ) : (
          children({ index, active, activeIndex, item })
        )
      })}
    </ul>
  )
}

GalleryPagination.propTypes = {
  renderPaginationItem: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
}
