# @wethegit/react-gallery

## 5.0.1

### Patch Changes

- 819e5c2: Fix the lost focus in Safari when the pressed nav button is disabled

## 5.0.0

### Major Changes

- 09474c5: - Fixes a broken `onClick` prop/callback on GalleryPaginationItem.
  - Introduces the `itemTag` and `decorativeOnly` props on GalleryPaginationItem.
  - Updates the documentation to reflect these changes and resolves discrepancies.
  - Renames `--gap` to `--inline-gap` css variable to better convey intent.
  - Removes unused class names from `galleryItem`.
  - Introduces `data-item-visible` and `data-was-active` attributes
  - Upgrades Vite to 7.3.6 and addresses dependency vulnerabilities.
  - Updates the Vite config to preserve the CSS output file name.
  - Updates `.nvrmc` to the latest LTS.

## 4.0.5

### Patch Changes

- fd9c678: Ensures that the `dist/` directory is removed before running a build. Users were seeing unwanted artifacts with conflicting React dependencies.

## 4.0.3

### Patch Changes

- 1535d2f: Fix gallery item getting stuck
