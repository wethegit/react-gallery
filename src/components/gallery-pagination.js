// packages
import PropTypes from "prop-types"

// hooks
import { useGallery } from "../hooks/use-gallery"

// components
import { GalleryPaginationItem } from "./gallery-pagination-item"

// utils
import classnames from "../lib/classnames"

// styles
import * as styles from "./gallery.module.scss"

export const GalleryPagination = ({ renderPaginationItem, className, ...props }) => {
  const { activeIndex, galleryItems } = useGallery()

  return (
    <ul
      className={classnames([styles.pagination, "gallery__pagination", className])}
      {...props}
    >
      {galleryItems.map((item, i) => {
        const active = activeIndex === i
        return (
          <GalleryPaginationItem index={i} active={active} key={i}>
            {renderPaginationItem({ item, i, activeIndex, active })}
          </GalleryPaginationItem>
        )
      })}
    </ul>
  )
}

GalleryPagination.propTypes = {
  renderPaginationItem: PropTypes.func.isRequired,
  className: PropTypes.string,
}
