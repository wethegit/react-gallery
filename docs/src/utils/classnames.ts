export type ClassnamesProps =
  boolean | string | number | object | undefined | null | ClassnamesProps[]

export function classnames(classes: ClassnamesProps): string {
  if (
    !classes ||
    typeof classes === "boolean" ||
    typeof classes === "number" ||
    (typeof classes === "object" && !Array.isArray(classes))
  )
    return ""

  if (!Array.isArray(classes)) return classes

  return classes
    .flat(2)
    .filter((c) => typeof c === "string")
    .join(" ")
}
