const Subject = require('~/models/subject')

const subjectService = {
  getSubjectById: async (id) => {
    return await Subject.findById(id).lean()
  },

  getNamesByCategoryId: async (match) => {
    return Subject.find(match).select('name').lean().exec()
  },

  getSubjects: async (skip = 0, limit = 10) => {
    const [items, count] = await Promise.all([
      Subject.find().skip(skip).limit(limit).lean().exec(),
      Subject.countDocuments()
    ])

    return { items, count }
  }
}

module.exports = subjectService
