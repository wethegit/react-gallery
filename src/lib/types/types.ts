import type { RefObject, Dispatch, SetStateAction, ReactNode } from "react"

export interface GalleryChangeEvent {
  oldIndex: number
  newIndex: number
  direction: 0 | 1
}

export type GalleryChangeCallback = (event: GalleryChangeEvent) => void

export interface TouchStateStart {
  x: number
  y: number
}

export interface TouchState {
  isDragging: boolean
  start: TouchStateStart
  xOffset: number
  offsetting: boolean
  scrolling: boolean
}

export interface GalleryProps<T> {
  loop?: boolean
  draggable?: boolean
  startIndex?: number
  visibleRange?: number
  ariaLiveText?: string
  items: T[]
  onChange?: GalleryChangeCallback
  className?: string
  children: ReactNode
}

export interface GalleryContextValue<T> {
  galleryItems: T[]
  itemNodes: RefObject<(HTMLElement | null)[]>
  startIndex: number
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  previouslyActiveIndex: number
  setPreviouslyActiveIndex: Dispatch<SetStateAction<number>>
  goToIndex: (index?: number) => void
  next: () => void
  previous: () => void
  loop: boolean
  draggable: boolean
  touchState: TouchState
  setTouchState: Dispatch<SetStateAction<TouchState>>
  swipeThreshold: number
  onChange?: GalleryChangeCallback
  visibleRange: number
}

export interface RenderGalleryItemArgs<T> {
  item: T
  index: number
  activeIndex: number
  active: boolean
}

export interface RenderNavItemArgs {
  activeIndex: number
  disabled: boolean
}

export interface RenderrenderPaginationItemArgs<T> {
  index: number
  active: boolean
  activeIndex: number
  item: T
}
