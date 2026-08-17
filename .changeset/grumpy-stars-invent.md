---
"@wethegit/react-gallery": major
---

- Fixes a broken `onClick` prop/callback on GalleryPaginationItem.
- Introduces the `itemTag` and `decorativeOnly` props on GalleryPaginationItem.
- Updates the documentation to reflect these changes and resolves discrepancies.
- Renames `--gap` to `--inline-gap` css variable to better convey intent.
- Removes unused class names from `galleryItem`.
- Introduces `data-item-visible` and `data-was-active` attributes
- Upgrades Vite to 7.3.6 and addresses dependency vulnerabilities.
- Updates the Vite config to preserve the CSS output file name.
- Updates `.nvrmc` to the latest LTS.
