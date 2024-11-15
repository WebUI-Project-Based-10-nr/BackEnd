const isObjectIdValid = require('~/utils/objectIdValidation')
const quizService = require('~/services/quiz')

class QuizController {
  async getQuizById(req, res) {
    const quizId = req.params.id

    isObjectIdValid(quizId)

    const quiz = await quizService.getQuizById(quizId)
    res.json(quiz)
  }
}

module.exports = new QuizController()
