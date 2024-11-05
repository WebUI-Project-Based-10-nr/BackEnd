const Category = require('~/models/category')

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
  }
}

module.exports = categoryService
