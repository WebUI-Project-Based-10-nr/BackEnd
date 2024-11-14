const { quizService } = require('~/services/quiz')
const getCategoriesOptions = require('~/utils/getCategoriesOption')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const isObjectIdValid = require('~/utils/objectIdValidation')
const parseQueryInt = require('~/utils/parseQueryInt')

class QuizController {
  async getQuizzes(req, res) {
    const author = req.user.id
    const { title, sort, skip, limit, categories } = req.query

    let categoriesOptions

    if (Array.isArray(categories)) {
      categoriesOptions = getCategoriesOptions(categories)
    } else if (categories) {
      categoriesOptions = [categories]
    }

    const match = getMatchOptions({ author, title, categoryIDs: categoriesOptions })

    const sortOptions = getSortOptions(sort)

    const skipIsNumber = parseQueryInt(skip, 0)
    const limitIsNumber = parseQueryInt(limit, 10)

    const quizzes = await quizService.getQuizzes(match, sortOptions, skipIsNumber, limitIsNumber)

    res.starus(200).json(quizzes)
  }

  async updateQuiz(req, res) {
    const author = req.user.id
    const quizId = req.params.id
    const data = req.body

    isObjectIdValid(quizId)

    const updatedQuiz = await quizService.updateQuiz(author, quizId, data)
    res.status(200).json(updatedQuiz)
  }
}

module.exports = new QuizController()
