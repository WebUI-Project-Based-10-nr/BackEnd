const Quiz = require('~/models/quiz')

class QuizService {
  async getQuizzes(match, sort, skip = 0, limit = 10) {
    const items = await Quiz.find(match)
      .collation({ locale: 'en', strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({ path: 'category', select: '_id name' })
      .exec()

    const totalCount = await Quiz.countDocuments(match)

    return { items, count: totalCount }
  }
}

module.exports = { quizService: new QuizService() }
