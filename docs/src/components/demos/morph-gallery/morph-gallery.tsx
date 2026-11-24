import { useEffect, useRef, PropsWithChildren } from "react"
import {
  Gallery,
  GalleryPagination,
  GalleryNav,
  GalleryPaginationItem,
  useGallery,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import styles from "./morph-gallery.module.scss"

import { MorphRenderer } from "./morph-renderer"

import { SLIDES, type Slide } from "../../../data/shared-data"

export function MorphGallery() {
  return (
    <div className={styles.root}>
      <Gallery items={SLIDES} loop>
        <div className={styles.stage}>
          <MorphCanvas />

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
        </div>
      </Gallery>
    </div>
  )
}

function MorphCanvas() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null)
  const rendererRef = useRef<null | MorphRenderer>(null)
  const { activeIndex, galleryItems } = useGallery<Slide>()
  const prevIndexRef = useRef(activeIndex)

  useEffect(() => {
    if (canvasRef.current === null) return
    const renderer = new MorphRenderer(canvasRef.current)
    rendererRef.current = renderer
    renderer.init(galleryItems.map((i) => i.image))
    return () => renderer.destroy()
  }, [galleryItems])

  useEffect(() => {
    const prev = prevIndexRef.current
    if (prev !== activeIndex) {
      rendererRef.current?.transition(prev, activeIndex)
      prevIndexRef.current = activeIndex
    }
  }, [activeIndex])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
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
