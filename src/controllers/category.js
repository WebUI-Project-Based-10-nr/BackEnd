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

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getCategoryById,
  getCategoriesNames,
  addCategory,
  getCategories
}
