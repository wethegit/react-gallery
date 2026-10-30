---
sidebar_position: 2
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# GalleryMain

The main gallery view. It renders a `<ul>` and calls `renderGalleryItem` once for each entry in the `items` array passed to [`<Gallery>`](/docs/api/gallery). Must be used inside a `<Gallery>`.

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
<GalleryMain<Item>
  renderGalleryItem={({ item, index, active }) => (
    <GalleryItem key={item.id} index={index} active={active}>
      <img src={item.image} alt={item.alt} />
    </GalleryItem>
  )}
/>
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
<GalleryMain
  renderGalleryItem={({ item, index, active }) => (
    <GalleryItem key={item.id} index={index} active={active}>
      <img src={item.image} alt={item.alt} />
    </GalleryItem>
  )}
/>
```

</TabItem>
</Tabs>

## Props

TypeScript: `GalleryMainProps<T>`. Pass your item type as `<GalleryMain<Item>>`, or `item` is `unknown`; the [TypeScript guide](/docs/guides/typescript) explains why.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `renderGalleryItem` | `(args: RenderGalleryItemArgs<T>) => ReactNode` | required | Called for each item. Must return a [`<GalleryItem>`](/docs/api/gallery-item). |
| `className` | `string` | | Extra class for the `<ul>`. |
| `style` | `CSSProperties` | | Inline styles for the `<ul>`. |

Any other `<ul>` attributes (`id`, `aria-label`, `data-*`, ...) are passed through to the list.

## renderGalleryItem arguments

TypeScript: `RenderGalleryItemArgs<T>`.

| Field | Type | Description |
| --- | --- | --- |
| `item` | `T` | This item's entry from the `items` array. |
| `index` | `number` | This item's index. |
| `active` | `boolean` | Whether this item is the active one. |
| `activeIndex` | `number` | Index of the active item. |

## Layout

With the base stylesheet, the `<ul>` is a CSS grid with a single cell. Every item sits in that cell and is moved sideways with a `transform` built from [CSS custom properties](/docs/api/css-custom-properties). Remove the transform in your own item CSS and the items stack instead, which is a starting point for a fading gallery.

`GalleryMain` sets two of those properties on the `<ul>`: `--selected` (the active index) and `--total` (the number of items).

## Dragging

When `<Gallery>` has `draggable` on (the default), `GalleryMain` handles pointer events on the list:

- A horizontal drag of more than 10px starts moving the items with the pointer, through `--touch-offset`.
- If the pointer moves more than 20px vertically before a horizontal drag starts, it is treated as page scrolling and the drag is ignored.
- Releasing after a drag longer than `swipeThreshold` (50px) goes to the next item (dragged left) or the previous one (dragged right). Shorter drags snap back.

The base stylesheet sets `touch-action: pan-y` on draggable galleries so vertical page scrolling still works on touch screens.
