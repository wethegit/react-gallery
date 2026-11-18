# TypeScript

`@wethegit/react-gallery` ships its own type declarations, so there is no `@types/` package to install. The one thing to learn is how your item type reaches the render props.

## Why `item` is `unknown`

`<Gallery>` knows your item type, because it is inferred from the `items` array. The child components don't. `<Gallery>` hands the items to `<GalleryMain>`, `<GalleryPagination>`, and `useGallery()` through React context, and a type can't travel through context. Each of them is generic over the item type, and without one it falls back to `unknown`.

So this compiles in JavaScript but fails in TypeScript:

```tsx
<Gallery items={ITEMS}>
  <GalleryMain
    renderGalleryItem={({ item }) => <img src={item.image} alt={item.alt} />}
  />
</Gallery>
```

```text
error TS18046: 'item' is of type 'unknown'.
```

## Passing the item type

First, give your items a type. Either declare one:

```ts
interface Item {
  id: string
  image: string
  alt: string
}

const ITEMS: Item[] = [
  { id: "a", image: "/images/a.jpg", alt: "Description of image A" },
]
```

or take it from an array you already have:

```ts
type Item = (typeof ITEMS)[number]
```

Then pass it to each component that gives you an `item`. In a `.tsx` file, a component's type argument goes right after its name:

```tsx
<Gallery items={ITEMS}>
  <GalleryMain<Item>
    renderGalleryItem={({ item, index, active }) => (
      <GalleryItem key={item.id} index={index} active={active}>
        <img src={item.image} alt={item.alt} />
      </GalleryItem>
    )}
  />

  <GalleryPagination<Item>
    renderPaginationItem={({ item, index, active }) => (
      <GalleryPaginationItem key={item.id} index={index} active={active}>
        <span className="visually-hidden">Go to {item.alt}</span>
      </GalleryPaginationItem>
    )}
  />
</Gallery>
```

| Where | Pass the type as | Without it |
| --- | --- | --- |
| `<Gallery>` | Nothing: inferred from `items` | |
| `<GalleryMain>` | `<GalleryMain<Item>>` | `item` is `unknown` |
| `<GalleryPagination>` | `<GalleryPagination<Item>>` | `item` is `unknown` |
| `useGallery()` | `useGallery<Item>()` | `galleryItems` is `unknown[]` |
| `<GalleryItem>`, `<GalleryNav>`, `<GalleryPaginationItem>` | Nothing: they never see an item | |

### Alternative: annotate the render function

If you'd rather not write a type argument in JSX, type the render function's argument with the exported `RenderGalleryItemArgs` (or `RenderPaginationItemArgs`). TypeScript infers the generic from it:

```tsx
import { type RenderGalleryItemArgs } from "@wethegit/react-gallery"

<GalleryMain
  renderGalleryItem={({ item, index, active }: RenderGalleryItemArgs<Item>) => (
    <GalleryItem key={item.id} index={index} active={active}>
      <img src={item.image} alt={item.alt} />
    </GalleryItem>
  )}
/>
```

## Custom controls with `useGallery`

`useGallery<Item>()` returns the gallery's state and actions with `galleryItems` typed as `Item[]`:

```tsx
function Caption() {
  const { galleryItems, activeIndex } = useGallery<Item>()
  return <p>{galleryItems[activeIndex].alt}</p>
}
```

It must be rendered inside a `<Gallery>`; see the [custom controls demo](/docs/demos/custom-controls).

## Typing `onChange`

Use `GalleryChangeCallback` for the handler, or `GalleryChangeEvent` for its argument. `direction` is `1` when moving forward and `0` when moving back:

```tsx
import { type GalleryChangeCallback } from "@wethegit/react-gallery"

const handleChange: GalleryChangeCallback = ({ oldIndex, newIndex, direction }) => {
  console.log(`${oldIndex} -> ${newIndex}`, direction === 1 ? "forward" : "back")
}

<Gallery items={ITEMS} onChange={handleChange}>
```

## CSS custom properties in `style`

React's `CSSProperties` type doesn't know about custom properties such as `--inline-gap`, so cast the object:

```tsx
import type { CSSProperties } from "react"

<Gallery
  items={ITEMS}
  style={{ "--inline-gap": "1.5rem", "--item-width": "min(80vw, 480px)" } as CSSProperties}
>
```

## Exported types

All of these are exported from `@wethegit/react-gallery`:

| Type | What it describes |
| --- | --- |
| `GalleryProps<T>` | Props of `<Gallery>` |
| `GalleryMainProps<T>`, `GalleryPaginationProps<T>` | Props of the generic list components |
| `GalleryItemProps`, `GalleryNavProps`, `GalleryPaginationItemProps` | Props of the other components |
| `RenderGalleryItemArgs<T>`, `RenderPaginationItemArgs<T>`, `RenderNavItemArgs` | Arguments passed to each render function |
| `GalleryChangeEvent`, `GalleryChangeCallback` | The `onChange` event and handler |
| `GalleryPaginationItemClickArgs` | Argument of `GalleryPaginationItem`'s `onClick` |
| `GalleryContextValue<T>` | What `useGallery()` returns |
| `TouchState`, `TouchStateStart` | Drag state inside `GalleryContextValue` |

Every demo on this site is written in TypeScript and uses these patterns. Switch any demo's source to **TypeScript** to see them in context.
