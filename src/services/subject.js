const Subject = require('~/models/subject')

const subjectService = {
  getNamesByCategoryId: async (match) => {
    return await Subject.find(match).select('name').lean().exec()
  }
}

module.exports = subjectService
