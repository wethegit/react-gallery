---
sidebar_position: 7
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# CSS custom properties

The base stylesheet (`@wethegit/react-gallery/style.css`) lays the gallery out with CSS custom properties. Most of them position the items to the sides of the active one, and you can change them to get very different layouts. For how to apply them, with examples, see the [styling guide](/docs/guides/styling).

:::note[Set them on your own classes]
The stylesheet's class names are generated (for example `gallery-module__gallery__VCgDes`) and can change between releases, so you can't target `.gallery` or `.gallery__item` directly. Custom properties are inherited and keep their names, so set them on the `className` you pass to `<Gallery>`, or through its `style` prop.

Your class and the gallery's class are on the same element with equal specificity, so whichever stylesheet loads last wins. If a value doesn't take effect, import your styles after `@wethegit/react-gallery/style.css`, make your selector more specific, or use `style`.
:::

## On `<Gallery>`

Set these on `<Gallery>`'s `className` or `style`. Children inherit them.

| Property | Default | Description |
| --- | --- | --- |
| `--item-width` | `min(75%, 1000px)` | Width of each item in `<GalleryMain>`. Avoid using `%` items may end up too close together and can overlap. Use `px`, `rem`, `vw`, or `cqi`; see [Sizing items](/docs/guides/styling#sizing-items). |
| `--inline-gap` | `25vw` | Horizontal space between items. |
| `--active-gap` | `0px` | Extra horizontal space between the active item and the items on either side. |
| `--duration` | `0.5s` | Length of the slide transition. See [Reduced motion](#reduced-motion). |
| `--position-offset` | `0px` | Shifts every item sideways by the same amount, for off-center layouts. |
| `--touch-offset` | `0` | How far the current drag has moved, in pixels without a unit. Set by the gallery while dragging; don't set it yourself. |

## On `<GalleryMain>`

Set by the component on its `<ul>`. Read them in your CSS; don't set them.

| Property | Description |
| --- | --- |
| `--selected` | Index of the active item. |
| `--total` | Number of items. |

## On `<GalleryItem>`

Set by the component on each `<li>`. Read them in your CSS; don't set them.

| Property | Description |
| --- | --- |
| `--i` | This item's index. |
| `--center-offset` | Distance from the active item, in items (always positive). |
| `--index-offset` | Distance from the active item, in items: negative before it, positive after it. |
| `--side` | `-1` before the active item, `0` for the active item, `1` after it. |
| `--active` | `1` for the active item, otherwise `0`. |
| `--x` | The item's final horizontal position, calculated by the stylesheet from the properties above. Use it as the `translateX()` value if you write your own `transform`. |

For reference, the stylesheet calculates `--x` as:

```css
--x: calc(
  (var(--touch-offset, 0) * 1px) + var(--position-offset) +
    (var(--active-gap) * var(--side)) +
    (var(--item-width) + var(--inline-gap)) * (var(--i) - var(--selected))
);
transform: translateX(var(--x));
```

So if you need a custom transform, keep `translateX(var(--x))` in it, for example `transform: translateX(var(--x)) scale(calc(1 - var(--center-offset) * 0.1))`. Set `transform: none` on your item class and the items stack in one place instead.

## On `<GalleryPagination>`

| Property | Default | Description |
| --- | --- | --- |
| `--inline-gap` | `10px` | Space between pagination items. Set it on the `className` you pass to `<GalleryPagination>`. |

## Reduced motion

Respect the user's reduced motion setting by setting `--duration` to `0s`. In CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .my-gallery {
    --duration: 0s;
  }
}
```

Or in JavaScript, through `style`:

<Tabs groupId="code-language">
<TabItem value="ts" label="TypeScript" default>

```tsx
import type { CSSProperties } from "react"

function YourGallery() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  const style = {
    "--duration": prefersReducedMotion ? "0s" : "0.5s",
  } as CSSProperties

  return (
    <Gallery items={ITEMS} style={style}>
      {/* ... */}
    </Gallery>
  )
}
```

</TabItem>
<TabItem value="js" label="JavaScript">

```jsx
function YourGallery() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  const style = {
    "--duration": prefersReducedMotion ? "0s" : "0.5s",
  }

  return (
    <Gallery items={ITEMS} style={style}>
      {/* ... */}
    </Gallery>
  )
}
```

</TabItem>
</Tabs>

The CSS version is simpler and works with server rendering, where `window` doesn't exist.
