// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../utils/classnames"

/***
 *
 * Pagination Item
 * ---
 * @typedef {element} renderPaginationItem - Expects a component of GallerPaginationItem
 * @returns {index, active, activeIndex, item}
 *
 * @property {number} index - The index of the current pagination item being iterated over.
 * @property {boolean} active - Whether the current pagination item being iterated over corresponds to the active gallery item.
 * @property {number} activeIndex - The index of the currently active gallery item.
 * @property {object} item - The current pagination item being iterated over, as defined by the Array fed to the `<Gallery>` component's `items` prop.
 */

/**
 * Displays a greeting to the user.
 * @param {Props} renderPaginationItem
 * @param {string} className
 * @example
 *  <GalleryPagination
 *    renderPaginationItem={({ index, active }) => (
 *      <GalleryPaginationItem index={index} active={active} key={index}>
 *        <span>{index + 1}</span>
 *      </GalleryPaginationItem>
 *    )}
 *  />
 */
export const GalleryPagination = ({ renderPaginationItem, className, ...props }) => {
  const { activeIndex, galleryItems } = useGallery()

  return (
    <ul className={classnames(["gallery__pagination", className])} {...props}>
      {galleryItems.map((item, index) => {
        const active = activeIndex === index
        return renderPaginationItem({ index, active, activeIndex, item })
      })}
    </ul>
  )
}

GalleryPagination.propTypes = {
  renderPaginationItem: PropTypes.func.isRequired,
  className: PropTypes.string,
}
