const categoryService = require('~/services/category')

const getCategories = async (req, res) => {
  const skip = isNaN(parseInt(req.query.skip)) ? undefined : parseInt(req.query.skip)
  const limit = isNaN(parseInt(req.query.limit)) ? undefined : parseInt(req.query.limit)

  const categories = await categoryService.getCategories(skip, limit)

  res.status(200).json(categories)
}

const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

module.exports = {
  getCategories,
  getCategoriesNames
}
