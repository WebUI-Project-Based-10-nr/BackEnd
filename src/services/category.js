const Category = require('~/models/category')
const { createNotFoundError } = require('~/utils/errorsHelper')

const categoryService = {
  getCategories: async (skip = 0, limit = 10) => {
    const [items, count] = await Promise.all([
      Category.find().skip(skip).limit(limit).exec(),
      Category.countDocuments()
    ])

    return { items, count }
  },
  getCategoriesNames: async () => {
    return Category.find({}, 'name')
  },
  getCategoryById: async (categoryId) => {
    const category = await Category.findById(categoryId)

    if (!category) {
      throw createNotFoundError()
    }

    return category
  }
}

module.exports = categoryService
