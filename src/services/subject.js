const Subject = require('~/models/subject')

const subjectService = {
  getNamesByCategoryId: async (match) => {
    return Subject.find(match).select('name').lean().exec()
  },

  deleteSubjectById: async (categoryId, subjectId) => {
    if (!subjectId || !categoryId) {
      throw new Error('Invalid subject or category ID')
    }

    if (!subjectId.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Invalid subject ID format')
      error.statusCode = 400
      throw error
    }

    const subject = await Subject.findOne({ _id: subjectId, categoryId })
    if (!subject) {
      const error = new Error('Subject not found')
      error.statusCode = 404
      throw error
    }

    await Subject.findByIdAndDelete(subjectId)
    return { message: 'Subject successfully deleted' }
  }
}

module.exports = subjectService
