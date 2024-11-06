const categoryService = require('~/services/category')
const parseQueryInt = require('~/utils/parseQueryInt')

const getCategories = async (req, res) => {
  const skip = parseQueryInt(req.query.skip, 0)
  const limit = parseQueryInt(req.query.limit, 0)

  const categories = await categoryService.getCategories(skip, limit)

  res.status(200).json(categories)
}

const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

const addCategory = async (req, res) => {
  const data = req.body

  const newCategory = await categoryService.addCategory(data)

  res.status(200).json(newCategory)
}

module.exports = {
  getCategoriesNames,
  addCategory,
  getCategories
}
