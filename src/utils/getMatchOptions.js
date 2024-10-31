const getMatchOptions = (filters) => {
  const match = {}

  for (let [key, value] of Object.entries(filters)) {
    if (value) {
      if (key === 'title') {
        match[key] = { $regex: new RegExp(value, 'i') }
      } else {
        match[key] = value
      }
    }
  }

  return match
}

module.exports = getMatchOptions
