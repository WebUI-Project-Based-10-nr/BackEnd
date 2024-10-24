const Subject = require('~/models/subject')

const subjectService = {
  getNamesByCategoryId: async (match) => {
    return Subject.find(match).select('name').lean().exec()
  }
}

module.exports = subjectService
