const Quiz = require('~/models/quiz')
const { createNotFoundError } = require('~/utils/errorsHelper')

class QuizService {
  async getQuizById(quizId) {
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      throw createNotFoundError()
    }

    return quiz
  }
}

module.exports = new QuizService()
