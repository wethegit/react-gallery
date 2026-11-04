import { useEffect, useState, type CSSProperties } from "react"
import {
  Gallery,
  GalleryItem,
  GalleryMain,
  GalleryPagination,
  GalleryPaginationItem,
  useGallery,
} from "@wethegit/react-gallery"
import "@wethegit/react-gallery/style.css"

import { classnames } from "@site/src/utils/classnames"

import { SLIDES, type Slide } from "../../../data/shared-data"
import styles from "../../../styles/shared.module.scss"
import stories from "./stories.module.scss"

const STORY_MS = 5000

interface StoriesProps {
  playing: boolean
  onTogglePlaying: () => void
}

function Stories({ playing, onTogglePlaying }: StoriesProps) {
  const { next, previous } = useGallery<Slide>()

  return (
    <div className={classnames([stories.frame, !playing && stories.paused])}>
      {/* Progress bars, not buttons: itemTag swaps the <button> for a <span>
          and decorativeOnly drops its click handler. The active bar's fill
          is a CSS animation lasting one story; when it ends, we move on. So
          pausing is just pausing the animation. */}
      <GalleryPagination<Slide>
        className={stories.progress}
        aria-hidden="true"
        renderPaginationItem={({ item, index, active, activeIndex }) => (
          <GalleryPaginationItem
            key={item.id}
            index={index}
            active={active}
            itemTag="span"
            decorativeOnly
            className={stories.segment}
            buttonClassName={classnames([
              stories.fill,
              index < activeIndex && stories.done,
              active && stories.running,
            ])}
            buttonProps={active ? { onAnimationEnd: next } : undefined}
          />
        )}
      />

      <GalleryMain<Slide>
        className={stories.stage}
        renderGalleryItem={({ item, index, active }) => (
          <GalleryItem
            key={item.id}
            index={index}
            active={active}
            className={stories.story}
          >
            <img src={item.image} alt={item.alt} />
            <p className={stories.caption}>{item.description}</p>
          </GalleryItem>
        )}
      />

      {/* Tap zones over the story, like on a phone: the left 45% goes
          back, the rest goes forward. Plain buttons calling previous() and
          next() rather than GalleryNav, which moves focus to the story when
          it reaches either end (even with `loop` on) and would pull focus
          away from the pause button mid-playback. */}
      <button
        type="button"
        className={classnames([stories.tap, stories.tapPrevious])}
        onClick={previous}
      >
        <span className={styles.visuallyHidden}>Previous story</span>
      </button>
      <button
        type="button"
        className={classnames([stories.tap, stories.tapNext])}
        onClick={next}
      >
        <span className={styles.visuallyHidden}>Next story</span>
      </button>

      <button type="button" className={stories.playPause} onClick={onTogglePlaying}>
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        <span className={styles.visuallyHidden}>
          {playing ? "Pause stories" : "Play stories"}
        </span>
      </button>
    </div>
  )
}

export function StoriesGallery() {
  const [playing, setPlaying] = useState(true)

  // Don't start playing on its own for visitors who asked for less motion.
  // Read after mounting, so the server render and the first client render agree.
  // Or we can use any prefers reduced motion hook for this
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false)
    }
  }, [])

  return (
    <div className={styles.card}>
      <Gallery
        items={SLIDES}
        loop
        // The tap zones replace swiping.
        draggable={false}
        // While playing, the story changes every few seconds by itself, and
        // announcing each change would talk over everything else. Keep the
        // live region quiet until the visitor pauses.
        ariaLiveText={playing ? "" : "Story $i of $t."}
        className={stories.gallery}
        style={{ "--story-duration": `${STORY_MS}ms` } as CSSProperties}
      >
        <Stories
          playing={playing}
          onTogglePlaying={() => setPlaying((value) => !value)}
        />
      </Gallery>
    </div>
  )
}
