const Quiz = require('~/models/quiz')
const { createForbiddenError, createNotFoundError } = require('~/utils/errorsHelper')

class QuizService {
  async getQuizById(quizId, author) {
    const quiz = Quiz.findById(quizId)

    if (!quiz) {
      throw createNotFoundError()
    }

    if (quiz.author.toString() !== author) {
      throw createForbiddenError()
    }

    return quiz
  }
}

module.exports = new QuizService()
