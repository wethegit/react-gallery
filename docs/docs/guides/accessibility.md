---
sidebar_position: 2
---

import { GalleryVersion } from "@site/src/components/versions/gallery-versions"

# Accessibility

The gallery follows the [WAI carousel tutorial](https://www.w3.org/WAI/tutorials/carousels/) patterns and handles the structural work for you:

- **Focus management and tabbing** across slides and controls.
- **Live region announcements** when the active item changes, using the `ariaLiveText` template (`"Item $i of $t."` by default).
- **Semantic markup**: items render as list items, pagination as a list of buttons, and the active pagination button carries `aria-current`.

Non-active items are removed from the accessibility tree (`aria-hidden="true"`, `tabIndex={-1}`), so interactive content inside a slide is only reachable while that slide is active. Note this is driven by the active item alone; `visibleRange` does not affect it.

A few things remain your responsibility.

## Provide text alternatives

Every image needs meaningful `alt` text, and icon-only controls need a visually-hidden label:

```jsx
<GalleryNav direction={1}>
  <span aria-hidden="true">&rarr;</span>
  <span className="visually-hidden">Next item</span>
</GalleryNav>
```

:::note[Bring your own utility class]
The package README mentions a `.gallery-util-visually-hidden` utility, but the published stylesheet only contains it under a generated class name (checked in v<GalleryVersion />), so it is not usable from your markup. Define the standard utility yourself:

```css
.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```
:::

When a pagination thumbnail repeats the slide's image, give the thumbnail an empty `alt=""` and label the button with hidden text instead, so screen reader users do not hear the description twice.

## Localize the live region

`ariaLiveText` is announced to assistive technology on every slide change. Replace it when your interface is not in English; `$i` and `$t` are substituted with the current item number and the total:

```jsx
<Gallery items={ITEMS} ariaLiveText="Élément $i sur $t.">
```

## Respect reduced motion

Slide transitions are controlled by the `--duration` custom property, so honoring `prefers-reduced-motion` is one media query:

```css
@media (prefers-reduced-motion: reduce) {
  .my-gallery {
    --duration: 0s;
  }
}
```

## Keep custom controls accessible

When building controls with [`useGallery`](/docs/api/use-gallery):

- Use real `<button type="button">` elements so keyboard and assistive tech interaction work for free.
- Reflect state with ARIA (`aria-current` on the active jump button, for example).
- Avoid autoplay, or pair it with a visible pause control; motion that cannot be stopped is a [WCAG 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html) failure.
