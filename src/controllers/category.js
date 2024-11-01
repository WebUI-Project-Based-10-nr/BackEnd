const categoryService = require('~/services/category')

const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

const addCategory = async (req, res) => {
  const data = req.body
  const newCategory = await categoryService.addCategory(data)

  res.status(201).json(newCategory)
}

module.exports = {
  getCategoriesNames,
  addCategory
}
