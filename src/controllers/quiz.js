const isObjectIdValid = require('~/utils/objectIdValidation')
const quizService = require('~/services/quiz')

class QuizController {
  async getQuizById(req, res) {
    const quizId = req.params.id
    const author = req.user.id

    isObjectIdValid(quizId)

    const quiz = await quizService.getQuizById(quizId, author)
    res.json(quiz)
  }
}

module.exports = new QuizController()
