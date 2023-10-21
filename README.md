# @wethegit/react-gallery

A slideshow-style gallery component for use in React projects.

- [Getting started](#getting-started)
  - [Starter example](#create-a-simple-gallery)
- [Custom layouts](#custom-layouts)
- [Components and options](#components-and-options)
  - [Gallery](#gallery)
  - [GalleryMain](#gallerymain)
  - [GalleryItem](#galleryitem)
  - [GalleryNav](#gallerynav)
  - [GalleryPagination](#gallerypagination)
- [Accessibility](#accessibility)
- [useGallery hook](#useGallery)
  - [Advanced customization](#advanced-customization)
  - [Usage](#usage)

## Features

- Accessibility. Built with careful attention to focus management and assistive technology.
- Fully-customizable layouts, using CSS Custom Properties.
- Provides a custom React hook for accessing gallery data, state, updater functions, and more. Build anything on top of the existing gallery components!

## Getting started

### Install the package

```bash
npm install @wethegit/react-gallery
-or-
yarn add @wethegit/react-gallery
```

### Import the Components and—optionally—the hook.

```js
import {
  Gallery,
  GalleryMain,
  GalleryItem,
  GalleryNav,
  GalleryPagination,
  useGallery,
} from "@wethegit/react-gallery"
```

### Import the base stylesheet

This is an optional step, but it's highly recommended to use the base styles as a starting point. The most straightforward way to do this is to import the stylesheet into your app directly from the `/node_modules/@wethegit/react-gallery/dist/` directory, but you can do this in whichever way is preferable within your build system or framework.

```jsx
// app.js

import "@wethegit/react-gallery/style.css"
```

### Create a simple Gallery

The `<Gallery>` component is a React context provider, which gives all child components access to relevant data. All child components that need access to gallery data must live within a `<Gallery>`. Here's an example of a gallery, given the following contrived data `GALLERY_ITEMS`. This will be explained in detail shortly.

⚠️ Before continuing, make sure you have properly [imported the base stylesheet](#import-the-base-stylesheet), if you intend to use it.

<!-- prettier-ignore -->
```js
// some-data.js

export const GALLERY_ITEMS = [
  { image: "/my-image-1.png", alt: "Description of image!", id: 131789 },
  { image: "/my-image-2.png", alt: "Description of image!", id: 235233 },
  { image: "/my-image-3.png", alt: "Description of image!", id: 987432 },
  { image: "/my-image-4.png", alt: "Description of image!", id: 768324 },
]
```

<!-- prettier-ignore -->
```jsx
// your-gallery.js

import { GALLERY_ITEMS } from "./some-data"
import { Gallery, GalleryMain, GalleryNav, GalleryPagination, GalleryItem } from "@wethegit/react-gallery"

const YourGallery = () => {
  return (
    <Gallery items={GALLERY_ITEMS}>

      <GalleryMain
        renderGalleryItem={({ item, i, active }) => (
          <GalleryItem key={i} index={i} active={active}>
            <img src={item.image} alt={item.alt} />
          </GalleryItem>
        )}
      />

      <GalleryNav direction={0}>⬅️</GalleryNav>
      <GalleryNav direction={1}>➡️</GalleryNav>

      <GalleryPagination
        renderPaginationItem={({ i }) => (
          <span>{i + 1}</span>
        )}
      />

    </Gallery>
  )
}

export default YourGallery
```

The first step is to give your data to the `<Gallery>` component via the `items` prop. At the very least, `items` is expected to be an Array. From there, you're free to arrange the child components this package provides as you see fit. Below is a brief description of each of the child components' usage. For a detailed breakdown of this component, jump ahead to the [Gallery](#gallery) section.

`<GalleryMain>` is the primary gallery view where your item data is rendered. It receives a render prop, `renderGalleryItem`, which exposes a few arguments you can use in the JSX you return: `item`, `i`, `activeIndex`, and `active` and expects a `<GalleryItem>` to be returned. For a detailed breakdown of this component, jump ahead to the [GalleryMain](#gallerymain) section.

We're using the `<GalleryNav>` component to define our "next" and "previous" buttons. These components receive a `direction` prop, which expects either a `1` or a `0`, and corresponds to the direction the gallery should move in when the button in question is clicked (where `0` maps to "previous", and `1` maps to "next"). For a detailed breakdown of this component, see the [GalleryNav](#gallerynav) section.

We're also using the `<GalleryPagination>` component here. If you're not familiar, "pagination" refers to what is often rendered as a set of "dots" below a gallery — but this can be _anything_ (thumbnails, icons, and so on). This component receives the render prop, `renderPaginationItem`, which exposes a few arguments you can use in the JSX you return: `item`, `i`, `activeIndex`, and `active`. For a detailed breakdown of this component, jump ahead to the [GalleryPagination](#gallerypagination) section.

## Custom layouts

Assuming the base stylesheet is being used, the `<GalleryMain>` component renders as a CSS grid, with a single grid area to house the currently-active item. There are a number of CSS custom properties on the various gallery components, which will allow you to customize the look of the gallery. Most of these properties are used to calculate the horizontal positioning of the gallery items around the main grid cell, and can be adjusted to create many different layout variations. Remove the `transform` property of a `.gallery__item` entirely, and you'll get a traditional, stacked gallery.

| CSS custom property | Element where defined  | Default          | Description                                                                                                                     |
| ------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| --item-width        | .gallery               | min(75%, 1000px) | The width of the items rendered by `<GalleryMain>`.                                                                             |
| --gap               | .gallery               | 25vw             | The horizontal gap between the gallery items.                                                                                   |
| --active-gap        | .gallery               | 0px              | The horizontal gap between the currently-active gallery item and the rest.                                                      |
| --duration          | .gallery               | 0                | The duration of the transition between active gallery items.                                                                    |
| --touch-offset      | .gallery               | 0                | The x-offset of the gallery layout, as a result of a `pointermove` action.                                                      |
| --position-offset   | .gallery               | 0px              | A general x-offset, if needed.                                                                                                  |
| --i                 | .gallery\_\_item       |                  | The index of the gallery item.                                                                                                  |
| --center-offset     | .gallery\_\_item       |                  | The offset of the item from the "middle" item, in number of items.                                                              |
| --index-offset      | .gallery\_\_item       |                  | The offset of the item from the active item, in number of items.                                                                |
| --side              | .gallery\_\_item       |                  | Either `-1`, `0`, or `1`; mapping to "left", "center", and "right" of the middle item.                                          |
| --active            | .gallery\_\_item       |                  | Either `1` or `0`, mapping to true or false.                                                                                    |
| --x                 | .gallery\_\_item       |                  | The final calculation of a gallery item's x position. Use this as a `translateX` value when customizing `transform` properties. |
| --gap               | .gallery\_\_pagination | 10px             | The CSS grid gap between pagination items.                                                                                      |

## Components and options

### &lt;Gallery&gt;

The parent component for all gallery instances. This serves as a React context provider to its children.

#### Props:

| Prop         | Type     | Default value    | Description                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ariaLiveText | String   | "Item $i of $t." | `aria-live` region text, which assistive technologies will announce when the active gallery item changes. [More information](#arialivetext) below.                                                                                                                                                                                                                                                     |
| className    | String   |                  |                                                                                                                                                                                                                                                                                                                                                                                                        |
| draggable    | Boolean  | true             | Allows user to advance the gallery by dragging their finger or pointing device.                                                                                                                                                                                                                                                                                                                        |
| items        | Array    |                  | The gallery data.                                                                                                                                                                                                                                                                                                                                                                                      |
| loop         | Boolean  | false            | Allows for looping behavior — i.e. when the last gallery item is active, a user can navigate to the "next" slide, which will take them back to the start of the gallery.                                                                                                                                                                                                                               |
| onChange     | Function |                  | Function to run on gallery state update, as a result of a "next", "previous", or "pagination" action. [More information](#onchange) below.                                                                                                                                                                                                                                                             |
| startIndex   | Number   | 0                | The index of the gallery item that should be active to start.                                                                                                                                                                                                                                                                                                                                          |
| visibleRange | Number   | -1               | The number of gallery items "visible" to the left or right of the active one. This option adds a CSS class to all elements within this range, allowing for layout customization. The default value of `-1` specifies that all items are visible, while setting the value to `1` for example, would add the `"gallery__item--visible"` class those items within immediate proximity to the active item. |

#### `ariaLiveText`

Per the WAI-ARIA spec, browsers using assistive technology such as screen readers announce content within a DOM element containing the `aria-live` attribute, anytime it changes. The gallery component's default value for this prop is `"Item $i of $t."`. The variables `$i` and `$t` here correspond to "current index" and "total number of items", and will be replaced with those values when rendered. This level of customization is provided so that you can localize/translate your content with accuracy.

#### `onChange`

The `onChange` callback allows you to run code whenever the active gallery item changes. It receives a single Object as an argument, containing the following properties:

| Argument  | Type   | Description                                                |
| --------- | ------ | ---------------------------------------------------------- |
| oldIndex  | Number | The index before the onChange function fired.              |
| newIndex  | Number | The index after the onChange function fires.               |
| direction | Number | Either `0` or `1`, mapping to previous/left or next/right. |

### &lt;GalleryMain&gt;

The primary gallery body. Must be used within a `<Gallery>`. Renders an unordered list (`<ul>`) of your gallery items.

#### Props:

| Prop              | Type     | Description                                                                                                     |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| className         | String   |                                                                                                                 |
| renderGalleryItem | Function | A render prop, returning the JSX to render for each gallery item. [More information](#rendergalleryitem) below. |

#### `renderGalleryItem`

This render prop expects a `<GalleryItem>` to be returned, and receives a handful of arguments:

| Argument    | Type    | Description                                                                                                    |
| ----------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| active      | Boolean | Whether the current item being iterated over is the active item.                                               |
| activeIndex | Number  | The index of the currently active gallery item.                                                                |
| i           | Number  | The index of the current item being iterated over.                                                             |
| item        | Any     | The current item being iterated over, as defined by the Array fed to the `<Gallery>` component's `items` prop. |

### &lt;GalleryItem&gt;
Required component that wraps each child inside the `renderGalleryitem` prop. Renders a list item (`<li>`) and can accept the following props:

| Prop              | Type     | Description                                                                                                     |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| children         | JSX   |                                                                                                                 |
| className         | String   |                                                                                                                 |
| active | Boolean | Whether the current item being iterated over is the active item. |
| index | Number | The index of the currently active gallery item. |


### &lt;GalleryNav&gt;

The navigational "next" and "previous" buttons. Must be used within a `<Gallery>`. You can render your buttons either by passing regular JSX children to them, or by using the `renderNavItem` render prop.

#### Props:

| Prop          | Type     | Description                                                                                                                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children      | JSX      | Optional. Pass children to the component to render them as children of the implicit `<button>` element.                                                                           |
| className     | String   |                                                                                                                                                                                   |
| direction     | Number   |                                                                                                                                                                                   |
| renderNavItem | Function | Optional. For more control over rendering than the `children` prop would give you, you have the option to pass JSX to this render prop. [More information](#renderNavItem) below. |

#### `renderNavItem`

This render prop is a nice alternative to simply passing childern to the `<GalleryNav>`, as it provides you with a handful of arguments, as outlined below:

| Argument    | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activeIndex | Number  | The index of the currently-active gallery item.                                                                                                                                                                                                                                                                                                                                                         |
| disabled    | Boolean | Whether the nav button is in its disabled state — presumably from `<Gallery>` having its `loop` prop set to `false`. Note that the DOM node attributes `disabled` and `aria-disabled="true"` are already added to the rendered button; whereas the purpose of this argument is to allow you to render something different based on that disabled state, or write some other rendering code based on it. |

### &lt;GalleryPagination&gt;

Renders an unordered list (`<ul>`) of pagination items. Must be used within a `<Gallery>`.

#### Props:

| Prop                 | Type     | Description                                                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| className            | String   |                                                                                                                       |
| renderPaginationItem | Function | A render prop, returning the JSX to render for each pagination item. [More information](#renderpaginationitem) below. |

#### `renderPaginationItem`

This render prop wraps its return value in a list item (`<li>`) and a `<button>`, and receives a handful of arguments:

| Argument    | Type    | Description                                                                                                               |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| active      | Boolean | Whether the current pagination item being iterated over corresponds to the active gallery item.                           |
| activeIndex | Number  | The index of the currently active gallery item.                                                                           |
| index       | Number  | The index of the current pagination item being iterated over.                                  |
| item        | Any     | The current pagination item being iterated over, as defined by the Array fed to the `<Gallery>` component's `items` prop. |

**Example usage of `renderPaginationItem` render props**
```jsx
<GalleryPagination
  renderPaginationItem={({ index, active }) => (
    <GalleryPaginationItem index={index} active={active} key={index}>
      <span>{index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```
### &lt;GalleryPaginationItem&gt;

Used in the prop `renderPaginationItem` of `<GalleryPagination>`. This component with a return value in a list item (`<li>`) and a `<button>`, and receives a handful of arguments:

#### Props:


| Prop               | Type     | Description                                                                                                     |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| active             | Boolean  | Boolean to set the `<button>`'s `aria-current` attribute.                                                       |
| buttonClassName    | String   | Set the `<button>` element's class.                                                                             |
| buttonProps        | Object   | Pass props to the `<button>` element.                                                                           |
| children           | JSX      | Pass children to the component to render them as children of the implicit `<button>` element.                     |
| className          | String   | Set the `<li>` element's class.                                                                                  |
| index              | Number   | This needs to be a unique identifier for the `<li>` element. Used to set the gallery's active item to the associated pagination item button clicked. |
| onClick            | Function | This is a curried callback function to hook into the `onClick` handler on the `<button>` element. The curried callback returns an object containing `{event,index}`. `event` is a `MouseClickEvent` and `index` is the index of the *PaginationItem*.                                 |

**Example usage of `onClick` render props**
```jsx
const handlePaginationItemClick = ({event, index}) => {
  console.log(event, index)
}

<GalleryPagination
  renderPaginationItem={({ index, active }) => (
    <GalleryPaginationItem index={index} active={active} key={index} onClick={handlePaginationItemClick}>
      <span>{index + 1}</span>
    </GalleryPaginationItem>
  )}
/>
```

## Accessibility

The gallery component handles tabbing, focus management, and live-region announcements out-of-the-box. All relevant patterns used in this component follow the guidelines for carousels as documented by the [Web Accessibility Initiative](https://www.w3.org/WAI/).

That said, you must still code responsibly! Ensure that your gallery contents, nav buttons, and pagination items all have discernible text — whether that be image `alt` text, or [visually-hidden](https://css-tricks.com/inclusively-hidden/) text intended for screen readers (the stylesheet included with the Gallery component inclues a CSS utility class for this: `.gallery-util-visually-hidden`).

Regarding the ARIA-live text, check out the section on this gallery's [`ariaLiveText`](#arialivetext) prop.

### Reduced motion

For reduced motion implementations, you can detect the user's preference via the `matchMedia` API, and adjust the CSS custom property, `--duration` on the `.gallery` selector. Check out the example below, which adds a style tag to the gallery, and overrides the `--duration` property based on the preference. You could also do this via a conditional className, if you prefer. An alternative is be to pass this `prefersReducedMotion` value as a prop, which could be helpful if you use the Styled Components library.

```jsx
const YourGallery = () => {
  // Get the user's motion preference:
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  // Create an inline style object
  const style = {
    "--duration": prefersReducedMotion ? "0s" : "0.5s",
  }

  return (
    // Pass the style overrides to the <Gallery> component
    <Gallery items={GALLERY_ITEMS} style={style}>
      <GalleryMain
        renderGalleryItem={({ item }) => <img src={item.image} alt={item.alt} />}
      />
      // ...etc
    </Gallery>
  )
}
```

## useGallery hook

The gallery package exposes a `useGallery` React hook. It returns a single object, the properties of which are outlined below:

| Property                 | Type      | Description                                                                                                                                                                                  |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activeIndex              | Number    | The index of the currently-active gallery item.                                                                                                                                              |
| draggable                | Boolean   | The value of the `<Gallery>'s` `draggable` prop.                                                                                                                                             |
| galleryItems             | Array     | The array of items as passed to the `<Gallery>`'s `items` prop.                                                                                                                              |
| goToIndex                | Function  | Receives a single argument (Number), and sets the gallery's active item to the item at that index. Subsequently fires the `onChange` function, if one exists.                                |
| itemNodes                | React Ref | A React Ref, the `current` property of which is bound to an Array of the actual Gallery item DOM nodes.                                                                                      |
| loop                     | Boolean   | The value of the `<Gallery>'s` `loop` prop.                                                                                                                                                  |
| next                     | Function  | Increments the gallery's active index, if possible. Subsequently fires the `onChange` function, if one exists.                                                                               |
| onChange                 | Function  | The value of the `<Gallery>'s` `onChange` prop. For more information, refer to the [onChange](#onchange) section.                                                                            |
| previous                 | Function  | Decrements the gallery's active index, if possible. Subsequently fires the `onChange` function, if one exists.                                                                               |
| previouslyActiveIndex    | Number    | The index of the previously-active gallery item.                                                                                                                                             |
| setActiveIndex           | Function  | Receives a single argument (Number), and sets the gallery's active item to the item at that index. **Does not** fire the `onChange` function. It is best to use `goToIndex` instead.         |
| setPreviouslyActiveIndex | Function  | Receives a single argument (Number), and sets the gallery's previously active item index.                                                                                                    |
| setTouchState            | Function  | State setter function, as defined by React's `useState` hook. Expects a `touchState` object — for more information, print the `touchState` variable returned from this hook in your console. |
| startIndex               | Number    | The value of the `<Gallery>'s` `startIndex` prop.                                                                                                                                            |
| swipeThreshold           | Number    | An integer specifying the minimum number of pixels a user has to drag their pointer before a gallery item change is registered.                                                              |
| touchState               | Object    | Data pertaining to a pointer action, if the `<Gallery>'s` `draggable` prop is set to `true`. Print this variable to your console for more information.                                       |
| visibleRange             | Number    | The value of the `<Gallery>'s` `visibleRange` prop.                                                                                                                                          |

### Advanced customization

As you can see above, many of the properties returned by the `useGallery` hook provide the lower-level functionality for the gallery itself. You can use this data to create any custom implementation you like, without having to worry too much about what's happening behind the scenes.

### Usage

Here's an example of a custom component that uses the `useGallery` hook to simply render a paragraph with some information about the gallery's current state:

```jsx
import { useGallery } from "@wethegit/react-gallery"

const GalleryInfo = () => {
  const { activeIndex, previouslyActiveIndex, loop } = useGallery()

  return (
    <p>
      The gallery's current index is {activeIndex}, its last index was {previouslyActiveIndex},
      and its <code>loop</code> prop is set to {String(loop)}!
    </p>
  )
}

export default GalleryInfo
```
