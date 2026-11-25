import { PropsWithChildren } from "react"
import {
  Gallery,
  GalleryNav,
  GalleryMain,
  GalleryItem,
  GalleryPagination,
  GalleryPaginationItem,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import styles from "./flow-gallery.module.scss"

import { SLIDES, type Slide } from "../../../data/shared-data"

export function FlowGallery() {
  return (
    <div className={styles.root}>
      <Gallery items={SLIDES} loop draggable={false} visibleRange={2}>
        <GalleryMain<Slide>
          className={styles.slideArea}
          renderGalleryItem={({ item, index, activeIndex, active }) => {
            const isPrev = activeIndex > index

            return (
              <GalleryItem
                key={item.id}
                index={index}
                active={active}
                className={styles.item}
                data-side={active ? "active" : isPrev ? "prev" : "next"}
              >
                <div className={styles.slide}>
                  <img src={item.image} alt={item.alt} />
                </div>
              </GalleryItem>
            )
          }}
        />
        <GalleryNav direction={0} className={styles.navPrev}>
          <SvgIcon>
            <polyline points="15 18 9 12 15 6" />
          </SvgIcon>
          <span className={styles.srOnly}>Previous</span>
        </GalleryNav>
        <GalleryNav direction={1} className={styles.navNext}>
          <SvgIcon>
            <polyline points="9 18 15 12 9 6" />
          </SvgIcon>
          <span className={styles.srOnly}>Next</span>
        </GalleryNav>

        <GalleryPagination<Slide>
          className={styles.thumbs}
          renderPaginationItem={({ item, index, active }) => (
            <GalleryPaginationItem
              key={item.id}
              index={index}
              active={active}
              className={styles.thumbItem}
              buttonClassName={styles.thumbButton}
            >
              <img src={item.image} alt={item.alt} />
            </GalleryPaginationItem>
          )}
        />
      </Gallery>
    </div>
  )
}

function SvgIcon({ children }: PropsWithChildren) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}
