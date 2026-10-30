---
sidebar_position: 5
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# GalleryPagination & GalleryPaginationItem

Pagination is the row of controls (dots, thumbnails, labels) that jump straight to an item. `GalleryPagination` renders the `<ul>` and calls `renderPaginationItem` for each item; `GalleryPaginationItem` renders each `<li>` with a `<button>` inside. Must be used inside a `<Gallery>`.

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
<GalleryPagination<Item>
  renderPaginationItem={({ item, index, active }) => (
    <GalleryPaginationItem key={item.id} index={index} active={active}>
      <span className="visually-hidden">Go to item {index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
<GalleryPagination
  renderPaginationItem={({ item, index, active }) => (
    <GalleryPaginationItem key={item.id} index={index} active={active}>
      <span className="visually-hidden">Go to item {index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```

</TabItem>
</Tabs>

## GalleryPagination props

TypeScript: `GalleryPaginationProps<T>`. Pass your item type as `<GalleryPagination<Item>>`, or `item` is `unknown`; see the [TypeScript guide](/docs/guides/typescript).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `renderPaginationItem` | `(args: RenderPaginationItemArgs<T>) => ReactNode` | required | Called for each item. Return a `<GalleryPaginationItem>`. |
| `className` | `string` | | Extra class for the `<ul>`. |

Any other `<ul>` attributes are passed through.

With the base stylesheet the `<ul>` is a CSS grid, one column per item, centered. Space the items with `--inline-gap` (default `10px`) on your class.

### renderPaginationItem arguments

TypeScript: `RenderPaginationItemArgs<T>`.

| Field | Type | Description |
| --- | --- | --- |
| `item` | `T` | This item's entry from the `items` array. |
| `index` | `number` | This item's index. |
| `active` | `boolean` | Whether this item is the active one. |
| `activeIndex` | `number` | Index of the active item. |

## GalleryPaginationItem props

TypeScript: `GalleryPaginationItemProps`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | required | The item this button goes to. Pass `index` through from `renderPaginationItem`. |
| `active` | `boolean` | required | Whether that item is active. Sets `aria-current="true"` on the button. |
| `children` | `ReactNode` | | The button's content: hidden text, a thumbnail, a label. |
| `className` | `string` | | Extra class for the `<li>`. |
| `buttonClassName` | `string` | | Class for the `<button>`. |
| `buttonProps` | `object` | | Extra props for the `<button>`. Applied last, so they override everything else on it, including `onClick` and `aria-current`. |
| `onClick` | `(args: GalleryPaginationItemClickArgs) => void` | | Called after the gallery has moved to `index`. See [onClick](#onclick). |
| `itemTag` | `ElementType` | `"button"` | Element to render instead of the `<button>`, such as `"span"` for purely visual pagination. |
| `decorativeOnly` | `boolean` | `false` | Removes the click handler, so the element no longer changes the item. Use with `itemTag` for a progress indicator that isn't a control. |

Any other `<li>` attributes are passed through.

### onClick

Clicking the button moves the gallery to `index`, focuses that item, and then calls your `onClick` with an object. TypeScript: `GalleryPaginationItemClickArgs`.

| Field | Type | Description |
| --- | --- | --- |
| `event` | `MouseEvent` | The click event. |
| `index` | `number` | The index of the clicked pagination item. |

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
import { type GalleryPaginationItemClickArgs } from "@wethegit/react-gallery"

const handleClick = ({ event, index }: GalleryPaginationItemClickArgs) => {
  console.log(event, index)
}

<GalleryPagination<Item>
  renderPaginationItem={({ item, index, active }) => (
    <GalleryPaginationItem
      key={item.id}
      index={index}
      active={active}
      onClick={handleClick}
    >
      <span>{index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
const handleClick = ({ event, index }) => {
  console.log(event, index)
}

<GalleryPagination
  renderPaginationItem={({ item, index, active }) => (
    <GalleryPaginationItem
      key={item.id}
      index={index}
      active={active}
      onClick={handleClick}
    >
      <span>{index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```

</TabItem>
</Tabs>

This only covers pagination clicks. To run code whenever the active item changes, whatever caused it, use `onChange` on [`<Gallery>`](/docs/api/gallery#onchange).

## Styling the active state

The active item's button has `aria-current="true"`, so you can style it without an extra class:

```css
.my-dot[aria-current="true"] {
  background: rebeccapurple;
}
```

See the [thumbnail pagination demo](/docs/demos/thumbnails) for pagination that goes beyond dots.
