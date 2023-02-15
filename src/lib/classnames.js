const classnames = (classes = []) => {
  if (!classes || !Array.isArray(classes) || !classes.length) return null

  let output = []

  classes.forEach((arg) => {
    if (typeof arg === "string") output.push(arg)
  })

  return output.join(" ")
}

export default classnames
