---
sidebar_position: 6
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# useGallery

A hook that returns the gallery's state and navigation methods. It reads the context created by [`<Gallery>`](/docs/api/gallery), so it only works in components rendered inside one; anywhere else it throws "useGallery must be called from within a &lt;Gallery&gt;."

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
import { useGallery } from "@wethegit/react-gallery"

function Counter() {
  const { activeIndex, galleryItems } = useGallery<Item>()
  return (
    <p>
      {activeIndex + 1} / {galleryItems.length}
    </p>
  )
}
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
import { useGallery } from "@wethegit/react-gallery"

function Counter() {
  const { activeIndex, galleryItems } = useGallery()
  return (
    <p>
      {activeIndex + 1} / {galleryItems.length}
    </p>
  )
}
```

</TabItem>
</Tabs>

TypeScript: returns `GalleryContextValue<T>`. Pass your item type as `useGallery<Item>()`, or `galleryItems` is `unknown[]`; see the [TypeScript guide](/docs/guides/typescript).

## Returned values

### State

| Value | Type | Description |
| --- | --- | --- |
| `activeIndex` | `number` | Index of the active item. |
| `previouslyActiveIndex` | `number` | Index that was active before the last change. |
| `galleryItems` | `T[]` | The `items` array passed to `<Gallery>`. |
| `itemNodes` | `RefObject<(HTMLElement \| null)[]>` | Ref whose `current` is the array of rendered item `<li>` elements, by index. |
| `touchState` | `TouchState` | The current drag, if `draggable` is on. See [touchState](#touchstate). |
| `swipeThreshold` | `number` | Minimum drag distance in pixels before a drag changes the item. Currently `50`. |

### Navigation

| Value | Type | Description |
| --- | --- | --- |
| `next` | `() => void` | Goes to the next item; with `loop` on, from the last item to the first. Fires `onChange`. |
| `previous` | `() => void` | Goes to the previous item; with `loop` on, from the first item to the last. Fires `onChange`. |
| `goToIndex` | `(index?: number) => void` | Goes to `index`. Fires `onChange`. If `index` is missing or has no item, goes to the first item. |
| `setActiveIndex` | `Dispatch<SetStateAction<number>>` | Sets the active index **without** firing `onChange`. Prefer `goToIndex`. |
| `setPreviouslyActiveIndex` | `Dispatch<SetStateAction<number>>` | Sets `previouslyActiveIndex`. |
| `setTouchState` | `Dispatch<SetStateAction<TouchState>>` | Sets `touchState`. Used by the drag handling in `GalleryMain`. |

`next` and `previous` fire `onChange` even when they can't move (at either end with `loop` off); see [onChange](/docs/api/gallery#onchange).

### Gallery props

`draggable`, `loop`, `startIndex`, `visibleRange`, and `onChange` are returned with the values passed to `<Gallery>` (or their defaults), so nested components can adapt to the gallery's settings.

## touchState

TypeScript: `TouchState`, with `start` typed as `TouchStateStart`.

| Field | Type | Description |
| --- | --- | --- |
| `isDragging` | `boolean` | A pointer is down on the gallery. |
| `start` | `{ x: number, y: number }` | Where the pointer went down, in viewport pixels. |
| `xOffset` | `number` | Horizontal distance dragged so far, in pixels. |
| `offsetting` | `boolean` | The drag has moved far enough sideways to move the items. |
| `scrolling` | `boolean` | The movement was mostly vertical, so it's treated as page scrolling and ignored. |

## Example: state readout

```jsx
function GalleryInfo() {
  const { activeIndex, previouslyActiveIndex, loop } = useGallery()

  return (
    <p>
      Showing item {activeIndex}, previously {previouslyActiveIndex}. Looping
      is {loop ? "on" : "off"}.
    </p>
  )
}
```

## Example: autoplay

```jsx
function Autoplay({ interval = 4000 }) {
  const { next } = useGallery()

  useEffect(() => {
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [next, interval])

  return null
}

// <Gallery items={ITEMS} loop>
//   <GalleryMain ... />
//   <Autoplay />
// </Gallery>
```

Autoplay needs a visible way to pause it to meet [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html); see the [accessibility guide](/docs/guides/accessibility).

For a fuller example with custom arrows, a counter, jump buttons, and an `onChange` log, see the [custom controls demo](/docs/demos/custom-controls).
