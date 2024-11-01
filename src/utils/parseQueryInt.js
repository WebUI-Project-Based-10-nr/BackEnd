const parseQueryInt = (value, defaultValue) => {
  const parsedValue = parseInt(value)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

module.exports = parseQueryInt
