import { classnames } from "@site/src/utils/classnames"
import {
  Gallery,
  GalleryItem,
  GalleryMain,
  GalleryPagination,
  GalleryPaginationItem,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import { SLIDES, type Slide } from "../../../data/shared-data"

import styles from "../../../styles/shared.module.scss"

export function ThumbnailGallery() {
  return (
    <div className={styles.card}>
      <Gallery items={SLIDES} className={styles.gallery}>
        <GalleryMain<Slide>
          renderGalleryItem={({ item, index, active }) => (
            <GalleryItem
              key={item.id}
              index={index}
              active={active}
              className={classnames([styles.slide, active && styles.isActive])}
            >
              <img src={item.image} alt={item.alt} />
            </GalleryItem>
          )}
        />

        <GalleryPagination<Slide>
          className={styles.thumbs}
          renderPaginationItem={({ item, index, active }) => (
            <GalleryPaginationItem
              key={item.id}
              index={index}
              active={active}
              buttonClassName={styles.thumb}
            >
              <img src={item.image} alt="" />
              <span className={styles.visuallyHidden}>Go to {item.title}</span>
            </GalleryPaginationItem>
          )}
        />
      </Gallery>
    </div>
  )
}
