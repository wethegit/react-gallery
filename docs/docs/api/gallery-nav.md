---
sidebar_position: 4
---

import { GalleryVersion } from "@site/src/components/versions/gallery-versions"

# GalleryNav

A "previous" or "next" button. It renders a `<button>` that calls the gallery's `previous` or `next` method, depending on `direction`. Must be used inside a `<Gallery>`.

```jsx
<GalleryNav direction={0}>
  <span aria-hidden="true">&larr;</span>
  <span className="visually-hidden">Previous item</span>
</GalleryNav>

<GalleryNav direction={1}>
  <span aria-hidden="true">&rarr;</span>
  <span className="visually-hidden">Next item</span>
</GalleryNav>
```

## Props

TypeScript: `GalleryNavProps`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `0 \| 1` | required | `0` for previous, `1` for next. |
| `children` | `ReactNode` | | The button's content. If it's only an icon, include visually hidden text. |
| `renderNavItem` | `(args: RenderNavItemArgs) => ReactNode` | | Renders the button's content instead of `children`, with access to the gallery's state. See [renderNavItem](#rendernavitem). |
| `className` | `string` | | Extra class for the `<button>`. |

Any other `<button>` attributes (`aria-label`, `title`, `ref`, ...) are passed through.

Give it either `children` or `renderNavItem`. With both, `children` wins. With neither, `GalleryNav` renders nothing.

## renderNavItem

Use it when the content depends on the gallery's state, for example a different icon when the button is disabled. TypeScript: `RenderNavItemArgs`.

| Field | Type | Description |
| --- | --- | --- |
| `activeIndex` | `number` | Index of the active item. |
| `disabled` | `boolean` | Whether this button is disabled. Always `false` when `loop` is on. |

```jsx
<GalleryNav
  direction={1}
  renderNavItem={({ disabled }) => (
    <>
      <span aria-hidden="true">{disabled ? "■" : "→"}</span>
      <span className="visually-hidden">Next item</span>
    </>
  )}
/>
```

The button already gets the `disabled` and `aria-disabled="true"` attributes when it's disabled; the `disabled` argument is only for changing what you render.

## Disabled state

With `loop` off, the "previous" button is disabled on the first item and the "next" button on the last. Style it with `:disabled`. With `loop` on, the buttons are never disabled.

## Focus

When the active item is the first or the last, `GalleryNav` moves keyboard focus to that item. This keeps focus from being lost on a button that has just become disabled.

:::warning[The gallery's container can jump sideways]
The focus call doesn't use `preventScroll`. If a parent of the gallery has `overflow: hidden`, the browser can scroll that parent to reach the item while it's still sliding in, so the whole gallery and its controls jump sideways and back. Use `overflow: clip` on that parent instead: it clips the same way but can't be scrolled. Checked in v<GalleryVersion />.
:::

If you need a different kind of control (a counter, keyboard shortcuts, autoplay), skip `GalleryNav` and build your own with [`useGallery`](/docs/api/use-gallery); see the [custom controls demo](/docs/demos/custom-controls).
