---
sidebar_position: 1
---

import { GalleryVersion } from "@site/src/components/versions/gallery-versions"

# Styling

The gallery ships one small stylesheet that handles positioning, transforms, and dragging:

```js
import "@wethegit/react-gallery/style.css"
```

Everything visual beyond that is yours. There are two layers of customization: CSS custom properties for layout and motion, and `className` props for your own design.

:::warning[Hashed class names]
The stylesheet uses CSS-module-style hashed class names (for example `gallery-module__gallery__VCgDes`), so you cannot reliably target the library's internal classes from your own CSS. Style through the `className`/`buttonClassName` props and the custom properties below instead.
:::

## Works well with CSS/SCSS modules

Because every component accepts `className` (and pagination buttons accept `buttonClassName`), the gallery pairs naturally with scoped styling like SCSS modules. All demos on this site are styled that way:

```scss title="shared.module.scss"
.card {
  // Makes .card a size container, so cqi below means "% of .card's width".
  container-type: inline-size;
}

.gallery {
  // Not %: see "Sizing items" in the styling guide.
  --item-width: min(70cqi, 640px);
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

## Layout custom properties

The main ones are below; [CSS custom properties](/docs/api/css-custom-properties) in the API reference lists them all, including `--x` for custom transforms.

Set these on the `<Gallery>` wrapper, either through a class or inline via `style`:

| Property | Default | Description |
| --- | --- | --- |
| `--item-width` | `min(75%, 1000px)` | Width of each item. Avoid `%`; see [Sizing items](#sizing-items). |
| `--inline-gap` | `25vw` | Horizontal space between items. |
| `--active-gap` | `0px` | Extra space on both sides of the active item. |
| `--duration` | `0.5s` | Transition duration for slide movement. |
| `--position-offset` | `0px` | Constant offset applied to all items, useful for asymmetric layouts. |

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

The package's own default, `min(75%, 1000px)`, has the same approach which will get updated on the next releases. Its large default `--inline-gap` (`25vw`) usually hides it, but if you reduce the gap, set `--item-width` too. Checked in v<GalleryVersion />.

## Per-item custom properties

Each `<GalleryItem>` receives these inline; use them in your own CSS for state-driven effects:

| Property | Description |
| --- | --- |
| `--i` | Item index. |
| `--center-offset` | Absolute distance from the active item. |
| `--index-offset` | Signed distance from the active item. |
| `--side` | `-1` (left of active), `0` (active), `1` (right of active). |
| `--active` | `1` when active, `0` otherwise. |

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

Honor `prefers-reduced-motion` by zeroing the transition duration:

```css
@media (prefers-reduced-motion: reduce) {
  .my-gallery {
    --duration: 0s;
  }
}
```

This is pure CSS; no JavaScript media-query checks needed. All demos on this site apply it.
