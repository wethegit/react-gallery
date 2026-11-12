import {
  Gallery,
  GalleryItem,
  GalleryMain,
  GalleryNav,
  GalleryPagination,
  GalleryPaginationItem,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import styles from "../../../styles/shared.module.scss"

import { SLIDES, type Slide } from "@site/src/data/shared-data"

export function BasicGallery() {
  return (
    <div className={styles.card}>
      <Gallery items={SLIDES} className={styles.gallery}>
        <GalleryMain<Slide>
          renderGalleryItem={({ item, index, active }) => (
            <GalleryItem key={item.id} index={index} active={active}>
              <img src={item.image} alt={item.alt} />
            </GalleryItem>
          )}
        />

        <div className={styles.controls}>
          <GalleryNav direction={0} className={styles.arrow}>
            <span aria-hidden="true">&larr;</span>
            <span className={styles.visuallyHidden}>Previous item</span>
          </GalleryNav>

          <GalleryPagination<Slide>
            className={styles.dots}
            renderPaginationItem={({ item, index, active }) => (
              <GalleryPaginationItem
                key={item.id}
                index={index}
                active={active}
                buttonClassName={styles.dot}
              >
                <span className={styles.visuallyHidden}>Go to item {index + 1}</span>
              </GalleryPaginationItem>
            )}
          />

          <GalleryNav direction={1} className={styles.arrow}>
            <span aria-hidden="true">&rarr;</span>
            <span className={styles.visuallyHidden}>Next item</span>
          </GalleryNav>
        </div>
      </Gallery>
    </div>
  )
}
