const Category = require('~/models/category')

const categoryService = {
  getCategoriesNames: async () => {
    return Category.find({}, 'name')
  }
}

module.exports = categoryService
