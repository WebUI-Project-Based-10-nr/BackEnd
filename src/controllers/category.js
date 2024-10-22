const categoryService = require('~/services/category')

const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

module.exports = {
  getCategoriesNames
}
