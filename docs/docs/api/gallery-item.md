---
sidebar_position: 3
---

# GalleryItem

Wraps a single gallery item. It renders an `<li>` and sets the attributes and CSS custom properties the stylesheet uses to position it. Always return it from `renderGalleryItem` on [`<GalleryMain>`](/docs/api/gallery-main).

```jsx
<GalleryItem key={item.id} index={index} active={active}>
  <img src={item.image} alt={item.alt} />
</GalleryItem>
```

## Props

TypeScript: `GalleryItemProps`. `GalleryItem` never sees your item data, so it takes no type argument.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | required | This item's index. Pass `index` through from `renderGalleryItem`. |
| `active` | `boolean` | required | Whether this item is active. Pass `active` through from `renderGalleryItem`. |
| `children` | `ReactNode` | | The item's content. |
| `className` | `string` | | Extra class for the `<li>`. Use it with `active` for state styling. |
| `style` | `CSSProperties` | | Inline styles for the `<li>`. |

Any other `<li>` attributes are passed through.

## Accessibility

- Every item gets `tabIndex={-1}`, so items can receive focus from code (the gallery uses this, see [GalleryNav](/docs/api/gallery-nav#focus)) but are never in the Tab order.
- Items that aren't active get `aria-hidden="true"`, which hides them from assistive technology. Only the active item is exposed.

This depends only on `active`, not on `visibleRange`. If a slide contains links or buttons, only the active slide's controls can be reached, which is usually what you want in a carousel.

## Data attributes

| Attribute | Value |
| --- | --- |
| `data-item-visible` | `"true"` if the item is within the gallery's [`visibleRange`](/docs/api/gallery#visiblerange) of the active item, otherwise `"false"`. Always `"true"` when `visibleRange` is `-1`. |
| `data-was-active` | `"true"` on the item that was active before the last change. |

Style them with attribute selectors, for example `.my-slide[data-item-visible="false"]`.

## CSS custom properties

`GalleryItem` sets these inline on the `<li>`. The base stylesheet combines them into `--x`, the item's horizontal position.

| Property | Description |
| --- | --- |
| `--i` | This item's index. |
| `--center-offset` | Distance from the active item, in items (always positive). |
| `--index-offset` | Distance from the active item, in items: negative before it, positive after it. |
| `--side` | `-1` before the active item, `0` for the active item, `1` after it. |
| `--active` | `1` for the active item, otherwise `0`. |

They're handy in your own CSS, for example `transition-delay: calc(0.05s * var(--center-offset))`. The full list, including `--x`, is in [CSS custom properties](/docs/api/css-custom-properties).
