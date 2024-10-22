const Category = require('~/models/category')

const categoryService = {
  getCategoriesNames: async () => {
    return await Category.find({})
  }
}

module.exports = categoryService
