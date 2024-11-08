const Category = require('~/models/category')
const capitalizeFirstLetter = require('~/utils/capitalizeFirstLetter')

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

  addCategory: async (data) => {
    let { name, appearance } = data
    return await Category.create({ name, appearance })
  }
}

module.exports = categoryService
