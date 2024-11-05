const Subject = require('~/models/subject')

const subjectService = {
  getSubjectById: async (id) => {
    return await Subject.findById(id).lean()
  },

  getNamesByCategoryId: async (match) => {
    return Subject.find(match).select('name').lean().exec()
  }
}

module.exports = subjectService
