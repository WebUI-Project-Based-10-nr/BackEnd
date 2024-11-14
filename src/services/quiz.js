const Quiz = require('~/models/quiz')
const { createNotFoundError, createForbiddenError } = require('~/utils/errorsHelper')

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

  async updateQuiz(author, quizId, data) {
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      throw createNotFoundError()
    }

    if (quiz.author.toString() !== author) {
      throw createForbiddenError()
    }

    const allowedUpdates = ['title', 'description']

    for (const key of allowedUpdates) {
      if (key in data) {
        quiz[key] = data[key]
      }
    }

    await quiz.save()
    return quiz
  }
}

module.exports = { quizService: new QuizService() }
