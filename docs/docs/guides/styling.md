---
sidebar_position: 1
---
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import GalleryItemCSSProps from "@site/snippets/gallery-item-css-props.mdx"
import GalleryCSSProps from "@site/snippets/gallery-css-props.mdx"
import ReducedMotionCss from "@site/snippets/reduced-motion-css.mdx"

# Styling

The gallery ships one small stylesheet that handles positioning, transforms, and dragging:

```js
import "@wethegit/react-gallery/style.css"
```

Everything visual beyond that is yours. There are two layers of customization: CSS custom properties for layout and motion, and `className` props for your own design.

:::note[Set them on your own classes]
The stylesheet's class names are generated (for example `gallery-module__gallery__VCgDes`) and can change between releases, so you can't target `.gallery` or `.gallery__item` directly. Custom properties are inherited and keep their names, so set them on the `className` you pass to `<Gallery>`, or through its `style` prop.

Your class and the gallery's class are on the same element with equal specificity, so whichever stylesheet loads last wins. If a value doesn't take effect, import your styles after `@wethegit/react-gallery/style.css` or make your selector more specific.
:::
## Works well with CSS/SCSS modules

Because every component accepts `className` (and pagination buttons accept `buttonClassName`), the gallery pairs naturally with scoped styling like SCSS modules. All demos on this site are styled that way:

```scss title="shared.module.scss"
.gallery {
  --item-width: min(100%, 640px);
  --inline-gap: 4rem;
  --duration: 0.45s;

  @media (prefers-reduced-motion: reduce) {
    --duration: 0s;
  }
}

.slide {
  opacity: 0.45;
  transition: opacity var(--duration);

  &.isActive {
    opacity: 1;
  }
}
```

```tsx
import { classnames } from "./src/utils/classnames"
import styles from "./shared.module.scss"

<Gallery items={ITEMS} className={styles.gallery}>
  <GalleryMain
    renderGalleryItem={({ item, index, active }) => (
      <GalleryItem
        key={item.id}
        index={index}
        active={active}
        className={classnames([styles.slide, active && styles.isActive])}
      >
        <img src={item.image} alt={item.alt} />
      </GalleryItem>
    )}
  />
</Gallery>
```

Custom property names (`--item-width`, `--inline-gap`) are never hashed by CSS modules, so the gallery's stylesheet picks them up regardless of scoping.

## Layout custom css properties

## On `<Gallery>`

Set these on the Gallery component's CSS selector.

<GalleryCSSProps />

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

For reference, the default layout's stylesheet calculates `--x` as:

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

```css
.my-gallery {
  --item-width: min(70vw, 640px);
  --inline-gap: 4rem;
  --duration: 0.45s;
}
```

Or inline (TypeScript needs a cast for custom property names):

```tsx
<Gallery
  items={ITEMS}
  style={{ "--inline-gap": "1.5rem" } as CSSProperties}
>
```

`<GalleryPagination>` has its own `--inline-gap` (default `10px`) controlling the space between pagination items.

## Sizing items

Avoid use of `%` in `--item-width`. The stylesheet uses `--item-width` twice: as the item's `inline-size`, where `%` is a percentage of the gallery, and inside `translateX()` to space the items, where `%` is a percentage of the item itself. The two don't match, so items end up closer together than `--inline-gap` and can overlap. For example, `min(70%, 640px)` with a `4rem` gap overlaps neighbouring items by 128px when the items are 640px wide.

Use a unit that means the same thing in both places:

- A fixed size: `px` or `rem`.
- A viewport size: `vw`, for galleries that span the page.
- A container size: `cqi`, which is a percentage of the nearest parent with `container-type: inline-size`. This is the closest to `%`, and what the demos on this site use:

```css
.my-gallery-wrapper {
  container-type: inline-size;
}

.my-gallery {
  --item-width: min(70cqi, 640px);
}
```

The package's own default, `min(75%, 1000px)`, has the same approach which will get updated on the next releases. Its large default `--inline-gap` (`25vw`) usually hides it, but if you reduce the gap, set `--item-width` too.

## Per-item custom properties

Each `<GalleryItem>` receives these inline; use them in your own CSS for state-driven effects:

<GalleryItemCSSProps />


For example, fading items by distance from center and staggering their transitions:

```css
.my-slide {
  opacity: calc(1 - var(--center-offset) * 0.3);
  transition-delay: calc(0.05s * var(--center-offset));
}
```

## State styling without extra classes

- The active pagination button gets `aria-current="true"`; style `[aria-current="true"]`.
- Disabled nav buttons get the native `disabled` attribute; style `:disabled`.
- For active slides, apply your own class from the `active` flag in `renderGalleryItem`.

## Reduced motion

Respect the user's reduced motion setting by setting `--duration` to `0s`. In CSS:

<ReducedMotionCss />

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
