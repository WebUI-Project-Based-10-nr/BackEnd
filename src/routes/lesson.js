const router = require('express').Router()
const { authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const Lesson = require('~/models/lesson')
const lessonController = require('../controllers/lesson')

const params = [{ model: Lesson, idName: 'id' }]

router.use(authMiddleware)
router.get('/', asyncWrapper(lessonController.getLessons))
router.get('/:id', isEntityValid(params), asyncWrapper(lessonController.getLessonById))
router.post('/', asyncWrapper(lessonController.createLesson))
router.delete('/:id', isEntityValid(params), asyncWrapper(lessonController.deleteLesson))
router.patch('/:id', isEntityValid(params), asyncWrapper(lessonController.updateLesson))

module.exports = router
