const router = require('express').Router()

const Question = require('~/models/question')

const questionController = require('~/controllers/question')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const {
  roles: { TUTOR }
} = require('~/consts/auth')

router.use(authMiddleware)
router.param('id', idValidation)
const params = [{ model: Question, idName: 'id' }]

router.get('/', asyncWrapper(questionController.getQuestions))
router.get('/:questionId', isEntityValid({ params }), asyncWrapper(questionController.getQuestionById))
router.use(restrictTo(TUTOR))
router.post('/', asyncWrapper(questionController.createQuestion))
router.delete('/:id', isEntityValid({ params }), asyncWrapper(questionController.deleteQuestion))
router.patch('/:id', isEntityValid({ params }), asyncWrapper(questionController.updateQuestion))

module.exports = router
