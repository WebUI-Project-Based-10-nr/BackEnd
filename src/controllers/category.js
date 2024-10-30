const categoryService = require('~/services/category')

const getCategories = async (req, res) => {
  const { skip, limit } = req.query

  const categories = await categoryService.getCategories(parseInt(skip), parseInt(limit))

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
