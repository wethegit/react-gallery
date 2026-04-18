import {
  Gallery,
  GalleryMain,
  GalleryItem,
  GalleryNav,
  GalleryPagination,
  GalleryPaginationItem,
} from "../lib"
import styles from "./flying-gallery.module.css"

const ITEMS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Sun rays through a forest",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Snow-capped mountain peak at night",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Mountain reflected in a still lake",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Aerial view of green hills",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Orange wildflower field",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&h=700&q=80",
    thumb:
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=200&h=120&q=60",
    alt: "Tropical beach with clear water",
  },
]

export function FlyingGallery() {
  return (
    <div className={styles.root}>
      <Gallery
        items={ITEMS}
        loop
        draggable={false}
        visibleRange={2}
        style={{
          "--item-width": "min(640px, 72vw)",
          "--duration": "0.55s",
        }}
      >
        <div className={styles.slideArea}>
          <GalleryMain
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className={styles.srOnly}>Previous</span>
          </GalleryNav>
          <GalleryNav direction={1} className={styles.navNext}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className={styles.srOnly}>Next</span>
          </GalleryNav>
        </div>

        <GalleryPagination
          className={styles.thumbs}
          renderPaginationItem={({ item, index, active }) => (
            <GalleryPaginationItem
              key={item.id}
              index={index}
              active={active}
              className={styles.thumbItem}
              buttonClassName={styles.thumbButton}
            >
              <img src={item.thumb} alt={item.alt} />
            </GalleryPaginationItem>
          )}
        />
      </Gallery>
    </div>
  )
}
