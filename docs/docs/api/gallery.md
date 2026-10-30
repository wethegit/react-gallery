---
sidebar_position: 1
---

import { GalleryVersion } from "@site/src/components/versions/gallery-versions"
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# Gallery

The root component. It renders a wrapper `<div>` and provides gallery state to its descendants through React context. Every other gallery component, and the [`useGallery`](/docs/api/use-gallery) hook, must be rendered inside it.

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
import { Gallery, type GalleryChangeCallback } from "@wethegit/react-gallery"

const handleChange: GalleryChangeCallback = ({ newIndex }) => {
  console.log(newIndex)
}

<Gallery items={ITEMS} loop onChange={handleChange}>
  {/* GalleryMain, GalleryNav, GalleryPagination, your own components... */}
</Gallery>
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
import { Gallery } from "@wethegit/react-gallery"

const handleChange = ({ newIndex }) => {
  console.log(newIndex)
}

<Gallery items={ITEMS} loop onChange={handleChange}>
  {/* GalleryMain, GalleryNav, GalleryPagination, your own components... */}
</Gallery>
```

</TabItem>
</Tabs>

## Props

TypeScript: `GalleryProps<T>`, where `T` is inferred from `items`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | required | Your gallery data, in any shape. Each entry is passed back to `renderGalleryItem` and `renderPaginationItem`. Throws if it is not an array. |
| `children` | `ReactNode` | required | `GalleryMain`, `GalleryNav`, `GalleryPagination`, and any components that call `useGallery`. |
| `ariaLiveText` | `string` | `"Item $i of $t."` | Text announced to assistive technology when the active item changes. See [ariaLiveText](#arialivetext). |
| `className` | `string` | | Extra class for the wrapper `<div>`. |
| `draggable` | `boolean` | `true` | Lets users change items by dragging with a finger or pointer. |
| `loop` | `boolean` | `false` | Wraps navigation: "next" on the last item goes to the first, and "previous" on the first goes to the last. |
| `onChange` | `GalleryChangeCallback` | | Called when the active item changes through "next", "previous", pagination, dragging, or `goToIndex`. See [onChange](#onchange). |
| `startIndex` | `number` | `0` | Index of the item that is active on mount. |
| `style` | `CSSProperties` | | Inline styles for the wrapper. This is how you set [CSS custom properties](/docs/api/css-custom-properties) per gallery. |
| `visibleRange` | `number` | `-1` | How many items on each side of the active one count as visible. Items in range get `data-item-visible="true"`, the rest `data-item-visible="false"`. `-1` marks every item visible. See [visibleRange](#visiblerange). |

Only the props above are used. Anything else you pass, such as `id` or `data-*` attributes, is not forwarded to the wrapper.

If `items` changes so that the active index no longer exists (for example the list gets shorter), the gallery resets to the first item.

## ariaLiveText

The gallery renders a visually hidden `aria-live="polite"` region. Screen readers announce its content whenever it changes, which is every time the active item changes.

`$i` is replaced with the active item's number (starting at 1) and `$t` with the total number of items. Use this to translate the announcement:

```jsx
<Gallery items={ITEMS} ariaLiveText="Diapositive $i sur $t.">
```

Pass an empty string to turn the announcement off.

## onChange

Receives a single object. TypeScript: `GalleryChangeEvent` for the object, `GalleryChangeCallback` for the function.

| Field | Type | Description |
| --- | --- | --- |
| `oldIndex` | `number` | Index that was active before the change. |
| `newIndex` | `number` | Index that is now active. |
| `direction` | `0 \| 1` | `1` for next/forward, `0` for previous/back. |

Things to know about when it fires:

- It does not fire for [`setActiveIndex`](/docs/api/use-gallery#navigation), which changes the item silently.
- With `loop` off, "next" on the last item (or "previous" on the first, or dragging past either end) still fires `onChange`, with `oldIndex` equal to `newIndex`. Compare the two if you only care about real changes.
- For `goToIndex` and pagination, `direction` is `1` when the new index is higher and `0` otherwise, including when it is the same.

:::warning[Defer state updates inside onChange]
"Next", "previous", and dragging call `onChange` from inside the gallery's own React state update (checked in v<GalleryVersion />). Setting your own state synchronously in the callback triggers React's "Cannot update a component while rendering a different component" warning, and in development with `<StrictMode>` the callback can run twice. Defer the update with `setTimeout(..., 0)` or similar; see the [custom controls demo](/docs/demos/custom-controls).
:::

## visibleRange

`visibleRange` doesn't change the layout by itself. It marks each item's `<li>` with `data-item-visible`, which you style:

```css
.my-slide[data-item-visible="false"] {
  opacity: 0;
  visibility: hidden;
}
```

It does not affect accessibility: only the active item is exposed to assistive technology either way (see [GalleryItem](/docs/api/gallery-item#accessibility)). The [visible range demo](/docs/demos/visible-range) shows it in action.
