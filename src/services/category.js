const Category = require('~/models/category')
const capitalizeFirstLetter = require('~/utils/capitalizeFirstLetter')

const categoryService = {
  getCategoriesNames: async () => {
    return Category.find({}, 'name')
  },

  addCategory: async (data) => {
    let { name, appearance } = data

    name = capitalizeFirstLetter(name)

    return await Category.create({ name, appearance })
  }
}

module.exports = categoryService
