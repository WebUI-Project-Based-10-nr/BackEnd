const getCategoriesOptions = (categories) => {
  if (Array.isArray(categories)) {
    return categories.map((item) => (item === 'null' ? null : item))
  } else if (typeof categories === 'string') {
    return categories === 'null' ? [null] : [categories]
  }
}

module.exports = getCategoriesOptions
