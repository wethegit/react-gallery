// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// utils
import classnames from "../utils/classnames"

/***
 *
 * Pagination Item component callback
 * ---
 * @callback renderPaginationItem - Expects a component of GalleryPaginationItem
 * @param {number} index - The index of the current pagination item being iterated over.
 * @param {boolean} active - Whether the current pagination item being iterated over corresponds to the active gallery item.
 * @param {number} activeIndex - The index of the currently active gallery item.
 * @param {any} item - The current pagination item being iterated over, as defined by the Array fed to the `<Gallery>` component's `items` prop.
 */

/**
 * Pagination Component
 * ---
 * @param {object} props
 * @param {renderPaginationItem} props.renderPaginationItem - The component to be rendered. This expects the main wrapper to be a GalleryPaginationItem component
 * @param {string} [props.className] - Pass classname to <ul> element
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
